/**
 * 
 */
package com.vision_x.vision_x.admin.service;

/**
 * AnalysisItemFileVO.java
 * digitaltwincloud
 * 2022. 3. 22.
 * @author Khaia
 * @Comment
 *
 */
public class AnalysisItemFileVO {
	private int fid;
	private int aindx;
	
	private String file_type;
	private String file_nm;
	private String file_dir;
	private String file_rel_dir;
	private String reg_date;
	public int getFid() {
		return fid;
	}
	public void setFid(int fid) {
		this.fid = fid;
	}
	public int getAindx() {
		return aindx;
	}
	public void setAindx(int aindx) {
		this.aindx = aindx;
	}
	public String getFile_type() {
		return file_type;
	}
	public void setFile_type(String file_type) {
		this.file_type = file_type;
	}
	public String getFile_nm() {
		return file_nm;
	}
	public void setFile_nm(String file_nm) {
		this.file_nm = file_nm;
	}
	public String getFile_dir() {
		return file_dir;
	}
	public void setFile_dir(String file_dir) {
		this.file_dir = file_dir;
	}
	public String getFile_rel_dir() {
		return file_rel_dir;
	}
	public void setFile_rel_dir(String file_rel_dir) {
		this.file_rel_dir = file_rel_dir;
	}
	public String getReg_date() {
		return reg_date;
	}
	public void setReg_date(String reg_date) {
		this.reg_date = reg_date;
	}
	
	
	
}
