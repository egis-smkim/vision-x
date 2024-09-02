package com.vision_x.vision_x.geocoding.service;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;

import com.vision_x.vision_x.desk.mapdata.service.MapsDataVO;
import com.vision_x.vision_x.worker.service.WorkerCSVItemVO;

public interface GeocodingWorkerService {

	public int addCsvColumn(HashMap<String, String> param) throws SQLException;
	
	public HashMap<String, Integer> checkColumnExist(HashMap<String, String> param) throws SQLException;
 }
