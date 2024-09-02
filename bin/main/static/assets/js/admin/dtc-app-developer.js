/**
 * 
 */
var APP_DEVELOPER  = {
	editor:null,
	dataTable:0,
	deleteLogoFlag:false,
	init:function() {
		APP_DEVELOPER.dataTable = $('#appDeveloperList').DataTable( {
			"columns": [
    		    { "width": "5%", "orderable": false },
    		    { "width": "10%"},
    		    { "width": "10%"},
    		    { "width": "13%"},
    		    { "width": "13%"},
    		    { "width": "15%"},
    		    { "width": "10%"},
    		    { "width": "12%"},
    		    { "width": "12%", "orderable": false },
    		  ],
	        "order": [[ 1, 'asc' ]],
            lengthChange :false
	    } );
	 
		APP_DEVELOPER.dataTable.on( 'order.dt search.dt', function () {
			APP_DEVELOPER.dataTable.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
	            cell.innerHTML = i+1;
	        } );
	    } ).draw();
	},
	addDeveloper:function() {
		if($("#developerName").val() == "") {
			alert('개발자명을 입력하세요');

			$("#developerName").focus();

			return false;
		} else if($("#developerEmail").val() == "") {
			alert('개발자 이메일을 입력하세요');

			$("#developerEmail").focus();

			return false;
		}

		if(!APP_DEVELOPER.validateEmail($("#developerEmail").val())) {
			alert("이메일 주소가 유효하지 않습니다.");
			$("#developerEmail").focus();

			return false;
		}

		var formData = new FormData();

		var homePage = ($("#developerHomepage").val() == "") ? "" : $("#developerHomepage").val();

		if(homePage != "") {
			if(!(APP_DEVELOPER.validateUrl(homePage))) {
				alert('유효하지 않은 홈페이지 URL 입니다');
				$("#developerHomepage").focus();
				return false;
			}
		}

		formData.append("developerType", $("input[name='developerType']:checked").val());
		formData.append("developerName", $("#developerName").val());
		formData.append("developerEmail", $("#developerEmail").val());
		formData.append("developerHomepage", ($("#developerHomepage").val() == ""? null:$("#developerHomepage").val()));
		formData.append("developerLogo", $("#developerLogo")[0].files[0]);
		formData.append("developerAbout", (APP_DEVELOPER.editor.getData() == ""? null:APP_DEVELOPER.editor.getData()));

		$.ajax({
			url:"/admin/appdeveloper/createDeveloper.do",
			type: "POST",
			data: formData,
			processData: false,
			contentType: false,
			success:function(result) {
				var result=JSON.parse(result);
				if(result.rs == "complete"){
					COMMON.alert("앱 개발자가 등록되었습니다.","success",function(){
						location.href = "/admin/member/developer/list.do";
					});
				}else{
					COMMON.alert("앱 개발자가 등록이 실패하였습니다.\n잠시 후 다시 시도해주세요.","error",function(){});
				}
			}
		});

	},
	deleteLogo:function(){
		$("#logoView").remove();
		APP_DEVELOPER.deleteLogoFlag = true;
	},
	validateEmail:function(mail) {
		if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
			return true;
		}

		return false;
	},
	validateUrl:function(url) {
		var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
		'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
		'((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
		'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
		'(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
		'(\\#[-a-z\\d_]*)?$','i'); // fragment locator
		return !!pattern.test(url);
	},
	getDeveloperType:function(type){
		var value = "";
		switch(type){
			case "S":
				value = "개인";
			break;
			case "G":
				value = "단체";
			break;
			case "C":
				value = "회사";
			break;
		}
		return value;
	},
	updateDeveloper:function(mid) {
		if($("#developerName").val() == "") {
			COMMON.alert("개발자명을 입력하세요.","error",function(){
				$("#developerName").focus();
			});
			return false;
		} else if($("#developerEmail").val() == "") {
			COMMON.alert("개발자 이메일을 입력하세요.","error",function(){
				$("#developerEmail").focus();
			});
			return false;
		}

		if(!APP_DEVELOPER.validateEmail($("#developerEmail").val())) {
			COMMON.alert("이메일 주소가 유효하지 않습니다.","error",function(){
				$("#developerEmail").focus();
			});
			return false;
		}

		var formData = new FormData();

		var homePage = ($("#developerHomepage").val() == "") ? "" : $("#developerHomepage").val();

		if(homePage != "") {
			if(!(APP_DEVELOPER.validateUrl(homePage))) {
				COMMON.alert("유효하지 않은 홈페이지 URL 입니다.","error",function(){
					$("#developerHomepage").focus();
				});
				return false;
			}
		}

		formData.append("developerType", $("input[name='developerType']:checked").val());
		formData.append("developerName", $("#developerName").val());
		formData.append("developerEmail", $("#developerEmail").val());
		formData.append("developerHomepage", ($("#developerHomepage").val() == ""? null:$("#developerHomepage").val()));
		formData.append("developerLogo", $("#developerLogo")[0].files[0]);
		formData.append("developerAbout", (APP_DEVELOPER.editor.getData() == ""? null:APP_DEVELOPER.editor.getData()));
		formData.append("deleteLogo", APP_DEVELOPER.deleteLogoFlag);
		formData.append("state", $("#developerState").val());
		formData.append("mid", mid);

		$.ajax({
			url:"/admin/appdeveloper/updateDeveloper.do",
			type: "POST",
			data: formData,
			processData: false,
			contentType: false,
			success:function(result) {
				var result=JSON.parse(result);
				if(result.rs == "complete"){
					COMMON.alert("개발자 정보가 수정되었습니다.","success",function(){
						location.replace("/admin/member/developer/list.do");
					});
				}else{
					COMMON.alert("앱 개발자 정보 수정이 실패하였습니다.\n잠시 후 다시 시도해주세요.","error",function(){});
				}
			}
		});
	}
}
