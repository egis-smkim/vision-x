package com.vision_x.vision_x.utils;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.apache.commons.io.FileUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.json.JSONTokener;
import org.json.XML;
import org.json.simple.parser.JSONParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

@Service
public class XmlParserService {
	protected Logger logger = LoggerFactory.getLogger(this.getClass());
	public HashMap<String, String> xmlFileToParser(String path){
		
		HashMap<String, String> result = new HashMap<>();
		if(path != null) path = path.replaceAll("\\\\", "").replaceAll("&", "");

		File file = new File(path);
		DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
		
		try {
			DocumentBuilder db = dbf.newDocumentBuilder();
			Document document = db.parse(file);
			
			Element root = document.getDocumentElement();
			
			NodeList children = root.getChildNodes();
			String epsg="";
			
			String centerX ="";
			String centerY ="";
			String centerZ ="";
			
			for(int i=0;i<children.getLength();i++) {
				Node node = children.item(i);
				
				if(node.getNodeType() == Node.ELEMENT_NODE) {
				
					Element ele  = (Element)node;
					String nodeName = ele.getNodeName();
					
					if(nodeName.toLowerCase().equals("local")) {
						
						centerX = ele.getAttribute("x");
						centerY = ele.getAttribute("y");
						centerZ = ele.getAttribute("z");
						
					}else if(nodeName.toLowerCase().equals("srs")) {
						
						epsg = ele.getTextContent();
						
					}
					
					if(!centerX.equals("") && !centerY.equals("") && !centerZ.equals("") && !epsg.equals("")) {
						break;
					}

				}
			}

			result.put("x", centerX);
			result.put("y", centerY);
			result.put("z", centerZ);
			result.put("epsg",epsg);
			result.put("STATUS","OK");
			
		} catch (ParserConfigurationException e) {
			result.put("STATUS","ERROR");
			logger.error("Configuration Error-ParserConfigurationException");
		} catch (SAXException e) {
			result.put("STATUS","ERROR");
			logger.error("SAX Error-SAXException");
		} catch (IOException e) {
			result.put("STATUS","ERROR");
			logger.error("Data Access Error-IOException");
		}
		
		return result;
	}
	
	public HashMap<String, Object> createXmltoJsonFile(String dir,String fileName) {

		HashMap<String, Object> rs = new HashMap<>();
		if(dir != null) dir = dir.replaceAll("\\\\", "");
		if(fileName != null) fileName = fileName.replaceAll("/", "").replaceAll("\\\\", "");

		String path = dir+fileName;
		String jsonFileName = "";
		if(fileName != null) jsonFileName = fileName.split("\\.")[0];
		File file =new File(path);
		
		FileWriter fileJson=null;
		DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
		
		try {
			
			DocumentBuilder db = dbf.newDocumentBuilder();
			Document document = db.parse(file);
			
			String encoding = document.getXmlEncoding();

			String xml = FileUtils.readFileToString(file,encoding);
			
			JSONObject jsonObj = XML.toJSONObject(xml);

			fileJson = new FileWriter(dir+jsonFileName+".json");
			fileJson.write(jsonObj.toString());
			fileJson.flush();
			JSONObject gpxObj = jsonObj.getJSONObject("gpx");
			
			String metadataStr = "";
			String wptStr = "";
			String rteStr="";
			String trkStr="";
			
			if(!gpxObj.isNull("metadata")) {
			
				JSONObject metaObj = gpxObj.getJSONObject("metadata");
				metadataStr = metaObj.toString();
				
			}
			
			if(!gpxObj.isNull("wpt")) {
				JSONArray wptObj = gpxObj.getJSONArray("wpt");
				wptStr = wptObj.toString();
			}
			
			if(!gpxObj.isNull("trk")) {
				JSONObject trkObj = gpxObj.getJSONObject("trk");
				trkStr = trkObj.toString();
			}
			
			if(!gpxObj.isNull("rte")) {
				JSONObject rteObj = gpxObj.getJSONObject("rte");
				rteStr = rteObj.toString();
			}
			
			rs.put("METADATA",metadataStr);
			rs.put("WPT",wptStr);
			rs.put("RTE",rteStr);
			rs.put("TRK",trkStr);
			
			rs.put("STATE",1);
			
		} catch (ParserConfigurationException e) {
			logger.error("Configuration Error-ParserConfigurationException");
			rs.put("FILE_NAME", "");
			rs.put("STATE",0);
			
			return rs;
		} catch (SAXException e) {
			logger.error("SAX Error-SAXException");
			rs.put("FILE_NAME", "");
			rs.put("STATE",0);
			
			return rs;
		} catch (IOException e) {
			logger.error("Data Access Error-IOException");
			rs.put("FILE_NAME", "");
			rs.put("STATE",0);
			
			return rs;
		}finally {
			
			if(fileJson != null) {
				try {
					fileJson.close();
				} catch (IOException e) {
					logger.error("Data Access Error-IOException");
				}
			}
		}
		
		return rs;
	}
	
	public HashMap<String, List<?>> getGpxJsonInfo(String path, String fileName){
		if(path != null) path = path.replaceAll("\\\\", "").replaceAll("&", "");

		HashMap<String, List<?>> result = new HashMap<>();
		
		JSONTokener tokener = null;
		InputStream input = null;
		
		try {
			
			input = new FileInputStream(path);
			tokener = new JSONTokener(input);
			JSONObject jsonObj = new JSONObject(tokener);
			
			JSONObject gpxObj = jsonObj.getJSONObject("gpx");
			
			List<HashMap<String, Object>> wptInfo = new ArrayList<HashMap<String,Object>>();
			List<HashMap<String, Object>> rteInfo = new ArrayList<HashMap<String,Object>>();
			List<HashMap<String, Object>> trkInfo = new ArrayList<HashMap<String,Object>>();
	
			if(!gpxObj.isNull("wpt")) {

				JSONArray wptObj = gpxObj.getJSONArray("wpt");
				
				for(int i=0;i<wptObj.length();i++) {
					JSONObject record = wptObj.getJSONObject(i);
					
					HashMap<String, Object> param = new HashMap<>();
					
					String name = "";
					double lon=0.0;
					double lat=0.0;
					double alt=0.0;
					
					if(!record.isNull("name")) {
						name = record.getString("name");
					}
					
					if(!record.isNull("lon")) {
						lon = record.getDouble("lon");
					}
					
					if(!record.isNull("lat")) {
						lat = record.getDouble("lat");
					}
					
					if(!record.isNull("ele")) {
						alt = record.getDouble("ele");
					}
					
					param.put("name",name);
					param.put("lon",lon);
					param.put("lat",lat);
					param.put("alt",alt);
					
					wptInfo.add(param);
				}
				
			}
			
			if(!gpxObj.isNull("trk")) {
				
				JSONObject trkObj = gpxObj.getJSONObject("trk");
				
				if(!trkObj.isNull("trkseg")) {
					
					JSONObject trkseq = trkObj.getJSONObject("trkseg");
					
					if(!trkseq.isNull("trkpt")) {
						JSONArray trkpt = trkseq.getJSONArray("trkpt");
						
						for(int i=0;i<trkpt.length();i++) {
							
							HashMap<String, Object> param = new HashMap<>();
							
							JSONObject lonLatInfo = trkpt.getJSONObject(i);
							
							double lon =0.0;
							double lat =0.0;
							double alt =0.0;
							double height =0.0;
							
							String time = "";
							if(!lonLatInfo.isNull("lon")) {
								lon = lonLatInfo.getDouble("lon");
							}
							
							if(!lonLatInfo.isNull("lat")) {
								lat = lonLatInfo.getDouble("lat");
							}
							
							if(!lonLatInfo.isNull("ele")) {
								alt = lonLatInfo.getDouble("ele");
							}
							
							if(!lonLatInfo.isNull("time")) {
								time=lonLatInfo.getString("time");
							}
							
							if(!lonLatInfo.isNull("geoidheight")) {
								height = lonLatInfo.getDouble("geoidheight");
							}
							
							param.put("lon",lon);
							param.put("lat",lat);
							param.put("alt",alt);
							param.put("height",height);
							param.put("time",time);
							
							trkInfo.add(param);
							
						}
					}
					
				}
			}
			
			if(!gpxObj.isNull("rte")) {
				JSONObject rteObj = gpxObj.getJSONObject("rte");
				
				if(!rteObj.isNull("rtept")) {
					
					JSONArray rtept = rteObj.getJSONArray("rtept");
					
					for(int i=0;i<rtept.length();i++) {
						
						HashMap<String, Object> param = new HashMap<>();
						
						JSONObject lonLatInfo = rtept.getJSONObject(i);
						
						double lon =0.0;
						double lat =0.0;
						double alt =0.0;
						double height =0.0;
						
						String time = "";
						if(!lonLatInfo.isNull("lon")) {
							lon = lonLatInfo.getDouble("lon");
						}
						
						if(!lonLatInfo.isNull("lat")) {
							lat = lonLatInfo.getDouble("lat");
						}
						
						if(!lonLatInfo.isNull("ele")) {
							alt = lonLatInfo.getDouble("ele");
						}
						
						if(!lonLatInfo.isNull("time")) {
							time=lonLatInfo.getString("time");
						}
						
						if(!lonLatInfo.isNull("geoidheight")) {
							height = lonLatInfo.getDouble("geoidheight");
						}
						
						param.put("lon",lon);
						param.put("lat",lat);
						param.put("alt",alt);
						param.put("height",height);
						param.put("time",time);
						
						rteInfo.add(param);
						
					}
				}
				
			}
			
			
			result.put("RTE",rteInfo);
			result.put("TRK",trkInfo);
			result.put("WPT",wptInfo);
			
		} catch (FileNotFoundException e) {
			logger.error("File Error-FileNotFoundException");
		} finally {
			if(input!=null) {
				try {
					input.close();
				} catch (IOException e) {
					logger.error("Data Access Error-IOException");
				}
			}
		}
		
		return result;
	}
}
