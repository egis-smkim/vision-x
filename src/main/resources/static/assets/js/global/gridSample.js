//const gridWorker = new Worker('/assets/js/global/gridWorker.js')
const maxWorkers =  navigator.hardwareConcurrency-1;
const chunkSize = 3000;

var workers=[];
var gridLayerList = null;

var gridLayer=null;
var colorGrid = null;
var largeArray = null;

var results = [];
var rsImg = document.createElement('canvas');

var ctx = rsImg.getContext('2d',{ willReadFrequently: true });
var imgData = null;
var combinImgData = [];

function startGrid(){

    fetch('http://localhost:8080/sample/gridAnalysis.do')
    //fetch('http://localhost:8080/sample/gridAnalysis2.do')
        .then(response => response.json())
        .then((json)=>{
            console.log(json);
            var minx = parseFloat(json.meta.min[0]);
            var miny = parseFloat(json.meta.min[1]);
            var maxx = parseFloat(json.meta.max[0]);
            var maxy = parseFloat(json.meta.max[1]);
            
            var width = parseInt(json.meta.width);  //49
            var	height = parseInt(json.meta.height); //39

            setTimeout(function(){
                Module.getViewCamera().moveLonLatBoundary(new Module.JSVector2D(minx, miny), new Module.JSVector2D(maxx,maxy));
            },1500)

            largeArray = json.data;
            
            //가용 가능한 워커 생성
            for(var i=0;i<maxWorkers;i++){
                var worker = new Worker('/assets/js/global/gridWorker.js');
                workers.push(worker);
            }
            rsImg.width=width;
            rsImg.height=height;

            imgData = ctx.createImageData(width,height);
           // console.log(largeArray.length);
            var count = Math.ceil(largeArray.length / chunkSize);
            
            var cropImg = document.createElement('canvas');

            for(var i=0;i<count;i++){
                
                var start=i*chunkSize;
                var end = largeArray.length<(start+chunkSize)?start+(largeArray.length%chunkSize):(start+chunkSize);

                const chunk = largeArray.slice(start,end);
                
                var worker = workers[i%maxWorkers];
                var unict8 = new Uint8ClampedArray((end-start)*height*4);

                var chunKJson = {
                    indx:i,
                    start:start,
                    end:end,
                    width:width,
                    height:height,
                    data:chunk,
                    chunkSize:chunkSize,
                    unict8:unict8
                }
                //console.log(chunKJson);
                worker.postMessage(chunKJson); 
            }

            var getCnt = 0;
            var result8unit = new Uint8ClampedArray(width*height*4);
            
            for(var worker of workers){
                worker.onmessage = event=>{
                    
                    var sx = event.data.start;
                    var wIndx = event.data.wIndx;
                    var lengthCnt = wIndx*event.data.unict.length;
                    var dataLength = imgData.data.length;

                    imgData.data.set(event.data.unict);
                    getCnt++;
                    console.log(sx);
                    ctx.putImageData(imgData,sx,0);

                    if(count == getCnt){
                        console.log('worker has been done')
                        console.log(imgData)
                        
                        createImageFile(ctx,width,height);           
                        createImageOnMap(ctx,width,height,minx,miny,maxx,maxy);
                    }

                    /*imgData.data.set(event.data.unict,lengthCnt);
                    getCnt++;

                    if(count == getCnt){
                        console.log('worker has been done')
                        console.log(imgData)
                        ctx.putImageData(imgData,0,0);
                        //createImageFile(ctx,width,height);           
                        createImageOnMap(ctx,width,height,minx,miny,maxx,maxy);
                    }*/

                   
                }
            }

        });
      
}

var createImageFile =function(ctx,width,height){
    var image = rsImg.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.href = image;

    // Set the anchor element's download attribute to the desired filename
    downloadLink.download = "canvas-image.png";

    // Trigger a click event on the anchor element to initiate the download
    downloadLink.click();
}
var fig =null;
var createImageOnMap = function(ctx,width,height,minx,miny,maxx,maxy){
    //console.log(result8unit);
    //ctx.putImageData(imgData,0,0);
    //console.log(ctx);
    var layerList = new Module.JSLayerList(true);
    var figLayer = layerList.createLayer("figureLayer", 9);
	figLayer.setMaxDistance(300000);

    //console.log(ctx.getImageData(0, 0, width, height).data);

    fig = Module.createFigure("fig");
    fig.setTexture(ctx.getImageData(0, 0, width, height).data,width,height);
    //fig.createPlane(new Module.JSVector3D(maxx, maxy,1000), new Module.JSVector3D(minx, miny, 1000));
    fig.createPlane(new Module.JSVector3D(minx, maxy,10), new Module.JSVector3D(maxx, miny, 10));

    figLayer.addObject(fig, 0);

    Module.XDRenderData();
}

var getGridColor = function(val){
    var color={};

    if(val == -1){
        color.a=0;
        color.r=255;
        color.g=255;
        color.b=255;
    }
    
    if(val > 0.653){
        color.a=255;
        color.r=255;
        color.g=0;
        color.b=0;
    }else if(val >= 0.587 && val <= 0.653){
        color.a=255;
        color.r=115;
        color.g=115;
        color.b=114;
    }else if(val < 0.587){
        color.a=255;
        color.r=72;
        color.g=229;
        color.b=0;
    }

    return color;
}