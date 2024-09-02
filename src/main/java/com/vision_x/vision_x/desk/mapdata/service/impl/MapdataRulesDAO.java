package com.vision_x.vision_x.desk.mapdata.service.impl;

import java.util.HashMap;

import org.springframework.stereotype.Repository;

import com.vision_x.vision_x.desk.mapdata.service.MapDataRulesVO;

import egovframework.rte.psl.dataaccess.EgovAbstractMapper;

@Repository("mapdatarulesDAO")
public class MapdataRulesDAO  extends EgovAbstractMapper {
	public HashMap<String, Object> getMapRulesByDataID(int dataId){
		return selectOne("mapdatarulesDAO.getMapRulesByDataID", dataId);
	}
	public int insertRules(MapDataRulesVO mdrVO) {
		// TODO Auto-generated method stub
		return insert("mapdatarulesDAO.insertRules", mdrVO);
	}


	public int updateRules(MapDataRulesVO mdrVO) {
		// TODO Auto-generated method stub
		return update("mapdatarulesDAO.updateRules", mdrVO);
	}


}