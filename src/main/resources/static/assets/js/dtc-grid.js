
var colorGrid =null;
var startGrid = function(){
    
    $.ajax({
        url:'/sample/gridAnalysis.do',
        method:'get',
        dataType:'json',
        success:function(obj){

            var layerList = new Module.JSLayerList(true);

            var layer = layerList.createLayer("TEST_GRID_COLOR_LAYER", Module.ELT_POLYHEDRON);
            layer.setMaxDistance(20000.0);
            layer.setMinDistance(1000.0);

            var colorArr = [
                new Module.JSColor(253,167,66,30),
                new Module.JSColor(122,254,91,30),
                new Module.JSColor(128,254,255,30),
                new Module.JSColor(46,102,255,30),
                new Module.JSColor(186,91,245,30),
                new Module.JSColor(255,102,105,30)
            ]
        
            colorGrid = Module.createColorGrid("TEST_GRID");
            colorGrid.SetGridCellDefaultColor(new Module.JSColor(0, 255, 255,255));
            //colorGrid.SetGridLineColor(new Module.JSColor(0, 255, 255,255));

            var minx = parseFloat(obj.meta.min[0]);
            var miny = parseFloat(obj.meta.min[1]);
            var maxx = parseFloat(obj.meta.max[0]);
            var maxy = parseFloat(obj.meta.max[1]);
            
            var rowNum = parseInt(obj.meta.width);  //49
            var	colNum = parseInt(obj.meta.height); //39
        
            var gridCellNum = colorGrid.SetGridPosition(
                new Module.JSVector2D(minx, maxy), 		// 그리드 좌상단
                new Module.JSVector2D(maxx, maxy), 		// 그리드 우상단
                new Module.JSVector2D(maxx, miny), 	// 그리드 우하단
                new Module.JSVector2D(minx, miny), 	// 그리드 좌하단
                200.0, 								// 그리드 바닥면 고도
                rowNum, 								// 그리드 가로 셀 갯수
                colNum									// 그리드 세로 셀 갯수
            );
            
            var gridArr = obj.data;

            for(var i=0; i < rowNum;i++){

                for(var j=0; j < colNum;j++){
                    
                    var gridValue = parseFloat(gridArr[i][j]);
                    var color =new Module.JSColor(0,255,255,255);

                    /*if(gridValue > -0.2 && gridValue < -0.1){
                        color = new Module.JSColor(255,141,255,255);
                        
                    }else if(gridValue >=0 && gridValue < 0.2){
                        color = new Module.JSColor(255,255,112,115)
                        
                    }else if(gridValue >=2 && gridValue < 0.4){
                        color = new Module.JSColor(255,134,255,100)
                        
                    }else if(gridValue >=4 && gridValue < 0.6){
                        color = new Module.JSColor(255,205,100,255)
                        
                    }else if(gridValue >=6 && gridValue < 0.8){
                        color = new Module.JSColor(255,255,184,73)
                        
                    }else if(gridValue>0.8){
                        color = new Module.JSColor(255,51,112,255)
                    }*/

                    if(gridValue > 0.653){
                        //상
                        color = new Module.JSColor(255,255,0,0);
                    }else if(gridValue >= 0.587 && gridValue < 0.653){
                        //중
                        color = new Module.JSColor(255,115,115,114);
                    }else if(gridValue < 0.587){
                        //하
                        color = new Module.JSColor(255,72,229,0);
                    }else{
                        color = new Module.JSColor(255,255,0,0);
                    }
                    
                    colorGrid.SetGridCellColor(i,j,color);
                }
            }
        
            colorGrid.Create();
            layer.addObject(colorGrid, 0);
            layer.setMaxDistance(80000.0);

            setTimeout(function(){
                Module.getViewCamera().moveLonLatBoundary(new Module.JSVector2D(minx, miny), new Module.JSVector2D(maxx,maxy));
            },1500)
        }
    })
}



var startGridNdvi = function(){
    
    $.ajax({
        url:'/sample/gridAnalysis.do',
        method:'get',
        dataType:'json',
        success:function(obj){

            var layerList = new Module.JSLayerList(true);

            var layer = layerList.createLayer("TEST_GRID_COLOR_LAYER", Module.ELT_POLYHEDRON);
            layer.setMaxDistance(20000.0);
            layer.setMinDistance(1000.0);

            var colorArr = [
                new Module.JSColor(253,167,66,30),
                new Module.JSColor(122,254,91,30),
                new Module.JSColor(128,254,255,30),
                new Module.JSColor(46,102,255,30),
                new Module.JSColor(186,91,245,30),
                new Module.JSColor(255,102,105,30)
            ]
        
            colorGrid = Module.createColorGrid("TEST_GRID");
            colorGrid.SetGridCellDefaultColor(new Module.JSColor(0, 255, 255,255));
            //colorGrid.SetGridLineColor(new Module.JSColor(0, 255, 255,255));

            var minx = parseFloat(obj.meta.min[0]);
            var miny = parseFloat(obj.meta.min[1]);
            var maxx = parseFloat(obj.meta.max[0]);
            var maxy = parseFloat(obj.meta.max[1]);
            
            var rowNum = parseInt(obj.meta.width);  //49
            var	colNum = parseInt(obj.meta.height); //39
        
            var gridCellNum = colorGrid.SetGridPosition(
                new Module.JSVector2D(minx, maxy), 		// 그리드 좌상단
                new Module.JSVector2D(maxx, maxy), 		// 그리드 우상단
                new Module.JSVector2D(maxx, miny), 	// 그리드 우하단
                new Module.JSVector2D(minx, miny), 	// 그리드 좌하단
                200.0, 								// 그리드 바닥면 고도
                rowNum, 								// 그리드 가로 셀 갯수
                colNum									// 그리드 세로 셀 갯수
            );
            
            var gridArr = obj.data;

            for(var i=0; i < rowNum;i++){

                for(var j=0; j < colNum;j++){
                    
                    var gridValue = parseInt(gridArr[i][j]);
                    var color =new Module.JSColor(0,255,255,255);

                    if(gridValue==1){
                        color = new Module.JSColor(255,141,255,255);
                        
                    }else if(gridValue==2){
                        color = new Module.JSColor(255,255,112,115)
                        
                    }else if(gridValue==3){
                        color = new Module.JSColor(255,134,255,100)
                        
                    }else if(gridValue==4){
                        color = new Module.JSColor(255,205,100,255)
                        
                    }else if(gridValue==5){
                        color = new Module.JSColor(255,255,184,73)
                        
                    }else if(gridValue==6){
                        color = new Module.JSColor(255,51,112,255)
                    }
                    
                    colorGrid.SetGridCellColor(i,j,color);
                }
            }
        
            colorGrid.Create();
            layer.addObject(colorGrid, 0);
            layer.setMaxDistance(80000.0);

            setTimeout(function(){
                Module.getViewCamera().moveLonLatBoundary(new Module.JSVector2D(minx, miny), new Module.JSVector2D(maxx,maxy));
            },1500)
        }
    })
}