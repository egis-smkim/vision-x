/**
 * 
 */
package com.vision_x.vision_x.apps.service.impl;

import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.vision_x.vision_x.apps.service.AppsService;
import com.vision_x.vision_x.apps.service.BuildingModelVO;
import com.vision_x.vision_x.apps.service.CsvVO;
import com.vision_x.vision_x.apps.service.WaveVO;
import com.vision_x.vision_x.apps.service.ObsLocationVO;
import com.vision_x.vision_x.apps.service.TidalVO;
import com.vision_x.vision_x.apps.service.TypSurVO;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

/**
 * AppsServiceImpl.java
 * digitaltwincloud
 * 2021. 6. 24.
 * @author Khaia
 * @Comment
 *
 */
@Service("appsService")
public class AppsServiceImpl extends EgovAbstractServiceImpl implements AppsService {
	
	@Resource(name="appsDAO")
	private AppsDAO appsDAO;

	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.apps.service.AppsService#getEditBuildingUserModelList(int)
	 */
	@Override
	public List<BuildingModelVO> getEditBuildingUserModelList(int mid) {
		// TODO Auto-generated method stub
		return appsDAO.getEditBuildingUserModelList(mid);
	}
	@Override
	public List<HashMap<String, String>> getCsvUploadList(HashMap<String, Object> map) {
		// TODO Auto-generated method stub
		return appsDAO.getCsvUploadList(map);
	}
	@Override
	public List<HashMap<String, Object>> getShpLocationInfo(HashMap<String, Object> map) {
		// TODO Auto-generated method stub
		return appsDAO.getShpLocationInfo(map);
	}
	@Override
	public List<HashMap<String, Object>> getShpGeomInfo(HashMap<String, Object> map) {
		// TODO Auto-generated method stub
		return appsDAO.getShpGeomInfo(map);
	}
	@Override
	public List<HashMap<String, Object>> getShpUnionGeomInfo(HashMap<String, Object> map) {
		// TODO Auto-generated method stub
		return appsDAO.getShpUnionGeomInfo(map);
	}
	@Override
	public int updateCsvUploadInfo(HashMap<String, Object> map) {
		return appsDAO.updateCsvUploadInfo(map);
	}

	@Override
	public List<CsvVO> loadUploadCsvItemListForCsv(HashMap<String, Object> param) {
		// TODO Auto-generated method stub
		return appsDAO.loadUploadCsvItemListForCsv(param);
	}
	
	@Override
	public List<HashMap<String, Object>> loadUploadCsvItemListForCsvToMap(HashMap<String, Object> param) {
		// TODO Auto-generated method stub
		return appsDAO.loadUploadCsvItemListForCsvToMap(param);
	}
	
	@Override
	public List<HashMap<String, Object>> getStatsQueryList(HashMap<String, Object> param){
		// TODO Auto-generated method stub
		return appsDAO.getStatsQueryList(param);
	}

	@Override
	public int createCsvItemTable(HashMap<String, Object> param) {
		// TODO Auto-generated method stub
		return appsDAO.createCsvItemTable(param);
	}
	
	@Override
	public int addCsvItemTableColumns(HashMap<String, Object> param) {
		// TODO Auto-generated method stub
		return appsDAO.addCsvItemTableColumns(param);
	}
	
	@Override
	public int insertCsvItem(HashMap<String, Object> param) {
		// TODO Auto-generated method stub
		return appsDAO.insertCsvItem(param);
	}

	@Override
	public int deleteCsvItem(HashMap<String, Object> param) {
		// TODO Auto-generated method stub
		return appsDAO.deleteCsvItem(param);
	}
	
	@Override
	public CsvVO loadUploadCsvItemForCsv(HashMap<String, Object> param) {
		// TODO Auto-generated method stub
		return appsDAO.loadUploadCsvItemForCsv(param);
	}
	
	@Override
	public HashMap<String, Object> loadUploadCsvItemForCsvToMap(HashMap<String, Object> param) {
		// TODO Auto-generated method stub
		return appsDAO.loadUploadCsvItemForCsvToMap(param);
	}
	
	@Override
	public int deleteCsvUpload(int acid) {
		return appsDAO.deleteCsvUpload(acid);
	}
	
	@Override
	public int deleteCsvUploadInfoForCsv(String table) {
		return appsDAO.deleteCsvUploadInfoForCsv(table);
	}
	
	//월파 분석 저장
	@Override
	public int insertWaveProject(WaveVO wvo) {
		return appsDAO.insertWaveProject(wvo);
	}
	
	//월파 프로젝트 리스트
	@Override
	public List<WaveVO> getWaveProjectLists(int mid) {
		return appsDAO.getWaveProjectLists(mid);
	}
	
	//월파 실행 요소
	@Override
	public WaveVO getWaveProjectInfo(int wid) {
		return appsDAO.getWaveProjectInfo(wid);
	}
	@Override
	public int updateWaveProject(WaveVO wvo) {
		return appsDAO.updateWaveProject(wvo);
	}
	@Override
	public List<HashMap<String, Object>> getShpBbox(HashMap<String, Object> map) {
		// TODO Auto-generated method stub
		return appsDAO.getShpBbox(map);
	}

	@Override
	public List<TidalVO> loadTidalData(TidalVO vo) {
		// TODO Auto-generated method stub
		return appsDAO.loadTidalData(vo);
	}
	@Override
	public HashMap<String, String> getLocation(String obs_name) {
		// TODO Auto-generated method stub
		return appsDAO.getLocation(obs_name);
	}
	@Override
	public List<HashMap<Integer, String>> getTypSrgDay() {
		// TODO Auto-generated method stub
		return appsDAO.getTypSrgDay();
	}
	@Override
	public List<ObsLocationVO> getTypSrgLocation() {
		// TODO Auto-generated method stub
		return appsDAO.getTypSrgLocation();
	}
	@Override
	public List<TypSurVO> getTypSrgDetialData(String ymd) {
		// TODO Auto-generated method stub
		return appsDAO.getTypSrgDetialData(ymd);
	}
	
	
}
