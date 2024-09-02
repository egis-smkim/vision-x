package com.vision_x.vision_x.message.dto;

public class CsvTopicMessage {
	
	private String inputPath;
	private String encoding;
    private String schema;
    private String table;
    private int epsgCode;
    private int lonIndx;
    private int latIndx;
    private int type;
    private int addressIndx;
    private String srText;
    private String subscribe;
	
    
    public String getsrText() {
    	return this.srText;
    }
    public void setsrText(String srText) {
    	this.srText = srText;
    }
    public String getSubscribe() {
		return subscribe;
	}
	public void setSubscribe(String subscribe) {
		this.subscribe = subscribe;
	}
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
	public String getSchema() {
		return schema;
	}
	public void setSchema(String schema) {
		this.schema = schema;
	}
	public String getTable() {
		return table;
	}
	public void setTable(String table) {
		this.table = table;
	}
	public int getEpsgCode() {
		return epsgCode;
	}
	public void setEpsgCode(int epsgCode) {
		this.epsgCode = epsgCode;
	}
	public int getLonIndx() {
		return lonIndx;
	}
	public void setLonIndx(int lonIndx) {
		this.lonIndx = lonIndx;
	}
	public int getLatIndx() {
		return latIndx;
	}
	public void setLatIndx(int latIndx) {
		this.latIndx = latIndx;
	}
	public int getType() {
		return type;
	}
	public void setType(int type) {
		this.type = type;
	}
	public int getAddressIndx() {
		return addressIndx;
	}
	public void setAddressIndx(int addressIndx) {
		this.addressIndx = addressIndx;
	}
	
}
