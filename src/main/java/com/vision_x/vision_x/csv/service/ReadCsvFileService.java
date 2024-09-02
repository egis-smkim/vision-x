/*
 *  csv 파일 읽기 클래스
 *  헤더 리스트 가져오기
 *  레코드 리스트 가져오기
 * */
package com.vision_x.vision_x.csv.service;

import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.Rectangle;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.net.MalformedURLException;
import java.nio.ByteBuffer;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.PosixFilePermission;
import java.nio.file.attribute.PosixFilePermissions;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.imageio.ImageIO;
import javax.imageio.stream.ImageOutputStream;

import org.apache.commons.codec.binary.Hex;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVPrinter;
import org.apache.commons.csv.CSVRecord;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.input.BOMInputStream;
import org.bouncycastle.crypto.CryptoServicesRegistrar;
import org.geotools.feature.DefaultFeatureCollection;
import org.geotools.feature.simple.SimpleFeatureBuilder;
import org.geotools.feature.simple.SimpleFeatureTypeBuilder;
import org.geotools.geometry.jts.JTSFactoryFinder;
import org.geotools.geometry.jts.ReferencedEnvelope;
import org.geotools.map.FeatureLayer;
import org.geotools.map.Layer;
import org.geotools.map.MapContent;
import org.geotools.referencing.crs.DefaultGeographicCRS;
import org.geotools.renderer.GTRenderer;
import org.geotools.renderer.label.LabelCacheImpl;
import org.geotools.renderer.lite.StreamingRenderer;
import org.geotools.styling.SLD;
import org.geotools.styling.Style;
import org.geotools.tile.TileService;
import org.geotools.tile.impl.osm.OSMService;
import org.geotools.tile.util.TileLayer;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.Envelope;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.LineString;
import org.locationtech.jts.geom.Point;
import org.mozilla.universalchardet.UniversalDetector;
import org.opengis.feature.simple.SimpleFeature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.vision_x.vision_x.geocoding.service.GeocodingService;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service
public class ReadCsvFileService extends EgovAbstractServiceImpl{
	protected Logger logger = LoggerFactory.getLogger(this.getClass());
	//header 리스트 가져오기
	public HashMap<String, Object> getHeaderList(String fileDir) throws IOException{
		if(fileDir != null) fileDir = fileDir.replaceAll("\\\\", "").replaceAll("&", "");

		HashMap<String,Object> rsHeader = new HashMap<>();
		
		String checkEncoding = checkCharset(fileDir);
		
		CSVFormat format = CSVFormat.RFC4180.withHeader().withDelimiter(',');
		CSVParser parseCsv = CSVParser.parse(new File(fileDir), Charset.forName(checkEncoding), format);
		
		rsHeader.put("HEADER_LENGTH", parseCsv.getHeaderNames().size());
		rsHeader.put("HEADERS", parseCsv.getHeaderNames());
		
		parseCsv.close();
		
		return rsHeader;
	}
	
	//header 리스트 가져오기
	public HashMap<String, Object> getHeaderCharsetList(String fileDir,String encoding) throws IOException {
		//if(fileDir != null) fileDir = fileDir.replaceAll("\\\\", "").replaceAll("&", "");
	
		HashMap<String,Object> rsHeader = new HashMap<>();
		
		CSVFormat format = CSVFormat.RFC4180.withHeader().withDelimiter(',');
		CSVParser parseCsv = CSVParser.parse(new File(fileDir), Charset.forName(encoding), format);
		
		List<String> headers = parseCsv.getHeaderNames();
		
		rsHeader.put("HEADER_LENGTH", parseCsv.getHeaderNames().size());
		rsHeader.put("HEADERS", headers);
		
		parseCsv.close();
		
		return rsHeader;
	}
	
	//가시화 데이터 가져오기
	public HashMap<String,Object> getCustomizeData(String fileDir, int marker_text, int lon_indx, int lat_indx){
		
		HashMap<String, Object> result = new HashMap<>();
		List<HashMap<String, Object>> list = new ArrayList<>();
		if(fileDir != null) fileDir = fileDir.replaceAll("\\\\", "").replaceAll("&", "");

		try {
			String checkEncoding=checkCharset(fileDir);
			
			if(checkEncoding.equals("no detected")) {
				checkEncoding="EUC-KR";
			}
			
			CSVFormat format = CSVFormat.RFC4180.withHeader().withDelimiter(',');
			CSVParser parseCsv = CSVParser.parse(new File(fileDir), Charset.forName(checkEncoding), format);
			
			List<CSVRecord> records = parseCsv.getRecords();
			
			GeometryFactory geometryFactory = JTSFactoryFinder.getGeometryFactory();
	        SimpleFeatureTypeBuilder pointTb = new SimpleFeatureTypeBuilder();
	        
	        pointTb.setName("csvPoints");
	        pointTb.add("point",Point.class);
	        
	    	final DefaultFeatureCollection pointCollection = new DefaultFeatureCollection();
			SimpleFeatureBuilder pointFeatureBuilder = new SimpleFeatureBuilder(pointTb.buildFeatureType());

			for(int i=0;i<records.size();i++) {
				
				HashMap<String, Object> map = new HashMap<>();
				
				CSVRecord record = records.get(i);
				String lonStr =record.get(lon_indx);
				String latStr = record.get(lat_indx);
				String textStr = record.get(marker_text);
				
				if(!lonStr.trim().equals("") || !latStr.trim().equals("")) {

					double lon = Double.parseDouble(lonStr);
					double lat = Double.parseDouble(latStr);
					
					if((lat >= -90.000000  && lat <= 90.000000) && (lon >= -180.000000  && lon <= 180.000000)) {
						map.put("indx", Integer.toString(i));
						map.put("text", textStr);
						map.put("lon", lon);
						map.put("lat",lat);
						
						Point point = geometryFactory.createPoint(new Coordinate(lon,lat));
						pointFeatureBuilder.add(point);
						
						SimpleFeature feature = pointFeatureBuilder.buildFeature(null);
						pointCollection.add(feature);
						
						list.add(map);
					}else {
						
						continue;
						
					}
					
				}
				
			}
			
			double maxx = pointCollection.getBounds().getMaxX();
			double maxy = pointCollection.getBounds().getMaxY();
			double minx = pointCollection.getBounds().getMinX();
			double miny = pointCollection.getBounds().getMinY();
			
			double[] bounds = new double[] {minx,miny,maxx,maxy};
			result.put("bound", bounds);
			
		} catch (IOException e) {
			logger.error("Data Access Error-IOException");
		}
		
		
		result.put("records", list);
		
		return result;
	}
	
	public DefaultFeatureCollection getCustomizeGeocodeData(String fileDir,int marker,int addr_indx){
		
		
		DefaultFeatureCollection pointCollection = new DefaultFeatureCollection();
		if(fileDir != null) fileDir = fileDir.replaceAll("\\\\", "").replaceAll("&", "");

		try {
			String checkEncoding=checkCharset(fileDir);
			
			if(checkEncoding.equals("no detected")) {
				checkEncoding="EUC-KR";
			}
			
			CSVFormat format = CSVFormat.RFC4180.withHeader().withDelimiter(',');
			CSVParser parseCsv = CSVParser.parse(new File(fileDir), Charset.forName(checkEncoding), format);
			
			List<CSVRecord> records = parseCsv.getRecords();
			
			GeometryFactory geometryFactory = JTSFactoryFinder.getGeometryFactory();
	        SimpleFeatureTypeBuilder pointTb = new SimpleFeatureTypeBuilder();
	        
	        pointTb.setName("csvPoints");
	        pointTb.add("point",Point.class);
	        
	    	
			SimpleFeatureBuilder pointFeatureBuilder = new SimpleFeatureBuilder(pointTb.buildFeatureType());
			
			GeocodingService geocodingService = new GeocodingService();
			
			int recordSize = 0;
			if(records.size() >= 1000 ) {
				recordSize = 100;
			}else {
				recordSize =records.size();
			}
			for(int i=0;i<recordSize;i++) {
				
				CSVRecord record = records.get(i);
				
				if(!record.get(addr_indx).equals("") && record.get(addr_indx) != null) {
					String addr = record.get(addr_indx);
					
					if(addr != null) {
						double[] lonLat = geocodingService.getGeocodingCoordinates(addr);
						
						double lon=lonLat[0];
						double lat=lonLat[1];
						
						if(lon != 0 && lat != 0){
							
							Point point = geometryFactory.createPoint(new Coordinate(lon,lat));
							pointFeatureBuilder.add(point);
							
							SimpleFeature feature = pointFeatureBuilder.buildFeature(null);
							pointCollection.add(feature);
							
						}
					}
					
				}
			}
			
		} catch (IOException e) {
			logger.error("Data Access Error-IOException");
		}
		
		return pointCollection;
	}
	
	//샘플 리스트 가져오기
	public HashMap<String, Object> getCsvSampleRecordCharsetList(String fileDir,int length,String encoding) throws IOException{
		if(fileDir != null) fileDir = fileDir.replaceAll("\\\\", "").replaceAll("&", "");

		HashMap<String, Object> result = new HashMap<>();
		List<CSVRecord> list = new ArrayList<CSVRecord>();
		
		CSVFormat format = CSVFormat.RFC4180.withHeader().withDelimiter(',');
		CSVParser parseCsv = CSVParser.parse(new File(fileDir), Charset.forName(encoding), format);
		
		list = parseCsv.getRecords();
		
		List<String[]> resultRecord = new ArrayList<>();
		List<String> headers = parseCsv.getHeaderNames();
		
		for(int i=0;i<length;i++) {
			
			CSVRecord record = list.get(i);
			int size = record.size();
			String[] resultArr=new String[size];
			
			for(int j=0;j<size;j++) {
				resultArr[j] =record.get(j); 
			}
			
			resultRecord.add(resultArr);
		}
		
		result.put("LIST",resultRecord);
		result.put("HEADER",headers);
		result.put("SIZE",list.size());
		
		return result;
	}
	
	//샘플 리스트 가져오기
	public List<String[]> getCsvSampleRecordList(String fileDir,int length) throws IOException{
		if(fileDir != null) fileDir = fileDir.replaceAll("\\\\", "").replaceAll("&", "");

		List<CSVRecord> list = new ArrayList<CSVRecord>();
		
		String checkEncoding=checkCharset(fileDir);
		
		if(checkEncoding.equals("no detected")) {
			checkEncoding="EUC-KR";
		}
		
		boolean bomCheck=false;
		
		CSVFormat format = CSVFormat.RFC4180.withHeader().withDelimiter(',');
		CSVParser parseCsv = CSVParser.parse(new File(fileDir), Charset.forName(checkEncoding), format);
		
		list = parseCsv.getRecords();
		
		List<String[]> resultRecord = new ArrayList<>();
		for(int i=0;i<length;i++) {
			
			CSVRecord record = list.get(i);
			int size = record.size();
			//정수 오버플로우 취약점으로 인해 제한
			if(size > 100) size = 100;
			String[] resultArr=new String[size];
			
			for(int j=0;j<size;j++) {
				resultArr[j] =record.get(j); 
			}
			
			resultRecord.add(resultArr);
		}
		
		return resultRecord;
	}
	
	//특정 컬럼 데이터 가져오기
	public List<String> getColumnData(String filePath,int column,int size) throws IOException {
		if(filePath != null) filePath = filePath.replaceAll("\\\\", "").replaceAll("&", "");

		List<String> rs = new ArrayList<>();
		String checkEncoding=checkCharset(filePath);
		
		if(checkEncoding.equals("no detected")) {
			checkEncoding="EUC-KR";
		}
		
		CSVFormat format = CSVFormat.RFC4180.withHeader().withDelimiter(',');
		CSVParser parseCsv = CSVParser.parse(new File(filePath), Charset.forName(checkEncoding), format);
		
		List<CSVRecord> records = parseCsv.getRecords();
		
		for(int i=0;i<size;i++) {

			CSVRecord rec = records.get(i);
			String dataStr = rec.get(column);
			rs.add(dataStr);
			
		}
		
		parseCsv.close();
		
		return rs;
	}
	
	public HashMap<String, Double> getBoundary(String path, String fileName,String encoding,int lonIndx, int latIndx){
		if(path != null) path = path.replaceAll("\\\\", "").replaceAll("&", "");
		if(fileName != null) fileName = fileName.replaceAll("/", "").replaceAll("\\\\", "");


		HashMap<String, Double> result = new HashMap<>();
		
		double minx = 0.0;
		double miny = 0.0;
		double maxx = 0.0;
		double maxy = 0.0;
		
		try {
			
			CSVFormat format = CSVFormat.RFC4180.withHeader().withDelimiter(',');
			CSVParser parseCsv = CSVParser.parse(new File(path+fileName), Charset.forName(encoding), format);

			List<CSVRecord> records = parseCsv.getRecords();
			List<SimpleFeature> features = new ArrayList<>();
			
			GeometryFactory geometryFactory = JTSFactoryFinder.getGeometryFactory();
	        SimpleFeatureTypeBuilder pointTb = new SimpleFeatureTypeBuilder();

	        pointTb.setName("csvPoints");
	        pointTb.add("point",Point.class);
	        pointTb.add("LABEL",String.class);
	        
			final DefaultFeatureCollection pointCollection = new DefaultFeatureCollection();
			SimpleFeatureBuilder pointFeatureBuilder = new SimpleFeatureBuilder(pointTb.buildFeatureType());
			
			ArrayList<Coordinate> coords= new ArrayList<>();
			//숫자 유효성 체크
			String matches="[+-]?\\d*(\\.\\d+)?";
			
	        for(int i=1;i<records.size();i++) {
				
	        	String lonStr = records.get(i).get(lonIndx);
				String latStr = records.get(i).get(latIndx);
				
				//if(!lonStr.equals("") && !latStr.equals("") && label != null) {
				if(lonStr.matches(matches) && latStr.matches(matches)  && !lonStr.isEmpty() && !latStr.isEmpty() && lonStr!=null && latStr!=null) {
					
					double lon = Double.parseDouble(lonStr);
					double lat = Double.parseDouble(latStr);
					
					if((lat >= -90.000000  && lat <= 90.000000) && (lon >= -180.000000  && lon <= 180.000000)) {
						
						Point point = geometryFactory.createPoint(new Coordinate(lon, lat));
					    coords.add(new Coordinate(lon, lat));
					    pointFeatureBuilder.add(point);
					    
					    SimpleFeature feature = pointFeatureBuilder.buildFeature(null);
					    features.add(feature);
					    pointCollection.add(feature);
					    
					}else {
						
						continue;
						
					}
				
				}
				
			}
		    
	        minx = pointCollection.getBounds().getMinX();
	        miny = pointCollection.getBounds().getMinY();
	        maxx = pointCollection.getBounds().getMaxX();
	        maxy = pointCollection.getBounds().getMaxY();
		    
		} catch (IOException e) {

			logger.error("Data Access Error-IOException");
		}
		
		result.put("MINX", minx);
	    result.put("MINY", miny);
	    result.put("MAXX", maxx);
	    result.put("MAXY", maxy);
		
		return result;
	}
	
	@SuppressWarnings("resource")
	public String checkCharset(String fileDir){
		if(fileDir != null) fileDir = fileDir.replaceAll("\\\\", "").replaceAll("&", "");

		byte[] buf = new byte[4096];
		
		String encoding = null;
		FileInputStream fis =null;
		try {
			fis= new FileInputStream(fileDir);
			UniversalDetector detector = new UniversalDetector(null);
			
			int nread;
			while((nread=fis.read(buf))>0 && !detector.isDone()) {
				detector.handleData(buf, 0, nread);
			}
			
			detector.dataEnd();
			
			encoding = detector.getDetectedCharset();
			
		} catch (IOException e) {
			logger.error("Data Access Error-IOException");
		} finally {
			
				if(fis!=null) {
					try {
						fis.close();
					} catch (IOException e) {
						logger.error("Data Access Error-IOException");
					}
				}
		
			
				
		}
		
		return (encoding !=null ) ? encoding:"no detected";
	}

	public boolean checkLonLatRange(double lon, double lat) {
		
		boolean check = false;
		
		if((lat >= -90.000000  && lat <= 90.000000) && (lon >= -180.000000  && lon <= 180.000000)) {
			check=true;
		}else {
			check=false;
		}
		
		return check;
	}
	
	public boolean shp2CsvFile(String shpFile, String csvOutputFile, int srsCode) {
		boolean check = false;
		
		String paramJsonStr ="\'{\"input\":\"/mnt"+csvOutputFile+"\",\"output\":\"/mnt"+csvOutputFile+"\",\"proj\":\""+srsCode+"\"}\'";
			   
		String cmd="/bin/sh -c ssh hadoop@master /hadoop/bin/hadoop jar /hadoop/lib/XDBuilderMR.jar com.egiskorea.XDBuilder shptocsv "+paramJsonStr;
		
		ProcessBuilder processbuilder = new ProcessBuilder(cmd);
		processbuilder.redirectErrorStream(true);
		
		Process process;
		InputStreamReader inputStreamReader = null;

		try {
			
			process = processbuilder.start();
			InputStream stdout = process.getInputStream();
			InputStream stderr = process.getErrorStream();
			inputStreamReader = new InputStreamReader(stderr);
			
			try (BufferedReader reader = new BufferedReader(inputStreamReader)) {
				String line;
				while ((line = reader.readLine()) != null) {

					check = false;
				}
			} catch (IOException e) {
				logger.error("Data Access Error-IOException");
			}
			
			process.waitFor();
			
			check = true;
			
		} catch (IOException e1) {
			logger.error("Data Access Error-IOException");
		} catch (InterruptedException e) {
			logger.error("Thread Error-InterruptedException");
		} finally {
				try {
					if(inputStreamReader != null) inputStreamReader.close();
				} catch (IOException e) {
					logger.error("Data Access Error-IOException");
				}
		}
		
		return check; 
	}
	
}
