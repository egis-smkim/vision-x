/**
 * 
 */
package com.vision_x.vision_x.common.service;

import java.sql.SQLException;

/**
 * LogTrackerService.java
 * digitaltwincloud
 * 2022. 3. 24.
 * @author Khaia
 * @Comment
 *
 */
public interface LogTrackerService {
	
	public int insertLogTracker(LogTrackerVO logTrackerVO) throws SQLException; 
	
}
