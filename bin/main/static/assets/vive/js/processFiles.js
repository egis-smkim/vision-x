var PROC = {
    global:{
        shpCheck:false,
        modelCheck:false,
        interval:null,
        layerKey:0,
        projSearchModal:function(){
            if($("#prjListBody tr").length == 0){
                var html="";

                $.ajax({
                    url:'../ide/getProjectionInfo.do',
                    type:'GET',
                    dataType:'json',
                    success:function(result){
                        
                        var list = result.PROJ;
                        
                        for(var i=0;i<list.length;i++){
                            html +="<tr>\n";
                            html +="    <td><a href=\"javascript:PROC.global.setProjection("+list[i].srid+");\"> EPSG:"+list[i].srid+"</a></td>\n"
                            html +="    <td>"+list[i].crs_name+"</td>\n";
                            html +="</tr>\n"
                        }  
                        
                        $("#prjListBody").append(html);

                        $("#projSearchModal").modal();

                        new PerfectScrollbar(document.getElementById('prjTableDiv'), {
                            suppressScrollX: true
                    });
    

                    }
                });
                
                $("#prjSearhBtn").on('click',function(e){

                    if(!$("#prjSearchInput").val()){
                        COMMON.alert('코드번호를 입력해주세요','warning',function(){
                            return false;
                        })

                        $("#prjSearchInput").focus();

                        return false;
                    }

                    PROC.global.searchPrjInfo();
                })

                $("#prjSearchInput").on('keyup',function(e){

                    if(e.keyCode==13){

                        if(!$("#prjSearchInput").val()){
                            COMMON.alert('코드번호를 입력해주세요','warning',function(){
                                return false;
                            })
    
                            $("#prjSearchInput").focus();
                            
                            return false;
                        }

                        PROC.global.searchPrjInfo();
                    }   

                });

                $("#prjResetBtn").on('click',function(e){
                    
                    PROC.global.resetPrj();

                });

            }else{
                $("#projSearchModal").modal();
                
            }
        },
        setProjection:function(srid){

            $("#procFacProj").val("EPSG:"+srid);
            PROC.global.resetPrj();
            
            $("#projSearchModal").modal("hide");
        },
        resetPrj:function(){
            $("#prjListBodyAll").empty();
            $("#projTableAll").hide();
            $("#projTableKo").show();
            $("#prjSearchInput").val('');
        },
        searchPrjInfo:function(){
            
            var keyword = $("#prjSearchInput").val();
            var data={
                keyword:keyword
            }

            $("#projTableKo").hide();
            $("#prjListBodyAll").empty();

            $.ajax({
                url:'../ide/searchPrjInfo.do',
                type:'POST',
                data:data,
                dataType:'json',
                success:function(result){
                    
                    var html="";

                    if(result.PROJ.length != 0){
                        
                        for(var i=0;i<result.PROJ.length;i++){
                            html +="<tr>\n";
                            html +="    <td><a href=\"javascript:PROC.global.setProjection("+result.PROJ[i].srid+");\"> EPSG:"+result.PROJ[i].srid+"</a></td>\n"
                            html +="    <td>"+result.PROJ[i].crs_name+"</td>\n";
                            html +="</tr>\n"
                        }

                    }else{
                        html+="<tr>\n";
                        html+="     <td colspan=2>검색된 결과가 없습니다.</td>\n";
                        html+="</tr>\n";
                    }
                    $("#prjListBodyAll").append(html);
                    $("#projTableAll").show();
                }
            });
        }
    },
    checkShpFiles:function(obj){
        
        var shps = obj.files;
        var fileTypes=[];
        for(var i=0;i<shps.length;i++){
            
            var fileName = shps[i].name;
            
            var fileLength = fileName.length;
            var fileExt = fileName.lastIndexOf(".");

            var fileType = fileName.substring(fileExt+1,fileLength).toLowerCase();
            fileTypes.push(fileType);
        }
        
        var needs=[];
        if(fileTypes.indexOf('shp') != -1){
            var sIndx = fileTypes.indexOf('shp');
            fileTypes.splice(sIndx,1);
        }else{
            needs.push('shp');
        }

        if(fileTypes.indexOf('dbf') != -1){
            var dIndx = fileTypes.indexOf('dbf');
            fileTypes.splice(dIndx,1);
        }else{
            needs.push('dbf');
        }

        if(fileTypes.indexOf('prj') != -1){
            var pIndx = fileTypes.indexOf('prj');
            fileTypes.splice(pIndx,1);
        }else{
            needs.push('prj');
        }

        if(fileTypes.indexOf('shx') != -1){
            var shIndx = fileTypes.indexOf('shx');
            fileTypes.splice(shIndx,1);
        }else{
            needs.push('shx');
        }

        if(needs.length!=0){
            var str = needs.toString();

            $("#shpUploadFiles").val("");
            alert(str+"을 올려주세요.");

            return false;
        }else{
            PROC.getShpInfo(shps);
        }

    },
    check3dsFiles:function(obj){
        
        var modelFiles = obj.files;
        var validFiles = [];
        //img,3ds만
        for(var i=0;i<modelFiles.length;i++){
            
            var fileName = modelFiles[i].name;
            
            var fileLength = fileName.length;
            var fileExt = fileName.lastIndexOf(".");

            var fileType = fileName.substring(fileExt+1,fileLength).toLowerCase();

            if(fileType !='3ds' && fileType !='jpg' && fileType !='png'){
                $("#modelUploadFiles").val("");
                alert(fileType+'은 업로드 할 수 없는 파일입니다.');
                break;
            }

            validFiles.push(modelFiles[i]);
        }

        PROC.uploadModelData(validFiles);
    },
    uploadModelData:function(files){
        
        var formData = new FormData();
        formData.append("keyIndx",PROC.global.layerKey);
        
        for (var i = 0; i < files.length; i++) {
            formData.append("modelFiles", files[i]);
        }

        formData.append("layerName",$("#fac_vive_build").val());
        formData.append("keyIndx",PROC.global.layerKey);

        $('#modelUploadUi').block({
            message: '<div class="progress"><div class="progress-bar" id="proc3dsPrgss" style="width: 0%;">0%</div></div>',
            css: {
              backgroundColor: 'transparent',
              border: '0'
            },
            overlayCSS:  {
              backgroundColor: '#d1d7e3',
              opacity: 0.8
            }
        });

        $("#shpUploadFiles").prop("disabled",true);

        $.ajax({
            url:'/model_vive/uploadModels.do',
            type:'POST',
            data:formData,
            dataType:'json',
            processData: false,
            contentType: false,
            enctype: "multipart/form-data",
            xhr: function() { //XMLHttpRequest 재정의 가능
                var xhr = $.ajaxSettings.xhr();
                xhr.upload.onprogress = function(e) { //progress 이벤트 리스너 추가
                    var percent = e.loaded * 100 / e.total;
                    
                    percent = parseFloat(percent).toFixed(0);

                    $("#proc3dsPrgss").css('width',percent+'%');
                    $("#proc3dsPrgss").text(percent+'%');
                };
                return xhr;
            },    
            success:function(result){
                
                if(result.STATUS==200){
                    PROC.global.modelCheck=true;
                    PROC.global.layerKey=result.keyIndx;

                    if(PROC.global.modelCheck && PROC.global.shpCheck){
                        $("#proExcuteBtn").removeClass('disabled');
                    }

                    setTimeout(function(){
                        $("#shpUploadFiles").prop("disabled",false);
                        $('#modelUploadUi').unblock();
                    },1000)
                }
            }
        })
    },
    validation:function(){

    },
    getShpInfo:function(files){
        
        var formData = new FormData();
        for (var i = 0; i < files.length; i++) {
            formData.append("shpFiles", files[i]);
        }

        formData.append("layerName",$("#fac_vive_build").val());
        formData.append("keyIndx",PROC.global.layerKey);

        $('#shpUploadUi').block({
            message: '<div class="progress"><div class="progress-bar" id="procShpPrgss" style="width: 0%;">0%</div></div>',
            css: {
              backgroundColor: 'transparent',
              border: '0'
            },
            overlayCSS:  {
              backgroundColor: '#d1d7e3',
              opacity: 0.8
            }
        });

        $("#modelUploadFiles").prop("disabled",true);

        $.ajax({
            url:'/model_vive/getShpInfo.do',
            type:'POST',
            data:formData,
            dataType:'json',
            processData: false,
            contentType: false,
            enctype: "multipart/form-data",
            xhr: function() { //XMLHttpRequest 재정의 가능
                var xhr = $.ajaxSettings.xhr();
                xhr.upload.onprogress = function(e) { //progress 이벤트 리스너 추가
               
                    var percent = e.loaded * 100 / e.total;
                    
                    percent = parseFloat(percent).toFixed(0);

                    $("#procShpPrgss").css('width',percent+'%');
                    $("#procShpPrgss").text(percent+'%');

                };
                return xhr;
            },    
            success:function(result){
                //좌표계
                //인코딩 EUC-KR 디폴트
                //dbf 헤더 리스트
                if(result.STATUS==200){

                    PROC.global.shpCheck=true;
                    
                    if(PROC.global.modelCheck && PROC.global.shpCheck){
                        $("#proExcuteBtn").removeClass('disabled');
                    }

                    PROC.global.layerKey=result.SHP_INFO.layerKey;
                    
                    var epsg = result.SHP_INFO.EPSG;
                    
                    if(epsg != 0){
                        var epsgCode = 'EPSG:'+epsg;
                        $("#procFacProj").val(epsgCode);
                    }

                    var dbfHeaders = result.SHP_INFO.LIST[0];
                    var html="<option value=\"N/A\">선 택</option>";
                    for(var i=0;i<dbfHeaders.length;i++){
                        html+="<option value=\""+dbfHeaders[i]+"\">"+dbfHeaders[i]+"</option>";
                    }

                    $("#shpTextureIndxSelc").empty();
                    $("#shpTextureIndxSelc").append(html);

                    $("#shpModelIndxSelc").empty();
                    $("#shpModelIndxSelc").append(html);

                    $("#shpTextureIndx").show();
                    $("#shpModelIndx").show();

                    $("#dbfHeaderList").empty();
                    $("#dbfSamLists").empty();
                    var sampleArr = result.SHP_INFO.LIST;
                    var htmlHeader="";
                    var htmlBody = "";
                    for(var i=0;i<sampleArr.length;i++){
                        
                        if(i==0){
                            htmlHeader += "<tr>"
                            var header=sampleArr[i];
                            for(var j=0;j<header.length;j++){
                                htmlHeader+="<th nowrap>"+header[j]+"</th>"
                            }
                            htmlHeader +="</tr>"
                        }else{
                           
                            htmlBody += "<tr>"
                            var records = sampleArr[i];
                           
                            for(var j=0;j<records.length;j++){
                                htmlBody+="<td nowrap>"+records[j]+"</td>"
                            }
                            htmlBody +="</tr>"
                            
                        }
                    }

                    $("#dbfSampleLists").show();
                    $("#dbfHeaderList").append(htmlHeader);
                    $("#dbfSamLists").append(htmlBody);

                    setTimeout(function(){
                        $("#modelUploadFiles").prop("disabled",false);
                        $('#shpUploadUi').unblock();
                    },1000);
                }
            }
        })

    },
    processUplaod:function(){
        
        var layerName = $("#layerNameFac").val();
        var modelIndx = $("#shpTextureIndxSelc option:selected").val();
        var textureIndx=$("#shpModelIndxSelc option:selected").val();

        if(modelIndx=='N/A' || textureIndx=='N/A'){
            alert('유일키와 텍스처 키를 선택해주세요')
            return false;
        }

        var epsgCode = $("#procFacProj").val();

        var data = {
            layerName :layerName,
            modelIndx:modelIndx,
            texture:textureIndx,
            epsg:epsgCode,
            psid : PROC.global.layerKey
        }

        $('#uploadModelForm').block({
            message: '<div class="progress"><div class="progress-bar" id="procMdPrgss" style="width: 0%;">0%</div></div>',
            css: {
              backgroundColor: 'transparent',
              border: '0'
            },
            overlayCSS:  {
              backgroundColor: '#d1d7e3',
              opacity: 0.8
            }
        });

        $.ajax({
            url:'/model_vive/startProcess.do',
            type:'POST',
            data:data,
            dataType:'json',
            success:function(result){

                if(result.STATUS==200){
                    
                    var pid = result.PID;
                    
                    $("#proExcuteBtn").addClass('disabled');

                    PROC.global.interval=setInterval(function(){
                        PROC.getProgressInfo(pid);
                    },2000);
                }
            }
        })
    },
    getProgressInfo:function(pid){
     
        var data={
            pid:pid
        }

        $.ajax({
            url:'/model_vive/getProgress.do',
            type:'POST',
            data:data,
            dataType:'json',
            success:function(result){
                if(result.INFO.NUM == '100'){
                        
                    clearInterval(PROC.global.interval);
                    
                    setTimeout(function(){
                        
                        $('#uploadModelForm').unblock();
                        
                        var url = "//www.dtwincloud.com"+result.INFO.URL;

                        var apiUrl = "Module.XDEMapCreateLayer(\"레이어명\", \""+url+"\", 80,  true, true, true, 9, 0, 15)";
                        
                        $("#layerSampleUrl").text(apiUrl);

                        $('#modalConvertUrl').modal({backdrop: 'static', keyboard: false});

                        PROC.resetUplaod();
                    },1000);

                }else{
                    
                    $("#procMdPrgss").css('width',result.INFO.NUM+'%');
                    $("#procMdPrgss").text(result.INFO.NUM+'%');

                }
            }
        })
    },
    resetUplaod:function(){

        $("#layerNameFac").val('fac_vive_build');
        $("#shpUploadFiles").val('');
        $("#modelUploadFiles").val('');
        $("#procFacProj").val('EPSG:5186');
        
        if(!$("#proExcuteBtn").hasClass('disabled')){
            $("#proExcuteBtn").removeClass('disabled')
        }

        $("#shpTextureIndx").hide();
        $("#shpModelIndx").hide();        
        $("#dbfSampleLists").hide();        
        $("#dbfHeaderList").empty();
        $("#dbfSamLists").empty();

        $("#shpModelIndxSelc").empty();
        $("#shpTextureIndxSelc").empty();
    }

}
