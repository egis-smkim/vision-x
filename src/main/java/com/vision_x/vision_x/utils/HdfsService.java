/**
 * 
 */
package com.vision_x.vision_x.utils;

/**
 * HdfsService.java
 * digitalTwin
 * 2021. 4. 19.
 * @author Khaia
 * @Comment
 *
 */
public interface HdfsService {
	public boolean fileCopyLocalToHadoopFileSystem(String source, String targetDirectory, String targetPath);
	
	public boolean checkHDFSExistsDirectory(String path);
	
	public boolean createHDFSDirectory(String path);
	
	public boolean deleteHDFSDirectory(String path);
}
