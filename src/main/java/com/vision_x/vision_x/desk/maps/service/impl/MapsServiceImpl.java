/**
 * 
 */
package com.vision_x.vision_x.desk.maps.service.impl;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.vision_x.vision_x.desk.maps.service.MapsService;
import com.vision_x.vision_x.desk.maps.service.MapsVO;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

/**
 * MapsServiceImpl.java
 * digitalTwin
 * 2021. 3. 16.
 * @author Khaia
 * @Comment
 *
 */
@Service("mapsService")
public class MapsServiceImpl extends EgovAbstractServiceImpl implements MapsService {
	
	@Resource(name="mapsDAO")
	private MapsDAO mapsDAO;

	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.desk.maps.service.MapsService#createNewMap(com.vision_x.vision_x.desk.maps.service.impl.MapsVO)
	 */
	@Override
	public int createNewMap(MapsVO mapsVO) {
		// TODO Auto-generated method stub
		return mapsDAO.createNewMap(mapsVO);
	}

	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.desk.maps.service.MapsService#getMemberMapCount(int)
	 */
	@Override
	public int getMemberMapsCount(MapsVO mapsVO) {
		// TODO Auto-generated method stub
		return mapsDAO.getMemberMapsCount(mapsVO);
	}

	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.desk.maps.service.MapsService#getMemberMapList(int)
	 */
	@Override
	public List<MapsVO> getMemberMapList(MapsVO mapsVO) {
		// TODO Auto-generated method stub
		return mapsDAO.getMemberMapList(mapsVO);
	}

	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.desk.maps.service.MapsService#getMapData(int)
	 */
	@Override
	public MapsVO getMapData(MapsVO mapsVO) {
		// TODO Auto-generated method stub
		return mapsDAO.getMapData(mapsVO);
	}
	
	@Override
	public int deleteMap(MapsVO mapsVO) {
		// TODO Auto-generated method stub
		return mapsDAO.deleteMap(mapsVO);
	}

	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.desk.maps.service.MapsService#updateMapLayer(com.vision_x.vision_x.desk.maps.service.MapsVO)
	 */
	@Override
	public int updateMapLayer(MapsVO mapsVO) {
		// TODO Auto-generated method stub
		return mapsDAO.updateMapLayer(mapsVO);
	}

	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.desk.maps.service.MapsService#updateMapTitleAndLayer(com.vision_x.vision_x.desk.maps.service.MapsVO)
	 */
	@Override
	public int updateMapTitleAndLayer(MapsVO mapsVO) {
		// TODO Auto-generated method stub
		return mapsDAO.updateMapTitleAndLayer(mapsVO);
	}

	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.desk.maps.service.MapsService#selectMemberTargetMapCount(com.vision_x.vision_x.desk.maps.service.MapsVO)
	 */
	@Override
	public MapsVO selectMemberTargetMapCount(MapsVO mapsVO) {
		// TODO Auto-generated method stub
		return mapsDAO.selectMemberTargetMapCount(mapsVO);
	}

	@Override
	public List<MapsVO> checkLayerGroupUse(int lgid) {
		// TODO Auto-generated method stub
		return mapsDAO.checkLayerGroupUse(lgid);
	}

	@Override
	public List<MapsVO> checkLegendUse(int lid) {
		// TODO Auto-generated method stub
		return mapsDAO.checkLegendUse(lid);
	}

	@Override
	public int updateLid(MapsVO mapsVO) {
		// TODO Auto-generated method stub
		return mapsDAO.updateLid(mapsVO);
	}
	

}
