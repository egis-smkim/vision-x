package com.vision_x.vision_x.worker.service.impl;

import java.util.HashMap;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.vision_x.vision_x.desk.mapdata.service.MapsDataVO;
import com.vision_x.vision_x.member.service.MemberVO;
import com.vision_x.vision_x.worker.service.ConvertWorkerItemVO;
import com.vision_x.vision_x.worker.service.ProgressWorkerVO;
import com.vision_x.vision_x.worker.service.WorkerCSVItemVO;

import egovframework.rte.psl.dataaccess.EgovAbstractMapper;

@Repository("workerApiDAO")
public class WorkerApiDAO extends EgovAbstractMapper{

	public List<ConvertWorkerItemVO> getWaitConvertItems(List<String> types){
		return selectList("workerApiDAO.getWaitConvertItems",types);
	}
	
	public List<ConvertWorkerItemVO> getWaitConvertItemsCopier(){
		return selectList("workerApiDAO.getWaitConvertItemsCopier");
	}
	
	public HashMap<String, Integer> getConvertExecutingCount() {
		return selectOne("workerApiDAO.getConvertExecutingCount");
	}
	
	public int updateWorkerStatus(ConvertWorkerItemVO cwvo) {
		return update("workerApiDAO.updateWorkerStatus",cwvo);
	}
	
	public MemberVO getWorkerItemOwnerId(MemberVO mvo){
		return selectOne("workerApiDAO.getWorkerItemOwnerId", mvo);
	}
	
	public int updateMapsStatus(MapsDataVO mvo) {
		return update("workerApiDAO.updateMapsStatus", mvo);
	}
	
	public MapsDataVO getMapsDataItem(MapsDataVO vo) {
		return selectOne("workerApiDAO.getMapsDataItem", vo);
	}
	
	public int updateExecuteStatusTime(HashMap<String, String> params) {
		return update("workerApiDAO.updateExecuteStatusTime", params);
	}
	
	public int updateWorkerItemStatus(ConvertWorkerItemVO cwvo) {
		return update("workerApiDAO.updateWorkerItemStatus", cwvo);
	}
	
	public int updateMapsDataStatus(MapsDataVO mvo) {
		return update("workerApiDAO.updateMapsDataStatus", mvo);
	}
	
	public int updateProgressVO(ProgressWorkerVO pvo) {
		return update("workerApiDAO.updateProgressVO", pvo);
	}
	
	public List<WorkerCSVItemVO> getCsvItemList(){
		return selectList("workerApiDAO.getCsvItemList");
	}
	
	public int updateCsvStatus(HashMap<String, Object> param) {
		return update("workerApiDAO.updateCsvStatus",param);
	}
	
	public int updateExceuteStartTime(int wcid) {
		return update("workerApiDAO.updateExceuteStartTime",wcid);
	}
	
	public int updateExecuteEndTime(int wcid) {
		return update("workerApiDAO.updateExecuteEndTime",wcid);
	}
}
