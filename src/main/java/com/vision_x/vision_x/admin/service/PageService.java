package com.vision_x.vision_x.admin.service;

import java.sql.SQLException;
import java.util.List;

/**
 * PageService.java
 * digitalTwin
 * 2020. 10. 20.
 * @author Khaia
 * @Comment
 *
 */
public interface PageService {
	public int insertPageItem(PageVO pageMasterVO) throws SQLException;
	
	public List<PageVO> selectPageList() throws SQLException;
	
	public PageVO selectPageItem(int pmid) throws SQLException;
	
	public int updatePageItem(PageVO pageVO) throws SQLException;
	
	public PageVO selectPageItemByUrl(String url) throws SQLException;
}
