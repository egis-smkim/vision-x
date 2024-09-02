var GLOBAL = {
	INTERVAL:null,
	UI:{
		COORD:{
			currentCoord:function(x, y, a) {
				IDE.UTIL.currentCoord(x, y, a);
			}
		},
		MAPS:{
			//새 지도 생성하기
			createNewMap:function() {
				var formData=new FormData();
				formData.append("control","createNewMap");

				$.ajax({
					type:"POST",
					url:"/builder/controller/maps/ctrlMaps.php",
					processData:false,
					contentType:false,
					data:formData,
					success:function(data){

						var result = JSON.parse(data);

						switch(result.resultCode) {
							case "complete" :
								alert('지도가 생성되었습니다. 편집화면으로 이동합니다.');
								location.href="/builder/ide/view.php?MAPID="+result.MAPID+"";
							break;
						}
					},
					error:function(request,status,error){
						alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error"+error);
					}
				});
			},
			deleteMap:function(MAPID) {
				if(!confirm('해당 지도를 정말 삭제하시겠습니까?')) {
					return false;
				}

				var formData=new FormData();
				formData.append("control","deleteMap");
				formData.append("MAPID", MAPID);

				$.ajax({
					type:"POST",
					url:"/builder/controller/maps/ctrlMaps.php",
					processData:false,
					contentType:false,
					data:formData,
					success:function(data){

						var result = JSON.parse(data);

						switch(result.resultCode) {
							case "complete" :
								document.location.reload();
							break;
						}
					},
					error:function(request,status,error){
						alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error"+error);
					}
				});
			}
		}
	},
	CONSTRUCT:{
		DRONE:{
			Tn:1,
			changeDataName:function(dataId) {
				$("#dataName_"+dataId).attr("onclick", "").unbind("click");

				var name = $("#dataName_"+dataId).html();

				var html = "<input type=\"text\" class=\"form-control\" id=\"changeDataName_"+dataId+"\" value=\""+name+"\">";
				$("#dataName_"+dataId).html(html);

				$("#changeDataName_"+dataId).focus();

				$("#changeDataName_"+dataId).on("keyup", function(e) {
					if(e.keyCode == 13) {
						// Enter
						var formData = new FormData();
						formData.append("control", "changeDataName");
						formData.append("RID", dataId);
						formData.append("dataName", $("#changeDataName_"+dataId).val());

						$.ajax({
							url: "/builder/controller/drone/ctrlDrone.php",
							type: "POST",
							data: formData,
							processData: false,
							contentType: false,
							success: function(result) {
								var result = JSON.parse(result);

								switch(result.resultCode) {
									case "complete" :
										$("#dataName_"+dataId).html($("#changeDataName_"+dataId).val());

										$("#dataName_"+dataId).click(function() {
											GLOBAL.CONSTRUCT.DRONE.changeDataName(dataId);
										});
									break;

									case "FAIL" :
										alert('데이터명 변경할 수 없습니다. 관리자에게 문의하세요');
										$("#dataName_"+dataId).html(name);

										$("#dataName_"+cvid).click(function() {
											GLOBAL.CONSTRUCT.DRONE.changeDataName(dataId);
										});
										return false;
									break;
								}
							}
						});

					} else if(e.keyCode == 27) {
						// Cancel
						$("#dataName_"+dataId).html(name);

						$("#dataName_"+dataId).click(function() {
							GLOBAL.CONSTRUCT.DRONE.changeDataName(dataId);
						});
					}
				});

				$("#changeDataName_"+dataId).focusout(function() {
					$("#dataName_"+dataId).html(name);

					$("#dataName_"+dataId).click(function() {
						GLOBAL.CONSTRUCT.DRONE.changeDataName(dataId);
					});
				});
			},
			addRouteInput:function() {
				var Cn = GLOBAL.CONSTRUCT.DRONE.Tn + 1;
				var html = "<li id=\"droneRouteCoordWrap_"+Cn+"\" class=\"m-t-10 form-inline\"><input type=\"text\" class=\"form-control form-control-sm\" placeholder=\"LONGITUDE\" id=\"droneRoute_lon_"+Cn+"\"> <input type=\"text\" class=\"m-l-5 form-control form-control-sm\" placeholder=\"LATITUDE\" id=\"droneRoute_lat_"+Cn+"\"> <input type=\"text\" class=\"m-l-5 form-control form-control-sm\" placeholder=\"ALTITUDE\" id=\"droneRoute_alt_"+Cn+"\"> <a href=\"JavaScript:GLOBAL.CONSTRUCT.DRONE.deleteRouteInput("+Cn+");\"><button class=\"m-l-5 btn btn-sm btn-gray\"><i class=\"fa fa-minus\"></i></button></a> <a href=\"JavaScript:GLOBAL.CONSTRUCT.DRONE.addRouteInput();\"><button class=\"m-l-5 btn btn-sm btn-info\"><i class=\"fa fa-plus\"></i></button></a></li>";
				$("#droneRouteList").append(html);

				GLOBAL.CONSTRUCT.DRONE.Tn += 1;
			},
			editDroneRouteInfo:function(rid) {
				console.log(rid);

				if($("#droneRouteName").val() == "") {
					alert('경로명을 입력하세요');
					$("#droneRouteName").focus();
					return false;
				}

				var formData = new FormData();
				formData.append("control", "editDroneRouteInfo");
				formData.append("RID", rid);
				formData.append("coordType", $("#routeDataCoord").val());
				formData.append("routeName", $("#droneRouteName").val());

				$.ajax({
					url: "/builder/controller/drone/ctrlDrone.php",
					type: "POST",
					data: formData,
					processData: false,
					contentType: false,
					success: function(result) {
						var result = JSON.parse(result);

						switch(result.resultCode) {
							case "complete" :
								alert('수정됐습니다');
								document.location.href = "/builder/manage/drone/";
							break;
						}
					}
				});
			},
			saveRouteInputEdit:function(rid, cid) {
				var formData = new FormData();
				formData.append("control", "modifyRouteCoord");
				formData.append("RID", rid);
				formData.append("CID", cid);
				formData.append("lon", $("#droneRoute_lon_"+cid).val());
				formData.append("lat", $("#droneRoute_lat_"+cid).val());
				formData.append("alt", $("#droneRoute_alt_"+cid).val());

				$.ajax({
					url: "/builder/controller/drone/ctrlDrone.php",
					type: "POST",
					data: formData,
					processData: false,
					contentType: false,
					success: function(result) {
						var result = JSON.parse(result);

						switch(result.resultCode) {
							case "complete" :
								alert('수정됐습니다');
							break;
						}
					}
				});
			},
			deleteRouteInputEdit:function(cid) {
				var formData = new FormData();
				formData.append("control", "deleteRouteCoordModify");
				formData.append("CID", cid);

				$.ajax({
					url: "/builder/controller/drone/ctrlDrone.php",
					type: "POST",
					data: formData,
					processData: false,
					contentType: false,
					success: function(result) {
						var result = JSON.parse(result);

						switch(result.resultCode) {
							case "complete" :
								$("#droneRouteCoordWrap_"+cid).remove();
								alert('삭제됐습니다');
								return false;
							break;
						}
					}
				});
			},
			addRouteInputEdit:function(rid) {
				var formData = new FormData();
				formData.append("control", "addRouteInputDummy");
				formData.append("rid", rid);

				$.ajax({
					url: "/builder/controller/drone/ctrlDrone.php",
					type: "POST",
					data: formData,
					processData: false,
					contentType: false,
					success: function(result) {
						var result = JSON.parse(result);

						switch(result.resultCode) {
							case "complete" :

								var cid = result.cid;

								var html = "<li id=\"droneRouteCoordWrap_"+cid+"\" class=\"form-inline m-t-5\"><input type=\"text\" class=\"form-control form-control-sm\" placeholder=\"LONGITUDE\" id=\"droneRoute_lon_"+cid+"\" value=\"\"> <input type=\"text\" class=\"m-l-5 form-control form-control-sm\" placeholder=\"LATITUDE\" id=\"droneRoute_lat_"+cid+"\" value=\"\"> <input type=\"text\" class=\"m-l-5 form-control form-control-sm\" placeholder=\"ALTITUDE\" id=\"droneRoute_alt_"+cid+"\" value=\"\"> <a href=\"JavaScript:GLOBAL.CONSTRUCT.DRONE.saveRouteInputEdit("+rid+", "+cid+");\"><button class=\"m-l-5 btn btn-sm btn-yellow\">저장</button></a> <a href=\"JavaScript:GLOBAL.CONSTRUCT.DRONE.deleteRouteInputDummy("+cid+");\"><button class=\"m-l-5 btn btn-sm btn-grey\"><i class=\"fa fa-minus\"></i></button></a> <a href=\"JavaScript:GLOBAL.CONSTRUCT.DRONE.addRouteInputEdit("+rid+");\"><button class=\"btn m-l-5 btn-sm btn-info\"><i class=\"fa fa-plus\"></i></button></a></li>";

								$("#droneRouteListEdit").append(html);

							break;
						}
					}
				});


			},
			deleteRouteInputDummy:function(el) {
				console.log(el);
			},
			deleteRouteInput:function(idx) {
				$("#droneRouteCoordWrap_"+idx).remove();

				GLOBAL.CONSTRUCT.DRONE.Tn -= 1;
			},
			newMapWithDroneRoute:function(rid) {

			},
			deleteDroneRoute:function(rid) {

			},
			reset:function() {
				document.location.href = "/builder/manage/drone/";
			},
			changeName:function(rid) {

			},
			addDroneRoute:function() {
				if($("#droneRouteName").val() == "") {
					alert('경로명을 입력하세요.');
					$("#droneRouteName").focus();
					return false;
				}

				if($("#droneRoute_lon_1").val() == "") {
					alert('드론 경로를 입력하세요');
					$("#droneRoute_lon_1").focus();
					return false;
				}

				if($("#droneRoute_lat_1").val() == "") {
					alert('드론 경로를 입력하세요');
					$("#droneRoute_lat_1").focus();
					return false;
				}

				var formData = new FormData();
				formData.append("control", "addDroneRoute");
				formData.append("coordType", $("#imageDataCoord").val());
				formData.append("droneRouteName", $("#droneRouteName").val());


				for(var i = 1; i <= GLOBAL.CONSTRUCT.DRONE.Tn; i++) {
					formData.append("droneRouteLon_"+i, $("#droneRoute_lon_"+i).val());
					formData.append("droneRouteLat_"+i, $("#droneRoute_lat_"+i).val());
					formData.append("droneRouteAlt_"+i, $("#droneRoute_alt_"+i).val());
				}

				formData.append("Tn", GLOBAL.CONSTRUCT.DRONE.Tn);

				$.ajax({
					url: "/builder/controller/drone/ctrlDrone.php",
					type: "POST",
					data: formData,
					processData: false,
					contentType: false,
					success: function(result) {
						var result = JSON.parse(result);

						switch(result.resultCode) {
							case "complete" :
								alert('새로운 경로가 등록됐습니다');

								document.location.href = "/builder/manage/drone/";

							break;
						}
					}
				});
			}
		}
	},
	DATA:{
		GROUP:{
			chageDataGroup:function(dt, dataId) {
				var formData = new FormData();
				formData.append("control", "changeDataGroup");

				console.log(dataId);

				switch(dt) {
					case "IMAGE" :
						formData.append("CVID", dataId);
						formData.append("DGID", $("#dataGroup_"+dataId).val());
						formData.append("dataType", "I");
					break;

					case "TERRAIN" :
						formData.append("CVID", dataId);
						formData.append("DGID", $("#dataGroup_"+dataId).val());
						formData.append("dataType", "T");
					break;

					case "POINTCLOUD" :
						formData.append("DATAID", dataId);
						formData.append("DGID", $("#dataGroup_"+dataId).val());
						formData.append("dataType", "P");
					break;

					case "SHAPE" :
						formData.append("DATAID", dataId);
						formData.append("DGID", $("#dataGroup_"+dataId).val());
						formData.append("dataType", "S");
					break;

					case "CSV" :
						formData.append("DATAID", dataId);
						formData.append("DGID", $("#dataGroup_"+dataId).val());
						formData.append("dataType", "C");
					break;
				}


				$.ajax({
					url: "/builder/controller/dataGroup/ctrlDataGroup.php",
					type: "POST",
					data: formData,
					processData: false,
					contentType: false,
					success: function(result) {
						var result = JSON.parse(result);

						switch(result.resultCode) {
							case "complete" :
								alert('데이터 그룹이 변경됐습니다');
								return false;
							break;
						}
					}
				});
			},
			changeDataName:function(dataId) {
				$("#dataName_"+dataId).attr("onclick", "").unbind("click");

				var name = $("#dataName_"+dataId).html();

				var html = "<input type=\"text\" class=\"form-control\" id=\"changeDataName_"+dataId+"\" value=\""+name+"\">";
				$("#dataName_"+dataId).html(html);

				$("#changeDataName_"+dataId).focus();

				$("#changeDataName_"+dataId).on("keyup", function(e) {
					if(e.keyCode == 13) {
						// Enter
						var formData = new FormData();
						formData.append("control", "modifyGroup");
						formData.append("DGID", dataId);
						formData.append("groupName", $("#changeDataName_"+dataId).val());

						$.ajax({
							url: "/builder/controller/dataGroup/ctrlDataGroup.php",
							type: "POST",
							data: formData,
							processData: false,
							contentType: false,
							success: function(result) {
								var result = JSON.parse(result);

								switch(result.resultCode) {
									case "complete" :
										$("#dataName_"+dataId).html($("#changeDataName_"+dataId).val());

										$("#dataName_"+dataId).click(function() {
											GLOBAL.DATA.GROUP.changeDataName(dataId);
										});
									break;

									case "FAIL" :
										alert('그룹명을 변경할 수 없습니다. 관리자에게 문의하세요');
										$("#dataName_"+dataId).html(name);

										$("#dataName_"+cvid).click(function() {
											GLOBAL.DATA.GROUP.changeDataName(dataId);
										});
										return false;
									break;
								}
							}
						});

					} else if(e.keyCode == 27) {
						// Cancel
						$("#dataName_"+dataId).html(name);

						$("#dataName_"+dataId).click(function() {
							GLOBAL.DATA.GROUP.changeDataName(dataId);
						});
					}
				});

				$("#changeDataName_"+dataId).focusout(function() {
					$("#dataName_"+dataId).html(name);

					$("#dataName_"+dataId).click(function() {
						GLOBAL.DATA.GROUP.changeDataName(dataId);
					});
				});
			},
			cancel:function() {
				document.location.href = "/builder/manage/dataGroup/";
			},
			addGroup:function() {
				var formData = new FormData();
				formData.append("control", "addDataGroup");
				formData.append("groupName", $("#groupName").val());


				$.ajax({
					url: "/builder/controller/dataGroup/ctrlDataGroup.php",
					type: "POST",
					data: formData,
					processData: false,
					contentType: false,
					success: function(result) {
						var result = JSON.parse(result);

						switch(result.resultCode) {
							case "complete" :
								alert('신규 그룹이 등록 됐습니다.');
								document.location.href = "/builder/manage/dataGroup/";
							break;
						}
					}
				});
			},
			modifyGroup:function(dgid) {

			},
			deleteGroup:function(dgid) {
				if(!confirm('삭제하시겠습니까?')) {
					return false;
				}
				var formData = new FormData();
				formData.append("control", "deleteGroup");
				formData.append("DGID", dgid);


				$.ajax({
					url: "/builder/controller/dataGroup/ctrlDataGroup.php",
					type: "POST",
					data: formData,
					processData: false,
					contentType: false,
					success: function(result) {
						var result = JSON.parse(result);

						switch(result.resultCode) {
							case "complete" :
								alert('삭제되었습니다.');
								document.location.href = "/builder/manage/dataGroup/";
							break;
						}
					}
				});
			}
		},
		CSV: {
			DATAID:null,
			ADDRESS_TYPE:"P",
			init:function() {
				//addressTypeWrap

				$("input[name=addressType]:radio").change(function (e) {
					GLOBAL.DATA.CSV.changeAddressType(e.target.value);

					GLOBAL.DATA.CSV.ADDRESS_TYPE = e.target.value;
				});

			},
			changeAddressType:function(t) {
				if(t == "P") {
					// 위도, 경도

					$("#coordAddressColumnWrap").css("display", "none");


					$("#coordLonColumnWrap").css("display", "flex");
					$("#coordLatColumnWrap").css("display", "flex");

					

				} else if(t == "G") {
					// 지오코딩

					$("#coordLonColumnWrap").css("display", "none");
					$("#coordLatColumnWrap").css("display", "none");

					$("#coordAddressColumnWrap").css("display", "flex");


				}
			},
			modifyCSV:function(dataId) {
				if(!confirm('설정을 변경하시겠습니까?')) {
					return false;
				}

				var formData = new FormData();
				
				formData.append("DATAID", dataId);
				formData.append("dataName", $("#csvDataName").val());
				formData.append("coordType", $("#csvDataCoord").val());
				formData.append("color", $("#csvDataColor").val());
				formData.append("colX", $("#csvDataCoordX").val());
				formData.append("colY", $("#csvDataCoordY").val());
				formData.append("colL", $("#csvDataLabel").val());

				$.ajax({
					url: "./updateCsvData.do",
					type: "POST",
					data: formData,
					processData: false,
					contentType: false,
					success: function(result) {
						var result = JSON.parse(result);

						switch(result.resultCode) {
							case "complete" :
								alert('CSV 수정이 완료 됐습니다');
								document.location.href = "./csvData.do";
							break;
						}
					}
				});
			},
			loadDataSampleData:function(dataId, type, idx) {

				var formData = new FormData();
				formData.append("type", type);
				formData.append("idx", idx);
				formData.append("DATAID", dataId);

				$.ajax({
					url: "./loadCsvSampleData.do",
					type: "POST",
					data: formData,
					processData: false,
					contentType: false,
					success: function(result) {
						var result = JSON.parse(result);

						switch(result.resultCode) {
							case "complete" :
								var rs = result.rs;
								//console.log(result);

								var html = "";
								html += "<ul>\n";
								for(var i = 0; i < rs.length; i++) {
									html += "	<li>"+rs[i]+"</li>\n";
								}
								html += "</ul>\n";

								switch(result.type) {
									case "x" :
										$("#csvDataCoordXSample").html(html);
									break;

									case "y" :
										$("#csvDataCoordYSample").html(html);
									break;

									case "l" :
										$("#csvDataLabelSample").html(html);
									break;
								}
							break;
						}
					}
				});

			},
			changeDataName:function(dataId) {
				$("#dataName_"+dataId).attr("onclick", "").unbind("click");

				var name = $("#dataName_"+dataId).html();

				var html = "<input type=\"text\" class=\"form-control\" id=\"changeDataName_"+dataId+"\" value=\""+name+"\">";
				$("#dataName_"+dataId).html(html);

				$("#changeDataName_"+dataId).focus();

				$("#changeDataName_"+dataId).on("keyup", function(e) {
					if(e.keyCode == 13) {
						// Enter
						var formData = new FormData();
						formData.append("DATAID", dataId);
						formData.append("dataName", $("#changeDataName_"+dataId).val());

						$.ajax({
							url: "./changeCsvDataName.do",
							type: "POST",
							data: formData,
							processData: false,
							contentType: false,
							success: function(result) {
								var result = JSON.parse(result);

								switch(result.resultCode) {
									case "complete" :
										$("#dataName_"+dataId).html($("#changeDataName_"+dataId).val());

										$("#dataName_"+dataId).click(function() {
											GLOBAL.DATA.CSV.changeDataName(dataId);
										});
									break;

									case "FAIL" :
										alert('데이터명 변경할 수 없습니다. 관리자에게 문의하세요');
										$("#dataName_"+dataId).html(name);

										$("#dataName_"+cvid).click(function() {
											GLOBAL.DATA.CSV.changeDataName(dataId);
										});
										return false;
									break;
								}
							}
						});

					} else if(e.keyCode == 27) {
						// Cancel
						$("#dataName_"+dataId).html(name);

						$("#dataName_"+dataId).click(function() {
							GLOBAL.DATA.CSV.changeDataName(dataId);
						});
					}
				});

				$("#changeDataName_"+dataId).focusout(function() {
					$("#dataName_"+dataId).html(name);

					$("#dataName_"+dataId).click(function() {
						GLOBAL.DATA.CSV.changeDataName(dataId);
					});
				});
			},
			callEditCsvData:function(dataId){
				
				var data ={
						DATAID:dataId
				};
				
				$.ajax({
					url:'./getCsvFileData.do',
					type:'POST',
					data:data,
					dataType:'json',
					success:function(result){
						console.log(result);
						if(result.resultCode=="complete"){
							
							$("#csvDataName").val(result.rsData.DATA_NAME);
							$("#csvDataCoord").val(result.rsData.COORD_TYPE);
							$("#csvDataColor").val(result.rsData.POINT_COLOR);
							
							var rsHeader = result.rsHeader.HEADERS;
							var dataId=result.rsData.DATAID;
							
							$("#updateCsvData").attr("href","JavaScript:GLOBAL.DATA.CSV.modifyCSV(\""+dataId+"\");");
							
							if(rsHeader.length > 0) {

								$("#csvPreviewThumbWrap").css("display", "flex");

								var html = "";
								
								html += "<select class=\"form-control form-control-sm\" id=\"csvDataCoordX\">";
								html += "	<option>X 좌표 항목을 선택 하세요.</option>";
								
								for(var i = 0; i < rsHeader.length; i++) {
									var selected = "";
									if(result.rsData.COL_X == i) selected = " selected";

									html += "	<option value=\""+i+"\""+selected+">"+rsHeader[i]+"</option>";
								}
								html += "</select>";

								$("#csvDataCoordXWrap").html(html);

								$("#csvDataCoordX").on("change", function(e) {
									GLOBAL.DATA.CSV.loadDataSample("x", e.target.value);
								});

								var html = "";
								html += "<select class=\"form-control form-control-sm\" id=\"csvDataCoordY\">";
								html += "	<option>Y 좌표 항목을 선택 하세요.</option>";
								for(var i = 0; i < rsHeader.length; i++) {
									var selected = "";
									if(result.rsData.COL_Y == i) selected = " selected";

									html += "	<option value=\""+i+"\""+selected+">"+rsHeader[i]+"</option>";
								}
								html += "</select>";

								$("#csvDataCoordYWrap").html(html);

								$("#csvDataCoordY").on("change", function(e) {
									GLOBAL.DATA.CSV.loadDataSample("y", e.target.value);
								});

								var html = "";
								
								html += "<select class=\"form-control form-control-sm\" id=\"csvDataLabel\">";
								html += "	<option>라벨 항목을 하세요.</option>";
								for(var i = 0; i < rsHeader.length; i++) {
									var selected = "";
									if(result.rsData.COL_LABEL == i) selected = " selected";

									html += "	<option value=\""+i+"\""+selected+">"+rsHeader[i]+"</option>";
								}
								html += "</select>";

								$("#csvLabelWrap").html(html);

								$("#csvDataLabel").on("change", function(e) {
									GLOBAL.DATA.CSV.loadDataSample("l", e.target.value);
								});

								GLOBAL.DATA.CSV.loadDataSampleData(dataId, "x", result.rsData.COL_X);
								GLOBAL.DATA.CSV.loadDataSampleData(dataId, "y", result.rsData.COL_Y);
								GLOBAL.DATA.CSV.loadDataSampleData(dataId, "l", result.rsData.COL_LABEL);
							}
							
							$("#modalEditCsvData").modal({backdrop:'static'});
						}
						
						
					}
				});
			},
			addCSVDataComplete:function() {

				if(GLOBAL.DATA.CSV.ADDRESS_TYPE == "P") {

					if($("#csvDataCoordX").val() == "") {
						alert('X(Lon) 좌표를 선택하세요');
						$("#csvDataCoordX").focus();
						return false;
					}

					if($("#csvDataCoordY").val() == "") {
						alert('Y(Lat) 좌표를 선택하세요');
						$("#csvDataCoordY").focus();
						return false;
					}

				} else if(GLOBAL.DATA.CSV.ADDRESS_TYPE == "G") {

					if($("#csvDataCoordAddress").val() == "") {
						alert('도로명 / 지번 주소항목을 선택하세요.');
						$("#csvDataCoordAddress").focus();
						return false;
					}
				}

				if($("#csvDataLabel").val() == "") {
					alert('POI 라벨 항목을 선택하세요');
					$("#csvDataLabel").focus();
					return false;
				}

				if($("#csvDataName").val() == "") {
					alert('데이터명을 입력하세요');
					$("#csvDataName").focus();
					return false;
				}

				var formData = new FormData();
				formData.append("dataid", GLOBAL.DATA.CSV.DATAID);
				formData.append("dataName", $("#csvDataName").val());
				formData.append("coordType", $("#csvDataCoord").val());
				formData.append("addressType", GLOBAL.DATA.CSV.ADDRESS_TYPE);
				formData.append("color", $("#csvDataColor").val());

				if(GLOBAL.DATA.CSV.ADDRESS_TYPE == "P") {
					formData.append("colX", $("#csvDataCoordX").val());
					formData.append("colY", $("#csvDataCoordY").val());
				} else {
					formData.append("colA", $("#csvDataCoordAddress").val());
				}

				formData.append("colL", $("#csvDataLabel").val());
				
				$("#btnInsert").attr("disabled", "true");

				$.ajax({
					url: "./insertCsvDataComplete.do",
					type: "POST",
					data: formData,
					processData: false,
					contentType: false,
					success: function(result) {
						
						var result = JSON.parse(result);

						switch(result.rs) {
							case "complete" :
								alert('CSV 등록이 완료 됐습니다');
								document.location.href = "./csvData.do";
							break;
						}
						
					}
				});

			},
			getCsvColumnSampleData:function(type, idx) {
				var formData = new FormData();
				formData.append("type", type);
				formData.append("idx", idx);
				formData.append("dataid", GLOBAL.DATA.CSV.DATAID);

				$.ajax({
					url: "/desk/mapdata/getCsvColumnSampleData.do",
					type: "POST",
					data: formData,
					processData: false,
					contentType: false,
					success: function(result) {
						var result = JSON.parse(result);

						switch(result.rs) {
							case "complete" :
								var rs = result.records;
								console.log(result);

								var html = "";
								html += "<ul>\n";
								for(var i = 0; i < rs.length; i++) {
									html += "	<li>"+rs[i]+"</li>\n";
								}
								html += "</ul>\n";

								switch(result.type) {
									case "x" :
										$("#csvDataCoordXSample").html(html);
									break;

									case "y" :
										$("#csvDataCoordYSample").html(html);
									break;

									case "l" :
										$("#csvDataLabelSample").html(html);
									break;

									case "a" :
										$("#csvDataCoordAddressSample").html(html);
									break;
								}
							break;
						}
					}
				});
			},
			loadDataSample:function(type, idx) {

				var formData = new FormData();
				formData.append("type", type);
				formData.append("idx", idx);
				formData.append("dataid", GLOBAL.DATA.CSV.DATAID);

				$.ajax({
					url: "./getCsvSampleData.do",
					type: "POST",
					data: formData,
					processData: false,
					contentType: false,
					success: function(result) {
						var result = JSON.parse(result);

						switch(result.resultCode) {
							case "complete" :
								var rs = result.rs;
								//console.log(result);

								var html = "";
								html += "<ul>\n";
								for(var i = 0; i < rs.length; i++) {
									html += "	<li>"+rs[i]+"</li>\n";
								}
								html += "</ul>\n";

								switch(result.type) {
									case "x" :
										$("#csvDataCoordXSample").html(html);
									break;

									case "y" :
										$("#csvDataCoordYSample").html(html);
									break;

									case "l" :
										$("#csvDataLabelSample").html(html);
									break;

									case "a" :
										$("#csvDataCoordAddressSample").html(html);
									break;
								}
							break;
						}
					}
				});

			},
			createThumb:function() {
		
				if(GLOBAL.DATA.CSV.ADDRESS_TYPE == "P") {
					if($("#csvDataCoordX").val() == "") {
						alert('경도 항목을 선택 해야 미리보기를 생성할 수 있습니다');
						$("#csvDataCoordX").focus();
						return false;
					}

					if($("#csvDataCoordY").val() == "") {
						alert('위도 항목을 선택 해야 미리보기를 생성할 수 있습니다');
						$("#csvDataCoordY").focus();
						return false;
					}
				} else {
					alert('지오코딩 항목 선택시 미리보기를 생성 할 수 없습니다.');
					return false;
				}

				if($("#csvDataLabel").val() == "") {
					alert('라벨 항목 칼럼을 선택하세요.');
					$("#csvDataLabel").focus();
					return false;
				}

				var html = "<button class=\"btn btn-primary\" type=\"button\" disabled=\"\">\n";
				html += "<span class=\"spinner-border\" role=\"status\" aria-hidden=\"true\"></span>\n";
				html += "미리보기 생성중\n";
				html += "</button>\n";
				$("#csvPreviewThumb").html(html);

				var formData = new FormData();

				formData.append("dataid", GLOBAL.DATA.CSV.DATAID);
				formData.append("colLon", $("#csvDataCoordX").val());
				formData.append("colLat", $("#csvDataCoordY").val());
				formData.append("colLabel", $("#csvDataLabel").val());
				formData.append("color", $("#csvDataColor").val());

				if(GLOBAL.FILE.XHR != null) {
					GLOBAL.FILE.XHR.abort();
				}

				GLOBAL.FILE.XHR =  $.ajax({
					url: "./createCSVThumbnail.do",
					type: "POST",
					data: formData,
					processData: false,
					contentType: false,
					success: function(result) {
						
						var result = JSON.parse(result);
						console.log(result);
						switch(result.rs) {
							case "complete" :
								if(result.mapsDataVO.thumbnail_url != "") {
									var html = "<img src=\""+result.mapsDataVO.thumbnail_url+"\">";
									$("#csvPreviewThumb").html(html);
								}
							break;

							case "fail" :
								alert('미리보기를 생성할 수 없습니다.');
								return false;
							break;
						}
					}
				});
			},
			addCSVData:function() {
				//console.log(GLOBAL.FILE.fileType);

				if(GLOBAL.FILE.fileType[0] != "application/vnd.ms-excel") {
					alert('CSV 파일만 등록할 수 있습니다.');
					return false;
				}

				if($("#csvDataName").val() == "") {
					alert('데이터명을 입력하세요');
					$("#csvDataName").focus();
					return false;
				}

				var formData = new FormData();

				formData.append("dataName", $("#csvDataName").val());
				formData.append("coordType", $("#csvDataCoord").val());
				formData.append("color", $("#csvDataColor").val());

				for(var i = 0; i < GLOBAL.FILE.files.length; i++) {
					formData.append("fileLists", GLOBAL.FILE.files[i]);
				}

				if(GLOBAL.FILE.XHR != null) {
					GLOBAL.FILE.XHR.abort();
				}

				GLOBAL.FILE.XHR =  $.ajax({
					url: "./uploadCsvFile.do",
					type: "POST",
					data: formData,
					processData: false,
					contentType: false,
					xhr:function() {
						var myXhr = $.ajaxSettings.xhr();
						if(myXhr.upload) {
							myXhr.upload.addEventListener('progress',GLOBAL.FILE.multipleUploadProgress, false);
						}
						return myXhr;
					},
					success: function(result) {
						
						var result = JSON.parse(result);
						console.log(result);
						switch(result.rs) {
							case "complete" :
								/*
								<select class="form-control" id="csvDataCoordX">
								<option>X 좌표 항목을 선택 하세요.</option>
								</select>
								*/
								$("#btnSuccess").attr("disabled", true);

								var rsHeader = result.CSV_HEADER.HEADERS;

								if(rsHeader.length > 0) {
									GLOBAL.DATA.CSV.DATAID = result.DATAID;

									$("#addressTypeWrap").css("display", "flex");
									$("#csvLabelRowWrap").css("display", "flex");
									$("#coordLonColumnWrap").css("display", "flex");
									$("#coordLatColumnWrap").css("display", "flex");

									$("#csvPreviewThumbWrap").css("display", "flex");

									var html = "";
									html += "<select class=\"form-control form-control-sm\" id=\"csvDataCoordAddress\">";
									html += "	<option value=\"\">도로명 / 지번 주소항목을 선택 하세요.</option>";
									for(var i = 0; i < rsHeader.length; i++) {
										html += "	<option value=\""+i+"\">"+rsHeader[i]+"</option>";
									}
									html += "</select>";

									$("#csvDataCoordAddressWrap").html(html);

									$("#csvDataCoordAddress").on("change", function(e) {
										GLOBAL.DATA.CSV.getCsvColumnSampleData("a", e.target.value);
									});
	
									var html = "";
									html += "<select class=\"form-control form-control-sm\" id=\"csvDataCoordX\">";
									html += "	<option value=\"\">X(경도) 좌표 항목을 선택 하세요.</option>";
									for(var i = 0; i < rsHeader.length; i++) {
										var selected = "";
										if(rsHeader[i] == "경도") {
											selected = " selected";
											GLOBAL.DATA.CSV.getCsvColumnSampleData("x", i);
										}
										html += "	<option value=\""+i+"\""+selected+">"+rsHeader[i]+"</option>";
									}
									html += "</select>";

									$("#csvDataCoordXWrap").html(html);

									$("#csvDataCoordX").on("change", function(e) {
										GLOBAL.DATA.CSV.getCsvColumnSampleData("x", e.target.value);
									});

									var html = "";
									html += "<select class=\"form-control form-control-sm\" id=\"csvDataCoordY\">";
									html += "	<option value=\"\">Y(위도) 좌표 항목을 선택 하세요.</option>";
									for(var i = 0; i < rsHeader.length; i++) {
										var selected = "";
										if(rsHeader[i] == "위도") {
											selected = " selected";
											GLOBAL.DATA.CSV.getCsvColumnSampleData("y", i);
										}
										html += "	<option value=\""+i+"\""+selected+">"+rsHeader[i]+"</option>";
									}
									html += "</select>";

									$("#csvDataCoordYWrap").html(html);

									$("#csvDataCoordY").on("change", function(e) {
										GLOBAL.DATA.CSV.getCsvColumnSampleData("y", e.target.value);
									});


									var html = "";
									html += "<select class=\"form-control form-control-sm\" id=\"csvDataLabel\">";
									html += "	<option value=\"\">라벨 항목을 하세요.</option>";
									for(var i = 0; i < rsHeader.length; i++) {
										html += "	<option value=\""+i+"\">"+rsHeader[i]+"</option>";
									}
									html += "</select>";

									$("#csvLabelWrap").html(html);

									$("#csvDataLabel").on("change", function(e) {
										GLOBAL.DATA.CSV.getCsvColumnSampleData("l", e.target.value);
									});

									$("#btnSuccess").css("display", "none");
									$("#btnInsert").css("display", "inline-block");
								}
								
								/*

								if(rsHeader.length > 0) {

									console.log(rsHeader);

									var html = "";
									html += "<select class=\"form-control form-control-sm\" id=\"csvDataCoordX\">";
									html += "	<option>X 좌표 항목을 선택 하세요.</option>";
									for(var i = 0; i < rsHeader.length; i++) {
										html += "	<option value=\""+i+"\">"+rsHeader[i]+"</option>";
									}
									html += "</select>";

									$("#csvDataCoordXWrap").html(html);

									$("#csvDataCoordX").on("change", function(e) {
										GLOBAL.DATA.CSV.loadDataSample("x", e.target.value);
									});

									var html = "";
									html += "<select class=\"form-control form-control-sm\" id=\"csvDataCoordY\">";
									html += "	<option>Y 좌표 항목을 선택 하세요.</option>";
									for(var i = 0; i < rsHeader.length; i++) {
										html += "	<option value=\""+i+"\">"+rsHeader[i]+"</option>";
									}
									html += "</select>";

									$("#csvDataCoordYWrap").html(html);

									$("#csvDataCoordY").on("change", function(e) {
										GLOBAL.DATA.CSV.loadDataSample("y", e.target.value);
									});


									var html = "";
									html += "<select class=\"form-control form-control-sm\" id=\"csvDataLabel\">";
									html += "	<option>라벨 항목을 하세요.</option>";
									for(var i = 0; i < rsHeader.length; i++) {
										html += "	<option value=\""+i+"\">"+rsHeader[i]+"</option>";
									}
									html += "</select>";

									$("#csvLabelWrap").html(html);

									$("#csvDataLabel").on("change", function(e) {
										GLOBAL.DATA.CSV.loadDataSample("l", e.target.value);
									});
									//
								}

								$("#btnSuccess").css("display", "none");
								$("#btnInsert").css("display", "inline-block");
								*/

							break;

							case "NOT_ABLE_TYPE" :
								alert('지원하지 않는 파일 포맷입니다.');
								return false;
							break;

							case "WAIT_MORE_FILE" :
								return;
							break;

							default :

							break;
						}

						GLOBAL.FILE.isUpload = false;
					}
				}); // End of XHR

			},
			deleteCSV:function(dataId){
				
				if(!confirm('삭제하시겠습니까?')) {
					return false;
				}
				
				var data ={
						DATAID:dataId
				}
				
				$.ajax({
					url:'./deleteCsvData.do',
					type:'POST',
					data:data,
					dataType:'json',
					success:function(result){
						if(result.resultCode=="complete"){
							alert('삭제되었습니다.');
							location.href="./csvData.do";
						}
					}
				});
			},
			reset:function() {

			}
		},
		MODEL_3DS: {
			showFileList:function(dataId) {
				// modal3DSFileListInfoWrap
				var formData = new FormData();
				formData.append("control", "load3DSFileList");
				formData.append("DATAID", dataId);

				$.ajax({
					url: "/builder/controller/data/ctrl3DSData.php",
					type: "POST",
					data: formData,
					processData: false,
					contentType: false,
					success: function(result) {
						var result = JSON.parse(result);

						switch(result.resultCode) {
							case "complete" :
								var rs = result.rs;
								$("#modal3DSFileListInfoWrap").empty();
								$.each(rs, function(k, v) {
										var FILE_URL = v.FILE_URL;
										FILE_URL = FILE_URL.split("/home/dev/con/public_html")[1];
									$("#modal3DSFileListInfoWrap").append("<li>"+v.FILE_NAME+
									"<a class='col-4' href='"+FILE_URL+"' download><i class='fa fa-download'></i> 다운로드</a>"+
									"</li>");
								});

								$("#modal3DSFileList").modal("show");
							break;
						}
					}
				});
			},
			delete3DS:function(dataId) {
				if(!confirm('해당 데이터를 정말 삭제하시겠습니까?')) {
					return false;
				}

				$("#btnDelete_"+dataId).html("<i class=\"fas fa-spinner fa-spin\"></i> 삭제중");

				var formData = new FormData();
				formData.append("control", "delete3DS");
				formData.append("DATAID", dataId);

				$.ajax({
					url: "/builder/controller/data/ctrl3DSData.php",
					type: "POST",
					data: formData,
					processData: false,
					contentType: false,
					success: function(result) {
						var result = JSON.parse(result);

						switch(result.resultCode) {
							case "complete" :
								document.location.reload();
							break;
						}
					}
				});
			},
			changeModelCategory:function(c) {
				//var bc = $(":input:radio[name=modelCategory_1]:checked").val();
				
				if(c == "F") {
					$("#smallCategoryWrap_F").css("display", "flex");
					$("#smallCategoryWrap_S").css("display", "none");
				} else if(c == "S") {
					$("#smallCategoryWrap_F").css("display", "none");
					$("#smallCategoryWrap_S").css("display", "flex");
				}
				
				//$("#smallCategoryWrap").html("");
				/*
				var html = "";
				
				if(c == "F") {
					html +="<select id=\"modelSmallCategory\" class=\"selectpickerProj\" data-style=\"btn-default\">\n";
	              	html += "	<option value=\"RES\">주거</option>\n";
	              	html += "	<option value=\"BRG\">교량</option>\n";
	              	html += "	<option value=\"MED\">의료</option>\n";
	              	html += "	<option value=\"EDU\">교육</option>\n";
	              	html += "	<option value=\"SPO\">스포츠</option>\n";
	              	html += "	<option value=\"BSN\">비즈니스</option>\n";
	              	html += "	<option value=\"ENG\">에너지</option>\n";
	              	html += "	<option value=\"REL\">종교</option>\n";
	              	html += "	<option value=\"OTH\">기타</option>\n";
	              	html += "</select>\n";
				} else if(c == "S") {
					html +="<select id=\"modelSmallCategory\" class=\"selectpickerProj\" data-style=\"btn-default\">\n";
	              	html += "	<option value=\"LAN\">조경</option>\n";
	              	html += "	<option value=\"TRA\">교통</option>\n";
	              	html += "	<option value=\"ENG\">에너지</option>\n";
	              	html += "	<option value=\"REC\">휴양</option>\n";
	              	html += "	<option value=\"OTH\">기타</option>\n";
	              	html += "</select>\n";
				}*/
				
				//$("#smallCategoryWrap").html(html);
			},
			add3DSData:function() {
				if($("#model3DSDataName").val() == "") {
					alert('Shape 데이터명을 입력하세요');
					$("#shapeDataName").focus();
					return false;
				}
				
				var bc = $(":input:radio[name=modelCategory_1]:checked").val();
				
				var sc = "";
				if(bc == "F") {
					sc = $("#modelSmallCategory_F").val();
				} else if(bc == "S") {
					sc = $("#modelSmallCategory_S").val();
				}
				

				if(GLOBAL.FILE.isUpload == true) {
					alert('현재 업로드가 진행중입니다');
					return false;
				}

				if(GLOBAL.FILE.isConvert == true) {
					alert('현재 데이터 가공이 진행중입니다');
					return false;
				}

				GLOBAL.FILE.changeStatus(1);
				GLOBAL.FILE.isUpload = true;

				var formData = new FormData();
				formData.append("dataName", $("#model3DSDataName").val());
				formData.append("coordType", $("#modelDataCoord").val());
				formData.append("modelCategory", $(":input:radio[name=modelCategory_1]:checked").val());
				formData.append("modelSubCategory", sc);

				for(var i = 0; i < GLOBAL.FILE.files.length; i++) {
					formData.append("fileLists", GLOBAL.FILE.files[i]);
				}

				if(GLOBAL.FILE.XHR != null) {
					GLOBAL.FILE.XHR.abort();
				}

				GLOBAL.FILE.XHR =  $.ajax({
					url: "./upload3dsData.do",
					type: "POST",
					data: formData,
					processData: false,
					contentType: false,
					xhr:function() {
						var myXhr = $.ajaxSettings.xhr();
						if(myXhr.upload) {
							myXhr.upload.addEventListener('progress',GLOBAL.FILE.multipleUploadProgress, false);
						}
						return myXhr;
					},
					success: function(result) {
						var result = JSON.parse(result);

						switch(result.rs) {
							case "complete" :
								alert('등록됐습니다');
								document.location.href = "./modelData.do";

							break;

							case "NOT_ABLE_TYPE" :
								alert('지원하지 않는 파일 포맷입니다.');
								return false;
							break;

							case "WAIT_MORE_FILE" :
								return;
							break;

							default :

							break;
						}

						GLOBAL.FILE.isUpload = false;
					}
				}); // End of XHR
			},
			changeDataName:function(dataId) {
				$("#dataName_"+dataId).attr("onclick", "").unbind("click");

				var name = $("#dataName_"+dataId).html();

				var html = "<input type=\"text\" class=\"form-control\" id=\"changeDataName_"+dataId+"\" value=\""+name+"\">";
				$("#dataName_"+dataId).html(html);

				$("#changeDataName_"+dataId).focus();

				$("#changeDataName_"+dataId).on("keyup", function(e) {
					if(e.keyCode == 13) {
						// Enter
						var formData = new FormData();
						formData.append("control", "changeDataName");
						formData.append("DATAID", dataId);
						formData.append("dataName", $("#changeDataName_"+dataId).val());

						$.ajax({
							url: "/builder/controller/data/ctrlShapeData.php",
							type: "POST",
							data: formData,
							processData: false,
							contentType: false,
							success: function(result) {
								var result = JSON.parse(result);

								switch(result.resultCode) {
									case "complete" :
										$("#dataName_"+dataId).html($("#changeDataName_"+dataId).val());

										$("#dataName_"+dataId).click(function() {
											GLOBAL.DATA.SHAPE.changeDataName(dataId);
										});
									break;

									case "FAIL" :
										alert('데이터명 변경할 수 없습니다. 관리자에게 문의하세요');
										$("#dataName_"+dataId).html(name);

										$("#dataName_"+cvid).click(function() {
											GLOBAL.DATA.SHAPE.changeDataName(dataId);
										});
										return false;
									break;
								}
							}
						});

					} else if(e.keyCode == 27) {
						// Cancel
						$("#dataName_"+dataId).html(name);

						$("#dataName_"+dataId).click(function() {
							GLOBAL.DATA.SHAPE.changeDataName(dataId);
						});
					}
				});

				$("#changeDataName_"+dataId).focusout(function() {
					$("#dataName_"+dataId).html(name);

					$("#dataName_"+dataId).click(function() {
						GLOBAL.DATA.SHAPE.changeDataName(dataId);
					});
				});
			}
		},
		SHAPE:{
			MOVE_LAT:0.0,
			MOVE_LON:0.0,
			shapeIndex:0,
			prjIndex:0,
			isHeight:"N",
			dataId:0,
			selectSortGroup:function() {
				document.location.href = "/builder/manage/shape/?grp="+$("#shapeSortGroup").val()+"";
			},
			downloadShape:function(dataId){
				var formData=new FormData();
				formData.append("control","downloadShape");
				formData.append("DATAID", dataId);

				$.ajax({
					type:"POST",
					url:"/builder/controller/data/ctrlShapeData.php",
					processData:false,
					contentType:false,
					data:formData,
					success:function(data){

						var result = JSON.parse(data);

						switch(result.resultCode) {
							case "complete" :
								console.log(result.resultList);
								for(i=0; i<result.resultList.length; i++){
								  (function(j){
								    setTimeout(function(){
											var FILE_URL = result.resultList[j]['FILE_URL'];
											FILE_URL =  FILE_URL.split("/home/dev/con/files")[1];
								      document.location.href = "http://file.terrasense.co.kr"+FILE_URL;
								    }, 1000*j);
								  })(i);
								}
							break;
						}
					},
					error:function(request,status,error){
						alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error"+error);
					}
				});
			},
			newMapWithShape:function(dataId) {
				var formData=new FormData();
				formData.append("control","createNewMapWithData");
				formData.append("dataType", "SHAPE");
				formData.append("DATAID", dataId);

				$.ajax({
					type:"POST",
					url:"/builder/controller/maps/ctrlMaps.php",
					processData:false,
					contentType:false,
					data:formData,
					success:function(data){

						var result = JSON.parse(data);

						switch(result.resultCode) {
							case "complete" :
								alert('지도가 생성되었습니다. 편집화면으로 이동합니다.');
								location.href="/builder/ide/view.php?MAPID="+result.MAPID+"";
							break;
						}
					},
					error:function(request,status,error){
						alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error"+error);
					}
				});
			},
			deleteShape:function(dataId) {
				if(!confirm('해당 데이터를 정말 삭제하시겠습니까?')) {
					return false;
				}

				$("#btnDelete_"+dataId).html("<i class=\"fas fa-spinner fa-spin\"></i> 삭제중");

				var formData = new FormData();
				formData.append("control", "deleteShape");
				formData.append("DATAID", dataId);

				$.ajax({
					url: "/builder/controller/data/ctrlShapeData.php",
					type: "POST",
					data: formData,
					processData: false,
					contentType: false,
					success: function(result) {
						var result = JSON.parse(result);

						switch(result.resultCode) {
							case "complete" :
								document.location.reload();
							break;
						}
					}
				});
			},
			changeDataName:function(dataId) {
				$("#dataName_"+dataId).attr("onclick", "").unbind("click");

				var name = $("#dataName_"+dataId).html();

				var html = "<input type=\"text\" class=\"form-control\" id=\"changeDataName_"+dataId+"\" value=\""+name+"\">";
				$("#dataName_"+dataId).html(html);

				$("#changeDataName_"+dataId).focus();

				$("#changeDataName_"+dataId).on("keyup", function(e) {
					if(e.keyCode == 13) {
						// Enter
						var formData = new FormData();
						formData.append("control", "changeDataName");
						formData.append("DATAID", dataId);
						formData.append("dataName", $("#changeDataName_"+dataId).val());

						$.ajax({
							url: "/builder/controller/data/ctrlShapeData.php",
							type: "POST",
							data: formData,
							processData: false,
							contentType: false,
							success: function(result) {
								var result = JSON.parse(result);

								switch(result.resultCode) {
									case "complete" :
										$("#dataName_"+dataId).html($("#changeDataName_"+dataId).val());

										$("#dataName_"+dataId).click(function() {
											GLOBAL.DATA.SHAPE.changeDataName(dataId);
										});
									break;

									case "FAIL" :
										alert('데이터명 변경할 수 없습니다. 관리자에게 문의하세요');
										$("#dataName_"+dataId).html(name);

										$("#dataName_"+cvid).click(function() {
											GLOBAL.DATA.SHAPE.changeDataName(dataId);
										});
										return false;
									break;
								}
							}
						});

					} else if(e.keyCode == 27) {
						// Cancel
						$("#dataName_"+dataId).html(name);

						$("#dataName_"+dataId).click(function() {
							GLOBAL.DATA.SHAPE.changeDataName(dataId);
						});
					}
				});

				$("#changeDataName_"+dataId).focusout(function() {
					$("#dataName_"+dataId).html(name);

					$("#dataName_"+dataId).click(function() {
						GLOBAL.DATA.SHAPE.changeDataName(dataId);
					});
				});
			},
			getCoordInfo:function(dataId) {
				var formData = new FormData();
				formData.append("control", "loadCoordInfo");
				formData.append("DATAID", dataId);

				$.ajax({
					url: "/builder/controller/data/ctrlPointcloudData.php",
					type: "POST",
					data: formData,
					processData: false,
					contentType: false,
					success: function(result) {
						var result = JSON.parse(result);
						console.log(result);
						switch(result.resultCode) {
							case "complete" :
								GLOBAL.FILE.changeStatus(4);
								$("#remainTime").html("완료");
								if(confirm('데이터 가공이 완료 됐습니다. 지도에서 바로 확인하시겠습니까?')) {
									$("#dataConvertStatus").css("display", "none");

									GLOBAL.DATA.SHAPE.newMapWithShape(dataId);
								} else {
									document.location.href = "/builder/manage/shape/";
								}
							break;

							default :
								alert('데이터 좌표수집에 실패했습니다. 관리자에게 문의하세요.');
								return false;
							break;
						}
					}
				});
			},
			convertShape:function(fids) {

				var formData = new FormData();
				formData.append("control", "convertShape");
				formData.append("dataName", $("#shapeDataName").val());
				formData.append("coordType", $("#shapeDataCoord").val());
				formData.append("recDate", $("#shapeDataRecDate").val());
				formData.append("shapeIndex", GLOBAL.DATA.SHAPE.shapeIndex);
				formData.append("prjIndex", GLOBAL.DATA.SHAPE.prjIndex);
				formData.append("FIDS", fids);

				if(GLOBAL.FILE.XHR != null) {
					GLOBAL.FILE.XHR.abort();
				}

				GLOBAL.FILE.changeStatus(2);

				GLOBAL.FILE.XHR =  $.ajax({
					url: "/builder/controller/data/ctrlShapeData.php",
					type: "POST",
					data: formData,
					processData: false,
					contentType: false,
					success: function(result) {
						var result = JSON.parse(result);

						console.log(result);

						switch(result.resultCode) {
							case "complete" :
								console.log(result);
								//GLOBAL.DATA.SHAPE.checkProgress(result.resultDataId);

								$("#projection").html(result.resultData.PROJECTION);

								console.log(result.resultData.PROJECTION);

								GLOBAL.FILE.changeStatus(4);

								if(confirm('데이터 가공이 완료 됐습니다. 지도에서 바로 확인하시겠습니까?')) {
									$("#dataConvertStatus").css("display", "none");

									GLOBAL.DATA.SHAPE.newMapWithShape(result.resultData.DATAID);
									//document.location.href = "/builder/ide/view.php?MAPID=8904";
								} else {
									document.location.href = "/builder/manage/shape/";
								}
							break;

							case "ERROR_CHANGE_COORD" :
								alert('좌표변환에 실패 했습니다. 관리자에게 문의하세요');
								return false;
							break;
						}
					}
				});
			},
			confirmShape:function() {
				if(!confirm('데이터를 등록하시겠습니까?')) {
					return false;
				}

				var formData = new FormData();
				formData.append("dataid", GLOBAL.DATA.SHAPE.dataId);
				
				$.ajax({
					type:"POST",
					url:"./confirmShapeData.do",
					processData:false,
					contentType:false,
					data:formData,
					success:function(data){
						var result = JSON.parse(data);
						switch(result.rs) {
							case "complete" :
								document.location.href = '/desk/mapdata/shapeData.do';
							break;
						}
					},
					error:function(request,status,error){
						alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error"+error);
					}
				});
			},
			addShapeData:function() {
				if($("#shapeDataName").val() == "") {
					alert('Shape 데이터명을 입력하세요');
					$("#shapeDataName").focus();
					return false;
				}

				if(GLOBAL.FILE.isUpload == true) {
					alert('현재 업로드가 진행중입니다');
					return false;
				}

				if(GLOBAL.FILE.isConvert == true) {
					alert('현재 데이터 가공이 진행중입니다');
					return false;
				}

				GLOBAL.FILE.changeStatus(1);
				GLOBAL.FILE.isUpload = true;
				
				var isHeight = "N";
				
				if($("input:checkbox[id='isShapeHeight']").is(":checked")) {
					isHeight = "Y";
				}

				var formData = new FormData();
				formData.append("control", "addShapeData");
				formData.append("dataName", $("#shapeDataName").val());
				formData.append("coordType", $("#shapeDataCoord").val());
				formData.append("recDate", $("#shapeDataRecDate").val());
				formData.append("isHeight", isHeight);

				for(var i = 0; i < GLOBAL.FILE.files.length; i++) {
					formData.append("fileLists", GLOBAL.FILE.files[i]);
				}

				if(GLOBAL.FILE.XHR != null) {
					GLOBAL.FILE.XHR.abort();
				}

				GLOBAL.FILE.XHR =  $.ajax({
					url: "./uploadShapeData.do",
					type: "POST",
					data: formData,
					processData: false,
					contentType: false,
					xhr:function() {
						var myXhr = $.ajaxSettings.xhr();
						if(myXhr.upload) {
							myXhr.upload.addEventListener('progress',GLOBAL.FILE.multipleUploadProgress, false);
						}
						return myXhr;
					},
					success: function(result) {
						var result = JSON.parse(result);
						
						console.log(result);

						switch(result.rs) {
							case "complete" :
								GLOBAL.DATA.SHAPE.dataId = result.mapsDataVO.dataid;

								if(result.mapsDataVO.thumbnail_url != "") {
									var html = "<img src=\""+result.mapsDataVO.thumbnail_url+"\">";
									$("#thumb").html(html);
								}

								if(result.mapsDataVO.coord_epsg != "") {
									var html = "";
									html += "<p>- COORD : "+result.mapsDataVO.coord_epsg+"</p>";
									html += "<p>- MINX : "+result.mapsDataVO.minx+" / MINY : "+result.mapsDataVO.miny+"</p>";
									html += "<p>- MAXX : "+result.mapsDataVO.maxx+" / MAXY : "+result.mapsDataVO.maxy+"</p>";
									$("#projection").html(html);
								}

								$("#btnSuccess").css("display", "none");
								$("#btnConfirm").css("display", "inline");

							break;

							case "NOT_ABLE_TYPE" :
								alert('지원하지 않는 파일 포맷입니다.');
								return false;
							break;

							case "WAIT_MORE_FILE" :
								return;
							break;

							default :

							break;
						}

						GLOBAL.FILE.isUpload = false;
					}
				}); // End of XHR
			}// End of Add Shape
		},
		DRONE_MODEL:{
			addDroneModel:function() {
				if($("#droneModelDataName").val() == "") {
					alert('드론모델 데이터명을 입력하세요');
					$("#droneModelDataName").focus();
					return false;
				}

				if(GLOBAL.FILE.isUpload == true) {
					alert('현재 업로드가 진행중입니다');
					return false;
				}

				if(GLOBAL.FILE.isConvert == true) {
					alert('현재 데이터 가공이 진행중입니다');
					return false;
				}

				GLOBAL.FILE.changeStatus(1);
				GLOBAL.FILE.isUpload = true;

				var formData = new FormData();
				formData.append("dataName", $("#droneModelDataName").val());
				formData.append("coordType", $("#droneModelDataCoord").val());
				formData.append("recDate", $("#droneModelDataRecDate").val());

				for(var i = 0; i < GLOBAL.FILE.files.length; i++) {
					formData.append("fileLists", GLOBAL.FILE.files[i]);
				}

				if(GLOBAL.FILE.XHR != null) {
					GLOBAL.FILE.XHR.abort();
				}

				GLOBAL.FILE.XHR =  $.ajax({
					url: "/desk/mapdata/uploadDroneModelData.do",
					type: "POST",
					data: formData,
					processData: false,
					contentType: false,
					xhr:function() {
						var myXhr = $.ajaxSettings.xhr();
						if(myXhr.upload) {
							myXhr.upload.addEventListener('progress',GLOBAL.FILE.multipleUploadProgress, false);
						}
						return myXhr;
					},
					success: function(result) {
						var result = JSON.parse(result);
						console.log(result);
						switch(result.rs) {
							case "complete" :
								if(confirm('드론모델 데이터 업로드가 완료 됐습니다. 클라우드 가공 현황 페이지로 이동 하시겠습니까?')) {
									document.location.href = "/desk/meta_service/status.do";
								}
								

							break;

							case "NOT_ABLE_TYPE" :
								alert('지원하지 않는 파일 포맷입니다.');
								return false;
							break;

							case "WAIT_MORE_FILE" :
								return;
							break;

							default :

							break;
						}

						GLOBAL.FILE.isUpload = false;
					}
				}); // End of XHR
			}
		},
		POINTCLOUD:{
			MOVE_LAT:0.0,
			MOVE_LON:0.0,
			selectSortGroup:function() {
				document.location.href = "/builder/manage/pointcloud/?grp="+$("#pointCloudSortGroup").val()+"";
			},
			newMapWithPointCloud:function(dataId) {
				var formData=new FormData();
				formData.append("control","createNewMapWithData");
				formData.append("dataType", "POINT");
				formData.append("DATAID", dataId);

				$.ajax({
					type:"POST",
					url:"/builder/controller/maps/ctrlMaps.php",
					processData:false,
					contentType:false,
					data:formData,
					success:function(data){
						var result = JSON.parse(data);
						switch(result.resultCode) {
							case "complete" :
								alert('지도가 생성되었습니다. 편집화면으로 이동합니다.');
								location.href="/builder/ide/view.php?MAPID="+result.MAPID+"";
							break;
						}
					},
					error:function(request,status,error){
						alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error"+error);
					}
				});
			},
			addPointCloudData:function() {
				if($("#lasDataName").val() == "") {
					alert('포인트클라우드 데이터명을 입력하세요');
					$("#lasDataName").focus();
					return false;
				}

				if(GLOBAL.FILE.isUpload == true) {
					alert('현재 업로드가 진행중입니다');
					return false;
				}

				if(GLOBAL.FILE.isConvert == true) {
					alert('현재 데이터 가공이 진행중입니다');
					return false;
				}

				GLOBAL.FILE.changeStatus(1);
				GLOBAL.FILE.isUpload = true;

				var formData = new FormData();
				formData.append("dataName", $("#lasDataName").val());
				formData.append("coordType", $("#lasDataCoord").val());
				formData.append("recDate", $("#lasDataRecDate").val());

				for(var i = 0; i < GLOBAL.FILE.files.length; i++) {
					formData.append("fileLists", GLOBAL.FILE.files[i]);
				}

				if(GLOBAL.FILE.XHR != null) {
					GLOBAL.FILE.XHR.abort();
				}

				GLOBAL.FILE.XHR =  $.ajax({
					url: "./uploadPointCloud.do",
					type: "POST",
					data: formData,
					processData: false,
					contentType: false,
					xhr:function() {
						var myXhr = $.ajaxSettings.xhr();
						if(myXhr.upload) {
							myXhr.upload.addEventListener('progress',GLOBAL.FILE.multipleUploadProgress, false);
						}
						return myXhr;
					},
					success: function(result) {
						var result = JSON.parse(result);
						console.log(result);

						switch(result.rs) {
							case "complete" :
								console.log("complete");
								if(confirm('포인트클라우드 업로드가 완료 됐습니다. 클라우드 가공 현황 페이지로 이동 하시겠습니까?')) {
									document.location.href = "/desk/meta_service/status.do";
								}

							break;

							case "NOT_ABLE_TYPE" :
								alert('지원하지 않는 파일 포맷입니다.');
								return false;
							break;

							case "WAIT_MORE_FILE" :
								return;
							break;

							default :

							break;
						}

						GLOBAL.FILE.isUpload = false;
					}
				}); // End of XHR
			},// End of PointCloudData
			convertCloud:function(fids) {
				var formData = new FormData();
				formData.append("control", "convertPointCloud");
				formData.append("FIDS", fids);
				formData.append("dataName", $("#lasDataName").val());
				formData.append("coordType", $("#lasDataCoord").val());
				formData.append("recDate", $("#lasDataRecDate").val());

				if(GLOBAL.FILE.XHR != null) {
					GLOBAL.FILE.XHR.abort();
				}

				GLOBAL.FILE.changeStatus(2);

				GLOBAL.FILE.XHR =  $.ajax({
					url: "/builder/controller/data/ctrlPointcloudData.php",
					type: "POST",
					data: formData,
					processData: false,
					contentType: false,
					success: function(result) {
						var result = JSON.parse(result);

						switch(result.resultCode) {
							case "complete" :
								GLOBAL.DATA.POINTCLOUD.checkProgress(result.resultDataId);
							break;
						}
					}
				});
			},
			checkProgress:function(dataId) {
				var formData = new FormData();
				formData.append("control", "checkLasProgress");
				formData.append("DATAID", dataId);

				$.ajax({
					url: "/builder/controller/data/ctrlProgress.php",
					type: "POST",
					data: formData,
					processData: false,
					contentType: false,
					success: function(result) {
						var result = JSON.parse(result);
						console.log(result);
						switch(result.resultCode) {
							case "complete" :
								$("#progress-percent").css("width", result.percent+"%");
								$("#progress-percent").html(result.percent+"%");

								var html = "";
								html += "전체 : <span style=\"color:#FFAA00;\">"+result.remain+"</span> / 진행 : <span style=\"color:#00D4FF;\">"+result.total+"</span>";

								$("#remainTime").html(html);

								if(result.percent == "100" || result.percent == 100) {
									// Complete
									clearTimeout(GLOBAL.INTERVAL);
									// 가공
									//GLOBAL.DATA.TERRAIN.convertTerrain(dataId);

									$("#remainTime").html("좌표정보 수집중");
									GLOBAL.DATA.POINTCLOUD.getCoordInfo(dataId);

								} else {
									clearTimeout(GLOBAL.INTERVAL);
									GLOBAL.INTERVAL = setTimeout(function() {
										GLOBAL.DATA.POINTCLOUD.checkProgress(dataId);
									}, 1000);
								}
							break;

							case "waitProgress" :
								clearTimeout(GLOBAL.INTERVAL);
								GLOBAL.INTERVAL = setTimeout(function() {
									GLOBAL.DATA.POINTCLOUD.checkProgress(dataId);
								}, 1000);
							break;
						}
					}
				});
			},
			changeDataName:function(dataId) {
				$("#dataName_"+dataId).attr("onclick", "").unbind("click");

				var name = $("#dataName_"+dataId).html();

				var html = "<input type=\"text\" class=\"form-control\" id=\"changeDataName_"+dataId+"\" value=\""+name+"\">";
				$("#dataName_"+dataId).html(html);

				$("#changeDataName_"+dataId).focus();

				$("#changeDataName_"+dataId).on("keyup", function(e) {
					if(e.keyCode == 13) {
						// Enter
						var formData = new FormData();
						formData.append("control", "changeDataName");
						formData.append("DATAID", dataId);
						formData.append("dataName", $("#changeDataName_"+dataId).val());

						$.ajax({
							url: "/builder/controller/data/ctrlPointcloudData.php",
							type: "POST",
							data: formData,
							processData: false,
							contentType: false,
							success: function(result) {
								var result = JSON.parse(result);

								switch(result.resultCode) {
									case "complete" :
										$("#dataName_"+dataId).html($("#changeDataName_"+dataId).val());

										$("#dataName_"+dataId).click(function() {
											GLOBAL.DATA.POINTCLOUD.changeDataName(dataId);
										});
									break;

									case "FAIL" :
										alert('데이터명 변경할 수 없습니다. 관리자에게 문의하세요');
										$("#dataName_"+dataId).html(name);

										$("#dataName_"+cvid).click(function() {
											GLOBAL.DATA.POINTCLOUD.changeDataName(dataId);
										});
										return false;
									break;
								}
							}
						});

					} else if(e.keyCode == 27) {
						// Cancel
						$("#dataName_"+dataId).html(name);

						$("#dataName_"+dataId).click(function() {
							GLOBAL.DATA.POINTCLOUD.changeDataName(dataId);
						});
					}
				});

				$("#changeDataName_"+dataId).focusout(function() {
					$("#dataName_"+dataId).html(name);

					$("#dataName_"+dataId).click(function() {
						GLOBAL.DATA.POINTCLOUD.changeDataName(dataId);
					});
				});
			},
			getCoordInfo:function(dataId) {
				var formData = new FormData();
				formData.append("control", "loadCoordInfo");
				formData.append("DATAID", dataId);

				$.ajax({
					url: "/builder/controller/data/ctrlPointcloudData.php",
					type: "POST",
					data: formData,
					processData: false,
					contentType: false,
					success: function(result) {
						var result = JSON.parse(result);
						console.log(result);
						switch(result.resultCode) {
							case "complete" :
								GLOBAL.FILE.changeStatus(4);
								$("#remainTime").html("완료");
								if(confirm('데이터 가공이 완료 됐습니다. 지도에서 바로 확인하시겠습니까?')) {
									$("#dataConvertStatus").css("display", "none");

									GLOBAL.DATA.POINTCLOUD.newMapWithPointCloud(dataId);
								} else {
									document.location.href = "/builder/manage/pointcloud/";
								}
							break;

							default :
								alert('데이터 좌표수집에 실패했습니다. 관리자에게 문의하세요.');
								return false;
							break;
						}
					}
				});
			},
			deletePointcloud:function(dataId) {
				if(!confirm('해당 데이터를 정말 삭제하시겠습니까?')) {
					return false;
				}

				$("#btnDelete_"+dataId).html("<i class=\"fas fa-spinner fa-spin\"></i> 삭제중");

				var formData = new FormData();
				formData.append("control", "deletePointcloud");
				formData.append("DATAID", dataId);

				$.ajax({
					url: "/builder/controller/data/ctrlPointcloudData.php",
					type: "POST",
					data: formData,
					processData: false,
					contentType: false,
					success: function(result) {
						var result = JSON.parse(result);

						switch(result.resultCode) {
							case "complete" :
								document.location.reload();
							break;
						}
					}
				});
			}
		},
		TERRAIN:{
			thumbUrl:"",
			MOVE_LAT:0.0,
			MOVE_LON:0.0,
			MINX:0.0,
			MINY:0.0,
			MAXX:0.0,
			MAXY:0.0,
			selectSortGroup:function() {
				document.location.href = "/builder/manage/terrain/?grp="+$("#terrainSortGroup").val()+"";
			},
			newMapWithTerrain:function(cvid) {
				var formData=new FormData();
				formData.append("control","createNewMapWithData");
				formData.append("dataType", "TERRAIN");
				formData.append("DATAID", cvid);

				$.ajax({
					type:"POST",
					url:"/builder/controller/maps/ctrlMaps.php",
					processData:false,
					contentType:false,
					data:formData,
					success:function(data){

						var result = JSON.parse(data);

						switch(result.resultCode) {
							case "complete" :
								alert('지도가 생성되었습니다. 편집화면으로 이동합니다.');
								location.href="/builder/ide/view.php?MAPID="+result.MAPID+"";
							break;
						}
					},
					error:function(request,status,error){
						alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error"+error);
					}
				});
			},
			changeDataName:function(cvid) {

				$("#dataName_"+cvid).attr("onclick", "").unbind("click");

				var name = $("#dataName_"+cvid).html();

				var html = "<input type=\"text\" class=\"form-control\" id=\"changeDataName_"+cvid+"\" value=\""+name+"\">";
				$("#dataName_"+cvid).html(html);

				$("#changeDataName_"+cvid).focus();

				$("#changeDataName_"+cvid).on("keyup", function(e) {
					if(e.keyCode == 13) {
						// Enter
						var formData = new FormData();
						formData.append("control", "changeDataName");
						formData.append("CVID", cvid);
						formData.append("dataName", $("#changeDataName_"+cvid).val());

						$.ajax({
							url: "/builder/controller/data/ctrlTerrainData.php",
							type: "POST",
							data: formData,
							processData: false,
							contentType: false,
							success: function(result) {
								var result = JSON.parse(result);

								switch(result.resultCode) {
									case "complete" :
										$("#dataName_"+cvid).html($("#changeDataName_"+cvid).val());

										$("#dataName_"+cvid).click(function() {
											GLOBAL.DATA.TERRAIN.changeDataName(cvid);
										});
									break;

									case "FAIL" :
										alert('데이터명 변경할 수 없습니다. 관리자에게 문의하세요');
										$("#dataName_"+cvid).html(name);

										$("#dataName_"+cvid).click(function() {
											GLOBAL.DATA.TERRAIN.changeDataName(cvid);
										});
										return false;
									break;
								}
							}
						});

					} else if(e.keyCode == 27) {
						// Cancel
						$("#dataName_"+cvid).html(name);

						$("#dataName_"+cvid).click(function() {
							GLOBAL.DATA.TERRAIN.changeDataName(cvid);
						});
					}
				});

				$("#changeDataName_"+cvid).focusout(function() {
					$("#dataName_"+cvid).html(name);

					$("#dataName_"+cvid).click(function() {
						GLOBAL.DATA.TERRAIN.changeDataName(cvid);
					});
				});
			},
			deleteTerrain:function(cvid) {
				if(!confirm('해당 데이터를 정말 삭제하시겠습니까?')) {
					return false;
				}

				$("#btnDelete_"+cvid).html("<i class=\"fas fa-spinner fa-spin\"></i> 삭제중");

				var formData = new FormData();
				formData.append("control", "deleteTerrainData");
				formData.append("CVID", cvid);

				$.ajax({
					url: "/builder/controller/data/ctrlTerrainData.php",
					type: "POST",
					data: formData,
					processData: false,
					contentType: false,
					success: function(result) {
						var result = JSON.parse(result);

						switch(result.resultCode) {
							case "complete" :
								document.location.reload();
							break;
						}
					}
				});
			},
			checkConvertProgress:function(dataId) {
				var formData = new FormData();
				formData.append("control", "checkConvertProgress");
				formData.append("DATAID", dataId);

				$.ajax({
					type: "POST",
					url: "/builder/controller/data/ctrlProgress.php",
					processData: false,
					contentType: false,
					data:formData,
					success : function(data) {

						var result = JSON.parse(data);

						console.log(result);

						switch(result.resultCode) {
							case "complete" :
								$("#progress-percent").css("width", "100%");
								$("#progress-percent").html("100%");

								GLOBAL.FILE.changeStatus(4);
								clearTimeout(GLOBAL.INTERVAL);

								setTimeout(function() {
									if(confirm('데이터 가공이 완료 됐습니다. 지도에서 바로 확인하시겠습니까?')) {
										$("#dataConvertStatus").css("display", "none");

										if(result.CONVERTTYPE == "M") {

										} else {

										}
										GLOBAL.DATA.TERRAIN.newMapWithTerrain(dataId);
									} else {
										document.location.href = "/builder/manage/terrain/";
									}
								}, 1000);

							break;

							case "WAIT":
								console.log("WAIT");
								clearTimeout(GLOBAL.INTERVAL);
								GLOBAL.INTERVAL = setTimeout(function() {
									GLOBAL.DATA.TERRAIN.checkConvertProgress(dataId);
								}, 1500);
							break;

							case "PROGRESS":
								$("#progress-percent").css("width", result.resultProgress+"%");
								$("#progress-percent").html(parseInt(result.resultProgress)+"%");
								clearTimeout(GLOBAL.INTERVAL);
								GLOBAL.INTERVAL = setTimeout(function() {
									GLOBAL.DATA.TERRAIN.checkConvertProgress(dataId);
								}, 1500);
							break;

							case "NOFILE":
								console.log("Not Exists Progress Log File:"+result.resultLogFile);
								GLOBAL.INTERVAL = setTimeout(function() {
									GLOBAL.DATA.TERRAIN.checkConvertProgress(dataId);
								}, 2000);
							break;

							default:
								console.log(result);
							break;
						}
					},
					error : function(request,status,error) {
						alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
					}
				});
			},
			convertTerrain:function(dataId) {
				GLOBAL.FILE.changeStatus(3);

				var formData = new FormData();
				formData.append("control", "convertTerrain");
				formData.append("DATAID", dataId);
				formData.append("convertType", $(":input:radio[name=terrainDataConvertType]:checked").val());
				formData.append("dataName", $("#terrainDataName").val());
				formData.append("coordType", $("#terrainDataCoord").val());
				formData.append("recDate", $("#terrainDataRecDate").val());
				formData.append("thumbUrl", GLOBAL.DATA.TERRAIN.thumbUrl);
				formData.append("moveLon", GLOBAL.DATA.TERRAIN.MOVE_LON);
				formData.append("moveLat", GLOBAL.DATA.TERRAIN.MOVE_LAT);


				setTimeout(function() {
					GLOBAL.DATA.TERRAIN.checkConvertProgress(dataId);
				}, 2000);

				$.ajax({
					url: "/builder/controller/data/ctrlTerrainData.php",
					type: "POST",
					data: formData,
					processData: false,
					contentType: false,
					success: function(result) {
						var result = JSON.parse(result);
						switch(result.resultCode) {
							case "complete" :

							break;
						}
					}
				});
			},
			convertCloud:function(fids) {

				var formData = new FormData();
				formData.append("control", "convertCloud");
				formData.append("FIDS", fids);
				formData.append("convertType", $(":input:radio[name=terrainDataConvertType]:checked").val());
				formData.append("dataName", $("#terrainDataName").val());
				formData.append("coordType", $("#terrainDataCoord").val());
				formData.append("recDate", $("#terrainDataRecDate").val());
				formData.append("thumbUrl", GLOBAL.DATA.TERRAIN.thumbUrl);
				formData.append("moveLon", GLOBAL.DATA.TERRAIN.MOVE_LON);
				formData.append("moveLat", GLOBAL.DATA.TERRAIN.MOVE_LAT);
				formData.append("minx", GLOBAL.DATA.TERRAIN.MINX);
				formData.append("miny", GLOBAL.DATA.TERRAIN.MINY);
				formData.append("maxx", GLOBAL.DATA.TERRAIN.MAXX);
				formData.append("maxy", GLOBAL.DATA.TERRAIN.MAXY);

				if(GLOBAL.FILE.XHR != null) {
					GLOBAL.FILE.XHR.abort();
				}

				GLOBAL.FILE.changeStatus(2);

				GLOBAL.FILE.XHR =  $.ajax({
					url: "/builder/controller/data/ctrlTerrainData.php",
					type: "POST",
					data: formData,
					processData: false,
					contentType: false,
					success: function(result) {
						var result = JSON.parse(result);

						switch(result.resultCode) {
							case "complete" :
								GLOBAL.DATA.TERRAIN.checkProgress(result.resultDataId);
							break;
						}
					}
				});
			},
			checkProgress:function(dataId) {
				var formData = new FormData();
				formData.append("control", "checkProgress");
				formData.append("DATAID", dataId);

				$.ajax({
					url: "/builder/controller/data/ctrlProgress.php",
					type: "POST",
					data: formData,
					processData: false,
					contentType: false,
					success: function(result) {
						var result = JSON.parse(result);
						console.log(result);
						switch(result.resultCode) {
							case "complete" :
								$("#progress-percent").css("width", result.resultData+"%");
								$("#progress-percent").html(result.resultData+"%");

								if(result.resultData == "100" || result.resultData == 100) {
									// Complete
									clearTimeout(GLOBAL.INTERVAL);
									// 가공
									GLOBAL.DATA.TERRAIN.convertTerrain(dataId);

								} else {
									clearTimeout(GLOBAL.INTERVAL);
									GLOBAL.INTERVAL = setTimeout(function() {
										GLOBAL.DATA.TERRAIN.checkProgress(dataId);
									}, 1000);
								}
							break;

							case "waitProgress" :
								clearTimeout(GLOBAL.INTERVAL);
								GLOBAL.INTERVAL = setTimeout(function() {
									GLOBAL.DATA.TERRAIN.checkProgress(dataId);
								}, 1000);
							break;
						}
					}
				});
			},
			addTerrainData:function() {
				if($("#terrainDataName").val() == "") {
					alert('지형 데이터명을 입력하세요');
					$("#terrainDataName").focus();
					return false;
				}

				if(GLOBAL.FILE.isUpload == true) {
					alert('현재 업로드가 진행중입니다');
					return false;
				}

				if(GLOBAL.FILE.isConvert == true) {
					alert('현재 데이터 가공이 진행중입니다');
					return false;
				}

				GLOBAL.FILE.changeStatus(1);
				GLOBAL.FILE.isUpload = true;

				var formData = new FormData();
				formData.append("dataName", $("#terrainDataName").val());
				formData.append("coordType", $("#terrainDataCoord").val());
				formData.append("recDate", $("#terrainDataRecDate").val());
				formData.append("convertType", $(":input:radio[name=terrainDataConvertType]:checked").val());
				

				for(var i = 0; i < GLOBAL.FILE.files.length; i++) {
					formData.append("terrainFiles", GLOBAL.FILE.files[i]);
				}

				if(GLOBAL.FILE.XHR != null) {
					GLOBAL.FILE.XHR.abort();
				}
				
				$("#progrssStr").show();
				
				GLOBAL.FILE.XHR =  $.ajax({
					url: "./uploadTerrainData.do",
					type: "POST",
					data: formData,
					processData: false,
					contentType: false,
					xhr:function() {
						var myXhr = $.ajaxSettings.xhr();
						if(myXhr.upload) {
							myXhr.upload.addEventListener('progress',GLOBAL.FILE.multipleUploadProgress, false);
						}
						return myXhr;
					},
					success: function(result) {
						var result = JSON.parse(result);
						
						console.log(result);
						
						switch(result.rs) {
							case "complete" :
								$("#progrssStr").html("지형 데이터 업로드 완료");
								
								var html = "";
								html += "- BAND : <strong>"+result.BANDS+"</strong><br/>\n";
								html += "- MIN-X : <strong>"+result.minx+"</strong>, - MIN-Y : <strong>"+result.miny+"</strong><br/>\n";
								html += "- MAX-X : <strong>"+result.maxx+"</strong>, - MAX-Y : <strong>"+result.maxy+"</strong><br/>\n";
								html += "- WIDTH : <strong>"+result.width+"</strong>, - HEIGHT : <strong>"+result.height+"</strong><br/>\n";
								
								$("#rawDataInfo").html(html);
								
								$("#dataThumb").html("<img src=\""+result.thumb+"\">");

								if(confirm('지형 데이터 업로드가 완료 됐습니다. 클라우드 가공 현황 페이지로 이동 하시겠습니까?')) {
									document.location.href = "/desk/meta_service/status.do";
								}
								
							break;

							case "NOT_ABLE_TYPE" :
								alert('지원하지 않는 파일 포맷입니다.');
								return false;
							break;

							case "WAIT_MORE_FILE" :
								return;
							break;

							default :

							break;
						}

						GLOBAL.FILE.isUpload = false;
					}
				}); // End of XHR
			}, // End of AddImageData
			reset:function() {
				$("#terrainDataName").val("");
				GLOBAL.FILE.resetUploadSet();

				$("#progress-percent").css("width", "0%");
				$("#progress-percent").html("0%");


				GLOBAL.FILE.changeStatus(0);

			}
		},
		IMAGE:{
			thumbUrl:"",
			MOVE_LAT:0.0,
			MOVE_LON:0.0,
			MINX:0.0,
			MINY:0.0,
			MAXX:0.0,
			MAXY:0.0,
			WIDTH:0,
			HEIGHT:0,
			BANDS:0,
			BITS:0,
			RESOLUTION:0,
			selectSortGroup:function() {
				document.location.href = "/builder/manage/image/?grp="+$("#imageSortGroup").val()+"";
			},
			newMapWithImage:function(cvid) {
				var formData=new FormData();
				formData.append("control","createNewMapWithData");
				formData.append("dataType", "IMAGE");
				formData.append("DATAID", cvid);

				$.ajax({
					type:"POST",
					url:"/builder/controller/maps/ctrlMaps.php",
					processData:false,
					contentType:false,
					data:formData,
					success:function(data){

						var result = JSON.parse(data);

						switch(result.resultCode) {
							case "complete" :
								alert('지도가 생성되었습니다. 편집화면으로 이동합니다.');
								location.href="/builder/ide/view.php?MAPID="+result.MAPID+"";
							break;
						}
					},
					error:function(request,status,error){
						alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error"+error);
					}
				});
			},
			changeDataName:function(cvid) {

				$("#dataName_"+cvid).attr("onclick", "").unbind("click");

				var name = $("#dataName_"+cvid).html();

				var html = "<input type=\"text\" class=\"form-control\" id=\"changeDataName_"+cvid+"\" value=\""+name+"\">";
				$("#dataName_"+cvid).html(html);

				$("#changeDataName_"+cvid).focus();

				$("#changeDataName_"+cvid).on("keyup", function(e) {
					if(e.keyCode == 13) {
						// Enter
						var formData = new FormData();
						formData.append("control", "changeDataName");
						formData.append("CVID", cvid);
						formData.append("dataName", $("#changeDataName_"+cvid).val());

						$.ajax({
							url: "/builder/controller/data/ctrlImageData.php",
							type: "POST",
							data: formData,
							processData: false,
							contentType: false,
							success: function(result) {
								var result = JSON.parse(result);

								switch(result.resultCode) {
									case "complete" :
										$("#dataName_"+cvid).html($("#changeDataName_"+cvid).val());

										$("#dataName_"+cvid).click(function() {
											GLOBAL.DATA.IMAGE.changeDataName(cvid);
										});
									break;

									case "FAIL" :
										alert('데이터명 변경할 수 없습니다. 관리자에게 문의하세요');
										$("#dataName_"+cvid).html(name);

										$("#dataName_"+cvid).click(function() {
											GLOBAL.DATA.IMAGE.changeDataName(cvid);
										});
										return false;
									break;
								}
							}
						});

					} else if(e.keyCode == 27) {
						// Cancel
						$("#dataName_"+cvid).html(name);

						$("#dataName_"+cvid).click(function() {
							GLOBAL.DATA.IMAGE.changeDataName(cvid);
						});
					}
				});

				$("#changeDataName_"+cvid).focusout(function() {
					$("#dataName_"+cvid).html(name);

					$("#dataName_"+cvid).click(function() {
						GLOBAL.DATA.IMAGE.changeDataName(cvid);
					});
				});
			},
			deleteImage:function(cvid) {
				if(!confirm('해당 데이터를 정말 삭제하시겠습니까?')) {
					return false;
				}

				$("#btnDelete_"+cvid).html("<i class=\"fas fa-spinner fa-spin\"></i> 삭제중");

				var formData = new FormData();
				formData.append("control", "deleteImageData");
				formData.append("CVID", cvid);

				$.ajax({
					url: "/builder/controller/data/ctrlImageData.php",
					type: "POST",
					data: formData,
					processData: false,
					contentType: false,
					success: function(result) {
						var result = JSON.parse(result);

						switch(result.resultCode) {
							case "complete" :
								document.location.reload();
							break;
						}
					}
				});
			},
			convertCloud:function(fids) {

				var bgTemp = GLOBAL.UTIL.hexToRgb($("#imageDataBackColor").val());
				var bgColor = new Array();

				bgColor[0] = bgTemp.r;
				bgColor[1] = bgTemp.g;
				bgColor[2] = bgTemp.b;

				var formData = new FormData();
				//formData.append("control", "convertCloudLinear");
				formData.append("control", "convertCloud");
				formData.append("FIDS", fids);
				formData.append("convertType", $(":input:radio[name=imageDataConvertType]:checked").val());
				formData.append("bgColor", bgColor);
				formData.append("dataName", $("#imageDataName").val());
				formData.append("coordType", $("#imageDataCoord").val());
				formData.append("recDate", $("#imageDataRecDate").val());
				formData.append("thumbUrl", GLOBAL.DATA.IMAGE.thumbUrl);
				formData.append("moveLon", GLOBAL.DATA.IMAGE.MOVE_LON);
				formData.append("moveLat", GLOBAL.DATA.IMAGE.MOVE_LAT);

				formData.append("minx", GLOBAL.DATA.IMAGE.MINX);
				formData.append("miny", GLOBAL.DATA.IMAGE.MINY);
				formData.append("maxx", GLOBAL.DATA.IMAGE.MAXX);
				formData.append("maxy", GLOBAL.DATA.IMAGE.MAXY);
				formData.append("width", GLOBAL.DATA.IMAGE.WIDTH);
				formData.append("height", GLOBAL.DATA.IMAGE.HEIGHT);
				formData.append("bands", GLOBAL.DATA.IMAGE.BANDS);
				formData.append("bits", GLOBAL.DATA.IMAGE.BITS);
				formData.append("resolution", GLOBAL.DATA.IMAGE.RESOLUTION);

				if(GLOBAL.FILE.XHR != null) {
					GLOBAL.FILE.XHR.abort();
				}

				GLOBAL.FILE.changeStatus(2);

				GLOBAL.FILE.XHR =  $.ajax({
					url: "/builder/controller/data/ctrlImageData.php",
					type: "POST",
					data: formData,
					processData: false,
					contentType: false,
					success: function(result) {
						var result = JSON.parse(result);

						switch(result.resultCode) {
							case "complete" :
								GLOBAL.DATA.IMAGE.checkProgress(result.resultDataId);
								//alert('완료');

							break;
						}
					}
				});
			},
			checkProgress:function(dataId) {
				var formData = new FormData();
				formData.append("control", "checkProgress");
				formData.append("DATAID", dataId);

				$.ajax({
					url: "/builder/controller/data/ctrlProgress.php",
					type: "POST",
					data: formData,
					processData: false,
					contentType: false,
					success: function(result) {
						var result = JSON.parse(result);
						console.log(result);
						switch(result.resultCode) {
							case "complete" :
								$("#progress-percent").css("width", result.resultData+"%");
								$("#progress-percent").html(result.resultData+"%");

								if(result.resultData == "100" || result.resultData == 100) {
									// Complete
									clearTimeout(GLOBAL.INTERVAL);
									// 가공
									GLOBAL.DATA.IMAGE.convertImage(dataId);

								} else {
									clearTimeout(GLOBAL.INTERVAL);
									GLOBAL.INTERVAL = setTimeout(function() {
										GLOBAL.DATA.IMAGE.checkProgress(dataId);
									}, 1000);
								}
							break;

							case "waitProgress" :
								clearTimeout(GLOBAL.INTERVAL);
								GLOBAL.INTERVAL = setTimeout(function() {
									GLOBAL.DATA.IMAGE.checkProgress(dataId);
								}, 1000);
							break;
						}
					}
				});
			},
			checkConvertProgress:function(dataId) {
				var formData = new FormData();
				formData.append("control", "checkConvertProgress");
				formData.append("DATAID", dataId);

				$.ajax({
					type: "POST",
					url: "/builder/controller/data/ctrlProgress.php",
					processData: false,
					contentType: false,
					data:formData,
					success : function(data) {

						var result = JSON.parse(data);

						console.log(result);

						switch(result.resultCode) {
							case "complete" :
								$("#progress-percent").css("width", "100%");
								$("#progress-percent").html("100%");

								GLOBAL.FILE.changeStatus(4);
								clearTimeout(GLOBAL.INTERVAL);

								setTimeout(function() {
									if(confirm('데이터 가공이 완료 됐습니다. 지도에서 바로 확인하시겠습니까?')) {
										$("#dataConvertStatus").css("display", "none");
										// Add Layer
										//showUserMapData:function(cvid, dataType)
										if(result.CONVERTTYPE == "M") {
											// Add to Layer List

											//CXDMap.CLOUD.LIBRARY.IMAGE.addImageToLayerList(result.CVID);
											//CXDMap.showUserMapData(result.CVID, result.DATATYPE, result.moveLat, result.moveLon, result.coordType);
										} else {
										}

										GLOBAL.DATA.IMAGE.newMapWithImage(dataId);
									} else {
										document.location.href = "/builder/manage/image/";
									}
								}, 1000);

							break;

							case "WAIT":
								console.log("WAIT");
								clearTimeout(GLOBAL.INTERVAL);
								GLOBAL.INTERVAL = setTimeout(function() {
									GLOBAL.DATA.IMAGE.checkConvertProgress(dataId);
								}, 1500);
							break;

							case "PROGRESS":
								$("#progress-percent").css("width", result.resultProgress+"%");
								$("#progress-percent").html(parseInt(result.resultProgress)+"%");
								clearTimeout(GLOBAL.INTERVAL);
								GLOBAL.INTERVAL = setTimeout(function() {
									GLOBAL.DATA.IMAGE.checkConvertProgress(dataId);
								}, 1500);
							break;

							case "NOFILE":
								console.log("Not Exists Progress Log File:"+result.resultLogFile);
								GLOBAL.INTERVAL = setTimeout(function() {
									GLOBAL.DATA.IMAGE.checkConvertProgress(dataId);
								}, 2000);
							break;

							default:
								console.log(result);
							break;
						}
					},
					error : function(request,status,error) {
						alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
					}
				});
			},
			convertImage:function(dataId) {
				GLOBAL.FILE.changeStatus(3);

				var bgTemp = GLOBAL.UTIL.hexToRgb($("#imageDataBackColor").val());
				var bgColor = new Array();

				bgColor[0] = bgTemp.r;
				bgColor[1] = bgTemp.g;
				bgColor[2] = bgTemp.b;

				var formData = new FormData();
				formData.append("control", "convertImage");
				formData.append("DATAID", dataId);
				formData.append("convertType", $(":input:radio[name=imageDataConvertType]:checked").val());
				formData.append("bgColor", bgColor);
				formData.append("dataName", $("#imageDataName").val());
				formData.append("coordType", $("#imageDataCoord").val());
				formData.append("recDate", $("#imageDataRecDate").val());
				formData.append("thumbUrl", GLOBAL.DATA.IMAGE.thumbUrl);
				formData.append("moveLon", GLOBAL.DATA.IMAGE.MOVE_LON);
				formData.append("moveLat", GLOBAL.DATA.IMAGE.MOVE_LAT);

				setTimeout(function() {
					GLOBAL.DATA.IMAGE.checkConvertProgress(dataId);
				}, 2000);

				$.ajax({
					url: "/builder/controller/data/ctrlImageData.php",
					type: "POST",
					data: formData,
					processData: false,
					contentType: false,
					success: function(result) {
						var result = JSON.parse(result);
						switch(result.resultCode) {
							case "complete" :

							break;
						}
					}
				});
			},
			addImageData:function() {
				
				if($("#imageDataName").val() == "") {
					alert('영상 데이터명을 입력하세요');
					$("#imageDataName").focus();
					return false;
				}

				if(GLOBAL.FILE.isUpload == true) {
					alert('현재 업로드가 진행중입니다');
					return false;
				}

				if(GLOBAL.FILE.isConvert == true) {
					alert('현재 데이터 가공이 진행중입니다');
					return false;
				}

				GLOBAL.FILE.changeStatus(1);
				GLOBAL.FILE.isUpload = true;

				var bgTemp = GLOBAL.UTIL.hexToRgb($("#imageDataBackColor").val());
				var bgColor = new Array();

				bgColor[0] = bgTemp.r;
				bgColor[1] = bgTemp.g;
				bgColor[2] = bgTemp.b;

				var formData = new FormData();
				
				formData.append("dataName", $("#imageDataName").val());
				formData.append("coordType", $("#imageDataCoord").val());
				formData.append("recDate", $("#imageDataRecDate").val());
				formData.append("convertType", $(":input:radio[name=imageDataConvertType]:checked").val());
				//formData.append("bgColor", bgColor);
				formData.append("bgColor", $("#imageDataBackColor").val());
				
				for(var i = 0; i < GLOBAL.FILE.files.length; i++) {
					formData.append("imgFiles", GLOBAL.FILE.files[i]);
				} 

				if(GLOBAL.FILE.XHR != null) {
					GLOBAL.FILE.XHR.abort();
				}
				
				$("#progrssStr").show();
				
				/*var intervalStr =["페이지를 이동하거나 창을 닫을 경우 데이터가 등록되지 않습니다.","데이터 가공 중입니다."];
				
				var intervalTxt = setInterval(function(){
					
				},1000);*/

				GLOBAL.FILE.XHR =  $.ajax({
					url: "./uploadImageData.do",
					type: "POST",
					data: formData,
					processData: false,
					contentType: false,
					xhr:function() {
						var myXhr = $.ajaxSettings.xhr();
						if(myXhr.upload) {
							myXhr.upload.addEventListener('progress',GLOBAL.FILE.multipleUploadProgress, false);
						}
						return myXhr;
					},
					success: function(result) {
						var result = JSON.parse(result);
						
						console.log(result);

						switch(result.rs) {
							case "complete" :
								
								$("#progrssStr").html("영상 데이터 업로드 완료");
								
								var html = "";
								html += "- BAND : <strong>"+result.BANDS+"</strong><br/>\n";
								html += "- MIN-X : <strong>"+result.minx+"</strong>, - MIN-Y : <strong>"+result.miny+"</strong><br/>\n";
								html += "- MAX-X : <strong>"+result.maxx+"</strong>, - MAX-Y : <strong>"+result.maxy+"</strong><br/>\n";
								html += "- WIDTH : <strong>"+result.width+"</strong>, - HEIGHT : <strong>"+result.height+"</strong><br/>\n";
								
								$("#rawDataInfo").html(html);
								
								$("#dataThumb").html("<img src=\""+result.thumb+"\">");

								if(confirm('영상 업로드가 완료 됐습니다. 클라우드 가공 현황 페이지로 이동 하시겠습니까?')) {
									document.location.href = "/desk/meta_service/status.do";
								}
								/*
								var b = result.resultBand;

								GLOBAL.DATA.IMAGE.MINX = b.minx;
								GLOBAL.DATA.IMAGE.MINY = b.miny;
								GLOBAL.DATA.IMAGE.MAXX = b.maxx;
								GLOBAL.DATA.IMAGE.MAXY = b.maxy;
								GLOBAL.DATA.IMAGE.WIDTH = b.width;
								GLOBAL.DATA.IMAGE.HEIGHT = b.height;
								GLOBAL.DATA.IMAGE.BANDS = b.bands;
								GLOBAL.DATA.IMAGE.BITS = b.bits;
								GLOBAL.DATA.IMAGE.RESOLUTION = b.resolution;

								//console.log(b);
								var html = "";
								html += "- MIN-X : <strong>"+b.minx+"</strong>, - MIN-Y : <strong>"+b.miny+"</strong><br/>\n";
								html += "- MAX-X : <strong>"+b.maxx+"</strong>, - MAX-Y : <strong>"+b.maxy+"</strong><br/>\n";
								html += "- WIDTH : <strong>"+b.width+"</strong>, - HEIGHT : <strong>"+b.height+"</strong><br/>\n";
								html += "- RESOLUTION : <strong>"+b.resolution+"</strong>, - BITS : <strong>"+b.bits+"</strong>, - BANDS : <strong>"+b.bands+"</strong>";

								if(result.resultThumb) {
									$("#dataThumb").html("<img src=\""+result.resultThumb+"\" width=\"200\">");
								}

								$("#rawDataInfo").html(html);

								//var srs = "";
								//srs += "<strong>"+result.resultSRS["gml:baseCRS"]["gml:GeographicCRS"]["gml:srsName"]+" / EPSG:"+result.resultSRS["gml:baseCRS"]["gml:GeographicCRS"]["gml:srsID"]["gml:name"]+"</strong>";
								//$("#srsInfo").html(srs);

								// Check Band
								if(b.bands != 3 && b.bands != 4) {
									alert('영상데이터 파일이 아닙니다.');
									return false;
								}

								var x = (parseFloat(b.minx) + parseFloat(b.maxx)) / 2;
								var y = (parseFloat(b.miny) + parseFloat(b.maxy)) / 2;

								GLOBAL.DATA.IMAGE.MOVE_LON = x;
								GLOBAL.DATA.IMAGE.MOVE_LAT = y;

								GLOBAL.FILE.changeStatus(2);

								GLOBAL.DATA.IMAGE.thumbUrl = result.resultThumb;

								// Convert
								GLOBAL.DATA.IMAGE.convertCloud(result.resultFIDS);
								//console.log(result);
								*/
							break;

							case "NOT_ABLE_TYPE" :
								alert('지원하지 않는 파일 포맷입니다.');
								return false;
							break;

							case "WAIT_MORE_FILE" :
								return;
							break;

							default :

							break;
						}

						GLOBAL.FILE.isUpload = false;
					}
				}); // End of XHR
			}, // End of AddImageData
			reset:function() {
				$("#imageDataName").val("");
				GLOBAL.FILE.resetUploadSet();

				$("#progress-percent").css("width", "0%");
				$("#progress-percent").html("0%");


				GLOBAL.FILE.changeStatus(0);

			}
		}// End of Image
	},
	FILE:{
		fileList:[],
		files:null,
		XHR:null,
		dropWrap:null,
		isUpload:false,
		isAddData:false,
		isConvert:false,
		fileType:[],
		initFileUpload:function() {
			$("#fileDrop").on('dragover', function() {
				
				$("#fileDrop").addClass("fileDropWrapActive");
				
				return false;
			});
			$("#fileDrop").on('dragleave', function() {
				
				$("#fileDrop").removeClass("fileDropWrapActive");
				
				return false;
			});

			$("#fileDrop").on('drop', function(e) {
				e.stopPropagation();
				e.preventDefault();

				var files = e.originalEvent.dataTransfer.files;

				GLOBAL.FILE.checkFiles(files, $(this));

				$("#fileDrop").removeClass("fileDropWrapActive");

				return false;
			});

			$("#fileDrop").slimScroll({
				height:"200px"
			});

			$("#fileData").change(function(e){
				e.stopPropagation();
				e.preventDefault();

				var files = $("#fileData")[0].files;

				GLOBAL.FILE.checkFiles(files, $("#fileDrop"));

				$("#fileDrop").addClass("fileDropWrapActive");

				return false;
			});
		},
		changeStatus:function(s) {
			if(s == 0) {
				// 대기중
				$("#addDataStatus").removeClass("label-warning");
				$("#addDataStatus").removeClass("label-yellow");
				$("#addDataStatus").removeClass("label-green");

				$("#addDataStatus").addClass("label-secondary");
				$("#addDataStatus").html("대기중");
				GLOBAL.FILE.isAddData = false;

			} else if(s == 1) {
				// 업로드
				$("#btnSuccess").prop("disabled", true);
				$("#addDataStatus").removeClass("label-secondary");
				$("#addDataStatus").removeClass("label-yellow");
				$("#addDataStatus").removeClass("label-green");

				$("#addDataStatus").addClass("label-warning");
				$("#addDataStatus").html("데이터 업로드중 <span style='color:red'>※페이지를 이동하거나 창을 닫을 경우 데이터가 등록되지않습니다.</span>");
				GLOBAL.FILE.isAddData = true;
			} else if(s == 2) {
				// 클라우드변환
				setTimeout(function() {
					$("#addDataStatus").removeClass("label-secondary");
					$("#addDataStatus").removeClass("label-warning");
					$("#addDataStatus").removeClass("label-green");

					$("#addDataStatus").addClass("label-yellow");
					$("#addDataStatus").html("클라우드 변환중 <span style='color:red'>※페이지를 이동하거나 창을 닫을 경우 데이터가 등록되지않습니다.</span>");
					$("#progress-percent").css("width", "0%");
					$("#progress-percent").html("0%");
					GLOBAL.FILE.isAddData = true;
				}, 1000);
			} else if(s == 3) {
				// 가공
				$("#addDataStatus").removeClass("label-secondary");
				$("#addDataStatus").removeClass("label-warning");
				$("#addDataStatus").removeClass("label-green");

				$("#addDataStatus").addClass("label-yellow");
				$("#addDataStatus").html("데이터 가공중 <span style='color:red'>※페이지를 이동하거나 창을 닫을 경우 데이터가 등록되지않습니다.</span>");
				GLOBAL.FILE.isAddData = true;
			} else if(s == 4) {
				// 완료
				$("#addDataStatus").removeClass("label-secondary");
				$("#addDataStatus").removeClass("label-warning");
				$("#addDataStatus").removeClass("label-yellow");

				$("#addDataStatus").addClass("label-green");
				$("#addDataStatus").html("완료");
				GLOBAL.FILE.isAddData = false;
			}

		},
		multipleUploadProgress:function(e) {
			var percentComplete = e.loaded / e.total;
			percentComplete = parseInt(percentComplete * 100);

			$("#progress-percent").css("width", ""+percentComplete+"%");
			$("#progress-percent").html(""+percentComplete+"% ("+e.loaded+" / "+e.total+")");

			if(percentComplete == 100) {
				//GLOBAL.FILE.changeStatus(2);
			}
		},
		checkFiles:function(f, resultId) {
			//console.log(f);

			GLOBAL.FILE.dropWrap = resultId;

			var html = "";
			html += "<table class=\"table table-hover table-bordered\" style=\"font-size:8pt;\">\n";
			html += "<thead>\n";
			html += "	<tr>\n";
			html += "		<th>#</th>\n";
			html += "		<th>이름</th>\n";
			html += "		<th>크기</th>\n";
			html += "		<th>타입</th>\n";
			html += "		<th>삭제</th>\n";
			html += "	</tr>\n";
			html += "</thead>\n";
			html += "<tbody>\n";
			$.each(f, function(k, v) {
				console.log(v);
				html += "<tr id=\"uploadList_"+k+"\">\n";
				html += "	<td>"+(k+1)+"</td>\n";
				html += "	<td>"+v.name+"</td>\n";
				html += "	<td>"+GLOBAL.UTIL.formatBytes(v.size)+"</td>\n";
				html += "	<td>"+v.type+"</td>\n";
				html += "	<td><a href=\"JavaScript:GLOBAL.FILE.deleteFromUploadList("+k+");\"><i class=\"fa fa-minus-circle\" style=\"color:#FF5500;\"></i></a></td>\n";
				html += "</tr>\n";
				GLOBAL.FILE.fileType.push(v.type);
				GLOBAL.FILE.fileList.push(v);
			});

			html += "</tbody>\n";
			$(GLOBAL.FILE.dropWrap).html(html);
			$(GLOBAL.FILE.dropWrap).attr("onclick","");
			$("#btnSuccess").prop("disabled", false);

			if($("#imageDataName").length) {
				// 영상
				if($("#imageDataName").val() == "") {
					var v = GLOBAL.FILE.fileList[0].name.split('.');
					$("#imageDataName").val(v[0]);
				}
			} else if($("#terrainDataName").length) {
				// 지형
				if($("#terrainDataName").val() == "") {
					var v = GLOBAL.FILE.fileList[0].name.split('.');
					$("#terrainDataName").val(v[0]);
				}
			} else if($("#lasDataName").length) {
				// 포인트클라우드
				if($("#lasDataName").val() == "") {
					var v = GLOBAL.FILE.fileList[0].name.split('.');
					$("#lasDataName").val(v[0]);
				}
			} else if($("#shapeDataName").length) {
				if($("#shapeDataName").val() == "") {
					var v = GLOBAL.FILE.fileList[0].name.split('.');
					$("#shapeDataName").val(v[0]);
				}
			} else if($("#csvDataName").length) {
				if($("#csvDataName").val() == "") {
					var v = GLOBAL.FILE.fileList[0].name.split('.');
					$("#csvDataName").val(v[0]);
				}
			}

			GLOBAL.FILE.files = f;
		},
		deleteFromUploadList:function(idx) {
			if(!confirm('해당파일을 삭제하시겠습니까?')) {
				return false;
			}

			GLOBAL.FILE.fileList.splice(idx, 1);

			$("#uploadList_"+idx).remove();

			if(GLOBAL.FILE.fileList.length == 0) {
				GLOBAL.FILE.resetUploadSet();
			}
		},
		resetUploadSet:function() {
			
			$(GLOBAL.FILE.dropWrap).removeClass("fileDropWrapActive");
			$(GLOBAL.FILE.dropWrap).html("<div class=\"m-t-10 m-l-10\" style=\"font-size:14pt;\">파일을 이곳에 드래그하거나 클릭해서 파일을 선택해주세요.</div>");
			$(GLOBAL.FILE.dropWrap).attr("onclick","$('#fileData').click()");
			
			GLOBAL.FILE.files = null;
			GLOBAL.FILE.fileList = [];
			GLOBAL.FILE.XHR = null;
			GLOBAL.FILE.dropWrap = null;
			GLOBAL.FILE.isUpload = false;
			GLOBAL.FILE.isConvert = false;

			$("#btnSuccess").prop("disabled", true);

			GLOBAL.FILE.changeStatus(0);

			$("#rawDataInfo").html("");
			$("#dataThumb").html("");
			$("#srsInfo").html("");
		}
	},
	UTIL:{
		formatBytes:function(bytes) {
			if(bytes < 1024) return bytes + " Bytes";
			else if(bytes < 1048576) return(bytes / 1024).toFixed(3) + " KB";
			else if(bytes < 1073741824) return(bytes / 1048576).toFixed(3) + " MB";
			else return(bytes / 1073741824).toFixed(3) + " GB";
		},
		hexToRgb:function(hex) {
			var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
			hex = hex.replace(shorthandRegex, function(m, r, g, b) {
				return r + r + g + g + b + b;
			});

			var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
			return result ? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16)
			} : null;
		}
	}
}

$(function() {
	$("input[name=modelCategory_1]:radio").change(function (e) {
		GLOBAL.DATA.MODEL_3DS.changeModelCategory(e.target.value);
	});
});