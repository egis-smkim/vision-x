package com.vision_x.vision_x.geocoding.service.impl;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.vision_x.vision_x.geocoding.service.CsvPoiService;
import com.vision_x.vision_x.geocoding.service.MemPoiVO;
import com.vision_x.vision_x.geocoding.service.PoiObjVO;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("csvPoiService")
public class CsvPoiServiceImpl extends EgovAbstractServiceImpl implements CsvPoiService {

	@Resource(name="csvPoiDAO")
	private CsvPoiDAO csvPoiDAO;
	
	@Override
	public List<PoiObjVO> getImgPoiList(String type) {
		// TODO Auto-generated method stub
		return csvPoiDAO.getImgPoiList(type);
	}

	@Override
	public int insertMemPoiInfo(MemPoiVO vo) {
		// TODO Auto-generated method stub
		return csvPoiDAO.insertMemPoiInfo(vo);
	}

	@Override
	public MemPoiVO getMemberPoiInfo(int dataid) {
		// TODO Auto-generated method stub
		return csvPoiDAO.getMemberPoiInfo(dataid);
	}

	
	
}
