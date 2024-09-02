package com.vision_x.vision_x.desk.mapdata.service;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.vision_x.vision_x.file.service.FileVO;
import com.vision_x.vision_x.member.service.MemberFileVO;
import com.ibatis.sqlmap.client.SqlMapException;

public interface MapdataService {
	
	public int insertMemFile(HashMap<String, String> map);
	
	public int insertMemMapData(HashMap<String, String> map);
	
	public int updateDataId(HashMap<String, String> map);
	
	public List<HashMap<String, Object>> getCsvDataList(String mid);
	
	public int updateDataName(HashMap<String, String> map);
	
	public HashMap<String, String> getCsvDataInfo(HashMap<String, String> map);
	
	public int updateCsvData(HashMap<String, String> map);
	
	public int deleteSingleFileData(HashMap<String, String> map);
	
	//public HashMap<String, String> getDataInfo(String DATAID);
	public HashMap<String, String> getDataInfoWithParam(HashMap<String, Object> map);
	
	//public List<HashMap<String, String>> getMemFileInfoWithDataId(String DATAID);
	
	public List<HashMap<String, String>> getMemFileInfoWithParam(HashMap<String, Object> map);
	
	public int updateThumbnailData(HashMap<String, String> map);
	
	public int updateShpTableName(HashMap<String, String> map);
	
	//public MapsDataVO getMapDataInfo(String id);
	public MapsDataVO getMapDataInfoWithParam(HashMap<String, Object> map);
	
	public int insertFile(FileVO fileVO);
	
	public int insertMapsData(MapsDataVO mapsDataVO);
	
	public int updateMapsDataWorkerId(MapsDataVO mapsDataVO);
	
	public int updateMapsDataImageInfo(MapsDataVO mapsDataVO);
	
	public List<MapsDataVO> getMemberImageData(int mid);
	
	public List<MapsDataVO> getMemberTerrainData(int mid);
	
	public HashMap<String, Object> getShpDataInfo(String dataId);

	public List<MapsDataVO> getMemberPointCloudData(int mid);
	
	public int updateMapsDataPointcloudInfo(MapsDataVO mapsDataVO);

	public int updateMapsDataShapeInfo(MapsDataVO mapsDataVO);
	
	public MapsDataVO getMapDataFromParam(HashMap<String, Object> map);
	
	public int updateShapeDataState(MapsDataVO mapsDataVO);
	
	public List<MapsDataVO> getMemberShapeData(int mid);
	
	public List<MapsDataVO> getMemberModelData(int mid);
	
	public int updateMapsDataCSVInfo(MapsDataVO mapsDataVO);
	
	public int updateMapsDataThumbnail(MapsDataVO mapsDataVO);
	
	public int updateMapsDataCSVCompleteInfo(MapsDataVO mapsDataVO);
	
	public int updateRasterThumbnail(MapsDataVO mapsDataVO);
	
	public List<MapsDataVO> getMemberCSVData(int mid);
	
	public List<MapsDataVO> getMemberLayerLists(HashMap<String, Object> param);
	
	public List<MapsDataVO> getLayerListsForDataId(HashMap<String, Object> param);

	public int updateMapdataStatus(MapsDataVO vo) throws SQLException;
	
	public int updateCsvWithConverter(MapsDataVO vo);
	
	//public MemberFileVO getMemberSingleFileInfo(String dataid) throws SQLException;
	
	public MemberFileVO getMemberSingleFileInfoParam(HashMap<String, Object> param);
	
	public int deleteMapsData(MapsDataVO mapsDataVO);
	
	public MapsDataVO getMapCsvDataInfo(HashMap<String, Object> param) throws SQLException;
	
	public int updatePointCloudInfo(MapsDataVO mapsDataVO);

	public int updateMapsDataDroneModelInfo(MapsDataVO mapsDataVO);
	
	public List<MapsDataVO> getMemberDroneModelData(int mid); 
	
	public int updatePointCloudMove(MapsDataVO mapsDataVO);
	
	public List<MapsDataVO> getSearchLayerList(HashMap<String, String> param);
	
	public int updateErrorShape(MapsDataVO vo);

	//public int deleteFiles(int dataId);
	
	public int deleteFilesWithParam(HashMap<String, Object> param);
	
	public int updatePclDataInfo(MapsDataVO mapsDataVO);
	
	public int update3dTileInfo(MapsDataVO mapsDataVO);
	
	public int updateDroneLodData(MapsDataVO mapsDataVO);
	
	public int update3dGhostState(MapsDataVO mapsDataVO);
	
	public int updateGpxInfo(MapsDataVO mapsDataVO);
	
	public int updateBimDataInfo(MapsDataVO mapsDataVO);
	
	public int updateBimStatus(MapsDataVO mapsDataVO);
	
	public int updateJpgInfo(MapsDataVO mapsDataVO);
	
	public MapsDataVO getMapDataInfoWithShp(String table);
	
	public int updateDxfInfo(MapsDataVO mapsDataVO);
	
	public int updateDxfProcess(MapsDataVO mapsDataVO); 
	
	public int updateGeojsonProcess(MapsDataVO mapsDataVO);
	
	public int changeShpDataType(MapsDataVO mapdataVo);

	public List<MapsDataVO> getImgViewInfo(Map<String, Object> param);
	
	public List<HashMap<String, String>> getImgFileInfo(Map<String, Object> param);
}
