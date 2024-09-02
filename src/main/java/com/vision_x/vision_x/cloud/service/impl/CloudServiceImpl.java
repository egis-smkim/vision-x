/**
 * 
 */
package com.vision_x.vision_x.cloud.service.impl;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.vision_x.vision_x.cloud.service.CloudService;
import com.vision_x.vision_x.cloud.service.CloudFileVO;
import com.vision_x.vision_x.cloud.service.MapDataVO;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

/**
 * CloudServiceImpl.java
 * digitalTwin
 * 2021. 2. 26.
 * @author Khaia
 * @Comment
 *
 */
@Service("cloudService")
public class CloudServiceImpl extends EgovAbstractServiceImpl implements CloudService {
	
	@Resource(name="cloudDAO")
	private CloudDAO cloudDAO;
	
	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.cloud.service.CloudService#updateFileDataId(com.vision_x.vision_x.cloud.service.FileVO)
	 */
	@Override
	public int updateFileDataId(CloudFileVO fileVO) {
		// TODO Auto-generated method stub
		return cloudDAO.updateFileDataId(fileVO);
	}
	
	

	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.cloud.service.CloudService#insertCSVMapData(com.vision_x.vision_x.cloud.service.MapDataVO)
	 */
	@Override
	public int insertCSVMapData(MapDataVO mapDataVO) {
		// TODO Auto-generated method stub
		return cloudDAO.insertCSVMapData(mapDataVO);
	}

	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.cloud.service.CloudService#updateCSVMapDataWorkerId(com.vision_x.vision_x.cloud.service.MapDataVO)
	 */
	@Override
	public int updateCSVMapDataWorkerId(MapDataVO mapDataVO) {
		// TODO Auto-generated method stub
		return cloudDAO.updateCSVMapDataWorkerId(mapDataVO);
	}



	

}
