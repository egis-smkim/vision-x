package com.vision_x.vision_x.desk.web;

import java.io.File;
import java.io.IOException;
import java.net.Inet4Address;
import java.net.UnknownHostException;
import java.security.MessageDigest;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Properties;
import java.util.concurrent.TimeUnit;

import javax.annotation.Resource;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.vision_x.vision_x.admin.service.BoardMasterService;

import com.vision_x.vision_x.admin.service.BoardMasterVO;
import com.vision_x.vision_x.common.service.LogTrackerService;
import com.vision_x.vision_x.common.service.LogTrackerVO;
import com.vision_x.vision_x.desk.alert.service.AlertService;
import com.vision_x.vision_x.desk.maps.service.MapsService;
import com.vision_x.vision_x.desk.maps.service.MapsVO;
import com.vision_x.vision_x.desk.service.GroupService;
import com.vision_x.vision_x.desk.service.GroupVO;
import com.vision_x.vision_x.desk.service.MemberProductService;
import com.vision_x.vision_x.desk.service.MemberProductVO;
import com.vision_x.vision_x.member.service.MemberService;
import com.vision_x.vision_x.member.service.MemberVO;
import com.vision_x.vision_x.storage.service.StorageService;
import com.vision_x.vision_x.storage.service.UserStorageService;
import com.vision_x.vision_x.storage.service.UserStorageVO;
import com.vision_x.vision_x.utils.GetClientIPAddr;
import com.vision_x.vision_x.utils.SessionVO;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.itlgl.java.util.ByteUtils;

@Controller
public class DeskController {

	protected Logger logger = LoggerFactory.getLogger(this.getClass());

	@Resource(name = "memberProductService")
	private MemberProductService memberProductService;

	@Resource(name = "mapsService")
	private MapsService mapsService;

	@Resource(name = "storageService")
	private StorageService storageService;

	@Resource(name = "memberService")
	private MemberService memberService;

	@Resource(name = "groupService")
	private GroupService groupService;
	
	@Resource(name="boardMasterService")
	private BoardMasterService boardMasterService;
	
	@Resource(name = "alertService")
	private AlertService alertService;

	@Value("#{globalInfo['Globals.env.mode']}")
	private String ENV_MODE;
	
	@Resource(name="logTrackerService")
	private LogTrackerService logTrackerService;
	
	@Resource(name="userStorageService")
	private UserStorageService userStorageService;
	
	private String HOST_IP = "";
	
	public DeskController() {
	
		try {
			this.HOST_IP =Inet4Address.getLocalHost().getHostName();
		}
		
		catch ( UnknownHostException e ) {
			logger.info("unknowhost exception");
		}
	}
	
	@RequestMapping(value = "/desk/main.do", method = RequestMethod.GET)
	public String main(Model model, HttpServletRequest request) {

		try {
			HttpSession session = request.getSession(true);

			SessionVO sessionVO = new SessionVO();
			sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");

			model.addAttribute("MID", sessionVO.getSessMid());
			model.addAttribute("ENMID", sessionVO.getSessEncryMid());
			model.addAttribute("MEM_ID", sessionVO.getSessMemId());
			model.addAttribute("MEM_LEVEL", sessionVO.getSessMemLevel());
			model.addAttribute("DLID", sessionVO.getSessDlid());
			
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
			model.addAttribute("mapList", userMapList);


			
			List<MemberProductVO> memberProductList = new ArrayList<>();
			memberProductList = memberProductService.getMemberProductList(sessionVO.getSessMid());

			SimpleDateFormat transFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

			for (MemberProductVO memberProductVO : memberProductList) {
				Date currentDt = new Date();

				String strEndDt = memberProductVO.getEnd_date();
				Date endDt = transFormat.parse(strEndDt);

				long diff = endDt.getTime() - currentDt.getTime();

				int left_days = (int) TimeUnit.DAYS.convert(diff, TimeUnit.MILLISECONDS);

				memberProductVO.setLeft_days(left_days);
			}

			model.addAttribute("memberProductList", memberProductList);

			model.addAttribute("mode", "1");
			
			MemberVO memberVO =  new MemberVO();
			memberVO.setMem_id(sessionVO.getSessMemId());
			memberVO = memberService.getMemberInfoMemId(memberVO);
			//dashboard 페이지 이동 로그남기기
			LogTrackerVO logTrackerVO = new LogTrackerVO(memberVO.getMid(),memberVO.getGid(),memberVO.getDlid(),"81", 1, "DashBoard 이동");
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

		return "desk/main";
	}
	/* MAP DATA */
	@RequestMapping(value = "/desk/data/image/add.do")
	public String dataAddImage(Model model, HttpServletRequest request) {
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
		return "desk/data/dataAddImage";
	}

	@RequestMapping(value = "/desk/usage/status.do", method = RequestMethod.GET)
	public String status(Model model, HttpServletRequest request) throws SQLException {

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

		model.addAttribute("rs", "fail");

		String env = "";

		if (ENV_MODE.equals("prod")) {
			env = "www";
		} else {
			env = ENV_MODE;
		}

		String directory = "/data/DT_DATA/userData/" + sessionVO.getSessMemId();
		Double usageTotal = 0.0;
		Double usageUsed = 0.0;
		Double usageRemain;
		File root = null;

		try {
			usageUsed = Double.parseDouble(storageService.checkStorageUsable(directory));
			HashMap<String, String> maxData = storageService.checkStorageMax(sessionVO.getSessMid());
			usageTotal = Double.parseDouble(String.valueOf(maxData.get("STORAGE")));
		}
		catch (RuntimeException e) {
			logger.error("SERVER ERROR-RuntimeException");
		}
		catch (Exception e) {
			logger.error("SERVER ERROR");
		}
		if (usageTotal < 0 || usageUsed < 0) {
			logger.error("storage not found");
		}
		
		usageRemain = usageTotal - usageUsed;
		usageTotal = Math.ceil((usageTotal / 1024 / 1024 / 1024) * 10) / 10;
		usageUsed = Math.ceil((usageUsed / 1024 / 1024 / 1024) * 10) / 10;
		usageRemain = Math.ceil((usageRemain / 1024 / 1024 / 1024) * 10) / 10;
		String[] inDirectory;
		try {
			inDirectory = storageService.checkStorageInDirectory(directory);
			HashMap<String, Double> directoryStorage = new HashMap<>();
			
			if(inDirectory != null) {
				for (int i = 0; i < inDirectory.length; i++) {
					Double directoryUsed;
					directoryUsed = Double.parseDouble(storageService.checkStorageUsable(directory + "/" + inDirectory[i]));
					directoryStorage.put(inDirectory[i], directoryUsed);
				}
			}
			String json = new ObjectMapper().writeValueAsString(directoryStorage);

			model.addAttribute("directoryStorage", json);
			model.addAttribute("usageTotal", usageTotal);
			model.addAttribute("usageUsed", usageUsed);
			model.addAttribute("usageRemain", usageRemain);
			model.addAttribute("rs", "complete");
			//사용량 페이지 이동 로그 남기기
			MemberVO mbvo = new MemberVO();
			mbvo.setMem_id(sessionVO.getSessMemId());
			mbvo = memberService.getMemberInfoMemId(mbvo);
			LogTrackerVO logTrackerVO = new LogTrackerVO(mbvo.getMid(),mbvo.getGid(),mbvo.getDlid(),"88", 1, "사용량 페이지 이동");
			GetClientIPAddr ip = new GetClientIPAddr();
			String clientIP=ip.getClientIP(request);//클라이언트 ip
			logTrackerVO.setIp(clientIP);
			try {
				logTrackerService.insertLogTracker(logTrackerVO);
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				logger.error("SQLException-SQLException");
			}
		} catch (IOException e) {
			logger.error("SERVER ERROR-IOException");
		}
		catch (RuntimeException e) {
			logger.error("SERVER ERROR-RuntimeException");
		}
		catch (Exception e) {
			logger.error("SERVER ERROR");
		}

		return "desk/usage/status";
	}

	@RequestMapping(value = "/desk/main/usageStatus.do", method = RequestMethod.POST)
	public String usageStatus(Model model, HttpServletRequest request) {

		HttpSession session = request.getSession(true);

		SessionVO sessionVO = new SessionVO();
		sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");
		model.addAttribute("rs", "fail");

		String env = "";

		if (ENV_MODE.equals("prod")) {
			env = "www";
		} else {
			env = ENV_MODE;
		}

		String directory = "/data/DT_DATA/userData/" + sessionVO.getSessMemId();
		Double usageTotal = 0.0;
		Double usageUsed = 0.0;

		try {
			usageUsed = Double.parseDouble(storageService.checkStorageUsable(directory));
			HashMap<String, String> maxData = storageService.checkStorageMax(sessionVO.getSessMid());
			if(maxData != null) {
				usageTotal = Double.parseDouble(String.valueOf(maxData.get("STORAGE")));
			}
		}
		catch (RuntimeException e) {
			logger.error("usageStatus ERROR-RuntimeException");
		}
		catch (Exception e) {
			logger.error("SERVER ERROR");
		}

		if (usageTotal < 0 || usageUsed < 0) {
			logger.error("storage not found");
		}
		
		model.addAttribute("usageTotal", usageTotal);
		model.addAttribute("usageUsed", usageUsed);
		model.addAttribute("usageRemain", (usageTotal - usageUsed));
		model.addAttribute("rs", "complete");

		return "jsonView";
	}

	@RequestMapping(value = "/desk/groupMember/resignMember.do", method = RequestMethod.POST)
	public String resignMember(@RequestParam HashMap<String, String> map, Model model) {

		String mid = map.get("mid");
		
		GroupVO groupVO = new GroupVO();
		groupVO.setMid(Integer.parseInt(mid));

		try {

			MemberVO memberVO = new MemberVO();
			memberVO.setMid(Integer.parseInt(mid));
			memberVO = memberService.getMemberInfo(memberVO);
			
			if(groupService.resignMember(groupVO) == 1) {
				model.addAttribute("gid", memberVO.getGid());
				model.addAttribute("rs", "complete");
			}
		}
		catch (RuntimeException e) {
			logger.error("SELECT ERROR-RuntimeException");
			return null;
		}
		catch (Exception e) {
			logger.error("SELECT ERROR");
			return null;
		}
	

		return "jsonView";
	}

	/**
	 * 마이프로필 : 마이프로필 페이지 이동 메소드
	 * 
	 * @param model
	 * @param request
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/desk/myProfile.do", method = RequestMethod.GET)
	public String showMyProfile(Model model, HttpServletRequest request) {
		String ret = "desk/profile/main";
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
			
			MemberVO memberVO = new MemberVO();
			memberVO.setMid(sessionVO.getSessMid());
			memberVO = memberService.getMemberInfo(memberVO);
			//my profile페이지 이동 로그남기기
			LogTrackerVO logTrackerVO = new LogTrackerVO(memberVO.getMid(),memberVO.getGid(),memberVO.getDlid(),"80", 1, "My profile 이동");
			GetClientIPAddr ip = new GetClientIPAddr();
			String clientIP=ip.getClientIP(request);//클라이언트 ip
			logTrackerVO.setIp(clientIP);
			try {
				logTrackerService.insertLogTracker(logTrackerVO);
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				logger.error("SQLException-SQLException");
			}
			
			model.addAttribute("mbVO", memberVO);
			
			String otpNumFromClient =  (String) session.getAttribute("otpNumFromClient");
			String otpNum = (String) session.getAttribute("otpNum");
			
			if(otpNum == null || (otpNum!=null&&otpNumFromClient!=null&&!otpNum.equals(otpNumFromClient))) {
				model.addAttribute("MEM_INFO", "fail");
				return "desk/profile/lock";
			}
			
			long diffTime = 999;
			LocalTime currentTime= LocalTime.now();
			LocalTime otpNumTime = (LocalTime) session.getAttribute("otpNumTime");
			
			if(otpNumTime != null) {
				diffTime = otpNumTime.until(currentTime, ChronoUnit.SECONDS);
			}
			session.removeAttribute("optId");
			session.removeAttribute("otpNum");
			if(diffTime > 180) {
				session.removeAttribute("otpNumTime");
				ret = "desk/profile/lock";
			}
		}
		catch (RuntimeException e) {
			logger.error("SESSION ERROR-RuntimeException");
		}
		catch (Exception e) {
			logger.error("SESSION ERROR");
		}
		return ret;
	}

	/**
	 * 마이 프로필 : '패스워드 변경'버튼 클릭시 현재 비밀번호를 DB와 대조하기 위한 메소드 ajax
	 * 
	 * @param model
	 * @param request
	 * @param map
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/desk/passwordConfirm.do", method = RequestMethod.POST)
	public String passwordConfirm(Model model, HttpServletRequest request, @RequestParam HashMap<String, String> map) {
		try {
			
			String sessionIDFromClient = map.get("id").trim();

			MemberVO memberVO = new MemberVO();
			memberVO.setMem_id(sessionIDFromClient);
			memberVO = memberService.getMemberInfoMemId(memberVO);
			
			String pwd=map.get("pwd");
	        
			String pwdDB = memberVO.getMem_password();
			if (pwd.equals(pwdDB)) {
	        	model.addAttribute("rs", "complete");
	        } else {
	        	model.addAttribute("rs", "fail");
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

	/**
	 * 프로필 정보 변경 후,로그인 페이지 이동
	 * 
	 * @param model
	 * @param request
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/desk/updateProfile.do", method = RequestMethod.POST)
	public String updateProfile(Model model, HttpServletRequest request, @RequestParam HashMap<String, String> map) {
		String rs = "fail";
		if (map != null) {
			
			HttpSession session = request.getSession(true);

			SessionVO sessionVO = new SessionVO();
			sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");

			MemberVO memInfo = new MemberVO();
			try {
				memInfo.setMid(sessionVO.getSessMid());
				memInfo = memberService.getMemberInfo(memInfo);
				String newEmail = map.get("new_email");
				String newMbName = map.get("new_mbName");
				newEmail = XSSFilter(newEmail);
				newMbName = XSSFilter(newMbName);
	            memInfo.setMem_email(newEmail);
	            memInfo.setMem_name(newMbName);
				int updateChk = memberService.updateMember(memInfo);
				model.addAttribute("rs", "complete");
				if(updateChk > -1) {
					rs = "complete";
				}
			}
			catch (RuntimeException e) {
				logger.error("UPDATE ERROR-RuntimeException");
			}
			catch (Exception e) {
				logger.error("UPDATE ERROR");
			}
		}

		model.addAttribute("rs", rs);
		return "jsonView";
	}

	@RequestMapping(value = "/desk/updatePassword.do", method = RequestMethod.POST)
	public String updatePassword(Model model, HttpServletRequest request, @RequestParam HashMap<String, String> map) {
		String rs = "fail";
		if (map != null) {
			
			HttpSession session = request.getSession(true);

			SessionVO sessionVO = new SessionVO();
			sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");

			MemberVO memInfo = new MemberVO();
			try {
				memInfo.setMid(sessionVO.getSessMid());
				memInfo = memberService.getMemberInfo(memInfo);
	            memInfo.setMem_password(map.get("new_pwd"));
	            memInfo.setTemp_pwd_flag(0);
				int updateChk = memberService.updatePw(memInfo);
				
				//패스워드 변경 로그남기기
				LogTrackerVO logTrackerVO = new LogTrackerVO(memInfo.getMid(),memInfo.getGid(),memInfo.getDlid(),"14", 2, "비밀번호 변경");
				GetClientIPAddr ip = new GetClientIPAddr();
				String clientIP=ip.getClientIP(request);//클라이언트 ip
				logTrackerVO.setIp(clientIP);
				try {
					logTrackerService.insertLogTracker(logTrackerVO);
				} catch (SQLException e) {
					// TODO Auto-generated catch block
					logger.error("SQLException-SQLException");
				}
				model.addAttribute("rs", "complete");
				if(updateChk > -1) {
					rs = "complete";
				}
			}
			catch (RuntimeException e) {
				logger.error("UPDATE ERROR-RuntimeException");
			}
			catch (Exception e) {
				logger.error("UPDATE ERROR");
			}
		}

		model.addAttribute("rs", rs);
		return "jsonView";
	}
	
	/**
	 * 프로필 이미지 파일 업로드 메소드
	 * @param model
	 * @param mf 
	 * @param request
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/desk/uploadProfileImg.do", method = RequestMethod.POST)
	public String uploadProfileImg(Model model, @RequestParam("uploadFile") MultipartFile mf,
			HttpServletRequest request) {

		String rs = "fail";
		try {
			HttpSession session = request.getSession(true);

			SessionVO sessionVO = new SessionVO();
			sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");
			
			int chkupload = -1;
			
			UserStorageVO userStorage = userStorageService.getUserStorageInfo(HOST_IP);
			String FILE_DIR = userStorage.getMount_directory();
			String targetDirUrl = userStorage.getDir_url();
			
			String saveDirectory = FILE_DIR+sessionVO.getSessMemId()+File.separator+"SITE_DATA"+File.separator;
			saveDirectory = saveDirectory.replaceAll("\\.", "").replaceAll("\\\\", "").replaceAll("&", "");
			File fileDirectory = new File(saveDirectory);
			fileDirectory.setExecutable(false); //실행권한
			fileDirectory.setReadable(true);   //읽기권한
			fileDirectory.setWritable(true);   //쓰기권한
			
			if(!fileDirectory.isDirectory()) {
				logger.info("no dir");
				fileDirectory.mkdirs();
			}
			
			// 현재시간
			SimpleDateFormat format1 = new SimpleDateFormat("yyyyMMddHHmmss");
			Date time = new Date();
			String time1 = format1.format(time);
			
			//파일명 변경
			String originalFileName = mf.getOriginalFilename();
			String ext = originalFileName.substring(originalFileName.lastIndexOf("."));//.확장자명 .png , .jpg 
			String changedFileName = originalFileName.substring(0,originalFileName.indexOf("."))+"_"+time1+ext;  // 업로드된 파일 네임 + "_" + 현재시간 + ".png"(파일확장자)
			changedFileName = changedFileName.replaceAll("\\\\", "").replaceAll("&", "");
			File target = new File(saveDirectory+changedFileName);
			FileCopyUtils.copy(mf.getBytes(),target);

			try {
				MemberVO memInfo = new MemberVO();
				memInfo.setMid(sessionVO.getSessMid());
				memberService.getMemberInfo(memInfo);

				String serverDir = targetDirUrl + File.separator + sessionVO.getSessMemId() + File.separator + "SITE_DATA" + File.separator;
				memInfo.setMem_profile_img(serverDir+changedFileName);
	            
	            chkupload = memberService.updateMember(memInfo); // 프로필 사진 URL 갱신
	        }
			catch (RuntimeException e) {
				logger.error("FILE UPLOAD ERROR-RuntimeException");
			} catch(Exception e) {
				logger.error("FILE UPLOAD ERROR");
	        }//try-catch(파일명 변경)
				
			if(chkupload > -1) {
				rs = "complete";
			}
			model.addAttribute("rs", rs);
		} 
		catch (IOException e) {
			logger.error("UPDATE ERROR-IOException");
		}
		catch (RuntimeException e) {
			logger.error("UPDATE ERROR-RuntimeException");
		}
		catch (Exception e) {
			logger.error("UPDATE ERROR");
		}
		return "jsonView";
	}
	
	@RequestMapping(value = "/desk/updateOTP.do", method = RequestMethod.POST)
	public String updateOTP(Model model,@RequestParam HashMap<String, String> map, HttpServletRequest request){
		if(map!=null) {

			MemberVO memberVO = new MemberVO();

			HttpSession session = request.getSession(true);
			
			SessionVO sessionVO = new SessionVO();
			sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");
			int mid = sessionVO.getSessMid();
			String memId = sessionVO.getSessMemId();
			map.put("mem_id", memId);
			
			memberVO.setMid(mid);
			try {
				memberVO = memberService.getMemberInfo(memberVO);
				if(memberVO.getMem_level() == 10 && map.get("mem_otp_flg").equals("0")) {
					//관리자인 경우 OTP 수정 불가
					model.addAttribute("rs", "admin");
				}else {
					int otpUpdateChk = memberService.updateOTP(map);
					if(otpUpdateChk==1) {
						model.addAttribute("rs", "complete");
					}else {
						model.addAttribute("rs", "fail");
					}
				}
			}
			catch (SQLException e) {
				logger.error("updateOTP ERROR-SQLException");
			}
			catch (RuntimeException e) {
				logger.error("updateOTP ERROR-RuntimeException");
			}
			catch (Exception e) {
				logger.error("updateOTP ERROR");
			}
			
		}else {
			model.addAttribute("rs", "fail");
		}

		return "jsonView";
	}
	public static String XSSFilter(String str){
	    if(str.toLowerCase().indexOf("javascript") > -1){
	        str = str.replaceAll("(?i)javascript", "");
	    }
	    if(str.toLowerCase().indexOf("script") > -1){
	        str = str.replaceAll("(?i)script", "");
	    }
	    str = str.replaceAll("<","&lt;");
	    str = str.replaceAll(">","&gt;");
	    return str;
	}
}