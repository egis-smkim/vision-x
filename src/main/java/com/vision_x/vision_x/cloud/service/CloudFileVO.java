/**
 * 
 */
package com.vision_x.vision_x.cloud.service;

/**
 * FileVO.java
 * digitalTwin
 * 2021. 2. 26.
 * @author Khaia
 * @Comment
 *
 */
public class CloudFileVO {
	private int fid;
	private int mid;
	private int dataid;
	
	private String file_name;
	private int file_size;
	private String file_url;
	private String file_path;
	private String file_type;
	private String hdfs_url;
	private String hdfs_path;
	
	private String file_thumb_url;
	private String file_thumb_path;
	
	private String file_link_url;
	private String file_link_path;
	
	private String reg_date;

	public int getFid() {
		return fid;
	}

	public void setFid(int fid) {
		this.fid = fid;
	}

	public int getMid() {
		return mid;
	}

	public void setMid(int mid) {
		this.mid = mid;
	}

	public int getDataid() {
		return dataid;
	}

	public void setDataid(int dataid) {
		this.dataid = dataid;
	}

	public String getFile_name() {
		return file_name;
	}

	public void setFile_name(String file_name) {
		this.file_name = file_name;
	}

	public int getFile_size() {
		return file_size;
	}

	public void setFile_size(int file_size) {
		this.file_size = file_size;
	}

	public String getFile_url() {
		return file_url;
	}

	public void setFile_url(String file_url) {
		this.file_url = file_url;
	}

	public String getFile_path() {
		return file_path;
	}

	public void setFile_path(String file_path) {
		this.file_path = file_path;
	}

	public String getHdfs_url() {
		return hdfs_url;
	}

	public void setHdfs_url(String hdfs_url) {
		this.hdfs_url = hdfs_url;
	}

	public String getHdfs_path() {
		return hdfs_path;
	}

	public void setHdfs_path(String hdfs_path) {
		this.hdfs_path = hdfs_path;
	}

	public String getFile_thumb_url() {
		return file_thumb_url;
	}

	public void setFile_thumb_url(String file_thumb_url) {
		this.file_thumb_url = file_thumb_url;
	}

	public String getFile_thumb_path() {
		return file_thumb_path;
	}

	public void setFile_thumb_path(String file_thumb_path) {
		this.file_thumb_path = file_thumb_path;
	}

	public String getFile_link_url() {
		return file_link_url;
	}

	public void setFile_link_url(String file_link_url) {
		this.file_link_url = file_link_url;
	}

	public String getFile_link_path() {
		return file_link_path;
	}

	public void setFile_link_path(String file_link_path) {
		this.file_link_path = file_link_path;
	}

	public String getReg_date() {
		return reg_date;
	}

	public void setReg_date(String reg_date) {
		this.reg_date = reg_date;
	}

	public String getFile_type() {
		return file_type;
	}

	public void setFile_type(String file_type) {
		this.file_type = file_type;
	}
	
	
	
}
