package com.vision_x.vision_x.tree.service;

import java.sql.SQLException;
import java.util.List;

import com.vision_x.vision_x.tree.service.impl.LayerTreeVO;

public interface LayerTreeService {

	public int insertLayerInfo(LayerTreeVO vo) throws SQLException;
	public LayerTreeVO getLayerTreeInfo(LayerTreeVO vo) throws SQLException;
	public List<LayerTreeVO> getMyLayerGroupList(int mid);
	public int updateLayerGroupName(LayerTreeVO vo);
	public int deleteLayerGroup(int lgid);
	public LayerTreeVO getLayerGroupInfo(LayerTreeVO vo);
}
