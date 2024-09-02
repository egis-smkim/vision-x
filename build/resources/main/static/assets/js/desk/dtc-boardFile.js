var BOARD_FILE = {
	init:function() {
 		
	},
	getFileList:function(bid){
		
		var formData = new FormData();
		formData.append("bid", bid);

		
		$.ajax({
			url : "/desk/board/getFileList.do",
			type: "POST",
			data: formData,
			processData: false,
			contentType: false,
			enctype: 'multipart/form-data',
			success:function(result) {
				
				var result=JSON.parse(result);
				
				console.log(result);
				$("#boardFile").empty();

				$.each(result.boardFileList, function(index, element) {
				var str="";
				if(element.file_type == 'jpg' || element.file_type == 'png' || element.file_type == 'jpeg' || element.file_type == 'gif') {
					str=str +'<div style="display: inline-flex; " id="file'+ element.fid +'">'
							+'<div style="padding: 10px; margin: 10px; border: 1px solid lightgrey; text-align:center; width:120px; height:150px;">'	
							+'<div style="font-size:12px; text-align:center; overflow:hidden; width:100px; height:20px;">'+ element.org_file_name +'</div>'
							+'<img src="'+element.save_file_path+'" style="width:100px; height:auto; vertical-align: middle; cursor: pointer;"/>'
							+'<div style ="text-align:center;"><a href="JavaScript:BOARD_FILE.deleteFile('+element.fid+');">삭제</a></div>'
							+'</div></div>';
				} else{

					str=str +'<div style="display: inline-flex; " id="file'+ element.fid +'">'
							+'<div style="padding: 10px; margin: 10px; border: 1px solid lightgrey; text-align:center; width: 120px; height:155px;">'	
							+'<div style="font-size:12px; text-align:center; overflow:hidden; width:100px; height:20px;">'+ element.org_file_name +'</div>'
							+'<img src="https://w7.pngwing.com/pngs/444/283/png-transparent-computer-icons-email-attachment-cosmic-miscellaneous-text-trademark.png" style="width:auto; height:100px; vertical-align: middle; cursor: pointer;"/>'
							+'<div style ="text-align:center;"><a href="JavaScript:BOARD_FILE.deleteFile('+element.fid+');">삭제</a></div>'
							+'</div></div>';
				}
			    $('#boardFile').append(str);


				});	
				
			}//success
		});	//ajax
	},
 
	deleteFile:function(fid) {
		
		$('#file' + fid).remove();
		filesNum--;
		old_files.push(fid);
		
		if(filesNum == 0){
			$('#boardFile').css("height","");
		}
			
	}
 

}

