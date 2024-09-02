package com.vision_x.vision_x.geocoding.service.impl;

import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import egovframework.rte.psl.dataaccess.EgovAbstractMapper;

@Repository("csvPropertiesDAO")
public class CsvPropertiesDAO extends EgovAbstractMapper{

	@Autowired
	@Resource(name="postGreSqlSession")
	private SqlSession postGreSqlSession;
	
	public List<String> getHeaderProperties(HashMap<String, Object> param){
		return postGreSqlSession.selectList("csvPropertiesDAO.getHeaderProperties", param);
	}
	
	public List<HashMap<String, Object>> getInitRecords(HashMap<String, Object> param){
		return postGreSqlSession.selectList("csvPropertiesDAO.getInitRecords", param);
	}
	
	public HashMap<String, Object> getGeometry(HashMap<String, Object> param) {
		return (HashMap<String, Object>) postGreSqlSession.selectOne("csvPropertiesDAO.getGeometry", param);
	}
	
	public List<HashMap<String, Object>> searchProperty(HashMap<String, Object> param){
		return postGreSqlSession.selectList("csvPropertiesDAO.searchProperty",param);
	}
	
	public int updateData(HashMap<String, Object> param) {
		return postGreSqlSession.update("csvPropertiesDAO.updateData",param);
	}
	
	public HashMap<String, Object> getSingleProperty(HashMap<String, Object> param) {
		return (HashMap<String, Object>) postGreSqlSession.selectOne("csvPropertiesDAO.getSingleProperty", param);
	}
	public List<HashMap<String, Object>> getPropertyList(HashMap<String, Object> param){
		return postGreSqlSession.selectList("csvPropertiesDAO.getPropertyList", param);
	}
}
