/**
 * 
 */
package com.vision_x.vision_x.desk.mapdata.service;

import org.apache.commons.lang.builder.ToStringBuilder;


public class DataShareVO {
	private int dsid;
	private int mid;
	private int dataid;
	private int share_gid;
	private int share_mid;
	
	private String share_type;
	private String state;
	private String reg_date;
	
	public int getDsid() {
		return dsid;
	}

	public void setDsid(int dsid) {
		this.dsid = dsid;
	}

	public int getMid() {
		return mid;
	}

	public void setMid(int mid) {
		this.mid = mid;
	}

	public int getDataid() {
		return dataid;
	}

	public void setDataid(int dataid) {
		this.dataid = dataid;
	}

	public int getShare_gid() {
		return share_gid;
	}

	public void setShare_gid(int share_gid) {
		this.share_gid = share_gid;
	}

	public int getShare_mid() {
		return share_mid;
	}

	public void setShare_mid(int share_mid) {
		this.share_mid = share_mid;
	}

	public String getShare_type() {
		return share_type;
	}

	public void setShare_type(String share_type) {
		this.share_type = share_type;
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

	public String toString() {
        return ToStringBuilder.reflectionToString(this);
    }
	
}