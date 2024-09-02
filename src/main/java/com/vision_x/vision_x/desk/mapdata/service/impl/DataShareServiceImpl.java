package com.vision_x.vision_x.desk.mapdata.service.impl;

import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.vision_x.vision_x.desk.mapdata.service.DataShareService;
import com.vision_x.vision_x.desk.mapdata.service.DataShareVO;
import com.vision_x.vision_x.member.service.MemberVO;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("dataShareService")
public class DataShareServiceImpl extends EgovAbstractServiceImpl implements DataShareService {
	
	@Resource(name="dataShareDAO")
	private DataShareDAO dataShareDAO;
	
	@Override
	public int insertDataShare(DataShareVO dataShareVO) {
		// TODO Auto-generated method stub
		return dataShareDAO.insertDataShare(dataShareVO);
	}
	@Override
	public int updateDataShare(DataShareVO dataShareVO) {
		// TODO Auto-generated method stub
		return dataShareDAO.updateDataShare(dataShareVO);
	}
	@Override
	public int deleteDataShare(DataShareVO dataShareVO) {
		// TODO Auto-generated method stub
		return dataShareDAO.deleteDataShare(dataShareVO);
	}
	@Override
	public List<DataShareVO> getDataShareInfo(HashMap<String, Object> param) {
		// TODO Auto-generated method stub
		return dataShareDAO.getDataShareInfo(param);
	}
	@Override
	public List<DataShareVO> getDataShareForAll() {
		// TODO Auto-generated method stub
		return dataShareDAO.getDataShareForAll();
	}
	@Override
	public List<DataShareVO> getDataShareForMid(MemberVO mvo) {
		// TODO Auto-generated method stub
		return dataShareDAO.getDataShareForMid(mvo);
	}
	@Override
	public List<DataShareVO> selectCheckRequst(MemberVO mvo) {
		// TODO Auto-generated method stub
		return dataShareDAO.selectCheckRequst(mvo);
	}
	@Override
	public List<DataShareVO> getDataShareForGid(HashMap<String, Object> param) {
		// TODO Auto-generated method stub
		return dataShareDAO.getDataShareForGid(param);
	}
}
