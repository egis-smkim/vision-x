package com.vision_x.vision_x.member.service;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;

import jakarta.servlet.http.HttpServletResponse;

public interface MemberService {
	public int checkMemId(MemberVO memberVO);
	
	public int createDataDb(String db);
	
	public int createGeoDb(String db);
	
	public int insertMemInfo(HashMap<String, String> map);
	
	public HashMap<String, Object> memberLogin(HashMap<String, String> map);
	
	public int updateMemberLoginDate(MemberVO memberVO);
	
	public MemberVO getMemberInfo(MemberVO memberVO) throws SQLException;
	
	public MemberVO getMemberInfoMemId(MemberVO memberVO);
	
	public List<MemberVO> getMemberList();
	
	//내 프로필 정보 전체 업데이트를 위한 메서드
	public int updateMember(MemberVO vo);
	
	//비밀번호 업데이트
	public int updatePw(MemberVO vo);
	
	//최종로그인 일시와 현재 로그인한 일시 차를 구함(6개월 이상일 경우 비밀번호 변경 권고 팝업창 띄움)
	public int getTimeDiff(MemberVO memberVO);
	
	//비밀번호 찾기(비밀번호 초기화) 인증번호 확인- 멤버id와 authkey를 확인하여 member-level의 승인상태인 1로 바꿈.
	public int changeMemLevel(MemberVO memberVO);
	
	//otp 세팅 변경
	public int updateOTP(HashMap<String,String> map);
	
	public int revokePublicGeoDb(String geoDbNm);
	//멤버 로그인 시도 횟수 카운트
	public int updateLoginCount(MemberVO memberVO);
	//멤버 로그인 성공시 카운트 초기화
	public int resetLoginCount(MemberVO memberVO);
	//비밀번호 다음에 변경하기 클릭시,해당 계정 최근 패스워드 변경일자를 현재기준으로 변경
	public int updateLastPwdUpdateDateNow(MemberVO memberVO);
	
}