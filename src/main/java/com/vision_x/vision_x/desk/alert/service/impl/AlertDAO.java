package com.vision_x.vision_x.desk.alert.service.impl;

import java.util.HashMap;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.vision_x.vision_x.desk.alert.service.AlertVO;

import egovframework.rte.psl.dataaccess.EgovAbstractMapper;

@Repository("alertDAO")
public class AlertDAO extends EgovAbstractMapper{

	public int insertAlert(AlertVO vo) {
		// TODO Auto-generated method stub
		return insert("alertDAO.insertAlert", vo);
	}

	public List<HashMap<String, String>> viewMyAlertList(int mid) {
		// TODO Auto-generated method stub
		return selectList("alertDAO.viewMyAlertList", mid);
	}

	public HashMap<String, Object> viewMyAlertDetail(int aid) {
		// TODO Auto-generated method stub
		return selectOne("alertDAO.viewMyAlertDetail", aid);
	}

	public List<HashMap<String, String>> recentAlertList(int sessMid) {
		// TODO Auto-generated method stub
		return selectList("alertDAO.recentAlertList", sessMid);
	}

	public int countNoViewAlert(int sessMid) {
		// TODO Auto-generated method stub
		return selectOne("alertDAO.countNoViewAlert", sessMid);
	}

	public int changeAlertView(AlertVO newAlertVO) {
		// TODO Auto-generated method stub
		return update("alertDAO.changeAlertView", newAlertVO);
	}

	public int changeAlertSelect(AlertVO newAlertVO) {
		// TODO Auto-generated method stub
		return update("alertDAO.changeAlertSelect", newAlertVO);
	}

	public int changeMemberState(int mid) {
		// TODO Auto-generated method stub
		return update("alertDAO.changeMemberState", mid);
	}

}
