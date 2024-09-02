/**
 * 
 */
package com.vision_x.vision_x.desk.service.impl;

import java.sql.SQLException;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.vision_x.vision_x.desk.service.MemberProductGroupItemVO;
import com.vision_x.vision_x.desk.service.MemberProductGroupVO;

import egovframework.rte.psl.dataaccess.EgovAbstractMapper;

/**
 * MemberProductGroupDAO.java
 * digitalTwin
 * 2020. 11. 25.
 * @author Khaia
 * @Comment
 *
 */
@Repository("memberProductGroupDAO")
public class MemberProductGroupDAO extends EgovAbstractMapper {
	public int insertMemberProductGroup(MemberProductGroupVO memberProductGroupVO) throws SQLException {
		return insert("memberProductGroupDAO.insertMemberProductGroup", memberProductGroupVO);
	}
	
	public List<MemberProductGroupVO> selectMemberProductGroupList(int mid) throws SQLException {
		return selectList("memberProductGroupDAO.selectMemberProductGroupList", mid);
	}
	
	public int insertMemberProductGroupItem(MemberProductGroupItemVO memberProductGroupItemVO) throws SQLException {
		return insert("memberProductGroupDAO.insertMemberProductGroupItem", memberProductGroupItemVO);
	}
	
	public MemberProductGroupItemVO getMemberProductItemAtSelectGroupCount(MemberProductGroupItemVO memberProductGroupItemVO) throws SQLException {
		return selectOne("memberProductGroupDAO.getMemberProductItemAtSelectGroupCount", memberProductGroupItemVO);
	}
}
