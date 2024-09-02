/**
 * 
 */
package com.vision_x.vision_x.desk.service.impl;

import java.sql.SQLException;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.vision_x.vision_x.desk.service.MemberProductGroupItemVO;
import com.vision_x.vision_x.desk.service.MemberProductGroupService;
import com.vision_x.vision_x.desk.service.MemberProductGroupVO;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

/**
 * MemberProductGroupServiceImpl.java
 * digitalTwin
 * 2020. 11. 25.
 * @author Khaia
 * @Comment
 *
 */
@Service("memberProductGroupService")
public class MemberProductGroupServiceImpl extends EgovAbstractServiceImpl implements MemberProductGroupService {
	
	@Resource(name="memberProductGroupDAO")
	private MemberProductGroupDAO memberProductGroupDAO;
	
	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.desk.service.MemberProductGroupService#insertMemberProductGroup(com.vision_x.vision_x.desk.service.MemberProductGroupVO)
	 */
	@Override
	public int insertMemberProductGroup(MemberProductGroupVO memberProductGroupVO) throws SQLException {
		// TODO Auto-generated method stub
		return memberProductGroupDAO.insertMemberProductGroup(memberProductGroupVO);
	}

	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.desk.service.MemberProductGroupService#selectMemberProductGroupList(int)
	 */
	@Override
	public List<MemberProductGroupVO> selectMemberProductGroupList(int mid) throws SQLException {
		// TODO Auto-generated method stub
		return memberProductGroupDAO.selectMemberProductGroupList(mid);
	}

	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.desk.service.MemberProductGroupService#insertMemberProductGroupItem(com.vision_x.vision_x.desk.service.MemberProductGroupItemVO)
	 */
	@Override
	public int insertMemberProductGroupItem(MemberProductGroupItemVO memberProductGroupItemVO) throws SQLException {
		// TODO Auto-generated method stub
		return memberProductGroupDAO.insertMemberProductGroupItem(memberProductGroupItemVO);
	}

	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.desk.service.MemberProductGroupService#getMemberProductItemAtSelectGroupCount(com.vision_x.vision_x.desk.service.MemberProductGroupItemVO)
	 */
	@Override
	public MemberProductGroupItemVO getMemberProductItemAtSelectGroupCount(
			MemberProductGroupItemVO memberProductGroupItemVO) throws SQLException {
		// TODO Auto-generated method stub
		return memberProductGroupDAO.getMemberProductItemAtSelectGroupCount(memberProductGroupItemVO);
	}
	
	
	
	
	
}
