/**
 * 
 */
package com.vision_x.vision_x.admin.service;

import java.sql.SQLException;
import java.util.List;

/**
 * SiteSetupService.java
 * digitaltwincloud
 * 2021. 8. 10.
 * @author Khaia
 * @Comment
 *
 */
public interface DomainSetupService {
	public List<DomainSetupVO> selectDomainList() throws SQLException;
	
	public int insertDomainSetup(DomainSetupVO domainSetupVO) throws SQLException;
	
	public int updateDomainSetupFiles(DomainSetupVO domainSetupVO) throws SQLException;
	
	public int deleteDomainSetup(int dsid) throws SQLException;
	
	public DomainSetupVO selectDomainSetupItem(int dsid) throws SQLException;
	
	public int deleteLogoImageUrl(DomainSetupVO domainSetupVO) throws SQLException;
	
	public int updateDomainSetupItem(DomainSetupVO domainSetupVO) throws SQLException;
}
