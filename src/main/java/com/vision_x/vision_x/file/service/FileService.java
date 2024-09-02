/**
 * 
 */
package com.vision_x.vision_x.file.service;


import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

/**
 * FileService.java
 * digitalTwin
 * 2021. 4. 2.
 * @author Khaia
 * @Comment File Util And MEMBER_FILES TBL
 *
 */
public interface FileService {
	public boolean checkFileExists(String path);
	
	public boolean deleteFile(String path);
	
	public boolean createDirectory(String path);
	
	public boolean fileCopyToTarget(String source, String target);
	
	public String checkFileEncoding(MultipartFile mf);
	
	public boolean createAndChmodDirectory(String path, String permission);
	
	// 서버 기본 패스 제외 사용자 디렉토리 생성 및 퍼미션 조정
	public boolean partCreateAndChmodDirectory(String exceptPath, String path, String permission);
	
	public void changeDirectoryPermission(String path, String permission) throws SQLException,IOException;
	
	public FileVO getFileDataFromDataId(int dataid);
	
	public List<FileVO> getFileListForDataId(int dataid) throws SQLException;
	
	public int deleteFileRecord(FileVO fileVO) throws SQLException; 
	
}