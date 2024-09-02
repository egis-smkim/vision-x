package com.vision_x.vision_x.worker.service.impl;

import java.util.HashMap;

import org.springframework.stereotype.Repository;
import com.vision_x.vision_x.worker.service.ProgressWorkerVO;
import egovframework.rte.psl.dataaccess.EgovAbstractMapper;

@Repository("progressWorkerDAO")
public class ProgressWorkerDAO extends EgovAbstractMapper {
	
	public int insertWaitingProcess(ProgressWorkerVO vo) {
		return insert("progressWorkerDAO.insertWaitingProcess", vo);
	}
	
	public ProgressWorkerVO getProgressInfoFromParam(HashMap<String, Object> param) {
		return selectOne("progressWorkerDAO.getProgressInfoFromParam", param);
	}
	
	public int insertAppProgress(ProgressWorkerVO vo) {
		return insert("progressWorkerDAO.insertAppProgress", vo);
	}
	
	public ProgressWorkerVO getAppProgressInfo(int pid) {
		return selectOne("progressWorkerDAO.getAppProgressInfo", pid);
	}
	
	public int updateProgress(ProgressWorkerVO vo) {
		return update("progressWorkerDAO.updateProgress", vo);
	}
}
