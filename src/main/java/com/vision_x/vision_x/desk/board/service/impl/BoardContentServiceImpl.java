package com.vision_x.vision_x.desk.board.service.impl;

import java.sql.SQLException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vision_x.vision_x.desk.board.service.BoardContentService;
import com.vision_x.vision_x.desk.board.service.BoardContentVO;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("boardContentService")
public class BoardContentServiceImpl extends EgovAbstractServiceImpl implements BoardContentService {
	
	@Autowired
	private BoardContentDAO boardContentDAO;
   
    // 게시글쓰기
    @Override
    public int insertBoard(BoardContentVO vo) throws SQLException {
        return boardContentDAO.insertBoard(vo);
    }
    // 게시글 상세보기
    @Override
    public BoardContentVO viewBoard(int bid) throws SQLException {
        return boardContentDAO.viewBoard(bid);
    }
    // 게시글 수정
    @Override
    public int updateBoard(BoardContentVO vo) throws SQLException {
    	return boardContentDAO.updateBoard(vo);
    }
    // 게시글 삭제
    @Override
    public int deleteBoard(BoardContentVO vo) throws SQLException {
    	return boardContentDAO.deleteBoard(vo);
    }
    // 게시글 전체 목록
    @Override
    public List<BoardContentVO> listAll(BoardContentVO vo) throws SQLException {
        return boardContentDAO.listAll(vo);
    }
    // 게시글 조회수 증가
    @Override
    public int increaseViewCnt(int bid) throws SQLException {
    	return boardContentDAO.increaseViewCnt(bid);
    }
    // 댓글수 조회
    @Override
    public int countComment(int bid) throws SQLException {
    	return boardContentDAO.countComment(bid);
    }
    //이전글, 다음글 조회
	@Override
	public BoardContentVO movePage(BoardContentVO vo) throws SQLException {
		return boardContentDAO.movePage(vo);
	}
	 // 게시판 별 글 개수 조회
	@Override
	public int countBoard(int bmid) throws SQLException {
		return boardContentDAO.countBoard(bmid);
	}
	@Override
	public int deleteAllBoardContent(int bmid) throws SQLException {
		return boardContentDAO.deleteAllBoardContent(bmid);
	}
	@Override
	public List<BoardContentVO> listByBracket(BoardContentVO boardContentVO) {
		// TODO Auto-generated method stub
		return boardContentDAO.listByBracket(boardContentVO);
	}
	
}
