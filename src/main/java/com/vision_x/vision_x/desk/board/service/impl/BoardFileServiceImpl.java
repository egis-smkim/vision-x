package com.vision_x.vision_x.desk.board.service.impl;

import java.sql.SQLException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vision_x.vision_x.desk.board.service.BoardFileService;
import com.vision_x.vision_x.desk.board.service.BoardFileVO;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("boardFileService")
public class BoardFileServiceImpl extends EgovAbstractServiceImpl implements BoardFileService {
	@Autowired
	private BoardFileDAO boardFileDAO;
 
    @Override
    public int insertBoardFile(BoardFileVO boardFileVO) throws SQLException {
        return boardFileDAO.insertBoardFile(boardFileVO);
    }

    @Override
    public List<BoardFileVO> viewBoardFile(int bid) throws SQLException {
        return boardFileDAO.viewBoardFile(bid);
    }

	@Override
	public BoardFileVO boardFileInfo(int fid) throws SQLException {
		// TODO Auto-generated method stub
		return boardFileDAO.boardFileInfo(fid);
	}
	
	@Override
    public int deleteBoardFile(BoardFileVO boardFileVO) throws SQLException {
        return boardFileDAO.deleteBoardFile(boardFileVO);
    }
	
	@Override
    public int deleteFile(BoardFileVO boardFileVO) throws SQLException {
        return boardFileDAO.deleteFile(boardFileVO);
    }
}
