/**
 * 
 */
package com.vision_x.vision_x.postgis.service;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;

import com.vision_x.vision_x.utils.ProjVO;

/**
 * PostGisService.java
 * digitaltwincloud
 * 2021. 7. 1.
 * @author Khaia
 * @Comment
 *
 */
public interface PostGisService {
	public int deleteLayerTable(String schemaAndtblName) throws SQLException;
	
	public List<ProjVO> getProjectionInfo();
	
	public List<ProjVO> getProjSearchInfo(String keyword);
	
	public ProjVO getPrjWktInfo(int code);
	
	public List<HashMap<String, Object>> getTypDamageLocation(String location);
	
	public List<HashMap<String, Object>> getTypDamageLocationSetTable(HashMap<String, String> param);
	
	public List<HashMap<String, Object>> getTideLocation(String location);
	
	public HashMap<String, String> getShp3dsProps(HashMap<String, String> param);
	
	public List<HashMap<String, Object>> get3dsFileInfo(HashMap<String, String> param);
	
	public int update3dsObjInfo(HashMap<String, Object> param);
	
	public HashMap<String, Object> getMaxHeight(HashMap<String, String> param);
	
}