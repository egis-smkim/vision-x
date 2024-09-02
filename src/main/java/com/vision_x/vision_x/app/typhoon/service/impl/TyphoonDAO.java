package com.vision_x.vision_x.app.typhoon.service.impl;

import java.util.HashMap;
import java.util.List;

import org.springframework.stereotype.Repository;

import egovframework.rte.psl.dataaccess.EgovAbstractMapper;

@Repository("typhoonDAO")
public class TyphoonDAO extends EgovAbstractMapper  {
	
	public List<HashMap<String, String>> getTyphoonInfo(){
		return selectList("typhoonDAO.getTyphoonInfo",null);
	}
	
	public List<HashMap<String, String>> getTyphoonDetail(HashMap<String, String> param){
		return selectList("typhoonDAO.getTyphoonDetail",param);
	}
	
	public List<HashMap<String, String>> getTypinfoFormDB(HashMap<String, String> param){
		return selectList("typhoonDAO.getTypinfoFormDB",param);
	}
	
	public List<HashMap<String, String>> getTypinfoHistoryFormDB(HashMap<String, String> param){
		return selectList("typhoonDAO.getTypinfoHistoryFormDB",param);
	}
}
