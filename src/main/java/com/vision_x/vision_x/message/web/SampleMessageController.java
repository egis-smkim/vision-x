package com.vision_x.vision_x.message.web;

import javax.servlet.http.HttpServletRequest;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.vision_x.vision_x.message.dto.CityGmlMessage;
import com.vision_x.vision_x.message.dto.CsvTopicMessage;

@Controller
public class SampleMessageController {
	
	@Autowired
	private RabbitTemplate rabbitTemplate;

	@RequestMapping(value="/topic/csvConvert.do",method=RequestMethod.GET)
	public String sendCsvMessage(HttpServletRequest request) {
		
		String fileName = request.getParameter("fileName");
		String tableName = request.getParameter("table");
		int lonIndx = Integer.parseInt(request.getParameter("lonIndx"));
		int latIndx = Integer.parseInt(request.getParameter("latIndx"));
		
		CsvTopicMessage message = new CsvTopicMessage();
		message.setInputPath("/mnt/"+fileName);
		message.setEpsgCode(4326);
		message.setLonIndx(lonIndx);
		message.setLatIndx(latIndx);
		message.setType(0);
		message.setSchema("datamap");
		message.setTable(tableName);
		message.setEncoding("EUC-KR");
		message.setsrText("PROJCS[\"Korea 2000 / East Belt 2010\","
				+ "GEOGCS[\"Korea 2000\",DATUM[\"Geocentric_datum_of_Korea\","
				+ "SPHEROID[\"GRS 1980\",6378137,298.257222101,AUTHORITY[\"EPSG\",\"7019\"]],"
				+ "TOWGS84[0,0,0,0,0,0,0],"
				+ "AUTHORITY[\"EPSG\",\"6737\"]],"
				+ "PRIMEM[\"Greenwich\",0,"
				+ "AUTHORITY[\"EPSG\",\"8901\"]],"
				+ "UNIT[\"degree\",0.0174532925199433,AUTHORITY[\"EPSG\",\"9122\"]],"
				+ "AUTHORITY[\"EPSG\",\"4737\"]],PROJECTION[\"Transverse_Mercator\"],"
				+ "PARAMETER[\"latitude_of_origin\",38],PARAMETER[\"central_meridian\",129],"
				+ "PARAMETER[\"scale_factor\",1],PARAMETER[\"false_easting\",200000],"
				+ "PARAMETER[\"false_northing\",600000],UNIT[\"metre\",1,AUTHORITY[\"EPSG\",\"9001\"]],"
				+ "AUTHORITY[\"EPSG\",\"5187\"]]");
//		message.setsrText( "GEOGCS[\"WGS 84\","
//            + "DATUM[\"WGS_1984\",SPHEROID[\"WGS 84\",6378137,298.257223563,AUTHORITY[\"EPSG\",\"7030\"]],"
//            + "AUTHORITY[\"EPSG\",\"6326\"]],PRIMEM[\"Greenwich\",0,AUTHORITY[\"EPSG\",\"8901\"]],"
//            + "UNIT[\"degree\",0.0174532925199433,AUTHORITY[\"EPSG\",\"9122\"]],AUTHORITY[\"EPSG\",\"4326\"]]");
//		message.setSubscribe("TEST123");
		
		rabbitTemplate.convertAndSend("csv.exchange","csv.convert.queue.sample",message);
		
		return "jsonView";
	}
	
	@RequestMapping(value="topic/csvGeoConvert.do",method=RequestMethod.GET)
	public String sendGeocodingConvert(HttpServletRequest request) {
		
		String fileName = request.getParameter("fileName");
		String tableName = request.getParameter("table");
		
		int addrIndx = Integer.parseInt(request.getParameter("addrIndx"));
		CsvTopicMessage message = new CsvTopicMessage();
		message.setAddressIndx(addrIndx);
		message.setInputPath("/mnt/"+fileName);
		message.setEncoding("EUC-KR");
		message.setSchema("datamap");
		message.setType(1);
		message.setTable(tableName);
		
		rabbitTemplate.convertAndSend("csv.exchange","csv.convert.queue.geocoding",message);
		
		
		return "jsonView";
		
	}
	
	@RequestMapping(value="topic/cityGmlConvert.do",method=RequestMethod.GET)
	public String citygmlSample(HttpServletRequest request) {
		
		String input = "/home/hadoop/sample/B001DS71345254_00.gml";
		String output = "/home/hadoop/sample/output2";
		
		int level = 14;
		int srid = 5186;
		
		String projtext = "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";
		boolean hdfs = false;
		
		CityGmlMessage message = new CityGmlMessage();
		message.setInput(input);
		message.setOutput(output);
		message.setLevel(level);
		message.setSrid(srid);
		message.setProjtext(projtext);
		message.setHdfscheck(hdfs);
		message.setSubscribe("");
		
		rabbitTemplate.convertAndSend("citygml.exchange","citygml.process.convert",message);
		
		return "jsonView";
	}
}
