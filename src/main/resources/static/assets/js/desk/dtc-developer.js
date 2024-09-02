var DEVELOPER = {
	editor:null,
	deleteLogoFlag:false,
	init:function() {
		DEVELOPER.getDeveloperInfo();
	},
	getDeveloperInfo: function(){
		$.ajax({
			url: "/desk/developer/getDeveloperInfo.do",
			type: "POST",
			success: function(result) {
				var result = JSON.parse(result);
				if (result.rs == "complete" && result.appDeveloperVO != null){
					var data = result.appDeveloperVO;
					var html = '<div class="card mb-12">';
					html += 		'<div class="card-body">';
					html += 			'<div class="media">';
					if(data.developer_logo_url != null){
					html += 				'<img src="'+data.developer_logo_url+'" alt="" style="height:100px" class="ui-w-100 rounded-circle">';
					}
					html += 				'<div class="row media-body pt-2 ml-3">';
					html += 					'<div class="col-10">';
					html += 						'<h4 class="mb-2">'+data.developer_name+'</h4>';
					html += 					'</div>';
					html += 					'<div class="col-2">';
					if(data.state == "10"){
					html += 						'<a href="./moduleList.do" class="btn btn-sm btn-success rounded-pill d-block mb-2"><span class="ion ion-md-clipboard"></span> 모듈 관리</a>';
					}
					html += 					'</div>';
					html += 					'<div class="col-10">';
					html += 						'<div class="text-muted small">'
					if(data.developer_type == "S") 		html += '개인';
					else if(data.developer_type == "G") html += '단체';
					else 								html += '회사';
					html += 						'</div>';
					html += 					'</div>';
					html += 					'<div class="col-2">';
					if(data.state == "10"){
					html += 						'<a href="./appList.do" class="btn btn-sm btn-success rounded-pill d-block mb-2"><span class="ion ion-md-clipboard"></span> 앱 관리</a>';
					}
					html += 					'</div>';
					html += 					'<div class="col-10">';
					if(data.state == "1") 			html += '<span class="badge badge-danger">승인요청</span>';
					else if(data.state == "0")		html += '<span class="badge badge-warning">등록중</span>';
					else if(data.state == "9")		html += '<span class="badge badge-dark">반려</span>';
					else if(data.state == "10")		html += '<span class="badge badge-success">승인</span>';
                    html += 					'</div>';
					html += 					'<div class="col-2">';
					if(data.state == "10"){
					html += 						'<a href="//dev.xdworld.kr" class="btn btn-sm btn-success rounded-pill d-block"><span class="ion ion-md-clipboard"></span> 모듈 개발 바로가기</a>';
					}
					html += 					'</div>';
             		html += 				'</div>';
					html += 			'</div>';
					html += 			'<hr class="border-light m-0">';
					html += 			'<div class="card-body">';
					html += 				'<div class="mb-2">';
					html += 					'<span class="text-muted">이메일:</span> '+data.developer_email;
					html += 				'</div>';
					html += 				'<div class="mb-2">';
					html += 					'<span class="text-muted">홈페이지:</span> '+(data.developer_homepage == "null" || data.developer_homepage == null? "":data.developer_homepage);
					html += 				'</div>';
					html += 				'<div class="text-muted">';
					html += 					(data.developer_about == "null" || data.developer_about == null? "":data.developer_about);
                    html += 				'</div>';
					html += 			'</div>';
                	html += 		'</div>';
					$("#developerInfoWrap").html(html);
				}
			}
		});
	},
	checkDeveloper:function(){
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
		if(!DEVELOPER.validateEmail($("#developerEmail").val())) {	
			COMMON.alert("이메일 주소가 유효하지 않습니다.","error",function(){	
				$("#developerEmail").focus();	
			});	
			return false;	
		}
		var formData = new FormData();

		var homePage = ($("#developerHomepage").val() == "") ? "" : $("#developerHomepage").val();

		if(homePage != "") {
			if(!(DEVELOPER.validateUrl(homePage))) {
				COMMON.alert("유효하지 않은 홈페이지 URL 입니다.","error",function(){
					$("#developerHomepage").focus();
				});
				return false;
			}
		}

		formData.append("developerType", $("input[name='developerType']:checked").val());
		formData.append("developerName", $("#developerName").val());
		formData.append("developerTel", null);
		formData.append("developerEmail", $("#developerEmail").val());
		formData.append("developerHomepage", ($("#developerHomepage").val() == ""? null:$("#developerHomepage").val()));
		formData.append("developerLogo", $("#developerLogo")[0].files[0]);
		formData.append("developerAbout", (DEVELOPER.editor.getData() == ""? null:DEVELOPER.editor.getData()));
		
		return formData;
	},
	addDeveloper:function() {
		
		var formData = DEVELOPER.checkDeveloper();
		if(formData == false){
			return false;
		}
		
		$.ajax({
			url:"/desk/developer/createDeveloper.do",
			type: "POST",
			data: formData,
			processData: false,
			contentType: false,
			success:function(result) {
				var result=JSON.parse(result);
				if(result.rs == "complete"){
					COMMON.alert("앱 개발자가 등록되었습니다.","success",function(){
						location.href = "/desk/developer/info.do";
					});
				}else{
					COMMON.alert("앱 개발자 등록이 실패하였습니다.\n잠시 후 다시 시도해주세요.","error",function(){});
				}
			}
		});

	},
	updateDeveloper:function() {
		
		var formData = DEVELOPER.checkDeveloper();
		if(formData == false){
			return false;
		}
		
		formData.append("deleteLogo", DEVELOPER.deleteLogoFlag);
		
		$.ajax({
			url:"/desk/developer/updateDeveloper.do",
			type: "POST",
			data: formData,
			processData: false,
			contentType: false,
			success:function(result) {
				var result=JSON.parse(result);
				if(result.rs == "complete"){
					COMMON.alert("앱 개발자가 수정되었습니다.","success",function(){
						location.replace("/desk/developer/info.do");
					});
				}else{
					COMMON.alert("앱 개발자 수정이 실패하였습니다.\n잠시 후 다시 시도해주세요.","error",function(){});
				}
			}
		});
	},
	checkRequest:function(type){
		var text = "";
		var subtext = "";
		if(type == 1){
			text = '<span style="color: #595959;">개발자 승인 요청하시겠습니까?</span><br><span class="text-secondary ts-9">* 검수 요청 후에는 수정할 수 없습니다.</span>';
		}else{
			text = '<span style="color: #595959;">개발자 승인 요청을 취소하시겠습니까?</span>';
		}
		COMMON.confirm(text,subtext
				,"info"
				,function(){

					var formData = new FormData();
					formData.append("state", type);
					
					$.ajax({
						url:"./checkRequestDeveloper.do",
						type: "POST",
						data: formData,
						processData: false,
						contentType: false,
						success:function(result) {
							var result=JSON.parse(result);
							if(type == 1){
								LOG_TRACKER.write("110","2","개발자 승인 요청");
								text = "개발자 승인 요청되었습니다.";
							}else{
								LOG_TRACKER.write("110","2","개발자 승인 요청 취소");
								text = "개발자 승인 요청이 취소되었습니다.";
							}
							COMMON.alert(text,"success",function(){location.reload();});
						}
					});

				},
				function(){return false;});
	},
	deleteLogo:function(){
		$("#logoView").remove();
		DEVELOPER.deleteLogoFlag = true;
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
	}
}