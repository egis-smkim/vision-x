/**
 * 
 */
package com.vision_x.vision_x.worker.service;

import java.sql.SQLException;
import java.util.HashMap;

/**
 * WorkerService.java
 * digitalTwin
 * 2021. 3. 3.
 * @author Khaia
 * @Comment
 *
 */
public interface WorkerService {
	public int insertWorkerCSVItem(WorkerCSVItemVO workerCSVItemVO);
	
	public int insertConvertWorkerItem(ConvertWorkerItemVO convertWorkerItemVO);
	
	public ConvertWorkerItemVO getConvertInfo(ConvertWorkerItemVO convertWorkerItemVO);
	
	public HashMap<String, String> getProgressNum(String path);
	
	public WorkerCSVItemVO getCsvWorker(WorkerCSVItemVO workerCSVItemVO) throws SQLException;
	
	public int insert3dsConvertItem(ConvertWorkerItemVO convertWorkerItemVO);
	
	public int updateStatus(ConvertWorkerItemVO convertWorkerItemVO);
	
	public int insetIfcConvert(ConvertWorkerItemVO convertWorkerItemVO);
}
