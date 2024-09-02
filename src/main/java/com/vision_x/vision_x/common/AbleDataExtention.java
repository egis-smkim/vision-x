package com.vision_x.vision_x.common;

public enum AbleDataExtention {
	DBF("DBF"),
	PRJ("PRJ"),
	SBN("SBN"),
	SBX("SBX"),
	SHP("SHP"),
	XML("XML"),
	SHX("SHX"),
	XLS("XLS"),
	IMG("IMG"),
	RRD("RRD"),
	CSV("CSV"),
	GPX("GPX"),
	TIF("TIF"),
	TIFF("TIFF"),
	IGE("IGE"),
	ECW("ECW"),
	EWW("EWW"),
	QPJ("QPJ"),
	LAS("LAS"),
	LAZ("LAZ"),
	JPG("JPG"),
	ZIP("ZIP"),
	QIX("QIX"),
	TFW("TFW"),
	KMZ("KMZ"),
	DWG("DWG"),
	SKP("SKP"),
	MTL("MTL"),
	OBJ("OBJ"),
	IFC("IFC"),
	CPG("CPG"),
	XLSX("XLSX"),
	MODEL_3DS("3DS"),
	DEM("DEM"),
	BIL("BIL"),
	DT2("DT2"),
	PNG("PNG"),
	ADF("ADF"),
	FLT("FLT"),
	JSON("JSON"),
	DXF("DXF"),
	GEOJSON("GEOJSON");

	final private String extention;

	private AbleDataExtention(String extName) {
		this.extention = extName;
	}

	public String getExtention() {
		return extention;
	}
}
