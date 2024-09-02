package com.vision_x.vision_x.desk.developer.impl;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.vision_x.vision_x.admin.service.AnalysisItemFileVO;
import com.vision_x.vision_x.desk.developer.service.CategoryVO;
import com.vision_x.vision_x.desk.developer.service.ModuleExtVO;
import com.vision_x.vision_x.desk.developer.service.ModuleVO;
import com.vision_x.vision_x.member.service.MemberVO;

import egovframework.rte.psl.dataaccess.EgovAbstractMapper;

@Repository("moduleDAO")
public class ModuleDAO extends EgovAbstractMapper {
	

	public ModuleExtVO selectModuleExtItem(ModuleExtVO moduleExtVO) {
		return selectOne("moduleDAO.selectModuleExtItem", moduleExtVO);
	}
	
	public int deleteModuleExtItem(ModuleExtVO moduleExtVO) {
		return delete("moduleDAO.deleteModuleExtItem", moduleExtVO);
	}
	
	public int insertModule(ModuleVO moduleVO) {
		return insert("moduleDAO.insertModule", moduleVO);
	}
	
	public int updateModule(ModuleVO moduleVO) {
		return update("moduleDAO.updateModule", moduleVO);
	}
	
	public int insertModuleExt(ModuleExtVO moduleExtVO) {
		return insert("moduleDAO.insertModuleExt", moduleExtVO);
	}
	
	public List<ModuleVO> selectModuleList() throws SQLException {
		return selectList("moduleDAO.selectModuleList");
	}
	
	public ModuleVO selectModuleItem(ModuleVO moduleVO) {
		return selectOne("moduleDAO.selectModuleItem", moduleVO);
	}
	
	public List<ModuleExtVO> selectModuleExtList(ModuleVO moduleVO) {
		return selectList("moduleDAO.selectModuleExtList", moduleVO);
	}
	
	public List<HashMap<String, String>> getLargeCategory(){
		return selectList("moduleDAO.getLargeCategory", null);
	}
	
	public List<HashMap<String, String>> getCategoryLists(CategoryVO categoryVO){
		return selectList("moduleDAO.getCategoryLists", categoryVO);
	}
	
	public int insertAnlysisItem(HashMap<String, Object> map) {
		return insert("moduleDAO.insertAnlysisItem", map);
	}
	
	public int insertAnlysFileLists(List<HashMap<String, String>> list) {
		return insert("moduleDAO.insertAnlysFileLists",list);
	}
	
	public List<HashMap<String, String>> getProductInfoLists(MemberVO memberVO){
		return selectList("moduleDAO.getProductInfoLists", memberVO);
	}
	
	public HashMap<String, String> getAnalysisInfo(HashMap<String, String> map){
		return selectOne("moduleDAO.getAnalysisInfo", map);
	}
	
	public List<HashMap<String, String> >getAnlysisFileInfo(HashMap<String, String> map){
		return selectList("moduleDAO.getAnlysisFileInfo",map);
	}
	

	public List<HashMap<String, String>> getCategoryDetails(HashMap<String, String> map){
		return selectList("moduleDAO.getCategoryDetails",map);
	}
	
	public List<HashMap<String, String>> getAnlysisFilesInfo(String anindx){
		return selectList("moduleDAO.getAnlysisFilesInfo",anindx);
	}
	
	public List<HashMap<String, String>>getAnlysisFileListInfo(HashMap<String, String> map){
		return selectList("moduleDAO.getAnlysisFileListInfo",map);
	}
	
	public int deleteFileEdit(AnalysisItemFileVO analysisItemFileVO) {
		return update("moduleDAO.deleteFileEdit", analysisItemFileVO);
	}
	
	public int updateEditFileInfo(HashMap<String, String> map) {
		return update("moduleDAO.updateEditFileInfo",map);
	}
	
	public int deleteAnlysisFileInfo(HashMap<String, String> map) {
		return update("moduleDAO.deleteAnlysisFileInfo",map);
	}

	public int updateModuleFiles(ModuleVO moduleVO) {
		return update("moduleDAO.updateModuleFiles", moduleVO);
	}

	public int appNameCheck(String appObj) throws SQLException {
		// TODO Auto-generated method stub
		return selectOne("moduleDAO.appNameCheck", appObj);
	}

	public List<ModuleVO> selectUserAvailableModuleList(int mid) {
		// TODO Auto-generated method stub
		return selectList("moduleDAO.selectUserAvailableModuleList",mid);
	}

	public HashMap<String, Object> selectModuleItemByAgid(ModuleVO moduleVO) {
		// TODO Auto-generated method stub
		return selectOne("moduleDAO.selectModuleItemByAgid", moduleVO);
	}
}
