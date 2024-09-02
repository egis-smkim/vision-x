package com.vision_x.vision_x.member.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Random;

import javax.annotation.Resource;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Service;


import com.vision_x.vision_x.member.service.MemberService;
import com.vision_x.vision_x.member.service.MemberVO;


import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("memberService")
public class MemberServiceImpl extends EgovAbstractServiceImpl implements MemberService {

	@Resource(name="memberDAO")
	private MemberDAO memberDAO;
	
	@Override
	public int checkMemId(MemberVO memberVO) {
		return memberDAO.checkMemId(memberVO);
	}

	@Override
	public int createDataDb(String db) {
		return memberDAO.createDataDb(db);
	}

	@Override
	public int createGeoDb(String db) {
		return memberDAO.createGeoDb(db);
	}

	@Override
	public int insertMemInfo(HashMap<String, String> map) {
		return memberDAO.insertMemInfo(map);
	}

	@Override
	public HashMap<String, Object> memberLogin(HashMap<String, String> map) {
		return memberDAO.memberLogin(map);
	}

	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.member.service.MemberService#updateMemberLoginDate(int)
	 */
	@Override
	public int updateMemberLoginDate(MemberVO memberVO) {
		// TODO Auto-generated method stub
		return memberDAO.updateMemberLoginDate(memberVO);
	}

	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.member.service.MemberService#getMemberInfo(int)
	 */
	@Override
	public MemberVO getMemberInfo(MemberVO memberVO){
		// TODO Auto-generated method stub
		return memberDAO.getMemberInfo(memberVO);
	}
	
	@Override
	public MemberVO getMemberInfoMemId(MemberVO memberVO) {
		// TODO Auto-generated method stub
		return memberDAO.getMemberInfoMemId(memberVO);
	}

	@Override
	public List<MemberVO> getMemberList() {
		// TODO Auto-generated method stub
		return memberDAO.getMemberList();
	}

	@Override
	public int updateMember(MemberVO vo) {
		// TODO Auto-generated method stub
		return memberDAO.updateMember(vo);
	}
	
	//패스워드 업데이트
	@Override
	public int updatePw(MemberVO vo) {
		// TODO Auto-generated method stub
		return memberDAO.updatePw(vo);
	}
	
	//최종 로그인 일자에서 현재 로그인된 시간 차 구하는 메서드
	@Override
	public int getTimeDiff(MemberVO memberVO) {
		// TODO Auto-generated method stub
		return memberDAO.getTimeDiff(memberVO);
	}
	
	@Override
	public int changeMemLevel(MemberVO memberVO) {
		// TODO Auto-generated method stub
		return memberDAO.changeMemLevel(memberVO);
	}
	
	@Override
	public int updateOTP(HashMap<String, String> map) {
		// TODO Auto-generated method stub
		return memberDAO.updateOTP(map);
	}

	@Override
	public int revokePublicGeoDb(String geoDbNm) {
		return memberDAO.revokePublicGeoDb(geoDbNm);
	}
	
	
	public int updateLoginCount(MemberVO memberVO) {
		// TODO Auto-generated method stub
		return memberDAO.updateLoginCount(memberVO);
	}

	@Override
	public int resetLoginCount(MemberVO memberVO) {
		// TODO Auto-generated method stub
		return memberDAO.resetLoginCount(memberVO);
	}
	
	@Override
	public int updateLastPwdUpdateDateNow(MemberVO memberVO) {
		// TODO Auto-generated method stub
		return memberDAO.updateLastPwdUpdateDateNow(memberVO);
	}
}
