/**
 * 
 */
package com.vision_x.vision_x.desk.developer.service;

/**
 * ModuleExtVO.java
 * digitalTwin
 * 2020. 11. 16.
 * @author Khaia
 * @Comment
 *
 */
public class ModuleExtVO {
	private int meid;
	private int mdid;
	
	private String file_type;
	private String file_name;
	
	private String file_url;
	
	private String reg_date;

	public int getMeid() {
		return meid;
	}

	public void setMeid(int meid) {
		this.meid = meid;
	}

	public int getMdid() {
		return mdid;
	}

	public void setMdid(int mdid) {
		this.mdid = mdid;
	}

	public String getFile_type() {
		return file_type;
	}

	public void setFile_type(String file_type) {
		this.file_type = file_type;
	}

	public String getFile_url() {
		return file_url;
	}

	public void setFile_url(String file_url) {
		this.file_url = file_url;
	}

	public String getReg_date() {
		return reg_date;
	}

	public void setReg_date(String reg_date) {
		this.reg_date = reg_date;
	}

	public String getFile_name() {
		return file_name;
	}

	public void setFile_name(String file_name) {
		this.file_name = file_name;
	}
	
	
	
}
