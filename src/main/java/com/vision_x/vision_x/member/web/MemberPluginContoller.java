package com.vision_x.vision_x.member.web;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FilenameFilter;
import java.io.UnsupportedEncodingException;
import java.net.Inet4Address;
import java.net.UnknownHostException;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;

import org.apache.commons.compress.utils.FileNameUtils;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang3.StringUtils;
import org.json.JSONObject;
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

import com.vision_x.vision_x.common.service.LogTrackerService;
import com.vision_x.vision_x.desk.mapdata.service.MapdataService;
import com.vision_x.vision_x.desk.mapdata.service.MapsDataVO;
import com.vision_x.vision_x.file.service.FileService;
import com.vision_x.vision_x.file.service.MultiFileUploadService;
import com.vision_x.vision_x.geoserver.service.GeoServerService;
import com.vision_x.vision_x.member.service.MemberPluginService;
import com.vision_x.vision_x.member.service.MemberService;
import com.vision_x.vision_x.member.service.MemberVO;
import com.vision_x.vision_x.postgis.service.PostGisService;
import com.vision_x.vision_x.storage.service.UserStorageService;
import com.vision_x.vision_x.storage.service.UserStorageVO;
import com.vision_x.vision_x.utils.GdalService;
import com.vision_x.vision_x.utils.GeoToolsService;
import com.vision_x.vision_x.utils.GetClientIPAddr;
import com.vision_x.vision_x.utils.PostGisCmdService;
import com.vision_x.vision_x.utils.ZipFileInfoService;


@Controller
public class MemberPluginContoller {
	protected Logger logger = LoggerFactory.getLogger(this.getClass());
	@Value("#{globalInfo['Globals.env.host']}")
	private String DEFAULT_HOST;
	
	@Resource(name="memberService")
	private MemberService memberService;
	
	@Resource(name="memberPluginService")
	private MemberPluginService memberPluginService;
	
	@Resource(name="logTrackerService")	
	private LogTrackerService logTrackerService;
	
	@Resource(name="geoServerService")
	private GeoServerService geoServerService;
	
	@Resource(name="geoToolsService")
	private GeoToolsService geoToolsService;
	
	@Resource(name="postGisService")
	private PostGisService postGisService;
	
	@Resource(name="zipFileInfoService")
	private ZipFileInfoService zipFileInfoService;
	
	@Resource(name="multiFileUploadService")
	private MultiFileUploadService multiFileUploadService;
	
	@Autowired
	private PostGisCmdService postGisCmdService;
	
	@Resource(name="gdalService")
	private GdalService gdalService; 
	
	@Resource(name="fileService")
	private FileService fileService; 
	
	@Resource(name="mapdataService") 
	private MapdataService mapdataService;
	
	@Value("#{globalInfo['Globals.env.mode']}")
	private String ENV_MODE;
	
	@Value("#{globalInfo['Globals.geoserver.url']}")
	private String geoserver_url;
	
	@Resource(name="userStorageService")
	private UserStorageService userStorageService;
	
	private String HOST_IP = "";
	
	public MemberPluginContoller() {
	
		try {
			this.HOST_IP =Inet4Address.getLocalHost().getHostName();
		}
		
		catch ( UnknownHostException e ) {
			logger.info("unknowhost exception");
		}
	}
	
	@RequestMapping(value="/plugin/themeMapList.do",method=RequestMethod.GET)
	public String themeMapList(HttpServletRequest request,Model model) {

		String status="";
		String url = "";
		String msg = "";
		//주제도 정보 가져오기
		List<HashMap<String,Object>> thematicMapList = memberPluginService.getThematicMap();

		if(thematicMapList.size() !=0) {//주제도 데이터가 있는 경우
			model.addAttribute("layers", thematicMapList);
			status="200";	
			msg = "successfully transmitted";	
			url = "https://openlab-2d.eseoul.go.kr/smap_theme/wms?";	
		}else {
			//주제도 데이터가 없는 경우	
			status="203";	
			msg = "No Map Data";	
			url = "Data doesn't exist.If you need any help,contact us with khaia@newlayer.kr";
		}

		model.addAttribute("message", msg);	
		model.addAttribute("url", url);	
		model.addAttribute("status", status);

		return "jsonView";
	}
	
	@RequestMapping(value="/plugin/getLayerInfo.do",method=RequestMethod.GET)
	public String getLayerInfoList(HttpServletRequest request,Model model) {
		
		String appkey = request.getParameter("apiKey");
		GetClientIPAddr ipaddr = new GetClientIPAddr();	
		String ip = ipaddr.getClientIP(request);
		
		String status="";
		String url = "";
		String msg = "";
		
		List<HashMap<String,Object>> infoList = memberPluginService.getMemberInfo(appkey);	
		//api키로 해당 멤버 id 가져오기	
		String userId= memberPluginService.getMemberIdByApiKey(appkey);	
		//해당 앱키의 db 의 ip 	
		String dbIP = memberPluginService.getMemberIPByApikey(appkey); 	
		if(StringUtils.isNotEmpty(userId)) { //해당 api키에 일치하는 memberId가 있는 경우 --앱키는 한 계정당 한 개 생성이 원칙	
			if(infoList.size() != 0) { //데이터가 있는경우	
				if((!dbIP.equals(null) && dbIP.equals(ip)) || (!dbIP.equals(appkey) && appkey.equals("0638dfcec364ab9a1762043e"))){
					//ip주소가 동일한 경우 --현재 ip칼럼을 로컬에서 가입한 ip주소와 대조하기때문에, 기본 api 테스트동작을 위한  api키값"0638dfcec364ab9a1762043e"은 허용함.추후,필요시 삭제  	
					status="200";	
					msg = "successfully transmitted";	
					url = "http://61.109.239.8:8081/geoserver/w_"+userId+"/wms?";	
					model.addAttribute("layers", infoList);	
				}else {//ip 가 일치하지 않는 경우	
					status="201";	
					msg = "Wrong IP address.";	
					url = "IP address unmatched.Please check it out once again.";	
				}	
			}else { //데이터가 없는 경우	
				status="203";	
				msg = "No Map Data";	
				url = "Data doesn't exist.Please make your own map first.If you need any help,contact us with khaia@newlayer.kr";	
			}	
		}else {//해당 api키에 일치하는 memId가 없는 경우	
			status="202";	
			msg = "Unauthorized key";	
			url = "APIkey uncomfirmed.Please Check out the APIkey is correct once again.";//회원아이디가 존재하지않는 경우 == api키가 존재하지 않는 경우	
		}	
			
		model.addAttribute("message", msg);	
		model.addAttribute("url", url);	
		model.addAttribute("status", status);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/plugin/uploadShpFiles.do",method=RequestMethod.POST)
	public String uploadShpFiles(HttpServletRequest request,@RequestParam("file") List<MultipartFile> files,@RequestParam("apikey") String apikey,Model model) {
		
		logger.info("Post request submitted: /plugin/uploadShpFiles.do");
		
		UserStorageVO userStorage = userStorageService.getUserStorageInfo(HOST_IP);
		String FILE_SERVER_DIR = userStorage.getMount_directory();
		
		String result = "fail";
		String msg = "";
		String api_key ="";
		String userId ="";
		String status ="";
		String url = "";
		GetClientIPAddr ipaddr = new GetClientIPAddr();	
		String ip = ipaddr.getClientIP(request);
		String dbIP ="";
		String epsg = "";
		String dataId ="";
		int crs;
		String shpPath = FILE_SERVER_DIR;
		String origin_name = "";
		FileInputStream fin =null;
		FileOutputStream fos = null;
		
		try {
			if(request.getParameterMap().containsKey("apikey")) {//리퀘스트에서 api키를 파라미터로 포함하고 있는지 확인 -
				if(!StringUtils.isEmpty(apikey)) { //-> Nullpointer Exception 확인 및 공백(시큐어코딩)

					if(StringUtils.isNotEmpty(memberPluginService.getMemberIdByApiKey(apikey))) { //-> Nullpointer Exception 확인 및 공백 (시큐어코딩)
						userId = memberPluginService.getMemberIdByApiKey(apikey);
						dbIP = memberPluginService.getMemberIPByApikey(apikey);
						
						List<HashMap<String,Object>> infoList = memberPluginService.getMemberInfo(apikey);
						MemberVO mbvo =  new MemberVO();
						mbvo.setMem_id(userId);
						mbvo = memberService.getMemberInfoMemId(mbvo);
						
						String targetDir = "";
						String tempZip_targetDir ="";
								
						
						targetDir = FILE_SERVER_DIR + userId + File.separator + "MAP_DATA" + File.separator +"shp"+File.separator;
						tempZip_targetDir =FILE_SERVER_DIR + userId + File.separator + "MAP_DATA" + File.separator;
						if(tempZip_targetDir != null) tempZip_targetDir = tempZip_targetDir.replaceAll("\\\\","").replaceAll ("&","");
						
						
						if(infoList.size()!=0) {
							if(dbIP.equals(ip)||apikey.equals("0638dfcec364ab9a1762043e")){
								String uploadFileName="user_shp_"+userId+"_"+System.currentTimeMillis();
								if(uploadFileName != null) uploadFileName = uploadFileName.replaceAll("\\\\", "").replaceAll("&", "");
								
								multiFileUploadService.saveFilesToUserDir(files,tempZip_targetDir,FilenameUtils.getBaseName(files.get(0).getOriginalFilename()));// zip 파일 저장
								
								String shp_name = zipFileInfoService.getShpFileNameFromZip(tempZip_targetDir,files.get(0).getOriginalFilename()).toLowerCase(); // zip파일에서 내부의 shp,shx,prj,dbf등의 파일명이 동일한지 확인하고 shp파일명을 가져옴 단 zip파일 압축을 풀 경우 내부에 영문이 소문자로 변환됨
								
								boolean rs = zipFileInfoService.unzipFiles(tempZip_targetDir,files.get(0).getOriginalFilename(), "escape", "shp");//zip 파일 압축해제
								//String geometryType = geoToolsService.getGeometyTypeFromShp(targetDir, fileName+"."+"shp");
								//여기서 shp파일 경로가 targetDir 과 같아짐.
								if(rs) {
									//fileService.changeDirectoryPermission(targetDir, "755");
									
									
									File shp_dir = new File(targetDir);//targetDir
									
																		
									File shp_file = null;
									File prj_file = null;
									File enc_file = null;
									
									
									if(shp_dir.exists()&&shp_dir.isDirectory()) {
										
										File [] fileForFilter = shp_dir.listFiles();

										File [] fileList = shp_dir.listFiles(new FilenameFilter() {
											
											@Override
											public boolean accept(File dir, String name) {
												// TODO Auto-generated method stub
												return name.startsWith(FilenameUtils.getBaseName(shp_name));//zip파일 내부의 확인된  shp파일명
											}
										});
										
										String geometryType = geoToolsService.getGeometyTypeFromShp(targetDir, shp_name+"."+"shp");
										
										//dbf 속성 인코딩 체크
										//샘플 속성 데이터 불러오기 - cpg 파일 존재여부에 따라 인코딩 다르게 읽어오기
										File cpgFile = new File(targetDir+shp_name+".cpg");
										String encoding=null;

										if(cpgFile.exists()) {
											encoding = geoToolsService.cpgFileCharset(targetDir, shp_name+".cpg");
										}else {
											encoding="UTF-8";//기본 인코딩 EUC-KR
										}
										
										crs = gdalService.getCrsInfoWithPrj(targetDir, shp_name+"."+"shp");
										if(crs !=0) {
											epsg = "EPSG:"+Integer.toString(crs);
										}
										
										for(File file : fileList) {
											if(file.getName().contains(".shp")) {//TODO:파일명에 공백을 제거해줘야함.
												shp_file = file;
											}
											
											//파일이름 밀리초로 변경
											String ext = FilenameUtils.getExtension(file.getName());
											file.setReadable(true);
										    file.setWritable(true);
										    file.setExecutable(false);
											file.renameTo(new File(targetDir+uploadFileName+"."+ext));
											
											//fileService.changeDirectoryPermission(targetDir+uploadFileName+"."+ext, "775");
										}
										
										
										
										if(shp_file!=null) {//shp파일이 zip파일 안에 있을 경우
	
											HashMap<String,String> resultMap = postGisCmdService.shpToPostgresql(uploadFileName+".shp", targetDir, epsg, "dtw_user_geo_"+userId, encoding);
											//db에 insert해주어야함.
											if(resultMap.size()!=0) {

												String dataLayerName = FileNameUtils.getBaseName(shp_file.getName());
												//uploadFileName
												byte[] dataEncodingLayer = dataLayerName.getBytes();
												
												dataLayerName = new String(dataEncodingLayer, "UTF-8");
												
		
												 HashMap<String, String> dataMap = new HashMap<>();
												 
												 dataMap.put("THUMBNAIL_URL","");
												 dataMap.put("MID",Integer.toString(mbvo.getMid()));
												 dataMap.put("DATA_NAME", dataLayerName);
												 dataMap.put("DATA_TYPE", "S");
												 dataMap.put("DATADIR_URL", targetDir);
												 dataMap.put("COORD_TYPE", "");
												 dataMap.put("DATA_ENCODE", ""); 
												 dataMap.put("POINT_COLOR", "");
												 dataMap.put("IS_SHAPE_HEIGHT", "N");
												 dataMap.put("DATA_ENCODE", encoding);
												 dataMap.put("COL_X", "0"); 
												 dataMap.put("COL_Y", "0");
												 dataMap.put("COL_LABEL", "0"); 
												 dataMap.put("COORD_EPSG", epsg);
												 
												 int insertRs = mapdataService.insertMemMapData(dataMap);
												 String layerExist =geoServerService.checkLayerExist(userId, uploadFileName);
												 
												 if(layerExist.equals("NO")) {
													 String geoserver_result = geoServerService.addShpLayer(userId, "dtw_user_geo_"+userId, uploadFileName);
												 }else{
													 status = "210";
													 msg ="ALREADY SAME NAMED LAYER EXISTS.";
												 }
												 
												 
												 dataId=dataMap.get("DATAID");
												 
												 dataMap.put("DATAID", dataId);
												 dataMap.put("META_OUT_URL", "");
												 dataMap.put("SHP_LAYER_FULLNAME", "w_"+userId+":"+uploadFileName);
												 dataMap.put("SHP_DATA_STORE_NAME", "dtw_user_geo_"+userId);
												 dataMap.put("SHP_TABLE_NAME", uploadFileName);
												 dataMap.put("POI_COLOR", "");
												 dataMap.put("DATA_ENCODE", encoding);
												 dataMap.put("DATA_DESC", "");
												 
												 
												 int updateRs = mapdataService.updateShpTableName(dataMap);
												 //int updateRs2 = mapdataService.updateOpenApiCsvStatus(Integer.parseInt(dataId));
												 for (File file :fileList) {
														
														HashMap<String, String> memInfo = new HashMap<>();
	
														
														String fileExt = FileNameUtils.getExtension(file.getName());
														String fileName2 = uploadFileName+"."+fileExt;
														String fileSize = Long.toString(file.length());
														//String fileType = fileName2.substring(fileName2.lastIndexOf(".")+1);
														String fileType ="shp";
														
														memInfo.put("MID",Integer.toString(mbvo.getMid()));
														memInfo.put("FILE_NAME", fileName2);
														memInfo.put("FILE_SIZE", fileSize);
														memInfo.put("FILE_URL", "/userData/"+userId+"/MAP_DATA/shp/");// /userData/userid/MAP_DATA/shp/
														memInfo.put("FILE_PATH", "/userData/"+userId+"/MAP_DATA/shp/"); // /data/DT_DATA/userData/seoul/userData/userid/MAP_DATA/shp/ 
														memInfo.put("FILE_LINK_URL","/userData/"+userId+"/MAP_DATA/shp/"+fileName2);   ///userData/userid/MAP_DATA/shp/user_shp_alswn2036_1669227644457.shp
														memInfo.put("FILE_LINK_PATH", "/userData/"+userId+"/MAP_DATA/shp/");
														memInfo.put("FILE_TYPE", fileType);
														memInfo.put("HDFS_URL", "test");
														memInfo.put("DATAID", dataId);
														
														int rs2 = mapdataService.insertMemFile(memInfo);
														
														
														  if (rs2 != 0) { 
															  String FID = memInfo.get("FID");
														  	//fid.add(FID); 
														  }
														 
														
													} 

												 
												//shp 썸네일 만들기
												HashMap<String, Object> param_data = new HashMap<>();
													
												param_data.put("dataid",dataId);
													
												List<HashMap<String, String>> fileInfo = mapdataService.getMemFileInfoWithParam(param_data);
												String shpFile="";
												String dir=fileInfo.get(0).get("FILE_PATH");
													
												for(int i=0;i<fileInfo.size();i++) {
													String fileExt= fileInfo.get(i).get("FILE_NAME").split("\\.")[1];
													
													if(fileExt.equals("shp")) {
														shpFile = fileInfo.get(i).get("FILE_NAME");
													}
													
												}
												//HashMap<String, Object> thum_map =geoToolsService.makeShpThumbnailImgAndCheckBound(dir,shpFile);
												String thumbSrc = "/userData/"+userId+"/MAP_DATA/shp/"+geoToolsService.makeShpThumbnailImg(targetDir,shpFile);
												//String thumbSrc = targetDir+thum_map.get("THUMB_FILE_NAME").toString().trim();
												HashMap<String,String> thumMap = new HashMap<String, String>();
												thumMap.put("THUMBNAIL_URL", thumbSrc);
												thumMap.put("COL_X", "0");
												thumMap.put("COL_Y", "0");
												thumMap.put("DATAID", dataId);
												
												HashMap<String, String> geoLayerInfo = geoServerService.layerJsonInfo(userId, "dtw_user_geo_"+userId, uploadFileName);
												String resultOk = geoLayerInfo.get("STATUS");
												if(resultOk.equals("OK")) {
													String layerInfoStr = geoLayerInfo.get("INFO");
													JSONObject jsonObj=new JSONObject(layerInfoStr);
													JSONObject featureType = (JSONObject) jsonObj.get("featureType");
													
													JSONObject minMaxBoundary = (JSONObject)featureType.get("latLonBoundingBox");
													HashMap<String, String> geoParam = new HashMap<>();
													geoParam.put("schema","dtw_user_geo_"+userId);
													geoParam.put("table",uploadFileName);
													
													 //HashMap<String, String> geometryType = postGisService.getGeometryTypeFromTable(geoParam);
													
													double minx = minMaxBoundary.getDouble("minx");
													double miny = minMaxBoundary.getDouble("miny");
													double maxx = minMaxBoundary.getDouble("maxx");
													double maxy = minMaxBoundary.getDouble("maxy");
													
													String epsgCode = featureType.getString("srs");
													//String geometry_type = geometryType.get("type");
													
													MapsDataVO mapsVO = new MapsDataVO();
													mapsVO.setState(10);
													mapsVO.setMinx(minx);
													mapsVO.setMiny(miny);
													mapsVO.setMaxx(maxx);
													mapsVO.setMaxy(maxy);
													mapsVO.setShp_url(geoserver_url+"/"+userId+"/wms?");
													mapsVO.setCoord_epsg(epsg);
													mapsVO.setCsv_layer_name("");
													mapsVO.setCsv_db_name("");
													mapsVO.setDataid(Integer.parseInt(dataId));
													int mapRs = mapdataService.updateMapdataStatus(mapsVO);
													mapsVO = new MapsDataVO();
													mapsVO.setDataid(Integer.parseInt(dataId));
													mapsVO.setShape_type(geometryType.toLowerCase());
													int upRs = mapdataService.changeShpDataType(mapsVO);
													int maRs = mapdataService.updateThumbnailData(thumMap);
													
													if(mapRs==1&&upRs==1&&maRs==1) {
														result="ok";
														status = "200";
														url = "Uploading completed.";
														msg = "successfully transmitted";
													}else{
														if(mapRs<1) {
															logger.error("MemberPluginCtnl-SQLException");
															status ="210";
															msg ="A promblem occured from the server";
															url = "DB Error";
															result="fail";
														}else if(upRs<1) {
															logger.error("MemberPluginCtnl-SQLException");
															status ="210";
															msg ="A promblem occured from the server";
															url = "DB Error";
															result="fail";
														}else if(maRs<1) {
															logger.error("MemberPluginCtnl-SQLException");
															status ="210";
															msg ="A promblem occured from the server";
															url = "DB Error";
															result="fail";
														}
													}
												}else{//지오서버에서 레이어 정보를 취득할 수 없게된 경우
													logger.error("MemberPluginCtnl-IOException");
													status ="209";
													msg ="A promblem occured from the GEO server";
													url = "GEO Server Error";
													result="fail";
												}
												
											}else{//shp2pgsql이 안먹히는 경우
												status = "204";
												url = "Uploading files failed.";
												msg ="Failed to convert shp file into DB table.please check if zipped file contains correct files.";
												result="fail";
											}
										}else{//shp파일이 없는 경우
											status="205";
											msg="No SHP file";
											url ="Can not find SHP file from the uploaded zip file.";
											result="fail";
										}
										
									}
								}else{ // 압축 파일이 없는 경우
									status="206";
									msg ="Unzip failure";
									url ="Can not unzip the file.";
									result="fail";
								}
							}else {//ip 가 일치하지 않는 경우	.
								status="201";	
								msg = "Wrong IP address.";	
								url = "IP address unmatched.Please check it out once again.";
								result="fail";
							}
						}else {//유효하지않은 api키인 경우.
							status="202";
							msg ="Unauthorized key";
							url = "APIkey uncomfirmed.Please Check out the APIkey is correct once again.";
							result="fail";
						}
						
					}
					
				}else{
					status ="207";
					msg ="The API key unconfirmed.";
					url = "The api key is empty or incorrect.";
					result="fail";
				}
				
			}else{//apikey라는 파라미터명으로 post요청이 없을 경우
				status ="208";
				msg ="API key param unconfirmed.";
				url = "please check out the request parameter once again.";
				result="fail";
			}
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			logger.error("MemberPluginCtnl-UnsupportedEncodingException");
			status ="210";
			msg ="A promblem occured from the server";
			url = "Encoding Error";
			result="fail";
		} catch (SQLException e) {
			logger.error("MemberPluginCtnl-SQLException");
			status ="210";
			msg ="A promblem occured from the server";
			url = "DB Error";
			result="fail";
		} catch (Exception e) {
			logger.error("MemberPluginCtnl-Exception");
			status ="210";
			msg ="Internal Server Error";
			url = "Server Error";
			result="fail";
		}
		
		model.addAttribute("message", msg);
		model.addAttribute("status", status);
		model.addAttribute("result", result);
		model.addAttribute("url", url);
		
		return "jsonView";
	}
}