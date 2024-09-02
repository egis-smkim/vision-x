package com.vision_x.vision_x.desk.service.impl;

import java.sql.SQLException;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.vision_x.vision_x.desk.service.GroupService;
import com.vision_x.vision_x.desk.service.GroupVO;
import com.vision_x.vision_x.member.service.MemberVO;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("groupService")
public class GroupServiceImpl extends EgovAbstractServiceImpl implements GroupService {
	@Resource(name="groupDAO")
	private GroupDAO groupDAO;
	
	@Override
	public int insertGroup(GroupVO groupVO) throws SQLException {
		// TODO Auto-generated method stub
		return groupDAO.insertGroup(groupVO);
	}
	
	public List<GroupVO> selectGroupList() throws SQLException {
		return groupDAO.selectGroupList();
	}

	@Override
	public GroupVO selectGroupInfo(GroupVO groupVO) throws SQLException {
		// TODO Auto-generated method stub
		return groupDAO.selectGroupInfo(groupVO);
	}

	@Override
	public int updateGroupInfo(GroupVO groupVO) throws SQLException {
		// TODO Auto-generated method stub
		return groupDAO.updateGroupInfo(groupVO);
	}

	@Override
	public int deleteGroupInfo(GroupVO groupVO) throws SQLException {
		// TODO Auto-generated method stub
		return groupDAO.deleteGroupInfo(groupVO);
	}
	
	@Override
	public List<MemberVO> selectGroupMember(GroupVO groupVO) {
		return groupDAO.selectGroupMember(groupVO);
	}

	@Override
	public int resignMember(GroupVO groupVO) {
		// TODO Auto-generated method stub
		return groupDAO.resignMember(groupVO);
	}

	@Override
	public List<GroupVO> selectAllGroupList(int mid) {
		// TODO Auto-generated method stub
		return groupDAO.selectAllGroupList(mid);
	}

	@Override
	public int joinGroupRequest(GroupVO groupVO) {
		// TODO Auto-generated method stub
		return groupDAO.joinGroupRequest(groupVO);
	}

	@Override
	public List<GroupVO> selectMyGroupList(int mid) {
		// TODO Auto-generated method stub
		return groupDAO.selectMyGroupList(mid);
	}

	@Override
	public int deleteGIDisNull(GroupVO groupVO) {
		// TODO Auto-generated method stub
		return groupDAO.deleteGIDisNull(groupVO);
	}

	@Override
	public int insertGroupLeader(GroupVO groupVO) {
		// TODO Auto-generated method stub
		return groupDAO.insertGroupLeader(groupVO);
	}

	@Override
	public int leaveGroup(GroupVO groupVO) {
		// TODO Auto-generated method stub
		return groupDAO.leaveGroup(groupVO);
	}

	@Override
	public GroupVO selectGroupInfo(int gid) {
		// TODO Auto-generated method stub
		return groupDAO.selectGroupInfo(gid);
	}

	@Override
	public List<GroupVO> selectGroupMemberList(int gid) {
		// TODO Auto-generated method stub
		return groupDAO.selectGroupMemberList(gid);
	}

	@Override
	public int groupStateChange(GroupVO groupVO) {
		// TODO Auto-generated method stub
		return groupDAO.groupStateChange(groupVO);
	}

	@Override
	public int deleteGroupMember(GroupVO groupVO) {
		// TODO Auto-generated method stub
		return groupDAO.deleteGroupMember(groupVO);
	}

	@Override
	public int ChangeGroupMemberState(GroupVO groupVO) {
		// TODO Auto-generated method stub
		return groupDAO.ChangeGroupMemberState(groupVO);
	}

	@Override
	public int nameCheck(String group_name) {
		// TODO Auto-generated method stub
		return groupDAO.nameCheck(group_name);
	}

	@Override
	public int inviteGroupRequest(GroupVO groupVO) {
		// TODO Auto-generated method stub
		return groupDAO.inviteGroupRequest(groupVO);
	}

	@Override
	public int checkMId(GroupVO groupVO) {
		// TODO Auto-generated method stub
		return groupDAO.checkMId(groupVO);
	}

	@Override
	public List<GroupVO> selectMyExistGroupList(int sessMid) {
		// TODO Auto-generated method stub
		return groupDAO.selectMyExistGroupList(sessMid);
	}

	@Override
	public int changeMemberState(int mid) {
		// TODO Auto-generated method stub
		return groupDAO.changeMemberState(mid);
	}

	@Override
	public int changeGroupMemMemberState(int mid) {
		// TODO Auto-generated method stub
		return groupDAO.changeGroupMemMemberState(mid);
	}

	@Override
	public List<GroupVO> getMyGroupList(int sessMid) {
		// TODO Auto-generated method stub
		return groupDAO.getMyGroupList(sessMid);
	}
}
