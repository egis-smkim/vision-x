package com.vision_x.vision_x.desk.service.impl;

import java.sql.SQLException;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.vision_x.vision_x.desk.service.GroupVO;
import com.vision_x.vision_x.member.service.MemberVO;

import egovframework.rte.psl.dataaccess.EgovAbstractMapper;

@Repository("groupDAO")
public class GroupDAO extends EgovAbstractMapper {
	public int insertGroup(GroupVO groupVO) throws SQLException {
		return insert("groupDAO.insertGroup", groupVO);
	}
	
	public List<GroupVO> selectGroupList() throws SQLException {
		return selectList("groupDAO.selectGroupList");
	}
	
	public GroupVO selectGroupInfo(GroupVO groupVO) throws SQLException {
		return selectOne("groupDAO.selectGroupInfo", groupVO);
	}
	
	public int updateGroupInfo(GroupVO groupVO) throws SQLException {
		return update("groupDAO.updateGroupInfo", groupVO);
	}
	
	public int deleteGroupInfo(GroupVO groupVO) throws SQLException {
		return delete("groupDAO.deleteGroupInfo", groupVO);
	}
	
	public List<MemberVO> selectGroupMember(GroupVO groupVO) {
		return selectList("groupDAO.selectGroupMember", groupVO);
	}
	
	public int resignMember(GroupVO groupVO) {
		return update("groupDAO.resignMember", groupVO);
	}

	public List<GroupVO> selectAllGroupList(int mid) {
		// TODO Auto-generated method stub
		return selectList("groupDAO.selectAllGroupList", mid);
	}

	public int joinGroupRequest(GroupVO groupVO) {
		// TODO Auto-generated method stub
		return insert("groupDAO.joinGroupRequest", groupVO);
	}

	public List<GroupVO> selectMyGroupList(int mid) {
		// TODO Auto-generated method stub
		return selectList("groupDAO.selectMyGroupList", mid);
	}

	public int deleteGIDisNull(GroupVO groupVO) {
		// TODO Auto-generated method stub
		return delete("groupDAO.deleteGIDisNull", groupVO);
	}

	public int insertGroupLeader(GroupVO groupVO) {
		// TODO Auto-generated method stub
		return insert("groupDAO.insertGroupLeader", groupVO);
	}

	public int leaveGroup(GroupVO groupVO) {
		// TODO Auto-generated method stub
		return delete("groupDAO.leaveGroup", groupVO);
	}

	public GroupVO selectGroupInfo(int gid) {
		// TODO Auto-generated method stub
		return selectOne("groupDAO.selectGroupInfo", gid);
	}

	public List<GroupVO> selectGroupMemberList(int gid) {
		// TODO Auto-generated method stub
		return selectList("groupDAO.selectGroupMemberList", gid);
	}

	public int groupStateChange(GroupVO groupVO) {
		// TODO Auto-generated method stub
		return update("groupDAO.groupStateChange", groupVO);
	}

	public int deleteGroupMember(GroupVO groupVO) {
		// TODO Auto-generated method stub
		return delete("groupDAO.deleteGroupMember", groupVO);
	}

	public int ChangeGroupMemberState(GroupVO groupVO) {
		// TODO Auto-generated method stub
		return update("groupDAO.ChangeGroupMemberState", groupVO);
	}

	public int nameCheck(String group_name) {
		// TODO Auto-generated method stub
		return selectOne("groupDAO.nameCheck", group_name);
	}

	public int inviteGroupRequest(GroupVO groupVO) {
		// TODO Auto-generated method stub
		return insert("groupDAO.inviteGroupRequest", groupVO);
	}

	public int checkMId(GroupVO groupVO) {
		// TODO Auto-generated method stub
		return selectOne("groupDAO.checkMId", groupVO);
	}

	public List<GroupVO> selectMyExistGroupList(int sessMid) {
		// TODO Auto-generated method stub
		return selectList("groupDAO.selectMyExistGroupList", sessMid);
	}

	public int changeMemberState(int mid) {
		// TODO Auto-generated method stub
		return update("groupDAO.changeMemberState", mid);
	}

	public int changeGroupMemMemberState(int mid) {
		// TODO Auto-generated method stub
		return update("groupDAO.changeGroupMemMemberState", mid);
	}

	public List<GroupVO> getMyGroupList(int sessMid) {
		// TODO Auto-generated method stub
		return selectList("groupDAO.getMyGroupList", sessMid);
	}
}
