package com.vision_x.vision_x.message.dto;

public class ShpFilterMessage {

	private String inputPath;
    private String encoding;
    private String topic;
    private String epsgCode;
    private String srText;
    
	public String getInputPath() {
		return inputPath;
	}
	public void setInputPath(String inputPath) {
		this.inputPath = inputPath;
	}
	public String getEncoding() {
		return encoding;
	}
	public void setEncoding(String encoding) {
		this.encoding = encoding;
	}
	public String getTopic() {
		return topic;
	}
	public void setTopic(String topic) {
		this.topic = topic;
	}
	public String getEpsgCode() {
		return epsgCode;
	}
	public void setEpsgCode(String epsgCode) {
		this.epsgCode = epsgCode;
	}
	public String getSrText() {
		return srText;
	}
	public void setSrText(String srText) {
		this.srText = srText;
	}
    
    
}
