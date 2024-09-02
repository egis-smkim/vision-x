/**
 * 
 */
package com.vision_x.vision_x.desk.manage.web;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.security.SecureRandom;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import org.apache.commons.lang3.StringUtils;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.vision_x.vision_x.admin.service.BoardMasterService;
import com.vision_x.vision_x.admin.service.BoardMasterVO;
import com.vision_x.vision_x.desk.alert.service.AlertService;
import com.vision_x.vision_x.desk.service.GroupService;
import com.vision_x.vision_x.desk.service.GroupVO;
import com.vision_x.vision_x.enc.service.EncryptService;
import com.vision_x.vision_x.file.service.MultiFileUploadService;
import com.vision_x.vision_x.member.service.MemberPluginService;
import com.vision_x.vision_x.member.service.MemberPluginVO;
import com.vision_x.vision_x.member.service.MemberService;
import com.vision_x.vision_x.tree.service.LayerTreeService;
import com.vision_x.vision_x.tree.service.impl.LayerTreeVO;
import com.vision_x.vision_x.utils.GetClientIPAddr;
import com.vision_x.vision_x.utils.SessionVO;

/**
 * ManageController.java
 * digitaltwincloud
 * 2021. 6. 23.
 * @author Khaia
 * @Comment
 *
 */
@Controller
public class ManageController {
	
	protected Logger logger = LoggerFactory.getLogger(this.getClass());
	
	@Resource(name="multiFileUploadService")
	private MultiFileUploadService multiFileUploadService;
	
	@Resource(name="layerTreeService")
	private LayerTreeService layerTreeService;
	
	@Resource(name="boardMasterService")
	private BoardMasterService boardMasterService;
	
	@Resource(name="memberService")
	private MemberService memberService;

	@Resource(name="memberPluginService")
	private MemberPluginService memberPluginService;

	@Resource(name = "encryptService")
	private EncryptService encryptService;
	
	@Resource(name = "alertService")
	private AlertService alertService;
	
	@Resource(name = "groupService")
	private GroupService groupService;
	
	@RequestMapping(value="/desk/manage/manageDataGroup.do", method=RequestMethod.GET)
	public String manageAppData(Model model, HttpServletRequest request) {
		
		
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
			
			List<GroupVO> myGroupList = groupService.getMyGroupList(sessionVO.getSessMid());
			model.addAttribute("MY_GROUP_LIST",myGroupList);
		}
		catch (RuntimeException e) {
			logger.error("SESSION ERROR-RuntimeException");
		}
		catch (Exception e) {
			logger.error("SESSION ERROR");
		}
		
		return "desk/manage/manage_data_group";
	}
	
	@RequestMapping(value="/desk/manage/getLayerTreeinfo.do", method=RequestMethod.POST)
	public String getLayerTreeinfo(Model model, HttpServletRequest request) {
		
		
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
			
			List<GroupVO> myGroupList = groupService.getMyGroupList(sessionVO.getSessMid());
			model.addAttribute("MY_GROUP_LIST",myGroupList);

			
			LayerTreeVO vo = new LayerTreeVO();
			vo.setMid(sessionVO.getSessMid());//sessionVO.getSessMid() 158 4 test
			
			vo = layerTreeService.getLayerTreeInfo(vo);
			
			int status =404;
			String json_path = "";
			
			// JSON 파일 읽기
			JSONObject js =null;
			JSONArray jsonArr = null;
			FileReader fr = null;

			if(vo == null) {
				
				status=404;
				
			}else {
				
				status =200;
				json_path = vo.getGroup_path();
				try {
					fr = new FileReader(json_path);
					Object obj = new JSONParser().parse(fr);
					
			        // typecasting ob to JSONObject
					jsonArr = (JSONArray) obj;
					
				} catch (FileNotFoundException e) {
					logger.error("File Error-FileNotFoundException");
				}catch(IOException e1) {
					logger.error("Data Access Error-IOException");
				}catch(ParseException e2) {
					logger.error("Parsing Error-ParseException");
				} finally {
					if(fr != null) fr.close();
				}
				
				model.addAttribute("DATA",jsonArr);
			}
			
			
			model.addAttribute("STATUS",status);
		}
		catch (RuntimeException e) {
			logger.error("SESSION ERROR-RuntimeException");
		}
		catch (Exception e) {
			logger.error("SESSION ERROR");
		}
		
		return "jsonView";
	}
	
	@RequestMapping(value="/desk/manage/manageAppKey.do", method=RequestMethod.GET)
	public String manageAppKey(Model model, HttpServletRequest request) {
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
			List<BoardMasterVO> boardList = boardMasterService.selectBoardList();
			model.addAttribute("boardList", boardList);
			
			List<MemberPluginVO>mpvoList=memberPluginService.getMemberPluginList(sessionVO.getSessMid());

			model.addAttribute("userInfoList",mpvoList);
		}
		catch (RuntimeException e) {
			logger.error("SESSION ERROR-RuntimeException");
		}
		catch (Exception e) {
			logger.error("SESSION ERROR");
		}
		
		
		return "desk/manage/manage_app_key";
	}
	
	@RequestMapping(value="/desk/manage/deleteAppKey.do", method=RequestMethod.POST)
	public String deleteAppKey(Model model, HttpServletRequest request) {
		String appkid = request.getParameter("appkid");
		
		if(!StringUtils.isEmpty(appkid)) {
			try {
				HttpSession session = request.getSession(true);
				
				SessionVO sessionVO = new SessionVO();
				sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");

				int appkId = Integer.parseInt(appkid);
				MemberPluginVO mpvo =  new MemberPluginVO();
				mpvo.setMid(sessionVO.getSessMid());
				mpvo.setAppkid(appkId);
				int result = memberPluginService.deleteMemberPluginByAppKeyID(appkId);
				/*int result = memberService.updateAppkey(mbvo);*/
				if(result>0) {
					model.addAttribute("RS", "SUCCESS");
				}
			}
			catch (RuntimeException e) {
				logger.error("SESSION ERROR-RuntimeException");
			}
			catch (Exception e) {
				logger.error("SESSION ERROR");
			}
		
		}
			
		return "jsonView";
	}
	
	@RequestMapping(value="/desk/manage/republishAppKey.do", method=RequestMethod.POST)
	public String republishAppKey(Model model, HttpServletRequest request,@RequestParam HashMap<String,Object> map) {
		
		String appkeyId = "";
		
		if(map!=null) {
			try {
				appkeyId = map.get("appkeyId").toString().trim();
				
				HttpSession session = request.getSession(true);
				
				SessionVO sessionVO = new SessionVO();
				sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");
				
				GetClientIPAddr ipaddr = new GetClientIPAddr();	
				String ip = ipaddr.getClientIP(request);
				String tempString = ""; 
				for (int i = 0; i < 12; i++) {
					SecureRandom r = new SecureRandom();
					tempString += (char) ((r.nextFloat() * 26) + 97);
				}
				if(!StringUtils.isEmpty(appkeyId)) {
					MemberPluginVO mpvo =  new MemberPluginVO();
					mpvo.setMid(sessionVO.getSessMid());
					
					mpvo.setIp(ip);	
					mpvo.setApp_key(encryptService.EncryptedToSha256(tempString+"newlayer"));
					
					mpvo.setAppkid(Integer.parseInt(appkeyId));
					int result = memberPluginService.republishAppKeyID(mpvo);
					if(result>0) {
						model.addAttribute("RS", "SUCCESS");
					}
				}
			}
			catch (RuntimeException e) {
				logger.error("SESSION ERROR-RuntimeException");
			}
			catch (Exception e) {
				logger.error("SESSION ERROR");
			}

		}else {
			try {
				throw new NullPointerException("Requested parameters are empty");
			}
			catch(NullPointerException e) {
				logger.error("ERROR Exception");
			}
		}
		
				
		return "jsonView";
	}
}