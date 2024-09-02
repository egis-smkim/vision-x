/**
 * 
 */
package com.vision_x.vision_x.postgis.service.impl;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.vision_x.vision_x.postgis.service.PostGisService;
import com.vision_x.vision_x.utils.ProjVO;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

/**
 * PostGisServiceImpl.java
 * digitaltwincloud
 * 2021. 7. 1.
 * @author Khaia
 * @Comment
 *
 */
@Service("postGisService")
public class PostGisServiceImpl extends EgovAbstractServiceImpl implements PostGisService {
	@Resource(name="postGisDAO")
	private PostGisDAO postGisDAO;

	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.postgis.service.PostGisService#deleteLayerTable(java.lang.String, java.lang.String)
	 */
	@Override
	public int deleteLayerTable(String schemaAndtblName) throws SQLException {
		// TODO Auto-generated method stub
		return postGisDAO.deleteLayerTable(schemaAndtblName);
	}

	@Override
	public List<ProjVO> getProjectionInfo() {
		// TODO Auto-generated method stub
		return postGisDAO.getProjectionInfo();
	}

	@Override
	public List<ProjVO> getProjSearchInfo(String keyword) {
		// TODO Auto-generated method stub
		return postGisDAO.getProjSearchInfo(keyword);
	}

	@Override
	public ProjVO getPrjWktInfo(int code) {
		// TODO Auto-generated method stub
		return postGisDAO.getPrjWktInfo(code);
	}
	
	public List<HashMap<String, Object>> getTypDamageLocation(String location) {
		// TODO Auto-generated method stub
		return postGisDAO.getTypDamageLocation(location);
	}
	
	public List<HashMap<String, Object>> getTypDamageLocationSetTable(HashMap<String, String> param) {
		// TODO Auto-generated method stub
		return postGisDAO.getTypDamageLocationSetTable(param);
	}
	
	public List<HashMap<String, Object>> getTideLocation(String location) {
		// TODO Auto-generated method stub
		return postGisDAO.getTideLocation(location);
	}

	@Override
	public HashMap<String, String> getShp3dsProps(HashMap<String, String> param) {
		// TODO Auto-generated method stub
		return postGisDAO.getShp3dsProps(param);
	}

	@Override
	public List<HashMap<String, Object>> get3dsFileInfo(HashMap<String, String> param) {
		// TODO Auto-generated method stub
		return postGisDAO.get3dsFileInfo(param);
	}

	@Override
	public int update3dsObjInfo(HashMap<String, Object> param) {
		// TODO Auto-generated method stub
		return postGisDAO.update3dsObjInfo(param);
	}

	@Override
	public HashMap<String, Object> getMaxHeight(HashMap<String, String> param) {
		// TODO Auto-generated method stub
		return postGisDAO.getMaxHeight(param);
	}
	
	
	
}