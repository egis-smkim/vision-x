/**
 * 
 */
var GROUP = {
	editor:null,
	dataTable:0,
	init:function() {

		GROUP.dataTable = $('#groupList').DataTable( {
			"columns": [
    		    { "width": "5%", "orderable": false },
    		    { "width": "15%"},
    		    { "width": "15%", "orderable": false }
    		  ],
	        "order": [[ 1, 'asc' ]]
	    } );
	 
		GROUP.dataTable.on( 'order.dt search.dt', function () {
			GROUP.dataTable.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
	            cell.innerHTML = i+1;
	        } );
	    } ).draw();
	},
	adminInit:function(){
		GROUP.dataTable = $('#requestGroupList').DataTable( {
			"columns": [
    		    { "width": "5%" },
    		    { "width": "25%", "orderable": false},
				{ "width": "15%", "orderable": false},
    		    { "width": "10%"}
    		  ],
	        "order": [[ 0, 'desc' ]]
	    } );

		GROUP.dataTable.on( 'order.dt search.dt', function () {
			GROUP.dataTable.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
	            cell.innerHTML = i+1;
	        } );
	    } ).draw();

		GROUP.dataTable = $('#allGroupList').DataTable( {
			"columns": [
    		    { "width": "5%" },
    		    { "width": "25%", "orderable": false},
				{ "width": "15%", "orderable": false},
    		    { "width": "10%"}
    		  ],
	        "order": [[ 0, 'desc' ]]
	    } );

	 
		GROUP.dataTable.on( 'order.dt search.dt', function () {
			GROUP.dataTable.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
	            cell.innerHTML = i+1;
	        } );
	    } ).draw();
		
	},
	infoInit:function(){
		GROUP.dataTable = $('#GroupMemberList').DataTable( {
			"columns": [
    		    { "width": "5%" },
    		    { "width": "25%", "orderable": false},
				{ "width": "15%", "orderable": false}
    		  ],
	        "order": [[ 0, 'desc' ]]
	    } );

	},
	memberinit:function() {
		GROUP.dataTable = $('#groupMemberList').DataTable( {
			"columns": [
    		    { "width": "5%", "orderable": false },
    		    { "width": "15%"},
    		    { "width": "15%", "orderable": false },
    		    { "width": "15%", "orderable": false },
    		    { "width": "15%", "orderable": false },
    		    { "width": "15%", "orderable": false }
    		  ],
	        "order": [[ 1, 'asc' ]]
	    } );
	 
		GROUP.dataTable.on( 'order.dt search.dt', function () {
			GROUP.dataTable.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
	            cell.innerHTML = i+1;
	        } );
	    } ).draw();
	},
	resignMember:function(mid,flag = true){
		if(flag){
			COMMON.confirm("<span style='color: #595959;'>해당 회원을 탈퇴시키겠습니까?</span>","","info",function(){
				var formData = new FormData();
				formData.append("mid", mid)
				
				$.ajax({
					url:"/desk/groupMember/resignMember.do",
					type: "POST",
					data: formData,
					processData: false,
					contentType: false,
					enctype: 'multipart/form-data',
					success:function(result) {
	
						var result=JSON.parse(result);
	
						if(result.rs == "complete") {
							LOG_TRACKER.write("93","2","그룹원 탈퇴:{MID:"+mid+",GID:"+result.gid+"}");
							COMMON.alert('탈퇴처리되었습니다.',"success",function(){location.reload();});
						}
					}
				});
				
			},function(){
				return false;
			});
		}else{
			COMMON.alert('그룹 관리자는 그룹에서 탈퇴시킬 수 없습니다.',"error",function(){return false});
		}
	},
	updateGroupState:function(gid,state){
		var text="";
		if(state == 1){
			text="<span style='color: #595959;'>그룹 생성 요청을 승인하시겠습니까?<span>";
		} else {
			text="<span style='color: #595959;'>그룹 삭제 요청을 승인하시겠습니까?<span>";
		}
		COMMON.confirm(text,"",
		"info",
		function(){
		
			var formData = new FormData();
				formData.append("state", state);
				formData.append("gid", gid)
				
				$.ajax({
					url:"./updateGroupState.do",
					type: "POST",
					data: formData,
					processData: false,
					contentType: false,
					enctype: 'multipart/form-data',
					success:function(result) {
	
						var result=JSON.parse(result);
	
						if(result.rs == "complete" && state == 1) {
							COMMON.alert('그룹을 생성하였습니다.',"success",function(){
								document.location.href = "/admin/member/group/admin.do";
							});
							
						} else if(result.rs == "complete" && state == -99){
							COMMON.alert('그룹을 삭제하였습니다.',"success",function(){
								document.location.href = "/admin/member/group/admin.do";
							});
							
						}
					}
				});
		},
		function(){
			return false;
		});
		
	},
	DELETE:{
		deleteGroup:function(gid) {
			if(!confirm('정말 삭제하시겠습니까?')) {
				return false;
			}
			
			var formData = new FormData();
			formData.append("control", "deleteGroup");
			formData.append("gid", gid)
			
			$.ajax({
				url:"./deleteGroup.do",
				type: "POST",
				data: formData,
				processData: false,
				contentType: false,
				enctype: 'multipart/form-data',
				success:function(result) {

					var result=JSON.parse(result);

					if(result.rs == "complete") {
						LOG_TRACKER.write("92","2","그룹 삭제:{GID:"+gid+"}");
						alert('삭제 됐습니다.');
						document.location.href = "./list.do";
					}
				}
			});
			
		}
	},
	UPDATE:{
		update:function(gid) {
			if($("#group_name").val() == "") {
				alert('그룹명을 입력하세요.');
				$("#group_name").focus();
				return false;
			}
			var formData = new FormData();
			
			formData.append("control", "updateGroup");
			formData.append("gid", gid);
			
			formData.append("group_name", $("#group_name").val());

			formData.append("group_info", (GROUP.editor.getData() == "") ? "null" : GROUP.editor.getData());

			$.ajax({
				url:"./updateGroup.do",
				type: "POST",
				data: formData,
				processData: false,
				contentType: false,
				enctype: 'multipart/form-data',
				success:function(result) {

					var result=JSON.parse(result);

					if(result.rs == "complete") {
						LOG_TRACKER.write("91","2","그룹 수정:{GID:"+gid+"}");
						alert('변경됐습니다.');
						location.reload();
					}
				}
			});
			
			
		} // End of Update
	},
	INSERT:{
		editContent:null,
		editor:null,
		add:function() {
			if($("#group_name").val() == "") {
				alert('그룹명을 입력하세요.');
				$("#group_name").focus();
				return false;
			}
			
			var formData = new FormData();
			
			formData.append("control", "addGroup");
			
			formData.append("group_name", $("#group_name").val());

			formData.append("group_info", (GROUP.editor.getData() == "") ? "null" : GROUP.editor.getData());

			$.ajax({
				url:"./addGroup.do",
				type: "POST",
				data: formData,
				processData: false,
				contentType: false,
				enctype: 'multipart/form-data',
				success:function(result) {

					var result=JSON.parse(result);

					if(result.rs == "complete") {
						LOG_TRACKER.write("90","2","그룹 생성:{GID:"+result.gid+"}");
						alert('그룹이 등록됐습니다.');
						document.location.href = "./list.do";
					}
				}
			});
		}// End of Insert
	}
}