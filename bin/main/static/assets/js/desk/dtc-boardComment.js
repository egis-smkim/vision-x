var BOARD_COMMENT = {
	init:function() {
 		
	},
	getCommentList:function(bid){
		
		var formData = new FormData();
		formData.append("bid", bid);
		formData.append("cmt_level", cmt_level);
		click = false;
		
		$.ajax({
			url : "/desk/board/getCommentList.do",
			type: "POST",
			data: formData,
			processData: false,
			contentType: false,
			enctype: 'multipart/form-data',
			async : false, //순차적으로 실행
			success:function(result) {
				var result=JSON.parse(result);
				$("#commentList").empty();
				var str="";
				str=str+'<div><strong>댓글 ('+result.cntComment+')</strong></div>';
				$('#commentList').append(str);
				
				$.each(result.commentList, function(index, element) {
				if (element.cdepth == '0'){
					var str="";
					str=str +'<hr class="m-1">'
							+'<div class="m-2">'
								+'<div class="media">'
										+'<div class="media-body" id="cid'+element.cid+'">'
										+'<div class="float-left mr-3 name"><a href="">' + element.memid + '</a></div>';
					if(element.update_date == null){	    	
				    	str=str+'<div class="text-muted small date">'+ element.reg_date + '</div>';
				    } else {
				    	str=str+'<div class="text-muted small date">'+ element.update_date + ' (수정됨)</div>';
				    } 						
			
					str=str					+'<div class="clear-both mt-2 comment">'+ element.content+ '</div>'
				        					+'<div class="small mt-2">';	
					if(result.MEM_LEVEL >= result.CMT_LEVEL){	    	
				    	str=str+'<a href="JavaScript:BOARD_COMMENT.replyComment('+element.cid+','+element.bid+','+element.bmid+');" class="text-light reply">답글</a>';
				       }
					
					if(element.memid == result.MEM_ID){	    	
				    	str=str+'<a href="JavaScript:BOARD_COMMENT.editComment('+element.cid+','+element.bid+');" class="text-light ml-2">수정</a>'
				               +'<a href="JavaScript:BOARD_COMMENT.deleteComment('+element.cid+','+element.bid+');" class="text-light ml-2">삭제</a>';
				       } 	
				    str=str+'</div>'
				        +'</div>'
				        +'</div><div id="cgroup'+element.cid+'"></div>'
				        +'</div>'
				        ;
				    $('#commentList').append(str);
			    } else {
			    	var str="";
					str=str +'<div class="m-2">'
								+'<div class="media">'
										+'<div class="m-2" /></div>'
										+'<div class="media-body" id="cid'+element.cid+'">'
										+'<div class="float-left mr-3 name"><a href="">' + element.memid + '</a></div>';
					if(element.update_date == null){	    	
				    	str=str+'<div class="text-muted small date">'+ element.reg_date + '</div>';
				    } else {
				    	str=str+'<div class="text-muted small date">'+ element.update_date + '</div>';
				    } 						
			
					str=str				+'<div class="clear-both mt-2 comment">'+ element.content+ '</div>'
				        				+'<div class="small mt-2">'
				    if(element.memid == result.MEM_ID){	    	
				    	str=str+'<a href="JavaScript:BOARD_COMMENT.editComment('+element.cid+','+element.bid+');" class="text-light">수정</a>'
				               +'<a href="JavaScript:BOARD_COMMENT.deleteComment('+element.cid+','+element.bid+');" class="text-light ml-2">삭제</a>';
				       } 	
				    str=str				+'</div>'
				        				+'</div>'
				        		+'</div>'
				        +'</div>'
				       
				        ;
				    $('#cgroup'+element.cgroup).append(str);
			    }
				});		
						
	 
			}//success
		});	//ajax
	},
	
	insertComment:function(bid, bmid) {
		
		var html = "댓글이 등록되었습니다.";
		if(window.location.href.indexOf("/main/main.do") > -1){
			html = $.i18n.t('Main.popper.customer_service.qna.alert.upload_answer');
		}
		
		if($("#commentContent").val() == "") {
			alert(html+' 내용을 입력하세요');
			$("#commentContent").focus();
			return false;
		}

		var formData = new FormData();
		formData.append("bid", bid);
		formData.append("bmid", bmid);
		formData.append("commentContent", $("#commentContent").val());
		formData.append("cdepth", 0);
		
		if(cmt_alert == 0) {
			formData.append("cmt_alert", 0);
		} else {
			formData.append("cmt_alert", 1);
		}
		
		
		
		$.ajax({
				url:"/desk/board/addComment.do",
				type: "POST",
				data: formData,
				processData: false,
				contentType: false,
				enctype: 'multipart/form-data',
				success:function(result) {
					var result=JSON.parse(result);
					if(result.rs == "complete") {
						
						COMMON.alert(html,"success",function(){
							if(window.location.href.indexOf("/main/main.do") > -1){
								D_MAIN.viewQna(bid);
								$("#commentContent").val("");
								return false;
							} else {
								BOARD_COMMENT.getCommentList(bid);
								$("#commentContent").val("");
							}
						});
					}else if(result.rs == "fail") {
						COMMON.alert(html+" 등록에 실패하였습니다.","error",function(){return false;});
					}
				}
			});
			
	},
	
	editComment:function(cid, bid) {
		if(click == false){
			click = true;
			var name = $("#cid"+cid+" .name").html();
			var content = $("#cid"+cid+" .comment").html();
			var date = $("#cid"+cid+" .date").html();
			
		
			str="";
			str=str +'<div class="media-body" id="cid'+cid+'">'
					+'<div class="float-left mr-3 name"><a href="">' + name + '</a></div>' 
					+'<div class="text-muted small date">'+ date + '</div>' 
					+'<textarea name="editContent" id="editContent" class="form-control" rows="2">'+content+'</textarea>'
				    +'<div class="small mt-2">';	
				    
			str=str +'<a href="JavaScript:BOARD_COMMENT.updateComment('+cid+','+bid+');" class="text-light ">저장</a>'
				    +'<a href="JavaScript:BOARD_COMMENT.getCommentList('+bid+');" class="text-light ml-2">취소</a>';
				       	
			str=str +'</div>'
				    +'</div>'
				    +'<hr class="m-1">';
					
			$('#cid' + cid).replaceWith(str);
		} else {
			BOARD_COMMENT.getCommentList(bid);
			BOARD_COMMENT.editComment(cid,bid);
		}
		
	},

	updateComment:function(cid, bid) {
		
		if($("#editContent").val() == "") {
			alert('댓글 내용을 입력하세요');
			$("#editContent").focus();
			return false;
		}

		var formData = new FormData();
		formData.append("cid", cid);
		formData.append("editContent", $("#editContent").val());

	
		$.ajax({
				url:"/desk/board/updateComment.do",
				type: "POST",
				data: formData,
				processData: false,
				contentType: false,
				enctype: 'multipart/form-data',
				success:function(result) {
					var result=JSON.parse(result);
					if(result.rs == "complete") {
						COMMON.alert("댓글이 수정되었습니다.","success",function(){
							BOARD_COMMENT.getCommentList(bid);
						});
					}else if(result.rs == "fail") {
						COMMON.alert("댓글 수정에 실패하였습니다.","error",function(){return false;});
					}
				}
			});
			
	},
	
	deleteComment:function(cid, bid) {
		
		var html = "<span style='color: #595959;'>댓글을 삭제하시겠습니까?<span>";
		var html2 = "댓글이 삭제 되었습니다";
		if(window.location.href.indexOf("/main/main.do") > -1){
			html = "<span style='color: #595959;'>"+$.i18n.t('Main.popper.customer_service.qna.alert.delete_answer_confirm')+"<span>";
			html2 = $.i18n.t('Main.popper.customer_service.qna.alert.delete_answer');
		}
		
		COMMON.confirm(html,"",
		"info",
		function(){

		var formData = new FormData();
		formData.append("cid", cid);
	
		$.ajax({
				url:"/desk/board/deleteComment.do",
				type: "POST",
				data: formData,
				processData: false,
				contentType: false,
				enctype: 'multipart/form-data',
				success:function(result) {
					var result=JSON.parse(result);
					if(result.rs == "complete") {
						COMMON.alert(html2,"success",function(){
							if(window.location.href.indexOf("/main/main.do") > -1){
								D_MAIN.viewQna(bid);
								return false;
							} else {
								BOARD_COMMENT.getCommentList(bid);
							}
						});
					}
				}
			});
		},
		function(){return false;});
			
	},
	
	replyComment:function(cid,bid,bmid) {
		
		if(click == false){
			click = true;
		
			str="";
			str=str +'<div class="input-group" id="replyAdd">'
					+'<div class="m-2" /></div>'
					+'<input type="text" class="form-control" placeholder="답글을 입력하세요" id="replyContent">'
					+'<div class="input-group-append">'
					+'<a href="JavaScript:BOARD_COMMENT.insertReply('+bid+','+bmid+','+cid+');"><button type="button" class="btn btn-primary">작성</button>&nbsp;</a>'
					+'</div></div>';
					
			$("#cid"+cid+" .reply").text('답글취소');
			$("#cid"+cid+" .reply").prop("href", "JavaScript:BOARD_COMMENT.getCommentList("+bid+");");
			$('#cgroup' + cid).append(str);

		}else {
			BOARD_COMMENT.getCommentList(bid);
			BOARD_COMMENT.replyComment(cid,bid,bmid);
		}
	},
	
	insertReply:function(bid, bmid, cid) {
		if($("#replyContent").val() == "") {
			alert('답글 내용을 입력하세요');
			$("#replyContent").focus();
			return false;
		}

		var formData = new FormData();
		formData.append("bid", bid);
		formData.append("bmid", bmid);
		formData.append("replyContent", $("#replyContent").val());
		formData.append("cdepth", 1);
		formData.append("cgroup", cid);
	
		if(cmt_alert == 0) {
			formData.append("cmt_alert", 0);
		} else {
			formData.append("cmt_alert", 1);
		}
		
		if(reply_alert == 0) {
			formData.append("reply_alert", 0);
		} else {
			formData.append("reply_alert", 1);
		}
		
	
		$.ajax({
				url:"/desk/board/addReply.do",
				type: "POST",
				data: formData,
				processData: false,
				contentType: false,
				enctype: 'multipart/form-data',
				success:function(result) {
					var result=JSON.parse(result);
					if(result.rs == "complete") {
						COMMON.alert("답글이 등록되었습니다.","success",function(){
							BOARD_COMMENT.getCommentList(bid);
						});
					}else if(result.rs == "fail") {
						COMMON.alert("답글 등록에 실패하였습니다.","error",function(){return false;});
					}
				}
			});
	}
 

}

