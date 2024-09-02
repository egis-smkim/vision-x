/**
 * 
 */
package com.vision_x.vision_x.worker.service;

/**
 * ConvertWorkerVO.java
 * digitalTwin
 * 2021. 4. 13.
 * @author Khaia
 * @Comment
 *
 */
public class ConvertWorkerItemVO {
	private int cwid;
	private int mid;
	private int dataid;
	
	private String data_name;
	private String data_type;
	private String target_file_path;
	
	private String extract_path;
	private String extract_ext;
	
	private String split_out_path;
	private String split_out_txt_path;
	private String convert_out_path;
	private String progress_path;
	private String progress_url;
	
	private String coord_type;
	
	private String status;
	
	private String is_confirmed;
	
	private String split_start_date;
	private String split_end_date;
	
	private String convert_start_date;
	private String convert_end_date;
	
	private String extract_start_date;
	private String extract_end_date;
	
	private String nfs_out_path;
	
	private String copy_start_date;
	private String copy_end_date;
	
	private String start_date;
	private String complete_date;
	private String cancel_date;
	
	private String error_date;
	private String reg_date;
	
	private String jobid_path;
	
	private String split_progress_path;
	private String epsg_code;
	private int progress_id;
	private int point_intense;
	
	private String mlid;
	private String mltx;
	private String model_dir;
	private String shpfileName;
	private String dbfFileName;
	private String target_shp_path;
	private String target_3ds_path;
	private String compress;
	private String error_message;
	private String end_date;
	private String bg_color;
	
	private int dsid;
	private int point_reverse;
	
	public int getDsid() {
		return dsid;
	}
	public void setDsid(int dsid) {
		this.dsid = dsid;
	}
	@Override
	public String toString() {
		return "ConvertWorkerItemVO [cwid=" + cwid + ", mid=" + mid + ", dataid=" + dataid
				+ ", data_name=" + data_name + ", data_type=" + data_type + ", target_file_path=" + target_file_path
				+ ", extract_path=" + extract_path + ", extract_ext=" + extract_ext + ", split_out_path="
				+ split_out_path + ", split_out_txt_path=" + split_out_txt_path + ", convert_out_path="
				+ convert_out_path + ", progress_path=" + progress_path + ", progress_url=" + progress_url
				+ ", coord_type=" + coord_type + ", status=" + status + ", is_confirmed=" + is_confirmed
				+ ", split_start_date=" + split_start_date + ", split_end_date=" + split_end_date
				+ ", convert_start_date=" + convert_start_date + ", convert_end_date=" + convert_end_date
				+ ", extract_start_date=" + extract_start_date + ", extract_end_date=" + extract_end_date
				+ ", nfs_out_path=" + nfs_out_path + ", copy_start_date=" + copy_start_date + ", copy_end_date="
				+ copy_end_date + ", start_date=" + start_date + ", complete_date=" + complete_date + ", cancel_date="
				+ cancel_date + ", error_date=" + error_date + ", reg_date=" + reg_date + ", jobid_path=" + jobid_path
				+ ", split_progress_path=" + split_progress_path + ", epsg_code=" + epsg_code + ", progress_id="
				+ progress_id + ", point_intense=" + point_intense + ", mlid=" + mlid + ", mltx=" + mltx
				+ ", model_dir=" + model_dir + ", shpfileName=" + shpfileName + ", dbfFileName=" + dbfFileName
				+ ", target_shp_path=" + target_shp_path + ", target_3ds_path=" + target_3ds_path + ", compress="
				+ compress + ", error_message=" + error_message + ", end_date="
				+ end_date + "]";
	}
	public String getSplit_progress_path() {
		return split_progress_path;
	}
	public void setSplit_progress_path(String split_progress_path) {
		this.split_progress_path = split_progress_path;
	}
	public String getJobid_path() {
		return jobid_path;
	}
	public void setJobid_path(String jobid_path) {
		this.jobid_path = jobid_path;
	}
	public String getCopy_start_date() {
		return copy_start_date;
	}
	public void setCopy_start_date(String copy_start_date) {
		this.copy_start_date = copy_start_date;
	}
	public String getCopy_end_date() {
		return copy_end_date;
	}
	public void setCopy_end_date(String copy_end_date) {
		this.copy_end_date = copy_end_date;
	}
	public String getNfs_out_path() {
		return nfs_out_path;
	}
	public void setNfs_out_path(String nfs_out_path) {
		this.nfs_out_path = nfs_out_path;
	}
	public String getSplit_out_txt_path() {
		return split_out_txt_path;
	}
	public void setSplit_out_txt_path(String split_out_txt_path) {
		this.split_out_txt_path = split_out_txt_path;
	}
	public String getConvert_out_path() {
		return convert_out_path;
	}
	public void setConvert_out_path(String convert_out_path) {
		this.convert_out_path = convert_out_path;
	}
	public String getSplit_out_path() {
		return split_out_path;
	}
	public void setSplit_out_path(String split_out_path) {
		this.split_out_path = split_out_path;
	}
	public int getCwid() {
		return cwid;
	}
	public void setCwid(int cwid) {
		this.cwid = cwid;
	}
	public int getMid() {
		return mid;
	}
	public void setMid(int mid) {
		this.mid = mid;
	}
	public int getDataid() {
		return dataid;
	}
	public void setDataid(int dataid) {
		this.dataid = dataid;
	}
	public String getData_name() {
		return data_name;
	}
	public void setData_name(String data_name) {
		this.data_name = data_name;
	}
	public String getData_type() {
		return data_type;
	}
	public void setData_type(String data_type) {
		this.data_type = data_type;
	}
	public String getTarget_file_path() {
		return target_file_path;
	}
	public void setTarget_file_path(String target_file_path) {
		this.target_file_path = target_file_path;
	}
	public String getExtract_path() {
		return extract_path;
	}
	public void setExtract_path(String extract_path) {
		this.extract_path = extract_path;
	}
	public String getExtract_ext() {
		return extract_ext;
	}
	public void setExtract_ext(String extract_ext) {
		this.extract_ext = extract_ext;
	}

	public String getProgress_path() {
		return progress_path;
	}
	public void setProgress_path(String progress_path) {
		this.progress_path = progress_path;
	}
	public String getCoord_type() {
		return coord_type;
	}
	public void setCoord_type(String coord_type) {
		this.coord_type = coord_type;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getIs_confirmed() {
		return is_confirmed;
	}
	public void setIs_confirmed(String is_confirmed) {
		this.is_confirmed = is_confirmed;
	}
	public String getSplit_start_date() {
		return split_start_date;
	}
	public void setSplit_start_date(String split_start_date) {
		this.split_start_date = split_start_date;
	}
	public String getSplit_end_date() {
		return split_end_date;
	}
	public void setSplit_end_date(String split_end_date) {
		this.split_end_date = split_end_date;
	}
	public String getConvert_start_date() {
		return convert_start_date;
	}
	public void setConvert_start_date(String convert_start_date) {
		this.convert_start_date = convert_start_date;
	}
	public String getConvert_end_date() {
		return convert_end_date;
	}
	public void setConvert_end_date(String convert_end_date) {
		this.convert_end_date = convert_end_date;
	}
	public String getExtract_start_date() {
		return extract_start_date;
	}
	public void setExtract_start_date(String extract_start_date) {
		this.extract_start_date = extract_start_date;
	}
	public String getExtract_end_date() {
		return extract_end_date;
	}
	public void setExtract_end_date(String extract_end_date) {
		this.extract_end_date = extract_end_date;
	}
	public String getStart_date() {
		return start_date;
	}
	public void setStart_date(String start_date) {
		this.start_date = start_date;
	}
	public String getComplete_date() {
		return complete_date;
	}
	public void setComplete_date(String complete_date) {
		this.complete_date = complete_date;
	}
	public String getCancel_date() {
		return cancel_date;
	}
	public void setCancel_date(String cancel_date) {
		this.cancel_date = cancel_date;
	}
	public String getError_date() {
		return error_date;
	}
	public void setError_date(String error_date) {
		this.error_date = error_date;
	}
	public String getReg_date() {
		return reg_date;
	}
	public void setReg_date(String reg_date) {
		this.reg_date = reg_date;
	}
	public String getProgress_url() {
		return progress_url;
	}
	public void setProgress_url(String progress_url) {
		this.progress_url = progress_url;
	}
	public int getProgress_id() {
		return progress_id;
	}
	public void setProgress_id(int progress_id) {
		this.progress_id = progress_id;
	}
	public String getEpsg_code() {
		return epsg_code;
	}
	public void setEpsg_code(String epsg_code) {
		this.epsg_code = epsg_code;
	}
	public String getMlid() {
		return mlid;
	}
	public void setMlid(String mlid) {
		this.mlid = mlid;
	}
	public String getMltx() {
		return mltx;
	}
	public void setMltx(String mltx) {
		this.mltx = mltx;
	}
	public String getModel_dir() {
		return model_dir;
	}
	public void setModel_dir(String model_dir) {
		this.model_dir = model_dir;
	}
	public String getShpfileName() {
		return shpfileName;
	}
	public void setShpfileName(String shpfileName) {
		this.shpfileName = shpfileName;
	}
	public String getDbfFileName() {
		return dbfFileName;
	}
	public void setDbfFileName(String dbfFileName) {
		this.dbfFileName = dbfFileName;
	}
	public String getTarget_shp_path() {
		return target_shp_path;
	}
	public void setTarget_shp_path(String target_shp_path) {
		this.target_shp_path = target_shp_path;
	}
	public String getTarget_3ds_path() {
		return target_3ds_path;
	}
	public void setTarget_3ds_path(String target_3ds_path) {
		this.target_3ds_path = target_3ds_path;
	}
	public int getPoint_intense() {
		return point_intense;
	}
	public void setPoint_intense(int point_intense) {
		this.point_intense = point_intense;
	}
	public String getCompress() {
		return compress;
	}
	public void setCompress(String compress) {
		this.compress = compress;
	}
	public String getError_message() {
		return error_message;
	}
	public void setError_message(String error_message) {
		this.error_message = error_message;
	}
	public String getEnd_date() {
		return end_date;
	}
	public void setEnd_date(String end_date) {
		this.end_date = end_date;
	}
	public String getBg_color() {
		return bg_color;
	}
	public void setBg_color(String bg_color) {
		this.bg_color = bg_color;
	}
	public int getPoint_reverse() {
		return point_reverse;
	}
	public void setPoint_reverse(int point_reverse) {
		this.point_reverse = point_reverse;
	}
	
}
