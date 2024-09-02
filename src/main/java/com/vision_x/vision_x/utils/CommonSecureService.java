/**
 * 
 */
package com.vision_x.vision_x.utils;

/**
 * CommonSecureService.java
 * digitaltwincloud
 * 2022. 4. 5.
 * @author Khaia
 * @Comment
 *
 */
public interface CommonSecureService {
	public String ParameterSafeNullChecker(String p);
	
	public String SecureParameterChecker(String p);
	
	public String MaskString(String strText, int start, int end, char maskChar);
}
