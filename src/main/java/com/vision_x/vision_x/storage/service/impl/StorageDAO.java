/**
 * 
 */
package com.vision_x.vision_x.storage.service.impl;

import java.sql.SQLException;
import java.util.HashMap;

import org.springframework.stereotype.Repository;

import egovframework.rte.psl.dataaccess.EgovAbstractMapper;

/**
 * StorageDAO.java
 * digitaltwincloud
 * 2021. 6. 29.
 *
 */
@Repository("storageDAO")
public class StorageDAO  extends EgovAbstractMapper {
	
	public HashMap<String, String> checkStorageMax(int memid) {
		return selectOne("storageDAO.checkStorageMax", memid);
	}
	public void changeStorageMax(HashMap<String, String> map) {
		selectOne("storageDAO.changeStorageMax", map);
	}
	public void insertRateLog(HashMap<String, String> map) {
		selectOne("storageDAO.insertRateLog", map);
	}
}