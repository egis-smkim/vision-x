var D_MAIN = {
	init:function(){
		var $menu     = $('.navbar-main .nav-item'),
		$title     = $('.navbar-main .nav-item a'),
	    $contents = $('.section'),
	    $doc      = $('html, body');

		$menu.on('click','.menu', function(e){
        	
			$('guide').css("display","none");
			$('market').css("display","none");
			$('notice').css("display","none");
			$('customer-service').css("display","none");
			$('.eg-bg').css("display","block");
			$('main').css("display","block");
			
            var $target = $(this).parent(),
                idx     = $target.index(),
                section = $contents.eq(idx),
                offsetTop = section.position().top+1;
            
            
            if(idx == 0){
            	 $doc.stop()
                 	.animate({
                     	scrollTop :0
                 	}, 500);
            	 return false;
            } 
            $doc.stop()
                    .animate({
                        scrollTop :offsetTop
                    }, 500);
            return false;
        });

		$(window).scroll(function(e){
	        var scltop = $(window).scrollTop();
	        
	        var value = ($("main").css("display") != "none");
	        
	        if(scltop >= 0 && scltop < 1500+D_MAIN.vh(100) && value){
	        	$(".navbar-nav .nav-item a").each(function(i,d){
	            	$(d).removeClass("active");
	            });
				$title.eq(0).addClass("active");
			}
	        
	        if(scltop >= 1500+D_MAIN.vh(100) && scltop < 2700+D_MAIN.vh(100) && value){
	        	$(".navbar-nav .nav-item a").each(function(i,d){
	            	$(d).removeClass("active");
	            });
				$title.eq(1).addClass("active");
			}
	        
	        if(scltop >= 2700+D_MAIN.vh(100) && value){
	        	$(".navbar-nav .nav-item a").each(function(i,d){
	            	$(d).removeClass("active");
	            });
				$title.eq(2).addClass("active");
			}
    	});
		
		$(".main-func-list li").each(function(idx, item){
	
			$(this).on("click", function(){
				var target = $("#"+$("button",this).data("scroll"));
				$('.main-func').mCustomScrollbar('scrollTo', target.position().top+1);
				return false;
			});
		});
		
		$(".main-func").mCustomScrollbar({
			scrollbarPosition:"outside",
			callbacks:{
				onScroll:function(e){
					var pos = this.mcs.top*-1;
					$(".main-func-list li button").each(function(i,d){
						var target = $("#"+$(d).data("scroll"));
						var targetH = target.height();
						var targetPos = target.position().top;
						if(targetPos <= pos && (targetPos+targetH) > pos){
							$(d).parent().addClass("on");
						}else{
							$(d).parent().removeClass("on");
						}
					});
				}
			}
		});
		
		var $category     = $('.nav-market .nav-item');
		
	    $(function () {
	        $category.on('click','a', function(e){
	            var $target = $(this).parent(),
	                idx     = $target.index();
	            
	            $("#productListWrap .product").css("display","none");
	            
	            $(".nav-market .nav-item a").each(function(i,d){
	            	$(d).removeClass("active");
	            });
	            
	            $(this).addClass("active");
	            
	            if(idx == 0){
	            	$("#productListWrap .product").css("display","block");
	            } else if(idx == 1){
	            	$("#productListWrap .product[value=1]").css("display","block");
	            } else if(idx == 2){
	            	$("#productListWrap .product[value=2]").css("display","block");
	            } else {
	            	$("#productListWrap .product[value=3]").css("display","block");
	            }
	            
	        });
	    });
		
		$('.eg-guide-nav').mCustomScrollbar();
		
		var selectDep2 = null;
		$(".eg-guide-dep2 li").each(function(idx, item){

			$(this).on("click", function(){
				var target = $("#"+$("button",this).data("scroll"));
				//$(".eg-guide-cont").animate({scrollTop:target.offset().top},300);
				$('.eg-guide-cont').mCustomScrollbar('scrollTo', target);
				return false;
			});
		});

		$(".eg-guide-cont").mCustomScrollbar({
			scrollbarPosition:"outside",
			callbacks:{
				onScroll:function(e){
					var pos = this.mcs.top*-1;
					$(".eg-guide-nav button").each(function(i,d){
						var target = $("#"+$(d).data("scroll"));
						var targetH = target.height();
						var targetPos = target.position().top;
						if(targetPos <= pos && (targetPos+targetH) > pos){
							$(d).parent().addClass("on");
							if($(d).closest(".eg-guide-dep3").siblings(".eg-guide-dep2-tit").length == 1){
								if(selectDep2 != null){
									selectDep2.parent("li").removeClass("on");
								}
								selectDep2 = $(d).closest(".eg-guide-dep3").siblings(".eg-guide-dep2-tit");
								$(d).closest(".eg-guide-dep3").siblings(".eg-guide-dep2-tit").closest("li").addClass("on");
							}else{
								if(selectDep2 != null){
									selectDep2.parent("li").removeClass("on");
								}
							}
						}else{																	
							$(d).parent().removeClass("on");
						}
					});
				}
			}
		});
		
		 // join
	    $(".join").on("click", function(){
	        $(".popup.type02").addClass("active");
	    })
	    $(".popup.type02 .close").on("click", function(){
			$(this).closest(".popup").find('input').val('');
			$(this).closest(".popup").find('input:checkbox').prop('checked',false);
	        $(this).closest(".popup").removeClass("active");
	    })

		$(".login").on("click", function(){
	        $(".popup.type01").addClass("active");
			$("#memId").focus();
	    })
	    $(".popup.type01 .close").on("click", function(){
			$(this).closest(".popup").find('input').val('');
			$(this).closest(".popup").find('input:checkbox').prop('checked',false);
	        $(this).closest(".popup").removeClass("active");
	    })
	
	    // web 아이디/비밀번호찾기
	    $(".findAll").on("click", function(){
	        $("#findPwdPopup").addClass("active");
			$(".popup.type01").removeClass("active");
	    })
	    $("#findPwdPopup .close").on("click", function(){
			$(this).closest(".popup").find('input').val('');//기존 내역 지우기
	        $(this).closest(".popup").removeClass("active");
	    })
	    $("#errorPwdPopup .close").on("click", function(){
			$(this).closest(".popup").find('input').val('');//기존 내역 지우기
	        $(this).closest(".popup").removeClass("active");
	    })
		
		D_MAIN.dropzoneInit();
	    D_MAIN.editInit();
	},
	vh:function(v){
		var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  		return (v * h) / 100;
	},
	dropzoneInit:function(){
		$('#dropzoneFileData').dropzone({
	        parallelUploads: 5,
	        maxFilesize:     50000,
	        filesizeBase:    1000,
	        addRemoveLinks:  true,
	        url:"BOARD.insertBoard(slug1)",
	        //url:"./addBoard.do",
	        maxFiles:5,
			paramName:"fileLists",
			autoQueue:false,
			createImageThumbnails:true,
			uploadMultiple:true,
			withCredentials:true,
			dictRemoveFile:'삭제',
			dictDefaultMessage:'PREVIEW',
			rejectedFiles:'jsp',
      	    accept: function(file, done) {
					var arr = file.name.split('.');
		            var ext = arr[arr.length -1].toUpperCase();
	
		             if (ext == 'JSP' || ext == 'ASP' || ext == 'PHP' || ext == 'PHP3' || ext == 'EXE' || ext == 'NET' || ext == 'CGI') {
	   	                COMMON.alert("확장자가 "+ext+"인 파일은\n업로드 할 수 없습니다.","error",function(){return false;});
	   	                this.removeFile(file);
	   	                return ;
	   	            }
      	            else if (file.size <= 0) {
      	                done("적합한 파일이 아닙니다.");
      	                this.removeFile(file);
      	                return ;
      	            }
      	            else { done(); }
      	        },
      	    init:function(){
      	   		let myDropzone = this; // closure 변수 (화살표 함수 쓰지않게 주의)
      	    	// 서버에 제출 submit 버튼 이벤트 등록
      	        document.querySelector('#confirmBtn').addEventListener('click', function () {
				  	// 거부된 파일이 있다면
      	            if (myDropzone.getRejectedFiles().length > 0) {
      	                let files = myDropzone.getRejectedFiles();
      	                console.log('거부된 파일이 있습니다.', files);
      	                alert("거부된 파일이 있습니다.");
      	                return;
      	            }
      	 			filesNum = myDropzone.files.length;
      	            content_files = myDropzone.files;
					myDropzone.processQueue();
      	              	          
      	  		});

				this.on('resetFiles', function() {
			        if(this.files.length != 0){
			            for(i=0; i<this.files.length; i++){
			                this.files[i].previewElement.remove();
			            }
			            this.files.length = 0;
			        }
			    });
      	    	  
      	     }
      	    	  		     
      	});

	},
	editInit:function(){
		ClassicEditor
			.create( document.querySelector( '#qnaEditor' ),  {
				ckfinder: {
					uploadUrl : '/uploadEditorImg.do'
				},
				minHeight: '300px'
			})
			.then( editor => {
				BOARD.editor = editor;
			} )
			.catch( err => {
				console.error( err.stack );
			} );
			
		ClassicEditor
    		.create( document.querySelector( '#qnaContent' ),  {
    			// toolbar: [ 'heading', '|', 'bold', 'italic', 'link' ]
    			ckfinder: {
    				uploadUrl : '/uploadEditorImg.do'
    			},
    			minHeight: '300px'
    		})
    		.then( editor => {
    			D_MAIN.qnaContent = editor;
    			D_MAIN.qnaContent.isReadOnly = true;
	  			const toolbarElement = editor.ui.view.toolbar.element;
	  			toolbarElement.style.display = 'none';
    		} )
    		.catch( err => {
    			console.error( err.stack );
    		} );

		ClassicEditor
	  		.create( document.querySelector( '#noticeContent' ),  {
	  			// toolbar: [ 'heading', '|', 'bold', 'italic', 'link' ]
	  			minHeight: '300px'
	  		})
	  		.then( editor => {
	  			D_MAIN.noticeContent = editor;
	  			D_MAIN.noticeContent.isReadOnly = true;
	  			const toolbarElement = editor.ui.view.toolbar.element;
	  			toolbarElement.style.display = 'none';
	  	        
	  		} )
	  		.catch( err => {
	  			console.error( err.stack );
	  		} );
	},
	viewContent:function(num){
		$(".navbar-collapse .nav-item a").each(function(i,d){
        	$(d).removeClass("active");
        });
		
		$('main').css("display","none");
		$('guide').css("display","none");
		$('market').css("display","none");
		$('notice').css("display","none");
		$('customer-service').css("display","none");
		
		$('.eg-bg').css("display","none");
		
		$('html, body').scrollTop(0);
		
		if(num == 1){
			$('market').css("display","block");
			$('.navbar-main .nav-item a').eq(3).addClass("active");
		}else if(num == 2){
			$('guide').css("display","block");
			$('.navbar-main .nav-item a').eq(4).addClass("active");
		}else if(num == 3) {
			$('notice').css("display","block");
			$('.navbar-side .nav-item a').eq(2).addClass("active");
			
			if(noticeDataTable == 0){
				noticeDataTable = $('#boardContentList').DataTable( {
					"columns": [
		    		    { "width": "10%"},
		    		    { "width": "60%", "orderable": false },
		    		    { "width": "15%", "orderable": false },
		    		    { "width": "15%", "orderable": false }
		    		  ],
			        "order": [[ 0, 'desc' ]]


				} );	
			}
			
		}else if(num == 4) {
			$('customer-service').css("display","block");
			$('.navbar-side .nav-item a').eq(3).addClass("active");
			
			$('#qna').css("display","none");
			$('#faq').css("display","block");
			
			$('.custom-center-menu li').eq(1).removeClass("on");
			$('.custom-center-menu li').eq(0).addClass("on");
			
			if(faqDataTable == 0){
				faqDataTable = $('#faqContentList').DataTable( {
					"columns": [
						{ className: 'dt-control', orderable: false, "width": "10%"},
		    		    { "width": "90%", "orderable": false },
		    		    { "width": "0%", "orderable": false },
		    		    { "width": "0%", "orderable": false }
		    		  ],
			        "order": [[ 3, 'desc' ]]

				});
				
				faqDataTable.on('click', 'td.dt-control', function (e) {
				    let tr = e.target.closest('tr');
				    
				    if(tr.classList.contains("dt-hasChild"))
				    	tr.classList.remove("dt-hasChild");
				    else 
				    	tr.classList.add("dt-hasChild");
				    
				    let row = faqDataTable.row(tr);
				 
				    if (row.child.isShown()) {
				        // This row is already open - close it
				        row.child.hide();
				    }
				    else {
				        // Open this row
				        row.child(D_MAIN.viewFaq(row.data())).show();
				    }
				});
				
				var $brackets = $('.nav-faq .nav-item');
				
			    $(function () {
			        $brackets.on('click','a', function(e){
			            var $target = $(this).parent(),
			                idx     = $target.index();
			            var brackets = $(this).text();
			            
			            $(".nav-faq .nav-item a").each(function(i,d){
			            	$(d).removeClass("active");
			            });
			            
			            $(this).addClass("active");
			            
			            faqDataTable.destroy();
			            
			            var formData = new FormData();
		        		formData.append("brackets", brackets);
		            	
		        		$.ajax({
		        			url:"/board/faqView.do",
		        			type: "POST",
		        			data: formData,
		        			processData: false,
		        			contentType: false,
		        			async:false,
		        			enctype: 'multipart/form-data',
		        			success:function(result) {
		        				var result=JSON.parse(result);
		        				var list = result.faqList;
		        				
		        				html = "";
		        				
								for(var i=0; i<list.length; i++){
									html += "<tr>";
									html += "	<td></td>";	
									html += "	<td>"+list[i].title+"</td>";	
									html += "	<td style=\"display:none\">"+list[i].bid+"</td>";	
									html += "	<td style=\"display:none\">"+list[i].brackets+"</td>";	
									html += "</tr>";	
								}
		        				
		        				
		        				$("#faqContentList tbody").html(html);
		        			}
		        		});
		        		
		            	faqDataTable = $('#faqContentList').DataTable( {
		            		
							"columns": [
								{className: 'dt-control', orderable: false, "width": "10%"},
				    		    {"width": "90%", "orderable": false },
				    		    {"width": "0%", "orderable": false },
				    		    {"width": "0%", "orderable": false }
				    		  ],
					        "order": [[ 3, 'desc' ]]

						});
			            
			        });
			    });
			    
			}
		} else {
			$('customer-service').css("display","block");
			$('.navbar-side .nav-item a').eq(3).addClass("active");
			
			$('.custom-center-menu li').eq(0).removeClass("on");
			$('.custom-center-menu li').eq(1).addClass("on");
			
			$('#qna').css("display","block");
			$('#faq').css("display","none");
			
			$("#qnaAdd").css("display","none");
			$("#qnaList").css("display","block");
			$("#qnaView").css("display","none");
			$("#addQnaBtn").css("display","block");
			
			if(qnaDataTable == 0){
				qnaDataTable = $('#qnaContentList').DataTable( {
					"columns": [
						{ "width": "10%", orderable: false},
		    		    { "width": "15%", "orderable": false },
		    		    { "width": "50%", "orderable": false },
		    		    { "width": "15%", "orderable": false },
		    		    { "width": "10%", orderable: false}
		    		  ],
			        "order": [[ 0, 'desc' ]]

				});
			} else {
				qnaDataTable.destroy();
	            
        		$.ajax({
        			url:"/board/qnaView.do",
        			type: "POST",
        			processData: false,
        			contentType: false,
        			async:false,
        			enctype: 'multipart/form-data',
        			success:function(result) {
        				var result=JSON.parse(result);
        				var list = result.qnaList;
        				
        				html = "";
        				
						for(var i=0; i<list.length; i++){
							html += "<tr>";
							html += "	<td>"+list[i].rownum+"</td>";	
							
							if(list[i].brackets != null){
								html += "	<td>"+list[i].brackets+"</td>";	
							} else {
								html += "	<td>기타</td>";	
							}
							html += "	<td><a href=\"JavaScript:D_MAIN.viewQna("+list[i].bid+");\" style=\"color:var(--bs-table-hover-color);\">"+list[i].title+"</td>";	
							html += "	<td>"+list[i].reg_date+"</td>";	
							if(list[i].cmt_cnt > 0){
								html += "	<td>답변완료</td>";	
							} else {
								html += "	<td>대기중</td>";	
							}
							html += "</tr>";	
						}
        				
        				
        				$("#qnaContentList tbody").html(html);
        			}
        		});
        		
        		qnaDataTable = $('#qnaContentList').DataTable( {
					"columns": [
						{ "width": "10%", orderable: false},
		    		    { "width": "15%", "orderable": false },
		    		    { "width": "50%", "orderable": false },
		    		    { "width": "15%", "orderable": false },
		    		    { "width": "10%", orderable: false}
		    		  ],
			        "order": [[ 0, 'desc' ]]

				});
			}
			
		}
	},
	goNoticeList:function(){
		$("#boardList").css("display","block");
		$("#noticeView").css("display","none");
		$("#goListBtn").css("display","none");
	},
	viewNotice:function(bid){
		var formData = new FormData();
		formData.append("bid", bid);
		
		$.ajax({
			url:"/board/view.do",
			type: "POST",
			data: formData,
			processData: false,
			contentType: false,
			async:false,
			enctype: 'multipart/form-data',
			success:function(result) {
				var result=JSON.parse(result);
				var board = result.boardContentVO;
				
				if(board.brackets != null){
					$("#noticeBrackets").html("["+board.brackets+"]");
				}
				$("#noticeTitle").html(board.title);
				$("#noticeViewCnt").html($.i18n.t('Main.popper.notice.content.view')+" "+board.view_cnt);
		
				if(board.update_date == null){
					$("#noticeRegDate").html(board.reg_date);
				} else {
					$("#noticeRegDate").html(board.update_date+$.i18n.t('Main.popper.notice.content.edited'));
				}
				D_MAIN.noticeContent.setData(board.content);
				
				var fileList = result.boardFileList;
				
				var html = "";
				
				if(fileList.length > 0){
					html += '<div class="text-muted small">첨부파일</div>';
					html += '	<div class="card-body p-3">';
					html += '		<div class="row no-gutters">';
					
					for(var i=0; i<fileList.length; i++){
						html += '		<div class="col-xl-6 p-1">';
						html += '			<div class="project-attachment ui-bordered p-2">';
						html += '				<div class="row ml-1">';
						html += '					<img src="https://w7.pngwing.com/pngs/444/283/png-transparent-computer-icons-email-attachment-cosmic-miscellaneous-text-trademark.png" style="width:63px;"/>';
						html += '					<div class="media-body ml-3">';
						html += '						<strong class="project-attachment-filename">'+fileList[i].org_file_name+'</strong>';
						html += '						<div class="mt-2">';
						
						if(fileList[i].file_type == 'jpg' || fileList[i].file_type == 'pdf' || fileList[i].file_type == 'png'){
							html += '						<a target="_blank" href="'+fileList[i].save_file_url+'" class="mr-3">View</a>';
						}
						html += '							<a href="/desk/board/fileDownload.do?fid='+fileList[i].fid+'">Download</a>';
						html += '						</div>';
						html += '					</div>';
						html += '				</div>';
						html += '			</div>';
						html += '		</div>';
					}
					html += '		</div>';
					html += '	</div>';
					html += '</div>';
				}
				
				$("#noticeFile").html(html);
				
				$("#goListBtn").css("display","inline-block");
				$("#noticeView").css("display","block");
				$("#boardList").css("display","none");
				
			}
		});
	},
	addQna:function(){
		$("#qnaAdd").css("display","block");
		$("#qnaList").css("display","none");
		$("#qnaView").css("display","none");
		$("#addQnaBtn").css("display","none");
		
		$("#updateBtn").css("display","none");
		$("#confirmBtn").css("display","");
		
		$("#updateBtn").attr("href", "JavaScript:BOARD.checkedUpdateBoard()");
		
		$("#boardBrackets").val("noBrackets").prop("selected", true);
		document.getElementById("boardTitle").value = null;
		BOARD.editor.setData("");
		
		filesNum= 0;
		content_files = new Array();
		
		Dropzone.forElement('#dropzoneFileData').removeAllFiles(true);
		$("#qnaOldFile").html("");
	},
	viewQna:function(bid){
		$("#qnaAdd").css("display","none");
		$("#qnaList").css("display","none");
		$("#qnaView").css("display","block");
		$("#addQnaBtn").css("display","none");
		
		var formData = new FormData();
		formData.append("bid", bid);
		
		$.ajax({
			url:"/board/view.do",
			type: "POST",
			data: formData,
			processData: false,
			contentType: false,
			async:false,
			enctype: 'multipart/form-data',
			success:function(result) {
				var result=JSON.parse(result);
				var board = result.boardContentVO;
				
				if(board.brackets != null){
					$("#qnaBrackets").html(board.brackets);
				} else {
					$("#qnaBrackets").html("기타");
				}
				
				$("#qnaTitle").html(board.title);
		
				if(board.update_date == null){
					$("#qnaRegDate").html(board.reg_date);
				} else {
					$("#qnaRegDate").html(board.update_date+$.i18n.t('Main.popper.customer_service.qna.function.edited'));
				}
				
				D_MAIN.qnaContent.setData(board.content);
				
				var fileList = result.boardFileList;
				
				var html = "";
				
				if(fileList.length > 0){
					html +="<table class=\"tbl-list\">\n"
					html +="	<tbody>\n"
					
					for(var i=0; i<fileList.length; i++){
						html +="		<tr>\n";
						html +="			<td><a href=\"/desk/board/fileDownload.do?fid="+fileList[i].fid+"\">"+fileList[i].org_file_name+"</a></td>\n";
						html +="		</tr>\n";
					}
					html +="	</tbody>\n";
					html +="</table>\n";
					
					$("#qnaFile").html(html);
					$("#qnaFile").parent()[0].style.display = "flex"
					
				} else {
					$("#qnaFile").parent()[0].style.display = "none"
				}
				
				
				$("#qnaComment").empty();
				
				$("#insertCommentBtn").attr("href", "JavaScript:BOARD_COMMENT.insertComment("+board.bid+","+board.bmid+")");
				
				$("#deleteQnaBtn").attr("href", "JavaScript:BOARD.deleteBoard("+board.bid+",'qna')");
				$("#editQnaBtn").attr("href", "JavaScript:D_MAIN.editBoard("+board.bid+")");
				
				if(result.commentList.length == 0){
					$("#qnaComment").parent()[0].style.display = "none"
				} else {
					$("#qnaComment").parent()[0].style.display = "flex"
				}
				
				$.each(result.commentList, function(index, element) {
					if (element.cdepth == '0'){
						var str="";
						str=str +'<div class="media">'
											+'<div class="media-body row" id="cid'+element.cid+'">'
												+'<div class="clear-both col-sm-11 comment">'+ element.content+ '</div>'
					        					+'<div class="small">';	
						if(element.memid == mem_id || mem_level == 10){	    	
					    	str=str+'<a href="JavaScript:BOARD_COMMENT.deleteComment('+element.cid+','+element.bid+');" class="text-light ml-2">삭제</a>';
					       } 	
					    str=str+'</div>'
					        +'</div>'
					        +'</div><div id="cgroup'+element.cid+'"></div>'
					        +'</div>'
					        ;
					    $('#qnaComment').append(str);
				    } else {
				    	var str="";
						str=str +'<div class="m-2">'
									+'<div class="media">'
											+'<div class="media-body row" id="cid'+element.cid+'">'
											+'<div class="clear-both col-sm-11 comment">┗ '+ element.content+ '</div>'
					        				+'<div class="small">'
					    if(element.memid == mem_id || mem_level == 10){	    	
					    	str=str+'<a href="JavaScript:BOARD_COMMENT.deleteComment('+element.cid+','+element.bid+');" class="text-light ml-2">삭제</a>';
					       } 	
					    str=str				+'</div>'
					        				+'</div>'
					        		+'</div>'
					        +'</div>'
					       
					        ;
					    $('#cgroup'+element.cgroup).append(str);
				    }
				});				
				
				
				
				
			}
		});
	},
	viewFaq:function(d){
		 var formData = new FormData();
		formData.append("bid", d[2]);
		
		html = "";
		
		$.ajax({
			url:"/board/view.do",
			type: "POST",
			data: formData,
			processData: false,
			contentType: false,
			async:false,
			enctype: 'multipart/form-data',
			success:function(result) {
				var result=JSON.parse(result);
				var board = result.boardContentVO;
				html += board.content;
			}
		});
		
		return html;
	},
	editBoard:function(bid){
		$("#qnaAdd").css("display","block");
		$("#qnaList").css("display","none");
		$("#qnaView").css("display","none");
		
		$("#updateBtn").css("display","");
		$("#confirmBtn").css("display","none");
		
		$("#updateBtn").attr("href", "JavaScript:BOARD.checkedUpdateBoard("+bid+")");
		
		Dropzone.forElement('#dropzoneFileData').removeAllFiles(true);
		
		var formData = new FormData();
		formData.append("bid", bid);

		$.ajax({
			url:"/board/view.do",
			type: "POST",
			data: formData,
			processData: false,
			contentType: false,
			async:false,
			enctype: 'multipart/form-data',
			success:function(result) {
				var result=JSON.parse(result);
				var board = result.boardContentVO;
				
				if(board.brackets != null){
					$("#boardBrackets").val(board.brackets).prop("selected", true);
				} else {
					$("#boardBrackets").val("noBrackets").prop("selected", true);
				}
				
				if(board.is_file > 0){
					$("#boardFile").css("display","block");
					BOARD_FILE.getFileList(bid);
					filesNum = board.is_file;
				} else {
					$("#boardFile").css("display","none");
					$("#qnaOldFile").html("");
				}
				
				document.getElementById("boardTitle").value = board.title;
				BOARD.editor.setData(board.content);
			}
		});
		
		
	}
}