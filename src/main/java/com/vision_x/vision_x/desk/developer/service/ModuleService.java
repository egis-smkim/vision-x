package com.vision_x.vision_x.desk.developer.service;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;

import com.vision_x.vision_x.admin.service.AnalysisItemFileVO;
import com.vision_x.vision_x.member.service.MemberVO;

public interface ModuleService {
	
	public int insertModule(ModuleVO moduleVO);
	
	public int insertModuleExt(ModuleExtVO moduleExtVO);
	
	public List<ModuleVO> selectModuleList() throws SQLException;
	
	public ModuleVO selectModuleItem(ModuleVO moduleVO);
	
	public List<ModuleExtVO> selectModuleExtList(ModuleVO moduleVO);
	
	public ModuleExtVO selectModuleExtItem(ModuleExtVO moduleExtVO);
	
	public int deleteModuleExtItem(ModuleExtVO moduleExtVO);
	
	public int updateModule(ModuleVO moduleVO);
	
	
	public List<HashMap<String, String>> getLargeCategory();
	
	public List<HashMap<String, String>> getCategoryLists(CategoryVO categoryVO);
	
	public int insertAnlysisItem(HashMap<String, Object> map);
	
	public int insertAnlysFileLists(List<HashMap<String, String>> list);
	
	public List<HashMap<String, String>> getProductInfoLists(MemberVO memberVO);
	
	public HashMap<String, String> getAnalysisInfo(HashMap<String,String> map);
	
	public List<HashMap<String, String>> getAnlysisFileInfo(HashMap<String, String> map);

	public List<HashMap<String, String>> getCategoryDetails(HashMap<String, String> map);
	
	public List<HashMap<String, String>> getAnlysisFileListInfo(HashMap<String, String> map);

	public int deleteFileEdit(AnalysisItemFileVO analysisItemFileVO);
	
	public int updateEditFileInfo(HashMap<String, String> map);
	
	public int deleteAnlysisFileInfo(HashMap<String, String> map);

	public int updateModuleFiles(ModuleVO moduleVO);
	
	public int appNameCheck(String appObj) throws SQLException;

	public List<ModuleVO> selectUserAvailableModuleList(int mid);

	public HashMap<String, Object> selectModuleItemByAgid(ModuleVO moduleVO);
}
