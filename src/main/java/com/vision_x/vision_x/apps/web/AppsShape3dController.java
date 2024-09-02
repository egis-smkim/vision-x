package com.vision_x.vision_x.apps.web;

import java.io.File;
import java.net.Inet4Address;
import java.net.UnknownHostException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.concurrent.Executors;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.commons.io.FilenameUtils;
import org.apache.oro.text.MalformedCachePatternException;
import org.geotools.geometry.jts.JTS;
import org.geotools.geometry.jts.JTSFactoryFinder;
import org.geotools.referencing.CRS;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.Envelope;
import org.locationtech.jts.geom.Geometry;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Polygon;
import org.locationtech.jts.io.ParseException;
import org.locationtech.jts.io.WKTReader;
import org.opengis.referencing.FactoryException;
import org.opengis.referencing.NoSuchAuthorityCodeException;
import org.opengis.referencing.operation.MathTransform;
import org.opengis.referencing.operation.TransformException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.vision_x.vision_x.apps.service.AppFileUploadService;
import com.vision_x.vision_x.apps.service.ShpModelLayerVO;
import com.vision_x.vision_x.apps.service.ShpModelVO;
import com.vision_x.vision_x.file.service.FileService;
import com.vision_x.vision_x.file.service.MultiFileUploadService;
import com.vision_x.vision_x.member.service.MemberService;
import com.vision_x.vision_x.member.service.MemberVO;
import com.vision_x.vision_x.storage.service.UserStorageService;
import com.vision_x.vision_x.storage.service.UserStorageVO;
import com.vision_x.vision_x.utils.GeoToolsService;
import com.vision_x.vision_x.utils.PostGisCmdService;
import com.vision_x.vision_x.utils.SessionVO;
import com.vision_x.vision_x.worker.service.ProgressWorkerService;
import com.vision_x.vision_x.worker.service.ProgressWorkerVO;

@Controller
public class AppsShape3dController {
	protected Logger logger = LoggerFactory.getLogger(this.getClass());
	
	@Value("#{globalInfo['Globals.env.mode']}")
	private String ENV_MODE;
	
	@Resource(name="multiFileUploadService")
	private MultiFileUploadService multiFileUploadService;
	
	@Resource(name="geoToolsService")
	private GeoToolsService geoToolsService;
	
	@Resource(name="postGisCmdService")
	private PostGisCmdService postGisCmdService;
	
	@Resource(name="appFileUploadService")
	private AppFileUploadService appFileUploadService;
	
	@Resource(name="memberService")
	private MemberService memberService;
	
	@Resource(name="progressWorkerService")
	private ProgressWorkerService progressWorkerService;
	
	@Resource(name="userStorageService")
	private UserStorageService userStorageService;
	
	private String HOST_IP = "";
	
	public AppsShape3dController() {
	
		try {
			this.HOST_IP =Inet4Address.getLocalHost().getHostName();
		}
		
		catch ( UnknownHostException e ) {
			logger.info("unknowhost exception");
		}
	}
	
	@RequestMapping(value="/shp3d/getProjectInfo.do",method=RequestMethod.POST)
	public String getProjectInfo(Model model, HttpServletRequest request) {
		
		int mid = Integer.parseInt(request.getParameter("MID"));
		List<HashMap<String, Object>> list = appFileUploadService.getAppShpPrjctInfo(mid);
		
		int size = list.size();
		int status=400;
		
		if(size != 0) {
			status=200;
		}
		
		model.addAttribute("STATUS", status);
		model.addAttribute("LIST", list);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/shp3d/getLayerInfo.do",method=RequestMethod.POST)
	public String getLayerInfo(Model model, HttpServletRequest request) {
		int asid = Integer.parseInt(request.getParameter("ASID"));
		
		List<ShpModelLayerVO> projectLayerList = appFileUploadService.getShpLayerList(asid);
		
		HashMap<String, Object> objInfo = appFileUploadService.getShpModelLayerInfo(asid);
		
		int status=400;
		
		if(projectLayerList.size() != 0 ) {
			status =200;
		}
		
		model.addAttribute("PRJ_INFO", objInfo);
		model.addAttribute("INFO", projectLayerList);
		model.addAttribute("STATUS",status);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/shp3d/upload.do",method=RequestMethod.POST)
	public String upload3dShape(Model model, HttpServletRequest request,MultipartHttpServletRequest multiFiles){
		
		HttpSession session = request.getSession(true);
		SessionVO sessionVO = new SessionVO();
		sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");
		int mid = sessionVO.getSessMid();
		
		int fileKey =0;
		int layerKey =0;
		List<MultipartFile> list = multiFiles.getFiles("shpFiles");
		String originFileName = list.get(0).getOriginalFilename().split("\\.")[0];
		
		UserStorageVO userStorage = userStorageService.getUserStorageInfo(HOST_IP);
		String FILE_SERVER_DIR = userStorage.getDir_url();
		
		String dir = FILE_SERVER_DIR+sessionVO.getSessMemId()+File.separator+"APP_DATA"+File.separator+"shp3d"+File.separator;
		//String dir = FILE_DIR+sessionVO.getSessMemId()+File.separator+"APP_DATA"+File.separator+"shp3d"+File.separator;
		String timeStamp = Long.toString(System.currentTimeMillis());

		String fileName = "apps_shp3d_"+timeStamp;
		
		boolean check = appFileUploadService.multipleFileUpload(list, dir, fileName);
		
		int status=400;
		HashMap<String, Object> dbfInfo = new HashMap<>();
		MathTransform transform=null;
		String THUMB_URL ="";
		if(check) {
			//shp min,max,좌표계 구하기
			//샘플 dbf 파일 가져오기 디폴트 euc-kr
		    ShpModelVO vo = new ShpModelVO();
		    int code = 0;
		    
			try {
				dbfInfo=geoToolsService.getShpPropertiesInfo(dir, fileName+".dbf", "EUC-KR");
				//바운더리
				HashMap<String, Double> boundary = geoToolsService.shpBoundary(dir, fileName+".shp");
				String geo_type=geoToolsService.getGeometyTypeFromShp(dir, fileName+".shp");
				
				String wktPrj = geoToolsService.readPrjFile(dir, fileName+".prj");
				
				code = geoToolsService.getSRSCode(dir, fileName+".shp");
				dbfInfo.put("EPSG",code);
				
				Coordinate min = new Coordinate(boundary.get("minx"),boundary.get("miny"));
				Coordinate max = new Coordinate(boundary.get("maxx"),boundary.get("maxy"));
				
				String wktGeom ="POLYGON(("+min.x+" "+min.y+", "+max.x+" "+min.y+", "+max.x+" "+max.y+", "+min.x+" "+max.y+", "+min.x+" "+min.y+"))";
				String thumbImg = geoToolsService.getWktGeometryMapThumb(wktGeom, dir, fileName+".shp", wktPrj, code);
				THUMB_URL = "/userData/"+sessionVO.getSessMemId()+"/APP_DATA/shp3d/"+thumbImg;
				
				Coordinate destMin = new Coordinate();
				Coordinate destMax = new Coordinate();
				
				transform = CRS.findMathTransform(CRS.parseWKT(wktPrj), CRS.decode("EPSG:4326"),true);
				
				JTS.transform(min, destMin, transform);
				JTS.transform(max, destMax, transform);
				
				double[] resultMin = {destMin.y,destMin.x};
				double[] resultMax = {destMax.y,destMax.x};
				
				vo.setFile_name(fileName);
				vo.setFile_path(dir);
				vo.setProj(wktPrj);
				vo.setEpsg_code("EPSG:"+code);
				vo.setMinx(resultMin[0]);
				vo.setMiny(resultMin[1]);
				vo.setMaxx(resultMax[0]);
				vo.setMaxy(resultMax[1]);
				vo.setMid(mid);
				
				int rs = appFileUploadService.insertShpModelInfo(vo);
				
				if(rs != 0) {
					
					status=200;
					dbfInfo.put("min",resultMin);
					dbfInfo.put("max",resultMax);
					fileKey = vo.getAsid();
					
					ShpModelLayerVO slvo = new ShpModelLayerVO();
					
					slvo.setAsid(fileKey);
					slvo.setEpsg_code("EPSG:"+code);
					slvo.setProj_wkt(wktPrj);
					slvo.setMinx(resultMin[0]);
					slvo.setMiny(resultMin[1]);
					slvo.setMaxx(resultMax[0]);
					slvo.setMaxy(resultMax[1]);
					slvo.setGeo_type(geo_type);
					slvo.setFile_name(fileName);
					slvo.setFile_path(dir);
					slvo.setOrigin_name(originFileName);
					slvo.setThumb_img_url(THUMB_URL);
					
					appFileUploadService.insertShpLayerInfo(slvo);
					layerKey = slvo.getAfid();
				}
				
			} catch (NoSuchAuthorityCodeException e) {
				logger.error("AuthorityCode Error-NoSuchAuthorityCodeException");
			} catch (FactoryException e) {
				logger.error("CRS-related Error-FactoryException");
			} catch (TransformException e) {
				logger.error("JTS-related Error-TransformException");
			} 

		}
		
		
		model.addAttribute("IMG_URL", THUMB_URL);
		model.addAttribute("LAYER_KEY", layerKey);
		model.addAttribute("PROJECT_KEY", fileKey);
		model.addAttribute("PROPS", dbfInfo);
		model.addAttribute("STATUS", status);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/shp3d/addUpload.do",method=RequestMethod.POST)
	public String addUploadShpFiles(HttpServletRequest request,Model model,MultipartHttpServletRequest multiFiles){
		
		int asid = Integer.parseInt(request.getParameter("ASID"));
		ShpModelVO vo = appFileUploadService.getShpModelInfo(asid);
		
		HttpSession session = request.getSession(true);
		SessionVO sessionVO = new SessionVO();
		sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");
		
		String project_name = vo.getProject_name();
	
		int layerKey=0;
		List<MultipartFile> list = multiFiles.getFiles("shpFiles");
		
		String originName = list.get(0).getOriginalFilename().split("\\.")[0];
		
		String dir = vo.getFile_path();
		if(dir != null) dir.replaceAll("\\\\","").replaceAll ("&","");
		String timeStamp = Long.toString(System.currentTimeMillis());
		String fileName = "apps_shp3d_"+timeStamp;
		
		fileName = fileName.replaceAll("\\.","").replaceAll("/","").replaceAll("\\\\","").replaceAll ("&","");
		boolean check = appFileUploadService.multipleFileUpload(list, dir, fileName);
		
		int status=400;
		HashMap<String, Object> dbfInfo = new HashMap<>();
		MathTransform transform=null;
		String THUMB_URL ="";
		if(check) {
			//shp min,max,좌표계 구하기
			//샘플 dbf 파일 가져오기 디폴트 euc-kr
		    int code = 0;
		    
			try {
				
				dbfInfo=geoToolsService.getShpPropertiesInfo(dir, fileName+".dbf", "EUC-KR");
				//바운더리
				HashMap<String, Double> boundary = geoToolsService.shpBoundary(dir, fileName+".shp");
				String wktPrj = geoToolsService.readPrjFile(dir, fileName+".prj");
				String geo_type=geoToolsService.getGeometyTypeFromShp(dir, fileName+".shp");
				
				code = geoToolsService.getSRSCode(dir, fileName+".shp");
				dbfInfo.put("EPSG",code);
				
				Coordinate min = new Coordinate(boundary.get("minx"),boundary.get("miny"));
				Coordinate max = new Coordinate(boundary.get("maxx"),boundary.get("maxy"));
				
				String wktGeom ="POLYGON(("+min.x+" "+min.y+", "+max.x+" "+min.y+", "+max.x+" "+max.y+", "+min.x+" "+max.y+", "+min.x+" "+min.y+"))";
				String thumbImg = geoToolsService.getWktGeometryMapThumb(wktGeom, dir, fileName+".shp", wktPrj, code);
				THUMB_URL = "/userData/"+sessionVO.getSessMemId()+"/APP_DATA/shp3d/"+thumbImg;
				
				Coordinate destMin = new Coordinate();
				Coordinate destMax = new Coordinate();
				
				transform = CRS.findMathTransform(CRS.parseWKT(wktPrj), CRS.decode("EPSG:4326"),true);
				
				JTS.transform(min, destMin, transform);
				JTS.transform(max, destMax, transform);
				
				double[] resultMin = {destMin.y,destMin.x};
				double[] resultMax = {destMax.y,destMax.x};
				
				ShpModelLayerVO slvo = new ShpModelLayerVO();
			
				slvo.setAsid(asid);
				slvo.setEpsg_code("EPSG:"+code);
				slvo.setGeo_type(geo_type);
				slvo.setFile_name(fileName);
				slvo.setFile_path(dir);
				slvo.setProj_wkt(wktPrj);
				slvo.setMinx(resultMin[0]);
				slvo.setMiny(resultMin[1]);
				slvo.setMaxx(resultMax[0]);
				slvo.setMaxy(resultMax[1]);
				slvo.setOrigin_name(originName);
				slvo.setThumb_img_url(THUMB_URL);
				
				int rs = appFileUploadService.insertShpLayerInfo(slvo);
				
				if(rs != 0) {
					
					layerKey = slvo.getAfid();
					status=200;
				}
				
			} catch (NoSuchAuthorityCodeException e) {
				logger.error("AuthorityCode Error-NoSuchAuthorityCodeException");
			} catch (FactoryException e) {
				logger.error("CRS-related Error-FactoryException");
			} catch (TransformException e) {
				logger.error("JTS-related Error-TransformException");
			} 

			
		}
		
		model.addAttribute("IMG_URL", THUMB_URL);
		model.addAttribute("LAYER_KEY", layerKey);
		model.addAttribute("PROJECT_KEY", asid);
		model.addAttribute("PROJECT_NAME", project_name);
		model.addAttribute("PROPS", dbfInfo);
		model.addAttribute("STATUS", status);
		
		
		return "jsonView";
	}
	
	@RequestMapping(value="/shp3d/getProgress.do",method=RequestMethod.POST)
	public String getProgress(HttpServletRequest request,Model model) {
		
		int pid = Integer.parseInt(request.getParameter("pid"));
		ProgressWorkerVO vo = progressWorkerService.getAppProgressInfo(pid);
		
		int progress = Integer.parseInt(vo.getProgress());
		
		int status = 400;
		String url="";
		String layerName="";
		
		if(progress == 100) {
			
			int afid=0;
			String type = request.getParameter("type");
			
			int appId = vo.getAppid();
			
			ShpModelVO svo = appFileUploadService.getShpModelInfo(appId);
			
			url=svo.getConvert_url();
			layerName=svo.getFile_name();
			
			Date nowDate = new Date();
			SimpleDateFormat sdf = new SimpleDateFormat("yy-MM-dd");
			String today = sdf.format(nowDate);
			
			svo.setStatus(200);

			try {

			int rs = appFileUploadService.updateProcessShp(svo);
			
			if(rs != 0) {
				status=200;
			}
			if(type==null) {
				throw new NullPointerException();
			}
			if(type!=null&&type.equals("A")) {
				afid = Integer.parseInt(request.getParameter("afid"));
				//min max boundary 계산하기
				ShpModelLayerVO slvo = appFileUploadService.getShpLayerInfo(afid);
				
				double lminx = slvo.getMinx();
				double lminy = slvo.getMiny();
				double lmaxx = slvo.getMaxx();
				double lmaxy = slvo.getMaxy();
				
				double pminx = svo.getMinx();
				double pminy = svo.getMiny();
				double pmaxx = svo.getMaxx();
				double pmaxy = svo.getMaxy();
				
				double newminx = 0.0;
				double newminy = 0.0;
				double newmaxx = 0.0;
				double newmaxy = 0.0;
				
				GeometryFactory geometryFactory = JTSFactoryFinder.getGeometryFactory();
				WKTReader reader = new WKTReader( geometryFactory );
				
				Geometry polygon =null;
				Geometry newPolygon = null;
				
				polygon = (Geometry) reader.read("POLYGON(("+lminx+" "+lminy+", "+lmaxx+" "+lminy+", "+lmaxx+" "+lmaxy+", "+lminx+" "+lmaxy+", "+lminx+" "+lminy+"))");
				newPolygon =(Geometry) reader.read("POLYGON(("+pminx+" "+pminy+", "+pmaxx+" "+pminy+", "+pmaxx+" "+pmaxy+", "+pminx+" "+pmaxy+", "+pminx+" "+pminy+"))");
				
				HashMap<String, Double> env = geoToolsService.getCombineBoundary(polygon,newPolygon);
				
				newminx = env.get("minx");
				newminy = env.get("miny");
				newmaxx = env.get("maxx");
				newmaxy = env.get("maxy");
				
				svo.setMinx(newminx);
				svo.setMiny(newminy);
				svo.setMaxx(newmaxx);
				svo.setMaxy(newmaxy);
				slvo.setStatus(200);
				
				appFileUploadService.updateShpLayerStatus(slvo);
				appFileUploadService.updateAppShpBoundary(svo);
				
			}
			
			List<ShpModelLayerVO> projectLayerList = appFileUploadService.getShpLayerList(svo.getAsid());
			HashMap<String, Object> objInfo = appFileUploadService.getShpModelLayerInfo(svo.getAsid());
			model.addAttribute("INFO",projectLayerList);
			model.addAttribute("PRJ_INFO",objInfo);
			
			model.addAttribute("LAYERNAME",layerName);
			model.addAttribute("PROJECT_NAME",svo.getProject_name());
			model.addAttribute("EPSG_CODE",svo.getEpsg_code());
			model.addAttribute("DATE",today);
			model.addAttribute("ASID",svo.getAsid());
			model.addAttribute("minx",svo.getMinx());
			model.addAttribute("miny",svo.getMiny());
			model.addAttribute("maxx",svo.getMaxx());
			model.addAttribute("maxy",svo.getMaxy());
			model.addAttribute("URL",url);
			}
			catch (NullPointerException e) {
				logger.error("PROGRESS ERROR-NullPointerException");
			}
			catch (ParseException e) {
				logger.error("PROGRESS ERROR-ParseException");
			}
			catch (RuntimeException e) {
				logger.error("PROGRESS ERROR-RuntimeException");
			}
			catch (Exception e) {
				logger.error("PROGRESS ERROR");
			}
		}else {
			status=202;
		}
		
		model.addAttribute("PROGRESS",progress);
		model.addAttribute("STATUS",status);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/shp3d/process.do",method=RequestMethod.POST)
	public String convertShpToModel2(Model model, HttpServletRequest request) {
		
		String key = request.getParameter("key");
		String epsgCode = request.getParameter("epsg");
		String type=request.getParameter("type");
		String baseHeight = request.getParameter("baseHeight");
		String minHeight = request.getParameter("minHeight");
		String encoding = request.getParameter("encoding");
		String prjctName = request.getParameter("prjctName");

		//project key
		int asid = Integer.parseInt(request.getParameter("asid"));
		int afid = Integer.parseInt(request.getParameter("afid"));
		
		//프로젝트 경로에서 계속 가공하기
		ShpModelVO vo = appFileUploadService.getShpModelInfo(asid);
		
		String fileName = vo.getFile_name();
		String path = vo.getFile_path();
		if(path != null) path.replaceAll("\\\\","").replaceAll ("&","");
		String outputPath = path+"convert"+File.separator+asid+File.separator;
		
		HttpSession session = request.getSession(true);
		SessionVO sessionVO = new SessionVO();
		sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");
		ShpModelLayerVO slvo = appFileUploadService.getShpLayerInfo(afid);
		String prj_wkt = slvo.getProj_wkt();
		
		//경계 convexhull 구하기
		
		String convexhullWkt = geoToolsService.getShpConvexhull(fileName+".shp", path,prj_wkt);
		slvo.setGeom_wkt(convexhullWkt);
		slvo.setAfid(afid);
		
		int updateRs = appFileUploadService.updateShpConvexHull(slvo);
		
		String outputUrl = "/userData/"+sessionVO.getSessMemId()+"/APP_DATA/shp3d/convert/"+asid;
		
		HashMap<String, String> response = new HashMap<>();
		
		int status = 400;
		
		//프로그래스 생성
		ProgressWorkerVO prvo = new ProgressWorkerVO();
		prvo.setAppid(asid);
		prvo.setStatus("1");
		prvo.setProgress("0");
		
		int progress = progressWorkerService.insertAppProgress(prvo);
		int pid = prvo.getPid();
		//fileName = fileName.replaceAll("\\.","").replaceAll("/","").replaceAll("\\\\","").replaceAll ("&","");
		if(progress != 0) {
			
			Executors.newCachedThreadPool().execute(()->{
			
				String parma = "{"
						+ 			"\"input\":\""+path+fileName.replaceAll("\\.","").replaceAll("/","").replaceAll("\\\\","").replaceAll ("&","")+".shp\","
								+   "\"output\":\""+outputPath+"\","
								+   "\"keyName\":\""+key+"\","
								  + "\"minHeightName\":\""+minHeight+"\","
								  + "\"baseHeightName\":\""+baseHeight+"\","
								  + "\"buildTypeName\":\""+type+"\","
								  + "\"epsg\":\""+epsgCode+"\","
								  + "\"progress\":\""+pid+"\","
								  + "\"level\":\"14\""
							+ "}";
				
				appFileUploadService.convertShp2Model(parma,path,fileName.replaceAll("\\.","").replaceAll("/","").replaceAll("\\\\","").replaceAll ("&",""));
			});
			
			vo.setConvert_path(outputPath);
			vo.setConvert_url(outputUrl);
			vo.setDbf_encoding(encoding);
			vo.setAsid(asid);
			vo.setProject_name(prjctName);
			
			int rs = appFileUploadService.updateShp2Modelinfo(vo);
			
			if(rs != 0) {
				status=200;
				response.put("progress_id",String.valueOf(pid));
			}
		}
		
		model.addAttribute("status", status);
		model.addAttribute("info", response);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/shp3d/addProcess.do",method=RequestMethod.POST)
	public String addProcessConvert(Model model, HttpServletRequest request) {
		
		String key = request.getParameter("key");
		String epsgCode = request.getParameter("epsg");
		String type=request.getParameter("type");
		String baseHeight = request.getParameter("baseHeight");
		String minHeight = request.getParameter("minHeight");

		//project key
		int asid = Integer.parseInt(request.getParameter("asid"));
		int afid = Integer.parseInt(request.getParameter("afid"));
		
		//프로젝트 레이어 타일 경로 가져오기
		ShpModelVO svo = appFileUploadService.getShpModelInfo(asid);
		String convertPath = svo.getConvert_path();
		
		//가공 shp 경로
		ShpModelLayerVO slvo = appFileUploadService.getShpLayerInfo(afid);
		String shpPath = slvo.getFile_path().replaceAll("\\\\","").replaceAll ("&","");
		String shpName = slvo.getFile_name();
		String prj = slvo.getProj_wkt();
		//경계 convexhull 구하기
		
		String convexhullWkt = geoToolsService.getShpConvexhull(shpName+".shp", shpPath,prj);
		
		slvo.setGeom_wkt(convexhullWkt);
		slvo.setAfid(afid);
		
		int updateRs = appFileUploadService.updateShpConvexHull(slvo);
		
		//프로그래스 생성
		ProgressWorkerVO prvo = new ProgressWorkerVO();
		prvo.setAppid(asid);
		prvo.setStatus("1");
		prvo.setProgress("0");
		
		int progress = progressWorkerService.insertAppProgress(prvo);
		int pid = prvo.getPid();
		
		HashMap<String, String> response = new HashMap<>();
		int status=400;
		
		if(progress != 0) {
			
			Executors.newCachedThreadPool().execute(()->{
				String shpNameConvert = shpName.replaceAll("/","").replaceAll("\\\\","").replaceAll ("&","");
				String parma = "{"
						+ 			"\"input\":\""+shpPath+shpNameConvert+".shp\","
								+   "\"output\":\""+convertPath+"\","
								+   "\"keyName\":\""+key+"\","
								  + "\"minHeightName\":\""+minHeight+"\","
								  + "\"baseHeightName\":\""+baseHeight+"\","
								  + "\"buildTypeName\":\""+type+"\","
								  + "\"epsg\":\""+epsgCode+"\","
								  + "\"progress\":\""+pid+"\","
								  + "\"level\":\"14\""
							+ "}";
				
				appFileUploadService.convertShp2Model(parma,shpPath,shpNameConvert);
			});
			
			status=200;
			response.put("progress_id",String.valueOf(pid));
			
		}
		
		model.addAttribute("status", status);
		model.addAttribute("info", response);
		
		return "jsonView";
	}

	@RequestMapping(value="/shp3d/getProperties.do",method=RequestMethod.POST)
	public String getProperties(Model model, HttpServletRequest request) {
		
		int asid = Integer.parseInt(request.getParameter("ASID"));
		
		ShpModelVO projectInfo = appFileUploadService.getShpModelInfo(asid);
		List<ShpModelLayerVO> layerInfo = appFileUploadService.getShpLayerList(asid); 
		
		int status=400;
		
		if(projectInfo != null && layerInfo.size() != 0) {
			status=200;
		}
		
		model.addAttribute("status", status);
		model.addAttribute("PRJ_INFO", projectInfo);
		model.addAttribute("LAYER_INFO", layerInfo);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/shp3d/deleteProject.do",method=RequestMethod.POST)
	public String deleteProject(Model model, HttpServletRequest request) {
		
		int asid= Integer.parseInt(request.getParameter("ASID"));
		//db 날리기,db record 삭제
		ShpModelVO vo = appFileUploadService.getShpModelInfo(asid);
		String schema = vo.getMember_schema();
		String table = vo.getDbf_table();
		String layer = vo.getFile_name();
		String tableInfo = schema+"."+table;
		
		appFileUploadService.dropShpTable(tableInfo);
		
		//1.db 레코드 날리기
		int rs = appFileUploadService.deleteShp3dModel(asid);
		int status =400;
		
		if(rs != 0) {
			status=200;
		}
		
		model.addAttribute("LAYER_NAME", layer);
		model.addAttribute("STATUS", status);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/shp3d/cancel.do",method=RequestMethod.POST)
	public String exitProcess(Model model, HttpServletRequest request) {
		
		int asid = Integer.parseInt(request.getParameter("ASID"));
		
		
		return "jsonView";
	}
	
	@RequestMapping(value="/shp3d/callLayerBoundary.do",method=RequestMethod.POST)
	public String callLayerBoundary(Model model, HttpServletRequest request) {
		
		int afid = Integer.parseInt(request.getParameter("afid"));
		
		ShpModelLayerVO slvo =null;
		slvo = appFileUploadService.getShpLayerBoundary(afid);
		
		int status =400;
		if(slvo != null) {
			status =200;
		}
		
		model.addAttribute("status", status);
		model.addAttribute("boundary", slvo);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/shp3d/updateProjectName.do",method=RequestMethod.POST)
	public String updateProjectName(Model model, HttpServletRequest request) {
		
		int asid = Integer.parseInt(request.getParameter("ASID"));
		String textStr = request.getParameter("str");
		
		ShpModelVO vo = new ShpModelVO();
		vo.setAsid(asid);
		vo.setProject_name(textStr);
		
		int rs = appFileUploadService.updateProjectName(vo);
		int status=400;
		
		if(rs != 0) {
			status=200;
		}
		
		model.addAttribute("STATUS", status);
		
		return "jsonView";
	}
}

