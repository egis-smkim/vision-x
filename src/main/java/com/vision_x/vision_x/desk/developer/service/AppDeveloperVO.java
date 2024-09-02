/**
 * 
 */
package com.vision_x.vision_x.desk.developer.service;

/**
 * AppDeveloperVO.java
 * digitaltwincloud
 * 2021. 12. 28.
 * @author Khaia
 * @Comment
 *
 */
public class AppDeveloperVO {
	private int adid;
	private int mid;
	private String developer_type;
	private String developer_name;
	private String developer_tel;
	private String developer_email;
	private String developer_homepage;
	private String developer_about;
	private String developer_logo_url;
	private String developer_logo_path;
	private String state;
	private String reg_date;
	
	private int cnt;
	
	
	
	public int getCnt() {
		return cnt;
	}



	public void setCnt(int cnt) {
		this.cnt = cnt;
	}



	public int getAdid() {
		return adid;
	}
	
	
	
	public int getMid() {
		return mid;
	}



	public void setMid(int mid) {
		this.mid = mid;
	}



	public void setAdid(int adid) {
		this.adid = adid;
	}
	public String getDeveloper_type() {
		return developer_type;
	}
	public void setDeveloper_type(String developer_type) {
		this.developer_type = developer_type;
	}
	public String getDeveloper_name() {
		return developer_name;
	}
	public void setDeveloper_name(String developer_name) {
		this.developer_name = developer_name;
	}
	public String getDeveloper_tel() {
		return developer_tel;
	}
	public void setDeveloper_tel(String developer_tel) {
		this.developer_tel = developer_tel;
	}
	public String getDeveloper_email() {
		return developer_email;
	}
	public void setDeveloper_email(String developer_email) {
		this.developer_email = developer_email;
	}
	public String getDeveloper_homepage() {
		return developer_homepage;
	}
	public void setDeveloper_homepage(String developer_homepage) {
		this.developer_homepage = developer_homepage;
	}
	public String getDeveloper_about() {
		return developer_about;
	}
	public void setDeveloper_about(String developer_about) {
		this.developer_about = developer_about;
	}
	public String getDeveloper_logo_url() {
		return developer_logo_url;
	}
	public void setDeveloper_logo_url(String developer_logo_url) {
		this.developer_logo_url = developer_logo_url;
	}
	public String getDeveloper_logo_path() {
		return developer_logo_path;
	}
	public void setDeveloper_logo_path(String developer_logo_path) {
		this.developer_logo_path = developer_logo_path;
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
	
	
}
