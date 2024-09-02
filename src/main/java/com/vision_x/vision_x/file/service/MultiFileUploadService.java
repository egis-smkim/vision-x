package com.vision_x.vision_x.file.service;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

public interface MultiFileUploadService {
	
	public void saveFilesToDir(List<MultipartFile> multipartFiles, String dir);
	
	public void  saveFilesToUserDir(List<MultipartFile> multipartFiles, String dir,String uploadFileName);
	
	public boolean saveSingleFileToDir(MultipartFile mf, String dir);
	
	public boolean saveSingleFileToDirWithModel(MultipartFile mf, String dir);
	
	public void saveFileToUserDirectory(MultipartFile multipartFile, String stamp, String path) throws SQLException;
	
	public HashMap<String, Object> saveSingleFileToPath(MultipartFile multipartFile, String path);
	
	public HashMap<String, Object> saveSingleFileToPathWithStamp(MultipartFile multipartFile, String path, long stamp);
	
	public boolean checkPairModelTextureData(List<MultipartFile> multipartFiles, String modelName) throws SQLException;
	
	public void deleteFileLists(String dir);
	
	public boolean deleteFile(String dir);
	
	public void deleteDirFileLists(String path);

	public String replaceSpecialCharacter(String str);

	public void copyFile(String dir, String newDir, String fileName);
	
}