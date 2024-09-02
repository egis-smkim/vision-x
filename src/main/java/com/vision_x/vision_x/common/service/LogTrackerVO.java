/**
 * 
 */
package com.vision_x.vision_x.common.service;

/**
 * LogTrackerVO.java
 * digitaltwincloud
 * 2022. 3. 29.
 * @author Khaia
 * @Comment
 *
 */
public class LogTrackerVO {
	private int tid;
	private int mid;
	private int gid;
	private int dlid;
	
	private String log_code;
	
	private int log_level;
	
	private String message;
	
	private String reg_date;
	
	private String mem_id;
	
	private String ip;
	//기본생성자
	public LogTrackerVO(){
		
	}
	//커스텀 생성자
	public LogTrackerVO(int mid,int gid,int dlid,String log_code,int log_level,String message){
		this.mid=mid;
		this.gid=gid;
		this.dlid=dlid;
		this.log_code=log_code;
		this.log_level=log_level;
		this.message=message;
	}
	
	public String getMem_id() {
		return mem_id;
	}

	public void setMem_id(String mem_id) {
		this.mem_id = mem_id;
	}
	
	public int getLog_level() {
		return log_level;
	}

	public void setLog_level(int log_level) {
		this.log_level = log_level;
	}

	public int getTid() {
		return tid;
	}

	public void setTid(int tid) {
		this.tid = tid;
	}

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

	public String getLog_code() {
		return log_code;
	}

	public void setLog_code(String log_code) {
		this.log_code = log_code;
	}


	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public String getReg_date() {
		return reg_date;
	}

	public void setReg_date(String reg_date) {
		this.reg_date = reg_date;
	}
	public String getIp() {
		return ip;
	}
	public void setIp(String ip) {
		this.ip = ip;
	}
	
	
}
