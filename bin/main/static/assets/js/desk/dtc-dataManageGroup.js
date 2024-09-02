/**
 * 
 */

var MNGGROUP={
	tree:null,
	to_hide:[],
	init:function(){
		var data ={
			mid : D_MEMBER.MID
		}

		$.ajax({
			url:'/desk/manage/getLayerTreeinfo.do',
			type:'POST',
			data:data,
			dataType:'json',
			success:function(result){
				//console.log(result);

				var data={};
				
				if(result.STATUS==200){
					data.default='N';
					data.user = result.DATA;
				}else{
					data.default='Y';
				}
				
				if(MNGGROUP.tree == null){
					MNGGROUP.callGroupLayer(data);
				}
				
			}
		})
	},
	callGroupLayer:function(data){
		
		var layerArr=[];
		
		if(data.default != 'Y' && typeof data.user !='undefined'){
				layerArr=data.user;
		}else{
			var defaultJson = { "id" : "root-layer", "parent" : "#", "text" : "기본 레이어",type:'default',a_attr:'no_checkbox',li_attr:{class:'no_checkbox'} };
			layerArr.push(defaultJson);
		}

		MNGGROUP.tree = $("#layerGroupTree").jstree({
			core:{
				data:layerArr,
				themes:{name:'default-dark'},
				check_callback:true
			},
			checkbox:{
				tree_state:false,
				keep_selected_style:false,
				tie_selection:false,
				whole_node:false
			},
			contextmenu:{
				items:function($node){
					var id = $node.id;
					var type = $node.type;

					var addObj = {
						separator_before:false,
						separator_after:false,
						label:'그룹 추가',
						icon:'fas fa-folder-plus',
						action:function(obj){
							//default type만 생성하기
							if(id.includes("meta_asset_")){
								parent_id=$node.parent;
								
								var children_node = {
									parent : parent_id, 
									text : "레이어 그룹",
									type:'default',
									state:{
										opened:true
									} 
								}

								//var rootNode = $("#layerGroupTree").jstree().get_node('root-layer');
								var rootNode = $("#layerGroupTree").jstree().get_node(parent_id);

								$("#layerGroupTree").jstree().create_node(rootNode,children_node,"last",function(node){
									$("#layerGroupTree").jstree('open_all');
									$("#layerGroupTree").jstree(true).edit(node);
								});

							}else{
								
								var folderNode={
									text:'레이어 그룹',
									type:"default",
									parent:id,
									state:{
										opened:true
									},
									a_attr:{
										class:'no_checkbox'
									}
								}
								
								$node = $("#layerGroupTree").jstree(true).create_node($node,folderNode,'last',function(node){

									$("#layerGroupTree").jstree(true).edit(node);
									
								});
								

							}
						}
					}

					var remove ={
						separator_before:false,
						separator_after:false,
						label:'삭제',
						icon:'far fa-trash-alt',
						action:function(obj){
		
							//$node = $("#layerGroupTree").jstree(true).create_node($node);
							$("#layerGroupTree").jstree(true).delete_node($node);
						}
					};

					var rename = {
						separator_before:false,
						separator_after:false,
						icon:'far fa-edit',
						label:'이름 변경',
						action:function(obj){
							$("#layerGroupTree").jstree(true).edit($node);
						}
					};
				
					var eventObj = {
						
					};

					if(id != 'root-layer'){
						
						if(type =='default'){
							eventObj.add=addObj;
							eventObj.rename=rename;
						}

						eventObj.remove=remove;
						
					}else{
						eventObj.add=addObj;
						eventObj.rename=rename;
					}
					
					return eventObj;
				}
			},
			dnd:{

			},
			types:{
				default:{
					
				},
				S:{
					icon:'far fa-square',
					valid_children:['default']
				},
				I:{
					icon:'fas fa-images',
					valid_children:['default']
				},
				T:{
					icon:'fas fa-mountain',
					valid_children:['default']
				},
				C:{
					icon:'fas fa-file-csv',
					valid_children:['default']
				},
				P:{
					icon:'fas fa-dot-circle',
					valid_children:['default']
				},
				G:{
					icon:'fas fa-route',
					valid_children:['default']
				},
				Z3:{
					icon:'fas fa-project-diagram',
					valid_children:['default']
				},
				LD:{
					icon:'fab fa-bandcamp',
					valid_children:['default']
				}
			},
			plugins:['contextmenu','checkbox','dnd','types','state','search']
		});
		
		MNGGROUP.tree.on("check_node.jstree uncheck_node.jstree", function(e, data) {
			MNGGROUP.checkboxEvent(data);
		});

		new PerfectScrollbar(document.getElementById('layerGroupTree'),{
			suppressScrollX:true
	   	});
	},
	addLayer:function(obj){
		 
		var rootNode = $("#layerGroupTree").jstree().get_node('root-layer');
		
		var dataName = obj.name;
		var type = obj.type;
		var dataId = obj.dataId;
	
		var data = { id : "meta_asset_"+dataId, parent : "root-layer", text : dataName,type:type,class:'layer_tree_'+dataId+'',state:{selected:true,checked:true}};
		
		var jsonArr = $("#layerGroupTree").jstree().get_json('#',{flat:true});
		
		var exists=false;
		
		for(var i=0;i<jsonArr.length;i++){
			
			var obj = jsonArr[i];
			
			if(obj.id != 'root-layer'){
				
				if(obj.id=="meta_asset_"+dataId){
					exists=true;
					break;
				}
			}

		}
		
		if(!exists){
			$("#layerGroupTree").jstree().create_node(rootNode,data,"last",function(node){
				$("#layerGroupTree").jstree('open_all');
			});
		}else{
			return;
		}
		
		

	},
	checkboxEvent:function(data){
		
		var layerName = data.node.id;
		var dataId =layerName.split("_")[2];
		var layerId = 'memLayer_'+dataId;
		
		var checked = data.node.state.checked;

		if(checked){
			$("#"+layerId).prop('checked',true).change();
		}else{
			$("#"+layerId).prop('checked',false).change();
		}
		/*	
		var layerName = data.node.id;
		
		var checked = data.node.state.checked;
		var type = data.node.type;

		if(type == 'default'){
			return false;
		}

		var dataId =layerName.split("_")[2];

		if(dtcLayer.global.layerList == null || typeof dtcLayer.global.layerList == 'undefined'){
			dtcLayer.global.layerList = new Module.JSLayerList(false);
		}

		if(type=='S'){

			if(checked){
				dtcLayer.global.shpLayerList.push(layerName);
			}else{
				dtcLayer.global.shpLayerList.splice(layerName,1);
			}
			
			if(dtcLayer.SHP.layerName != null){	
				var data={	
					dataId:dataId	
				}	
					
				$.ajax({	
					url:'./ide/callLayerInfo.do',	
					type:'POST',	
					data:data,	
					dataType:'json',	
					success:function(result){	
						//console.log(result);	
						if(result.INFO.data_type=="S"){	
							dtcLayer.SHP.addLayer(result);	
						}	
					}	
				})	
			}else{	
				dtcLayer.callLayerInfo(dataId);	
			}	

		}else if(type=='Z3'){

			dtcLayer.global.gsLayerList = new Module.JSLayerList(true);

			if(dtcLayer.global.gsLayerList.nameAtLayer(layerName) != null){
				
				if(checked){
					dtcLayer.global.gsLayerList.nameAtLayer(layerName).setVisible(true);

					var layerMinx =0;
					var layerMiny =0;
					var layerMaxx =0;
					var layerMaxy =0;
					var layerMinz=0;
					var layerMaxz=0;

					var centerX = 0;
					var centerY = 0;
					var centerZ = 0;
					
					var layerSize = dtcLayer.global.layerVisbleList.length;
					
					for(var i=0;i<layerSize;i++){
						var layerDataId = dtcLayer.global.layerVisbleList[i].dataId;
						
						if(layerDataId==dataId){

							layerMinx=dtcLayer.global.layerVisbleList[i].minx;
							layerMiny=dtcLayer.global.layerVisbleList[i].miny;
							
							layerMaxx=dtcLayer.global.layerVisbleList[i].maxx;
							layerMaxy=dtcLayer.global.layerVisbleList[i].maxy;

							centerX = (layerMinx+layerMaxx)/2;
							centerY = (layerMiny+layerMaxy)/2;
							centerZ =dtcLayer.global.layerVisbleList[i].maxz+50;

							break;
						}
					}

					if(dtcSaveMap.global.isLoadMap){
						Module.getViewCamera().moveLonLatBoundary( new Module.JSVector2D(parseFloat(layerMinx), parseFloat(layerMiny)),new Module.JSVector2D(parseFloat(layerMaxx), parseFloat(layerMaxy)));
					}
					//건물편집 모드 켜기
					let json = {
						boundary: {														// 카메라 이동 위치
							min: new Module.JSVector2D(parseFloat(layerMinx), parseFloat(layerMiny)),		// 좌하단
							max: new Module.JSVector2D(parseFloat(layerMaxx), parseFloat(layerMaxy))		// 우상단
						},																
						complete: function(){
							//console.log(centerX, centerY, centerZ)
							if(dtcSaveMap.global.isLoadMap){
								Module.getViewCamera().setLocation(new Module.JSVector3D(centerX, centerY, centerZ));
							}
							
						},												// 이동완료 후 발생하는 CallBack
					};
					if(dtcSaveMap.global.isLoadMap){
						Module.getViewCamera().moveLonLatBoundarybyJson(json);
					}
				}else{
					dtcLayer.MODEL.global.checkEvent=false;
					dtcLayer.global.gsLayerList.nameAtLayer(layerName).setVisible(false);
					//건물편집 모드 끄기
				}

			}else{
				dtcLayer.callLayerInfo(dataId);	
			}

		}else if(type=='G'){
			
			if(dtcLayer.global.gpxLayerList ==null){
				dtcLayer.global.gpxLayerList = new Module.JSLayerList(true);
			}

			if(dtcLayer.global.gpxLayerList.nameAtLayer(layerName) != null){
				if(checked){
					dtcLayer.global.gpxLayerList.nameAtLayer(layerName).setVisible(true);

					var layerMinx =0;
					var layerMiny =0;
					var layerMaxx =0;
					var layerMaxy =0;
					var layerMinz=0;
					var layerMaxz=0;

					var centerX = 0;
					var centerY = 0;
					
					var layerSize = dtcLayer.global.layerVisbleList.length;

					for(var i=0;i<layerSize;i++){
						var layerDataId = dtcLayer.global.layerVisbleList[i].dataId;

						if(layerDataId==dataId){

							layerMinx=dtcLayer.global.layerVisbleList[i].minx;
							layerMiny=dtcLayer.global.layerVisbleList[i].miny;
							
							layerMaxx=dtcLayer.global.layerVisbleList[i].maxx;
							layerMaxy=dtcLayer.global.layerVisbleList[i].maxy;

							centerX = dtcLayer.global.layerVisbleList[i].move_lon;
							centerY = dtcLayer.global.layerVisbleList[i].move_lat;

							break;
						}
					}

					if(dtcSaveMap.global.isLoadMap){
						Module.getViewCamera().moveLonLatBoundary( new Module.JSVector2D(parseFloat(layerMinx), parseFloat(layerMiny)),new Module.JSVector2D(parseFloat(layerMaxx), parseFloat(layerMaxy)));
					}
					//건물편집 모드 켜기
				}else{
					
					dtcLayer.global.gpxLayerList.nameAtLayer(layerName).setVisible(false);
					
				}
				
			}else{
				dtcLayer.callLayerInfo(dataId);	
			}
			
		}else{
		
			if(dtcLayer.global.layerList.nameAtLayer(layerName) != null){
				
				if(checked){
					dtcLayer.global.layerList.nameAtLayer(layerName).setVisible(true);
					var layerSize = dtcLayer.global.layerVisbleList.length;
					
					if(layerSize != 0){
						
						var layerMinx =0;
						var layerMiny =0;
						var layerMaxx =0;
						var layerMaxy =0;
						var layerMinz=0;
						var layerMaxz=0;

						var centerX = 0;
						var centerY = 0;
						for(var i=0;i<layerSize;i++){
							var layerDataId = dtcLayer.global.layerVisbleList[i].dataId;

							if(layerDataId==dataId){

								layerMinx=dtcLayer.global.layerVisbleList[i].minx;
								layerMiny=dtcLayer.global.layerVisbleList[i].miny;
								
								layerMaxx=dtcLayer.global.layerVisbleList[i].maxx;
								layerMaxy=dtcLayer.global.layerVisbleList[i].maxy;

								centerX = dtcLayer.global.layerVisbleList[i].move_lon;
								centerY = dtcLayer.global.layerVisbleList[i].move_lat;

								break;
							}
						}

						if(dtcSaveMap.global.isLoadMap){
							if(type=="LD"){
								Module.getViewCamera().setLocation(new Module.JSVector3D(centerX, centerY, 500));
							}else{
								Module.getViewCamera().moveLonLatBoundary( new Module.JSVector2D(parseFloat(layerMinx), parseFloat(layerMiny)),new Module.JSVector2D(parseFloat(layerMaxx), parseFloat(layerMaxy)));
							}
						}

					}

				}else{
					dtcLayer.global.layerList.nameAtLayer(layerName).setVisible(false)
				}

			}else{
				
				if(type=="Z3"){//3ds 레이어 배열 추가

					if(!dtcLayer.MODEL.global.checkEvent){
						Module.canvas.addEventListener("Fire_EventSelectedObject",dtcLayer.MODEL.get3dsShpProps);
						dtcLayer.MODEL.global.checkEvent=true;
					}

					Module.XDSetMouseState(6);
					//클릭 건물 객체 속성 이벤트 추가하기
					dtcLayer.global.tile3ds.push(value);
					
					var layerList = new Module.JSLayerList(false);
					layerList.nameAtLayer("facility_build").setVisible(false);
					
				}

				dtcLayer.callLayerInfo(dataId);
			}

			
		}
		*/
	}
}