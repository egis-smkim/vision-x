package com.vision_x.vision_x.worker.service;

import java.util.HashMap;
import java.util.List;

import com.vision_x.vision_x.desk.mapdata.service.MapsDataVO;
import com.vision_x.vision_x.member.service.MemberVO;

public interface WorkerApiService {

	public List<ConvertWorkerItemVO> getWaitConvertItems(List<String> types);
	
	public List<ConvertWorkerItemVO> getWaitConvertItemsCopier();
	
	public HashMap<String, Integer> getConvertExecutingCount();
	
	public int updateWorkerStatus(ConvertWorkerItemVO cwiv);
	
	public MemberVO getWorkerItemOwnerId(MemberVO mvo);
	
	public int updateMapsStatus(MapsDataVO mvo);
	
	public MapsDataVO getMapsDataItem(MapsDataVO mvo);
	
	public int updateExecuteStatusTime(HashMap<String, String> params);
	
	public int updateWorkerItemStatus(ConvertWorkerItemVO cwiv);
	
	public int updateMapsDataStatus(MapsDataVO mvo); 
	
	public int updateProgressVO(ProgressWorkerVO pvo);
	
	public List<WorkerCSVItemVO> getCsvItemList();
	
	public int updateCsvStatus(HashMap<String, Object> params);
	
	public int updateExceuteStartTime(int wcid);
	
	public int updateExecuteEndTime(int wcid);
}
