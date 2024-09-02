package com.vision_x.vision_x.member.service;

import java.io.Serializable;

/**
 * MemberPaymentVO.java
 * digitalTwin
 * 2022. 03. 02.
 * @author yoonee
 * @Comment
 *
 */
public class MemberPaymentVO implements Serializable {
	private int mpid;
	private int pid;
	private int mid;
	private int sid;
	
	private String ptype;
	private String product_name;
	private String subscribe_name;
	private String client_type;
	private String order_id;
	private String transaction_key;
	private String payment_key;
	private String secret;
	private String cancel_info;

	private int amount;
	private int supplied_amount;
	private int vat;
	private int balance_amount;
	private int discount;
	private String payment_method;
	private String payment_info;
	private String cancels;
	private String cash_receipt;
	private String use_escrow;
	private String status;
	
	private String request_date;
	private String due_date;
	private String approved_date;
	
	private String service_type;
	private String service_code;
	private String service_name;
	
	public String getSecret() {
		return secret;
	}

	public void setSecret(String secret) {
		this.secret = secret;
	}

	public int getBalance_amount() {
		return balance_amount;
	}

	public void setBalance_amount(int balance_amount) {
		this.balance_amount = balance_amount;
	}

	public int getDiscount() {
		return discount;
	}

	public void setDiscount(int discount) {
		this.discount = discount;
	}

	public String getApproved_date() {
		return approved_date;
	}

	public void setApproved_date(String approved_date) {
		this.approved_date = approved_date;
	}

	public int getMpid() {
		return mpid;
	}

	public void setMpid(int mpid) {
		this.mpid = mpid;
	}

	public int getPid() {
		return pid;
	}

	public void setPid(int pid) {
		this.pid = pid;
	}

	public int getMid() {
		return mid;
	}

	public void setMid(int mid) {
		this.mid = mid;
	}
	
	public void setSid(int sid) {
		this.sid = sid;
	}

	public int getSid() {
		return sid;
	}
	
	public String getPtype() {
		return ptype;
	}
	public void setPtype(String ptype) {
		this.ptype = ptype;
	}
	
	public String getClient_type() {
		return client_type;
	}
	public void setClient_type(String client_type) {
		this.client_type = client_type;
	}
	
	public String getOrder_id() {
		return order_id;
	}
	
	public void setOrder_id(String order_id) {
		this.order_id = order_id;
	}
	
	public String getTransaction_key() {
		return transaction_key;
	}
	
	public void setTransaction_key(String transaction_key) {
		this.transaction_key = transaction_key;
	}

	public String getPayment_key() {
		return payment_key;
	}

	public void setPayment_key(String payment_key) {
		this.payment_key = payment_key;
	}

	public int getAmount() {
		return amount;
	}

	public void setAmount(int amount) {
		this.amount = amount;
	}

	public int getSupplied_amount() {
		return supplied_amount;
	}

	public void setSupplied_amount(int supplied_amount) {
		this.supplied_amount = supplied_amount;
	}

	public int getVat() {
		return vat;
	}

	public void setVat(int vat) {
		this.vat = vat;
	}

	public String getPayment_method() {
		return payment_method;
	}

	public void setPayment_method(String payment_method) {
		this.payment_method = payment_method;
	}

	public String getPayment_info() {
		return payment_info;
	}

	public void setPayment_info(String payment_info) {
		this.payment_info = payment_info;
	}

	public String getCancels() {
		return cancels;
	}

	public void setCancels(String cancels) {
		this.cancels = cancels;
	}

	public String getCash_receipt() {
		return cash_receipt;
	}

	public void setCash_receipt(String cash_receipt) {
		this.cash_receipt = cash_receipt;
	}

	public String getUse_escrow() {
		return use_escrow;
	}

	public void setUse_escrow(String use_escrow) {
		this.use_escrow = use_escrow;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getRequest_date() {
		return request_date;
	}

	public void setRequest_date(String request_date) {
		this.request_date = request_date;
	}
	
	public String getDue_date() {
		return due_date;
	}
	
	public void setDue_date(String due_date) {
		this.due_date = due_date;
	}

	public String getService_type() {
		return service_type;
	}

	public void setService_type(String service_type) {
		this.service_type = service_type;
	}

	public String getService_code() {
		return service_code;
	}

	public void setService_code(String service_code) {
		this.service_code = service_code;
	}

	public String getService_name() {
		return service_name;
	}

	public void setService_name(String service_name) {
		this.service_name = service_name;
	}

	public String getProduct_name() {
		return product_name;
	}

	public void setProduct_name(String product_name) {
		this.product_name = product_name;
	}
	
	public String getSubscribe_name() {
		return subscribe_name;
	}

	public void setSubscrive_name(String subscribe_name) {
		this.subscribe_name = subscribe_name;
	}
	
	public String getCancel_info() {
		return cancel_info;
	}

	public void setCancel_info(String cancel_info) {
		this.cancel_info = cancel_info;
	}
}