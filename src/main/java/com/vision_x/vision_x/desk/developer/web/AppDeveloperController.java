/**
 * 
 */
package com.vision_x.vision_x.desk.developer.web;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.OutputStream;
import java.net.Inet4Address;
import java.net.UnknownHostException;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang.StringEscapeUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.vision_x.vision_x.admin.service.BoardMasterService;
import com.vision_x.vision_x.admin.service.BoardMasterVO;
import com.vision_x.vision_x.desk.alert.service.AlertService;
import com.vision_x.vision_x.desk.developer.service.AppDeveloperService;
import com.vision_x.vision_x.desk.developer.service.AppDeveloperVO;
import com.vision_x.vision_x.desk.developer.service.CategoryService;
import com.vision_x.vision_x.desk.developer.service.CategoryVO;
import com.vision_x.vision_x.desk.developer.service.ModuleExtVO;
import com.vision_x.vision_x.desk.developer.service.ModuleService;
import com.vision_x.vision_x.desk.developer.service.ModuleVO;
import com.vision_x.vision_x.desk.developer.service.ProductService;
import com.vision_x.vision_x.desk.developer.service.ProductVO;
import com.vision_x.vision_x.desk.service.GroupService;
import com.vision_x.vision_x.desk.service.GroupVO;
import com.vision_x.vision_x.desk.service.MemberProductService;
import com.vision_x.vision_x.desk.service.MemberProductVO;
import com.vision_x.vision_x.file.service.FileService;
import com.vision_x.vision_x.file.service.MultiFileUploadService;
import com.vision_x.vision_x.member.service.MemberService;
import com.vision_x.vision_x.member.service.MemberVO;
import com.vision_x.vision_x.storage.service.UserStorageService;
import com.vision_x.vision_x.storage.service.UserStorageVO;
import com.vision_x.vision_x.utils.SessionVO;

/**
 * AppDeveloperController.java digitaltwincloud 2021. 12. 28.
 * 
 * @author Khaia
 * @Comment
 *
 */

@Controller
public class AppDeveloperController {
	protected Logger logger = LoggerFactory.getLogger(this.getClass());

	@Value("#{globalInfo['Globals.file.module.server.path']}")
	private String MODULE_SERVER_PATH; //로컬 경로 /data/DT_DATA/moduleData/
	
	@Value("#{globalInfo['Globals.file.product.server.path']}")
	private String PRODUCT_SERVER_PATH; //  /data/DT_DATA/productData/

	@Resource(name = "moduleService")
	private ModuleService moduleService;
	
	@Resource(name = "appDeveloperService")
	private AppDeveloperService appDeveloperService;

	@Resource(name = "memberService")
	private MemberService memberService;

	@Resource(name = "groupService")
	private GroupService groupService;
	
	@Resource(name="productService")
	private ProductService productService;
	
	@Resource(name = "memberProductService")
	private MemberProductService memberProductService;
	
	@Resource(name="boardMasterService")
	private BoardMasterService boardMasterService;
	
	@Resource(name="categoryService")
	private CategoryService categoryService;

	@Resource(name="multiFileUploadService")
	private MultiFileUploadService multiFileUploadService;

	@Resource(name="fileService")
	private FileService fileService;
	
	@Resource(name="alertService")
	private AlertService alertService;

	@Resource(name="userStorageService")
	private UserStorageService userStorageService;
	
	private String HOST_IP = "";
	
	public AppDeveloperController() {
	
		try {
			HOST_IP =Inet4Address.getLocalHost().getHostName();
		}
		
		catch ( UnknownHostException e ) {
			logger.info("unknowhost exception");
		}
	}

	@RequestMapping(value = "/desk/developer/info.do", method = RequestMethod.GET)
	public String developerInfo(HttpServletRequest request, Model model) {

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
			
			int mid = sessionVO.getSessMid();
			AppDeveloperVO appDeveloperVO = appDeveloperService.getDeveloperInfo(mid);
			model.addAttribute("appDeveloperVO", appDeveloperVO);
			
		} catch (RuntimeException e) {
			logger.error("SESSION ERROR-RuntimeException");
		} catch (Exception e) {
			logger.error("SESSION ERROR");
		}
		return "desk/developer/info";
	}

	@RequestMapping(value = "/desk/developer/add.do", method = RequestMethod.GET)
	public String addDeveloper(HttpServletRequest request, Model model) {
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
			
		} catch (RuntimeException e) {
			logger.error("SESSION ERROR-RuntimeException");
		} catch (Exception e) {
			logger.error("SESSION ERROR");
		}

		return "desk/developer/add";
	}

	@RequestMapping(value = "/desk/developer/edit.do", method = RequestMethod.GET)
	public String editDeveloper(HttpServletRequest request, Model model) {
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
			

			int mid = sessionVO.getSessMid();
			AppDeveloperVO appDeveloperVO = appDeveloperService.getDeveloperInfo(mid);
			model.addAttribute("appDeveloperVO", appDeveloperVO);
			
		} catch (RuntimeException e) {
			logger.error("SESSION ERROR-RuntimeException");
		} catch (Exception e) {
			logger.error("SESSION ERROR");
		}

		return "desk/developer/edit";
	}
	
	@RequestMapping(value = "/desk/developer/createDeveloper.do", method = RequestMethod.POST)
	public String createDeveloper(Model model, HttpServletRequest request, @RequestParam HashMap<String, String> map,
			@RequestParam(value="developerLogo", required=false) MultipartFile mf) {
		String rs = "fail";

		try {

			HttpSession session = request.getSession(true);

			SessionVO sessionVO = new SessionVO();
			sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");

			int mid = sessionVO.getSessMid();
			AppDeveloperVO developerInfo = new AppDeveloperVO();
			developerInfo.setMid(mid);
			developerInfo.setDeveloper_email(map.get("developerEmail"));
			developerInfo.setDeveloper_name(map.get("developerName"));
			developerInfo.setDeveloper_type(map.get("developerType"));
			if(!map.get("developerHomepage").equals("null")) developerInfo.setDeveloper_homepage(map.get("developerHomepage"));
			if(!map.get("developerAbout").equals("null")) developerInfo.setDeveloper_about(map.get("developerAbout"));
			
			if(mf != null) {

				UserStorageVO userStorage = userStorageService.getUserStorageInfo(HOST_IP);
				String FILE_DIR = userStorage.getMount_directory();
				String targetDirUrl = userStorage.getDir_url();
				
				String saveDirectory = FILE_DIR+sessionVO.getSessMemId()+File.separator+"SITE_DATA"+File.separator;
				
				fileService.createAndChmodDirectory(saveDirectory, "755");
				
				HashMap<String, Object> map1 = multiFileUploadService.saveSingleFileToPath(mf, saveDirectory);
				
				logger.info("/userData/"+sessionVO.getSessMemId()+"/SITE_DATA/"+map1.get("SAVED_FILE_NAME"));

				developerInfo.setDeveloper_logo_path(saveDirectory+map1.get("SAVED_FILE_NAME"));
				developerInfo.setDeveloper_logo_url(targetDirUrl+sessionVO.getSessMemId()+"/SITE_DATA/"+map1.get("SAVED_FILE_NAME"));
			}

			int updateChk = appDeveloperService.createDeveloper(developerInfo);
			model.addAttribute("rs", "complete");
			if(updateChk > -1) {
				rs = "complete";
			}

			rs = "complete";
			model.addAttribute("appDeveloperVO", developerInfo);

		} catch (RuntimeException e) {
			logger.error("SELECT ERROR-RuntimeException");
		} catch (Exception e) {
			logger.error("SELECT ERROR");
		}

		model.addAttribute("rs", rs);

		return "jsonView";
	}

	@RequestMapping(value = "/desk/developer/updateDeveloper.do", method = RequestMethod.POST)
	public String updateDeveloper(Model model, HttpServletRequest request, @RequestParam HashMap<String, String> map,
			@RequestParam(value="developerLogo", required=false) MultipartFile mf) {
		String rs = "fail";

		try {

			HttpSession session = request.getSession(true);

			SessionVO sessionVO = new SessionVO();
			sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");

			int mid = sessionVO.getSessMid();
			AppDeveloperVO developerInfo = new AppDeveloperVO();
			AppDeveloperVO appDeveloperVO = appDeveloperService.getDeveloperInfo(mid);
			
			developerInfo.setAdid(appDeveloperVO.getAdid());
			developerInfo.setDeveloper_email(map.get("developerEmail"));
			developerInfo.setDeveloper_name(map.get("developerName"));
			developerInfo.setDeveloper_type(map.get("developerType"));
			if(!map.get("developerHomepage").equals("null")) developerInfo.setDeveloper_homepage(map.get("developerHomepage"));
			if(!map.get("developerAbout").equals("null")) developerInfo.setDeveloper_about(map.get("developerAbout"));
			
			if(map.get("deleteLogo").equals("true")) {
				multiFileUploadService.deleteFile(appDeveloperVO.getDeveloper_logo_path());
				developerInfo.setDeveloper_logo_path(null);
				developerInfo.setDeveloper_logo_url(null);
			}else {
				developerInfo.setDeveloper_logo_path(appDeveloperVO.getDeveloper_logo_path());
				developerInfo.setDeveloper_logo_url(appDeveloperVO.getDeveloper_logo_url());
			}

			if(mf != null) {
				if(appDeveloperVO.getDeveloper_logo_path() != null) {
					multiFileUploadService.deleteFile(appDeveloperVO.getDeveloper_logo_path());
				}
				
				UserStorageVO userStorage = userStorageService.getUserStorageInfo(HOST_IP);
				String FILE_DIR = userStorage.getMount_directory();
				String targetDirUrl = userStorage.getDir_url();
				
				String saveDirectory = FILE_DIR+sessionVO.getSessMemId()+File.separator+"SITE_DATA"+File.separator;
				
				fileService.createAndChmodDirectory(saveDirectory, "755");
				
				HashMap<String, Object> map1 = multiFileUploadService.saveSingleFileToPath(mf, saveDirectory);
				
				logger.info(targetDirUrl+sessionVO.getSessMemId()+"/SITE_DATA/"+map1.get("SAVED_FILE_NAME"));

				developerInfo.setDeveloper_logo_path(saveDirectory+map1.get("SAVED_FILE_NAME"));
				developerInfo.setDeveloper_logo_url(targetDirUrl+sessionVO.getSessMemId()+"/SITE_DATA/"+map1.get("SAVED_FILE_NAME"));
			}

			int updateChk = appDeveloperService.updateDeveloper(developerInfo);
			model.addAttribute("rs", "complete");
			if(updateChk > -1) {
				rs = "complete";
			}

			rs = "complete";
			model.addAttribute("appDeveloperVO", developerInfo);

		} catch (RuntimeException e) {
			logger.error("SELECT ERROR-RuntimeException");
		} catch (Exception e) {
			logger.error("SELECT ERROR");
		}

		model.addAttribute("rs", rs);

		return "jsonView";
	}
	
	@RequestMapping(value = "/desk/developer/getDeveloperInfo.do", method = RequestMethod.POST)
	public String executeMemberBackupSetting(HttpServletRequest request, Model model) {
		String rs = "fail";

		try {

			HttpSession session = request.getSession(true);

			SessionVO sessionVO = new SessionVO();
			sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");

			int mid = sessionVO.getSessMid();

			AppDeveloperVO appDeveloperVO = appDeveloperService.getDeveloperInfo(mid);

			rs = "complete";
			model.addAttribute("appDeveloperVO", appDeveloperVO);

		} catch (RuntimeException e) {
			logger.error("SELECT ERROR-RuntimeException");
		} catch (Exception e) {
			logger.error("SELECT ERROR");
		}

		model.addAttribute("rs", rs);

		return "jsonView";
	}

	// 내 앱 관리
	@RequestMapping(value = "/desk/developer/apps_list.do", method = RequestMethod.GET)
	public String manageApp_list(HttpServletRequest request, Model model) {
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
			try {

				memberVO.setMid(sessionVO.getSessMid());
				memberVO = memberService.getMemberInfo(memberVO);
				model.addAttribute("memberVO", memberVO);

				GroupVO groupVO = new GroupVO();
				groupVO.setGid(memberVO.getGid());

				List<MemberVO> memberList = groupService.selectGroupMember(groupVO);
				model.addAttribute("memberList", memberList);
				
				List<MemberProductVO> myProductsList = memberProductService.getMemberProductList(sessionVO.getSessMid());//30은 임시 테스트 --  sessionVO.getSessMid();  
				int MbTotalPaidCost = 0; //총 결제액
				int MbTotalUsingAppsNum = myProductsList.size();//사용하고 있는 어플리케이션 수
				int active = 0; // 사용가능 어플리케이션 수.
				int inactive = 0; // 사용 불가능 어플리케이션 수.
				int likes = 0;//관심상품
				//총 결제 금액
				for(MemberProductVO mbpv : myProductsList) {
					MbTotalPaidCost += mbpv.getPrice();
					//likes +=mbpv.getPrdct_like();
				}  
				//사용가능,불가능 앱 갯수
				for(MemberProductVO mbpv : myProductsList) {
					if(mbpv.getState().equals("1")) {
						active++;
					}else {
						inactive++;
					}
				}
				model.addAttribute("myProductsList", myProductsList);
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

		return "desk/developer/apps_list";
	}
	/*//차트 리셋
	@RequestMapping(value = "/desk/developer/resetChart.do", method = RequestMethod.POST)
	public String resetChart(HttpServletRequest request, Model model) {
		try {
			HttpSession session = request.getSession(true);

			SessionVO sessionVO = new SessionVO();
			sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");

			model.addAttribute("MID", sessionVO.getSessMid());
			model.addAttribute("ENMID", sessionVO.getSessEncryMid());
			model.addAttribute("MEM_ID", sessionVO.getSessMemId());
			model.addAttribute("MEM_LEVEL", sessionVO.getSessMemLevel());

		} catch (RuntimeException e) {
			logger.error("SESSION ERROR-RuntimeException");
		} catch (Exception e) {
			logger.error("SESSION ERROR");
		}

		return "jsonView";
	}*/

	// 앱 개발 가이드
	@RequestMapping(value = "/desk/developer/guide.do", method = RequestMethod.GET)
	public String appDevGuide(HttpServletRequest request, Model model) {
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
			
		} catch (RuntimeException e) {
			logger.error("SESSION ERROR-RuntimeException");
		} catch (Exception e) {
			logger.error("SESSION ERROR");
		}

		return "desk/developer/guide";
	}
	
	/*@RequestMapping(value = "/desk/developer/setEModal.do", method = RequestMethod.POST)
	public String setEModal(HttpServletRequest request, Model model) {
		String pid = request.getParameter("pid");
		if(pid!=null&&!pid.equals("")) {
			ProductVO productVO = new ProductVO();
			//productVO.setMid(sessionVO.getSessMid());
			productVO.setMid(Integer.parseInt(pid));//테스트 확인 가능

			
		}
		return "jsonView";
	}*/

	@RequestMapping(value = "/desk/developer/prdctLike.do", method = RequestMethod.POST)
	public String doLike(HttpServletRequest request, Model model) {
		
		return "jsonView";
	}
	
	@RequestMapping(value = "/desk/developer/prdctLikeUndo.do", method = RequestMethod.POST)
	public String undoLike(HttpServletRequest request, Model model) {
		
		return "jsonView";
	}
	
	
	
	@RequestMapping(value="/desk/developer/developmentTool.do", method=RequestMethod.POST)
	public String developmentTool(HttpServletRequest request, Model model,@RequestParam HashMap<String,Object> map, HttpServletResponse response) throws IOException{
		
		HttpSession session = request.getSession(true);
		
		SessionVO sessionVO = new SessionVO();
		sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");
		
		model.addAttribute("MID", sessionVO.getSessMid());
		model.addAttribute("ENMID", sessionVO.getSessEncryMid());
		model.addAttribute("MEM_ID", sessionVO.getSessMemId());
		model.addAttribute("MEM_LEVEL", sessionVO.getSessMemLevel());
		
		if(session != null) {
			model.addAttribute("sessionCheck", 1);
		} else {
			model.addAttribute("sessionCheck", 0);
		}
		
		model.addAttribute("appObj", map.get("appObj").toString());
		model.addAttribute("useExtLibs", map.get("use_ext_libs").toString());
		model.addAttribute("design_type", map.get("design_type").toString());

		//response.sendRedirect("http://localhost:8087/main");
		//return "redirect:http://localhost:8087/main";
		return "jsonView";
	}
	
	//앱 이름 중복 체크
	@RequestMapping(value="/desk/developer/appNameCheck.do", method=RequestMethod.POST)
	@ResponseBody
	public String appNameCheck(Model model, HttpServletRequest request, String appObj){
	
		int result = 0;
		try {
			result = moduleService.appNameCheck(appObj);
		} catch (SQLException e) {
			logger.error("ERROR-SQLException");
		}

		if(result != 0) {
			return "fail";	// 중복 앱 이름 존재
		} else {
			return "success";	// 중복 앱 이름 없음
		}	
		
		
	}
	
	//모듈
	@RequestMapping(value = "/desk/developer/moduleList.do", method = RequestMethod.GET)
	public String moduleList(HttpServletRequest request, Model model) {
		
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
			

			int mid = sessionVO.getSessMid();
			List<ModuleVO> moduleList = moduleService.selectUserAvailableModuleList(mid);
			
			model.addAttribute("moduleList", moduleList);
			
			
		} catch (RuntimeException e) {
			logger.error("SESSION ERROR-RuntimeException");
		} catch (Exception e) {
			logger.error("SESSION ERROR");
		}

		return "desk/module/list";
	}
	
	@RequestMapping(value="/desk/developer/moduleAdd.do",method=RequestMethod.GET)
	public String addModule(HttpServletRequest request, Model model) {
		
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
			
			
			List<CategoryVO> largeCategory = categoryService.getLargeCategoryList();
			
			model.addAttribute("categoryList", largeCategory);
			
		} catch (SQLException e) {
			logger.error("[ERROR-MDC-003]-sql error");
		}

		return "desk/module/add";
	}
	
	@RequestMapping(value="/desk/developer/executeAddModule.do", method=RequestMethod.POST)
	public String executeAddModule(Model model, HttpServletRequest request, 
			@RequestParam(value="module_js_file", required=true) MultipartFile module_js_file,
			@RequestParam(value="module_css_file", required=true) MultipartFile module_css_file,
			@RequestParam(value="module_html_file", required=true) MultipartFile module_html_file,
			@RequestParam(value="module_ext_files", required=false) List<MultipartFile> module_ext_files, 
			@RequestParam HashMap<String,Object> postMap) {
		
		String rs = "fail";
		logger.info("ADD");
		
		String cid = "";
		int mdid = -1;
		
		if(!postMap.get("s_cid").equals("null")) {
			cid = postMap.get("s_cid").toString();
		} else if(postMap.get("s_cid").equals("null") && !postMap.get("m_cid").equals("null")) {
			cid = postMap.get("m_cid").toString();
		} else if(postMap.get("s_cid").equals("null") && postMap.get("m_cid").equals("null") && !postMap.get("l_cid").equals("null")) {
			cid = postMap.get("l_cid").toString();
		}
		
		String ver = "";
		
		if(!postMap.get("moduleVer").equals("")) {
			ver = postMap.get("moduleVer").toString();
		} else {
			ver = "1.0";
		}
		
		HttpSession session = request.getSession();

		SessionVO sessionVO = new SessionVO();
		sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");
		
		ModuleVO moduleVO = new ModuleVO();
		moduleVO.setCid(Integer.parseInt(cid));
		moduleVO.setMid(sessionVO.getSessMid());
		moduleVO.setName(postMap.get("module_name").toString());
		moduleVO.setDev_author(postMap.get("author_name").toString());
		moduleVO.setVersion(ver);
		moduleVO.setModule_obj(postMap.get("moduleObj").toString());
		moduleVO.setDevelop_type(Integer.parseInt(postMap.get("develop_type").toString()));
		moduleVO.setDesign_type(Integer.parseInt(postMap.get("design_type").toString()));
		
		try {
			
			moduleVO.setIs_extjs(postMap.get("use_ext_libs").toString());
			
			moduleService.insertModule(moduleVO);
			mdid = moduleVO.getMdid();
	
			String saveDirectory = MODULE_SERVER_PATH + moduleVO.getMdid() + File.separator + ver + File.separator;
			
			String saveServerUrl = "/moduleData/"+moduleVO.getMdid()+"/"+ver+"/";
			
			if(module_js_file != null) {
				if(multiFileUploadService.saveSingleFileToDir(module_js_file, saveDirectory)) {
					moduleVO.setJs_url(saveServerUrl+module_js_file.getOriginalFilename());
				}
			}
			
			if(module_css_file != null) {
				if(multiFileUploadService.saveSingleFileToDir(module_css_file, saveDirectory)) {
					moduleVO.setCss_url(saveServerUrl+module_css_file.getOriginalFilename());
				}
			}
			
			if(module_html_file != null) {
				if(multiFileUploadService.saveSingleFileToDir(module_html_file, saveDirectory)) {
					moduleVO.setHtml_url(saveServerUrl+module_html_file.getOriginalFilename());
				}
			}
			moduleVO.setData_directory(saveServerUrl);
			
			// update module
			if(moduleService.updateModuleFiles(moduleVO) == 1) {
			
				logger.info("exts:"+module_ext_files.size());
				
				String saveDirectoryExt = MODULE_SERVER_PATH + moduleVO.getMdid() + File.separator + ver + File.separator + "ext" + File.separator;
				
				String saveServerUrlExt = "/moduleData/"+moduleVO.getMdid()+"/"+ver+"/ext/";
				
				if(module_ext_files.size() > 0 && postMap.get("use_ext_libs").toString().equals("Y")) {
					// add Module Exts
					for(MultipartFile mf : module_ext_files) {
						if(multiFileUploadService.saveSingleFileToDir(mf, saveDirectoryExt)) {
							
							ModuleExtVO moduleExtVO = new ModuleExtVO();
							
							moduleExtVO.setMdid(mdid);
							String ext = FilenameUtils.getExtension(mf.getOriginalFilename());
							moduleExtVO.setFile_type(ext);
							moduleExtVO.setFile_name(mf.getOriginalFilename());
							moduleExtVO.setFile_url(saveServerUrlExt+mf.getOriginalFilename());
							moduleService.insertModuleExt(moduleExtVO);
						}
					}
				}
				
			}
			
			if(mdid > 0) {
				rs = "complete";
			}
		}
		catch (RuntimeException e) {
			rs = "fail";
			logger.error("UPDATE ERROR-RuntimeException");
		}
		catch (Exception e) {
			rs = "fail";
			logger.error("UPDATE ERROR");
		}

		model.addAttribute("mdid", mdid);
		model.addAttribute("rs", rs);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/desk/developer/executeEdit.do", method=RequestMethod.POST)
	public String executeEdit(Model model, HttpServletRequest request, @RequestParam HashMap<String,Object> postMap,
			@RequestParam(value="module_js_file", required=false) MultipartFile module_js_file,
			@RequestParam(value="module_css_file", required=false) MultipartFile module_css_file,
			@RequestParam(value="module_html_file", required=false) MultipartFile module_html_file,
			@RequestParam(value="module_ext_files", required=false) List<MultipartFile> module_ext_files) {
	
		String rs = "fail";
		
		String cid = "";
		
		if(!postMap.get("s_cid").equals("null")) {
			cid = postMap.get("s_cid").toString();
		} else if(postMap.get("s_cid").equals("null") && !postMap.get("m_cid").equals("null")) {
			cid = postMap.get("m_cid").toString();
		} else if(postMap.get("s_cid").equals("null") && postMap.get("m_cid").equals("null") && !postMap.get("l_cid").equals("null")) {
			cid = postMap.get("l_cid").toString();
		}
		String ver = "";
		
		if(!postMap.get("moduleVer").equals("")) {
			ver = postMap.get("moduleVer").toString();
		} else {
			ver = "1.0";
		}
		
		ModuleVO moduleVO = new ModuleVO();
		moduleVO.setMdid(Integer.parseInt(postMap.get("mdid").toString()));
		moduleVO.setCid(Integer.parseInt(cid));
		moduleVO.setName(postMap.get("name").toString());
		moduleVO.setDev_author(postMap.get("author_name").toString());
		moduleVO.setVersion(ver);
		moduleVO.setModule_obj(postMap.get("moduleObj").toString());
		moduleVO.setState(postMap.get("state").toString());
		moduleVO.setDevelop_type(Integer.parseInt(postMap.get("develop_type").toString()));
		moduleVO.setDesign_type(Integer.parseInt(postMap.get("design_type").toString()));
		
		String saveDirectory = MODULE_SERVER_PATH + moduleVO.getMdid() + File.separator + ver + File.separator;
		
		String saveServerUrl = "/moduleData/"+moduleVO.getMdid()+"/"+ver+"/";

		try {
			if(module_js_file != null) {
				if(multiFileUploadService.saveSingleFileToDir(module_js_file, saveDirectory)) {
					moduleVO.setJs_url(saveServerUrl+module_js_file.getOriginalFilename());
				}
			}
			
			if(module_css_file != null) {
				if(multiFileUploadService.saveSingleFileToDir(module_css_file, saveDirectory)) {
					moduleVO.setCss_url(saveServerUrl+module_css_file.getOriginalFilename());
				}
			}
			
			if(module_html_file != null) {
				if(multiFileUploadService.saveSingleFileToDir(module_html_file, saveDirectory)) {
					moduleVO.setHtml_url(saveServerUrl+module_html_file.getOriginalFilename());
				}
			}
			
			moduleVO.setIs_extjs(postMap.get("use_ext_libs").toString());
			moduleVO.setData_directory(saveServerUrl);
			
			int isUpdate = moduleService.updateModule(moduleVO);
			
			logger.info("isUpdate:"+isUpdate);
			/// insert Module VO
			
			logger.info("exts:"+module_ext_files.size());
			
			String saveDirectoryExt = MODULE_SERVER_PATH + moduleVO.getMdid() + File.separator + ver + File.separator + "ext" + File.separator;
			
			String saveServerUrlExt = "/moduleData/"+moduleVO.getMdid()+"/"+ver+"/ext/";
			
			if(module_ext_files.size() > 0 && postMap.get("use_ext_libs").toString().equals("Y")) {
				// add Module Exts
				
				for(MultipartFile mf : module_ext_files) {
					if(multiFileUploadService.saveSingleFileToDir(mf, saveDirectoryExt)) {
						
						ModuleExtVO moduleExtVO = new ModuleExtVO();
						
						moduleExtVO.setMdid(moduleVO.getMdid());
						String ext = FilenameUtils.getExtension(mf.getOriginalFilename());
						moduleExtVO.setFile_type(ext);
						moduleExtVO.setFile_name(mf.getOriginalFilename());
						moduleExtVO.setFile_url(saveServerUrlExt+mf.getOriginalFilename());
						moduleService.insertModuleExt(moduleExtVO);
					}
				}
			}
			if(isUpdate > 0) {
				rs = "complete";
			}
		}
		catch (RuntimeException e) {
			rs = "fail";
			logger.error("UPDATE ERROR-RuntimeException");
		}
		catch (Exception e) {
			rs = "fail";
			logger.error("UPDATE ERROR");
		}
		
		model.addAttribute("rs", rs);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/sample.do", method=RequestMethod.GET)
	public String storeView(Model model, HttpServletRequest request){
		
		HttpSession session = request.getSession(true);
		
		SessionVO sessionVO = new SessionVO();
		sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");
		
		model.addAttribute("MID", sessionVO.getSessMid());
		model.addAttribute("ENMID", sessionVO.getSessEncryMid());
		model.addAttribute("MEM_ID", sessionVO.getSessMemId());
		model.addAttribute("MEM_LEVEL", sessionVO.getSessMemLevel());
			
		
		return "sample/main";
	}
	
	@RequestMapping(value="/desk/developer/moduleEdit.do",method=RequestMethod.GET)
	public String editModule(HttpServletRequest request, Model model, @RequestParam("mdid") String mdid) {
		
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
			
			ModuleVO moduleVO = new ModuleVO();
			moduleVO.setMdid(Integer.parseInt(mdid));
			
			moduleVO = moduleService.selectModuleItem(moduleVO);
			
			model.addAttribute("moduleVO", moduleVO); 
			
			if(moduleVO.getIs_extjs().equals("Y")) {
				List<ModuleExtVO> moduleExtList = moduleService.selectModuleExtList(moduleVO);
				model.addAttribute("moduleExtList", moduleExtList);
				
			}
			
			List<CategoryVO> largeCategoryList = categoryService.getLargeCategoryList();
			
			CategoryVO categoryVO = new CategoryVO();
			
			categoryVO.setCid(moduleVO.getCid());
			
			CategoryVO moduleCategoryVO = categoryService.getCategoryItem(categoryVO);
			
			model.addAttribute("largeCategoryList", largeCategoryList);
			model.addAttribute("moduleCategoryVO", moduleCategoryVO);
			
			CategoryVO middleCategoryVO = new CategoryVO();
			middleCategoryVO.setL_cate(moduleCategoryVO.getL_cate());
			
			List<CategoryVO> middleCategoryList = categoryService.getMiddleCategoryList(moduleCategoryVO);
			
			model.addAttribute("middleCategoryList", middleCategoryList);
			
			
			HashMap<String, Object> cateMap = new HashMap<>();
			cateMap.put("L_CATE", moduleCategoryVO.getL_cate());
			cateMap.put("M_CATE", moduleCategoryVO.getM_cate());

			List<CategoryVO> smallCategoryList = categoryService.getSmallCategoryList(cateMap);
			
			model.addAttribute("smallCategoryList", smallCategoryList);			
			
		} catch (SQLException e) {
			logger.error("[ERROR-MDC-002]-sql error");
			
		}

		return "desk/module/edit";
	}
	@RequestMapping(value="/desk/developer/moduleDeleteRequest.do", method=RequestMethod.POST)
	public String moduleDeleteRequest(Model model, HttpServletRequest request, @RequestParam HashMap<String,Object> postMap) {
		String rs = "fail";
		int mdid = Integer.parseInt(postMap.get("mdid").toString());
		ModuleVO moduleVO = new ModuleVO();
		moduleVO.setMdid(mdid);

		moduleVO = moduleService.selectModuleItem(moduleVO);
		int rsProduct = productService.selectCheckModule(mdid);
		if(rsProduct == 0) {
			try {
				moduleVO.setState(postMap.get("state").toString());
				moduleService.updateModule(moduleVO);
				rs = "complete";
			}
			catch (NullPointerException e) {
				logger.error("UPDATE ERROR-NullPointerException");
			}
			catch (RuntimeException e) {
				logger.error("UPDATE ERROR-RuntimeException");
			}
			catch (Exception e) {
				logger.error("DELETE ERROR");
			}
		}else {
			rs = "use";
		}
		model.addAttribute("rs", rs);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/desk/developer/executeDeleteExt.do", method=RequestMethod.POST)
	public String executeDeleteExt(Model model, HttpServletRequest request, @RequestParam("meid") String meid) {
		
		String rs = "fail";

		try {
			if(meid==null || meid.equals("")) {
				throw new NullPointerException();
			}
			ModuleExtVO moduleExtVO = new ModuleExtVO();
			moduleExtVO.setMeid(Integer.parseInt(meid));
			
			HttpSession session = request.getSession();
			
			moduleExtVO = moduleService.selectModuleExtItem(moduleExtVO);
			
			ModuleVO moduleVO = new ModuleVO();
			moduleVO.setMdid(moduleExtVO.getMdid());
			
			moduleVO = moduleService.selectModuleItem(moduleVO);
			
			String fileName = moduleExtVO.getFile_name();
			fileName = fileName.replaceAll("\\.", "").replaceAll("\\\\", "");
			// Delete Module Ext File
			String saveExtFilePath = MODULE_SERVER_PATH + moduleExtVO.getFile_url().replace("/moduleData", "");
			
			logger.info("f:"+saveExtFilePath);
			
			if(multiFileUploadService.deleteFile(saveExtFilePath)) {
				// delete SQL
				if(moduleService.deleteModuleExtItem(moduleExtVO) == 1) {
					rs = "complete";
				}
			} else {
				File ef = new File(saveExtFilePath);
				
				if(!ef.exists()) {
					// delete SQL
					if(moduleService.deleteModuleExtItem(moduleExtVO) == 1) {
						rs = "complete";
					}
				}
			}
		}
		catch (NullPointerException e) {
			logger.error("DELETE ERROR-NullPointerException");
		}
		catch (RuntimeException e) {
			logger.error("DELETE ERROR-RuntimeException");
		}
		catch (Exception e) {
			logger.error("DELETE ERROR");
		}
		model.addAttribute("rs", rs);
		
		return "jsonView";
	}
	@RequestMapping(value = "/desk/developer/appList.do", method = RequestMethod.GET)
	public String manageAppList(HttpServletRequest request, Model model) {
		List<ProductVO> productList = new ArrayList<>();
		
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
			
			ProductVO productVO = new ProductVO();
			productVO.setMid(sessionVO.getSessMid());
			
			productList = productService.selectMyProductList(productVO);		
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			logger.error("[ERROR-PDC-003] - productMain SQLException");
		}
		
		model.addAttribute("product_list", productList);
		
		
		return "desk/product/list";
	}
	
	@RequestMapping(value="/desk/developer/productAdd.do", method=RequestMethod.GET)
	public String insertProduct(Model model, HttpServletRequest request){
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
			
			List<GroupVO> myGroupList1 = groupService.getMyGroupList(sessionVO.getSessMid());
			model.addAttribute("MY_GROUP_LIST",myGroupList1);
			
			List<ModuleVO> moduleList = moduleService.selectUserAvailableModuleList(sessionVO.getSessMid());
			model.addAttribute("moduleList", moduleList);
			
			List<GroupVO> myGroupList = groupService.selectMyExistGroupList(sessionVO.getSessMid());
			model.addAttribute("myGroupList",myGroupList);
			
		} catch (SQLException e) {
			logger.error("[ERROR-PDC-004] - insertProduct SQLException");
		}
		return "desk/product/add";
	}
	
	@RequestMapping(value="/desk/developer/addProduct.do", method=RequestMethod.POST)
	public String addProduct(Model model, @RequestParam HashMap<String,Object> productMap, 
			HttpServletRequest request,
			@RequestParam(value="thumb", required=false) MultipartFile thumb,
			@RequestParam(value="sc_1", required=false) MultipartFile sc_1,
			@RequestParam(value="sc_2", required=false) MultipartFile sc_2,
			@RequestParam(value="sc_3", required=false) MultipartFile sc_3,
			@RequestParam(value="sc_4", required=false) MultipartFile sc_4,
			@RequestParam(value="sc_5", required=false) MultipartFile sc_5,
			@RequestParam(value="sc_6", required=false) MultipartFile sc_6
		)  {
		
		String rs = "fail";
		HttpSession session = request.getSession(true);
		
		SessionVO sessionVO = new SessionVO();
		sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");
		
		String cid = "";
		
		if(!productMap.get("s_cate").equals("") && !productMap.get("s_cate").equals("null")) {
			cid = productMap.get("s_cate").toString();
		} else if((productMap.get("s_cate").equals("") || productMap.get("s_cate").equals("null"))
				&& (!productMap.get("m_cate").equals("") && !productMap.get("m_cate").equals("null"))) {
			cid = productMap.get("m_cate").toString();
		} else if((productMap.get("s_cate").equals("") || productMap.get("s_cate").equals("null"))
				&& (productMap.get("m_cate").equals("") || productMap.get("m_cate").equals("null"))
				&& (!productMap.get("l_cate").equals("") && !productMap.get("l_cate").equals("null"))) {
			cid = productMap.get("l_cate").toString();
		}

		ProductVO productVO = new ProductVO();
		productVO.setCid(Integer.parseInt(cid));
		productVO.setMid(sessionVO.getSessMid());
		productVO.setMdid(Integer.parseInt(productMap.get("mdid").toString()));
		productVO.setName(productMap.get("product_name").toString());
		productVO.setPrice(Integer.parseInt(productMap.get("product_price").toString()));
		productVO.setSort(Integer.parseInt(productMap.get("sort").toString()));
		
		String eng_name = productMap.get("product_eng_name").toString();
		String video_url = productMap.get("video_url").toString();
		String com_name = productMap.get("com_name").toString();
		String com_logo_url = productMap.get("com_logo_url").toString();
		String com_tel = productMap.get("com_tel").toString();
		String com_homepage = productMap.get("com_homepage").toString();
		String com_email = productMap.get("com_email").toString();
		
		if(!eng_name.equals("null")) {
			productVO.setEng_name(eng_name);
		}
		if(!video_url.equals("null")) {
			productVO.setVideo_url(video_url);
		}
		if(!com_name.equals("null")) {			
			productVO.setCom_name(com_name);
		}
		if(!com_logo_url.equals("null")) {
			productVO.setCom_logo_url(com_logo_url);
		}
		if(!com_tel.equals("null")) {
			productVO.setCom_tel(com_tel);
		}
		if(!com_homepage.equals("null")) {
			productVO.setCom_homepage(com_homepage);
		}
		if(!com_email.equals("null")) {
			productVO.setCom_email(com_email);
		}
		
		String commentHtml = StringEscapeUtils.escapeHtml(productMap.get("product_detail").toString());
		
		productVO.setComment(commentHtml);
		
		// product_detail_spec
		
		String commentEngHtml = StringEscapeUtils.escapeHtml(productMap.get("product_eng_detail").toString());
		
		String commentSpecHtml = StringEscapeUtils.escapeHtml(productMap.get("product_detail_spec").toString());
		
		
		if(!commentSpecHtml.equals("null")) {
			productVO.setComment_spec(commentSpecHtml);
		}
		
		if(!commentEngHtml.equals("null")) {
			productVO.setEng_comment(commentEngHtml);
		}
		
		productVO.setState(productMap.get("state").toString());
		String saveDirectory ="";
		MultipartFile sc_mf1 = sc_1;
		MultipartFile sc_mf2 = sc_2;
		MultipartFile sc_mf3 = sc_3;
		MultipartFile sc_mf4 = sc_4;
		MultipartFile sc_mf5 = sc_5;
		MultipartFile sc_mf6 = sc_6;

		try {
			
			productService.insertProduct(productVO);
			
			saveDirectory = PRODUCT_SERVER_PATH + productVO.getPid() + File.separator + "thumb" + File.separator;
			
			//fileService.createAndChmodDirectory(saveDirectory, "755");

			MultipartFile mf = thumb;

			if(mf != null) {
				HashMap<String, Object> map = multiFileUploadService.saveSingleFileToPath(mf, saveDirectory);
				productVO.setThumb("/productData/"+productVO.getPid()+"/thumb/"+map.get("SAVED_FILE_NAME"));
			}
			
			if(sc_mf1 != null) {
				HashMap<String, Object> map = multiFileUploadService.saveSingleFileToPath(sc_mf1, saveDirectory);
				
				productVO.setSc1_url("/productData/"+productVO.getPid()+"/thumb/"+map.get("SAVED_FILE_NAME"));
			} else {
				productVO.setSc1_url(null);
			}
			
			if(sc_mf2 != null) {
				HashMap<String, Object> map = multiFileUploadService.saveSingleFileToPath(sc_mf2, saveDirectory);
				
				productVO.setSc2_url("/productData/"+productVO.getPid()+"/thumb/"+map.get("SAVED_FILE_NAME"));
			} else {
				productVO.setSc2_url(null);
			}
			
			if(sc_mf3 != null) {
				HashMap<String, Object> map = multiFileUploadService.saveSingleFileToPath(sc_mf3, saveDirectory);
				
				productVO.setSc3_url("/productData/"+productVO.getPid()+"/thumb/"+map.get("SAVED_FILE_NAME"));
			} else {
				productVO.setSc3_url(null);
			}
			
			if(sc_mf4 != null) {
				HashMap<String, Object> map = multiFileUploadService.saveSingleFileToPath(sc_mf4, saveDirectory);
				
				productVO.setSc4_url("/productData/"+productVO.getPid()+"/thumb/"+map.get("SAVED_FILE_NAME"));
			} else {
				productVO.setSc4_url(null);
			}
			
			if(sc_mf5 != null) {
				HashMap<String, Object> map = multiFileUploadService.saveSingleFileToPath(sc_mf5, saveDirectory);
				
				productVO.setSc5_url("/productData/"+productVO.getPid()+"/thumb/"+map.get("SAVED_FILE_NAME"));
			} else {
				productVO.setSc5_url(null);
			}
			
			if(sc_mf6 != null) {
				HashMap<String, Object> map = multiFileUploadService.saveSingleFileToPath(sc_mf6, saveDirectory);
				
				productVO.setSc6_url("/productData/"+productVO.getPid()+"/thumb/"+map.get("SAVED_FILE_NAME"));
			} else {
				productVO.setSc6_url(null);
			}
			

			if(productService.updateProductItem(productVO) == 1) {
				model.addAttribute("pid", productVO.getPid());
				rs = "complete";
			}
			
		} catch (SQLException e1) {
			logger.error("[ERROR-PDC-001] - addProduct controller error");
			rs = "fail";
		}
		
		model.addAttribute("rs", rs);

		return "jsonView";
	}
	
	@RequestMapping(value="/desk/developer/productEdit.do", method=RequestMethod.GET)
	public String editProduct(Model model, HttpServletRequest request, @RequestParam("pid") String pid, @RequestParam(required = false,value ="edit") String edit){

		String rs = "fail";
		
		ProductVO productVO = new ProductVO();

		try {
			
			HttpSession session = request.getSession(true);
			SessionVO sessionVO = new SessionVO();
			sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");
			
			productVO.setPid(Integer.parseInt(pid));
			productVO = productService.selectProductItem(productVO);
			
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
			
			List<GroupVO> myGroupList1 = groupService.getMyGroupList(sessionVO.getSessMid());
			model.addAttribute("MY_GROUP_LIST",myGroupList1);
			
			CategoryVO categoryVO = new CategoryVO();
			categoryVO.setCid(productVO.getCid());
			CategoryVO rsCategoryVO = categoryService.getCategoryItem(categoryVO);
			
			String unescapeHtml = StringEscapeUtils.unescapeHtml(productVO.getComment());
			productVO.setComment(unescapeHtml);
			
			String unescapeSpecHtml = StringEscapeUtils.unescapeHtml(productVO.getComment_spec());
			productVO.setComment_spec(unescapeSpecHtml);
			
			model.addAttribute("productVO", productVO);
			
			model.addAttribute("categoryVO", rsCategoryVO);
			model.addAttribute("edit", edit);
			
			List<ModuleVO> moduleList = moduleService.selectUserAvailableModuleList(sessionVO.getSessMid());
			model.addAttribute("moduleList", moduleList);
			
			List<GroupVO> myGroupList = groupService.selectMyExistGroupList(sessionVO.getSessMid());
			model.addAttribute("myGroupList",myGroupList);
			
			rs = "complete";
			
		} catch (NumberFormatException e1) {
			rs = "fail";
			logger.error("[ERROR-PDC-002] - editProduct numberFormant check pid");
		} catch (SQLException e1) {
			rs = "fail";
			logger.error("[ERROR-PDC-002] - editProduct SQLException");
		}
		
		model.addAttribute("rs", rs);

		return "desk/product/edit";
	}
	
	
	@RequestMapping(value="/desk/developer/devApp.do", method=RequestMethod.GET)
	public String moduleDevelope(HttpServletRequest request, Model model){

		HttpSession session = request.getSession(true);

		SessionVO sessionVO = new SessionVO();
		sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");

		model.addAttribute("MID", sessionVO.getSessMid());
		model.addAttribute("ENMID", sessionVO.getSessEncryMid());
		model.addAttribute("MEM_ID", sessionVO.getSessMemId());
		model.addAttribute("MEM_LEVEL", sessionVO.getSessMemLevel());


		try {

			HashMap<String,String> map =  new HashMap<>();
			map.put("memId", sessionVO.getSessMemId());
			HashMap<String, Object> memberMap = memberService.memberLogin(map);
			model.addAttribute("MEM_DEVELOPER", memberMap.get("STATE").toString());
			List<BoardMasterVO> boardList;
			
			
			boardList = boardMasterService.selectBoardList();
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
		} catch (Exception e) {
			logger.error("SESSION ERROR");
		}

		return "desk/developer/devApp";
	}
	
	//분류
	@RequestMapping(value="/desk/developer/getCategoryList.do", method=RequestMethod.POST)
	public String getLargeCategoryList(HttpServletRequest request, Model model, @RequestParam("control") String control, @RequestParam(value="cid", required=false) String cid) {
		
		String rs = "fail";
		
		try {
			
			if(control.equals("getLargeCategory")) {
				List<CategoryVO> lCateList = categoryService.getLargeCategoryList();
				model.addAttribute("LARGE_CATEGORY", lCateList);
				rs = "complete";
			} else if(control.equals("getMiddleCategory")) {
				
				CategoryVO categoryVO = new CategoryVO();
				categoryVO.setCid(Integer.parseInt(cid));

				CategoryVO categoryItem = categoryService.getCategoryItem(categoryVO);
				String l_cate = categoryItem.getL_cate();
				
				CategoryVO middleCategoryVO = new CategoryVO();
				middleCategoryVO.setL_cate(l_cate);
				
				List<CategoryVO> mCateList = categoryService.getMiddleCategoryList(middleCategoryVO);
				
				model.addAttribute("MIDDLE_CATEGORY", mCateList);

				rs = "complete";
			} else if(control.contentEquals("getSmallCategory")) {
				
				CategoryVO categoryVO = new CategoryVO();
				categoryVO.setCid(Integer.parseInt(cid));
				
				CategoryVO categoryItem = categoryService.getCategoryItem(categoryVO);
				
				HashMap<String, Object> map = new HashMap<>();
				map.put("L_CATE", categoryItem.getL_cate());
				map.put("M_CATE", categoryItem.getM_cate());

				List<CategoryVO> sCateList = categoryService.getSmallCategoryList(map);
				
				model.addAttribute("SMALL_CATEGORY", sCateList);
				
				
				rs = "complete";
				
			}
			
		}
		catch (RuntimeException e) {
			rs = "fail";
			logger.error("SELECT ERROR-RuntimeException");
		}
		catch (Exception e) {
			rs = "fail";
			logger.error("SELECT ERROR");
		}
		
		model.addAttribute("rs", rs);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/desk/developer/fileCss.do", method=RequestMethod.POST)
	public String fileModuleCss(HttpServletRequest request,HttpServletResponse response, Model model, @RequestParam("mdid") String mdid) {

		FileInputStream fileInputStreamCss = null;
		try {
		
			ModuleVO moduleVO = new ModuleVO();
			moduleVO.setMdid(Integer.parseInt(mdid));
			moduleVO = moduleService.selectModuleItem(moduleVO);
			File rwCss = new File("/data/DT_DATA"+moduleVO.getCss_url());
			fileInputStreamCss = new FileInputStream(rwCss);
			OutputStream servletOutputStream = response.getOutputStream();
	 
	        byte bCss [] = new byte[1024];
	        int dataCss = 0;
	        
	        while((dataCss=(fileInputStreamCss.read(bCss, 0, bCss.length))) != -1){
	            servletOutputStream.write(bCss, 0, dataCss); 
	            
	        }
	      
	        servletOutputStream.flush();
	    
		
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			logger.error("Error-FileNotFoundException");
		} catch (IOException e) {
			// TODO Auto-generated catch block
			logger.error("Error-IOException");
		} finally {
			try {
				if(fileInputStreamCss != null) fileInputStreamCss.close();
			} catch (IOException e) {
				logger.error("SERVER ERROR-IOException");
			}
		}
		
		return "jsonView";
	}
	
	@RequestMapping(value="/desk/developer/fileJs.do", method=RequestMethod.POST)
	public String fileModuleJs(HttpServletRequest request,HttpServletResponse response, Model model, @RequestParam("mdid") String mdid) {

		FileInputStream fileInputStreamJs = null;
		try {
		
			ModuleVO moduleVO = new ModuleVO();
			moduleVO.setMdid(Integer.parseInt(mdid));
			moduleVO = moduleService.selectModuleItem(moduleVO);
			File rwJs = new File("/data/DT_DATA"+moduleVO.getJs_url());
			fileInputStreamJs = new FileInputStream(rwJs);
			OutputStream servletOutputStream = response.getOutputStream();
	 
	        byte bJs [] = new byte[1024];
	        int dataJs = 0;
	        
	        while((dataJs=(fileInputStreamJs.read(bJs, 0, bJs.length))) != -1){
	            servletOutputStream.write(bJs, 0, dataJs); 
	            
	        }
	      
	        servletOutputStream.flush();
		
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			logger.error("Error-FileNotFoundException");
		} catch (IOException e) {
			// TODO Auto-generated catch block
			logger.error("Error-IOException");
		} finally {
			try {
				if(fileInputStreamJs != null) fileInputStreamJs.close();
			} catch (IOException e) {
				logger.error("SERVER ERROR-IOException");
			}
		}
		
		return "jsonView";
	}
	
	@RequestMapping(value="/desk/developer/fileHtml.do", method=RequestMethod.POST)
	public String fileModuleHtml(HttpServletRequest request,HttpServletResponse response, Model model, @RequestParam("mdid") String mdid) {

		FileInputStream fileInputStreamHtml = null;
		try {
		
			ModuleVO moduleVO = new ModuleVO();
			moduleVO.setMdid(Integer.parseInt(mdid));
			moduleVO = moduleService.selectModuleItem(moduleVO);
			File rwHtml = new File("/data/DT_DATA"+moduleVO.getHtml_url());
			fileInputStreamHtml = new FileInputStream(rwHtml);
			OutputStream servletOutputStream = response.getOutputStream();
	 
	        byte bHtml [] = new byte[1024];
	        int dataHtml = 0;
	        
	        while((dataHtml=(fileInputStreamHtml.read(bHtml, 0, bHtml.length))) != -1){
	            servletOutputStream.write(bHtml, 0, dataHtml); 
	            
	        }
	      
	        servletOutputStream.flush();
	    
		
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			logger.error("Error-FileNotFoundException");
		} catch (IOException e) {
			// TODO Auto-generated catch block
			logger.error("Error-IOException");
		} finally {
			try {
				if(fileInputStreamHtml != null) fileInputStreamHtml.close();
			} catch (IOException e) {
				logger.error("SERVER ERROR-IOException");
			}
		}
		
		return "jsonView";
	}
	
	@RequestMapping(value="/desk/developer/fileLib.do", method=RequestMethod.POST)
	public String fileModuleLib(HttpServletRequest request,HttpServletResponse response, Model model,
			@RequestParam HashMap<String,Object> postMap,
			@RequestParam("mdid") String mdid) {

		FileInputStream fileInputStreamLib = null;
		try {
			ModuleVO moduleVO = new ModuleVO();
			moduleVO.setMdid(Integer.parseInt(mdid));
			moduleVO = moduleService.selectModuleItem(moduleVO);
			if(moduleVO.getIs_extjs().equals("Y")) {
				List<ModuleExtVO> moduleExtList = moduleService.selectModuleExtList(moduleVO);
				for(ModuleExtVO libfile : moduleExtList) {
					ModuleExtVO moduleExtVO = moduleService.selectModuleExtItem(libfile);
					
					File rwLib = new File("/data/DT_DATA/"+moduleExtVO.getFile_url());
					fileInputStreamLib = new FileInputStream(rwLib);
					OutputStream servletOutputStream = response.getOutputStream();
			 
			        byte bLib [] = new byte[1024];
			        int dataLib = 0;
			        
			        while((dataLib=(fileInputStreamLib.read(bLib, 0, bLib.length))) != -1){
			            servletOutputStream.write(bLib, 0, dataLib); 
			            
			        }
			      
			        servletOutputStream.flush();
				}
			}
			
	    
		
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			logger.error("Error-FileNotFoundException");
		} catch (IOException e) {
			// TODO Auto-generated catch block
			logger.error("Error-IOException");
		} finally {
			try {
				if(fileInputStreamLib != null) fileInputStreamLib.close();
			} catch (IOException e) {
				logger.error("SERVER ERROR-IOException");
			}
		}
		
		return "jsonView";
	}
	
	@RequestMapping(value="/desk/developer/getDevInfo.do", method=RequestMethod.POST)
	public String getDevInfo(HttpServletRequest request,HttpServletResponse response, Model model) {
		
		HttpSession session = request.getSession(true);

		SessionVO sessionVO = new SessionVO();
		sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");
		
		int mid = sessionVO.getSessMid();
		AppDeveloperVO appDeveloperVO = appDeveloperService.getDeveloperInfo(mid);
		model.addAttribute("developerInfo", appDeveloperVO);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/desk/developer/checkRequest.do", method=RequestMethod.POST)
	public String checkRequest(Model model, HttpServletRequest request
			, @RequestParam(value="pid") int pid, @RequestParam(value="type") String type) {
		
		String rs = "fail";
		HttpSession session = request.getSession();
		
		try {
			
			ProductVO productVO = new ProductVO();
			productVO.setPid(pid);
			productVO = productService.selectProductItem(productVO);
			productVO.setState(type);
			
			productService.updateProductItem(productVO);
			
			model.addAttribute("pid", productVO.getPid());
			
			rs = "complete";
			
		} catch (SQLException e) {
			rs = "fail";
			logger.error("[ERROR-PDC-006] - checkRequest SQLException");
		}
		
		model.addAttribute("rs", rs);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/desk/developer/updateProduct.do", method=RequestMethod.POST)
	public String updateProduct(Model model, HttpServletRequest request, @RequestParam HashMap<String,Object> productMap, 
			@RequestParam(value="thumb", required=false) MultipartFile thumb,
			@RequestParam(value="sc_1", required=false) MultipartFile sc_1,
			@RequestParam(value="sc_2", required=false) MultipartFile sc_2,
			@RequestParam(value="sc_3", required=false) MultipartFile sc_3,
			@RequestParam(value="sc_4", required=false) MultipartFile sc_4,
			@RequestParam(value="sc_5", required=false) MultipartFile sc_5,
			@RequestParam(value="sc_6", required=false) MultipartFile sc_6
		) {
		
		String rs = "fail";
		
		HttpSession session = request.getSession(true);
		MemberVO memVo = new MemberVO();
		
		try {
			
			String cid = "";

			if(!productMap.get("s_cate").equals("null")) {
				cid = productMap.get("s_cate").toString();
			} else if(productMap.get("s_cate").equals("null") && !productMap.get("m_cate").equals("null")) {
				cid = productMap.get("m_cate").toString();
			} else if(productMap.get("s_cate").equals("null") && productMap.get("m_cate").equals("null") && !productMap.get("l_cate").equals("null")) {
				cid = productMap.get("l_cate").toString();
			}
			
			ProductVO productVO = new ProductVO();
			productVO.setPid(Integer.parseInt(productMap.get("pid").toString()));
			productVO.setCid(Integer.parseInt(cid));
			productVO.setMdid(Integer.parseInt(productMap.get("mdid").toString()));
			productVO.setName(productMap.get("product_name").toString());
			productVO.setPrice(Integer.parseInt(productMap.get("product_price").toString()));
			productVO.setSort(Integer.parseInt(productMap.get("sort").toString()));
			productVO.setVideo_url(productMap.get("video_url").toString());

			
			String eng_name = productMap.get("product_eng_name").toString();
			String video_url = productMap.get("video_url").toString();
			String com_name = productMap.get("com_name").toString();
			String com_logo_url = productMap.get("com_logo_url").toString();
			String com_tel = productMap.get("com_tel").toString();
			String com_homepage = productMap.get("com_homepage").toString();
			String com_email = productMap.get("com_email").toString();
			
			if(!eng_name.equals("null")) {
				productVO.setEng_name(eng_name);
			}
			if(!video_url.equals("null")) {
				productVO.setVideo_url(video_url);
			}
			if(!com_name.equals("null")) {			
				productVO.setCom_name(com_name);
			}
			if(!com_logo_url.equals("null")) {
				productVO.setCom_logo_url(com_logo_url);
			}
			if(!com_tel.equals("null")) {
				productVO.setCom_tel(com_tel);
			}
			if(!com_homepage.equals("null")) {
				productVO.setCom_homepage(com_homepage);
			}
			if(!com_email.equals("null")) {
				productVO.setCom_email(com_email);
			}
			
			String commentHtml = StringEscapeUtils.escapeHtml(productMap.get("product_detail").toString());
			productVO.setComment(commentHtml);
			
			String commentEngHtml = StringEscapeUtils.escapeHtml(productMap.get("product_eng_detail").toString());
			// product_detail_spec
			String commentSpecHtml = StringEscapeUtils.escapeHtml(productMap.get("product_detail_spec").toString());
			
			if(!commentSpecHtml.equals("null")) {
				productVO.setComment_spec(commentSpecHtml);
			}
			if(!commentEngHtml.equals("null")) {
				productVO.setEng_comment(commentSpecHtml);
			}
			
			productVO.setState(productMap.get("state").toString());
			
			String saveDirectory = PRODUCT_SERVER_PATH + productVO.getPid() + File.separator + "thumb" + File.separator;
			
			//fileService.createAndChmodDirectory(saveDirectory, "755");
			
			logger.info("saveDir:"+saveDirectory);

			MultipartFile mf = thumb;
			
			if(mf != null) {
				HashMap<String, Object> map = multiFileUploadService.saveSingleFileToPath(mf, saveDirectory);
				
				logger.info("CID:/userData/thumb/"+map.get("SAVED_FILE_NAME"));
				
				productVO.setThumb("/productData/"+productVO.getPid()+"/thumb/"+map.get("SAVED_FILE_NAME"));
			} else {
				productVO.setThumb(null);
			}
			
			MultipartFile sc_mf1 = sc_1;
			MultipartFile sc_mf2 = sc_2;
			MultipartFile sc_mf3 = sc_3;
			MultipartFile sc_mf4 = sc_4;
			MultipartFile sc_mf5 = sc_5;
			MultipartFile sc_mf6 = sc_6;
			
			if(sc_mf1 != null) {
				HashMap<String, Object> map = multiFileUploadService.saveSingleFileToPath(sc_mf1, saveDirectory);
				
				logger.info("CID:/userData/thumb/"+map.get("SAVED_FILE_NAME"));
				
				productVO.setSc1_url("/productData/"+productVO.getPid()+"/thumb/"+map.get("SAVED_FILE_NAME"));
			} else {
				productVO.setSc1_url(null);
			}
			
			if(sc_mf2 != null) {
				HashMap<String, Object> map = multiFileUploadService.saveSingleFileToPath(sc_mf2, saveDirectory);
				
				logger.info("CID:/userData/thumb/"+map.get("SAVED_FILE_NAME"));
				
				productVO.setSc2_url("/productData/"+productVO.getPid()+"/thumb/"+map.get("SAVED_FILE_NAME"));
			} else {
				productVO.setSc2_url(null);
			}
			
			if(sc_mf3 != null) {
				HashMap<String, Object> map = multiFileUploadService.saveSingleFileToPath(sc_mf3, saveDirectory);
				
				logger.info("CID:/userData/thumb/"+map.get("SAVED_FILE_NAME"));
				
				productVO.setSc3_url("/productData/"+productVO.getPid()+"/thumb/"+map.get("SAVED_FILE_NAME"));
			} else {
				productVO.setSc3_url(null);
			}
			
			if(sc_mf4 != null) {
				HashMap<String, Object> map = multiFileUploadService.saveSingleFileToPath(sc_mf4, saveDirectory);
				
				logger.info("CID:/userData/thumb/"+map.get("SAVED_FILE_NAME"));
				
				productVO.setSc4_url("/productData/"+productVO.getPid()+"/thumb/"+map.get("SAVED_FILE_NAME"));
			} else {
				productVO.setSc4_url(null);
			}
			
			if(sc_mf5 != null) {
				HashMap<String, Object> map = multiFileUploadService.saveSingleFileToPath(sc_mf5, saveDirectory);
				
				logger.info("CID:/userData/thumb/"+map.get("SAVED_FILE_NAME"));
				
				productVO.setSc5_url("/productData/"+productVO.getPid()+"/thumb/"+map.get("SAVED_FILE_NAME"));
			} else {
				productVO.setSc5_url(null);
			}
			
			if(sc_mf6 != null) {
				HashMap<String, Object> map = multiFileUploadService.saveSingleFileToPath(sc_mf6, saveDirectory);
				
				logger.info("CID:/userData/thumb/"+map.get("SAVED_FILE_NAME"));
				
				productVO.setSc6_url("/productData/"+productVO.getPid()+"/thumb/"+map.get("SAVED_FILE_NAME"));
			} else {
				productVO.setSc6_url(null);
			}
			
			productService.updateProductItem(productVO);
			
			//printMap(productMap);
			
			model.addAttribute("pid", productVO.getPid());
			
			rs = "complete";
			
		} catch (SQLException e) {
			rs = "fail";
			logger.error("[ERROR-PDC-005] - updateProduct SQLException");
		} catch (RuntimeException e) {
			rs = "fail";
			logger.error("[ERROR-PDC-005] - updateProduct RuntimeException");
		}
	
		model.addAttribute("rs", rs);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/desk/developer/deleteProduct.do", method=RequestMethod.POST)
	public String deleteProduct(Model model, HttpServletRequest request, @RequestParam(value="control", required=true) String control, @RequestParam(value="pid", required=true) String pid) {
	
		String rs = "fail";
		
		try {
			if(control.equals("deleteProductItem")) {
				ProductVO productVO = new ProductVO();
				productVO.setPid(Integer.parseInt(pid));
				productVO = productService.selectProductItem(productVO);
				
				String sc1_url = productVO.getSc1_url();
				String sc2_url = productVO.getSc2_url();
				String sc3_url = productVO.getSc3_url();
				String sc4_url = productVO.getSc4_url();
				String sc5_url = productVO.getSc5_url();
				String sc6_url = productVO.getSc6_url();
				String thumb = productVO.getThumb();
				
				if(sc1_url != null) {
					sc1_url = sc1_url.replaceAll("\\.", "").replaceAll("\\\\", "");
					logger.info("f:"+PRODUCT_SERVER_PATH + sc1_url);
					multiFileUploadService.deleteFile(PRODUCT_SERVER_PATH + sc1_url);
				}
				if(sc2_url != null) {
					sc2_url = sc2_url.replaceAll("\\.", "").replaceAll("\\\\", "");
					logger.info("f:"+PRODUCT_SERVER_PATH + sc2_url);
					multiFileUploadService.deleteFile(PRODUCT_SERVER_PATH + sc2_url);
				}
				if(sc3_url != null) {
					sc3_url = sc3_url.replaceAll("\\.", "").replaceAll("\\\\", "");
					logger.info("f:"+PRODUCT_SERVER_PATH + sc3_url);
					multiFileUploadService.deleteFile(PRODUCT_SERVER_PATH + sc3_url);
				}
				if(sc4_url != null) {
					sc4_url = sc4_url.replaceAll("\\.", "").replaceAll("\\\\", "");
					logger.info("f:"+PRODUCT_SERVER_PATH + sc4_url);
					multiFileUploadService.deleteFile(PRODUCT_SERVER_PATH + sc4_url);
				}
				if(sc5_url != null) {
					sc5_url = sc5_url.replaceAll("\\.", "").replaceAll("\\\\", "");
					logger.info("f:"+PRODUCT_SERVER_PATH + sc5_url);
					multiFileUploadService.deleteFile(PRODUCT_SERVER_PATH + sc5_url);
				}
				if(sc6_url != null) {
					sc6_url = sc6_url.replaceAll("\\.", "").replaceAll("\\\\", "");
					logger.info("f:"+PRODUCT_SERVER_PATH + sc6_url);
					multiFileUploadService.deleteFile(PRODUCT_SERVER_PATH + sc6_url);
				}
				if(thumb != null) {
					thumb = thumb.replaceAll("\\.", "").replaceAll("\\\\", "");
					logger.info("f:"+PRODUCT_SERVER_PATH + thumb);
					multiFileUploadService.deleteFile(PRODUCT_SERVER_PATH + thumb);
				}
				int flag = productService.deleteProductItem(productVO);
				if(flag > 0) {
					rs = "complete";
				}
			}

		} catch (SQLException e) {
			rs = "fail";
			logger.error("[ERROR-PDC-004] - deleteProduct SQLException");
		}
		
		model.addAttribute("rs", rs);
		
		return "jsonView";
	}
	
	@RequestMapping(value = "/desk/developer/getModuleInfo.do", method = RequestMethod.POST)
	public String moduleList(HttpServletRequest request, Model model, @RequestParam("mdid") String mdid) {
		try {
			ModuleVO moduleVO = new ModuleVO();
			moduleVO.setMdid(Integer.parseInt(mdid));
			
			moduleVO = moduleService.selectModuleItem(moduleVO);
			model.addAttribute("moduleInfo", moduleVO);

			CategoryVO categoryVO = new CategoryVO();
			categoryVO.setCid(moduleVO.getCid());

			HashMap<String,Object> moduleCategoryInfo = categoryService.getCategoryCid(categoryVO);
			
			model.addAttribute("categoryInfo", moduleCategoryInfo);		
			
			
		} catch (RuntimeException e) {
			logger.error("SESSION ERROR-RuntimeException");
		} catch (Exception e) {
			logger.error("SESSION ERROR");
		}

		return "jsonView";
	}
	
}