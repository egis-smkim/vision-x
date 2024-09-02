package com.vision_x.vision_x.utils;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.MalformedURLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

import org.apache.commons.lang.NullArgumentException;
import org.geotools.geometry.jts.JTSFactoryFinder;
import org.geotools.referencing.CRS;
import org.json.JSONObject;
import org.locationtech.jts.geom.Geometry;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.io.ParseException;
import org.locationtech.jts.io.WKTReader;
import org.locationtech.jts.simplify.TopologyPreservingSimplifier;
import org.opengis.referencing.FactoryException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class PdalService {
	
	protected Logger logger = LoggerFactory.getLogger(this.getClass());

	public HashMap<String, Object> pclMetadataInfo(String path) {
		
		HashMap<String, Object> metaInfo = new HashMap<>();
		
		if((path.indexOf("||") !=-1) || (path.indexOf("&&") !=-1) ) {
			logger.error("사용할 수 없는 명령어입니다.");
			return null;
		}

		String[] excuteCmdArr = new String[] {"pdal","info","--metadata",path};
		
		if(excuteCmdArr[0].indexOf("pdal") == -1) {
			logger.error("사용할 수 없는 명령어입니다.");
			return null;
		}
		
		ProcessBuilder processbuilder = new ProcessBuilder(excuteCmdArr);
		processbuilder.redirectErrorStream(true);
		
		Process process = null;
		InputStream stdout = null;
		JSONObject extent = null;
		InputStreamReader inputStreamReader = null;
		try {
			
			process =processbuilder.start();
			stdout = process.getInputStream();
			inputStreamReader = new InputStreamReader(stdout);
			
			try(BufferedReader reader = new BufferedReader(inputStreamReader)) {

				String outLine;
				
				StringBuilder returnValue = new StringBuilder();
				
				while((outLine = reader.readLine()) != null) {
					if(!outLine.contains("not found")) returnValue.append(outLine);
				}
				
				process.waitFor();
				
				extent = new JSONObject(returnValue.toString());
				
				JSONObject metaObj = extent.getJSONObject("metadata");
				
				long count = metaObj.getLong("count");
				
				double maxx = metaObj.getDouble("maxx");
				double maxy = metaObj.getDouble("maxy");
				double maxz = metaObj.getDouble("maxz");
				
				double minx = metaObj.getDouble("minx");
				double miny = metaObj.getDouble("miny");
				double minz = metaObj.getDouble("minz");
				
				String wktStr = metaObj.getString("spatialreference");
				//metaInfo.put("SRS_WKT", wktStr);
				
				metaInfo.put("COUNT", count);
				metaInfo.put("maxx", maxx);
				metaInfo.put("maxy", maxy);
				metaInfo.put("maxz", maxz);
				metaInfo.put("minx", minx);
				metaInfo.put("miny", miny);
				metaInfo.put("minz", minz);
				
				int code = 0;
				
				if(CRS.lookupEpsgCode(CRS.parseWKT(wktStr), true) != null) {//tif만 있고 좌표계가 없을 경우
					code = CRS.lookupEpsgCode(CRS.parseWKT(wktStr), true);
				}else {
					code =0;
				}
				
				metaInfo.put("CODE", code);
				
			} catch (IOException e) {
				metaInfo.put("CODE", 0);
				logger.error("Data Access Error-IOException");
			} catch (FactoryException e) {
				metaInfo.put("CODE",0);
				logger.error("CRS-related Error-FactoryException");
			} catch (InterruptedException e) {
				metaInfo.put("CODE", 0);
				logger.error("Thread Error-InterruptedException");
			}finally {
				try {
					if(stdout != null) stdout.close();
					if(inputStreamReader != null) inputStreamReader.close();
				} catch (IOException e) {
					logger.error("Data Access Error-IOException");
				}
			}
		} catch (IOException e2) {
			metaInfo.put("ERROR", "ERROR");
			logger.error("Data Access Error-IOException");
			return metaInfo;
		}
		
		return metaInfo;
		
	}
	
	public String getBoundarySimplified(String path) {
		
		String geometryWkt="";
		
		if((path.indexOf("||") !=-1) || (path.indexOf("&&") !=-1) ) {
			logger.error("사용할 수 없는 명령어입니다.");
			return null;
		}

		String[] excuteCmdArr = new String[] {"pdal","info","--boundary",path};
		
		if(excuteCmdArr[0].indexOf("pdal") == -1) {
			logger.error("사용할 수 없는 명령어입니다.");
			return null;
		}
		
		ProcessBuilder processbuilder = new ProcessBuilder(excuteCmdArr);
		processbuilder.redirectErrorStream(true);
		
		Process process = null;
		InputStream stdout = null;
		InputStreamReader inputStreamReader = null;
		JSONObject extent = null;
		try {
			
			process = processbuilder.start();
			stdout = process.getInputStream();
			inputStreamReader = new InputStreamReader(stdout);
			
			try(BufferedReader reader = new BufferedReader(inputStreamReader)) {

				String outLine;
				
				StringBuilder returnValue = new StringBuilder();
				
				while((outLine = reader.readLine()) != null) {
					
					if(!outLine.contains("not found")) returnValue.append(outLine);
				}
				
				extent = new JSONObject(returnValue.toString());
				
				JSONObject boundaryObj = extent.getJSONObject("boundary");
				String wktInfo = boundaryObj.getString("boundary");
				
				logger.info("WKT INFO:"+wktInfo);
				
				GeometryFactory geometryFactory = JTSFactoryFinder.getGeometryFactory();
				WKTReader readerWkt = new WKTReader(geometryFactory);
				
				Geometry polygon = (Geometry)readerWkt.read(wktInfo);
				geometryWkt=polygon.convexHull().toString();
				
				/*TopologyPreservingSimplifier simplePolyg = new TopologyPreservingSimplifier(polygon);
				
				Geometry polygon2=simplePolyg.simplify(polygon, 500);
				
				geometryWkt=polygon2.toString();*/
				
			} catch (IOException e) {
				geometryWkt="NO";
				logger.error("Data Access Error-IOException");
				return geometryWkt;
			} catch (ParseException e) {
				geometryWkt="NO";
				logger.error("Parsing Error-ParseException");
				return geometryWkt;
			}finally {
				try {
					if(stdout != null) {
						stdout.close();
					}
					if(inputStreamReader != null) {
						inputStreamReader.close();
					}
				} catch (IOException e) {
					
					geometryWkt="NO";
					logger.error("Data Access Error-IOException");
					return geometryWkt;
				}
			}
			
			process.waitFor();
			
		} catch (IOException e) {
			geometryWkt="NO";
			logger.error("Data Access Error-IOException");
			return geometryWkt;
		} catch (InterruptedException e) {
			geometryWkt="NO";
			logger.error("Thread Error-InterruptedException");
			return geometryWkt;
		}
		
		return geometryWkt;
	}
	
}
