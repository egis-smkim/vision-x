package com.vision_x.vision_x.worker.service;

import java.util.HashMap;

public interface ProgressWorkerService {

	public int insertWaitingProcess(ProgressWorkerVO vo);
	
	public ProgressWorkerVO getProgressInfoFromParam(HashMap<String, Object> param);
	
	public int insertAppProgress(ProgressWorkerVO vo);
	
	public ProgressWorkerVO getAppProgressInfo(int pid);
	
	public int updateProgress(ProgressWorkerVO vo);
}
