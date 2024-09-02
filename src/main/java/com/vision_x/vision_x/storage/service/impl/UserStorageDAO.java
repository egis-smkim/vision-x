package com.vision_x.vision_x.storage.service.impl;

import org.springframework.stereotype.Repository;

import com.vision_x.vision_x.storage.service.UserStorageVO;

import egovframework.rte.psl.dataaccess.EgovAbstractMapper;

@Repository("userStorageDAO")
public class UserStorageDAO extends EgovAbstractMapper{

	public UserStorageVO getUserStorageInfo(String ip) {
		 return selectOne("userStorageDAO.getUserStorageInfo",ip);
	}
}
