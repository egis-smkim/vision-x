/**
 * 
 */
package com.vision_x.vision_x.desk.service.impl;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.vision_x.vision_x.desk.developer.service.ModuleVO;
import com.vision_x.vision_x.desk.developer.service.ProductVO;
import com.vision_x.vision_x.desk.service.MemberProductService;
import com.vision_x.vision_x.desk.service.MemberProductVO;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

/**
 * MemberProductServiceImpl.java
 * digitalTwin
 * 2020. 11. 24.
 * @author Khaia
 * @Comment
 *
 */
@Service("memberProductService")
public class MemberProductServiceImpl extends EgovAbstractServiceImpl implements MemberProductService {

	@Resource(name="memberProductDAO")
	private MemberProductDAO memberProductDAO;
	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.desk.service.MemberProductService#addMemberProduct(com.vision_x.vision_x.desk.service.MemberProductVO)
	 */
	@Override
	public int addMemberProduct(MemberProductVO memberProductVO) throws SQLException {
		// TODO Auto-generated method stub
		return memberProductDAO.insertMemberProduct(memberProductVO);
	}
	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.desk.service.MemberProductService#getMemberProductList(int)
	 */
	@Override
	public List<MemberProductVO> getMemberProductList(int mid) throws SQLException {
		// TODO Auto-generated method stub
		return memberProductDAO.getMemberProductList(mid);
	}
	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.desk.service.MemberProductService#getDistinctMemberProductList(int)
	 */
	@Override
	public List<ModuleVO> getDistinctMemberProductList(HashMap<String, Object> param) throws SQLException {
		// TODO Auto-generated method stub
		return memberProductDAO.getDistinctMemberProductList(param);
	}
	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.desk.service.MemberProductService#selectMemberProductItem(int)
	 */
	@Override
	public MemberProductVO selectMemberProductItem(int mpid) throws SQLException {
		// TODO Auto-generated method stub
		return memberProductDAO.selectMemberProductItem(mpid);
	}
	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.desk.service.MemberProductService#deleteMemberProduct(int)
	 */
	@Override
	public int deleteMemberProduct(int mpid) throws SQLException {
		// TODO Auto-generated method stub
		return memberProductDAO.deleteMemberProduct(mpid);
	}
	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.desk.service.MemberProductService#selectSortMemberProductItem(java.util.HashMap)
	 */
	@Override
	public List<MemberProductVO> selectSortMemberProductItem(HashMap<String, Object> map) throws SQLException {
		// TODO Auto-generated method stub
		return memberProductDAO.selectSortMemberProductItem(map);
	}
	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.desk.service.MemberProductService#getMemberProductOwnerCountForMpgid(com.vision_x.vision_x.desk.service.MemberProductVO)
	 */
	@Override
	public int getMemberProductOwnerCountForMpid(MemberProductVO memberProductVO) throws SQLException {
		// TODO Auto-generated method stub
		return memberProductDAO.getMemberProductOwnerCountForMpid(memberProductVO);
	}
	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.desk.service.MemberProductService#getMemberProductItemForMpgid(com.vision_x.vision_x.desk.service.MemberProductVO)
	 */
	@Override
	public MemberProductVO getMemberProductItemForMpid(MemberProductVO memberProductVO) throws SQLException {
		// TODO Auto-generated method stub
		return memberProductDAO.getMemberProductItemForMpid(memberProductVO);
	}
	
}
