package com.vision_x.vision_x.message.dto;

public class SingleLegendMessage {

	private int slid;
	private int dataid;
	private int mid;
	private int legend_cnt;
	private String type;
	private String legend_info;
	private double min_val;
	private double max_val;
	private double nodata_val;
	private String reg_date;
	public int getSlid() {
		return slid;
	}
	public void setSlid(int slid) {
		this.slid = slid;
	}
	public int getDataid() {
		return dataid;
	}
	public void setDataid(int dataid) {
		this.dataid = dataid;
	}
	public int getMid() {
		return mid;
	}
	public void setMid(int mid) {
		this.mid = mid;
	}
	public int getLegend_cnt() {
		return legend_cnt;
	}
	public void setLegend_cnt(int legend_cnt) {
		this.legend_cnt = legend_cnt;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getLegend_info() {
		return legend_info;
	}
	public void setLegend_info(String legend_info) {
		this.legend_info = legend_info;
	}
	public double getMin_val() {
		return min_val;
	}
	public void setMin_val(double min_val) {
		this.min_val = min_val;
	}
	public double getMax_val() {
		return max_val;
	}
	public void setMax_val(double max_val) {
		this.max_val = max_val;
	}
	public double getNodata_val() {
		return nodata_val;
	}
	public void setNodata_val(double nodata_val) {
		this.nodata_val = nodata_val;
	}
	public String getReg_date() {
		return reg_date;
	}
	public void setReg_date(String reg_date) {
		this.reg_date = reg_date;
	}
	
	
}
