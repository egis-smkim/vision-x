/**
 * 
 */
package com.vision_x.vision_x.postgis.service.impl;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.vision_x.vision_x.utils.ProjVO;

import egovframework.rte.psl.dataaccess.EgovAbstractMapper;

/**
 * PostGisDAO.java
 * digitaltwincloud
 * 2021. 7. 1.
 * @author Khaia
 * @Comment
 *
 */
@Repository("postGisDAO")
public class PostGisDAO extends EgovAbstractMapper {
	@Autowired
	@Resource(name="postGreSqlSession")
	private SqlSession postGreSqlSession;
	
	public int deleteLayerTable(String schemaAndtblName) throws SQLException {
		// return postGreSqlSession.update("memberDAO.createGeoDb",db);
		return postGreSqlSession.delete("postGisDAO.deleteLayerTable", schemaAndtblName);
	}
	
	public List<ProjVO> getProjectionInfo(){
		return postGreSqlSession.selectList("postGisDAO.getProjectionInfo", null);
	}
	
	public List<ProjVO> getProjSearchInfo(String keyword) {
		return postGreSqlSession.selectList("postGisDAO.getProjSearchInfo", keyword);
	}
	
	public ProjVO getPrjWktInfo(int code) {
		return postGreSqlSession.selectOne("postGisDAO.getPrjWktInfo", code);
	}
	
	public List<HashMap<String, Object>> getTypDamageLocation(String location) {
		return postGreSqlSession.selectList("postGisDAO.getTypDamageLocation", location);
	}
	
	public List<HashMap<String, Object>> getTypDamageLocationSetTable(HashMap<String, String> param) {
		return postGreSqlSession.selectList("postGisDAO.getTypDamageLocationSetTable", param);
	}
	
	public List<HashMap<String, Object>> getTideLocation(String location) {
		return postGreSqlSession.selectList("postGisDAO.getTideLocation", location);
	}
	
	public HashMap<String, String> getShp3dsProps(HashMap<String, String> param){
		return postGreSqlSession.selectOne("postGisDAO.getShp3dsProps", param);
	}
	
	public List<HashMap<String, Object>> get3dsFileInfo(HashMap<String, String> param){
		
		return postGreSqlSession.selectList("postGisDAO.get3dsFileInfo", param);
		
	}
	
	public int update3dsObjInfo(HashMap<String, Object> param) {
		return postGreSqlSession.update("postGisDAO.update3dsObjInfo", param);
	}
	
	public HashMap<String, Object> getMaxHeight(HashMap<String, String> param){
		return postGreSqlSession.selectOne("postGisDAO.getMaxHeight", param);
	}
}