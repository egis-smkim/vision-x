/**
 * 
 */

var USER_DATA = {
	init:function() {
		if(USER_DATA.bootstrapDualListbox == null){
			USER_DATA.bootstrapDualListbox =  $('#dataShareGroupList').bootstrapDualListbox({
			      nonSelectedListLabel: '<span style="font-weight: 600;font-size: 17px;">● 전체 그룹</span>',
			      selectedListLabel: '<span style="font-weight: 600;font-size: 17px;">● 공개할 그룹</span>',
			      preserveSelectionOnMove: 'moved',
			      moveOnSelect: false
			});	
		}else{
			$('#dataShareGroupList').bootstrapDualListbox('refresh', true);
		}
	},
	FILE:{
		xhr:null,
		files:[]
	},
	IMAGE:{
		add:function() {
			
		}
	},
	SHARE:{
		checkDataTable:null,
		init:function(){
		    $('#dataShareMemberList').select2({
			  ajax: {
			    url: "/desk/mapdata/dataShareMember.do",
			    dataType: 'json',
				type: "POST",
			    delay: 250,
			    data: function (params) {
			      return {
			        memid: params.term
			      };
			    },
			    processResults: function (data, params) {
			      params.page = params.page || 1;
			
			      return {
			        results: data.rs.results,
			        pagination: {
			          more: (params.page * 30) < data.total_count
			        }
			      };
			    },
			    cache: true
			  },
			  minimumInputLength: 1,
			  language: {
				inputTooShort: function() {
					return '사용자 아이디를 입력하세요.';
			  	}
			  },
			  templateResult: formatRepo,
			  templateSelection: formatRepoSelection
			});
			$("#dataShareGroupList").prop("disabled",true);
			function formatRepo (repo) {
				console.log(repo);
			  if (repo.loading) {
			    return repo.text;
			  }
			
			  var $container = $(
			    "<div class='select2-result-repository clearfix'>" +
			      "<div class='select2-result-repository__meta'>" +
			        "<div class='select2-result-repository__title'></div>" +
			        "<div class='select2-result-repository__description'></div>" +
			        "<div class='select2-result-repository__statistics'>" +
			        "</div>" +
			      "</div>" +
			    "</div>"
			  );
			
			  $container.find(".select2-result-repository__title").text(repo.text);
			
			  return $container;
			}
			
			function formatRepoSelection (repo) {
			  return repo.text;
			}
		    $('#dataShareGroupList').select2();
			$("input[name=dataShare]").on("click",function(){
				if($("input[name=dataShare]:checked").prop("id") == "dataShareY"){
					//공유
					$(".dataShare").prop("disabled",false);
					if($("#dataShareMember").is(":checked")){
						//공유
						$(".dataShareMember").prop("disabled",false);
					}else{
						//공유안함
						$(".dataShareMember").prop("disabled",true);
					}
					if($("#dataShareGroup").is(":checked")){
						//공유
						$(".dataShareGroup").prop("disabled",false);
					}else{
						//공유안함
						$(".dataShareGroup").prop("disabled",true);
					}
				}else{
					//공유안함
					$(".dataShare").prop("disabled",true);
					$(".dataShareMember").prop("disabled",true);
					$(".dataShareGroup").prop("disabled",true);
				}
			});
			$("#dataShareMember").on("click",function(){
				if($("#dataShareMember").is(":checked")){
					//공유
					$(".dataShareMember").prop("disabled",false);
				}else{
					//공유안함
					$(".dataShareMember").prop("disabled",true);
				}
			});
			$("#dataShareGroup").on("click",function(){
				if($("#dataShareGroup").is(":checked")){
					//공유
					$(".dataShareGroup").prop("disabled",false);
					var gid = $("#memberGID").val();
					if(gid != "" && gid != "0"){
						$("#dataShareGroupList").val(gid);
						$("#dataShareGroupList").trigger('change');
					}else{
						$("#dataShareGroupList").select2("destroy");
						$("#dataShareGroupList").select2({
						    placeholder: "나의 그룹이 없습니다."
						});
					}
				}else{
					//공유안함
					$(".dataShareGroup").prop("disabled",true);
					$("#dataShareGroupList").val("");
					$("#dataShareGroupList").select2("destroy");
					$("#dataShareGroupList").select2();
				}
			});
			
			$("#dataShareGroup").on("change",function(){
				if($("#dataShareGroup").is(":checked")){
					//공유
					$(".dataShareGroup").prop("disabled",false);
					$("#dataShareGroupListDiv").show();
					var gid = $("#memberGID").val();
					if(gid != "" && gid != "0"){
						$("#dataShareGroupList").val(gid);
						$("#dataShareGroupList").trigger('change');
					}
				}else{
					//공유안함
					$("#dataShareGroupListDiv").hide();
					$("#dataShareGroupList").val("");
				}
			});
			
		},
		saveShare:function(dataid){
			var formData = new FormData();
			var status = "9";
			var dataShareMember = $("#dataShareMember").is(":checked");
			var dataShareGroup = $("#dataShareGroup").is(":checked");
			var dataShareAll = $("#dataShareAll").is(":checked");
			var dataShareMemberList = ",";
			var dataShareGroupList = ",";
			if($("#groupFlag").val() == 'false' && ($("#groupStatus").val() == "1" || $("#memberStatus").val() == "1")){
				COMMON.confirm("<span style='color: #595959;'>공유 중인 범위가 있을 경우 다시 승인을 받아야 합니다. \n진행하시겠습니까?</span>","ex)회원 공유 공유중 > 공유대기 상대로 변경"
					,"info"
					,function(){
						if($("input[name=dataShare]:checked").prop("id") == "dataShareY"){
							status = "0";
						}
						$('#dataShareMemberList').find(':selected').each(function(index,data){
						    dataShareMemberList += data.value+",";
						});
						$('#dataShareGroupList').find(':selected').each(function(index,data){
						    dataShareGroupList += data.value+",";
						});
						formData.append("dataId", dataid);
						formData.append("status", status);
						formData.append("dataShareMember", dataShareMember);
						formData.append("dataShareGroup", dataShareGroup);
						formData.append("dataShareAll", dataShareAll);
						formData.append("dataShareMemberList", dataShareMemberList);
						formData.append("dataShareGroupList", dataShareGroupList);
						
						$.ajax({
							url:"/desk/mapdata/dataShareSave.do",
							type: "POST",
							data: formData,
							processData: false,
							contentType: false,
							enctype: 'multipart/form-data',
							success:function(result) {
								LOG_TRACKER.write('35','2','데이터 공유 :{DataID:'+dataid+'}');
								COMMON.alert("등록되었습니다.","success",function(){location.reload();});
							}
						});
					}
					,function(){return false;});
			}else{
				if($("input[name=dataShare]:checked").prop("id") == "dataShareY"){
					status = "0";
				}
				$('#dataShareMemberList').find(':selected').each(function(index,data){
				    dataShareMemberList += data.value+",";
				});
				$('#dataShareGroupList').find(':selected').each(function(index,data){
				    dataShareGroupList += data.value+",";
				});
				formData.append("dataId", dataid);
				formData.append("status", status);
				formData.append("dataShareMember", dataShareMember);
				formData.append("dataShareGroup", dataShareGroup);
				formData.append("dataShareAll", dataShareAll);
				formData.append("dataShareMemberList", dataShareMemberList);
				formData.append("dataShareGroupList", dataShareGroupList);
				
				$.ajax({
					url:"/desk/mapdata/dataShareSave.do",
					type: "POST",
					data: formData,
					processData: false,
					contentType: false,
					enctype: 'multipart/form-data',
					success:function(result) {
						LOG_TRACKER.write('35','2','데이터 공유 :{DataID:'+dataid+'}');
						COMMON.alert("등록되었습니다.","success",function(){location.reload();});
					}
				});
			}
			
		},
		listInit:function() {
			USER_DATA.SHARE.checkDataTable = $('#checkRequstList').DataTable({
				"bLengthChange": false,
				"bInfo": false,
				"columns" : [
	    		    { "width": "3%", "orderable": false },
	    		    { "width": "15%"},
	    		    { "width": "13%"},
	    		    { "width": "15%", "orderable": false },
	    		    { "width": "13%"},
	    		    { "width": "12%"},
	    		    { "width": "10%"},
	    		    { "width": "13%", "orderable": false },
					]
			});
			
		},
		checkRequestModal:function(){
			$("#checkRequstModal").modal({backdrop:'static'});
	
			$.ajax({
				url:"/desk/mapdata/getCheckRequstList.do",
				type: "POST",
				success:function(result) {
					var result=JSON.parse(result);
					var html = "";
					if(result.rs == "complete"){
						var dataList = result.data_list;
						for(var i=0;i<dataList.length;i++){
							var data = dataList[i];
							if(data.REQUST_DATE != null) data.REQUST_DATE = data.REQUST_DATE.substr(0,10);
							if(data.MEM_NAME != null) data.MEM_ID = data.MEM_ID + "("+data.MEM_NAME+")";
							html += "<tr>";
							html += "<td></td>";
							html += "<td>"+data.MEM_ID+"</td>";
							html += "<td>"+data.REQUST_DATE+"</td>";
							html += "<td>"+data.DATA_NAME+"</td>";
							html += "<td>"+data.DATA_TYPE+"</td>";
							html += "<td>"+data.REG_DATE+"</td>";
							html += "<td id='shareType_"+data.DATAID+"'>"+data.SHARE_TYPE_CON+"</td>";
							html += "<td><a href='javascript:USER_DATA.SHARE.checkRequestConfirm("+data.DATAID+",1)' class='btn btn-sm btn-success'>승인</a>";
							html += "<a href='javascript:USER_DATA.SHARE.checkRequestConfirm("+data.DATAID+",2)' class='btn btn-sm btn-danger ml-1'>반려</a></td>";
							html += "</tr>";
						}
					}
					$("#checkRequstList tbody").html(html);
					if(USER_DATA.SHARE.checkDataTable == null){
						USER_DATA.SHARE.listInit();
					}
					USER_DATA.SHARE.checkDataTable.on( 'order.dt search.dt', function () {
						USER_DATA.SHARE.checkDataTable.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
				            cell.innerHTML = i+1;
				        } );
				    } ).draw();
				}
			});
		},
		checkRequestConfirm:function(dataId,state){
			var text = "";
			var subtext = "";
			var share_type = $("#shareType_"+dataId).text();
			var html = '';
			if(share_type.split(",").length > 1){
				html = '<span class="form-checkbox">';
				html += '<input type="checkbox" name="" id="checkRequestGroup" checked="">';
				html += '<label for="checkRequestGroup" style="color: #595959;font-size: initial;">그룹</label>';
				html += '</span>';
				
				html += '<span class="form-checkbox ml-5">';
				html += '<input type="checkbox" name="" id="checkRequestMember" checked="">';
				html += '<label for="checkRequestMember" style="color: #595959;font-size: initial;">회원</label>';
				html += '</span>';
			}else{
				if(share_type == "회원"){
					html = '<span class="form-checkbox">';
					html += '<input type="checkbox" name="" id="checkRequestMember" checked="">';
					html += '<label for="checkRequestMember" style="color: #595959;font-size: initial;">회원</label>';
					html += '</span>';
				}
				else{
					html = '<span class="form-checkbox">';
					html += '<input type="checkbox" name="" id="checkRequestGroup" checked="">';
					html += '<label for="checkRequestGroup" style="color: #595959;font-size: initial;">그룹</label>';
					html += '</span>';
					
				}
			}
			if(state == 1){
				text = '<span style="color: #595959;">승인하시겠습니까?</span><br>'+html;
			}else{
				text = '<span style="color: #595959;">반려하시겠습니까?</span><br>'+html;
			}
			COMMON.confirm(text,subtext
					,"info"
					,function(){
						share_type = "";
						if($("#checkRequestGroup").is(":checked")){
							share_type += "G";
						}
						if($("#checkRequestMember").is(":checked")){
							share_type += ",M";
						}
						if(share_type == ""){
							COMMON.alert("선택된 공유범위가 없습니다.","error",function(){});
							return false;
						}
						var formData = new FormData();
						formData.append("control", "checkRequest");
						formData.append("dataId", dataId);
						formData.append("state", state);
						formData.append("share_type", share_type);
						
						$.ajax({
							url:"/desk/mapdata/checkRequest.do",
							type: "POST",
							data: formData,
							processData: false,
							contentType: false,
							success:function(result) {
								var result=JSON.parse(result);
								if(state == 1){
									text = "승인되었습니다.";
									LOG_TRACKER.write("36","2","데이터 공유 허용{DataID:"+dataId+"}");
								}else{
									text = "반려되었습니다.";
									LOG_TRACKER.write("36","2","데이터 공유 반려{DataID:"+dataId+"}");
								}
								COMMON.alert(text,"success",function(){location.reload();});
							}
						});
	
					},
			function(){return false;});
		},
	}
}