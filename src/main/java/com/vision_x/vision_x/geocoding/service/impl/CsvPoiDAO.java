package com.vision_x.vision_x.geocoding.service.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.vision_x.vision_x.geocoding.service.MemPoiVO;
import com.vision_x.vision_x.geocoding.service.PoiObjVO;

import egovframework.rte.psl.dataaccess.EgovAbstractMapper;

@Repository("csvPoiDAO")
public class CsvPoiDAO extends EgovAbstractMapper {
	
	public List<PoiObjVO> getImgPoiList(String type){
		return selectList("csvPoiDAO.getImgPoiList",type);
	}

	public int insertMemPoiInfo(MemPoiVO vo) {
		return insert("csvPoiDAO.insertMemPoiInfo",vo);
	}
	
	public MemPoiVO getMemberPoiInfo(int dataid) {
		return selectOne("csvPoiDAO.getMemberPoiInfo",dataid);
	}
	
}
