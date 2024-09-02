package com.vision_x.vision_x.utils;

import java.io.IOException;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.annotation.Resource;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import org.apache.commons.lang3.time.DateUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.ModelAndViewDefiningException;
import org.springframework.web.servlet.mvc.WebContentInterceptor;

import com.vision_x.vision_x.admin.service.PageService;
import com.vision_x.vision_x.admin.service.PageVO;
import com.vision_x.vision_x.member.service.MemberPaymentService;
import com.vision_x.vision_x.member.service.MemberPaymentVO;
import com.vision_x.vision_x.member.service.MemberSubscribeService;
import com.vision_x.vision_x.member.service.MemberSubscribeVO;

public class AuthInterceptor extends WebContentInterceptor {
	
	protected Logger logger = LoggerFactory.getLogger(this.getClass());
	
	@Resource(name="pageService")
	private PageService pageService;
	
	@Resource(name = "memberPaymentService")
	private MemberPaymentService memberPaymentService;
	
	@Resource(name = "memberSubscribeService")
	private MemberSubscribeService memberSubscribeService;
	
	private void saveDestination(HttpServletRequest request) {
		String uri = request.getRequestURI();
		String query = request.getQueryString();
		
		if(query == null || query.equals("null")) {
			query = "";
		} else {
			query = "?" + query;
		}
		
		//logger.info("uri:"+uri);
		//logger.info("query:"+query);
		
		if(request.getMethod().equals("GET")) {
			request.getSession().setAttribute("dest", uri + query);
		}
 	}
	
	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws ServletException {
	
		HttpSession session = request.getSession(true);
		
		SessionVO sessionVO = null;
		
		saveDestination(request);
		
		sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");
		String uri = request.getRequestURI();
		
		String[] metaUris = uri.split("/");

		if(session.getAttribute("sessionUserInfo") != null) {
			if(sessionVO.getSessMemLevel() == 10 || sessionVO.getSessDlid() > 0) { return true; }
			
			Integer checkSid = memberPaymentService.checkMemSid(sessionVO.getSessMid());
			if(checkSid == null) checkSid = 1;
			if(checkSid!=1) { //첫번째 결제 인가
				try {
					MemberPaymentVO mpvo  = memberPaymentService.getMemeberPaymentLastOne(sessionVO.getSessMid());
					MemberSubscribeVO msvo = (memberSubscribeService.getMemberSubscribeLastOne(sessionVO.getSessMid()));
					SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
					if(msvo!=null) {
					
						Date paymentDt = sdf.parse(mpvo.getApproved_date());
						Date cancleDt = sdf.parse(msvo.getCancle_date());
						
						int compare = paymentDt.compareTo(cancleDt);
						if(compare>0) {
							Date today = new Date();
							paymentDt = DateUtils.addMonths(paymentDt, 1);
							compare = today.compareTo(paymentDt);
							if(compare>0) { // 오늘로 부터 구독권이 만료 되었다면.
								if(uri.contains("/desk/payment/pricing.do")||uri.contains("/desk/store/buySubscribeInfo.do")||uri.contains("/desk/payment/invoices.do")||uri.contains("/desk/payment/return.do")) return true;
								ModelAndView modelAndView = new ModelAndView("redirect:/desk/payment/return.do");
								throw new ModelAndViewDefiningException(modelAndView);
							}
							return true;
						}
						if(msvo.getState() == 4 ) { // 두번 이상의 결제 내역이 있는 미 구독자 인가
							if(uri.contains("/desk/payment/pricing.do")||uri.contains("/desk/store/buySubscribeInfo.do")||uri.contains("/desk/payment/invoices.do")||uri.contains("/desk/payment/return.do")) return true;
							ModelAndView modelAndView = new ModelAndView("redirect:/desk/payment/return.do");
							throw new ModelAndViewDefiningException(modelAndView);
						}
					}else {
						Date paymentDt = sdf.parse(mpvo.getApproved_date());
						Date today = new Date();
						paymentDt = DateUtils.addDays(paymentDt, 15);
						int compare = today.compareTo(paymentDt);
						if(compare>0) { // 오늘로 부터 구독권이 만료 되었다면.
							if(uri.contains("/desk/payment/pricing.do")||uri.contains("/desk/store/buySubscribeInfo.do")||uri.contains("/desk/payment/invoices.do")||uri.contains("/desk/payment/return.do")) return true;
							ModelAndView modelAndView = new ModelAndView("redirect:/desk/payment/return.do");
							throw new ModelAndViewDefiningException(modelAndView);
						}
					}
				} catch (ParseException e) {
					logger.error("preHandle ERROR-ParseException");
				}
				
				
			}else {
				if(uri.contains("/desk/payment/pricing.do")||uri.contains("/desk/store/buySubscribeInfo.do")||uri.contains("/desk/payment/return.do")) return true;
				ModelAndView modelAndView = new ModelAndView("redirect:/desk/payment/return.do");
				throw new ModelAndViewDefiningException(modelAndView);
			}

			return true;
			
		} else {
			//logger.info("uri:"+request.getRequestURI());
			
			if(metaUris[1].equals("meta")) {
				logger.info("Access Meta API");
				return true;
			} else {
				//logger.info("No Session User Info");
				
				if(uri.contains("/logger/addLogTracker.do")) { //302에러 해결
					logger.info("LogTracker available");
					return true;
				}
				
				if((uri.contains("/board/view.do") || uri.contains("/board/faqView.do")) && !uri.contains("/desk/board/view.do")) { //302에러 해결
					return true;
				}
				
				ModelAndView modelAndView = new ModelAndView("redirect:/main/main.do");
				//modelAndView.addObject("sess","no");
				throw new ModelAndViewDefiningException(modelAndView);
			}
		}
	
	}
	
	@Override
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) {
		
		HttpSession session = request.getSession(true);
		
		String reqUrl = request.getRequestURL().toString();
		String uri = request.getRequestURI();
		String[] metaUris = uri.split("/");
		
		if(!metaUris[1].equals("meta") && session.getAttribute("sessionUserInfo") != null) {
			SessionVO sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");
			int memLevel = sessionVO.getSessMemLevel();
			String url = uri;
			if(session.getAttribute("dest") != null) {
				String dest = session.getAttribute("dest").toString();
				String[] destSplit = dest.split("\\?");
				String ctx = request.getContextPath();
				url = destSplit[0].replace(ctx, "");
			}
			
			PageVO pageVO;
			try {
				pageVO = pageService.selectPageItemByUrl(url);
			
				if(pageVO == null) {
					logger.info("page is null");
					
					session.removeAttribute("MEM_INFO");
					session.removeAttribute("sessionUserInfo");
					
					//response.sendRedirect(request.getContextPath()+"/member/login.do");
					response.sendRedirect(request.getContextPath()+"/error.do");
				} else {

					if(reqUrl.indexOf("localhost") == -1) {
						if(reqUrl.indexOf("admin.dtwincloud") > -1 || reqUrl.indexOf("admin.xdworld") > -1 || reqUrl.indexOf("mgt-") > -1) {
							//관리자 페이지
							if(pageVO.getLevel() == 1) {
								logger.info("high level");
								logger.info("error 1");
								response.sendRedirect(request.getContextPath()+"/error.do");
							}
						}else {
							//사용자 페이지
							if(pageVO.getLevel() == 10) {
								logger.info("low level");
								logger.info("error 1");
								response.sendRedirect(request.getContextPath()+"/error.do");
							}
							else if(memLevel < pageVO.getLevel()) {
								// 사용자 페이지로 이동
								logger.info("low level");
								if(memLevel > 0) {
									response.sendRedirect(request.getContextPath()+"/");
								} else {
									logger.info("error 1");
									response.sendRedirect(request.getContextPath()+"/error.do");
								}
							}
						}
					}
				}
			} catch (SQLException e) {
				logger.error("POSTHANDLE ERROR-SQLException");
			} catch (IOException e) {
				logger.error("POSTHANDLE ERROR-IOException");
			} catch (RuntimeException e) {
				logger.error("POSTHANDLE ERROR-RuntimeException");
			} catch (Exception e) {
				logger.error("SELECT ERROR");
			}
		}
	}
	
}
