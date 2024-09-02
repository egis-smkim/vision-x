/**
 * 
 */
package com.vision_x.vision_x.common.service.impl;

import java.sql.SQLException;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.vision_x.vision_x.common.service.LogTrackerService;
import com.vision_x.vision_x.common.service.LogTrackerVO;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

/**
 * LogTrackerServiceImpl.java
 * digitaltwincloud
 * 2022. 3. 24.
 * @author Khaia
 * @Comment
 *
 */
@Service("logTrackerService")
public class LogTrackerServiceImpl extends EgovAbstractServiceImpl implements LogTrackerService {
	
	@Resource(name="logTrackerDAO")
	
	private LogTrackerDAO logTrackerDAO;

	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.common.service.LogTrackerService#insertLogTracker(com.vision_x.vision_x.common.service.LogTrackerVO)
	 */
	@Override
	public int insertLogTracker(LogTrackerVO logTrackerVO) throws SQLException {
		// TODO Auto-generated method stub
		return logTrackerDAO.insertLogTracker(logTrackerVO);
	}

}
