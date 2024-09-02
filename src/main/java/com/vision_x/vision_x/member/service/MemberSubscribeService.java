package com.vision_x.vision_x.member.service;

import java.sql.SQLException;

public interface MemberSubscribeService {
	public int createMemberSubscribe (MemberSubscribeVO map);
	public MemberSubscribeVO getMemberSubscribeLastOne (int mid);
	public int updateMemberSubscribeState (MemberSubscribeVO vo) throws SQLException;
	public int checkMemState (int mid);
}
