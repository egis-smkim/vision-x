package com.vision_x.vision_x.shp.service.impl;

import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;
import javax.validation.Valid;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.vision_x.vision_x.cloud.service.MapDataVO;
import com.vision_x.vision_x.desk.mapdata.service.MapsDataVO;

import egovframework.rte.psl.dataaccess.EgovAbstractMapper;

@Repository("shapeDAO")
public class ShapeDAO extends EgovAbstractMapper {
	
	@Autowired
	@Resource(name="postGreSqlSession")
	private SqlSession postGreSqlSession;
	
	@Valid
	public List<HashMap<String, Object>> getInitProperties(MapsDataVO vo){
		return postGreSqlSession.selectList("shapeDAO.getInitProperties", vo);
	}
	
	public List<String> getTableHeader(MapsDataVO vo){
		return postGreSqlSession.selectList("shapeDAO.getTableHeader",vo);
	}
	
	public int updateProperties(HashMap<String, Object> map) {
		return postGreSqlSession.update("shapeDAO.updateProperties",map);
	}
	
	public HashMap<String, String> getGeometryInfo(HashMap<String, String> map){
		return postGreSqlSession.selectOne("shapeDAO.getGeometryInfo",map);
	}
	
	public List<HashMap<String, Object>> getSearchProperties(HashMap<String, String> map){
		return postGreSqlSession.selectList("shapeDAO.getSearchProperties",map);
	}
	
	public List<HashMap<String, String>> getColumnInfoList(HashMap<String, String> map){
		return postGreSqlSession.selectList("shapeDAO.getColumnInfoList",map);
	}
	
	public int transformProj(HashMap<String, String> map) {
		return postGreSqlSession.update("shapeDAO.transformProj",map);
	}
	
	public HashMap<String, Object> getTotalRecords(HashMap<String, String> map){
		return postGreSqlSession.selectOne("shapeDAO.getTotalRecords",map);
	}
	
	public HashMap<String, Object> getFeatureInfoWithBoundary(HashMap<String, String> map){
		return postGreSqlSession.selectOne("shapeDAO.getFeatureInfoWithBoundary",map);
	}
	
	public HashMap<String, Object> getFeatureInfoWithPoint(HashMap<String, String> map){
		return postGreSqlSession.selectOne("shapeDAO.getFeatureInfoWithPoint",map);
	}
	
	public List<String> getInitPropertiesByColumnName(MapsDataVO vo){
		return  postGreSqlSession.selectList("shapeDAO.getInitPropertiesByColumnName", vo);
	};
	
	public List<HashMap<String, Object>> getSearchPropertiesWithSize(HashMap<String, Object> map){
		return postGreSqlSession.selectList("shapeDAO.getSearchPropertiesWithSize",map);
	}
}

