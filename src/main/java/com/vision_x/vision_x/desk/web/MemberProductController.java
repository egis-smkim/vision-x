/**
 * 
 */
package com.vision_x.vision_x.desk.web;

import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.concurrent.TimeUnit;

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
import com.vision_x.vision_x.apps.service.AppsService;
import com.vision_x.vision_x.desk.alert.service.AlertService;
import com.vision_x.vision_x.desk.developer.service.CategoryService;
import com.vision_x.vision_x.desk.developer.service.ModuleService;
import com.vision_x.vision_x.desk.developer.service.ProductService;
import com.vision_x.vision_x.desk.service.GroupService;
import com.vision_x.vision_x.desk.service.GroupVO;
import com.vision_x.vision_x.desk.service.MemberProductGroupItemVO;
import com.vision_x.vision_x.desk.service.MemberProductGroupService;
import com.vision_x.vision_x.desk.service.MemberProductGroupVO;
import com.vision_x.vision_x.desk.service.MemberProductService;
import com.vision_x.vision_x.desk.service.MemberProductVO;
import com.vision_x.vision_x.member.service.MemberService;
import com.vision_x.vision_x.utils.SessionVO;

/**
 * MemberProductController.java
 * digitaltwincloud
 * 2021. 6. 23.
 * @author Khaia
 * @Comment
 *
 */
@Controller
public class MemberProductController {
	
	protected Logger logger = LoggerFactory.getLogger(this.getClass());
	
	@Resource(name="categoryService")
	private CategoryService categoryService;
	
	@Resource(name="productService")
	private ProductService productService;
	
	@Resource(name="memberProductService")
	private MemberProductService memberProductService;
	
	@Resource(name="memberProductGroupService")
	private MemberProductGroupService memberProductGroupService;
	
	@Resource(name="moduleService")
	private ModuleService moduleService;
	
	@Resource(name = "groupService")
	private GroupService groupService;
	
	@Resource(name="appsService")
	private AppsService appsService;
	
	@Resource(name="boardMasterService")
	private BoardMasterService boardMasterService;
	
	@Resource(name = "memberService")
	private MemberService memberService;
	
	@Resource(name = "alertService")
	private AlertService alertService;

	@RequestMapping(value="/desk/memberProduct/executeSortMemberProductByGroup.do", method=RequestMethod.POST)
	public String executeSortMemberProductByGroup(Model model, HttpServletRequest request, @RequestParam(value="mpgid", required=true) String mpgid){
		String rs = "fail";
		
		try {
			HttpSession session = request.getSession(true);
			SessionVO sessionVO = new SessionVO();
			sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");
			
			rs = "complete";
			
			
			if(mpgid.equals("0")) {
				// 전체
				List<MemberProductVO> memberProductList = memberProductService.getMemberProductList(sessionVO.getSessMid());
				
				model.addAttribute("memberProductList", memberProductList);

			} else {
				// 그룹
				HashMap<String, Object> map = new HashMap<>();
				map.put("mid", sessionVO.getSessMemId());
				map.put("mpgid", Integer.parseInt(mpgid));
				
				List<MemberProductVO> memberProductList = memberProductService.selectSortMemberProductItem(map);
				
				model.addAttribute("memberProductList", memberProductList);

			}
			
		} catch (SQLException e) {
			rs = "fail";
			logger.error("SQL Error-SQLException");
		}
		
		model.addAttribute("rs", rs);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/desk/memberProduct/setMemberProductGroup.do", method=RequestMethod.POST)
	public String setMemberProductGroup(Model model, HttpServletRequest request, @RequestParam(value="mpid", required=true) String mpid, @RequestParam(value="mpgid", required=true) String mpgid){
		String rs = "fail";
		try {

			MemberProductVO memberProductVO = memberProductService.selectMemberProductItem(Integer.parseInt(mpid));
			
			
			HttpSession session = request.getSession(true);
			
			SessionVO sessionVO = new SessionVO();
			sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");
			
			MemberProductGroupItemVO memberProductGroupItemVO = new MemberProductGroupItemVO();
			
			memberProductGroupItemVO.setMid(sessionVO.getSessMid());
			memberProductGroupItemVO.setMpid(Integer.parseInt(mpid));
			memberProductGroupItemVO.setMpgid(Integer.parseInt(mpgid));
			memberProductGroupItemVO.setPid(memberProductVO.getPid());
			memberProductGroupItemVO.setState("1");
			
			memberProductGroupItemVO = memberProductGroupService.getMemberProductItemAtSelectGroupCount(memberProductGroupItemVO);
			
			if(memberProductGroupItemVO.getCnt() > 0) {
				rs = "duplicate";
			} else {
				int mpgiid = memberProductGroupService.insertMemberProductGroupItem(memberProductGroupItemVO);
				
				if(mpgiid > 0) {
					rs = "complete";
				}
			}

		} catch (SQLException e) {
			rs = "fail";
			logger.error("SQL Error-SQLException");
		}
		
		model.addAttribute("rs", rs);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/desk/memberProduct/getMemberProgroupList.do", method=RequestMethod.POST)
	public String getMemberProgroupList(Model model, HttpServletRequest request){
		String rs = "fail";
		
		try {
			HttpSession session = request.getSession(true);
			
			SessionVO sessionVO = new SessionVO();
			sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");
			
			List<MemberProductGroupVO> memberProductGroupList = memberProductGroupService.selectMemberProductGroupList(sessionVO.getSessMid());
			
			rs = "complete";
			
			model.addAttribute("memberProductGroupList", memberProductGroupList);
			
		} catch (SQLException e) {
			rs = "fail";
			logger.error("SQL Error-SQLException");
		}
		
		
		model.addAttribute("rs", rs);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/desk/memberProduct/executeAddMemberProductGroup.do", method=RequestMethod.POST)
	public String executeAddMemberProductGroup(Model model, HttpServletRequest request, @RequestParam(value="memberProductGroupName", required=true) String memberProductGroupName){
		String rs = "fail";
		try {
			HttpSession session = request.getSession(true);
			
			SessionVO sessionVO = new SessionVO();
			sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");
			
			int mid = sessionVO.getSessMid();
			
			MemberProductGroupVO memberProductGroupVO = new MemberProductGroupVO();
			memberProductGroupVO.setMid(mid);
			memberProductGroupVO.setName(memberProductGroupName);
			memberProductGroupVO.setState("1");
			
			int mpgid = memberProductGroupService.insertMemberProductGroup(memberProductGroupVO);
			
			if(mpgid > 0) {
				memberProductGroupVO.setMpgid(mpgid);
				
				model.addAttribute("memberProductGroupVO", memberProductGroupVO);
				rs = "complete";
			}

		} catch (SQLException e) {
			rs = "fail";
			logger.error("SQL Error-SQLException");
		}
		
		model.addAttribute("rs", rs);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/desk/memberProduct/list.do", method=RequestMethod.GET)
	public String userProductList(Model model, HttpServletRequest request, @RequestParam(value="mpgid", required=false) String mpgid) {
		try {
			HttpSession session = request.getSession(true);
			
			SessionVO sessionVO = new SessionVO();
			sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");
			
			model.addAttribute("MID", sessionVO.getSessMid());
			model.addAttribute("ENMID", sessionVO.getSessEncryMid());
			model.addAttribute("MEM_ID", sessionVO.getSessMemId());
			model.addAttribute("MEM_LEVEL", sessionVO.getSessMemLevel());
			
			HashMap<String,String> map1 =  new HashMap<>();
			map1.put("memId", sessionVO.getSessMemId());
			HashMap<String, Object> memberMap = memberService.memberLogin(map1);
			model.addAttribute("MEM_DEVELOPER", memberMap.get("STATE").toString());
			
			List<BoardMasterVO> boardList = boardMasterService.selectBoardList();
			model.addAttribute("boardList", boardList);
			
			List<HashMap<String,String>> myRecentAlert = alertService.recentAlertList(sessionVO.getSessMid());
			int countNoViewAlert = alertService.countNoViewAlert(sessionVO.getSessMid());
			
			model.addAttribute("RECENT_ALERT", myRecentAlert);
			model.addAttribute("NOVIEW_ALERT_COUNT", countNoViewAlert);
			
			List<GroupVO> myGroupList = groupService.getMyGroupList(sessionVO.getSessMid());
			model.addAttribute("MY_GROUP_LIST",myGroupList);
			
			List<MemberProductVO> memberProductList = new ArrayList<>();
			
			logger.info("mpgid:"+mpgid);
			
			if(mpgid == null) {
				// 전체
				memberProductList = memberProductService.getMemberProductList(sessionVO.getSessMid());
				//model.addAttribute("memberProductList", memberProductList);

			} else {
				// 그룹
				HashMap<String, Object> map = new HashMap<>();
				map.put("mid", sessionVO.getSessMid());
				map.put("mpgid", Integer.parseInt(mpgid));
				
				memberProductList = memberProductService.selectSortMemberProductItem(map);
				
				//model.addAttribute("memberProductList", memberProductList);

			}
			
			//List<MemberProductVO> memberProductList = memberProductService.getMemberProductList(sessionVO.getSessMid());
			
			SimpleDateFormat transFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			
			for(MemberProductVO memberProductVO : memberProductList) {
				//String strStartDt = memberProductVO.getStart_date();
				Date currentDt = new Date();
				
				//String strStartDt = transFormat.format(currentDt);
				//Date startDt = transFormat.parse(strStartDt);
				
				String strEndDt = memberProductVO.getEnd_date();
				Date endDt = transFormat.parse(strEndDt);
				
				long diff = endDt.getTime() - currentDt.getTime();
				
				int left_days = (int)TimeUnit.DAYS.convert(diff, TimeUnit.MILLISECONDS);
				
				//logger.info("dd:"+TimeUnit.DAYS.convert(diff, TimeUnit.MILLISECONDS));
				
				memberProductVO.setLeft_days(left_days);
			}
			
			List<MemberProductGroupVO> memberProductGroupList = memberProductGroupService.selectMemberProductGroupList(sessionVO.getSessMid());
			
			model.addAttribute("memberProductGroupList", memberProductGroupList);
			
			model.addAttribute("memberProductList", memberProductList);
			
		} catch (SQLException e) {
			logger.error("SQL Error-SQLException");
		} catch (ParseException e) {
			logger.error("SQL Error-ParseException");
		} catch (Exception e) {
			logger.error("SQL ERROR");
		}
		
		return "desk/memberProduct/list";
	}
}
