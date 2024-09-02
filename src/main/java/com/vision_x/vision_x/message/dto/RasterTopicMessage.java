package com.vision_x.vision_x.message.dto;

public class RasterTopicMessage {

	private int dataId;
	private String dataName;
	private String inputPath;
	private String outputPath;
	private int state;
	
	public int getDataId() {
		return dataId;
	}
	public void setDataId(int dataId) {
		this.dataId = dataId;
	}
	public String getDataName() {
		return dataName;
	}
	public void setDataName(String dataName) {
		this.dataName = dataName;
	}
	public String getInputPath() {
		return inputPath;
	}
	public void setInputPath(String inputPath) {
		this.inputPath = inputPath;
	}
	public String getOutputPath() {
		return outputPath;
	}
	public void setOutputPath(String outputPath) {
		this.outputPath = outputPath;
	}
	public int getState() {
		return state;
	}
	public void setState(int state) {
		this.state = state;
	}
	
	public RasterTopicMessage(int dataId, String dataName, String inputPath, String outputPath, int state) {
		super();
		this.dataId = dataId;
		this.dataName = dataName;
		this.inputPath = inputPath;
		this.outputPath = outputPath;
		this.state = state;
	}
	
}
