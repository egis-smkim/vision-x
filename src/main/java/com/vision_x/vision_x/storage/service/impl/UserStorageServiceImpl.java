package com.vision_x.vision_x.storage.service.impl;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.vision_x.vision_x.storage.service.UserStorageService;
import com.vision_x.vision_x.storage.service.UserStorageVO;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("userStorageService")
public class UserStorageServiceImpl extends EgovAbstractServiceImpl implements UserStorageService {

	@Resource(name="userStorageDAO")
	private UserStorageDAO userStorageDAO;
	
	protected Logger logger = LoggerFactory.getLogger(this.getClass());
	
	@Override
	public UserStorageVO getUserStorageInfo(String ip) {
		return userStorageDAO.getUserStorageInfo(ip);
	}

}
