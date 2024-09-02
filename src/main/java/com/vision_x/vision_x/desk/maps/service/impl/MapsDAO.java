/**
 * 
 */
package com.vision_x.vision_x.desk.maps.service.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.vision_x.vision_x.desk.maps.service.MapsVO;

import egovframework.rte.psl.dataaccess.EgovAbstractMapper;

/**
 * MapsDAO.java
 * digitalTwin
 * 2021. 3. 16.
 * @author Khaia
 * @Comment
 *
 */

@Repository("mapsDAO")
public class MapsDAO extends EgovAbstractMapper {
	
	public int createNewMap(MapsVO mapsVO) {
		return insert("mapsDAO.createNewMap", mapsVO);
	}
	
	public int getMemberMapsCount(MapsVO mapsVO) {
		return selectOne("mapsDAO.getMemberMapsCount", mapsVO);
	}
	
	public List<MapsVO> getMemberMapList(MapsVO mapsVO) {
		return selectList("mapsDAO.getMemberMapList", mapsVO);
	}
	
	public MapsVO getMapData(MapsVO mapsVO) {
		return selectOne("mapsDAO.getMapData", mapsVO);
	}
	
	public MapsVO selectMemberTargetMapCount(MapsVO mapsVO) {
		return selectOne("mapsDAO.selectMemberTargetMapCount", mapsVO);
	}
	
	public int deleteMap(MapsVO mapsVO) {
		return delete("mapsDAO.deleteMap", mapsVO);
	}
	
	public int updateMapLayer(MapsVO mapsVO) {
		return update("mapsDAO.updateMapLayer", mapsVO);
	}
	
	public int updateMapTitleAndLayer(MapsVO mapsVO) {
		return update("mapsDAO.updateMapTitleAndLayer", mapsVO);
	}

	public List<MapsVO> checkLayerGroupUse(int lgid) {
		// TODO Auto-generated method stub
		return selectList("mapsDAO.checkLayerGroupUse", lgid);
	}

	public List<MapsVO> checkLegendUse(int lid) {
		// TODO Auto-generated method stub
		return selectList("mapsDAO.checkLegendUse", lid);
	}

	public int updateLid(MapsVO mapsVO) {
		// TODO Auto-generated method stub
		return update("mapsDAO.updateLid", mapsVO);
	}
}
