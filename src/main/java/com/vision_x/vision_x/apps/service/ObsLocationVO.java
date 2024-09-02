package com.vision_x.vision_x.apps.service;

public class ObsLocationVO {
	private int org_fid;
	private String shape;
	private String obs_no;
	private String obs_name;
	private double longitude;
	private double latitude;
	public int getOrg_fid() {
		return org_fid;
	}
	public void setOrg_fild(int org_fid) {
		this.org_fid = org_fid;
	}
	public String getShape() {
		return shape;
	}
	public void setShape(String shape) {
		this.shape = shape;
	}
	public String getObs_no() {
		return obs_no;
	}
	public void setObs_no(String obs_no) {
		this.obs_no = obs_no;
	}
	public String getObs_name() {
		return obs_name;
	}
	public void setObs_name(String obs_name) {
		this.obs_name = obs_name;
	}
	public double getLongitude() {
		return longitude;
	}
	public void setLongitude(double longitude) {
		this.longitude = longitude;
	}
	public double getLatitude() {
		return latitude;
	}
	public void setLatitude(double latitude) {
		this.latitude = latitude;
	}
}
