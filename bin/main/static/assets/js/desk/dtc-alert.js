var ALERT = {
	editor:null,
	dataTable:0,
	init:function() {
	
		ALERT.dataTable = $('#myAlertList').DataTable( {
				"columns": [
	    		    { "width": "5%"},
	    		    { "width": "15%", "orderable": false },
	    		    { "width": "60%", "orderable": false },
	    		    { "width": "15%", "orderable": false },
	    		    { "width": "5%", "orderable": false }
	    		  ],
		        "order": [[ 0, 'desc' ]]
		} );
		
		ALERT.dataTable.on( 'order.dt search.dt', function () {
			ALERT.dataTable.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
	            cell.innerHTML = i+1;
	        } );
	    } ).draw();
		
	  
	},
	viewAlertDetail:function(aid){
		
		var data={
			aid:aid
		}
			
		$.ajax({
			url:'/desk/alert/detail.do',
			type:'POST',
			dataType:'json',
			data:data,
			async:false,
			success:function(result){
				var alertVO = result.alertVO;
				var view = document.getElementById('alertView_'+aid);
				view.innerHTML = '<i class="fas fa-envelope-open"></i>';
				
				document.getElementById('alertDetailContainer').innerHTML = '';
				html = "";
				
				if(alertVO.TYPE == 'G'){
					document.getElementById('alertTitle').innerHTML = '그룹 초대 알림';
					document.getElementById('alertDate').innerHTML = alertVO.REG_DATE;
					html = "<div>"+alertVO.GROUP_MASTER_ID+"님이 회원님을 그룹 '"+alertVO.GROUP_NAME+"'에 초대하였습니다.</div><br>";
					if(alertVO.SELECT == null){
						html += '<div class="text-right" id="select">';
		            	html +=  '<button class="btn btn-success btn-sm mr-1" onclick="javascript:ALERT.inviteResult('+aid+','+'\'Y\''+');">수락</button><button class="btn btn-danger btn-sm" onclick="javascript:ALERT.inviteResult('+aid+','+'\'N\''+');">거절</button>'
		            	html +=  '</div>'
					} else if(alertVO.SELECT == 'Y') {
						html += '<div class="text-right" id="select">';
		            	html +=  '<button class="btn btn-success btn-sm" disabled>수락됨</button>'
		            	html +=  '</div>'
					} else if(alertVO.SELECT == 'N') {
						html += '<div class="text-right" id="select">';
		            	html +=  '<button class="btn btn-danger btn-sm" disabled>거절됨</button>'
		            	html +=  '</div>'
					}
					
					document.getElementById('alertDetailContainer').innerHTML = html;
					
				}
			}
		});
		
		$("#layout-navbar-collapse").load(window.location.href + " #layout-navbar-collapse");
			
	},
	viewAlertUpdate:function(aid){
		
		var data={
			aid:aid
		}
			
		$.ajax({
			url:'/desk/alert/detail.do',
			type:'POST',
			dataType:'json',
			data:data,
			async:false,
			success:function(result){
			}
		});
		
		$("#layout-navbar-collapse").load(window.location.href + " #layout-navbar-collapse");
			
	},
	inviteResult:function(aid, result){
		var select;
		if(result == 'Y'){
			select = '수락';
		} else {
			select = '거절';
		}
		COMMON.confirm("<span style='color: #595959;'>그룹 가입 초대를  "+select+"하시겠습니까?<span>","",
		"info",
		function(){
			var data={
					aid:aid,
					result:result
			}
			
			
			$.ajax({
				url:'/desk/alert/inviteResult.do',
				type:'POST',
				dataType:'json',
				data:data,
				success:function(result){
					COMMON.alert("그룹 초대 요청을\n"+select+"하었습니다.","success",function(){
						
					});
				}
				
			});
			if(result == 'Y'){
				document.getElementById('select').innerHTML = '<button class="btn btn-success btn-sm" disabled>수락됨</button>';
			} else {
				document.getElementById('select').innerHTML = '<button class="btn btn-danger btn-sm" disabled>거절됨</button>';
			}
			
		},
		function(){
			return false;
		});
	},
	alertList:function(aid){
		let f = document.createElement('form');
    
	    let obj;
	    obj = document.createElement('input');
	    obj.setAttribute('type', 'hidden');
	    obj.setAttribute('name', 'aid');
	    obj.setAttribute('value', aid);
	    
	    f.appendChild(obj);
	    f.setAttribute('method', 'post');
	    f.setAttribute('action', '/desk/alert/list.do');
	    document.body.appendChild(f);
	    f.submit();
	}
}