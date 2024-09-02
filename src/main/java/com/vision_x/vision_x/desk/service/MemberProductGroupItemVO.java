/**
 * 
 */
package com.vision_x.vision_x.desk.service;

/**
 * MemberProductGroupItemVO.java
 * digitalTwin
 * 2020. 11. 25.
 * @author Khaia
 * @Comment
 *
 */
public class MemberProductGroupItemVO {

	private int mpgiid; // Product Group Item ID
	private int mid; // Member ID
	private int mpgid; // Product Group ID
	private int pid; // Product ID
	private int mpid; // Member Product ID
	private String state;
	private String reg_date;
	private int cnt;
	
	public int getMpgiid() {
		return mpgiid;
	}
	public void setMpgiid(int mpgiid) {
		this.mpgiid = mpgiid;
	}
	public int getMid() {
		return mid;
	}
	public void setMid(int mid) {
		this.mid = mid;
	}
	public int getMpgid() {
		return mpgid;
	}
	public void setMpgid(int mpgid) {
		this.mpgid = mpgid;
	}
	public int getPid() {
		return pid;
	}
	public void setPid(int pid) {
		this.pid = pid;
	}
	public int getMpid() {
		return mpid;
	}
	public void setMpid(int mpid) {
		this.mpid = mpid;
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
	public int getCnt() {
		return cnt;
	}
	public void setCnt(int cnt) {
		this.cnt = cnt;
	}
	
	
	
}
