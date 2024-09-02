package com.vision_x.vision_x.desk.mapdata.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.vision_x.vision_x.cloud.service.MapDataVO;
import com.vision_x.vision_x.desk.mapdata.service.MapsDataVO;
import com.vision_x.vision_x.file.service.FileVO;
import com.vision_x.vision_x.member.service.MemberFileVO;

import egovframework.rte.psl.dataaccess.EgovAbstractMapper;

@Repository("mapdataDAO")
public class MapdataDAO extends EgovAbstractMapper {
	
	public int insertMemFile(HashMap<String, String> map) {
		return insert("mapdataDAO.insertMemFile",map);
	}
	
	public int insertMemMapData(HashMap<String, String> map) {
		return insert("mapdataDAO.insertMemMapData",map);
	}
	
	public int updateDataId(HashMap<String, String> map) {
		return update("mapdataDAO.updateDataId",map);
	}
	
	public List<HashMap<String, Object>> getCsvDataList(String mid){
		return selectList("mapdataDAO.getCsvDataList",mid);
	}
	
	public int updateDataName(HashMap<String, String> map) {
		return update("mapdataDAO.updateDataName",map);
	}
	
	public HashMap<String, String> getCsvDataInfo(HashMap<String, String> map){
		return selectOne("mapdataDAO.getCsvDataInfo",map);
	}
	
	public int updateCsvData(HashMap<String, String> map ) {
		return update("mapdataDAO.updateCsvData",map);
	}
	
	public int deleteSingleFileData(HashMap<String, String> map) {
		return delete("mapdataDAO.deleteSingleFileData", map);
	}
	
	public HashMap<String, String> getDataInfoWithParam(HashMap<String, Object> map){
		return selectOne("mapdataDAO.getDataInfoWithParam",map);
	}
	
	
	public List<HashMap<String, String>> getMemFileInfoWithParam(HashMap<String, Object> map){
		return selectList("mapdataDAO.getMemFileInfoWithParam",map);
	}
	
	public int updateThumbnailData(HashMap<String, String> map) {
		return update("mapdataDAO.updateThumbnailData",map);
	}
	
	public int updateShpTableName(HashMap<String, String> map) {
		return update("mapdataDAO.updateShpTableName",map);
	}
	
	public MapsDataVO getMapDataInfoWithParam(HashMap<String, Object> map) {
		return selectOne("mapdataDAO.getMapDataInfoWithParam",map);
	}

	public int insertFile(FileVO fileVO) {
		return insert("mapdataDAO.insertFile", fileVO);
	}
	
	public int insertMapsData(MapsDataVO mapsDataVO) {
		return insert("mapdataDAO.insertMapsData", mapsDataVO);
	}
	
	public int updateMapsDataWorkerId(MapsDataVO mapsDataVO) {
		return update("mapdataDAO.updateMapsDataWorkerId", mapsDataVO);
	}
	
	public int updateMapsDataImageInfo(MapsDataVO mapsDataVO) {
		return update("mapdataDAO.updateMapsDataImageInfo", mapsDataVO);
	}
	
	public List<MapsDataVO> getMemberImageData(int mid) {
		return selectList("mapdataDAO.getMemberImageData", mid);
	}
	
	public List<MapsDataVO> getMemberTerrainData(int mid) {
		return selectList("mapdataDAO.getMemberTerrainData", mid);
	}

	public HashMap<String, Object> getShpDataInfo(String did) {
		return selectOne("mapdataDAO.getShpDataInfo",did);
	}

	public int updateMapsDataPointcloudInfo(MapsDataVO mapsDataVO) {
		return update("mapdataDAO.updateMapsDataPointcloudInfo", mapsDataVO);
	}
	
	public int updateMapsDataDroneModelInfo(MapsDataVO mapsDataVO) {
		return update("mapdataDAO.updateMapsDataDroneModelInfo", mapsDataVO);
	}
	
	public List<MapsDataVO> getMemberPointCloudData(int mid) {
		return selectList("mapdataDAO.getMemberPointCloudData", mid);
	}
	
	public List<MapsDataVO> getMemberShapeData(int mid) {
		return selectList("mapdataDAO.getMemberShapeData", mid);
	}
	
	public int updateMapsDataShapeInfo(MapsDataVO mapsDataVO) {
		return update("mapdataDAO.updateMapsDataShapeInfo", mapsDataVO);
	}
	
	public MapsDataVO getMapDataFromParam(HashMap<String, Object> map) {
		return selectOne("mapdataDAO.getMapDataFromParam", map);
	}
	
	public int updateShapeDataState(MapsDataVO mapsDataVO) {
		return update("mapdataDAO.updateShapeDataState", mapsDataVO);
	}
	
	public List<MapsDataVO> getMemberModelData(int mid) {
		return selectList("mapdataDAO.getMemberModelData", mid);
	}
	
	public List<MapsDataVO> getMemberCSVData(int mid) {
		return selectList("mapdataDAO.getMemberCSVData", mid);
	}

	public int updateMapsDataCSVInfo(MapsDataVO mapsDataVO) {
		return update("mapdataDAO.updateMapsDataCSVInfo", mapsDataVO);
	}
	
	public int updateMapsDataThumbnail(MapsDataVO mapsDataVO) {
		return update("mapdataDAO.updateMapsDataThumbnail", mapsDataVO);
	}
	
	public int updateMapsDataCSVCompleteInfo(MapsDataVO mapsDataVO) {
		return update("mapdataDAO.updateMapsDataCSVCompleteInfo", mapsDataVO);
	}
	
	public int updateRasterThumbnail(MapsDataVO mapsDataVO) {
		return update("mapdataDAO.updateRasterThumbnail", mapsDataVO);
	}
	
	public List<MapsDataVO> getMemberLayerLists(HashMap<String, Object> param){
		return selectList("mapdataDAO.getMemberLayerLists", param);
	}
	public List<MapsDataVO> getLayerListsForDataId(HashMap<String, Object> param){
		return selectList("mapdataDAO.getLayerListsForDataId", param);
	}
	
	public int updateMapdataStatus(MapsDataVO vo) {
		return update("mapdataDAO.updateMapdataStatus", vo);
	}
	
	public int updateCsvWithConverter(MapsDataVO vo) {
		return update("mapdataDAO.updateCsvWithConverter", vo);
	}

	public MemberFileVO getMemberSingleFileInfoParam(HashMap<String, Object> param) {
		return selectOne("mapdataDAO.getMemberSingleFileInfoParam", param);
	}
	
	public int deleteMapsData(MapsDataVO mapsDataVO) {
		return delete("mapdataDAO.deleteMapsData", mapsDataVO);
	}
	
	public MapsDataVO getMapCsvDataInfo(HashMap<String, Object> param) {
		return selectOne("mapdataDAO.getMapCsvDataInfo",param);
	}
	
	public int updatePointCloudInfo(MapsDataVO mapsDataVO) {
		return update("mapdataDAO.updatePointCloudInfo",mapsDataVO);
	}
	
	public int updatePointCloudMove(MapsDataVO mapsDataVO) {
		return update("mapdataDAO.updatePointCloudMove",mapsDataVO);
	}
	
	public List<MapsDataVO> getSearchLayerList(HashMap<String, String> param){
		return selectList("mapdataDAO.getSearchLayerList",param); 
	}
	
	public List<MapsDataVO> getMemberDroneModelData(int mid) {
		return selectList("mapdataDAO.getMemberDroneModelData", mid);
	}
	
	public int updateErrorShape(MapsDataVO vo) {
		return update("mapdataDAO.updateErrorShape", vo);
	}
	
	public int deleteFiles(int dataId) {
		
		return delete("mapdataDAO.deleteFiles",dataId);
		
	}
	
	public int deleteFilesWithParam(HashMap<String, Object> param) {
		return delete("mapdataDAO.deleteFilesWithParam",param);
	}
	
	public int updatePclDataInfo(MapsDataVO mapsDataVO) {
		return update("mapdataDAO.updatePclDataInfo",mapsDataVO);
	}
	
	public int update3dTileInfo(MapsDataVO mapsDataVO) {
		return update("mapdataDAO.update3dTileInfo",mapsDataVO);
	}
	
	public int updateDroneLodData(MapsDataVO mapsDataVO) {
		return update("mapdataDAO.updateDroneLodData",mapsDataVO);
	}
	
	public int update3dGhostState(MapsDataVO mapsDataVO) {
		return update("mapdataDAO.update3dGhostState",mapsDataVO);
	}
	
	public int updateGpxInfo(MapsDataVO mapsDataVO) {
		return update("mapdataDAO.updateGpxInfo",mapsDataVO);
	}
	
	public int updateBimDataInfo(MapsDataVO mapsDataVO) {
		return update("mapdataDAO.updateBimDataInfo",mapsDataVO);
	}
	
	public int updateBimStatus(MapsDataVO mapsDataVO) {
		return update("mapdataDAO.updateBimStatus",mapsDataVO);
	}
	
	public int updateJpgInfo(MapsDataVO mapsDataVO) {
		return update("mapdataDAO.updateJpgInfo",mapsDataVO);
	}
	
	public MapsDataVO getMapDataInfoWithShp(String table) {
		return selectOne("mapdataDAO.getMapDataInfoWithShp",table);
	}
	
	public int updateDxfInfo(MapsDataVO mapsDataVO) {
		return update("mapdataDAO.updateDxfInfo", mapsDataVO);
	}
	
	public int updateDxfProcess(MapsDataVO mapsDataVO) {
		return update("mapdataDAO.updateDxfProcess", mapsDataVO);
	}
	
	public int updateGeojsonProcess(MapsDataVO mapsDataVO) {
		return update("mapdataDAO.updateGeojsonProcess", mapsDataVO);
	}
	
	public int changeShpDataType(MapsDataVO mapdataVo) {
		return update("mapdataDAO.changeShpDataType", mapdataVo);
	}
	public List<MapsDataVO> getImgViewInfo(Map<String, Object> param){
		return selectList("mapdataDAO.getImgViewInfo", param);
	}
	
	public List<HashMap<String, String>> getImgFileInfo(Map<String, Object> param){
		return selectList("mapdataDAO.getImgFileInfo", param);
	}
}

