package com.vision_x.vision_x.enc.service;

public interface EncryptService {
	String EncryptedToSha256(String keyword);
	String EncryptedToSha256(String keyword,String salt);
	String getSha256Json(String keyword);
	String getSha256Json(String keyword,String salt);
	
	String Encrypt(String keyword,String type,Boolean jsonFlag);
}
