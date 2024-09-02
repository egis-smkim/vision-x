package com.vision_x.vision_x.admin.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public interface SubscribeService {
	public SubscribeVO selectSubscribe(int sid);
	public List<Object> getSubscribePaymentList(int mid);
}
