package com.vision_x.vision_x.admin.service;

import java.sql.SQLException;
import java.util.List;

import com.vision_x.vision_x.member.service.MemberVO;

/**
 * AdminMemberService.java
 * digitalTwin
 * 2020. 10. 20.
 * @author Khaia
 * @Comment
 *
 */
public interface AdminMemberService {
	public List<MemberVO> selectMemberList() throws SQLException;
	
	public MemberVO selectMemberInfo(MemberVO memberVO) throws SQLException;
	
	public int updateMemberInfo(MemberVO memberVO) throws SQLException;
}
