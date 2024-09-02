/**
 * 
 */
package com.vision_x.vision_x.desk.maps.service;

import org.apache.commons.lang.builder.ToStringBuilder;

/**
 * MapsVO.java
 * digitalTwin
 * 2021. 3. 16.
 * @author Khaia
 * @Comment
 *
 */
public class MapsVO {
	private int mapid;
	private int mid;
	private String encodedMapid;
	
	private String map_name;
	private String map_type;
	private String map_desc;
	
	private int max_layer_level;
	
	private String thumb_path;
	private String thumb_url;
	
	private String is_use;
	
	private double move_lon;
	private double move_lat;
	private double move_alt;
	private double move_angle;
	
	private double look_lon;
	private double look_lat;
	private double look_alt;
	
	private double move_direct;
	
	private int share_count;
	private int view_count;
	private int like_count;
	
	
	private String is_publish;
	private String share_type;
	
	private int state;
	
	private String modify_date;
	private String reg_date;
	
	private String layers;
	
	private int cnt;
	
	private int appid;
	private String app_list;
	private int lid;
	private int lgid;

	
	public int getCnt() {
		return cnt;
	}
	public void setCnt(int cnt) {
		this.cnt = cnt;
	}
	public String getLayers() {
		return layers;
	}
	public void setLayers(String layers) {
		this.layers = layers;
	}
	public int getMapid() {
		return mapid;
	}
	public void setMapid(int mapid) {
		this.mapid = mapid;
	}
	public String getEncodedMapid() {
		return encodedMapid;
	}
	public void setEncodedMapid(String encodedMapid) {
		this.encodedMapid = encodedMapid;
	}
	public int getMid() {
		return mid;
	}
	public void setMid(int mid) {
		this.mid = mid;
	}
	public String getMap_name() {
		return map_name;
	}
	public void setMap_name(String map_name) {
		this.map_name = map_name;
	}
	public String getMap_type() {
		return map_type;
	}
	public void setMap_type(String map_type) {
		this.map_type = map_type;
	}
	public String getMap_desc() {
		return map_desc;
	}
	public void setMap_desc(String map_desc) {
		this.map_desc = map_desc;
	}
	public int getMax_layer_level() {
		return max_layer_level;
	}
	public void setMax_layer_level(int max_layer_level) {
		this.max_layer_level = max_layer_level;
	}
	public String getThumb_path() {
		return thumb_path;
	}
	public void setThumb_path(String thumb_path) {
		this.thumb_path = thumb_path;
	}
	public String getThumb_url() {
		return thumb_url;
	}
	public void setThumb_url(String thumb_url) {
		this.thumb_url = thumb_url;
	}
	public String getIs_use() {
		return is_use;
	}
	public void setIs_use(String is_use) {
		this.is_use = is_use;
	}
	public double getMove_lon() {
		return move_lon;
	}
	public void setMove_lon(double move_lon) {
		this.move_lon = move_lon;
	}
	public double getMove_lat() {
		return move_lat;
	}
	public void setMove_lat(double move_lat) {
		this.move_lat = move_lat;
	}
	public double getMove_alt() {
		return move_alt;
	}
	public void setMove_alt(double move_alt) {
		this.move_alt = move_alt;
	}
	public double getMove_angle() {
		return move_angle;
	}
	public void setMove_angle(double move_angle) {
		this.move_angle = move_angle;
	}
	public int getShare_count() {
		return share_count;
	}
	public void setShare_count(int share_count) {
		this.share_count = share_count;
	}
	public int getView_count() {
		return view_count;
	}
	public void setView_count(int view_count) {
		this.view_count = view_count;
	}
	public int getLike_count() {
		return like_count;
	}
	public void setLike_count(int like_count) {
		this.like_count = like_count;
	}
	public String getIs_publish() {
		return is_publish;
	}
	public void setIs_publish(String is_publish) {
		this.is_publish = is_publish;
	}
	public String getShare_type() {
		return share_type;
	}
	public void setShare_type(String share_type) {
		this.share_type = share_type;
	}
	public int getState() {
		return state;
	}
	public void setState(int state) {
		this.state = state;
	}
	public String getModify_date() {
		return modify_date;
	}
	public void setModify_date(String modify_date) {
		this.modify_date = modify_date;
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
	public int getLid() {
		return lid;
	}
	public void setLid(int lid) {
		this.lid = lid;
	}
	public double getLook_lon() {
		return look_lon;
	}
	public void setLook_lon(double look_lon) {
		this.look_lon = look_lon;
	}
	public double getLook_lat() {
		return look_lat;
	}
	public void setLook_lat(double look_lat) {
		this.look_lat = look_lat;
	}
	public double getLook_alt() {
		return look_alt;
	}
	public void setLook_alt(double look_alt) {
		this.look_alt = look_alt;
	}
	public String getApp_list() {
		return app_list;
	}
	public void setApp_list(String app_list) {
		this.app_list = app_list;
	}
	public int getLgid() {
		return lgid;
	}
	public void setLgid(int lgid) {
		this.lgid = lgid;
	}
	public double getMove_direct() {
		return move_direct;
	}
	public void setMove_direct(double move_direct) {
		this.move_direct = move_direct;
	}
	public int getAppid() {
		return appid;
	}
	public void setAppid(int appid) {
		this.appid = appid;
	}
	

}
