var LOG_TRACKER = {
	init:function() {

	},
	write:function(log_code, log_level, message) {
		var formData = new FormData();
		formData.append("log_code", log_code);
		formData.append("log_level", log_level);
		formData.append("message", message);

		$.ajax({
			url:"/logger/addLogTracker.do",
			type: "POST",
			data: formData,
			processData: false,
			contentType: false,
			enctype: 'multipart/form-data',
			success:function(result) {
				return false;
				console.log(result.rs)
				//var result=JSON.parse(result);
				if(result.rs == "complete") {

					return false;
				}
			}
		});
	},
	getIP:function(){
		var clientIP = null;
		$.ajax({
			  dataType: "json",
			  url: "https://ipapi.co/json/",
			  success: function(data){
			    clienIP = data.ip;
			    return clientIP;
			  }
			})
	}
}
