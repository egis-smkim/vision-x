package com.vision_x.vision_x.tree.web;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.net.Inet4Address;
import java.net.UnknownHostException;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.json.simple.JSONObject;
import org.json.simple.JSONArray;
import org.json.simple.parser.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.vision_x.vision_x.desk.maps.service.MapsService;
import com.vision_x.vision_x.desk.maps.service.MapsVO;
import com.vision_x.vision_x.file.service.MultiFileUploadService;
import com.vision_x.vision_x.storage.service.UserStorageService;
import com.vision_x.vision_x.storage.service.UserStorageVO;
import com.vision_x.vision_x.tree.service.LayerTreeService;
import com.vision_x.vision_x.tree.service.impl.LayerTreeVO;
import com.vision_x.vision_x.utils.SessionVO;


@Controller
public class LayerTreeController {
	protected Logger logger = LoggerFactory.getLogger(this.getClass());
	@Value("#{globalInfo['Globals.file.local.path']}")
	private String FILE_DIR; //로컬 경로
	
	@Resource(name="multiFileUploadService")
	private MultiFileUploadService multiFileUploadService;
	
	@Resource(name="layerTreeService")
	private LayerTreeService layerTreeService;
	
	@Resource(name="mapsService")
	private MapsService mapsService;
	
	@Resource(name="userStorageService")
	private UserStorageService userStorageService;
	
	private String HOST_IP = "";
	
	public LayerTreeController() {
	
		try {
			this.HOST_IP =Inet4Address.getLocalHost().getHostName();
		}
		
		catch ( UnknownHostException e ) {
			logger.info("unknowhost exception");
		}
	}
	
	@RequestMapping(value="/ide/getLayerTreeInfo.do",method=RequestMethod.POST)
	public String getLayerTreeInfo(HttpServletRequest request, Model model) {
		String midStr = request.getParameter("mid");
		
		if(midStr == null) {
			try {
				throw new NullPointerException();
			} catch (NullPointerException e) {
				logger.error("NullPointerError-NullPointerException");
			}
			
		}
		
		int mid = Integer.parseInt(midStr);
		
		LayerTreeVO vo = new LayerTreeVO();
		vo.setMid(mid);
		
		try {
			vo = layerTreeService.getLayerTreeInfo(vo);
		} catch (SQLException e3) {
			logger.error("SQLError-SQLException");
			
		}
		
		int status =404;
		String json_path = "";
		
		// JSON 파일 읽기
		JSONObject js =null;
		JSONArray jsonArr = null;
		FileReader fr = null;

		if(vo == null) {
			
			status=404;
			
		}else {
			
			status =200;
			json_path = vo.getGroup_path();
			
			try {
				fr = new FileReader(json_path);
				Object obj = new JSONParser().parse(fr);
				
		        // typecasting ob to JSONObject
				jsonArr = (JSONArray) obj;
				
			} catch (FileNotFoundException e) {
				logger.error("File Error-FileNotFoundException");
			}catch(IOException e1) {
				logger.error("Data Access Error-IOException");
			}catch(ParseException e2) {
				logger.error("Parsing Error-ParseException");
			} finally {
				if(fr != null)
					try {
						fr.close();
					} catch (IOException e) {
						logger.error("IO Error-IOException");
					}
			}
			
			model.addAttribute("DATA",jsonArr);
		}
		
		
		model.addAttribute("STATUS",status);
		
		
		return "jsonView";
	}
	
	@RequestMapping(value="/ide/saveLayerTree.do",method=RequestMethod.POST)
	public String saveLayerTree(@RequestParam(value="FILE", required=false) MultipartFile jsonFile,@RequestParam(value="NAME", required=false) String name,Model model, HttpServletRequest request) throws SQLException{
				
		if(jsonFile == null) {
			try {
				throw new NullPointerException();
			} catch (NullPointerException e) {
				logger.error("NullPointerError-NullPointerException");
			}
			
		}

		HttpSession session = request.getSession(true);
		
		SessionVO sessionVO = new SessionVO();
		sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");
		
		int mid = sessionVO.getSessMid();
		
		String userId = sessionVO.getSessMemId();
		
		String fileName = "";
		if(jsonFile != null) fileName = jsonFile.getOriginalFilename();

		UserStorageVO userStorage = userStorageService.getUserStorageInfo(HOST_IP);
		String FILE_SERVER_PATH = userStorage.getMount_directory();
		String FILE_SERVER_URL = userStorage.getDir_url();
		
		//로컬
		String filePath = FILE_SERVER_PATH+userId+"/LAYER_TREE/";
		String urlPath = FILE_SERVER_URL+userId+"/LAYER_TREE/"+fileName;
		
		if(filePath != null) filePath = filePath.replaceAll("\\\\", "").replaceAll("&", "");
		if(fileName != null) fileName = fileName.replaceAll("/", "").replaceAll("\\\\", "");

		//서버
		//String filePath = FILE_SERVER_PATH+File.separator+dir;
		//String urlPath = FILE_DIR+File.separator+dir+fileName;
		
		File checkFile = new File(filePath+fileName);
		
		HashMap<String, Object> result = new HashMap<>();
		
		int status=400;
		
		if(!checkFile.isFile()) {
			LayerTreeVO vo = new LayerTreeVO();
			vo.setMid(mid);
			vo.setName(name);
			vo.setGroup_path(filePath+fileName);
			vo.setGroup_url(urlPath);

			int rs = layerTreeService.insertLayerInfo(vo);
			int lgid = vo.getLgid();
			
			model.addAttribute("LGID",lgid);
			
			if(rs !=  0) {
				status=200;
			}
			
		}
		
		boolean upload= false;
		if(jsonFile != null && filePath != null) upload= multiFileUploadService.saveSingleFileToDir(jsonFile, filePath);
		
		if(upload) {
			status=200;
			//result.put("layer_url",urlPath);
		}
		
		result.put("STATUS",status);
		model.addAttribute("INFO",result);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/ide/loadLayerGroupList.do",method=RequestMethod.POST)
	public String loadLayerGroupList(Model model, HttpServletRequest request) throws SQLException{
				
		HttpSession session = request.getSession(true);
		
		SessionVO sessionVO = new SessionVO();
		sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");
		
		int mid = sessionVO.getSessMid();
		
		List<LayerTreeVO> layerGroupList = layerTreeService.getMyLayerGroupList(mid);
		
		model.addAttribute("layerGroupList",layerGroupList);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/ide/updateLayerGroupName.do",method=RequestMethod.POST)
	public String updateLayerGroupName(HttpServletRequest request, Model model) {
		int lgid = Integer.parseInt(request.getParameter("lgid"));
		String name = request.getParameter("name");
		
		LayerTreeVO vo = new LayerTreeVO();
		vo.setLgid(lgid);
		vo.setName(name);
		
		int status=400;
		
		int upload = layerTreeService.updateLayerGroupName(vo);
		
		if(upload == 1) {
			status=200;
		}
		
		model.addAttribute("status",status);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/ide/deleteLayerGroup.do",method=RequestMethod.POST)
	public String deleteLayerGroup(Model model, HttpServletRequest request) throws SQLException{
		
		int lgid = Integer.parseInt(request.getParameter("lgid"));
		
		List<MapsVO> list = mapsService.checkLayerGroupUse(lgid);
		
		int count = list.size();
		
		if(count == 0) {
			layerTreeService.deleteLayerGroup(lgid);
			
		} 
		
		model.addAttribute("exist", count);
		model.addAttribute("list", list);
	
		
		return "jsonView";
	}
	
	@RequestMapping(value="/layer/getLayerGroupInfo.do",method=RequestMethod.POST)
	public String getLayerGroupInfo(HttpServletRequest request, Model model) throws SQLException {
		int lgid = Integer.parseInt(request.getParameter("lgid"));
		
		LayerTreeVO vo = new LayerTreeVO();
		vo.setLgid(lgid);
		
		vo = layerTreeService.getLayerGroupInfo(vo);
		
		int status =404;
		String json_path = "";
		
		// JSON 파일 읽기
		JSONObject js =null;
		JSONArray jsonArr = null;
		FileReader fr = null;
	
		if(vo == null) {
			
			status=404;
			
		}else {
			
			status =200;
			json_path = vo.getGroup_path();
			
			try {
				fr = new FileReader(json_path);
				Object obj = new JSONParser().parse(fr);
				
		        // typecasting ob to JSONObject
				jsonArr = (JSONArray) obj;
				
			} catch (FileNotFoundException e) {
				logger.error("File Error-FileNotFoundException");
			}catch(IOException e1) {
				logger.error("Data Access Error-IOException");
			}catch(ParseException e2) {
				logger.error("Parsing Error-ParseException");
			} finally {
				if(fr != null)
					try {
						fr.close();
					} catch (IOException e) {
						logger.error("Error-IOException");
					}
			}
			
			model.addAttribute("DATA",jsonArr);
		}
		
		model.addAttribute("LAYER",vo);
		model.addAttribute("STATUS",status);
		
		
		return "jsonView";
	}
}
