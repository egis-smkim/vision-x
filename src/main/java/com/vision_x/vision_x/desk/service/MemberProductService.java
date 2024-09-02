/**
 * 
 */
package com.vision_x.vision_x.desk.service;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;

import com.vision_x.vision_x.desk.developer.service.ModuleVO;
import com.vision_x.vision_x.desk.developer.service.ProductVO;

/**
 * MemberProductService.java
 * digitalTwin
 * 2020. 11. 24.
 * @author Khaia
 * @Comment
 *
 */
public interface MemberProductService {
	public int addMemberProduct(MemberProductVO memberProductVO) throws SQLException;
	
	public List<MemberProductVO> getMemberProductList(int mid) throws SQLException;
	
	public List<ModuleVO> getDistinctMemberProductList(HashMap<String, Object> param) throws SQLException;
	
	public MemberProductVO selectMemberProductItem(int mpid) throws SQLException;
	
	public int deleteMemberProduct(int mpid) throws SQLException;
	
	public List<MemberProductVO> selectSortMemberProductItem(HashMap<String, Object> map) throws SQLException;
	
	public int getMemberProductOwnerCountForMpid(MemberProductVO memberProductVO) throws SQLException;
	
	public MemberProductVO getMemberProductItemForMpid(MemberProductVO memberProductVO) throws SQLException;
}
