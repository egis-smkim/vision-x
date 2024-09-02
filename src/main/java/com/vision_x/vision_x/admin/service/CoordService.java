/**
 * 
 */
package com.vision_x.vision_x.admin.service;

import java.sql.SQLException;
import java.util.List;

/**
 * CoordService.java
 * digitalTwin
 * 2020. 11. 2.
 * @author Khaia
 * @Comment
 *
 */
public interface CoordService {
	public int insertCoordItem(CoordVO coordVO) throws SQLException;
	
	public List<CoordVO> selectCoordList() throws SQLException;
	
	public CoordVO selectCoordItem(int crdid) throws SQLException;
	
	public int updateCoordItem(CoordVO coordVO) throws SQLException;
	
	public CoordVO getCoordsInfo(int opt_value);
	
	public CoordVO getCoordInfoByEPSG(CoordVO coordVO);

}
