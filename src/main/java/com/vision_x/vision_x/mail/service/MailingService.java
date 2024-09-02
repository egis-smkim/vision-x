package com.vision_x.vision_x.mail.service;

import java.io.UnsupportedEncodingException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;

public interface MailingService {
	//메일 보내기
	public HashMap<String,String> mailSender(MailerVO mailerVO,String accesskey,String secretkey,String apiURL) throws InvalidKeyException, NoSuchAlgorithmException, IllegalStateException, UnsupportedEncodingException;
	/**메일 템플릿 정보 가져오기
	 * 요청파라미터
	 * templateSid 템플릿 sid
	 */
	public HashMap<String,String> getTemplate(String templateSid);
	/**
	 * 요청파라미터
	 * categorySid	No	String	Default:-1 (root)	부모 카테고리 sid
	 * templateName	Yes	String	Max:100	템플릿 이름
	 * description	No	String	Max:300	템플릿 설명
	 * title	Yes	String	Max:500	메일 제목
	 * body	Yes	String		메일 본문
	 * senderAddress	Yes	String		발송자 메일 주소
	 * senderName	No	String	Max:69	발송자 이름
	 * isUse	No	Boolean	Default:true	템플릿 사용 여부
	 */
	public HashMap<String,String> createTemplate();
}

