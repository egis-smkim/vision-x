/**
 * 
 */
package com.vision_x.vision_x.desk.maps.service;

import java.util.List;

/**
 * MapsService.java
 * digitalTwin
 * 2021. 3. 16.
 * @author Khaia
 * @Comment
 *
 */
public interface MapsService {
	public int createNewMap(MapsVO mapsVO);
	
	public int getMemberMapsCount(MapsVO mapsVO);
	
	public List<MapsVO> getMemberMapList(MapsVO mapsVO);
	
	public MapsVO getMapData(MapsVO mapsVO);

	public int deleteMap(MapsVO mapsVO);
	
	public int updateMapLayer(MapsVO mapsVO);
	
	public int updateMapTitleAndLayer(MapsVO mapsVO);
	
	public MapsVO selectMemberTargetMapCount(MapsVO mapsVO);

	public List<MapsVO> checkLayerGroupUse(int lgid);

	public List<MapsVO> checkLegendUse(int lid);

	public int updateLid(MapsVO mapsVO);
}