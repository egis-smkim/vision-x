package com.vision_x.vision_x.desk.alert.web;


import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.vision_x.vision_x.admin.service.BoardMasterService;
import com.vision_x.vision_x.admin.service.BoardMasterVO;
import com.vision_x.vision_x.desk.alert.service.AlertService;
import com.vision_x.vision_x.desk.alert.service.AlertVO;
import com.vision_x.vision_x.desk.service.GroupService;
import com.vision_x.vision_x.desk.service.GroupVO;
import com.vision_x.vision_x.utils.SessionVO;

@Controller
public class AlertController {
	
	protected Logger logger = LoggerFactory.getLogger(this.getClass());
	
	@Resource(name="boardMasterService")
	private BoardMasterService boardMasterService;
	
	@Resource(name="alertService")
	private AlertService alertService;
	
	@Resource(name="groupService")
	private GroupService groupService;
	
	// 알림 목록
    @RequestMapping(value="/desk/alert/list.do", method=RequestMethod.GET)
	public String alertList(HttpServletRequest request, Model model) {
		HttpSession session = request.getSession(true);

		SessionVO sessionVO = new SessionVO();
		sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");

	
		model.addAttribute("MID", sessionVO.getSessMid());
		model.addAttribute("ENMID", sessionVO.getSessEncryMid());
		model.addAttribute("MEM_ID", sessionVO.getSessMemId());
		model.addAttribute("MEM_LEVEL", sessionVO.getSessMemLevel());
		
		List<BoardMasterVO> boardList = null;
		try {
			boardList = boardMasterService.selectBoardList();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			logger.error("Error-IOException");
		}
		model.addAttribute("boardList", boardList);
		
		List<HashMap<String,String>> myRecentAlert = alertService.recentAlertList(sessionVO.getSessMid());
		int countNoViewAlert = alertService.countNoViewAlert(sessionVO.getSessMid());
		
		model.addAttribute("RECENT_ALERT", myRecentAlert);
		model.addAttribute("NOVIEW_ALERT_COUNT", countNoViewAlert);
		
		List<GroupVO> myGroupList = groupService.getMyGroupList(sessionVO.getSessMid());
		model.addAttribute("MY_GROUP_LIST",myGroupList);


	
		List<HashMap<String,String>> myAlertList = alertService.viewMyAlertList(sessionVO.getSessMid());
		
		model.addAttribute("myAlertList", myAlertList);

		return "desk/alert/list";
	}
    
    // 알림 목록
    @RequestMapping(value="/desk/alert/list.do", method=RequestMethod.POST)
	public String alertListPOST(HttpServletRequest request, Model model) {
		HttpSession session = request.getSession(true);

		SessionVO sessionVO = new SessionVO();
		sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");

	
		model.addAttribute("MID", sessionVO.getSessMid());
		model.addAttribute("ENMID", sessionVO.getSessEncryMid());
		model.addAttribute("MEM_ID", sessionVO.getSessMemId());
		model.addAttribute("MEM_LEVEL", sessionVO.getSessMemLevel());
		
		List<BoardMasterVO> boardList = null;
		try {
			boardList = boardMasterService.selectBoardList();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			logger.error("File Error-FileNotFoundException");
		}
		model.addAttribute("boardList", boardList);
		
		List<HashMap<String,String>> myRecentAlert = alertService.recentAlertList(sessionVO.getSessMid());
		int countNoViewAlert = alertService.countNoViewAlert(sessionVO.getSessMid());
		
		model.addAttribute("RECENT_ALERT", myRecentAlert);
		model.addAttribute("NOVIEW_ALERT_COUNT", countNoViewAlert);
		
		List<GroupVO> myGroupList = groupService.getMyGroupList(sessionVO.getSessMid());
		model.addAttribute("MY_GROUP_LIST",myGroupList);

		int aid = 0;
		if(!request.getParameter("aid").equals(null)) aid = Integer.parseInt(request.getParameter("aid").toString());
		
		List<HashMap<String,String>> myAlertList = alertService.viewMyAlertList(sessionVO.getSessMid());
		
		model.addAttribute("myAlertList", myAlertList);
		model.addAttribute("aid", aid);

		return "desk/alert/list";
	}
    
    // 알림 상세
    @RequestMapping(value="/desk/alert/detail.do", method=RequestMethod.POST)
	public String alertDetail(HttpServletRequest request, Model model) {
		HttpSession session = request.getSession(true);

		SessionVO sessionVO = new SessionVO();
		sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");
		
		int aid = 0;
		if(!request.getParameter("aid").equals(null)) aid = Integer.parseInt(request.getParameter("aid").toString());
		
		HashMap<String,Object> alertVO = alertService.viewMyAlertDetail(aid);
		
		model.addAttribute("alertVO", alertVO);
		
		AlertVO newAlertVO = new AlertVO();
		newAlertVO.setAid(aid);
		newAlertVO.setView(Character.toString('Y'));
		alertService.changeAlertView(newAlertVO);
		

		return "jsonView";
	}
    
    // 알림 초대 수락 거절
    @RequestMapping(value="/desk/alert/inviteResult.do", method=RequestMethod.POST)
	public String alertInviteResult(HttpServletRequest request, Model model) {
		HttpSession session = request.getSession(true);

		SessionVO sessionVO = new SessionVO();
		sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");

		int aid = 0;
		if(!request.getParameter("aid").equals(null)) aid = Integer.parseInt(request.getParameter("aid").toString());
		String result = "";
		if(!request.getParameter("result").equals(null)) result = request.getParameter("result").toString();
		
		HashMap<String,Object> alertVO = alertService.viewMyAlertDetail(aid);

		int gid = Integer.parseInt(alertVO.get("GID").toString());

		GroupVO groupVO = new GroupVO();
		groupVO.setGid(gid);
		groupVO.setMid(sessionVO.getSessMid());
		groupVO.setRank(1);
		
		if(result.equals("Y")) {
			groupService.ChangeGroupMemberState(groupVO);
		} else {
			groupService.leaveGroup(groupVO);
		}
		
		AlertVO newAlertVO = new AlertVO();
		newAlertVO.setAid(aid);
		newAlertVO.setSelect(result);
		alertService.changeAlertSelect(newAlertVO);

		return "jsonView";
	}
}
