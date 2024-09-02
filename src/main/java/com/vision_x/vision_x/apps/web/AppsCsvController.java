package com.vision_x.vision_x.apps.web;

import java.io.File;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.net.Inet4Address;
import java.net.UnknownHostException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map.Entry;
import java.util.Set;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang.StringEscapeUtils;
import org.json.JSONArray;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.vision_x.vision_x.apps.service.AppFileUploadService;
import com.vision_x.vision_x.apps.service.AppsService;
import com.vision_x.vision_x.apps.service.CsvVO;
import com.vision_x.vision_x.csv.service.ReadCsvFileService;
import com.vision_x.vision_x.desk.mapdata.service.MapdataService;
import com.vision_x.vision_x.desk.mapdata.service.MapsDataVO;
import com.vision_x.vision_x.geocoding.service.CsvPropertiesService;
import com.vision_x.vision_x.member.service.MemberService;
import com.vision_x.vision_x.member.service.MemberVO;
import com.vision_x.vision_x.storage.service.UserStorageService;
import com.vision_x.vision_x.storage.service.UserStorageVO;
import com.vision_x.vision_x.utils.GeoToolsService;
import com.vision_x.vision_x.utils.SessionVO;
import com.fasterxml.jackson.databind.ObjectMapper;

@Controller
public class AppsCsvController {
	
	@Value("#{globalInfo['Globals.env.mode']}")
	private String ENV_MODE;
		
	@Resource(name="memberService")
	private MemberService memberService;
	
	@Resource(name="readCsvFileService")
	private ReadCsvFileService readCsvFileService;
	
	@Resource(name="appFileUploadService")
	private AppFileUploadService appFileUploadService;
	
	@Resource(name="geoToolsService")
	private GeoToolsService geoToolsService;

	@Resource(name="appsService")
	private AppsService appsService;
	
	@Resource(name="csvPropertiesService")
	private CsvPropertiesService csvPropertiesService;
	
	@Resource(name="userStorageService")
	private UserStorageService userStorageService;
	
	@Resource(name="mapdataService")
	private MapdataService mapdataService;

	protected Logger logger = LoggerFactory.getLogger(this.getClass());
	
	private String HOST_IP = "";
	
	public AppsCsvController() {
	
		try {
			this.HOST_IP =Inet4Address.getLocalHost().getHostName();
		}
		
		catch ( UnknownHostException e ) {
			logger.info("unknowhost exception");
		}
	}

	@RequestMapping(value="/appCsv/valid.do",method=RequestMethod.POST)
	public String checkFileInfo(Model model, HttpServletRequest request,MultipartHttpServletRequest multiFiles) {
		//서버 업로드, app 용 파일 db insert
		//default csv encoding euc-kr
		//파일 타입 체크
		HttpSession session = request.getSession(true);
		SessionVO sessionVO = new SessionVO();
		sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");
		
		List<MultipartFile> fileLists = new ArrayList<>();
		Iterator<String> itr = multiFiles.getFileNames();
		
		while(itr.hasNext()) {
			fileLists.add(multiFiles.getFile((String)itr.next()));
		}
		
		UserStorageVO userStorage = userStorageService.getUserStorageInfo(HOST_IP);
		String FILE_PATH = userStorage.getMount_directory();

		String filePath = FILE_PATH + sessionVO.getSessMemId() + File.separator + "APP_DATA" + File.separator +"csv"+File.separator;
		String timeStamp = Long.toString(System.currentTimeMillis());
		String fileName= "apps_csv_"+timeStamp+".csv";
		
		MultipartFile file = fileLists.get(0);
		boolean check = appFileUploadService.singleUploadFile(file,filePath,fileName);
		
		/*
		String filePath = FILE_PATH + sessionVO.getSessMemId() + File.separator + "APP_DATA" + File.separator +"csv"+File.separator;
		String timeStamp = Long.toString(System.currentTimeMillis());
		String fileName= "apps_csv_"+timeStamp+".csv";
		boolean check=appFileUploadService.singleUploadFile(file,filePath,fileName);
		*/
		
		HashMap<String, Object> list = new HashMap<>();
		int acid = 0;
		
		if(check) {
			//db insert
			CsvVO vo = new CsvVO();
			vo.setMid(sessionVO.getSessMid());
			vo.setEncoding("euc-kr");
			vo.setFile_name(fileName);
			vo.setFile_path(filePath);
			vo.setMid(sessionVO.getSessMid());
			vo.setType("C");
			
			int rs = appFileUploadService.insertCsvUploadInfo(vo);
			
			//업로드 성공
			if(rs != 0) {

				try {
					list=readCsvFileService.getCsvSampleRecordCharsetList(filePath+fileName, 5, "EUC-KR");
				}
				catch (RuntimeException e) {
					logger.error("FILE ERROR-RuntimeException");
				}
				catch (Exception e) {
					logger.error("FILE ERROR");
				}
				
				acid = vo.getAcid();
			}
			
		}
		
		model.addAttribute("SAMPLE", list);
		model.addAttribute("ACID", acid);
		
		//리턴 샘플 csv레코드 (헤더, 리스트 포함)
		return "jsonView";
	}
	
	@RequestMapping(value="/appCsv/upload.do",method=RequestMethod.POST)
	public String uploadCsv(Model model, HttpServletRequest request){
		//csv db min,max 구하기
		int acid = Integer.parseInt(request.getParameter("ACID"));
		int labelIndx = 0;
		String labelColumn = "0";
		String encoding = request.getParameter("ENCODING");
		
		String upload_name=request.getParameter("UPLOAD_NAME");
		
		CsvVO vo = appFileUploadService.getCsvFileInfo(acid);
		
		HttpSession session = request.getSession(true);
		SessionVO sessionVO = new SessionVO();
		sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");
		
		int mid = sessionVO.getSessMid();
		
		MemberVO memVO = new MemberVO();
		try {
			memVO.setMid(mid);	
			memVO = memberService.getMemberInfo(memVO);

			String schema = memVO.getMem_geo_db().toLowerCase();
			schema = StringEscapeUtils.escapeSql(schema);
			
			String path = vo.getFile_path();
			if(path != null) path = path.replaceAll("\\\\","").replaceAll ("&","");
			String fileName= vo.getFile_name();
			if(fileName != null) fileName = fileName.replaceAll("/", "").replaceAll("\\\\", "");
			String layerName = "";
			if(fileName != null) layerName = fileName.split("\\.")[0];
			layerName = StringEscapeUtils.escapeSql(layerName);
			
			int lonIndx = Integer.parseInt(request.getParameter("lonIndx"));
			int latIndx = Integer.parseInt(request.getParameter("latIndx"));
			int pid = Integer.parseInt(request.getParameter("PID"));
			
			HashMap<String, Double> boundary = readCsvFileService.getBoundary(path, fileName, encoding, lonIndx, latIndx); 
			
			double minx = boundary.get("MINX");
			double miny = boundary.get("MINY");
			double maxx = boundary.get("MAXX");
			double maxy = boundary.get("MAXY");
			
			vo.setMinx(minx);
			vo.setMiny(miny);
			vo.setMaxx(maxx);
			vo.setMaxy(maxy);
			vo.setLon(lonIndx);
			vo.setLat(latIndx);
			vo.setLayer_name(schema+":"+layerName);
			vo.setLabel_indx(labelIndx);
			vo.setLabel_name(labelColumn);
			vo.setUpload_name(upload_name);
			vo.setEncoding(encoding);
			vo.setPid(pid);
			
			int rs =appFileUploadService.updateCsvInfo(vo);
			
			if(rs != 0) {
				
				HashMap<String, String> param = new HashMap<>();
				
				param.put("path",path);
				param.put("fileName",fileName);
				param.put("lonIndx",String.valueOf(lonIndx));
				param.put("latIndx",String.valueOf(latIndx));
				param.put("schema",schema);
				param.put("table",layerName);
				param.put("encoding",encoding);
				param.put("labelIndx",String.valueOf(labelIndx));
				
				boolean convertCheck = appFileUploadService.csvToPostgresqlTbl(param);
				
				int status=400;
				
				if(convertCheck) {
					if(pid == 33) {
						//CCTV
						String[] column = {"alt numeric NULL DEFAULT '-1'::integer",
				                   "model varchar(100) NULL DEFAULT 'CCTV_1'::character varying",
				                   "model_type varchar(100) NULL DEFAULT 'CCTV'::character varying",
				                   "width numeric NULL DEFAULT 40.0",
				                   "height numeric NULL DEFAULT 40.0",
				                   "direction numeric NULL DEFAULT 0.0",
				                   "view_x numeric NULL DEFAULT 45.0",
				                   "view_y numeric NULL DEFAULT 45.0",
				                   "view_tilt numeric NULL DEFAULT 45.0",
				                   "view_range numeric NULL DEFAULT 50.0",
				                   "view_color varchar(100) NULL DEFAULT '#ffff00'::character varying",
				                   "view_opacity numeric NULL DEFAULT 50.0"};
						HashMap<String, Object> columnParam = new HashMap<>();
						columnParam.put("SCHEMA",schema);
						columnParam.put("TABLE",layerName);
						columnParam.put("COLUMNS",column);
						appsService.addCsvItemTableColumns(columnParam);
					}
					status=200;
					model.addAttribute("LAYER_NAME", schema+":"+layerName);
					model.addAttribute("LABEL", labelColumn);
				}
				
				model.addAttribute("STATUS", status);
			}
		}
		catch (RuntimeException e) {
			logger.error("FILE ERROR-RuntimeException");
		}
		catch (Exception e) {
			logger.error("FILE ERROR");
		}
		
		return "jsonView";
	} 
	
	@RequestMapping(value="/appCsv/test.do",method=RequestMethod.POST)
	public String test(Model model, HttpServletRequest request) {
		String schema=request.getParameter("schema");
		String layerName=request.getParameter("layerName");
		String[] column = {"alt numeric NULL DEFAULT '-1'::integer",
                   "model varchar(100) NULL DEFAULT 'CCTV_1'::character varying",
                   "model_type varchar(100) NULL DEFAULT 'CCTV'::character varying",
                   "width numeric NULL DEFAULT 40.0",
                   "height numeric NULL DEFAULT 40.0",
                   "direction numeric NULL DEFAULT 0.0",
                   "view_x numeric NULL DEFAULT 45.0",
                   "view_y numeric NULL DEFAULT 45.0",
                   "view_tilt numeric NULL DEFAULT 45.0",
                   "view_range numeric NULL DEFAULT 50.0",
                   "view_color varchar(100) NULL DEFAULT '#ffff00'::character varying",
                   "view_opacity numeric NULL DEFAULT 50.0"};
		HashMap<String, Object> columnParam = new HashMap<>();
		columnParam.put("SCHEMA",schema);
		columnParam.put("TABLE",layerName);
		columnParam.put("COLUMNS",column);
		appsService.addCsvItemTableColumns(columnParam);
		return "jsonView";
		
	}
		
	@RequestMapping(value="/appCsv/encoding.do",method=RequestMethod.POST)
	public String checkCsvEncodingCheck(Model model, HttpServletRequest request) {
		
		String encoding = request.getParameter("encoding");
		int acid = Integer.parseInt(request.getParameter("ACID"));
		
		CsvVO vo = appFileUploadService.getCsvFileInfo(acid);
		
		String path = vo.getFile_path();
		String fileName = vo.getFile_name();
		
		try {
			
			HashMap<String, Object> list = readCsvFileService.getCsvSampleRecordCharsetList(path+fileName, 5, encoding);
			model.addAttribute("SAMPLE", list);
			
		}
		catch (RuntimeException e) {
			logger.error("FILE ERROR-RuntimeException");
		}
		catch (Exception e) {
			logger.error("FILE ERROR");
		}
		
		return "jsonView";
	}

	@RequestMapping(value="/appCsv/getCsvUploadList.do",method=RequestMethod.POST)
	public String getUploadList(Model model, HttpServletRequest request) {
		HttpSession session = request.getSession(true);
		SessionVO sessionVO = new SessionVO();
		sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");
		
		int mid = sessionVO.getSessMid();
		int pid = Integer.parseInt(request.getParameter("PID"));
		HashMap<String, Object> param = new HashMap<>();
		param.put("MID", mid);
		param.put("PID", pid);
		try {
				
			List<HashMap<String, String>> uploadList = appsService.getCsvUploadList(param);
			
			model.addAttribute("uploadList", uploadList);
			
		}
		catch (RuntimeException e) {
			logger.error("SELECT ERROR-RuntimeException");
		}
		catch (Exception e) {
			logger.error("SELECT ERROR");
		}
		
		return "jsonView";
	}

	@RequestMapping(value="/appCsv/loadCsvInfo.do",method=RequestMethod.POST)
	public String loadCsvInfo(Model model, HttpServletRequest request) {
		
		try {
			
			if(request.getParameterMap().containsKey("ACID")) {
				int acid = Integer.parseInt(request.getParameter("ACID"));
				
				CsvVO vo = appFileUploadService.getCsvFileInfo(acid);
				model.addAttribute("uploadInfo", vo);
				
				HashMap<String, Object> list = new HashMap<>();
				String path = vo.getFile_path();
				String fileName= vo.getFile_name();

				list=readCsvFileService.getCsvSampleRecordCharsetList(path+fileName, 5, "EUC-KR");
				model.addAttribute("SAMPLE", list);
			}
			
			if(request.getParameterMap().containsKey("DATAID")) {
				int dataid = Integer.parseInt(request.getParameter("DATAID"));
				
				HashMap<String, Object> params = new HashMap<>();
				params.put("dataid",dataid);
				
				MapsDataVO mapVO = mapdataService.getMapDataInfoWithParam(params);
				model.addAttribute("dataInfo", mapVO);
				
				List<HashMap<String, String>> fileInfo = mapdataService.getMemFileInfoWithParam(params);
				String fileDir = fileInfo.get(0).get("FILE_PATH");
				String fileName = fileInfo.get(0).get("FILE_NAME").split("\\.")[0];
				
				String encoding = mapVO.getData_encoding();
				if(encoding == null || encoding == "") encoding = "EUC-KR";
				HashMap<String, Object> list = new HashMap<>();
				list=readCsvFileService.getCsvSampleRecordCharsetList(fileDir+fileName+".csv", 5, encoding);
				model.addAttribute("SAMPLE", list);
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
	
	@RequestMapping(value="/appCsv/loadUploadCsvItemList.do",method=RequestMethod.POST)
	public String loadUploadCsvItemList(Model model, HttpServletRequest request) {
		HttpSession session = request.getSession(true);
		SessionVO sessionVO = new SessionVO();
		sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");
		
		int mid = sessionVO.getSessMid();
		int acid = Integer.parseInt(request.getParameter("ACID"));

		CsvVO vo = appFileUploadService.getCsvFileInfo(acid);
		
		String type = vo.getType();
		String layer_name = vo.getLayer_name();

		try {

			HashMap<String, Object> param = new HashMap<>();
			String[] array = layer_name.split(":");
			String schema = array[0];
			schema = StringEscapeUtils.escapeSql(schema);
			
			String table = array[1];
			table = StringEscapeUtils.escapeSql(table);
			
			param.put("MID", mid);
			param.put("ACID", acid);
			param.put("LAYER_NAME", layer_name);
			param.put("SCHEMA", schema);
			param.put("TABLE", table);
			List<CsvVO> uploadInfo= appsService.loadUploadCsvItemListForCsv(param);
			model.addAttribute("uploadInfoItem", uploadInfo);

		}
		catch (RuntimeException e) {
			logger.error("SELECT ERROR-RuntimeException");
		}
		catch (Exception e) {
			logger.error("SELECT ERROR");
		}
		
		return "jsonView";
	}

	@RequestMapping(value="/appCsv/loadUploadCsvItemListToMap.do",method=RequestMethod.POST)
	public String loadUploadCsvItemListToMap(Model model, HttpServletRequest request) {
		
		HttpSession session = request.getSession(true);
		SessionVO sessionVO = new SessionVO();
		sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");
		
		int mid = sessionVO.getSessMid();

		try {
			
			if(!request.getParameter("ACID").equals(null) && !request.getParameter("ACID").equals("")) {
				int acid = Integer.parseInt(request.getParameter("ACID"));
				CsvVO vo = appFileUploadService.getCsvFileInfo(acid);
				
				String type = vo.getType();
				String layer_name = vo.getLayer_name();

				HashMap<String, Object> param = new HashMap<>();
				String[] array = layer_name.split(":");
				String schema = array[0];
				schema = StringEscapeUtils.escapeSql(schema);
				
				String table = array[1];
				table = StringEscapeUtils.escapeSql(table);
				
				param.put("MID", mid);
				param.put("ACID", acid);
				param.put("LAYER_NAME", layer_name);
				param.put("SCHEMA", schema);
				param.put("TABLE", table);
				param.put("COLUMN","N/A");
				param.put("KEYWORD",null);
				List<HashMap<String, Object>> uploadInfo= appsService.loadUploadCsvItemListForCsvToMap(param);
				
				model.addAttribute("uploadInfo", uploadInfo);
				param.put("DB",schema);

				List<String> headers = null;
				headers = csvPropertiesService.getHeaderProperties(param);
				model.addAttribute("uploadHeaders", headers);
				
			} else {
				int dataid = Integer.parseInt(request.getParameter("DATAID"));
				
				HashMap<String, Object> params = new HashMap<>();
				params.put("dataid",dataid);
				
				MapsDataVO mapVO = mapdataService.getMapDataFromParam(params);
				
				String schema = mapVO.getCsv_db_name();
				String table = mapVO.getCsv_layer_name();
				
				HashMap<String, Object> param = new HashMap<>();
			
				
				param.put("MID", mid);
				param.put("DATAID", dataid);
				param.put("LAYER_NAME", table+":"+schema);
				param.put("SCHEMA", schema);
				param.put("DB", schema);
				param.put("TABLE", table);
				param.put("COLUMN","N/A");
				param.put("KEYWORD",null);
				
				List<HashMap<String, Object>> uploadInfo= appsService.loadUploadCsvItemListForCsvToMap(param);
				
				
				model.addAttribute("uploadInfo", uploadInfo);
				param.put("DB",schema);

				List<String> headers = null;
				headers = csvPropertiesService.getHeaderProperties(param);
				model.addAttribute("uploadHeaders", headers);
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
	@RequestMapping(value="/appCsv/getStatsQueryList.do",method=RequestMethod.POST)
	public String getStatsQueryList(Model model, HttpServletRequest request) {
		
		String type = request.getParameter("TYPE");
		String area_type = request.getParameter("AREA_TYPE");
		String[] column = request.getParameterValues("COLUMNS[]");
		String[] data_column = request.getParameterValues("DATA_COLUMNS[]");
		String[] polygon = request.getParameterValues("POLYGON[]");
		

		HashMap<String, Object> param = new HashMap<>();
		
		if(!type.equals(null) && type.equals("court")) {
			param.put("AREA_TYPE", area_type);
			if(polygon == null || polygon.length == 0 || (polygon.length > 0 && polygon[0].equals(""))) param.put("POLYGON", "11000");
			else param.put("POLYGON", polygon[0]);
		}else {
			param.put("POLYGON", polygon);
		}
		if(data_column != null) {
			param.put("DATA_COLUMNS", data_column);
		}

		param.put("COLUMNS", column);
		param.put("TYPE", type);
		
		String layer_name = "";
		
		if(!request.getParameter("ACID").equals(null) && !request.getParameter("ACID").equals("")) {
			int acid = Integer.parseInt(request.getParameter("ACID"));
				
			CsvVO vo = appFileUploadService.getCsvFileInfo(acid);
			
			layer_name = vo.getLayer_name();
			
			String[] array = layer_name.split(":");
			String schema = array[0];
			schema = StringEscapeUtils.escapeSql(schema);
			
			String table = array[1];
			table = StringEscapeUtils.escapeSql(table);
			
			param.put("SCHEMA", schema);
			param.put("TABLE", table);
			
		} else {
			int dataid = Integer.parseInt(request.getParameter("DATAID"));
			
			if(!type.equals(null) && type.equals("court")) {
				param.put("AREA_TYPE", area_type);
				if(polygon == null || polygon.length == 0 || (polygon.length > 0 && polygon[0].equals(""))) param.put("POLYGON", "11000");
				else param.put("POLYGON", polygon[0]);
			}else {
				param.put("POLYGON", polygon);
			}
			if(data_column != null) {
				param.put("DATA_COLUMNS", data_column);
			}		
			
			
			HashMap<String, Object> params = new HashMap<>();
			params.put("dataid",dataid);
			
			MapsDataVO mapVO = mapdataService.getMapDataFromParam(params);
			
			String schema = mapVO.getCsv_db_name();
			String table = mapVO.getCsv_layer_name();
		
			param.put("SCHEMA", schema);
			param.put("TABLE", table);
			
		}

		try {

			List<HashMap<String, Object>> list = appsService.getStatsQueryList(param);
			
			model.addAttribute("queryList", list);
		}
		catch (RuntimeException e) {
			logger.error("SELECT ERROR-RuntimeException");
		}
		catch (Exception e) {
			logger.error("SELECT ERROR");
		}
		
		return "jsonView";
	}
	
	@RequestMapping(value="/appCsv/deleteCsvUpload.do",method=RequestMethod.POST)
	public String deleteCsvUpload(Model model, HttpServletRequest request) {
		HttpSession session = request.getSession(true);
		SessionVO sessionVO = new SessionVO();
		sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");
		
		int mid = sessionVO.getSessMid();
		int acid = Integer.parseInt(request.getParameter("ACID"));
		
		CsvVO vo = appFileUploadService.getCsvFileInfo(acid);
		
		String type = vo.getType();
		String layer_name = vo.getLayer_name();
		
		String file_name = vo.getFile_name();
		String file_path = vo.getFile_path();

		model.addAttribute("rs", "fail");
		try {
			int projectList = 0;
			int project = appsService.deleteCsvUpload(acid);
			if(!layer_name.equals(null)) {
				String[] array = layer_name.split(":");
				String schema = array[0];
				String table = array[1];
				projectList = appsService.deleteCsvUploadInfoForCsv(schema+"."+table);
			}
			
			if(project > 0 && projectList > 0) {
				model.addAttribute("rs", "complete");
			}
			
			if(type.equals("C")) {
				if(file_path != null) file_path = file_path.replaceAll("\\.", "").replaceAll("\\\\", "").replaceAll("&", "");
				if(file_name != null) file_name = file_name.replaceAll("/", "").replaceAll("\\\\", "");
				File f = new File(file_path+file_name);
				
				if(f.exists()) {
					if(f.delete()){
						
					} else {
						
					}
				}
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
	@RequestMapping(value="/appCsv/updateCsvUploadInfo.do",method=RequestMethod.POST)
	public String updateCsvUploadInfo(Model model, HttpServletRequest request) {
		HttpSession session = request.getSession(true);
		SessionVO sessionVO = new SessionVO();
		sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");
		
		int mid = sessionVO.getSessMid();

		String upload_name = request.getParameter("upload_name");
		int acid = Integer.parseInt(request.getParameter("ACID"));
		HashMap<String, Object> updateMap = new HashMap<>();
		updateMap.put("MID", mid);
		updateMap.put("ACID", acid);
		updateMap.put("UPLOAD_NAME", upload_name);
		
		model.addAttribute("rs", "fail");

		try {
			if(mid > 0) {
				int rs;
				rs = appsService.updateCsvUploadInfo(updateMap);
				
				if(rs == 1) {
					model.addAttribute("rs", "complete");
				}
			}
		}
		catch (RuntimeException e) {
			logger.error("UPDATE ERROR-RuntimeException");
		}
		catch (Exception e) {
			logger.error("UPDATE ERROR");
		}
		return "jsonView";
	}
	
	@RequestMapping(value="/appCsv/updateCsvUploadItem.do",method=RequestMethod.POST)
	public String updateProject(Model model, HttpServletRequest request) {
		HttpSession session = request.getSession(true);
		SessionVO sessionVO = new SessionVO();
		sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");
		
		int acid = Integer.parseInt(request.getParameter("ACID"));
		
		CsvVO vo = appFileUploadService.getCsvFileInfo(acid);
		
		String[] layerName = vo.getLayer_name().split(":");
		
		String schema = layerName[0];
		schema = StringEscapeUtils.escapeSql(schema);
		
		String table = layerName[1];
		table = StringEscapeUtils.escapeSql(table);
		int rs = -1;
		String itemList = request.getParameter("itemList");
		String[] deleteCctvItemList = request.getParameterValues("deleteCsvItemList[]");
		try {
			if(deleteCctvItemList != null) {
				for (int i = 0; i < deleteCctvItemList.length;i++) {
					HashMap<String, Object> param = new HashMap<>();
					param.put("schema",schema);
					param.put("table",table);
					param.put("dbpid",Integer.parseInt(deleteCctvItemList[i]));
					appsService.deleteCsvItem(param);
				}
			}

			if(itemList == null) {
				throw new NullPointerException();
			}else {
				itemList = org.springframework.web.util.HtmlUtils.htmlUnescape(itemList);
				String madData = itemList.replaceAll("&quot;", "\"").replaceAll("&apos;", "\'");
				
				JSONArray array = new JSONArray(madData.toString());  //json 배열
				List<Object> list = array.toList(); //Object를 지닌 배열
				ObjectMapper objectMapper = new ObjectMapper();

				for (int i = 0; i < list.size(); i++) {
					HashMap<String, Object> map = objectMapper.convertValue(list.get(i), HashMap.class);
					HashMap<String, Object> cctvItem = new HashMap<>();
					cctvItem.put("SCHEMA",schema);
					cctvItem.put("TABLE",table);
					
					cctvItem.put("LON",map.get("lon"));
					cctvItem.put("LAT",map.get("lat"));

					ArrayList<String> columns = new ArrayList<String> ();
					ArrayList<String> row = new ArrayList<String> ();
					for (Entry<String, Object> entrySet : map.entrySet()) {
						if(!entrySet.getKey().equals("lon") && !entrySet.getKey().equals("lat")) {
							columns.add(StringEscapeUtils.escapeSql(entrySet.getKey()));
							row.add(StringEscapeUtils.escapeSql(entrySet.getValue().toString()));
						}
			        }
					cctvItem.put("COLUMNS",columns);
					cctvItem.put("ROWS",row);
					rs = appsService.insertCsvItem(cctvItem);
				}
			}
		}
		catch (RuntimeException e) {
			logger.error("UPDATE ERROR-RuntimeException");
		}
		catch (Exception e) {
			logger.error("UPDATE ERROR");
		}
		

		model.addAttribute("rs", "complete");
		model.addAttribute("acid", vo.getAcid());
		return "jsonView";
	}
	
	@RequestMapping(value="/appCsv/shpLocationInfo.do",method=RequestMethod.POST)
	public String shpLocationInfo(Model model, HttpServletRequest request) {

		model.addAttribute("rs", "fail");
		
		String parent_code = request.getParameter("PARENT_CODE");
		String table = request.getParameter("TABLE");
		String column = request.getParameter("COLUMN");
		HashMap<String, Object> param = new HashMap<>();
		param.put("PARENT_CODE", parent_code);
		param.put("SCHEMA", "datamap");
		param.put("TABLE", table+"_emd");
		param.put("COLUMN", column);

		List<HashMap<String, Object>> list = appsService.getShpLocationInfo(param);
		model.addAttribute("rs", "complete");
		model.addAttribute("locationInfo", list);
		return "jsonView";
	}
	@RequestMapping(value="/appCsv/shpGeomInfo.do",method=RequestMethod.POST)
	public String shpGeomInfo(Model model, HttpServletRequest request) {
		
		model.addAttribute("rs", "fail");
		
		String parent_code = request.getParameter("PARENT_CODE");
		String table = request.getParameter("TABLE");
		String column = request.getParameter("COLUMN");
		HashMap<String, Object> param = new HashMap<>();
		param.put("SCHEMA", "datamap");
		param.put("TABLE", table);
		
		List<HashMap<String, Object>> list = appsService.getShpGeomInfo(param);
		List<HashMap<String, Object>> unionlist = appsService.getShpUnionGeomInfo(param);

		model.addAttribute("rs", "complete");
		model.addAttribute("shpList", list);
		model.addAttribute("shpUnionList", unionlist);
		return "jsonView";
	}
	@RequestMapping(value="/appCsv/saveCsvInfo.do",method=RequestMethod.POST)
	public String saveProject(Model model, HttpServletRequest request){
		HttpSession session = request.getSession(true);
		SessionVO sessionVO = new SessionVO();
		sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");

		int mid = sessionVO.getSessMid();
		
		CsvVO vo = new CsvVO();
		vo.setMid(sessionVO.getSessMid());
		vo.setType("P");
		int pid = Integer.parseInt(request.getParameter("pid"));
		vo.setPid(pid);
		int rs = appFileUploadService.insertCsvUploadInfo(vo);
		//업로드 성공
		if(rs != 0) {
			MemberVO memVO = new MemberVO();
			try {
				memVO.setMid(mid);
				memVO = memberService.getMemberInfo(memVO);
				
				String schema = memVO.getMem_geo_db().toLowerCase();
				schema = StringEscapeUtils.escapeSql(schema);
				
				String timeStamp = Long.toString(System.currentTimeMillis());
				String layerName= "apps_cctv_"+timeStamp;
				layerName = StringEscapeUtils.escapeSql(layerName);
				
				vo.setLayer_name(schema+":"+layerName);
				vo.setUpload_name(request.getParameter("uploadName"));
				
				rs =appFileUploadService.updateCsvInfo(vo);

				HashMap<String, Object> param = new HashMap<>();
				param.put("SCHEMA",schema);
				param.put("TABLE",layerName);
				String[] column = request.getParameterValues("column[]");
				 for(int i = 0; i < column.length; i++) {
					column[i] = org.springframework.web.util.HtmlUtils.htmlUnescape(column[i]);
					column[i] = column[i].replaceAll("&amp;", "&");
					column[i] = column[i].replaceAll("&apos;", "'");
					//column[i] = StringEscapeUtils.escapeSql(column[i]);
		        }
				param.put("COLUMNS",column);
				rs =appsService.createCsvItemTable(param);
				if(rs > -1) {
					String itemList = request.getParameter("itemList");
					if(itemList == null) {
						throw new NullPointerException();
					}else {
						itemList = org.springframework.web.util.HtmlUtils.htmlUnescape(itemList);
						String madData = itemList.replaceAll("&quot;", "\"").replaceAll("&apos;", "\'");
						
						JSONArray array = new JSONArray(madData.toString());  //json 배열
						List<Object> list = array.toList(); //Object를 지닌 배열
						ObjectMapper objectMapper = new ObjectMapper();

						for (int i = 0; i < list.size(); i++) {
							HashMap<String, Object> map = objectMapper.convertValue(list.get(i), HashMap.class);
							HashMap<String, Object> cctvItem = new HashMap<>();
							cctvItem.put("SCHEMA",schema);
							cctvItem.put("TABLE",layerName);
							
							cctvItem.put("LON",map.get("lon"));
							cctvItem.put("LAT",map.get("lat"));
							ArrayList<String> columns = new ArrayList<String> ();
							ArrayList<String> row = new ArrayList<String> ();
							for (Entry<String, Object> entrySet : map.entrySet()) {
								if(!entrySet.getKey().equals("lon") && !entrySet.getKey().equals("lat")) {
									columns.add(StringEscapeUtils.escapeSql(entrySet.getKey()));
									row.add(entrySet.getValue().toString());
								}
					        }
							cctvItem.put("COLUMNS",columns);
							cctvItem.put("ROWS",row);
							rs = appsService.insertCsvItem(cctvItem);
						}
					}
					if(rs == 1) {
						model.addAttribute("rs", "complete");
						model.addAttribute("acid", vo.getAcid());
					}
				}
			}
			catch (RuntimeException e) {
				logger.error("INSERT ERROR-RuntimeException");
			}
			catch (Exception e) {
				logger.error("INSERT ERROR");
			}
		}
		return "jsonView";
	}

	@RequestMapping(value="/appCsv/updateCsvItem.do",method=RequestMethod.POST)
	public String updateCctvProjectItem(Model model, HttpServletRequest request) {
		HttpSession session = request.getSession(true);
		SessionVO sessionVO = new SessionVO();
		sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");
		
		int acid = Integer.parseInt(request.getParameter("ACID"));
		int dbpid = Integer.parseInt(request.getParameter("DBPID"));
		
		CsvVO vo = appFileUploadService.getCsvFileInfo(acid);

		HashMap<String, Object> param = new HashMap<>();
		String[] array = vo.getLayer_name().split(":");
		String schema = array[0];
		schema = StringEscapeUtils.escapeSql(schema);
		
		String table = array[1];
		table = StringEscapeUtils.escapeSql(table);
		
		param.put("SCHEMA", schema);
		param.put("TABLE", table);
		param.put("DBPID", dbpid);
		HashMap<String, Object> itemInfo = new HashMap<>();
		HashMap<String, Object> itemParam = new HashMap<>();
		
		model.addAttribute("rs", "fail");
		try {
			itemInfo= appsService.loadUploadCsvItemForCsvToMap(param);
			double lon = Float.parseFloat(itemInfo.get("lon").toString());
			double lat = Float.parseFloat(itemInfo.get("lat").toString());

			itemParam.put("SCHEMA", schema);
			itemParam.put("TABLE", table);
			itemParam.put("LON", lon);
			itemParam.put("LAT", lat);
			
			itemParam.put("dbpid", dbpid);
			
			HashMap<String, Object> rows = new HashMap<>();
			String[] attr = request.getParameterValues("TYPE[]");
			String[] arrayParam = request.getParameterValues("VALUE[]");
			if(attr != null) {
				for(int i=0;i<attr.length;i++) {
					arrayParam[i] = org.springframework.web.util.HtmlUtils.htmlUnescape(arrayParam[i]);
					arrayParam[i] = arrayParam[i].replaceAll("&quot;", "\"").replaceAll("&apos;", "\'");
					if(attr[i] != "lon" && attr[i] != "lat") {
						rows.put(StringEscapeUtils.escapeSql(attr[i]), StringEscapeUtils.escapeSql(arrayParam[i]));
					}
				}
			}
			itemParam.put("ROWS", rows);
			
			int rs = appFileUploadService.updateCsvItemInfo(itemParam);

			if(rs == 1) {
				model.addAttribute("rs", "complete");
			}
		}
		catch (NullPointerException e) {
			logger.error("UPDATE ERROR-NullPointerException");
		}
		catch (RuntimeException e) {
			logger.error("UPDATE ERROR-RuntimeException");
		}
		catch (Exception e) {
			logger.error("UPDATE ERROR");
		}
		
		return "jsonView";
	}
	
	@RequestMapping(value="/appCsv/getShpBbox.do",method=RequestMethod.POST)
	public String getShpBbox(Model model, HttpServletRequest request) {
		
		model.addAttribute("rs", "fail");
		
		String parent_code = request.getParameter("PARENT_CODE");
		String table = request.getParameter("TABLE");
		HashMap<String, Object> param = new HashMap<>();
		param.put("SCHEMA", parent_code);
		param.put("TABLE", table);
		
		List<HashMap<String, Object>> unionlist = appsService.getShpBbox(param);
		
		model.addAttribute("rs", "complete");
		model.addAttribute("shpUnionList", unionlist);
		return "jsonView";
	}
}
