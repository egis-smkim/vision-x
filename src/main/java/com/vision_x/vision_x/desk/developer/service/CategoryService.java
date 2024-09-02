package com.vision_x.vision_x.desk.developer.service;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;

import com.vision_x.vision_x.member.service.MemberVO;

/**
 * CategoryService.java
 * digitalTwin
 * 2020. 10. 20.
 * @author Khaia
 * @Comment
 *
 */
public interface CategoryService {
public List<CategoryVO> getLargeCategoryList() throws SQLException;
	
	public List<CategoryVO> getLargeCategoryListWithDb();
	
	public List<CategoryVO> getMiddleCategoryList(CategoryVO categoryVO);
	
	public List<CategoryVO> getSmallCategoryList(HashMap<String, Object> map);
	
	public List<String> wholeCategoryNames();
	
	public List<String> wholeCategoryNamesWithDb();
	
	public CategoryVO getCategoryItem(CategoryVO categoryVO);
	
	public List<HashMap<String, String>> getCategorySearch(CategoryVO categoryVO);
	
	public List<HashMap<String, String>> getMcateSearchList(CategoryVO categoryVO);
	
	public List<HashMap<String, String>> getMemAppLists(MemberVO memberVO);
	
	public List<HashMap<String, String>> getAppProductLists(ProductVO productVO);

	public HashMap<String, Object> getCategoryCid(CategoryVO categoryVO);
}
