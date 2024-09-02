package com.vision_x.vision_x.utils;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.lang.ProcessBuilder.Redirect;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.PosixFilePermission;
import java.nio.file.attribute.PosixFilePermissions;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Scanner;
import java.util.Set;
import java.util.concurrent.Executors;
import org.apache.commons.compress.archivers.zip.ZipArchiveEntry;
import org.apache.commons.compress.archivers.zip.ZipArchiveOutputStream;
import org.apache.commons.lang.NullArgumentException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class PostGisCmdService {
	protected Logger logger = LoggerFactory.getLogger(this.getClass());

	private static String OS = System.getProperty("os.name").toLowerCase();
	
	@Value("#{globalInfo['Globals.postgresql.host']}")
	private String GEO_DB_HOST;
	
	@Value("#{globalInfo['Globals.postgresql.port']}")
	private String GEO_DB_PORT;
	
	@Value("#{globalInfo['Globals.postgresql.password']}")
	private String GEO_DB_PASS;
	
	@Value("#{globalInfo['Globals.postgresql.username']}")
	private String GEO_USER;
	
	@Value("#{globalInfo['Globals.geoserver.db.name']}")
	private String GEO_NAME;
	
	@SuppressWarnings("unused")
	public HashMap<String, String> shpToPostgresql(String fileName, String dir, String proj, String schema,String encode) {
		
		String envProfile = System.getProperty("spring.profiles.active");
		
		HashMap<String, String> result=new HashMap<>();
		String table = "";
		if(fileName != null) table = fileName.split("\\.")[0];
		String srs = "";
		if(proj != null) srs = proj.split(":")[1];
		
		if(envProfile==null) {
			try {
				throw new NullPointerException();
			} catch (NullPointerException e) {
				logger.error("NullPointerError-NullPointerException");
			}
			
		}
		
		String excuteCmd = "shp2pgsql -t 2D -i -D -s "+srs+" -W "+encode+" "+dir+fileName+" "+schema+"."+table+" | PGPASSWORD="+GEO_DB_PASS+" psql -h "+GEO_DB_HOST+" -U "+GEO_USER+" -d "+GEO_NAME+" -p "+GEO_DB_PORT+"";
		excuteCmd= excuteCmd.replace("\0", "");//null 문자 제거
		System.out.println(excuteCmd);
		if(excuteCmd.indexOf("shp2pgsql")==-1) {
			logger.error("사용할 수 없는 명령어입니다.");
			return null;
		}
		//리눅스
		String[] excuteCmdArr = new String[] {"/bin/sh","-c",excuteCmd};
		//String[] excuteCmdArr = new String[] {excuteCmd};
		if(OS.indexOf("win") >= 0) {//윈도우-로컬 개발
			excuteCmdArr = new String[] {"cmd.exe","/C",excuteCmd};
		}
		
		ProcessBuilder processbuilder = new ProcessBuilder(excuteCmdArr);
		processbuilder.redirectError(Redirect.PIPE);
		processbuilder.redirectErrorStream(true);
		
		result.put("ERROR", "0");
		
		Process process=null;
		BufferedReader reader = null;
		BufferedReader readerOut = null;
		InputStreamReader preStdout = null;
		InputStreamReader preStderr = null;
		InputStream stdout = null;
		InputStream stderr = null;
		try {
			
			process = processbuilder.start();
			
			stdout = process.getInputStream();
			stderr = process.getErrorStream();
			preStdout = new InputStreamReader(stdout);
			preStderr = new InputStreamReader(stderr);
			reader = new BufferedReader(preStderr);
			readerOut = new BufferedReader(preStdout);
					
			String line=null;
			
			while ((line = reader.readLine()) != null) {

				
				if(line.equals("")) {
					result.put("ERROR","0");
				}else {
					result.put("ERROR","1");
				}
				
			}
			
			while ((line = readerOut.readLine()) != null) {
				
				if(!line.equals("") && line.indexOf("Unable to convert field name to UTF-8") > -1) {
					result.put("ERROR","1");
				}else {
					result.put("ERROR","0");
				}
				
			}
			
			process.waitFor();
			
			result.put("SHP_DATA_STORE_NAME", schema);
			result.put("SHP_TABLE_NAME", table.toLowerCase());
			
			
			
		} catch (IOException e) {
			result.put("ERROR", "1");
			logger.error("Data Access Error-IOException");
			return result;
		} catch (InterruptedException e) {
			result.put("ERROR", "1");
			logger.error("Thread Error-InterruptedException");
			return result;
		}finally {
			try {
				if(reader!=null)reader.close();
			} catch (IOException e) {
				logger.error("Data Access Error-IOException");
			}
			try {
				if(readerOut!=null)readerOut.close();
			} catch (IOException e) {
				logger.error("Data Access Error-IOException");
			}
			try {
				if(stdout!=null)stdout.close();
			} catch (IOException e) {
				logger.error("Data Access Error-IOException");
			}
			try {
				if(stderr!=null)stderr.close();
			} catch (IOException e) {
				logger.error("Data Access Error-IOException");
			}
			
			try {
				if(preStderr!=null)preStderr.close();
			} catch (IOException e) {
				logger.error("Data Access Error-IOException");
			}
			try {
				if(preStdout!=null)preStdout.close();
			} catch (IOException e) {
				logger.error("Data Access Error-IOException");
			}

		}
		
		return result;
	}
	
	@SuppressWarnings("unused")
	public boolean shp3dsToPostgresql(String fileName, String dir, String proj, String schema,String encode) {
		
		String envProfile = System.getProperty("spring.profiles.active");
		
		boolean result = false;
		
		String table = fileName;
		String srs = proj.split(":")[1];
	
		String excuteCmd = "shp2pgsql -t 2D -i -D -s "+srs+" -W "+encode+" "+dir+fileName+" "+schema+"."+table+" | PGPASSWORD="+GEO_DB_PASS+" psql -h "+GEO_DB_HOST+" -U digitaltwin -p "+GEO_DB_PORT+"";
		
		if(excuteCmd.indexOf("shp2pgsql")==-1) {
			logger.error("사용할 수 없는 명령어입니다.");
			return false;
		}
		
		//리눅스
		String[] excuteCmdArr = new String[] {"/bin/sh","-c",excuteCmd};
		//String[] excuteCmdArr = new String[] {excuteCmd};
		if(OS.indexOf("win") >= 0) {//윈도우-로컬 개발
			excuteCmdArr = new String[] {"cmd.exe","/C",excuteCmd};
		}

		ProcessBuilder processbuilder = new ProcessBuilder(excuteCmdArr);
		processbuilder.redirectError(Redirect.PIPE);
		processbuilder.redirectErrorStream(true);
		
		Process process=null;
		
		BufferedReader reader = null;
		BufferedReader readerOut = null;
		InputStreamReader preStdout = null;
		InputStreamReader preStderr = null;
		InputStream stdout = null;
		InputStream stderr = null;
		try {
			
			process = processbuilder.start();
			
			stdout = process.getInputStream();
			stderr = process.getErrorStream();
			preStdout = new InputStreamReader(stdout);
			preStderr = new InputStreamReader(stderr);
			reader = new BufferedReader(preStderr);
			readerOut = new BufferedReader(preStdout);
					
			String line=null;
			
			process.waitFor();
			
			result = true;

		} catch (IOException e) {
			logger.error("Data Access Error-IOException");
			result = false;
			return result;
		} catch (InterruptedException e) {
			logger.error("Thread Error-InterruptedException");
			result = false;
			return result;
		} finally {
			try {
				if(reader!=null)reader.close();
			} catch (IOException e) {
				logger.error("Data Access Error-IOException");
			}
			try {
				if(readerOut!=null)readerOut.close();
			} catch (IOException e) {
				logger.error("Data Access Error-IOException");
			}
			try {
				if(stdout!=null)stdout.close();
			} catch (IOException e) {
				logger.error("Data Access Error-IOException");
			}
			try {
				if(stderr!=null)stderr.close();
			} catch (IOException e) {
				logger.error("Data Access Error-IOException");
			}
			try {
				if(preStderr!=null)preStderr.close();
			} catch (IOException e) {
				logger.error("Data Access Error-IOException");
			}
			try {
				if(preStdout!=null)preStdout.close();
			} catch (IOException e) {
				logger.error("Data Access Error-IOException");
			}
		}
		
		return result;
	}
	
	public String exportShpFiles(HashMap<String, String> param){
		
		String result="";
		
		String fileName = param.get("download_file");
		String dir = param.get("t_fileDir");
		String columns = param.get("columns");
		String schema = param.get("schema");
		String table =param.get("table");
		String encoding ="UTF8";
		//디렉토리가 없을 경우 생성해야 shp export 가능
		if(dir != null) dir = dir.replaceAll("\\\\", "").replaceAll("&", "");
		File file = new File(dir);
		
		if(!file.exists()) {
			file.setExecutable(false);
			file.setReadable(true);
			file.setWritable(true);
			file.mkdir();
			
			Path path = Paths.get(dir);
	        Set<PosixFilePermission> posixPermissions = PosixFilePermissions.fromString("rwxrwxr-x");
	       
	        try {
				
	        	Files.setPosixFilePermissions(path, posixPermissions);
				
			} catch (IOException e) {
				// TODO Auto-generated catch block
				logger.error("Data Access Error-IOException");
			}
		}
		
		
		
		String postgisHost = "10.0.10.136";
		String postgisPort = "5432";
		String remoteCommandAppend = "";
		
		//String excuteCmd = "cmd.exe /C set PGCLIENTENCODING="+encoding+" & pgsql2shp -f \""+dir+fileName+"\" -g geom -h 61.254.11.250 -u digitaltwin -p 35432 -P digitaltwin digitaltwin \"SELECT geom,"+columns+" FROM "+schema+"."+table+"\"";
		
		String excuteCmd = "PGCLIENTENCODING="+encoding+" & pgsql2shp -f \""+dir+fileName+"\" -g geom -h "+postgisHost+" -u digitaltwin -p "+postgisPort+" -P !@Egis2024!@ digitaltwin \"SELECT geom,"+columns+" FROM "+schema+"."+table+"\"";
		
		if(excuteCmd.indexOf("pgsql2shp")==-1) {
			logger.error("사용할 수 없는 명령어입니다.");
			return null;
		}
		//윈도우
		//String[] excuteCmdArr = new String[] {"cmd.exe","/C",excuteCmd};
		//리눅스
		String[] excuteCmdArr = new String[] {"/bin/sh","-c",excuteCmd};
		
		if(OS.indexOf("win") >= 0) {//윈도우-추후 삭제
			excuteCmdArr = new String[] {"cmd.exe","/C",excuteCmd};
		}
		
		
		
		ProcessBuilder processbuilder = new ProcessBuilder(excuteCmdArr);
		processbuilder.redirectErrorStream(true);
		
		Process process;
		
		try {
			String dir2 = dir;
			process = processbuilder.start();
			InputStream stdout = process.getInputStream();
			String progressFileName = fileName.split("\\.")[0];
			String progressFile = progressFileName+"_progress.txt";
			
			result=progressFile;
			
			Executors.newCachedThreadPool().execute(()->{
				try(BufferedReader reader = new BufferedReader(new InputStreamReader(stdout))){
					
					String line;
					Scanner scanner = new Scanner(reader).useDelimiter("");
					int count =0;
					
					while(scanner.hasNext()) {
						
						line = scanner.next();
						if(line.trim().toLowerCase().equals("x")) {
						
							File progTxt = new File(dir2+progressFile);
							BufferedWriter writer = new BufferedWriter(new FileWriter(progTxt));
							
							String countStr = Integer.toString(count);
							writer.write(countStr);
							writer.close();
							
							if(count == 0) {
								Path path = Paths.get(dir2+progressFile);
						        Set<PosixFilePermission> posixPermissions = PosixFilePermissions.fromString("rw-rw-rw-");
						        Files.setPosixFilePermissions(path, posixPermissions);
							}
							
							count++;
							
						}
					}
					
					String shpFileName = progressFileName+".shp";
					String shxFileName = progressFileName+".shx";
					String dbfFileName = progressFileName+".dbf";
					String prjFileName = progressFileName+".prj";
					String cpgFileName = progressFileName+".cpg";
					
					File shpFile = new File(dir2+shpFileName);
					File shxFile = new File(dir2+shxFileName);
					File dbfFile = new File(dir2+dbfFileName);
					File prjFile = new File(dir2+prjFileName);
					File cpgFile = new File(dir2+cpgFileName);
					
					ZipArchiveOutputStream zos = new ZipArchiveOutputStream(new BufferedOutputStream(new FileOutputStream(dir2+progressFileName+".zip")));
					//zos.setEncoding("UTF-8");
					
					int size = 1024;
				    byte[] buf = new byte[size];
					
					if(shpFile.exists()) {

						ZipArchiveEntry shpEntry = new ZipArchiveEntry(shpFileName);
						zos.putArchiveEntry(shpEntry);
						
						FileInputStream shpIn = new FileInputStream(shpFile);
						BufferedInputStream bis = new BufferedInputStream(shpIn, 1024);
						
						int len;
		                while((len = bis.read(buf,0,size)) != -1){
		                    zos.write(buf,0,len);
		                }

						shpIn.close();
						bis.close();
						zos.closeArchiveEntry();

					}
					
					if(shxFile.exists()) {
						
						ZipArchiveEntry shpEntry = new ZipArchiveEntry(shxFileName);
						zos.putArchiveEntry(shpEntry);
						
						FileInputStream shxIn = new FileInputStream(shxFile);
						BufferedInputStream bis = new BufferedInputStream(shxIn, 1024);
						
						int len;
		                while((len = bis.read(buf,0,size)) != -1){
		                    zos.write(buf,0,len);
		                }

		                shxIn.close();
						bis.close();
						zos.closeArchiveEntry();
					}
					

					if(dbfFile.exists()) {
						
						ZipArchiveEntry dbfEntry = new ZipArchiveEntry(dbfFileName);
						zos.putArchiveEntry(dbfEntry);
						
						FileInputStream dbfIn = new FileInputStream(dbfFile);
						BufferedInputStream bis = new BufferedInputStream(dbfIn, 1024);
						
						int len;
		                while((len = bis.read(buf,0,size)) != -1){
		                    zos.write(buf,0,len);
		                }

		                dbfIn.close();
						bis.close();
						zos.closeArchiveEntry();
					}
					
					if(prjFile.exists()) {
						
						ZipArchiveEntry prjEntry = new ZipArchiveEntry(prjFileName);
						zos.putArchiveEntry(prjEntry);
						
						FileInputStream prjIn = new FileInputStream(prjFile);
						BufferedInputStream bis = new BufferedInputStream(prjIn, 1024);
						
						int len;
		                while((len = bis.read(buf,0,size)) != -1){
		                    zos.write(buf,0,len);
		                }

		                prjIn.close();
						bis.close();
						zos.closeArchiveEntry();
						
					}else {
						
						File prj4326File = new File(prjFileName);
						BufferedWriter writer = new BufferedWriter(new FileWriter(prj4326File));
						
						String wgs84 = "GEOGCS[\"WGS 84\",DATUM[\"WGS_1984\",SPHEROID[\"WGS 84\",6378137,298.257223563,AUTHORITY[\"EPSG\",\"7030\"]],AUTHORITY[\"EPSG\",\"6326\"]],PRIMEM[\"Greenwich\",0,AUTHORITY[\"EPSG\",\"8901\"]],UNIT[\"degree\",0.0174532925199433,AUTHORITY[\"EPSG\",\"9122\"]],AUTHORITY[\"EPSG\",\"4326\"]]";
						writer.write(wgs84);
						writer.close();
						
						Path path = Paths.get(dir2+progressFile);
				        Set<PosixFilePermission> posixPermissions = PosixFilePermissions.fromString("rw-rw-rw-");
				        Files.setPosixFilePermissions(path, posixPermissions);
				        
				        ZipArchiveEntry prjEntry = new ZipArchiveEntry(prjFileName);
						zos.putArchiveEntry(prjEntry);
						
						FileInputStream prjIn = new FileInputStream(prjFile);
						BufferedInputStream bis = new BufferedInputStream(prjIn, 1024);
						
						int len;
						
		                while((len = bis.read(buf,0,size)) != -1){
		                    zos.write(buf,0,len);
		                }

		                prjIn.close();
						bis.close();
						zos.closeArchiveEntry();
					}
					
					if(cpgFile.exists()) {
						
						ZipArchiveEntry cpgEntry = new ZipArchiveEntry(cpgFileName);
						zos.putArchiveEntry(cpgEntry);
						
						FileInputStream cpgIn = new FileInputStream(cpgFile);
						BufferedInputStream bis = new BufferedInputStream(cpgIn, 1024);
						
						int len;
		                while((len = bis.read(buf,0,size)) != -1){
		                    zos.write(buf,0,len);
		                }

		                cpgIn.close();
						bis.close();
						zos.closeArchiveEntry();
					}
					
					zos.close();
					
					Path path = Paths.get(dir2+progressFileName+".zip");
			        Set<PosixFilePermission> posixPermissions = PosixFilePermissions.fromString("rw-rw-rw-");
			        Files.setPosixFilePermissions(path, posixPermissions);
			        
					File progTxt = new File(dir2+progressFile);
					BufferedWriter writer = new BufferedWriter(new FileWriter(progTxt));
					
					writer.write("complete");
					writer.close();
					
				}catch(IOException e) {
					logger.error("Data Access Error-IOException");
				}
			});
			
		} catch (IOException e) {
			logger.error("Data Access Error-IOException");
		}
		
		return result;
	}
	
	public String exportCsvToShpFiles(HashMap<String, String> param){
		
		String result="";
		String fileName = param.get("download_file");
		String dir = param.get("t_fileDir");
		String columns = param.get("columns");
		String schema = param.get("schema");
		String table =param.get("table");
		//디렉토리가 없을 경우 생성해야 shp export 가능
		if(dir != null) dir = dir.replaceAll("\\\\", "").replaceAll("&", "");
		File file = new File(dir);
		if(!file.exists()) {
			file.setExecutable(false);
			file.setReadable(true);
			file.setWritable(true);
			file.mkdir();
			
			Path path = Paths.get(dir);
	        Set<PosixFilePermission> posixPermissions = PosixFilePermissions.fromString("rwxrwxr-x");
	       
	        try {
				
	        	Files.setPosixFilePermissions(path, posixPermissions);
				
			} catch (IOException e) {
				// TODO Auto-generated catch block
				logger.error("Data Access Error-IOException");
			}
		}
		
		String postgisHost = "10.0.10.136";
		String postgisPort = "5432";
		String remoteCommandAppend = "";
		
		//String excuteCmd = "cmd.exe /C set PGCLIENTENCODING="+encoding+" & pgsql2shp -f \""+dir+fileName+"\" -g geom -h 61.254.11.250 -u digitaltwin -p 35432 -P digitaltwin digitaltwin \"SELECT geom,"+columns+" FROM "+schema+"."+table+"\"";
		
		//String excuteCmd = "PGCLIENTENCODING="+encoding+" & pgsql2shp -s 4326 -f \""+dir+fileName+"\" -g geo -h "+postgisHost+" -u digitaltwin -p "+postgisPort+" -P digitaltwin digitaltwin \"SELECT geo,"+columns+" FROM "+schema+"."+table+"\"";
		String excuteCmd = "pgsql2shp -f \""+dir+fileName+"\" -g geo -h "+postgisHost+" -u digitaltwin -p "+postgisPort+" -P !@Egis2024!@ digitaltwin \"SELECT geo,"+columns+" FROM "+schema+"."+table+"\"";
		if(excuteCmd.indexOf("pgsql2shp")==-1) {
			logger.error("사용할 수 없는 명령어입니다.");
			return null;
		}
		//윈도우
		//String[] excuteCmdArr = new String[] {"cmd.exe","/C",excuteCmd};
		//리눅스
		String[] excuteCmdArr = new String[] {"/bin/sh","-c",excuteCmd};
		
		if(OS.indexOf("win") >= 0) {//윈도우-추후 삭제
			excuteCmdArr = new String[] {"cmd.exe","/C",excuteCmd};
		}
		
		ProcessBuilder processbuilder = new ProcessBuilder(excuteCmdArr);
		processbuilder.redirectErrorStream(true);
		
		Process process;
		
		try {
			String dir2 = dir;
			process = processbuilder.start();
			InputStream stdout = process.getInputStream();
			String progressFileName = fileName.split("\\.")[0];
			String progressFile = table+"_progress.txt";
			
			result=progressFile;
			
			Executors.newCachedThreadPool().execute(()->{
				try(BufferedReader reader = new BufferedReader(new InputStreamReader(stdout))){
					
					String line;
					Scanner scanner = new Scanner(reader).useDelimiter("");
					int count =0;
					
					while(scanner.hasNext()) {
						
						line = scanner.next();
						if(line.trim().toLowerCase().equals("x")) {
						
							File progTxt = new File(dir2+progressFile);
							BufferedWriter writer = new BufferedWriter(new FileWriter(progTxt));
							
							String countStr = Integer.toString(count);
							writer.write(countStr);
							writer.close();
							
							if(count == 0) {
								Path path = Paths.get(dir2+progressFile);
						        Set<PosixFilePermission> posixPermissions = PosixFilePermissions.fromString("rw-rw-rw-");
						        Files.setPosixFilePermissions(path, posixPermissions);
							}
							
							count++;
							
						}
					}
					
					String shpFileName = progressFileName+".shp";
					String shxFileName = progressFileName+".shx";
					String dbfFileName = progressFileName+".dbf";
					String prjFileName = progressFileName+".prj";
					String cpgFileName = progressFileName+".cpg";
					
					File shpFile = new File(dir2+shpFileName);
					File shxFile = new File(dir2+shxFileName);
					File dbfFile = new File(dir2+dbfFileName);
					File prjFile = new File(dir2+prjFileName);
					File cpgFile = new File(dir2+cpgFileName);
					
					ZipArchiveOutputStream zos = new ZipArchiveOutputStream(new BufferedOutputStream(new FileOutputStream(dir2+progressFileName+".zip")));
					//zos.setEncoding("UTF-8");
					
					int size = 1024;
				    byte[] buf = new byte[size];
					
					if(shpFile.exists()) {

						ZipArchiveEntry shpEntry = new ZipArchiveEntry(shpFileName);
						zos.putArchiveEntry(shpEntry);
						
						FileInputStream shpIn = new FileInputStream(shpFile);
						BufferedInputStream bis = new BufferedInputStream(shpIn, 1024);
						
						int len;
		                while((len = bis.read(buf,0,size)) != -1){
		                    zos.write(buf,0,len);
		                }

						shpIn.close();
						bis.close();
						zos.closeArchiveEntry();

					}
					
					if(shxFile.exists()) {
						
						ZipArchiveEntry shpEntry = new ZipArchiveEntry(shxFileName);
						zos.putArchiveEntry(shpEntry);
						
						FileInputStream shxIn = new FileInputStream(shxFile);
						BufferedInputStream bis = new BufferedInputStream(shxIn, 1024);
						
						int len;
		                while((len = bis.read(buf,0,size)) != -1){
		                    zos.write(buf,0,len);
		                }

		                shxIn.close();
						bis.close();
						zos.closeArchiveEntry();
					}
					

					if(dbfFile.exists()) {
						
						ZipArchiveEntry dbfEntry = new ZipArchiveEntry(dbfFileName);
						zos.putArchiveEntry(dbfEntry);
						
						FileInputStream dbfIn = new FileInputStream(dbfFile);
						BufferedInputStream bis = new BufferedInputStream(dbfIn, 1024);
						
						int len;
		                while((len = bis.read(buf,0,size)) != -1){
		                    zos.write(buf,0,len);
		                }

		                dbfIn.close();
						bis.close();
						zos.closeArchiveEntry();
					}
					
					if(prjFile.exists()) {
						
						ZipArchiveEntry prjEntry = new ZipArchiveEntry(prjFileName);
						zos.putArchiveEntry(prjEntry);
						
						FileInputStream prjIn = new FileInputStream(prjFile);
						BufferedInputStream bis = new BufferedInputStream(prjIn, 1024);
						
						int len;
		                while((len = bis.read(buf,0,size)) != -1){
		                    zos.write(buf,0,len);
		                }

		                prjIn.close();
						bis.close();
						zos.closeArchiveEntry();
					}else {
				
						BufferedWriter writer = new BufferedWriter(new FileWriter(prjFile));
						
						String wgs84 = "GEOGCS[\"WGS 84\",DATUM[\"WGS_1984\",SPHEROID[\"WGS 84\",6378137,298.257223563,AUTHORITY[\"EPSG\",\"7030\"]],AUTHORITY[\"EPSG\",\"6326\"]],PRIMEM[\"Greenwich\",0,AUTHORITY[\"EPSG\",\"8901\"]],UNIT[\"degree\",0.0174532925199433,AUTHORITY[\"EPSG\",\"9122\"]],AUTHORITY[\"EPSG\",\"4326\"]]";
						writer.write(wgs84);
						writer.close();
						
						Path path = Paths.get(dir2+progressFile);
				        Set<PosixFilePermission> posixPermissions = PosixFilePermissions.fromString("rw-rw-rw-");
				        Files.setPosixFilePermissions(path, posixPermissions);
				        
				        ZipArchiveEntry prjEntry = new ZipArchiveEntry(prjFileName);
						zos.putArchiveEntry(prjEntry);
						
						FileInputStream prjIn = new FileInputStream(prjFile);
						BufferedInputStream bis = new BufferedInputStream(prjIn, 1024);
						
						int len;
						
		                while((len = bis.read(buf,0,size)) != -1){
		                    zos.write(buf,0,len);
		                }

		                prjIn.close();
						bis.close();
						zos.closeArchiveEntry();
						
					}
					
					if(cpgFile.exists()) {
						
						ZipArchiveEntry cpgEntry = new ZipArchiveEntry(cpgFileName);
						zos.putArchiveEntry(cpgEntry);
						
						FileInputStream cpgIn = new FileInputStream(cpgFile);
						BufferedInputStream bis = new BufferedInputStream(cpgIn, 1024);
						
						int len;
		                while((len = bis.read(buf,0,size)) != -1){
		                    zos.write(buf,0,len);
		                }

		                cpgIn.close();
						bis.close();
						zos.closeArchiveEntry();
					}
					
					zos.close();
					
					Path path = Paths.get(dir2+progressFileName+".zip");
			        Set<PosixFilePermission> posixPermissions = PosixFilePermissions.fromString("rw-rw-rw-");
			        Files.setPosixFilePermissions(path, posixPermissions);
			        
					File progTxt = new File(dir2+progressFile);
					BufferedWriter writer = new BufferedWriter(new FileWriter(progTxt));
					
					writer.write("complete");
					writer.close();
					
				}catch(IOException e) {
					logger.error("Data Access Error-IOException");
				}
			});
			
		} catch (IOException e) {
			logger.error("Data Access Error-IOException");
		}
		
		return result;
	}
	
}
