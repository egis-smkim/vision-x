/**
 * 
 */
package com.vision_x.vision_x.admin.service;

import java.sql.SQLException;
import java.util.List;
import com.vision_x.vision_x.member.service.MemberVO;


/**
 * BackupSettingService.java
 * digitaltwincloud
 * 2021. 12. 8.
 * @author Khaia
 * @Comment
 *
 */

public interface BackupSettingService {
	public List<MemberVO> searchMemberByName(MemberVO memberVO);
	
	public List<MemberVO> searchMemberById(MemberVO memberVO);
	
	public BackupSettingVO selectMemberBackupSetting(BackupSettingVO backupSettingVO);
	
	public int insertMemberBackupSetting(BackupSettingVO backupSettingVO);
	
	public List<BackupSettingVO> selectMemberBackupSettingList() throws SQLException;
	
	public BackupSettingVO selectMemberBackupSettingByBid(BackupSettingVO backupSettingVO);
	
	public int deleteMemberBackupSetting(BackupSettingVO backupSettingVO);
	
	public int updateMemberBackupSetting(BackupSettingVO backupSettingVO);
}
