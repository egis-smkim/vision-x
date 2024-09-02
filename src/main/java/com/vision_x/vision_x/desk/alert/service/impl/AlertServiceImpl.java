package com.vision_x.vision_x.desk.alert.service.impl;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vision_x.vision_x.desk.alert.service.AlertService;
import com.vision_x.vision_x.desk.alert.service.AlertVO;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("alertService")
public class AlertServiceImpl extends EgovAbstractServiceImpl implements AlertService {
		
	@Autowired
	private AlertDAO alertDAO;

	@Override
	public int insertAlert(AlertVO vo) {
		// TODO Auto-generated method stub
		return alertDAO.insertAlert(vo);
	}

	@Override
	public List<HashMap<String, String>> viewMyAlertList(int mid) {
		// TODO Auto-generated method stub
		return alertDAO.viewMyAlertList(mid);
	}

	@Override
	public HashMap<String, Object> viewMyAlertDetail(int aid) {
		// TODO Auto-generated method stub
		return alertDAO.viewMyAlertDetail(aid);
	}

	@Override
	public List<HashMap<String, String>> recentAlertList(int sessMid) {
		// TODO Auto-generated method stub
		return alertDAO.recentAlertList(sessMid);
	}

	@Override
	public int countNoViewAlert(int sessMid) {
		// TODO Auto-generated method stub
		return alertDAO.countNoViewAlert(sessMid);
	}

	@Override
	public int changeAlertView(AlertVO newAlertVO) {
		// TODO Auto-generated method stub
		return alertDAO.changeAlertView(newAlertVO);
	}

	@Override
	public int changeAlertSelect(AlertVO newAlertVO) {
		// TODO Auto-generated method stub
		return alertDAO.changeAlertSelect(newAlertVO);
	}

	@Override
	public int changeMemberState(int mid) {
		// TODO Auto-generated method stub
		return alertDAO.changeMemberState(mid);
	}
}
