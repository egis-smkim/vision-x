package com.vision_x.vision_x.mail.service;

import java.util.ArrayList;
import java.util.List;

public class RecipientGroupFilter {
	private Boolean andFilter;
	private List<String> groups = new ArrayList<>();
	
	public Boolean getAndFilter() {
		return andFilter;
	}
	public void setAndFilter(Boolean andFilter) {
		this.andFilter = andFilter;
	}
	public List<String> getGroups() {
		ArrayList<String> groupsList = new ArrayList<String>();
		groupsList.addAll(groups);
		return groupsList; 
	}
	public void setGroups(List<String> groups) {
		this.groups = new ArrayList<String>();
		this.groups.addAll(groups);
	}
	
}