package com.vision_x.vision_x.model.service.impl;

import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.vision_x.vision_x.desk.mapdata.service.MapsDataVO;

import egovframework.rte.psl.dataaccess.EgovAbstractMapper;

@Repository("modelDAO")
public class ModelDAO extends EgovAbstractMapper {

	@Autowired
	@Resource(name="postGreSqlSession")
	private SqlSession postGreSqlSession;
	
	public List<HashMap<String, String>> getHeaderLists(MapsDataVO vo){
		 return postGreSqlSession.selectList("modelDAO.getHeaderLists", vo);
	}
	
	public List<HashMap<String, Object>> getInitLists(MapsDataVO vo){
		return postGreSqlSession.selectList("modelDAO.getInitLists", vo);
	}
	
	public List<HashMap<String, Object>> getShpPropertyList(HashMap<String, Object> vo){
		return postGreSqlSession.selectList("modelDAO.getShpPropertyList", vo);
	}
	
	public int delete3dsObjRecord(HashMap<String, String> param) {
		return postGreSqlSession.delete("modelDAO.delete3dsObjRecord", param);
	}
}
