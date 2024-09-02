package com.vision_x.vision_x.admin.service;

import java.sql.SQLException;
import java.util.List;

public interface BoardMasterService {
	public int insertBoardItem(BoardMasterVO boardMasterVO) throws SQLException;
	
	public List<BoardMasterVO> selectBoardList() throws SQLException;
	
	public BoardMasterVO selectBoardItem(String slug) throws SQLException;
	
	public int updateBoardItem(BoardMasterVO boardMasterVO) throws SQLException;

	public int deleteBoard(BoardMasterVO boardMasterVO) throws SQLException;

	public int slugCheck(String slug) throws SQLException;

	public BoardMasterVO selectBoardItemId(int bmid) throws SQLException;
}
