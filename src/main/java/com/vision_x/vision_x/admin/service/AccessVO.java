package com.vision_x.vision_x.admin.service;

import org.apache.commons.lang.builder.ToStringBuilder;

public class AccessVO {
	private int aid;
	private int mid;
	
	private String url;
	private int depth;
	
	private String page_code;
	
	private int level;
	
	private String history;
	
	private String last_modify;
	private String reg_date;

	public int getAid() {
		return aid;
	}

	public void setAid(int aid) {
		this.aid = aid;
	}

	public int getMid() {
		return mid;
	}

	public void setMid(int mid) {
		this.mid = mid;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getPage_code() {
		return page_code;
	}

	public void setPage_code(String page_code) {
		this.page_code = page_code;
	}

	public int getLevel() {
		return level;
	}

	public void setLevel(int level) {
		this.level = level;
	}

	public String getReg_date() {
		return reg_date;
	}

	public void setReg_date(String reg_date) {
		this.reg_date = reg_date;
	}
	
	
	
	public int getDepth() {
		return depth;
	}

	public void setDepth(int depth) {
		this.depth = depth;
	}

	public String getHistory() {
		return history;
	}

	public void setHistory(String history) {
		this.history = history;
	}

	public String getLast_modify() {
		return last_modify;
	}

	public void setLast_modify(String last_modify) {
		this.last_modify = last_modify;
	}

	public String toString() {
        return ToStringBuilder.reflectionToString(this);
    }
}
