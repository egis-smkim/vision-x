package com.vision_x.vision_x.geocoding.web;

import java.io.File;
import java.io.IOException;
import java.net.Inet4Address;
import java.net.UnknownHostException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import org.apache.commons.compress.utils.FileNameUtils;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang.StringEscapeUtils;
import org.apache.commons.lang3.RandomStringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.vision_x.vision_x.csv.service.ReadCsvFileService;
import com.vision_x.vision_x.desk.mapdata.service.MapdataService;
import com.vision_x.vision_x.desk.mapdata.service.MapsDataVO;
import com.vision_x.vision_x.file.service.MultiFileUploadService;
import com.vision_x.vision_x.geocoding.service.CsvPoiService;
import com.vision_x.vision_x.geocoding.service.CsvPropertiesService;
import com.vision_x.vision_x.geocoding.service.GeocodingWorkerService;
import com.vision_x.vision_x.geocoding.service.MemPoiVO;
import com.vision_x.vision_x.member.service.MemberFileVO;
import com.vision_x.vision_x.member.service.MemberService;
import com.vision_x.vision_x.member.service.MemberVO;
import com.vision_x.vision_x.message.dto.CsvTopicMessage;
import com.vision_x.vision_x.message.service.TopicMessageService;
import com.vision_x.vision_x.model.service.ModelService;
import com.vision_x.vision_x.postgis.service.PostGisService;
import com.vision_x.vision_x.shp.service.ShapeService;
import com.vision_x.vision_x.storage.service.UserStorageService;
import com.vision_x.vision_x.storage.service.UserStorageVO;
import com.vision_x.vision_x.utils.PostGisCmdService;
import com.vision_x.vision_x.utils.ProjVO;
import com.vision_x.vision_x.utils.SessionVO;
import com.vision_x.vision_x.worker.service.ProgressWorkerService;
import com.vision_x.vision_x.worker.service.ProgressWorkerVO;
import com.vision_x.vision_x.worker.service.WorkerCSVItemVO;
import com.vision_x.vision_x.worker.service.WorkerService;

@Controller
public class GeocodingController{
	protected Logger logger = LoggerFactory.getLogger(this.getClass());
	@Value("#{globalInfo['Globals.env.mode']}")
	private String ENV_MODE;
	
	@Value("#{globalInfo['Globals.file.local.path']}")
	private String FILE_DIR; //로컬 경로
	
	@Value("#{globalInfo['Globals.file.server.path']}")
	private String FILE_SERVER_DIR; //파일 서버 경로
	
	@Value("#{globalInfo['Globals.hdfs.rootPath']}")
	private String HDFS_ROOT; // HDFS ROOT
	
	@Value("#{globalInfo['Globals.worker.dsid']}")
	private int dsid;
	
	@Resource(name="readCsvFileService")
	private ReadCsvFileService readCsvFileService;
	
	@Resource(name="mapdataService")
	private MapdataService mapdataService;
	
	@Resource(name="memberService")
	private MemberService memberService;
	
	@Resource(name="workerService")
	private WorkerService workerService;
	
	@Resource(name="geocodingWorkerSevice")
	private GeocodingWorkerService geocodingWorkerSevice;
	
	@Resource(name="csvPoiService")
	private CsvPoiService csvPoiService;
	
	@Resource(name="progressWorkerService")
	private ProgressWorkerService progressWorkerService;
	
	@Resource(name="csvPropertiesService")
	private CsvPropertiesService csvPropertiesService;
	
	@Resource(name="multiFileUploadService")
	private MultiFileUploadService multiFileUploadService;
	
	@Resource(name="shapeService")
	private ShapeService shapeService;
	
	@Resource(name="postGisCmdService")
	private PostGisCmdService postGisCmdService;
	
	@Resource(name="userStorageService")
	private UserStorageService userStorageService;
	
	@Resource(name="postGisService")
	private PostGisService postGisService;
	
	@Resource(name="modelService")
	private ModelService modelService;
	
	@Autowired
	TopicMessageService topicMessageService;
	
	private String HOST_IP = "";
	
	public GeocodingController() {
	
		try {
			this.HOST_IP =Inet4Address.getLocalHost().getHostName();
		}
		
		catch ( UnknownHostException e ) {
			logger.info("unknowhost exception");
		}
	}
	@RequestMapping(value="/geocoding/convertCsvData.do",method=RequestMethod.POST)
	public String convertCsvData(Model model, HttpServletRequest request) {
		
		HttpSession session = request.getSession(true);
		
		SessionVO sessionVO = new SessionVO();
		sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");
		
		int mid =sessionVO.getSessMid();
		MemberVO memVo = new MemberVO();
		int lon_indx = 0;
		int lat_indx = 0;
		int addr_indx = 0;
		int convert_type = 0;
		String convert_coord = "";
		
		try {
			
			memVo.setMid(mid);
			memVo = memberService.getMemberInfo(memVo);

			String DATAID=request.getParameter("DATAID");
			String geocodeType =request.getParameter("SERVER");
			String color =request.getParameter("HEXCOLOR");
			String areaType = request.getParameter("AREATYPE");
			String thumbImg = request.getParameter("THUMB");
			String desc = request.getParameter("DESC");
			String epsg = request.getParameter("EPSG");
			String POI_IMG_INDX=request.getParameter("POI_IMG_INDX");
			String dataName = request.getParameter("LAYERNAME");
			
			int markerType = Integer.parseInt(request.getParameter("MAKER_TYPE"));
			
			if(color == null) {
				color="";
			}
			String markerText = request.getParameter("MAKER_TITLE");
			int marker = -1;
			if(markerText != null && !markerText.equals("N/A"))	{
				marker = Integer.parseInt(request.getParameter("MAKER_TITLE"));
			}
			
			String encoding = request.getParameter("ENCODING");
			
			if(encoding == null || encoding.equals(""))  {
				//throw new NullPointerException();
				encoding="euc-kr";
			}
			
			HashMap<String, Object> params = new HashMap<>();
		
			params.put("dataid",DATAID);
			
			MemberFileVO memberVO = mapdataService.getMemberSingleFileInfoParam(params);
			MapsDataVO mapVO = mapdataService.getMapDataInfoWithParam(params);
			
			String fileName = memberVO.getFile_name();
			HashMap<String, Object> result = new HashMap<>();
			MapsDataVO mapdataVO = new MapsDataVO();
			
			double minx = Double.parseDouble(request.getParameter("minx"));
			double miny = Double.parseDouble(request.getParameter("miny"));
			double maxx = Double.parseDouble(request.getParameter("maxx"));
			double maxy = Double.parseDouble(request.getParameter("maxy"));
			
			int dataId = Integer.parseInt(DATAID);
			//데이터 ID
			mapdataVO.setFid(memberVO.getFid());
			mapdataVO.setDataid(dataId);
			mapdataVO.setPoi_color(color);
			mapdataVO.setArea_type(areaType);
			mapdataVO.setThumbnail_url(thumbImg);
			mapdataVO.setMinx(minx);
			mapdataVO.setMiny(miny);
			mapdataVO.setMaxx(maxx);
			mapdataVO.setMaxy(maxy);
			mapdataVO.setData_desc(desc);
			mapdataVO.setCoord_epsg(epsg);
			mapdataVO.setData_encoding(encoding);
			mapdataVO.setData_name(dataName);
			
			if((markerType==1 || markerType==2) && (POI_IMG_INDX !=null && !POI_IMG_INDX.equals("")) ) {	//이미지 //3DS
				int poiIndx = Integer.parseInt(POI_IMG_INDX);
				mapdataVO.setPoi_index(poiIndx);
			}
		
			mapdataVO.setPoi_type(markerType);

			if(geocodeType==null) throw new NullPointerException("NullPointerError-NullPointerException");
			
			if(geocodeType!=null&&geocodeType.equals("L")) {
				
				//경위도
				lon_indx = Integer.parseInt(request.getParameter("LON_INDX"));
				lat_indx = Integer.parseInt(request.getParameter("LAT_INDX"));
				
				//경도,위도
				mapdataVO.setCol_x(lon_indx);
				mapdataVO.setCol_y(lat_indx);
				
			}else if(geocodeType!=null&&geocodeType.equals("G")) {
				
				convert_type = 1;
				//지오코딩
				addr_indx =Integer.parseInt(request.getParameter("GEO_ADDR_INDX"));
				//지오코딩 주소 컬럼 인덱스
				mapdataVO.setCol_address(addr_indx);
			}else {
				convert_type = 2;
			}
			
			//지오코딩 타입 경위도, 지오코딩
			mapdataVO.setAddress_type(geocodeType);
			//마커 라벨 인덱스
			mapdataVO.setCol_label(marker);
			mapdataVO.setState(1);
			
			UserStorageVO userStorage = userStorageService.getUserStorageInfo(HOST_IP);
			// Add Khaia
			String targetPath="";
			String outputPath = "";
			String FILE_SERVER_DIR = userStorage.getMount_directory();
			String FILE_DIR = userStorage.getDir_url();

			if(ENV_MODE.equals("beta") || ENV_MODE.equals("prod") || ENV_MODE.equals("smd") || ENV_MODE.equals("ncp") || ENV_MODE.equals("kakao") ) {
				targetPath =FILE_SERVER_DIR+sessionVO.getSessMemId() + File.separator + "MAP_DATA" + File.separator +"csv"+File.separator+memberVO.getFile_name();
				outputPath = FILE_SERVER_DIR+sessionVO.getSessMemId() + File.separator + "MAP_DATA" + File.separator +"csv"+File.separator+DATAID;
			} else {
				targetPath = FILE_DIR+"userData"+File.separator+"seoul" + File.separator+"userData"+File.separator + sessionVO.getSessMemId() + File.separator + "MAP_DATA" + File.separator +"csv"+File.separator+memberVO.getFile_name();
				outputPath = FILE_DIR+sessionVO.getSessMemId() + File.separator + "MAP_DATA" + File.separator +"csv"+File.separator+DATAID+File.separator;
			}
			
			mapdataVO.setMeta_out_path(outputPath);
			//mapdataVO.setMeta_out_url(outputUrl);
			
			String tableName = memberVO.getFile_name().split("\\.")[0];
			mapdataVO.setCsv_db_name(tableName);
			
			int rs = mapdataService.updateCsvWithConverter(mapdataVO);
			
			//message 보내기
			
			String generatedString = RandomStringUtils.random(10, true, false);
			String subscribe = "csv/convert/"+generatedString;
			
			//좌표 변환 좌표 추출
			Pattern pattern = Pattern.compile("EPSG:(\\d+)");
			Matcher matcher = pattern.matcher(epsg);
			ProjVO pvo = new ProjVO();
			int coord = 4326;
			if(matcher.find()) {
				coord = Integer.parseInt(matcher.group(1));
				pvo = postGisService.getPrjWktInfo(coord);	
				convert_coord = pvo.getSrtext();

			}else {
				logger.warn("Invalid EPSGE code : "+ epsg);
			}

	        
			CsvTopicMessage csvMsg = new CsvTopicMessage();
			csvMsg.setInputPath(targetPath);
			csvMsg.setEncoding(encoding);
			csvMsg.setLonIndx(lon_indx);
			csvMsg.setLatIndx(lat_indx);
			csvMsg.setAddressIndx(addr_indx);
			csvMsg.setSchema(memVo.getMem_geo_db().toLowerCase());
			csvMsg.setTable(tableName);
			csvMsg.setSubscribe(subscribe);
			csvMsg.setType(convert_type);
			csvMsg.setsrText(convert_coord);
			csvMsg.setEpsgCode(coord);
			
			
			boolean sender = topicMessageService.sendCsvConverter(csvMsg);
			
			int status=404;
			
			if(rs != 0 && sender) {
				status = 200;
			}
			
			model.addAttribute("LAYER_NAME", fileName.split("\\.")[0]);
			model.addAttribute("DATA_NAME", mapVO.getData_name());
			model.addAttribute("DATAID", mapVO.getDataid());
			model.addAttribute("THUMB", mapdataVO.getThumbnail_url());
			model.addAttribute("POI_TYPE", mapdataVO.getPoi_type());
			model.addAttribute("POI_INDEX", mapdataVO.getPoi_index());
			model.addAttribute("STATUS", status);
			model.addAttribute("TOPIC", subscribe);
			
		}
		
		catch (RuntimeException e) {
			logger.error("CSV ERROR-RuntimeException");
		}
		catch (Exception e) {
			logger.error("CSV ERROR");
		}
		
		return "jsonView";
	}
	@RequestMapping(value="/geocoding/getCsvRecordsView.do",method=RequestMethod.POST)
	public String getCsvRecordsView(Model model, HttpServletRequest request) {
		
		HttpSession session = request.getSession(true);
		
		SessionVO sessionVO = new SessionVO();
		sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");
		
		int mid =sessionVO.getSessMid();
		MemberVO memVo = new MemberVO();
		try {
			memVo.setMid(mid);
			memVo = memberService.getMemberInfo(memVo);

			String DATAID=request.getParameter("DATAID");
			String geocodeType =request.getParameter("SERVER");
			String color =request.getParameter("HEXCOLOR");
			String areaType = request.getParameter("AREATYPE");
			String thumbImg = request.getParameter("THUMB");
			String desc = request.getParameter("DESC");
			String epsg = request.getParameter("EPSG");
			String POI_IMG_INDX=request.getParameter("POI_IMG_INDX");
			String dataName = request.getParameter("LAYERNAME");
			
			int markerType = Integer.parseInt(request.getParameter("MAKER_TYPE"));
			
			if(color == null) {
				color="";
			}
			String markerText = request.getParameter("marker");
			int marker = -1;
			if(markerText != null && !markerText.equals("N/A"))	{
				marker = Integer.parseInt(request.getParameter("marker"));
			}
			
			String encoding = request.getParameter("ENCODING");
			
			if(encoding == null || encoding.equals(""))  {
				//throw new NullPointerException();
				encoding="euc-kr";
			}
			
			HashMap<String, Object> params = new HashMap<>();
		
			params.put("dataid",DATAID);
			
			MemberFileVO memberVO = mapdataService.getMemberSingleFileInfoParam(params);
			MapsDataVO mapVO = mapdataService.getMapDataInfoWithParam(params);
			
			String fileName = memberVO.getFile_name();
			HashMap<String, Object> result = new HashMap<>();
			MapsDataVO mapdataVO = new MapsDataVO();
			WorkerCSVItemVO csvVo = new WorkerCSVItemVO();
			
			double minx = Double.parseDouble(request.getParameter("minx"));
			double miny = Double.parseDouble(request.getParameter("miny"));
			double maxx = Double.parseDouble(request.getParameter("maxx"));
			double maxy = Double.parseDouble(request.getParameter("maxy"));
			
			int dataId = Integer.parseInt(DATAID);
			//데이터 ID
			mapdataVO.setFid(memberVO.getFid());
			mapdataVO.setDataid(dataId);
			mapdataVO.setPoi_color(color);
			mapdataVO.setArea_type(areaType);
			mapdataVO.setThumbnail_url(thumbImg);
			mapdataVO.setMinx(minx);
			mapdataVO.setMiny(miny);
			mapdataVO.setMaxx(maxx);
			mapdataVO.setMaxy(maxy);
			mapdataVO.setData_desc(desc);
			mapdataVO.setCoord_epsg(epsg);
			mapdataVO.setData_encode(encoding);
			mapdataVO.setData_name(dataName);
			
			if((markerType==1 || markerType==2) && (POI_IMG_INDX !=null && !POI_IMG_INDX.equals("")) ) {	//이미지 //3DS
				
				int poiIndx = Integer.parseInt(POI_IMG_INDX);
				mapdataVO.setPoi_index(poiIndx);
				
			}
		
			mapdataVO.setPoi_type(markerType);

			csvVo.setFid(memberVO.getFid());
			csvVo.setMid(mid);
			csvVo.setDataid(dataId);
			csvVo.setPoi_color(color);
			csvVo.setPoi_type(markerType);
			csvVo.setCsv_path(memberVO.getFile_path()+memberVO.getFile_name());
			csvVo.setEncoding(encoding);
			csvVo.setEpsg_code(epsg);
			csvVo.setDsid(dsid);
			
			if(geocodeType==null) throw new NullPointerException("NullPointerError-NullPointerException");
			
			if(geocodeType!=null&&geocodeType.equals("L")) {
				//경위도
				int lon_indx = Integer.parseInt(request.getParameter("LON_INDX"));
				int lat_indx = Integer.parseInt(request.getParameter("LAT_INDX"));
				
				//경도,위도
				mapdataVO.setCol_x(lon_indx);
				mapdataVO.setCol_y(lat_indx);
				
				csvVo.setLon_index(lon_indx);
				csvVo.setLat_index(lat_indx);
				
			}else if(geocodeType!=null&&geocodeType.equals("G")) {
				//지오코딩
				int addr_indx =Integer.parseInt(request.getParameter("GEO_ADDR_INDX"));
				//지오코딩 주소 컬럼 인덱스
				mapdataVO.setCol_address(addr_indx);
				csvVo.setAddress_index(addr_indx);
			}
			
			//지오코딩 타입 경위도, 지오코딩
			mapdataVO.setAddress_type(geocodeType);
			//마커 라벨 인덱스
			mapdataVO.setCol_label(marker);
			mapdataVO.setState(1);
			
			//csvVo.setAddr_type(geocodeType);
			csvVo.setTitle_index(marker);
			
			// Add Khaia
			String targetPath="";
			String targetUrl="";
			String outputPath = "";
			String outputUrl="";
			
			UserStorageVO userStorage = userStorageService.getUserStorageInfo(HOST_IP);
			String FILE_SERVER_DIR = userStorage.getMount_directory();
			String FILE_DIR = userStorage.getDir_url();

			if(ENV_MODE.equals("beta") || ENV_MODE.equals("prod") || ENV_MODE.equals("smd") || ENV_MODE.equals("alpha") || ENV_MODE.equals("dev2")) {
				
				//targetPath = "/mnt"+FILE_SERVER_DIR+sessionVO.getSessMemId() + File.separator + "MAP_DATA" + File.separator +"csv"+File.separator+"logs"+File.separator;
				targetPath =FILE_SERVER_DIR+sessionVO.getSessMemId() + File.separator + "MAP_DATA" + File.separator +"csv"+File.separator+memberVO.getFile_name()+".progress";
				//targetUrl =FILE_DIR+sessionVO.getSessMemId() + File.separator + "MAP_DATA" + File.separator +"csv"+File.separator+"logs"+File.separator;
				targetUrl =FILE_DIR+sessionVO.getSessMemId() + File.separator + "MAP_DATA" + File.separator +"csv"+File.separator+memberVO.getFile_name()+".progress";
				
				outputPath = FILE_SERVER_DIR+sessionVO.getSessMemId() + File.separator + "MAP_DATA" + File.separator +"csv"+File.separator+DATAID;
				outputUrl=FILE_DIR+sessionVO.getSessMemId() + File.separator + "MAP_DATA" + File.separator +"csv"+File.separator+DATAID;
				
			} else {
				
				targetPath = FILE_DIR+"userData" + File.separator + sessionVO.getSessMemId() + File.separator + "MAP_DATA" + File.separator +"csv"+File.separator+memberVO.getFile_name()+".progress";
				targetUrl =FILE_SERVER_DIR+sessionVO.getSessMemId() + File.separator + "MAP_DATA" + File.separator +"csv"+File.separator+memberVO.getFile_name()+".progress";
				
				outputPath = FILE_DIR+sessionVO.getSessMemId() + File.separator + "MAP_DATA" + File.separator +"csv"+File.separator+DATAID+File.separator;
			}
			
			mapdataVO.setMeta_out_path(outputPath);
			mapdataVO.setMeta_out_url(outputUrl);
			
			ProgressWorkerVO progressVO = new ProgressWorkerVO();
			progressVO.setDataid(Integer.parseInt(DATAID));
			progressVO.setStatus("1");
			progressVO.setProgress("0");
			
			int prgssRs = progressWorkerService.insertWaitingProcess(progressVO);
			
			csvVo.setOutput_path(outputPath);
			//postgresql schema명은 무조건 소문자
			csvVo.setDb_name(memVo.getMem_geo_db().toLowerCase());
			csvVo.setIs_two_column(geocodeType);
			csvVo.setProgress_path(targetPath);
			csvVo.setProgress_url(targetUrl);
			csvVo.setPid(progressVO.getPid());
			csvVo.setArea_type(areaType);
			
			String tableName = memberVO.getFile_name().split("\\.")[0];
			mapdataVO.setCsv_db_name(tableName);
			
			csvVo.setTbl_name(tableName);
			csvVo.setStatus("2");
		
			int rs = mapdataService.updateCsvWithConverter(mapdataVO);
			
			if(rs != 0) {
				//convertCSV database table update
				int csvRs = workerService.insertWorkerCSVItem(csvVo);
				
				if(csvRs != 0) {
					
					model.addAttribute("LAYER_NAME", fileName.split("\\.")[0]);
					model.addAttribute("DATA_NAME", mapVO.getData_name());
					model.addAttribute("DATAID", mapVO.getDataid());
					model.addAttribute("THUMB", mapdataVO.getThumbnail_url());
					model.addAttribute("POI_TYPE", mapdataVO.getPoi_type());
					model.addAttribute("POI_INDEX", mapdataVO.getPoi_index());
					
				}
			}
		}
		catch (SQLException e) {
			logger.error("CSV ERROR-SQLException");
		}
		catch (RuntimeException e) {
			logger.error("CSV ERROR-RuntimeException");
		}
		catch (Exception e) {
			logger.error("CSV ERROR");
		}

		return "jsonView";
		
	}
	
	@RequestMapping(value="/geocoding/updateConvert.do",method=RequestMethod.POST)
	public String updateConvertStatus(Model model, HttpServletRequest request) {
		
		String dataidStr = request.getParameter("dataId");
		int dataid= Integer.parseInt(dataidStr);
		
		int dataId = Integer.parseInt(request.getParameter("dataId"));
		int poiType = Integer.parseInt(request.getParameter("type"));
		int poiIndx = Integer.parseInt(request.getParameter("poiIndx"));
		
		String encoding = request.getParameter("encoding");
		
		HttpSession session = request.getSession(true);
		
		SessionVO sessionVO = new SessionVO();
		sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");
		
		int mid =sessionVO.getSessMid();
		
		HashMap<String, Object> param = new HashMap<>();
		param.put("DATAID", dataid);
		param.put("POI_TYPE",poiType);
		param.put("POI_INDEX",poiIndx);
		
		MapsDataVO mapsVO = new MapsDataVO();
		HashMap<String, Object> res = new HashMap<>();
		
		try {
			mapsVO = mapdataService.getMapCsvDataInfo(param);
		} catch (SQLException e2) {
			// TODO Auto-generated catch block
			e2.printStackTrace();
		}
		
		res.put("TILE_URL", mapsVO.getMeta_out_url());
		res.put("DATAID", request.getParameter("dataId"));
		res.put("TILE_URL", mapsVO.getMeta_out_url());
		res.put("DATA_NAME", mapsVO.getData_name());
		res.put("THUMB", mapsVO.getThumbnail_url());
		res.put("DATE", mapsVO.getReg_date());
		
		int labelIndx = mapsVO.getCol_label();
		
		HashMap<String, Object> params = new HashMap<>();
		params.put("dataid",dataId);
		
		MemberFileVO fileVO = mapdataService.getMemberSingleFileInfoParam(params);
		String csv_label = "";
		try {
		
			HashMap<String, Object> headers = readCsvFileService.getHeaderCharsetList(fileVO.getFile_path()+fileVO.getFile_name(), encoding);
			 
			List<String> headerInfo = (List)headers.get("HEADERS");
			 
			 csv_label = headerInfo.get(labelIndx);
			 
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		String layerName = fileVO.getFile_name().split("\\.")[0];
		
		MemberVO memVo = new MemberVO();
		memVo.setMid(mid);
		try {
			memVo = memberService.getMemberInfo(memVo);
		} catch (SQLException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		
		String workspace = memVo.getMem_geo_db().toLowerCase();
		
		res.put("LAYER_NAME", layerName);
		res.put("WORKSPACE", workspace);
		res.put("PROP", csv_label);
		
		res.put("POI_COLOR", mapsVO.getPoi_color());
		res.put("POI_TYPE", Integer.toString(mapsVO.getPoi_type()));
		res.put("POI_INDEX", Integer.toString(mapsVO.getPoi_index()));
		
		mapsVO.setCsv_layer_name(layerName);
		mapsVO.setCsv_db_name(memVo.getMem_geo_db().toLowerCase());
		mapsVO.setCoord_epsg("EPSG:4326");
		mapsVO.setState(10);
		
		int rs;
		try {
			rs = mapdataService.updateMapdataStatus(mapsVO);
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			rs = 0;
		}
		MemPoiVO pvo = csvPoiService.getMemberPoiInfo(dataId);
		
		String POI_FILE_URL="";
		String POI_TEXTURE_NAME="";
		String POI_FILE_NAME="";
		
		if(pvo != null) {
			 POI_FILE_URL=pvo.getPoi_file_url();
			 POI_TEXTURE_NAME=pvo.getPoi_texture_name();
			 POI_FILE_NAME=pvo.getPoi_file_name();
		}else {
			 POI_FILE_URL=mapsVO.getPoi_file_url();
			 POI_TEXTURE_NAME=mapsVO.getPoi_texture_name();
			 POI_FILE_NAME=mapsVO.getPoi_file_name();
		}
		
		
		//컬럼명
		
		res.put("POI_FILE_URL", POI_FILE_URL);
		res.put("POI_TEXTURE_NAME",POI_TEXTURE_NAME);
		res.put("POI_FILE_NAME", POI_FILE_NAME);
		res.put("AREA_TYPE", mapsVO.getArea_type());
		res.put("MINX",mapsVO.getMinx());
		res.put("MINY",mapsVO.getMiny());
		res.put("MAXX",mapsVO.getMaxx());
		res.put("MAXY",mapsVO.getMaxy());
		
		int status = 404;
		if(rs != 0) {
			status=200;
		}
		
		model.addAttribute("RS", res);
		model.addAttribute("status", status);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/geocoding/getProgress.do",method=RequestMethod.POST)
	public String getProgress(Model model, HttpServletRequest request) {
		
		int dataId = Integer.parseInt(request.getParameter("dataId"));
		int poiType = Integer.parseInt(request.getParameter("type"));
		int poiIndx = Integer.parseInt(request.getParameter("poiIndx"));
		
		HttpSession session = request.getSession();
		
		HashMap<String, Object> params = new HashMap<>();
		params.put("dataid",dataId);
		
		HashMap<String, Object> param = new HashMap<>();
		param.put("DATAID", dataId);
		param.put("POI_TYPE",poiType);
		param.put("POI_INDEX",poiIndx);
		
		try {
			
			WorkerCSVItemVO csvVO = new WorkerCSVItemVO();
			csvVO.setDataid(dataId);
			
			csvVO = workerService.getCsvWorker(csvVO);
			String percent="0";
			String centerLon = "";
			String centerLat ="";
			
			HashMap<String, Object> res = new HashMap<>();
			
			ProgressWorkerVO progressVO = progressWorkerService.getProgressInfoFromParam(params);
			if(progressVO != null) percent = progressVO.getProgress();
			
			int percentNum = (int) Float.parseFloat(percent);
			
			if(percentNum==100) {
				MapsDataVO mapsVO = mapdataService.getMapCsvDataInfo(param);
				
				res.put("TILE_URL", mapsVO.getMeta_out_url());
				res.put("DATAID", request.getParameter("dataId"));
				res.put("TILE_URL", mapsVO.getMeta_out_url());
				res.put("DATA_NAME", mapsVO.getData_name());
				res.put("THUMB", mapsVO.getThumbnail_url());
				res.put("DATE", mapsVO.getReg_date());
				res.put("COL", mapsVO.getCol_label());
				
				MemberFileVO fileVO = mapdataService.getMemberSingleFileInfoParam(params);
				
				String layerName = fileVO.getFile_name().split("\\.")[0];
				
				res.put("LAYER_NAME", layerName);
				res.put("POI_COLOR", mapsVO.getPoi_color());
				res.put("POI_TYPE", Integer.toString(mapsVO.getPoi_type()));
				res.put("POI_INDEX", Integer.toString(mapsVO.getPoi_index()));
				
				mapsVO.setCsv_layer_name(layerName);
				if(csvVO.getDb_name() != null) mapsVO.setCsv_db_name(csvVO.getDb_name());
				mapsVO.setCoord_epsg("EPSG:4326");
				mapsVO.setState(10);
				
				int rs = mapdataService.updateMapdataStatus(mapsVO);
				
				//dataid로 조회해서 null 이면 기존 mapsvo에서 있으면 사용자 테이블에서
				MemPoiVO pvo = csvPoiService.getMemberPoiInfo(dataId);
				
				String POI_FILE_URL="";
				String POI_TEXTURE_NAME="";
				String POI_FILE_NAME="";
				
				if(pvo != null) {
					 POI_FILE_URL=pvo.getPoi_file_url();
					 POI_TEXTURE_NAME=pvo.getPoi_texture_name();
					 POI_FILE_NAME=pvo.getPoi_file_name();
				}else {
					 POI_FILE_URL=mapsVO.getPoi_file_url();
					 POI_TEXTURE_NAME=mapsVO.getPoi_texture_name();
					 POI_FILE_NAME=mapsVO.getPoi_file_name();
				}
				
				res.put("PERCENT", percent);
				res.put("X", centerLon);
				res.put("Y", centerLat);
				res.put("POI_FILE_URL", POI_FILE_URL);
				res.put("POI_TEXTURE_NAME",POI_TEXTURE_NAME);
				res.put("POI_FILE_NAME", POI_FILE_NAME);
				res.put("AREA_TYPE", mapsVO.getArea_type());
				res.put("MINX",mapsVO.getMinx());
				res.put("MINY",mapsVO.getMiny());
				res.put("MAXX",mapsVO.getMaxx());
				res.put("MAXY",mapsVO.getMaxy());
				
				model.addAttribute("RS", res);
				model.addAttribute("INFO", mapsVO);
			}

			
			res.put("PERCENT",percent);
			model.addAttribute("RS", res);
						
		} catch (SQLException e) {
			logger.error("SQLError-SQLException");
		}
		return "jsonView";
	}
	
	@RequestMapping(value="/geocoding/getImgPoiList.do",method=RequestMethod.POST)
	public String get3dsPoiList(Model model, HttpServletRequest request) {
		
		String type=request.getParameter("type");
		
		model.addAttribute("LIST", csvPoiService.getImgPoiList(type));
		
		return "jsonView";
	}
	
	@RequestMapping(value="/geocoding/getPropertyList.do",method=RequestMethod.POST)
	public String getPropertyList(Model model, HttpServletRequest request) {
		
		int dataId= Integer.parseInt(request.getParameter("dataId"));
		HttpSession session = request.getSession(true);
		
		SessionVO sessionVO = new SessionVO();
		sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");
		
		int mid =sessionVO.getSessMid();

		
		MapsDataVO mapdataVo=null;
		List<String> headers = null;
		List<HashMap<String, Object>> records=null;
		try {
			MemberVO memVo = new MemberVO();
			
			HashMap<String, Object> params = new HashMap<>();
			params.put("dataid",dataId);
			
			memVo.setMid(mid);
			memVo = memberService.getMemberInfo(memVo);
			
			mapdataVo = mapdataService.getMapDataFromParam(params);
			String dataType = mapdataVo.getData_type();
			String schema = "";
			String table = "";
			HashMap<String, Object> param = new HashMap<>();
			if(dataType.equals("S")) {
				schema = mapdataVo.getShp_data_store_name();
				table = mapdataVo.getShp_table_name();
				records = modelService.getInitLists(mapdataVo);
				
			}else {
				schema = mapdataVo.getCsv_db_name();
				table = mapdataVo.getCsv_layer_name();
				schema = StringEscapeUtils.escapeSql(schema);
				table = StringEscapeUtils.escapeSql(table);
				
				param.put("TABLE",table);
				param.put("DB",schema);
				param.put("SIZE",0);
				records = csvPropertiesService.getInitRecords(param);
			}

			schema = StringEscapeUtils.escapeSql(schema);
			table = StringEscapeUtils.escapeSql(table);
			
			param.put("TABLE",table);
			param.put("DB",schema);
			param.put("SIZE",0);
			headers=csvPropertiesService.getHeaderProperties(param);
			
		} catch (SQLException e) {
			logger.error("SQLError-SQLException");
		}
		
		model.addAttribute("LAYER_NAME", mapdataVo.getData_name());
		model.addAttribute("HEADER", headers);
		model.addAttribute("LIST", records);
		model.addAttribute("SRC", mapdataVo.getDatadir_url());
		model.addAttribute("DATA_TYPE", mapdataVo.getData_type());
		
		return "jsonView";
	}
	
	@RequestMapping(value="/geocoding/getCsvPropsMore.do",method=RequestMethod.POST)
	public String getCsvPropsMore(Model model, HttpServletRequest request) {
		
		int dataId=Integer.parseInt(request.getParameter("dataId"));

		MapsDataVO mapdataVo=null;
		HttpSession session = request.getSession(true);
		
		HashMap<String, Object> params = new HashMap<>();
		params.put("dataid",dataId);
		
		try {
			mapdataVo = mapdataService.getMapDataFromParam(params);
			String pageNum = request.getParameter("pageNum");
			mapdataVo.setRecord_size(Integer.parseInt(pageNum));
			pageNum = StringEscapeUtils.escapeSql(pageNum);
			
			
			SessionVO sessionVO = new SessionVO();
			sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");
			
			int mid =sessionVO.getSessMid();
			MemberVO memVo = new MemberVO();
			memVo.setMid(mid);
			memVo = memberService.getMemberInfo(memVo);
			
			String csvTable = mapdataVo.getCsv_layer_name();
			csvTable = StringEscapeUtils.escapeSql(csvTable);
			String userDb = memVo.getMem_geo_db().toLowerCase();
			userDb = StringEscapeUtils.escapeSql(userDb);
			
			HashMap<String, Object> param = new HashMap<>();
			
			param.put("TABLE",csvTable);
			param.put("DB",userDb);
			param.put("SIZE",pageNum);
			
			List<HashMap<String, Object>> list = csvPropertiesService.getInitRecords(param);
			
			model.addAttribute("HEADER", csvPropertiesService.getHeaderProperties(param));
			model.addAttribute("PROPERTY", list);
			
		} catch (SQLException e) {
			logger.error("SQLError-SQLException");
		}
		
		return "jsonView";
	}
	
	@RequestMapping(value="/geocoding/getGeometryInfo.do",method=RequestMethod.POST)
	public String getGeometryInfo(Model model, HttpServletRequest request) {
		
		int dataId=Integer.parseInt(request.getParameter("dataId"));
		int dbpid = Integer.parseInt(request.getParameter("gid"));
		
		MapsDataVO mapdataVo=null;
		HttpSession session = request.getSession(true);
		
		HashMap<String, Object> params = new HashMap<>();
		params.put("dataid",dataId);
		
		try {
			mapdataVo = mapdataService.getMapDataFromParam(params);
			
			SessionVO sessionVO = new SessionVO();
			sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");
			
			int mid =sessionVO.getSessMid();
			
			MemberVO memVo = new MemberVO();
			memVo.setMid(mid);
			memVo = memberService.getMemberInfo(memVo);
			
			String csvTable = mapdataVo.getCsv_layer_name();
			csvTable = StringEscapeUtils.escapeSql(csvTable);
			
			String userDb = memVo.getMem_geo_db().toLowerCase();
			userDb = StringEscapeUtils.escapeSql(userDb);
			
			HashMap<String, Object> param = new HashMap<>();
			
			param.put("TABLE",csvTable);
			param.put("DB",userDb);
			param.put("dbpid",dbpid);
			
			HashMap<String, Object> result = csvPropertiesService.getGeometry(param);
			
			model.addAttribute("GEOMETRY", result);
			
		} catch (SQLException e) {
			logger.error("SQLError-SQLException");
		}
		
		return "jsonView";
	}
	
	@RequestMapping(value="/geocoding/searchProps.do",method=RequestMethod.POST)
	public String searchProps(Model model, HttpServletRequest request) {
		
		int dataId=Integer.parseInt(request.getParameter("dataId"));
		String keyword = request.getParameter("keyword");
		String column = request.getParameter("column");
		
		if(column == null) {
			return null;
		}
		
		column = StringEscapeUtils.escapeSql(column);
		
		MapsDataVO mapdataVo=null;
		
		HttpSession session = request.getSession(true);
		
		HashMap<String, Object> params = new HashMap<>();
		params.put("dataid",dataId);
		
		try {
			mapdataVo = mapdataService.getMapDataFromParam(params);
			
			SessionVO sessionVO = new SessionVO();
			sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");
			
			int mid =sessionVO.getSessMid();
			
			MemberVO memVo = new MemberVO();
			memVo.setMid(mid);
			memVo = memberService.getMemberInfo(memVo);
			
			String csvTable = mapdataVo.getCsv_layer_name();
			csvTable = StringEscapeUtils.escapeSql(csvTable);
			
			String userDb = memVo.getMem_geo_db().toLowerCase();
			userDb = StringEscapeUtils.escapeSql(userDb);
			
			HashMap<String, Object> param = new HashMap<>();
			
			param.put("TABLE",csvTable);
			param.put("DB",userDb);
			param.put("KEYWORD",keyword);
			param.put("COLUMN",column);
			List<HashMap<String, Object>> result = csvPropertiesService.searchProperty(param);
			
			model.addAttribute("HEADER", csvPropertiesService.getHeaderProperties(param));
			model.addAttribute("LIST", result);
			
		}catch(NullPointerException e) {
			logger.error("NullPointerException");
		}catch (SQLException e) {
			logger.error("SQLError-SQLException");
		}
		
		return "jsonView";
	}
	
	@RequestMapping(value="/geocoding/editProperties.do",method=RequestMethod.POST)
	public String editProperties(Model model, HttpServletRequest request) {
		
		int dataId=Integer.parseInt(request.getParameter("dataId"));
		
		String updateData = request.getParameter("data");
		String column = request.getParameter("column");
		
		int dbpid = Integer.parseInt(request.getParameter("gid"));
		
		MapsDataVO mapdataVo=null;
		HttpSession session = request.getSession(true);
		
		HashMap<String, Object> params = new HashMap<>();
		params.put("dataid",dataId);
		
		try {
			mapdataVo = mapdataService.getMapDataFromParam(params);
			
			SessionVO sessionVO = new SessionVO();
			sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");
			
			int mid =sessionVO.getSessMid();
			MemberVO memVo = new MemberVO();
			memVo.setMid(mid);
			memVo = memberService.getMemberInfo(memVo);
			
			String csvTable = mapdataVo.getCsv_layer_name();
			csvTable = StringEscapeUtils.escapeSql(csvTable);
			
			String userDb = memVo.getMem_geo_db().toLowerCase();
			userDb = StringEscapeUtils.escapeSql(userDb);
			
			column=StringEscapeUtils.escapeSql(column);
			
			HashMap<String, Object> param = new HashMap<>();
			
			param.put("TABLE",csvTable);
			param.put("DB",userDb);
			param.put("DATA",updateData);
			param.put("dbpid",dbpid);
			param.put("COLUMN",column);
			
			int rs = csvPropertiesService.updateData(param);
			
			String result="fail";
			
			if(rs!=0) {
				result="complete";
			}
			
			model.addAttribute("value", updateData);
			model.addAttribute("RS", result);
			
		} catch (SQLException e) {
			logger.error("SQLError-SQLException");
		}
		
		return "jsonView";
	}
	
	@RequestMapping(value="/geocoding/singleProperty.do",method=RequestMethod.POST)
	public String getSingleCsvProperty(Model model, HttpServletRequest request) {
		
		int dataId = Integer.parseInt(request.getParameter("dataid"));
		int objIndx = Integer.parseInt(request.getParameter("objIndx"));
		
		HashMap<String, Object> params = new HashMap<>();
		params.put("dataid",dataId);
		MapsDataVO mapdataVo = mapdataService.getMapDataFromParam(params);
		
		String csvTableName = mapdataVo.getCsv_layer_name();
		csvTableName = StringEscapeUtils.escapeSql(csvTableName);
		String dbSchema = mapdataVo.getCsv_db_name();
		dbSchema = StringEscapeUtils.escapeSql(dbSchema);
		
		HashMap<String, Object> param= new HashMap<>();
		param.put("table",csvTableName);
		param.put("schema",dbSchema);
		param.put("dbpid",objIndx);
		
		HashMap<String, Object> result = csvPropertiesService.getSingleProperty(param);
		
		if(result.get("dbpid") != null) {
			result.remove("dbpid");
		}
		
		if(result.get("geo") != null) {
			result.remove("geo");
		}
		
		if(result.get("geo_alt") != null) {
			result.remove("geo_alt");
		}
		
		int status=404;
		
		if(result != null) {
			status=200;
		}
		
		model.addAttribute("record", result);
		model.addAttribute("status", status);
		return "jsonView";
	}

	@RequestMapping(value="/geocoding/uploadModelFiles.do",method=RequestMethod.POST)
	public String uploadModelFiles( @RequestParam("texture") MultipartFile textureFile, @RequestParam("model") MultipartFile modelFile,Model model, HttpServletRequest request) {
		
		int dataId = Integer.parseInt(request.getParameter("dataid"));
		
		HttpSession session = request.getSession(true);
		
		SessionVO sessionVO = new SessionVO();
		sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");
		
		String MEM_ID= sessionVO.getSessMemId();
		String targetDir = "";
		String poiPath = dataId+"_poi";
		
		UserStorageVO userStorage = userStorageService.getUserStorageInfo(HOST_IP);
		String FILE_SERVER_DIR = userStorage.getMount_directory();
		//파일 업로드
		targetDir = FILE_SERVER_DIR + MEM_ID + File.separator + "MAP_DATA" + File.separator +"csv"+File.separator+poiPath+File.separator;
		
		multiFileUploadService.saveSingleFileToDirWithModel(textureFile,targetDir);
		multiFileUploadService.saveSingleFileToDirWithModel(modelFile,targetDir);
		
		MemPoiVO pvo = new MemPoiVO();
		pvo.setDataid(dataId);
		
		String textureOriginName= textureFile.getOriginalFilename();
		
		String modelOriginName = modelFile.getOriginalFilename();
		
		
		//String fileServerDir = FILE_DIR+sessionVO.getSessMemId()+"/MAP_DATA/csv/";
		
		String fileServerDir = "/userData/"+sessionVO.getSessMemId()+"/MAP_DATA/csv/"+poiPath+"/";
		
		String textureFileName=FileNameUtils.getBaseName(textureOriginName);
		String textureExt = "";
		String modelLowerName = "";
		if(FilenameUtils.getExtension(textureOriginName) != null) {
			textureExt = FilenameUtils.getExtension(textureOriginName).toLowerCase();
			modelLowerName = modelOriginName + FilenameUtils.getExtension(textureOriginName).toLowerCase();
		}
		
		String texturePath = targetDir+textureFileName+"."+textureExt;
		
		String modelPath = targetDir+modelOriginName;
		
		pvo.setPoi_texture_name(textureFileName+"."+textureExt);
		pvo.setPoi_file_name(modelLowerName);
		pvo.setPoi_texture_url(fileServerDir);
		pvo.setPoi_file_url(fileServerDir);
		pvo.setPoi_file_path(modelPath);
		pvo.setPoi_texture_path(texturePath);
		pvo.setPoi_type("3ds");
		
		int rs = csvPoiService.insertMemPoiInfo(pvo);
		
		int status=404;
		
		if(rs != 0) {
			status=200;
		}
		
		model.addAttribute("status", status);
		model.addAttribute("model", modelOriginName);
		model.addAttribute("texture", textureFileName+"."+textureExt);
		model.addAttribute("url", fileServerDir);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/geocoding/getExportCsvInfo.do",method=RequestMethod.POST)
	public String getExportCsvInfo(Model model, HttpServletRequest request) {
		
		int dataid=Integer.parseInt(request.getParameter("dataid"));
		MapsDataVO mapdataVo=null;
		HashMap<String, Object> params = new HashMap<>();
		params.put("dataid",dataid);
		
		mapdataVo=mapdataService.getMapDataFromParam(params);
		
		String csvTableName = mapdataVo.getCsv_layer_name();
		csvTableName = StringEscapeUtils.escapeSql(csvTableName);
		String dbSchema = mapdataVo.getCsv_db_name();
		dbSchema = StringEscapeUtils.escapeSql(dbSchema);
		
		String dataName=mapdataVo.getData_name();
		String epsgCode = mapdataVo.getCoord_epsg();
		
		/*
		 * 1.좌표계
		 * 2.데이터명
		 * 3.db 컬럼 리스트*/
		HashMap<String, String> param= new HashMap<>();
		param.put("table",csvTableName);
		param.put("schema",dbSchema);
		
		List<HashMap<String, String>> postTableInfo = shapeService.getColumnInfoList(param);
		
		//dbpid, geometry 컬럼 제거
		List<HashMap<String, String>> columnList = new ArrayList<>();
		
		for(HashMap<String, String> columns : postTableInfo) {
			
			if(!columns.get("column_name").equals("geo") && !columns.get("column_name").equals("geo_alt") && !columns.get("column_name").equals("dbpid")) {
				columnList.add(columns);
			}
			
		}
		
		int status=404;
		if(columnList.size() !=0 ) {
			status=200;
			
		}
		
		model.addAttribute("status", status);
		model.addAttribute("fields", columnList);
		model.addAttribute("dataName", dataName);
		model.addAttribute("epsg", epsgCode);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/geocoding/exportCsvDownload.do",method=RequestMethod.POST)
	public String exportCsvDownload(Model model, HttpServletRequest request) {
		
		HttpSession session = request.getSession(true);
		
		SessionVO sessionVO = new SessionVO();
		sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");
		
		String type = request.getParameter("format");
		String dataId = request.getParameter("dataId");
		//String reqProj = request.getParameter("prj");
		
		String columnLists = request.getParameter("props");
		String downloadFileName = request.getParameter("fileName");
		int dataid=Integer.parseInt(dataId);
		MapsDataVO mapdataVo=null;
		HashMap<String, Object> params = new HashMap<>();
		params.put("dataid",dataid);
		mapdataVo=mapdataService.getMapDataFromParam(params);
		
		String csvTableName = mapdataVo.getCsv_layer_name();
		csvTableName = StringEscapeUtils.escapeSql(csvTableName);
		String dbSchema = mapdataVo.getCsv_db_name();
		dbSchema = StringEscapeUtils.escapeSql(dbSchema);
		
		String thumbnail = mapdataVo.getThumbnail_url();
		
		UserStorageVO userStorage = userStorageService.getUserStorageInfo(HOST_IP);
		String FILE_SERVER_DIR = userStorage.getMount_directory();
		String targetDirUrl = userStorage.getDir_url();
		
		String targetDir = FILE_SERVER_DIR+ sessionVO.getSessMemId() + File.separator + "MAP_DATA" + File.separator +"csv"+File.separator+"export"+File.separator;
		String serverDir = targetDirUrl+sessionVO.getSessMemId()+"/MAP_DATA/csv/export/";
		HashMap<String, String> param = new HashMap<>();
		param.put("schema", dbSchema);
		param.put("table", csvTableName);
		param.put("geometryType", "POINT");
		param.put("columns", columnLists);
		param.put("columns", columnLists);
		
		param.put("t_fileDir", targetDir);
		param.put("download_file", downloadFileName+".shp");
		String exportShpFileName = postGisCmdService.exportCsvToShpFiles(param);
		
		model.addAttribute("DIR", serverDir+downloadFileName);
		model.addAttribute("FILE_NAME", downloadFileName);
		model.addAttribute("PROGRESS", serverDir+exportShpFileName);
		model.addAttribute("RECORDS", shapeService.getTotalRecords(param));
		model.addAttribute("THUMBNAIL_URL", thumbnail);
		
		return "jsonView";
	}
	
}
