package com.vision_x.vision_x.utils;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.charset.Charset;
import java.nio.charset.MalformedInputException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import org.apache.commons.compress.archivers.ArchiveEntry;
import org.apache.commons.compress.archivers.zip.ZipArchiveEntry;
import org.apache.commons.compress.archivers.zip.ZipArchiveInputStream;
import org.apache.commons.io.FilenameUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class ZipFileInfoService {
	protected Logger logger = LoggerFactory.getLogger(this.getClass());
	public HashMap<String, String> get3dsFileInfo(String path, String fileName){
		/*
		 * 3ds일경우 
		 * 1.shp 파일 존재유무(dbf,prj,shx)
		 * 2.prj 존재할 경우 좌표계 -> EPSG 코드로 반환
		 * 3.dbf 존재할 경우 속성 컬럼 리스트 반환
		 * 4.3ds 파일이랑 텍스쳐 jpg 포함 여부
		 * */
		HashMap<String, String> result = new HashMap<>();
		
		InputStream in = null;
		ZipArchiveInputStream zais = null;
		ZipArchiveEntry entry = null;
		
		boolean check3ds = false;
		boolean checkShp = false;
		try {
			//if(path != null) path = path.replaceAll("\\.", "").replaceAll("\\\\", "").replaceAll("&", "");
			//if(fileName != null) fileName = fileName.replaceAll("/", "").replaceAll("\\\\", "");

			File file = new File(path+fileName);
			
			if(file.exists()) {
				in = new FileInputStream(file);
				zais = new ZipArchiveInputStream(in,"EUC-KR");
				
				String shpFileName="";
				String shxFileName="";
				String dbfFileName="";
				String prjFileName="";
				String path3ds = "";
				String dataType="3ds";
				
				while((entry = zais.getNextZipEntry()) != null) {

					String zipFileName = entry.getName().toLowerCase();
					
					if(zipFileName.toLowerCase().contains(".dae")) {
						dataType="dae";
						break;
					}
					
					
					if(!entry.isDirectory() && (zipFileName.contains(".3ds") || zipFileName.contains(".jpg"))) {
						check3ds = true;
						path3ds=zipFileName;
					}else if(zipFileName.contains(".shp")) {
						shpFileName = zipFileName;
					}else if( zipFileName.contains(".shx")) {
						shxFileName = zipFileName;
					}else if(zipFileName.contains(".dbf")) {
						dbfFileName = zipFileName;
					}else if(zipFileName.contains(".prj")) {
						prjFileName = zipFileName;
					}
					
					if(!path3ds.equals("") && !shpFileName.equals("") && !shxFileName.equals("") && !dbfFileName.equals("") && !prjFileName.equals("")) {
						
						break;
					}
					
				}
				
				if((!shpFileName.equals("") && !shxFileName.equals("") && !dbfFileName.equals(""))) {
					checkShp=true;
				}
				
				String pathDir3ds = path3ds.split("\\/")[0];
				
				result.put("SHP",shpFileName.toLowerCase());
				result.put("SHX",shxFileName.toLowerCase());
				result.put("DBF",dbfFileName.toLowerCase());
				result.put("PRJ",prjFileName.toLowerCase());
				result.put("3DS_DIR",pathDir3ds.toLowerCase());
				
				result.put("DATA_TYPE", dataType);
				
				result.put("CHECKSHP",String.valueOf(checkShp));
			
				String check3dsStr="fail";
				
				if(check3ds) {
					check3dsStr="ok";
				}
				
				result.put("STATUS",check3dsStr);
				
			}
			
		} catch (FileNotFoundException e) {
			result.put("STATUS","ERROR");
			logger.error("File Error-FileNotFoundException");
			return result;
		} catch (IOException e) {
			result.put("STATUS","ERROR");
			logger.error("Data Access Error-IOException");
			return result;
		}finally {
			
			try {
				
				if(in != null) {
					in.close();
				}
				
				if(zais != null) {
					zais.close();
				}
				
			} catch (IOException e) {
				logger.error("Data Access Error-IOException");
			}
			
		}
		
		return result;
	}
	
	public boolean unzipFiles(String path, String fileName,  String dataId,String type) {
		//dataId 경로 생성해서 거기에 압축 파일 풀기
		boolean result= false;
	   //if(path != null) path = path.replaceAll("\\\\", "").replaceAll("&", "");
	   if(fileName != null) fileName = fileName.replaceAll("/","").replaceAll("\\\\", "");
	   if(dataId != null) dataId =dataId.replaceAll("\\\\", "").replaceAll("&", "");
	   if(type != null) type =type.replaceAll("\\\\", "").replaceAll("&", "");
	   String unzipPath = "";
		//압축 풀 경로 생성
	   	if(!dataId.equals(null) && dataId.equals("escape")) {
	   		unzipPath = path+type+File.separator;
	   	}else {
	   		unzipPath=path+dataId+File.separator+type+File.separator;	
	   	}
		File dirFile = new File(unzipPath);
		
		if(!dirFile.exists()) {
			dirFile.setExecutable(false); //실행권한
			dirFile.setReadable(true);   //읽기권한
			dirFile.setWritable(true);   //쓰기권한
			dirFile.mkdirs();
		}
		
		byte[] data = new byte[2048];
        ArchiveEntry entry;
        ZipArchiveInputStream zipstream = null;
        FileOutputStream out = null;
        File parentsFile = null;
        FileInputStream zipFis= null;
        
		try {
			zipFis= new FileInputStream(new File(path+fileName));
			zipstream =new ZipArchiveInputStream(zipFis,"EUC-KR");
			
			while ((entry = zipstream.getNextEntry()) != null) {

				int read = 0;
				File entryFile;
				
				String filter_entry = (entry.getName().toLowerCase()).replaceAll("\\\\", "").replaceAll("&", "");
				
				// 디렉토리의 경우 폴더를 생성한다.
				if (entry.isDirectory()) {
					
					File folder = new File(unzipPath + filter_entry);
			
					if (!folder.exists()) {
						folder.setExecutable(false); //실행권한
						folder.setReadable(true);   //읽기권한
						folder.setWritable(true);   //쓰기권한
						folder.mkdirs();
					}
					
				} else {
					
					String fileNametest = entry.getName();
					byte[] checkString = fileNametest.getBytes();
					
					entryFile = new File(unzipPath + filter_entry);
					
					if (!entryFile.exists()) {
						
						String parentsDir = "";
						if(entryFile != null && entryFile.getParent() != null) parentsDir = (entryFile.getParent()).replaceAll("\\\\", "").replaceAll("&", "");
						parentsFile = new File(parentsDir);
						
						if(!parentsFile.exists()) {
							parentsFile.setExecutable(false); //실행권한
							parentsFile.setReadable(true);   //읽기권한
							parentsFile.setWritable(true);   //쓰기권한
							parentsFile.mkdirs();
						}
						
						boolean isFileMake = entryFile.createNewFile();
					}

					out = new FileOutputStream(entryFile);
					while ((read = zipstream.read(data, 0, 2048)) != -1)
						out.write(data, 0, read);

				}
			}
	 
			result = true;
			
		} catch (FileNotFoundException e) {
			logger.error("File Error-FileNotFoundException");
			return false;
		} catch (IOException e) {
			logger.error("Data Access Error-IOException");
			return false;
		}finally {
			
			if (out != null) {
				try {
					out.close();
				} catch (IOException e) {
					logger.error("Data Access Error-IOException");
				}
			}

			if (zipstream != null) {
				try {
					zipstream.close();
				} catch (IOException e) {
					logger.error("Data Access Error-IOException");
				}
			}
			
			if (zipFis != null) {
				try {
					zipFis.close();
				} catch (IOException e) {
					logger.error("Data Access Error-IOException");
				}
			}
			
			
			
		}
		
		
		return result;
	}
	
	public boolean unzipLodTreeFiles(String path, String fileName,  String dataId,String type) {
		//dataId 경로 생성해서 거기에 압축 파일 풀기
		boolean result= false;
		if(path != null) path = path.replaceAll("\\\\", "").replaceAll("&", "");
		if(fileName != null) fileName = fileName.replaceAll("/", "").replaceAll("\\\\", "");
		if(dataId != null) dataId = dataId.replaceAll("\\\\", "").replaceAll("&", "").replaceAll("/", "").replaceAll("\\.", "");
		if(type != null) type = type.replaceAll("\\\\", "").replaceAll("&", "");
		//압축 풀 경로 생성
		String unzipPath=path+dataId+File.separator+type+File.separator;
		
		File dirFile = new File(unzipPath);
		
		if(!dirFile.exists()) {
			dirFile.setExecutable(false); //실행권한
			dirFile.setReadable(true);   //읽기권한
			dirFile.setWritable(true);   //쓰기권한
			dirFile.mkdirs();
		}
		
		byte[] data = new byte[2048];
		ArchiveEntry entry;
	    ZipArchiveInputStream zipstream = null;
	    FileOutputStream out = null;
	    //추가된 fis객체
        FileInputStream zipFis = null;
		try {
			zipFis = new FileInputStream(new File(path+fileName));
			zipstream = new ZipArchiveInputStream(zipFis,"EUC-KR");
			
			while ((entry = zipstream.getNextEntry()) != null) {

				int read = 0;
				File entryFile;

				String entryFileName = entry.getName();
				
				if (entry.isDirectory()) {
					File folder = new File(unzipPath + entryFileName);
					
					if (!folder.exists()) {
						folder.setExecutable(false); //실행권한
						folder.setReadable(true);   //읽기권한
						folder.setWritable(true);   //쓰기권한
						folder.mkdirs();
					}
					
				}
				
				if(entryFileName.toLowerCase().contains("lodtreeexport")) {
					
					entryFile = new File(unzipPath + entryFileName);

					if (!entryFile.exists()) {
						boolean isFileMake = entryFile.createNewFile();
					}

					out = new FileOutputStream(entryFile);
			
					while ((read = zipstream.read(data, 0, 2048)) != -1) {
						out.write(data, 0, read);
					}
					
					break;
					
				}else {
					
					continue;
					
				}
				
			}
	 
			result = true;
			
		} catch (FileNotFoundException e) {
			logger.error("File Error-FileNotFoundException");
			return false;
		} catch (IOException e) {
			logger.error("Data Access Error-IOException");
			return false;
		}finally {
			
			if (out != null) {
				try {
					out.close();
				} catch (IOException e) {
					logger.error("Data Access Error-IOException");
				}
			}

			if (zipstream != null) {
				try {
					zipstream.close();
				} catch (IOException e) {
					logger.error("Data Access Error-IOException");
				}
			}
			
			if(zipFis != null) {
				try {
					zipFis.close();
				} catch (IOException e) {
					logger.error("Data Access Error-IOException");
				}
			}
			
		}
		
		
		return result;
	}
	
	public HashMap<String, String> getDaeTypeInfo(String path){
		if(path != null) path = path.replaceAll("\\\\", "").replaceAll("&", "");		
		HashMap<String, String> result = new HashMap<>();
		InputStream in = null;
		ZipArchiveInputStream zais = null;
		ZipArchiveEntry entry = null;
		
		String daeFileName="";
		String daeDirName="";
		String xmlFileName="";
		String dataType="dae";
		
		try {
			File file = new File(path);
			
			if(file.exists()) {
				
				in = new FileInputStream(file);
				zais = new ZipArchiveInputStream(in,"EUC-KR");
				
				while((entry = zais.getNextZipEntry()) != null) {
					
					String zipFileName = entry.getName();
					
					if(zipFileName.toLowerCase().contains(".shp") || zipFileName.toLowerCase().contains(".3ds") || zipFileName.toLowerCase().contains(".shx")) {
						dataType="3ds";
						break;
					}
					
					if(zipFileName.toLowerCase().contains(".dae")) {
						daeFileName = zipFileName;
					}
					
					if(zipFileName.toLowerCase().contains("lodtreeexport")) {
						xmlFileName = zipFileName;
					}
					
					if(!daeFileName.equals("") && !xmlFileName.equals("")) {
						break;
					}
					
				}
				
				String pathDir = daeDirName.split("\\/")[0];
				result.put("DATA_TYPE", dataType);
				result.put("DAE_DIR", pathDir);
				result.put("XML_NAME", xmlFileName);
				result.put("STATUS", "ok");
				
			}
			
		} catch (FileNotFoundException e) {
			logger.error("File Error-FileNotFoundException");	
			result.put("STATUS","ERROR");			
			return result;
		} catch (IOException e) {
			logger.error("Data Access Error-IOException");			
			result.put("STATUS","ERROR");	
			return result;
		}finally {
			
			try {
				
				if(in != null) {
					in.close();
				}
				
				if(zais != null) {
					zais.close();
				}
				
			} catch (IOException e) {
				// TODO Auto-generated catch block
				logger.error("Close Error-IOException");
			}
			
		}
		
		return result;
		
 	}
	
	public String getShpFileNameFromZip(String path, String fileName) {
		//dataId 경로 생성해서 거기에 압축 파일 풀기
	
	   List<String> orginnamesList = new ArrayList<String>();
	   boolean shpFileValidatorFlag = false;
	   
	   
	   if(fileName != null) fileName = fileName.replaceAll("/","").replaceAll("\\\\", "");
	   FileInputStream fin = null;
	   ZipInputStream zis = null;
	   ZipEntry zet = null;
	   try {
			fin = new FileInputStream(path+fileName);
			
			zis = new ZipInputStream(fin,Charset.forName("UTF8"));
			
			
			while((zet = zis.getNextEntry()) != null) {
				orginnamesList.add(FilenameUtils.getBaseName(zet.getName()));// 파일명은 전부 같아서 한번만 반복
				zis.closeEntry();
			}
			shpFileValidatorFlag = orginnamesList.isEmpty() || orginnamesList.stream().allMatch(orginnamesList.get(0)::equals);//내부의 shp,shx,prj,dbf등의 이름이 같은지 체크
			
			if(!shpFileValidatorFlag) {
				throw new Exception("zipFileInfoService:Each name of unzipped shp,shx,prj,dbf files not matched with each other.");
				
			}
		} catch (MalformedInputException e) {
			logger.error("zipFileInfoService:zipFile charset Error");
		} catch(Exception e) {
			logger.error("zipFileInfoService:unzip Error");
		} finally {
			try {
				if(fin!=null) fin.close();
				if(zis!=null) {
					zis.close();
					if(zet!=null) {
						zis.closeEntry();
					}
				}
			} catch (IOException e) {
				logger.error("zipFileInfoService:IOException");
			}
		}
		
		
		return orginnamesList.get(0);
	}
}