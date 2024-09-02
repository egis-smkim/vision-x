package com.vision_x.vision_x.enc.service.impl;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import org.springframework.stereotype.Service;

import com.vision_x.vision_x.enc.service.EncryptService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import net.sf.json.JSONObject;
@Service("encryptService")
public class EncryptServiceImpl implements EncryptService {
	
	protected Logger logger = LoggerFactory.getLogger(this.getClass());
	
	@Override
	public String EncryptedToSha256(String keyword) {
		
		MessageDigest md;
		String string_sha256 =null;
		if(!keyword.equals("")||keyword!=null) {
			try {
				md = MessageDigest.getInstance("SHA-256");
		        md.update(keyword.getBytes());
		        
		        StringBuilder builder = new StringBuilder();
		        for (byte b: md.digest()) {
		          builder.append(String.format("%02x", b));
		        }
		        string_sha256 = builder.toString();		        
			}
			catch (NoSuchAlgorithmException e) {
				logger.error("EncryptedToSha256 Error-NoSuchAlgorithmException");
			}
			catch (Exception e) {
				logger.error("EncryptedToSha256 Error-Exception");
			} 
			
		}
		if(string_sha256 != null) string_sha256 = string_sha256.substring(0, 24);//24자리까지만 사용
		return string_sha256;
	}

	@Override
	public String EncryptedToSha256(String keyword, String salt) {
		MessageDigest md;
		String string_sha256 =null;
		if(!keyword.equals("")||keyword!=null) {
			try {
				md = MessageDigest.getInstance("SHA-256");
		        md.update(keyword.getBytes());
		        
		        StringBuilder builder = new StringBuilder();
		        for (byte b: md.digest()) {
		          builder.append(String.format("%02x", b));
		        }
		        string_sha256 = builder.toString();		        
			}
			catch (NoSuchAlgorithmException e) {
				logger.error("EncryptedToSha256 Error-NoSuchAlgorithmException");
			}
			catch (Exception e) {
				logger.error("EncryptedToSha256 Error-Exception");
			} 
		}
		return string_sha256+salt;
	}

	@Override
	public String getSha256Json(String keyword) {
		MessageDigest md;
		String string_sha256 =null;
		JSONObject jso = null;
		if(!keyword.equals("")||keyword!=null) {
			try {
				md = MessageDigest.getInstance("SHA-256");
		        md.update(keyword.getBytes());
		        
		        StringBuilder builder = new StringBuilder();
		        for (byte b: md.digest()) {
		          builder.append(String.format("%02x", b));
		        }
		        string_sha256 = builder.toString();
		        jso = new JSONObject();
		        jso.put("hash", string_sha256);
		        
		        
		        
		        
			}
			catch (NoSuchAlgorithmException e) {
				logger.error("EncryptedToSha256 Error-NoSuchAlgorithmException");
			}
			catch (Exception e) {
				logger.error("EncryptedToSha256 Error-Exception");
			} 
		}
		String result = null;
		if(jso != null) result = jso.toString();
		return result;
	}

	@Override
	public String getSha256Json(String keyword, String salt) {
		MessageDigest md;
		String string_sha256 =null;
		JSONObject jso = null;
		if(!keyword.equals("")||keyword!=null) {
			try {
				md = MessageDigest.getInstance("SHA-256");
		        md.update(keyword.getBytes());
		        
		        StringBuilder builder = new StringBuilder();
		        for (byte b: md.digest()) {
		          builder.append(String.format("%02x", b));
		        }
		        string_sha256 = builder.toString();
		        jso = new JSONObject();
		        jso.put("hash", string_sha256+salt);
		        
			}
			catch (NoSuchAlgorithmException e) {
				logger.error("EncryptedToSha256 Error-NoSuchAlgorithmException");
			}
			catch (Exception e) {
				logger.error("EncryptedToSha256 Error-Exception");
			} 
		}
		String result = null;
		if(jso != null) result = jso.toString();
		return result;
	}

	
	@Override
	public String Encrypt(String keyword,String type, Boolean jsonFlag) {
		MessageDigest md;
		String string_sha256 =null;
		JSONObject jso = null;
		if(!keyword.equals("")||keyword!=null) {
			try {
				md = MessageDigest.getInstance(type);
		        md.update(keyword.getBytes());
		        
		        StringBuilder builder = new StringBuilder();
		        for (byte b: md.digest()) {
		          builder.append(String.format("%02x", b));
		        }
		        string_sha256 = builder.toString();		        
			}
			catch (NoSuchAlgorithmException e) {
				logger.error("EncryptedToSha256 Error-NoSuchAlgorithmException");
			}
			catch (Exception e) {
				logger.error("EncryptedToSha256 Error-Exception");
			} 
		}
		if(jsonFlag == true || jsonFlag.equals("1")) { //json으로 돌려받고 싶을때 1
			jso = new JSONObject();
	        jso.put("hash", string_sha256);
			return  jso.toString();
		}else {
			return string_sha256;
		}
		
	}
	
	
	
}