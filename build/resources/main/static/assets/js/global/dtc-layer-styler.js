var D_LAYER_STYLE = {
	global: {//선택된 레이어 정보 전역 변수
		dataId: '', //스타일 설정 클릭 시,D_LAYER_STYLE.SYMBOL.SHP.setStyle()함수의 파라미터로 넘어오는 dataId 초기화용 
		dataType: '', //shp 타입
		dataStore: '',//geoserver 데이터 스토어
		fullLayerName: ''//데이터 스토어 : 레이어명
	},
	init: function() {

		D_LAYER_STYLE.SIDE_BAR.initiSideBar(); // 사이드 네비게이션 초기화
		D_LAYER_STYLE.SLIDER.initSlider(); // 슬라이더 관련
		D_LAYER_STYLE.FILE.initFile(); // 이미지 파일 첨부 관련
		D_LAYER_STYLE.KNOB.initKnob(); // knob >> 다이얼 관련 (회전)
		D_LAYER_STYLE.TEST.initTEST(); // cql필터 및 관련 연산 테스트 관련
		D_LAYER_STYLE.MODALS.initModal(); // 모달 관련
		D_LAYER_STYLE.SCROLL_BAR.initScrollbar(); // 스크롤바 초기화
		D_LAYER_STYLE.SYMBOL.SHP.initSHP();//shp타입별 초기화
		D_LAYER_STYLE.LABEL.initBasicLabel(); // 라벨 모달 기본 초기화
		D_LAYER_STYLE.LEGEND.initLegend(); // 범례 관련 초기화

	},
	SIDE_BAR: {
		global: {
			sideNav: null,
		},
		initiSideBar: function() {
			D_LAYER_STYLE.SIDE_BAR.global.sideNav = new SideNav($("#sidenav-2")[0]); // 사이드

			// 사이드바
			$(".sidenav-item").on("click", function() {
				if ($(this).hasClass("active")) {
					return;
				} else {
					$(this).addClass("active");
					if ($(this).siblings().hasClass("active")) {
						$(this).siblings().removeClass("active");
					} else {
						$(this).siblings().addClass("active");
					}
				}
			});
		},
	},
	SLIDER: {
		global: {
			slider: null, // 단순 포인트 심볼 슬라이더
			slider2: null, // 규칙기반 포인트 심볼 슬라이더
			slider3: null, // 라벨 불투명도
			slider4: null, // 라벨 불투명도
			slider5: null, // 라인 불투명도
			slider6: null, // 라인 불투명도
			slider7: null, // 폴리곤 불투명도
			slider8: null, // 폴리곤 규칙기반 불투명도
			simpleMakerSliderValue: 100,
			simpleMakerSliderValue2: 100,
			simpleMakerSliderValue3: 100,
			simpleMakerSliderValue4: 100,
			simpleMakerSliderValue5: 100,
			simpleMakerSliderValue6: 100,
			simpleMakerSliderValue7: 100,
			simpleMakerSliderValue8: 100

		},
		initSlider: function() {
			D_LAYER_STYLE.SLIDER.global.slider = $("#simpleMakerSlider").ionRangeSlider({
				skin: "square",
				type: "single",
				min: 0,
				max: 100,
				from: 100,
				to: 0,
				grid: true,
				onChange: function(data) {

					$("#pointPreview").css("opacity", data.from_pretty + "%");

					D_LAYER_STYLE.SLIDER.global.simpleMakerSliderValue = data.from_pretty;
				},
				onUpdate: function(data) {

					$("#pointPreview").css("opacity", data.from_pretty + "%");

					D_LAYER_STYLE.SLIDER.global.simpleMakerSliderValue = data.from_pretty;
				},
			});

			D_LAYER_STYLE.SLIDER.global.slider2 = $("#simpleMakerSlider2").ionRangeSlider({
				skin: "square",
				type: "single",
				min: 0,
				max: 100,
				from: 100,
				to: 0,
				grid: true,
				onChange: function(data) {
					$("#pointPreview2").css("opacity", data.from_pretty + "%");
					D_LAYER_STYLE.SLIDER.global.simpleMakerSliderValue2 = data.from_pretty;
				},
				onUpdate: function(data) {
					$("#pointPreview2").css("opacity", data.from_pretty + "%");
					D_LAYER_STYLE.SLIDER.global.simpleMakerSliderValue2 = data.from_pretty;
				},
			});

			D_LAYER_STYLE.SLIDER.global.slider3 = $("#simpleMakerSlider3").ionRangeSlider({
				skin: "square",
				type: "single",
				min: 0,
				max: 100,
				from: 100,
				to: 0,
				grid: true,
				onChange: function(data) {
					$("#labelPointText").css("opacity", data.from_pretty + "%");
					D_LAYER_STYLE.SLIDER.global.simpleMakerSliderValue3 = data.from_pretty;
				},
				onUpdate: function(data) {
					$("#labelPointText").css("opacity", data.from_pretty + "%");
					D_LAYER_STYLE.SLIDER.global.simpleMakerSliderValue3 = data.from_pretty;
				},
			});

			D_LAYER_STYLE.SLIDER.global.slider4 = $("#simpleMakerSlider4").ionRangeSlider({
				skin: "square",
				type: "single",
				min: 0,
				max: 100,
				from: 100,
				to: 0,
				grid: true,
				onChange: function(data) {
					$("#labelPointText-modal").css("opacity", data.from_pretty + "%");
					D_LAYER_STYLE.SLIDER.global.simpleMakerSliderValue4 = data.from_pretty;
				},
				onUpdate: function(data) {
					$("#labelPointText-modal").css("opacity", data.from_pretty + "%");
					D_LAYER_STYLE.SLIDER.global.simpleMakerSliderValue4 = data.from_pretty;
				},
			});

			D_LAYER_STYLE.SLIDER.global.slider5 = $("#simpleMakerLineSlider5").ionRangeSlider({
				skin: "square",
				type: "single",
				min: 0,
				max: 100,
				from: 100,
				to: 0,
				grid: true,
				onChange: function(data) {
					$("#strokePreview").css("opacity", data.from_pretty + "%");
					$("#linePreview").css("opacity", data.from_pretty + "%");
					D_LAYER_STYLE.SLIDER.global.simpleMakerSliderValue5 = data.from_pretty;
				},
				onUpdate: function(data) {
					$("#strokePreview").css("opacity", data.from_pretty + "%");
					$("#linePreview").css("opacity", data.from_pretty + "%");
					D_LAYER_STYLE.SLIDER.global.simpleMakerSliderValue5 = data.from_pretty;
				},
			});
			// 라인 규칙 기반
			D_LAYER_STYLE.SLIDER.global.slider6 = $("#simpleMakerLineSlider6").ionRangeSlider({
				skin: "square",
				type: "single",
				min: 0,
				max: 100,
				from: 100,
				to: 0,
				grid: true,
				onChange: function(data) {
					$("#rule_strokePreview").css("opacity", data.from_pretty + "%");
					$("#rule_linePreview").css("opacity", data.from_pretty + "%");
					D_LAYER_STYLE.SLIDER.global.simpleMakerSliderValue6 = data.from_pretty;
				},
				onUpdate: function(data) {
					$("#rule_strokePreview").css("opacity", data.from_pretty + "%");
					$("#rule_linePreview").css("opacity", data.from_pretty + "%");
					D_LAYER_STYLE.SLIDER.global.simpleMakerSliderValue6 = data.from_pretty;
				},
			});


			D_LAYER_STYLE.SLIDER.global.slider7 = $("#simpleMakerLineSlider7").ionRangeSlider({
				skin: "square",
				type: "single",
				min: 0,
				max: 100,
				from: 100,
				to: 0,
				grid: true,
				onChange: function(data) {
					var fillColor = $("#polygonFillColor").val();
					// 마커라인
					var r = parseInt(fillColor.substr(1, 2), 16);
					var g = parseInt(fillColor.substr(3, 2), 16);
					var b = parseInt(fillColor.substr(5, 2), 16);
					var a = 100 - data.from_pretty;

					var polygonType = $('#polygon-symbol-type option:selected').val();
					if (polygonType == '0') {
						$("#polygonPreview").removeAttr('background-color');
						$("#polygonPreview").removeAttr('opacity');
						$("#polygonPreview").css("background", "rgb(" + r + " " + g + " " + b + " / " + data.from_pretty + "%)");

					} else {
						$("#polygonPreview").removeAttr('background');
						$("#polygonPreview").css("background-color", fillColor);
						$("#polygonPreview").css("opacity", data.from_pretty + "%");
					}

					D_LAYER_STYLE.SLIDER.global.simpleMakerSliderValue7 = data.from_pretty;
				},
				onUpdate: function(data) {
					
					var fillColor = $("#polygonFillColor").val();
					// 마커라인
					var r = parseInt(fillColor.substr(1, 2), 16);
					var g = parseInt(fillColor.substr(3, 2), 16);
					var b = parseInt(fillColor.substr(5, 2), 16);
					var a = 100 - data.from_pretty;

					var polygonType = $('#polygon-symbol-type option:selected').val();
					if (polygonType == '0') {

						$("#polygonPreview").removeAttr('background-color');
						$("#polygonPreview").removeAttr('opacity');
						$("#polygonPreview").css("background", "rgb(" + r + " " + g + " " + b + " / " + data.from_pretty + "%)");

					} else {
						$("#polygonPreview").removeAttr('background');
						$("#polygonPreview").css("background-color", fillColor);
						$("#polygonPreview").css("opacity", data.from_pretty + "%");
					}

					D_LAYER_STYLE.SLIDER.global.simpleMakerSliderValue7 = data.from_pretty;
				},
			});


			D_LAYER_STYLE.SLIDER.global.slider8 = $("#simpleMakerLineSlider8").ionRangeSlider({
				skin: "square",
				type: "single",
				min: 0,
				max: 100,
				from: 100,
				to: 0,
				grid: true,
				onChange: function(data) {

					var fillColor = $("#polygonFillColor2").val();
					// 마커라인
					var r = parseInt(fillColor.substr(1, 2), 16);
					var g = parseInt(fillColor.substr(3, 2), 16);
					var b = parseInt(fillColor.substr(5, 2), 16);
					var a = 100 - data.from_pretty;

					var polygonType = $('#polygon-symbol-type2 option:selected').val();
					if (polygonType == '0') {

						$("#polygonPreview2").removeAttr('background-color');
						$("#polygonPreview2").removeAttr('opacity');
						$("#polygonPreview2").css("background", "rgb(" + r + " " + g + " " + b + " / " + data.from_pretty + "%)");

					} else {
						$("#polygonPreview2").removeAttr('background');
						$("#polygonPreview2").css("background-color", fillColor);
						$("#polygonPreview2").css("opacity", data.from_pretty + "%");
					}

					D_LAYER_STYLE.SLIDER.global.simpleMakerSliderValue8 = data.from_pretty;
				},
				onUpdate: function(data) {

					var fillColor = $("#polygonFillColor2").val();
					// 마커라인
					var r = parseInt(fillColor.substr(1, 2), 16);
					var g = parseInt(fillColor.substr(3, 2), 16);
					var b = parseInt(fillColor.substr(5, 2), 16);
					var a = 100 - data.from_pretty;
					var polygonType = $('#polygon-symbol-type2 option:selected').val();

					if (polygonType == '0') {

						$("#polygonPreview2").removeAttr('background-color');
						$("#polygonPreview2").removeAttr('opacity');

						$("#polygonPreview2").css("background", "rgb(" + r + " " + g + " " + b + " / " + data.from_pretty + "%)");

					} else {
						$("#polygonPreview2").removeAttr('background');

						$("#polygonPreview2").css("background-color", fillColor);
						$("#polygonPreview2").css("opacity", data.from_pretty + "%");
					}
					D_LAYER_STYLE.SLIDER.global.simpleMakerSliderValue8 = data.from_pretty;
				},
			});

		},
	},
	KNOB: { // 심볼 및 라벨 회전 다이얼
		global: {
			knob1: null,
			knob2: null,
			knob3: null,
			knob4: null,
			knob5: null,
		},
		initKnob: function() {
			// 다이얼 이벤트
			D_LAYER_STYLE.KNOB.global.knob1 = $(".knob-example input").knob({
				min: 0,
				max: 360,
				change: function(v) {
					$("#dialVal").val(parseFloat(v).toFixed(0));
					$("#pointPreview").css("transform","rotate(" + parseFloat(v).toFixed(0) + "deg)");
				},
			});

			// 다이얼 이벤트
			D_LAYER_STYLE.KNOB.global.knob2 = $(".knob-example2 input").knob({
				min: 0,
				max: 360,
				change: function(v) {
					$("#dialVal2").val(parseFloat(v).toFixed(0));
					$("#pointPreview2").css("transform","rotate(" + parseFloat(v).toFixed(0) + "deg)");
				},
			});

			// 다이얼 이벤트
			D_LAYER_STYLE.KNOB.global.knob3 = $(".knob-example3 input").knob({
				min: 0,
				max: 360,
				change: function(v) {
					$("#dialVal3").val(parseFloat(v).toFixed(0));
					$("#labelPointText").css("transform","rotate(" + parseFloat(v).toFixed(0) + "deg)");
				},
			});

			// 다이얼 이벤트 ->라벨 규칙기반 모달
			D_LAYER_STYLE.KNOB.global.knob4 = $(".knob-example4 input").knob({
				min: 0,
				max: 360,
				change: function(v) {
					$("#dialVal4").val(parseFloat(v).toFixed(0));
					$("#labelPointText-modal").css("transform","rotate(" + parseFloat(v).toFixed(0) + "deg)");
				},
			});


			// 다이얼 수동 입력 인풋 텍스트 이벤트 --  360도가 넘어가거나 0도 밑으로 입력되었을 경우 처리
			$("#dialVal").on("input", function(e) {
				if ($(this).val() > 360) { //360도 초과일 경우 360도로 고정
					$(this).val("360");
				} else if ($(this).val() < 0) { //0도 미만일 경우 0도로 고정
					$(this).val("0");
				}

				$(".knob-example input").val(e.target.value).trigger("change");
			});

			$("#dialVal2").on("input", function(e) {
				if ($(this).val() > 360) {
					$(this).val("360");
				} else if ($(this).val() < 0) {
					$(this).val("0");
				}

				$(".knob-example2 input").val(e.target.value).trigger("change");
			});

			// 라벨쪽 다이얼
			$("#dialVal3").on("input", function(e) {
				if ($(this).val() > 360) {
					$(this).val("360");
				} else if ($(this).val() < 0) {
					$(this).val("0");
				}

				$(".knob-example3 input").val(e.target.value).trigger("change");
			});

			$("#dialInnerValue").on({
				input: function(e) {
					if ($("#dialInnerValue").val() > 360) {
						$("#dialVal").val("360");
					} else if ($("#dialInnerValue").val() < 0) {
						$("#dialVal").val("0");
					}
					
					$("#pointPreview").css("transform","rotate(" + e.target.value + "deg)");
				},
				change: function(e) {
					if ($("#dialInnerValue").val() > 360) {
						$("#dialVal").val("360");
					} else if ($("#dialInnerValue").val() < 0) {
						$("#dialVal").val("0");
					}

					$("#pointPreview").css("transform","rotate(" + e.target.value + "deg)");
				},
				keydown: function(e) {
					if ($("#dialInnerValue").val() > 360) {
						$("#dialVal").val("360");
					} else if ($("#dialInnerValue").val() < 0) {
						$("#dialVal").val("0");
					}

					$("#pointPreview").css("transform","rotate(" + e.target.value + "deg)");
				},
			});

			$("#dialInnerValue2").on({
				input: function(e) {
					if ($("#dialInnerValue2").val() > 360) {
						$("#dialVal2").val("360");
					} else if ($("#dialInnerValue2").val() < 0) {
						$("#dialVal2").val("0");
					}
					
					$("#pointPreview2").css("transform","rotate(" + e.target.value + "deg)");
				},
				change: function(e) {
					if ($("#dialInnerValue2").val() > 360) {
						$("#dialVal2").val("360");
					} else if ($("#dialInnerValue2").val() < 0) {
						$("#dialVal2").val("0");
					}

					$("#pointPreview2").css("transform","rotate(" + e.target.value + "deg)");
				},
				keydown: function(e) {
					if ($("#dialInnerValue2").val() > 360) {
						$("#dialVal2").val("360");
					} else if ($("#dialInnerValue2").val() < 0) {
						$("#dialVal2").val("0");
					}
					$("#pointPreview2").css("transform","rotate(" + e.target.value + "deg)");
				},
			});

			$("#dialInnerValue3").on({
				input: function(e) {
					if ($("#dialInnerValue3").val() > 360) {
						$("#dialVal3").val("360");
					} else if ($("#dialInnerValue3").val() < 0) {
						$("#dialVal3").val("0");
					}
					
					$("#labelPointText").css("transform","rotate(" + e.target.value + "deg)");
				},
				change: function(e) {
					if ($("#dialInnerValue3").val() > 360) {
						$("#dialVal3").val("360");
					} else if ($("#dialInnerValue3").val() < 0) {
						$("#dialVal3").val("0");
					}

					$("#labelPointText").css("transform","rotate(" + e.target.value + "deg)");
				},
				keydown: function(e) {
					if ($("#dialInnerValue3").val() > 360) {
						$("#dialVal3").val("360");
					} else if ($("#dialInnerValue3").val() < 0) {
						$("#dialVal3").val("0");
					}

					$("#labelPointText").css("transform","rotate(" + e.target.value + "deg)");
				},
			});
			
			$("#dialInnerValue4").on({
				input: function(e) {
					if ($("#dialInnerValue4").val() > 360) {
						$("#dialVal4").val("360");
					} else if ($("#dialInnerValue4").val() < 0) {
						$("#dialVal4").val("0");
					}
					
					$("#labelPointText-modal").css("transform","rotate(" + e.target.value + "deg)");
				},
				change: function(e) {
					if ($("#dialInnerValue4").val() > 360) {
						$("#dialVal4").val("360");
					} else if ($("#dialInnerValue4").val() < 0) {
						$("#dialVal4").val("0");
					}

					$("#labelPointText-modal").css("transform","rotate(" + e.target.value + "deg)");
				},
				keydown: function(e) {
					if ($("#dialInnerValue4").val() > 360) {
						$("#dialVal4").val("360");
					} else if ($("#dialInnerValue4").val() < 0) {
						$("#dialVal4").val("0");
					}

					$("#labelPointText-modal").css("transform","rotate(" + e.target.value + "deg)");
				},
			});
		},
	},
	FILE: { //심볼 이미지 파일 업로드관련(포인트와 폴리곤만 해당) -- 라인은 이미지 라인이 없음
		global: {
			symbol_img_file: null,
			upoloaded_img_file_path: '',
			imgRegEx: /(.*?)\/(jpg|jpeg|png|bmp)$/
		},
		initFile: function() {
			// 이미지파일 업로드 관련 썸네일
			$("#imageFile").on("change", function(event) {
				// 파일업로드 css input text 파일 이름 입력

				var fileName = $("#imageFile").val();
				$("#upload1").val(fileName);

				var file = event.target.files[0];
				var fileSize = event.target.files[0].size;

				var imgSrc = "";

				// 이미지 파일 용량 체크 5000 -> 5mb
				if (50000 < parseFloat(fileSize).toFixed(1)) {
					COMMON.alert('이미지 파일의 용량이 5MB를 초과합니다.', 'error', function() { });
					return false;
				}


				var files = $(this)[0].files;

				var formData = new FormData();
				formData.append("imgFile", files[0]);

				$.ajax({
					url: './geodt/uploadImg.do',
					processData: false,
					contentType: false,
					data: formData,
					asyn: false,
					type: "POST",
					success: function(result) {
						var res = JSON.parse(result);
						if (res.rs == "success") { //파일 업로드 성공
							if (!D_LAYER_STYLE.Util.isEmpty(res.IMG_PATH)) {
								D_LAYER_STYLE.FILE.global.upoloaded_img_file_path = res.IMG_PATH;
							}
						} else { //파일 업로드 실패
							COMMON.alert('파일업로드에 실패하였습니다.', 'error', function() { return false; });
						}
					},
					fail: function(e) {
						COMMON.alert('네트워크 문제로 파일업로드에 실패하였습니다.', 'error', function() {
							return false;
						})

					}


				});

				var reader = new FileReader();
				var img = new Image();

				reader.onload = function(e) {
					img.src = this.result;
					imgSrc = e.target.result;
				};

				img.onload = function(e) {
					// D_LAYER_STYLE.FILE.global.symbol_img_file=event.target.files[0];

					var w = this.width;
					var h = this.height;

					D_LAYER_STYLE.FILE.createImgSymbol({ //해당 업로드 이미지의 미리보기용 리사이징 함수
						width: w,
						height: h,
						src: imgSrc,
					});
				};

				reader.readAsDataURL(file);
			});

			// 포인트 규칙기반 ->이미지파일 업로드 관련 썸네일
			$("#imageFile2").on("change", function(event) {
				// 파일업로드 css input text 파일 이름 입력
				var fileName = $("#imageFile2").val();
				$("#upload2").val(fileName);

				var file = event.target.files[0];
				var fileSize = event.target.files[0].size;

				var imgSrc = "";

				// 이미지 파일 용량 체크 5000 -> 5mb
				if (50000 < parseFloat(fileSize).toFixed(1)) {
					COMMON.alert("이미지 파일의 용량이 5MB를 초과합니다.", "error", function() { return false; });
					return false;
				}

				var files = $(this)[0].files;

				var formData = new FormData();
				formData.append("imgFile", files[0]);

				$.ajax({
					url: './geodt/uploadImg.do',
					processData: false,
					contentType: false,
					data: formData,
					asyn: false,
					type: "POST",
					success: function(result) {
						var res = JSON.parse(result);
						if (res.rs == "success") {
							if (!D_LAYER_STYLE.Util.isEmpty(res.IMG_PATH)) {

								D_LAYER_STYLE.FILE.global.upoloaded_img_file_path = res.IMG_PATH;
							}
						} else {
							COMMON.alert('파일업로드에 실패하였습니다.', 'error', function() { return false; });
						}
					},
					fail: function(e) {
						COMMON.alert('네트워크 문제로 파일업로드에 실패하였습니다.', 'error', function() { return false; });
					}
				});


				var reader = new FileReader();
				var img = new Image();

				reader.onload = function(e) {
					img.src = this.result;
					imgSrc = e.target.result;
				};

				img.onload = function() {
					var w = this.width;
					var h = this.height;

					D_LAYER_STYLE.FILE.createImgSymbol2({
						width: w,
						height: h,
						src: imgSrc,
					});
				};

				reader.readAsDataURL(file);
			});

			// 폴리곤 이미지 파일 첨부
			$("#imageFile3").on("change", function(event) {
				// 파일업로드 css input text 파일 이름 입력

				var fileName = $("#imageFile3").val();
				$("#upload3").val(fileName);

				var file = event.target.files[0];
				var fileSize = event.target.files[0].size;

				var imgSrc = "";

				// 이미지 파일 용량 체크 5000 -> 5mb
				if (50000 < parseFloat(fileSize).toFixed(1)) {
					COMMON.alert("이미지 파일의 용량이 5MB를 초과합니다.", "error", function() { return false; });
					return false;
					// COMMON.alert()
				}


				var files = $(this)[0].files;

				var formData = new FormData();
				formData.append("imgFile", files[0]);

				$.ajax({
					url: './geodt/uploadImg.do',
					processData: false,
					contentType: false,
					data: formData,
					asyn: false,
					type: "POST",
					success: function(result) {
						var res = JSON.parse(result);
						if (res.rs == "success") {
							if (!D_LAYER_STYLE.Util.isEmpty(res.IMG_PATH)) {
								D_LAYER_STYLE.FILE.global.upoloaded_img_file_path = res.IMG_PATH;
							}
						} else {
							COMMON.alert('파일업로드에 실패하였습니다.', 'error', function() { return false; });
						}
					},
					fail: function(e) {
						COMMON.alert('네트워크 문제로 파일업로드에 실패하였습니다.', 'error', function() { return false; });
					}


				});

				var reader = new FileReader();
				var img = new Image();

				reader.onload = function(e) {
					img.src = this.result;
					imgSrc = e.target.result;
				};

				img.onload = function(e) {
					D_LAYER_STYLE.FILE.global.symbol_img_file = event.target.files[0];

					var w = this.width;
					var h = this.height;

					D_LAYER_STYLE.FILE.createImgSymbol3({
						width: w,
						height: h,
						src: imgSrc,
					});
				};

				reader.readAsDataURL(file);
			});


			// 폴리곤 이미지 파일 첨부
			$("#imageFile4").on("change", function(event) {
				// 파일업로드 css input text 파일 이름 입력

				var fileName = $("#imageFile4").val();
				$("#upload4").val(fileName);

				var file = event.target.files[0];
				var fileSize = event.target.files[0].size;

				var imgSrc = "";

				// 이미지 파일 용량 체크 5000 -> 5mb
				if (50000 < parseFloat(fileSize).toFixed(1)) {
					COMMON.alert("이미지 파일의 용량이 5MB를 초과합니다.", "error", function() { return false; });
					return false;
					// COMMON.alert()

				}


				var files = $(this)[0].files;

				var formData = new FormData();
				formData.append("imgFile", files[0]);

				$.ajax({
					url: './geodt/uploadImg.do',
					processData: false,
					contentType: false,
					data: formData,
					asyn: false,
					type: "POST",
					success: function(result) {
						var res = JSON.parse(result);
						if (res.rs == "success") {
							if (!D_LAYER_STYLE.Util.isEmpty(res.IMG_PATH)) {
								D_LAYER_STYLE.FILE.global.upoloaded_img_file_path = res.IMG_PATH;
							}
						} else {
							COMMNON.alert('파일업로드에 실패하였습니다.', 'error', function() { return false; });
						}
					},
					fail: function(e) {
						COMMON.alert('네트워크 문제로 파일업로드에 실패하였습니다.', 'error', function() { return false; });

					}


				});

				var reader = new FileReader();
				var img = new Image();

				reader.onload = function(e) {
					img.src = this.result;
					imgSrc = e.target.result;
				};

				img.onload = function(e) {
					D_LAYER_STYLE.FILE.global.symbol_img_file = event.target.files[0];

					var w = this.width;
					var h = this.height;

					D_LAYER_STYLE.FILE.createImgSymbol4({
						width: w,
						height: h,
						src: imgSrc,
					});
				};

				reader.readAsDataURL(file);
			});

		},
		createImgSymbol: function(object) {
			// 단일 심볼 이미지마커
			var maxSize = 14;

			var img_width = object.width;
			var img_height = object.height;
			var img_src = object.src;

			// 이미지 마커 리사이징
			if (img_width > img_height) {
				if (img_width > maxSize) {
					img_height *= maxSize / img_width;
					img_width = maxSize;
				}
			} else {
				if (img_height > maxSize) {
					img_width *= maxSize / img_height;
					img_height = maxSize;
				}
			}

			if (img_width > 130 || img_height > 130) {
				COMMON.alert("이미지의 사이즈가 너무 큽니다.", "error", function() { return false; });
				return false;
			}
			$("#simpleImgMarkerWidth").val(img_width);
			$("#simpleImgMarkerHeight").val(img_height);
			var img =
				'<img id="imgMarker" style="width:' +
				img_width +
				'px; height:"auto;"/>';
			$("#pointPreview").html("");
			$("#pointPreview").append(img);

			$("#imgMarker").attr("src", img_src);
		},
		createImgSymbol2: function(object) {
			// 규칙기반 포인트 심볼 이미지 마커
			var maxSize = 14;

			var img_width = object.width;
			var img_height = object.height;
			var img_src = object.src;

			// 이미지 마커 리사이징
			if (img_width > img_height) {
				if (img_width > maxSize) {
					img_height *= maxSize / img_width;
					img_width = maxSize;
				}
			} else {
				if (img_height > maxSize) {
					img_width *= maxSize / img_height;
					img_height = maxSize;
				}
			}

			$("#simpleImgMarkerWidth2").val(img_width);
			$("#simpleImgMarkerHeight2").val(img_height);
			var img = '<img id="imgMarker2" style="width:' + img_width + 'px;"/>';
			$("#pointPreview2").html("");
			$("#pointPreview2").append(img);

			$("#imgMarker2").attr("src", img_src);
		},
		createImgSymbol3: function(object) {
			// 규칙기반 포인트 심볼 이미지 마커
			var maxSize = 100;


			var img_width = object.width;
			var img_height = object.height;
			var img_src = object.src;

			// 이미지 마커 리사이징
			if (img_width > img_height) {// 너비가 더 큰 경우
				if (img_width > maxSize) {
					img_height *= maxSize / img_width;
					img_width = maxSize;
				} else { // 너비가 맥스 사이즈 보다 작을 경우
					img_width = 100;
					img_height *= maxSize / img_width;
					img_width = maxSize;
				}
			} else { // 높이가 더 큰 경우
				if (img_height > maxSize) {
					img_width *= maxSize / img_height;
					img_height = maxSize;
				} else {
					img_height = 100;
					img_width *= maxSize / img_height;
					img_height = maxSize;
				}
			}

			$("#polygonImgWidth").val(img_width);
			$("#polygonImgHeight").val(img_height);
			var img = '<img id="imgMarker3" style="width:' + img_width + 'px;"/>';
			$("#polygonPreview").html("");
			$("#polygonPreview").append(img);

			$("#imgMarker3").attr("src", img_src);
		},
		createImgSymbol4: function(object) {
			// 규칙기반 포인트 심볼 이미지 마커
			var maxSize = 100;


			var img_width = object.width;
			var img_height = object.height;
			var img_src = object.src;

			// 이미지 마커 리사이징
			if (img_width > img_height) {// 너비가 더 큰 경우
				if (img_width > maxSize) {
					img_height *= maxSize / img_width;
					img_width = maxSize;
				} else { // 너비가 맥스 사이즈 보다 작을 경우
					img_width = 100;
					img_height *= maxSize / img_width;
					img_width = maxSize;
				}
			} else { // 높이가 더 큰 경우
				if (img_height > maxSize) {
					img_width *= maxSize / img_height;
					img_height = maxSize;
				} else {
					img_height = 100;
					img_width *= maxSize / img_height;
					img_height = maxSize;
				}
			}

			$("#polygonImgWidth2").val(img_width);
			$("#polygonImgHeight2").val(img_height);
			var img = '<img id="imgMarker4" style="width:' + img_width + 'px;"/>';
			$("#polygonPreview2").html("");
			$("#polygonPreview2").append(img);

			$("#imgMarker4").attr("src", img_src);
		}
	},
	MODALS: {
		global: {
			deletedRows: [],
			selectedColumn: '',
			offset: 0,//스크롤 페이징 처리를 위한 전역 값
			labeloffset: 0,//라벨쪽 스크롤 페이징 처리를 위한 전역 값
			search_offset: 0,
			label_search_offset: 0,
			searchCnt: 0,
			labelSearchCnt: 0,
			singleLabelAttr_offset:0//단일 라벨 속성선택 상세[돋보기]버튼 클릭시 페이징 처리를 위한 전역 값
		},
		initModal: function() {

			$('input[name="added-rule-group"]').on('change', function() {
				if ($(this).is(':checked')) {
					$(this).attr('checked', true);
				} else {
					$(this).attr('checked', false);
				}
			});

			$('input[name="added-rule-label-group"]').on('change', function() {
				if ($(this).is(':checked')) {
					$(this).attr('checked', true);
				} else {
					$(this).attr('checked', false);
				}
			});

			$('.checkRules').on('change', function() {
				if ($(this).is(':checked')) {
					$(this).attr('checked', true);
				} else {
					$(this).attr('checked', false);
				}
			});
			$("#rule-btn").click(function() {
				if ($("#calArea").hasClass("active")) {
					D_LAYER_STYLE.MODALS.createSymbolAttr(D_LAYER_STYLE.global.dataId);
					$("#calArea").removeClass("active");
					$("#calArea").show();
				} else {
					$("#calArea").addClass("active");
					$("#calArea").hide();
				}
			});

			$("#rule-label-btn").click(function() {
				if ($("#label-calArea").hasClass("active")) {
					D_LAYER_STYLE.LABEL.createLabelSymbolAttr(D_LAYER_STYLE.global.dataId);
					$("#label-calArea").removeClass("active");
					$("#label-calArea").show();
				} else {
					$("#label-calArea").addClass("active");
					$("#label-calArea").hide();
				}
			});

			$("#showSymbolBtn").on("click", function() {
				$("#symbolArea").show();
				$("#labelArea").hide();
			});

			$("#showLabelBtn").on("click", function() {
				$("#symbolArea").hide();
				$("#labelArea").show();
			});

			$('#symbolRuleElseCheck').on('change', function() {
				var checked = $('#symbolRuleElseCheck').is(':checked');

				if (checked) {
					$('#rule-based-filter').val('ELSE');
					$('#rule-based-filter').prop('disabled', true);
					$('#rule-btn').prop('disabled', true);
					$('#filter_test').addClass('disabled');
					$('#filter_test').off('click');
					$('#calArea').hide();
					if (!$('#calArea').hasClass('active')) {
						$('#calArea').addClass('active');
					}
					D_LAYER_STYLE.SYMBOL.global.elseFlag = true;
				} else {
					$('#rule-based-filter').prop('disabled', false);
					$('#rule-btn').prop('disabled', false);
					$('#filter_test').removeClass('disabled');
					$('#filter_test').on("click", function() {
						COMMON.blockUIdiv('calArea', '계산중입니다...')
						D_LAYER_STYLE.TEST.testExpression();
						COMMON.unblockUIdiv('calArea')
					});
					D_LAYER_STYLE.SYMBOL.global.elseFlag = false;
				}

			});

			$('#labelRuleElseCheck').on('change', function() {
				var checked = $('#labelRuleElseCheck').is(':checked');

				if (checked) {
					$('#rule-based-filter-modal').val('ELSE');
					$('#rule-based-filter-modal').prop('disabled', true);
					$('#rule-label-btn').prop('disabled', true);
					$('#label_filter_test').addClass('disabled');
					$('#label_filter_test').off('click');
					$('#label-calArea').hide();
					if (!$('#label-calArea').hasClass('active')) {
						$('#label-calArea').addClass('active');
					}
					D_LAYER_STYLE.LABEL.global.elseFlag = true;
				} else {
					$('#rule-based-filter-modal').prop('disabled', false);
					$('#rule-label-btn').prop('disabled', false);
					$('#label_filter_test').removeClass('disabled');
					$('#label_filter_test').on("click", function() {
						COMMON.blockUIdiv('label-calArea', '계산중입니다...')
						D_LAYER_STYLE.TEST.testLabelExpression();
						COMMON.unblockUIdiv('label-calArea')
					});
					D_LAYER_STYLE.LABEL.global.elseFlag = false;
				}

			});


			// 데이터 불러오기 << 식에서
			$("#getPropertyBtn").on("click", function() {
				D_LAYER_STYLE.MODALS.global.offset = 0;
				D_LAYER_STYLE.MODALS.global.search_offset = 0;
				$('#sym_keyword').val('');
				$('#point-sample-attribute').scrollTop(0);
				$('#point-sample-attribute').scrollLeft(0);
				var flag = $(".tr_target").hasClass("tr_active"); // 선택된 칼럼이 있는지 확인


				if (flag) {
					var attrName = $(".tr_active").children().text().trim();
					COMMON.blockUIdiv('point-sample-attribute', 'loading');
					D_LAYER_STYLE.MODALS.createProperties(D_LAYER_STYLE.global.dataId, attrName);
					COMMON.unblockUIdiv('point-sample-attribute');
				} else {
					COMMON.alert("값을 선택해주세요", 'error', function() { return false; });
					return false;
				}
			});

			// 데이터 불러오기 << 식에서
			$("#getPropertyLabelBtn").on("click", function() {
				D_LAYER_STYLE.MODALS.global.labeloffset = 0;
				D_LAYER_STYLE.MODALS.global.label_search_offset = 0;
				$('#label_sym_keyword').val('');
				$('#label-sample-attribute').scrollTop(0);
				$('#label-sample-attribute').scrollLeft(0);
				var flag = $(".label_tr_target").hasClass("tr_active"); // 선택된 칼럼이 있는지 확인


				if (flag) {
					var attrName = $(".tr_active").children().text().trim();

					D_LAYER_STYLE.LABEL.createLabelProperties(D_LAYER_STYLE.global.dataId, attrName);
				} else {
					COMMON.alert("값을 선택해주세요", 'error', function() { return false; });
					return false;
				}
			});

			// 규칙 기반 라벨 필드 클릭시 활성화
			$(".tr_target").on("click", function() {
				$(this).addClass("tr_active");
				if ($(this).siblings().hasClass("tr_active")) {
					$(this).siblings().removeClass("tr_active");
				}
			});

			$(".tr_target, .tr_target_value").on("dblclick", function() {
				var td_text = $(this).find("td").text().trim();

				$("#expression_bulid_area").append(td_text);

				$("#rule-based-filter").val($("#expression_bulid_area").text().trim());
			});

			$(".label_tr_target").on("click", function() {
				$(this).addClass("tr_active");
				if ($(this).siblings().hasClass("tr_active")) {
					$(this).siblings().removeClass("tr_active");
				}
			});


			$(".label_tr_target_value").on("click", function() {
				var td_text = $(this).find("td").text().trim();

				$("#expression_bulid_area_label").append(td_text);

				$("#rule-based-filter-modal").val(
					+$("#expression_bulid_area_label").text().trim()
				);
			});

			$(".cal-btn").on("click", function() {
				var cal_text = $(this).text().trim();
				if ($("#rule-based-modal").hasClass("show")) {
					$("#expression_bulid_area").append(cal_text);

					$("#rule-based-filter").val(
						$("#expression_bulid_area").text().trim()
					);
				} else if ($("#rule-based-label-modal").hasClass("show")) {
					$("#expression_bulid_area_label").append(cal_text);
					$("#rule-based-filter-modal").val(
						$("#expression_bulid_area_label").text().trim()
					);
				}
			});

			// 연산자 드랍다운 클릭시 해당 식 입력
			$(".cal-btn,.cal-md-btn").on("click", function() {
				$("#rule-based-filter").text($(this).text());
				// $("#operator-input").text($(this).text());
			});

			$(".column-item").on("click", function() {
				// $("#expression_area").append('"' + $(this).text() + '"');
			});

			$("#exampleModalCenter").on("hidden.bs.modal", function() {
				D_LAYER_STYLE.SCROLL_BAR.resetScrollbar();
				D_LAYER_STYLE.MODALS.global.offset = 0;
				D_LAYER_STYLE.MODALS.global.search_offset = 0;
				D_LAYER_STYLE.MODALS.global.labeloffset = 0;
				D_LAYER_STYLE.MODALS.global.label_search_offset = 0;
				$('.tr_active').removeClass('tr_active');
			});

			// 포인트 규칙 기반 모달 닫힐 시, 초기화
			$("#rule-based-modal").on("hidden.bs.modal", function() {
				$('body').attr('onselectstart', 'return false');
				D_LAYER_STYLE.SYMBOL.global.clickedSymbolId = "";//해당 설정 규칙이 닫히면 초기화 -- 규칙이 삽입되면 rowId로 저장된 설정을 불러옴.
				D_LAYER_STYLE.SYMBOL.global.tempFilterText = "";//필터 규칙 초기화
				D_LAYER_STYLE.SCROLL_BAR.resetScrollbar();
				$('#sym_keyword').val('');
				if (D_LAYER_STYLE.SYMBOL.global.symbolUpdateFlag) {

					$("#point-symbol-type2").val("0").trigger("change");
					$("#rule_line-symbol-type").val("0").trigger("change");
					$('#polygon-symbol-type2').val("0").trigger("change");
				} else {
					D_LAYER_STYLE.SYMBOL.initData2("2");
					D_LAYER_STYLE.SYMBOL.initDataSimpleRuleLine();
					D_LAYER_STYLE.SYMBOL.initDataMarkerRuleLine();
					D_LAYER_STYLE.SYMBOL.initImagePolygon2();
					D_LAYER_STYLE.SYMBOL.initSimplePolygon2();

					$("#point-symbol-type2").val("0").trigger("change");
					$("#rule_line-symbol-type").val("0").trigger("change");
					$('#polygon-symbol-type2').val("0").trigger("change");


				}
				$('#symbolRuleElseCheck').prop('checked', false);
				$('#rule-based-label').val("");
				$('#rule-based-filter').val("");

				$(".tr_active").removeClass("tr_active");
				$(".tr_target_value").remove();

				if (!$('#calArea').hasClass('active')) {
					$('#calArea').addClass('active');
				}

				$('#rule-based-filter').prop('disabled', false);
				$('#rule-btn').prop('disabled', false);
				$('#filter_test').removeClass('disabled');
				$('#filter_test').off('click');
				$('#filter_test').on("click", function() {
					COMMON.blockUIdiv('calArea', '계산중입니다...')
					D_LAYER_STYLE.TEST.testExpression();
					COMMON.unblockUIdiv('calArea')
				});
				D_LAYER_STYLE.SYMBOL.global.elseFlag = false;

				D_LAYER_STYLE.SYMBOL.global.symbolUpdateFlag = false;



			});

			// 규칙 기반 모달 열릴 시에
			$("#rule-based-modal").on("show.bs.modal", function() {
				$('body').attr('onselectstart', 'return true');
				let type = D_LAYER_STYLE.global.dataType;

				if (type == 'point' || type == 'multipoint') {
					$('.pointSymbol_Area').show();
					$('.lineSymbol_Area').hide();
					$('.polygonSymbol_Area').hide();
				} else if (type == 'line' || type == 'linestring' || type == 'multilinestring') {
					$('.pointSymbol_Area').hide();
					$('.lineSymbol_Area').show();
					$('.polygonSymbol_Area').hide();
				} else if (type = 'polygon' || type == 'multipolygon') {
					$('.pointSymbol_Area').hide();
					$('.lineSymbol_Area').hide();
					$('.polygonSymbol_Area').show();
				}
			});

			$("#rule-based-label-modal").on("show.bs.modal", function() {
					$('body').attr('onselectstart', 'return true');
					$('#expression_bulid_area_label').text(''); 	
							
			});
			
			$("#rule-based-label-modal").on("shown.bs.modal", function() {//html이 비동기로 그려지고나서 실행
					$('#rule-based-modal-body').scrollTop(0);
					$('#rule-based-modal-body').scrollLeft(0);
					$('#rule-based-label-modal-body').scrollTop(0);
					$('#rule-based-label-modal-body').scrollLeft(0);
			});
			
			$("#label_columnInfo_modal").on("shown.bs.modal", function() {//html이 비동기로 그려지고나서 실행
					D_LAYER_STYLE.MODALS.global.singleLabelAttr_offset = 0;
					$('#labelAttrInfoArea').scrollTop(0);
					var selected_column = $('#point-symbol-attr-type option:selected').val();
					D_LAYER_STYLE.LABEL.createSingleLabelProperties(D_LAYER_STYLE.global.dataId,selected_column);
			});
			
			// 라벨 규칙 기반 모달 닫힐 시, 초기화
			$("#rule-based-label-modal").on("hidden.bs.modal", function() {
				$('body').attr('onselectstart', 'return false');
				D_LAYER_STYLE.LABEL.global.clickedLabelId ="";//해당 설정 규칙이 닫히면 초기화 -- 규칙이 삽입되면 rowId로 저장된 설정을 불러옴.
				D_LAYER_STYLE.LABEL.global.tempFilterText = "";//필터 규칙 초기화
				D_LAYER_STYLE.SCROLL_BAR.resetScrollbar();
				$('#label_sym_keyword').val('');

				if (D_LAYER_STYLE.LABEL.global.labelUpdateFlag) {//라벨 규칙을 수정
					D_LAYER_STYLE.LABEL.initData4();
				} else {//라벨 규칙을 새로 만듬
					D_LAYER_STYLE.LABEL.initData4();
				}
				$('#rule-based-labelinput-modal').val("");
				$('#rule-based-filter-modal').val("");
				if (!$('#label-calArea').hasClass('active')) {
					$('#label-calArea').addClass('active');
				}

				$('#labelRuleElseCheck').prop('checked', false);

				$('#rule-based-filter-modal').prop('disabled', false);
				$('#rule-label-btn').prop('disabled', false);
				$('#label_filter_test').removeClass('disabled');
				$('#label_filter_test').off("click");
				$('#label_filter_test').on("click", function() {
					COMMON.blockUIdiv('label-calArea', '계산중입니다...')
					D_LAYER_STYLE.TEST.testLabelExpression();
					COMMON.unblockUIdiv('label-calArea')

				});
				D_LAYER_STYLE.LABEL.global.elseFlag = false;
				D_LAYER_STYLE.LABEL.global.labelUpdateFlag = false;
			});

			$("#rule-based-label-modal").on("show.bs.modal", function() {
				var dataId = D_LAYER_STYLE.global.dataId;
				var url1 =
					"./geodt/getTableHead.do?DATAID=" + dataId;

				$.ajax({
					url: url1,
					type: "GET",
					dataType: "json",
					async: false,
					success: function(result) {
						if (result.rs == "success") {


							var hearders = result.HEADER;
							var headerNames = []; // 테이블 칼럼만 추출

							$('#point-symbol-attr-type-modal').html("");
							var optionsHtml = "";
							hearders.forEach((v, i) => {
								if (v.column_name !== 'gid' && v.column_name !== 'geom') { // gid는 shp파일을 db화하면 자동생성 칼럼임
									optionsHtml += '<option value="' + v.column_name + '">';
									optionsHtml += v.column_name;
									optionsHtml += '</option>';
								}

							});
							$('#point-symbol-attr-type-modal').append(optionsHtml);
						} else {
							COMMON.alert("네트워크문제로 정상적으로 \n 데이터를 불러올 수 없습니다.", 'error', function() {
								return false;
							});
						}
					},
					fail: function(result) {

						COMMON.alert("네트워크 통신 중,문제가 발생하였습니다.", "error", function() { return false; });
					},
				});

			});

			// 모달에서 저장하기 클릭시 정보 출력
			$("#saveBtn").on("click", function() {

				$('input:checkbox[name="added-rule-group"]:not(:checked)').each(function(k,kVal) {
					let row = kVal.parentElement.parentElement;

					if (D_LAYER_STYLE.global.dataType == "point" || D_LAYER_STYLE.global.dataType == "multipoint") {
						var index = D_LAYER_STYLE.SYMBOL.global.point_ruleGroup.findIndex((v) => v.id == kVal.id);

						if (index != -1) {
							if (!D_LAYER_STYLE.Util.isEmpty(D_LAYER_STYLE.SYMBOL.global.point_ruleGroup[index].uncheckedFlg)) {
								delete D_LAYER_STYLE.SYMBOL.global.point_ruleGroup[index].uncheckedFlg;
							}

							D_LAYER_STYLE.SYMBOL.global.point_ruleGroup[index].uncheckedFlg = '1'
						}
					} else if (D_LAYER_STYLE.global.dataType == "line" || D_LAYER_STYLE.global.dataType == "linestring" || D_LAYER_STYLE.global.dataType == "multilinestring") {
						var index = D_LAYER_STYLE.SYMBOL.global.line_ruleGroup.findIndex((v) => v.id == kVal.id);

						if (index != -1) {
							if (!D_LAYER_STYLE.Util.isEmpty(D_LAYER_STYLE.SYMBOL.global.line_ruleGroup[index].uncheckedFlg)) {
								delete D_LAYER_STYLE.SYMBOL.global.line_ruleGroup[index].uncheckedFlg;
							}

							D_LAYER_STYLE.SYMBOL.global.line_ruleGroup[index].uncheckedFlg = '1'
						}
					} else if (D_LAYER_STYLE.global.dataType == "polygon" || D_LAYER_STYLE.global.dataType == "multipolygon") {
						var index = D_LAYER_STYLE.SYMBOL.global.polygon_ruleGroup.findIndex((v) => v.id == kVal.id);
						
						if (index != -1) {
							if (!D_LAYER_STYLE.Util.isEmpty(D_LAYER_STYLE.SYMBOL.global.polygon_ruleGroup[index].uncheckedFlg)) {
								delete D_LAYER_STYLE.SYMBOL.global.polygon_ruleGroup[index].uncheckedFlg;
							}

							D_LAYER_STYLE.SYMBOL.global.polygon_ruleGroup[index].uncheckedFlg = '1'
						}
					}

				});

				$('input:checkbox[name="added-rule-group"]:checked').each(function(k,kVal) {
					let row = kVal.parentElement.parentElement;

					if (D_LAYER_STYLE.global.dataType == "point" || D_LAYER_STYLE.global.dataType == "multipoint") {
						var index = D_LAYER_STYLE.SYMBOL.global.point_ruleGroup.findIndex((v) => v.id == kVal.id);

						if (index != -1) {
							if (!D_LAYER_STYLE.Util.isEmpty(D_LAYER_STYLE.SYMBOL.global.point_ruleGroup[index].uncheckedFlg)) {
								delete D_LAYER_STYLE.SYMBOL.global.point_ruleGroup[index].uncheckedFlg;
							}
						}
					} else if (D_LAYER_STYLE.global.dataType == "line" || D_LAYER_STYLE.global.dataType == "linestring" || D_LAYER_STYLE.global.dataType == "multilinestring") {
						var index = D_LAYER_STYLE.SYMBOL.global.line_ruleGroup.findIndex((v) => v.id == kVal.id);

						if (index != -1) {
							if (!D_LAYER_STYLE.Util.isEmpty(D_LAYER_STYLE.SYMBOL.global.line_ruleGroup[index].uncheckedFlg)) {
								delete D_LAYER_STYLE.SYMBOL.global.line_ruleGroup[index].uncheckedFlg;
							}
						}
					} else if (D_LAYER_STYLE.global.dataType == "polygon" || D_LAYER_STYLE.global.dataType == "multipolygon") {
						var index = D_LAYER_STYLE.SYMBOL.global.polygon_ruleGroup.findIndex((v) => v.id == kVal.id);

						if (index != -1) {
							if (!D_LAYER_STYLE.Util.isEmpty(D_LAYER_STYLE.SYMBOL.global.polygon_ruleGroup[index].uncheckedFlg)) {
								delete D_LAYER_STYLE.SYMBOL.global.polygon_ruleGroup[index].uncheckedFlg;
							}
						}
					}

				});
				
				//라벨 규칙 로우
				$('input:checkbox[name="added-rule-label-group"]:not(:checked)').each(function(k,kVal) {
					let row = kVal.parentElement.parentElement;
					var index = D_LAYER_STYLE.LABEL.global.label_ruleGroup.findIndex((v) => v.id == kVal.id);
					if (index != -1) {
						if (!D_LAYER_STYLE.Util.isEmpty(D_LAYER_STYLE.LABEL.global.label_ruleGroup[index].uncheckedFlg)) {
							delete D_LAYER_STYLE.LABEL.global.label_ruleGroup[index].uncheckedFlg;
						}
						D_LAYER_STYLE.LABEL.global.label_ruleGroup[index].uncheckedFlg = '1';
					}

				});

				$('input:checkbox[name="added-rule-label-group"]:checked').each(function(k,kVal) {
					let row = kVal.parentElement.parentElement;
					var index = D_LAYER_STYLE.LABEL.global.label_ruleGroup.findIndex((v) => v.id == kVal.id);
					if (index != -1) {
						if (!D_LAYER_STYLE.Util.isEmpty(D_LAYER_STYLE.LABEL.global.label_ruleGroup[index].uncheckedFlg)) {
							delete D_LAYER_STYLE.LABEL.global.label_ruleGroup[index].uncheckedFlg;
						}
					}

				});

				D_LAYER_STYLE.SYMBOL.saveSymbolStyle();//심볼 스타일 저장
				D_LAYER_STYLE.LABEL.saveLabelStyle();//라벨 스타일 저장
				
				//심볼 스타일과 라벨스타일이 저장되면 각 shp타입별로 같이 합쳐서 하나의 배열로 만듬
				var sumStyleObj = null;
				if (D_LAYER_STYLE.global.dataType == "point" || D_LAYER_STYLE.global.dataType == "multipoint") {//...은 전개연산자
					sumStyleObj = [...D_LAYER_STYLE.SYMBOL.global.point_ruleGroup, ...D_LAYER_STYLE.LABEL.global.label_ruleGroup];
				} else if (D_LAYER_STYLE.global.dataType == "line" || D_LAYER_STYLE.global.dataType == "linestring" || D_LAYER_STYLE.global.dataType == "multilinestring") {
					sumStyleObj = [...D_LAYER_STYLE.SYMBOL.global.line_ruleGroup, ...D_LAYER_STYLE.LABEL.global.label_ruleGroup];
				} else if (D_LAYER_STYLE.global.dataType == "polygon" || D_LAYER_STYLE.global.dataType == "multipolygon") {
					sumStyleObj = [...D_LAYER_STYLE.SYMBOL.global.polygon_ruleGroup, ...D_LAYER_STYLE.LABEL.global.label_ruleGroup];
				}


				//규칙 기반일 경우 아무런 규칙이 없다면 규칙을 추가하라는 알림창 띄움.
				if (D_LAYER_STYLE.SYMBOL.global.point_ruleGroup.length == 0
					&& D_LAYER_STYLE.SYMBOL.global.line_ruleGroup.length == 0
					&& D_LAYER_STYLE.SYMBOL.global.polygon_ruleGroup.length == 0) {
						
					var simpleOrNot = '';
					if (D_LAYER_STYLE.global.dataType == "point" || D_LAYER_STYLE.global.dataType == "multipoint") {
						simpleOrNot = $('#point-symbol-rule option:selected').val();
					} else if (D_LAYER_STYLE.global.dataType == "line" || D_LAYER_STYLE.global.dataType == "linestring" || D_LAYER_STYLE.global.dataType == "multilinestring") {
						simpleOrNot = $('#line-symbol-rule option:selected').val();
					} else if (D_LAYER_STYLE.global.dataType == "polygon" || D_LAYER_STYLE.global.dataType == "multipolygon") {
						simpleOrNot = $('#polygon-symbol-rule option:selected').val();
					}

					if (simpleOrNot == '1') {//
						COMMON.alert('심볼 규칙을 찾을 수 없습니다.\n규칙을 추가한 후,저장해주세요.', 'error', function() { return false; });
						return false;
					}

				}

				if ($('#symbol-label-rule option:selected').val() == '2') {
					if (D_LAYER_STYLE.LABEL.global.label_ruleGroup.length == 0) {
						COMMON.alert('라벨 규칙을 찾을 수 없습니다.\n규칙을 추가한 후,저장해주세요.', 'error', function() { return false; });
						return false;
					}
				}

				D_LAYER_STYLE.SYMBOL.updateSavedSymbolStyle(sumStyleObj); //최종적으로 서버에 심볼 스타일과,라벨스타일 값을 넘겨서 스타일변경 처리
			});

			// 전체 선택 버튼
			$("#clickAllBtn").on("click", function() {
				$('input:checkbox[name="added-rule-group"]').prop("checked", true);
				$('input:checkbox[name="added-rule-group"]').attr('checked', true);
			});

			$("#line_clickAllBtn").on("click", function() {
				$('input:checkbox[name="added-rule-group"]').prop("checked", true);
				$('input:checkbox[name="added-rule-group"]').attr('checked', true);
			});
			$("#polygon_clickAllBtn").on("click", function() {
				$('input:checkbox[name="added-rule-group"]').prop("checked", true);
				$('input:checkbox[name="added-rule-group"]').attr('checked', true);
			});

			// 전체 해제 버튼
			$("#unclickAllBtn").on("click", function() {
				$('input:checkbox[name="added-rule-group"]:checked').prop("checked",false);
				$('input:checkbox[name="added-rule-group"]').attr('checked', false);
			});

			$("#line_unclickAllBtn").on("click", function() {
				$('input:checkbox[name="added-rule-group"]:checked').prop("checked",false);
				$('input:checkbox[name="added-rule-group"]').attr('checked', false);
			});

			$("#polygon_unclickAllBtn").on("click", function() {
				$('input:checkbox[name="added-rule-group"]:checked').prop("checked",false);
				$('input:checkbox[name="added-rule-group"]').attr('checked', false);
			});

			$("#lgd-remove-btn").on("click", function() {
				if ($('input:checkbox[name="added-rule-group"]:checked').length === 0) {
					COMMON.alert("삭제할 항목을 선택해주세요.", 'error', function() { return false; });
					return false;
				}

				$('input:checkbox[name="added-rule-group"]:checked').each(function(k,kVal) {
					let row = kVal.parentElement.parentElement;
					var index = D_LAYER_STYLE.SYMBOL.global.point_ruleGroup.findIndex((v) => v.id == kVal.id);

					D_LAYER_STYLE.SYMBOL.global.point_ruleGroup.splice(index, 1);

					$(row).remove();
				});
			});
			// 라인
			$("#line-lgd-remove-btn").on("click", function() {
				if ($('input:checkbox[name="added-rule-group"]:checked').length === 0) {
					COMMON.alert("삭제할 항목을 선택해주세요.", 'error', function() { return false });
					return false;
				}

				$('input:checkbox[name="added-rule-group"]:checked').each(function(
					k,
					kVal
				) {
					let row = kVal.parentElement.parentElement;
					var index = D_LAYER_STYLE.SYMBOL.global.line_ruleGroup.findIndex(
						(v) => v.id == kVal.id
					);

					D_LAYER_STYLE.SYMBOL.global.line_ruleGroup.splice(index, 1);



					$(row).remove();
				});
			});
			// 폴리곤
			$("#polygon-lgd-remove-btn").on("click", function() {
				if ($('input:checkbox[name="added-rule-group"]:checked').length === 0) {
					COMMON.alert("삭제할 항목을 선택해주세요.", "error", function() { return false; });
					return false;
				}

				$('input:checkbox[name="added-rule-group"]:checked').each(function(k,kVal) {
					let row = kVal.parentElement.parentElement;
					var index = D_LAYER_STYLE.SYMBOL.global.polygon_ruleGroup.findIndex((v) => v.id == kVal.id);
					D_LAYER_STYLE.SYMBOL.global.polygon_ruleGroup.splice(index, 1);
					$(row).remove();
				});
			});

			$("#expression_bulid_area").on("input", function(e) {
				$("#rule-based-filter").val($(this).text().trim());
			});

			$("#rule-based-filter")
				.on("input", function() {
					$("#expression_bulid_area").text($(this).val().trim());
				})
				.on("change", function() {
					$("#expression_bulid_area").text($(this).val().trim());
				});

			var watchTarget = document.getElementById("expression_bulid_area");

			var watchTarget2 = document.getElementById("rule-based-filter");

			var observer = new MutationObserver(function(mutation) {
				if (mutation[0].type === "characterData") {
					$("#rule-based-filter").val(mutation[0].target.textContent);
				}
			});

			// 라벨쪽
			$("#expression_bulid_area_label").on("input", function(e) {
				$("#rule-based-filter-modal").val($(this).text().trim());
			});

			$("#rule-based-filter-modal")
				.on("input", function() {
					$("#expression_bulid_area_label").text($(this).val().trim());
				})
				.on("change", function() {
					$("#expression_bulid_area_label").text($(this).val().trim());
				});

			// var watch_target = $('#rule-based-filter');
			var watchTarget3 = document.getElementById("expression_bulid_area_label");

			var watchTarget4 = document.getElementById("rule-based-filter-modal");

			var observer2 = new MutationObserver(function(mutation) {
				if (mutation[0].type === "characterData") {
					$("#rule-based-filter").val(mutation[0].target.textContent);
				}
			});

			$("#rule-btn").on("click", function() {
				$("#rule-based-filter-test-modal").modal("show");
			});


			$("#sym_keyword").on('keyup', function(e) {
				D_LAYER_STYLE.MODALS.global.search_offset = 0;
				$('#point-sample-attribute-body').html('');
				$('#point-sample-attribute').scrollTop(0);
				if (D_LAYER_STYLE.MODALS.global.search_offset == 0) {
					D_LAYER_STYLE.MODALS.searchPropertiesWithKeyword(D_LAYER_STYLE.global.dataId);
				} else {
					D_LAYER_STYLE.MODALS.searchPropertiesMoreWithKeyword(D_LAYER_STYLE.global.dataId);
				}

			});

			$("#label_sym_keyword").on('keyup', function(e) {
				D_LAYER_STYLE.MODALS.global.label_search_offset = 0;
				$('#label-sample-attribute-body').html('');
				$('#label-sample-attribute').scrollTop(0);
				if (D_LAYER_STYLE.MODALS.global.label_search_offset == 0) {
					D_LAYER_STYLE.LABEL.searchLabelPropertiesWithKeyword(D_LAYER_STYLE.global.dataId);
				} else {
					D_LAYER_STYLE.LABEL.searchLabelPropertiesMoreWithKeyword(D_LAYER_STYLE.global.dataId);
				}
			});

			$('#more_info').on('click',function(){
				$('#more_ifno_modal_title').text($("#point-symbol-attr-type option:selected").val());
				$('#label_columnInfo_modal').modal('show');
				
			});
			
			$('#symbol_field').on('click',function(){
				if($('#point-attribute-headers > .tr_active').length == 0){
					COMMON.alert('필드를 선택해주세요.','info',function(){return false;})
				}
				var td_text = $('#point-attribute-headers > .tr_active').find('td').text().trim();
				
				$("#expression_bulid_area").append(td_text);

				$("#rule-based-filter").val(
					$("#expression_bulid_area").text().trim()
				);
			})
			
			$('#label_field').on('click',function(){
				if($('#label-attribute-headers > .tr_active').length == 0){
					COMMON.alert('필드를 선택해주세요.','info',function(){return false;})
				}
				var td_text = $('#label-attribute-headers > .tr_active').find('td').text().trim()
			
				$("#expression_bulid_area_label").append(td_text);

				$("#rule-based-filter-modal").val(
					$("#expression_bulid_area_label").text().trim()
				);
			})
			
		},
		resetForm: function() {
			D_LAYER_STYLE.SYMBOL.initData();//포인트 단일 초기화
			D_LAYER_STYLE.SYMBOL.initData2();//포인트 규칙 초기화


			D_LAYER_STYLE.SYMBOL.initDataSimpleLine();//라인 초기화
			D_LAYER_STYLE.SYMBOL.initDataMarkerLine(); //라인 마커 초기화
			D_LAYER_STYLE.SYMBOL.initDataSimpleRuleLine(); //라인 심플 규칙 초기화
			D_LAYER_STYLE.SYMBOL.initDataMarkerRuleLine(); //라인 마커 규칙 초기화

			D_LAYER_STYLE.SYMBOL.initSimplePolygon();
			D_LAYER_STYLE.SYMBOL.initImagePolygon();
			D_LAYER_STYLE.SYMBOL.initImagePolygon2();
			D_LAYER_STYLE.SYMBOL.initSimplePolygon2();

			D_LAYER_STYLE.LABEL.initData3();//라벨
			D_LAYER_STYLE.LABEL.initData4();//라벨 규칙

			$('#rule-based-label').val("");
			$('#rule-based-filter').val("");

			$('#rule-based-labelinput-modal').val("");
			$('#rule-based-filter-modal').val("");

			$("#point-symbol-type2").val("0").trigger("change");
			$("#rule_line-symbol-type").val("0").trigger("change");
			$('#polygon-symbol-type2').val("0").trigger("change");


			$('.checkRules').prop('checked', false);
			$('.checkRules').attr('checked', false);

			$('#point-symbol-rule').val('0').trigger('change');
			$('#line-symbol-rule').val('0').trigger('change');
			$('#polygon-symbol-rule').val('0').trigger('change');
			$('#symbol-label-rule').val('0').trigger('change');

			$(".tr_active").removeClass("tr_active");


			if (!$('#calArea').hasClass('active')) {
				$('#calArea').addClass('active');
			}
			
			//모든 포인트,라인,폴리곤,라벨 규칙 초기화
			D_LAYER_STYLE.SYMBOL.global.point_ruleGroup = [];
			D_LAYER_STYLE.SYMBOL.global.line_ruleGroup = [];
			D_LAYER_STYLE.SYMBOL.global.polygon_ruleGroup = [];
			D_LAYER_STYLE.LABEL.global.label_ruleGroup = [];

			$('#showSymbolBtn').click();

		},
		createSymbolAttr: function(dataId) {
			var data_id = dataId;

			var url1 ="./geodt/getTableHead.do?DATAID=" + data_id;

			$.ajax({
				url: url1,
				type: "GET",
				dataType: "json",
				async: false,
				success: function(result) {
					if (result.rs == "success") {

						var hearders = result.HEADER;
						var headerNames = []; // 테이블 칼럼만 추출
						var tr_html = "";
						hearders.forEach((v, i) => {
							// headerNames.push(v.column_name);
							if (v.column_name !== 'gid' && v.column_name !== 'geom') {
								tr_html += '<tr class="tr_target">';
								tr_html += "<td>" + v.column_name + "</td>";
								tr_html += "</tr>";
							}
						});
						$("#point-attribute-headers").html("");
						$("#point-attribute-headers").append(tr_html);

						$(".tr_target").on("click", function() {
							$(this).addClass("tr_active");
							if ($(this).siblings().hasClass("tr_active")) {
								$(this).siblings().removeClass("tr_active");
							}
						});
					} else {
						COMMON.alert("네트워크문제로 정상적으로 \n데이터를 불러올 수 없습니다.", "error", function() { return false; });
					}
					$("#calArea").removeClass("active");
					$("#calArea").show();
				},
				fail: function(result) {

					COMMON.alert("네트워크 통신 중,문제가 발생하였습니다.", "error", function() { return false; });
				},
			});
		},
		createProperties: function(data_id, selected_attr) {
			var dataId = data_id;
			var selectedAttr = selected_attr;
			D_LAYER_STYLE.MODALS.global.selectedColumn = selectedAttr;
			var url1 ="./geodt/getProperties.do?DATAID=" +dataId +"&column=" +selected_attr;
			$.ajax({
				url: url1,
				type: "GET",
				dataType: "json",
				success: function(result) {
					if (result.rs == "success") {
						D_LAYER_STYLE.MODALS.global.offset = 20;
						var columns = result.PROPERTY;
						var colums_html = "";
						columns.forEach((v, i) => {
							colums_html += '<tr class="tr_target_value">';
							colums_html += "<td>" + v + "</td>";
							colums_html += "</tr>";
						});

						$("#point-sample-attribute-body").html("");
						$("#point-sample-attribute-body").append(colums_html);

						$(".tr_target_value").on("click", function() {
							var td_text = $(this).find("td").text().trim();

							$("#expression_bulid_area").append('\'' + td_text + '\'');

							$("#rule-based-filter").val(
								$("#expression_bulid_area").text().trim()
							);
						});
					} else {
						COMMON.alert("네트워크문제로 정상적으로 \n데이터를 불러올 수 없습니다.", "error", function() { return false; });

					}
				},
				fail: function(result) {
					COMMON.alert("네트워크 통신 중,문제가 발생하였습니다.", "error", function() { return false; });
				},
			});
		},
		createPropertiesMore: function(data_id, selected_attr) {
			var dataId = data_id;
			var selectedAttr = selected_attr;
			D_LAYER_STYLE.MODALS.global.selectedColumn = selectedAttr;
			var url1 =
				"./geodt/getPropertiesMore.do?DATAID=" +
				dataId +
				"&column=" +
				selected_attr +
				"&offset=" +
				D_LAYER_STYLE.MODALS.global.offset;
			$.ajax({
				url: url1,
				type: "GET",
				dataType: "json",
				async: false,
				success: function(result) {
					if (result.rs == "success") {

						var columns = result.PROPERTY;
						var colums_html = "";
						columns.forEach((v, i) => {
							colums_html += '<tr class="tr_target_value">';
							colums_html += "<td>" + v + "</td>";
							colums_html += "</tr>";
						});

						//$("#point-sample-attribute-body").html("");
						$("#point-sample-attribute-body").append(colums_html);

						$(".tr_target_value").off("click");
						$(".tr_target_value").on("click", function() {
							var td_text = $(this).find("td").text().trim();

							$("#expression_bulid_area").append('\'' + td_text + '\'');

							$("#rule-based-filter").val(
								$("#expression_bulid_area").text().trim()
							);
						});

						D_LAYER_STYLE.MODALS.global.offset += 20;
					} else {
						COMMON.alert("네트워크문제로 정상적으로 \n데이터를 불러올 수 없습니다.", "error", function() { return false; });

					}
				},
				fail: function(result) {
					COMMON.alert("네트워크 통신 중,문제가 발생하였습니다.", "error", function() { return false; });
				},
			});
		},
		createSampleProperties: function(data_id, selected_attr) {
			var dataId = data_id;
			var selectedAttr = selected_attr;
			D_LAYER_STYLE.MODALS.global.selectedColumn = selectedAttr;
			
			var url1 ="./geodt/getSampleProperties.do?DATAID=" +dataId +"&column=" +selected_attr;
			$.ajax({
				url: url1,
				type: "GET",
				dataType: "json",
				success: function(result) {
					if (result.rs == "success") {

						var columns = result.PROPERTY;
						var colums_html = "";
						
						columns.forEach((v, i) => {
							colums_html += '<tr class="tr_target_value">';
							colums_html += "<td>" + v + "</td>";
							colums_html += "</tr>";
						});

						$("#point-sample-attribute-body").html("");
						$("#point-sample-attribute-body").append(colums_html);

						$(".tr_target_value").on("click", function() {
							var td_text = $(this).find("td").text().trim();

							$("#expression_bulid_area").append('\'' + td_text + '\'');

							$("#rule-based-filter").val(
								$("#expression_bulid_area").text().trim()
							);
						});
					} else {
						COMMON.alert("네트워크문제로 정상적으로 \n데이터를 불러올 수 없습니다.", "error", function() { return false; });

					}
				},
				fail: function(result) {
					COMMON.alert("네트워크 통신 중,문제가 발생하였습니다.", "error", function() { return false; });
				},
			});
		},
		searchPropertiesWithKeyword: function(dataId) {
			var word = $('#sym_keyword').val();
			if (D_LAYER_STYLE.Util.isEmpty(word)) {// 키워드가 비어있으면 해당 선택된 칼럼 기본 데이터 부름
				$("#point-sample-attribute-body").html("");
				return false;
			}
			var attrName = $(".tr_active").children().text().trim();

			var url1 = "./geodt/searchInitProperty.do";

			var formData = new FormData;
			formData.append("dataId", dataId);
			formData.append("column", attrName);
			formData.append("word", word);

			$.ajax({
				url: url1,
				data: formData,
				type: "POST",
				dataType: "json",
				contentType: false,
				processData: false,
				success: function(result) {
					D_LAYER_STYLE.MODALS.global.search_offset = 50;
					var columns = [];

					result.PROPERTY.forEach(v => { columns.push(v[attrName]) });

					var colums_html = "";

					columns.forEach((v, i) => {
						colums_html += '<tr class="tr_target_value">';
						colums_html += "<td>" + v + "</td>";
						colums_html += "</tr>";
					});

					$("#point-sample-attribute-body").html("");
					$("#point-sample-attribute-body").append(colums_html);


					$(".tr_target_value").on("click", function() {
						var td_text = $(this).find("td").text().trim();

						$("#expression_bulid_area").append('\'' + td_text + '\'');

						$("#rule-based-filter").val(
							$("#expression_bulid_area").text().trim()
						);
					});


				},
				fail: function(result) {
					COMMON.alert("네트워크 통신 중,문제가 발생하였습니다.", "error", function() { return false; });
				},
			});
		},
		searchPropertiesMoreWithKeyword: function(dataId) {
			var word = $('#sym_keyword').val();
			if (D_LAYER_STYLE.Util.isEmpty(word)) {// 키워드가 비어있으면 해당 선택된 칼럼 기본 데이터 부름
				$("#point-sample-attribute-body").html("");
				return false;
			}
			var attrName = $(".tr_active").children().text().trim();


			var url1 = "./geodt/searchPropertyMore.do";

			var formData = new FormData;
			formData.append("dataId", dataId);
			formData.append("column", attrName);
			formData.append("word", word);
			formData.append("offset", D_LAYER_STYLE.MODALS.global.search_offset);

			$.ajax({
				url: url1,
				data: formData,
				type: "POST",
				dataType: "json",
				async: false,
				contentType: false,
				processData: false,
				success: function(result) {
					D_LAYER_STYLE.MODALS.global.search_offset += 50;
					var columns = [];

					result.PROPERTY.forEach(v => { columns.push(v[attrName]) });

					var colums_html = "";

					columns.forEach((v, i) => {
						colums_html += '<tr class="tr_target_value">';
						colums_html += "<td>" + v + "</td>";
						colums_html += "</tr>";
					});

					$("#point-sample-attribute-body").append(colums_html);
					
					$(".tr_target_value").off("click");
					$(".tr_target_value").on("click", function() {
						var td_text = $(this).find("td").text().trim();

						$("#expression_bulid_area").append('\'' + td_text + '\'');

						$("#rule-based-filter").val(
							$("#expression_bulid_area").text().trim()
						);
					});
				},
				fail: function(result) {
					COMMON.alert("네트워크 통신 중,문제가 발생하였습니다.", "error", function() { return false; });
				},
			});
		},
		setSymbolAttrFromList: function(rowId) {
			var selected_obj = null;
			if (D_LAYER_STYLE.global.dataType == "point" || D_LAYER_STYLE.global.dataType == "multipoint") {
				selected_obj = D_LAYER_STYLE.SYMBOL.global.point_ruleGroup.filter(
					(obj) => obj.id == rowId
				);
			} else if (D_LAYER_STYLE.global.dataType == "line" || D_LAYER_STYLE.global.dataType == "linestring" || D_LAYER_STYLE.global.dataType == "multilinestring") {
				selected_obj = D_LAYER_STYLE.SYMBOL.global.line_ruleGroup.filter(
					(obj) => obj.id == rowId
				);
			} else if (D_LAYER_STYLE.global.dataType == "polygon" || D_LAYER_STYLE.global.dataType == "multipolygon") {
				selected_obj = D_LAYER_STYLE.SYMBOL.global.polygon_ruleGroup.filter(
					(obj) => obj.id == rowId
				);
			}

			D_LAYER_STYLE.SYMBOL.setSavedSymbolStyle(selected_obj);
			$("#rule-based-modal").modal("show");
		},
		setLabelAttrFromList: function(rowId) {

			var selected_obj = D_LAYER_STYLE.LABEL.global.label_ruleGroup.filter(
				(obj) => obj.id == rowId
			);

			D_LAYER_STYLE.LABEL.setSavedLabelStyle(selected_obj);

		},
	},
	TEST: { // 쿼리를 입력해서 테스트함 --> 해당 쿼리는 지오서버에서 검증을 한번하고, SLDService클래스에서도 sld를 만들 때,메소드에의해 검증이됨.
		global: {
			layer: "",
			crs: "",
			bbox: "",
			filterStr: '"층수"= 20,',//테스트용
		},
		initTEST: function() {
			$("#filter_test").on("click", function() {
				COMMON.blockUIdiv('calArea', '계산중입니다...')
				D_LAYER_STYLE.TEST.testExpression();
				COMMON.unblockUIdiv('calArea')
			});

			$("#label_filter_test").on("click", function() {
				COMMON.blockUIdiv('label-calArea', '계산중입니다...')
				D_LAYER_STYLE.TEST.testLabelExpression();
				COMMON.unblockUIdiv('label-calArea')
			});
		},
		testExpression: function() {

			var filterStr = $("#rule-based-filter").val();
			var rv = null;
			var rs = "fail";
			var responseCode = null;
			var exceptionMsg = null;
			var response = null;
			var geoserver_url = "";

			var ecodedFilterStr = encodeURIComponent(filterStr); 
			// url인코딩에서 + 기호는 공백 문자를 나타내는데 사용된다.그래서 이를 피하기 위해서는 %2B로 치환해야 파싱이 정상적으된다.
			if (D_LAYER_STYLE.Util.isEmpty(ecodedFilterStr)) {
				COMMON.alert("Syntax Error:구문 오류", "error", function() { return false; });
				return false;
			} else {
				geoserver_url ="//" + dtcCom.geo_url() + "/" + D_LAYER_STYLE.global.dataStore + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + D_LAYER_STYLE.global.fullLayerName + "&maxFeatures=50&outputFormat=application%2Fjson&EXCEPTIONS=application/json&cql_filter=" + ecodedFilterStr;
			}

			$.ajax({
				url: geoserver_url,
				type: "GET",
				success: function(result) {
					rv = result;
					rs = "success";

					if (rv.hasOwnProperty("exceptions")) {
						rs = "exception";
						responseCode = rv.exceptions[0].code;
						exceptionMsg = "";//rv.exceptions[0].text;

						message = "";
						
						// noApplicableCode:사용할 수 없는 코드 ,
						// internalError : 내부 에러 ,
						// LayerNotDefined :레이어를 찾을 수 없음 ,
						// MissingOrInvalidParameter:파라미터를 찾을 수 없음
						// MissingBBox:바운더리박스를 찾을 수 없음

						if (responseCode === "noApplicableCode") {
							message = "사용할 수 없는 코드\n";
						} else if (responseCode === "internalError") {
							message = "내부 에러";
						} else if (responseCode === "LayerNotDefined") {
							message = "레이어를 찾을 수 없습니다.";
						} else if (responseCode === "MissingOrInvalidParameter") {
							message = "파라미터를 찾을 수 없습니다.";
						} else if (responseCode === "MissingBBox") {
							message = "바운더리 박스를 찾을 수 없습니다.";
						} else if (responseCode === "InvalidParameterValue") {
							message = "파라미터 값에 문제가 발생하였습니다.";
						}
						COMMON.alertFilter(message + "\n" + exceptionMsg, "error", function() { return false; });  
					} else {
						COMMON.confirm(
							"해당 식이 사용가능합니다.",
							"해당식을 만족하는 " +
							result.numberMatched +
							"개의 객체(피처)를 확인하였습니다.\n사용가능한 식입니다. 사용하시겠습니까?",
							"question",
							function() { //ok 클릭시 실행 함수
								$("#rule-based-filter").val("");
								$("#rule-based-filter").val(filterStr);
							},
							function() { //cancel 클릭시 실행 함수
								 $("#rule-based-filter").val("").trigger("change"); 
							}
						)
						return true;
					}
				},
				fail: function(result) {
					COMMON.alert("네트워크 통신 중,문제가 발생하였습니다.", "error", function() { return false; });
				},
			});
		},
		testLabelExpression: function() {
			var layerName = "";
			var storeName = "";

			var filterStr = $("#rule-based-filter-modal").val();
			var rv = null;
			var rs = "fail";
			var responseCode = null;
			var exceptionMsg = null;
			var response = null;
			var geoserver_url = "";

			var ecodedFilterStr = encodeURIComponent(filterStr); // url인코딩에서 + 기호는 공백
			// 문자를 나타내는데 사용된다.
			// 그래서 이를 피하기 위해서는
			// %2B로 치환해야 파싱이
			// 정상적으된다.

			if (D_LAYER_STYLE.Util.isEmpty(ecodedFilterStr)) {
				// geoserver_url="https://xxxx.go.kr/smap_sld_test/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=smap_sld_test%3Abuilding_solarenergy_classfication_2018&maxFeatures=50&outputFormat=application%2Fjson&EXCEPTIONS=application/json";
				COMMON.alert("Syntax Error:구문 오류", "error", function() { return false; });
				return false;
			} else {
				// url=
				// "https://xxxxx.go.kr/wms?LAYERS=smap_sld_test:building_solarenergy_classfication_2018&CRS=EPSG:4326&SRS=EPSG:4326&SERVICE=WMS&REQUEST=getMap&FORMAT=image/png&VERSION=1.1.0&WIDTH=256&HEIGHT=256&BBOX=126.76244215857291,37.42406851630339,127.18745392841008,37.69635770138422&EXCEPTIONS=application/json&cql_filter="+filterStr;
				geoserver_url =
					// "https://xxxxxx.eseoul.go.kr/newlayer3165/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=newlayer3165:user_shp_newlayer3165_1671764884400&maxFeatures=50&outputFormat=application%2Fjson&EXCEPTIONS=application/json&cql_filter="+ecodedFilterStr;
					"//" + dtcCom.geo_url() + "/" + D_LAYER_STYLE.global.dataStore + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + D_LAYER_STYLE.global.fullLayerName + "&maxFeatures=50&outputFormat=application%2Fjson&EXCEPTIONS=application/json&cql_filter=" + ecodedFilterStr;

			}

			$.ajax({
				url: geoserver_url,
				type: "GET",
				success: function(result) {

					rv = result;
					rs = "success";

					if (rv.hasOwnProperty("exceptions")) {

						rs = "exception";
						responseCode = rv.exceptions[0].code;
						exceptionMsg = "";//rv.exceptions[0].text;

						message = "";

						if (responseCode === "noApplicableCode") {
							message = "사용할 수 없는 코드\n";
						} else if (responseCode === "internalError") {
							message = "내부 에러";
						} else if (responseCode === "LayerNotDefined") {
							message = "레이어를 찾을 수 없습니다.";
						} else if (responseCode === "MissingOrInvalidParameter") {
							message = "파라미터를 찾을 수 없습니다.";
						} else if (responseCode === "MissingBBox") {
							message = "바운더리 박스를 찾을 수 없습니다.";
						} else if (responseCode === "InvalidParameterValue") {
							message = "파라미터 값에 문제가 발생하였습니다.";
						}
						COMMON.alertFilter(message + "\n" + exceptionMsg, "error", function() { return false; }); // noApplicableCode:사용할
						// 수 없는
						// 코드 ,
						// internalError
						// : 내부
						// 에러 ,
						// LayerNotDefined
						// :레이어를
						// 찾을 수
						// 없음 ,
						// MissingOrInvalidParameter:파라미터를
						// 찾을 수
						// 없음
						// ,MissingBBox:바운더리박스를
						// 찾을 수
						// 없음
					} else {
						COMMON.confirm(
							"해당 식이 사용가능합니다.",
							"해당식을 만족하는" +
							result.numberMatched +
							"개의 객체(피처)를 확인하였습니다.\n사용가능한 식입니다. 사용하시겠습니까?",
							"question",
							function() {
								$("#rule-based-filter").val("");
								$("#rule-based-filter").val(filterStr);
							},//ok
							function() { $("#rule-based-filter").val("").trigger("change"); }//cancel.
						)

						return true;
					}
				},
				fail: function(result) {

					COMMON.alert("네트워크 통신 중,문제가 발생하였습니다.", "error", function() { return false; });
				},
			});
		},
		checkExpressionBeforeSave: function() {
			var layerName = "";
			var storeName = "";

			var filterStr = $("#rule-based-filter").val();
			var rv = null;
			var rs = "fail";
			var responseCode = null;
			var exceptionMsg = null;
			var response = null;
			var geoserver_url = "";
			var flag = false;

			var ecodedFilterStr = encodeURIComponent(filterStr); // url인코딩에서 + 기호는 공백
			// 문자를 나타내는데 사용된다.
			// 그래서 이를 피하기 위해서는
			// %2B로 치환해야 파싱이
			// 정상적으된다.

			if (D_LAYER_STYLE.Util.isEmpty(ecodedFilterStr)) {
				// geoserver_url="https://xxxxxgo.kr/smap_sld_test/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=smap_sld_test%3Abuilding_solarenergy_classfication_2018&maxFeatures=50&outputFormat=application%2Fjson&EXCEPTIONS=application/json";
				COMMON.alert("Syntax Error:구문 오류", 'error', function() { return false; });
				return false;

			} else {
				// url=
				// "https://xxxxxgo.kr/wms?LAYERS=smap_sld_test:building_solarenergy_classfication_2018&CRS=EPSG:4326&SRS=EPSG:4326&SERVICE=WMS&REQUEST=getMap&FORMAT=image/png&VERSION=1.1.0&WIDTH=256&HEIGHT=256&BBOX=126.76244215857291,37.42406851630339,127.18745392841008,37.69635770138422&EXCEPTIONS=application/json&cql_filter="+filterStr;
				geoserver_url =
					// "https://xxxxxgo.kr/newlayer3165/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=newlayer3165:user_shp_newlayer3165_1671764884400&maxFeatures=50&outputFormat=application%2Fjson&EXCEPTIONS=application/json&cql_filter="+ecodedFilterStr;
					"//" + dtcCom.geo_url() + "/" + D_LAYER_STYLE.global.dataStore + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + D_LAYER_STYLE.global.fullLayerName + "&maxFeatures=50&outputFormat=application%2Fjson&EXCEPTIONS=application/json&cql_filter=" + ecodedFilterStr;

			}

			$.ajax({
				url: geoserver_url,
				type: "GET",
				async: false,
				success: function(result) {

					rv = result;
					rs = "success";

					if (rv.hasOwnProperty("exceptions")) {
						flag = false;
					} else {
						flag = true;
					}

					if (D_LAYER_STYLE.SYMBOL.global.elseFlag) {
						flag = true;
					}
				},
				fail: function(result) {

					COMMON.alert("네트워크 통신 중,문제가 발생하였습니다.", 'error', function() {

					});
					flag = false;
				}
			});


			return flag;
		},
		checkLabelExpressionBeforeSave: function() {
			var layerName = "";
			var storeName = "";

			var filterStr = $("#rule-based-filter-modal").val();
			var rv = null;
			var rs = "fail";
			var responseCode = null;
			var exceptionMsg = null;
			var response = null;
			var geoserver_url = "";
			var flag = false;

			var ecodedFilterStr = encodeURIComponent(filterStr); // url인코딩에서 + 기호는 공백
			// 문자를 나타내는데 사용된다.
			// 그래서 이를 피하기 위해서는
			// %2B로 치환해야 파싱이
			// 정상적으된다.

			if (D_LAYER_STYLE.Util.isEmpty(ecodedFilterStr)) {
				// geoserver_url="https://xxxxxgo.kr/smap_sld_test/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=smap_sld_test%3Abuilding_solarenergy_classfication_2018&maxFeatures=50&outputFormat=application%2Fjson&EXCEPTIONS=application/json";
				COMMON.alert("Syntax Error:구문 오류", 'error', function() { return false; });
				return false;

			} else {
				// url=
				// "https://xxxxxgo.kr/wms?LAYERS=smap_sld_test:building_solarenergy_classfication_2018&CRS=EPSG:4326&SRS=EPSG:4326&SERVICE=WMS&REQUEST=getMap&FORMAT=image/png&VERSION=1.1.0&WIDTH=256&HEIGHT=256&BBOX=126.76244215857291,37.42406851630339,127.18745392841008,37.69635770138422&EXCEPTIONS=application/json&cql_filter="+filterStr;
				geoserver_url =
					// "https://xxxxxgo.kr/newlayer3165/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=newlayer3165:user_shp_newlayer3165_1671764884400&maxFeatures=50&outputFormat=application%2Fjson&EXCEPTIONS=application/json&cql_filter="+ecodedFilterStr;
					"//" + dtcCom.geo_url() + "/" + D_LAYER_STYLE.global.dataStore + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + D_LAYER_STYLE.global.fullLayerName + "&maxFeatures=50&outputFormat=application%2Fjson&EXCEPTIONS=application/json&cql_filter=" + ecodedFilterStr;

			}

			$.ajax({
				url: geoserver_url,
				type: "GET",
				async: false,
				success: function(result) {

					rv = result;
					rs = "success";

					if (rv.hasOwnProperty("exceptions")) {
						flag = false;
					} else {
						flag = true;
					}

					if (D_LAYER_STYLE.LABEL.global.elseFlag) {
						flag = true;
					}
				},
				fail: function(result) {

					COMMON.alert("네트워크 통신 중,문제가 발생하였습니다.", 'error', function() {

					});
					flag = false;
				}
			});


			return flag;
		}
	},
	SYMBOL: {
		global: {
			point_ruleGroup: [],
			line_ruleGroup: [],
			polygon_ruleGroup: [],
			symbolCnt: 0,
			symbolUpdateFlag: false,
			clickedSymbolId: null,
			elseFlag: false,
			tempFilterText:""
		},
		SHP: {
			global: {
				shpType: "",
			},
			initSHP: function() {
				D_LAYER_STYLE.SYMBOL.initPoint();
				D_LAYER_STYLE.SYMBOL.initLine();
				D_LAYER_STYLE.SYMBOL.initPolygon();
			},
			showLegend:function(dataId){
				$.ajax({
					url: './geodt/getStylesInfo.do',
					type: 'POST',
					data: { "dataId": dataId },
					dataType: 'json',
					success: function(resultStyle) {
						if(resultStyle.RS == "EXIST"){

							var html = '<table class="table table-hover">';
							html += '<colgroup>';
							html += '<col width="15%">';
							html += '<col width="5%">';
							html += '<col width="25%">';
							html += '<col width="30%">';
							html += '<col width="20%">';
							html += '</colgroup>';
							html += '<tbody>'+resultStyle.RULES.SYMBOLRULES+'</tbody>';
							html += '</table>';
                            $("#sbImgLgBdList").empty();
                            $("#sbImgLgBdList").append(html);
							$("#sbImgLgBdList td:nth-child(1),#sbImgLgBdList td:nth-child(4),#sbImgLgBdList td:nth-child(5)").remove();
							var html = "";
							$("#sbImgLgBdList tr").each(function(i,data){
								html+="<div class=\"row pl-3 pr-2\">\n";
								html+="<div style=\"margin-top:3px\">\n";
	                            html+=$($(data).children()[0]).html();
	                            html+="</div>"
	                            html+="     <label for=\"sb_cL_indx_"+i+"\" style=\"font-size: 13px;\" class=\"pl-2\">"+$(data).children()[1].innerText+"</label>\n";
	                            html+="</div>"
							})
                            $("#sbImgLgBdList").empty();
                            $("#sbImgLgBdList").append(html);
                            $("#sbLgImgView").show();
						}
					}
				})
			},
			setStyle: function(dataId) {
				D_LAYER_STYLE.global.dataId = dataId;

				$.ajax({
					url: './ide/callLayerInfo.do',
					type: 'POST',
					data: {
						dataId: D_LAYER_STYLE.global.dataId
					},
					dataType: 'json',
					success: function(result) {
						//resetStyleForm();
						//$("#shpStyleName").text(result.INFO.data_name);
						if (result.INFO.data_type == "S") {

							var shape_type = result.INFO.shape_type.toLowerCase();
							D_LAYER_STYLE.global.dataType = shape_type;
							D_LAYER_STYLE.global.dataStore = result.INFO.shp_layer_fullname.split(':')[0];
							D_LAYER_STYLE.global.fullLayerName = result.INFO.shp_layer_fullname;
							D_LAYER_STYLE.SYMBOL.SHP.selectSHP(D_LAYER_STYLE.global.dataType);//shp파일 타입에 따른 뷰 전환

							D_LAYER_STYLE.SYMBOL.SHP.callSavedStyle(D_LAYER_STYLE.global.dataId, function(result) {
								if (result.RS == 'EXIST') {
									if (result.RULES.SYMBOLRULESFLAG == "1") { //심볼 규칙기반이 있는 경우
										if (D_LAYER_STYLE.global.dataType == 'point' || D_LAYER_STYLE.global.dataType == 'multipoint') {
											$('#point-symbol-rule').val('1').trigger('change');
											D_LAYER_STYLE.SYMBOL.global.point_ruleGroup = JSON.parse(result.RULES.SYMBOLGROUP);
											
											$('#rule-box').html('');
											$('#rule-box').append(result.RULES.SYMBOLRULES);
											$('#rule-box tr').each(function(i,data){
											    var num = $(data).children().length;
											    var html = "";
											    if(num == 4){//디폴트,버튼 둘다 없는 경우
											        html += '<td class="defaultString"></td>';
													html += '<td><button class="buttonString btn-success" style="border-radius: 0.25rem; line-height: 1.1rem; font-size: 12px; width: 40px;">설정</button></td>';
											    }else if(num == 5){//버튼만 없는 경우
											        html += '<td><button class="buttonString btn-success" style="border-radius: 0.25rem; line-height: 1.1rem; font-size: 12px; width: 40px;">설정</button></td>';
											    }
											    $(data).append(html)
											})
											D_LAYER_STYLE.SYMBOL.global.symbolCnt = D_LAYER_STYLE.SYMBOL.setSavedSymbolStyleCnt();
										} else if (D_LAYER_STYLE.global.dataType == 'line' || D_LAYER_STYLE.global.dataType == 'linestring' || D_LAYER_STYLE.global.dataType == 'multilinestring') {
											$('#line-symbol-rule').val('1').trigger('change');
											D_LAYER_STYLE.SYMBOL.global.line_ruleGroup = JSON.parse(result.RULES.SYMBOLGROUP);
											
											$('#line-rule-box').html('');
											$('#line-rule-box').append(result.RULES.SYMBOLRULES);
											$('#line-rule-box tr').each(function(i,data){
											    var num = $(data).children().length;
											    var html = "";
											    if(num == 4){
											        html += '<td class="defaultString"></td>';
													html += '<td><button class="buttonString btn-success" style="border-radius: 0.25rem; line-height: 1.1rem; font-size: 12px; width: 40px;">설정</button></td>';
											    }else if(num == 5){
											        html += '<td><button class="buttonString btn-success" style="border-radius: 0.25rem; line-height: 1.1rem; font-size: 12px; width: 40px;">설정</button></td>';
											    }
											    $(data).append(html)
											})
											D_LAYER_STYLE.SYMBOL.global.symbolCnt = D_LAYER_STYLE.SYMBOL.setSavedSymbolStyleCnt();
										} else if (D_LAYER_STYLE.global.dataType == 'polygon' || D_LAYER_STYLE.global.dataType == 'multipolygon') {
											$('#polygon-symbol-rule').val('1').trigger('change');
											D_LAYER_STYLE.SYMBOL.global.polygon_ruleGroup = JSON.parse(result.RULES.SYMBOLGROUP);
											
											$('#polygon-rule-box').html('');
											$('#polygon-rule-box').append(result.RULES.SYMBOLRULES);
											$('#polygon-rule-box tr').each(function(i,data){
											    var num = $(data).children().length;
											    var html = "";
											    if(num == 4){
											        html += '<td class="defaultString"></td>';
													html += '<td><button class="buttonString btn-success" style="border-radius: 0.25rem; line-height: 1.1rem; font-size: 12px; width: 40px;">설정</button></td>';
											    }else if(num == 5){
											        html += '<td><button class="buttonString btn-success" style="border-radius: 0.25rem; line-height: 1.1rem; font-size: 12px; width: 40px;">설정</button></td>';
											    }
											    $(data).append(html)
											})
											D_LAYER_STYLE.SYMBOL.global.symbolCnt = D_LAYER_STYLE.SYMBOL.setSavedSymbolStyleCnt();
										}

										$(".buttonString").on("click", function() {
											//
											var rowId = $(this).parent().parent().children(":first").find("input")[0].id
			
									
											D_LAYER_STYLE.SYMBOL.global.clickedSymbolId = rowId;
											D_LAYER_STYLE.SYMBOL.global.symbolUpdateFlag = true;

											D_LAYER_STYLE.MODALS.setSymbolAttrFromList(rowId);
										});
										$('input[name="added-rule-group"]').on('change', function() {
											if ($(this).is(':checked')) {
												$(this).attr('checked', true);
											} else {
												$(this).attr('checked', false);
											}
										});

									} else {//단일 규칙기반인 경우
										if (D_LAYER_STYLE.global.dataType == 'point' || D_LAYER_STYLE.global.dataType == 'multipoint') {
											$('#point-symbol-rule').val('0').trigger('change');
											D_LAYER_STYLE.SYMBOL.global.point_ruleGroup = JSON.parse(result.RULES.SYMBOLGROUP);

											if (D_LAYER_STYLE.SYMBOL.global.point_ruleGroup[0].marker == '0') {//심플 포인트
												$('#point-symbol-type').val('0').trigger('change');
												D_LAYER_STYLE.SYMBOL.global.point_ruleGroup = JSON.parse(result.RULES.SYMBOLGROUP);

												$('#simple-marker-type').val(D_LAYER_STYLE.SYMBOL.global.point_ruleGroup[0].simpleMarker).trigger('change');
												$('#simpleMarkerSize').val(D_LAYER_STYLE.SYMBOL.global.point_ruleGroup[0].size).trigger('change');
												$('#simpleMarkerColor').val(D_LAYER_STYLE.SYMBOL.global.point_ruleGroup[0].color).trigger('change');
												$('#simpleMarkerOulineWidth').val(D_LAYER_STYLE.SYMBOL.global.point_ruleGroup[0].outlineWidth).trigger('change');
												$('#simpleMarkerOutlineColor').val(D_LAYER_STYLE.SYMBOL.global.point_ruleGroup[0].outlineColor).trigger('change');

												D_LAYER_STYLE.SLIDER.global.slider
													.data("ionRangeSlider")
													.update({ from: parseInt(D_LAYER_STYLE.SYMBOL.global.point_ruleGroup[0].opacity) });

												$('#dialInnerValue').val(D_LAYER_STYLE.SYMBOL.global.point_ruleGroup[0].rotation).trigger('change');
											} else {//이미지 포인트
												$('#point-symbol-type').val('1').trigger('change');
											}

										} else if (D_LAYER_STYLE.global.dataType == 'line' || D_LAYER_STYLE.global.dataType == 'linestring' || D_LAYER_STYLE.global.dataType == 'multilinestring') {
											$('#line-symbol-rule').val('0').trigger('change');
											D_LAYER_STYLE.SYMBOL.global.line_ruleGroup = JSON.parse(result.RULES.SYMBOLGROUP);

											if (D_LAYER_STYLE.SYMBOL.global.line_ruleGroup[0].marker == '2') {//심플 라인
												$('#line-symbol-type').val('0').trigger('change');
												$('#lineStrokeDasharray').val(D_LAYER_STYLE.SYMBOL.global.line_ruleGroup[0].lineType).trigger('change');
												$('#lineStrokeWidth').val(D_LAYER_STYLE.SYMBOL.global.line_ruleGroup[0].lineStrokeWidth).trigger('change');
												$('#lineStrokeColor').val(D_LAYER_STYLE.SYMBOL.global.line_ruleGroup[0].lineColor).trigger('change');

												D_LAYER_STYLE.SLIDER.global.slider5
													.data("ionRangeSlider")
													.update({ from: parseInt(D_LAYER_STYLE.SYMBOL.global.line_ruleGroup[0].opacity) });

												$('#lineOffSet').val(D_LAYER_STYLE.SYMBOL.global.line_ruleGroup[0].lineOffset).trigger('change');
											} else {//마커라인
												$('#line-symbol-type').val('1').trigger('change');
											}

										} else if (D_LAYER_STYLE.global.dataType == 'polygon' || D_LAYER_STYLE.global.dataType == 'multipolygon') {
											$('#polygon-symbol-rule').val('0').trigger('change');
											D_LAYER_STYLE.SYMBOL.global.polygon_ruleGroup = JSON.parse(result.RULES.SYMBOLGROUP);

											if (D_LAYER_STYLE.SYMBOL.global.polygon_ruleGroup[0].marker == '5') {//심플 폴리곤
												$('#polygon-symbol-type').val('0').trigger('change');
												$('#polygonDasharray').val(D_LAYER_STYLE.SYMBOL.global.polygon_ruleGroup[0].lineType).trigger('change');
												$('#polygonStrokeWidth').val(D_LAYER_STYLE.SYMBOL.global.polygon_ruleGroup[0].lineWidth).trigger('change');
												$('#polygonStrokeColor').val(D_LAYER_STYLE.SYMBOL.global.polygon_ruleGroup[0].lineColor).trigger('change');
												$('#polygonFillColor').val(D_LAYER_STYLE.SYMBOL.global.polygon_ruleGroup[0].fillColor).trigger('change');
												D_LAYER_STYLE.SLIDER.global.slider7
													.data("ionRangeSlider")
													.update({ from: parseInt(D_LAYER_STYLE.SYMBOL.global.polygon_ruleGroup[0].opacity) });
											} else {//이미지 폴리곤
												$('#polygon-symbol-type').val('1').trigger('change');
											}

										}
									}

									if (result.RULES.LABELRULESFLAG == "1") { //심볼 라벨기반이 있는 경우
										$('#symbol-label-rule').val('2').trigger('change');
										D_LAYER_STYLE.LABEL.global.label_ruleGroup = JSON.parse(result.RULES.LABELGROUP);
										$('#label-rule-box').html();
										$('#label-rule-box').append(result.RULES.LABELRULES);
										$('#label-rule-box tr').each(function(i,data){
											    var num = $(data).children().length;
											    var html = "";
											    if(num == 4){//라벨의 디폴트,버튼 둘다 없는 경우
											        html += '<td class="defaultLabelString" align="center"></td>';
													html += '<td><button class="buttonLabelString btn-success" style="border-radius: 0.25rem;line-height: 1.1rem;font-size: 12px;width: 40px;">설정</button></td>';
											    }else if(num == 5){//버튼만 없는 경우
											        html += '<td><button class="buttonLabelString btn-success" style="border-radius: 0.25rem;line-height: 1.1rem;font-size: 12px;width: 40px;">설정</button></td>';
											    }
											    $(data).append(html)
										})
										D_LAYER_STYLE.LABEL.global.labelCnt = D_LAYER_STYLE.LABEL.setSavedLabelStyleCnt();

										$(".buttonLabelString").on("click", function() {
											//
											var rowId = $(this).parent().parent().children(":first").find("input")[0].id
				
									
											D_LAYER_STYLE.LABEL.global.clickedLabelId = rowId;
											D_LAYER_STYLE.LABEL.global.labelUpdateFlag = true;
											$("#rule-based-label-modal").modal("show");

											D_LAYER_STYLE.MODALS.setLabelAttrFromList(rowId);
										});

										$('input[name="added-rule-label-group"]').on('change', function() {
											if ($(this).is(':checked')) {
												$(this).attr('checked', true);
											} else {
												$(this).attr('checked', false);
											}
										});
									} else if (result.RULES.LABELRULESFLAG == "0") {//단일 라벨

										D_LAYER_STYLE.LABEL.global.label_ruleGroup = JSON.parse(result.RULES.LABELGROUP);
										if (D_LAYER_STYLE.LABEL.global.label_ruleGroup.length == 1) {
											$('#symbol-label-rule').val('1').trigger('change'); //단일라벨
											D_LAYER_STYLE.LABEL.global.label_ruleGroup = JSON.parse(result.RULES.LABELGROUP);
											$('#point-symbol-attr-type').val(D_LAYER_STYLE.LABEL.global.label_ruleGroup[0].attribute).trigger('change');
											$('#point-label-fontFamily').val(D_LAYER_STYLE.LABEL.global.label_ruleGroup[0].fontFamily).trigger('change');
											$('#simpleMarkerLabelTextSize').val(D_LAYER_STYLE.LABEL.global.label_ruleGroup[0].fontSize).trigger('change');
											$('#simpleMarkerColor3').val(D_LAYER_STYLE.LABEL.global.label_ruleGroup[0].color).trigger('change');
											$('#simpleLabelXaxis').val(D_LAYER_STYLE.LABEL.global.label_ruleGroup[0].Xoffset).trigger('change');
											$('#simpleLabelYaxis').val(D_LAYER_STYLE.LABEL.global.label_ruleGroup[0].Yoffset).trigger('change');
											$('#halo').val(D_LAYER_STYLE.LABEL.global.label_ruleGroup[0].buffer).trigger('change');
											$('#simpleLabelBufferColor').val(D_LAYER_STYLE.LABEL.global.label_ruleGroup[0].bufferColor).trigger('change');
											D_LAYER_STYLE.SLIDER.global.slider3
												.data("ionRangeSlider")
												.update({ from: parseInt(D_LAYER_STYLE.LABEL.global.label_ruleGroup[0].opacity) });
											$('#dialInnerValue3').val(D_LAYER_STYLE.LABEL.global.label_ruleGroup[0].rotation).trigger('change');
										} else {
											$('#symbol-label-rule').val('0').trigger('change');//라벨없음
											D_LAYER_STYLE.LABEL.global.label_ruleGroup = JSON.parse(result.RULES.LABELGROUP);
										}
									}

									$('#showSymbolBtn').click();
								}
								else { //nodata 스타일이 없는 경우

									D_LAYER_STYLE.MODALS.resetForm();
									D_LAYER_STYLE.SYMBOL.SHP.selectSHP(D_LAYER_STYLE.global.dataType);//shp파일 타입에 따른 뷰 전환
									$('#showSymbolBtn').click();
								}
							});

							$('#exampleModalCenter').modal('show');
							//$("#shpStyleDid").val(did);


						}
					}
				})
			},
			callSavedStyle: function(dataId, callback) {

				$.ajax({
					url: './geodt/getStylesInfo.do',
					type: 'POST',
					data: { "dataId": dataId },
					dataType: 'json',
					success: function(resultStyle) {

						callback(resultStyle);

					}
				})
			},
			selectSHP: function(shpType) {
				if (shpType == "point" || shpType == "multipoint") {
					$(".pointArea").show();
					$(".lineArea").hide();
					$(".polygonArea").hide();

				} else if (shpType == "line" || shpType == "linestring" || shpType == "multilinestring") {
					$(".pointArea").hide();
					$(".lineArea").show();
					$(".polygonArea").hide();
				} else if (shpType == "polygon" || shpType == "multipolygon") {
					$(".pointArea").hide();
					$(".lineArea").hide();
					$(".polygonArea").show();
				}

				D_LAYER_STYLE.SYMBOL.SHP.global.shpType = shpType;
			},
			POINT: {},
			LINE: {
				getLinePreview: function() {
					var line_symbol_type = $("#line-symbol-type option:selected").val();
					// 단순라인
					var selected_dash = $("#lineStrokeDasharray option:selected").val();
					var stroke_width = $("#lineStrokeWidth").val();
					var stroke_color = $("#lineStrokeColor").val();
					var line_offset = $("#lineOffSet").val();
					var stroke_opacity = D_LAYER_STYLE.SLIDER.global.slider5;
					// 마커라인
					var line_marker_type = $(
						"#simple-marker-line-type option:selected"
					).val();
					var markFontSize = $("#simpleLineMarkerSize").val();
					var marker_outline_color = $("#lineStrokeOutlineColor").val();
					var markerOffset = $("#lineMarkerOffset").val();
					var rotation = $(".knob-example5 input").val();

					var lineMarkerOutlineColor = $("#lineStrokeOutlineColor").val();
					var lineMarkerOutlineWidth =
						$("#lineMarkerOutlineWitdh").val() + "px";

					if (line_symbol_type === "0") {
						// 단순라인

						if (selected_dash === "0") {
							// 실선
							$("#strokePreview").css(
								"border-top",
								stroke_width + "px solid " + stroke_color
							);
							$("#strokePreview").css("margin-bottom", line_offset + "px");
							$("#strokePreview").css("opacity", stroke_opacity);
						} else if (selected_dash === "1") {
							// 쇄선
							$("#strokePreview").css(
								"border-top",
								stroke_width + "px dashed " + stroke_color
							);
							$("#strokePreview").css("margin-bottom", line_offset + "px");
							$("#strokePreview").css("opacity", stroke_opacity);
						} else if (selected_dash === "2") {
							// 점선
							$("#strokePreview").css(
								"border-top",
								stroke_width + "px dotted " + stroke_color
							);
							$("#strokePreview").css("margin-bottom", line_offset + "px");
							$("#strokePreview").css("opacity", stroke_opacity);
						} else if (selected_dash === "3") {
							// 팬없음
							$("#strokePreview").css(
								"border-top",
								stroke_width + "px solid transparent"
							);
							$("#strokePreview").css("margin-bottom", line_offset + "px");
							$("#strokePreview").css("opacity", stroke_opacity);
						}
					} else if (line_symbol_type === "1") {
						// 마커라인

						switch (line_marker_type) {
							case "circle":
								$("#linePreview").text("●●●●●●●●●●●●●●●●●●●●●●●●●");
								$("#linePreview").css("font-size", markFontSize + "px");
								$("#linePreview").css("color", stroke_color);
								$("#linePreview").css("letter-spacing", markerOffset + "px");
								$("#linePreview").css(
									"-webkit-text-stroke",
									lineMarkerOutlineWidth + " " + lineMarkerOutlineColor
								);

								break;
							case "star":
								$("#linePreview").text("★★★★★★★★★★★★★★★★★★");
								$("#linePreview").css("font-size", markFontSize + "px");
								$("#linePreview").css("color", stroke_color);
								$("#linePreview").css("letter-spacing", markerOffset + "px");
								$("#linePreview").css(
									"-webkit-text-stroke",
									lineMarkerOutlineWidth + " " + lineMarkerOutlineColor
								);
								break;
							case "diamond":
								$("#linePreview").text("◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆");
								$("#linePreview").css("font-size", markFontSize + "px");
								$("#linePreview").css("color", stroke_color);
								$("#linePreview").css("letter-spacing", markerOffset + "px");
								$("#linePreview").css(
									"-webkit-text-stroke",
									lineMarkerOutlineWidth + " " + lineMarkerOutlineColor
								);
								break;

							case "square":
								$("#linePreview").css("font-size", markFontSize + "px");
								$("#linePreview").text("■■■■■■■■■■■■■■■■■■■■■■■■■■");
								$("#linePreview").css("color", stroke_color);
								$("#linePreview").css("letter-spacing", markerOffset + "px");
								$("#linePreview").css(
									"-webkit-text-stroke",
									lineMarkerOutlineWidth + " " + lineMarkerOutlineColor
								);
								break;
							case "triangle":
								$("#linePreview").css("font-size", markFontSize + "px");
								$("#linePreview").text("▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲");
								$("#linePreview").css("color", stroke_color);
								$("#linePreview").css("letter-spacing", markerOffset + "px");
								$("#linePreview").css(
									"-webkit-text-stroke",
									lineMarkerOutlineWidth + " " + lineMarkerOutlineColor
								);

								break;
						}
					}
				},
				getLineRulePreview: function() {
					var line_symbol_type = $("#rule_line-symbol-type option:selected").val();
					// 단순라인
					var selected_dash = $("#rule_lineStrokeDasharray option:selected").val();
					var stroke_width = $("#rule_lineStrokeWidth").val();
					var stroke_color = $("#rule_lineStrokeColor").val();
					var line_offset = $("#rule_lineOffSet").val();
					var stroke_opacity = D_LAYER_STYLE.SLIDER.global.slider5;
					// 마커라인
					var line_marker_type = $(
						"#rule_simple-marker-line-type option:selected"
					).val();
					var markFontSize = $("#rule_simpleLineMarkerSize").val();
					var marker_outline_color = $("#rule_lineStrokeOutlineColor").val();
					var markerOffset = $("#rule_lineMarkerOffset").val();
					// var rotation = $(".knob-example5 input").val();

					var lineMarkerOutlineColor = $("#rule_lineStrokeOutlineColor").val();
					var lineMarkerOutlineWidth =
						$("#rule_lineMarkerOutlineWitdh").val() + "px";

					if (line_symbol_type === "0") {
						// 단순라인

						if (selected_dash === "0") {
							// 실선
							$("#rule_strokePreview").css(
								"border-top",
								stroke_width + "px solid " + stroke_color
							);
							$("#rule_strokePreview").css("margin-bottom", line_offset + "px");
							$("#rule_strokePreview").css("opacity", stroke_opacity);
						} else if (selected_dash === "1") {
							// 쇄선
							$("#rule_strokePreview").css(
								"border-top",
								stroke_width + "px dashed " + stroke_color
							);
							$("#rule_strokePreview").css("margin-bottom", line_offset + "px");
							$("#rule_strokePreview").css("opacity", stroke_opacity);
						} else if (selected_dash === "2") {
							// 점선
							$("#rule_strokePreview").css(
								"border-top",
								stroke_width + "px dotted " + stroke_color
							);
							$("#rule_strokePreview").css("margin-bottom", line_offset + "px");
							$("#rule_strokePreview").css("opacity", stroke_opacity);
						} else if (selected_dash === "3") {
							// 팬없음
							$("#rule_strokePreview").css(
								"border-top",
								stroke_width + "px solid transparent"
							);
							$("#rule_strokePreview").css("margin-bottom", line_offset + "px");
							$("#rule_strokePreview").css("opacity", stroke_opacity);
						}
					} else if (line_symbol_type === "1") {
						// 마커라인

						switch (line_marker_type) {
							case "circle":
								$("#rule_linePreview").text("●●●●●●●●●●●●●●●●●●●●●●●●●");
								$("#rule_linePreview").css("font-size", markFontSize + "px");
								$("#rule_linePreview").css("color", stroke_color);
								$("#rule_linePreview").css("letter-spacing", markerOffset + "px");
								$("#rule_linePreview").css(
									"-webkit-text-stroke",
									lineMarkerOutlineWidth + " " + lineMarkerOutlineColor
								);

								break;
							case "star":
								$("#rule_linePreview").text("★★★★★★★★★★★★★★★★★★");
								$("#rule_linePreview").css("font-size", markFontSize + "px");
								$("#rule_linePreview").css("color", stroke_color);
								$("#rule_linePreview").css("letter-spacing", markerOffset + "px");
								$("#rule_linePreview").css(
									"-webkit-text-stroke",
									lineMarkerOutlineWidth + " " + lineMarkerOutlineColor
								);
								break;
							case "diamond":
								$("#rule_linePreview").text("◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆");
								$("#rule_linePreview").css("font-size", markFontSize + "px");
								$("#rule_linePreview").css("color", stroke_color);
								$("#rule_linePreview").css("letter-spacing", markerOffset + "px");
								$("#rule_linePreview").css(
									"-webkit-text-stroke",
									lineMarkerOutlineWidth + " " + lineMarkerOutlineColor
								);
								break;

							case "square":
								$("#rule_linePreview").css("font-size", markFontSize + "px");
								$("#rule_linePreview").text("■■■■■■■■■■■■■■■■■■■■■■■■■■");
								$("#rule_linePreview").css("color", stroke_color);
								$("#rule_linePreview").css("letter-spacing", markerOffset + "px");
								$("#rule_linePreview").css(
									"-webkit-text-stroke",
									lineMarkerOutlineWidth + " " + lineMarkerOutlineColor
								);
								break;
							case "triangle":
								$("#rule_linePreview").css("font-size", markFontSize + "px");
								$("#rule_linePreview").text("▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲");
								$("#rule_linePreview").css("color", stroke_color);
								$("#rule_linePreview").css("letter-spacing", markerOffset + "px");
								$("#rule_linePreview").css(
									"-webkit-text-stroke",
									lineMarkerOutlineWidth + " " + lineMarkerOutlineColor
								);

								break;
						}
					}
				},
			},
			POLYGON: {
				getPolygonPreview: function() {
					var pol_symbol_type = $("#polygon-symbol-type option:selected").val();
					// 단순라인
					var selected_polgyon_dash = $("#polygonDasharray option:selected").val();
					var stroke_width = $("#polygonStrokeWidth").val();
					var stroke_color = $("#polygonStrokeColor").val();
					var fillColor = $("#polygonFillColor").val();
					var opacity = D_LAYER_STYLE.SLIDER.global.simpleMakerSliderValue7;
					// 마커라인
					var r = parseInt(fillColor.substr(1, 2), 16);
					var g = parseInt(fillColor.substr(3, 2), 16);
					var b = parseInt(fillColor.substr(5, 2), 16);
					// var a = 100 - opacity;
					var a = opacity;

					var offsetX = $('#polygonImageOffsetX').val();
					var offsetY = $('#polygonImageOffsetY').val();

					if (pol_symbol_type === "0") { // 단순 폴리곤
						if (selected_polgyon_dash === "0") {
							// 실선
							$('#polygonPreview').css('border', stroke_width + 'px solid' + ' ' + stroke_color);

							$("#polygonPreview").css("background", "rgb(" + r + " " + g + " " + b + " / " + a + "%)");
						} else if (selected_polgyon_dash === "1") {
							// 쇄선
							$('#polygonPreview').css('border', stroke_width + 'px dashed' + ' ' + stroke_color);

							$("#polygonPreview").css("background", "rgb(" + r + " " + g + " " + b + " / " + a + "%)");
						} else if (selected_polgyon_dash === "2") {
							// 점선
							$('#polygonPreview').css('border', stroke_width + 'px dotted' + ' ' + stroke_color);

							$("#polygonPreview").css("background", "rgb(" + r + " " + g + " " + b + " / " + a + "%)");
						} else if (selected_polgyon_dash === "3") {
							// 팬없음
							$('#polygonPreview').css('border', stroke_width + 'px solid transparent');

							$("#polygonPreview").css("background", "rgb(" + r + " " + g + " " + b + " / " + a + "%)");
						}
					} else if (pol_symbol_type === "1") {
						// 이미지 폴리곤

						$('#imgMarker3').css('margin-left', offsetX + 'px');
						$('#imgMarker3').css('margin-bottom', offsetY + 'px');

					}
				},
				getPolygonRulePreview: function() {
					var pol_symbol_type = $("#polygon-symbol-type2 option:selected").val();
					// 단순라인
					var selected_polgyon_dash = $("#polygonDasharray2 option:selected").val();
					var stroke_width = $("#polygonStrokeWidth2").val();
					var stroke_color = $("#polygonStrokeColor2").val();
					var fillColor = $("#polygonFillColor2").val();
					var opacity = D_LAYER_STYLE.SLIDER.global.simpleMakerSliderValue8;
					// 마커라인
					var r = parseInt(fillColor.substr(1, 2), 16);
					var g = parseInt(fillColor.substr(3, 2), 16);
					var b = parseInt(fillColor.substr(5, 2), 16);
					// var a = 100 - opacity;
					var a = opacity;

					if (pol_symbol_type === "0") { // 단순 폴리곤
						if (selected_polgyon_dash === "0") {
							// 실선
							$('#polygonPreview2').css('border', stroke_width + 'px solid' + ' ' + stroke_color);

							$("#polygonPreview2").css("background", "rgb(" + r + " " + g + " " + b + " / " + a + "%)");
						} else if (selected_polgyon_dash === "1") {
							// 쇄선
							$('#polygonPreview2').css('border', stroke_width + 'px dashed' + ' ' + stroke_color);

							$("#polygonPreview2").css("background", "rgb(" + r + " " + g + " " + b + " / " + a + "%)");
						} else if (selected_polgyon_dash === "2") {
							// 점선
							$('#polygonPreview2').css('border', stroke_width + 'px dotted' + ' ' + stroke_color);

							$("#polygonPreview2").css("background", "rgb(" + r + " " + g + " " + b + " / " + a + "%)");
						} else if (selected_polgyon_dash === "3") {
							// 팬없음
							$('#polygonPreview2').css('border', stroke_width + 'px solid transparent');

							$("#polygonPreview2").css("background", "rgb(" + r + " " + g + " " + b + " / " + a + "%)");
						}
					} else if (pol_symbol_type === "1") {
						// 이미지 폴리곤
						var offsetX = $('#polygonImageOffsetX2').val();
						var offsetY = $('#polygonImageOffsetY2').val();
						$('#imgMarker4').css('margin-left', offsetX + 'px');
						$('#imgMarker4').css('margin-bottom', offsetY + 'px');

					}
				}
			},
		},
		initPoint: function() {
			// 포인트 심볼 레이어 유형 이미지로 바뀔 시 파일 첨부 추가
			$("#point-symbol-type").on("change", function() {
				var cloneImgPreview = null;
				if ($(this).val() === "0") {
					$(".point-image-group").hide();
					$(".point-simple-group").show();

					D_LAYER_STYLE.SYMBOL.initData();
				} else if ($(this).val() === "1") {
					$(".point-image-group").show();
					$(".point-simple-group").hide();
					D_LAYER_STYLE.SYMBOL.initData();
					$("#pointPreview").text("");
				}
			});

			// 규칙기반 심볼레이어 설정
			$("#point-symbol-type2").on("change", function() {
				if ($(this).val() === "0") {
					$(".point-image-group2").hide();
					$(".point-simple-group2").show();

					D_LAYER_STYLE.SYMBOL.initData2("2");
				} else if ($(this).val() === "1") {
					$(".point-image-group2").show();
					$(".point-simple-group2").hide();

					D_LAYER_STYLE.SYMBOL.initData2("2");
					$("#pointPreview2").text("");
				}
			});
			// 심볼 화면
			// 포인트 단일심볼,규칙기반
			$("#point-symbol-rule").on("change", function() {

				if ($(this).val() === "0") {
					$(".one-symbol").show(); // 단일 심볼 보이기
					$(".rule-based-symbol").hide(); // 규칙기반 심볼 숨기기
					D_LAYER_STYLE.SYMBOL.initData2();
					D_LAYER_STYLE.SYMBOL.global.point_ruleGroup = [];
				} else {
					D_LAYER_STYLE.SYMBOL.initData();
					$(".rule-based-symbol").show();
					$(".one-symbol").hide();
					D_LAYER_STYLE.SYMBOL.global.point_ruleGroup = [];
				}
			});

			// 포인트 심플 마커 지정
			$("#simple-marker-type").on("change", function() {
				var value = $(this).val();

				switch (value) {
					case "circle":
						$("#pointPreview").text("●");
						break;
					case "star":
						$("#pointPreview").text("★");
						break;
					case "diamond":
						$("#pointPreview").text("◆");
						break;

					case "square":
						$("#pointPreview").text("■");
						break;
					case "triangle":
						$("#pointPreview").text("▲");
						break;
				}
			});

			// 규칙기반 포인트 심볼 심플 마커 지정
			$("#simple-marker-type2").on("change", function() {
				var value = $(this).val();

				switch (value) {
					case "circle":
						$("#pointPreview2").text("●");
						break;
					case "star":
						$("#pointPreview2").text("★");
						break;
					case "diamond":
						$("#pointPreview2").text("◆");
						break;

					case "square":
						$("#pointPreview2").text("■");
						break;
					case "triangle":
						$("#pointPreview2").text("▲");
						break;
				}
			});

			// 포인터 심플 마커 크기
			$("#simpleMarkerSize").on("change", function() {
				var maxSize = 130;
				var size = $(this).val();
				if (maxSize < size) {
					size = maxSize;
					COMMON.alert("최대 심볼 사이즈는 130px입니다.", "error", function() { $("#simpleMarkerSize").val(size); });
				}
				$("#pointPreview").css("font-size", size + "px");
			});

			$("#simpleMarkerColor").on("change", function() {
				var color = $(this).val();
				$("#pointPreview").css("color", color);
			});

			$("#simpleMarkerOutlineColor,#simpleMarkerOulineWidth").on(
				"change",
				function() {
					var outlineColor = $("#simpleMarkerOutlineColor").val();
					var outlineWidth = $("#simpleMarkerOulineWidth").val() + "px";

					$("#pointPreview").css(
						"-webkit-text-stroke",
						outlineWidth + " " + outlineColor
					);
				}
			);

			// 규칙기반 - 포인터 심플 마커 크기
			$("#simpleMarkerSize2").on("change", function() {
				var maxSize = 130;
				var size = $(this).val();
				if (maxSize < size) {
					size = maxSize;
					COMMON.alert("최대 심볼 사이즈는 130px입니다.", 'error', function() { $("#simpleMarkerSize2").val(size); });
				}
				$("#pointPreview2").css("font-size", size + "px");
			});

			$("#simpleMarkerColor2").on("change", function() {
				
				var color = $(this).val();
				$("#pointPreview2").css("color", color);
				
			});

			$("#simpleMarkerOutlineColor2,#simpleMarkerOulineWidth2").on("change",function() {
					var outlineColor = $("#simpleMarkerOutlineColor2").val();
					var outlineWidth = $("#simpleMarkerOulineWidth2").val() + "px";

					$("#pointPreview2").css(
						"-webkit-text-stroke",
						outlineWidth + " " + outlineColor
					);
				}
			);

			$("#saveRuleBtn").on("click", function() {
				if ($("#showSymbolBtn").hasClass("active")) {
					// 심볼 속성 선택중

					// 라벨,필터 인풋 널 공백 체크
					var labelName = $("#rule-based-label").val();
					var filter = $("#rule-based-filter").val();
					var filterDefault = $("[name='setFilterDefaultRadio']:checked").val();

					if (D_LAYER_STYLE.Util.isEmpty(labelName)) {
						COMMON.alert("라벨을 입력해주세요", 'error', function() {
							$("#rule-based-label").focus();
						});
						return false;
					} else if (filterDefault == "filter" && D_LAYER_STYLE.Util.isEmpty(filter)) {
						COMMON.alert("필터를 입력해주세요", "error", function() {
							$("#rule-based-filter").focus();
						});
						return false;
					}
					var check_result = true;
					if (filterDefault == "filter") {
						check_result = D_LAYER_STYLE.TEST.checkExpressionBeforeSave();// 저장전에 규칙이 사용가능한지 체크(동기)
					}
					if (check_result == false) {
						COMMON.alert('유효하지 않은 식입니다.\n 다시 입력해주세요.', "error", function() {
							$('#rule-based-filter').focus();
						});
						return false;
					}
					if(D_LAYER_STYLE.SYMBOL.checkSymbolDefaultExist()){
						if($("[name='setFilterDefaultRadio']:checked").val()==="default"?true:false){
							COMMON.alert('디폴트 설정은 \n 한 개만 설정이 가능합니다.', "error", function() {
								$('[name = "setFilterDefaultRadio"]').focus();
							});
							return false;	
						}
					}
					
					if (D_LAYER_STYLE.global.dataType == "point" || D_LAYER_STYLE.global.dataType == "multipoint") { // 포인트인 경우
						if ($("#point-symbol-type2").val() === "1") {
							// 이미지 마커인데 이미지 파일이 비어있으면
							if (D_LAYER_STYLE.Util.isEmpty(D_LAYER_STYLE.FILE.global.symbol_img_file)) {
								
							}
						}

						var html = "";
						var labelName = $("#rule-based-label").val();
						var rule = $("#rule-based-filter").val();
						var defaultCheck = $("[name='setFilterDefaultRadio']:checked").val() == "filter" ? "" : '<span class="d-block" style="border: 3px solid #fff;width: 14px;height: 14px;border-radius: 10px;"></span>';

						var pointSymbolText = "";

						// 심볼레이어 유형
						var pointSymbolType = $("#point-symbol-type2 option:selected").val();

						if (pointSymbolType == "0") {
							// 단순 마커
							var pointViewHtml = $("#pointPreview2").clone(true);
							pointViewHtml = pointViewHtml[0];

							pointViewHtml.style.fontSize = "14px";
							pointViewHtml.id = "pointPreview2RuleId";
							pointViewHtml.style.transform = 'rotate(' + $('#dialInnerValue2').val() + 'deg)';
							pointViewHtml.style.display = 'block';
							pointViewHtml.classList.value = '';
							pointSymbolText = pointViewHtml.outerHTML;
						} else if (pointSymbolType == "1") {
							// 이미지 마커
							var pointImgViewHtml = $("#imgMarker2").clone(true);
							pointImgViewHtml = pointImgViewHtml[0];

							pointImgViewHtml.id = "pointImgPreview2RuleId";

							var img_width = $("#imgMarker2").width(); // 이미지 가로
							var img_height = $("#imgMarker2").height(); // 이미지 세로

							var maxSize = 14;
							// 이미지 마커 리사이징
							if (img_width > img_height) {
								if (img_width > maxSize) {
									img_height *= maxSize / img_width;
									img_width = maxSize;

									if (img_height > maxSize) {
										img_width *= maxSize / img_height;
										img_height = maxSize;
									}
								}
							} else {
								if (img_height > maxSize) {
									img_width *= maxSize / img_height;
									img_height = maxSize;

									if (img_width > maxSize) {
										img_height *= maxSize / img_width;
										img_width = maxSize;
									}
								}
							}
							pointImgViewHtml.style.width = img_width + "px";
							pointImgViewHtml.style.height = img_height + "px";

							pointSymbolText = pointImgViewHtml.outerHTML;
						}

						if (D_LAYER_STYLE.SYMBOL.global.symbolUpdateFlag) {
							// 만약 추가된 규칙의 로우를 수정할려고 할 경우

							var clickedRowId = D_LAYER_STYLE.SYMBOL.global.clickedSymbolId;

							D_LAYER_STYLE.SYMBOL.global.point_ruleGroup.forEach(
								(obj, index) => {
									if (obj.id === clickedRowId) {
										if ($("#point-symbol-type2").val() == "0") {//포인트 심플 마커인 경우
											D_LAYER_STYLE.SYMBOL.global.point_ruleGroup[index].marker =$("#point-symbol-type2").val();
											D_LAYER_STYLE.SYMBOL.global.point_ruleGroup[index].labelName = $("#rule-based-label").val();
											D_LAYER_STYLE.SYMBOL.global.point_ruleGroup[index].simpleMarker = $("#simple-marker-type2 option:selected").val();

											D_LAYER_STYLE.SYMBOL.global.point_ruleGroup[index].filter =$("#rule-based-filter").val();
											D_LAYER_STYLE.SYMBOL.global.point_ruleGroup[index].size =$("#simpleMarkerSize2").val();

											D_LAYER_STYLE.SYMBOL.global.point_ruleGroup[index].color =$("#simpleMarkerColor2").val();
											D_LAYER_STYLE.SYMBOL.global.point_ruleGroup[index].outlineWidth = $("#simpleMarkerOulineWidth2").val();
											D_LAYER_STYLE.SYMBOL.global.point_ruleGroup[index].outlineColor = $("#simpleMarkerOutlineColor2").val();
											D_LAYER_STYLE.SYMBOL.global.point_ruleGroup[index].opacity =D_LAYER_STYLE.SLIDER.global.simpleMakerSliderValue2;
											D_LAYER_STYLE.SYMBOL.global.point_ruleGroup[index].rotation = $("#dialInnerValue2").val();
											
											var filterFlag = $("[name='setFilterDefaultRadio']:checked").val()==="filter"?"0":"1";//0필터,1디폴트
											
											D_LAYER_STYLE.SYMBOL.global.point_ruleGroup[index].defaultFlag = filterFlag;

										} else if ($("#point-symbol-type2").val() == "1") { //포인트 이미지 마커인 경우
											D_LAYER_STYLE.SYMBOL.global.point_ruleGroup[index].marker =$("#point-symbol-type2").val();
											D_LAYER_STYLE.SYMBOL.global.point_ruleGroup[index].labelName = $("#rule-based-label").val();

											D_LAYER_STYLE.SYMBOL.global.point_ruleGroup[index].filter =$("#rule-based-filter").val();

											D_LAYER_STYLE.SYMBOL.global.point_ruleGroup[index].imageWidth = $('#simpleImgMarkerWidth2').val();
											D_LAYER_STYLE.SYMBOL.global.point_ruleGroup[index].imageHeight = $('#simpleImgMarkerHeight2').val();

											D_LAYER_STYLE.SYMBOL.global.point_ruleGroup[index].color =$("#simpleMarkerColor2").val();
											D_LAYER_STYLE.SYMBOL.global.point_ruleGroup[index].opacity =D_LAYER_STYLE.SLIDER.global.simpleMakerSliderValue2;
											D_LAYER_STYLE.SYMBOL.global.point_ruleGroup[index].rotation = $("#dialInnerValue2").val();
											D_LAYER_STYLE.SYMBOL.global.point_ruleGroup[index].imageFileName =$("#imageFile").val() != null? $("#imageFile").val(): "";
											D_LAYER_STYLE.SYMBOL.global.point_ruleGroup[index].imageFileFormat =$("#imageFile").val().split(".")[1] != null? $("#imageFile").val().split(".")[1]: "";

											D_LAYER_STYLE.SYMBOL.global.point_ruleGroup[index].imageFilePath = D_LAYER_STYLE.FILE.global.upoloaded_img_file_path;
											
											var filterFlag = $("[name='setFilterDefaultRadio']:checked").val()==="filter"?"0":"1";//0필터,1디폴트
											
											D_LAYER_STYLE.SYMBOL.global.point_ruleGroup[index].defaultFlag = filterFlag;
	
											// 이미지 마커
											var pointImgViewHtml = $("#imgMarker2").clone(true);
											pointImgViewHtml = pointImgViewHtml[0];

											pointImgViewHtml.id = "pointImgPreview2RuleId";

											var img_width = $("#imgMarker2").width(); // 이미지 가로
											var img_height = $("#imgMarker2").height(); // 이미지 세로

											var maxSize = 14;
											// 이미지 마커 리사이징
											if (img_width > img_height) {
												if (img_width > maxSize) {
													img_height *= maxSize / img_width;
													img_width = maxSize;

													if (img_height > maxSize) {
														img_width *= maxSize / img_height;
														img_height = maxSize;
													}
												}
											} else {
												if (img_height > maxSize) {
													img_width *= maxSize / img_height;
													img_height = maxSize;

													if (img_width > maxSize) {
														img_height *= maxSize / img_width;
														img_width = maxSize;
													}
												}
											}
											pointImgViewHtml.style.width = img_width + "px";
											pointImgViewHtml.style.height = img_height + "px";

											pointSymbolText = pointImgViewHtml.outerHTML;

										}

										$("#" + clickedRowId).parent().siblings()[0].innerHTML = pointSymbolText;
										$("#" + clickedRowId).parent().siblings()[1].innerHTML = labelName;
										$("#" + clickedRowId).parent().siblings()[2].innerHTML = rule;
										$("#" + clickedRowId).parent().siblings()[3].innerHTML = defaultCheck;

									}
								}
							);

							D_LAYER_STYLE.SYMBOL.global.symbolUpdateFlag = false;
						} else {
							// 규칙을 신규로

							html += '<tr class="added-rule-row">';
							html +='<td><input id ="symbolrow_' +D_LAYER_STYLE.SYMBOL.global.symbolCnt +'" type="checkbox" name="added-rule-group" checked="checked"></td>';
							html += "<td>" + pointSymbolText + "</td>";
							html += "<td class=\"labelName\">" + labelName + "</td>";
							html += "<td class=\"ruleString\">" + rule + "</td>";
							html += "<td class=\"defaultString\" align=\"center\">" + defaultCheck + "</td>";
							html += "<td><Button class=\"buttonString btn-success\" style=\"border-radius: 0.25rem;line-height: 1.1rem;font-size: 12px;width: 40px;\">설정</Button></td>";
							html += "</tr>";

							$("#rule-box").append(html);
							// append한 후에,이벤트를 걸어줘야함							
							
							$(".buttonString").on("click", function() {
								//
								var rowId = $(this).parent().parent().children(":first").find("input")[0].id

								D_LAYER_STYLE.SYMBOL.global.clickedSymbolId = rowId;
								D_LAYER_STYLE.SYMBOL.global.symbolUpdateFlag = true;

								D_LAYER_STYLE.MODALS.setSymbolAttrFromList(rowId);
							});

							if ($("#point-symbol-type2").val() == "0") {
								let point_ruleObj = {
									id: "",
									marker: 0, // 0 : 단순마커, 1 : 이미지 마커 = > 전부 px 단위
									labelName: "", // 라벨명
									filter: "", // 필터
									simpleMarker: "", // 마커유형 심플마커
									size: "",
									color: "",
									outlineWidth: "",
									outlineColor: "",
									opacity: "",
									rotation: "",
									imageWidth: "",
									imageHeight: "",
									imageFileName: "",
									imageFileFormat: "",
									imageFilePath: "",
									elseFlag: "false",
									defaultFlag:""
								};

								// 단순 마커
								point_ruleObj.marker = 0;
								point_ruleObj.id =
									"symbolrow_" + D_LAYER_STYLE.SYMBOL.global.symbolCnt;
								point_ruleObj.labelName = $("#rule-based-label").val();
								point_ruleObj.simpleMarker = $(
									"#simple-marker-type2 option:selected"
								).val();
								point_ruleObj.filter = $("#rule-based-filter").val();
								point_ruleObj.size = $("#simpleMarkerSize2").val();
								point_ruleObj.color = $("#simpleMarkerColor2").val();
								point_ruleObj.outlineWidth = $("#simpleMarkerOulineWidth2").val();
								point_ruleObj.outlineColor = $(
									"#simpleMarkerOutlineColor2"
								).val();
								point_ruleObj.opacity =
									D_LAYER_STYLE.SLIDER.global.simpleMakerSliderValue2;
								point_ruleObj.rotation = $("#dialInnerValue2").val();
								
								point_ruleObj.defaultFlag = $("[name='setFilterDefaultRadio']:checked").val()==="filter"?"0":"1";//0필터,1디폴트

								D_LAYER_STYLE.SYMBOL.global.point_ruleGroup.push(point_ruleObj);
							} else if ($("#point-symbol-type2").val() == "1") {
								let point_ruleObj = {
									id: "",
									marker: 0, // 0 : 단순마커, 1 : 이미지 마커 = > 전부 px 단위
									labelName: "", // 라벨명
									filter: "", // 필터
									simpleMarker: "", // 마커유형 심플마커
									size: "",
									color: "",
									outlineWidth: "",
									outlineColor: "",
									opacity: "",
									rotation: "",
									imageWidth: "",
									imageHeight: "",
									imageFileName: "",
									imageFileFormat: "",
									imageFilePath: "",
									elseFlag: "false",
									defaultFlag:""
								};
								// 이미지 마커
								point_ruleObj.marker = 1;
								point_ruleObj.id ="symbolrow_" + D_LAYER_STYLE.SYMBOL.global.symbolCnt;
								point_ruleObj.labelName = $("#rule-based-label").val();
								point_ruleObj.filter = $("#rule-based-filter").val();
								point_ruleObj.size = $("#simpleMarkerSize2").val();
								point_ruleObj.color = $("#simpleMarkerColor2").val();
								point_ruleObj.opacity =D_LAYER_STYLE.SLIDER.global.simpleMakerSliderValue2;
								point_ruleObj.rotation = $("#dialInnerValue2").val();
								point_ruleObj.imageFileName = $("#imageFile2").val() != null ? $("#imageFile2").val() : "";
								point_ruleObj.imageFileFormat = $("#imageFile2").val().split(".")[1] != null ? $("#imageFile2").val().split(".")[1] : "";
								point_ruleObj.imageWidth = $('#simpleImgMarkerWidth2').val();
								point_ruleObj.imageHeight = $('#simpleImgMarkerHeight2').val();
								point_ruleObj.imageFilePath = D_LAYER_STYLE.FILE.global.upoloaded_img_file_path;
								point_ruleObj.defaultFlag = $("[name='setFilterDefaultRadio']:checked").val()==="filter"?"0":"1";//0필터,1디폴트
								
								D_LAYER_STYLE.SYMBOL.global.point_ruleGroup.push(point_ruleObj);
							}

							D_LAYER_STYLE.SYMBOL.initData2(); // 포인트 규칙기반 모달 초기화
							D_LAYER_STYLE.SYMBOL.global.symbolUpdateFlag = false;
						}
					} else if (D_LAYER_STYLE.global.dataType == "line" || D_LAYER_STYLE.global.dataType == "linestring" || D_LAYER_STYLE.global.dataType == "multilinestring") {

						var html = "";
						var labelName = $("#rule-based-label").val();
						var rule = $("#rule-based-filter").val();
						var defaultCheck = $("[name='setFilterDefaultRadio']:checked").val() == "filter" ? "" : '<span class="d-block" style="border: 3px solid #fff;width: 14px;height: 14px;border-radius: 10px;"></span>';

						var lineSymbolText = "";

						// 심볼레이어 유형
						var lineSymbolType = $("#rule_line-symbol-type option:selected").val();

						if (lineSymbolType == "0") {
							// 단순 라인
							var strokeViewHtml = $("#rule_strokePreview").clone(true);
							strokeViewHtml = strokeViewHtml[0];

							strokeViewHtml.id = "linePreview2RuleId";
							strokeViewHtml.style.width = "40px"
							strokeViewHtml.style.marginTop = "8px";

							var borderTopWidth = "1px";
							var borderTopType = strokeViewHtml.style.borderTop.split(' ')[1];
							var borderTopColor1 = strokeViewHtml.style.borderTop.split(' ')[2];
							var borderTopColor2 = strokeViewHtml.style.borderTop.split(' ')[3];
							var borderTopColor3 = strokeViewHtml.style.borderTop.split(' ')[4];

							strokeViewHtml.style.borderTop = borderTopWidth + " " + borderTopType + " " + borderTopColor1 + borderTopColor2 + borderTopColor3;

							lineSymbolText = strokeViewHtml.outerHTML;

						} else if (lineSymbolType == "1") {
							// 마커 라인
							var lineMarkerViewHtml = $("#rule_linePreview").clone(true);
							lineMarkerViewHtml = lineMarkerViewHtml[0];

							lineMarkerViewHtml.id = "lineMarkerPreview2RuleId";
							lineMarkerViewHtml.style.width = "40px"
							lineMarkerViewHtml.style.fontSize = "1px";
							lineMarkerViewHtml.style.letterSpacing = "1px";

							lineSymbolText = lineMarkerViewHtml.outerHTML;
						}

						if (D_LAYER_STYLE.SYMBOL.global.symbolUpdateFlag) { //추가된 규칙의 로우를 수정할려고 할 경우
							

							var clickedRowId = D_LAYER_STYLE.SYMBOL.global.clickedSymbolId;

							D_LAYER_STYLE.SYMBOL.global.line_ruleGroup.forEach((obj, index) => {
									if (obj.id === clickedRowId) {
										if ($("#rule_line-symbol-type").val() == "0") { //단일 
											// 단일 심플 라인
											D_LAYER_STYLE.SYMBOL.global.line_ruleGroup[index].marker = 2;
											D_LAYER_STYLE.SYMBOL.global.line_ruleGroup[index].labelName = $("#rule-based-label").val();
											D_LAYER_STYLE.SYMBOL.global.line_ruleGroup[index].simpleMarker = '';

											D_LAYER_STYLE.SYMBOL.global.line_ruleGroup[index].filter = $("#rule-based-filter").val();
											D_LAYER_STYLE.SYMBOL.global.line_ruleGroup[index].lineType = $("#rule_lineStrokeDasharray option:selected").val();

											D_LAYER_STYLE.SYMBOL.global.line_ruleGroup[index].lineStrokeWidth = $("#rule_lineStrokeWidth").val();
											D_LAYER_STYLE.SYMBOL.global.line_ruleGroup[index].lineColor = $("#rule_lineStrokeColor").val();
											D_LAYER_STYLE.SYMBOL.global.line_ruleGroup[index].lineOffset = $("#rule_lineOffSet").val();
											D_LAYER_STYLE.SYMBOL.global.line_ruleGroup[index].opacity = D_LAYER_STYLE.SLIDER.global.simpleMakerSliderValue6;
											D_LAYER_STYLE.SYMBOL.global.line_ruleGroup[index].defaultFlag = $("[name='setFilterDefaultRadio']:checked").val()==="filter"?"0":"1";//0필터,1디폴트

										} else if ($("#rule_line-symbol-type").val() == "1") {// 마커라인
											// 마커라인

											let simple_line_obj = {
												id: "",
												marker: 0, // 0 : 단순마커, 1 : 이미지 마커 = > 전부 px 단위
												labelName: "", // 라벨명
												filter: "", // 필터
												simpleMarker: "", // 마커유형 심플마커
												lineType: "",
												lineStrokeWidth: "",
												lineOffset: "",
												opacity: "",
												lineColor: "",
												markerSize: "",
												lineMarkerOffSet: "",
												outlineWidth: "",
												outlineColor: "",
												defaultFlag:""
											};

											D_LAYER_STYLE.SYMBOL.global.line_ruleGroup[index].marker = 3;
											D_LAYER_STYLE.SYMBOL.global.line_ruleGroup[index].simpleMarker = $('#rule_simple-marker-line-type option:selected').val();
											D_LAYER_STYLE.SYMBOL.global.line_ruleGroup[index].markerSize = $('#rule_simpleLineMarkerSize').val();
											D_LAYER_STYLE.SYMBOL.global.line_ruleGroup[index].lineColor = $("#rule_lineStrokeColor").val();
											D_LAYER_STYLE.SYMBOL.global.line_ruleGroup[index].opacity = D_LAYER_STYLE.SLIDER.global.simpleMakerSliderValue6;
											D_LAYER_STYLE.SYMBOL.global.line_ruleGroup[index].lineMarkerOffSet = $("#rule_lineMarkerOffset").val();
											D_LAYER_STYLE.SYMBOL.global.line_ruleGroup[index].outlineWidth = $("#rule_lineMarkerOutlineWitdh").val();
											D_LAYER_STYLE.SYMBOL.global.line_ruleGroup[index].outlineColor = $("#rule_lineStrokeOutlineColor").val();
											D_LAYER_STYLE.SYMBOL.global.line_ruleGroup[index].defaultFlag = $("[name='setFilterDefaultRadio']:checked").val()==="filter"?"0":"1";//0필터,1디폴트


											// 라인 마커
											var lineMarkerViewHtml = $("#rule_linePreview").clone(true);
											lineMarkerViewHtml = lineMarkerViewHtml[0];

											lineMarkerViewHtml.id = "lineMarkerPreview2RuleId";
											lineMarkerViewHtml.style.width = "40px"
											lineMarkerViewHtml.style.fontSize = "1px";
											lineMarkerViewHtml.style.letterSpacing = "1px";

											lineSymbolText = lineMarkerViewHtml.outerHTML;

										}

										$("#" + clickedRowId).parent().siblings()[0].innerHTML = lineSymbolText;
										$("#" + clickedRowId).parent().siblings()[1].innerHTML = labelName;
										$("#" + clickedRowId).parent().siblings()[2].innerHTML = rule;
										$("#" + clickedRowId).parent().siblings()[3].innerHTML = defaultCheck;

									}
								}
							);

							D_LAYER_STYLE.SYMBOL.global.symbolUpdateFlag = false;
							
						} else { // 규칙을 신규로 추가하는 경우 
							
							html += '<tr class="added-rule-row">';
							html +='<td><input id ="symbolrow_' +D_LAYER_STYLE.SYMBOL.global.symbolCnt +'" type="checkbox" name="added-rule-group" checked="checked"></td>';
							html += "<td style=\"max-width:40px; overflow:hidden;display:flex;align-items:center;\">" + lineSymbolText + "</td>";
							html += "<td class=\"labelName\">" + labelName + "</td>";
							html += "<td class=\"ruleString\">" + rule + "</td>";
							html += "<td class=\"defaultString\" align=\"center\">" + defaultCheck + "</td>";
							html += "<td><Button class=\"buttonString btn-success\" style=\"border-radius: 0.25rem;line-height: 1.1rem;font-size: 12px;width: 40px;\">설정</Button></td>";
							
							html += "</tr>";

							$("#line-rule-box").append(html);
							// append한 후에,이벤트를 걸어줘야함
							
							$(".buttonString").on("click", function() {
								var rowId = $(this).parent().parent().children(":first").find("input")[0].id

								D_LAYER_STYLE.SYMBOL.global.clickedSymbolId = rowId;
								D_LAYER_STYLE.SYMBOL.global.symbolUpdateFlag = true;

								D_LAYER_STYLE.MODALS.setSymbolAttrFromList(rowId);
							});

							if ($("#rule_line-symbol-type").val() == "0") {
								let simple_line_obj = {
									id: "",
									marker: 0, // 0 : 단순마커, 1 : 이미지 마커 = > 전부 px 단위
									labelName: "", // 라벨명
									filter: "", // 필터
									simpleMarker: "", // 마커유형 심플마커
									lineType: "",
									lineStrokeWidth: "",
									lineOffset: "",
									opacity: "",
									lineColor: "",
									markerSize: "",
									lineMarkerOffSet: "",
									outlineWidth: "",
									outlineColor: "",
									elseFlag: "false",
									defaultFlag:""
								};

								// 단순 마커
								simple_line_obj.marker = 2;
								simple_line_obj.id =
									"symbolrow_" + D_LAYER_STYLE.SYMBOL.global.symbolCnt;
								simple_line_obj.labelName = $("#rule-based-label").val();
								simple_line_obj.simpleMarker = "";
								simple_line_obj.filter = $("#rule-based-filter").val();
								simple_line_obj.lineType = $("#rule_lineStrokeDasharray option:selected").val();
								simple_line_obj.lineStrokeWidth = $("#rule_lineStrokeWidth").val();
								simple_line_obj.lineColor = $("#rule_lineStrokeColor").val();
								simple_line_obj.lineOffset = $("#rule_lineOffSet").val();
								simple_line_obj.opacity = D_LAYER_STYLE.SLIDER.global.simpleMakerSliderValue6;
								simple_line_obj.defaultFlag = $("[name='setFilterDefaultRadio']:checked").val()==="filter"?"0":"1";//0필터,1디폴트

								D_LAYER_STYLE.SYMBOL.global.line_ruleGroup.push(simple_line_obj);
							} else if ($("#rule_line-symbol-type").val() == "1") { // 마커 라인
								let marker_line_obj = {
									id: "",
									marker: 0, // 0 : 단순마커, 1 : 이미지 마커 = > 전부 px 단위
									labelName: "", // 라벨명
									filter: "", // 필터
									simpleMarker: "", // 마커유형 심플마커
									lineType: "",
									lineStrokeWidth: "",
									lineOffset: "",
									opacity: "",
									lineColor: "",
									markerSize: "",
									lineMarkerOffSet: "",
									outlineWidth: "",
									outlineColor: "",
									elseFlag: "false",
									defaultFlag : ""
								};

								// 마커라인
								marker_line_obj.marker = 3;
								marker_line_obj.id = "symbolrow_" + D_LAYER_STYLE.SYMBOL.global.symbolCnt;
								marker_line_obj.labelName = $("#rule-based-label").val();
								marker_line_obj.simpleMarker = $("#rule_simple-marker-line-type option:selected").val();
								marker_line_obj.filter = $("#rule-based-filter").val();
								marker_line_obj.markerSize = $('#rule_simpleLineMarkerSize').val();
								marker_line_obj.lineMarkerOffSet = $('#rule_lineMarkerOffset').val();
								marker_line_obj.lineColor = $('#rule_lineStrokeColor').val();
								marker_line_obj.outlineWidth = $('#rule_lineMarkerOutlineWitdh').val();
								marker_line_obj.outlineColor = $('#rule_lineStrokeOutlineColor').val();
								marker_line_obj.opacity = D_LAYER_STYLE.SLIDER.global.simpleMakerSliderValue6;
								marker_line_obj.defaultFlag = $("[name='setFilterDefaultRadio']:checked").val()==="filter"?"0":"1";//0필터,1디폴트

								D_LAYER_STYLE.SYMBOL.global.line_ruleGroup.push(marker_line_obj);
							}

							D_LAYER_STYLE.SYMBOL.initDataSimpleRuleLine(); // 라인 규칙기반 모달
							// 초기화
							D_LAYER_STYLE.SYMBOL.global.symbolUpdateFlag = false;
						}
					} else if (D_LAYER_STYLE.global.dataType == "polygon" || D_LAYER_STYLE.global.dataType == "multipolygon") { // 폴리곤인 경우
						if ($("#polygon-symbol-type2").val() === "1") {
							// 이미지 폴리곤인데 이미지 파일이 비어있으면
							if (D_LAYER_STYLE.Util.isEmpty(D_LAYER_STYLE.FILE.global.symbol_img_file)) {
								// var answer = confirm("첨부된 이미지 파일이 없습니다.\n첨부하시겠습니까?");
								// if(answer){
								// $('#imageFile2').click();
								// }
								// return false;
							}
						}

						var html = "";
						var labelName = $("#rule-based-label").val();
						var rule = $("#rule-based-filter").val();
						var defaultCheck = $("[name='setFilterDefaultRadio']:checked").val() == "filter" ? "" : '<span class="d-block" style="border: 3px solid #fff;width: 14px;height: 14px;border-radius: 10px;"></span>';

						var polygonSymbolText = "";

						// 심볼레이어 유형
						var polygonSymbolType = $("#polygon-symbol-type2 option:selected").val();

						if (polygonSymbolType == "0") {
							// 단순 마커
							var polygonViewHtml = $("#polygonPreview2").clone(true);
							polygonViewHtml = polygonViewHtml[0];

							polygonViewHtml.style.fontSize = "14px";
							polygonViewHtml.id = "polygonPreview2RuleId";
							polygonViewHtml.classList.value = 'd-block';
							var originBoderWidth = polygonViewHtml.style.border.split(' ')[0].split('px')[0];
							polygonViewHtml.style.width = "14px";
							polygonViewHtml.style.height = "14px";

							var adjusetd_borderWidth = originBoderWidth * 0.14;

							var borderWidth = adjusetd_borderWidth + 'px';
							var borderType = polygonViewHtml.style.border.split(' ')[1];
							var borderColor1 = polygonViewHtml.style.border.split(' ')[2];
							var borderColor2 = polygonViewHtml.style.border.split(' ')[3];
							var borderColor3 = polygonViewHtml.style.border.split(' ')[4];

							polygonViewHtml.style.border = borderWidth + " " + borderType + " " + borderColor1 + borderColor2 + borderColor3;

							polygonSymbolText = polygonViewHtml.outerHTML;
						} else if (polygonSymbolType == "1") {
							// 이미지 마커
							var polygonImgViewHtml = $("#imgMarker4").clone(true);
							polygonImgViewHtml = polygonImgViewHtml[0];

							polygonImgViewHtml.id = "pointImgPreview2RuleId";

							var img_width = $("#imgMarker4").width(); // 이미지 가로
							var img_height = $("#imgMarker4").height(); // 이미지 세로

							var maxSize = 14;
							// 이미지 마커 리사이징
							if (img_width > img_height) {
								if (img_width > maxSize) {
									img_height *= maxSize / img_width;
									img_width = maxSize;

									if (img_height > maxSize) {
										img_width *= maxSize / img_height;
										img_height = maxSize;
									}
								}
							} else {
								if (img_height > maxSize) {
									img_width *= maxSize / img_height;
									img_height = maxSize;

									if (img_width > maxSize) {
										img_height *= maxSize / img_width;
										img_width = maxSize;
									}
								}
							}
							polygonImgViewHtml.style.width = img_width + "px";
							polygonImgViewHtml.style.height = img_height + "px";
							polygonSymbolText = polygonImgViewHtml.outerHTML;
						}

						if (D_LAYER_STYLE.SYMBOL.global.symbolUpdateFlag) {
							// 만약 추가된 규칙의 로우를 수정할려고 할 경우
							var clickedRowId = D_LAYER_STYLE.SYMBOL.global.clickedSymbolId;

							D_LAYER_STYLE.SYMBOL.global.polygon_ruleGroup.forEach(
								(obj, index) => {
									if (obj.id === clickedRowId) {
										if ($("#polygon-symbol-type2").val() == "0") { // 심플 폴리곤인 경우 5
											D_LAYER_STYLE.SYMBOL.global.polygon_ruleGroup[index].marker = 5 // 심플
											// 폴리곤
											D_LAYER_STYLE.SYMBOL.global.polygon_ruleGroup[index].labelName = $("#rule-based-label").val();
											D_LAYER_STYLE.SYMBOL.global.polygon_ruleGroup[index].simpleMarker = $("#polygon-symbol-type2 option:selected").val()

											D_LAYER_STYLE.SYMBOL.global.polygon_ruleGroup[index].filter = $("#rule-based-filter").val();
											D_LAYER_STYLE.SYMBOL.global.polygon_ruleGroup[index].lineType = $("#polygonDasharray2 option:selected").val();
											D_LAYER_STYLE.SYMBOL.global.polygon_ruleGroup[index].lineColor = $("#polygonStrokeColor2").val();
											D_LAYER_STYLE.SYMBOL.global.polygon_ruleGroup[index].lineWidth = $("#polygonStrokeWidth2").val();

											D_LAYER_STYLE.SYMBOL.global.polygon_ruleGroup[index].fillColor = $("#polygonFillColor2").val();
											D_LAYER_STYLE.SYMBOL.global.polygon_ruleGroup[index].opacity = D_LAYER_STYLE.SLIDER.global.simpleMakerSliderValue8;
											D_LAYER_STYLE.SYMBOL.global.polygon_ruleGroup[index].defaultFlag = $("[name='setFilterDefaultRadio']:checked").val()==="filter"?"0":"1";//0필터,1디폴트

										} else if ($("#polygon-symbol-type2").val() == "1") { // 이미지 폴리곤인 경우 6
											D_LAYER_STYLE.SYMBOL.global.polygon_ruleGroup[index].marker = 6;
											D_LAYER_STYLE.SYMBOL.global.polygon_ruleGroup[index].simpleMarker = $("#polygon-symbol-type2 option:selected").val()
											D_LAYER_STYLE.SYMBOL.global.polygon_ruleGroup[index].labelName = $("#rule-based-label").val();

											D_LAYER_STYLE.SYMBOL.global.polygon_ruleGroup[index].filter = $("#rule-based-filter").val();
											D_LAYER_STYLE.SYMBOL.global.polygon_ruleGroup[index].imageWidth = $('#polygonImgWidth2').val();
											D_LAYER_STYLE.SYMBOL.global.polygon_ruleGroup[index].imageHeight = $('#polygonImgHeight2').val();

											D_LAYER_STYLE.SYMBOL.global.polygon_ruleGroup[index].imageOffsetX = $("#polygonImageOffsetX2").val();
											D_LAYER_STYLE.SYMBOL.global.polygon_ruleGroup[index].imageOffsetY = $("#polygonImageOffsetY2").val();


											D_LAYER_STYLE.SYMBOL.global.polygon_ruleGroup[index].opacity = D_LAYER_STYLE.SLIDER.global.simpleMakerSliderValue8;
											D_LAYER_STYLE.SYMBOL.global.polygon_ruleGroup[index].imageFileName =$("#imageFile4").val() != null? $("#imageFile4").val(): "";
											D_LAYER_STYLE.SYMBOL.global.polygon_ruleGroup[index].imageFileFormat =$("#imageFile4").val().split(".")[1] != null? $("#imageFile4").val().split(".")[1]: "";

											D_LAYER_STYLE.SYMBOL.global.polygon_ruleGroup[index].imageFilePath = D_LAYER_STYLE.FILE.global.upoloaded_img_file_path;
											D_LAYER_STYLE.SYMBOL.global.polygon_ruleGroup[index].defaultFlag = $("[name='setFilterDefaultRadio']:checked").val()==="filter"?"0":"1";//0필터,1디폴트

											// 이미지 마커
											var polygonImgViewHtml = $("#imgMarker4").clone(true);
											polygonImgViewHtml = polygonImgViewHtml[0];

											polygonImgViewHtml.id = "polygonImgPreview2RuleId";

											var img_width = $("#imgMarker4").width(); // 이미지 가로
											var img_height = $("#imgMarker4").height(); // 이미지 세로

											var maxSize = 14;
											// 이미지 마커 리사이징
											if (img_width > img_height) {
												if (img_width > maxSize) {
													img_height *= maxSize / img_width;
													img_width = maxSize;

													if (img_height > maxSize) {
														img_width *= maxSize / img_height;
														img_height = maxSize;
													}
												}
											} else {
												if (img_height > maxSize) {
													img_width *= maxSize / img_height;
													img_height = maxSize;

													if (img_width > maxSize) {
														img_height *= maxSize / img_width;
														img_width = maxSize;
													}
												}
											}
											polygonImgViewHtml.style.width = img_width + "px";
											polygonImgViewHtml.style.height = img_height + "px";
											polygonSymbolText = polygonImgViewHtml.outerHTML;

										}

										$("#" + clickedRowId).parent().siblings()[0].innerHTML = polygonSymbolText;
										$("#" + clickedRowId).parent().siblings()[1].innerHTML = labelName;
										$("#" + clickedRowId).parent().siblings()[2].innerHTML = rule;
										$("#" + clickedRowId).parent().siblings()[3].innerHTML = defaultCheck;

									}
								}
							);

							D_LAYER_STYLE.SYMBOL.global.symbolUpdateFlag = false;
						} else {
							// 규칙을 신규로
							html += '<tr class="added-rule-row">';
							html +='<td><input id ="symbolrow_' +D_LAYER_STYLE.SYMBOL.global.symbolCnt +'" type="checkbox" name="added-rule-group" checked="checked"></td>';
							html += "<td>" + polygonSymbolText + "</td>";
							html += "<td class=\"labelName\">" + labelName + "</td>";
							html += "<td class=\"ruleString\">" + rule + "</td>";
							html += "<td class=\"defaultString\" align=\"center\">" + defaultCheck + "</td>";
							html += "<td><Button class=\"buttonString btn-success\" style=\"border-radius: 0.25rem;line-height: 1.1rem;font-size: 12px;width: 40px;\">설정</Button></td>";
							html += "</tr>";

							$("#polygon-rule-box").append(html);
							// append한 후에,이벤트를 걸어줘야함
							
							$(".buttonString").on("click", function() {
								var rowId = $(this).parent().parent().children(":first").find("input")[0].id

								D_LAYER_STYLE.SYMBOL.global.clickedSymbolId = rowId;
								D_LAYER_STYLE.SYMBOL.global.symbolUpdateFlag = true;

								D_LAYER_STYLE.MODALS.setSymbolAttrFromList(rowId);
							});

							if ($("#polygon-symbol-type2").val() == "0") {

								let simple_polygon_obj = {
									id: "",
									marker: 0, // 0 : 단순마커, 1 : 이미지 마커 ,2 라인 심플, 3 라인 마커,4 라벨,5
									// 폴리곤 심플,6 폴리곤 이미지 = > 전부 px 단위
									labelName: "", // 라벨명
									filter: "", // 필터
									simpleMarker: "", // 마커유형 심플마커
									lineType: "",// 획 스타일
									lineColor: "",// 획 색상
									lineWidth: "",
									fillColor: "",// 채우기 색상
									opacity: "",
									imageFileName: "",
									imageFilePath: "",
									imageWidth: "",
									imageHeight: "",
									imageOffsetX: "",
									imageOffsetY: "",
									imageFilePath: "",
									imageFileFormat: "",
									elseFlag: "false",
									defaultFlag : ""
								};

								// 단순 마커
								simple_polygon_obj.marker = 5;
								simple_polygon_obj.id = "symbolrow_" + D_LAYER_STYLE.SYMBOL.global.symbolCnt;
								simple_polygon_obj.labelName = $("#rule-based-label").val();
								simple_polygon_obj.simpleMarker = $("#polygon-symbol-type2 option:selected").val();// 0단순

								simple_polygon_obj.filter = $("#rule-based-filter").val();
								simple_polygon_obj.lineType = $("#polygonDasharray2 option:selected").val();
								simple_polygon_obj.lineColor = $("#polygonStrokeColor2").val();
								simple_polygon_obj.fillColor = $("#polygonFillColor2").val();

								simple_polygon_obj.lineWidth = $('#polygonStrokeWidth2').val();
								simple_polygon_obj.opacity = D_LAYER_STYLE.SLIDER.global.simpleMakerSliderValue8;
								simple_polygon_obj.defaultFlag = $("[name='setFilterDefaultRadio']:checked").val()==="filter"?"0":"1";//0필터,1디폴트

								D_LAYER_STYLE.SYMBOL.global.polygon_ruleGroup.push(simple_polygon_obj);
							} else if ($("#polygon-symbol-type2").val() == "1") {

								let img_polygon_obj = {
									id: "",
									marker: 0, // 0 : 단순마커, 1 : 이미지 마커 ,2 라인 심플, 3 라인 마커,4 라벨,5
									// 폴리곤 심플,6 폴리곤 이미지 = > 전부 px 단위
									labelName: "", // 라벨명
									filter: "", // 필터
									simpleMarker: "", // 마커유형 심플마커
									lineType: "",// 획 스타일
									lineColor: "",// 획 색상
									lineWidth: "",
									fillColor: "",// 채우기 색상
									opacity: "",
									imageFileName: "",
									imageFilePath: "",
									imageWidth: "",
									imageHeight: "",
									imageOffsetX: "",
									imageOffsetY: "",
									imageFilePath: "",
									imageFileFormat: "",
									elseFlag: "false",
									defaultFlag : ""

								};
								// 이미지 마커
								img_polygon_obj.marker = 6;
								img_polygon_obj.id = "symbolrow_" + D_LAYER_STYLE.SYMBOL.global.symbolCnt;
								img_polygon_obj.labelName = $("#rule-based-label").val();
								img_polygon_obj.filter = $("#rule-based-filter").val();
								img_polygon_obj.simpleMarker = $("#polygon-symbol-type2").val();
								img_polygon_obj.opacity = D_LAYER_STYLE.SLIDER.global.simpleMakerSliderValue2;
								img_polygon_obj.imageFileName = $("#imageFile4").val() != null ? $("#imageFile4").val() : "";
								img_polygon_obj.imageFileFormat = $("#imageFile4").val().split(".")[1] != null ? $("#imageFile4").val().split(".")[1] : "";
								img_polygon_obj.imageFilePath = D_LAYER_STYLE.FILE.global.upoloaded_img_file_path;
								img_polygon_obj.imageWidth = $('#polygonImgWidth2').val();
								img_polygon_obj.imageHeight = $('#polygonImgHeight2').val();
								img_polygon_obj.imageOffsetX = $("#polygonImageOffsetX2").val();
								img_polygon_obj.imageOffsetY = $("#polygonImageOffsetY2").val();
								img_polygon_obj.defaultFlag = $("[name='setFilterDefaultRadio']:checked").val()==="filter"?"0":"1";//0필터,1디폴트


								D_LAYER_STYLE.SYMBOL.global.polygon_ruleGroup.push(img_polygon_obj);
							}

							D_LAYER_STYLE.SYMBOL.initSimplePolygon2(); // 폴리곤 규칙기반 모달 초기화
							D_LAYER_STYLE.SYMBOL.initImagePolygon2(); // 폴리곤 규칙기반 모달 초기화
							D_LAYER_STYLE.SYMBOL.global.symbolUpdateFlag = false;
						}
					}


					// $('#rule-based-modal').css('display','none;');
				} else {
					// 라벨 속성 선택중
					// 라벨,필터 인풋 널 공백 체크
					var labelName = $("#rule-based-label-modal").val();
					var filter = $("#rule-based-filter-modal").val();
					var filterDefault = $("[name='setLabelFilterDefaultRadio']:checked").val();


					if (D_LAYER_STYLE.Util.isEmpty(labelName)) {
						COMMON.alert("라벨을 입력해주세요", "error", function() {
							$("#rule-based-label-modal").focus();
						});
						return false;
					} else if (filterDefault == "filter" && D_LAYER_STYLE.Util.isEmpty(filter)) {
						COMMON.alert("필터를 입력해주세요", "error", function() {
							$("#rule-based-filter-modal").focus();
						});
						return false;

					}

					var html = "";
					var labelName = $("#rule-based-label-modal").val();
					var rule = $("#rule-based-filter-modal").val();
				}

				D_LAYER_STYLE.SYMBOL.global.symbolCnt++;
			});

			// 포인트 심플 마커 이미지 너비 리사이징관련
			$("#simpleImgMarkerWidth").on("change", function(e) {
				var basicWidth = 14;
				var maxSize = 130;
				var img_width = $("#simpleImgMarkerWidth").val();
				// 이미지 마커 최대너비 100px 제한

				if (img_width > maxSize) {
					img_width = maxSize;
					COMMON.alert("이미지 마커의 최대 너비와 \n높이는 130px입니다.", "error", function() {
						$("#simpleImgMarkerWidth").val("130").trigger("change");
						$("#imgMarker").css("width", "130px");
					});
				}

				$("#imgMarker").css("width", img_width + "px");

				var img_height = $("#imgMarker").prop("height"); // 너비에 따른 자동 높이 조정
				var rate = 1;

				if (img_height > maxSize) {
					if (img_width < img_height) {
						// 높이가 더 큰 경우
						rate = img_width / img_height;
						img_width = maxSize * rate;
						$("#imgMarker").css("width", img_width + "px");
						img_height = $("#imgMarker").prop("height");

						$("#simpleImgMarkerWidth").val(img_width);
						$("#simpleImgMarkerHeight").val(img_height);

						COMMON.alert("이미지 마커의 최대 너비와 \n높이는 130px입니다.", "error", function() {
							return false;
						});
					}
				}
				$("#simpleImgMarkerWidth").val(img_width);
				$("#simpleImgMarkerHeight").val(img_height);
			});
			// 규칙기반--이미지 심볼 리사이징 처리
			$("#simpleImgMarkerWidth2").on("change", function(e) {
				var basicWidth = 14;
				var maxSize = 130;
				var img_width = $("#simpleImgMarkerWidth2").val();
				// 이미지 마커 최대너비 100px 제한

				if (img_width > maxSize) {
					img_width = maxSize;
					COMMON.alert("이미지 마커의 최대 너비와 \n높이는 130px입니다.", "error", function() {
						$("#simpleImgMarkerWidth2").val("130").trigger("change");
						$("#imgMarker2").css("width", "130px");
					});
				}

				$("#imgMarker2").css("width", img_width + "px");

				var img_height = $("#imgMarker2").prop("height"); // 너비에 따른 자동 높이 조정
				var rate = 1;

				if (img_height > maxSize) {
					if (img_width < img_height) {
						// 높이가 더 큰 경우
						rate = img_width / img_height;
						img_width = maxSize * rate;
						$("#imgMarker2").css("width", img_width + "px");
						img_height = $("#imgMarker2").prop("height");

						$("#simpleImgMarkerWidth2").val(img_width);
						$("#simpleImgMarkerHeight2").val(img_height);

						COMMON.alert("이미지 마커의 최대 너비와 \n높이는 130px입니다.", "error", function() {
							return false;
						});
					}
				}
				$("#simpleImgMarkerWidth2").val(img_width);
				$("#simpleImgMarkerHeight2").val(img_height);
			});
		},
		initLine: function() {
			// 포인트 심볼 레이어 유형 이미지로 바뀔 시 파일 첨부 추가
			$("#line-symbol-type").on("change", function() {
				var cloneImgPreview = null;
				if ($(this).val() === "0") {
					$(".line-marker-group").hide();
					$(".line-simple-group").show();
					$("#linePreview").text("");
					$("#linePreview").append('<hr id="strokePreview" style="border-top: solid 3px black;width: 200px;margin: auto;background: transparent;">');
					D_LAYER_STYLE.SYMBOL.initDataSimpleLine();
				} else if ($(this).val() === "1") {
					$(".line-marker-group").show();
					$(".line-simple-group").hide();
					$("#linePreview").text("●●●●●●●●●●●●●●●●●●●●●●●●●●");
					D_LAYER_STYLE.SYMBOL.initDataMarkerLine();
				}
			});

			// 라인 규칙
			$("#rule_line-symbol-type").on("change", function() {
				var cloneImgPreview = null;
				if ($(this).val() === "0") {
					$(".line-marker-group").hide();
					$(".line-simple-group").show();
					$("#rule_linePreview").text("");
					$("#rule_linePreview").append('<hr id="rule_strokePreview" style="border-top: solid 3px black;width: 200px;margin: auto;background: transparent;">');
					D_LAYER_STYLE.SYMBOL.initDataSimpleRuleLine();
				} else if ($(this).val() === "1") {
					$(".line-marker-group").show();
					$(".line-simple-group").hide();
					$("#rule_linePreview").text("●●●●●●●●●●●●●●●●●●●●●●●●●●");
					D_LAYER_STYLE.SYMBOL.initDataMarkerRuleLine();
				}
			});

			// 규칙기반 심볼레이어 설정
			$("#point-symbol-type2").on("change", function() {
				if ($(this).val() === "0") {
					$(".point-image-group2").hide();
					$(".point-simple-group2").show();
					D_LAYER_STYLE.SYMBOL.initData2("2");
				} else if ($(this).val() === "1") {
					$(".point-image-group2").show();
					$(".point-simple-group2").hide();
					D_LAYER_STYLE.SYMBOL.initData2("2");
					$("#pointPreview2").text("");
				}
			});
			// 심볼 화면
			// 라인 단일심볼,규칙기반
			$("#line-symbol-rule").on("change", function() {
				if ($(this).val() === "0") {
					$(".one-symbol-line").show(); // 단일 심볼 보이기
					$(".rule-based-symbol-line").hide(); // 규칙기반 심볼 숨기기
					D_LAYER_STYLE.SYMBOL.global.line_ruleGroup = [];
					$('.added-rule-row').remove();
				} else {
					D_LAYER_STYLE.SYMBOL.global.line_ruleGroup = [];
					$(".rule-based-symbol-line").show();
					$(".one-symbol-line").hide();
				}
			});

			// 폴리곤 단일심볼,규칙기반
			$("#polygon-symbol-rule").on("change", function() {
				if ($(this).val() === "0") {
					$(".one-symbol-polygon").show(); // 단일 심볼 보이기
					$(".rule-based-symbol-polygon").hide(); // 규칙기반 심볼 숨기기
					D_LAYER_STYLE.SYMBOL.global.polygon_ruleGroup = [];
				} else {
					D_LAYER_STYLE.SYMBOL.global.polygon_ruleGroup = [];
					$(".rule-based-symbol-polygon").show();
					$(".one-symbol-polygon").hide();
					$('.added-rule-row').remove();
				}
			});

			// 포인트 심플 마커 지정
			$("#simple-marker-type").on("change", function() {
				var value = $(this).val();
				switch (value) {
					case "circle":
						$("#pointPreview").text("●");
						break;
					case "star":
						$("#pointPreview").text("★");
						break;
					case "diamond":
						$("#pointPreview").text("◆");
						break;

					case "square":
						$("#pointPreview").text("■");
						break;
					case "triangle":
						$("#pointPreview").text("▲");
						break;
				}
			});

			// 규칙기반 포인트 심볼 심플 마커 지정
			$("#simple-marker-type2").on("change", function() {
				var value = $(this).val();

				switch (value) {
					case "circle":
						$("#pointPreview2").text("●");
						break;
					case "star":
						$("#pointPreview2").text("★");
						break;
					case "diamond":
						$("#pointPreview2").text("◆");
						break;

					case "square":
						$("#pointPreview2").text("■");
						break;
					case "triangle":
						$("#pointPreview2").text("▲");
						break;
				}
			});

			// 라인 획 스타일
			$("#lineStrokeDasharray").on("change", function() {
				D_LAYER_STYLE.SYMBOL.SHP.LINE.getLinePreview();
			});
			// 라인 선 두께
			$("#lineStrokeWidth").on("change", function() {
				var maxSize = 130;
				var size = $(this).val();
				if (maxSize < size) {
					size = maxSize;
					COMMON.alert("최대 심볼 사이즈는 130px입니다.", "error", function() { $("#lineStrokeWidth").val(size); });
				}
				D_LAYER_STYLE.SYMBOL.SHP.LINE.getLinePreview();
			});

			$("#lineStrokeColor").on("change", function() {
				D_LAYER_STYLE.SYMBOL.SHP.LINE.getLinePreview();
			});

			$("#lineOffSet").on("change", function() {
				D_LAYER_STYLE.SYMBOL.SHP.LINE.getLinePreview();
			});

			$("#simple-marker-line-type").on("change", function() {
				D_LAYER_STYLE.SYMBOL.SHP.LINE.getLinePreview();
			});

			$("#lineStrokeOutlineColor").on("change", function() {
				D_LAYER_STYLE.SYMBOL.SHP.LINE.getLinePreview();
			});

			$("#lineMarkerOutlineWitdh").on("change", function() {
				D_LAYER_STYLE.SYMBOL.SHP.LINE.getLinePreview();
			});

			// 포인터 심플 마커 크기
			$("#simpleLineMarkerSize").on("change", function() {
				var maxSize = 130;
				var size = $(this).val();
				if (maxSize < size) {
					size = maxSize;
					COMMON.alert("최대 심볼 사이즈는 130px입니다.", "error", function() {
						$("#simpleLineMarkerSize").val(size);
					});
				}
				D_LAYER_STYLE.SYMBOL.SHP.LINE.getLinePreview();
			});

			$("#lineMarkerOffset").on("change", function() {
				D_LAYER_STYLE.SYMBOL.SHP.LINE.getLinePreview();
			});

			$("#lineStrokeOutlineColor").on("change", function() {
				D_LAYER_STYLE.SYMBOL.SHP.LINE.getLinePreview();
			});

			$("#simpleMarkerColor").on("change", function() {
				var color = $(this).val();
				$("#pointPreview").css("color", color);
			});

			$("#simpleMarkerOutlineColor,#simpleMarkerOulineWidth").on(
				"change",
				function() {
					var outlineColor = $("#simpleMarkerOutlineColor").val();
					var outlineWidth = $("#simpleMarkerOulineWidth").val() + "px";


					$("#pointPreview").css(
						"-webkit-text-stroke",
						outlineWidth + " " + outlineColor
					);
				}
			);


			// 라인 규칙 모달쪽
			// 라인 규칙 획 스타일
			$("#rule_lineStrokeDasharray").on("change", function() {
				D_LAYER_STYLE.SYMBOL.SHP.LINE.getLineRulePreview();
			});
			// 라인 규칙 선 두께
			$("#rule_lineStrokeWidth").on("change", function() {
				var maxSize = 130;
				var size = $(this).val();
				if (maxSize < size) {
					size = maxSize;
					COMMON.alert("최대 심볼 사이즈는 130px입니다.", "error", function() {
						$("#rule_lineStrokeWidth").val(size);
					});
				}
				D_LAYER_STYLE.SYMBOL.SHP.LINE.getLineRulePreview();
			});

			$("#rule_lineStrokeColor").on("change", function() {
				D_LAYER_STYLE.SYMBOL.SHP.LINE.getLineRulePreview();
			});

			$("#rule_lineOffSet").on("change", function() {
				D_LAYER_STYLE.SYMBOL.SHP.LINE.getLineRulePreview();
			});

			$("#rule_simple-marker-line-type").on("change", function() {
				D_LAYER_STYLE.SYMBOL.SHP.LINE.getLineRulePreview();
			});

			$("#rule_lineStrokeOutlineColor").on("change", function() {
				D_LAYER_STYLE.SYMBOL.SHP.LINE.getLineRulePreview();
			});

			$("#rule_lineMarkerOutlineWitdh").on("change", function() {
				D_LAYER_STYLE.SYMBOL.SHP.LINE.getLineRulePreview();
			});

			// 라인 규칙 포인터 심플 마커 크기
			$("#rule_simpleLineMarkerSize").on("change", function() {
				var maxSize = 130;
				var size = $(this).val();
				if (maxSize < size) {
					size = maxSize;
					COMMON.alert("최대 심볼 사이즈는 130px입니다.", "error", function() {
						$("#rule_simpleLineMarkerSize").val(size);
					});
				}
				D_LAYER_STYLE.SYMBOL.SHP.LINE.getLineRulePreview();
			});

			$("#rule_lineMarkerOffset").on("change", function() {
				D_LAYER_STYLE.SYMBOL.SHP.LINE.getLineRulePreview();
			});

			$("#rule_lineStrokeOutlineColor").on("change", function() {
				D_LAYER_STYLE.SYMBOL.SHP.LINE.getLineRulePreview();
			});

			$("#rule_simpleMarkerColor").on("change", function() {
				var color = $(this).val();
				$("#pointPreview").css("color", color);
			});

			$("#rule_simpleMarkerOutlineColor,#rule_simpleMarkerOulineWidth").on(
				"change",
				function() {
					var outlineColor = $("#rule_simpleMarkerOutlineColor").val();
					var outlineWidth = $("#rule_simpleMarkerOulineWidth").val() + "px";

					/*console.log(outlineColor);
					console.log(outlineWidth);
					console.log(outlineWidth + " " + outlineColor);*/
					$("#rule_pointPreview").css(
						"-webkit-text-stroke",
						outlineWidth + " " + outlineColor
					);
				}
			);
			// 라인 규칙 모달쪽 끝

			// 규칙기반 - 포인터 심플 마커 크기
			$("#simpleMarkerSize2").on("change", function() {
				var maxSize = 130;
				var size = $(this).val();
				if (maxSize < size) {
					size = maxSize;
					COMMON.alert("최대 심볼 사이즈는 130px입니다.", "error", function() {
						$("#simpleMarkerSize2").val(size);
					});
				}
				$("#pointPreview2").css("font-size", size + "px");
			});

			$("#simpleMarkerColor2").on("change", function() {
				var color = $(this).val();
				$("#pointPreview2").css("color", color);
			});

			$("#simpleMarkerOutlineColor2,#simpleMarkerOulineWidth2").on(
				"change",
				function() {
					var outlineColor = $("#simpleMarkerOutlineColor2").val();
					var outlineWidth = $("#simpleMarkerOulineWidth2").val() + "px";

					// -1px 0 #000, 0 1px #000, 1px 0 #000, 0 -1px #000

					// var textShadowValue = '-'+outlineWidth+'px 0'+outlineColor+','+'0
					// '+outlineWidth+'px '+outlineColor+','+outlineWidth+'px 0
					// '+outlineColor+', 0 -'+outlineWidth+'px '+outlineColor;

					// $('#pointPreview').css('text-shadow',textShadowValue);

					$("#pointPreview2").css(
						"-webkit-text-stroke",
						outlineWidth + " " + outlineColor
					);
				}
			);

			$("#saveRuleBtn2").on("click", function() {
				if ($("#showSymbolBtn").hasClass("active")) {
					// 심볼 속성 선택중

					// 라벨,필터 인풋 널 공백 체크
					var labelName = $("#rule-based-label").val();
					var filter = $("#rule-based-filter").val();
					var filterDefault = $("[name='setFilterDefaultRadio']:checked").val();

					if (D_LAYER_STYLE.Util.isEmpty(labelName)) {
						COMMON.alert("라벨을 입력해주세요", "error", function() {
							$("#rule-based-label").focus();
						});
						return false;
					} else if (filterDefault == "filter" && D_LAYER_STYLE.Util.isEmpty(filter)) {
						COMMON.alert("필터를 입력해주세요", "error", function() {
							$("#rule-based-filter").focus();
						});
						return false;
					}

					if ($("#point-symbol-type2").val() === "1") {
						// 이미지 마커인데 이미지 파일이 비어있으면
						if (
							D_LAYER_STYLE.Util.isEmpty(
								D_LAYER_STYLE.FILE.global.symbol_img_file
							)
						) {
							// var answer = confirm("첨부된 이미지 파일이 없습니다.\n첨부하시겠습니까?");
							// if(answer){
							// $('#imageFile2').click();
							// }
							// return false;
						}
					}

					var html = "";
					var labelName = $("#rule-based-label").val();
					var rule = $("#rule-based-filter").val();

					var pointSymbolText = "";

					// 심볼레이어 유형
					var pointSymbolType = $("#point-symbol-type2 option:selected").val();

					if (pointSymbolType == "0") {
						// 단순 마커
						var pointViewHtml = $("#pointPreview2").clone(true);
						pointViewHtml = pointViewHtml[0];

						pointViewHtml.style.fontSize = "14px";
						pointViewHtml.id = "pointPreview2RuleId";

						pointSymbolText = pointViewHtml.outerHTML;
					} else if (pointSymbolType == "1") {
						// 이미지 마커
						var pointImgViewHtml = $("#imgMarker2").clone(true);
						pointImgViewHtml = pointImgViewHtml[0];

						pointImgViewHtml.id = "pointImgPreview2RuleId";

						var img_width = $("#imgMarker2").width(); // 이미지 가로
						var img_height = $("#imgMarker2").height(); // 이미지 세로

						var maxSize = 14;
						// 이미지 마커 리사이징
						if (img_width > img_height) {
							if (img_width > maxSize) {
								img_height *= maxSize / img_width;
								img_width = maxSize;

								if (img_height > maxSize) {
									img_width *= maxSize / img_height;
									img_height = maxSize;
								}
							}
						} else {
							if (img_height > maxSize) {
								img_width *= maxSize / img_height;
								img_height = maxSize;

								if (img_width > maxSize) {
									img_height *= maxSize / img_width;
									img_width = maxSize;
								}
							}
						}
						pointImgViewHtml.style.width = img_width + "px";
						pointImgViewHtml.style.height = img_height + "px";
						pointSymbolText = pointImgViewHtml.outerHTML;
					}

					if (D_LAYER_STYLE.SYMBOL.global.symbolUpdateFlag) {
						// 만약 추가된 규칙의 로우를 수정할려고 할 경우

						var clickedRowId = D_LAYER_STYLE.SYMBOL.global.clickedSymbolId;

						D_LAYER_STYLE.SYMBOL.global.point_ruleGroup.forEach(
							(obj, index) => {
								if (obj.id === clickedRowId) {
									if ($("#point-symbol-type2").val() == "0") {
										// 단일 심플 마커

										D_LAYER_STYLE.SYMBOL.global.point_ruleGroup[index].marker =
											$("#point-symbol-type2").val();
										D_LAYER_STYLE.SYMBOL.global.point_ruleGroup[
											index
										].labelName = $("#rule-based-label").val();
										D_LAYER_STYLE.SYMBOL.global.point_ruleGroup[
											index
										].simpleMarker = $(
											"#simple-marker-type2 option:selected"
										).val();

										D_LAYER_STYLE.SYMBOL.global.point_ruleGroup[index].filter =
											$("#rule-based-filter").val();
										D_LAYER_STYLE.SYMBOL.global.point_ruleGroup[index].size =
											$("#simpleMarkerSize2").val();


										D_LAYER_STYLE.SYMBOL.global.point_ruleGroup[index].color =
											$("#simpleMarkerColor2").val();
										D_LAYER_STYLE.SYMBOL.global.point_ruleGroup[
											index
										].outlineWidth = $("#simpleMarkerOulineWidth2").val();
										D_LAYER_STYLE.SYMBOL.global.point_ruleGroup[
											index
										].outlineColor = $("#simpleMarkerOutlineColor2").val();
										D_LAYER_STYLE.SYMBOL.global.point_ruleGroup[index].opacity =
											D_LAYER_STYLE.SLIDER.global.simpleMakerSliderValue2;
										D_LAYER_STYLE.SYMBOL.global.point_ruleGroup[
											index
										].rotation = $("#dialInnerValue2").val();
									} else if ($("#point-symbol-type2").val() == "1") {
										// 이미지 마커
										D_LAYER_STYLE.SYMBOL.global.point_ruleGroup[index].marker =
											$("#point-symbol-type2").val();
										D_LAYER_STYLE.SYMBOL.global.point_ruleGroup[
											index
										].labelName = $("#rule-based-label").val();

										D_LAYER_STYLE.SYMBOL.global.point_ruleGroup[index].filter =
											$("#rule-based-filter").val();
										D_LAYER_STYLE.SYMBOL.global.point_ruleGroup[index].size =
											$("#simpleMarkerSize2").val();

										D_LAYER_STYLE.SYMBOL.global.point_ruleGroup[index].color =
											$("#simpleMarkerColor2").val();
										D_LAYER_STYLE.SYMBOL.global.point_ruleGroup[index].opacity =
											D_LAYER_STYLE.SLIDER.global.simpleMakerSliderValue2;
										D_LAYER_STYLE.SYMBOL.global.point_ruleGroup[
											index
										].rotation = $("#dialInnerValue2").val();
										D_LAYER_STYLE.SYMBOL.global.point_ruleGroup[
											index
										].imageFileName =
											$("#imageFile").val() != null
												? $("#imageFile").val()
												: "";
										D_LAYER_STYLE.SYMBOL.global.point_ruleGroup[
											index
										].imageFileFormat =
											$("#imageFile").val().split(".")[1] != null
												? $("#imageFile").val().split(".")[1]
												: "";

										D_LAYER_STYLE.SYMBOL.global.point_ruleGroup[
											index
										].imageFilePath = D_LAYER_STYLE.FILE.global.upoloaded_img_file_path;
									}

									// html += '<tr class="added-rule-row">';
									// html +=
									// '<td><input id ="'+clickedRowId+'" type="checkbox"
									// name="added-rule-group" checked="checked"></td>';
									// html += "<td>" + pointSymbolText + "</td>";
									// html += "<td>" + labelName + "</td>";
									// html += "<td>" + rule + "</td>";
									// html += "</tr>";
									// $('#symbolrow_0').parent()
									$("#" + clickedRowId)
										.parent()
										.siblings()[0].innerHTML = pointSymbolText;
									$("#" + clickedRowId)
										.parent()
										.siblings()[1].innerHTML = labelName;
									$("#" + clickedRowId)
										.parent()
										.siblings()[2].innerHTML = rule;

									// $('#'+clickedRowId).parent().parent().html(html);
								}
							}
						);

						D_LAYER_STYLE.SYMBOL.global.symbolUpdateFlag = false;
					} else {
						// 규칙을 신규로

						html += '<tr class="added-rule-row">';
						html +=
							'<td><input id ="symbolrow_' +
							D_LAYER_STYLE.SYMBOL.global.symbolCnt +
							'" type="checkbox" name="added-rule-group" checked="checked"></td>';
						html += "<td>" + pointSymbolText + "</td>";
						html += "<td class=\"labelName\">" + labelName + "</td>";
						html += "<td class=\"ruleString\">" + rule + "</td>";
						html += "<td class=\"defaultString\" align=\"center\">" + defaultCheck + "</td>";
						html += "</tr>";

						$("#rule-box").append(html);
						// append한 후에,이벤트를 걸어줘야함
						$(".added-rule-row").on("dblclick", function() {
							// 
							var rowId = $(this).children(":first").find("input")[0].id;


							D_LAYER_STYLE.SYMBOL.global.clickedSymbolId = rowId;
							D_LAYER_STYLE.SYMBOL.global.symbolUpdateFlag = true;

							D_LAYER_STYLE.MODALS.setSymbolAttrFromList(rowId);
						});

						// $('#markerExample').append(pointViewHtml);
						// $('#markerExample').append(pointImgViewHtml);
						if ($("#point-symbol-type2").val() == "0") {
							let point_ruleObj = {
								id: "",
								marker: 0, // 0 : 단순마커, 1 : 이미지 마커 = > 전부 px 단위
								labelName: "", // 라벨명
								filter: "", // 필터
								simpleMarker: "", // 마커유형 심플마커
								size: "",
								color: "",
								outlineWidth: "",
								outlineColor: "",
								opacity: "",
								rotation: "",
								imageWidth: "",
								imageHeight: "",
								imageFileName: "",
								imageFileFormat: "",
							};

							// 단순 마커
							point_ruleObj.marker = 0;
							point_ruleObj.id =
								"symbolrow_" + D_LAYER_STYLE.SYMBOL.global.symbolCnt;
							point_ruleObj.labelName = $("#rule-based-label").val();
							point_ruleObj.simpleMarker = $(
								"#simple-marker-type2 option:selected"
							).val();
							point_ruleObj.filter = $("#rule-based-filter").val();
							point_ruleObj.size = $("#simpleMarkerSize2").val();
							point_ruleObj.color = $("#simpleMarkerColor2").val();
							point_ruleObj.outlineWidth = $("#simpleMarkerOulineWidth2").val();
							point_ruleObj.outlineColor = $(
								"#simpleMarkerOutlineColor2"
							).val();
							point_ruleObj.opacity =
								D_LAYER_STYLE.SLIDER.global.simpleMakerSliderValue2;
							point_ruleObj.rotation = $("#dialInnerValue2").val();


							D_LAYER_STYLE.SYMBOL.global.point_ruleGroup.push(point_ruleObj);
						} else if ($("#point-symbol-type2").val() == "1") {
							let point_ruleObj = {
								id: "",
								marker: 0, // 0 : 단순마커, 1 : 이미지 마커 = > 전부 px 단위
								labelName: "", // 라벨명
								filter: "", // 필터
								simpleMarker: "", // 마커유형 심플마커
								size: "",
								color: "",
								outlineWidth: "",
								outlineColor: "",
								opacity: "",
								rotation: "",
								imageWidth: "",
								imageHeight: "",
								imageFileName: "",
								imageFileFormat: "",
							};
							// 이미지 마커
							point_ruleObj.marker = 1;
							point_ruleObj.id =
								"symbolrow_" + D_LAYER_STYLE.SYMBOL.global.symbolCnt;
							point_ruleObj.labelName = $("#rule-based-label").val();
							point_ruleObj.filter = $("#rule-based-filter").val();
							point_ruleObj.size = $("#simpleMarkerSize2").val();
							point_ruleObj.color = $("#simpleMarkerColor2").val();
							point_ruleObj.opacity =
								D_LAYER_STYLE.SLIDER.global.simpleMakerSliderValue2;
							point_ruleObj.rotation = $("#dialInnerValue2").val();
							point_ruleObj.imageFileName =
								$("#imageFile").val() != null ? $("#imageFile").val() : "";
							point_ruleObj.imageFileFormat =
								$("#imageFile").val().split(".")[1] != null
									? $("#imageFile").val().split(".")[1]
									: "";


							D_LAYER_STYLE.SYMBOL.global.point_ruleGroup.push(point_ruleObj);
						}

						D_LAYER_STYLE.SYMBOL.initData2(); // 포인트 규칙기반 모달 초기화
					}

					// $('#rule-based-modal').css('display','none;');
				} else {
					// 라벨 속성 선택중
					// 라벨,필터 인풋 널 공백 체크
					var labelName = $("#rule-based-label-modal").val();
					var filter = $("#rule-based-filter-modal").val();
					var filterDefault = $("[name='setLabelFilterDefaultRadio']:checked").val();

					if (D_LAYER_STYLE.Util.isEmpty(labelName)) {
						COMMON.alert("라벨을 입력해주세요", "error", function() {
							$("#rule-based-label-modal").focus();
						});
						return false;

					} else if (filterDefault == "filter" && D_LAYER_STYLE.Util.isEmpty(filter)) {
						COMMON.alert("필터를 입력해주세요", "error", function() {
							$("#rule-based-filter-modal").focus();
						});
						return false;
					}

					var html = "";
					var labelName = $("#rule-based-label-modal").val();
					var rule = $("#rule-based-filter-modal").val();
				}

				D_LAYER_STYLE.SYMBOL.global.symbolCnt++;
			});

			// 포인트 심플 마커 이미지 너비 리사이징관련
			$("#simpleImgMarkerWidth").on("change", function(e) {
				var basicWidth = 14;
				var maxSize = 130;
				var img_width = $("#simpleImgMarkerWidth").val();
				// 이미지 마커 최대너비 100px 제한

				if (img_width > maxSize) {
					img_width = maxSize;
					COMMON.alert("이미지 마커의 최대 너비와 \n높이는 130px입니다.", "error", function() {
						$("#simpleImgMarkerWidth").val("130").trigger("change");
						$("#imgMarker").css("width", "130px");
					});
				}

				$("#imgMarker").css("width", img_width + "px");

				var img_height = $("#imgMarker").prop("height"); // 너비에 따른 자동 높이 조정
				var rate = 1;

				if (img_height > maxSize) {
					if (img_width < img_height) {
						// 높이가 더 큰 경우
						rate = img_width / img_height;
						img_width = maxSize * rate;
						$("#imgMarker").css("width", img_width + "px");
						img_height = $("#imgMarker").prop("height");

						$("#simpleImgMarkerWidth").val(img_width);
						$("#simpleImgMarkerHeight").val(img_height);

						COMMON.alert("이미지 마커의 최대 너비와 \n높이는 130px입니다.", "error", function() {
							return false;
						});
					}
				}
				$("#simpleImgMarkerWidth").val(img_width);
				$("#simpleImgMarkerHeight").val(img_height);
			});
			// 규칙기반--이미지 심볼 리사이징 처리
			$("#simpleImgMarkerWidth2").on("change", function(e) {
				var basicWidth = 14;
				var maxSize = 130;
				var img_width = $("#simpleImgMarkerWidth2").val();
				// 이미지 마커 최대너비 100px 제한

				if (img_width > maxSize) {
					img_width = maxSize;
					COMMON.alert("이미지 마커의 최대 너비와 \n높이는 130px입니다.", "error", function() {
						$("#simpleImgMarkerWidth2").val("130").trigger("change");
						$("#imgMarker2").css("width", "130px");
					});
				}

				$("#imgMarker2").css("width", img_width + "px");

				var img_height = $("#imgMarker2").prop("height"); // 너비에 따른 자동 높이 조정
				var rate = 1;

				if (img_height > maxSize) {
					if (img_width < img_height) {
						// 높이가 더 큰 경우
						rate = img_width / img_height;
						img_width = maxSize * rate;
						$("#imgMarker2").css("width", img_width + "px");
						img_height = $("#imgMarker2").prop("height");

						$("#simpleImgMarkerWidth2").val(img_width);
						$("#simpleImgMarkerHeight2").val(img_height);

						COMMON.alert("이미지 마커의 최대 너비와 \n높이는 130px입니다.", "error", function() {
							return false;
						});

					}
				}
				$("#simpleImgMarkerWidth2").val(img_width);
				$("#simpleImgMarkerHeight2").val(img_height);
			});
		},
		initPolygon: function() {
			$("#polygon-symbol-type").on("change", function() {
				var cloneImgPreview = null;
				if ($(this).val() === "0") {

					$(".polygon-image-group").hide();
					$(".polygon-simple-group").show();

					// 초기화
					$('#polygonPreview').html("");
					D_LAYER_STYLE.SYMBOL.initSimplePolygon();
				} else if ($(this).val() === "1") {
					$(".polygon-image-group").show();
					$(".polygon-simple-group").hide();

					// 초기화
					D_LAYER_STYLE.SYMBOL.initImagePolygon();
					$("#polygonPreview").removeAttr('style');
				}
			});


			$("#polygon-symbol-type2").on("change", function() {
				var cloneImgPreview = null;
				if ($(this).val() === "0") {

					$(".polygon-image-group").hide();
					$(".polygon-simple-group").show();

					// 초기화
					$('#polygonPreview2').html("");
					D_LAYER_STYLE.SYMBOL.initSimplePolygon2();
				} else if ($(this).val() === "1") {
					$(".polygon-image-group").show();
					$(".polygon-simple-group").hide();

					// 초기화
					D_LAYER_STYLE.SYMBOL.initImagePolygon2();
					$("#polygonPreview2").removeAttr('style');
				}
			});


			$('#polygonDasharray').on('change', function() {
				D_LAYER_STYLE.SYMBOL.SHP.POLYGON.getPolygonPreview();
			});

			$('#polygonStrokeColor').on('change', function() {
				D_LAYER_STYLE.SYMBOL.SHP.POLYGON.getPolygonPreview();
			});

			$('#polygonStrokeWidth').on('change', function() {
				D_LAYER_STYLE.SYMBOL.SHP.POLYGON.getPolygonPreview();
			});

			$('#polygonFillColor').on('change', function() {
				D_LAYER_STYLE.SYMBOL.SHP.POLYGON.getPolygonPreview();
			});

			$('#polygonImageOffsetX').on('change', function() {
				D_LAYER_STYLE.SYMBOL.SHP.POLYGON.getPolygonPreview();
			});

			$('#polygonImageOffsetY').on('change', function() {
				D_LAYER_STYLE.SYMBOL.SHP.POLYGON.getPolygonPreview();
			});

			// 폴리곤 규칙기반
			$('#polygonDasharray2').on('change', function() {
				D_LAYER_STYLE.SYMBOL.SHP.POLYGON.getPolygonRulePreview();
			});

			$('#polygonStrokeColor2').on('change', function() {
				D_LAYER_STYLE.SYMBOL.SHP.POLYGON.getPolygonRulePreview();
			});

			$('#polygonStrokeWidth2').on('change', function() {
				D_LAYER_STYLE.SYMBOL.SHP.POLYGON.getPolygonRulePreview();
			});

			$('#polygonFillColor2').on('change', function() {
				D_LAYER_STYLE.SYMBOL.SHP.POLYGON.getPolygonRulePreview();
			});

			$('#polygonImageOffsetX2').on('change', function() {
				D_LAYER_STYLE.SYMBOL.SHP.POLYGON.getPolygonRulePreview();
			});

			$('#polygonImageOffsetY2').on('change', function() {
				D_LAYER_STYLE.SYMBOL.SHP.POLYGON.getPolygonRulePreview();
			});

		},
		initSymbol: function() {
			$("#point-symbol-rule").val("0").trigger("change");
			$("#point-symbol-type").val("0").trigger("change");
			$("#simple-marker-type").val("circle").trigger("change");
			$("#simpleMarkerSize").val("14").trigger("change");
			$("#simpleMarkerColor").val("#000000").trigger("change");
			$("#simpleMarkerOulineWidth").val("0").trigger("change");
			$("#simpleMarkerOutlineColor").val("#000000").trigger("change");
		},
		initData: function() {
			// 포인트 단일심볼
			$("#simple-marker-type").val("circle").trigger("change");
			$("#simpleMarkerSize").val("14").trigger("change");
			$("#simpleMarkerColor").val("#000000").trigger("change");
			$("#simpleMarkerOulineWidth").val("0").trigger("change");
			$("#simpleMarkerOutlineColor").val("#000000").trigger("change");

			$("#upload1").val("첨부파일");
			$("#simpleImgMarkerWidth").val("0").trigger("change");
			$("#simpleImgMarkerHeight").val("0").trigger("change");
			$("#dialInnerValue").val("0").trigger("change");

			$("#imageFile").val("");
			// 기존 규칙기반 룰 삭제
			$(".added-rule-row").remove();
			D_LAYER_STYLE.SYMBOL.global.point_ruleGroup = [];
			D_LAYER_STYLE.SYMBOL.global.symbolUpdateFlag = false;

			D_LAYER_STYLE.SLIDER.global.slider
				.data("ionRangeSlider")
				.update({ from: 100 });
		},
		initData2: function(value) {
			// 포인트 이미지 심볼
			// $('#simple-marker-type').val('circle').prop('selected',true);
			// $('#pointPreview').text($('#simple-marker-type').val('circle').text());
			if (value !== "2") {
				$("#rule-based-label").val("");
				$("#rule-based-filter").val("");
				$("#sym_keyword").val("");
				$("#point-sample-attribute-body").html("");

			}

			$("#simple-marker-type2").val("circle").trigger("change");
			$("#simpleMarkerSize2").val("14").trigger("change");
			$("#simpleMarkerColor2").val("#000000").trigger("change");
			$("#simpleMarkerOulineWidth2").val("0").trigger("change");
			$("#simpleMarkerOutlineColor2").val("#000000").trigger("change");

			$("#upload2").val("첨부파일");
			$("#simpleImgMarkerWidth2").val("0").trigger("change");
			$("#simpleImgMarkerHeight2").val("0").trigger("change");
			$("#dialInnerValue2").val("0").trigger("change");

			$("#expression_bulid_area").text("");

			$("#imageFile2").val("");

			$("#calArea").hide();

			D_LAYER_STYLE.SLIDER.global.slider2
				.data("ionRangeSlider")
				.update({ from: 100 });
		},
		initDataSimpleLine: function() {// 심플라인 초기화
			$("#lineStrokeWidth").val("3").trigger("change");

			$("#lineStrokeDasharray").val("0").trigger("change");
			$("#lineStrokeColor").val("#000000").trigger("change");
			$("#lineOffSet").val("0").trigger("change");
			D_LAYER_STYLE.SLIDER.global.slider5
				.data("ionRangeSlider")
				.update({ from: 100 });
		},
		initDataSimpleRuleLine: function() {// 규칙라인 초기화
			$("#rule_lineStrokeWidth").val("3").trigger("change");

			$("#rule_lineStrokeDasharray").val("0").trigger("change");
			$("#rule_lineStrokeColor").val("#000000").trigger("change");
			$("#rule_lineOffSet").val("0").trigger("change");
			D_LAYER_STYLE.SLIDER.global.slider6
				.data("ionRangeSlider")
				.update({ from: 100 });
		},
		initDataMarkerLine: function() {// 마커라인 초기화
			$("#simple-marker-line-type").val("circle").trigger("change");
			$("#simpleLineMarkerSize").val("14").trigger("change");
			$("#lineMarkerOffset").val("10").trigger("change");
			$("#lineStrokeColor").val("#000000").trigger("change");
			$("#lineMarkerOutlineWitdh").val("0").trigger("change");
			$("#lineStrokeOutlineColor").val("#000000").trigger("change");

			D_LAYER_STYLE.SLIDER.global.slider5
				.data("ionRangeSlider")
				.update({ from: 100 });
		},
		initDataMarkerRuleLine: function() {// 마커라인 규칙 초기화
			$("#rule_simple-marker-line-type").val("circle").trigger("change");
			$("#rule_simpleLineMarkerSize").val("14").trigger("change");
			$("#rule_lineMarkerOffset").val("10").trigger("change");
			$("#rule_lineStrokeColor").val("#000000").trigger("change");
			$("#rule_lineMarkerOutlineWitdh").val("0").trigger("change");
			$("#rule_lineStrokeOutlineColor").val("#000000").trigger("change");

			D_LAYER_STYLE.SLIDER.global.slider6
				.data("ionRangeSlider")
				.update({ from: 100 });
		},
		initSimplePolygon: function() {
			$('#polygonPreview').css('border', '3px solid black');
			$('#polygonPreview').css('width', '100px');
			$('#polygonPreview').css('height', '100px');
			$('#polygonPreview').css('background-color', 'white');

			$('#polygonDasharray').val("0").trigger('change');
			$('#polygonStrokeColor').val("#000000").trigger('change');
			$('#polygonStrokeWidth').val("3").trigger('change');
			$('#polygonFillColor').val("#FFFFFF").trigger('change');


			D_LAYER_STYLE.SLIDER.global.slider7
				.data("ionRangeSlider")
				.update({ from: 100 });

		},
		initImagePolygon: function() {
			$('#upload3').val('첨부파일');
			$('#polygonImgWidth').val('0');
			$('#polygonImgHeight').val('0');
			$('polygonImageOffsetX').val('0');
			$('polygonImageOffsetY').val('0');

			D_LAYER_STYLE.SLIDER.global.slider7
				.data("ionRangeSlider")
				.update({ from: 100 });
		},
		initSimplePolygon2: function() {
			$('#polygonPreview2').css('border', '3px solid black');
			$('#polygonPreview2').css('width', '100px');
			$('#polygonPreview2').css('height', '100px');
			$('#polygonPreview2').css('background-color', 'white');

			$('#polygonDasharray2').val("0").trigger('change');
			$('#polygonStrokeColor2').val("#000000").trigger('change');
			$('#polygonStrokeWidth2').val("3").trigger('change');
			$('#polygonFillColor2').val("#FFFFFF").trigger('change');
			$("[name=setFilterDefaultRadio][value=filter]").prop("checked", true).click();


			D_LAYER_STYLE.SLIDER.global.slider8
				.data("ionRangeSlider")
				.update({ from: 100 });

		},
		initImagePolygon2: function() {
			$('#upload4').val('첨부파일');
			$('#polygonImgWidth2').val('0');
			$('#polygonImgHeight2').val('0');
			$('polygonImageOffsetX2').val('0');
			$('polygonImageOffsetY2').val('0');

			D_LAYER_STYLE.SLIDER.global.slider7
				.data("ionRangeSlider")
				.update({ from: 100 });
		},
		saveSymbolStyle: function() {
			if (D_LAYER_STYLE.SYMBOL.SHP.global.shpType == "point" || D_LAYER_STYLE.SYMBOL.SHP.global.shpType == "multipoint") {
				var symbolType = $("#point-symbol-rule option:selected").val();
				var makerType = $("#point-symbol-type option:selected").val();
				// 
				// 단일 심볼
				if (symbolType === "0" && makerType === "0") {
					// 단일심볼,단순 마커
					/*          console.log($("#simple-marker-type option:selected").val()); // 단순마커
																							// 지정
							  console.log($("#simpleMarkerSize").val()); // 크기
							  console.log($("#simpleMarkerColor").val()); // 채우기 색상
							  console.log($("#simpleMarkerOulineWidth").val()); // 외곽선 너비
							  console.log($("#simpleMarkerOutlineColor").val()); // 외곽선 색상
							  console.log(D_LAYER_STYLE.SLIDER.global.simpleMakerSliderValue); // 불투명도
							  console.log($(".knob-example input").val()); // 회전*/


					let simple_point_obj = {
						id: "",
						marker: 0, // 0 : 단순마커, 1 : 이미지 마커 = > 전부 px 단위
						labelName: "", // 라벨명
						filter: "", // 필터
						simpleMarker: "", // 마커유형 심플마커
						size: "",
						color: "",
						outlineWidth: "",
						outlineColor: "",
						opacity: "",
						rotation: "",
						imageWidth: "",
						imageHeight: "",
						imageFileName: "",
						imageFileFormat: "",
						imageFilePath: "",
						elseFlag: "no"
					};

					var point_Obj_arr = [];

					simple_point_obj.id = "simple";
					simple_point_obj.marker = 0;
					simple_point_obj.simpleMarker = $("#simple-marker-type option:selected").val();
					simple_point_obj.size = $("#simpleMarkerSize").val();
					simple_point_obj.color = $("#simpleMarkerColor").val();
					simple_point_obj.outlineWidth = $("#simpleMarkerOulineWidth").val();
					simple_point_obj.outlineColor = $("#simpleMarkerOutlineColor").val();
					simple_point_obj.opacity = D_LAYER_STYLE.SLIDER.global.simpleMakerSliderValue;
					simple_point_obj.rotation = $(".knob-example input").val();

					point_Obj_arr.push(simple_point_obj);
					D_LAYER_STYLE.SYMBOL.global.point_ruleGroup = [];
					D_LAYER_STYLE.SYMBOL.global.point_ruleGroup = [simple_point_obj];

					// D_LAYER_STYLE.SYMBOL.updateSavedSymbolStyle(point_Obj_arr);

				} else if (symbolType === "0" && makerType === "1") {
					// 단일 심볼,이미지 마커
					// if(D_LAYER_STYLE.Util.isEmpty($('#upload1').val())){
					// alert('파일을 첨부해주세요.')
					// return false;
					// }
					// 이미지마커


					let simple_img_point_obj = {
						id: "",
						marker: 0, // 0 : 단순마커, 1 : 이미지 마커 = > 전부 px 단위
						labelName: "", // 라벨명
						filter: "", // 필터
						simpleMarker: "", // 마커유형 심플마커
						size: "",
						color: "",
						outlineWidth: "",
						outlineColor: "",
						opacity: "",
						rotation: "",
						imageWidth: "",
						imageHeight: "",
						imageFileName: "",
						imageFileFormat: "",
						imageFilePath: "",
						elseFlag: "no"
					};

					var point_Obj_arr = [];

					simple_img_point_obj.id = "simpleImg";
					simple_img_point_obj.marker = 1;
					simple_img_point_obj.imageWidth = $("#simpleImgMarkerWidth").val();
					simple_img_point_obj.imageHeight = $("#simpleImgMarkerHeight").val();
					simple_img_point_obj.imageFileFormat = $("#imageFile").val().split(".")[1] != null ? $("#imageFile").val().split(".")[1] : "";;
					simple_img_point_obj.opacity = D_LAYER_STYLE.SLIDER.global.simpleMakerSliderValue;
					simple_img_point_obj.rotation = $(".knob-example input").val();
					simple_img_point_obj.imageFilePath = D_LAYER_STYLE.FILE.global.upoloaded_img_file_path;

					point_Obj_arr.push(simple_img_point_obj);

					D_LAYER_STYLE.SYMBOL.global.point_ruleGroup = [];
					D_LAYER_STYLE.SYMBOL.global.point_ruleGroup = [simple_img_point_obj];

					// D_LAYER_STYLE.SYMBOL.updateSavedSymbolStyle(point_Obj_arr);


				} else if (symbolType === "1") {
					// 규칙 기반 심볼,단순 마커

					var selectedRuledStyles = [];
					$('input:checkbox[name="added-rule-group"]:checked').each(function(
						k,
						kVal
					) {
						let row = kVal.parentElement.parentElement;

						var index = D_LAYER_STYLE.SYMBOL.global.point_ruleGroup.findIndex(
							(v) => v.id == kVal.id
						);

						selectedRuledStyles.push(D_LAYER_STYLE.SYMBOL.global.point_ruleGroup[index]);
					});



					// D_LAYER_STYLE.SYMBOL.updateSavedSymbolStyle(selectedRuledStyles);

				}
			} else if (D_LAYER_STYLE.SYMBOL.SHP.global.shpType == "line" || D_LAYER_STYLE.SYMBOL.SHP.global.shpType == "linestring" || D_LAYER_STYLE.SYMBOL.SHP.global.shpType == "multilinestring") {
				// 라인
				var lineSymbolType = $("#line-symbol-rule option:selected").val();
				var lineMakerType = $("#line-symbol-type option:selected").val();
				// 단일 심볼
				if (lineSymbolType === "0" && lineMakerType === "0") {
					// 단일심볼,단순 라인


					let simple_line_obj = {
						id: "",
						marker: 0, // 0 : 단순마커, 1 : 이미지 마커 = > 전부 px 단위
						labelName: "", // 라벨명
						filter: "", // 필터
						simpleMarker: "", // 마커유형 심플마커
						lineType: "",
						lineStrokeWidth: "",
						lineOffset: "",
						opacity: "",
						lineColor: "",
						markerSize: "",
						lineMarkerOffSet: "",
						outlineWidth: "",
						outlineColor: "",
						elseFlag: "no"
					};

					var line_Obj_arr = [];

					simple_line_obj.id = "simpleline";
					simple_line_obj.marker = 2;// 심플라인
					simple_line_obj.lineStrokeWidth = $('#lineStrokeWidth').val();
					simple_line_obj.simpleMarker = '';// 단순라인,마커라인
					simple_line_obj.lineType = $('#lineStrokeDasharray option:selected').val();
					simple_line_obj.lineOffset = $('#lineOffSet').val();
					simple_line_obj.opacity = D_LAYER_STYLE.SLIDER.global.simpleMakerSliderValue5;
					simple_line_obj.lineColor = $('#lineStrokeColor').val();


					line_Obj_arr.push(simple_line_obj);
					D_LAYER_STYLE.SYMBOL.global.line_ruleGroup = [];
					D_LAYER_STYLE.SYMBOL.global.line_ruleGroup = [simple_line_obj];

				} else if (lineSymbolType === "0" && lineMakerType === "1") {
					let marker_line_obj = {
						id: "",
						marker: 0, // 0 : 단순마커, 1 : 이미지 마커 = > 전부 px 단위
						labelName: "", // 라벨명
						filter: "", // 필터
						simpleMarker: "", // 마커유형 심플마커
						lineType: "",
						lineStrokeWidth: "",
						lineOffset: "",
						opacity: "",
						lineColor: "",
						markerSize: "",
						lineMarkerOffSet: "",
						outlineWidth: "",
						outlineColor: "",
						elseFlag: "no"

					};

					var line_Obj_arr = [];

					marker_line_obj.id = "simpleline";
					marker_line_obj.marker = 3;// 마커라인
					marker_line_obj.lineStrokeWidth = $('#lineStrokeWidth').val();
					marker_line_obj.simpleMarker = $('#simple-marker-line-type option:selected').val();// 단순라인,마커라인
					marker_line_obj.lineType = $('#lineStrokeDasharray option:selected').val();
					marker_line_obj.lineOffset = $('#lineOffSet').val();
					marker_line_obj.opacity = D_LAYER_STYLE.SLIDER.global.simpleMakerSliderValue5;
					marker_line_obj.lineColor = $('#lineStrokeColor').val();
					marker_line_obj.markerSize = $('#simpleLineMarkerSize').val()
					marker_line_obj.lineMarkerOffSet = $('#lineMarkerOffset').val();
					marker_line_obj.outlineWidth = $('#lineMarkerOutlineWitdh').val();
					marker_line_obj.outlineColor = $('#lineStrokeOutlineColor').val();

					line_Obj_arr.push(marker_line_obj);
					D_LAYER_STYLE.SYMBOL.global.line_ruleGroup = [];
					D_LAYER_STYLE.SYMBOL.global.line_ruleGroup = [marker_line_obj];

				} else if (lineSymbolType === "1") {
					// 규칙 기반 심볼,단순 마커

					// console.log(D_LAYER_STYLE.SYMBOL.global.point_ruleGroup);
				}
			} else if (D_LAYER_STYLE.SYMBOL.SHP.global.shpType == "polygon" || D_LAYER_STYLE.SYMBOL.SHP.global.shpType == "multipolygon") {// 폴리곤
				// 폴리곤
				var polygonSymbolType = $("#polygon-symbol-rule option:selected").val();
				var polygonMakerType = $("#polygon-symbol-type option:selected").val();


				if (polygonSymbolType == "0" && polygonMakerType == "0") {// 단일 심볼,단순 폴리곤
					let simple_polygon_obj = {
						id: "",
						marker: 0, // 0 : 단순마커, 1 : 이미지 마커 ,2 라인 심플, 3 라인 마커,4 라벨,5 폴리곤
						// 심플,6 폴리곤 이미지 = > 전부 px 단위
						labelName: "", // 라벨명
						filter: "", // 필터
						simpleMarker: "", // 마커유형 심플마커
						lineType: "",// 획 스타일
						lineColor: "",// 획 색상
						lineWidth: "",
						fillColor: "",// 채우기 색상
						opacity: "",
						imageWidth: "",
						imageHeight: "",
						imageOffsetX: "",
						imageOffsetY: "",
						imageFilePath: "",
						imageFileName: "",
						imageFileFormat: "",
						elseFlag: "no"
					};

					var polygon_Obj_arr = [];

					simple_polygon_obj.id = "simplePolygon" // +D_LAYER_STYLE.SYMBOL.global.symbolCnt;
					simple_polygon_obj.marker = 5;// 심플 폴리곤
					simple_polygon_obj.lineType = $('#polygonDasharray option:selected').val();
					simple_polygon_obj.lineColor = $('#polygonStrokeColor').val();// 단순라인,마커라인
					simple_polygon_obj.lineWidth = $('#polygonStrokeWidth').val();
					simple_polygon_obj.fillColor = $('#polygonFillColor').val();
					simple_polygon_obj.opacity = D_LAYER_STYLE.SLIDER.global.simpleMakerSliderValue7;

					polygon_Obj_arr.push(simple_polygon_obj);
					D_LAYER_STYLE.SYMBOL.global.polygon_ruleGroup = [];
					D_LAYER_STYLE.SYMBOL.global.polygon_ruleGroup = [simple_polygon_obj];

				} else if (polygonSymbolType == "0" && polygonMakerType == "1") {// 단일 심볼,이미지
					// 폴리곤


					let simple_polygon_obj = {
						id: "",
						marker: 0, // 0 : 단순마커, 1 : 이미지 마커 ,2 라인 심플, 3 라인 마커,4 라벨,5 폴리곤
						// 심플,6 폴리곤 이미지 = > 전부 px 단위
						labelName: "", // 라벨명
						filter: "", // 필터
						simpleMarker: "", // 마커유형 심플마커
						lineType: "",// 획 스타일
						lineColor: "",// 획 색상
						lineWidth: "",
						fillColor: "",// 채우기 색상
						opacity: "",
						imageWidth: "",
						imageHeight: "",
						imageOffsetX: "",
						imageOffsetY: "",
						imageFilePath: "",
						imageFileName: "",
						imageFileFormat: "",
						elseFlag: "no"
					};

					var polygon_Obj_arr = [];

					simple_polygon_obj.id = "simplePolygon";
					simple_polygon_obj.marker = 6;// 이미지 폴리곤
					simple_polygon_obj.lineStrokeWidth = "";
					simple_polygon_obj.simpleMarker = $('#polygon-symbol-type option:selected').val();// 단순라인,마커라인
					simple_polygon_obj.opacity = D_LAYER_STYLE.SLIDER.global.simpleMakerSliderValue7;
					simple_polygon_obj.imageWidth = $('#polygonImgWidth').val();
					simple_polygon_obj.imageHeight = $('#polygonImgHeight').val();
					simple_polygon_obj.imageOffsetX = $('#polygonImageOffsetX').val();
					simple_polygon_obj.imageOffsetY = $('#polygonImageOffsetY').val();
					simple_polygon_obj.imageFilePath = D_LAYER_STYLE.FILE.global.upoloaded_img_file_path;
					simple_polygon_obj.imageFileName = $("#imageFile3").val() != null ? $("#imageFile3").val() : "";
					simple_polygon_obj.imageFileFormat = $("#imageFile3").val().split(".")[1] != null ? $("#imageFile3").val().split(".")[1] : "";

					polygon_Obj_arr.push(simple_polygon_obj);
					D_LAYER_STYLE.SYMBOL.global.polygon_ruleGroup = [];
					D_LAYER_STYLE.SYMBOL.global.polygon_ruleGroup = [simple_polygon_obj];

				} else if (polygonSymbolType == "1") {// 규칙 기반




					var selectedRuledStyles = [];
					$('input:checkbox[name="added-rule-group"]:checked').each(function(
						k,
						kVal
					) {
						let row = kVal.parentElement.parentElement;

						var index = D_LAYER_STYLE.SYMBOL.global.polygon_ruleGroup.findIndex(
							(v) => v.id == kVal.id
						);

						selectedRuledStyles.push(D_LAYER_STYLE.SYMBOL.global.polygon_ruleGroup[index]);
					});


				}





			} else {
				COMMON.alert("shp 유형이 설정되어 있지 않습니다.", "error", function() { return false; });
				return false;
			}
		},
		setSavedSymbolStyle: function(selected_obj_symbol) {
			// 포인트 이미지 심볼
			// $('#simple-marker-type').val('circle').prop('selected',true);
			// $('#pointPreview').text($('#simple-marker-type').val('circle').text());
			if (D_LAYER_STYLE.global.dataType == 'point' || D_LAYER_STYLE.global.dataType == 'multipoint') {
				if (selected_obj_symbol[0].marker == 0) {

					$("#rule-based-label").val(selected_obj_symbol[0].labelName);
					$("#rule-based-filter")
						.val(selected_obj_symbol[0].filter)
						.trigger("change");
					$("#simple-marker-type2")
						.val(selected_obj_symbol[0].simpleMarker)
						.trigger("change");
					$("#simpleMarkerSize2")
						.val(selected_obj_symbol[0].size)
						.trigger("change");
					$("#simpleMarkerColor2")
						.val(selected_obj_symbol[0].color)
						.trigger("change");
					$("#simpleMarkerOulineWidth2")
						.val(selected_obj_symbol[0].outlineWidth)
						.trigger("change"); // 외곽선 너비
					$("#simpleMarkerOutlineColor2")
						.val(selected_obj_symbol[0].outlineColor)
						.trigger("change"); // 외곽선
				} else {

					$("#rule-based-label").val(selected_obj_symbol[0].labelName);
					$("#rule-based-filter")
						.val(selected_obj_symbol[0].filter)
						.trigger("change");
					$("#point-symbol-type2").val("1").trigger("change");
					// $("#upload2").val(selected_obj_symbol[0].image);

					$("#simpleImgMarkerWidth2").val(selected_obj_symbol[0].imageWidth).trigger("change");
					$("#simpleImgMarkerHeight2").val(selected_obj_symbol[0].imageHeight).trigger("change");

					// 이미지 다시 보여주기
					var img = '<img id="imgMarker2" style="width:' + selected_obj_symbol[0].imageWidth + 'px;"/>';
					$("#pointPreview2").html("");
					$("#pointPreview2").append(img);

					$("#imgMarker2").attr("src", selected_obj_symbol[0].imageFilePath);

					// $("#imageFile2").val("");
				}

				$("#dialInnerValue2")
					.val(selected_obj_symbol[0].rotation)
					.trigger("change");

				$("#calArea").hide();

				D_LAYER_STYLE.SLIDER.global.slider2
					.data("ionRangeSlider")
					.update({ from: selected_obj_symbol[0].opacity });

				if (selected_obj_symbol[0].elseFlag == 'true') {
					$('#symbolRuleElseCheck').prop('checked', true).trigger('change');
				} else {
					$('#symbolRuleElseCheck').prop('checked', false).trigger('change');
				}


			} else if (D_LAYER_STYLE.global.dataType == 'line' || D_LAYER_STYLE.global.dataType == 'linestring' || D_LAYER_STYLE.global.dataType == 'multilinestring') {

				if (selected_obj_symbol[0].marker == 2) { // 심플 라인

					$("#rule-based-label").val(selected_obj_symbol[0].labelName);
					$("#rule-based-filter")
						.val(selected_obj_symbol[0].filter)
						.trigger("change");
					$("#rule_line-symbol-type")
						.val("0")
						.trigger("change");
					$("#rule_lineStrokeDasharray")
						.val(selected_obj_symbol[0].lineType)
						.trigger("change");

					$("#rule_lineStrokeWidth")
						.val(selected_obj_symbol[0].lineStrokeWidth)
						.trigger("change");

					$("#rule_lineStrokeColor")
						.val(selected_obj_symbol[0].lineColor)
						.trigger("change");
					$("#rule_lineOffSet")
						.val(selected_obj_symbol[0].lineOffset)
						.trigger("change"); // 외곽선 너비

					D_LAYER_STYLE.SLIDER.global.slider6
						.data("ionRangeSlider")
						.update({ from: selected_obj_symbol[0].opacity });

				} else if (selected_obj_symbol[0].marker == 3) { // 마커 라인

					$("#rule-based-label").val(selected_obj_symbol[0].labelName);
					$("#rule-based-filter")
						.val(selected_obj_symbol[0].filter)
						.trigger("change");

					$('#rule_line-symbol-type').val("1").trigger('change');
					$("#rule_simple-marker-line-type").val(selected_obj_symbol[0].simpleMarker).trigger("change");
					// $("#upload2").val(selected_obj_symbol[0].image);
					$('#rule_simpleLineMarkerSize').val(selected_obj_symbol[0].markerSize).trigger("change");
					$('#rule_lineMarkerOffset').val(selected_obj_symbol[0].lineMarkerOffSet).trigger("change");
					$('#rule_lineStrokeColor').val(selected_obj_symbol[0].lineColor).trigger("change");
					$('#rule_lineMarkerOutlineWitdh').val(selected_obj_symbol[0].outlineWidth).trigger("change");
					$('#rule_lineStrokeOutlineColor').val(selected_obj_symbol[0].outlineColor).trigger("change");

					D_LAYER_STYLE.SLIDER.global.slider6
						.data("ionRangeSlider")
						.update({ from: selected_obj_symbol[0].opacity });
					// $("#simpleImgMarkerWidth2").val(selected_obj_symbol[0].imageWidth).trigger("change");
					// $("#simpleImgMarkerHeight2").val(selected_obj_symbol[0].imageHeight).trigger("change");

					// //이미지 다시 보여주기
					// var img = '<img id="imgMarker2" style="width:' +
					// selected_obj_symbol[0].imageWidth + 'px;"/>';
					// $("#pointPreview2").html("");
					// $("#pointPreview2").append(img);

					// $("#imgMarker2").attr("src",
					// selected_obj_symbol[0].imageFilePath);

					// $("#imageFile2").val("");
				}

				$("#calArea").hide();

				D_LAYER_STYLE.SLIDER.global.slider6
					.data("ionRangeSlider")
					.update({ from: selected_obj_symbol[0].opacity });


				if (selected_obj_symbol[0].elseFlag == 'true') {
					$('#symbolRuleElseCheck').prop('checked', true).trigger('change');
				} else {
					$('#symbolRuleElseCheck').prop('checked', false).trigger('change');
				}


			} else if (D_LAYER_STYLE.global.dataType == 'polygon' || D_LAYER_STYLE.global.dataType == 'multipolygon') {

				if (selected_obj_symbol[0].marker == 5) {

					$("#rule-based-label").val(selected_obj_symbol[0].labelName);
					$("#rule-based-filter")
						.val(selected_obj_symbol[0].filter)
						.trigger("change");

					$("#polygon-marker-type2")
						.val(selected_obj_symbol[0].simpleMarker)
						.trigger("change");

					$("#polygonDasharray2")
						.val(selected_obj_symbol[0].lineType)
						.trigger("change");

					$("#polygonStrokeColor2")
						.val(selected_obj_symbol[0].lineColor)
						.trigger("change");

					$("#polygonStrokeWidth2")
						.val(selected_obj_symbol[0].lineWidth)
						.trigger("change");

					$("#polygonFillColor2")
						.val(selected_obj_symbol[0].fillColor)
						.trigger("change"); // 외곽선 너비


					D_LAYER_STYLE.SLIDER.global.slider8
						.data("ionRangeSlider")
						.update({ from: selected_obj_symbol[0].opacity });

				} else if (selected_obj_symbol[0].marker == 6) {

					// let simple_polygon_obj = {
					// id: "",
					// marker: 0, // 0 : 단순마커, 1 : 이미지 마커 ,2 라인 심플, 3 라인 마커,4 라벨,5 폴리곤
					// 심플,6 폴리곤 이미지 = > 전부 px 단위
					// labelName: "", //라벨명
					// filter: "", //필터
					// simpleMarker: "", //마커유형 심플마커
					// lineType:"",//획 스타일
					// lineColor:"",//획 색상
					// lineWidth:"",
					// fillColor:"",//채우기 색상
					// opacity:"",
					// imageWidth:"",
					// imageHeight:"",
					// imageOffsetX:"",
					// imageOffsetY:"",
					// imageFilePath:""
					// };

					$("#rule-based-label").val(selected_obj_symbol[0].labelName);
					$("#rule-based-filter")
						.val(selected_obj_symbol[0].filter)
						.trigger("change");
					$("#polygon-symbol-type2").val("1").trigger("change");


					$("#polygonImgWidth2").val(selected_obj_symbol[0].imageWidth).trigger("change");
					$("#polygonImgHeight2").val(selected_obj_symbol[0].imageHeight).trigger("change");

					$("#polygonImageOffsetX2").val(selected_obj_symbol[0].imageOffsetX).trigger("change");
					$("#polygonImageOffsetY2").val(selected_obj_symbol[0].imageOffsetY).trigger("change");


					// 이미지 다시 보여주기
					var img = '<img id="imgMarker4" style="width:' + selected_obj_symbol[0].imageWidth + 'px;"/>';
					$("#polygonPreview2").html("");
					$("#polygonPreview2").append(img);

					$("#imgMarker4").attr("src", selected_obj_symbol[0].imageFilePath);

				}

				$("#calArea").hide();

				D_LAYER_STYLE.SLIDER.global.slider8
					.data("ionRangeSlider")
					.update({ from: selected_obj_symbol[0].opacity });



				if (selected_obj_symbol[0].elseFlag == 'true') {
					$('#symbolRuleElseCheck').prop('checked', true).trigger('change');
				} else {
					$('#symbolRuleElseCheck').prop('checked', false).trigger('change');
				}
			}

			if (selected_obj_symbol[0].filter == "") $("[name=setFilterDefaultRadio][value=default]").prop("checked", true).click();
		},
		updateSavedSymbolStyle: function(styleObjArr) {


			var url1 = "./geodt/getStyle.do";

			var formData = new FormData();
			formData.append('DATAID', D_LAYER_STYLE.global.dataId);
			formData.append('SHPTYPE', D_LAYER_STYLE.global.dataType);

			formData.append('SETTING', JSON.stringify(styleObjArr));

			var symbolRule = '';

			if (D_LAYER_STYLE.global.dataType == 'point' || D_LAYER_STYLE.global.dataType == 'multipoint') {
				if ($('#point-symbol-rule option:selected').val() == '1') {
					formData.append('SYMBOL_RULES', $('#rule-box').html().trim());
					formData.append('SYMBOL_GROUP', JSON.stringify(D_LAYER_STYLE.SYMBOL.global.point_ruleGroup));
					formData.append('SYMBOL_RULES_Flag', '1');

				} else {

					formData.append('SYMBOL_GROUP', JSON.stringify(D_LAYER_STYLE.SYMBOL.global.point_ruleGroup));
					formData.append('SYMBOL_RULES_Flag', '0');
				}
			} else if (D_LAYER_STYLE.global.dataType == 'line' || D_LAYER_STYLE.global.dataType == 'linestring' || D_LAYER_STYLE.global.dataType == 'multilinestring') {
				if ($('#line-symbol-rule option:selected').val() == '1') {
					formData.append('SYMBOL_RULES', $('#line-rule-box').html().trim());
					formData.append('SYMBOL_GROUP', JSON.stringify(D_LAYER_STYLE.SYMBOL.global.line_ruleGroup));
					formData.append('SYMBOL_RULES_Flag', '1');
				} else {

					formData.append('SYMBOL_GROUP', JSON.stringify(D_LAYER_STYLE.SYMBOL.global.line_ruleGroup));
					formData.append('SYMBOL_RULES_Flag', '0');
				}
			} else if (D_LAYER_STYLE.global.dataType == 'polygon' || D_LAYER_STYLE.global.dataType == 'multipolygon') {
				if ($('#polygon-symbol-rule option:selected').val() == '1') {
					formData.append('SYMBOL_RULES', $('#polygon-rule-box').html().trim());
					formData.append('SYMBOL_GROUP', JSON.stringify(D_LAYER_STYLE.SYMBOL.global.polygon_ruleGroup));
					formData.append('SYMBOL_RULES_Flag', '1');
				} else {

					formData.append('SYMBOL_GROUP', JSON.stringify(D_LAYER_STYLE.SYMBOL.global.polygon_ruleGroup));
					formData.append('SYMBOL_RULES_Flag', '0');
				}
			}

			var labelRule = '';

			if ($('#symbol-label-rule option:selected').val() == '2') {
				formData.append('LABEL_RULES', $('#label-rule-box').html().trim());
				formData.append('LABEL_GROUP', JSON.stringify(D_LAYER_STYLE.LABEL.global.label_ruleGroup));
				formData.append('LABEL_RULES_Flag', '1');

				/*if($('#showLabelSymbolSelectedOnly').is(":checked")){
					formData.append('LABEL_ONLY_Flag','1');
				}else{
					formData.append('LABEL_ONLY_Flag','0');
				}*/
			} else {

				formData.append('LABEL_GROUP', JSON.stringify(D_LAYER_STYLE.LABEL.global.label_ruleGroup));
				formData.append('LABEL_RULES_Flag', '0');
			}

			$.ajax({
				url: url1,
				type: "POST",
				data: formData,
				dataType: "json",
				async: false,
				contentType: false,
				processData: false,
				success: function(result) {
					if (result.result == "success") {
						COMMON.alert('스타일 적용이 완료되었습니다.', 'success', function() {
							$('#exampleModalCenter').modal('hide');
							/*if($('#legendInfoDiv').css('display')!='none'){
								D_LAYER_STYLE.LEGEND.getLegendFromGeoserver(D_LAYER_STYLE.global.fullLayerName);	
							}*/
							D_LAYER_STYLE.MODALS.resetForm();
							var layerList = new Module.JSLayerList(false);
							var layer = layerList.nameAtLayer("layerWMS");
							if (layer != null) {
								layer.clearWMSCache();
							}
						});
					} else {
						COMMON.alert('서버에서 오류가 발생하였습니다.', 'error', function() { return false; });
					}

				},
				fail: function(result) {

					COMMON.alert("네트워크 통신 중,문제가 발생하였습니다.", 'error', function() { return false; });
				},
			});

		},
		checkSymbolDefaultExist:function(){
			//기존 규칙에 디폴트가 있는지 체크
			var result = false;//false는 기존 디폴트가 없는 경우
			var selected = D_LAYER_STYLE.SYMBOL.global.clickedSymbolId;
			if(D_LAYER_STYLE.global.dataType=='point'||D_LAYER_STYLE.global.dataType=='multipoint'){
				D_LAYER_STYLE.SYMBOL.global.point_ruleGroup.forEach((v,i)=>{
						if(v.defaultFlag=='1'){ //디폴트가 이미 설정된 규칙이 있는 경우
							result = true;
							if(v.id ===selected){ //규칙 수정 중에 기존의 동일 규칙이 디폴트로 설정되어있던 경우
								result = false;	
							}
						}
					}
				);
			}else if (D_LAYER_STYLE.global.dataType == "line" || D_LAYER_STYLE.global.dataType == "linestring" || D_LAYER_STYLE.global.dataType == "multilinestring"){
				D_LAYER_STYLE.SYMBOL.global.line_ruleGroup.forEach((v,i)=>{
						if(v.defaultFlag=='1'){
							result = true;
							if(v.id ===selected){
								result = false;	
							}
						}
					}
				);
			}else if(D_LAYER_STYLE.global.dataType == "polygon" || D_LAYER_STYLE.global.dataType == "multipolygon"){
				D_LAYER_STYLE.SYMBOL.global.polygon_ruleGroup.forEach((v,i)=>{
						if(v.defaultFlag=='1'){
							result = true;
							if(v.id ===selected){
								result = false;	
							}
						}
					}
				);
			}
			return result;
			
		},
		setSavedSymbolStyleCnt:function(){
			var cnt_arr = [];
			if($('.added-rule-row').length>0){//기존 규칙이 있는 경우 새로운 규칙을 추가할 때, rowId가 가장 놓은 것의 +1 로 아이디 설정
				for(var i=0;i<$('.added-rule-row').length;i++){
					cnt_arr.push(parseInt($('.added-rule-row').children().find('input')[i].id.split('symbolrow_')[1]));
				}
			}
			var symbolMaxCnt = Math.max.apply(null, cnt_arr)+1;
			return symbolMaxCnt;
		}
	},
	LABEL: {
		global: {
			label_ruleGroup: [],
			labelCnt: 0,
			labelUpdateFlag: false,
			clickedLabelId: "",
			labelOK: false,
			selectedColumn: '',
			elseFlag: false,
			tempFilterText:""
		},
		initBasicLabel: function() {
			// 라벨 화면
			$("#symbol-label-rule").on("change", function() {
				if ($(this).val() === "0") {
					$(".no-label-symbol").show(); // 라벨 없음
					$(".one-label-symbol").hide();
					$(".rule-based-label-symbol").hide();
					D_LAYER_STYLE.LABEL.initData3();
				} else if ($(this).val() === "1") { // 단일 라벨
					$(".no-label-symbol").hide();
					$(".one-label-symbol").show();
					$(".rule-based-label-symbol").hide();
					D_LAYER_STYLE.LABEL.initData3();
					D_LAYER_STYLE.LABEL.callLabelColumnByDataId(D_LAYER_STYLE.global.dataId);
					D_LAYER_STYLE.LABEL.createAttrSample();
				} else if ($(this).val() === "2") { // 규칙기반 라벨
					$(".no-label-symbol").hide();
					$(".one-label-symbol").hide();
					$(".rule-based-label-symbol").show();
					D_LAYER_STYLE.LABEL.initData3();
				}
			});

			// 라벨 - 포인터 심플 마커 라벨 크기
			$("#point-label-fontFamily").on("change", function() {
				var font = $("#point-label-fontFamily option:selected").text();
				$("#labelPointText").css("font-family", font);
			});

			$("#simpleMarkerLabelTextSize").on("change", function() {
				var maxSize = 85;
				var size = $(this).val();
				if (maxSize < size) {
					size = maxSize;
					COMMON.alert("최대 라벨 사이즈는 85px입니다.", "error", function() { $("#simpleMarkerLabelTextSize").val(size); });
				}
				$("#labelPointText").css("font-size", size + "px");
			});

			$("#simpleMarkerColor3").on("change", function() {
				var color = $(this).val();
				$("#labelPointText").css("color", color);
			});

			$("#simpleLabelXaxis").on("change", function() {
				$("#labelPointText").css("left", $(this).val() + "px");
			});

			$("#simpleLabelYaxis").on("change", function() {
				$("#labelPointText").css("bottom", $(this).val() + "px");
			});

			$("#halo,#simpleLabelBufferColor").on("change", function() {
				var outlineColor = $("#simpleLabelBufferColor").val();
				var outlineWidth = $("#halo").val() + "px";

				// -1px 0 #000, 0 1px #000, 1px 0 #000, 0 -1px #000

				// var textShadowValue = '-'+outlineWidth+'px 0'+outlineColor+','+'0
				// '+outlineWidth+'px '+outlineColor+','+outlineWidth+'px 0
				// '+outlineColor+', 0 -'+outlineWidth+'px '+outlineColor;

				// $('#pointPreview').css('text-shadow',textShadowValue);

				$("#labelPointText").css(
					"-webkit-text-stroke",
					outlineWidth + " " + outlineColor
				);
			});

			// 라벨- >규칙기반 - 포인터 심플 마커 라벨 크기
			$("#point-label-fontFamily-modal").on("change", function() {

				var font = $("#point-label-fontFamily-modal option:selected").text();
				$("#labelPointText-modal").css("font-family", font);
			});


			$("#simpleMarkerLabelTextSize-modal").on("change", function() {
				var maxSize = 85;
				var size = $(this).val();
				if (maxSize < size) {
					size = maxSize;
					COMMON.alert("최대 라벨 사이즈는 85px입니다.", "error", function() {
						$("#simpleMarkerLabelTextSize-modal").val(size);
					});
				}
				$("#labelPointText-modal").css("font-size", size + "px");
			});

			$("#simpleMarkerColor3-modal").on("change", function() {
				var color = $(this).val();
				$("#labelPointText-modal").css("color", color);
			});

			$("#simpleLabelXaxis-modal").on("change", function() {
				$("#labelPointText-modal").css("left", $(this).val() + "px");
			});

			$("#simpleLabelYaxis-modal").on("change", function() {
				$("#labelPointText-modal").css("bottom", $(this).val() + "px");
			});

			$("#halo-modal,#simpleLabelBufferColor-modal").on("change", function() {
				var outlineColor = $("#simpleLabelBufferColor-modal").val();
				var outlineWidth = $("#halo-modal").val() + "px";

				// -1px 0 #000, 0 1px #000, 1px 0 #000, 0 -1px #000

				// var textShadowValue = '-'+outlineWidth+'px 0'+outlineColor+','+'0
				// '+outlineWidth+'px '+outlineColor+','+outlineWidth+'px 0
				// '+outlineColor+', 0 -'+outlineWidth+'px '+outlineColor;

				// $('#pointPreview').css('text-shadow',textShadowValue);

				$("#labelPointText-modal").css(
					"-webkit-text-stroke",
					outlineWidth + " " + outlineColor
				);
			});

			$("#saveRuleLabelBtn").on("click", function() {
				if ($("#showLabelBtn").hasClass("active")) {
					// 심볼 속성 선택중

					// 라벨,필터 인풋 널 공백 체크
					var labelName = $("#rule-based-labelinput-modal").val();
					var filter = $("#rule-based-filter-modal").val();
					
					var filterLabelDefault = $("[name='setLabelFilterDefaultRadio']:checked").val();

					if (D_LAYER_STYLE.Util.isEmpty(labelName)) {
						COMMON.alert("라벨을 입력해주세요", 'error', function() {
							$("#rule-based-labelinput-modal").focus();
						});
						return false;
					} else if (filterLabelDefault=="filter"&&D_LAYER_STYLE.Util.isEmpty(filter)) {
						COMMON.alert("필터를 입력해주세요", 'error', function() {
							$("#rule-based-filter-modal").focus();
						});
						return false;
					}
					
					/*var checkLabelRule = D_LAYER_STYLE.TEST.checkLabelExpressionBeforeSave();

					if (!checkLabelRule) {
						COMMON.alert('유효하지 않은 식입니다. \n다시 입력해주세요.', 'error', function() { return false; })
						return false;
					}*/
					
					
					var check_result = true;
					if (filterLabelDefault == "filter") {
						check_result = D_LAYER_STYLE.TEST.checkLabelExpressionBeforeSave();// 저장전에 규칙이 사용가능한지 체크(동기)
					}
					if (check_result == false) {
						COMMON.alert('유효하지 않은 식입니다.\n 다시 입력해주세요.', "error", function() {
							$('#rule-based-filter-modal').focus();
						});
						return false;
					}
					
					if(D_LAYER_STYLE.LABEL.checkLabelDefaultExist()){
						if($("[name='setLabelFilterDefaultRadio']:checked").val()==="default"?true:false){
							COMMON.alert('디폴트 설정은 \n 한 개만 설정이 가능합니다.', "error", function() {
								$('[name = "setLabelFilterDefaultRadio"]').focus();
							});
							return false;	
						}
					}
					
					var html = "";
					var labelName = $("#rule-based-labelinput-modal").val();
					var rule = $("#rule-based-filter-modal").val();
					
					var defaultLabelCheck = $("[name='setLabelFilterDefaultRadio']:checked").val() == "filter" ? "" : '<span class="d-block" style="border: 3px solid #fff;width: 14px;height: 14px;border-radius: 10px;"></span>';
					
					var symbolLabelText = "";

					// 라벨
					// var pointSymbolType = $("#point-symbol-type2
					// option:selected").val();

					var labelViewHtml = $("#labelPointText-modal").clone(true);
					labelViewHtml = labelViewHtml[0];

					labelViewHtml.style.fontSize = "14px";
					labelViewHtml.id = "labelPreveiw2RuleId";
					symbolLabelText +=
						'<div class="border border-1" style="overflow:hidden;">';
					symbolLabelText += labelViewHtml.outerHTML;
					symbolLabelText += "</div>";
					// 
					if (D_LAYER_STYLE.LABEL.global.labelUpdateFlag) {
						// 만약 추가된 규칙의 로우를 수정할려고 할 경우
						var clickedRowId = D_LAYER_STYLE.LABEL.global.clickedLabelId;

						D_LAYER_STYLE.LABEL.global.label_ruleGroup.forEach((obj, index) => {
							if (obj.id === clickedRowId) {
								D_LAYER_STYLE.LABEL.global.label_ruleGroup[index].marker = 4; // 라벨
								D_LAYER_STYLE.LABEL.global.label_ruleGroup[index].labelName = $(
									"#rule-based-labelinput-modal"
								).val();
								D_LAYER_STYLE.LABEL.global.label_ruleGroup[index].filter = $(
									"#rule-based-filter-modal"
								).val();
								D_LAYER_STYLE.LABEL.global.label_ruleGroup[index].attribute = $(
									"#point-symbol-attr-type-modal option:selected"
								).val();
								D_LAYER_STYLE.LABEL.global.label_ruleGroup[index].fontFamily =
									$("#point-label-fontFamily-modal option:selected").val();
								D_LAYER_STYLE.LABEL.global.label_ruleGroup[index].fontSize = $(
									"#simpleMarkerLabelTextSize-modal"
								).val();
								D_LAYER_STYLE.LABEL.global.label_ruleGroup[index].color = $(
									"#simpleMarkerColor3-modal"
								).val();
								D_LAYER_STYLE.LABEL.global.label_ruleGroup[index].Xoffset = $(
									"#simpleLabelXaxis-modal"
								).val();
								D_LAYER_STYLE.LABEL.global.label_ruleGroup[index].Yoffset = $(
									"#simpleLabelYaxis-modal"
								).val();
								D_LAYER_STYLE.LABEL.global.label_ruleGroup[index].buffer =
									$("#halo-modal").val();
								D_LAYER_STYLE.LABEL.global.label_ruleGroup[index].bufferColor =
									$("#simpleLabelBufferColor-modal").val();
								D_LAYER_STYLE.LABEL.global.label_ruleGroup[index].opacity =
									D_LAYER_STYLE.SLIDER.global.simpleMakerSliderValue4;
								D_LAYER_STYLE.LABEL.global.label_ruleGroup[index].rotation =
									$("#dialInnerValue4").val();
								D_LAYER_STYLE.LABEL.global.label_ruleGroup[index].defaultFlag = $("[name='setLabelFilterDefaultRadio']:checked").val()==="filter"?"0":"1";//0필터,1디폴트

								$("#" + clickedRowId)
									.parent()
									.siblings()[0].innerHTML = symbolLabelText;
								$("#" + clickedRowId)
									.parent()
									.siblings()[1].innerHTML = labelName;
								$("#" + clickedRowId)
									.parent()
									.siblings()[2].innerHTML = rule;
								$("#" + clickedRowId)
									.parent()
									.siblings()[3].innerHTML = defaultLabelCheck;
							}
						});

						D_LAYER_STYLE.LABEL.global.labelUpdateFlag = false;
					} else {
						html += '<tr class="label-added-rule-row">';
						html +=
							'<td><input id="labelrow_' +
							D_LAYER_STYLE.LABEL.global.labelCnt +
							'" type="checkbox" name="added-rule-label-group" checked="checked"></td>';
						html += "<td>" + symbolLabelText + "</td>";
						html += "<td class=\"labelName\">" + labelName + "</td>";
						html += "<td class=\"ruleString\">" + rule + "</td>";
						html += "<td class=\"defaultLabelString\" align=\"center\">" + defaultLabelCheck + "</td>";
						html += "<td><Button class=\"buttonLabelString btn-success\" style=\"border-radius: 0.25rem;line-height: 1.1rem;font-size: 12px;width: 40px;\">설정</Button></td>";
						html += "</tr>";

						$("#label-rule-box").append(html);
						
						$(".buttonLabelString").on("click", function() {
							//
							var rowId = $(this).parent().parent().children(":first").find("input")[0].id

					
							D_LAYER_STYLE.LABEL.global.clickedLabelId = rowId;
							D_LAYER_STYLE.LABEL.global.labelUpdateFlag = true;
							$("#rule-based-label-modal").modal("show");

							D_LAYER_STYLE.MODALS.setLabelAttrFromList(rowId);
						});

						// let label_ruleObj = new Object();
						let label_ruleObj = {
							id: "",
							marker: "", // 0 : 단순마커, 1 : 이미지 마커, 2 : 라벨 = > 전부 px 단위
							labelName: "", // 라벨명
							filter: "", // 필터
							attribute: "", // 필드(속성명)
							fontFamily: "", // 글꼴
							fontSize: "",
							color: "", // 채우기 색상
							Xoffset: "",
							Yoffset: "",
							buffer: "",
							bufferColor: "",
							opacity: "",
							rotation: "",
							elseFlag: "false",
							defaultFlag:""
						};
						label_ruleObj.id =
							"labelrow_" + D_LAYER_STYLE.LABEL.global.labelCnt;
						label_ruleObj.marker = 4;
						label_ruleObj.labelName = $("#rule-based-labelinput-modal").val();
						label_ruleObj.filter = $("#rule-based-filter-modal").val();
						label_ruleObj.attribute = $(
							"#point-symbol-attr-type-modal option:selected"
						)
							.text()
							.trim();
						label_ruleObj.fontFamily = $(
							"#point-label-fontFamily-modal option:selected"
						)
							.text()
							.trim();
						label_ruleObj.fontSize = $(
							"#simpleMarkerLabelTextSize-modal"
						).val();
						label_ruleObj.color = $("#simpleMarkerColor3-modal").val();
						label_ruleObj.Xoffset = $("#simpleLabelXaxis-modal").val();
						label_ruleObj.Yoffset = $("#simpleLabelYaxis-modal").val();
						label_ruleObj.buffer = $("#halo-modal").val();
						label_ruleObj.bufferColor = $(
							"#simpleLabelBufferColor-modal"
						).val();
						label_ruleObj.opacity =
							D_LAYER_STYLE.SLIDER.global.simpleMakerSliderValue4;
						label_ruleObj.rotation = $("#dialInnerValue4").val();
						label_ruleObj.defaultFlag =$("[name='setLabelFilterDefaultRadio']:checked").val()==="filter"?"0":"1";//0필터,1디폴트

						D_LAYER_STYLE.LABEL.global.label_ruleGroup.push(label_ruleObj);

						D_LAYER_STYLE.LABEL.initData4();
					}
					D_LAYER_STYLE.LABEL.global.labelCnt++;
				}
			});

			// 전체 선택 버튼
			$("#label-clickAllBtn").on("click", function() {
				$('input:checkbox[name="added-rule-label-group"]').prop(
					"checked",
					true
				);
			});

			// 전체 해제 버튼
			$("#label-unclickAllBtn").on("click", function() {
				$('input:checkbox[name="added-rule-label-group"]:checked').prop(
					"checked",
					false
				);
			});
			// 규칙 삭제
			$("#lgd-label-remove-btn").on("click", function() {
				if (
					$('input:checkbox[name="added-rule-label-group"]:checked').length ===
					0
				) {
					// COMMON.alert('삭제할 항목을 선택해주세요.','error',function(){
					// return false;
					// });

					COMMON.alert("삭제할 항목을 선택해주세요.", 'error', function() {
						return false;
					});
					return false;

				}

				$('input:checkbox[name="added-rule-label-group"]:checked').each(
					function(k, kVal) {
						let row = kVal.parentElement.parentElement;

						var index = D_LAYER_STYLE.LABEL.global.label_ruleGroup.findIndex(
							(v) => v.id == kVal.id
						);

						D_LAYER_STYLE.LABEL.global.label_ruleGroup.splice(index, 1);

						$(row).remove();
					}
				);
			});
			$("[name='setLabelFilterDefaultRadio']").on("click", function() {
				var value = $("[name='setLabelFilterDefaultRadio']:checked").val();
				if (value == "filter") {
					$("#rule-label-btn").removeClass("disabled");
					$("#rule-label-btn").removeAttr("disabled");
					$("#rule-based-filter-modal").removeAttr("disabled");
					$("#label_filter_test").removeClass("disabled");
					$("#label_filter_test").removeAttr("disabled");
					
					$('#rule-based-filter-modal').val(D_LAYER_STYLE.LABEL.global.tempFilterText);
				} else {
					$("#rule-label-btn").addClass("disabled");
					$("#rule-label-btn").attr("disabled", "disabled");
					$("#rule-based-filter-modal").attr("disabled", "disabled");
					$("#label_filter_test").addClass("disabled");
					$("#label_filter_test").attr("disabled", "disabled");
					$("#label-calArea").addClass("active");
					$("#label-calArea").hide();
					
					D_LAYER_STYLE.LABEL.global.tempFilterText=$('#rule-based-filter-modal').val();
					$('#rule-based-filter-modal').val('');
				}
			});

			$("[name='setFilterDefaultRadio']").on("click", function() {
				var value = $("[name='setFilterDefaultRadio']:checked").val();
				if (value == "filter") {
					$("#rule-btn").removeClass("disabled");
					$("#rule-btn").removeAttr("disabled");
					$("#rule-based-filter").removeAttr("disabled");
					$("#filter_test").removeClass("disabled");
					$("#filter_test").removeAttr("disabled");
					$('#rule-based-filter').val(D_LAYER_STYLE.SYMBOL.global.tempFilterText);
				} else {
					$("#rule-btn").addClass("disabled");
					$("#rule-btn").attr("disabled", "disabled");
					$("#rule-based-filter").attr("disabled", "disabled");
					$("#filter_test").addClass("disabled");
					$("#filter_test").attr("disabled", "disabled");
					$("#calArea").addClass("active");
					$("#calArea").hide();
					D_LAYER_STYLE.SYMBOL.global.tempFilterText=$('#rule-based-filter').val();
					$('#rule-based-filter').val('');
				}
			});
		},
		initLabel: function() {
			$("#symbol-label-rule").val("0").trigger("change");
		},
		initData3: function() {
			// 라벨 데이터 초기화
			$('#point-symbol-attr-type option:eq(0)').prop("selected",true).trigger('change');
			$("#point-label-fontFamily").val("고딕").trigger("change");
			$("#simpleMarkerLabelTextSize").val("14").trigger("change");
			$("#simpleMarkerColor3").val("#000000").trigger("change");
			$("#simpleLabelXaxis").val("0").trigger("change");
			$("#simpleLabelYaxis").val("0").trigger("change");
			$("#halo").val("0").trigger("change");
			$("#simpleLabelBufferColor").val("#000000").trigger("change");
			$("#dialInnerValue3").val("0").trigger("change");

			$(".label-added-rule-row").remove();
			D_LAYER_STYLE.LABEL.global.label_ruleGroup = [];
			D_LAYER_STYLE.LABEL.global.labelUpdateFlag = false;

			D_LAYER_STYLE.SLIDER.global.slider3
				.data("ionRangeSlider")
				.update({ from: 100 });
		},
		initData4: function() {
			// 라벨 - 규칙기반 데이터 초기화
			$("#rule-based-labelinput-modal").val("");
			$("#rule-based-filter-modal").val("");
			$("#point-symbol-attr-type-modal").val("속성").trigger("change");
			$("#point-label-fontFamily-modal").val("굴림").trigger("change");
			$("#simpleMarkerLabelTextSize-modal").val("14").trigger("change");
			$("#simpleMarkerColor3-modal").val("#000000").trigger("change");
			$("#simpleLabelXaxis-modal").val("0").trigger("change");
			$("#simpleLabelYaxis-modal").val("0").trigger("change");
			$("#halo-modal").val("0").trigger("change");
			$("#simpleLabelBufferColor-modal").val("#000000").trigger("change");
			$("#dialInnerValue4").val("0").trigger("change");

			$("#expression_bulid_area_label").text("");
			$("#label-calArea").hide();
			$("#label-sample-attribute-body").html("");

			D_LAYER_STYLE.SLIDER.global.slider4
				.data("ionRangeSlider")
				.update({ from: 100 });
			$("[name=setLabelFilterDefaultRadio][value=filter]").prop("checked", true).click();
		},
		callLabelColumnByDataId: function(dataId) {
			var data_id = dataId;

			var url1 ="./geodt/getTableHead.do?DATAID=" + data_id;

			$.ajax({
				url: url1,
				type: "GET",
				dataType: "json",
				async: false,
				success: function(result) {
					if (result.rs == "success") {
						var hearders = result.HEADER;
						var headerNames = []; // 테이블 칼럼만 추출

						$('#point-symbol-attr-type').html("");
						var optionsHtml = "";
						hearders.forEach((v, i) => {
							if (v.column_name !== 'gid' && v.column_name !== 'geom') { //자동으로 shp파일을 DB화할때 생성되는 칼럼 gid,geom은 제외
								optionsHtml += '<option value="' + v.column_name + '">';
								optionsHtml += v.column_name;
								optionsHtml += '</option>';
							}
						});
						$('#point-symbol-attr-type').append(optionsHtml);
						$('#point-symbol-attr-type').off('change');
						$('#point-symbol-attr-type').on('change',D_LAYER_STYLE.LABEL.createAttrSample);
					} else {
						COMMON.alert("네트워크문제로 정상적으로 \n데이터를 불러올 수 없습니다.", "error", function() {
							return false;
						});
					}
				},
				fail: function(result) {
					COMMON.alert("네트워크 통신 중,문제가 발생하였습니다.", 'error', function() { return false; });
				},
			});
		},
		saveLabelStyle: function() {
			var labelType = $("#symbol-label-rule option:selected").val();

			if (labelType === "0") { // [라벨 없음]인 경우
				return false;
			} else if (labelType === "1") { // [단일 라벨]인 경우
				// let label_ruleObj = new Object();
				let label_ruleObj = {
					id: "",
					marker: "", // 0 : 단순마커, 1 : 이미지 마커, 2 : 라벨 = > 전부 px 단위
					labelName: "", // 라벨명
					filter: "", // 필터
					attribute: "", // 필드(속성명)
					fontFamily: "", // 글꼴
					fontSize: "",
					color: "", // 채우기 색상
					Xoffset: "",
					Yoffset: "",
					buffer: "",
					bufferColor: "",
					opacity: "",
					rotation: "",
					elseFlag: "no"
				};
				label_ruleObj.id = "labelrow_" + D_LAYER_STYLE.LABEL.global.labelCnt;
				label_ruleObj.marker = 4; //라벨 마커 번호는 4번
				label_ruleObj.attribute = $("#point-symbol-attr-type option:selected").text().trim();
				label_ruleObj.fontFamily = $('#point-label-fontFamily option:selected').val();
				label_ruleObj.fontSize = $('#simpleMarkerLabelTextSize').val();
				label_ruleObj.color = $('#simpleMarkerColor3').val();
				label_ruleObj.Xoffset = $('#simpleLabelXaxis').val();
				label_ruleObj.Yoffset = $('#simpleLabelYaxis').val();
				label_ruleObj.buffer = $('#halo').val();
				label_ruleObj.bufferColor = $('#simpleLabelBufferColor').val();
				label_ruleObj.opacity = D_LAYER_STYLE.SLIDER.global.simpleMakerSliderValue3;
				label_ruleObj.rotation = $("#dialInnerValue3").val();


				D_LAYER_STYLE.LABEL.global.label_ruleGroup = [];
				D_LAYER_STYLE.LABEL.global.label_ruleGroup.push(label_ruleObj);

			}
		},
		setSavedLabelStyle: function(selected_obj_symbol) {// 저장된 라벨 스타일 설정 함수
		
			if (selected_obj_symbol[0].marker == 4) { // 해당 오브젝트의 마커번호가 4인 경우 (라벨 세팅)
				$("#rule-based-labelinput-modal").val(selected_obj_symbol[0].labelName);
				$("#rule-based-filter-modal").val(selected_obj_symbol[0].filter).trigger("change");
				$("#point-symbol-attr-type-modal").val(selected_obj_symbol[0].attribute).trigger("change");
				$("#point-label-fontFamily-modal").val(selected_obj_symbol[0].fontFamily).trigger("change");
				$("#simpleMarkerLabelTextSize-modal").val(selected_obj_symbol[0].fontSize).trigger("change");
				$("#simpleMarkerColor3-modal").val(selected_obj_symbol[0].color).trigger("change");
				$("#simpleLabelXaxis-modal").val(selected_obj_symbol[0].Xoffset).trigger("change");
				$("#simpleLabelYaxis-modal").val(selected_obj_symbol[0].Yoffset).trigger("change");
				$("#halo-modal").val(selected_obj_symbol[0].buffer).trigger("change");
				$("#simpleLabelBufferColor-modal").val(selected_obj_symbol[0].bufferColor).trigger("change");
			}

			$("#dialInnerValue4").val(selected_obj_symbol[0].rotation).trigger("change");

			$("#label-calArea").hide();

			D_LAYER_STYLE.SLIDER.global.slider4.data("ionRangeSlider").update({ from: selected_obj_symbol[0].opacity });

			if (selected_obj_symbol[0].filter == ""){
				$("[name=setLabelFilterDefaultRadio][value=default]").prop("checked", true).click();
			}else{
				$("[name=setLabelFilterDefaultRadio][value=filter]").prop("checked", true);//해당 라디오 버튼에 클릭 이벤트가 걸려있기때문에 클릭 함수는 사용하지 않음.
				$("#rule-label-btn").removeClass("disabled");
				$("#rule-label-btn").removeAttr("disabled");
				$("#rule-based-filter-modal").removeAttr("disabled");
				$("#label_filter_test").removeClass("disabled");
				$("#label_filter_test").removeAttr("disabled");
			}
		},
		createLabelSymbolAttr: function(dataId) { //라벨쪽 규칙기반 필터 설정 -- shp 레이어 칼럼 호출용 함수  
			var data_id = dataId;

			var url1 ="./geodt/getTableHead.do?DATAID=" + data_id;

			$.ajax({
				url: url1,
				type: "GET",
				dataType: "json",
				async: false,
				success: function(result) {
					if (result.rs == "success") {

						var hearders = result.HEADER;
						var headerNames = []; // 테이블 칼럼만 추출
						var tr_html = "";
						hearders.forEach((v, i) => {
							// headerNames.push(v.column_name);
							if (v.column_name !== 'gid' && v.column_name !== 'geom') {
								tr_html += '<tr class="label_tr_target">';
								tr_html += "<td>" + v.column_name + "</td>";
								tr_html += "</tr>";
							}

						});
						$("#label-attribute-headers").html("");
						$("#label-attribute-headers").append(tr_html);

						$(".label_tr_target").on("click", function() {
							$(this).addClass("tr_active");
							if ($(this).siblings().hasClass("tr_active")) {
								$(this).siblings().removeClass("tr_active");
							}
						});

					} else {
						COMMON.alert("네트워크문제로 정상적으로 \n데이터를 불러올 수 없습니다.", "error", function() { return false; });
					}
					$("#label-calArea").removeClass("active");
					$("#label-calArea").show();
				},
				fail: function(result) {
					COMMON.alert("네트워크 통신 중,문제가 발생하였습니다.", "error", function() { return false; });
				},
			});
		},
		createLabelProperties: function(data_id, selected_attr) {
			var dataId = data_id;
			var selectedAttr = selected_attr;
			D_LAYER_STYLE.LABEL.global.selectedColumn = selectedAttr;
			var url1 ="./geodt/getProperties.do?DATAID=" +dataId +"&column=" +selected_attr;
			$.ajax({
				url: url1,
				type: "GET",
				dataType: "json",
				success: function(result) {
					if (result.rs == "success") {
						D_LAYER_STYLE.MODALS.global.labeloffset = 20;
						var columns = result.PROPERTY;
						var colums_html = "";
						columns.forEach((v, i) => {
							colums_html += '<tr class="label_tr_target_value">';
							colums_html += "<td>" + v + "</td>";
							colums_html += "</tr>";
						});

						$("#label-sample-attribute-body").html("");
						$("#label-sample-attribute-body").append(colums_html);

						$(".label_tr_target_value").on("click", function() {
							var td_text = $(this).find("td").text().trim();

							$("#expression_bulid_area_label").append('\'' + td_text + '\'');

							$("#rule-based-filter-modal").val(
								$("#expression_bulid_area_label").text().trim()
							);
						});
					} else {
						COMMON.alert("네트워크문제로 정상적으로 \n데이터를 불러올 수 없습니다.", "error", function() {
							return false;
						});
					}
				},
				fail: function(result) {
					COMMON.alert("네트워크 통신 중,문제가 발생하였습니다.", "error", function() {
						return false;
					});
				},
			});
		},
		createLabelPropertiesMore: function(data_id, selected_attr) {
			var dataId = data_id;
			var selectedAttr = selected_attr;
			D_LAYER_STYLE.LABEL.global.selectedColumn = selectedAttr;
			var url1 =
				"./geodt/getPropertiesMore.do?DATAID=" +
				dataId +
				"&column=" +
				selected_attr +
				"&offset=" +
				D_LAYER_STYLE.MODALS.global.labeloffset;
			$.ajax({
				url: url1,
				type: "GET",
				dataType: "json",
				async: false,
				success: function(result) {
					if (result.rs == "success") {

						var columns = result.PROPERTY;
						var colums_html = "";
						columns.forEach((v, i) => {
							colums_html += '<tr class="label_tr_target_value">';
							colums_html += "<td>" + v + "</td>";
							colums_html += "</tr>";
						});

						//$("#label-sample-attribute-body").html("");
						$("#label-sample-attribute-body").append(colums_html);
						$(".label_tr_target_value").off("click");
						$(".label_tr_target_value").on("click", function() {
							var td_text = $(this).find("td").text().trim();

							$("#expression_bulid_area_label").append('\'' + td_text + '\'');

							$("#rule-based-filter-modal").val(
								$("#expression_bulid_area_label").text().trim()
							);
						});

						D_LAYER_STYLE.MODALS.global.labeloffset += 20;
					} else {
						COMMON.alert("네트워크문제로 정상적으로 \n데이터를 불러올 수 없습니다.", "error", function() {
							return false;
						});
					}
				},
				fail: function(result) {

					COMMON.alert("네트워크 통신 중,문제가 발생하였습니다.", "error", function() {
						return false;
					});
				},
			});
		},
		searchLabelPropertiesWithKeyword: function(dataId) {
			var word = $('#label_sym_keyword').val();
			if (D_LAYER_STYLE.Util.isEmpty(word)) {// 키워드가 비어있으면 해당 선택된 칼럼 기본 데이터 부름
				$('#label-sample-attribute').html("");
				return false;
			}
			var attrName = $(".tr_active").children().text().trim();
			var url1 = "./geodt/searchInitProperty.do";

			var formData = new FormData;
			formData.append("dataId", dataId);
			formData.append("column", attrName);
			formData.append("word", word);

			$.ajax({
				url: url1,
				data: formData,
				type: "POST",
				dataType: "json",
				contentType: false,
				processData: false,
				success: function(result) {
					D_LAYER_STYLE.MODALS.global.label_search_offset = 50;
					var columns = [];

					result.PROPERTY.forEach(v => { columns.push(v[attrName]) });

					var colums_html = "";

					columns.forEach((v, i) => {
						colums_html += '<tr class="label_tr_target_value">';
						colums_html += "<td>" + v + "</td>";
						colums_html += "</tr>";
					});

					$("#label-sample-attribute-body").html("");
					$("#label-sample-attribute-body").append(colums_html);

					$(".label_tr_target_value").on("click", function() {
						var td_text = $(this).find("td").text().trim();

						$("#expression_bulid_area_label").append('\'' + td_text + '\'');

						$("#rule-based-filter_modal").val(
							$("#expression_bulid_area_label").text().trim()
						);
					});


				},
				fail: function(result) {

					COMMON.alert("네트워크 통신 중,문제가 발생하였습니다.", "error", function() { return false });
				},
			});
		},
		searchLabelPropertiesMoreWithKeyword: function(dataId) {
			var word = $('#label_sym_keyword').val();
			if (D_LAYER_STYLE.Util.isEmpty(word)) {// 키워드가 비어있으면 해당 선택된 칼럼 기본 데이터 부름
				$('#label-sample-attribute').html("");
				return false;
			}
			var attrName = $(".tr_active").children().text().trim();


			var url1 = "./geodt/searchPropertyMore.do";

			var formData = new FormData;
			formData.append("dataId", dataId);
			formData.append("column", attrName);
			formData.append("word", word);
			formData.append("offset", D_LAYER_STYLE.MODALS.global.label_search_offset);

			$.ajax({
				url: url1,
				data: formData,
				type: "POST",
				dataType: "json",
				async: false,
				contentType: false,
				processData: false,
				success: function(result) {
					D_LAYER_STYLE.MODALS.global.label_search_offset += 50;
					var columns = [];

					result.PROPERTY.forEach(v => { columns.push(v[attrName]) });

					var colums_html = "";

					columns.forEach((v, i) => {
						colums_html += '<tr class="label_tr_target_value">';
						colums_html += "<td>" + v + "</td>";
						colums_html += "</tr>";
					});

					$("#label-sample-attribute-body").append(colums_html);
					
					$(".label_tr_target_value").off("click");
					$(".label_tr_target_value").on("click", function() {
						var td_text = $(this).find("td").text().trim();
						$("#expression_bulid_area_label").append('\'' + td_text + '\'');
						$("#rule-based-filter_modal").val($("#expression_bulid_area_label").text().trim());
					});


				},
				fail: function(result) {
					COMMON.alert("네트워크 통신 중,문제가 발생하였습니다.", "error", function() { return false });
				},
			});
		},
		createSingleLabelProperties: function(data_id, selected_attr) {
			var dataId = data_id;
			var selectedAttr = selected_attr;
			D_LAYER_STYLE.LABEL.global.selectedColumn = selectedAttr;
			var url1 =
				"./geodt/getProperties.do?DATAID=" +
				dataId +
				"&column=" +
				selected_attr;
			$.ajax({
				url: url1,
				type: "GET",
				dataType: "json",
				success: function(result) {
					if (result.rs == "success") {
						D_LAYER_STYLE.MODALS.global.singleLabelAttr_offset = 20;
						var columns = result.PROPERTY;
						var colums_html = "";
						columns.forEach((v, i) => {
							colums_html += '<tr class="label_tr_target_value2">';
							colums_html += "<td>" + v + "</td>";
							colums_html += "</tr>";
						});

						$("#labelAttrInfoArea-body").html("");
						$("#labelAttrInfoArea-body").append(colums_html);
						
					} else {
						COMMON.alert("네트워크문제로 정상적으로 \n데이터를 불러올 수 없습니다.", "error", function() {
							return false;
						});
					}
				},
				fail: function(result) {
					COMMON.alert("네트워크 통신 중,문제가 발생하였습니다.", "error", function() {
						return false;
					});
				},
			});
		},
		createSingleLabelPropertiesMore: function(data_id, selected_attr) {
			var dataId = data_id;
			var selectedAttr = selected_attr;
			D_LAYER_STYLE.LABEL.global.selectedColumn = selectedAttr;
			var url1 =
				"./geodt/getPropertiesMore.do?DATAID=" +
				dataId +
				"&column=" +
				selected_attr +
				"&offset=" +
				D_LAYER_STYLE.MODALS.global.singleLabelAttr_offset;
			$.ajax({
				url: url1,
				type: "GET",
				dataType: "json",
				async: false,
				success: function(result) {
					if (result.rs == "success") {

						var columns = result.PROPERTY;
						var colums_html = "";
						columns.forEach((v, i) => {
							colums_html += '<tr class="label_tr_target_value2">';
							colums_html += "<td>" + v + "</td>";
							colums_html += "</tr>";
						});

						//$("#label-sample-attribute-body").html("");
						$("#labelAttrInfoArea-body").append(colums_html);
						
						D_LAYER_STYLE.MODALS.global.singleLabelAttr_offset += 20;
					} else {
						COMMON.alert("네트워크문제로 정상적으로 \n데이터를 불러올 수 없습니다.", "error", function() {
							return false;
						});
					}
				},
				fail: function(result) {
					COMMON.alert("네트워크 통신 중,문제가 발생하였습니다.", "error", function() {
						return false;
					});
				},
			});
		},
		checkLabelDefaultExist:function(){ //기존 규칙에 디폴트가 있는지 체크하는 함수
			var result = false;//false는 기존 디폴트가 없는 경우
			var selected = D_LAYER_STYLE.LABEL.global.clickedLabelId;
			
			D_LAYER_STYLE.LABEL.global.label_ruleGroup.forEach((v,i)=>{
					if(v.defaultFlag=='1'){ //디폴트가 이미 설정된 규칙이 있는 경우
						result = true;
						if(v.id ===selected){ //규칙 수정 중에 기존의 동일 규칙이 디폴트로 설정되어있던 경우
							result = false;	
						}
					}
				}
			);
			
			return result;
			
		},
		createAttrSample:function(){//라벨 컬럼 선택시
			var dataId = D_LAYER_STYLE.global.dataId;
			var column = $('#point-symbol-attr-type option:selected').val();
			var url="./geodt/getProperties.do?DATAID="+dataId +"&column=" +column;
			
			$.ajax({
				url: url,
				type: "GET",
				dataType: "json",
				success: function(result) {
					if (result.rs == "success") {						
						var columns = result.PROPERTY;
						$("#label_attr_sample").html("");
						var colums_filtered = columns.filter(v=>!D_LAYER_STYLE.Util.isEmpty(v));
						$("#label_attr_sample").append(colums_filtered.toString());//null이나 공백문자인 경우 

					} else {
						COMMON.alert("네트워크문제로 정상적으로 \n데이터를 불러올 수 없습니다.", "error", function() { return false; });

					}
				},
				fail: function(result) {
					COMMON.alert("네트워크 통신 중,문제가 발생하였습니다.", "error", function() { return false; });
				},
			});
		},
		setSavedLabelStyleCnt:function(){
			var cnt_arr = [];
			if($('.label-added-rule-row').length>0){//기존 규칙이 있는 경우 새로운 규칙을 추가할 때, rowId가 가장 놓은 것의 +1 로 아이디 설정
				for(var i=0;i<$('.label-added-rule-row').length;i++){
					cnt_arr.push(parseInt($('.label-added-rule-row').children().find('input')[i].id.split('labelrow_')[1]));
				}
			}
			var labelMaxCnt = Math.max.apply(null, cnt_arr)+1;
			return labelMaxCnt;
		}

	},
	SCROLL_BAR: { //스크롤바 perfectScrollbar
		global: {
			ps1: null,
			ps2: null,
			ps3: null,
			ps4: null,
			ps5: null,
			ps6: null,
			ps7: null,
			ps8: null,
			ps9: null,
			ps10: null //단일 라벨 속성선택시 나타나는 모달 스크롤바
		},
		initScrollbar: function() {
			D_LAYER_STYLE.SCROLL_BAR.global.ps1 = new PerfectScrollbar(".pointRuleArea",{
				scrollYMarginOffset: 15,
				wheelPropagation: false,
				useBothWheelAxes: true,
			});

			D_LAYER_STYLE.SCROLL_BAR.global.ps2 = new PerfectScrollbar("#point-attribute",{
					wheelPropagation: false,
					useBothWheelAxes: true,
			});


			D_LAYER_STYLE.SCROLL_BAR.global.ps3 = new PerfectScrollbar("#point-sample-attribute",{
					wheelPropagation: false,
					useBothWheelAxes: true,
			});

			D_LAYER_STYLE.SCROLL_BAR.global.ps4 = new PerfectScrollbar("#label-attribute",{
					wheelPropagation: false,
					useBothWheelAxes: true,
			});

			D_LAYER_STYLE.SCROLL_BAR.global.ps5 = new PerfectScrollbar("#label-sample-attribute",{
					wheelPropagation: false,
					useBothWheelAxes: true,
			});

			D_LAYER_STYLE.SCROLL_BAR.global.ps6 = new PerfectScrollbar(".lineRuleArea", {
				scrollYMarginOffset: 15,
				wheelPropagation: false,
				useBothWheelAxes: true,
			});

			D_LAYER_STYLE.SCROLL_BAR.global.ps7 = new PerfectScrollbar(".polygonRuleArea", {
				scrollYMarginOffset: 15,
				wheelPropagation: false,
				useBothWheelAxes: true,
			});

			D_LAYER_STYLE.SCROLL_BAR.global.ps8 = new PerfectScrollbar("#rule-based-modal-body", {
				suppressScrollX: false
			});

			D_LAYER_STYLE.SCROLL_BAR.global.ps9 = new PerfectScrollbar("#rule-based-label-modal-body", {
				suppressScrollX: false
			});
			
			D_LAYER_STYLE.SCROLL_BAR.global.ps10 = new PerfectScrollbar("#labelAttrInfoArea", {
				scrollXMarginOffset: 15,
				wheelPropagation: false,
				useBothWheelAxes: true,
			});
			//규칙기반 값 불러오기 경우,스크롤 페이징 처리
			$('#point-sample-attribute').on('ps-y-reach-end', function() {
				//console.log('reached end:'+D_LAYER_STYLE.MODALS.global.offset);
				if (D_LAYER_STYLE.Util.isEmpty($('#sym_keyword').val())) {//비어있으면
					D_LAYER_STYLE.MODALS.createPropertiesMore(D_LAYER_STYLE.global.dataId, D_LAYER_STYLE.MODALS.global.selectedColumn);
				} else {//검색어가 비어있지 않으면
					//$("#point-sample-attribute-body").html("");
					D_LAYER_STYLE.MODALS.searchPropertiesMoreWithKeyword(D_LAYER_STYLE.global.dataId);
				}
			})

			//라벨기반 값 불러오기 경우,스크롤 페이징 처리
			$('#label-sample-attribute').on('ps-y-reach-end', function() {
				//console.log('reached end:'+D_LAYER_STYLE.MODALS.global.label_search_offset);
				if (D_LAYER_STYLE.Util.isEmpty($('#label_sym_keyword').val())) {//비어있으면
					D_LAYER_STYLE.LABEL.createLabelPropertiesMore(D_LAYER_STYLE.global.dataId, D_LAYER_STYLE.LABEL.global.selectedColumn);
				} else {//검색어가 비어있지 않으면
					//$("#point-sample-attribute-body").html("");
					D_LAYER_STYLE.LABEL.searchLabelPropertiesMoreWithKeyword(D_LAYER_STYLE.global.dataId);
				}

			})
			
			$('#labelAttrInfoArea').on('ps-y-reach-end', function() {
				var selected_column = $('#point-symbol-attr-type option:selected').val();
				D_LAYER_STYLE.LABEL.createSingleLabelPropertiesMore(D_LAYER_STYLE.global.dataId, selected_column);
			})
		},
		resetScrollbar: function() { //스크롤바 리셋 함수
			//모든 스크롤바 객체 destroy();
			D_LAYER_STYLE.SCROLL_BAR.global.ps1.destroy();
			D_LAYER_STYLE.SCROLL_BAR.global.ps2.destroy();
			D_LAYER_STYLE.SCROLL_BAR.global.ps3.destroy();
			D_LAYER_STYLE.SCROLL_BAR.global.ps4.destroy();
			D_LAYER_STYLE.SCROLL_BAR.global.ps5.destroy();
			D_LAYER_STYLE.SCROLL_BAR.global.ps6.destroy();
			D_LAYER_STYLE.SCROLL_BAR.global.ps7.destroy();
			D_LAYER_STYLE.SCROLL_BAR.global.ps8.destroy();
			D_LAYER_STYLE.SCROLL_BAR.global.ps9.destroy();
			D_LAYER_STYLE.SCROLL_BAR.global.ps10.destroy();
			
			//destory()후, 다시 init
			D_LAYER_STYLE.SCROLL_BAR.initScrollbar(); // 
		}
	},
	LEGEND: { //범례
		global: {
			default_width: 120,
			default_height: 120,
			max_width: 1000,
			max_height: 1000,
		},
		initLegend: function() { //범례 init
			$(".legendProperties").on("change", function(e) {
				D_LAYER_STYLE.LEGEND.editLegend(e);
			});

			$('#legendInfoDiv').on('dblclick', function(e) {
				$(this).hide();
			})
		},
		getLegendFromGeoserver: function(shp_layer_fullname) {
			var width = D_LAYER_STYLE.LEGEND.global.default_width;
			var height = D_LAYER_STYLE.LEGEND.global.default_height;
			var src ="//" + dtcCom.geo_url() + "/wms?FORMAT=image/png&REQUEST=GetLegendGraphic&VERSION=1.0.0&WIDTH=" +width +"&HEIGHT=" +height +"&LAYER=" + shp_layer_fullname + "&LEGEND_OPTIONS=";
			
			//옵션 추가
			src += "forceRule:True;";
			/* src += "dx:1.2;";
			 src += "dy:1.2;";
			 src += "mx:1.2;";
			 src += "my:1.2;";*/
			src += "fontStyle:bold;";
			src += "borderColor:ffffff;";
			src += "border:true;";
			src += "fontColor:ffffff;";
			src += "fontSize:20;";
			src += "bgColor:0x32353b;";//25282ee6
			/*src += "columnheight:150;";
			src += "rowwidth:150;";*/
			src += "transparent:true;";
			/*src += "countMatched:true;";*/
			src += "fontAntiAliasing:true;";
			/*src += "hideEmptyRules:true";*/

			var html = "";
			html += '<img id ="legendImg" src="' + src + '" alt ="test"/>';
			//$("#legendInfoDiv").append(html);

			$("#legendImg").attr("src", src);
		},
		editLegend: function(e) {
			var width = $("#legend_width").val();
			var height = $("#legend_height").val();
			var fontColor = $("#legend_fontColor").val();
			var backgroundColor = $("#legend_backgroundColor").val();
			var fontSize = $("#legend_fontSize").val();
			
			//너비가 초과된 경우
			if (width > D_LAYER_STYLE.LEGEND.global.max_width) {$("#legend_width").val(D_LAYER_STYLE.LEGEND.global.max_width).trigger("change");
				COMMON.alert("너비는 최대" +D_LAYER_STYLE.LEGEND.global.max_width +"px을 초과할 수 없습니다.", "error", function() {return false;});
			}
			//높이가 초과된 경우
			if (height > D_LAYER_STYLE.LEGEND.global.max_height) {
				$("#legend_height").val(D_LAYER_STYLE.LEGEND.global.max_height).trigger("change");
				COMMON.alert("높이는 최대" +D_LAYER_STYLE.LEGEND.global.max_height +"px을 초과할 수 없습니다.", 'error', function() { return false; });
			}
			var src ="https://xxxxxgo.kr/wms?FORMAT=image/png&REQUEST=GetLegendGraphic&VERSION=1.0.0&WIDTH=" +width +"&HEIGHT=" +height +"&LAYER=xxxx:subway_line&LEGEND_OPTIONS=";
			//옵션 추가
			src += "forceRule:True;";
			src += "dx:0.2;";
			src += "dy:0.2;";
			src += "mx:0.2;";
			src += "my:0.2;";
			src += "fontName:Times%20New%20Roman;";
			src += "fontStyle:bold;";
			src += "fontAntiAliasing:true;"
			src += "borderColor:0xFFFFEE;";
			src += "border:true;";
			src += "transparent=true;";
			src += "fontColor:" + fontColor.replaceAll("#", "") + ";";
			src += "fontSize:" + fontSize + ";";
			src += "bgColor:" + "0x" + backgroundColor.replaceAll("#", "") + ";";

			$("#legendImg").attr("src", src);
		}
	},
	Util: {
		isEmpty: function(data) { //널,공백,undefined,타입 체크함수
			// 널,공백,undefined 공통함수
			if (data === null) {
				return true;
			} else if (data === undefined) {
				return true;
			} else if (data === "") {
				return true;
			} else if (typeof data !== "string") {
				return true;
			} else {
				return false;
			}
		}
	}
};