/**
 *SUBJECT: 회원가입 및 로그인
 *AUTHOR: smd
 *COMMENT: jquery validation 사용 
 */
 var D_MEMBER={
	MID:null,
	DLID:null,
	logout:function() {
		D_MEMBER.clearHOnlySessionCookie("devAppId","");
		$.ajax({
			url:"/member/logout.do",
			dataType:'json',
			success:function(result){
				if(result.RS=="DONE"){
					if(D_MEMBER.DLID == 11){
						location.href="http://knps.dtwincloud.com";
					}
					else{
						location.href="";
					}
				}
				
				return false;
			},error:function(result){
				if(result.status == 404){
					//404 error 이미 로그아웃 처리함
					location.href="/member/login.do";
				}
			}
		})
	},
	checkCookie:function(){
		if($("#idSetCookie").is(":checked")){ 
			var memId = $("#memId").val();
			D_MEMBER.setCookie("memId", memId, 60); 
			D_MEMBER.setCookie("checkCookie", "Y", 60);
		} else {
			D_MEMBER.deleteCookie("memId");
			D_MEMBER.deleteCookie("checkCookie");
		}
	},
	setCookie:function(cookieName, value, exdays){
		var exdate = new Date();
		exdate.setDate(exdate.getDate() + exdays);
		var cookieValue = escape(value) + ((exdays==null) ? "" : "; path=/; expires=" + exdate.toGMTString());
		document.cookie = cookieName + "=" + cookieValue;
	},
	deleteCookie:function(cookieName){
		var expireDate = new Date();
		expireDate.setDate(expireDate.getDate() - 1);
		document.cookie = cookieName + "= " + "; expires=" + expireDate.toGMTString();
	},
	getCookie:function(cookieName){
		var x, y;
		var val = document.cookie.split(';');
		
		for (var i = 0; i < val.length; i++) {
			x = val[i].substr(0, val[i].indexOf('='));
			y = val[i].substr(val[i].indexOf('=') + 1);
			x = x.replace(/^\s+|\s+$/g, '');
			if (x == cookieName) {
			  return unescape(y);
			}
		}
	},
	clearHOnlySessionCookie:function(name,  path){
	var domain = domain || document.domain;
	var path = path || "/";
	document.cookie = name + "=null; path=" + path+";";
	},
	openAlert:function(text_top,text_bottom,type,fnc){
		COMMON.alert(text_top+"\n<p style='font-size: 18px;margin-top: 8px;'>"+text_bottom+"</p>",type,fnc);
		$(".swal2-container button").addClass("swal2-styled");
		$(".swal2-container button").removeClass("btn btn-outline-success");
	},
	openConfirmAlert:function(str,alertTxt,type,okFn,cancelFn){
		Swal.fire({
			title : "<h4 class=\"text-black\">"+str+"</h4>",
			text  :alertTxt,
			icon : type,
			allowOutsideClick: false,
			showCancelButton: true,
			confirmButtonText:'확인',
			cancelButtonText:"취소",
			customClass : {
				confirmButton : 'btn btn-outline-info',
				cancelButton: 'btn btn-outline-default',
				content:'mt-0 mb-3'
			},
			width:'450px',
			padding:'0.5rem'
		}).then(function(result){
			
			if(result.value){
				okFn();
			}else{
				cancelFn();
			}
		});
		
		$(".swal2-container button").addClass("swal2-styled");
		$(".swal2-container button").removeClass("btn btn-outline-success");
	},
	LOGIN:{
		init:function() {
		},
		executeLogin:function() {
			// 신규 디자인 로그인

			var domain_host =  window.location.host.split('.')[1] ? window.location.host.split('.')[0] : false;
			
			if($("#memId").val() == "") {
				D_MEMBER.openAlert($.i18n.t('Login.popper.login.alert_message.login_validation.no_id.param1'), "", "info", function() { $("#memId").focus(); });
				return false;
			}

			if($("#memPwd").val() == "") {
				D_MEMBER.openAlert($.i18n.t('Login.popper.login.alert_message.login_validation.no_password.param1'), "", "info", function() { $("#memPwd").focus(); });
				return false;
			}

			var mem_id = $("#memId").val();	
			var mem_pwd = hex_sha512($("#memPwd").val()).toString();
			var param = {"memId":mem_id,"memPwd":mem_pwd}
			var login_count = 0;
			var loginResult = false;
			var otp_flag;//사용자의 otp사용 여부 (0:디폴트,1:사용중)
			$.ajax({	
				url:'/member/checkLogin.do',	
				type:'POST',	
				data: param,	
				async:false,	
				dataType:'json',	
				success:function(result){	
					otp_flag = result.otp_flag;
					login_count = result.MEM_INFO.LOGIN_COUNT;
					if(result.MEM_INFO != null){
						if(result.MEM_INFO.LOGIN_COUNT >= 5){ //회원이 입력한 비밀번호가 일치하지만,로그인 입력 오류 카운트가 5회 이상일 경우
							LOG_TRACKER.write("13","2","로그인 5회 실패로 인한 비밀번호 초기화:{ID:"+mem_id+"}");
							$("#errorPwdPopup").addClass("active");
							$(".popup.type01").removeClass("active");
							return false;
						}
						if(result.MEM_INFO == "NONE") {
							if(result.PWD == "INCORRECT"){ 
								if(result.login_count<5){
									LOG_TRACKER.write("11","1","비밀번호 오류:{ID:"+mem_id+"}");//,LOG_TRACKER.getIP()
									//D_MEMBER.openAlert($.i18n.t('Login.popper.login.alert_message.login_validation.pwd_unmatched.param1'), $.i18n.t('Login.popper.login.alert_message.login_validation.pwd_unmatched.param2') + result.login_count + $.i18n.t('Login.popper.login.alert_message.login_validation.pwd_unmatched.param3'), "error", function() { });
									D_MEMBER.openAlert($.i18n.t('Login.popper.login.alert_message.login_validation.id_umatched.param1'), "", "error", function() { });
									return false;
								}else{
									LOG_TRACKER.write("13","2","로그인 5회 실패로 인한 비밀번호 초기화:{ID:"+mem_id+"}");
									$("#errorPwdPopup").addClass("active");
									$(".popup.type01").removeClass("active");
									return false;
								}
								
							}else{
								LOG_TRACKER.write("11","1","아이디 오류:{ID:"+mem_id+"}");
								D_MEMBER.openAlert($.i18n.t('Login.popper.login.alert_message.login_validation.id_umatched.param1'), "", "error", function() { });
								
								 return false;
							}
						}
						else if(result.MEM_INFO.MEM_LEVEL == 0) {
							LOG_TRACKER.write("11","1","비허가 사용자:{ID:"+mem_id+"}");
							D_MEMBER.openAlert($.i18n.t('Login.popper.login.alert_message.login_validation.unauthorized.param1'), $.i18n.t('Login.popper.login.alert_message.login_validation.unauthorized.param2'), "error", function() { });
							 return false;	
						}	
						else if(result.MEM_INFO.MEM_LEVEL == -1) {	
							LOG_TRACKER.write("11","1","이메일 미인증 사용자:{ID:"+mem_id+"}");
							D_MEMBER.openAlert($.i18n.t('Login.popper.login.alert_message.login_validation.unauthenticated.param1'), $.i18n.t('Login.popper.login.alert_message.login_validation.unauthenticated.param2'), "info", function() { });
							 return false;
						}	
						else {	
							if((domain_host != false && (domain_host == "admin" || domain_host.indexOf("mgt") > -1)) && result.MEM_INFO.MEM_LEVEL != 10){	
								LOG_TRACKER.write("11","1","비허가 관리자 사용자:{ID:"+mem_id+"}");
								D_MEMBER.openAlert($.i18n.t('Login.popper.login.alert_message.login_validation.unauthorized_admin.param1'), "", "error", function() { });
								return false;	
							}else{	
								loginResult = result.MEM_INFO.MEM_LEVEL;	
							}	
						}
					} else{
						LOG_TRACKER.write("11","1","아이디 오류:{ID:"+mem_id+"}");
						D_MEMBER.openAlert($.i18n.t('Login.popper.login.alert_message.login_validation.id_umatched.param1'), "", "error", function() { });
						return false;	
					}
				}

			});
			
			if(loginResult != false){
				D_MEMBER.checkCookie();
				if(otp_flag == "1"){ //otp설정이 되어있는 경우
					$('#otp-modal').modal('show');
					$('#otpCreate').click();
				}else{
					D_MEMBER.LOGIN.loginSession();
				}
			}
		},
		loginSession:function(){
			var mem_id = $("#memId").val();	
			var mem_pwd = hex_sha512($("#memPwd").val()).toString();
			var param = {"memId":mem_id,"memPwd":mem_pwd, "lang": D_TRASLATION.global.userLanguage}
			var domain_host =  window.location.host.split('.')[1] ? window.location.host.split('.')[0] : false;
			
			$.ajax({
				url:'/member/loginSession.do',	
				type:'POST',
				data: param,	
				async:false,	
				dataType:'json',	
				success:function(result){
					var loginResult = result.MEM_INFO.MEM_LEVEL;
					var tempPwd = result.MEM_INFO.TEMP_PWD_FLAG;
					var timediff = result.timediff;
					if(result.MEM_INFO == "fail"){
						D_MEMBER.openAlert("OTP인증에 실패하였습니다.","[재전송] 버튼을 눌러 다시 시도해주시기 바랍니다.","error",function(){$('#optNum').focus();});
					}
					if((domain_host != false && (domain_host == "admin" || domain_host.indexOf("mgt") > -1)) && result.MEM_INFO.MEM_LEVEL == 10){	
						//관리자	
						location.href="../admin/main.do";
						LOG_TRACKER.write("10",'1',"로그인 성공");
					}else if(loginResult == 1 || loginResult == 5 || loginResult == 10) {	
						//일반회원
							if(parseInt(timediff) >= 3 || parseInt(tempPwd) > 0){
								LOG_TRACKER.write("10",'1',"로그인 성공");
								location.href = "//"+window.location.host+"/desk/moveChgPWD.do";
							 }else{
								LOG_TRACKER.write("10",'1',"로그인 성공");
								if(location.href.indexOf("main.do") > -1){
									location.reload();
								} else {
									location.href = "//"+window.location.host+"";
								}
								
							}
					}
				}
			});
		},
		initLogin:function(){
			$("#memLoginForm").validate({
				 ignore: '.ignore, .select2-input',
				 focusInvalid: false,
				 rules:{
					  'memId':{
						  required:["아이디를 입력하세요."],
					  },
					  'memName':{
						  required:["이름을 입력하세요."],
					  },
					  'memPwd':{
						  required:["비밀번호를 입력하세요."],
						  rangelength:[6,20]
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
				  }
			})
			$("#memId").focus();
			var memId = D_MEMBER.getCookie("memId");
			var checkCookie = D_MEMBER.getCookie("checkCookie");
			
			if(checkCookie == 'Y') {
				$("#idSetCookie").prop("checked", true);
				$("#memId").val(memId);
				$("#memPwd").focus();
			} else {
				$("#idSetCookie").prop("checked", false);
			}
			
			  $("#noticeSetCookie").on("change",function(){
				  if($("#noticeSetCookie").is(":checked")){ 
					  D_MEMBER.setCookie("noticeCookie", true, 1);
				  } else {
					  D_MEMBER.deleteCookie("noticeCookie");
				  }
				  
			  })
	
			$("#memId").on("keyup",function(e){
				if(e.key == "Enter"){
					$("#memPwd").focus();
				}
			});
			$("#memPwd").on("keyup",function(e){
				if(e.key == "Enter"){
					D_MEMBER.LOGIN.executeLogin();
				}
			});
		},
		closeMistypePannel:function(){ //팝업창 닫기
			$('.mistypedPwd-popup').removeClass('opened');
			$('.popup-bg').css('display','none');
		}
	},
	SIGNUP:{
		initSignUp:function(){
			//validator 에러 메세지를 alert로 실행
			$.validator.setDefaults({ onkeyup:false, onclick:false, onfocusout:false, showErrors:function(errorMap, errorList){ if(this.numberOfInvalids()) { alert(errorList[0].message); } } });

			$("#memSignUpForm").validate({
				  ignore: '.ignore, .select2-input',
				  focusInvalid: false,
				  submitHandler:function(form){
					  $.ajax({
						 url:'/member/checkMemId.do',
						 type:'POST',
						 data:{'memId':$("#joinMemId").val()},
						 dataType:'json',
						 async:false,
						 success:function(result){
							 if(result.rs != 1){
								 var params = $("#memSignUpForm").serialize();
								
								 $.ajax({
									 url:'/member/insertSignMem.do',
									 type:'POST',
									 data:params,
									 dataType:'json',
									 success:function(result){
										 if(result.RS=="done"){
											D_MEMBER.openAlert("회원가입이 완료되었습니다.","","success",function(){});
											location.reload();
										 }
									 }
								 });
								 
							 }else{
								D_MEMBER.openAlert("아이디가 존재합니다.","","error",function(){});
								return false;
							 }
						 }
					  });
					  
					  return false;
				  },
				  rules:{
					  'joinMemId':{
						  required:true,
						  minlength:6
					  },
					  'joinMemName':{
						  required:true,
					  },
					  'joinMemEmail':{
						  required:true,
						  email:true
					  },
					  'joinMemPwd':{
						  required:true,
						  rangelength:[6,20]
					  },
					  'joinMemPwdCfm':{
						  required:true,
						  rangelength:[6,20],
						  equalTo: 'input[name="joinMemPwdCfm"]'
					  },
					  'memCloudAgr': {
						  required: true//["클라우드 이용약관에 동의해주세요"]
					  },
					  'memInfoAgr':{
						  required: true//["개인정보 수집 및 이용에 동의해주세요."]
					  }
					  
				  },
				  messages:{
					  joinMemId : {
						  required : "ID를 입력해주세요.",
						  minlength : "ID는 최소 6자리입니다."
					  },
					  joinMemName : {
						  required : "이름을 입력해주세요."
					  },
					  joinMemEmail : {
						  required : "이메일을 입력해주세요.",
						  email : "이메일 형식을 지켜주세요."
					  },
					  joinMemPwd :{
						  required : "패스워드를 입력해주세요.",
						  rangelength : "패스워드는 6~20자리로 입력해주세요."
					  },
					  joinMemPwdCfm : {
						  required : "재확인용 패스워드를 입력해주세요.",
						  rangelength : "재확인용 패스워드를 6~20자리로 입력해주세요.",
						  equalTo : "비밀번호와 확인용 패스워드가 일치하지 않습니다."
					  },
					  memCloudAgr : {
						  required : "[이지스 클라우드 수준협약(SLA)에 동의해주세요.]"
					  },
					  memInfoAgr : {
						  required : "[개인정보 수집 및 이용에 동의해주세요.]"
					  }
				  }
			  });
		},
		checkPasswordContinued:function(value){
			var intCnt1 = 0;
			var intCnt2 = 0;
			var intCnt3 = 0;
			var temp0 = "";
			var temp1 = "";
			var temp2 = "";
			var temp3 = "";
			var qwerty = "qwertyuiopasdfghjklzxcvbnm";
			var qwertyReverse = qwerty.split("").reverse().join("");
			
			for ( var i = 0; i < value.length; i++ ) {
				temp0 = value.charAt(i);
				temp1 = value.charAt(i+1);
				temp2 = value.charAt(i+2);
				temp3 = value.charAt(i+3);
				temp = temp0+temp1+temp2+temp3;
				if(temp0.charCodeAt(0) - temp1.charCodeAt(0) == 1 && 
					temp1.charCodeAt(0) - temp2.charCodeAt(0) == 1 && 
					temp2.charCodeAt(0) - temp3.charCodeAt(0) == 1){
						intCnt1 = intCnt1 + 1;
				}
				if(temp0.charCodeAt(0) - temp1.charCodeAt(0) == -1 &&
					temp1.charCodeAt(0) - temp2.charCodeAt(0) == -1 && 
					temp2.charCodeAt(0) - temp3.charCodeAt(0) == -1){
						intCnt2 = intCnt2 + 1;
				}
				if(temp.length > 3 && (qwerty.indexOf(temp) > -1 || qwertyReverse.indexOf(temp) > -1)){
					intCnt3++;
				}
			}
			if (intCnt1 > 0 || intCnt2 > 0 || intCnt3 > 0){
					return true;
			} else{
					return false;
			}
		},
		checkPasswordId:function(value, checker){
			var intCnt = 0;
			var temp0 = "";
			var temp1 = "";
			var temp2 = "";
			var temp3 = "";
			var temp4 = "";
			var checkerReverse = checker.split("").reverse().join("");
			
			for ( var i = 0; i < value.length; i++ ) {
				temp0 = value.charAt(i);
				temp1 = value.charAt(i+1);
				temp2 = value.charAt(i+2);
				temp3 = value.charAt(i+3);
				temp4 = value.charAt(i+4);
				temp = temp0+temp1+temp2+temp3+temp4;
				if(temp.length > 4 && (checker.indexOf(temp) > -1 || checkerReverse.indexOf(temp) > -1)){
					intCnt++;
				}
			}
			if (intCnt > 0){
					return true;
			} else{
					return false;
			}
		},
		executeSignUp:function() {
			// 신규 디자인 회원가입
			var idRule = $("#joinMemId").val().match(/^[a-z]+[a-z0-9_-]{5,}$/g);
			if($("#joinMemId").val() == "") {
				D_MEMBER.openAlert($.i18n.t('Login.popper.join.alert_message.join_validation.no_id'), "", "info", function() { $("#joinMemId").focus(); });
				return false;
			}else if($("#joinMemId").val().length<6){
				D_MEMBER.openAlert($.i18n.t('Login.popper.join.alert_message.join_validation.no_id_length'), "", "info", function() { $("#joinMemId").focus(); });
				return false;
			}else if(idRule == null){
				D_MEMBER.openAlert($.i18n.t('Login.popper.join.alert_message.join_validation.no_id_rule'), "", "info", function() { $("#joinMemId").focus(); });
				return false;
			}else if($("#joinMemId").val().indexOf("admin") > -1 ||
					$("#joinMemId").val().indexOf("root") > -1 ||
					$("#joinMemId").val().indexOf("manager") > -1){
				D_MEMBER.openAlert($.i18n.t('Login.popper.join.alert_message.join_validation.no_id_blacklist'), "", "info", function() { $("#joinMemId").focus(); });
				return false;
			}
			
			if($("#joinMemName").val() == "") {
				D_MEMBER.openAlert($.i18n.t('Login.popper.join.alert_message.join_validation.no_name'), "", "info", function() { $("#joinMemName").focus(); });
				return false;
			}
			
			var emailRule = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
			if($("#joinMemEmail").val() == "") {
				D_MEMBER.openAlert($.i18n.t('Login.popper.join.alert_message.join_validation.no_email'), "", "info", function() { $("#joinMemEmail").focus(); });
				return false;
			}else if(emailRule.test($("#joinMemEmail").val())==false){
				D_MEMBER.openAlert($.i18n.t('Login.popper.join.alert_message.join_validation.no_email_reg'), "", "info", function() { $("#joinMemEmail").focus(); });
				return false;
			}
			
			var pwdRule = /(?=.*[~`!@#$%\^&*()-+=]{1,50})(?=.*[0-9]{1,50})(?=.*[a-zA-Z]{1,50}).{9,50}$/;
			if($("#joinMemPwd").val() == "") {
				D_MEMBER.openAlert($.i18n.t('Login.popper.join.alert_message.join_validation.no_password'), "", "info", function() { $("#joinMemPwd").focus(); });
				return false;
			}else if(pwdRule.test($("#joinMemPwd").val())==false){
				D_MEMBER.openAlert($.i18n.t('Login.popper.join.alert_message.join_validation.no_password_reg'), "", "info", function() { $("#joinMemPwd").focus(); });
				return false;
			}else if(D_MEMBER.SIGNUP.checkPasswordContinued($("#joinMemPwd").val())){
				D_MEMBER.openAlert($.i18n.t('Login.popper.join.alert_message.join_validation.no_password_reg_consecutive'), $.i18n.t('Login.popper.join.alert_message.join_validation.no_password_reg_consecutive2'), "info", function() { return false; });
				return false;
			}else if(($("#joinMemId").val() == $("#joinMemPwd").val()) || ($("#joinMemEmail").val() != "" && $("#joinMemEmail").val().split("@")[0] == $("#joinMemPwd").val())){
				D_MEMBER.openAlert($.i18n.t('Login.popper.join.alert_message.join_validation.no_password_reg_dup'), $.i18n.t('Login.popper.join.alert_message.join_validation.no_password_reg_dup2'), "info", function() { return false; });
				return false;
			}else if(D_MEMBER.SIGNUP.checkPasswordId($("#joinMemPwd").val(),$("#joinMemId").val())){
				D_MEMBER.openAlert($.i18n.t('Login.popper.join.alert_message.join_validation.no_password_reg_dup3'), $.i18n.t('Login.popper.join.alert_message.join_validation.no_password_reg_dup4'), "info", function() { return false; });
				return false;
			}
			
			
			if($("#joinMemPwdCfm").val() == "") {
				D_MEMBER.openAlert($.i18n.t('Login.popper.join.alert_message.join_validation.no_passwordconf'), "", "info", function() { $("#joinMemPwdCfm").focus(); });
				return false;
			}
			
			if($("#joinMemPwdCfm").val() != $("#joinMemPwd").val()) {
				D_MEMBER.openAlert($.i18n.t('Login.popper.join.alert_message.join_validation.no_passwordconf_reg'), "", "info", function() { $("#joinMemPwdCfm").focus(); });
				return false;
			}
			
			if(!$("#memCloudAgr").is(":checked")) {
				D_MEMBER.openAlert($.i18n.t('Login.popper.join.alert_message.join_validation.no_consent1'), "", "info", function() { $("#memCloudAgr").focus(); });
				return false;
			}
			
			if(!$("#memInfoAgr").is(":checked")) {
				D_MEMBER.openAlert($.i18n.t('Login.popper.join.alert_message.join_validation.no_consent2'), "", "info", function() { $("#memInfoAgr").focus(); });
				return false;
			}
		

			$.ajax({
				url : '/member/checkMemId.do',
				type : 'POST',
				data : {
					'memId' : $("#joinMemId").val()
				},
				dataType : 'json',
				async : false,
				success : function(result) {
					if (result.rs != 1) {
						var params = "memId="+$("#joinMemId").val()+"&"+
										"memName="+$("#joinMemName").val()+"&"+
										"memEmail="+$("#joinMemEmail").val()+"&"+	
										"memPwd="+hex_sha512($("#joinMemPwd").val()).toString()+"&"+	
										"memPwdChck="+hex_sha512($("#joinMemPwdCfm").val()).toString()+"&"+	
										"memCloudAgr="+$("#memCloudAgr").val()+"&"+
										"memInfoAgr="+$("#memInfoAgr").val()+"";

						$.ajax({
							url : '/member/insertSignMem.do',
							type : 'POST',
							data : params,	
							async:false,	
							dataType : 'json',
							success : function(result) {
								if (result.RS == "done") {
									/*alert('회원가입이 완료되었습니다.인증 메일이 발송되었습니다.인증 절차를 진행해주세요.');
									location.reload();*/
									$.ajax({
										url : '/member/sendRegistAuthEmail.do',
										type : 'POST',
										data : params,
										async:false,
										dataType : 'json',
										success : function(result2) {
											if (result2.rs == "complete") {
												D_MEMBER.openAlert($.i18n.t('Login.popper.join.alert_message.join_validation.success'), $.i18n.t('Login.popper.join.alert_message.join_validation.success2'), "success", function() {
													location.reload();
												});
											}
										}
									});

								}
							}
						});

					} else {
						D_MEMBER.openAlert($.i18n.t('Login.popper.join.alert_message.join_validation.alreadyExist'), "", "error", function() { });
						return false;
					}
				}
			});
		}
		,openModal:function(id){
			$("#"+id).modal("show");
		}
		
	},
	FINDINFO :{
		excuteFindPwd:function(){
			
			//validator 에러 메세지를 alert로 실행
			$.validator.setDefaults({ onkeyup:false, onclick:false, onfocusout:false, showErrors:function(errorMap, errorList){ if(this.numberOfInvalids()) { alert(errorList[0].message); } } });

			$("#memInfoForm").validate({
				rules:{
					  'findMemId':{
						  required:true,
					  },
					  'findMemName':{
						  required:true,
					  },
					  'findMemEmail':{
						  required:true,
						  email:true
					  }
				  },
				  messages:{
					  findMemId : {
						  required : $.i18n.t('Login.popper.findpwd.alert_message.no_id')
					  },
					  findMemName : {
						  required : $.i18n.t('Login.popper.findpwd.alert_message.no_name')
					  },
					  findMemEmail : {
						  required : $.i18n.t('Login.popper.findpwd.alert_message.no_email'),
						  email : $.i18n.t('Login.popper.findpwd.alert_message.no_email_reg')
					  }
				  },
				  submitHandler(form){
					  var param=$("#memInfoForm").serialize();
					  /*var param=$("#memInfoForm").serializeArray();
					  var jsonStr=JSON.stringify(param).replace("[","").replace("]","");*/
						$.ajax({
							url : '/member/sendTempPwdEmail.do',
							type : 'POST',
							data : param,
							dataType : 'json',
							async : false,
							success : function(result) {
								if(result.rs=="complete"){
									D_MEMBER.openAlert($.i18n.t('Login.popper.findpwd.alert_message.success'), $.i18n.t('Login.popper.findpwd.alert_message.success2'), "success", function() {
										location.reload();
									});
								}else if(result.rs=="fail"){
									D_MEMBER.openAlert($.i18n.t('Login.popper.findpwd.alert_message.no_match_id'), "", "error", function() { });
								}else if(result.rs=="error"){
									D_MEMBER.openAlert($.i18n.t('Login.popper.findpwd.alert_message.error'), $.i18n.t('Login.popper.findpwd.alert_message.error2'), "error", function() { });
								}
							}
						});
				  }
			  });
		}
	},
	RENEWPWD:{
		chgCurrentPwd : function(){
			var sessId = $("#sessionId").val();
			var sessionEmail = $("#sessionEmail").val();
			var newPwd =$("#newPwd").val();
			var confNewPwd =$("#confNewPwd").val();
			//validator 에러 메세지를 alert로 실행
			$.validator.setDefaults({ onkeyup:false, onclick:false, onfocusout:false, showErrors:function(errorMap, errorList){ if(this.numberOfInvalids()) { 
				D_MEMBER.openAlert(errorList[0].message,"","error",function(){});
			} } });
			$.validator.addMethod("notEqualTo", function(value, element, param) {
				 return this.optional(element) || value != param;
			}, "Please specify a different (non-default) value");
			
			$("#chgCurrentPwd").validate({
				rules:{
					  'curPwd':{
						  required:true,
						  remote:{
							url:"/member/chkPassword.do",
							type:"POST",
							data:{
								curPwd:function(){
									return hex_sha512($("#curPwd").val());
								}
							}
						  }
					  },
					  'newPwd':{
						  required:true,
					  },
					  'confNewPwd':{
						  required:true,
						  equalTo: 'input[name="newPwd"]'
					  }
				  },
				  messages:{
					  curPwd : {
						  required : "현재 비밀번호를 입력해주세요.",
						  minlength : "ID는 최소 6자리입니다.",
						  remote : "현재 비밀번호가 \n일치하지 않습니다."
					  },
					  newPwd : {
						  required : "새 비밀번호를 입력해주세요.",
						  regex : "올바른 비밀번호 형식이 아닙니다."
					  },
					  confNewPwd : {
						  required : "새 비밀번호 확인를 입력해주세요.",
						  equalTo:"새 비밀번호가 일치하지 않습니다."
						
					  }
				  },
				  submitHandler(form){
						var pwdRule = /(?=.*[~`!@#$%\^&*()-+=]{1,50})(?=.*[0-9]{1,50})(?=.*[a-zA-Z]{1,50}).{9,50}$/;
						if(pwdRule.test($("#newPwd").val())==false){
							D_MEMBER.openAlert("올바른 비밀번호 형식이 아닙니다.","","info",function(){$("#newPwd").focus();});
							return false;
						}else if(D_MEMBER.SIGNUP.checkPasswordContinued($("#newPwd").val())){
							D_MEMBER.openAlert("올바른 비밀번호 형식이 아닙니다.","연속된 문자(abcd,1234) 혹은<br>키보드 상 연속된 배열(asdf,qwer)로<br>구성된 비밀번호는 사용할 수 없습니다.","info",function(){return false;});
							return false;
						}else if((sessId == $("#newPwd").val()) || (sessionEmail != "" && sessionEmail.split("@")[0] == $("#newPwd").val())){
							D_MEMBER.openAlert("올바른 비밀번호 형식이 아닙니다.","아이디, 이메일과 동일한 비밀번호는 사용할 수 없습니다.","info",function(){return false;});
							return false;
						}else if(D_MEMBER.SIGNUP.checkPasswordId($("#newPwd").val(),sessId)){
							D_MEMBER.openAlert("올바른 비밀번호 형식이 아닙니다.","아이디가 일부 포함된 비밀번호는 사용할 수 없습니다.","info",function(){return false;});
							return false;
						}
						$.ajax({
							url : '/member/renewPwd.do',
							type : 'POST',
							data : {
								id:sessId,
								newPwd:hex_sha512($("#newPwd").val())
								},
							dataType : 'json',
							async : false,
							success : function(result) {
								if(result.rs=="complete"){
									D_MEMBER.openAlert("성공적으로 비밀번호가 \n변경되었습니다.","다시 로그인해주세요.","success",function(){
										location.replace("../main/main.do");
									});

								}else if(result.rs="same"){
									D_MEMBER.openAlert("현재 비밀번호와 변경하시려는 \n새 비밀번호가 같습니다.","다른 비밀번호를 입력해주세요.","error",function(){});
								}else if(result.rs="fail"){
									D_MEMBER.openAlert("관리자에게 문의하세요.","dtwincloud@egiskroea.com","error",function(){});
								}
							}
						});
				  }
			  });
		}
	},
	OTP :{
		xtimer:null,
		remaining:null,
		init : function(){
			//전송을 누른 경우
			$('#otpCreate').on('click',function(){
				clearTimeout(D_MEMBER.OTP.xtimer);
				$("#otpNum").val("");
				D_MEMBER.OTP.remaining = 180; //3분 설정
				D_MEMBER.OTP.timerOn = true; //타이머온
				D_MEMBER.OTP.createOTPNumber();
				D_MEMBER.OTP.xtimer = D_MEMBER.OTP.timer(D_MEMBER.OTP.remaining);
			});
			//인증하기를 누른 경우
			$('#otpAuthentication').on('click',function(){
				D_MEMBER.OTP.verifyOTPNumber();
			});
			
			
		},
		createOTPNumber:function(){ //otp발급 함수
			$.ajax({
				url : '/member/createOTP.do',
				type : 'POST',
				dataType : 'json',
				success : function(result) {
					if(result.rs=="complete"){
						LOG_TRACKER.write("12","1","2CH 인증요청{ID:"+result.sessId+"}");
						D_MEMBER.openAlert("OTP발급 완료되었습니다.","계정 메일로 전송된 번호를 입력해주세요.","success",function(){});
					}else{
						D_MEMBER.openAlert("OTP발급이 실패하였습니다.","[재전송] 버튼을 눌러 다시 시도해주시기 바랍니다.","error",function(){});
						clearTimeout(D_MEMBER.OTP.xtimer);
					}

				}
			});

		},
		verifyOTPNumber:function(){
			var otpNum = $('#otpNum').val();
			var timediff = null;
			$.ajax({
				url : '/member/verifyOTP.do',
				type : 'POST',
				data : {"otpNum":otpNum},
				dataType : 'json',
				async : false,
				success : function(result) {
					timediff = result.timediff;
					if(result.rs=="complete"){
						D_MEMBER.LOGIN.loginSession();
					}else if(result.rs=="timeover"){
						D_MEMBER.openAlert("OTP기한이 만료되었습니다.","[재전송] 버튼을 눌러 다시 시도해주시기 바랍니다.","error",function(){});
					}else{
						D_MEMBER.openAlert("OTP인증에 실패하였습니다.","OTP번호를 정확히 입력해주세요.","error",function(){$('#optNum').focus();});
					}
				}
			});

		},
		timer : function(remaining){

			var m = Math.floor(remaining / 60);
			var s = remaining % 60;

			m = m < 10 ? '0' + m : m;
			s = s < 10 ? '0' + s : s;
			document.getElementById('timer').innerHTML = m + '분 ' + s + '초';
			remaining -= 1;

			if(remaining >= 0) {
				var timer = setTimeout(function() {
					D_MEMBER.OTP.xtimer = D_MEMBER.OTP.timer(remaining);
				}, 1000);
				return timer;
			}
			// Do timeout stuff here
			document.getElementById("timer").innerHTML = "시간초과";
			D_MEMBER.openAlert("OTP기한이 만료되었습니다.","[재전송] 버튼을 눌러 다시 시도해주시기 바랍니다.","error",function(){});
			
		}
	},
	TIMEOUT:{
			sessionWorkerInit:function(){
				const myWorker = new Worker('/assets/js/global/sessionWorker.js');
				myWorker.postMessage('start');
				myWorker.postMessage({"sessionExpiry":getCookie("sessionExpiry"),"clientTimeOffset":getCookie("clientTimeOffset")});
				
				myWorker.onmessage = e => {
					if(e.data === "modalShow") {
					 	$('#sessionModal').modal('show');
					 	var seconds = parseInt(document.getElementById('eg-remainTime').innerText);
						myWorker.postMessage({"timerNum":seconds});
				  	}
				  	if(typeof e.data === 'number') {
						document.getElementById('eg-remainTime').innerText = e.data;
				  	}
				  	if(e.data === "sessionExpired") {
						document.getElementById('eg-remainTime').innerText = 0;
					 	D_MEMBER.TIMEOUT.checkSessionExpired();
				  	}
				  	if(typeof e.data === 'object' && Object.keys(e.data).includes('setCookie')){
				  		setCookie(Object.keys(e.data.setCookie)[0],e.data.setCookie[Object.keys(e.data.setCookie)[0]]);
				  	}
					if(e.data === "sessionCheck"){
						myWorker.postMessage({"sessionExpiry":getCookie("sessionExpiry"),"clientTimeOffset":getCookie("clientTimeOffset")});
				  	}
				}
				
				$("#sessionExtensionBtn").click(function(){
					myWorker.postMessage('extension');
					$('#sessionModal').modal('hide');
				});
			},
			setTimeOffsetBetweenServerAndClient:function(){
				
				var latestTouch;
				 
					$.ajax({
					 url : '/member/sessionCheck.do',
					 type : 'POST',
					 async: false,
					 success : function(result) {
						 var result =  JSON.parse(result);
						 latestTouch = result.latestTouch;
					 }
				});
					
				latestTouch = latestTouch==null ? null : Math.abs(latestTouch);
				var clientTime = (new Date()).getTime();
				var clientTimeOffset = clientTime - latestTouch;
				setCookie('clientTimeOffset', clientTimeOffset);
				 
			},
			isSessionExpired:function(offset){
				 var sessionExpiry;
				 
					/*$.ajax({
					 url : '/member/sessionCheck.do',
					 type : 'POST',
					 async: false,
					 success : function(result) {
						var result =  JSON.parse(result);
						 sessionExpiry = result.sessionExpiry;
					 }
				});*/
				
				sessionExpiry =  Math.abs(getCookie('sessionExpiry'));
				 var timeOffset = Math.abs(getCookie('clientTimeOffset'));
				 var localTime = (new Date()).getTime();
				 var accessedTime = sessionExpiry - (localTime - timeOffset);
				  setCookie('remainTime',accessedTime);
				 var minutes = new Date(accessedTime).getMinutes()+"";
				var seconds = new Date(accessedTime).getSeconds()+"";
				 seconds = (minutes * 60) + (seconds * 1);
				if(minutes.length == 1) minutes = "0"+minutes;
				if(seconds.length == 1) seconds = "0"+seconds;
				//$("#remainTime").text(minutes+":"+seconds);
				document.getElementById('eg-remainTime').innerText = seconds;
		
				if(accessedTime <= 0){
					document.getElementById('eg-remainTime').innerText = 0;
					clearTimeout(timerRemainId);
					clearTimeout(timer);
					D_MEMBER.TIMEOUT.checkSessionExpired();
				}
				
				return localTime - timeOffset > (sessionExpiry-(offset||0));

			},
			checkSessionExpired:function(){
					LOG_TRACKER.write('18','1','세션 만료:{Mid:'+D_MEMBER.MID+'}');
					$.ajax({
						url:"/member/logout.do",
						dataType:'json',
						success:function(result){
							
						}
					 });
					Swal.fire({
							html: '<p style="font-size:20px;">오랜시간 동안 사용하지 않아  접속이 종료 되었습니다.</br> 다시 로그인해주십시오.</p>',
							//text: '다시 로그인해주십시오.',
							imageUrl: '/assets/images/img-disconnected.png',
							imageWidth: 280,
							imageHeight: 280,
							width: '800px',
							confirmButtonText: '로그인페이지로 이동',
							customClass: {
							  container: 'my-swal'
							}
					  }).then(function () {
							  D_MEMBER.logout();
							  location.href='/';
					  });
					$( '.my-swal .swal2-confirm' ).addClass( 'btn btn-primary btn-lg' );

			},
			checkSessionRemainTime:function(){
				var seconds = parseInt(document.getElementById('eg-remainTime').innerText);
				seconds = seconds - 1;
		
				 document.getElementById('eg-remainTime').innerText = seconds;
				  if(seconds > 0) timerRemainId = setTimeout('D_MEMBER.TIMEOUT.checkSessionRemainTime()', 1000);
				  else {
					  clearTimeout(timerRemainId);
					  D_MEMBER.TIMEOUT.checkSessionExpired();
				  }
		
			},
			checkSessionTimeout:function(){
				var isTimeout = D_MEMBER.TIMEOUT.isSessionExpired(60*1000);  //세션만료예정시간을 60초 앞당겨서 검사
				if(isTimeout === true){	
					 $('#sessionModal').modal('show');
					D_MEMBER.TIMEOUT.checkSessionRemainTime();	
					timer = setInterval(function(){	
						if(!D_MEMBER.TIMEOUT.isSessionExpired(60*1000)){   	 	
							 D_MEMBER.TIMEOUT.onClickTimeExtension();
						 }
					},10000); 	
				}  else {
					 setTimeout('D_MEMBER.TIMEOUT.checkSessionTimeout()', 10*1000);
				 }

			},
			onClickTimeExtension:function(){
				$.ajax({
					url : '/member/sessionRefresh.do',
					type : 'POST',
					success : function(result) {
						$('#sessionModal').modal('hide');
						clearInterval(timer);
						clearTimeout(timerRemainId);
						D_MEMBER.TIMEOUT.checkSessionTimeout();
					}
				});
			}
	}
};