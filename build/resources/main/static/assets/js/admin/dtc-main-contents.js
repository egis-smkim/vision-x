/**
 * 
 */
var SLIDE_CONTENTS = {
	editor:null,
	dataTable:0,
	init:function() {
		
		SLIDE_CONTENTS.dataTable = $('#contentsList').DataTable( {
				"columns": [
	    		    { "width": "5%"},
	    		    { "width": "15%"},
	    		    { "width": "5%"},
	    		  ],
		        "order": [[ 0, 'desc' ]]
		} );
		
		new PerfectScrollbar(document.getElementById('popupDiv'));
		
		$('#popupDiv').on('scroll touchmove mousewheel', e=> {
		   e.preventDefault();
		   e.stopPropagation();
		});

	},
	add:function() {
		$('#title').html('컨텐츠 추가');
		
		$('input[id=slide_name]').val('');
		$('textarea[id=slide_info]').val('');
		$('input[id=slide_eng_name]').val('');
		$('textarea[id=slide_eng_info]').val('');
		$('input[id=slide_img]').val('');
		$('input[id=slide_btn_name]').val('');
		$('input[id=slide_eng_btn_name]').val('');
		$('input[id=slide_btn_url]').val('');
		$('input[id=slide_start]').val('');
		$('input[id=slide_end]').val('');
		
		$("#slide_no").prop('checked', true);
		$("#slide_yes").prop('checked', false); 
		
		$('#preview').attr('src','');
		$('#slide_img').css('display','block');
		$('#slide_img_name').css('display','none');
		$('#deleteBtn').css('display','none');
		$('#editBtn').css('display','none');
		$('#addBtn').css('display','block');
		$('#popupDiv').css('display','block');
		
		
		$('input[id=slide_start]').val('');
		$('input[id=slide_end]').val('');
		
		//$('#title').val() = "팝업 추가";
	},
	popEndDate:function(){
		document.getElementById("slide_end").setAttribute("min", $('input[id=slide_start]').val());
	},
	popStartDate:function(){
		document.getElementById("slide_start").setAttribute("max", $('input[id=slide_end]').val());
	},
	insert:function() {
		
		if($("#slide_name").val() == "") {
				COMMON.alert("컨텐츠 명을 입력하세요.","info",function(){$("#slide_name").focus();});
				return false;
		}
		
		if($("#slide_info").val() == "") {
				COMMON.alert("컨텐츠 소개를 입력하세요.","info",function(){$("#slide_info").focus();});
				return false;
		}
		
		if(document.getElementById('slide_img').files.length == 0) {
				COMMON.alert("배경이미지를 선택하세요.","info",function(){$("#slide_img").focus();});
				return false;
		}
		
		if(($("#slide_btn_name").val() != "" && $("#slide_btn_url").val() == "")) {
				COMMON.alert("버튼 url을 입력하세요.","info",function(){$("#slide_btn_url").focus();});
				return false;
		}
		
		if ($('#newSlideContent').length) {
			$('#newSlideContent').remove();
		} 
		
		var newDiv = document.createElement('div');
		newDiv.id = 'newSlideContent';
		newDiv.style.display = 'none';
		newDiv.style.width = 'max-content';
		document.body.appendChild(newDiv);
			
		var formData = new FormData();
		var slide_name = $("#slide_name").val();	
		var slide_info = $("#slide_info").val();	
		var slide_btn_name = $("#slide_btn_name").val();	
		var slide_btn_url = $("#slide_btn_url").val();
		
		var slide_eng_name = $("#slide_eng_name").val();	
		var slide_eng_info = $("#slide_eng_info").val();
		var slide_eng_btn_name = $("#slide_eng_btn_name").val();		
		
		var slide_img = document.getElementById('slide_img').files;
		
		var slide_yn = $('input[name=slide_use]:checked').val();
		var slide_start = $('input[id=slide_start]').val();
		var slide_end = $('input[id=slide_end]').val();
	
		
		if(slide_start == ''){
			formData.append("slide_start", '0');
		}
		else {
			formData.append("slide_start", slide_start);
		}
		
		if(slide_end == ''){
			formData.append("slide_end", '0');
		}
		else {
			formData.append("slide_end", slide_end);
		}
		
		if(slide_btn_name != ''){
			formData.append("slide_btn_name", slide_btn_name);
			formData.append("slide_btn_url", slide_btn_url);	
		}
		
		formData.append("slide_name", slide_name);
		formData.append("slide_yn", slide_yn);
		formData.append("slide_info", slide_info);
		formData.append("slide_img", slide_img[0]);
		
		if(slide_eng_name != '') formData.append("slide_eng_name", slide_eng_name);
		if(slide_eng_info != '') formData.append("slide_eng_info", slide_eng_info);
		if(slide_eng_btn_name != '') formData.append("slide_eng_btn_name", slide_eng_btn_name);
		
		formData.append("slide_yn", slide_yn);
		
		$.ajax({
			url:"/admin/home/contents/insert.do",
			type: "POST",
			data: formData,
			processData: false,
			contentType: false,
			enctype: 'multipart/form-data',
			success:function(result) {
				var result=JSON.parse(result);
				if(result.rs == "complete") {
					COMMON.alert("슬라이드 컨텐츠가 등록되었습니다.","success",function(){
						window.location.reload();
					});
				}else if(result.rs == "fail") {
					COMMON.alert("슬라이드 컨텐츠 등록에 실패하였습니다.","error",function(){return false;});
				}
			}
		});
	},
	manage:function(scid) {
		$('#title').html('컨텐츠 관리');
		
		var formData = new FormData();
		
		formData.append("scid", scid);
		
		$.ajax({
			url:"/admin/home/contents/manage.do",
			type: "POST",
			data: formData,
			processData: false,
			contentType: false,
			enctype: 'multipart/form-data',
			success:function(result) {
				var result=JSON.parse(result);
				if(result.rs == "complete") {
					$('input[id=slide_name]').val(result.slideContentsVO.name);
					$('textarea[id=slide_info]').val(result.slideContentsVO.info);
					$('input[id=slide_btn_name]').val(result.slideContentsVO.btn_name);
					$('input[id=slide_btn_url]').val(result.slideContentsVO.btn_url);
					$('input[id=slide_eng_name]').val(result.slideContentsVO.eng_name);
					$('textarea[id=slide_eng_info]').val(result.slideContentsVO.eng_info);
					$('input[id=slide_eng_btn_name]').val(result.slideContentsVO.eng_btn_name);
					
					$('input[id=slide_img_name]').val(result.slideContentsVO.img_org_name + " (클릭시 배경 이미지 수정)");
					$('#preview').attr("src",result.slideContentsVO.img_url);
				
					if((result.slideContentsVO.use_yn) == 'Y'){
						$("#slide_no").prop('checked', false);
						$("#slide_yes").prop('checked', true); 
					} else {
						$("#slide_yes").prop('checked', false);
						$("#slide_no").prop('checked', true); 
					}
					
					$('input[id=slide_start]').val(result.slideContentsVO.start);
					$('input[id=slide_end]').val(result.slideContentsVO.end);
						
					let editBtn = document.querySelector("#editBtn");
					editBtn.onclick = function() {
						SLIDE_CONTENTS.update(scid);
					}
					
					let deleteBtn = document.querySelector("#deleteBtn");
					deleteBtn.onclick = function() {
						SLIDE_CONTENTS.delete(scid);
					}
					
					$('#slide_img').css('display','none');
					$('#slide_img_name').css('display','block');
					$('#deleteBtn').css('display','block');
					$('#editBtn').css('display','block');
					$('#addBtn').css('display','none');
					
					
					
					$('#popupDiv').css('display','block');
				}
			}
		});
	
	},
	update:function(scid) {
		
		if($("#slide_name").val() == "") {
				COMMON.alert("컨텐츠 명을 입력하세요.","info",function(){$("#slide_name").focus();});
				return false;
		}
		
		if($("#slide_info").val() == "") {
				COMMON.alert("컨텐츠 소개를 입력하세요.","info",function(){$("#slide_info").focus();});
				return false;
		}
		
		if(document.getElementById('slide_img').files.length == 0 && $("#slide_img_name").css("display") == "none") {
				COMMON.alert("배경이미지를 선택하세요.","info",function(){$("#slide_img").focus();});
				return false;
		}
		
		if(($("#slide_btn_name").val() != "" && $("#slide_btn_url").val() == "")) {
				COMMON.alert("버튼 url을 입력하세요.","info",function(){$("#slide_btn_url").focus();});
				return false;
		}
		
		if ($('#newSlideContent').length) {
			$('#newSlideContent').remove();
		} 
		
		var newDiv = document.createElement('div');
		newDiv.id = 'newSlideContent';
		newDiv.style.display = 'none';
		newDiv.style.width = 'max-content';
		document.body.appendChild(newDiv);

		var slide_name = $("#slide_name").val();	
		var slide_info = $("#slide_info").val();	
		var slide_btn_name = $("#slide_btn_name").val();	
		var slide_btn_url = $("#slide_btn_url").val();
		
		var slide_eng_name = $("#slide_eng_name").val();	
		var slide_eng_info = $("#slide_eng_info").val();
		var slide_eng_btn_name = $("#slide_eng_btn_name").val();	
		
		var slide_img = document.getElementById('slide_img').files;
		
		var slide_yn = $('input[name=slide_use]:checked').val();
		var slide_start = $('input[id=slide_start]').val();
		var slide_end = $('input[id=slide_end]').val();
		
		var formData = new FormData();
		
		if(slide_start == ''){
			formData.append("slide_start", '0');
		}
		else {
			formData.append("slide_start", slide_start);
		}
		
		if(slide_end == ''){
			formData.append("slide_end", '0');
		}
		else {
			formData.append("slide_end", slide_end);
		}
		
		if(slide_btn_name != ''){
			formData.append("slide_btn_name", slide_btn_name);
			formData.append("slide_btn_url", slide_btn_url);	
		} 
		
		formData.append("scid", scid);
		formData.append("slide_name", slide_name);
		formData.append("slide_yn", slide_yn);
		formData.append("slide_info", slide_info);
		
		if(slide_eng_name != '') formData.append("slide_eng_name", slide_eng_name);
		if(slide_eng_info != '') formData.append("slide_eng_info", slide_eng_info);
		if(slide_eng_btn_name != '') formData.append("slide_eng_btn_name", slide_eng_btn_name);
		
		if($("#slide_img_name").css("display") == "none"){
			formData.append("slide_img", slide_img[0]);
		}
			
		
		
		$.ajax({
			url:"/admin/home/contents/update.do",
			type: "POST",
			data: formData,
			processData: false,
			contentType: false,
			enctype: 'multipart/form-data',
			success:function(result) {
				var result=JSON.parse(result);
				if(result.rs == "complete") {
					COMMON.alert("컨텐츠가 수정되었습니다.","success",function(){
						window.location.reload();
					});
				}else if(result.rs == "fail") {
					COMMON.alert("컨텐츠 수정에 실패하였습니다.","error",function(){return false;});
				}
			}
		});
		
	},
	delete:function(scid) {
		COMMON.confirm("<span style='color: #595959;'>컨텐츠를 삭제하시겠습니까?<span>","삭제 후 복구할 수 없습니다.","info",
		function(){
			var formData = new FormData();
			
			formData.append("scid", scid);
			
			$.ajax({
				url:"/admin/home/contents/delete.do",
				type: "POST",
				data: formData,
				processData: false,
				contentType: false,
				enctype: 'multipart/form-data',
				success:function(result) {
					var result=JSON.parse(result);
					if(result.rs == "complete") {
						COMMON.alert("컨텐츠가 삭제되었습니다.","success",function(){
							window.location.reload();
						});
					}else if(result.rs == "fail") {
						COMMON.alert("컨텐츠 삭제에 실패하였습니다.","error",function(){return false;});
					}
				}
			});
		});
		
	},
	readURL:function(input) {
	  if (input.files && input.files[0]) {
	    var reader = new FileReader();
	    reader.onload = function(e) {
	      document.getElementById('preview').src = e.target.result;
	    };
	    reader.readAsDataURL(input.files[0]);
	  } else {
	    document.getElementById('preview').src = "";
	  }
	},
	editImg:function(){
		$('#slide_img_name').css('display','none');
		$('#slide_img').css('display','block');
		
		$('#preview').attr("src","");
		$('#slide_img').click();
		
	},
	swiperListModal:function(){
		//new PerfectScrollbar(document.getElementsByClassName('modal-body')[0]);
		$("#swiperListModal").modal({backdrop:'static'});
		$.ajax({
			url:"/admin/home/contents/swiperListModal.do",
			type: "POST",
			success:function(result) {
				var result=JSON.parse(result);

				var html = "";
				if(result.rs == "complete"){
					var swiperList = result.swiperList;

					for(var i=0;i<swiperList.length;i++){
						var value = i+1;
						var contents = swiperList[i];
						html += "<tr id=\"scid_"+contents.scid+"\" value="+value+">";
						html += "<td class=\"index\">"+value+"</td>";
						html += "<td>"+contents.name+"</td>";
						html += "<td class='nosortable' style='cursor:pointer;' onclick='javascrpt:SLIDE_CONTENTS.upSwiperList(this);'><i class=\"fas fa-chevron-up\"></i></i></td>";
						html += "<td class='nosortable' style='cursor:pointer;' onclick='javascrpt:SLIDE_CONTENTS.downSwiperList(this);'><i class=\"fas fa-chevron-down\"></i></td>";
						html += "</tr>";
					}
				}
				$("#swiperList tbody").html(html);
				
				 $("#swiperList tbody").sortable({
				    axis: 'y',
					scroll: true, 
					cancel : '.nosortable',
					helper: function(event, ui) {
				    ui.children().each(function() {
				        $(this).width($(this).width());
				    });
				    return ui;
					},
				   start:function(event,ui){
				   	// 드래그 시작 시 호출
				   },
				   update:function(event,ui){
				     // 드래그 종료 시 호출
						SLIDE_CONTENTS.setSwiperIndex();
				   }
				 });
			}
		});

	},
	setSwiperIndex:function(){
	   $("#swiperList tbody tr").each(function(i) {
	 	$(this).attr("value",i + 1);
		var a = document.getElementsByClassName('index')[i];
		a.innerText = (i+1);
	  });
	},
	upSwiperList:function(e){
		 var $tr = $(e).parent();
		$tr.prev().before($tr);
		SLIDE_CONTENTS.setSwiperIndex();
	},
	downSwiperList:function(e){
		 var $tr = $(e).parent();
		$tr.next().after($tr);
		SLIDE_CONTENTS.setSwiperIndex();
	},
	swiperIndexSave:function(){
		$("#swiperList tbody tr").each(function(i) {
		 	var id = $(this).attr('id');
			var scid_array = id.split("_");
			var scid = scid_array[1];
			var index = document.getElementsByClassName('index')[i].innerText;
			
			var formData = new FormData();

			formData.append("scid", scid);
			formData.append("index", index);
			
			$.ajax({
				url:"/admin/home/contents/swiperIndexSave.do",
				type: "POST",
				async: false,
				data: formData,
				processData: false,
				contentType: false,
				enctype: 'multipart/form-data',
				success:function(result) {
					var result=JSON.parse(result);

					
				}
			});
			
			
		  });
			alert("순서가 변경 되었습니다.");
	}

}