package com.vision_x.vision_x.apps.web;

import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.vision_x.vision_x.apps.service.AppsService;
import com.vision_x.vision_x.apps.service.TidalVO;
import com.vision_x.vision_x.desk.developer.service.ModuleService;

@Controller
public class AppsTidalController {
	
	@Resource(name="moduleService")
	private ModuleService moduleService;
	
	@Resource(name="appsService")
	private AppsService appsService;

	@RequestMapping(value="/tidal/lclsfDataLoad.do", method=RequestMethod.POST)
	public String loadData(HttpServletRequest request, Model model) {
		
		String lclsf = request.getParameter("lclsf");
		String ymd = request.getParameter("ymd");
		
		TidalVO vo = new TidalVO();
		vo.setLclsf(lclsf);
		vo.setYmd(ymd);
		
		List<TidalVO> list = appsService.loadTidalData(vo);
		
		model.addAttribute("list",list);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/tidal/lclsfLocationData.do", method=RequestMethod.POST)
	public String locationData(HttpServletRequest request,Model model) {
		
		String lclsf = request.getParameter("lclsf");
		
		/*int lctn_no = 0;
		
		lctn_no = appsService.getOBSno(lctn_no);
		*/
		
		String obs_name = "";
		
		switch(lclsf) {
		case "B": obs_name ="부산";
			break;
		case "I": obs_name ="인천";
			break;
		case "P": obs_name ="목포";
			break;
		case "H": obs_name="묵호";
			break;
		case "Y": obs_name="여수";
			break;
		case "U": obs_name="울산";
			break;
		}
		
		HashMap<String,String> poi = null;
		
		poi = appsService.getLocation(obs_name);
		
		if(poi!=null) {
			model.addAttribute("poi",poi);
		}
		
		return "jsonView";
	}
}
