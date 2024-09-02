package com.vision_x.vision_x.geocoding.service.impl;


import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.vision_x.vision_x.desk.mapdata.service.MapsDataVO;
import com.vision_x.vision_x.geocoding.service.GeocodingWorkerService;
import com.vision_x.vision_x.geocoding.service.PoiObjVO;
import com.vision_x.vision_x.worker.service.WorkerCSVItemVO;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("geocodingWorkerSevice")
public class GeocodingWorkerSeviceImpl extends EgovAbstractServiceImpl implements GeocodingWorkerService{

	@Resource(name="geocodingWorkerDAO")
	private GeocodingWorkerDAO geocodingWorkerDAO;

	@Override
	public int addCsvColumn(HashMap<String, String> param) {
		// TODO Auto-generated method stub
		return geocodingWorkerDAO.addCsvColumn(param);
	}

	@Override
	public HashMap<String, Integer> checkColumnExist(HashMap<String, String> param) {
		// TODO Auto-generated method stub
		return geocodingWorkerDAO.checkColumnExist(param);
	}

}
