package com.vision_x.vision_x.geocoding.service.impl;

import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.vision_x.vision_x.desk.mapdata.service.MapsDataVO;
import com.vision_x.vision_x.geocoding.service.PoiObjVO;
import com.vision_x.vision_x.worker.service.WorkerCSVItemVO;

import egovframework.rte.psl.dataaccess.EgovAbstractMapper;

@Repository("geocodingWorkerDAO")
public class GeocodingWorkerDAO extends EgovAbstractMapper {

	@Autowired
	@Resource(name="postGreSqlSession")
	private SqlSession postGreSqlSession;

	public int addCsvColumn(HashMap<String, String> param) {
		return postGreSqlSession.update("geocodingWorkerDAO.addCsvColumn", param);
	}
	
	public HashMap<String, Integer> checkColumnExist(HashMap<String, String> param){
		return postGreSqlSession.selectOne("geocodingWorkerDAO.checkColumnExist", param);
	}
}
