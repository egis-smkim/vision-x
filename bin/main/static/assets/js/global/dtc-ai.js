var dtcAiSetting = {
	intervalArray:[],
	flag:false,
	moreCheck:false,
	morePageNum:false,
	selectDataId:null,
	selectDataType:null,
	selectAiId:null,
	selectMaiId:null,
	aiType:null,
	aiInterval:null,
	swiperDiv:null,
	promptTagify:null,
	answerTagify:null,
	instance:function(){
		$("#aiPanelAre").show();
		dtcAiSetting.getMyAIList();
		dtcAiSetting.getMemberAiHistoryList();
		if(!dtcAiSetting.flag){
			
			$("#aiCreateDelete").on("click",function(){
				dtcAiSetting.deleteMemberAiHistory();
			});
			$("#aiCreateBtn").on("click",function(){
				//AI 만들기
				dtcAiSetting.resetAICreateInfo();
				
				$(".aiCreateNameWrap").show();
				$(".aiCreateTopWrap").show();
				$("#aiCreateBottomWrap").show();
				
				$("#aiCreateTopContentTyping").show();
				
				var answerInfo = '<span class="px-1 mr-lg-2 ml-2 ml-lg-0 ts-9"><i class="fas fa-bullhorn"></i> Answer</span>';
				$("#aiCreateTopContentTxt").append(answerInfo);
				clearInterval(dtcAiSetting.aiInterval);
				dtcAiSetting.aiSearchTyping("answer",$.i18n.t('Index.nav.ai.alert.hello_message')).then((res) => {
					setTimeout(function(){$("#aiCreateTopContentTyping").hide();},3000);
				})
			});
			$("#aiPanelAre").on("click", ".aiPanelDivSet", function(e){
				var id = e.currentTarget;
				id = id.attributes.aipaneldiv.value;
				dtcAiSetting.selectAiInfo(id);
			});
			$("#aiPanelAre").on("click", ".MemberAiPanelDivSet", function(e){
				var id = e.currentTarget;
				var aiid = id.attributes.aipaneldiv.value;
				var maiid = id.attributes.memberaipaneldiv.value;
				dtcAiSetting.selectAiInfo(aiid, maiid);
			});
			
			dtcAiSetting.initPerfectScrollbar();
			dtcAiSetting.initPromptList();
			dtcAiSetting.initAnswerList();
			dtcAiSetting.initLayerList();
			
			$("#aiCreateTopContentTyping").hide();
			
			dtcAiSetting.flag = true;
			$("#aiCreateBottomChat").on("keydown.enter",function(e){
				if(e.originalEvent.key == "Enter") {
					$("#aiCreateSendText").click();
				}
			})
			$("#aiCreateSendText").on("click",function(){
				dtcAiSetting.sendAiText();
			})
			$("#aiCreateInfoBackList").on("click",function(){
				$("#aiCreateInfoSampleHeader").html("");
				$("#aiCreateInfoSampleBody").html("");
				$("#aiCreateLayerInfoModal").modal('hide');
				$("#aiCreateLayerUploadListModal").modal();
			})
			$("#aiCreateInfoSelect").on("click",function(){
				//CSV 불러오기
				var dataid = dtcAiSetting.selectDataId;
				dtcAiSetting.resetAICreateInfo();
				dtcAiSetting.selectDataId = dataid;
				dtcAiSetting.aiType = 'create';
				
				var answerInfo = '<span class="px-1 mr-lg-2 ml-2 ml-lg-0 ts-9"><i class="fas fa-bullhorn"></i> Answer</span>';
				$("#aiCreateTopContentTxt").append(answerInfo);
				clearInterval(dtcAiSetting.aiInterval);
				dtcAiSetting.aiSearchTyping("answer",$.i18n.t('Index.nav.ai.alert.ask_anything_about_this_data')).then((res) => {
					setTimeout(function(){$("#aiCreateTopContentTyping").hide();},3000);
				})
				
				$("#aiCreateInfoDiv").show();
				$("#aiPanelCreateAre .card-body>div:nth-child(1)").show();
				
				$("#aiCreateInfoSampleHeader").html("");
				$("#aiCreateInfoSampleBody").html("");
				$("#aiCreateLayerInfoModal").modal('hide');
				
				var data={	
					dataId:dtcAiSetting.selectDataId
				}	
				$.ajax({
					url:'/ide/callLayerInfo.do',
					type:'POST',
					data:data,
					dataType:'json',
					success:function(result){
						$("#aiCreateImage").attr("style","background-image: url("+result.INFO.thumbnail_url+")");
						$("#aiCreateName").val(result.INFO.data_name);
						$("#aiCreateInfo").val(result.INFO.data_name + $.i18n.t('Index.nav.ai.alert.is_an_ai_for') + result.INFO.data_desc);
					}
				})
			});
			$("#aiCreateImageFile").on("change",function(e){
				var input = e.target;
				if (input.files && input.files[0]) {
					var reader = new FileReader();
					reader.onload = function(e) {
						$("#aiCreateImage").attr("style","background-image: url("+e.target.result+")");
					};
					reader.readAsDataURL(input.files[0]);
				} else {
					$("#aiCreateImage").attr("style","background-image: ''");
				}
			});
			$("#aiCreateClose").on("click",function(){
				if(dtcAiSetting.selectMaiId == null){
					COMMON.confirm($.i18n.t('Index.nav.ai.alert.exit_ai_creation'),"","info",function(){
						$(".aiCreateNameWrap").hide();
						$(".aiCreateTopWrap").hide();
						$("#aiCreateBottomWrap").hide();
						dtcAiSetting.resetAICreateInfo();
					},function(){
					    return false;
					});
				}
				else{
					$(".aiCreateNameWrap").hide();
					$(".aiCreateTopWrap").hide();
					$("#aiCreateBottomWrap").hide();
					dtcAiSetting.resetAICreateInfo();
				}
			});
			$("#aiCreateInfoBackInfo").on("click",function(){
				if(dtcAiSetting.selectDataId != null){
					COMMON.confirm($.i18n.t('Index.nav.ai.alert.reset_loaded_content'),"","info",function(){
						dtcAiSetting.resetAICreateInfo();
					},function(){
					    return false;
					});
				}
				else{
					$(".aiCreateNameWrap").hide();
					$(".aiCreateTopWrap").hide();
					$("#aiCreateBottomWrap").hide();
				
					$("#aiPanelCreateAre").hide();
					
					$("#aiPanelInfoAre").show();
					
					dtcAiSetting.resetAICreateInfo();
				}
			});
			$("#aiCreateSetting").on("click",function(){
				$("#aiCreateCsvInfoSettingModal").modal();
			});
			$("#aiCreateViewer").on("click",function(){
				var content = document.getElementById("aiPopupDisplayDiv");
				content.scrollTo(0,0);

				var data={
	                dataId:dtcAiSetting.selectDataId
	            }
	
	            $.ajax({
	                url:'/geocoding/getPropertyList.do',
	                type:'POST',
	                data:data,
	                dataType:'json',
	                success:function(result){
	                    if(result.LIST != null){
							//csv
							var headers = [];
		                    var headerHtml= "<tr>";
		                    var htmlList ="";
		                    var headerOption="<option value=\"N/A\">필드 선택</option>";
		                        
	                        for(var i=0;i<result.HEADER.length;i++){
	                            var header = result.HEADER[i];
	                            headers.push(header.column_name);
	                            
	                            if(header.column_name != "geo"){
	                                headerHtml+="<th style=\"white-space: nowrap;\">"+header.column_name+"</th>"
	                                headerOption+="<option value=\""+header.column_name+"\">"+header.column_name+"</option>\n";
	                            }
	                        }
	                        headerHtml+="</tr>"
	                        htmlList = ""
                            for(var i=0;i<result.LIST.length;i++){
                                htmlList+="<tr>\n"
                                for(var j=0;j<headers.length;j++){
                                    var column = headers[j];
                                    if(column != "geo"){
                                        htmlList+="<td style=\"white-space: nowrap;\">\n";

                                        htmlList+=" <span class=\"text-white\">"+result.LIST[i][column]+"</span>\n"
                                        htmlList+="</td>\n"
                                    }
                                }
                                htmlList+="</tr>\n"
                            }
							$("#aiPopupDisplayDiv").html('<div class="card-datatable table-responsive mb-3" style="height: 30vh;">'+
													'<table class="table table-sm table-hover text-center ts-9">'+
								            			'<thead style="position:sticky;top:0;background:#32353b;">'+
								            				headerHtml+
								            			'</thead>'+
								            			'<tbody>'+
								            				htmlList+
								            			'</tbody>'+
		    										'</table>'+
													'<div>');
							new PerfectScrollbar($("#aiPopupDisplayDiv .card-datatable")[0]);
							
		                    var scrollElement = $("#aiPopupDisplayDiv .card-datatable")[0];
							var url = '/geocoding/getCsvPropsMore.do';
							if(result.DATA_TYPE == "S") url = '/geodt/getShpPropsMore.do';
		                    scrollElement.addEventListener('ps-y-reach-end', 
								function(){
									dtcAiSetting.morePageNum += 20;
									var data={
					                	dataId:dtcAiSetting.selectDataId, pageNum : dtcAiSetting.morePageNum
						            }
									$.ajax({
			                            url: url,
			                            type: 'POST',
			                            data: data,
			                            dataType: 'json',
			                            success: function(result) {
			                                var objHeader = result.HEADER;
			                                var objList = result.PROPERTY;
			                                var headerList = new Array();
			                                for (var i = 0; i < objHeader.length; i++) {
			                                    if (objHeader[i].column_name != "geo") {
			                                        headerList.push(objHeader[i].column_name);
			                                    }
			                                }
			                                
		                                    htmlList = ""
				                            for(var i=0;i<objList.length;i++){
				                                htmlList+="<tr>\n"
				                                for(var j=0;j<headers.length;j++){
				                                    var column = headers[j];
				                                    if(column != "geo"){
				                                        htmlList+="<td style=\"white-space: nowrap;\">\n";
				
				                                        htmlList+=" <span class=\"text-white\">"+objList[i][column]+"</span>\n"
				                                        htmlList+="</td>\n"
				                                    }
				                                }
				                                htmlList+="</tr>\n"
				                            }
			    
		                                    $("#aiPopupDisplayDiv tbody").append(htmlList);
			                            },
			                            error: function(request, status, error) {
			                                dtcAiSetting.morePageNum = 0;
			                            }
			                        });
								});

		                    $("#aiPopupName").text(result.LAYER_NAME);
							$("#aiPopupDisplay").show();
							dtcAiSetting.morePageNum = 0;
						}
						else{
							COMMON.alert("원본 정보를<br>확인할 수 없습니다.","error",function(){return false;});
						}
	
	                }
	            });

			});
			$("#aiCreateNext").on("click",function(){
				//AI 생성
				if($("#aiCreateName").val() == "") {
					COMMON.alert($.i18n.t('Index.nav.ai.alert.enter_ai_name'),"error",function(){return false;});
					return;
				}
				if($("#aiCreateInfo").val() == "") {
					COMMON.alert($.i18n.t('Index.nav.ai.alert.enter_ai_description'),"error",function(){return false;});
					return;
				}
				dtcAiSetting.createAiInfo();
			})
		}
	},
	getLocationList:function(text){
		text = dtcAiSetting.textReplaceBlank(text);
		$("#aiCreateContent").empty();
		COMMON.blockUIdiv("aiCreateContent", "LOADING");
		var url = "http://61.109.239.113:5558/ChatDBWithCSV";
		if(dtcAiSetting.selectDataType == "S") url = "http://61.109.239.113:5558/ChatDB";
		var data = {dataId : dtcAiSetting.selectDataId, urlUser : url, question : text, prompt : "", answer : "",}
		
		$.ajax({
			url: "/ai/getAskDataIdDatabase.do",
			type: 'POST',
			data: data,
			dataType: 'json',
			success: function(result) {
				if(result.rs == "complete"){
					console.log(result);
					if(result.answer != "Internal Server Error"){
						var typingJson = JSON.parse(result.answer)['Answer for Ask'];
						dtcAiSetting.aiCreateInfo(typingJson.table_info);
						COMMON.unblockUIdiv("aiCreateContent");
						/*
						var typingJson = JSON.parse(result.answer)['Answer for Ask'];
						typingTxt = typingJson.output;
						dtcAiSetting.aiCreatePosition(typingJson.position);
						dtcAiSetting.aiCreatePoi(typingJson.position);
						COMMON.unblockUIdiv("aiCreateContent");
						console.log(typingTxt);
						*/
					}
					
				}
				
			}
		})
	},
	closeAiPopupView:function(){
        $("#aiPopupDisplay").hide();
        $("#aiPopupName").text("");
        $("#aiPopupDisplayDiv").empty();
	},
	aiCreatePosition:function(resultList){
		$("#aiCreateContent").empty();
		resultList.forEach(function(data){
			var div = document.createElement("div");
			div.className = "aiCreateContentDiv";
			var span = document.createElement("span");
			span.style.border = "1px solid";
			span.style.padding = "2px 5px 1px 5px";
			span.style.borderRadius = "15px;";
			span.style.float = "right";
			span.style.fontSize = "11px";
			span.innerHTML = "상세 보기";
			div.innerHTML = data.name;
			div.append(span);
			span.addEventListener('click', (e) => {
				var content = document.getElementById("aiPopupDisplayDiv");
				content.scrollTo(0,0);
				$("#aiPopupDisplay").show();
		        $("#aiPopupName").text(data.name);
				var infoText = "";
				var obj = Object.keys(data.subInfo);
				for(var j=0;j<obj.length;j++){
					var subKey = obj[j];
				    if(subKey != "dbpid" && subKey != "list" && subKey != "gid" && subKey != "geom" && subKey != "geo" && subKey != "geo_lat" && subKey != "geo_lon" 
						&& subKey != "point" && subKey != "위도" && subKey != "경도"
						 && data.subInfo[subKey] != data.name && data.subInfo[subKey] != data.lon && data.subInfo[subKey] != data.lat){
						var entercheck = data.subInfo[subKey];
						entercheck = entercheck + "";
						if(entercheck.length > 30){
							var lastText = ""
							var temp = entercheck.split(" ");
							var tempText = temp[0];
							temp.forEach(function(tempData){
								tempText += tempData + " ";
								if(tempText.length > 30) {
									tempText += "\n";
									lastText += tempText;
									tempText = "";
								}
							});
							lastText += tempText;
							entercheck = lastText;
						}
						entercheck = entercheck.split("\n");
						if(entercheck.length > 0){
							var text = "";
							for(var i=0;i<entercheck.length;i++){
								if(i == 0) text = subKey + " : " + entercheck[i];
								else text = entercheck[i];
								infoText += text + "<br>";
							}
						}else{
							var text = subKey + " : " + data.subInfo[subKey];
							infoText += text + "<br>";
						}

				    }
				}

		        $("#aiPopupDisplayDiv").html(infoText);
			});
			div.addEventListener('click', (e) => {
				dtcAiSetting.setLocationInfo(data.longitude, data.latitude);
			});
			$("#aiCreateContent").append(div);
		});
	},
	aiCreatePoi:function(resultList){
		
		var layerList = new Module.JSLayerList(true);
		var layer = layerList.nameAtLayer("AI_MULTIPOI_LAYER");
		layer.removeAll();
		var detailLayer = layerList.nameAtLayer("AI_MULTIPOI_DETAIL_LAYER");
		detailLayer.removeAll();

		resultList.forEach(function(locInfo){
			if(locInfo.longitude != NaN && locInfo.latitude != NaN){
				var icon = document.createElement("span");
				icon.innerText = locInfo.name;
				icon.style.fontSize = "16px";
				icon.style.fontWeight = "bold";
				icon.style.fontFamily = "sans-serif";
				document.body.appendChild(icon);
				var textWidth = $(icon).outerWidth();
				var textHeight = $(icon).outerHeight();
				document.body.removeChild(icon);
				
				var iconName = "AI_MULTIPOI_LAYER_"+locInfo.dbpid;
				var drawCanvas = document.createElement('canvas');
				drawCanvas.width = 50+textWidth+25;
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
				color = "rgb(18, 71, 191)",
				value = locInfo.name,
				size = 16;
				var grd = ctx.createLinearGradient(0, height, 0, 0);
				grd.addColorStop(0, "rgba(6,14,131,0.8)");
				grd.addColorStop(1, "rgb(60, 102, 107)");
				// 말풍선 형태의 Draw Path 설정
				ctx.lineWidth = 2;
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

				ctx.strokeStyle = grd;
				ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
				ctx.fill();
				ctx.stroke();

				ctx.beginPath();
				ctx.arc((height-5)/2, (height-5)/2, ((height-5)/2)-5, 0, Math.PI * 2);

				ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
				ctx.fill();

				ctx.beginPath();
				ctx.moveTo(14.8,22.5);
				ctx.bezierCurveTo(14.8,10.4,30.5,10.4,30.5,22.5);
				ctx.lineTo(22.5,32);
				ctx.lineTo(14.5,22.5);
				//ctx.arc((height-5)/2, ((height-5)/2)-2, 8, 0, Math.PI * 2);

				ctx.fillStyle = grd;
				ctx.fill();

				ctx.beginPath();
				ctx.arc((height-5)/2, ((height-5)/2)-2, 3, 0, Math.PI * 2);

				ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
				ctx.fill();

				var strText = (isNaN(value)) ? value : this.setTextComma(value.toFixed(2));

				// 텍스트 스타일 설정
				ctx.font = "bold "+size+"px sans-serif";
				ctx.fillStyle = "rgb(255, 255, 255)";

				// 텍스트 그리기
				ctx.fillText(strText, 50, height*0.56);
				var imageData = ctx.getImageData(0, 0, drawCanvas.width, drawCanvas.height).data;
				var alt = new Module.getMap().getTerrHeightFast(parseFloat(locInfo.longitude),parseFloat(locInfo.latitude));

				var element = document.createElement("div");
				element.append(drawCanvas);
				var parameter = {
					position: new Module.JSVector3D(parseFloat(locInfo.longitude),parseFloat(locInfo.latitude), alt),	// 위치 지점
					container: "divcontainer",	// div를 담을 Container 명칭 지정(명칭에 해당되는 div가 없다면 createHTMLObject 작업중 생성)
					canvas: Module.canvas,	// 화면 사이즈 설정을 위한 canvas 설정
					element: element,	// 엔진 오브젝트와 연동할 HTML Element
					verticalAlign: "middle",	// 수직 정렬 (top, middle, bottom, px 지원 )	|| 태그 미 설정 시 [Default top]
					horizontalAlign: "center",	// 수평 정렬 (left, center, right, px 지원 )	|| 태그 미 설정 시 [Default left]
				};
				
				var object = Module.createHTMLObject(iconName);
				var complet = object.createbyJson(parameter);
				if (complet.result == 1) layer.addObject(object, 0);
				element.addEventListener('mouseover', (e) => {
					layer.keyAtObject(iconName).setVisible(false);
					detailLayer.keyAtObject(iconName+"_DETAIL").setVisible(true);
				});
		
				var heightCnt = 1;
				var infoArray = [];
				var maxWidth = locInfo.name.length;
				var obj = Object.keys(locInfo.subInfo);
				for(var j=0;j<obj.length;j++){
					var subKey = obj[j];
				    if(subKey != "dbpid" && subKey != "list" && subKey != "gid" && subKey != "geom" && subKey != "geo" && subKey != "geo_lat" && subKey != "geo_lon" 
						&& subKey != "point" && subKey != "위도" && subKey != "경도" && subKey != "x" && subKey != "y"
						 && locInfo.subInfo[subKey] != locInfo.name && locInfo.subInfo[subKey] != locInfo.lon && locInfo.subInfo[subKey] != locInfo.lat){
						var entercheck = locInfo.subInfo[subKey];
						entercheck = entercheck + "";
						if(entercheck.length > 30){
							var lastText = ""
							var temp = entercheck.split(" ");
							if(temp.length == 1){
								for(var i=0;i<entercheck.length;i++){
									var tempText = entercheck.substr(i,30) + "\n";
									lastText += tempText;
									if((i+30)<entercheck.length){
										i+=30;
									}else{
										break;
									}
								}
								entercheck = lastText;
							}else{
								var tempText = temp[0];
								temp.forEach(function(tempData){
									tempText += tempData + " ";
									if(tempText.length > 30) {
										tempText += "\n";
										lastText += tempText;
										tempText = "";
									}
								});
								lastText += tempText;
								entercheck = lastText;
							}
						}
						entercheck = entercheck.split("\n");
						if(entercheck.length > 0){
							var text = "";
							for(var i=0;i<entercheck.length;i++){
								heightCnt++;
								if(i == 0) text = subKey + " : " + entercheck[i];
								else text = entercheck[i];
								infoArray.push(text);
								if(heightCnt > 10){
									infoArray.push("...");
									break;
								}
								if(text.length > maxWidth) {
									var icon = document.createElement("span");
									icon.innerText = text;
									icon.style.fontSize = "16px";
									icon.style.fontWeight = "bold";
									icon.style.fontFamily = "sans-serif";
									document.body.appendChild(icon);
									textWidth = $(icon).outerWidth();
									document.body.removeChild(icon);
									maxWidth = text.length;
								}
							}
						}else{
							heightCnt++;
							var text = subKey + " : " + locInfo.subInfo[subKey];
							infoArray.push(text);
							if(heightCnt > 10){
								infoArray.push("...");
								break;
							}
							if(text.length > maxWidth) {
								var icon = document.createElement("span");
								icon.innerText = text;
								icon.style.fontSize = "16px";
								icon.style.fontWeight = "bold";
								icon.style.fontFamily = "sans-serif";
								document.body.appendChild(icon);
								textWidth = $(icon).outerWidth();
								document.body.removeChild(icon);
								maxWidth = text.length;
							}
						}
						if(heightCnt > 10){
							break;
						}

				    }
				}
				
				var detialCanvas = document.createElement('canvas');
				detialCanvas.width = 50+textWidth+25;
				detialCanvas.height = 28 * heightCnt;

				var ctx = detialCanvas.getContext('2d'),
				width = detialCanvas.width,
				height = detialCanvas.height;
				ctx.clearRect(0, 0, width, height);

				var wCenter = width * 0.5,
				hCenter = height * 0.5;
				var marginBottom = 0,
				barWidth = 7,
				barHeight = 0,
				color = "rgb(18, 71, 191)",
				value = locInfo.name,
				size = 16;
				// 말풍선 형태의 Draw Path 설정
				ctx.lineWidth = 2;
				ctx.beginPath();
				ctx.moveTo(0,drawCanvas.height/2);
				ctx.quadraticCurveTo(0,0,drawCanvas.height/2,0);
				ctx.lineTo(detialCanvas.width-(drawCanvas.height/2),0);
				ctx.quadraticCurveTo(detialCanvas.width,0,detialCanvas.width,drawCanvas.height/2);
				ctx.lineTo(detialCanvas.width,height-5-(drawCanvas.height/2));
				ctx.quadraticCurveTo(detialCanvas.width,height-5,detialCanvas.width-(drawCanvas.height/2),height-5);

				ctx.lineTo((detialCanvas.width/2)+5,height-5);
				ctx.lineTo((detialCanvas.width/2),height);
				ctx.lineTo((detialCanvas.width/2)-5,height-5);
				ctx.lineTo(drawCanvas.height/2,height-5);
				ctx.quadraticCurveTo(0,height-5,0,height-5-(drawCanvas.height/2));

				ctx.strokeStyle = grd;
				ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
				ctx.fill();
				ctx.stroke();

				ctx.beginPath();
				ctx.arc((drawCanvas.height-5)/2, (drawCanvas.height-5)/2, ((drawCanvas.height-5)/2)-5, 0, Math.PI * 2);

				ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
				ctx.fill();

				ctx.beginPath();
				ctx.moveTo(14.8,22.5);
				ctx.bezierCurveTo(14.8,10.4,30.5,10.4,30.5,22.5);
				ctx.lineTo(22.5,32);
				ctx.lineTo(14.5,22.5);
				//ctx.arc((height-5)/2, ((height-5)/2)-2, 8, 0, Math.PI * 2);

				ctx.fillStyle = grd;
				ctx.fill();

				ctx.beginPath();
				ctx.arc((drawCanvas.height-5)/2, (drawCanvas.height-5)/2-2, 3, 0, Math.PI * 2);

				ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
				ctx.fill();

				var strText = (isNaN(value)) ? value : this.setTextComma(value.toFixed(2));

				// 텍스트 스타일 설정
				ctx.font = "bold "+size+"px sans-serif";
				ctx.fillStyle = "rgb(255, 255, 255)";

				// 텍스트 그리기
				ctx.fillText(strText, 50, drawCanvas.height*0.56);
				var textH = (height/heightCnt)*0.56;
				textH += 20;
				infoArray.forEach(function(info){
				    textH += 25;
				    ctx.fillText(info, 50, textH);
				});
				var imageData = ctx.getImageData(0, 0, detialCanvas.width, detialCanvas.height).data;
				var element = document.createElement("div");
				element.append(detialCanvas);
				var parameter = {
					position: new Module.JSVector3D(parseFloat(locInfo.longitude),parseFloat(locInfo.latitude), alt),	// 위치 지점
					container: "divcontainer",	// div를 담을 Container 명칭 지정(명칭에 해당되는 div가 없다면 createHTMLObject 작업중 생성)
					canvas: Module.canvas,	// 화면 사이즈 설정을 위한 canvas 설정
					element: element,	// 엔진 오브젝트와 연동할 HTML Element
					verticalAlign: "middle",	// 수직 정렬 (top, middle, bottom, px 지원 )	|| 태그 미 설정 시 [Default top]
					horizontalAlign: "center",	// 수평 정렬 (left, center, right, px 지원 )	|| 태그 미 설정 시 [Default left]
				};
				
				var object = Module.createHTMLObject(iconName+"_DETAIL");
				object.setVisible(false);
				var complet = object.createbyJson(parameter);
				if (complet.result == 1) detailLayer.addObject(object, 0);
				element.addEventListener('mouseout', (e) => {
					layer.keyAtObject(iconName).setVisible(true);
					detailLayer.keyAtObject(iconName+"_DETAIL").setVisible(false);
				});
				
			}
		});
		if(resultList.length > 0) {
			Module.getViewCamera().look(new Module.JSVector3D(parseFloat(resultList[0]['longitude']),parseFloat(resultList[0]['latitude']),30000),
										new Module.JSVector3D(parseFloat(resultList[0]['longitude']), parseFloat(resultList[0]['latitude']), 10));
		}
	},
	setLocationInfo:function(lon, lot){
		Module.getViewCamera().look(new Module.JSVector3D(parseFloat(lon),parseFloat(lot),30000),
									new Module.JSVector3D(parseFloat(lon), parseFloat(lot), 10));
	},
	getMemberAiHistoryList:function(){
		$.ajax({
			url: "/ai/selectMemberAiHistoryList.do",
			type: "POST",
			data: data,
			dataType: "json",
			success: function(result) {
				if (result.rs == "complete") {
					if(result.list.length == 0){
						var html = '<div class="t-c">'+
										'<p class="mt-5 mb-5" data-i18n="Index.nav.ai.alert.no_additional_ai">추가한 AI가 없습니다.</p>'+
									'</div>';
						$("#memberAiPanelLists").html(html);
					}else{
						var html = "";
						result.list.forEach(function(data){
							console.log(data);
							data.ai_ask = dtcAiSetting.textReplaceAll(data.ai_ask);
							data.ai_ask = JSON.parse(data.ai_ask)[0];
							if(data.ai_ask.length > 20) {
								data.ai_ask = data.ai_ask.slice(0,20) + "...";
							}
							data.mod_date = data.mod_date;
							html += '<table style="width: 100%;">'+
									'<colgroup>'+
										'<col width="30%">'+
										'<col width="60%">'+
									'</colgroup>'+
									'<tbody>'+
										'<tr>'+
											'<td rowspan="3">'+
												'<div class="aiPanelAiSmallDiv MemberAiPanelDivSet" aipaneldiv="'+data.aiid+'" memberaipaneldiv="'+data.maiid+'" style="position: relative;background-image: url('+data.ai_thumb_url+');">';
													html += '</div>'+
														'</td>'+
														'<td class="MemberAiPanelDivSet" style="height: 10px;font-weight: bold;cursor: pointer;" aipaneldiv="'+data.aiid+'" memberaipaneldiv="'+data.maiid+'">'+data.ai_name+'</td>'+
													'</tr>'+
													'<tr style="text-align: end;font-size: 11px;color: #838383;height: 10px;">'+
														'<td>'+data.mod_date+'</td>'+
													'</tr>'+
													'<tr style="vertical-align: baseline;">'+
														'<td>'+data.ai_ask+'</td>'+
													'</tr>'+
												'</tbody>'+
											'</table>';
						});
						$("#memberAiPanelLists").html(html);
					}
				}
			}
		});
	},
	getMemberAiHistoryInfo:function(maiid){
		var data = { "maiid": maiid}
		$.ajax({
			url: "/ai/selectMemberAiHistoryInfo.do",
			type: "POST",
			data: data,
			dataType: "json",
			success: function(result) {
				if (result.rs == "complete") {
					result.info.ai_ask = dtcAiSetting.textReplaceAll(result.info.ai_ask);
					result.info.ai_ask = JSON.parse(result.info.ai_ask);
					result.info.ai_answer = dtcAiSetting.textReplaceAll(result.info.ai_answer);
					result.info.ai_answer = JSON.parse(result.info.ai_answer);
					result.info.ai_dbinfo = dtcAiSetting.textReplaceAll(result.info.ai_dbinfo);
					result.info.ai_dbinfo = JSON.parse(result.info.ai_dbinfo);
					
					result.info.ai_ask.forEach(function(data,i){
						if($("#aiCreateTopContentTxt").text() != "") $("#aiCreateTopContentTxt").append("<br><br>");
						var memberInfo = document.getElementById('mid').parentElement.getElementsByTagName('span')[0].outerHTML + data;
						$("#aiCreateTopContentTxt").append(memberInfo);
						
						var answerInfo = '<br><br><span class="px-1 mr-lg-2 ml-2 ml-lg-0 ts-9"><i class="fas fa-bullhorn"></i> Answer</span>'+result.info.ai_answer[i];
						$("#aiCreateTopContentTxt").append(answerInfo);
						var icon = document.createElement("i");
						icon.className = "far fa-clone";
						icon.style.cursor = "pointer";
						icon.addEventListener('click', (e) => {
							var textarea = document.createElement("textarea");
							document.body.appendChild(textarea);
							textarea.value = result.info.ai_answer[i];
							textarea.select();
							document.execCommand("copy");
							document.body.removeChild(textarea);
							
							COMMON.alert($.i18n.t('Index.nav.ai.alert.copy_ai_answer'),"success",function(){});
						});
						$("#aiCreateTopContentTxt").append(icon);
						
						if(result.info.ai_dbinfo != null && result.info.ai_dbinfo[i] != null){
							var icon = document.createElement("i");
							icon.className = "fas fa-location-arrow";
							icon.style.cursor = "pointer";
							icon.addEventListener('click', (e) => {
								dtcAiSetting.aiCreateInfo(result.info.ai_dbinfo[i]);
							});
							$("#aiCreateTopContentTxt").append(" ");
							$("#aiCreateTopContentTxt").append(icon);
						}
					})
					var content = document.getElementById("aiCreateTopContent")
					content.scrollTo(0,0);
				}
			}
		});
	},
	deleteMemberAiHistory:function(){
		COMMON.confirm($.i18n.t('Index.nav.ai.alert.delete_ai_history'),"","info",function(){
		
			var data = { "maiid": dtcAiSetting.selectMaiId}
			$.ajax({
				url: "/ai/deleteMemberAiHistory.do",
				type: "POST",
				data: data,
				dataType: "json",
				success: function(result) {
					if (result.rs == "complete") {
						$(".aiCreateNameWrap").hide();
						$(".aiCreateTopWrap").hide();
						$("#aiCreateBottomWrap").hide();
						dtcAiSetting.resetAICreateInfo();
						dtcAiSetting.getMemberAiHistoryList();
					}
				}
			});
		},function(){
		    return false;
		});
	},
	checkMemberAiHistory:function(ai_data){
		if(dtcAiSetting.selectMaiId != null){
			dtcAiSetting.updateMemberAiHistory(ai_data);
		}else{
			dtcAiSetting.saveMemberAiHistory(ai_data);
		}
	},
	updateMemberAiHistory:function(ai_data){
		var data = { "maiid": dtcAiSetting.selectMaiId}
		$.ajax({
			url: "/ai/selectMemberAiHistoryInfo.do",
			type: "POST",
			data: data,
			dataType: "json",
			success: function(result) {
				if (result.rs == "complete") {
					console.log(result);
					result.info.ai_ask = dtcAiSetting.textReplaceAll(result.info.ai_ask);
					result.info.ai_ask = JSON.parse(result.info.ai_ask);
					result.info.ai_ask.push(ai_data.ai_ask);
					
					result.info.ai_answer = dtcAiSetting.textReplaceAll(result.info.ai_answer);
					result.info.ai_answer = JSON.parse(result.info.ai_answer);
					result.info.ai_answer.push(ai_data.ai_answer);
					
					result.info.ai_dbinfo = dtcAiSetting.textReplaceAll(result.info.ai_dbinfo);
					result.info.ai_dbinfo = JSON.parse(result.info.ai_dbinfo);
					result.info.ai_dbinfo.push(ai_data.ai_dbinfo);
					var data = { "maiid": dtcAiSetting.selectMaiId,
								"ai_ask": JSON.stringify(result.info.ai_ask),
								"ai_answer": JSON.stringify(result.info.ai_answer),
								"ai_dbinfo": JSON.stringify(result.info.ai_dbinfo)}
					$.ajax({
						url: "/ai/updateMemberAiHistory.do",
						type: "POST",
						data: data,
						dataType: "json",
						success: function(result) {
							if (result.rs == "complete") {
								dtcAiSetting.selectMaiId = result.maiId;
							}
						}
					});
				}
			}
		});
	},
	saveMemberAiHistory:function(ai_data){
		var data = { "aiid": dtcAiSetting.selectAiId,
					 "ai_ask": JSON.stringify([ai_data.ai_ask]),
					 "ai_answer": JSON.stringify([ai_data.ai_answer]),
					 "ai_dbinfo": JSON.stringify([ai_data.ai_dbinfo])}
		$.ajax({
			url: "/ai/insertMemberAiHistory.do",
			type: "POST",
			data: data,
			dataType: "json",
			success: function(result) {
				if (result.rs == "complete") {
					dtcAiSetting.selectMaiId = result.maiId;
					dtcAiSetting.getMemberAiHistoryList();
				}
			}
		});
	},
	sendAiText:function(){
		var question = $("#aiCreateBottomChat").val();
		var dataId = dtcAiSetting.selectDataId;
		var aiCreatePrompt = $("#aiCreatePrompt").val();
		var aiCreateAnswer = $("#aiCreateAnswer").val();
		if (question == "") {
			COMMON.alert($.i18n.t('Index.nav.ai.alert.enter_search_content'), "error", function() { $("#aiCreateBottomChat").focus();});
			return false;
		}
		clearInterval(dtcAiSetting.aiInterval);
		if($("#aiCreateTopContentTxt").text() != "") $("#aiCreateTopContentTxt").append("<br><br>");
		var memberInfo = document.getElementById('mid').parentElement.getElementsByTagName('span')[0].outerHTML;
		$("#aiCreateTopContentTxt").append(memberInfo);
		COMMON.blockUIdiv("MapContainer", "LOADING");
		COMMON.blockUIdiv("aiCreateBottomWrap", "");
		$("#aiCreateTopContentTyping").show();
		var content = document.getElementById("aiCreateTopContent");
		content.scrollTo(0,content.scrollHeight);
		dtcAiSetting.aiSearchTyping("ask",question).then((res) => {
			var answerInfo = '<br><br><span class="px-1 mr-lg-2 ml-2 ml-lg-0 ts-9"><i class="fas fa-bullhorn"></i> Answer</span>';
			$("#aiCreateTopContentTxt").append(answerInfo);
			var content = document.getElementById("aiCreateTopContent");
			content.scrollTo(0,content.scrollHeight);

			if(dataId == null){
				//GPT
				dtcAiSetting.sendGptAiText(question);
			}else{
				//data
				if(aiCreatePrompt != ""){
					aiCreatePrompt = JSON.parse(aiCreatePrompt);
					var temp = "";
					aiCreatePrompt.forEach(function(data){
						temp += data.value + ",";
					});
					aiCreatePrompt = temp.slice(0,-1);
				}
				if(aiCreateAnswer != ""){
					aiCreateAnswer = JSON.parse(aiCreateAnswer);
					var temp = "";
					aiCreateAnswer.forEach(function(data){
						temp += data.value + ",";
					});
					aiCreateAnswer = temp.slice(0,-1);
				}
				if(question.trim() != ""){
					
					var url = "/ai/getAskDataIdDatabase.do";
					var aiCreateSelectAI = $("#aiCreateSelectAI").val();
					if(aiCreateSelectAI.indexOf("ChatDB") == -1){
						url = "/ai/getAskFileDatabase.do";
					}
					
					var data = {dataId : dataId,urlUser : "http://61.109.239.113:"+aiCreateSelectAI, question : question, prompt : aiCreatePrompt, answer : aiCreateAnswer,}
					dtcAiSetting.sendOtherAiText(url, data);
				}
			}
			
		})
	    .catch((error) => {
	    });
	},
	sendOtherAiText:function(url, data){
		//AI정보 가져오기
		$.ajax({
			url: url,
			type: 'POST',
			data: data,
			dataType: 'json',
			success: function(result) {
				COMMON.unblockUIdiv("MapContainer");
				COMMON.unblockUIdiv("aiCreateBottomWrap");
				if(result.rs == "complete"){
					if(result.answer == "Internal Server Error"){
						//예외처리
						dtcAiSetting.aiSearchTyping("answer",$.i18n.t('Index.nav.ai.alert.unable_to_respond_now')).then((res) => {
							setTimeout(function(){$("#aiCreateTopContentTyping").hide();},3000);
						})
						return false;
					}
					var typingTxt = JSON.parse(result.answer);
					if(data.urlUser.indexOf("jsonParser") > -1){
						var typingJson = JSON.parse(result.answer)['Answer for Ask'];
						typingTxt = typingJson.output;
						dtcAiSetting.aiCreatePosition(typingJson.position);
						dtcAiSetting.aiCreatePoi(typingJson.position);
					}else if(data.urlUser.indexOf("ChatDBWithCSV") > -1 || data.urlUser.indexOf("ChatDB") > -1){
						var typingJson = JSON.parse(result.answer)['Answer for Ask'];
						typingTxt = typingJson.output;
						if(typingJson.table_info.length > 0){
							typingJson.table_info.forEach(function(data){
								for(var i=0;i<data.name.length;i++){
									typingTxt += "\n - " + data.name[i];
								}
							});
						}
						dtcAiSetting.aiCreateInfo(typingJson.table_info);
					}else{
						typingTxt = typingTxt['Answer for Ask']['output'];
						dtcAiSetting.getLocationList(typingTxt);
					}
					clearInterval(dtcAiSetting.aiInterval);
					dtcAiSetting.aiSearchTyping("answer",typingTxt).then((res) => {
						if(dtcAiSetting.aiType == 'create'){
							var aiCreateTestAnswerInfo = "";
							if(data.prompt != ""){
								aiCreateTestAnswerInfo += $.i18n.t('Index.nav.ai.applied_prompt') + data.prompt + "<br>";
							}
							if(data.answer != ""){
								aiCreateTestAnswerInfo += $.i18n.t('Index.nav.ai.applied_response_example') + data.answer;
							}
							if(aiCreateTestAnswerInfo == ""){
								aiCreateTestAnswerInfo = $.i18n.t('Index.nav.ai.alert.no_applied_prompt_response');
							}
							aiCreateTestAnswerInfo = aiCreateTestAnswerInfo.replaceAll("'","&#39;").replaceAll('"','&#34;');
							$("#aiCreateTopContentTxt").append("<i class='aiCreateTestAnswerInfo far fa-question-circle' data-html='true' data-toggle='tooltip' title='"+aiCreateTestAnswerInfo+"'></i>");
							$('#aiCreateTopContentTxt [data-toggle="tooltip"]').tooltip();
						}
						else {
							var history = {ai_ask:data.question,ai_answer:typingTxt,ai_dbinfo:typingJson.table_info};
							dtcAiSetting.checkMemberAiHistory(history);
						}
						
						var icon = document.createElement("i");
						icon.className = "far fa-clone";
						icon.style.cursor = "pointer";
						icon.addEventListener('click', (e) => {
							var textarea = document.createElement("textarea");
							document.body.appendChild(textarea);
							textarea.value = typingTxt;
							textarea.select();
							document.execCommand("copy");
							document.body.removeChild(textarea);
							
							COMMON.alert($.i18n.t('Index.nav.ai.alert.copy_ai_answer'),"success",function(){});
						});
						$("#aiCreateTopContentTxt").append(icon);
						
						var icon = document.createElement("i");
						icon.className = "fas fa-location-arrow";
						icon.style.cursor = "pointer";
						icon.addEventListener('click', (e) => {
							dtcAiSetting.getLocationList(typingTxt);
						});
						$("#aiCreateTopContentTxt").append(" ");
						$("#aiCreateTopContentTxt").append(icon);
						
						setTimeout(function(){$("#aiCreateTopContentTyping").hide();},3000);
					})
					
					
				}
				
			}
		})
	},
	aiCreateInfo:function(table_info){
		var num = 0;
		var positionList = [];
		var coordList = [];
		table_info.forEach(function(data){
			num++;
			var schemaName = data.schemaName;
			var tableName = data.tableName;
			var dbpid = data.dbpid;
			for(var i=0;i<data.name.length;i++){
				var positionInfo = {};
				positionInfo.dbpid = data.dbpid[i];
				positionInfo.name = data.name[i];
				positionList.push(positionInfo);
			}
			var param = { "schema": schemaName, "table": tableName, "dbpid": dbpid }
			$.ajax({
			    url: "/ai/getPropertyList.do",
			    type: "POST",
			    data: param,
			    dataType: "json",
			    success: function(result) {
			        if(result.rs == "complete"){
			            result.LIST.forEach(function(data_info){
			                //console.log(data_info);
			                var coord = JSON.parse(data_info.point);
			                var positionInfo = positionList.find(o => o.dbpid === data_info.dbpid)
			                positionInfo.longitude = coord['coordinates'][0];
			                positionInfo.latitude = coord['coordinates'][1];
			                positionInfo.subInfo = data_info;
							if(data_info.list != undefined) coordList.push(JSON.parse(data_info.list).coordinates[0][0]);
			            });
			            if(num == table_info.length){
			                dtcAiSetting.aiCreatePosition(positionList);
			                dtcAiSetting.aiCreatePoi(positionList);
			                if(coordList.length > 0) dtcAiSetting.addPolyLine(coordList);
			            }
			        }
			    }
			})
		})
		
		
	},
	sendGptAiText:function(question){
		var data = { "question": question, "url": "http://61.109.239.113:5555/ask_gpt", "gpt_version": "4" }
		$.ajax({
			url: "/ai/getAsk.do",
			type: "POST",
			data: data,
			dataType: "json",
			success: function(result) {
				COMMON.unblockUIdiv("MapContainer");
				COMMON.unblockUIdiv("aiCreateBottomWrap");
				clearInterval(dtcAiSetting.aiInterval);
				if (result.rs == "complete") {
					var typingTxt = result.answer;
					if(typingTxt == "Internal Server Error"){
						//예외처리
						dtcAiSetting.aiSearchTyping("answer",$.i18n.t('Index.nav.ai.alert.unable_to_respond_now')).then((res) => {
							setTimeout(function(){$("#aiCreateTopContentTyping").hide();},3000);
						})
					}
					typingTxt = JSON.parse(typingTxt);
					typingTxt = typingTxt["Answer for Ask"];
					var history = {ai_ask:question,ai_answer:typingTxt,ai_dbinfo:""};
					checkMemberAiHistory(history);
					dtcAiSetting.aiSearchTyping("answer",typingTxt).then((res) => {
						setTimeout(function(){$("#aiCreateTopContentTyping").hide();},3000);
					})
				}
			}
		});
	},
	selectAiInfo:function(aiid, maiid = null){
		var data={
			aiid:aiid
		}
		$.ajax({
			url:'/ai/selectAiInfo.do',
			type:'POST',
			data:data,
			dataType:'json',
			success:function(result){
				if(result.rs == "complete"){
					var content = document.getElementById("aiCreateTopContent")
					content.scrollTo(0,0);
					clearInterval(dtcAiSetting.aiInterval);
					dtcAiSetting.resetAICreateInfo();
					dtcAiSetting.selectDataId = result.aiInfo.dataId;
					dtcAiSetting.selectAiId = aiid;
					dtcAiSetting.selectDataType = result.aiInfo.data_type;
					if(dtcAiSetting.selectDataType == "S"){
						$("#aiCreateSelectAI").val("5558/ChatDB");
					}
		
					$(".aiCreateNameWrap").show();
					$(".aiCreateTopWrap").show();
					$("#aiCreateBottomWrap").show();
					
					$("#aiCreateInfoDiv").show();
					$("#aiCreateDetailInfo").hide();
					$("#aiCreateImage button").hide();
					
					$("#aiCreateName").attr("disabled", true);
					$("#aiCreateInfo").attr("disabled", true);
					
					$("#aiCreateInfoDiv table tr:last-child").hide();
					
					$("#aiCreateImage").attr("style","background-image: url("+result.aiInfo.ai_thumb_url+")");
					$("#aiCreateName").val(result.aiInfo.ai_name);
					$("#aiCreateInfo").val(result.aiInfo.ai_info);
					
					$("#aiCreatePrompt").val(result.aiInfo.ai_prompt);
					$("#aiCreateAnswer").val(result.aiInfo.ai_answer);
					
					if(maiid == null){
						var answerInfo = '<span class="px-1 mr-lg-2 ml-2 ml-lg-0 ts-9"><i class="fas fa-bullhorn"></i> Answer</span>';
						$("#aiCreateTopContentTxt").append(answerInfo);
						clearInterval(dtcAiSetting.aiInterval);
						dtcAiSetting.aiSearchTyping("answer",$.i18n.t('Index.nav.ai.alert.ask_anything_about_this_data')).then((res) => {
							setTimeout(function(){$("#aiCreateTopContentTyping").hide();},3000);
						})
					}else{
						dtcAiSetting.selectMaiId = maiid;
						var answerInfo = '<span class="px-1 mr-lg-2 ml-2 ml-lg-0 ts-9"><i class="fas fa-bullhorn"></i> Answer</span>'+$.i18n.t('Index.nav.ai.alert.ask_anything_about_this_data');
						$("#aiCreateTopContentTxt").append(answerInfo);
						
						dtcAiSetting.getMemberAiHistoryInfo(dtcAiSetting.selectMaiId);
					}
				}
			}
		});
	},
	createAiInfo:function(){
		var formData = new FormData();
		formData.append("dataId", dtcAiSetting.selectDataId);
		formData.append("aiCreatePrompt", ($("#aiCreatePrompt").val() == ""?null:$("#aiCreatePrompt").val()));
		formData.append("aiCreateAnswer", ($("#aiCreateAnswer").val() == ""?null:$("#aiCreateAnswer").val()));
		formData.append("aiCreateShare", $("[name=aiCreateShare]:checked").val());
		formData.append("aiCreateName", $("#aiCreateName").val());
		formData.append("aiCreateInfo", $("#aiCreateInfo").val());
		
		if($("#aiCreateImageFile")[0].files.length > 0){
			formData.append("aiCreateImage", $("#aiCreateImageFile")[0].files[0]);
		}
		$.ajax({
			url: "/ai/insertAiInfoData.do",
			type: 'POST',
			data: formData,
			processData: false,
			contentType: false,
			enctype: 'multipart/form-data',
			dataType: 'json',
			success: function(result) {
				COMMON.alert($.i18n.t('Index.nav.ai.alert.ai_created'),"success",function(){
					$("#aiPanelCreateAre").hide();
					$("#aiPanelInfoAre").show();
					
					dtcAiSetting.resetAICreateInfo();
					dtcAiSetting.getMyAIList();
				});
	
			}
		})
	},
	getMyAIList:function(){
		$.ajax({
			url: "/ai/getMyAIList.do",
			type: 'POST',
			dataType: 'json',
			success: function(result) {
				console.log(result);
				if(result.rs == "complete"){
					$(".aiPanelDiv.swiper-slide:not(#aiCreateBtn)").remove();
					if(dtcAiSetting.swiperDiv != null){
						dtcAiSetting.swiperDiv.destroy();
					}
					var shareList = result.shareList;
					var html = "";
					shareList.forEach(function(data){
						var info = data.ai_info;
						data.ai_info = data.ai_info.slice(0,10)+"...";
					    html = '<div class="aiPanelAiDiv" style="background-image: url('+data.ai_thumb_url+');">'+
									'<p>'+data.ai_name+'</p>'+
									'<span fullText="'+info+'">'+data.ai_info+'</span>'+
								'</div>';
						var newElement = document.createElement('div');
						newElement.innerHTML = html;
						newElement.className = "aiPanelDiv swiper-slide aiPanelDivSet";
						newElement.id = "aiPanelDiv_"+data.aiid;
						newElement.style.overflow = 'auto';
						newElement.setAttribute("aipaneldiv", data.aiid);
						newElement.addEventListener('mouseenter', (e) => {
							$(e.target).children().children("span").text(info);
							$(e.target).children().css("box-shadow","rgba(0, 0, 0, 0.57) 0px -2500px 20px 5px inset");
						});
						newElement.addEventListener('mouseleave', (e) => {
							$(e.target).children().children("span").text(data.ai_info)
							$(e.target).children().css("box-shadow","rgba(0, 0, 0, 0.57) 0px -60px 20px 5px inset");
							var content = document.getElementById(newElement.id)
							content.scrollTo(0,0);
						});
						$("#aiPanelList .swiper-wrapper").append(newElement);
						
						new PerfectScrollbar(document.getElementById(newElement.id));
					})
					var myList = result.myList;
					var html = "";
					myList.forEach(function(data){
					    html += '<table style="width: 100%;">'+
									'<colgroup>'+
										'<col width="30%">'+
										'<col width="60%">'+
									'</colgroup>'+
									'<tbody>'+
										'<tr>'+
											'<td rowspan="2">'+
												'<div class="aiPanelAiSmallDiv aiPanelDivSet" aipaneldiv="'+data.aiid+'" style="position: relative;background-image: url('+data.ai_thumb_url+');">';
						if(data.ai_type == "true"){
											html += '<div class="aiPanelDivBadge badge badge-success font-weight-bold">'+$.i18n.t('Index.nav.ai.public')+'</div>';
						}else{
											html += '<div class="aiPanelDivBadge badge badge-dark font-weight-bold">'+$.i18n.t('Index.nav.ai.private')+'</div>';
						}
										html += '</div>'+
											'</td>'+
											'<td class="aiPanelDivSet" style="height: 40px;font-weight: bold;cursor: pointer;" aipaneldiv="'+data.aiid+'">'+data.ai_name+'</td>'+
										'</tr>'+
										'<tr>'+
											'<td style="vertical-align: baseline;">'+data.ai_info+'</td>'+
										'</tr>'+
									'</tbody>'+
								'</table>';
					})
					if(html != ""){
						$("#memberAiCreateLists").html(html);
						dtcAiSetting.swiperDiv = new Swiper('#aiPanelList', {
							slidesPerView: 3,
						    spaceBetween: 5,
							mousewheelControl: true,
							freeMode: true,
						    mousewheel: true,
					        navigation: {
					        	nextEl: ".swiper-button-next",
					            prevEl: ".swiper-button-prev",
					    	},
						});
					}
				}

			}
		})
	},
	resetAICreateInfo:function(){
		$("#aiPanelCreateAre .card-body>div").hide();
		
		$("#aiCreateInfoDiv").hide();
		
		$("#aiCreateTopContentTxt").html("");
		$("#aiCreateBottomChat").val("");
		
		$("#aiCreateImage").attr("style","background-image: ''");
		$("#aiCreateName").val("");
		$("#aiCreateInfo").val("");
		$("#aiCreatePrompt").val("");
		$("#aiCreateAnswer").val("");
		$("#aiCreateSelectAI").val("5558/ChatDBWithCSV");
		$("[name=aiCreateShare][value=true]").prop("checked","true");
		
		$("#aiCreateDetailInfo").show();
		$("#aiCreateImage button").show();
		
		$("#aiCreateName").attr("disabled", false);
		$("#aiCreateInfo").attr("disabled", false);
		
		$("#aiCreateInfoDiv table tr:last-child").show();
		
		dtcAiSetting.selectDataId = null;
		dtcAiSetting.selectAiId = null;
		dtcAiSetting.selectDataType = null;
		dtcAiSetting.selectMaiId = null;
		dtcAiSetting.aiType = null;
		
		var layerList = new Module.JSLayerList(true);
		var layer = layerList.nameAtLayer("AI_MULTIPOI_LAYER");
		layer.removeAll();
		var detailLayer = layerList.nameAtLayer("AI_MULTIPOI_DETAIL_LAYER");
		detailLayer.removeAll();
		var colorLayer = layerList.nameAtLayer("AI_POLYGON_COLOR_LAYER");
		if(colorLayer != null) colorLayer.removeAll();
		var lineLayer = layerList.nameAtLayer("AI_POLYGON_LINE_LAYER");
		if(lineLayer != null) lineLayer.removeAll();
		$("#aiCreateContent").empty()
	},
	initLayerList:function(){
		var layerList = new Module.JSLayerList(true);
		var layer = layerList.createLayer("AI_MULTIPOI_LAYER", Module.ELT_3DASH);
		layer.setMaxDistance(3000000);
		var layer = layerList.createLayer("AI_MULTIPOI_DETAIL_LAYER", Module.ELT_3DASH);
		layer.setMaxDistance(3000000);
	},
	initPerfectScrollbar:function(){
		new PerfectScrollbar(document.getElementById('aiCreateLayerUploadListDiv'));
		new PerfectScrollbar(document.getElementById('aiCreateInfo'));
		new PerfectScrollbar(document.getElementById('memberAiCreateLists'));
		new PerfectScrollbar(document.getElementById('memberAiPanelLists'));
		new PerfectScrollbar(document.getElementById('aiCreateTopContent'));
		new PerfectScrollbar(document.getElementById('aiCreateContent'));
		new PerfectScrollbar(document.getElementById('aiPopupDisplayDiv'));
	},
	initPromptList:function(){
		var promptList = [$.i18n.t('Index.nav.ai.set_example.respond_korean'), $.i18n.t('Index.nav.ai.set_example.speak_guide')];
		var input = document.querySelector('#aiCreatePrompt');
		dtcAiSetting.promptTagify = new Tagify(input, {
	        whitelist           : promptList,
			delimiters: null,
			keepInvalidTags: true,
			dropdown: {        
			    classname: "tags-look", 					// 드롭다운 메뉴 엘리먼트 클래스 이름. 이걸로 css 선택자로 쓰면 된다.
			    enabled: 0,             					// 단어 몇글자 입력했을떄 추천 드롭다운 메뉴가 나타날지
			    closeOnSelect: false    					// 드롭다운 메뉴에서 태그 선택하면 자동으로 꺼지는지 안꺼지는지
  			},
	        templates: {
	            dropdownItemNoMatch: function(data) {
	                return `<div class='${this.settings.classNames.dropdownItem}' value="noMatch" tabindex="0" role="option">
	                    No suggestion found for: <strong>${data.value}</strong>
	                </div>`
	            }
	        }
		})
		
		dtcAiSetting.promptTagify.on('change', function(e){
			console.log(e)
		})
	},
	initAnswerList:function(){
		var promptList = [$.i18n.t('Index.nav.ai.set_example.create_report'), $.i18n.t('Index.nav.ai.set_example.state_location')];
		var input = document.querySelector('#aiCreateAnswer');
		dtcAiSetting.answerTagify = new Tagify(input, {
	        whitelist           : promptList,
			delimiters: null,
			keepInvalidTags: true,
			dropdown: {        
			    classname: "tags-look", 					// 드롭다운 메뉴 엘리먼트 클래스 이름. 이걸로 css 선택자로 쓰면 된다.
			    enabled: 0,             					// 단어 몇글자 입력했을떄 추천 드롭다운 메뉴가 나타날지
			    closeOnSelect: false    					// 드롭다운 메뉴에서 태그 선택하면 자동으로 꺼지는지 안꺼지는지
  			},
	        templates: {
	            dropdownItemNoMatch: function(data) {
	                return `<div class='${this.settings.classNames.dropdownItem}' value="noMatch" tabindex="0" role="option">
	                    No suggestion found for: <strong>${data.value}</strong>
	                </div>`
	            }
	        }
		})
		
		dtcAiSetting.answerTagify.on('change', function(e){
			console.log(e)
		})
	},
	createAutoImage:function(){
		COMMON.blockUIdiv("aiCreateImage","");
		setTimeout(function(){
			COMMON.unblockUIdiv("aiCreateImage");
		},3000);
	},
	uploadImageClick:function(){
		$("#aiCreateImageFile").click();
	},
	aiSearchTyping: function(type, typingTxt) {
		return new Promise((resolve, reject) => {
			var typingBool = false;
			var typingIdx = 0;
			var lineIdx = 0;

			typingTxt = typingTxt.split("");

			if (typingBool == false) {
				typingBool = true;
				dtcAiSetting.aiInterval = setInterval(typing, 90);
			}

			function typing() {
				var content = document.getElementById("aiCreateTopContent");
				content.scrollTo(0,content.scrollHeight);
				if (typingIdx < typingTxt.length) {
					if (typingTxt[typingIdx] == "\n") {
						lineIdx++;
						var inText = typingTxt[typingIdx] + "<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
						$("#aiCreateTopContentTxt").append(inText);
					} else {
						$("#aiCreateTopContentTxt").append(typingTxt[typingIdx]);
					}
					typingIdx++;
				} else {
					clearInterval(dtcAiSetting.aiInterval);
					resolve('Resolved');
				}
			}
		});
	},
	exportLayerData:function(dataId){
		$("button[value=aiAre]").click();
		$("#aiCreateBtn").click();
		dtcAiSetting.selectDataId = dataId;
		$("#aiCreateInfoSelect").click();
	},
	csvSampleOpen: function() {
		var flag = true;
		COMMON.blockUIdiv("MapContainer", "LOADING");
		COMMON.blockUIdiv("aiCreateBottomWrap", "");
		if($("#aiCreateBottomChat").val() == ""){
			$("#aiCreateBottomChat").val("해발고도가 가장 높은 여행지 알려줘");
		}
		const fetchSSE = (url) => {
			fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json; charset=utf-8',
					
				},
				body: JSON.stringify({
					csv_file:'D:\\울산시청\\울산AI\\ChatCSV\\ChatCSV\\울산관광정보 지형추가UTF.csv',
					encoding:'utf-8',
					question:$("#aiCreateBottomChat").val(),
					prompt:"한글로 답변해줘"
				})
			})
			.then(response => {
				const stream = response.body;
				const reader = stream.getReader();
				const readChunk = () => {
					reader.read()
						.then(({
							value,
							done
						}) => {
							if (done) {
								// Log a message
								console.log('Stream finished');
								return;
							}
							
							var chunkString = new TextDecoder().decode(value || new Uint8Array());
							
							chunkString = decodeURIComponent(chunkString);
							chunkString = chunkString.replaceAll('}{','},{');
							chunkString = "[" + chunkString + "]";
							chunkString = JSON.parse(chunkString);
							if(chunkString.length > 0){
								var answer = chunkString[chunkString.length-1];
								if(answer.answer != undefined){
									if(flag){
										
										var positionList = [];
										for(var i=0;i<answer.position.length;i++){
											var positionInfo = {};
											positionInfo.dbpid = 0;
											positionInfo.name = answer.position[i].name;
							                positionInfo.longitude = answer.position[i].longitude;
							                positionInfo.latitude = answer.position[i].latitude;
							                positionInfo.subInfo = {"주소":answer.position[i].address};
											positionList.push(positionInfo);
										}
										
										dtcAiSetting.aiCreatePosition(positionList);
										dtcAiSetting.aiCreatePoi(positionList);
										COMMON.unblockUIdiv("MapContainer");
										COMMON.unblockUIdiv("aiCreateBottomWrap");
										flag = false;
									}
									var answerInfo = '<span class="px-1 mr-lg-2 ml-2 ml-lg-0 ts-9"><i class="fas fa-bullhorn"></i> Answer</span>';
									$("#aiCreateTopContent").html(answerInfo + answer.answer);
								}
							}
							

							readChunk();
						})
				};
				// Start reading the first chunk
				readChunk();
			})
			.catch(error => {
				// Log the error
				console.error(error);
			});
		};
		fetchSSE("http://192.168.1.99:5555/csvStream")
	},
	csvUploadOpen: function() {
		dtcFile.load("./assets/js/global/dtc-fileupload.html");
	},
	csvUploadListOpen: function() {
		$("#aiCreateLayerUploadListModal").modal();
		dtcAiSetting.getCsvUploadList();
	},
	getCsvUploadList: function() {
		var type = ['C','S'];

		var data = {
		    MID:D_MEMBER.MID,
		    TYPE:type,
		    TEXT: "",
		    STEP: 0,
		    COUNT: -1
		}

		$.ajax({
		    url:'/ide/getMemberLayerLists.do',
			type: 'POST',
			data: data,
			dataType: 'json',
			success: function(result) {
				var list = result.LIST;
				var html = "";
				for(var i=0;i<list.length;i++){
					var obj = list[i];
					var dataType = "";
					if(obj.DATA_TYPE == "S") {
						dataType = "<span class='font-weight-bold text-success'><i class='far fa-square'></i> SHAPE</div></span>";
						schema = obj.SHP_DATA_STORE_NAME;
						table = obj.SHP_TABLE_NAME;
						layer = obj.SHP_LAYER_FULLNAME;
					}
					if(obj.DATA_TYPE == "C") {
						dataType = "<span class='font-weight-bold text-info'><i class='fas fa-file-csv'></i> CSV</div></span>";
						schema = obj.CSV_DB_NAME;
						table = obj.CSV_LAYER_NAME;
						layer = obj.META_OUT_URL;
					}

					if(obj.COORD_EPSG != null && obj.COORD_EPSG.indexOf("EPSG:")>-1){
						coord = obj.COORD_EPSG.split("EPSG:")[1];
						html += '<tr>';
						html += 	'<td width="15%"><img src="'+obj.THUMBNAIL_URL+'" class="d-block ui-w-120 mt-1" style="width: 50px;"></td>';
						html += 	'<td width="25%" style="word-break: break-all">'+obj.DATA_NAME+'</td>';
						html += 	'<td width="15%">'+obj.COORD_EPSG+'</td>';
						html += 	'<td width="15%">'+dataType+'</td>';
						html += 	'<td width="15%">'+obj.REG_DATE+'</td>';
						if(obj.DATA_TYPE == "C") {
						html += 	'<td width="15%"><button class="btn btn-outline-success btn-sm ladda-button" data-style="slide-left" data-size="s" onclick="dtcAiSetting.loadCsvInfo('+obj.DATAID+')"><span class="lnr lnr-file-add"></span> Add</button></td>';
						}
						else{
						html += 	'<td width="15%"><button class="btn btn-outline-success btn-sm ladda-button" data-style="slide-left" data-size="s" onclick="dtcAiSetting.loadShpInfo('+obj.DATAID+')"><span class="lnr lnr-file-add"></span> Add</button></td>';
						}
						html += '</tr>';
					}
				}
				$("#aiCreateLayerUploadList").html(html);
			}
		})
	},
	loadShpInfo:function(dataid) {
		$("#aiCreateLayerUploadListModal").modal('hide');
		dtcAiSetting.selectDataId = dataid;
		$("#aiCreateInfoSelect").click();
	},
	loadCsvInfo:function(dataid) {
		$("#aiCreateLayerUploadListModal").modal('hide');
		$("#aiCreateLayerInfoModal").modal();
		var data = {
			DATAID: dataid,
		}
		dtcAiSetting.selectDataId = dataid;
		$.ajax({
			url: "/appCsv/loadCsvInfo.do",
			type: "POST",
			data: data,
			dataType: "json",
			success: function(result) {
				if (result.dataInfo != null) {
					$("#aiCreateInfoSampleHeader").html("");
					$("#aiCreateInfoSampleBody").html("");
					dtcAiSetting.csvSampleList(result);
					$("#aiCreateInfoName").text(result.dataInfo.data_name);
				}
			}
		});
	},
	csvSampleList: function(result) {
		$("#aiCreateInfoTotalCsvRecods").text(result.SAMPLE.SIZE);

		var columnList = result.SAMPLE.HEADER;

		var htmlHeader = "<tr>";

		for (var i = 0; i < columnList.length; i++) {
			htmlHeader += "<th nowrap>" + columnList[i] + "</th>\n";

		}
		htmlHeader += "</tr>";

		//records 설정
		var records = result.SAMPLE.LIST;
		var htmlRecord = "";

		for (var i = 0; i < records.length; i++) {
			var record = records[i];
			htmlRecord += "<tr>\n";

			for (var j = 0; j < record.length; j++) {
				htmlRecord += "<td nowrap>" + record[j] + "</td>\n"
			}
			htmlRecord += "</tr>\n";
		}

		$("#aiCreateInfoSampleHeader").append(htmlHeader);
		$("#aiCreateInfoSampleBody").append(htmlRecord);

		new PerfectScrollbar(document.getElementById('aiCreateInfoSampleLists'), {
			suppressScrollY: true
		});

	},
	addPolyLine_ex:function(coord){
		dtcAiSetting.intervalArray.forEach(function(data){
			clearInterval(data);
		});
		
		var layerList = new Module.JSLayerList(true);
	    var layer = layerList.nameAtLayer("WIND_PATH_LAYER");
	    if (layer == null) {
	        layer = layerList.createLayer("WIND_PATH_LAYER", Module.ELT_POLYHEDRON);
	        layer.setMaxDistance(100000.0);
	    } else {
	        layer.removeAll();
	    }

		dtcAiSetting.intervalArray = [];
		for(var k=0;k<coord.length;k++){
		//for(var k=0;k<2;k++){
			(function(x){
				var altArray = [];
				var array = coord[k];
				var area = 0;
			    for (var i = 0; i < array.length; i++) {
			        var j = (i + 1) % array.length;
			        area += (array[i][1] + array[j][1]) * (array[j][0] - array[i][0]);
			    }
			    var data = Math.abs(area / 2);
				data *= 10000000;
				
				for(var j=0;j<array.length-1;j++){
					var alt = new Module.getMap().getTerrHeightFast(array[j][0],array[j][1]);
					array[j][2] = (alt*2) + (j%2)*data;
				}
				array[array.length-1] = array[0];
				var curve_pos = {
				    coordinate: array,
				    style: "XYZ",
				}
				var curve = Module.getMath().convertBezierCurve(curve_pos);
				var curvecount = curve.count();
				for (var i = 0; i < curvecount; i++) {
				    var pos = curve.get(i);
				    altArray.push(pos.Altitude);
				}
				var colorArray = chroma.scale(["#ff0000","#ff8f00","#ffee00","#60ff00","#00e5ff","#0035ff","#9300ff","#ff00dd","#ff0000"]).mode('lch').colors(curvecount);
				/*
				var line = Module.createLineString("WIND_PATH");
				var curved_vertices = [];
				for (var j = 0; j < curvecount; j++) {
				    var pos = curve.get(j);
				    curved_vertices.push([pos.Longitude, pos.Latitude, pos.Altitude]);
				}
				line.createbyJson({
				    coordinates: {
				        coordinate: curved_vertices,
				        style: "XYZ",
				    },
				    color: new Module.JSColor(255, 196, 0),
				    width: 5.0,
				    type: 1,
				    speed: 0.01,
				    skip: 4
				});
				layer.addObject(line, 0);
				*/
				dtcAiSetting.intervalArray.push(setInterval(function(){
					addObject(curve, colorArray, altArray,x);
				},10));
				
				function addObject(curve, colorArray, altArray, cnt){
				    var curved_vertices = [];
				    var colors = [];
				    var layerList = new Module.JSLayerList(true);
				    var layer = layerList.nameAtLayer("WIND_PATH_LAYER");
				    if (layer != null) {
				        layer.removeAtKey("WIND_PATH_"+cnt);
				    }
				    var curvecount = curve.count();
				    colorArray.push(colorArray.shift());
					altArray.unshift(altArray[altArray.length-1]);
	    			altArray.pop();
				    //console.log(colorArray)
				    for (var i = 0; i < curvecount; i++) {
				        var color = new Module.JSColor(colorArray[i]);
				        var pos = curve.get(i);
				        curved_vertices.push(new Module.JSVector3D(pos.Longitude, pos.Latitude, 0));
				        colors.push(color);
				        curved_vertices.push(new Module.JSVector3D(pos.Longitude, pos.Latitude, altArray[i] * 2));
				        colors.push(new Module.JSColor(0, color.r, color.g, color.b));
				    }
				    var indices = [];
				    // Create indices
				    for (var i = 0; i <= curved_vertices.length - 4; i += 2) {
				        indices.push(...[i, i + 1, i + 3, i, i + 3, i + 2]);
				    }
				    var polygon = Module.createColorPolygon("WIND_PATH_"+cnt);
				    polygon.set({
				        vertex: curved_vertices,
				        color: colors,
				        index: indices
				    });
				    polygon.SetCullMode(1);
				    layer.addObject(polygon, 0);
				}
			})(k);
		}
	},
	addPolyLine:function(coord){
		var layerList = new Module.JSLayerList(true);
		
		var colorLayerName = "AI_POLYGON_COLOR_LAYER";
		var lineLayerName = "AI_POLYGON_LINE_LAYER";
		var colorLayer = layerList.nameAtLayer(colorLayerName);
		if(colorLayer == null) colorLayer = layerList.createLayer(colorLayerName, Module.ELT_POLYHEDRON);
		colorLayer.removeAll();
		colorLayer.setMaxDistance(210000);
		
		var lineLayer = layerList.nameAtLayer(lineLayerName);
		if(lineLayer == null) lineLayer = layerList.createLayer(lineLayerName, Module.ELT_3DLINE);
		lineLayer.removeAll();
		lineLayer.setMaxDistance(210000);
		
		
		for(var j=0;j<coord.length;j++){
			var coordinates = new Module.JSVec3Array();
			for(var i=0;i<coord[j].length;i++){
				coordinates.push(new Module.JSVector3D(coord[j][i][0], coord[j][i][1], 0));
			}
			coordinates.push(new Module.JSVector3D(coord[j][0][0], coord[j][0][1], 0));
			var alt = new Module.getMap().getTerrHeightFast(coord[j][0][0],coord[j][0][1]);
			
			var parts = new Module.Collection();
			parts.add(coordinates.count());
			
			var highlight = Module.createColorPolygon("AI_POLYGON_LINE_FACE");
			highlight.SetVerticalPlane(coordinates, parts, alt+100, new Module.JSColor("#00FBFF00"), new Module.JSColor("#FFFBFF00"));
			highlight.SetCullMode(1);
			
			var line = Module.createLineString("AI_POLYGON_LINE");
			// 폴리곤 색상 설정
			var lineStyle = new Module.JSPolyLineStyle();
			lineStyle.setColor(new Module.JSColor(255, 255, 0));
			lineStyle.setWidth(5.0);
			line.setStyle(lineStyle);
			
			line.setPartCoordinates(coordinates, parts);
							
			lineLayer.addObject(line, 0);
			colorLayer.addObject(highlight, 0);
		}
	},
	textReplaceAll:function(text){
		if(text == null){
			return text;
		}
		return text
		.replaceAll("&lsquo;","‘")
	    .replaceAll("&rsquo;","’")
	    .replaceAll("&amp;amp;lsquo;","‘")
	    .replaceAll("&amp;amp;rsquo;","’")
	    .replaceAll("&amp;amp;amp;amp;lsquo;","‘")
	    .replaceAll("&amp;amp;amp;amp;rsquo;","’")
	    .replaceAll("&amp;amp;amp;amp;amp;amp;lsquo;","‘")
	    .replaceAll("&amp;amp;amp;amp;amp;amp;rsquo;","’")
	    .replaceAll("&amp;lt;br&amp;gt;","<br>")
	    .replaceAll("&amp;apos;","'")
	    .replaceAll("&apos;","'")
	    .replaceAll("&amp;amp;amp;apos;","'")
	    .replaceAll("&amp;amp;nbsp;","&nbsp;")
	    .replaceAll("&amp;quot;",'"')
	    .replaceAll("\\n",'<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
	},
	textReplaceBlank:function(text){
		if(text == null){
			return text;
		}
		return text
		.replaceAll("&nbsp;",' ');
	},
}