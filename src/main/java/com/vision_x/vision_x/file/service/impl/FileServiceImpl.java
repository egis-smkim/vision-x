/**
 * 
 */
package com.vision_x.vision_x.file.service.impl;


import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.nio.file.attribute.PosixFilePermission;
import java.nio.file.attribute.PosixFilePermissions;
import java.sql.SQLException;
import java.util.List;
import java.util.Set;

import javax.annotation.Resource;

import org.mozilla.universalchardet.UniversalDetector;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.vision_x.vision_x.file.service.FileService;
import com.vision_x.vision_x.file.service.FileVO;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

/**
 * FileServiceImpl.java
 * digitalTwin
 * 2021. 4. 2.
 * @author Khaia
 * @Comment
 *
 */
@Service("fileService")
public class FileServiceImpl extends EgovAbstractServiceImpl implements FileService {
	
	@Resource(name="fileDAO")
	private FileDAO fileDAO;
	
	protected Logger logger = LoggerFactory.getLogger(this.getClass());
	
	@Override
	public boolean checkFileExists(String path) {
		// TODO Auto-generated method stub
		
		boolean isExists = false;
		if(path != null) path = path.replaceAll("\\\\", "").replaceAll("&", "");

		File file = new File(path);
		
		if(file.exists()) {
			isExists = true;
		}
		
		return isExists;
	}

	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.file.service.FileService#deleteFile(java.lang.String)
	 */
	@Override
	public boolean deleteFile(String path) {
		// TODO Auto-generated method stub
		
		boolean rs = false;
		if(path != null) path = path.replaceAll("\\\\", "").replaceAll("&", "");
		File file = new File(path);
		
		if(file.exists()) {
			file.delete();
		}
		
		if(!file.exists()) {
			rs = true;
		}
		
		return rs;
	}

	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.file.service.FileService#createDirectory(java.lang.String)
	 */
	@Override
	public boolean createDirectory(String path) {
		// TODO Auto-generated method stub
		if(path != null) path = path.replaceAll("\\\\", "").replaceAll("&", "");
		File file = new File(path);
		file.setExecutable(false); //실행권한
		file.setReadable(true);   //읽기권한
		file.setWritable(true);   //쓰기권한
		
		if(!file.isDirectory()) {
			file.mkdirs();
		}
		
		return file.isDirectory();
	}

	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.file.service.FileService#fileCopyToTargetDirectory(java.lang.String, java.lang.String)
	 */
	@Override
	public boolean fileCopyToTarget(String source, String target) {
		// TODO Auto-generated method stub

		boolean rs = false;
		
		Path src = Paths.get(source);
		Path tgt = Paths.get(target);
		
		if(!Files.exists(tgt.getParent())) {
			try {
				Files.createDirectories(tgt.getParent());
				Files.copy(src, tgt, StandardCopyOption.REPLACE_EXISTING);
				
				if(Files.exists(tgt)) {
					rs = true;
				}
			} catch (IOException e) {
				logger.error("FILE ERROR-IOException");
			}
		}
		
		return rs;
	}

	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.file.service.FileService#checkFileEncoding(java.io.File)
	 */
	@Override
	public String checkFileEncoding(MultipartFile mf){
		
		String encoding = "";

		InputStream is=null;
		UniversalDetector detector = null;
		
		try {
			is = mf.getInputStream();
			byte[] buf = new byte[4096];
			detector = new UniversalDetector(null);
			
			int nread;
			while((nread = is.read(buf)) > 0 && !detector.isDone()) {
				detector.handleData(buf, 0, nread);
			}
			
			detector.dataEnd();
			encoding = detector.getDetectedCharset();
			
		} catch (IOException e1) {
			// TODO Auto-generated catch block
			logger.error("[ERROR-FSIMP-001] - checkFileEncoding i/o exception");
		}finally {
			if(is != null) {
				try {
					is.close();
				} catch (IOException e) {
					logger.error("[ERROR-FSIMP-001] - checkFileEncoding  file i/o exception");
				}
			}
			
			if(detector != null) {
				detector.reset();
			}
		}
		
		return encoding;
		
	}

	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.file.service.FileService#createAndChmodDirectory(java.lang.String, java.lang.String)
	 */
	@Override
	public boolean createAndChmodDirectory(String path, String permission) {
		// TODO Auto-generated method stub
		
		boolean rs = false;
		if(path != null) path = path.replaceAll("\\\\", "").replaceAll("&", "");
		File file = new File(path);
		file.setExecutable(false); //실행권한
		file.setReadable(true);   //읽기권한
		file.setWritable(true);   //쓰기권한
		
		if(!file.exists()) {
			file.mkdirs();
			logger.info("Directories created into:"+file.getAbsolutePath()+"\n FileName:"+file.getName());
		}

		this.changeDirectoryPermission(path, permission);
		logger.info("Directory Permission changed");
		
		if(file.isDirectory()) {
			rs = true;
		}
		
		return rs;
	}

	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.file.service.FileService#partCreateAndChmodDirectory(java.lang.String[], java.lang.String, java.lang.String)
	 */
	@Override
	public boolean partCreateAndChmodDirectory(String exceptPath, String path, String permission) {
		// TODO Auto-generated method stub
		boolean rs = false;

		String[] pathArray = path.split("/");
		
		String targetPath = exceptPath;
		
		for(int i = 0; i < pathArray.length; i++) {
			targetPath += File.separator + pathArray[i];
			
			logger.info("targetPath:"+targetPath);
			if(targetPath != null) targetPath = targetPath.replaceAll("\\.", "").replaceAll("\\\\", "").replaceAll("&", "");
			File file = new File(targetPath);
			file.setExecutable(false); //실행권한
			file.setReadable(true);   //읽기권한
			file.setWritable(true);   //쓰기권한
			
			if(!file.isDirectory()) {
				if(file.mkdirs()) {
					this.changeDirectoryPermission(targetPath, permission);
				}
			}
		}
		
		return rs;
	}

	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.file.service.FileService#changeDirectoryPermission(java.lang.String, java.lang.String)
	 */
	@Override
	public void changeDirectoryPermission(String path, String permission){
		// TODO Auto-generated method stub
		
		Path pathDirectory = Paths.get(path);
		
		Set<PosixFilePermission> posixPermissions = null;
	
		try {
			
			switch(permission) {
				case "777" :
					posixPermissions = PosixFilePermissions.fromString("rwxrwxrwx");
				break;
				
				case "775" :
					posixPermissions = PosixFilePermissions.fromString("rwxrwxr-x");
				break;
				
				case "755" :
					posixPermissions = PosixFilePermissions.fromString("rwxr-xr-x");
				break;

				case "664" :
					posixPermissions = PosixFilePermissions.fromString("rw-rw-r--");
				break;
				
				case "644" :
					posixPermissions = PosixFilePermissions.fromString("rw-r--r--");
				break;
			}
			
			Files.setPosixFilePermissions(pathDirectory, posixPermissions);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			logger.error("[ERROR-FSIP-001] - file permission error");
		}
	}

	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.file.service.FileService#getFileDataFromDataId(int)
	 */
	@Override
	public FileVO getFileDataFromDataId(int dataid) {
		// TODO Auto-generated method stub
		try {
			return fileDAO.getFileDataFromDataId(dataid);
		}
		catch (RuntimeException e) {
			logger.error("SELET ERROR-RuntimeException");
		}
		catch (Exception e) {
			logger.error("SELET ERROR");
		}
		return null;
	}

	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.file.service.FileService#getFileListForDataId(int)
	 */
	@Override
	public List<FileVO> getFileListForDataId(int dataid) throws SQLException {
		// TODO Auto-generated method stub
		return fileDAO.getFileListForDataId(dataid);
	}

	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.file.service.FileService#deleteFileRecord(com.vision_x.vision_x.file.service.FileVO)
	 */
	@Override
	public int deleteFileRecord(FileVO fileVO) throws SQLException {
		// TODO Auto-generated method stub
		return fileDAO.deleteFileRecord(fileVO);
	}
}
