package com.vision_x.vision_x.geoserver.web;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.net.Inet4Address;
import java.net.UnknownHostException;
import java.nio.charset.Charset;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import javax.validation.Valid;
import javax.xml.transform.TransformerException;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringEscapeUtils;
import org.apache.commons.lang.StringUtils;
import org.geotools.data.shapefile.dbf.DbaseFileReader;
import org.geotools.filter.text.cql2.CQLException;
import org.json.JSONArray;
import org.json.JSONObject;
import org.json.XML;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.vision_x.vision_x.admin.service.CoordService;
import com.vision_x.vision_x.desk.mapdata.service.MapDataRulesVO;
import com.vision_x.vision_x.desk.mapdata.service.MapdataRulesService;
import com.vision_x.vision_x.desk.mapdata.service.MapdataService;
import com.vision_x.vision_x.desk.mapdata.service.MapsDataVO;
import com.vision_x.vision_x.file.service.FileService;
import com.vision_x.vision_x.geocoding.service.GeocodingWorkerService;
import com.vision_x.vision_x.geoserver.service.GeoServerService;
import com.vision_x.vision_x.member.service.MemberService;
import com.vision_x.vision_x.member.service.MemberVO;
import com.vision_x.vision_x.postgis.service.PostGisService;
import com.vision_x.vision_x.shp.service.ShapeService;
import com.vision_x.vision_x.storage.service.UserStorageService;
import com.vision_x.vision_x.storage.service.UserStorageVO;
import com.vision_x.vision_x.utils.GeoToolsService;
import com.vision_x.vision_x.utils.PostGisCmdService;
import com.vision_x.vision_x.utils.ProjVO;
import com.vision_x.vision_x.utils.SLDService;
import com.vision_x.vision_x.utils.SessionVO;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

@Controller
public class GeoserverController {
	protected Logger logger = LoggerFactory.getLogger(this.getClass());
	@Resource(name="mapdataService")
	private MapdataService mapdataService;

	@Resource(name="geoServerService")
	private GeoServerService geoServerService;

	@Resource(name="memberService")
	private MemberService memberService;

	@Resource(name="shapeService")
	private ShapeService shapeService;

	@Resource(name="coordService")
	private CoordService coordService;

	@Resource(name="fileService")
	private FileService fileService;

	@Resource(name="postGisCmdService")
	private PostGisCmdService postGisCmdService;

	@Resource(name="geoToolsService")
	private GeoToolsService geoToolsService;

	@Resource(name="geocodingWorkerSevice")
	private GeocodingWorkerService geocodingWorkerSevice;

	@Resource(name="postGisService")
	private PostGisService postGisService;

	@Resource(name="mapdataRulesService")
	private MapdataRulesService mapdataRulesService;

	@Resource(name="userStorageService")
	private UserStorageService userStorageService;

	private String HOST_IP = "";

	public GeoserverController() {

		try {
			this.HOST_IP =Inet4Address.getLocalHost().getHostName();
		}

		catch ( UnknownHostException e ) {
			logger.info("unknowhost exception");
		}
	}

	@RequestMapping(value="/geodt/connectGeoserver.do",method=RequestMethod.POST)
	public String connectGeoserver2(Model model, HttpServletRequest request) {

		String DATAID = request.getParameter("DATAID");

		String proj = request.getParameter("PROJ");
		//String type=request.getParameter("TYPE");
		String layerName = request.getParameter("LAYERNAME");
		String epsgCode = request.getParameter("PROJ");

		//String shp3dCheck =request.getParameter("CHECk3D");

		String dbfCharset = request.getParameter("CHARSET");
		String geometryType = request.getParameter("GEO_TYPE");
		String thumbnail = request.getParameter("IMG_SRC");
		String shpDesc = request.getParameter("DESC");

		HttpSession session = request.getSession();

		HashMap<String, Object> params = new HashMap<>();
		params.put("dataid",DATAID);

		MapsDataVO mapdataVo = mapdataService.getMapDataInfoWithParam(params);

		HashMap<String, Object> result = new HashMap<>();
		HashMap<String, String>  shpResult=new HashMap<>();

		int mid = mapdataVo.getMid();

		try {
			MemberVO memVo = new MemberVO();
			memVo.setMid(mid);
			memVo = memberService.getMemberInfo(memVo);

			List<HashMap<String, String>> fileInfo = mapdataService.getMemFileInfoWithParam(params);

			//1. dbf 파일 이모지 체크
			String dbfFile="";
			String dir=fileInfo.get(0).get("FILE_PATH");
			String shpFile ="";

			for(int i=0;i<fileInfo.size();i++) {
				String fileExt= fileInfo.get(i).get("FILE_NAME").split("\\.")[1];

				if(fileExt.equals("dbf")) {
					dbfFile = fileInfo.get(i).get("FILE_NAME");
				}

				if(fileExt.equals("shp")) {
					shpFile = fileInfo.get(i).get("FILE_NAME");
				}

			}
			dbfFile = dbfFile.replaceAll("\\\\","").replaceAll ("&","");
			shpFile = shpFile.replaceAll("\\\\","").replaceAll ("&","");

			boolean dbfCheck = geoToolsService.dbfDataRegExclude(dir, dbfFile, dbfCharset);

			if(dbfCheck) {	//포함됨 2.dbf 파일 새로 생성하기

				boolean createDbf = geoToolsService.createRegExcloudeDbfFile(dir, dbfFile, dbfCharset);

				if(createDbf) {
					//postGis로 변경
					if(memVo.getMem_geo_db()==null) throw new NullPointerException();
					shpResult= postGisCmdService.shpToPostgresql(shpFile, dir, epsgCode,memVo.getMem_geo_db().toLowerCase(),dbfCharset);
				}else {
					model.addAttribute("ERROR", "404");
				}

			}else {
				//postgis로 변경
				if(memVo.getMem_geo_db()==null)throw new NullPointerException();
				shpResult= postGisCmdService.shpToPostgresql(shpFile, dir, epsgCode,memVo.getMem_geo_db().toLowerCase(),dbfCharset);
			}

			String shpTableName=shpResult.get("SHP_TABLE_NAME");

			int geotype=0;
			if(geometryType ==null) throw new NullPointerException();
			if(geometryType !=null) {
				if(geometryType.toLowerCase().equals("linestring")) {
					geotype=1;
				}else if(geometryType.toLowerCase().equals("polygon")) {
					geotype=2;
				}else if(geometryType.toLowerCase().equals("point")) {
					geotype=3;
				}else if(geometryType.toLowerCase().equals("multipoint")) {
					geotype=4;
				}else if(geometryType.toLowerCase().equals("multilinestring")) {
					geotype=5;
				}else if(geometryType.toLowerCase().equals("multipolygon")) {
					geotype=6;
				}else {
					geotype=7;
				}
			}

			HashMap<String, String> param = new HashMap<>();
			param.put("COORD_TYPE","");
			param.put("META_OUT_URL","");
			param.put("SHP_DATA_STORE_NAME",shpResult.get("SHP_DATA_STORE_NAME"));
			param.put("SHP_TABLE_NAME",shpResult.get("SHP_TABLE_NAME"));
			param.put("SHP_DATA_TYPE",Integer.toString(geotype));
			param.put("SHP_LAYER_FULLNAME","w_"+memVo.getMem_id()+":"+shpTableName);
			param.put("SHAPE_TYPE",geometryType.toLowerCase());
			param.put("POI_COLOR","");
			param.put("COORD_EPSG",proj);
			param.put("DATA_ENCODE",dbfCharset);
			param.put("DATA_DESC",shpDesc);
			param.put("DATA_NAME",layerName);
			param.put("DATAID",DATAID);
			param.put("THUMBNAIL_URL",thumbnail);

			int shpTableUpdate = mapdataService.updateShpTableName(param);

			if(shpTableUpdate != 0) {

				String shpTable = shpResult.get("SHP_TABLE_NAME");
				String workspace = memVo.getMem_id();
				String dataStore =shpResult.get("SHP_DATA_STORE_NAME");

				String check_workspace = geoServerService.checkWorkspace("w_"+workspace);

				if(check_workspace.equals("NONE")) { // workspace 존재하지 않을 경우

					String create_workspace = geoServerService.createWorkspace(workspace);

					result.put("workspace", workspace);
					if(create_workspace.equals("FAIL")) {
						logger.info("workspace 생성 실패 - geoserver 로그 확인");
					}
				}

				String check_dataStore = geoServerService.createDatasource(workspace, dataStore);

				if(!check_dataStore.equals("DONE")) {
					logger.info("dataStore 이미 존재");
				}

				result.put("datastore", dataStore);

				String check_layer = geoServerService.checkLayerExist(workspace, shpTable);

				if(check_layer.equals("NO")) {

					String create_layer = geoServerService.addShpLayer(workspace, dataStore, shpTable);

					if(create_layer.equals("OK")) {

						HashMap<String, String> serverInfo = geoServerService.geoServerInfo();

						result.put("url", serverInfo.get("url"));
						result.put("layer", shpTable.toLowerCase());
						result.put("layerName", layerName);
						result.put("workspace", "w_"+workspace);
						result.put("dataId", DATAID);

						HashMap<String, String> geoLayerInfo = geoServerService.layerJsonInfo(workspace, dataStore, shpTable.toLowerCase());

						result.put("layerInfo", geoLayerInfo);
						model.addAttribute("THUMB_IMG", thumbnail);
						model.addAttribute("SRS", proj);
						model.addAttribute("GEOMETRY",geometryType);
						model.addAttribute("DATE", mapdataVo.getReg_date());

						String layerInfoStr = geoLayerInfo.get("INFO");
						JSONObject jObject = new JSONObject(layerInfoStr);
						JSONObject objLonlatBound = jObject.getJSONObject("featureType");
						JSONObject boundObj = objLonlatBound.getJSONObject("latLonBoundingBox");

						double minx = boundObj.getDouble("minx");
						double miny = boundObj.getDouble("miny");
						double maxx = boundObj.getDouble("maxx");
						double maxy = boundObj.getDouble("maxy");

						MapsDataVO vo = new MapsDataVO();

						vo.setDataid(Integer.parseInt(DATAID));

						vo.setMinx(minx);
						vo.setMiny(miny);
						vo.setMaxx(maxx);
						vo.setMaxy(maxy);
						vo.setShp_url(serverInfo.get("url")+"/w_"+workspace+"/wms?");
						vo.setShp_layer_fullname("w_"+workspace+":"+shpTable.toLowerCase());
						vo.setCoord_epsg(proj);
						vo.setState(10);
						//상태값 10으로 업데이트하기
						mapdataService.updateMapdataStatus(vo);

						model.addAttribute("GEOSERVER", result);

					}

				}
			}
			/*else {
				HashMap<String, String> serverInfo = geoServerService.geoServerInfo();

				HashMap<String, String> geoLayerInfo = geoServerService.layerJsonInfo(workspace, dataStore, shpTable.toLowerCase());

				result.put("url", serverInfo.get("url"));
				result.put("layer", shpTable.toLowerCase());
				result.put("workspace", workspace);
				result.put("dataId", DATAID);
				result.put("layerInfo", geoLayerInfo);

				model.addAttribute("GEOSERVER", result);
			}*/




		} catch (NullPointerException e) {
			logger.error("NullPointerException");
		} catch (SQLException e) {
			logger.error("SQLError-SQLException");
		} catch (Exception e) {
			logger.error("Data Access Error");
		}


		return "jsonView";
	}


	@RequestMapping(value="/geodt/getLayerProperties.do",method=RequestMethod.POST)
	public String getLayerProperties(@Valid Model model, @Valid HttpServletRequest request) {

		String DATAID = request.getParameter("DATAID");

		HttpSession session = request.getSession();

		HashMap<String, Object> params = new HashMap<>();
		params.put("dataid",DATAID);

		MapsDataVO mapVO = mapdataService.getMapDataInfoWithParam(params);

		String schema = mapVO.getShp_data_store_name().toLowerCase();
		schema = StringEscapeUtils.escapeSql(schema);

		String table = mapVO.getShp_table_name();
		table = StringEscapeUtils.escapeSql(table);

		mapVO.setShp_table_name(table);

		mapVO.setRecord_size(0);
		mapVO.setShp_data_store_name(schema);

		List<HashMap<String, Object>> list =  shapeService.getInitProperties(mapVO);

		model.addAttribute("HEADER", shapeService.getTableHeader(mapVO));
		model.addAttribute("PROPERTY", list);
		model.addAttribute("SHP_LAYER_NAME", mapVO.getData_name());

		return "jsonView";
	}

	@RequestMapping(value="/geodt/editProperties.do",method=RequestMethod.POST)
	public String editProperties(Model model, HttpServletRequest request) {

		String dataId = request.getParameter("dataId");

		HttpSession session = request.getSession();

		HashMap<String, Object> params = new HashMap<>();
		params.put("dataid",dataId);

		MapsDataVO mapVO = mapdataService.getMapDataInfoWithParam(params);

		HashMap<String, Object> param = new HashMap<>();

		String schema = mapVO.getShp_data_store_name();
		schema = StringEscapeUtils.escapeSql(schema);

		String column = request.getParameter("column");

		if(column == null) {
			return null;
		}

		column = StringEscapeUtils.escapeSql(column);

		String table_name =  mapVO.getShp_table_name();
		table_name = StringEscapeUtils.escapeSql(table_name);

		String gid = request.getParameter("gid");

		if(gid == null) {
			return null;
		}

		int gidInt = Integer.parseInt(gid);

		String data = request.getParameter("data");
		if(data == null) {
			return null;
		}

		param.put("schema", schema);
		param.put("column", column);
		param.put("table_name", table_name);
		param.put("gid",gidInt);
		param.put("data", data);

		int rs = shapeService.updateProperties(param);

		if(rs != 0 ) {
			model.addAttribute("RS", "complete");
			model.addAttribute("value", request.getParameter("data"));
		}else {
			model.addAttribute("RS", "failed");
		}

		return "jsonView";
	}

	@RequestMapping(value="/geodt/getGeometryInfo.do",method=RequestMethod.POST)
	public String getGeometryInfo(Model model, HttpServletRequest request) {

		String dataId=request.getParameter("dataId");

		HttpSession session = request.getSession();

		HashMap<String, Object> params = new HashMap<>();
		params.put("dataid",dataId);

		MapsDataVO mapVO = mapdataService.getMapDataInfoWithParam(params);

		String schema =  mapVO.getShp_data_store_name().toLowerCase();
		schema = StringEscapeUtils.escapeSql(schema);

		String table_name = mapVO.getShp_table_name().toLowerCase();
		table_name = StringEscapeUtils.escapeSql(table_name);

		String gid = request.getParameter("gid");
		if(gid == null) {
			return null;
		}

		HashMap<String, String> param = new HashMap<>();
		param.put("schema",schema);
		param.put("table_name", table_name);
		param.put("gid",gid);

		HashMap<String, String> result = shapeService.getGeometryInfo(param);

		HashMap<String, String> projInfo =new HashMap<>();
		projInfo.put("value", mapVO.getCoord_type());
		//projInfo.put("def", coord.getDefs_proj4());
		projInfo.put("epsg", mapVO.getCoord_epsg());

		model.addAttribute("projInfo", projInfo);
		model.addAttribute("geoInfo", result);

		return "jsonView";
	}

	@RequestMapping(value="/geodt/getShpPropsMore.do",method=RequestMethod.POST)
	public String getShpPropsMore(Model model, HttpServletRequest request) {

		String dataId=request.getParameter("dataId");
		HttpSession session = request.getSession();

		HashMap<String, Object> params = new HashMap<>();
		params.put("dataid",dataId);

		MapsDataVO mapVO = mapdataService.getMapDataInfoWithParam(params);

		String pageNum = request.getParameter("pageNum");
		String dbSchema = mapVO.getShp_data_store_name().toLowerCase();
		mapVO.setRecord_size(Integer.parseInt(pageNum));
		mapVO.setShp_data_store_name(dbSchema);

		List<HashMap<String, Object>> list = shapeService.getInitProperties(mapVO);

		model.addAttribute("HEADER", shapeService.getTableHeader(mapVO));
		model.addAttribute("PROPERTY", list);

		return "jsonView";
	}

	@RequestMapping(value="/geodt/searchProperties.do",method=RequestMethod.POST)
	public String searchProperties(Model model, HttpServletRequest request) {

		String DATAID = request.getParameter("dataId");

		HttpSession session = request.getSession();

		HashMap<String, Object> params = new HashMap<>();
		params.put("dataid",DATAID);

		MapsDataVO mapVO = mapdataService.getMapDataInfoWithParam(params);

		HashMap<String, String> param = new HashMap<>();

		String schema = mapVO.getShp_data_store_name();
		schema = StringEscapeUtils.escapeSql(schema);

		String table_name = mapVO.getShp_table_name();
		table_name = StringEscapeUtils.escapeSql(table_name);

		String column = request.getParameter("column");

		if(column == null) {
			return null;
		}

		String words = request.getParameter("word");

		if(words == null) {
			return null;
		}

		param.put("schema", schema);
		param.put("table_name", table_name);
		param.put("column", column);
		param.put("words", words);

		List<HashMap<String, Object>> list = shapeService.getSearchProperties(param);

		model.addAttribute("HEADER", shapeService.getTableHeader(mapVO));
		model.addAttribute("PROPERTY", list);

		return "jsonView";
	}

	@RequestMapping(value="/shp/exportShpdata.do",method=RequestMethod.POST)
	public String exportShpData(Model model, HttpServletRequest request){

		String DATAID = request.getParameter("dataId");
		HashMap<String, Object> result = mapdataService.getShpDataInfo(DATAID);

		HashMap<String, String> param = new HashMap<>();
		param.put("schema", (String)result.get("SHP_DATA_STORE_NAME"));
		param.put("table", (String)result.get("SHP_TABLE_NAME"));

		List<HashMap<String, String>> postTableInfo = shapeService.getColumnInfoList(param);

		String epsgCode =String.valueOf(result.get("COORD_EPSG"));

		model.addAttribute("SHP_INFO", result);
		model.addAttribute("DID", DATAID);
		model.addAttribute("DATA_NAME", DATAID);
		model.addAttribute("TABLE_INFO",postTableInfo);
		model.addAttribute("EPSG",epsgCode);
		//model.addAttribute("COORD", coordService.selectCoordList());

		return "jsonView";
	}

	@RequestMapping(value="/shp/exportShpDownload.do",method=RequestMethod.POST)
	public String exportShpDownload(Model model, HttpServletRequest request) {

		String type = request.getParameter("format");
		String dataId = request.getParameter("dataId");

		String reqProj = request.getParameter("prj");

		String columnLists = request.getParameter("props");
		String downloadFileName = request.getParameter("fileName");

		HashMap<String, Object> shpdataInfo = mapdataService.getShpDataInfo(dataId);

		String s_srs_str = String.valueOf(shpdataInfo.get("COORD_EPSG"));

		String s_srs = s_srs_str.split("\\:")[1];
		HashMap<String, String> param = new HashMap<>();

		int geoType=(Integer)shpdataInfo.get("SHP_DATA_TYPE");
		String geoTypeStr="";

		if(geoType==1) {
			geoTypeStr="LINESTRING";
		}else if(geoType==2){
			geoTypeStr="POLYGON";
		}else if(geoType==3) {
			geoTypeStr="POINT";
		}else if(geoType==4) {
			geoTypeStr="MULTIPOINT";
		}else if(geoType==5) {
			geoTypeStr="MULTILINESTRING";
		}else if(geoType==6) {
			geoTypeStr="MULTIPOLYGON";
		}else {
			geoTypeStr="GEOMETRYCOLLECTION";
		}

		String schema = String.valueOf(shpdataInfo.get("SHP_DATA_STORE_NAME"));
		schema = StringEscapeUtils.escapeSql(schema);

		String table =String.valueOf(shpdataInfo.get("SHP_TABLE_NAME"));
		table = StringEscapeUtils.escapeSql(table);

		param.put("schema", schema);
		param.put("table", table);
		param.put("geometryType", geoTypeStr);
		param.put("prj",s_srs_str);


		if(type!=null&&type.equals("S")) {

			HttpSession session = request.getSession(true);

			SessionVO sessionVO = new SessionVO();
			sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");

			UserStorageVO userStorage = userStorageService.getUserStorageInfo(HOST_IP);
			String FILE_SERVER_DIR = userStorage.getMount_directory();
			String targetDirUrl = userStorage.getDir_url();


			String targetDir = FILE_SERVER_DIR+ sessionVO.getSessMemId() + File.separator + "MAP_DATA" + File.separator +"shp"+File.separator+"export"+File.separator;
			String serverDir = targetDirUrl+sessionVO.getSessMemId()+"/MAP_DATA/shp/export/";

			/*if(opt_value != Integer.parseInt(reqProj)) {
				//좌표계 변경하고 export
				CoordVO coordVoTsrs = coordService.getCoordsInfo(Integer.parseInt(reqProj));
				String t_srs =coordVoTsrs.getEpsg();
				String t_srs_num = t_srs.split("\\:")[1];

				param.put("t_srs", t_srs_num);
				param.put("s_srs", s_srs);

				shapeService.transformProj(param);

			}*/
			if(reqProj!=null&&!reqProj.equals(s_srs_str)) {
				//좌표계 변경하고 export
				String t_srs =reqProj;
				String t_srs_num = t_srs.split("\\:")[1];

				param.put("t_srs", t_srs_num);
				param.put("s_srs", s_srs);
				shapeService.transformProj(param);
			}


			param.put("columns", columnLists);
			param.put("encoding", (String) shpdataInfo.get("DATA_ENCODE"));
			param.put("t_fileDir", targetDir);
			param.put("download_file", downloadFileName+".shp");

			String exportShpFileName = postGisCmdService.exportShpFiles(param);

			model.addAttribute("DIR", serverDir+downloadFileName);
			model.addAttribute("FILE_NAME", downloadFileName);
			model.addAttribute("PROGRESS", serverDir+exportShpFileName);
			model.addAttribute("RECORDS", shapeService.getTotalRecords(param));
			model.addAttribute("THUMBNAIL_URL", (String)shpdataInfo.get("THUMBNAIL_URL"));

		}else if(type!=null&&type.equals("J")) {
			//geoJson
		}

		return "jsonView";
	}

	@RequestMapping(value="/geodt/getStyleInfo.do",method=RequestMethod.POST)
	public String getStyleInfo(Model model, HttpServletRequest request) {
		String dataId = request.getParameter("dataId");
		HttpSession session = request.getSession(true);

		SessionVO sessionVO = new SessionVO();
		sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");

		HashMap<String, Object> params = new HashMap<>();
		params.put("dataid",dataId);

		MapsDataVO mapdataVo = mapdataService.getMapDataInfoWithParam(params);
		int mid = mapdataVo.getMid();
		MemberVO memVo = new MemberVO();
		try {
			memVo.setMid(mid);
			memVo = memberService.getMemberInfo(memVo);

			String workspace = memVo.getMem_id();

			String shpTable = mapdataVo.getShp_table_name();

			String check_style = geoServerService.checkStyle(workspace, shpTable);
			if(check_style.equals("EXIST")) {
				String sldPath = "/data/DT_DATA/userData/" + sessionVO.getSessMemId() + "/MAP_DATA/sld";
				sldPath = sldPath+"/"+shpTable+".sld";
				sldPath = sldPath.replaceAll("\\\\", "").replaceAll("&", "");
				try (InputStream inputStream = new FileInputStream(new File(sldPath))) {
				    String xml = IOUtils.toString(inputStream);
				    JSONObject jObject = XML.toJSONObject(xml);
				    ObjectMapper mapper = new ObjectMapper();
				    mapper.enable(SerializationFeature.INDENT_OUTPUT);
				    Object json = mapper.readValue(jObject.toString(), Object.class);
				    String data = mapper.writeValueAsString(json);
				    model.addAttribute("RS", "complete");
					model.addAttribute("value", data);
				}
			}else {
				model.addAttribute("RS", "failed");
			}
		}
		catch (SQLException e) {
			logger.error("READE ERROR-SQLException");
		}
		catch (IOException e) {
			logger.error("READE ERROR-IOException");
		}
		catch (RuntimeException e) {
			logger.error("READE ERROR-RuntimeException");
		}
		catch (Exception e) {
			logger.error("READE ERROR");
		}
		return "jsonView";
	}

	@RequestMapping(value="/geodt/editStyle.do",method=RequestMethod.POST)
	public String editStyle(Model model, HttpServletRequest request) {

		String dataId = request.getParameter("dataId");
		HttpSession session = request.getSession(true);

		SessionVO sessionVO = new SessionVO();
		sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");

		HashMap<String, Object> params = new HashMap<>();
		params.put("dataid",dataId);

		MapsDataVO mapdataVo = mapdataService.getMapDataInfoWithParam(params);
		int mid = mapdataVo.getMid();

		FileWriter fw = null;
		int rs = 0;

		MemberVO memVo = new MemberVO();
		try {
			memVo.setMid(mid);
			memVo = memberService.getMemberInfo(memVo);
			String workspace = memVo.getMem_id();

			String shpTable = mapdataVo.getShp_table_name();

			String shpType = mapdataVo.getShape_type();

			HashMap<String, String> data = new HashMap<>();

			data.put("dataId",dataId);

			data.put("polygonStrokeDasharray",request.getParameter("polygonStrokeDasharray"));
			data.put("polygonStrokeColor",request.getParameter("polygonStrokeColor"));
			data.put("polygonStrokeWidthSlider",request.getParameter("polygonStrokeWidthSlider"));
			data.put("polygonColor",request.getParameter("polygonColor"));
			if(Integer.parseInt(request.getParameter("polygonStrokeOpacitySlider")) < 0 && Integer.parseInt(request.getParameter("polygonStrokeOpacitySlider")) > 255) {
				throw new RuntimeException("OverFlow Or UnderFlow occured-RuntimeException");
			}else {
				data.put("polygonStrokeOpacitySlider",Double.toString(((100-Integer.parseInt(request.getParameter("polygonStrokeOpacitySlider")))*0.01)));
			}

			if(Integer.parseInt(request.getParameter("polygonOpacitySlider")) < 0 && Integer.parseInt(request.getParameter("polygonOpacitySlider")) > 255) {
				throw new RuntimeException("OverFlow Or UnderFlow occured-RuntimeException");
			}else {
				data.put("polygonOpacitySlider",Double.toString(((100-Integer.parseInt(request.getParameter("polygonOpacitySlider")))*0.01)));
			}
			String polygonLabelCheck = request.getParameter("polygonLabelCheck");
			data.put("polygonLabelCheck","N");
			if(!(null == polygonLabelCheck)) {
				data.put("polygonLabelCheck","Y");
				data.put("polygonLabelColor",request.getParameter("polygonLabelColor"));
				data.put("polygonLabelLineColor",request.getParameter("polygonLabelLineColor"));
				data.put("polygonLabel",request.getParameter("polygonLabel"));
				data.put("polygonFontSize",request.getParameter("polygonFontSize"));
			}
			data.put("strokeDasharray",request.getParameter("strokeDasharray"));
			data.put("strokeColor",request.getParameter("strokeColor"));
			data.put("strokeWidthSlider",request.getParameter("strokeWidthSlider"));
			if(Integer.parseInt(request.getParameter("strokeOpacitySlider")) < 0 && Integer.parseInt(request.getParameter("strokeOpacitySlider")) > 255) {
				throw new RuntimeException("OverFlow Or UnderFlow occured-RuntimeException");
			}else {
				data.put("strokeOpacitySlider",Double.toString(((100-Integer.parseInt(request.getParameter("strokeOpacitySlider")))*0.01)));
			}
			String strokeLabelCheck = request.getParameter("strokeLabelCheck");
			data.put("strokeLabelCheck","N");
			if(!(null == strokeLabelCheck)) {
				data.put("strokeLabelCheck","Y");
				data.put("strokeLabelColor",request.getParameter("strokeLabelColor"));
				data.put("strokeLabelLineColor",request.getParameter("strokeLabelLineColor"));
				data.put("strokeLabel",request.getParameter("strokeLabel"));
				data.put("strokeFontSize",request.getParameter("strokeFontSize"));
			}
			data.put("wellKnownName",request.getParameter("wellKnownName"));
			data.put("pointColor",request.getParameter("pointColor"));
			data.put("pointSizeSlider",request.getParameter("pointSizeSlider"));
			if(Integer.parseInt(request.getParameter("pointOpacitySlider")) < 0 && Integer.parseInt(request.getParameter("pointOpacitySlider")) > 255) {
				throw new RuntimeException("OverFlow Or UnderFlow occured-RuntimeException");
			}else {
				data.put("pointOpacitySlider",Double.toString(((100-Integer.parseInt(request.getParameter("pointOpacitySlider")))*0.01)));
			}
			String pointLabelCheck = request.getParameter("pointLabelCheck");
			data.put("pointLabelCheck","N");
			if(!(null == pointLabelCheck)) {
				data.put("pointLabelCheck","Y");
				data.put("pointLabelColor",request.getParameter("pointLabelColor"));
				data.put("pointLabelLineColor",request.getParameter("pointLabelLineColor"));
				data.put("pointLabel",request.getParameter("pointLabel"));
				data.put("pointFontSize",request.getParameter("pointFontSize"));
			}

			data.put("shpDataType",shpType.toLowerCase());
			String check_style = geoServerService.checkStyle(workspace, shpTable);
			String sldXML = geoServerService.editStyleXML(workspace,shpTable,data);

			String sldPath = "/data/DT_DATA/userData/" + sessionVO.getSessMemId() + "/MAP_DATA/sld";

			shpTable = shpTable.replaceAll("\\.","").replaceAll("/","").replaceAll("\\\\","").replaceAll ("&","");

			if(check_style.equals("NO")) {
				//스타일이 없을 경우 디렉토리, 스타일 생성, 디폴트 스타일 설정
				fileService.createAndChmodDirectory(sldPath,"775");
				geoServerService.createStyle(workspace, shpTable, sldXML);
			}else{
				//있을 경우 기존 파일 삭제
				fileService.deleteFile(sldPath+"/"+shpTable+".sld");
			}
			String sldFile = sldPath+"/"+shpTable+".sld";
			if(sldFile != null) sldFile = sldFile.replaceAll("\\\\", "").replaceAll("&", "");
			File sld = new File(sldFile);
			fw = new FileWriter(sld, true);
	        fw.write(sldXML);
	        fw.flush();

			String editStyle = geoServerService.editStyle(workspace, shpTable, sldPath+"/"+shpTable+".sld");
			if(editStyle.equals("DONE")) {
				geoServerService.defaultStyle(workspace, shpTable);
				rs = 1;
			}

		}
		catch (IOException e) {
			logger.error("WRITE ERROR-IOException");
		}
		catch (RuntimeException e) {
			logger.error("WRITE ERROR-RuntimeException");
		}
		catch (Exception e) {
			logger.error("WRITE ERROR");
		}
		finally {
	        if(fw != null)
				try {
					fw.close();
				} catch (IOException e) {
					logger.error("CLOSE ERROR-IOException");
				}
		}


		if(rs != 0 ) {
			model.addAttribute("RS", "complete");
			model.addAttribute("value", request.getParameter("dataId"));
		}else {
			model.addAttribute("RS", "failed");
		}
		return "jsonView";
	}

	@RequestMapping(value="/geodt/getLayerHeader.do",method=RequestMethod.POST)
	public String getLayerHeader(Model model, HttpServletRequest request) {

		String DATAID = request.getParameter("DATAID");
		String filePath = "";
		String fileName = "";

		List<HashMap<String, String>> dataList = new ArrayList<>();
		HttpSession session = request.getSession();
		HashMap<String, Object> param_data = new HashMap<>();

		param_data.put("dataid",DATAID);

		List<HashMap<String, String>> fileInfo = mapdataService.getMemFileInfoWithParam(param_data);
		//List<HashMap<String, String>> fileInfo = mapdataService.getMemFileInfoWithDataId(DATAID);

		for(int i = 0;i < fileInfo.size();i++) {
			if(fileInfo.get(i).get("FILE_NAME").toLowerCase().indexOf(".dbf") > -1) {
				fileName = fileInfo.get(i).get("FILE_NAME");
				filePath = fileInfo.get(i).get("FILE_PATH");
			}
		}
		fileName = fileName.replaceAll("/","").replaceAll("\\\\","").replaceAll ("&","");
		if(filePath != "") {
			filePath = filePath.replaceAll("\\.","").replaceAll("\\\\","").replaceAll ("&","");

			long start = System.currentTimeMillis(); //시작하는 시점 계산

			double tileWidth = Math.pow(2, 3);

			FileInputStream fis = null;
			DbaseFileReader dbfReader = null;
			try {
				fis = new FileInputStream(new File(filePath+fileName));
				dbfReader = new DbaseFileReader(fis.getChannel(), true, Charset.forName("UTF-8"));
				int colSize = dbfReader.getHeader().getNumFields();
				if(colSize<0) {
					throw new NegativeArraySizeException("The size of an array can not be negative-NegativeArraySizeException");
				}
				String[] headers = new String[colSize];

				for(int i=0;i<colSize;i++) {

					headers[i]=dbfReader.getHeader().getFieldName(i);

					String match = "[^\uAC00-\uD7A3xfe0-9a-zA-Z\\s]";
					String header =headers[i].replaceAll(match, "");

				}
				int i=0;

				while (dbfReader.hasNext()) {
	            	HashMap<String, String> data = new HashMap<>();
		            Object[] values = dbfReader.readEntry();
		            for(int iField=0; iField < colSize; ++iField) {
		                if(values[iField] != null) {
		                	data.put(headers[iField], values[iField].toString());
		                }
		            }
	            	dataList.add(data);
		            i++;
		        }

				model.addAttribute("RS", "complete");
				model.addAttribute("headers", headers);
				model.addAttribute("dataList", dataList);

			}
			catch (IOException e) {
				logger.error("READE ERROR-IOException");
			}
			catch (RuntimeException e) {
				logger.error("READE ERROR-RuntimeException");
			}
			catch (Exception e) {
				logger.error("READE ERROR");
			}
			finally {
				if(dbfReader != null)
					try {
						dbfReader.close();
					} catch (IOException e) {
						logger.error("CLOSE ERROR-IOException");
					}
				if(fis != null)
					try {
						fis.close();
					} catch (IOException e) {
						logger.error("CLOSE ERROR-IOException");
					}
			}

			long end = System.currentTimeMillis(); //프로그램이 끝나는 시점 계산
		}
		return "jsonView";
	}

	@RequestMapping(value="/geodata/addColumn.do",method=RequestMethod.POST)
	public String addCsvColumn(Model model, HttpServletRequest request) {

		int dataId = Integer.parseInt(request.getParameter("dataId"));
		String column = request.getParameter("column_name");
		String type = request.getParameter("column_type");
		String dataType = request.getParameter("type");

		MapsDataVO mapdataVo=null;
		int status = 400;

		try {

			HttpSession session = request.getSession(true);

			SessionVO sessionVO = new SessionVO();
			sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");

			HashMap<String, Object> params = new HashMap<>();
			params.put("dataid",dataId);

			mapdataVo=mapdataService.getMapDataFromParam(params);

			String schema ="";
			String table ="";

			if(dataType==null)throw new NullPointerException("NullPointerError-NullPointerException");

			if(dataType!=null&&dataType.equals("S")) {

				schema = mapdataVo.getShp_data_store_name();
				table = mapdataVo.getShp_table_name();

				//geoServerService.reloadConfig();

			}else {

				schema = mapdataVo.getCsv_db_name();
				table = mapdataVo.getCsv_layer_name();
			}

			schema = StringEscapeUtils.escapeSql(schema);
			table = StringEscapeUtils.escapeSql(table);
			column = StringEscapeUtils.escapeSql(column);

			HashMap<String, String> param = new HashMap<>();

			if(schema.equals("") && table.equals("")) {
				status=303;
			}else {

				param.put("SCHEMA",schema);
				param.put("TABLE",table);
				param.put("COLUMN_NAME",column);

				HashMap<String, Integer> checker = geocodingWorkerSevice.checkColumnExist(param);
				int count =Integer.parseInt(String.valueOf(checker.get("num")));
				if(type==null)throw new NullPointerException("NullPointerError-NullPointerException");
				if(type!=null&count == 0) {

					String column_type="varchar";

					if(type.equals("v")) {
						column_type="varchar(255)";
					}else if(type.equals("i")) {
						column_type="int";
					}else if(type.equals("f")) {
						column_type="double precision";
					}else if(type.equals("d")) {
						column_type="date";
					}

					column_type = StringEscapeUtils.escapeSql(column_type);

					param.put("TYPE",column_type);

					int rs = geocodingWorkerSevice.addCsvColumn(param);

					status=200;

				}else {
					status=300;
				}

			}

		} catch (SQLException e) {
			logger.error("SQLError-SQLException");
		}

		model.addAttribute("STATUS", status);

		return "jsonView";
	}

	@RequestMapping(value="/geodt/getFeatureInfo.do",method=RequestMethod.POST)
	public String getFeatureInfo(Model model, HttpServletRequest request) {

		String minxStr = request.getParameter("minx");
		String minyStr = request.getParameter("miny");
		String maxxStr = request.getParameter("maxx");
		String maxyStr = request.getParameter("maxy");

		String tbleInfo = request.getParameter("layers");
		tbleInfo = StringEscapeUtils.escapeSql(tbleInfo);

		try {

			if(minxStr == null) throw new NullPointerException();
			if(minyStr == null) throw new NullPointerException();
			if(maxxStr == null) throw new NullPointerException();
			if(maxyStr == null) throw new NullPointerException();
			if(tbleInfo == null) throw new NullPointerException();

		} catch (NullPointerException e) {
			logger.error("param NullPointerException");
		}

		minxStr = StringEscapeUtils.escapeSql(minxStr);
		minyStr = StringEscapeUtils.escapeSql(minyStr);
		maxxStr = StringEscapeUtils.escapeSql(maxxStr);
		maxyStr = StringEscapeUtils.escapeSql(maxyStr);

		List<String> layerInfo = new ArrayList<>();

		if(tbleInfo != null) {
			if(tbleInfo.indexOf(",") != -1) {
				String[] layers = tbleInfo.trim().split(",");

				for(int i=0;i<layers.length;i++) {
					String shpTble = layers[i].split("\\:")[1];
					shpTble = StringEscapeUtils.escapeSql(shpTble);
					layerInfo.add(shpTble);
				}

			}else {
				String singleLayer = tbleInfo.split("\\:")[1];
				layerInfo.add(singleLayer);
			}
		}

		HashMap<String, Object> result = new HashMap<>();
		int status = 404;

		for(int i=0;i<layerInfo.size();i++) {

			String table = layerInfo.get(i);
			table = StringEscapeUtils.escapeSql(table);

			MapsDataVO mapVO = mapdataService.getMapDataInfoWithShp(table);

			String epsgCode =mapVO.getCoord_epsg();
			String srid = epsgCode.split("\\:")[1];
			srid = StringEscapeUtils.escapeSql(srid);

			int code = Integer.parseInt(srid);

			String schema = mapVO.getShp_data_store_name();
			schema = StringEscapeUtils.escapeSql(schema);

			ProjVO pvo = postGisService.getPrjWktInfo(code);

			double minx = Double.parseDouble(minxStr);
			double miny = Double.parseDouble(minyStr);
			double maxx = Double.parseDouble(maxxStr);
			double maxy = Double.parseDouble(maxyStr);

			double[] pos= {minx,miny,maxx,maxy};

			String source ="GEOGCS[\"WGS 84\",\r\n" +
					"    DATUM[\"WGS_1984\",\r\n" +
					"        SPHEROID[\"WGS 84\",6378137,298.257223563,\r\n" +
					"            AUTHORITY[\"EPSG\",\"7030\"]],\r\n" +
					"        AUTHORITY[\"EPSG\",\"6326\"]],\r\n" +
					"    PRIMEM[\"Greenwich\",0,\r\n" +
					"        AUTHORITY[\"EPSG\",\"8901\"]],\r\n" +
					"    UNIT[\"degree\",0.0174532925199433,\r\n" +
					"        AUTHORITY[\"EPSG\",\"9122\"]],\r\n" +
					"    AUTHORITY[\"EPSG\",\"4326\"]]";

			String dest= pvo.getSrtext();

			String geomType = mapVO.getShape_type();

			HashMap<String, double[]> minmax=geoToolsService.transformMinMaxCoordi(pos, source, dest);

			minx = minmax.get("MIN")[0];
			miny = minmax.get("MIN")[1];
			maxx = minmax.get("MAX")[0];
			maxy = minmax.get("MAX")[1];

			HashMap<String, String> infoParam = new HashMap<>();
			infoParam.put("schema",schema);
			infoParam.put("table",table);
			infoParam.put("minx",String.valueOf(minx));
			infoParam.put("miny",String.valueOf(miny));
			infoParam.put("maxx",String.valueOf(maxx));
			infoParam.put("maxy",String.valueOf(maxy));
			infoParam.put("srid",srid);

			result = shapeService.getFeatureInfoWithBoundary(infoParam);

			if(result != null) {
				result.put("GEO_TYPE",geomType);
				status = 200;
				break;
			}
		}

		model.addAttribute("STATUS", status);
		model.addAttribute("INFO", result);

		return "jsonView";
	}

	@RequestMapping(value="/geodt/getFeatureInfoWithPoint.do",method=RequestMethod.POST)
	public String getFeatureInfoWithPoint(Model model, HttpServletRequest request) {

		String xStr = request.getParameter("x");
		String yStr = request.getParameter("y");

		String tbleInfo = request.getParameter("layer");
		tbleInfo = StringEscapeUtils.escapeSql(tbleInfo);

		try {

			if(xStr == null) throw new NullPointerException();
			if(yStr == null) throw new NullPointerException();
			if(tbleInfo == null) throw new NullPointerException();

		} catch (NullPointerException e) {
			logger.error("param NullPointerException");
		}

		xStr = StringEscapeUtils.escapeSql(xStr);
		yStr = StringEscapeUtils.escapeSql(yStr);

		List<String> layerInfo = new ArrayList<>();
		if(tbleInfo != null) {
			if(tbleInfo.indexOf(",") != -1) {
				String[] layers = tbleInfo.trim().split(",");

				for(int i=0;i<layers.length;i++) {
					String shpTble = layers[i].split("\\:")[1];
					shpTble = StringEscapeUtils.escapeSql(shpTble);
					layerInfo.add(shpTble);
				}

			}else {
				String singleLayer = tbleInfo.split("\\:")[1];
				layerInfo.add(singleLayer);
			}
		}

		HashMap<String, Object> result = new HashMap<>();
		int status = 404;

		for(int i=0;i<layerInfo.size();i++) {

			String table = layerInfo.get(i);
			table = StringEscapeUtils.escapeSql(table);

			MapsDataVO mapVO = mapdataService.getMapDataInfoWithShp(table);

			String epsgCode =mapVO.getCoord_epsg();
			String srid = epsgCode.split("\\:")[1];
			srid = StringEscapeUtils.escapeSql(srid);

			String schema = mapVO.getShp_data_store_name();
			schema = StringEscapeUtils.escapeSql(schema);

			double x = Double.parseDouble(xStr);
			double y = Double.parseDouble(yStr);

			HashMap<String, String> infoParam = new HashMap<>();
			infoParam.put("schema",schema);
			infoParam.put("table",table);
			infoParam.put("x",StringEscapeUtils.escapeSql(String.valueOf(x)));
			infoParam.put("y",StringEscapeUtils.escapeSql(String.valueOf(y)));
			infoParam.put("srid",srid);

			result = shapeService.getFeatureInfoWithPoint(infoParam);

			if(result != null) {
				status = 200;
				break;
			}
		}

		model.addAttribute("STATUS", status);
		model.addAttribute("INFO", result);

		return "jsonView";
	}

	@RequestMapping(value="/geodt/getTableHead.do",method=RequestMethod.GET)
	public String getTableHead(Model model, HttpServletRequest request,HttpServletResponse response) {

		HttpSession session = request.getSession();

		String DATAID = "";
		if(!request.getParameter("DATAID").equals(null)) DATAID = request.getParameter("DATAID").toString().trim();

		String rs = "fail";

		HashMap<String, Object> params = new HashMap<>();
		params.put("dataid",DATAID);

		MapsDataVO mapVO = mapdataService.getMapDataInfoWithParam(params);

		String schema = mapVO.getShp_data_store_name().toLowerCase();
		schema = StringEscapeUtils.escapeSql(schema);

		String table = mapVO.getShp_table_name();
		table = StringEscapeUtils.escapeSql(table);

		List<String> tableHeaders = null;


		if(StringUtils.isNotEmpty(schema)&&StringUtils.isNotEmpty(table)) {

			mapVO.setShp_table_name(table);

			mapVO.setRecord_size(0);
			mapVO.setShp_data_store_name(schema);

			tableHeaders = shapeService.getTableHeader(mapVO);

			if(tableHeaders!=null) {
				rs="success";
				model.addAttribute("HEADER", tableHeaders);
			}else {
				rs="fail";
			}
		}else{
			rs="fail";
		}

		model.addAttribute("rs", rs);

		return "jsonView";
	}


	@RequestMapping(value="/geodt/getProperties.do",method=RequestMethod.GET)
	public String getProperties(Model model, HttpServletRequest request,HttpServletResponse response) {


		///

		HttpSession session = request.getSession();

		String rs = "fail";

		String DATAID = "";
		if(!request.getParameter("DATAID").equals(null)) DATAID = request.getParameter("DATAID").toString().trim();
		String column_name = "";
		if(!request.getParameter("column").equals(null)) column_name = request.getParameter("column").toString().trim();


		HashMap<String, Object> params = new HashMap<>();
		params.put("dataid",DATAID);

		MapsDataVO mapVO = mapdataService.getMapDataInfoWithParam(params);

		String schema = mapVO.getShp_data_store_name().toLowerCase();
		schema = StringEscapeUtils.escapeSql(schema);

		String table = mapVO.getShp_table_name();
		table = StringEscapeUtils.escapeSql(table);

		String columnName = StringEscapeUtils.escapeSql(column_name);

		if(StringUtils.isNotEmpty(schema)&&StringUtils.isNotEmpty(table)&&StringUtils.isNotEmpty(columnName)) {


			mapVO.setShp_data_store_name(schema);
			mapVO.setShp_table_name(table);
			mapVO.setRecord_size(0);
			mapVO.setShp_column_name(columnName);

			List<String> list =  shapeService.getInitPropertiesByColumnName(mapVO);

			if(list!=null) {
				rs="success";
				model.addAttribute("PROPERTY", list);
			}else {
				rs="fail";
			}
		}else{
			rs="fail";
		}

		model.addAttribute("rs", rs);

		return "jsonView";
	}


	@RequestMapping(value="/geodt/getStyle.do",method=RequestMethod.POST)
	public String getStyles(@RequestParam HashMap<String, Object> param,Model model, HttpServletRequest request,HttpServletResponse response) {

		HttpSession session = request.getSession(true);

		SessionVO sessionVO = new SessionVO();
		sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");
		String OS = System.getProperty("os.name").toLowerCase();


		String result = "fail";

		String DATAID = "";
		if(param.containsKey("DATAID")) DATAID = param.get("DATAID").toString().trim();
		String setting_obj = "";
		if(param.containsKey("SETTING")) setting_obj =param.get("SETTING").toString().trim();
		String SHPTYPE =  "";
		if(param.containsKey("SHPTYPE")) SHPTYPE=param.get("SHPTYPE").toString().trim();

		String SYMBOLRULES = "";
		if(param.containsKey("SYMBOL_RULES")) SYMBOLRULES = param.get("SYMBOL_RULES").toString().trim();

		String LABELRULES = "";
		if(param.containsKey("LABEL_RULES")) LABELRULES = param.get("LABEL_RULES").toString().trim();

		String SYMBOLRULES_FLAG = "0";
		if(param.containsKey("SYMBOL_RULES_Flag")) SYMBOLRULES_FLAG = param.get("SYMBOL_RULES_Flag").toString().trim();

		String LABELRULES_FLAG = "0";
		if(param.containsKey("LABEL_RULES_Flag")) LABELRULES_FLAG = param.get("LABEL_RULES_Flag").toString().trim();

		String LABELONLY_FLAG = "0";
		if(param.containsKey("LABEL_ONLY_Flag")) LABELONLY_FLAG = param.get("LABEL_ONLY_Flag").toString().trim();


		String SYMBOLGROUP = "";
		if(param.containsKey("SYMBOL_GROUP")) SYMBOLGROUP = param.get("SYMBOL_GROUP").toString().trim();

		String LABELGROUP = "";
		if(param.containsKey("LABEL_GROUP")) LABELGROUP = param.get("LABEL_GROUP").toString().trim();


		SLDService sldService = new SLDService();
		JSONArray jsoArr = new JSONArray(setting_obj);

		String sld_xml = "";

		FileWriter fw = null;

		int rs = 0;

		MemberVO memVo = new MemberVO();
		int updateRs  = 0;
		int insertRs =0;

		HashMap<String,Object> maprules  = mapdataRulesService.getMapRulesByDataID(Integer.parseInt(DATAID));
		MapDataRulesVO mrvo = null;
		if(maprules!=null) { //해당 데이터의 룰이 비어있는 경우
			mrvo= new MapDataRulesVO();
			mrvo.setDataid(Integer.parseInt(DATAID));

			mrvo.setSymbolgroup(SYMBOLGROUP);
			mrvo.setSymbolrules(SYMBOLRULES);
			mrvo.setSymbolrulesflag(SYMBOLRULES_FLAG);

			mrvo.setLabelgroup(LABELGROUP);
			mrvo.setLabelrules(LABELRULES);
			mrvo.setLabelrulesflag(LABELRULES_FLAG);
			mrvo.setMid(sessionVO.getSessMid());
			mrvo.setLabelOnlyFlag(LABELONLY_FLAG);
			updateRs = mapdataRulesService.updateRules(mrvo);

		}else { //해당 데이터의 룰이 있는 경우
			mrvo= new MapDataRulesVO();
			mrvo.setDataid(Integer.parseInt(DATAID));

			mrvo.setSymbolgroup(SYMBOLGROUP);
			mrvo.setSymbolrules(SYMBOLRULES);
			mrvo.setSymbolrulesflag(SYMBOLRULES_FLAG);

			mrvo.setLabelgroup(LABELGROUP);
			mrvo.setLabelrules(LABELRULES);
			mrvo.setLabelrulesflag(LABELRULES_FLAG);
			mrvo.setMid(sessionVO.getSessMid());
			mrvo.setLabelOnlyFlag(LABELONLY_FLAG);

			insertRs = mapdataRulesService.insertRules(mrvo);
		}


		try {
			sld_xml = sldService.createStyle(jsoArr,SHPTYPE);

			if(StringUtils.isNotEmpty(DATAID)&&StringUtils.isNotEmpty(setting_obj)) {

				HashMap<String, Object> params = new HashMap<>();
				params.put("dataid",DATAID);

				MapsDataVO mapdataVo = mapdataService.getMapDataInfoWithParam(params);
				int mid = mapdataVo.getMid();


				String dataStore = mapdataVo.getShp_data_store_name();

				String shpTable = mapdataVo.getShp_table_name();
				sld_xml = sld_xml.replace("<sld:Name>Default Styler</sld:Name>", "<sld:Name>"+shpTable+"</sld:Name>");

				String shpType = mapdataVo.getShape_type();

				memVo.setMid(mid);
				memVo = memberService.getMemberInfo(memVo);
				String workspace = memVo.getMem_id();



				String check_style = geoServerService.checkStyle(workspace, shpTable);
				String sldXML = sld_xml;
				//sessionVO.getSessMemId()

				UserStorageVO userStorage = userStorageService.getUserStorageInfo(HOST_IP);
				String FILE_SERVER_DIR = userStorage.getMount_directory();

				//String sldPath = FILE_DIR+"/data/DT_DATA/userData/seoul/userData/" + sessionVO.getSessMemId() + "/MAP_DATA/sld";
				String sldPath = FILE_SERVER_DIR + sessionVO.getSessMemId() + "/MAP_DATA/sld";

				shpTable = shpTable.replaceAll("\\.","").replaceAll("/","").replaceAll("\\\\","").replaceAll ("&","");
				String styleName = "";

				if(check_style.equals("NO")) {
					//스타일이 없을 경우 디렉토리, 스타일 생성, 디폴트 스타일 설정
					if(OS.indexOf("win") >= 0) {//윈도우-로컬 개발
						geoServerService.createStyle(workspace, shpTable, sldXML);
					}else {//서버
						fileService.createAndChmodDirectory(sldPath,"775");
						geoServerService.createStyle(workspace, shpTable, sldXML);
					}
				}else{
					//있을 경우 기존 파일 삭제
					if(OS.indexOf("win") >= 0) {//윈도우-로컬 개발
						fileService.deleteFile(sldPath+"/"+shpTable+".sld");
					}else {//서버
						fileService.createAndChmodDirectory(sldPath,"775");
						fileService.deleteFile(sldPath+"/"+shpTable+".sld");
						geoServerService.deleteStyle(workspace, shpTable);
					}
				}
				String sldFile = sldPath+"/"+shpTable+".sld";
				sldFile = sldFile.replaceAll("\\\\", "").replaceAll("&", "");
				File sld = new File(sldFile);
				if(!sld.exists()) {

					if(OS.indexOf("win") >= 0) {//윈도우-로컬 개발
						sld.createNewFile();
					}else {//서버
						sld.createNewFile();
						fileService.changeDirectoryPermission(sldFile, "775");
					}
					logger.info("new sld file created. :"+sld.getAbsoluteFile() +"\n"+ sld.getName());
				}
				fw = new FileWriter(sld, true);
		        fw.write(sldXML);
		        fw.flush();

				logger.info("sld path: "+sldPath+"/"+shpTable+".sld");
				logger.info("request for changing sld style in geoserver - workspace:"+workspace);
				logger.info("request for changing sld style in geoserver - shpTable:"+shpTable);
				logger.info("request for changing sld style in geoserver - shpTable:"+sldPath+"/"+shpTable+".sld");
				String editStyle = geoServerService.editStyle(workspace, shpTable, sldPath+"/"+shpTable+".sld");
				logger.info("editStyle executed");
				logger.info(editStyle);
				if(editStyle.equals("DONE")) {
					String styleRs  = geoServerService.defaultStyle(workspace, shpTable);
					if(styleRs.equals("DONE")) {
						rs = 1;
						result = "success";
					}else {
						rs = 0;
						result = "fail";
						logger.info("GeoserverCntl-Changing Style Failed");
						return "jsonView";
					}
					//geoServerService.executeGwcLayer(workspace, shpTable);

				}else {
					rs = 0;
					result = "fail";
					return "jsonView";
				}

			}else{
				result = "fail";
				return "jsonView";
			}

		} catch (CQLException e) {
			// TODO Auto-generated catch block
			logger.error("geoserverCtnl-CQLException has occured.");
			result = "fail";
			return "jsonView";
		} catch (TransformerException e) {
			// TODO Auto-generated catch block
			logger.error("geoserverCtnl-TransformerException has occured while converting descriptor object into SLD xml.");
			result = "fail";
			return "jsonView";
		} catch (IOException e) {
			logger.error("WRITE ERROR-IOException");
			result = "fail";
			return "jsonView";
		}
		catch (RuntimeException e) {
			logger.error("WRITE ERROR-RuntimeException");
			result = "fail";
			return "jsonView";
		}
		catch (Exception e) {
			logger.error("WRITE ERROR");
			result = "fail";
			return "jsonView";
		}
		finally {
	        if(fw != null)
				try {
					fw.close();
				} catch (IOException e) {
					logger.error("CLOSE ERROR-IOException");
					result = "fail";
					return "jsonView";
				}
		}

		if(rs != 0 ) {
			result="success";
		}else {
			logger.error("File Write ERROR");
			result="fail";
			return "jsonView";
		}

		if(updateRs==1||insertRs==1) { //업데이트나 인서트중 하나는 되어야함.
			result="success";
		}else {
			logger.error("GeoserverCntl:DB-COMMIT ERROR The sld might be changed in geoserver,but not commited into DB.");
			result="fail";
			return "jsonView";
		}

		model.addAttribute("result",result);
		logger.info("result:"+result);
		return "jsonView";
	}

	@RequestMapping(value="/geodt/searchProperty.do",method=RequestMethod.POST)
	public String searchProperty(@RequestParam HashMap<String, Object> param,Model model, HttpServletRequest request) {

		String DATAID = param.get("dataId").toString();

		HttpSession session = request.getSession();

		HashMap<String, Object> param1 = new HashMap<>();
		param1.put("dataid",DATAID);

		MapsDataVO mapVO = mapdataService.getMapDataInfoWithParam(param1);

		HashMap<String, String> params = new HashMap<>();

		String schema = mapVO.getShp_data_store_name();
		schema = StringEscapeUtils.escapeSql(schema);

		String table_name = mapVO.getShp_table_name();
		table_name = StringEscapeUtils.escapeSql(table_name);

		String column = param.get("column").toString();
		column = StringEscapeUtils.escapeSql(column);

		if(column == null) {
			return null;
		}

		String words = param.get("word").toString();

		if(words == null) {
			return null;
		}

		params.put("schema", schema);
		params.put("table_name", table_name);
		params.put("column", column);
		params.put("words", words);

		List<HashMap<String, Object>> list = shapeService.getSearchProperties(params);

		model.addAttribute("PROPERTY", list);

		return "jsonView";
	}


	@RequestMapping(value="/geodt/uploadImg.do",method=RequestMethod.POST)
	public String uploadSymbolImage(Model model,@RequestParam("imgFile") List<MultipartFile> files, HttpServletRequest request,HttpServletResponse response) {

		HttpSession session = request.getSession(true);

		SessionVO sessionVO = new SessionVO();
		sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");


		String rs = "fail";

		//String imagePath = FILE_DIR+"/data/DT_DATA/userData/seoul/userData/" + "newlayer3165" + "/MAP_DATA/sld/img";
		UserStorageVO userStorage = userStorageService.getUserStorageInfo(HOST_IP);
		String FILE_SERVER_DIR = userStorage.getMount_directory();

		String imagePath = FILE_SERVER_DIR + sessionVO.getSessMemId() + "/MAP_DATA/sld/img";
		if(imagePath != null) imagePath = imagePath.replaceAll("\\\\", "").replaceAll("&", "");
		fileService.createAndChmodDirectory(imagePath,"775");

		for(MultipartFile file : files) {
			logger.info("=====================================");
			logger.info("Uploaded File Name: "+file.getOriginalFilename());
			logger.info("Uploaded File Size: "+file.getSize());


			File saveImg = new File(imagePath,file.getOriginalFilename());
			try {
				file.transferTo(saveImg);
				rs = "success";
				if(request.getRequestURL().toString().contains("www.dtwincloud.com")) {
					model.addAttribute("IMG_PATH","https://www.dtwincloud.com/userData/"+sessionVO.getSessMemId()+"/MAP_DATA/sld/img/"+file.getOriginalFilename());
				}
			} catch (IllegalStateException e) {
				logger.error("GeoserverCntl-ImageFileTransfer_IllegalStateException");
				rs = "fail";
				break;
			} catch (IOException e) {
				logger.error("GeoserverCntl-ImageFileTransfer_IOException");
				rs = "fail";
				break;
			}
		}

		model.addAttribute("rs", rs);


		return "jsonView";
	}
	@RequestMapping(value="/geodt/getStylesInfo.do",method=RequestMethod.POST)
	public String getStylesInfo(@RequestParam HashMap<String, Object> param,Model model, HttpServletRequest request) {

		String DATAID = param.get("dataId").toString();

		HttpSession session = request.getSession();

		HashMap<String,Object> rules = mapdataRulesService.getMapRulesByDataID(Integer.parseInt(DATAID));

		String rs = "NODATA";

		if(rules!=null) {
			rs="EXIST";
			model.addAttribute("RULES",rules);
		}else{
			rs="NODATA";
			model.addAttribute("RULES",rules);
		}
		model.addAttribute("RS",rs);
		return "jsonView";
	}

	@RequestMapping(value="/geodt/getPropertiesMore.do",method=RequestMethod.GET)
	public String getSampleProperties(Model model, HttpServletRequest request,HttpServletResponse response) {

		HttpSession session = request.getSession();

		String rs = "fail";

		String DATAID = "";
		String column_name = "";
		String recordSize = "";
		if(!request.getParameter("DATAID").equals(null)) DATAID = request.getParameter("DATAID").toString().trim();
		if(!request.getParameter("column").equals(null)) column_name = request.getParameter("column").toString().trim();
		if(!request.getParameter("offset").equals(null)) recordSize = request.getParameter("offset").toString().trim();

		HashMap<String, Object> params = new HashMap<>();
		params.put("dataid",DATAID);

		MapsDataVO mapVO = mapdataService.getMapDataInfoWithParam(params);

		String schema = mapVO.getShp_data_store_name().toLowerCase();
		schema = StringEscapeUtils.escapeSql(schema);

		String table = mapVO.getShp_table_name();
		table = StringEscapeUtils.escapeSql(table);

		String columnName = StringEscapeUtils.escapeSql(column_name);

		if(StringUtils.isNotEmpty(schema)&&StringUtils.isNotEmpty(table)&&StringUtils.isNotEmpty(columnName)) {


			mapVO.setShp_data_store_name(schema);
			mapVO.setShp_table_name(table);
			mapVO.setRecord_size(Integer.parseInt(recordSize));
			mapVO.setShp_column_name(columnName);

			List<String> list =  shapeService.getInitPropertiesByColumnName(mapVO);

			if(list!=null) {
				rs="success";
				model.addAttribute("PROPERTY", list);
			}else {
				rs="fail";
			}
		}else{
			rs="fail";
		}

		model.addAttribute("rs", rs);

		return "jsonView";
	}

	@RequestMapping(value="/geodt/searchInitProperty.do",method=RequestMethod.POST)
	public String searchInitProperty(@RequestParam HashMap<String, Object> param,Model model, HttpServletRequest request) {

		String DATAID = param.get("dataId").toString();

		HttpSession session = request.getSession();

		HashMap<String, Object> param1 = new HashMap<>();
		param1.put("dataid",DATAID);

		MapsDataVO mapVO = mapdataService.getMapDataInfoWithParam(param1);

		HashMap<String, Object> params = new HashMap<>();

		String schema = mapVO.getShp_data_store_name();
		schema = StringEscapeUtils.escapeSql(schema);

		String table_name = mapVO.getShp_table_name();
		table_name = StringEscapeUtils.escapeSql(table_name);

		String column = param.get("column").toString();
		column = StringEscapeUtils.escapeSql(column);

		if(column == null) {
			return null;
		}

		String words = param.get("word").toString();

		if(words == null) {
			return null;
		}


		params.put("schema", schema);
		params.put("table_name", table_name);
		params.put("column", column);
		params.put("words", words);

		List<HashMap<String, Object>> list = shapeService.getSearchPropertiesWithSize(params);

		model.addAttribute("PROPERTY", list);

		return "jsonView";
	}

	@RequestMapping(value="/geodt/searchPropertyMore.do",method=RequestMethod.POST)
	public String searchPropertyWithSize(@RequestParam HashMap<String, Object> param,Model model, HttpServletRequest request) {

		String DATAID = param.get("dataId").toString();

		HttpSession session = request.getSession();

		HashMap<String, Object> param1 = new HashMap<>();
		param1.put("dataid",DATAID);

		MapsDataVO mapVO = mapdataService.getMapDataInfoWithParam(param1);

		HashMap<String, Object> params = new HashMap<>();

		String schema = mapVO.getShp_data_store_name();
		schema = StringEscapeUtils.escapeSql(schema);

		String table_name = mapVO.getShp_table_name();
		table_name = StringEscapeUtils.escapeSql(table_name);

		String column = param.get("column").toString();
		column = StringEscapeUtils.escapeSql(column);

		if(column == null) {
			return null;
		}

		String words = param.get("word").toString();

		if(words == null) {
			return null;
		}

		String offset = param.get("offset").toString();

		if(offset == null) {
			return null;
		}

		params.put("schema", schema);
		params.put("table_name", table_name);
		params.put("column", column);
		params.put("words", words);
		params.put("record_size", Integer.parseInt(offset));

		List<HashMap<String, Object>> list = shapeService.getSearchPropertiesWithSize(params);

		model.addAttribute("PROPERTY", list);

		return "jsonView";
	}
}