package com.vision_x.vision_x.admin.service;

/**
 * BackupSettingVO.java
 * digitaltwincloud
 * 2021. 12. 8.
 * @author Khaia
 * @Comment
 *
 */
public class BackupSettingVO {
	private int bid;
	private int mid;
	private String is_app_data;
	private String is_map_data;
	private String is_user_model;
	private String is_wind_data;
	private String state;
	private String last_backup_date;
	private int level;
	private long file_size;
	
	private String reg_date;
	
	/* extra */
	private String mem_name;
	private String mem_id;
	
	
	
	public String getMem_name() {
		return mem_name;
	}
	public void setMem_name(String mem_name) {
		this.mem_name = mem_name;
	}
	public String getMem_id() {
		return mem_id;
	}
	public void setMem_id(String mem_id) {
		this.mem_id = mem_id;
	}
	public int getBid() {
		return bid;
	}
	public void setBid(int bid) {
		this.bid = bid;
	}
	public int getMid() {
		return mid;
	}
	public void setMid(int mid) {
		this.mid = mid;
	}
	public String getIs_app_data() {
		return is_app_data;
	}
	public void setIs_app_data(String is_app_data) {
		this.is_app_data = is_app_data;
	}
	public String getIs_map_data() {
		return is_map_data;
	}
	public void setIs_map_data(String is_map_data) {
		this.is_map_data = is_map_data;
	}
	public String getIs_user_model() {
		return is_user_model;
	}
	public void setIs_user_model(String is_user_model) {
		this.is_user_model = is_user_model;
	}
	public String getIs_wind_data() {
		return is_wind_data;
	}
	public void setIs_wind_data(String is_wind_data) {
		this.is_wind_data = is_wind_data;
	}
	public String getState() {
		return state;
	}
	public void setState(String state) {
		this.state = state;
	}
	public String getLast_backup_date() {
		return last_backup_date;
	}
	public void setLast_backup_date(String last_backup_date) {
		this.last_backup_date = last_backup_date;
	}
	public int getLevel() {
		return level;
	}
	public void setLevel(int level) {
		this.level = level;
	}
	public String getReg_date() {
		return reg_date;
	}
	public void setReg_date(String reg_date) {
		this.reg_date = reg_date;
	}
	public long getFile_size() {
		return file_size;
	}
	public void setFile_size(long file_size) {
		this.file_size = file_size;
	}
	
	
	
	
	
}
