/**
 * 
 */
package com.vision_x.vision_x.apps.service;

/**
 * BuildingModelVO.java
 * digitaltwincloud
 * 2021. 6. 24.
 * @author Khaia
 * @Comment
 *
 */
public class BuildingModelVO {
	private int mlid;
	private int mid;
	
	private String model_type;
	
	private String model_org_file_name;
	private String model_save_file_name;
	
	private String model_save_file_path;
	
	private String texture_org_file_name;
	private String texture_save_file_name;
	
	private String texture_save_file_path;
	
	private String thumb_base64;
	
	private String reg_date;

	public int getMlid() {
		return mlid;
	}

	public void setMlid(int mlid) {
		this.mlid = mlid;
	}

	public int getMid() {
		return mid;
	}

	public void setMid(int mid) {
		this.mid = mid;
	}

	public String getModel_type() {
		return model_type;
	}

	public void setModel_type(String model_type) {
		this.model_type = model_type;
	}

	public String getModel_org_file_name() {
		return model_org_file_name;
	}

	public void setModel_org_file_name(String model_org_file_name) {
		this.model_org_file_name = model_org_file_name;
	}

	public String getModel_save_file_name() {
		return model_save_file_name;
	}

	public void setModel_save_file_name(String model_save_file_name) {
		this.model_save_file_name = model_save_file_name;
	}

	public String getModel_save_file_path() {
		return model_save_file_path;
	}

	public void setModel_save_file_path(String model_save_file_path) {
		this.model_save_file_path = model_save_file_path;
	}

	public String getTexture_org_file_name() {
		return texture_org_file_name;
	}

	public void setTexture_org_file_name(String texture_org_file_name) {
		this.texture_org_file_name = texture_org_file_name;
	}

	public String getTexture_save_file_name() {
		return texture_save_file_name;
	}

	public void setTexture_save_file_name(String texture_save_file_name) {
		this.texture_save_file_name = texture_save_file_name;
	}

	public String getTexture_save_file_path() {
		return texture_save_file_path;
	}

	public void setTexture_save_file_path(String texture_save_file_path) {
		this.texture_save_file_path = texture_save_file_path;
	}

	public String getThumb_base64() {
		return thumb_base64;
	}

	public void setThumb_base64(String thumb_base64) {
		this.thumb_base64 = thumb_base64;
	}

	public String getReg_date() {
		return reg_date;
	}

	public void setReg_date(String reg_date) {
		this.reg_date = reg_date;
	}
	
	
	
}
