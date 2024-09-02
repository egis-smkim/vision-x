package com.vision_x.vision_x.desk.developer.service;

import org.apache.commons.lang.builder.ToStringBuilder;

/**
 * ProductVO.java
 * digitalTwin
 * 2020. 10. 20.
 * @author Khaia
 * @Comment
 *
 */
public class ProductVO {
	private int pid;
	private int mid;
	private int mdid;
	private int cid;
	private int share_gid;
	
	private String name;
	
	private int p_type;
	
	private int price;
	private int sort;
	private String comment;
	private String comment_url;
	
	private String comment_spec;
	private String video_url;
	private String thumb;
	
	// 개발사 정보
	private String com_name;
	private String com_logo_url;
	private String com_tel;
	private String com_email;
	private String com_homepage;
	
	// 0 : 준비중, 1 : 판매중, 2:반려, 3검수요청, 4, 검수중
	private String state;
	private String reg_date;
	
	private String cate_nm;
	
	private String sc1_url;
	private String sc2_url;
	private String sc3_url;
	private String sc4_url;
	private String sc5_url;
	private String sc6_url;
	
	private String agid;
	
	// Mixed Object
	private String mem_id;
	private String eng_name;
	private String eng_comment;
	
	

	public String getEng_name() {
		return eng_name;
	}

	public void setEng_name(String eng_name) {
		this.eng_name = eng_name;
	}

	public String getEng_comment() {
		return eng_comment;
	}

	public void setEng_comment(String eng_comment) {
		this.eng_comment = eng_comment;
	}

	public String getMem_id() {
		return mem_id;
	}

	public void setMem_id(String mem_id) {
		this.mem_id = mem_id;
	}

	public String getCate_nm() {
		return cate_nm;
	}

	public void setCate_nm(String cate_nm) {
		this.cate_nm = cate_nm;
	}

	public void setPid(int pid) {
		this.pid = pid;
	}

	public int getPid() {
		return pid;
	}

	public int getMid() {
		return mid;
	}
	public void setMid(int mid) {
		this.mid = mid;
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
	public int getShare_gid() {
		return share_gid;
	}
	public void setShare_gid(int share_gid) {
		this.share_gid = share_gid;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	
	
	

	public int getP_type() {
		return p_type;
	}

	public void setP_type(int p_type) {
		this.p_type = p_type;
	}

	public int getPrice() {
		return price;
	}
	public void setPrice(int price) {
		this.price = price;
	}
	public int getSort() {
		return sort;
	}
	public void setSort(int sort) {
		this.sort = sort;
	}
	public String getComment() {
		return comment;
	}
	public void setComment(String comment) {
		this.comment = comment;
	}
	public String getComment_url() {
		return comment_url;
	}
	public void setComment_url(String comment_url) {
		this.comment_url = comment_url;
	}
	public String getThumb() {
		return thumb;
	}
	public void setThumb(String thumb) {
		this.thumb = thumb;
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

	public String getVideo_url() {
		return video_url;
	}

	public void setVideo_url(String video_url) {
		this.video_url = video_url;
	}
	
	
	

	public String getComment_spec() {
		return comment_spec;
	}

	public void setComment_spec(String comment_spec) {
		this.comment_spec = comment_spec;
	}

	public String getSc1_url() {
		return sc1_url;
	}

	public void setSc1_url(String sc1_url) {
		this.sc1_url = sc1_url;
	}

	public String getSc2_url() {
		return sc2_url;
	}

	public void setSc2_url(String sc2_url) {
		this.sc2_url = sc2_url;
	}

	public String getSc3_url() {
		return sc3_url;
	}

	public void setSc3_url(String sc3_url) {
		this.sc3_url = sc3_url;
	}

	public String getSc4_url() {
		return sc4_url;
	}

	public void setSc4_url(String sc4_url) {
		this.sc4_url = sc4_url;
	}

	public String getSc5_url() {
		return sc5_url;
	}

	public void setSc5_url(String sc5_url) {
		this.sc5_url = sc5_url;
	}

	public String getSc6_url() {
		return sc6_url;
	}

	public void setSc6_url(String sc6_url) {
		this.sc6_url = sc6_url;
	}

	public String getCom_name() {
		return com_name;
	}

	public void setCom_name(String com_name) {
		this.com_name = com_name;
	}

	public String getCom_logo_url() {
		return com_logo_url;
	}

	public void setCom_logo_url(String com_logo_url) {
		this.com_logo_url = com_logo_url;
	}

	public String getCom_tel() {
		return com_tel;
	}

	public void setCom_tel(String com_tel) {
		this.com_tel = com_tel;
	}

	public String getCom_email() {
		return com_email;
	}

	public void setCom_email(String com_email) {
		this.com_email = com_email;
	}

	public String getCom_homepage() {
		return com_homepage;
	}

	public void setCom_homepage(String com_homepage) {
		this.com_homepage = com_homepage;
	}

	public String toString() {
        return ToStringBuilder.reflectionToString(this);
    }

	public String getAgid() {
		return agid;
	}

	public void setAgid(String agid) {
		this.agid = agid;
	}

}
