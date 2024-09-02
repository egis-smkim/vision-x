/**
 * 
 */
package com.vision_x.vision_x.desk.service;

import java.sql.SQLException;
import java.util.List;

/**
 * MemberProductGroupService.java
 * digitalTwin
 * 2020. 11. 25.
 * @author Khaia
 * @Comment
 *
 */
public interface MemberProductGroupService {
	public int insertMemberProductGroup(MemberProductGroupVO memberProductGroupVO) throws SQLException;
	
	public List<MemberProductGroupVO> selectMemberProductGroupList(int mid) throws SQLException;
	
	public int insertMemberProductGroupItem(MemberProductGroupItemVO memberProductGroupItemVO) throws SQLException;
	
	public MemberProductGroupItemVO getMemberProductItemAtSelectGroupCount(MemberProductGroupItemVO memberProductGroupItemVO) throws SQLException;
}
