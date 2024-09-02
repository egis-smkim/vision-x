package com.vision_x.vision_x.member.service.impl;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.vision_x.vision_x.member.service.MemberPaymentService;
import com.vision_x.vision_x.member.service.MemberPaymentVO;
import com.vision_x.vision_x.member.service.MemberVO;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("memberPaymentService")
public class MemberPaymentServiceImpl extends EgovAbstractServiceImpl implements MemberPaymentService {
	
	@Resource(name="memberPaymentDAO")
	private MemberPaymentDAO memberPaymentDAO;
	
	@Override
	public int createMemberPayment(MemberPaymentVO map) throws SQLException {
		return memberPaymentDAO.createMemberPayment(map);
	}
	@Override
	public int updateMemberPayment(MemberPaymentVO map) {
		return memberPaymentDAO.updateMemberPayment(map);
	}
	@Override
	public int createServiceInfo(HashMap<String, Object> map){
		return memberPaymentDAO.createServiceInfo(map);
	}
	@Override
	public MemberPaymentVO getMemberPaymentInfoForOrderId (String orderId) throws SQLException {
		return memberPaymentDAO.getMemberPaymentInfoForOrderId(orderId);
	}
	@Override
	public List<MemberPaymentVO> getMemberPaymentList (MemberVO map) {
		return memberPaymentDAO.getMemberPaymentList(map);
	};
	@Override
	public int updateMemberPaymentStatus (MemberPaymentVO map) throws SQLException {
		return memberPaymentDAO.updateMemberPaymentStatus(map);
	}
	@Override
	public Integer checkMemSid(int mid) {
		return memberPaymentDAO.checkMemSid(mid);
	}
	@Override
	public MemberPaymentVO getMemeberPaymentLastOne(int mid) {
		return memberPaymentDAO.getMemeberPaymentLastOne(mid);
	}

}
