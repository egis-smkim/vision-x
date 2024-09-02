package com.vision_x.vision_x.desk.board.web;

import java.io.ByteArrayOutputStream;
import java.io.DataInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.Inet4Address;
import java.net.URLEncoder;
import java.net.UnknownHostException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.annotation.Resource;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.servlet.http.HttpServletResponse;

import org.apache.commons.compress.utils.FileNameUtils;
import org.apache.commons.io.FilenameUtils;
import org.json.simple.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.multipart.MultipartRequest;

import com.vision_x.vision_x.admin.service.BoardMasterService;
import com.vision_x.vision_x.admin.service.BoardMasterVO;
import com.vision_x.vision_x.desk.alert.service.AlertService;
import com.vision_x.vision_x.desk.board.service.BoardContentService;
import com.vision_x.vision_x.desk.board.service.BoardContentVO;
import com.vision_x.vision_x.desk.board.service.BoardFileService;
import com.vision_x.vision_x.desk.board.service.BoardFileVO;
import com.vision_x.vision_x.desk.board.service.CommentService;
import com.vision_x.vision_x.desk.board.service.CommentVO;
import com.vision_x.vision_x.desk.service.GroupService;
import com.vision_x.vision_x.desk.service.GroupVO;
import com.vision_x.vision_x.desk.web.DeskController;
import com.vision_x.vision_x.file.service.MultiFileUploadService;
import com.vision_x.vision_x.mail.service.MailerVO;
import com.vision_x.vision_x.mail.service.MailingService;
import com.vision_x.vision_x.mail.service.RecipientForRequest;
import com.vision_x.vision_x.member.service.MemberService;
import com.vision_x.vision_x.member.service.MemberVO;
import com.vision_x.vision_x.storage.service.UserStorageService;
import com.vision_x.vision_x.storage.service.UserStorageVO;
import com.vision_x.vision_x.utils.SessionVO;

@Controller
public class BoardContentController {
	protected Logger logger = LoggerFactory.getLogger(this.getClass());
	
	@Value("#{globalInfo['Globals.outbound.accesskey']}")
	private String MAIL_API_ACCESSKEY;
	
	@Value("#{globalInfo['Globals.outbound.secretkey']}")
	private String MAIL_API_SECRETKEY;
	
	@Value("#{globalInfo['Globals.outbound.authkey']}")
	private String MAIL_API_AUTHKEY;
	
	@Value("#{globalInfo['Globals.outbound.sendURL']}")
	private String MAIL_API_SENDURL;
	
	@Resource(name = "memberService")
	private MemberService memberService;
	
	@Resource(name="boardMasterService")
	private BoardMasterService boardMasterService;
	
	@Resource(name="multiFileUploadService")
	private MultiFileUploadService multiFileUploadService;
	
	@Resource(name="boardFileService")
	private BoardFileService boardFileService;
	
	@Resource(name = "mailingService")
	private MailingService mailingService;
	
	@Resource(name="alertService")
	private AlertService alertService;
	
	@Resource(name="groupService")
	private GroupService groupService;
	
	@Resource(name="userStorageService")
	private UserStorageService userStorageService;
	
	@Autowired
	private BoardContentService boardContentService;
	
	@Autowired
	private CommentService commentService;
    
	private String HOST_IP = "";
	
	public BoardContentController() {
	
		try {
			HOST_IP =Inet4Address.getLocalHost().getHostName();
		}
		
		catch ( UnknownHostException e ) {
			logger.info("unknowhost exception");
		}
	}
    // 게시글 목록
    @RequestMapping(value="/desk/board/list.do", method=RequestMethod.GET)
	public String board(HttpServletRequest request, Model model, @RequestParam(value="slug") String slug) throws SQLException{
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

		
		try {
			//게시판 정보
			BoardMasterVO boardMasterVO = boardMasterService.selectBoardItem(slug);
			model.addAttribute("boardMasterVO", boardMasterVO);
			
			BoardContentVO boardContentVO = new BoardContentVO();
			boardContentVO.setBmid(boardMasterVO.getBmid());
			boardContentVO.setMemid(sessionVO.getSessMemId());
			
			List<BoardContentVO> list = boardContentService.listAll(boardContentVO);
			model.addAttribute("boardContentList", list);


		} catch (RuntimeException e) {
			logger.error("SESSION ERROR-RuntimeException");
		} catch (Exception e) {
			logger.error("SESSION ERROR");
		}

		return "desk/board/list";
	}
    

    // 게시글 작성화면
    @RequestMapping(value="/desk/board/add.do", method=RequestMethod.GET)
	public String write(HttpServletRequest request, Model model, @RequestParam(value="slug") String slug) {
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

			
			//게시판 정보
			BoardMasterVO boardMasterVO = boardMasterService.selectBoardItem(slug);
			model.addAttribute("boardMasterVO", boardMasterVO);
			
			if(slug.equals("news") && Integer.parseInt(memberMap.get("MEM_LEVEL").toString()) != 10) {
				return "error/error";
			}

		} catch (RuntimeException e) {
			logger.error("SESSION ERROR-RuntimeException");
		} catch (Exception e) {
			logger.error("SESSION ERROR");
		}

		return "desk/board/add";
	}
    
      
    @RequestMapping(value="/desk/board/addBoard.do", method=RequestMethod.POST)
    public String addBoard(Model model, HttpServletRequest request, @RequestParam("boardFiles") List<MultipartFile> files, @RequestParam HashMap<String, String> map) {
    	String rs = "fail";

    	
		HttpSession session = request.getSession(true);

		SessionVO sessionVO = new SessionVO();
		sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");

		try {	
			//게시판 정보
			BoardMasterVO boardMasterVO = boardMasterService.selectBoardItem(map.get("slug"));
			model.addAttribute("boardMasterVO", boardMasterVO);
			
			String title = map.get("boardTitle").toString();
			title = DeskController.XSSFilter(title);
			BoardContentVO boardContentVO = new BoardContentVO();
			boardContentVO.setMemid(sessionVO.getSessMemId());
			boardContentVO.setBmid(boardMasterVO.getBmid());
			boardContentVO.setTitle(title);
			boardContentVO.setContent(map.get("boardContent").toString());
			boardContentVO.setIs_file(Integer.parseInt(map.get("isFile").toString()));
			
			if(map.containsKey("brackets")) {
				boardContentVO.setBrackets(map.get("brackets").toString());
			}
			
			boardContentService.insertBoard(boardContentVO);
			
			//파일 시작 
			
			//String saveDirectory = FILE_DIR+File.separator+"siteData"+File.separator+"defaultModels"+File.separator;
			
			String saveDirectory = "";
			
			UserStorageVO userStorage = userStorageService.getUserStorageInfo(HOST_IP);
			String FILE_DIR = userStorage.getMount_directory();
			String targetDirUrl = userStorage.getDir_url();
			
			saveDirectory = FILE_DIR+sessionVO.getSessMemId()+File.separator+"USER_DATA"+File.separator;
			if(saveDirectory != null) saveDirectory = saveDirectory.replaceAll("\\\\", "").replaceAll("&", "");

			File fileDirectory = new File(saveDirectory);
	
			if(!fileDirectory.isDirectory()) {
				fileDirectory.setExecutable(false); //실행권한
				fileDirectory.setReadable(true);   //읽기권한
				fileDirectory.setWritable(true);   //쓰기권한
				fileDirectory.mkdirs();
			}
			

			for(MultipartFile mf : files) {

				Date now = new Date();
				long ut3 = now.getTime() / 1000L;
				
				String orgFileName = mf.getOriginalFilename();
				
				String fileBaseName = FilenameUtils.getBaseName(orgFileName);
				
				String fileExtention = FilenameUtils.getExtension(orgFileName);

				multiFileUploadService.saveFileToUserDirectory(mf, String.valueOf(ut3), saveDirectory);
				
				String saveModelFileName = "";
				if(fileBaseName != null && fileExtention != null) saveModelFileName = multiFileUploadService.replaceSpecialCharacter(fileBaseName)+"_"+String.valueOf(ut3)+"."+fileExtention.toUpperCase();
				String saveModelFileUrl = targetDirUrl+sessionVO.getSessMemId()+"/USER_DATA/"+saveModelFileName;
				
				BoardFileVO boardFileVO = new BoardFileVO();
				boardFileVO.setMemid(sessionVO.getSessMemId());
				boardFileVO.setBid(boardContentVO.getBid());
				boardFileVO.setFile_type(fileExtention);
				boardFileVO.setOrg_file_name(orgFileName);
				boardFileVO.setSave_file_name(saveModelFileName);
				boardFileVO.setSave_file_path(saveDirectory+saveModelFileName);
				boardFileVO.setSave_file_url(saveModelFileUrl);

				boardFileService.insertBoardFile(boardFileVO);

			}
			
			//파일 끝		
			rs = "complete";
			
		} catch (SQLException e1) {
			logger.error("[ERROR-PDC-001] - addBoard controller error");
		} catch (RuntimeException e) {
			logger.error("SESSION ERROR-RuntimeException");
		} catch (Exception e) {
			logger.error("SESSION ERROR");
		}
		
	
    	model.addAttribute("rs", rs);
    	
        return "jsonView";
    }
    
    
    // 게시글 상세내용 조회, 게시글 조회수 증가 처리, 댓글 처리
    // @RequestParam : get/post방식으로 전달된 변수 1개
    @RequestMapping(value="/desk/board/view.do", method=RequestMethod.GET)
	public String viewBoard(HttpServletRequest request,@RequestParam(value="bid") int bid, HttpServletResponse response, Model model) {
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

			
			//조회수 중복 방지 구현 (쿠키)
			Cookie oldCookie = null;
		    Cookie[] cookies = request.getCookies();
		    String str = "[" + bid + sessionVO.getSessMemId() + "]";
		    str = str.replaceAll("\r", "").replaceAll("\n", "");

		    if (cookies != null) {
		        for (Cookie cookie : cookies) {
		            if (cookie.getName().equals("postView")) {
		                oldCookie = cookie;
		            }
		        }
		    }

		    if (oldCookie != null) {
		    	 if (!oldCookie.getValue().contains(str)) {
		        	boardContentService.increaseViewCnt(bid);
		        	oldCookie.setValue(oldCookie.getValue() + "_" + str);
		            oldCookie.setPath("/");
		            oldCookie.setMaxAge(60 * 60 * 1);
		            response.addCookie(oldCookie);
		        }
		    } else {
		    	boardContentService.increaseViewCnt(bid);		
		    	Cookie newCookie = new Cookie("postView",str);
		        newCookie.setPath("/");
		        newCookie.setMaxAge(60 * 60 * 1);
		        newCookie.setSecure(true);
		        response.addCookie(newCookie);
		    }
			
			BoardContentVO boardContentVO = boardContentService.viewBoard(bid);
			model.addAttribute("boardContentVO", boardContentVO);
			
			//게시판 정보
			BoardMasterVO boardMasterVO = boardMasterService.selectBoardItemId(boardContentVO.getBmid());
			model.addAttribute("boardMasterVO", boardMasterVO);
			
			// 댓글 목록
			List<CommentVO> colist = commentService.listComment(bid);
			model.addAttribute("commentList", colist);
			
			//댓글 수 업데이트
			boardContentService.countComment(bid);
			
			//파일 목록
			List<BoardFileVO> filelist = boardFileService.viewBoardFile(bid);	
			model.addAttribute("boardFileList", filelist);	
			
			//이전글, 다음글
			model.addAttribute("move", boardContentService.movePage(boardContentVO));

			
		} catch (RuntimeException e) {
			logger.error("SESSION ERROR-RuntimeException");
		} catch (Exception e) {
			logger.error("SESSION ERROR");
		}
		
		return "desk/board/view";
	}
    
    // 게시글 수정
    @RequestMapping(value="/desk/board/edit.do", method=RequestMethod.GET)
    public String edit(HttpServletRequest request, Model model, @RequestParam(value="bid") int bid) {
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
	
	
			BoardContentVO boardContentVO = boardContentService.viewBoard(bid);
			model.addAttribute("boardContentVO", boardContentVO);
			
			//기존 파일 
			List<BoardFileVO> filelist = boardFileService.viewBoardFile(bid);	
			
			for(BoardFileVO OldBoardFileVO : filelist) { 
				 	
				 	String path = OldBoardFileVO.getSave_file_path(); 
				 	File file = new File(path);
	
		        }
				 	
			//파일 목록
			model.addAttribute("boardFileList", filelist);	
			
			//게시판 정보
			BoardMasterVO boardMasterVO = boardMasterService.selectBoardItemId(boardContentVO.getBmid());
			model.addAttribute("boardMasterVO", boardMasterVO);
		
	    } catch (RuntimeException e) {
			logger.error("SESSION ERROR-RuntimeException");
		} catch (Exception e) {
			logger.error("SESSION ERROR");
		}
	
		
		return "desk/board/edit";
	}	
    
    @RequestMapping(value="/desk/board/updateBoard.do", method=RequestMethod.POST)
    public String updateBoard(HttpServletRequest request, Model model,@RequestParam("fids") List<Integer> fids, @RequestParam("boardFiles") List<MultipartFile> files, @RequestParam HashMap<String, String> map) throws SQLException{
    	
    	String rs = "fail";
    	
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

		
		BoardContentVO boardContentVO = new BoardContentVO();
		boardContentVO.setBid(Integer.parseInt(map.get("bid").toString()));

		String title = map.get("boardTitle").toString();
		title = DeskController.XSSFilter(title);
		boardContentVO.setTitle(title);
		boardContentVO.setContent(map.get("boardContent").toString());
		boardContentVO.setIs_file(Integer.parseInt(map.get("isFile").toString()));
		
		if(map.containsKey("brackets")) {
			boardContentVO.setBrackets(map.get("brackets").toString());
		} else {
			boardContentVO.setBrackets(null);
		}
		
    	try {
    		
    		//기존 파일 삭제 
    		
	    	for(Integer fid : fids) { 
	    		
	    		if (fid == 0) {
	    			break;
	    		}
   			 	BoardFileVO OldBoardFileVO = boardFileService.boardFileInfo(fid);

   			 	
   			 	String path = OldBoardFileVO.getSave_file_path(); 

   			 	File file = new File(path);

   			 	if(file.isFile()) {
		            file.delete();
		        }
   			 	boardFileService.deleteFile(OldBoardFileVO); 
   			 
	    	}

    			
    		//파일 시작 
			
    		
			//String saveDirectory = FILE_DIR+File.separator+"siteData"+File.separator+"defaultModels"+File.separator;
			
    		String saveDirectory = "";
    		
    		UserStorageVO userStorage = userStorageService.getUserStorageInfo(HOST_IP);
			String FILE_DIR = userStorage.getMount_directory();
			String targetDirUrl = userStorage.getDir_url();
			
    		saveDirectory = FILE_DIR+sessionVO.getSessMemId()+File.separator+"USER_DATA"+File.separator;
    		if(saveDirectory != null) saveDirectory = saveDirectory.replaceAll("\\\\", "").replaceAll("&", "");
			File fileDirectory = new File(saveDirectory);
	
			if(!fileDirectory.isDirectory()) {
				fileDirectory.setExecutable(false); //실행권한
				fileDirectory.setReadable(true);   //읽기권한
				fileDirectory.setWritable(true);   //쓰기권한
				fileDirectory.mkdirs();
			}
			
			for(MultipartFile mf : files) {
				Date now = new Date();
				long ut3 = now.getTime() / 1000L;
				
				String orgFileName = mf.getOriginalFilename();
				
				String fileBaseName = FilenameUtils.getBaseName(orgFileName);
				
				String fileExtention = FilenameUtils.getExtension(orgFileName);
				
				multiFileUploadService.saveFileToUserDirectory(mf, String.valueOf(ut3), saveDirectory);

				String saveModelFileName = "";
				if(fileBaseName != null && fileExtention != null) saveModelFileName = multiFileUploadService.replaceSpecialCharacter(fileBaseName)+"_"+String.valueOf(ut3)+"."+fileExtention.toUpperCase();
				String saveModelFileUrl = targetDirUrl+sessionVO.getSessMemId()+"/USER_DATA/"+saveModelFileName;
				
				BoardFileVO boardFileVO = new BoardFileVO();
				boardFileVO.setMemid(sessionVO.getSessMemId());
				boardFileVO.setBid(Integer.parseInt(map.get("bid").toString()));
				boardFileVO.setFile_type(fileExtention);
				boardFileVO.setOrg_file_name(orgFileName);
				boardFileVO.setSave_file_name(saveModelFileName);
				boardFileVO.setSave_file_path(saveDirectory+saveModelFileName);
				boardFileVO.setSave_file_url(saveModelFileUrl);


				boardFileService.insertBoardFile(boardFileVO);
			

			}
			//파일 끝
			boardContentService.updateBoard(boardContentVO);
			
			rs = "complete";
			
		} catch (SQLException e1) {
			logger.error("[ERROR-PDC-001] - addBoard controller error");
		} catch (RuntimeException e) {
			logger.error("SESSION ERROR-RuntimeException");
		} catch (Exception e) {
			logger.error("SESSION ERROR");
		}
		
    	
    	model.addAttribute("rs", rs);
    	
		return "jsonView";
	}	
    
    // 게시글 삭제
    @RequestMapping(value="/desk/board/deleteBoard.do", method=RequestMethod.POST)
    public String deleteBoard(HttpServletRequest request, Model model,  @RequestParam(value="bid", required=true) int bid) {
    	
    	String rs = "fail";
    	
    	HttpSession session = request.getSession(true);

		SessionVO sessionVO = new SessionVO();
		sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");
		
		BoardContentVO boardContentVO = new BoardContentVO();
		boardContentVO.setBid(bid);
		
		BoardFileVO boardFileVO = new BoardFileVO();
		boardFileVO.setBid(bid);

     	try {
     		
			
			List<BoardFileVO> filelist = boardFileService.viewBoardFile(bid);
			
			for(BoardFileVO file:filelist) {
				String path = file.getSave_file_path(); 
				
				File files = new File(path);

				if(files.isFile()) {
		            files.delete();
		        }
			}
			
			commentService.deleteAllComment(bid);
			boardFileService.deleteBoardFile(boardFileVO);
			boardContentService.deleteBoard(boardContentVO);
			rs = "complete";
			
		} catch (SQLException e1) {
			logger.error("[ERROR-PDC-001] - addBoard controller error");
		} catch (RuntimeException e) {
			logger.error("SESSION ERROR-RuntimeException");
		} catch (Exception e) {
			logger.error("SESSION ERROR");
		}
     	
     	model.addAttribute("rs", rs);
     	
        return "jsonView";
    }
    
    //댓글 리스트 출력   
    @RequestMapping(value = "/desk/board/getCommentList.do", method = RequestMethod.POST)
    public String getCommentList(HttpServletRequest request,@RequestParam(value="bid") int bid,@RequestParam(value="cmt_level") int cmt_level, Model model) {
		
		HttpSession session = request.getSession(true);

		SessionVO sessionVO = new SessionVO();
		sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");
		
		model.addAttribute("MEM_ID", sessionVO.getSessMemId());
		model.addAttribute("MEM_LEVEL", sessionVO.getSessMemLevel());
		
		model.addAttribute("CMT_LEVEL", cmt_level);
		
		try {
			List<CommentVO> colist = commentService.listComment(bid);
			model.addAttribute("commentList", colist);
			
			//댓글 수 업데이트
			boardContentService.countComment(bid);
			
			model.addAttribute("cntComment", commentService.countComment(bid));
		
	    } catch (SQLException e1) {
			logger.error("[ERROR-PDC-001] - addBoard controller error");
		} catch (RuntimeException e) {
			logger.error("SESSION ERROR-RuntimeException");
		} catch (Exception e) {
			logger.error("SESSION ERROR");
		}
			
		
		return "jsonView";
    }

    
    //댓글 작성
  	@RequestMapping(value="/desk/board/addComment.do", method = RequestMethod.POST)
    public String addComment(Model model, HttpServletRequest request, @RequestParam HashMap<String, String> map) {
    	String rs = "fail";
    			
    	HttpSession session = request.getSession(true);

		SessionVO sessionVO = new SessionVO();
		sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");
		
		CommentVO commentVO = new CommentVO();
		commentVO.setBmid(Integer.parseInt(map.get("bmid").toString()));
		commentVO.setBid(Integer.parseInt(map.get("bid").toString()));
		commentVO.setMemid(sessionVO.getSessMemId());
		String content = map.get("commentContent").toString();
		commentVO.setContent(content);
		
		int cmt_alert = Integer.parseInt(map.get("cmt_alert").toString());
		
		//Outbound - mailer
		final String accesskey = MAIL_API_ACCESSKEY;
		final String secretkey = MAIL_API_SECRETKEY;
		final String apiURL = MAIL_API_SENDURL;
		
		try {
			commentService.insertComment(commentVO);
			
			if(cmt_alert == 1) {
				BoardContentVO boardContentVO = boardContentService.viewBoard(Integer.parseInt(map.get("bid").toString()));
				MemberVO memberVO = new MemberVO();
				memberVO.setMem_id(boardContentVO.getMemid());
				
				memberVO = memberService.getMemberInfoMemId(memberVO);
				
				if (memberVO != null && memberVO.getMem_email() != null && !(memberVO.getMem_email().equals("")) && !(boardContentVO.getMemid().equals(sessionVO.getSessMemId()))) {
					MailerVO mailerVO = new MailerVO();
					mailerVO.setTemplateSid(262);
					RecipientForRequest recipient = new RecipientForRequest();
					recipient.setAddress(memberVO.getMem_email());
					recipient.setName(memberVO.getMem_name());
					recipient.setType("R");
					
					JSONObject jso = new JSONObject();
					jso.put("title",boardContentVO.getTitle());
					jso.put("memInfo",sessionVO.getSessMemId());
					jso.put("comment",content);
					CommentVO vo = commentService.selectComment(commentVO.getCid());
					jso.put("commentTime",vo.getReg_date().toString());

					// 이메일 인증 테스트용
					recipient.setParameters(jso);
					// System.out.println(jso.toJSONString());
					// 메일 전송 객체 내부의 수신자 객체리스트 ->여러명일 경우 리스트에 ADD
					List<RecipientForRequest> recipients = new ArrayList<RecipientForRequest>();
					recipients.add(recipient);
					
					mailerVO.setRecipients(recipients);
					mailerVO.setParameters(null);
					mailerVO.setIndividual(true);
					mailerVO.setAdvertising(false);
					try { // 메일 전송시 mailerVO객체를 넘겨준다.
						mailingService.mailSender(mailerVO, accesskey, secretkey, apiURL);
					} catch (InvalidKeyException | NoSuchAlgorithmException | IllegalStateException
							| UnsupportedEncodingException e) {
						logger.error("MailSending Error-An Error Occured while Excuting mailing service.");
					}
				
				}
			}
			
			rs = "complete";
		} catch (SQLException e1) {
			logger.error("[ERROR-PDC-001] - addBoard controller error");
		} catch (RuntimeException e) {
			logger.error("SESSION ERROR-RuntimeException");
		} catch (Exception e) {
			logger.error("SESSION ERROR");
		}
		
	
    	model.addAttribute("rs", rs);
    	
        return "jsonView";
    }
  	
  	
  	//댓글 수정
  	@RequestMapping(value="/desk/board/updateComment.do", method=RequestMethod.POST)
    public String updateComment(HttpServletRequest request, Model model, @RequestParam HashMap<String, String> map){
    	
    	String rs = "fail";
    	
    	HttpSession session = request.getSession(true);

		SessionVO sessionVO = new SessionVO();
		sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");

		model.addAttribute("MEM_ID", sessionVO.getSessMemId());
    	
		CommentVO commentVO = new CommentVO();
		commentVO.setCid(Integer.parseInt(map.get("cid").toString()));
		String content = map.get("editContent").toString();
		commentVO.setContent(content);

		
    	try {
    		commentService.updateComment(commentVO);
			rs = "complete";
			
		} catch (SQLException e1) {
			logger.error("[ERROR-PDC-001] - addBoard controller error");
		} catch (RuntimeException e) {
			logger.error("SESSION ERROR-RuntimeException");
		} catch (Exception e) {
			logger.error("SESSION ERROR");
		}
		
    	
    	model.addAttribute("rs", rs);
    	
		return "jsonView";
	}
  	
  	// 댓글 삭제
    @RequestMapping(value="/desk/board/deleteComment.do", method=RequestMethod.POST)
    public String deleteComment(HttpServletRequest request, Model model,  @RequestParam(value="cid", required=true) int cid) {
    	
    	String rs = "fail";
    	
    	HttpSession session = request.getSession(true);

		SessionVO sessionVO = new SessionVO();
		sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");
		
		CommentVO commentVO = new CommentVO();
		commentVO.setCid(cid);

     	try {
			commentService.deleteComment(commentVO);
			rs = "complete";
			
		} catch (SQLException e1) {
			logger.error("[ERROR-PDC-001] - addBoard controller error");
		} catch (RuntimeException e) {
			logger.error("SESSION ERROR-RuntimeException");
		} catch (Exception e) {
			logger.error("SESSION ERROR");
		}
     	
     	model.addAttribute("rs", rs);
     	
        return "jsonView";
    }
    
    //파일 업로드
    @RequestMapping(value = "/desk/board/fileUpload.do", method=RequestMethod.POST)
    public String fileUpload(HttpServletRequest request, List<MultipartFile> files, BoardContentVO boardContentVO) throws SQLException {

    	
		 HttpSession session = request.getSession(true);
		  
		 SessionVO sessionVO = new SessionVO(); sessionVO = (SessionVO)
		 session.getAttribute("sessionUserInfo");
		 String saveDirectory = "";
		 
		 UserStorageVO userStorage = userStorageService.getUserStorageInfo(HOST_IP);
		 String FILE_DIR = userStorage.getMount_directory();
		 String targetDirUrl = userStorage.getDir_url();
			
			saveDirectory = FILE_DIR+File.separator+sessionVO.getSessMemId()+File.separator+"USER_DATA"+File.separator;
			if(saveDirectory != null) saveDirectory = saveDirectory.replaceAll("\\\\", "").replaceAll("&", "");
			File fileDirectory = new File(saveDirectory);
	
			if(!fileDirectory.isDirectory()) {
				fileDirectory.setExecutable(false); //실행권한
				fileDirectory.setReadable(true);   //읽기권한
				fileDirectory.setWritable(true);   //쓰기권한
				fileDirectory.mkdirs();
			}

			for(MultipartFile mf : files) {

				Date now = new Date();
				long ut3 = now.getTime() / 1000L;
				
				String orgFileName = mf.getOriginalFilename();
				
				String fileBaseName = FilenameUtils.getBaseName(orgFileName);
				
				String fileExtention = FilenameUtils.getExtension(orgFileName);
				
				try {
					multiFileUploadService.saveFileToUserDirectory(mf, String.valueOf(ut3), saveDirectory);
				} catch (SQLException e) {
					// TODO Auto-generated catch block
					logger.error("Error-SQLException");
				}

				String saveModelFileName = "";
				if(fileBaseName != null && fileExtention != null) saveModelFileName = multiFileUploadService.replaceSpecialCharacter(fileBaseName)+"_"+String.valueOf(ut3)+"."+fileExtention.toUpperCase();
				String saveModelFileUrl = targetDirUrl+sessionVO.getSessMemId()+"/USER_DATA/"+saveModelFileName;
				
				BoardFileVO boardFileVO = new BoardFileVO();
				boardFileVO.setMemid(sessionVO.getSessMemId());
				boardFileVO.setBid(boardContentVO.getBid());
				boardFileVO.setFile_type(fileExtention);
				boardFileVO.setOrg_file_name(orgFileName);
				boardFileVO.setSave_file_name(saveModelFileName);
				boardFileVO.setSave_file_path(saveDirectory+saveModelFileName);
				boardFileVO.setSave_file_url(saveModelFileUrl);

				boardFileService.insertBoardFile(boardFileVO);
			

			}
			return "jsonView";
	}
   
    //파일 다운로드
    @RequestMapping(value = "/desk/board/fileDownload.do", method=RequestMethod.GET)
    public void fileDownload(HttpServletRequest request,HttpServletResponse response,@RequestParam(value="fid", required=true) int fid) {


    	FileInputStream fileInputStream = null;
	    ServletOutputStream servletOutputStream = null;

	    try{
	    	BoardFileVO boardFileVO = new BoardFileVO();
			boardFileVO = boardFileService.boardFileInfo(fid);
			
			String path = boardFileVO.getSave_file_path(); //full경로
		    String fileName = boardFileVO.getOrg_file_name(); //파일명
		 
		    File file = new File(path);
		 
	        String downName = null;
	        String browser = request.getHeader("User-Agent");
	        //파일 인코딩
	        if(browser.contains("MSIE") || browser.contains("Trident") || browser.contains("Chrome")){//브라우저 확인 파일명 encode  
	            
	            downName = URLEncoder.encode(fileName,"UTF-8").replaceAll("\\+", "%20");
	            
	        }else{
	            
	            downName = new String(fileName.getBytes("UTF-8"), "ISO-8859-1");
	            
	        }
	        
	        response.setHeader("Content-Disposition","attachment;filename=\"" + downName+"\"");             
	        response.setContentType("application/octer-stream");
	        response.setHeader("Content-Transfer-Encoding", "binary;");
	 
	        fileInputStream = new FileInputStream(file);
	        servletOutputStream = response.getOutputStream();
	 
	        byte b [] = new byte[1024];
	        int data = 0;
	 
	        while((data=(fileInputStream.read(b, 0, b.length))) != -1){
	            
	            servletOutputStream.write(b, 0, data);
	            
	        }
	 
	        servletOutputStream.flush();//출력
	        
	    }catch (SQLException e) {
	    	logger.error("Error-SQLException");
	    } catch (FileNotFoundException e) {
	    	logger.error("Error-FileNotFoundException");
		} catch (IOException e) {
	    	logger.error("Error-IOException");
		}finally{
	        if(servletOutputStream!=null){
	            try{
	                servletOutputStream.close();
	            }catch (IOException e){
	            	logger.error("Error-IOException");
	            }
	        }
	        if(fileInputStream!=null){
	            try{
	                fileInputStream.close();
	            }catch (IOException e){
	            	logger.error("Error-IOException");
	            }
	        }
	    }
	}

    //게시판 별 파일 리스트 출력   (dropzone에)
    @RequestMapping(value = "/desk/board/getFileList.do", method = RequestMethod.POST)
    public String getFileList(@RequestParam(value="bid") int bid, Model model) {
    	try{
	    	//파일 목록
			List<BoardFileVO> filelist = boardFileService.viewBoardFile(bid);	
			model.addAttribute("boardFileList", filelist);	
		
    	}catch (SQLException e) {
			logger.error("Error-SQLException");
		}	
		
        return "jsonView";
    }
    
  
    //답글 작성
  	@RequestMapping(value="/desk/board/addReply.do", method = RequestMethod.POST)
    public String addReply(Model model, HttpServletRequest request, @RequestParam HashMap<String, String> map) {
    	String rs = "fail";
    			
    	HttpSession session = request.getSession(true);

		SessionVO sessionVO = new SessionVO();
		sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");
		
		CommentVO commentVO = new CommentVO();
		commentVO.setBmid(Integer.parseInt(map.get("bmid").toString()));
		commentVO.setBid(Integer.parseInt(map.get("bid").toString()));
		commentVO.setMemid(sessionVO.getSessMemId());
		String content = map.get("replyContent").toString();
		commentVO.setContent(content);
		commentVO.setCgroup(Integer.parseInt(map.get("cgroup").toString()));

		int cmt_alert = Integer.parseInt(map.get("cmt_alert").toString());
		int reply_alert = Integer.parseInt(map.get("reply_alert").toString());
		
		final String accesskey = MAIL_API_ACCESSKEY;
		final String secretkey = MAIL_API_SECRETKEY;
		final String apiURL = MAIL_API_SENDURL;
		
		try {
			commentService.insertReply(commentVO);
			
			//댓글작성자에게 알림 
			if(reply_alert == 1) {
				CommentVO cgroupCmtVO = commentService.selectComment(Integer.parseInt(map.get("cgroup").toString()));
				MemberVO memberVO = new MemberVO();
				memberVO.setMem_id(cgroupCmtVO.getMemid());
				
				memberVO = memberService.getMemberInfoMemId(memberVO);

				if (memberVO != null && memberVO.getMem_email() != null && !(memberVO.getMem_email().equals("")) && !(cgroupCmtVO.getMemid().equals(sessionVO.getSessMemId()))) {
					MailerVO mailerVO = new MailerVO();
					mailerVO.setTemplateSid(262);
					RecipientForRequest recipient = new RecipientForRequest();
					recipient.setAddress(memberVO.getMem_email());
					recipient.setName(memberVO.getMem_name());
					recipient.setType("R");

					JSONObject jso = new JSONObject();
					jso.put("title",cgroupCmtVO.getContent());
					jso.put("memInfo",sessionVO.getSessMemId());
					jso.put("comment",content);
					CommentVO vo = commentService.selectComment(commentVO.getCid());
					jso.put("commentTime",vo.getReg_date().toString());

					// 이메일 인증 테스트용
					recipient.setParameters(jso);
					// System.out.println(jso.toJSONString());
					// 메일 전송 객체 내부의 수신자 객체리스트 ->여러명일 경우 리스트에 ADD
					List<RecipientForRequest> recipients = new ArrayList<RecipientForRequest>();
					recipients.add(recipient);

					mailerVO.setRecipients(recipients);
					mailerVO.setParameters(null);
					mailerVO.setIndividual(true);
					mailerVO.setAdvertising(false);
					try { // 메일 전송시 mailerVO객체를 넘겨준다.
						mailingService.mailSender(mailerVO, accesskey, secretkey, apiURL);
					} catch (InvalidKeyException | NoSuchAlgorithmException | IllegalStateException
							| UnsupportedEncodingException e) {
						logger.error("MailSending Error-An Error Occured while Excuting mailing service.");
					}
				
				}
			}

			// 게시물 작성자에게 알림
			if(cmt_alert == 1) {
				BoardContentVO boardContentVO = boardContentService.viewBoard(Integer.parseInt(map.get("bid").toString()));
				MemberVO memberVO = new MemberVO();
				memberVO.setMem_id(boardContentVO.getMemid());
				
				memberVO = memberService.getMemberInfoMemId(memberVO);
				if (memberVO != null && memberVO.getMem_email() != null && !(memberVO.getMem_email().equals("")) && !(boardContentVO.getMemid().equals(sessionVO.getSessMemId()))) {
					MailerVO mailerVO = new MailerVO();
					mailerVO.setTemplateSid(262);
					RecipientForRequest recipient = new RecipientForRequest();
					recipient.setAddress(memberVO.getMem_email());
					recipient.setName(memberVO.getMem_name());
					recipient.setType("R");

					JSONObject jso = new JSONObject();
					jso.put("title",boardContentVO.getTitle());
					jso.put("memInfo",sessionVO.getSessMemId());
					jso.put("comment",content);

					CommentVO vo = commentService.selectComment(commentVO.getCid());
	
					jso.put("commentTime",vo.getReg_date().toString());

					// 이메일 인증 테스트용
					recipient.setParameters(jso);
					// System.out.println(jso.toJSONString());
					// 메일 전송 객체 내부의 수신자 객체리스트 ->여러명일 경우 리스트에 ADD
					List<RecipientForRequest> recipients = new ArrayList<RecipientForRequest>();
					recipients.add(recipient);

					mailerVO.setRecipients(recipients);
					mailerVO.setParameters(null);
					mailerVO.setIndividual(true);
					mailerVO.setAdvertising(false);
					try { // 메일 전송시 mailerVO객체를 넘겨준다.
						mailingService.mailSender(mailerVO, accesskey, secretkey, apiURL);
					} catch (InvalidKeyException | NoSuchAlgorithmException | IllegalStateException
							| UnsupportedEncodingException e) {
						logger.error("MailSending Error-An Error Occured while Excuting mailing service.");
					}
				
				}
			}
			
			rs = "complete";
		} catch (SQLException e1) {
			logger.error("[ERROR-PDC-001] - addBoard controller error");
		} catch (RuntimeException e) {
			logger.error("SESSION ERROR-RuntimeException");
		} catch (Exception e) {
			logger.error("SESSION ERROR");
		}
		
	
    	model.addAttribute("rs", rs);
    	
        return "jsonView";
    }

  	@RequestMapping(value="/uploadEditorImg.do", method = RequestMethod.POST)
  	public String uploadImage(Model model, MultipartHttpServletRequest request) {

		HttpSession session = request.getSession(true);

		SessionVO sessionVO = new SessionVO();
		sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");
		
		try {
		
			MultipartFile uploadFile = request.getFile("upload");
			
			UserStorageVO userStorage = userStorageService.getUserStorageInfo(HOST_IP);
			String FILE_DIR = userStorage.getMount_directory();
			String targetDirUrl = userStorage.getDir_url();
	
			String originalFileName = uploadFile.getOriginalFilename();
	
			String ext = originalFileName.substring(originalFileName.indexOf("."));
	
			String newFileName = UUID.randomUUID() + ext;
	
			String realPath = FILE_DIR+sessionVO.getSessMemId()+File.separator+"USER_DATA"+File.separator;
	    	
			String savePath = realPath + newFileName;
	
			String uploadPath = targetDirUrl+sessionVO.getSessMemId()+"/USER_DATA/"+newFileName;
			
			if(uploadPath != null) uploadPath = uploadPath.replaceAll("\\\\", "").replaceAll("&", "");
			if(savePath != null) savePath = savePath.replaceAll("\\\\", "").replaceAll("&", "");
	
			File file = new File(savePath);
	
			uploadFile.transferTo(file);
	
			model.addAttribute("uploaded", true);
			model.addAttribute("url", uploadPath);
		
		}
		catch (IllegalStateException e) {
			logger.error("ERROR-IllegalStateException");
		} catch (IOException e) {
			logger.error("ERROR-IOException");
		}

		return "jsonView";
  	}
}

