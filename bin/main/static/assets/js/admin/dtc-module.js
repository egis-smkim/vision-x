/**
 *파일명:dtc-product.js
 *주제:상품 등록
 *작성자:smd 
 */

var MODULE = {
	init:function() {
		
	},
	CATEGORY:{
		getSmallCategory:function(obj) {
			var cid = obj.value;
			
			var formData = new FormData();
			formData.append("control", "getSmallCategory");
			formData.append("cid", cid);
			
			$.ajax({
				url:"../product/getCategoryList.do",
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
			
			console.log($("#selectMCate"));
			
			var cid = obj.value;
			
			var formData = new FormData();
			formData.append("control", "getMiddleCategory");
			formData.append("cid", cid);
			$.ajax({
				url:"../product/getCategoryList.do",
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
		if($("#anlysNm").val() == "") {
			alert('분석명을 입력하세요.');
			$("#anlysNm").focus();
			return false;
		}
		
		if($("#authorNm").val() == "") {
			alert('엔진 담당개발자를 입력하세요.');
			$("#authorNm").focus();
			return false;
		}
		
		if($("#moduleObj").val() == "") {
			alert('모듈명을 입력하세요.');
			$("#moduleObj").focus();
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
		
		formData.append("module_js_file", $("#uploadFileJs")[0].files[0]);
		formData.append("module_css_file", $("#uploadFileCss")[0].files[0]);
		formData.append("module_html_file", $("#uploadFileHtml")[0].files[0]);
		
		formData.append("use_ext_libs", $("input[name='useExtLibs']:checked").val());

		formData.append("tbl_name_m", ($("#tbl_name_m").val() == "") ? "null" : $("#tbl_name_m").val());
		formData.append("tbl_name_s0", ($("#tbl_name_s0").val() == "") ? "null" : $("#tbl_name_s0").val());
		formData.append("tbl_name_s1", ($("#tbl_name_s1").val() == "") ? "null" : $("#tbl_name_s1").val());
		formData.append("tbl_name_s2", ($("#tbl_name_s2").val() == "") ? "null" : $("#tbl_name_s2").val());
		formData.append("tbl_name_s3", ($("#tbl_name_s3").val() == "") ? "null" : $("#tbl_name_s3").val());
		formData.append("tbl_name_s4", ($("#tbl_name_s4").val() == "") ? "null" : $("#tbl_name_s4").val());

		formData.append("develop_type", $("input[name='develop_type']:checked").val());
		formData.append("design_type", $("input[name='design_type']:checked").val());
		formData.append("data_directory", ($("#data_directory").val() == "") ? "null" : $("#data_directory").val());
		
		var extFiles = document.getElementById("uploadFileJsLib");
		
		for(var i = 0; i < extFiles.files.length; i++) {
			formData.append("module_ext_files", extFiles.files[i]);
		}
		
		$.ajax({
			url:"./executeEdit.do",
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
					alert('모듈 정보가 변경 됐습니다.')
					document.location.href = "./list.do";
				}
			}
		});
	},
	deleteExtFile:function(meid) {
		if(!confirm('해당 모듈 확장 파일을 삭제하시겠습니까?')) {
			return false;
		}
		
		var formData = new FormData();
		formData.append("meid", meid);
		$.ajax({
			url:"./executeDeleteExt.do",
			type: "POST",
			data: formData,
			processData: false,
			contentType: false,
			enctype: 'multipart/form-data',
			success:function(result) {
				
				var result=JSON.parse(result);
				
				if(result.rs == "complete") {
					$("#module_ext_files_"+meid).remove();
				}
			}
		});
		
	},
	add:function() {
		
		if($("#anlysNm").val() == "") {
			alert('분석명을 입력하세요.');
			$("#anlysNm").focus();
			return false;
		}
		
		if($("#authorNm").val() == "") {
			alert('엔진 담당개발자를 입력하세요.');
			$("#authorNm").focus();
			return false;
		}
		
		if($("#moduleObj").val() == "") {
			alert('모듈명을 입력하세요.');
			$("#moduleObj").focus();
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

		formData.append("tbl_name_m", ($("#tbl_name_m").val() == "") ? "null" : $("#tbl_name_m").val());
		
		formData.append("tbl_name_s0", ($("#tbl_name_s0").val() == "") ? "null" : $("#tbl_name_s0").val());
		formData.append("tbl_name_s1", ($("#tbl_name_s1").val() == "") ? "null" : $("#tbl_name_s1").val());
		formData.append("tbl_name_s2", ($("#tbl_name_s2").val() == "") ? "null" : $("#tbl_name_s2").val());
		formData.append("tbl_name_s3", ($("#tbl_name_s3").val() == "") ? "null" : $("#tbl_name_s3").val());
		formData.append("tbl_name_s4", ($("#tbl_name_s4").val() == "") ? "null" : $("#tbl_name_s4").val());
		

		formData.append("develop_type", $("input[name='develop_type']:checked").val());
		formData.append("design_type", $("input[name='design_type']:checked").val());

		formData.append("data_directory", ($("#data_directory").val() == "") ? "null" : $("#data_directory").val());

		var extFiles = document.getElementById("uploadFileJsLib");
		
		for(var i = 0; i < extFiles.files.length; i++) {
			formData.append("module_ext_files", extFiles.files[i]);
		}

		$.ajax({
			url:"/admin/module/executeAddModule.do",
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
						LOG_TRACKER.write("94","2","모듈 생성:{MDID:"+result.mdid+"}");
						alert('새로운 모듈이 등록 됐습니다.')
						document.location.href = "./list.do";
					break;
				}
			}
		});
	},
	validateExtFiles:function(obj) {
		
		for(var i = 0;i < obj.files.length; i++) {
			
			
			var fArr = obj.files[i].name.split(".");
			
			var fileType = fArr[fArr.length - 1];
						
			console.log(fileType);
			/*if(fileType != "css" && fileType != "js" ) {
				COMMON.alert("모듈 외부 라이브러리 파일은 css, js 파일만 등록 가능합니다.");
				obj.value = null;
				break;
				return false;
			}*/
		}
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
		getMcateLists:function(obj){

			var data = {
					type:obj.value
			};
			
			$.ajax({
				url:'/admin/getCategoryLists.do',
				data:data,
				type:'POST',
				dataType:'json',
				success:function(result){
					
					var html = "";
					
					$("#selectMsCate").empty();
					
					for(var i=0;i<result.CATE_LIST.length;i++){
						
						var mCate = result.CATE_LIST[i].M_CATE;
						var sCate = result.CATE_LIST[i].S_CATE;
						var cateNm = result.CATE_LIST[i].CATE_NM;
						var cateId = result.CATE_LIST[i].CID;
						
						if(sCate=='00'){
							html+="<optgroup label=\""+cateNm+"\">\n";
						}else{
							html+="<option value=\""+cateId+"\">"+cateNm+"</option>\n";
						}
						
						
						if(i != (result.CATE_LIST.length-1)){
							if(mCate != result.CATE_LIST[i+1].M_CATE){
								html+="</optgroup>\n";
							}
						}
						
						if(i == (result.CATE_LIST.length-1)){
							html+="</optgroup>\n";
						}
					}
					$("#selectMsCate").append(html);
					 
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

				if($("#previewJs")){
					$("#previewJs").remove();
				}
				
				var htmlJs ="<script id=\"previewJs\">"+result+"</script>";
				
				$("#prevIframe").contents().find("body").append(htmlJs);

				
			});
			
			for(var i=0;i<jsLibFile.files.length;i++){
				
				DTCPD.readFileText(jsLibFile.files[i],function(result){
					var htmlJsLib ="<script id=\"previewLib_"+i+"\">"+result+"</script>";

					if($("#previewLib_"+i)){
						$("#previewLib_"+i).remove();
					}
					
					$("#prevIframe").contents().find("body").append(htmlJsLib);

				});
				
			}
			
			
			DTCPD.readFileText(cssFile.files[0],function(result){
				var htmlCss ="<style id=\"cssPrivew\">"+result+"</style>";

				$("#prevIframe").contents().find("head").html(htmlCss);

			});
			
			DTCPD.readFileText(htmlFile.files[0],function(result){
				var htmls="<div id=\"htmlPrev\">"+result+"</div>";
	
				$("#prevIframe").contents().find("#moduleUITabContent").html(htmls);

				
			});
			
		},
		prewViewFile:function(mdid, design_type){
			
			$("#modals-preView").modal({backdrop:'static'});
			
			var jsFile = document.getElementById("uploadFileJs");
			var libFile = document.getElementById("uploadFileJsLib");
			var cssFile = document.getElementById("uploadFileCss");
			var htmlFile = document.getElementById("uploadFileHtml");

			var formData = new FormData();
			formData.append("mdid", mdid);			
			formData.append("use_ext_libs", $("input[name='useExtLibs']:checked").val());

			
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
						$("#prevIframe").contents().find("head").html(htmlCss);
	
					}
				});
			} else {
				DTCPD.readFileText(cssFile.files[0],function(result){
					var htmlCss ="<style id=\"cssPrivew\">"+result+"</style>";

					$("#prevIframe").contents().find("head").html(htmlCss);

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
						$("#prevIframe").contents().find("#moduleUITabContent").html(htmls);
	
					}
				});
			} else {
				DTCPD.readFileText(htmlFile.files[0],function(result){
					var htmls="<div id=\"htmlPrev\">"+result+"</div>";
		
					$("#prevIframe").contents().find("#moduleUITabContent").html(htmls);

					
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
						var htmlJs ="<script id=\"previewJs\">"+result+"</script>";
						$("#prevIframe").contents().find("body").append(htmlJs);
					}
				});
			} else {
				DTCPD.readFileText(jsFile.files[0],function(result){

					if($("#previewJs")){
						$("#previewJs").remove();
					}
					
					var htmlJs ="<script id=\"previewJs\">"+result+"</script>";
					
					$("#prevIframe").contents().find("body").append(htmlJs);

					
				});
			}
			if(libFile.files[0] == null){
				$.ajax({
					url:"./fileLib.do",
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
			$('#preViewBtn1').removeAttr("disabled");
			
		}
}