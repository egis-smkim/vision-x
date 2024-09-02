package com.vision_x.vision_x.geocoding.service.impl;

import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.vision_x.vision_x.geocoding.service.CsvPropertiesService;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("csvPropertiesService")
public class CsvPropertiesImpl extends EgovAbstractServiceImpl implements CsvPropertiesService {

	@Resource(name="csvPropertiesDAO")
	private CsvPropertiesDAO csvPropertiesDAO;

	@Override
	public List<String> getHeaderProperties(HashMap<String, Object> param) {
		// TODO Auto-generated method stub
		return csvPropertiesDAO.getHeaderProperties(param);
	}

	@Override
	public List<HashMap<String, Object>> getInitRecords(HashMap<String, Object> param) {
		// TODO Auto-generated method stub
		return csvPropertiesDAO.getInitRecords(param);
	}

	@Override
	public HashMap<String, Object> getGeometry(HashMap<String, Object> param) {
		// TODO Auto-generated method stub
		return csvPropertiesDAO.getGeometry(param);
	}

	@Override
	public List<HashMap<String, Object>> searchProperty(HashMap<String, Object> param) {
		// TODO Auto-generated method stub
		return csvPropertiesDAO.searchProperty(param);
	}

	@Override
	public int updateData(HashMap<String, Object> param) {
		return csvPropertiesDAO.updateData(param);
	}

	@Override
	public HashMap<String, Object> getSingleProperty(HashMap<String, Object> param) {
		return csvPropertiesDAO.getSingleProperty(param);
	}
	@Override
	public List<HashMap<String, Object>> getPropertyList(HashMap<String, Object> param) {
		return csvPropertiesDAO.getPropertyList(param);
	}
	
	
}
