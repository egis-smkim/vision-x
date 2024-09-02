/**
 * layer file upload service with smartWizard
 */
 var dtcFile = {
    global: {
        fileCnt:0,
        fileNames: [],
        DATAID: 0,
        stepPosition: "",
        fileType: "",
        progInterval: null,
        dropzoneFile: null,
        fileList:[],
        shpFileList:[],
        tifFileList:[],
        timeStamp:0,
        resetPrj:function(){
            $("#prjListBodyAll").empty();
            $("#projTableAll").hide();
            $("#projTableKo").show();
            $("#prjSearchInput").val('');
        },
        setProjection:function(srid){

            if(dtcFile.global.fileType=="S"){

                $("#dtcFilePrjInfo").val("EPSG:"+srid);
                
            }else if(dtcFile.global.fileType=="I" || dtcFile.global.fileType=="T"){
                $("#dtcFileImgPrjInfo").val("EPSG:"+srid);
            }else if(dtcFile.global.fileType=="P"){
                $("#dtcFilePclPrjInfo").val("EPSG:"+srid);
            }else if(dtcFile.type.zip.global.dataType=="Z3"){
                $("#zip3dsPrjInfo").val("EPSG:"+srid);
            }else if(dtcFile.type.zip.global.dataType=="ZD"){
                $("#zipDronePrjInfo").val("EPSG:"+srid);
            }else if(dtcFile.global.fileType=="B"){
                $("#bimPrjInfo").val("EPSG:"+srid);
            }else if(dtcFile.global.fileType=="DXF"){
                $("#dxfPrjInfo").val("EPSG:"+srid);
            }else if(dtcFile.global.fileType=="C"){
                $("#dtcFileCsvPrjInfo").val("EPSG:"+srid);
            }

            if(dtcFile.type.shp.global.exportCheck==true){
                $("#exportCoordsShpList").val("EPSG:"+srid);
            }

            if(dtcFile.type.csv.global.exportCheck==true){
                $("#exportCoordsCsvList").val("EPSG:"+srid);
            }

            dtcFile.global.resetPrj();
            
            $("#projSearchModal").modal("hide");

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
                            html +="    <td><a href=\"javascript:dtcFile.global.setProjection("+result.PROJ[i].srid+");\"> EPSG:"+result.PROJ[i].srid+"</a></td>\n"
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
        },
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
                            html +="    <td><a href=\"javascript:dtcFile.global.setProjection("+list[i].srid+");\"> EPSG:"+list[i].srid+"</a></td>\n"
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

                    dtcFile.global.searchPrjInfo();
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

                        dtcFile.global.searchPrjInfo();
                    }   

                });

                $("#prjResetBtn").on('click',function(e){
                    
                  dtcFile.global.resetPrj();

                });

            }else{
                $("#projSearchModal").modal();
                
            }

        }        
    },
    load: function(src) {
    
        fetch(src).then(function(response) {

            return response.text();

        }).then(function(html) {
            document.body.insertAdjacentHTML("beforeend", html);
			//브라우저 fetch() API를 통해 업로드 모달 html을 읽어오기에 해당 html요소들이 document에 추가된 후,함수 재실행
        }).then(function() {
			dtcFile.instance();
            if(D_MEMBER.DLID == 11){
                $("#projInfoBtn").show();
                $(function () {
                    $('[data-toggle="popover"]').popover()
                })
            }
        });

        $("#uploadFileWizardPrgss").css('width','0%');
    },
    instance: function() {

        $(document).ready(
            function() {

                $(".modal").mouseover(function() {
                    Module.XDIsMouseOverDiv(true);
                }).mouseout(function() {
                    Module.XDIsMouseOverDiv(false);
                });

                $("#dtcFileUploadModal").modal({
                    backdrop: 'static'
                });
                dtcFile.plugin.initDropzone();
                dtcFile.plugin.initWizard();

                new PerfectScrollbar(document
                    .getElementById('smartwizard-2-step-1'), {
                        suppressScrollX: true
                    });
                    
                $("#fileDeleteBtn").on('click',function(e){
                    dtcFile.plugin.deleteUploadedFiles(dtcFile.global.DATAID);
                });
            })
    },
    
    plugin: {
        globalFiles:["shp","shx","dbf","sbx","prj","cpg","tif","tiff","tfw","las","ifc","csv","img","jpg","gpx","zip","dxf","pdf","xlsx"],
        shp:["shp","shx","dbf"],
        shpCheck:["shp","shx","dbf","prj"],
        tif:["tif","tfw"],
        tifCheck:["tif","tfw"],
        getFileExt:function(fileName){
            var fileLength = fileName.length;
            var lastDot = fileName.lastIndexOf('.');
            var ext = fileName.substring(lastDot+1,fileLength);
            return ext;
        },
        checkFileTypes:function(files,count){
            //1.전체 글로벌 파일 타입 체크
            //2.shp,tif 일 떄 체크
            //3.shp 일 떄 필수 확장자 shp,shx,dbf,prj
            //4.tif 일 떄 필요 확장자 tif, 그 외 tfw,prj
            //5.prj 파일이 먼저 들어올 경우 filetype='N'
            //6.그 외 shp,tif가 들어오면 filetype 설정
            
            var fileType = '';
            var status = false;
            var diffFileType = false;
            //확장자랑 file indx 뽑아내기
            var extArr = [];
            var checkFileType='';

            for(var i=0;i<files.length;i++){
                
                var fileName = files[i].name.toLowerCase();
                var fileExt = dtcFile.plugin.getFileExt(fileName);

                if(dtcFile.plugin.globalFiles.indexOf(fileExt) != -1){
                    
                    if(fileExt == 'prj' && i==0){
                        checkFileType='prj';
                    }

                    if(dtcFile.plugin.shp.indexOf(fileExt) != -1){
                        checkFileType = 'S';
                    }else if(dtcFile.plugin.tif.indexOf(fileExt) !=-1 ){
                        checkFileType = 'I';
                    }

                    if(fileExt == 'csv'){
                        checkFileType='C';
                    }else if(fileExt == 'zip'){
                        checkFileType='Z';
                    }else if(fileExt == 'las'){
                        checkFileType='P';
                    }else if(fileExt == 'ifc'){
                        checkFileType='B';
                    }else if(fileExt == 'gpx'){
                        checkFileType='G';
                    }else if(fileExt == 'jpg'){
                        checkFileType='J';
                    }else if(fileExt == 'img'){
                        checkFileType='I';
                    }else if(fileExt == 'pdf'){
                        checkFileType='DOCS';
                    }

                    if(checkFileType !='prj' && fileType !='' && fileType != checkFileType){
                        diffFileType=true;
                        break;
                    }

                    fileType=checkFileType;

                    var extInfo ={
                        ext:fileExt,
                        indx:i
                    }

                    extArr.push(extInfo);

                }else{
                    
                    fileType = 'n';
                    
                    dtcFile.global.dropzoneFile.removeFile(files[i]);
                    
                    COMMON.alert('확장자가 '+fileExt+'인 파일은 가공할 수 없습니다.','warning',function(){
                        return false;
                    });

                    break;
                }
            }

            //다른 타입
            if(diffFileType){
                
                COMMON.alert('서로 다른 데이터 타입의 파일은 업로드할 수 없습니다.','warning',function(){
                    return false;
                });

                dtcFile.global.dropzoneFile.removeAllFiles();
                
                return false;
            }

            //중복체크
            var checkDuplicate = extArr.filter(function(item1,indx1){
                return extArr.findIndex(function(item2,indx2){
                    return item1.ext == item2.ext;
                }) !==indx1;
            });

            if(checkDuplicate.length != 0){
                
                var deleteFileName = [];
                
                for(var i=0;i<checkDuplicate.length;i++){
                    var indxDfile = checkDuplicate[i].indx;
                    
                    if(count > 1){
                        dtcFile.global.dropzoneFile.removeFile(files[indxDfile]);
                    }
                    
                    
                    deleteFileName.push(checkDuplicate[i].ext);
                }

                if(count == 1){
                    dtcFile.global.dropzoneFile.removeAllFiles();
                }

                COMMON.alert('확장자가'+deleteFileName.toString()+'파일이 중복됩니다.','warning',function(){
                    status=false;
                });

                status=false;
            }
            //중복체크 끝

            //shp일 때 필요한 파일 유효성 검증
            if(fileType=='S'){
           
                var shpArr = [];

                for(var i =0;i<extArr.length;i++){
                    var extName = extArr[i].ext;
                    shpArr.push(extName);
                }

                var shpTextArr = dtcFile.plugin.shpCheck.filter(it=>!shpArr.includes(it));                
                if(shpTextArr.length != 0){
                    
                    var needExt = shpTextArr.toString();
                    $("#shpFileUploadInfo").empty();
                    $("#shpFileUploadInfo").show();
                    htmlText="<span class=\"ts-9\">확장자가 <b style=\"color:#FFD950\">"+needExt+"</b> 파일을 업로드해주세요</span>";
                    $("#shpFileUploadInfo").append(htmlText);

                }else if(shpTextArr.length == 0){
                    $("#shpFileUploadInfo").hide();
                    status=true;
                }
            }else if(fileType=='I'){

                var extTifArr = [];

                for(var i =0;i<extArr.length;i++){
                    var extName = extArr[i].ext;
                    extTifArr.push(extName);
                }

                status = false;
                
                if(extArr.length==1 && extArr[0].ext=='tif'){
                    
                    GeoTIFF.fromBlob(files[0]).then(function(tif){
                        
                        tif.getImage().then(function(obj){
                    
                            var boundary = null;
                            
                            try {
                                boundary = obj.getBoundingBox();    
                            } catch (error) {
                                boundary = null;
                            }

                            if(boundary == null){

                                $("#shpFileUploadInfo").empty();
                                $("#shpFileUploadInfo").show();
                                htmlText="<span class=\"ts-9\">확장자가 <b style=\"color:#FFD950\">tfw</b> 파일을 업로드해주세요</span>";
                                $("#shpFileUploadInfo").append(htmlText);
                                
                            }else{
                                dtcFile.global.dropzoneFile.processQueue();
                            }
                            
                        });
                        
                    });

                }else if(extArr.length==1 && extArr[0].ext=='img'){

                    status = true;

                }else if(extArr.length==2){

                    if(extTifArr.indexOf('tif') != -1 && extTifArr.indexOf('tfw') != -1 ){
                        $("#shpFileUploadInfo").hide();
                        status = true;
                    }
                    
                }else if(extArr.length > 1 && extArr.length < 2){

                    var tifTextArr = dtcFile.plugin.tifCheck.filter(it=>!extTifArr.includes(it));

                    var textTif = tifTextArr.toString();
                    $("#shpFileUploadInfo").empty();
                    $("#shpFileUploadInfo").show();
                    htmlText="<span class=\"ts-9\">확장자가 <b style=\"color:#FFD950\">"+textTif+"</b> 파일을 업로드해주세요</span>";
                    $("#shpFileUploadInfo").append(htmlText);
                }
                
            }else{
                status=true;
            }

            var validate={
                status:status,
                type:fileType,
            };

            return validate;

        },
        deleteUploadedFiles:function(dataId){
           
            var data={
                dataId : dataId
            }

            $.ajax({
                url:'./ide/deleteUploadFiles.do',
                type:'POST',
                dataType:'json',
                data:data,
                success:function(result){

                    if(result.RS=="complete"){
                        dtcFile.global.DATAID=0;
                        dtcFile.global.fileType="";
                        dtcFile.global.fileNames=[];
                        
                        dtcFile.global.dropzoneFile.removeAllFiles();
                        $("#fileDeleteBtn").addClass("disabled");
                        LOG_TRACKER.write('34','2','데이터 삭제{DataID:'+data.dataId+'}')
                    }
                }
            })
        },
        initDropzone: function() {
            var timeStamp = new Date();
            
            dtcFile.global.timeStamp=timeStamp.getTime();
            dtcFile.global.dropzoneFile = new Dropzone(
                "#dropzone-file", {
                    url: './ide/uploadFileLists.do',
                    maxFilesize: 107374182000,
                    parallelUploads: 10,
                    params:{
                        TIME:dtcFile.global.timeStamp
                    },
                    filesizeBase: 1000,
                    addRemoveLinks: true,
                    autoProcessQueue:false,
                    timeout: 3000000,
                    maxFiles: 7,
                    paramName: "file",
                    createImageThumbnails: true,
                    uploadMultiple: true,
                    withCredentials: true,
                    dictRemoveFile: '삭제',
                    dictDefaultMessage: 'PREVIEW',
                    dictCancelUploadConfirmation:'업로드를 취소하시겠습니까?',
                    uploadprogress:function(file, progress, bytesSent){
                        
                        $(".progress-bar").css('width',progress.toFixed(0)+"%");
                        $(".progress-bar").text(progress.toFixed(0)+"%");

                    },
                    init: function() {

                        this.on("sending",function(file,xhr,data){
                            data.append("DATAID",dtcFile.global.DATAID);
                        })
                        
                        this.on("removedfile",function(file){
                            
                            /*if(dtcFile.global.DATAID != 0){
                                dtcFile.plugin.deleteUploadedFiles(dtcFile.global.DATAID);
                            }*/

                            if(dtcFile.global.dropzoneFile.files.length==0){
                                dtcFile.global.addCnt=0;
                            }
                        })

                        this.on('addedfiles',function(files){
                            
                            var valid = dtcFile.plugin.checkFileTypes(dtcFile.global.dropzoneFile.files,dtcFile.global.addCnt);
                            
                            if(valid.status==true){
                                dtcFile.global.dropzoneFile.processQueue();
                            }
                        });
                        

                        this.on('success', function(file, responseText) {
                            var result = JSON.parse(responseText);

                            $("#fileDeleteBtn").removeClass("disabled");
                            // console.log(result);
                            if (result.STATUS == "OK") {
                                dtcFile.global.DATAID = result.DATAID;
                                dtcFile.global.fileType= result.FILETYPE;
                            }
                            LOG_TRACKER.write('30','1','데이터 업로드:{DataID:'+result.DATAID+'}');
                        });

                        this.on("queuecomplete",function(file) {

                            if ($("#next-sw-btn").hasClass('disabled')) {
                                $("#next-sw-btn").removeClass('disabled');
                            }
                        });
                    }

                });

        },
        deleteAllFiles:function(){
            
            for(var i=0;i<dtcFile.global.fileList.length;i++){
                dtcFile.global.dropzoneFile.removeFile(dtcFile.global.fileList[i]);
            }

            dtcFile.global.fileList=[];
        },
        initWizard: function() {
            // wizard 초기 설정
            $('#smartwizard-2').smartWizard({
                autoAdjustHeight: false,
                backButtonSupport: false,
                useURLhash: false,
                showStepURLhash: false,
                keyNavigation: false,
                toolbarSettings: {
                    showNextButton: false,
                    showPreviousButton: false,
                },
            });

            $('#smartwizard-2').on("showStep",function(e, anchorObject, stepNumber,stepDirection, stepPosition) {

                if(stepNumber!=0){
                    $("#fileDeleteBtn").hide();
                }
                //단계별 서버에서 데이터 가져올 때 stepDirection 신경써서 아니면 backward 일때도 서버 호출해서 안됨
                $("#prev-sw-btn").removeClass('disabled');
         
                if(stepNumber==1 && stepDirection=="forward"){

                        if(dtcFile.global.fileType=="S"){
                            
                            $("#shpUploadLayerSetting").show();

                        }else if(dtcFile.global.fileType=="C"){
                            
                            $("#csvUploadLayerSetting").show();

                        }else if(dtcFile.global.fileType=="I" || dtcFile.global.fileType=="T"){
                         
                            $("#imgUploadLayerSetting").show();

                        }else if(dtcFile.global.fileType=="P"){
                            
                            $("#pclUploadLayerSetting").show();

                        }else if(dtcFile.global.fileType=="Z"){

                            $("#zipUploadLayerSetting").show();

                        }else if(dtcFile.global.fileType=="B"){

                            $("#bimUploadLayerSetting").show();

                        }else if(dtcFile.global.fileType=="J"){

                            $("#jpgUploadLayerSetting").show();

                        }else if(dtcFile.global.fileType=="DXF"){

                            $("#dxfUploadLayerSetting").show();

                        }else if(dtcFile.global.fileType=="DOCS"){
                            $("#pdfUploadLayerSetting").show();
                        }

                        COMMON.blockUIdiv('smartwizard-2-step-2','LOADING...');
                        $("#next-sw-btn").addClass('disabled');
                        return new Promise(function(resolve,reject){

                            var data = {
                                DATAID: dtcFile.global.DATAID
                            }
                                
                            $.ajax({
                                url: './ide/getLayerFileInfo.do',
                                type: 'POST',
                                data: data,
                                dataType: 'json',
                                beforeSend:function(xhr){
                                    $('#smartwizard-2').smartWizard("loader", "show");
                                }

                            }).done(function(result){
                                    //console.log(result);
                                    if (result.RS.DATA_TYPE == "S") {

                                        dtcFile.type.shp.setting(result);

                                    } else if (result.RS.DATA_TYPE == "C") {

                                        var layerName = result.LAYER_NAME;
                                        $("#csvDataName").val(layerName);
                                        $("#csvSampleFileName").text(layerName + " 샘플 리스트");
                                        dtcFile.type.csv.setting(result);

                                    } else if (result.RS.DATA_TYPE == "I" || result.RS.DATA_TYPE == "T") {

                                        dtcFile.type.image.setting(result);

                                    }else if (result.RS.DATA_TYPE == "P"){
                                        
                                        dtcFile.type.point.setting(result);

                                    }else if (result.RS.DATA_TYPE == "Z"){
                                        var layerName = result.LAYER_NAME;
                                        $("#layer3dsName").val(layerName);
                                        $("#layerDroneName").val(layerName);
                                        dtcFile.type.zip.setting();
                                    }else if (result.RS.DATA_TYPE == "G"){
                                        var layerName = result.LAYER_NAME;
                                        dtcFile.type.gpx.setting(result);
                                    }else if (result.RS.DATA_TYPE == "B"){
                                        dtcFile.type.bim.setting(result);
                                    }else if(result.RS.DATA_TYPE == "J"){
                                        dtcFile.type.jpg.setting(result);
                                    }else if(result.RS.DATA_TYPE == "DXF"){
                                        dtcFile.type.dxf.setting(result);
                                    }else if(result.RS.DATA_TYPE == "DOCS"){
                                        dtcFile.type.docs.setting(result);
                                    }

                                    COMMON.unblockUIdiv('smartwizard-2-step-2');
                                    $("#next-sw-btn").removeClass('disabled');
                                    
                            });
                            
                        });
                    }

                     if(stepNumber==2 && stepDirection=="forward"){ //마지막 단계로 넘어갈때

                        if(dtcFile.global.fileType=="S"){

                            $("#shpUploadLayerUpload").show();

                            COMMON.blockUIdiv('smartwizard-2-step-3','LOADING...');
                          
                            var dataName=$("#shpDataName").val();
                            var geoTye=$("#shpGeometryType").text();
                            var proj=$("#dtcFilePrjInfo").val();
                            var dbfCharset=$("#dbfEncodinSelc option:selected").val();
                            //var checkshp3d=$("#shpCheckHeight").is(":checked");
                            var descShp = $("#shpDescText").val();

                            /*if(checkshp3d){
                                $("#check3Dshp").text("Y");
                            }else{
                                $("#check3Dshp").text("N");
                            }*/
            
                            var dataId = dtcFile.global.DATAID;
            
                            $.ajax({
                                url:'../ide/getShpThumb.do',
                                type:'POST',
                                data:{dataId:dataId},
                                dataType:'json',
                              
                            }).done(function(result){
                                $("#fileThumNailImg").attr('src',result.IMG_INFO);
                               
                                $("#shpDataUploadName").text(dataName);
                                $("#shpGeotypUpload").text(geoTye);
                                $("#shpPrjUploadName").text(proj);
                                $("#dbfEncodingUpload").text(dbfCharset);
                                $("#shpUploadDescTxt").text(descShp);

                                $("#fileThumNailImg").show();

                                COMMON.unblockUIdiv('smartwizard-2-step-3');
                            })

                        }

                        if(dtcFile.global.fileType=="C"){
                            /*
                                1.레이어명
                                2.가시화 타입
                                3.경도 위도
                                4.마커 타이틀
                                5.인코딩
                                6.그룹핑 여부
                                7.마커타입 여부
                                8.마커 색상
                                9.마커 타입에 따른 이미지,3ds 인덱스
                            */
                            $("#csvUploadFinal").show();

                            COMMON.blockUIdiv('smartwizard-2-step-3','LOADING...');

                            var layerName =$("#csvDataName").val();
                            var visibleType = $("input[name=csvCheckType]:checked").val();
                            var lonIndx = $("#coordsXCsvList option:selected").val();
                            var latIndx = $("#coordsYCsvList option:selected").val();
                            var markerIndx = $("#markerCsvList option:selected").val();
                            var encoding =$("#csvCharsetList option:selected").val();
                            var makerType =$("input[name=csvMarkerType]:checked").val();
                            var color = $("#makerColorRGB").val();

                            var addrIndx = $("#addrCsvList option:selected").val();
                            var groupCheck =$("#csvGroupType").is(":checked");
                            var groupVal=0;
                            
                            if(groupCheck){
                                groupVal=0
                            }else{
                                groupVal=1;
                            }

                            var lonTxt = $("#coordsXCsvList option:selected").text();
                            var latTxt = $("#coordsYCsvList option:selected").text();
                            var addrTxt =$("#addrCsvList option:selected").text(); 

                            var markerTxt =$("#markerCsvList option:selected").text(); 

                            var thumbImg = $("#fileCsvThumNailImg img").attr('src');
                            var descTxt = $("#csvDescText").val();
                            var epsgCode = $("#dtcFileCsvPrjInfo").val();

                            var globalCsvData ={
                                layerName:layerName,
                                type:visibleType,
                                addrIndx:addrIndx,
                                lon:lonIndx,
                                lat:latIndx,
                                marker:markerIndx,
                                encoding:encoding,
                                makerType:makerType,
                                color:color,
                                groupCheck:groupVal,
                                img:dtcFile.type.csv.global.POI_IMG_INDX,
                                dataId:dtcFile.global.DATAID,
                                epsg:epsgCode,
                                desc:descTxt
                            }

                            dtcFile.type.csv.global.uploadData=globalCsvData;

                            $.ajax({
                                url:'../ide/getCsvThumb.do',
                                type:'POST',
                                data:dtcFile.type.csv.global.uploadData,
                                dataType:'json',
                                success:function(result){
                                    
                                    if(result.IMG_SRC != null){
                                        
                                        $("#fileCsvThumNailImg img").attr('src',result.IMG_SRC);
                                        dtcFile.type.csv.global.uploadData.thumb=result.IMG_SRC;
                                        dtcFile.type.csv.global.uploadData.minx=result.MINX;
                                        dtcFile.type.csv.global.uploadData.miny=result.MINY;
                                        dtcFile.type.csv.global.uploadData.maxx=result.MAXX;
                                        dtcFile.type.csv.global.uploadData.maxy=result.MAXY;
                                    
                                        $("#csvDataDescTxt").text(descTxt);
                                        $("#csvLayerName").text(layerName);
                                        
                                        if(visibleType=="L"){
                                            
                                            $("#csvLayerType").text('경,위도')
                                            $("#csvLonTxtInfo").text(lonTxt);
                                            $("#csvLatTxtInfo").text(latTxt);
                                            $("#columLonLatInfo").show();

                                        }else if(visibleType=="G"){
                                            $("#csvLayerType").text('지오코딩');
                                            $("#csvAddrTxtInfo").text(addrTxt);
                                            $("#columAddrInfo").show();

                                        }else{
                                            $("#csvLayerType").text('없음');
                                            $("#columLonLatInfo").hide();
                                            $("#columAddrInfo").hide();
                                        }
                                        
                                        if(groupCheck){
                                            $("#csvLayerGroup").text('그룹핑')
                                        }else{
                                            $("#csvLayerGroup").text('전체 가시화')
                                        }

                                        $("#csvLayerCharset").text(encoding);

                                        var markerTypeTxt = '포인트';
                                        
                                        if(makerType==0){
                                            $("#csvMarkerColorPoint").show();
                                            $("#csvMarkerPntColor").val(color);
                                            markerTypeTxt = '포인트';

                                        }else if(makerType==1){
                                            
                                            markerTypeTxt = '이미지';
                                            $("#markerImgSrc").attr('src',dtcFile.type.csv.global.poiSrc);
                                            $("#csvMarkerImgSample").show();

                                        }else{
                                            markerTypeTxt = '3DS';
                                            $("#markerImgSrc").attr('src',dtcFile.type.csv.global.poiSrc);
                                            $("#csvMarkerImgSample").show();
                                        }

                                        $("#csvMarkerTypeTxt").text(markerTypeTxt);
                                        $("#csvMarkerTxtInfo").text(markerTxt);
                                        

                                        $("#fileCsvThumNailImg").show();

                                        COMMON.unblockUIdiv('smartwizard-2-step-3');
                                    }
                                }
                            })
                        }

                        if(dtcFile.global.fileType=="I" || dtcFile.global.fileType=="T"){

                            $("#imgUploadCloud").show();
                            
                            COMMON.blockUIdiv('smartwizard-2-step-3','LOADING...');
                            
                            dtcFile.type.image.global.paramData.PROJ = $("#dtcFileImgPrjInfo").val();
                            dtcFile.type.image.global.paramData.TYPE="I";
                            dtcFile.type.image.global.paramData.DESC = $("#imgDemDescText").val();

                            if($("#imgCheckList").val() == "I"){
                                $("#imgVisibleType").text('타일 이미지');
                            }else if($("#imgCheckList").val() == "I#S"){
                                $("#imgVisibleType").text('단일 밴드/유사 색상');
                            }else if($("#imgCheckList").val() == "T"){
                                $("#imgVisibleType").text('지형');
                            }

                            $("#imgUploadDataName").text(dtcFile.type.image.global.paramData.LAYER_NAME);
                            $("#imgProjName").text(dtcFile.type.image.global.paramData.PROJ);
                            $("#imgDemTxtDesc").text(dtcFile.type.image.global.paramData.DESC);

                            $("#next-sw-btn").addClass('disabled');
                            $.ajax({
                                url:'../ide/getImgThumbInfo.do',
                                type:'POST',
                                data:dtcFile.type.image.global.paramData,
                                dataType:'json',
                                success:function(result){
                                    
                                    $("#fileImgThumNail").show();

                                    if(result.IMG_SRC != null){

                                        $("#fileImgThumNail img").attr('src',result.IMG_SRC);

                                    }else{

                                        $("#fileImgThumNail img").attr('src','/assets/img/default.png');

                                    }
                                    
                                    COMMON.unblockUIdiv('smartwizard-2-step-3');
                                    $("#next-sw-btn").removeClass('disabled');
                                }
                            });

                        }

                        if(dtcFile.global.fileType=="P"){
                            /*
                            min,max 좌표변환 4326 바운더리 설정 
                            pdal 바운더리 폴리곤 simplfy해서 미리보기 썸네일 활용
                            */ 
                            $("#pclUploadLayerUpload").show();
                            COMMON.blockUIdiv('smartwizard-2-step-3','LOADING...');
                            var zrevVal=0;
                            
                            if($("#pclZrevChck").is(":checked")){
                                zrevVal=1;
                            }

                            dtcFile.type.point.global.params.epsg=$("#dtcFilePclPrjInfo").val();
                            dtcFile.type.point.global.params.DATAID=dtcFile.global.DATAID;
                            dtcFile.type.point.global.params.LAYERNAME = $("#pclDataName").val();
                            dtcFile.type.point.global.params.density=$("#pclDensity option:selected").val();
                            dtcFile.type.point.global.params.DESC=$("#pclDescText").val();
                            dtcFile.type.point.global.params.zReverse=zrevVal;

                            $.ajax({
                                url:'../ide/getPclThumbInfo.do',
                                type:'POST',
                                data:dtcFile.type.point.global.params,
                                dataType:'json',
                                success:function(result){
                                    
                                    var imgSrc="";
                                    
                                    if(result.THUMB != "ERROR"){
                                        imgSrc=result.THUMB;
                                    }else{
                                        imgSrc="/assets/img/default.png";
                                        $("#thumbDescInfo").addClass('text-danger');
                                        $("#thumbDescInfo").text('이미지를 불러오는데 실패했습니다!');
                                    }

                                    dtcFile.type.point.global.params.thumb=imgSrc;
                                   
                                    $("#filepclThumNail img").attr('src',imgSrc);
                                    $("#filepclThumNail").show();
                                    $("#pclLayerUploadName").text(dtcFile.type.point.global.params.LAYERNAME);
                                    $("#pclLayerSrs").text(dtcFile.type.point.global.params.epsg);
                                    
                                    $("#pclUploadMinx").text(dtcFile.type.point.global.params.minx);
                                    $("#pclUploadMiny").text(dtcFile.type.point.global.params.miny);
                                    $("#pclUploadMinz").text(dtcFile.type.point.global.params.minz);

                                    $("#pclUploadMaxx").text(dtcFile.type.point.global.params.maxx);
                                    $("#pclUploadMaxy").text(dtcFile.type.point.global.params.maxy);
                                    $("#pclUploadMaxz").text(dtcFile.type.point.global.params.maxz);
                                    $("#pclUploadDesc").text(dtcFile.type.point.global.params.DESC);

                                    COMMON.unblockUIdiv('smartwizard-2-step-3');
                                }
                            })
                        }

                        if(dtcFile.global.fileType=="Z" && dtcFile.type.zip.global.dataType=="Z3"){
                           
                            /*
                            1.shp 파일 thumbnail
                            2.바운더리 구하기
                            3.설정 좌표계 표시
                            4.총 3ds 객체 갯수 -> 추후에 진행
                            */

                            $("#zip3dsUploadLayer").show();

                            COMMON.blockUIdiv('smartwizard-2-step-3','LOADING...');

                            var data={
                                dataId:dtcFile.global.DATAID,
                                shpFileName:dtcFile.type.model.global.shpFile,
                                charset:$("#dbf3dsEncoding option:selected").val(),
                                dbfIndx:$("#dbf3dsHeaderIndx option:selected").val(),
                                textureColumn:$("#dbf3dsHeaderTexture option:selected").val(),
                                epsgCode:$("#zip3dsPrjInfo").val(),
                                modelDir:dtcFile.type.model.global.modelDir,
                                dbfFileName:dtcFile.type.model.global.dbfFile,
                                dataType:dtcFile.type.zip.global.dataType,
                                dataName:$("#layer3dsName").val(),
                                MID:D_MEMBER.MID,
                                desc:$("#model3dsDescText").val()
                            }
                            
                            $.ajax({
                                url:'../ide/get3dsShpInfo.do',
                                type:'POST',
                                data:data,
                                dataType:'json',
                                success:function(result){
                                    //console.log(result);
                                    var imgSrc = result.RS.thumb_url;
                                    
                                    var minx = result.RS.minx;
                                    var miny = result.RS.miny;
                                    var maxx = result.RS.maxx;
                                    var maxy = result.RS.maxy;
                                
                                    var layerName = result.RS.layerName;
                                    var epsgCode = result.RS.epsg;

                                    $("#fileZip3dsThumNail img").attr('src',imgSrc);
                                    $("#zip3dsLayerUploadName").text(layerName);
                                    $("#zip3dsLayerSrs").text(epsgCode);

                                    $("#zip3dsUploadMinx").text(minx);
                                    $("#zip3dsUploadMiny").text(miny);
                                    $("#zip3dsUploadMaxx").text(maxx);
                                    $("#zip3dsUploadMaxy").text(maxy);
                                    $("#zip3dsUploadDesc").text($("#model3dsDescText").val());

                                    $("#fileZip3dsThumNail").show();

                                    COMMON.unblockUIdiv('smartwizard-2-step-3');

                                }
                            });

                        }

                        if(dtcFile.global.fileType=="Z" && dtcFile.type.zip.global.dataType=="ZD"){
                            /*
                                1.center 좌표 기준 buffer 만들어서 썸네일 생성
                                2.center 좌표 EPSG:4326변경 후 db update

                            */
                                $("#zipDroneUploadLayer").show();

                                COMMON.blockUIdiv('smartwizard-2-step-3','LOADING...');

                                dtcFile.type.drone.global.params.layerName = $("#layerDroneName").val();
                                dtcFile.type.drone.global.params.dataId = dtcFile.global.DATAID;
                                dtcFile.type.drone.global.params.desc = $("#daeDescText").val();
                                
                                $.ajax({
                                    url:'../ide/getDroneLoDThumb.do',
                                    type:'POST',
                                    data:dtcFile.type.drone.global.params,
                                    dataType:'json',
                                    success:function(result){

                                        if(result.IMG_URL != "ERROR"){
                                        
                                            var imgUrl = result.IMG_URL;
                                            dtcFile.type.drone.global.params.imgUrl=imgUrl;
                                            $("#fileZipDroneThumNail img").attr('src',imgUrl);
                                          
                                            $("#fileZipDroneThumNail").show();

                                            var centerX = dtcFile.type.drone.global.params.x;
                                            var centerY = dtcFile.type.drone.global.params.y;

                                            $("#zipDroneLayerUploadName").text(dtcFile.type.drone.global.params.layerName);
                                            $("#zipDroneUploadCenterX").text(centerX);
                                            $("#zipDroneUploadCenterY").text(centerY);
                                            $("#zipDroneLayerSrs").text(dtcFile.type.drone.global.params.epsg);
                                            $("#zipDroneDescTxt").text(dtcFile.type.drone.global.params.desc);

                                        }

                                        COMMON.unblockUIdiv('smartwizard-2-step-3');
                                    }
                                });
                            
                        }

                        if(dtcFile.global.fileType=="G"){
                            
                            $("#gpxUploadLayer").show();
                            COMMON.blockUIdiv('smartwizard-2-step-3','LOADING...');

                            var param={
                                dataId : dtcFile.global.DATAID,
                                layerName : $("#gpxDataName").val(),
                                rteColor : $("#gpxRteColorRGB").val(),
                                trkColor : $("#gpxTrkColorRGB").val(),    
                                desc : $("#gpxDescText").val()
                            }

                            $.ajax({
                                url:'../ide/getGpxThumbInfo.do',
                                type:'POST',
                                data:param,
                                dataType:'json',
                                success:function(result){
                                    
                                    if(result.STATE=="OK"){
                                        $("#fileGpxThumNail img").attr("src",result.THUMB_URL);

                                        if(result.GPX_INFO.RTE_LENGTH != "0.0"){
                                            $("#rteLengthInfo").show();
                                            $("#rteLengthTxt").text(result.GPX_INFO.RTE_LENGTH+"km");
                                        }

                                        if(result.GPX_INFO.TRK_LENGTH != "0.0"){
                                            $("#trkLengthInfo").show();
                                            $("#trkLengthTxt").text(result.GPX_INFO.TRK_LENGTH+"km");
                                        }
                                    }
                                    
                                    $("#fileGpxThumNail").show();
                                    $("#gpxLayerNameTxt").text(param.layerName);
                                    $("#gpxDescTxtInfo").text(param.desc);

                                    COMMON.unblockUIdiv('smartwizard-2-step-3');
                                    $("#next-sw-btn").removeClass('disabled');
                                }
                            })
                        }

                        if(dtcFile.global.fileType=="B"){
                            $("#bimUploadLayer").show();
                            COMMON.blockUIdiv('smartwizard-2-step-3','LOADING...');

                            var param={
                                dataId : dtcFile.global.DATAID,
                                layerName : $("#layerBimName").val(),
                                epsg : $("#bimPrjInfo").val(),
                                desc : $("#gpxDescText").val()
                            }

                            $.ajax({
                                url:'./ide/bimUploadLayer.do',
                                type:'POST',
                                data:param,
                                dataType:'json',
                                success:function(result){
                                 
                                    if(result.STATUS == 200){
                                        
                                        $("#bimLayerNameTxt").text(param.layerName);
                                        $("#bimEpsgCode").text(param.epsg);
                                        $("#bimDescTxtInfo").text(param.desc);

                                        COMMON.unblockUIdiv('smartwizard-2-step-3');

                                        $("#next-sw-btn").removeClass('disabled');
                                    }
                                }
                            })
                        }

                        
                        if(dtcFile.global.fileType=="J"){
                            $("#jpgUploadLayer").show();
                            COMMON.blockUIdiv('smartwizard-2-step-3','LOADING...');

                            var param={
                                dataId : dtcFile.global.DATAID,
                                layerName : $("#layerJpgName").val(),
                                lon : $("#jpgLayerLon").val(),
                                lat : $("#jpgLayerLat").val(),
                                desc : $("#jpgLayerDescText").val()
                            }

                            $.ajax({
                                url:'./ide/jpgUploadLayer.do',
                                type:'POST',
                                data:param,
                                dataType:'json',
                                success:function(result){

                                    if(result.STATUS == 200){
                                        
                                        $("#jpgLayerNameTxt").text(param.layerName);
                                        $("#jpgLayerLonTxt").text(param.lon);
                                        $("#jpgLayerLatTxt").text(param.lat);
                                        $("#jpgDescTxtInfo").text(param.desc);

                                        var thumb_url = result.URL;
                                        if(thumb_url!='ERROR'){
                                            $("#fileJpgThumNail img").attr('src',thumb_url);
                                        }

                                        COMMON.unblockUIdiv('smartwizard-2-step-3');

                                        $("#next-sw-btn").removeClass('disabled');
                                    }
                                }
                            })
                        }

                        if(dtcFile.global.fileType=="DXF"){

                            $("#dxfUploadLayer").show();
                            COMMON.blockUIdiv('smartwizard-2-step-3','LOADING...');

                            dtcFile.type.dxf.global.param.layerName = $("#layerDxfName").val();
                            dtcFile.type.dxf.global.param.encoding = $("#dxfEcndoingSelc option:selected").val();
                            dtcFile.type.dxf.global.param.epsg = $("#dxfPrjInfo").val();

                            var typeArr = [];

                            $(".dxfTypeCheck").each(function(){
                                if($(this).is(":checked") == true){
                                    var valType = $(this).val();
                                    typeArr.push(valType);
                                }
                            })

                            dtcFile.type.dxf.global.param.geoType = typeArr.toString();

                            $.ajax({
                                url:'./ide/getDxfThumbInfo.do',
                                type:'post',
                                data:dtcFile.type.dxf.global.param,
                                dataType:'json',
                                success:function(result){
                                    
                                    if(result.STATUS==200){
                                        
                                        $("#dxfLayerNameTxt").text(dtcFile.type.dxf.global.param.layerName);
                                        $("#dxfLayerEpsgTxt").text(dtcFile.type.dxf.global.param.epsg);
                                        $("#dxfCharsetTxt").text(dtcFile.type.dxf.global.param.encoding);
                                        
                                        $("#dxfBoundaryMinx").text(dtcFile.type.dxf.global.param.minx);
                                        $("#dxfBoundaryMiny").text(dtcFile.type.dxf.global.param.miny);
                                        $("#dxfBoundaryMaxx").text(dtcFile.type.dxf.global.param.maxx);
                                        $("#dxfBoundaryMaxy").text(dtcFile.type.dxf.global.param.maxy);

                                        $("#fileDxfThumNail img").attr('src',result.DXF_THUMB);

                                        COMMON.unblockUIdiv('smartwizard-2-step-3');
                                        $("#next-sw-btn").removeClass('disabled');
                                    }
                                }
                            })
                        }
						if(dtcFile.global.fileType=="DOCS"){

                            $("#pdfUploadLayer").show();
                            COMMON.blockUIdiv('smartwizard-2-step-3','LOADING...');

                            $("#pdfLayerNameTxt").text($("#layerPdfName").val());
                            $("#pdfDescTxtInfo").text($("#pdfLayerDescText").val());

                            COMMON.unblockUIdiv('smartwizard-2-step-3');
                            $("#next-sw-btn").removeClass('disabled');
                        }
                     }
                        
                        if (stepPosition == 'first') {

                            $("#prev-sw-btn").addClass('disabled');
                            // $("#next-sw-btn").addClass('disabled');
                            $("#next-sw-btn").removeClass('disabled');
                            $("#next-sw-btn").removeClass("btn-primary");
                            $("#next-sw-btn").addClass("btn-outline-dark");
                            $("#next-sw-btn").text('다음');

                            dtcFile.global.stepPosition = "first";
                            
                            $("#fileDeleteBtn").show();

                        }else if(stepPosition == 'middle'){ 

                            $("#next-sw-btn").removeClass("btn-primary");
                            $("#next-sw-btn").addClass("btn-outline-dark");
                            $("#next-sw-btn").text('다음');
                            $("#prev-sw-btn").removeClass('disabled');
                            $("#fileDeleteBtn").hide();
                            dtcFile.global.stepPosition = "middle";

                        } else if (stepPosition == 'final') {

                            $("#fileDeleteBtn").hide();
                            $("#next-sw-btn").addClass('disabled');
                            
                            $("#next-sw-btn").text('업로드');
                            $("#next-sw-btn").removeClass("btn-outline-dark");
                            $("#next-sw-btn").addClass("btn-primary");

                            dtcFile.plugin.nextWizard(stepPosition,stepNumber);

                            if (dtcFile.global.fileType == "I" || dtcFile.global.fileType == "T" || dtcFile.global.fileType == "Z" || dtcFile.global.fileType == "DOCS") {

                                $("#next-sw-btn").removeClass('disabled');

                            }

                            dtcFile.global.stepPosition = "final";

                        } else {
                            $("#prev-sw-btn").removeClass('disabled');
                            $("#next-sw-btn").removeClass('disabled');

                            $("#next-sw-btn").removeClass("btn-primary");
                            $("#next-sw-btn").addClass("btn-outline-dark");
                            $("#next-sw-btn").text('다음');

                            dtcFile.global.stepPosition = "";
                        }

                    });

            $('#smartwizard-2').on("leaveStep",function(e, anchorObject, currentStepIndex, stepDirection){
                
                var check = true;

                if(dtcFile.global.fileType == "S" && currentStepIndex==1 && stepDirection=="forward"){
                    
                    if(!$("#dtcFilePrjInfo").val()){
                        
                        COMMON.alert('좌표계를 선택해주세요','warning',function(e){
                            $("#dtcFilePrjInfo").focus();
                            check= false;
                        })

                        check= false;
                    }
                }

                if(dtcFile.global.fileType == "C" && currentStepIndex==1 && stepDirection=="forward"){


                    var markerIndx = $("#markerCsvList option:selected").val();
					var checkVal = $("input[name=csvCheckType]:checked").val();

                    if(checkVal != "N" && markerIndx=="N/A"){
                        COMMON.alert('마커 타이틀을 선택해주세요','warning',function(e){
                            $("#markerCsvList").focus();
                            check= false;
                        })
    
                        check= false;
                    }


                    var columnList = [];
                    $('#csvSampleLists table.table thead th').each(function(){
                        columnList.push($(this).text().trim());
                    });
                    if(new Set(columnList).size !== columnList.length){
                        COMMON.alert("CSV 파일에 중복된 헤더가 있습니다.\n확인 후 재업로드 해주세요.",'warning',function(e){
                            check = false;
                        })
                        check = false;
                    }

                    var prjWkt = $("#dtcFileCsvPrjInfo").val();

                    if(prjWkt=='' || typeof prjWkt == 'undefined'){
                        var checkVal = $("input[name=csvCheckType]:checked").val();

                        if (checkVal == "L") {
                            COMMON.alert('좌표계를을 선택해주세요','warning',function(e){
                            $("#dtcFileCsvPrjInfo").focus();
                            check= false;
                            })
    
                            check= false;
                        } 
                        
                    }
                    
                }

                if(dtcFile.global.fileType == "I" && currentStepIndex==1 && stepDirection=="forward"){
                    
                    if(!$("#dtcFileImgPrjInfo").val()){
                        
                        COMMON.alert('좌표계를 선택해주세요','warning',function(e){
                            $("#dtcFileImgPrjInfo").focus();
                            check= false;
                        })

                        check= false;
                    }

                    if($("#imgCheckList").val() == 'N/A'){
                        
                        COMMON.alert('가시화 유형을 선택해주세요','warning',function(e){
                            $("#imgCheckList").focus();
                            check= false;
                        })

                        check= false;
                    }

                    var type = $("#imgCheckList option:selected").val();
                    var colorTableCheck = dtcFile.type.image.global.paramData.check_color_table;

                    if(type !='I' && dtcFile.type.image.global.paramData.BAND != 1){
                        COMMON.alert("지원하지 않는 타입입니다.<br> 다른 가시화 타입을 선택해주세요","warning",function(){return false;});
                        check= false;
                    }

                    if(type =='I' && dtcFile.type.image.global.paramData.BAND == 1 && colorTableCheck =='n'){
                        COMMON.alert("지원하지 않는 타입입니다.<br> 다른 가시화 타입을 선택해주세요","warning",function(){return false;});
                        check= false;
                    }

                    if(type =='I#S' && dtcFile.type.image.global.paramData.BAND == 1 && colorTableCheck =='y'){
                        COMMON.alert("지원하지 않는 타입입니다.<br> 다른 가시화 타입을 선택해주세요","warning",function(){return false;});
                        check= false;
                    }

                }

                if(dtcFile.global.fileType == "P" && currentStepIndex==1 && stepDirection=="forward"){
                    
                    if(!$("#dtcFilePclPrjInfo").val()){
                        
                        COMMON.alert('좌표계를 선택해주세요','warning',function(e){
                            $("#dtcFilePclPrjInfo").focus();
                            check= false;
                        })

                        check= false;
                    }
                }

                
                if(dtcFile.global.fileType == "Z" && dtcFile.type.zip.global.dataType=="Z3" && currentStepIndex==1 && stepDirection=="forward"){
                    
                    /*if($("#dbf3dsHeaderIndx option:selected").val()=="N/A"){
                       
                        COMMON.alert('주요키를 선택해주세요','warning',function(e){
                            $("#dbf3dsHeaderIndx").focus();
                            check= false;
                        })

                        check= false;
                    }*/

                    if($("#dbf3dsHeaderTexture option:selected").val()=="N/A"){
                       
                        COMMON.alert('텍스처 컬럼을 선택해주세요','warning',function(e){
                            $("#dbf3dsHeaderTexture").focus();
                            check= false;
                        })

                        check= false;
                    }
                    
                    if(!$("#zip3dsPrjInfo").val()){
                        
                        COMMON.alert('좌표계를 선택해주세요','warning',function(e){
                            $("#zip3dsPrjInfo").focus();
                            check= false;
                        })

                        check= false;
                    }
                }
                
                
                if(dtcFile.global.fileType == "G" && currentStepIndex==1 && stepDirection=="forward"){
                    
                    if(!$("#gpxDataName").val()){
                        
                        COMMON.alert('레이어명을 입력해주세요','warning',function(e){
                            $("#gpxDataName").focus();
                            check= false;
                        })

                        check= false;
                    }
                }

                if(dtcFile.global.fileType == "B" && currentStepIndex==1 && stepDirection=="forward"){
                    
                    if(!$("#bimPrjInfo").val()){
                        
                        COMMON.alert('좌표계를 선택해주세요','warning',function(e){
                            $("#bimPrjInfo").focus();
                            check= false;
                        })

                        check= false;
                    }
                }

                if(dtcFile.global.fileType == "J" && currentStepIndex==1 && stepDirection=="forward"){
                    
                    //레이어명
                    if($("#layerJpgName").val()==''){
                        COMMON.alert('레이어명을 입력해주세요','warning',function(e){
                            $("#layerJpgName").focus();
                            check= false;
                        })
                        check= false;
                    }
                    //경도
                    if($("#jpgLayerLon").val()=='' || $("#jpgLayerLon").val()=='0.0'){
                        COMMON.alert('경도을 입력해주세요','warning',function(e){
                            $("#jpgLayerLon").focus();
                            check= false;
                        })
                        check= false;
                    }
                    //위도
                    if($("#jpgLayerLat").val()==''|| $("#jpgLayerLat").val()=='0.0'){
                        COMMON.alert('위도를 입력해주세요','warning',function(e){
                            $("#jpgLayerLat").focus();
                            check= false;
                        })
                        check= false;
                    }

                }

                if(dtcFile.global.fileType == "DXF" && currentStepIndex==1 && stepDirection=="forward"){
                    
                    if(!$("#layerDxfName").val()){
                        
                        COMMON.alert('레이어명을 입력해주세요','warning',function(e){
                            $("#layerDxfName").focus();
                            check= false;
                        })

                        check= false;
                    }

                    if($("#dxfEcndoingSelc option:selected").val()=='N/A'){
                        
                        COMMON.alert('인코딩을 선택해주세요','warning',function(e){
                            $("#dxfEcndoingSelc").focus();
                            check= false;
                        })

                        check= false;
                    }

                    if(!$("#dxfPrjInfo").val() || $("#dxfPrjInfo").val()==''){
                        
                        COMMON.alert('좌표계를 선택해주세요','warning',function(e){
                            $("#dxfPrjInfo").focus();
                            check= false;
                        })

                        check= false;
                    }

                    var checkSize=0;

                    $(".dxfTypeCheck").each(function(){
                        if($(this).is(":checked")==true){
                            checkSize++;
                        }
                    });
                    
                    if(checkSize==0){
                        COMMON.alert('가시화할 Feature을 선택해주세요','warning',function(e){
                            $(".dxfTypeCheck").focus();
                            check= false;
                        })

                        check= false;
                    }
                   
                }if(dtcFile.global.fileType == "DOCS" && currentStepIndex==1 && stepDirection=="forward"){
                    
                    if(!$("#layerPdfName").val()){
                        
                        COMMON.alert('레이어명을 입력해주세요','warning',function(e){
                            $("#layerPdfName").focus();
                            check= false;
                        })

                        check= false;
                    }
                }

                return check;
            });

            $("#prev-sw-btn").on("click", function() {
                // Navigate previous

                if (!$(this).hasClass('disabled')) {
                    $('#smartwizard-2').smartWizard("prev");
                }

                
                if(dtcFile.type.point.global.params != null){
                    $("#prev-sw-btn").removeClass('disabled');
                }

                return true;
            });

            $("#next-sw-btn").on("click", function() {
                // Navigate next

                if (!$(this).hasClass('disabled')) {
                    $('#smartwizard-2').smartWizard("next");
                }

                /*if (dtcFile.global.fileType == "S") {
                    $("#next-sw-btn").removeClass('disabled');
                }*/
                //$("#next-sw-btn").removeClass('disabled');

                if (dtcFile.global.stepPosition == "final" && dtcFile.global.fileType == "S") {
                    dtcFile.global.stepPosition = "DONE"
                    return true;
                }

                if (dtcFile.global.stepPosition == "final" && dtcFile.global.fileType == "C") {
                    dtcFile.global.stepPosition = "DONE"
                    return true;
                }

                if (dtcFile.global.stepPosition == "final" && (dtcFile.global.fileType == "I" || dtcFile.global.fileType == "T")) {
                    dtcFile.global.stepPosition = "DONE"
                    return true;
                }

                if (dtcFile.global.stepPosition == "final" && dtcFile.global.fileType == "P") {
                    dtcFile.global.stepPosition = "DONE"
                    return true;
                }

                if (dtcFile.global.stepPosition == "final" && dtcFile.type.zip.global.dataType == "Z3") {
                    dtcFile.global.stepPosition = "DONE"
                    return true;
                }

                if (dtcFile.global.stepPosition == "final" && dtcFile.type.zip.global.dataType == "ZD") {
                    dtcFile.global.stepPosition = "DONE"
                    return true;
                }

                if (dtcFile.global.stepPosition == "final" && dtcFile.global.fileType == "G") {
                    dtcFile.global.stepPosition = "DONE"
                    return true;
                }

                if (dtcFile.global.stepPosition == "final" && dtcFile.global.fileType == "B") {
                    dtcFile.global.stepPosition = "DONE"
                    return true;
                }

                if (dtcFile.global.stepPosition == "final" && dtcFile.global.fileType == "J") {
                    dtcFile.global.stepPosition = "DONE"
                    return true;
                }

                if (dtcFile.global.stepPosition == "final" && dtcFile.global.fileType == "DXF") {
                    dtcFile.global.stepPosition = "DONE"
                    return true;
                }

                if (dtcFile.global.stepPosition == "final" && dtcFile.global.fileType == "DOCS") {
                    dtcFile.global.stepPosition = "DONE"
                    return true;
                }

                if (dtcFile.global.stepPosition == "DONE") {

                    dtcFile.plugin.exitWizard();

                }

                return true;
            });

            $("#close-sw-btn").on('click', function() {
           
                $("#dtcFileUploadModal").modal('hide');

                setTimeout(function() {
                    dtcFile.destory();
                }, 100);

            });

           
        },
        nextWizard: function(stepPosition,stepNumber) {
            
            if (stepPosition == "final") {

                if (dtcFile.global.fileType == "S" || dtcFile.global.fileType == "C" || dtcFile.global.fileType == "P") {
                    $("#next-sw-btn").removeClass('disabled');
                }
            } 

        },
        prevWizard: function(step) {

            if (step == 1) {
                console.log('이전')
            }

        },
        exitWizard: function() {

            if (dtcFile.global.fileType == "S") {

                if($("#dbfEncodingUpload").text()==''){
                    COMMON.alert("인코딩을 선택해주세요.","error",function(){return false;});
                }

                var layerName = $("#shpDataUploadName").text();

                var data = {
                    DATAID: dtcFile.global.DATAID,
                    TYPE: dtcFile.global.fileType,
                    LAYERNAME: layerName,
                    CHARSET:$("#dbfEncodingUpload").text(),
                    PROJ: $("#shpPrjUploadName").text(),
                    MID: D_MEMBER.MID,
                    GEO_TYPE:dtcFile.type.shp.global.geometry,
                    CHECk3D:$("#check3Dshp").text(),
                    IMG_SRC:$("#fileThumNailImg").attr('src'),
                    DESC:$("#shpUploadDescTxt").text()
                }

                COMMON.blockUIdiv("MapContainer", "UPLOADING...");
                    //지오서버
                    dtcFile.type.shp.uploadCloudShpServer(data, function(result) {
                    
                        COMMON.unblockUIdiv("MapContainer");
                        COMMON.blockUIdiv("MapContainer", "레이어 생성 중입니다...");
                        
                        dtcFile.type.shp.setGeoserverlayer(result);
                        
                    });
                  
                
                    $("#dtcFileUploadModal").modal('hide');

                    setTimeout(function() {
                        dtcFile.destory();
                        dtcFile.global.stepPosition = "";
                    }, 100);

            } else if (dtcFile.global.fileType == "C") {

                var data = {
                    DATAID: dtcFile.global.DATAID,
                    TYPE: "C",
                    LAYERNAME: dtcFile.type.csv.global.uploadData.layerName,
                    MID: D_MEMBER.MID,
                    MAKER_TITLE: dtcFile.type.csv.global.uploadData.marker,
                    SERVER: dtcFile.type.csv.global.uploadData.type,
                    AREATYPE:dtcFile.type.csv.global.uploadData.groupCheck,
                    ENCODING:dtcFile.type.csv.global.uploadData.encoding,
                    THUMB:dtcFile.type.csv.global.uploadData.thumb,
                    DESC:dtcFile.type.csv.global.uploadData.desc,
                    EPSG:dtcFile.type.csv.global.uploadData.epsg
                }

                if (dtcFile.type.csv.global.uploadData.type == "L") { // 경위도
                    // 선택

                    data.LON_INDX = dtcFile.type.csv.global.uploadData.lon;
                    data.LAT_INDX = dtcFile.type.csv.global.uploadData.lat;

                    if (dtcFile.type.csv.global.uploadData.makerType == "0") {
                        
                        data.HEXCOLOR = dtcFile.type.csv.global.uploadData.color;

                    }

                } else if (dtcFile.type.csv.global.uploadData.type == "G") { // 지오코딩서버 선택
                    
                    if(dtcFile.type.csv.global.uploadData.addrIndx != null && dtcFile.type.csv.global.uploadData.addrIndx != 'undefined'){
                        data.GEO_ADDR_INDX = dtcFile.type.csv.global.uploadData.addrIndx;
                        data.HEXCOLOR = dtcFile.type.csv.global.uploadData.color;
                    }
                    
                }

                data.MAKER_TYPE =  dtcFile.type.csv.global.uploadData.makerType;

                if(data.MAKER_TYPE=="1" || data.MAKER_TYPE=="2"){
                    data.POI_IMG_INDX =0;
                    
                    if(dtcFile.type.csv.global.POI_IMG_INDX != null){
                        data.POI_IMG_INDX =dtcFile.type.csv.global.POI_IMG_INDX;
                    }
                }

                data.minx=dtcFile.type.csv.global.uploadData.minx;
                data.miny=dtcFile.type.csv.global.uploadData.miny;
                data.maxx=dtcFile.type.csv.global.uploadData.maxx;
                data.maxy=dtcFile.type.csv.global.uploadData.maxy;

                $.ajax({
                    url: './geocoding/convertCsvData.do',
                    type: 'POST',
                    data: data,
                    dataType: 'json',
                    success: function(result) {
                        //console.log(result);
                        dtcFile.type.csv.convertProgress(result);
                        //dtcFile.type.csv.setTileLayer(result);
                        
                    }
                });

                $("#dtcFileUploadModal").modal('hide');

                setTimeout(function() {
                    dtcFile.destory();
                    dtcFile.global.stepPosition = "";
                }, 100);

            } else if (dtcFile.global.fileType == "I") {
                // 정사영상
                var thumb = $("#imgFilePreview img").attr("src");
                dtcFile.type.image.global.paramData.THUMB=thumb;
                
                $("#preViewLayerImg").attr('src',thumb);

                dtcFile.type.image.uploadCloud();

                $("#dtcFileUploadModal").modal('hide');

                setTimeout(function() {
                    dtcFile.destory();
                    dtcFile.global.stepPosition = "";
                }, 100);
                
            }else if(dtcFile.global.fileType == "T"){

                var thumb = $("#fileImgThumNail img").attr("src");

                if(thumb == 'undefined' || thumb == '#'){
                    $("#preViewLayerImg").attr('src','/assets/img/default.png');
                }else{
                    $("#preViewLayerImg").attr('src',thumb);
                }
                
                dtcFile.type.terrain.uploadCloud();

                $("#dtcFileUploadModal").modal('hide');

                setTimeout(function() {
                    dtcFile.destory();
                    dtcFile.global.stepPosition = "";
                }, 100);
           
            }else if(dtcFile.global.fileType == "P"){

                dtcFile.type.point.uploadCloud();
                $("#dtcFileUploadModal").modal('hide');

                setTimeout(function() {
                    dtcFile.destory();
                    dtcFile.global.stepPosition = "";
                }, 100);

            }else if(dtcFile.global.fileType == "Z" && dtcFile.type.zip.global.dataType=="Z3"){
              
                dtcFile.type.model.upload3dsTile();
                $("#dtcFileUploadModal").modal('hide');

                setTimeout(function() {
                    dtcFile.destory();
                    dtcFile.global.stepPosition = "";
                }, 100);
            }else if(dtcFile.global.fileType == "Z" && dtcFile.type.zip.global.dataType=="ZD"){
              
                dtcFile.type.drone.uploadDroneData();                

                $("#dtcFileUploadModal").modal('hide');

                setTimeout(function() {
                    dtcFile.destory();
                    dtcFile.global.stepPosition = "";
                }, 100);
            }else if (dtcFile.global.fileType == "G"){

                dtcFile.type.gpx.uploadGpxLayer();

                $("#dtcFileUploadModal").modal('hide');

                setTimeout(function() {
                    dtcFile.destory();
                    dtcFile.global.stepPosition = "";
                }, 100);

            } else if (dtcFile.global.fileType == "B"){
                
                dtcFile.type.bim.processBimLayer();

                $("#dtcFileUploadModal").modal('hide');
                
                setTimeout(function() {
                    dtcFile.destory();
                    dtcFile.global.stepPosition = "";
                }, 100);
            }else if (dtcFile.global.fileType == "J"){
                
                dtcFile.type.jpg.processJpgLayer();

                $("#dtcFileUploadModal").modal('hide');
                
                setTimeout(function() {
                    
                    dtcFile.destory();
                    dtcFile.global.stepPosition = "";

                }, 100);
            }else if (dtcFile.global.fileType == "DXF"){
                
                dtcFile.type.dxf.processDxfLayer();

                $("#dtcFileUploadModal").modal('hide');
                
                setTimeout(function() {
                    
                    dtcFile.destory();
                    dtcFile.global.stepPosition = "";
                    
                }, 100);
            }else if (dtcFile.global.fileType == "DOCS"){
                dtcFile.type.docs.uploadDocs();
                $("#dtcFileUploadModal").modal('hide');
                
                setTimeout(function() {
                    dtcFile.destory();
                    dtcFile.global.stepPosition = "";
                }, 100);
            }
           
        }
    },
    META: {
        loadFromMetaDataList: function(t) {

            var dataType = t.replace("#", "");

            var formData = new FormData();
            formData.append("control", "loadMemberProduct");
            formData.append("dataType", dataType);

            $
                .ajax({
                    url: IDE.context + "/meta/ide/loadUserMetaAsset.do",
                    type: "POST",
                    data: formData,
                    processData: false,
                    contentType: false,
                    enctype: 'multipart/form-data',
                    success: function(result) {

                        var result = JSON.parse(result);
                        console.log(result);

                        if (result.rs == "complete") {

                            var dataTypeName = "";
                            var targetObj = "";

                            switch (t) {
                                case "#terrain-data":
                                    dataTypeName = "지형";
                                    targetObj = "metaDataListTerrain";
                                    break;

                                case "#img-data":
                                    dataTypeName = "영상";
                                    targetObj = "metaDataListImage";
                                    break;

                                case "#lidar-data":
                                    dataTypeName = "포인트클라우드";
                                    targetObj = "metaDataListPointCloud";
                                    break;

                                case "#shp-data":
                                    dataTypeName = "SHAPE";
                                    targetObj = "metaDataListShape";
                                    break;

                                case "#model-data":
                                    dataTypeName = "LOD 모델";
                                    targetObj = "metaDataListLodModel";
                                    break;

                                case "#threeds-data":
                                    dataTypeName = "3DS";
                                    targetObj = "metaDataList3DS";

                                    break;

                                case "#csv-data":
                                    dataTypeName = "CSV";
                                    targetObj = "metaDataListCSV";
                                    break;
                            }

                            var rs = result.mapsDataList;

                            $("#" + targetObj).empty();

                            if (rs.length > 0) {
                                $
                                    .each(
                                        rs,
                                        function(k, v) {
                                            var html = "";
                                            html += "<tr>\n";
                                            html += "	<td class=\"align-middle\">\n";
                                            html += "		<img src=\"" +
                                                v.thumbnail_url +
                                                "\" alit=\"\" class=\"d-block ui-w-60 ui-bordered\">\n";
                                            html += "	</td>\n";
                                            html += "	<td class=\"align-middle\">\n";
                                            html += "		" +
                                                v.data_name +
                                                "\n";
                                            html += "	</td>\n";
                                            html += "	<td class=\"align-middle ts-7\">" +
                                                v.coord_epsg +
                                                "</td>\n";
                                            var regDate = v.reg_date
                                                .split(" ");
                                            html += "	<td class=\"align-middle ts-7\">" +
                                                regDate[0] +
                                                "</td>\n";
                                            html += "	<td class=\"align-middle\">\n";
                                            html += "		<a href=\"javascript:dtcFile.META.addMetaLayer(" +
                                                v.dataid +
                                                ");\"><button class=\"btn btn-outline-success btn-sm ladda-button\" data-style=\"slide-left\" data-size=\"s\"><span class=\"lnr lnr-file-add\"></span>&nbsp;&nbsp;Add</button></a>\n";
                                            html += "	</td>\n";
                                            html += "</tr>\n";

                                            $("#" + targetObj)
                                                .append(html);
                                        });
                            } else {
                                var html = "<tr>\n";
                                html += "	<td class=\"align-middle t-c\" colspan=\"5\">지형 데이터가 없습니다.</td>\n";
                                html += "</tr>\n";

                                $("#" + targetObj).append(html);
                            }

                        } else {
                            var html = "<tr>\n";
                            html += "	<td class=\"align-middle t-c\" colspan=\"5\">데이터를 불러올 수 없습니다.</td>\n";
                            html += "</tr>\n";

                            $("#" + targetObj).append(html);

                        }
                    }
                });
        },
        addMetaLayer: function(metaId) {

            // META 에 Data 요청 후 엔진에 등록된 정보를 콜백을 받아온다.
            META.assetFromMetaId(metaId, dtcFile.META.addUILayer);
        },
        addUILayer: function(obj) {
            console.log(obj);

            // UI Control
            /*
             */

            var targetContainer = "";
            var parentContainer = "";

            switch (obj.dataType) {
                // T : 지형, I : 영상, F : 시설물, P:Point Cloud, S : Shape, L : LOD MODEL,
                // D : 3DS, O: Object, C : CSV

                case "TERRAIN":
                    targetContainer = "";
                    parentContainer = "demLayerLists";
                    break;

                case "BACKGROUND_IMAGE":
                    targetContainer = "";
                    parentContainer = "";
                    break;

                case "HYBRID_IMAGE":
                    targetContainer = "importedImageLists";
                    parentContainer = "imgLayerLists";
                    break;

                case "POINTCLOUD":
                    targetContainer = "";
                    parentContainer = "";
                    break;

                case "FACILITY":
                    targetContainer = "";
                    parentContainer = "";
                    break;

                case "SHAPE":
                    targetContainer = "";
                    parentContainer = "shpLayerLists";
                    break;

                case "LODMODEL":
                    targetContainer = "";
                    parentContainer = "";
                    break;

                case "3DS":
                    targetContainer = "";
                    parentContainer = "";
                    break;

                case "CSV":
                    targetContainer = "";
                    parentContainer = "csvLayerLists";
                    break;
            }

            // console.log(targetContainer);

            var html = "<div class=\"task-list-item text-white\">\n";
            html += "	<label class=\"custom-control custom-checkbox\">\n";
            html += "		<input type=\"checkbox\" class=\"custom-control-input meta_input_check\" value=\"" +
                obj.layerName + "\" checked>\n";
            html += "		<span class=\"custom-control-label\">\n";
            html += "			<a class=\"text-white\" href=\"javascript:META.layerBoundView(" +
                obj.minx +
                "," +
                obj.miny +
                "," +
                obj.maxx +
                "," +
                obj.maxy + ");\">" + obj.dataName + "</a>\n";
            html += "		</span>\n";
            html += "		<div class=\"task-list-actions btn-group\" style=\"float:right;\">\n";
            html += "			<button type=\"button\" class=\"btn btn-default btn-xs rounded-pill icon-btn borderless md-btn-flat hide-arrow dropdown-toggle\" data-toggle=\"dropdown\" aria-expanded=\"false\"><i class=\"ion ion-ios-more\"></i></button>\n";
            html += "			<div class=\"dropdown-menu dropdown-menu-right ts-9\">\n";
            html += "				<a class=\"dropdown-item\" href=\"javascript:dtcFile.type.shp.exportShp('1100');\"><span class=\"fas fa-file-export\"></span> 내보내기</a>\n";
            html += "				<a class=\"dropdown-item\" href=\"javascript:dtcFile.type.shp.getProperties('1100');\"><span class=\"fas fa-clipboard-list\"></span> 속성</a>\n";
            html += "				<a class=\"dropdown-item\" href=\"javascript:dtcFile.type.shp.setStyle('1100');\"><span class=\"fas fa-border-style\"></span> 스타일 설정</a>\n";
            html += "				<a class=\"dropdown-item\" href=\"javascript:dtcFile.type.shp.deleteLayer('1100');\"><span class=\"far fa-trash-alt\"></span> 삭제</a>\n";
            html += "			</div>\n";
            html += "		</div>\n";
            html += "	</label>\n";
            html += "</div>\n";

            // console.log(targetContainer);
            $("#" + targetContainer).append(html);

            console.log(parentContainer);

            var isExpanded = $("#" + parentContainer).attr("aria-expanded");
            if (!isExpanded) {
                $("#" + parentContainer).collapse('show');
            }

            COMMON.unblockUIdiv("MapContainer");

            $(".meta_input_check").on('click', function(e) {
                var check = $(this).is(":checked");
                var value = $(this).val();

                if (check) {
                    META.showHideLayer(value, "SHOW");
                } else {
                    META.showHideLayer(value, "HIDE");
                }
            });

            $("#closeDataImprtBtn").click();
        }
    },
    type: {
		docs:{
			uploadDocs:function(){
                var data = {
                    DATAID: dtcFile.global.DATAID,
                    LAYERNAME: $("#pdfLayerNameTxt").text(),
                    DESC:$("#pdfDescTxtInfo").text()
                };
                        
                $.ajax({
                    url:'./ide/uploadDocs.do',
                    type:'POST',
                    data:data,
                    dataType:'json',
                    success:function(result){
                        dtcLayer.clonLayerInfo(result.INFO,'memberLayerLists','');
                    }
                })
            },
			setting:function(obj){
               $("#layerPdfName").val(obj.LAYER_NAME);
               $("#pdfLayerDescText").val("");

				$("#pdfLayerInfo").html("<iframe src='"+obj.DOCS_INFO+"'></iframe>");
			},
			closeDocsView:function(){
                $("#docsDisplay").hide();
                $("#docsName").text("");
			},
			setDocsView:function(dataId){
	            $("#shpPropertyDisplay").hide();
	            $("#shp3dsDisplay").hide();
	
	            var data={
	                dataId:dataId
	            }
	
	            $.ajax({
	                url:'./geocoding/getPropertyList.do',
	                type:'POST',
	                data:data,
	                dataType:'json',
	                success:function(result){
	                    if(result.LIST != null){
							//csv
							var headers = [];
		                    var headerHtml= "<tr>";
		                    var htmlList ="";
		                    var headerOption="<option value=\"N/A\">필드 선택</option>";
		                        
	                        for(var i=0;i<result.HEADER.length;i++){
	                            var header = result.HEADER[i];
	                            headers.push(header.column_name);
	                            
	                            if(header.column_name != "geo"){
	                                headerHtml+="<th style=\"white-space: nowrap;\">"+header.column_name+"</th>"
	                                headerOption+="<option value=\""+header.column_name+"\">"+header.column_name+"</option>\n";
	                            }
	                        }
	                        headerHtml+="</tr>"
	                        htmlList = ""
                            for(var i=0;i<result.LIST.length;i++){
                                htmlList+="<tr>\n"
                                for(var j=0;j<headers.length;j++){
                                    var column = headers[j];
                                    if(column != "geo"){
                                        htmlList+="<td style=\"white-space: nowrap;\">\n";

                                        htmlList+=" <span class=\"text-white\">"+result.LIST[i][column]+"</span>\n"
                                        htmlList+="</td>\n"
                                    }
                                }
                                htmlList+="</tr>\n"
                            }
							$("#docsDisplayDiv").html('<div class="card-datatable table-responsive mb-3" style="height: 30vh;">'+
													'<table class="table table-sm table-hover text-center ts-9">'+
								            			'<thead style="position:sticky;top:0;background:#32353b;">'+
								            				headerHtml+
								            			'</thead>'+
								            			'<tbody>'+
								            				htmlList+
								            			'</tbody>'+
		    										'</table>'+
													'<div>');
							new PerfectScrollbar($("#docsDisplayDiv .card-datatable")[0]);
						}else{
							//pdf
							$("#docsDisplayDiv").html("<iframe style='height: 50vh;width: 100%;' src='"+result.SRC+result.LAYER_NAME+".pdf'>");
						}
	
	                    $("#docsName").text(result.LAYER_NAME);
	                    $("#docsDisplay").show();
	                }
	            });
			},
			addUILayer:function(obj){
                var dataId=obj.RS.DATAID;
                var layer_name = obj.RS.DATA_NAME;
                var thumbImg=obj.RS.THUMB;
                var layerDate=obj.RS.DATE;
    
                if(layer_name.length > 35 ){
                    layer_name = layer_name.substring(0,35)+"...";
                }

                var html ="<div class=\"card mb-0\" id=\"MEM_LAYER_"+dataId+"\">\n";
                html+=" <div class=\"card-body d-flex justify-content-between align-items-start pb-1 pt-3\">\n";
                html+="     <div>\n";
                html+="         <label class=\"custom-control custom-checkbox\">\n";
                html+="         	<span>\n";
                html+="             	<a class=\"text-body ts-11 font-weight-semibold\" href=\"javascript:dtcFile.type.docs.setDocsView("+dataId+")\">"+layer_name+"</a>\n";
                html+="             </span>\n";
                html+="         </label>\n";
                html+="     </div>\n";
                html+="     <div class=\"btn-group project-actions\">\n";
                html+="         <button type=\"button\" class=\"btn btn-default btn-xs rounded-pill icon-btn md-btn-flat hide-arrow dropdown-toggle\" data-toggle=\"dropdown\" aria-expanded=\"false\">\n";
                html+="             <i class=\"ion ion-ios-more\"></i>\n";
                html+="         </button>\n";
                html+="         <div class=\"dropdown-menu dropdown-menu-right ts-9\">\n";
                html+="               <a class=\"dropdown-item\" href=\"javascript:dtcAiSetting.exportLayerData('"+dataId+"')\"><span class=\"lnr lnr-bubble\"></span> AI</a>\n"
                html+="               <a class=\"dropdown-item\" href=\"javascript:dtcFile.getLayerInfo('"+dataId+"');\"><span class=\"fas fa-info\"></span> 정보</a>\n"        
                html+="               <a class=\"dropdown-item\" href=\"javascript:dtcFile.delete('"+dataId+"')\"><span class=\"far fa-trash-alt\"></span> 삭제</a>\n"        
                html+="         </div>\n"
                html+="     </div>\n";
                html+=" </div>\n";            
                html+=" <div class=\"card-body pb-1 pt-0\">\n";
                html+="     <div class=\"media pl-0\">\n";
                html+="         <img src=\""+thumbImg+"\" class=\"d-block ui-w-120 mt-1\" style=\"height:9vh;\">\n";
                html+="         <div class=\"media-body ml-2 col-md-10 mt-1 pt-1\">\n"
                html+="             <div class=\"text-white mb-0 ts-10 pb-2\">\n";
                html+="                    <span class=\"d-block mb-1\">date: "+layerDate+"</span>"
                html+="             </div>\n";
                html+="         </div>\n";
                html+="     </div>\n";
                html+=" </div>\n"
                html+=" <div class=\"card-body pt-1 pb-3\">\n"
                html+="     <div class=\"row\">\n"
                html+="         <div class=\"col text-right\">\n";
                html+="             <div class=\"font-weight-bold text-body ts-9\"><i class=\"fas fa-book\"></i> DOCS</div>\n";
                html+="         </div>\n";
                html+="     </div>\n";
                html+=" </div>\n";
                html+=" <hr class=\"m-0\">\n"
                html+="</div>"
           
                $("#memberLayerLists").prepend(html);
			}
		},
        csv: {
            columnX: "N/A",
            columnY: "N/A",
            colMarker: "N/A",
            poiLayer: null,
            global: {
                exportCheck:false,
                POI:null,
                GROUP_POI:null,
                param: {},
                interval:null,
                POI_IMG_INDX:null,
                ghostSymbol:null,
                poiSrc:"",
                uploadData:null,
                scrollbar:null,
                pageNum:0,
                checkSearch:false,
                moreCheck:false,
                editData:null,
                progInterval:null,
                client:null,
                topic:''
            },
            setPoiImg:function(indx){
                dtcFile.type.csv.global.POI_IMG_INDX=indx;
            },
            setting: function(result) {

                $("#coordsXList").empty();
                $("#coordsYList").empty();
                $("#markerCsvList").empty();
                //$("#selectCoordsCsvList").empty();
                $("#addrCsvList").empty();

                //console.log(result);

                var columnList = result.COLUMNS.HEADERS;

                var html = "<option value=\"N/A\">선택</option>\n";
                var htmlHeader= "<tr>";
                
                for (var i = 0; i < columnList.length; i++) {

                    html += "<option value=\"" + i + "\">" + columnList[i] +
                        "</option>\n";
                    htmlHeader+= "<th nowrap>"+columnList[i]+"</th>\n";

                }

                htmlHeader+="</tr>";

                var htmlLon =  "<option value=\"N/A\">선택</option>";
                
                //자동 컬럼 선택 체크
                var checkSetLonLat = [false, false]
                for (var i = 0; i < columnList.length; i++) {

                    var selected = "";

                    if (columnList[i] == "경도" || columnList[i].toLowerCase()=="lon" || columnList[i].toLowerCase()=="longitude" || columnList[i].toLowerCase()=="x") {
                        selected = "selected";
                        dtcFile.type.csv.columnX = i;
                        checkSetLonLat[0] = true;
                    }

                    htmlLon += "<option value=\"" + i + "\" " + selected + ">" +
                        columnList[i] + "</option>\n";

                }

                var htmlLat = "<option value=\"N/A\">선택</option>";

                for (var i = 0; i < columnList.length; i++) {
                    var selected = "";

                    if (columnList[i] == "위도" || columnList[i].toLowerCase()=="lat" || columnList[i].toLowerCase()=="latitude" || columnList[i].toLowerCase()=="y") {
                        selected = "selected"
                        dtcFile.type.csv.columnY = i;
                        checkSetLonLat[1] = true;
                    }
                    htmlLat += "<option value=\"" + i + "\" " + selected + ">" +
                        columnList[i] + "</option>\n";

                }
                //경위도 컬럼 자동 선택시 EPSG:4326 세팅
                if(checkSetLonLat[0] == true && checkSetLonLat[1] == true){
                     $("#dtcFileCsvPrjInfo").val("EPSG:4326");
                }

                //records 설정
                var records = result.RECORD.LIST;
                var htmlRecord = "";
                var recordTotalSize = result.RECORD.SIZE;
                
                for(var i=0;i<records.length;i++){
                    var record = records[i];
                    htmlRecord +="<tr>\n";

                    for(var j=0;j<record.length;j++){
                        htmlRecord +="<td nowrap>"+record[j]+"</td>\n"    
                    }
                    htmlRecord +="</tr>\n";
                }

                $("#csvSampleHeader").empty();
                $("#csvSampleBody").empty();

                $("#totalCsvRecods").text(recordTotalSize);
                
                $("#csvSampleHeader").append(htmlHeader);
                $("#csvSampleBody").append(htmlRecord);

                $("#coordsXCsvList").append(htmlLon);
                $("#coordsYCsvList").append(htmlLat);

                $("#markerCsvList").append(html);
                $("#addrCsvList").append(html);

                new PerfectScrollbar(document.getElementById('csvSampleLists'), {
                    suppressScrollY: true
                });

                
                dtcFile.type.csv.initEvent();
            },
            initEvent: function() {

                //인코딩 변경 이벤트
                $("#csvCharsetList").on('change',function(e){
                    var value=$("#csvCharsetList option:selected").val();

                    dtcFile.type.csv.changeCharset(value);
                });

                $("#coordsXCsvList").on(
                    'change',
                    function() {

                        dtcFile.type.csv.columnX = $(
                            "#coordsXCsvList option:selected").val();

                        if (dtcFile.type.csv.columnX != "N/A" &&
                            dtcFile.type.csv.columnY != "N/A" &&
                            dtcFile.type.csv.colMarker != "N/A") {
                            $("#next-sw-btn").removeClass("disabled");
                            dtcFile.global.stepPosition = "DONE";
                        }

                    });

                $("#coordsYCsvList").on(
                    'change',
                    function() {

                        dtcFile.type.csv.columnY = $(
                            "#coordsYCsvList option:selected").val();

                        if (dtcFile.type.csv.columnX != "N/A" &&
                            dtcFile.type.csv.columnY != "N/A" &&
                            dtcFile.type.csv.colMarker != "N/A") {
                            $("#next-sw-btn").removeClass("disabled");
                            dtcFile.global.stepPosition = "DONE";
                        }

                    });

                $("#markerCsvList").on(
                    'change',
                    function() {

                        dtcFile.type.csv.colMarker = $(
                            "#markerCsvList option:selected").val();

                        if (dtcFile.type.csv.columnX != "N/A" &&
                            dtcFile.type.csv.columnY != "N/A" &&
                            dtcFile.type.csv.colMarker != "N/A") {
                            $("#next-sw-btn").removeClass("disabled");
                            dtcFile.global.stepPosition = "DONE";
                        }

                        if (dtcFile.type.csv.addrIndx != "N/A" &&
                            dtcFile.type.csv.colMarker != "N/A") {
                            $("#next-sw-btn").removeClass("disabled");
                            dtcFile.global.stepPosition = "DONE";
                        }

                    });

                $("#addrCsvList").on(
                    'change',
                    function() {

                        dtcFile.type.csv.addrIndx = $(
                            "#addrCsvList option:selected").val();

                        if (dtcFile.type.csv.addrIndx != "N/A" &&
                            dtcFile.type.csv.colMarker != "N/A") {
                            $("#next-sw-btn").removeClass("disabled");
                            dtcFile.global.stepPosition = "DONE";
                        }

                    });

                $("#previewCsvBtn button").on('click',function(e) {

                    if($("#markerCsvList option:selected").val()=="N/A"){
						var checkVal = $("input[name=csvCheckType]:checked").val();
	
	                    if(checkVal != "N"){
							COMMON.alert("마커 타이틀을 선택해주세요",'warning',function(){
	                            return false;
	                        })
	                    }
                        return false;
                    }

                    var data = {

                        "DATAID": dtcFile.global.DATAID,
                        "COLUMN_X": dtcFile.type.csv.columnX,
                        "COLUMN_Y": dtcFile.type.csv.columnY,
                        "LABEL_INDEX": $("#markerCsvList option:selected").val(),
                        "COLOR_HEX": $("#makerColorRGB").val()

                    }

                    dtcFile.type.csv.getThumbNailImg(data,function(result) {

                        COMMON.unblockUIdiv("csvFilePreview");

                        $("#previewCsvBtn").hide();
                        $("#fileCsvThumNailImg").show();
                        $("#fileCsvThumNailImg img").attr('src',result.IMG_SRC);

                    });
                });

                new PerfectScrollbar(
                    document.getElementById('csvInputDataset'), {
                        suppressScrollX: true
                    });

                new PerfectScrollbar(document.getElementById('csvSampleLists'), {
                    suppressScrollY: true
                });

                $("input[name=csvCheckType]").on('click', function(e) {
                    var checkVal = $("input[name=csvCheckType]:checked").val();

                    if (checkVal == "L") {
						$("#csvInputDataset>div:nth-child(5)").show();
						$("#csvInputDataset>div:nth-child(8)").show();
						$("#csvInputDataset>div:nth-child(9)").show();
						$("#csvInputDataset>div:nth-child(10)").show();
						
                        $(".chcekPosCsv").show();
                        $(".chcekAddrCsv").hide();
                        $(".csvPrjInfo").show();


                        $("#previewCsvBtn button").removeClass('disabled');
                    } else if (checkVal == "G") {
						$("#csvInputDataset>div:nth-child(5)").show();
						$("#csvInputDataset>div:nth-child(8)").show();
						$("#csvInputDataset>div:nth-child(9)").show();
						$("#csvInputDataset>div:nth-child(10)").show();
						
                        $(".chcekAddrCsv").show();
                        $(".chcekPosCsv").hide();
                        $(".csvPrjInfo").hide();

                        $("#previewCsvBtn button").addClass('disabled');
                    } else {
						$("#csvInputDataset>div:nth-child(5)").hide();
						$("#csvInputDataset>div:nth-child(8)").hide();
						$("#csvInputDataset>div:nth-child(9)").hide();
						$("#csvInputDataset>div:nth-child(10)").hide();
						
                        $(".chcekAddrCsv").hide();
                        $(".chcekPosCsv").hide();
                        $(".csvPrjInfo").hide();
						$("#markerCsvList").hide();
                    }
                });

                $("input[name=csvMarkerType]").on('click',function(e) {

                        var checkVal = $("input[name=csvMarkerType]:checked").val();

                        if (checkVal == "0") {

                            $(".csvMarkerPointStyle").show();
                            $(".csvMarkerImgStyle").hide();
                            $(".csvMarkerModelStyle").hide();

                        } else if (checkVal == "1") {

                            $(".csvMarkerPointStyle").hide();
                            $(".csvMarkerModelStyle").hide();
                            $(".csvMarkerImgStyle").show();

                            var length = $("#csvSamplePoiImg a").length;
                            
                            if(length==0){
                                
                                var data ={
                                    type:'I'
                                }

                                $.ajax({
                                    url:'./geocoding/getImgPoiList.do',
                                    type:'POST',
                                    data:data,
                                    dataType:'json',
                                    success:function(result){
                                      
                                        var html ="";
                                       
                                        for(var i=0;i<result.LIST.length;i++){
                                            html+="<a href=\"javascript:dtcFile.type.csv.setPoiImg("+result.LIST[i].cid+",'I')\" class=\"d-block col-2 pr-1 pb-1 img-thumbnail bg-light\">\n"
                                            html+="     <div class=\"img-thumbnail-overlay bg-info opacity-25\"></div>\n";
                                            html+="     <img src=\"."+result.LIST[i].poi_file_url+"\" class=\"img-fluid\" id=\"csv_poiIcon_"+result.LIST[i].cid+"\">\n";
                                            html+="</a>"
                                        }

                                        $("#csvSamplePoiImg").append(html);
                                    }
                                });
                            }

                        } else {
                           
                            $(".csvMarkerModelStyle").show();
                            $(".csvMarkerImgStyle").hide();
                            $(".csvMarkerPointStyle").hide();

                            var length = $("#csvSamplePoiModel a").length;

                            if(length == 0 ){

                                var data ={
                                    type:'M'
                                }
                                
                                $.ajax({
                                    url:'./geocoding/getImgPoiList.do',
                                    type:'POST',
                                    data:data,
                                    dataType:'json',
                                    success:function(result){

                                        var html ="";
                                       
                                        for(var i=0;i<result.LIST.length;i++){
                                            html+="<a href=\"javascript:dtcFile.type.csv.setPoiImg("+result.LIST[i].cid+",'M')\" class=\"d-block col-3 pr-1 pb-1 img-thumbnail bg-light\">\n"
                                            html+="     <div class=\"img-thumbnail-overlay bg-info opacity-25\"></div>\n";
                                            html+="     <img src=\"."+result.LIST[i].poi_model_thumb+"\" class=\"img-fluid\" id=\"csv_poiIcon_"+result.LIST[i].cid+"\">\n";
                                            html+="</a>"
                                        }

                                        $("#csvSamplePoiModel").append(html);
                                        

                                    }
                                });

                            }
                        }

                    });

                    $("#csv3dsFileUpload").change(function(e){
                        var fileList= $(this).prop('files');
                        
                        var fileCnt = fileList.length;
                        
                        if(fileCnt > 2){
                            COMMON.alert('2개 이상 업로드할 수 없습니다.','warning',function(){
                                $(this).focus();
                                $("#csv3dsFileUpload").val('');
								return false;
			                });

                            
                        }

                        if(fileCnt == 1){
                            COMMON.alert('3ds, 텍스처를 선택해주세요','warning',function(){
                                $(this).focus();
                                $("#csv3dsFileUpload").val('');
								return false;
			                });

                            
                        }

                        //이미지 확장자 체크
                        var imgExt = ['png','jpg','jpeg'];
                        var dsCheck=false;
                        var imgCheck =false;
                        
                        var modelFileInfo = {
                            fileName :'',
                            indx:0,
                            baseFileName:''
                        }

                        var textureFile = {
                            fileName :'',
                            indx:0,
                            baseFileName:''
                        }

                        for(var i=0;i<fileCnt;i++){
                           
                            var fileName = fileList[i].name;
                            var lastDot = fileName.lastIndexOf('.');
                            var ext = fileName.substring(lastDot+1,fileName.length).toLowerCase();
                            var baseFileName = fileName.substring(0,lastDot);
                           
                            if(ext == '3ds'){
                                dsCheck=true;
                                modelFileInfo.fileName=fileName;
                                modelFileInfo.indx=i;
                                modelFileInfo.baseFileName=baseFileName
                            }

                            if(ext !='3ds' && imgExt.indexOf(ext) != -1){
                                imgCheck=true;
                                textureFile.fileName=fileName;
                                textureFile.indx=i;
                                textureFile.baseFileName=baseFileName
                            }

                        }

                        if(textureFile.baseFileName != modelFileInfo.baseFileName){
                            COMMON.alert('3ds,텍스처 파일명이 서로 다릅니다.','warning',function(){
                                $(this).focus();
                                $("#csv3dsFileUpload").val('');
								return false;
			                });
                            return false;
                        }

                        if(dsCheck == false && imgCheck==false){
                            COMMON.alert('3ds, 텍스처를 선택해주세요','warning',function(){
                                $(this).focus();
                                $("#csv3dsFileUpload").val('');
								return false;
			                });                            
                            return false;
                        }
                        
                        if(dsCheck == false && imgCheck==true){
                            COMMON.alert('3ds를 선택해주세요','warning',function(){
                                $(this).focus();
                                $("#csv3dsFileUpload").val('');
								return false;
			                });

                            return false;

                        }
                        
                        if(dsCheck == true && imgCheck==false){
                            COMMON.alert('텍스처를 선택해주세요','warning',function(){
                                $(this).focus();
                                $("#csv3dsFileUpload").val('');
								return false;
			                });

                            return false;
                        }

                        /*for(var i=0;i<fileList.length;i++){
                           
                            var fileName = fileList[i].name;
                            var lastDot = fileName.lastIndexOf('.');
                            var ext = fileName.substring(lastDot+1,fileName.length).toLowerCase();
                            
                        }*/
                        
                        var textureFile = fileList[textureFile.indx];
                        var modelFile = fileList[modelFileInfo.indx];

                        //이미지 사이즈 구하기
                        dtcFile.type.csv.getTextureSize(textureFile).then(size=>{
                            
                            var width = size.width
                            var height =size.height;
                            
                            if(width > 2048 && height > 2048){
                                COMMON.alert('텍스처 권장 사이즈는 1024*1024 입니다.','warning',function(){
                                    $(this).focus();
                                    $("#csv3dsFileUpload").val('');
                                    return false;
                                });
                            }
                            
                            var formData = new FormData();
                            formData.append("texture",textureFile);
                            formData.append("model",modelFile);
                            formData.append("dataid",dtcFile.global.DATAID);

                            $.ajax({
                                url:'/geocoding/uploadModelFiles.do',
                                type:'post',
                                processData:false,
                                contentType:false,
                                data:formData,
                                success:function(result){
                                    //url 가져오기
                                    var jsonObj = JSON.parse(result);
                                    
                                    if(jsonObj.status==200){
                                        var texture = jsonObj.texture;
                                        var model = jsonObj.model;
                                        var url = jsonObj.url;

                                        $("#poiPrviewIcon").attr('src',url+texture);
                                        $("#poiPrviewIcon").show();
                                        //dtcFile.type.csv.createPoiThumb(url,texture,model);
                                    }
                                }
                            })
                        })
                    })

               
            },
            createPoiThumb:function(url,texture,model){
                
                var container = document.getElementById('poiPriView');

                var loader = new TDSLoader();
                

                var camera =  new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
                camera.position.z=2;

                var scene= new THREE.Scene();
                scene.add(new THREE.HemisphereLight());

                var loaderTexture = new THREE.TextureLoader();
			    var normal = loaderTexture.load(url+texture);

                loader.setResourcePath(url);
                loader.load( url+model, function ( object ) {
                    
                    object.traverse( function ( child ) {

                        if ( child.isMesh ) {
                            child.material.normalMap = normal;
                        }

                    } );
                    
                    scene.add( object );

                    var bbox = new THREE.Box3().setFromObject( object );
                    var center = bbox.getCenter( new THREE.Vector3() );
                    var size = bbox.getSize( new THREE.Vector3() );
                  
                    // Create a camera and position it to view the object
                    var camera = new THREE.PerspectiveCamera( 75, 1, 0.1, 1000 );
                    camera.position.set( center.x+100, center.y+100, center.z + size.z * 2 );
                    camera.lookAt(object.position);
                })

                var renderer = new THREE.WebGLRenderer({
                    preserveDrawingBuffer: true,
                    antialias: true
                });
                renderer.setSize(200, 200);
                renderer.setPixelRatio(1);
                container.appendChild(renderer.domElement);
             
                function render() {
                    renderer.render(scene, camera);
                    requestAnimationFrame(render);
                }
                
                render();
            },
            getTextureSize:function(imgFile){
                
                var img = new Image();
                img.src= URL.createObjectURL(imgFile);
                
                return new Promise((resolve,reject)=>{
                    
                    img.onload = function(){
                    
                        var width = img.width;
                        var height = img.height;

                        resolve({width:width,height:height});
                    }
              })
            },
            changeCharset:function(charset){
                
                var data={
                    dataId:dtcFile.global.DATAID,
                    encoding:charset
                }
                
                $("#csvSampleBody").empty();
                $("#csvSampleHeader").empty();

                $("#coordsXCsvList").empty();
                $("#coordsYCsvList").empty();

                $("#markerCsvList").empty();
                $("#addrCsvList").empty();
                
                $.ajax({
                    url:'../ide/changeCsvCharset.do',
                    type:'POST',
                    data:data,
                    dataType:'json',
                    success:function(result){
                        
                        var html="";
                        var headerHtml="";
                        var markerHtml="<option value=\"N/A\">선택</option>";
                        var records = result.RECORD.LIST;
                        var headers = result.RECORD.HEADER;
                        var optionHtml="<option value=\"N/A\">선택</option>";

                        if(headers != 'undefined' || headers != null){
                            for(var i=0;i<headers.length;i++){
                                var headerStr = headers[i];

                                if(charset=="utf-8"){
                                    if(headerStr.charCodeAt(0)===0xFEFF){
                                        headerStr=headerStr.substr(1);
                                    }
                                }
                                
                                headerHtml+="<th nowrap>"+headerStr+"</th>\n"
                               
                                var selected="";
                               
                                if(headerStr=="경도" || headerStr=="위도" || headerStr=="x" || headerStr.toLowerCase()=="y" || headerStr.toLowerCase()=="lon" || headerStr.toLowerCase()=="lat" || headerStr.toLowerCase()=="latitude" || headerStr.toLowerCase()=="longitude"){
                                    selected="selected";
                                }
                                
                                optionHtml+="<option value=\""+i+"\" "+selected+">"+headerStr+"</option>";
                                markerHtml+="<option value=\""+i+"\">"+headerStr+"</option>";
                            }

                            $("#csvSampleHeader").append(headerHtml);
                            $("#coordsXCsvList").append(optionHtml);
                            $("#coordsYCsvList").append(optionHtml);
                            $("#markerCsvList").append(markerHtml);
                            $("#addrCsvList").append(markerHtml);
                        }

                        if(records != 'undefined' || records != null){

                            for(var i=0;i<records.length;i++){
                                html+="<tr>\n";

                                var record = records[i];

                                for(var j=0;j<record.length;j++){
                                    var recordStr = record[j];

                                    if(charset=="utf-8"){
                                        if(recordStr.charCodeAt(0)===0xFEFF){
                                            recordStr=recordStr.substr(1);
                                        }
                                    }
                                    html+="<td nowrap>"+recordStr+"</td>\n"
                                }

                                html+="</tr>\n";
                            }

                            $("#csvSampleBody").append(html);

                        }
                    }
                });

            },
            convertProgress:function(obj){
                //console.log(obj);
                
                $("#uploadFileWizardPrgss").css('width',"0%");
                $("#uploadFileWizardPrgss").text("0%");
                
                var dataName = dtcFile.type.csv.global.uploadData.layerName;
                var dataId = obj.DATAID;
                var poitype=obj.POI_TYPE;
                var poiIndx = obj.POI_INDEX;

                $("#uploadedLayerName").text(dataName);
                $("#preViewLayerImg").attr('src',obj.THUMB);

                $("#cloudProgrss").show();
                $("#uploadTypeTxt").text('csv 변환 중...');

                var topic = obj.TOPIC;
                //console.log(topic);

                var clientId= Math.random().toString(16).substring(2, 8);
                var client = new Paho.MQTT.Client('mqtt-ws.egiscloud.com', 443, '/ws', clientId);
                
                client.connect({
                    useSSL: true,
                    keepAliveInterval:20,
                    onSuccess:function(){
                        client.subscribe(topic);
                    }
                });

                client.onMessageArrived = function(message){
                
                    var jsonObj = JSON.parse(message.payloadString);
                    var percent = jsonObj.percent;
                    var status = jsonObj.status;
                
                    $("#uploadFileWizardPrgss").css('width',percent+"%");
                    $("#uploadFileWizardPrgss").text(percent+"%");

                    if(status == 1){
                        setTimeout(function(){
                            
                            $("#uploadFileWizardPrgss").text('완료');
                            $("#cloudProgrss").hide();

                            client.disconnect();

                            dtcFile.type.csv.callCsvTileLayer(dataId,poitype,poiIndx);

                        },2000)
                    }
                }

            },
            callCsvTileLayer:function(dataId, type, poiIndx){
        
                COMMON.blockUIdiv("MapContainer",'레이어 호출 중입니다..');

                var data={
                    dataId:dataId,
                    type:type,
                    poiIndx:poiIndx,
                    encoding:dtcFile.type.csv.global.uploadData.encoding
                };

                $.ajax({
                    url:'./geocoding/updateConvert.do',
                    type:'post',
                    data:data,
                    dataType:'json',
                    success:function(result){
                        
                        dtcFile.type.csv.callTileLayer(result);
                        dtcFile.type.csv.addUILayer(result);

                        COMMON.unblockUIdiv("MapContainer");
                    }
                });
            },
            setPoiImg:function(indx,type){
                
                dtcFile.type.csv.global.POI_IMG_INDX=indx;
                
                if(type=="M"){
                    var src = $("#csv_poiIcon_"+indx).attr('src');
                    dtcFile.type.csv.global.poiSrc=src;
                    $("#poiPriveIconText").hide();
                    $("#poiPrviewIcon").attr('src',src);
                    $("#poiPrviewIcon").show();
                }else{
                    var src = $("#csv_poiIcon_"+indx).attr('src');
                    dtcFile.type.csv.global.poiSrc=src;
                }

            },
            setProgress:function(obj){
              
                var dataId=obj.DATAID;
                var dataName = obj.DATA_NAME;
                var poiType=obj.POI_TYPE;
                var poiIndx = obj.POI_INDEX;

                $("#uploadFileWizardPrgss").css('width',"0%");
                $("#uploadFileWizardPrgss").text("0%");

                $("#uploadedLayerName").text(dataName);
                $("#preViewLayerImg").attr('src',obj.THUMB);

                $("#cloudProgrss").show();
                $("#uploadTypeTxt").text('tile layer 변환 중...');

                dtcFile.type.csv.interval = setInterval(function(){

                    $.ajax({
                        url:'./geocoding/getProgress.do',
                        type:"POST",
                        data:{dataId:dataId,type:poiType,poiIndx:poiIndx},
                        dataType:'json',
                        success:function(result){
                            //console.log(result);
                            if(result.RS.PERCENT != null){
                                $("#uploadFileWizardPrgss").css('width',result.RS.PERCENT+"%");
                                $("#uploadFileWizardPrgss").text(result.RS.PERCENT+"%");
                            }

                            if(result.RS.PERCENT=="100"){
                                $("#uploadFileWizardPrgss").css('width',result.RS.PERCENT+"%");
                                $("#uploadFileWizardPrgss").text(result.RS.PERCENT+"%");

                                clearInterval(dtcFile.type.csv.interval);
                                
                                setTimeout(function(){
                                    dtcFile.type.csv.callTileLayer(result);
                                    dtcFile.type.csv.addUILayer(result);
                                },1000)
                                
                            }
                            
                        }
                    })

                },3000)
            },
            addUILayer:function(obj){
                
                var minx = obj.RS.MINX;
                var miny = obj.RS.MINY;
                var maxx = obj.RS.MAXX;
                var maxy = obj.RS.MAXY;
                var col = obj.RS.COL;

				if(col == "-1"){
					//DOCS
					dtcFile.docs.addUILayer(obj);
					return;
				}
                var dataType = "C"

                var dataId=obj.RS.DATAID;
                var attrId = "memLayer_"+dataId
                //var layer_name_value = obj.RS.LAYER_NAME;
                var layer_name_value = "meta_asset_"+dataId;
                var layer_name = obj.RS.DATA_NAME;
                var thumbImg=obj.RS.THUMB;
                var layerDate=obj.RS.DATE;
                

                dtcFile.setLayerView(minx,miny,maxx,maxy);

                if(dtcLayer.CSV.layerList == null){
                    dtcLayer.CSV.layerList = new Module.JSLayerList(false);
                }
             
                var onLayerInfo = {
                    dataId:dataId,
                    name:obj.RS.DATA_NAME,
                    type:'C'
                };
                var layerParam ={
                    dataId:obj.RS.DATAID,
                    minx:obj.RS.MINX,
                    miny:obj.RS.MINY,
                    maxx:obj.RS.MAXX,
                    maxy:obj.RS.MAXY
                    
                }
    
                dtcLayer.global.layersOnInfo.push(onLayerInfo);
                dtcLayer.global.layerVisbleList.push(layerParam);
                if(Module.XDGetMouseState()==1){
                    Module.XDSetMouseState(6);
                    Module.canvas.addEventListener('Fire_EventSelectedObject',dtcLayer.CSV.getSingleCsvProperty);
                }

                if(layer_name.length > 35 ){
                    layer_name = layer_name.substring(0,35)+"...";
                }

                var html ="<div class=\"card mb-0\" id=\"MEM_LAYER_"+dataId+"\">\n";
                html+=" <div class=\"card-body d-flex justify-content-between align-items-start pb-1 pt-3\">\n";
                html+="     <div>\n";
                html+="         <label class=\"custom-control custom-checkbox\">\n";
                html+="             <input type=\"checkbox\" class=\"custom-control-input layer_input_check\" value=\""+ layer_name_value +"\" id =\""+attrId+"\" checked>\n";
                html+="             <input type=\"hidden\" value=\"C\" class=\"layerDataTypeInfo\">\n"
                html+="                 <span class=\"custom-control-label\">\n";
                html+="                     <a class=\"text-body ts-11 font-weight-semibold\" href=\"javascript:dtcFile.setLayerView('"+parseFloat(minx)+"','"+parseFloat(miny)+"','"+parseFloat(maxx)+"','"+parseFloat(maxy)+"');\">"+layer_name+"</a>\n";
                html+="                 </span>\n";
                html+="         </label>\n";
                html+="     </div>\n";
                html+="     <div class=\"btn-group project-actions\">\n";
                html+="         <button type=\"button\" class=\"btn btn-default btn-xs rounded-pill icon-btn md-btn-flat hide-arrow dropdown-toggle\" data-toggle=\"dropdown\" aria-expanded=\"false\">\n";
                html+="             <i class=\"ion ion-ios-more\"></i>\n";
                html+="         </button>\n";
                html+="         <div class=\"dropdown-menu dropdown-menu-right ts-9\">\n";
                //html+="             <a class=\"dropdown-item\" href=\"javascript:dtcFile.type.csv.exportCsv('"+dataId+"')\"><span class=\"fas fa-file-export\"></span> 내보내기</a>\n";
                html+="               <a class=\"dropdown-item\" href=\"javascript:dtcFile.type.csv.exportCSV('"+dataId+"')\"><span class=\"fas fa-file-export\"></span> 내보내기</a>\n"
                html+="               <a class=\"dropdown-item\" href=\"javascript:dtcAiSetting.exportLayerData('"+dataId+"')\"><span class=\"lnr lnr-bubble\"></span> AI</a>\n"
				html+="               <a class=\"dropdown-item\" href=\"javascript:dtcFile.type.csv.getProperties('"+dataId+"')\"><span class=\"fas fa-clipboard-list\"></span> 속성</a>\n"
                html+="               <a class=\"dropdown-item\" href=\"javascript:dtcFile.getLayerInfo('"+dataId+"');\"><span class=\"fas fa-info\"></span> 정보</a>\n"        
                html+="               <a class=\"dropdown-item\" href=\"javascript:dtcFile.delete('"+dataId+"')\"><span class=\"far fa-trash-alt\"></span> 삭제</a>\n"        
                html+="         </div>\n"
                html+="     </div>\n";
                html+=" </div>\n";            
                html+=" <div class=\"card-body pb-1 pt-0\">\n";
                html+="     <div class=\"media pl-0\">\n";
                html+="         <img src=\""+thumbImg+"\" class=\"d-block ui-w-120 mt-1\" style=\"height:9vh;\">\n";
                html+="         <div class=\"media-body ml-2 col-md-10 mt-1 pt-1\">\n"
                html+="             <div class=\"text-white mb-0 ts-10 pb-2\">\n";
                html+="                    <span class=\"d-block mb-1 pb-1\"><i class=\"vacancy-tooltip far fa-map\"></i> EPSG:4326</span>\n";
                html+="                    <span class=\"d-block mb-1 pb-1\"><i class=\"vacancy-tooltip fas fa-border-style\"></i> CSV</span>"                                
                html+="                    <span class=\"d-block mb-1\">date: "+layerDate+"</span>"
                html+="             </div>\n";
                html+="         </div>\n";
                html+="     </div>\n";
                html+=" </div>\n"
                html+=" <div class=\"card-body pt-1 pb-3\">\n"
                html+="     <div class=\"row\">\n"
                html+="         <div class=\"col text-right\">\n";
                html+="             <div class=\"font-weight-bold text-info ts-9\"><i class=\"fas fa-file-csv\"></i> CSV</div>\n";
                html+="         </div>\n";
                html+="     </div>\n";
                html+=" </div>\n";
                html+=" <hr class=\"m-0\">\n"
                html+="</div>"
           
                $("#memberLayerLists").prepend(html);
                $("#memberLayerLists").on("click", ".layer_input_check", dtcLayer.layerInputCheck);
                
                

            },
            callTileLayer:function(obj){
                //POI 생성
              var visibleType=obj.RS.AREA_TYPE;
                var dataId = obj.RS.DATAID;
                var layerName = "meta_asset_"+dataId;
                var workspace = obj.RS.WORKSPACE;
                var csvLayer = obj.RS.LAYER_NAME;
                var poiColor = obj.RS.POI_COLOR;
                var poiType = obj.RS.POI_TYPE;
                var props = obj.RS.PROP;
                props = props.replace(/_/gi, "").replace(/\s*/g, "");
                var encodeProps = encodeURI(props);
                Module.setLimitObjectMax(5);
                
                var host = window.location.host;
                var layerList = new Module.JSLayerList(false);

                if(obj.RS.POI_TYPE=="0"){
                  
                    dtcFile.type.csv.global.POI= dtcFile.type.csv.createPoiImg(obj.RS.POI_COLOR);
                    dtcFile.type.csv.global.GROUP_POI=dtcFile.type.csv.createGroupPoiImg(obj.RS.POI_COLOR);

                    //Module.XDEMapCreateLayer(obj.RS.LAYER_NAME, "http://www.dtwincloud.com"+obj.RS.TILE_URL, 0, true, true, true, 22, 0, 15);
                    //Module.XDEMapCreateLayer(obj.RS.LAYER_NAME, "//"+host+obj.RS.TILE_URL, 0, true, true, true, 22, 0, 15);
                    Module.XDEMapCreateLayer(layerName, "https://www.egiscloud.com/csv/"+visibleType+"/"+workspace+"/"+csvLayer+"/"+encodeProps, 0, true, true, true, 22, 0, 15);
                    Module.setVisibleRange(layerName,15.0,40000000);

                    var layer = layerList.nameAtLayer(layerName);
                    layer.setUserTileJsonParsing(false);
                    layer.setUserTileLoadCallback(function(_layerName,_tile,_data){
                        const stringFromBinary = new TextDecoder('utf-8').decode(_data);
                        const jsonObject = JSON.parse(stringFromBinary);
                        
                        if(typeof jsonObject.status != 'undefined' && jsonObject.status=='no'){
                            return false;
                        }

                        dtcFile.type.csv.insertTileObj(_layerName,_tile,jsonObject,null,poiColor,visibleType);

                    });

                }else if(obj.RS.POI_TYPE=="1"){//이미지

                    dtcFile.type.csv.global.GROUP_POI=dtcFile.type.csv.createGroupPoiImg("#FFD950");
                    dtcFile.type.csv.createImagePoi(obj.RS.POI_FILE_URL,function(_image){
                        
                        //Module.XDEMapCreateLayer(obj.RS.LAYER_NAME, "http://www.dtwincloud.com"+obj.RS.TILE_URL, 0, true, true, true, 22, 0, 15);
                        Module.XDEMapCreateLayer(layerName, "https://www.egiscloud.com/csv/"+visibleType+"/"+workspace+"/"+csvLayer+"/"+encodeProps, 0, true, true, true, 22, 0, 15);
					    Module.setVisibleRange(layerName,15.0,40000000);

                        var layer = layerList.nameAtLayer(layerName);
                        layer.setUserTileJsonParsing(false);
                        layer.setUserTileLoadCallback(function(_layerName,_tile,_data){
                            const stringFromBinary = new TextDecoder('utf-8').decode(_data);
                            const jsonObject = JSON.parse(stringFromBinary);
                            
                            if(typeof jsonObject.status != 'undefined' && jsonObject.status=='no'){
                                return false;
                            }

                            dtcFile.type.csv.insertTileObj(_layerName,_tile,jsonObject,_image,"#258FFF",visibleType);

                        });
                    })
                }else if(obj.RS.POI_TYPE=="2"){//3ds
                    
                    dtcFile.type.csv.global.GROUP_POI=dtcFile.type.csv.createGroupPoiImg("#258FFF");
                    
                    var texture =  obj.RS.POI_TEXTURE_NAME;
				    var modelUrl = obj.RS.POI_FILE_URL;

                    var url = "//"+dtcCom.host+modelUrl;
                    var modelFileName = texture.split("\.")[0]+".3ds";
                    Module.getGhostSymbolMap().insert({
                        id:dataId.toString(),
                        texture:texture,
                        url:url+modelFileName,
                        callback:function(e){
                            
                            var key = e.id
                            
                            var textImgName = e.texture;
                            var urlTexture = url+textImgName;

                            Module.getGhostSymbolMap().setModelTexture({
                                id:key,
                                face_index:0,
                                url:urlTexture,
                                callback:function(e){
                                    
                                }
                            })

                        }
                    })

                    Module.XDEMapCreateLayer(layerName, "https://www.egiscloud.com/csv/"+visibleType+"/"+workspace+"/"+csvLayer+"/"+encodeProps, 0, true, true, true, 22, 0, 15);
                    Module.setVisibleRange(layerName,4.0,30000);

                    var layer = layerList.nameAtLayer(layerName);
                    layer.setUserTileJsonParsing(false);
                    layer.setUserTileLoadCallback(function(_layerName,_tile,_data){
                        const stringFromBinary = new TextDecoder('utf-8').decode(_data);
                        const jsonObject = JSON.parse(stringFromBinary);
                        
                        if(typeof jsonObject.status != 'undefined' && jsonObject.status=='no'){
                            return false;
                        }

                        dtcFile.type.csv.insertTileGhostSymbol(_layerName,_tile,jsonObject,"#258FFF",visibleType,dataId.toString());

                    });

                }
                
                $("#cloudProgrss").hide();
                

                $("#memberLayerLists").on("click", ".layer_input_check", dtcLayer.layerInputCheck);
               
            },
            addColumnModal:function(){
                
                var columnNm = $("#csvAddColumnNm").val();
                var columnType = $("#csvAddDataType option:selected").val();

                if(columnNm == ''){
                    
                    COMMON.alert('컬럼명을 입력해주세요','warning',function(){
                        $("#csvAddColumnNm").focus();
                        return false;
                    });

                    return;
                }

                if(columnType=='N/A'){
                    
                    COMMON.alert('타입을 선택해주세요.','warning',function(){
                        $("#csvAddDataType").focus();
                        return false;
                    });

                    return;
                }

                var data={
                    dataId:dtcFile.type.csv.global.editData.dataId,
                    column_name:columnNm,
                    column_type:columnType,
                    type:'C'
                }

                $.ajax({
                    url:'./geodata/addColumn.do',
                    type:'POST',
                    dataType:'json',
                    data:data,
                    success:function(result){
                        
                        if(result.STATUS==200){
                            
                            COMMON.alert('컬럼이 추가되었습니다.','success',function(){
                                dtcFile.type.csv.reset();
                                $("#addCsvColumnModal").modal('hide');
                            });

                        }else if(result.STATUS==300){
                            
                            COMMON.alert('칼럼명이 존재합니다.','error',function(){
                            
                                return false;
                            });
                            
                            $("#csvAddColumnNm").val('');
                            $("#csvAddColumnNm").focus();
                            
                            return false;
                        }
                        
                    }
                });

                
            },
            utf8_bytes_to_string:function(arr){
                
                if (arr == null) {
                    return null;
                }
                                        
                var result = "";
                var i;
                while (i = arr.shift()) {
                    if (i <= 0x7f) {
                        result += String.fromCharCode(i);
                    } else if (i <= 0xdf) { 
                        var c = ((i & 0x1f) << 6);
                        c += arr.shift() & 0x3f;
                        result += String.fromCharCode(c);
                    } else if (i <= 0xe0) { 
                        var c = ((arr.shift () & 0x1f) << 6) | 0x0800;
                        c += arr.shift() & 0x3f;
                        result += String.fromCharCode(c);
                    } else {
                        var c = ((i & 0x0f) << 12);
                        c += (arr.shift() & 0x3f) << 6;
                        c += arr.shift() & 0x3f;
                        result += String.fromCharCode(c);
                    }
                }
                return result;
            },
            createImagePoi:function(imgSrc,callback){
                var img = new Image();
                img.onload = function() {

                    // 3. canvas를 통해 베이스 이미지 바탕 생성
                    var canvas = document.createElement('canvas');
                    var ctx = canvas.getContext('2d');
                    canvas.width = 40;
                    canvas.height = 40;
                    ctx.drawImage(img, 0, 0,40,40);
            
                    // 이미지 데이터 반환
                    if (callback) {
                        callback( {
                            data : ctx.getImageData(0, 0, canvas.width, canvas.height).data,
                            width : canvas.width,
                            height : canvas.height
                        }) 
                    }
                };
                img.src = imgSrc;
            },
            createGroupPoiImg:function(color){
                /* POI로 표시 할 점 이미지 생성 */
                var drawCanvas = document.createElement('canvas');

                var ctx = drawCanvas.getContext('2d');
                ctx.width = 40;
                ctx.height = 40;
                ctx.clearRect(0, 0, ctx.width, ctx.height);
                                    
                var x = ctx.width / 2;
                var y = ctx.height / 2;
                                    
                // 동그라미 마커 이미지 그리기
                ctx.beginPath();
                ctx.arc(x, y, 20, 0, 2*Math.PI, false);
                ctx.globalAlpha=0.7;
                ctx.fillStyle = color;
                ctx.fill();
                ctx.lineWidth = 1;
                ctx.strokeStyle = color;
                ctx.stroke();
                                    
                // 그린 마커 이미지 데이터를 레이어 ID를 사용해 저장
                return {
                    data : ctx.getImageData(0, 0, ctx.width, ctx.height).data,
                    width : ctx.width,
                    height : ctx.height,
                    ctx:ctx
                }
            },
            createPoiImg:function(color){

                /* POI로 표시 할 점 이미지 생성 */
                var drawCanvas = document.createElement('canvas');
                
                var ctx = drawCanvas.getContext('2d');
                ctx.width = 40;
                ctx.height = 40;
                ctx.clearRect(0, 0, ctx.width, ctx.height);
                                    
                var x = ctx.width / 2;
                var y = ctx.height / 2;
                                    
                // 동그라미 마커 이미지 그리기
                ctx.beginPath();
                ctx.arc(x, y, 6, 0, 2*Math.PI, false);
                ctx.fillStyle = color;
                ctx.fill();
                ctx.lineWidth = 2;
                ctx.strokeStyle = 'white';
                ctx.stroke();
                                    
                // 그린 마커 이미지 데이터를 레이어 ID를 사용해 저장
                return {
                    data : ctx.getImageData(0, 0, ctx.width, ctx.height).data,
                    width : ctx.width,
                    height : ctx.height
                }
            },
            insertTileGhostSymbol:function(_layerName,_tile, _csvData,color,visibleType,dataId){

                var level = _tile.level;

                if(_csvData.points.length != 0){
                    //포인트 그리기
                    var layerList = new Module.JSLayerList(false);
                    var poiLayer = layerList.nameAtLayer(_layerName);
                    var points = _csvData.points;

                    for(var i=0;i<points.length;i++){
                      
                        var gid = points[i].gid;
                      
                        if(poiLayer.keyAtObject(gid.toString()) == null){
                            var geom = points[i].geometry.coordinates;
                            var lon = geom[0];
                            var lat = geom[1];
                            var altitude = Module.getMap().getTerrHeightFast(lon, lat);
                          
                            var name= points[i].props;
                            var point = Module.createPoint(gid.toString());
                            point.setPosition(new Module.JSVector3D(lon, lat, altitude));
                            
                            point.setText(name);
                            point.setMaxDistance(300);
                            point.setMinDistance(10);

                            var modelHeight = Module.getGhostSymbolMap().getGhostSymbolSize(dataId);

                            // 고스트 심볼 오브젝트 생성	
                            var newModel = Module.createGhostSymbol(gid.toString());
                            newModel.setBasePoint(0, -modelHeight.height*0.5, 0);
                            newModel.setRotation(0, 0, 0);
                            newModel.setScale(new Module.JSSize3D(1.0, 1.0, 1.0));
                            newModel.setPosition(new Module.JSVector3D(parseFloat(lon), parseFloat(lat), parseFloat(altitude)));
                            newModel.setGhostSymbol(dataId);
                            
                            var point = Module.createPoint(gid.toString());
                            point.setPosition(new Module.JSVector3D(lon, lat, altitude));
                            point.setText(name);
                            if(visibleType == 1){
                                point.setMaxDistance(3000000);
                            } 
                            else{
                                point.setMaxDistance(300000000);
                            } 
                            point.setMinDistance(10);

                            _tile.addObject(newModel);
                            _tile.addObject(point);
    
                        }
                        
                    }
                }

                if(typeof _csvData.group != 'undefined' && typeof _csvData.group.cluster_center != 'undefined' && _csvData.group.count > 2){

                    var pos = _csvData.group.cluster_center.coordinates;
                    var lon = pos[0];
                    var lat = pos[1];
                    var name = _csvData.group.count;
                    var point = Module.createPoint('cluster_cnt_'+name);
                    var altitude = Module.getMap().getTerrHeightFast(lon, lat);

                    point.setPosition(new Module.JSVector3D(lon, lat, altitude));

                    //group poi 그리기
                    var layerList = new Module.JSLayerList(true);
                    var layer = layerList.nameAtLayer(_layerName+"_csv_clustering_layer_"+level);
                    if(layer == null) {
                        layer = layerList.createLayer(_layerName+"_csv_clustering_layer_"+level, Module.ELT_3DPOINT);
                        layer.setMaxDistance(600000);
                    }
                    if(!(_layerName in dtcLayer.CSV.global.clusteringLayer)) dtcLayer.CSV.global.clusteringLayer[_layerName] = [];
                    
                    if(dtcLayer.CSV.global.clusteringLayer[_layerName].indexOf("csv_clustering_layer_"+level) < 0){
                        dtcLayer.CSV.global.clusteringLayer[_layerName].push("csv_clustering_layer_"+level);
                    }
                    dtcLayer.CSV.global.clusteringLayer[_layerName] = dtcLayer.CSV.global.clusteringLayer[_layerName].sort();
                    var max = 600000;
                    var min = 600000;
                    dtcLayer.CSV.global.clusteringLayer[_layerName].forEach(function(data){
                        var layerLevel = parseInt(data.split("csv_clustering_layer_")[1]);
                        for(var i=11;i>=layerLevel;i--){
                            min = (max * 0.2);
                        }
                        layerList.nameAtLayer(_layerName+"_"+data).setMaxDistance(max);
                        layerList.nameAtLayer(_layerName+"_"+data).setMinDistance(min);
                        
                        max = min;
                    });

                    dtcFile.type.csv.global.GROUP_POI.ctx.clearRect(0,0,dtcFile.type.csv.global.GROUP_POI.width,dtcFile.type.csv.global.GROUP_POI.height);
                    var x = dtcFile.type.csv.global.GROUP_POI.width / 2;
                    var y = dtcFile.type.csv.global.GROUP_POI.height / 2;

                    // 동그라미 마커 이미지 그리기
                    dtcFile.type.csv.global.GROUP_POI.ctx.beginPath();
                    dtcFile.type.csv.global.GROUP_POI.ctx.arc(x, y, 20, 0, 2*Math.PI, false);
                    dtcFile.type.csv.global.GROUP_POI.ctx.globalAlpha=0.7;
                    dtcFile.type.csv.global.GROUP_POI.ctx.fillStyle = color;
                    dtcFile.type.csv.global.GROUP_POI.ctx.fill();
                    dtcFile.type.csv.global.GROUP_POI.ctx.lineWidth = 1;
                    dtcFile.type.csv.global.GROUP_POI.ctx.strokeStyle = color;
                    dtcFile.type.csv.global.GROUP_POI.ctx.stroke();
                    dtcFile.type.csv.global.GROUP_POI.ctx.font='bold 15px Arial';
                    dtcFile.type.csv.global.GROUP_POI.ctx.textAlign ="center";
                    dtcFile.type.csv.global.GROUP_POI.ctx.fillStyle="white";
                    dtcFile.type.csv.global.GROUP_POI.ctx.fillText(name,dtcFile.type.csv.global.GROUP_POI.width/2,(dtcFile.type.csv.global.GROUP_POI.height/2)+4);

                    var dataBinary = dtcFile.type.csv.global.GROUP_POI.ctx.getImageData(0, 0, dtcFile.type.csv.global.GROUP_POI.width, dtcFile.type.csv.global.GROUP_POI.height).data
                    point.setImage(dataBinary, dtcFile.type.csv.global.GROUP_POI.width, dtcFile.type.csv.global.GROUP_POI.height);

                    layer.addObject(point,0);
                }

            },
            insertTileObj:function(_layerName,_tile,_csvData,poiImageData,color,visibleType){
                
                var level = _tile.level;

                if(_csvData.points.length != 0){
                    //포인트 그리기
                    var layerList = new Module.JSLayerList(false);
                    var poiLayer = layerList.nameAtLayer(_layerName);
                    var points = _csvData.points;

                    for(var i=0;i<points.length;i++){
                      
                        var gid = points[i].gid;
                      
                        if(poiLayer.keyAtObject(gid.toString()) == null){
                            var geom = points[i].geometry.coordinates;
                            var lon = geom[0];
                            var lat = geom[1];
                            var altitude = Module.getMap().getTerrHeightFast(lon, lat);
                          
                            var name= points[i].props;
                            var point = Module.createPoint(gid.toString());
                            point.setPosition(new Module.JSVector3D(lon, lat, altitude));
                            if(poiImageData != null){
                                point.setImage(poiImageData.data, poiImageData.width, poiImageData.height);//
                            }else{
                                point.setImage(dtcFile.type.csv.global.POI.data, dtcFile.type.csv.global.POI.width, dtcFile.type.csv.global.POI.height);//
                                
                            }
                            
                            point.setText(name);
                            if(visibleType == 1){
                                point.setMaxDistance(3000000);
                            } 
                            else{
                                point.setMaxDistance(300000000);
                            } 
                            _tile.addObject(point);
                        }
                        
                    }
                }

                if(typeof _csvData.group != 'undefined' && typeof _csvData.group.cluster_center != 'undefined' && _csvData.group.count > 2){

                    var pos = _csvData.group.cluster_center.coordinates;
                    var lon = pos[0];
                    var lat = pos[1];
                    var name = _csvData.group.count;
                    var point = Module.createPoint('cluster_cnt_'+name);
                    var altitude = Module.getMap().getTerrHeightFast(lon, lat);

                    point.setPosition(new Module.JSVector3D(lon, lat, altitude));

                    //group poi 그리기
                    var layerList = new Module.JSLayerList(true);
                    var layer = layerList.nameAtLayer(_layerName+"_csv_clustering_layer_"+level);
                    if(layer == null) {
                        layer = layerList.createLayer(_layerName+"_csv_clustering_layer_"+level, Module.ELT_3DPOINT);
                        layer.setMaxDistance(600000);
                    }
                    if(!(_layerName in dtcLayer.CSV.global.clusteringLayer)) dtcLayer.CSV.global.clusteringLayer[_layerName] = [];
                    
                    if(dtcLayer.CSV.global.clusteringLayer[_layerName].indexOf("csv_clustering_layer_"+level) < 0){
                        dtcLayer.CSV.global.clusteringLayer[_layerName].push("csv_clustering_layer_"+level);
                    }
                    dtcLayer.CSV.global.clusteringLayer[_layerName] = dtcLayer.CSV.global.clusteringLayer[_layerName].sort();
                    var max = 600000;
                    var min = 600000;
                    dtcLayer.CSV.global.clusteringLayer[_layerName].forEach(function(data){
                        var layerLevel = parseInt(data.split("csv_clustering_layer_")[1]);
                        for(var i=11;i>=layerLevel;i--){
                            min = (max * 0.2);
                        }
                        layerList.nameAtLayer(_layerName+"_"+data).setMaxDistance(max);
                        layerList.nameAtLayer(_layerName+"_"+data).setMinDistance(min);
                        
                        max = min;
                    });

                    dtcFile.type.csv.global.GROUP_POI.ctx.clearRect(0,0,dtcFile.type.csv.global.GROUP_POI.width,dtcFile.type.csv.global.GROUP_POI.height);
                    var x = dtcFile.type.csv.global.GROUP_POI.width / 2;
                    var y = dtcFile.type.csv.global.GROUP_POI.height / 2;

                    // 동그라미 마커 이미지 그리기
                    dtcFile.type.csv.global.GROUP_POI.ctx.beginPath();
                    dtcFile.type.csv.global.GROUP_POI.ctx.arc(x, y, 20, 0, 2*Math.PI, false);
                    dtcFile.type.csv.global.GROUP_POI.ctx.globalAlpha=0.7;
                    dtcFile.type.csv.global.GROUP_POI.ctx.fillStyle = color;
                    dtcFile.type.csv.global.GROUP_POI.ctx.fill();
                    dtcFile.type.csv.global.GROUP_POI.ctx.lineWidth = 1;
                    dtcFile.type.csv.global.GROUP_POI.ctx.strokeStyle = color;
                    dtcFile.type.csv.global.GROUP_POI.ctx.stroke();
                    dtcFile.type.csv.global.GROUP_POI.ctx.font='bold 15px Arial';
                    dtcFile.type.csv.global.GROUP_POI.ctx.textAlign ="center";
                    dtcFile.type.csv.global.GROUP_POI.ctx.fillStyle="white";
                    dtcFile.type.csv.global.GROUP_POI.ctx.fillText(name,dtcFile.type.csv.global.GROUP_POI.width/2,(dtcFile.type.csv.global.GROUP_POI.height/2)+4);

                    var dataBinary = dtcFile.type.csv.global.GROUP_POI.ctx.getImageData(0, 0, dtcFile.type.csv.global.GROUP_POI.width, dtcFile.type.csv.global.GROUP_POI.height).data
                    point.setImage(dataBinary, dtcFile.type.csv.global.GROUP_POI.width, dtcFile.type.csv.global.GROUP_POI.height);

                    layer.addObject(point,0);
                }
                
               
       
            },
            getCsvSampleLists: function(obj, callback) {

                $.ajax({
                    url: './ide/getCsvSampleLists.do',
                    type: 'POST',
                    data: obj,
                    dataType: 'json',
                    success: callback
                });

            },
            getThumbNailImg: function(obj, callback) {

                COMMON.blockUIdiv("csvFilePreview", "이미지 생성 중...");

                $.ajax({
                    url: './ide/getCsvThumbnail.do',
                    type: 'POST',
                    data: obj,
                    dataType: 'json',
                    success: callback
                });
            },
            getProperties:function(dataId){
                
                $("#shpPropertyDisplay").hide();
                $("#shp3dsDisplay").hide();

                var data={
                    dataId:dataId
                }

                dtcFile.type.csv.global.editData = {
                    dataId: dataId
                }

                $("#csvPropertiesHeader").empty();
                $("#csvPropertiesBody").empty();
                $("#csvPropertiesColumns").empty();

                $.ajax({
                    url:'./geocoding/getPropertyList.do',
                    type:'POST',
                    data:data,
                    dataType:'json',
                    success:function(result){
                        
                        var headers = [];
                        var headerHtml="";
                        var htmlList ="";
                        var headerOption="<option value=\"N/A\">필드 선택</option>";
                        if(result.HEADER.length != 0){
                            
                            headerHtml = "<tr>";
                            headerHtml+="<th style=\"white-space: nowrap;\">GEO</th>"
                            
                            for(var i=0;i<result.HEADER.length;i++){
                                var header = result.HEADER[i];
                                headers.push(header.column_name);
                                
                                if(header.column_name != "dbpid" && header.column_name != "geo"){
                                    headerHtml+="<th style=\"white-space: nowrap;\">"+header.column_name+"</th>"
                                    headerOption+="<option value=\""+header.column_name+"\">"+header.column_name+"</option>\n";
                                }
                            }

                            headerHtml+="</tr>"
                            htmlList = ""

                            if(result.LIST.length != 0){
                                
                                for(var i=0;i<result.LIST.length;i++){
                                    
                                    htmlList+="<tr>\n"

                                    for(var j=0;j<headers.length;j++){
                                        var column = headers[j];
                                        
                                        if(column != "geo"){
                                            
                                            if(column == "dbpid"){
                                                htmlList+="<td style=\"white-space: nowrap;\">\n"
                                                htmlList+=" <button class=\"btn icon-btn btn-sm btn-outline-info borderless geoCsvBtn\" value=\""+result.LIST[i][column]+"\">\n"
                                                htmlList+="     <span class=\"fas fa-map-marker-alt\"></span>\n"
                                                htmlList+=" </button>\n"
                                                htmlList+="</td>\n"
                                            }else{
                                                //htmlList+="<td style=\"white-space: nowrap;\">"+result.LIST[i][column]+"</td>";
                                                
                                                
                                                htmlList+="<td style=\"white-space: nowrap;\">\n";

                                                if(column=="경도" || column=="위도" || column=="x" || column.toLowerCase()=="y" || column.toLowerCase()=="lon" || column.toLowerCase()=="lat" || column.toLowerCase()=="latitude" || column.toLowerCase()=="longitude"){
                                                    htmlList+=" <span class=\"text-white \">"+result.LIST[i][column]+"</span>\n"
                                                }else{
                                                    htmlList+=" <span class=\"text-white csvAttrEditBtn\">"+result.LIST[i][column]+"</span>\n"
                                                    htmlList+="<input type=\"hidden\" value=\""+result.LIST[i]['dbpid']+"#"+column+"#"+result.LIST[i][column]+"\"/>"
                                                }
                                                
                                                htmlList+="</td>\n"

                                            }

                                        }

                                    }

                                    htmlList+="</tr>\n"
                                    
                                }
    
                            }
                            htmlList+=""
                            
                        }

                        //console.log(headerHtml+htmlList);
                        $("#csvPropertyName").text(result.LAYER_NAME);
                        $("#csvPropertiesHeader").append(headerHtml);
                        $("#csvPropertiesBody").append(htmlList);
                        $("#csvPropertiesColumns").append(headerOption);
                        $("#csvPropertyDisplay").show();

                        dtcFile.type.csv.global.scrollbar = new PerfectScrollbar(document.getElementById('csvPropertiesTable'));
                        dtcFile.type.csv.initGeometryEvent();
                    }
                });
            },
            initGeometryEvent:function(){   

                $("#closeCsvAttrBtn").on('click',function(e){
                    
                    $("#csvPropertyDisplay").hide();

                    $("#csvPropertiesColumns").empty();
                    $("#csvPropertiesHeader").empty();
                    $("#csvPropertiesBody").empty();

                    $("#csvAttrSearchTxt").val('')

                    dtcFile.type.csv.global.pageNum = 0;

                    dtcFile.type.csv.global.checkSearch = false;
                    dtcFile.type.csv.global.moreCheck = false;

                    if (dtcFile.type.csv.global.scrollbar != null) {

                        var scrollElement = document.getElementById('csvPropertiesTable');
                        scrollElement.removeEventListener('ps-y-reach-end',dtcFile.type.csv.moreGetPropertyList);

                        dtcFile.type.csv.global.scrollbar.destroy();
                        dtcFile.type.csv.global.scrollbar = null;
                    }

                    dtcFile.type.csv.global.editData = null;

                });

                if (!dtcFile.type.csv.global.moreCheck) {

                    var scrollElement = document.getElementById('csvPropertiesTable');
                    scrollElement.addEventListener('ps-y-reach-end',dtcFile.type.csv.moreGetPropertyList);

                    dtcFile.type.csv.global.moreCheck = true;

                }

                //포인트 이동
                $(".geoCsvBtn").on('click',dtcFile.type.csv.getCsvGeometry);
                //검색 이벤트 초기화
                $("#csvAttrSearchBtn").on('click',dtcFile.type.csv.searchProperties);
                $("#csvAttrSearchTxt").on('keyup',dtcFile.type.csv.searchProperties);
                //속성 수정 이벤트
                $(".csvAttrEditBtn").on('click',dtcFile.type.csv.editProperties)

            },
            moreGetPropertyList:function(e){

                if (!dtcFile.type.csv.global.checkSearch) {
                    
                    dtcFile.type.csv.global.pageNum += 10;
                    dtcFile.type.csv.global.editData.pageNum = dtcFile.type.csv.global.pageNum;

                    $(".geoCsvBtn").off('click', dtcFile.type.csv.getCsvGeometry);
                    $(".csvAttrSearchBtn").off('click',dtcFile.type.csv.editProperties);

                    $.ajax({
                            url: './geocoding/getCsvPropsMore.do',
                            type: 'POST',
                            data: dtcFile.type.csv.global.editData,
                            dataType: 'json',
                            success: function(result) {
                                // console.log(result);
                                var objHeader = result.HEADER;
                                var objList = result.PROPERTY;

                                var headerList = new Array();

                                for (var i = 0; i < objHeader.length; i++) {

                                    if (objHeader[i].column_name != "geo") {
                                        headerList.push(objHeader[i].column_name);
                                    }

                                }
                                
                                var html = "";

                                if(objList.length != 0){
                                    for(var i=0;i<objList.length;i++){

                                        var obj = objList[i];
                                        
                                        html+="<tr>\n";
    
                                        for(var j=0;j<headerList.length;j++){
    
                                            //html+="<td>"+obj[headerList[j]]+"</td>";
    
                                            var column = headerList[j];
    
                                            if(column == "dbpid"){
                                                html+="<td style=\"white-space: nowrap;\">\n"
                                                html+=" <button class=\"btn icon-btn btn-sm btn-outline-info borderless geoCsvBtn\" value=\""+obj[column]+"\">\n"
                                                html+="     <span class=\"fas fa-map-marker-alt\"></span>\n"
                                                html+=" </button>\n"
                                                html+="</td>\n"
                                            }else{
                                                html+="<td style=\"white-space: nowrap;\">\n";

                                                if(column=="경도" || column=="위도" || column=="x" || column.toLowerCase()=="y" || column.toLowerCase()=="lon" || column.toLowerCase()=="lat" || column.toLowerCase()=="latitude" || column.toLowerCase()=="longitude"){
                                                    html+=" <span class=\"text-white\">"+obj[column]+"</span>\n"
                                                }else{

                                                    html+=" <span class=\"text-white csvAttrEditBtn\">"+obj[column]+"</span>\n"
                                                    html+="<input type=\"hidden\" value=\""+obj['dbpid']+"#"+column+"#"+obj[column]+"\"/>"
                                                }

                                                html+="</td>\n"
                                                
                                            }
    
                                        }
                                        html+="</tr>\n";
    
                                    }
    
                                    $("#csvPropertiesBody").append(html);
                                }
                               
                       
                                $(".geoCsvBtn").on('click',dtcFile.type.csv.getCsvGeometry);
                                
                                $("#csvPropertiesBody").on("click", ".csvAttrEditBtn", dtcLayer.layerInputCheck);
                            },
                            error: function(request, status, error) {
                                dtcFile.type.csv.global.pageNum = 0;
                                dtcFile.type.csv.global.editData.pageNum = 0;
                            }
                        });
                }
            },
            reset:function(){
                $("#csvPropertiesBody").empty();

                $("#csvAttrSearchTxt").val('');

                $(".geoCsvBtn").off('click', dtcFile.type.csv.getCsvGeometry);
                $(".csvAttrEditBtn").off('click',dtcFile.type.csv.editProperties);

                dtcFile.type.csv.global.pageNum = 0;
                dtcFile.type.csv.global.editData.pageNum = 0;
                dtcFile.type.csv.global.checkSearch = false;

                if (dtcFile.type.csv.global.scrollbar != null) {
                    dtcFile.type.csv.global.scrollbar.destroy();
                    dtcFile.type.csv.global.scrollbar = null;
                }
                $("#closeCsvAttrBtn").off('click');
                $("#csvAttrSearchTxt").off('keyup');

                dtcFile.type.csv.getProperties(dtcFile.type.csv.global.editData.dataId);
            },
            searchProperties:function(e){

                if((e.type=='keyup' && e.keyCode==13) || e.type=='click'){
                    
                    dtcFile.type.csv.global.checkSearch = true;

                    var checkColumn = $("#csvPropertiesColumns option:selected").val();

                    if(checkColumn=="N/A"){
                        
                        COMMON.alert('필드를 선택해주세요','warning',function(e){
                            
                            $("#csvPropertiesColumns").focus();
    
                            return false;
    
                        })
    
                        return;
                    }
    
                    var serachWord=$("#csvAttrSearchTxt").val();
                    
                    if(serachWord=='' || serachWord=='undefined'){
                        
                        COMMON.alert('속성을 입력해주세요','warning',function(e){
                            
                            $("#csvAttrSearchTxt").focus();
    
                            return false;
    
                        })
    
                        return;
                    }

                    dtcFile.type.csv.global.editData.keyword = serachWord;
                    dtcFile.type.csv.global.editData.column = checkColumn;
                    
                    $("#csvPropertiesBody").empty();

                    $.ajax({
                        url:'./geocoding/searchProps.do',
                        type:'POST',
                        data:dtcFile.type.csv.global.editData,
                        dataType:'json',
                        success:function(result){

                            var list = result.LIST;
                            var header = result.HEADER;
                            var html="";

                            var headers = new Array();
                                
                            for(var i=0;i<header.length;i++){
                                
                                var column = header[i].column_name;
                                
                                if(column != "geo"){
                                    headers.push(column);
                                }

                            }

                            if(list.length != 0){
                                

                                for(var i=0;i<list.length;i++){
                                   
                                    var obj = list[i];
                                    
                                    html+="<tr>\n";
        
                                    for(var j=0;j<headers.length;j++){
                                        var column = headers[j];
                                        if(column == "dbpid"){
                                            html+="<td style=\"white-space: nowrap;\">\n"
                                            html+=" <button class=\"btn icon-btn btn-sm btn-outline-info borderless geoCsvBtn\" value=\""+obj[column]+"\">\n"
                                            html+="     <span class=\"fas fa-map-marker-alt\"></span>\n"
                                            html+=" </button>\n"
                                            html+="</td>\n"
                                        }else{
                                           // html+="<td style=\"white-space: nowrap;\">"+obj[column]+"</td>";
                                            
                                            
                                            html+="<td style=\"white-space: nowrap;\">\n";

                                            if(column=="경도" || column=="위도" || column=="x" || column.toLowerCase()=="y" || column.toLowerCase()=="lon" || column.toLowerCase()=="lat" || column.toLowerCase()=="latitude" || column.toLowerCase()=="longitude"){
                                                html+=" <span class=\"text-white\">"+obj[column]+"</span>\n"
                                            }else{
                                                html+=" <span class=\"text-white csvAttrEditBtn\">"+obj[column]+"</span>\n"
                                                html+="<input type=\"hidden\" value=\""+obj['dbpid']+"#"+column+"#"+obj[column]+"\"/>"
                                            }
                                            
                                            html+="</td>\n"
                                        }
    
                                    }
    
                                    html+="</tr>\n";
                                }

                            }else{
                            
                                var colspan = headers.length;
                            
                                html+="<tr>\n";
                                html+=" <td colspan=\""+colspan+"\">검색 결과가 없습니다.</td>\n";
                                html+="</tr>\n";
                            }

                            $("#csvPropertiesBody").append(html);
                            $(".geoCsvBtn").on('click',dtcFile.type.csv.getCsvGeometry);
                            $(".csvAttrEditBtn").on('click',dtcFile.type.csv.editProperties);

                        }
                    });
                }
            },
            getCsvGeometry:function(e){

                var value = $(this).val();
                dtcFile.type.csv.global.editData.gid = value;
                
                $.ajax({
                    url: './geocoding/getGeometryInfo.do',
                    type: 'POST',
                    data: dtcFile.type.csv.global.editData,
                    dataType: 'json',
                    success: function(result) {
                        
                        var point = JSON.parse(result.GEOMETRY.point);
                        
                        var lon = point.coordinates[0];
                        var lat = point.coordinates[1];
                        //dtcFile.type.csv.drawRttGeometry(result);
                        //일단 카메라 이동까지만
                        //var altitude = Module.getMap().getTerrHeightFast(lon, lat);

                        //Module.getViewCamera().setViewAt(lon, lat, 700, 90, 0);
						Module.getViewCamera().setLocation(new Module.JSVector3D(lon,lat, 500));
                    },
                    error: function(request, status, error) {

                    }
                });

            },
            editProperties:function(e){
                $("#csvPropsTxt").remove();
                $(".csvAttrEditBtn").show();

                if ($("#csvPropEditSubmit").length != 0) {
                    $("#csvPropEditSubmit").off('click');
                }

                var dataValue = $(this).next().val();
                var dataArr = dataValue.split("#");

                var gid = dataArr[0];
                var column = dataArr[1];
                var column_data = dataArr[2];

                dtcFile.type.csv.global.editData.gid = gid;
                dtcFile.type.csv.global.editData.column = column;
                dtcFile.type.csv.global.editData.data = column_data;

                var html = "<div class=\"d-flex\" id=\"csvPropsTxt\">\n";
                    html += "	<input type=\"text\" class=\"form-control form-control-sm\" value=\"" +column_data + "\" id=\"csvPropsInptTxt\"/>\n"
                    html += "		<button class=\"btn icon-btn btn-sm\" id=\"csvPropEditSubmit\"><span class=\"far fa-edit\"></span></button>\n";
                    html += "	</div>";

                $(this).hide();
                $(this).before(html);

                $("#csvPropsInptTxt").focus();

                $("#csvPropEditSubmit").on('click', function(e) {
                    dtcFile.type.csv.updateCsvProperties();
                });

                $("#csvPropsInptTxt").keyup(function(e) {

                    if (e.keyCode == 13) {
                        dtcFile.type.csv.updateCsvProperties();
                    }

                    if (e.keyCode == 27) {
                        $("#csvPropsTxt").next().show();
                        $("#csvPropsTxt").remove();
                    }

                });

            },
            updateCsvProperties:function(){
               
                dtcFile.type.csv.global.editData.data = $("#csvPropsInptTxt").val();

                if (dtcFile.type.csv.global.editData.data != "undefined" ||dtcFile.type.csv.global.editData.data != null) {

                    $.ajax({
                        url: './geocoding/editProperties.do',
                        type: 'POST',
                        data: dtcFile.type.csv.global.editData,
                        dataType: 'json',
                        success: function(result) {
                            // console.log(result);
                            if (result.RS == "complete") {

                                var value = result.value;

                                dtcFile.type.csv.global.editData.data = value;

                                var hiddenVal = dtcFile.type.csv.global.editData.gid+"#"+dtcFile.type.csv.global.editData.column+"#"+dtcFile.type.csv.global.editData.data;

                                $("#csvPropsTxt").next().text(value);
                                $("#csvPropsTxt").next().show();
                                $("#csvPropsTxt").next().next().val(hiddenVal);

                                $("#csvPropsTxt").remove();
                            }
                        },
                        error: function(request, status, error) {

                            if (status == "error") {
                                COMMON.alert('수정할 수 없는 데이터입니다.',
                                    'warning',
                                    function() {

                                        $("#shpPropsTxt").next()
                                            .show();
                                        $("#shpPropsTxt").remove();

                                        return false;
                                    });

                                $("#shpPropsTxt").next().show();
                                $("#shpPropsTxt").remove();

                                return false;
                            }

                        }
                    });

                } else {
                    console.log('데이터 확인')
                }
            },
            exportCSV:function(dataid){

                $("#csvExportCloseBtn").on('click',function(e){
                    $("#dtcCsvExport").modal('hide');
                    dtcFile.type.csv.global.exportCheck=false;
                })

                $("#csvFileExportBtn").on('click',function(e){
                    var dataId = $("#csvExportDataId").val();
                    dtcFile.type.csv.downloadFiles(dataId);
                })
                
                dtcFile.type.csv.global.exportCheck=true;

                $("#csvExportDataId").val(dataid);

                var data = {
                    dataid: dataid
                }

                new PerfectScrollbar(document.getElementById('csvFieldsLists'), {
                    suppressScrollX: true
                });

                $("#exportCsvName").val('');
                $("#exportCsvProps").empty();
                $("#exportCoordsCsvList").val('EPSG:4326');

                $.ajax({
                    url:'/geocoding/getExportCsvInfo.do',
                    type:'post',
                    data:data,
                    dataType:'json',
                    success:function(result){
                        
                        if(result.status==200){

                            var dataName = result.dataName;
                            //var epsgCode = result.epsg;
                            var column_fields = result.fields;

                            var html="";
                            for(var i=0;i<column_fields.length;i++){
                                var column_name = column_fields[i].column_name;
                                var data_type = column_fields[i].udt_name;

                                html +="<tr>\n"
                                html +="    <td>\n"
                                html +="        <label class=\"form-check mb-0\">\n"
                                html +="            <input type=\"checkbox\" class=\"form-check-input exportCsvProps\" value=\""+column_name+"\"/ checked>\n"
                                html +="            <div class=\"form-check-label\">"+column_name+"</div>\n"
                                html +="        </label>\n";
                                html +="    </td>\n"         
                                html +="    <td>"+data_type+"</td>\n"
                                html +=" </tr>"

                            }
                        
                            $("#exportCsvProps").append(html);
                            $("#exportCsvName").val(dataName);
                            $("#dtcCsvExport").modal('show');
                        }
                    }
                })


            },
            downloadFiles:function(dataid){
               
                /*if ($(".exportShpProps:checked").length == 0) {

                    COMMON.alert('필드를 선택해주세요', 'warning',
                        function() {
                            return false;
                        })

                    return false;
                }*/

                if ($("#exportCsvName").val() == null || $("#exportCsvName").val() == "") {

                    COMMON.alert('파일명을 입력해주세요', 'warning',function() {
                        return false;
                    });

                    return false;
                }

                var props = [];
                for (var i = 0; i < $(".exportCsvProps:checked").length; i++) {
                    var column = $(".exportCsvProps:checked").eq(i).val();
                    props.push(column);
                }

                var data = {
                    dataId: $("#csvExportDataId").val(),
                    prj: $("#exportCoordsCsvList").val(),
                    format: $("#exportCsvType option:selected").val(),
                    props: props.toString(),
                    fileName: $("#exportCsvName").val()
                };

                dtcFile.type.csv.excuteExportCsv(data);

                $("#csvExportCloseBtn").off('click');
                $("#csvFileExportBtn").off('click');
              
            },
            excuteExportCsv:function(data){
                
                dtcFile.type.csv.global.exportCheck=false;

                $.ajax({
                        url: './geocoding/exportCsvDownload.do',
                        data: data,
                        type: 'POST',
                        dataType: 'json',
                        success: function(result) {
                            
                            var progressTxt = result.PROGRESS;
                         
                            dtcFile.type.csv.global.totalRecord = result.RECORDS;
                            dtcFile.type.csv.global.exportPath = result.DIR;
                            dtcFile.type.csv.global.exportFileName = result.FILE_NAME;
                            dtcFile.type.csv.exportProgress(progressTxt);

                            $("#uploadedLayerName").text(data.fileName);
                            $("#preViewLayerImg").attr("src",result.THUMBNAIL_URL);
                            $("#uploadTypeTxt").text('Export shape...');
                            $("#dtcCsvExport").modal('hide');

                            setTimeout(function() {
                                $("#cloudProgrss").show();
                            }, 500);
                        }
                    });
            }, 
            exportProgress:function(file){
                dtcFile.type.csv.global.progInterval = setInterval(
                    function() {
    
                        var xhr = new XMLHttpRequest();
                        xhr.open("GET", file, false);
                        xhr.onreadystatechange = function() {
                            if (xhr.readyState === 4) {
                                if (xhr.status === 200 || xhr.status == 0) {
                                    var text = xhr.responseText;
    
                                    if (text.trim().toLowerCase() != "complete") {
                                        var count = parseFloat(text.trim());
                                        var total = Math.ceil(parseFloat(dtcFile.type.csv.global.totalRecord.total) / 100);
                                        var percent = Math.round((count / total) * 100);
    
                                        if (isNaN(percent) == false) {
                                            $("#uploadFileWizardPrgss").css('width',percent + "%");
                                            $("#uploadFileWizardPrgss").text(percent + "%");
                                        }
    
                                        if (percent == 100) {
                                            $("#uploadTypeTxt").text('zip 파일 생성 중...');
                                        }
    
                                    } else if (text.trim().toLowerCase() === "complete") {
    
                                        // 프로그래스 초기화 숨기기
                                        clearInterval(dtcFile.type.csv.global.progInterval);
    
                                        setTimeout(
                                            function() {
    
                                                dtcFile.type.csv.global.progInterval = null;
    
                                                $("#uploadFileWizardPrgss").css('width',"0%");
                                                $("#uploadFileWizardPrgss").text("0%");
                                                $("#cloudProgrss").hide();
    
                                                var fileUrl = dtcFile.type.csv.global.exportPath +".zip";
    
                                                var el = document.createElement('a');
                                                el.href = fileUrl;
                                                el.download = dtcFile.type.csv.global.exportFileName +".zip";
    
                                                document.body.appendChild(el);
    
                                                el.click();
    
                                                document.body.removeChild(el);
    
                                            }, 1000);
                                    }
                                }
                            }
                        }
                        xhr.send(null);
                    }, 1000);
            },

        },
        shp: {
            global: {
                editData: null,
                wmslayerList: null,
                layerList: null,
                pageNum: 0,
                checkSearch: false,
                scrollbar: null,
                moreCheck: false,
                totalRecord: 0,
                exportFileName:"",
                geometry:"",
                setInterval:null,
                POI:null,
                GROUP_POI:null,
                exportCheck:false
            },
            setting: function(result) {
                $("#shpUploadLayerSetting").show();
                var imgSrc = result.RS.THUMBNAIL_URL;

                $("#shpDataName").val(result.LAYER_NAME);
                $("#shpSampleFileName").text(result.LAYER_NAME);
                $("#selectCoordsList").empty();

                $("#fileThumNailImg").attr("src", imgSrc);
                $("#preViewLayerImg").attr("src", imgSrc);
                
                var o_srs = result.SRS_CODE;
                var charsetDbf = result.CHARSET;

                $("#dbfEncodinSelc").val(charsetDbf.toLowerCase());

                dtcFile.type.shp.global.geometry = result.GEO_TYPE;
                
                if(o_srs != 0){
                    $("#dtcFilePrjInfo").val("EPSG:"+o_srs);
                }else{
                    $("#dtcFilePrjInfo").val('');
                }
                
                $("#shpGeometryType").text(result.GEO_TYPE);

                dtcFile.type.shp.readDbfSample(result);

                $("#dbfEncodinSelc").on('change',function(e){
                    
                    var charset = $(this).val();

                    var data={
                        dataId:dtcFile.global.DATAID,
                        charset:charset
                    }

                    $.ajax({
                        url:'../ide/changeDbfCharset.do',
                        type:'POST',
                        data:data,
                        dataType:'json',
                        success:function(result){

                            dtcFile.type.shp.readDbfSample(result);

                        }
                    });

                });

                
            },
            readDbfSample:function(result){

                $("#dbfTableList").empty();

                var dbfobj = result.DBF.LIST;
                var recordCnt = result.DBF.RECORD_CNT;
                
                $("#totaldbfRecods").text(recordCnt);

                var htmlHeader="";

                var htmlBody="<tbody>\n"
              
                for(var i=0;i<dbfobj.length;i++){
                    
                    if(i==0){
                        
                        var header = dbfobj[i];
                        
                        htmlHeader+="<thead>\n";
                        htmlHeader+=" <tr>\n"
                        
                        for(var j=0;j<header.length;j++){
                            htmlHeader+=" <th nowrap>"+header[j]+"</th>\n";
                        }

                        htmlHeader+="</tr>\n"
                        htmlHeader+="</thead>"
                    }else{
                        
                        var record = dbfobj[i];

                        htmlBody+="<tr>\n";
                        
                        for(var j=0;j<record.length;j++){
                            htmlBody+="<td nowrap>"+record[j]+"</td>"
                        }

                        htmlBody+="</tr>\n";
                        
                    }
                }
                htmlBody+="</tbody>";

                var htmlTable = htmlHeader+htmlBody;
                
                $("#dbfTableList").append(htmlTable);

                new PerfectScrollbar(document.getElementById('shpDbfTblediv'), {
                    suppressScrollY: true
                });
            },
            thirdShpInfo:function(){
                
                var dataName=$("#shpDataName").val();
                var geoTye=$("#shpGeometryType").text();
                var proj=$("#dtcFilePrjInfo").val();
                var dbfCharset=$("#dbfEncodinSelc option:selected").val();
                var checkshp3d=$("#shpCheckHeight").is(":checked");

                if(checkshp3d){
                    $("#check3Dshp").text("Y");
                }else{
                    $("#check3Dshp").text("N");
                }

                var dataId = dtcFile.global.DATAID;

                $.ajax({
                    url:'../ide/getShpThumb.do',
                    type:'POST',
                    data:{dataId:dataId},
                    dataType:'json',
                    success:function(result){
                   
                        $("#fileThumNailImg").attr('src',result.IMG_INFO);
                   
                        $("#shpDataUploadName").text(dataName);
                        $("#shpGeotypUpload").text(geoTye);
                        $("#shpPrjUploadName").text(proj);
                        $("#dbfEncodingUpload").text(dbfCharset);
                    }
                })

                $("#shpUploadLayerUpload").show();
            },
            addPoiLayer:function(obj){
                
                dtcFile.type.csv.global.POI = dtcFile.type.csv.createPoiImg(obj.RS.poi_color);
                dtcFile.type.csv.global.GROUP_POI = dtcFile.type.csv.createGroupPoiImg(obj.RS.poi_color);

                var layerName = "USER_SHP_POI_"+obj.RS.dataid;
                Module.XDEMapCreateLayer(layerName, "//www.egiscloud.com"+obj.RS.meta_out_url, 0, true, true, true, 22, 0, 15);
                //Module.setVisibleRange(obj.RS.data_name,15.0,50000);

                dtcLayer.global.layerList=new Module.JSLayerList(true);
                dtcFile.type.shp.poiLayer =  dtcLayer.global.layerList.nameAtLayer(layerName);
                dtcFile.type.shp.poiLayer.setUserTileLoadCallback(function(_layerName, _tile, _data){
                        
                    var data = dtcFile.type.csv.utf8_bytes_to_string(Array.from(_data))
                    var _csvData=JSON.parse(data);

                    dtcFile.type.csv.insertTileObj(_layerName, _tile,_csvData,null,obj.RS.poi_color);

                });

                var minx=obj.RS.minx;
                var miny=obj.RS.miny;
                var maxx=obj.RS.maxx;
                var maxy=obj.RS.maxy;

                Module.getViewCamera().moveLonLatBoundary(new Module.JSVector2D(minx, miny),new Module.JSVector2D(maxx, maxy));
            },
            get3dPoiProgress:function(dataId){
                
                var data={
                    dataId:dataId
                }

                dtcFile.type.shp.global.setInterval=setInterval(function(){
                    
                    $.ajax({
                        url:'./ide/get3dPoiTileProgress.do',
                        type:'POST',
                        data:data,
                        dataType:'json',
                        success:function(result){
                            //console.log(result);
                            if(result.STATUS != 10){
                              
                                $("#uploadFileWizardPrgss").css('width',result.PROGRESS+'%');
                                $("#uploadFileWizardPrgss").text(result.PROGRESS+'%');

                            }else{
                                $("#uploadTypeTxt").text('complete');
                                $("#uploadFileWizardPrgss").css('width','100%');
                                $("#uploadFileWizardPrgss").text('100%');
                                
                                if(result.RS != 'undefined' || result.RS != null){
                                    dtcFile.type.shp.addPoiLayer(result);
                                }   

                                setTimeout(function(){
                                    $("#cloudProgrss").hide(); 
                                    clearInterval(dtcFile.type.shp.global.setInterval);

                                },1000)
                                
                            }

                            
                        }
                    });

                },3000);

            },
            uploadCloudShpServer: function(data, callback) {

                $.ajax({
                    url: './geodt/connectGeoserver.do',
                    type: 'POST',
                    data: data,
                    dataType: 'json',
                    //async:false,
                    success: callback
                });
            },
            upload3dPoiShpGeoserver:function(data,callback){
                
                $.ajax({
                    url: './ide/upload3dPoiShp.do',
                    type: 'POST',
                    data: data,
                    dataType: 'json',
                    success: callback
                });

            },
            getDbfAttrList: function(data, callback) {

                $.ajax({
                    url: './ide/getShpAttrInfo.do',
                    type: 'POST',
                    data: data,
                    dataType: 'json',
                    success: callback
                });

            },
            getConnectGeoServer: function(dataId, callback) {

                var data = {
                    DATAID: dataId
                }

                $.ajax({
                    url: './geodt/connectGeoserver.do',
                    type: 'POST',
                    data: data,
                    dataType: 'json',
                    success: callback
                });

            },
            setGeoserverlayer: function(result) {
                var type = typeof result.GEOSERVER.type == 'undefined' ? '':result.GEOSERVER.type;

                //var layerName = result.GEOSERVER.layerName;
                var geoserver_layer = result.GEOSERVER.layer;
                var workspace = result.GEOSERVER.workspace;
                //var url = result.GEOSERVER.url + "/" + workspace + "/wms?";
                var geoserver_url=dtcCom.geo_url();

                var url = "//"+geoserver_url+"/" + workspace + "/wms?";
                var dataId = result.GEOSERVER.dataId;

                var srsCode=result.SRS;
                var gemetryType=result.GEOMETRY;

                var layerDate = result.DATE;

                var thumbImg = result.THUMB_IMG;

                // var param = workspace+":"+layerName;
                var param = "";

                var layerInfo = JSON.parse(result.GEOSERVER.layerInfo.INFO);
                // console.log(layerInfo);
                var bbox = layerInfo.featureType.latLonBoundingBox;

                var maxx = bbox.maxx;
                var maxy = bbox.maxy;
                var minx = bbox.minx;
                var miny = bbox.miny;

                // WMS 레이어 추가
                dtcLayer.SHP.layerList = new Module.JSLayerList(false);

				var layerName = dtcLayer.SHP.addShapeLayer();
                if(layerName == ''){
                    dtcLayer.SHP.layerName = result.GEOSERVER.layer;
                }

				if(layerName != ""){
					layerName+=","+workspace+":"+geoserver_layer;
				}else{
					layerName+=workspace+":"+geoserver_layer;
				}
				
                dtcLayer.SHP.layer= dtcLayer.SHP.layerList.createWMSLayer("layerWMS");
                //dtcLayer.SHP.layer = dtcLayer.SHP.layerList.createWMSLayer(workspace + ":" + geoserver_layer);

                let slopeoption = {
                    url: url,
                    //layer: workspace + ":" + geoserver_layer,
                    layer: layerName,
                    minimumlevel: 5,
                    maximumlevel: 21,
                    tileSize: 256,
                    crs: "EPSG:4326",
                    parameters: {
                        version: "1.1.0"
                    }
                };

                if (dtcLayer.SHP.layer != null) {

                    dtcLayer.SHP.layer.setWMSProvider(slopeoption);
                    dtcLayer.SHP.layer.setBBoxOrder(true);
                }

                //$("#accordion-layer div").collapse('hide');

                setTimeout(
                    function() {

                        Module.getViewCamera().moveLonLatBoundary(
                            new Module.JSVector2D(minx, miny),
                            new Module.JSVector2D(maxx, maxy));

                        $("#cloudProgrss").hide();

                        if(layerName.length > 35 ){
                            layerName = layerName.substring(0,35)+"...";
                        }

                        dtcLayer.global.shpLayerList.push(workspace + ":" + geoserver_layer);

                        var html ="<div class=\"card mb-0\" id=\"MEM_LAYER_"+dataId+"\">\n";
                            html+=" <div class=\"card-body d-flex justify-content-between align-items-start pb-1 pt-3\">\n";
                            html+="     <div>\n";
                            html+="         <label class=\"custom-control custom-checkbox\">\n";
                            html+="             <input type=\"checkbox\" class=\"custom-control-input layer_input_check\" value=\""+workspace + ":" + geoserver_layer +"\" id=\"memLayer_"+dataId+"\" checked>\n";
                            html+="				<input type=\"hidden\" value=\"S\" class=\"layerDataTypeInfo\"/>"
                            html+="                 <span class=\"custom-control-label\">\n";
                            html+="                     <a class=\"text-body ts-11 font-weight-semibold\" href=\"javascript:dtcFile.setLayerView('"+minx+"','"+miny+"','"+maxx+"','"+maxy+"');\">"+result.GEOSERVER.layerName+"</a>\n";
                            html+="                 </span>\n";
                            html+="         </label>\n";
                            html+="     </div>\n";
                            html+="     <div class=\"btn-group project-actions\">\n";
                            html+="         <button type=\"button\" class=\"btn btn-default btn-xs rounded-pill icon-btn md-btn-flat hide-arrow dropdown-toggle\" data-toggle=\"dropdown\" aria-expanded=\"false\">\n";
                            html+="             <i class=\"ion ion-ios-more\"></i>\n";
                            html+="         </button>\n";
                            html+="         <div class=\"dropdown-menu dropdown-menu-right ts-9\">\n";
                            if(type=="DXF"){
                                html+="<a class=\"dropdown-item\" href=\"javascript:dtcFile.getLayerInfo('"+objId+"');\"><span class=\"fas fa-info\"></span> 정보</a>\n";
                                //html+="<a class=\"dropdown-item\" href=\"javascript:dtcFile.type.shp.setStyle('"+objId+"');\"><span class=\"fas fa-border-style\"></span> 스타일 설정</a>\n";
                                html+="<a class=\"dropdown-item\" href=\"javascript:dtcFile.delete('"+objId+"')\"><span class=\"far fa-trash-alt\"></span> 삭제</a>\n"        
                            }else{
                                html+="             <a class=\"dropdown-item\" href=\"javascript:dtcFile.type.shp.exportShp('"+dataId+"')\"><span class=\"fas fa-file-export\"></span> 내보내기</a>\n";
								html+="             <a class=\"dropdown-item\" href=\"javascript:dtcAiSetting.exportLayerData('"+dataId+"')\"><span class=\"lnr lnr-bubble\"></span> AI</a>\n"
                                html+="             <a class=\"dropdown-item\" href=\"javascript:dtcFile.type.shp.getProperties('"+dataId+"')\"><span class=\"fas fa-clipboard-list\"></span> 속성</a>\n"        
                                html+="             <a class=\"dropdown-item\" href=\"javascript:D_LAYER_STYLE.SYMBOL.SHP.setStyle('"+dataId+"')\"><span class=\"fas fa-border-style\"></span> 스타일 설정</a>\n"        
                                html+="             <a class=\"dropdown-item\" href=\"javascript:D_LAYER_STYLE.SYMBOL.SHP.showLegend('"+dataId+"')\"><span class=\"fas fa-layer-group\"></span> 범례 보기</a>\n"        
                                html+="             <a class=\"dropdown-item\" href=\"javascript:dtcFile.getLayerInfo('"+dataId+"');\"><span class=\"fas fa-info\"></span> 정보</a>\n";
                                html+="             <a class=\"dropdown-item\" href=\"javascript:dtcFile.type.shp.deleteShp('"+dataId+"')\"><span class=\"far fa-trash-alt\"></span> 삭제</a>\n"        
                            }
                            
                            html+="         </div>\n"
                            html+="     </div>\n";
                            html+=" </div>\n";            
                            html+=" <div class=\"card-body pb-1 pt-0\">\n";
                            html+="     <div class=\"media pl-0\">\n";
                            html+="         <img src=\""+thumbImg+"\" class=\"d-block ui-w-120 mt-1\" style=\"height:9vh;\">\n";
                            html+="         <div class=\"media-body ml-2 col-md-10 mt-1 pt-1\">\n"
                            html+="             <div class=\"text-white mb-0 ts-10 pb-2\">\n";
                            html+="                    <span class=\"d-block mb-1 pb-1\"><i class=\"vacancy-tooltip far fa-map\"></i> "+srsCode+"</span>\n";
                            html+="                    <span class=\"d-block mb-1 pb-1\"><i class=\"vacancy-tooltip fas fa-border-style\"></i> "+gemetryType+"</span>"                                
                            html+="                    <span class=\"d-block mb-1\">date: "+layerDate+"</span>"
                            html+="             </div>\n";
                            html+="         </div>\n";
                            html+="     </div>\n";
                            html+=" </div>\n"
                            html+=" <div class=\"card-body pt-1 pb-3\">\n"
                            html+="     <div class=\"row\">\n"
                            html+="         <div class=\"col text-right\">\n";
                            if(type=="DXF"){
                                html+="             <div class=\"font-weight-bold text-danger ts-9\"><i class=\"far fa-square\"></i> DXF</div>\n";
                            }else{
                                html+="             <div class=\"font-weight-bold text-success ts-9\"><i class=\"far fa-square\"></i> SHAPE</div>\n";
                            }
                            html+="         </div>\n";
                            html+="     </div>\n";
                            html+=" </div>\n";
                            html+=" <hr class=\"m-0\">\n"
                            html+="</div>"
                       
                        $("#memberLayerLists").prepend(html);

                        COMMON.unblockUIdiv("MapContainer");

                        /*$(".shp_input_check").on('click',function(e) {
                            var check = $(this).is(":checked");
                            var value = $(this).val();

                            if (check) {
                                dtcLayer.SHP.layerList.nameAtLayer(value).setVisible(true);
                            } else {
                                dtcLayer.SHP.layerList.nameAtLayer(value).setVisible(false);
                            }
                        });*/

                        //shp 레이어 클릭 이벤트 추가
                        $("#canvas").on('click',function(e){

                            if(dtcLayer.global.shpLayerList.length != 0){

                                var pos = new Module.JSVector2D(e.offsetX,e.offsetY);	
                                var mapPos =Module.getMap().ScreenToBoundBox(pos, 3);
				
                                var minx = mapPos.return.min.Longitude;
                                var miny = mapPos.return.min.Latitude;
                                var minHeight = mapPos.return.min.Altitude;
                                
                                var maxx = mapPos.return.max.Longitude;
                                var maxy = mapPos.return.max.Latitude;
                                var maxHeight = mapPos.return.max.Altitude;

                                var screenPosMin = Module.getMap().MapToScreenPointEX(new Module.JSVector3D(minx, miny, minHeight));
                                var screenPosMax = Module.getMap().MapToScreenPointEX(new Module.JSVector3D(maxx, maxy, maxHeight));

                                var width = Math.abs(screenPosMax.x - screenPosMin.x);
                                var height = Math.abs(screenPosMax.y - screenPosMin.y);

                                var data={
                                    minx : minx,
                                    miny : miny,
                                    maxx : maxx,
                                    maxy : maxy,
                                    layers : dtcLayer.global.shpLayerList.toString(),
                                }

                                var geoserver_url=dtcCom.geo_url();

                                var url = "//"+geoserver_url+"/wms?request=GetFeatureInfo";
                                var param = "&service=WMS";
                                    param +="&version=1.1.0"
                                    param +="&layers="+encodeURIComponent(dtcLayer.global.shpLayerList.toString());
                                    param +="&styles=";
                                    param +="&srs=EPSG%3A4326";
                                    param +="&format=image%2Fpng"
                                    param +="&bbox="+encodeURIComponent(minx+","+miny+","+maxx+","+maxy);
                                    param +="&width="+width;
                                    param +="&height="+height;
                                    param +="&query_layers="+encodeURIComponent(dtcLayer.global.shpLayerList.toString());
                                    param +="&info_format=application/json";
                                    param +="&feature_count=50";
                                    param +="&x="+width;
                                    param +="&y="+height;
                                    param +="&exceptions=application%2Fvnd.ogc.se_xml";					

                                $.ajax({
                                    url:url+param,
                                    type:'POST',
                                    data:data,
                                    success:function(result){

                                        if(typeof result === 'object' && result.features.length != 0){

                                            $("#shpSinglepropertyBody").empty();
                                            
                                            var geometryType = result.features[0].geometry.type;
                                            var properties = result.features[0].properties;

                                            var cssCheck = $("#singleShpProperties").css('display');

                                            var html="";

                                            for(key in properties){
                                                html +="<tr>\n";
                                                html +="	<td>"+key+"</td>\n";	

                                                var value = properties[key];

                                                if(value =='undefined' || value==null){
                                                    value="";
                                                }

                                                html +="	<td>"+value+"</td>\n";
                                                html +="</tr>\n";	
                                            }
                                            
                                            $("#shpSinglepropertyBody").append(html);
                                            $("#geometryTypeStr").text(geometryType);

                                            if(cssCheck=="none"){
                                                $("#singleShpProperties").show();
                                            }

                                        }

                                    }
                                })
                            }
                        })

                    }, 1000);

            },
            errorShpUpload:function(dataId,callback){
                
                $.ajax({
                    url:'./ide/uploadErrorShp.do',
                    data:{dataId:dataId,geoType:dtcFile.type.shp.global.geometry},
                    dataType:'json',
                    type:'POST',
                    success:function(result){
                        dtcFile.type.shp.setGeoserverlayer(result);
                    }
                })

            },
            exportShp: function(did) {

                var data = {
                    dataId: did
                }

                dtcFile.type.shp.global.exportCheck=true;

                $("#exportCoordsShpList").empty();
                $("#exportShpProps").empty();
                $("#exportShpName").val('');

                $("#shpExportDataId").val('');

                $
                    .ajax({
                        url: './shp/exportShpdata.do',
                        type: 'POST',
                        data: data,
                        dataType: 'json',
                        success: function(result) {
                            // console.log(result);
                            //var coords = result.COORD;
                            var shpInfo = result.SHP_INFO;
                            var tableInfo = result.TABLE_INFO;
                            var dataId = result.DID;
                            var epsgCode =result.EPSG;

                           /* var coordHtml = "";

                            for (var i = 0; i < coords.length; i++) {
                                var selected = "";
                                if (parseInt(coords[i].opt_value) == parseInt(shpInfo.OPT_VALUE)) {
                                    selected = "selected";
                                }
                                coordHtml += "<option value=\"" +
                                    coords[i].opt_value + "\" " +
                                    selected + ">" + coords[i].name +
                                    "</option>\n"
                            }

                            $("#exportCoordsShpList").append(coordHtml);*/
                            // $("#exportCoordsShpList
                            // option").val(shpInfo.OPT_VALUE).attr("selected","selected");

                            var shpLayerName = shpInfo.DATA_NAME;
                            $("#exportShpName").val(shpLayerName);
                            $("#shpExportDataId").val(dataId);
                            $("#exportCoordsShpList").val(epsgCode);

                            var propsHtml = "";
                            for (var i = 0; i < tableInfo.length; i++) {
                                var type = tableInfo[i].udt_name;

                                propsHtml += "<tr>\n";
                                propsHtml += "	<td>\n"
                                propsHtml += "		<label class=\"form-check mb-0\">\n"
                                propsHtml += "			<input class=\"form-check-input exportShpProps\" type=\"checkbox\" value=\"" +
                                    tableInfo[i].column_name +
                                    "\" checked>\n";
                                propsHtml += "			 <div class=\"form-check-label\">" +
                                    tableInfo[i].column_name +
                                    "</div>\n";
                                propsHtml += "		</label>\n"
                                propsHtml += "	</td>\n"
                                propsHtml += "	<td>" + type + "</td>\n";
                                propsHtml += "</tr>\n";
                            }

                            $("#exportShpProps").append(propsHtml);

                            new PerfectScrollbar(document.getElementById('shpFieldsLists'), {
                                    suppressScrollX: true
                            });

                            $("#dtcShpExport").modal({
                                backdrop: 'static'
                            });
                        }
                    });

                $("#shpFileExportBtn").on('click',function(e) {

                    if ($(".exportShpProps:checked").length == 0) {

                                COMMON.alert('필드를 선택해주세요', 'warning',
                                    function() {
                                        return false;
                                    })

                                return false;
                    }

                    if ($("#shpExportDataId").val() == null || $("#shpExportDataId").val() == "") {

                        COMMON.alert('파일명을 입력해주세요', 'warning',function() {
                                        return false;
                                    });

                        return false;
                    }

                    var props = [];
                    for (var i = 0; i < $(".exportShpProps:checked").length; i++) {
                        var column = $(".exportShpProps:checked").eq(i).val();
                        props.push(column);
                    }

                    var data = {
                        dataId: $("#shpExportDataId").val(),
                        prj: $("#exportCoordsShpList").val(),
                        format: $("#exportShpType option:selected").val(),
                        props: props.toString(),
                        fileName: $("#exportShpName").val()
                    };

                    dtcFile.type.shp.excuteExportShp(data);
                });
            },
            excuteExportShp: function(data) {
                
                dtcFile.type.shp.global.exportCheck=false;

                $.ajax({
                        url: './shp/exportShpDownload.do',
                        data: data,
                        type: 'POST',
                        dataType: 'json',
                        success: function(result) {
                            
                            var progressTxt = result.PROGRESS;
                            dtcFile.type.shp.global.totalRecord = result.RECORDS;
                            dtcFile.type.shp.global.exportPath = result.DIR;
                            dtcFile.type.shp.global.exportFileName = result.FILE_NAME;
                            dtcFile.type.shp.exportProgress(progressTxt);

                            $("#uploadedLayerName").text(data.fileName);
                            $("#preViewLayerImg").attr("src",result.THUMBNAIL_URL);
                            $("#uploadTypeTxt").text('Export shape...');
                            $("#dtcShpExport").modal('hide');

                            setTimeout(function() {
                                $("#cloudProgrss").show();
                            }, 500);
                        }
                    });
            },
            exportProgress: function(file) {

                dtcFile.type.shp.global.progInterval = setInterval(
                    function() {

                        var xhr = new XMLHttpRequest();
                        xhr.open("GET", file, false);
                        xhr.onreadystatechange = function() {
                            if (xhr.readyState === 4) {
                                if (xhr.status === 200 || xhr.status == 0) {
                                    var text = xhr.responseText;

                                    if (text.trim().toLowerCase() != "complete") {
                                        var count = parseFloat(text.trim());
                                        var total = Math.ceil(parseFloat(dtcFile.type.shp.global.totalRecord.total) / 100);
                                        var percent = Math.round((count / total) * 100);

                                        if (isNaN(percent) == false) {
                                            $("#uploadFileWizardPrgss").css('width',percent + "%");
                                            $("#uploadFileWizardPrgss").text(percent + "%");
                                        }

                                        if (percent == 100) {
                                            $("#uploadTypeTxt").text('zip 파일 생성 중...');
                                        }

                                    } else if (text.trim().toLowerCase() === "complete") {

                                        // 프로그래스 초기화 숨기기
                                        clearInterval(dtcFile.type.shp.global.progInterval);

                                        setTimeout(
                                            function() {

                                                dtcFile.type.shp.global.progInterval = null;

                                                $("#uploadFileWizardPrgss").css('width',"0%");
                                                $("#uploadFileWizardPrgss").text("0%");
                                                $("#cloudProgrss").hide();

                                                var fileUrl = dtcFile.type.shp.global.exportPath +".zip";

                                                var el = document.createElement('a');
                                                el.href = fileUrl;
                                                el.download = dtcFile.type.shp.global.exportFileName +".zip";

                                                document.body.appendChild(el);

                                                el.click();

                                                document.body.removeChild(el);

                                            }, 1000);
                                    }
                                }
                            }
                        }
                        xhr.send(null);
                    }, 1000);

            },
            getProperties: function(did) {
                //csv display none;
                $("#csvPropertyDisplay").hide();
                //싱글 속성 이벤트 제거
                $("#canvas").off('click',dtcLayer.SHP.getSingleProperty);
                //싱글 속성 이벤트 창 제거
                $("#singleShpProperties").hide();
                $("#shp3dsDisplay").hide();

                $("#shpSearchPropsDiv").show();

                dtcFile.type.shp.global.editData = {
                    dataId: did
                }

                var data = {
                    DATAID: did,
                    MEMID: D_MEMBER.MID
                }

                $("#shpPropertiesHeader").empty();
                $("#shpPropertiesBody").empty();
                $("#shpPropertiesColumns").empty();

                $.ajax({
                        url: './geodt/getLayerProperties.do',
                        type: 'POST',
                        data: data,
                        dataType: 'json',
                        success: function(result) {
                            // console.log(result);

                            $("#shpPropertyName").text(
                                result.SHP_LAYER_NAME);
                            var objHeader = result.HEADER;
                            var objList = result.PROPERTY;

                            var headerList = new Array();
                            var selectHtml = "";

                            for (var i = 0; i < objHeader.length; i++) {

                                if (objHeader[i].column_name != "geom") {
                                    headerList
                                        .push(objHeader[i].column_name);
                                }

                            }

                            var headerHtml = "<tr>";
                            headerHtml += "<th>geom</th>;"

                            selectHtml += "<option value=\"N/A\">필드 선택</option>\n";

                            for (var i = 0; i < headerList.length; i++) {
                                headerHtml += "<th nowrap>" + headerList[i] +
                                    "</th>\n";
                                selectHtml += "<option value=\"" +
                                    headerList[i] + "\">" +
                                    headerList[i] + "</option>\n"
                            }
                            headerHtml += "</tr>";

                            var html = "";

                            for (var i = 0; i < objList.length; i++) {

                                html += "<tr>\n";
                                html += "<td nowrap><button class=\"btn icon-btn btn-sm btn-outline-info borderless geomBtn\" value=\"" +
                                    objList[i].gid +
                                    "\"><span class=\"fas fa-map-marker-alt\"></span></button></td>\n"

                                for (var j = 0; j < headerList.length; j++) {

                                    var column = headerList[j];

                                    if (column != "gid") {

                                        html += "	<td nowrap>\n";
                                        html += "		<span class=\"text-white shpAttrEditBtn\">" +
                                            objList[i][column] +
                                            "</span>\n";
                                        html += "		<input type=\"hidden\" value=\"" +
                                            objList[i].gid +
                                            "#" +
                                            column +
                                            "#" +
                                            objList[i][column] +
                                            "\" />";
                                        html += "	</td>\n"

                                    } else {
                                        html += "	<td nowrap><span class=\"text-white\">" +
                                            objList[i][column] +
                                            "</span></td>\n"
                                    }

                                }

                                html += "</tr>\n";
                            }

                            dtcFile.type.shp.global.scrollbar = new PerfectScrollbar(
                                document
                                .getElementById('shpPropertiesTable'));

                            $("#shpPropertiesHeader").append(headerHtml);
                            $("#shpPropertyDisplay").show();
                            $("#shpPropertiesColumns").append(selectHtml);
                            $("#shpPropertiesBody").append(html);
                            

                            $(".shpAttrEditBtn").on('click',dtcFile.type.shp.editProperties);

                            dtcFile.type.shp.initGeometryEvent();

                        }
                    });

            },
            addColumnModal:function(){
                var columnNm = $("#shpAddColumnNm").val();
                var columnType = $("#shpAddDataType option:selected").val();

                if(columnNm == ''){
                    
                    COMMON.alert('컬럼명을 입력해주세요','warning',function(){
                        $("#shpAddColumnNm").focus();
                        return false;
                    });

                    return;
                }

                if(columnType=='N/A'){
                    
                    COMMON.alert('타입을 선택해주세요.','warning',function(){
                        $("#shpAddDataType").focus();
                        return false;
                    });

                    return;
                }

                var data={
                    dataId:dtcFile.type.shp.global.editData.dataId,
                    column_name:columnNm,
                    column_type:columnType,
                    type:'S'
                }

                $.ajax({
                    url:'./geodata/addColumn.do',
                    type:'POST',
                    dataType:'json',
                    data:data,
                    success:function(result){
                        
                        if(result.STATUS==200){
                            
                            COMMON.alert('컬럼이 추가되었습니다.','success',function(){
                                dtcFile.type.shp.reset();
                                $("#addShpColumnModal").modal('hide');
                            });

                        }else if(result.STATUS==300){
                            
                            COMMON.alert('칼럼명이 존재합니다.','error',function(){
                            
                                return false;
                            });
                            
                            $("#shpAddColumnNm").val('');
                            $("#shpAddColumnNm").focus();
                            
                            return false;
                        }
                        
                    }
                });
            },
            reset: function() {

                $("#shpPropertiesBody").empty();

                $("#shpAttrSearchTxt").val('');

                $(".geomBtn").off('click', dtcFile.type.shp.getGeometry);
                $(".shpAttrEditBtn").off('click',
                    dtcFile.type.shp.editProperties);

                dtcFile.type.shp.global.pageNum = 0;
                dtcFile.type.shp.global.editData.pageNum = 0;
                dtcFile.type.shp.global.checkSearch = false;

                if (dtcFile.type.shp.global.scrollbar != null) {
                    dtcFile.type.shp.global.scrollbar.destroy();
                    dtcFile.type.shp.global.scrollbar = null;
                }
                $("#closeShpAttrBtn").off('click');
                $("#shpAttrSearchTxt").off('keyup');

                dtcFile.type.shp
                    .getProperties(dtcFile.type.shp.global.editData.dataId);
            },
            getGeometry: function(e) {

                var value = $(this).val();

                dtcFile.type.shp.global.editData.gid = value;

                $.ajax({
                    url: './geodt/getGeometryInfo.do',
                    type: 'POST',
                    data: dtcFile.type.shp.global.editData,
                    dataType: 'json',
                    success: function(result) {
                        // console.log(result);
                        var geoJson =JSON.parse(result.geoInfo.center);

                        var lon = geoJson.coordinates[0];
                        var lat = geoJson.coordinates[1];

                        //Module.getViewCamera().setViewAt(lon, lat, 1500, 90, 0);
                        Module.getViewCamera().setLocation(new Module.JSVector3D(lon, lat, 1500));
                        //dtcFile.type.shp.drawRttGeometry(result);
                    },
                    error: function(request, status, error) {

                    }
                });

            },
            initGeometryEvent: function() {

                $("#closeShpAttrBtn").on(
                    'click',
                    function(e) {
                        
                        $("#canvas").on('click',dtcLayer.SHP.getSingleProperty);

                        $("#shpPropertiesColumns").empty();
                        $("#shpPropertiesHeader").empty();
                        $("#shpPropertiesBody").empty();
                        $("#shpAttrSearchTxt").val('');

                        $("#shpPropertyDisplay").hide();

                        dtcFile.type.shp.global.pageNum = 0;

                        dtcFile.type.shp.global.checkSearch = false;
                        dtcFile.type.shp.global.moreCheck = false;

                        if (dtcFile.type.shp.global.scrollbar != null) {

                            var scrollElement = document
                                .getElementById('shpPropertiesTable');
                            scrollElement.removeEventListener(
                                'ps-y-reach-end',
                                dtcFile.type.shp.moreGetPropertyList);

                            dtcFile.type.shp.global.scrollbar.destroy();
                            dtcFile.type.shp.global.scrollbar = null;
                        }

                        dtcFile.type.shp.global.editData = null;
                    });

                $("#shpAttrSearchBtn").on(
                    'click',
                    function(e) {
                        var words = $("#shpAttrSearchTxt").val();
                        var column = $(
                                "#shpPropertiesColumns option:selected")
                            .val();

                        if (column == "N/A") {

                            COMMON.alert('필드를 선택해주세요', 'warning',
                                function() {
                                    return false;
                                });

                            return false;
                        }

                        dtcFile.type.shp.searchProperties(words, column);

                    });

                $("#shpAttrSearchTxt").on(
                    'keyup',
                    function(e) {

                        var words = $(this).val();
                        var column = $(
                                "#shpPropertiesColumns option:selected")
                            .val();

                        if (e.keyCode == 13) {

                            if (column == "N/A") {

                                COMMON.alert('필드를 선택해주세요', 'warning',
                                    function() {
                                        return false;
                                    });

                                return false;
                            }

                            dtcFile.type.shp
                                .searchProperties(words, column);
                        }

                        if (e.keyCode == 27) {
                            $(this).val('');
                        }
                    });

                $(".geomBtn").on('click', dtcFile.type.shp.getGeometry);

                if (!dtcFile.type.shp.global.moreCheck) {

                    var scrollElement = document
                        .getElementById('shpPropertiesTable');
                    scrollElement.addEventListener('ps-y-reach-end',
                        dtcFile.type.shp.moreGetPropertyList);

                    dtcFile.type.shp.global.moreCheck = true;

                }

            },
            moreGetPropertyList: function(e) {

                if (!dtcFile.type.shp.global.checkSearch) {
                    dtcFile.type.shp.global.pageNum += 10;
                    dtcFile.type.shp.global.editData.pageNum = dtcFile.type.shp.global.pageNum;

                    $(".geomBtn").off('click', dtcFile.type.shp.getGeometry);
                    $(".shpAttrEditBtn").off('click',
                        dtcFile.type.shp.editProperties);

                    $.ajax({
                            url: './geodt/getShpPropsMore.do',
                            type: 'POST',
                            data: dtcFile.type.shp.global.editData,
                            dataType: 'json',
                            success: function(result) {
                                // console.log(result);
                                var objHeader = result.HEADER;
                                var objList = result.PROPERTY;

                                var headerList = new Array();

                                for (var i = 0; i < objHeader.length; i++) {

                                    if (objHeader[i].column_name != "geom") {
                                        headerList
                                            .push(objHeader[i].column_name);
                                    }

                                }

                                var html = "";

                                for (var i = 0; i < objList.length; i++) {

                                    html += "<tr>\n";
                                    html += "<td><button class=\"btn icon-btn btn-sm btn-outline-info borderless geomBtn\" value=\"" +
                                        objList[i].gid +
                                        "\"><span class=\"fas fa-map-marker-alt\"></span></button></td>\n"

                                    for (var j = 0; j < headerList.length; j++) {

                                        var column = headerList[j];

                                        if (column != "gid") {

                                            html += "	<td>\n";
                                            html += "		<span class=\"text-white shpAttrEditBtn\">" +
                                                objList[i][column] +
                                                "</span>\n";
                                            html += "		<input type=\"hidden\" value=\"" +
                                                objList[i].gid +
                                                "#" +
                                                column +
                                                "#" +
                                                objList[i][column] +
                                                "\" />";
                                            html += "	</td>\n"

                                        } else {
                                            html += "	<td><span class=\"text-white\">" +
                                                objList[i][column] +
                                                "</span></td>\n"
                                        }

                                    }

                                    html += "</tr>\n";
                                }

                                $("#shpPropertiesBody").append(html);
                                $(".geomBtn").on('click',
                                    dtcFile.type.shp.getGeometry);
                                $(".shpAttrEditBtn").on('click',
                                    dtcFile.type.shp.editProperties);
                            },
                            error: function(request, status, error) {
                                dtcFile.type.shp.global.pageNum = 0;
                                dtcFile.type.shp.global.editData.pageNum = 0;
                            }
                        });
                }
            },
            searchProperties: function(words, column) {

                dtcFile.type.shp.global.editData.word = words;
                dtcFile.type.shp.global.editData.column = column;
                dtcFile.type.shp.global.checkSearch = true; // true 일때는 스크롤 이벤트로
                // 어벤트 막기

                $("#shpPropertiesBody").empty();

                $.ajax({
                        url: './geodt/searchProperties.do',
                        type: 'POST',
                        data: dtcFile.type.shp.global.editData,
                        dataType: 'json',
                        success: function(result) {

                            var objHeader = result.HEADER;
                            var objList = result.PROPERTY;

                            var headerList = new Array();

                            if (objList.length != 0) {

                                for (var i = 0; i < objHeader.length; i++) {

                                    if (objHeader[i].column_name != "geom") {
                                        headerList
                                            .push(objHeader[i].column_name);
                                    }

                                }

                                var html = "";

                                for (var i = 0; i < objList.length; i++) {

                                    html += "<tr>\n";
                                    html += "<td><button class=\"btn icon-btn btn-sm btn-outline-info borderless geomBtn\" value=\"" +
                                        objList[i].gid +
                                        "\"><span class=\"fas fa-map-marker-alt\"></span></button></td>\n"

                                    for (var j = 0; j < headerList.length; j++) {

                                        var column = headerList[j];

                                        if (column != "gid") {

                                            html += "	<td>\n";
                                            html += "		<span class=\"text-white shpAttrEditBtn\">" +
                                                objList[i][column] +
                                                "</span>\n";
                                            html += "		<input type=\"hidden\" value=\"" +
                                                objList[i].gid +
                                                "#" +
                                                column +
                                                "#" +
                                                objList[i][column] +
                                                "\" />";
                                            html += "	</td>\n"

                                        } else {
                                            html += "	<td><span class=\"text-white\">" +
                                                objList[i][column] +
                                                "</span></td>\n"
                                        }

                                    }

                                    html += "</tr>\n";
                                }

                                $("#shpPropertiesBody").append(html);
                                $(".geomBtn").on('click',
                                    dtcFile.type.shp.getGeometry);
                                $(".shpAttrEditBtn").on('click',
                                    dtcFile.type.shp.editProperties);

                            } else {

                                $("#shpPropertiesBody").empty();

                                var html = "<tr>";
                                html += "<td colspan=\"" +
                                    (objHeader.length + 1) +
                                    "\" class=\"ts-8 pt-3 pb-3\">검색 결과가 없습니다.</td>";
                                html += "</tr>";

                                $("#shpPropertiesBody").append(html);

                            }

                        },
                    });

            },
            drawRttGeometry: function(result) {

                var centerObj = JSON.parse(result.geoInfo.center);
                var geoObj = JSON.parse(result.geoInfo.geometry);
                var coordObj = result.projInfo;

                var geometryType = geoObj.type.toLowerCase();

                if (geometryType == "multipolygon") {

                    dtcFile.type.shp.drawRTTMultiPolygon(geoObj, coordObj);

                } else if (geometryType == "polygon") {

                    dtcFile.type.shp.drawRTTPolygon(geoObj, coordObj);

                } else if (geometryType == "multilinestring") {

                    dtcFile.type.shp.drawRTTMultiLine(geoObj, coordObj);

                } else if (geometryType == "linestring") {

                    dtcFile.type.shp.drawRTTLine(geoObj, coordObj);

                }

                var posx = centerObj.coordinates[0];
                var posy = centerObj.coordinates[1];

                var vPosition = new Module.JSVector2D(parseFloat(posx),
                    parseFloat(posy));

                var proj = Module.getProjection();
                var result = proj.convertProjection(parseInt(coordObj.value),
                    vPosition, 13);

                Module.getViewCamera().setViewAt(parseFloat(result.x),
                    parseFloat(result.y), 500, 90, 0);

            },
            drawRTTMultiPolygon: function(obj, coordObj) {

                if (dtcFile.type.shp.global.layer != null) {
                    dtcFile.type.shp.global.layer.removeAll();
                }

                var coordsArr = obj.coordinates[0][0];

                dtcFile.type.shp.global.layerList = new Module.JSLayerList(true);
                dtcFile.type.shp.global.layer = dtcFile.type.shp.global.layerList
                    .createLayer("RTT_MULTIPOLYGON", Module.ELT_POLYHEDRON);

                var vertices = new Module.JSVec3Array();
                var proj = Module.getProjection();

                Proj4js.defs[coordObj.epsg] = coordObj.def;
                Proj4js.defs["EPSG:4326"] = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";

                var source = new Proj4js.Proj(coordObj.epsg);
                var dest = new Proj4js.Proj("EPSG:4326");

                for (var i = coordsArr.length - 1; i >= 0; i--) {
                    var x = coordsArr[i][0];
                    var y = coordsArr[i][1];

                    var pt = new Proj4js.Point(x, y);
                    var result = Proj4js.transform(source, dest, pt);

                    vertices.push(new Module.JSVector3D(parseFloat(result.x),
                        parseFloat(result.y), Module.getMap()
                        .getLonLatHeight(parseFloat(result.x),
                            parseFloat(result.y))));

                }

                // 폴리곤 좌표 part 지정
                var part = new Module.Collection();
                part.add(vertices.count());

                var polygon = Module.createPolygon("IMAGE_MASHUP_POLYGON");
                polygon.setPartCoordinates(vertices, part);
                polygon.setUnionMode(true);
                polygon.setHeight(10.0);

                var polygonStyle = new Module.JSPolygonStyle();

                polygonStyle.setFill(true);
                polygonStyle.setFillColor(new Module.JSColor(155, 155, 155));
                polygonStyle.setOutLine(true);
                polygonStyle.setOutLineWidth(1.0);
                polygonStyle.setOutLineColor(new Module.JSColor(255, 255, 255));
                polygon.setStyle(polygonStyle);

                dtcFile.type.shp.global.layer.addObject(polygon, 0);

            },
            drawRTTPolygon: function(obj) {
                console.log(obj);

            },
            drawRTTLine: function(obj) {

            },
            drawRTTMultiLine: function(obj) {

            },
            editProperties: function(e) {

                $("#shpPropsTxt").remove();
                $(".shpAttrEditBtn").show();

                if ($("#shpPropEditSubmit").length != 0) {
                    $("#shpPropEditSubmit").off('click');
                }

                var dataValue = $(this).next().val();
                var dataArr = dataValue.split("#");

                var gid = dataArr[0];
                var column = dataArr[1];
                var column_data = dataArr[2];

                dtcFile.type.shp.global.editData.gid = gid;
                dtcFile.type.shp.global.editData.column = column;
                dtcFile.type.shp.global.editData.data = column_data;

                var html = "	<div class=\"d-flex\" id=\"shpPropsTxt\">\n";
                html += "		<input type=\"text\" class=\"form-control form-control-sm col-md-9\" value=\"" +
                    column_data + "\" id=\"shpPropsInptTxt\"/>\n"
                html += "		<button class=\"btn icon-btn btn-sm\" id=\"shpPropEditSubmit\"><span class=\"far fa-edit\"></span></button>\n";
                html += "	</div>";

                $(this).hide();
                $(this).before(html);

                $("#shpPropsInptTxt").focus();

                $("#shpPropEditSubmit").on('click', function(e) {
                    dtcFile.type.shp.updateShpProperties();
                });

                $("#shpPropsInptTxt").keyup(function(e) {

                    if (e.keyCode == 13) {
                        dtcFile.type.shp.updateShpProperties();
                    }

                    if (e.keyCode == 27) {
                        $("#shpPropsTxt").next().show();
                        $("#shpPropsTxt").remove();
                    }
                });

            },
            updateShpProperties: function() {
                
                dtcFile.type.shp.global.editData.data = $("#shpPropsInptTxt").val();

                if (dtcFile.type.shp.global.editData.data != "undefined" ||
                    dtcFile.type.shp.global.editData.data != null) {

                    $
                        .ajax({
                            url: './geodt/editProperties.do',
                            type: 'POST',
                            data: dtcFile.type.shp.global.editData,
                            dataType: 'json',
                            success: function(result) {
                                // console.log(result);
                                if (result.RS == "complete") {
                                    var value = result.value;

                                    dtcFile.type.shp.global.editData.data = value;

                                    var hiddenVal = dtcFile.type.shp.global.editData.gid +
                                        "#" +
                                        dtcFile.type.shp.global.editData.column +
                                        "#" +
                                        dtcFile.type.shp.global.editData.data;

                                    $("#shpPropsTxt").next().text(value);
                                    $("#shpPropsTxt").next().show();
                                    $("#shpPropsTxt").next().next().val(
                                        hiddenVal);

                                    $("#shpPropsTxt").remove();
                                }
                            },
                            error: function(request, status, error) {

                                if (status == "error") {
                                    COMMON.alert('수정할 수 없는 데이터입니다.',
                                        'warning',
                                        function() {

                                            $("#shpPropsTxt").next()
                                                .show();
                                            $("#shpPropsTxt").remove();

                                            return false;
                                        });

                                    $("#shpPropsTxt").next().show();
                                    $("#shpPropsTxt").remove();

                                    return false;
                                }

                            }
                        });

                } else {
                    console.log('데이터 확인')
                }
            },
            setStyle: function(did) {

				var data={
					dataId:did
				}
				$.ajax({
					url:'./ide/callLayerInfo.do',
					type:'POST',
					data:data,
					dataType:'json',
					success:function(result){
						resetStyleForm();
						$("#shpStyleName").text(result.INFO.data_name);
						if(result.INFO.data_type == "S"){
							$("#shpStyleDisplay").show();
							$("#shpStyleDid").val(did);
							var shape_type = result.INFO.shape_type.toLowerCase();
							if(shape_type == "point" || shape_type == "multipoint"){	getLabelInfo('pointLabel');$("#pointStyle").show();}
							if(shape_type == "linestring" || shape_type == "multilinestring"){	getLabelInfo('strokeLabel');$("#strokeStyle").show();}
							if(shape_type == "polygon" || shape_type == "multipolygon"){	getLabelInfo('polygonLabel');$("#polygonStyle").show();}
						}
						$.ajax({
							url:'./geodt/getStyleInfo.do',
							type:'POST',
							data:data,
							dataType:'json',
							success:function(resultStyle){
								if(resultStyle.RS == "complete"){
									var dataStyle = JSON.parse(resultStyle.value);
									console.log(dataStyle);
									dataStyle = dataStyle.StyledLayerDescriptor.NamedLayer.UserStyle.FeatureTypeStyle.Rule;
									if(shape_type == "point" || shape_type == "multipoint"){
										if(dataStyle.TextSymbolizer != undefined){
											$("#pointLabelCheck").prop("checked",true);
											$(".pointLabel").attr("disabled",false);
											$("#pointLabelColor").val(dataStyle.TextSymbolizer.Fill.CssParameter.content);
											$("#pointLabelLineColor").val(dataStyle.TextSymbolizer.Halo.Fill.CssParameter.content);
											$("#pointLabel").val(dataStyle.TextSymbolizer.Label['ogc:PropertyName']);
											if(dataStyle.TextSymbolizer.Font.CssParameter.length != undefined){
												$("#pointFontSize").val(dataStyle.TextSymbolizer.Font.CssParameter[1].content);
											}
										}
										
										dataStyle = dataStyle.PointSymbolizer.Graphic;
										$("#wellKnownName").val(dataStyle.Mark.WellKnownName);
										$("#pointColor").val(dataStyle.Mark.Fill.CssParameter[0].content);
										$("#pointSizeSlider").data("ionRangeSlider").update({
											from: dataStyle.Size
										});
										$("#pointOpacitySlider").data("ionRangeSlider").update({
											from: 100 - (dataStyle.Mark.Fill.CssParameter[1].content * 100)
										});
										getPointPreview();
									}
									if(shape_type == "linestring" || shape_type == "multilinestring"){
										if(dataStyle.TextSymbolizer != undefined){
											$("#strokeLabelCheck").prop("checked",true);
											$(".strokeLabel").attr("disabled",false);
											$("#strokeLabelColor").val(dataStyle.TextSymbolizer.Fill.CssParameter.content);
											$("#strokeLabelLineColor").val(dataStyle.TextSymbolizer.Halo.Fill.CssParameter.content);
											$("#strokeLabel").val(dataStyle.TextSymbolizer.Label['ogc:PropertyName']);
											if(dataStyle.TextSymbolizer.Font.CssParameter.length != undefined){
												$("#strokeFontSize").val(dataStyle.TextSymbolizer.Font.CssParameter[1].content);
											}
										}
										dataStyle = dataStyle.LineSymbolizer.Stroke;
										$("#strokeColor").val(dataStyle.CssParameter[0].content);
										$("#strokeWidthSlider").data("ionRangeSlider").update({
											from: dataStyle.CssParameter[1].content
										});
										$("#strokeOpacitySlider").data("ionRangeSlider").update({
											from: 100 - (dataStyle.CssParameter[2].content * 100)
										});
										$("#strokeDasharray").val(dataStyle.CssParameter[3].content);
										getStrokePreview();
									}
									if(shape_type == "polygon" || shape_type == "multipolygon"){
										if(dataStyle.TextSymbolizer != undefined){
											$("#polygonLabelCheck").prop("checked",true);
											$(".polygonLabel").attr("disabled",false);
											$("#polygonLabelColor").val(dataStyle.TextSymbolizer.Fill.CssParameter.content);
											$("#polygonLabelLineColor").val(dataStyle.TextSymbolizer.Halo.Fill.CssParameter.content);
											$("#polygonLabel").val(dataStyle.TextSymbolizer.Label['ogc:PropertyName']);
											if(dataStyle.TextSymbolizer.Font.CssParameter.length != undefined){
												$("#polygonFontSize").val(dataStyle.TextSymbolizer.Font.CssParameter[1].content);
											}
										}
										dataStyleStroke = dataStyle.PolygonSymbolizer.Stroke;
										dataStyleFill = dataStyle.PolygonSymbolizer.Fill;
										$("#polygonStrokeColor").val(dataStyleStroke.CssParameter[0].content);
										$("#polygonStrokeWidthSlider").data("ionRangeSlider").update({
											from: dataStyleStroke.CssParameter[1].content
										});
										$("#polygonStrokeOpacitySlider").data("ionRangeSlider").update({
											from: 100 - (dataStyleStroke.CssParameter[2].content * 100)
										});
										$("#polygonStrokeDasharray").val(dataStyleStroke.CssParameter[3].content);
										$("#polygonColor").val(dataStyleFill.CssParameter[0].content);
										$("#polygonOpacitySlider").data("ionRangeSlider").update({
											from: 100 - (dataStyleFill.CssParameter[1].content * 100)
										});
										getPolygonPreview();
									}
								}
							}
						})
					}
				})
				
            },
            deleteLayer: function(did) {
            	
            },
            deleteShp: function(did) {
            	COMMON.confirm("삭제하시겠습니까?","삭제 후 복구할 수 없습니다.","info",function(){
            		var data = { dataId : did };
                    $.ajax({
                        url: './ide/deleteShp.do',
                        type: 'POST',
                        dataType: 'json',
                        data: data,
                        success:function(result){
                            if(result.rs=="complete"){
                            	$("#memLayer_"+did).parents('.card').remove();
                            	LOG_TRACKER.write('34','2','데이터 삭제:{DataId:'+did+'}');
								 COMMON.alert('삭제되었습니다.','success',function(){
		                            return false;
		                        });
                            }
                		}
                    })
            	},function(){
            		return false;
            	});
            },
        },
        image: {
            global:{
                interval:null,
                addCheck:false,
                polyMesh:null,
                polyMeshCan:null,
                polyMeshCtx:null,
                colorList:null,
                colorScale:['#fafafa','#050505'],
                paramData:{
                    transColor:"0,0,0",
                }
            },
            initSettingEvent:function(){
                $("#imgCheckList").change(function(e){
                    //console.log(this.value)
                    var value = this.value;
                    
                    if(value=='I#S'){
                        //setDefault color legend 회색 디폴트
                        dtcFile.type.image.setDefaultLegend();
                    }else{
                        dtcFile.type.image.global.paramData.legendInfo = null;
                        dtcFile.type.image.global.paramData.legendColor = null;
                    }

                    if((value=='I#S' || value=='I') && value != 'N/A'){
                        $("#settingImgDis").show();
                    }else{
                        $("#settingImgDis").hide();
                    }
                })

                $("#imgSettingBtn").on('click',function(e){
                    var type = $("#imgCheckList option:selected").val();
                    var colorTableCheck = dtcFile.type.image.global.paramData.check_color_table;

                    if(type !='I' && dtcFile.type.image.global.paramData.BAND != 1){
                        COMMON.alert("지원하지 않는 타입입니다.<br> 다른 가시화 타입을 선택해주세요","warning",function(){return false;});
                    }

                    if(type =='I' && dtcFile.type.image.global.paramData.BAND == 1 && colorTableCheck =='n'){
                        COMMON.alert("지원하지 않는 타입입니다.<br> 다른 가시화 타입을 선택해주세요","warning",function(){return false;});
                    }

                    if(type =='I#S' && dtcFile.type.image.global.paramData.BAND == 1 && colorTableCheck =='y'){
                        COMMON.alert("지원하지 않는 타입입니다.<br> 다른 가시화 타입을 선택해주세요","warning",function(){return false;});
                    }

                    if(type=='I#S' && dtcFile.type.image.global.paramData.BAND == 1 && colorTableCheck =='n'){
                        
                        $("#singleBandLegendModal").modal('show');
                        $("#singleBandPaletteModal").modal('hide');
                        $("#multiBandModal").modal('hide');

                    }else if(type=='I' && dtcFile.type.image.global.paramData.BAND == 1 && colorTableCheck =='y'){
                        
                        //팔레트/고유값
                        $("#singleBandPaletteModal").modal('show');
                        $("#singleBandLegendModal").modal('hide');
                        $("#multiBandModal").modal('hide');
                        
                        if($("#paletteColorRasterTb tr").length == 0){
                            dtcFile.type.image.callPaletteSetting(dtcFile.type.image.global.paramData);
                        }
                        
                    }else if(type=='I' && dtcFile.type.image.global.paramData.BAND >= 3){   
                        $("#multiBandModal").modal('show');
                        $("#singleBandPaletteModal").modal('hide');
                        $("#singleBandLegendModal").modal('hide');
                    }

                });

                $("#multiTransColor").spectrum({
                    showAlpha: false,
                    showInput: true,
                    allowEmpty: true,
                    color: 'black',
                    chooseText: "선택",
                    cancelText: "닫기",
                    preferredFormat: "rgb"
                });
                
                $("#editMultiBandColor").on('click',function(e){

                    COMMON.confirm("<span class=\"text-white\">이대로 수정하시겠습니까?<span>","","info",function(){
                        $("#multiBandModal").modal('hide');
                    },function(){return false;})
                    
                    var rgbColor = $("#multiTransColor").spectrum('get').toRgbString();
                    
                    if(rgbColor.indexOf("rgba") != -1){
                        rgbColor=rgbColor.replace("rgba(","");
                        rgbColor=rgbColor.replace(")","");
                    }

                    if(rgbColor.indexOf("rgb") != -1){
                        rgbColor=rgbColor.replace("rgb(","");
                        rgbColor=rgbColor.replace(")","");
                    }

                    dtcFile.type.image.global.paramData.transColor =rgbColor;
                });

                 //드랍다운 시 컬러 변경
                var items = $('.sampleLgColor');
                items.each(function() { 
                    $(this).click(function() { 
                        var value = $(this).text();
                        value = value.toLowerCase();
    
                        var colorScale=[];
    
                        if(value == 'red'){
                            colorScale=['#fff5f0','#ff1100'];
                        }else if(value == 'green'){
                            colorScale=['#e5f5e0','#008000'];
                        }else if(value == 'blue'){
                            colorScale=['#deebf7','#0000ff'];
                        }else{
                            colorScale=['#fafafa','#050505'];
                        }
    
                        dtcFile.type.image.global.colorScale = colorScale;

                        var chromaSample = chroma.scale(colorScale).padding([0.1, 0]).colors(9);
                        $("#sampleColorViewer").css('background-image','linear-gradient(to right, '+chromaSample.toString()+')');

                        var typeVal = $("#legendCrType").val();
                        
                        var count = $("#legendColorRasterTb tr").length;
                        dtcFile.type.image.setColorLegendTb(chromaSample,count,typeVal);

                    });
                });
                

                $("#legendCrType").change(function(){
                    var type = $(this).val();
                    
                    var count = $("#legendColorRasterTb tr").length;
                    var colorArray = chroma.scale(dtcFile.type.image.global.colorScale).padding([0.1, 0]).colors(count);

                    dtcFile.type.image.setColorLegendTb(colorArray,count,type);

                })

                //분류 input box change 이벤트
                $("#crlgCount").change(function(){
                  
                    var count = $(this).val();
                    var max = $("#crlgCount").attr("max");
                    
                    if(count > parseInt(max)){
                        COMMON.alert("최대 20개 까지 설정할 수 있습니다.","warning",function(){return false;});
                        $(this).val(20);
                        return false;
                    }
                    
                    var typeVal = $("#legendCrType").val();
                    var colorArray = chroma.scale(dtcFile.type.image.global.colorScale).padding([0.1, 0]).colors(count);
                    dtcFile.type.image.setColorLegendTb(colorArray,count,typeVal);

                    
                });

                //단일 밴드 유사색상 수정 버튼 클릭 이벤트
                $("#editLegendColor").on('click',function(){
                    
                    COMMON.confirm("<span class=\"text-white\">이대로 수정하시겠습니까?<span>","","info",function(){
                       
                        var interpotyp = $("#legendCrType").val();
                        dtcFile.type.image.global.paramData.interpoType = interpotyp;
                        dtcFile.type.image.global.paramData.legendCnt= parseInt($("#crlgCount").val());
                        //컬러 hex color -> json String으로 저장
                        $("#singleBandLegendModal").modal('hide');
                        
                        var legendInfo = [];
                        var legendColor=[];
                        
                        $("#legendColorRasterTb tr").each(function(index,item){
                         
                            var val = item.children[0].textContent;
                            var colorHex = item.children[1].children[0].value;

                            var label = item.children[2].textContent;

                            var colorValue = $(this).find(".lgInputColor").spectrum('get');
                            
                            var rgbColor = colorValue.toRgb();
                            var alpha = colorValue.getAlpha();
        
                            var rgbColorStr ='rgba('+rgbColor.r+','+rgbColor.g+','+rgbColor.b+','+alpha+')';

                            var colorInfo = {
                                r:rgbColor.r,
                                g:rgbColor.g,
                                b:rgbColor.b,
                                a:alpha
                            }

                            var obj = {
                                value:val,
                                color:colorInfo,
                                label:label
                            }
                            
                            legendInfo.push(obj);
                            legendColor.push(rgbColorStr);
                         });
                         
                         dtcFile.type.image.global.paramData.legendInfo =encodeURIComponent(JSON.stringify(legendInfo));
                         dtcFile.type.image.global.paramData.legendColor = legendColor;

                    },function(){return false;})
                })
            },
            setLinearLegend:function(colorArray,count){

                $(".lgInputColor").spectrum('destroy');
                $("#legendColorRasterTb").empty();

                var tableBody = document.getElementById('legendColorRasterTb');

                var minVal = dtcFile.type.image.global.paramData.minValue;
                var maxVal = dtcFile.type.image.global.paramData.maxValue;
                count = count -1;

                var range = (maxVal - minVal) / count;

                for(var i=0;i<count;i++){
                    var tbVal = minVal+(range*i);
                    var color = colorArray[i];
                    var label = tbVal;

                    var colorTr = document.createElement('tr');
                    var valTd = document.createElement('td');
                    var colorTd = document.createElement('td');
                    var labelTd = document.createElement('td');

                    var inputColor = document.createElement('input');
                    inputColor.type='text';
                    inputColor.value=color;
                    inputColor.classList.add('lgInputColor');
                    colorTd.appendChild(inputColor);

                    valTd.textContent = tbVal;
                    labelTd.textContent = label;

                    colorTr.appendChild(valTd);
                    colorTr.appendChild(colorTd);
                    colorTr.appendChild(labelTd);
                    
                    tableBody.appendChild(colorTr);

                }

                var colorTr = document.createElement('tr');
                var valTd = document.createElement('td');
                var colorTd = document.createElement('td');
                var labelTd = document.createElement('td');

                var inputColor = document.createElement('input');
                inputColor.type='text';
                inputColor.value=colorArray[count];
                inputColor.classList.add('lgInputColor');
                colorTd.appendChild(inputColor);

                valTd.textContent = maxVal;
                labelTd.textContent = maxVal;
                colorTr.appendChild(valTd);
                colorTr.appendChild(colorTd);
                colorTr.appendChild(labelTd);

                tableBody.appendChild(colorTr);

                $(".lgInputColor").spectrum({
                    showAlpha: true,
                    showInput: true,
                    allowEmpty: true,
                    color: this.value,
                    chooseText: "선택",
                    cancelText: "닫기",
                    preferredFormat: "rgb"
                });
            },
            setDiscreteLegend:function(colorArray,count){
              
                $(".lgInputColor").spectrum('destroy');
                $("#legendColorRasterTb").empty();

                var tableBody = document.getElementById('legendColorRasterTb');
                //정밀도 소숫점 5자리 디폴트
                var minVal = dtcFile.type.image.global.paramData.minValue;
                minVal = Math.round(minVal*100000)/100000.0;
                var maxVal = dtcFile.type.image.global.paramData.maxValue;
                maxVal = Math.round(maxVal*100000)/100000.0;

                var range = (maxVal - minVal) / count;
                range = Math.round(range*100000) / 100000.0;
                
                var legendInfo=[];
                var legendColor=[];

                for(var i=0;i<count;i++){
                    var tbVal = minVal+(range*(1+i));
                    tbVal = Math.round(tbVal*100000) / 100000.0;
                    var color = colorArray[i];
                    var label ='';
                    
                    if(i==0){
                        label="<= "+tbVal;
                    }else if(i==(count-1)){
                        label=" > "+tbVal;
                        tbVal = "inf";
                    }else{
                        label=Math.round((minVal+(range*i))*100000) / 100000.0+" - "+tbVal;
                    }

                    var colorTr = document.createElement('tr');
                    var valTd = document.createElement('td');
                    var colorTd = document.createElement('td');
                    var labelTd = document.createElement('td');

                    var inputColor = document.createElement('input');
                    inputColor.type='text';
                    inputColor.value=color;
                    inputColor.classList.add('lgInputColor');
                    colorTd.appendChild(inputColor);

                    valTd.textContent = tbVal;
                    labelTd.textContent = label;

                    colorTr.appendChild(valTd);
                    colorTr.appendChild(colorTd);
                    colorTr.appendChild(labelTd);
                    
                    tableBody.appendChild(colorTr);

                    var rgbColorArr = chroma(color).rgba();
                    var rgbColorStr ='rgba('+rgbColorArr[0]+','+rgbColorArr[1]+','+rgbColorArr[2]+','+rgbColorArr[3]+')';

                    var colorInfo = {
                        r:rgbColorArr[0],
                        g:rgbColorArr[1],
                        b:rgbColorArr[2],
                        a:rgbColorArr[3]
                    }

                    var obj = {
                        value:tbVal,
                        color:colorInfo,
                        label:label
                    }
                    
                    legendInfo.push(obj);
                    legendColor.push(rgbColorStr);

                }

                dtcFile.type.image.global.paramData.legendInfo =encodeURIComponent(JSON.stringify(legendInfo));
                dtcFile.type.image.global.paramData.legendColor = legendColor;
                dtcFile.type.image.global.paramData.interpoType='d';
                dtcFile.type.image.global.paramData.legendCnt=9;

                $(".lgInputColor").spectrum({
                    showAlpha: true,
                    showInput: true,
                    allowEmpty: true,
                    color: this.value,
                    chooseText: "선택",
                    cancelText: "닫기",
                    preferredFormat: "rgb"
                });
            },
            setColorLegendTb:function(colorArray,count,type){

                if(type=='d'){
                    dtcFile.type.image.setDiscreteLegend(colorArray,count);
                }else if(type=='l'){
                    dtcFile.type.image.setLinearLegend(colorArray,count);
                }
                
            },
            setDefaultLegend:function(){
                //var range = (maxVal - minVal) / 9;                
                var chscale = chroma.scale(['#fafafa','#050505']).padding([0.1, 0]).colors(9);

                $("#sampleColorViewer").css('background-image','linear-gradient(to right, '+chscale.toString()+')');

                //type 이산:d , 선형:l - type 디폴트 선형
                $("#crlgCount").val(9);
                dtcFile.type.image.setColorLegendTb(chscale,9,'d');
            },
            setting: function(result) {
                //console.log(result);
                $("#selectCoordsImgList").empty();

                $("#imgDataName").val(result.LAYER_NAME);
                //scrollbar 추가 $("#imgMetadataInfo")
                var imgMetadataInfo = document.getElementById('imgMetadataInfo');
                
                new PerfectScrollbar(imgMetadataInfo,{
                    suppressScrollX:true
                });

                if(result.IMG_INFO.CRS_CODE != 0){
                    $("#dtcFileImgPrjInfo").val("EPSG:"+result.IMG_INFO.CRS_CODE);
                }

                var bandCnt = result.IMG_INFO.band;

                var imgWidth = result.IMG_INFO.width;
                var imgHeight = result.IMG_INFO.height;
                
                var minx = result.IMG_INFO.minWgs84[0];
                var miny = result.IMG_INFO.minWgs84[1];
                var maxx = result.IMG_INFO.maxWgs84[0];
                var maxy = result.IMG_INFO.maxWgs84[1];

                if(minx ==0.0 && miny==0.0){
                    minx = result.IMG_INFO.min[0];
                    miny = result.IMG_INFO.min[1];
                }

                if(maxx ==0.0 && maxy==0.0){
                    maxx = result.IMG_INFO.max[0];
                    maxy = result.IMG_INFO.max[1];
                }

                var compress = result.IMG_INFO.compress;
                var pixelWidth = result.IMG_INFO.pixelWidth;
                var pixelHeight = result.IMG_INFO.pixelHeight;
                
                dtcFile.type.image.global.paramData.LAYER_NAME=result.LAYER_NAME
                dtcFile.type.image.global.paramData.BAND = bandCnt;
                dtcFile.type.image.global.paramData.imgWidth = imgWidth;
                dtcFile.type.image.global.paramData.imgHeight = imgHeight;

                dtcFile.type.image.global.paramData.MAX_X = minx;
                dtcFile.type.image.global.paramData.MAX_Y = miny;
                dtcFile.type.image.global.paramData.MIN_X = maxx;
                dtcFile.type.image.global.paramData.MIN_Y = maxy;
                dtcFile.type.image.global.paramData.COMPRESS = compress;
                //dtcFile.type.image.global.paramData.TRANSLATE = result.IMG_INFO.TRANSFORM;
                dtcFile.type.image.global.paramData.maxValue = result.IMG_INFO.maxValue;
                dtcFile.type.image.global.paramData.minValue = result.IMG_INFO.minValue;
                dtcFile.type.image.global.paramData.interpoType='';
                dtcFile.type.image.global.paramData.legendCnt=0;

                $("#sbImgMaxVal").val(dtcFile.type.image.global.paramData.maxValue);
                $("#sbImgMinVal").val(dtcFile.type.image.global.paramData.minValue);

                var centerX = (parseFloat(maxx)+parseFloat(minx))/2;
            	var centerY = (parseFloat(maxy)+parseFloat(miny))/2;
            	
                dtcFile.type.image.global.paramData.CENTER_X = centerX;
                dtcFile.type.image.global.paramData.CENTER_Y = centerY;
                dtcFile.type.image.global.paramData.DATAID=dtcFile.global.DATAID;

                dtcFile.type.image.global.paramData.COMPRESS = compress;
                dtcFile.type.image.global.paramData.check_color_table = result.IMG_INFO.colortable;
                dtcFile.type.image.global.paramData.colorList=[];

                $("#imgBandNum").text(bandCnt);

                $("#imgBoundaryMax").text(maxx+","+maxy);
                $("#imgBoundaryMin").text(minx+","+miny);
                
                $("#imgRasterWidth").text(imgWidth);
                $("#imgRasterHeight").text(imgHeight);
                
                $("#imgPixelSize").text(pixelWidth+","+pixelHeight);
                
                if(compress != null){
                    $("#imgCompress").show();
                    $("#imgCompressType").text(compress);
                }
            
                //설정에 필요한 각종 이벤트 함수 호출
                dtcFile.type.image.initSettingEvent();

            },
            callPaletteSetting:function(obj){
                
                var dataId=obj.DATAID;
                COMMON.blockUIdiv("singleBandPaletteModal", "리스트 생성 중입니다..");
                $.ajax({
                    url:'/raster/getPaletteTable.do',
                    method:'POST',
                    dataType:'json',
                    data:{dataId:dataId},
                    success:function(result){
                        //console.log(result);

                        if(result.status==200){
                            var colorList = result.LIST;
                            dtcFile.type.image.setColorTableList(colorList);
                           
                        }else{
                            COMMON.alert('Color 테이블이 존재하지 않습니다.','warning',function(){
                                $("#singleBandPaletteModal").modal('hide');
                                return false;
                            });
                        }
                    }
                });

                $("#editPaletteColor").on('click',function(e){
                    dtcFile.type.image.setPaletteColorList();
                });
            },
            setPaletteColorList:function(){
                //input color array list
                var colorList = $(".imgColorTable");
            },
            setColorTableList:function(list){
                
                COMMON.unblockUIdiv("singleBandPaletteModal");

                $("#paletteColorRasterTb").empty();

                var tableBody = document.getElementById('paletteColorRasterTb');

                var htmlOption = "<option value=\"-1\">선택</option>\n";
                $("#paletteNodataSelct").empty();
                for(var i=0;i<list.length;i++){
                    htmlOption +="<option value="+i+"> "+i+" </option>\n";
                    var rgba = list[i];
                    //console.log(rgba);
                    var colorTr = document.createElement('tr');
                    var indxTd = document.createElement('td');
                    var colorTd = document.createElement('td');
                    var labelTd = document.createElement('td');

                    var inputColor = document.createElement('input');
                    inputColor.type='text';
                    inputColor.value='rgba('+rgba[0]+', '+rgba[1]+', '+rgba[2]+', '+(rgba[3]/255)*100+')';
                    inputColor.classList.add('imgColorTable');
                    colorTd.appendChild(inputColor)
                    
                    indxTd.textContent=i;
                    labelTd.textContent=i;

                    colorTr.appendChild(indxTd);
                    colorTr.appendChild(colorTd);
                    colorTr.appendChild(labelTd);

                    tableBody.appendChild(colorTr);
                }
                $("#paletteNodataSelct").append(htmlOption);
                
                $(".imgColorTable").spectrum({
                    showAlpha: false,
                    showInput: true,
                    allowEmpty: true,
                    color: this.value,
                    chooseText: "선택",
                    cancelText: "닫기",
                    preferredFormat: "rgb"
                });
                
                $(".imgColorTable").change(function(e){
                    
                    var indexNum = $('.imgColorTable').index(this);
                    var colorValue = $(this).spectrum('get');
                    
                    var rgbColor = colorValue.toRgb();
                    var alpha = colorValue.getAlpha();

                    var colorInfo = {
                        indx:indexNum,
                        r:rgbColor.r,
                        g:rgbColor.g,
                        b:rgbColor.b,
                        a:alpha
                    }

                    var arr = dtcFile.type.image.global.paramData.colorList;
                    var filterArr = arr.filter((carr, index, array)=>{
                        return carr.indx !== colorInfo.indx;
                    })

                    filterArr.push(encodeURIComponent(JSON.stringify(colorInfo)));
                    dtcFile.type.image.global.paramData.colorList=filterArr;
                    
                });

                $("#editPaletteColor").on('click',function(e){
                    COMMON.confirm("<span class=\"text-white\">이대로 수정하시겠습니까?<span>","","info",function(){
                        dtcFile.type.image.global.paramData.noDataVal=$("#paletteNodataSelct").val();
                        $("#singleBandPaletteModal").modal('hide');
                    },function(){return false;})
                });
            },
            viewLegendImage:function(obj){
                
                var layerName = "meta_asset_"+obj.dataid;
                var legendInfo = JSON.parse(obj.legend_info);
                var html = "";
                $("#sbImgLgBdList").empty();
                for(var i=0;i<legendInfo.length;i++){
                    
                    var rgbColor = legendInfo[i].color;
                    var label = legendInfo[i].label;

                    html+="<div class=\"row pl-3 pr-2\">\n";
                    html+="     <div style=\"width:10px; height:10px; border-radius: 50%; margin-top: 5px; background-color:rgba("+rgbColor.r+", "+rgbColor.g+", "+rgbColor.b+","+rgbColor.a+")\"></div>"
                    html+="     <label for=\"sb_cL_indx_"+i+"\" style=\"font-size: 13px;\" class=\"pl-2\">"+label+"</label>\n";
                    html+="</div>"
                }

                $("#sbImgLgBdList").append(html);
                $("#sbLgImgView").show();

                var maxx = obj.minx;
                var maxy = obj.miny;
                var minx = obj.maxx;
                var miny = obj.maxy;

                if(minx > maxx){
                   var tmp =  maxx;
                   maxx = minx;
                   minx = tmp;
                }

                if(miny > maxy){
                    var tmp = maxy;
                    maxy = miny;
                    miny = tmp;
                }

                if(dtcLayer.global.sbLayerList == null){
                    dtcLayer.global.sbLayerList = new Module.JSLayerList(true);
                }

                Module.getViewCamera().moveLonLatBoundary( new Module.JSVector2D(parseFloat(minx), parseFloat(miny)),new Module.JSVector2D(parseFloat(maxx), parseFloat(maxy)));

                setTimeout(function(){
                    //좌하단 -> 우하단 -> 우상단 -> 좌상단 순으로
                    var minAlt = Module.getMap().getTerrHeightFast(minx, miny);
                    var maxAlt = Module.getMap().getTerrHeightFast(maxx, maxy);
                    
                    var height = (minAlt+maxAlt)/2;
                    var lowerLeft = new Module.JSVector3D(minx,miny,height+5);
                    var lowerRight = new Module.JSVector3D(maxx,miny,height+5);
                    var upperRight = new Module.JSVector3D(maxx,maxy,height+5);
                    var upperLeft = new Module.JSVector3D(minx,maxy,height+5);

                    var polygon = Module.createPolygon("POLYGON_IMG");
                    var vertex = new Module.Collection();
                    vertex.add(lowerRight);
                    vertex.add(lowerLeft);
                    vertex.add(upperLeft);
                    vertex.add(upperRight);

                    polygon.setCoordinates(vertex);
                    polygon.setUnionMode(true);

                    var polygonStyle = new Module.JSPolygonStyle();
                    polygonStyle.setFill(true);
                    var tranLineColor = new Module.JSColor(0, 255, 0, 0);
                    polygonStyle.setOutLine(true);
                    polygonStyle.setOutLineWidth(2.0);
                    polygonStyle.setOutLineColor(tranLineColor);

                    polygon.setStyle(polygonStyle);

                    var layer = dtcLayer.global.sbLayerList.createLayer(layerName, 1);
                    layer.addObject(polygon, 0);
                    layer.setMaxDistance(300000);

                    dtcFile.type.image.global.polyMesh = polygon;

                    fetch(obj.imgUrl)
                    .then(response => response.blob())
                    .then(blob => createImageBitmap(blob))
                    .then(imgBitmap => {

                        const w = imgBitmap.width;
                        const h = imgBitmap.height;
                        
                        var canvas = document.createElement("canvas");
                        canvas.width = w;
                        canvas.height = h;
                        var ctx = canvas.getContext('2d');
                        // Draw the ImageBitmap on the canvas
                        ctx.drawImage(imgBitmap, 0, 0);

                        var imgData = ctx.getImageData(0,0,w,h).data;
                        var buffer = Module._malloc(imgData.byteLength+1);
                        Module.writeArrayToMemory(imgData, buffer);
                        dtcFile.type.image.global.polyMesh.setTextureByte(buffer, imgData.byteLength, canvas.width, canvas.height, false);
                        Module._free(buffer);

                        COMMON.unblockUIdiv("MapContainer");
                    })
                    .catch(error => console.log(error));
                },500);

            },
            uploadCloud:function(){
            	
                COMMON.blockUIdiv("MapContainer", "레이어 가공 준비 중입니다...");

            	$.ajax({
            		url:'./ide/uploadRasterImg.do',
            		data:dtcFile.type.image.global.paramData,
            		type:'POST',
            		dataType:'json',
            		success:function(result){
            			//console.log(result);
                        COMMON.unblockUIdiv("MapContainer");

                        if(result.rs=="complete" && result.viewType == 'I'){
                          //타일 이미지 가공
                          $("#cloudProgrss").show();
                          $("#uploadedLayerName").text(dtcFile.type.image.global.paramData.LAYER_NAME);

                          dtcFile.type.image.getProgressInfo(dtcFile.global.DATAID);

                        }else if(result.rs=="complete" && result.viewType == 'S'){
                          //단일 밴드 / 유사 색상
                          COMMON.blockUIdiv("MapContainer", "레이어 생성 중입니다...");

                          var imgUrl = $("#imgFilePreview img").attr("src");
                          var param = result.legend;
                          param.imgUrl = imgUrl;
                          param.minx = result.INFO.minx;
                          param.miny = result.INFO.miny;
                          param.maxx = result.INFO.maxx;
                          param.maxy = result.INFO.maxy;

                          result.INFO.thumbnail_url = imgUrl;
                          result.INFO.viewType='S';
                          dtcFile.type.image.viewLegendImage(param);
                          dtcFile.type.image.addLayer(result.INFO);

                        }else if(result.rs=="complete" && result.viewType == 'P'){
                            //팔레트 색상 가공
                            $("#cloudProgrss").show();
                            $("#uploadedLayerName").text(dtcFile.type.image.global.paramData.LAYER_NAME);

                            var param = {
                                dataid:dtcFile.type.image.global.paramData.DATAID,
                                viewType:result.viewType,
                                progress:result.progress,
                                layerName:result.LAYER_NAME,
                                epsg:dtcFile.type.image.global.paramData.PROJ
                            };

                            //변환 프로그레스 먼저 호출
                            dtcFile.type.image.transRgbProgress(param)
                            
                        }
            		}
            	
            	});
            	
            },
            transRgbProgress:function(param){
                
                var file = param.progress;
                var dataId = param.dataid;

                dtcFile.type.image.global.interval = setInterval(function() {

                        var xhr = new XMLHttpRequest();
                        xhr.open("GET", file, false);
                        xhr.onreadystatechange = function() {
                            if (xhr.readyState === 4) {
                                if (xhr.status === 200 || xhr.status == 0) {

                                    var text = xhr.responseText;
                                    var percent = text.trim();
                                    
                                    if(isNaN(percent)){
                                        percent=0;
                                    }

                                    var num = parseInt(percent);
                                    if (num == 100) {
                                        //변환 완료
                                        $("#uploadFileWizardPrgss").css('width',num + "%");
                                        $("#uploadFileWizardPrgss").text(num + "%");
                                        
                                        clearInterval(dtcFile.type.image.global.interval);
                                        $("#uploadTypeTxt").text('변환 완료! 잠시 후 타일 이미지로 변환합니다.')

                                        setTimeout(function(){
                                            dtcFile.type.image.processIndxTile(dataId);

                                        },1000)

                                    }else{
                                        $("#uploadTypeTxt").text('rgba 이미지로 변환 중입니다..')
                                        $("#uploadFileWizardPrgss").css('width',num + "%");
                                        $("#uploadFileWizardPrgss").text(num + "%");

                                    }
                                }
                            }
                        }
                        xhr.send(null);
                    }, 1000);
            },
            processIndxTile:function(dataId){              
                $.ajax({
                    url:'/ide/processIndxTiles.do',
                    type:'post',
                    data:dtcFile.type.image.global.paramData,
                    dataType:'json',
                    success:function(result){
                        console.log(result);

                        if(result.rs =="complete"){
                            var dataid = dataId;

                            $("#uploadTypeTxt").text('타일 이미지로 가공 준비 중입니다..')
                            $("#uploadFileWizardPrgss").css('width',"0%");
                            $("#uploadFileWizardPrgss").text("0%");

                            dtcFile.type.image.getProgressInfo(dataid);
                        }

                    }
                })

            },
            getProgressInfo:function(dataId){
             
                var data = {
                    dataId : dataId
                }

                dtcFile.type.image.global.interval = setInterval(function(){

                    $.ajax({
                        url:'./ide/rasterImgProgress.do',
                        data:data,
                        dataType:'json',
                        type:'POST',
                        success:function(result){
                            
                            if(result.STATUS_TEXT == "COMPLETE"){

                                $("#uploadFileWizardPrgss").css('width',result.PROGRESS+'%');
                                $("#uploadFileWizardPrgss").text(result.PROGRESS+'%');

                                $("#uploadTypeTxt").text("COMPLETE");

                                dtcFile.type.image.global.addCheck=true;
                                dtcFile.type.image.addLayer(result.INFO);
                                dtcLayer.IMG.addLayer(result);
                                
                                clearInterval(dtcFile.type.image.global.interval);
                                $("#cloudProgrss").hide();

                            }else{

                                $("#uploadFileWizardPrgss").css('width',result.PROGRESS+'%');
                                $("#uploadFileWizardPrgss").text(result.PROGRESS+'%');

                                $("#uploadTypeTxt").text(result.STATUS_TEXT);
                                
                            }
                        
                        }
                    })

                },3000);
               
            },
            addLayer:function(obj){

                var layerName = obj.data_name;
                if(layerName.length > 35 ){
                    layerName = layerName.substring(0,35)+"...";
                }

                var viewType = obj.viewType;
               
                var html ="<div class=\"card mb-0\" id=\"MEM_LAYER_"+obj.dataid+"\">\n";
                html+=" <div class=\"card-body d-flex justify-content-between align-items-start pb-1 pt-3\">\n";
                html+="     <div>\n";
                html+="         <label class=\"custom-control custom-checkbox\">\n";
                html+="             <input type=\"checkbox\" class=\"custom-control-input layer_input_check\" value=\"meta_asset_"+obj.dataid+"\" id=\"memLayer_"+obj.dataid+"\" checked>\n";
                html+="             <input type=\"hidden\" value=\"I\" class=\"layerDataTypeInfo\">"
                html+="             <input type=\"hidden\" value=\""+viewType+"\" class=\"layerImgTypeInfo\">"
                html+="                 <span class=\"custom-control-label text-body ts-11 font-weight-semibold layer_inpuct_check\">"+layerName+"</span>\n";
                html+="         </label>\n";
                html+="     </div>\n";
                html+="     <div class=\"btn-group project-actions\">\n";
                html+="         <button type=\"button\" class=\"btn btn-default btn-xs rounded-pill icon-btn md-btn-flat hide-arrow dropdown-toggle\" data-toggle=\"dropdown\" aria-expanded=\"false\">\n";
                html+="             <i class=\"ion ion-ios-more\"></i>\n";
                html+="         </button>\n";
                html+="         <div class=\"dropdown-menu dropdown-menu-right ts-9\">\n";
                html+="             <a class=\"dropdown-item\" href=\"javascript:dtcFile.getLayerInfo('"+obj.dataid+"');\"><span class=\"fas fa-info\"></span> 정보</a>";
                if(viewType=='S'){
                    html+="             <a class=\"dropdown-item\" href=\"javascript:dtcFile.type.image.showLegend('"+obj.dataid+"')\"><span class=\"fas fa-layer-group\"></span> 범례 보기</a>\n"
                    html+="             <a class=\"dropdown-item\" href=\"javascript:dtcFile.type.image.editLegend('"+obj.dataid+"')\"><span class=\"fas fa-clipboard-list\"></span> 수정</a>\n"        
                }
                
                html+="             <a class=\"dropdown-item\" href=\"javascript:dtcFile.type.image.delete('"+obj.dataid+"')\"><span class=\"far fa-trash-alt\"></span> 삭제</a>\n"        

                if(viewType=='S'){
                    html+="				<div class=\"dropdown-divider\"></div>"
                    html+="             <a class=\"dropdown-item pt-1 pb-1\">\n"
					html+="					<label class=\"form-check mb-0\">"
					html+="						<input class=\"form-check-input sb_layer_selected mt-1\" type=\"checkbox\" value="+obj.dataid+">";
					html+="						<div class=\"form-check-label\"> 선택</div>"
					html+="					</label>"
					html+="				</a>"  
                }
                
                html+="         </div>\n"
                html+="     </div>\n";
                html+=" </div>\n";            
                html+=" <div class=\"card-body pb-1 pt-0\">\n";
                html+="     <div class=\"media pl-0\">\n";
                html+="         <img src=\""+obj.thumbnail_url+"\" class=\"d-block ui-w-120 mt-1\" style=\"height:9vh;\">\n";
                html+="         <div class=\"media-body ml-2 col-md-10 mt-1 pt-1\">\n"
                html+="             <div class=\"text-white mb-0 ts-10 pb-2\">\n";
                html+="                    <span class=\"d-block mb-1 pb-1\"><i class=\"vacancy-tooltip far fa-map\"></i> "+obj.coord_epsg+"</span>\n";
                html+="                    <span class=\"d-block mb-1 pb-1\"><i class=\"vacancy-tooltip fas fa-palette\"></i> band :"+obj.bands+"</span>"                                
                html+="                    <span class=\"d-block mb-1\">date: "+obj.reg_date+"</span>"
                html+="             </div>\n";
                html+="         </div>\n";
                html+="     </div>\n";
                html+=" </div>\n"
                html+=" <div class=\"card-body pt-1 pb-3\">\n"
                html+="     <div class=\"row\">\n"
                html+="         <div class=\"col text-right\">\n";
                html+="             <div class=\"font-weight-bold text-warning ts-9\"><i class=\"fas fa-images\"></i> IMAGE</div>\n";
                html+="         </div>\n";
                html+="     </div>\n";
                html+=" </div>\n";
                html+=" <hr class=\"m-0\">\n"
                html+="</div>"
           
                $("#memberLayerLists").prepend(html);
				var layerParam ={
                    dataId:obj.dataid,
					minx:obj.minx,
					miny:obj.miny,
					minz:obj.minz,
					maxx:obj.maxx,
					maxy:obj.maxy,
					maxz:obj.maxz,
					move_lon:obj.move_lon,
					move_lat:obj.move_lat
                }

                dtcLayer.global.layerVisbleList.push(layerParam);

             
               
            },
            showLegend:function(dataId){
               
                var param={
                    dataid:dataId
                }

                $.ajax({
                    url:'/ide/getSingleBandLgInfo.do',
                    type:'post',
                    data:param,
                    dataType:'json',
                    success:function(result){
                       
                        if(result.status==200){
                            var legendInfo = JSON.parse(result.legend.legend_info);     
                            var html = "";
                            $("#sbImgLgBdList").empty();
                            for(var i=0;i<legendInfo.length;i++){
                                
                                var rgbColor = legendInfo[i].color;
                                var label = legendInfo[i].label;
            
                                html+="<div class=\"row pl-3 pr-2\">\n";
                                html+="     <div style=\"width:10px; height:10px; border-radius: 50%; margin-top: 5px; background-color:rgba("+rgbColor.r+", "+rgbColor.g+", "+rgbColor.b+","+rgbColor.a+")\"></div>"
                                html+="     <label for=\"sb_cL_indx_"+i+"\" style=\"font-size: 13px;\" class=\"pl-2\">"+label+"</label>\n";
                                html+="</div>"
                            }
            
                            $("#sbImgLgBdList").append(html);
                            $("#sbLgImgView").show();
                        }else{
                            COMMON.alert("생성된 범례가 없습니다.","error",function(){return false;});
                            return false;
                        }
                    }
                })

            },
            deleteImage: function(did) {
            	COMMON.confirm("삭제하시겠습니까?","삭제 후 복구할 수 없습니다.","info",function(){
            		var data = { dataId : did };
                    $.ajax({
                        url: './ide/deleteImage.do',
                        type: 'POST',
                        dataType: 'json',
                        data: data,
                        success:function(result){
                            if(result.rs=="complete"){
                            	$("#memLayer_"+did).parents('.card').remove();
                            	LOG_TRACKER.write('34','2','데이터 삭제:{DataId:'+did+'}');
								 COMMON.alert('삭제되었습니다.','success',function(){
		                            return false;
		                        });
                            }
                		}
                    })
            	},function(){
            		return false;
            	});
            },
        },
        terrain:{
            global:{
                setInterval:null,

            },
            uploadCloud:function(){
      
                $("#cloudProgrss").show();
                $("#uploadedLayerName").text($("#imgDataName").val());

                $.ajax({
            		url:'./ide/uploadTerrain.do',
            		data:dtcFile.type.image.global.paramData,
            		type:'POST',
            		dataType:'json',
            		success:function(result){
            			//console.log(result);
                        if(result.rs=="complete"){
                          dtcFile.type.terrain.getProgressInfo(dtcFile.global.DATAID);
                        }
            		}
            	
            	});
            },
            getProgressInfo:function(dataId){

                var data={
                    dataId:dataId
                }

                dtcFile.type.terrain.global.setInterval=setInterval(function(){
                    
                    $.ajax({
                        url:'./ide/getDemProgress.do',
                        type:'POST',
                        data:data,
                        dataType:'json',
                        success:function(result){
                           
                            if(result.STATUS_TEXT == "COMPLETE"){

                                $("#uploadFileWizardPrgss").css('width',result.PROGRESS+'%');
                                $("#uploadFileWizardPrgss").text(result.PROGRESS+'%');

                                $("#uploadTypeTxt").text("COMPLETE");

                                dtcFile.type.terrain.addLayer(result.INFO);
                                dtcLayer.TERRAIN.addLayer(result);
                                
                                clearInterval(dtcFile.type.terrain.global.setInterval);
                                $("#cloudProgrss").hide();

                            }else{

                                $("#uploadFileWizardPrgss").css('width',result.PROGRESS+'%');
                                $("#uploadFileWizardPrgss").text(result.PROGRESS+'%');

                                $("#uploadTypeTxt").text(result.STATUS_TEXT);
                                
                            }
                        }
                    })

                },3000)
                
            },
            addLayer:function(obj){

                var layerName = obj.data_name;
               
                if(layerName.length > 35 ){
                    layerName = layerName.substring(0,35)+"...";
                }
               
                var html ="<div class=\"card mb-0\" id=\"MEM_LAYER_"+obj.dataid+"\">\n";
                html+=" <div class=\"card-body d-flex justify-content-between align-items-start pb-1 pt-3\">\n";
                html+="     <div>\n";
                html+="         <label class=\"custom-control custom-checkbox\">\n";
                html+="             <input type=\"checkbox\" class=\"custom-control-input layer_dem_check\" value=\"meta_asset_"+obj.dataid+"\" id=\"memLayer_"+obj.dataid+"\" checked>\n";
                html+="             <input type=\"hidden\" value=\"I\" class=\"layerDataTypeInfo\">"
                html+="                 <span class=\"custom-control-label text-body ts-11 font-weight-semibold layer_inpuct_check\">"+layerName+"</span>\n";
                html+="         </label>\n";
                html+="     </div>\n";
                html+="     <div class=\"btn-group project-actions\">\n";
                html+="         <button type=\"button\" class=\"btn btn-default btn-xs rounded-pill icon-btn md-btn-flat hide-arrow dropdown-toggle\" data-toggle=\"dropdown\" aria-expanded=\"false\">\n";
                html+="             <i class=\"ion ion-ios-more\"></i>\n";
                html+="         </button>\n";
                html+="         <div class=\"dropdown-menu dropdown-menu-right ts-9\">\n";
                //html+="             <a class=\"dropdown-item\" href=\"javascript:dtcFile.type.terrain.export('"+obj.dataid+"')\"><span class=\"fas fa-file-export\"></span> 내보내기</a>\n";
                //html+="             <a class=\"dropdown-item\" href=\"javascript:dtcFile.type.terrain.getProperties('"+obj.dataid+"')\"><span class=\"fas fa-clipboard-list\"></span> 속성</a>\n"        
                html+="             <a class=\"dropdown-item\" href=\"javascript:dtcFile.delete('"+obj.dataid+"')\"><span class=\"far fa-trash-alt\"></span> 삭제</a>\n"        
                html+="         </div>\n"
                html+="     </div>\n";
                html+=" </div>\n";            
                html+=" <div class=\"card-body pb-1 pt-0\">\n";
                html+="     <div class=\"media pl-0\">\n";
                html+="         <img src=\""+obj.thumbnail_url+"\" class=\"d-block ui-w-120 mt-1\" style=\"height:9vh;\">\n";
                html+="         <div class=\"media-body ml-2 col-md-10 mt-1 pt-1\">\n"
                html+="             <div class=\"text-white mb-0 ts-10 pb-2\">\n";
                html+="                    <span class=\"d-block mb-1 pb-1\"><i class=\"vacancy-tooltip far fa-map\"></i> "+obj.coord_epsg+"</span>\n";
                html+="                    <span class=\"d-block mb-1 pb-1\"><i class=\"vacancy-tooltip fas fa-palette\"></i> band :"+obj.bands+"</span>"                                
                html+="                    <span class=\"d-block mb-1\">date: "+obj.reg_date+"</span>"
                html+="             </div>\n";
                html+="         </div>\n";
                html+="     </div>\n";
                html+=" </div>\n"
                html+=" <div class=\"card-body pt-1 pb-3\">\n"
                html+="     <div class=\"row\">\n"
                html+="         <div class=\"col text-right\">\n";
                html+="             <div class=\"font-weight-bold text-primary ts-9\"><i class=\"fas fa-mountain\"></i> DEM</div>\n";
                html+="         </div>\n";
                html+="     </div>\n";
                html+=" </div>\n";
                html+=" <hr class=\"m-0\">\n"
                html+="</div>"
           
                $("#memberLayerLists").prepend(html);

                dtcLayer.callLayerInfo(obj.dataid);

            	//dem은 따로
                $(".layer_dem_check").on('click',function(e){
                    
                    var dataId = $(this).attr('id').split("_")[1];
                    var check =  $(this).is(':checked');
                    var value = $(this).val();
                    
                    if(check){
                        dtcLayer.callLayerInfo(dataId);
                    }else{
                        Module.getTerrain().SetUseDemBox(false);

                        Module.SetPlanetImageryType(0);

                        var layerList = new Module.JSLayerList(true);
                        var layer = layerList.nameAtLayer(value);

                        if (layer != null) {
                            layer.setVisible(false);
                        }

                        Module.getMap().ClearMap();
                    }
                    
                });
               
            }
        },
        point: {
            global:{
                setInterval:null,
                params:null,
                editDataid:0
            },
            setting:function(result){
                
                $("#pclDataName").val(result.LAYER_NAME);

                var epsgCode = result.PCL_INFO.CODE;
                
                var count = result.PCL_INFO.COUNT;
                
                var minx = result.PCL_INFO.minx;
                var miny = result.PCL_INFO.miny;
                var minz = result.PCL_INFO.minz;

                var maxx = result.PCL_INFO.maxx;
                var maxy = result.PCL_INFO.maxy;
                var maxz = result.PCL_INFO.maxz;

                dtcFile.type.point.global.params={
                    minx:minx,
                    miny:miny,
                    minz:minz,
                    maxx:maxx,
                    maxy:maxy,
                    maxz:maxz,
                    count:count
                }

                $("#pclCnt").text(count);

                $("#pclMinX").text(minx);
                $("#pclMinY").text(miny);
                $("#pclMinZ").text(minz);

                $("#pclMaxX").text(maxx);
                $("#pclMaxY").text(maxy);
                $("#pclMaxZ").text(maxz);
                
                if(epsgCode != 0){
                    $("#dtcFilePclPrjInfo").val("EPSG:"+epsgCode);
                }

                
            },
            uploadCloud:function(){

                $.ajax({
                    url:'./ide/uploadPclCloud.do',
                    type:'POST',
                    data:dtcFile.type.point.global.params,
                    dataType:'json',
                    success:function(result){

                        if(result.RS=="complete"){
                            
                            dtcFile.type.point.setProgress(dtcFile.global.DATAID);
                            
                            $("#uploadedLayerName").text(dtcFile.type.point.global.params.LAYERNAME);
                            $("#preViewLayerImg").attr('src',dtcFile.type.point.global.params.thumb);

                            $("#cloudProgrss").show();
                        }

                    }
                });
            },
            setProgress:function(dataId){

                var data={
                    dataId:dataId
                }

                dtcFile.type.point.global.setInterval = setInterval(function(){

                    $.ajax({
                        url:'./ide/getPointCloudProgress.do',
                        type:'POST',
                        data:data,
                        dataType:'json',
                        success:function(result){
                            //console.log(result);
                            if(result.INFO == null){
                                
                                $("#uploadTypeTxt").text(result.TEXT);
                                    
                                $("#uploadFileWizardPrgss").text(result.PERCENT+"%");
                                $("#uploadFileWizardPrgss").css('width',result.PERCENT+'%');

                            }else{
                                
                                $("#uploadFileWizardPrgss").text("100%");
                                $("#uploadFileWizardPrgss").css('width','100%');
                                
                                clearInterval(dtcFile.type.point.global.setInterval);

                                setTimeout(function(){
                                    $("#cloudProgrss").hide();
                                    dtcFile.type.point.addLayer(result.INFO);
                                    dtcLayer.POINT.addLayer(result);
                                },2000);

                            }
                        }
                    });

                },3000);
            },
            addLayer:function(obj){

                var layerName = obj.data_name;
                if(layerName.length > 35 ){
                    layerName = layerName.substring(0,35)+"...";
                }
                
                var html ="<div class=\"card mb-0\" id=\"MEM_LAYER_"+obj.dataid+"\">\n";
                html+=" <div class=\"card-body d-flex justify-content-between align-items-start pb-1 pt-3\">\n";
                html+="     <div>\n";
                html+="         <label class=\"custom-control custom-checkbox\">\n";
                html+="             <input type=\"checkbox\" class=\"custom-control-input layer_input_check\" value=\"meta_asset_"+obj.dataid+"\" id=\"memLayer_"+obj.dataid+"\" checked>\n";
                html+="             <input type=\"hidden\" value=\"P\" class=\"layerDataTypeInfo\">"
                html+="                 <span class=\"custom-control-label text-body ts-11 font-weight-semibold layer_inpuct_check\">"+layerName+"</span>\n";
                html+="         </label>\n";
                html+="     </div>\n";
                html+="     <div class=\"btn-group project-actions\">\n";
                html+="         <button type=\"button\" class=\"btn btn-default btn-xs rounded-pill icon-btn md-btn-flat hide-arrow dropdown-toggle\" data-toggle=\"dropdown\" aria-expanded=\"false\">\n";
                html+="             <i class=\"ion ion-ios-more\"></i>\n";
                html+="         </button>\n";
                html+="         <div class=\"dropdown-menu dropdown-menu-right ts-9\">\n";
                //html+="             <a class=\"dropdown-item\" href=\"javascript:dtcFile.type.point.export('"+obj.dataid+"')\"><span class=\"fas fa-file-export\"></span> 내보내기</a>\n";
                html+="             <a class=\"dropdown-item\" href=\"javascript:dtcFile.type.point.edit('"+obj.dataid+"')\"><span class=\"fas fa-crop-alt\"></span> 편집</a>\n"        
                html+="             <a class=\"dropdown-item\" href=\"javascript:dtcFile.delete('"+obj.dataid+"')\"><span class=\"far fa-trash-alt\"></span> 삭제</a>\n"        
                html+="         </div>\n"
                html+="     </div>\n";
                html+=" </div>\n";            
                html+=" <div class=\"card-body pb-1 pt-0\">\n";
                html+="     <div class=\"media pl-0\">\n";
                
                var thumbUrl="";

                if(obj.thumbnail_url=="default"){
                    thumbUrl="/assets/img/default.png";
                }else{
                    thumbUrl=obj.thumbnail_url;
                }

                html+="         <img src=\""+thumbUrl+"\" class=\"d-block ui-w-120 mt-1\" style=\"height:9vh;\">\n";
                html+="         <div class=\"media-body ml-2 col-md-10 mt-1 pt-1\">\n"
                html+="             <div class=\"text-white mb-0 ts-10 pb-2\">\n";
                html+="                    <span class=\"d-block mb-1 pb-1\"><i class=\"vacancy-tooltip far fa-map\"></i> "+obj.coord_epsg+"</span>\n";
                //html+="                    <span class=\"d-block mb-1 pb-1\"><i class=\"vacancy-tooltip fas fa-palette\"></i> band :"+obj.bands+"</span>"                                
                html+="                    <span class=\"d-block mb-1\">date: "+obj.reg_date+"</span>"
                html+="             </div>\n";
                html+="         </div>\n";
                html+="     </div>\n";
                html+=" </div>\n"
                html+=" <div class=\"card-body pt-1 pb-3\">\n"
                html+="     <div class=\"row\">\n"
                html+="         <div class=\"col text-right\">\n";
                html+="             <div class=\"font-weight-bold text-primary ts-9\"><i class=\"fas fa-dot-circle\"></i> POINT CLOUD</div>\n";
                html+="         </div>\n";
                html+="     </div>\n";
                html+=" </div>\n";
                html+=" <hr class=\"m-0\">\n"
                html+="</div>"
           
                $("#memberLayerLists").prepend(html);

                var layerParam ={
                    dataId:obj.dataid,
					minx:obj.minx,
					miny:obj.miny,
					minz:obj.minz,
					maxx:obj.maxx,
					maxy:obj.maxy,
					maxz:obj.maxz,
					move_lon:obj.move_lon,
					move_lat:obj.move_lat
                }

                dtcLayer.global.layerVisbleList.push(layerParam);

                $(".layer_input_check").on('click',function(e){
			
                    var dataId = $(this).attr('id').split("_")[1];
                    var check =  $(this).is(':checked');
                    var value = $(this).val();

                    dtcLayer.global.layerList = new Module.JSLayerList(true);
      
                    if(dtcLayer.global.layerList.nameAtLayer(value) != null){
                      
                      if(check){
                        dtcLayer.global.layerList.nameAtLayer(value).setVisible(true)
                      }else{
                        dtcLayer.global.layerList.nameAtLayer(value).setVisible(false)
                      }
      
                    }else{
                      dtcLayer.callLayerInfo(dataId);
                    }
                    
                });
            },
            edit:function(dataid){
                
                $("#pclEditNum").val(dataid);

                $("#pclEditDisplay").show();
                var textName = $("#memLayer_5008").next().next().text();

                $("#pclLayerName").text(textName);

                $("#pclEditSize").on('change',dtcFile.type.point.setPclSize);
                $("#pclEditRendorColor").on('change',dtcFile.type.point.setRenderColor);

                var range = $("#pclHeightRange").data("ionRangeSlider");
				if(range != undefined) range.destroy();
				
                $("#pclHeightRange").ionRangeSlider({
                    skin: "square",
                    min: -50,
                    max: 100,
                    step: 1,
                    from:0,
                    onFinish: function (data) {
                        //DRONE_LOD_LAYER.tile_load_ratio = data.from;
                        //console.log(data)
                        var value = parseInt(data.from);
                        
                        var layerList = new Module.JSLayerList(false);
                        var layer = layerList.nameAtLayer("meta_asset_"+$("#pclEditNum").val());

                        layer.altitude_offset = value;
                        /*layer.setTileAltitudeOffset(value);

                        //layer.ReloadTiles();

                        Module.XDRenderData();*/
                    },
                });
                
                $("#closePclEditBtn").on('click',function(e){
                    
                    $("#pclEditSize").off('change');
                    $("#pclEditRendorColor").off('change');
                    $("#pclEditNum").val('');

                    $("#pclEditDisplay").hide();                    

                });
                //$("#pclHeightRange").data("ionRangeSlider").update({from: parseFloat(DRONE_LOD_LAYER.tile_load_ratio.toFixed(1))});
            },
            setPclSize:function(e){
                
                var value = e.target.value;
                
                var layerName = "meta_asset_"+$("#pclEditNum").val();
                
                var layerList = new Module.JSLayerList(false);
                var layer = layerList.nameAtLayer(layerName);

                layer.setPointCloudPointSize(parseFloat(value));

                Module.XDRenderData();
            },
            setRenderColor:function(e){
                
                var dataId = $("#pclEditNum").val();
                var layerName = "meta_asset_"+dataId;

                var minz=0;
                var maxz=0;

                for(var i=0;dtcLayer.global.layerVisbleList.length;i++){
                    
                    if(dataId == dtcLayer.global.layerVisbleList[i].dataId){
                        
                        minz=dtcLayer.global.layerVisbleList[i].minz;
                        maxz=dtcLayer.global.layerVisbleList[i].maxz;

                        break;
                    }

                }

                var value = e.target.value;
                var layerList = new Module.JSLayerList(false);
                var layer = layerList.nameAtLayer(layerName);

                if(value == "0"){
                    layer.SetPointCloudRenderModeRGB(0, 0, 0);
                }else if(value == "1"){
                    layer.SetPointCloudRenderModeAltitude(parseFloat(minz), parseFloat(maxz), false);
                }else{
                    layer.SetPointCloudRenderModeAltitude(parseFloat(minz), parseFloat(maxz), true);
                }

                Module.XDRenderData();
                
            },
            closePclEdit:function(e){
                console.log(e);
            }
        },
        zip:{
            global:{
                check3ds:false,
                checkdrone:false,
                dataType:""
            },
            setting:function(){
                
                $("input[name='zipFileType']").on('click',function(e){

                    var value = $("input[name='zipFileType']:checked").val();

                    if(value == '0'){//3ds
                        dtcFile.type.zip.global.dataType="Z3";
                        dtcFile.type.model.setDataInfo(dtcFile.global.DATAID);
                    }else if(value == '1'){//drone data
                        dtcFile.type.zip.global.dataType="ZD";
                        dtcFile.type.drone.setDataInfo(dtcFile.global.DATAID);
                    }

                });
            },
            
        },
        model: {//3ds to tiles
            global:{
                shpFile:'',
                dbfFile:'',
                modelDir:'',
                interval:null,
                editInit:false,
                layer:null,
                moveCheck:false,
                clickDown:false,
                eventCheck:false,
                moreCheck:false,
                editData:{},
                pageNum:0,
                scrollbar:null,
                moreList:false,
            },
            setDataInfo:function(dataId){
                
                if(!dtcFile.type.zip.global.check3ds){
                    
                    COMMON.blockUIdiv('zipUploadLayerSetting','LOADING...');

                    $.ajax({
                        url:'../ide/check3dsFileInfo.do',
                        type:'POST',
                        data:{dataId:dataId},
                        dataType:'json',
                        success:function(result){
                            console.log(result);
                         
                            /*
                                1.파일 유효성 체크 - 존재유무 (3ds,jpg,shp,dbf,prj)
                                2.좌표계 설정
                                3.shp 파일 유무에 따라 파일 업로드 show/hide - 추후에 일정 맞춰서
                                4.default 인코딩 euc-kr
                                5.dae 드론 데이터일 경우 alert 경고창 띄우기
                            */

                            if(result.STATUS != "NT"){

                                $("#zipFileTypeInfo").removeClass('col-12');
                                $("#zipFileTypeInfo").addClass('col-6');

                                $("#zip3dsSetting").show();

                                $("#shp3dsAttrTble").show();

                                if(result.FILE_3DS_CHECK == "exist"){
                                    dtcFile.type.model.global.modelDir=result.DIR_3DS;
                                }else{
                                    var valid3dsTxt = "3DS 파일이 없습니다";
                                }
    
                                if(result.SHP_FILE_CHECK=="exist"){
                                    dtcFile.type.model.global.dbfFile=result.DBF_FILE_NAME;
                                    dtcFile.type.model.global.shpFile=result.SHP_FILE_NAME;
                                }else{
                                    var validShpTxt = "Shape 파일이 없습니다";
                                }
    
                                if(result.DBF_FILE_CHECK=="exist"){
                                    
                                    $("#dbf3dsHeaderIndx").empty();
                                    $("#dbf3dsHeaderTexture").empty();
                                    $("#dbf3dsSampleHeader").empty();
                                    $("#dbf3dsSampleBody").empty();
    
                                    var header = result.DBF_LIST.LIST[0];
    
                                    var htmlHeader="<option value=\"N/A\">선택해주세요</option>";
                                    
                                    for(var i=0;i<header.length;i++){
                                        htmlHeader +="<option value=\""+header[i]+"\">"+header[i]+"</option>\n";
                                       
                                    }
    
                                    var sampleDbfList = result.DBF_LIST.LIST;
    
                                    var htmlBody="";
                                    var htmlTblHeader="";
    
                                    for(var i=0;i<sampleDbfList.length;i++){
                                        
                                        if(i==0){
    
                                            var headers = sampleDbfList[i];
                                            htmlTblHeader+="<tr>\n";
    
                                            for(var j=0;j<headers.length;j++){
                                                htmlTblHeader+="<th nowrap>"+headers[j]+"</th>\n";    
                                            }
    
                                            htmlTblHeader+="</tr>\n";
    
                                        }else{
                                            htmlBody +="<tr>\n";
                                        
                                            var attrs = sampleDbfList[i];
                                            
                                            for(var j=0;j<attrs.length;j++){
                                                htmlBody+="<td nowrap>"+attrs[j]+"</td>\n";
                                            }
                                            
                                            htmlBody +="</tr>\n";
                                        }
    
                                    }
    
                                    $("#dbf3dsHeaderIndx").append(htmlHeader);
                                    $("#dbf3dsHeaderTexture").append(htmlHeader);
    
                                    //샘플 속성보여주기
                                    $("#dbf3dsSampleHeader").append(htmlTblHeader);
                                    $("#dbf3dsSampleBody").append(htmlBody);
    
                                    new PerfectScrollbar(document.getElementById('shp3dsAttrTble'), {
                                        suppressScrollY: true
                                    });
    
                                }else{
                                    var validDbfTxt = "속성 DBF 파일이 없습니다";
                                }
    
                                if(result.EPSG_CODE != 0){
                                    $("#zip3dsPrjInfo").val("EPSG:"+result.EPSG_CODE);
                                }
    
                                $("#dbf3dsEncoding").on('change',function(e){
                                    var encoding = $("#dbf3dsEncoding option:selected").val();
                                    dtcFile.type.model.changeDbfEncoding(encoding);
                                });
    
                                dtcFile.type.zip.global.check3ds=true;
                                COMMON.unblockUIdiv('zipUploadLayerSetting');

                            }else{
                                
                                COMMON.alert('지원하지 않는 타입입니다.','warning',function(){
                                    
                                    $("input[name='zipFileType']:checked").prop('checked',false);
                                    
                                    COMMON.unblockUIdiv('zipUploadLayerSetting');
                                    return false;
                                });

                                return false;
                            }
                         
                        }
                    });

                }else{

                    $("#zipFileTypeInfo").removeClass('col-12');
                    $("#zipFileTypeInfo").addClass('col-6');
    
                    $("#zip3dsSetting").show();                        
                }
            },
            changeDbfEncoding:function(encoding){
                
                var data = {
                    dataId:dtcFile.global.DATAID,
                    dbfFileName : dtcFile.type.model.global.dbfFile,
                    charset:encoding
                };

                $("#dbf3dsSampleHeader").empty();
                $("#dbf3dsSampleBody").empty();

                $.ajax({
                    url:'../ide/change3dsShpEncoding.do',
                    type:'POST',
                    data:data,
                    dataType:'json',
                    success:function(result){
                        console.log(result);

                        var sampleDbfList = result.DBF_LIST.LIST;

                        var htmlBody="";
                        var htmlTblHeader="";

                        for(var i=0;i<sampleDbfList.length;i++){
                            
                            if(i==0){

                                var headers = sampleDbfList[i];
                                htmlTblHeader+="<tr>\n";

                                for(var j=0;j<headers.length;j++){
                                    htmlTblHeader+="<th nowrap>"+headers[j]+"</th>\n";    
                                }

                                htmlTblHeader+="</tr>\n";

                            }else{
                                htmlBody +="<tr>\n";
                            
                                var attrs = sampleDbfList[i];
                                
                                for(var j=0;j<attrs.length;j++){
                                    htmlBody+="<td nowrap>"+attrs[j]+"</td>\n";
                                }
                                
                                htmlBody +="</tr>\n";
                            }

                        }

                        //샘플 속성보여주기
                        $("#dbf3dsSampleHeader").append(htmlTblHeader);
                        $("#dbf3dsSampleBody").append(htmlBody);
                    }
                });
            },
            upload3dsTile:function(){
                
                var layerName = $("#zip3dsLayerUploadName").text();
                $("#uploadedLayerName").text(layerName);

                var thumbImgSrc = $("#fileZip3dsThumNail img").attr('src');
                $("#preViewLayerImg").attr('src',thumbImgSrc);

                $.ajax({
                    url:'../ide/upload3dsTiles.do',
                    type:'POST',
                    data:{dataId:dtcFile.global.DATAID},
                    dataType:'json',
                    success:function(result){

                        if(result.STATUS=="ok"){
                            
                            COMMON.blockUIdiv('MapContainer','LOADING...');

                           //dtcFile.type.model.setProgress(dtcFile.global.DATAID);
                           dtcFile.type.model.getObjRecords(dtcFile.global.DATAID);
                        }else{
                            alert('fail');
                        }
                    }
                });
            },
            getObjRecords:function(dataId){
              
                var data={
                    dataId:dataId
                };

                $.ajax({
                    url:'../ide/get3dsObjRecords.do',
                    type:'POST',
                    data:data,
                    dataType:'json',
                    success:function(result){
                        console.log(result);
                        //dtcFile.type.model.add3dsLayer(result);
                        //Module.getViewCamera().moveLonLatBoundary(new Module.JSVector2D(parseFloat(result.MINX), parseFloat(result.MINY)),new Module.JSVector2D(parseFloat(result.MAXX), parseFloat(result.MAXY)));
                        //dtcFile.type.model.add3dsLayer(result);
                        COMMON.unblockUIdiv('MapContainer');

                        setTimeout(function(){
                            dtcFile.type.model.addLayer(result.INFO);
                            dtcLayer.MODEL.addLayer(result);
                        },1000)
                        
                    }
                });
            },
            setProgress:function(dataId){

                var data={
                    dataId:dataId
                };

                $("#cloudProgrss").show();

                dtcFile.type.model.global.interval = setInterval(function(){

                    $.ajax({
                        
                        url:'../ide/get3dsTileProgress.do',
                        type:'POST',
                        data:data,
                        dataType:'json',
                        success:function(result){
                            if(result.INFO == null){
                                
                                $("#uploadTypeTxt").text(result.TEXT);
                                    
                                $("#uploadFileWizardPrgss").text(result.PERCENT+"%");
                                $("#uploadFileWizardPrgss").css('width',result.PERCENT+'%');

                                if(result.ERROR_CHECK=="1"){
                                    
                                    COMMON.alert("가공 중 에러 발생",'error',dtcFile.type.model.destory);
                                    clearInterval(dtcFile.type.model.global.interval);
                                }

                            }else{
                                
                                $("#uploadFileWizardPrgss").text("100%");
                                $("#uploadFileWizardPrgss").css('width','100%');
                                
                                clearInterval(dtcFile.type.model.global.interval);

                                setTimeout(function(){
                                    $("#cloudProgrss").hide();
                                    dtcFile.type.model.addLayer(result.INFO);
                                    dtcLayer.MODEL.addLayer(result);
                                },2000);

                            }
                        }

                    });

                },3000);
            },
            addLayer:function(obj){

                var layerName = obj.data_name;
                if(layerName.length > 35 ){
                    layerName = layerName.substring(0,35)+"...";
                }
                var layerValue= "meta_asset_"+obj.dataid;

                dtcLayer.global.tile3ds.push(layerValue);

                var html ="<div class=\"card mb-0\" id=\""+layerValue+"\">\n";
                html+=" <div class=\"card-body d-flex justify-content-between align-items-start pb-1 pt-3\">\n";
                html+="     <div>\n";
                html+="         <label class=\"custom-control custom-checkbox\">\n";
                html+="             <input type=\"checkbox\" class=\"custom-control-input layer_input_check\" value=\"meta_asset_"+obj.dataid+"\" id=\"memLayer_"+obj.dataid+"\" checked>\n";
                html+="             <input type=\"hidden\" value=\"Z3\" class=\"layerDataTypeInfo\">"
                html+="                 <span class=\"custom-control-label text-body ts-11 font-weight-semibold layer_inpuct_check\">"+layerName+"</span>\n";
                html+="         </label>\n";
                html+="     </div>\n";
                html+="     <div class=\"btn-group project-actions\">\n";
                html+="         <button type=\"button\" class=\"btn btn-default btn-xs rounded-pill icon-btn md-btn-flat hide-arrow dropdown-toggle\" data-toggle=\"dropdown\" aria-expanded=\"false\">\n";
                html+="             <i class=\"ion ion-ios-more\"></i>\n";
                html+="         </button>\n";
                html+="         <div class=\"dropdown-menu dropdown-menu-right ts-9\">\n";
                //html+="             <a class=\"dropdown-item\" href=\"javascript:dtcFile.type.model.export('"+obj.dataid+"')\"><span class=\"fas fa-file-export\"></span> 내보내기</a>\n";
                //html+="             <a class=\"dropdown-item\" href=\"javascript:dtcFile.type.model.editObj('"+obj.dataid+"')\"><span class=\"fas fa-crop-alt\"></span> 건물편집</a>\n"        
                html+="             <a class=\"dropdown-item\" href=\"javascript:dtcFile.type.model.property('"+obj.dataid+"')\"><span class=\"fas fa-clipboard-list\"></span> 속성</a>\n"        
                html+="             <a class=\"dropdown-item\" href=\"javascript:dtcFile.delete('"+obj.dataid+"')\"><span class=\"far fa-trash-alt\"></span> 삭제</a>\n"        
                html+="         </div>\n"
                html+="     </div>\n";
                html+=" </div>\n";            
                html+=" <div class=\"card-body pb-1 pt-0\">\n";
                html+="     <div class=\"media pl-0\">\n";
                
                var thumbUrl="";

                if(obj.thumbnail_url=="default"){
                    thumbUrl="/assets/img/default.png";
                }else{
                    thumbUrl=obj.thumbnail_url;
                }

                html+="         <img src=\""+thumbUrl+"\" class=\"d-block ui-w-120 mt-1\" style=\"height:9vh;\">\n";
                html+="         <div class=\"media-body ml-2 col-md-10 mt-1 pt-1\">\n"
                html+="             <div class=\"text-white mb-0 ts-10 pb-2\">\n";
                html+="                    <span class=\"d-block mb-1 pb-1\"><i class=\"vacancy-tooltip far fa-map\"></i> "+obj.coord_epsg+"</span>\n";
                //html+="                    <span class=\"d-block mb-1 pb-1\"><i class=\"vacancy-tooltip fas fa-palette\"></i> band :"+obj.bands+"</span>"                                
                html+="                    <span class=\"d-block mb-1\">date: "+obj.reg_date+"</span>"
                html+="             </div>\n";
                html+="         </div>\n";
                html+="     </div>\n";
                html+=" </div>\n"
                html+=" <div class=\"card-body pt-1 pb-3\">\n"
                html+="     <div class=\"row\">\n"
                html+="         <div class=\"col text-right\">\n";
                html+="             <div class=\"font-weight-bold text-primary ts-9\"><i class=\"fas fa-project-diagram\"></i> 3DS</div>\n";
                html+="         </div>\n";
                html+="     </div>\n";
                html+=" </div>\n";
                html+=" <hr class=\"m-0\">\n"
                html+="</div>"
           
                $("#memberLayerLists").prepend(html);
            },
            add3dsLayer:function(obj){

                var layerName = obj.data_name;
                if(layerName.length > 35 ){
                    layerName = layerName.substring(0,35)+"...";
                }
                var layerValue= "meta_asset_"+obj.dataid;
                
                var html ="<div class=\"card mb-0\" id=\""+layerValue+"\">\n";
                html+=" <div class=\"card-body d-flex justify-content-between align-items-start pb-1 pt-3\">\n";
                html+="     <div>\n";
                html+="         <label class=\"custom-control custom-checkbox\">\n";
                html+="             <input type=\"checkbox\" class=\"custom-control-input layer_input_check\" value=\"meta_asset_"+obj.dataid+"\" id=\"memLayer_"+obj.dataid+"\" checked>\n";
                html+="             <input type=\"hidden\" value=\"Z3\" class=\"layerDataTypeInfo\">"
                html+="                 <span class=\"custom-control-label text-body ts-11 font-weight-semibold layer_inpuct_check\">"+layerName+"</span>\n";
                html+="         </label>\n";
                html+="     </div>\n";
                html+="     <div class=\"btn-group project-actions\">\n";
                html+="         <button type=\"button\" class=\"btn btn-default btn-xs rounded-pill icon-btn md-btn-flat hide-arrow dropdown-toggle\" data-toggle=\"dropdown\" aria-expanded=\"false\">\n";
                html+="             <i class=\"ion ion-ios-more\"></i>\n";
                html+="         </button>\n";
                html+="         <div class=\"dropdown-menu dropdown-menu-right ts-9\">\n";
                //html+="             <a class=\"dropdown-item\" href=\"javascript:dtcFile.type.model.export('"+obj.dataid+"')\"><span class=\"fas fa-file-export\"></span> 내보내기</a>\n";
                html+="             <a class=\"dropdown-item\" href=\"javascript:dtcFile.type.model.getProperties('"+obj.dataid+"')\"><span class=\"fas fa-clipboard-list\"></span> 속성</a>\n"        
                html+="             <a class=\"dropdown-item\" href=\"javascript:dtcFile.delete('"+obj.dataid+"')\"><span class=\"far fa-trash-alt\"></span> 삭제</a>\n"        
                html+="         </div>\n"
                html+="     </div>\n";
                html+=" </div>\n";            
                html+=" <div class=\"card-body pb-1 pt-0\">\n";
                html+="     <div class=\"media pl-0\">\n";
                
                var thumbUrl="";

                if(obj.thumbnail_url=="default"){
                    thumbUrl="/assets/img/default.png";
                }else{
                    thumbUrl=obj.thumbnail_url;
                }

                html+="         <img src=\""+thumbUrl+"\" class=\"d-block ui-w-120 mt-1\" style=\"height:9vh;\">\n";
                html+="         <div class=\"media-body ml-2 col-md-10 mt-1 pt-1\">\n"
                html+="             <div class=\"text-white mb-0 ts-10 pb-2\">\n";
                html+="                    <span class=\"d-block mb-1 pb-1\"><i class=\"vacancy-tooltip far fa-map\"></i> "+obj.coord_epsg+"</span>\n";
                //html+="                    <span class=\"d-block mb-1 pb-1\"><i class=\"vacancy-tooltip fas fa-palette\"></i> band :"+obj.bands+"</span>"                                
                html+="                    <span class=\"d-block mb-1\">date: "+obj.reg_date+"</span>"
                html+="             </div>\n";
                html+="         </div>\n";
                html+="     </div>\n";
                html+=" </div>\n"
                html+=" <div class=\"card-body pt-1 pb-3\">\n"
                html+="     <div class=\"row\">\n"
                html+="         <div class=\"col text-right\">\n";
                html+="             <div class=\"font-weight-bold text-primary ts-9\"><i class=\"fas fa-project-diagram\"></i> 3DS</div>\n";
                html+="         </div>\n";
                html+="     </div>\n";
                html+=" </div>\n";
                html+=" <hr class=\"m-0\">\n"
                html+="</div>"
           
                $("#memberLayerLists").prepend(html);

                Module.XDSetMouseState(6);
					//클릭 건물 객체 속성 이벤트 추가하기
				dtcLayer.global.tile3ds.push(layerValue);
					
				var layerList = new Module.JSLayerList(false);
				layerList.nameAtLayer("facility_build").setVisible(false);

                if(!dtcLayer.MODEL.global.checkEvent){
                    Module.canvas.addEventListener("Fire_EventSelectedObject",dtcLayer.MODEL.get3dsShpProps);
                    dtcLayer.MODEL.global.checkEvent=true;
                }
                
            },
            edit3dsObj:function(e){
                
                var objkey = e.currentTarget.value;

                var editHtml = "<div id=\"edit3dsInterface\" style=\"display:none;position: absolute;z-index:101;;width: 200px;height: 110px;\">\n";
                    editHtml +="      <div  class=\"d-flex text-center\" >\n"
                        editHtml +="      <div class=\"col-8 pl-0 pr-0\" style=\"position: relative;\">\n"
                        editHtml +="        <div id=\"edit3dsMove\" class=\"btn icon-btn btn-outline-warning btn-sm ml-3 mt-2\">"
                        editHtml +="            <i class=\"fa fa-arrows-alt\"></i>"
                        editHtml +="        </div>"
                        editHtml +="        <div class=\"col-12 pl-0 pr-0\" style=\"margin-top: auto;margin-bottom: auto;position: absolute;top: 0;bottom: 0;height: 10px;\">"
                        editHtml +="            <span class=\"edit3dsDirSlidetxt\" id=\"edit3dsDirSlidetxt\" style=\"width: 20%;float: left;\">0(º)</span>"
                        editHtml +="            <input type=\"range\" id=\"edit3dsDirSlide\" class=\"form-control-range\" min=\"0\" max=\"360.0\" step=\"1\" oninput=\"dtcFile.type.model.setObjectDirection(this.value);\" style=\"width: 80%;\">"
                        editHtml +="        </div>"
                        editHtml +="      </div>"
                        editHtml +="      <div class=\"col-2 pl-0 pr-0\" style=\"margin-top: auto;margin-bottom: auto;\">"
                        editHtml +="         <button type=\"button\" id=\"edit3dsScaleUp\" class=\"btn btn-success btn-sm icon-btn mb-1 mt-2\" onclick=\"dtcFile.type.model.setScale(1.0);\">"
                        editHtml +="            <i class=\"fa fa-search-plus\"></i>"
                        editHtml +="         </button>"
                        editHtml +="         <button type=\"button\" id=\"edit3dsScaleDown\" class=\"btn btn-success btn-sm icon-btn mb-1\" onclick=\"dtcFile.type.model.setScale(-1.0);\">"
                        editHtml +="            <i class=\"fa fa-search-minus\"></i>"   
                        editHtml +="         </button>"
                        editHtml +="         <button type=\"button\" id=\"edit3dsSaveBtn\" class=\"btn btn-info btn-sm icon-btn mb-1\" onclick=\"dtcFile.type.model.savePositionInfo();\">"
                        editHtml +="            <i class=\"far fa-save\"></i>"
                        editHtml +="         </button>"
                        editHtml +="         <button type=\"button\" id=\"edit3dsRemoveBtn\" class=\"btn btn-warning btn-sm icon-btn\" onclick=\"dtcFile.type.model.deleteObj(this);\">"    
                        editHtml +="            <i class=\"fa fa-trash\"></i>"
                        editHtml +="         </button>"
                        editHtml +="       </div>"
                        editHtml +="       <div class=\"col-2 pl-0 pr-0\" style=\"margin-top:38px;\">"
                        editHtml +="            <button type=\"button\" id=\"edit3dsHeightUp\" class=\"btn btn-dark btn-sm icon-btn mb-1\" onclick=\"dtcFile.type.model.setObjHeight(0.5);\">"
                        editHtml +="                <i class=\"fas fa-arrow-up\"></i>"
                        editHtml +="             </button>"
                        editHtml +="            <button type=\"button\" id=\"edit3dsHeightDown\" class=\"btn btn-dark btn-sm icon-btn mb-1\" onclick=\"dtcFile.type.model.setObjHeight(-0.5);\">"
                        editHtml +="                <i class=\"fas fa-arrow-down\"></i>"
                        editHtml +="             </button>"
                        editHtml +="       </div>"
                    editHtml +="       </div>"
                    editHtml +="</div>"

                    var map = Module.getMap();
                    var model = map.getSelectObject();

                    if(model != null){
                        dtcFile.type.model.setPositionWithMouseEvent();
                    }else{
                        
                        if(dtcLayer.MODEL.global.layer != null){
                            var obj3ds = dtcLayer.MODEL.global.layer.keyAtObject(objkey.toString());
                            var posInfo = obj3ds.getPosition();

                            var lon = posInfo.Longitude;
                            var lat = posInfo.Latitude;
                            var alt = posInfo.Altitude;

                            Module.getMap().setSelectObject(obj3ds);

                            dtcFile.type.model.setPositionWithBtn(lon,lat,alt);

                        }else{
                            return;
                        }
                    }

                    var editUi = document.getElementById('edit3dsInterface');
                    
                    if(editUi == null){
                        $("#MapContainer").append(editHtml);
                        $("#edit3dsRemoveBtn").attr('value',objkey);
                    }else{
                        $("#edit3dsRemoveBtn").attr('value',objkey);
                    }

                    if(!dtcFile.type.model.global.eventCheck){
                        dtcFile.type.model.global.eventCheck=true;
                    }
                    
                    dtcFile.type.model.editEventInit();

                    dtcFile.type.model.global.editInit=true;
                    

            },
            editObj:function(dataId){
                
                var editHtml = "<div id=\"edit3dsInterface\" style=\"display:none;position: absolute;z-index:101;;width: 200px;height: 110px;overflow\">\n";
                    editHtml +="      <div  class=\"d-flex text-center\" >\n"
                        editHtml +="      <div class=\"col-8 pl-0 pr-0\" style=\"position: relative;\">\n"
                        editHtml +="        <div id=\"edit3dsMove\" class=\"btn icon-btn btn-outline-warning btn-sm ml-3 mt-2\">"
                        editHtml +="            <i class=\"fa fa-arrows-alt\"></i>"
                        editHtml +="        </div>"
                        editHtml +="        <div class=\"col-12 pl-0 pr-0\" style=\"margin-top: auto;margin-bottom: auto;position: absolute;top: 0;bottom: 0;height: 10px;\">"
                        editHtml +="            <span class=\"edit3dsDirSlidetxt\" id=\"edit3dsDirSlidetxt\" style=\"width: 20%;float: left;\">0(º)</span>"
                        editHtml +="            <input type=\"range\" id=\"edit3dsDirSlide\" class=\"form-control-range\" min=\"0\" max=\"360.0\" step=\"1\" oninput=\"dtcFile.type.model.setObjectDirection(this.value);\" style=\"width: 80%;\">"
                        editHtml +="        </div>"
                        editHtml +="      </div>"
                        editHtml +="      <div class=\"col-2 pl-0 pr-0\" style=\"margin-top: auto;margin-bottom: auto;\">"
                        editHtml +="         <button type=\"button\" id=\"edit3dsScaleUp\" class=\"btn btn-success btn-sm icon-btn mb-1 mt-2\" onclick=\"dtcFile.type.model.setScale(1.0);\">"
                        editHtml +="            <i class=\"fa fa-search-plus\"></i>"
                        editHtml +="         </button>"
                        editHtml +="         <button type=\"button\" id=\"edit3dsScaleDown\" class=\"btn btn-success btn-sm icon-btn mb-1\" onclick=\"dtcFile.type.model.setScale(-1.0);\">"
                        editHtml +="            <i class=\"fa fa-search-minus\"></i>"   
                        editHtml +="         </button>"
                        editHtml +="         <button type=\"button\" id=\"edit3dsSaveBtn\" class=\"btn btn-info btn-sm icon-btn mb-1\" onclick=\"dtcFile.type.model.savePositionInfo();\">"
                        editHtml +="            <i class=\"far fa-save\"></i>"
                        editHtml +="         </button>"
                        editHtml +="         <button type=\"button\" id=\"edit3dsRemoveBtn\" class=\"btn btn-warning btn-sm icon-btn\" onclick=\"dtcFile.type.model.deleteObj(this);\">"    
                        editHtml +="            <i class=\"fa fa-trash\"></i>"
                        editHtml +="         </button>"
                        editHtml +="       </div>"
                    editHtml +="       </div>"
                    editHtml +="</div>"

                if(dtcLayer.MODEL.global.checkEvent){//레이어 켜진 경우

                    if(!dtcFile.type.model.global.editInit){
                        $("#MapContainer").append(editHtml);

                        dtcFile.type.model.editEventInit();
                        dtcFile.type.model.global.editInit=true;

                    }

                }else{//레이어 꺼진 경우
                    
                    COMMON.alert('레이어가 꺼져있습니다.','warning',function(){
                        return false;
                    })

                    dtcFile.type.model.global.editInit=false;

                    return;
                }
                
            },
            editEventInit:function(){
                $( "#edit3dsInterface" ).draggable({ 
                    containment: "#MapContainer", 
                    handle: "#edit3dsMove",
                    scroll: false,
                    drag:function(e){
                       var moveBtn = document.getElementById('edit3dsMove');
                       var posInfo = moveBtn.getBoundingClientRect();
                       
                       var x = posInfo.x;
                       var y = posInfo.y;

                       dtcFile.type.model.moveObj(x-30,y+30);
                    },
             
                });

                // 건물 편집 UI 마우스 오버 시 지도 이동 및 회전 block sumin 210415

                $('#edit3dsInterface').on('mouseenter',function(e){
                    console.log("mouseenter");
                    var control = Module.getControl();
                    control.setMousePanMode(false);
                    control.setMouseRotMode(false);
                    control.setMouseZoomMode(false); 
                });

                $('#edit3dsInterface').on('mouseleave',function(e){
                    console.log("mouseleave");
                    var control = Module.getControl();
                    control.setMousePanMode(true);
                    control.setMouseRotMode(true);
                    control.setMouseZoomMode(true); 
                })

                $('#edit3dsInterface').mouseenter(function () {
                    Module.XDIsMouseOverDiv(true);
  
                });
                
                $('#edit3dsInterface').mouseleave(function () {
                    Module.XDIsMouseOverDiv(false);
                });

                $('#edit3dsInterface').bind("contextmenu", function(e) {
                    return false;
                });

                Module.canvas.addEventListener("wheel", dtcFile.type.model.setPositionWithMouseEvent);
                Module.canvas.addEventListener("mousedown", function(e){
                    dtcFile.type.model.global.clickDown=true;
                    
                });

                Module.canvas.addEventListener("mousemove", function(e){
                    
                    if(dtcFile.type.model.global.clickDown){
                      
                        dtcFile.type.model.setPositionWithMouseEvent(e);
                    }
                    
                });

                Module.canvas.addEventListener("mouseup", function(e){
                    var map = Module.getMap();
                    var model = map.getSelectObject();

                    if(model==null || model=='undefined'){
                        $("#edit3dsInterface").hide();
                    }

                    dtcFile.type.model.global.clickDown=false;
                });	

            },
            removeEventInit:function(){

            },
            setObjHeight:function(height){
                
                var map = Module.getMap();
                var model = map.getSelectObject();
               
                var posInfo = model.getPosition();

                // base point 설정
				var modelHeight = Module.getGhostSymbolMap().getGhostSymbolSize(model.getId());

                var lon = posInfo.Longitude;
                var lat = posInfo.Latitude;

                var alt = posInfo.Altitude;

                var altitude = alt + height;

                var posObj = new Module.JSVector3D(lon, lat, altitude);
                model.setBasePoint(0,-modelHeight*0.5,0);
                model.setPosition(posObj);
                
            },
            setPositionWithBtn:function(lon,lat,alt){
                var screenPos = Module.getMap().MapToScreenPointEX(new Module.JSVector3D(lon, lat, alt));

                var editUi = document.getElementById("edit3dsInterface");

                editUi.style.left=(screenPos.x-70)+"px";
                editUi.style.top=(screenPos.y-30)+"px";
                
                $("#edit3dsInterface").show();
            },
            setPositionWithMouseEvent:function(){
                var map = Module.getMap();
                var model = map.getSelectObject();

                if(model != null && dtcFile.type.model.global.eventCheck){
                    setTimeout(function(){
                        var posInfo = model.getPosition();
                        var lon = posInfo.Longitude;
                        var lat = posInfo.Latitude;
                        var alt = posInfo.Altitude;
                        
                        var screenPos = Module.getMap().MapToScreenPointEX(new Module.JSVector3D(lon, lat, alt));
    
                        var editUi = document.getElementById("edit3dsInterface");
                        editUi.style.left=(screenPos.x-70)+"px";
                        editUi.style.top=(screenPos.y-30)+"px";
                        
                        $("#edit3dsInterface").show();
                      
                    },500)

                    
                }

                $("#edit3dsInterface").hide();
              
            
            },
            moveObj:function(x,y){
                var map = Module.getMap();
                var model = map.getSelectObject();

                if(model == null){
                    return;
                }

                var position = map.ScreenToMapPointEX( new Module.JSVector2D(x,y) );
                model.setPosition(position);

                Module.XDRenderData();
            },
            setObjEditUi:function(e){
                
                var objInfo = e.objKey.split("#");
                var gid = objInfo[0];
                var lon = objInfo[1];
                var lat = objInfo[2];
                var alt = objInfo[3];

                if(dtcFile.type.model.global.editInit){
                    
                    var map = Module.getMap();
                    var model = map.getSelectObject();

                    var posInfo = model.getPosition();
                    lon = posInfo.Longitude;
                    lat = posInfo.Latitude;
                    alt = posInfo.Altitude;

                }
                

                /*if(alt == 'NaN' || alt == null || alt == 'undefined' || ( alt != null && typeof alt == "object" && !Object.keys(alt).length)){
                    alt =  Module.getMap().getTerrHeightFast(parseFloat(lon),parseFloat(lat));
                }*/
                var pos = new Module.JSVector3D(parseFloat(lon),parseFloat(lat),parseFloat(alt));

                var screenPos = Module.getMap().MapToScreenPointEX(pos);

                var editUi = document.getElementById("edit3dsInterface");
                editUi.style.left=(screenPos.x-70)+"px";
                editUi.style.top=(screenPos.y-30)+"px";
                
                $("#edit3dsInterface").show();


            },
            setObjectDirection:function(val){
                
                //console.log(val);
                $("#edit3dsDirSlidetxt").text(val+"(º)");

                var map = Module.getMap();
                var model = map.getSelectObject();

                var originVal = model.getRotationX();

                setTimeout(function(){
                    model.setRotation(0,parseFloat(originVal+val),0);
                },100)
                

            },
            setScale:function(val){
                
                var map = Module.getMap();
                var model = map.getSelectObject();

                var originVal = model.getScale().height;
                var value = originVal+parseFloat(val);

                setTimeout(function(){
                    model.setScale(new Module.JSSize3D(value, value, value));
                },100)
                

            },
            savePositionInfo:function(){
                
                var map = Module.getMap();
                var model = map.getSelectObject();
                
                var scaleInfo = model.getScale();
                
                var scaleX = scaleInfo.width;
                var scaleY = scaleInfo.height;
                var scaleZ = scaleInfo.depth;

                var dirInfo = model.getRotationY();

                var pos = model.getPosition();
                var posLon = pos.Longitude;
                var posLat = pos.Latitude;
                var posAlt = pos.Altitude;
                
                var layerName = model.getLayerName();
                var dataId = layerName.split("_")[2];
                var keyInfo = model.getGhostSymbolMapKey().split("_")[3];

                var param = {
                    gid:keyInfo,
                    dataId:dataId,    
                    scaleX:scaleX, 
                    scaleY:scaleY, 
                    scaleZ:scaleZ, 
                    dirInfo:dirInfo,
                    lon: posLon,
                    lat: posLat,
                    alt: posAlt
                }

                $.ajax({
                    url:'../ide/update3dsObjInfo.do',
                    type:'POST',
                    data:param,
                    dataType:'json',
                    success:function(result){
                        
                        if(result.RS=="complete"){
                            
                            COMMON.alert('저장되었습니다','success',function(e){
                                $("#edit3dsInterface").hide();
                                $("#edit3dsDirSlidetxt").text("0(º)");
                                $("#edit3dsDirSlide").val(0);
                                $("#singleShpProperties").hide();
                            });

                        }
                    }
                })
            },
            deleteObj:function(e){
                
                COMMON.confirm('삭제하시겠습니까?','삭제 후 복구가 불가능합니다.','warning',function(){
                    var key = e.value;
                    var model = dtcLayer.MODEL.global.layer.keyAtObject(key);

                    var layerName = model.getLayerName();
                    var dataId = layerName.split("_")[2];

                    var data={
                        dataId:dataId,
                        key:key
                    }

                    $.ajax({
                        url:'../model/delete3dsObj.do',
                        type:'POST',
                        data:data,
                        dataType:'json',
                        success:function(result){
                            
                            if(result.RS=="complete"){
                                //삭제 처리
                            	LOG_TRACKER.write('34','2','데이터 삭제:{DataId:'+dataId+'}');
                                var obj3ds = dtcLayer.MODEL.global.layer.keyAtObject(key.toString());
                                obj3ds.setVisible(false);
                                
                                $("#singleShpProperties").hide();

                                dtcFile.type.model.global.eventCheck=false;
                                Module.getMap().clearSelectObj();
                                $("#single3dsEditBtn").hide();
                                $("#single3dsEditBtn").off('click');

                                $("#edit3dsInterface").hide();

                               /* if(dtcLayer.MODEL.global.layer != null){
                                    
                                    dtcFile.type.model.global.eventCheck=false;
                                    Module.getMap().clearSelectObj();
                                    $("#single3dsEditBtn").hide();
                                    $("#single3dsEditBtn").off('click');

                                    $("#edit3dsInterface").hide();
                                    
                                }*/

                            }
                        }
                    });
                    
                },function(){
                    return;
                })

            },
            property:function(dataId){
               
                //csv display none;
                $("#csvPropertyDisplay").hide();
                //싱글 속성 이벤트 제거
                $("#canvas").off('click',dtcLayer.SHP.getSingleProperty);
                //싱글 속성 이벤트 창 제거
                $("#singleShpProperties").hide();
 
                 var data = {
                     DATAID: dataId,
                     MEMID: D_MEMBER.MID
                 }

                 dtcFile.type.model.global.editData.dataId=dataId;
                 $("#modelPropertiesHeader").empty();
                 $("#modelPropertiesBody").empty();
               
                 $.ajax({
                    url: './model/getProperties.do',
                    type: 'POST',
                    data: data,
                    dataType: 'json',
                    success: function(result) {

                        $("#modelPropertyName").text(result.LAYER_NAME);
                        var objHeader = result.HEADER;
                        var objList = result.LIST;
                       
                        if(objList.length ==0){
                           dtcFile.type.model.global.moreList=true;
                        }
                        var headerHtml = "<tr>";
                        headerHtml += "<th>no</th>;"
                        
                        for (var i = 0; i < objHeader.length; i++) {

                            if(objHeader[i] != 'gid'){
                               headerHtml += "<th nowrap>" + objHeader[i] +"</th>\n";
                               
                            }
                            
                        }

                        headerHtml += "</tr>";

                        var html = "";

                        for (var i = 0; i < objList.length; i++) {

                            html += "<tr>\n";
                            html += "<td nowrap><button class=\"btn icon-btn btn-sm btn-outline-info borderless\" onclick=\"dtcFile.type.model.setCameraView("+objList[i].pos_x+","+objList[i].pos_y+","+objList[i].pos_z+");\" value=\"" +objList[i].gid +"\"><span class=\"fas fa-map-marker-alt\"></span></button></td>\n"

                            for (var j = 0; j < objHeader.length; j++) {

                                var column = objHeader[j];
                                if (column != "gid"){
                                   
                                   if (column != "pos_x" || column != "pos_y" || column != "pos_z") {
                                       
                                        html += "	<td nowrap>\n";
                                        html += "		<span class=\"text-white shpAttrEditBtn\">" +
                                            objList[i][column] +
                                            "</span>\n";
                                        html += "		<input type=\"hidden\" value=\"" +
                                            objList[i].gid +
                                            "#" +
                                            column +
                                            "#" +
                                            objList[i][column] +
                                            "\" />";
                                        html += "	</td>\n"

                                    } 
                                }

                            }

                            html += "</tr>\n";
                        }

                        dtcFile.type.model.global.scrollbar = new PerfectScrollbar(
                            document
                            .getElementById('modelPropertiesTable'));

                        $("#modelPropertiesHeader").append(headerHtml);
                        $("#shp3dsDisplay").show();
                        $("#modelPropertiesBody").append(html);
                           
                        $("#close3dsAttrBtn").on('click',function(e){
                           
                           $("#modelPropertiesHeader").empty();
                           $("#modelPropertiesBody").empty();
                           $("#shp3dsDisplay").hide();

                           dtcFile.type.model.global.pageNum = 0;

                           dtcFile.type.model.global.checkSearch = false;
                           dtcFile.type.model.global.moreCheck = false;
   
                           if (dtcFile.type.model.global.scrollbar != null) {
   
                               var scrollElement = document
                                   .getElementById('modelPropertiesTable');
                               scrollElement.removeEventListener(
                                   'ps-y-reach-end',
                                   dtcFile.type.model.moreGetPropertyList);
   
                               dtcFile.type.model.global.scrollbar.destroy();
                               dtcFile.type.model.global.scrollbar = null;
                           }
   
                           dtcFile.type.model.global.editData = {};
                           var scrollElement = document.getElementById('modelPropertiesTable');
                           scrollElement.removeEventListener('ps-y-reach-end',dtcFile.type.model.moreGetPropertyList);

                           dtcFile.type.model.global.moreList=false;
                        });

                        var scrollElement = document.getElementById('modelPropertiesTable');
                       scrollElement.addEventListener('ps-y-reach-end',dtcFile.type.model.moreGetPropertyList);

                    }
                });
                 
             
            
            },
            moreGetPropertyList:function(e){

                dtcFile.type.model.global.pageNum += 20;
                dtcFile.type.model.global.editData.pageNum = dtcFile.type.model.global.pageNum;

                if(!dtcFile.type.model.global.moreList){
                    $.ajax({
                        url: './model/getModelPropsMore.do',
                        type: 'POST',
                        data: dtcFile.type.model.global.editData,
                        dataType: 'json',
                        success: function(result) {
                            if(result.STATUS !=1){
                                var objHeader = result.HEADER;
                                var objList = result.PROPERTY;
                                
                                var headerHtml = "<tr>";
                                headerHtml += "<th>no</th>;"
                                
                                for (var i = 0; i < objHeader.length; i++) {
    
                                    if(objHeader[i] != 'gid'){
                                       headerHtml += "<th nowrap>" + objHeader[i] +"</th>\n";
                                       
                                    }
                                    
                                }
    
                                headerHtml += "</tr>";
    
                                var html = "";
    
                                for (var i = 0; i < objList.length; i++) {
    
                                    html += "<tr>\n";
                                    html += "<td nowrap><button class=\"btn icon-btn btn-sm btn-outline-info borderless\" onclick=\"dtcFile.type.model.setCameraView("+objList[i].pos_x+","+objList[i].pos_y+","+objList[i].pos_z+");\" value=\"" +objList[i].gid +"\"><span class=\"fas fa-map-marker-alt\"></span></button></td>\n"
    
                                    for (var j = 0; j < objHeader.length; j++) {
    
                                        var column = objHeader[j];
                                        if (column != "gid"){
                                           
                                           if (column != "pos_x" || column != "pos_y" || column != "pos_z") {
                                               
                                                html += "	<td nowrap>\n";
                                                html += "		<span class=\"text-white shpAttrEditBtn\">" +
                                                    objList[i][column] +
                                                    "</span>\n";
                                                html += "		<input type=\"hidden\" value=\"" +
                                                    objList[i].gid +
                                                    "#" +
                                                    column +
                                                    "#" +
                                                    objList[i][column] +
                                                    "\" />";
                                                html += "	</td>\n"
        
                                            } 
                                        }
    
                                    }
    
                                    html += "</tr>\n";
                                }
    
                                $("#modelPropertiesBody").append(html);
                            }else{
                                dtcFile.type.model.global.moreList=true;
                                return;
                            }
    
                           
                            /*$(".geomBtn").on('click',dtcFile.type.model.getGeometry);
                            $(".shpAttrEditBtn").on('click',dtcFile.type.model.editProperties);*/
                        },
                        error: function(request, status, error) {
                            dtcFile.type.model.global.pageNum = 0;
                            dtcFile.type.model.global.editData.pageNum = 0;
                        }
                    });
                }else{
                    return;
                }

           
           
            },
            setCameraView:function(x,y,z){
                
                var lon = parseFloat(x);
                var lat = parseFloat(y);
                var alt = parseFloat(z);

                Module.getViewCamera().setViewAt(lon,lat,alt+60,90,0);

            },
            destory:function(){
                
                var data = {
                    dataId:dtcFile.global.DATAID,
                    type:dtcFile.type.zip.global.dataType
                }

                $.ajax({
                    url:'../cloud/removeZipProcess.do',
                    type:'POST',
                    data:data,
                    dataType:'json',
                    success:function(result){
                        //console.log(result);
                        $("#uploadFileWizardPrgss").text("0%");
                        $("#uploadFileWizardPrgss").css('width','0%');
                        $("#cloudProgrss").hide();
                    }
                });

            }
        },
        drone:{
            global:{
                interval:null,
                params:{
                    x:null,
                    y:null,
                    z:null,
                    epsg:null
                }
            },
            setDataInfo:function(dataId){
                
                $("#zipFileTypeInfo").removeClass('col-12');
                $("#zipFileTypeInfo").addClass('col-6');

                $("#zipdroneSetting").show();

                if(!dtcFile.type.zip.global.checkdrone){
                    $("#next-sw-btn").addClass('disabled');
                    var data={
                        dataId:dataId
                    }

                    $.ajax({
                        url:'../ide/getDaeFileInfo.do',
                        type:'POST',
                        data:data,
                        dataType:'json',
                        success:function(result){
                            
                            if(result.STATUS=="ok"){
                                
                                $("#next-sw-btn").removeClass('disabled');

                                var epsgCode=result.EPSG;
                                
                                var x = result.X;
                                var y = result.Y;
                                var z = result.Z;

                                $("#zipDronePrjInfo").val(epsgCode);
                                
                                dtcFile.type.drone.global.params.x=x;
                                dtcFile.type.drone.global.params.y=y;
                                dtcFile.type.drone.global.params.z=z;
                                dtcFile.type.drone.global.params.epsg=epsgCode;

                                COMMON.unblockUIdiv('zipUploadLayerSetting');

                            }else{

                                COMMON.alert('지원하지 않는 타입입니다.','warning',function(){
                                    
                                    $("input[name='zipFileType']:checked").prop('checked',false);
                                    
                                    COMMON.unblockUIdiv('zipUploadLayerSetting');
                                    return false;
                                });

                                return false;

                            }
                        }

                    });
                }

            },
            uploadDroneData:function(){

                dtcFile.type.drone.global.params.epsg=$("#zipDronePrjInfo").val();
                
                $.ajax({
                    url:'../ide/uploadDroneData.do',
                    type:'POST',
                    data:dtcFile.type.drone.global.params,
                    dataType:'json',
                    success:function(result){
                        console.log(result);
                        if(result.STATUS=="ok"){

                            $("#preViewLayerImg").attr('src',dtcFile.type.drone.global.params.imgUrl);
                            $("#uploadedLayerName").text(dtcFile.type.drone.global.params.layerName);
                            dtcFile.type.drone.setProgress(dtcFile.global.DATAID);
                            
                        }else{
                            alert('fail');
                        }

                    }
                });
            },
            setProgress:function(dataId){
                
                var data={
                    dataId:dataId
                };

                $("#cloudProgrss").show();

                dtcFile.type.drone.global.interval = setInterval(function(){

                    $.ajax({
                        
                        url:'../ide/getDroneProgress.do',
                        type:'POST',
                        data:data,
                        dataType:'json',
                        success:function(result){
                            
                            if(result.INFO == null){
                                
                                $("#uploadTypeTxt").text(result.TEXT);
                                    
                                $("#uploadFileWizardPrgss").text(result.PERCENT+"%");
                                $("#uploadFileWizardPrgss").css('width',result.PERCENT+'%');

                            }else{
                                
                                $("#uploadFileWizardPrgss").text("100%");
                                $("#uploadFileWizardPrgss").css('width','100%');
                                
                                if(result.STATUS==20){

                                    clearInterval(dtcFile.type.drone.global.interval);

                                    setTimeout(function(){
                                        $("#cloudProgrss").hide();
                                        dtcFile.type.drone.addLayer(result.INFO);
                                        dtcLayer.DRONE_MODEL.addLayer(result);
                                        //dtcLayer.clonLayerInfo(result,'memberLayerLists','F');
                                    },2000);

                                }

                            }
                        }

                    });

                },3000);
            },
            addLayer:function(obj){
              
                var layerName = obj.data_name;
                if(layerName.length > 35 ){
                    layerName = layerName.substring(0,35)+"...";
                }
                var layerValue= "meta_asset_"+obj.dataid;
                
                var html ="<div class=\"card mb-0\" id=\""+layerValue+"\">\n";
                html+=" <div class=\"card-body d-flex justify-content-between align-items-start pb-1 pt-3\">\n";
                html+="     <div>\n";
                html+="         <label class=\"custom-control custom-checkbox\">\n";
                html+="             <input type=\"checkbox\" class=\"custom-control-input layer_input_check\" value=\"meta_asset_"+obj.dataid+"\" id=\"memLayer_"+obj.dataid+"\" checked>\n";
                html+="             <input type=\"hidden\" value=\"Z3\" class=\"layerDataTypeInfo\">"
                html+="                 <span class=\"custom-control-label text-body ts-11 font-weight-semibold layer_inpuct_check\">"+layerName+"</span>\n";
                html+="         </label>\n";
                html+="     </div>\n";
                html+="     <div class=\"btn-group project-actions\">\n";
                html+="         <button type=\"button\" class=\"btn btn-default btn-xs rounded-pill icon-btn md-btn-flat hide-arrow dropdown-toggle\" data-toggle=\"dropdown\" aria-expanded=\"false\">\n";
                html+="             <i class=\"ion ion-ios-more\"></i>\n";
                html+="         </button>\n";
                html+="         <div class=\"dropdown-menu dropdown-menu-right ts-9\">\n";
                //html+="             <a class=\"dropdown-item\" href=\"javascript:dtcFile.type.drone.export('"+obj.dataid+"')\"><span class=\"fas fa-file-export\"></span> 내보내기</a>\n";
                html+="             <a class=\"dropdown-item\" href=\"javascript:dtcFile.type.drone.setRatio('"+obj.dataid+"')\"><span class=\"fas fa-cog\"></span> 설정</a>\n"        
                html+="             <a class=\"dropdown-item\" href=\"javascript:dtcFile.delete('"+obj.dataid+"')\"><span class=\"far fa-trash-alt\"></span> 삭제</a>\n"        
                html+="         </div>\n"
                html+="     </div>\n";
                html+=" </div>\n";            
                html+=" <div class=\"card-body pb-1 pt-0\">\n";
                html+="     <div class=\"media pl-0\">\n";
                
                var thumbUrl="";

                if(obj.thumbnail_url=="default"){
                    thumbUrl="/assets/img/default.png";
                }else{
                    thumbUrl=obj.thumbnail_url;
                }

                html+="         <img src=\""+thumbUrl+"\" class=\"d-block ui-w-120 mt-1\" style=\"height:9vh;\">\n";
                html+="         <div class=\"media-body ml-2 col-md-10 mt-1 pt-1\">\n"
                html+="             <div class=\"text-white mb-0 ts-10 pb-2\">\n";
                html+="                    <span class=\"d-block mb-1 pb-1\"><i class=\"vacancy-tooltip far fa-map\"></i> "+obj.coord_epsg+"</span>\n";
                //html+="                    <span class=\"d-block mb-1 pb-1\"><i class=\"vacancy-tooltip fas fa-palette\"></i> band :"+obj.bands+"</span>"                                
                html+="                    <span class=\"d-block mb-1\">date: "+obj.reg_date+"</span>"
                html+="             </div>\n";
                html+="         </div>\n";
                html+="     </div>\n";
                html+=" </div>\n"
                html+=" <div class=\"card-body pt-1 pb-3\">\n"
                html+="     <div class=\"row\">\n"
                html+="         <div class=\"col text-right\">\n";
                html+="             <div class=\"font-weight-bold text-primary ts-9\"><i class=\"fab fa-bandcamp\"></i> DRONE 3D</div>\n";
                html+="         </div>\n";
                html+="     </div>\n";
                html+=" </div>\n";
                html+=" <hr class=\"m-0\">\n"
                html+="</div>"
                
                $("#memberLayerLists").prepend(html);

            },
			setRatio:function(dataId){
				var dronRatioName = $("#memLayer_"+dataId).parent().children('span').text();
				$("#dronRatioName").text(dronRatioName);
				
				var layerList = new Module.JSLayerList(true);
				var DRONE_LOD_LAYER = layerList.nameAtLayer($("#memLayer_"+dataId).val());
				if(DRONE_LOD_LAYER != null && layerList.nameAtLayer($("#memLayer_"+dataId).val()).getVisible()){
					
					$("#dronRatioDisplay").show();
					var range = $("#tileLoadSlider").data("ionRangeSlider");
					if(range != undefined) range.destroy();
					range = $("#objectDetailSlider").data("ionRangeSlider");
					if(range != undefined) range.destroy();
					range = $("#objectAlphaSlider").data("ionRangeSlider");	
					if(range != undefined) range.destroy();
					range = $("#objectHeightSlider").data("ionRangeSlider");
					if(range != undefined) range.destroy();
					$("#tileLoadSlider").ionRangeSlider({
						skin: "square",
						min: 0,
						max: 3,
						step: 0.1,
						onFinish: function (data) {
							DRONE_LOD_LAYER.tile_load_ratio = data.from;
							Module.XDRenderData();
				        },
					});
					$("#tileLoadSlider").data("ionRangeSlider").update({from: parseFloat(DRONE_LOD_LAYER.tile_load_ratio.toFixed(1))});
					$("#objectDetailSlider").ionRangeSlider({
						skin: "square",
						min: 0,
						max: 3,
						step: 0.1,
						onFinish: function (data) {
				            DRONE_LOD_LAYER.lod_object_detail_ratio = data.from;
							Module.XDRenderData();
				        },
					});
					$("#objectDetailSlider").data("ionRangeSlider").update({from: parseFloat(DRONE_LOD_LAYER.lod_object_detail_ratio.toFixed(1))});
					$("#objectAlphaSlider").ionRangeSlider({	
						skin: "square",	
						min: 0,	
						max: 100,	
						step: 10,	
						onFinish: function (data) {	
							DRONE_LOD_LAYER.lod_object_alpha = data.from * 0.01;	
							Module.XDRenderData();	
				        },	
					});	
					$("#objectAlphaSlider").data("ionRangeSlider").update({from: parseFloat(DRONE_LOD_LAYER.lod_object_alpha*100)});
					$("#objectHeightSlider").ionRangeSlider({	
						skin: "square",	
						min: -10,	
						max: 10,	
						step: 1,	
						onFinish: function (data) {	
							DRONE_LOD_LAYER.altitude_offset = data.from;	
							Module.XDRenderData();
				        },
					});
					$("#objectHeightSlider").data("ionRangeSlider").update({from: parseInt(DRONE_LOD_LAYER.altitude_offset)});	
				}else{
					$("#dronRatioDisplay").hide();
					COMMON.alert('레이어를 불러온 후 확인할 수 있습니다.','warning',function(){return false;});
				}
			}
        },
        gpx:{
            setting:function(result){
                
                var gpxInfo = result.GPX_INFO;
                var wptObj = null;
                var rteObj = null;
                var trkObj = null;

                if(gpxInfo.METADATA !=''){
                    var metadata = JSON.parse(gpxInfo.METADATA);
                        
                    if(metadata.author != null){
                        $("#gpxAuthorTxt").text(metadata.author.name);
                        $("#gpxAuthorEmail").text(metadata.author.email.id+"@"+metadata.author.email.domain);

                        $("#gpxAuthorInfo").show();
                    }

                    if(metadata.bounds != null){
                    
                        var minx = metadata.bounds.minlon;
                        var miny = metadata.bounds.minlat;
                        var maxx = metadata.bounds.maxlon;
                        var maxy = metadata.bounds.maxlat;

                        $("#gpxBoundsTxt").text(minx+","+miny+","+maxx+","+maxy);
                        $("#gpxBoundsInfo").show();
                    }

                    if(metadata.time != null){
                        $("#gpxTimeTxt").text(metadata.time);
                        $("#gpxTimeInfo").show();
                    }

                    if(metadata.desc != null){
                        $("#gpxDescTxt").text(metadata.desc);
                        $("#gpxDescInfo").show();
                    }

                    if(metadata.name != null){
                        $("#gpxNameTxt").text(metadata.name);
                        $("#gpxNameInfo").show();
                    }

                    if(metadata.keywords != null){
                        $("#gpxKeywordsTxt").text(metadata.keywords);
                        $("#gpxKeywordsInfo").show();
                    }
                }else{
                    $("#gpxNoneTxt").text('속성 정보가 없습니다');
                    $("#gpxNoneInfo").show();
                }

                if(gpxInfo.RTE != ""){
                    rteObj = JSON.parse(gpxInfo.RTE);
                    $("#gpxRteColorDiv").show();
                }

                if(gpxInfo.WPT != ""){
                    wptObj = JSON.parse(gpxInfo.WPT);
                }

                if(gpxInfo.TRK != ""){
                    trkObj = JSON.parse(gpxInfo.TRK);
                    $("#trkRteColorDiv").show();
                }


                $("#gpxDataName").val(result.LAYER_NAME);
                $("#gpxLayerSetting").show();
            },
            uploadGpxLayer:function(){
                
                var data = {
                    dataId:dtcFile.global.DATAID
                }

                $.ajax({
                    url:'../gpx/getGpxLayerInfo.do',
                    type:'POST',
                    data:data,
                    dataType:'json',
                    success:function(result){
                        console.log(result);
                        
                        if(result.STATE !=0){
                            dtcLayer.GPX.addLayer(result);
                            dtcLayer.clonLayerInfo(result.INFO,'memberLayerLists','F');
                        }
                        
                    }
                })

            },

        
        },
        bim:{
            global:{
                setInterval:null
            },
            setting:function(result){
                var layerName = result.RS.DATA_NAME;
                $("#layerBimName").val(layerName);
            },
            processBimLayer:function(){

                var data ={dataid:dtcFile.global.DATAID};

                $.ajax({
                    url:'./ide/setProcessBim.do',
                    type:'POST',
                    data:data,
                    dataType:'json',
                    success:function(result){
                        //console.log(result);
                        if(result.STATUS==200){
                            var dataid= result.dataid;
                            var pid = result.PID;
                            var layerName = result.layerName;
                            
                            $("#uploadedLayerName").text(layerName);

                            dtcFile.type.bim.getProgress(dataid,pid);
                        }
                    }
                });


            },
            getProgress:function(dataid,pid){
                
                $("#cloudProgrss").show();
                $("#uploadTypeTxt").text('가공 중...');

                dtcFile.type.bim.global.setInterval=setInterval(function(){
                    $.ajax({
                        url:'./ide/getBimProgress.do',
                        type:'POST',
                        data:{dataid:dataid,pid:pid},
                        dataType:'json',
                        success:function(result){
                            
                            if(result.PINFO.status == 200){

                                var percent = result.PINFO.progress;
                                var stautsTxt = "가공이 완료되었습니다.";
                                $("#uploadFileWizardPrgss").css('width',percent+'%');
                                $("#uploadFileWizardPrgss").text(percent+'%');
                                
                                if(result.PINFO.progress == 100){
                                    $("#uploadTypeTxt").text(stautsTxt);
                                    dtcLayer.BIM.addLayer(result.PINFO.layerInfo);
                                    clearInterval(dtcFile.type.bim.global.setInterval);
									$("#cloudProgrss").hide();
									dtcLayer.clonLayerInfo(result.INFO,'memberLayerLists','F');
                                }
                            }
                        }
                    })
                },3000);

            }
            
        },
        jpg:{
            setting:function(result){
                
                var layerName = result.RS.DATA_NAME;
                var geoCheck = result.JPG_META.exist;
                
                var lon=0.0;
                var lat=0.0;

                if(geoCheck){
                    lon = result.JPG_META.lon;
                    lat = result.JPG_META.lat;
                }

                $("#layerJpgName").val(layerName);
                $("#jpgLayerLat").val(lat);
                $("#jpgLayerLon").val(lon);

            },
            processJpgLayer:function(){
               
                var data ={dataid:dtcFile.global.DATAID};

                $.ajax({
                    url:'/ide/getJpgImgInfo.do',
                    type:'POST',
                    dataType:'json',
                    data:data,
                    success:function(result){
                        //console.log(result);
                        dtcLayer.JPG.addLayer(result);
                        dtcLayer.clonLayerInfo(result.INFO,'memberLayerLists','F');
                    }
                })
            }
        },
        dxf:{
            global:{
                param:{}
            },
            setting:function(result){
               
               var layerName = result.LAYER_NAME;

               var minx = 0.0;
               var miny = 0.0;
               var maxx = 0.0;
               var maxy = 0.0;

               var encoding = 'N/A';
               var lineCnt = 0;
               var mlineCnt = 0;
               var pntCnt = 0;
               var polygonCnt = 0;
               var boundary = '';

               dtcFile.type.dxf.global.param.layerName=layerName;
               dtcFile.type.dxf.global.param.dataId = dtcFile.global.DATAID;
               
               if(result.DXF_META.status=='ok'){
                
                encoding = result.DXF_META.charactorset;
                lineCnt = parseInt(result.DXF_META.lineStringCnt);
                mlineCnt = parseInt(result.DXF_META.multiLineCnt);
                pntCnt = parseInt(result.DXF_META.pointCnt);
                polygonCnt = parseInt(result.DXF_META.polygonCnt);
               
                if(result.DXF_META.boundary.length != 0){
                  
                    minx = result.DXF_META.boundary[0];
                    miny = result.DXF_META.boundary[1];
                    maxx = result.DXF_META.boundary[2];
                    maxy = result.DXF_META.boundary[3];

                    boundary =minx+","+miny+" : "+maxx+","+maxy;

                    dtcFile.type.dxf.global.param.minx = minx;
                    dtcFile.type.dxf.global.param.miny = miny;
                    dtcFile.type.dxf.global.param.maxx = maxx;
                    dtcFile.type.dxf.global.param.maxy = maxy;

                }

               }

               dtcFile.type.dxf.global.param.encoding=encoding;

               var layerInfo = [];

               if(lineCnt != 0){
                
                var layerObj = {
                     name:'entities',
                     count : lineCnt,
                     geometry:'LineString',
                     type:'l'
                 }
                 
                 layerInfo.push(layerObj);
               }

               if(pntCnt != 0){
                
                var layerObj = {
                    name:'entities',
                    count : pntCnt,
                    geometry:'Point',
                    type:'p'
                }

                layerInfo.push(layerObj);
               }

               if(mlineCnt != 0){
                
                var layerObj = {
                    name:'entities',
                    count : mlineCnt,
                    geometry:'MultiLineString',
                    type:'ml'
                }

                layerInfo.push(layerObj);
               }

               if(polygonCnt != 0){
                
                var layerObj = {
                    name:'entities',
                    count : polygonCnt,
                    geometry:'Polygon',
                    type:'pg'
                }

                layerInfo.push(layerObj);
               }

               var htmlType = "";

               for(var i=0;i<layerInfo.length;i++){
                    
                    htmlType += "<tr>\n"
                    htmlType += "    <td nowarp class=\"text-center\"><input class=\"form-check-input dxfTypeCheck\" type=\"checkbox\" value=\""+layerInfo[i].geometry+"\" checked/></td>\n";
                    htmlType += "    <td nowarp>"+layerInfo[i].name+"</td>\n"
                    htmlType += "    <td nowarp>"+layerInfo[i].count+"</td>\n"
                    htmlType += "    <td nowarp>"+layerInfo[i].geometry+"</td>\n"
                    htmlType += "</tr>"
               }

               $("#dxfLayerInfoTbl").empty();
               $("#dxfLayerInfoTbl").append(htmlType);
               
               $("#layerDxfName").val(layerName);
               $("#dxfBoundary").text(boundary);
               $("#dxfEcndoingSelc").val(encoding);

            },
            processDxfLayer:function(){
                
                var data ={
                            dataid:dtcFile.global.DATAID,
                            minx:dtcFile.type.dxf.global.param.minx,
                            miny:dtcFile.type.dxf.global.param.miny,
                            maxx:dtcFile.type.dxf.global.param.maxx,
                            maxy:dtcFile.type.dxf.global.param.maxy
                        };
                
                        
                COMMON.blockUIdiv("MapContainer", "레이어 생성 중입니다...");

                $.ajax({
                    url:'./ide/processDxfLayer.do',
                    type:'POST',
                    data:data,
                    dataType:'json',
                    success:function(result){
                        
                        if(result.STATUS==200){
                            dtcFile.type.shp.setGeoserverlayer(result);
                            COMMON.unblockUIdiv("MapContainer");
                        }
                        
                        /*dtcLayer.DXF.addLayer(result);
                        dtcLayer.clonLayerInfo(result.INFO,'memberLayerLists','DXF');*/
                    }
                })
            }
        }
       
    },
    getLayerInfo:function(dataId){
		
		$("#layerInfoPopup .nav-tabs .nav-item .nav-link")[0].click();
		$("#layerInfoTabs div:nth-child(3),#layerInfoTabs div:nth-child(4)").show();
  
        var data={
            dataId:dataId
        }

        $.ajax({
            url:'/ide/getLayerInfoDesc.do',
            type:'POST',
            data:data,
            dataType:'json',
            success:function(result){
                
                if(result.STATUS == 200){
                    
                    var desc = result.DESC.desc;
                    var epsgCode = result.DESC.epsgCode;
                    var layerName = result.DESC.layerName;
                    
                    $("#layerInfoName").text(layerName);
                    $("#layerInfoEpsg").text(epsgCode);
                    $("#layerInfoDesc").text(desc);
                    //모달 띄우기
                    $("#layerInfoPopup").modal();

                }else{
                    
                    COMMON.alert('등록된 정보가 없습니다.','warning',function(){
                        return false;
                    })

                    return false;
                }
                
            }
        });
		
		$.ajax({
			url:'./ide/callLayerInfo.do',
			type:'POST',
			data:data,
			dataType:'json',
			success:function(result){
				
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

				if(result.INFO.data_type=="S"){
					$("#layerInfoPopup .nav-tabs .nav-item").eq(1).css("display","");
					
					var layerName = result.INFO.shp_layer_fullname;
					var geoserver_url = dtcCom.geo_url();
					
					let slopeoption = {
						url: "//"+geoserver_url+"/wms?",
						layer: layerName,
						minimumlevel: 3,
						maximumlevel: 21,
						tilesize: 256,
						crs: "EPSG:4326",
						parameters: {
							version: "1.1.0"
						}
					};
					
					//dtcLayer.SHP.layer.setBBoxOrder(true);
					
					const notification = document.getElementById('notification-container');
					
					$('#layerExportName').click( function() {
						dtcFile.copy(result.INFO.shp_layer_fullname);
						notification.classList.add('show');
						setTimeout(() => {
						    notification.classList.remove('show');
						}, 500)
					});
					
					$('#layerExportUrl').click( function() {
						dtcFile.copy("https://"+geoserver_url+"/wms");
						notification.classList.add('show');
						setTimeout(() => {
						    notification.classList.remove('show');
						}, 500)
					});
					
					$('#layerExportExtent').click( function() {
						
						var data2={
							PARENT_CODE:result.INFO.shp_data_store_name,
            				TABLE:result.INFO.shp_table_name
        				}
						
						var str;
						$.ajax({
				            url: '/csv/getShpBbox.do',
				            type: 'POST',
				            data: data2,
				            dataType: 'json',
							async : false,
				            success: function(result){
								var bbox = JSON.parse(result.shpUnionList[0].geo_box);
								
								var maxx = bbox.coordinates[0][0][0];
								var maxy = bbox.coordinates[0][0][1];
								
								var minx = bbox.coordinates[0][2][0];
								var miny = bbox.coordinates[0][2][1];
								
				                // console.log(layerInfo);
				                // var bbox = layerInfo.featureType.latLonBoundingBox;
								
								str = maxx+","+maxy+","+minx+","+miny;
								
							}
				        });
						
						dtcFile.copy(str);
								
						notification.classList.add('show');
						setTimeout(() => {
						    notification.classList.remove('show');
						}, 500)
					});
					
					


				} else {
					$("#layerInfoPopup .nav-tabs .nav-item").eq(1).css("display","none");
					if(result.INFO.data_type=="DOCS"){
						$("#layerInfoTabs div:nth-child(3),#layerInfoTabs div:nth-child(4)").hide();
					}
				}
				
			}
		})

    },
	delete:function(dataId){
    	COMMON.confirm("삭제하시겠습니까?","삭제 후 복구할 수 없습니다.","info",function(){
    		var data = { dataId : dataId };
            $.ajax({
                url: './ide/deleteForDataId.do',
                type: 'POST',
                dataType: 'json',
                data: data,
                success:function(result){
                    if(result.RS=="complete"){
                    	$("#memLayer_"+dataId).parents('.card').remove();
                    	LOG_TRACKER.write('34','2','데이터 삭제:{DataId:'+dataId+'}');
						 COMMON.alert('삭제되었습니다.','success',function(){
                            return false;
                        });
                    }
        		}
            })
    	},function(){
    		return false;
    	});
	},
    setLayerView: function(minx, miny, maxx, maxy) {
        Module.getViewCamera().moveLonLatBoundary(
            new Module.JSVector2D(parseFloat(minx), parseFloat(miny)),
            new Module.JSVector2D(parseFloat(maxx), parseFloat(maxy)));
    },
    destory: function() {

        $("#close-sw-btn").off('click');
        $("#next-sw-btn").off('click');
        $("#prev-sw-btn").off('click');

        dtcFile.global.shpFileList=[];
        dtcFile.global.fileList=[];
        
        if(dtcFile.global.dropzoneFile.files.length!=0){
            dtcFile.global.dropzoneFile.removeAllFiles();
        }
        
        dtcFile.global.timeStamp=0;

        dtcFile.global.stepPosition = "";
        
        /*document.getElementById('dtcWizardjs').remove();
        document.getElementById('dtcWizardCss').remove();
        */
        document.getElementById('dtcFileUploadModal').remove();
		dtcFile.global.dropzoneFile.destroy();
		dtcFile.global.dropzoneFile = null;
    },
	copy:function(text){
		// 임시의 textarea 생성
	  	const $textarea = document.createElement("textarea");
	
	 	// body 요소에 존재해야 복사가 진행됨
	  	document.body.appendChild($textarea);
	  
	  	// 복사할 특정 텍스트를 임시의 textarea에 넣어주고 모두 셀렉션 상태
	  	$textarea.value = text;
	  	$textarea.select();
	  
	  	// 복사 후 textarea 지우기
	  	document.execCommand('copy');
	  	document.body.removeChild($textarea);
	}
}
