/**
 * 
 */
package com.vision_x.vision_x.common.service.impl;

import java.sql.SQLException;

import org.springframework.stereotype.Repository;

import com.vision_x.vision_x.common.service.LogTrackerVO;

import egovframework.rte.psl.dataaccess.EgovAbstractMapper;

/**
 * LogTrackerDAO.java
 * digitaltwincloud
 * 2022. 3. 29.
 * @author Khaia
 * @Comment
 *
 */
@Repository("logTrackerDAO")
public class LogTrackerDAO extends EgovAbstractMapper {
	public int insertLogTracker(LogTrackerVO logTrackerVO) throws SQLException {
		return insert("logTrackerDAO.insertLogTracker", logTrackerVO);
	}
}
