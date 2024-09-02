/**
 * 
 */
package com.vision_x.vision_x.apps.service;

import java.util.HashMap;
import java.util.List;

/**
 * AppsService.java
 * digitaltwincloud
 * 2021. 6. 24.
 * @author Khaia
 * @Comment
 *
 */
public interface AppsService {
	public List<BuildingModelVO> getEditBuildingUserModelList(int mid);
	
	public List<HashMap<String, String>> getCsvUploadList(HashMap<String, Object> map);
	
	public List<HashMap<String, Object>> getShpLocationInfo(HashMap<String, Object> map);
	
	public List<HashMap<String, Object>> getShpGeomInfo(HashMap<String, Object> map);
	
	public List<HashMap<String, Object>> getShpUnionGeomInfo(HashMap<String, Object> map);

	public int updateCsvUploadInfo(HashMap<String, Object> map);
	
	public int createCsvItemTable(HashMap<String, Object> map);
	
	public int addCsvItemTableColumns(HashMap<String, Object> map);
	
	public int insertCsvItem(HashMap<String, Object> map);
	
	public int deleteCsvItem(HashMap<String, Object> param);

	public List<CsvVO> loadUploadCsvItemListForCsv(HashMap<String, Object> param);

	public List<HashMap<String, Object>> loadUploadCsvItemListForCsvToMap(HashMap<String, Object> param);
	
	public List<HashMap<String, Object>> getStatsQueryList(HashMap<String, Object> param);
	
	public CsvVO loadUploadCsvItemForCsv(HashMap<String, Object> param);
	
	public HashMap<String, Object> loadUploadCsvItemForCsvToMap(HashMap<String, Object> param);
	
	public int deleteCsvUpload(int acid);

	public int deleteCsvUploadInfoForCsv(String table);
	
	//월파분석 저장
	public int insertWaveProject(WaveVO wvo);
	
	//월파 리스트
	public List<WaveVO> getWaveProjectLists(int mid);
	
	//월파 실행 요소
	public WaveVO getWaveProjectInfo(int wid);
	
	//월파 업데이트
	public int updateWaveProject(WaveVO wvo);

	public List<HashMap<String, Object>> getShpBbox(HashMap<String, Object> map);
	
	// 조위검조소
	public List<TidalVO> loadTidalData(TidalVO vo);
	
	public HashMap<String,String> getLocation(String obs_name);
	
	// 태풍 기상
	public List<HashMap<Integer, String>> getTypSrgDay();
	
	public List<ObsLocationVO> getTypSrgLocation();
	
	public List<TypSurVO> getTypSrgDetialData(String ymd);
}