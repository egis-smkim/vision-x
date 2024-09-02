package com.vision_x.vision_x.model.web;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang.StringEscapeUtils;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.vision_x.vision_x.desk.mapdata.service.MapdataService;
import com.vision_x.vision_x.desk.mapdata.service.MapsDataVO;
import com.vision_x.vision_x.geoserver.service.GeoServerService;
import com.vision_x.vision_x.model.service.ModelService;

@Controller
public class ModelController {
	
	@Resource(name="mapdataService")
	private MapdataService mapdataService;
	
	@Resource(name="geoServerService")
	private GeoServerService geoServerService;
	
	@Resource(name="modelService")
	private ModelService modelService;
	
	@RequestMapping(value="/model/getProperties.do",method=RequestMethod.POST)
	public String getProperties(HttpServletRequest request, Model model) {
		
		String DATAID = request.getParameter("DATAID");
		
		HttpSession session = request.getSession(true);
		
	    HashMap<String, Object> param_data = new HashMap<>();
		
		param_data.put("dataid",DATAID);
		
		MapsDataVO mapVO = mapdataService.getMapDataInfoWithParam(param_data);

		String schema = mapVO.getShp_data_store_name().toLowerCase();
		schema = StringEscapeUtils.escapeSql(schema);
		
		String tbl_name = mapVO.getShp_table_name();
		tbl_name = StringEscapeUtils.escapeSql(tbl_name);
		
		mapVO.setRecord_size(0);
		mapVO.setShp_table_name(tbl_name);
		mapVO.setShp_data_store_name(schema);
		
		List<HashMap<String, String>> headers = modelService.getHeaderLists(mapVO);
		
		List<HashMap<String, Object>> list = modelService.getInitLists(mapVO);
		List<String> filterHeader = new ArrayList<>();
		
		for(int i=0;i<headers.size();i++) {
			
			HashMap<String, String> header = headers.get(i);
			
			String headerNm = header.get("column_name");
			
			filterHeader.add(headerNm);	
			
		}
		
		for(int j=0;j<list.size();j++) {
			
			HashMap<String, Object> record = list.get(j);
			
			record.remove("geom");
			/*record.remove("pos_x");
			record.remove("pos_y");
			record.remove("pos_z");*/
			
			record.remove("scale_x");
			record.remove("scale_y");
			record.remove("scale_z");
			
			record.remove("dir_x");
			record.remove("dir_y");
			record.remove("dir_z");
			
		} 
		
		filterHeader.remove("geom");
		filterHeader.remove("pos_x");
		filterHeader.remove("pos_y");
		filterHeader.remove("pos_z");
		filterHeader.remove("scale_x");
		filterHeader.remove("scale_y");
		filterHeader.remove("scale_z");
		filterHeader.remove("dir_x");
		filterHeader.remove("dir_y");
		filterHeader.remove("dir_z");
	
		model.addAttribute("HEADER", filterHeader);
		model.addAttribute("LIST", list);
		model.addAttribute("LAYER_NAME", mapVO.getData_name());
		
		return "jsonView";
	}
	
	@RequestMapping(value="/model/delete3dsObj.do",method=RequestMethod.POST)
	public String delete3dsObj(HttpServletRequest request, Model model) {
		
		String DATAID = request.getParameter("dataId");
		String key = request.getParameter("key");
		
		HttpSession session = request.getSession(true);
		
	    HashMap<String, Object> param_data = new HashMap<>();
		
		param_data.put("dataid",DATAID);
		
		MapsDataVO mapVO = mapdataService.getMapDataInfoWithParam(param_data);
		String schema = mapVO.getShp_data_store_name().toLowerCase();
		schema = StringEscapeUtils.escapeSql(schema);
		
		String table = mapVO.getShp_table_name().toLowerCase();
		table = StringEscapeUtils.escapeSql(table);
		
		HashMap<String, String> param = new HashMap<>();
		param.put("schema", schema);
		param.put("table",table);
		param.put("gid",key);

		int rs = modelService.delete3dsObjRecord(param);
		
		String result="fail";
		
		if(rs != 0 ) {
			result="complete";
		}
		
		model.addAttribute("RS", result);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/model/getModelPropsMore.do",method=RequestMethod.POST)
	public String getShpPropsMore(Model model, HttpServletRequest request) {
		
		String dataId=request.getParameter("dataId");
		
		HttpSession session = request.getSession(true);
		
	    HashMap<String, Object> param_data = new HashMap<>();
		
		param_data.put("dataid",dataId);
		
		MapsDataVO mapVO = mapdataService.getMapDataInfoWithParam(param_data);
		
		String pageNum = request.getParameter("pageNum");
		String dbSchema = mapVO.getShp_data_store_name().toLowerCase();
		dbSchema = StringEscapeUtils.escapeSql(dbSchema);
		
		String tbl_name = mapVO.getShp_table_name();
		tbl_name = StringEscapeUtils.escapeSql(tbl_name);
		
		mapVO.setShp_table_name(tbl_name);
		mapVO.setRecord_size(Integer.parseInt(pageNum));
		mapVO.setShp_data_store_name(dbSchema);
		
		List<HashMap<String, Object>> list = modelService.getInitLists(mapVO);
		
		List<HashMap<String, String>> headers =modelService.getHeaderLists(mapVO);
		
		List<String> filterHeader = new ArrayList<>();
		
		for(int i=0;i<headers.size();i++) {
			
			HashMap<String, String> header = headers.get(i);
			
			String headerNm = header.get("column_name");
			
			filterHeader.add(headerNm);	
			
		}
		
		for(int j=0;j<list.size();j++) {
			
			HashMap<String, Object> record = list.get(j);
			
			record.remove("geom");
			/*record.remove("pos_x");
			record.remove("pos_y");
			record.remove("pos_z");*/
			
			record.remove("scale_x");
			record.remove("scale_y");
			record.remove("scale_z");
			
			record.remove("dir_x");
			record.remove("dir_y");
			record.remove("dir_z");
			
		} 
		
		filterHeader.remove("geom");
		filterHeader.remove("pos_x");
		filterHeader.remove("pos_y");
		filterHeader.remove("pos_z");
		filterHeader.remove("scale_x");
		filterHeader.remove("scale_y");
		filterHeader.remove("scale_z");
		filterHeader.remove("dir_x");
		filterHeader.remove("dir_y");
		filterHeader.remove("dir_z");
		
		int status=0;
		if(list.size()==0) {
			status=1;
		}
		
		model.addAttribute("HEADER", filterHeader);
		model.addAttribute("STATUS", status);
		model.addAttribute("PROPERTY", list);
		
		return "jsonView";
	}
	
}
