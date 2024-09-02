package com.vision_x.vision_x.mail.service;

import java.io.UnsupportedEncodingException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

public class MakeSignature {
	
    
	public Map<String,String> makeSignature(String accesskey,String secretkey) throws NoSuchAlgorithmException, InvalidKeyException, IllegalStateException, UnsupportedEncodingException {

		//Getting the current date 
		//현재 시간을 가져옵니다.
	    Date date = new Date();
	    //This method returns the time in millis
	    //현재시간과 표준시간(1970년 기준시)와의 차를 milisecond로 가져옵니다.
	    long timeMilli = date.getTime();
		
		
		String space = " ";  // 공백
	    String newLine = "\n";  // 줄바꿈
	    String method = "POST";  // HTTP 메소드
	    String url = "/api/v1/mails";  // 도메인을 제외한 "/" 아래 전체 url (쿼리스트링 포함)
	    //중요!!!!!!!!!! # 요청 5분 이내에만 유효함
	    String timestamp = Long.toString(timeMilli);  // 현재 타임스탬프 (epoch, millisecond) 
	    String accessKey = accesskey;  // access key id (from portal or sub account)
	    String secretKey = secretkey;  // secret key (from portal or sub account)
	  
	    String message = new StringBuilder()
	        .append(method)
	        .append(space)
	        .append(url)
	        .append(newLine)
	        .append(timestamp)
	        .append(newLine)
	        .append(accessKey)
	        .toString();

	    SecretKeySpec signingKey = new SecretKeySpec(secretKey.getBytes("UTF-8"), "HmacSHA256");
	    Mac mac = Mac.getInstance("HmacSHA256");
	    mac.init(signingKey);

	    byte[] rawHmac = mac.doFinal(message.getBytes("UTF-8"));
	    String encodeBase64String = Base64.getEncoder().encodeToString(rawHmac);
	    
	    Map<String,String> map = new HashMap<>();
	    
	    //x-ncp-apigw-signature-v1 버전1입니다. 
	    map.put("signature_v1",encodeBase64String);
	    map.put("timestamp",timestamp);

	  return map;

	}

}
