package com.vision_x.vision_x.member.service.impl;

import org.springframework.stereotype.Repository;

import com.vision_x.vision_x.member.service.MemberSubscribeVO;

import egovframework.rte.psl.dataaccess.EgovAbstractMapper;

@Repository("memberSubscribeDAO")
public class MemberSubscribeDAO extends EgovAbstractMapper{
	
	public int createMemberSubscribe(MemberSubscribeVO map) {
		return insert("memberSubscribeDAO.createMemberSubscribe",map);
	}
	
	public MemberSubscribeVO getMemberSubscribeLastOne(int mid) {
		return selectOne("memberSubscribeDAO.getMemberSubscribeLastOne",mid);
	}
	
	public int updateMemberSubscribeState (MemberSubscribeVO vo) {
		return update("memberSubscribeDAO.updateMemberSubscribeState", vo);
	}
	
	public int checkMemState (int mid) {
		return selectOne("memberSubscribeDAO.checkMemState",mid);
	}
}
