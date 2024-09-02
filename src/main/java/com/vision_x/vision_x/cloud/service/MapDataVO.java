/**
 * 
 */
package com.vision_x.vision_x.cloud.service;

import org.apache.commons.lang.builder.ToStringBuilder;

/**
 * MapDataVO.java
 * digitalTwin
 * 2021. 2. 26.
 * @author Khaia
 * @Comment
 * @Tbl : MEMBER_MAPS_DATA
 */
public class MapDataVO {
	private int dataid;
	private int mid;
	private int dgid;
	private int cwid;

	private int fid;
	
	private int cnt;
	
	private String data_name;
	private String data_desc;
	private String data_env;
	private String data_type;
	private String data_encode;
	private String is_converted;
	private String hdfs_url;
	private String hdfs_path;
	private String progress_path;
	private String progress_url;
	
	private String datadir_url;
	private String shp_file_url;

	
	private String coord_type;
	
	private String thumbnail_url;
	private String thumbnail_path;
	
	private double move_lat;
	private double move_lon;
	private double move_alt;
	
	private String shp_layer_fullname;
	private String shp_data_store_name;
	private String shp_table_name;
	private String shp_info_url;
	private int shp_data_type;
	private String is_shape_height;
	
	private double minx;
	private double miny;
	private double maxx;
	private double maxy;
	
	private int width;
	private int height;
	private int resolution;
	private int bands;
	private int bits;
	
	private String xdlayer_name;
	private String point_color;
	
	private String stamp;
	
	private int col_x;
	private int col_y;
	private int col_label;
	private int lon_index;
	private int lat_index;
	private int title_index;
	private int address_index;
	
	private String is_two_column;
	private int poi_type;
	private int poi_index;
	
	private int mlid;
	
	private String rec_date;
	private String reg_date;
	
	private int record_size;
	
	public int getCnt() {
		return cnt;
	}
	public void setCnt(int cnt) {
		this.cnt = cnt;
	}
	
	public int getCwid() {
		return cwid;
	}
	public void setCwid(int cwid) {
		this.cwid = cwid;
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
	public int getDgid() {
		return dgid;
	}
	public void setDgid(int dgid) {
		this.dgid = dgid;
	}

	public String getData_name() {
		return data_name;
	}
	public void setData_name(String data_name) {
		this.data_name = data_name;
	}
	public String getData_desc() {
		return data_desc;
	}
	public void setData_desc(String data_desc) {
		this.data_desc = data_desc;
	}
	public String getData_env() {
		return data_env;
	}
	public void setData_env(String data_env) {
		this.data_env = data_env;
	}
	public String getIs_converted() {
		return is_converted;
	}
	public void setIs_converted(String is_converted) {
		this.is_converted = is_converted;
	}
	public String getHdfs_url() {
		return hdfs_url;
	}
	public void setHdfs_url(String hdfs_url) {
		this.hdfs_url = hdfs_url;
	}
	public String getHdfs_path() {
		return hdfs_path;
	}
	public void setHdfs_path(String hdfs_path) {
		this.hdfs_path = hdfs_path;
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
	public String getDatadir_url() {
		return datadir_url;
	}
	public void setDatadir_url(String datadir_url) {
		this.datadir_url = datadir_url;
	}
	public String getShp_file_url() {
		return shp_file_url;
	}
	public void setShp_file_url(String shp_file_url) {
		this.shp_file_url = shp_file_url;
	}

	public String getCoord_type() {
		return coord_type;
	}
	public void setCoord_type(String coord_type) {
		this.coord_type = coord_type;
	}
	public String getThumbnail_url() {
		return thumbnail_url;
	}
	public void setThumbnail_url(String thumbnail_url) {
		this.thumbnail_url = thumbnail_url;
	}
	public String getThumbnail_path() {
		return thumbnail_path;
	}
	public void setThumbnail_path(String thumbnail_path) {
		this.thumbnail_path = thumbnail_path;
	}
	public double getMove_lat() {
		return move_lat;
	}
	public void setMove_lat(double move_lat) {
		this.move_lat = move_lat;
	}
	public double getMove_lon() {
		return move_lon;
	}
	public void setMove_lon(double move_lon) {
		this.move_lon = move_lon;
	}
	public double getMove_alt() {
		return move_alt;
	}
	public void setMove_alt(double move_alt) {
		this.move_alt = move_alt;
	}
	public String getShp_layer_fullname() {
		return shp_layer_fullname;
	}
	public void setShp_layer_fullname(String shp_layer_fullname) {
		this.shp_layer_fullname = shp_layer_fullname;
	}
	public String getShp_data_store_name() {
		return shp_data_store_name;
	}
	public void setShp_data_store_name(String shp_data_store_name) {
		this.shp_data_store_name = shp_data_store_name;
	}
	public String getShp_table_name() {
		return shp_table_name;
	}
	public void setShp_table_name(String shp_table_name) {
		this.shp_table_name = shp_table_name;
	}
	public String getShp_info_url() {
		return shp_info_url;
	}
	public void setShp_info_url(String shp_info_url) {
		this.shp_info_url = shp_info_url;
	}
	public int getShp_data_type() {
		return shp_data_type;
	}
	public void setShp_data_type(int shp_data_type) {
		this.shp_data_type = shp_data_type;
	}
	public String getIs_shape_height() {
		return is_shape_height;
	}
	public void setIs_shape_height(String is_shape_height) {
		this.is_shape_height = is_shape_height;
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
	public int getWidth() {
		return width;
	}
	public void setWidth(int width) {
		this.width = width;
	}
	public int getHeight() {
		return height;
	}
	public void setHeight(int height) {
		this.height = height;
	}
	public int getResolution() {
		return resolution;
	}
	public void setResolution(int resolution) {
		this.resolution = resolution;
	}
	public int getBands() {
		return bands;
	}
	public void setBands(int bands) {
		this.bands = bands;
	}
	public int getBits() {
		return bits;
	}
	public void setBits(int bits) {
		this.bits = bits;
	}
	public String getXdlayer_name() {
		return xdlayer_name;
	}
	public void setXdlayer_name(String xdlayer_name) {
		this.xdlayer_name = xdlayer_name;
	}
	public String getPoint_color() {
		return point_color;
	}
	public void setPoint_color(String point_color) {
		this.point_color = point_color;
	}
	public String getStamp() {
		return stamp;
	}
	public void setStamp(String stamp) {
		this.stamp = stamp;
	}
	public int getCol_x() {
		return col_x;
	}
	public void setCol_x(int col_x) {
		this.col_x = col_x;
	}
	public int getCol_y() {
		return col_y;
	}
	public void setCol_y(int col_y) {
		this.col_y = col_y;
	}
	public int getCol_label() {
		return col_label;
	}
	public void setCol_label(int col_label) {
		this.col_label = col_label;
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
	public int getTitle_index() {
		return title_index;
	}
	public void setTitle_index(int title_index) {
		this.title_index = title_index;
	}
	public int getAddress_index() {
		return address_index;
	}
	public void setAddress_index(int address_index) {
		this.address_index = address_index;
	}
	public String getIs_two_column() {
		return is_two_column;
	}
	public void setIs_two_column(String is_two_column) {
		this.is_two_column = is_two_column;
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
	public String getRec_date() {
		return rec_date;
	}
	public void setRec_date(String rec_date) {
		this.rec_date = rec_date;
	}
	public String getReg_date() {
		return reg_date;
	}
	public void setReg_date(String reg_date) {
		this.reg_date = reg_date;
	}
	
	public int getFid() {
		return fid;
	}
	public void setFid(int fid) {
		this.fid = fid;
	}
	public String getData_type() {
		return data_type;
	}
	public void setData_type(String data_type) {
		this.data_type = data_type;
	}
	public int getRecord_size() {
		return record_size;
	}
	
	public void setRecord_size(int record_size) {
		this.record_size = record_size;
	}
	
	public String getData_encode() {
		return data_encode;
	}
	public void setData_encode(String data_encode) {
		this.data_encode = data_encode;
	}
	public String toString() {
        return ToStringBuilder.reflectionToString(this);
    }
	
}
