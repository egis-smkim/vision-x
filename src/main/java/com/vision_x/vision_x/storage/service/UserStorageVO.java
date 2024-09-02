package com.vision_x.vision_x.storage.service;

public class UserStorageVO {

	private int storage_id;
	private int system_id;
	private int volume_size;
	private int use_size;
	private String origin_mount_path;
	private String mount_directory;
	private String dir_url;
	private String use_status;
	private String reg_date;
	private String host_name;
	private String host_ip;
	
	public int getStorage_id() {
		return storage_id;
	}
	public void setStorage_id(int storage_id) {
		this.storage_id = storage_id;
	}
	public int getSystem_id() {
		return system_id;
	}
	public void setSystem_id(int system_id) {
		this.system_id = system_id;
	}
	public int getVolume_size() {
		return volume_size;
	}
	public void setVolume_size(int volume_size) {
		this.volume_size = volume_size;
	}
	public int getUse_size() {
		return use_size;
	}
	public void setUse_size(int use_size) {
		this.use_size = use_size;
	}
	public String getOrigin_mount_path() {
		return origin_mount_path;
	}
	public void setOrigin_mount_path(String origin_mount_path) {
		this.origin_mount_path = origin_mount_path;
	}
	public String getMount_directory() {
		return mount_directory;
	}
	public void setMount_directory(String mount_directory) {
		this.mount_directory = mount_directory;
	}
	public String getDir_url() {
		return dir_url;
	}
	public void setDir_url(String dir_url) {
		this.dir_url = dir_url;
	}
	public String getUse_status() {
		return use_status;
	}
	public void setUse_status(String use_status) {
		this.use_status = use_status;
	}
	public String getReg_date() {
		return reg_date;
	}
	public String getHost_name() {
		return host_name;
	}
	public void setHost_name(String host_name) {
		this.host_name = host_name;
	}
	public String getHost_ip() {
		return host_ip;
	}
	public void setHost_ip(String host_ip) {
		this.host_ip = host_ip;
	}
	public void setReg_date(String reg_date) {
		this.reg_date = reg_date;
	}
	
	
}
