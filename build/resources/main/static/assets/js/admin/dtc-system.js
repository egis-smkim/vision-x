var SYSTEM = {
	checkedSystem:function(state){
			
		if($("#server_name").val() == "") {
			COMMON.alert('서버명을 입력하세요','info',function(){
				$("#server_name").focus();
			});
			return false;
		}
		
		if($("#server_cloud").val() == "default") {
			COMMON.alert('클라우드를 선택하세요','info',function(){
				$("#server_cloud").focus();
			});
			return false;
		}
		
		if($("#server_environment").val() == "default") {
			COMMON.alert('환경을 선택하세요','info',function(){
				$("#server_environment").focus();
			});
			return false;
		}
			
		if(state == 'insert'){
			SYSTEM.insert();
		}
		else {
			SYSTEM.update();
		}
		
	},
	insert:function(){
		
		var formData = new FormData();
		formData.append("server_name", $("#server_name").val());
		formData.append("server_cloud", $("#server_cloud").val());
		formData.append("server_environment", $("#server_environment").val());
		
		$.ajax({
		url:"/admin/system/insert.do",
		type: "POST",
		data: formData,
		processData: false,
		contentType: false,
		enctype: 'multipart/form-data',
		success:function(result) {
				var result=JSON.parse(result);
				if(result.rs == "complete") {
					COMMON.alert("시스템 정보가 추가되었습니다.","success",function(){
							document.location.href = "./list.do"
						});
					
				}else {
					COMMON.alert("시스템 정보 추가에 실패하였습니다.","error",function(){return false;});
				}
				
			}
		});
		
	},
	update:function(){
		
		var formData = new FormData();			
		var urlParams = new URL(location.href).searchParams;

		formData.append("system_id", urlParams.get('system_id'));
		formData.append("server_name", $("#server_name").val());
		if($("#server_storage").val() != 'default')
			formData.append("server_storage", $("#server_storage").val());
		formData.append("server_cloud", $("#server_cloud").val());
		formData.append("server_environment", $("#server_environment").val());
		
		$.ajax({
		url:"/admin/system/update.do",
		type: "POST",
		data: formData,
		processData: false,
		contentType: false,
		enctype: 'multipart/form-data',
		success:function(result) {
				var result=JSON.parse(result);
				if(result.rs == "complete") {
					COMMON.alert("시스템 정보가 변경 되었습니다.","success",function(){
							document.location.href = "./list.do"
						});
					
				}else {
					COMMON.alert("시스템 정보 변경에 실패하였습니다.","error",function(){return false;});
				}
				
			}
		});
	},
	STORAGE :{
		checkedStorage:function(state){
			
			if(state == 'insert'){
				if($("#storage_volume").val() == "") {
					COMMON.alert('볼륨 용량을 입력하세요','info',function(){
						$("#storage_volume").focus();
					});
					return false;
				}
				
			}
			
			if($("#storage_mount_orign").val() == "") {
				COMMON.alert('실제 마운트 경로를 입력하세요','info',function(){
					$("#storage_mount_orign").focus();
				});
				return false;
			}

			if($("#storage_mount").val() == "") {
				COMMON.alert('마운트 경로를 입력하세요','info',function(){
					$("#storage_mount").focus();
				});
				return false;
			}
			
			if(state == 'insert'){
				SYSTEM.STORAGE.insert();
			}
			else {
				SYSTEM.STORAGE.update();
			}
		
		},
		insert:function(){
			var formData = new FormData();
			
			formData.append("server_id", $("#storage_server").val());
			formData.append("volume_size", $("#storage_volume").val());
			formData.append("orign_mount_path", $("#storage_mount_orign").val());
			formData.append("mount_directory", $("#storage_mount").val());
			
			$.ajax({
			url:"/admin/system/storage/insert.do",
			type: "POST",
			data: formData,
			processData: false,
			contentType: false,
			enctype: 'multipart/form-data',
			success:function(result) {
					var result=JSON.parse(result);
					if(result.rs == "complete") {
						COMMON.alert("스토리지가 추가되었습니다.","success",function(){
								document.location.href = "./list.do"
							});
						
					}else {
						COMMON.alert("스토리지 추가에 실패하였습니다.","error",function(){return false;});
					}
					
				}
			});
		},
		update:function(){
			var formData = new FormData();			
			var urlParams = new URL(location.href).searchParams;

			formData.append("storage_id", urlParams.get('storage_id'));
			formData.append("orign_mount_path", $("#storage_mount_orign").val());
			formData.append("mount_directory", $("#storage_mount").val());
			
			$.ajax({
			url:"/admin/system/storage/update.do",
			type: "POST",
			data: formData,
			processData: false,
			contentType: false,
			enctype: 'multipart/form-data',
			success:function(result) {
					var result=JSON.parse(result);
					if(result.rs == "complete") {
						COMMON.alert("스토리지가 변경되었습니다.","success",function(){
								document.location.href = "./list.do"
							});
						
					}else {
						COMMON.alert("스토리지 변경에 실패하였습니다.","error",function(){return false;});
					}
					
				}
			});
		}
		
			
	},
	MAPSERVER:{
		add:function(){
			$("#serverTitle").html("2D 지도 서버 IP 추가");
			$("#insertBtn").css("display","inline");
			$("#updateBtn").css("display","none");
			$("#serverChangeDiv").css("display","block");
			$("#currentServerDiv").css("display","none");
			$("#input_server_ip").val("");
			
		},
		cancel:function(){
			$("#serverChangeDiv").css("display","none");
		},
		insert:function(){
			
			var filter = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;

			if (filter.test($("#input_server_ip").val()) == false){
			  	COMMON.alert("유효하지않은 IP 입니다.","error",function(){return false;});
			  	return false;
			}
			
			var formData = new FormData();
			formData.append("server_ip", $("#input_server_ip").val());
			
			$.ajax({
			url:"/admin/system/mapserver/add.do",
			type: "POST",
			data: formData,
			processData: false,
			contentType: false,
			enctype: 'multipart/form-data',
			success:function(result) {
					var result=JSON.parse(result);
					if(result.rs == "complete") {
						COMMON.alert("2D 지도서버가 추가되었습니다.","success",function(){
								document.location.reload();
							});
						
					}else {
						COMMON.alert("2D 지도서버가 추가에 실패하였습니다.","error",function(){return false;});
					}
					
				}
			});
		},
		edit:function(server_id){
			
			var formData = new FormData();
			formData.append("server_id", server_id);
			
			$.ajax({
			url:"/admin/system/mapserver/view.do",
			type: "POST",
			data: formData,
			processData: false,
			contentType: false,
			enctype: 'multipart/form-data',
			success:function(result) {
					var result=JSON.parse(result);
					if(result.rs == "complete") {
						$("#current_server_ip").val(result.mapserverVO.server_ip);
						
						$("#serverTitle").html("2D 지도 서버 정보 변경");
						$("#insertBtn").css("display","none");
						$("#updateBtn").attr("onclick","SYSTEM.MAPSERVER.update("+server_id+")");
						$("#updateBtn").css("display","inline");
						$("#serverChangeDiv").css("display","block");
						$("#currentServerDiv").css("display","contents");
						$("#input_server_ip").val("");
					}
				}
			});
			
		},
		update:function(server_id){
			
			var filter = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;

			if (filter.test($("#input_server_ip").val()) == false){
			  	COMMON.alert("유효하지않은 IP 입니다.","error",function(){return false;});
			  	return false;
			}
			
			var formData = new FormData();
			formData.append("server_id", server_id);
			formData.append("server_ip", $("#input_server_ip").val());
			
			$.ajax({
			url:"/admin/system/mapserver/update.do",
			type: "POST",
			data: formData,
			processData: false,
			contentType: false,
			enctype: 'multipart/form-data',
			success:function(result) {
					var result=JSON.parse(result);
					if(result.rs == "complete") {
						COMMON.alert("2D 지도서버 IP가 변경되었습니다.","success",function(){
								document.location.reload();
							});
						
					}else {
						COMMON.alert("2D 지도서버 IP 변경에 실패하였습니다.","error",function(){return false;});
					}
					
				}
			});
		},
		manage:function(server_ip, container_name, manage){
			var formData = new FormData();
			formData.append("server_ip", server_ip);
			formData.append("container_name", container_name);
			formData.append("manage", manage);
			var text = "시작";
			if(manage == "stop")
				text = "중지";
			
			$.ajax({
			url:"/admin/system/mapserver/manage.do",
			type: "POST",
			data: formData,
			processData: false,
			contentType: false,
			enctype: 'multipart/form-data',
			success:function(result) {
					var result=JSON.parse(result);
					if(result.rs) {
						COMMON.alert("컨테이너가 "+text+"되었습니다.","success",function(){
								document.location.reload();
							});
						
					}else {
						COMMON.alert("컨테이너 "+text+"에 실패하였습니다.","error",function(){return false;});
					}
				}
			});
		}
	}
	
}