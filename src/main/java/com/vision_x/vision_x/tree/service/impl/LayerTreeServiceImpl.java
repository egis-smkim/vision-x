package com.vision_x.vision_x.tree.service.impl;

import java.sql.SQLException;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.vision_x.vision_x.tree.service.LayerTreeService;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("layerTreeService")
public class LayerTreeServiceImpl extends EgovAbstractServiceImpl implements LayerTreeService {

	@Resource(name="layerTreeDAO")
	private LayerTreeDAO layerTreeDAO;
	
	@Override
	public int insertLayerInfo(LayerTreeVO vo) {
		return layerTreeDAO.insertLayerInfo(vo);
	}

	@Override
	public LayerTreeVO getLayerTreeInfo(LayerTreeVO vo) throws SQLException {
		return layerTreeDAO.getLayerTreeInfo(vo);
	}

	@Override
	public List<LayerTreeVO> getMyLayerGroupList(int mid) {
		// TODO Auto-generated method stub
		return layerTreeDAO.getMyLayerGroupList(mid);
	}

	@Override
	public int updateLayerGroupName(LayerTreeVO vo) {
		// TODO Auto-generated method stub
		return layerTreeDAO.updateLayerGroupName(vo);
	}

	@Override
	public int deleteLayerGroup(int lgid) {
		// TODO Auto-generated method stub
		return layerTreeDAO.deleteLayerGroup(lgid);
	}

	@Override
	public LayerTreeVO getLayerGroupInfo(LayerTreeVO vo) {
		// TODO Auto-generated method stub
		return layerTreeDAO.getLayerGroupInfo(vo);
	}



}
