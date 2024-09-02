package com.vision_x.vision_x.desk.mapdata.service.impl;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.vision_x.vision_x.desk.mapdata.service.MapdataService;
import com.vision_x.vision_x.desk.mapdata.service.MapsDataVO;
import com.vision_x.vision_x.file.service.FileVO;
import com.vision_x.vision_x.member.service.MemberFileVO;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("mapdataService")
public class MapdataServiceImpl extends EgovAbstractServiceImpl implements MapdataService {
	
	@Resource(name="mapdataDAO")
	private MapdataDAO mapdataDAO;
	
	@Override
	public int insertMemFile(HashMap<String, String> map) {
		return mapdataDAO.insertMemFile(map);
	}

	@Override
	public int insertMemMapData(HashMap<String, String> map) {
		return mapdataDAO.insertMemMapData(map);
	}

	@Override
	public int updateDataId(HashMap<String, String> map) {
		return mapdataDAO.updateDataId(map);
	}

	@Override
	public List<HashMap<String, Object>> getCsvDataList(String mid) {
		return mapdataDAO.getCsvDataList(mid);
	}

	@Override
	public int updateDataName(HashMap<String, String> map) {
		return mapdataDAO.updateDataName(map);
	}

	@Override
	public HashMap<String, String> getCsvDataInfo(HashMap<String, String> map) {
		return mapdataDAO.getCsvDataInfo(map);
	}

	@Override
	public int updateCsvData(HashMap<String, String> map) {
		return mapdataDAO.updateCsvData(map);
	}

	@Override
	public int deleteSingleFileData(HashMap<String, String> map) {
		return mapdataDAO.deleteSingleFileData(map);
	}

	
	@Override
	public HashMap<String, String> getDataInfoWithParam(HashMap<String, Object> map) {
		return mapdataDAO.getDataInfoWithParam(map);
	}

	@Override
	public MapsDataVO getMapDataInfoWithParam(HashMap<String, Object> map) {
		return mapdataDAO.getMapDataInfoWithParam(map);
	}

	@Override
	public List<HashMap<String, String>> getMemFileInfoWithParam(HashMap<String, Object> map) {
		// TODO Auto-generated method stub
		return mapdataDAO.getMemFileInfoWithParam(map);
	}

	@Override
	public int updateThumbnailData(HashMap<String, String> map) {
		return mapdataDAO.updateThumbnailData(map);
	}

	@Override
	public int updateShpTableName(HashMap<String, String> map) {
		return mapdataDAO.updateShpTableName(map);
	}

	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.desk.mapdata.service.MapdataService#insertFiles(com.vision_x.vision_x.desk.mapdata.service.FileVO)
	 */
	@Override
	public int insertFile(FileVO fileVO) {
		// TODO Auto-generated method stub
		return mapdataDAO.insertFile(fileVO);
	}

	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.desk.mapdata.service.MapdataService#insertMapsData(com.vision_x.vision_x.desk.mapdata.service.MapsDataVO)
	 */
	@Override
	public int insertMapsData(MapsDataVO mapsDataVO) {
		// TODO Auto-generated method stub
		return mapdataDAO.insertMapsData(mapsDataVO);
	}

	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.desk.mapdata.service.MapdataService#updateMapsDataWorkerId(com.vision_x.vision_x.desk.mapdata.service.MapsDataVO)
	 */
	@Override
	public int updateMapsDataWorkerId(MapsDataVO mapsDataVO) {
		// TODO Auto-generated method stub
		return mapdataDAO.updateMapsDataWorkerId(mapsDataVO);
	}

	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.desk.mapdata.service.MapdataService#updateMapsDataImageInfo(com.vision_x.vision_x.desk.mapdata.service.MapsDataVO)
	 */
	@Override
	public int updateMapsDataImageInfo(MapsDataVO mapsDataVO) {
		// TODO Auto-generated method stub
		return mapdataDAO.updateMapsDataImageInfo(mapsDataVO);
	}

	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.desk.mapdata.service.MapdataService#getMemberImageData(int)
	 */
	@Override
	public List<MapsDataVO> getMemberImageData(int mid) {
		// TODO Auto-generated method stub
		return mapdataDAO.getMemberImageData(mid);
	}

	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.desk.mapdata.service.MapdataService#getMemberTerrainData(int)
	 */
	@Override
	public List<MapsDataVO> getMemberTerrainData(int mid) {
		// TODO Auto-generated method stub
		return mapdataDAO.getMemberTerrainData(mid);
	}


	@Override
	public HashMap<String, Object> getShpDataInfo(String dataId) {
		return mapdataDAO.getShpDataInfo(dataId);
	}

	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.desk.mapdata.service.MapdataService#updateMadaDataPointcloudInfo(com.vision_x.vision_x.desk.mapdata.service.MapsDataVO)
	 */
	@Override
	public int updateMapsDataPointcloudInfo(MapsDataVO mapsDataVO) {
		// TODO Auto-generated method stub
		return mapdataDAO.updateMapsDataPointcloudInfo(mapsDataVO);
	}

	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.desk.mapdata.service.MapdataService#getMemberPointCloudData(int)
	 */
	@Override
	public List<MapsDataVO> getMemberPointCloudData(int mid) {
		// TODO Auto-generated method stub
		return mapdataDAO.getMemberPointCloudData(mid);
	}

	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.desk.mapdata.service.MapdataService#updateMapsDataShapeInfo(com.vision_x.vision_x.desk.mapdata.service.MapsDataVO)
	 */
	@Override
	public int updateMapsDataShapeInfo(MapsDataVO mapsDataVO) {
		// TODO Auto-generated method stub
		return mapdataDAO.updateMapsDataShapeInfo(mapsDataVO);
	}

	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.desk.mapdata.service.MapdataService#getMapDataFromDataId(int)
	 */
	@Override
	public MapsDataVO getMapDataFromParam(HashMap<String, Object> map) {
		// TODO Auto-generated method stub
		return mapdataDAO.getMapDataFromParam(map);
	}

	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.desk.mapdata.service.MapdataService#updateShapeDataState(int, int)
	 */
	@Override
	public int updateShapeDataState(MapsDataVO mapsDataVO) {
		// TODO Auto-generated method stub
		return mapdataDAO.updateShapeDataState(mapsDataVO);
	}

	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.desk.mapdata.service.MapdataService#getMemberShapeData(int)
	 */
	@Override
	public List<MapsDataVO> getMemberShapeData(int mid) {
		// TODO Auto-generated method stub
		return mapdataDAO.getMemberShapeData(mid);
	}

	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.desk.mapdata.service.MapdataService#getMemberModelData(int)
	 */
	@Override
	public List<MapsDataVO> getMemberModelData(int mid) {
		// TODO Auto-generated method stub
		return mapdataDAO.getMemberModelData(mid);
	}

	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.desk.mapdata.service.MapdataService#updateMapsDataCSVInfo(com.vision_x.vision_x.desk.mapdata.service.MapsDataVO)
	 */
	@Override
	public int updateMapsDataCSVInfo(MapsDataVO mapsDataVO) {
		// TODO Auto-generated method stub
		return mapdataDAO.updateMapsDataCSVInfo(mapsDataVO);
	}

	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.desk.mapdata.service.MapdataService#updateMapsDataThumbnail(com.vision_x.vision_x.desk.mapdata.service.MapsDataVO)
	 */
	@Override
	public int updateMapsDataThumbnail(MapsDataVO mapsDataVO) {
		// TODO Auto-generated method stub
		return mapdataDAO.updateMapsDataThumbnail(mapsDataVO);
	}

	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.desk.mapdata.service.MapdataService#updateMapsDataCSVCompleteInfo(com.vision_x.vision_x.desk.mapdata.service.MapsDataVO)
	 */
	@Override
	public int updateMapsDataCSVCompleteInfo(MapsDataVO mapsDataVO) {
		// TODO Auto-generated method stub
		return mapdataDAO.updateMapsDataCSVCompleteInfo(mapsDataVO);
	}

	@Override
	public int updateRasterThumbnail(MapsDataVO mapsDataVO) {
		return mapdataDAO.updateRasterThumbnail(mapsDataVO);
	}

	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.desk.mapdata.service.MapdataService#getMemberCSVData(int)
	 */
	@Override
	public List<MapsDataVO> getMemberCSVData(int mid) {
		// TODO Auto-generated method stub
		return mapdataDAO.getMemberCSVData(mid);
	}

	@Override
	public List<MapsDataVO> getMemberLayerLists(HashMap<String, Object> param) {
		return mapdataDAO.getMemberLayerLists(param);
	}
	
	@Override
	public List<MapsDataVO> getLayerListsForDataId(HashMap<String, Object> param) {
		return mapdataDAO.getLayerListsForDataId(param);
	}

	@Override
	public int updateMapdataStatus(MapsDataVO vo) {
		return mapdataDAO.updateMapdataStatus(vo);
	}

	@Override
	public int updateCsvWithConverter(MapsDataVO vo) {
		// TODO Auto-generated method stub
		return mapdataDAO.updateCsvWithConverter(vo);
	}

	@Override
	public MemberFileVO getMemberSingleFileInfoParam(HashMap<String, Object> param) {
		// TODO Auto-generated method stub
		return mapdataDAO.getMemberSingleFileInfoParam(param);
	}

	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.desk.mapdata.service.MapdataService#deleteMapsData(com.vision_x.vision_x.desk.mapdata.service.MapsDataVO)
	 */
	@Override
	public int deleteMapsData(MapsDataVO mapsDataVO) {
		// TODO Auto-generated method stub
		return mapdataDAO.deleteMapsData(mapsDataVO);
	}

	@Override
	public MapsDataVO getMapCsvDataInfo(HashMap<String, Object> param) {
		// TODO Auto-generated method stub
		return mapdataDAO.getMapCsvDataInfo(param);
	}


	/*
	 * pcl file upload cloud upate info
	 * */
	@Override
	public int updatePointCloudInfo(MapsDataVO mapsDataVO) {
		return mapdataDAO.updatePointCloudInfo(mapsDataVO);
	}
	
	

	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.desk.mapdata.service.MapdataService#updateMapsDataDroneModelInfo(com.vision_x.vision_x.desk.mapdata.service.MapsDataVO)
	 */
	@Override
	public int updateMapsDataDroneModelInfo(MapsDataVO mapsDataVO) {
		// TODO Auto-generated method stub
		return mapdataDAO.updateMapsDataDroneModelInfo(mapsDataVO);
	}

	@Override
	public int updatePointCloudMove(MapsDataVO mapsDataVO) {
		// TODO Auto-generated method stub
		return mapdataDAO.updatePointCloudMove(mapsDataVO);
	}

	@Override
	public List<MapsDataVO> getSearchLayerList(HashMap<String, String> param) {
		return mapdataDAO.getSearchLayerList(param);
	}

	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.desk.mapdata.service.MapdataService#getMemberDroneModelData(int)
	 */
	@Override
	public List<MapsDataVO> getMemberDroneModelData(int mid) {
		// TODO Auto-generated method stub
		return mapdataDAO.getMemberDroneModelData(mid);
	}

	@Override
	public int updateErrorShape(MapsDataVO vo) {
		// TODO Auto-generated method stub
		return mapdataDAO.updateErrorShape(vo);
	}

	/*@Override
	public int deleteFiles(int dataId) {
		// TODO Auto-generated method stub
		return mapdataDAO.deleteFiles(dataId);
	}*/
	
	@Override
	public int deleteFilesWithParam(HashMap<String, Object> param) {
		// TODO Auto-generated method stub
		return mapdataDAO.deleteFilesWithParam(param);
	}

	@Override
	public int updatePclDataInfo(MapsDataVO mapsDataVO) {
		// TODO Auto-generated method stub
		return mapdataDAO.updatePclDataInfo(mapsDataVO);
	}

	@Override
	public int update3dTileInfo(MapsDataVO mapsDataVO) {
		// TODO Auto-generated method stub
		return mapdataDAO.update3dTileInfo(mapsDataVO);
	}

	@Override
	public int updateDroneLodData(MapsDataVO mapsDataVO) {
		// TODO Auto-generated method stub
		return mapdataDAO.updateDroneLodData(mapsDataVO);
	}

	@Override
	public int update3dGhostState(MapsDataVO mapsDataVO) {
		// TODO Auto-generated method stub
		return mapdataDAO.update3dGhostState(mapsDataVO);
	}

	@Override
	public int updateGpxInfo(MapsDataVO mapsDataVO) {
		// TODO Auto-generated method stub
		return mapdataDAO.updateGpxInfo(mapsDataVO);
	}

	@Override
	public int updateBimDataInfo(MapsDataVO mapsDataVO) {
		return mapdataDAO.updateBimDataInfo(mapsDataVO);
	}

	@Override
	public int updateBimStatus(MapsDataVO mapsDataVO) {
		return mapdataDAO.updateBimStatus(mapsDataVO);
	}

	@Override
	public int updateJpgInfo(MapsDataVO mapsDataVO) {
		return mapdataDAO.updateJpgInfo(mapsDataVO);
	}

	@Override
	public MapsDataVO getMapDataInfoWithShp(String table) {
		return mapdataDAO.getMapDataInfoWithShp(table);
	}

	@Override
	public int updateDxfInfo(MapsDataVO mapsDataVO) {
		return mapdataDAO.updateDxfInfo(mapsDataVO);
	}

	@Override
	public int updateDxfProcess(MapsDataVO mapsDataVO) {
		return mapdataDAO.updateDxfProcess(mapsDataVO);
	}

	@Override
	public int updateGeojsonProcess(MapsDataVO mapsDataVO) {
		return mapdataDAO.updateGeojsonProcess(mapsDataVO);
	}

	@Override
	public List<MapsDataVO> getImgViewInfo(Map<String, Object> param) {
		// TODO Auto-generated method stub
		return mapdataDAO.getImgViewInfo(param);
	}

	@Override
	public List<HashMap<String, String>> getImgFileInfo(Map<String, Object> param) {
		// TODO Auto-generated method stub
		return mapdataDAO.getImgFileInfo(param);
	}
	
	@Override
	public int changeShpDataType(MapsDataVO mapdataVo) {
		// TODO Auto-generated method stub
		return mapdataDAO.changeShpDataType(mapdataVo);
	}
}