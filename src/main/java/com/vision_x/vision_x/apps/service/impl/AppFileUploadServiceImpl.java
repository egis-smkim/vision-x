package com.vision_x.vision_x.apps.service.impl;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.PosixFilePermission;
import java.nio.file.attribute.PosixFilePermissions;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Set;

import javax.annotation.Resource;

import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.NullArgumentException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.vision_x.vision_x.apps.service.AppFileUploadService;
import com.vision_x.vision_x.apps.service.CsvVO;
import com.vision_x.vision_x.apps.service.ShpModelLayerVO;
import com.vision_x.vision_x.apps.service.ShpModelVO;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("appFileUploadService")
public class AppFileUploadServiceImpl extends EgovAbstractServiceImpl implements AppFileUploadService {

	@Value("#{globalInfo['Globals.postgresql.url']}")
	private String GEO_DB_URL;
	
	@Value("#{globalInfo['Globals.postgresql.Globals.postgresql.dbname']}")
	private String GEO_DB_NAME;
	
	@Value("#{globalInfo['Globals.geoserver.db.user']}")
	private String GEO_DB_USER;
	
	private String GEO_DB_PASSWORD = System.getProperty("postgis.db.password");
	
	@Value("#{globalInfo['Globals.geoserver.db.port']}")
	private String GEO_DB_PORT;
	
	protected Logger logger = LoggerFactory.getLogger(this.getClass());
	@Resource(name="appsDAO")
	private AppsDAO appsDAO;
	
	@Override
	public boolean singleUploadFile(MultipartFile file, String path, String fileName) {

		boolean isComplete = false;

		InputStream fis = null; 
		FileOutputStream fos = null;
		try {
			if(path != null) path = path.replaceAll("\\.", "").replaceAll("\\\\", "").replaceAll("&", "");
			File fileDirectory = new File(path);
			if(!fileDirectory.isDirectory()) {
				fileDirectory.setExecutable(false); //실행권한
				fileDirectory.setReadable(true);   //읽기권한
				fileDirectory.setWritable(true);   //쓰기권한
				fileDirectory.mkdirs();
			}

			String OS = System.getProperty("os.name").toLowerCase();
			if(OS.indexOf("win") == -1) {
				// /mnt/data/DT_DATA/userData/
				Path pathDirectory = Paths.get(path);
				Set<PosixFilePermission> posixPermissions = PosixFilePermissions.fromString("rwxrwxr-x");
				Files.setPosixFilePermissions(pathDirectory, posixPermissions);
	
			}
			File f = new File(path+fileName);
			
			if(f.exists()) {
				if(f.delete()) {
					
				} else {
					
				}
			}
			
			fis=file.getInputStream();
			fos=new FileOutputStream(f);

			IOUtils.copy(fis, fos);
			
			if(f.exists()) {
				isComplete = true;
			}	
			
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
	public boolean csvToPostgresqlTbl(HashMap<String, String> param) {
		
		boolean check = false;
		
		String path = param.get("path");
		String fileName = param.get("fileName");
		String lonIndx = param.get("lonIndx");
		String latIndx = param.get("latIndx");
		String dbname = param.get("schema");
		String table = param.get("table");
		String labelIndx = param.get("labelIndx");
		String encoding = param.get("encoding");
		
		String jsonParma ="{\"input\":\""+path+fileName+"\","
				+ "			   \"output\":\""+path+"\","
				+ "			   \"geotype\":\"0\","
				+ "			   \"geocoding\":\"2\","
				+ "			   \"collon\":\""+lonIndx+"\","
				+ "			   \"collat\":\""+latIndx+"\","
				+ "			   \"coltitle\":\""+labelIndx+"\","
				+ "			   \"dbname\":\""+dbname+"\","
				+ "			   \"dbtable\":\""+table+"\","
				+ "			   \"progress\":\"-1\","
				+ "			   \"areatype\":\"0\","
				+ "			   \"saveType\":\"db\","
				+ "			   \"epsg\":\"epsg:4326\","
				+ "			   \"encode\":\""+encoding+"\","
				+ "			   \"insertdb\":\"postgres\","
				+ "			   \"dbid\":\""+GEO_DB_USER+"\","
				+ "			   \"dbpass\":\""+GEO_DB_PASSWORD+"\","
				+ "			   \"dburl\":\""+GEO_DB_URL+"\","
				+ "}";
		String convertCommand[]=new String[] {"/hadoop/bin/hadoop", "jar" ,"/hadoop/lib/XDBuilderMR_dt.jar", "com.egiskorea.XDBuilder", "csv", jsonParma};
		
		ProcessBuilder processBuilder = null;
		
		InputStream stderr= null;
		InputStreamReader isr = null;
		BufferedReader br = null;

		if((convertCommand[0].indexOf("/hadoop/bin/hadoop") == -1) && (convertCommand[2].indexOf("/hadoop/lib/XDBuilderMR_dt.jar") == -1) && (convertCommand[2].indexOf("com.egiskorea.XDBuilder") == -1)) {
			logger.error("사용할 수 없는 명령어입니다.");
			return false;
		}
		
		try {
			
			processBuilder = new ProcessBuilder(convertCommand);
			processBuilder.redirectErrorStream(true);
			Process process = processBuilder.start();
			
			stderr = process.getInputStream();
			isr = new InputStreamReader(stderr);
			br = new BufferedReader(isr);
			
			String outLine = null;
			
			while((outLine = br.readLine()) != null) {
				logger.info("CONVERT COMMAND LINE::::"+outLine);
			}
			
			process.waitFor();
			
			if(process.exitValue() == 0) {
				logger.info("processing convert is done");
				check=true;
			}
			
		} catch (IOException e) {
			logger.error("Data Access Error-IOException");
		} catch (InterruptedException e) {
			logger.error("Thread Error-InterruptedException");
		}finally {
			
			try {
				if(stderr != null ) {
					stderr.close();
				}
				
				if(isr != null ) {
					isr.close();
				}
				
				if(br != null ) {
					br.close();
				}
				
			} catch (IOException e) {
				logger.error("Data Access Error-IOException");
			}
			
		}
		
		
		return check;
		
	}



	@Override
	public int insertCsvUploadInfo(CsvVO vo) {
		// TODO Auto-generated method stub
		return appsDAO.insertCsvUploadInfo(vo);
	}

	@Override
	public CsvVO getCsvFileInfo(int acid) {
		// TODO Auto-generated method stub
		return appsDAO.getCsvFileInfo(acid);
	}

	@Override
	public int updateCsvInfo(CsvVO vo) {
		// TODO Auto-generated method stub
		return appsDAO.updateCsvInfo(vo);
	}

	@Override	
	public int updateCsvItemInfo(HashMap<String, Object> param) {	
		// TODO Auto-generated method stub	
		return appsDAO.updateCsvItemInfo(param);	
	}

	@Override
	public boolean multipleFileUpload(List<MultipartFile> files, String path, String fileName) {
		
		boolean result = false;
		if(path != null) path = path.replaceAll("\\\\", "").replaceAll("&", "");
		File file = new File(path);
		file.setExecutable(false); //실행권한
		file.setReadable(true);   //읽기권한
		file.setWritable(true);   //쓰기권한
		
		if(!file.isDirectory()) {
			file.mkdirs();
		}
		InputStream fis=null;
		FileOutputStream fos=null;
		
		try {
			if(System.getProperty("spring.profiles.active")==null) {
				throw new NullPointerException("NullPointerError-NullPointerException");
			}
			String OS = System.getProperty("os.name").toLowerCase();
			if(OS.indexOf("win") == -1) {
				// /mnt/data/DT_DATA/userData/
				Path pathDirectory = Paths.get(path);
				Set<PosixFilePermission> posixPermissions = PosixFilePermissions.fromString("rwxrwxr-x");
				Files.setPosixFilePermissions(pathDirectory, posixPermissions);
	
			}
			
			for(MultipartFile multipartFile : files) {
				
					String orgFileName = multipartFile.getOriginalFilename();
					String fileExtention = FilenameUtils.getExtension(orgFileName);
					fis = multipartFile.getInputStream();
					
					String saveFileName="";
					
					if(fileName.equals("")) {
						saveFileName=orgFileName;
					}else {
						saveFileName = fileName+"."+fileExtention;
					}
					

					file = new File(path+saveFileName);
					fos = new FileOutputStream(file); 
					
					IOUtils.copy(fis, fos);

					String savePathFileName = path+saveFileName;
					if(OS.indexOf("win") == -1) {
						Path pathDirectory = Paths.get(savePathFileName);
						Set<PosixFilePermission> posixPermissions = PosixFilePermissions.fromString("rw-rw-rw-");
						Files.setPosixFilePermissions(pathDirectory, posixPermissions);
					}
					
					//file.deleteOnExit();
			}
			
			
			
		} catch (IOException e) {
			logger.error("Data Access Error-IOException");
		} finally {
			
			try {
				if(fis != null) {
					fis.close();
					fis = null;
				}
				
				if(fos != null) {
					fos.flush();
					fos.close();
					
					fos =null;
				}
			} catch (IOException e) {
				logger.error("Data Access Error-IOException");
			}
			
		}
		
		result=true;
		
		return result;
	}



	@Override
	public int insertShpModelInfo(ShpModelVO vo) {
		return appsDAO.insertShpModelInfo(vo);
	}

	@Override
	public ShpModelVO getShpModelInfo(int asid) {
		return appsDAO.getShpModelInfo(asid);
	}


	@Override
	public int updateShp2Modelinfo(ShpModelVO vo) {
		return appsDAO.updateShp2Modelinfo(vo);
	}

	@Override
	public List<HashMap<String, Object>> getAppShpPrjctInfo(int mid) {
		return appsDAO.getAppShpPrjctInfo(mid);
	}
	
	
	
	@Override
	public HashMap<String, Object> getShpModelLayerInfo(int asid) {
		return appsDAO.getShpModelLayerInfo(asid);
	}

	@Override
	public int deleteShp3dModel(int asid) {
		return appsDAO.deleteShp3dModel(asid);
	}

	
	@Override
	public int dropShpTable(String tableInfo) {
		return appsDAO.dropShpTable(tableInfo);
	}

	@Override
	public int updateProcessShp(ShpModelVO vo) {
		// TODO Auto-generated method stub
		return appsDAO.updateProcessShp(vo);
	}
	
	
	@Override
	public int insertShpLayerInfo(ShpModelLayerVO vo) {
		// TODO Auto-generated method stub
		return appsDAO.insertShpLayerInfo(vo);
	}

	@Override
	public int updateAppShpBoundary(ShpModelVO vo) {
		// TODO Auto-generated method stub
		return appsDAO.updateAppShpBoundary(vo);
	}

	@Override
	public ShpModelLayerVO getShpLayerInfo(int afid) {
		// TODO Auto-generated method stub
		return appsDAO.getShpLayerInfo(afid);
	}


	@Override
	public List<ShpModelLayerVO> getShpLayerList(int asid) {
		// TODO Auto-generated method stub
		return appsDAO.getShpLayerList(asid);
	}


	@Override
	public int updateShpConvexHull(ShpModelLayerVO vo) {
		// TODO Auto-generated method stub
		return appsDAO.updateShpConvexHull(vo);
	}


	@Override
	public ShpModelLayerVO getShpLayerBoundary(int afid) {
		return appsDAO.getShpLayerBoundary(afid);
	}

	@Override
	public int updateProjectName(ShpModelVO vo) {
		// TODO Auto-generated method stub
		return appsDAO.updateProjectName(vo);
	}

	@Override
	public int updateShpLayerStatus(ShpModelLayerVO vo) {
		// TODO Auto-generated method stub
		return appsDAO.updateShpLayerStatus(vo);
	}

	@Override
	public boolean convertShp2Model(String param,String path,String fileName) {
		boolean result = false;
		
		String convertCommand[]=new String[] {"/hadoop/bin/hadoop", "jar" ,"/hadoop/lib/XDBuilderMR_dt.jar", "com.egiskorea.XDBuilder", "dt_shptofacility", param,";","rm","-rf",path+fileName+".*"};
		
		ProcessBuilder processBuilder = null;
		
		InputStream stderr= null;
		InputStreamReader isr = null;
		BufferedReader br = null;
		
		logger.info(Arrays.toString(convertCommand));
		
		try {
			processBuilder = new ProcessBuilder(convertCommand);
			processBuilder.redirectErrorStream(true);
			Process process = processBuilder.start();
			
			stderr = process.getInputStream();
			isr = new InputStreamReader(stderr);
			br = new BufferedReader(isr);
			
			String outLine = null;
			
			while((outLine = br.readLine()) != null) {
				logger.info("CONVERT COMMAND LINE::::"+outLine);
			}
			
			long pid = process.pid();
			process.waitFor();
			
			if(process.exitValue() == 0) {
				logger.info("processing convert is done");
				result=true;
				
			}
			
		} catch (InterruptedException e) {
			logger.error("Thread Error-InterruptedException");
		} catch (IOException e) {
			logger.error("Data Access Error-IOException");
		}finally {
			
			try {
				if(stderr != null ) {
					stderr.close();
				}
				
				if(isr != null ) {
					isr.close();
				}
				
				if(br != null ) {
					br.close();
				}
				
			} catch (IOException e) {
				logger.error("Data Access Error-IOException");
			}
			
		}
		
		return result;
	}
	@Override
	public int changeMemberState(int mid) {
		// TODO Auto-generated method stub
		return appsDAO.changeMemberState(mid);
	}
}
