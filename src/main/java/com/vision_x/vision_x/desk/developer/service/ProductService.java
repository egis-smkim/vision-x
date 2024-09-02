package com.vision_x.vision_x.desk.developer.service;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;

import com.vision_x.vision_x.desk.service.MemberProductVO;

/**
 * ProductService.java
 * digitalTwin
 * 2020. 10. 20.
 * @author Khaia
 * @Comment
 *
 */
public interface ProductService {
	public int insertProduct(ProductVO productVO) throws SQLException;
	
	public List<ProductVO> selectProductList(ProductVO productVO) throws SQLException;
	
	public List<ProductVO> selectMyProductList(ProductVO productVO) throws SQLException;
	
	public ProductVO selectProductItem(ProductVO productVO) throws SQLException;
	
	public int updateProductItem(ProductVO productVO) throws SQLException;
	
	public int deleteProductItem(ProductVO productVO) throws SQLException;
	
	public List<ProductVO> selectProductCateList(ProductVO productVO);
	
	public List<MemberProductVO> selectProductMember(MemberProductVO memberProductVO);
	
	public List<ProductVO> selectCheckRequst() throws SQLException;

	public int selectProductCount(HashMap<String, Object> param);

	public List<ProductVO> getProductListPerPageParam(HashMap<String, Object> param);

	public List<ProductVO> selectProductList(HashMap<String, Object> param);
	
	public int selectCheckModule(int mdid);
}