var dtcBasicLayer={
	tree:null,
	layerArr:null,
	to_hide:[],
	init:function(){
		var urlParams = new URL(location.href).searchParams;
		var glid = urlParams.get('glid');
		var mapid = urlParams.get('mapid');

		if(IDE.mapid != null && IDE.mapid != "" && mapid == null){
			var formData = new FormData();
			formData.append("glid", glid);
			$.ajax({
				url : "/layer/loadMapLayer.do",
				type: "POST",
				data: formData,
				processData: false,
				contentType: false,
				enctype: 'multipart/form-data',
				success:function(result) {
					var result = JSON.parse(result);
					if(result.mapsVO.lgid != 0){
						dtcLg.loadLayerGroupInfo(result.mapsVO.lgid);
					} else {
						var data = {"default":"N"}
				
						dtcBasicLayer.callGroupLayer(data);
					}
					if(result.mapsVO.lid != 0 && result.mapsVO.lid != null){
						if(document.getElementById('legendInfo')){
							dtcSetting.legend.loadLegendInfo(result.mapsVO.lid);
						}
					}
				}
			})
		} else {
			if(dtcLg.tree == null){
				var data = {"default":"N"}
				
				dtcBasicLayer.callGroupLayer(data);
			}
		}
		
		if(mapid != null){
			var formData = new FormData();
			formData.append("mapid", mapid);
			$.ajax({
				url : "/layer/loadGalleryMapLayers.do",
				type: "POST",
				data: formData,
				processData: false,
				contentType: false,
				enctype: 'multipart/form-data',
				success:function(result) {
					var result = JSON.parse(result);
					dtcLg.loadLayerGroupInfo(result.mapsVO.lgid);
					
					if(result.mapsVO.lid != 0 && result.mapsVO.lid != null){
						if(document.getElementById('legendInfo')){
							dtcSetting.legend.loadLegendInfo(result.mapsVO.lid);
						}
					}
				}
			})
		}
	},
	callGroupLayer:function(data){
		var layerArr=[];
			
		if(data.default != 'Y' && typeof data.user !='undefined'){
			layerArr=data.user;
		}else{
			var defaultJson = { "id" : "root-layer", "parent" : "#", "text" : "기본 레이어",type:'default',a_attr:'no_checkbox',li_attr:{class:'no_checkbox'} };
			layerArr.push(defaultJson);
		}
		/*layerArr.forEach(function(d1){
			if(d1.id.includes("meta_asset_")) d1.id = d1.id.split("meta_asset_")[1];
		})*/
		dtcBasicLayer.layerArr = layerArr;
		dtcBasicLayer.tree = $("#basicLayerTree").jstree({
			core:{
				data: layerArr,
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

								//var rootNode = $("#basicLayerTree").jstree().get_node('root-layer');
								var rootNode = $("#basicLayerTree").jstree().get_node(parent_id);

								$("#basicLayerTree").jstree().create_node(rootNode,children_node,"last",function(node){
									$("#basicLayerTree").jstree('open_all');
									$("#basicLayerTree").jstree(true).edit(node);
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
								
								/*$node = $("#basicLayerTree").jstree(true).create_node($node,folderNode,'last',function(node){

									$("#basicLayerTree").jstree(true).edit(node);
									
								});*/
								

							}
						}
					}

					var remove ={
						separator_before:false,
						separator_after:false,
						label:'삭제',
						icon:'far fa-trash-alt',
						action:function(obj){
							$("#basicLayerTree").jstree(true).delete_node($node);
						}
					};

					var rename = {
						separator_before:false,
						separator_after:false,
						icon:'far fa-edit',
						label:'이름 변경',
						action:function(obj){
							$("#basicLayerTree").jstree(true).edit($node);
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
			plugins:['contextmenu','checkbox','dnd','types','state']
		});
		
		$("#basicLayerTree").on("check_node.jstree uncheck_node.jstree", function(e, data) {
			dtcBasicLayer.checkboxEvent(data);
		});
		$("#basicLayerTree").on("select_node.jstree", function (e, data) {
			var dataId = data.node.id;
			var data={	
				dataId:dataId
			}
			if(D_MEMBER.MID > 0){
				$.ajax({
					url:'/ide/callLayerInfo.do',
					type:'POST',
					data:data,
					dataType:'json',
					success:function(result){
						if(result.INFO != null){
							Module.getViewCamera().moveLonLatBoundary(
				            new Module.JSVector2D(parseFloat(result.INFO.minx), parseFloat(result.INFO.miny)),
				            new Module.JSVector2D(parseFloat(result.INFO.maxx), parseFloat(result.INFO.maxy)));
						}
					}	
				})
			}else{
				if(IDE.mapInfo.layerData.length > 0){
					var result = IDE.mapInfo.layerData.find(function(element){
					    if(element.dataid == parseInt(data.dataId.split("meta_asset_")[1]))  {
					        return true;
					      }
					})
					if(result != undefined){
						Module.getViewCamera().moveLonLatBoundary(
			            new Module.JSVector2D(parseFloat(result.minx), parseFloat(result.miny)),
			            new Module.JSVector2D(parseFloat(result.maxx), parseFloat(result.maxy)));
					}
				}
			}
		});
		$("#basicLayerTree").on('loaded.jstree', function(){
		    if(window.location.href.indexOf("galleryView.do") > -1 || window.location.href.indexOf("loadMapInfo.do") > -1){
		        dtcLayer.mapidMapLayers();
		    }else if(window.location.href.indexOf("gallery.do") > -1){
		        dtcLayer.glidMapLayer();
		    }
		});
		
	},
	callLayerInfo:function(dataId){
		if(IDE.mapInfo.layerData.length > 0){
			var data = IDE.mapInfo.layerData.find(function(element){
			    if(element.dataid == parseInt(dataId))  {
			        return true;
			      }
			})
			if(data != undefined){
				result = {};
				result.INFO = data;
				var layerInfo ={
					dataId:result.INFO.dataid,
					minx:result.INFO.minx,
					miny:result.INFO.miny,
					minz:result.INFO.minz,
					maxx:result.INFO.maxx,
					maxy:result.INFO.maxy,
					maxz:result.INFO.maxz,
					move_lon:result.INFO.move_lon,
					move_lat:result.INFO.move_lat,

				}

				if(result.INFO.data_type=="S" || result.INFO.data_type=="DXF"){

					dtcLayer.SHP.addLayer(result);

				} else if(result.INFO.data_type=="C"){
					if(IDE.mapInfo['prop_name'+result.INFO.dataid] != undefined){
						result.prop_name = IDE.mapInfo['prop_name'+result.INFO.dataid];
					}
					dtcLayer.CSV.addLayer(result);

				} else if(result.INFO.data_type=="I"){

					dtcLayer.IMG.addLayer(result);

				} else if(result.INFO.data_type == "T") {

					dtcLayer.TERRAIN.addLayer(result);

				}else if(result.INFO.data_type == "P"){

					dtcLayer.POINT.addLayer(result);

				}else if(result.INFO.data_type == "LD"){
					dtcLayer.DRONE_MODEL.addLayer(result);

				}else if(result.INFO.data_type == "Z3"){
					
					layerInfo.maxz = result.HEIGHT_INFO.max_height;
					
					dtcLayer.MODEL.addLayer(result);

				}else if(result.INFO.data_type == "G"){

					dtcLayer.GPX.addLayer(result);

				}else if(result.INFO.data_type == "B"){

					dtcLayer.BIM.addLayer(result.INFO);

				}else if(result.INFO.data_type == "J"){

					dtcLayer.JPG.addLayer(result);

				}

				dtcLayer.global.layerVisbleList.push(layerInfo);
			}
		}
	},
	addLayer:function(obj){
		
		var dataName = obj.name;
		var type = obj.type;
		var dataId = obj.dataId;
		var value = obj.value;
		if(dtcBasicLayer.layerArr != null && window.location.href.indexOf("/layer/galleryView.do") <= -1){
			dtcBasicLayer.layerArr.forEach(function(d1){
			    if(d1.li_attr.id.includes("meta_asset_")){   
					var checkId = d1.li_attr.id.split("meta_asset_")[1];
					if(checkId == (dataId+"")){
						var rootNode = $("#basicLayerTree").jstree().get_node(d1.parent);
						var data = { id : dataId, parent : d1.parent, name: value, text : dataName,type:type, class:'layer_tree_'+dataId+'',state:{selected:true,checked:true}};
						console.log(data);
						var info = $("#basicLayerTree").jstree().get_node(d1.id);
						info.name = value;
						info.original.name = value;
						info.class = 'layer_tree_'+dataId+'';
						$("#basicLayerTree").jstree().refresh_node(info);
						
					}
			    }
			})	
		}
		
		
	},

	deleteJstree:function(){
		var jsonArr = $("#basicLayerTree").jstree().get_json('#',{flat:true});
		
	},
	checkboxEvent:function(data){
		
		//var layerName = data.node.original.text;
		var dataId = data.node.original.id;
		var dataType = data.node.original.type;
		var dataName = data.node.original.name;
		var checked = data.node.state.checked;

		if(dataType == "S" || dataType == "DXF" || dataType == "GJ"){
			
			//shp일경우 Visible로 조절하지않음	
			if(dtcLayer.SHP.layerName != null){	
				var data={	
					dataId:dataId	
				}	
					
				$.ajax({
					url:'/ide/callLayerInfo.do',
					type:'POST',
					data:data,
					dataType:'json',
					success:function(result){
						if(result.INFO.data_type=="S" || result.INFO.data_type=="DXF" || result.INFO.data_type=="GJ"){	
							if(checked)
								dtcLayer.SHP.addLayer(result);
							else 
								dtcLayer.SHP.delLayer(result);
						}	
					}	
				})	
			}else{	
				dtcLayer.callLayerInfo(dataId);
			}	
				
		}else if(dataType == "default"){
			return;
		}
		else{	
			var layerList = new Module.JSLayerList(true);
			var layer = layerList.nameAtLayer(dataName);

			if (layer != null && checked) {
				layer.setVisible(true);
			} else {
				layer.setVisible(false);
			}
		}	
	}
}

