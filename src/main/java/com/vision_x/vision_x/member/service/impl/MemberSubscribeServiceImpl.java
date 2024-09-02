package com.vision_x.vision_x.member.service.impl;

import java.sql.SQLException;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.vision_x.vision_x.member.service.MemberSubscribeService;
import com.vision_x.vision_x.member.service.MemberSubscribeVO;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("memberSubscribeService")
public class MemberSubscribeServiceImpl extends EgovAbstractServiceImpl implements MemberSubscribeService{

	@Resource(name="memberSubscribeDAO")
	private MemberSubscribeDAO memberSubscribeDAO;

	@Override
	public int createMemberSubscribe(MemberSubscribeVO map) {
		return memberSubscribeDAO.createMemberSubscribe(map);
		
	}

	@Override
	public MemberSubscribeVO getMemberSubscribeLastOne(int mid) {
		return memberSubscribeDAO.getMemberSubscribeLastOne(mid);
	}

	@Override
	public int updateMemberSubscribeState(MemberSubscribeVO vo) throws SQLException {
		return memberSubscribeDAO.updateMemberSubscribeState(vo);
	}

	@Override
	public int checkMemState(int mid) {
		return memberSubscribeDAO.checkMemState(mid);
	}

}
