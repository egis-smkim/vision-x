package com.vision_x.vision_x.desk.mapstore.web;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import com.vision_x.vision_x.admin.service.BoardMasterService;
import com.vision_x.vision_x.admin.service.BoardMasterVO;
import com.vision_x.vision_x.desk.alert.service.AlertService;
import com.vision_x.vision_x.desk.service.GroupService;
import com.vision_x.vision_x.desk.service.GroupVO;
import com.vision_x.vision_x.member.service.MemberService;
import com.vision_x.vision_x.utils.SessionVO;

@Controller
public class MapStoreController {
	
	@Resource(name="memberService")
	private MemberService memberService;
	
	@Resource(name="boardMasterService")
	private BoardMasterService boardMasterService;
	
	@Resource(name = "alertService")
	private AlertService alertService;
	
	@Resource(name="groupService")
	private GroupService groupService;
	
	@RequestMapping(value="/desk/mapstore/list.do")
	public String list(Model model, HttpServletRequest request) throws SQLException {
		
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
		
		List<GroupVO> myGroupList = groupService.getMyGroupList(sessionVO.getSessMid());
		model.addAttribute("MY_GROUP_LIST",myGroupList);
		
		return "desk/store/datamap";
	}
}
