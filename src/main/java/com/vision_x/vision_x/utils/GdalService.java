/**
 * 
 */
package com.vision_x.vision_x.utils;

import java.util.HashMap;
import java.util.List;

import org.json.JSONObject;

/**
 * GdalService.java
 * digitalTwin
 * 2021. 3. 31.
 * @author Khaia
 * @Comment
 *
 */
public interface GdalService {
	public boolean createRasterThumbnail(String source, String dest, int width, int height);
	
	public JSONObject getRasterExtentInfo(String source);
	
	public JSONObject getTerrainExtentInfo(String source);
	
	public JSONObject getErdasImagineInfo(String source);
	
	public String getOgcWktStr(String path);
	
	public int getCrsInfoWithPrj(String path, String fileName);
	
	public List<HashMap<String, String>> convertDxfToShp(String path, String fileName, String geoType, String epsgCode, String encode);
	
	public boolean convertToPostgresql(String path, String fileName, String epsgCode, String datastore,String layerName);
}
