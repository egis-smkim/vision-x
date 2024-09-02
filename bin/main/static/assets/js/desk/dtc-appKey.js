/**
 * 
 */

var APP_KEY = {
	global : {
		ipChkFlg : false
	},
	init : function() {

		//$('.datatables-demo').dataTable();

		$('#regValidCheck').on('change',function(e){ //ip input박스 이벤트
			let ip = $(this).val();
			APP_KEY.global.ipChkFlg=APP_KEY.checkIpAddr(ip);
		})

	},
	createAppKey : function() {
		$('#metaCreateAppKey').show();
	},
	closeModal : function() {
		$('#metaCreateAppKey').hide();
		$('#metaAppName').val('');
		$('#appDomainNm').val('');
		$('#metaAppsDesc').val('');
		$('#addMetaAppKeyBtn').addClass('disabled');
		//APP_KEY.initAllFulfilledFlag();
	},
	checkAllFulfilled : function() { //추후 input박스 추가 시 필요
		var a = APP_KEY.global.appNameFlg;
		var b = APP_KEY.global.appDomainFlg;
		var c = APP_KEY.global.metAppDesFlg;
		if (a && b && c) {//전부 채워져있을 때
			$('#addMetaAppKeyBtn').removeClass('disabled');
			return true;
		} else {//전부 채워져있지 않을 때
			$('#addMetaAppKeyBtn').addClass('disabled');
			/*var flg = $('#addMetaAppKeyBtn').hasClass('disabled');
			if(!flg){
				$('#addMetaAppKeyBtn').addClass('disabled');
			}*/
			return false;
		}
	},
	createAppServiceKey : function() {
		//var flg = this.checkAllFulfilled();
		var flag = APP_KEY.global.ipChkFlg;
		if (flag) {
			$.ajax({
				url : "/encrypt/encryptHash.do",
				type : "POST",
				dataType : 'text',
				data : $('#appkeyForm').serialize(),
				async : false,
				success : function(result) {
					console.log(result);
					var res = JSON.parse(result);
					if(res.RS=="SUCCESS"){
						
						$('#addMetaAppKeyBtn').addClass('disabled');
						COMMON.alert('인증키가 발행되었습니다.', 'success', function() {
							location.href = "/desk/manage/manageAppKey.do";
						})

					}else{
						
						$('#addMetaAppKeyBtn').addClass('disabled');
						COMMON.alert('이미 발급된 인증키가 존재합니다.삭제 후,시도해주세요.', 'error', function() {
							location.href = "/desk/manage/manageAppKey.do";
						})

					}
					
				}

			});
		} else {
			COMMON.alert('올바른 IP 주소를 입력해 주세요.\n IP버전은 v4입니다.', 'error', function() {
				return false;
			})
		}
	},
	deleteAppKey : function(appkId) {
		var appkeyId = appkId;
		appkeyId = appkeyId.toString();
		Swal.fire({
			title : "<h4 class=\"text-white\">앱키 삭제</h4>",
			text : "등록한 인증키를 삭제하시겠습니까?",
			icon : 'info',
			allowOutsideClick : false,
			showCancelButton : true,
			customClass : {
				confirmButton : 'btn btn-primary mb-3',
				cancelButton : 'btn btn-default mb-3',
				content : 'mt-0 mb-5'
			},
			width : '450px',
			padding : '0.5rem',
			allowEscapeKey : false,
			allowEnterKey : false
		}).then(function(result) {
			if (result.value) {
				$.ajax({
					url : "/desk/manage/deleteAppKey.do",
					type : "POST",
					async : false,
					dataType : 'text',
					data : {
						"appkid" : appkId
					},
					success : function(result) {
						COMMON.alert('인증키가 삭제 되었습니다.', 'success', function() {
							location.href = "/desk/manage/manageAppKey.do";
						})
					}

				});
			}
		});
	},
	republishAppkey : function(mid, appkeyId) {
		Swal.fire({
			title : "<h4 class=\"text-white\">인증키 재발급</h4>",
			text : "등록된 인증키를 \n재발급 하시겠습니까?",
			icon : 'info',
			allowOutsideClick : false,
			showCancelButton : true,
			customClass : {
				confirmButton : 'btn btn-primary mt-2',
				cancelButton : 'btn btn-default mt-2',
				content : 'mt-0 mb-5'
			},
			width : '450px',
			padding : '0.5rem',
			allowEscapeKey : false,
			allowEnterKey : false
		}).then(function(result) {
			if (result.value) {
				let formData = new FormData();

				formData.append("mid", mid);
				formData.append("appkeyId", appkeyId);

				$.ajax({
					url : "/desk/manage/republishAppKey.do",
					type : "POST",
					contentType : false,
					processData : false,
					type : 'POST',
					data : formData,
					success : function(result) {
						COMMON.alert('인증키가 재발급 되었습니다.', 'success', function() {
							location.href = "/desk/manage/manageAppKey.do";
						})
					}

				});
			}
		});
	},
	initAllFulfilledFlag : function() { //입렵값 전체 체크 함수 -- 입력값 추가 시 추후 사용 가능.
		APP_KEY.global.appNameFlg = false;
		APP_KEY.global.appDomainFlg = false;
		APP_KEY.global.metAppDesFlg = false;
	},
	copyAppKey : function(index) { //앱키 복사 함수
		var copyText = document.getElementById("pwd_spn_"+index);
		var textArea = document.createElement("textarea");
		textArea.value = copyText.textContent;
		document.body.appendChild(textArea);
		textArea.select();
		document.execCommand("Copy");
		textArea.remove();
		
		$("#cp_btn_"+index).removeClass('btn-success');
		$("#cp_btn_"+index).addClass('btn-secondary');
		$("#cp_btn_"+index).html('Copied!')
		
	},
	checkIpAddr : function(ip){ //ip v4 체크 함수

		const ipv4_regEx=/(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}/;  // regEx ipv4 정규식
		let enteredIP = ip;
		if(enteredIP==null||enteredIP==''||enteredIP==undefined){//공백인 경우
			COMMON.alert('ip주소가 공백이거나,\n사용할 수 없습니다','error',function(){
				return false;
			})
		}else{//공백이 아닌 경우
			if(ipv4_regEx.test(enteredIP)){ //ip정규식 충족
				if($('#regValidCheck').hasClass('is-invalid')){
					$('#regValidCheck').removeClass('is-invalid');
				}
				$('#regValidCheck').addClass('is-valid');
				return true;
			}else{ //ip정규식 불충족
				if($('#regValidCheck').hasClass('is-valid')){
					$('#regValidCheck').removeClass('is-valid');
				}
				$('#regValidCheck').addClass('is-invalid');
				return false;
			}
		} 
	}

}