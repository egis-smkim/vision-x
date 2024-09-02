/**
 * 
 */
package com.vision_x.vision_x.desk.service.impl;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.vision_x.vision_x.desk.developer.service.ModuleVO;
import com.vision_x.vision_x.desk.developer.service.ProductVO;
import com.vision_x.vision_x.desk.service.MemberProductVO;

import egovframework.rte.psl.dataaccess.EgovAbstractMapper;

/**
 * MemberProductDAO.java
 * digitalTwin
 * 2020. 11. 24.
 * @author Khaia
 * @Comment
 *
 */
@Repository("memberProductDAO")
public class MemberProductDAO extends EgovAbstractMapper {
	
	public int insertMemberProduct(MemberProductVO memberProductVO) throws SQLException {
		return insert("memberProductDAO.insertMemberProduct", memberProductVO);
	}
	
	public List<MemberProductVO> getMemberProductList(int mid) throws SQLException {
		return selectList("memberProductDAO.getMemberProductList", mid);
	}
	
	public List<ModuleVO> getDistinctMemberProductList(HashMap<String, Object> param) throws SQLException {
		return selectList("memberProductDAO.getDistinctMemberProductList", param);
	}
	
	public MemberProductVO selectMemberProductItem(int mpid) throws SQLException {
		return selectOne("memberProductDAO.selectMemberProductItem", mpid);
	}
	
	public int deleteMemberProduct(int mpid) throws SQLException {
		return delete("memberProductDAO.deleteMemberProduct", mpid);
	}
	
	public List<MemberProductVO> selectSortMemberProductItem(HashMap<String, Object> map) {
		return selectList("memberProductDAO.selectSortMemberProductItem", map);
	}
	
	public int getMemberProductOwnerCountForMpid(MemberProductVO memberProductVO) throws SQLException {
		return selectOne("memberProductDAO.getMemberProductOwnerCountForMpid", memberProductVO);
	}
	
	public MemberProductVO getMemberProductItemForMpid(MemberProductVO memberProductVO) throws SQLException {
		return selectOne("memberProductDAO.getMemberProductItemForMpid", memberProductVO);
	}
}
