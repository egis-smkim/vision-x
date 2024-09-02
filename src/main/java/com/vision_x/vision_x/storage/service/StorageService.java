/**
 * 
 */
package com.vision_x.vision_x.storage.service;

import java.util.HashMap;

/**
 * StorageService.java
 * digitalTwin
 * 2021. 6. 29.
 *
 */
public interface StorageService {
	//현재 용량 체크
	public String checkStorageUsable(String path);
	//사용자별 최대 용량 체크 
	public HashMap<String, String> checkStorageMax(int memid);
	//사용자별 최대 용량 변경
	public void changeStorageMax(HashMap<String, String> map);
	//사용자의 디렉토리에 특정 데이터 용량 추가 가능한지 확인
	public boolean checkStorageUpload(HashMap<String, String> map);
	
	public String[] checkStorageInDirectory(String path);
	
}