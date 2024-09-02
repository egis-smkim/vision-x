
self.onmessage = function(e){
    //console.log(e.data);
    var start = e.data.start;
    var end = e.data.end;
    var height =e.data.height;
    var chunkSize = e.data.chunkSize;
    var wIndx = e.data.indx;

    var imgArray = e.data.data;
    //console.log(imgArray);
    var width = end - start;
    //var imgData =e.data.imgData;
    var unict8 = e.data.unict8;

    //var 픽셀 인덱스 구하기
    //var index = (y*width*x)*4;
    for(var x=0;x<width;x++){
        var valPosx = width-x-1;
        
        for(var y=0;y<height;y++){
         
            var yPos = height - y -1;    
            var val = imgArray[valPosx][yPos];
            var color = this.getGridColor(val);
            var pIndx = (yPos*width+valPosx)*4;
            
            unict8[pIndx]=color.r
            unict8[pIndx+1]=color.g
            unict8[pIndx+2]=color.b
            unict8[pIndx+3]=color.a
   
        }
    }

    

    /*for(var x=0;x<imgArray.length;x++){

        for(var y=0;y<height;y++){
            var val = imgArray[x][y];
        
            var color = this.getGridColor(val);
            //var pIndx = (h*width+(w))*4;
            var pIndx = (((height-y-1)*(end-start)) + x)*4;
      
            unict8[pIndx]=color.r
            unict8[pIndx+1]=color.g
            unict8[pIndx+2]=color.b
            unict8[pIndx+3]=color.a
       
        }
        
    }*/
    
   // console.log(unict8);
    var result = {
        unict:unict8,
        start:start,
        width:width,
        end:end,
        wIndx:wIndx
    }

    this.postMessage(result);

}

function getGridColor(val){
    //console.log(val);
    var color={};

    if(val == -1){
        color.a=0;
        color.r=0;
        color.g=0;
        color.b=0;
    }
    
    if(val != -1 && val > 0.653){
        color.a=200;
        color.r=255;
        color.g=0;
        color.b=0;
    }
    
    if(val != -1 && (val >= 0.587 && val <= 0.653)){
        color.a=100;
        color.r=115;
        color.g=115;
        color.b=114;
    } 
    
    if(val != -1 && val < 0.587){
        color.a=200;
        color.r=72;
        color.g=229;
        color.b=0;
    }

    return color;
}