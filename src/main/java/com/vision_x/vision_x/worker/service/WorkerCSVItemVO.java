/**
 * 
 */
package com.vision_x.vision_x.worker.service;

import org.apache.commons.lang.builder.ToStringBuilder;

/**
 * WorkerCSVItemVO.java
 * digitalTwin
 * 2021. 2. 26.
 * @author Khaia
 * @Comment
 *
 */
public class WorkerCSVItemVO {
	private int wcid;
	private int mid;
	private int dataid;
	private int lid;
	private int fid;
	private int did;
	private String mem_id;
	
	private String db_name;
	private String tbl_name;
	private String csv_path;
	private String output_path;
	
	private String is_two_column;
	private String progress_path;
	private String progress_url;
	
	private int address_index;
	private int title_index;
	private int lon_index;
	private int lat_index;
	private String addr_type;
	private int poi_type;
	private int poi_index;
	private String poi_color;
	private String shp_type;
	private String shp_path;
	private int pid;
	private String area_type;
	private int mlid;
	
	private String status;
	private int srs_code;
	
	private String encoding;
	private String epsg_code;
	private String start_date;
	private String complete_date;
	private int dsid;
	
	public int getDsid() {
		return dsid;
	}

	public void setDsid(int dsid) {
		this.dsid = dsid;
	}

	private String reg_date;

	public int getWcid() {
		return wcid;
	}

	public void setWcid(int wcid) {
		this.wcid = wcid;
	}

	public int getMid() {
		return mid;
	}

	public void setMid(int mid) {
		this.mid = mid;
	}

	public int getLid() {
		return lid;
	}

	public void setLid(int lid) {
		this.lid = lid;
	}

	public int getFid() {
		return fid;
	}

	public void setFid(int fid) {
		this.fid = fid;
	}

	public String getDb_name() {
		return db_name;
	}

	public void setDb_name(String db_name) {
		this.db_name = db_name;
	}

	public String getTbl_name() {
		return tbl_name;
	}

	public void setTbl_name(String tbl_name) {
		this.tbl_name = tbl_name;
	}

	public String getCsv_path() {
		return csv_path;
	}

	public void setCsv_path(String csv_path) {
		this.csv_path = csv_path;
	}

	public String getOutput_path() {
		return output_path;
	}

	public void setOutput_path(String output_path) {
		this.output_path = output_path;
	}

	public String getIs_two_column() {
		return is_two_column;
	}

	public void setIs_two_column(String is_two_column) {
		this.is_two_column = is_two_column;
	}

	public String getProgress_path() {
		return progress_path;
	}

	public void setProgress_path(String progress_path) {
		this.progress_path = progress_path;
	}

	public String getProgress_url() {
		return progress_url;
	}

	public void setProgress_url(String progress_url) {
		this.progress_url = progress_url;
	}

	public int getAddress_index() {
		return address_index;
	}

	public void setAddress_index(int address_index) {
		this.address_index = address_index;
	}

	public int getTitle_index() {
		return title_index;
	}

	public void setTitle_index(int title_index) {
		this.title_index = title_index;
	}

	public int getLon_index() {
		return lon_index;
	}

	public void setLon_index(int lon_index) {
		this.lon_index = lon_index;
	}

	public int getLat_index() {
		return lat_index;
	}

	public void setLat_index(int lat_index) {
		this.lat_index = lat_index;
	}

	public String getAddr_type() {
		return addr_type;
	}

	public void setAddr_type(String addr_type) {
		this.addr_type = addr_type;
	}

	public int getPoi_type() {
		return poi_type;
	}

	public void setPoi_type(int poi_type) {
		this.poi_type = poi_type;
	}

	public int getPoi_index() {
		return poi_index;
	}

	public void setPoi_index(int poi_index) {
		this.poi_index = poi_index;
	}

	public int getMlid() {
		return mlid;
	}

	public void setMlid(int mlid) {
		this.mlid = mlid;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getStart_date() {
		return start_date;
	}

	public void setStart_date(String start_date) {
		this.start_date = start_date;
	}

	public String getComplete_date() {
		return complete_date;
	}

	public void setComplete_date(String complete_date) {
		this.complete_date = complete_date;
	}

	public String getReg_date() {
		return reg_date;
	}

	public void setReg_date(String reg_date) {
		this.reg_date = reg_date;
	}
	
	public int getDataid() {
		return dataid;
	}

	public void setDataid(int dataid) {
		this.dataid = dataid;
	}
	
	

	public String getPoi_color() {
		return poi_color;
	}

	public void setPoi_color(String poi_color) {
		this.poi_color = poi_color;
	}

	public String getShp_type() {
		return shp_type;
	}

	public void setShp_type(String shp_type) {
		this.shp_type = shp_type;
	}

	public int getSrs_code() {
		return srs_code;
	}

	public void setSrs_code(int srs_code) {
		this.srs_code = srs_code;
	}

	public String getShp_path() {
		return shp_path;
	}

	public void setShp_path(String shp_path) {
		this.shp_path = shp_path;
	}

	public int getPid() {
		return pid;
	}

	public void setPid(int pid) {
		this.pid = pid;
	}

	public String getArea_type() {
		return area_type;
	}

	public void setArea_type(String area_type) {
		this.area_type = area_type;
	}

	public String getEncoding() {
		return encoding;
	}

	public void setEncoding(String encoding) {
		this.encoding = encoding;
	}

	public int getDid() {
		return did;
	}

	public void setDid(int did) {
		this.did = did;
	}

	public String getMem_id() {
		return mem_id;
	}

	public void setMem_id(String mem_id) {
		this.mem_id = mem_id;
	}


	public String getEpsg_code() {
		return epsg_code;
	}

	public void setEpsg_code(String epsg_code) {
		this.epsg_code = epsg_code;
	}

	public String toString() {
        return ToStringBuilder.reflectionToString(this);
    }
}
