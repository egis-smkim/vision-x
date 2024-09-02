/**
 * 
 */

var MODEL = {
		
	init:function() {
	},
	
	insertModelData:function() {
		//console.log($("#uploadFileBin"));
		//return;
				
		var binFiles = document.getElementById("uploadFiles");
		
		var formData = new FormData();
		formData.append("modelType", $(":input:radio[name=modelType]:checked").val());
		formData.append("binaryType", $(":input:radio[name=binaryType]:checked").val());

		for(var i = 0; i < binFiles.files.length; i++) {
			formData.append("modelFiles", binFiles.files[i]);
		}
		
		$.ajax({
			url:"./insertModelData.do",
			type: "POST",
			data: formData,
			processData: false,
			contentType: false,
			enctype: 'multipart/form-data',
			success:function(result){

				var result=JSON.parse(result);
				console.log(result);
				if(result.rs == "complete") {
					
					alert('등록됐습니다.');
					
					// 썸네일 업데이트 sumin 201203
					MODEL.updateThumbnail(result);
					
					setTimeout(function() {
						document.location.href = "./modelList.do";
					}, 1000);
				}
			}
		});
	},
	updateThumbnail:function(_updateModelInfo, _callback) {
		
		// 썸네일 생성 라이브러리 로드 체크 후 로드되어 있지 않으면 로드 후 함수 재실행 sumin 201203
		if (typeof XDViewer == 'undefined') {
			$.getScript("/moduleData/21/1.0/ext/XDViewer.js")
			.done(function(){
				MODEL.updateThumbnail(_updateModelInfo);
			});
			return;
		}
		
		var mlid = _updateModelInfo.MLID.toString();
		
		XDViewer.loadModel({
			
			key : "thumbnail",
			url : "/moduleHelper/editBuilding/getTemplateLibraryModel.do?MLID="+mlid,
			texture : "/moduleHelper/editBuilding/getTemplateLibraryTexture.do?MLID="+mlid,
			format : "3ds",
			callback : function(_key) {

				XDViewer.renewFrame();
				
				var formData = new FormData();
				formData.append("MID", D_MEMBER.MID);
				formData.append("MLID", mlid);
				formData.append("THUMB", XDViewer.canvas.toDataURL());

				$.ajax({

					url : "/moduleHelper/editBuilding/updateModelThumbnail.do",
					type : "POST",
					data : formData,
					processData : false,
					contentType : false,
					dataType : "json",
					enctype : 'multipart/form-data',
					success : null
				});
				
				XDViewer.clearModels();
			}
		});
		
	//	var b = "data:image/png;base64,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";
		
		//var formData = new FormData();
		//formData.append("MLID", "1");
		//formData.append("MID", "0");
		//formData.append("THUMB", b);
		
		//$.ajax({
		//	url:"/moduleHelper/editBuilding/updateModelThumbnail.do",
		//	type: "POST",
		//	data: formData,
		//	processData: false,
		//	contentType: false,
		//	enctype: 'multipart/form-data',
		//	success:function(result){

		//		var result=JSON.parse(result);
		//		console.log(result);
		//		if(result.rs == "complete") {
		//			alert('등록됐습니다.');
		//			document.location.href = "./modelList.do";
		//		}
		//	}
		//});
	}
}