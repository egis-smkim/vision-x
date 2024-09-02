package com.vision_x.vision_x.desk.board.service.impl;

import java.sql.SQLException;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.vision_x.vision_x.desk.board.service.BoardFileVO;

import egovframework.rte.psl.dataaccess.EgovAbstractMapper;

@Repository("boardFileDAO")
public class BoardFileDAO extends EgovAbstractMapper{
	
    public int insertBoardFile(BoardFileVO boardFileVO) throws SQLException{
    	return insert("boardFileDAO.insertBoardFile", boardFileVO);
    }

    public List<BoardFileVO> viewBoardFile(int bid) throws SQLException{
    	return selectList("boardFileDAO.viewBoardFile", bid);
    }
    
    public BoardFileVO boardFileInfo(int fid) throws SQLException {
    	return selectOne("boardFileDAO.boardFileInfo", fid);
	}
    
    public int deleteBoardFile(BoardFileVO boardFileVO) throws SQLException{
    	return delete("boardFileDAO.deleteBoardFile", boardFileVO);
    }
    
    public int deleteFile(BoardFileVO boardFileVO) throws SQLException{
    	return delete("boardFileDAO.deleteFile", boardFileVO);
    }
}
