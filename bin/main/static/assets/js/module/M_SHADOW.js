/**
 * SUBJECT : 도시계획 -> 그림자 시뮬레이션
 * AUTHOR : 김경환
 * LAST UPDATE : 2020.09.02
 * COMMENT : 
 */
var M_SHADOW = {
		
	slider:null,
	
	data:null,
	
	isOn:false,
	
	fromMin:0,
	startMin:0,
	endMin:0,
	
	itv:null,
	
	timeStep:1,
	
	isHide:false,
	
	api_analysis : null,
	
	init:function() {
				
		$("#moduleShadowSlider").ionRangeSlider({
			
			skin: "square",
			grid: true,
			min: 1,
			max: 1,
			step: M_SHADOW.timeStep,
			prettify:M_SHADOW.minToTime,
			onChange:function(data) {
				
				M_SHADOW.isOn = true;
				
				clearTimeout(M_SHADOW.itv);
				
				$("#shadowPlayBtn").removeClass("shadowSimulationBtnActive");

				var currentDate = $("#moduleShadowSetDate").val();
				currentDate = currentDate.split("-");

				var h = Math.floor(data.from / 60);
				var m = data.from % 60;

				
				if(M_SHADOW.isOn == true) {
					
					M_SHADOW.setShadow(
						true,
						parseFloat(currentDate[0]), parseFloat(currentDate[1]), parseFloat(currentDate[2]),
						h, m
					);
				}

				M_SHADOW.fromMin = data.from;
			},
			onUpdate:function(data) {

				var currentDate = $("#moduleShadowSetDate").val();
				currentDate = currentDate.split("-");

				var h = Math.floor(data.from / 60);
				var m = data.from % 60;

				if(M_SHADOW.isOn == true) {
					
					M_SHADOW.setShadow(
						true,
						parseFloat(currentDate[0]), parseFloat(currentDate[1]), parseFloat(currentDate[2]),
						h, m
					);
					//Module.XDcreateShadow(parseInt(currentDate[0]), parseInt(currentDate[1]), parseInt(currentDate[2]), h, m);
				}
			},
			onFinish:function(data) {
				clearTimeout(M_SHADOW.itv);
				M_SHADOW.fromMin = data.from;
			}
		});
		
		$('[data-toggle="datepicker"]').datepicker({
			format: 'yyyy-mm-dd',
			autoHide:true,
			daysMin:["일", "월", "화", "수", "목", "금", "토"],
			months:["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
			monthsShort:["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
			yearFirst:true
		});

		$("#moduleShadowStartHour").on("change", M_SHADOW.calcTotalMin);
		$("#moduleShadowStartMin").on("change", M_SHADOW.calcTotalMin);

		$("#moduleShadowEndHour").on("change", M_SHADOW.calcTotalMin);
		$("#moduleShadowEndMin").on("change", M_SHADOW.calcTotalMin);

		$("#shadowSimulationEndMin").on("change", M_SHADOW.changeSimulationTimeStep);

		var today = new Date();
		var dd = String(today.getDate()).padStart(2, '0');
		var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
		var yyyy = today.getFullYear();

		$("#moduleShadowSetDate").val(yyyy+"-"+mm+"-"+dd);

		this.calcTotalMin();
		
		// 그림자 시뮬레이션 API 객체 반환 sumin 201005
		this.api_analysis = Module.getAnalysis();
		this.api_analysis.setAllObjectRenderShadow(true);
	},
	
	toggleShadowMode:function() {
		
		if(!this.isOn) {
			
			this.isOn = true;

			$("#btnToggleShadow").removeClass("btnToggleShadow");
			$("#btnToggleShadow").addClass("btnToggleShadowEnd");
			$("#btnToggleShadowText").html("종료");

			/*
			Module.setLayerVisible("tile_build_mo", false);
			Module.setLayerVisible("tile_bridge_mo", false);
			*/

			var currentDate = $("#shadowSetDate").val();
			currentDate = currentDate.split("-");

			var h = Math.floor(M_SHADOW.fromMin / 60);
			var m = M_SHADOW.fromMin % 60;
			
			if(M_SHADOW.isOn == true) {
				Module.XDcreateShadow(parseInt(currentDate[0]), parseInt(currentDate[1]), parseInt(currentDate[2]), h, m);
			}
			
		} else {
			
			this.isOn = false;

			$("#btnToggleShadow").removeClass("btnToggleShadowEnd");
			$("#btnToggleShadow").addClass("btnToggleShadow");
			$("#btnToggleShadowText").html("시작");

			Module.XDclearShadow();
		}
	},
	
	changeSimulationTimeStep:function() {
		M_SHADOW.timeStep = parseInt($("#moduleShadowTimeStep").val());
	},
	
	createBuildingShadow:function(data) {

	},
	
	calcTotalMin:function() {
		var sH = parseInt($("#moduleShadowStartHour").val() * 60);
		var sM = parseInt($("#moduleShadowStartMin").val());

		M_SHADOW.startMin = sH + sM;

		M_SHADOW.fromMin = M_SHADOW.startMin;

		var eH = parseInt($("#moduleShadowEndHour").val() * 60);
		var eM = parseInt($("#moduleShadowEndHour").val());
	
		M_SHADOW.endMin = eH + eM;

		M_SHADOW.data = $("#moduleShadowSlider").data("ionRangeSlider");

		M_SHADOW.data.update({
			min: M_SHADOW.startMin,
			max: M_SHADOW.endMin,
			from:M_SHADOW.startMin
		});
	},
	
	minToTime:function(min) {

		var h = Math.floor(min / 60);
		var m = min % 60;
		return h+"시 "+m+"분";
	},
	
	controlPlay:function() {
		
		M_SHADOW.isOn = true;
		
		clearTimeout(M_SHADOW.itv);

		if(M_SHADOW.fromMin == M_SHADOW.endMin) {
			$("#shadowPlayBtn").removeClass("shadowSimulationBtnActive");
			$("#shadowPauseBtn").removeClass("shadowSimulationBtnActive");
			return false;
		}

		$("#shadowPlayBtn").addClass("shadowSimulationBtnActive");
		$("#shadowPauseBtn").removeClass("shadowSimulationBtnActive");

		M_SHADOW.itv = setTimeout(function() {
			
			M_SHADOW.fromMin += M_SHADOW.timeStep;

			M_SHADOW.data.update({
				from:M_SHADOW.fromMin
			});

			M_SHADOW.controlPlay();
			
		}, 10);
	},
	controlPause:function() {

		clearTimeout(M_SHADOW.itv);
		$("#shadowPlayBtn").removeClass("shadowSimulationBtnActive");
		$("#shadowPauseBtn").addClass("shadowSimulationBtnActive");


	},
	controlStop:function() {
		clearTimeout(M_SHADOW.itv);

		$("#shadowPlayBtn").removeClass("shadowSimulationBtnActive");
		$("#shadowPauseBtn").removeClass("shadowSimulationBtnActive");

		//SHADOW.isOn = false;
	},
	controlBackward:function() {
		clearTimeout(M_SHADOW.itv);
		if(M_SHADOW.fromMin == M_SHADOW.startMin) {
			return;
		}

		M_SHADOW.fromMin -= 1;

		M_SHADOW.data.update({
			from:M_SHADOW.fromMin
		});

		$("#shadowPlayBtn").removeClass("shadowSimulationBtnActive");
		$("#shadowPauseBtn").removeClass("shadowSimulationBtnActive");
	},
	controlForward:function() {
		clearTimeout(M_SHADOW.itv);
		if(M_SHADOW.fromMin == M_SHADOW.endMin) {
			return;
		}

		M_SHADOW.fromMin += 1;

		M_SHADOW.data.update({
			from:M_SHADOW.fromMin
		});

		$("#shadowPlayBtn").removeClass("shadowSimulationBtnActive");
		$("#shadowPauseBtn").removeClass("shadowSimulationBtnActive");
	},
	
	controlReset:function() {
		clearTimeout(M_SHADOW.itv);
		M_SHADOW.init();
		$("#shadowPlayBtn").removeClass("shadowSimulationBtnActive");
		$("#shadowPauseBtn").removeClass("shadowSimulationBtnActive");
		M_SHADOW.isOn = false;
		//Module.XDclearShadow();
		this.api_analysis.clearShadow();
		/*
		Module.setLayerVisible("facility_build", !1);
		Module.setLayerVisible("facility_bridge", !1);
		Module.setLayerVisible("tile_build_mo", !0);
		Module.setLayerVisible("tile_bridge_mo", !0);
		*/
		//SHADOW.isOn = false;
	},
	destory:function() {
		
		this.api_analysis.setShadowSimulation(false);
		this.api_analysis.clearShadow();
		this.api_analysis.setAllObjectRenderShadow(false);
	},
	
	// 그림자 시각 설정 후 display sumin 201005
	setShadow : function(display, year, month, day, hour, minute) {
		
		if (this.api_analysis == null) {
			return;
		}
		
		if (display) {
			this.api_analysis.createShadow(year, month, day, hour, minute);
		} else {
			this.api_analysis.clearShadow();
		}
	}
}