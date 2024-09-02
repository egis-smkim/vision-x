package com.vision_x.vision_x.tree.service.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import egovframework.rte.psl.dataaccess.EgovAbstractMapper;

@Repository("layerTreeDAO")
public class LayerTreeDAO extends EgovAbstractMapper {

	public int insertLayerInfo(LayerTreeVO vo) {
		return insert("layerTreeDAO.insertLayerInfo", vo);
	}
	
	public LayerTreeVO getLayerTreeInfo(LayerTreeVO vo) {
		return selectOne("layerTreeDAO.getLayerTreeInfo",vo);
	}

	public List<LayerTreeVO> getMyLayerGroupList(int mid) {
		// TODO Auto-generated method stub
		return selectList("layerTreeDAO.getMyLayerGroupList",mid);
	}

	public int updateLayerGroupName(LayerTreeVO vo) {
		// TODO Auto-generated method stub
		return update("layerTreeDAO.updateLayerGroupName",vo);
	}

	public int deleteLayerGroup(int lgid) {
		// TODO Auto-generated method stub
		return update("layerTreeDAO.deleteLayerGroup",lgid);
	}

	public LayerTreeVO getLayerGroupInfo(LayerTreeVO vo) {
		// TODO Auto-generated method stub
		return selectOne("layerTreeDAO.getLayerGroupInfo",vo);
	}
}
