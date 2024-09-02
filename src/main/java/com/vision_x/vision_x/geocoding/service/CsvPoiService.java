package com.vision_x.vision_x.geocoding.service;

import java.util.List;

public interface CsvPoiService {

	public List<PoiObjVO> getImgPoiList(String type);
	
	public int insertMemPoiInfo(MemPoiVO vo);
	
	public MemPoiVO getMemberPoiInfo(int dataid);
}
