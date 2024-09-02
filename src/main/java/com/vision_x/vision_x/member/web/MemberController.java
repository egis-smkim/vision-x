package com.vision_x.vision_x.member.web;

import java.io.File;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.sql.SQLException;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;
import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import org.apache.commons.lang.StringEscapeUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.xml.utils.URI;
import org.apache.xml.utils.URI.MalformedURIException;
import org.json.simple.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.vision_x.vision_x.member.service.MemberService;
import com.vision_x.vision_x.member.service.MemberVO;
import com.vision_x.vision_x.admin.service.BoardMasterService;
import com.vision_x.vision_x.admin.service.BoardMasterVO;
import com.vision_x.vision_x.common.service.LogTrackerService;
import com.vision_x.vision_x.common.service.LogTrackerVO;
import com.vision_x.vision_x.mail.service.MailerVO;
import com.vision_x.vision_x.mail.service.MailingService;
import com.vision_x.vision_x.mail.service.RecipientForRequest;
import com.vision_x.vision_x.utils.AES256Cipher;
import com.vision_x.vision_x.utils.GetClientIPAddr;
import com.vision_x.vision_x.utils.LoginOTP;
import com.vision_x.vision_x.utils.SessionConfig;
import com.vision_x.vision_x.utils.SessionVO;

@Controller
public class MemberController {
	protected Logger logger = LoggerFactory.getLogger(this.getClass());
	@Resource(name="memberService")
	private MemberService memberService;
	
	@Resource(name="boardMasterService")
	private BoardMasterService boardMasterService;
	
	@Resource(name = "mailingService")
	private MailingService mailingService;
	
	@Value("#{globalInfo['Globals.outbound.accesskey']}")
	private String MAIL_API_ACCESSKEY;
	
	@Value("#{globalInfo['Globals.outbound.secretkey']}")
	private String MAIL_API_SECRETKEY;
	
	@Value("#{globalInfo['Globals.outbound.authkey']}")
	private String MAIL_API_AUTHKEY;
	
	@Value("#{globalInfo['Globals.outbound.sendURL']}")
	private String MAIL_API_SENDURL;
	
	@Value("#{globalInfo['Globals.env.host']}")
	private String DEFAULT_HOST;
	
	@Value("#{globalInfo['Globals.otp.secretky']}")	
	private String OTP_SECRETKEY;
	
	@Value("#{globalInfo['Globals.otp.algorithm']}")	
	private String OTP_ALGORYTHM;
	
	@Value("#{globalInfo['Globals.otp.timeout']}")	
	private String OTP_TIMEOUT;
	
	@Value("#{globalInfo['Globals.aes.secretkey']}")	
	private String AES_SECRETKEY;
	
	@Resource(name="logTrackerService")
	private LogTrackerService logTrackerService;
	
	
	@RequestMapping(value="/member/login.do",method=RequestMethod.GET)
	public String login(Model model, String sess) {
		model.addAttribute("sess", sess);
		return "member/new_login";
	}
	
	@RequestMapping(value="/member/prevLogin.do",method=RequestMethod.GET)
	public String prevLogin(Model model, String sess) {
		model.addAttribute("sess", sess);
		return "member/login";
	}

	@RequestMapping(value="/member/signUp.do",method=RequestMethod.GET)
	public String signUp() {
		
		return "member/signUp";
	}
	
	@RequestMapping(value="/member/checkMemId.do",method=RequestMethod.POST)
	public String checkMemId(@RequestParam HashMap<String,String> map, Model model) {
		
		String memId= map.get("memId");
		
		MemberVO memberVO = new MemberVO();
		memberVO.setMem_id(memId);
		
		int rs  =memberService.checkMemId(memberVO);
		
		model.addAttribute("rs", rs);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/member/insertSignMem.do",method=RequestMethod.POST)
	public String insertSignMem(@RequestParam HashMap<String,String> map,Model model,HttpServletRequest request) {
		
		String id = map.get("memId");	
		String pwd = map.get("memPwd");	
		map.put("memPwd", pwd);	
		
		String geoDbNm = "DTW_USER_GEO_" + id; // postgre	
		geoDbNm = StringEscapeUtils.escapeSql(geoDbNm);	
		
		//int dbRs = memberService.createDataDb(dataDbNm);	
		int geoDbRs = memberService.createGeoDb(geoDbNm);	
		
		map.put("GEO_DB", geoDbNm);	
		
		int rs = memberService.insertMemInfo(map);	
		
		if (geoDbRs == 0 && rs == 1) {	
			//로그 남기기(회원가입)
			MemberVO mbvo = new MemberVO();
			mbvo.setMem_id(id);
			mbvo = memberService.getMemberInfoMemId(mbvo);
			LogTrackerVO logTrackerVO = new LogTrackerVO();
			logTrackerVO.setMid(mbvo.getMid());
			logTrackerVO.setGid(mbvo.getGid());
			logTrackerVO.setDlid(mbvo.getDlid());
			logTrackerVO.setLog_code("21");
			logTrackerVO.setLog_level(2);
			logTrackerVO.setMessage("회원 가입");
			GetClientIPAddr ip = new GetClientIPAddr();
			String clientIP=ip.getClientIP(request);//클라이언트 ip
			logTrackerVO.setIp(clientIP);
			try {
				logTrackerService.insertLogTracker(logTrackerVO);
			} catch (SQLException e) {
				logger.error("SQLExeption-SQLExeption");
			}
			model.addAttribute("RS", "done");	
		} else {	
			model.addAttribute("RS", "error");	
		}
		return "jsonView";
	}
	
	@RequestMapping(value="/member/checkLogin.do",method=RequestMethod.POST)
	public String checkLogin(@RequestParam HashMap<String,String> map, Model model, HttpServletRequest request) throws NumberFormatException, Exception {
		
		HashMap<String, Object> rs = memberService.memberLogin(map);
		int timediff = 0;

		LogTrackerVO lvo = new LogTrackerVO();
		
		if(rs != null) {
			String pwd=map.get("memPwd");
	        
			String pwdDB = rs.get("MEM_PASSWORD").toString();
			if (pwd.equals(pwdDB)) {
				model.addAttribute("MEM_INFO", rs);
				model.addAttribute("otp_flag", rs.get("MEM_OTP_FLAG").toString());

				SessionVO sessionVO = new SessionVO();
				HttpSession session = request.getSession(true);
				
				session.setAttribute("optId", map.get("memId"));
				
	        } else {
	        	//로그인 카운트
	        	MemberVO loginCount = new MemberVO();
				loginCount.setMem_id(rs.get("MEM_ID").toString());
				loginCount.setLogin_count(Integer.parseInt(rs.get("LOGIN_COUNT").toString()));
	        	memberService.updateLoginCount(loginCount); // 로그인 횟수 업데이트
	        	//로그인 실패시 +1 -- 5가 넘어가면 뷰에 넘어가는 값이 5를 넘지 않도록 함 
	        	int loginCountInfo = Integer.parseInt(rs.get("LOGIN_COUNT").toString())+1;
	        	if(loginCountInfo>=5) {
	        		loginCountInfo = 5;
	        	}
	        	model.addAttribute("login_count", loginCountInfo);
	        	model.addAttribute("MEM_INFO", "NONE");
				model.addAttribute("PWD", "INCORRECT");
				
				lvo.setMessage("비밀번호 오류:{ID:"+rs.get("MEM_ID").toString()+"}");
				lvo.setMid(-1);
				lvo.setGid(-1);
				lvo.setDlid(-1);
				lvo.setLog_code("11");
				lvo.setLog_level(1);
				
				GetClientIPAddr ip = new GetClientIPAddr();
				String clientIP=ip.getClientIP(request);
				lvo.setIp(clientIP);
				logTrackerService.insertLogTracker(lvo);
	        }
			
		}else {
			model.addAttribute("MEM_INFO", "NONE");
		}
		
		return "jsonView";
	}
	
	@RequestMapping(value="/member/loginSession.do",method=RequestMethod.POST)
	public String loginSession(@RequestParam HashMap<String,String> map, Model model, HttpServletRequest request,HttpServletResponse response){

		HttpSession session = request.getSession(true);
		SessionVO sessionVO = new SessionVO();
		
		String otpNumFromClient =  (String) session.getAttribute("otpNumFromClient");
		String otpNum =  (String) session.getAttribute("otpNum");
		
		if(otpNum!=null&&otpNumFromClient!=null) { //null 체크
			if(!otpNum.equals(otpNumFromClient)) { //otp
				model.addAttribute("MEM_INFO", "fail");
				return "jsonView";
			}
		}
		
		HashMap<String, Object> rs = memberService.memberLogin(map);
		
		String enMid="";
		int timediff = 0;
		if(rs != null) {
			String pwd=map.get("memPwd");
	        
			String pwdDB = rs.get("MEM_PASSWORD").toString();
			if (pwd.equals(pwdDB)) {
				model.addAttribute("MEM_INFO", rs);

				sessionVO.setSessMid(Integer.parseInt(rs.get("MID").toString()));
				String key = new java.math.BigInteger(AES_SECRETKEY.getBytes()).toString(2).substring(0, 16);
				//mid 암호화 220509 yoonjee a256 > kms 220629 > a256
				AES256Cipher a256 = AES256Cipher.getInstance(key);
				try {
					enMid = a256.AES_Encode(rs.get("MID").toString(),key);
				} catch (InvalidKeyException | UnsupportedEncodingException | NoSuchAlgorithmException | NoSuchPaddingException
						| InvalidAlgorithmParameterException | IllegalBlockSizeException | BadPaddingException e) {
					logger.error("AES_Encode Exception");
				}
		        //복호화
		        //String desId = a256.AES_Decode(enMid,key);
		        String userId = SessionConfig.getSessionidCheck("sessionUserId", rs.get("MEM_ID").toString());
				sessionVO.setSessEncryMid(enMid);
				sessionVO.setSessMemId(rs.get("MEM_ID").toString());
				
				if(rs.get("DLID") == null) {
					sessionVO.setSessDlid(0);
				}else {
					sessionVO.setSessDlid(Integer.parseInt(rs.get("DLID").toString()));
				}
				
				sessionVO.setSessMemLevel(Integer.parseInt(rs.get("MEM_LEVEL").toString()));
				
				session.setAttribute("MEM_INFO", rs);
				session.setAttribute("sessionUserId", rs.get("MEM_ID").toString());
				
				session.removeAttribute("optId");
				session.removeAttribute("otpNum");
				session.removeAttribute("otpNumFromClient");
				
				MemberVO memberVO = new MemberVO();
				memberVO.setMid(Integer.parseInt(rs.get("MID").toString()));
				
				memberService.updateMemberLoginDate(memberVO);
				session.removeAttribute("otpNumTime");
				
				try {
					//게시판
					HashMap<String,String> map1 =  new HashMap<>();
					map1.put("memId", sessionVO.getSessMemId());
					HashMap<String, Object> memberMap = memberService.memberLogin(map1);
					model.addAttribute("MEM_DEVELOPER", memberMap.get("STATE").toString());
					
					List<BoardMasterVO> boardList = boardMasterService.selectBoardList();
					model.addAttribute("boardList", boardList);
					
					memberVO = memberService.getMemberInfo(memberVO);
					sessionVO.setSessMemEmail(memberVO.getMem_email());

					session.setAttribute("sessionUserInfo", sessionVO);
					timediff = memberService.getTimeDiff(memberVO);	
					session.setAttribute("timediff", timediff);
					logger.info("timediff:" + timediff);	
					logger.info("MEM_ID:" + rs.get("MEM_ID").toString());	
					model.addAttribute("timediff", timediff);	
					model.addAttribute("otp_flag", rs.get("MEM_OTP_FLAG").toString());
					// 로그인 횟수 0으로 초기화
					MemberVO resetMbVO = new MemberVO();
					resetMbVO.setMem_id(rs.get("MEM_ID").toString());
		        	memberService.resetLoginCount(resetMbVO);
		        	
		            if(StringUtils.isNotEmpty(request.getParameter("lang")))session.setAttribute("lang", request.getParameter("lang"));
		    		LogTrackerVO logTrackerVO = new LogTrackerVO(memberVO.getMid(),memberVO.getGid(),memberVO.getDlid(),"10", 1, "로그인 성공");
		    		GetClientIPAddr ip = new GetClientIPAddr();
		    	
		    		String clientIP=ip.getClientIP(request);//클라이언트 ip
		    		logTrackerVO.setIp(clientIP);
					logTrackerService.insertLogTracker(logTrackerVO);

				} catch (SQLException e) {
					logger.error("getMemberInfo SQLException");
				}
	        	
	        } else {
				model.addAttribute("MEM_INFO", "NONE");
	        }
			
		}else {
			model.addAttribute("MEM_INFO", "NONE");
		}
		
		return "jsonView";
	}
	
	@RequestMapping(value="/member/logout.do",method=RequestMethod.GET)
	public String logout(HttpServletRequest request,Model model) {
		HttpSession session = request.getSession(true);
		SessionVO sessionVO  = (SessionVO) session.getAttribute("sessionUserInfo");
		//로그아웃 로그남기기
		MemberVO mbvo = new MemberVO();
		mbvo.setMem_id(sessionVO.getSessMemId());
		mbvo=memberService.getMemberInfoMemId(mbvo);
		LogTrackerVO logTrackerVO = new LogTrackerVO(mbvo.getMid(),mbvo.getGid(),mbvo.getDlid(),"19", 1, "로그아웃");
		GetClientIPAddr ip = new GetClientIPAddr();
		String clientIP=ip.getClientIP(request);//클라이언트 ip
		logTrackerVO.setIp(clientIP);
		try {
			logTrackerService.insertLogTracker(logTrackerVO);
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			logger.error("SQLException-SQLException");
		}
		
		session.invalidate();
		
		model.addAttribute("RS", "DONE");
		
		return "jsonView";
	}
	

	/* 이메일 인증 */
	@RequestMapping(value = "/member/certifyEmailWithAuthKey.do", method = RequestMethod.GET)
	public String certifyEmailWithAuthKey(@RequestParam HashMap<String,String> map,HttpServletRequest request, HttpServletResponse response){
		
		HttpSession session = request.getSession(true);
		
		//파라미터로 멤버id와 authkey를 받아온
		String mem_id = map.get("memId");
		String authkey = map.get("authkey");
		//널포인터 체크
		if(mem_id!=null&&authkey!=null&&mem_id!=""&&authkey!="") {
			//받아온 문자열 디코딩
			byte[] decodedBytes4mem_id = Base64.getDecoder().decode(mem_id);
			String decodedMem_id = new String(decodedBytes4mem_id);
			byte[] decodedBytes4authkey4test = Base64.getDecoder().decode(authkey);
			String decodedAuthkey = new String(decodedBytes4authkey4test);
			
			//해당 멤버id에 authkey 칼럼을 비교 혹은 kms api를 통해 일치하면 -1이였던 member level을 0으로 바꾼다.
			
			if(decodedAuthkey.equals(MAIL_API_AUTHKEY)) { // authkey와 decode된 authkey가 동일할 경우.

				MemberVO memberVO = new MemberVO();
				memberVO.setMem_id(decodedMem_id);
				
				memberVO = memberService.getMemberInfoMemId(memberVO);
				
				if(memberVO.getMem_level() < 0) {
					memberVO.setMem_id(decodedMem_id);
					memberVO.setMem_authkey(decodedAuthkey);
					int chck = memberService.changeMemLevel(memberVO);
				}
			}

			//로그인 페이지로 이동시킨다.
			return "member/signComplete";
		}
		else {
			return "error/error";
		}
	}
	/* 비밀번호 찾기(비밀번호 초기화) - 아이디,이름,이메일 체크 후 임시비밀번호 전송 */
	@RequestMapping(value = "/member/sendTempPwdEmail.do", method = RequestMethod.POST)
	public String sendTempPwdEmail(HttpServletRequest request,HttpServletResponse response,Model model){
		String memId = request.getParameter("findMemId");//map.get("findMemId"); 
		String memName = request.getParameter("findMemName");//map.get("findMemName");
		String memEmail =  request.getParameter("findMemEmail");//map.get("findMemEmail");
		
		//메일에 보내질 메세지(html형식)
		String msg = "";
		int chkTempPwdUpdate = 0;
		
		final String accesskey = MAIL_API_ACCESSKEY;
		final String secretkey = MAIL_API_SECRETKEY;
		final String apiURL = MAIL_API_SENDURL;
		
		HashMap<String, String> map = new HashMap<>();
		map.put("memId", memId);
		map.put("memName", memName);
		map.put("memEmail", memEmail);
		
		String rs = "fail";
		String parameters = "";
		HashMap<String,String> mailResult=null;
		int responseCode = -1;
		int mailRequestCnt = 0;
		String errorMsg = "";
		
		//임시비밀번호 문자열 12자리 생성
		String tempPwd = ""; 
		for (int i = 0; i < 12; i++) {
			SecureRandom r = new SecureRandom();
			tempPwd += (char) ((r.nextFloat() * 26) + 97);
		}
		MessageDigest md;
		try {
			md = MessageDigest.getInstance("SHA-512");
	        md.update(tempPwd.getBytes());
	        
	        StringBuilder builder = new StringBuilder();
	        for (byte b: md.digest()) {
	          builder.append(String.format("%02x", b));
	        }
	        String pwdSHA512 = builder.toString();
        
			MemberVO mbvo = new MemberVO();//임시비밀번호로 바꾸기위한 객체
	
			mbvo.setMem_password(pwdSHA512);
			mbvo.setTemp_pwd_flag(1);
			mbvo.setMem_id(memId);
		
			if(StringUtils.isNotEmpty(memId)&&StringUtils.isNotEmpty(memName)&&StringUtils.isNotEmpty(memEmail)) { //널포인터 체크
				//해당 유저명/아이디/이메일이 있는지 확인
	
				MemberVO memberVO = new MemberVO();
				memberVO.setMem_id(memId);
				memberVO.setMem_name(memName);
				memberVO.setMem_email(memEmail);

				memberVO = memberService.getMemberInfoMemId(memberVO);

				if (memberVO != null && memberVO.getMem_email() != null && !(memberVO.getMem_email().equals(""))) {
					if(memId.equals(memberVO.getMem_id())&&memName.equals(memberVO.getMem_name())&&memEmail.equals(memberVO.getMem_email())) {
						//kms인증 필요
						chkTempPwdUpdate = memberService.updatePw(mbvo); //TODO:임시비밀번호를 DB에는 SHA256으로 저장해야 로그인이 정상적으로 현재는 됨.
						//패스워드 초기화 로그남기기
						memberVO = memberService.getMemberInfoMemId(memberVO);
						LogTrackerVO logTrackerVO = new LogTrackerVO(memberVO.getMid(),memberVO.getGid(),memberVO.getDlid(),"16", 2, "비밀번호 초기화");
						GetClientIPAddr ip = new GetClientIPAddr();
						String clientIP=ip.getClientIP(request);//클라이언트 ip
						logTrackerVO.setIp(clientIP);
						
						logTrackerService.insertLogTracker(logTrackerVO);
						
						//임시 패스워드 생성 확인
						if(chkTempPwdUpdate==1) { //임시 비밀번호가 제대로 생성되어 DB에 반영되었으면 메세지 작성 - 템플릿 사용시 필요 x 
							msg += "<div align='center' style='border:1px solid black; font-family:verdana'>";
							msg += "<h3 style='color: blue;'>";
							msg += memName + "님의 임시 비밀번호 입니다. 비밀번호를 변경하여 사용하세요.</h3>";
							msg += "<p>임시 비밀번호 : ";
							msg += tempPwd + "</p></div>";
						}
						//메일 전송 객체
						MailerVO mailerVO =  new MailerVO();
						//템플릿 전송시 세팅
						if(chkTempPwdUpdate==1) { //임시 비밀번호가 제대로 생성되어 DB에 반영되었으면 메세지 작성
							
							mailerVO.setTemplateSid(168);//비밀번호 초기화 템플릿 번호는 168번 //templateSid는 naver api 사이트에서 인가된 계정으로 확인가능-parameter를 보내기위해서는 recipientForRequest객체에 파라미터를 세팅해야함
						}
						//메일 전송 객체 내부의 수신자 객체
						RecipientForRequest recipient = new RecipientForRequest();
					
						recipient.setAddress(memEmail);
						recipient.setName(memName);
						recipient.setType("R");
						
						//테스트용
						///보내고 싶은 파라미터 데이터를 map에 담으면 된다.
						JSONObject jso = new JSONObject();
						//임시 비밀번호 전송
						jso.put("tempPwd", tempPwd);
						String host = DEFAULT_HOST;
						jso.put("url", host);
						recipient.setParameters(jso);
						//메일 전송 객체 내부의 수신자 객체리스트 ->여러명일 경우 리스트에 ADD
						List<RecipientForRequest> recipients = new ArrayList<RecipientForRequest>();
						recipients.add(recipient);
						mailerVO.setRecipients(recipients);
						mailerVO.setParameters(null);
						mailerVO.setIndividual(true);
						mailerVO.setAdvertising(false);
							
						// 메일 전송시 mailerVO객체를 넘겨준다.
						mailResult=mailingService.mailSender(mailerVO, accesskey, secretkey, apiURL);
						responseCode = Integer.parseInt(mailResult.get("responseCode").toString());
						
						if(responseCode!=201){ // 메일 전송이 실패하였을 경우
							while(mailRequestCnt<2) {//http 응답결과가 201이 아닌 경우 2회 체크해서 재전송 
								mailResult=mailingService.mailSender(mailerVO, accesskey, secretkey, apiURL);
								responseCode = Integer.parseInt(mailResult.get("responseCode").toString());
								mailRequestCnt++;
								rs="error";

								if(responseCode==201) {//재전송시 성공하는 경우
									rs = "complete";
									break;
								} 
							}

							switch (responseCode) { //응답 오류 코드는 https://api.ncloud-docs.com/docs/ai-application-service-cloudoutboundmailer-createmailrequest 에서 확인 가능
								case 400:
									errorMsg="BAD_REQUEST"; 
									break;

								case 403:
									errorMsg="NO_AUTHORIZATION";
									break;

								case 405:
									errorMsg="METHOD_NOT_ALLOWED";
									break;

								case 415:
									errorMsg="UNSUPPORTED_MEDIA_TYPE";
									break;
								case 500:
									errorMsg="INTERNAL_SERVER_ERROR";
									break;
							}
						}else{//응답 코드가 201인경우
							rs="complete";
						}
					}else {//유저의 정보가 일치하지 않은 경우
						rs = "fail";
						
					}
					
				}else {//유저의 메일이 비어있거나 정보가 없는 경우
					rs="fail";
				}
			}

		} catch (NoSuchAlgorithmException e) {
			rs="error";
			errorMsg="NoSuchAlgorithmException";
			logger.error("sendTempPwdEmail Error-NoSuchAlgorithmException");
		} catch (InvalidKeyException | IllegalStateException
				| UnsupportedEncodingException e) {
			rs="error";
			errorMsg="An Error Occured while Excuting mailing service.";
			logger.error("MailSending Error-An Error Occured while Excuting mailing service.");
		}
		catch (SQLException e) {
			rs="error";
			errorMsg="SQLException";
			logger.error("SQLException-SQLException");
		}
		catch (Exception e) {
			rs="error";
			errorMsg="Unexpected Error has occcured.";
			logger.error("sendTempPwdEmail Error");
		}
		
		model.addAttribute("rs",rs);
		
		if(StringUtils.isNotEmpty(errorMsg)) model.addAttribute("errorMsg", errorMsg);//에러문자가 공백이나 널이 아니면
		
		return "jsonView";
	}
	
	/* 이메일 인증(회원가입) - 해당 메일로 인증 메일 전송 */
	@RequestMapping(value = "/member/sendRegistAuthEmail.do", method = RequestMethod.POST)
	public String sendRegistAuthEmail(HttpServletRequest request,HttpServletResponse response,Model model){
		
		String memId = request.getParameter("memId");
		String memName = request.getParameter("memName");
		String memEmail = request.getParameter("memEmail");
		
		//메일에 보내질 메세지(html형식)
		String msg = "";
		int chkTempPwdUpdate = 0;
		
		final String accesskey = MAIL_API_ACCESSKEY;
		final String secretkey = MAIL_API_SECRETKEY;
		final String apiURL = MAIL_API_SENDURL;
		if(memId!=null&&memName!=null&&memEmail!=null&&memId!=""&&memName!=""&&memEmail!="") { //널포인터 체크
			//해당 유저명/아이디/이메일이 있는지 확인

			MemberVO memberVO = new MemberVO();
			memberVO.setMem_id(memId);
			memberVO.setMem_name(memName);
			memberVO.setMem_email(memEmail);

			memberVO = memberService.getMemberInfoMemId(memberVO);

			if (memberVO != null && memberVO.getMem_email() != null && !(memberVO.getMem_email().equals(""))) {
				MailerVO mailerVO =  new MailerVO();
				try {
					mailerVO.setTemplateSid(166);
					//회원가입 인증 템플릿 번호는 166번 
					//templateSid는 naver api 사이트에서 인가된 계정으로 확인가능-parameter를 보내기위해서는 recipientForRequest객체에 파라미터를 세팅해야함
					
					//메일 전송 객체 내부의 수신자 객체
					RecipientForRequest recipient = new RecipientForRequest();
					recipient.setAddress(memEmail);
					recipient.setName(memName);
					recipient.setType("R");
					
					//테스트용
					String encodedMemId = Base64.getEncoder().encodeToString(memId.getBytes());
					String encodedAuthKey = Base64.getEncoder().encodeToString(MAIL_API_AUTHKEY.getBytes());
					///보내고 싶은 파라미터 데이터를 map에 담으면 된다.
					JSONObject jso = new JSONObject();
					
					//jso.put("memName", memName);
					// 이메일 인증 테스트용
					jso.put("memId", encodedMemId);
					jso.put("authKey", encodedAuthKey);
					String host = DEFAULT_HOST;
					jso.put("url", host);
					
					recipient.setParameters(jso);
					//메일 전송 객체 내부의 수신자 객체리스트 ->여러명일 경우 리스트에 ADD
					List<RecipientForRequest> recipients = new ArrayList<RecipientForRequest>();
					recipients.add(recipient);
					/*for(RecipientForRequest rcp : recipients) {
						recipients.add(recipient);//수신자 명수 만큼 
					}*/
					mailerVO.setRecipients(recipients);
					mailerVO.setParameters(null);
					mailerVO.setIndividual(true);
					mailerVO.setAdvertising(false);
					
					mailingService.mailSender(mailerVO, accesskey, secretkey, apiURL);
				} catch (InvalidKeyException | NoSuchAlgorithmException | IllegalStateException
						| UnsupportedEncodingException e) {
					logger.error("MailSending Error-An Error Occured while Excuting mailing service.");
				}
				model.addAttribute("rs","complete");
			}else {
				model.addAttribute("rs","fail");
			}
		}
		
		return "jsonView";
	}
	
	/* 이메일 인증(계정 보안) - 해당 메일로 인증 메일 전송 */
	@RequestMapping(value = "/member/sendAuthEmail.do", method = RequestMethod.POST)
	public String sendAuthEmail(HttpServletRequest request,HttpServletResponse response,Model model){


		HttpSession session = request.getSession(true);
		SessionVO sessionVO = new SessionVO();
		sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");
		
		String sess = sessionVO.getSessMemId();
		
		//Outbound - mailer
		final String accesskey = MAIL_API_ACCESSKEY;
		final String secretkey = MAIL_API_SECRETKEY;
		final String apiURL = MAIL_API_SENDURL;
		
		//OTP 
		LoginOTP otp = new LoginOTP(OTP_TIMEOUT, OTP_ALGORYTHM, OTP_SECRETKEY);
		String otpNum = null;
		try {
			otpNum = otp.create();
		} catch (InvalidKeyException e) {
			logger.error("InvalidKeyException-Invalid Key Used");
		} catch (NoSuchAlgorithmException e) {
			logger.error("NoSuchAlgorithmException-Can not find such Algorithm");
		}
		session.setAttribute("otpNum", otpNum);
		LocalTime currentTime = LocalTime.now();
		session.setAttribute("otpNumTime", currentTime);
		String msg = "";
		int chkTempPwdUpdate = 0;
		
		MemberVO memberVO = new MemberVO();
		memberVO.setMem_id(sess);
		
		memberVO = memberService.getMemberInfoMemId(memberVO);

		if (memberVO != null && memberVO.getMem_email() != null && !(memberVO.getMem_email().equals(""))) {
			MailerVO mailerVO = new MailerVO();
			mailerVO.setTemplateSid(213);
			RecipientForRequest recipient = new RecipientForRequest();
			recipient.setAddress(memberVO.getMem_email());
			recipient.setName(memberVO.getMem_name());
			recipient.setType("R");
			
			JSONObject jso = new JSONObject();
			jso.put("otpNum",otpNum);
			// 이메일 인증 테스트용
			recipient.setParameters(jso);
			// System.out.println(jso.toJSONString());
			// 메일 전송 객체 내부의 수신자 객체리스트 ->여러명일 경우 리스트에 ADD
			List<RecipientForRequest> recipients = new ArrayList<RecipientForRequest>();
			recipients.add(recipient);
			
			mailerVO.setRecipients(recipients);
			mailerVO.setParameters(null);
			mailerVO.setIndividual(true);
			mailerVO.setAdvertising(false);
			try { // 메일 전송시 mailerVO객체를 넘겨준다.
				mailingService.mailSender(mailerVO, accesskey, secretkey, apiURL);
			} catch (InvalidKeyException | NoSuchAlgorithmException | IllegalStateException
					| UnsupportedEncodingException e) {
				logger.error("MailSending Error-An Error Occured while Excuting mailing service.");
			}
			
			model.addAttribute("rs", "complete");
		} else {
			model.addAttribute("rs", "fail");
		}
		
		return "jsonView";
	}
	
	// 비밀번호 변경 권고 페이지 이동	
	@RequestMapping(value = "/desk/moveChgPWD.do", method = RequestMethod.GET)
	public String moveChgPWD(Model model, HttpServletRequest request, HttpServletResponse response) {
		HttpSession session = request.getSession(true);
		model.addAttribute("sessionUserInfo", session.getAttribute("sessionUserInfo"));
		return "member/chgPWD/main";
	}
	
	// 비밀번호 변경 권고 페이지 패스워드 일치여부 비동기통신
	// jquery validation plugin romote 활용 현재 패스워드 체크
	@RequestMapping(value = "/member/chkPassword.do", method = RequestMethod.POST)		
	public void chkCurrPwd(@RequestParam HashMap<String, String> map, HttpServletRequest request,HttpServletResponse response, Model model){
		String result = "false";
		if (map != null) {
			try {
				HttpSession session = request.getSession(true);
				SessionVO sessionVO = new SessionVO();
				sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");

				MemberVO memberVO = new MemberVO();
				memberVO.setMem_id(sessionVO.getSessMemId());
				memberVO = memberService.getMemberInfoMemId(memberVO);
				String pwd = map.get("curPwd");
				String pwdDB = memberVO.getMem_password();
			        
				// mysql password 확인용 SHA1,SHA256,KMS
				if (pwd.equals(pwdDB)) {
					result = "true";
				} else {
					result = "false";
				}
			} catch (RuntimeException e) {
				logger.error("SELECT ERROR-RuntimeException");
			} catch (Exception e) {
				logger.error("SELECT ERROR");
			}
		}
		logger.info("result:" + result);
		// jquery plugin의 remote를 사용하기위해서는 response객체에 "true","false"의 문자열을 보내야한다.	
		try {
			response.getWriter().append(result);
		} catch (IOException e) {
			logger.error("chkPassword Error-IOException");
		} catch (Exception e) {
			logger.error("chkPassword Error");
		}
	}
	// 비밀번호 변경처리 ajax	
	@RequestMapping(value = "/member/renewPwd.do", method = RequestMethod.POST)
	public String renewPwd(@RequestParam HashMap<String, String> map, Model model, HttpServletRequest request,	HttpServletResponse response){	
		if (map != null) {
			String id = map.get("id");
			String newPwd = map.get("newPwd");
	
			MemberVO memberVO = new MemberVO();
			memberVO.setMem_id(id);
			
			memberVO = memberService.getMemberInfoMemId(memberVO);

			String pwdDB = memberVO.getMem_password();
	        
			if (newPwd.equals(pwdDB)) {
				model.addAttribute("rs", "same");
			} else {
				memberVO.setMem_password(newPwd);
				memberVO.setTemp_pwd_flag(0);
				int result = memberService.updatePw(memberVO);
				if (result == 1) {
					model.addAttribute("rs", "complete"); // 패스워드 변경이 완료되었을 경우 1
					//패스워드 변경 로그남기기
					LogTrackerVO logTrackerVO = new LogTrackerVO(memberVO.getMid(),memberVO.getGid(),memberVO.getDlid(),"14", 2, "비밀번호 변경");
					GetClientIPAddr ip = new GetClientIPAddr();
					String clientIP=ip.getClientIP(request);//클라이언트 ip
					logTrackerVO.setIp(clientIP);
					try {
						logTrackerService.insertLogTracker(logTrackerVO);
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						logger.error("SQLException-SQLException");
					}
				} else {
					model.addAttribute("rs", "fail"); // 패스워드 변경이 실패했을 경우(DB)
					
				}
			}
		}
		return "jsonView";
	}
	// otp 번호 생성
	@RequestMapping(value = "/member/createOTP.do", method = RequestMethod.POST)
	public String createOTPNum(Model model, HttpServletRequest request, HttpServletResponse response) {
		HttpSession session = request.getSession(true);
		String sess = session.getAttribute("optId").toString();
	
		//Outbound - mailer
		final String accesskey = MAIL_API_ACCESSKEY;
		final String secretkey = MAIL_API_SECRETKEY;
		final String apiURL = MAIL_API_SENDURL;
		
		//OTP 
		LoginOTP otp = new LoginOTP(OTP_TIMEOUT, OTP_ALGORYTHM, OTP_SECRETKEY);
		String otpNum = null;
		try {
			otpNum = otp.create();
		} catch (InvalidKeyException e) {
			logger.error("InvalidKeyException-Invalid Key Used");
		} catch (NoSuchAlgorithmException e) {
			logger.error("NoSuchAlgorithmException-Can not find such Algorithm");
		}
		session.setAttribute("otpNum", otpNum);
		LocalTime currentTime = LocalTime.now();
		session.setAttribute("otpNumTime", currentTime);
		// 메일에 보내질 메세지(html형식)
		String msg = "";
		int chkTempPwdUpdate = 0;
		
		MemberVO memberVO = new MemberVO();
		memberVO.setMem_id(sess);
		
		memberVO = memberService.getMemberInfoMemId(memberVO);
		// 체크
		// 해당 유저명/아이디/이메일이 있는지 확인
		if (memberVO != null && memberVO.getMem_email() != null && !(memberVO.getMem_email().equals(""))) {
			MailerVO mailerVO = new MailerVO();
			mailerVO.setTemplateSid(179);
			// 회원가입 인증 템플릿 번호는 166번
			// templateSid는 naver api 사이트에서 인가된 계정으로 확인가능-parameter를 보내기위해서는
			// recipientForRequest객체에 파라미터를 세팅해야함
			// 메일 전송 객체 내부의 수신자 객체
			RecipientForRequest recipient = new RecipientForRequest();
			recipient.setAddress(memberVO.getMem_email());
			recipient.setName(memberVO.getMem_name());
			recipient.setType("R");
			
			/// 보내고 싶은 파라미터 데이터를 map에 담으면 된다.
			JSONObject jso = new JSONObject();
			jso.put("otpNum",otpNum);
			// 이메일 인증 테스트용
			recipient.setParameters(jso);
			// System.out.println(jso.toJSONString());
			// 메일 전송 객체 내부의 수신자 객체리스트 ->여러명일 경우 리스트에 ADD
			List<RecipientForRequest> recipients = new ArrayList<RecipientForRequest>();
			recipients.add(recipient);
			
			/*for(RecipientForRequest rcp : recipients) {
				recipients.add(recipient);//수신자명수 만큼 
			}*/
			 
			mailerVO.setRecipients(recipients);
			mailerVO.setParameters(null);
			mailerVO.setIndividual(true);
			mailerVO.setAdvertising(false);
			try { // 메일 전송시 mailerVO객체를 넘겨준다.
				mailingService.mailSender(mailerVO, accesskey, secretkey, apiURL);
			} catch (InvalidKeyException | NoSuchAlgorithmException | IllegalStateException
					| UnsupportedEncodingException e) {
				logger.error("MailSending Error-An Error Occured while Excuting mailing service.");
			}
			
			model.addAttribute("sessId", memberVO.getMem_id());
			model.addAttribute("rs", "complete");
		} else {
			model.addAttribute("rs", "fail");
		}
		
		return "jsonView";
	}
	
	@RequestMapping(value = "/member/verifyOTP.do", method = RequestMethod.POST)
	public String verifyOTPNum(Model model, HttpServletRequest request, HttpServletResponse response,HttpSession session) {
		
		String otpNum =  (String) session.getAttribute("otpNum");
		if(otpNum == null) model.addAttribute("rs", "fail");
		else {
			String otpNumFromClient = request.getParameter("otpNum");
			session.setAttribute("otpNumFromClient",otpNumFromClient);
			
			LocalTime currentTime= LocalTime.now();
			LocalTime otpNumTime = (LocalTime) session.getAttribute("otpNumTime");
			long diffTime = otpNumTime.until(currentTime, ChronoUnit.SECONDS);
			if(diffTime > 180) {
				model.addAttribute("rs", "timeover");
			}else {
				if(otpNum!=null&&otpNumFromClient!=null) { //null 체크
					if(otpNum.equals(otpNumFromClient)) { //otp
						model.addAttribute("timediff",session.getAttribute("timediff"));
						model.addAttribute("rs", "complete");
					}else {
						model.addAttribute("rs", "fail");
					}
				}else {
					model.addAttribute("rs", "fail");
				}
			}
		}
		
		return "jsonView";
	}
	
	@RequestMapping(value="/member/sessionCheck.do",method=RequestMethod.POST)
	public String sessionCheck(Model model, HttpServletRequest request){
		HttpSession session = request.getSession(false);
		
		model.addAttribute("sessionExpiry", session.getAttribute("sessionExpiry"));
		model.addAttribute("latestTouch", session.getAttribute("latestTouch"));
		
		return "jsonView";
	}
	
	@RequestMapping(value="/member/sessionRefresh.do", method = RequestMethod.POST)
	public String sessionRefresh(HttpServletRequest request,Model model) {
		
		HttpSession session = request.getSession(true);
		
		return "jsonView";
	}

	@RequestMapping(value = "/member/moveInfo.do", method = RequestMethod.GET)
	public String moveInfo(Model model, HttpServletRequest request) {
		
		return "member/moveInfo";
	}
}

