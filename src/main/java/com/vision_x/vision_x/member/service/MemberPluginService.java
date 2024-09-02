package com.vision_x.vision_x.member.service;

import java.util.HashMap;
import java.util.List;

public interface MemberPluginService {
	//MEMBER_PLUGIN 생성
	public int createMemberPlugin(MemberPluginVO mpvos);
	//리스트 가져오기
	public List<MemberPluginVO> getMemberPluginList(int mid);
	//앱키id로 row삭제
	public int deleteMemberPluginByAppKeyID(int appkid);
	//앱키id로 삭제
	public int republishAppKeyID(MemberPluginVO mpvo);
	
	public int countAppKeyByMid(int mid);

	public String getMemberIdByApiKey(String apikey);
	
	List<HashMap<String, Object>> getMemberInfo(String appkey);
	
	public String getMemberIPByApikey(String appkey);
	//주제도 정보 가져오기
	List<HashMap<String, Object>> getThematicMap();
	public int changeMemberState(int mid);
}