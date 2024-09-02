/**
 * 
 */

var STORE = {
	clientKey :'live_ck_ADpexMgkW36pNJ7bd1brGbR5ozO0',
	clientType : 'egis',
	tossPayments : null,
	init:function() {
		
		$("#searchStoreBtn").on('click',function(e){
			var storeVal=$("#markertSearchInput").val();
			STORE.paginationProduct('',1,storeVal);
		});
		STORE.initSearchTypehead();
		
		if (window.location.href.indexOf("beta") > -1 || window.location.href.indexOf("newlayer") > -1
				|| window.location.href.indexOf("alpha") > -1 || window.location.href.indexOf("delta") > -1) {
			STORE.clientKey = "live_ck_jkYG57Eba3G9xMQ4kE6rpWDOxmA1";
			STORE.clientType = 'newlayer';
		}
		STORE.tossPayments = TossPayments(STORE.clientKey);
		$("#paymentProductBtn").on("click",function(){
			var orderId = new Date().getTime();
			if($(".paymentBtn.active").attr("value") != "run"){
				var paymentData = { // 결제 수단 파라미터
				  // 결제 정보 파라미터
				  amount: $("#paymentProductPrice").attr("value"),
				  orderId: orderId,
				  orderName: $("#paymentProductName").text(),
				  customerName: $("#memberName").val(),
				  successUrl: document.location.origin+'/desk/store/storeRequest.do?ptype=product&clientType='+STORE.clientType+'&pid='+$("#paymentProductId").val(),
				  failUrl: document.location.origin+'/desk/store/storeFailRequest.do?ptype=product&clientType='+STORE.clientType+'&pid='+$("#paymentProductId").val(),
				};
				if ($(".paymentBtn.active").attr("value") === '가상계좌') {
		            paymentData.virtualAccountCallbackUrl = document.location.origin + '/virtual-account/callback'
		        }
				STORE.tossPayments.requestPayment($(".paymentBtn.active").attr("value"), paymentData);
			}else{
				var param = { // 결제 수단 파라미터
				  // 결제 정보 파라미터
				  pid: $("#paymentProductId").val(),
				  amount: $("#paymentProductPrice").attr("value"),
				  orderId: orderId,
				  orderName: $("#paymentProductName").text(),
				  customerName: $("#memberName").val(),
				};
				$.ajax({
					url:"/desk/store/storeRequestTemp.do",
					type:'POST',
					data:param,
					dataType:'json',
					success:function(result){
						if(result.rs == "success"){
							LOG_TRACKER.write("40","1","유료 앱 구매:{APPID:"+$("#paymentProductId").val()+"}");
							COMMON.alert('구매가 완료되었습니다.','success',function(){
								location.reload();
			                });
						}
					}
				});
				
			}
			
		});
	},
	getAppProductLists:function() {
		$.ajax({
				url:'/ide/getAppProductLists.do',
				type:'POST',
				dataType:'json',
				success:function(data){
					var html = "";
					if(data.RS.length > 0){
						html = STORE.setResultList(data.RS);
					}
					$("#productList").html(html);
				}
			});
	},
	initSearchTypehead:function(){
		 $.ajax({
			 url:'/desk/store/allProductList.do',
			 type:'POST',
			 dataType:'json',
			 success:function(result){
				 var list = [];
				 data = result.productList;

				 if(D_TRASLATION.global.userLanguage == 'ko'){
				 for(var i=0;i<data.length;i++){
				 		list.push(data[i]['name']);
				 	}
				 } else {
					for(var i=0;i<data.length;i++){
						if(data[i]['eng_name'] == null || data[i]['eng_name'] == "") list.push(data[i]['name']);
						else list.push(data[i]['eng_name']);
				 	}
				 }
				 $('#markertSearchInput').typeahead({
						highlight: true,
						minLength: 1,
						limit: 10,
						classNames:{
							highlight:'text-black pt-0 pb-0 mt-0 mb-0'
						}
					  },
					  {
						name: 'product',
						source: STORE.substringMatcher(list)
				 }).on('keyup',this,function(e){
					 //enter key event 
					 if(e.keyCode==13){
						 var searchTxt = $(this).val();
						 STORE.paginationProduct('',1,searchTxt);
						 $(this).typeahead('close');
					 }
					 
				 }).on('typeahead:select',function(ev,suggestion){
					 //검색 결과 마우스 클릭 시
					 STORE.paginationProduct('',1,suggestion);
				 });
			 }
		 });
	},
	searchResultInfo:function(word){		
		var data={
				search:word
		}
		
		$.ajax({
			url:'/ide/getAppProductLists.do',
			type:'POST',
			dataType:'json',
			data:data,
			success:function(data){
				var html = "";
				if(data.RS.length > 0){
					html = STORE.setResultList(data.RS);
				}
				$("#productList").html(html);
				
			}
		});
	},
	substringMatcher:function(strs){
		return function findMatches(q, cb) {

			var matches, substringRegex;
			
			matches = [];
			
			substrRegex = new RegExp(q, 'i');
			
			$.each(strs, function(i, str) {
				if (substrRegex.test(str)) {
					matches.push(str);
				}
			});

			cb(matches);
		}
	},
	sortStore:function(cid) {
		var data={
				CID:cid
		}
		
		$.ajax({
			url:'/ide/selectSearchInfo.do',
			type:'POST',
			data:data,
			dataType:'json',
			success:function(data){
				var html = "";
				if(data.RS.length > 0){
					html = STORE.setResultList(data.RS);
				}
				$("#productList").html(html);
			}
		})
	},
	pricingInit:function(){
		
		$("[name='researchType']").on("click",function(){
			var obj = $("[name='researchType']:checked")[0].id;
			$(".research_option").hide();
			$(".research_"+obj).show();
		});
		
		if (window.location.href.indexOf("beta") > -1 || window.location.href.indexOf("newlayer") > -1
				|| window.location.href.indexOf("alpha") > -1 || window.location.href.indexOf("delta") > -1) {
			STORE.clientKey = "live_ck_jkYG57Eba3G9xMQ4kE6rpWDOxmA1";
			STORE.clientType = 'newlayer';
		};
		STORE.tossPayments = TossPayments(STORE.clientKey);
		
		// 연구 결제
		$("#researchPaymentProductBtn").on("click",function(){
			var obj = $("[name='researchType']:checked")[0].id;
			switch(obj){
				case "ent":
				break;
				case "res":
					if($("#researchName").val() == "") {
						COMMON.alert("연구 과제명을 입력하세요.","info",function(){$("#researchName").focus();return false;});
						return false;
					}
					if($("#researchCode").val() == "") {
						COMMON.alert("연구 코드를 입력하세요.","info",function(){$("#researchCode").focus();return false;});
						return false;
					}
				break;
				case "pro":
					if($("#researchProjectName").val() == ""){
						COMMON.alert("프로젝트 명을 입력하세요.","info",function(){$("#researchProjectName").focus();return false;});
						return false;
					}
				break;
			}
			
			$("#researchCheckModal").modal("hide");
	
			var orderId = new Date().getTime();
			var serviceName = "";
			var serviceCode = "";
			switch(obj){
				case "ent":
				break;
				case "res":
					serviceName = $("#researchName").val();
					serviceCode = $("#researchCode").val();
				break;
				case "pro":
					serviceName = $("#researchProjectName").val();
				break;
			}
			
			var param = { // 결제 수단 파라미터
			  // 결제 정보 파라미터
			  orderId: orderId,
			  serviceType: obj,
			  serviceName: serviceName,
			  serviceCode: serviceCode,
			};
			$.ajax({
				url:"/desk/store/createServiceInfo.do",
				type:'POST',
				data:param,
				dataType:'json',
				success:function(result){
					var paymentData = { // 결제 수단 파라미터
					  // 결제 정보 파라미터
					  amount: $("#researchPaymentProductPrice").attr("value"),
					  orderId: orderId,
					  orderName: $("#researchPaymentProductName").attr("value"),
					  customerName: $("#memberName").val(),
					  sid:$("#researchPaymentProductId").attr("value"),
					  successUrl: document.location.origin+'/desk/store/storeRequest.do?ptype=service&clientType='+STORE.clientType+'&pid='+$("#paymentProductId").val(),
					  failUrl: document.location.origin+'/desk/store/storeFailRequest.do?ptype=service&clientType='+STORE.clientType+'&pid='+$("#paymentProductId").val(),
					}
				},
				error:function(result){
					console.log(result)
				}
			});
		});
		
		// 일반 결제
		$("#personalPaymentProductBtn").on("click",function(){
			
			$("#personalCheckModal").modal("hide");

			var orderId = new Date().getTime();
			STORE.tossPayments.requestBillingAuth('카드', { // 결제수단 파라미터 (자동결제는 카드만 지원합니다.)
			  // 결제 정보 파라미터
			  customerKey: orderId,
			  successUrl: document.location.origin+'/desk/store/storeRequest.do?ptype=product&clientType='+STORE.clientType+'&pid='+$("#paymentProductId").val(),
			  failUrl: document.location.origin+'/desk/store/storeFailRequest.do?ptype=product&clientType='+STORE.clientType+'&pid='+$("#paymentProductId").val(),
			})
			.catch(function (error) {
			  if (error.code === 'USER_CANCEL') {
			    // 결제 고객이 결제창을 닫았을 때 에러 처리
			  }
			})

			/*
			var paymentData = { // 결제 수단 파라미터
			  // 결제 정보 파라미터
			  amount: $("#paymentProductPrice").attr("value"),
			  orderId: orderId,
			  orderName: $("#paymentProductName").text(),
			  customerName: $("#memberName").val(),
			  successUrl: document.location.origin+'/desk/store/storeRequest.do?ptype=product&clientType='+STORE.clientType+'&pid='+$("#paymentProductId").val(),
			  failUrl: document.location.origin+'/desk/store/storeFailRequest.do?ptype=product&clientType='+STORE.clientType+'&pid='+$("#paymentProductId").val(),
			};
			STORE.tossPayments.requestPayment($(".paymentBtn.active").attr("value"), paymentData);
			
			// 임시 로직
			var param = { // 구매한 상품 정보
				orderId: orderId,
				amount: $("#personalPaymentProductPrice").attr("value"),
				orderId: orderId,
				orderName: $("#personalPaymentProductName").attr("value"),
				customerName: $("#memberName").val(),
				sid : $("#personalPaymentProductId").attr("value") //일반 결제 번호
			}
			$.ajax({
				url:"/desk/store/buySubscribeInfo.do?ptype=service&clientType="+STORE.clientType,
				type:'POST',
				data:param,
				dataType:'json',
				success:function(result){
					COMMON.alert('구독권 구매가 완료되었습니다.','success',function(e){
					    return false;
					});
				},
				error:function(result){
					console.log(result);
				}
			});*/
		});
		$("#tutorialPaymentProductBtn").on("click",function(){
			
			$("#tutorialModal").modal("hide");
			var orderId = new Date().getTime();

			// 임시 로직
			var param = { // 구매한 상품 정보
				amount: 0,
				vat: 0,
				orderId: orderId,
				orderName: $("#tutorialPaymentProductName").attr("value"),
				customerName: $("#memberName").val(),
				sid : 2 //일반 결제 번호
			}
			$.ajax({
				url:"/desk/store/buySubscribeInfo.do?ptype=service&clientType="+STORE.clientType,
				type:'POST',
				data:param,
				dataType:'json',
				success:function(result){
					COMMON.alert('튜토리얼 구독이 시작되었습니다.','success',function(e){
					    location.href='/main/main.do';
					});
				},
				error:function(result){
					console.log(result);
				}
			});
		});
	},	
	paymentCheck:function(type){
		switch(type){
			case "TT":
				$("#tutorialModal").modal("show");
			break;
			case "RN":
				$("#personalCheckModal").modal("show");
			break;
			case "ED":
				$("#educationModal").modal("show");
			break;
			case "RS":
				$("#researchCheckModal").modal("show");
			break;
			case "CS":
			break;
		}
	},
	dontPayment:function(){
		$("#personalPaymentProductBtn").on("click",function(){$("#dontPayment").modal("show");$("#personalCheckModal").modal("hide");}),
		$("#researchPaymentProductBtn").on("click",function(){$("#dontPayment").modal("show");$("#researchCheckModal").modal("hide");})
	},
	showRepurchaseSubscribe:function(){
		$("#tutorialPaymentProductBtn").on("click",function(){$("#repurchaseSubscribeModal").modal("show");}),
		$("#personalPaymentProductBtn").on("click",function(){$("#repurchaseSubscribeModal").modal("show");$("#personalCheckModal").modal("hide");}),
		$("#researchPaymentProductBtn").on("click",function(){$("#repurchaseSubscribeModal").modal("show");$("#researchCheckModal").modal("show");})
	},
	annualClick:function(){
		$('#researchAnnual').click(function(){
    	var checked = $('#researchAnnual').is(':checked');
    	
    	if(checked){
    		$('#researchAnnualCheck').css('display','block');
    		$('#researchMonthlyCheck').css('display','none');
    		$('#researchTotalPrice').text('￦ 28,704,000');
    		$('#researchPaymentProductName').attr('value','DigitalTwin Platform SaaS Pricing Policy (Research-Annual)');
    		$('#researchPaymentProductPrice').attr('value',28704000);
    		$('#researchPaymentProductId').attr('value',15);
    	}
    	else {
    		$('#researchAnnualCheck').css('display','none');
    		$('#researchMonthlyCheck').css('display','block');
    		$('#researchTotalPrice').text('￦ 2,990,000');
    		$('#researchPaymentProductName').attr('value','DigitalTwin Platform SaaS Pricing Policy (Research)');
    		$('#researchPaymentProductPrice').attr('value',2990000);
    		$('#researchPaymentProductId').attr('value',5);
    	}
    	});
    
	    $('#personalAnnual').click(function(){
	   	var checked = $('#personalAnnual').is(':checked');
	   	
		if(checked){
			$('#personalAnnualCheck').css('display','block');
			$('#personalMonthlyCheck').css('display','none');
			$('#personalTotalPrice').text('￦ 1,440,000');
			$('#personalPaymentProductName').attr('value','DigitalTwin Platform SaaS Pricing Policy (Personal-Annual)');
			$('#personalPaymentProductPrice').attr('value',1440000);
			$('#personalPaymentProductId').attr('value',13);
		}
		else {
			$('#personalAnnualCheck').css('display','none');
			$('#personalMonthlyCheck').css('display','block');
			$('#personalTotalPrice').text('￦ 150,000');
			$('#personalPaymentProductName').attr('value','DigitalTwin Platform SaaS Pricing Policy (Personal)');
			$('#personalPaymentProductPrice').attr('value',150000);
			$('#personalPaymentProductId').attr('value',3);
		}
    	});
	},
	setResultList:function(data){
		var html = "";
		for(var i=0;i<data.length;i++){
			var info = data[i];
			html += '<li class="list-group-item py-4">';
			html += '<div class="media flex-wrap">';
			html += '<div class="d-none d-sm-block ui-w-140">';
			html += '<a href="./view.do?pid='+info.PID+'" class="d-block ui-rect-67 ui-bg-cover" style="background-image: url('+info.THUMB+'); border:1px solid #A5A5A5;"></a>';
			html += '</div>';
			html += '<div class="media-body ml-sm-4">';
			html += '<h5 class="mb-2">';
			html += '<a href="./view.do?pid='+info.PID+'" class="text-body"><strong>'+info.NAME+'</strong></a>';
			html += '</h5>';
			html += '<div>'+unescapeHtml(info.COMMENT)+'</div>';
			html += '<div class="mt-2" style="position:relative;">';
			html += '<span class="badge badge-outline-default text-muted font-weight-normal">'+info.CATE_NM+'</span>';
			html += '<div class="storeItemPayWrap">';
			html += '<a href="JavaScript:STORE.paymentFree('+info.PID+');" class="btn btn-primary btn-sm">컨텐츠 사용등록</a>';
			html += '</div>';
			html += '</div>';
			html += '</div>';
			html += '</div>';
			html += '</li>';
		}
		function unescapeHtml(text){
			if(text != "" && text != null ){					
				return text.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"");
			}
		};
		return html;
	},
	paginationProduct:function(cid, page, keyword){
		
		var param = { 
					  cate: cid,
					  page: page,
					  keyword: keyword
					};
					
		$.ajax({
			url:"/desk/store/paginationProduct.do",
			type:'POST',
			data:param,
			dataType:'json',
			success:function(result){
				console.log(result);
				var html = '';
				for(var i=0; i<result.productList.length; i++){
					html +='<li class="list-group-item py-4">';
					html +='	<div class="media flex-wrap">';
					html +='		<div class="d-none d-sm-block ui-w-140">';
					html +='			<a href="./view.do?pid='+result.productList[i].pid+'" class="d-block ui-rect-67 ui-bg-cover" style="background-image: url('+result.productList[i].thumb+'); border:1px solid #A5A5A5;"></a>';
					html +='		</div>';
					html +='		<div class="media-body ml-sm-4">';
					html +='			<h5 class="mb-2">';
					html +='				<div class="float-right font-weight-semibold ml-3">';
					if(result.productList[i].price == 0){
					html +=					'무료</div>';
					} else {
					html +='				<i class="fas fa-won-sign"></i><fmt:formatNumber type="number" maxFractionDigits="3" value="'+result.productList[i].price+'" /></div>';	
					}
					html +='				<a href="./view.do?pid='+result.productList[i].pid+'" class="text-body"><strong>'+result.productList[i].name+'</strong></a>&nbsp;';
					html +='			</h5>';
					
					html += '<div class="d-flex flex-wrap align-items-center mb-2">';
					html +=		'<div class="text-muted small">';
					html +=			'<i class="ion ion-md-time text-primary"></i><span>12h</span>'
					html +=		'</div>'
					html +=		'<div class="ui-stars ml-3">'
					html +=			'<div class="ui-star filled"><i class="ion ion-md-star"></i><i class="ion ion-md-star"></i></div>'
					html +=			'<div class="ui-star filled"><i class="ion ion-md-star"></i><i class="ion ion-md-star"></i></div>'
					html +=			'<div class="ui-star filled"><i class="ion ion-md-star"></i><i class="ion ion-md-star"></i></div>'
					html +=			'<div class="ui-star filled"><i class="ion ion-md-star"></i><i class="ion ion-md-star"></i></div>'
					html +=			'<div class="ui-star filled"><i class="ion ion-md-star"></i><i class="ion ion-md-star"></i></div>'
					html +=		'</div>'
	                html +=		'<a href="javascript:void(0)" class="text-muted small">55</a>'
	                html +=	'</div>'
					
					
					html +='			<div>'+result.productList[i].comment+'</div>';
					html +='			<div class="mt-2" style="position:relative;">';
					html +='				<span class="badge badge-outline-default text-muted font-weight-normal">'+result.productList[i].cate_nm+'</span>';
					html +='				<div class="storeItemPayWrap">';
					html +='					<a href="JavaScript:STORE.buyProduct('+result.productList[i].pid+');" class="btn btn-primary btn-sm">구매</a>';
					html +='				</div>';
					html +='			</div>';
					html +='		</div>';
					html +='	</div>';
					html +='</li>';	
				}
				$("#productList").html(html);
								
				//페이징
				page = '';
	
				page +='<li class="page-item first disabled">';
				page +='	<a class="page-link" href="javascript:STORE.paginationProduct(\''+cid+'\','+(result.productPage.startPage-1)+',\''+keyword+'\')">≪</a>';
				page +='</li>';
				page +='<li class="page-item prev disabled">';
				page +='	<a class="page-link" href="javascript:STORE.paginationProduct(\''+cid+'\','+(result.productPage.nowPage-1)+',\''+keyword+'\')">＜</a>';
				page +='</li>';
				for(var i=result.productPage.startPage; i<result.productPage.endPage+1; i++){
					if(result.productPage.nowPage == i){
						page +='<li class="page-item active">';
					} else {
						page +='<li class="page-item">';	
					}
					page +='		<a class="page-link" href="javascript:STORE.paginationProduct(\''+cid+'\','+i+',\''+keyword+'\')">'+i+'</a>';
					page +='	</li>';
				}
				page +='<li class="page-item next disabled">';
				page +='	<a class="page-link" href="javascript:STORE.paginationProduct(\''+cid+'\','+(result.productPage.nowPage+1)+',\''+keyword+'\')">＞</a>';
				page +='</li>';
				page +='<li class="page-item last disabled">';
				page +='	<a class="page-link" href="javascript:STORE.paginationProduct(\''+cid+'\','+(result.productPage.endPage+1)+',\''+keyword+'\')">≫</a>';
				page +='</li>';
				
				$(".pagination").html(page);
				
				if(result.productPage.startPage > 1)
					$(".page-item.first").removeClass('disabled');
				 if(result.productPage.nowPage > 1)
				 	$(".page-item.prev").removeClass('disabled');
				 if(result.productPage.nowPage < result.productPage.lastPage)
					 $(".page-item.next").removeClass('disabled');
				 if(result.productPage.endPage < result.productPage.lastPage)
				 	$(".page-item.last").removeClass('disabled');
				
				if(cid != ''){
					$("#allProduct").removeClass('font-weight-bold');
					$("#allProduct").addClass('text-muted');
					$("a[id^=product_").removeClass('font-weight-bold');
					$("a[id^=product_").addClass('text-muted');
					var productId = document.getElementById('product_'+cid);
					productId.classList.add('font-weight-bold');
					productId.classList.remove('text-muted');
					productId.classList.add('text-dark');
				} else {
					$("a[id^=product_").removeClass('font-weight-bold');
					$("a[id^=product_").addClass('text-muted');
					$("#allProduct").addClass('font-weight-bold');
					$("#allProduct").removeClass('text-muted');
				}
				
			}
			
			
		});
				
		
	},
	searchSchool:function(){
	var key = "a776352d2bfd411eb91d0ed47302156d";
	var type = "json";
	var pIndex = 1;
	var pSize = 5;
	var name = $("#searchSchoolName").val();
	
	var url = "https://open.neis.go.kr/hub/schoolInfo"
	url = url + "?KEY="+ key + "&Type=" + type + "&pIndex=" + pIndex + "&pSize=" + pSize + "&SCHUL_NM=" + name;
		$.ajax({
				url:url,
				type:'GET',
				dataType:'json',
				success:function(result){
				var data = result.schoolInfo[1].row;
				const html = document.getElementById("schoolList");
				html.innerHTML="";
				for(var i=0; i<data.length; i++){
					html.innerHTML = html.innerHTML + '<a href="javascript:void(0)" onDblClick="javascript:STORE.doubleClickTag(this);" class="list-group-item list-group-item-action flex-column align-items-start">'
													+ '<h4 class="mb-1">' + data[i].SCHUL_NM +'</h4>'
													+ '<p class="mb-1">' + data[i].ORG_RDNMA + '</p>'
													+ '<small>' + data[i].ORG_TELNO + '</small>';
				}
				},
				error:function(result){
					console.log(result);
				}
			});
	},
	doubleClickTag:function(element){
		$("#schooolNM").val(element.querySelector("h4").innerText);
		$("#searchSchoolModal").modal("hide");
		
	},
	cancleSubscribeEnd(){
		$("#subscribeEndModal").modal("show");
		
		$("#subscribeEndBtn").on("click",function(){
			
			$("#subscribeEndModal").modal("hide");
			var param = { // 해지 정보
				msid : $("#subscriptMsid").val()
			}
			$.ajax({
				url:"/desk/payment/subscribeCancelEndRequest.do",
				type:'POST',
				data:param,
				dataType:'json',
				success:function(result){
					location.href="/desk/payment/subscribe.do"
				},
				error:function(result){
					console.log(result);
				}
			});
		
		});
	},
	showRepurchaseSubscribeInfo:function(){
		$("#repurchaseSubscribeModal").modal("show");
	},
	hideRepurchaseSubscribeInfo:function(){
		$("#repurchaseSubscribeModal").modal("hide");
	},
	showSearchSchoolModal:function(){
		$("#searchSchoolModal").modal("show");
	},
	showSubscribeCancleReasonModal:function(){
		$("#subscribeCancleReasonModal").modal("show");
	},
	showDevModal:function(){
		$("#tutorialPaymentProductBtn").on("click",function(){$("#devModal").modal("show");$("#tutorialModal").modal("hide");}),
		$("#personalPaymentProductBtn").on("click",function(){$("#devModal").modal("show");$("#personalCheckModal").modal("hide");}),
		$("#researchPaymentProductBtn").on("click",function(){$("#devModal").modal("show");$("#researchCheckModal").modal("show");})
	},
	showSubscribeCancleModal:function(){	
		$("#subscribeCancleReasonModal").modal("hide");
		$("#subscribeCancleModal").modal("show");
		
		$("#subscribeCancleBtn").on("click",function(){
			
			var cancle_info = $("input[name=cancleReason]:checked").val();
			
			$("#subscribeCancleModal").modal("hide");
			var param = { // 구매한 상품 정보
				sid : $("#subscribeSid").val(),
				cancle_info : cancle_info
			}
			$.ajax({
				url:"/desk/payment/subscribeCancelRequest.do",
				type:'POST',
				data:param,
				dataType:'json',
				success:function(result){
					location.href="/desk/payment/pricing.do"
				},
				error:function(result){
					console.log(result);
				}
			});
		});
	},
	shutdownSubscribe:function(){	
		STORE.hideRepurchaseSubscribeInfo();
		
		var param = { // 구매한 상품 정보
			msid : $("#subscriptMsid").val()
		}
		$.ajax({
			url:"/desk/payment/shutdownSubscribeRequest.do",
			type:'POST',
			data:param,
			dataType:'json',
			success:function(result){
				$("#shutdownSubscribe").modal("show");
			},
			error:function(result){
				console.log(result);
			}
		});

	}
}