package com.vision_x.vision_x.shp.service;

import java.util.HashMap;
import java.util.List;

import javax.validation.Valid;

import com.vision_x.vision_x.desk.mapdata.service.MapsDataVO;

public interface ShapeService {
	
	@Valid
	public List<HashMap<String, Object>> getInitProperties(MapsDataVO vo);
	
	public List<String> getTableHeader(MapsDataVO vo);
	
	public int updateProperties(HashMap<String, Object> map);
	
	public HashMap<String, String> getGeometryInfo(HashMap<String, String> map);
	
	public List<HashMap<String, Object>> getSearchProperties(HashMap<String, String> map);
	
	public List<HashMap<String, String>> getColumnInfoList(HashMap<String, String> map);
	
	public int transformProj(HashMap<String, String> map);
	
	public HashMap<String, Object> getTotalRecords(HashMap<String, String> map);
	
	public HashMap<String, Object> getFeatureInfoWithBoundary(HashMap<String, String> map);
	
	public HashMap<String, Object> getFeatureInfoWithPoint(HashMap<String, String> map);
	
	public List<String> getInitPropertiesByColumnName(MapsDataVO vo);
	
	public List<HashMap<String, Object>> getSearchPropertiesWithSize(HashMap<String, Object> map);

}