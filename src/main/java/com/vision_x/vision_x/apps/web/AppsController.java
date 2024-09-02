/**
 * 
 */
package com.vision_x.vision_x.apps.web;

import java.io.IOException;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.vision_x.vision_x.apps.service.AppsService;
import com.vision_x.vision_x.apps.service.BuildingModelVO;
import com.vision_x.vision_x.desk.developer.service.ModuleService;
import com.vision_x.vision_x.desk.developer.service.ModuleVO;
import com.vision_x.vision_x.desk.developer.service.ProductService;
import com.vision_x.vision_x.desk.developer.service.ProductVO;
import com.vision_x.vision_x.desk.service.MemberProductService;
import com.vision_x.vision_x.desk.service.MemberProductVO;
import com.vision_x.vision_x.utils.SessionVO;

/**
 * AppsController.java
 * digitaltwincloud
 * 2021. 6. 24.
 * @author Khaia
 * @Comment
 *
 */
@Controller
public class AppsController {
	
	protected Logger logger = LoggerFactory.getLogger(this.getClass());
	
	@Resource(name="memberProductService")
	private MemberProductService memberProductService;
	
	@Resource(name="productService")
	private ProductService productService;
	
	@Resource(name="moduleService")
	private ModuleService moduleService;
	
	@Resource(name="appsService")
	private AppsService appsService;

	
	@RequestMapping(value="/desk/apps/manageAppsData.do", method=RequestMethod.GET)
	public String manageAppData(Model model, HttpServletRequest request, @RequestParam(value="mpid", required=true) String mpid) {
		
		String apps = "none";
		
		try {
			
			HttpSession session = request.getSession(true);
			
			SessionVO sessionVO = new SessionVO();
			sessionVO = (SessionVO) session.getAttribute("sessionUserInfo");
			
			model.addAttribute("MID", sessionVO.getSessMid());
			model.addAttribute("ENMID", sessionVO.getSessEncryMid());
			model.addAttribute("MEM_ID", sessionVO.getSessMemId());
			model.addAttribute("MEM_LEVEL", sessionVO.getSessMemLevel());
			
			MemberProductVO memberProductVO = new MemberProductVO();
			memberProductVO.setMid(sessionVO.getSessMid());
			memberProductVO.setMpid(Integer.parseInt(mpid));
			
			int cnt = memberProductService.getMemberProductOwnerCountForMpid(memberProductVO);
			
			logger.info("cnt:"+cnt);
			
			if(cnt == 0) {
				return "error/error_invalid_access";
			}

			memberProductVO = memberProductService.getMemberProductItemForMpid(memberProductVO);
			ProductVO productVO = new ProductVO();
			
			productVO.setPid(memberProductVO.getPid());
			productVO = productService.selectProductItem(productVO);
			
			ModuleVO moduleVO = new ModuleVO();
			moduleVO.setMdid(productVO.getMdid());
			
			moduleVO = moduleService.selectModuleItem(moduleVO);
			
			String moduleObj = moduleVO.getModule_obj(); 
			
			switch(moduleObj) {
				case "M_WIND" :
					// 바람길 분석
					apps = "wind";
				break;
				
				case "M_SLOPE" :
					// 경사분석
					apps = "slope";
				break;
				
				case "M_EDITBUILDING" :
					// 건물편집
					apps = "editbuilding";
					
					List<BuildingModelVO> userBuildingModelList = appsService.getEditBuildingUserModelList(sessionVO.getSessMid());
					
					model.addAttribute("userBuildingModelList", userBuildingModelList);
					
					
					
				break;
				
				default :
					apps = "none";
				break;
			}
			
			model.addAttribute("app_name", moduleVO.getName());
			
		}
		catch (RuntimeException e) {
			logger.error("SELECT ERROR-RuntimeException");
		}
		catch (Exception e) {
			logger.error("SELECT ERROR");
		}
		
		return "desk/apps/manageAppsData_"+apps;
	}
}
