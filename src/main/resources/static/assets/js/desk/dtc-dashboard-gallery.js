var GALLERY = {
	editor:null,
	dataTable:0,
	galleryEdit:null,
	galleryUpdateEdit:null,
	init:function() {
	
		GALLERY.dataTable = $('#myGalleryList').DataTable( {
				"columns": [
	    		    { "width": "5%"},
	    		    { "width": "40%", "orderable": false },
	    		    { "width": "15%", "orderable": false },
	    		    { "width": "15%", "orderable": false },
					{ "width": "15%", "orderable": false }
	    		  ],
		         "order": [[ 0, 'desc' ]]
				
		} );
	
	  
	},
	shareInit:function(){
		GALLERY.bootstrapDualListbox =  $('#duallistbox-example').bootstrapDualListbox({
			      nonSelectedListLabel: '<span style="font-weight: 600;font-size: 17px;">● 전체 그룹</span>',
			      selectedListLabel: '<span style="font-weight: 600;font-size: 17px;">● 공개할 그룹</span>',
			      preserveSelectionOnMove: 'moved',
			      moveOnSelect: false
		});	
		
		$('input[name=galleryShareType]').change(function(){
		    var test = $("input[name='galleryShareType']:checked").val();
		    if(test == "N"){
				 $("#shareMyGroup").css("display","block"); 
			} else {
				$("#shareMyGroup").css("display","none"); 
			}
		});	
	},
	editorInit:function(){
		ClassicEditor
            .create( document.querySelector( '#galleryContent' ),{
            	language:{
            		textPartLanguage: [
                        { title: 'English', languageCode: 'en' },
                        { title: 'Korean', languageCode: 'ko' }
                    ]
            	}
            	,
            	ckfinder:{ //이미지 업로드
            		uploadUrl:'/gallery/uploadEditorImg.do'
            	},
            	toolbar: {
            	    items: [
            	    	'sourceEditing','|',
            	    	'htmlEmbed','|',
            	        'heading', '|',
            	        'fontfamily', 'fontsize', '|',
            	        'alignment', '|',
            	        'fontColor', 'fontBackgroundColor', '|',
            	        'bold', 'italic', 'strikethrough', 'underline', 'subscript', 'superscript', '|',
            	        'link', '|',
            	        'outdent', 'indent', '|',
            	         '-',
            	        'code', 'codeBlock', '|',
            	        'insertTable', '|',
            	        'uploadImage','|','mediaEmbed', 'blockQuote', '|',
            	        'undo', 'redo'
            	  
            	        /*'textPartLanguage'*/
            	    ],
            	    shouldNotGroupWhenFull: true
            	},
 				mediaEmbed: {
        			previewsInData: true
    			},
                list: {
                     properties: {
                         styles: true,
                         startIndex: true,
                         reversed: true
                     }
                 },
                 heading: {
                     options: [
                         { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                         { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                         { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                         { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
                         { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
                         { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
                         { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
                     ]
                 },
                 placeholder: '내용을 입력해주세요.',
                 fontFamily: {
                     options: [
                         'default',
                         'Arial, Helvetica, sans-serif',
                         'Courier New, Courier, monospace',
                         'Georgia, serif',
                         'Lucida Sans Unicode, Lucida Grande, sans-serif',
                         'Tahoma, Geneva, sans-serif',
                         'Times New Roman, Times, serif',
                         'Trebuchet MS, Helvetica, sans-serif',
                         'Verdana, Geneva, sans-serif'
                     ],
                     supportAllValues: true
                 },
                 fontSize: {
                     options: [ 10, 12, 14, 'default', 18, 20, 22 ],
                     supportAllValues: true
                 },
                 htmlSupport: {
                     allow: [
                         {
                             name: /.*/,
                             attributes: true,
                             classes: true,
                             styles: true
                         }
                     ]
                 },
                 htmlEmbed: {
                     showPreviews: true
                 },
                 link: {
                     decorators: {
                         addTargetToExternalLinks: true,
                         defaultProtocol: 'https://',
                         toggleDownloadable: {
                             mode: 'manual',
                             label: 'Downloadable',
                             attributes: {
                                 download: 'file'
                             }
                         }
                     }
                 },
                 mention: {
                     feeds: [
                         {
                             marker: '@',
                             feed: [
                                 '@apple', '@bears', '@brownie', '@cake', '@cake', '@candy', '@canes', '@chocolate', '@cookie', '@cotton', '@cream',
                                 '@cupcake', '@danish', '@donut', '@dragée', '@fruitcake', '@gingerbread', '@gummi', '@ice', '@jelly-o',
                                 '@liquorice', '@macaroon', '@marzipan', '@oat', '@pie', '@plum', '@pudding', '@sesame', '@snaps', '@soufflé',
                                 '@sugar', '@sweet', '@topping', '@wafer'
                             ],
                             minimumCharacters: 1
                         }
                     ]
                 },
                 removePlugins: [
                     'CKBox',
                     'CKFinder',
                     'EasyImage',
                     'RealTimeCollaborativeComments',
                     'RealTimeCollaborativeTrackChanges',
                     'RealTimeCollaborativeRevisionHistory',
                     'PresenceList',
                     'Comments',
                     'TrackChanges',
                     'TrackChangesData',
                     'RevisionHistory',
                     'Pagination',
                     'WProofreader',
                     'MathType'
                 ]
            })
            .then( editor => {
            	GALLERY.galleryEdit = editor;
            	var templateHtml = '<head>'+
									    '<meta charset="UTF-8">'+
									    '<meta http-equiv="X-UA-Compatible" content="IE=edge">'+
									    '<meta name="viewport" content="width=device-width, initial-scale=1.0">'+
									    '<title>Document</title>'+
									'</head>';
            	GALLERY.galleryEdit.setData(templateHtml);
            	
            } )
            .catch( error => {
                console.error( error );
            } ); 

	},
	backBtnClick:function() {
		$("#galleryList").css("display","block");
		$("#backBtn").css("display","none");
		$("#galleryDetail").css("display","none");
	},
	viewGallery:function(glid) {
		$("#galleryList").css("display","none");
		$("#backBtn").css("display","block");
		$("#galleryDetail").css("display","block");
		
		$.ajax({
		           url : '/gallery/viewGallery.do',
		           type : 'POST',
		           data : {'glid' : glid},
		           dataType:"json",
		           success : function(result) {
				
						$("#tit_gallery").html(result.gallery.title);
						$("#date_gallery").html("등록일 <strong>"+result.gallery.reg_date+"</strong>");
						$("#hit_gallery").html("조회수 <strong>"+result.gallery.hit+"</strong>");
						if(result.gallery.thumb_url == null) result.gallery.thumb_url = "/assets/img/sample.png";
						$("#thum_gallery").html("<img src='"+result.gallery.thumb_url+"' alt='' style='height: 400px; width: inherit;'>");
						$("#intro_gallery").html(result.gallery.intro);

						$("#intro_gallery").append('<div style="position:absolute; bottom:35px;" id="copyright_gallery"></div>');
						
						var html='';
						html += '<span>';
						if(result.gallery.copyright == 10) {
							html +=		'<img src="/assets/images/s-map/contents/license_icon_01.jpg " style="width:90px;">';
							html +=		'<span style="font-size:16px;"> 공공누리 공공저작물 자유이용허락</span>';
							html += '</span>';
						} else if(result.gallery.copyright == 1) {
							
							if(result.gallery.ccl_commerce == 10){
								if(result.gallery.ccl_change == 10){ // 허용 허용
									html +=	'<img src="/assets/images/s-map/contents/ccl_icon_01.png" style="width:100px;">';
									html +=	'<span style="font-size:16px;"> 저작자표시 (CC BY)</span>';
								} else if(result.gallery.ccl_change == 5){ //허용 동일 허용
									html +=	'<img src="/assets/images/s-map/contents/ccl_icon_04.png" style="width:100px;">';
									html +=	'<span style="font-size:16px;"> 저작자표시-동일조건변경허락 (CC BY-SA)</span>';
								} else if(result.gallery.ccl_commerce == 1){ //허용 비허용
									html +=	'<img src="/assets/images/s-map/contents/ccl_icon_03.png" style="width:100px;">';
									html +=	'<span style="font-size:16px;"> 저작자표시-변경금지 (CC BY-ND)</span>';
								}
							} else if(result.gallery.ccl_commerce == 1){
								if(result.gallery.ccl_change == 10){ // 비허용 허용
									html +=	'<img src="/assets/images/s-map/contents/ccl_icon_02.png" style="width:100px;">';
									html +=	'<span style="font-size:16px;"> 저작자표시-비영리 (CC BY-NC)</span>';
								} else if(result.gallery.ccl_change == 5){ //비허용 동일 허용
									html +=	'<img src="/assets/images/s-map/contents/ccl_icon_05.png" style="width:100px;">';
									html +=	'<span style="font-size:16px;"> 저작자표시-비영리-동일조건허락 (CC BY-NC-SA)</span>';
								} else if(result.gallery.ccl_commerce == 1){ //비허용 비허용
									html +=	'<img src="/assets/images/s-map/contents/ccl_icon_06.png " style="width:100px;">';
									html +=	'<span style="font-size:16px;"> 저작자표시-비영리-변경금지 (CC BY-NC-ND)</span>';
								}
							}
							
							html += '</span>';
							
							html += '<span class="btn-group dropstart" style="position: absolute; bottom:-17px; left:0; font-size:12px;">';
							html +=		'<i class="fa fa-info-circle" id="ccl_info" aria-hidden="true"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> 자세히 알아보기</i>';
							html +=		'<div class="dropdown-menu" aria-labelledby="ccl_info" id="ccl_info_dropdown" style="width:680px; border: 1px solid #C0CEDF;">';
							html +=		'	<span style="font-weight:800; color: #102F50;">&nbsp&nbsp저작물 이용허락 표시제도 CCL(Creative Commons License)</span>';
							html +=		'	<table class="bbs-regist">';
							html +=		'		<colgroup>';
							html +=		'			<col style="width: 100px;">';
							html +=		'			<col style="width: auto;">';
							html +=		'		</colgroup>';
							html +=		'		<tr><th scope="row" style="padding: 12px 10px 12px 10px;"><img src="/assets/images/s-map/contents/ccl_icon_01.png" style="width:100px;"></th>';
							html +=		'		<td style="font-size:12px; padding:4px 0; padding-right:10px;">저작자표시(CC BY)</br>원 저작자를 밝히면 자유로운 이용이 가능</td></<tr>';
							html +=		'		<tr><th scope="row" style="padding: 12px 10px 12px 10px;"><img src="/assets/images/s-map/contents/ccl_icon_02.png" style="width:100px;"></th>';
							html +=		'		<td style="font-size:12px; padding:4px 0; padding-right:10px;">저작자표시-비영리(CC BY-NC)</br>원 저작자를 밝히면 자유로운 이용이 가능하지만 영리목적으로 이용 불가 Non-Commercial</td></tr>';
							html +=		'		<tr><th scope="row" style="padding: 12px 10px 12px 10px;"><img src="/assets/images/s-map/contents/ccl_icon_03.png" style="width:100px;"></th>';
							html +=		'		<td style="font-size:12px; padding:4px 0; padding-right:10px;">저작자표시-동일조건변경허락(CC BY-SA)</br>원 저작자를 밝히면 자유로운 이용이 가능. 동일조건 라이선스 적용 후 자유이용</td></tr>';
							html +=		'		<tr><th scope="row" style="padding: 12px 10px 12px 10px;"><img src="/assets/images/s-map/contents/ccl_icon_04.png" style="width:100px;"></th>';
							html +=		'		<td style="font-size:12px; padding:4px 0; padding-right:10px;">저작자표시-변경금지(CC BY-ND)</br>원 저작자를 밝히면 자유로운 이용이 가능하지만 변경없이 그대로 이용해야함</td></tr>';
							html +=		'		<tr><th scope="row" style="padding: 12px 10px 12px 10px;"><img src="/assets/images/s-map/contents/ccl_icon_05.png" style="width:100px;"></th>';
							html +=		'		<td style="font-size:12px; padding:4px 0; padding-right:10px;">저작자표시-비영리-동일조건변경허락(CC BY-NC-SA)</br>원 저작자를 밝히면 자유로운 이용이 가능. 영리목적 이용이 불가하며 동일조건 라이선스 적용 후 자유 이용</td></tr>';
							html +=		'		<tr><th scope="row" style="padding: 12px 10px 12px 10px; border-bottom: 0px;"><img src="/assets/images/s-map/contents/ccl_icon_06.png" style="width:100px;"></th>';
							html +=		'		<td style="font-size:12px; padding:4px 0; padding-right:10px; border-bottom: 0px;">저작자표시-비영리-변경금지(CC BY-NC-ND)</br>원 저작자를 밝히면 자유로운 이용이 가능. 영리목적 이용이 불가하며 변경 없이 이용해야 함</td></tr>';
							html +=		'	</table>';
							html +=		'</div>';
							html += '</span>';
							
						}

			
						$("#copyright_gallery").append(html);
						
						$("#intro_gallery").append('<div class="eg-btn-wrap" id="button_gallery"></div>');
						
						$("#button_gallery").append('<button type="button" class="eg-btn basic bi-newWindow" id="detailBtn">새창에서 보기</button>');
						
						let detailBtn = document.querySelector("#detailBtn");
	  						detailBtn.onclick = function() {
								//var url = '/gallery/detail.do?glid='+glid;
								var url = '/gallery/detail.do?glid='+encodeURIComponent(result.gallery.encodedGlid);   
								window.open(url,'detailPopupView','');  
	  					}
					
						if(result.gallery.map_btn_state=='1'){
							$("#button_gallery").append('<button type="button" class="eg-btn basic bi-detail" id="layerBtn">지도에서 보기</button>');
							
							let layerBtn = document.querySelector("#layerBtn");
	  						layerBtn.onclick = function() {
								//var url = '/layer/gallery.do?glid='+glid;
								var encodedGlid =encodeURIComponent(result.gallery.encodedGlid);
								var url = '/layer/gallery.do?glid='+encodedGlid;
								window.open(url,'layerPopupView','');  
	  						}
						}
						
						var content = (result.gallery.content).replaceAll('<figure class="media">','<figure>');
						
						$("#content_gallery").html(content);
				
						
						$("#content_gallery [id^=mapId_").each(function(e,data){
							data.onload= function () {
						    	var mapid = data.id.split("mapId_")[1];
								var width = data.width;
								var height = data.height;
								html = '<div id="divMapId_'+mapid+'" style="position: absolute;background-color: rgba(52, 52, 52, 0.733);width:'+width+'px;height:'+height+'px;display: table;color: white;text-align: center;cursor: pointer;">';
							    html += 	'<span style="display: table-cell;vertical-align: middle;"><img src="/assets/images/s-map/icon/bi-openlab.png" class="mr-2 pb-1">클릭하여 지도보기</span>';
								$(data).parent().prepend(html);
							}
						});
						$("#content_gallery").on('click', "[id^=divMapId_]",function(e){
							var target = e.target;
							if(e.target.nodeName == "SPAN") target = target.parentElement;
						    var mapid = target.id.split("divMapId_")[1];
							//var width = target.width;
							//var height = target.height;
							var width = $(target).width();
							var height = $(target).height();

							$.ajax({
								url : '/layer/encodeMapid.do',
								type : 'POST',
								dataType : 'json',
								data:{"mapid":mapid},
								async:false,
								success : function(result) {
									if(result.rs=="complete"){
										//암호화된 econdedMapid 호출
										html = '<div style="position: relative; z-index: 20; ">';
									    html += 	'<iframe id="map_'+mapid+'" src="/layer/galleryView.do?mapid='+result.encodedMapid+'" style="width:'+width+'px;height:'+height+'px" onmouseover="javascript:GALLERY.appearMap(\''+mapid+'\')" onmouseout="javascript:GALLERY.disappearMap(\''+mapid+'\')"></iframe>';
										//html += 	'<div id="appearMap_'+result.encodedMapid+'" onclick="javascript:GALLERY.moveMap(\''+result.encodedMapid+'\')" onmouseover="javascript:GALLERY.appearMap(\''+result.encodedMapid+'\')" ';
										//html += 	'style="position: absolute; background-color: #343434BB; width: calc('+width+'px - 2px); color: white; line-height: 40px;text-align: center;bottom: 5px; display:none; cursor : pointer;">';
										//html +=			'<img src="/assets/images/s-map/icon/bi-detail-on.png" class="mr-2 pb-1">';
										//html +=			'새 창에서 보기';
										//html +=		'</div>';
										html +='</div>';
									    $(target).parent().append(html);
									    $(target).remove();
									    $("#mapId_"+result.mapid).remove();
									}else{
										COMMON.alert("네트워크 문제로 지도 불러오기가  실패하였습니다.다시 시도해주세요","error",function(){return;});//번호가 틀린 경우
									}

								}
							});
						});
						
						
					}
			
		});
	},
	delGallery :function(glid, page){
		
		let page_num = GALLERY.dataTable.page.info().page;
		
		COMMON.confirm("<span style='color: #595959;'>갤러리 글을 삭제하시겠습니까?<span>","",
		"info",
		function(){
	
			$.ajax({
				url:'/gallery/deleteGallery.do',
				type: "POST",
				data: {"glid": glid},
				dataType:"json",	
				async:false,
				success:function(result) {
					if(result.rs == "complete") {
						COMMON.alert("삭제 되었습니다.","success",function(){
							//GALLERY.dataTable.fnReloadAjax();
							//GALLERY.dataTable.ajax.reload();
							 //$("#myGalleryList").load("#myGalleryList");
							 window.location.reload();
							 //$('#myGalleryList_wrapper').load(location.href+' #myGalleryList_wrapper');
							 //GALLERY.dataTable.page(page_num).draw(false);
							//GALLERY.GALLERY.paginationMyGallery(page);
							//GALLERY.dataTable.ajax.reload(null, false);
							//GALLERY.dataTable.fnDraw();
							//$('#myGalleryList').DataTable().page( 'previous' ).draw( 'page' );
						});
					} else {
						COMMON.alert("삭제 중 에러가 발생하였습니다.","warning",function(){
							window.location.reload();
						});
					}
				}
			});
		},
		function(){return false;});

	},
	reqDelGallery :function(glid, page){
		
		COMMON.confirm("<span style='color: #595959;'>갤러리 글을 삭제요청하시겠습니까?<span>","",
		"info",
		function(){
	
			$.ajax({
				url:'/gallery/reqDelGallery.do',
				type: "POST",
				data: {"glid": glid},
				dataType:"json",
				async:false,
				success:function(result) {
					if(result.rs == "complete") {
						COMMON.alert("삭제 요청 되었습니다.","success",function(){
							window.location.reload();
						});
					} else {
						COMMON.alert("삭제 요청 중 에러가 발생하였습니다.","warning",function(){
							window.location.reload();
						});
					}
					
				}
			});
		},
		function(){return false;});

	},
	reqEditGallery :function(glid, page){
		

		COMMON.confirm("<span style='color: #595959;'>갤러리 글을 수정 요청하시겠습니까?<span>","",
		"info",
		function(){
	
			$.ajax({
				url:'/gallery/reqEditGallery.do',
				type: "POST",
				data: {"glid": glid},
				dataType:"json",
				async:false,
				success:function(result) {
					if(result.rs == "complete") {
						COMMON.alert("수정 요청 되었습니다.","success",function(){
							window.location.reload();
						});
					} else {
						COMMON.alert("수정 요청 중 에러가 발생하였습니다.","warning",function(){
							window.location.reload();
						});
					}
					
				}
			});
		},
		function(){return false;});

	},
	reqCanGallery :function(glid, page){
		
		COMMON.confirm("<span style='color: #595959;'>요청을 취소 하시겠습니까?<span>","",
		"info",
		function(){
	
			$.ajax({
				url:'/gallery/reqCanGallery.do',
				type: "POST",
				data: {"glid": glid},
				dataType:"json",
				async:false,
				success:function(result) {
					if(result.rs == "complete") {
						COMMON.alert("요청이 취소 되었습니다.","success",function(){
							window.location.reload();
						});
					} else {
						COMMON.alert("요청 취소 중 에러가 발생하였습니다.","warning",function(){
							window.location.reload();
						});
					}
					
				}
			});
		},
		function(){return false;});

	},
	addCanGallery :function(glid, page){
		
		COMMON.confirm("<span style='color: #595959;'>등록을 취소 하시겠습니까?<span>","",
		"info",
		function(){
	
			$.ajax({
				url:'/gallery/addCanGallery.do',
				type: "POST",
				data: {"glid": glid},
				dataType:"json",
				async:false,
				success:function(result) {
					if(result.rs == "complete") {
						COMMON.alert("등록이 취소 되었습니다.","success",function(){
							window.location.reload();
						});
					} else {
						COMMON.alert("등록 취소 중 에러가 발생하였습니다.","warning",function(){
							window.location.reload();
						});
					}
					
				}
			});
		},
		function(){return false;});

	},
	confirmPrivacy:function(files, editor) {
		var formData = new FormData();
		formData.append("userIP", $("#userIP").val());
		var content_files = document.getElementById(files);
		if(content_files != null && content_files.files.length > 0){
			for(var i = 0; i < content_files.length; i++) {
				formData.append("file"+i, content_files[i]);
			}
		} else {
			formData.append("file", "");
		}

		formData.append("content", editor.getData());
		var return_data = null;
		$.ajax({
				url:"https://API241.eseoul.go.kr:5443/UPServer/",
				type: "POST",
				data: formData,
				processData: false,
				contentType: false,
				async:false,
				enctype: 'multipart/form-data',
				success:function(result) {
					var result=JSON.parse(result);
					if(result.privacy[0].isPriv == 1){
						return_data = false;
					} else {
						return_data = true;
					}
				}
			});
			return return_data;
	},
	registGalleryCheck:function(){
		var title = $('#gTitle').val();//갤러리 타이틀
		var kwd = $('#gKeyword').val();//키워드 해쉬
		var intro = $('#gIntro').val();//갤러리 소개

		if(title == '' || title == undefined){
			COMMON.alert('갤러리 제목을 입력해주세요.','error',function(){
				return false;
			});
			return false;
		}if(kwd == '' || kwd == undefined){
			COMMON.alert('키워드를 입력해주세요.','error',function(){
				return false;
			});
			return false;
		}if(intro == '' || intro == undefined){
			COMMON.alert('갤러리 소개 내용을 입력해주세요.','error',function(){
				return false;
			});
			return false;
		}
		
		if($('#main_image').attr("src") == "/assets/img/sample.png" && !$('#basicImage').is(':checked')) {
			COMMON.alert('대표 이미지를 업로드 하거나\n기본 이미지 사용을\n 체크하여 주세요.','error',function(){
				return false;
			});
			return false;
		}
			
		if(GALLERY.galleryEdit.getData() == "") {
			COMMON.alert('갤러리 설명을 입력하세요','error',function(){
				return false;
			});
			return false;
		}
		
		if($("[name=galleryShareType]:checked").val() == 'N' && $('[name="country-of-operation-edit[]"]').val().length == 0){
				alert('공유할 그룹을 선택하거나 전체공유를 선택해주세요.');				
				return false;
				
		}
		
		
		COMMON.confirm("<span style='color: #595959;'>입력한 정보를 등록하시겠습니까?<span>","",
		"info",
		function(){
			var content = "";
			content = GALLERY.galleryEdit;
			
			var flag = GALLERY.confirmPrivacy("",content);
			if(!flag){
				COMMON.confirm("<span style='color: #595959;'>개인정보 노출 가능성이 있습니다.<span>","계속 진행하시겠습니까?",
				"info",
				function(){
					GALLERY.registGalleryUP();
				},
				function(){
					return false;
				});
			}else{
				GALLERY.registGalleryUP();
			}
		},
		function(){
			return false;
		});
	},
	registGalleryUP:function(){
			
		var btnCheck = $("input[name='addMapBtnAdd']:checked").val();
		let formData = new FormData();
		
		formData.append("gTitle",$('#gTitle').val());
		formData.append("gKeyword",GALLERY.HASH_TAG.keywords.toString());
		formData.append("gIntro",$('#gIntro').val());
		formData.append("editorInfo", (GALLERY.galleryEdit.getData() == "") ? "null" : GALLERY.galleryEdit.getData());
		formData.append("gtype","1");
		formData.append("mapId",GALLERY.MAP.realMapId);
		formData.append("btnState",btnCheck);
		formData.append("share_type", $("[name=galleryShareType]:checked").val());
		formData.append("share_gid", ($('[name="country-of-operation-edit[]"]').val().toString()== "") ? "null" : ","+$('[name="country-of-operation-edit[]"]').val().toString()+",");
		
		if(!$('#basicImage').is(':checked')){
			var image_file = document.getElementById('mainImageFile').files;
			if(image_file[0] != null){
				formData.append("image_file", image_file[0]);
				formData.append("basic_image",0);
			}else{
				formData.append("basic_image",2);
			}
				
		} else {
			formData.append("basic_image",1);
		}
		
		var copyright = $("input[name='copyright']:checked").val();
		formData.append("copyright", copyright);
		
		if(copyright == 1){
			var ccl_commerce = $("input[name='ccl_commerce']:checked").val();
			var ccl_change = $("input[name='ccl_change']:checked").val();
			formData.append("ccl_commerce", ccl_commerce);
			formData.append("ccl_change", ccl_change);
		}
		
		$.ajax({
			url:"/gallery/editor/registGallery.do",
			type: "POST",
			data: formData,
			processData: false,
			contentType: false,
			enctype: 'multipart/form-data',
			success:function(result) {
				
				var result=JSON.parse(result);
				
				if(result.RS == "SUCCESS") {
					COMMON.alert('성공적으로 업로드 되었습니다.','info',function(){
						location.href='/desk/gallery/list.do';
					});
				}else if(result.RS == "FAIL"){
					COMMON.alert('업로드가 실패하였습니다.\n다시 시도해주세요.','error',function(){
						return;
					});
				}
			},
			fail:function(e){
				COMMON.alert('통신 중 장애가 발생하였습니다.','error',function(){
					
				});
			}
		});
	},
	updateGallery:function(glid, state){
			
		let title = $('#gTitle').val();//갤러리 타이틀
		let kwd = $('#gKeyword').val();//키워드 해쉬
		let intro = $('#gIntro').val();//갤러리 소개

		if(title == '' || title == undefined){
			COMMON.alert('갤러리 제목을 입력해주세요.','error',function(){
				return false;
			});
			return false;
		}if(kwd == '' || kwd == undefined){
			COMMON.alert('키워드를 입력해주세요.','error',function(){
				return false;
			});
			return false;
		}if(intro == '' || intro == undefined){
			COMMON.alert('갤러리 소개 내용을 입력해주세요.','error',function(){
				return false;
			});
			return false;
		}
		if($('#main_image').attr("src") == "/assets/img/sample.png" && !$('#basicImage').is(':checked')) {
			COMMON.alert('대표 이미지를 업로드 하거나\n기본 이미지 사용을\n 체크하여 주세요.','error',function(){
				return false;
			});
			return false;
		}
		
		if(GALLERY.galleryEdit.getData() == "") {
			COMMON.alert('갤러리 설명을 입력하세요','error',function(){
				return false;
			});
			return false;
		}
		
		if($("[name=galleryShareType]:checked").val() == 'N' && $('[name="country-of-operation-edit[]"]').val().length == 0){
				alert('공유할 그룹을 선택하거나 전체공유를 선택해주세요.');				
				return false;
				
		}
		
		
		var mapBtnCheck =$("input[name='addMapBtnAdd']:checked").val();

		let formData = new FormData();
		formData.append("glid",glid);
		formData.append("editTitle",$('#gTitle').val());
		formData.append("editKeyword",GALLERY.HASH_TAG.keywords.toString());
		formData.append("editIntro",$('#gIntro').val());
		formData.append("editContent", GALLERY.galleryEdit.getData());
		formData.append("gtype","1");
		formData.append("map_btn_state",mapBtnCheck);
		formData.append("mapId",GALLERY.MAP.realMapId);
		formData.append("state",1);
		formData.append("share_type", $("[name=galleryShareType]:checked").val());
		formData.append("share_gid", ($('[name="country-of-operation-edit[]"]').val().toString()== "") ? "null" : ","+$('[name="country-of-operation-edit[]"]').val().toString()+",");
		
		if(!$('#basicImage').is(':checked')){
			var image_file = document.getElementById('mainImageFile').files;
			if(image_file[0] != null){
				formData.append("image_file", image_file[0]);
				formData.append("basic_image",0);
			}else{
				formData.append("basic_image",2);
			}
				
		} else {
			formData.append("basic_image",1);
		}
		
		var copyright = $("input[name='copyright']:checked").val();
		formData.append("copyright", copyright);
		
		if(copyright == 1){
			var ccl_commerce = $("input[name='ccl_commerce']:checked").val();
			var ccl_change = $("input[name='ccl_change']:checked").val();
			formData.append("ccl_commerce", ccl_commerce);
			formData.append("ccl_change", ccl_change);
		}

		
		$.ajax({
			url:"/gallery/updateGallery.do",
			type: "POST",
			data: formData,
			processData: false,
			contentType: false,
			enctype: 'multipart/form-data',
			success:function(result) {
				
				var result=JSON.parse(result);
				
				if(result.RS == "SUCCESS") {
					COMMON.alert('성공적으로 수정 되었습니다.','info',function(){
						location.href='/desk/gallery/list.do';
					});
				}else if(result.RS == "FAIL"){
					COMMON.alert('수정에 실패하였습니다.\n다시 시도해주세요.','error',function(){
						return;
					});
				}
			},
			fail:function(e){
				COMMON.alert('통신 중 장애가 발생하였습니다.','error',function(){
					
				});
			}
		});
	},
	appearMap : function(mapid) {
		$("#appearMap_"+mapid).css('display','block');	
		document.getElementsByTagName("body")[0].style.overflowY = "hidden";
	},
	disappearMap : function(mapid) {
		$("#appearMap_"+mapid).css('display','none');	
		document.getElementsByTagName("body")[0].style.overflowY = "auto";
	},
	moveMap : function(mapid) {
					var url = '/layer/galleryView.do?mapid='+mapid;    
					window.open(url,'mapPopupView','');  
	},
	HASH_TAG:{
		keywords:null,
		whiteList:[],
		init:function(){

			//GALLERY.HASH_TAG.whiteListInit();
			var input = document.querySelector('input[name=tags]');
			
			var tagify = new Tagify(input, {	
				//mode                : "mix",	
		        pattern             : /^#.{1,10}$/,  // Validate typed tag(s) by Regex. Here maximum chars length is defined as "20"  /^.{0,20}$/	
		        delimiters          : ",| ",        // add new tags when a comma or a space character is entered	
		        keepInvalidTags     : false,         // do not remove invalid tags (but keep them marked as invalid)	
		        //createInvalidTags: true,	
		        editTags            : {	
		        	clicks: 2,              // single click to edit a tag	
		            keepInvalid: false      // if after editing, tag is invalid, auto-revert	
		        },	
		        maxTags             : 7,	
		        blacklist           : ["foo", "bar", "baz"],//욕설 비방어 리스트 취득시 적용	
		        whitelist           : GALLERY.HASH_TAG.whiteList,
		        transformTag        : transformTag,
		        backspace           : "edit",
		        placeholder         : "*키워드는 최대 7개,각 10자까지 입력하실 수 있습니다.",
		        dropdown : {
		            enabled: 1,            // show suggestion after 1 typed character
		            fuzzySearch: false,    // match only suggestions that starts with the typed characters
		            position: 'text',      // position suggestions list next to typed text
		            caseSensitive: true,   // allow adding duplicate items if their case is different
		        },
		        templates: {
		            dropdownItemNoMatch: function(data) {
		                return `<div class='${this.settings.classNames.dropdownItem}' value="noMatch" tabindex="0" role="option">
		                    No suggestion found for: <strong>${data.value}</strong>
		                </div>`
		            }
		        }
		    })
			

			// bind "DragSort" to Tagify's main element and tell
			// it that all the items with the below "selector" are "draggable"
			var dragsort = new DragSort(tagify.DOM.scope, {
			    selector: '.'+tagify.settings.classNames.tag,
			    callbacks: {
			        dragEnd: onDragEnd
			    }
			})
			
			// must update Tagify's value according to the re-ordered nodes in the DOM
			//DOM이 새로 재정렬 되었을때 ->드래그해서
			function onDragEnd(elm){
			    tagify.updateValueByDOMTags();
			    //색상 랜덤으로 다시 바꾸기
			    let randomColor = [];
			    for(var i = 0;i<GALLERY.HASH_TAG.keywords.length;i++){
			    	randomColor.push(getRandomColor());
			    	
			    };
			    
			    for(var i = 0;i<randomColor.length;i++){
			    	$('.tagify__tag').eq(i).prop('color',randomColor[i]);
				    $('.tagify__tag').eq(i).prop('style','--tag-bg:'+randomColor[i]);
			    };
			}
			


			var clickDebounce;
			//랜덤으로 색상을 만듬
			function getRandomColor(){ 
			    function rand(min, max) {
			        return min + Math.random() * (max - min);
			    }

			    var h = rand(1, 360)|0,
			        s = rand(40, 70)|0,
			        l = rand(65, 72)|0;

			    return 'hsl(' + h + ',' + s + '%,' + l + '%)';
			}
			//플러그인 객체를 받아서 스타일을 바꿈
			function transformTag( tagData ){ //태그 스타일 변경
			    tagData.color = getRandomColor();
			    tagData.style = "--tag-bg:" + tagData.color;

			    if( tagData.value.toLowerCase() == 'shit' )
			        tagData.value = 's✲✲t'
			}
			
			tagify.on('change', function(e){
				let obj = JSON.parse(e.detail.value);
				let tempArr = [];
				for(var i=0;i<obj.length;i++){
					tempArr.push(obj[i].value);
				}
				if(tempArr.length>0){
					GALLERY.HASH_TAG.keywords = tempArr;
				}
				
			} )
			//입력값 추가될 때
			tagify.on('add', function(e){
			})
			//입력값에 문제가 발생할 때
			tagify.on('invalid', function(e){
				//$('.tagify--notAllowed').remove();
					
			    let ko_messege = '';
			    
			    if(e.detail.message === "already exists"){
			    	ko_messege = '이미 존재하는 태그입니다.';
			    }else if(e.detail.message === "empty"){
			    	ko_messege = '값이 비어 있습니다.';
			    }else if(e.detail.message === "number of tags exceeded"){
			    	ko_messege = '최대 태그 생성 갯수를 \n초과하였습니다.';
			    }else if(e.detail.message === "not allowed"){
			    	ko_messege = '허가되지 않았습니다.';
			    }else if(e.detail.message === "pattern mismatch"){	
			    	if(e.detail.data.value.length>10){	
			    		ko_messege = '10자 이내로 \n입력해주세요.';	
			    	}else if(e.detail.data.value.indexOf('#')==-1){	
			    		ko_messege = '태그 입력값은\'#\'으로 \n시작해야합니다.';	
			    	}else{	
			    		ko_messege = '유효하지않은 입력값입니다.\n다시 입력해주세요.';	
			    	}	
			    }	
				COMMON.alert(ko_messege,'error',function(){	
					return false;	
				});	
				return false;
			})
			//드랍다운 추천어 이벤트 걸리는 곳
			tagify.on('input', function(e){
			    var prefix = e.detail.prefix;
			
			    if( prefix ){
			        if( prefix == '@' )
			            tagify.whitelist = whitelist_1;
			
			        if( prefix == '#' )
			            tagify.whitelist = whitelist_2;
			
			        if( e.detail.value.length > 1 )
			            tagify.dropdown.show(e.detail.value);
			    }
			})
			$('.tagify').css('display', 'none');
		},	
		whiteListInit:function(){	
			$.ajax({	
				url:'/gallery/getRecommKeywords.do',	
				type: "POST",	
				async:false,	
				success:function(result) {	
						
					var res=JSON.parse(result);	
						
					if(res.rs == "success") {	
						GALLERY.HASH_TAG.whiteList = res.recommKeywords;	
					}else if(res.RS == "fail"){	
						COMMON.alert('통신 중,추천 검색어를 불러오는데 \n실패하였습니다.','error',function(){	
							return false;	
						});	
					}	
				},	
				fail:function(e){	
					COMMON.alert('통신 중 장애가 발생하였습니다.','error',function(){	
							
					});	
				}	
			});	
		},
		changeKeywordSelect:function(){
			var selected = $('select[name="selectbox"]').val();
			
			  switch (selected) {
			  	case '#':
			  		$('#gKeyword').val("");
			  		break;
			  	case '0':
			  		$('#gKeyword').val("#경제");
			  		break;
			  	case '1':
			  		$('#gKeyword').val("#복지");
			  		break;
			  	case '2':
			  		$('#gKeyword').val("#교통");
			  		break;
			  	case '3':
			  		$('#gKeyword').val("#기후환경");
			  		break;
			  	case '4':
			  		$('#gKeyword').val("#문화관광");
			  		break;
			  	case '5':
			  		$('#gKeyword').val("#안전");
			  		break;
			  	case '6':
			  		$('#gKeyword').val("#주택");
			  		break;
			  	case '7':
			  		$('#gKeyword').val("");
			  		$('.tagify').css('display', 'block');
			  		break;
			  }
			  if(selected != 7){
				  $('.tagify').css('display', 'none');
			  }
		}
		
	},
	MAP:{
		realMapId:0,
		initMap:function(){
			GALLERY.MAP.getUserMap();
			
			$("#userMapItems").on("click", ".map_group", function(e){GALLERY.MAP.insertMap2Editor(e)});
			$("#userMapItemsThumnail").on("click", ".map_thumnail", function(e){GALLERY.MAP.insertMapThumnail(e)});

			$("#editUserMapItems").on("click", ".map_group", function(e){GALLERY.MAP.insertMap2Editor(e)});
			$("#editUserMapItemsThumnail").on("click", ".map_thumnail", function(e){GALLERY.MAP.editMapThumnail(e)});
				
			$('.thumnail').on('mouseover',function(e){
				$(this).addClass('selected');
			});
			
			$('.thumnail').on('mouseout',function(e){
				$(this).removeClass('selected');
			});
			/*
			$("#egMainGalRegBtn").on('click',function(e){
				GALLERY.MAP.getUserMap();
				GALLERY.galleryEdit.setData("");
				$(".eg-gallery-regist input:not([type=radio])").val("");
				$(".eg-gallery-regist textarea").val("");
				$("#imageCancelBtn").click();
				$("#mapCancelBtn").click();
			});
			*/
		
		},
		showMapDropDwon:function(){
			document.getElementById("myDropdown").classList.toggle("show");
		},
		filterFunction:function(){
			var input, filter, ul, li, a, i;
			  input = document.getElementById("myInput");
			  filter = input.value.toUpperCase();
			  div = document.getElementById("myDropdown");
			  a = div.getElementsByTagName("a");
			  for (i = 0; i < a.length; i++) {
			    txtValue = a[i].textContent || a[i].innerText;
			    if (txtValue.toUpperCase().indexOf(filter) > -1) {
			      a[i].style.display = "";
			    } else {
			      a[i].style.display = "none";
			    }
			  }
		},
		insertMap2Editor:function(e){
			
			let tempScript = GALLERY.galleryEdit.getData();
			let mapId = e.target.id;
			let source = e.target.src;
			if(source === null && source ===''){
				COMMON.alert('해당 지도의 url이 \n확인되지 않습니다.','error',function(){
					
				})
				return false;
			}
			
			let thumbImg ='<img id=\"'+mapId+'\" src=\"'+source+'\" style="width:30%">';
			
			tempScript+=thumbImg;
			GALLERY.galleryEdit.setData(tempScript);
		},
		insertMapThumnail:function(e){
			let mapId = e.target.id;
				
			let mapName = e.target.alt;
			
			GALLERY.MAP.realMapId = mapId.slice(6);
			
			let source = e.target.src;
			if(source === null && source ===''){
				COMMON.alert('해당 지도의 url이 \n확인되지 않습니다.','error',function(){
					
				})
				return false;
			}
			
			$("#mapUpload").html('선택된 지도 : '+mapName);
			$("#mapUpload").append('&nbsp&nbsp<span id="mapCancelBtn"><i class="fa fa-times-circle" aria-hidden="true"></i></span>');
			
			$("input:radio[id='addMapBtnAdd']").prop("disabled", false);
			$("input:radio[id='addMapBtnAdd']").prop("checked", true);
			
			
			let mapCancelBtn = document.querySelector("#mapCancelBtn");
				mapCancelBtn.onclick = function() {
				$("#mapUpload").html('선택된 지도 : 없음');
				GALLERY.MAP.realMapId = 0;
				
				$("input:radio[id='addMapBtnAdd']").prop("disabled", true);
				$("input:radio[id='addMapBtnCheck']").prop("checked", true);
			}
		},
		editMapThumnail:function(e){
			let mapId = e.target.id;
			
			let mapName = e.target.alt;
			
			GALLERY.MAP.realMapId = mapId.slice(6);
			
			let source = e.target.src;
			if(source === null && source ===''){
				COMMON.alert('해당 지도의 url이 \n확인되지 않습니다.','error',function(){
					
				})
				return false;
			}
			
			$("#edit_mapUpload").html('선택된 지도 : '+mapName);
			$("#edit_mapUpload").append('&nbsp&nbsp<span id="mapCancelBtn"><i class="fa fa-times-circle" aria-hidden="true"></i></span>');
			
			$("input:radio[id='addMapBtnUpAdd']").prop("disabled", false);
			$("input:radio[id='addMapBtnUpAdd']").prop("checked", true);
			
			let mapCancelBtn = document.querySelector("#mapCancelBtn");
				mapCancelBtn.onclick = function() {
				$("#edit_mapUpload").html('선택된 지도 : 없음');
				GALLERY.MAP.realMapId = 0;
				
				$("input:radio[id='addMapBtnUpAdd']").prop("disabled", true);
				$("input:radio[id='addMapBtnUpNo']").prop("checked", true);
			}
		},
		getUserMap:function(){
			$.ajax({
				url:"/gallery/editor/getUserMap.do",
				type:'POST',
				dataType:'json',
				async:false,
				success:function(result) {
					
					let html = '';
					
					let html_thumnail = '';
					
					$(".eg-thumb-box").html('<img id="main_image" src="/assets/img/sample.png"/>');
					$('#userMapItems').val('');
					$('#userMapItemsThumnail').val('');
					$('#editUserMapItems').val('');
					$('#editUserMapItemsThumnail').val('');
					
					if(result.RS === 'SUCCESS' ){
						
						for(var i = 0; i<result.memMapList.length;i++){
							html+='<div class="col-4 mb-4">';
							html+='<div class="thumnail p-1">';
							html+='<img id="mapId_'+result.memMapList[i].mapid+'" style="width: 120px;" class="map_group" src="'+result.memMapList[i].thumb_url+'" alt="'+result.memMapList[i].map_name+'">';
							html+='<h6>'+result.memMapList[i].map_name+'</h6>';
							html+='</div>';
							html+='</div>';
							
							html_thumnail+='<div class="col-4 mb-4">';
							html_thumnail+='<div class="thumnail p-1">';
							html_thumnail+='<img id="mapId_'+result.memMapList[i].mapid+'" style="width: 120px;" class="map_thumnail" src="'+result.memMapList[i].thumb_url+'" alt="'+result.memMapList[i].map_name+'">';
							html_thumnail+='<h6>'+result.memMapList[i].map_name+'</h6>';
							html_thumnail+='</div>';
							html_thumnail+='</div>';
						}					
					}else if(result.RS === 'NoMapData'){
						html+='<div class="col-6">';
						html+='<div class="p-1">';
						html+='<span>사용자의 지도 데이터가 없습니다.</span>';
						html+='</div>';
						html+='</div>';
						
						html_thumnail = html;
						
					}else if(result.RS == 'FAIL'){
						html+='<div class="col-6">';
						html+='<div class="p-1">';
						html+='<span>통신 중 장애가 발생하였습니다.</span>';
						html+='</div>';
						html+='</div>';
						
						html_thumnail = html;
						
						COMMON.alert('통신중 문제가 발생하였습니다.','error',function(){
						
						})
					}
					$('#userMapItems').html(html);
					$('#userMapItemsThumnail').html(html_thumnail);
					$('#editUserMapItems').html(html);
					$('#editUserMapItemsThumnail').html(html_thumnail);
					
				},
				fail:function(err){
					
				}
			});
		}
	},
	THUMB:{
		readURL : function(input) {
			 if (input.files[0].type != 'image/jpeg' && input.files[0].type != 'image/png'){
				 COMMON.alert('이미지 파일만\n 업로드가 가능합니다.','error',function(){
				
					})
					return false;
			 }
		
			if (input.files[0].size > (1024 * 1024)){
				 COMMON.alert('1MB 이하의 파일만 \n업로드가 가능합니다.','error',function(){
				
					})
					return false;
			 }else {
				var size = Math.floor(input.files[0].size / 1024);
				$("#imageSize").empty();
				$("#imageSize").append(size+'KB');
			 }
		
			 if (input.files && input.files[0]) {
			    var reader = new FileReader();
			   
			    reader.onload = function(e) {
			     //document.getElementById('preview').src = e.target.result;
	
				let thumbImg ='<img id="main_image" src=\"'+e.target.result+'\">';
			
				$("#thumb_box").empty();
				$("#thumb_box").append(thumbImg);
				$("#imageName").empty();
				$("#imageName").append(input.files[0].name);
				$("#imageName").append('&nbsp&nbsp<span id="imageCancelBtn"><i class="fa fa-times-circle" aria-hidden="true"></i></span>');
				
				$("input:checkbox[id='basicImage']").prop("checked", false);
				$("input:checkbox[id='basicImage']").prop("disabled", true);
				
				let imageCancelBtn = document.querySelector("#imageCancelBtn");
					imageCancelBtn.onclick = function() {
						$("#imageName").html('');
						$("#imageSize").html('');
						$("#thumb_box").html('<img id="main_image" src="/assets/img/sample.png"/>');
						$("input:checkbox[id='basicImage']").prop("disabled", false);
						$("input:checkbox[id='basicImage']").prop("checked", true);
				}
			   };
			   reader.readAsDataURL(input.files[0]);
			 }
		},
		readURL_edit : function(input) {
			 if (input.files[0].type != 'image/jpeg' && input.files[0].type != 'image/png'){
				 COMMON.alert('이미지 파일만\n 업로드가 가능합니다.','error',function(){
				
					})
					return false;
			 }
			 if (input.files[0].size > (1024 * 1024)){
				 COMMON.alert('1MB 이하의 파일만 \n업로드가 가능합니다.','error',function(){
				
					})
					return false;
			 }else {
				var size = Math.floor(input.files[0].size / 1024);
				$("#edit_imageSize").empty();
				$("#edit_imageSize").append(size+'KB');
			 }
			 if (input.files && input.files[0]) {
			    var reader = new FileReader();
			   
			    reader.onload = function(e) {
			     //document.getElementById('preview').src = e.target.result;
	
				let thumbImg ='<img id="main_image" src=\"'+e.target.result+'\">';
			
				$("#edit_thumb_box").empty();
				$("#edit_thumb_box").append(thumbImg);
				$("#edit_imageName").empty();
				$("#edit_imageName").append(input.files[0].name);
				$("#edit_imageName").append('&nbsp&nbsp<span id="imageCancelBtn"><i class="fa fa-times-circle" aria-hidden="true"></i></span>');
				
				$("input:checkbox[id='edit_basicImage']").prop("checked", false);
				$("input:checkbox[id='edit_basicImage']").prop("disabled", true);
				
				let imageCancelBtn = document.querySelector("#imageCancelBtn");
					imageCancelBtn.onclick = function() {
						$("#edit_imageName").html('');
						$("#edit_imageSize").html('');
						$("#edit_thumb_box").html('<img id="main_image" src="/assets/img/sample.png"/>');
						$("input:checkbox[id='edit_basicImage']").prop("disabled", false);
						$("input:checkbox[id='edit_basicImage']").prop("checked", true);
				}
			   };
			   reader.readAsDataURL(input.files[0]);
			 }
		}
			
	},
	BUTTON:{
		index:0,
		btnTextChange:function(){
			const btnElement = document.getElementById('btnPreview');
	  		btnElement.innerText = $("#btn_text").val();
		},
		btnTextColorChange:function(){
			const btnElement = document.getElementById('btnPreview');
	  		btnElement.style.color = $("#btn_textColor").val();
		},
		btnColorChange:function(){
			const btnElement = document.getElementById('btnPreview');
	  		btnElement.style.background = $("#btn_btnColor").val();
		},
		btnLinkChange:function(){
			const btnElement = document.getElementById('btnPreview');
	  		var url = $("#btn_link").val();
	  		btnElement.setAttribute("onclick","window.open(\""+url+"\");");
		},
		addBtnToEditor:function(){
			var btnElement = document.getElementById('btnPreview');
			btnElement.id = "mybtn_"+GALLERY.BUTTON.index;
			GALLERY.BUTTON.index++;
			var html = btnElement.outerHTML;
			
			let tempScript = GALLERY.galleryEdit.getData();
			
			GALLERY.galleryEdit.setData(tempScript+html);
			
			// 초기화
			btnElement.id ="btnPreview";
			GALLERY.BUTTON.resetAddBtn();
			
		},
		resetAddBtn:function(){
			$('.dropdown-menu').removeClass('show');
			
			const btnElement = document.getElementById('btnPreview');
			// 초기화
			btnElement.innerText = '';
			btnElement.style.color = '#ffffff';
			btnElement.style.background = '#24abf2';
			if(!btnElement.classList.contains('rounded-pill')){
				btnElement.classList.add('rounded-pill');
			}
			btnElement.setAttribute("onclick","");
			
			$("#btn_text").val('');
			$("#btn_textColor").val('#ffffff');
			$("#btn_btnColor").val('#24abf2');
			$("input[id=btn_round]").prop("checked", true);
			$("#btn_link").val('');
		}
	}
	
}