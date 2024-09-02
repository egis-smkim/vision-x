package com.vision_x.vision_x.admin.service;

import java.sql.SQLException;
import java.util.List;

import com.vision_x.vision_x.common.service.LogTrackerVO;

public interface AdminLogTrackerService {
	
	public List<LogTrackerVO> selectLogTrackerList() throws SQLException;
}
