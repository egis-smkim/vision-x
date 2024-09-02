/**
 * 
 */
package com.vision_x.vision_x.desk.developer.impl;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.vision_x.vision_x.desk.developer.service.AppDeveloperService;
import com.vision_x.vision_x.desk.developer.service.AppDeveloperVO;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

/**
 * AppDeveloperServiceImpl.java
 * digitaltwincloud
 * 2021. 12. 28.
 * @author Khaia
 * @Comment
 *
 */
@Service("appDeveloperService")
public class AppDeveloperServiceImpl extends EgovAbstractServiceImpl implements AppDeveloperService {
	@Resource(name="appDeveloperDAO")
	private AppDeveloperDAO appDeveloperDAO;

	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.desk.developer.service.AppDeveloperService#getDeveloperInfo(int)
	 */
	@Override
	public AppDeveloperVO getDeveloperInfo(int mid) {
		// TODO Auto-generated method stub
		return appDeveloperDAO.getDeveloperInfo(mid);
	}
	
	@Override
	public int createDeveloper(AppDeveloperVO appDeveloperVO) {
		// TODO Auto-generated method stub
		return appDeveloperDAO.createDeveloper(appDeveloperVO);
	}
	
	@Override
	public int updateDeveloper(AppDeveloperVO appDeveloperVO) {
		// TODO Auto-generated method stub
		return appDeveloperDAO.updateDeveloper(appDeveloperVO);
	}
}
