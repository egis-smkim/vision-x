/**
 * 
 */
const patterns = { // 정규식 
  username: /^[가-힣|a-zA-Z]{2,10}$/, //한글 영어 포함 2~10글자
  password: /(?=.*[~`!@#$%\^&*()-+=]{1,50})(?=.*[0-9]{1,50})(?=.*[a-zA-Z]{1,50}).{9,50}$/,
  email:  /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i, //email 형식
  phone: /^\d{3}-\d{3}-\d{4}$/, 
  file  : /(.*?)\/(jpg|jpeg|png|bmp)$/
};

let PROF = {
	global : {
		sessionID : null,
		confirmedPwdflg: false,//현재 비밀번호가 사용자가 입력한 비밀번호와 같을 경우,true
		submitBtn : false,//모든 필드가 채워지고 true일 경우 disabled 해제
		keydown_pwd : null,
		username : null,
		chk_password1 : null,
		chk_password2 : null,
		user_email : null
	},
	init : function(){
		//현재 비밀번호를 입력했을 때에,DB값과 입렵값을 대조하기 위한 이벤트
		$("#pre_password").on("change",function(e){
			PROF.checkCurrentPwd();//현재 패스워드를 확인
		});
		
		//새 패스워드 validation체크
		$("#chk_password1").on("change",function(e){
			PROF.checkNewPwdAvailable(); //새 비밀번호 유효성 검사
			PROF.checkPwdsEqual2EachOther();// '새 비밀번호 확인'이 바뀌고 난 후,다시 '새 비밀번호'를 입력하면 패스워드 동일 여부 메세지를 갱신
			//PROF.checkPreviousPwdUsed(); 새 비밀번호가 이전에 사용된 것과 같은지 확인
		});
		
		//패스워드가 서로 일치한지 확인
		$("#chk_password2").on("change",function(e){
			PROF.checkPwdsEqual2EachOther();//새 비밀번호,새 비밀번호 확인용이 서로 같은지 확인
		});
		
		//패스워드가 서로 일치한지 확인
		$("#inputEmail").on("change",function(e){
			PROF.checkEmailAvailable();//새 비밀번호,새 비밀번호 확인용이 서로 같은지 확인
		});
		
		$("#changePwdBtn").on("click",function(){
			$("#changePwdModal").modal({backdrop:'static'});
		});
		
		$("#encryptPwd").on("click",function(){
			if(PROF.checkNewPwdAvailable() && PROF.checkPwdsEqual2EachOther() && PROF.global.confirmedPwdflg){
				if(D_MEMBER.SIGNUP.checkPasswordContinued(PROF.global.chk_password1)){
					COMMON.alert("<span style='font-size:25px'>올바른 비밀번호 형식이 아닙니다.<br>"+
					"<span style='font-size:17px'>연속된 문자(abcd,1234) 혹은<br>키보드 상 연속된 배열(asdf,qwer)로<br>구성된 비밀번호는 사용할 수 없습니다.</span></span>","info",function(){return false;});
					return false;
				}else if(($("#userID").val() == PROF.global.chk_password1) || ($("#inputEmail").val() != "" && $("#inputEmail").val().split("@")[0] == PROF.global.chk_password1)){
					COMMON.alert("<span style='font-size:25px'>올바른 비밀번호 형식이 아닙니다.<br>"+
					"<span style='font-size:17px'>아이디, 이메일과 동일한 비밀번호는 사용할 수 없습니다.</span></span>","info",function(){return false;});
					return false;
				}else if(D_MEMBER.SIGNUP.checkPasswordId(PROF.global.chk_password1,$("#userID").val())){
					COMMON.alert("<span style='font-size:25px'>올바른 비밀번호 형식이 아닙니다.<br>"+
					"<span style='font-size:17px'>아이디가 일부 포함된 비밀번호는 사용할 수 없습니다.</span></span>","info",function(){return false;});
					return false;
				}
				PROF.encryptPwd();
			}
		});
		
		//'변경 저장'클릭시 필드 체크 
		$("#chgComplete").on('click',function(e){
			COMMON.confirm("<span style='color: #595959;'>회원정보를 변경하시겠습니까?</span>",""
			,"info"
			,function(){
				PROF.global.sessionID = $("#userID").val();
				PROF.global.username = $("#username").val();
				if(PROF.checkUsernameAvailable()){
					if(PROF.checkEmailAvailable()){
						var formData = new FormData();
						formData.append("new_mbName", $("#username").val());
						formData.append("new_email", $("#inputEmail").val());
						
						$.ajax({
							url:"/desk/updateProfile.do",
							type: "POST",
							data: formData,
							processData: false,
							contentType: false,
							success:function(result) {
								var result=JSON.parse(result);
								if(result.rs == "complete"){
									COMMON.alert("변경되었습니다.\n다시 로그인하여주십시오.","success",function(){
										//location.reload();
										D_MEMBER.logout();
									});
								}else{
									COMMON.alert("변경이 실패하였습니다\n잠시 후 다시 시도해주세요.","error",function(){location.reload();});
								}
							}
						});
					}
					else{
						COMMON.alert("이메일 형식이 잘못되었습니다.","error",function(){$("#inputEmail").focus();});
					}
				}else{
					COMMON.alert("사용자명 형식이 잘못되었습니다.","error",function(){$("#username").focus();});
				}
				
			},
			function(){return false;});
			
			/*
			
			let updateConfirm = confirm("정말로 변경하시겠습니까?")
			if(updateConfirm){
				
				PROF.encryptPwd();//'변경 저장'버튼 클릭시 javascript내의 비밀번호 정보를 전부 암호화해서 submit
			}else{
				alert("변경이 취소되었습니다.")
			}*/
		});
		
		//유저이름 validation체크
		$("#username").on("keyup",function(e){
			PROF.checkUsernameAvailable(); //유저이름 공백과 null,vailidation체크
		})
		
		
		//프로필 '사진변경'클릭시 파일 업로드
		
		$("#profile_img").on("change",function(){
			PROF.profileImgfileUpload();
		})
		
		//'확인용 비밀번호'눈모양 클릭시 비밀번호 보여주기
		$('#eye1').on("mousedown", function(){
			$('#eye1').css('cursor', 'pointer'); 
		    $('#pre_password').attr('type',"text");
		    $(this).attr('class','fa fa-eye-slash fa-lg');
		}).on('mouseup mouseleave', function() {
		    $('#pre_password').attr('type',"password");
		    $(this).attr('class','fa fa-eye fa-lg');
		});
		//'새 비밀번호'눈모양 클릭시 비밀번호 보여주기
		$('#eye2').on("mousedown", function(){
			$('#eye2').css('cursor', 'pointer'); 
		    $('#chk_password1').attr('type',"text");
		    $(this).attr('class','fa fa-eye-slash fa-lg');
		}).on('mouseup mouseleave', function() {
		    $('#chk_password1').attr('type',"password");
		    $(this).attr('class','fa fa-eye fa-lg');
		});
		//'새 비밀번호 확인'눈모양 클릭시 비밀번호 보여주기
		$('#eye3').on("mousedown", function(){
			$('#eye3').css('cursor', 'pointer'); 
		    $('#chk_password2').attr('type',"text");
		    $(this).attr('class','fa fa-eye-slash fa-lg');
		}).on('mouseup mouseleave', function() {
		    $('#chk_password2').attr('type',"password");
		    $(this).attr('class','fa fa-eye fa-lg');
		});
		
		//otp세팅 버튼 클릭 이벤트
		$("#otp_chk").on('click',function(){
	        if($("#otp_chk").is(":checked")){//스위치 변경시 체크가 되어 있으면
	        	$.ajax({
					url : '/desk/updateOTP.do',
					type : 'POST',
					data : {mem_otp_flg:'1',mem_id:$('#userID').val()},
					dataType : 'json',
					success : function(result) {
						if(result.rs=="complete"){
							$('#otp_chk').prop('checked',true);
							COMMON.alert("OTP 설정이 완료되었습니다.","success",function(){});
						}else{
							COMMON.alert("OTP 설정이 실패하였습니다.","error",function(){return;});
						}

					}
				});
	        }else{
	        	$.ajax({ // 스위치 변경시 체크되어있으면
					url : '/desk/updateOTP.do',
					type : 'POST',
					data : {mem_otp_flg:'0',mem_id:$('#userID').val()},
					dataType : 'json',
					success : function(result) {
						if(result.rs=="complete"){
							$('#otp_chk').prop('checked',false);
							COMMON.alert("OTP 설정 해제가 완료되었습니다.","success",function(){});
						}else if(result.rs=="admin"){
							$('#otp_chk').prop('checked',true);
							COMMON.alert("관리자의 경우 OTP 설정을 해제할 수 없습니다.","info",function(){});
						}else{
							COMMON.alert("OTP 설정이 해제가 실패하였습니다.","error",function(){return;});
						}

					}
				});
	        }
	    });

	},
	//현재 DB내의 패스워드와 클라이언트가 입력한 패스워드 확인
	checkCurrentPwd : function(){ 
		
		//PROF.global.keydown_pwd = $("#pre_password").val();
		//PROF.global.keydown_pwd = CryptoJS.SHA256($('#pre_password').val()).toString();   
			
		PROF.global.keydown_pwd = hex_sha512($("#pre_password").val()).toString();	
		/*PROF.global.keydown_pwd = CryptoJS.SHA256($('#pre_password').val()).toString();  */	
		PROF.global.sessionID = $("#userID").val();	
		$.ajax({	
			type: "POST", //요청 메소드 방식	
			url:"/desk/passwordConfirm.do",	
			async:false,	
			data: {pwd:PROF.global.keydown_pwd ,
					id:PROF.global.sessionID},
			dataType:"JSON", //서버가 요청 URL을 통해서 응답하는 내용의 타입
			success : function(result){
				//서버의 응답데이터가 클라이언트에게 도착하면 자동으로 실행되는함수(콜백)
				//let result=JSON.parse(result);
				if(result.rs == "complete") {
					//change시에 class값 초기화
					

					$("#pre_password").attr('class','form-control');
					$("#pre_password").addClass("is-valid");
					PROF.global.submitBtn=true;
					PROF.global.confirmedPwdflg = true;
				}else{
					//change시에 class값 초기화
					$("#pre_password").attr('class','form-control');
					$("#pre_password").addClass("is-invalid");
					PROF.global.submitBtn=false;
					PROF.global.confirmedPwdflg = false;
				}
			},
			error : function(e){
				console.log("통신실패")
				console.log(e);
			}
		});
	},
	
	checkNewPwdAvailable : function () {
		//change시마다 초기화
		$("#chk_password1").attr('class','form-control');
		
		PROF.global.pre_password = $("#pre_password").val();
		PROF.global.chk_password1 = $("#chk_password1").val();
		if(PROF.global.pre_password == null || PROF.global.pre_password == ""){ 
			// null인 경우
			$("#pre_password").focus();
			COMMON.alert("현재 비밀번호를 입력해주세요.","error",function(){});
			return false;
		}
		if(PROF.global.chk_password1 == null || PROF.global.chk_password1 == ""){ 
			// null인 경우
			$("#chk_password1").focus();
			COMMON.alert("새 비밀번호를 입력해주세요.","error",function(){});
			PROF.global.submitBtn=false;
			return false;
		}else{
			if(patterns.password.test(PROF.global.chk_password1)){ 
				//validation체크 통과
				$("#chk_password1").addClass("is-valid");
				PROF.global.submitBtn=true;
				return true;
			}else{
				//validation체크 위배
				$("#chk_password1").addClass("is-invalid");
				PROF.global.submitBtn=false;
				return false;
			}
		}
	},
	checkPwdsEqual2EachOther : function(){
		//change시마다 초기화
		$("#chk_password2").attr('class','form-control');
		
		PROF.global.chk_password1 = $("#chk_password1").val();
		PROF.global.chk_password2 = $("#chk_password2").val();
		
		//패스워드가 서로 일치한지 확인
		if(PROF.global.chk_password1 == PROF.global.chk_password2){
			$("#chk_password2").addClass("is-valid");
			PROF.global.submitBtn=true;
			return true;
		}else{
			$("#chk_password2").addClass("is-invalid");
			PROF.global.submitBtn=false;
			return false;
		}

	},
	
	checkEmailAvailable : function(){
		//change시마다 초기화
		$("#inputEmail").attr('class','form-control');
		
		PROF.global.user_email = $("#inputEmail").val();

		if(PROF.global.user_email==null||PROF.global.user_email == ""){ // email이 null인 경우
			$("#invalid_email").text("이메일을 입력해주세요");
			$("#inputEmail").addClass("is-invalid");
			$("#inputEmail").focus();
			PROF.global.submitBtn=false;
			return false;
		}else{
			if(patterns.email.test(PROF.global.user_email)){ //validation체크 통과
				$("#inputEmail").addClass("is-valid");
				PROF.global.submitBtn=true;
				return true;
			}else{ //validation체크 위배
				$("#inputEmail").addClass("is-invalid");
				$("#invalid_email").text("이메일 형식을 지켜주세요.");
				PROF.global.submitBtn=false;
				return false;
			}
		}
	},
	
	//이전에 사용된 패스워드가 사용됬는지 확인하기 위한 메소드
	checkPreviousPwdUsed : function(){
		
		//change시마다 초기화
		$("#chk_password1").attr('class','form-control');
		
		/*$.ajax({
			type: "POST", //요청 메소드 방식
			url:"/desk/checkPreviousPwd.do",
			data: keydown_pwd,
			dataType:"JSON", //서버가 요청 URL을 통해서 응답하는 내용의 타입
			success : function(result){
				//서버의 응답데이터가 클라이언트에게 도착하면 자동으로 실행되는함수(콜백)
				let result=JSON.parse(result);
				if(result.rs == "complete") {
					$("#pre_password").addClass("is-valid");
					PROF.global.submitBtn=true;
				}else{
					$("#pre_password").addClass("is-invalid");
					PROF.global.submitBtn=false;
				}

			},
			error : function(e){
				console.log("통신실패")
				console.log(e);
			}
		});*/
	},
	
	//사용자명 validation체크
	checkUsernameAvailable : function(){ 
		//change시마다 초기화
		$("#username").attr('class','form-control');
		
		PROF.global.username = $("#username").val();

		if(PROF.global.username==null||PROF.global.username == ""){ // email이 null인 경우
			$("#invalid_username").text("회원명을 입력해 주세요.");
			$("#username").addClass("is-invalid");
			PROF.global.submitBtn=false;
			return false;
		}else{
			if(patterns.username.test(PROF.global.username)){ //validation체크 통과
				$("#username").addClass("is-valid");
				PROF.global.submitBtn=true;
				return true;
			}else{ //validation체크 위배
				$("#invalid_username").text("회원명 형식을 지켜주세요.(한글 영어 포함 2~10글자)");
				$("#username").addClass("is-invalid");
				PROF.global.submitBtn=false;
				return false;
			}
		}
	},
	
	
	//비밀번호 암호처리 및 수정요청
	encryptPwd : function(){
		PROF.global.pre_password = hex_sha512($("#pre_password").val()).toString();
		PROF.global.chk_password1 = hex_sha512($("#chk_password1").val()).toString();
		PROF.global.chk_password2 = hex_sha512($("#chk_password2").val()).toString();
		/*PROF.global.pre_password = CryptoJS.SHA256($('#pre_password').val()).toString();
		PROF.global.chk_password1 = CryptoJS.SHA256($('#chk_password1').val()).toString();
		PROF.global.chk_password2 = CryptoJS.SHA256($('#chk_password2').val()).toString();*/
		

	   updataData = {mem_Id:PROF.global.sessionID,
			   		new_pwd:PROF.global.chk_password1
			   		};
	   
	   $.ajax({
			type: "POST", //요청 메소드 방식
			url:"/desk/updatePassword.do",
			data: updataData,
			dataType:"JSON", //서버가 요청 URL을 통해서 응답하는 내용의 타입
			success : function(result){
				//서버의 응답데이터가 클라이언트에게 도착하면 자동으로 실행되는함수(콜백)
				//let result=JSON.parse(result);
				if(result.rs == "complete") {
					COMMON.alert("수정이 완료되었습니다.","success",function(){location.reload();});
				}else{
					COMMON.alert("수정이 실패되었습니다.\n잠시 후 다시 시도해 주세요.","error",function(){location.reload();});
				}
			},
			error : function(e){
				COMMON.alert("수정이 실패되었습니다.\n잠시 후 다시 시도해 주세요.","error",function(){location.reload();});
				console.log("통신실패")
				console.log(e);
			}
		});		
	},
	
	//프로필 이미지 업로드 
	profileImgfileUpload : function(){
		
		let formData = new FormData();
		
		let inputFile = $("#profile_img");
		
		let file = inputFile[0].files[0];
		
		formData.append("uploadFile",file);
		
	 	if (!file.type.match(patterns.file)) { //이미지 파일 확장자 확인 regex 검증
			COMMON.alert("이미지파일 확장자만 업로드 가능합니다.","error",function(){});
            return;
        }else{ //이미지 확장자일 경우에 
        	$.ajax({
				url : '/desk/uploadProfileImg.do',
				enctype: 'multipart/form-data',
				processData : false,
				contentType : false,
				data : formData,
				type : "POST",
				success : function(result){
					COMMON.alert("프로필 사진이 수정되었습니다.","success",function(){location.reload();});
					
				},
				error : function(e){
					COMMON.alert("프로필 사진이 수정이 실패되었습니다.\n잠시 후 다시 시도해 주세요.","error",function(){location.reload();});
				}
			
			});
			console.log(file);
        }
	},
	sendAuthEmail:function(){ //인증번호
		clearTimeout(D_MEMBER.OTP.xtimer);
		D_MEMBER.OTP.remaining = 180; //3분 설정
		$.ajax({
			url : '/member/sendAuthEmail.do',
			type : 'POST',
			dataType : 'json',
			success : function(result) {
				if(result.rs=="complete"){
					D_MEMBER.openAlert("인증 메일이 전송되었습니다.","가입 시 작성한 이메일로 전송된 번호를 입력해주세요.","success",function(){});
					D_MEMBER.OTP.timerOn = true; //타이머온
					D_MEMBER.OTP.xtimer = D_MEMBER.OTP.timer(D_MEMBER.OTP.remaining);
				}else{
					D_MEMBER.openAlert("인증 메일이 전송 실패하였습니다.","[인증 메일 전송] 버튼을 눌러 다시 시도해주시기 바랍니다.","error",function(){});
					clearTimeout(D_MEMBER.OTP.xtimer);
				}

			}
		});
	},
	sendAuth:function(){
		var password = $("#pre_password").val();
		var authNumber = $("#authNumber").val();
		
		if(password == ""){
			COMMON.alert("비밀번호를 입력하세요.","info",function(){});
			return false;
		}else if(authNumber == ""){
			COMMON.alert("2차 인증을 입력하세요.","info",function(){});
			return false;
		}
		PROF.checkCurrentPwd();
		if(PROF.global.confirmedPwdflg){
			var timediff = null;
			$.ajax({
				url : '/member/verifyOTP.do',
				type : 'POST',
				data : {"otpNum":authNumber},
				dataType : 'json',
				async : false,
				success : function(result) {
					timediff = result.timediff;
					if(result.rs=="complete"){
						location.reload();
					}else if(result.rs=="timeover"){
						D_MEMBER.openAlert("OTP기한이 만료되었습니다.","[재전송] 버튼을 눌러 다시 시도해주시기 바랍니다.","error",function(){});
					}else{
						D_MEMBER.openAlert("OTP인증에 실패하였습니다.","OTP번호를 정확히 입력해주세요.","error",function(){$('#optNum').focus();});
					}
				}
			});
		}
		
	}
} 