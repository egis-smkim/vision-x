package com.vision_x.vision_x.member.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.vision_x.vision_x.member.service.MemberPluginVO;

import egovframework.rte.psl.dataaccess.EgovAbstractMapper;

@Repository("memberPluginDAO")
public class MemberPluginDAO extends EgovAbstractMapper {

	// MEMBER_PLUGIN 생성
	public int createMemberPlugin(MemberPluginVO mpvo) {
		return insert("memberPluginDAO.createMemberPlugin", mpvo);
	};

	public List<MemberPluginVO> getMemberPluginList(int mid) {
		return selectList("memberPluginDAO.getMemberPluginList", mid);
	}

	// 앱키id로 row삭제
	public int deleteMemberPluginByAppKeyID(int appkid) {
		return delete("memberPluginDAO.deleteMemberPluginByAppKeyID", appkid);
	};

	// 수정
	public int republishAppKeyID(MemberPluginVO mpvo) {
		return update("memberPluginDAO.republishAppKeyID", mpvo);
	};
	
	public int countAppKeyByMid(int mid) {
		return selectOne("memberPluginDAO.countAppKeyByMid", mid);
	}
	
	public List<HashMap<String, Object>> getMemberInfo(String appkey){
		
		return selectList("memberPluginDAO.getMemberInfo", appkey);
	}
	
	public String getMemberIdByApiKey(String appkey) {
		// TODO Auto-generated method stub
		return selectOne("memberPluginDAO.getMemberIdByApiKey", appkey);

	}
	
	public String getMemberIPByApikey(String appkey){
		return selectOne("memberPluginDAO.getMemberIPByApikey",appkey);
	}
	
	public List<HashMap<String, Object>> getThematicMap() {
		// TODO Auto-generated method stub
		return selectList("memberPluginDAO.getThematicMap");
	}

	public int changeMemberState(int mid) {
		// TODO Auto-generated method stub
		return update("memberPluginDAO.changeMemberState", mid);
	}
}