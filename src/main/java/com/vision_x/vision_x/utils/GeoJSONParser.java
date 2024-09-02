package com.vision_x.vision_x.utils;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;


@Service
public class GeoJSONParser {
	
	protected Logger logger = LoggerFactory.getLogger(this.getClass());
	
	@Value("#{globalInfo['Globals.postgresql.host']}")
	private String GEO_DB_HOST;
	
	@Value("#{globalInfo['Globals.postgresql.port']}")
	private String GEO_DB_PORT;
	
	@Value("#{globalInfo['Globals.postgresql.password']}")
	private String GEO_DB_PASS;
	
	public HashMap<String, Object> getGeojsonMetadata(String path){
		
		HashMap<String, Object> result = new HashMap<>();
		//1.예외처리 파일 존재유무
		//2.geojson 파일 스티링 읽기
		//3.geojson 파싱
		//4.geojson 바운더리 체크
		//5.geojson 좌표계 체크
		//6.geojson feautre list일 경우 카운트 체크
		//7.geojson geometry type 체크
		File geojsonFile = new File(path);
		BufferedReader br = null;
		FileReader fr = null;
		
		if(geojsonFile.exists()) {
			
			try {
				
				fr = new FileReader(geojsonFile);
				br = new BufferedReader(fr);
				
				StringBuffer response = new StringBuffer();
				String geoJson="";
				
				while((geoJson = br.readLine()) != null) {
					response.append(geoJson);
				}
				
				JSONParser parser = new JSONParser();
				JSONObject jsonObj = (JSONObject)parser.parse(response.toString());
				
				String type = "";
				Object[] bbox = null;
				
				if(jsonObj.containsKey("type")) {
					type=String.valueOf(jsonObj.get("type"));
				}
				
				if(jsonObj.containsKey("bbox")) {
					JSONArray jsonArr = (JSONArray)jsonObj.get("bbox");
					bbox=jsonArr.toArray();
				}
				
				String epsgCode="";
				if(jsonObj.containsKey("crs")) {
					JSONObject obj = (JSONObject)jsonObj.get("crs");
					
					if(obj.containsKey("properties")) {
						JSONObject crsObj = (JSONObject)obj.get("properties");
						epsgCode = String.valueOf(crsObj.get("name"));
					}
					
				}
				
				int featuresCnt = 0;
				List<HashMap<String, Object>> attrList = new ArrayList<>();
				
				if(type.toLowerCase().equals("featurecollection")) {
					JSONArray jsonArr = (JSONArray)jsonObj.get("features");
					featuresCnt = jsonArr.size();
					
					JSONObject propObj = (JSONObject)jsonArr.get(0);
					
					if(propObj.containsKey("properties")) {
						JSONObject propArr = (JSONObject)propObj.get("properties");
						
						HashMap<String, Object> jsonMap = new ObjectMapper().readValue(propArr.toJSONString(), HashMap.class);
						attrList.add(jsonMap);
					}

					
				}else {
					JSONObject propObj = (JSONObject)jsonObj.get("properties");
					HashMap<String, Object> jsonMap = new ObjectMapper().readValue(propObj.toJSONString(), HashMap.class);
					
					attrList.add(jsonMap);
				}
				
				//속성 존재여 부
				result.put("epsg",epsgCode);
				result.put("type",type);
				result.put("fc",featuresCnt);
				result.put("bbox",bbox);
				result.put("props",attrList);
				
			} catch (FileNotFoundException e) {
				result.put("error","no file");
				logger.error("[ERROR-GJP-001] - FileNotFoundException");
			} catch (IOException e) {
				result.put("error","io");
				logger.error("[ERROR-GJP-002] - IOException");
			} catch (ParseException e) {
				result.put("error","parsing");
				logger.error("[ERROR-GJP-003] - ParseException");
			}finally {
				
				if(fr !=null) {
					try {
						fr.close();
					} catch (IOException e) {
						// TODO Auto-generated catch block
						logger.error("[ERROR-GJP-001-close] - IOException");
					}
				}
				
				if(br != null) {
					try {
						br.close();
					} catch (IOException e) {
						logger.error("[ERROR-GJP-002-close] - IOException");
					}
				}
			}
			
		}else {
			
		}
		
		return result;
		
	}
	
	public List<HashMap<String, String>> changeCharset(String path, String encoding){
		
		List<HashMap<String, String>> result = new ArrayList<>();
		
		File geojsonFile = new File(path);
		BufferedReader br = null;
		FileReader fr = null;
		
		if(geojsonFile.exists()) {
			
			try {
				
				fr = new FileReader(geojsonFile,Charset.forName(encoding));
				br = new BufferedReader(fr);
				
				StringBuffer response = new StringBuffer();
				String geoJson="";
				
				while((geoJson = br.readLine()) != null) {
					response.append(geoJson);
				}
				
				JSONParser parser = new JSONParser();
				JSONObject jsonObj = (JSONObject)parser.parse(response.toString());
				
				String type = "";
				if(jsonObj.containsKey("type")) {
					type=String.valueOf(jsonObj.get("type"));
				}
				
				
				if(type.toLowerCase().equals("featurecollection")) {
					JSONArray jsonArr = (JSONArray)jsonObj.get("features");
					int featuresCnt = jsonArr.size();
					
					JSONObject propObj = (JSONObject)jsonArr.get(0);
					
					if(propObj.containsKey("properties")) {
						JSONObject propArr = (JSONObject)propObj.get("properties");
						
						HashMap<String, String> jsonMap = new ObjectMapper().readValue(propArr.toJSONString(), HashMap.class);
						result.add(jsonMap);
					}

					
				}else {
					JSONObject propObj = (JSONObject)jsonObj.get("properties");
					HashMap<String, String> jsonMap = new ObjectMapper().readValue(propObj.toJSONString(), HashMap.class);
					
					result.add(jsonMap);
				}
				
			} catch (FileNotFoundException e) {
				logger.error("[ERROR-GJP-001] - FileNotFoundException");
			} catch (IOException e) {
				logger.error("[ERROR-GJP-002] - IOException");
			} catch (ParseException e) {
				logger.error("[ERROR-GJP-003] - ParseException");
			}finally {
				
				if(fr !=null) {
					try {
						fr.close();
					} catch (IOException e) {
						// TODO Auto-generated catch block
						logger.error("[ERROR-GJP-001-close] - IOException");
					}
				}
				
				if(br != null) {
					try {
						br.close();
					} catch (IOException e) {
						logger.error("[ERROR-GJP-002-close] - IOException");
					}
				}
			}
			
		}
		
		return result;
	}
	
	public boolean convertPostgis(String path,String fileName,String dataStore, String epsgCode, String encoding) {
		
		boolean result = false;
		
		String dbInfo = "PG:host="+GEO_DB_HOST+" user=digitaltwin dbname=digitaltwin password="+GEO_DB_PASS;
		String layerName = fileName.split("\\.")[0];
		
		String[] executeCommand = new String[] {
												"ogr2ogr", 
												"--config", 
												"PG_USE_COPY",
												"YES",
												"-f",
												"PostgreSQL",
												dbInfo,
												"-a_srs",
												epsgCode,
												path+fileName,
												"-overwrite",
												"-nln",
												dataStore+"."+layerName,
												"-lco",
												"GEOMETRY_NAME=geom"
												};
		
		if(executeCommand[0].indexOf("ogr2ogr") == -1) {
			logger.error("사용할 수 없는 명령어입니다.");
			return false;
		}
		
		Process ps = null;
		ProcessBuilder pb = new ProcessBuilder(executeCommand);
		pb.inheritIO();
		
		try {
			
			ps = pb.start();
			ps.waitFor();
			
			result=true;
		} catch (IOException e) {
			logger.error("Params IOException");
		} catch(InterruptedException e){
			logger.error("Params InterruptedException");
		}finally {
			
			if(ps != null) {
				ps.destroy();
			}
		}
		
		return result;
	}
	
}
