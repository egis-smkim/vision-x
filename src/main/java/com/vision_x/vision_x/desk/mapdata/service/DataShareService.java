package com.vision_x.vision_x.desk.mapdata.service;

import java.util.HashMap;
import java.util.List;

import com.vision_x.vision_x.member.service.MemberVO;

public interface DataShareService {
		
	public int insertDataShare(DataShareVO dataShareVO);

	public int updateDataShare(DataShareVO dataShareVO);

	public int deleteDataShare(DataShareVO dataShareVO);

	public List<DataShareVO> getDataShareInfo(HashMap<String, Object> param);

	public List<DataShareVO> getDataShareForAll();
	
	public List<DataShareVO> getDataShareForMid(MemberVO mvo);
	
	public List<DataShareVO> getDataShareForGid(HashMap<String, Object> param);
	
	public List<DataShareVO> selectCheckRequst(MemberVO mvo);
	
}
