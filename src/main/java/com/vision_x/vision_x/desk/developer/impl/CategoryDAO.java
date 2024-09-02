package com.vision_x.vision_x.desk.developer.impl;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.vision_x.vision_x.desk.developer.service.CategoryVO;
import com.vision_x.vision_x.desk.developer.service.ProductVO;
import com.vision_x.vision_x.member.service.MemberVO;

import egovframework.rte.psl.dataaccess.EgovAbstractMapper;

@Repository("categoryDAO")
public class CategoryDAO extends EgovAbstractMapper {
	
	public List<CategoryVO> getLargeCategoryList() throws SQLException {
		return selectList("categoryDAO.getLargeCategoryList");
	}
	
	public List<CategoryVO> getLargeCategoryListWithDb(){
		return selectList("categoryDAO.getLargeCategoryListWithDb");
	}
	
	public List<CategoryVO> getMiddleCategoryList(CategoryVO categoryVO) {
		return selectList("categoryDAO.getMiddleCategoryList", categoryVO);
	}
	
	public List<CategoryVO> getSmallCategoryList(HashMap<String, Object> map) {
		return selectList("categoryDAO.getSmallCategoryList", map);
	}

	public CategoryVO getCategoryItem(CategoryVO categoryVO) {
		return selectOne("categoryDAO.getCategoryItem", categoryVO);
	}
	
	public List<String> wholeCategoryNames(){
		return selectList("categoryDAO.wholeCategoryNames",null);
	}
	
	public List<String> wholeCategoryNamesWithDb(){
		return selectList("categoryDAO.wholeCategoryNamesWithDb");
	}
	
	public List<HashMap<String, String>> getCategorySearch(CategoryVO categoryVO){
		return selectList("categoryDAO.getCategorySearch", categoryVO);
	}
	
	public List<HashMap<String, String>> getMcateSearchList(CategoryVO categoryVO){
		return selectList("categoryDAO.getMcateSearchList", categoryVO);
	}
	
	public List<HashMap<String, String>> getMemAppLists(MemberVO memberVO){
		return selectList("categoryDAO.getMemAppLists", memberVO);
	}
	
	public List<HashMap<String, String>> getAppProductLists(ProductVO productVO){
		return selectList("categoryDAO.getAppProductLists", productVO);
	}

	public HashMap<String, Object> getCategoryCid(CategoryVO categoryVO) {
		// TODO Auto-generated method stub
		return selectOne("categoryDAO.getCategoryCid", categoryVO);
	}
}
