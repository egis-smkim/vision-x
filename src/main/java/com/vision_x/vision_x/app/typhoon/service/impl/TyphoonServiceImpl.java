package com.vision_x.vision_x.app.typhoon.service.impl;

import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.vision_x.vision_x.app.typhoon.service.TyphoonService;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("typhoonService")
public class TyphoonServiceImpl extends EgovAbstractServiceImpl implements TyphoonService {

	@Resource(name="typhoonDAO")
	private TyphoonDAO typhoonDAO;
	
	@Override
	public List<HashMap<String, String>> getTyphoonInfo() {
		// TODO Auto-generated method stub
		return typhoonDAO.getTyphoonInfo();
	}

	@Override
	public List<HashMap<String, String>> getTyphoonDetail(HashMap<String, String> param) {
		// TODO Auto-generated method stub
		return typhoonDAO.getTyphoonDetail(param);
	}

	@Override
	public List<HashMap<String, String>> getTypinfoFormDB(HashMap<String, String> param) {
		// TODO Auto-generated method stub
		return typhoonDAO.getTypinfoFormDB(param);
	}
	
	@Override
	public List<HashMap<String, String>> getTypinfoHistoryFormDB(HashMap<String, String> param) {
		// TODO Auto-generated method stub
		return typhoonDAO.getTypinfoHistoryFormDB(param);
	}
	
	

	
}
