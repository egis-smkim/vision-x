/**
 * 
 */
package com.vision_x.vision_x.member.web;

import java.util.HashMap;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import org.apache.oro.text.MalformedCachePatternException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * ErrorController.java
 * digitalTwin
 * 2020. 10. 21.
 * @author Khaia
 * @Comment
 *
 */
@Controller
public class ErrorController {
	@RequestMapping(value="/error.do", method=RequestMethod.GET)
	public String errorPages(Model model, HttpServletRequest request, @RequestParam(value="erno", required=false) String erno){
		

		HttpSession session = request.getSession(true);
		
		HashMap<String, Object> memInfo =(HashMap<String, Object>) session.getAttribute("MEM_INFO");
		
		model.addAttribute("MID",memInfo.get("MID"));
		model.addAttribute("MEM_ID",memInfo.get("MEM_ID"));
		model.addAttribute("MEM_LEVEL",memInfo.get("MEM_LEVEL"));
		
		model.addAttribute("mode", "1");

		
		return "error/error";
	}
}
