package com.vision_x.vision_x.member.service;

import java.io.Serializable;

import org.apache.commons.lang.builder.ToStringBuilder;

/**
 * MemberVO.java
 * digitalTwin
 * 2020. 10. 20.
 * @author Khaia
 * @Comment
 *
 */
public class MemberVO implements Serializable {

	/**
	 *
	 */
	private static final long serialVersionUID = 1L;
	
	private int mid;
	private int gid;
	private int dlid;
	
	private int mpgid;
	
	private String mem_id;
	private String mem_name;
	private String g_name;
	private String mem_email;
	private String mem_password;
	
	private String mem_state;
	private int mem_level;
	private String mem_thumb;
	private int mem_join_type;
	
	private String mem_geo_db;
	private String mem_data_db;
	
	private int login_count;
	private String last_login;
	private String reg_date;
	private String last_update;
	private String mem_profile_img;
	private int temp_pwd_flag;
	private String mem_authkey;
	private int mem_otp_flag;
	private Long mem_userstorage;
	private String last_update_pwd;
	
	public int getMid() {
		return mid;
	}
	public void setMid(int mid) {
		this.mid = mid;
	}
	public int getGid() {
		return gid;
	}
	public void setGid(int gid) {
		this.gid = gid;
	}
	public int getDlid() {
		return dlid;
	}
	public void setDlid(int dlid) {
		this.dlid = dlid;
	}
	public String getMem_id() {
		return mem_id;
	}
	public void setMem_id(String mem_id) {
		this.mem_id = mem_id;
	}
	public String getG_name() {
		return g_name;
	}
	public void setG_name(String g_name) {
		this.g_name = g_name;
	}
	public String getMem_name() {
		return mem_name;
	}
	public void setMem_name(String mem_name) {
		this.mem_name = mem_name;
	}
	public String getMem_email() {
		return mem_email;
	}
	public void setMem_email(String mem_email) {
		this.mem_email = mem_email;
	}
	public String getMem_password() {
		return mem_password;
	}
	public void setMem_password(String mem_password) {
		this.mem_password = mem_password;
	}
	public String getMem_state() {
		return mem_state;
	}
	public void setMem_state(String mem_state) {
		this.mem_state = mem_state;
	}
	public int getMem_level() {
		return mem_level;
	}
	public void setMem_level(int mem_level) {
		this.mem_level = mem_level;
	}
	public String getMem_thumb() {
		return mem_thumb;
	}
	public void setMem_thumb(String mem_thumb) {
		this.mem_thumb = mem_thumb;
	}
	public int getMem_join_type() {
		return mem_join_type;
	}
	public void setMem_join_type(int mem_join_type) {
		this.mem_join_type = mem_join_type;
	}
	public String getMem_geo_db() {
		return mem_geo_db;
	}
	public void setMem_geo_db(String mem_geo_db) {
		this.mem_geo_db = mem_geo_db;
	}
	public String getMem_data_db() {
		return mem_data_db;
	}
	public void setMem_data_db(String mem_data_db) {
		this.mem_data_db = mem_data_db;
	}
	public int getLogin_count() {
		return login_count;
	}
	public void setLogin_count(int login_count) {
		this.login_count = login_count;
	}
	public String getLast_login() {
		return last_login;
	}
	public void setLast_login(String last_login) {
		this.last_login = last_login;
	}
	public String getReg_date() {
		return reg_date;
	}
	public void setReg_date(String reg_date) {
		this.reg_date = reg_date;
	}

	public int getMpgid() {
		return mpgid;
	}
	public void setMpgid(int mpgid) {
		this.mpgid = mpgid;
	}
	public String toString() {
        return ToStringBuilder.reflectionToString(this);
    }
	public String getLast_update() {
		return last_update;
	}
	public void setLast_update(String last_update) {
		this.last_update = last_update;
	}
	public String getMem_profile_img() {
		return mem_profile_img;
	}
	public void setMem_profile_img(String mem_profile_img) {
		this.mem_profile_img = mem_profile_img;
	}
	public int getTemp_pwd_flag() {
		return temp_pwd_flag;
	}
	public void setTemp_pwd_flag(int temp_pwd_flag) {
		this.temp_pwd_flag = temp_pwd_flag;
	}
	public String getMem_authkey() {
		return mem_authkey;
	}
	public void setMem_authkey(String mem_authkey) {
		this.mem_authkey = mem_authkey;
	}
	public int getMem_otp_flag() {
		return mem_otp_flag;
	}
	public void setMem_otp_flag(int mem_otp_flag) {
		this.mem_otp_flag = mem_otp_flag;
	}
	public Long getMem_userstorage() {
		return mem_userstorage;
	}
	public void setMem_userstorage(Long mem_userstorage) {
		this.mem_userstorage = mem_userstorage;
	}
	public String getLast_update_pwd() {
		return last_update_pwd;
	}
	public void setLast_update_pwd(String last_update_pwd) {
		this.last_update_pwd = last_update_pwd;
	}
}