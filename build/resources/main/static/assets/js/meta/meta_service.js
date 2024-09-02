/**
 *  META CLOUD DATA Loader
 *  DigitalTwin Local Meta Library
 */
var META_SERVICE = {
	lastId:0,
	dataTable:0,
	init:function() {
		if(this.lastId != 0) {
			this.ASSETS.showMetaAssetDetail(META_SERVICE.lastId);
		}
		
		META_SERVICE.dataTable = $('#mapsDataList').DataTable( {
			"columns": [
    		    { "width": "5%", "orderable": false },
    		    { "width": "15%"},
    		    { "width": "15%"},
    		    { "width": "15%", "orderable": false },
    		    { "width": "15%"},
    		    { "width": "10%"},
    		    { "width": "5%", "orderable": false },
    		    { "width": "5%", "orderable": false }
    		  ],
	        "order": [[ 4, 'desc' ]]
	    } );
	 
		META_SERVICE.dataTable.on( 'order.dt search.dt', function () {
			META_SERVICE.dataTable.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
	            cell.innerHTML = i+1;
	        } );
	    } ).draw();
	},
	OBSERVER:{
		itv:null,
		itvItem:null,
		checkImageListProgres:function() {
			clearTimeout(META_SERVICE.OBSERVER.itv);
			META_SERVICE.OBSERVER.itv = null;
		},
		checkConvertItemProgress:function(metaAssetId) {
			clearTimeout(META_SERVICE.OBSERVER.itvItem);
			META_SERVICE.OBSERVER.itvItem = null;

			var formData = new FormData();
			formData.append("metaAssetId", metaAssetId);

			$.ajax({
				url:"/desk/meta_service/getMetaAssetItemProgress.do",
				type: "POST",
				data: formData,
				processData: false,
				contentType: false,
				enctype: 'multipart/form-data',
				success:function(result) {

					var result = JSON.parse(result);
					console.log(result);

					switch(result.rs) {
						case "complete" :
							if(parseInt(result.rs.percent) != 100) {
								$("#metaAssetStatusLabel_"+metaAssetId).html(META_SERVICE.ASSETS.getMetaAssetState(3));
								$("#dtMetaAssetState").html(META_SERVICE.ASSETS.getMetaAssetState(3));
								$("#dtMetaAssetProgress").css("width", result.percent+"%");

								$("#dtMetaAssetProgressText").html(result.percent+"%");
								$("#dtMetaAssetProgressWithText").html(result.percent+"%");

								clearTimeout(META_SERVICE.OBSERVER.itvItem);
								META_SERVICE.OBSERVER.itvItem = setTimeout(function() {
									META_SERVICE.OBSERVER.checkConvertItemProgress(metaAssetId);
								}, 3000);
							} else {
								$("#metaItemProgressWrap").css("display", "none");
								$("#metaAssetStatusLabel_"+metaAssetId).html(META_SERVICE.ASSETS.getMetaAssetState(20));
								$("#dtMetaAssetState_"+metaAssetId).html(META_SERVICE.ASSETS.getMetaAssetState(20));
								clearTimeout(META_SERVICE.OBSERVER.itvItem);
								META_SERVICE.OBSERVER.itvItem = null;
							}
						break;

						case "NOT_CONVERTING_ITEM" :
							clearTimeout(META_SERVICE.OBSERVER.itvItem);
							META_SERVICE.OBSERVER.itvItem = null;
							
							$("#metaItemProgressWrap").css("display", "none");
							$("#metaAssetStatusLabel_"+metaAssetId).html(META_SERVICE.ASSETS.getMetaAssetState(20));
							$("#dtMetaAssetState").html(META_SERVICE.ASSETS.getMetaAssetState(20));
							clearTimeout(META_SERVICE.OBSERVER.itvItem);
							META_SERVICE.OBSERVER.itvItem = null;
						break;

						case "SPLITING" :
							$("#metaAssetStatusLabel_"+metaAssetId).html(META_SERVICE.ASSETS.getMetaAssetState(34));
							$("#dtMetaAssetState").html(META_SERVICE.ASSETS.getMetaAssetState(34));

							$("#dtMetaAssetProgress").css("width", result.percent+"%");

							$("#dtMetaAssetProgressText").html(result.percent+"%");
							$("#dtMetaAssetProgressWithText").html(result.percent+"%");

							clearTimeout(META_SERVICE.OBSERVER.itvItem);
							META_SERVICE.OBSERVER.itvItem = setTimeout(function() {
								META_SERVICE.OBSERVER.checkConvertItemProgress(metaAssetId);
							}, 3000);
						break;

						case "CAN_NOT_READ_PROGRESS" :
							clearTimeout(META_SERVICE.OBSERVER.itvItem);
							META_SERVICE.OBSERVER.itvItem = null;
						break;

						case "NO_SUCH_PROGRESS" :
							clearTimeout(META_SERVICE.OBSERVER.itvItem);
							META_SERVICE.OBSERVER.itvItem = setTimeout(function() {
								META_SERVICE.OBSERVER.checkConvertItemProgress(metaAssetId);
							}, 3000);
						break;

						case "EXTRACT_DATA_FILE" :
							//console.log("extracting");

							$("#dtMetaAssetState").html(META_SERVICE.ASSETS.getMetaAssetState(94));
							$("#metaAssetStatusLabel_"+metaAssetId).html(META_SERVICE.ASSETS.getMetaAssetState(94));

							clearTimeout(META_SERVICE.OBSERVER.itvItem);
							META_SERVICE.OBSERVER.itvItem = setTimeout(function() {
								META_SERVICE.OBSERVER.checkConvertItemProgress(metaAssetId);
							}, 3000);
						break;
					}
				}
			});
		},
	},
	ASSETS:{
		deleteAsset:function(assetId) {
			if(!confirm('해당 데이터를 삭제하시겠습니까?')) {
				return false;
			}

			var formData = new FormData();
			formData.append("metaAssetId", assetId);

			$.ajax({
				url:"/desk/meta_service/deleteMetaAsset.do",
				type: "POST",
				data: formData,
				processData: false,
				contentType: false,
				enctype: 'multipart/form-data',
				success:function(result) {

					var result = JSON.parse(result);
					console.log(result);
					switch(result.rs) {
						case "complete" :
							$("#metaAssetListItem_"+assetId).remove();
						break;
						default :
							COMMON.alert("삭제할 수 없는 데이터입니다.","error",function(){return false;});
						break;

					}
				}
			});
		},
		showMetaAssetDetail:function(assetId) {
			//console.log(assetId);

			clearTimeout(META_SERVICE.OBSERVER.itvItem);
			META_SERVICE.OBSERVER.itvItem = null;

			var formData = new FormData();
			formData.append("metaAssetId", assetId);

			$.ajax({
				url:"/desk/meta_service/getMetaAssetDetail.do",
				type: "POST",
				data: formData,
				processData: false,
				contentType: false,
				enctype: 'multipart/form-data',
				success:function(result) {

					var result = JSON.parse(result);
					console.log(result);
					switch(result.rs) {
						case "complete" :

							// 
							clearTimeout(META_SERVICE.OBSERVER.itvItem);
							META_SERVICE.OBSERVER.itvItem = null;
							

							//$("#metaAssetDetailContainer").html("");
							$("#dataTitle").html("");
							$("#showToMap").attr("disabled", "false");
							if(result.metaAsset.dataid == null) {
								return;
							}

							// var metaAssetLayer = Module.hybridLayer.addImage(new META.getAssetFromId(1586));
							
							var metaAsset = result.metaAsset;

							/*
							<c:when test="${mapsDataVO.thumbnail_url eq 'default'}">
											<img src="<c:url value="/assets/img/default.png" />" width="100">
										</c:when>
										<c:when test="${mapsDataVO.thumbnail_url eq ''}">
											<img src="<c:url value="/assets/img/default.png" />" width="100">
										</c:when>
							*/

							var thumbUrl = "";
							if(metaAsset.thumbnail_url == "default" || metaAsset.thumbnail_url == "") {
								thumbUrl = "/assets/img/default.png";
							}
							
							$("#dtMetaAssetThumb").attr("src", thumbUrl);
							$("#dtMetaAssetName").html(metaAsset.data_name);
							var data_type = "";
							switch(metaAsset.data_type) {
								case "S" :
									data_type = "SHAPE";
								break;
								case "C" :
									data_type = "CSV";
								break;
								case "I" :
									data_type = "IMAGE";
								break;
								case "T" :
									data_type = "TERRAIN";
								break;
								case "F" :
									data_type = "FACILITY";
								break;
								case "D" :
									data_type = "3DS";
								break;
								case "O" :
									data_type = "OBJ";
								break;
								case "P" :
									data_type = "POINTCLOUD";
								break;
								case "B" :
									data_type = "BIM";
								break;
							}
							$("#dtMetaAssetType").html(data_type);
							$("#dtMetaAssetDesc").html(metaAsset.data_desc);
							//$("#dtMetaAssetSize").html("4.0GB");
							
							$("#dtMetaAssetState").html(META_SERVICE.ASSETS.getMetaAssetState(metaAsset.state));
							$("#dtMetaAssetCode").html("var metaAssetLayer = Module.hybridLayer.addImage(new META.getAssetFromId("+metaAsset.dataid+"));");

							/*
							$("#dataTitle").html(metaAsset.data_name);
							var html = "";
							html = "<table class=\"table table-borderless\">\n";
							html += "<tr>\n";
							html += "	<th>\n";
							html += "		<a href=\"javascript:void(0)\" class=\"img-thumbnail img-thumbnail-zoom-in\">\n";
							html += "			<span class=\"img-thumbnail-overlay bg-dark opacity-25\"></span>\n";
							html += "			<span class=\"img-thumbnail-content text-white text-xlarge\"><i class=\"ion ion-ios-search\"></i></span>\n";
							html += "			<img src=\""+metaAsset.thumbnail_url+"\" class=\"img-fluid\" width=\"100%\">\n";
							html += "		</a>\n";
							html += "	</th>\n";
							html += "</tr>\n";
							html += "<tr>\n";
							html += "	<td>\n";
							html += "		<h6>Name</h6>\n";
							html += "		<p>"+metaAsset.data_name+"</p>\n";
							html += "		<h6>Type</h6>\n";
							html += "		<p>"+metaAsset.data_type+"</p>\n";
							html += "		<h6>Description</h6>\n";
							html += "		<p>"+metaAsset.data_desc+"</p>\n";
							html += "		<h6>Size</h6>\n";
							html += "		<p>4.00GB</p>\n";
							html += "	</td>\n";
							html += "</tr>\n";
							html += "<tr>\n";
							html += "	<td>\n";
							html += "		<h6 class=\"m-b-0\">STATE</h6>\n";
							html += "		<p class=\"m-b-0\">"+META_SERVICE.ASSETS.getMetaAssetState(metaAsset.state)+"</p>\n";
							html += "	</td>\n";
							html += "</tr>\n";
							html += "<tr>\n";
							html += "	<td id=\"metaItemProgressText_"+metaAsset.dataid+"\">1234</td>\n";
							html += "</tr>\n";
							html += "<tr id=\"metaItemProgressWrap\">\n";
							html += "	<td>\n";
							html += "		<div class=\"progress\">\n";
							html += "			<div class=\"progress-bar progress-bar-striped progress-bar-animated bg-warning\" style=\"width:0%;\" id=\"metaItemProgess_"+metaAsset.dataid+"\"></div>\n";
							html += "		</div>\n";
							html += "	</td>\n";
							html += "</tr>\n";
							html += "<tr>\n";
							html += "	<td class=\"bg-lighter\">\n";
							html += "		<h6>Code</h6>\n";
							html += "		<code>var metaAssetLayer = Module.hybridLayer.addImage(new META.getAssetFromId("+metaAsset.dataid+"));</code>\n";
							html += "	</td>\n";
							html += "</tr>\n";
							html += "<tr>\n";
							html += "	<td>\n";
							html += "		<button class=\"btn btn-xs btn-info\"><i class=\"fas fa-globe\"></i> SHOW</button> <button class=\"btn btn-xs btn-danger\"><i class=\"fas fa-trash\"></i> DELETE</button>\n";
							html += "	</td>\n";
							html += "</tr>\n";
							html += "</table>\n";
							$("#metaAssetDetailContainer").html(html);
							*/
							if(metaAsset.state == 3) {
								$("#metaItemProgressWrap").css("display", "table-row");
								META_SERVICE.OBSERVER.checkConvertItemProgress(metaAsset.dataid);
							} else if(metaAsset.state == 10 || metaAsset.state == 11) {
								var html = "";
								html += "<button class=\"btn btn-sm btn-info\"><i class=\"fas fa-globe\"></i> 지도에서 보기</button>\n";
								//$("#dataShowToMapWrap").html(html);
								$("#metaItemProgressWrap").css("display", "none");
								$("#dtMetaAssetProgressText").html("");
							} else {
								$("#metaItemProgressWrap").css("display", "none");
								$("#dtMetaAssetProgressText").html("");
							}

						break;

						default :

						break;
					}
				}
			});
		},
		getMetaAssetState:function(state) {
			var std = "";

			switch(state) {

				case 1:
					std = "<span class=\"badge badge-secondary\">업로드 완료</span>";
				break;

				case 2:
					std = "<span class=\"badge badge-dark\">클라우드 변환 대기중</span>";
				break;

				case 3:
					std = "<span class=\"badge badge-warning\">클라우드 변환중</span>";
				break;

				case 34:
					std = "<span class=\"badge badge-warning\">클라우드(SPLIT) 변환중</span>";
				break;

				case 10:
				case 11:
				case 20:
					std = "<span class=\"badge badge-success\">가공 완료</span>";
				break;

				case 94:
					std = "<span class=\"badge badge-info\">압축해제중</span>";
				break;


			}

			return std;
		}
	},// End of ASSETS
	MONITOR:{
		dataTable:0,
		init:function(){
			META_SERVICE.MONITOR.dataTable = $('#workerList').DataTable( {
				"columns": [
	    		    { "width": "5%", "orderable": false },
	    		    { "width": "10%", "orderable": false },
	    		    { "width": "8%" },
	    		    { "width": "10%" },
	    		    { "width": "15%" },
	    		    { "width": "15%" },
	    		    { "width": "15%" },
	    		    { "width": "8%", "orderable": false },
	    		    { "width": "8%" },
	    		    { "width": "8%", "orderable": false },
	    		    { "width": "5%", "orderable": false },
	    		  ],
		        "order": [[ 8, 'asc' ]]
		    } );
		 
			META_SERVICE.MONITOR.dataTable.on( 'order.dt search.dt', function () {
				META_SERVICE.MONITOR.dataTable.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
		            cell.innerHTML = i+1;
		        } );
		    } ).draw();
		},
		stopWorkerInfo:function(id,type){

			var formData = new FormData();
			formData.append("dataId", id);
			formData.append("type", type);
			
			$.ajax({
				url:"/admin/monitor/getWorkerDetail.do",
				type: "POST",
				data: formData,
				processData: false,
				contentType: false,
				enctype: 'multipart/form-data',
				success:function(result) {
					result = JSON.parse(result);
					if(result.detailData.STATUS == "10" || result.detailData.STATUS == "20"){
						COMMON.alert("완료된 작업은 중단할 수 없습니다.",'error',function(){return false;});
					}else if(result.detailData.STATUS == "9" || result.detailData.STATUS == "91" || result.detailData.STATUS == "99"){
						COMMON.alert("이미 중단된 작업입니다.",'error',function(){return false;});
					}else if(result.detailData.STATUS == "4" || result.detailData.STATUS == "5" || result.detailData.STATUS == "6" || result.detailData.STATUS == "7"){
						COMMON.alert("가공 준비중인 작업은 중단할 수 없습니다.",'error',function(){return false;});
					}else{
						var regDate = result.detailData.REG_DATE;
						var dataName = result.detailData.DATA_NAME;
						var dataType = "CSV";
						if(result.detailData.DATA_TYPE != undefined) dataType = result.detailData.DATA_TYPE;
						regDate = regDate[0]+"년 "+regDate[1]+"월 "+regDate[2]+"일 "+regDate[3]+"시 "+regDate[4]+"분"
						$("#workerStopModalRegDate").text(regDate);
						$("#workerStopModalDataName").text(dataName);
						$("#workerStopModal").modal({backdrop:'static'});
						$("#stopWorker").attr("onclick","META_SERVICE.MONITOR.stopWorker("+id+",'"+type+"','"+dataType+"')");
					}
				}
			});
		},
		stopWorker:function(id,type,dataType){
			if($("#workerStopMessage").val() == ""){
				COMMON.alert("중단 사유를 선택하여주세요.",'error',function(){return false;});
				return false;
			}
			var workerStopMessage = $("#workerStopMessage :selected").text();
			var formData = new FormData();
			formData.append("dataId", id);
			formData.append("errorMessage", workerStopMessage);
			formData.append("type", type);
			formData.append("dataType", dataType);
			
			$.ajax({
				url:"/admin/monitor/setWorkerStop.do",
				type: "POST",
				data: formData,
				processData: false,
				contentType: false,
				enctype: 'multipart/form-data',
				success:function(result) {
					result = JSON.parse(result);
					if(result.rs == "complete"){
						COMMON.alert("중단하였습니다.",'success',function(){
							document.location.reload();
						});
					}
					console.log(result);
				}
			});
		}
	}
}