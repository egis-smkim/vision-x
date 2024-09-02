/**
 * 
 */

var SITE = {
		editor:null,
		dataTable:0,
		init:function() {
			
			SITE.dataTable = $('#BMList').DataTable({
					"columns": [
		    		    { "width": "5%", "orderable": false },
		    		    { "width": "10%", "orderable": false },
		    		    { "width": "10%", "orderable": false },
		    		    { "width": "10%", "orderable": false },
		    		    { "width": "10%", "orderable": false },
		    		    { "width": "10%", "orderable": false },
		    		    { "width": "10%", "orderable": false },
		    		    { "width": "10%", "orderable": false },
		    		    { "width": "10%", "orderable": false },
		    		    { "width": "5%", "orderable": false },
		    		    { "width": "5%", "orderable": false }
		    		  ],
			        "order": [[ 0, 'asc' ]]
			} );
			
			SITE.dataTable.on( 'order.dt search.dt', function () {
				SITE.dataTable.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
		            cell.innerHTML = i+1;
		        } );
		    } ).draw();
			
		  
		},
	PAGE:{
		edit:function(pmid) {
			var formData = new FormData();
			formData.append("pmid", pmid);
			formData.append("menuName", $("#menuName").val());
			formData.append("masterCode", $("#masterCode").val());
			formData.append("rootUrl", $("#rootUrl").val());
			formData.append("type", $("input[name='codeType']:checked").val());
			formData.append("accessLevel", $("#accessLevel").val());
			formData.append("order", $("#order").val());
			
			$.ajax({
				url:"./executeEditPage.do",
				type: "POST",
				data: formData,
				processData: false,
				contentType: false,
				enctype: 'multipart/form-data',
				success:function(result) {

					var result=JSON.parse(result);

					if(result.rs == "complete") {
						alert('수정 됐습니다.');
						document.location.href = "./list.do";
					}
				}
			});
		},
		add:function() {
			
			if($("#menuName").val() == "") {
				alert('메뉴명을 입력하세요.');
				$("#menuName").focus();
				return false;
			}
			
			if($("#masterCode").val() == "") {
				alert('마스터코드를 입력하세요.');
				$("#masterCode").focus();
				return false;
			}
			
			if($("#rootUrl").val() == "") {
				alert('설정된 루트 URL을 입력하세요.');
				$("#rootUrl").focus();
				return false;
			}
			
			var formData = new FormData();
			
			formData.append("control", "addPageMaster");
			formData.append("menuName", $("#menuName").val());
			formData.append("masterCode", $("#masterCode").val());
			formData.append("rootUrl", $("#rootUrl").val());
			formData.append("type", $("input[name='codeType']:checked").val());
			formData.append("accessLevel", $("#accessLevel").val());
			formData.append("order", $("#order").val());
			
			$.ajax({
				url:"./executeAdd.do",
				type: "POST",
				data: formData,
				processData: false,
				contentType: false,
				enctype: 'multipart/form-data',
				success:function(result) {

					var result=JSON.parse(result);

					if(result.rs == "complete") {
						alert('등록 됐습니다.');
						//document.location.href = "./list.do";
						document.location.reload();
					}
				}
			});
		}
	},
	CATEGORY:{
		getSmallCategory:function(cid,mid,sid) {
			
			var formData = new FormData();
			formData.append("control", "getSmallCategory");
			formData.append("cid", cid);
			
			$.ajax({
				url:"../../product/getCategoryList.do",
				type: "POST",
				data: formData,
				processData: false,
				contentType: false,
				enctype: 'multipart/form-data',
				success:function(result){

					var result=JSON.parse(result);

					if(result.rs == "complete") {
						
						if(sid != null){
							SITE.CATEGORY.getCategory(sid);
						}else {
							//$("#selectSCate option:eq(0)").prop("selected", true);
							var node = document.getElementById(result.category.l_cate+result.category.m_cate + "_anchor");
							node.classList.add('jstree-clicked');
							$('#tree').jstree("open_node", result.category.l_cate+result.category.m_cate);
							
						}

					}
				}
			});
		},
		getMiddleCategory:function(cid, mid, sid) {
			
			$("#selectMCate").empty();
			//$("#selectSCate").empty();

			var formData = new FormData();
			formData.append("control", "getMiddleCategory");
			formData.append("cid", cid);
			$.ajax({
				url:"../../product/getCategoryList.do",
				type: "POST",
				data: formData,
				processData: false,
				contentType: false,
				enctype: 'multipart/form-data',
				success:function(result) {

					var result=JSON.parse(result);

					$("#selectMCate").empty();
					var html = "<option value='none'>카테고리 2차 분류</option>";
					$("#selectMCate").append(html);
					

					
					if(result.rs == "complete") {
												
						if(result.MIDDLE_CATEGORY.length > 0) {
							
							$.each(result.MIDDLE_CATEGORY, function(k, v) {
								var html = "";
								html += "<option value=\""+v.cid+"\">"+v.cate_nm+"</option>";
								
								$("#selectMCate").append(html);
							});
						}

						if(mid != null){
							if(sid != null){
								$("#selectMCate").val(mid).trigger('change');
							}else{
								$("#selectMCate option:eq(0)").prop("selected", true);
								SITE.CATEGORY.getSmallCategory(mid, mid, sid);
							}
						} else {
							$("#selectMCate option:eq(0)").prop("selected", true);
							
	
							var node = document.getElementById(result.category.l_cate + "_anchor");
							node.classList.add('jstree-clicked');
							$('#tree').jstree("open_node", result.category.l_cate);
							
						}
	
					}
				}
			});
		},
		getCategory:function(cid) {
				
			var formData = new FormData();
			formData.append("control", "getCategory");
			formData.append("cid", cid);
			
			$.ajax({
				url:"../../product/getCategoryList.do",
				type: "POST",
				data: formData,
				processData: false,
				contentType: false,
				enctype: 'multipart/form-data',
				success:function(result){
					var result=JSON.parse(result);
					
					var node = document.getElementById(result.category.l_cate+result.category.m_cate+result.category.s_cate + "_anchor");
					node.classList.add('jstree-clicked');
					
				}
			});
		},
		addCategory:function(){
			
			if($("#cate_name").val() == "") {
				COMMON.alert("카테고리 명을 입력하세요.","info",function(){$("#cate_name").focus();});
				return false;
			}
			
			if($("#cate_eng_name").val() == "") {
				COMMON.alert("카테고리 영문명을 입력하세요.","info",function(){$("#cate_eng_name").focus();});
				return false;
			}
			
			var selectLCate = $("select[name=selectLCate]").val();
			var selectMCate = $("select[name=selectMCate]").val();
			
			var cate_name = $("#cate_name").val();	
			var cate_eng_name = $("#cate_eng_name").val();	
			var cate_yn = $('input[name=cate_yn]:checked').val();

			
			var formData = new FormData();
			
			
			
			formData.append("selectLCate", selectLCate);
			formData.append("selectMCate", selectMCate);
			formData.append("cate_name", cate_name);
			formData.append("cate_eng_name", cate_eng_name);
			formData.append("cate_yn", cate_yn);
			
			
			$.ajax({
				url:"/admin/product/category/add.do",
				type: "POST",
				data: formData,
				processData: false,
				contentType: false,
				enctype: 'multipart/form-data',
				success:function(){
					COMMON.alert("카테고리가 등록되었습니다.","success",function(){window.location.reload();});
					
				}
			});
			
		},
		editCategory:function(cid){
			
			if($("#cate_name").val() == "") {
				COMMON.alert("카테고리 명을 입력하세요.","info",function(){$("#cate_name").focus();});
				return false;
			}
			
			if($("#cate_eng_name").val() == "") {
				COMMON.alert("카테고리 영문명을 입력하세요.","info",function(){$("#cate_eng_name").focus();});
				return false;
			}
			
			var cate_name = $("#cate_name").val();	
			var cate_eng_name = $("#cate_eng_name").val();	
			var cate_yn = $('input[name=cate_yn]:checked').val();
			
			var formData = new FormData();
			
			formData.append("cid", cid);
			formData.append("cate_name", cate_name);
			formData.append("cate_eng_name", cate_eng_name);
			formData.append("cate_yn", cate_yn);
			
			$.ajax({
				url:"/admin/product/category/edit.do",
				type: "POST",
				data: formData,
				processData: false,
				contentType: false,
				enctype: 'multipart/form-data',
				success:function(){
					COMMON.alert("카테고리가 수정되었습니다.","success",function(){window.location.reload();});
					
					
				}
			});
		}
		
	},
	BOARD:{
		bracketsAdd:function(){
			if($("#brackets").val() == "") {
				alert('말머리 입력후 추가해주세요.');
				$("#brackets").focus();
				return false;
			}
			
			var a = document.getElementsByClassName('list-group-item');
			var	index = a.length + 1;
			
			var html = '';
			html += '<li class="list-group-item"><span class="item">'+$("#brackets").val()+'</span>';
			html += '<button class="btn btn-outline-danger btn-sm delBtn" style="float:right;" onclick="javascript:SITE.BOARD.bracketsDelete('+(index-1)+')">삭제</button>';
			html += '<button class="btn btn-outline-info btn-sm text-right mr-2 editBtn" style="float:right;" onclick="javascript:SITE.BOARD.bracketsEdit('+(index-1)+')">수정</button>';
			html += '</li>';
			
			
			$("#bracketsList .list-group").append(html);
			$("#brackets").val("");
			
			
		},
		bracketsDelete:function(index){
			var dom = document.getElementsByClassName('list-group-item')[index];
			dom.remove();
			
			SITE.BOARD.bracketsSet();
		},
		bracketsEdit:function(index){
			var dom = document.getElementsByClassName('list-group-item')[index];
			$("#brackets").val(dom.querySelector(".item").innerHTML);
			
			$("#bracketsEditBtn").css('display', 'inline');
			$("#bracketsEditCancelBtn").css('display', 'inline');
			$("#bracketsAddBtn").css('display', 'none');
			
			
			var element = document.getElementById('bracketsEditBtn');
			element.setAttribute("onClick", "javascript:SITE.BOARD.bracketsUpdate("+index+")");
		},
		bracketsUpdate:function(index){
			
			if($("#brackets").val() == "") {
				alert('말머리 입력후 수정해주세요.');
				$("#brackets").focus();
				return false;
			}
			
			var dom = document.getElementsByClassName('list-group-item')[index];
			dom.querySelector(".item").innerHTML = $("#brackets").val();
			
			SITE.BOARD.bracketsEditCancel();
		},
		bracketsEditCancel:function(){
			$("#brackets").val("");
			$("#bracketsEditBtn").css('display', 'none');
			$("#bracketsEditCancelBtn").css('display', 'none');
			$("#bracketsAddBtn").css('display', 'inline');
		},
		bracketsSet:function(){
			$("#bracketsList .list-group-item").each(function(i) {
				$(this).attr("value",i + 1);
				
				var delBtn = document.getElementsByClassName('delBtn')[i];
				delBtn.setAttribute("onclick","javascript:SITE.BOARD.bracketsDelete("+i+");");
				
				var editBtn = document.getElementsByClassName('editBtn')[i];
				editBtn.setAttribute("onclick","javascript:SITE.BOARD.bracketsEdit("+i+");");
			 });
		},
		edit:function(bmid) {
		
			if($("#boardName").val() == "") {
				alert('게시판명을 입력하세요.');
				$("#boardName").focus();
				return false;
			}
			
			if($("#slug").val() == "") {
				alert('게시판 slug을 입력하세요.');
				$("#slug").focus();
				return false;
			}
			
			if($("[name=accessType]:checked").val() == 'N' && $('[name="country-of-operation-edit[]"]').val().length == 0) {
				alert('공개범위에서 전체공개를 선택하거나 공유할 그룹을 선택해주세요.');
				return false;
			}
			
			var bracketsArr = [];
			for(var i=0; i< document.getElementById("bracketsList").getElementsByTagName("li").length; i++){
				bracketsArr.push(document.getElementById("bracketsList").getElementsByClassName("item")[i].innerHTML);	
			}
			
			var formData = new FormData();
			formData.append("bmid", bmid);
			formData.append("boardName", $("#boardName").val());
			formData.append("readLevel", $("#readLevel").val());
			formData.append("writeLevel", $("#writeLevel").val());
			formData.append("comment", $("#comment").val());
			formData.append("commentLevel", $("#commentLevel").val());
			formData.append("accessLevel", $("#accessLevel").val());
			formData.append("cmt_alert", $("#cmt_alert").val());
			formData.append("reply_alert", $("#reply_alert").val());
			formData.append("slug", $("#slug").val());
			formData.append("privacy", $("[name=privacyType]:checked").val());
			
			if(bracketsArr.length > 0){
				formData.append("brackets", bracketsArr);
			}
			
			if($("[name=accessType]:checked").val() == 'N'){
				formData.append("accessGroup", ($('[name="country-of-operation-edit[]"]').val().toString()== "") ? "null" : ","+$('[name="country-of-operation-edit[]"]').val().toString()+",");
			}
			
			$.ajax({
				url:"./boardUpdate.do",
				type: "POST",
				data: formData,
				processData: false,
				contentType: false,
				enctype: 'multipart/form-data',
				success:function(result) {

					var result=JSON.parse(result);

					if(result.rs == "complete") {
						COMMON.alert("게시판이 수정 되었습니다.","success",function(){
							document.location.href = "./list.do";
						});
					}
				}
			});
		},
		add:function() {
			
			if($("#badSlug").css("display") == "inline-block") {
				alert('이미 존재하는 slug 입니다.');
				$("#slug").focus();
				return false;
			}
			
			if($("#boardName").val() == "") {
				alert('게시판명을 입력하세요.');
				$("#boardName").focus();
				return false;
			}
			if($("#slug").val() == "") {
				alert('게시판 slug을 입력하세요.');
				$("#slug").focus();
				return false;
			}
			
			if($("[name=accessType]:checked").val() == 'N' && $('[name="country-of-operation-edit[]"]').val().length == 0) {
				alert('공개범위에서 전체공개를 선택하거나 공유할 그룹을 선택해주세요.');
				return false;
			}
			
			var bracketsArr = [];
			for(var i=0; i< document.getElementById("bracketsList").getElementsByTagName("li").length; i++){
				bracketsArr.push(document.getElementById("bracketsList").getElementsByClassName("item")[i].innerHTML);	
			}
			
			
			
			var formData = new FormData();
			
			formData.append("control", "addBoardMaster");
			formData.append("boardName", $("#boardName").val());
			formData.append("readLevel", $("#readLevel").val());
			formData.append("writeLevel", $("#writeLevel").val());
			formData.append("comment", $("#comment").val());
			formData.append("commentLevel", $("#commentLevel").val());
			formData.append("accessLevel", $("#accessLevel").val());
			formData.append("cmt_alert", $("#cmt_alert").val());
			formData.append("reply_alert", $("#reply_alert").val());
			formData.append("slug", $("#slug").val());
			formData.append("privacy", $("[name=privacyType]:checked").val());
			
			
			if(bracketsArr.length > 0){
				formData.append("brackets", bracketsArr);
			}
			
			if($("[name=accessType]:checked").val() == 'N'){
				formData.append("accessGroup", ($('[name="country-of-operation-edit[]"]').val().toString()== "") ? "null" : ","+$('[name="country-of-operation-edit[]"]').val().toString()+",");
			}
			
			
			$.ajax({
				url:"./boardInsert.do",
				type: "POST",
				data: formData,
				processData: false,
				contentType: false,
				enctype: 'multipart/form-data',
				success:function(result) {

					var result=JSON.parse(result);

					if(result.rs == "complete") {
						COMMON.alert("게시판이 등록 되었습니다.","success",function(){
							document.location.href = "./list.do";
						});
					}
				}
			});
		},
		delete:function(bmid) {
			COMMON.confirm("<span style='color: #595959;'>게시판을 삭제하시겠습니까?<span>","삭제 후 복구할 수 없습니다.","info",
			function(){
				var formData = new FormData();
				formData.append("bmid", bmid);
				
				$.ajax({
					url:"./boardDelete.do",
					type: "POST",
					data: formData,
					processData: false,
					contentType: false,
					enctype: 'multipart/form-data',
					success:function(result) {
	
						var result=JSON.parse(result);
	
						if(result.rs == "complete") {
							COMMON.alert("삭제 되었습니다.","success",function(){
								document.location.href = "./list.do";
							});
						}
						
					}
				});
			},
			function(){return false;});
		}
	},
	ACCESS:{
		init:function() {
			
		}
	},
	COORD:{
		edit:function(crdid) {
			if($("#coordName").val() == "") {
				alert('좌표계명을 입력하세요.');
				$("#coordName").focus();
				return false;
			}
			
			if($("#optValue").val() == "") {
				alert('클라우드내 정의된 해당 좌표계의 옵션 번호를 입력하세요.');
				$("#optValue").focus();
				return false;
			}
			
			var formData = new FormData();
			
			formData.append("coordName", $("#coordName").val());
			formData.append("epsgCode", $("#epsgCode").val());
			formData.append("optValue", $("#optValue").val());
			formData.append("orderNo", $("#orderNo").val());
			formData.append("crdid", crdid);
			
			$.ajax({
				url:"./executeEdit.do",
				type: "POST",
				data: formData,
				processData: false,
				contentType: false,
				enctype: 'multipart/form-data',
				success:function(result) {

					var result=JSON.parse(result);

					if(result.rs == "complete") {
						alert('수정 됐습니다.');
					}
				}
			});
			
		},
		add:function() {
			if($("#coordName").val() == "") {
				alert('좌표계명을 입력하세요.');
				$("#coordName").focus();
				return false;
			}
			
			/*
			if($("#epsgCode").val() == "") {
				alert('EPSG 코드를 입력하세요.');
				$("#epsgCode").focus();
				return false;
			}
			*/
			
			if($("#optValue").val() == "") {
				alert('클라우드내 정의된 해당 좌표계의 옵션 번호를 입력하세요.');
				$("#optValue").focus();
				return false;
			}
			
			var formData = new FormData();
			
			formData.append("coordName", $("#coordName").val());
			formData.append("epsgCode", $("#epsgCode").val());
			formData.append("optValue", $("#optValue").val());
			formData.append("orderNo", $("#orderNo").val());
			
			$.ajax({
				url:"./executeAdd.do",
				type: "POST",
				data: formData,
				processData: false,
				contentType: false,
				enctype: 'multipart/form-data',
				success:function(result) {

					var result=JSON.parse(result);

					if(result.rs == "complete") {
						alert('등록 됐습니다.');
						//document.location.href = "./list.do";
						document.location.reload();
					}
				}
			});
		}
	},
	DOMAIN:{
		add:function() {

			if($("#domainHost").val() == "") {
				alert('도메인 호스트명을 입력하세요. 예)www');
				$("#domainHost").focus();
				return false;
			}

			if($("#domainUrl").val() == "") {
				alert('도메인 URL 을 입력하세요. 예)http://www.egiscloud.com');
				$("#domainUrl").focus();
				return false;
			}

			if($("#siteName").val() == "") {
				alert('브라우저 상단에 설정될 사이트명을 입력하세요');
				$("#siteName").focus();
				return false;
			}

			if($("#comName").val() == "") {
				alert('회사명을 입력하세요');
				$("#comName").focus();
				return false;
			}

			if($("#logComName").val() == "") {
				alert('로그인 화면 회사명을 입력하세요');
				$("#logComName").focus();
				return false;
			}

			if($("#logText").val() == "") {
				alert("로그인 화면 텍스트를 입력하세요.");
				$("#logText").focus();
				return false;
			}

			var formData = new FormData();
			formData.append("domainHost", $("#domainHost").val());
			formData.append("domainUrl", $("#domainUrl").val());
			formData.append("siteName", $("#siteName").val());
			formData.append("comName", $("#comName").val());
			formData.append("logComName", $("#logComName").val());
			formData.append("logText", $("#logText").val());

			formData.append("logoBatchType", $("input[name='logoBatchType']:checked").val());

			formData.append("uploadFileLeftLogo", $("#uploadFileLeftLogo")[0].files[0]);
			formData.append("uploadFileRightBottomLogo", $("#uploadFileRightBottomLogo")[0].files[0]);
			formData.append("uploadFileLoginLogo", $("#uploadFileLoginLogo")[0].files[0]);

			$.ajax({
				url:"/admin/site/domain/executeAdd.do",
				type: "POST",
				data: formData,
				processData: false,
				contentType: false,
				enctype: 'multipart/form-data',
				success:function(result) {
					var result = JSON.parse(result);
					if(result.rs == "complete") {
						alert('도메인 정보가 등록 됐습니다.')
						document.location.href = "./list.do";
					}
				}
			});
		},
		edit:function(dsid) {
			if($("#domainHost").val() == "") {
				alert('도메인 호스트명을 입력하세요. 예)www');
				$("#domainHost").focus();
				return false;
			}

			if($("#domainUrl").val() == "") {
				alert('도메인 URL 을 입력하세요. 예)http://www.egiscloud.com');
				$("#domainUrl").focus();
				return false;
			}

			if($("#siteName").val() == "") {
				alert('브라우저 상단에 설정될 사이트명을 입력하세요');
				$("#siteName").focus();
				return false;
			}

			if($("#comName").val() == "") {
				alert('회사명을 입력하세요');
				$("#comName").focus();
				return false;
			}

			if($("#logComName").val() == "") {
				alert('로그인 화면 회사명을 입력하세요');
				$("#logComName").focus();
				return false;
			}

			if($("#logText").val() == "") {
				alert("로그인 화면 텍스트를 입력하세요.");
				$("#logText").focus();
				return false;
			}

			var formData = new FormData();
			formData.append("domainHost", $("#domainHost").val());
			formData.append("domainUrl", $("#domainUrl").val());
			formData.append("siteName", $("#siteName").val());
			formData.append("comName", $("#comName").val());
			formData.append("logComName", $("#logComName").val());
			formData.append("logText", $("#logText").val());

			formData.append("logoBatchType", $("input[name='logoBatchType']:checked").val());

			formData.append("uploadFileLeftLogo", $("#uploadFileLeftLogo")[0].files[0]);
			formData.append("uploadFileRightBottomLogo", $("#uploadFileRightBottomLogo")[0].files[0]);
			formData.append("uploadFileLoginLogo", $("#uploadFileLoginLogo")[0].files[0]);
			formData.append("state", $("#domainSetupState").val());
			formData.append("dsid", dsid);

			$.ajax({
				url:"/admin/site/domain/executeEdit.do",
				type: "POST",
				data: formData,
				processData: false,
				contentType: false,
				enctype: 'multipart/form-data',
				success:function(result) {
					var result = JSON.parse(result);
					if(result.rs == "complete") {
						alert('도메인 정보가 수정 됐습니다.')
						document.location.href = "./list.do";
					}
				}
			});
		},
		executeDelete:function(dsid) {
			if(!confirm('정말 삭제 하시겠습니까?')) {
				return false;
			}

			var formData = new FormData();
			formData.append("dsid", dsid);

			$.ajax({
				url:"/admin/site/domain/executeDelete.do",
				type: "POST",
				data: formData,
				processData: false,
				contentType: false,
				enctype: 'multipart/form-data',
				success:function(result) {
					var result = JSON.parse(result);
					if(result.rs == "complete") {
						alert('해당 도메인이 삭제 됐습니다.')
						document.location.reload();
					}
				}
			});
		},
		deleteImage:function(dsid, logo) {
			if(!confirm('해당 이미지를 삭제하시겠습니까?')) {
				return false;
			}

			var formData = new FormData();
			formData.append("dsid", dsid);
			formData.append("logo", logo);

			$.ajax({
				url:"/admin/site/domain/executeDeleteLogoImage.do",
				type: "POST",
				data: formData,
				processData: false,
				contentType: false,
				enctype: 'multipart/form-data',
				success:function(result) {
					var result = JSON.parse(result);
					if(result.rs == "complete") {
						alert('해당 이미지가 삭제 됐습니다.')
						document.location.reload();
					}
				}
			});
		},
		executeModify:function(dsid) {
			
		}
	},
	BACKUP:{
		selectMeberMid:null,
		addBackupSetting:function() {
			var formData = new FormData();
			formData.append("mid", SITE.BACKUP.selectMemberMid);
			formData.append("isAppDataBackup", $("input[name=isAppDataBackup]:checked").val());
			formData.append("isMapDataBackup", $("input[name=isMapDataBackup]:checked").val());
			formData.append("isUserModelBackup", $("input[name=isUserModelBackup]:checked").val());
			formData.append("isWindDataBackup", $("input[name=isWindDataBackup]:checked").val());
			formData.append("backupSettingLevel", $("#backupSettingLevel").val());
			formData.append("backupSettingState", $("#backupSettingState").val());

			$.ajax({
				url:"/admin/site/backup/executeAddBackupSetting.do",
				type: "POST",
				data: formData,
				processData: false,
				contentType: false,
				enctype: 'multipart/form-data',
				success:function(result) {
					var result = JSON.parse(result);
					switch(result.rs) {
						case "complete" :
							alert('백업 설정이 등록 됐습니다');
							document.location.href = "/admin/site/backup/list.do";
						break;
						
						default :

						break;
					}
				}
			});
		},
		updateBackupSetting:function(bid) {

			var formData = new FormData();

			formData.append("bid", bid);
			formData.append("isAppDataBackup", $("input[name=isAppDataBackup]:checked").val());
			formData.append("isMapDataBackup", $("input[name=isMapDataBackup]:checked").val());
			formData.append("isUserModelBackup", $("input[name=isUserModelBackup]:checked").val());
			formData.append("isWindDataBackup", $("input[name=isWindDataBackup]:checked").val());
			formData.append("backupSettingLevel", $("#backupSettingLevel").val());
			formData.append("backupSettingState", $("#backupSettingState").val());

			$.ajax({
				url:"/admin/site/backup/executeUpdateBackupSetting.do",
				type: "POST",
				data: formData,
				processData: false,
				contentType: false,
				enctype: 'multipart/form-data',
				success:function(result) {
					var result = JSON.parse(result);
					switch(result.rs) {
						case "complete" :
							alert('백업 설정이 업데이트 됐습니다');
							document.location.reload();
						break;
						
						default :

						break;
					}
				}
			});
		},
		deleteBackupSetting:function(bid) {
			if(!confirm('백업 설정을 삭제하시겠습니까? 삭제된 설정은 백업을 하지 않습니다.')) {
				return false;
			}

			var formData = new FormData();
			formData.append("bid", bid);

			$.ajax({
				url:"/admin/site/backup/executeMemberBackupSetting.do",
				type: "POST",
				data: formData,
				processData: false,
				contentType: false,
				enctype: 'multipart/form-data',
				success:function(result) {
					var result = JSON.parse(result);
					switch(result.rs) {
						case "complete" :
							document.location.reload();
						break;
					}
				}
			});
		},
		loadMemberBackupSetting:function(mid) {

			SITE.BACKUP.selectMemberMid = mid;

			var formData = new FormData();
			formData.append("mid", mid);

			$.ajax({
				url:"/admin/site/backup/executeLoadMemberSetting.do",
				type: "POST",
				data: formData,
				processData: false,
				contentType: false,
				enctype: 'multipart/form-data',
				success:function(result) {
					var result = JSON.parse(result);
					switch(result.rs) {
						case "complete" :
							$("#backupSettingResultForm").css("display", "block");
						break;

						case "NO_DATA" :
							$("#backupSettingResultForm").css("display", "block");
							$("#backupSettingResultText").html("해당 회원의 백업 설정 정보가 없습니다. 백업을 게시할 경우 아래 설정을 등록하세요.");
						break;

						default :
							
						break;
					}
				}
			});
		},
		searchMember:function() {
			if($("#memberSearchText").val() == "") {
				alert('회원 검색 키워드를 입력하세요.');
				$("#memberSearchText").focus();
				return false;
			}

			var formData = new FormData();

			formData.append("memberSearchOption", $("#memberSearchOption").val());
			formData.append("memberSearchText", $("#memberSearchText").val());

			$.ajax({
				url:"/admin/site/backup/executeMemberSearch.do",
				type: "POST",
				data: formData,
				processData: false,
				contentType: false,
				enctype: 'multipart/form-data',
				success:function(result) {
					var result = JSON.parse(result);
					if(result.rs == "complete") {
						
						console.log(result);

						if(result.memberList.length > 0) {
							$("#memberSearchResultSelect").empty();
							$("#memberSearchResultSelect").append("<option value=\"\">회원선택("+result.memberList.length+")</option>");
							$.each(result.memberList, function(k, v) {
								var html = "";
								html = "<option value=\""+v.mid+"\">"+v.mem_name+"("+v.mem_id+")</option>";
								$("#memberSearchResultSelect").append(html);
							});
						}
					}
				}
			});
		}
	}
}

$("#memberSearchText").on("keyup",function(e) {
	//console.log(e);
	if(e.key == "Enter") {
		SITE.BACKUP.searchMember();
	}
});

$("#memberSearchResultSelect").on("change", function(e) {
	if(e.target.value != "") {
		SITE.BACKUP.loadMemberBackupSetting(e.target.value);
	}
});