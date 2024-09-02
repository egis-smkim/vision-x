package com.vision_x.vision_x.desk.developer.impl;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.vision_x.vision_x.desk.developer.service.ProductVO;
import com.vision_x.vision_x.desk.service.MemberProductVO;

import egovframework.rte.psl.dataaccess.EgovAbstractMapper;

@Repository("productDAO")
public class ProductDAO extends EgovAbstractMapper {
	public int insertProduct(ProductVO productVO) throws SQLException {
		return insert("productDAO.insertProduct", productVO);
	}
	
	public List<ProductVO> selectProductList(ProductVO productVO) throws SQLException {
		return selectList("productDAO.selectProductList", productVO);
	}
	
	public List<ProductVO> selectMyProductList(ProductVO productVO) throws SQLException {
		return selectList("productDAO.selectMyProductList", productVO);
	}
	
	public ProductVO selectProductItem(ProductVO productVO) throws SQLException {
		return selectOne("productDAO.selectProductItem", productVO);
	}
	
	public int updateProductItem(ProductVO productVO) throws SQLException {
		return update("productDAO.updateProductItem", productVO);
	}
	
	public int deleteProductItem(ProductVO productVO) throws SQLException {
		return delete("productDAO.deleteProductItem", productVO);
	}
	
	public List<ProductVO> selectProductCateList(ProductVO productVO){
		return selectList("productDAO.selectProductCateList", productVO);
	}
	
	public List<MemberProductVO> selectProductMember(MemberProductVO memberProductVO) {
		return selectList("productDAO.selectProductMember", memberProductVO);
	}
	
	public List<ProductVO> selectCheckRequst() throws SQLException {
		return selectList("productDAO.selectCheckRequst");
	}

	public int selectProductCount(HashMap<String, Object> param) {
		// TODO Auto-generated method stub
		return selectOne("productDAO.selectProductCount", param);
	}

	public List<ProductVO> getProductListPerPageParam(HashMap<String, Object> param) {
		// TODO Auto-generated method stub
		return selectList("productDAO.getProductListPerPageParam", param);
	}

	public List<ProductVO> selectProductList(HashMap<String, Object> param) {
		// TODO Auto-generated method stub
		return selectList("productDAO.selectProductList", param);
	}
	
	public int selectCheckModule(int mdid) {
		return selectOne("productDAO.selectCheckModule", mdid);
	}
}
