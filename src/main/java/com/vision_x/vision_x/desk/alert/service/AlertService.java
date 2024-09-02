package com.vision_x.vision_x.desk.alert.service;

import java.util.HashMap;
import java.util.List;

public interface AlertService {
	
    public int insertAlert(AlertVO vo);
    
    public List<HashMap<String, String>> viewMyAlertList(int mid);
    
    public HashMap<String, Object> viewMyAlertDetail(int aid);

	public List<HashMap<String, String>> recentAlertList(int sessMid);

	public int countNoViewAlert(int sessMid);

	public int changeAlertView(AlertVO newAlertVO);

	public int changeAlertSelect(AlertVO newAlertVO);

	public int changeMemberState(int mid);
}
