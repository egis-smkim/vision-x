package com.vision_x.vision_x.message.dto;

public class CityGmlMessage {

	private String input;
    private String output;
    private int srid;
    private int level;
    private String projtext;
    private String subscribe;
    private boolean hdfscheck;
	
	public String getInput() {
		return input;
	}
	public void setInput(String input) {
		this.input = input;
	}
	public String getOutput() {
		return output;
	}
	public void setOutput(String output) {
		this.output = output;
	}
	public int getSrid() {
		return srid;
	}
	public void setSrid(int srid) {
		this.srid = srid;
	}
	public int getLevel() {
		return level;
	}
	public void setLevel(int level) {
		this.level = level;
	}
	public String getProjtext() {
		return projtext;
	}
	public void setProjtext(String projtext) {
		this.projtext = projtext;
	}
	public String getSubscribe() {
		return subscribe;
	}
	public void setSubscribe(String subscribe) {
		this.subscribe = subscribe;
	}
	public boolean isHdfscheck() {
		return hdfscheck;
	}
	public void setHdfscheck(boolean hdfscheck) {
		this.hdfscheck = hdfscheck;
	}
	
	
}
