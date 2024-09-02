package com.vision_x.vision_x.desk.board.service;

public class BoardContentVO {

	private int bid;
	private int bmid;
	private String memid;
	private String title;
	private String content;
	
	private int is_file;
	
	private String reg_date;
	private String update_date;
	private int view_cnt;
	private int cmt_cnt;
	private String brackets;
	
	
	private int rownum;
	
	private int next_bid;
	private int prev_bid;
	private String next_title;
	private String prev_title;
	
	
	
	public int getBid() {
		return bid;
	}
	public void setBid(int bid) {
		this.bid = bid;
	}
	public int getBmid() {
		return bmid;
	}
	public void setBmid(int bmid) {
		this.bmid = bmid;
	}
	public String getMemid() {
		return memid;
	}
	public void setMemid(String memid) {
		this.memid = memid;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	
	public int getIs_file() {
		return is_file;
	}
	public void setIs_file(int is_file) {
		this.is_file = is_file;
	}

	public String getReg_date() {
		return reg_date;
	}
	public void setReg_date(String reg_date) {
		this.reg_date = reg_date;
	}
	public String getUpdate_date() {
		return update_date;
	}
	public void setUpdate_date(String update_date) {
		this.update_date = update_date;
	}
	public int getView_cnt() {
		return view_cnt;
	}
	public void setView_cnt(int view_cnt) {
		this.view_cnt = view_cnt;
	}
	public int getCmt_cnt() {
		return cmt_cnt;
	}
	public void setCmt_cnt(int cmt_cnt) {
		this.cmt_cnt = cmt_cnt;
	}
	public int getRownum() {
		return rownum;
	}
	public void setRownum(int rownum) {
		this.rownum = rownum;
	}
	public int getNext_bid() {
		return next_bid;
	}
	public void setNext_bid(int next_bid) {
		this.next_bid = next_bid;
	}
	public int getPrev_bid() {
		return prev_bid;
	}
	public void setPrev_bid(int prev_bid) {
		this.prev_bid = prev_bid;
	}
	public String getNext_title() {
		return next_title;
	}
	public void setNext_title(String next_title) {
		this.next_title = next_title;
	}
	public String getPrev_title() {
		return prev_title;
	}
	public void setPrev_title(String prev_title) {
		this.prev_title = prev_title;
	}
	public String getBrackets() {
		return brackets;
	}
	public void setBrackets(String brackets) {
		this.brackets = brackets;
	}

	
}
