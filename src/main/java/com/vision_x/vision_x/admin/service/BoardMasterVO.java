package com.vision_x.vision_x.admin.service;

public class BoardMasterVO {
	private int bmid;
	private String name;
	private String root_url;
	private int r_level;
	private int w_level;
	private int comment;
	private int cmt_level;
	private int access_level;
	private String access_group;
	private int cmt_alert;
	private int reply_alert;
	private String slug;
	private String brackets;

	public int getBmid() {
		return bmid;
	}
	public void setBmid(int bmid) {
		this.bmid = bmid;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getRoot_url() {
		return root_url;
	}
	public void setRoot_url(String root_url) {
		this.root_url = root_url;
	}
	public int getR_level() {
		return r_level;
	}
	public void setR_level(int i) {
		this.r_level = i;
	}
	public int getW_level() {
		return w_level;
	}
	public void setW_level(int i) {
		this.w_level = i;
	}
	
	public int getComment() {
		return comment;
	}
	public void setComment(int comment) {
		this.comment = comment;
	}
	public int getCmt_level() {
		return cmt_level;
	}
	public void setCmt_level(int cmt_level) {
		this.cmt_level = cmt_level;
	}
	public int getAccess_level() {
		return access_level;
	}
	public void setAccess_level(int access_level) {
		this.access_level = access_level;
	}
	public int getCmt_alert() {
		return cmt_alert;
	}
	public void setCmt_alert(int cmt_alert) {
		this.cmt_alert = cmt_alert;
	}
	public int getReply_alert() {
		return reply_alert;
	}
	public void setReply_alert(int reply_alert) {
		this.reply_alert = reply_alert;
	}
	public String getSlug() {
		return slug;
	}
	public void setSlug(String slug) {
		this.slug = slug;
	}
	public String getBrackets() {
		return brackets;
	}
	public void setBrackets(String brackets) {
		this.brackets = brackets;
	}
	public String getAccess_group() {
		return access_group;
	}
	public void setAccess_group(String access_group) {
		this.access_group = access_group;
	}
	
}
