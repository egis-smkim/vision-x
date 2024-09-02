package com.vision_x.vision_x.desk.mapdata.service;

import java.util.HashMap;

import org.springframework.stereotype.Service;

public interface MapdataRulesService {
	public HashMap<String,Object> getMapRulesByDataID(int DataId);
	public int insertRules(MapDataRulesVO mdrVO);
	public int updateRules(MapDataRulesVO mdrVO);
}