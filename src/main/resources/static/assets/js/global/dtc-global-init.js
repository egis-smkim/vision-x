//공통 기능
var dtcCom={
	host:"egiscloud.com",
	appid : null,
	moveLon:null,
	moveLat:null,
	moveDistance:null,
	moveAltitude:null,
	model_url:function(){
		var host = window.location.host;
		return url;
	},
	geo_url:function(){
		
		var host= window.location.host;
		var url="2dmap.egiscloud.com/geoserver"
		
		if(host=="218.235.89.19"){
			url="218.235.89.19:8088/geoserver";
		}else if(host=="xdworld.kr"){
			url="geo.xdworld.kr";
		}

		return url;
	},
	global:{
		menuEvnetInit:function(item){
			var movement = 520;
			switch (item) {
				
				case "layerDataLists":
					dtcLayer.instance();
					$("#local-movement").css('left', '500px');
					break;
				
				case "storeAre":
					dtcStore.instance();
					$("#dtcMarketplaceModal").modal();
					$("#marketSide li:nth-child(1) a").click();
					$("#menuArea").hide();
					$("#local-movement").css('left', '60px');
					break;
				
				case "searchAre":
					if(D_TRASLATION.global.userLanguage != 'ko') dtcSearch.Google.instance();
					else dtcSearch.instance();
					$("#local-movement").css('left', '500px');
					break;
			
				case "helpAre":
					var popup = $('.tutorial-wrap');
					var chk = popup.find("input[type=checkbox]").parent();
					chk.hide();
					if(D_TRASLATION.global.userLanguage != "ko") {
						$("#tutorialPopup").removeClass("kor");
						$("#tutorialPopup").addClass("eng");
					}
					$("#menuArea").hide();
					$(".tutorialInquiry").show();
					$("#tutorialPopup").show();
					break;
				
				case "settingAre":
					dtcSetting.instance();
					$("#local-movement").css('left', '500px');
					break;
				case "aiAre":
					dtcAiSetting.instance();
					break;
				case "saveMapAre":
					dtcSaveMap.instance();
					$("#local-movement").css('left', '500px');
					break;

			}
			$('#analysBtn-items').hide();
			$("#"+item).show("slide", { direction: "left" }, 200);
			
			if($("#legendInfo").attr("value") =="left"){
				$("#legendInfo").css('left', movement+'px');
			}

			dtcLayer.global.step=0;
			dtcLayer.global.count=30;
		},
		geocoder:null
	},
	getLoadAllProductList :function(){
		var formData = new FormData();
		formData.append("control", "loadAllProduct");
		
		$.ajax({
			url:"/layer/loadAllProductList.do",
			type: "POST",
			data: formData,
			processData: false,
			contentType: false,
			enctype: 'multipart/form-data',
			success:function(result) {
				var result=JSON.parse(result);

				if(result.rs == "complete") {

					IDE.MODULE.obj = result;
					
					if(dtcCom.appList != null && dtcCom.appList != ''){
						var arr = dtcCom.appList.split(",");
						for(var i = 0; i<arr.length; i++){
							if((i+1) == arr.length){
								dtcApps.callFrontModule(arr[i]);
							}
							else{
								dtcApps.callBackModule(arr[i]);
							}
						}
					} else if(dtcCom.appid != null && dtcCom.appid != 0){
						dtcApps.callFrontModule(dtcCom.appid);
					}
				}

			}
		});
		
		
		 
	},
	init:function(){
		
		dtcCom.host = window.location.host;

		if((dtcCom.appid != null && dtcCom.appid != 0) || (dtcCom.appList != null && dtcCom.appList != '')) {
			
			dtcCom.getLoadAllProductList();
		}
		
		dtcCom.getLoadMemberProductList();
		
		//툴팁 
		$('#appAreBtn').tooltip({ trigger: "hover" });
		$('#callLayerDataLists').tooltip({ trigger: "hover" });
		
		//분석 드랍다운 메뉴 버튼 클릭 시 이벤트
		$("#analysBtn-items").children('a').on('click',function(e){
			$("#dataImportDetailAre").hide();
			$("#menuArea").children('div').hide();
			$("#menuArea").hide();
			$("#btnToggle").children('.btn').removeClass('active');
			$("#btnToggleSetup").children('.btn').removeClass('active');
			$('#appAreBtn').addClass('active');
			$("#editBuildingLists").hide();
			$("#imageMclearnStart").hide();
		});
		
		//메뉴 버튼 클릭 시 이벤트
		$("#btnToggle").children('button').on('click',function(e){
			var menuIndx = $(this)[0].value;
			
			$(this).tooltip('hide');
			
			if(window.location.href.indexOf("/layer/loadMapInfo.do") == -1){
				//app 숨김
				$("#navs-analy-"+dtcApps.front+"-link").removeClass("active");
				$("#navs-analy-"+dtcApps.front).removeClass("show active");	
				$("#navs-analy-"+dtcApps.front).css("display","none");
				$("#toolAre2").css('right','0px');
				dtcApps.front= null;
			}
			
			$('#appAreBtn').removeClass('active');
			$("#btnToggle").children('.btn').removeClass('active');
			$("#btnToggleSetup").children('.btn').removeClass('active');
			
			if($(this).hasClass("active")){
				$(this).removeClass("active")
			}else{
				$(this).addClass("active")
			}
			
			if(menuIndx!="storeAre"){
				$("#storeDetailArea").hide();
			}
			
			if($("#dataImportDetailAre").css('display')=="block"){
				$("#dataImportDetailAre").hide();
			}
			
			$("#menuArea").children('div').hide();
			
			$("#menuArea").show();
			
			dtcCom.global.menuEvnetInit(menuIndx);
			//장소 poi 지우기
			Module.XDEMapRemoveLayer("interestPoint");
			$(".list-group-item").removeClass("listActive");
			dtcSearch.global.selectData = "";
			var width= $("#legendInfo").css("width");
			if($("#legendInfo").attr("value") =="right"){
				$("#legendInfo").css('left','calc(100% - '+width+' - 10px)');
			}
			$("#nationalPointPanel").css('right','55px');
			$("#layout-navbar").css('right', '5px');
			$('#legendInfoDiv').css('left','525px');
			if(dtcSearch.global.layer != null) dtcSearch.global.layer.removeAll();

			var cssImgLegend= $("#sbLgImgView").css('display');
			if(cssImgLegend != 'none'){
				$("#sbLgImgView").css('left','495px');
			}

		});
		
		$("#btnToggleSetup").children('button').on('click',function(e){
			var menuIndx = $(this)[0].value;
			
			$(this).tooltip('hide');
			
			if(window.location.href.indexOf("/layer/loadMapInfo.do") == -1){
				//app 숨김
				$("#navs-analy-"+dtcApps.front+"-link").removeClass("active");
				$("#navs-analy-"+dtcApps.front).removeClass("show active");	
				$("#navs-analy-"+dtcApps.front).css("display","none");
				$("#toolAre2").css('right','0px');
				dtcApps.front= null;
			}
			
			$('#appAreBtn').removeClass('active');
			$("#btnToggleSetup").children('.btn').removeClass('active');
			$("#btnToggle").children('.btn').removeClass('active');
			
			if($(this).hasClass("active")){
				$(this).removeClass("active")
			}else{
				$(this).addClass("active")
			}
			
			if(menuIndx!="storeAre"){
				$("#storeDetailArea").hide();
			}
			
			if($("#dataImportDetailAre").css('display')=="block"){
				$("#dataImportDetailAre").hide();
			}
			
			$("#menuArea").children('div').hide();
			
			$("#menuArea").show();
			
			dtcCom.global.menuEvnetInit(menuIndx);
			//장소 poi 지우기
			Module.XDEMapRemoveLayer("interestPoint");
			$(".list-group-item").removeClass("listActive");
			dtcSearch.global.selectData = "";
			var width= $("#legendInfo").css("width");
			if($("#legendInfo").attr("value") =="right"){
				$("#legendInfo").css('left','calc(100% - '+width+' - 10px)');
			}
			$("#nationalPointPanel").css('right','55px');
			$("#layout-navbar").css('right', '5px');
			if(dtcSearch.global.layer != null) dtcSearch.global.layer.removeAll();

			var cssImgLegend= $("#sbLgImgView").css('display');
			if(menuIndx=="storeAre" && cssImgLegend != 'none'){
				$("#sbLgImgView").css('left','60px');
			}else{
				$("#sbLgImgView").css('left','495px');
			}
			
			
		});
		
		//닫기 버튼 클릭 시 이벤트
		$("#closeMenuBtn").on('click',function(e){
			
			$("#menuArea").hide();
			$("#storeDetailArea").hide();
			$("#btnToggle").children('.btn').removeClass('active');
			$("#btnToggleSetup").children('.btn').removeClass('active');
			$("#menuArea").children('div').hide();
			$("#dataImportDetailAre").hide();
			$('#appAreBtn').removeClass('active');
			//장소 poi 지우기
			Module.XDEMapRemoveLayer("interestPoint");
			$(".list-group-item").removeClass("listActive");
			dtcSearch.global.selectData = "";
			if(dtcSearch.global.layer != null) dtcSearch.global.layer.removeAll();
			$("#local-movement").css('left', '60px');
			$('#legendInfoDiv').css('left','80px');
			if($("#legendInfo").attr("value") =="left"){
				$("#legendInfo").css('left', '70px');
			}

			var cssImgLegend= $("#sbLgImgView").css('display');
			if(cssImgLegend != 'none'){
				$("#sbLgImgView").css('left','60px');
			}

		});
		
		$("#closeStoreBtn").on('click',function(e){
			$("#storeDetailArea").hide();
			$("#storeAreResult").show();
		});
		
		$("#closeDataImprtBtn").on('click',function(e){
			$("#dataImportDetailAre").hide();
		});
		
		 new PerfectScrollbar(document.getElementById('spatialSearchRs'));
		 
		 dtcCom.global.geocoder = new kakao.maps.services.Geocoder();
		
		$("input[name='setBuildingEffectRadio']:radio").change(function(e) {
			var flag = JSON.parse(e.target.value);
			Module.getMap().setRenderMode(flag);
			var layerList = new Module.JSLayerList(false);
			layerList.nameAtLayer("buld_general").simple_real3d = true;
			layerList.nameAtLayer("bldg_tilemap_berlin_bake_240417").simple_real3d = flag;
			if(flag){
				$("#loadRatioLayerSlider").data("ionRangeSlider").update({
			    	disable: true
			    });
				$("#ratioLayerSlider").data("ionRangeSlider").update({
			    	disable: true
			    });
			}else{
				$("#loadRatioLayerSlider").data("ionRangeSlider").update({
			    	disable: false
			    });
				$("#ratioLayerSlider").data("ionRangeSlider").update({
			    	disable: false
			    });
			}
			
		});
		// BaseMap
		$("input[name='setBaseMapRadio']:radio").change(function(e) {
			//D_TRASLATION.global.userLanguage = 'ko';
			var type = e.target.value.split("_");
			if(type.length > 1){
				//D_TRASLATION.global.userLanguage = 'en';
				var map = type[0];
				var value = type[1];
				var layer = null;
				
				switch(map) {
					case 'google' :
						layer = Module.GoogleMap();
					break;
					case 'bing' :
						layer = Module.BingMap();
					break;
					case 'arc' :
						layer = Module.ArcMap();
					break;
					case 'mapbox' :
						layer = Module.MapBox();
					break;
					case 'osm' :
						layer = Module.OpenStreetMap();
					break;
				}
				layer.layername = value;
			}
			else{
				switch(e.target.value) {
					case '0' :
						Module.GoogleMap().clear();
						var terrain = Module.getTerrain();
						terrain.setRequestUrlOption({
						    urltype : "xdserver",
						    image : {
						        url : "https://xdworld.vworld.kr",
						        server : "/XDServer3d",
						        layer : "tile"
						    }
						});
						
						terrain.setRequestUrlOption({
						    urltype : "xdserver",
						    dem : {
						        url : "https://3dmap.egiscloud.com",
						        server : "/XDServer",
						        layer : "dem"
						    }
						});
						Module.SetEncodingVWorldDEM(false);
						Module.XDRenderData();
					break;
					case '-1' :
						Module.GoogleMap().setblank();
					break;
					case 'nasa' :
						//D_TRASLATION.global.userLanguage = 'en';
						Module.GoogleMap().clear();
						var terrain = Module.getTerrain();
						terrain.setRequestUrlOption({
							urltype : "xdserver",
							dem : {
								url : "https://3dmap.egiscloud.com",
								server : "/XDServer",
								layer : "dem_nasa"
							}
						});
						Module.SetEncodingVWorldDEM(false);
						terrain.setRequestUrlOption({
							urltype : "xdserver",
							image : {
								url : "https://3dmap.egiscloud.com",
								server : "/XDServer",
								layer : "img_nasa"
							}
						});
						Module.XDRenderData();
						Module.XDEPlanetRefresh();
						$("input[name=bldg_tilemap_berlin]").prop('checked',true).trigger("change");
					break;
					case 'egisSatellite' :
						Module.GoogleMap().clear();
						var terrain = Module.getTerrain();
						terrain.setRequestUrlOption({
							urltype : "xdserver",
							dem : {
								url : "https://3dmap.egiscloud.com",
								server : "/XDServer",
								layer : "dem"
							}
						});
						Module.SetEncodingVWorldDEM(false);
						terrain.setRequestUrlOption({
							urltype : "xdserver",
							image : {
								url : "https://basemap.egiscloud.com",
								server : "/XDServer",
								layer : "CompleteMap_2023"
							}
						});
						Module.XDRenderData();
						Module.XDEPlanetRefresh();
					break;
					case 'egisSatelliteHybrid' :
						Module.GoogleMap().clear();
						var terrain = Module.getTerrain();
						terrain.setRequestUrlOption({
							urltype : "xdserver",
							dem : {
								url : "https://3dmap.egiscloud.com",
								server : "/XDServer",
								layer : "dem"
							}
						});
						Module.SetEncodingVWorldDEM(false);
						terrain.setRequestUrlOption({
							urltype : "xdserver",
							image : {
								url : "https://basemap.egiscloud.com",
								server : "/XDServer",
								layer : "EGIS_hMap_World"
							}
						});
						Module.XDRenderData();
						Module.XDEPlanetRefresh();
					break;
				}
			}
		});
		$("input[name='setTerrainEffectRadio']:radio").change(function(e) {
			dtcSetting.setTerrainEffect(parseInt(e.target.value));
		});
		$("input[name='setKeyMoveRadio']:radio").change(function(e) {
			if($("#humanModeImg").css("display") == "none"){
				//휴먼모드 꺼져있을때
				$("input[name='setKeyMoveRadio']:radio").blur();
				Module.getControl().setKeyPanMode(JSON.parse(e.target.value));
				Module.getControl().setKeyZoomMode(JSON.parse(e.target.value));
				Module.getControl().setKeyRotMode(JSON.parse(e.target.value));
				if(JSON.parse(e.target.value)){
					$("#keyModeImg").show();
				}else{
					$("#keyModeImg").hide();
				}
			}
			else{
				//휴먼모드 켜져있을때
				COMMON.alert('휴먼모드가 켜져있을 경우\n키보드 이동을\n사용할 수 없습니다.','warning',function(){
                    $("input[name='setKeyMoveRadio'][value=false]").prop("checked","checked");
					return false;
                });
			}
		});
		$("input[name='setLayerMoveRadio']:radio").change(function(e) {
			if(JSON.parse(e.target.value)){
					dtcSaveMap.global.isLoadMap = true;
				}else{
					dtcSaveMap.global.isLoadMap = false;
				}
		});
		
		if(window.location.href.indexOf("/layer/galleryView.do") <= -1
		 	&& window.location.href.indexOf("/layer/gallery.do") <= -1
	 		&& window.location.href.indexOf("/layer/loadMapInfo.do") <= -1){
			dtcLg.init();
		} 
		dtcSetting.legend.init();
	},
	loadMapInfo:function(){
		var urlParams = new URL(location.href).searchParams;
		var mapid = urlParams.get('mapid');
		if(IDE.mapid != null && IDE.mapid != "" && mapid != null){
		    var formData = new FormData();
		    formData.append("mapid", mapid);
		    $.ajax({
		        url : "/layer/loadMapIdLayer.do",
		        type: "POST",
		        data: formData,
		        processData: false,
		        contentType: false,
		        enctype: 'multipart/form-data',
		        success:function(result) {
		            var result = JSON.parse(result);
					IDE.mapInfo = result;
		            if(result.mapsVO.lgid != 0){
		                dtcLg.loadLayerGroupInfo(result.mapsVO.lgid);
		            } else {
		                var data = {"default":"N"}		        
		                dtcBasicLayer.callGroupLayer(data);
		            }
		            if(result.mapsVO.lid != 0 && result.mapsVO.lid != null){
		                if(document.getElementById('legendInfo')){
		                    dtcSetting.legend.loadLegendInfo(result.mapsVO.lid);
		                }
		            }
		        }
		    })
		}
	},
	getProcessData:function(callback){
		
		$.ajax({
			url:'../process/getProcessList.do',
			type:'get',
			dataType:'json',
			success:callback
		})
	},
	getLoadMemberProductList :function(){

		var formData = new FormData();
		formData.append("control", "loadMemberProduct");
		
		$.ajax({
			url:"/ide/loadMemberProductList.do",
			type: "POST",
			data: formData,
			processData: false,
			contentType: false,
			enctype: 'multipart/form-data',
			success:function(result) {

				var result=JSON.parse(result);

				if(result.rs == "complete") {

					IDE.MODULE.obj = result;
					
					var html = "<div id='analysBtnDiv'></div>";
					$("#analysBtn-items").append(html);
					
					var appGroupList = [];
					(result.appGroupList).sort((a, b) => a.GROUP_NAME.localeCompare(b.GROUP_NAME));
					$.each(result.appGroupList, function(k, v) {
						if(appGroupList.indexOf(v.AGID) < 0){ 
							appGroupList.push(v.AGID);
							
							var html = "<div class=\"appGroup dropright\">";
							html += "<a id=\"navs-appgroup-"+v.AGID+"-link\" class=\"dropdown-item dropdown-toggle pl-3 pr-1\"><i class=\"fa fa-th-large\"></i>&nbsp";
							html += v.GROUP_NAME;
							//html += "<i onclick=\"IDE.MODULE.closeModule("+v.AGID+");\"class=\"closeicon far fa-times-circle mt-1\" style=\"float: right;color: #d9534f;display:none;cursor: pointer;\"></i>";
							html += "</a>";
							html += "</div>";
							$("#analysBtnDiv").append(html);
							
							html = "<div class=\"dropdown-menu\" aria-labelledby=\"navs-appgroup-"+v.AGID+"-link\" id=\"group-"+v.AGID+"-items\" style=\"background-color: midnightblue; position:absolute; width: max-content;\"></div>";
							$("#analysBtnDiv").after(html);
							
							$('[id^="navs-appgroup-"]').css("background-color","midnightblue");
						
							
							var html2 = "";
							html2 += "<a id=\"navs-analy-"+v.MDID+"-link\" class=\"dropdown-item pl-1 pr-1\">";
							html2 += "<i class=\"spinnericon ion ion-md-settings mr-1\" style=\"visibility: hidden;color: #00ff28; animation: spinner-border 1.75s linear infinite;\"></i>";
							if(D_TRASLATION.global.userLanguage == 'ko' || (D_TRASLATION.global.userLanguage != 'ko' && (v.ENG_NAME == null ||  v.ENG_NAME == ""))){
								html2 += v.PRODUCT_NAME;
							} else {
								html2 += v.ENG_NAME;
							}
							html2 += "<i onclick=\"IDE.MODULE.closeModule("+v.MDID+");\"class=\"closeicon far fa-times-circle mt-1\" style=\"float: right;color: #d9534f;display:none;cursor: pointer;\"></i>";
							html2 += "</a>";
							
							$("#group-"+v.AGID+"-items").append(html2);
							
							$("#navs-appgroup-"+v.AGID+"-link").on("click",function(){
								
								$("#analysBtn-items .dropdown-menu").not("#group-"+v.AGID+"-items").css("display","none");
								$("#group-"+v.AGID+"-items").toggle();
								
								var con = document.getElementById("group-"+v.AGID+"-items");
					       	    if(con.style.display == 'block'){
					       	    	$(".eg-localInfo").css('left', '390px');
					       	    	if($("#legendInfo").attr("value") =="right"){
					    				$("#legendInfo").css('left', '390px');
					    			}
					       	    }else {
					       	    	$(".eg-localInfo").css('left', '240px');
					       	    	if($("#legendInfo").attr("value") =="right"){
					    				$("#legendInfo").css('left', '240px');
					    			}
						     	} 
								
							});
							
							$("#navs-analy-"+v.MDID+"-link").on("click",function(){dtcApps.callModule(v.MDID)});
							if(document.getElementById("group-"+v.AGID+"-items"))
								new PerfectScrollbar(document.getElementById("group-"+v.AGID+"-items"));
							
						} else {
							var html2 = "";
							html2 += "<a id=\"navs-analy-"+v.MDID+"-link\" class=\"dropdown-item pl-1 pr-1\">";
							html2 += "<i class=\"spinnericon ion ion-md-settings mr-1\" style=\"visibility: hidden;color: #00ff28; animation: spinner-border 1.75s linear infinite;\"></i>";
							if(D_TRASLATION.global.userLanguage == 'ko' || (D_TRASLATION.global.userLanguage != 'ko' && (v.ENG_NAME == null ||  v.ENG_NAME == ""))){
								html2 += v.NAME;
							} else {
								html2 += v.ENG_NAME;
							}
							html2 += "<i onclick=\"IDE.MODULE.closeModule("+v.MDID+");\"class=\"closeicon far fa-times-circle mt-1\" style=\"float: right;color: #d9534f;display:none;cursor: pointer;\"></i>";
							html2 += "</a>";
							
							$("#group-"+v.AGID+"-items").append(html2);
							$("#navs-analy-"+v.MDID+"-link").on("click",function(){dtcApps.callModule(v.MDID)});
							
						}
						
					});
					
					if(D_TRASLATION.global.userLanguage == 'ko') (result.moduleList).sort((a, b) => a.product_name.localeCompare(b.product_name));
					if(D_TRASLATION.global.userLanguage != 'ko') (result.moduleList).sort((a, b) => a.eng_name.localeCompare(b.eng_name));
					$.each(result.moduleList, function(k, v) {
						if($("#navs-analy-"+v.mdid+"-link").length <= 0){
							var html = "";
							if(v.name.indexOf("국립공원") == -1){
								html += "<a id=\"navs-analy-"+v.mdid+"-link\" class=\"dropdown-item pl-1 pr-1\">";
								html += "<i class=\"spinnericon ion ion-md-settings mr-1\" style=\"visibility: hidden;color: #00ff28; animation: spinner-border 1.75s linear infinite;\"></i>";
							}else{
								html += "<a id=\"navs-analy-"+v.mdid+"-link\" class=\"dropdown-item pl-3 pr-1\">";
							}
							if(D_TRASLATION.global.userLanguage == 'ko' || (D_TRASLATION.global.userLanguage != 'ko' && (v.eng_name == null ||  v.eng_name == ""))){
								html += v.product_name;
							} else {
								html += v.eng_name;
							}
							if(v.name.indexOf("국립공원") == -1){
								html += "<i onclick=\"IDE.MODULE.closeModule("+v.mdid+");\"class=\"closeicon far fa-times-circle mt-1\" style=\"float: right;color: #d9534f;display:none;cursor: pointer;\"></i>";
							}
							html += "</a>";
							
							if(v.cid == 62){
								html += "<div class=\"dropdown-divider\"></div>";
							}
							$("#analysBtnDiv").append(html);
							$("#navs-analy-"+v.mdid+"-link").on("click",function(){dtcApps.callModule(v.mdid)});
						}
					});
				}
				var html = "";
				html += "<div class=\"dropdown-divider\"></div>";
				html += "<a class=\"dropdown-item\" href=\"javascript:$('button[value=storeAre]').click()\"><i class=\"ion ion-ios-add\"></i> "+$.i18n.t('Index.nav.myapp.add')+"</a>";
				html += "<a class=\"dropdown-item\" href=\"javaScript:IDE.MAPTOOL.resetAll();\"><i class=\"ion ion-ios-refresh\"></i> "+$.i18n.t('Index.nav.myapp.reset')+"</a>";
				$("#analysBtn-items").append(html);
				
			}
		});
	},
	getLoadAllProductList :function(){

		var formData = new FormData();
		formData.append("control", "loadAllProduct");
		
		$.ajax({
			url:"/layer/loadAllProductList.do",
			type: "POST",
			data: formData,
			processData: false,
			contentType: false,
			enctype: 'multipart/form-data',
			success:function(result) {
				var result=JSON.parse(result);

				if(result.rs == "complete") {

					IDE.MODULE.obj = result;

					if(dtcCom.appList != null && dtcCom.appList != ''){
						var arr = dtcCom.appList.split(",");
						for(var i = 0; i<arr.length; i++){
							if((i+1) == arr.length){
								dtcApps.callFrontModule(arr[i]);
							}
							else{
								dtcApps.callBackModule(arr[i]);
							}
						}
					} else if(dtcCom.appid != null && dtcCom.appid != 0){
						dtcApps.callFrontModule(dtcCom.appid);
					}
				}

			}
		});
		
		
		 
	}
	
}

var dtcLg={
	tree:null,
	to_hide:[],
	init:function(){
		
		if(IDE.mapid != null && IDE.mapid != ""){
			var formData = new FormData();
			formData.append("mapid", IDE.mapid);
			$.ajax({
				url : "/layer/loadGalleryMapLayers.do",
				type: "POST",
				data: formData,
				processData: false,
				contentType: false,
				enctype: 'multipart/form-data',
				success:function(result) {
					var result = JSON.parse(result);
					console.log(result);
					if(result.rs = "")
					dtcLg.loadLayerGroupInfo(result.mapsVO.lgid);
					
					if(result.mapsVO.lid != 0 && result.mapsVO.lid != null){
						dtcSetting.legend.loadLegendInfo(result.mapsVO.lid);
					}
				}
			})
		}
		if(dtcLg.tree == null){
			var data = {"default":"N"}
			
			dtcLg.callGroupLayer(data);
		}
		
	},
	callGroupLayer:function(data){
		var layerArr=[];
		
		if(data.default != 'Y' && typeof data.user !='undefined'){
				layerArr=data.user;
		}else{
			var defaultJson = { "id" : "root-layer", "parent" : "#", "text" : "기본 레이어",type:'default',a_attr:'no_checkbox',li_attr:{class:'no_checkbox'} };
			layerArr.push(defaultJson);
		}

		dtcLg.tree = $("#layerGroupTree").jstree({
			core:{
				data:layerArr,
				themes:{name:'default-dark'},
				check_callback:true
			},
			checkbox:{
				tree_state:false,
				keep_selected_style:false,
				tie_selection:false,
				whole_node:false
			},
			contextmenu:{
				items:function($node){
					var id = $node.id;
					var type = $node.type;

					var addObj = {
						separator_before:false,
						separator_after:false,
						label:'그룹 추가',
						icon:'fas fa-folder-plus',
						action:function(obj){
							//default type만 생성하기
							if(id.includes("meta_asset_")){
								parent_id=$node.parent;
								
								var children_node = {
									parent : parent_id, 
									text : "레이어 그룹",
									type:'default',
									state:{
										opened:true
									} 
								}

								//var rootNode = $("#layerGroupTree").jstree().get_node('root-layer');
								var rootNode = $("#layerGroupTree").jstree().get_node(parent_id);

								$("#layerGroupTree").jstree().create_node(rootNode,children_node,"last",function(node){
									$("#layerGroupTree").jstree('open_all');
									$("#layerGroupTree").jstree(true).edit(node);
								});

							}else{
								
								var folderNode={
									text:'레이어 그룹',
									type:"default",
									parent:id,
									state:{
										opened:true
									},
									a_attr:{
										class:'no_checkbox'
									}
								}
								
								$node = $("#layerGroupTree").jstree(true).create_node($node,folderNode,'last',function(node){

									$("#layerGroupTree").jstree(true).edit(node);
									
								});
								

							}
						}
					}

					var remove ={
						separator_before:false,
						separator_after:false,
						label:'삭제',
						icon:'far fa-trash-alt',
						action:function(obj){
		
							//$node = $("#layerGroupTree").jstree(true).create_node($node);
							$("#layerGroupTree").jstree(true).delete_node($node);
						}
					};

					var rename = {
						separator_before:false,
						separator_after:false,
						icon:'far fa-edit',
						label:'이름 변경',
						action:function(obj){
							$("#layerGroupTree").jstree(true).edit($node);
						}
					};
				
					var eventObj = {
						
					};

					if(id != 'root-layer'){
						
						if(type =='default'){
							eventObj.add=addObj;
							eventObj.rename=rename;
						}

						eventObj.remove=remove;
					}else{
						eventObj.add=addObj;
						eventObj.rename=rename;
					}
					
					return eventObj;
				}
			},
			dnd:{

			},
			types:{
				default:{
					
				},
				S:{
					icon:'far fa-square',
					valid_children:['default']
				},
				I:{
					icon:'fas fa-images',
					valid_children:['default']
				},
				T:{
					icon:'fas fa-mountain',
					valid_children:['default']
				},
				C:{
					icon:'fas fa-file-csv',
					valid_children:['default']
				},
				P:{
					icon:'fas fa-dot-circle',
					valid_children:['default']
				},
				G:{
					icon:'fas fa-route',
					valid_children:['default']
				},
				Z3:{
					icon:'fas fa-project-diagram',
					valid_children:['default']
				},
				LD:{
					icon:'fab fa-bandcamp',
					valid_children:['default']
				}
			},
			plugins:['contextmenu','checkbox','dnd','types','state']
		});
		
		dtcLg.tree.on("check_node.jstree uncheck_node.jstree", function(e, data) {
			dtcLg.checkboxEvent(data);
		});
		
		dtcLg.tree.on("loaded.jstree", function(e, data) {
			if(IDE.mapid != null && IDE.mapid != ""){
			    dtcLayer.loadGalleryMapLayers();
			}
		});

		new PerfectScrollbar(document.getElementById('layerGroupTree'),{
			suppressScrollX:true
	   	});
	},
		addLayer:function(obj){
		 
		var rootNode = $("#layerGroupTree").jstree().get_node('root-layer');
		
		var dataName = obj.name;
		var type = obj.type;
		var dataId = obj.dataId;
	
		var data = { id : "meta_asset_"+dataId, parent : "root-layer", text : dataName,type:type,class:'layer_tree_'+dataId+'',state:{selected:true,checked:true}};
		
		var jsonArr = $("#layerGroupTree").jstree().get_json('#',{flat:true});
		
		var exists=false;
		
		for(var i=0;i<jsonArr.length;i++){
			
			var obj = jsonArr[i];
			
			if(obj.id != 'root-layer'){
				
				if(obj.id=="meta_asset_"+dataId){
					exists=true;
					break;
				}
			}

		}
		
		if(!exists){
			$("#layerGroupTree").jstree().create_node(rootNode,data,"last",function(node){
				$("#layerGroupTree").jstree('open_all');
			});
		}else{
			return;
		}
		
		

	},
	updateLayerGroupName:function(lgid){
		
		var data = {"lgid" : lgid,
					"name" : $("#changeLayerGroupName").val()}
					
		$.ajax({
			url:'./ide/updateLayerGroupName.do',
			type:'POST',
			data:data,
			dataType:'json',
			anysc:false,
			success:function(result){
					if(result.status == 200){
						COMMON.alert('레이어 그룹명이 변경되었습니다.','success',function(){
							$("#layerGroupNameChangePopup").modal('hide');
							return false;
						})	
					}
					
				}
		})
		$("#changeGroupBtn").attr('onclick', '').unbind('click');
		
	},
	changeLayerGroupName:function(lgid){
		
		var data = {"lgid" : lgid}
		
		$.ajax({
			url:'./ide/getLayerGroupInfo.do',
			type:'POST',
			data:data,
			dataType:'json',
			anysc:false,
			success:function(result){
					var layer = result.LAYER;
					$("#changeLayerGroupName").attr("placeholder", layer.name);
					$("#changeLayerGroupName").val(layer.name);
				}
		})
		$("#layerGroupListPopup").modal('hide');
		$("#layerGroupNameChangePopup").modal();
		
		$("button[id='changeGroupBtn']").on("click", function () {
			if($("#changeLayerGroupName").val() == "" || $("#changeLayerGroupName").val() == null){
				COMMON.alert('변경할 레이어그룹명을 입력해주세요.','warning',function(){
				return false;
				})
				return false;
			} else {
				dtcLg.updateLayerGroupName(lgid);
			}
    		
		});
		
	},
	loadLayerGroupInfo:function(lgid){
		
		var data = {"lgid" : lgid}
		
		$.ajax({
			url:'/layer/getLayerGroupInfo.do',
			type:'POST',
			data:data,
			dataType:'json',
			success:function(result){
				//console.log(result);

				var data={};
				
				if(result.STATUS==200){
					$("#layerGroupListPopup").modal('hide');
					data.default='N';
					data.user = result.DATA;
					console.log(result.DATA);
				}else{
					data.default='Y';
				}
				
				$("#layerGroupTree").remove();
				
				var html = "<div class=\"card-body pb-2 pt-3\" id=\"layerGroupTree\"></div>";
				$("#layerGroupLists").prepend(html);
				
				if(window.location.href.indexOf("/layer/galleryView.do") <= -1
				 	&& window.location.href.indexOf("/layer/gallery.do") <= -1
	 				&& window.location.href.indexOf("/layer/loadMapInfo.do") <= -1){
					dtcLg.callGroupLayer(data);
				} else {
					dtcBasicLayer.callGroupLayer(data);
				}
				
				
			}
		})
	},
	deleteLayerGroup:function(lgid){
		
		var data = {"lgid" : lgid}
		
		$.ajax({
			url:'./ide/deleteLayerGroup.do',
			type:'POST',
			data:data,
			dataType:'json',
			success:function(result){
				console.log(result.list);
				var map_name = "";
				for(var i=0; i<result.list.length; i++){
					map_name += result.list[i].map_name;
					if(i != (result.list.length-1)){
						map_name += ","
					}
				}
				if(result.exist != 0){
					COMMON.alert('<span style=\'font-size:23px;line-height: normal;\'>지도에서 사용중인 레이어그룹 입니다.\n지도 삭제 후 레이어 그룹을 삭제 해주세요.<br>사용중인 지도 : '+map_name+'</span>','warning',function(){
						return false;
					})
					return false;
				}else{
					COMMON.alert('레이어 그룹이 삭제 되었습니다.','success',function(){
						dtcLg.loadJstree();
						return false;
					})
					return false;
				}
				
				
			}
		})
	},
	loadJstree:function(){
		
		var html =""; 
		
		$.ajax({
			url:'/ide/loadLayerGroupList.do',
			type:'POST',
			dataType:'json',
			processData: false,
			contentType: false,
			anysc:false,
			enctype: 'multipart/form-data',
			success:function(result){
				//var result = JSON.parse(result);
				var layerGroupList = result.layerGroupList;
				for(var i=0; i<layerGroupList.length; i++){
					html += '<tr>'
					html += '<td  width="44%" class="align-middle">'+layerGroupList[i].name+'</td>'
					html += '<td  width="20%" class="align-middle">'+layerGroupList[i].reg_date+'</td>'
					html += '<td  width="12%" class="align-middle"><button class="btn btn-outline-success btn-sm ladda-button" data-style="slide-left" data-size="s" onclick="javascript:dtcLg.loadLayerGroupInfo('+layerGroupList[i].lgid+')"><span class="lnr lnr-file-add"></span>&nbsp;&nbsp;선택</button></td>'
					html += '<td  width="12%" class="align-middle"><button class="btn btn-outline-primary btn-sm ladda-button" data-style="slide-left" data-size="s" onclick="javascript:dtcLg.changeLayerGroupName('+layerGroupList[i].lgid+')"><span class="lnr lnr-file-empty"></span>&nbsp;&nbsp;변경</button></td>'
					html += '<td  width="12%" class="align-middle"><button class="btn btn-outline-danger btn-sm ladda-button" data-style="slide-left" data-size="s" onclick="javascript:dtcLg.deleteLayerGroup('+layerGroupList[i].lgid+')"><span class="llnr lnr-trash"></span>&nbsp;&nbsp;삭제</button></td>'
					html += '</tr>'
				}
				
				if(layerGroupList.length == 0){
					html = '<span>저장된 레이어 그룹이 없습니다.</span>';
				}
				
				document.getElementById('myLayerGroupList').innerHTML = html;

			}
		})
		
		
		$("#layerGroupListPopup").modal();
	},
	saveJstreePopup:function(){
		
		var jsonArr = $("#layerGroupTree").jstree().get_json('#',{flat:true});
		var jsTreeJson = [];
		
		for(var i=0;i<jsonArr.length;i++){
			
			var obj = jsonArr[i];
			
			if(obj.id != 'root-layer'){
				obj.state.checked=false;
				obj.state.selected=false;
			}

			jsTreeJson.push(obj);

		}

		if(jsTreeJson.length == 1){
			
			COMMON.alert('레이어를 추가해주세요.','warning',function(){
				return false;
			})

			return false;
		}
		$("#layerGroupName").val("");
		$("#layerGroupPopup").modal();
	},
	saveJstree:function(){
		//json file 서버 업로드
		$('#layerGroupTree').jstree().uncheck_all();

		var jsonArr = $("#layerGroupTree").jstree().get_json('#',{flat:true});
		var jsTreeJson = [];
		
		for(var i=0;i<jsonArr.length;i++){
			
			var obj = jsonArr[i];
			
			if(obj.id != 'root-layer'){
				obj.state.checked=false;
				obj.state.selected=false;
			}

			jsTreeJson.push(obj);

		}

		if(jsTreeJson.length == 1){
			
			COMMON.alert('레이어를 추가해주세요.','warning',function(){
				return false;
			})

			return false;
		}
		
		if($("#layerGroupName").val() == "" || $("#layerGroupName").val() == null){
			
			COMMON.alert('레이어 그룹명을 입력해주세요.','warning',function(){
				return false;
			})

			return false;
		}

		var binary =new Blob([JSON.stringify(jsTreeJson, null, 2)], {
			type: "application/json"
		})

		var mid = D_MEMBER.MID;
		var time = new Date().getTime();
		var jsonFile = new File([binary],'layer_tree_'+mid+'_'+time+'.json',{type:'text/json;charset=utf-8'});
		
		var formData = new FormData();
		formData.append('NAME',$("#layerGroupName").val());
		formData.append('MID',mid);
		formData.append('FILE',jsonFile);

		$.ajax({
			url:'/ide/saveLayerTree.do',
			type:'POST',
			data:formData,
			dataType:'json',
			processData: false,
			contentType: false,
			enctype: 'multipart/form-data',
			success:function(result){
				console.log(result);
				if(result.INFO.STATUS==200){
					
					COMMON.alert('저장되었습니다.','success',function(){
						$("#layerGroupPopup").modal('hide');
						return false;
					})

					return false;
				}

			}
		})

	},
	deleteJstree:function(){
		var jsonArr = $("#layerGroupTree").jstree().get_json('#',{flat:true});
		
	},
	checkboxEvent:function(data){
		
		var layerName = data.node.id;
		var dataId =layerName.split("_")[2];
		var layerId = 'memLayer_'+dataId;
		
		var checked = data.node.state.checked;
		if(checked){
			$("#"+layerId).prop('checked',true);
		}else{
			$("#"+layerId).prop('checked',false);
		}
		if(data.event != undefined){
			$("#"+layerId).change();
		}
	}
}

//메뉴 - 레이어
var dtcLayer={
	global:{
		layerList:null,
		gsLayerList:null,
		sbLayerList:null,//단일 밴드 유사색상 레이어
		gpxLayerList:null,
		layerSHPList:null,
		layer:null,
		obj:null,
		octLayer:null,
		octLayerList:null,
		sampleInterval:null,
		sampleFlag:false,
		shpLayerList:[],
		step:0,
		count:30,
		checkList:false,
		tile3ds:[],
		layerVisbleList:[],
		layerOnList:[],
		layersOnInfo:[],
		layersOnUi:[],
		layerOnInfo:[],
		pushAndPopDataId:function(dataId,dataName,type,value) {

			dataId = parseInt(dataId);
			// 지도 저장을 위한 지도 데이터 배열 관리
			var idx = dtcLayer.global.layerOnList.indexOf(dataId);

			var layerInfo  = {
				dataId:dataId,
				name:dataName,
				type:type,
				value:value
			}

			if(idx !== -1) {
				//제거
				dtcLayer.global.layerOnList.splice(idx, 1);
				if(type=='C'){
					Module.XDSetMouseState(1);
					Module.canvas.removeEventListener('Fire_EventSelectedObject',dtcLayer.CSV.getSingleCsvProperty)
				}
			} else {
				//추가
				dtcLayer.global.layerOnList.push(dataId);
				if(window.location.href.indexOf("/layer/galleryView.do") <= -1
				 	&& window.location.href.indexOf("/layer/gallery.do") <= -1
					&& window.location.href.indexOf("/layer/loadMapInfo.do") <= -1){
					dtcLg.addLayer(layerInfo);
				} else {
					dtcBasicLayer.addLayer(layerInfo);
				}
				if(type=='C'){
					//클릭 이벤트 추가
					//마우스 클릭 이벤트 추가
					Module.XDSetMouseState(6);
					Module.canvas.addEventListener('Fire_EventSelectedObject',dtcLayer.CSV.getSingleCsvProperty)
				}

				dtcLayer.global.layerOnInfo.push(layerInfo);
				

			}

		},
		stepShare:0,
		countShare:30,
		checkShareList:false
	},
	mapidMapLayers:function() {
		var formData = new FormData();
		formData.append("mapid", IDE.mapid);
		var url = "/layer/loadGalleryMapLayers.do";
		dtcLayer.loadLayer(formData, url);
	},
	glidMapLayer:function() {
		var params = (new URL(document.location)).searchParams;
		const glid = params.get('glid');

		var formData = new FormData();
		formData.append("glid", glid);
		var url = "/layer/loadMapLayer.do";
		dtcLayer.loadLayer(formData, url);
	},
	loadLayer:function(formData, url) {
	
		$.ajax({
			url:url,
			type: "POST",
			data: formData,
			processData: false,
			contentType: false,
			enctype: 'multipart/form-data',
			success:function(result) {
				var result=JSON.parse(result);
				
				if(result.rs == "complete") {
					var layerName = "";
					
					for(var i=0;i<result.layerData.length;i++){
						var dataId = result.layerData[i]['dataid'];
						var check =  true;
					    var dataType = result.layerData[i]['data_type'];
						var value = "";
						if(dataType == "S" || dataType == "GJ") value = result.layerData[i]['shp_layer_fullname'];
						else value = "meta_asset_"+dataId;
						var dataName = result.layerData[i]['data_name'];
	
						// 지도 저장기능을 위한 dataId 수집
						dtcLayer.global.pushAndPopDataId(dataId,dataName,dataType,value);

						
						if(dataType == "S"){
							if(layerName == ""){
								layerName = value;
							}else{
								layerName += ","+value;
							}
						}else{
							if(D_MEMBER.MID > 0) dtcLayer.callLayerInfo(dataId);
							else dtcBasicLayer.callLayerInfo(dataId);
						}
						var shpValue = $(this).next().val();
						
						if(shpValue=="S" && check){
							dtcLayer.global.shpLayerList.push(value);
						}else if(shpValue=="S" && !check){
							dtcLayer.global.shpLayerList.splice(value,1);
						}
						
					}
					
					var layerList = new Module.JSLayerList(false);
					if(layerList.nameAtLayer("layerWMS") == null){
						layerList.createWMSLayer("layerWMS");
					}
					dtcLayer.SHP.layer = layerList.nameAtLayer("layerWMS");
					
					if(layerName != ""){
						dtcLayer.SHP.layerName = layerName;
						var geoserver_url = dtcCom.geo_url();
	
						var slopeoption = {
							url: "//"+geoserver_url+"/wms?",
							layer: layerName,
							minimumlevel: 7,
							maximumlevel: 21,
							tilesize: 256,
							crs: "EPSG:4326",
							parameters: {
								version: "1.1.0"
							}
						};
			
						if (dtcLayer.SHP.layer != null) {
			
							dtcLayer.SHP.layer.setWMSProvider(slopeoption);
							dtcLayer.SHP.layer.setBBoxOrder(true);
							dtcLayer.SHP.layer.clearWMSCache();
						}
					}
					
					if(result.mapsVO.move_lat != 0 && result.mapsVO.move_lon != 0 && result.mapsVO.move_alt != 0){
						var lat = result.mapsVO.move_lat;
						var lon = result.mapsVO.move_lon;
						var alt = result.mapsVO.move_alt;
						
						if(result.mapsVO.look_lat != 0 && result.mapsVO.look_lon != 0 && result.mapsVO.look_alt != 0){
							var look_lat = result.mapsVO.look_lat;
							var look_lon = result.mapsVO.look_lon;
							var look_alt = result.mapsVO.look_alt;
							
							Module.getViewCamera().look(new Module.JSVector3D(lon,lat,alt),new Module.JSVector3D(look_lon, look_lat, look_alt));

						} else {
							Module.getViewCamera().setViewAt(lon, lat, alt, 90, 0);
						}
						
						dtcSaveMap.global.isLoadMap = false;
					} 
					
					
				}
				$("#basicLayerTree").jstree().check_all(true);
			}
		});
		
		
		
	},
	loadGalleryMapLayers:function() {
		//console.log("loadMapLayer:"+IDE.mapid);
		
		var formData = new FormData();
		formData.append("mapid", IDE.mapid);
		$.ajax({
			url : "/layer/loadGalleryMapLayers.do",
			type: "POST",
			data: formData,
			processData: false,
			contentType: false,
			enctype: 'multipart/form-data',
			success:function(result) {
				var result=JSON.parse(result);
				
				if(result.rs == "complete") {
					var layerName = "";
					
					for(var i=0;i<result.layerData.length;i++){
						var dataId = result.layerData[i]['dataid'];
						var check =  true;
					    var dataType = result.layerData[i]['data_type'];
						var value = "";
						if(dataType == "S" || dataType == "GJ") value = result.layerData[i]['shp_layer_fullname'];
						else value = "meta_asset_"+dataId;
						var dataName = result.layerData[i]['data_name'];
	
						// 지도 저장기능을 위한 dataId 수집	
						dtcLayer.global.pushAndPopDataId(dataId,dataName,dataType,value);

						
						if(dataType == "S"){
							if(layerName == ""){
								layerName = value;
							}else{
								layerName += ","+value;
							}
						}else{
							dtcLayer.callLayerInfo(dataId);
						}
						var shpValue = $(this).next().val();
						
						if(shpValue=="S" && check){
							dtcLayer.global.shpLayerList.push(value);
						}else if(shpValue=="S" && !check){
							dtcLayer.global.shpLayerList.splice(value,1);
						}
						
					}

					var layerList = new Module.JSLayerList(false);
					if(layerList.nameAtLayer("layerWMS") == null){
						layerList.createWMSLayer("layerWMS");
					}
					dtcLayer.SHP.layer = layerList.nameAtLayer("layerWMS");
					
					if(layerName != ""){
						dtcLayer.SHP.layerName = layerName;
						var geoserver_url = dtcCom.geo_url();
	
						var slopeoption = {
							url: "//"+geoserver_url+"/wms?",
							layer: layerName,
							minimumlevel: 7,
							maximumlevel: 21,
							tilesize: 256,
							crs: "EPSG:4326",
							parameters: {
								version: "1.1.0"
							}
						};
			
						if (dtcLayer.SHP.layer != null) {
			
							dtcLayer.SHP.layer.setWMSProvider(slopeoption);
							dtcLayer.SHP.layer.setBBoxOrder(true);
						}
						dtcLayer.SHP.layer.clearWMSCache();
					}
					
					if(result.mapsVO.move_lat != 0 && result.mapsVO.move_lon != 0 && result.mapsVO.move_alt != 0){
						var lat = result.mapsVO.move_lat;
						var lon = result.mapsVO.move_lon;
						var alt = result.mapsVO.move_alt;
						
						if(result.mapsVO.look_lat != 0 && result.mapsVO.look_lon != 0 && result.mapsVO.look_alt != 0){
							var look_lat = result.mapsVO.look_lat;
							var look_lon = result.mapsVO.look_lon;
							var look_alt = result.mapsVO.look_alt;
							
							Module.getViewCamera().look(new Module.JSVector3D(lon,lat,alt),new Module.JSVector3D(look_lon, look_lat, look_alt));

						} else {
							Module.getViewCamera().setViewAt(lon, lat, alt, 90, 0);
						}
						
						dtcSaveMap.global.isLoadMap = false;
					} 
					
					
				}
			}
		});
	},
	loadMapLayer:function() {
		//console.log("loadMapLayer:"+IDE.mapid);

		var formData = new FormData();
		formData.append("mapid", IDE.mapid);
		$.ajax({
			url:"/ide/loadMapLayers.do",
			type: "POST",
			data: formData,
			processData: false,
			contentType: false,
			enctype: 'multipart/form-data',
			success:function(result) {

				var result=JSON.parse(result);
				
				if(result.rs == "complete") {
					var layerName = "";
					for(var i=0;i<result.layerData.length;i++){
						var dataId = result.layerData[i]['dataid'];
						var check =  true;
						var value = result.layerData[i]['shp_layer_fullname'];
					    var dataType = result.layerData[i]['data_type'];
						var dataName = result.layerData[i]['data_name'];

						// 지도 저장기능을 위한 dataId 수집	
						dtcLayer.global.pushAndPopDataId(dataId,dataName,dataType);
						
						if(dtcLayer.global.layerList == null){
							dtcLayer.global.layerList = new Module.JSLayerList(true);
						}
				
						dtcLayer.global.layerList = new Module.JSLayerList(true);
				
						if(dataType == "S"){
							if(layerName == ""){
								layerName = value;
							}else{
								layerName += ","+value;
							}
						}else{
							dtcLayer.callLayerInfo(dataId);
						}
						var shpValue = $(this).next().val();
						
						if(shpValue=="S" && check){
							dtcLayer.global.shpLayerList.push(value);
						}else if(shpValue=="S" && !check){
							dtcLayer.global.shpLayerList.splice(value,1);
						}
						
					}
					dtcLayer.SHP.layer= dtcLayer.global.layerList.createWMSLayer("layerWMS");
					if(layerName != ""){
						dtcLayer.SHP.layerName = layerName;
						var geoserver_url = dtcCom.geo_url();

						var slopeoption = {
							url: "//"+geoserver_url+"/wms?",
							layer: layerName,
							minimumlevel: 5,
							maximumlevel: 21,
							tilesize: 256,
							crs: "EPSG:4326",
							parameters: {
								version: "1.1.0"
							}
						};
			
						if (dtcLayer.SHP.layer != null) {
			
							dtcLayer.SHP.layer.setWMSProvider(slopeoption);
							dtcLayer.SHP.layer.setBBoxOrder(true);
							dtcLayer.SHP.layer.clearWMSCache();
						}
					}
					var lat = result.mapsVO.move_lat;
					var lon = result.mapsVO.move_lon;
					var alt = result.mapsVO.move_alt;
					
					Module.getViewCamera().setViewAt(lon, lat, alt, 90, 0);
				}
			}
		});
	},
	instance:function(){
		//그룹 레이어 인스턴스화 시작
		if ($('html').attr('dir') === 'rtl' || $('body').attr('dir') === 'rtl') {
			  $('#hover-dropdown-layer .dropdown-menu').addClass('dropdown-menu-right')
		}
		
		// Add Nav tabs event
		 $('#metaLibraryTabs a').on('click', function (e) {
			 //console.log(e.target.hash);
			 dtcFile.META.loadFromMetaDataList(e.target.hash);
		 });
		
		dtcLayer.global.layerList = new Module.JSLayerList(true);
		
		if(window.location.href.indexOf("/layer/galleryView.do") > -1
		 	|| window.location.href.indexOf("/layer/gallery.do") > -1
			|| window.location.href.indexOf("/layer/loadMapInfo.do") > -1){
			return false;
		}
		
		$("#callLayerDataLists").on('click',function(e){
			 $("#dataImportDetailAre").show("slide", { direction: "left" }, 200);
		});
		
		$("#dataImportDetailAre #importBtn").each(function(index,item){

			 var l = Ladda.create(item);
			 
			 item.addEventListener('click',function(e){
				 
				 l.start();
				 
				 setTimeout(function() {
					 
					 $("#menuArea").show();
					 $("#layerDataLists").show("slide", { direction: "left" }, 200);
					 $("#dataImportDetailAre").hide("fast")
					 
					 l.stop();
					 
					 Module.getViewCamera().setLocation(new Module.JSVector3D(127.42783066858743, 37.500795887788236, 1957.945530910976));
				 }, 1000);
				 
			 })
			 
		 });
		
		
		$("#addLayerFiles").on('click',function(e){
			dtcFile.load("./assets/js/global/dtc-fileupload.html");
		});
		
		$("#callLayerDataLists").on("click", function(e) {
			// 레이어 불러오기 / 지형탭
			dtcFile.META.loadFromMetaDataList("#terrain-data");
		});
		
		dtcLayer.scrollbarInit();
		
		//dtcLayer.sampleLayerInit();
		
		 new PerfectScrollbar(document.getElementById('sampleLayerLists'),{
			 suppressScrollX:true
		 });
		 
		

		 dtcLayer.getShareLayerLists(D_MEMBER.MID,function(){
			$(".layer_dem_check,.layer_input_check").each(function(){
				var dataId = parseInt($(this).attr('id').split("_")[1]);
				if(dtcLayer.global.layerOnList.indexOf(dataId) > -1){
					$(this).prop('checked',true);
				}
			})
		 });

		 dtcLayer.getLayerLists(D_MEMBER.MID,function(){
			$(".layer_dem_check,.layer_input_check").each(function(){
				var dataId = parseInt($(this).attr('id').split("_")[1]);
				if(dtcLayer.global.layerOnList.indexOf(dataId) > -1){
					$(this).prop('checked',true);
				}
			})
	
			
		 });
		 
		

		//shp 레이어 클릭 이벤트 추가
		$("#canvas").on('click',dtcLayer.SHP.getSingleProperty);
		//단일밴드 유사색상 클릭 이벤트 추가
		$("#canvas").on('click',function(e){
			
			if(dtcLayer.global.sbLayerList != null){
				
				var pos = new Module.JSVector2D(e.offsetX,e.offsetY);
				var mapPos = Module.getMap().ScreenToMapPointEX(pos);
				
				var lon = mapPos.Longitude;
				var lat = mapPos.Latitude;

				var param = {
					dataIds : dtcLayer.IMG.global.sbLayerInfo,
					lon:lon,
					lat:lat
				}
				
				//체크된 것들 중에서만 호출
				var cblength = $(".sb_layer_selected:checked").length;

				if(cblength != 0){
					$.ajax({
						url:'/ide/getSbValData.do',
						type:'post',
						data:param,
						dataType:'json',
						success:function(result){
							
							if(result.status==200){
								var pVal = result.info[0].val;
								$("#singleImgProperties").show();
								$("#sbImgPixcelDataVal").text(pVal);
							}
						}
					})
				}else{
					return false;
				}
			}else{
				return false;
			}

		});

		$("#singleImgPropsCloseBtn").on('click',function(e){
			$("#singleImgProperties").hide();
		})

		$("#singlePropsCloseBtn").on('click',function(e){
			$("#singleShpProperties").hide();

			if(dtcLayer.MODEL.global.layer != null){
				
				dtcFile.type.model.global.eventCheck=false;
				Module.getMap().clearSelectObj();
				$("#single3dsEditBtn").hide();
				$("#single3dsEditBtn").off('click');

				$("#edit3dsInterface").hide();
				
			}
			
			var layerList = new Module.JSLayerList(true);
			if(layerList.nameAtLayer("global_feature_line_layer") != null){
				layerList.delLayerAtName("global_feature_line_layer");
			}
		}); 

		$("#layerDataTypeSelcALL").on('click',function(e){
			if($("#layerDataTypeSelcALL").is(":checked")){
				$(".layer_type_check").prop("checked",true);
			}else{
				$(".layer_type_check").prop("checked",false);
				$("#shareLayerLists").html("");
				$("#memberLayerLists").html("");
				return;
			}
			
			$("#shareLayerLists")[0].scrollTop = 0;
			$("#memberLayerLists")[0].scrollTop = 0;
			dtcLayer.global.checkShareList=false;
			dtcLayer.global.checkList=false;
			$("#shareLayerLists").html("");
			$("#memberLayerLists").html("");
			 dtcLayer.getShareLayerLists(D_MEMBER.MID,function(){
				$(".layer_dem_check,.layer_input_check").each(function(){
					var dataId = parseInt($(this).attr('id').split("_")[1]);
					if(dtcLayer.global.layerOnList.indexOf(dataId) > -1){
						$(this).prop('checked',true);
					}
				})
			 });
	
			 dtcLayer.getLayerLists(D_MEMBER.MID,function(){
				$(".layer_dem_check,.layer_input_check").each(function(){
					var dataId = parseInt($(this).attr('id').split("_")[1]);
					if(dtcLayer.global.layerOnList.indexOf(dataId) > -1){
						$(this).prop('checked',true);
					}
				})
		
			 });
		});
		$(".layer_type_check").on('click',function(e){
			$("#shareLayerLists")[0].scrollTop = 0;
			$("#memberLayerLists")[0].scrollTop = 0;
			dtcLayer.global.checkShareList=false;
			dtcLayer.global.checkList=false;
			$("#shareLayerLists").html("");
			$("#memberLayerLists").html("");
			if($('.layer_type_check:checked').length == 0){
				return;
			}
			 dtcLayer.getShareLayerLists(D_MEMBER.MID,function(){
				$(".layer_dem_check,.layer_input_check").each(function(){
					var dataId = parseInt($(this).attr('id').split("_")[1]);
					if(dtcLayer.global.layerOnList.indexOf(dataId) > -1){
						$(this).prop('checked',true);
					}
				})
			 });
	
			 dtcLayer.getLayerLists(D_MEMBER.MID,function(){
				$(".layer_dem_check,.layer_input_check").each(function(){
					var dataId = parseInt($(this).attr('id').split("_")[1]);
					if(dtcLayer.global.layerOnList.indexOf(dataId) > -1){
						$(this).prop('checked',true);
					}
				})
		
			 });
		});
		
		
		if(document.getElementById('singleShpPropsHeight')){
			new PerfectScrollbar(document.getElementById('singleShpPropsHeight'),{
				suppressScrollX:true
		   	});
		}
		
		if(document.getElementById('singleCsvPropsHeight')){
			new PerfectScrollbar(document.getElementById('singleCsvPropsHeight'),{
				suppressScrollX:true
		   	});
		}
		

		$("#csvPropsCloseBtn").on('click',function(e){
			$("#singleCsvProperties").hide();
		})

		//search init 
		$("#memberLayerLists").on("change", ".layer_input_check", dtcLayer.layerInputCheck);
		$("#shareLayerLists").on("change", ".layer_input_check", dtcLayer.layerInputCheck);

		$("#memberLayerLists").on("change", ".layer_dem_check", dtcLayer.layerDemCheck);
		$("#shareLayerLists").on("change", ".layer_dem_check", dtcLayer.layerDemCheck);

		$("#memberLayerLists").on("change", ".sb_layer_selected", dtcLayer.IMG.getPixcelData);

		$("#closeLayerBtn").on("click",function(){
			$(".layer_input_check:checked").prop("checked",false).change();
		})

		$(".sb_layer_selected").on('click',function(e){
			dtcLayer.IMG.getPixcelData(e);
		})
		dtcLayer.searchInit();
	},
	searchInit:function(){

		$("#layerDataSearchStr").on('keyup',function(e){
			
			if(e.keyCode==13){
				$("#shareLayerLists")[0].scrollTop = 0;
				$("#memberLayerLists")[0].scrollTop = 0;
				dtcLayer.global.checkShareList=false;
				dtcLayer.global.checkList=false;
				$("#shareLayerLists").html("");
				$("#memberLayerLists").html("");
				 dtcLayer.getShareLayerLists(D_MEMBER.MID,function(){
					$(".layer_dem_check,.layer_input_check").each(function(){
						var dataId = parseInt($(this).attr('id').split("_")[1]);
						if(dtcLayer.global.layerOnList.indexOf(dataId) > -1){
							$(this).prop('checked',true);
						}
					})
				 });
		
				 dtcLayer.getLayerLists(D_MEMBER.MID,function(){
					$(".layer_dem_check,.layer_input_check").each(function(){
						var dataId = parseInt($(this).attr('id').split("_")[1]);
						if(dtcLayer.global.layerOnList.indexOf(dataId) > -1){
							$(this).prop('checked',true);
						}
					})
					//dem은 따로
					$(".layer_dem_check").on('click',function(e){
						
						var dataId = $(this).attr('id').split("_")[1];
						var check =  $(this).is(':checked');
						var value = $(this).val();
						var dataName = $(this).next().next().text();

						dtcLayer.global.pushAndPopDataId(dataId,dataName,'T');

						if(check){
							dtcLayer.callLayerInfo(dataId);
						}else{
							Module.getTerrain().SetUseDemBox(false);
		
							$("input[name='setBaseMapRadio'][value='0']").prop("checked",true).change();
		
							var layerList = new Module.JSLayerList(true);
							var layer = layerList.nameAtLayer(value);
		
							if (layer != null) {
								layer.setVisible(false);
							}
		
							Module.getMap().ClearMap();
						}
						
					});
				 });
			}

		});

		$("#layerDataSearchBtn").on('click',function(e){
			
			$("#shareLayerLists")[0].scrollTop = 0;
			$("#memberLayerLists")[0].scrollTop = 0;
			dtcLayer.global.checkShareList=false;
			dtcLayer.global.checkList=false;
			$("#shareLayerLists").html("");
			$("#memberLayerLists").html("");
			 dtcLayer.getShareLayerLists(D_MEMBER.MID,function(){
				$(".layer_dem_check,.layer_input_check").each(function(){
					var dataId = parseInt($(this).attr('id').split("_")[1]);
					if(dtcLayer.global.layerOnList.indexOf(dataId) > -1){
						$(this).prop('checked',true);
					}
				})
			 });
	
			 dtcLayer.getLayerLists(D_MEMBER.MID,function(){
				$(".layer_dem_check,.layer_input_check").each(function(){
					var dataId = parseInt($(this).attr('id').split("_")[1]);
					if(dtcLayer.global.layerOnList.indexOf(dataId) > -1){
						$(this).prop('checked',true);
					}
				})
				//dem은 따로
				$(".layer_dem_check").on('click',function(e){
					
					var dataId = $(this).attr('id').split("_")[1];
					var check =  $(this).is(':checked');
					var value = $(this).val();
					var dataName = $(this).next().next().text();

					dtcLayer.global.pushAndPopDataId(dataId,dataName,'T');

					if(check){
						dtcLayer.callLayerInfo(dataId);
					}else{
						Module.getTerrain().SetUseDemBox(false);
	
						$("input[name='setBaseMapRadio'][value='0']").prop("checked",true).change();
	
						var layerList = new Module.JSLayerList(true);
						var layer = layerList.nameAtLayer(value);
	
						if (layer != null) {
							layer.setVisible(false);
						}
	
						Module.getMap().ClearMap();
					}
					
				});
			 });
		})

	},
	searchSubmit:function(){
		
		var type = $("#layerDataTypeSelc option:selected").val();
		var text = $("#layerDataSearchStr").val();
		
		if(!text || text=="undefiend"){
			
			COMMON.alert('레이어명을 입력해주세요','warning',function(){
				return false;
			})

			$("#layerDataSearchStr").focus();

			return false;
		}
		
		
		var data = {
			TEXT:text,
			TYPE:type,
			MID:D_MEMBER.MID
		}

		$.ajax({
			url:'./ide/searchLayerList.do',
			type:'POST',
			data:data,
			dataType:'json',
			success:function(result){
				console.log(result);
			}
		
		});

	},
	getLayerLists:function(mid,callback){
		//console.log(mid);

		if(!dtcLayer.global.checkList){

			dtcLayer.global.step= 0;
			dtcLayer.global.count=30;
			var text = $("#layerDataSearchStr").val();
			var type = [];
			$('.layer_type_check').each(function(){
			    if($(this).is(":checked")){
					if(this.value == "D"){
				        type.push("T");
					}
			        type.push(this.value);
			    }
			});
			var data = {
				MID:mid,
				TYPE:type,
				TEXT:text,
				STEP:dtcLayer.global.step,
				COUNT:dtcLayer.global.count
			}
	
			$.ajax({
				url:'./ide/getMemberLayerLists.do',
				type:'POST',
				data:data,
				dataType:'json',
				success:function(result){
	
					dtcLayer.global.step= 30;
					dtcLayer.global.count=10;
	
					dtcLayer.setMemberLayerLists(result);
					callback();
				}
			})
			
			dtcLayer.global.checkList=true;
		}
	
	},
	getShareLayerLists:function(mid,callback){
		//console.log(mid);

		if(!dtcLayer.global.checkShareList){

			dtcLayer.global.stepShare= 0;
			dtcLayer.global.countShare=30;
	
			var text = $("#layerDataSearchStr").val();
			var type = [];
			$('.layer_type_check').each(function(){
			    if($(this).is(":checked")){
					if(this.value == "D"){
				        type.push("T");
					}
			        type.push(this.value);
			    }
			});
			var data = {
				MID:mid,
				TYPE:type,
				TEXT:text,
				STEP:dtcLayer.global.stepShare,
				COUNT:dtcLayer.global.countShare
			}
	
			$.ajax({
				url:'./ide/getShareLayerLists.do',
				type:'POST',
				data:data,
				dataType:'json',
				success:function(result){
	
					dtcLayer.global.stepShare= 30;
					dtcLayer.global.countShare=10;
	
					dtcLayer.setShareLayerLists(result);
					callback();
					
				}
			})
			
			dtcLayer.global.checkShareList=true;
		}
	
	},
	createImagePoiCctv:function(obj){
		
		var img = new Image();
			img.onload=function(){
				var canvas = document.createElement('canvas');
				var ctx = canvas.getContext('2d');
				canvas.width = 60;
				canvas.height = 60;
			
				ctx.drawImage(img, 0, 0,canvas.width,canvas.height);
				// 5. POI 생성
				var point = new Module.createPoint("cctvPoi_"+obj.no);
				
				if(dtcLayer.CSV.global.poiCctvLayer == null){
					var layerList=new Module.JSLayerList(true);
					dtcLayer.CSV.global.poiCctvLayer = layerList.createLayer("cctvPoi", Module.ELT_3DPOINT);			
				}
					
				// 6. POI 위치 등록
				point.setPosition(new Module.JSVector3D(obj.x, obj.y, obj.z));
				var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
				point.setImage(imageData, canvas.width, canvas.height);

				dtcLayer.CSV.global.poiCctvLayer.addObject(point,0);
			}
			
			img.src=obj.img;
	},
	callCctvSample:function(){

		var layerList=new Module.JSLayerList(true);
		dtcLayer.CSV.global.poiCctvLayer = layerList.createLayer("cctvPoi", Module.ELT_3DPOINT);

		var canvas = document.getElementById('canvas');

		canvas.addEventListener("OnEventSelectedObject", function(e) {
			console.log("OnEventSelectedObject:  ", e);
		});

		Module.getViewCamera().setLocation(new Module.JSVector3D(126.986742475, 37.65611726, 4800));

		dtcLayer.CSV.global.poiCctvLayer.setMaxDistance(500000);
		var poi1Obj ={
						no:1,
						code:1,
						se:"1_1.mpeg",
						x:126.9779754,
						y:37.65862995,
						z:832.1358642578125,
						img:'/assets/img/poi/icon_pointer.png',
						str:'로드뷰'
					};
		var poi2Obj={
					no:2,
					code:1,
					se:"1_2.mpeg",
					x:126.9786441,
					y:37.65812459,
					z:771.4426879882812,
					img:'/assets/img/poi/icon_pointer.png',
					str:'로드뷰'
				}
		
		var poi3Obj = {
			no:3,
			code:1,
			se:"1_2.mpeg",
			x:126.9793924,
			y:37.6579925,
			z:725.83203125,
			img:'/assets/img/poi/icon_pointer.png',
			str:'로드뷰'
		};

		var poi4Obj={
			no:4,
			code:2,
			se:"CCTV",
			x:127.010958,
			y:37.649722,
			z:53.41322326660156,
			img:'/assets/img/poi/poi15_01.png',
			str:'CCTV'
		}

		dtcLayer.createImagePoiCctv(poi1Obj);
		dtcLayer.createImagePoiCctv(poi2Obj);
		dtcLayer.createImagePoiCctv(poi3Obj);
		dtcLayer.createImagePoiCctv(poi4Obj);
	
	},
	setMemberLayerLists:function(obj){
		$("#memberLayerLists").empty();
		var element = 'memberLayerLists';
		if(obj.LIST.length > 0){
			for(var i=0;i<obj.LIST.length;i++){
				var dataObj = obj.LIST[i];
				dtcLayer.clonLayerInfo(dataObj,element,'E');
			}
		}else{
			var html = ""
			html = "<div style='border: 1px dashed;margin: 20px 0px;border-radius: 10px; text-align: center;height: 80%;display: grid;'>";
			html += "<br>";
			html += "<span style='margin: auto;' class='text-body'>등록된 레이어가 없습니다.</span>";
			html += "<button class='btn btn-primary' type='button' style='margin: auto;' onclick='javascript:dtcLayer.saveSampleData()'>샘플 레이어 불러오기</button>";
			html +="<br>";
			html +="</div>";
			$("#memberLayerLists").html(html);
		}
	
	},
	setShareLayerLists:function(obj){
		if(obj.LIST != null){
		  for(var i=0;i<obj.LIST.length;i++){
			  var dataObj = obj.LIST[i];
			  dtcLayer.clonLayerInfo(dataObj,'shareLayerLists','E');
		  }
		}
	},
	getMoreAppendLayers:function(obj){
		
		for(var i=0;i<obj.length;i++){
		
			var dataObj = obj[i];
			dtcLayer.clonLayerInfo(dataObj,'memberLayerLists','E');
		}
	
	},
	callLayerInfo:function(dataId){
		//console.log(dataId);
		var data={
			dataId:dataId
		}
		
		$("#memLayer_"+dataId).prop("checked",true);
		$.ajax({
			url:'/ide/callLayerInfo.do',
			type:'POST',
			data:data,
			dataType:'json',
			success:function(result){
				
				var layerInfo ={
					dataId:result.INFO.dataid,
					minx:result.INFO.minx,
					miny:result.INFO.miny,
					minz:result.INFO.minz,
					maxx:result.INFO.maxx,
					maxy:result.INFO.maxy,
					maxz:result.INFO.maxz,
					move_lon:result.INFO.move_lon,
					move_lat:result.INFO.move_lat,

				}

				if(result.INFO.data_type=="S" || result.INFO.data_type=="DXF"){

					dtcLayer.SHP.addLayer(result);

				} else if(result.INFO.data_type=="C"){

					dtcLayer.CSV.addLayer(result);

				} else if(result.INFO.data_type=="I"){

					dtcLayer.IMG.addLayer(result);

				} else if(result.INFO.data_type == "T") {

					dtcLayer.TERRAIN.addLayer(result);

				}else if(result.INFO.data_type == "P"){

					dtcLayer.POINT.addLayer(result);

				}else if(result.INFO.data_type == "LD"){
					dtcLayer.DRONE_MODEL.addLayer(result);

				}else if(result.INFO.data_type == "Z3"){
					
					layerInfo.maxz = result.HEIGHT_INFO.max_height;
					
					dtcLayer.MODEL.addLayer(result);

				}else if(result.INFO.data_type == "G"){

					dtcLayer.GPX.addLayer(result);

				}else if(result.INFO.data_type == "B"){

					dtcLayer.BIM.addLayer(result.INFO);

				}else if(result.INFO.data_type == "J"){

					dtcLayer.JPG.addLayer(result);

				}

				dtcLayer.global.layerVisbleList.push(layerInfo);
				
			}
		})
	},
	clonLayerInfo:function(obj,element,pos){

		var type = typeof obj.DATA_TYPE == 'undefined' ? obj.data_type:obj.DATA_TYPE;
		var objId = typeof obj.DATAID == 'undefined' ? obj.dataid : obj.DATAID;
		var objElement=$("#layerCloneObj").clone();
		var attrId = "memLayer_"+objId;
		var layerTitle = typeof obj.DATA_NAME == 'undefined' ? obj.data_name : obj.DATA_NAME;
		var thumb = typeof obj.THUMBNAIL_URL == 'undefined' ? obj.thumbnail_url : obj.THUMBNAIL_URL;
		var epsgCode = typeof obj.COORD_EPSG == 'undefined' ? obj.coord_epsg : obj.COORD_EPSG;
		var regDate = typeof obj.REG_DATE == 'undefined' ? obj.reg_date : obj.REG_DATE;
		var viewType = typeof obj.IMG_TYPE == 'undefined' ? obj.img_type : obj.IMG_TYPE;

		if(thumb=="default"){
			thumb="/assets/img/default.png";
		}

		if(layerTitle.length > 35){
			layerTitle=layerTitle.substring(0,35)+"...";
		}

		var checkBox = false;
		if(pos=='F'){
			//checkbox true;
			checkBox = true;
		}
		
		
		objElement.find('.media').find('img').attr('src',thumb);
		
		objElement.find('.layer_input_check').prop('checked',checkBox);

		var iconClass="";
		var html="";
		var layerHtml="<span class=\"d-block mb-1 pb-1\"><i class=\"vacancy-tooltip far fa-map\"></i> "+epsgCode+"</span>\n";;		
		objElement.find('.dropdown-menu').empty();
		objElement.find('.media-body').find('div').empty();

		var layerNameVal = "meta_asset_"+objId;

		if(type=="T"){
			
			objElement.find('.layer_input_check').addClass('layer_dem_check');
			objElement.find('.layer_dem_check').removeClass('layer_input_check');
			objElement.find('.layer_dem_check').next().next().text(layerTitle);
			objElement.find('.layer_dem_check').val(layerNameVal);
			objElement.find('.layer_dem_check').attr('id',attrId);
			objElement.find('.layer_dem_check').next().val(type);
		
			var demHtml="<a class=\"dropdown-item\" href=\"javascript:dtcFile.getLayerInfo('"+objId+"');\"><span class=\"fas fa-info\"></span> 정보</a>\n<a class=\"dropdown-item\" href=\"javascript:dtcFile.delete('"+objId+"')\"><span class=\"far fa-trash-alt\"></span> 삭제</a>\n"

			objElement.find('.text-right').empty();
			objElement.find('.text-right').append('<div class=\"font-weight-bold text-primary ts-9\"><i class=\"fas fa-mountain\"></i> DEM</div>');

			objElement.find('.media-body').find('div').append(layerHtml);
			objElement.find('.dropdown-menu').append(demHtml);

			var regHtml ="<span class=\"d-block mb-1\">date: "+regDate+"</span>";
			objElement.find('.media-body').find('div').append(regHtml);
			
			//비동기로 레이어리스트가 그려지면 그 후,버튼 클릭으로 click이벤트를 추가하는 change 이벤트가 등록되기까지는 click이벤트가 걸리지않아서 버튼을 두 번 클릭해야했음.이를 임의로 change이벤트를 걸어서 click이벤트 초기화
			$(".layer_dem_check").trigger('change');

		}else{
			
			objElement.find('.layer_dem_check').addClass('layer_input_check');	
			objElement.find('.layer_input_check').removeClass('layer_dem_check');
				
			objElement.find('.layer_input_check').next().next().text(layerTitle);
			
			if(type=="DOCS"){
				//문서
				objElement.find('.layer_input_check').next().next().html('<a class="text-body ts-11 font-weight-semibold" href="javascript:dtcFile.type.docs.setDocsView('+objId+')">'+layerTitle+'</a>');
			
				html="<a class=\"dropdown-item\" href=\"javascript:dtcAiSetting.exportLayerData('"+objId+"')\"><span class=\"lnr lnr-bubble\"></span> "+"AI"+"</a>\n"
				html+="<a class=\"dropdown-item\" href=\"javascript:dtcFile.getLayerInfo('"+objId+"');\"><span class=\"fas fa-info\"></span> "+$.i18n.t('Index.nav.layer.layer_tabs.options.CSV.info')+"</a>\n";
				html+="<a class=\"dropdown-item\" href=\"javascript:dtcFile.delete('"+objId+"')\"><span class=\"far fa-trash-alt\"></span> "+$.i18n.t('Index.nav.layer.layer_tabs.options.CSV.del')+"</a>\n"
				
				layerHtml="";
				
				iconClass='<div class=\"font-weight-bold text-body ts-9\"><i class=\"fas fa-book\"></i> DOCS</div>';
	
			}else if(type=="S"){
			
				layerNameVal=obj.SHP_LAYER_FULLNAME;
			
				html="<a class=\"dropdown-item\" href=\"javascript:dtcFile.type.shp.exportShp('"+objId+"')\"><span class=\"fas fa-file-export\"></span> "+$.i18n.t('Index.nav.layer.layer_tabs.options.SHP.export')+"</a>\n"
				html+="<a class=\"dropdown-item\" href=\"javascript:dtcAiSetting.exportLayerData('"+objId+"')\"><span class=\"lnr lnr-bubble\"></span> "+"AI"+"</a>\n"
				html+="<a class=\"dropdown-item\" href=\"javascript:dtcFile.type.shp.getProperties('"+objId+"')\"><span class=\"fas fa-clipboard-list\"></span> "+$.i18n.t('Index.nav.layer.layer_tabs.options.SHP.attr')+"</a>\n"
				/*html+="<a class=\"dropdown-item\" href=\"javascript:dtcFile.type.shp.setStyle('"+objId+"');\"><span class=\"fas fa-border-style\"></span> 스타일 설정</a>\n";*/
				html+="<a class=\"dropdown-item\" href=\"javascript:D_LAYER_STYLE.SYMBOL.SHP.setStyle('"+objId+"');\"><span class=\"fas fa-border-style\"></span> "+$.i18n.t('Index.nav.layer.layer_tabs.options.SHP.style')+"</a>\n";
				html+="<a class=\"dropdown-item\" href=\"javascript:D_LAYER_STYLE.SYMBOL.SHP.showLegend('"+objId+"');\"><span class=\"fas fa-layer-group\"></span> "+$.i18n.t('Index.nav.layer.layer_tabs.options.SHP.legend')+"</a>\n";
				html+="<a class=\"dropdown-item\" href=\"javascript:dtcFile.getLayerInfo('"+objId+"');\"><span class=\"fas fa-info\"></span> "+$.i18n.t('Index.nav.layer.layer_tabs.options.SHP.info')+"</a>\n";
				html+="<a class=\"dropdown-item\" href=\"javascript:dtcFile.type.shp.deleteShp('"+objId+"')\"><span class=\"far fa-trash-alt\"></span> "+$.i18n.t('Index.nav.layer.layer_tabs.options.SHP.del')+"</a>\n"
				
				layerHtml+="<span class=\"d-block mb-1 pb-1\"><i class=\"vacancy-tooltip fas fa-border-style\"></i> "+obj.SHAPE_TYPE+"</span>";
				
				iconClass='<div class=\"font-weight-bold text-success ts-9\"><i class=\"far fa-square\"></i> SHAPE</div>';
	
			}else if(type=="I"){
				objElement.find('.layer_input_check').next().next().next().val(viewType);
				//html="<a class=\"dropdown-item\" href=\"javascript:dtcFile.type.image.exportImage('"+objId+"')\"><span class=\"fas fa-file-export\"></span> 내보내기</a>\n"
				//html+="<a class=\"dropdown-item\" href=\"javascript:dtcFile.type.image.getProperties('"+objId+"')\"><span class=\"fas fa-clipboard-list\"></span> 속성</a>\n"
				html+="<a class=\"dropdown-item\" href=\"javascript:dtcFile.getLayerInfo('"+objId+"');\"><span class=\"fas fa-info\"></span> 정보</a>\n";

				if(viewType=='S'){		
                    html+="             <a class=\"dropdown-item\" href=\"javascript:dtcFile.type.image.showLegend('"+objId+"')\"><span class=\"fas fa-layer-group\"></span> 범례 보기</a>\n"
                    html+="             <a class=\"dropdown-item\" href=\"javascript:dtcFile.type.image.editLegend('"+objId+"')\"><span class=\"fas fa-clipboard-list\"></span> 수정</a>\n"
					
                }
					html+="<a class=\"dropdown-item\" href=\"javascript:dtcFile.delete('"+objId+"')\"><span class=\"far fa-trash-alt\"></span> 삭제</a>\n"

				if(viewType=='S'){
					html+="				<div class=\"dropdown-divider\"></div>"
					html+="             <a class=\"dropdown-item pt-1 pb-1\">\n"
					html+="					<label class=\"form-check\">"
					html+="						<input class=\"form-check-input sb_layer_selected mt-1\" type=\"checkbox\" value="+objId+">";
					html+="						<div class=\"form-check-label\"> 선택</div>"
					html+="					</label>"
					html+="				</a>"        
				}
				
				layerHtml+="<span class=\"d-block mb-1 pb-1\"><i class=\"vacancy-tooltip fas fa-palette\"></i>band :"+obj.BANDS+"</span>";
				
				iconClass='<div class=\"font-weight-bold text-warning ts-9\"><i class=\"fas fa-images\"></i> IMAGE</div>';
	
			}else if(type=="C"){
	
				html="<a class=\"dropdown-item\" href=\"javascript:dtcFile.type.csv.exportCSV('"+objId+"')\"><span class=\"fas fa-file-export\"></span> "+$.i18n.t('Index.nav.layer.layer_tabs.options.CSV.export')+"</a>\n"
				html+="<a class=\"dropdown-item\" href=\"javascript:dtcAiSetting.exportLayerData('"+objId+"')\"><span class=\"lnr lnr-bubble\"></span> "+"AI"+"</a>\n"
				html+="<a class=\"dropdown-item\" href=\"javascript:dtcFile.type.csv.getProperties('"+objId+"')\"><span class=\"fas fa-clipboard-list\"></span> "+$.i18n.t('Index.nav.layer.layer_tabs.options.CSV.attr')+"</a>\n"
				html+="<a class=\"dropdown-item\" href=\"javascript:dtcFile.getLayerInfo('"+objId+"');\"><span class=\"fas fa-info\"></span> "+$.i18n.t('Index.nav.layer.layer_tabs.options.CSV.info')+"</a>\n";
				html+="<a class=\"dropdown-item\" href=\"javascript:dtcFile.delete('"+objId+"')\"><span class=\"far fa-trash-alt\"></span> "+$.i18n.t('Index.nav.layer.layer_tabs.options.CSV.del')+"</a>\n"
				
				layerHtml+="<span class=\"d-block mb-1 pb-1\"><i class=\"vacancy-tooltip fas fa-border-style\"></i> CSV</span>";
				
				iconClass='<div class=\"font-weight-bold text-info ts-9\"><i class=\"fas fa-file-csv\"></i> CSV</div>';
	
			}else if(type=="P"){
				
				html="<a class=\"dropdown-item\" href=\"javascript:dtcFile.type.point.edit('"+objId+"')\"><span class=\"fas fa-crop-alt\"></span> "+$.i18n.t('Index.nav.layer.layer_tabs.options.POINT_C.edit')+"</a>\n"
				html+="<a class=\"dropdown-item\" href=\"javascript:dtcFile.getLayerInfo('"+objId+"');\"><span class=\"fas fa-info\"></span> "+$.i18n.t('Index.nav.layer.layer_tabs.options.POINT_C.info')+"</a>\n";
				html+="<a class=\"dropdown-item\" href=\"javascript:dtcFile.delete('"+objId+"')\"><span class=\"far fa-trash-alt\"></span> "+$.i18n.t('Index.nav.layer.layer_tabs.options.POINT_C.del')+"</a>\n"
				iconClass='<div class=\"font-weight-bold text-primary ts-9\"><i class=\"fas fa-dot-circle\"></i> POINT CLOUD</div>';

			}else if(type=="LD"){

				html="<a class=\"dropdown-item\" href=\"javascript:dtcFile.type.drone.setRatio('"+objId+"')\"><span class=\"fas fa-cog\"></span> "+$.i18n.t('Index.nav.layer.layer_tabs.options.DRONE_3D.setting')+"</a>\n"
				html+="<a class=\"dropdown-item\" href=\"javascript:dtcFile.getLayerInfo('"+objId+"');\"><span class=\"fas fa-info\"></span> "+$.i18n.t('Index.nav.layer.layer_tabs.options.DRONE_3D.info')+"</a>\n";
				html+="<a class=\"dropdown-item\" href=\"javascript:dtcFile.delete('"+objId+"')\"><span class=\"far fa-trash-alt\"></span> "+$.i18n.t('Index.nav.layer.layer_tabs.options.DRONE_3D.del')+"</a>\n"
				iconClass='<div class=\"font-weight-bold text-primary ts-9\"><i class=\"fab fa-bandcamp\"></i> DRONE 3D</div>';

			}else if(type=="Z3"){
			
				html="<a class=\"dropdown-item\" href=\"javascript:dtcFile.type.model.property('"+objId+"')\"><span class=\"fas fa-clipboard-list\"></span> 속성</a>\n"
				html+="<a class=\"dropdown-item\" href=\"javascript:dtcFile.getLayerInfo('"+objId+"');\"><span class=\"fas fa-info\"></span> 정보</a>\n";
				html+="<a class=\"dropdown-item\" href=\"javascript:dtcFile.delete('"+objId+"')\"><span class=\"far fa-trash-alt\"></span> 삭제</a>\n"
				
				iconClass='<div class=\"font-weight-bold text-primary ts-9\"><i class=\"fas fa-project-diagram\"></i> 3DS</div>';

			}else if(type=="G"){
				//html="<a class=\"dropdown-item\" href=\"javascript:dtcFile.type.gpx.export('"+objId+"')\"><span class=\"fas fa-file-export\"></span> 내보내기</a>\n";
				html+="<a class=\"dropdown-item\" href=\"javascript:dtcFile.getLayerInfo('"+objId+"');\"><span class=\"fas fa-info\"></span> 정보</a>\n";
           		html+="<a class=\"dropdown-item\" href=\"javascript:dtcFile.delete('"+objId+"')\"><span class=\"far fa-trash-alt\"></span> 삭제</a>\n"        
				
				iconClass='<div class=\"font-weight-bold text-success ts-9\"><i class=\"fas fa-route\"></i> GPX</div>';
			}else if(type=="B"){
				html+="<a class=\"dropdown-item\" href=\"javascript:dtcFile.getLayerInfo('"+objId+"');\"><span class=\"fas fa-info\"></span> 정보</a>\n";
           		html+="<a class=\"dropdown-item\" href=\"javascript:dtcFile.delete('"+objId+"')\"><span class=\"far fa-trash-alt\"></span> 삭제</a>\n"        
				
				iconClass='<div class=\"font-weight-bold text-danger ts-9\"><i class=\"fas fa-route\"></i> BIM</div>';
			}else if(type=="J"){
				html+="<a class=\"dropdown-item\" href=\"javascript:dtcFile.getLayerInfo('"+objId+"');\"><span class=\"fas fa-info\"></span> 정보</a>\n";
           		html+="<a class=\"dropdown-item\" href=\"javascript:dtcFile.delete('"+objId+"')\"><span class=\"far fa-trash-alt\"></span> 삭제</a>\n"        
				
				iconClass='<div class=\"font-weight-bold text-warning ts-9\"><i class=\"fas fa-route\"></i> JPG</div>';
			}else if(type=="DXF"){
				layerNameVal=obj.SHP_LAYER_FULLNAME;

				html+="<a class=\"dropdown-item\" href=\"javascript:dtcFile.getLayerInfo('"+objId+"');\"><span class=\"fas fa-info\"></span> 정보</a>\n";
				//html+="<a class=\"dropdown-item\" href=\"javascript:dtcFile.type.shp.setStyle('"+objId+"');\"><span class=\"fas fa-border-style\"></span> 스타일 설정</a>\n";
           		html+="<a class=\"dropdown-item\" href=\"javascript:dtcFile.delete('"+objId+"')\"><span class=\"far fa-trash-alt\"></span> 삭제</a>\n"        
				iconClass='<div class=\"font-weight-bold text-danger ts-9\"><i class=\"far fa-square\"></i> DXF</div>';
			}
			
			objElement.find('.layer_input_check').val(layerNameVal);
			objElement.find('.layer_input_check').next().val(type);
			objElement.find('.layer_input_check').attr('id',attrId);

			objElement.find('.text-right').empty();
			objElement.find('.text-right').append(iconClass);

			objElement.find('.media-body').find('div').append(layerHtml);
			objElement.find('.dropdown-menu').append(html);

			var regHtml ="<span class=\"d-block mb-1\">date: "+regDate+"</span>";
			objElement.find('.media-body').find('div').append(regHtml);
		}
		
		objElement.show();
	
		if(pos=='E'){
			objElement.appendTo('#'+element);
		}else{
			objElement.prependTo('#'+element);
		}
		if(type=="DOCS"){
			//문서
			$("#"+attrId).parent().children(".custom-control-label").removeClass("custom-control-label");

		}

	},
	saveSampleData:function(){
        COMMON.blockUIdiv("layout-inner","샘플 데이터 불러오는 중");
	    $.ajax({
	        url:"/ide/saveSampleData.do",
	        type:'POST',
	        dataType:'json',
	        success:function(result){
	            if(result.RS == "complete"){
					//csv
	                var globalCsvData ={
	                    layerName:"(SAMPLE) 경강선 역위치",
	                    type:"L",
	                    addrIndx:"N/A",
	                    lon:"3",
	                    lat:"4",
	                    marker:"2",
	                    encoding:"utf-8",
	                    makerType:"0",
	                    color:"#000000",
	                    groupCheck:0,
	                    img:null,
	                    dataId:result.DATAID_CSV,
	                    desc:"국가철도공단에서 제공하는 경강선 역 위치 데이터(CSV)입니다.",
						epsg:"EPSG:4326"
	                }
	                 $.ajax({
	                    url:'/ide/getCsvThumb.do',
	                    type:'POST',
	                    data:globalCsvData,
	                    dataType:'json',
	                    success:function(resultThumb){
	                        if(resultThumb.IMG_SRC != null){
	                            var data = {
	                                DATAID: result.DATAID_CSV,
	                                TYPE: "C",
	                                LAYERNAME: "(SAMPLE) 경강선 역위치",
	                                MID: D_MEMBER.MID,
	                                MAKER_TITLE: "2",
	                                SERVER: "L",
	                                AREATYPE:0,
	                                ENCODING:"utf-8",
	                                THUMB:resultThumb.IMG_SRC,
	                                DESC:"국가철도공단에서 제공하는 경강선 역 위치 데이터(CSV)입니다.",
	                                minx:resultThumb.MINX,
	                                miny:resultThumb.MINY,
	                                maxx:resultThumb.MAXX,
	                                maxy:resultThumb.MAXY,
	                                MAKER_TYPE:0,
	                                LON_INDX:"3",
	                                LAT_INDX:"4",
									EPSG: "EPSG:4326",
									GEO_ADDR_INDX: "N/A",
	                                HEXCOLOR:"#000000"
	                            }
	                            $.ajax({
	                                url: '/geocoding/convertCsvData.do',
	                                type: 'POST',
	                                data: data,
	                                dataType: 'json',
	                                success: function(resultView) {
	                                    $(".layer_type_check[value=C],.layer_type_check[value=S]").prop("checked",true);
										setTimeout(function(){
			                                $("#layerDataSearchBtn").click();
			                            },1000)
                                        COMMON.unblockUIdiv("layout-inner");
	                                }
	                            });
	                        }
	                    }
	                });
					//shp
					$.ajax({
	                    url:'/ide/getShpThumb.do',
	                    type:'POST',
	                    data:{dataId:result.DATAID_SHP},
	                    dataType:'json',
						success:function(resultThumb){
			                var data = {
			                    DATAID: result.DATAID_SHP,
			                    TYPE: "S",
			                    LAYERNAME: "(SAMPLE) 바닷가 공간정보",
			                    CHARSET:"cp949",
			                    PROJ: "EPSG:5179",
			                    MID: D_MEMBER.MID,
			                    GEO_TYPE:"MultiPolygon",
			                    CHECk3D:"",
			                    IMG_SRC:resultThumb.IMG_INFO,
			                    DESC:"해양수산부에서 제공하는 바닷가 공간정보(SHAPE)입니다."
			                }
							dtcFile.type.shp.uploadCloudShpServer(data, function(resultUpload) {
                                dtcLayer.global.sampleFlag = true;
		                    });
						}
                    })
	            }
	        }
	    });
	},
	DRONE_MODEL:{
		layer:null,
		layerList:null,
		addLayer:function(obj) {
			
			//return;
			//var layerName = "META_ASSET_"+obj.INFO.dataid;
			var layerName = "meta_asset_"+obj.INFO.dataid;

			if(dtcLayer.global.layerList ==null){
				dtcLayer.global.layerList = new Module.JSLayerList(true);
			}
                        
			//dtcLayer.global.layerList.SyncLayer();
			dtcLayer.DRONE_MODEL.layer = dtcLayer.global.layerList.nameAtLayer(layerName);

			if( dtcLayer.DRONE_MODEL.layer == null) {
				if(obj.INFO.state == 20) {
					// Module.XDEMapCreateLayer(""+rs.XDLAYER_NAME+"","http://con.terrasense.co.kr:8080",0,false,true,false,20,12,12,40); // dorne model
					// Module.setVisibleRange(""+rs.XDLAYER_NAME+"", 1.0, 10000);

					Module.XDEMapCreateLayer(layerName, "//"+dtcCom.host+""+obj.INFO.meta_out_url+"", 0, false, true, true, 20, 12, 12);

					// LOD 조정
					//dtcLayer.global.layerList.SyncLayer();
					var layer = dtcLayer.global.layerList.nameAtLayer(layerName);
					if (layer != null) {
						layer.setLODRatio(0.3);
					}
					if(dtcSaveMap.global.isLoadMap){
						
						setTimeout(function() {
							//Module.getViewCamera().setLocation(new Module.JSVector3D(obj.INFO.center_x, obj.INFO.center_y, 500));
							Module.getViewCamera().setLocation(new Module.JSVector3D(obj.INFO.move_lon, obj.INFO.move_lat, 500));
						}, 500);
					}

				}
			} else {
				return;
			}

			
		}
	},
	SHP:{
		layer:null,
		layerList:null,
		addShapeLayer:function() {

			if(dtcLayer.SHP.layerName != null){
				dtcLayer.global.layerList.delLayerAtName("layerWMS");
			}
		
			var dataList;
			var layerName = "";
			if(window.location.href.indexOf("/layer/galleryView.do") <= -1
				&& window.location.href.indexOf("/layer/gallery.do") <= -1
				&& window.location.href.indexOf("/layer/loadMapInfo.do") <= -1){
				dataList = $("#memberLayerLists input[type=checkbox]:checked,#shareLayerLists input[type=checkbox]:checked");
				if(dataList.length > 0){
				    var dataType = $(dataList[0]).parent().children(".layerDataTypeInfo").val();
					
					if(dataType == "S" || dataType == "DXF"){
						layerName = dataList[0].value;
					}
	
					if(dataList.length > 1){
						for(var i=1;i<dataList.length;i++){
							var data = dataList[i].value;
						    var dataType = $(dataList[i]).parent().children(".layerDataTypeInfo").val();
							if(dataType == "S" || dataType == "DXF"){
								//data = data.split(":")[1];
								if(layerName == ""){
									layerName = dataList[i].value;
								}else{
									layerName += ","+data;
								}
							}
						}
					}
				}
			} else {
				dataList = $('#basicLayerTree').jstree('get_checked',true);
				if(dataList.length > 0){
				    var dataType = dataList[0].original.type;
					if(dataType == "S" || dataType == "DXF" || dataType == "GJ"){
						layerName = dataList[0].original.name;
					}
					if(dataList.length > 1){
						for(var i=1;i<dataList.length;i++){
							var data = dataList[i].original.name;
						    var dataType = dataList[i].original.type;
							if(dataType == "S" || dataType == "DXF" || dataType == "GJ"){
								//data = data.split(":")[1];
								if(layerName == ""){
									layerName = dataList[i].original.name;
								}else{
									layerName += ","+data;
								}
							}
						}
					}
				}
			}
			dtcLayer.SHP.layerName = layerName;
			return layerName;
		},
		addLayer:function(obj) {

			//
			//dtcLayer.global.layerOnList


			var layerName = obj.INFO.shp_layer_fullname;
		
			var minx = obj.INFO.minx;
			var miny = obj.INFO.miny;
			var maxx = obj.INFO.maxx;
			var maxy = obj.INFO.maxy;

			var url = obj.INFO.shp_url;

			var layerList = new Module.JSLayerList(false);
			
			layerName = dtcLayer.SHP.addShapeLayer();

			if(D_MEMBER.DLID==11){
				if(layerName != ""){
					layerName+=",knps_demo:user_shp_knps_demo_1638772459982";
				}else{
					layerName+="knps_demo:user_shp_knps_demo_1638772459982";
				}
				
			}
			
			if(layerName == ""){
				layerList.delLayerAtName("layerWMS");
				return false;
			}
			if(layerList.nameAtLayer("layerWMS") == null){
				layerList.createWMSLayer("layerWMS");
			}
			dtcLayer.SHP.layer = layerList.nameAtLayer("layerWMS");

			var geoserver_url = dtcCom.geo_url();

			let slopeoption = {
				url: "//"+geoserver_url+"/wms?",
				layer: layerName,
				minimumlevel: 3,
				maximumlevel: 21,
				tilesize: 256,
				crs: "EPSG:4326",
				parameters: {
					version: "1.1.0"
				}
			};

			if (dtcLayer.SHP.layer != null) {

				dtcLayer.SHP.layer.setWMSProvider(slopeoption);
				dtcLayer.SHP.layer.setBBoxOrder(true);
				dtcLayer.SHP.layer.clearWMSCache();
			}
			
			if(dtcSaveMap.global.isLoadMap){
				setTimeout(function(){
					Module.getViewCamera().moveLonLatBoundary(new Module.JSVector2D(parseFloat(minx), parseFloat(miny)),new Module.JSVector2D(parseFloat(maxx), parseFloat(maxy)));
				},500)
			}
		},
		delLayer:function(obj) {

			var layerName = obj.INFO.shp_layer_fullname;
		
			var minx = obj.INFO.minx;
			var miny = obj.INFO.miny;
			var maxx = obj.INFO.maxx;
			var maxy = obj.INFO.maxy;

			var url = obj.INFO.shp_url;

			if(dtcLayer.global.layerList ==null){
				dtcLayer.global.layerList = new Module.JSLayerList(true);
			}	
			
			layerName = dtcLayer.SHP.addShapeLayer();

			if(layerName == ""){
				
				//dtcLayer.global.layerList.delLayerAtName("layerWMS");
				//Module.deleterSyncLayer("layerWMS"); 
				return false;
			}
			
			var layerList = new Module.JSLayerList(false);
			if(layerList.nameAtLayer("layerWMS") == null){
				layerList.createWMSLayer("layerWMS");
			}
			dtcLayer.SHP.layer = layerList.nameAtLayer("layerWMS");
			
			var geoserver_url = dtcCom.geo_url();

			let slopeoption = {
				url: "//"+geoserver_url+"/wms?",
				layer: layerName,
				minimumlevel: 3,
				maximumlevel: 21,
				tilesize: 256,
				crs: "EPSG:4326",
				parameters: {
					version: "1.1.0"
				}
			};

			if (dtcLayer.SHP.layer != null) {

				dtcLayer.SHP.layer.setWMSProvider(slopeoption);
				dtcLayer.SHP.layer.setBBoxOrder(true);
				dtcLayer.SHP.layer.clearWMSCache();
			}
		},
		getSingleProperty:function(e){
			
			if(dtcLayer.global.shpLayerList.length != 0){

				var pos = new Module.JSVector2D(e.offsetX,e.offsetY);	
				var mapPos =Module.getMap().ScreenToBoundBox(pos, 3);
				
				var minx = mapPos.return.min.Longitude;
				var miny = mapPos.return.min.Latitude;
				var minHeight = mapPos.return.min.Altitude;
				
				var maxx = mapPos.return.max.Longitude;
				var maxy = mapPos.return.max.Latitude;
				var maxHeight = mapPos.return.max.Altitude;
				
				var screenPosMin = Module.getMap().MapToScreenPointEX(new Module.JSVector3D(minx, miny, minHeight));
				var screenPosMax = Module.getMap().MapToScreenPointEX(new Module.JSVector3D(maxx, maxy, maxHeight));

				var width = Math.abs(screenPosMax.x - screenPosMin.x);
				var height = Math.abs(screenPosMax.y - screenPosMin.y);

				var data={
					minx : minx,
					miny : miny,
					maxx : maxx,
					maxy : maxy,
					layers : dtcLayer.global.shpLayerList.toString()
				}

				dtcLayer.SHP.getFeatureInfo(data,function(result){
					//console.log(result);
					if(result.STATUS==200){
						$("#shpSinglepropertyBody").empty();
							
							var geometryType = result.INFO.GEO_TYPE;
							var properties = result.INFO;

							var cssCheck = $("#singleShpProperties").css('display');

							var html="";

							for(key in properties){

								if(key != 'geom' && key !='gid' && key !='GEO_TYPE' && key !='geomjson'){
									html +="<tr>\n";
									html +="	<td>"+key+"</td>\n";	
	
									var value = properties[key];
	
									if(value =='undefined' || value==null){
										value="";
									}
	
									html +="	<td>"+value+"</td>\n";
									html +="</tr>\n";
								}if(key =='geomjson'){
									var value = properties[key];
									value = JSON.parse(value);
									dtcLayer.SHP.getFeatureLine(value.type, value.coordinates);
								}
							
							}
							
							$("#shpSinglepropertyBody").append(html);
							$("#geometryTypeStr").text(geometryType);

							if(cssCheck=="none"){
								$("#singleShpProperties").show();
							}

					}
				})
				
				/*var geoserver_url = dtcCom.geo_url();

				var url = "//"+geoserver_url+"/wms?request=GetFeatureInfo";
				var param = "&service=WMS";
					param +="&version=1.1.0"
					param +="&layers="+encodeURIComponent(dtcLayer.global.shpLayerList.toString());
					param +="&styles=";
					param +="&srs=EPSG%3A4326";
					param +="&format=image%2Fpng"
					param +="&bbox="+encodeURIComponent(minx+","+miny+","+maxx+","+maxy);
					param +="&width="+width;
					param +="&height="+height;
					param +="&query_layers="+encodeURIComponent(dtcLayer.global.shpLayerList.toString());
					param +="&info_format=application/json";
					param +="&feature_count=50";
					param +="&x="+width;
					param +="&y="+height;
					param +="&exceptions=application%2Fvnd.ogc.se_xml";					

				$.ajax({
					url:url+param,
					type:'POST',
					data:data,
					success:function(result){

						if(typeof result === 'object' && result.features.length != 0){

							$("#shpSinglepropertyBody").empty();
							
							var geometryType = result.features[0].geometry.type;
							var properties = result.features[0].properties;

							var cssCheck = $("#singleShpProperties").css('display');

							var html="";

							for(key in properties){
								html +="<tr>\n";
								html +="	<td>"+key+"</td>\n";	

								var value = properties[key];

								if(value =='undefined' || value==null){
									value="";
								}

								html +="	<td>"+value+"</td>\n";
								html +="</tr>\n";	
							}
							
							$("#shpSinglepropertyBody").append(html);
							$("#geometryTypeStr").text(geometryType);

							if(cssCheck=="none"){
								$("#singleShpProperties").show();
							}

						}

					}
				})*/
			}
		},
		getFeatureLine:function(_type, _vertices){
			
			var layerList = new Module.JSLayerList(true);
			if(layerList.nameAtLayer("global_feature_line_layer") != null){
				layerList.delLayerAtName("global_feature_line_layer");
			}
			var layerList = new Module.JSLayerList(true);
			var layer = layerList.createLayer("global_feature_line_layer", Module.ELT_3DLINE);
			layer.setMaxDistance(21000000.0);
	
			
			if(_type =="MultiPoint"){
				var x = _vertices[0][0];
				var y = _vertices[0][1];
				_vertices = [];
				_vertices.push(x,y);
			}
			if(_type.indexOf("Point") > -1){
				// 원 버텍스 입력 후 반환
				var map = Module.getMap();
				map.setCircleInputPoint(new Module.JSVector2D(_vertices[0], _vertices[1]), 0.01*500, 20);
				var circleVertices = map.getInputPoints();
		
				// 고도 적용
				var resultVertices = new Module.JSVec3Array();
				for (var i=0; i<circleVertices.count(); i++) {
					resultVertices.push(new Module.JSVector3D(circleVertices.get(i).Longitude, circleVertices.get(i).Latitude, 1000));
				}
				_vertices = [];
				var list = Module.getMap().getInputPoints();
				
				for(var i=0;i<list.count();i++){
				    var vPosition = new Module.JSVector2D(list.get(i).Longitude, list.get(i).Latitude);
				    _vertices.push([vPosition.x,vPosition.y]);
				}
				
			    var vPosition = new Module.JSVector2D(list.get(0).Longitude, list.get(0).Latitude);
			    _vertices.push([vPosition.x,vPosition.y]);
				Module.getMap().clearInputPoint();
				_vertices = [[_vertices]];
			}
			
			if(_type.indexOf("Line") > -1){
				_vertices = [_vertices];
			}
			if(_vertices.length > 0){
				var color = new Module.JSColor(255, 0, 0);
				_vertices = _vertices[0];
				for(var k=0;k<_vertices.length;k++){
					var _verticesList = _vertices[k];
					for(var j=0;j<_verticesList.length;j++){
						_verticesList[j].push(200);
					}
					
					// 폴리곤 객체 생성
					var line = Module.createLineString("line1");
			
					// 폴리곤 색상 설정
					var lineStyle = new Module.JSPolyLineStyle();
					lineStyle.setColor(color);
					lineStyle.setWidth(5.0);
					line.setStyle(lineStyle);
			
					// 버텍스 배열 생성
					var vertex = new Module.JSVec3Array();
					for (var i=0; i<_verticesList.length; i++) {
						vertex.push(new Module.JSVector3D(_verticesList[i][0], _verticesList[i][1], _verticesList[i][2]));
					}
			
					var part = new Module.Collection();
					part.add(_verticesList.length);
			
					line.setPartCoordinates(vertex, part);
							
					// 레이어에 객체 추가
					layer.addObject(line, 0);
					
				}
			}		
		},
		getFeatureInfo:function(data,callback){

			$.ajax({
				url:'/geodt/getFeatureInfo.do',
				type:'POST',
				data:data,
				dataType:'json',
				success:function(result){
					callback(result);
				}
			})
		}
	},
	CSV:{
		global:{
			POI:null,
			poiLayer:null,
			clusteringLayer:{},
			layerList:null,
			GROUP_POI:null
		},
		addLayer:function(obj){

			//var layerName = obj.INFO.csv_layer_name;
			var dataId = obj.INFO.dataid;
			var layerName ="meta_asset_"+dataId;
			var workspace = obj.INFO.csv_db_name;
			var csvLayer = obj.INFO.csv_layer_name;
			var poiColor = obj.INFO.poi_color;
			var poiType = obj.INFO.poi_type;
			var props = obj.prop_name;
			props = props.replace(/_/gi, "").replace(/\s*/g, "");
			var encodeProps = encodeURI(props);
			var visibleType=obj.INFO.area_type;

			var minx = obj.INFO.minx;
			var miny = obj.INFO.miny;
			var maxx = obj.INFO.maxx;
			var maxy = obj.INFO.maxy;

			//Module.setLimitObjectMax(5);

			var host = window.location.host;
			var layerList = new Module.JSLayerList(false);

			if(poiType=="0"){

				dtcLayer.CSV.global.POI= dtcLayer.CSV.createPoiImg(poiColor);
				dtcLayer.CSV.global.GROUP_POI = dtcLayer.CSV.createGroupPoiImg(poiColor);
				
				Module.XDEMapCreateLayer(layerName, "https://www.egiscloud.com/csv/"+visibleType+"/"+workspace+"/"+csvLayer+"/"+encodeProps, 0, true, true, true, 22, 0, 15);
				Module.setVisibleRange(layerName,4.0,30000);

				var layer = layerList.nameAtLayer(layerName);
                layer.setUserTileJsonParsing(false);

				layer.setUserTileLoadCallback(function(_layerName,_tile,_data){
					const stringFromBinary = new TextDecoder('utf-8').decode(_data);
					const jsonObject = JSON.parse(stringFromBinary);
					
					if(typeof jsonObject.status != 'undefined' && jsonObject.status=='no'){
						return false;
					}

					dtcLayer.CSV.insertTileObj(_layerName,_tile,jsonObject,null,poiColor,visibleType);

				});


			}else if(poiType=="1"){
				
				dtcLayer.CSV.global.GROUP_POI = dtcLayer.CSV.createGroupPoiImg("#258FFF");

				dtcLayer.CSV.createImagePoi(obj.INFO.poi_file_url,function(_image){
					
					Module.XDEMapCreateLayer(layerName, "https://www.egiscloud.com/csv/"+visibleType+"/"+workspace+"/"+csvLayer+"/"+encodeProps, 0, true, true, true, 22, 0, 15);
					Module.setVisibleRange(layerName,4.0,30000);

					var layer = layerList.nameAtLayer(layerName);
					layer.setUserTileJsonParsing(false);

					layer.setUserTileLoadCallback(function(_layerName,_tile,_data){
						const stringFromBinary = new TextDecoder('utf-8').decode(_data);
						const jsonObject = JSON.parse(stringFromBinary);
						
						if(typeof jsonObject.status != 'undefined' && jsonObject.status=='no'){
							return false;
						}

						dtcLayer.CSV.insertTileObj(_layerName,_tile,jsonObject,_image,"#258FFF",visibleType);

					});
				});
				
			}else if(poiType=="2"){
				//3ds 가시화
				dtcLayer.CSV.global.GROUP_POI = dtcLayer.CSV.createGroupPoiImg("#258FFF");

				var texture =  obj.INFO.poi_texture_name;
				var modelUrl = obj.INFO.poi_file_url;

				var url = "//"+dtcCom.host+modelUrl;
				var modelFileName = texture.split("\.")[0]+".3ds";
				Module.getGhostSymbolMap().insert({
					id:dataId.toString(),
					texture:texture,
					url:url+modelFileName,
					callback:function(e){
						
						var key = e.id
						
						var textImgName = e.texture;
						var urlTexture = url+textImgName;

						Module.getGhostSymbolMap().setModelTexture({
							id:key,
							face_index:0,
							url:urlTexture,
							callback:function(e){
								
							}
						})

					}
				})

				Module.XDEMapCreateLayer(layerName, "https://www.egiscloud.com/csv/"+visibleType+"/"+workspace+"/"+csvLayer+"/"+encodeProps, 0, true, true, true, 22, 0, 15);
				Module.setVisibleRange(layerName,4.0,30000);

				var layer = layerList.nameAtLayer(layerName);
				layer.setUserTileJsonParsing(false);

				layer.setUserTileLoadCallback(function(_layerName,_tile,_data){
					const stringFromBinary = new TextDecoder('utf-8').decode(_data);
					const jsonObject = JSON.parse(stringFromBinary);
					
					if(typeof jsonObject.status != 'undefined' && jsonObject.status=='no'){
						return false;
					}

					dtcLayer.CSV.insertTileGhostSymbol(_layerName,_tile,jsonObject,"#258FFF",visibleType,dataId.toString());

				});

			}
			if(Module.XDGetMouseState()==1){
				Module.XDSetMouseState(6);
				Module.canvas.addEventListener('Fire_EventSelectedObject',dtcLayer.CSV.getSingleCsvProperty);
			}
			if(dtcSaveMap.global.isLoadMap){
				Module.getViewCamera().moveLonLatBoundary(new Module.JSVector2D(parseFloat(minx), parseFloat(miny)),new Module.JSVector2D(parseFloat(maxx), parseFloat(maxy)));
			}
			
		},
		getTileData:function(layerName, dbLayerName, titleColumn, visibleType, visibleColor, showType){
			Module.getMap().requestMeshLoadCallback(function(e){
				var tileLevel = e.level;
				var minX = e.minX;
				var minY = e.minY;
				var maxX = e.maxX;
				var maxY = e.maxY;
				dtcLayer.CSV.getLayerInfo(layerName, dbLayerName, titleColumn, visibleType, visibleColor, showType, minX, minY, maxX, maxY, tileLevel);
			});
		},
		getLayerInfo:function(layerName, dbLayerName, titleColumn, visibleType, visibleSetting, showType, minX, minY, maxX, maxY, level){
			
	  		var vPosition = new Module.JSVector2D(minX, minY);
	  		var LB_coord = Module.getProjection().convertProjection(13, vPosition, 20);
	  		vPosition = new Module.JSVector2D(maxX, maxY);
	  		var RT_coord = Module.getProjection().convertProjection(13, vPosition, 20);
			var ratio = (RT_coord.x - LB_coord.x) / 256
    	 	dtcLayer.CSV.global.ratio = ratio * 2;
			
			var url = "";
			url = "https://www.egiscloud.com/csvlayer/layerInfo.do?"
			+ "layerName=" + dbLayerName
			+ "&minx=" + minX
			+ "&miny=" + minY
			+ "&maxx=" + maxX
			+ "&maxy=" + maxY;
			fetch(url)
				.then(res=>res.json())
				.then(res=>{
				if(res.length > 5000){
					return;
				}
				if(res.length != 0){
					//console.log(level, res);
					//webworker > 
					var worker = new Worker('/assets/js/global/csvWorker.js');
					var param = {
						level:level,
						res:res,
						titleColumn:titleColumn
					}
					worker.postMessage(param); 
					worker.onmessage = event=>{
						var clustArr = event.data;
						var minPts = 30;
						if(showType == "1") minPts = 500;
						if(level < 14){
							dtcLayer.CSV.global.scan = jDBSCAN().eps(dtcLayer.CSV.global.ratio).minPts(minPts).distance('HAVERSINE').data(clustArr);
							dtcLayer.CSV.global.scan();
							dtcLayer.CSV.global.cluster = dtcLayer.CSV.global.scan.getClusters();
							dtcLayer.CSV.global.cluster.radius=dtcLayer.CSV.global.ratio;
						}else{
							dtcLayer.CSV.global.cluster = {}
							dtcLayer.CSV.global.cluster.cluster = [];
							dtcLayer.CSV.global.cluster.noise = clustArr;
						}
						dtcLayer.CSV.createCluster(layerName, level, visibleSetting, visibleType);
	                }
					
				}
			})
		},
		createCluster:function(layerName, level, visibleSetting, visibleType){
			var sourceInfo = {
				feature:{}
			};
			
			sourceInfo.level=level;
			sourceInfo.feature.cluster=dtcLayer.CSV.global.cluster.cluster;
			sourceInfo.feature.noise=dtcLayer.CSV.global.cluster.noise;
			if(dtcLayer.CSV.global.countIndx == undefined) dtcLayer.CSV.global.countIndx = 0;
			if(dtcLayer.CSV.global.features == undefined) dtcLayer.CSV.global.features  = [];
			sourceInfo.indx = dtcLayer.CSV.global.countIndx;
			dtcLayer.CSV.global.features.push(sourceInfo);
			
			dtcLayer.CSV.global.countIndx++;
			var clusterArr = dtcLayer.CSV.global.cluster.cluster;
			var noisesArr = dtcLayer.CSV.global.cluster.noise;
			
			var layerList = new Module.JSLayerList(true);
			var poiLayer = layerList.nameAtLayer(layerName);
			var min = 200;
			var max = min;
		    for(var i=15;i>=level;i--){
				min = max;
				max = min * 2.5;
		    }
			var minHeight = min;
			var maxHeight = max
			
			if(clusterArr.length != 0){
				
				for(var i =0;i<clusterArr.length;i++){
				
					var lon =clusterArr[i].location.longitude;
					var lat =clusterArr[i].location.latitude;
					var alt = Module.getMap().getTerrHeightFast(lon, lat);
					var count = clusterArr[i].dimension;
					var timeIndx = clusterArr[i].indx;
										
					var posObj = new Module.JSVector3D(lon,lat,alt);
					
					var clusterDom = document.createElement('div');
					
					var param = {
						position:posObj,
						container:'clusterParents',
						canvas:Module.canvas,
						element:clusterDom,
						verticalAlign: "middle",
						horizontalAlign: "center",
						minAltitude:parseInt(minHeight),
						maxAltitude:parseInt(maxHeight)
					}
					//console.log("cluster_level_"+level+"_indx_"+i);
					var key = "cluster_"+layerName+"_level_"+level+"_lon_"+(lon+"").replace(".","_")+"_lat_"+(lat+"").replace(".","_")+"_count_"+count;
					if(poiLayer.keyAtObject(key) == null){
						var clusterObj = Module.createHTMLObject(key);
						var rs = clusterObj.createbyJson(param);
					
						if(rs.result==1){
						
							poiLayer.addObject(clusterObj,0);
							
							var color = "#FFD950";
							if(visibleType=="0"){
								//포인트
								color = visibleSetting;
							}
						
							var circleDiv = document.createElement('div');
							circleDiv.style.width="30px;"
							circleDiv.style.height='30px';
							circleDiv.style.borderRadius='50%';
							circleDiv.style.zIndex='100';
							circleDiv.style.background=color+"a6";
							circleDiv.style.textAlign='center';
							circleDiv.style.boxShadow="0px 0px 3px 6px "+color+"57";
							
							var textSpan = document.createElement('span');
							textSpan.style.lineHeight='30px';
							textSpan.style.color='#ffffff';
							textSpan.style.verticalAlign='middle';
							textSpan.style.textShadow= '-1px -1px 3px #00000080, 1px -1px 3px #00000080, -1px 1px 3px #00000080, 1px 1px 3px #00000080';
							textSpan.innerHTML=count;
							
							circleDiv.appendChild(textSpan);
							
							clusterDom.style.zIndex='100';
							clusterDom.style.width='30px';
							clusterDom.style.height='30px';
							clusterDom.appendChild(circleDiv);
						}
					}
				}
			} else{
				//noise일 경우 8레벨보다 작을 때 visible 높이별 object visible 체크
				for(var i =0;i<noisesArr.length;i++){
					
					var lon =noisesArr[i].lon;
					var lat =noisesArr[i].lat;
					var alt = Module.getMap().getTerrHeightFast(lon, lat);
					var name = noisesArr[i].name;
					var gid= noisesArr[i].gid
					//중복 오브젝트 제거
					var key = "noise_"+layerName+"_gid_"+gid;
					if(poiLayer.keyAtObject(key) == null){
					
						var noisePosObj = new Module.JSVector3D(lon,lat,alt);
						
						var noiseDom = document.createElement('div');
						
						var param = {
							position:noisePosObj,
							container:'clusterParents',
							canvas:Module.canvas,
							element:noiseDom,
							verticalAlign: "middle",
							horizontalAlign: "center",
							minAltitude:0,
							maxAltitude:parseInt(maxHeight)
						}
						
						var noiseObj = Module.createHTMLObject(key);
						var rs = noiseObj.createbyJson(param);
						
						if(rs.result==1){
							
							poiLayer.addObject(noiseObj,0);
							
							var markerDiv = document.createElement('div');
							markerDiv.style.textAlign='center';
							markerDiv.style.marginTop='40px';
							if(visibleType=="0"){
								//포인트
								var point = Module.createPoint(gid+"");
								point.setPosition(new Module.JSVector3D(lon, lat, alt));
								var poi = dtcLayer.CSV.createPoiImg(visibleSetting);
								point.setImage(poi.data, poi.width, poi.height);
								//point.setVisibleRange(true,2.0,5000);
								poiLayer.addObject(point,0);
							}else if(visibleType=="1"){
								//이미지
								var point = Module.createPoint(gid+"");
								point.setPosition(new Module.JSVector3D(lon, lat, alt));
								point.setImage(visibleSetting.data, visibleSetting.width, visibleSetting.height);
								//point.setVisibleRange(true,2.0,5000);
								poiLayer.addObject(point,0);
							}else if(visibleType=="2"){
								//3ds 가시화
								var modelHeightInfo = Module.getGhostSymbolMap().getGhostSymbolSize(layerName);
								var newModel = Module.createGhostSymbol(gid+"");
								modelHeight = modelHeightInfo.height * 0.5;
								
								newModel.setBasePoint(0, -modelHeight*0.5, 0);
								newModel.setRotation(0, 0, 0);
								newModel.setScale(new Module.JSSize3D(1.0, 1.0, 1.0));
								newModel.setPosition(new Module.JSVector3D(parseFloat(lon), parseFloat(lat), parseFloat(alt)+modelHeight));
								newModel.setGhostSymbol(layerName);
								poiLayer.addObject(newModel,0);
							}
							
							var markerTxt = document.createElement('span');
							markerTxt.style.verticalAlign='bottom';
							markerTxt.style.fontSize='12px';
							markerTxt.style.fontWeight='bold';
							markerTxt.style.color='#ffffff';
							markerTxt.style.textShadow= '-1px -1px 3px #000, 1px -1px 3px #000, -1px 1px 3px #000, 1px 1px 3px #000';
							markerTxt.innerHTML=name;
							
							markerDiv.append(markerTxt);
							
							noiseDom.style.zIndex='100';
							noiseDom.appendChild(markerDiv);
							
						}
					}
				}
			}
			
			poiLayer.setMaxDistance(20000000);
			
		},
		addLayer_back:function(obj){
			
			//var layerName = obj.INFO.csv_layer_name;
			var layerName ="meta_asset_"+obj.INFO.dataid;
			
			var minx = obj.INFO.minx;
			var miny = obj.INFO.miny;
			var maxx = obj.INFO.maxx;
			var maxy = obj.INFO.maxy;

			var visibleType=obj.INFO.area_type;

			Module.setLimitObjectMax(5);

			var host = window.location.host;

			if(dtcLayer.global.layerList==null){
				dtcLayer.global.layerList=new Module.JSLayerList(true);
			}

			var onLayerInfo = {
				dataId:obj.INFO.dataid,
				type:'C'
			};

			dtcLayer.global.layersOnInfo.push(onLayerInfo);
			if(Module.XDGetMouseState()==1){
				Module.XDSetMouseState(6);
				Module.canvas.addEventListener('Fire_EventSelectedObject',dtcLayer.CSV.getSingleCsvProperty);
			}

			if(obj.INFO.poi_type=="0"){

				dtcLayer.CSV.global.POI= dtcLayer.CSV.createPoiImg(obj.INFO.poi_color);
				dtcLayer.CSV.global.GROUP_POI = dtcLayer.CSV.createGroupPoiImg(obj.INFO.poi_color);
				
				Module.XDEMapCreateLayer(layerName, "//"+host+obj.INFO.meta_out_url, 0, true, true, true, 22, 0, 15);
				Module.setVisibleRange(layerName,15.0,40000000);
				
				//dtcLayer.global.layerList.SyncLayer();

				dtcLayer.CSV.global.poiLayer = dtcLayer.global.layerList.nameAtLayer(layerName);
				dtcLayer.CSV.global.poiLayer.setUserTileLoadCallback(function(_layerName, _tile, _data){
					var data =  decodeURI(_data);
					//console.log(data);
					dtcLayer.CSV.insertTileObj(_layerName, _tile,data,null,obj.INFO.poi_color,visibleType);
					//dtcLayer.CSV.clustering(_tile,_data);
				});

			}else if(obj.INFO.poi_type=="1"){
				
				dtcLayer.CSV.global.GROUP_POI = dtcLayer.CSV.createGroupPoiImg("#FFD950");

				dtcLayer.CSV.createImagePoi(obj.INFO.poi_file_url,function(_image){
					Module.XDEMapCreateLayer(layerName, "//"+host+obj.INFO.meta_out_url, 0, true, true, true, 22, 0, 15);
					//Module.setVisibleRange(layerName,15.0,40000000);

					//dtcLayer.global.layerList.SyncLayer();

					//dtcLayer.global.layerList=new Module.JSLayerList(false);
					dtcLayer.CSV.global.poiLayer = dtcLayer.global.layerList.nameAtLayer(layerName);

					dtcLayer.CSV.global.poiLayer.setUserTileLoadCallback(function(_layerName, _tile, _data){
				
						var data =  decodeURI(_data);
						//console.log(data);
						dtcLayer.CSV.insertTileObj(_layerName, _tile,data,_image,"#FFD950",visibleType);
		
					});
				});
				
			}else if(obj.INFO.poi_type=="2"){
				//3ds 가시화
				dtcLayer.CSV.global.GROUP_POI = dtcLayer.CSV.createGroupPoiImg("#FFD950");

				var texture =  obj.INFO.poi_texture_name;
				var modelUrl = obj.INFO.poi_file_url;

				Module.XDEMapCreateLayer("meta_asset_"+obj.INFO.dataid, "//"+host+obj.INFO.meta_out_url, 0, true, true, true, 22, 0, 15);

				//dtcLayer.global.layerList.SyncLayer();

				var url = "//"+dtcCom.host+modelUrl;
				var modelFileName = texture.split("\.")[0]+".3ds";
				Module.getGhostSymbolMap().insert({
					id:obj.INFO.dataid.toString(),
					texture:texture,
					url:url+modelFileName,
					callback:function(e){
						
						var key = e.id
						
						var textImgName = e.texture;
						var urlTexture = url+textImgName;

						Module.getGhostSymbolMap().setModelTexture({
							id:key,
							face_index:0,
							url:urlTexture,
							callback:function(e){

								Module.XDEMapCreateLayer("meta_asset_"+obj.INFO.dataid, "//"+host+obj.INFO.meta_out_url, 0, true, true, true, 22, 0, 15);
								var layer = Module.getTileLayerList().nameAtLayer("meta_asset_"+obj.INFO.dataid);
								layer.setUserTileLoadCallback(function(_layerName, _tile, _data) {
									var data =  decodeURI(_data);
									dtcLayer.CSV.insertTileGhostSymbol(_layerName,_tile,data,obj.INFO.csv_layer_name,"#FFD950",visibleType,obj.INFO.dataid);
								})
								/*dtcLayer.CSV.global.poiLayer = dtcLayer.global.layerList.nameAtLayer("meta_asset_"+obj.INFO.dataid);
								dtcLayer.CSV.global.poiLayer.setUserTileLoadCallback(function(_layerName, _tile, _data){
									
									var data =  decodeURI(_data);
									dtcLayer.CSV.insertTileGhostSymbol(_layerName,_tile,data,obj.INFO.csv_layer_name,"#FFD950",visibleType,obj.INFO.dataid);
								})*/
							}
						})

					}
				})



				/*Module.getGhostSymbolMap().insert({
					id:obj.INFO.dataid.toString(),
					texture:texture,
					url:url+modelFileName,
					callback:function(e){
						
						var key = e.id
						
						var textImgName = e.texture;
						var urlTexture = url+textImgName;

						Module.getGhostSymbolMap().setModelTexture({
							id:key,
							face_index:0,
							url:urlTexture,
							callback:function(e){
								dtcLayer.CSV.global.poiLayer = dtcLayer.global.layerList.nameAtLayer("meta_asset_"+obj.INFO.dataid);
								dtcLayer.CSV.global.poiLayer.setUserTileLoadCallback(function(_layerName, _tile, _data){
									
									var data =  decodeURI(_data);
									dtcLayer.CSV.insertTileGhostSymbol(_layerName,_tile,data,obj.INFO.csv_layer_name,"#FFD950",visibleType,obj.INFO.dataid);
								})
							}
						})

					}
				})*/

			}

			
			if(dtcSaveMap.global.isLoadMap){
				Module.getViewCamera().moveLonLatBoundary(new Module.JSVector2D(parseFloat(minx), parseFloat(miny)),new Module.JSVector2D(parseFloat(maxx), parseFloat(maxy)));
			}
			
		},
		getSingleCsvProperty:function(e){
			console.log(e);
			var layerName = e.layerName;
			var dataId = layerName.split("\_")[2];
			var objIndx = e.objKey;

			var param ={
				dataid:dataId,
				objIndx:objIndx
			}

			$("#csvSinglepropertyBody").empty();
			$.ajax({
				url:'/geocoding/singleProperty.do',
				type:'post',
				data:param,
				dataType:'json',
				success:function(result){
					console.log(result);
					if(result.status==200){
						var properties = result.record;
						var html="";
					
						for(key in properties){

							html +="<tr>\n";
							html +="	<td nowrap>"+key+"</td>\n";	

							var value = properties[key];

							if(value =='undefined' || value==null){
								value="";
							}

							html +="	<td nowrap>"+value+"</td>\n";
							html +="</tr>\n";
						
						}
						
						$("#csvSinglepropertyBody").append(html);
						var cssCheck = $("#singleCsvProperties").css('display');

						if(cssCheck=="none"){
							$("#singleCsvProperties").show();
						}
					}
				}
			})
			
		},
		insertTileGhostSymbol(_layerName,_tile, _csvData,color,visibleType,dataId){

			var level = _tile.level;

			if(_csvData.points.length != 0){
				//포인트 그리기
				var layerList = new Module.JSLayerList(false);
				var poiLayer = layerList.nameAtLayer(_layerName);
				var points = _csvData.points;

				for(var i=0;i<points.length;i++){
				  
					var gid = points[i].gid;
				  
					if(poiLayer.keyAtObject(gid.toString()) == null){
						var geom = points[i].geometry.coordinates;
						var lon = geom[0];
						var lat = geom[1];
						var altitude = Module.getMap().getTerrHeightFast(lon, lat);
					  
						var name= points[i].props;
						var point = Module.createPoint(gid.toString());
						point.setPosition(new Module.JSVector3D(lon, lat, altitude));
						
						var modelHeight = Module.getGhostSymbolMap().getGhostSymbolSize(dataId);

						// 고스트 심볼 오브젝트 생성	
						var newModel = Module.createGhostSymbol(gid.toString());
						newModel.setBasePoint(0, -modelHeight.height*0.5, 0);
						newModel.setRotation(0, 0, 0);
						newModel.setScale(new Module.JSSize3D(1.0, 1.0, 1.0));
						newModel.setPosition(new Module.JSVector3D(parseFloat(lon), parseFloat(lat), parseFloat(altitude)));
						newModel.setGhostSymbol(dataId);
						
						point.setText(name);
						point.setMaxDistance(300);
						point.setMinDistance(10);

						_tile.addObject(newModel);
						_tile.addObject(point);
					}
					
				}
			}

			if(typeof _csvData.group != 'undefined' && typeof _csvData.group.cluster_center != 'undefined' && _csvData.group.count > 2){

				var pos = _csvData.group.cluster_center.coordinates;
				var lon = pos[0];
				var lat = pos[1];
				var name = _csvData.group.count;
				var point = Module.createPoint('cluster_cnt_'+name);
				var altitude = Module.getMap().getTerrHeightFast(lon, lat);

				point.setPosition(new Module.JSVector3D(lon, lat, altitude));

				//group poi 그리기
				var layerList = new Module.JSLayerList(true);
				var layer = layerList.nameAtLayer(_layerName+"_csv_clustering_layer_"+level);
				if(layer == null) {
					layer = layerList.createLayer(_layerName+"_csv_clustering_layer_"+level, Module.ELT_3DPOINT);
					layer.setMaxDistance(600000);
				}
				if(!(_layerName in dtcLayer.CSV.global.clusteringLayer)) dtcLayer.CSV.global.clusteringLayer[_layerName] = [];
				
				if(dtcLayer.CSV.global.clusteringLayer[_layerName].indexOf("csv_clustering_layer_"+level) < 0){
					dtcLayer.CSV.global.clusteringLayer[_layerName].push("csv_clustering_layer_"+level);
				}
				dtcLayer.CSV.global.clusteringLayer[_layerName] = dtcLayer.CSV.global.clusteringLayer[_layerName].sort();
				var max = 600000;
				var min = 600000;
				dtcLayer.CSV.global.clusteringLayer[_layerName].forEach(function(data){
					var layerLevel = parseInt(data.split("csv_clustering_layer_")[1]);
					for(var i=11;i>=layerLevel;i--){
						min = (max * 0.2);
					}
					layerList.nameAtLayer(_layerName+"_"+data).setMaxDistance(max);
					layerList.nameAtLayer(_layerName+"_"+data).setMinDistance(min);
					
					max = min;
				});

				dtcLayer.CSV.global.GROUP_POI.ctx.clearRect(0,0,dtcLayer.CSV.global.GROUP_POI.width,dtcLayer.CSV.global.GROUP_POI.height);

				var x = dtcLayer.CSV.global.GROUP_POI.width / 2;
				var y = dtcLayer.CSV.global.GROUP_POI.height / 2;

				// 동그라미 마커 이미지 그리기
				dtcLayer.CSV.global.GROUP_POI.ctx.beginPath();
				dtcLayer.CSV.global.GROUP_POI.ctx.arc(x, y, 20, 0, 2*Math.PI, false);
				dtcLayer.CSV.global.GROUP_POI.ctx.globalAlpha=0.7;
				dtcLayer.CSV.global.GROUP_POI.ctx.fillStyle = color;
				dtcLayer.CSV.global.GROUP_POI.ctx.fill();
				dtcLayer.CSV.global.GROUP_POI.ctx.lineWidth = 1;
				dtcLayer.CSV.global.GROUP_POI.ctx.strokeStyle = color;
				dtcLayer.CSV.global.GROUP_POI.ctx.stroke();
				dtcLayer.CSV.global.GROUP_POI.ctx.font='bold 15px Arial';
				dtcLayer.CSV.global.GROUP_POI.ctx.textAlign ="center";
				dtcLayer.CSV.global.GROUP_POI.ctx.fillStyle="white";
				dtcLayer.CSV.global.GROUP_POI.ctx.fillText(name,dtcLayer.CSV.global.GROUP_POI.width/2,(dtcLayer.CSV.global.GROUP_POI.height/2)+4);

				var dataBinary = dtcLayer.CSV.global.GROUP_POI.ctx.getImageData(0, 0, dtcLayer.CSV.global.GROUP_POI.width, dtcLayer.CSV.global.GROUP_POI.height).data
				point.setImage(dataBinary, dtcLayer.CSV.global.GROUP_POI.width, dtcLayer.CSV.global.GROUP_POI.height);

				layer.addObject(point,0);
			}
	
		},
		clustering:function(_tile,_csvData){
			/*let id, lon, lat, level, name;
			let strArray = _csvData.split(",");
			for (let item of strArray) {
				let itemArray = item.split(":");
				//  현재
				if (itemArray[0] == "id") id = itemArray[1];
				else if (itemArray[0] == "lon") lon = parseFloat(itemArray[1]);
				else if (itemArray[0] == "lat") lat = parseFloat(itemArray[1]);
				else if (itemArray[0] == "level") level = parseInt(itemArray[1]);
				else if (itemArray[0] == "name") name = itemArray[1];
		
				else if (itemArray[0] == "data") data = itemArray[1];
				else if (itemArray[0] == "wgs84Lon") lon = parseFloat(itemArray[1]);
				else if (itemArray[0] == "wgs84Lat") lat = parseFloat(itemArray[1]);
				else if (itemArray[0] == "dutyName") name = itemArray[1];
			}*/
			console.log(_csvData);

		},
		insertTileObj:function(_layerName,_tile,_csvData,poiImageData,color,visibleType){
			
			var level = _tile.level;

			if(_csvData.points.length != 0){
				//포인트 그리기
				var layerList = new Module.JSLayerList(false);
				var poiLayer = layerList.nameAtLayer(_layerName);
				var points = _csvData.points;

				for(var i=0;i<points.length;i++){
				  
					var gid = points[i].gid;
				  
					if(poiLayer.keyAtObject(gid.toString()) == null){
						var geom = points[i].geometry.coordinates;
						var lon = geom[0];
						var lat = geom[1];
						var altitude = Module.getMap().getTerrHeightFast(lon, lat);
					  
						var name= points[i].props;
						var point = Module.createPoint(gid.toString());
						point.setPosition(new Module.JSVector3D(lon, lat, altitude));
						if(poiImageData != null){
							point.setImage(poiImageData.data, poiImageData.width, poiImageData.height);//
						}else{
							point.setImage(dtcLayer.CSV.global.POI.data, dtcLayer.CSV.global.POI.width, dtcLayer.CSV.global.POI.height);//
							
						}
						
						point.setText(name);
						if(visibleType == 1){
							point.setMaxDistance(3000000);
						} 
						else{
							point.setMaxDistance(300000000);
						} 
						  
						 point.setMinDistance(10);

						_tile.addObject(point);
					}
					
				}
			}

			if(typeof _csvData.group != 'undefined' && typeof _csvData.group.cluster_center != 'undefined' && _csvData.group.count > 2){

				var pos = _csvData.group.cluster_center.coordinates;
				var lon = pos[0];
				var lat = pos[1];
				var name = _csvData.group.count;
				var point = Module.createPoint('cluster_cnt_'+name);
				var altitude = Module.getMap().getTerrHeightFast(lon, lat);

				point.setPosition(new Module.JSVector3D(lon, lat, altitude));

				//group poi 그리기
				var layerList = new Module.JSLayerList(true);
				var layer = layerList.nameAtLayer(_layerName+"_csv_clustering_layer_"+level);
				if(layer == null) {
					layer = layerList.createLayer(_layerName+"_csv_clustering_layer_"+level, Module.ELT_3DPOINT);
					layer.setMaxDistance(600000);
				}
				if(!(_layerName in dtcLayer.CSV.global.clusteringLayer)) dtcLayer.CSV.global.clusteringLayer[_layerName] = [];
				
				if(dtcLayer.CSV.global.clusteringLayer[_layerName].indexOf("csv_clustering_layer_"+level) < 0){
					dtcLayer.CSV.global.clusteringLayer[_layerName].push("csv_clustering_layer_"+level);
				}
				dtcLayer.CSV.global.clusteringLayer[_layerName] = dtcLayer.CSV.global.clusteringLayer[_layerName].sort();
				var max = 600000;
				var min = 600000;
				dtcLayer.CSV.global.clusteringLayer[_layerName].forEach(function(data){
					var layerLevel = parseInt(data.split("csv_clustering_layer_")[1]);
					for(var i=11;i>=layerLevel;i--){
						min = (max * 0.2);
					}
					layerList.nameAtLayer(_layerName+"_"+data).setMaxDistance(max);
					layerList.nameAtLayer(_layerName+"_"+data).setMinDistance(min);
					
					max = min;
				});

				dtcLayer.CSV.global.GROUP_POI.ctx.clearRect(0,0,dtcLayer.CSV.global.GROUP_POI.width,dtcLayer.CSV.global.GROUP_POI.height);

				var x = dtcLayer.CSV.global.GROUP_POI.width / 2;
				var y = dtcLayer.CSV.global.GROUP_POI.height / 2;

				// 동그라미 마커 이미지 그리기
				dtcLayer.CSV.global.GROUP_POI.ctx.beginPath();
				dtcLayer.CSV.global.GROUP_POI.ctx.arc(x, y, 20, 0, 2*Math.PI, false);
				dtcLayer.CSV.global.GROUP_POI.ctx.globalAlpha=0.7;
				dtcLayer.CSV.global.GROUP_POI.ctx.fillStyle = color;
				dtcLayer.CSV.global.GROUP_POI.ctx.fill();
				dtcLayer.CSV.global.GROUP_POI.ctx.lineWidth = 1;
				dtcLayer.CSV.global.GROUP_POI.ctx.strokeStyle = color;
				dtcLayer.CSV.global.GROUP_POI.ctx.stroke();
				dtcLayer.CSV.global.GROUP_POI.ctx.font='bold 15px Arial';
				dtcLayer.CSV.global.GROUP_POI.ctx.textAlign ="center";
				dtcLayer.CSV.global.GROUP_POI.ctx.fillStyle="white";
				dtcLayer.CSV.global.GROUP_POI.ctx.fillText(name,dtcLayer.CSV.global.GROUP_POI.width/2,(dtcLayer.CSV.global.GROUP_POI.height/2)+4);

				var dataBinary = dtcLayer.CSV.global.GROUP_POI.ctx.getImageData(0, 0, dtcLayer.CSV.global.GROUP_POI.width, dtcLayer.CSV.global.GROUP_POI.height).data
				point.setImage(dataBinary, dtcLayer.CSV.global.GROUP_POI.width, dtcLayer.CSV.global.GROUP_POI.height);

				layer.addObject(point,0);
			}

		},
		createImagePoi:function(imgSrc,callback){
			
			var img = new Image();
			img.onload = function() {

				// 3. canvas를 통해 베이스 이미지 바탕 생성
				var canvas = document.createElement('canvas');
				var ctx = canvas.getContext('2d');
				canvas.width = 40;
				canvas.height = 40;
				ctx.drawImage(img, 0, 0,40,40);
		
				// 이미지 데이터 반환
				if (callback) {
					callback( {
						data : ctx.getImageData(0, 0, canvas.width, canvas.height).data,
						width : canvas.width,
						height : canvas.height
					}) 
				}
			};
			img.src = imgSrc;

		},
		createGroupPoiImg:function(color){
			/* POI로 표시 할 점 이미지 생성 */
			var drawCanvas = document.createElement('canvas');

			var ctx = drawCanvas.getContext('2d');
			ctx.width = 40;
			ctx.height = 40;
			ctx.clearRect(0, 0, ctx.width, ctx.height);
								
			var x = ctx.width / 2;
			var y = ctx.height / 2;
								
			// 동그라미 마커 이미지 그리기
			ctx.beginPath();
			ctx.arc(x, y, 20, 0, 2*Math.PI, false);
			ctx.globalAlpha=0.7;
			ctx.fillStyle = color;
			ctx.fill();
			ctx.lineWidth = 1;
			ctx.strokeStyle = color;
			ctx.stroke();
								
			// 그린 마커 이미지 데이터를 레이어 ID를 사용해 저장
			return {
				data : ctx.getImageData(0, 0, ctx.width, ctx.height).data,
				width : ctx.width,
				height : ctx.height,
				ctx:ctx
			}
		},
		createPoiImg:function(color){
			/* POI로 표시 할 점 이미지 생성 */
			var drawCanvas = document.createElement('canvas');
		
			var ctx = drawCanvas.getContext('2d');
			ctx.width = 40;
			ctx.height = 40;
			ctx.clearRect(0, 0, ctx.width, ctx.height);
								
			var x = ctx.width / 2;
			var y = ctx.height / 2;
								
			// 동그라미 마커 이미지 그리기
			ctx.beginPath();
			ctx.arc(x, y, 6, 0, 2*Math.PI, false);
			ctx.fillStyle = color;
			ctx.fill();
			ctx.lineWidth = 2;
			ctx.strokeStyle = 'white';
			ctx.stroke();
								
			// 그린 마커 이미지 데이터를 레이어 ID를 사용해 저장
			return {
				data : ctx.getImageData(0, 0, ctx.width, ctx.height).data,
				width : ctx.width,
				height : ctx.height
			}
		},
		utf8_bytes_to_string:function(arr){
			if (arr == null) {
				return null;
			}
									
			var result = "";
			var i;
			while (i = arr.shift()) {
				if (i <= 0x7f) {
					result += String.fromCharCode(i);
				} else if (i <= 0xdf) { 
					var c = ((i & 0x1f) << 6);
					c += arr.shift() & 0x3f;
					result += String.fromCharCode(c);
				} else if (i <= 0xe0) { 
					var c = ((arr.shift () & 0x1f) << 6) | 0x0800;
					c += arr.shift() & 0x3f;
					result += String.fromCharCode(c);
				} else {
					var c = ((i & 0x0f) << 12);
					c += (arr.shift() & 0x3f) << 6;
					c += arr.shift() & 0x3f;
					result += String.fromCharCode(c);
				}
			}
			return result;
		}
	},
	TERRAIN:{
		global:{
			layerList:null,
			layer:null,
			layerCheck:false
		},
		addLayer:function(obj) {
			//var layerName = "META_ASSET_"+obj.INFO.dataid;
			var layerName = "meta_asset_"+obj.INFO.dataid;

			if(dtcLayer.global.layerList ==null){
				dtcLayer.global.layerList = new Module.JSLayerList(true);
			}

			if(dtcLayer.global.layerList.nameAtLayer(layerName) == null) {
				
				dtcLayer.TERRAIN.global.layer=dtcLayer.global.layerList.nameAtLayer(layerName);

				var terrain = Module.getTerrain();
				
				terrain.SetUseDemBox(true);

				var datUrl = "";

				if(obj.INFO.state == 10 || obj.INFO.state == 11) {
					dataUrl = obj.INFO.meta_out_work_url;

				} else if(obj.INFO.state == 20) {
					dataUrl = obj.INFO.meta_out_url;
				}

				terrain.setDemBox({
					server : {
						url : "//"+dtcCom.host+dataUrl,
						format : "bil"
					},
					area : {
						min : {
							lon : obj.INFO.minx,
							lat : obj.INFO.miny
						},
						max : {
							lon : obj.INFO.maxx,
							lat : obj.INFO.maxy
						},
						maxlevel : 20
					}
				})

				/*terrain.setRequestUrlOption({
					urltype : "user",
					dem : {
						url : "http://"+dtcCom.host,
						path : dataUrl,
						layer : layerName,
						format:"bil"
					}
				});*/

				terrain.SetMaxLevel(20);
				Module.XDRenderData();

			} 

			

			if(dtcSaveMap.global.isLoadMap){
				setTimeout(function() {
					Module.getViewCamera().setLocation(new Module.JSVector3D(obj.INFO.move_lon, obj.INFO.move_lat, 500));
					//Module.getViewCamera().moveLonLatBoundary(new Module.JSVector2D(parseFloat(obj.INFO.minx), parseFloat(obj.INFO.miny)),new Module.JSVector2D(parseFloat(obj.INFO.maxx), parseFloat(obj.INFO.maxy)));
				}, 500);
			}
		}
	},
	IMG:{
		global:{
			layerList:null,
			layer:null,
			sbLayerInfo:[]
		},
		addLayer:function(obj) {
			
			//var layerName = "META_ASSET_"+obj.INFO.dataid;
			var layerName = "meta_asset_"+obj.INFO.dataid;
			var viewType = obj.INFO.img_type;
			var dataType = obj.INFO.data_type;
			
			if(dataType == 'I' && viewType=='S'){//단일 밴드 유사 색상
				if(dtcLayer.global.sbLayerList ==null){
					dtcLayer.global.sbLayerList = new Module.JSLayerList(true);
				}
				var param={
					imgUrl : obj.INFO.thumbnail_url,
					minx:obj.INFO.minx,
					miny:obj.INFO.miny,
					maxx:obj.INFO.maxx,
					maxy:obj.INFO.maxy,
					dataid:obj.INFO.dataid
				};

				dtcLayer.IMG.oneBandColorLegend(param);

			}else{

				if(dtcLayer.global.layerList ==null){
					dtcLayer.global.layerList = new Module.JSLayerList(true);
				}
				
				//dtcLayer.global.layerList.SyncLayer();
				dtcLayer.IMG.global.layer = dtcLayer.global.layerList.nameAtLayer(layerName);
	
				if( dtcLayer.IMG.global.layer == null) {
					if(obj.INFO.state == 10 || obj.INFO.state == 11) {
						Module.XDEMapCreateLayer(layerName, "//"+dtcCom.host+""+obj.INFO.meta_out_work_url+"", 0, false, true, true, 10, 0, 20);
					} else if(obj.INFO.state == 20) {
						Module.XDEMapCreateLayer(layerName, "//"+dtcCom.host+""+obj.INFO.meta_out_url+"", 0, false, true, true, 10, 0, 20);
					}
	
					Module.XDEMapCreateLayer(layerName, "//"+dtcCom.host+""+obj.INFO.meta_out_url+"", 0, false, true, true, 10, 0, 20);
					
				} else {
					return;
				}
			}

			if(dtcSaveMap.global.isLoadMap){
				/*setTimeout(function() {
					Module.getViewCamera().setLocation(new Module.JSVector3D(obj.INFO.move_lon, obj.INFO.move_lat, 500));
				}, 500);*/

				setTimeout(function(){
					Module.getViewCamera().moveLonLatBoundary(new Module.JSVector2D(parseFloat(obj.INFO.minx), parseFloat(obj.INFO.miny)),new Module.JSVector2D(parseFloat(obj.INFO.maxx), parseFloat(obj.INFO.maxy)));
				},500)
			}

			/*
			setTimeout(function(){
				Module.getViewCamera().moveLonLatBoundary(new Module.JSVector2D(parseFloat(obj.INFO.minx), parseFloat(obj.INFO.miny)),new Module.JSVector2D(parseFloat(obj.INFO.maxx), parseFloat(obj.INFO.maxy)));
			},500)
			--
			*/
		},
		oneBandColorLegend:function(obj){
		   var layerName = "meta_asset_"+obj.dataid;
		   var maxx = obj.minx;
		   var maxy = obj.miny;
		   var minx = obj.maxx;
		   var miny = obj.maxy;

		   if(minx > maxx){
			  var tmp =  maxx;
			  maxx = minx;
			  minx = tmp;
		   }

		   if(miny > maxy){
			   var tmp = maxy;
			   maxy = miny;
			   miny = tmp;
		   }

		   Module.getViewCamera().moveLonLatBoundary( new Module.JSVector2D(parseFloat(minx), parseFloat(miny)),new Module.JSVector2D(parseFloat(maxx), parseFloat(maxy)));

		   setTimeout(function(){
			   //좌하단 -> 우하단 -> 우상단 -> 좌상단 순으로
			   var minAlt = Module.getMap().getTerrHeightFast(minx, miny);
			   var maxAlt = Module.getMap().getTerrHeightFast(maxx, maxy);
			   
			   var height = (minAlt+maxAlt)/2;
			   var lowerLeft = new Module.JSVector3D(minx,miny,height+5);
			   var lowerRight = new Module.JSVector3D(maxx,miny,height+5);
			   var upperRight = new Module.JSVector3D(maxx,maxy,height+5);
			   var upperLeft = new Module.JSVector3D(minx,maxy,height+5);

			   var polygon = Module.createPolygon("POLYGON_IMG");
			   var vertex = new Module.Collection();
			   vertex.add(lowerRight);
			   vertex.add(lowerLeft);
			   vertex.add(upperLeft);
			   vertex.add(upperRight);

			   polygon.setCoordinates(vertex);
			   polygon.setUnionMode(true);

			   var polygonStyle = new Module.JSPolygonStyle();
			   polygonStyle.setFill(true);
			   var tranLineColor = new Module.JSColor(0, 255, 0, 0);
			   polygonStyle.setOutLine(true);
			   polygonStyle.setOutLineWidth(2.0);
			   polygonStyle.setOutLineColor(tranLineColor);

			   polygon.setStyle(polygonStyle);

			   var layer = dtcLayer.global.sbLayerList.createLayer(layerName, 1);
			   layer.addObject(polygon, 0);
			   layer.setMaxDistance(300000);

			   dtcLayer.global.polyMesh = polygon;

			   fetch(obj.imgUrl)
			   .then(response => response.blob())
			   .then(blob => createImageBitmap(blob))
			   .then(imgBitmap => {

				   const w = imgBitmap.width;
				   const h = imgBitmap.height;
				   
				   var canvas = document.createElement("canvas");
				   canvas.width = w;
				   canvas.height = h;
				   var ctx = canvas.getContext('2d');
				   // Draw the ImageBitmap on the canvas
				   ctx.drawImage(imgBitmap, 0, 0);

				   var imgData = ctx.getImageData(0,0,w,h).data;
				   var buffer = Module._malloc(imgData.byteLength+1);
				   Module.writeArrayToMemory(imgData, buffer);
				   dtcLayer.global.polyMesh.setTextureByte(buffer, imgData.byteLength, canvas.width, canvas.height, false);
				   Module._free(buffer);

				   COMMON.unblockUIdiv("MapContainer");
			   })
			   .catch(error => console.log(error));
		   },500);
		},
		getPixcelData:function(e){
		
			var dataId = $(this).val();
			var check = $(this).is(":checked");
			var layerName = "meta_asset_"+dataId;
			var layerList = new Module.JSLayerList(true);
			
			if(layerList.nameAtLayer(layerName) == null){
				$(this).prop('checked',false);
				COMMON.alert("레이어를 먼저 켜주세요","warning",function(){return false;});
				return false;
			}
			
			if(check){
				dtcLayer.IMG.global.sbLayerInfo.push(parseInt(dataId));
			}else{
				var removeIndx = dtcLayer.IMG.global.sbLayerInfo.indexOf(dataId);

				if(removeIndx != -1){
					dtcLayer.IMG.global.sbLayerInfo.splice(removeIndx,1);
				}
				
			}
			
			
		},
		layerControl:function(dataId) {
			/*
			var metaAsset = "META_ASSET_"+dataId;

			var layerList = new Module.JSLayerList(false);
			
			if(layerList.nameAtLayer(metaAsset) == null) {
				// 0, false, true, false, 10, 0, 17
				//Module.XDEMapCreateLayer(metaAsset, "http://www.egiscloud.com"+obj.INFO.meta_out_url, 0, false, true, false, 10, 0, 17);
			} else {
				
			}
			*/
		},
		showHideLayer:function(dataId) {

		}
	},
	POINT:{
		global:{
			layer:null
		},
		addLayer:function(obj){
			//console.log(obj);
			//var layerName = "META_ASSET_"+obj.INFO.dataid;
			var layerName = "meta_asset_"+obj.INFO.dataid;

			var layerList = new Module.JSLayerList(false);

			//dtcLayer.global.layerList.SyncLayer();
			dtcLayer.POINT.global.layer = layerList.nameAtLayer(layerName);

			if( dtcLayer.POINT.global.layer == null) {
				Module.XDEMapCreateLayer(layerName, "//"+dtcCom.host+""+obj.INFO.meta_out_url+"", 0, false, true, true, 19, 0, 19);
				var layerList = new Module.JSLayerList(false);
				var layer = layerList.nameAtLayer(layerName);
				//layer.setTileAltitudeOffset(obj.INFO.point_alt);
				//layer.setTileAltitudeOffset(-25.0);
				layer.setPointCloudPointSize(obj.INFO.point_size);
        		layer.view_underground = true;
			} else {
				return;
			}
			
			if(dtcSaveMap.global.isLoadMap){
				setTimeout(function() {
					//Module.getViewCamera().setLocation(new Module.JSVector3D(obj.INFO.move_lon, obj.INFO.move_lat, 500));
					Module.getViewCamera().moveLonLatBoundary(new Module.JSVector2D(parseFloat(obj.INFO.minx), parseFloat(obj.INFO.miny)),new Module.JSVector2D(parseFloat(obj.INFO.maxx), parseFloat(obj.INFO.maxy)));
					//dtcLayer.POINT.global.layer.view_underground = true;
				}, 500);
			}
		}
	},
	MODEL:{
		global:{
			layer:null,
			checkEvent:false
		},
		addLayer:function(obj){
			Module.XDSetMouseState(6);
				//클릭 건물 객체 속성 이벤트 추가하기
			var layerList = new Module.JSLayerList(true);
			layerList.nameAtLayer("facility_build").setVisible(false);

			if(!dtcLayer.MODEL.global.checkEvent){
				Module.canvas.addEventListener("Fire_EventSelectedObject",dtcLayer.MODEL.get3dsShpProps);
				dtcLayer.MODEL.global.checkEvent=true;

				//3ds ghost symbol layer 
			}

			dtcLayer.MODEL.call3dsObjList(obj);

			var centerX = (parseFloat(obj.RECORD.MAXX)+parseFloat(obj.RECORD.MINX)) / 2;
			var centerY = (parseFloat(obj.RECORD.MAXY)+parseFloat(obj.RECORD.MINY)) / 2;
			var centerZ = parseFloat(obj.HEIGHT_INFO.max_height);
			if(dtcSaveMap.global.isLoadMap){
				Module.getViewCamera().setLocation(new Module.JSVector3D(centerX, centerY, centerZ+100));
			}			

			//Module.getViewCamera().moveLonLatBoundary(new Module.JSVector2D(parseFloat(obj.RECORD.MINX), parseFloat(obj.RECORD.MINY)),new Module.JSVector2D(parseFloat(obj.RECORD.MAXX), parseFloat(obj.RECORD.MAXY)));

			
		},
		call3dsObjList:function(obj){
                
			var arr = obj.RECORD.RECORDS;
			var dir = obj.RECORD.OBJ_URL;
			var objKey=obj.RECORD.FILE_KEY.toLowerCase();

			var layerName = "meta_asset_"+obj.INFO.dataid;
			var layerList = new Module.JSLayerList(true);
			dtcLayer.MODEL.global.layer=layerList.createLayer(layerName,Module.ELT_GHOST_3DSYMBOL);

			if(arr.length != 0){
				
				for(var i=0;i<arr.length;i++){

					var key = arr[i].gid;
					var fileName = arr[i][objKey].toLowerCase();
					var textureName = fileName.replace(".3ds",".jpg");

					var lon = parseFloat(arr[i].pos_x);
					var lat = parseFloat(arr[i].pos_y);
					var alt = parseFloat(arr[i].pos_z);

					var scalex = parseFloat(arr[i].scale_x);
					var scaley = parseFloat(arr[i].scale_y);
					var scalez = parseFloat(arr[i].scale_z);
					var diry = parseFloat(arr[i].dir_y);

					var host = window.location.host;
					var url = "//"+host+dir+"/"+fileName;

					Module.getGhostSymbolMap().insert({
						id:"meta_asset_"+obj.INFO.dataid+"_"+key.toString(),
						longitude:lon,
						latitude:lat,
						altitude:alt,
						scalex:scalex,
						scaley:scaley,
						scalez:scalez,
						diry:diry,
						texture:textureName,
						url:url,
						callback:function(e){

							var key = e.id
							var lonObj = e.longitude;
							var latObj = e.latitude;
							var altObj= e.altitude;

							var scale_x = e.scalex;
							var scale_y = e.scaley;
							var scale_z = e.scalez;

							var dir_y = e.diry;
							var textImgName = e.texture;
							
							Module.getGhostSymbolMap().setModelTexture({
								id:key,
								face_index:0,
								url:"//"+host+dir+"/"+textImgName,
								callback:function(e){
									
								}
							})

							var newModel = Module.createGhostSymbol(e.id);
							
							newModel.setBasePoint(0, 0, 0);
							newModel.setRotation(0, dir_y, 0);

							if(scale_x==0 && scale_y==0 && scale_z==0){
								scale_x=1.0;
								scale_y=1.0;
								scale_z=1.0;
							}

							newModel.setScale(new Module.JSSize3D(scale_x, scale_y, scale_z));
							newModel.setGhostSymbol(key);
		
							newModel.setPosition(new Module.JSVector3D(parseFloat(lonObj), parseFloat(latObj), parseFloat(altObj)));	
		
							dtcLayer.MODEL.global.layer.addObject(newModel,0);
						}
					});

				}

				 $("#single3dsEditBtn").on('click',dtcFile.type.model.edit3dsObj);
			}else{
				//결과 없음
			}
			
		},
		get3dsShpProps:function(e){

			var dataId = e.layerName.split("_")[2];
			var objKey = e.objKey.split("_")[3];

			/*if(dtcFile.type.model.global.editInit){
				dtcFile.type.model.setObjEditUi(e);
			}*/

			/*if(dtcLayer.MODEL.global.layer != null){
				
			}*/

			if(dataId != null && objKey != null){
				
				var data={
					dataId:dataId,
					objKey:objKey
				}

				$("#single3dsEditBtn").attr('value',objKey);
				$("#single3dsEditBtn").on('click',dtcFile.type.model.edit3dsObj);

				

				$.ajax({
					url:'../ide/get3dsShpProps.do',
					type:'POST',
					data:data,
					dataType:'json',
					success:function(result){
						//console.log(result);
						if(typeof result === 'object'){

							$("#shpSinglepropertyBody").empty();
							
							var properties = result.INFO;

							var cssCheck = $("#singleShpProperties").css('display');

							var html="";

							for(key in properties){
								html +="<tr>\n";
								html +="	<td>"+key+"</td>\n";	

								var value = properties[key];

								if(value =='undefined' || value==null){
									value="";
								}

								html +="	<td>"+value+"</td>\n";
								html +="</tr>\n";	
							}
							
							$("#shpSinglepropertyBody").append(html);
							$("#shpPropertyType").text("3DS 속성 정보");

							if(cssCheck=="none"){
								$("#singleShpProperties").show();
								$("#single3dsEditBtn").show();
							}

						}
					}
				});

			}else{
				return;
			}

		}
	},
	GPX:{
		global:{
			layer:null,
			checkEvent:false
		},
		addLayer:function(obj) {
			//console.log(obj);

			var layerParam ={
				dataId:obj.INFO.dataid,
				minx:obj.INFO.minx,
				miny:obj.INFO.miny,
				minz:obj.INFO.minz,
				maxx:obj.INFO.maxx,
				maxy:obj.INFO.maxy,
				maxz:obj.INFO.maxz,
				move_lon:obj.INFO.move_lon,
				move_lat:obj.INFO.move_lat
			}

			dtcLayer.global.layerVisbleList.push(layerParam);
			//return;
			//var layerName = "META_ASSET_"+obj.INFO.dataid;
			var layerName = "meta_asset_"+obj.INFO.dataid;
			var gpxInfo = obj.GPX_INFO.gpx;
			var trkHexColor = obj.INFO.trk_color;
			var rteHexColor = obj.INFO.rte_color;

			var trkRgb = dtcLayer.UTIL.hexToRgb(trkHexColor);
			var rteRgb = dtcLayer.UTIL.hexToRgb(rteHexColor);

			var trkLineString = [];
			var rteLineString = [];

			
			if(dtcLayer.global.gpxLayerList == null){
				dtcLayer.global.gpxLayerList = new Module.JSLayerList(true);
			}
		
			dtcLayer.GPX.global.layer = dtcLayer.global.gpxLayerList.createLayer(layerName, Module.ELT_POLYHEDRON);
			

			if(typeof gpxInfo.trk != 'undefined'){

				var trkArr = gpxInfo.trk.trkseg.trkpt;

				for(var i=0;i<trkArr.length;i++){
					var lon,lat,alt;
					var pos = trkArr[i];
					lon = pos.lon;
					lat = pos.lat;
					
					if(typeof pos.ele !='undefined'){
						alt = pos.ele;
					}else{
						alt=0.0;
					}
					var linePt = [lon,lat,alt];
					trkLineString.push(linePt);
				}
			}

			if(typeof gpxInfo.rte != 'undefined'){
				var rteArr = gpxInfo.rte.rtept;
				
				for(var i=0;i<rteArr.length;i++){
					var lon,lat,alt;
					var pos = rteArr[i];

					var lon = pos.lon;
					var lat = pos.lat;
					
					if(typeof pos.ele !='undefined'){
						alt = pos.ele;
					}else{
						alt=0.0;
					}

					var rtePt = [lon,lat,alt];
					rteLineString.push(rtePt);
				}
			}

			if(typeof gpxInfo.wpt != 'undefined'){
		
				var wtpArr = gpxInfo.wpt;

				for(var i=0;i<wtpArr.length;i++){
					
					var wtpObj = wtpArr[i];
					
					var lon = wtpObj.lon;
					var lat = wtpObj.lat;
					var alt = wtpObj.ele;
					var name = wtpObj.name;

					var objElemet = document.createElement('div');

					var param = {
						position:new Module.JSVector3D(lon,lat,alt),
						container:"wtp_container",
						canvas:Module.canvas,
						element:objElemet,
						verticalAligin:"middle",
						horizontalAlign:'center'
					}

					var object = Module.createHTMLObject("wtp_list_"+i);
					var complete = object.createbyJson(param);

					if(complete.result==1){
						
						dtcLayer.GPX.global.layer.addObject(object,0);
						
						var wptSpanElement = document.createElement("span");
						wptSpanElement.className="ts-12";
						var iconhtml = "<i class='fas fa-map-pin text-info ts-13'></i> "+name;
						wptSpanElement.innerHTML=iconhtml;
						
						objElemet.appendChild(wptSpanElement);

					}
				}
				
				dtcLayer.GPX.global.layer.setMaxDistance(200000);

				$("#wtp_container").css('z-index',100);
			}

			if(trkLineString.length != 0){

				var coords = {
					coordinate: trkLineString,						
					style: "XYZ",
				}

				var lineStyle= {
					coordinates: coords,
					type: 0,										// 점선 생성 
					union: false,									// 지형 결합 유무
					depth: false,									// 지형 겹침 X
					color: new Module.JSColor(255, trkRgb.r, trkRgb.g, trkRgb.b),			// ARGB 설정
					width: 3,									// 선 굵기
					
				}

				var trkLine = Module.createLineString("TRK_LINE");
				trkLine.createbyJson(lineStyle);
				dtcLayer.GPX.global.layer.addObject(trkLine,0);
			}

			if(rteLineString.length != 0){

				var coords = {
					coordinate: rteLineString,						
					style: "XYZ",
				}

				var lineStyle= {
					coordinates: coords,
					type: 1,										// 점선 생성 
					union: false,									// 지형 결합 유무
					depth: false,									// 지형 겹침 X
					color: new Module.JSColor(255, rteRgb.r, rteRgb.g, rteRgb.b),			// ARGB 설정
					strokecolor: new Module.JSColor(255, rteRgb.r-10, rteRgb.g-10, rteRgb.b-10),	
					strokewidth: 6.0,		// ARGB 설정
					width: 5									// 선 굵기
				}

				var rteLine = Module.createLineString("RTE_LINE");
				rteLine.createbyJson(lineStyle);
				dtcLayer.GPX.global.layer.addObject(rteLine,0);
			}
			
			let json = {
				boundary: {														// 카메라 이동 위치
					min: new Module.JSVector2D(obj.INFO.minx, obj.INFO.miny),		// 좌하단
					max: new Module.JSVector2D(obj.INFO.maxx, obj.INFO.maxy)		// 우상단
				},																
				complete: function(){

					/*if(obj.INFO.maxz != 0.0){
						var centerX = (obj.INFO.minx+obj.INFO.maxx)/2;
						var centerY = (obj.INFO.miny+obj.INFO.maxy)/2;
						var maxz = obj.INFO.maxz+100;
						
						Module.getViewCamera().setLocation(new Module.JSVector3D(centerX, centerY, maxz));
						return;
					}*/
					
					
				},												// 이동완료 후 발생하는 CallBack
			};
			if(dtcSaveMap.global.isLoadMap){
				Module.getViewCamera().moveLonLatBoundarybyJson(json);
			}
		},
	},
	BIM:{
		global:{
			layer:null
		},
		addLayer:function(obj) {
			console.log(obj);
			var layerName = "meta_asset_"+obj.dataid;

			if(dtcLayer.global.layerList ==null){
				dtcLayer.global.layerList = new Module.JSLayerList(true);
			}

			//dtcLayer.global.layerList.SyncLayer();
			dtcLayer.BIM.global.layer = dtcLayer.global.layerList.nameAtLayer(layerName);

			if( dtcLayer.BIM.global.layer == null) {
				Module.XDEMapCreateLayer(layerName, "//"+dtcCom.host+""+obj.meta_out_url+"", 0, false, true, true, 9, 0, 12);
				//Module.setVisibleRange(layerName,15.0,400000);
			} else {
				return;
			}

			if(dtcSaveMap.global.isLoadMap){
				setTimeout(function() {
					Module.getViewCamera().setLocation(new Module.JSVector3D(obj.move_lon, obj.move_lat, 500));
				}, 500);
			}
		}
	},
	JPG:{
		global:{
			layer:null,
			jpgLayerList:null
		},
		addLayer:function(obj) {
			var layerName = "meta_asset_"+obj.INFO.dataid;

			var layerParam ={
				dataId:obj.INFO.dataid,
				minx:obj.INFO.minx,
				miny:obj.INFO.miny,
				minz:obj.INFO.minz,
				maxx:obj.INFO.maxx,
				maxy:obj.INFO.maxy,
				maxz:obj.INFO.maxz,
				move_lon:obj.INFO.move_lon,
				move_lat:obj.INFO.move_lat
			}

			dtcLayer.global.layerVisbleList.push(layerParam);

			if(dtcLayer.JPG.global.jpgLayerList ==null){
				dtcLayer.JPG.global.jpgLayerList = new Module.JSLayerList(true);
			}

			
			dtcLayer.JPG.global.layer = dtcLayer.JPG.global.jpgLayerList.createLayer(layerName, Module.ELT_POLYHEDRON);//일반
			dtcLayer.JPG.global.layer.setMaxDistance(50000);
		
			var imgDom = document.createElement('div');
            imgDom.style.zIndex='100';
			imgDom.style.display='block';

			var param = {
			  position:new Module.JSVector3D(obj.INFO.move_lon, obj.INFO.move_lat, 10.0),
			  canvas:Module.canvas,
			  container: "jpg_img_container",
			  element:imgDom,
			  verticalAlign: "middle",
			  horizontalAlign: "center"
			}
			
			var imgBlock = document.createElement('img');
			imgBlock.style.width="100%";
			imgBlock.style.height='100%';
			imgBlock.style.border='3px dashed #26B4FF';
			imgBlock.style.zIndex='99999';
			imgBlock.style.color='#ffffff';
			imgBlock.style.verticalAlign='middle';
			imgBlock.style.textAlign='center';
			imgBlock.style.display='block';
			imgBlock.src = obj.INFO.meta_out_url;
			imgDom.appendChild(imgBlock)

			var imgObj = Module.createHTMLObject("JPG_IMG_OBJ");
			var complet =imgObj.createbyJson(param);

			if(complet.result ==1 ){
				dtcLayer.JPG.global.layer.addObject(imgObj,0);
			}

			if(dtcSaveMap.global.isLoadMap){
				setTimeout(function() {
					
					$("#JPG_IMG_OBJ").css('width','100px');
					$("#JPG_IMG_OBJ").css('height','100px');

					$("#jpg_img_container").css('z-index',100);
					Module.getViewCamera().setLocation(new Module.JSVector3D(obj.INFO.move_lon, obj.INFO.move_lat, 500));
				}, 500);
			}
		}
	},
	DXF:{
		global:{
			layer:null,
			layerList:null
		},
		addLayer:function(obj){
			
		}
	},
	UTIL:{
		transformCoord:function(x, y, t) {

			Proj4js.defs["EPSG:4326"] = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";

			var source = null;

			switch(t) {
				case "13" :
					source = new Proj4js.Proj("EPSG:4326");
				break;

				case "14" : //보정된 오래된 지리원 표준 - 서부원점 epsg:5173
					Proj4js.defs["EPSG:5173"] = "+proj=tmerc +lat_0=38 +lon_0=125.0028902777778 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43";
					source = new Proj4js.Proj("EPSG:5173");
				break;

				case "15" : //보정된 오래된 지리원 표준 - 중부원점 epsg:5174
					Proj4js.defs["EPSG:5174"] = "+proj=tmerc +lat_0=38 +lon_0=127.0028902777778 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43";
					source = new Proj4js.Proj("EPSG:5174");
				break;

				case "16" : //보정된 오래된 지리원 표준 - 동부원점 epsg:5176
					Proj4js.defs["EPSG:5176"] = "+proj=tmerc +lat_0=38 +lon_0=129.0028902777778 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43";
					source = new Proj4js.Proj("EPSG:5176");
				break;

				case "17" : //타원제 바꾼 지리원 표준 - 중부원점 epsg:5181
					Proj4js.defs["EPSG:5186"] = "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +units=m +no_defs";
					source = new Proj4js.Proj("EPSG:5186");
				break;

				case "18" : //타원제 바꾼 지리원 표준 - 동부원점 epsg:5183
					Proj4js.defs["EPSG:5187"] = "+proj=tmerc +lat_0=38 +lon_0=129 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +units=m +no_defs";
					source = new Proj4js.Proj("EPSG:5187");
				break;

				case "19" : //보정된 오래된 지리원 표준 - 제주원점 epsg:5175
					Proj4js.defs["EPSG:5182"] = "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=550000 +ellps=GRS80 +units=m +no_defs";
					source = new Proj4js.Proj("EPSG:5182");

				break;

				case "20" : // 2017년 국토지리정보원 표준 - 중부원점 epsg:5186
					Proj4js.defs["EPSG:5186"] = "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";
					source = new Proj4js.Proj("EPSG:5186");
				break;

				case "21" : // 2017년 국토지리정보원 표준 - 서부원점 epsg:5185
					Proj4js.defs["EPSG:5185"] = "+proj=tmerc +lat_0=38 +lon_0=125 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +units=m +no_defs";
					source = new Proj4js.Proj("EPSG:5185");
				break;

				case "24" : // UTM-K (Bessel): 새주소지도에서 사용 중 epsg:5178
					Proj4js.defs["EPSG:5178"] = "+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=bessel +units=m +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43";
					source = new Proj4js.Proj("EPSG:5178");
				break;

				case "25" : // 네비게이션용 KATEC 좌표계(KOTI-KATEC)
					Proj4js.defs["KOTI-KATEC"] = "+proj=tmerc +lat_0=38 +lon_0=128 +k=0.9999 +x_0=400000 +y_0=600000 +ellps=bessel +units=m +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43";
					source = new Proj4js.Proj("KOTI-KATEC");
				break;

				case "26" : // UTM-K (GRS80): 네이버지도에서 사용중인 좌표계  epsg:5179
					Proj4js.defs["EPSG:5179"] = "+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs";
					source = new Proj4js.Proj("EPSG:5179");
				break;

				case "34" : // UTM Zone 51 Northern(Bessel) epsg:32651
					Proj4js.defs["EPSG:32651"] = "+proj=utm +zone=51 +ellps=WGS84 +datum=WGS84 +units=m +no_defs";
					source = new Proj4js.Proj("EPSG:32651");
				break;

				case "35" : // UTM Zone 52 Northern(Bessel)  epsg:32652

					Proj4js.defs["EPSG:32652"] = "+proj=utm +zone=52 +ellps=WGS84 +datum=WGS84 +units=m +no_defs";
					source = new Proj4js.Proj("EPSG:32652");
				break;

				case "130" :
					// UTM 48N
					Proj4js.defs["EPSG:32648"] = "+proj=utm +zone=48 +datum=WGS84 +units=m +no_defs";
					source = new Proj4js.Proj("EPSG:32648");
				break;

				case "131" :
					// UTM 48S
					Proj4js.defs["EPSG:32748"] = "+proj=utm +zone=48 +south +datum=WGS84 +units=m +no_defs";
					source = new Proj4js.Proj("EPSG:32748");
				break;

				case "135" :
					Proj4js.defs["EPSG:32750"] = "+proj=utm +zone=50 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs ";
					source = new Proj4js.Proj("EPSG:32750");

				break;

			}

			var dest = new Proj4js.Proj("EPSG:4326");

			//console.log(source, dest);
			//console.log(x, y, t);

			var pt = new Proj4js.Point(x, y);
			//console.log(pt);

			var rs = Proj4js.transform(source, dest, pt);
			//console.log(rs);

			return rs;
		},
		hexToRgb:function(hexCode){
			var hex = hexCode.trim().replace( "#", "" ); 
    
			/* rgb로 각각 분리해서 배열에 담기. */ 
			var rgb = ( 3 === hex.length ) ? 
				hex.match( /[a-f\d]/gi ) : hex.match( /[a-f\d]{2}/gi );     
			
			rgb.forEach(function (str, x, arr){     
				/* rgb 각각의 헥사값이 한자리일 경우, 두자리로 변경하기. */ 
				if ( str.length == 1 ) str = str + str; 
				
				/* 10진수로 변환하기. */ 
				arr[ x ] = parseInt( str, 16 ); 
			}); 
			
			return {
				r:rgb[0],
				g:rgb[1],
				b:rgb[2]
			}
		}
	},
	DEFAULT:{
		VWORLD:{
			vworldLayers:["facility_build", "facility_bridge", "bldg_3ds_korea_lv15_xnd"],
			show:function(v){
				var layerList = new Module.JSLayerList(false);
				layerList.nameAtLayer(dtcLayer.DEFAULT.VWORLD.vworldLayers[v]).setVisible(true);
			},
			hide:function(v){
				var layerList = new Module.JSLayerList(false);
				layerList.nameAtLayer(dtcLayer.DEFAULT.VWORLD.vworldLayers[v]).setVisible(false);
			},
			etcSetting:function(type,flag){
				var layerList = new Module.JSLayerList(false);
				layerList.nameAtLayer("hybrid_"+type).setVisible(flag);
				layerList.nameAtLayer("poi_"+type).setVisible(flag);
			},
		},
		BIM:{
			show:function() {
				var layerList = new Module.JSLayerList(false);
				layerList.nameAtLayer("seoul_bim").setVisible(true);

				Module.getViewCamera().look(new Module.JSVector3D(126.97656507356969, 37.56360799438936, 272.4735560696572), new Module.JSVector3D(126.9750579067591, 37.56776105246717, 43.34549522586167));
			},
			hide:function() {
				var layerList = new Module.JSLayerList(false);
				layerList.nameAtLayer("seoul_bim").setVisible(false);
			}
		},
		GEOJSON:{
			show:function() {
				var layerList = new Module.JSLayerList(false);
				layerList.nameAtLayer("seoul_geoJSON").setVisible(true);
				Module.getViewCamera().moveLonLatBoundary(new Module.JSVector2D(parseFloat(127.0611), parseFloat(37.5288)),new Module.JSVector2D(parseFloat(127.1077), parseFloat(37.5716)));
			},
			hide:function() {
				var layerList = new Module.JSLayerList(false);
				layerList.nameAtLayer("seoul_geoJSON").setVisible(false);
			}
		},
		FACILITY:{
			defFacilities:["facility_buildseoul", "tile_build_seoul", "facility_bridgehi", "facility_bridgelow", "facility_palaces","ngii_fac_lod_1","osan_fac", "BUPYEONG_COLLADA_LOD", "facility_gongwon", "eco_delta_v1"], 
			show:function(f) {
				var layerList = new Module.JSLayerList(false);
				layerList.nameAtLayer(dtcLayer.DEFAULT.FACILITY.defFacilities[f]).setVisible(true);

				if(f == "6") {
					var layerListOs = new Module.JSLayerList(false);
					var ratio = 0.2 * 10;
					var layerOs = layerListOs.nameAtLayer("osan_fac");
					layerOs.lod_object_detail_ratio = 3.0;
					layerOs.tile_load_ratio = 3.0;

					Module.SetMobileMode(0);

					Module.XDRenderData();
				}

				if(f == "7") {
					Module.getViewCamera().setLocation(new Module.JSVector3D(126.731026, 37.497350, 1957.945530910976));
				} else if(f == "8") {
					Module.getViewCamera().setLocation(new Module.JSVector3D(126.988167, 37.661180, 500));
				} else if(f == "9") {
					// , 
					Module.getViewCamera().setLocation(new Module.JSVector3D(128.91907839148692, 35.13891869898334, 500));
				}

			},
			hide:function(f) {
				if(f == "6") {
					Module.SetMobileMode(2);
				}
				var layerList = new Module.JSLayerList(false);
				layerList.nameAtLayer(dtcLayer.DEFAULT.FACILITY.defFacilities[f]).setVisible(false);
			}
		},
		IMAGE:{
			defImages:["hybrid_seoul25cm", "hybrid_seoul08", "car", "najusandan","osan_v1","hybrid_undersea", "hy_ecodelta_v1"],
			show:function(l) {
				var layerList = new Module.JSLayerList(false);
				layerList.nameAtLayer(dtcLayer.DEFAULT.IMAGE.defImages[l]).setVisible(true);
			},
			hide:function(l) {
				var layerList = new Module.JSLayerList(false);
				layerList.nameAtLayer(dtcLayer.DEFAULT.IMAGE.defImages[l]).setVisible(false);
			}
		},
		UNDEF_FAC:{
			defUndefFac:[],
			VALV_PSZ:null,
			WTL_MANH_PSZ:null,
			SWL_MANH_PSZ:null,
			UFL_BMAN_PSZ:null,
			UFL_KMAN_PSZ:null,
			FAR_PMAN_LMZ:null,
			GRW_DMAN_LMZ:null,
			GRU_FMAN_LMZ:null,
			loadModule:function(){
				dtcLayer.DEFAULT.UNDEF_FAC.loadPipe("WTL_PIPE_LMZ", new Module.JSColor(255, 0, 0, 255));	// 상수
				dtcLayer.DEFAULT.UNDEF_FAC.loadPipe("SWL_PIPE_LMZ", new Module.JSColor(255, 170, 102, 179));// 하수
				dtcLayer.DEFAULT.UNDEF_FAC.loadPipe("UFL_GPIP_LMZ", new Module.JSColor(255, 217, 201, 0));	// 가스
				dtcLayer.DEFAULT.UNDEF_FAC.loadPipe("UFL_KPIP_LSZ", new Module.JSColor(255, 238, 73, 73));	// 통신
				dtcLayer.DEFAULT.UNDEF_FAC.loadPipe("UFL_BPIP_LMZ", new Module.JSColor(255, 217, 201, 0));	// 전력
				
				var ghostSymbolMap = Module.getGhostSymbolMap();
				ghostSymbolMap.addGhostSymbolBy3DSbyJson({
					id: "WTL_MANH_PSZ",
					basePath: "siteData/under_fac",
					file: "WTL_MANH_PSZ",
				});
				ghostSymbolMap.addGhostSymbolBy3DSbyJson({
					id: "SWL_MANH_PSZ",
					basePath: "siteData/under_fac",
					file: "SWL_MANH_PSZ",
				});
				ghostSymbolMap.addGhostSymbolBy3DSbyJson({
					id: "VALV_PSZ",
					basePath: "siteData/under_fac",
					file: "VALV_PSZ",
				});
				
				ghostSymbolMap.addGhostSymbolBy3DSbyJson({
					id: "UFL_BMAN_PSZ",
					basePath: "siteData/under_fac",
					file: "UFL_BMAN_PSZ",
				});
				ghostSymbolMap.addGhostSymbolBy3DSbyJson({
					id: "UFL_KMAN_PSZ",
					basePath: "siteData/under_fac",
					file: "UFL_KMAN_PSZ",
				});
				
				ghostSymbolMap.addGhostSymbolBy3DSbyJson({
					id: "FAR_PMAN_LMZ",
					basePath: "siteData/under_fac",
					file: "FAR_PMAN_LMZ",
				});
				ghostSymbolMap.addGhostSymbolBy3DSbyJson({
					id: "GRW_DMAN_LMZ",
					basePath: "siteData/under_fac",
					file: "GRW_DMAN_LMZ",
				});
				ghostSymbolMap.addGhostSymbolBy3DSbyJson({
					id: "GRU_FMAN_LMZ",
					basePath: "siteData/under_fac",
					file: "GRU_FMAN_LMZ",
				});
			
				Module.canvas.addEventListener("Fire_GhostSymbolRegistComplete", function(e){
					if (e.strGhostSymbolKey == "VALV_PSZ") {
						Module.getGhostSymbolMap().setGhostSymbolTexture(e.strGhostSymbolKey, "/siteData/under_fac/", "VALV_PSZ.jpg");
						dtcLayer.DEFAULT.UNDEF_FAC.VALV_PSZ = e.strGhostSymbolKey;
					} else if (e.strGhostSymbolKey == "WTL_MANH_PSZ") {
						Module.getGhostSymbolMap().setGhostSymbolTexture(e.strGhostSymbolKey, "/siteData/under_fac/", "WTL_MANH_PSZ.png");
						dtcLayer.DEFAULT.UNDEF_FAC.WTL_MANH_PSZ = e.strGhostSymbolKey;
					} else if (e.strGhostSymbolKey == "SWL_MANH_PSZ") {
						Module.getGhostSymbolMap().setGhostSymbolTexture(e.strGhostSymbolKey, "./siteData/under_fac/", "SWL_MANH_PSZ.png");
						dtcLayer.DEFAULT.UNDEF_FAC.SWL_MANH_PSZ = e.strGhostSymbolKey;
					} else if (e.strGhostSymbolKey == "UFL_BMAN_PSZ") {
						Module.getGhostSymbolMap().setGhostSymbolTexture(e.strGhostSymbolKey, "./siteData/under_fac/", "UFL_BMAN_PSZ.jpg");
						dtcLayer.DEFAULT.UNDEF_FAC.UFL_BMAN_PSZ = e.strGhostSymbolKey;
					} else if (e.strGhostSymbolKey == "UFL_KMAN_PSZ") {
						Module.getGhostSymbolMap().setGhostSymbolTexture(e.strGhostSymbolKey, "./siteData/under_fac/", "UFL_KMAN_PSZ.jpg");
						dtcLayer.DEFAULT.UNDEF_FAC.UFL_KMAN_PSZ = e.strGhostSymbolKey;
					} else if (e.strGhostSymbolKey == "FAR_PMAN_LMZ") {
						Module.getGhostSymbolMap().setGhostSymbolTexture(e.strGhostSymbolKey, "./siteData/under_fac/", "FAR_PMAN_LMZ.png");
						dtcLayer.DEFAULT.UNDEF_FAC.FAR_PMAN_LMZ = e.strGhostSymbolKey;
					} else if (e.strGhostSymbolKey == "GRW_DMAN_LMZ") {
						Module.getGhostSymbolMap().setGhostSymbolTexture(e.strGhostSymbolKey, "./siteData/under_fac/", "GRW_DMAN_LMZ.png");
						dtcLayer.DEFAULT.UNDEF_FAC.GRW_DMAN_LMZ = e.strGhostSymbolKey;
					} else if (e.strGhostSymbolKey == "GRU_FMAN_LMZ") {
						Module.getGhostSymbolMap().setGhostSymbolTexture(e.strGhostSymbolKey, "./siteData/under_fac/", "GRU_FMAN_LMZ.png");
						dtcLayer.DEFAULT.UNDEF_FAC.GRU_FMAN_LMZ = e.strGhostSymbolKey;
					}
					if (dtcLayer.DEFAULT.UNDEF_FAC.VALV_PSZ != null
					 && dtcLayer.DEFAULT.UNDEF_FAC.WTL_MANH_PSZ != null
					 && dtcLayer.DEFAULT.UNDEF_FAC.SWL_MANH_PSZ != null
					 && dtcLayer.DEFAULT.UNDEF_FAC.UFL_BMAN_PSZ != null
					 && dtcLayer.DEFAULT.UNDEF_FAC.UFL_KMAN_PSZ != null
					 && dtcLayer.DEFAULT.UNDEF_FAC.FAR_PMAN_LMZ != null
					 && dtcLayer.DEFAULT.UNDEF_FAC.GRW_DMAN_LMZ != null
					 && dtcLayer.DEFAULT.UNDEF_FAC.GRU_FMAN_LMZ != null) {
						var layerList = new Module.JSLayerList(true);
						dtcLayer.DEFAULT.UNDEF_FAC.loadFacility("/siteData/under_fac/WTL_MANH_PSZ.geojson","WTL_MANH_PSZ");
						dtcLayer.DEFAULT.UNDEF_FAC.loadFacility("/siteData/under_fac/WTL_VALV_PSZ.geojson","WTL_VALV_PSZ");
						dtcLayer.DEFAULT.UNDEF_FAC.loadFacility("/siteData/under_fac/SWL_MANH_PSZ.geojson","SWL_MANH_PSZ");
						dtcLayer.DEFAULT.UNDEF_FAC.loadFacility("/siteData/under_fac/UFL_GVAL_PSZ.geojson","UFL_GVAL_PSZ");
						dtcLayer.DEFAULT.UNDEF_FAC.loadFacility("/siteData/under_fac/UFL_KMAN_PSZ.geojson","UFL_KMAN_PSZ");
						dtcLayer.DEFAULT.UNDEF_FAC.loadFacility("/siteData/under_fac/UFL_BMAN_PSZ.geojson","UFL_BMAN_PSZ");
						dtcLayer.DEFAULT.UNDEF_FAC.loadFacility("/siteData/under_fac/FAR_PMAN_LMZ.geojson","FAR_PMAN_LMZ");
						var layerpoi = layerList.createLayer("FAR_PMAN_LMZ_poi", Module.ELT_3DPOINT);
						dtcLayer.DEFAULT.UNDEF_FAC.loadFacility("/siteData/under_fac/GRW_DMAN_LMZ.geojson","GRW_DMAN_LMZ");
						var layerpoi = layerList.createLayer("GRW_DMAN_LMZ_poi", Module.ELT_3DPOINT);
						dtcLayer.DEFAULT.UNDEF_FAC.loadFacility("/siteData/under_fac/GRU_FMAN_LMZ.geojson","GRU_FMAN_LMZ");
						var layerpoi = layerList.createLayer("GRU_FMAN_LMZ_poi", Module.ELT_3DPOINT);
					}
				});
			},
			loadPipe:function(_file, _color) {
				Module.ReadPipeSHP(
					"/siteData/under_fac", 		// 파일 url
					_file,		// 파일 이름
					3,			// 파이프 둥글기. 3으로 고정
					100000.0,	// 파이프 흐름 표시 화살표 간격인데 안쓰니까 대충 큰 값으로..
					0.0,	// 고도 값은데 이것도 안쓰니까 대충 0.0..
					_color, _color,	// 파이프 시작 색상, 끝색상
					0.5,	// 파이프 반경
					20	// 파이프 데이터 좌표계. 20으로 고정
				);
				
				var layerList = new Module.JSLayerList(true);
				var layer = null;
				layer = layerList.nameAtLayer(_file);
				if (layer != null) layer.setVisible(false);
			},
			loadFacility:function(_url, layerName) {
				// 포인트 데이터 로드
				$.getJSON(_url, function(_data) {
					
					// 고스트 심볼 레이어 생성
					var layerList = new Module.JSLayerList(true);
					var layer = layerList.createLayer(layerName, Module.ELT_GHOST_3DSYMBOL);
					layer.setMaxDistance(99999999.9);
			
					var modelKey = null;
					if (this.url.indexOf("MAN") != -1) {
						modelKey = layer.getName();
					} else if (this.url.indexOf("VAL") != -1) {
						modelKey = "VALV_PSZ";
					} else {
						return;
					}
			
					var modelSize = Module.getGhostSymbolMap().getGhostSymbolSize(modelKey);
					
					var features = _data.features;
					for (var i=0; i<features.length; i++) {
			
						var feature = features[i];
						var position_tm = feature.geometry.coordinates;
			
						// 좌표 변환
						var position_2d = Module.getProjection().convertProjection(
							20,
							new Module.JSVector2D(position_tm[0], position_tm[1]),
							13
						);
			
						var object = Module.createGhostSymbol("object_"+layer.getObjectCount());
						object.setGhostSymbol(modelKey);
						
						if (modelKey == "VALV_PSZ") {
							object.setBasePoint(0, -modelSize.height*0.5, 0);
							object.setPosition(new Module.JSVector3D(position_2d.x, position_2d.y, position_tm[2]));		
						} else if (modelKey == "FAR_PMAN_LMZ" || modelKey == "GRW_DMAN_LMZ" || modelKey == "GRU_FMAN_LMZ") {
							Alpha = 0; Red = 0; Green = 0; Blue = 0;
							if(modelKey == "FAR_PMAN_LMZ") {Alpha = 1; Red = 34; Green = 177; Blue = 76;};	// 농업
							if(modelKey == "GRW_DMAN_LMZ") {Alpha = 1; Red = 63; Green = 72; Blue = 204;};	// 지하개발
							if(modelKey == "GRU_FMAN_LMZ") {Alpha = 1; Red = 255; Green = 242; Blue = 0;};	// 지하이용
							var dia = 1.0;
							var dep = 1.0;
							dia = feature.properties["구경"]*1/100;
							dep = feature.properties["심도"]*1+2;
										
							object.setScale(new Module.JSSize3D(dia, dep, dia));
							object.setPosition(new Module.JSVector3D(position_tm[0], position_tm[1], position_tm[2]-dep/2+2));
							
							
							var layerList = new Module.JSLayerList(true);
							var layerpoi = layerList.nameAtLayer(modelKey+"_poi");
							layerpoi.setMaxDistance(200000);
							var size = 10;
							var canvas = document.createElement('canvas');
							canvas.width = 10;
							canvas.height = 10;
							var ctx = canvas.getContext('2d');
							ctx.beginPath(); 
							ctx.arc(3, 3, 3, 0, 2*Math.PI);
							ctx.fillStyle = "rgba("+Red+", "+Green+", "+Blue+", "+Alpha+")";
							ctx.fill();

				
							// 이미지 POI 생성
							var poi_with_image = Module.createPoint("POI_WITH_IMAGE"+layerpoi.getObjectCount());
							poi_with_image.setPosition(new Module.JSVector3D(position_tm[0], position_tm[1], position_tm[2]));
							poi_with_image.setImage(ctx.getImageData(0, 0, size, size).data, size, size);
							
							layerpoi.addObject(poi_with_image, 0);
							layerpoi.setVisible(false);
						}
						else {
							object.setBasePoint(0, modelSize.height*0.10, 0);
							object.setScale(new Module.JSSize3D(1.0, 2.0, 1.0));
							object.setPosition(new Module.JSVector3D(position_2d.x, position_2d.y, position_tm[2]));		
						}	
							
						layer.addObject(object, 0);
					}
					
					layer.setVisible(false);
				});
			},
			wtlPipe:function(flag){
				var layerList = new Module.JSLayerList(true);
				var layer = null;
				layer = layerList.nameAtLayer("WTL_PIPE_LMZ");
				if (layer != null) layer.setVisible(flag);
				layer = layerList.nameAtLayer("WTL_VALV_PSZ");
				if (layer != null) layer.setVisible(flag);
				layer = layerList.nameAtLayer("WTL_MANH_PSZ");
				if (layer != null) layer.setVisible(flag);
			},
			swlPipe:function(flag){
				var layerList = new Module.JSLayerList(true);
				var layer = null;
				layer = layerList.nameAtLayer("SWL_PIPE_LMZ");
				if (layer != null) layer.setVisible(flag);
				layer = layerList.nameAtLayer("SWL_MANH_PSZ");
				if (layer != null) layer.setVisible(flag);
			},
			uflgPipe:function(flag){
				var layerList = new Module.JSLayerList(true);
				var layer = null;
				layer = layerList.nameAtLayer("UFL_GPIP_LMZ");
				if (layer != null) layer.setVisible(flag);
				layer = layerList.nameAtLayer("UFL_GVAL_PSZ");
				if (layer != null) layer.setVisible(flag);
			},
			uflkPipe:function(flag){
				var layerList = new Module.JSLayerList(true);
				var layer = null;
				layer = layerList.nameAtLayer("UFL_KPIP_LSZ");
				if (layer != null) layer.setVisible(flag);
				layer = layerList.nameAtLayer("UFL_KMAN_PSZ");
				if (layer != null) layer.setVisible(flag);
			},
			uflbPipe:function(flag){
				var layerList = new Module.JSLayerList(true);
				var layer = null;
				layer = layerList.nameAtLayer("UFL_BPIP_LMZ");
				if (layer != null) layer.setVisible(flag);
				layer = layerList.nameAtLayer("UFL_BMAN_PSZ");
				if (layer != null) layer.setVisible(flag);
			},
			fpadPipe:function(flag){
				var layerList = new Module.JSLayerList(true);
				var layer = null;
				layer = layerList.nameAtLayer("FAR_PMAN_LMZ");
				if (layer != null) layer.setVisible(flag);
				layer = layerList.nameAtLayer("FAR_PMAN_LMZ_poi");
				if (layer != null) layer.setVisible(flag);
			},
			gwdvPipe:function(flag){
				var layerList = new Module.JSLayerList(true);
				var layer = null;
				layer = layerList.nameAtLayer("GRW_DMAN_LMZ");
				if (layer != null) layer.setVisible(flag);
				layer = layerList.nameAtLayer("GRW_DMAN_LMZ_poi");
				if (layer != null) layer.setVisible(flag);
			},
			gwufPipe:function(flag){
				var layerList = new Module.JSLayerList(true);
				var layer = null;
				layer = layerList.nameAtLayer("GRU_FMAN_LMZ");
				if (layer != null) layer.setVisible(flag);
				layer = layerList.nameAtLayer("GRU_FMAN_LMZ_poi");
				if (layer != null) layer.setVisible(flag);
			},
			show:function(l) {
				var layerList = new Module.JSLayerList(true);
				var layer = null;
				switch(l) {
					case 0 :
						//상수관로	
						dtcLayer.DEFAULT.UNDEF_FAC.wtlPipe(true);
					break;
					case 1 :
						//하수관로	
						dtcLayer.DEFAULT.UNDEF_FAC.swlPipe(true);
					break;
					case 2 :
						//천연가스관로
						dtcLayer.DEFAULT.UNDEF_FAC.uflgPipe(true);
					break;
					case 3 :
						//통신관로
						dtcLayer.DEFAULT.UNDEF_FAC.uflkPipe(true);
					break;
					case 4 :
						//전력지중관료
						dtcLayer.DEFAULT.UNDEF_FAC.uflbPipe(true);
					break;
					case 6 :
						//농업용공공관정
						dtcLayer.DEFAULT.UNDEF_FAC.fpadPipe(true);
					break;
					case 7 :
						//지하수개발
						dtcLayer.DEFAULT.UNDEF_FAC.gwdvPipe(true);
					break;
					case 8 :
						//지하수이용시설
						dtcLayer.DEFAULT.UNDEF_FAC.gwufPipe(true);
					break;
				}
				Module.getViewCamera().look(new Module.JSVector3D(127.47812543386635,37.483136946627944,1186.9842924466357),new Module.JSVector3D(127.47774229700339,37.50616213856128,47.051764451898634))
			},
			hide:function(l) {
				var layerList = new Module.JSLayerList(true);
				var layer = null;
				switch(l) {
					case 0 :
						//상수관로	
						dtcLayer.DEFAULT.UNDEF_FAC.wtlPipe(false);
					break;
					case 1 :
						//하수관로	
						dtcLayer.DEFAULT.UNDEF_FAC.swlPipe(false);
					break;
					case 2 :
						//천연가스관로
						dtcLayer.DEFAULT.UNDEF_FAC.uflgPipe(false);
					break;
					case 3 :
						//통신관로
						dtcLayer.DEFAULT.UNDEF_FAC.uflkPipe(false);
					break;
					case 4 :
						//천력지중관료
						dtcLayer.DEFAULT.UNDEF_FAC.uflbPipe(false);
					break;
					case 6 :
						//농업용공공관정
						dtcLayer.DEFAULT.UNDEF_FAC.fpadPipe(false);
					break;
					case 7 :
						//지하수개발
						dtcLayer.DEFAULT.UNDEF_FAC.gwdvPipe(false);
					break;
					case 8 :
						//지하수이용시설
						dtcLayer.DEFAULT.UNDEF_FAC.gwufPipe(false);
					break;
				}
			}
		}
	},
	scrollbarInit:function(){
		
		var layerDataList = document.getElementById('memberLayerLists');
		$("#memberLayerLists").css("height",window.innerHeight - 250);
		
		new PerfectScrollbar(layerDataList,{
			 suppressScrollX:true
		});
		
		layerDataList.addEventListener('ps-y-reach-end',dtcLayer.getMoreList);
		
		var shareLayerDataList = document.getElementById('shareLayerLists');
		$("#shareLayerLists").css("height",window.innerHeight - 250);
		
		new PerfectScrollbar(shareLayerDataList,{
			 suppressScrollX:true
		});
		
		shareLayerDataList.addEventListener('ps-y-reach-end',dtcLayer.getMoreShareList);
	},
	getMoreList:function(e){
		
		var text = $("#layerDataSearchStr").val();
		var type = [];
		$('.layer_type_check').each(function(){
		    if($(this).is(":checked")){
				if(this.value == "D"){
			        type.push("T");
				}
		        type.push(this.value);
		    }
		});
		var data={
			MID : D_MEMBER.MID,
			TYPE:type,
			TEXT:text,
			STEP:dtcLayer.global.step,
			COUNT:dtcLayer.global.count
		}
		
		//프로그래스 아이콘 추가

		$.ajax({
			url:'./ide/getMoreLayerLists.do',
			type:'POST',
			data:data,
			dataType:'json',
			success:function(result){
				//프로그래스 해제
				if(result.LIST != null || result.LIST!='undefined'){
					
					if(result.LIST.length !=0){
						dtcLayer.global.step+=10;
						dtcLayer.getMoreAppendLayers(result.LIST);
						$(".layer_dem_check,.layer_input_check").each(function(){
							var dataId = parseInt($(this).attr('id').split("_")[1]);
							if(dtcLayer.global.layerOnList.indexOf(dataId) > -1){
								$(this).prop('checked',true);
							}else{
								$(this).prop('checked',false);
							}
						})
					}
					
				}
				
			}
		})
	},
	layerDemCheck:function(e){
			//change될 때마다, click이벤트가 중첩되어 쌓임. 이를 제거
			let checker = $._data($(".layer_dem_check")[0], "events");
			if(checker&&checker.click){
				if(checker.click.length>0) $(".layer_dem_check").off('click');
			}
		
			//dem은 따로
			$(".layer_dem_check").on('click',function(e){
					
				var dataId = $(this).attr('id').split("_")[1];
				var check =  $(this).is(':checked');
				var value = $(this).val();
				var dataName = $(this).next().next().text();

				dtcLayer.global.pushAndPopDataId(dataId,dataName,'T');

				if(check){
					dtcLayer.callLayerInfo(dataId);
				}else{
					Module.getTerrain().SetUseDemBox(false);

					$("input[name='setBaseMapRadio'][value='0']").prop("checked",true).change();

					var layerList = new Module.JSLayerList(true);
					var layer = layerList.nameAtLayer(value);

					if (layer != null) {
						layer.setVisible(false);
					}

					Module.getMap().ClearMap();
				}
				
			});
	},
	layerInputCheck:function(e){
	
		var dataId = $(this).attr('id').split("_")[1];
		var check =  $(this).is(':checked');
		var value = $(this).val();
	    var dataType = $(this).parent().children(".layerDataTypeInfo").val();
		var dataName = 	$(this).next().next().text();
		var imgView = $(this).parent().children(".layerImgTypeInfo").val();
		
		//jstree check
		var jsonArr;
		if(window.location.href.indexOf("/layer/galleryView.do") <= -1
			&& window.location.href.indexOf("/layer/gallery.do") <= -1
			&& window.location.href.indexOf("/layer/loadMapInfo.do") <= -1){
			jsonArr = $("#layerGroupTree").jstree().get_json('#',{flat:true});
			if(jsonArr.length != 1){
				for(var i=0;i<jsonArr.length;i++){
					var obj = jsonArr[i];
					var treeId = obj.id;
					
					if(treeId != 'root-layer'){
						var jsVal = obj.id;
						var jsDataId = jsVal.split("_")[2];
						
						if(dataId==jsDataId){
							var checkNode= $("#layerGroupTree").jstree().get_node(jsVal);
							
							if(check){
								//체크박스 on
								$("#layerGroupTree").jstree().check_node(checkNode);
							}else{
								//체크박스 off
								$("#layerGroupTree").jstree().uncheck_node(checkNode);
							}
						}
					}
				}
			}
		} else {
			jsonArr = $("#basicLayerTree").jstree().get_json('#',{flat:true});
		
			if(jsonArr.length != 1){
				for(var i=0;i<jsonArr.length;i++){
					var obj = jsonArr[i];
					var treeId = obj.id;
					
					if(treeId != 'root-layer'){
						var jsVal = obj.id;
						var jsDataId = jsVal.split("_")[2];
						
						if(dataId==jsDataId){
							var checkNode= $("#basicLayerTree").jstree().get_node(jsVal);
							
							if(check){
								//체크박스 on
								$("#basicLayerTree").jstree().check_node(checkNode);
							}else{
								//체크박스 off
								$("#basicLayerTree").jstree().uncheck_node(checkNode);
							}
						}
					}
				}
			}
		}

		// 지도 저장기능을 위한 dataId 수집	
		dtcLayer.global.pushAndPopDataId(dataId,dataName,dataType);
		
		dtcLayer.global.layerList = new Module.JSLayerList(true);
		
		if(dataType == "S" || dataType == "DXF"){
			
			//shp일경우 Visible로 조절하지않음	
			if(dtcLayer.SHP.layerName != null){	
				var data={	
					dataId:dataId	
				}	
					
				$.ajax({	
					url:'./ide/callLayerInfo.do',	
					type:'POST',	
					data:data,	
					dataType:'json',	
					success:function(result){	
						//console.log(result);	
						if(result.INFO.data_type=="S" || result.INFO.data_type=="DXF"){	
							dtcLayer.SHP.addLayer(result);	
						}	
					}	
				})	
			}else{	
				dtcLayer.callLayerInfo(dataId);
			}	
				
		}else if(dataType == "I" && imgView=='S'){
			//단일 유사 색상 레이어 처리
			dtcLayer.global.sbLayerList = new Module.JSLayerList(true);

			if(dtcLayer.global.sbLayerList.nameAtLayer(value) != null){
				dtcLayer.global.sbLayerList.nameAtLayer(value).setVisible(check);
			}else{
				dtcLayer.callLayerInfo(dataId);
			}
			
		}else if(dataType == "Z3"){
			dtcLayer.global.gsLayerList = new Module.JSLayerList(true);

			if(dtcLayer.global.gsLayerList.nameAtLayer(value) != null){
				
				if(check){
					dtcLayer.global.gsLayerList.nameAtLayer(value).setVisible(true);

					var layerMinx =0;
					var layerMiny =0;
					var layerMaxx =0;
					var layerMaxy =0;
					var layerMinz=0;
					var layerMaxz=0;

					var centerX = 0;
					var centerY = 0;
					var centerZ = 0;
					
					var layerSize = dtcLayer.global.layerVisbleList.length;
					
					for(var i=0;i<layerSize;i++){
						var layerDataId = dtcLayer.global.layerVisbleList[i].dataId;
						
						if(layerDataId==dataId){

							layerMinx=dtcLayer.global.layerVisbleList[i].minx;
							layerMiny=dtcLayer.global.layerVisbleList[i].miny;
							
							layerMaxx=dtcLayer.global.layerVisbleList[i].maxx;
							layerMaxy=dtcLayer.global.layerVisbleList[i].maxy;

							centerX = (layerMinx+layerMaxx)/2;
							centerY = (layerMiny+layerMaxy)/2;
							centerZ =dtcLayer.global.layerVisbleList[i].maxz+50;

							break;
						}
					}

					if(dtcSaveMap.global.isLoadMap){
						Module.getViewCamera().moveLonLatBoundary( new Module.JSVector2D(parseFloat(layerMinx), parseFloat(layerMiny)),new Module.JSVector2D(parseFloat(layerMaxx), parseFloat(layerMaxy)));
					}
					//건물편집 모드 켜기
					let json = {
						boundary: {														// 카메라 이동 위치
							min: new Module.JSVector2D(parseFloat(layerMinx), parseFloat(layerMiny)),		// 좌하단
							max: new Module.JSVector2D(parseFloat(layerMaxx), parseFloat(layerMaxy))		// 우상단
						},																
						complete: function(){
							//console.log(centerX, centerY, centerZ)
							if(dtcSaveMap.global.isLoadMap){
								Module.getViewCamera().setLocation(new Module.JSVector3D(centerX, centerY, centerZ));
							}
							
						},												// 이동완료 후 발생하는 CallBack
					};
					if(dtcSaveMap.global.isLoadMap){
						Module.getViewCamera().moveLonLatBoundarybyJson(json);
					}
				}else{
					dtcLayer.MODEL.global.checkEvent=false;
					dtcLayer.global.gsLayerList.nameAtLayer(value).setVisible(false);
					//건물편집 모드 끄기
				}

			}else{
				dtcLayer.callLayerInfo(dataId);
			}

		}else if(dataType == "G"){
			
			if(dtcLayer.global.gpxLayerList ==null){
				dtcLayer.global.gpxLayerList = new Module.JSLayerList(true);
			}
			
			if(dtcLayer.global.gpxLayerList.nameAtLayer(value) != null){
                if(check){
					dtcLayer.global.gpxLayerList.nameAtLayer(value).setVisible(true);

					var layerMinx =0;
					var layerMiny =0;
					var layerMaxx =0;
					var layerMaxy =0;
					var layerMinz=0;
					var layerMaxz=0;

					var centerX = 0;
					var centerY = 0;
					
					var layerSize = dtcLayer.global.layerVisbleList.length;

					for(var i=0;i<layerSize;i++){
						var layerDataId = dtcLayer.global.layerVisbleList[i].dataId;

						if(layerDataId==dataId){

							layerMinx=dtcLayer.global.layerVisbleList[i].minx;
							layerMiny=dtcLayer.global.layerVisbleList[i].miny;
							
							layerMaxx=dtcLayer.global.layerVisbleList[i].maxx;
							layerMaxy=dtcLayer.global.layerVisbleList[i].maxy;

							centerX = dtcLayer.global.layerVisbleList[i].move_lon;
							centerY = dtcLayer.global.layerVisbleList[i].move_lat;

							break;
						}
					}

					if(dtcSaveMap.global.isLoadMap){
						Module.getViewCamera().moveLonLatBoundary( new Module.JSVector2D(parseFloat(layerMinx), parseFloat(layerMiny)),new Module.JSVector2D(parseFloat(layerMaxx), parseFloat(layerMaxy)));
					}
					//건물편집 모드 켜기
				}else{
					
					dtcLayer.global.gpxLayerList.nameAtLayer(value).setVisible(false);
					
				}
                
			}else{
				dtcLayer.callLayerInfo(dataId);
			}

		}else if(dataType == "J"){

			if(dtcLayer.JPG.global.jpgLayerList ==null){
				dtcLayer.JPG.global.jpgLayerList = new Module.JSLayerList(true);
			}
			
			if(dtcLayer.JPG.global.jpgLayerList.nameAtLayer(value) != null){
                if(check){
					dtcLayer.JPG.global.jpgLayerList.nameAtLayer(value).setVisible(true);
					var centerX = 0;
					var centerY = 0;
					
					var layerSize = dtcLayer.global.layerVisbleList.length;

					for(var i=0;i<layerSize;i++){
						var layerDataId = dtcLayer.global.layerVisbleList[i].dataId;

						if(layerDataId==dataId){

							centerX = dtcLayer.global.layerVisbleList[i].move_lon;
							centerY = dtcLayer.global.layerVisbleList[i].move_lat;

							break;
						}
					}

					if(dtcSaveMap.global.isLoadMap){
						Module.getViewCamera().setLocation(new Module.JSVector3D(centerX, centerY, 500));
					}
					//건물편집 모드 켜기
				}else{
					
					dtcLayer.JPG.global.jpgLayerList.nameAtLayer(value).setVisible(false);
					
				}
                
			}else{
				dtcLayer.callLayerInfo(dataId);	
			}
		}else{
			var layerList = new Module.JSLayerList(false);
			if(dtcLayer.global.layerList.nameAtLayer(value) == null) dtcLayer.global.layerList = layerList;
			if(dtcLayer.global.layerList.nameAtLayer(value) != null){
				
				if(check){
					dtcLayer.global.layerList.nameAtLayer(value).setVisible(true);
					if(dataType=="C"){
						var layerList = new Module.JSLayerList(true); 
						dtcLayer.CSV.global.clusteringLayer[value].forEach(function(data){
						   layerList.nameAtLayer(value+"_"+data).setVisible(true);
						});
					}

					/*if(dataType=="Z3"){//3ds 레이어 배열 추가

						if(!dtcLayer.MODEL.global.checkEvent){
							Module.canvas.addEventListener("Fire_EventSelectedObject",dtcLayer.MODEL.get3dsShpProps);
							dtcLayer.MODEL.global.checkEvent=true;
						}
	
						Module.XDSetMouseState(6);
						//클릭 건물 객체 속성 이벤트 추가하기
						dtcLayer.global.tile3ds.push(value);
						
						var layerList = new Module.JSLayerList(false);
						layerList.nameAtLayer("facility_build").setVisible(false);
						
					}*/

					
					var layerSize = dtcLayer.global.layerVisbleList.length;
					
					if(layerSize != 0){
						
						var layerMinx =0;
						var layerMiny =0;
						var layerMaxx =0;
						var layerMaxy =0;
						var layerMinz=0;
						var layerMaxz=0;

						var centerX = 0;
						var centerY = 0;
						for(var i=0;i<layerSize;i++){
							var layerDataId = dtcLayer.global.layerVisbleList[i].dataId;

							if(layerDataId==dataId){

								layerMinx=dtcLayer.global.layerVisbleList[i].minx;
								layerMiny=dtcLayer.global.layerVisbleList[i].miny;
								
								layerMaxx=dtcLayer.global.layerVisbleList[i].maxx;
								layerMaxy=dtcLayer.global.layerVisbleList[i].maxy;

								centerX = dtcLayer.global.layerVisbleList[i].move_lon;
								centerY = dtcLayer.global.layerVisbleList[i].move_lat;

								break;
							}
						}

						if(dtcSaveMap.global.isLoadMap){
							if(dataType=="LD" || dataType=="B"){
								Module.getViewCamera().setLocation(new Module.JSVector3D(centerX, centerY, 500));
							}else{
								Module.getViewCamera().moveLonLatBoundary( new Module.JSVector2D(parseFloat(layerMinx), parseFloat(layerMiny)),new Module.JSVector2D(parseFloat(layerMaxx), parseFloat(layerMaxy)));
							}
						}

					}

				}else{

					/*if(dataType=="Z3"){//3ds 배열 삭제 배열 크기가 0일 경우 마우스모드 초기화
						
						var indx3ds = dtcLayer.global.tile3ds.indexOf(value);
						
						if(indx3ds > -1){
							
							dtcLayer.global.tile3ds.splice(indx3ds,1)

							if(dtcLayer.global.tile3ds.length ==0){

								Module.XDSetMouseState(1);
								Module.getMap().clearSelectObj();
								
								dtcLayer.global.tile3ds=[];

								var layerList = new Module.JSLayerList(false);
								layerList.nameAtLayer("facility_build").setVisible(true);

								Module.canvas.removeEventListener("Fire_EventSelectedObject",dtcLayer.MODEL.get3dsShpProps,false);
								
								$("#singleShpProperties").hide();

								dtcLayer.MODEL.global.checkEvent=false;
								
							}
						}


					}*/

					dtcLayer.global.layerList.nameAtLayer(value).setVisible(false);
					if(dataType=="C"){
						var layerList = new Module.JSLayerList(true); 
						dtcLayer.CSV.global.clusteringLayer[value].forEach(function(data){
						   layerList.nameAtLayer(value+"_"+data).setVisible(false);
						});
					}
				}

			}else{
				
				if(dataType=="Z3"){//3ds 레이어 배열 추가

					if(!dtcLayer.MODEL.global.checkEvent){
						Module.canvas.addEventListener("Fire_EventSelectedObject",dtcLayer.MODEL.get3dsShpProps);
						dtcLayer.MODEL.global.checkEvent=true;
					}

					Module.XDSetMouseState(6);
					//클릭 건물 객체 속성 이벤트 추가하기
					dtcLayer.global.tile3ds.push(value);
					
					var layerList = new Module.JSLayerList(false);
					layerList.nameAtLayer("facility_build").setVisible(false);
					
				}

				dtcLayer.callLayerInfo(dataId);
			}
		}
		var shpValue = $(this).next().val();
		
		if(shpValue=="S" && check){
			dtcLayer.global.shpLayerList.push(value);
		}else if(shpValue=="S" && !check){
			dtcLayer.global.shpLayerList.splice(value,1);
		}
		if(check){
			LOG_TRACKER.write("33","1","데이터 가시화:{DataID:"+dataId+"}");
		}
			
	},
	getMoreShareList:function(e){
		var text = $("#layerDataSearchStr").val();
		var type = [];
		$('.layer_type_check').each(function(){
		    if($(this).is(":checked")){
				if(this.value == "D"){
			        type.push("T");
				}
		        type.push(this.value);
		    }
		});
		var data={
			MID : D_MEMBER.MID,
			TYPE:type,
			TEXT:text,
			STEP:dtcLayer.global.stepShare,
			COUNT:dtcLayer.global.countShare
		}
		
		//프로그래스 아이콘 추가

		$.ajax({
			url:'./ide/getShareLayerLists.do',
			type:'POST',
			data:data,
			dataType:'json',
			success:function(result){
				//프로그래스 해제
				if(result.LIST != null || result.LIST!='undefined'){
					
					if(result.LIST.length !=0){
						dtcLayer.global.stepShare+=10;
						dtcLayer.setShareLayerLists(result);
						$(".layer_dem_check,.layer_input_check").each(function(){
							var dataId = parseInt($(this).attr('id').split("_")[1]);
							if(dtcLayer.global.layerOnList.indexOf(dataId) > -1){
								$(this).prop('checked',true);
							}else{
								$(this).prop('checked',false);
							}
						})
					}
					
				}
				
			}
		})
	},
	sampleLayerInit:function(){
		$("input[name=def_egis_layer]:checkbox").change(function(e){
			var layerList = new Module.JSLayerList(false);
			var layerName = "";
			switch(e.target.value){
				case "0":
					layerName = "EGIS_tMap_World";
				break;
			}
			
			if(this.checked){
				layerList.nameAtLayer(layerName).setVisible(true);
			}else{
				layerList.nameAtLayer(layerName).setVisible(false);
			}
		});
		$("input[name=def_vworld_layer]:checkbox").change(function(e){
			
			if(this.checked){
				dtcLayer.DEFAULT.VWORLD.show(parseInt(e.target.value));
			}else{
				dtcLayer.DEFAULT.VWORLD.hide(parseInt(e.target.value));
			}
			
		});
		$("input[name=etc_vworld_layer]:checkbox").change(function(e){
			dtcLayer.DEFAULT.VWORLD.etcSetting(e.target.value,this.checked);
		});
		
		$("input[name=seoul_bim]:checkbox").change(function(e){
			if(this.checked){
				dtcLayer.DEFAULT.BIM.show();
			}else{
				dtcLayer.DEFAULT.BIM.hide();
			}
		});

		$("input[name=seoul_geoJson]:checkbox").change(function(e){
			if(this.checked){
				dtcLayer.DEFAULT.GEOJSON.show();
			}else{
				dtcLayer.DEFAULT.GEOJSON.hide();
			}
		});

		$("input[name=def_seoul_facilities]:checkbox").change(function(e){
			
			if(this.checked){
				dtcLayer.DEFAULT.FACILITY.show(parseInt(e.target.value));
			}else{
				dtcLayer.DEFAULT.FACILITY.hide(parseInt(e.target.value));
			}
			
		});
		
		$("input[name=def_seoul_image]:checkbox").change(function(e){
			
			if(this.checked){
				dtcLayer.DEFAULT.IMAGE.show(parseInt(e.target.value));
			}else{
				dtcLayer.DEFAULT.IMAGE.hide(parseInt(e.target.value));
			}
			
		});
		
		$("input[name=def_high_seoul_image]:checkbox").change(function(e){
			
			if(this.checked){
				dtcLayer.DEFAULT.IMAGE.show(parseInt(e.target.value));
			}else{
				dtcLayer.DEFAULT.IMAGE.hide(parseInt(e.target.value));
			}
			
		});
		

		$("input[name=def_osan_v1]:checkbox").change(function(e){
			
			if(this.checked){
				dtcLayer.DEFAULT.IMAGE.show(parseInt(e.target.value));
			}else{
				dtcLayer.DEFAULT.IMAGE.hide(parseInt(e.target.value));
			}
			
		});

		$("input[name=def_hy_ecodelta_v1]:checkbox").change(function(e){
			
			if(this.checked){
				dtcLayer.DEFAULT.IMAGE.show(parseInt(e.target.value));
			}else{
				dtcLayer.DEFAULT.IMAGE.hide(parseInt(e.target.value));
			}
			
		});

		

		$("input[name=def_ecodelta_facilities]:checkbox").change(function(e){
			
			if(this.checked){
				dtcLayer.DEFAULT.FACILITY.show(parseInt(e.target.value));
			}else{
				dtcLayer.DEFAULT.FACILITY.hide(parseInt(e.target.value));
			}
			
		});
		
		$("input[name=def_osan_facilities]:checkbox").change(function(e){
			
			if(this.checked){
				dtcLayer.DEFAULT.FACILITY.show(parseInt(e.target.value));
			}else{
				dtcLayer.DEFAULT.FACILITY.hide(parseInt(e.target.value));
			}
			
		});

		$("input[name=def_knps_facilities]:checkbox").change(function(e){
			
			if(this.checked){
				dtcLayer.DEFAULT.FACILITY.show(parseInt(e.target.value));
			}else{
				dtcLayer.DEFAULT.FACILITY.hide(parseInt(e.target.value));
			}
			
		});

		$("input[name=def_byp_collada]:checkbox").change(function(e){
			console.log(e);
			if(this.checked){
				dtcLayer.DEFAULT.FACILITY.show(parseInt(e.target.value));
			}else{
				dtcLayer.DEFAULT.FACILITY.hide(parseInt(e.target.value));
			}
			
		});
		
		$("input[name=car]:checkbox").change(function(e){
			
			if(this.checked){
				
				dtcLayer.DEFAULT.IMAGE.show(parseInt(e.target.value));
				
				Module.getViewCamera().setViewAt(126.601899,36.981341,500,90,0);
				Module.XDRenderData();
				
			}else{
				dtcLayer.DEFAULT.IMAGE.hide(parseInt(e.target.value));
			}
			
		});
		
		$("input[name=najusandan]:checkbox").change(function(e){
			
			if(this.checked){
				
				dtcLayer.DEFAULT.IMAGE.show(parseInt(e.target.value));
				
				Module.getViewCamera().setViewAt(126.6861451,34.97135179,500,90,0);
				Module.XDRenderData();
				
			}else{
				dtcLayer.DEFAULT.IMAGE.hide(parseInt(e.target.value));
			}
			
		});
		
		$("input[name=kuklibJiri]:checkbox").change(function(e){
			if(this.checked){
				dtcLayer.DEFAULT.FACILITY.show(parseInt(e.target.value));
			}else{
				dtcLayer.DEFAULT.FACILITY.hide(parseInt(e.target.value));
			}
		});
		//양평 지하시설물
		$("input[name=def_undef_facilities]:checkbox").change(function(e) {
			if(this.checked){
				dtcLayer.DEFAULT.UNDEF_FAC.show(parseInt(e.target.value));
			}else{
				dtcLayer.DEFAULT.UNDEF_FAC.hide(parseInt(e.target.value));
			}
		});

		//양평 건물높이DB
		$("input[name=yp_height_facility]:checkbox").change(function(e) {
			var layerList = new Module.JSLayerList(false);
				
			if(this.checked){
				layerList.nameAtLayer("facility_yp_height").setVisible(true);

				Module.getViewCamera().setLocation(new Module.JSVector3D(127.48757847007474,37.491788287692934, 800));
			}else{
				layerList.nameAtLayer("facility_yp_height").setVisible(false);
			}
		});
		//양평 LOD
		$("input[name=yp_lod_facility]:checkbox").change(function(e) {
			var layerList = new Module.JSLayerList(false);
				
			if(this.checked){
				layerList.nameAtLayer("facility_yp_real").setVisible(true);

				Module.getViewCamera().setLocation(new Module.JSVector3D(127.48757847007474,37.491788287692934, 800));
			}else{
				layerList.nameAtLayer("facility_yp_real").setVisible(false);
			}
		});
		
		if($("input[name='def_undef_facilities']").length > 0){
			dtcLayer.DEFAULT.UNDEF_FAC.loadModule();
		}

		$("input[name=dem_marine_0]:checkbox").change(function(e) {
			var layerList = new Module.JSLayerList(false);
			
			if(this.checked){
			
				//dtcLayer.DEFAULT.IMAGE.show(5);
				//layerList.SyncLayer();
				var layer = layerList.nameAtLayer("undersea_img");
	
				if( layer == null) {
					Module.XDEMapCreateLayer("undersea_img", "egiscloud.com/userData/newlayer/MAP_DATA/image/convert/undersea", 0, false, true, true, 10, 0, 15);
				} else {
					layer.setVisible(true);
				}
				
				var terrain = Module.getTerrain();
			
				terrain.SetUseDemBox(true);
				terrain.setDemBox({
					server : {
						url : "//egiscloud.com/userData/newlayer/MAP_DATA/terrain/convert/dem_undersea",
						format : "bil"
					},
					area : {
						min : {
						
							lon : 128.8058488992,
							lat : 34.9826089458
						},
						max : {
							lon : 129.3004398082,
							lat : 35.3089271276
						},
						maxlevel : 13
					}
				})
				
				Module.XDRenderData();

			}else{

				var layer = layerList.nameAtLayer("undersea_img");
				layer.setVisible(false);

				Module.getTerrain().SetUseDemBox(false);
				$("input[name='setBaseMapRadio'][value='0']").prop("checked",true).change();

				Module.getMap().ClearMap();
			}

		});
		
		$("input[name=dem_marine_1]:checkbox").change(function(e) {

			var layerList = new Module.JSLayerList(false);
			var layer = layerList.nameAtLayer("layerWMS_undersea");
			if(this.checked){
				
				if(layer == null){
					var layerUndersea= layerList.createWMSLayer("layerWMS_undersea");
					var geoserver_url=dtcCom.geo_url();
					let slopeoption = {
						url: '//'+geoserver_url+'/smd1091/wms?',
						layer: 'smd1091:user_shp_smd1091_1633500798658',
						minimumlevel: 5,
						maximumlevel: 21,
						tilesize: 256,
						crs: "EPSG:4326",
						parameters: {
							version: "1.1.0"
						}
					};
		
					if (layerUndersea != null) {
		
						layerUndersea.setWMSProvider(slopeoption);
						layerUndersea.setBBoxOrder(true);
					}
					
					layerUndersea.clearWMSCache();
				}else{
					layer.setVisible(true);
				}
				

			}else{
				
				layer.setVisible(false);

			}
			
		});
		
		$("input[name=dem_gwanakgu_1]:checkbox").change(function(e) {
			if(this.checked){
				var terrain = Module.getTerrain();
			
				terrain.SetUseDemBox(true);
				terrain.setDemBox({
					server : {
						url : "/userData/test123/MAP_DATA/dem/dem_seoul_gwanakgu_1m",
						format : "bil"
					},
					area : {
						min : {
							lon : 126.91115038371335,
							lat : 37.46191250733982
						},
						max : {
							lon : 126.98596584595728,
							lat : 37.5000376174664
						},
						maxlevel : 15
					}
				})
				
				Module.XDRenderData();

			}else{

				Module.getTerrain().SetUseDemBox(false);
				$("input[name='setBaseMapRadio'][value='0']").prop("checked",true).change();

				Module.getMap().ClearMap();
			}

		});
		$("input[name=bldg_tilemap_berlin]:checkbox").change(function(e){
			var layerList = new Module.JSLayerList(false);
			if(this.checked){
				layerList.nameAtLayer("bldg_tilemap_berlin_bake_240417").setVisible(true);
			}else{
				layerList.nameAtLayer("bldg_tilemap_berlin_bake_240417").setVisible(false);
			}
		});
		$("input[name=indonesia_bldg_general]:checkbox").change(function(e){
			var layerList = new Module.JSLayerList(false);
			if(this.checked){
				layerList.nameAtLayer("buld_general").setVisible(true);
			}else{
				layerList.nameAtLayer("buld_general").setVisible(false);
			}
		});
		$("input[name=indonesia_bldg_block_m_station]:checkbox").change(function(e){
			var layerList = new Module.JSLayerList(false);
			if(this.checked){
				layerList.nameAtLayer("bldg_block_m_station").setVisible(true);
				Module.getViewCamera().look(new Module.JSVector3D(106.79914795709396,-6.245990304660045,83.7553990893066),new Module.JSVector3D(106.79823940273155,-6.244987239945343,34.98231083061546));
			}else{
				layerList.nameAtLayer("bldg_block_m_station").setVisible(false);
			}
		});
		$("input[name=indonesia_land]:checkbox").change(function(e){
			var layerList = new Module.JSLayerList(false);
			if(this.checked){
				layerList.nameAtLayer("poi_jakarta_jibun").setVisible(true);
				layerList.nameAtLayer("hybrid_jakarta_jijuk_line").setVisible(true);
			}else{
				layerList.nameAtLayer("poi_jakarta_jibun").setVisible(false);
				layerList.nameAtLayer("hybrid_jakarta_jijuk_line").setVisible(false);
			}
		});
		$("input[name=dem_indonesia]:checkbox").change(function(e) {
			if(this.checked){
				$("input[name='setBaseMapRadio'][value='google_satellite']").prop("checked",true).change();
				var terrain = Module.getTerrain();
				terrain.setRequestUrlOption({
				    urltype : "user",
				    dem : {
				        url : "//"+dtcCom.host,
				        path : "userData/test123/MAP_DATA/dem/dem_jakarta",
				        layer : "MAP_INDONESIA",
				        format:"bil"
				    }
				});
				Module.SetEncodingVWorldDEM(false);
				Module.getViewCamera().moveLonLatBoundary(new Module.JSVector2D(105.01194326686887, -7.242686371183899), new Module.JSVector2D(108.8532873766398, -5.374096567816334));
			}else{
				var terrain = Module.getTerrain();
				terrain.setRequestUrlOption({
				    urltype : "xdserver",
				    dem : {
				        url : "//3dmap.egiscloud.com",
				        server : "/XDServer",
				        layer : "dem"
				    }
				});
				Module.SetEncodingVWorldDEM(false);
				$("input[name='setBaseMapRadio'][value='0']").prop("checked",true).change();
			}
			Module.getMap().ClearMap();
			Module.XDRenderData();
			Module.XDEPlanetRefresh();
		});
   		$("input[name=dem_koreanNamhae]:checkbox").change(function(e) {
			if(this.checked){
				//$("input[name='setBaseMapRadio'][value='google_satellite']").prop("checked",true).change();
				var terrain = Module.getTerrain();
				terrain.setRequestUrlOption({
				    urltype : "xdserver",
				    dem : {
				        url : "//3dmap.egiscloud.com",
				        server: "/XDServer",
				        layer : "dem_KoreaNamhae",
				        
				    }
				});
				Module.SetEncodingVWorldDEM(false);
				//Module.getViewCamera().moveLonLatBoundary(new Module.JSVector2D(105.01194326686887, -7.242686371183899), new Module.JSVector2D(108.8532873766398, -5.374096567816334));
			}else{
				var terrain = Module.getTerrain();
				terrain.setRequestUrlOption({
				    urltype : "xdserver",
				    dem : {
				        url : "//3dmap.egiscloud.com",
				        server : "/XDServer",
				        layer : "dem"
				    }
				});
				Module.SetEncodingVWorldDEM(false);
				$("input[name='setBaseMapRadio'][value='0']").prop("checked",true).change();
			}
			Module.getMap().ClearMap();
			Module.XDRenderData();
			Module.XDEPlanetRefresh();
		});
   		$("input[name=dem_koreanNamhae3]:checkbox").change(function(e) {
			if(this.checked){
				//$("input[name='setBaseMapRadio'][value='google_satellite']").prop("checked",true).change();
				var terrain = Module.getTerrain();
				terrain.setRequestUrlOption({
				    urltype : "xdserver",
				    dem : {
				        url : "//3dmap.egiscloud.com",
				        server: "/XDServer",
				        layer : "dem_KoreaNamhae3",
				        
				    }
				});
				Module.SetEncodingVWorldDEM(false);
				//Module.getViewCamera().moveLonLatBoundary(new Module.JSVector2D(105.01194326686887, -7.242686371183899), new Module.JSVector2D(108.8532873766398, -5.374096567816334));
			}else{
				var terrain = Module.getTerrain();
				terrain.setRequestUrlOption({
				    urltype : "xdserver",
				    dem : {
				        url : "//3dmap.egiscloud.com",
				        server : "/XDServer",
				        layer : "dem"
				    }
				});
				Module.SetEncodingVWorldDEM(false);
				$("input[name='setBaseMapRadio'][value='0']").prop("checked",true).change();
			}
			Module.getMap().ClearMap();
			Module.XDRenderData();
			Module.XDEPlanetRefresh();
		});

		$("input[name=dem_koreanNamhae5]:checkbox").change(function(e) {
			if(this.checked){
				//$("input[name='setBaseMapRadio'][value='google_satellite']").prop("checked",true).change();
				var terrain = Module.getTerrain();
				terrain.setRequestUrlOption({
				    urltype : "xdserver",
				    dem : {
				        url : "//3dmap.egiscloud.com",
				        server: "/XDServer",
				        layer : "dem_KoreaNamhae5",
				        
				    }
				});
				Module.SetEncodingVWorldDEM(false);
				//Module.getViewCamera().moveLonLatBoundary(new Module.JSVector2D(105.01194326686887, -7.242686371183899), new Module.JSVector2D(108.8532873766398, -5.374096567816334));
			}else{
				var terrain = Module.getTerrain();
				terrain.setRequestUrlOption({
				    urltype : "xdserver",
				    dem : {
				        url : "//3dmap.egiscloud.com",
				        server : "/XDServer",
				        layer : "dem"
				    }
				});
				Module.SetEncodingVWorldDEM(false);
				$("input[name='setBaseMapRadio'][value='0']").prop("checked",true).change();
			}
			Module.getMap().ClearMap();
			Module.XDRenderData();
			Module.XDEPlanetRefresh();
		});
   
   	$("input[name=dem_koreanNamhae10]:checkbox").change(function(e) {
			if(this.checked){
				//$("input[name='setBaseMapRadio'][value='google_satellite']").prop("checked",true).change();
				var terrain = Module.getTerrain();
				terrain.setRequestUrlOption({
				    urltype : "xdserver",
				    dem : {
				        url : "//3dmap.egiscloud.com",
				        server: "/XDServer",
				        layer : "dem_KoreaNamhae10",
				        
				    }
				});
				Module.SetEncodingVWorldDEM(false);
				//Module.getViewCamera().moveLonLatBoundary(new Module.JSVector2D(105.01194326686887, -7.242686371183899), new Module.JSVector2D(108.8532873766398, -5.374096567816334));
			}else{
				var terrain = Module.getTerrain();
				terrain.setRequestUrlOption({
				    urltype : "xdserver",
				    dem : {
				        url : "//3dmap.egiscloud.com",
				        server : "/XDServer",
				        layer : "dem"
				    }
				});
				Module.SetEncodingVWorldDEM(false);
				$("input[name='setBaseMapRadio'][value='0']").prop("checked",true).change();
			}
			Module.getMap().ClearMap();
			Module.XDRenderData();
			Module.XDEPlanetRefresh();
		});
   
		$("input[name=dem_yp_mido]:checkbox").change(function(e){
			if(this.checked){
				var terrain = Module.getTerrain();
				terrain.setRequestUrlOption({
					urltype : "xdserver",
					dem : {
						url : "//3dmap.egiscloud.com",
						server : "/XDServer",
						layer : "dem_yp_1m"
					}
				});
				Module.SetEncodingVWorldDEM(false);
			}else{
				var terrain = Module.getTerrain();
				terrain.setRequestUrlOption({
				    urltype : "xdserver",
				    dem : {
				        url : "//3dmap.egiscloud.com",
				        server : "/XDServer",
				        layer : "dem"
				    }
				});
				Module.SetEncodingVWorldDEM(false);
			}
			Module.getMap().ClearMap();
			Module.XDRenderData();
			Module.XDEPlanetRefresh();
		});
		$("input[name=dem_NYJ_SC]:checkbox").change(function(e){
			if(this.checked){
				var terrain = Module.getTerrain();
				terrain.setRequestUrlOption({
					urltype : "xdserver",
					dem : {
						url : "//3dmap.egiscloud.com",
						server : "/XDServer",
						layer : "dem_NYJ_SC"
					}
				});
				Module.SetEncodingVWorldDEM(false);
			}else{
				var terrain = Module.getTerrain();
				terrain.setRequestUrlOption({
				    urltype : "xdserver",
				    dem : {
				        url : "//3dmap.egiscloud.com",
				        server : "/XDServer",
				        layer : "dem"
				    }
				});
				Module.SetEncodingVWorldDEM(false);
			}
			Module.getMap().ClearMap();
			Module.XDRenderData();
			Module.XDEPlanetRefresh();
		});
		$("input[name=def_yp_mido]:checkbox").change(function(e){
			var layerList = new Module.JSLayerList(false);
			if(this.checked){
				layerList.nameAtLayer("hybrid_yp_img").setVisible(true);
				Module.getViewCamera().look(new Module.JSVector3D(127.49269674567306,37.44780629500614,3285.4556503482163),new Module.JSVector3D(127.49588919835747,37.49235681415701,29.605339178815484));
			}else{
				layerList.nameAtLayer("hybrid_yp_img").setVisible(false);
			}
		});
		$("input[name=def_yp_add_mido]:checkbox").change(function(e){
			var layerList = new Module.JSLayerList(false);
			if(this.checked){
				layerList.nameAtLayer("hybrid_yp_add_img").setVisible(true);
				Module.getViewCamera().look(new Module.JSVector3D(127.34799801958651,37.4747785370799,12611.658847973682),new Module.JSVector3D(127.34799802621527,37.60742892375562,-4.067672338336706))
			}else{
				layerList.nameAtLayer("hybrid_yp_add_img").setVisible(false);
			}
		});
		$("input[name=hybrid_img_NYJ_4cm]:checkbox").change(function(e){
			var layerList = new Module.JSLayerList(false);
			if(this.checked){
				layerList.nameAtLayer("hybrid_img_NYJ_4cm").setVisible(true);
				Module.getViewCamera().look(new Module.JSVector3D(127.16228039963708,37.65262905387229,836.2711204709485),new Module.JSVector3D(127.1733784553808,37.6589774659238,36.48607640527189));
			}else{
				layerList.nameAtLayer("hybrid_img_NYJ_4cm").setVisible(false);
			}
		});
		$("input[name=hybrid_img_SC_10cm]:checkbox").change(function(e){
			var layerList = new Module.JSLayerList(false);
			if(this.checked){
				layerList.nameAtLayer("hybrid_img_SC_10cm").setVisible(true);
				Module.getViewCamera().look(new Module.JSVector3D(128.60900329488348,38.192097843727446,300.13549224380404),new Module.JSVector3D(128.60214397244113,38.191219124967446,2.31820822507143))
			}else{
				layerList.nameAtLayer("hybrid_img_SC_10cm").setVisible(false);
			}
		});
		$("input[name=bldg_add_building]:checkbox").change(function(e){
			var yp_array = ["bldg_yp_building","bldg_yp_update_building","bldg_yp_update2_building","bldg_NYJ_building_level_15","bldg_SC_building_level_15"];
			var layerList = new Module.JSLayerList(false);
			if(this.checked){
				layerList.nameAtLayer(yp_array[e.target.value]).setVisible(true);
			}else{
				layerList.nameAtLayer(yp_array[e.target.value]).setVisible(false);
			}
		});
		$("input[name=daegu_alpha_city]:checkbox").change(function(e){
			var layerList = new Module.JSLayerList(false);
			if(this.checked){
				layerList.nameAtLayer("bldg_alphacity_lv15_240612").setVisible(true);
				Module.getViewCamera().look(new Module.JSVector3D(128.68444923982247,35.83107943860862,451.95589186716825),new Module.JSVector3D(128.68186124607317, 35.83524223249128, 98.86341826338321));
			}else{
				layerList.nameAtLayer("bldg_alphacity_lv15_240612").setVisible(false);
			}
		});
		$("input[name=vive_golf]:checkbox").change(function(e) {

			var layerList=new Module.JSLayerList(false);
		
			Module.getViewCamera().setLocation(new Module.JSVector3D(126.633989, 37.547731, 8000));

			if(this.checked){

				var terrain = Module.getTerrain();
				terrain.setRequestUrlOption({
					urltype : "xdserver",
					dem : {
						url : "//3dmap.egiscloud.com:8080",
						server : "/XDServer",
						layer : "vive"
					}
				});
				Module.SetEncodingVWorldDEM(false);
				terrain.SetMaxLevel(20);
				Module.XDRenderData();
			
				layerList.nameAtLayer("facility_vive").setVisible(true);
				layerList.nameAtLayer("vive_golf_img").setVisible(true);

				if(layerList.nameAtLayer("ghost_tree_1") != null){
					layerList.nameAtLayer("ghost_tree_1").setVisible(true);
					layerList.nameAtLayer("ghost_tree_2").setVisible(true);
					layerList.nameAtLayer("ghost_tree_3").setVisible(true);
					layerList.nameAtLayer("ghost_tree_4").setVisible(true);
					layerList.nameAtLayer("ghost_tree_5").setVisible(true);
				}

				for(var i=1;i<=5;i++){
					Module.getGhostSymbolMap().addGhostSymbolBy3DS("tree_"+i, "/userData/newlayer/MAP_DATA/vivModel", "tree_"+i);
				}

				Module.getGhostSymbolMap().addGhostSymbolBy3DS("tree_1", "/userData/newlayer/MAP_DATA/vivModel", "tree_1");
				Module.getGhostSymbolMap().addGhostSymbolBy3DS("tree_2", "/userData/newlayer/MAP_DATA/vivModel", "tree_2");
				Module.getGhostSymbolMap().addGhostSymbolBy3DS("tree_3", "/userData/newlayer/MAP_DATA/vivModel", "tree_3");
				Module.getGhostSymbolMap().addGhostSymbolBy3DS("tree_4", "/userData/newlayer/MAP_DATA/vivModel", "tree_4");
				Module.getGhostSymbolMap().addGhostSymbolBy3DS("tree_5", "/userData/newlayer/MAP_DATA/vivModel", "tree_5");

				Module.getGhostSymbolMap().addGhostSymbolBy3DS("bucket", "/userData/newlayer/MAP_DATA/vivModel", "bucket");
				Module.getGhostSymbolMap().addGhostSymbolBy3DS("tbox_b", "/userData/newlayer/MAP_DATA/vivModel", "tbox_b");
				Module.getGhostSymbolMap().addGhostSymbolBy3DS("tbox_r", "/userData/newlayer/MAP_DATA/vivModel", "tbox_r");
				Module.getGhostSymbolMap().addGhostSymbolBy3DS("tbox_w", "/userData/newlayer/MAP_DATA/vivModel", "tbox_w");
				Module.getGhostSymbolMap().addGhostSymbolBy3DS("tube", "/userData/newlayer/MAP_DATA/vivModel", "tube");

				Module.canvas.addEventListener("Fire_GhostSymbolRegistComplete", function(e){
					var text=e.strGhostSymbolKey.split("\.")[0];
					// 3DS 모델 텍스쳐 적용
					Module.getGhostSymbolMap().setGhostSymbolTexture(e.strGhostSymbolKey, "/userData/newlayer/MAP_DATA/vivModel", text+".jpg"); 
					
					// 3DS 모델 데이터 로드 완료 후 타일 레이어 추가
					Module.XDEMapCreateLayer("ghost_"+e.strGhostSymbolKey, "3dmap.egiscloud.com:8080", 0, true, true, false, 7, 0, 15);
					
					// 모델 위치 align 및 basepoint 설정
					var layerList = new Module.JSLayerList(true);
					var layer = layerList.nameAtLayer("ghost_"+e.strGhostSymbolKey);
					if (layer != null) {
						layer.setGhostSymbolTilePosition({
							align : "bottom",
							basepoint : [0.0, -0.6, 0.0]
						});
					}
				});

			}else{
			
				layerList.nameAtLayer("facility_vive").setVisible(false);
				layerList.nameAtLayer("vive_golf_img").setVisible(false);

				layerList.nameAtLayer("ghost_tree_1").setVisible(false);
				layerList.nameAtLayer("ghost_tree_2").setVisible(false);
				layerList.nameAtLayer("ghost_tree_3").setVisible(false);
				layerList.nameAtLayer("ghost_tree_4").setVisible(false);
				layerList.nameAtLayer("ghost_tree_5").setVisible(false);

				var terrain = Module.getTerrain();
				terrain.SetUseDemBox(false);

				terrain.setRequestUrlOption({
					urltype : "xdserver",
					dem : {
				        url : "//3dmap.egiscloud.com",
				        server : "/XDServer",
				        layer : "dem"
				    }
				});
				Module.SetEncodingVWorldDEM(false);
				terrain.SetMaxLevel(20);
				
				Module.XDRenderData();
			}

		});
		
		$("input[name=yifacility]:checkbox").change(function(e) {
			var layerList = new Module.JSLayerList(false);

			if(this.checked) {
				
				var camera = Module.getViewCamera();
				camera.setLocation(new Module.JSVector3D(127.0864544794743, 37.30364070515238, 1000));
				camera.setTilt(90.0);
	
				layerList.nameAtLayer("seomjin_png").setVisible(true);
				layerList.nameAtLayer("seomjin_png").setVisible(true);
				layerList.nameAtLayer("seomjin_png").setVisible(true);
				layerList.nameAtLayer("seomjin_png").setVisible(true);
				layerList.nameAtLayer("seomjin_png").setVisible(true);

			}else{

				layerList.nameAtLayer("seomjin_png").setVisible(false);
				layerList.nameAtLayer("seomjin_png").setVisible(false);
				layerList.nameAtLayer("seomjin_png").setVisible(false);
				layerList.nameAtLayer("seomjin_png").setVisible(false);
				layerList.nameAtLayer("seomjin_png").setVisible(false);
			}
		});

		
		$("input[name=usfacility]:checkbox").change(function(e) {
			
			var layerList = new Module.JSLayerList(false);

			if(this.checked) {
				
				var camera = Module.getViewCamera();
				camera.setLocation(new Module.JSVector3D(129.312117, 35.538658, 1000));
				camera.setTilt(90.0);
	
				layerList.nameAtLayer("bldg_ulsancityhall").setVisible(true);
			
			}else{

				layerList.nameAtLayer("bldg_ulsancityhall").setVisible(false);
			
			}
		});

		$("input[name=sumjin]:checkbox").change(function(e) {
			if(this.checked) {
				
				var camera = Module.getViewCamera();
				camera.setLocation(new Module.JSVector3D(127.19779019144427, 35.621573855123714, 13741.138703819364));
				camera.setTilt(90.0);
				
				var layerList = new Module.JSLayerList(false);
				var layer = layerList.nameAtLayer("seomjin_png");
				if (layer == null) {
					Module.XDEMapCreateLayer("seomjin_png", "egiscloud.com:8080", 0, false, true, false, 10, 0, 17);
				} else {
					layer.setVisible(true);
				}
				Module.getMap().setTileObjectRenewLevel(10);

				layer = layerList.nameAtLayer("seomjin_bridge");
				if (layer == null) {
					Module.XDEMapCreateLayer("seomjin_bridge", "egiscloud.com:8080", 0, true, true, false, 9, 0, 10);
				} else {
					layer.setVisible(true);
				}
				

				var terrain = Module.getTerrain();
				terrain.setRequestUrlOption({
					urltype : "user",
					dem : {
						url : "//www.egiscloud.com/seomjin",
						path : "/dem",
						format : "bil"
					}
				});
				Module.SetEncodingVWorldDEM(false);
				terrain.SetMaxLevel(19);
				
				Module.XDRenderData();
				
			} else {
				var layerList = new Module.JSLayerList(false);
				var layer = layerList.nameAtLayer("seomjin_png");
				if (layer != null) {
					layer.setVisible(false);
				}

				layer = layerList.nameAtLayer("seomjin_bridge");
				if (layer != null) {
					layer.setVisible(false);
				}
				Module.getMap().setTileObjectRenewLevel(12);

				var terrain = Module.getTerrain();
				terrain.setRequestUrlOption({
					urltype : "xdserver",
					dem : {
				        url : "//3dmap.egiscloud.com",
				        server : "/XDServer",
				        layer : "dem"
				    }
				});
				Module.SetEncodingVWorldDEM(false);
				terrain.SetMaxLevel(16);
				
				Module.XDRenderData();
			}
		});
		
		$("input[name=facility_busan]:checkbox").change(function(e){
			var layerList = new Module.JSLayerList(false);
			if(this.checked){
				layerList.nameAtLayer("57").setVisible(true);
				Module.getViewCamera().look(new Module.JSVector3D(129.2520891595621,35.383470490025104,643.7461247304454),new Module.JSVector3D(129.25730599598623, 35.37369340199262, 84.55262207519263))
			}else{
				layerList.nameAtLayer("57").setVisible(false);
			}
		});
	},
	
}

//메뉴 - 앱
var dtcApps = {
	front : null,
	onfront:[],
	global:{
	},
	instance:function(){
		alert('앱');
	},
	resetModuleModal:function(){
		IDE.MODULE.obj
		$("#moduleResetList").modal({backdrop:'static'});
	},
	callModule:function(m){
		if(event.target.id == ""){return false;}
		$("#menuArea").hide();
		$("#btnToggle").children('.btn').removeClass('active');
		$("#btnToggleSetup").children('.btn').removeClass('active');
		if(IDE.MODULE.execs.length == 0){
			//실행중인 앱 목록보기 아이콘
			$(".appList").css("visibility","");
			//$(".appListIcon").css("visibility","");
			//$(".appListText").css("visibility","");
		}
		//장소 poi 지우기
		Module.XDEMapRemoveLayer("interestPoint");
		$(".list-group-item").removeClass("listActive");
		dtcSearch.global.selectData = "";
		if(dtcSearch.global.layer != null) dtcSearch.global.layer.removeAll();
		if(m == dtcApps.front) {
			//이미 켜져있는 기능일 경우
			$("#navs-analy-"+m).addClass("show active");
			$("#navs-analy-"+m).css("display","");
			return;	
		}
		
		dtcApps.loadModule(m);
	},
	callFrontModule:function(m){
		//if(event.target.id == ""){return false;}
		$("#menuArea").hide();
		$("#btnToggle").children('.btn').removeClass('active');
		$("#btnToggleSetup").children('.btn').removeClass('active');
		if(IDE.MODULE.execs.length == 0){
			//실행중인 앱 목록보기 아이콘
			$(".appList").css("visibility","");
			//$(".appListIcon").css("visibility","");
			//$(".appListText").css("visibility","");
		}
		//장소 poi 지우기
		//Module.XDEMapRemoveLayer("interestPoint");
		$(".list-group-item").removeClass("listActive");
		dtcSearch.global.selectData = "";
		if(dtcSearch.global.layer != null) dtcSearch.global.layer.removeAll();
		if(m == dtcApps.front) {
			//이미 켜져있는 기능일 경우
			$("#navs-analy-"+m).addClass("show active");
			$("#navs-analy-"+m).css("display","");
			return;	
		}
		setTimeout(function() {
			dtcApps.loadModule(m);
		}, 1500);
	},
	callBackModule:function(m){
		//if(event.target.id == ""){return false;}
		$("#menuArea").hide();
		$("#btnToggle").children('.btn').removeClass('active');
		$("#btnToggleSetup").children('.btn').removeClass('active');
		if(IDE.MODULE.execs.length == 0){
			//실행중인 앱 목록보기 아이콘
			$(".appList").css("visibility","");
			//$(".appListIcon").css("visibility","");
			//$(".appListText").css("visibility","");
		}
		//장소 poi 지우기
		//Module.XDEMapRemoveLayer("interestPoint");
		$(".list-group-item").removeClass("listActive");
		dtcSearch.global.selectData = "";
		if(dtcSearch.global.layer != null) dtcSearch.global.layer.removeAll();
		if(m == dtcApps.front) {
			//이미 켜져있는 기능일 경우
			$("#navs-analy-"+m).addClass("show active");
			$("#navs-analy-"+m).css("display","");
			return;	
		}
		setTimeout(function() {
			$("#navs-analy-"+m+"-link .spinnericon").css("visibility","visible");
			$("#navs-analy-"+m+"-link .closeicon").css("display","");
		}, 1500);
	},

	/* mdid로 module_obj 객체 반환 sumin 210628 */
	getModuleObject : function(m) {

		if (typeof m != 'number') {
			return null;
		}

		for (var i = 0; i < IDE.MODULE.obj.moduleList.length; i++) {
			if (m == IDE.MODULE.obj.moduleList[i].mdid) {
				return eval(IDE.MODULE.obj.moduleList[i].module_obj);
			}
		}
		return null;
	},

	loadModule:function(m) {

		// 기존 실행 중인 모듈은 hide 호출 sumin 210628
		var frontModule = this.getModuleObject(dtcApps.front);
		if (frontModule != null) {
			//hide 추후 삭제 필요
			if (typeof frontModule.hide == 'function') {
				frontModule.hide();
			}
			if (typeof frontModule.onBackground == 'function') {
				frontModule.onBackground();
			}
		}

		// checking beforeExecute	
		// if(IDE.MODULE.execs.length != 0	
		for(var i = 0; i < IDE.MODULE.execs.length; i++) {	
			if(IDE.MODULE.execs[i] == m) {	
				// call front selecte module	
				IDE.MODULE.initModuleInterface(m);	
 
				for(var i = 0; i < IDE.MODULE.execs.length; i++) {	
					// console.log($("#navs-analy-"+i+"-link"));	
					$("#navs-analy-"+IDE.MODULE.execs[i]+"-link").removeClass("active");	
						
					$("#navs-analy-"+IDE.MODULE.execs[i]).removeClass("show active");	
					$("#navs-analy-"+IDE.MODULE.execs[i]).css("display","none");
						
				}	
					
				$("#navs-analy-"+m+"-link").addClass("active");	
				$("#navs-analy-"+m).addClass("show active");
				$("#navs-analy-"+m).css("display","");

				dtcApps.front = m;
				
				for(var i = 0; i < IDE.MODULE.obj.moduleList.length; i++) {
					if(m == IDE.MODULE.obj.moduleList[i].mdid) {
						currentModule = IDE.MODULE.obj.moduleList[i];
					}
				}

				//console.log(currentModule);
				currentModule.module_obj.mdid = m;
				var moduleObj = currentModule.module_obj;

				//console.log(moduleObj);
				
				var width= $("#legendInfo").css("width");
				if(currentModule.design_type == 0) {
					// 가로 하단
					if($("#legendInfo").attr("value") =="right"){
						$("#legendInfo").css('left','calc(100% - '+width+' - 10px)');
					}
					$("#toolAre2").css('right','0px');
					$("#nationalPointPanel").css('right','55px');
					$("#layout-navbar").css('right', '5px');
				} else if(currentModule.design_type == 1) {
					// 우측 소
					if($("#legendInfo").attr("value") =="right"){
						$("#legendInfo").css('left','calc(100% - '+width+' - 380px)');
					}
					$("#toolAre2").css('right','365px');
					$("#nationalPointPanel").css('right','420px');
					$("#layout-navbar").css('right', '375px');
				} else if(currentModule.design_type == 2) {
					// 우측 중
					if($("#legendInfo").attr("value") =="right"){
						$("#legendInfo").css('left','calc(100% - '+width+' - 590px)');
					}
					$("#toolAre2").css('right','575px');
					$("#nationalPointPanel").css('right','630px');
					$("#layout-navbar").css('right', '575px');

				} else if(currentModule.design_type == 3) {
					// 우측 대

				}
				

				// 모듈에 함수가 없는 것을 대비.. sumin 210630
				if (typeof eval(moduleObj) == "object") {
					//display 추후 삭제 필요
					if(typeof eval(moduleObj).display == "function") {
						eval(moduleObj).display();
					}
					if(typeof eval(moduleObj).onForeground == "function") {
						eval(moduleObj).onForeground();
					}
				}
	
				return;	
			}	
		}	
		// reset nav tab	
		for(var i = 0; i < IDE.MODULE.execs.length; i++) {	
			// console.log($("#navs-analy-"+i+"-link"));	
			$("#navs-analy-"+IDE.MODULE.execs[i]+"-link").removeClass("active");	
				
			$("#navs-analy-"+IDE.MODULE.execs[i]).removeClass("show active");
			$("#navs-analy-"+IDE.MODULE.execs[i]).css("display","none");
		}	
			
		var currentModule = null;	
			
		for(var i = 0; i < IDE.MODULE.obj.moduleList.length; i++) {	
			if(m == IDE.MODULE.obj.moduleList[i].mdid) {	
				currentModule =IDE.MODULE.obj.moduleList[i];	
			}	
		}	
			
		var ts = + new Date();	
			
			
		var jsSrc = currentModule.js_url;	
		var htmlSrc = currentModule.html_url;	
		var cssSrc = currentModule.css_url;	
			
			
		var moduleObj = currentModule.module_obj;

			
		// js까지 다 부르고 추가 라이브러리 있으면 다 부르기 sumin 201203	
		if (currentModule.is_extjs == "Y") {	
			dtcApps.loadExtraModules(currentModule.mdid, IDE.MODULE.obj.moduleExtObjectList);	
		}
		

		var cssText = $("#toolAre2").css('right');

		//console.log(currentModule.design_type);
		
		var width= $("#legendInfo").css("width");
		if(currentModule.design_type == 0) {
			// 가로 하단
			if($("#legendInfo").attr("value") =="right"){
				$("#legendInfo").css('left','calc(100% - '+width+' - 10px)');
			}
			$("#toolAre2").css('right','0px');
			$("#nationalPointPanel").css('right','55px');
			$("#layout-navbar").css('right', '5px');
		} else if(currentModule.design_type == 1) {
			// 우측 소
			if($("#legendInfo").attr("value") =="right"){
				$("#legendInfo").css('left','calc(100% - '+width+' - 380px)');
			}
			$("#toolAre2").css('right','365px');
			$("#nationalPointPanel").css('right','420px');
			$("#layout-navbar").css('right', '375px');
		} else if(currentModule.design_type == 2) {
			// 우측 중
			if($("#legendInfo").attr("value") =="right"){
				$("#legendInfo").css('left','calc(100% - '+width+' - 590px)');
			}
			$("#toolAre2").css('right','575px');
			$("#nationalPointPanel").css('right','630px');
			$("#layout-navbar").css('right', '575px');			

		} else if(currentModule.design_type == 3) {
			// 우측 대

		}
		
		
			
		var html = "";	
		html += "<div id=\"navs-analy-"+m+"\">\n";	
		html += "\t<div class=\"pt-0 pl-0 pr-0 pb-0\" id=\"analy_"+m+"_body\">\n";	
		html += "\t</div>\n";	
		html += "</div>\n";	
			
		$("#moduleUITabContent").append(html);	
		/* css, html, js 순서로 load */	
			
		if(cssSrc != null) {	
			// load html	
			console.log("html");	
			IDE.MODULE.execs.push(m);
			$("#navs-analy-"+m+"-link .spinnericon").css("visibility","visible");
			$("#navs-analy-"+m+"-link .closeicon").css("display","");
			//실행중인 앱 목록
			/*var text = $("#navs-analy-"+m+"-link").text().slice(1);
			var html = "";
			html += "<div id='navs-analy-"+m+"-list' class='form-group mb-0 row' style='display: inline;'>";
			html += "<label class='col-form-label col-6 text-white'>"+text+"</label>";
			html += "<label class='switcher col-3' style='margin-left: 8px;'>";
			html += "<input type='checkbox' class='switcher-input' checked=''>";
			html += "<span class='switcher-indicator'>";
			html += "<span class='switcher-yes'>";
			html += "<span class='ion ion-md-checkmark'></span>";
			html += "</span>";
			html += "<span class='switcher-no'>";
			html += "<span class='ion ion-md-close'></span>";
			html += "</span>";
			html += "</span>";
			html += "</label>";
			html += "<button type='button' class='btn icon-btn btn-outline-close mr-3' onclick='IDE.MODULE.closeModule("+m+");'><span class='lnr lnr-trash'></span></button>";
			html += "</div>";
			
			$("#appListForm").append(html);
			
			var icon = ["","","","fas fa-adjust","fas fa-industry","fas fa-sun","fas fa-laptop","","fas fa-fire","","태풍"]
			var html = "";
			html += "<div id='navs-analy-"+m+"-list' class='form-group mb-0 mr-4' style='display: inline-table;'>";
			html += "<i class='pr-1 fa-lg "+icon[m]+"' title='"+text+"' data-placement='bottom' data-toggle='tooltip'></i>";
			html += "<a href='javascript:IDE.MODULE.closeModule("+m+");' class='btn btn-xs btn-icon btn-circle btn-danger' style='padding-left: 1px;padding-right: 1px;line-height: 0.5;'><i class='fa fa-times'></i></a>"
			html += "</div>";
			$("#appListTextForm").append(html);
			
			var html = "";
			html += "<div id='navs-analy-"+m+"-list' class='form-group mb-0 mr-4' style='display: inline-table;'>";
			html += "<label class='col-form-label text-white'>"+text+"</label>";
			html += "<a href='javascript:IDE.MODULE.closeModule("+m+");' class='btn btn-xs btn-icon btn-circle btn-danger pr-1 pl-1'><i class='fa fa-times'></i></a>"
			html += "</div>";
			$("#appListIconForm").append(html);*/
				
				
			$("#analy_"+m+"_body").load(htmlSrc, function() {	
				var id = "m_s_"+m;
				$.loadCSS(cssSrc,id, function() {	
					$.getScript(jsSrc, function() {	
						// Module load finish	
						console.log('load');	
							
						$("#navs-analy-"+m+"-link").addClass("active");	
						$("#navs-analy-"+m).addClass("show active");
						$("#navs-analy-"+m).css("display","");
							
				/*		var html = "";	
						html += "<div class=\"moduleUISlideDownWrap\">\n";	
						html += "\t<a href=\"JavaScript:IDE.UI.MODULE_PANEL.slideDown();\"><button type=\"button\" class=\"btn btn-sm btn-secondary rounded-right\" style=\"outline: rgb(255, 255, 255) none 0px;\"><i class=\"fa fa-angle-double-down\"></i> 컨트롤 숨기기</button></a>\n";	
						html += "</div>\n";	
							
						$("#analy_"+m+"_body").append(html);	*/
							
						eval(moduleObj).appid = m;
						$.ajax({
							url:'/layer/selectModuleItem.do',
							type:'POST',
							data:{mdid:m},
							dataType:'json',
							success:function(result){
								//console.log(moduleObj);
								eval(moduleObj).extPath = result.moduleInfo.data_directory;
								eval(moduleObj).init();
								LOG_TRACKER.write("42",'1',"앱 실행:{APPID:"+m+"}");
							}
						})
					}).fail(function() {	
						console.log("fail");
					}).done(function() {
						console.log("done");
						
					});
				});
			});
		} else {

		}


		dtcApps.front = m;
		$("#appListBtn").css("background-color","yellowgreen");
		$("#analysBtn-items").toggle();
		$("#analysBtn-items .dropdown-menu").css('display', 'none');
		
	},
	// 추가 모듈 로드	
	loadExtraModules : function(mdid, extraModules) {	
			
		for (var i=0; i<extraModules.length; i++) {	
				
			for (var j=0; j<extraModules[i].length; j++) {	
				
				// 지금 로드 된 모듈 번호와 같으면 로드	
				if (mdid == extraModules[i][j].mdid) {
					// console.log(extraModules[i][j]);	
					if(extraModules[i][j].file_type == "css") {	
						var id = "m_css_"+mdid+"_"+j;
						var htmlLib ="<link id=\""+id+"\" href=\""+extraModules[i][j].file_url+"\" rel=\"stylesheet\">";
						if($("body").find("#"+id)){
							$("body").find("#"+id).remove();
						}
						$("body").append(htmlLib);
						
						/*
						$.loadCSS(extraModules[i][j].file_url, id, function() {	
								
						});*/
					} else if(extraModules[i][j].file_type == "js") {
						var id = "m_js_"+mdid+"_"+j;
						var htmlLib ="<script id=\""+id+"\" src=\""+extraModules[i][j].file_url+"\"></script>";
						if($("body").find("#"+id)){
							$("body").find("#"+id).remove();
						}
						$("body").append(htmlLib);
						
						//$.getScript(extraModules[i][j].file_url);	
					}
				}
			}	
		}	
	}
}

//메뉴 - 스토어
var dtcStore={
	global:{
		searchResult:{},
		initSearchTypehead:function(){
			 $.ajax({
				 url:'./ide/getAppProductLists.do',
				 type:'POST',
				 dataType:'json',
				 success:function(data){
					 var list = [];
					 data = data.RS;
					 if(D_TRASLATION.global.userLanguage == 'ko'){
					 	for(var i=0;i<data.length;i++){
					 		list.push(data[i]['NAME']);
					 	}
					 } else {
						for(var i=0;i<data.length;i++){
							if(data[i]['ENG_NAME'] == null || data[i]['ENG_NAME'] == "") list.push(data[i]['NAME']);
							else list.push(data[i]['ENG_NAME']);
					 	}
					 }
					 console.log(list);
					 $('#markertSearchInput').typeahead({
							highlight: true,
							minLength: 1,
							limit: 10,
							classNames:{
								highlight:'ts-9 text-white pt-0 pb-0 mt-0 mb-0'
							}
						  },
						  {
							name: 'marketplace',
							source: dtcStore.substringMatcher(list)
					 }).on('keyup',this,function(e){
						 //enter key event 
						 if(e.keyCode==13){
							 var searchTxt = $(this).val();
							 dtcStore.searchResultInfo(searchTxt);
							 $(this).typeahead('close');
						 }
						 
					 }).on('typeahead:select',function(ev,suggestion){
						 //검색 결과 마우스 클릭 시
						 dtcStore.searchResultInfo(suggestion);
					 });
				 }
			 });
		},
		getAppProductList:function(){
			
			$.ajax({
				url:'./ide/getAppProductLists.do',
				type:'POST',
				dataType:'json',
				success:function(result){
					dtcStore.setResultList(result,'A');
					dtcStore.global.searchResult=result.RS;
				}
			});
			
		},
		memAppLists:function(mid){
			
			var data={
					MID:mid
			};
			
			$.ajax({
				url:'./ide/getMemAppLists.do',
				type:'POST',
				dataType:'json',
				data:data,
				success:function(result){
					dtcStore.setMemResultList(result,'C');
					dtcStore.global.searchMemResult=result.RS;
				}
			});
		}
		
	},
	instance:function(){

		$('#storeCateSelect').selectpicker({
			dropdownAlignRight:true,
			title:'선택',
			size:10
		});
		
		$('#storeCateSelect').selectpicker('setStyle', 'form-control-sm', 'add');

		$("#storeCateSelect").on('change',function(e){
			var value = $("#storeCateSelect option:selected").val();
			dtcStore.selectSearchInfo(value);
			
		});
		
		$("#searchStoreBtn").on('click',function(e){
			var storeVal=$("#markertSearchInput").val();
			dtcStore.searchResultInfo(storeVal);
		});
		
		 new PerfectScrollbar(document.getElementById('storeDetailArea'),{
			 suppressScrollX:true
		 });
		 
		 dtcStore.global.initSearchTypehead();
		 dtcStore.global.getAppProductList();
		 dtcStore.global.memAppLists(D_MEMBER.MID);
	},
	substringMatcher:function(strs){
		return function findMatches(q, cb) {

			var matches, substringRegex;
			
			matches = [];
			
			substrRegex = new RegExp(q, 'i');
			
			$.each(strs, function(i, str) {
				if (substrRegex.test(str)) {
					matches.push(str);
				}
			});

			cb(matches);
		}
	},
	selectSearchInfo:function(val){
		
		var data={
				CID:val
		}
		
		$.ajax({
			url:'./ide/selectSearchInfo.do',
			type:'POST',
			data:data,
			dataType:'json',
			success:function(data){
				dtcStore.setResultList(data,'S');
				dtcStore.global.searchResult=data.RS;
			}
		})
	},
	searchResultInfo:function(word){
		
		if(word == '' || word ==null){
			COMMON.alert('검색어를 입력해주세요','info',function(){
				$('#markertSearchInput').focus();
				return false;
			});
			
			return false;
		}
		
		var data={
				search:word
		}
		
		$.ajax({
			url:'./ide/getAppProductLists.do',
			type:'POST',
			dataType:'json',
			data:data,
			success:function(data){
				
				dtcStore.setResultList(data,'S');
				dtcStore.global.searchResult=data.RS;
				$("#marketSide li:nth-child(1) a").click();
				
			}
		});
	},
	setMemResultList:function(data,type){
		//$(".memAppListsBody").empty();
		
		var html="";
		
		for(var i=0;i<data.RS.length;i++){
		
			html+="<div class=\"media align-items-center mb-1 hover-overlay pl-2 pr-2 pt-2 pb-2\">\n";
			html+="	<img src=\""+data.RS[i].THUMB+"\" alt=\"\" class=\"d-block ui-w-60\" id=\"exifviewer-img-1\">\n";
			html+="	<div class=\"media-body ml-3\">\n";
			html+="		<h6 class=\"font-weight-bold mb-1 text-white\">"+data.RS[i].NAME+"</h6>\n";
			html+="		<div class=\"text-muted mb-0\" style=\"font-size: 11px;\">"+data.RS[i].LARGE_CATE+" > "+data.RS[i].MIDDLE_CATE+"</div>\n";
			html+="		<div style=\"font-size: 11px; display: inline-flex; width: 100%;\">\n";
			html+="			<div style=\"width: 80%;\">\n";
			html+="				<p class=\"text-warning mb-0\">월 이용료:"+data.RS[i].PRICE.toLocaleString()+"원</p>\n"
			html+="			</div>\n";
			html+="			<div style=\"float: right; width:32%;\">\n";
			html+="				<a href=\"javascript:dtcStore.showMemAppDetail('"+i+"');\" class=\"btn btn-outline-info btn-xs\">상세보기</a>\n"
			html+="			</div>\n";
			html+="		</div>\n";
			html+="	</div>\n";
			html+="</div>\n"
				
		}
		
		
		$(".memAppListsBody").append(html);
	},
	setResultList:function(data,type){
		
		var html="";
		
		if(data.RS.length != 0 ){
			
			for(var i=0;i<data.RS.length;i++){
				
				if(!COMMON.isEmpty(data.RS[i].PID)){
					var cate_second=data.RS[i].MIDDLE_CATE;
					
					if(D_TRASLATION.global.userLanguage != "ko") {
						cate_second = data.RS[i].MIDDLE_ENG_CATE;
					}
					
					if(cate_second == null || cate_second=="undefined"){
						cate_second="";
					}else{
						cate_second=" > "+cate_second;
					}
					
				/*	
					html+="<div class=\"media align-items-center mb-1 hover-overlay pl-2 pr-2 pt-2 pb-2\">\n";
					html+="	<img src=\""+data.RS[i].THUMB+"\" alt=\"\" class=\"d-block ui-w-60\" id=\"exifviewer-img-1\">\n";
					html+="	<div class=\"media-body ml-3\">\n";
					html+="		<h6 class=\"font-weight-bold mb-1 text-white\">"+data.RS[i].NAME+"</h6>\n";
					html+="		<div class=\"text-muted mb-0\" style=\"font-size: 11px;\">"+data.RS[i].LARGE_CATE+cate_second+"</div>\n";
					html+="		<div style=\"font-size: 11px; display: inline-flex; width: 100%;\">\n";
					html+="			<div style=\"width: 80%;\">\n";
					html+="				<p class=\"text-warning mb-0\">월 이용료:"+data.RS[i].PRICE.toLocaleString()+"원</p>\n"
					html+="			</div>\n";
					html+="			<div style=\"float: right; width: 32%;\">\n";
					html+="				<a href=\"javascript:dtcStore.showPrdcDetail('"+i+"');\" class=\"btn btn-outline-info btn-xs\">상세보기</a>\n"
					html+="			</div>\n";
					html+="		</div>\n";
					html+="	</div>\n";
					html+="</div>\n";*/
					
					html+="<div class='col-sm-6 col-xl-4'><div class='card mb-4'><div class='w-100'>";
					if(data.RS[i].THUMB == null || data.RS[i].THUMB == ""){
						if(window.location.href.indexOf("beta") > -1 || window.location.href.indexOf("newlayer") > -1
							|| window.location.href.indexOf("alpha") > -1 || window.location.href.indexOf("delta") > -1){
							html+="<a href='javascript:dtcStore.showPrdcDetail("+i+")' class='card-img-top d-block ui-rect-60 ui-bg-cover' style='background-image: url(\"/assets/images/img-noimg-new.png\");'>";
						}else{
							html+="<a href='javascript:dtcStore.showPrdcDetail("+i+")' class='card-img-top d-block ui-rect-60 ui-bg-cover' style='background-image: url(\"/assets/images/img-noimg.png\");'>";
						}
					}
					else{
						html+="<a href='javascript:dtcStore.showPrdcDetail("+i+")' class='card-img-top d-block ui-rect-60 ui-bg-cover' style='background-image: url(\""+data.RS[i].THUMB+"\");'>";
					}
					html+="<div class='d-flex justify-content-between align-items-end ui-rect-content p-3'>";
					if(D_TRASLATION.global.userLanguage != "ko") {
						html+="<div class='flex-shrink-1'><span class='badge badge-primary'>"+data.RS[i].LARGE_ENG_CATE+cate_second+"</span></div>";
					} else {
						html+="<div class='flex-shrink-1'><span class='badge badge-primary'>"+data.RS[i].LARGE_CATE+cate_second+"</span></div>";
					}
					if(data.RS[i].PRICE.toLocaleString() == '0'){
						html+="<div class='text-big'><div class='badge badge-danger font-weight-bold'>FREE</div>";
					}
					else{
						html+="<div class='text-big'><div class='badge badge-dark font-weight-bold'>"+data.RS[i].PRICE.toLocaleString()+"원</div>";
					}
					html+="</div></div></a></div>";
					if(D_TRASLATION.global.userLanguage == 'ko'){
						html+="<div class='card-body'><h5 class='mb-3'><a href='javascript:dtcStore.showPrdcDetail("+i+")' class='text-body'>"+data.RS[i].NAME+"</a></h5>";
						html+="<p class='text-muted mb-3'>"+unescapeHtml(data.RS[i].COMMENT)+"</p>";
					} else {
						if(data.RS[i].ENG_NAME == null || data.RS[i].ENG_NAME == "") {
							html+="<div class='card-body'><h5 class='mb-3'><a href='javascript:dtcStore.showPrdcDetail("+i+")' class='text-body'>"+data.RS[i].NAME+"</a></h5>";
						} else {
							html+="<div class='card-body'><h5 class='mb-3'><a href='javascript:dtcStore.showPrdcDetail("+i+")' class='text-body'>"+data.RS[i].ENG_NAME+"</a></h5>";
						}
						if(data.RS[i].ENG_COMMENT == null || data.RS[i].ENG_COMMENT == "") {
							html+="<p class='text-muted mb-3'>"+unescapeHtml(data.RS[i].COMMENT)+"</p>";
						} else {
							html+="<p class='text-muted mb-3'>"+unescapeHtml(data.RS[i].ENG_COMMENT)+"</p>";
						}
						
					}
					html+="<div class='media'><div class='media-body'><div class='ui-stars'>";
					html+="<div class='ui-star filled'><i class='ion ion-md-star'></i><i class='ion ion-md-star'></i></div>";
					html+="<div class='ui-star filled'><i class='ion ion-md-star'></i><i class='ion ion-md-star'></i></div>";
					html+="<div class='ui-star filled'><i class='ion ion-md-star'></i><i class='ion ion-md-star'></i></div>";
					html+="<div class='ui-star filled'><i class='ion ion-md-star'></i><i class='ion ion-md-star'></i></div>";
					html+="<div class='ui-star half-filled'><i class='ion ion-md-star'></i><i class='ion ion-md-star'></i></div>";
					html+="</div><a href='javascript:void(0)' class='text-muted small'>55</a></div>";
					html+="</div></div></div></div>";
				}
			}
			
		}else{
			html+="<div class=\"col-sm-12 col-xl-12 mb-1 pl-2 pr-2 pt-2 pb-2 text-center mt-2\">\n";
			html+="	<p class=\"ts-10 text-white mt-3\">"+$.i18n.t('Index.nav.market_place.alert.no_app')+"</p>\n"
			html+="</div>\n"
		}
		
		if(type=='S' || type=='A'){
			
			$(".appProductLists").empty();
			$(".appProductLists").append(html);

			$("#storeAreResult")[0].scrollTop = 0;
			

			$("#storeDetailArea").hide();
			$("#storeAreResult").show();
			
		}
		function unescapeHtml(text){
			if(text != "" && text != null ){					
				return text.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"");
			}
		};
	},
	showMemAppDetail:function(indx){
		
		var htmlTitle=dtcStore.global.searchMemResult[indx].NAME+" <small><span class=\"text-light ts-11\">"+dtcStore.global.searchMemResult[indx].LARGE_CATE+" > "+dtcStore.global.searchMemResult[indx].MIDDLE_CATE+"</span></small>";
		
		//회사 정보
		
		//회사이름
		if(dtcStore.global.searchMemResult[indx].COM_NAME != "" || dtcStore.global.searchMemResult[indx].COM_NAME != "undefined"){
			$("#cmpName").text(dtcStore.global.searchMemResult[indx].COM_NAME);
		}
		
		//연락처
		if(dtcStore.global.searchMemResult[indx].COM_TEL != "" || dtcStore.global.searchMemResult[indx].COM_TEL != "undefined"){
			$("#cmpContactNum").text(dtcStore.global.searchMemResult[indx].COM_TEL);
		}
		
		//이메일
		if(dtcStore.global.searchMemResult[indx].COM_EMAIL != "" || dtcStore.global.searchMemResult[indx].COM_EMAIL != "undefined"){
			$("#cmpEmail").text(dtcStore.global.searchMemResult[indx].COM_EMAIL);
		}
		
		//회사 홈페이지
		if(dtcStore.global.searchMemResult[indx].COM_HOMEPAGE != "" || dtcStore.global.searchMemResult[indx].COM_HOMEPAGE != "undefined"){
			$("#cmpHompage").attr("src",dtcStore.global.searchMemResult[indx].COM_HOMEPAGE);
			$("#cmpHompage").text(dtcStore.global.searchMemResult[indx].COM_HOMEPAGE);
		}
		
		//상세메뉴 타이틀 설정
		$("#prdDetailPrdName").empty();
		$("#prdDetailPrdName").append(htmlTitle);
		
		//상세메뉴 썸네일 설정
		$("#prdDetailImg").attr("src",'');
		$("#prdDetailImg").attr("src",dtcStore.global.searchMemResult[indx].THUMB);
		
		//basic info
		$("#priceInfo").empty();
		$("#priceInfo").append("<strong class=\"text-white\">月 이용료 <i class=\"fas fa-won-sign\"></i>"+dtcStore.global.searchMemResult[indx].PRICE+"</strong>");
		
		//카테고리 이름
		$("#prdCateNmDetail").text(dtcStore.global.searchMemResult[indx].NAME);
		
		//상태
		$("#prdStatus").empty();
		
		var statusClass="badge-success";
		var statusStr="서비스 중";
		
		if(dtcStore.global.searchMemResult[indx].STATE!="1"){
			statusClass="badge-warning";
			statusStr="서비스 중단";
		}
		
		$("#prdStatus").append("<span class=\"badge "+statusClass+"\">"+statusStr+"</span>");
		
		if(dtcStore.global.searchMemResult[indx].VIDEO_URL==''){
			$("#prdDetailNoVideo").show();
			$("#prdVideo").hide();
		}else{
			$("#prdVideo").attr("src",dtcStore.global.searchMemResult[indx].VIDEO_URL);
			$("#prdVideo").show();
			$("#prdDetailNoVideo").hide();
		}
		
		//소개 썸네일 설정
		$("#prdIntrThumb").attr("src",'');
		$("#prdIntrThumb").attr("src",dtcStore.global.searchMemResult[indx].THUMB);
		
		String.prototype.escapeHtml = function(){
			  return this.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\"/g, "&quot;");
			};
			 
		String.prototype.unescapeHtml = function(){
		  return this.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"");
		};

		//소개 설명
		var textIntro =dtcStore.global.searchMemResult[indx].COMMENT.unescapeHtml();
		$("#prdDetailIntroTxt").empty();
		$("#prdDetailIntroTxt").append(textIntro);
		
		//주요기능
		var mainfunStr = dtcStore.global.searchMemResult[indx].COMMENT_SPEC.unescapeHtml();
		$("#mainFunctionPrd").empty();
		$("#mainFunctionPrd").append(mainfunStr);
		
		$("#storeDetailArea").show("slide", { direction: "left" }, 200);
		
		var imgUrlArr=[];
		var imgSliderHtml="";
		
		if(!COMMON.isEmpty(dtcStore.global.searchMemResult[indx].SC1_URL)){
			imgUrlArr.push(dtcStore.global.searchMemResult[indx].SC1_URL);
		}
		
		if(!COMMON.isEmpty(dtcStore.global.searchMemResult[indx].SC2_URL)){
			imgUrlArr.push(dtcStore.global.searchMemResult[indx].SC2_URL);
		 }
		
		if(!COMMON.isEmpty(dtcStore.global.searchMemResult[indx].SC3_URL)){
			imgUrlArr.push(dtcStore.global.searchMemResult[indx].SC3_URL);
		}
		
		if(!COMMON.isEmpty(dtcStore.global.searchMemResult[indx].SC4_URL)){
			imgUrlArr.push(dtcStore.global.searchMemResult[indx].SC4_URL);
		}
		
		if(!COMMON.isEmpty(dtcStore.global.searchMemResult[indx].SC5_URL)){
			imgUrlArr.push(dtcStore.global.searchMemResult[indx].SC5_URL);
		}
		
		if(!COMMON.isEmpty(dtcStore.global.searchMemResult[indx].SC6_URL)){
			imgUrlArr.push(dtcStore.global.searchMemResult[indx].SC6_URL);
		}
		
		for(var i=0;i<imgUrlArr.length;i++){
			imgSliderHtml+="<div class=\"col-12 col-sm-6 col-md-4 col-xl-3 mb-4\">\n";
			imgSliderHtml+="	<a href=\""+imgUrlArr[i]+"\" class=\"d-block border-primary ui-bordered\"> \n";
			imgSliderHtml+="		<img src=\""+imgUrlArr[i]+"\" class=\"img-fluid\" alt=\"\"> \n";
			imgSliderHtml+="	</a>\n";
			imgSliderHtml+="</div>\n";
		}
		
		
		$("#product-item-images").empty();
		$("#product-item-images").append(imgSliderHtml);
		
		$('#product-item-images').on('click', 'a', function(e) {
			e.preventDefault();

			// Select only visible thumbnails
			var links = $('#product-item-images').find('a');

			window.blueimpGallery(links, {
			  container: '#product-item-lightbox',
			  carousel: true,
			  hidePageScrollbars: true,
			  disableScroll: true,
			  index: 101
			});
		  });
	},
	paymentDemo:function(pid){
		
		var formData = new FormData();
		formData.append("pid", pid);
		
		$.ajax({
			url:"/desk/store/buyProductInfo.do",
			type: "POST",
			data: formData,
			processData: false,
			contentType: false,
			enctype: 'multipart/form-data',
			success:function(result) {
				var result=JSON.parse(result);
				if(result.productInfo != null){
					$(".paymentProductPrice").text(result.productInfo.price.toLocaleString('ko-KR')+"원");
					$("#paymentProductPrice").attr("value",result.productInfo.price);
					$("#paymentProductName").text(result.productInfo.name);
					$("#paymentProductId").val(pid);
					$("#checkPaymentModal").modal("show");
				}else{
					COMMON.alert("구매할 수 없습니다\n관리자에게 문의하십시오.","error",function(){return false;});
				}
			}
		});
	},
	paymentFree:function(pid){
		
		var formData = new FormData();
		formData.append("pid", pid);
		
		$.ajax({
			url:"/desk/store/buyProductInfo.do",
			type: "POST",
			data: formData,
			processData: false,
			contentType: false,
			enctype: 'multipart/form-data',
			success:function(result) {
				var result=JSON.parse(result);
				if(result.productInfo != null){		
					var orderId = new Date().getTime();
					var param = { // 결제 수단 파라미터
					  // 결제 정보 파라미터
					  pid: pid,
					  amount: result.productInfo.price.toLocaleString('ko-KR'),
					  orderId: orderId,
					  orderName: result.productInfo.name,
					  customerName: $("#memberName").val(),
					};
					$.ajax({
						url:"/desk/store/storeRequestTemp.do",
						type:'POST',
						data:param,
						dataType:'json',
						success:function(result){
							if(result.rs == "success"){
								LOG_TRACKER.write("41",'1',"무료 앱 구매:{APPID:"+pid+"}");
								var text = "구매가 완료되었습니다.";
								if(window.location.href.indexOf("xdcloud") > -1){
									text = "컨텐츠 사용등록이 완료되었습니다.";
								}
								COMMON.alert(text,'success',function(){
									location.reload();
				                });
							}
						}
					});
				
				}else{
					COMMON.alert("구매할 수 없습니다\n관리자에게 문의하십시오.","error",function(){return false;});
				}
			}
		});
		
		
	},
	showPrdcDetail:function(indx){

		$("#storeAreResult").hide();
		$("#storeDetailArea").show();
		
		var htmlTitle=dtcStore.global.searchResult[indx].NAME+" <small><span class=\"text-light ts-11\">"+dtcStore.global.searchResult[indx].LARGE_CATE;
		if(dtcStore.global.searchResult[indx].MIDDLE_CATE != null){			
			htmlTitle += " > "+dtcStore.global.searchResult[indx].MIDDLE_CATE;
		}
		htmlTitle += "</span></small>";
		
		//결제 버튼 이벤트 추가 추후 결제 pg사 연동해야함 일단 데모
		if(dtcStore.global.searchResult[indx].PRICE == 0){
			$("#prdPay").attr("href","javascript:dtcStore.paymentFree('"+dtcStore.global.searchResult[indx].PID+"');");
		}else{
			//결제
			$("#prdPay").attr("href","javascript:dtcStore.paymentDemo('"+dtcStore.global.searchResult[indx].PID+"');");
		}
		if(window.location.href.indexOf("xdcloud") > -1){
			$("#prdPay").html("컨텐츠 사용등록");
		}else{
			$("#prdPay").html("결제");
		}
		//회사 정보
		
		//회사이름
		if(dtcStore.global.searchResult[indx].COM_NAME != "" || dtcStore.global.searchResult[indx].COM_NAME != "undefined"){
			$("#cmpName").text(dtcStore.global.searchResult[indx].COM_NAME);
		}
		
		//연락처
		if(dtcStore.global.searchResult[indx].COM_TEL != "" || dtcStore.global.searchResult[indx].COM_TEL != "undefined"){
			$("#cmpContactNum").text(dtcStore.global.searchResult[indx].COM_TEL);
		}
		
		//이메일
		if(dtcStore.global.searchResult[indx].COM_EMAIL != "" || dtcStore.global.searchResult[indx].COM_EMAIL != "undefined"){
			$("#cmpEmail").text(dtcStore.global.searchResult[indx].COM_EMAIL);
		}
		
		//회사 홈페이지
		if(dtcStore.global.searchResult[indx].COM_HOMEPAGE != "" || dtcStore.global.searchResult[indx].COM_HOMEPAGE != "undefined"){
			$("#cmpHompage").attr("src",dtcStore.global.searchResult[indx].COM_HOMEPAGE);
			$("#cmpHompage").text(dtcStore.global.searchResult[indx].COM_HOMEPAGE);
		}
		
		//상세메뉴 타이틀 설정
		$("#prdDetailPrdName").empty();
		$("#prdDetailPrdName").append(htmlTitle);
		
		//상세메뉴 썸네일 설정
		$("#prdDetailImg").attr("src",'');
		$("#prdDetailImg").attr("src",dtcStore.global.searchResult[indx].THUMB);
		
		//basic info
		$("#priceInfo").empty();
		$("#priceInfo").append("<strong class=\"text-white\">月 이용료 <i class=\"fas fa-won-sign\"></i>"+dtcStore.global.searchResult[indx].PRICE+"</strong>");
		
		//카테고리 이름
		$("#prdCateNmDetail").text(dtcStore.global.searchResult[indx].NAME);
		
		//상태
		$("#prdStatus").empty();
		
		var statusClass="badge-success";
		var statusStr="서비스 중";
		
		if(dtcStore.global.searchResult[indx].STATE!="1"){
			statusClass="badge-warning";
			statusStr="서비스 중단";
		}
		
		$("#prdStatus").append("<span class=\"badge "+statusClass+"\">"+statusStr+"</span>");
		
		if(dtcStore.global.searchResult[indx].VIDEO_URL==''){
			$("#prdDetailNoVideo").show();
			$("#prdVideo").hide();
		}else{
			$("#prdVideo").attr("src",dtcStore.global.searchResult[indx].VIDEO_URL);
			$("#prdVideo").show();
			$("#prdDetailNoVideo").hide();
		}
		
		//소개 썸네일 설정
		$("#prdIntrThumb").attr("src",'');
		$("#prdIntrThumb").attr("src",dtcStore.global.searchResult[indx].THUMB);
		
		String.prototype.escapeHtml = function(){
			  return this.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\"/g, "&quot;");
			};
			 
		String.prototype.unescapeHtml = function(){
		  return this.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"");
		};

		//소개 설명
		var textIntro =dtcStore.global.searchResult[indx].COMMENT.unescapeHtml();
		$("#prdDetailIntroTxt").empty();
		$("#prdDetailIntroTxt").append(textIntro);
		
		//주요기능
		var mainfunStr = dtcStore.global.searchResult[indx].COMMENT_SPEC.unescapeHtml();
		$("#mainFunctionPrd").empty();
		$("#mainFunctionPrd").append(mainfunStr);
		
		
		var imgUrlArr=[];
		var imgSliderHtml="";
		
		if(!COMMON.isEmpty(dtcStore.global.searchResult[indx].SC1_URL)){
			imgUrlArr.push(dtcStore.global.searchResult[indx].SC1_URL);
		}
		
		if(!COMMON.isEmpty(dtcStore.global.searchResult[indx].SC2_URL)){
			imgUrlArr.push(dtcStore.global.searchResult[indx].SC2_URL);
		 }
		
		if(!COMMON.isEmpty(dtcStore.global.searchResult[indx].SC3_URL)){
			imgUrlArr.push(dtcStore.global.searchResult[indx].SC3_URL);
		}
		
		if(!COMMON.isEmpty(dtcStore.global.searchResult[indx].SC4_URL)){
			imgUrlArr.push(dtcStore.global.searchResult[indx].SC4_URL);
		}
		
		if(!COMMON.isEmpty(dtcStore.global.searchResult[indx].SC5_URL)){
			imgUrlArr.push(dtcStore.global.searchResult[indx].SC5_URL);
		}
		
		if(!COMMON.isEmpty(dtcStore.global.searchResult[indx].SC6_URL)){
			imgUrlArr.push(dtcStore.global.searchResult[indx].SC6_URL);
		}
		
		for(var i=0;i<imgUrlArr.length;i++){
			imgSliderHtml+="<div class=\"col-12 col-sm-6 col-md-4 col-xl-3 mb-4\">\n";
			imgSliderHtml+="	<a href=\""+imgUrlArr[i]+"\" class=\"d-block border-primary ui-bordered\"> \n";
			imgSliderHtml+="		<img src=\""+imgUrlArr[i]+"\" class=\"img-fluid\" alt=\"\"> \n";
			imgSliderHtml+="	</a>\n";
			imgSliderHtml+="</div>\n";
		}
		
		
		$("#product-item-images").empty();
		$("#product-item-images").append(imgSliderHtml);
		
		$('#product-item-images').on('click', 'a', function(e) {
			e.preventDefault();

			// Select only visible thumbnails
			var links = $('#product-item-images').find('a');

			window.blueimpGallery(links, {
			  container: '#product-item-lightbox',
			  carousel: true,
			  hidePageScrollbars: true,
			  disableScroll: true,
			  index: 101
			});
		  });
	}
	
}

//메뉴 - 검색
var dtcSearch={
	global:{
		place:null,
		unit:10,
		blockSize:0,
		pageNum:null,
		pageStart:0,
		pageEnd:0,
		selectData:0,
		layer:null
	},
	Google:{
		instance:function(){
			
			$("#placeSearchRsLists").css("height","calc(100vh - 140px)");
			$("#pageMoveBtn").hide();
			
			var centerCoordinates = { lat: 37.5642135 ,lng: 127.0016985 };
		
			var map = new google.maps.Map(document.getElementById('canvas') , {
		        center: centerCoordinates,
		        zoom: 14,
		    });
	
			dtcSearch.global.place = new google.maps.places.PlacesService(map);
			$("#placeSearch").off('keyup');
			$("#placeSearch").on('keyup',function(e){
				if(e.keyCode==13){
					var keyword = $(this).val();
					 if (!keyword.replace(/^\s+|\s+$/g, '')) {
							COMMON.alert('Please enter a keyword.','info',function(){
								$(this).focus();	
								return false;
							});
							return false;
					 }
			
					var request = {
				        query: keyword
				    };
					dtcSearch.Google.html = "";
					dtcSearch.global.place.textSearch(request,dtcSearch.Google.searchResult);
					LOG_TRACKER.write("51",'1',"검색:{검색어:"+keyword+"}");
				}
			});
			$("#placeSearchBtn").off('click');
			$("#placeSearchBtn").on('click',function(e){
				var keyword = $("#placeSearch").val();
				 if (!keyword.replace(/^\s+|\s+$/g, '')) {
						COMMON.alert('Please enter a keyword.','info',function(){
							$(this).focus();	
							return false;
						});
						return false;
				 }
				var request = {
					query: keyword
				};
				dtcSearch.Google.html = "";
				dtcSearch.global.place.textSearch(request,dtcSearch.Google.searchResult);
				LOG_TRACKER.write("51",'1',"검색:{검색어:"+keyword+"}");
				
			})
			
			new PerfectScrollbar(document.getElementById('placeSearchRsLists'),{
				suppressScrollX:true
			});
			
			
		},
		setSearchList:function(data){

			var html = "";
			
			var length = data.length;
			
			for(var i=0;i<length;i++){
				html+="<a href=\"javascript:dtcSearch.getCoordinatePlace('"+data[i].geometry.location.lng()+"','"+data[i].geometry.location.lat()+"','"+data[i].name+"','"+data[i].place_id+"')\" class=\"text-body list-group-item list-group-item-action listItem_"+data[i].place_id+"\">\n"
				html+="		<div class=\"d-flex align-items-center\">\n";
				html+="			<i class=\"fas fa-map-marker-alt d-block text-xlarge text-primary\"></i>\n";
				html+="			<span class=\"media-body d-block ml-3\">\n";
				html+="			<span class=\"text-big\">"+data[i].name+"</span><br>\n";
				html+="			<small class=\"text-muted\">"+data[i].formatted_address+"</small>"
				html+="			</span>\n"
				html+="		</div>\n";
				html+="</a>\n"
			}
			return html;
		},
		searchResult:function(data, status, pagination){
			
			$("#placeSearchRsLists").empty();
			
			var placeSearchRsLists = document.getElementById("placeSearchRsLists");
			
			if (status === google.maps.places.PlacesServiceStatus.OK) {
				dtcSearch.Google.html += dtcSearch.Google.setSearchList(data);
				$("#placeSearchRsLists").html(dtcSearch.Google.html);
				if(pagination && pagination.hasNextPage){
					placeSearchRsLists.addEventListener('ps-y-reach-end', function(){
						pagination.nextPage();
					}, { once : true});
				}
			} else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
				html = ""
				html+="<div class=\"list-group mt-4 mb-2\">\n";
				html+="		<div class=\"d-flex text-center\">\n";
				html+="			<span class=\"media-body text-big text-white\">No results were found for your search.</span>\n";
				html+="		</div>\n";
				html+="</div>";
				$("#placeSearchRsLists").html(html);
			} else if (status === google.maps.places.PlacesServiceStatus.ERROR) {
				html = ""
				html+="<div class=\"list-group mt-2 mb-2\">\n";
				html+="		<div class=\"d-flex text-center\">\n";
				html+="			<span class=\"media-body ml-3 text-big text-white\">An unexpected error occurred.</span>\n";
				html+="		</div>\n";
				html+="</div>";
				$("#placeSearchRsLists").html(html);
			}
			
			$(".list-group-item").removeClass("listActive");
			$(".listItem_"+dtcSearch.global.selectData).addClass("listActive");

		}
	},
	slideNext:function(){
		if(dtcSearch.global.pageNum != null){
			dtcSearch.global.pageNum.gotoPage(dtcSearch.global.pageNum.current + 1);
		} 
	},
	slidePrev:function(){
		if(dtcSearch.global.pageNum != null){
			dtcSearch.global.pageNum.gotoPage(dtcSearch.global.pageNum.current - 1);
		}
	},
	instance:function(){
		
		$("#placeSearchRsLists").css("height","calc(100vh - 185px)");
		$("#pageMoveBtn").show();
		
		dtcSearch.global.place = new kakao.maps.services.Places();
		$("#placeSearch").off('keyup');
		$("#placeSearch").on('keyup',function(e){
			
			if(e.keyCode==13){
				
				var keyword = $(this).val();
				
				 if (!keyword.replace(/^\s+|\s+$/g, '')) {
						COMMON.alert('키워드를 입력해주세요','info',function(){
							$(this).focus();	
							return false;
						});
						
						return false;
				 }
				 
				dtcSearch.global.place.keywordSearch(keyword,dtcSearch.searchResult,{size:12});
				LOG_TRACKER.write("51",'1',"검색:{검색어:"+keyword+"}");
			}
		});
		$("#placeSearchBtn").off('click');
		$("#placeSearchBtn").on('click',function(e){
		
			var keyword = $("#placeSearch").val();
			
			 if (!keyword.replace(/^\s+|\s+$/g, '')) {
					COMMON.alert('키워드를 입력해주세요','info',function(){
						$(this).focus();	
						return false;
					});
					
					return false;
			 }
			 
			dtcSearch.global.place.keywordSearch(keyword,dtcSearch.searchResult,{size:12});
			LOG_TRACKER.write("51",'1',"검색:{검색어:"+keyword+"}");
			
		})
		
		new PerfectScrollbar(document.getElementById('placeSearchRsLists'),{
			suppressScrollX:true
		});
	},
	searchResult:function(data, status, pagination){
		
		$("#placeSearchRsLists").empty();
		
		dtcSearch.global.pageStart=0;
		dtcSearch.global.pageEnd=0;
		
		var html="";
		
		var pageSize = 10;
		if (status === kakao.maps.services.Status.OK) {
			dtcSearch.setPagination(pagination);
			html = dtcSearch.setSearchList(data);
		} else if (status === kakao.maps.services.Status.ZERO_RESULT) {
			
			html+="<div class=\"list-group mt-4 mb-2\">\n";
			html+="		<div class=\"d-flex text-center\">\n";
			html+="			<span class=\"media-body text-big text-white\">검색 결과가 없습니다.</span>\n";
			html+="		</div>\n";
			html+="</div>";
			
		} else if (status === kakao.maps.services.Status.ERROR) {
			html+="<div class=\"list-group mt-2 mb-2\">\n";
			html+="		<div class=\"d-flex text-center\">\n";
			html+="			<span class=\"media-body ml-3 text-big text-white\">예상치 못한 오류가 발생했습니다.</span>\n";
			html+="		</div>\n";
			html+="</div>";
		}
		
		$("#placeSearchRsLists").html(html);

		$(".list-group-item").removeClass("listActive");
		$(".listItem_"+dtcSearch.global.selectData).addClass("listActive");
		
	},
	setSearchList:function(data){
		var html = "";
		if(dtcSearch.global.pageEnd > 0){
			dtcSearch.global.pageStart = dtcSearch.global.pageEnd + 1;
		}
		
		var length = data.length;
		dtcSearch.global.pageEnd = dtcSearch.global.pageStart + length;
		
		html+="<div class=\"list-group mt-2 mb-2 swiper-slide\">\n";
		for(var i=0;i<length;i++){
			html+="<a href=\"javascript:dtcSearch.getCoordinatePlace('"+data[i].x+"','"+data[i].y+"','"+data[i].place_name+"','"+data[i].id+"')\" class=\"text-body list-group-item list-group-item-action listItem_"+data[i].id+"\">\n"
			html+="		<div class=\"d-flex align-items-center\">\n";
			html+="			<i class=\"fas fa-map-marker-alt d-block text-xlarge text-primary\"></i>\n";
			html+="			<span class=\"media-body d-block ml-3\">\n";
			html+="			<span class=\"text-big\">"+data[i].place_name+"</span><br>\n";
			html+="			<small class=\"text-muted\">"+data[i].address_name+"</small>"
			html+="			</span>\n"
			html+="		</div>\n";
			html+="</a>\n"
		}
		html+="</div>";
		return html;
	},
	setPagination:function(pagination){
		dtcSearch.global.pageNum = pagination;

		if(pagination.hasPrevPage){
			$("#searchPrevBtn").removeClass('disabled');
		}else{
			$("#searchPrevBtn").addClass('disabled');
		}
		if(pagination.hasNextPage){
			$("#searchNextBtn").removeClass('disabled');
		}else{
			$("#searchNextBtn").addClass('disabled');
		}

		$("#rsSearchText").text(pagination.current + " / " + pagination.last);
		
	},
	getCoordinatePlace:function(x,y,place_name,i){
		dtcSearch.global.selectData = i;
		$(".list-group-item").removeClass("listActive");
		$(".listItem_"+dtcSearch.global.selectData).addClass("listActive");
		if (dtcSearch.global.layer == null) {
			var layerList = new Module.JSLayerList(true);
			dtcSearch.global.layer = layerList.createLayer("dtcSearch",	Module.ELT_3DPOINT);
		}
		if(dtcSearch.global.layer != null) dtcSearch.global.layer.removeAll();
		var imageName = null;
		imageName = "./assets/img/poi/poi_4.png";

		var poiImage = new Image();
		poiImage.src = imageName;
		poiImage.width = 27;
		poiImage.height = 27;
		
		poiImage.onload = function() {
			var canvas = document.createElement('canvas');
			var context = canvas.getContext('2d');
			canvas.width = poiImage.width;
			canvas.height = poiImage.height;
			context.drawImage(poiImage, 3, 0, poiImage.width-6, poiImage.height);
			var image = context.getImageData(0,0,canvas.width,canvas.height);

			var layerName = "interestPoint";

			Module.XDEMapRemoveLayer(layerName);
			Module.XDCreateLayer(0,layerName);
			Module.setVisibleRange(layerName,0,1000000);

			Module.getAddObject().Add3DPoint(layerName, "start", parseFloat(x),parseFloat(y),10, image.data, image.width, image.height, "");
		 
			var drawCanvas = document.createElement('canvas');
			drawCanvas.width = 50+(place_name.length*14)+25;
			drawCanvas.height = 50;
			
			var ctx = drawCanvas.getContext('2d'),
			width = drawCanvas.width,
			height = drawCanvas.height;
			ctx.clearRect(0, 0, width, height);

			var wCenter = width * 0.5,
			hCenter = height * 0.5;
			var marginBottom = 0,
			barWidth = 7,
			barHeight = 0,
			color = "rgba(38, 180, 255, 1)",
			value = place_name,
			size = 16;
			// 말풍선 형태의 Draw Path 설정
			ctx.beginPath();
			ctx.moveTo(0,(height-5)/2);
			ctx.quadraticCurveTo(0,0,(height-5)/2,0);
			ctx.lineTo(drawCanvas.width-((height-5)/2),0);
			ctx.quadraticCurveTo(drawCanvas.width,0,drawCanvas.width,(height-5)/2);
			ctx.quadraticCurveTo(drawCanvas.width,height-5,drawCanvas.width-((height-5)/2),height-5);

			ctx.lineTo((drawCanvas.width/2)+5,height-5);
			ctx.lineTo((drawCanvas.width/2),height);
			ctx.lineTo((drawCanvas.width/2)-5,height-5);
			ctx.lineTo((height-5)/2,height-5);
			ctx.quadraticCurveTo(0,height-5,0,(height-5)/2);
			
			ctx.fillStyle = color;
			ctx.fill();

			ctx.beginPath();
			ctx.arc((height-5)/2, (height-5)/2, ((height-5)/2)-5, 0, Math.PI * 2);

			ctx.fillStyle = "rgb(255, 255, 255)";
			ctx.fill();

			ctx.beginPath();
			ctx.moveTo(14.8,22.5);
			ctx.bezierCurveTo(14.8,10.4,30.5,10.4,30.5,22.5);
			ctx.lineTo(22.5,32);
			ctx.lineTo(14.5,22.5);
			//ctx.arc((height-5)/2, ((height-5)/2)-2, 8, 0, Math.PI * 2);

			ctx.fillStyle = color;
			ctx.fill();
			
			ctx.beginPath();
			ctx.arc((height-5)/2, ((height-5)/2)-2, 3, 0, Math.PI * 2);

			ctx.fillStyle = "rgb(255, 255, 255)";
			ctx.fill();

			var strText = (isNaN(value)) ? value : this.setTextComma(value.toFixed(2));

			// 텍스트 스타일 설정
			ctx.font = "bold "+size+"px sans-serif";
			ctx.fillStyle = "rgb(255, 255, 255)";

			// 텍스트 그리기
			ctx.fillText(strText, 50, height*0.56);
			
			var imageData = ctx.getImageData(0, 0, drawCanvas.width, drawCanvas.height).data;
			dtcSearch.global.layer
			
			var poi = Module.createPoint("POISearch");
			poi.setPosition(new Module.JSVector3D(parseFloat(x),parseFloat(y),10));
			poi.setImage(imageData, drawCanvas.width, drawCanvas.height);
			
			// 레이어에 오브젝트 추가
			dtcSearch.global.layer.addObject(poi, 0);
			dtcSearch.global.layer.setMaxDistance(10000);
			
			/*
			toolbar_marker.createPoint(
					"distance",
					new Module.JSVector3D(parseFloat(x),parseFloat(y),10),
					"rgba(255, 255, 255, 0.8)",
					place_name,
					true
				);*/
			
		}
		var x_1 = parseFloat(x) + 0.015;
		var x_2 = parseFloat(x) - 0.015;
		Module.getViewCamera().moveLonLatBoundary(new Module.JSVector2D(x_1, parseFloat(y)),new Module.JSVector2D(x_2,parseFloat(y)));
		
		//Module.getViewCamera().setViewAt(parseFloat(x), parseFloat(y), 5000, 45, 0);
		Module.XDRenderData();

	}
}

//메뉴 - 도움말
var dtcHelp={
	global:{
		
	},
	instance:function(){
		//alert('도움말');
	}
}

//메뉴 - 설정
var dtcSetting={
	global:{
		
	},
	instance:function(){
		dtcLayer.sampleLayerInit();
		new PerfectScrollbar(document.getElementById('accordion-layer'));

		dtcSetting.global.standard = [
			new Module.JSColor(255,8,0,255),
			new Module.JSColor(255,0,22,255),
			new Module.JSColor(255,0,53,255),
			new Module.JSColor(255,0,83,255),
			new Module.JSColor(255,0,114,255),
			new Module.JSColor(255,0,144,255),
			new Module.JSColor(255,0,175,255),
			new Module.JSColor(255,0,205,255),
			new Module.JSColor(255,0,236,255),
			new Module.JSColor(255,0,255,244),
			new Module.JSColor(255,0,255,214),
			new Module.JSColor(255,0,255,183),
			new Module.JSColor(255,0,255,153),
			new Module.JSColor(255,0,255,122),
			new Module.JSColor(255,0,255,92),
			new Module.JSColor(255,0,255,61),
			new Module.JSColor(255,0,255,31),
			new Module.JSColor(255,0,255,0),
			new Module.JSColor(255,30,255,0),
			new Module.JSColor(255,60,255,0),
			new Module.JSColor(255,91,255,0),
			new Module.JSColor(255,121,255,0),
			new Module.JSColor(255,152,255,0),
			new Module.JSColor(255,182,255,0),
			new Module.JSColor(255,213,255,0),
			new Module.JSColor(255,243,255,0),
			new Module.JSColor(255,255,237,0),
			new Module.JSColor(255,255,206,0),
			new Module.JSColor(255,255,176,0),
			new Module.JSColor(255,255,145,0),
			new Module.JSColor(255,255,115,0),
			new Module.JSColor(255,255,84,0)
		];

		dtcSetting.global.warm = [
			new Module.JSColor(255,255,102,0),
			new Module.JSColor(255,255,118,0),
			new Module.JSColor(255,255,126,0),
			new Module.JSColor(255,255,129,0),
			new Module.JSColor(255,255,127,0),
			new Module.JSColor(255,255,143,0),
			new Module.JSColor(255,255,157,0),
			new Module.JSColor(255,255,168,0),
			new Module.JSColor(255,255,181,0),
			new Module.JSColor(255,255,189,0),
			new Module.JSColor(255,255,198,0),
			new Module.JSColor(255,255,204,0),
			new Module.JSColor(255,255,210,0),
			new Module.JSColor(255,255,220,0),
			new Module.JSColor(255,255,233,0),
			new Module.JSColor(255,255,246,0),
			new Module.JSColor(255,254,252,0),
			new Module.JSColor(255,246,249,7),
			new Module.JSColor(255,232,242,17),
			new Module.JSColor(255,218,232,27),
			new Module.JSColor(255,203,223,36),
			new Module.JSColor(255,174,202,57),
			new Module.JSColor(255,155,187,70),
			new Module.JSColor(255,145,180,77),
			new Module.JSColor(255,123,162,92),
			new Module.JSColor(255,104,147,104),
			new Module.JSColor(255,78,126,123),
			new Module.JSColor(255,63,114,133),
			new Module.JSColor(255,43,97,148),
			new Module.JSColor(255,39,94,150),
			new Module.JSColor(255,29,87,157),
			new Module.JSColor(255,20,79,164)
		];

		dtcSetting.global.sea = [
			new Module.JSColor(255,7,64,61),
			new Module.JSColor(255,6,74,66),
			new Module.JSColor(255,6,85,72),
			new Module.JSColor(255,4,101,79),
			new Module.JSColor(255,2,123,89),
			new Module.JSColor(255,0,143,98),
			new Module.JSColor(255,0,156,104),
			new Module.JSColor(255,0,174,112),
			new Module.JSColor(255,0,180,115),
			new Module.JSColor(255,0,193,123),
			new Module.JSColor(255,0,205,128),
			new Module.JSColor(255,0,216,135),
			new Module.JSColor(255,0,225,140),
			new Module.JSColor(255,0,234,145),
			new Module.JSColor(255,0,239,148),
			new Module.JSColor(255,0,247,156),
			new Module.JSColor(255,0,251,159),
			new Module.JSColor(255,0,254,163),
			new Module.JSColor(255,3,254,170),
			new Module.JSColor(255,7,254,177),
			new Module.JSColor(255,20,255,194),
			new Module.JSColor(255,22,255,198),
			new Module.JSColor(255,31,253,208),
			new Module.JSColor(255,38,247,217),
			new Module.JSColor(255,43,243,222),
			new Module.JSColor(255,49,239,228),
			new Module.JSColor(255,52,236,232),
			new Module.JSColor(255,56,232,236),
			new Module.JSColor(255,67,223,247),
			new Module.JSColor(255,67,223,248),
			new Module.JSColor(255,68,222,248),
			new Module.JSColor(255,73,218,255)
		];

		dtcSetting.global.plant = [
			new Module.JSColor(255,0,193,190),
			new Module.JSColor(255,0,184,166),
			new Module.JSColor(255,0,178,149),
			new Module.JSColor(255,0,168,120),
			new Module.JSColor(255,0,162,106),
			new Module.JSColor(255,0,156,94),
			new Module.JSColor(255,0,152,85),
			new Module.JSColor(255,0,148,80),
			new Module.JSColor(255,1,144,75),
			new Module.JSColor(255,3,139,70),
			new Module.JSColor(255,7,134,68),
			new Module.JSColor(255,16,124,68),
			new Module.JSColor(255,28,112,75),
			new Module.JSColor(255,36,104,81),
			new Module.JSColor(255,44,98,87),
			new Module.JSColor(255,55,88,96),
			new Module.JSColor(255,64,82,102),
			new Module.JSColor(255,73,74,110),
			new Module.JSColor(255,85,65,119),
			new Module.JSColor(255,99,54,127),
			new Module.JSColor(255,116,43,131),
			new Module.JSColor(255,125,37,129),
			new Module.JSColor(255,128,34,127),
			new Module.JSColor(255,137,29,119),
			new Module.JSColor(255,145,26,112),
			new Module.JSColor(255,149,25,106),
			new Module.JSColor(255,156,22,95),
			new Module.JSColor(255,165,19,78),
			new Module.JSColor(255,169,18,71),
			new Module.JSColor(255,170,17,70),
			new Module.JSColor(255,179,15,50),
			new Module.JSColor(255,186,13,37)
		];

		dtcSetting.global.sky = [
			new Module.JSColor(255,73,218,255),
			new Module.JSColor(255,68,222,248),
			new Module.JSColor(255,67,223,248),
			new Module.JSColor(255,67,223,247),
			new Module.JSColor(255,56,232,236),
			new Module.JSColor(255,52,236,232),
			new Module.JSColor(255,49,239,228),
			new Module.JSColor(255,43,243,222),
			new Module.JSColor(255,38,247,217),
			new Module.JSColor(255,31,253,208),
			new Module.JSColor(255,22,255,198),
			new Module.JSColor(255,20,255,194),
			new Module.JSColor(255,7,254,177),
			new Module.JSColor(255,3,254,170),
			new Module.JSColor(255,0,254,163),
			new Module.JSColor(255,0,251,159),
			new Module.JSColor(255,0,247,156),
			new Module.JSColor(255,0,239,148),
			new Module.JSColor(255,0,234,145),
			new Module.JSColor(255,0,225,140),
			new Module.JSColor(255,0,216,135),
			new Module.JSColor(255,0,205,128),
			new Module.JSColor(255,0,193,123),
			new Module.JSColor(255,0,180,115),
			new Module.JSColor(255,0,174,112),
			new Module.JSColor(255,0,156,104),
			new Module.JSColor(255,0,143,98),
			new Module.JSColor(255,2,123,89),
			new Module.JSColor(255,4,101,79),
			new Module.JSColor(255,6,85,72),
			new Module.JSColor(255,6,74,66),
			new Module.JSColor(255,7,64,61)
		];
	},
	setTerrainEffect:function(e) {
		var map = Module.getMap();
		map.setLighting(false);

		switch(e) {
			case 0:
				// 일반
				Module.getMap().setTerrainEffect(0);
			break;

			case 11:
				// 경사향
				Module.getMap().setTerrainEffect(11);
			break;

			case 10:
				// 경사도
				Module.getMap().setTerrainEffect(10);
			break;
		}

		if(e == 3 || e == 4 || e == 5 || e == 6 || e == 7) {
			map.setTerrainEffect(1);
			map.setLighting(true);

			var min = parseFloat(document.getElementById("alterRangeMin").value);
			var max = parseFloat(document.getElementById("alterRangeMax").value);
	
			if (max < min) {
				var temp = min;
				min = max;
				max = temp;
				document.getElementById("alterRangeMin").value = min;
				document.getElementById("alterRangeMax").value = max;
			}

			var theme = ["", "", "", "standard", "warm", "sea", "plant", "sky"];


			Module.getTerrain().setTerrainColor({
				altitudemin : min,
				altitudemax : max,
				colorlist : dtcSetting.global[theme[e]]
			});
			
			Module.XDRenderData();
		}
	},
	legend :{
		LID: null,
		init:function(){
			$("input[name='setRegend']:radio").change(function(e) {
				if(JSON.parse(e.target.value)){
					document.getElementById('legendInfo').style.display = "block";
					dtcSetting.legend.LID = $("#legendInfo").attr("index");
					$("#sbLgImgView").css("bottom", $("#legendInfo").innerHeight() + 10 +"px");
				}
				else{
					document.getElementById('legendInfo').style.display = "none";
					dtcSetting.legend.LID = null;
					$("#sbLgImgView").css("bottom", "10px");
				}
			});
			$("#addLegendPopup").on('shown.bs.modal', function(){
				$(".modal-backdrop").hide();
			})
		},
		addLegendPopup:function(){
			
			dtcSetting.legend.cancelEditLegendInfo();
			$("#legendName").val("");	
			$("#legendName").attr("placeholder", "범례명을 입력하세요.");
			$(":radio[name='legendLocation'][value='left_top']").prop('checked', true);
			$("#itemName").val("");
			$("#legendList").empty();
				
			$('#addLegendPopup .modal-title').html('<span class="fas fa-tag"> </span> 범례 등록');
			var element = document.getElementById('saveLegendBtn');
			element.innerHTML = "등록";
			element.setAttribute("onClick", "javascript:dtcSetting.legend.saveLegend()");
			$("#addLegendPopup").modal();
		
		},
		addLegend:function(){
			if($("#itemName").val() == ""){
				COMMON.alert("항목명을 입력하세요.","error",function(){$("#itemName").focus();});
				return false;
			}
			var html ="";
			var a = document.getElementsByClassName('index');
			var	index = a.length + 1;
			
			html += '<tr class="trLegendList">'
			html += '<td  width="8%" class="align-middle index" style="cursor: n-resize;">'+index+'</td>'
			html += '<td  width="32%" class="align-middle item" style="cursor: n-resize;">'+$("#itemName").val()+'</td>'
			if($("#itemType").val() == "line") {
				html += '<td  width="15%" class="align-middle type" style="cursor: n-resize;">'+'선'+'</td>'
			}else if($("#itemType").val() == "plane") {
				html += '<td  width="15%" class="align-middle type" style="cursor: n-resize;">'+'면'+'</td>'
			}else{
				html += '<td  width="15%" class="align-middle type" style="cursor: n-resize;">'+'점'+'</td>'
			}
			html += '<td  width="15%" class="align-middle" style="cursor: n-resize;"><div class="color" style="background-color:'+$("#itemColor").val()+';width: 80px;height: 20px; margin: 0 auto; border: 1px white solid;"></div></td>'
			html += '<td  width="15%" class="align-middle nosortable"><button class="btn btn-outline-warning btn-sm ladda-button editBtn" data-style="slide-left" data-size="s" onclick="javascript:dtcSetting.legend.editLegendItem('+(index-1)+');"><span class="fas fa-edit"></span>&nbsp;&nbsp;수정</button></td>'
			html += '<td  width="15%" class="align-middle nosortable"><button class="btn btn-outline-danger btn-sm ladda-button delBtn" data-style="slide-left" data-size="s" onclick="javascript:dtcSetting.legend.deleteLegend('+(index-1)+');"><span class="fas fa-trash"></span>&nbsp;&nbsp;삭제</button></td>'
			html += '</tr>'
			
			$("#legendList").append(html);
			$("#itemName").val("");
			
		},
		deleteLegend:function(index){
			var dom = document.getElementsByClassName('trLegendList')[index];
			dom.remove();
			
			dtcSetting.legend.updateLegend();
			
			dtcSetting.legend.cancelEditLegendInfo();
			
		},
		updateLegend:function(){
			dtcSetting.legend.cancelEditLegendInfo();
			$("#legendList tr").each(function(i) {
				$(this).attr("value",i + 1);
				var a = document.getElementsByClassName('index')[i];
				a.innerText = (i+1);
				
				var delBtn = document.getElementsByClassName('delBtn')[i];
				delBtn.setAttribute("onclick","javascript:dtcSetting.legend.deleteLegend("+i+");");
				
				var editBtn = document.getElementsByClassName('editBtn')[i];
				editBtn.setAttribute("onclick","javascript:dtcSetting.legend.editLegendItem("+i+");");
			 });
		},
		saveLegend:function(){
			if($("#legendName").val() == ""){
				COMMON.alert("범례명을 입력하세요.","error",function(){$("#legendName").focus();});
				return false;
			}
			if($("#legendList").children().length == 0){
				COMMON.alert("범례 항목을 추가해주세요.","error",function(){});
				return false;
			}
			
			var content = [];
			
			$('#legendList > tr').each(function(index, tr) { 

				var tr = $(this);
				var td = tr.children();
				var item = td.eq(1).text();
				var type;
				if(td.eq(2).text() == "점"){
					type = "dot";
				} else if(td.eq(2).text() == "선"){
					type = "line";
				} else {
					type = "plane";
				}
				var color = td.eq(3).children(".color").css( "background-color" );;

				var data = {"index": index , "item":item, "type":type, "color": color};
				content.push(data);
			});
			
			var formData = new FormData();
			formData.append('name',$("#legendName").val());
			formData.append('location',document.querySelector('input[name="legendLocation"]:checked').value);
			formData.append('content',JSON.stringify(content));
	
			$.ajax({
				url:'/ide/saveLegend.do',
				type:'POST',
				data:formData,
				dataType:'json',
				processData: false,
				contentType: false,
				anysc:false,
				enctype: 'multipart/form-data',
				success:function(result){
					COMMON.alert("범례가 등록 되었습니다.","success",function(){});
					$("#addLegendPopup").modal('hide');
					var lid = result.legendVO.lid;
					dtcSetting.legend.loadLegendInfo(lid);
					
				}
			});
			
		},
		loadLegendInfo:function(lid){
			
			var data = {"lid" : lid}
			
			$.ajax({
				url:'/layer/loadLegendInfo.do',
				type:'POST',
				data:data,
				dataType:'json',
				success:function(result){
					$("#legendListPopup").modal('hide');
					var html = ""
					var content = result.legendVO.content;
					var legendList = JSON.parse(content);
					for(var i=0; i<legendList.length; i++){
						html += "<div class=\"row pl-2 pr-2\">"
						if(legendList[i].type == "line"){
							html += "<div style='width:10px; height:2px; margin-top: 9px; background-color:"+legendList[i].color+"'></div>&nbsp&nbsp"
						} else if(legendList[i].type == "plane"){
							html += "<div style='width:10px; height:10px; margin-top: 5px; background-color:"+legendList[i].color+"'></div>&nbsp&nbsp"
						} else {
							html += "<div style='width:10px; height:10px; border-radius: 50%; margin-top: 5px; background-color:"+legendList[i].color+"'></div>&nbsp&nbsp"	
						}
						html += 	"<label for='colorIndex_"+i+"' style='font-size: 13px;'>"+legendList[i].item+"</label>"
						html += "</div>"
					}
					if($("settingAre").css("display") == "none"){
						
					}
					
					var legendDiv = document.getElementById('legendInfo');
					legendDiv.innerHTML = html;
					var width= $("#legendInfo").css("width");
					var height= $("#legendInfo").css("height");
					
					if(result.legendVO.location == 'right_top'){
						legendDiv.style.left = "calc(100% - "+width+" - 10px)";
						legendDiv.style.top = "110px";
						legendDiv.setAttribute("value", "right");
					} else if(result.legendVO.location == 'right_bot') {
						legendDiv.style.left = "calc(100% - "+width+" - 10px)";
						legendDiv.style.top = "calc(100% - "+height+" - 10px)";
						legendDiv.setAttribute("value", "right");
					} else if(result.legendVO.location == 'left_top') {
						if($("#settingAre").css("display") == "none"){
							legendDiv.style.left = "80px";
						} else {
							legendDiv.style.left = "520px";
						}
						legendDiv.style.top = "10px";
						legendDiv.setAttribute("value", "left");
					} else if(result.legendVO.location == 'left_bot') {
						if($("#settingAre").css("display") == "none"){
							legendDiv.style.left = "80px";
						} else {
							legendDiv.style.left = "520px";
						}
						$("#sbLgImgView").css("bottom",parseFloat(height) + 10 + "px");
						legendDiv.style.top = "calc(100% - "+height+" - 10px)";
						legendDiv.setAttribute("value", "left");
					}
					
					
					document.getElementById('legendInfo').style.display = "block";
					
					if(document.getElementById('editLegendBtn') != null){
						document.getElementById('editLegendBtn').style.display = "inline";
						document.getElementById('editLegendBtn').setAttribute("onClick", "javascript:dtcSetting.legend.editLegend("+lid+")");
					}
					if(document.getElementById('addLegendBtn') != null)
						document.getElementById('addLegendBtn').style.display = "none";
					
					if($("input[id='onLegendRadio']:radio").prop('disabled')){
						$("input[id='onLegendRadio']:radio").removeAttr("disabled");
					}
					
					$("input[id='offLegendRadio']:radio").prop("checked", "false");
					$("input[id='onLegendRadio']:radio").prop("checked", "true");
					
					legendDiv.setAttribute("index", lid);
					dtcSetting.legend.LID = lid;
				}
			})
			
			if(IDE.mapid != ''){
				var data = {"mapid": IDE.mapid, "lid" : lid}
				
				$.ajax({
					url:'/ide/updateLegend.do',
					type:'POST',
					data:data,
					dataType:'json',
					success:function(result){
						
					}
				})
				
			}
		},
		loadLegendList:function(){
			
			$.ajax({
				url:'/ide/loadLegendList.do',
				type:'POST',
				dataType:'json',
				processData: false,
				contentType: false,
				anysc:false,
				enctype: 'multipart/form-data',
				success:function(result){
					
					var legendList = result.legendList;
					var html = ""
					for(var i=0; i<legendList.length; i++){
						html += '<tr>'
						html += '<td  width="44%" class="align-middle">'+legendList[i].name+'</td>'
						html += '<td  width="20%" class="align-middle">'+legendList[i].reg_date+'</td>'
						html += '<td  width="12%" class="align-middle"><button class="btn btn-outline-success btn-sm ladda-button" data-style="slide-left" data-size="s" onclick="javascript:dtcSetting.legend.loadLegendInfoPopup('+legendList[i].lid+')"><span class="lnr lnr-file-add"></span>&nbsp;&nbsp;선택</button></td>'
						html += '<td  width="12%" class="align-middle"><button class="btn btn-outline-primary btn-sm ladda-button" data-style="slide-left" data-size="s" onclick="javascript:dtcSetting.legend.changeLegendNamePopup('+legendList[i].lid+')"><span class="lnr lnr-file-empty"></span>&nbsp;&nbsp;변경</button></td>'
						html += '<td  width="12%" class="align-middle"><button class="btn btn-outline-danger btn-sm ladda-button" data-style="slide-left" data-size="s" onclick="javascript:dtcSetting.legend.deleteLegendInfo('+legendList[i].lid+')"><span class="llnr lnr-trash"></span>&nbsp;&nbsp;삭제</button></td>'
						html += '</tr>'
					}
					
					if(legendList.length == 0){
						html = '<span>저장된 범례가 없습니다.</span>';
					}
					
					document.getElementById('myLegendList').innerHTML = html;
					
					
				}
			});
			$("#legendListPopup").modal();

		},
		deleteLegendInfo:function(lid){
			
			var data = {"lid" : lid}
			
			$.ajax({
				url:'/ide/deleteLegendInfo.do',
				type:'POST',
				data:data,
				dataType:'json',
				success:function(result){
					
					var map_name = "";
					for(var i=0; i<result.list.length; i++){
						map_name += result.list[i].map_name;
						if(i != (result.list.length-1)){
							map_name += ","
						}
					}
					if(result.exist != 0){
						COMMON.alert('<span style=\'font-size:23px;line-height: normal;\'>지도에서 사용중인 범례 입니다.\n지도 삭제 후 범례를 삭제 해주세요.<br>사용중인 지도 : '+map_name+'</span>','warning',function(){
							return false;
						})
						return false;
					}else{
						COMMON.alert('범례가 삭제 되었습니다.','success',function(){
							if(lid == $("#legendInfo").attr("index")){
								dtcSetting.legend.offLegend();
							}
							dtcSetting.legend.loadLegendList();
							return false;
						})
						return false;
					}
					
				}
				
			})
		},
		offLegend:function(){
			
			document.getElementById('legendInfo').style.display = "none";
			
			document.getElementById('addLegendBtn').style.display = "inline";
			document.getElementById('editLegendBtn').style.display = "none";
			
			
			$("input[id='onLegendRadio']:radio").prop("checked", "false");
			$("input[id='offLegendRadio']:radio").prop("checked", "true");
			$("input[id='onLegendRadio']:radio").prop("disabled", "true");
			
			dtcSetting.legend.LID = null;
		},
		loadLegendInfoPopup:function(lid){
			
			dtcSetting.legend.cancelEditLegendInfo();
			var data = {"lid" : lid}
			
			$.ajax({
				url:'/layer/loadLegendInfo.do',
				type:'POST',
				data:data,
				dataType:'json',
				success:function(result){
					$("#legendListPopup").modal('hide');
					var html = ""
					var content = result.legendVO.content;
					var legendList = JSON.parse(content);
					
					$("#legendName").val(result.legendVO.name);
					$("#legendName").attr("placeholder", result.legendVO.name);
					$(":radio[name='legendLocation'][value='" + result.legendVO.location + "']").attr('checked', true);
					$("#itemName").val("");

					for(var i=0; i<legendList.length; i++){
						html += '<tr class="trLegendList">'
						html += '<td  width="8%" class="align-middle index" style="cursor: n-resize;">'+(legendList[i].index+1)+'</td>'
						html += '<td  width="32%" class="align-middle item" style="cursor: n-resize;">'+legendList[i].item+'</td>'
						if(legendList[i].type == "line") {
							html += '<td  width="15%" class="align-middle type" style="cursor: n-resize;">'+'선'+'</td>'
						}else if(legendList[i].type == "plane") {
							html += '<td  width="15%" class="align-middle type" style="cursor: n-resize;">'+'면'+'</td>'
						}else{
							html += '<td  width="15%" class="align-middle type" style="cursor: n-resize;">'+'점'+'</td>'
						}
						html += '<td  width="15%" class="align-middle" style="cursor: n-resize;"><div class="color" style="background-color:'+legendList[i].color+';width: 80px;height: 20px; margin: 0 auto; border: 1px white solid;"></div></td>'
						html += '<td  width="15%" class="align-middle nosortable"><button class="btn btn-outline-warning btn-sm ladda-button editBtn" data-style="slide-left" data-size="s" onclick="javascript:dtcSetting.legend.editLegendItem('+legendList[i].index+');"><span class="fas fa-edit"></span>&nbsp;&nbsp;수정</button></td>'
						html += '<td  width="15%" class="align-middle nosortable"><button class="btn btn-outline-danger btn-sm ladda-button delBtn" data-style="slide-left" data-size="s" onclick="javascript:dtcSetting.legend.deleteLegend('+legendList[i].index+');"><span class="fas fa-trash"></span>&nbsp;&nbsp;삭제</button></td>'
						html += '</tr>'
					}
					
					$("#legendList").html(html);
				}
			})
			
			$('#addLegendPopup .modal-title').html('<span class="fas fa-tag"> </span> 범례 등록');
			var element = document.getElementById('saveLegendBtn');
			element.innerHTML = "등록";
			element.setAttribute("onClick", "javascript:dtcSetting.legend.saveLegend()");
			$("#addLegendPopup").modal();
		},
		editLegend:function(lid){
			dtcSetting.legend.cancelEditLegendInfo();
			var data = {"lid" : lid}
			
			$.ajax({
				url:'/layer/loadLegendInfo.do',
				type:'POST',
				data:data,
				dataType:'json',
				success:function(result){
					$("#legendListPopup").modal('hide');
					var html = ""
					var content = result.legendVO.content;
					var legendList = JSON.parse(content);
					
					$("#legendName").val(result.legendVO.name);
					$("#legendName").attr("placeholder", result.legendVO.name);
					$(":radio[name='legendLocation'][value='" + result.legendVO.location + "']").attr('checked', true);
					$("#itemName").val("");

					for(var i=0; i<legendList.length; i++){
						html += '<tr class="trLegendList">'
						html += '<td  width="8%" class="align-middle index" style="cursor: n-resize;">'+(legendList[i].index+1)+'</td>'
						html += '<td  width="32%" class="align-middle item" style="cursor: n-resize;">'+legendList[i].item+'</td>'
						if(legendList[i].type == "line") {
							html += '<td  width="15%" class="align-middle type" style="cursor: n-resize;">'+'선'+'</td>'
						}else if(legendList[i].type == "plane") {
							html += '<td  width="15%" class="align-middle type" style="cursor: n-resize;">'+'면'+'</td>'
						}else{
							html += '<td  width="15%" class="align-middle type" style="cursor: n-resize;">'+'점'+'</td>'
						}
						html += '<td  width="15%" class="align-middle" style="cursor: n-resize;"><div class="color" style="background-color:'+legendList[i].color+';width: 80px;height: 20px; margin: 0 auto; border: 1px white solid;"></div></td>'
						html += '<td  width="15%" class="align-middle nosortable"><button class="btn btn-outline-warning btn-sm ladda-button editBtn" data-style="slide-left" data-size="s" onclick="javascript:dtcSetting.legend.editLegendItem('+legendList[i].index+');"><span class="fas fa-edit"></span>&nbsp;&nbsp;수정</button></td>'
						html += '<td  width="15%" class="align-middle nosortable"><button class="btn btn-outline-danger btn-sm ladda-button delBtn" data-style="slide-left" data-size="s" onclick="javascript:dtcSetting.legend.deleteLegend('+legendList[i].index+');"><span class="fas fa-trash"></span>&nbsp;&nbsp;삭제</button></td>'
						html += '</tr>'
					}
					
					$("#legendList").html(html);
				}
			})
			
			$('#addLegendPopup .modal-title').html('<span class="fas fa-tag"> </span> 범례 수정');
			var element = document.getElementById('saveLegendBtn');
			element.innerHTML = "수정";
			element.setAttribute("onClick", "javascript:dtcSetting.legend.updateLegendInfo("+lid+")");
			$("#addLegendPopup").modal();
		},
		updateLegendInfo:function(lid){
			
			if($("#legendName").val() == ""){
				COMMON.alert("범례명을 입력하세요.","error",function(){$("#legendName").focus();});
				return false;
			}
			if($("#legendList").children().length == 0){
				COMMON.alert("범례 항목을 추가해주세요.","error",function(){});
				return false;
			}
			
			var content = [];
			
			$('#legendList > tr').each(function(index, tr) { 

				var tr = $(this);
				var td = tr.children();
				var item = td.eq(1).text();
				var type;
				if(td.eq(2).text() == "점"){
					type = "dot";
				} else if(td.eq(2).text() == "선"){
					type = "line";
				} else {
					type = "plane";
				}
				var color = td.eq(3).children(".color").css( "background-color" );;

				var data = {"index": index , "item":item, "type":type, "color": color};
				content.push(data);
			});
			
			var formData = new FormData();
			formData.append('lid', lid);
			formData.append('name', $("#legendName").val());
			formData.append('location', document.querySelector('input[name="legendLocation"]:checked').value);
			formData.append('content', JSON.stringify(content));
	
			$.ajax({
				url:'/ide/changeLegendInfo.do',
				type:'POST',
				data:formData,
				dataType:'json',
				processData: false,
				contentType: false,
				anysc:false,
				enctype: 'multipart/form-data',
				success:function(result){
					COMMON.alert("범례가 수정 되었습니다.","success",function(){});
					$("#addLegendPopup").modal('hide');
					dtcSetting.legend.loadLegendInfo(lid);
				
					
				}
			});
		},
		changeLegendNamePopup:function(lid){
			
			var data = {"lid" : lid}
			
			$.ajax({
				url:'/layer/loadLegendInfo.do',
				type:'POST',
				data:data,
				dataType:'json',
				success:function(result){
					$("#legendListPopup").modal('hide');
					$("#changeLegendName").val(result.legendVO.name);
					$("#changeLegendName").attr("placeholder", result.legendVO.name);
					$("#legendNameChangePopup").modal();
					
					$("button[id='changeLegendBtn']").on("click", function () {
  						dtcSetting.legend.changeLegendInfo(lid);
					});

					
				}
			})
		},
		changeLegendInfo:function(lid){
			if($("#changeLegendName").val() == ""){
				COMMON.alert("범례명을 입력하세요.","error",function(){$("#changeLegendName").focus();});
				return false;
			}
			
			var formData = new FormData();
			formData.append('lid', lid);
			formData.append('name',$("#changeLegendName").val());
			formData.append('location','noData');
			formData.append('content','noData');
	
			$.ajax({
				url:'/ide/changeLegendInfo.do',
				type:'POST',
				data:formData,
				dataType:'json',
				processData: false,
				contentType: false,
				anysc:false,
				enctype: 'multipart/form-data',
				success:function(result){
					COMMON.alert("범례정보가 수정 되었습니다.","success",function(){});
					$("#legendNameChangePopup").modal('hide');
					dtcSetting.legend.loadLegendList();
				}
			});
			$("#changeLegendBtn").attr('onclick', '').unbind('click');
		},
		rgbToHex:function(rgbType){ 
		    /* 
		    ** 컬러값과 쉼표만 남기고 삭제하기. 
		    ** 쉼표(,)를 기준으로 분리해서, 배열에 담기. 
		    */ 
		    var rgb = rgbType.replace( /[^%,.\d]/g, "" ).split( "," ); 
		    
		    rgb.forEach(function (str, x, arr){ 
		    
		        /* 컬러값이 "%"일 경우, 변환하기. */ 
		        if ( str.indexOf( "%" ) > -1 ) str = Math.round( parseFloat(str) * 2.55 ); 
		        
		        /* 16진수 문자로 변환하기. */ 
		        str = parseInt( str, 10 ).toString( 16 ); 
		        if ( str.length === 1 ) str = "0" + str; 
		        
		        arr[ x ] = str; 
		    }); 
		    
		    return "#" + rgb.join( "" ); 
		},
		editLegendItem:function(index){
			var dom = document.getElementsByClassName('trLegendList')[index];
			$("#itemName").val(dom.querySelector(".item").innerHTML);
			if(dom.querySelector(".type").innerHTML == "점"){
				$('#itemType').val('dot').trigger('change');
			} else if(dom.querySelector(".type").innerHTML == "선"){
				$('#itemType').val('line').trigger('change');
			} else {
				$('#itemType').val('plane').trigger('change');
			}
			$("#itemColor").val(dtcSetting.legend.rgbToHex(dom.querySelector(".color").style.backgroundColor));
			$("#editLegendItemBtn").css('display', 'inline');
			$("#editLegendCancelBtn").css('display', 'inline');
			$("#addLegendItemBtn").css('display', 'none');
			
			
			var element = document.getElementById('editLegendItemBtn');
			element.setAttribute("onClick", "javascript:dtcSetting.legend.updateLegendItem("+index+")");
					
		},
		cancelEditLegendInfo:function(){
			$("#itemName").val("");
			$('#itemType').val('dot').trigger('change');
			$("#itemColor").val("#000000");
			$("#editLegendItemBtn").css('display', 'none');
			$("#editLegendCancelBtn").css('display', 'none');
			$("#addLegendItemBtn").css('display', 'inline');
		},
		updateLegendItem:function(index){
			
			if($("#itemName").val() == ""){
				COMMON.alert("항목명을 입력하세요.","error",function(){$("#itemName").focus();});
				return false;
			}
			
			var dom = document.getElementsByClassName('trLegendList')[index];
			dom.querySelector(".item").innerHTML = $("#itemName").val();
			if($("select[id='itemType']").val() == "dot"){
				dom.querySelector(".type").innerHTML = "점"
			} else if($("select[id='itemType']").val() == "line"){
				dom.querySelector(".type").innerHTML = "선"
			} else {
				dom.querySelector(".type").innerHTML = "면"
			}
			dom.querySelector(".color").style.backgroundColor = $("#itemColor").val();
			
			dtcSetting.legend.cancelEditLegendInfo();
		
		}
		
		
	}
}

var dtcSaveMap = {
	lgid:null,
	appList:[],
	appName:[],
	global:{
		// 지도 불러오기시 레이어별 위치이동 제어를 위한 flag
		isLoadMap:true
	},
	instance:function() {
		$("#ideSaveMapTitle").val($.i18n.t('Index.nav.map.save_plaeceholder')+IDE.lastMapCount);
		
		var appList = [];
		dtcSaveMap.appList = [];
		for(var i = 0;i < IDE.MODULE.execs.length;i++){
			appList.push($("#navs-analy-"+IDE.MODULE.execs[i]+"-link").text());
			dtcSaveMap.appList.push({num:IDE.MODULE.execs[i], value:$("#navs-analy-"+IDE.MODULE.execs[i]+"-link").text()});
		}
		
		var input = document.querySelector('input[name=saveMapApp]');
		
		var tagify = new Tagify(input, {	
			enforceWhitelist: true,
	        whitelist           : appList,
			dropdown: {        
			    classname: "tags-look", 					// 드롭다운 메뉴 엘리먼트 클래스 이름. 이걸로 css 선택자로 쓰면 된다.
			    enabled: 0,             					// 단어 몇글자 입력했을떄 추천 드롭다운 메뉴가 나타날지
			    closeOnSelect: false    					// 드롭다운 메뉴에서 태그 선택하면 자동으로 꺼지는지 안꺼지는지
  			},
			userInput: false,
	        templates: {
	            dropdownItemNoMatch: function(data) {
	                return `<div class='${this.settings.classNames.dropdownItem}' value="noMatch" tabindex="0" role="option">
	                    No suggestion found for: <strong>${data.value}</strong>
	                </div>`
	            }
	        }
		})
		
		tagify.on('change', function(e){
			let obj = JSON.parse(e.detail.value);
			let tempArr = [];
			for(var i=0;i<obj.length;i++){
				tempArr.push(obj[i].value);
			}
			if(tempArr.length>0){
				dtcSaveMap.appName = tempArr;
			}
			
		} )
			
		tagify.whitelist = appList;
		
		new PerfectScrollbar(document.querySelector('tags'));
		
		dtcSaveMap.loadMyMap();
		
	},
	loadMyMap:function(){

		$.ajax({
			url:'/desk/maps/mapList.do',
			type:'POST',
			dataType:'json',
			success:function(result){
				console.log(result.mapList);

				var data={};
				var html = '';
				
				if(result.mapList.length != 0){

					
					
					for(var i=0; i<result.mapList.length;i++){
						html += '<div class="card mb-0 pt-3" style="">';
						//html += '	<div class="card-body d-flex justify-content-between align-items-start pb-1 pt-3">';
						//html += '		<span class="custom-control-label text-body ts-11 font-weight-semibold">산지관리/보존보전산지</span>';
						//html += '	</div>';
						html += '	<div class="card-body pb-1 pt-0">';
						html += '		<div class="media pl-0">';
						html += '			<img src="'+result.mapList[i].thumb_url+'" alt="이미지" class="d-block ui-w-120 mt-1" style="height:9vh;cursor: pointer;" onclick="MAPS.selectMap(\''+result.mapList[i].encodedMapid+'\')">';
						html += '			<div class="media-body ml-2 col-md-10 mt-1 pt-1">';
						html += '				<div class="text-white mb-0 ts-10 pb-2">';
						html += '					<span class="d-block mb-1 pb-1"><i class="vacancy-tooltip fa fa-globe"></i> '+result.mapList[i].map_name+'</span>';
						html += '					<span class="d-block mb-1 pb-1"><i class="vacancy-tooltip fa fa-calendar"></i> '+result.mapList[i].reg_date+'</span>';
						html += '				</div>';
						html += '			</div>';
						html += '			<div class="btn-group project-actions">';
						html += '				<button type="button" class="btn btn-default btn-xs rounded-pill icon-btn md-btn-flat hide-arrow dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i class="ion ion-ios-more"></i></button>';
						html += '				<div class="dropdown-menu dropdown-menu-right ts-9">';
						html += '					<a class="dropdown-item" href="javascript:MAPS.selectMap(\''+result.mapList[i].encodedMapid+'\');"><span class="fas fa-info-circle"></span> '+$.i18n.t('Index.nav.map.map_list.options.show')+'</a>';
						html += '					<a class="dropdown-item" href="javascript:MAPS.deleteMap(\''+result.mapList[i].encodedMapid+'\');"><span class="fas fa-clipboard-list"></span> '+$.i18n.t('Index.nav.map.map_list.options.del')+'</a>';
						html += '				</div>';
						html += '			</div>';
						html += '		</div>';
						html += '	</div>';
						html += '<hr class="m-0">';
						html += '</div>';
					}
				} else {
					html += '<div style="color:white;">'+$.i18n.t('Index.nav.map.no_map')+'</div>';
				}
				$("#myMapList").html(html);
				/*
				if(result.STATUS==200){
					data.default='N';
					data.user = result.DATA;
				}else{
					data.default='Y';
				}
				
				if(dtcLg.tree == null){
					dtcLg.callGroupLayer(data);
				}
				*/
				new PerfectScrollbar(document.getElementById('myMapList'),{
					suppressScrollX:true
	   			});
				
			}
		})
	},
	saveCurrentLayerGroup:function(updateFlag){
		
	
		var jsonArr = $("#layerGroupTree").jstree().get_json('#',{flat:true});
		var jsTreeJson = [];
		
		for(var i=0;i<jsonArr.length;i++){
			
			var obj = jsonArr[i];
			
			if(obj.id != 'root-layer'){
				obj.state.checked=false;
				obj.state.selected=false;
			}

			jsTreeJson.push(obj);

		}

		if(jsTreeJson.length > 1){
			
			var binary =new Blob([JSON.stringify(jsTreeJson, null, 2)], {
				type: "application/json"
			})
	
			var mid = D_MEMBER.MID;
			var time = new Date().getTime();
			var jsonFile = new File([binary],'layer_tree_'+mid+'_'+time+'.json',{type:'text/json;charset=utf-8'});
			
			var formData = new FormData();
			formData.append('NAME',$("#ideSaveMapTitle").val()+"_레이어그룹");
			formData.append('MID',mid);
			formData.append('FILE',jsonFile);
	
			$.ajax({
				url:'/ide/saveLayerTree.do',
				type:'POST',
				data:formData,
				dataType:'json',
				processData: false,
				contentType: false,
				anysc:false,
				enctype: 'multipart/form-data',
				success:function(result){
					var lgid = result.LGID;
					dtcSaveMap.saveMapInfo(updateFlag, lgid);
					
					
				}
			})
		}else {
			dtcSaveMap.saveMapInfo(updateFlag, 0);
		}

	},
	saveMap:function() {
		//console.log("saveMap");
		var updateFlag = false;
		if($("#ideSaveMapTitle").val() == "") {
			alert('저장할 지도 제목을 입력하세요.');
			$("#ideSaveMapTitle").focus();
			return false;
		}
		
		if(IDE.mapid == "") {
			IDE.mapid = 0;
			//dtcSaveMap.saveMapInfo(updateFlag);
			dtcSaveMap.saveCurrentLayerGroup(updateFlag);
		}else{
			COMMON.confirm("새 지도로 저장하시겠습니까?","[Cancel]을 누를 경우 불러온 지도가 수정됩니다.","info",function(){
				IDE.mapid = 0;
				//dtcSaveMap.saveMapInfo(updateFlag);
				dtcSaveMap.saveCurrentLayerGroup(updateFlag);
        	},function(){
				updateFlag = true;
				//dtcSaveMap.saveMapInfo(updateFlag);
				dtcSaveMap.saveCurrentLayerGroup(updateFlag);
        	});
		}


	
	},
	saveMapInfo:function(updateFlag, lgid) {
		
		var layerList = "none";

		if(dtcLayer.global.layerOnList.length != 0) {
			layerList = dtcLayer.global.layerOnList;
		}

		var mapCanvas = document.getElementById("canvas");
		//var canvas = document.createElement("canvas");
		
		//var imageData = mapCanvas.toDataURL("image/jpeg");

		//imageData = imageData.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
		
		var imgDataUrl = mapCanvas.toDataURL('image/png');
		
		var blobBin = atob(imgDataUrl.split(',')[1]);
			var array=[];
			
		for (var i = 0; i < blobBin.length; i++) {
			array.push(blobBin.charCodeAt(i));
		}
		
		var file = new Blob([new Uint8Array(array)], {type: 'image/png'});
			
		var camera = Module.getViewCamera();
		var pos = camera.getLocation();
		
		
		var coord = Module.getMap().ScreenToMapPointEX(new Module.JSVector2D(window.innerWidth / 2, window.innerHeight / 2));


		var formData = new FormData();
		formData.append("mapid", IDE.mapid);
		formData.append("mapTitle", $("#ideSaveMapTitle").val());
		
		var arr = [];
		if(dtcSaveMap.appName.length > 0){
			for(var i=0; i<dtcSaveMap.appName.length; i++){
				for(var j=0; j<dtcSaveMap.appList.length; j++){
					if(dtcSaveMap.appName[i] == dtcSaveMap.appList[j].value){
						arr.push(dtcSaveMap.appList[j].num);
					}
				}
			}
			formData.append("mapApp", arr);	
		}
		formData.append("layerList", layerList);
		//formData.append("thumbData", imageData);
		formData.append("imgFile", file, 'thumb.png');
		formData.append("lon", parseFloat(pos.Longitude));
		formData.append("lat", parseFloat(pos.Latitude));
		formData.append("alt", parseFloat(pos.Altitude));
		formData.append("look_lon", parseFloat(coord.Longitude));
		formData.append("look_lat", parseFloat(coord.Latitude));
		formData.append("look_alt", parseFloat(coord.Altitude));
		formData.append("lgid", lgid);
		if(dtcSetting.legend.LID == null){
			formData.append("lid", 0);
		} else {
			formData.append("lid", dtcSetting.legend.LID);
		}
	
		formData.append("move_direct", parseFloat(Module.getViewCamera().getDirect()));
		
		$.ajax({
			url:"/ide/saveMap.do",
			type: "POST",
			data: formData,
			processData: false,
			contentType: false,
			enctype: 'multipart/form-data',
			success:function(result) {

				var result = JSON.parse(result);
				console.log(result);
				switch(result.rs) {
					case "complete":
						IDE.mapid = result.encodedMapid;

						if(updateFlag){
							COMMON.alert("지도가 수정되었습니다.","success",function(){$("#closeMenuBtn").click();});
						}else{
							COMMON.alert("지도가 저장되었습니다.","success",function(){$("#closeMenuBtn").click();});
							var URLSearch = new URLSearchParams(location.search);
							URLSearch.set("mapid", IDE.mapid);
							var newParam = URLSearch.toString();
							history.replaceState(null,null,location.pathname + '?' + newParam);
						}
					break;

					default :

					break;
				}
			}
		});
	}
}

const dtcData = {
	initProcess:function(){
		var data ={
			mid : D_MEMBER.MID
		}

		$.ajax({
			url:'../alert/dataProcessInit.do',
			data:data,
			dataType:'json',
			success:function(result){
				console.log(result);
			}
		})
	}
}

var dtcCache = ['/assets/vendor/fonts/fontawesome.css',
					'/assets/vendor/fonts/ionicons.css',
					'/assets/css/demo.css',
					'/assets/css/generics.css',
					'/assets/css/IDE.css',
					'/assets/vendor/css/pages/contacts.css',
					'/assets/js/global/cluster.js',
					'/assets/js/global/dtc-cluster.js',
					'/assets/js/global/dtc-common.js',
					'/assets/js/global/dtc-member.js',
					'/assets/js/admin/dtc-product.js',
					'/assets/js/global/dtc-global.js',
					'/assets/js/theme-settings.js',
					'/assets/js/global/dtc-log-tracker.js',
					'/assets/js/admin/dtc-module.js',
					'/assets/js/engine/init.js',
					'/assets/js/ui_tooltips.js',
					'/assets/js/IDE.js',
					'/assets/js/global/dtc-global-init.js',
					'/assets/js/desk/dtc-store.js',
					'/assets/js/global/dtc-fileupload-wizard.js',
					'/assets/js/desk/dtc-maps.js',
					'/assets/js/global/dtc-layer-styler.js',
					'/assets/vendor/js/sidenav.js',
];
