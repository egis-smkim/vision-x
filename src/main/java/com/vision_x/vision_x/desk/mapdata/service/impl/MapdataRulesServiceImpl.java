package com.vision_x.vision_x.desk.mapdata.service.impl;

import java.util.HashMap;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.vision_x.vision_x.desk.mapdata.service.MapDataRulesVO;
import com.vision_x.vision_x.desk.mapdata.service.MapdataRulesService;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;


@Service("mapdataRulesService")
public class MapdataRulesServiceImpl extends EgovAbstractServiceImpl implements MapdataRulesService{

	@Resource(name="mapdatarulesDAO")
	private MapdataRulesDAO mapdataRulesDAO;

	@Override
	public HashMap<String, Object> getMapRulesByDataID(int DataId) {
		// TODO Auto-generated method stub
		return mapdataRulesDAO.getMapRulesByDataID(DataId);
	}

	@Override
	public int insertRules(MapDataRulesVO mdrVO) {
		// TODO Auto-generated method stub
		return mapdataRulesDAO.insertRules(mdrVO);
	}

	@Override
	public int updateRules(MapDataRulesVO mdrVO) {
		// TODO Auto-generated method stub
		return mapdataRulesDAO.updateRules(mdrVO);
	}



}