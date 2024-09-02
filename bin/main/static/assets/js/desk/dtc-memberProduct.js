/**
 * 
 */

var MEMBER_PRODUCT = {
	context:null,
	init:function() {
		
	},
	GROUP:{
		mpid:null,
		add:function() {
			// memberProductGroupListWrap
			var formData = new FormData();
			formData.append("memberProductGroupName", $("#memberProductGroupName").val());
			
			$.ajax({
				url:"./executeAddMemberProductGroup.do",
				type: "POST",
				data: formData,
				processData: false,
				contentType: false,
				enctype: 'multipart/form-data',
				success:function(result) {

					var result=JSON.parse(result);
					console.log(result);
					if(result.rs == "complete") {
						alert('그룹이 등록됐습니다.');
						
						// append li
						
						$("#addMemberProductGroupModal").modal("hide");
						$("#memberProductGroupName").val("");
						
						// memberProductGroupVO
						
						var html = "";
						html += "<li class=\"nav-item\">\n";
						html += "	<a class=\"nav-link text-muted\" href=\"javascript:MEMBER_PRODUCT.GROUP.sortGroupItem("+result.memberProductGroupVO.mpgid+");\">"+result.memberProductGroupVO.name+"</a>\n";
						html += "</li>\n";
						
						$("#memberProductGroupListWrap").append(html);
						
					}
				}
			});
		},
		callAddGroup:function() {
			$("#addMemberProductGroupModal").modal("show");
			
			$("#memberProductGroupName").focus();
		},
		sortGroupItem:function(mpgid) {
			var formData = new FormData();
			formData.append("mpgid", mpgid);
			
			$.ajax({
				url:"./executeSortMemberProductByGroup.do",
				type: "POST",
				data: formData,
				processData: false,
				contentType: false,
				enctype: 'multipart/form-data',
				success:function(result) {

					var result=JSON.parse(result);
					
					if(result.rs == "complete") {
						
						
					}
				}
			});
		},
		setMemberProductGroup:function() {
			// MEMBER_PRODUCT.GROUP.mpid = mpid;
			
			if($("#selectMemberProductGroup").val() == "") {
				alert('분석 그룹을 선택하세요.');
				return false;
			}
			
			var formData = new FormData();
			formData.append("mpid", MEMBER_PRODUCT.GROUP.mpid);
			formData.append("mpgid", $("#selectMemberProductGroup").val());
			
			$.ajax({
				url:"./setMemberProductGroup.do",
				type: "POST",
				data: formData,
				processData: false,
				contentType: false,
				enctype: 'multipart/form-data',
				success:function(result) {

					var result=JSON.parse(result);
					if(result.rs == "complete") {
						$("#selectMemberProductGroup").empty();
						$("#setMemberProductGroupModal").modal("hide");
						
						alert('해당 분석기능이 선택 분석 그룹에 추가됐습니다.')
					} else if(result.rs == "duplicate") {
						alert('해당 그룹이 이미 분석기능이 포함되어 있습니다.');
						return false;
					}
				}
			});
		},
		callSelectGroup:function(mpid) {
			
			MEMBER_PRODUCT.GROUP.mpid = mpid;
			
			$("#setMemberProductGroupModal").modal("show");
			
			//selectMemberProductGroup
			
			var formData = new FormData();
			formData.append("control", "getMemberProgroupList");
			
			$.ajax({
				url:"./getMemberProgroupList.do",
				type: "POST",
				data: formData,
				processData: false,
				contentType: false,
				enctype: 'multipart/form-data',
				success:function(result) {

					var result=JSON.parse(result);
					//console.log(result);
					// memberProductGroupList
					if(result.rs == "complete") {
						if(result.memberProductGroupList.length > 0) {
							
							$("#selectMemberProductGroup").empty();
							$("#selectMemberProductGroup").append("<option value=\"\">분석 그룹 분류 선택</option>");
							$.each(result.memberProductGroupList, function(k, v) {
								// selectMemberProductGroup
								//console.log(v.name);
								var html = "<option value=\""+v.mpgid+"\">"+v.name+"</option>";
								$("#selectMemberProductGroup").append(html);
							});
						} else {
							$("#selectMemberProductGroup").empty();
							$("#selectMemberProductGroup").append("<option value=\"\">등록된 분석 그룹 분류가 없습니다.</option>");
						}
					}
				}
			});
		}
	}
}


$("#memberProductGroupName").keypress(function (e) {
	if (e.which == 13){
		MEMBER_PRODUCT.GROUP.add();
	}
});