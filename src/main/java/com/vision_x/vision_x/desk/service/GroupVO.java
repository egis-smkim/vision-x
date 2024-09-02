package com.vision_x.vision_x.desk.service;

import org.apache.commons.lang.builder.ToStringBuilder;

public class GroupVO {
	private int gid;
	private int group_num;
	private String group_name;
	private int group_master;
	private String group_master_id;
	private String group_member_id;
	private String group_info;
	
	private int state;
	private String reg_date;
	
	// Mixed
	private int dlid;
	private int mid;
	private int rank;
	
	private int gmid;
	private int m_count;
	private int m_rank;
	private int m_mid;
	

	public int getMid() {
		return mid;
	}

	public void setMid(int mid) {
		this.mid = mid;
	}

	public int getDlid() {
		return dlid;
	}

	public void setDlid(int dlid) {
		this.dlid = dlid;
	}

	public int getGid() {
		return gid;
	}

	public void setGid(int gid) {
		this.gid = gid;
	}
	
	public int getGroup_num() {
		return group_num;
	}
	
	public void setGroup_num(int group_num) {
		this.group_num = group_num;
	}

	public String getGroup_name() {
		return group_name;
	}

	public void setGroup_name(String group_name) {
		this.group_name = group_name;
	}

	public String getGroup_info() {
		return group_info;
	}

	public void setGroup_info(String group_info) {
		this.group_info = group_info;
	}

	public int getState() {
		return state;
	}

	public void setState(int state) {
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


	public int getM_rank() {
		return m_rank;
	}

	public void setM_rank(int m_rank) {
		this.m_rank = m_rank;
	}

	public int getM_count() {
		return m_count;
	}

	public void setM_count(int m_count) {
		this.m_count = m_count;
	}

	public int getM_mid() {
		return m_mid;
	}

	public void setM_mid(int m_mid) {
		this.m_mid = m_mid;
	}

	public int getRank() {
		return rank;
	}

	public void setRank(int rank) {
		this.rank = rank;
	}

	public int getGroup_master() {
		return group_master;
	}

	public void setGroup_master(int group_master) {
		this.group_master = group_master;
	}

	public String getGroup_master_id() {
		return group_master_id;
	}

	public void setGroup_master_id(String group_master_id) {
		this.group_master_id = group_master_id;
	}

	public String getGroup_member_id() {
		return group_member_id;
	}

	public void setGroup_member_id(String group_member_id) {
		this.group_member_id = group_member_id;
	}

	public int getGmid() {
		return gmid;
	}

	public void setGmid(int gmid) {
		this.gmid = gmid;
	}
}
