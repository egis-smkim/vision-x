// Auto update layout
(function() {
	//window.layoutHelpers.setAutoUpdate(true);
	
	
})();

var IDE = {
	itv:null,
	canvas:null,
	init:function() {
		IDE.UI.SIDE_PANEL.slideOn();
	},
	UI:{
		SIDE_PANEL:{
			isOn:true, // 분석 리스트 On|Off
			slideOff:function() {
				
				
				$("#analysisMenuPanelWrap").animate({
					left:"-100px"
				}, 400, function() {
					$("#analysisMenuPanelSlideOffWrap").css("display", "block");
					IDE.UI.SIDE_PANEL.isOn = false;
					
					IDE.MODULE.PROPERTY.movePosition();
				});
				
			},
			slideOn:function() {
				IDE.UI.SIDE_PANEL.isOn = true;
				
				IDE.MODULE.PROPERTY.movePosition();
				
				$("#analysisMenuPanelSlideOffWrap").css("display", "none");
				
				$("#analysisMenuPanelWrap").animate({
					left:"0px"
				}, 400, function() {
					
				});
			}
		},
		MODULE_PANEL:{
			slideDown:function() {
				$("#moduleInterfaceBaseWrap").css("display", "none");
				$("#moduleUISlideUpWrap").css("display", "block");
			},
			slideUp:function() {
				$("#moduleUISlideUpWrap").css("display", "none");
				$("#moduleInterfaceBaseWrap").css("display", "block");
			}
		}
	},
	MAP:{
		DATA:{
		
		}
	},
	BASEMAP:{
		callBaseMapList:function() {
			$("#baseMapListWrap").css("display", "block");
		},
		closeBaseMapList:function() {
			$("#baseMapListWrap").css("display", "none");
		}
	},
	LAYER:{
		
	},
	USER:{
		
	},
	PLACE:{
		
	},
	MAPTOOL:{
		goHome:function() {
			Module.getViewCamera().setViewAt(127, 38, 6378137*3, 90, 0);
			Module.XDRenderData();
		}
	},
	MODULE:{
		execs:[],// 현재 종료되지 않은 모듈 번호
		front:null, // 현재 실행중인 모듈 번호 
		PROPERTY:{
			propertyOn:true,
			// 모듈별 설정 윈도우 컨트롤,
			resetProperty:function(m) {
				
			},
			movePosition:function() {
				
				if(IDE.MODULE.front == null) return;
				
				var target = IDE.MODULE.PROPERTY.getFrontTargetWrap();
				
				//console.log(target);
				
				switch(IDE.MODULE.front) {
					case 1:
						if(IDE.UI.SIDE_PANEL.isOn) {
							$("#"+target).css("left", "82px");
						} else {
							$("#"+target).css("left", "38px");
						}
					break;
				}
				
				
			},
			getFrontTargetWrap:function() {
				var target = "";
				
				switch(IDE.MODULE.front) {
					case 1:
						// 건물 편집
						target = "moduleEditBuildingWrap";
					break;
					
					case 2:
						target = "";
					break;
				}
				
				return target;
			},
			getSelectPropertyWrap:function(m) {
				var target = "";
				
				switch(m) {
					case 1:
						// 건물 편집
						target = "moduleEditBuildingWrap";
					break;
					
					case 2:
						target = "";
					break;
				}
				
				return target;
			},
			slideOnPropertyWindow:function(m) {
				var target = IDE.MODULE.PROPERTY.getSelectPropertyWrap(m);
				
				IDE.MODULE.PROPERTY.propertyOn = true;
				
				$("#modulePropertyIconWrap_"+m).remove();
				$("#"+target).css("display", "block");
			},
			slideOffPropertyWindow:function(m) {
				
				var target = IDE.MODULE.PROPERTY.getSelectPropertyWrap(m);
				
				var html = "";
				html += "<li onClick=\"JavaScript:IDE.MODULE.PROPERTY.slideOnPropertyWindow("+m+");\" id=\"modulePropertyIconWrap_"+m+"\" class=\"m-l-3\">\n";
				html += "	<button type=\"button\" class=\"btn icon-btn btn-sm btn-dark\" id=\"modulePropertyIcon_"+m+"\">\n";
				html += "		<i class=\"ion ion-md-settings\"></i>\n";
				html += "	</button>\n";
				html += "</li>\n";
				
				$("#analysisModuleBtnWrap_"+m).after(html);
				$("#"+target).css("display", "none");
				
				IDE.MODULE.PROPERTY.propertyOn = false;
			}
		},
		callModule:function(m) {
			
			if(m == IDE.MODULE.front) {
				return;
			}
			
			IDE.MODULE.loadMobule(m);
		},
		callFront:function(m) {

			if(IDE.MODULE.front == m) {
				
				if(!$("#analysisCloseModuleBtn_"+m).exists()) {
					var html = "";
					html += "<li onClick=\"JavaScript:IDE.MODULE.removeModuleInterface("+m+");\" id=\"analysisCloseModuleBtnWrap_"+m+"\">\n";
					html += "	<button type=\"button\" class=\"btn icon-btn btn-sm btn-danger\" id=\"analysisCloseModuleBtn_"+m+"\">\n";
					html += "		<i class=\"fas fa-times\"></i>\n";
					html += "	</button>\n";
					html += "</li>\n";
					
					$("#analysisModuleBtnWrap_"+IDE.MODULE.front).append(html);
				} else {
					$("#analysisCloseModuleBtnWrap_"+m).remove();
				}
				
				
			} else {
				
				if(IDE.MODULE.front != null) {
					$("#analysisModuleBtn_"+IDE.MODULE.front).removeClass("btn-info");
					$("#analysisModuleBtn_"+IDE.MODULE.front).addClass("btn-dark");
					
					IDE.MODULE.front = m;
					
					$("#analysisModuleBtn_"+IDE.MODULE.front).removeClass("btn-dark");
					$("#analysisModuleBtn_"+IDE.MODULE.front).addClass("btn-info");
				}
			}
			
			
		},
		initModuleInterface:function(m) {
			
			for(var i = 0; i < IDE.MODULE.execs.length; i++) {
				if(IDE.MODULE.execs[i] == m) {
					// call front selecte module
					IDE.MODULE.callFront(m);
					return;
				}
			}
			
			if(IDE.MODULE.front != null) {
				$("#analysisModuleBtn_"+IDE.MODULE.front).removeClass("btn-info");
				$("#analysisModuleBtn_"+IDE.MODULE.front).addClass("btn-dark");
			}
			
			switch(m) {
				case 1:
					var html = "";
					html += "<li onClick=\"JavaScript:IDE.MODULE.callFront("+m+");\" id=\"analysisModuleBtnWrap_"+m+"\">\n";
					html += "	<button type=\"button\" class=\"btn icon-btn btn-sm btn-info\" id=\"analysisModuleBtn_"+m+"\">\n";
					html += "		<i class=\"far fa-building\"></i>\n";
					html += "	</button>\n";
					html += "</li>\n";
					
					$("#executeModuleListUL").append(html);
					
					$("#moduleEditBuildingWrap").css("display", "block");
					
				break;
				
				case 2:
					var html = "";
					html += "<li onClick=\"JavaScript:IDE.MODULE.callFront("+m+");\" id=\"analysisModuleBtnWrap_"+m+"\">\n";
					html += "	<button type=\"button\" class=\"btn icon-btn btn-sm btn-info\" id=\"analysisModuleBtn_"+m+"\">\n";
					html += "		<i class=\"fa fa-adjust\"></i>\n";
					html += "	</button>\n";
					html += "</li>\n";
					
					$("#executeModuleListUL").append(html);

				break;
			}
			
			IDE.MODULE.front = m;
			
			IDE.MODULE.execs.push(m);
			IDE.UI.SIDE_PANEL.slideOff();
			
		},
		removeModuleInterface:function(m) {
			$("#analysisModuleBtnWrap_"+m).remove();
			$("#analysisCloseModuleBtnWrap_"+m).remove();
			$("#modulePropertyIconWrap_"+m).remove();
			
			var target = IDE.MODULE.PROPERTY.getFrontTargetWrap();
			
			$("#"+target).css("display", "none");
			
			//IDE.MODULE.execs.push(m);
			
			IDE.MODULE.execs.splice(IDE.MODULE.execs.indexOf(m), 1);
			
			if(IDE.MODULE.execs.length > 0) {
				IDE.MODULE.callFront(IDE.MODULE.execs[0]);
			} else {
				
				IDE.MODULE.front = null;
			}
			
		},
		loadMobule:function(m) {
			
			// checking beforeExecute
			for(var i = 0; i < IDE.MODULE.execs.length; i++) {
				if(IDE.MODULE.execs[i] == m) {
					// call front selecte module
					IDE.MODULE.initModuleInterface(m);
					
					for(var i = 0; i < IDE.MODULE.execs.length; i++) {
						//console.log($("#navs-analy-"+i+"-link"));
						$("#navs-analy-"+IDE.MODULE.execs[i]+"-link").removeClass("active");
						
						$("#navs-analy-"+IDE.MODULE.execs[i]).removeClass("show active");
						
					}
					
					$("#navs-analy-"+m+"-link").addClass("active");
					$("#navs-analy-"+m).addClass("show active");
					
					
					return;
				}
			}
			
			//console.log(IDE.MODULE.execs);
			// reset nav tab
			for(var i = 0; i < IDE.MODULE.execs.length; i++) {
				//console.log($("#navs-analy-"+i+"-link"));
				$("#navs-analy-"+IDE.MODULE.execs[i]+"-link").removeClass("active");
				
				$("#navs-analy-"+IDE.MODULE.execs[i]).removeClass("show active");
				
			}
			
			var jsSrc = null;
			var htmlSrc = null;
			var cssSrc = null;
			var moduleObj = null;
			
			// 컨트롤러에 AID(m) 로 조회하여 분석정보 받음
			/*
			 * 분석명
			 * 각 모듈 파일명
			 */
			switch(m) {
				case 1:
					// 건물편집
					jsSrc = "M_EDITBUILDING.js";
					cssSrc = "M_EDITBUILDING.css";
					htmlSrc = "M_EDITBUILDING.html";
					moduleObj = "M_EDITBUILDING";
				break;
				
				case 2:
					// 그림자
					jsSrc = "M_SHADOW.js";
					cssSrc = "M_SHADOW.css";
					htmlSrc = "M_SHADOW.html";
					moduleObj = "M_SHADOW";
				break;
				
				case 3:
					// 바람길
					jsSrc = "M_WIND.js";
					cssSrc = "M_WIND.css";
					htmlSrc = "M_WIND.html";
					moduleObj = "M_WIND";
				break;
			}
			
			var t_title = ["", "건물편집", "그림자분석", "바람길분석"]
			
			
			// Create Tab
			var html = "";
			html += "<li class=\"nav-item\">\n";
			html += "\t<a class=\"nav-link\" data-toggle=\"tab\" href=\"#navs-analy-"+m+"\" style=\"display:inline;\" id=\"navs-analy-"+m+"-link\">"+t_title[m]+" <button type=\"button\" class=\"btn btn-xs rounded-pill borderless\"><i class=\"fas fa-times-circle\"></i></button></a>\n";
			html += "</li>\n";
			
			$("#moduleUITabUL").append(html);
			
			var html = "";
			html += "<div class=\"tab-pane fade\" id=\"navs-analy-"+m+"\">\n";
			html += "\t<div class=\"card-body p-10\" id=\"analy_"+m+"_body\">\n";
			html += "\t</div>\n";
			html += "</div>\n";
			
			$("#moduleUITabContent").append(html);

			/* css, html, js 순서로 load */
			
			if(cssSrc != null) {
				// load html
				$("#analy_"+m+"_body").load("/digitalTwin/assets/js/module/"+htmlSrc, function() {
					
					$.loadCSS("/digitalTwin/assets/js/module/"+cssSrc, function() {
						$.getScript("/digitalTwin/assets/js/module/"+jsSrc, function() {
							// Module load finish
							
							IDE.MODULE.execs.push(m);
							$("#navs-analy-"+m+"-link").addClass("active");
							$("#navs-analy-"+m).addClass("show active");
							
							var html = "";
							html += "<div class=\"moduleUISlideDownWrap\">\n";
							html += "\t<a href=\"JavaScript:IDE.UI.MODULE_PANEL.slideDown();\"><button type=\"button\" class=\"btn btn-sm btn-dark panelColor rounded-right\" style=\"outline: rgb(255, 255, 255) none 0px;\"><i class=\"fa fa-angle-double-down\"></i></button></a>\n";
							html += "</div>\n";
							
							$("#analy_"+m+"_body").append(html);
							
							
							eval(moduleObj).init();
						});
					});
				});
			} else {
				$("#analy_"+m+"_body").load("/digitalTwin/assets/js/module/"+htmlSrc, function() {
					$.getScript("/digitalTwin/assets/js/module/"+jsSrc, function() {
						// Module load finish
						
						IDE.MODULE.execs.push(m);
						$("#navs-analy-"+m+"-link").addClass("active");
						$("#navs-analy-"+m).addClass("show active");
						
						var html = "";
						html += "<div class=\"moduleUISlideDownWrap\">\n";
						html += "\t<a href=\"JavaScript:IDE.UI.MODULE_PANEL.slideDown();\"><button type=\"button\" class=\"btn btn-sm btn-dark panelColor rounded-right\" style=\"outline: rgb(255, 255, 255) none 0px;\"><i class=\"fa fa-angle-double-down\"></i></button></a>\n";
						html += "</div>\n";
						
						$("#analy_"+m+"_body").append(html);
						
						eval(moduleObj).init();
						
					});
				});
			}
			
			
			$('[data-toggle="tooltip"]').tooltip();
			
		}
	} // Module
}




$(function() {
	
	$('#canvas').bind('contextmenu', function(e) {
	    return false;
	}); 
	
	 $(window).resize(resizeContents);
	 resizeContents();
	 
	 $("#baseMapCurrent").mouseover(function() {
		clearTimeout(IDE.itv); 
	 });
	 
	 $("#baseMapListWrap li").mouseover(function() {
		clearTimeout(IDE.itv); 
	 });
	 
	 $("#baseMapListWrap li").mouseout(function() {
		 IDE.itv = setTimeout(function() {
			 IDE.BASEMAP.closeBaseMapList();
		 }, 2000);
	 });
	 
	 $("#baseMapCurrent").mouseout(function() {
		 IDE.itv = setTimeout(function() {
			 IDE.BASEMAP.closeBaseMapList();
		 }, 2000);
	 });

	setTimeout(function() {
		IDE.init();
		
		$('[data-toggle="tooltip"]').tooltip();
	}, 1500);
	 
});

function resizeContents() {
	$("#ideContent").height($(window).height() - 6);
}

$.fn.exists = function() { return this.length > 0; };

jQuery.loadCSS = function(url, callback) {
    if (!$('link[href="' + url + '"]').length) {
    	$('head').append('<link rel="stylesheet" type="text/css" href="' + url + '">');
    	callback();
    }
}