/**
 * 
 */
package com.vision_x.vision_x.desk.maps.web;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;
import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import org.codehaus.plexus.util.StringUtils;
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
import com.vision_x.vision_x.common.service.LogTrackerService;
import com.vision_x.vision_x.common.service.LogTrackerVO;
import com.vision_x.vision_x.desk.alert.service.AlertService;
import com.vision_x.vision_x.desk.maps.service.MapsService;
import com.vision_x.vision_x.desk.maps.service.MapsVO;
import com.vision_x.vision_x.desk.service.GroupService;
import com.vision_x.vision_x.desk.service.GroupVO;
import com.vision_x.vision_x.member.service.MemberService;
import com.vision_x.vision_x.member.service.MemberVO;
import com.vision_x.vision_x.utils.AES256Cipher;
import com.vision_x.vision_x.utils.GetClientIPAddr;
import com.vision_x.vision_x.utils.SessionVO;

/**
 * MapsController.java
 * digitalTwin
 * 2021. 3. 16.
 * @author Khaia
 * @Comment
 *
 */
@Controller
public class MapsController {
	
	protected Logger logger = LoggerFactory.getLogger(this.getClass());
	
	@Resource(name="mapsService")
	private MapsService mapsService;
	
	@Resource(name="memberService")
	private MemberService memberService;
	
	@Resource(name="logTrackerService")
	private LogTrackerService logTrackerService;
	
	@Resource(name="boardMasterService")
	private BoardMasterService boardMasterService;
	
	@Resource(name = "alertService")
	private AlertService alertService;
	
	@Resource(name="groupService")
	private GroupService groupService;

	@Value("#{globalInfo['Globals.aes.secretkey']}")
	private String AES_SECRETKEY;

	@RequestMapping(value="/desk/maps/list.do", method=RequestMethod.GET)
	public String mapsList(Model model, HttpServletRequest request) {
		
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
			
			MapsVO mapsVO = new MapsVO();
			mapsVO.setMid(sessionVO.getSessMid());
			List<MapsVO> userMapList = mapsService.getMemberMapList(mapsVO);
			
			for(MapsVO userMap:userMapList) {
				String mapid = Integer.toString(userMap.getMapid());
				
				if (StringUtils.isNotEmpty(mapid)) {
					String key = new java.math.BigInteger(AES_SECRETKEY.getBytes()).toString(2).substring(0, 16);
					AES256Cipher aes256 = AES256Cipher.getInstance(key);
					try {
						String encodedMapid = aes256.AES_Encode(mapid, key);
						userMap.setEncodedMapid(encodedMapid);
					} catch (InvalidKeyException | UnsupportedEncodingException | NoSuchAlgorithmException
							| NoSuchPaddingException | InvalidAlgorithmParameterException | IllegalBlockSizeException
							| BadPaddingException e) {
						// TODO Auto-generated catch block
						logger.error("mapsList-Mapid Encoding Error");
					}
				} else {
					logger.error("mapsList-Mapid Encoding Error");
				}
			}
			
			model.addAttribute("mapList", userMapList);
			
			//MAPS 페이지 이동 로그 남기기
			MemberVO mbvo = new MemberVO();
			mbvo.setMem_id(sessionVO.getSessMemId());
			mbvo=memberService.getMemberInfoMemId(mbvo);
			LogTrackerVO logTrackerVO = new LogTrackerVO(mbvo.getMid(),mbvo.getGid(),mbvo.getDlid(),"84", 1, "Maps 열람");
			GetClientIPAddr ip = new GetClientIPAddr();
			String clientIP=ip.getClientIP(request);//클라이언트 ip
			logTrackerVO.setIp(clientIP);
			try {
				logTrackerService.insertLogTracker(logTrackerVO);
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				logger.error("SQLException-SQLException");
			}
		}
		catch (RuntimeException e) {
			logger.error("SELECT ERROR-RuntimeException");
		}
		catch (Exception e) {
			logger.error("SELECT ERROR");
		}
		
		return "desk/maps/list";
	}
	
	@RequestMapping(value="/desk/maps/selectMap.do", method=RequestMethod.POST)
	public String selectMap(Model model, HttpServletRequest request, @RequestParam HashMap<String, Object> postMap) {
		
		String rs = "fail";
		
		try {
			
			HttpSession session = request.getSession(true);
			
			SessionVO sessionVO = new SessionVO();
			sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");
			
			int mapid = Integer.parseInt(postMap.get("mapid").toString());
			
			logger.info("selected MAPID : "+mapid);
			
			MapsVO mapsVO = new MapsVO();
			mapsVO.setMid(sessionVO.getSessMid());
			mapsVO.setMapid(mapid);
			
			mapsVO = mapsService.selectMemberTargetMapCount(mapsVO);
			
			if(mapsVO.getCnt() > 0) {
				rs = "complete";
				request.getSession().setAttribute("mapid", mapid);
			}
		}
		catch (RuntimeException e) {
			logger.error("SELECT ERROR-RuntimeException");
		}
		catch (Exception e) {
			logger.error("SELECT ERROR");
		}
		
		model.addAttribute("rs", rs);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/desk/maps/createNewMap.do", method=RequestMethod.POST)
	public String createNewMap(Model model, HttpServletRequest request) {
		
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
			
			MapsVO cntMapsVO = new MapsVO();
			cntMapsVO.setMid(sessionVO.getSessMid());
			int cnt = mapsService.getMemberMapsCount(cntMapsVO);
			
			
			MapsVO mapsVO = new MapsVO();
			mapsVO.setMid(sessionVO.getSessMid());
			mapsVO.setMap_name("제목없는 지도 "+Integer.toString(cnt + 1));
			
			if(mapsService.createNewMap(mapsVO) == 1) {
				//mapsVO.setMapid(mapsVO.getMapid());
				
				model.addAttribute("rs", "complete");
				model.addAttribute("mapsVO", mapsVO);
				
				
				logger.info("create mapid:"+mapsVO.getMapid());
				
				request.getSession().setAttribute("mapid", mapsVO.getMapid());
			}
		}
		catch (RuntimeException e) {
			logger.error("SELECT ERROR-RuntimeException");
		}
		catch (Exception e) {
			logger.error("SELECT ERROR");
		}
		
		return "jsonView";
	}
	
	@RequestMapping(value="/desk/maps/mapList.do",method=RequestMethod.POST)
	public String mapList(Model model, HttpServletRequest request) {
		
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
			
			MapsVO mapsVO = new MapsVO();
			mapsVO.setMid(sessionVO.getSessMid());
			
			List<MapsVO> userMapList = mapsService.getMemberMapList(mapsVO);
			for(MapsVO userMap:userMapList) {
				String mapid = Integer.toString(userMap.getMapid());
				
				if (StringUtils.isNotEmpty(mapid)) {
					String key = new java.math.BigInteger(AES_SECRETKEY.getBytes()).toString(2).substring(0, 16);
					AES256Cipher aes256 = AES256Cipher.getInstance(key);
					try {
						String encodedMapid = aes256.AES_Encode(mapid, key);
						userMap.setEncodedMapid(encodedMapid);
					} catch (InvalidKeyException | UnsupportedEncodingException | NoSuchAlgorithmException
							| NoSuchPaddingException | InvalidAlgorithmParameterException | IllegalBlockSizeException
							| BadPaddingException e) {
						// TODO Auto-generated catch block
						logger.error("mapsList-Mapid Encoding Error");
					}
				} else {
					logger.error("mapsList-Mapid Encoding Error");
				}
			}
			
			model.addAttribute("mapList", userMapList);
			
		}
		catch (RuntimeException e) {
			logger.error("SELECT ERROR-RuntimeException");
		}
		catch (Exception e) {
			logger.error("SELECT ERROR");
		}
		
		return "jsonView";
	}
	
	@RequestMapping(value="/desk/maps/deleteMap.do", method=RequestMethod.POST)
	public String deleteMap(Model model, HttpServletRequest request,
			@RequestParam(value="mapid") String mapid) {
		
		try {
			MapsVO mapsVO = new MapsVO();

			String key = new java.math.BigInteger(AES_SECRETKEY.getBytes()).toString(2).substring(0, 16);
			AES256Cipher a256 = AES256Cipher.getInstance(key);
			String decodedMapid = a256.AES_Decode(mapid.trim(), key);
			mapsVO.setMapid(Integer.parseInt(decodedMapid));
			if(mapsService.deleteMap(mapsVO) == 1) {
				model.addAttribute("rs", "complete");
			}
			
		}
		catch (RuntimeException e) {
			logger.error("DELETE ERROR-RuntimeException");
		}
		catch (Exception e) {
			logger.error("DELETE ERROR");
		}
		
		return "jsonView";
	}
	
}
