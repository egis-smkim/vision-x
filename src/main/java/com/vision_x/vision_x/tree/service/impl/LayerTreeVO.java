package com.vision_x.vision_x.tree.service.impl;

public class LayerTreeVO {

	private int mid;
	private int lgid;
	
	private String name;
	private String group_url;
	private String group_path; 
	private String reg_date;

	public int getMid() {
		return mid;
	}
	public void setMid(int mid) {
		this.mid = mid;
	}
	public int getLgid() {
		return lgid;
	}
	public void setLgid(int lgid) {
		this.lgid = lgid;
	}
	public String getGroup_url() {
		return group_url;
	}
	public void setGroup_url(String group_url) {
		this.group_url = group_url;
	}
	public String getGroup_path() {
		return group_path;
	}
	public void setGroup_path(String group_path) {
		this.group_path = group_path;
	}
	public String getReg_date() {
		return reg_date;
	}
	public void setReg_date(String reg_date) {
		this.reg_date = reg_date;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	
}
