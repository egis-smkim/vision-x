var BOARD = {
	editor:null,
	dataTable:0,
	init:function() {
	
		BOARD.dataTable = $('#boardContentList').DataTable( {
				"columns": [
	    		    { "width": "10%"},
	    		    { "width": "60%", "orderable": false },
	    		    { "width": "10%", "orderable": false },
	    		    { "width": "10%", "orderable": false },
	    		    { "width": "10%", "orderable": false },
	    		  ],
		        "order": [[ 0, 'desc' ]]
		} );
		
	  
	},
	checkedUpdateBoard:function(bid, slug) {
		if($("#boardTitle").val() == "") {
			COMMON.alert($.i18n.t('Main.popper.customer_service.qna.alert.no_subject'),'info',function(){
				$("#boardTitle").focus();
			});
			return false;
		}
		if(BOARD.editor.getData() == "") {
			COMMON.alert($.i18n.t('Main.popper.customer_service.qna.alert.no_detail'),'info',function(){
			});
		}
		BOARD.updateBoard(bid, slug);
	},
	checkedInsertBoard:function(slug) {
		if($("#boardTitle").val() == "") {
			COMMON.alert($.i18n.t('Main.popper.customer_service.qna.alert.no_subject'),'info',function(){
				$("#boardTitle").focus();
			});
			return false;
		}
		if(BOARD.editor.getData() == "") {
			COMMON.alert($.i18n.t('Main.popper.customer_service.qna.alert.no_detail'),'info',function(){
			});
		}
		BOARD.insertBoard(slug);
	},
	insertBoard:function(slug) {
		var formData = new FormData();
	
		formData.append("slug", slug);
		formData.append("boardTitle", $("#boardTitle").val());
		formData.append("boardContent", BOARD.editor.getData());
		formData.append("isFile", filesNum);
		//formData.append("boardFiles", content_files);
		
		for(var i = 0; i < content_files.length; i++) {
			formData.append("boardFiles", content_files[i]);
		}
		
		if($("#boardBrackets option:selected").val() != "noBrackets"){
			formData.append("brackets", $("#boardBrackets option:selected").val());
		}
		
		$.ajax({
			url:"/desk/board/addBoard.do",
			type: "POST",
			data: formData,
			processData: false,
			contentType: false,
			enctype: 'multipart/form-data',
			success:function(result) {
				var result=JSON.parse(result);
				if(result.rs == "complete") {
					COMMON.alert($.i18n.t('Main.popper.customer_service.qna.alert.upload_board'),"success",function(){
						if(window.location.href.indexOf("/main/main.do") > -1){
							D_MAIN.viewContent(5);
							return false;
						} else {
							document.location.href = "./list.do?slug="+slug;
						}
					});
				}else if(result.rs == "fail") {
					COMMON.alert("게시글 등록에 실패하였습니다.","error",function(){return false;});
				}
			}
		});
	},
	updateBoard:function(bid, slug) {
		var formData = new FormData();
		
		formData.append("bid", bid);
		formData.append("boardTitle", $("#boardTitle").val());
		formData.append("boardContent", BOARD.editor.getData());

		formData.append("isFile", filesNum);
		
		if(old_files.length != 0){
			for(var i = 0; i < old_files.length; i++) {
				formData.append("fids", old_files[i]);
			}
		}else {
			formData.append("fids", "0");
		}

		for(var i = 0; i < content_files.length; i++) {
				 formData.append("boardFiles", content_files[i]);
		}
		
		if($("#boardBrackets option:selected").val() != "noBrackets"){
			formData.append("brackets", $("#boardBrackets option:selected").val());
		}
		
		$.ajax({
			url:"/desk/board/updateBoard.do",
			type: "POST",
			data: formData,
			processData: false,
			contentType: false,
			enctype: 'multipart/form-data',
			success:function(result) {

				var result=JSON.parse(result);

				if(result.rs == "complete") {
					COMMON.alert($.i18n.t('Main.popper.customer_service.qna.alert.update_board'),"success",function(){
						if(window.location.href.indexOf("/main/main.do") > -1){
							D_MAIN.viewQna(bid);
							return false;
						} else {
							document.location.href = "./list.do?slug="+slug;
						}
					});
				}else if(result.rs == "fail") {
					COMMON.alert("게시글 변경에 실패하였습니다.","error",function(){return false;});
				}
			}
		});
	},
	
	deleteBoard:function(bid, slug) {
			COMMON.confirm("<span style='color: #595959;'>"+$.i18n.t('Main.popper.customer_service.qna.alert.delete_board_confirm')+"<span>","",
				"info",
				function(){
			
				var formData = new FormData();
				formData.append("bid", bid);
	
				$.ajax({
					url:"/desk/board/deleteBoard.do",
					type: "POST",
					data: formData,
					processData: false,
					contentType: false,
					enctype: 'multipart/form-data',
					success:function(result) {
	
						var result=JSON.parse(result);
	
						if(result.rs == "complete") {
							COMMON.alert($.i18n.t('Main.popper.customer_service.qna.alert.delete_board'),"success",function(){
								if(window.location.href.indexOf("/main/main.do") > -1){
									D_MAIN.viewContent(5);
									return false;
								} else {
									document.location.href = "./list.do?slug="+slug;
								}
							});
						}
						
					}
				});
			},
			function(){return false;});
	
	},
	
	downloadFile:function(fid){

		var formData = new FormData();
		formData.append("fid", fid);
		
	    $.ajax({
	        url:"./fileDownload.do",
	        method: "POST",
	        data: formData,
	        processData: false,
			contentType: false,
			enctype: 'multipart/form-data',
	        success:function(result) {
				window.location ='fileDownload.do?fid='+fid;
	        },
	        error:function(request,status){
	            alert("오류가 발생했습니다.");
	        }
	    });
	}

}