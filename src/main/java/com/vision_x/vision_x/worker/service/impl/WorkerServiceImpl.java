/**
 * 
 */
package com.vision_x.vision_x.worker.service.impl;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.HashMap;

import javax.annotation.Resource;

import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.vision_x.vision_x.worker.service.ConvertWorkerItemVO;
import com.vision_x.vision_x.worker.service.WorkerCSVItemVO;
import com.vision_x.vision_x.worker.service.WorkerService;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

/**
 * WorkerServiceImpl.java
 * digitalTwin
 * 2021. 3. 3.
 * @author Khaia
 * @Comment
 *
 */
@Service("workerService")
public class WorkerServiceImpl extends EgovAbstractServiceImpl implements WorkerService {
	protected Logger logger = LoggerFactory.getLogger(this.getClass());
	@Resource(name="workerDAO")
	private WorkerDAO workerDAO;

	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.worker.service.WorkerService#insertWorkerCSVItem(com.vision_x.vision_x.worker.service.WorkerCSVItemVO)
	 */
	@Override
	public int insertWorkerCSVItem(WorkerCSVItemVO workerCSVItemVO) {
		// TODO Auto-generated method stub
		return workerDAO.insertCSVWorkerItem(workerCSVItemVO);
	}

	/* (non-Javadoc)
	 * @see com.vision_x.vision_x.worker.service.WorkerService#insertConvertWorkerItem(com.vision_x.vision_x.worker.service.ConvertWorkerItemVO)
	 */
	@Override
	public int insertConvertWorkerItem(ConvertWorkerItemVO convertWorkerItemVO) {
		// TODO Auto-generated method stub
		return workerDAO.insertConvertWorkerItem(convertWorkerItemVO);
	}

	@Override
	public ConvertWorkerItemVO getConvertInfo(ConvertWorkerItemVO convertWorkerItemVO) {
		return workerDAO.getConvertInfo(convertWorkerItemVO);
	}
	
	
	
	@Override
	public WorkerCSVItemVO getCsvWorker(WorkerCSVItemVO workerCSVItemVO) {
		// TODO Auto-generated method stub
		return workerDAO.getCsvWorker(workerCSVItemVO);
	}

	@Override
	public HashMap<String, String> getProgressNum(String path) {
		HashMap<String, String> result = new HashMap<>();
		
		File file = new File(path);
		
		if(file.exists()) {
			
		}
		try {
			
			String line =FileUtils.readFileToString(file,"UTF-8");
			String progress = line;
			
			result.put("PROGRESS", progress);
			
		} catch (FileNotFoundException e) {
			logger.error("File Error-FileNotFoundException");
		} catch (IOException e) {
			logger.error("Data Access Error-IOException");
		}
		return result;
	}

	@Override
	public int insert3dsConvertItem(ConvertWorkerItemVO convertWorkerItemVO) {
		// TODO Auto-generated method stub
		return workerDAO.insert3dsConvertItem(convertWorkerItemVO);
	}

	@Override
	public int updateStatus(ConvertWorkerItemVO convertWorkerItemVO) {
		return workerDAO.updateStatus(convertWorkerItemVO);
	}

	@Override
	public int insetIfcConvert(ConvertWorkerItemVO convertWorkerItemVO) {
		return workerDAO.insetIfcConvert(convertWorkerItemVO);
	}

	
}
