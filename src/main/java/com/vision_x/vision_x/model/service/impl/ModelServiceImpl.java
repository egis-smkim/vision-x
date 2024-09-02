package com.vision_x.vision_x.model.service.impl;

import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.vision_x.vision_x.desk.mapdata.service.MapsDataVO;
import com.vision_x.vision_x.model.service.ModelService;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("modelService")
public class ModelServiceImpl extends EgovAbstractServiceImpl implements ModelService {

	@Resource(name="modelDAO")
	private ModelDAO modelDAO;
	
	@Override
	public List<HashMap<String, String>> getHeaderLists(MapsDataVO vo) {
		return modelDAO.getHeaderLists(vo);
	}

	@Override
	public List<HashMap<String, Object>> getInitLists(MapsDataVO vo) {
		return modelDAO.getInitLists(vo);
	}
	
	@Override
	public List<HashMap<String, Object>> getShpPropertyList(HashMap<String, Object> vo) {
		return modelDAO.getShpPropertyList(vo);
	}

	@Override
	public int delete3dsObjRecord(HashMap<String, String> param) {
		// TODO Auto-generated method stub
		return modelDAO.delete3dsObjRecord(param);
	}

	
	
}
