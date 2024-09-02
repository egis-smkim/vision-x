/**
 * 
 */
var POPUP = {
	editor:null,
	dataTable:0,
	init:function() {
		
		POPUP.dataTable = $('#popupList').DataTable( {
				"columns": [
	    		    { "width": "5%"},
	    		    { "width": "15%"},
	    		    { "width": "5%"},
	    		  ],
		        "order": [[ 0, 'desc' ]]
		} );
	},
	sourceEditingInit:function(){
		if($(".ck-source-editing-button").length && $(".ck-source-editing-button").hasClass('ck-on')){
			$(".ck-source-editing-button").click();
		}
	},
	add:function() {
		
		POPUP.sourceEditingInit();
		
		$('#title').html('팝업 추가');
		
		$('input[id=pop_name]').val('');
		POPUP.editor.setData('');
		$("#pop_no").prop('checked', true);
		$("#pop_yes").prop('checked', false); 
		
		$("#pop_mid").prop('checked', true);
		
		$('#deleteBtn').css('display','none');
		$('#editBtn').css('display','none');
		$('#addBtn').css('display','block');
		$('#popupDiv').css('display','block');
		
		$('input[id=pop_start]').val('');
		$('input[id=pop_end]').val('');
		
		//$('#title').val() = "팝업 추가";
		
		
	},
	popEndDate:function(){
		document.getElementById("pop_end").setAttribute("min", $('input[id=pop_start]').val());
	},
	popStartDate:function(){
		document.getElementById("pop_start").setAttribute("max", $('input[id=pop_end]').val());
	},
	insert:function() {
		
		if($("#pop_name").val() == "") {
				COMMON.alert("팝업 명을 입력하세요.","info",function(){$("#pop_name").focus();});
				return false;
		}
		
		if(POPUP.editor.getData() == "") {
			COMMON.alert('내용을 입력하세요','info',function(){});
			return false;
		}
		
		if ($('#newPopUP').length) {
			$('#newPopUP').remove();
		} 
		
		var newDiv = document.createElement('div');
		newDiv.id = 'newPopUP';
		newDiv.innerHTML = POPUP.editor.getData();
		newDiv.style.display = 'none';
		newDiv.style.width = 'max-content';
		document.body.appendChild(newDiv);
		var width = parseFloat($("#newPopUP").css("width"));
		var height = parseFloat($("#newPopUP").css("height"));
			
		var formData = new FormData();
		var pop_name = $("#pop_name").val();	
		var pop_yn = $('input[name=pop_use]:checked').val();
		var pop_location = $('input[name=pop_location]:checked').val();
		var pop_start = $('input[id=pop_start]').val();
		var pop_end = $('input[id=pop_end]').val();
	
		
		if(pop_start == ''){
			formData.append("pop_start", '0');
		}
		else {
			formData.append("pop_start", pop_start);
		}
		
		if(pop_end == ''){
			formData.append("pop_end", '0');
		}
		else {
			formData.append("pop_end", pop_end);
		}
		
		
		formData.append("pop_name", pop_name);
		formData.append("pop_yn", pop_yn);
		formData.append("pop_location", pop_location);
		formData.append("pop_editor", POPUP.editor.getData());
		formData.append("width", width);
		formData.append("height", height);
		
		$.ajax({
			url:"/admin/home/popup/insert.do",
			type: "POST",
			data: formData,
			processData: false,
			contentType: false,
			enctype: 'multipart/form-data',
			success:function(result) {
				var result=JSON.parse(result);
				if(result.rs == "complete") {
					COMMON.alert("팝업이 등록되었습니다.","success",function(){
						window.location.reload();
					});
				}else if(result.rs == "fail") {
					COMMON.alert("팝업 등록에 실패하였습니다.","error",function(){return false;});
				}
			}
		});
	},
	manage:function(popid) {
		
		POPUP.sourceEditingInit();
		
		$('#title').html('팝업 관리');
		
		var formData = new FormData();
		
		formData.append("pop_id", popid);
		
		$.ajax({
			url:"/admin/home/popup/manage.do",
			type: "POST",
			data: formData,
			processData: false,
			contentType: false,
			enctype: 'multipart/form-data',
			success:function(result) {
				var result=JSON.parse(result);
				if(result.rs == "complete") {
					$('input[id=pop_name]').val(result.popupVO.name);
					
					POPUP.editor.setData(result.popupVO.editor);;
					
					
					if((result.popupVO.use_yn) == 'Y'){
						$("#pop_no").prop('checked', false);
						$("#pop_yes").prop('checked', true); 
					} else {
						$("#pop_yes").prop('checked', false);
						$("#pop_no").prop('checked', true); 
					}
					
					if((result.popupVO.location) == 'mid'){
						$("#pop_mid").prop('checked', true);
					} else if((result.popupVO.location) == 'top_left'){
						$("#pop_top_left").prop('checked', true);
					} else if((result.popupVO.location) == 'top_right'){
						$("#pop_top_right").prop('checked', true);
					} else if((result.popupVO.location) == 'bot_left'){
						$("#pop_bot_left").prop('checked', true);
					} else if((result.popupVO.location) == 'bot_right'){
						$("#pop_bot_right").prop('checked', true);
					}
					
					$('input[id=pop_start]').val(result.popupVO.start);
					$('input[id=pop_end]').val(result.popupVO.end);
						
					let editBtn = document.querySelector("#editBtn");
					editBtn.onclick = function() {
						POPUP.update(popid);
					}
					
					let deleteBtn = document.querySelector("#deleteBtn");
					deleteBtn.onclick = function() {
						POPUP.delete(popid);
					}
					
					$('#deleteBtn').css('display','block');
					$('#editBtn').css('display','block');
					$('#addBtn').css('display','none');
					
					
					
					$('#popupDiv').css('display','block');
				}
			}
		});
	
	},
	update:function(popid) {
		
		if($("#pop_name").val() == "") {
				COMMON.alert("팝업 명을 입력하세요.","info",function(){$("#pop_name").focus();});
				return false;
		}
		
		if(POPUP.editor.getData() == "") {
			COMMON.alert('내용을 입력하세요','info',function(){});
			return false;
		}
		
		if ($('#newPopUP').length) {
			$('#newPopUP').remove();
		} 
		
		var newDiv = document.createElement('div');
		newDiv.id = 'newPopUP';
		newDiv.innerHTML = POPUP.editor.getData();
		newDiv.style.display = 'none';
		newDiv.style.width = 'max-content';
		document.body.appendChild(newDiv);
		var width = parseFloat($("#newPopUP").css("width"));
		var height = parseFloat($("#newPopUP").css("height"));
		
		var pop_name = $("#pop_name").val();	
		var pop_yn = $('input[name=pop_use]:checked').val();
		var pop_location = $('input[name=pop_location]:checked').val();
		var pop_start = $('input[name=pop_start]').val();
		var pop_end = $('input[name=pop_end]').val();
		
		var formData = new FormData();
		
		formData.append("pop_id", popid);
		formData.append("pop_name", pop_name);
		formData.append("pop_yn", pop_yn);
		formData.append("pop_location", pop_location);
		formData.append("pop_editor", POPUP.editor.getData());
		formData.append("width", width);
		formData.append("height", height);
		
		if(pop_start == ''){
			formData.append("pop_start", '0');
		}
		else {
			formData.append("pop_start", pop_start);
		}
		
		if(pop_end == ''){
			formData.append("pop_end", '0');
		}
		else {
			formData.append("pop_end", pop_end);
		}
		
		$.ajax({
			url:"/admin/home/popup/update.do",
			type: "POST",
			data: formData,
			processData: false,
			contentType: false,
			enctype: 'multipart/form-data',
			success:function(result) {
				var result=JSON.parse(result);
				if(result.rs == "complete") {
					COMMON.alert("팝업이 수정되었습니다.","success",function(){
						window.location.reload();
					});
				}else if(result.rs == "fail") {
					COMMON.alert("팝업 수정에 실패하였습니다.","error",function(){return false;});
				}
			}
		});
		
	},
	delete:function(popid) {
		COMMON.confirm("<span style='color: #595959;'>팝업을 삭제하시겠습니까?<span>","삭제 후 복구할 수 없습니다.","info",
		function(){
			var formData = new FormData();
			
			formData.append("pop_id", popid);
			
			$.ajax({
				url:"/admin/home/popup/delete.do",
				type: "POST",
				data: formData,
				processData: false,
				contentType: false,
				enctype: 'multipart/form-data',
				success:function(result) {
					var result=JSON.parse(result);
					if(result.rs == "complete") {
						COMMON.alert("팝업이 삭제되었습니다.","success",function(){
							window.location.reload();
						});
					}else if(result.rs == "fail") {
						COMMON.alert("팝업 삭제에 실패하였습니다.","error",function(){return false;});
					}
				}
			});
		});
		
	}

}