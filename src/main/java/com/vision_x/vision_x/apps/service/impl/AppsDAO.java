/**
 * 
 */
package com.vision_x.vision_x.apps.service.impl;

import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.beans.factory.annotation.Qualifier;

import com.vision_x.vision_x.apps.service.BuildingModelVO;
import com.vision_x.vision_x.apps.service.CsvVO;
import com.vision_x.vision_x.apps.service.ShpModelLayerVO;
import com.vision_x.vision_x.apps.service.ShpModelVO;
import com.vision_x.vision_x.apps.service.WaveVO;
import com.vision_x.vision_x.apps.service.ObsLocationVO;
import com.vision_x.vision_x.apps.service.TidalVO;
import com.vision_x.vision_x.apps.service.TypSurVO;

import egovframework.rte.psl.dataaccess.EgovAbstractMapper;

/**
 * AppsDAO.java
 * digitaltwincloud
 * 2021. 6. 24.
 * @author Khaia
 * @Comment
 *
 */
@Repository("appsDAO")
public class AppsDAO extends EgovAbstractMapper {

	@Autowired
	@Qualifier("postgresqlSqlSessionTemplate")
	private SqlSession postGreSqlSession;
	
	public List<BuildingModelVO> getEditBuildingUserModelList(int mid) {
		return selectList("appsDAO.getEditBuildingUserModelList", mid);
	}
	
	public int insertCsvUploadInfo(CsvVO vo) {
		return insert("appsDAO.insertCsvUploadInfo", vo);
	}
	
	public CsvVO getCsvFileInfo(int acid) {
		return selectOne("appsDAO.getCsvFileInfo",acid);
	}
	
	public int updateCsvInfo(CsvVO vo) {
		return update("appsDAO.updateCsvInfo",vo);
	}

	public int updateCsvItemInfo(HashMap<String, Object> param) {
		return postGreSqlSession.update("appsDAO.updateCsvItemInfo",param);
	}
	
	public int createCsvItemTable(HashMap<String, Object> param) {
		return postGreSqlSession.update("appsDAO.createCsvItemTable",param);
	}
	
	public int addCsvItemTableColumns(HashMap<String, Object> param) {
		return postGreSqlSession.update("appsDAO.addCsvItemTableColumns",param);
	}
	
	public int insertCsvItem(HashMap<String, Object> param) {
		return postGreSqlSession.update("appsDAO.insertCsvItem",param);
	}
	
	public int deleteCsvItem(HashMap<String, Object> param) {
		return postGreSqlSession.delete("appsDAO.deleteCsvItem",param);
	}

	public List<HashMap<String, String>> getCsvUploadList(HashMap<String, Object> map) {
		return selectList("appsDAO.getCsvUploadList", map);
	}
	
	public List<HashMap<String, Object>> getShpLocationInfo(HashMap<String, Object> map) {
		return postGreSqlSession.selectList("appsDAO.getShpLocationInfo", map);
	}
	
	public List<HashMap<String, Object>> getShpGeomInfo(HashMap<String, Object> map) {
		return postGreSqlSession.selectList("appsDAO.getShpGeomInfo", map);
	}
	
	public List<HashMap<String, Object>> getShpUnionGeomInfo(HashMap<String, Object> map) {
		return postGreSqlSession.selectList("appsDAO.getShpUnionGeomInfo", map);
	}
	
	public int updateCsvUploadInfo(HashMap<String, Object> param) {
		return update("appsDAO.updateCsvUploadInfo",param);
	}

	public List<CsvVO> loadUploadCsvItemListForCsv(HashMap<String, Object> param) {
		return postGreSqlSession.selectList("appsDAO.loadUploadCsvItemListForCsv",param);
	}
	
	public List<HashMap<String, Object>> loadUploadCsvItemListForCsvToMap(HashMap<String, Object> param) {
		return postGreSqlSession.selectList("appsDAO.loadUploadCsvItemListForCsvToMap",param);
	}

	public List<HashMap<String, Object>> getStatsQueryList(HashMap<String, Object> param) {
		return postGreSqlSession.selectList("appsDAO.getStatsQueryList",param);
	}
	
	public CsvVO loadUploadCsvItemForCsv(HashMap<String, Object> param) {
		return postGreSqlSession.selectOne("appsDAO.loadUploadCsvItemForCsv", param);
	}
	
	public HashMap<String, Object> loadUploadCsvItemForCsvToMap(HashMap<String, Object> param) {
		return postGreSqlSession.selectOne("appsDAO.loadUploadCsvItemForCsvToMap",param);
	}
	
	public int deleteCsvUpload(int acid) {
		return delete("appsDAO.deleteCsvUpload",acid);
	}
	
	public int deleteCsvUploadInfoForCsv(String table) {
		return postGreSqlSession.update("appsDAO.deleteCsvUploadInfoForCsv",table);
	}

	
	public int insertShpModelInfo(ShpModelVO vo) {
		return insert("appsDAO.insertShpModelInfo",vo);
	}
	
	public ShpModelVO getShpModelInfo(int asid) {
		return selectOne("appsDAO.getShpModelInfo",asid);
	}
	
	public int updateShp2Modelinfo(ShpModelVO vo) {
		return update("appsDAO.updateShp2Modelinfo",vo);
	}
	
	public List<HashMap<String, Object>> getAppShpPrjctInfo(int mid){
		return selectList("appsDAO.getAppShpPrjctInfo",mid);
	}
	
	public HashMap<String, Object> getShpModelLayerInfo(int asid){
		return selectOne("appsDAO.getShpModelLayerInfo",asid);
	}
	
	public int deleteShp3dModel(int asid) {
		return delete("appsDAO.deleteShp3dModel",asid);
	}
	
	public int dropShpTable(String tableInfo) {
		return postGreSqlSession.update("appsDAO.dropShpTable",tableInfo);
	}
	
	public List<HashMap<String, Object>> getShpProperties(ShpModelVO vo){
		return postGreSqlSession.selectList("appsDAO.getShpProperties",vo);
	}
	
	public List<String> getShpDbfHeaders(ShpModelVO vo){
		return postGreSqlSession.selectList("appsDAO.getShpDbfHeaders",vo);
	}
	
	public int updateProcessShp(ShpModelVO vo) {
		return update("appsDAO.updateProcessShp",vo);
	}
	
	public int insertShpLayerInfo(ShpModelLayerVO vo) {
		return insert("appsDAO.insertShpLayerInfo",vo);
	}
	
	public int updateAppShpBoundary(ShpModelVO vo) {
		return update("appsDAO.updateAppShpBoundary",vo);
	}
	
	public ShpModelLayerVO getShpLayerInfo(int afid) {
		return selectOne("appsDAO.getShpLayerInfo",afid);
	}
	
	public List<ShpModelLayerVO> getShpLayerList(int asid){
		return selectList("appsDAO.getShpLayerList",asid);
	}
	
	public int updateShpConvexHull(ShpModelLayerVO vo) {
		return update("appsDAO.ShpModelLayerVO",vo);
	}
	
	public ShpModelLayerVO getShpLayerBoundary(int afid) {
		return selectOne("appsDAO.getShpLayerBoundary",afid);
	}
	
	public int updateProjectName(ShpModelVO vo) {
		return update("appsDAO.updateProjectName",vo);
	}
	
	public int updateShpLayerStatus(ShpModelLayerVO vo) {
		return update("appsDAO.updateShpLayerStatus",vo);
	}

	public int changeMemberState(int mid) {
		// TODO Auto-generated method stub
		return update("appsDAO.changeMemberState",mid);
	}
	
	//월파 분석 저장
	public int insertWaveProject(WaveVO wvo) {
		return insert("appsDAO.insertWaveProject",wvo);
	}
	
	//월파 리스트
	public List<WaveVO> getWaveProjectLists(int mid){
		return selectList("appsDAO.getWaveProjectLists",mid);
	}
	
	public WaveVO getWaveProjectInfo(int wid) {
		return selectOne("appsDAO.getWaveProjectInfo",wid);
	}
	
	public int updateWaveProject(WaveVO wvo) {
		return update("appsDAO.updateWaveProject",wvo);
	}

	public List<HashMap<String, Object>> getShpBbox(HashMap<String, Object> map) {
		return postGreSqlSession.selectList("appsDAO.getShpBbox", map);
	}
	// 조위 검조소
	public List<TidalVO> loadTidalData(TidalVO vo){
		return selectList("appsDAO.loadTidalData", vo);
	}
	
	public HashMap<String,String> getLocation(String obs_name){
		return postGreSqlSession.selectOne("appsDAO.getLocation",obs_name);
	};
	
	// 태풍 기상
	public List<HashMap<Integer, String>> getTypSrgDay(){
		return selectList("appsDAO.getTypSrgDay");
	}
	
	public List<ObsLocationVO> getTypSrgLocation(){
		return postGreSqlSession.selectList("appsDAO.getTypSrgLocation");
	}
	
	public List<TypSurVO> getTypSrgDetialData(String ymd){
		return selectList("appsDAO.getTypSrgDetialData", ymd);
	}
}