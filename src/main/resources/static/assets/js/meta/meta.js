/**
 *  META CLOUD DATA Loader
 *  DigitalTwin Local Meta Library
 */
var META = {
	apiKey:null,
	engine:null,
	serviceHost:null,
	verification:false,
	metaHost:"meta.dtwincloud.com",
	hid:0,
	init:function() {
		this.checkEnviroment(this.apiKey);
		console.log(this.getContextPath());
	
	},
	initUi:function(){
		
		$("#metaAddBtn").on('click',function(e){
			$("#metaAddModal").modal({backdrop:'static'});
		});
		
		$("#metaAppName").keyup(function(e){
			if($("#metaAppName").val().length >= 3){
				$("#addMetaAppsBtn").removeClass("disabled");
			}
			
		});
		
		$("#addMetaAppsBtn").on('click',function(e){

			if(!$("#metaAppName").val()){
				
				alert('앱 이름을 입력해주세요.');
				
				$("#metaAppName").focus();
				
				return false;
			}

			if(!$("#appDomainNm").val()){
				alert('도메인을 입력해주세요');
				$("#appDomainNm").focus();
				return false;
			}
			
			var data={
					appName:$("#metaAppName").val(),
					appDesc:$("#metaAppsDesc").val(),
					appDomain:$("#appDomainNm").val()
			}
			
			$.ajax({
				url:'../meta/generator.do',
				type:'post',
				data:data,
				dataType:'json',
				success:function(result){
					//console.log(result);
					var status = result.result;
					
					if(status=="200"){
						
						$("#metaAddModal").modal("hide");
						
						COMMON.alert('등록되었습니다.','success',function(){
							location.reload();
						});
						
					}
					
				}
			});
			
		});

		$("#editMetaAppsBtn").on('click',function(e){
			
			if(!$("#metaAppNameEdit").val()){
				
				alert('앱 이름을 입력해주세요.');
				
				$("#metaAppNameEdit").focus();
				
				return false;
			}

			if(!$("#appDomainNmEdit").val()){
				alert('도메인을 입력해주세요');
				$("#appDomainNmEdit").focus();
				return false;
			}
			
			var data={
					hid:META.hid,
					appName:$("#metaAppNameEdit").val(),
					appDesc:$("#metaAppsDescEdit").val(),
					appDomain:$("#appDomainNmEdit").val()
			}

			$.ajax({
				url:'/meta/ide/updateMetaInfo.do',
				type:'POST',
				data:data,
				dataType:'json',
				success:function(result){
					console.log(result);

					if(result.RS=="complete"){

						alert('수정되었습니다.');
						$("#metaEditModal").hide();
						setTimeout(function(){
							location.reload();
						},500)
					}
				}
			})

		});	
	},
	checkEnviroment:function(key) {
		
		//console.log(this.serviceHost);
		
		var formData = new FormData();
		formData.append("API_KEY", key);
		
		$.ajax({
			url:"http://"+this.serviceHost+"/meta/ide/checkMetaDefaultEnviroment.do",
			type: "POST",
			data: formData,
			processData: false,
			contentType: false,
			enctype: 'multipart/form-data',
			success:function(result) {

				var result=JSON.parse(result);

				if(result.rs == "complete") {
					META.verification = true;
					
				} else {
					META.verification = false;
					console.log("ERROR - MetaService Key Unconformity");
				}
			}
		});
	},
	assetFromMetaId:function(id, _callback) {
		if(!META.verification) {
			console.log("ERROR - MetaService Key Unconformity - ");
			return;
		}
		
		var formData = new FormData();
		formData.append("metaAssetId", id);
		
		$.ajax({
			url:"http://"+this.serviceHost+"/meta/ide/assetFromMetaId.do",
			type: "POST",
			data: formData,
			processData: false,
			contentType: false,
			enctype: 'multipart/form-data',
			success:function(result) {

				var result=JSON.parse(result);
				
				console.log(result);
				

				if(result.rs == "complete") {
					
					console.log(result.metaAsset);
					
					var metaAsset = result.metaAsset;
					
					var coordObj = result.coordInfo;
					
					// 임시
					if(metaAsset.data_type == "T") return;
					
					var layerName = "metaAsset_"+id;
					
					var module_static_layer_type = 0;
					
					var dataType = "";
					
					console.log("http://"+META.metaHost+metaAsset.meta_out_url);
					
					
					META.engine.XDEMapRemoveLayer(layerName);
					
					switch(metaAsset.data_type) {
					
						// T : 지형, I : 영상, F : 시설물, P:Point Cloud, S : Shape, L : LOD MODEL, D : 3DS, O: Object, C : CSV
					
						case "T" :
							dataType = "TERRAIN";
						break;
						
						case "I" :
							
							if(result.metaAsset.convert_type == "M") {
								
								module_static_layer_type = 10;
								
								dataType = "HYBRID_IMAGE";
								
								META.engine.XDEMapRemoveLayer(layerName);
								// Module.XDEMapCreateLayer("IMAGE_DATA_"+rs.CVID+"","http://yp.egiscloud.com/builder/hadoopFS/"+result.MEM_ID+"/data/convert/image/"+rs.CVID+"",0,false,true,true,10,0,21);
								META.engine.XDEMapCreateLayer(layerName, "http://"+META.metaHost+metaAsset.meta_out_url, 0, false, true, true, module_static_layer_type, 0, 21);
								
								//META.engine.getViewCamera().setViewAt(metaAsset.move_lon, metaAsset.move_lat, 1000, 45, 0);
								
								
							} else if(metaAsset.convert_type == "B") {
								
								dataType = "BACKGROUND_IMAGE";
								
							}

						break;
						
						case "P" :
							dataType = "POINTCLOUD";
							
							// 
							
							
						break;
						
						case "F" :
							dataType = "FACILITY";
						break;
						
						case "S" :
							dataType = "SHAPE";
						break;
						
						case "L" :
							dataType = "LODMODEL";
						break;
						
						case "D" :
							dataType = "3DS";
						break;
						
						case "C" :
							dataType = "CSV";
						break;
					}
					
					//console.log(Proj4js);
					
					// transform original cooord to epsg4326
					Proj4js.defs[coordObj.epsg] = coordObj.defs_proj4;
					Proj4js.defs["EPSG:4326"] = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";
					
					var source =  new Proj4js.Proj(coordObj.epsg);
					var dest = new Proj4js.Proj("EPSG:4326");
					
					var ptMin = new Proj4js.Point(metaAsset.minx, metaAsset.miny);
					var ptMax = new Proj4js.Point(metaAsset.maxx, metaAsset.maxy);
					
					var transMin = Proj4js.transform(source, dest, ptMin);
					var transMax = Proj4js.transform(source, dest, ptMax);
					
					META.layerBoundView(transMin.minx, transMin.miny, transMax.maxx, transMax.maxy);
					
					//console.log(transMin, transMax);

					var metaObj = {
						result:"success",
						assetId:id,
						layerName:"metaAsset_"+id,
						dataType:dataType,
						moveLon:metaAsset.move_lon, 
						moveLat:metaAsset.move_lat,
						moveAlt:metaAsset.move_alt,
						thumb_url:metaAsset.thumbnail_url,
						dataName:metaAsset.data_name,
						coord_type:metaAsset.coord_type,
						minx:transMin.x,
						miny:transMin.y,
						maxx:transMax.x,
						maxy:transMax.y
					};
					
					
					_callback(metaObj);
					
				} else {
					console.log("ERROR - MetaService unavailable");
				}
			}
		});
	},
	layerBoundView:function(minx, miny, maxx, maxy) {
		//console.log(arguments);
		META.engine.getViewCamera().moveLonLatBoundary(new META.engine.JSVector2D(parseFloat(minx), parseFloat(miny)), new META.engine.JSVector2D(parseFloat(maxx), parseFloat(maxy)));
	},
	showHideLayer:function(layerName, act) {
		var visible = false;
		if(act == "SHOW") visible = true;
		
		META.engine.getMap().setLayerVisible(layerName, visible);
		META.engine.XDRenderData();
	},
	getContextPath:function() {
		var hostIndex = location.href.indexOf( location.host ) + location.host.length;
		return location.href.substring( hostIndex, location.href.indexOf('/', hostIndex + 1));
	},
	addMeataApplication:function(){
		
	},
	editMetaInfo:function(hid){

		var data={
			hid:hid
		}

		META.hid=hid;

		$.ajax({
			url:"/meta/ide/editMetaInfo.do",
			type:'POST',
			data:data,
			dataType:'json',
			success:function(result){
				console.log(result);
				
				var appName = result.RECORD.app_nm;
				var appDomain = result.RECORD.host;
				var appDesc = result.RECORD.app_desc;
				var apiKey = result.RECORD.api_key;

				$("#metaAppNameEdit").val(appName);
				$("#appDomainNmEdit").val(appDomain);
				$("#metaAppsDescEdit").val(appDesc);
				$("#metaAppKeyEdit").val(apiKey);

				$("#metaEditModal").modal();
			}
		})
	},
	deleteMetaInfo:function(hid){

		var deleteConfirm = confirm('삭제하시겠습니까?');
		
		if(deleteConfirm){
		
			var data={
				hid:hid
			}

			$.ajax({
				url:"/meta/ide/deleteMetaInfo.do",
				type:'POST',
				data:data,
				dataType:'json',
				success:function(result){
					console.log(result);
					
					if(result.RS=="complete"){
						alert('삭제되었습니다.');
						location.reload();

					}
				}
			});

		}else{
			return false;
		}
		
	}
}