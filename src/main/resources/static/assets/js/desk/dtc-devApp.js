var MYAPP = {
	init:function() {
		
	},
	develop:function() {
		
		if($("#appObj").val() == "") {
			COMMON.alert('앱 이름을 입력하세요.','warning',function(){
						return false;
	                });
			$("#appObj").focus();
			return false;
		} else if($("#goodAppName").css("display") == "none") {
			COMMON.alert('앱 이름을 다시 확인 해주세요.','warning',function(){
						return false;
	        });
			$("#appObj").focus();
			return false;
		}

		var formData = new FormData();
		
		formData.append("appObj", $("#appObj").val());
		formData.append("use_ext_libs", $("input[name='useExtLibs']:checked").val());
		formData.append("design_type", $("input[name='design_type']:checked").val());

		$.ajax({
			url:"/desk/developer/developmentTool.do",
			type: "POST",
			data: formData,
			processData: false,
			contentType: false,
			enctype: 'multipart/form-data',
			success:function(result) {
				var result = JSON.parse(result);

				var memId = result.MEM_ID;
	            MYAPP.setCookie("devAppId", memId); 
				MYAPP.setCookie("appObj", result.appObj);
				MYAPP.setCookie("useExtLibs", result.useExtLibs);
				MYAPP.setCookie("design_type", result.design_type);
				var w = window.open("about:blank","_blank");
				w.location.href = "//dev.egiscloud.com/setDevData?devAppId="+memId+"&appObj="+result.appObj+"&useExtLibs="+result.useExtLibs+"&design_type="+result.design_type;
	
			}
		});
	},
	setCookie:function(name,value,days) {
	    var expires = "";
	    if (days) {
	        var date = new Date();
	        date.setTime(date.getTime() + (days*24*60*60*1000));
	        expires = "; expires=" + date.toUTCString();
	    }
	    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
	}
}