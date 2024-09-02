package com.vision_x.vision_x.desk.board.service.impl;

import java.sql.SQLException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vision_x.vision_x.desk.board.service.CommentService;
import com.vision_x.vision_x.desk.board.service.CommentVO;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("commentService")
public class CommentServiceImpl extends EgovAbstractServiceImpl implements CommentService {

	@Autowired
	private CommentDAO commentDAO;
	
	// 댓글 작성
    @Override
    public int insertComment(CommentVO vo) throws SQLException {
        return commentDAO.insertComment(vo);
    }
    // 댓글 수정
    @Override
    public int updateComment(CommentVO vo) throws SQLException {
    	return commentDAO.updateComment(vo);
    }
    // 댓글 삭제
    @Override
    public int deleteComment(CommentVO vo) throws SQLException {
    	return commentDAO.deleteComment(vo);
    }
    // 댓글 전체 목록
    @Override
    public List<CommentVO> listComment(int bid) throws SQLException {
        return commentDAO.listComment(bid);
    }
    // 선택된 댓글 조회
	@Override
	public CommentVO selectComment(int cid) throws SQLException {
		return commentDAO.selectComment(cid);
	}
	// 전체 댓글 개수 조회
	@Override
	public int countComment(int bid) throws SQLException {
		return commentDAO.countComment(bid);
	}
	// 답글 작성
    @Override
    public int insertReply(CommentVO vo) throws SQLException {
        return commentDAO.insertReply(vo);
    }
    //해당 게시글 댓글 삭제
    @Override
    public int deleteAllComment(int bid) throws SQLException {
    	return commentDAO.deleteAllComment(bid);
    }
  //해당 게시판 댓글 삭제
	@Override
	public int deleteAllBoardComment(int bmid) throws SQLException {
		return commentDAO.deleteAllBoardComment(bmid);
	}
}
