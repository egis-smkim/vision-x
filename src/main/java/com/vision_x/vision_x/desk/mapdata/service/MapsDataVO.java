/**
 * 
 */
package com.vision_x.vision_x.desk.mapdata.service;

import org.apache.commons.lang.builder.ToStringBuilder;

import com.vision_x.vision_x.geocoding.service.PoiObjVO;
import com.github.rkpunjal.sqlsafe.SQLInjectionSafe;

/**
 * MapDataVO.java
 * digitalTwin
 * 2021. 4. 9.
 * @author Khaia
 * @Comment
 *
 */
public class MapsDataVO {
	private int dataid;
	private int mid;
	private int dgid;
	private int wcid;
	private int cwid;
	private int fid;
	
	private int cnt;
	
	private String data_name;
	private String data_nickname;
	private String data_desc;
	private String data_env;
	private String data_type;
	private String data_encode;
	private String convert_type;
	private String is_converted;
	private String hdfs_url;
	private String hdfs_path;
	private String progress_path;
	private String progress_url;
	
	private String bg_color;
	
	private String split_out_path;
	private String split_out_txt_path;
	private String datadir_url;
	private String shp_file_url;
	private String out_txt_url;
	
	private String coord_type;
	
	private String thumbnail_url;
	private String thumbnail_path;
	
	private double move_lat;
	private double move_lon;
	private double move_alt;
	
	private @SQLInjectionSafe String shp_layer_fullname;
	private @SQLInjectionSafe String shp_data_store_name;
	private @SQLInjectionSafe String shp_table_name;
	private @SQLInjectionSafe String shp_column_name;
	private String shp_info_url;
	private String shp_url;
	private int shp_data_type;
	private String is_shape_height;
	private String shp_path;
	
	private double minx;
	private double miny;
	private double minz;
	
	private double maxx;
	private double maxy;
	private double maxz;
	
	private double center_x;
	private double center_y;
	
	private int width;
	private int height;
	private int resolution;
	private int bands;
	private int bits;
	
	private String xdlayer_name;
	
	private String stamp;
	
	private String csv_layer_name;
	private String csv_db_name;
	private int col_x;
	private int col_y;
	private int col_label;
	private int col_address;
	
	private int poi_type;
	private int poi_index;
	
	private String mlid;
	private String mltx;
	
	private int state; // 1 : 가공 대기, 2 : 가공중,  9:삭제, 91: 오류, 10 : 가공완료
	
	private String rec_date;
	private String reg_date;
	
	private String download_url;
	
	private String data_encoding;
	
	private String coord_epsg;
	
	private String rect_info_path;
	
	private String geometry_type;
	
	private String model_category_h;
	private String model_category_m;
	private String model_category_s;
	
	private String shape_type;
	
	private String poi_color;
	private String address_type;
	
	private String point_color;
	
	private String meta_out_path;
	private String meta_out_url;
	
	private String meta_out_work_url;
	
	private String split_progress_path;
	
	private int record_size;
	
	private double point_alt;
	private double point_size;
	private long point_count;
	private int point_intense;
	//csv sample column
	private String poi_name;
	private String poi_file_name;
	private String poi_file_url;
	private String poi_texture_name;
	
	private String error_message;
	
	private int total_count;
	
	//gpx 트랙 컬러, 라우트 컬러
	private String trk_color;
	private String rte_color;
	
	//전국, 로컬 csv 타입 추가
	private String area_type;
	
	//이미지 가공 종류
	private String img_type;
	
	public String getImg_type() {
		return img_type;
	}
	public void setImg_type(String img_type) {
		this.img_type = img_type;
	}
	//db name
	public int getTotal_count() {
		return total_count;
	}
	public void setTotal_count(int total_count) {
		this.total_count = total_count;
	}
	public String getError_message() {
		return error_message;
	}
	public void setError_message(String error_message) {
		this.error_message = error_message;
	}
	public String getPoi_name() {
		return poi_name;
	}
	public void setPoi_name(String poi_name) {
		this.poi_name = poi_name;
	}
	public String getPoi_file_url() {
		return poi_file_url;
	}
	public String getPoi_file_name() {
		return poi_file_name;
	}
	public void setPoi_file_name(String poi_file_name) {
		this.poi_file_name = poi_file_name;
	}
	public void setPoi_file_url(String poi_file_url) {
		this.poi_file_url = poi_file_url;
	}
	public String getPoi_texture_name() {
		return poi_texture_name;
	}
	public void setPoi_texture_name(String poi_texture_name) {
		this.poi_texture_name = poi_texture_name;
	}
	public double getPoint_alt() {
		return point_alt;
	}
	public void setPoint_alt(double point_alt) {
		this.point_alt = point_alt;
	}
	public double getPoint_size() {
		return point_size;
	}
	public void setPoint_size(double point_size) {
		this.point_size = point_size;
	}
	public String getSplit_progress_path() {
		return split_progress_path;
	}
	public void setSplit_progress_path(String split_progress_path) {
		this.split_progress_path = split_progress_path;
	}
	public String getMeta_out_work_url() {
		return meta_out_work_url;
	}
	public void setMeta_out_work_url(String meta_out_work_url) {
		this.meta_out_work_url = meta_out_work_url;
	}
	public String getMeta_out_path() {
		return meta_out_path;
	}
	public void setMeta_out_path(String meta_out_path) {
		this.meta_out_path = meta_out_path;
	}
	public String getMeta_out_url() {
		return meta_out_url;
	}
	public void setMeta_out_url(String meta_out_url) {
		this.meta_out_url = meta_out_url;
	}
	public int getCol_address() {
		return col_address;
	}
	public void setCol_address(int col_address) {
		this.col_address = col_address;
	}
	
	public String getPoint_color() {
		return point_color;
	}
	public void setPoint_color(String point_color) {
		this.point_color = point_color;
	}
	public String getAddress_type() {
		return address_type;
	}
	public void setAddress_type(String address_type) {
		this.address_type = address_type;
	}
	public String getPoi_color() {
		return poi_color;
	}
	public void setPoi_color(String poi_color) {
		this.poi_color = poi_color;
	}
	public String getModel_category_s() {
		return model_category_s;
	}
	public void setModel_category_s(String model_category_s) {
		this.model_category_s = model_category_s;
	}
	public String getShape_type() {
		return shape_type;
	}
	public void setShape_type(String shape_type) {
		this.shape_type = shape_type;
	}
	public String getModel_category_h() {
		return model_category_h;
	}
	public void setModel_category_h(String model_category_h) {
		this.model_category_h = model_category_h;
	}
	public String getModel_category_m() {
		return model_category_m;
	}
	public void setModel_category_m(String model_category_m) {
		this.model_category_m = model_category_m;
	}
	public String getGeometry_type() {
		return geometry_type;
	}
	public void setGeometry_type(String geometry_type) {
		this.geometry_type = geometry_type;
	}
	public String getRect_info_path() {
		return rect_info_path;
	}
	public void setRect_info_path(String rect_info_path) {
		this.rect_info_path = rect_info_path;
	}
	public int getCnt() {
		return cnt;
	}
	public void setCnt(int cnt) {
		this.cnt = cnt;
	}
	public String getCoord_epsg() {
		return coord_epsg;
	}
	public void setCoord_epsg(String coord_epsg) {
		this.coord_epsg = coord_epsg;
	}
	public String getData_encoding() {
		return data_encoding;
	}
	public void setData_encoding(String data_encoding) {
		this.data_encoding = data_encoding;
	}
	public int getState() {
		return state;
	}
	public void setState(int state) {
		this.state = state;
	}
	public String getConvert_type() {
		return convert_type;
	}
	public void setConvert_type(String convert_type) {
		this.convert_type = convert_type;
	}
	
	
	
	
	public String getSplit_out_txt_path() {
		return split_out_txt_path;
	}
	public void setSplit_out_txt_path(String split_out_txt_path) {
		this.split_out_txt_path = split_out_txt_path;
	}
	public String getDownload_url() {
		return download_url;
	}
	public void setDownload_url(String download_url) {
		this.download_url = download_url;
	}
	public int getCwid() {
		return cwid;
	}
	public void setCwid(int cwid) {
		this.cwid = cwid;
	}
	public String getSplit_out_path() {
		return split_out_path;
	}
	public void setSplit_out_path(String split_out_path) {
		this.split_out_path = split_out_path;
	}
	public double getCenter_x() {
		return center_x;
	}
	public void setCenter_x(double center_x) {
		this.center_x = center_x;
	}
	public double getCenter_y() {
		return center_y;
	}
	public void setCenter_y(double center_y) {
		this.center_y = center_y;
	}
	public String getBg_color() {
		return bg_color;
	}
	public void setBg_color(String bg_color) {
		this.bg_color = bg_color;
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
	public int getWcid() {
		return wcid;
	}
	public void setWcid(int wcid) {
		this.wcid = wcid;
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
	public String getOut_txt_url() {
		return out_txt_url;
	}
	public void setOut_txt_url(String out_txt_url) {
		this.out_txt_url = out_txt_url;
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
	public String getMlid() {
		return mlid;
	}
	public void setMlid(String mlid) {
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
	public String getData_encode() {
		return data_encode;
	}
	public void setData_encode(String data_encode) {
		this.data_encode = data_encode;
	}
	public int getRecord_size() {
		return record_size;
	}
	public void setRecord_size(int record_size) {
		this.record_size = record_size;
	}
	public String getShp_url() {
		return shp_url;
	}
	public void setShp_url(String shp_url) {
		this.shp_url = shp_url;
	}
	public String getCsv_layer_name() {
		return csv_layer_name;
	}
	public void setCsv_layer_name(String csv_layer_name) {
		this.csv_layer_name = csv_layer_name;
	}
	public String getCsv_db_name() {
		return csv_db_name;
	}
	public void setCsv_db_name(String csv_db_name) {
		this.csv_db_name = csv_db_name;
	}
	public String getArea_type() {
		return area_type;
	}
	public void setArea_type(String area_type) {
		this.area_type = area_type;
	}
	public long getPoint_count() {
		return point_count;
	}
	public void setPoint_count(long point_count) {
		this.point_count = point_count;
	}
	public int getPoint_intense() {
		return point_intense;
	}
	public void setPoint_intense(int point_intense) {
		this.point_intense = point_intense;
	}
	public String getMltx() {
		return mltx;
	}
	public void setMltx(String mltx) {
		this.mltx = mltx;
	}
	public String getShp_path() {
		return shp_path;
	}
	public void setShp_path(String shp_path) {
		this.shp_path = shp_path;
	}
	public double getMinz() {
		return minz;
	}
	public void setMinz(double minz) {
		this.minz = minz;
	}
	public double getMaxz() {
		return maxz;
	}
	public void setMaxz(double maxz) {
		this.maxz = maxz;
	}
	
	public String getTrk_color() {
		return trk_color;
	}
	public void setTrk_color(String trk_color) {
		this.trk_color = trk_color;
	}
	public String getRte_color() {
		return rte_color;
	}
	public void setRte_color(String rte_color) {
		this.rte_color = rte_color;
	}
	
	public String getData_nickname() {
		return data_nickname;
	}
	public void setData_nickname(String data_nickname) {
		this.data_nickname = data_nickname;
	}
	
	public String toString() {
        return ToStringBuilder.reflectionToString(this);
    }
	
	public String getShp_column_name() {
		return shp_column_name;
	}
	public void setShp_column_name(String shp_column_name) {
		this.shp_column_name = shp_column_name;
	}
	
}