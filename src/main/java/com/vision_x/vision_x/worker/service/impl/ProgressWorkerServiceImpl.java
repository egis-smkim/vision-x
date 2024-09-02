package com.vision_x.vision_x.worker.service.impl;

import java.util.HashMap;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.vision_x.vision_x.worker.service.ProgressWorkerService;
import com.vision_x.vision_x.worker.service.ProgressWorkerVO;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("progressWorkerService")
public class ProgressWorkerServiceImpl extends EgovAbstractServiceImpl implements ProgressWorkerService {

	@Resource(name="progressWorkerDAO")
	private ProgressWorkerDAO progressWorkerDAO;

	@Override
	public int insertWaitingProcess(ProgressWorkerVO vo) {
		// TODO Auto-generated method stub
		return progressWorkerDAO.insertWaitingProcess(vo);
	}

	@Override
	public ProgressWorkerVO getProgressInfoFromParam(HashMap<String, Object> param) {
		// TODO Auto-generated method stub
		return progressWorkerDAO.getProgressInfoFromParam(param);
	}

	@Override
	public int insertAppProgress(ProgressWorkerVO vo) {
		// TODO Auto-generated method stub
		return progressWorkerDAO.insertAppProgress(vo);
	}

	@Override
	public ProgressWorkerVO getAppProgressInfo(int pid) {
		// TODO Auto-generated method stub
		return progressWorkerDAO.getAppProgressInfo(pid);
	}

	@Override
	public int updateProgress(ProgressWorkerVO vo) {
		// TODO Auto-generated method stub
		return progressWorkerDAO.updateProgress(vo);
	}
	
	
	
}
