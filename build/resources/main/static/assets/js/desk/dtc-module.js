/**
 *파일명:dtc-product.js
 *주제:상품 등록
 *작성자:smd 
 */

var MODULE = {
	dataTable : null,
	init:function() {
		MODULE.dataTable = $('#moduleList').DataTable( {
			"columns": [
    		    { "width": "5%", "orderable": false },
    		    { "width": "5%"},
    		    { "width": "15%"},
    		    { "width": "15%"},
    		    { "width": "5%"},
    		    { "width": "10%"},
    		    { "width": "10%" },
    		    { "width": "5%", "orderable": false },
    		    { "width": "6%", "orderable": false }
    		  ],
	        "order": [[ 4, 'desc' ]]
	    } );
	 
		MODULE.dataTable.on( 'order.dt search.dt', function () {
			MODULE.dataTable.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
	            cell.innerHTML = i+1;
	        } );
	    } ).draw();
	},
	CATEGORY:{
		getSmallCategory:function(obj) {
			var cid = obj.value;
			
			var formData = new FormData();
			formData.append("control", "getSmallCategory");
			formData.append("cid", cid);
			
			$.ajax({
				url:"/desk/developer/getCategoryList.do",
				type: "POST",
				data: formData,
				processData: false,
				contentType: false,
				enctype: 'multipart/form-data',
				success:function(result){

					var result=JSON.parse(result);

					$("#selectSCate").empty();
					var html = "<option value=\"\">모듈선택 3차 분류</option>";
					$("#selectSCate").append(html);
					
					if(result.rs == "complete") {
						
						if(result.SMALL_CATEGORY.length > 0) {

							$.each(result.SMALL_CATEGORY, function(k, v) {
								var html = "";
								html += "<option value=\""+v.cid+"\">"+v.cate_nm+"</option>";
								
								$("#selectSCate").append(html);
							});
						}
					}
				}
			});
		},
		getMiddleCategory:function(obj) {
			
			$("#selectMCate").empty();
			$("#selectSCate").empty();
			
			//console.log($("#selectMCate"));
			
			var cid = obj.value;
			
			var formData = new FormData();
			formData.append("control", "getMiddleCategory");
			formData.append("cid", cid);
			$.ajax({
				url:"/desk/developer/getCategoryList.do",
				type: "POST",
				data: formData,
				processData: false,
				contentType: false,
				enctype: 'multipart/form-data',
				success:function(result) {

					var result=JSON.parse(result);

					$("#selectMCate").empty();
					var html = "<option value=\"\">모듈선택 2차 분류</option>";
					$("#selectMCate").append(html);
					
					$("#selectSCate").empty();
					var html = "<option value=\"\">모듈선택 3차 분류</option>";
					$("#selectSCate").append(html);
					
					if(result.rs == "complete") {
						//PRODUCT.CATEGORY.ml = result.MIDDLE_CATEGORY.length;
						
						if(result.MIDDLE_CATEGORY.length > 0) {
							
							$.each(result.MIDDLE_CATEGORY, function(k, v) {
								var html = "";
								html += "<option value=\""+v.cid+"\">"+v.cate_nm+"</option>";
								
								$("#selectMCate").append(html);
							});
						}
	
					}
				}
			});
		}
	},
	edit:function(mdid) {
		
		if(!MODULE.checkData(mdid)){
			return false;
		}
		
		var formData = new FormData();
		
		formData.append("mdid", mdid);
		formData.append("l_cid", ($("#selectLCate").val() == "") ? "null" : $("#selectLCate").val());
		formData.append("m_cid", ($("#selectMCate").val() == "") ? "null" : $("#selectMCate").val());
		formData.append("s_cid", ($("#selectSCate").val() == "") ? "null" : $("#selectSCate").val());
		
		formData.append("name", $("#anlysNm").val());
		formData.append("author_name", $("#authorNm").val());
		formData.append("moduleVer", $("#moduleVer").val());
		formData.append("moduleObj", $("#moduleObj").val());
		formData.append("state", $("#moduleState").val());
		
		formData.append("module_js_file", $("#uploadFileJs")[0].files[0]);
		formData.append("module_css_file", $("#uploadFileCss")[0].files[0]);
		formData.append("module_html_file", $("#uploadFileHtml")[0].files[0]);
		
		formData.append("use_ext_libs", $("input[name='useExtLibs']:checked").val());
		
		formData.append("develop_type", $("input[name='develop_type']:checked").val());
		formData.append("design_type", $("input[name='design_type']:checked").val());
		
		var extFiles = document.getElementById("uploadFileJsLib");
		
		for(var i = 0; i < extFiles.files.length; i++) {
			formData.append("module_ext_files", extFiles.files[i]);
		}
		
		$.ajax({
			url:"/desk/developer/executeEdit.do",
			type: "POST",
			data: formData,
			processData: false,
			contentType: false,
			enctype: 'multipart/form-data',
			success:function(result) {
				var result=JSON.parse(result);
				console.log(result);
				if(result.rs == "complete") {
					LOG_TRACKER.write("95","2","모듈 수정:{MDID:"+mdid+"}");
					COMMON.alert("모듈 정보가 변경 됐습니다.","success",function(){
						document.location.href = "./moduleList.do";
					});
				}
			}
		});
	},
	deleteExtFile:function(meid) {
		var text = '<span style="color: #595959;">삭제하시겠습니까?</span><br><span class="text-secondary ts-9">* 삭제 후 복구할 수 없습니다.</span>';
		var subtext = "";
		COMMON.confirm(text,subtext
			,"info"
			,function(){
				var formData = new FormData();
				formData.append("meid", meid);
				$.ajax({
					url:"/desk/developer/executeDeleteExt.do",
					type: "POST",
					data: formData,
					processData: false,
					contentType: false,
					enctype: 'multipart/form-data',
					success:function(result) {
						
						var result=JSON.parse(result);
						
						if(result.rs == "complete") {
							$("#module_ext_files_"+meid).remove();
							LOG_TRACKER.write("95","2","모듈 외부 Lib 삭제:{MDID:"+mdid+"}");
						}
					}
				});
			},
			function(){return false;});
	},
	add:function() {
		if(!MODULE.checkData()){
			return false;
		}
		var formData = new FormData();
		
		formData.append("l_cid", ($("#selectLCate").val() == "") ? "null" : $("#selectLCate").val());
		formData.append("m_cid", ($("#selectMCate").val() == "") ? "null" : $("#selectMCate").val());
		formData.append("s_cid", ($("#selectSCate").val() == "") ? "null" : $("#selectSCate").val());
		
		formData.append("module_name", $("#anlysNm").val());
		formData.append("author_name", $("#authorNm").val());
		formData.append("moduleVer", $("#moduleVer").val());
		formData.append("moduleObj", $("#moduleObj").val());
		
		formData.append("module_js_file", $("#uploadFileJs")[0].files[0]);
		formData.append("module_css_file", $("#uploadFileCss")[0].files[0]);
		formData.append("module_html_file", $("#uploadFileHtml")[0].files[0]);

		formData.append("use_ext_libs", $("input[name='useExtLibs']:checked").val());

		formData.append("develop_type", $("input[name='develop_type']:checked").val());
		formData.append("design_type", $("input[name='design_type']:checked").val());

		var extFiles = document.getElementById("uploadFileJsLib");
		
		for(var i = 0; i < extFiles.files.length; i++) {
			formData.append("module_ext_files", extFiles.files[i]);
		}
		var appObj = $('#moduleObj').val();
		var data = {
			appObj : appObj
		}
		$.ajax({
			type : "POST",
			url : "/desk/developer/appNameCheck.do",
			data : data,
			success : function(result) {
				if (result == 'success') {
					$.ajax({
						url:"/desk/developer/executeAddModule.do",
						type: "POST",
						data: formData,
						processData: false,
						contentType: false,
						enctype: 'multipart/form-data',
						success:function(result) {
							var result = JSON.parse(result);
							switch(result.rs) {
								case "complete" :
									LOG_TRACKER.write("94","2","모듈 생성:{MDID:"+result.mdid+"}");
									COMMON.alert("새로운 모듈이 등록 됐습니다.","success",function(){
										document.location.href = "./moduleList.do";
									});
								break;
							}
						}
					});
				} else {
					COMMON.alert("중복된 모듈명이 존재합니다.","error",function(){
						 $('#moduleObj').focus();
					});
				}
				
			}
		});
	},
	validateExtFiles:function(obj) {
		
		for(var i = 0;i < obj.files.length; i++) {
			
			
			var fArr = obj.files[i].name.split(".");
			
			var fileType = fArr[fArr.length - 1];
			/*	
			if(fileType != "css" && fileType != "js" ) {
				COMMON.alert("모듈 외부 라이브러리 파일은 css, js 파일만 등록 가능합니다.");
				obj.value = null;
				break;
				return false;
			}*/
		}
	},
	checkData:function(mdid = null){
		if($("#selectLCate").val() == "") {
			COMMON.alert("1차 분류를 선택하세요.","error",function(){
				$("#selectLCate").focus();
			});
			return false;
		}
		if($("#anlysNm").val() == "") {
			COMMON.alert("분석명을 입력하세요.","error",function(){
				$("#anlysNm").focus();
			});
			return false;
		}
		if($("#authorNm").val() == "") {
			COMMON.alert("엔진 담당개발자를 입력하세요.","error",function(){
				$("#authorNm").focus();
			});
			return false;
		}
		if($("#moduleObj").val() == "") {
			COMMON.alert("모듈명을 입력하세요.","error",function(){
				$("#moduleObj").focus();
			});
			return false;
		}
		if(mdid == null){
			if($("#uploadFileCss")[0].files.length == 0) {
				COMMON.alert("CSS 파일이 선택되지않았습니다.","error",function(){
				});
				return false;
			}
			if($("#uploadFileHtml")[0].files.length == 0) {
				COMMON.alert("HTML 파일이 선택되지않았습니다.","error",function(){
				});
				return false;
			}
			if($("#uploadFileJs")[0].files.length == 0) {
				COMMON.alert("JS 파일이 선택되지않았습니다.","error",function(){
				});
				return false;
			}
		}
		
		return true;
	},
	moduleDeleteRequest:function(mdid, state){
		var text = '<span style="color: #595959;">삭제 요청하시겠습니까?</span><br><span class="text-secondary ts-9">* 삭제 후 복구할 수 없습니다.</span>';
		if(state == 1){
			text = '<span style="color: #595959;">삭제 요청을 취소하시겠습니까?</span>';
		}
		var subtext = "";
		COMMON.confirm(text,subtext
			,"info"
			,function(){

				var formData = new FormData();
				formData.append("mdid", mdid);
				formData.append("state", state);
				
				$.ajax({
					url:"./moduleDeleteRequest.do",
					type: "POST",
					data: formData,
					processData: false,
					contentType: false,
					success:function(result) {
						var result=JSON.parse(result);
						if(result.rs == "complete"){
							text = "삭제 요청되었습니다.";
							if(state == 1){
								text = "삭제 요청 취소되었습니다.";
								LOG_TRACKER.write("99","2","모듈 삭제 요청 취소:{MDID:"+mdid+"}");
							}else{
								LOG_TRACKER.write("99","2","모듈 삭제 요청:{MDID:"+mdid+"}");
							}
							
							COMMON.alert(text,"success",function(){location.reload();});
						}
						else if(result.rs == "use"){
							text = "연계된 앱 삭제 후 모듈 삭제 요청이 가능합니다.";
							COMMON.alert(text,"error",function(){});
						}
					}
				});

			},
			function(){return false;});
	}
	
}

var DTCPD={
		add:{
			init:function(){
				$("#formElem").validate({
					 ignore: '.ignore, .select2-input',
					 focusInvalid: false,
					 rules:{
						 'selecLcate':{
							  required:["대분류를 선택해주세요."]
						  },
						  'selectMsCate':{
							  required:["분류를 선택해주세요."]
						  },
						 'anlysNm':{
							  required:["분석명을 입력하세요."]
						  },
						  'uploadFileJs':{
							  required:["JS 파일을 선택해주세요."],					  
						  },
						  'uploadFileJsLib':{
							  required:["JS lib 파일을 선택해주세요."],					  
						  },
						  'uploadFileCss':{
							  required:["CSS 파일을 선택해주세요."],
						  },
						  'uploadFileHtml':{
							  required:["HTML 파일을 선택해주세요."],
						  },
						  
					  },
					  errorPlacement: function errorPlacement(error, element) {
					      var $parent = $(element).parents('.form-group');

					      // Do not duplicate errors
					      if ($parent.find('.jquery-validation-error').length) { return; }

					      $parent.append(
					        error.addClass('jquery-validation-error small form-text invalid-feedback')
					      );
					  },
					  highlight: function(element) {
					      var $el = $(element);
					      var $parent = $el.parents('.form-group');

					      $el.addClass('is-invalid');

					      // Select2 and Tagsinput
					      if ($el.hasClass('select2-hidden-accessible') || $el.attr('data-role') === 'tagsinput') {
					        $el.parent().addClass('is-invalid');
					      }
					  },
					  unhighlight: function(element) {
					      $(element).parents('.form-group').find('.is-invalid').removeClass('is-invalid');
					  },
					  submitHandler:function(form){
						  
						  var formData = new FormData();
						  
						  formData.append("CATE_ID",$("#selectMsCate option:selected").val());
						  formData.append("ANL_NM",$("#anlysNm").val());
						  
						  var jsFile = document.getElementById("uploadFileJs");
						  formData.append("JS_FILE",jsFile.files[0]);
						  
						  var chckLib =$("input[name=inline-radios]:checked").val();
						  formData.append("CHCK_LIB",chckLib);
						  
						  var jsLibFile = document.getElementById("uploadFileJsLib");
						
						  if(chckLib=='Y'){
							  
							  for(var i =0; i<jsLibFile.files.length;i++){
								  formData.append("JS_LIB_FILE",jsLibFile.files[i]);
							  }
							  
						  }
						  
						  var cssFile = document.getElementById("uploadFileCss");
						  formData.append("CSS_FILE",cssFile.files[0]);
						  
						  var htmlFile = document.getElementById("uploadFileHtml");
						  formData.append("HTML_FILE",htmlFile.files[0]);
						  
						  formData.append("MID",D_MEMBER.MID);
						  
						  $.ajax({
							  url:'/admin/product/fileUpload.do',
							  type:'POST',
							  data:formData,
							  dataType:'json',
							  processData: false,
							  contentType: false,
							  enctype: 'multipart/form-data',
							  success:function(result){
								  
								  if(result.RS=="OK"){
									  COMMON.SwalAlert('등록되었습니다','success',function(){
										 location.href="./main.do";
										 return false;
									  });
								  }
							  }
							  
						  })
						  return false;
					  }
				});
				
				$(".form-check-lib").on('click',function(){

					var val = $(this).val();
					
					if(val=="Y"){
						$("#jsLibFileDiv").show();
					}else{
						$("#jsLibFileDiv").hide();
					}
					
				});
			},
		},
		editAnlyInfo:function(mid,aindx){
			
			var data = {
					MID:mid,
					AINDX:aindx
			}
			
			$.ajax({
				url:"/admin/prodcut/editAnlyInfo.do",
				type:"POST",
				data:data,
				dataType:'json',
				success:function(result){
					console.log(result);
				}
			});
		},
		prewViewInit:function(){
			
			$("#modals-preView").modal({backdrop:'static'});
			
			var jsFile = document.getElementById("uploadFileJs");
			var jsLibFile = document.getElementById("uploadFileJsLib");
			var cssFile = document.getElementById("uploadFileCss");
			var htmlFile = document.getElementById("uploadFileHtml");
			
			DTCPD.readFileText(jsFile.files[0],function(result){

				if($("#prevIframe").contents().find("#previewJs").length){
					$("#prevIframe").contents().find("#previewJs").remove();
				}
				
				var mapScript = document.createElement('script');
				mapScript.innerHTML = result;
				mapScript.id = "previewJs";
				$("#prevIframe").contents().find("body").append(mapScript);

				
			});
			
			for(var i=0;i<jsLibFile.files.length;i++){
				
				DTCPD.readFileText(jsLibFile.files[i],function(result){
					var htmlJsLib ="<script id=\"previewLib_"+i+"\">"+result+"</script>";

					if($("#prevIframe").contents().find("#previewLib_"+i).length){
						$("#prevIframe").contents().find("#previewLib_"+i).remove();
					}
					
					$("#prevIframe").contents().find("body").append(htmlJsLib);

				});
				
			}
			
			
			DTCPD.readFileText(cssFile.files[0],function(result){
				
				if($("#prevIframe").contents().find("#cssPrivew").length){
					$("#prevIframe").contents().find("#cssPrivew").remove();
				}
					
				var htmlCss ="<style id=\"cssPrivew\">"+result+"</style>";

				$("#prevIframe").contents().find("head").append(htmlCss);

			});
			
			DTCPD.readFileText(htmlFile.files[0],function(result){
				
				if($("#prevIframe").contents().find("#htmlPrev").length){
					$("#prevIframe").contents().find("#htmlPrev").remove();
				}
				
				
				var htmls="<div id=\"htmlPrev\">"+result+"</div>";
	
				$("#prevIframe").contents().find("#moduleUITabContent").append(htmls);

				
			});
			
			var design_type = document.querySelector('input[name="design_type"]:checked').value;
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
				$("#prevIframe").get(0).contentWindow.eval($("#moduleObj").val()).init();
			},100);
			
		},
		prewViewFile:function(mdid){
			
			$("#modals-preView").modal({backdrop:'static'});
			
			var jsFile = document.getElementById("uploadFileJs");
			var libFile = document.getElementById("uploadFileJsLib");
			var cssFile = document.getElementById("uploadFileCss");
			var htmlFile = document.getElementById("uploadFileHtml");

			var formData = new FormData();
			formData.append("mdid", mdid);			
			formData.append("use_ext_libs", $("input[name='useExtLibs']:checked").val());
			
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
			
			if (cssFile.files[0] == null) {
				$.ajax({
					url:"./fileCss.do",
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
			} else {
				DTCPD.readFileText(cssFile.files[0],function(result){
					var htmlCss ="<style id=\"cssPrivew\">"+result+"</style>";

					$("#prevIframe").contents().find("head").append(htmlCss);

				});
			}
			if (htmlFile.files[0] == null){
				$.ajax({
					url:"./fileHtml.do",
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
			} else {
				DTCPD.readFileText(htmlFile.files[0],function(result){
					
					var htmls="<div id=\"htmlPrev\">"+result+"</div>";
		
					$("#prevIframe").contents().find("#moduleUITabContent").append(htmls);

					
				});
			}
			if(jsFile.files[0] == null){
				$.ajax({
					url:"./fileJs.do",
					type: "POST",
					data: formData,
					processData: false,
					contentType: false,
					enctype: 'multipart/form-data',
					success:function(result) {
						var mapScript = document.createElement('script');
						mapScript.innerHTML = result;
						mapScript.id = "previewJs";
						$("#prevIframe").contents().find("body").append(mapScript);
					}
				});
			} else {
				DTCPD.readFileText(jsFile.files[0],function(result){

					if($("#previewJs")){
						$("#previewJs").remove();
					}
					
					mapScript.innerHTML = result;
					mapScript.id = "previewJs";
					$("#prevIframe").contents().find("body").append(mapScript);
					
				});
			}
			if(libFile.files[0] == null){
				$.ajax({
					url:"./fileLib.do",
					type: "POST",
					data: formData,
					processData: false,
					contentType: false,
					dataType:'json',
					enctype: 'multipart/form-data',
					success:function(result) {
						for(var i=0;i<result.moduleExtList.length;i++){
							if(result.moduleExtList[i]['file_type'] == "js"){
								var htmlLib ="<script id=\"previewLib_"+i+"\" src=\""+result.moduleExtList[i]['file_url']+"\"></script>";
							}else if(result.moduleExtList[i]['file_type'] == "css"){
								var htmlLib ="<link id=\"previewLib_"+i+"\" href=\""+result.moduleExtList[i]['file_url']+"\" rel=\"stylesheet\">";
							}
							if($("#prevIframe").contents().find("body #previewLib_"+i)){
								$("#prevIframe").contents().find("body #previewLib_"+i).remove();
							}
							$("#prevIframe").contents().find("body").append(htmlLib);
						}
					}
				});
			} else {
				for(var i=0;i<libFile.files.length;i++){
					
					DTCPD.readFileText(libFile.files[i],function(result){
						var htmlLib ="<script id=\"previewLib_"+i+"\">"+result+"</script>";

						if($("#previewLib_"+i)){
							$("#previewLib_"+i).remove();
						}
						
						$("#prevIframe").contents().find("body").append(htmlLib);

					});
					
				}

			}
			
			var design_type = document.querySelector('input[name="design_type"]:checked').value;
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
				$("#prevIframe").get(0).contentWindow.eval($("#moduleObj").val()).init();
			},100);
		},
		readFileText:function(file,callback){
			
			var rsText = "";
			var reader = new FileReader();
			
			reader.onload=function(){
				rsText = reader.result;
				callback(rsText);
			}
			reader.readAsText(file,'utf-8');

		},
		validateFile:function(obj,type){
			
			for(var i=0;i<obj.files.length;i++){
				
				var fileType = obj.files[i].name.split(".")[1];
				
				if(fileType!=type){
					COMMON.alert("확장자가 "+type+"인 파일을 올려주세요");
					obj.value=null;
					break;
				}
			}
			
			
			var html=$("#uploadFileHtml").val();
			var jsfile=$("#uploadFileJs").val();
			var cssfile=$("#uploadFileCss").val();
			
			$("#preViewBtn1").css("display", "inline-block");	
			$("#preViewBtn2").css("display", "none");	
			 
			if(html !="" && jsfile !="" && cssfile !=""){
				 $('#preViewBtn1').removeAttr("disabled");
			} else {
				$('#preViewBtn1').attr("disabled", true);
			}
			
		},
		validateFileEdit:function(obj,type){
			
			for(var i=0;i<obj.files.length;i++){
				
				var fileType = obj.files[i].name.split(".")[1];
				
				if(fileType!=type){
					COMMON.alert("확장자가 "+type+"인 파일을 올려주세요");
					obj.value=null;
					break;
				}
			}
			
			var html=$("#uploadFileHtml").val();
			var jsfile=$("#uploadFileJs").val();
			var cssfile=$("#uploadFileCss").val();
			
			
			
			$("#preViewBtn1").css("display", "inline-block");	
			$("#preViewBtn2").css("display", "none");	
			
			if(html !="" && jsfile !="" && cssfile !=""){
				 $('#preViewBtn1').removeAttr("disabled");
			}
			else if(html =="" && jsfile =="" && cssfile ==""){
				$("#preViewBtn1").css("display", "none");	
				$("#preViewBtn2").css("display", "inline-block");	
			}
			else {
				$('#preViewBtn1').attr("disabled", true);
			}
			
			
		}
}