package com.vision_x.vision_x.desk.board.service;

import java.sql.SQLException;
import java.util.List;

public interface BoardFileService {
	
	public int insertBoardFile(BoardFileVO boardFileVO) throws SQLException;
	
	public List<BoardFileVO> viewBoardFile(int bid) throws SQLException;
	
	public BoardFileVO boardFileInfo(int fid) throws SQLException;
	
	public int deleteBoardFile(BoardFileVO boardFileVO) throws SQLException;
	
	public int deleteFile(BoardFileVO boardFileVO) throws SQLException;
}
