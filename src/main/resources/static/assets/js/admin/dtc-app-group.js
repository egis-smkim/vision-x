var APP_GROUP  = {
	editor:null,
	dataTable:0,
	deleteLogoFlag:false,
	init:function() {
		APP_GROUP.dataTable = $('#appGroupList').DataTable( {
			"columns": [
    		    { "width": "5%", "orderable": false },
    		    { "width": "20%"},
    		    { "width": "10%"},
    		    { "width": "20%"},
    		    { "width": "10%"},
    		    { "width": "10%"}
    		  ],
	        "order": [[ 1, 'asc' ]],
            lengthChange :false
	    } );
	 
		APP_GROUP.dataTable.on( 'order.dt search.dt', function () {
			APP_GROUP.dataTable.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
	            cell.innerHTML = i+1;
	        } );
	    } ).draw();
	},
	productListInit:function(){
		APP_GROUP.bootstrapDualListbox =  $('#duallistbox-example').bootstrapDualListbox({
			      nonSelectedListLabel: '<span style="font-weight: 600;font-size: 17px;">● 전체 앱</span>',
			      selectedListLabel: '<span style="font-weight: 600;font-size: 17px;">● 그룹 앱</span>',
			      preserveSelectionOnMove: 'moved',
			      moveOnSelect: false
		});	
	},
	addAppGroup:function(){
		
		var appGroupName = $('#appGroupName').val();
		var agencyName = $('#agencyName').val();
		
		if(appGroupName == '' || appGroupName == undefined){
			COMMON.alert('앱 그룹명을 입력해주세요.','error',function(){
				return false;
			});
			return false;
		}if(agencyName == '' || agencyName == undefined){
			COMMON.alert('키워드를 입력해주세요.','error',function(){
				return false;
			});
			return false;
			
		}if($('[name="country-of-operation-edit[]"]').val().length == 0){
			COMMON.alert('그룹 내에 넣을 앱을 선택 해주세요.','error',function(){
				return false;
			});		
			return false;		
		}
		
		let formData = new FormData();
		
		formData.append("appGroupName", appGroupName);
		formData.append("agencyName", agencyName);
		formData.append("appList", ($('[name="country-of-operation-edit[]"]').val().toString()== "") ? "null" : $('[name="country-of-operation-edit[]"]').val().toString());
		
		$.ajax({
			url:"/admin/product/group/insert.do",
			type: "POST",
			data: formData,
			processData: false,
			contentType: false,
			enctype: 'multipart/form-data',
			success:function(result) {
				COMMON.alert('앱그룹이 성공적으로 등록되었습니다.','success',function(){
					location.href='/admin/product/group/list.do';
				});
			}
		});
	},
	updateAppGroup:function(agid, orgAppList){
		var appGroupName = $('#appGroupName').val();
		var agencyName = $('#agencyName').val();
		
		if(appGroupName == '' || appGroupName == undefined){
			COMMON.alert('앱 그룹명을 입력해주세요.','error',function(){
				return false;
			});
			return false;
		}if(agencyName == '' || agencyName == undefined){
			COMMON.alert('키워드를 입력해주세요.','error',function(){
				return false;
			});
			return false;
			
		}if($('[name="country-of-operation-edit[]"]').val().length == 0){
			COMMON.alert('그룹 내에 넣을 앱을 선택 해주세요.','error',function(){
				return false;
			});		
			return false;		
		}
		
		let formData = new FormData();
		
		formData.append("agid", agid);
		formData.append("appGroupName", appGroupName);
		formData.append("agencyName", agencyName);
		formData.append("orgAppList",orgAppList);
		formData.append("appList", ($('[name="country-of-operation-edit[]"]').val().toString()== "") ? "null" : $('[name="country-of-operation-edit[]"]').val().toString());
		
		$.ajax({
			url:"/admin/product/group/update.do",
			type: "POST",
			data: formData,
			processData: false,
			contentType: false,
			enctype: 'multipart/form-data',
			success:function(result) {
				COMMON.alert('앱그룹이 성공적으로 수정되었습니다.','success',function(){
					location.href='/admin/product/group/list.do';
				});
			}
		});
	},
	deleteAppGroup:function(agid, orgAppList){
		
		COMMON.confirm("<span style='color: #595959;'>해당 앱 그룹을 삭제하시겠습니까?<span>","",
		"info",
		function(){
	
			let formData = new FormData();
			
			formData.append("agid", agid);
			formData.append("orgAppList",orgAppList);
			
			$.ajax({
				url:"/admin/product/group/delete.do",
				type: "POST",
				data: formData,
				processData: false,
				contentType: false,
				enctype: 'multipart/form-data',
				success:function(result) {
					COMMON.alert('앱그룹이 성공적으로 삭제되었습니다.','success',function(){
						location.href='/admin/product/group/list.do';
					});
				}
			});
		},
		function(){return false;});
	}
}