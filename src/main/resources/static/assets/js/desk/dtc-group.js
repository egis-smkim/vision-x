var ALL_GROUP = {
	editor:null,
	dataTable:0,
	init:function() {
	
		ALL_GROUP.dataTable = $('#allGroupList').DataTable( {
				"columns": [
	    		    { "width": "5%"},
	    		    { "width": "15%"},
	    		    { "width": "8%", "orderable": false },
	    		    { "width": "40%", "orderable": false },
					{ "width": "10%"}
	    		  ],
		        "order": [[ 0, 'desc' ]]
		} );
		
		ALL_GROUP.dataTable.on( 'order.dt search.dt', function () {
			ALL_GROUP.dataTable.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
	            cell.innerHTML = i+1;
	        } );
	    } ).draw();
		
	},
	joinGroup:function(gid){
		
		COMMON.confirm("<span style='color: #595959;'>그룹에 가입하시겠습니까?<span>","",
		"info",
		function(){
			var data={
					gid:gid
			}
			
			$.ajax({
				url:'/desk/group/joinGroupRequest.do',
				type:'POST',
				dataType:'json',
				data:data,
				success:function(result){
					COMMON.alert("그룹 가입 신청이 되었습니다.<br>그룹 관리자 승인 후 최종적으로 가입 됩니다.","success",function(){location.reload();});
				}
			});
		},
		function(){
			return false;
		});
	}

}


var MY_GROUP = {
	editor:null,
	dataTable:0,
	init:function() {
	
		MY_GROUP.dataTable = $('#myGroupList').DataTable( {
				"columns": [
	    		    { "width": "5%"},
	    		    { "width": "15%" },
	    		    { "width": "8%", "orderable": false },
					{ "width": "5%" },
	    		    { "width": "5%" },
					{ "width": "5%", "orderable": false }
	    		  ],
		        "order": [[ 0, 'desc' ]]
		} );
		
		MY_GROUP.dataTable.on( 'order.dt search.dt', function () {
			MY_GROUP.dataTable.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
	            cell.innerHTML = i+1;
	        } );
	    } ).draw();
		
	},
	insertGroup:function(){
		
		var group_name = $("#group_name").val();
		var group_info = $("#group_info").val();

		if(group_name == "") {
			COMMON.alert('그룹명을 입력하세요','warning',function(){
				$("#group_name").focus();
			});
			return false;
		}
		
		if(group_info == "") {
			COMMON.alert('그룹 소개를 입력하세요','warning',function(){
				$("#group_info").focus();
			});
			return false;
		}
		
		if($("#resultOK").css("display") == "none"){
			COMMON.alert('사용할 수 없는 그룹명입니다.','warning',function(){
				$("#group_name").focus();
			});
			return false;
		}
		
		COMMON.confirm("<span style='color: #595959;'>그룹을 생성하시겠습니까?<span>","관리자 승인 후 생성 됩니다.",
		"info",
		function(){

			var data={
					group_name:group_name,
					group_info:group_info
			}
			
			$.ajax({
				url:'/desk/group/insert.do',
				type:'POST',
				dataType:'json',
				data:data,
				success:function(result){
					COMMON.alert("그룹 생성 요청이 되었습니다.<br>관리자 승인 후 최종적으로 생성 됩니다.","success",function(){ location.href = "/desk/group/myList.do";});
				}
			});
		},
		function(){
			return false;
		});
	},
	leaveGroup:function(gid){
		
		COMMON.confirm("<span style='color: #595959;'>그룹에서 탈퇴하시겠습니까?<span>","",
		"info",
		function(){
			var data={
					gid:gid
			}
			
			$.ajax({
				url:'/desk/group/leaveGroup.do',
				type:'POST',
				dataType:'json',
				data:data,
				success:function(result){
					COMMON.alert("그룹에서 탈퇴하였습니다.","success",function(){location.reload();});
				}
			});
		},
		function(){
			return false;
		});
	},
	joinGroupCancel:function(gid){
		
		COMMON.confirm("<span style='color: #595959;'>그룹 가입을 취소 하시겠습니까?<span>","",
		"info",
		function(){
			var data={
					gid:gid
			}
			
			$.ajax({
				url:'/desk/group/leaveGroup.do',
				type:'POST',
				dataType:'json',
				data:data,
				success:function(result){
					COMMON.alert("그룹 가입이 취소되었습니다.","success",function(){location.reload();});
				}
			});
		},
		function(){
			return false;
		});
	},
	deleteGroupRequest:function(gid){
		COMMON.confirm("<span style='color: #595959;'>그룹을 삭제하시겠습니까?<span>","관리자의 승인후 삭제됩니다.",
		"info",
		function(){
			var data={
					gid:gid
			}
			
			$.ajax({
				url:'/desk/group/deleteGroupRequest.do',
				type:'POST',
				dataType:'json',
				data:data,
				success:function(result){
					COMMON.alert("그룹 삭제 요청이 되었습니다.<br>관리자의 승인 후 최종 삭제 됩니다.","success",function(){location.href = "/desk/group/myList.do";});
				}
			});
		},
		function(){
			return false;
		});
	},
	deleteGroupCancel:function(gid){
		COMMON.confirm("<span style='color: #595959;'>그룹 삭제 요청을 취소하시겠습니까?<span>","",
		"info",
		function(){
			var data={
					gid:gid
			}
			
			$.ajax({
				url:'/desk/group/deleteGroupCancel.do',
				type:'POST',
				dataType:'json',
				data:data,
				success:function(result){
					COMMON.alert("그룹 삭제 요청이 취소 되었습니다.","success",function(){location.reload();});
				}
			});
		},
		function(){
			return false;
		});
	},
	addGroupCancel:function(gid){
		COMMON.confirm("<span style='color: #595959;'>그룹 생성 요청을 취소하시겠습니까?<span>","",
		"info",
		function(){
			var data={
					gid:gid
			}
			
			$.ajax({
				url:'/desk/group/addGroupCancel.do',
				type:'POST',
				dataType:'json',
				data:data,
				success:function(result){
					COMMON.alert("그룹 생성 요청이 취소 되었습니다.","success",function(){location.reload();});
				}
			});
		},
		function(){
			return false;
		});
	},
	updateGroup:function(gid){
	
		/*
		var group_name = $("#group_name").val();
		
		if(group_name == "") {
			COMMON.alert('그룹명을 입력하세요','warning',function(){
				$("#group_name").focus();
			});
			return false;
		}
		
		if($("#group_name").val().length>15 || $("#group_name").val().length<2){
			COMMON.alert('그룹명은 2~15글자 \n사이여야 합니다.','warning',function(){
				$("#group_name").focus();
			});
			return false;
		}
		*/
		
		var group_info = $("#group_info").val();
		
		if(group_info == "") {
			COMMON.alert('그룹 소개를 입력하세요','warning',function(){
				$("#group_info").focus();
			});
			return false;
		}
		
		COMMON.confirm("<span style='color: #595959;'>그룹 정보를 수정하시겠습니까?<span>","",
		"info",
		function(){
			var data={
					gid:gid,
					//group_name:group_name,
					group_info:group_info
			}
			
			$.ajax({
				url:'/desk/group/updateGroup.do',
				type:'POST',
				dataType:'json',
				data:data,
				success:function(result){
					if(result.rs =="complete"){
						COMMON.alert("그룹 정보가 수정되었습니다.","success",function(){location.reload();});
					} else {
						COMMON.alert("그룹 정보 수정에 실패하였습니다.","success",function(){location.reload();});
					}
					
				}
			});
		},
		function(){
			return false;
		});
	},
	openModal:function(){
		$("tags").css("height","77px");
		$("tags").css("display","block");		
		$("#modal-inviteMember").modal();
	}


}

var GROUP_MEMBER = {
	editor:null,
	dataTable:0,
	inviteMemberId:[],
	init:function() {
	
		GROUP_MEMBER.dataTable = $('#GroupMemberList').DataTable( {
				"columns": [
	    		    { "width": "5%"},
	    		    { "width": "10%", "orderable": false },
	    		    { "width": "10%", "orderable": false },
	    		    { "width": "10%"}
	    		  ],
		        "order": [[ 0, 'desc' ]]
		} );
		
		GROUP_MEMBER.dataTable.on( 'order.dt search.dt', function () {
			GROUP_MEMBER.dataTable.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
	            cell.innerHTML = i+1;
	        } );
	    } ).draw();
		
	},
	viewInit:function() {
	
		GROUP_MEMBER.dataTable = $('#GroupMemberList').DataTable( {
				"columns": [
	    		    { "width": "5%"},
	    		    { "width": "10%", "orderable": false },
	    		    { "width": "10%", "orderable": false }
	    		  ],
		        "order": [[ 0, 'desc' ]]
		} );
		
		GROUP_MEMBER.dataTable.on( 'order.dt search.dt', function () {
			GROUP_MEMBER.dataTable.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
	            cell.innerHTML = i+1;
	        } );
	    } ).draw();
		
	},
	inviteInit:function(){
		
		var input = document.querySelector('input[name=tags]');
			
		var tagify = new Tagify(input, {	
			//mode                : "mix",	
	        //pattern             : /^[a-z]+[a-z0-9]{2,19}$/,  // Validate typed tag(s) by Regex. Here maximum chars length is defined as "20"  /^.{0,20}$/	
	        delimiters          : ",| ",        // add new tags when a comma or a space character is entered	
	        //keepInvalidTags     : false,         // do not remove invalid tags (but keep them marked as invalid)	
	        //createInvalidTags: true,	
	        editTags            : {	
	        	clicks: 2,              // single click to edit a tag	
	            keepInvalid: false      // if after editing, tag is invalid, auto-revert	
	        },	
	        maxTags             : 10,	
	        //blacklist           : ["foo", "bar", "baz"],//욕설 비방어 리스트 취득시 적용	
	        //whitelist           : [],
	        backspace           : "edit",
	        //placeholder         : ".",
	        
	    })
		
		// bind "DragSort" to Tagify's main element and tell
		// it that all the items with the below "selector" are "draggable"
		var dragsort = new DragSort(tagify.DOM.scope, {
		    selector: '.'+tagify.settings.classNames.tag,
		    callbacks: {
		        dragEnd: onDragEnd
		    }
		})
		
		// must update Tagify's value according to the re-ordered nodes in the DOM
		//DOM이 새로 재정렬 되었을때 ->드래그해서
		function onDragEnd(elm){
		    tagify.updateValueByDOMTags();
		}
		
		
		tagify.on('change', function(e){
			let obj = JSON.parse(e.detail.value);
			let tempArr = [];
			for(var i=0;i<obj.length;i++){
				tempArr.push(obj[i].value);
			}
			if(tempArr.length>0){
				GROUP_MEMBER.inviteMemberId = tempArr;
			}
			
		} )

	},
	addGroupMember:function(gid, mid){
		COMMON.confirm("<span style='color: #595959;'>그룹 가입 요청을 승인하시겠습니까?<span>","",
		"info",
		function(){
			var data={
					gid:gid,
					mid:mid
			}
			
			$.ajax({
				url:'/desk/group/addGroupMember.do',
				type:'POST',
				dataType:'json',
				data:data,
				success:function(result){
					COMMON.alert("그룹 가입 요청을 승인하었습니다.","success",function(){location.reload();});
				}
			});
		},
		function(){
			return false;
		});
	},
	inviteMember:function(gid){
		
		for(var i = 0; i<GROUP_MEMBER.inviteMemberId.length; i++){
			var rs = GROUP_MEMBER.checkInviteMemberID(gid, GROUP_MEMBER.inviteMemberId[i]);
			if(rs == 0){
				COMMON.alert("존재하지않는 사용자가 있어\n 초대 발송에 실패하였습니다.\nID - "+GROUP_MEMBER.inviteMemberId[i],"warning",function(){return false;});
				return false;
			} else if(rs == 2){
				COMMON.alert("이미 그룹에 속해있는 사용자가 있어\n 초대 발송에 실패하였습니다.\nID - "+GROUP_MEMBER.inviteMemberId[i],"warning",function(){return false;});
				return false;
			}
		}
		
		for(var i = 0; i<GROUP_MEMBER.inviteMemberId.length; i++){
			
			var data={
					gid:gid,
					memid:GROUP_MEMBER.inviteMemberId[i]
			}
			
			$.ajax({
				url:'/desk/group/inviteMember.do',
				type:'POST',
				dataType:'json',
				data:data,
				success:function(result){
					COMMON.alert("그룹 초대 요청을 보냈습니다.","success",function(){location.reload();});
				}
			});
		}
	},
	checkInviteMemberID:function(gid,mem_id){
		
		var rs;
		
		var data={
			gid:gid,
			mem_id:mem_id
		}
			
		$.ajax({
			url:'/desk/group/checkInviteMemberID.do',
			type:'POST',
			dataType:'json',
			data:data,
			async:false,
			success:function(result){
				rs = result.rs;
				
			}
		});
		
		return rs;
	}

}