package com.vision_x.vision_x.member.service;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;

public interface MemberPaymentService {
	public int createMemberPayment (MemberPaymentVO map) throws SQLException;
	public int updateMemberPayment (MemberPaymentVO map);
	public int createServiceInfo (HashMap<String, Object> map);
	public MemberPaymentVO getMemberPaymentInfoForOrderId (String orderId) throws SQLException;
	public List<MemberPaymentVO> getMemberPaymentList (MemberVO map);
	public int updateMemberPaymentStatus (MemberPaymentVO map) throws SQLException;
	public MemberPaymentVO getMemeberPaymentLastOne(int mid);
	public Integer checkMemSid(int mid);
}
