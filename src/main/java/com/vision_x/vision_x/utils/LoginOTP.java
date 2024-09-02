package com.vision_x.vision_x.utils;

import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Date;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;



public class LoginOTP {

	public LoginOTP(String timeout,String algorithm,String secretkey){
		this.DISTANCE = Long.parseLong(timeout);
		this.ALGORITHM = algorithm;
		this.SECRET_KEY= secretkey.getBytes();
	}
	
	private long DISTANCE;//Long.parseLong(timeout);
	private String ALGORITHM;
	private byte[] SECRET_KEY;//secretky.getBytes();
	
	
	/**
	 * OTP 문자 생성
	 * @return 5자리 숫자 문자열
	 * @throws InvalidKeyException
	 * @throws NoSuchAlgorithmException
	 */
	public String create() throws InvalidKeyException, NoSuchAlgorithmException {
		return String.format("%05d", create(new Date().getTime() / DISTANCE)); 
	}
	
	/**
	 * OTP 검증 메소드 
	 * @param code
	 * @return boolean 
	 * @throws InvalidKeyException
	 * @throws NoSuchAlgorithmException
	 */
	public boolean verify(String code) throws InvalidKeyException, NoSuchAlgorithmException {
		return create().equals(code);
	}

	/**
	 * 비밀키와 시간에 따라 Hash 처리하여 패스워드를 생성하는 메소드
	 * 
	 * @param time
	 * @return
	 * @throws InvalidKeyException
	 * @throws NoSuchAlgorithmException
	 */
	private long create(long time) throws InvalidKeyException, NoSuchAlgorithmException {
		byte[] data = new byte[8];

		long value = time;
		for (int i = 8; i-- > 0; value >>>= 8) {
			data[i] = (byte) value;
		}

		Mac mac = Mac.getInstance(ALGORITHM);
		mac.init(new SecretKeySpec(SECRET_KEY, ALGORITHM));

		byte[] hash = mac.doFinal(data);
		int offset = hash[20 - 1] & 0xF;

		long truncatedHash = 0;
		for (int i = 0; i < 4; ++i) {
			truncatedHash <<= 8;
			truncatedHash |= hash[offset + i] & 0xFF;
		}

		truncatedHash &= 0x7FFFFFFF;
		truncatedHash %= 1000000;

		return truncatedHash;
	}
}
