/**
 * 
 */

var MAPS = {
	init:function() {
		
	},
	selectMap:function(mapid) {
		var newForm = document.createElement("form");
		var newInput = document.createElement("input");
		
		newForm.setAttribute("method", "GET");
		newForm.setAttribute("action", "/ide.do");
		newInput.setAttribute("type", "hidden");
		newInput.setAttribute("name", "mapid");
		newInput.setAttribute("value", mapid);
		newForm.appendChild(newInput);
		document.body.appendChild(newForm);
		newForm.submit();
	},
	sharetMap:function(mapid) {
		var url = '';
		var textarea = document.createElement("textarea");
		document.body.appendChild(textarea);
		url = document.location.origin + "/layer/loadMapInfo.do?mapid="+ encodeURIComponent(mapid);
		textarea.value = url;
		textarea.select();
		document.execCommand("copy");
		document.body.removeChild(textarea);
		
		COMMON.alert("URL을 복사하였습니다.\n<h5 style='display: contents'>붙여넣기를 통해 URL을 공유할 수 있습니다.<h5>","success",function(){});
	},
	createNewMap:function() {
		var formData = new FormData();
		
		$.ajax({
			url:"./createNewMap.do",
			type: "POST",
			data: formData,
			processData: false,
			contentType: false,
			enctype: 'multipart/form-data',
			success:function(result) {

				var result=JSON.parse(result);
				//console.log(result);
				if(result.rs == "complete") {
					alert('새로운 지도가 생성됐습니다.');
					document.location.href = "/";
					//MAPS.showMap(result.mapsVO.mapid);
				}
			}
		});
	},
	deleteMap:function(mapid) {
		COMMON.confirm("<span style='color: #595959;'>해당 지도를 삭제하시겠습니까?<span>","",
				"info",
				function(){
					var formData = new FormData();
					formData.append("mapid", mapid);
					
					$.ajax({
						url:"/desk/maps/deleteMap.do",
						type: "POST",
						data: formData,
						processData: false,
						contentType: false,
						enctype: 'multipart/form-data',
						success:function(result) {
		
							var result=JSON.parse(result);
							console.log(result);
							if(result.rs == "complete") {
								LOG_TRACKER.write("52",'1',"지도 삭제:{MAPID:"+mapid+"}");
								COMMON.alert("삭제되었습니다","success",function(){location.reload();});
							}
						}
					});
				},
				function(){return false;});
	},
	loadMyMap:function() {
		var formData = new FormData();
		formData.append("control", "loadUserMaps");
		
		$.ajax({
			url:"./getMapList.do",
			type: "POST",
			data: formData,
			processData: false,
			contentType: false,
			enctype: 'multipart/form-data',
			success:function(result) {

				var result=JSON.parse(result);
				console.log(result);
				if(result.rs == "complete") {
					
				}
			}
		});
	},
	loadShareMap:function() {
		var formData = new FormData();
		formData.append("control", "loadShareMaps");
		
		$.ajax({
			url:"./getMapList.do",
			type: "POST",
			data: formData,
			processData: false,
			contentType: false,
			enctype: 'multipart/form-data',
			success:function(result) {

				var result=JSON.parse(result);
				console.log(result);
				if(result.rs == "complete") {
					
				}
			}
		});
	},
	SHARE:{
		
	}
}