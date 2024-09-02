package com.vision_x.vision_x.admin.service;

import java.sql.SQLException;
import java.util.List;

/**
 * CollaborationService.java
 * digitalTwin
 * 2020. 10. 20.
 * @author Khaia
 * @Comment
 *
 */
public interface CollabotrationService {
	public int insertCollaboration(CollaborationVO collaborationVO);
	
	public List<CollaborationVO> selectCollaborationList() throws SQLException;
	
	public CollaborationVO selectCollaborationItem(CollaborationVO collaborationVO);
	
	public int updateCollaborationItem(CollaborationVO collaborationVO);
	
	public int deleteCollaborationItem(CollaborationVO collaborationVO);
	
}