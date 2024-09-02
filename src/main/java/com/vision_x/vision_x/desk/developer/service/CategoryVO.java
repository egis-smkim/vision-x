package com.vision_x.vision_x.desk.developer.service;

import org.apache.commons.lang.builder.ToStringBuilder;

/**
 * CategoryVO.java
 * digitalTwin
 * 2020. 10. 20.
 * @author Khaia
 * @Comment
 *
 */
public class CategoryVO {
	private int cid;
	private String l_cate;
	private String m_cate;
	private String s_cate;
	
	private String cate_nm;
	private String cate_yn;
	
	private String cate_eng_nm;
	
	private String reg_date;
	
	

	public void setCid(int cid) {
		this.cid = cid;
	}

	public int getCid() {
		return cid;
	}

	public String getL_cate() {
		return l_cate;
	}

	public void setL_cate(String l_cate) {
		this.l_cate = l_cate;
	}

	public String getM_cate() {
		return m_cate;
	}

	public void setM_cate(String m_cate) {
		this.m_cate = m_cate;
	}

	public String getS_cate() {
		return s_cate;
	}

	public void setS_cate(String s_cate) {
		this.s_cate = s_cate;
	}

	public String getCate_nm() {
		return cate_nm;
	}

	public void setCate_nm(String cate_nm) {
		this.cate_nm = cate_nm;
	}

	public String getCate_yn() {
		return cate_yn;
	}

	public void setCate_yn(String cate_yn) {
		this.cate_yn = cate_yn;
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

	public String getCate_eng_nm() {
		return cate_eng_nm;
	}

	public void setCate_eng_nm(String cate_eng_nm) {
		this.cate_eng_nm = cate_eng_nm;
	}
}
