package com.vision_x.vision_x.apps.service;

import java.util.HashMap;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

public interface AppFileUploadService {

	public int insertCsvUploadInfo(CsvVO vo);
	
	public CsvVO getCsvFileInfo(int acid);
	
	public int updateCsvInfo(CsvVO vo);
	
	public boolean singleUploadFile(MultipartFile file, String path,String fileName);
	
	public boolean multipleFileUpload(List<MultipartFile> files, String path,String fileName);
	
	public boolean csvToPostgresqlTbl(HashMap<String, String> param);
	
	public int updateCsvItemInfo(HashMap<String, Object> param);
	
	public int insertShpModelInfo(ShpModelVO vo);
	
	public ShpModelVO getShpModelInfo(int asid);
	
	public boolean convertShp2Model(String param,String path,String fileName);
	
	public int updateShp2Modelinfo(ShpModelVO vo);
	
	public List<HashMap<String, Object>> getAppShpPrjctInfo(int mid);
	
	public HashMap<String, Object> getShpModelLayerInfo(int asid);
	
	public int deleteShp3dModel(int asid);
	
	public int dropShpTable(String tableInfo);
		
	public int updateProcessShp(ShpModelVO vo);
	
	public int insertShpLayerInfo(ShpModelLayerVO vo);
	
	public int updateAppShpBoundary(ShpModelVO vo);
	
	public ShpModelLayerVO getShpLayerInfo(int afid); 
	
	public List<ShpModelLayerVO> getShpLayerList(int asid);
	
	public int updateShpConvexHull(ShpModelLayerVO vo);
	
	public ShpModelLayerVO getShpLayerBoundary(int afid);
	
	public int updateProjectName(ShpModelVO vo);
	
	public int updateShpLayerStatus(ShpModelLayerVO vo);

	public int changeMemberState(int mid); 
}
