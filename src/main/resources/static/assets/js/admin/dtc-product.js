/**
 * 
 */
var PRODUCT = {
	editor:null,
	editor2:null,
	checkDataTable:null,
	init:function() {
		$("#getComInfo").on("click",function(){
			PRODUCT.getComInfo();
		});
	},
	listInit:function() {
		PRODUCT.checkDataTable = $('#checkRequstList').DataTable({
			"bLengthChange": false,
			"bInfo": false,
			"columns" : [
    		    { "width": "5%", "orderable": false },
    		    { "width": "10%", "orderable": false },
    		    { "width": "10%"},
    		    { "width": "10%", "orderable": false },
    		    { "width": "10%", "orderable": false },
    		    { "width": "10%", "orderable": false },
    		    { "width": "13%", "orderable": false },
				]
		});
		
	},
	buyProduct:function(pid) {
		var formData = new FormData();
		formData.append("pid", pid);
		
		$.ajax({
			url:"/desk/store/buyProductInfo.do",
			type: "POST",
			data: formData,
			processData: false,
			contentType: false,
			enctype: 'multipart/form-data',
			success:function(result) {
				var result=JSON.parse(result);
				if(result.productInfo != null){
					$(".paymentProductPrice").text(result.productInfo.price.toLocaleString('ko-KR')+"원");
					$("#paymentProductPrice").attr("value",result.productInfo.price);
					$("#paymentProductName").text(result.productInfo.name);
					$("#paymentProductId").val(pid);
					$("#checkPaymentModal").modal("show");
				}else{
					COMMON.alert("구매할 수 없습니다\n관리자에게 문의하십시오.","error",function(){return false;});
				}
			}
		});
	},
	getComInfo:function(){
		$.ajax({
			url:"/admin/site/collaboration/getComInfo.do",
			type: "POST",
			success:function(result) {
				var result=JSON.parse(result);
				if(result.developerInfo != null){
					var developerInfo = result.developerInfo;
					$("#com_name").val(developerInfo.com_name);
					$("#com_tel").val(developerInfo.com_tel);
					$("#com_email").val(developerInfo.com_email);
					$("#com_homepage").val(developerInfo.com_homepage);
				}else{
					COMMON.alert("등록된 개발사 정보가 없습니다.","error",function(){return false;});
				}

			}
		});
	},
	checkRequestModal:function(){
		$("#checkRequstModal").modal({backdrop:'static'});

		$.ajax({
			url:"./getCheckRequstList.do",
			type: "POST",
			success:function(result) {
				var result=JSON.parse(result);
				var html = "";
				if(result.rs == "complete"){
					var productList = result.product_list;
					for(var i=0;i<productList.length;i++){
						var product = productList[i];
						html += "<tr>";
						html += "<td></td>";
						html += "<td><input type='hidden' id='checkRequstListModule_"+product.MDID+"' value='"+product.MODULE_OBJ+"'>"+product.NAME+"</td>";
						html += "<td>"+product.CATE_NM+"</td>";
						html += "<td>"+product.MEM_ID+"</td>";
						html += "<td><a href='javascript:window.open(\"./editProduct.do?pid="+product.PID+"&edit=N\",\""+product.NAME+"\",\"width=950,height=750,location=no,status=no,scrollbars=yes\");' class='btn btn-sm btn-info'>열기</a></td>";
						html += "<td><a href='javascript:PRODUCT.prewViewFile("+product.MDID+","+product.DESIGN_TYPE+");' class='btn btn-sm btn-info'>열기</a></td>";
						html += "<td><a href='javascript:PRODUCT.checkRequestConfirm("+product.PID+",1)' class='btn btn-sm btn-success'>승인</a>";
						html += "<a href='javascript:PRODUCT.checkRequestConfirm("+product.PID+",2)' class='btn btn-sm btn-danger ml-1'>반려</a></td>";
						html += "</tr>";
					}
				}
				$("#checkRequstList tbody").html(html);
				if(PRODUCT.checkDataTable == null){
					PRODUCT.listInit();
				}
				PRODUCT.checkDataTable.on( 'order.dt search.dt', function () {
					PRODUCT.checkDataTable.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
			            cell.innerHTML = i+1;
			        } );
			    } ).draw();
			}
		});
	},
	checkRequestConfirm:function(pid,type){
		var text = "";
		var subtext = "";
		if(type == 1){
			text = '<span style="color: #595959;">승인하시겠습니까?</span>';
		}else{
			text = '<span style="color: #595959;">반려하시겠습니까?</span>';
		}
		COMMON.confirm(text,subtext
				,"info"
				,function(){

					var formData = new FormData();
					formData.append("control", "checkRequest");
					formData.append("pid", pid);
					formData.append("type", type);
					
					$.ajax({
						url:"./checkRequest.do",
						type: "POST",
						data: formData,
						processData: false,
						contentType: false,
						success:function(result) {
							var result=JSON.parse(result);
							if(type == 1){
								LOG_TRACKER.write("103","2","APP 승인:{PID:"+pid+"}");
								text = "승인되었습니다.";
							}else{
								LOG_TRACKER.write("103","2","APP 반려:{PID:"+pid+"}");
								text = "반려되었습니다.";
							}
							COMMON.alert(text,"success",function(){location.reload();});
						}
					});

				},
				function(){return false;});
	},
	checkRequest:function(pid,type){
		var text = "";
		var subtext = "";
		if(type == 3){
			text = '<span style="color: #595959;">검수요청하시겠습니까?</span><br><span class="text-secondary ts-9">* 검수 요청 후에는 수정할 수 없습니다.</span>';
		}else{
			text = '<span style="color: #595959;">검수 요청을 취소하시겠습니까?</span>';
		}
		COMMON.confirm(text,subtext
				,"info"
				,function(){

					var formData = new FormData();
					formData.append("control", "deleteProductItem");
					formData.append("pid", pid);
					formData.append("type", type);
					
					$.ajax({
						url:"./checkRequest.do",
						type: "POST",
						data: formData,
						processData: false,
						contentType: false,
						success:function(result) {
							var result=JSON.parse(result);
							if(type == 3){
								LOG_TRACKER.write("102","2","APP 검수 요청:{PID:"+pid+"}");
								text = "검수 요청되었습니다.";
							}else{
								LOG_TRACKER.write("102","2","APP 검수 요청 취소:{PID:"+pid+"}");
								text = "검수 요청이 취소되었습니다.";
							}
							COMMON.alert(text,"success",function(){location.reload();});
						}
					});

				},
				function(){return false;});
	},
	prewViewFile:function(mdid, design_type){
		var module_obj = $("#checkRequstListModule_"+mdid).val();
		
		$("#modals-preView").modal({backdrop:'static'});

		if($("#prevIframe").contents().find("#htmlPrev").length){
			$("#prevIframe").contents().find("#htmlPrev").remove();
		}
		
		if($("#prevIframe").contents().find("#cssPrivew").length){
			$("#prevIframe").contents().find("#cssPrivew").remove();
		}
		
		if($("#prevIframe").contents().find("#previewJs").length){
			$("#prevIframe").contents().find("#previewJs").remove();
		}
		
		if($("#prevIframe").contents().find("previewLib").length){
			$("#prevIframe").contents().find("previewLib").remove();
		}
			
		var formData = new FormData();
		formData.append("mdid", mdid);			
		
		//css
		$.ajax({
				url:"/admin/module/fileCss.do",
				type: "POST",
				data: formData,
				processData: false,
				contentType: false,
				enctype: 'multipart/form-data',
				success:function(result) {
					var htmlCss ="<style id=\"cssPrivew\">"+result+"</style>";
					$("#prevIframe").contents().find("head").append(htmlCss);

				}
		});
		//html
		$.ajax({
			url:"/admin/module/fileHtml.do",
			type: "POST",
			data: formData,
			processData: false,
			contentType: false,
			enctype: 'multipart/form-data',
			success:function(result) {
			
				var htmls="<div id=\"htmlPrev\">"+result+"</div>";
				$("#prevIframe").contents().find("#moduleUITabContent").append(htmls);

			}
		});
		//js
		
		$.ajax({
			url:"/admin/module/fileJs.do",
			type: "POST",
			data: formData,
			processData: false,
			contentType: false,
			enctype: 'multipart/form-data',
			success:function(result) {
				var htmlJs ="<script id=\"previewJs\">"+result+"</script>";
				$("#prevIframe").contents().find("body").append(htmlJs);
			}
		});
		//lib
		
		$.ajax({
			url:"/admin/module/fileLib.do",
			type: "POST",
			data: formData,
			processData: false,
			contentType: false,
			enctype: 'multipart/form-data',
			success:function(result) {
				var htmlLib ="<script id=\"previewLib\">"+result+"</script>";
				
				$("#prevIframe").contents().find("body").append(htmlLib);
			}
		});
		
		if(design_type == 0) {
			// 가로 하단
			document.getElementById('prevIframe').contentWindow.document.getElementById("toolAre2").style.right = "0px";
		} else if(design_type == 1) {
			// 우측 소
			document.getElementById('prevIframe').contentWindow.document.getElementById("toolAre2").style.right = "365px";
		} else {
			// 우측 중
			$("#toolAre2").css('right','575px');
			document.getElementById('prevIframe').contentWindow.document.getElementById("toolAre2").style.right = "575px";
		} 
		
		setTimeout(function(){
			$("#prevIframe").get(0).contentWindow.eval(module_obj).init();
		},100);
		
	},
	DELETE:{
		deleteItem:function(pid) {
			if(!confirm('정말 삭제하시겠습니까?')) {
				return false;
			}
			
			var formData = new FormData();
			formData.append("control", "deleteProductItem");
			formData.append("pid", pid)
			
			$.ajax({
				url:"./deleteProduct.do",
				type: "POST",
				data: formData,
				processData: false,
				contentType: false,
				enctype: 'multipart/form-data',
				success:function(result) {

					var result=JSON.parse(result);

					if(result.rs == "complete") {
						LOG_TRACKER.write("104","2","APP 삭제:{PID:"+pid+"}");
						alert('삭제 됐습니다.');
						document.location.href = "./main.do";
					}
				}
			});
			
		}
	},
	UPDATE:{
		
		update:function(pid) {
			// PRODUCT.INSERT.editor.getData();

			if($("#productState").val() == "3") {
				COMMON.alert("검수요청 후에는 수정할 수 없습니다.","error",function(){return false;});
				return false;
			}
			
			if($("#productName").val() == "") {
				alert('상품명을 입력하세요.');
				$("#productName").focus();
				return false;
			}
			
			
			if($("#productSelectModule1").val() == "") {
				alert('1차분류를 선택하세요.');
				$("#productSelectModule1").focus();
				
				return false;
			}
			
			if($("#productSelectModule1").val() != "" && PRODUCT.CATEGORY.ml != 0 && $("#productSelectModule2").val() == "") {
				alert('2차분류를 선택하세요.');
				$("#productSelectModule2").focus();
				
				return false;
			}
			
			if($("#productSelectModule1").val() != "" && $("#productSelectModule2").val() != "" && PRODUCT.CATEGORY.sl != 0 && $("#productSelectModule3").val() == "") {
				alert("3차분류를 선택하세요.");
				$("#productSelectModule3").focus();
				
				return false;
			}
			
			if($("#productPrice").val() == "") {
				alert('앱 가격을 입력하세요.');
				$("#productPrice").focus();
				
				return false;
			}
			
			if(PRODUCT.editor.getData() == "") {
				alert('앱 설명을 입력하세요.');				
				return false;
			}
			
			var formData = new FormData();
			
			formData.append("control", "updateProduct");
			formData.append("pid", pid);
			formData.append("mdid", $("#productSelectDevModule").val());
			formData.append("product_name", $("#productName").val());
			formData.append("product_eng_name", ($("#productEngName").val() == "") ? "null" : $("#productEngName").val());
			formData.append("l_cate", ($("#productSelectModule1").val() == "") ? "null" : $("#productSelectModule1").val());
			formData.append("m_cate", ($("#productSelectModule2").val() == "") ? "null" : $("#productSelectModule2").val());
			formData.append("s_cate", ($("#productSelectModule3").val() == "") ? "null" : $("#productSelectModule3").val());
			formData.append("product_price", $("#productPrice").val());
			formData.append("state", $("#productState").val());
			formData.append("sort", $("#productSort").val());
			formData.append("share_type", $("[name=productShareType]:checked").val());

			formData.append("video_url", ($("#productVideo").val() == "") ? "null" : $("#productVideo").val());

			formData.append("product_detail", PRODUCT.editor.getData() );
			formData.append("product_eng_detail", (PRODUCT.engEditor.getData() == "") ? "null" : PRODUCT.engEditor.getData() );
			formData.append("product_detail_spec", (PRODUCT.editor2.getData() == "") ? "null" : PRODUCT.editor2.getData());

			formData.append("thumb", $("#prodeuctThumbnail")[0].files[0]);
			formData.append("sc_1", $("#prodeuctScreenshot_1")[0].files[0]);
			formData.append("sc_2", $("#prodeuctScreenshot_2")[0].files[0]);
			formData.append("sc_3", $("#prodeuctScreenshot_3")[0].files[0]);
			formData.append("sc_4", $("#prodeuctScreenshot_4")[0].files[0]);
			formData.append("sc_5", $("#prodeuctScreenshot_5")[0].files[0]);
			formData.append("sc_6", $("#prodeuctScreenshot_6")[0].files[0]);
			

			formData.append("com_name", ($("#com_name").val() == "") ? "null" : $("#com_name").val());
			formData.append("com_logo_url", ($("#com_logo_url").val() == "") ? "null" : $("#com_logo_url").val());
			formData.append("com_tel", ($("#com_tel").val() == "") ? "null" : $("#com_tel").val());
			formData.append("com_email", ($("#com_email").val() == "") ? "null" : $("#com_email").val());
			formData.append("com_homepage", ($("#com_homepage").val() == "") ? "null" : $("#com_homepage").val());
			
			$.ajax({
				url:"./updateProduct.do",
				type: "POST",
				data: formData,
				processData: false,
				contentType: false,
				enctype: 'multipart/form-data',
				success:function(result) {

					var result=JSON.parse(result);

					if(result.rs == "complete") {
						LOG_TRACKER.write("101","2","APP 수정:{PID:"+pid+"}");
						COMMON.alert("변경되었습니다.","success",function(){return false;});
					}else if(result.rs == "sharefail") {
						COMMON.alert("공유할 그룹이 설정되지않았습니다.","error",function(){return false;});
					}
				}
			});
			
			
		} // End of Update
	},
	INSERT:{
		editContent:null,
		editor:null,
		add:function() {
			
			// $('#productComment').markdown({
			
			
			if($("#productName").val() == "") {
				alert('상품명을 입력하세요.');
				$("#productName").focus();
				return false;
			}
			
			
			if($("#productSelectModule1").val() == "") {
				alert('1차분류 모듈을 선택하세요.');
				$("#productSelectModule1").focus();
				
				return false;
			}
			
			if($("#productSelectModule1").val() != "" && PRODUCT.CATEGORY.ml != 0 && $("#productSelectModule2").val() == "") {
				alert('2차분류 모듈을 선택하세요.');
				$("#productSelectModule2").focus();
				
				return false;
			}
			
			if($("#productSelectModule1").val() != "" && $("#productSelectModule2").val() != "" && PRODUCT.CATEGORY.sl != 0 && $("#productSelectModule3").val() == "") {
				alert("3차 분류 모듈을 선택하세요.");
				$("#productSelectModule3").focus();
				
				return false;
			}
			if($("#productPrice").val() == "") {
				alert('앱 가격을 입력하세요.');
				$("#productPrice").focus();
				
				return false;
			}
			
			if(PRODUCT.editor.getData() == "") {
				alert('앱 설명을 입력하세요.');				
				return false;
			}
			
			var formData = new FormData();
			
			formData.append("control", "addProduct");
			formData.append("product_name", $("#productName").val());
			formData.append("product_eng_name", ($("#productEngName").val() == "") ? "null" : $("#productEngName").val());
			formData.append("mdid", $("#productSelectDevModule").val());
			formData.append("l_cate", ($("#productSelectModule1").val() == "") ? "null" : $("#productSelectModule1").val());
			formData.append("m_cate", ($("#productSelectModule2").val() == "") ? "null" : $("#productSelectModule2").val());
			formData.append("s_cate", ($("#productSelectModule3").val() == "") ? "null" : $("#productSelectModule3").val());
			formData.append("product_price", $("#productPrice").val());
			formData.append("state", $("#productState").val());
			formData.append("sort", $("#productSort").val());
			formData.append("share_type", $("[name=productShareType]:checked").val());

			formData.append("video_url", ($("#productVideo").val() == "") ? "null" : $("#productVideo").val());

			formData.append("product_detail", PRODUCT.editor.getData() );
			
			//formData.append("product_detail_spec", PRODUCT.editor2.getData() );
			formData.append("product_eng_detail", (PRODUCT.engEditor.getData() == "") ? "null" : PRODUCT.engEditor.getData() );
			formData.append("product_detail_spec", (PRODUCT.editor2.getData() == "") ? "null" : PRODUCT.editor2.getData());

			formData.append("thumb", $("#prodeuctThumbnail")[0].files[0]);
			formData.append("sc_1", $("#prodeuctScreenshot_1")[0].files[0]);
			formData.append("sc_2", $("#prodeuctScreenshot_2")[0].files[0]);
			formData.append("sc_3", $("#prodeuctScreenshot_3")[0].files[0]);
			formData.append("sc_4", $("#prodeuctScreenshot_4")[0].files[0]);
			formData.append("sc_5", $("#prodeuctScreenshot_5")[0].files[0]);
			formData.append("sc_6", $("#prodeuctScreenshot_6")[0].files[0]);
			
			formData.append("com_name", ($("#com_name").val() == "") ? "null" : $("#com_name").val());
			formData.append("com_logo_url", ($("#com_logo_url").val() == "") ? "null" : $("#com_logo_url").val());
			formData.append("com_tel", ($("#com_tel").val() == "") ? "null" : $("#com_tel").val());
			formData.append("com_email", ($("#com_email").val() == "") ? "null" : $("#com_email").val());
			formData.append("com_homepage", ($("#com_homepage").val() == "") ? "null" : $("#com_homepage").val());

			$.ajax({
				url:"./addProduct.do",
				type: "POST",
				data: formData,
				processData: false,
				contentType: false,
				enctype: 'multipart/form-data',
				success:function(result) {

					var result=JSON.parse(result);

					if(result.rs == "complete") {
						LOG_TRACKER.write("100","2","APP 생성:{PID:"+result.pid+"}");
						COMMON.alert("상품이 등록되었습니다.","success",function(){
							document.location.href = "./main.do";
						});
					}else if(result.rs == "sharefail") {
						COMMON.alert("공유할 그룹이 설정되지않았습니다.","error",function(){return false;});
					}
				}
			});
		}// End of Insert
		
	},
	CATEGORY:{
		fl:0,
		ml:0,
		sl:0,
		obj:null,
		setLargeCagetory:function() {
			var formData = new FormData();
			formData.append("control", "getLargeCategory");

			$.ajax({
				url:"./getCategoryList.do",
				type: "POST",
				data: formData,
				processData: false,
				contentType: false,
				enctype: 'multipart/form-data',
				success:function(result){

					var result=JSON.parse(result);

					if(result.rs == "complete") {
						
						$.each(result.LARGE_CATEGORY, function(k, v) {
							var html = "";
							var selected = "";
							
							if(v.l_cate == PRODUCT.CATEGORY.obj.l_cate) {
								selected = " selected";
							}
							
							html += "<option value=\""+v.cid+"\""+selected+">"+v.cate_nm+"</option>";
							
							$("#productSelectModule1").append(html);
						});
						
						if(PRODUCT.CATEGORY.obj.m_cate != "") {
							PRODUCT.CATEGORY.setMiddleCategory(PRODUCT.CATEGORY.obj.cid);
						}
					}
				}
			});
		},
		setMiddleCategory:function(cid) {
			var formData = new FormData();
			formData.append("control", "getMiddleCategory");
			formData.append("cid", cid);
			
			$.ajax({
				url:"./getCategoryList.do",
				type: "POST",
				data: formData,
				processData: false,
				contentType: false,
				enctype: 'multipart/form-data',
				success:function(result){

					var result=JSON.parse(result);

					$("#productSelectModule2").empty();
					var html = "<option value=\"\">모듈선택 2차 분류</option>";
					$("#productSelectModule2").append(html);
					$("#productSelectModule2Wrap").css("display", "none");
					
					if(result.rs == "complete") {
						PRODUCT.CATEGORY.ml = result.MIDDLE_CATEGORY.length;
						
						if(result.MIDDLE_CATEGORY.length > 0) {
							$("#productSelectModule2Wrap").css("display", "");
							
							$.each(result.MIDDLE_CATEGORY, function(k, v) {
								var html = "";
								var selected = "";

								if(v.m_cate == PRODUCT.CATEGORY.obj.m_cate) {
									selected = " selected";
								}
								
								html += "<option value=\""+v.cid+"\""+selected+">"+v.cate_nm+"</option>";
								
								$("#productSelectModule2").append(html);
							});
						}
						
						if(PRODUCT.CATEGORY.obj.s_cate != "") {
							PRODUCT.CATEGORY.setSmallCategory(PRODUCT.CATEGORY.obj.cid);
						}
					}
				}
			});
		},
		setSmallCategory:function(cid) {
			var formData = new FormData();
			formData.append("control", "getSmallCategory");
			formData.append("cid", cid);
			
			$.ajax({
				url:"./getCategoryList.do",
				type: "POST",
				data: formData,
				processData: false,
				contentType: false,
				enctype: 'multipart/form-data',
				success:function(result){

					var result=JSON.parse(result);

					$("#productSelectModule3").empty();
					var html = "<option value=\"\">모듈선택 3차 분류</option>";
					$("#productSelectModule3").append(html);
					$("#productSelectModule3Wrap").css("display", "none");
					
					if(result.rs == "complete") {
						PRODUCT.CATEGORY.sl = result.SMALL_CATEGORY.length;
						
						if(result.SMALL_CATEGORY.length > 0) {
							$("#productSelectModule3Wrap").css("display", "");

							$.each(result.SMALL_CATEGORY, function(k, v) {
								var html = "";
								
								var selected = "";

								if(v.s_cate == PRODUCT.CATEGORY.obj.s_cate) {
									selected = " selected";
								}
								
								html += "<option value=\""+v.cid+"\""+selected+">"+v.cate_nm+"</option>";
								
								$("#productSelectModule3").append(html);
							});
						}
					}
				}
			});
		},
		getLargeCategory:function() {
			
			var formData = new FormData();
			formData.append("control", "getLargeCategory");

			$.ajax({
				url:"./getCategoryList.do",
				type: "POST",
				data: formData,
				processData: false,
				contentType: false,
				enctype: 'multipart/form-data',
				success:function(result){

					var result=JSON.parse(result);

					if(result.rs == "complete") {
						
						$.each(result.LARGE_CATEGORY, function(k, v) {
							var html = "";
						
							html += "<option value=\""+v.cid+"\">"+v.cate_nm+"</option>";
							
							$("#productSelectModule1").append(html);
						});
					}
				}
			});
		},
		getMiddleCategory:function(cid) {
			var formData = new FormData();
			formData.append("control", "getMiddleCategory");
			formData.append("cid", cid);
			
			$.ajax({
				url:"./getCategoryList.do",
				type: "POST",
				data: formData,
				processData: false,
				contentType: false,
				enctype: 'multipart/form-data',
				success:function(result){

					var result=JSON.parse(result);

					$("#productSelectModule2").empty();
					var html = "<option value=\"\">모듈선택 2차 분류</option>";
					$("#productSelectModule2").append(html);
					$("#productSelectModule2Wrap").css("display", "none");
					
					if(result.rs == "complete") {
						PRODUCT.CATEGORY.ml = result.MIDDLE_CATEGORY.length;
						
						if(result.MIDDLE_CATEGORY.length > 0) {
							$("#productSelectModule2Wrap").css("display", "");
							
							$.each(result.MIDDLE_CATEGORY, function(k, v) {
								var html = "";
								html += "<option value=\""+v.cid+"\">"+v.cate_nm+"</option>";
								
								$("#productSelectModule2").append(html);
							});
						}
						
						
					}
				}
			});
		},
		getSmallCategory:function(cid) {
			var formData = new FormData();
			formData.append("control", "getSmallCategory");
			formData.append("cid", cid);
			
			$.ajax({
				url:"./getCategoryList.do",
				type: "POST",
				data: formData,
				processData: false,
				contentType: false,
				enctype: 'multipart/form-data',
				success:function(result){

					var result=JSON.parse(result);

					$("#productSelectModule3").empty();
					var html = "<option value=\"\">모듈선택 3차 분류</option>";
					$("#productSelectModule3").append(html);
					$("#productSelectModule3Wrap").css("display", "none");
					
					if(result.rs == "complete") {
						PRODUCT.CATEGORY.sl = result.SMALL_CATEGORY.length;
						
						if(result.SMALL_CATEGORY.length > 0) {
							$("#productSelectModule3Wrap").css("display", "");

							$.each(result.SMALL_CATEGORY, function(k, v) {
								var html = "";
								html += "<option value=\""+v.cid+"\">"+v.cate_nm+"</option>";
								
								$("#productSelectModule3").append(html);
							});
						}
					}
				}
			});
		}
	} // End of Category
}
