/**
 * 
 */
package com.vision_x.vision_x.cloud.service;

/**
 * CloudService.java
 * digitalTwin
 * 2021. 2. 26.
 * @author Khaia
 * @Comment
 *
 */
public interface CloudService {
	public int updateFileDataId(CloudFileVO fileVO);
	
	public int insertCSVMapData(MapDataVO mapDataVO);
	
	public int updateCSVMapDataWorkerId(MapDataVO mapDataVO);
}
