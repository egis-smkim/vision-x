package com.vision_x.vision_x.app.typhoon.service;

import java.util.HashMap;
import java.util.List;

public interface TyphoonService {

	public List<HashMap<String, String>> getTyphoonInfo();
	
	public List<HashMap<String, String>> getTyphoonDetail(HashMap<String, String> param);
	
	public List<HashMap<String, String>> getTypinfoFormDB(HashMap<String, String> param);
	
	public List<HashMap<String, String>> getTypinfoHistoryFormDB(HashMap<String, String> param);
}
