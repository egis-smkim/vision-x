/**
 * 
 */
var D_TRASLATION = {
	global:{
		language:'ko',//default언어는 ko
		userLanguage:''
	},
	init:async function(pageName,language){ //다른 모듈화된 코드의 비동기 처리로 인해 alert 메세지에 로딩되어야할 json값들이 초기화되지않을 수 있기때문에 기다리도록 변경 -->json문자열이 필요한 시기보다 먼저 호출되어야함.
		//해당 라이브러리 API 실행
		await D_TRASLATION.initI18N(pageName,language);
	},
	initI18N:function(pageName,language){
		if(language==undefined || language == null || language ==''){
			D_TRASLATION.global.userLanguage = D_TRASLATION.getBroswerLang();//현재 브라우저 언어로 초기화	
		}else{
			D_TRASLATION.global.userLanguage = language;//세션에 저장된 로그인시 설정된 언어 값으로 초기화
		}
		$.i18n.init({
 	      lng : D_TRASLATION.global.userLanguage,
	      debug: true,//로그용
	      fallbackLng : D_TRASLATION.global.userLanguage, // 실패할 경우 언어
	      resGetPath : '/assets/json/locales/'+pageName+'/'+'__lng__.json', // 위에서 설정한 lng
		  }, function(t) {
		    $('html').i18n();
		  });
	},
	changeLang: async function(lang){
		//setLng이 실행 되는 동안에 i18n() 함수를 호출하는 경우 문제 발생.
		//확인 결과, setLng이 비동기로 실행되어있어서 changLang 함수를 비동기로 선언하고 setLng의 결과를 기다리도록 변경 
		await $.i18n.setLng(lang);
		D_TRASLATION.global.userLanguage = lang;
		D_MEMBER.setCookie("lang", lang, 60); 
     	$('html').i18n();

	   	$("#krSlide").show();
   		$("#engSlide").hide();
   		$('#krSlide').owlCarousel();
		if(D_MEMBER.getCookie("lang") =="en-US") {
	    	$("#krSlide").hide();
	    	$("#engSlide").show();
	    	$('#engSlide').owlCarousel();
        }
	},
	getBroswerLang : function(){//브라우저에서 설정된 언어정보를 가져옴
		//console.log("User's preferred language:", userLanguage);
		if((navigator.language || navigator.userLanguage).indexOf('ko')>-1){ //크롬의 경우 자동으로 운영체제에서 가져오는 것 같음.
			return 'ko';
		}else{ //다른 언어권인 경우 영어로 디폴트 (한글,영어 밖에 파일이 없음) -->추후 다른 언어들이 추가된다면 여기서 분기하면 됨
			return 'en-US';
		}
	},
	getSystemLanguageFromOS:function(){ //운영체제 기준으로 로케일 반환 언어정보 가져옴
		if(Intl.DateTimeFormat().resolvedOptions().locale.indexOf('ko')>-1){
			return 'ko';
		}else{
			return 'en-US';
		}	
	}
} 