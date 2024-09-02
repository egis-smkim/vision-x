/**
 * 
 */
/*$(function() {

		var statuses = {
			1 : [ 'Published', 'success' ],
			2 : [ 'Draft', 'info' ],
			3 : [ 'Deleted', 'default' ]
		};

		$('#productMemberList').dataTable({
			columnDefs : [{
				targets : [ 7 ],
				orderable : false,
				searchable : false
			}, {
				targets : [ 8 ],
				orderable : false,
				searchable : false
			} 
			],
			order: [[ 1, 'asc' ]]
		});
	});
*/

var APP_DATA = {
	editor:null,
	dataTable:0,
	init:function() {
		
		APP_DATA.initDataTable();
		APP_DATA.initChart();
		/*$('#resetChart').on('click',function(){
			DATA_APP.resetChart();
		});*/
		/*APP_DATA.initChart2();*/
	},
	initDataTable:function(){
		$('#productMemberList').dataTable({
			columnDefs : [{
				targets : [ 5 ],
				orderable : false,
				searchable : false
			}, {
				targets : [ 6 ],
				orderable : false,
				searchable : false
			} 
			]/*,
			order: [[ 1, 'asc' ]]*/
		});
		
		/*APP_DATA.dataTable = $('#productMemberList').DataTable( {
		"columns": [
		    { "width": "5%", "orderable": false },
		    { "width": "15%"},
		    { "width": "15%", "orderable": false }
		  ],
        "order": [[ 1, 'asc' ]]
	    } );
	 
		APP_DATA.dataTable.on( 'order.dt search.dt', function () {
			APP_DATA.dataTable.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
	            cell.innerHTML = i+1;
	        } );
	    } ).draw();*/
	},
	initChart:function(){
		const ctx = document.getElementById('chart').getContext('2d');
		const myChart = new Chart(ctx, {
		    type: 'line',
		    data: {
		        labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
		        datasets: [{
		            label: '#사용량',
		            data: [12, 19, 3, 5, 2, 3],
		            backgroundColor: [
		                'rgba(255, 99, 132, 0.2)',
		                'rgba(54, 162, 235, 0.2)',
		                'rgba(255, 206, 86, 0.2)',
		                'rgba(75, 192, 192, 0.2)',
		                'rgba(153, 102, 255, 0.2)',
		                'rgba(255, 159, 64, 0.2)'
		            ],
		            borderColor: [
		                'rgba(255, 99, 132, 1)',
		                'rgba(54, 162, 235, 1)',
		                'rgba(255, 206, 86, 1)',
		                'rgba(75, 192, 192, 1)',
		                'rgba(153, 102, 255, 1)',
		                'rgba(255, 159, 64, 1)'
		            ],
		            borderWidth: 1
		        }]
		    },
		    options: {
		        scales: {
		            y: {
		                beginAtZero: true
		            }
		        }
		    }
		});
	},
	initChart2:function(){
		 var isDark = themeSettings.isDarkStyle();

		  var chart1 = new Chart(document.getElementById('chart').getContext("2d"), {
		    type: 'line',
		    data: {
		      labels: ['2017-03', '2017-04', '2017-05', '2017-06', '2017-07', '2017-08', '2017-09', '2017-10', '2017-11', '2017-12', '2018-01', '2018-02'],
		      datasets: [{
		        label: 'Visits',
		        data: [14, 37, 30, 46, 80, 42, 33, 13, 25, 6, 88, 96],
		        borderWidth: 1,
		        backgroundColor: 'rgba(38, 180, 255, 0.1)',
		        borderColor: '#26B4FF',
		        fill: false
		      }, {
		        label: 'Returns',
		        data: [56, 17, 19, 96, 73, 46, 67, 40, 77, 43, 64, 54],
		        borderWidth: 1,
		        borderDash: [5, 5],
		        backgroundColor: 'rgba(136, 151, 170, 0.1)',
		        borderColor: '#8897aa'
		      }],
		    },
		    options: {
		      scales: {
		        xAxes: [{
		          gridLines: {
		            display: false
		          },
		          ticks: {
		            fontColor: isDark ? '#fff' : '#aaa',
		            autoSkipPadding: 50
		          }
		        }],
		        yAxes: [{
		          gridLines: {
		            display: false
		          },
		          ticks: {
		            fontColor: isDark ? '#fff' : '#aaa',
		            maxTicksLimit: 5
		          }
		        }],
		      },
		      legend: isDark ? {
		        labels: { fontColor: '#fff' }
		      } : {},

		      responsive: false,
		      maintainAspectRatio: false
		    }
		  });
	},
	resetChart:function(){
		$.ajax({
			url : '/desk/developer/resetChart.do',
			type : 'POST',
			dataType : 'json',
			success : function(result) {
				if(result.rs=="complete"){
					
					COMMON.alert("차트 리셋이 완료되었습니다.","success",function(){});//번호가 틀린 경우
				}else{
					COMMON.alert("네트워크 문제로 리셋이 실패하였습니다.다시 시도해주세요","error",function(){return;});//번호가 틀린 경우
				}

			}
		});
	},
	showDetailModal(mpid,mid){	
		APP_DATA.setDModal(mpid,mid);
		$('#detailModal').modal();
	},
	showEditModal(mpid,mid){
		APP_DATA.setEModal(mpid,mid);
		$('#editModal').modal();
	},
	setDModal:function(mpid,mid){
		$.ajax({
			url : '/desk/developer/setDModal.do',
			type : 'POST',
			data : {"mpid":mpid
					,"mid":mid},
			dataType : 'json',
			success : function(result) {
				if(result.rs=="complete"){
					var modalInnerHtml = '';
					modalInnerHtml += '<div class="card" style="box-sizing: border-box;width: 100%;">';
					modalInnerHtml += '<img class="card-img-top" src="'+result.myProductInfo.thumb+'" alt="Card image cap">';
					modalInnerHtml += '<div class="card-body">';
					modalInnerHtml += '<h4 class="card-title">'+result.myProductInfo.cate_nm+'</h4>';
					modalInnerHtml += '<p class="card-text">'+result.myProductInfo.name+'</p>';
					modalInnerHtml += '<p class="card-text">'+result.myProductInfo.comment.replace(/(<([^>]+)>)/gi, "")+'</p>';
					modalInnerHtml += '<video src="'+result.myProductInfo.video_url+'" controls width="300px" />';
					modalInnerHtml += '</div>';
					modalInnerHtml += '</div>';
					 
					$('#detailModal .modal-body').html(modalInnerHtml);
				}else{
					COMMON.alert("네트워크 문제로 리셋이 실패하였습니다.잠시 후,다시 시도해주세요","error",function(){return;});
				}

			}
		});
		
		
	},
	setEModal:function(pid){
		APP_DATA.PID=pid;
		$.ajax({
			url : '/desk/developer/setEModal.do',
			type : 'POST',
			data : {"pid":APP_DATA.PID},
			dataType : 'json',
			success : function(result) {
				if(result.rs=="complete"){
					
					COMMON.alert("차트 리셋이 완료되었습니다.","success",function(){});//번호가 틀린 경우
				}else{
					COMMON.alert("네트워크 문제로 리셋이 실패하였습니다.다시 시도해주세요","error",function(){return;});//번호가 틀린 경우
				}

			}
		});
		
		$('#detailModal .modal-body').html();
	}
}