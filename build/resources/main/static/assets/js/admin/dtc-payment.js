var PAYMENT = {
	editor:null,
	dataTable:0,
	init:function() {
		
		PAYMENT.initDataTable();
		$("#paymentCancelInfoBtn").on("click",function(){
			$(".paymentCancel").show();
			$(".paymentInfo").hide();
		});
		$("#paymentCancelBtn").on("click",function(){
			var text = "";
			var subtext = "";
			text = '<span style="color: #595959;">결제를 취소하시겠습니까?</span>';
			COMMON.confirm(text,subtext
					,"info"
					,function(){
						var clientType = 'egis';
						if (window.location.href.indexOf("beta") > -1 || window.location.href.indexOf("newlayer") > -1
							|| window.location.href.indexOf("alpha") > -1 || window.location.href.indexOf("delta") > -1) {
							clientType = 'newlayer';
						}
			
						var formData = new FormData();
						formData.append("orderId", $("#paymentOrderId").val());
						formData.append("clientType", clientType);
						
						$.ajax({
							url:"/admin/product/paymentCancel.do",
							type: "POST",
							data: formData,
							processData: false,
							contentType: false,
							success:function(result) {
								var result=JSON.parse(result);
								if(result.rs == "fail"){
									text = "문제가 발생하였습니다\n잠시 후 다시 시도해주세요.";
									COMMON.alert(text,"error",function(){});
								}
								else{
									var rs = JSON.parse(result.rs);
									var message = "결제가 취소되었습니다.";
									var code = "success";
									if(rs.code == "ALREADY_CANCELED_PAYMENT") {
										code = "info";
										message = rs.message;
									}
									COMMON.alert(message,code,function(){location.reload();});
								}
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
    		    { "width": "8%"},
    		    { "width": "8%"},
    		    { "width": "30%"},
    		    { "width": "10%"},
    		    { "width": "15%"},
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
	},
	showDetailModal(orderId){	
		PAYMENT.getMemberPaymentInfo(orderId);
		$('#detailModal').modal('show');
	},
	getMemberPaymentInfo:function(orderId){
		$.ajax({
			url : '/admin/product/getMemberPaymentInfo.do',
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
						default:
							productName = "DigitalTwin Platform SaaS Pricing Policy (Research) - ";
							if(paymentInfo.service_type == "ent") productName += "일반 기업 사용자";
							if(paymentInfo.service_type == "res") productName += "연구 과제 [ "+paymentInfo.service_name+" ("+paymentInfo.service_code+") ]";
							if(paymentInfo.service_type == "pro") productName += "프로젝트 [ "+paymentInfo.service_name+" ]";
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
					$("#paymentCancelInfoBtn").hide();
					if(paymentInfo.status == "CANCELED_REQUEST" || paymentInfo.status == "DONE"){
						$("#paymentCancelInfoBtn").show();
						if(paymentInfo.status == "CANCELED_REQUEST"){
							$("#paymentStatus").html($("#paymentStatus").text() + "<br>(사유 : "+paymentInfo.cancel_info+")");
						}
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