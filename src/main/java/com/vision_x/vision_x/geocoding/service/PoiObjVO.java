package com.vision_x.vision_x.geocoding.service;

public class PoiObjVO {
	
	private int cid;
	private String poi_name;
	private String poi_file_path;
	private String poi_file_url;
	private String poi_texture_url;
	private String poi_model_thumb;
	private String poi_type;
	private String reg_date;
	
	public int getCid() {
		return cid;
	}
	public void setCid(int cid) {
		this.cid = cid;
	}
	public String getPoi_name() {
		return poi_name;
	}
	public void setPoi_name(String poi_name) {
		this.poi_name = poi_name;
	}
	public String getPoi_file_path() {
		return poi_file_path;
	}
	public void setPoi_file_path(String poi_file_path) {
		this.poi_file_path = poi_file_path;
	}
	public String getPoi_file_url() {
		return poi_file_url;
	}
	public void setPoi_file_url(String poi_file_url) {
		this.poi_file_url = poi_file_url;
	}
	public String getPoi_texture_url() {
		return poi_texture_url;
	}
	public void setPoi_texture_url(String poi_texture_url) {
		this.poi_texture_url = poi_texture_url;
	}
	public String getPoi_model_thumb() {
		return poi_model_thumb;
	}
	public void setPoi_model_thumb(String poi_model_thumb) {
		this.poi_model_thumb = poi_model_thumb;
	}
	public String getReg_date() {
		return reg_date;
	}
	public void setReg_date(String reg_date) {
		this.reg_date = reg_date;
	}
	public String getPoi_type() {
		return poi_type;
	}
	public void setPoi_type(String poi_type) {
		this.poi_type = poi_type;
	}
	
}
