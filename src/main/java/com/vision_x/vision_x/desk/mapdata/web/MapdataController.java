package com.vision_x.vision_x.desk.mapdata.web;

import java.io.File;
import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import org.apache.commons.lang.StringEscapeUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.vision_x.vision_x.admin.service.CoordService;
import com.vision_x.vision_x.admin.service.CoordVO;
import com.vision_x.vision_x.admin.service.BoardMasterService;
import com.vision_x.vision_x.admin.service.BoardMasterVO;
import com.vision_x.vision_x.admin.service.CollaborationVO;
import com.vision_x.vision_x.common.AbleDataExtention;
import com.vision_x.vision_x.csv.service.ReadCsvFileService;
import com.vision_x.vision_x.desk.alert.service.AlertService;
import com.vision_x.vision_x.desk.mapdata.service.DataShareService;
import com.vision_x.vision_x.desk.mapdata.service.DataShareVO;
import com.vision_x.vision_x.desk.mapdata.service.MapdataService;
import com.vision_x.vision_x.desk.mapdata.service.MapsDataVO;
import com.vision_x.vision_x.desk.service.GroupService;
import com.vision_x.vision_x.desk.service.GroupVO;
import com.vision_x.vision_x.file.service.FileService;
import com.vision_x.vision_x.file.service.FileVO;
import com.vision_x.vision_x.file.service.MultiFileUploadService;
import com.vision_x.vision_x.geoserver.service.GeoServerService;
import com.vision_x.vision_x.member.service.MemberService;
import com.vision_x.vision_x.member.service.MemberVO;
import com.vision_x.vision_x.utils.GdalService;
import com.vision_x.vision_x.utils.GeoToolsService;
import com.vision_x.vision_x.utils.HdfsService;
import com.vision_x.vision_x.utils.PostGisCmdService;
import com.vision_x.vision_x.utils.SessionVO;
import com.vision_x.vision_x.worker.service.ConvertWorkerItemVO;
import com.vision_x.vision_x.worker.service.WorkerService;

@Controller
public class MapdataController {
	
	@Value("#{globalInfo['Globals.file.serverRemote.path']}")
	private String FILE_REMOTE_SERVER_DIR; //파일 서버 경로
	
	@Value("#{globalInfo['Globals.hdfs.rootPath']}")
	private String HDFS_ROOT; // HDFS ROOT
	
	@Value("#{globalInfo['Globals.hdfs.rootPathLocal']}")
	private String HDFS_ROOT_LOCAL;
	
	@Value("#{globalInfo['Globals.env.mode']}")
	private String ENV_MODE;
	
	@Resource(name="multiFileUploadService")
	private MultiFileUploadService multiFileUploadService;
	
	@Resource(name="mapdataService")
	private MapdataService mapdataService;
	
	@Resource(name="readCsvFileService")
	private ReadCsvFileService readCsvFileService;
	
	@Resource(name="gdalService")
	private GdalService gdalService;
	
	@Resource(name="fileService")
	private FileService fileService;
	
	@Resource(name="workerService")
	private WorkerService workerService;
	
	@Resource(name="coordService")
	private CoordService coordService;
	
	@Resource(name="hdfsService")
	private HdfsService hdfsService;
	
	@Resource(name="geoToolsService")
	private GeoToolsService geoToolsService;
	
	@Resource(name="postGisCmdService")
	private PostGisCmdService postGisCmdService;
	
	@Resource(name="memberService")
	private MemberService memberService;
	
	@Resource(name="geoServerService")
	private GeoServerService geoServerService;
	
	@Resource(name="groupService")
	private GroupService groupService;
	
	@Resource(name="dataShareService")
	private DataShareService dataShareService;
	
	@Resource(name="boardMasterService")
	private BoardMasterService boardMasterService;
	
	@Resource(name = "alertService")
	private AlertService alertService;
	
	
	protected Logger logger = LoggerFactory.getLogger(this.getClass());

	@RequestMapping(value="/desk/mapdata/getCsvSampleData.do",method=RequestMethod.POST)
	public String getCsvSampleData(Model model, HttpServletRequest request) throws IOException{

		HttpSession session = request.getSession(true);
		String filePath = (String)session.getAttribute("file_tmp_path");
		String fileName ="";
		
		if(session.getAttribute("file_name") != null) {
			fileName = (String)session.getAttribute("file_name");
		}else {
			fileName="";
		}
		
		String fileUrl =filePath+fileName;
		
		int columnIndx=Integer.parseInt(request.getParameter("idx"));
		
		List<String> records = readCsvFileService.getColumnData(fileUrl, columnIndx, 5);
		
		String rsStr ="complete";
		
		if(records.size() == 0) {
			rsStr ="no data";
		}
		
		String type = request.getParameter("type");
		
		model.addAttribute("rs", records);
		model.addAttribute("resultCode", rsStr);
		model.addAttribute("type", type);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/desk/mapdata/changeCsvDataName.do",method=RequestMethod.POST)
	public String changeCsvDataName(@RequestParam HashMap<String,String> reqMap, Model model) {
		
		int rs = mapdataService.updateDataName(reqMap);
		
		String rsStr="";
		
		if(rs != 0) {
			rsStr="complete";
		}else {
			rsStr="fail";
		}
		
		model.addAttribute("resultCode", rsStr);
		return "jsonView";
	}
	
	@RequestMapping(value="/desk/mapdata/loadCsvSampleData.do",method=RequestMethod.POST)
	public String loadCsvSampleData(@RequestParam HashMap<String,String> reqMap, Model model) throws NumberFormatException, IOException{
		
		HashMap<String, String> rsMap = mapdataService.getCsvDataInfo(reqMap);
		String filePath = rsMap.get("FILE_URL");
		
		List<String> records = readCsvFileService.getColumnData(filePath, Integer.parseInt(reqMap.get("idx")), 5);
		
		model.addAttribute("type", reqMap.get("type"));
		model.addAttribute("resultCode", "complete");
		model.addAttribute("rs", records);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/desk/mapdata/updateCsvData.do",method=RequestMethod.POST)
	public String updateCsvData(@RequestParam HashMap<String,String> reqMap, Model model) {
		
		int rs = mapdataService.updateCsvData(reqMap);
		
		String rsStr = "fail";
		
		if(rs != 0) {
			rsStr="complete";
		}
		
		model.addAttribute("resultCode", rsStr);
		return "jsonView";
	}
	
	@RequestMapping(value="/desk/mapdata/deleteCsvData.do",method=RequestMethod.POST)
	public String deleteCsvData(@RequestParam HashMap<String,String> reqMap, Model model) {
		
		HashMap<String, String> rsCsvData = mapdataService.getCsvDataInfo(reqMap);
		
		//file dir
		String fileOrgDir = rsCsvData.get("FILE_URL");
	
		
		multiFileUploadService.deleteFileLists(fileOrgDir);
		
		int rs = mapdataService.deleteSingleFileData(reqMap);
		
		String rsStr = "fail";
		if(rs != 0) {
			rsStr = "complete";
		}
		
		model.addAttribute("resultCode", rsStr);
		
		return "jsonView";
	}
	
	@RequestMapping(value = "/data/checkFileExtention.do", method = RequestMethod.POST)
	public String checkFileExtention(Model model, HttpServletRequest request, @RequestParam(value="filesName") String fileName){

		try {
			//logger.info("f:"+fileName);

			List<String> extList = new ArrayList<>();
			model.addAttribute("rs", "fail");
			if(fileName != null) {
				String[] fn = fileName.split(",");
				for(int i = 0; i < fn.length; i++) {
					if(fn[i] != null) {
						String[] spFileName = fn[i].split("\\.");
						if(spFileName[1] != null) {
							extList.add(spFileName[1].toUpperCase());
						}
					}
				} 
			}

			// Check Able
			//AbleDataExtention ableDataExtention;

			boolean isAble = false;

			for(AbleDataExtention ableDataExtention : AbleDataExtention.values()) {
				//logger.info("ext:"+ableDataExtention.getExtention());
				for(int i = 0; i < extList.size(); i++) {
					if(ableDataExtention.getExtention().equals(extList.get(i))) {
						isAble = true;
						break;
					}
				}
			}

			model.addAttribute("rs", "complete");
			model.addAttribute("isAble", isAble);



		}
		catch (RuntimeException e) {
			model.addAttribute("rs", "fail");
			logger.error("FILE ERROR-RuntimeException");
		}
		catch (Exception e) {
			model.addAttribute("rs", "fail");
			logger.error("FILE ERROR");
		}

		return "jsonView";
	}
	
	@RequestMapping(value="/desk/mapdata/dataShare.do", method=RequestMethod.GET)
	public String dataShare(Model model, HttpServletRequest request, @RequestParam(value="dataid", required=true) String dataid){
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
			HashMap<String, Object> params = new HashMap<>();
			params.put("dataid",Integer.parseInt(dataid));
			
			MapsDataVO resultMapsDataVO = mapdataService.getMapDataFromParam(params);
			
			model.addAttribute("mapsDataVO", resultMapsDataVO);
			model.addAttribute("memberVO", memberVO);
			
			model.addAttribute("status", "9");
			model.addAttribute("memberStatus", "9");
			model.addAttribute("groupStatus", "9");
			model.addAttribute("allStatus", "9");
			
			List<MemberVO> memberList = memberService.getMemberList();
			for (MemberVO memberVO2 : memberList) {
				if(memberVO2.getMem_name() != null) {
					StringBuilder memName = new StringBuilder(memberVO2.getMem_name());
					if(memName.length() == 2) { 
						memName.replace(1, 2, "*");
					}else {
						for(int i = 1;i<(memName.length())-1;i++) {
							memName.replace(i, i+1, "*");
						}
					}
					memberVO2.setMem_name(memName.toString());
				}
			}
			
			//List<GroupVO> groupList = groupService.selectGroupList();

			List<DataShareVO> dataShareList = dataShareService.getDataShareInfo(params);
			List<DataShareVO> dataShareMemberList = new ArrayList<>();
			List<DataShareVO> dataShareGroupList = new ArrayList<>();
			Boolean statusFlag = true;
			Boolean memberFlag = true;
			Boolean groupFlag = true;
			Boolean allFlag = true;
			for(DataShareVO dataShareInfo : dataShareList) {
				String type = dataShareInfo.getShare_type();
				String status = dataShareInfo.getState();
				switch (type) {
					case "A":
						if(allFlag && !status.equals("9")) {
							allFlag = false;
						}
						model.addAttribute("allStatus", status);
					break;
					case "M":
						if(memberFlag && !status.equals("9")) {
							allFlag = false;
						}
						model.addAttribute("memberStatus", status);
						dataShareMemberList.add(dataShareInfo);
					break;
					case "G":
						if(groupFlag && !status.equals("9")) {
							allFlag = false;
						}
						model.addAttribute("groupStatus", status);
						dataShareGroupList.add(dataShareInfo);
					break;
				}
				if(statusFlag && !status.equals("9")) {
					model.addAttribute("status", "1");
					statusFlag = false;
				}
			}
			groupFlag = true;
			
			List<GroupVO> groupList = groupService.selectMyExistGroupList(sessionVO.getSessMid());
			
			if(groupList.size() == 0) {
				groupFlag = false;
			}
			model.addAttribute("groupFlag", groupFlag);
			
			model.addAttribute("memberList", memberList);
			model.addAttribute("groupList", groupList);
			model.addAttribute("dataShareMemberList", dataShareMemberList);
			model.addAttribute("dataShareGroupList", dataShareGroupList);
			
		}
		catch (RuntimeException e) {
			logger.error("SELECT ERROR-RuntimeException");
		}
		catch (Exception e) {
			logger.error("SELECT ERROR");
		}
		return "desk/mapdata/dataShare";
	}
	
	@RequestMapping(value="/desk/mapdata/dataShareSave.do",method=RequestMethod.POST)
	public String dataShareSave(Model model, HttpServletRequest request, @RequestParam HashMap<String,Object> postMap) {
		
		String rs = "fail";
		try {
			
			HttpSession session = request.getSession(true);
			
			SessionVO sessionVO = new SessionVO();
			sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");

			DataShareVO dataShareVO = new DataShareVO();
			dataShareVO.setMid(sessionVO.getSessMid());
			dataShareVO.setDataid(Integer.parseInt(postMap.get("dataId").toString()));
			String dataShareMemberStatus = "9";
			String dataShareGroupStatus = "9";
			String dataShareAllStatus = "9";
			Boolean groupFlag = true;
			
			MemberVO memberVO = new MemberVO();
			memberVO.setMid(sessionVO.getSessMid());
			memberVO = memberService.getMemberInfo(memberVO);
			/*
			if(memberVO.getGid() != 0) {
				//그룹 있음
				GroupVO groupVO = new GroupVO();
				groupVO.setGid(memberVO.getGid());
				List<MemberVO> groupMemberList = groupService.selectGroupMember(groupVO);
				for(MemberVO groupMemberInfo : groupMemberList) {
					if(groupMemberInfo.getMem_level() == 5) {
						//관리자 있음
						groupFlag = false;
					}
				}
			}
			*/
			if(postMap.get("status").toString().equals("0") && postMap.get("dataShareMember").toString().equals("true")) {
				dataShareMemberStatus = "0";
				if(groupFlag) {
					dataShareMemberStatus = "1";
				}
			}
			if(postMap.get("status").toString().equals("0") && postMap.get("dataShareGroup").toString().equals("true")) {
				dataShareGroupStatus = "0";
				if(groupFlag) {
					dataShareGroupStatus = "1";
				}
			}
			if(postMap.get("status").toString().equals("0") && postMap.get("dataShareAll").toString().equals("true")) {
				dataShareAllStatus = "0";
				if(groupFlag) {
					dataShareAllStatus = "1";
				}
			}
			
			HashMap<String, Object> params = new HashMap<>();
			params.put("dataid",Integer.parseInt(postMap.get("dataId").toString()));
			
			List<DataShareVO> dataShareList = dataShareService.getDataShareInfo(params);
			
			if(dataShareList.size() > 0) {
				//수정
				List<String> dataShareMemberList = Arrays.asList(postMap.get("dataShareMemberList").toString().split(","));
				List<String> dataShareGroupList = Arrays.asList(postMap.get("dataShareGroupList").toString().split(","));
				
				List<String> dataShareMemberDataList = new ArrayList<String>();
				List<String> dataShareGroupDataList = new ArrayList<String>();
				for(DataShareVO dataShareInfo : dataShareList) {
					String type = dataShareInfo.getShare_type();
					
					switch (type) {
						case "A":
							dataShareInfo.setState(dataShareAllStatus);
							dataShareService.updateDataShare(dataShareInfo);
						break;
						case "M":
							int mid = dataShareInfo.getShare_mid();
							dataShareMemberDataList.add(Integer.toString(mid));
						break;
						case "G":
							int gid = dataShareInfo.getShare_gid();
							dataShareGroupDataList.add(Integer.toString(gid));
						break;
					}
				}
				dataShareVO.setShare_type("M");
				dataShareVO.setState(dataShareMemberStatus);
				for(String dataShareMember : dataShareMemberList) {
					if(!dataShareMember.equals("")) {
						dataShareVO.setShare_mid(Integer.parseInt(dataShareMember));
						if(dataShareMemberDataList.contains(dataShareMember)) {
							//수정
							dataShareService.updateDataShare(dataShareVO);
						}else {
							//신규
							dataShareService.insertDataShare(dataShareVO);
						}
					}
				}for(String dataShareMember : dataShareMemberDataList) {
					dataShareVO.setShare_mid(Integer.parseInt(dataShareMember));
					if(!dataShareMemberList.contains(dataShareMember)) {
						//삭제

						dataShareService.deleteDataShare(dataShareVO);
					}
				}

				dataShareVO.setShare_mid(0);
				dataShareVO.setShare_type("G");
				dataShareVO.setState(dataShareGroupStatus);
				for(String dataShareGroup : dataShareGroupList) {
					if(!dataShareGroup.equals("")) {
						dataShareVO.setShare_gid(Integer.parseInt(dataShareGroup));
						if(dataShareGroupDataList.contains(dataShareGroup)) {
							//수정
							dataShareService.updateDataShare(dataShareVO);
						}else {
							//신규
							dataShareService.insertDataShare(dataShareVO);
						}
					}
				}for(String dataShareGroup : dataShareGroupDataList) {
					dataShareVO.setShare_gid(Integer.parseInt(dataShareGroup));
					if(!dataShareGroupList.contains(dataShareGroup)) {
						//삭제
						dataShareService.deleteDataShare(dataShareVO);
					}
				}
			}else {
				//최초등록
				if(postMap.get("dataShareAll").toString().equals("true")) {
					dataShareVO.setShare_type("A");
					dataShareVO.setState(dataShareAllStatus);
					dataShareService.insertDataShare(dataShareVO);
				}
				String[] dataShareMemberList = postMap.get("dataShareMemberList").toString().split(",");
				String[] dataShareGroupList = postMap.get("dataShareGroupList").toString().split(",");
				
				for(String dataShareMember : dataShareMemberList) {
					if(!dataShareMember.equals("")) {
						dataShareVO.setShare_mid(Integer.parseInt(dataShareMember));
						dataShareVO.setShare_type("M");
						dataShareVO.setState(dataShareMemberStatus);
						dataShareService.insertDataShare(dataShareVO);
					}
				}
				dataShareVO.setShare_mid(0);
				for(String dataShareGroup : dataShareGroupList) {
					if(!dataShareGroup.equals("")) {
						dataShareVO.setShare_gid(Integer.parseInt(dataShareGroup));
						dataShareVO.setShare_type("G");
						dataShareVO.setState(dataShareGroupStatus);
						dataShareService.insertDataShare(dataShareVO);
					}
				}
			}
			
			rs = "complete";
			
			
		}
		catch (RuntimeException e) {
			logger.error("INSERT ERROR-RuntimeException");
		}
		catch (Exception e) {
			logger.error("INSERT ERROR");
		}
		
		model.addAttribute("rs", rs);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/desk/mapdata/dataShareInfo.do",method=RequestMethod.POST)
	public String dataShareInfo(@RequestParam HashMap<String,String> reqMap, Model model,HttpServletRequest request){
		
		List<DataShareVO> dataShareList;
		
		HttpSession session = request.getSession(true);
		
		HashMap<String, Object> params = new HashMap<>();
		params.put("dataid",Integer.parseInt(reqMap.get("dataId").toString()));
		
		try {
			dataShareList = dataShareService.getDataShareInfo(params);
			model.addAttribute("resultCode", "complete");
			model.addAttribute("rs", dataShareList);
		}
		catch (RuntimeException e) {
			logger.error("SELECT ERROR-RuntimeException");
		}
		catch (Exception e) {
			logger.error("SELECT ERROR");
		}
		
		
		return "jsonView";
	}

	
	@RequestMapping(value="/desk/mapdata/dataShareMember.do",method=RequestMethod.POST)
	public String dataShareMember(@RequestParam HashMap<String,String> reqMap, Model model,HttpServletRequest request){
		
		HttpSession session = request.getSession(true);
		
		MemberVO memberVO = new MemberVO();
		memberVO.setMem_id(reqMap.get("memid").toString());
		try {
			memberVO = memberService.getMemberInfoMemId(memberVO);
			HashMap<String, Object> pagination = new HashMap<>();
			HashMap<String, Object> memberList = new HashMap<>();

			List<Object> results = new ArrayList<>();
			if(memberVO != null) {
				HashMap<String, Object> memberInfo = new HashMap<>();

				memberInfo.put("id", memberVO.getMid());
				if(memberVO.getMem_name() == null) {				
					memberInfo.put("text", memberVO.getMem_id());
				}else {
					if(memberVO.getMem_name() != null) {
						StringBuilder memName = new StringBuilder(memberVO.getMem_name());
						if(memName.length() == 2) { 
							memName.replace(1, 2, "*");
						}else {
							for(int i = 1;i<(memName.length())-1;i++) {
								memName.replace(i, i+1, "*");
							}
						}
						memberInfo.put("text", memberVO.getMem_id()+" ("+memName+")");
					}
				}
				results.add(memberInfo);
			}
			
			pagination.put("more", true);
			memberList.put("pagination", pagination);
			memberList.put("results", results);

			model.addAttribute("resultCode", "complete");
			model.addAttribute("rs", memberList);
		}
		catch (RuntimeException e) {
			logger.error("SELECT ERROR-RuntimeException");
		}
		catch (Exception e) {
			logger.error("SELECT ERROR");
		}
		
		
		return "jsonView";
	}
	@RequestMapping(value="/desk/mapdata/getCheckRequstList.do", method=RequestMethod.POST)
	public String getCheckRequstList(Model model, HttpServletRequest request){
		String rs = "fail";
		try {
			HttpSession session = request.getSession(true);
			SessionVO sessionVO = new SessionVO();
			sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");
			int mid = sessionVO.getSessMid();
			MemberVO memberVO = new MemberVO();
			memberVO.setMid(mid);
			memberVO = memberService.getMemberInfo(memberVO);
			
			List<DataShareVO> dataList = dataShareService.selectCheckRequst(memberVO);
			model.addAttribute("data_list", dataList);
			rs = "complete";
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
	@RequestMapping(value="/desk/mapdata/checkRequest.do", method=RequestMethod.POST)
	public String checkRequest(Model model, HttpServletRequest request,
			@RequestParam HashMap<String,String> reqMap){
		String rs = "fail";
		try {
			HttpSession session = request.getSession(true);
			SessionVO sessionVO = new SessionVO();
			sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");
			
			int mid = sessionVO.getSessMid();
			MemberVO memberVO = new MemberVO();
			memberVO.setMid(mid);
			memberVO = memberService.getMemberInfo(memberVO);
			
			int dataId = Integer.parseInt(reqMap.get("dataId").toString());
			
			HashMap<String, Object> params = new HashMap<>();
			params.put("dataid",dataId);
			
			List<DataShareVO> dataShareList = dataShareService.getDataShareInfo(params);
			List<DataShareVO> dataShareMemberList = new ArrayList<>();
			for(DataShareVO dataShareInfo : dataShareList) {
				String type = dataShareInfo.getShare_type();
				switch (type) {
					case "M":
						dataShareMemberList.add(dataShareInfo);
					break;
				} 
			}
			String state = reqMap.get("state").toString();
			String shareType = reqMap.get("share_type").toString();
			DataShareVO dataShareVO = new DataShareVO();
			dataShareVO.setDataid(dataId);
			dataShareVO.setState(state);
			String[] typeArray = shareType.split(",");
			
			for(int i=0;i<typeArray.length;i++) {
				if(!typeArray[i].equals("")) {
					if(typeArray[i].equals("M")) {
						dataShareVO.setShare_type(typeArray[i]);
						for(DataShareVO dataShareMember : dataShareMemberList) {
							dataShareVO.setShare_mid(dataShareMember.getShare_mid());
							dataShareService.updateDataShare(dataShareVO);
						}
					}else {
						dataShareVO.setShare_gid(memberVO.getGid());
						dataShareVO.setShare_type(typeArray[i]);
						dataShareService.updateDataShare(dataShareVO);
					}
				}
			}
			
			model.addAttribute("dataId", dataId);
			
			rs = "complete";
			
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
}
