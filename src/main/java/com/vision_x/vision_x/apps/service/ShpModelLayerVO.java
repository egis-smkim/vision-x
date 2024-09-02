package com.vision_x.vision_x.apps.service;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ShpModelLayerVO {

	private int afid;
	private int asid;
	private String origin_name;
	private String file_name;
	private String file_path;
	private double minx;
	private double miny;
	private double maxx;
	private double maxy;
	private String proj_wkt;
	private String epsg_code;
	private String geo_type;
	private String geom_wkt;
	private String reg_date;
	private String thumb_img_url;
	private int status;
	public int getAfid() {
		return afid;
	}
	public void setAfid(int afid) {
		this.afid = afid;
	}
	public int getAsid() {
		return asid;
	}
	public void setAsid(int asid) {
		this.asid = asid;
	}
	public String getOrigin_name() {
		return origin_name;
	}
	public void setOrigin_name(String origin_name) {
		this.origin_name = origin_name;
	}
	public String getFile_name() {
		return file_name;
	}
	public void setFile_name(String file_name) {
		this.file_name = file_name;
	}
	public String getFile_path() {
		return file_path;
	}
	public void setFile_path(String file_path) {
		this.file_path = file_path;
	}
	public double getMinx() {
		return minx;
	}
	public void setMinx(double minx) {
		this.minx = minx;
	}
	public double getMiny() {
		return miny;
	}
	public void setMiny(double miny) {
		this.miny = miny;
	}
	public double getMaxx() {
		return maxx;
	}
	public void setMaxx(double maxx) {
		this.maxx = maxx;
	}
	public double getMaxy() {
		return maxy;
	}
	public void setMaxy(double maxy) {
		this.maxy = maxy;
	}
	public String getProj_wkt() {
		return proj_wkt;
	}
	public void setProj_wkt(String proj_wkt) {
		this.proj_wkt = proj_wkt;
	}
	public String getEpsg_code() {
		return epsg_code;
	}
	public void setEpsg_code(String epsg_code) {
		this.epsg_code = epsg_code;
	}
	public String getGeo_type() {
		return geo_type;
	}
	public void setGeo_type(String geo_type) {
		this.geo_type = geo_type;
	}
	public String getGeom_wkt() {
		return geom_wkt;
	}
	public void setGeom_wkt(String geom_wkt) {
		this.geom_wkt = geom_wkt;
	}
	public String getReg_date() {
		return reg_date;
	}
	public void setReg_date(String reg_date) {
		this.reg_date = reg_date;
	}
	public String getThumb_img_url() {
		return thumb_img_url;
	}
	public void setThumb_img_url(String thumb_img_url) {
		this.thumb_img_url = thumb_img_url;
	}
	public int getStatus() {
		return status;
	}
	public void setStatus(int status) {
		this.status = status;
	}
	
	
}
