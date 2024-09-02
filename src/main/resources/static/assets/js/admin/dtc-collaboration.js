/**
 * 
 */
var COLLABORATION = {
	editor:null,
	dataTable:0,
	init:function() {

		COLLABORATION.dataTable = $('#developerList').DataTable( {
			"columns": [
    		    { "width": "5%", "orderable": false },
		    { "width": "10%", "orderable": false },
    		    { "width": "10%"},
    		    { "width": "8%" },
    		    { "width": "10%" },
    		    { "width": "10%" },
    		    { "width": "10%" },
    		  ],
	        "order": [[ 2, 'asc' ]]
	    } );
	 
		COLLABORATION.dataTable.on( 'order.dt search.dt', function () {
			COLLABORATION.dataTable.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
	            cell.innerHTML = i+1;
	        } );
	    } ).draw();
	},
	DELETE:{
		deleteCollaboration:function(dlid) {
			if(!confirm('정말 삭제하시겠습니까?')) {
				return false;
			}
			
			var formData = new FormData();
			formData.append("control", "deleteCollaboration");
			formData.append("dlid", dlid)
			
			$.ajax({
				url:"./deleteCollaboration.do",
				type: "POST",
				data: formData,
				processData: false,
				contentType: false,
				enctype: 'multipart/form-data',
				success:function(result) {

					var result=JSON.parse(result);

					if(result.rs == "complete") {
						LOG_TRACKER.write("98","2","협력사 삭제:{DLID:"+dlid+"}");
						alert('삭제 됐습니다.');
						document.location.href = "./main.do";
					}
				}
			});
			
		}
	},
	UPDATE:{
		update:function(dlid) {
			if($("#com_name").val() == "") {
				alert('협력사명을 입력하세요.');
				$("#com_name").focus();
				return false;
			}

			if($("[name=dev_type]:checked").val() == "C") {
			
				if($("#com_regist_num").val() == "") {
					alert('사업자등록번호를 입력하세요.');
					$("#com_regist_num").focus();
					
					return false;
				}
			}
			var formData = new FormData();
			
			formData.append("control", "updateCollaboration");
			formData.append("dlid", dlid);
			
			formData.append("logo_url", $("#com_thumbnail")[0].files[0]);
			formData.append("dev_type", $("[name=dev_type]:checked").val());
			
			formData.append("com_name", $("#com_name").val());
			formData.append("com_regist_num", ($("#com_regist_num").val() == "") ? "null" : $("#com_regist_num").val());
			formData.append("com_ceo", ($("#com_ceo").val() == "") ? "null" : $("#com_ceo").val());
			formData.append("com_tel", ($("#com_tel").val() == "") ? "null" : $("#com_tel").val());
			formData.append("com_email", ($("#com_email").val() == "") ? "null" : $("#com_email").val());
			formData.append("com_homepage", ($("#com_homepage").val() == "") ? "null" : $("#com_homepage").val());

			formData.append("com_info", (COLLABORATION.editor.getData() == "") ? "null" : COLLABORATION.editor.getData());

			$.ajax({
				url:"./updateCollaboration.do",
				type: "POST",
				data: formData,
				processData: false,
				contentType: false,
				enctype: 'multipart/form-data',
				success:function(result) {

					var result=JSON.parse(result);

					if(result.rs == "complete") {
						LOG_TRACKER.write("97","2","협력사 수정:{DLID:"+dlid+"}");
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
			if($("#com_name").val() == "") {
				alert('협력사명을 입력하세요.');
				$("#com_name").focus();
				return false;
			}
			
			if($("[name=dev_type]:checked").val() == "C") {

				if($("#com_regist_num").val() == "") {
					alert('사업자등록번호를 입력하세요.');
					$("#com_regist_num").focus();
					
					return false;
				}
			}
			var formData = new FormData();
			
			formData.append("control", "addCollaboration");
			
			formData.append("logo_url", $("#com_thumbnail")[0].files[0]);
			formData.append("dev_type", $("[name=dev_type]:checked").val());

			formData.append("com_name", $("#com_name").val());
			formData.append("com_regist_num", ($("#com_regist_num").val() == "") ? "null" : $("#com_regist_num").val());
			formData.append("com_ceo", ($("#com_ceo").val() == "") ? "null" : $("#com_ceo").val());
			formData.append("com_tel", ($("#com_tel").val() == "") ? "null" : $("#com_tel").val());
			formData.append("com_email", ($("#com_email").val() == "") ? "null" : $("#com_email").val());
			formData.append("com_homepage", ($("#com_homepage").val() == "") ? "null" : $("#com_homepage").val());

			formData.append("com_info", (COLLABORATION.editor.getData() == "") ? "null" : COLLABORATION.editor.getData());

			$.ajax({
				url:"./addCollaboration.do",
				type: "POST",
				data: formData,
				processData: false,
				contentType: false,
				enctype: 'multipart/form-data',
				success:function(result) {

					var result=JSON.parse(result);

					if(result.rs == "complete") {
						LOG_TRACKER.write("96","2"," 개발사생성:{DLID:"+result.dlid+"}");
						alert('협력사가 등록됐습니다.');
						document.location.href = "./main.do";
					}
				}
			});
		}// End of Insert
	}
}
