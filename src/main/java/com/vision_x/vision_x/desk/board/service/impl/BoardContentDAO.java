package com.vision_x.vision_x.desk.board.service.impl;

import java.sql.SQLException;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.vision_x.vision_x.desk.board.service.BoardContentVO;

import egovframework.rte.psl.dataaccess.EgovAbstractMapper;

@Repository("boardContentDAO")
public class BoardContentDAO extends EgovAbstractMapper{

	// 게시글 작성
    public int insertBoard(BoardContentVO vo) throws SQLException{
    	return insert("boardContentDAO.insertBoard", vo);
    }
    // 게시글 상세보기
    public BoardContentVO viewBoard(int bid) throws SQLException{
    	return selectOne("boardContentDAO.viewBoard", bid);
    }
    // 게시글 수정
    public int updateBoard(BoardContentVO vo) throws SQLException{
    	return update("boardContentDAO.updateBoard", vo);
    }
    // 게시글 삭제
    public int deleteBoard(BoardContentVO vo) throws SQLException{
    	return delete("boardContentDAO.deleteBoard",vo);
    }
    // 게시글 전체 목록
    public List<BoardContentVO> listAll(BoardContentVO vo) throws SQLException{
    	return selectList("boardContentDAO.listAll", vo);
    }
    // 게시글 조회수 증가
    public int increaseViewCnt(int bid) throws SQLException{
    	return update("boardContentDAO.increaseViewCnt", bid);
    }
    // 댓글수 조회
    public int countComment(int bid) throws SQLException {
    	return update("boardContentDAO.countComment", bid);
    }
    //이전글, 다음글 조회
    public BoardContentVO movePage(BoardContentVO vo)throws SQLException{
		return selectOne("boardContentDAO.movePage", vo);
	}
    // 게시판 별 글 개수 조회
	public int countBoard(int bmid) throws SQLException {
		return selectOne("boardContentDAO.countBoard", bmid);
	}
	public int deleteAllBoardContent(int bmid) throws SQLException{
    	return delete("boardContentDAO.deleteAllBoardContent",bmid);
    }
	public List<BoardContentVO> listByBracket(BoardContentVO boardContentVO) {
		// TODO Auto-generated method stub
		return selectList("boardContentDAO.listByBracket", boardContentVO);
	}
}
