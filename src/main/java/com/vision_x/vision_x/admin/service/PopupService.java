package com.vision_x.vision_x.admin.service;

import java.util.List;

public interface PopupService {

	List<PopupVO> selectPopupList();

	int insertPopup(PopupVO popupVO);

	PopupVO viewPopup(int pop_id);

	int updatePopup(PopupVO popupVO);

	List<PopupVO> selectPopupListByUse();

}
