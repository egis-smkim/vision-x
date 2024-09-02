


package com.vision_x.vision_x.utils;

import java.io.Serializable;

import org.apache.commons.lang.builder.ToStringBuilder;

/**
 * SessionVO.java
 * digitalTwin
 * 2020. 10. 20.
 * @author Khaia
 * @Comment
 *
 */

public class SessionVO implements Serializable {

	
	private static final long serialVersionUID = 1L;
	
	private int sessMid;
	private String sessEncryMid;
	private String sessMemId;
	private String sessMemAuthCode;
	private String sessMemEmail;
	private int sessMapid;
	private int sessDlid;
	private int dsid;
	
	private int sessMemLevel;
	
	public int getSessMid() {
		return sessMid;
	}
	public void setSessMid(int sessMid) {
		this.sessMid = sessMid;
	}
	public String getSessEncryMid() {
		return sessEncryMid;
	}
	public void setSessEncryMid(String sessEncryMid) {
		this.sessEncryMid = sessEncryMid;
	}
	public String getSessMemId() {
		return sessMemId;
	}
	public void setSessMemId(String sessMemId) {
		this.sessMemId = sessMemId;
	}
	public String getSessMemAuthCode() {
		return sessMemAuthCode;
	}
	public void setSessMemAuthCode(String sessMemAuthCode) {
		this.sessMemAuthCode = sessMemAuthCode;
	}
		
	public String getSessMemEmail() {
		return sessMemEmail;
	}
	public void setSessMemEmail(String sessMemEmail) {
		this.sessMemEmail = sessMemEmail;
	}
	
	public int getSessMemLevel() {
		return sessMemLevel;
	}
	public void setSessMemLevel(int sessMemLevel) {
		this.sessMemLevel = sessMemLevel;
	}
	
	public int getSessDlid() {
		return sessDlid;
	}
	public void setSessDlid(int sessDlid) {
		this.sessDlid = sessDlid;
	}
	
	public int getSessMapid() {
		return sessMapid;
	}
	public void setSessMapid(int sessMapid) {
		this.sessMapid = sessMapid;
	}
	public static long getSerialversionuid() {
		return serialVersionUID;
	}
	
	public int getDsid() {
		return dsid;
	}
	public void setDsid(int dsid) {
		this.dsid = dsid;
	}
	public String toString() {
        return ToStringBuilder.reflectionToString(this);
    }
}