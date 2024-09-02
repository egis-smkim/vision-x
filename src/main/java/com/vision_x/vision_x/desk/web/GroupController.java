package com.vision_x.vision_x.desk.web;

import java.io.UnsupportedEncodingException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import org.json.simple.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.vision_x.vision_x.admin.service.BoardMasterService;
import com.vision_x.vision_x.admin.service.BoardMasterVO;
import com.vision_x.vision_x.desk.alert.service.AlertService;
import com.vision_x.vision_x.desk.alert.service.AlertVO;
import com.vision_x.vision_x.desk.service.GroupService;
import com.vision_x.vision_x.desk.service.GroupVO;
import com.vision_x.vision_x.mail.service.MailerVO;
import com.vision_x.vision_x.mail.service.MailingService;
import com.vision_x.vision_x.mail.service.RecipientForRequest;
import com.vision_x.vision_x.member.service.MemberService;
import com.vision_x.vision_x.member.service.MemberVO;
import com.vision_x.vision_x.utils.SessionVO;

@Controller
public class GroupController {
	
	protected Logger logger = LoggerFactory.getLogger(this.getClass());
	
	@Value("#{globalInfo['Globals.outbound.accesskey']}")
	private String MAIL_API_ACCESSKEY;
	
	@Value("#{globalInfo['Globals.outbound.secretkey']}")
	private String MAIL_API_SECRETKEY;
	
	@Value("#{globalInfo['Globals.outbound.sendURL']}")
	private String MAIL_API_SENDURL;
	
	@Resource(name = "groupService")
	private GroupService groupService;
	
	@Resource(name="boardMasterService")
	private BoardMasterService boardMasterService;
	
	@Resource(name = "mailingService")
	private MailingService mailingService;
	
	@Resource(name = "memberService")
	private MemberService memberService;
	
	@Resource(name = "alertService")
	private AlertService alertService;
	
	@RequestMapping(value = "/desk/group/allList.do", method = RequestMethod.GET)
	public String allGroupList(HttpServletRequest request, Model model) {

		try {
			HttpSession session = request.getSession(true);

			SessionVO sessionVO = new SessionVO();
			sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");

			model.addAttribute("MID", sessionVO.getSessMid());
			model.addAttribute("ENMID", sessionVO.getSessEncryMid());
			model.addAttribute("MEM_ID", sessionVO.getSessMemId());
			model.addAttribute("MEM_LEVEL", sessionVO.getSessMemLevel());
			List<BoardMasterVO> boardList = boardMasterService.selectBoardList();
			model.addAttribute("boardList", boardList);
			List<HashMap<String,String>> myRecentAlert = alertService.recentAlertList(sessionVO.getSessMid());
			int countNoViewAlert = alertService.countNoViewAlert(sessionVO.getSessMid());
			model.addAttribute("RECENT_ALERT", myRecentAlert);
			model.addAttribute("NOVIEW_ALERT_COUNT", countNoViewAlert);
			
			HashMap<String,String> map =  new HashMap<>();
			map.put("memId", sessionVO.getSessMemId());
			HashMap<String, Object> memberMap = memberService.memberLogin(map);
			model.addAttribute("MEM_DEVELOPER", memberMap.get("STATE").toString());
			
			List<GroupVO> myGroupList = groupService.getMyGroupList(sessionVO.getSessMid());
			model.addAttribute("MY_GROUP_LIST",myGroupList);
			
			List<GroupVO> allGroupList = groupService.selectAllGroupList(sessionVO.getSessMid());
			
			model.addAttribute("allGroupList",allGroupList);
			
		} catch (RuntimeException e) {
			logger.error("SESSION ERROR-RuntimeException");
		} catch (Exception e) {
			logger.error("SESSION ERROR");
		}
		return "desk/group/allList";
	}
	
	@RequestMapping(value = "/desk/group/myList.do", method = RequestMethod.GET)
	public String myGroupList(HttpServletRequest request, Model model) {

		try {
			HttpSession session = request.getSession(true);

			SessionVO sessionVO = new SessionVO();
			sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");

			model.addAttribute("MID", sessionVO.getSessMid());
			model.addAttribute("ENMID", sessionVO.getSessEncryMid());
			model.addAttribute("MEM_ID", sessionVO.getSessMemId());
			model.addAttribute("MEM_LEVEL", sessionVO.getSessMemLevel());
			List<BoardMasterVO> boardList = boardMasterService.selectBoardList();
			model.addAttribute("boardList", boardList);
			List<HashMap<String,String>> myRecentAlert = alertService.recentAlertList(sessionVO.getSessMid());
			int countNoViewAlert = alertService.countNoViewAlert(sessionVO.getSessMid());
			model.addAttribute("RECENT_ALERT", myRecentAlert);
			model.addAttribute("NOVIEW_ALERT_COUNT", countNoViewAlert);
			
			HashMap<String,String> map =  new HashMap<>();
			map.put("memId", sessionVO.getSessMemId());
			HashMap<String, Object> memberMap = memberService.memberLogin(map);
			model.addAttribute("MEM_DEVELOPER", memberMap.get("STATE").toString());
			
			List<GroupVO> myGroupList1 = groupService.getMyGroupList(sessionVO.getSessMid());
			model.addAttribute("MY_GROUP_LIST",myGroupList1);

			
			List<GroupVO> myGroupList = groupService.selectMyGroupList(sessionVO.getSessMid());
			
			model.addAttribute("myGroupList",myGroupList);
			
		} catch (RuntimeException e) {
			logger.error("SESSION ERROR-RuntimeException");
		} catch (Exception e) {
			logger.error("SESSION ERROR");
		}
		return "desk/group/myList";
	}

	@RequestMapping(value = "/desk/group/add.do", method = RequestMethod.GET)
	public String addGroup(HttpServletRequest request, Model model) {

		try {
			HttpSession session = request.getSession(true);

			SessionVO sessionVO = new SessionVO();
			sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");

			model.addAttribute("MID", sessionVO.getSessMid());
			model.addAttribute("ENMID", sessionVO.getSessEncryMid());
			model.addAttribute("MEM_ID", sessionVO.getSessMemId());
			model.addAttribute("MEM_LEVEL", sessionVO.getSessMemLevel());
			List<BoardMasterVO> boardList = boardMasterService.selectBoardList();
			model.addAttribute("boardList", boardList);
			List<HashMap<String,String>> myRecentAlert = alertService.recentAlertList(sessionVO.getSessMid());
			int countNoViewAlert = alertService.countNoViewAlert(sessionVO.getSessMid());
			model.addAttribute("RECENT_ALERT", myRecentAlert);
			model.addAttribute("NOVIEW_ALERT_COUNT", countNoViewAlert);
			
			HashMap<String,String> map =  new HashMap<>();
			map.put("memId", sessionVO.getSessMemId());
			HashMap<String, Object> memberMap = memberService.memberLogin(map);
			model.addAttribute("MEM_DEVELOPER", memberMap.get("STATE").toString());
			
			List<GroupVO> myGroupList = groupService.getMyGroupList(sessionVO.getSessMid());
			model.addAttribute("MY_GROUP_LIST",myGroupList);
			
			
		} catch (RuntimeException e) {
			logger.error("SESSION ERROR-RuntimeException");
		} catch (Exception e) {
			logger.error("SESSION ERROR");
		}
		return "desk/group/add";
	}
	
	@RequestMapping(value = "/desk/group/admin.do", method = RequestMethod.GET)
	public String adminGroup(HttpServletRequest request, Model model,@RequestParam(value="gid") int gid) {

		try {
			HttpSession session = request.getSession(true);

			SessionVO sessionVO = new SessionVO();
			sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");

			model.addAttribute("MID", sessionVO.getSessMid());
			model.addAttribute("ENMID", sessionVO.getSessEncryMid());
			model.addAttribute("MEM_ID", sessionVO.getSessMemId());
			model.addAttribute("MEM_LEVEL", sessionVO.getSessMemLevel());
			List<BoardMasterVO> boardList = boardMasterService.selectBoardList();
			model.addAttribute("boardList", boardList);
			List<HashMap<String,String>> myRecentAlert = alertService.recentAlertList(sessionVO.getSessMid());
			int countNoViewAlert = alertService.countNoViewAlert(sessionVO.getSessMid());
			model.addAttribute("RECENT_ALERT", myRecentAlert);
			model.addAttribute("NOVIEW_ALERT_COUNT", countNoViewAlert);
			
			List<GroupVO> myGroupList = groupService.getMyGroupList(sessionVO.getSessMid());
			model.addAttribute("MY_GROUP_LIST",myGroupList);
			
			//그룹 정보
			GroupVO groupVO = groupService.selectGroupInfo(gid);
			model.addAttribute("groupVO", groupVO);
			
			//그룹원 정보
			List<GroupVO> groupMemberVO = groupService.selectGroupMemberList(gid);
			model.addAttribute("groupMemberList", groupMemberVO);
			
			//관리자 계정이 아니고 그룹장이 아니라면
			if(sessionVO.getSessMemLevel() != 10 && (groupVO.getGroup_master() != sessionVO.getSessMid())) {
				return "error/error";
			}
			
		} catch (RuntimeException e) {
			logger.error("SESSION ERROR-RuntimeException");
		} catch (Exception e) {
			logger.error("SESSION ERROR");
		}
		return "desk/group/admin";
	}
	
	@RequestMapping(value = "/desk/group/view.do", method = RequestMethod.GET)
	public String viewGroup(HttpServletRequest request, Model model,@RequestParam(value="gid") int gid) {

		try {
			HttpSession session = request.getSession(true);

			SessionVO sessionVO = new SessionVO();
			sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");

			model.addAttribute("MID", sessionVO.getSessMid());
			model.addAttribute("ENMID", sessionVO.getSessEncryMid());
			model.addAttribute("MEM_ID", sessionVO.getSessMemId());
			model.addAttribute("MEM_LEVEL", sessionVO.getSessMemLevel());
			List<BoardMasterVO> boardList = boardMasterService.selectBoardList();
			model.addAttribute("boardList", boardList);
			List<HashMap<String,String>> myRecentAlert = alertService.recentAlertList(sessionVO.getSessMid());
			int countNoViewAlert = alertService.countNoViewAlert(sessionVO.getSessMid());
			model.addAttribute("RECENT_ALERT", myRecentAlert);
			model.addAttribute("NOVIEW_ALERT_COUNT", countNoViewAlert);
			
			HashMap<String,String> map =  new HashMap<>();
			map.put("memId", sessionVO.getSessMemId());
			HashMap<String, Object> memberMap = memberService.memberLogin(map);
			model.addAttribute("MEM_DEVELOPER", memberMap.get("STATE").toString());
			
			List<GroupVO> myGroupList = groupService.getMyGroupList(sessionVO.getSessMid());
			model.addAttribute("MY_GROUP_LIST",myGroupList);
			
			//그룹 정보
			GroupVO groupVO = groupService.selectGroupInfo(gid);
			model.addAttribute("groupVO", groupVO);
			
			//그룹원 정보
			List<GroupVO> groupMemberVO = groupService.selectGroupMemberList(gid);
			model.addAttribute("groupMemberList", groupMemberVO);
			
		} catch (RuntimeException e) {
			logger.error("SESSION ERROR-RuntimeException");
		} catch (Exception e) {
			logger.error("SESSION ERROR");
		}
		return "desk/group/view";
	}
	
	//그룹 이름 중복 체크
	@RequestMapping(value="/desk/group/nameCheck.do", method=RequestMethod.POST)
	@ResponseBody
	public String nameCheck(Model model, HttpServletRequest request, String group_name){
	
		int result = 0;
		try {
			result = groupService.nameCheck(group_name);

		} catch (RuntimeException e) {
			// TODO Auto-generated catch block
			logger.error("ERROR-RuntimeException");
		}
		if(result != 0) {
			return "fail";	// 중복 앱 이름 존재
		} else {
			return "success";	// 중복 앱 이름 없음
		}	
		
		
	}
	
	@RequestMapping(value = "/desk/group/insert.do", method = RequestMethod.POST)
	public String insertGroup(HttpServletRequest request, Model model) {

		try {
			HttpSession session = request.getSession(true);

			SessionVO sessionVO = new SessionVO();
			sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");

			model.addAttribute("MID", sessionVO.getSessMid());
			model.addAttribute("ENMID", sessionVO.getSessEncryMid());
			model.addAttribute("MEM_ID", sessionVO.getSessMemId());
			model.addAttribute("MEM_LEVEL", sessionVO.getSessMemLevel());
			List<BoardMasterVO> boardList = boardMasterService.selectBoardList();
			model.addAttribute("boardList", boardList);
			
			//int gid = Integer.parseInt(request.getParameter("gid").toString());
			GroupVO groupVO = new GroupVO();
			String group_name = "";
			String group_info = "";
			if(!request.getParameter("group_name").equals(null)) group_name = request.getParameter("group_name").toString();
			if(!request.getParameter("group_info").equals(null)) group_info = request.getParameter("group_info").toString();
			groupVO.setGroup_name(group_name);
			groupVO.setGroup_info(group_info);
			groupVO.setGroup_master(sessionVO.getSessMid());
			
			groupService.insertGroup(groupVO);
			int gid = groupVO.getGid();
			
			GroupVO groupMemberVO = new GroupVO();
			groupMemberVO.setGid(gid);
			groupMemberVO.setMid(sessionVO.getSessMid());
			groupService.insertGroupLeader(groupMemberVO);
			
			//관리자 메일
			final String accesskey = MAIL_API_ACCESSKEY;
			final String secretkey = MAIL_API_SECRETKEY;
			final String apiURL = MAIL_API_SENDURL;
			MailerVO mailerVO = new MailerVO();
			mailerVO.setTemplateSid(393);
			RecipientForRequest recipient = new RecipientForRequest();
			recipient.setAddress("openlab@xdworld.kr");
			recipient.setName("SeoulOpenLAB");
			recipient.setType("R");
			
			RecipientForRequest recipient2 = new RecipientForRequest();
			recipient2.setAddress("song1770@seoul.go.kr");
			recipient2.setName("SeoulCityHall_song1170");
			recipient2.setType("R");
			
			JSONObject jso = new JSONObject();
			
			jso.put("memId",sessionVO.getSessMemId());
			jso.put("group_name",group_name);
			recipient.setParameters(jso);
			recipient2.setParameters(jso);
				
			List<RecipientForRequest> recipients = new ArrayList<RecipientForRequest>();
			recipients.add(recipient);
			//recipients.add(recipient2);

			mailerVO.setRecipients(recipients);	
			mailerVO.setParameters(null);	
			mailerVO.setIndividual(true);	
			mailerVO.setAdvertising(false);	
				
			mailingService.mailSender(mailerVO, accesskey, secretkey, apiURL);	
			
		} catch (RuntimeException e) {
			logger.error("SESSION ERROR-RuntimeException");
		} catch (Exception e) {
			logger.error("SESSION ERROR");
		}
		return "jsonView";
	}
	
	@RequestMapping(value = "/desk/group/joinGroupRequest.do", method = RequestMethod.POST)
	public String joinGroupRequest(HttpServletRequest request, Model model) {

		try {
			HttpSession session = request.getSession(true);

			SessionVO sessionVO = new SessionVO();
			sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");

			model.addAttribute("MID", sessionVO.getSessMid());
			model.addAttribute("ENMID", sessionVO.getSessEncryMid());
			model.addAttribute("MEM_ID", sessionVO.getSessMemId());
			model.addAttribute("MEM_LEVEL", sessionVO.getSessMemLevel());
			
			int gid = 0;
			if(!request.getParameter("gid").equals(null)) gid = Integer.parseInt(request.getParameter("gid").toString());
			GroupVO groupVO = new GroupVO();
			groupVO.setGid(gid);
			groupVO.setMid(sessionVO.getSessMid());
			groupService.joinGroupRequest(groupVO);

			
		} catch (RuntimeException e) {
			logger.error("SESSION ERROR-RuntimeException");
		} catch (Exception e) {
			logger.error("SESSION ERROR");
		}
		return "jsonView";
	}
	
	@RequestMapping(value = "/desk/group/leaveGroup.do", method = RequestMethod.POST)
	public String leaveGroup(HttpServletRequest request, Model model) {

		try {
			HttpSession session = request.getSession(true);

			SessionVO sessionVO = new SessionVO();
			sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");

			model.addAttribute("MID", sessionVO.getSessMid());
			model.addAttribute("ENMID", sessionVO.getSessEncryMid());
			model.addAttribute("MEM_ID", sessionVO.getSessMemId());
			model.addAttribute("MEM_LEVEL", sessionVO.getSessMemLevel());
			
			int gid = 0;
			if(!request.getParameter("gid").equals(null)) gid = Integer.parseInt(request.getParameter("gid").toString());
			GroupVO groupVO = new GroupVO();
			groupVO.setGid(gid);
			groupVO.setMid(sessionVO.getSessMid());
			groupService.leaveGroup(groupVO);

			
		} catch (RuntimeException e) {
			logger.error("SESSION ERROR-RuntimeException");
		} catch (Exception e) {
			logger.error("SESSION ERROR");
		}
		return "jsonView";
	}
	
	@RequestMapping(value = "/desk/group/deleteGroupRequest.do", method = RequestMethod.POST)
	public String deleteGroupRequest(HttpServletRequest request, Model model) {

		try {
			HttpSession session = request.getSession(true);

			SessionVO sessionVO = new SessionVO();
			sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");

			model.addAttribute("MID", sessionVO.getSessMid());
			model.addAttribute("ENMID", sessionVO.getSessEncryMid());
			model.addAttribute("MEM_ID", sessionVO.getSessMemId());
			model.addAttribute("MEM_LEVEL", sessionVO.getSessMemLevel());

			int gid = 0;
			if(!request.getParameter("gid").equals(null)) gid = Integer.parseInt(request.getParameter("gid").toString());
			GroupVO groupVO = new GroupVO();
			groupVO.setGid(gid);
			groupVO.setState(-1);
			groupService.groupStateChange(groupVO);

			groupVO = groupService.selectGroupInfo(gid);

			//관리자 메일
			final String accesskey = MAIL_API_ACCESSKEY;
			final String secretkey = MAIL_API_SECRETKEY;
			final String apiURL = MAIL_API_SENDURL;
			MailerVO mailerVO = new MailerVO();
			mailerVO.setTemplateSid(394);
			RecipientForRequest recipient = new RecipientForRequest();
			recipient.setAddress("openlab@xdworld.kr");
			recipient.setName("SeoulOpenLAB");
			recipient.setType("R");
			
			RecipientForRequest recipient2 = new RecipientForRequest();
			recipient2.setAddress("song1770@seoul.go.kr");
			recipient2.setName("SeoulCityHall_song1170");
			recipient2.setType("R");
			
			JSONObject jso = new JSONObject();
			
			jso.put("memId",sessionVO.getSessMemId());
			jso.put("group_name",groupVO.getGroup_name());
			recipient.setParameters(jso);
			recipient2.setParameters(jso);
				
			List<RecipientForRequest> recipients = new ArrayList<RecipientForRequest>();
			recipients.add(recipient);
			//recipients.add(recipient2);

			mailerVO.setRecipients(recipients);	
			mailerVO.setParameters(null);	
			mailerVO.setIndividual(true);	
			mailerVO.setAdvertising(false);	
				
			mailingService.mailSender(mailerVO, accesskey, secretkey, apiURL);	
		} catch (RuntimeException e) {
			logger.error("SESSION ERROR-RuntimeException");
		} catch (Exception e) {
			logger.error("SESSION ERROR");
		}
		return "jsonView";
	}
	
	@RequestMapping(value = "/desk/group/deleteGroupCancel.do", method = RequestMethod.POST)
	public String deleteGroupCancel(HttpServletRequest request, Model model) {

		try {
			HttpSession session = request.getSession(true);

			SessionVO sessionVO = new SessionVO();
			sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");

			model.addAttribute("MID", sessionVO.getSessMid());
			model.addAttribute("ENMID", sessionVO.getSessEncryMid());
			model.addAttribute("MEM_ID", sessionVO.getSessMemId());
			model.addAttribute("MEM_LEVEL", sessionVO.getSessMemLevel());

			int gid = 0;
			if(!request.getParameter("gid").equals(null)) gid = Integer.parseInt(request.getParameter("gid").toString());
			GroupVO groupVO = new GroupVO();
			groupVO.setGid(gid);
			groupVO.setState(1);
			groupService.groupStateChange(groupVO);

			
		} catch (RuntimeException e) {
			logger.error("SESSION ERROR-RuntimeException");
		} catch (Exception e) {
			logger.error("SESSION ERROR");
		}
		return "jsonView";
	}
	
	@RequestMapping(value = "/desk/group/addGroupCancel.do", method = RequestMethod.POST)
	public String addGroupCancel(HttpServletRequest request, Model model) {

		try {
			HttpSession session = request.getSession(true);

			SessionVO sessionVO = new SessionVO();
			sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");

			model.addAttribute("MID", sessionVO.getSessMid());
			model.addAttribute("ENMID", sessionVO.getSessEncryMid());
			model.addAttribute("MEM_ID", sessionVO.getSessMemId());
			model.addAttribute("MEM_LEVEL", sessionVO.getSessMemLevel());
			int gid = 0;
			if(!request.getParameter("gid").equals(null)) gid = Integer.parseInt(request.getParameter("gid").toString());
			GroupVO groupVO = new GroupVO();
			groupVO.setGid(gid);
			groupService.deleteGroupInfo(groupVO);
			groupService.deleteGroupMember(groupVO);
			
		} catch (RuntimeException e) {
			logger.error("SESSION ERROR-RuntimeException");
		} catch (Exception e) {
			logger.error("SESSION ERROR");
		}
		return "jsonView";
	}
	
	@RequestMapping(value = "/desk/group/inviteMember.do", method = RequestMethod.POST)
	public String inviteMember(HttpServletRequest request, Model model) {

		try {
			HttpSession session = request.getSession(true);

			SessionVO sessionVO = new SessionVO();
			sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");

			model.addAttribute("MID", sessionVO.getSessMid());
			model.addAttribute("ENMID", sessionVO.getSessEncryMid());
			model.addAttribute("MEM_ID", sessionVO.getSessMemId());
			model.addAttribute("MEM_LEVEL", sessionVO.getSessMemLevel());

			int gid = 0;
			if(!request.getParameter("gid").equals(null)) gid = Integer.parseInt(request.getParameter("gid").toString());
			String memid = "";
			if(!request.getParameter("memid").equals(null)) memid = request.getParameter("memid").toString();
			
			MemberVO memIdVO = new MemberVO();
			memIdVO.setMem_id(memid);
			MemberVO memberVO = memberService.getMemberInfoMemId(memIdVO);
			
			GroupVO groupVO = new GroupVO();
			groupVO.setGid(gid);
			groupVO.setMid(memberVO.getMid());
			groupService.inviteGroupRequest(groupVO);
			
			AlertVO alertVO = new AlertVO();
			alertVO.setGid(gid);
			alertVO.setType(Character.toString('G'));
			alertVO.setMid(memberVO.getMid());
			alertService.insertAlert(alertVO);
			

			
		} catch (RuntimeException e) {
			logger.error("SESSION ERROR-RuntimeException");
		} catch (Exception e) {
			logger.error("SESSION ERROR");
		}
		return "jsonView";
	}
	
	@RequestMapping(value = "/desk/group/addGroupMember.do", method = RequestMethod.POST)
	public String addGroupMember(HttpServletRequest request, Model model) {

		try {
			HttpSession session = request.getSession(true);

			SessionVO sessionVO = new SessionVO();
			sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");

			model.addAttribute("MID", sessionVO.getSessMid());
			model.addAttribute("ENMID", sessionVO.getSessEncryMid());
			model.addAttribute("MEM_ID", sessionVO.getSessMemId());
			model.addAttribute("MEM_LEVEL", sessionVO.getSessMemLevel());
			
			int gid = 0;
			if(!request.getParameter("gid").equals(null)) gid = Integer.parseInt(request.getParameter("gid").toString());
			int mid = 0;
			if(!request.getParameter("mid").equals(null)) mid = Integer.parseInt(request.getParameter("mid").toString());
			GroupVO groupVO = new GroupVO();
			groupVO.setGid(gid);
			groupVO.setMid(mid);
			groupVO.setRank(1);
			groupService.ChangeGroupMemberState(groupVO);
			
		} catch (RuntimeException e) {
			logger.error("SESSION ERROR-RuntimeException");
		} catch (Exception e) {
			logger.error("SESSION ERROR");
		}
		return "jsonView";
	}
	
	@RequestMapping(value = "/desk/group/checkInviteMemberID.do", method = RequestMethod.POST)
	public String checkInviteMemberID(HttpServletRequest request, Model model) {

		try {
				
			MemberVO memberVO = new MemberVO();
			memberVO.setMem_id(request.getParameter("mem_id"));
			
			int rs  = memberService.checkMemId(memberVO);
			
			if(rs == 1) {
				MemberVO member2VO = memberService.getMemberInfoMemId(memberVO);
				GroupVO groupVO = new GroupVO();
				int gid = 0;
				if(!request.getParameter("gid").equals(null)) gid = Integer.parseInt(request.getParameter("gid").toString());
				groupVO.setGid(gid);
				groupVO.setMid(member2VO.getMid());
				int num = groupService.checkMId(groupVO);
				
				if(num == 1) {
					rs = 2;
				}
			}
			
			model.addAttribute("rs", rs);
			
		} catch (RuntimeException e) {
			logger.error("SESSION ERROR-RuntimeException");
		} catch (Exception e) {
			logger.error("SESSION ERROR");
		}
		return "jsonView";
	}
	
	@RequestMapping(value = "/desk/group/updateGroup.do", method = RequestMethod.POST)
	public String updateGroup(HttpServletRequest request, Model model) {

		String rs ="fail";
		
		try {
			HttpSession session = request.getSession(true);

			SessionVO sessionVO = new SessionVO();
			sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");

			model.addAttribute("MID", sessionVO.getSessMid());
			model.addAttribute("ENMID", sessionVO.getSessEncryMid());
			model.addAttribute("MEM_ID", sessionVO.getSessMemId());
			model.addAttribute("MEM_LEVEL", sessionVO.getSessMemLevel());
			
			int gid = 0;
			if(!request.getParameter("gid").equals(null)) gid = Integer.parseInt(request.getParameter("gid").toString());
			String group_info = "";
			if(!request.getParameter("group_info").equals(null)) group_info = request.getParameter("group_info").toString();
			//String group_name = request.getParameter("group_name").toString();
			GroupVO groupVO = new GroupVO();
			groupVO.setGid(gid);
			//groupVO.setGroup_name(group_name);
			groupVO.setGroup_info(group_info);
			
			//그룹 정보
			GroupVO mygroupVO = groupService.selectGroupInfo(gid);
			//관리자 계정이 아니고 그룹장이 아니라면
			if(sessionVO.getSessMemLevel() != 10 && (mygroupVO.getGroup_master() != sessionVO.getSessMid())) {
				model.addAttribute("rs", rs);
				return "jsonView";
			}
			
			groupService.updateGroupInfo(groupVO);
			
			
		} catch (RuntimeException e) {
			logger.error("SESSION ERROR-RuntimeException");
		} catch (Exception e) {
			logger.error("SESSION ERROR");
		}
		
		rs = "complete";
		model.addAttribute("rs", rs);
		
		return "jsonView";
	}
	
}
