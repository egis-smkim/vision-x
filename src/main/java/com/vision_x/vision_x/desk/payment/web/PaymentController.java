/**
 * 
 */
package com.vision_x.vision_x.desk.payment.web;

import java.io.UnsupportedEncodingException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import org.apache.commons.lang3.time.DateUtils;
import org.apache.xml.utils.URI;
import org.apache.xml.utils.URI.MalformedURIException;
import org.json.simple.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.vision_x.vision_x.admin.service.BoardMasterService;
import com.vision_x.vision_x.admin.service.BoardMasterVO;
import com.vision_x.vision_x.admin.service.SubscribeService;
import com.vision_x.vision_x.admin.service.SubscribeVO;
import com.vision_x.vision_x.desk.alert.service.AlertService;
import com.vision_x.vision_x.desk.developer.service.ProductService;
import com.vision_x.vision_x.desk.service.GroupService;
import com.vision_x.vision_x.desk.service.GroupVO;
import com.vision_x.vision_x.desk.service.MemberProductService;
import com.vision_x.vision_x.desk.service.MemberProductVO;
import com.vision_x.vision_x.mail.service.MailerVO;
import com.vision_x.vision_x.mail.service.MailingService;
import com.vision_x.vision_x.mail.service.RecipientForRequest;
import com.vision_x.vision_x.member.service.MemberPaymentService;
import com.vision_x.vision_x.member.service.MemberPaymentVO;
import com.vision_x.vision_x.member.service.MemberService;
import com.vision_x.vision_x.member.service.MemberSubscribeService;
import com.vision_x.vision_x.member.service.MemberSubscribeVO;
import com.vision_x.vision_x.member.service.MemberVO;
import com.vision_x.vision_x.utils.SessionVO;

/**
 * PaymentController.java
 * digitaltwincloud
 * 2021. 6. 22.
 * @author Khaia
 * @Comment
 *
 */
@Controller
public class PaymentController {
	protected Logger logger = LoggerFactory.getLogger(this.getClass());
	
	@Resource(name = "memberService")
	private MemberService memberService;

	@Resource(name = "groupService")
	private GroupService groupService;
	
	@Resource(name="productService")
	private ProductService productService;
	
	@Resource(name="subscribeService")
	private SubscribeService subscribeService;
	
	@Resource(name = "memberProductService")
	private MemberProductService memberProductService;
	
	@Resource(name = "memberPaymentService")
	private MemberPaymentService memberPaymentService;
	
	@Resource(name = "memberSubscribeService")
	private MemberSubscribeService memberSubscribeService;
	
	@Resource(name="boardMasterService")
	private BoardMasterService boardMasterService;
	
	@Resource(name = "mailingService")
	private MailingService mailingService;
	
	@Resource(name = "alertService")
	private AlertService alertService;

	@Value("#{globalInfo['Globals.outbound.accesskey']}")
	private String MAIL_API_ACCESSKEY;
	
	@Value("#{globalInfo['Globals.outbound.secretkey']}")
	private String MAIL_API_SECRETKEY;
	
	@Value("#{globalInfo['Globals.outbound.sendURL']}")
	private String MAIL_API_SENDURL;
	
	@RequestMapping(value="/desk/payment/invoices.do", method=RequestMethod.GET)
	public String invoices(HttpServletRequest request, Model model){
		
		try {
			HttpSession session = request.getSession(true);

			SessionVO sessionVO = new SessionVO();
			sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");

			model.addAttribute("MID", sessionVO.getSessMid());
			model.addAttribute("ENMID", sessionVO.getSessEncryMid());
			model.addAttribute("MEM_ID", sessionVO.getSessMemId());
			model.addAttribute("MEM_LEVEL", sessionVO.getSessMemLevel());
			
			HashMap<String,String> map =  new HashMap<>();
			map.put("memId", sessionVO.getSessMemId());
			HashMap<String, Object> memberMap = memberService.memberLogin(map);
			model.addAttribute("MEM_DEVELOPER", memberMap.get("STATE").toString());
			
			List<BoardMasterVO> boardList = boardMasterService.selectBoardList();
			model.addAttribute("boardList", boardList);
			
			List<HashMap<String,String>> myRecentAlert = alertService.recentAlertList(sessionVO.getSessMid());
			int countNoViewAlert = alertService.countNoViewAlert(sessionVO.getSessMid());
			
			model.addAttribute("RECENT_ALERT", myRecentAlert);
			model.addAttribute("NOVIEW_ALERT_COUNT", countNoViewAlert);

			
			MemberVO memberVO = new MemberVO();
			try {

				memberVO.setMid(sessionVO.getSessMid());
				memberVO = memberService.getMemberInfo(memberVO);
				model.addAttribute("memberVO", memberVO);
				
				
				List<MemberPaymentVO> myPaymentList = memberPaymentService.getMemberPaymentList(memberVO);
				
				int MbTotalPaidCost = 0; //총 결제액
				int MbTotalUsingAppsNum = myPaymentList.size();//사용하고 있는 어플리케이션 수
				int active = 0; // 사용가능 어플리케이션 수.
				int inactive = 0; // 사용 불가능 어플리케이션 수.
				int likes = 0;//관심상품
				//총 결제 금액
				for(MemberPaymentVO mbpv : myPaymentList) {
					if(mbpv.getStatus().equals("DONE")) {
						MbTotalPaidCost += mbpv.getAmount();
					}
					//likes += mbpv.getPrdct_like();
				}  
				//사용가능,불가능 앱 갯수
				for(MemberPaymentVO mbpv : myPaymentList) {
					if(mbpv.getStatus().equals("DONE")) {
						active++;
					}else {
						inactive++;
					}
				}
				
				model.addAttribute("myPaymentList", myPaymentList);
				model.addAttribute("MbTotalPaidCost", MbTotalPaidCost);//멤버가 사용한  총 서비스 비용
				model.addAttribute("MbTotalUsingAppsNum", MbTotalUsingAppsNum);//멤버가 사용중인  총 서비스 갯수
				model.addAttribute("active", active);
				model.addAttribute("inactive", inactive);
				model.addAttribute("likes", likes);
			} catch (RuntimeException e) {
				logger.error("SELECT ERROR-RuntimeException");
				return null;
			} catch (Exception e) {
				logger.error("SELECT ERROR");
				return null;
			}
		} catch (RuntimeException e) {
			logger.error("SESSION ERROR-RuntimeException");
		} catch (Exception e) {
			logger.error("SESSION ERROR");
		}
		return "desk/payment/invoices";
	}
	
	@RequestMapping(value="/desk/payment/pricing.do", method=RequestMethod.GET)
	public String pricing(HttpServletRequest request, Model model,@RequestParam(value="move",required = false)String move) throws SQLException, ParseException{
		// 이미 구독중인가를 확인
		// 튜토리얼을 한적이 있는 가를 확인
		// 개발자 인가를 확인		
		
		HttpSession session = request.getSession(true);
		
		SessionVO sessionVO = new SessionVO();
		sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");
		
		model.addAttribute("MID", sessionVO.getSessMid());
		model.addAttribute("ENMID", sessionVO.getSessEncryMid());
		model.addAttribute("MEM_ID", sessionVO.getSessMemId());
		model.addAttribute("MEM_LEVEL", sessionVO.getSessMemLevel());
		model.addAttribute("MEM_DLID", sessionVO.getSessDlid());
		
		HashMap<String,String> map =  new HashMap<>();
		map.put("memId", sessionVO.getSessMemId());
		HashMap<String, Object> memberMap = memberService.memberLogin(map);
		model.addAttribute("MEM_DEVELOPER", memberMap.get("STATE").toString());
		
		List<BoardMasterVO> boardList = boardMasterService.selectBoardList();
		model.addAttribute("boardList", boardList);
		
		List<HashMap<String,String>> myRecentAlert = alertService.recentAlertList(sessionVO.getSessMid());
		int countNoViewAlert = alertService.countNoViewAlert(sessionVO.getSessMid());
		
		//구독 여부
		Integer checkPid = memberPaymentService.checkMemSid(sessionVO.getSessMid());
		if(checkPid == null) checkPid = 1;
		model.addAttribute("MEM_SUB_SID",checkPid);
		// 튜토리얼이면 2, 일반구매 3, 없을경우 1

		if(move!=null)	model.addAttribute("move",move);
		
		// 결제 내역 판단
		MemberPaymentVO memberPaymentVO = memberPaymentService.getMemeberPaymentLastOne(sessionVO.getSessMid());
		model.addAttribute("MEM_PAYMENT",memberPaymentVO);
		
		if(memberPaymentVO !=null) {
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");		
			SimpleDateFormat sdf2 = new SimpleDateFormat("yyyy년 MM월 dd일");
			Date paymentDt = sdf.parse(memberPaymentVO.getApproved_date());
			Date tutoNextDt = DateUtils.addDays(paymentDt, 15);
			
			int sid = memberPaymentVO.getSid();
			
			Date nextDt;
			if(sid>10) {
				nextDt = DateUtils.addYears(paymentDt, 1);
			}else {
				nextDt = DateUtils.addMonths(paymentDt, 1);					
			}
			
			String nextDtStr = sdf2.format(nextDt);
			model.addAttribute("nextDt",nextDtStr);
			
			String tutoNextDtStr = sdf2.format(tutoNextDt);
			model.addAttribute("tutoNextDt",tutoNextDtStr);
			
			MemberSubscribeVO memberSubscribeVO = memberSubscribeService.getMemberSubscribeLastOne(sessionVO.getSessMid());
			model.addAttribute("cancleInfo",memberSubscribeVO);
			if(memberSubscribeVO != null) {
				SubscribeVO subscribe = subscribeService.selectSubscribe(memberSubscribeVO.getSid());
				model.addAttribute("subscribeInfo",subscribe);
				model.addAttribute("subscribeInfoPrice",String.format("%,d", subscribe.getPrice()));
				
				SimpleDateFormat sdf3 = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
				
				Date approveDt = sdf3.parse(memberPaymentVO.getApproved_date());
				Date cancleDt = sdf3.parse(memberSubscribeVO.getCancle_date());
				
				int compare = approveDt.compareTo(cancleDt);
				if(compare<0) {
					if(memberSubscribeVO.getState() == 4) {model.addAttribute("MEM_SUB_SID",1);} // 이전 구독을 강제 종료한 경우.
					Date today = new Date();
					approveDt = DateUtils.addMonths(approveDt, 1);
					compare = today.compareTo(approveDt);
					if(compare>0) {model.addAttribute("MEM_SUB_SID",1); }// 오늘로 부터 구독권이 만료 되었다면.
				}
			}
		}
		
		model.addAttribute("RECENT_ALERT", myRecentAlert);
		model.addAttribute("NOVIEW_ALERT_COUNT", countNoViewAlert);
		
		return "desk/payment/pricing";
	}
	
	@RequestMapping(value="/desk/payment/subscribe.do", method=RequestMethod.GET)
	public String subscribe(HttpServletRequest request, Model model) throws SQLException, ParseException{		
		HttpSession session = request.getSession(true);
		
		SessionVO sessionVO = new SessionVO();
		sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");
		
		model.addAttribute("MID", sessionVO.getSessMid());
		model.addAttribute("ENMID", sessionVO.getSessEncryMid());
		model.addAttribute("MEM_ID", sessionVO.getSessMemId());
		model.addAttribute("MEM_LEVEL", sessionVO.getSessMemLevel());
		
		HashMap<String,String> map =  new HashMap<>();
		map.put("memId", sessionVO.getSessMemId());
		HashMap<String, Object> memberMap = memberService.memberLogin(map);
		model.addAttribute("MEM_DEVELOPER", memberMap.get("STATE").toString());
		
		List<BoardMasterVO> boardList = boardMasterService.selectBoardList();
		model.addAttribute("boardList", boardList);
		
		List<HashMap<String,String>> myRecentAlert = alertService.recentAlertList(sessionVO.getSessMid());
		int countNoViewAlert = alertService.countNoViewAlert(sessionVO.getSessMid());
		
		
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");		
		SimpleDateFormat sdf2 = new SimpleDateFormat("yyyy년 MM월 dd일");
		int sid = 2;
		
		MemberVO memberVO = new MemberVO();
		memberVO.setMid(sessionVO.getSessMid());
		memberVO = memberService.getMemberInfo(memberVO);
		double storageToGB = (double)memberVO.getMem_userstorage();
		model.addAttribute("MEMBER",memberVO);
		model.addAttribute("MEM_GB",String.format("%.1f", storageToGB));
		
		List<Object> paymentList = subscribeService.getSubscribePaymentList(sessionVO.getSessMid());
		for(int i=0; i<paymentList.size(); i++) {
			Date paymentDt = sdf.parse(((Map)paymentList.get(i)).get("date").toString().substring(0,10));
			if(i==0) {
				sid = Integer.parseInt(((Map)paymentList.get(i)).get("sid").toString());

				Date nextDt;
				if(sid>10) {
					nextDt = DateUtils.addYears(paymentDt, 1);
				}else {
					nextDt = DateUtils.addMonths(paymentDt, 1);					
				}
				Date tutoNextDt = DateUtils.addDays(paymentDt, 15);
				
				String nextDtStr = sdf2.format(nextDt);
				String tutoNextDtStr = sdf2.format(tutoNextDt);
				model.addAttribute("nextDt",nextDtStr);
				model.addAttribute("tutoNextDt",tutoNextDtStr);
				
			}
			String price = String.format("%,d",Integer.parseInt(((Map)paymentList.get(i)).get("price").toString()));
			((Map)paymentList.get(i)).put("date", sdf2.format(paymentDt));	
			((Map)paymentList.get(i)).put("price",price );	
		}
		model.addAttribute("paymentList",paymentList);
		
		MemberSubscribeVO memberSubscribeVO = memberSubscribeService.getMemberSubscribeLastOne(sessionVO.getSessMid());
		model.addAttribute("cancleInfo",memberSubscribeVO);
		
		SubscribeVO subscribe;
		if(sessionVO.getSessMemLevel() == 10 ) {
			subscribe = new SubscribeVO();
			subscribe.setName("개발자");
			subscribe.setPrice(0);
			subscribe.setStorage(0);
		}else {
			subscribe = subscribeService.selectSubscribe(sid);
		}
		model.addAttribute("subscribe",subscribe);
		model.addAttribute("subscrivePrice",String.format("%,d", subscribe.getPrice()));
		model.addAttribute("MEM_GB_COUNT",(double)storageToGB/(double)subscribe.getStorage()*100);
		
		model.addAttribute("RECENT_ALERT", myRecentAlert);
		model.addAttribute("NOVIEW_ALERT_COUNT", countNoViewAlert);
		
		return "desk/payment/subscribe";
	}
	
	@RequestMapping(value="/desk/payment/return.do", method=RequestMethod.GET)
	public String paymentReturn(HttpServletRequest request, Model model) throws SQLException {
		
		return "desk/payment/return";
	}
	
	@RequestMapping(value="/desk/payment/paymentCancelRequest.do", method=RequestMethod.POST)
	public String paymentCancelRequest(HttpServletRequest request, Model model) {
		String orderId = request.getParameter("orderId");
		String paymentCancelInfo = request.getParameter("paymentCancelInfo");

		final String accesskey = MAIL_API_ACCESSKEY;
		final String secretkey = MAIL_API_SECRETKEY;
		final String apiURL = MAIL_API_SENDURL;
		
		HttpSession session = request.getSession(true);

		SessionVO sessionVO = new SessionVO();
		sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");
		
		if(orderId!=null&&!orderId.equals("")) {

			try {
				MemberPaymentVO memberPaymentVO = new MemberPaymentVO();

				memberPaymentVO.setOrder_id(orderId);
				memberPaymentVO.setStatus("CANCELED_REQUEST");
				memberPaymentVO.setCancel_info(paymentCancelInfo);
				
				int update = memberPaymentService.updateMemberPaymentStatus(memberPaymentVO);
				if(update > -1) {
					model.addAttribute("rs","complete");
				}
				
				MailerVO mailerVO =  new MailerVO();
				mailerVO.setTemplateSid(
						503);
				//회원가입 인증 템플릿 번호는 166번 
				//templateSid는 naver api 사이트에서 인가된 계정으로 확인가능-parameter를 보내기위해서는 recipientForRequest객체에 파라미터를 세팅해야함
				
				//메일 전송 객체 내부의 수신자 객체
				RecipientForRequest recipient = new RecipientForRequest();
				recipient.setAddress("yoonee25@newlayer.kr");
				recipient.setName("관리자");
				recipient.setType("R");
				
				JSONObject jso = new JSONObject();
				
				jso.put("orderId", orderId);
				
				recipient.setParameters(jso);
				//메일 전송 객체 내부의 수신자 객체리스트 ->여러명일 경우 리스트에 ADD
				List<RecipientForRequest> recipients = new ArrayList<RecipientForRequest>();
				recipients.add(recipient);
				/*for(RecipientForRequest rcp : recipients) {
					recipients.add(recipient);//수신자 명수 만큼 
				}*/
				mailerVO.setRecipients(recipients);
				mailerVO.setParameters(null);
				mailerVO.setIndividual(true);
				mailerVO.setAdvertising(false);
				
				mailingService.mailSender(mailerVO, accesskey, secretkey, apiURL);
				
			} catch (SQLException e) {
				logger.error("SQLException-SQL Syntax Error");
			} catch (InvalidKeyException | NoSuchAlgorithmException | IllegalStateException
					| UnsupportedEncodingException e) {
				logger.error("MailSending Error-An Error Occured while Excuting mailing service.");
			}
			
		}
		return "jsonView";
	}
	
	@RequestMapping(value="/desk/payment/subscribeCancelRequest.do", method=RequestMethod.POST)
	public String subscribeCancelRequest(HttpServletRequest request, Model model) {
		
		HttpSession session = request.getSession(true);

		SessionVO sessionVO = new SessionVO();
		sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");
		
		int sid = Integer.parseInt(request.getParameter("sid"));
		String cancle_info = request.getParameter("cancle_info");
		int state = 1;
		
		MemberSubscribeVO memberSubscribeVO = new MemberSubscribeVO();
		memberSubscribeVO.setMid(sessionVO.getSessMid());
		memberSubscribeVO.setSid(sid);
		memberSubscribeVO.setCancle_info(cancle_info);
		memberSubscribeVO.setState(state);
		
		memberSubscribeService.createMemberSubscribe(memberSubscribeVO);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/desk/payment/subscribeCancelEndRequest.do", method=RequestMethod.POST)
	public String subscribeCancelEndRequest(HttpServletRequest request, Model model) throws SQLException {

		int msid = Integer.parseInt(request.getParameter("msid"));
		MemberSubscribeVO memberSubscribeVO = new MemberSubscribeVO();
		memberSubscribeVO.setMsid(msid);
		memberSubscribeVO.setState(3);
		
		memberSubscribeService.updateMemberSubscribeState(memberSubscribeVO);
		
		return "jsonView";
	}
	
	
	@RequestMapping(value="/desk/payment/shutdownSubscribeRequest.do", method=RequestMethod.POST)
	public String shutdownSubscribeRequest(HttpServletRequest request, Model model) throws SQLException {

		int msid = Integer.parseInt(request.getParameter("msid"));
		MemberSubscribeVO memberSubscribeVO = new MemberSubscribeVO();
		memberSubscribeVO.setMsid(msid);
		memberSubscribeVO.setState(4);
		
		memberSubscribeService.updateMemberSubscribeState(memberSubscribeVO);
		
		return "jsonView";
	}
	
	@RequestMapping(value = "/desk/payment/getMemberPaymentInfo.do", method = RequestMethod.POST)
	public String setDModal(HttpServletRequest request, Model model) {
		String orderId = request.getParameter("orderId");

		HttpSession session = request.getSession(true);

		SessionVO sessionVO = new SessionVO();
		sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");
		
		if(orderId!=null&&!orderId.equals("")) {

			try {
				MemberVO memberVO = new MemberVO();

				memberVO.setMid(sessionVO.getSessMid());
				memberVO = memberService.getMemberInfo(memberVO);
				model.addAttribute("memberVO", memberVO);
				
				MemberPaymentVO MemberPaymentVO = memberPaymentService.getMemberPaymentInfoForOrderId(orderId);
				model.addAttribute("rs","complete");
				model.addAttribute("myPaymentInfo",MemberPaymentVO);
				
			} catch (SQLException e) {
				logger.error("SQLException-SQL Syntax Error");
			}
			
		}
		return "jsonView";
	}
}