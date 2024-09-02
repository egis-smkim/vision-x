package com.vision_x.vision_x.desk.mapdata.service.impl;

import java.util.HashMap;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.vision_x.vision_x.desk.mapdata.service.DataShareVO;
import com.vision_x.vision_x.member.service.MemberVO;

import egovframework.rte.psl.dataaccess.EgovAbstractMapper;

@Repository("dataShareDAO")
public class DataShareDAO extends EgovAbstractMapper {
	
	public int insertDataShare(DataShareVO dataShareVO) {
		return insert("dataShareDAO.insertDataShare", dataShareVO);
	}
	public int updateDataShare(DataShareVO dataShareVO) {
		return update("dataShareDAO.updateDataShare", dataShareVO);
	}
	public int deleteDataShare(DataShareVO dataShareVO) {
		return delete("dataShareDAO.deleteDataShare", dataShareVO);
	}
	public List<DataShareVO> getDataShareInfo(HashMap<String, Object> param) {
		return selectList("dataShareDAO.getDataShareInfo", param);
	}
	public List<DataShareVO> getDataShareForAll() {
		return selectList("dataShareDAO.getDataShareForAll");
	}
	public List<DataShareVO> getDataShareForMid(MemberVO mvo) {
		return selectList("dataShareDAO.getDataShareForMid", mvo);
	}
	public List<DataShareVO> getDataShareForGid(HashMap<String, Object> param) {
		return selectList("dataShareDAO.getDataShareForGid", param);
	}
	public List<DataShareVO> selectCheckRequst(MemberVO mvo) {
		return selectList("dataShareDAO.selectCheckRequst", mvo);
	}
}
