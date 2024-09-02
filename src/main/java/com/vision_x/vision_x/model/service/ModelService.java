package com.vision_x.vision_x.model.service;

import java.util.HashMap;
import java.util.List;

import com.vision_x.vision_x.desk.mapdata.service.MapsDataVO;

public interface ModelService {

	public List<HashMap<String, String>> getHeaderLists(MapsDataVO vo);

	public List<HashMap<String, Object>> getInitLists(MapsDataVO vo);
	
	public List<HashMap<String, Object>> getShpPropertyList(HashMap<String, Object> vo);
	
	public int delete3dsObjRecord(HashMap<String, String> param);
}
