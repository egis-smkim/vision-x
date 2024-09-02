package com.vision_x.vision_x.file.service.impl;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.nio.file.attribute.PosixFilePermission;
import java.nio.file.attribute.PosixFilePermissions;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Set;

import org.apache.commons.compress.utils.FileNameUtils;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


import com.vision_x.vision_x.file.service.MultiFileUploadService;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("multiFileUploadService")
public class MultiFileUploadServiceImpl extends EgovAbstractServiceImpl implements MultiFileUploadService {
	
	protected Logger logger = LoggerFactory.getLogger(this.getClass());
	
	@Override
	public void saveFilesToDir(List<MultipartFile> multipartFiles, String dir) {
		if(dir != null) dir = dir.replaceAll("\\\\", "").replaceAll("&", "");
		try {
			File file = new File(dir);
			if(!file.isDirectory()) {
				file.setExecutable(false); //실행권한
				file.setReadable(true);   //읽기권한
				file.setWritable(true);   //쓰기권한
				file.mkdir();
			}

			String OS = System.getProperty("os.name").toLowerCase();
			if(OS.indexOf("win") == -1) {
				// /mnt/data/DT_DATA/userData/
				Path pathDirectory = Paths.get(dir);
				Set<PosixFilePermission> posixPermissions = PosixFilePermissions.fromString("rwxrwxr-x");
				Files.setPosixFilePermissions(pathDirectory, posixPermissions);
			}
			
			for(MultipartFile multipartFile : multipartFiles) {
				FileOutputStream fos = null;
				try {
					file = new File(dir+multipartFile.getOriginalFilename());
					fos = new FileOutputStream(file);
					IOUtils.copy(multipartFile.getInputStream(),fos);
		        } catch (IOException e) {
		        	logger.error("Data Access Error-IOException");
		        } finally {
		        	if(fos != null) fos.close();
				}
				
			}
			
		} catch (FileNotFoundException e) {
			logger.error("File Error-FileNotFoundException");
		} catch (IOException e) {
			logger.error("Data Access Error-IOException");
		} 
	}
	
	
	@Override
	public void saveFileToUserDirectory(MultipartFile multipartFile, String stamp, String path){
		if(path != null) path = path.replaceAll("\\\\", "").replaceAll("&", "");
		FileOutputStream fos = null; 
		try {
			String orgFileName = multipartFile.getOriginalFilename();
			if(orgFileName != null) orgFileName = orgFileName.replaceAll("/", "").replaceAll("\\\\", "");
			String fileBaseName = FilenameUtils.getBaseName(orgFileName);
			String fileExtention = FilenameUtils.getExtension(orgFileName);
			
			if(fileExtention==null) {
				try {
					throw new NullPointerException();
				} catch (NullPointerException e) {
					logger.error("NullPointerError-NullPointerException");
				}
				
			}else {
				String saveFileName = this.replaceSpecialCharacter(fileBaseName)+"_"+stamp+"."+fileExtention.toUpperCase();
				
				File file = new File(path);
				
				
				if(!file.isDirectory()) {
					// chmod 755
					file.setReadable(true, false);
					file.setWritable(false, false);
					file.setWritable(true, true);
					
					file.mkdir();
				}
				fos= new FileOutputStream(path+saveFileName);
				IOUtils.copy(multipartFile.getInputStream(),fos);
				
			}
		} catch (FileNotFoundException e) {
			logger.error("File Error-FileNotFoundException");
		} catch (IOException e) {
			logger.error("Data Access Error-IOException");
		} finally {
			try {
				if(fos!=null) {
					fos.close();
				}
			} catch (IOException e) {
				logger.error("Data Access Error-IOException");
			}
		}
	}
	
	@Override
	public HashMap<String, Object> saveSingleFileToPath(MultipartFile multipartFile, String path){
		
		logger.info("savePath:"+path);
		
		HashMap<String, Object> map = new HashMap<>();
		InputStream fis = null;
		FileOutputStream fos = null;
		
		String orgFileName = multipartFile.getOriginalFilename();
		if(orgFileName != null) orgFileName = orgFileName.replaceAll("/", "").replaceAll("\\\\", "");
		String fileBaseName = FilenameUtils.getBaseName(orgFileName);
		String fileExtention = FilenameUtils.getExtension(orgFileName);
		
		try {
			if(path != null) path = path.replaceAll("\\\\", "").replaceAll("&", "");
			File savePath = new File(path);
			
			if(!savePath.isDirectory()) {
				savePath.setExecutable(false); //실행권한
				savePath.setReadable(true);   //읽기권한
				savePath.setWritable(true);   //쓰기권한
				boolean r = savePath.mkdirs();
				
				logger.info("CreateDires:"+r);
				
				if(System.getProperty("spring.profiles.active")==null) {
					try {
						throw new NullPointerException();
					} catch (NullPointerException e) {
						logger.error("NullPointerError-NullPointerException");
					}
					
				}
				String OS = System.getProperty("os.name").toLowerCase();
				if(OS.indexOf("win") == -1) {
					// /mnt/data/DT_DATA/userData/

					Path pathDirectory = Paths.get(path);
					Set<PosixFilePermission> posixPermissions = PosixFilePermissions.fromString("rwxrwxr-x");
					Files.setPosixFilePermissions(pathDirectory, posixPermissions);

				}

			}
			
			Date now = new Date();
			long ut3 = now.getTime() / 1000L;
			
			String fileName = this.replaceSpecialCharacter(fileBaseName)+"_"+String.valueOf(ut3)+"."+fileExtention;
			String savedFileBaseName = this.replaceSpecialCharacter(fileBaseName)+"_"+String.valueOf(ut3);
			String splitOutTxt = this.replaceSpecialCharacter(fileBaseName)+"_"+String.valueOf(ut3)+".txt";
			
			String saveFileName = path+fileName;
			
			logger.info("saveFileName :"+saveFileName);
			fis = multipartFile.getInputStream();
			fos = new FileOutputStream(saveFileName);
			IOUtils.copy(fis,fos);
			if(System.getProperty("spring.profiles.active")==null) {
				try {
					throw new NullPointerException();
				} catch (NullPointerException e) {
					logger.error("NullPointerError-NullPointerException");
				}
			}
			String OS = System.getProperty("os.name").toLowerCase();
			if(OS.indexOf("win") == -1) {	// /mnt/data/DT_DATA/userData/

				Path pathDirectory = Paths.get(saveFileName);
				Set<PosixFilePermission> posixPermissions = PosixFilePermissions.fromString("rw-r--r--");
				Files.setPosixFilePermissions(pathDirectory, posixPermissions);

			}
			
			map.put("SAVE_FULL_PATH", saveFileName);
			map.put("SAVED_FILE_NAME", fileName);
			map.put("ORIGINAL_FILE_NAME", orgFileName);
			map.put("FILE_BASE", savedFileBaseName);
			if(fileExtention==null) {
				try {
					throw new NullPointerException();
				} catch (NullPointerException e) {
					logger.error("NullPointerError-NullPointerException");
				}
			}else {
				map.put("FILE_EXT", fileExtention.toUpperCase());
			}
			map.put("FILE_SIZE", multipartFile.getSize());
			map.put("FILE_TYPE", multipartFile.getContentType());
			map.put("SPLIT_OUT_TXT", splitOutTxt);
			

		} catch (FileNotFoundException e1) {
			// TODO Auto-generated catch block
			logger.error("[ERROR-MFUSIP]- file not foundException");
		} catch (IOException e) {
			logger.error("Data Access Error-IOException");
		} finally {
			if(fis!=null) {
				try {
					fis.close();
				} catch (IOException e) {
					logger.error("Data Access Error-IOException");
				}
			}
			if(fos!=null) {
				try {
					fos.flush();
					fos.close();
				} catch (IOException e) {
					logger.error("Data Access Error-IOException");
				}
			}
		}
		
		return map;
	}
	
	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.file.service.MultiFileUploadService#saveSingleFileToPathWithStamp(org.springframework.web.multipart.MultipartFile, java.lang.String, long)
	 */
	@Override
	public HashMap<String, Object> saveSingleFileToPathWithStamp(MultipartFile multipartFile, String path, long stamp) {
		// TODO Auto-generated method stub
		logger.info("savePath:"+path);
		
		
		
		HashMap<String, Object> map = new HashMap<>();
		InputStream fis = null;
		FileOutputStream fos = null;
		try {
			if(path != null) path = path.replaceAll("\\\\", "").replaceAll("&", "");
			File savePath = new File(path);
			
			if(!savePath.isDirectory()) {
				
				logger.info("Directory Not Exists");
				savePath.setExecutable(false); //실행권한
				savePath.setReadable(true);   //읽기권한
				savePath.setWritable(true);   //쓰기권한
				boolean r = savePath.mkdirs();
				
				logger.info("CreateDires:"+r);
				
				if(System.getProperty("spring.profiles.active")==null) {
					try {
						throw new NullPointerException();
					} catch (NullPointerException e) {
						logger.error("NullPointerError-NullPointerException");
					}
				}
				String OS = System.getProperty("os.name").toLowerCase();
				if(OS.indexOf("win") == -1) {	// /mnt/data/DT_DATA/userData/

					Path pathDirectory = Paths.get(path);
					Set<PosixFilePermission> posixPermissions = PosixFilePermissions.fromString("rwxrwxr-x");
					Files.setPosixFilePermissions(pathDirectory, posixPermissions);

				}

			}
			
			String orgFileName = multipartFile.getOriginalFilename();
			if(orgFileName != null) orgFileName = orgFileName.replaceAll("/", "").replaceAll("\\\\", "");
			String fileBaseName = FilenameUtils.getBaseName(orgFileName);
			String fileExtention = FilenameUtils.getExtension(orgFileName);
			
			//logger.info("org:"+orgFileName+"/base:"+fileBaseName+"/ext:"+fileExtention);
			
			long ut3 = stamp;
			
			String fileName = this.replaceSpecialCharacter(fileBaseName)+"_"+String.valueOf(ut3)+"."+fileExtention;
			String savedFileBaseName = this.replaceSpecialCharacter(fileBaseName)+"_"+String.valueOf(ut3);
			String splitOutTxt = this.replaceSpecialCharacter(fileBaseName)+"_"+String.valueOf(ut3)+".txt";
			
			String saveFileName = path+fileName;
			fis = multipartFile.getInputStream();
			fos = new FileOutputStream(saveFileName);
			IOUtils.copy(fis, fos);
			if(System.getProperty("spring.profiles.active")==null) {
				try {
					throw new NullPointerException();
				} catch (NullPointerException e) {
					logger.error("NullPointerError-NullPointerException");
				}
			}
			String OS = System.getProperty("os.name").toLowerCase();
			if(OS.indexOf("win") == -1) {	// /mnt/data/DT_DATA/userData/

				Path pathDirectory = Paths.get(saveFileName);
				Set<PosixFilePermission> posixPermissions = PosixFilePermissions.fromString("rw-r--r--");
				Files.setPosixFilePermissions(pathDirectory, posixPermissions);

			}
			
			map.put("SAVE_FULL_PATH", saveFileName);
			map.put("SAVED_FILE_NAME", fileName);
			map.put("ORIGINAL_FILE_NAME", orgFileName);
			map.put("FILE_BASE", savedFileBaseName);
			if(fileExtention==null) {
				try {
					throw new NullPointerException();
				} catch (NullPointerException e) {
					logger.error("NullPointerError-NullPointerException");
				}
			}else {
				map.put("FILE_EXT", fileExtention.toUpperCase());
			}
			map.put("FILE_SIZE", multipartFile.getSize());
			map.put("FILE_TYPE", multipartFile.getContentType());
			map.put("SPLIT_OUT_TXT", splitOutTxt);
			
			
			
		}  catch (IOException e) {
			logger.error("Data Access Error-IOException");
		} finally {
			try {
				if(fis!=null) {
					fis.close();
				}
			} catch (IOException e) {
				logger.error("Data Access Error-IOException");
			}
			try {
				if(fos!=null) {
					fos.flush();
					fos.close();
				}
			} catch (IOException e) {
				logger.error("Data Access Error-IOException");
			}
		}
		
		return map;
	}
	
	@Override
	public boolean checkPairModelTextureData(List<MultipartFile> multipartFiles, String modelName){
		boolean isPair = false;
		
		for(MultipartFile mf : multipartFiles) {
			String orgFileName = mf.getOriginalFilename();
			if(orgFileName != null) orgFileName = orgFileName.replaceAll("/", "").replaceAll("\\\\", "");
			String fileBaseName = FilenameUtils.getBaseName(orgFileName);
			String fileExtention = FilenameUtils.getExtension(orgFileName);
			if(fileBaseName==null||fileExtention==null) {
				try {
					throw new NullPointerException();
				} catch (NullPointerException e) {
					logger.error("NullPointerError-NullPointerException");
				}
			}else {
				if(fileExtention.toUpperCase().equals("JPG") || fileExtention.toUpperCase().equals("PNG")) {
					isPair = true;
				}
			}
			
		}
		
		
		return isPair; 
	}
	
	@Override
	public void deleteFileLists(String dir) {
		if(dir != null) dir = dir.replaceAll("\\\\", "").replaceAll("&", "");
		File file = new File(dir); 
		
		if(file.exists()) {
			file.delete();
		}
	}
	
	@Override
	public void deleteDirFileLists(String path){
		if(path != null) path = path.replaceAll("\\\\", "").replaceAll("&", "");
		File folder = new File(path);
	
		try {
		    while(folder.exists()) {
		    	if(folder!=null) {
		    		File[] folder_list = folder.listFiles(); //파일리스트 얻어오기
					if(folder_list != null) {
						for (int j = 0; j < folder_list.length; j++) {
							folder_list[j].delete(); //파일 삭제 
						}
						if(folder_list.length == 0 && folder.isDirectory()){ 
							folder.delete(); //대상폴더 삭제
						}
					}
		    	}
	        }
		 } catch (SecurityException e) {
			 logger.error("Security Violation Error-SecurityException");
		}
	}

	
	@Override
	public boolean saveSingleFileToDirWithModel(MultipartFile mf, String dir) {
		if(dir != null) dir = dir.replaceAll("\\\\", "").replaceAll("&", "");
		boolean isComplete = false;
		InputStream fis = null;
		FileOutputStream fos = null;
		
		try {
		
			File fileDirectory = new File(dir);
			
			if(!fileDirectory.isDirectory()) {
				//file.mkdir();
				logger.info("no dir");;
				//file.getParentFile().mkdirs();
				//FileWriter writer = new FileWriter(file);
				fileDirectory.setExecutable(false); //실행권한
				fileDirectory.setReadable(true);   //읽기권한
				fileDirectory.setWritable(true);   //쓰기권한
				fileDirectory.mkdirs();
			}

			String OS = System.getProperty("os.name").toLowerCase();
			if(OS.indexOf("win") == -1) {	// /mnt/data/DT_DATA/userData/
				Path pathDirectory = Paths.get(dir);
				Set<PosixFilePermission> posixPermissions = PosixFilePermissions.fromString("rwxrwxr-x");
				Files.setPosixFilePermissions(pathDirectory, posixPermissions);
			}
			
			// file.getParentFile().mkdirs();
			String fileName=FileNameUtils.getBaseName(mf.getOriginalFilename());
			
			String ext="";
			if(mf != null && mf.getOriginalFilename() != null) ext = FilenameUtils.getExtension(mf.getOriginalFilename()).toLowerCase();
			
			File f = new File(dir+fileName+"."+ext);
			
			if(f.exists()) {
				f.delete();
			}
			
			fis = mf.getInputStream();
			fos = new FileOutputStream(f);
			IOUtils.copy(fis,fos);
			
			if(f.exists()) {
				isComplete = true;
			}
			
			
		} catch (FileNotFoundException e) {
			logger.error("File Error-FileNotFoundException");
		} catch (IOException e) {
			logger.error("Data Access Error-IOException");
		} finally {
			try {
				if(fis!=null) {
					fis.close();
				}
			} catch (IOException e) {
				logger.error("Data Access Error-IOException");
			}
			
			try {
				if(fos!=null) {
					fos.flush();
					fos.close();
				}
			} catch (IOException e) {
				logger.error("Data Access Error-IOException");
			}
		}
		
		return isComplete;
	}


	@Override
	public boolean saveSingleFileToDir(MultipartFile mf, String dir){
		// TODO Auto-generated method stub
		//if(dir != null) dir = dir.replaceAll("\\\\", "").replaceAll("&", "");
		boolean isComplete = false;
		InputStream fis = null;
		FileOutputStream fos = null;
		
		try {
		
			File fileDirectory = new File(dir);
			
			if(!fileDirectory.isDirectory()) {
				//file.mkdir();
				logger.info("no dir");;
				//file.getParentFile().mkdirs();
				//FileWriter writer = new FileWriter(file);
				fileDirectory.setExecutable(false); //실행권한
				fileDirectory.setReadable(true);   //읽기권한
				fileDirectory.setWritable(true);   //쓰기권한
				fileDirectory.mkdirs();
			}

			String OS = System.getProperty("os.name").toLowerCase();
			if(OS.indexOf("win") == -1) {	// /mnt/data/DT_DATA/userData/
				Path pathDirectory = Paths.get(dir);
				Set<PosixFilePermission> posixPermissions = PosixFilePermissions.fromString("rwxrwxr-x");
				Files.setPosixFilePermissions(pathDirectory, posixPermissions);
			}
			
			// file.getParentFile().mkdirs();
			
			File f = new File(dir+mf.getOriginalFilename());
			
			if(f.exists()) {
				f.delete();
			}
			
			fis = mf.getInputStream();
			fos = new FileOutputStream(f);
			IOUtils.copy(fis,fos);
			
			if(f.exists()) {
				isComplete = true;
			}
			
			
		} catch (FileNotFoundException e) {
			logger.error("File Error-FileNotFoundException");
		} catch (IOException e) {
			logger.error("Data Access Error-IOException");
		} finally {
			try {
				if(fis!=null) {
					fis.close();
				}
			} catch (IOException e) {
				logger.error("Data Access Error-IOException");
			}
			
			try {
				if(fos!=null) {
					fos.flush();
					fos.close();
				}
			} catch (IOException e) {
				logger.error("Data Access Error-IOException");
			}
		}
		
		return isComplete;
	}

	@Override
	public void saveFilesToUserDir(List<MultipartFile> multipartFiles, String dir,String uploadeFileName){
		String OS = System.getProperty("os.name").toLowerCase();
		if(OS.indexOf("win") < 0) {
			if(dir != null) dir = dir.replaceAll("\\\\", "").replaceAll("&", "");
		}
		//if(dir != null) dir = dir.replaceAll("&", "");
		File file = new File(dir);
		
		if(!file.isDirectory()) {
			logger.info("Directory is Un Exists : "+dir);
			file.setExecutable(false); //실행권한
			file.setReadable(true);   //읽기권한
			file.setWritable(true);   //쓰기권한
			file.mkdirs();
			
		}
		try {
			if(OS.indexOf("win") < 0) {
				// /mnt/data/DT_DATA/userData/
				Path pathDirectory = Paths.get(dir);
				Set<PosixFilePermission> posixPermissions = PosixFilePermissions.fromString("rwxrwxr-x");
				Files.setPosixFilePermissions(pathDirectory, posixPermissions);
	
			}
			
			
			for(MultipartFile multipartFile : multipartFiles) {
					FileOutputStream fos=null;
					InputStream fis=null;
					try {
						String orgFileName = multipartFile.getOriginalFilename();
						if(orgFileName != null) orgFileName = orgFileName.replaceAll("/", "").replaceAll("\\\\", "");
						String fileExtention = FilenameUtils.getExtension(orgFileName);
						
						fis = multipartFile.getInputStream();
						String saveFileName = uploadeFileName+"."+fileExtention;
						String savePathFileName = dir+saveFileName;
						file = new File(dir+saveFileName);
						fos = new FileOutputStream(file); 
						
						IOUtils.copy(fis, fos);
						if(System.getProperty("spring.profiles.active")==null) {
							try {
								throw new NullPointerException();
							} catch (NullPointerException e) {
								logger.error("NullPointerError-NullPointerException");
							}
						}
						if(OS.indexOf("win") == -1) {
							Path pathDirectory = Paths.get(savePathFileName);
							Set<PosixFilePermission> posixPermissions = PosixFilePermissions.fromString("rw-rw-rw-");
							Files.setPosixFilePermissions(pathDirectory, posixPermissions);
						}
						
						
						//file.deleteOnExit();

			        } catch (IOException e) {
			        	logger.error("setModelThumbnail-IOException");
			        } finally {
			        	if(fis != null) fis.close();
			        	if(fos != null) fos.close();
					}
			}
			
		} catch (IOException e) {
			logger.error("Data Access Error-IOException");
		} 
		
	}

	@Override
	public boolean deleteFile(String dir) {
		
		boolean rs = false;
		if(dir != null) dir = dir.replaceAll("\\\\", "").replaceAll("&", "");
		File file = new File(dir);

		
		if(file.exists()) {
			rs = file.delete();
		}
		
		return rs;
		
	}

	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.file.service.MultiFileUploadService#replaceRegularString(java.lang.String)
	 */
	@Override
	public String replaceSpecialCharacter(String str) {
		// TODO Auto-generated method stub
		
		String match = "[^\uAC00-\uD7A3xfe0-9a-zA-Z\\s]";
		
		str = str.replaceAll(match, "").trim();
		
		str = str.replaceAll(" ", "");

		//logger.info("str:"+str);

		return str;
	}

	@Override
	public void copyFile(String dir,String newDir,String fileName) {
		
		File file = new File(dir);
		File newFile = new File(newDir);
		if(!newFile.isDirectory()) {
			logger.info("Directory is Un Exists : "+newDir);
			newFile.setExecutable(false); //실행권한
			newFile.setReadable(true);   //읽기권한
			newFile.setWritable(true);   //쓰기권한
			newFile.mkdirs();
		}

		try {
			String OS = System.getProperty("os.name").toLowerCase();
			if(OS.indexOf("win") == -1) {	// /mnt/data/DT_DATA/userData/
				Path pathDirectory = Paths.get(newDir);
				Set<PosixFilePermission> posixPermissions = PosixFilePermissions.fromString("rwxrwxr-x");
				Files.setPosixFilePermissions(pathDirectory, posixPermissions);
			}
			newFile = new File(newDir+fileName);
			Files.copy(file.toPath(), newFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
		} catch (IOException e) {
			logger.error("copyFile Error-IOException");
		} catch (Exception e) {
			logger.error("copyFile Error");
		}
		
	}
}