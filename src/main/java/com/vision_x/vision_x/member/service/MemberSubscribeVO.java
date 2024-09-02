package com.vision_x.vision_x.member.service;


/**
 * MemberSubscribeVO.java
 * digitalTwin
 * 2023. 09. 26.
 * @author yebin
 * @Comment
 *
 */

public class MemberSubscribeVO {
	
	private int msid;
	private int mid;
	private int sid;
	
	private String cancle_date;
	private String cancle_info;
	
	private int state;
	
	private String reg_date;
	
	public int getMsid() {
		return msid;
	}

	public void setMsid(int msid) {
		this.msid = msid;
	}

	public int getMid() {
		return mid;
	}

	public void setMid(int mid) {
		this.mid = mid;
	}

	public int getSid() {
		return sid;
	}

	public void setSid(int sid) {
		this.sid = sid;
	}

	public String getCancle_date() {
		return cancle_date;
	}

	public void setCancle_date(String cancle_date) {
		this.cancle_date = cancle_date;
	}

	public String getCancle_info() {
		return cancle_info;
	}

	public void setCancle_info(String cancle_info) {
		this.cancle_info = cancle_info;
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


}
