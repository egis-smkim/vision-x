/**
 * 
 */
package com.vision_x.vision_x.storage.service.impl;


import java.io.BufferedReader;
import java.io.File;
import java.io.FilenameFilter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.sql.SQLException;
import java.util.HashMap;

import javax.annotation.Resource;

import org.apache.commons.lang.NullArgumentException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.vision_x.vision_x.storage.service.StorageService;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

/**
 * StorageServiceImpl.java
 * digitalTwin
 * 2021. 6. 29.
 * @Comment
 *
 */
@Service("storageService")
public class StorageServiceImpl extends EgovAbstractServiceImpl implements StorageService {
	
	@Resource(name="storageDAO")
	private StorageDAO storageDAO;
	
	protected Logger logger = LoggerFactory.getLogger(this.getClass());

	@Override
	public String checkStorageUsable(String path){
		
		String storage = "0.0";
		String returnData = "";
		String execStr = "du -bsx "+path;
		
		if(execStr.indexOf("du")==-1) {
			logger.error("사용할 수 없는 명령어입니다.");
			return null;
		}
		
		if(path != null) path = path.replaceAll("\\\\","").replaceAll ("&","");
		File fileCheck = new File(path);
		if(fileCheck.exists()) {
			InputStreamReader psIsr = null;	
			BufferedReader br = null;
			String line = null;
			Process ps;
			InputStream inputStream = null;
			try {
				ps = Runtime.getRuntime().exec(execStr);
			
				ps.getErrorStream();
				inputStream = ps.getInputStream();
				psIsr = new InputStreamReader(inputStream);
				br = new BufferedReader(psIsr);
				while((line = br.readLine()) != null){	
			    	returnData += line.trim();
			    }
				ps.getOutputStream();	
				ps.waitFor();
				if(returnData != "") {
					String[] returnArray = returnData.split("\t");
					storage = returnArray[0];
				}
			} catch (IOException e) {
				logger.error("Data Access Error-IOException");
			} catch (InterruptedException e) {
				logger.error("Thread Error-InterruptedException");
			} catch (Exception e) {
				logger.error("Thread Error");
			} finally{
				try {
					if(inputStream!=null) inputStream.close();
					if(psIsr!=null) psIsr.close();
					if(br!=null) br.close();
				} catch (IOException e) {
					logger.error("Close Error-IOException");
				}
			}
		}
		return storage;
		
	}
	@Override
	public HashMap<String, String> checkStorageMax(int memid){
		return storageDAO.checkStorageMax(memid);
	}

	@Override
	public void changeStorageMax(HashMap<String, String> map){
		storageDAO.changeStorageMax(map);
		storageDAO.insertRateLog(map);
	}
	
	@Override
	public boolean checkStorageUpload(HashMap<String, String> map) {
		int mid = Integer.parseInt(map.get("mid"));
		String memID = map.get("memID");
		String size = map.get("size");
		
		HashMap<String, String> max_data = checkStorageMax(mid);
		String max = max_data.get("STORAGE");
		String path = "/data/DT_DATA/userData/"+memID;
		String storage = checkStorageUsable(path);

		boolean upload = true;
		
		Double flag = Double.parseDouble(max) - (Double.parseDouble(storage) + Double.parseDouble(size));
		if(flag < 0) {
			upload = false;
		}
		
		return upload;
	}

	@Override
	public String[] checkStorageInDirectory(String path){
		if(path != null) path = path.replaceAll("\\.", "").replaceAll("\\\\", "").replaceAll("&", "");
		String[] directories = new File(path).list(new FilenameFilter() {
		  @Override
		  public boolean accept(File current, String name) {
		    return new File(current, name).isDirectory();
		  }
		});
		return directories;
	}


}
