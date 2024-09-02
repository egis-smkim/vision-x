/**
 * 
 */
package com.vision_x.vision_x.cloud.service.impl;

import org.springframework.stereotype.Repository;

import com.vision_x.vision_x.cloud.service.CloudFileVO;
import com.vision_x.vision_x.cloud.service.MapDataVO;

import egovframework.rte.psl.dataaccess.EgovAbstractMapper;

/**
 * CloudDAO.java
 * digitalTwin
 * 2021. 2. 26.
 * @author Khaia
 * @Comment
 *
 */
@Repository("cloudDAO")
public class CloudDAO extends EgovAbstractMapper {
	public int updateFileDataId(CloudFileVO fileVO) {
		return update("cloudDAO.updateFileDataId", fileVO);
	}
	
	public int insertCSVMapData(MapDataVO mapDataVO) {
		return insert("cloudDAO.insertCSVMapData", mapDataVO);
	}
	
	public int updateCSVMapDataWorkerId(MapDataVO mapDataVO) {
		return update("cloudDAO.updateCSVMapDataWorkerId", mapDataVO);
	}
	
	
	
}
