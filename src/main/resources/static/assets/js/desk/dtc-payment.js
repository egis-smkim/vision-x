/**
 * 
 */

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

var PAYMENT = {
	editor:null,
	dataTable:0,
	init:function() {
		
		PAYMENT.initDataTable();
		//PAYMENT.initChart();
		/*$('#resetChart').on('click',function(){
			DATA_APP.resetChart();
		});*/
		/*APP_DATA.initChart2();*/
		$("#paymentCancelInfoBtn").on("click",function(){
			$(".paymentCancel").show();
			$(".paymentInfo").hide();
		});
		$("#paymentCancelBtn").on("click",function(){
			if($("#paymentCancelInfo").val() == "") {
				COMMON.alert("취소 요청 사유를 입력하세요.","error",function(){});
				return;
			}
			var text = "";
			var subtext = "";
			text = '<span style="color: #595959;">결제 취소 요청하시겠습니까?</span>';
			COMMON.confirm(text,subtext
					,"info"
					,function(){
	
						var formData = new FormData();
						formData.append("orderId", $("#paymentOrderId").val());
						formData.append("paymentCancelInfo", $("#paymentCancelInfo").val());
						
						$.ajax({
							url:"/desk/payment/paymentCancelRequest.do",
							type: "POST",
							data: formData,
							processData: false,
							contentType: false,
							success:function(result) {
								var result=JSON.parse(result);
								text = "결제 취소 요청되었습니다.";
								COMMON.alert(text,"success",function(){location.reload();});
							}
						});
	
					},
					function(){return false;});
		});
		$("#paymentInfoBtn").on("click",function(){
			$(".paymentCancel").hide();
			$(".paymentInfo").show();
		});
		$("#paymentCancelType").on("change",function(){
			$("#paymentCancelInfo").val($("#paymentCancelType :selected").val());
		});
	},
	initDataTable:function(){
		PAYMENT.dataTable = $('#productMemberList').DataTable( {
			"columns": [
    		    { "width": "5%", "orderable": false },
    		    { "width": "8%"},
    		    { "width": "25%"},
    		    { "width": "13%"},
    		    { "width": "14%"},
    		    { "width": "10%"},
    		    { "width": "5%", "orderable": false }
    		  ],
	        "order": [[ 4, 'desc' ]]
	    } );
	 
		PAYMENT.dataTable.on( 'order.dt search.dt', function () {
			PAYMENT.dataTable.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
	            cell.innerHTML = i+1;
	        } );
	    } ).draw();
		
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
	showDetailModal(orderId){	
		PAYMENT.getMemberPaymentInfo(orderId);
		$('#detailModal').modal('show');
	},
	showEditModal(mpid,mid){
		PAYMENT.setEModal(mpid,mid);
		$('#editModal').modal();
	},
	getMemberPaymentInfo:function(orderId){
		$.ajax({
			url : '/desk/payment/getMemberPaymentInfo.do',
			type : 'POST',
			data : {"orderId":orderId},
			dataType : 'json',
			success : function(result) {
				if(result.rs=="complete"){
					var memberInfo= result.memberVO;
					var paymentInfo= result.myPaymentInfo;
					var ptype = "이용권";
					var productName = "";
					var status = "";
					if(paymentInfo.ptype == "product") ptype = "앱";
					switch(paymentInfo.ptype){
						case "product":
							productName = paymentInfo.product_name;
						break;
						case "service":
							subscribe_name = paymentInfo.subscribe_name;
							console.log(paymentInfo);
							console.log(subscribe_name);
							productName = "DigitalTwin Platform SaaS Pricing Policy (" + subscribe_name +")";
							if(paymentInfo.service_type == "ent") productName += " - 일반 기업 사용자";
							if(paymentInfo.service_type == "res") productName += " - 연구 과제 [ "+paymentInfo.service_name+" ("+paymentInfo.service_code+") ]";
							if(paymentInfo.service_type == "pro") productName += " - 프로젝트 [ "+paymentInfo.service_name+" ]";
						break;
						default:
							productName = "DigitalTwin Platform SaaS Pricing Policy";
						break;
					}
					switch(paymentInfo.status){
						case "DONE":
							status = "결제 완료";
						break;
						case "WAITING_FOR_DEPOSIT":
							status = "입금 대기중";
						break;
						case "CANCELED":
							status = "결제 취소";
						break;
						case "CANCELED_REQUEST":
							status = "결제 취소 요청";
						break;
					}
					$("#paymentOrderId").val(orderId);
					$("#paymentPtyp").text(ptype);
					$("#paymentProductName").text(productName);
					$(".paymentAmount").text(paymentInfo.amount.toLocaleString() + " 원");
					$("#paymentUserName").text(memberInfo.mem_name + " (" + memberInfo.mem_id + ")");
					$("#paymentStatus").text(status);
					$("#paymentMethod").text(paymentInfo.payment_method);
					var request_date = new Date(paymentInfo.request_date);
					if(paymentInfo.request_date != "0000-00-00 00:00:00") request_date = request_date.getFullYear() + "년 " + (request_date.getMonth() + 1) + "월 " + request_date.getDate() + "일 " + request_date.getHours() + "시 " + request_date.getMinutes() + "분"
					else request_date = "";
					var approved_date = new Date(paymentInfo.approved_date);
					if(paymentInfo.approved_date != "0000-00-00 00:00:00") approved_date = approved_date.getFullYear() + "년 " + (approved_date.getMonth() + 1) + "월 " + approved_date.getDate() + "일 " + approved_date.getHours() + "시 " + approved_date.getMinutes() + "분"
					else approved_date = "";
					$("#paymentRequestDate").text(request_date);
					$("#paymentApprovedDate").text(approved_date);
					var payment_info = JSON.parse(paymentInfo.payment_info);
					$("#paymentCancelInfoBtn").show();
					if(paymentInfo.status == "CANCELED_REQUEST"){
						$("#paymentCancelInfoBtn").hide();
					}
					if(paymentInfo.payment_method == "카드"){
						var card_info = payment_info;
						if(payment_info.status == "CANCELED"){
							card_info = payment_info.card;
							var cancel_date = new Date(payment_info.cancels[0].canceledAt);
							cancel_date = cancel_date.getFullYear() + "년 " + (cancel_date.getMonth() + 1) + "월 " + cancel_date.getDate() + "일 " + cancel_date.getHours() + "시 " + cancel_date.getMinutes() + "분"
							$("#paymentStatus").text($("#paymentStatus").text() + " ("+cancel_date+")");
							$("#paymentCancelInfoBtn").hide();
						}
						var payment_months = "일시불";
						if(card_info.installmentPlanMonths > 0) payment_months = card_info.installmentPlanMonths + "개월";
						$("#paymentDetailMethod").text(card_info.company + "카드 / " + payment_months);
						if(card_info.receiptUrl == undefined){
							$("#paymentReceipt").text("불가능");
							$("#paymentReceiptBtn").hide();
						}else{
							$("#paymentReceipt").text("가능");
							$("#paymentReceiptBtn").show();
							$("#paymentReceiptBtn").off("click");
							$("#paymentReceiptBtn").on("click",function(){
								window.open(card_info.receiptUrl);
							});
						}
					}else if(paymentInfo.payment_method == "가상계좌"){
						if(payment_info.status == "DONE"){
							$("#paymentMethod").text($("#paymentMethod").text() + " - " + payment_info.virtualAccount.bank +"");
							$("#paymentDetailMethod").text($("#paymentMethod").text());
						}else{
							var due_date = new Date(payment_info.dueDate);
							if(payment_info.dueDate != "0000-00-00 00:00:00") due_date = due_date.getFullYear() + "년 " + (due_date.getMonth() + 1) + "월 " + due_date.getDate() + "일 " + due_date.getHours() + "시 " + due_date.getMinutes() + "분"
							else due_date = "";
							$("#paymentMethod").text($("#paymentMethod").text() + " - " + payment_info.bank +" (" + payment_info.accountNumber + ")");
							$("#paymentStatus").text($("#paymentStatus").text() + " (" + due_date + "까지)");
							$("#paymentDetailMethod").text("-");
							$("#paymentApprovedDate").text("-");
							if(new Date(payment_info.dueDate) < new Date()){
								$("#paymentStatus").text("만료된 주문");
								$("#paymentCancelInfoBtn").hide();
							}
						}
						if(payment_info.receiptUrl == undefined && payment_info.receipt == undefined){
							$("#paymentReceipt").text("불가능");
							$("#paymentReceiptBtn").hide();
						}else{
							$("#paymentReceipt").text("가능");
							$("#paymentReceiptBtn").show();
							$("#paymentReceiptBtn").off("click");
							$("#paymentReceiptBtn").on("click",function(){
								if(payment_info.receiptUrl != undefined){
									window.open(payment_info.receiptUrl);
								}else{
									window.open(payment_info.receipt.url);
								}
							});
						}
					}
				}
			}
		});
		
		
	},
	setEModal:function(pid){
		PAYMENT.PID=pid;
		$.ajax({
			url : '/desk/developer/setEModal.do',
			type : 'POST',
			data : {"pid":PAYMENT.PID},
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