package com.vision_x.vision_x.member.service.impl;

import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.vision_x.vision_x.member.service.MemberPaymentVO;
import com.vision_x.vision_x.member.service.MemberVO;

import egovframework.rte.psl.dataaccess.EgovAbstractMapper;

@Repository("memberPaymentDAO")
public class MemberPaymentDAO extends EgovAbstractMapper {
	
	@Autowired
	@Resource(name="postGreSqlSession")
	private SqlSession postGreSqlSession;
	
	
	public int createMemberPayment(MemberPaymentVO map) {
		return insert("memberPaymentDAO.createMemberPayment", map);
	}
	public int updateMemberPayment(MemberPaymentVO map) {
		return insert("memberPaymentDAO.updateMemberPayment", map);
	}
	public int createServiceInfo(HashMap<String, Object> map) {
		return insert("memberPaymentDAO.createServiceInfo", map);
	}
	public MemberPaymentVO getMemberPaymentInfoForOrderId (String orderId) {
		return selectOne("memberPaymentDAO.getMemberPaymentInfoForOrderId", orderId);
	}
	public List<MemberPaymentVO> getMemberPaymentList (MemberVO map) {
		return selectList("memberPaymentDAO.getMemberPaymentList", map);
	}
	public int updateMemberPaymentStatus (MemberPaymentVO map) {
		return update("memberPaymentDAO.updateMemberPaymentStatus", map);
	}
	public Integer checkMemSid(int mid) {
		return selectOne("memberPaymentDAO.checkMemSid", mid);
	}
	public MemberPaymentVO getMemeberPaymentLastOne(int mid) {
		return selectOne("memberPaymentDAO.getMemeberPaymentLastOne",mid);
	}
}
