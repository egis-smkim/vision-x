package com.vision_x.vision_x.desk.board.service;

import java.sql.SQLException;
import java.util.List;

public interface BoardContentService {
	// 게시글 작성
    public int insertBoard(BoardContentVO vo) throws SQLException;
    // 게시글 상세보기
    public BoardContentVO viewBoard(int bid) throws SQLException;
    // 게시글 수정
    public int updateBoard(BoardContentVO vo) throws SQLException;
    // 게시글 삭제
    public int deleteBoard(BoardContentVO vo) throws SQLException;
    // 게시글 전체 목록
    public List<BoardContentVO> listAll(BoardContentVO vo) throws SQLException;
    // 게시글 조회
    public int increaseViewCnt(int bid) throws SQLException;
    // 댓글 수 조회
    public int countComment(int bid) throws SQLException;
    // 이전글, 다음글 조회
    public BoardContentVO movePage(BoardContentVO vo)throws SQLException;
    // 게시판 별 글 개수 조회
    public int countBoard(int bmid) throws SQLException;
    // 게시판 삭제 시 게시글 삭제
    public int deleteAllBoardContent(int bmid) throws SQLException;
	public List<BoardContentVO> listByBracket(BoardContentVO boardContentVO);
}
