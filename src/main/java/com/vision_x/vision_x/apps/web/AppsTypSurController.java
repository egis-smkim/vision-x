package com.vision_x.vision_x.apps.web;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.vision_x.vision_x.apps.service.AppsService;
import com.vision_x.vision_x.apps.service.ObsLocationVO;
import com.vision_x.vision_x.apps.service.TypSurVO;
import com.vision_x.vision_x.desk.developer.service.ModuleService;

@Controller
public class AppsTypSurController {
	@Resource(name="moduleService")
	private ModuleService moduleService;
	
	@Resource(name="appsService")
	private AppsService appsService;
	
	@RequestMapping(value="/typSur/typSrgDetailDataLoad.do", method=RequestMethod.POST)
	public String loadData(HttpServletRequest request, Model model) {
		
		String ymd = request.getParameter("ymd");
		
		List<TypSurVO> list = appsService.getTypSrgDetialData(ymd);
		
		model.addAttribute("list",list);
		
		return "jsonView";
	}
	@RequestMapping(value="/typSur/typSrgDateLoad.do", method=RequestMethod.POST)
		public String loadDate(HttpServletRequest request, Model model) {
		
		List<HashMap<Integer, String>> date = appsService.getTypSrgDay();
		
		model.addAttribute("date",date);
		
		return "jsonView";
	}
	@RequestMapping(value="/typSur/typSrgLocationData.do", method=RequestMethod.POST)
	public String loadLocation(HttpServletRequest request, Model model) {
	
	List<ObsLocationVO> location = appsService.getTypSrgLocation();
	
	model.addAttribute("location",location);
	
	return "jsonView";
}
}
