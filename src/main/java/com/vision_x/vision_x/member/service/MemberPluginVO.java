package com.vision_x.vision_x.member.service;

import java.util.UUID;

public class MemberPluginVO {
	
	private int appkid;
	private int mid;
	private String app_key_uuid;
	private String app_key;
	private String app_desc;
	private String ip;
	private String reg_date;
	private String app_name;
	private String app_key_flag;
	
	public int getAppkid() {
		return appkid;
	}
	public void setAppkid(int appkid) {
		this.appkid = appkid;
	}
	public int getMid() {
		return mid;
	}
	public void setMid(int mid) {
		this.mid = mid;
	}
	public String getApp_key_uuid() {
		return app_key_uuid;
	}
	public void setApp_key_uuid() {
		
		this.app_key_uuid = this.makeUUID(); //uuid를 만들어서 
	}
	public String getApp_key() {
		return app_key;
	}
	public void setApp_key(String app_key) {
		this.app_key = app_key;
	}
	public String getApp_desc() {
		return app_desc;
	}
	public void setApp_desc(String app_desc) {
		this.app_desc = app_desc;
	}
	public String getIp() {
		return ip;
	}
	public void setIp(String ip) {
		this.ip = ip;
	}
	public String getReg_date() {
		return reg_date;
	}
	public void setReg_date(String reg_date) {
		this.reg_date = reg_date;
	}
	
	public String getApp_name() {
		return app_name;
	}
	public void setApp_name(String app_name) {
		this.app_name = app_name;
	}
	
	public String getApp_key_flag() {
		return app_key_flag;
	}
	public void setApp_key_flag(String app_key_flag) {
		this.app_key_flag = app_key_flag;
	}
	private String makeUUID() {
		return UUID.randomUUID().toString().replace("-", "").substring(0, 6);
	}
	@Override
	public String toString() {
		return "MemberPluginVO [appkid=" + appkid + ", mid=" + mid + ", app_key_uuid=" + app_key_uuid + ", app_key="
				+ app_key + ", app_desc=" + app_desc + ", ip=" + ip + ", reg_date=" + reg_date + ", app_name="
				+ app_name + ", app_key_flag=" + app_key_flag + "]";
	}
	
}