/**
 * 
 */
package com.vision_x.vision_x.desk.developer.service;

/**
 * AppDeveloperService.java
 * digitaltwincloud
 * 2021. 12. 28.
 * @author Khaia
 * @Comment
 *
 */
public interface AppDeveloperService {
	public AppDeveloperVO getDeveloperInfo(int mid);

	public int createDeveloper(AppDeveloperVO appDeveloperVO);
	
	public int updateDeveloper(AppDeveloperVO appDeveloperVO);
}