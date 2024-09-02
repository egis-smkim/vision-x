package com.vision_x.vision_x.desk.board.service;

public class CommentVO {
	private int bmid;
	private int bid;
	private int cid;
	private String memid;
	private String content;
	private String reg_date;
	private String update_date;

	private int cdepth;
	private int cgroup;

	public int getBmid() {
		return bmid;
	}

	public void setBmid(int bmid) {
		this.bmid = bmid;
	}

	public int getBid() {
		return bid;
	}

	public void setBid(int bid) {
		this.bid = bid;
	}

	public int getCid() {
		return cid;
	}

	public void setCid(int cid) {
		this.cid = cid;
	}

	public String getMemid() {
		return memid;
	}

	public void setMemid(String memid) {
		this.memid = memid;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
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

	public int getCdepth() {
		return cdepth;
	}

	public void setCdepth(int cdepth) {
		this.cdepth = cdepth;
	}

	public int getCgroup() {
		return cgroup;
	}

	public void setCgroup(int cgroup) {
		this.cgroup = cgroup;
	}

}
