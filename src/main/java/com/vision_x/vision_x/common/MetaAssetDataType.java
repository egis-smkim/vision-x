/**
 * 
 */
package com.vision_x.vision_x.common;

/**
 * MetaAssetDataType.java
 * digitaltwincloud
 * 2022. 1. 18.
 * @author Khaia
 * @Comment
 *
 */
public enum MetaAssetDataType {
	T("TERRAIN"),
	I("IMAGE"),
	F("FACILITY"),
	P("포인트클라우드"),
	S("SHAPE"),
	L("LOOD MODEL"),
	D("3DS MODEL"),
	O("OBJECT MODEL"),
	C("CSV"),
	E("EXCEL");
	
	final private String data_type;
	
	private MetaAssetDataType(String data_type) {
		this.data_type = data_type;
	}
	
	public String getData_type() {
		return data_type;
	}
}
