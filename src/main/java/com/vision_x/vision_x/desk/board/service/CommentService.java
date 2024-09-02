package com.vision_x.vision_x.desk.board.service;

import java.sql.SQLException;
import java.util.List;

public interface CommentService {
	// 댓글 작성
    public int insertComment(CommentVO vo) throws SQLException;
    // 댓글 수정
    public int updateComment(CommentVO vo) throws SQLException;
    // 댓글 삭제
    public int deleteComment(CommentVO vo) throws SQLException;
    // 댓글 전체 목록
    public List<CommentVO> listComment(int bid) throws SQLException;
    // 선택된 댓글 조회
    public CommentVO selectComment(int cid) throws SQLException;
    // 전체 댓글 개수 조회
    public int countComment(int bid) throws SQLException;
    // 답글 작성
    public int insertReply(CommentVO vo) throws SQLException;
    // 해당 게시글  댓글 삭제
	public int deleteAllComment(int bid) throws SQLException;
	// 해당 게시판 댓글 삭제
	public int deleteAllBoardComment(int bmid) throws SQLException;
}
