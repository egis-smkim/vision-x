package com.vision_x.vision_x.apps.web;

import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.eclipse.emf.common.util.URI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.vision_x.vision_x.apps.service.AppsService;
import com.vision_x.vision_x.apps.service.WaveVO;
import com.vision_x.vision_x.utils.SessionVO;

@Controller
public class AppsWaveController {
	
	private AppsService appsService;
	
	@RequestMapping(value="/wave/save.do", method=RequestMethod.POST)
	public String saveProject(HttpServletRequest request,Model model) {
		
		String name = request.getParameter("name");
		String lineInfo = URI.decode(request.getParameter("lineInfo"));
		String type = request.getParameter("type");
		String gravityStr = request.getParameter("gravity");
		String hmoStr = request.getParameter("hmo");
		String rfStr = request.getParameter("rf");
		String rbStr = request.getParameter("rb");
		String swlStr = request.getParameter("swl");
		String damage = URI.decode(request.getParameter("damage"));
		String dswl = request.getParameter("dswl");
		String dmsl = request.getParameter("dmsl");
		String hswl = request.getParameter("hswl");
		String hmsl = request.getParameter("hmsl");
		String mov_lon = request.getParameter("mov_lon");
		String mov_lat = request.getParameter("mov_lat");
		String mov_alt = request.getParameter("mov_alt");
		String mov_tilt = request.getParameter("mov_tilt");
		String dist = request.getParameter("dist");
		String rc = request.getParameter("rc");
		String wl = request.getParameter("wl");
		String wh = request.getParameter("wh");
		String rotate = request.getParameter("rotate");
				
		HttpSession session = request.getSession(true);
		SessionVO sessionVO = new SessionVO();
		sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");
		
		int mid = sessionVO.getSessMid();
				
		WaveVO wvo = new WaveVO();
		wvo.setName(name);
		wvo.setLine_info(lineInfo);
		wvo.setType(type);
		wvo.setGravity(Double.parseDouble(gravityStr));
		wvo.setHmo(Double.parseDouble(hmoStr));
		wvo.setRf(Double.parseDouble(rfStr));
		wvo.setRb(Double.parseDouble(rbStr));
		wvo.setSwl(Double.parseDouble(swlStr));
		wvo.setDamage_info(damage);
		wvo.setMid(mid);
		wvo.setD_msl(Double.parseDouble(dmsl));
		wvo.setD_swl(Double.parseDouble(dswl));
		wvo.setH_msl(Double.parseDouble(hmsl));
		wvo.setH_swl(Double.parseDouble(hswl));
		wvo.setMov_lon(Double.parseDouble(mov_lon));
		wvo.setMov_lat(Double.parseDouble(mov_lat));
		wvo.setMov_alt(Double.parseDouble(mov_alt));
		wvo.setMov_tilt(Double.parseDouble(mov_tilt));
		wvo.setDist(Double.parseDouble(dist));
		wvo.setRc(Double.parseDouble(rc));
		wvo.setWh(Double.parseDouble(wh));
		wvo.setWl(Double.parseDouble(wl));
		wvo.setRotate(Double.parseDouble(rotate));
		
		int rs = appsService.insertWaveProject(wvo);
		int status = 404;
		int wid =0;
		if(rs != 0) {
			status = 200;
			wid = wvo.getWid();
		}
		
		
		model.addAttribute("status", status);
		model.addAttribute("wid", wid);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/wave/update.do", method=RequestMethod.POST)
	public String updateProject(HttpServletRequest request,Model model) {
		
		String name = request.getParameter("name");
		String lineInfo = URI.decode(request.getParameter("lineInfo"));
		String type = request.getParameter("type");
		String gravityStr = request.getParameter("gravity");
		String hmoStr = request.getParameter("hmo");
		String rfStr = request.getParameter("rf");
		String rbStr = request.getParameter("rb");
		String swlStr = request.getParameter("swl");
		String damage = URI.decode(request.getParameter("damage"));
		String dswl = request.getParameter("dswl");
		String dmsl = request.getParameter("dmsl");
		String hswl = request.getParameter("hswl");
		String hmsl = request.getParameter("hmsl");
		String mov_lon = request.getParameter("mov_lon");
		String mov_lat = request.getParameter("mov_lat");
		String mov_alt = request.getParameter("mov_alt");
		String mov_tilt = request.getParameter("mov_tilt");
		String dist = request.getParameter("dist");
		String rc = request.getParameter("rc");
		String wl = request.getParameter("wl");
		String wh = request.getParameter("wh");
		String widStr = request.getParameter("wid");
		String rotate = request.getParameter("rotate");
		
		int wid = Integer.parseInt(widStr);
		
		HttpSession session = request.getSession(true);
		SessionVO sessionVO = new SessionVO();
		sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");
		
		int mid = sessionVO.getSessMid();
				
		WaveVO wvo = new WaveVO();
		wvo.setWid(wid);
		wvo.setName(name);
		wvo.setLine_info(lineInfo);
		wvo.setType(type);
		wvo.setGravity(Double.parseDouble(gravityStr));
		wvo.setHmo(Double.parseDouble(hmoStr));
		wvo.setRf(Double.parseDouble(rfStr));
		wvo.setRb(Double.parseDouble(rbStr));
		wvo.setSwl(Double.parseDouble(swlStr));
		wvo.setDamage_info(damage);
		wvo.setMid(mid);
		wvo.setD_msl(Double.parseDouble(dmsl));
		wvo.setD_swl(Double.parseDouble(dswl));
		wvo.setH_msl(Double.parseDouble(hmsl));
		wvo.setH_swl(Double.parseDouble(hswl));
		wvo.setMov_lon(Double.parseDouble(mov_lon));
		wvo.setMov_lat(Double.parseDouble(mov_lat));
		wvo.setMov_alt(Double.parseDouble(mov_alt));
		wvo.setMov_tilt(Double.parseDouble(mov_tilt));
		wvo.setDist(Double.parseDouble(dist));
		wvo.setRc(Double.parseDouble(rc));
		wvo.setWh(Double.parseDouble(wh));
		wvo.setWl(Double.parseDouble(wl));
		wvo.setRotate(Double.parseDouble(rotate));
		
		int rs = appsService.updateWaveProject(wvo);
		int status = 404;
		
		if(rs != 0) {
			status = 200;
			
		}
		
		
		model.addAttribute("status", status);
		model.addAttribute("wid", wid);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/wave/getPrjList.do",method=RequestMethod.GET)
	public String getProjectLists(HttpServletRequest request,Model model) {
		
		HttpSession session = request.getSession(true);
		SessionVO sessionVO = new SessionVO();
		sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");
		
		int mid = sessionVO.getSessMid();
		
		List<WaveVO> list = appsService.getWaveProjectLists(mid);
		
		model.addAttribute("list", list);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/wave/excuteProject.do",method=RequestMethod.POST)
	public String getExcuteProject(HttpServletRequest request,Model model) {
		
		String widStr = request.getParameter("wid");
		int wid = Integer.parseInt(widStr);
		
		WaveVO wvo = appsService.getWaveProjectInfo(wid);
		
		int status = 404;
		if(wvo != null) {
			status = 200;
		}
		
		model.addAttribute("status",status);
		model.addAttribute("obj", wvo);
		
		return "jsonView";
	}
}
