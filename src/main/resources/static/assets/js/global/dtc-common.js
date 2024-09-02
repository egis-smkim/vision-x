/**
 *SUBJECT:공통기능 함수
 *AUTHOR:smd
 *COMMENT:ajax,alert,confirm..etc 
 */

var COMMON={
	alert:function(str,type,okFn){
		
		var custom = 'btn btn-outline-dark';
		
		if(type=="success"){
			custom ='btn btn-outline-success';
		}
		
		Swal.fire({
			title :"<h4 class=\"text-secondary\">"+str+"</h4>",
			title :str,
			icon : type,
			allowOutsideClick: false,
			customClass : {
				confirmButton : custom,
				content:'mt-0 mb-0'
			},
			padding:'0.5rem',
			width:'450px',
			allowEscapeKey:false,
			allowEnterKey:false
			
		}).then(function(result){
			
			if(result.value){
				okFn();
			}
		});
	},
	alertFilter:function(str,type,okFn){

		var custom = 'btn btn-outline-dark';

		if(type=="success"){
			custom ='btn btn-outline-success';
		}

		Swal.fire({
			title :"<h4 class=\"text-secondary\">"+"유효하지 않은 식이 입력되었습니다."+"</h4>",
			text :str,
			icon : type,
			allowOutsideClick: false,
			customClass : {
				confirmButton : custom,
				content:'mt-0 mb-0',
				title:'alert_container'
			},
			padding:'0.5rem',
			width:'450px',
			allowEscapeKey:false,
			allowEnterKey:false

		}).then(function(result){

			if(result.value){
				okFn();
			}
		});
	},
	confirm:function(str,alertTxt,type,okFn,cancelFn){
		
		Swal.fire({
			title : "<h4 class=\"text-white\">"+str+"</h4>",
			text  :alertTxt,
			icon : type,
			allowOutsideClick: false,
			showCancelButton: true,
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
		
	},
	blockUIdiv:function(id,txt){
		
		$("#"+id).block({
		      message: "<div class=\"sk-wave sk-primary mx-auto\"><div class=\"sk-wave-rect\"></div><div class=\"sk-wave-rect\"></div><div class=\"sk-wave-rect\"></div><div class=\"sk-wave-rect\"></div><div class=\"sk-wave-rect\"></div></div><span class=\"text-white ts-11 mt-2 pt-2\" id=\"prgTextInfo\">"+txt+"</span>",
		      css: {
		        backgroundColor: 'transparent',
		        border: '0'
		      },
		      overlayCSS:  {
		        backgroundColor: "#22252B",
		        opacity: 0.8
		      }
		 });
	},
	unblockUIdiv:function(id){
		$("#"+id).unblock();
	},
	isEmpty:function(value){
		if( value == "" || value == null || value == undefined || ( value != null && typeof value == "object" && !Object.keys(value).length ) ){
			return true; 
		}else{
			return false; 
		}
		
	},
	alertMove:function(){
		let h = document.getElementsByClassName('sidenav-link');
		
		for(let i=0; i<h.length; i++){
			let j = h[i];
			j.href='#';
		}

		$("#dontmove").modal("show");
	}
};
