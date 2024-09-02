package com.vision_x.vision_x.desk.developer.impl;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.vision_x.vision_x.desk.developer.service.CategoryService;
import com.vision_x.vision_x.desk.developer.service.CategoryVO;
import com.vision_x.vision_x.desk.developer.service.ProductVO;
import com.vision_x.vision_x.member.service.MemberVO;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("categoryService")
public class CategoryServiceImpl extends EgovAbstractServiceImpl implements CategoryService {
	
	@Resource(name="categoryDAO")
	private CategoryDAO categoryDAO;
	
	@Override
	public List<CategoryVO> getLargeCategoryList() throws SQLException {
		// TODO Auto-generated method stub
		return categoryDAO.getLargeCategoryList();
	}
	
	@Override
	public List<CategoryVO> getLargeCategoryListWithDb() {
		// TODO Auto-generated method stub
		return categoryDAO.getLargeCategoryListWithDb();
	}

	@Override
	public CategoryVO getCategoryItem(CategoryVO categoryVO) {
		// TODO Auto-generated method stub
		return categoryDAO.getCategoryItem(categoryVO);
	}

	@Override
	public List<CategoryVO> getMiddleCategoryList(CategoryVO categoryVO) {
		// TODO Auto-generated method stub
		return categoryDAO.getMiddleCategoryList(categoryVO);
	}

	@Override
	public List<CategoryVO> getSmallCategoryList(HashMap<String, Object> map) {
		// TODO Auto-generated method stub
		return categoryDAO.getSmallCategoryList(map);
	}

	@Override
	public List<String> wholeCategoryNames() {
		return categoryDAO.wholeCategoryNames();
	}

	@Override
	public List<String> wholeCategoryNamesWithDb() {
		// TODO Auto-generated method stub
		return categoryDAO.wholeCategoryNamesWithDb();
	}

	@Override
	public List<HashMap<String, String>> getCategorySearch(CategoryVO categoryVO) {
		return categoryDAO.getCategorySearch(categoryVO);
	}

	@Override
	public List<HashMap<String, String>> getMcateSearchList(CategoryVO categoryVO) {
		return categoryDAO.getMcateSearchList(categoryVO);
	}

	@Override
	public List<HashMap<String, String>> getMemAppLists(MemberVO memberVO) {
		return categoryDAO.getMemAppLists(memberVO);
	}

	@Override
	public List<HashMap<String, String>> getAppProductLists(ProductVO productVO) {
		return categoryDAO.getAppProductLists(productVO);
	}

	@Override
	public HashMap<String, Object> getCategoryCid(CategoryVO categoryVO) {
		// TODO Auto-generated method stub
		return categoryDAO.getCategoryCid(categoryVO);
	}
	
	
	
}
