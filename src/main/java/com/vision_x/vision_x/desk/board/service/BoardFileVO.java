package com.vision_x.vision_x.desk.board.service;

public class BoardFileVO {
	private int fid;
	
	private int bid;
	
	private String memid;
	
	private String file_type;
	private String org_file_name;
	private String save_file_name;
	private String save_file_url;
	private String save_file_path;
	
	public int getFid() {
		return fid;
	}

	public void setFid(int fid) {
		this.fid = fid;
	}

	public int getBid() {
		return bid;
	}

	public void setBid(int bid) {
		this.bid = bid;
	}

	public String getMemid() {
		return memid;
	}

	public void setMemid(String memid) {
		this.memid = memid;
	}

	public String getFile_type() {
		return file_type;
	}

	public void setFile_type(String file_type) {
		this.file_type = file_type;
	}

	public String getOrg_file_name() {
		return org_file_name;
	}

	public void setOrg_file_name(String org_file_name) {
		this.org_file_name = org_file_name;
	}

	public String getSave_file_name() {
		return save_file_name;
	}

	public void setSave_file_name(String save_file_name) {
		this.save_file_name = save_file_name;
	}

	public String getSave_file_url() {
		return save_file_url;
	}

	public void setSave_file_url(String save_file_url) {
		this.save_file_url = save_file_url;
	}

	public String getSave_file_path() {
		return save_file_path;
	}

	public void setSave_file_path(String save_file_path) {
		this.save_file_path = save_file_path;
	}

	public String getReg_date() {
		return reg_date;
	}

	public void setReg_date(String reg_date) {
		this.reg_date = reg_date;
	}

	public Object getFile() {
		return file;
	}

	public void setFile(Object file) {
		this.file = file;
	}

	private String reg_date;

	private Object file;
	
}
