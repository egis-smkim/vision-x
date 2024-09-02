/**
 * 
 */
package com.vision_x.vision_x.file.service.impl;

import java.sql.SQLException;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.vision_x.vision_x.file.service.FileVO;

import egovframework.rte.psl.dataaccess.EgovAbstractMapper;

/**
 * FileDAO.java
 * digitaltwincloud
 * 2021. 6. 17.
 * @author Khaia
 * @Comment MEMBER_FILES tbl
 *
 */
@Repository("fileDAO")
public class FileDAO  extends EgovAbstractMapper {                        
	
	public FileVO getFileDataFromDataId(int dataid) {
		return selectOne("fileDAO.getFileDataFromDataId", dataid);
	}
	
	public List<FileVO> getFileListForDataId(int dataid) throws SQLException {
		return selectList("fileDAO.getFileListForDataId", dataid);
	}
	
	public int deleteFileRecord(FileVO fileVO) throws SQLException {
		return delete("fileDAO.deleteFileRecord", fileVO);
	}
}