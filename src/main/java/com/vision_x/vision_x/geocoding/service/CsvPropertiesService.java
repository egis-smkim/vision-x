package com.vision_x.vision_x.geocoding.service;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;

public interface CsvPropertiesService {
	
	public List<String> getHeaderProperties(HashMap<String, Object> param) throws SQLException;
	
	public List<HashMap<String, Object>> getInitRecords(HashMap<String, Object> param) throws SQLException;
	
	public HashMap<String, Object> getGeometry(HashMap<String, Object> param) throws SQLException;
	
	public List<HashMap<String, Object>> searchProperty(HashMap<String, Object> param)throws SQLException;
	
	public int updateData(HashMap<String, Object> param)throws SQLException;
	
	public HashMap<String, Object> getSingleProperty(HashMap<String, Object> param);
	
	public List<HashMap<String, Object>> getPropertyList(HashMap<String, Object> param);
	
}
