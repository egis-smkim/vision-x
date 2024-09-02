package com.vision_x.vision_x.member.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.vision_x.vision_x.member.service.MemberPluginService;
import com.vision_x.vision_x.member.service.MemberPluginVO;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("memberPluginService")
public class MemberPluginServiceImpl extends EgovAbstractServiceImpl implements MemberPluginService {
	
	@Resource(name="memberPluginDAO")
	private MemberPluginDAO memberPluginDAO;
	
	@Override
	public List<MemberPluginVO> getMemberPluginList(int mid) {
		// TODO Auto-generated method stub
		return memberPluginDAO.getMemberPluginList(mid);
	}

	@Override
	public int createMemberPlugin(MemberPluginVO mpvos) {
		// TODO Auto-generated method stub
		return memberPluginDAO.createMemberPlugin(mpvos);
	}

	@Override
	public int deleteMemberPluginByAppKeyID(int appkid) {
		// TODO Auto-generated method stub
		return memberPluginDAO.deleteMemberPluginByAppKeyID(appkid);
	}

	@Override
	public int republishAppKeyID(MemberPluginVO mpvo) {
		// TODO Auto-generated method stub
		return memberPluginDAO.republishAppKeyID(mpvo);
	}

	@Override
	public int countAppKeyByMid(int mid) {
		// TODO Auto-generated method stub
		return memberPluginDAO.countAppKeyByMid(mid);
	}

	@Override
	public List<HashMap<String, Object>> getMemberInfo(String appkey) {
		// TODO Auto-generated method stub
		return memberPluginDAO.getMemberInfo(appkey);
	}

	@Override
	public String getMemberIdByApiKey(String apikey) {
		// TODO Auto-generated method stub
		return memberPluginDAO.getMemberIdByApiKey(apikey);
	}
	
	@Override
	public String getMemberIPByApikey(String appkey) {
		// TODO Auto-generated method stub
		return memberPluginDAO.getMemberIPByApikey(appkey);
	}
	
	@Override
	public List<HashMap<String, Object>> getThematicMap() {
		// TODO Auto-generated method stub
		return memberPluginDAO.getThematicMap();
	}

	@Override
	public int changeMemberState(int mid) {
		// TODO Auto-generated method stub
		return memberPluginDAO.changeMemberState(mid);
	}
}