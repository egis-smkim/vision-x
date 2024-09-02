package com.vision_x.vision_x.member.service.impl;

import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.vision_x.vision_x.member.service.MemberVO;

import egovframework.rte.psl.dataaccess.EgovAbstractMapper;

@Repository("memberDAO")
public class MemberDAO extends EgovAbstractMapper {
	
	@Autowired
	@Resource(name="postGreSqlSession")
	private SqlSession postGreSqlSession;
	
	public int checkMemId(MemberVO memberVO) {
		return selectOne("memberDAO.checkMemId", memberVO);
	}
	
	public int createDataDb(String db) {
		return update("memberDAO.createDataDb",db);
	}
	
	public int createGeoDb(String db) {
		return postGreSqlSession.update("memberDAO.createGeoDb",db);
	}
	
	public int insertMemInfo(HashMap<String, String> map) {
		return insert("memberDAO.insertMemInfo",map);
	}
	
	public HashMap<String, Object> memberLogin(HashMap<String, String> map){
		return selectOne("memberDAO.memberLogin",map);
	}
	
	public int updateMemberLoginDate(MemberVO memberVO) {
		return update("memberDAO.updateMemberLoginDate", memberVO);
	}
	
	public MemberVO getMemberInfo(MemberVO memberVO) {
		return selectOne("memberDAO.getMemberInfo", memberVO);
	}
	
	public MemberVO getMemberInfoMemId(MemberVO memberVO) {
		return selectOne("memberDAO.getMemberInfoMemId", memberVO);
	}
	
	public List<MemberVO> getMemberList() {
		return selectList("memberDAO.getMemberList");
	}

	public int updateMember(MemberVO vo){
		return update("memberDAO.updateMemberInfo", vo);
	}
	
	//임시비밀번호 메일 전송 후,해당 계정 비밀번호 변경
	public int updatePw(MemberVO vo) {
		return update("memberDAO.updatePw", vo);
	}
	
	public int getTimeDiff(MemberVO memberVO) {
		return selectOne("memberDAO.getTimeDiff", memberVO);
	}
	
	public int changeMemLevel(MemberVO memberVO) {
		return update("memberDAO.changeMemLevel", memberVO);
	}
	
	public int updateOTP(HashMap<String, String> map) {
		return update("memberDAO.updateOTP", map);
	}
		
	public int revokePublicGeoDb(String geoDb) {
		return postGreSqlSession.update("memberDAO.revokePublicGeoDb",geoDb);
	}
	
	public int updateLoginCount(MemberVO memberVO) {
		return update("memberDAO.updateLoginCount",memberVO);
	}
	
	public int resetLoginCount(MemberVO memberVO) {
		return update("memberDAO.resetLoginCount",memberVO);
	}
	
	public int updateLastPwdUpdateDateNow(MemberVO memberVO) {
		// TODO Auto-generated method stub
		return update("memberDAO.updateLastPwdUpdateDateNow", memberVO);
	}
}
