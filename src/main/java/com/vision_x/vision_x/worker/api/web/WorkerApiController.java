package com.vision_x.vision_x.worker.api.web;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringEscapeUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.vision_x.vision_x.desk.mapdata.service.MapsDataVO;
import com.vision_x.vision_x.member.service.MemberVO;
import com.vision_x.vision_x.worker.service.ConvertWorkerItemVO;
import com.vision_x.vision_x.worker.service.ProgressWorkerService;
import com.vision_x.vision_x.worker.service.ProgressWorkerVO;
import com.vision_x.vision_x.worker.service.WorkerApiService;
import com.vision_x.vision_x.worker.service.WorkerCSVItemVO;

@Controller
public class WorkerApiController {
	
	protected Logger logger = LoggerFactory.getLogger(this.getClass());
	
	@Resource(name="workerApiService")
	private WorkerApiService workerApiService;
	
	//DTConverWorker start
	@RequestMapping(value="/worker/list.do",method=RequestMethod.GET)
	public String getWorkerList(HttpServletRequest request,Model model) {
		String type = request.getParameter("type");
		List<String> dataTypes = new ArrayList<>();
		if(type != null) {
			if(type.equals("s")) {
				//singleworker list
				dataTypes.add("P");
				dataTypes.add("LD");
				dataTypes.add("Z3");
				dataTypes.add("B");
				
			}else {
				//hadoop list
				dataTypes.add("T");
				dataTypes.add("I");
			}
			
			List<ConvertWorkerItemVO> list = workerApiService.getWaitConvertItems(dataTypes);
			
			int status = 404;
			
			if(list.size() !=0  && list !=null) {
				status=200;
			}
			
			model.addAttribute("status", status);
			model.addAttribute("list", list);
		}
			
		return "jsonView";
	}
	
	@RequestMapping(value="/worker/excuteCnt.do",method=RequestMethod.GET)
	public String getConvertExecutingCount(HttpServletRequest request,Model model) {
		
		HashMap<String, Integer> cwivo = workerApiService.getConvertExecutingCount();
		
		int status =404;
		if(cwivo != null) {
			status = 200;
		}
		
		model.addAttribute("status", status);
		model.addAttribute("obj", cwivo);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/worker/update.do",method=RequestMethod.POST)
	public String updateWorkerStatus(HttpServletRequest request,Model model) {
		
		int cwid =Integer.parseInt( request.getParameter("cwid"));
		String sts = request.getParameter("sts");
		
		ConvertWorkerItemVO cwivo = new ConvertWorkerItemVO();
		cwivo.setCwid(cwid);
		cwivo.setStatus(sts);
		
		int rs = workerApiService.updateWorkerStatus(cwivo);
		
		int status = 404;
		if(rs != 0) {
			status=200;
		}
		
		model.addAttribute("result", status);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/worker/getMemId.do",method=RequestMethod.POST)
	public String getWorkerItemOwnerId(HttpServletRequest request,Model model) {
		
		int mid = Integer.parseInt(request.getParameter("mid"));
		int did = Integer.parseInt(request.getParameter("did"));
		
		MemberVO mvo = new MemberVO();
		mvo.setMid(mid);
		mvo.setDlid(did);
		
		mvo = workerApiService.getWorkerItemOwnerId(mvo);
		
		String memId =mvo.getMem_id();
		
		int status =404;
		if(memId != null) {
			status =200;
		}
		
		model.addAttribute("status", status);
		model.addAttribute("mem_id", memId);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/worker/updateMapsStatus.do",method=RequestMethod.POST)
	public String updateMapsStatus(HttpServletRequest request,Model model) {
		
		int dataid = Integer.parseInt(request.getParameter("dataid"));
		int sts = Integer.parseInt(request.getParameter("sts"));
		int did = Integer.parseInt(request.getParameter("did"));
		
		MapsDataVO mvo = new MapsDataVO();
		mvo.setDataid(dataid);
		mvo.setState(sts);
		
		int rs = workerApiService.updateMapsStatus(mvo);
		
		int status =404;
		if(rs != 0) {
			status=200;
		}
		
		model.addAttribute("result", status);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/worker/getMapsDataItem.do",method=RequestMethod.POST)
	public String getMapsDataItem(HttpServletRequest request,Model model) {
		
		int dataid = Integer.parseInt(request.getParameter("dataid"));
		int did = Integer.parseInt(request.getParameter("did"));
		
		MapsDataVO mvo = new MapsDataVO();
		mvo.setDataid(dataid);

		mvo = workerApiService.getMapsDataItem(mvo);
		
		int status= 404;
		
		if(mvo != null) {
			status=200;
		}
		
		model.addAttribute("status", status);
		model.addAttribute("obj", mvo);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/worker/executeStatusTime.do",method=RequestMethod.POST)
	public String updateExecuteStatusTime(HttpServletRequest request,Model model) {
		
		int cwid = Integer.parseInt(request.getParameter("cwid"));
		int sts = Integer.parseInt(request.getParameter("sts"));
		
		HashMap<String, String> params = new HashMap<>();
		params.put("cwid",String.valueOf(cwid));
		
		String column = "";
		
		switch(sts) {
			case 2:
				column = "SPLIT_START_DATE";
			break;
			
			case 3:
				column = "SPLIT_END_DATE";
			break;
			
			case 4:
				column = "CONVERT_START_DATE";
			break;
			
			case 5:
				column = "CONVERT_END_DATE";
			break;
			
			case 6:
				column = "EXTRACT_START_DATE";
			break;
			
			case 7:
				column = "EXTRACT_END_DATE";
			break;
			
			case 8:
				column = "COPY_START_DATE";
			break;
			
			case 9:
				column = "COPY_END_DATE";
			break;
			
			case 11:
				column = "START_DATE";
			break;
			
			case 12:
				column = "END_DATE";
			break;
		}
		
		String escapeColumn = StringEscapeUtils.escapeSql(column);
		params.put("column",escapeColumn);
		
		int rs = workerApiService.updateExecuteStatusTime(params);
		
		int status =404;
		
		if(rs != 0) {
			status =200;
		}
		
		model.addAttribute("result", status);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/worker/updateWorkerItemStatus.do",method=RequestMethod.POST)
	public String updateWorkerItemStatus(HttpServletRequest request,Model model) {
		int cwid = Integer.parseInt(request.getParameter("cwid"));
		String state = request.getParameter("state");
		
		ConvertWorkerItemVO cwvo = new ConvertWorkerItemVO();
		cwvo.setCwid(cwid);
		cwvo.setStatus(state);
		
		int rs = workerApiService.updateWorkerItemStatus(cwvo);
		int status = 404;
		if(rs != 0) {
			status = 200;
		}
		
		model.addAttribute("status", status);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/worker/updateMapsDataStatus.do",method=RequestMethod.POST)
	public String updateMapsDataStatus(HttpServletRequest request,Model model) {
		
		int dataid= Integer.parseInt(request.getParameter("dataid"));
		int state = Integer.parseInt(request.getParameter("state"));
		int did = Integer.parseInt(request.getParameter("did"));
		
		MapsDataVO mvo = new MapsDataVO();
		mvo.setDataid(dataid);
		mvo.setState(state);
		
		int rs = workerApiService.updateMapsDataStatus(mvo);
		
		int status =404;
		if(rs != 0) {
			status =200;
		}
		
		model.addAttribute("status", status);
		
		return "jsonView";
	}
	//DTConverWorker end
	
	//DTCopierWorker start
	@RequestMapping(value="/worker/copier/list.do",method=RequestMethod.GET)
	public String getCopierList(HttpServletRequest request,Model model) {
		
		List<ConvertWorkerItemVO> list = workerApiService.getWaitConvertItemsCopier();
		
		int status = 404;
		
		if(list.size() !=0  && list !=null) {
			status=200;
		}
		
		model.addAttribute("status", status);
		model.addAttribute("list", list);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/worker/zip/updateProgess.do",method=RequestMethod.POST)
	public String updateProgess(HttpServletRequest request,Model model) {
		
		String percent = request.getParameter("progress");
		String status = request.getParameter("status");
		String pid = request.getParameter("pid");
		
		ProgressWorkerVO pvo = new ProgressWorkerVO();
		pvo.setProgress(percent);
		pvo.setStatus(status);
		pvo.setPid(Integer.parseInt(pid));
		
		int rs = workerApiService.updateProgressVO(pvo);
		
		int statusCode =404;
	
		if(rs != 0) {
			statusCode =200;
		}
		
		model.addAttribute("status", statusCode);
		
		return "jsonView";
	}
	//DTCopierWorker end
	@RequestMapping(value="/worker/csv/list.do",method=RequestMethod.GET)
	public String getCsvWorkerList(HttpServletRequest request,Model model) {
		
		List<WorkerCSVItemVO> list = workerApiService.getCsvItemList();
		int status = 404;
		
		if(list != null && list.size() != 0) {
			status=200;
		}
		
		model.addAttribute("status", status);
		model.addAttribute("list", list);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/worker/csv/updateWorkerItemStatus.do",method=RequestMethod.POST)
	public String updateCsvWorkerStatus(HttpServletRequest request,Model model) {
		
		int wcid = Integer.parseInt(request.getParameter("wcid"));
		String status = request.getParameter("status");
		
		HashMap<String, Object> param = new HashMap<>();
		param.put("wcid",wcid);
		param.put("status",status);
		
		int rs = workerApiService.updateCsvStatus(param);
		int statusCode = 404;
		
		if(rs != 0) {
			statusCode=200;
		}
		
		model.addAttribute("status", statusCode);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/worker/csv/updateExceuteStartTime.do",method=RequestMethod.POST)
	public String updateCsvItemStatus(HttpServletRequest request,Model model) {
		
		int wcid = Integer.parseInt(request.getParameter("wcid"));
		
		int rs = workerApiService.updateExceuteStartTime(wcid);
		
		int statusCode = 404;
		
		if(rs != 0) {
			statusCode=200;
		}
		
		model.addAttribute("status", statusCode);
		
		return "jsonView";
	}

	@RequestMapping(value="/worker/csv/updateExecuteEndTime.do",method=RequestMethod.POST)
	public String updateExecuteEndTime(HttpServletRequest request,Model model) {
		
		int wcid = Integer.parseInt(request.getParameter("wcid"));
		
		int rs = workerApiService.updateExecuteEndTime(wcid);
		
		int statusCode = 404;
		
		if(rs != 0) {
			statusCode=200;
		}
		
		model.addAttribute("status", statusCode);
		
		return "jsonView";
	}
}
