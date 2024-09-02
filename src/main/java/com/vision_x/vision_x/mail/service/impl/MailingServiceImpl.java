package com.vision_x.vision_x.mail.service.impl;


import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.MalformedURLException;
import java.net.URL;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;

import javax.net.ssl.HttpsURLConnection;

import org.json.JSONException;
import org.json.simple.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.vision_x.vision_x.mail.service.MailerVO;
import com.vision_x.vision_x.mail.service.MailingService;
import com.vision_x.vision_x.mail.service.MakeSignature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;

@Service("mailingService")
public class MailingServiceImpl implements MailingService{
	protected Logger logger = LoggerFactory.getLogger(this.getClass());
	/**
	 * MilerVO(메일 내용 객체)와 accesskey,secretkey,HTTPS 요청 BODY객체를 파라미터로 받아서 naver api를 이용해 메일을 전송하는 메소드 
	 * @throws UnsupportedEncodingException 
	 * @throws IllegalStateException 
	 * @throws NoSuchAlgorithmException 
	 * @throws InvalidKeyException 
	 */
	@Override
	public HashMap<String,String> mailSender(MailerVO mailerVO,String accesskey,String secretkey,String apiURL) throws InvalidKeyException, NoSuchAlgorithmException, IllegalStateException, UnsupportedEncodingException {

		//시그너쳐 v1  객체 생성
		MakeSignature mkSigature = new MakeSignature();

		//액세스키와 시크릿키를 인자값으로 시그니쳐 v1을 받아온다.
		HashMap <String,String> map =(HashMap<String, String>) mkSigature.makeSignature(accesskey,secretkey);

		//받아온 맵에 두가지 인자값을 호출 -> Api 호출할떄 HTTPS통신에서 헤더에 필수적으로 입력해야한다.
		String signature_v1 = map.get("signature_v1");
		String timestamp = map.get("timestamp");

		HttpsURLConnection conn = null;
		BufferedReader br = null;
		InputStream inputStream = null;
		InputStreamReader inputStreamReader = null;

		try {
			// URL 설정
			URL url = new URL(apiURL);

			conn = (HttpsURLConnection) url.openConnection();

			// type의 경우 POST, GET, PUT, DELETE 가능
			// Header설정
			conn.setRequestMethod("POST");
			// makeSignature()함수가 실행될때의 내부에서 생성되는 DATE객체에서 얻어온 시간(밀리초)
			conn.setRequestProperty("x-ncp-apigw-timestamp",timestamp);
			// 내부 properties 파일에 저장되어 있는 acceesskey
			conn.setRequestProperty("x-ncp-iam-access-key",accesskey);
			// signature 버전1
			conn.setRequestProperty("x-ncp-apigw-signature-v1",signature_v1);
			// 보내는 형식 request Body을 json형식
			conn.setRequestProperty("Content-Type", "application/json; utf-8");
			// 서버 responseData를 JSON형식으로 요청
			conn.setRequestProperty("Accept", "application/json");
			//응답을 받으려면 true로 설정해야함
			conn.setDoOutput(true);
			//END OF 컨트롤러 단으로 옮길 부분
			//Request BODY
			//Gson 라이브러리를 사용하여 객체를 JSON으로 변환
			Gson gson = new Gson();
			String objJson = gson.toJson(mailerVO);
			// Request Body에 Data를 담기

			try(OutputStream os = conn.getOutputStream()) {
			    byte[] input = objJson.getBytes("utf-8");
			    os.write(input, 0, input.length);			
			}
			int responseCode = conn.getResponseCode();
			// Response 응답 받기
			inputStream = conn.getInputStream();
			inputStreamReader = new InputStreamReader(inputStream, "utf-8");
			br = new BufferedReader(inputStreamReader);
		    StringBuilder response = new StringBuilder();
		    String responseLine = null;
		    while ((responseLine = br.readLine()) != null) {
		        response.append(responseLine.trim());
		    }
			logger.info("메일 전송 HTTP 응답 코드 : " + responseCode);
			logger.info("메일 전송 HTTP body : : " + response.toString());
			map.put("responseCode",String.valueOf(responseCode));
			map.put("response",String.valueOf(response.toString()));
		    //삭제 혹은 수정 부분.
		} catch (MalformedURLException e) {
			logger.error("URLError-MalformedURLException");
		} catch (IOException e) {
			logger.error("Data Access Error-IOException");
		} catch (JSONException e) {
			logger.error("not JSON Format response-JSONException");
		} finally {
			try {
				if(br != null) br.close();
				if(inputStream != null) inputStream.close();
				if(inputStreamReader != null) inputStreamReader.close();
				if(conn != null) conn.disconnect();
			} catch (IOException e) {
				logger.error("SERVER ERROR-IOException");
			}
		}

		return map;
	}
	
	@Override
	public HashMap<String, String> getTemplate(String templateSid) {
		// TODO Auto-generated method stub
		return null;
	}
	@Override
	public HashMap<String, String> createTemplate() {
		// TODO Auto-generated method stub
		return null;
	}
  
	
}
