/**
 * 
 */
var MEMBER = {
	dataTable:0,
	init:function() {
		jQuery.fn.dataTableExt.oSort['file-size-asc'] = function (a, b) {
	        if (a.includes('KB')) {
	            a = parseFloat(a.replace('KB','')) *1024;
	        } else
	        if (a.includes('MB')) {
	            a = parseFloat(a.replace('MB','')) *1024*1024;
	        } else
	        if (a.includes('GB')) {
	            a = parseFloat(a.replace('GB','')) *1024*1024*1024;
	        }
	    
	        if (b.includes('KB')) {
	            b = parseFloat(b.replace('KB','')) *1024;
	        } else
	        if (b.includes('MB')) {
	            b = parseFloat(b.replace('MB','')) *1024*1024;
	        } else
	        if (b.includes('GB')) {
	            b = parseFloat(b.replace('GB','')) *1024*1024*1024;
	        }
	        return (( a > b ) ? 1 : -1);
	    };
	    
	    jQuery.fn.dataTableExt.oSort['file-size-desc'] = function (a, b) {
	        if (a.includes('KB')) {
	            a = parseFloat(a.replace('KB','')) *1024;
	        } else
	        if (a.includes('MB')) {
	            a = parseFloat(a.replace('MB','')) *1024*1024;
	        } else
	        if (a.includes('GB')) {
	            a = parseFloat(a.replace('GB','')) *1024*1024*1024;
	        }
	    
	        if (b.includes('KB')) {
	            b = parseFloat(b.replace('KB','')) *1024;
	        } else
	        if (b.includes('MB')) {
	            b = parseFloat(b.replace('MB','')) *1024*1024;
	        } else
	        if (b.includes('GB')) {
	            b = parseFloat(b.replace('GB','')) *1024*1024*1024;
	        }
	        return (( a > b ) ? -1 : 1);
	    };
		MEMBER.dataTable = $('#memberList').DataTable( {
			"columns": [
    		    { "width": "5%", "orderable": false },
    		    { "width": "13%"},
    		    { "width": "13%"},
    		    { "width": "7%"},
    		    { "width": "15%"},
    		    { "width": "15%"},
    		    { "width": "10%"},
    		    { "width": "*"},
    		    { "width": "9%", "orderable": false },
    		  ],
	        "order": [[ 1, 'asc' ]],
			"columnDefs": [
		        { "type": "file-size", "targets": 7 }
		    ],
            "aoColumns": [{"sType": "file-size"}],
            "aaSorting": [[ 7, "desc" ]],
            lengthChange :false
	    } );
	 
		MEMBER.dataTable.on( 'order.dt search.dt', function () {
			MEMBER.dataTable.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
	            cell.innerHTML = i+1;
	        } );
	    } ).draw();
	},
	INFO:{
		update:function(mid) {

			var formData = new FormData();
			
			formData.append("control", "updateMemberInfo");
			formData.append("mid", mid);
			var dlid = ($("#memberCom").val() == "") ? "0" : $("#memberCom").val();
			formData.append("dlid", dlid);
			var memName = "";
			memName = ($("#memberName").val() == "") ? "null" : $("#memberName").val();

			formData.append("memberName", memName);
			formData.append("memberEmail", $("#memberEmail").val());
			formData.append("memberState", $("#memberState").val());
			formData.append("memberLevel", $("#memberLevel").val());
			
			$.ajax({
				url:"/admin/member/updateMemberInfo.do",
				type: "POST",
				data: formData,
				processData: false,
				contentType: false,
				enctype: 'multipart/form-data',
				success:function(result) {

					var result=JSON.parse(result);

					if(result.rs == "complete") {
						alert('변경 됐습니다.');
						document.location.reload();
					}
				}
			});
		}
	}
}