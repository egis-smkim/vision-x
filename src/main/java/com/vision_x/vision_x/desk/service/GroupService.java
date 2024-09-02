package com.vision_x.vision_x.desk.service;

import java.sql.SQLException;
import java.util.List;

import com.vision_x.vision_x.member.service.MemberVO;

public interface GroupService {
	public int insertGroup(GroupVO groupVO) throws SQLException;
	
	public List<GroupVO> selectGroupList() throws SQLException;
	
	public GroupVO selectGroupInfo(GroupVO groupVO) throws SQLException;
	
	public int updateGroupInfo(GroupVO GroupVO) throws SQLException;
	
	public int deleteGroupInfo(GroupVO groupVO) throws SQLException;

	public List<MemberVO> selectGroupMember(GroupVO groupVO);
	
	public int resignMember(GroupVO groupVO);

	public List<GroupVO> selectAllGroupList(int mid);

	public int joinGroupRequest(GroupVO groupVO);

	public List<GroupVO> selectMyGroupList(int mid);

	public int deleteGIDisNull(GroupVO groupVO);

	public int insertGroupLeader(GroupVO groupVO);

	public int leaveGroup(GroupVO groupVO);

	public GroupVO selectGroupInfo(int gid);

	public List<GroupVO> selectGroupMemberList(int gid);

	public int groupStateChange(GroupVO groupVO);

	public int deleteGroupMember(GroupVO groupVO);

	public int ChangeGroupMemberState(GroupVO groupVO);

	public int nameCheck(String group_name);

	public int inviteGroupRequest(GroupVO groupVO);

	public int checkMId(GroupVO groupVO);

	public List<GroupVO> selectMyExistGroupList(int sessMid);

	public int changeMemberState(int mid);

	public int changeGroupMemMemberState(int mid);

	public List<GroupVO> getMyGroupList(int sessMid);


	
}
