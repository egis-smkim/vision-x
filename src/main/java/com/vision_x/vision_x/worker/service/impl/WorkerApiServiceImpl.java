package com.vision_x.vision_x.worker.service.impl;

import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.vision_x.vision_x.desk.mapdata.service.MapsDataVO;
import com.vision_x.vision_x.member.service.MemberVO;
import com.vision_x.vision_x.worker.service.ConvertWorkerItemVO;
import com.vision_x.vision_x.worker.service.ProgressWorkerVO;
import com.vision_x.vision_x.worker.service.WorkerApiService;
import com.vision_x.vision_x.worker.service.WorkerCSVItemVO;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("workerApiService")
public class WorkerApiServiceImpl extends EgovAbstractServiceImpl implements WorkerApiService{

	@Resource(name="workerApiDAO")
	private WorkerApiDAO workerApiDAO;

	@Override
	public List<ConvertWorkerItemVO> getWaitConvertItems(List<String> types) {
		return workerApiDAO.getWaitConvertItems(types);
	}

	@Override
	public HashMap<String, Integer> getConvertExecutingCount() {
		return workerApiDAO.getConvertExecutingCount();
	}

	@Override
	public int updateWorkerStatus(ConvertWorkerItemVO cwiv) {
		return workerApiDAO.updateWorkerStatus(cwiv);
	}

	@Override
	public MemberVO getWorkerItemOwnerId(MemberVO mvo) {
		return workerApiDAO.getWorkerItemOwnerId(mvo);
	}

	@Override
	public int updateMapsStatus(MapsDataVO mvo) {
		return workerApiDAO.updateMapsStatus(mvo);
	}

	@Override
	public MapsDataVO getMapsDataItem(MapsDataVO mvo) {
		return workerApiDAO.getMapsDataItem(mvo);
	}

	@Override
	public int updateExecuteStatusTime(HashMap<String, String> params) {
		return workerApiDAO.updateExecuteStatusTime(params);
	}

	@Override
	public int updateWorkerItemStatus(ConvertWorkerItemVO cwiv) {
		return workerApiDAO.updateWorkerItemStatus(cwiv);
	}

	@Override
	public int updateMapsDataStatus(MapsDataVO mvo) {
		return workerApiDAO.updateMapsDataStatus(mvo);
	}

	@Override
	public List<ConvertWorkerItemVO> getWaitConvertItemsCopier() {
		return workerApiDAO.getWaitConvertItemsCopier();
	}

	@Override
	public int updateProgressVO(ProgressWorkerVO pvo) {
		return workerApiDAO.updateProgressVO(pvo);
	}

	@Override
	public List<WorkerCSVItemVO> getCsvItemList() {
		return workerApiDAO.getCsvItemList();
	}

	@Override
	public int updateCsvStatus(HashMap<String, Object> params) {
		return workerApiDAO.updateCsvStatus(params);
	}

	@Override
	public int updateExceuteStartTime(int wcid) {
		return workerApiDAO.updateExceuteStartTime(wcid);
	}

	@Override
	public int updateExecuteEndTime(int wcid) {
		return workerApiDAO.updateExecuteEndTime(wcid);
	}
	
	
}
