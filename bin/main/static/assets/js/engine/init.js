﻿﻿﻿﻿﻿﻿﻿﻿﻿var ENGINE_FILE_NAME = 'XDWorldEM';
var ENGINE_FILE_DIR = '';
var MAP_CONTAINER = null;
var MAP_LOAD_CALLBACK = null;
var Module = null;
﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿
Module = {
	locateFile : function(s) {
		return "//cdn.xdworld.kr/latest/"+ s;
	},
	postRun: function() {
		var httpPort = "";
		if(window.location.protocol != "https:") {
			httpPort = ":8080";
		}

		Module.XDESetDemUrlLayerNameEX("xdworld.vworld.kr"+httpPort, "/XDServer", "dem");
		Module.XDESetSatUrlLayerNameEX("xdworld.vworld.kr"+httpPort, "/XDServer", "tile");
		var container = document.getElementById("MapContainer");
		var url = "//xdworld.vworld.kr";	
		if(window.location.protocol != "https:") url += ":8080"	
		Module.initialize({	
		    container: container,	
			terrain : {	
				dem : {	
					url : "https://3dmap.egiscloud.com",	
					name : "dem",	
					encoding : false,	
					servername : "XDServer"	
				},	
				image : {	
					url : "https://basemap.egiscloud.com",	
					name : "EGIS_hMap_World",	
					servername : "XDServer"	
					},	
				},	
			worker : {	
				path : ENGINE_FILE_DIR +  "XDWorldWorker.js",	
				count : 5,	
				use : false,	
			},	
      		defaultKey : "ezbBD(h2eFCmDQFQd9QpdzDS#zJRdJDm4!Epe(a2EzcbEzb2"	
		});
		canvas.style.position = "";
		canvas.addEventListener("Fire_EventRotateCompass", function(e){
			var compassDiv = $("#geoCompass");
			if (typeof compassDiv != "undefined"){
				var str = "rotate("+(-e.dCameraHeadAngle)+"deg)";
				$("#geoCompass").css("transform",str);
			}
		});

		Module.getNavigation().setNaviVisible(false);
		
		$(".noScroll").mouseover(function() {
			Module.XDIsMouseOverDiv(true);
		})
		.mouseout(function() {
			Module.XDIsMouseOverDiv(false);
		});
		Module.canvas.addEventListener("mouseout",function(e) {
			if(!$(e.toElement).hasClass("nvtooltip") && $(e.toElement).parents(".nvtooltip").length == 0){
				Module.getControl().mouseLeftButtonDown = false;
				Module.getControl().mouseRightButtonDown = false;
			}
		});
		// 키 입력 disabled sumin 201218
		var control = Module.getControl();
		control.setKeyRotMode(false);
		control.setKeyZoomMode(false);
		control.setKeyPanMode(false);
		
		// 피킹 방식 설정(컬러맵, 속도개선) sumin 201228
		Module.getOption().setPickingCalculateType(true);
	
		// 텍스쳐 수신 용량 제한 해제
		Module.getOption().setTextureCapacityLimit(false);
		
		IDE.MAP.DEFAULT.init();
		if(D_MEMBER.DLID==11){
			dtcLayer.callLayerInfo(5861);
			var data={	
				dataId:5421	
			}	
				
			$.ajax({	
				url:'./ide/callLayerInfo.do',	
				type:'POST',	
				data:data,	
				dataType:'json',	
				success:function(result){	
					if(result.INFO.data_type=="S"){	
						dtcLayer.SHP.addLayer(result);	
					}	
				}	
			})	
		}
		COMMON.unblockUIdiv("MapContainer");
		D_TRASLATION.init('dt_index',D_TRASLATION.global.userLanguage);
		if(getCookie("tutorialPopup") != "N"){
			if(D_TRASLATION.global.userLanguage != "ko") {
				$("#tutorialPopup").removeClass("kor");
				$("#tutorialPopup").addClass("eng");
			}
			$("#tutorialPopup").show();
		}
		if(window.location.href.indexOf("gallery.do") > -1){
			//dtcBasicLayer.init();
			dtcCom.init();
		}
		else if(window.location.href.indexOf("galleryView.do") > -1){
			dtcBasicLayer.init();
		}
		else if(window.location.href.indexOf("loadMapInfo.do") > -1){
			dtcCom.init();
			dtcCom.loadMapInfo();
		}
		else dtcCom.init();
	}
};

;(function(){
	
	var currentScript = document.currentScript;
	var scriptSRC = currentScript.src;
	ENGINE_FILE_DIR = scriptSRC.substring(0, scriptSRC.lastIndexOf('/')) + "/";
	
	if (currentScript.attributes.container) {
		var containerID = currentScript.attributes.container.value;
		MAP_CONTAINER = document.getElementById(containerID);
	}
	
	if (currentScript.attributes.loadcallback) {
		var callbackFuncName = currentScript.attributes.loadcallback.value;
		if (typeof window[callbackFuncName] == 'function') {
			MAP_LOAD_CALLBACK = window[callbackFuncName];
		}
	}
		
	COMMON.blockUIdiv("MapContainer","LOADING");
	var script = document.createElement('script');
	if($("#mid").val() == '707') {
		ENGINE_FILE_DIR += "latest/";
		ENGINE_FILE_DIR = window.location.origin+"/siteData/app/M_ADDR_INFO/engine/";
		script.src = ENGINE_FILE_DIR + ENGINE_FILE_NAME + ".js";	
	}else{
		script.src = "//cdn.xdworld.kr/latest/XDWorldEM.js";
	}
	document.body.appendChild(script);
})();

window.onresize = function() {
	
	Module.Resize($("#MapContainer").width(), $("#MapContainer").height());
		
	Module.XDRenderData();
	
	$("#analysBtnDiv").css("height","");
	var height = $("#analysBtn-items").css("height");

	if(window.innerHeight < parseInt(height)){
		$("#analysBtnDiv").css("height",window.innerHeight - 200);
		$("#analysBtn-items .dropdown-menu").css("height",window.innerHeight - 200);
	}
	if(document.getElementById('analysBtnDiv') != null) new PerfectScrollbar(document.getElementById('analysBtnDiv'));
	$("#analysBtn-items .dropdown-menu").each(function(index,item){
		new PerfectScrollbar(item);
	});
};
