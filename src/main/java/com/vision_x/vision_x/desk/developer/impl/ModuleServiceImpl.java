package com.vision_x.vision_x.desk.developer.impl;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.vision_x.vision_x.admin.service.AnalysisItemFileVO;
import com.vision_x.vision_x.desk.developer.service.CategoryVO;
import com.vision_x.vision_x.desk.developer.service.ModuleExtVO;
import com.vision_x.vision_x.desk.developer.service.ModuleService;
import com.vision_x.vision_x.desk.developer.service.ModuleVO;
import com.vision_x.vision_x.member.service.MemberVO;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("moduleService")
public class ModuleServiceImpl extends EgovAbstractServiceImpl implements ModuleService {
	
	@Resource(name="moduleDAO")
	private ModuleDAO moduleDAO;
	
	
	@Override
	public List<HashMap<String, String>> getLargeCategory() {
		return moduleDAO.getLargeCategory();
	}

	@Override
	public List<HashMap<String, String>> getCategoryLists(CategoryVO categoryVO) {
		return moduleDAO.getCategoryLists(categoryVO);
	}

	@Override
	public int insertAnlysisItem(HashMap<String, Object> map) {
		return moduleDAO.insertAnlysisItem(map);
	}

	@Override
	public int insertAnlysFileLists(List<HashMap<String, String>> list) {
		return moduleDAO.insertAnlysFileLists(list);
	}

	@Override
	public List<HashMap<String, String>> getProductInfoLists(MemberVO memberVO) {
		return moduleDAO.getProductInfoLists(memberVO);
	}
	
	@Override
	public HashMap<String, String> getAnalysisInfo(HashMap<String, String> map) {
		return moduleDAO.getAnalysisInfo(map);
	}

	@Override
	public List<HashMap<String, String>> getAnlysisFileInfo(HashMap<String, String> map) {
		return moduleDAO.getAnlysisFileInfo(map);
	}

	@Override
	public List<HashMap<String, String>> getCategoryDetails(HashMap<String, String> map) {
		return moduleDAO.getCategoryDetails(map);
	}

	@Override
	public List<HashMap<String, String>> getAnlysisFileListInfo(HashMap<String, String> map) {
		return moduleDAO.getAnlysisFileListInfo(map);
	}

	@Override
	public int deleteFileEdit(AnalysisItemFileVO analysisItemFileVO) {
		return moduleDAO.deleteFileEdit(analysisItemFileVO);
	}

	@Override
	public int updateEditFileInfo(HashMap<String, String> map) {
		return moduleDAO.updateEditFileInfo(map);
	}

	@Override
	public int deleteAnlysisFileInfo(HashMap<String, String> map) {
		return moduleDAO.deleteAnlysisFileInfo(map);
	}

	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.admin.service.ModuleService#insertModule(com.vision_x.vision_x.admin.service.ModuleVO)
	 */
	@Override
	public int insertModule(ModuleVO moduleVO) {
		// TODO Auto-generated method stub
		return moduleDAO.insertModule(moduleVO);
	}

	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.admin.service.ModuleService#insertModuleExt(com.vision_x.vision_x.admin.service.ModuleExtVO)
	 */
	@Override
	public int insertModuleExt(ModuleExtVO moduleExtVO) {
		// TODO Auto-generated method stub
		return moduleDAO.insertModuleExt(moduleExtVO);
	}

	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.admin.service.ModuleService#selectModuleList()
	 */
	@Override
	public List<ModuleVO> selectModuleList() throws SQLException {
		// TODO Auto-generated method stub
		return moduleDAO.selectModuleList();
	}

	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.admin.service.ModuleService#selectModuleItem(int)
	 */
	@Override
	public ModuleVO selectModuleItem(ModuleVO moduleVO) {
		// TODO Auto-generated method stub
		return moduleDAO.selectModuleItem(moduleVO);
	}

	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.admin.service.ModuleService#selectModuleExtList()
	 */
	@Override
	public List<ModuleExtVO> selectModuleExtList(ModuleVO moduleVO) {
		// TODO Auto-generated method stub
		return moduleDAO.selectModuleExtList(moduleVO);
	}

	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.admin.service.ModuleService#selectModuleExtItem(int)
	 */
	@Override
	public ModuleExtVO selectModuleExtItem(ModuleExtVO moduleExtVO) {
		// TODO Auto-generated method stub
		return moduleDAO.selectModuleExtItem(moduleExtVO);
	}

	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.admin.service.ModuleService#deleteModuleExtItem(int)
	 */
	@Override
	public int deleteModuleExtItem(ModuleExtVO moduleExtVO) {
		// TODO Auto-generated method stub
		return moduleDAO.deleteModuleExtItem(moduleExtVO);
	}

	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.admin.service.ModuleService#updateModule(com.vision_x.vision_x.admin.service.ModuleVO)
	 */
	@Override
	public int updateModule(ModuleVO moduleVO) {
		// TODO Auto-generated method stub
		return moduleDAO.updateModule(moduleVO);
	}

	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.admin.service.ModuleService#updateModuleFiles(com.vision_x.vision_x.admin.service.ModuleVO)
	 */
	@Override
	public int updateModuleFiles(ModuleVO moduleVO) {
		// TODO Auto-generated method stub
		return moduleDAO.updateModuleFiles(moduleVO);
	}

	@Override
	public int appNameCheck(String appObj) throws SQLException {
		// TODO Auto-generated method stub
		return moduleDAO.appNameCheck(appObj);
	}

	@Override
	public List<ModuleVO> selectUserAvailableModuleList(int mid) {
		// TODO Auto-generated method stub
		return moduleDAO.selectUserAvailableModuleList(mid);
	}

	@Override
	public HashMap<String, Object> selectModuleItemByAgid(ModuleVO moduleVO) {
		// TODO Auto-generated method stub
		return moduleDAO.selectModuleItemByAgid(moduleVO);
	}
}
