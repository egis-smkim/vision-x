/**
 * 
 */
package com.vision_x.vision_x.admin.service;

/**
 * CoordVO.java
 * digitalTwin
 * 2020. 10. 27.
 * @author Khaia
 * @Comment
 *
 */
public class CoordVO {
	private int crdid;
	private int grpid;
	
	private String name;
	private String epsg;
	
	private int opt_value;
	
	private String defs_proj4;
	private String defs_geoserver;
	
	private int order_no;
	private String reg_date;
	
	
	public int getCrdid() {
		return crdid;
	}
	public void setCrdid(int crdid) {
		this.crdid = crdid;
	}
	public int getGrpid() {
		return grpid;
	}
	public void setGrpid(int grpid) {
		this.grpid = grpid;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getEpsg() {
		return epsg;
	}
	public void setEpsg(String epsg) {
		this.epsg = epsg;
	}
	public int getOpt_value() {
		return opt_value;
	}
	public void setOpt_value(int opt_value) {
		this.opt_value = opt_value;
	}
	public String getDefs_proj4() {
		return defs_proj4;
	}
	public void setDefs_proj4(String defs_proj4) {
		this.defs_proj4 = defs_proj4;
	}
	public String getDefs_geoserver() {
		return defs_geoserver;
	}
	public void setDefs_geoserver(String defs_geoserver) {
		this.defs_geoserver = defs_geoserver;
	}
	public int getOrder_no() {
		return order_no;
	}
	public void setOrder_no(int order_no) {
		this.order_no = order_no;
	}
	public String getReg_date() {
		return reg_date;
	}
	public void setReg_date(String reg_date) {
		this.reg_date = reg_date;
	}
	
	
}
