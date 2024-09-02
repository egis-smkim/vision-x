/**
 * 
 */
package com.vision_x.vision_x.desk.developer.impl;

import org.springframework.stereotype.Repository;

import com.vision_x.vision_x.desk.developer.service.AppDeveloperVO;

import egovframework.rte.psl.dataaccess.EgovAbstractMapper;

/**
 * AppDeveloperDAO.java
 * digitaltwincloud
 * 2021. 12. 28.
 * @author Khaia
 * @Comment
 *
 */
@Repository("appDeveloperDAO")
public class AppDeveloperDAO extends EgovAbstractMapper {
	
	public AppDeveloperVO getDeveloperInfo(int mid) {
		return selectOne("appDeveloperDAO.getDeveloperInfo", mid);
	}
	
	public int createDeveloper(AppDeveloperVO appDeveloperVO) {
		return insert("appDeveloperDAO.createDeveloper", appDeveloperVO);
	}
	
	public int updateDeveloper(AppDeveloperVO appDeveloperVO) {
		return update("appDeveloperDAO.updateDeveloper", appDeveloperVO);
	}
	
}
