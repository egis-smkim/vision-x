package com.vision_x.vision_x.utils;

public class ProjVO {
	
	private int srid;
	private String auth_name;
	private int auth_srid;
	private String srtext;
	private String proj4text;
	private String crs_name;
	
	public int getSrid() {
		return srid;
	}
	public void setSrid(int srid) {
		this.srid = srid;
	}
	public String getAuth_name() {
		return auth_name;
	}
	public void setAuth_name(String auth_name) {
		this.auth_name = auth_name;
	}
	public int getAuth_srid() {
		return auth_srid;
	}
	public void setAuth_srid(int auth_srid) {
		this.auth_srid = auth_srid;
	}
	public String getSrtext() {
		return srtext;
	}
	public void setSrtext(String srtext) {
		this.srtext = srtext;
	}
	public String getProj4text() {
		return proj4text;
	}
	public void setProj4text(String proj4text) {
		this.proj4text = proj4text;
	}
	public String getCrs_name() {
		return crs_name;
	}
	public void setCrs_name(String crs_name) {
		this.crs_name = crs_name;
	}
	
	
}
