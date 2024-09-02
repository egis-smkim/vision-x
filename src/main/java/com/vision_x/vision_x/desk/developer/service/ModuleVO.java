/**
 * 
 */
package com.vision_x.vision_x.desk.developer.service;

import org.apache.commons.lang.builder.ToStringBuilder;

/**
 * ModuleVO.java
 * digitalTwin
 * 2020. 11. 10.
 * @author Khaia
 * @Comment
 *
 */
public class ModuleVO {
	private int mdid;
	private int cid;
	private String name;
	private String version;
	
	private String js_url;
	private String css_url;
	private String html_url;
	private String module_obj;
	
	private String tbl_name_m; // DB 마스터 테이블
	private String tbl_name_s0; // 보조테이블 0
	private String tbl_name_s1; // 보조테이블 1
	private String tbl_name_s2; // 보조테이블 2
	private String tbl_name_s3; // 보조테이블 3
	private String tbl_name_s4; // 보조테이블 4
	
	private int develop_type; // 0:연구소, 1:서울, 2:대구, 5:개발자회원, 6:협력사, 7:지자체, 8:대학교, 9:연구기관
	
	private String data_directory;
	
	private String is_extjs;
	private String dev_author;
	private String state;
	private String reg_date;
	
	private String cate_nm;
	
	private int design_type; // 0: 하단, 1:우측(소), 2:우측(중), 3:우측(대)
	
	private int mid;
	
	private String product_name;
	private String eng_name;
	private String agid;
	
	public int getDesign_type() {
		return design_type;
	}
	public void setDesign_type(int design_type) {
		this.design_type = design_type;
	}
	public String getData_directory() {
		return data_directory;
	}
	public void setData_directory(String data_directory) {
		this.data_directory = data_directory;
	}
	public String getTbl_name_m() {
		return tbl_name_m;
	}
	public void setTbl_name_m(String tbl_name_m) {
		this.tbl_name_m = tbl_name_m;
	}
	public String getTbl_name_s0() {
		return tbl_name_s0;
	}
	public void setTbl_name_s0(String tbl_name_s0) {
		this.tbl_name_s0 = tbl_name_s0;
	}
	public String getTbl_name_s1() {
		return tbl_name_s1;
	}
	public void setTbl_name_s1(String tbl_name_s1) {
		this.tbl_name_s1 = tbl_name_s1;
	}
	public String getTbl_name_s2() {
		return tbl_name_s2;
	}
	public void setTbl_name_s2(String tbl_name_s2) {
		this.tbl_name_s2 = tbl_name_s2;
	}
	public String getTbl_name_s3() {
		return tbl_name_s3;
	}
	public void setTbl_name_s3(String tbl_name_s3) {
		this.tbl_name_s3 = tbl_name_s3;
	}
	public String getTbl_name_s4() {
		return tbl_name_s4;
	}
	public void setTbl_name_s4(String tbl_name_s4) {
		this.tbl_name_s4 = tbl_name_s4;
	}
	
	
	
	public int getDevelop_type() {
		return develop_type;
	}
	public void setDevelop_type(int develop_type) {
		this.develop_type = develop_type;
	}
	public String getCate_nm() {
		return cate_nm;
	}
	public void setCate_nm(String cate_nm) {
		this.cate_nm = cate_nm;
	}
	public int getMdid() {
		return mdid;
	}
	public void setMdid(int mdid) {
		this.mdid = mdid;
	}
	public int getCid() {
		return cid;
	}
	public void setCid(int cid) {
		this.cid = cid;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	
	public String getVersion() {
		return version;
	}
	public void setVersion(String version) {
		this.version = version;
	}
	public String getJs_url() {
		return js_url;
	}
	public void setJs_url(String js_url) {
		this.js_url = js_url;
	}
	public String getCss_url() {
		return css_url;
	}
	public void setCss_url(String css_url) {
		this.css_url = css_url;
	}
	public String getHtml_url() {
		return html_url;
	}
	public void setHtml_url(String html_url) {
		this.html_url = html_url;
	}

	public String getDev_author() {
		return dev_author;
	}
	public void setDev_author(String dev_author) {
		this.dev_author = dev_author;
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
	public String getIs_extjs() {
		return is_extjs;
	}
	public void setIs_extjs(String is_extjs) {
		this.is_extjs = is_extjs;
	}
	
	
	
	public String getModule_obj() {
		return module_obj;
	}
	public void setModule_obj(String module_obj) {
		this.module_obj = module_obj;
	}
	public String toString() {
        return ToStringBuilder.reflectionToString(this);
    }
	public int getMid() {
		return mid;
	}
	public void setMid(int mid) {
		this.mid = mid;
	}
	
	public String getProduct_name() {
		return product_name;
	}
	public void setProduct_name(String product_name) {
		this.product_name = product_name;
	}
	public String getEng_name() {
		return eng_name;
	}
	public void setEng_name(String eng_name) {
		this.eng_name = eng_name;
	}
	public String getAgid() {
		return agid;
	}
	public void setAgid(String agid) {
		this.agid = agid;
	}
	
}