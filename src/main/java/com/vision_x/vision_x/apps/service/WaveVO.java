package com.vision_x.vision_x.apps.service;

public class WaveVO {
	
	private int wid;
	private int mid;
	private String name;
	private String line_info;
	private String type;
	private double gravity;
	private double hmo;
	private double rb;
	private double rf;
	private double swl;
	private double d_msl;
	private double d_swl;
	private double h_swl;
	private double h_msl;
	private double wh; //파형경사
	private double wl;
	private String damage_info;
	private double mov_lon;
	private double mov_lat;
	private double mov_alt;
	private double dist;
	private double rc;
	private double rotate;
	
	public double getRotate() {
		return rotate;
	}
	public void setRotate(double rotate) {
		this.rotate = rotate;
	}
	public double getRc() {
		return rc;
	}
	public void setRc(double rc) {
		this.rc = rc;
	}
	public double getDist() {
		return dist;
	}
	public void setDist(double dist) {
		this.dist = dist;
	}
	public double getMov_tilt() {
		return mov_tilt;
	}
	public void setMov_tilt(double mov_tilt) {
		this.mov_tilt = mov_tilt;
	}
	private double mov_tilt;
	
	public double getMov_lon() {
		return mov_lon;
	}
	public void setMov_lon(double mov_lon) {
		this.mov_lon = mov_lon;
	}
	public double getMov_lat() {
		return mov_lat;
	}
	public void setMov_lat(double mov_lat) {
		this.mov_lat = mov_lat;
	}
	public double getMov_alt() {
		return mov_alt;
	}
	public void setMov_alt(double mov_alt) {
		this.mov_alt = mov_alt;
	}
	private String reg_date;
	
	public int getWid() {
		return wid;
	}
	public void setWid(int wid) {
		this.wid = wid;
	}
	public double getD_swl() {
		return d_swl;
	}
	public void setD_swl(double d_swl) {
		this.d_swl = d_swl;
	}
	public double getH_swl() {
		return h_swl;
	}
	public void setH_swl(double h_swl) {
		this.h_swl = h_swl;
	}
	public int getMid() {
		return mid;
	}
	public void setMid(int mid) {
		this.mid = mid;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getLine_info() {
		return line_info;
	}
	public void setLine_info(String line_info) {
		this.line_info = line_info;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public double getGravity() {
		return gravity;
	}
	public void setGravity(double gravity) {
		this.gravity = gravity;
	}
	public double getHmo() {
		return hmo;
	}
	public void setHmo(double hmo) {
		this.hmo = hmo;
	}
	public double getRb() {
		return rb;
	}
	public void setRb(double rb) {
		this.rb = rb;
	}
	public double getRf() {
		return rf;
	}
	public void setRf(double rf) {
		this.rf = rf;
	}
	public double getSwl() {
		return swl;
	}
	public void setSwl(double swl) {
		this.swl = swl;
	}
	public String getDamage_info() {
		return damage_info;
	}
	public void setDamage_info(String damage_info) {
		this.damage_info = damage_info;
	}
	public String getReg_date() {
		return reg_date;
	}
	public void setReg_date(String reg_date) {
		this.reg_date = reg_date;
	}
	public double getD_msl() {
		return d_msl;
	}
	public void setD_msl(double d_msl) {
		this.d_msl = d_msl;
	}
	public double getH_msl() {
		return h_msl;
	}
	public void setH_msl(double h_msl) {
		this.h_msl = h_msl;
	}
	public double getWh() {
		return wh;
	}
	public void setWh(double wh) {
		this.wh = wh;
	}
	public double getWl() {
		return wl;
	}
	public void setWl(double wl) {
		this.wl = wl;
	}
	
}
