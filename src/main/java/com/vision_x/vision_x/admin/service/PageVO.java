package com.vision_x.vision_x.admin.service;

import org.apache.commons.lang.builder.ToStringBuilder;

/**
 * PageVO.java
 * digitalTwin
 * 2020. 10. 20.
 * @author Khaia
 * @Comment
 *
 */
public class PageVO {
	private int pmid;
	private String name;
	private String root_url;
	private String type;
	private String code;
	
	private int level;
	private int menu_order;
	
	public int getPmid() {
		return pmid;
	}
	public void setPmid(int pmid) {
		this.pmid = pmid;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getRoot_url() {
		return root_url;
	}
	public void setRoot_url(String root_url) {
		this.root_url = root_url;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	
	public int getLevel() {
		return level;
	}
	public void setLevel(int level) {
		this.level = level;
	}
	public int getMenu_order() {
		return menu_order;
	}
	
	public void setMenu_order(int menu_order) {
		this.menu_order = menu_order;
	}
	
	public String toString() {
        return ToStringBuilder.reflectionToString(this);
    }
}
