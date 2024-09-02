package com.vision_x.vision_x.desk.board.service.impl;

import java.sql.SQLException;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.vision_x.vision_x.desk.board.service.CommentVO;

import egovframework.rte.psl.dataaccess.EgovAbstractMapper;

@Repository("CommentDAO")
public class CommentDAO extends EgovAbstractMapper{
	
	// 댓글 작성
    public int insertComment(CommentVO vo) throws SQLException{
    	return insert("commentDAO.insertComment", vo);
    }
    // 댓글 수정
    public int updateComment(CommentVO vo) throws SQLException{
    	return update("commentDAO.updateComment", vo);
    }
    // 댓글 삭제
    public int deleteComment(CommentVO vo) throws SQLException{
    	return delete("commentDAO.deleteComment",vo);
    }
	// 댓글 전체 목록
    public List<CommentVO> listComment(int bid) throws SQLException{
		return selectList("commentDAO.listComment",bid);
    }
    // 선택된 댓글 조회
    public CommentVO selectComment(int cid) throws SQLException{
    	return selectOne("commentDAO.selectComment", cid);
    }
    // 전체 댓글 개수 조회
    public int countComment(int bid) throws SQLException{
    	return selectOne("commentDAO.countComment", bid);
    }
    // 답글 작성
    public int insertReply(CommentVO vo) throws SQLException{
    	return insert("commentDAO.insertReply", vo);
    }
    //해당 게시글의 댓글 삭제
    public int deleteAllComment(int bid) throws SQLException{
    	return delete("commentDAO.deleteAllComment",bid);
    }
    //해당 게시판의 댓글 삭제
	public int deleteAllBoardComment(int bmid) throws SQLException{
		return delete("commentDAO.deleteAllBoardComment",bmid);
	}
}
