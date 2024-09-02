package com.vision_x.vision_x.mail.service;

import java.util.ArrayList;
import java.util.List;


public class MailerVO {

	private String senderAddress;
	private String senderName;
	private Integer templateSid;
	private String title;
	private String body;
	private boolean individual;
	private boolean confirmAndSend;
	private boolean advertising;
	private Object parameters;
	private String referencesHeader; 
	private transient long reservationUtc;
	private String reservationDateTime;
	
	private List<RecipientForRequest> recipients = new ArrayList<RecipientForRequest>();
	
	private boolean useBasicUnsubscribeMsg; 
	private String unsubscribeMessage;

	public String getSenderAddress() {
		return senderAddress;
	}
	public void setSenderAddress(String senderAddress) {
		this.senderAddress = senderAddress;
	}
	public String getSenderName() {
		return senderName;
	}
	public void setSenderName(String senderName) {
		this.senderName = senderName;
	}
	public Integer getTemplateSid() {
		return templateSid;
	}
	public void setTemplateSid(Integer templateSid) {
		this.templateSid = templateSid;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getBody() {
		return body;
	}
	public void setBody(String body) {
		this.body = body;
	}
	public boolean isIndividual() {
		return individual;
	}
	public void setIndividual(boolean individual) {
		this.individual = individual;
	}
	public boolean isConfirmAndSend() {
		return confirmAndSend;
	}
	public void setConfirmAndSend(boolean confirmAndSend) {
		this.confirmAndSend = confirmAndSend;
	}
	public boolean isAdvertising() {
		return advertising;
	}
	public void setAdvertising(boolean advertising) {
		this.advertising = advertising;
	}
	public Object getParameters() {
		return parameters;
	}
	public void setParameters(Object parameters) {
		this.parameters = parameters;
	}
	public String getReferencesHeader() {
		return referencesHeader;
	}
	public void setReferencesHeader(String referencesHeader) {
		this.referencesHeader = referencesHeader;
	}
	public long getReservationUtc() {
		return reservationUtc;
	}
	public void setReservationUtc(long reservationUtc) {
		this.reservationUtc = reservationUtc;
	}
	public String getReservationDateTime() {
		return reservationDateTime;
	}
	public void setReservationDateTime(String reservationDateTime) {
		this.reservationDateTime = reservationDateTime;
	}
	public List<RecipientForRequest> getRecipients() {
		
		ArrayList<RecipientForRequest> recipientsList = new ArrayList();
		recipientsList.addAll(recipients);
		return recipientsList; 
	}
	public void setRecipients(List<RecipientForRequest> recipients) {
		this.recipients = new ArrayList<RecipientForRequest>();
		this.recipients.addAll(recipients);
		
	}
	public boolean isUseBasicUnsubscribeMsg() {
		return useBasicUnsubscribeMsg;
	}
	public void setUseBasicUnsubscribeMsg(boolean useBasicUnsubscribeMsg) {
		this.useBasicUnsubscribeMsg = useBasicUnsubscribeMsg;
	}
	public String getUnsubscribeMessage() {
		return unsubscribeMessage;
	}
	public void setUnsubscribeMessage(String unsubscribeMessage) {
		this.unsubscribeMessage = unsubscribeMessage;
	}


}