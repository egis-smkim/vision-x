/**
 * 
 */
package com.vision_x.vision_x.admin.service;

/**
 * SiteSetupVO.java
 * digitaltwincloud
 * 2021. 8. 10.
 * @author Khaia
 * @Comment
 *
 */
public class DomainSetupVO {
	private int dsid;
	
	private String domain_host;
	private String domain_url;
	
	private String site_name;
	private String com_name;
	
	/*
		0 : 좌, 우하단
		1 : 좌측만 표시
		2 : 우하단만 표시
	*/
	private int logo_batch_type;
	
	private String left_logo_url;
	private String bottom_logo_url;
	
	private String login_text;
	private String login_com_name;
	private String login_logo_url;
	
	private String reg_date;
	private String modify_date;
	
	private int state;
	
	private String target_logo;
	
	
	
	
	
	public String getTarget_logo() {
		return target_logo;
	}
	public void setTarget_logo(String target_logo) {
		this.target_logo = target_logo;
	}
	public int getState() {
		return state;
	}
	public void setState(int state) {
		this.state = state;
	}
	public int getDsid() {
		return dsid;
	}
	public void setDsid(int dsid) {
		this.dsid = dsid;
	}
	public String getDomain_host() {
		return domain_host;
	}
	public void setDomain_host(String domain_host) {
		this.domain_host = domain_host;
	}
	public String getDomain_url() {
		return domain_url;
	}
	public void setDomain_url(String domain_url) {
		this.domain_url = domain_url;
	}
	public String getSite_name() {
		return site_name;
	}
	public void setSite_name(String site_name) {
		this.site_name = site_name;
	}
	public String getCom_name() {
		return com_name;
	}
	public void setCom_name(String com_name) {
		this.com_name = com_name;
	}
	
	
	
	public int getLogo_batch_type() {
		return logo_batch_type;
	}
	public void setLogo_batch_type(int logo_batch_type) {
		this.logo_batch_type = logo_batch_type;
	}
	public String getLeft_logo_url() {
		return left_logo_url;
	}
	public void setLeft_logo_url(String left_logo_url) {
		this.left_logo_url = left_logo_url;
	}
	public String getBottom_logo_url() {
		return bottom_logo_url;
	}
	public void setBottom_logo_url(String bottom_logo_url) {
		this.bottom_logo_url = bottom_logo_url;
	}

	public String getLogin_logo_url() {
		return login_logo_url;
	}
	public void setLogin_logo_url(String login_logo_url) {
		this.login_logo_url = login_logo_url;
	}
	public String getReg_date() {
		return reg_date;
	}
	public void setReg_date(String reg_date) {
		this.reg_date = reg_date;
	}
	public String getModify_date() {
		return modify_date;
	}
	public void setModify_date(String modify_date) {
		this.modify_date = modify_date;
	}
	public String getLogin_text() {
		return login_text;
	}
	public void setLogin_text(String login_text) {
		this.login_text = login_text;
	}
	public String getLogin_com_name() {
		return login_com_name;
	}
	public void setLogin_com_name(String login_com_name) {
		this.login_com_name = login_com_name;
	}
	
	
	
}
