package com.vision_x.vision_x.app.typhoon.web;

import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.vision_x.vision_x.app.typhoon.service.TyphoonService;
import com.vision_x.vision_x.geocoding.service.CsvPropertiesService;
import com.vision_x.vision_x.postgis.service.PostGisService;

@Controller
public class TyphoonController {

	protected Logger logger = LoggerFactory.getLogger(this.getClass());
	
	@Resource(name="typhoonService")
	private TyphoonService typhoonService;
	
	@Resource(name="postGisService")
	private PostGisService postGisService;

	@Resource(name="csvPropertiesService")
	private CsvPropertiesService csvPropertiesService;
	
	
	@RequestMapping(value="/ide/typhoonInfoService.do",method=RequestMethod.GET)
	public String typhoonInfoService(Model model) {
		
		List<HashMap<String, String>> result =typhoonService.getTyphoonInfo();
		
		model.addAttribute("INFO", result);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/ide/typhoonHistory.do",method=RequestMethod.POST)
	public String typhoonDetail(HttpServletRequest request,Model model) {
		
		String tmfc = request.getParameter("TMFC");
		String seq = request.getParameter("SEQ");
		
		HashMap<String, String> param = new HashMap<>();
		param.put("TMFC", tmfc);
		param.put("SEQ", seq);
		
		model.addAttribute("LIST", typhoonService.getTyphoonDetail(param));
		
		return "jsonView";
	}
	
	@RequestMapping(value="/ide/getTypinfoFormDB.do",method=RequestMethod.POST)
	public String getTypinfoFormDB(HttpServletRequest request,Model model) {
		
		String tmfc = request.getParameter("tmfc");
		String flag = request.getParameter("flag");
		
		HashMap<String, String> param = new HashMap<>();
		param.put("tmfc", tmfc);
		param.put("flag", flag);
				
		model.addAttribute("INFO", typhoonService.getTypinfoFormDB(param));
		
		return "jsonView";
	}
	
	@RequestMapping(value="/ide/getTypinfoHistoryFormDB.do",method=RequestMethod.POST)
	public String getTypinfoHistoryFormDB(HttpServletRequest request,Model model) {
		
		String typseq = request.getParameter("typseq");
		String tmfc = request.getParameter("tmfc");
		
		HashMap<String, String> param = new HashMap<>();
		param.put("typseq", typseq);
		param.put("tmfc", tmfc);
		
		model.addAttribute("INFO", typhoonService.getTypinfoHistoryFormDB(param));
		
		return "jsonView";
	}

	@RequestMapping(value="/ide/getTypDamageLocation.do",method=RequestMethod.POST)
	public String getTypDamageLocation(HttpServletRequest request,Model model) {
		
		String location = request.getParameter("verticesData");
		List<HashMap<String, Object>> result;
		try {
			result = postGisService.getTypDamageLocation(location);
			model.addAttribute("INFO", result);
		}
		catch (RuntimeException e) {
			logger.error("SELECT ERROR-RuntimeException");
		}
		catch (Exception e) {
			logger.error("SELECT ERROR");
		}
		
		return "jsonView";
	}
	
	@RequestMapping(value="/ide/getTypDamageLocationSetTable.do",method=RequestMethod.POST)
	public String getTypDamageLocationSetTable(HttpServletRequest request,Model model) {
		
		String location = request.getParameter("verticesData");
		String table = request.getParameter("table");
		String schema = request.getParameter("schema");
		String column = request.getParameter("column");
		String coord = request.getParameter("coord");

		HashMap<String, String> param = new HashMap<>();
		param.put("location", location);
		param.put("table", table);
		param.put("schema", schema);
		param.put("column", column);
		param.put("coord", coord);
		
		List<HashMap<String, Object>> result;
		try {
			result = postGisService.getTypDamageLocationSetTable(param);
			
			HashMap<String, Object> param2  = new HashMap<>();
			
			param2.put("TABLE",table);
			param2.put("DB",schema);
		
			List<String> headers=csvPropertiesService.getHeaderProperties(param2);
			
			model.addAttribute("INFO", result);
			model.addAttribute("HEADER", headers);
		}
		catch (RuntimeException e) {
			logger.error("SELECT ERROR-RuntimeException");
		}
		catch (Exception e) {
			logger.error("SELECT ERROR");
		}
		
		return "jsonView";
	}
	
	@RequestMapping(value="/ide/getTideLocation.do",method=RequestMethod.POST)
	public String getTideLocation(HttpServletRequest request,Model model) {
		
		String location = request.getParameter("verticesData");
		List<HashMap<String, Object>> result;
		try {
			result = postGisService.getTideLocation(location);
			model.addAttribute("INFO", result);
		}
		catch (RuntimeException e) {
			logger.error("SELECT ERROR-RuntimeException");
		}
		catch (Exception e) {
			logger.error("SELECT ERROR");
		}
		
		return "jsonView";
	}
	
}
