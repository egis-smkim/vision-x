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
					return;
				}
			}
			
			var jsSrc = null;
			
			switch(m) {
				case 1:
					// 건물편집
					jsSrc = "editBuilding.js";
				break;
				
				case 2:
					jsSrc = "shadow.js";
				break;
			}
			
			$.getScript("./assets/js/module/"+jsSrc, function() {
				IDE.MODULE.initModuleInterface(m);
			});
		}
	} // Module
}




$(function() {
	// Initialize sidenav
	/*
	$('#layout-sidenav').each(function() {
		new SideNav(this, {
			orientation: $(this).hasClass('sidenav-horizontal') ? 'horizontal' : 'vertical'
		});
	});

	// Initialize sidenav togglers
	$('body').on('click', '.layout-sidenav-toggle', function(e) {
		e.preventDefault();
		window.layoutHelpers.toggleCollapsed();
		if (!window.layoutHelpers.isSmallScreen()) {
			try { localStorage.setItem('layoutCollapsed', String(window.layoutHelpers.isCollapsed())); } catch (e) {}
		}
	});
	*/

	/*
	if ($('html').attr('dir') === 'rtl') {
		$('#layout-navbar .dropdown-menu').toggleClass('dropdown-menu-right');
	}
	*/
	
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
	}, 1500);
	 
});

function resizeContents() {
	$("#ideContent").height($(window).height() - 6);
}

$.fn.exists = function() { return this.length > 0; };