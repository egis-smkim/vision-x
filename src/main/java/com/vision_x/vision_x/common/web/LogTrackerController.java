/**
 * 
 */
package com.vision_x.vision_x.common.web;

import java.sql.SQLException;
import java.util.HashMap;

import javax.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import org.codehaus.plexus.util.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.vision_x.vision_x.common.service.LogTrackerService;
import com.vision_x.vision_x.common.service.LogTrackerVO;
import com.vision_x.vision_x.member.service.MemberService;
import com.vision_x.vision_x.member.service.MemberVO;
import com.vision_x.vision_x.utils.GetClientIPAddr;
import com.vision_x.vision_x.utils.SessionVO;

/**
 * LogTrackerController.java
 * digitaltwincloud
 * 2022. 3. 28.
 * @author Khaia
 * @Comment
 *
 */

@Controller
public class LogTrackerController {
	
	protected Logger logger = LoggerFactory.getLogger(this.getClass());
	
	@Resource(name="logTrackerService")
	private LogTrackerService logTrackerService;
	
	@Resource(name="memberService")
	private MemberService memberService;
	
	
	@RequestMapping(value="/logger/addLogTracker.do", method=RequestMethod.POST)
	public String checkMetaAssetApplication(Model model, HttpServletRequest request, @RequestParam HashMap<String,Object> postMap) {
		String rs = "fail";
		
		try {
			
			HttpSession session = request.getSession(true);
			
			SessionVO sessionVO = new SessionVO();
			sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");
			
			GetClientIPAddr ip = new GetClientIPAddr();
			String clientIP=ip.getClientIP(request);//클라이언트 ip
			if(sessionVO!=null) { // 세션 값이 있는 경우
				if(!StringUtils.isEmpty(postMap.get("log_code").toString())) {
					
					int mid = sessionVO.getSessMid();
					
					MemberVO memberVO = new MemberVO();
					
					memberVO.setMem_id(sessionVO.getSessMemId());
					
					memberVO = memberService.getMemberInfoMemId(memberVO);
					
					String log_code = postMap.get("log_code").toString();
					
					int gid = memberVO.getGid();
					int dlid = memberVO.getDlid();
					
					String message = "";
					
					if(!StringUtils.isEmpty(postMap.get("message").toString())) {
						message = postMap.get("message").toString();
					}
					
					int log_level = 1;
					
					LogTrackerVO logTrackerVO = new LogTrackerVO();
					
					if(!StringUtils.isEmpty(postMap.get("log_level").toString())) {
						logTrackerVO.setLog_level(log_level);
					} else {
						logTrackerVO.setLog_level(Integer.parseInt(postMap.get("log_level").toString()));
					}
					
					logTrackerVO.setMid(mid);
					logTrackerVO.setGid(gid);
					logTrackerVO.setDlid(dlid);
					logTrackerVO.setLog_code(log_code);
					logTrackerVO.setMessage(message);
					logTrackerVO.setIp(clientIP);
					if(logTrackerService.insertLogTracker(logTrackerVO) > 0) {
						rs = "complete";
					}
				}

			}else { //세션 값이 없을 경우(로그인 전)
					if(!StringUtils.isEmpty(postMap.get("log_code").toString())
							&&!StringUtils.isEmpty(postMap.get("message").toString())
							&&!StringUtils.isEmpty(postMap.get("log_level").toString())) {
						//////////////////////////////////////////////////////////////////////////
						LogTrackerVO logTrackerVO = new LogTrackerVO();
						int mid = -1;
						int gid = -1;
						int dlid = -1;
						logTrackerVO.setMid(mid);
						logTrackerVO.setGid(gid);
						logTrackerVO.setDlid(dlid);
						logTrackerVO.setLog_level(Integer.parseInt(postMap.get("log_level").toString()));
						logTrackerVO.setLog_code(postMap.get("log_code").toString());
						logTrackerVO.setMessage(postMap.get("message").toString());
						logTrackerVO.setIp(clientIP);
						
						if(logTrackerService.insertLogTracker(logTrackerVO) > 0) {
							rs = "complete";
						}
					}
			}
			
		} catch (SQLException e) {
			logger.error("SQL Error-SQLException");
		} catch (NullPointerException e) {
			logger.error("PostMap NullPointerException");
		} catch(NumberFormatException e) {
			logger.error("NumberFormat Error-NumberFormatException");
		}
		
		model.addAttribute("rs", rs);
		
		return "jsonView";
	}

}
