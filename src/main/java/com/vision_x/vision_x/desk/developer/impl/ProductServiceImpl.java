package com.vision_x.vision_x.desk.developer.impl;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.vision_x.vision_x.desk.developer.service.ProductService;
import com.vision_x.vision_x.desk.developer.service.ProductVO;
import com.vision_x.vision_x.desk.service.MemberProductVO;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("productService")
public class ProductServiceImpl extends EgovAbstractServiceImpl implements ProductService {
	@Resource(name="productDAO")
	private ProductDAO productDAO;
	
	@Override
	public int insertProduct(ProductVO productVO) throws SQLException {
		// TODO Auto-generated method stub
		return productDAO.insertProduct(productVO);
	}
	
	public List<ProductVO> selectProductList(ProductVO productVO) throws SQLException {
		return productDAO.selectProductList(productVO);
	}

	public List<ProductVO> selectMyProductList(ProductVO productVO) throws SQLException {
		return productDAO.selectMyProductList(productVO);
	}
	
	@Override
	public ProductVO selectProductItem(ProductVO productVO) throws SQLException {
		// TODO Auto-generated method stub
		return productDAO.selectProductItem(productVO);
	}

	@Override
	public int updateProductItem(ProductVO productVO) throws SQLException {
		// TODO Auto-generated method stub
		return productDAO.updateProductItem(productVO);
	}

	@Override
	public int deleteProductItem(ProductVO productVO) throws SQLException {
		// TODO Auto-generated method stub
		return productDAO.deleteProductItem(productVO);
	}

	@Override
	public List<ProductVO> selectProductCateList(ProductVO productVO) {
		return productDAO.selectProductCateList(productVO);
	}

	@Override
	public List<MemberProductVO> selectProductMember(MemberProductVO memberProductVO) {
		return productDAO.selectProductMember(memberProductVO);
	}
	
	public List<ProductVO> selectCheckRequst() throws SQLException {
		return productDAO.selectCheckRequst();
	}

	@Override
	public int selectProductCount(HashMap<String, Object> param) {
		// TODO Auto-generated method stub
		return productDAO.selectProductCount(param);
	}

	@Override
	public List<ProductVO> getProductListPerPageParam(HashMap<String, Object> param) {
		// TODO Auto-generated method stub
		return productDAO.getProductListPerPageParam(param);
	}

	@Override
	public List<ProductVO> selectProductList(HashMap<String, Object> param) {
		// TODO Auto-generated method stub
		return productDAO.selectProductList(param);
	}

	@Override
	public int selectCheckModule(int mdid) {
		return productDAO.selectCheckModule(mdid);
	}
}
