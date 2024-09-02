package com.vision_x.vision_x.admin.service;

import org.apache.commons.lang.builder.ToStringBuilder;

public class CollaborationVO {
	private int dlid;
	private String com_name;
	private String com_ceo;
	private String com_regist_num;
	private String com_tel;
	private String com_email;
	private String com_homepage;
	
	private String com_info;
	
	private String dev_type;

	private String logo_url;
	
	private String state;
	private String reg_date;
	
	

	public String getDev_type() {
		return dev_type;
	}

	public void setDev_type(String dev_type) {
		this.dev_type = dev_type;
	}

	public int getDlid() {
		return dlid;
	}

	public void setDlid(int dlid) {
		this.dlid = dlid;
	}

	public String getCom_name() {
		return com_name;
	}

	public void setCom_name(String com_name) {
		this.com_name = com_name;
	}

	public String getCom_ceo() {
		return com_ceo;
	}

	public void setCom_ceo(String com_ceo) {
		this.com_ceo = com_ceo;
	}

	public String getCom_regist_num() {
		return com_regist_num;
	}

	public void setCom_regist_num(String com_regist_num) {
		this.com_regist_num = com_regist_num;
	}

	public String getCom_tel() {
		return com_tel;
	}

	public void setCom_tel(String com_tel) {
		this.com_tel = com_tel;
	}

	public String getCom_email() {
		return com_email;
	}

	public void setCom_email(String com_email) {
		this.com_email = com_email;
	}

	public String getCom_homepage() {
		return com_homepage;
	}

	public void setCom_homepage(String com_homepage) {
		this.com_homepage = com_homepage;
	}

	public String getCom_info() {
		return com_info;
	}

	public void setCom_info(String com_info) {
		this.com_info = com_info;
	}

	public String getLogo_url() {
		return logo_url;
	}

	public void setLogo_url(String logo_url) {
		this.logo_url = logo_url;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getReg_date() {
		return reg_date;
	}

	public void setReg_date(String reg_date) {
		this.reg_date = reg_date;
	}

	public String toString() {
        return ToStringBuilder.reflectionToString(this);
    }
}
