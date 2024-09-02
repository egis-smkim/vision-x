package com.vision_x.vision_x.shp.service.impl;
import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.vision_x.vision_x.desk.mapdata.service.MapsDataVO;
import com.vision_x.vision_x.shp.service.ShapeService;
import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("shapeService")
public class ShapeServiceImpl extends EgovAbstractServiceImpl implements ShapeService{
	
	@Resource(name="shapeDAO")
	private ShapeDAO shapeDAO;

	@Override
	public List<HashMap<String, Object>> getInitProperties(MapsDataVO vo) {
		return shapeDAO.getInitProperties(vo);
	}

	@Override
	public List<String> getTableHeader(MapsDataVO vo) {
		return shapeDAO.getTableHeader(vo);
	}

	@Override
	public int updateProperties(HashMap<String, Object> map) {
		return shapeDAO.updateProperties(map);
	}

	@Override
	public HashMap<String, String> getGeometryInfo(HashMap<String, String> map) {
		return shapeDAO.getGeometryInfo(map);
	}

	@Override
	public List<HashMap<String, Object>> getSearchProperties(HashMap<String, String> map) {
		return shapeDAO.getSearchProperties(map);
	}

	@Override
	public List<HashMap<String, String>> getColumnInfoList(HashMap<String, String> map) {
		return shapeDAO.getColumnInfoList(map);
	}

	@Override
	public int transformProj(HashMap<String, String> map) {
		return shapeDAO.transformProj(map);
	}

	@Override
	public HashMap<String, Object> getTotalRecords(HashMap<String, String> map) {
		return shapeDAO.getTotalRecords(map);
	}

	@Override
	public HashMap<String, Object> getFeatureInfoWithBoundary(HashMap<String, String> map) {
		return shapeDAO.getFeatureInfoWithBoundary(map);
	}
	
	@Override
	public HashMap<String, Object> getFeatureInfoWithPoint(HashMap<String, String> map) {
		return shapeDAO.getFeatureInfoWithPoint(map);
	}
	
	@Override
	public List<String> getInitPropertiesByColumnName(MapsDataVO vo) {
		// TODO Auto-generated method stub
		return shapeDAO.getInitPropertiesByColumnName(vo);
	}

	@Override
	public List<HashMap<String, Object>> getSearchPropertiesWithSize(HashMap<String, Object> map) {
		// TODO Auto-generated method stub
		return shapeDAO.getSearchPropertiesWithSize(map);
	}
	
}
