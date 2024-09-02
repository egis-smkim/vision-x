package com.vision_x.vision_x.admin.service;

import java.util.List;

public interface SlideContentsService {
	
	List<SlideContentsVO> selectSlideContentsServiceList();
	
	int insertSlideContents(SlideContentsVO vo);
	
	SlideContentsVO viewSlideContents(int scid);
	
	int updateSlideContents(SlideContentsVO vo);
	
	int updateSlideContentsIndex(SlideContentsVO vo);
	
	List<SlideContentsVO> selectSlideContentsListByUse();

	int deleteSlideContents(SlideContentsVO vo);

	int updateSlideContentsIndexIsNull(SlideContentsVO vo);

}
