package com.vision_x.vision_x.enc.web;

import java.security.SecureRandom;
import java.util.HashMap;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.vision_x.vision_x.enc.service.EncryptService;
import com.vision_x.vision_x.member.service.MemberPluginService;
import com.vision_x.vision_x.member.service.MemberPluginVO;
import com.vision_x.vision_x.member.service.MemberService;
import com.vision_x.vision_x.utils.SessionVO;

@Controller
public class EncryptController {
	
	@Resource(name = "encryptService")
	private EncryptService encryptService;
	
	@Resource(name = "memberService")
	private MemberService memberService;
	
	@Resource(name="memberPluginService")
	private MemberPluginService memberPluginService;
	
	
	protected Logger logger = LoggerFactory.getLogger(this.getClass());
	/*@RequestMapping(value = "/encrypt/SHA256/{keyword}" ,method=RequestMethod.GET)*/
	@GetMapping("/encrypt/SHA256/{keyword}/send.do")
	public String EncSHA256(@PathVariable("keyword") String keyword,Model model) {
		
		
		model.addAttribute("keyword",encryptService.EncryptedToSha256(keyword));
		return "jsonView";
	}
	
	@RequestMapping(value = "/encrypt/encryptHash.do" ,method=RequestMethod.POST)
	public String EncSHA256_POST(@RequestParam HashMap<String,String> map,Model model,HttpSession session,HttpServletRequest request) {
		String keyword = "";
		String ip = map.get("ipAddr");	
		
		String tempString = ""; 
		for (int i = 0; i < 12; i++) {
			SecureRandom r = new SecureRandom();
			tempString += (char) ((r.nextFloat() * 26) + 97);
		}
		keyword = tempString+ip+"newlayer"; // salt = newlayer  //sha256 해쉬값을 만들기 위함.
		
		if(StringUtils.isEmpty(keyword)) {
			try {
				throw new NullPointerException("keyword is Null or Empty");
			}
			catch(NullPointerException e) {
				logger.error("ERROR NullPointerException");
			}
		}else {
			try {
				session = request.getSession(true);
				
				SessionVO sessionVO = new SessionVO();
				sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");
				
				
				MemberPluginVO mpvo = new MemberPluginVO();
				mpvo.setMid(sessionVO.getSessMid());
				mpvo.setApp_key_uuid();
				mpvo.setIp(ip);
				mpvo.setApp_key_flag("0");
				mpvo.setApp_key(encryptService.EncryptedToSha256(keyword));
				//해쉬 인증키 생성
				if(memberPluginService.countAppKeyByMid(sessionVO.getSessMid())==0) { //1명당 하나씩만 앱키 생성
					int result = memberPluginService.createMemberPlugin(mpvo);
					if(result>0) {
						model.addAttribute("RS", "SUCCESS");
					}
				}else{
					model.addAttribute("RS", "DUPLICTATED");
				}
				
			}
			catch (RuntimeException e) {
				logger.error("SESSION ERROR-RuntimeException");
			}
			catch (Exception e) {
				logger.error("SESSION ERROR");
			}
			
		}
		
		return "jsonView";
	}
}