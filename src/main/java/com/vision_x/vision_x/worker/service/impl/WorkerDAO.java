/**
 * 
 */
package com.vision_x.vision_x.worker.service.impl;

import org.springframework.stereotype.Repository;

import com.vision_x.vision_x.worker.service.ConvertWorkerItemVO;
import com.vision_x.vision_x.worker.service.WorkerCSVItemVO;

import egovframework.rte.psl.dataaccess.EgovAbstractMapper;

/**
 * WorkerDAO.java
 * digitalTwin
 * 2021. 3. 3.
 * @author Khaia
 * @Comment
 *
 */
@Repository("workerDAO")
public class WorkerDAO extends EgovAbstractMapper {
	
	public int insertCSVWorkerItem(WorkerCSVItemVO workerCSVItemVO) {
		return insert("workerDAO.insertCSVWorkerItem", workerCSVItemVO);
	}
	
	public int insertConvertWorkerItem(ConvertWorkerItemVO convertWorkerItemVO) {
		return insert("workerDAO.insertConvertWorkerItem", convertWorkerItemVO);
	}
	
	public ConvertWorkerItemVO getConvertInfo(ConvertWorkerItemVO convertWorkerItemVO) {
		return selectOne("workerDAO.getConvertInfo", convertWorkerItemVO);
	}
	
	public WorkerCSVItemVO getCsvWorker(WorkerCSVItemVO workerCSVItemVO) {
		return selectOne("workerDAO.getCsvWorker", workerCSVItemVO);
	}
	
	public int insert3dsConvertItem(ConvertWorkerItemVO convertWorkerItemVO) {
		return insert("workerDAO.insert3dsConvertItem", convertWorkerItemVO);
	}
	
	public int updateStatus(ConvertWorkerItemVO convertWorkerItemVO) {
		return update("workerDAO.updateStatus", convertWorkerItemVO);
	}
	
	public int insetIfcConvert(ConvertWorkerItemVO convertWorkerItemVO) {
		return insert("workerDAO.insetIfcConvert", convertWorkerItemVO);
	}
	
	
}
