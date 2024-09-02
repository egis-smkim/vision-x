/**
 *SUBJECT:공통기능 함수
 *AUTHOR:smd
 *COMMENT:ajax,alert,confirm..etc
 */
var cnt = 0;

var COMMON={
    alert:function(str,type,okFn){

        var custom = 'btn btn-outline-dark';

        if(type=="success"){
            custom ='btn btn-outline-success';
        }

        Swal.fire({
            title :"<h4 class=\"text-secondary\">"+str+"</h4>",
            title :str,
            icon : type,
            allowOutsideClick: false,
            customClass : {
                confirmButton : custom,
                content:'mt-0 mb-0'
            },
            padding:'0.5rem',
            width:'450px',
            allowEscapeKey:false,
            allowEnterKey:false

        }).then(function(result){

            if(result.value){
                okFn();
            }
        });
    },
    alertFilter:function(str,type,okFn){

        var custom = 'btn btn-outline-dark';

        if(type=="success"){
            custom ='btn btn-outline-success';
        }

        Swal.fire({
            title :"<h4 class=\"text-secondary\">"+"유효하지 않은 식이 입력되었습니다."+"</h4>",
            text :str,
            icon : type,
            allowOutsideClick: false,
            customClass : {
                confirmButton : custom,
                content:'mt-0 mb-0',
                title:'alert_container'
            },
            padding:'0.5rem',
            width:'450px',
            allowEscapeKey:false,
            allowEnterKey:false

        }).then(function(result){

            if(result.value){
                okFn();
            }
        });
    },
    confirm:function(str,alertTxt,type,okFn,cancelFn){

        Swal.fire({
            title : "<h4 class=\"text-white\">"+str+"</h4>",
            text  :alertTxt,
            icon : type,
            allowOutsideClick: false,
            showCancelButton: true,
            customClass : {
                confirmButton : 'btn btn-outline-info',
                cancelButton: 'btn btn-outline-default',
                content:'mt-0 mb-3'
            },
            width:'450px',
            padding:'0.5rem'
        }).then(function(result){

            if(result.value){
                okFn();
            }else{
                cancelFn();
            }
        });

    },
    blockUIdiv:function(id,txt){

        $("#"+id).block({
            message: "<div class=\"sk-wave sk-primary mx-auto\"><div class=\"sk-wave-rect\"></div><div class=\"sk-wave-rect\"></div><div class=\"sk-wave-rect\"></div><div class=\"sk-wave-rect\"></div><div class=\"sk-wave-rect\"></div></div><span class=\"text-white ts-11 mt-2 pt-2\" id=\"prgTextInfo\">"+txt+"</span>",
            css: {
                backgroundColor: 'transparent',
                border: '0'
            },
            overlayCSS:  {
                backgroundColor: "#22252B",
                opacity: 0.8
            }
        });
    },
    unblockUIdiv:function(id){
        $("#"+id).unblock();
    },
    isEmpty:function(value){
        if( value == "" || value == null || value == undefined || ( value != null && typeof value == "object" && !Object.keys(value).length ) ){
            return true;
        }else{
            return false;
        }
    },
    alertMove:function(){
        let h = document.getElementsByClassName('sidenav-link');

        for(let i=0; i<h.length; i++){
            let j = h[i];
            j.href='#';
        }
        $("#dontmove").modal("show");
    }
};

// sidebar START -------------------------------------------------------------------------------------------------------
function openSidebar() {
    var element_map = document.getElementById("map");
    var element_sidebar_on = document.getElementById("sidebar-on");
    var element_sidebar_off = document.getElementById("sidebar-off");

    element_map.style.width = "80%";
    element_sidebar_on.style.display = "none";
    element_sidebar_off.style.display = "block";
}

function closeSidebar() {
    var element_map = document.getElementById("map");
    var element_sidebar_on = document.getElementById("sidebar-on");
    var element_sidebar_off = document.getElementById("sidebar-off");

    element_map.style.width = "100%";
    element_sidebar_on.style.display = "block";
    element_sidebar_off.style.display = "none";
}
// sidebar END ---------------------------------------------------------------------------------------------------------

// 정밀도로 레이어 START --------------------------------------------------------------------------------------------------
function createLayerWMS() {

    var element_layer_on = document.getElementById("layer-on");
    var element_layer_off = document.getElementById("layer-off");

    element_layer_on.style.display = "none";
    element_layer_off.style.display = "block";

    Module.getViewCamera().setTilt(90);
    Module.getViewCamera().setLocation(new Module.JSVector3D(9.9842019, 53.5492864, 1000));

    fetch('https://geodienste.hamburg.de/HH_WFS_automatisiertes_Fahren?SERVICE=WFS&VERSION=2.0.0&REQUEST=GetFeature&TYPENAMES=de.hh.up%3Acrossing_internal_lanes&outputFormat=application%2Fgeo%2Bjson&srsName=EPSG:4258')
        .then(response => response.json())
        .then(data => {
            createPathPipes(data.features, "green", "crossing");
        })
    fetch('https://geodienste.hamburg.de/HH_WFS_automatisiertes_Fahren?SERVICE=WFS&VERSION=2.0.0&REQUEST=GetFeature&TYPENAMES=de.hh.up%3Acenter_line&outputFormat=application%2Fgeo%2Bjson&srsName=EPSG:4258')
        .then(response => response.json())
        .then(data => {
            createPathPipes(data.features, "red", "center");
        })
    fetch('https://geodienste.hamburg.de/HH_WFS_automatisiertes_Fahren?SERVICE=WFS&VERSION=2.0.0&REQUEST=GetFeature&TYPENAMES=de.hh.up:separator_lines&outputFormat=application%2Fgeo%2Bjson&srsName=EPSG:4258')
        .then(response => response.json())
        .then(data => {
            createPathPipes(data.features, "yellow", "separator");
        })

    /* Create animation pipes for displaying paths */
    function createPathPipes(_pathFeatures, _color, _type) {
        // Create layer
        var pipeLayer = Module.getObjectLayerList().createObjectLayer({
            name: "ROAD_PATH_PIPE_LAYER_" + _type,
            type: Module.ELT_PIPE,
            selectable: true,
        });

        // Display flow animation from path data
        for (var i = 0; i < _pathFeatures.length; i++) {
            var positions = _pathFeatures[i].geometry.coordinates;
            if (positions.length < 2) {
                continue;
            }

            // Parse coordinate list from path data
            let pipePathInput = new Module.Collection();
            for (var j = 0; j < positions.length; j++) {
                var altitude = Module.getMap().getTerrHeightFast(positions[j][0], positions[j][1]);
                pipePathInput.add(
                    new Module.JSVector3D(positions[j][0], positions[j][1], altitude+1.3)
                );
            }

            // Create path pipe
            var pathPipe = createPipe("path_" + _type + "_" + i, pipePathInput, _color);
            if (pathPipe != null) {
                pipeLayer.addObject(pathPipe, 0);
            }
        }
    }
}

/* Create object for pipe */
function createPipe(_objectKey, _path, _color) {
    var pipe = Module.createPipe(_objectKey);
    var _arrow_color = "";

    pipe.create(
        _path,
        new Module.JSColor(0, 0, 0, 0), // Transparent outer cylindrical pipe
        new Module.JSColor(0, 0, 0, 0), // Transparent outer cylindrical pipe
        10, // Set minimum for outer cylindrical segment since only inner pipe flow is displayed
        0.8,
        2
    );

    if (_color == "black") {
        pipe.setFlow(
            new Module.JSColor(255, 40, 40, 40), // End color for arrow display
            new Module.JSColor(255, 0, 0, 0), // Start color for arrow display
            10.0, // Number of divisions for arrow color
            0.8 // Arrow interval
        );
    } else if (_color == "red") {
        pipe.setFlow(
            new Module.JSColor(255, 40, 40, 40), // End color for arrow display
            new Module.JSColor(255, 236, 28, 35), // Start color for arrow display
            10.0, // Number of divisions for arrow color
            0.8 // Arrow interval
        );
    } else if (_color == "yellow") {
        pipe.setFlow(
            new Module.JSColor(255, 40, 40, 40), // End color for arrow display
            new Module.JSColor(255, 255, 200, 13), // Start color for arrow display
            10.0, // Number of divisions for arrow color
            0.8 // Arrow interval
        );
    } else if (_color == "green") {
        pipe.setFlow(
            new Module.JSColor(255, 40, 40, 40), // End color for arrow display
            new Module.JSColor(255, 34, 177, 75), // Start color for arrow display
            10.0, // Number of divisions for arrow color
            0.8 // Arrow intervall
        );
    } else if (_color == "orange") {
        pipe.setFlow(
            new Module.JSColor(255, 40, 40, 40), // End color for arrow display
            new Module.JSColor(255, 255, 126, 38), // Start color for arrow display
            10.0, // Number of divisions for arrow color
            0.8 // Arrow interval
        );
    } else if (_color == "grey") {
        pipe.setFlow(
            new Module.JSColor(255, 40, 40, 40), // End color for arrow display
            new Module.JSColor(255, 125, 125, 125), // Start color for arrow display
            10.0, // Number of divisions for arrow color
            0.8 // Arrow interval
        );
    }

    pipe.setFlowWaitFrame(5);
    pipe.setFlowDisplay(true);
    pipe.setSimplifyRange(1200);

    return pipe;
}

function removeLayerWMS() {

    var element_layer_on = document.getElementById("layer-on");
    var element_layer_off = document.getElementById("layer-off");

    element_layer_on.style.display = "block";
    element_layer_off.style.display = "none";

    Module.getViewCamera().setTilt(90);
    Module.getViewCamera().setLocation(new Module.JSVector3D(9.9842019, 53.5492864, 1000));

    let layerList = new Module.JSLayerList();

    wmslayer_crossing = layerList.nameAtLayer("ROAD_PATH_PIPE_LAYER_crossing");
    if (wmslayer_crossing != null) wmslayer_crossing.clearWMSCache();
    layerList.delLayerAtName("ROAD_PATH_PIPE_LAYER_crossing");

    wmslayer_center = layerList.nameAtLayer("ROAD_PATH_PIPE_LAYER_center");
    if (wmslayer_center != null) wmslayer_center.clearWMSCache();
    layerList.delLayerAtName("ROAD_PATH_PIPE_LAYER_center");

    wmslayer_separator = layerList.nameAtLayer("ROAD_PATH_PIPE_LAYER_separator");
    if (wmslayer_separator != null) wmslayer_separator.clearWMSCache();
    layerList.delLayerAtName("ROAD_PATH_PIPE_LAYER_separator");
}
// 정밀도로 레이어 END ----------------------------------------------------------------------------------------------------

// bike 현황 레이어 START ------------------------------------------------------------------------------------------------
function createBikeLayer() {

    var element_bike_on = document.getElementById("bike-on");
    var element_bike_off = document.getElementById("bike-off");

    element_bike_on.style.display = "none";
    element_bike_off.style.display = "block";

    Module.getViewCamera().setTilt(90);
    Module.getViewCamera().setLocation(new Module.JSVector3D(9.9842019, 53.5492864, 2500));

    fetch('https://geodienste.hamburg.de/HH_WFS_Stadtrad?SERVICE=WFS&REQUEST=GetFeature&TYPENAMES=de.hh.up%3Astadtrad_stationen&version=2.0.0&srsName=EPSG:4258&outputFormat=application%2Fgeo%2Bjson')
        .then(response => response.json())
        .then(data => {
            var _pathFeatures = data.features;
            let layerList = new Module.JSLayerList(true);
            let layer = layerList.createLayer("BIKE_LAYER", Module.ELT_BILLBOARD);
            let background_color = "";

            for (var i = 0; i < _pathFeatures.length; i++) {
                var bike_count = _pathFeatures[i].properties.anzahl_raeder;
                var altitude = Module.getMap().getTerrHeightFast(_pathFeatures[i].geometry.coordinates[0], _pathFeatures[i].geometry.coordinates[1]);
                var billboardPosition = new Module.JSVector3D(_pathFeatures[i].geometry.coordinates[0], _pathFeatures[i].geometry.coordinates[1],altitude+35);

                if (bike_count == 0) background_color = "rgba(250,232,232,0.8)";
                else if (bike_count < 5) background_color = "rgba(246,183,183,0.8)";
                else if (bike_count < 10) background_color = "rgba(244,144,144,0.8)";
                else if (bike_count < 15) background_color = "rgba(251,102,102,0.8)";
                else background_color = "rgba(251,71,71,0.8)";

                var billboard = createBillboard(billboardPosition, {
                    text : bike_count + "\nBIKE",
                    font : "Consolas",
                    fontSize : 9,
                    fontColor: "rgba(0, 0, 0, 1.0)",
                    backgroundColor: background_color,
                    outlineColor: "rgba(0, 0, 0, 0.1)",
                    outlineWidth : 0.1,
                });
                layer.addObject(billboard, 0);
            }
        })
}

function removeBikeLayer(){

    var element_bike_on = document.getElementById("bike-on");
    var element_bike_off = document.getElementById("bike-off");

    element_bike_on.style.display = "block";
    element_bike_off.style.display = "none";

    let layerList = new Module.JSLayerList();
    Module.getViewCamera().setTilt(90);
    Module.getViewCamera().setLocation(new Module.JSVector3D(9.9842019, 53.5492864, 2500));

    wmslayer_crossing = layerList.nameAtLayer("BIKE_LAYER");
    if (wmslayer_crossing != null) wmslayer_crossing.clearWMSCache();
    layerList.delLayerAtName("BIKE_LAYER");
}
// bike 현황 레이어 END --------------------------------------------------------------------------------------------------

// TESTFELD layer START ------------------------------------------------------------------------------------------------
function createtest1Layer() {

    var element_bike_on = document.getElementById("test1-on");
    var element_bike_off = document.getElementById("test1-off");

    element_bike_on.style.display = "none";
    element_bike_off.style.display = "block";

    $.getJSON("/data/test.json", function (_res) {

        var _pathFeatures = _res.data;
        var _imageDatas = _res.image;
        let layerList = new Module.JSLayerList(true);
        let layer = layerList.createLayer("test1_LAYER", Module.ELT_POLYHEDRON);

        Module.getViewCamera().setTilt(90);
        Module.getViewCamera().setLocation(new Module.JSVector3D(10.694645749943437, 52.26606125550976, 1000));

        Proj4js.defs["EPSG:32632"] = "+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs"; // UTM Zone 32N 정의
        Proj4js.defs["EPSG:4326"] = "+proj=longlat +datum=WGS84 +no_defs"; // WGS84 정의
        var sourceProj = new Proj4js.Proj('EPSG:32632'); // UTM Zone 32N
        var destProj = new Proj4js.Proj('EPSG:4326');  // WGS84

        // 카메라
        for (var i = 0; i < _imageDatas.length; i++) {
            var _image_data = _imageDatas[i];
            var point = {x: _image_data.pos_x, y: _image_data.pos_y};
            Proj4js.transform(sourceProj, destProj, point);

            var _centerLat = point.y; // 중심 위도
            var _centerLon = point.x; // 중심 경도
            var altitude = Module.getMap().getTerrHeightFast(_centerLon, _centerLat);

            let element = document.createElement("div");
            let parameter = {
                position: new Module.JSVector3D(_centerLon, _centerLat, 100.0),	// Position
                container: "divcontainer",
                canvas: Module.canvas,
                element: element
            };

            let object = Module.createHTMLObject("div_object");
            let complet = object.createbyJson(parameter);
            if (complet.result == 1) {
                layer.addObject(object, 0);
                element.style.color = "rgba(255,255,255,1)";
                element.textContent = "CAMERA ON";
                element.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
                element.style.padding = "7px"
                element.addEventListener('click', function(event) {
                    clickdivcontrol(event, _image_data);
                });
            }
        }

        // 이동하는 차
        async function processData() {
            for (var loop=0; loop>=0; loop++) {
                for (var cnt = 0.0; cnt <= 1.0; cnt += 0.1) {
                    var _check_ts = '00:0' + String(cnt.toFixed(1));

                    for (var i = 0; i < _pathFeatures.length; i++) {
                        var _data = _pathFeatures[i];

                        if (_data.ts_data == _check_ts) {
                            var _object_id = _data.object_id;
                            var point = {x: _data.pos_x, y: _data.pos_y};
                            Proj4js.transform(sourceProj, destProj, point);

                            var _centerLat = point.y; // 중심 위도
                            var _centerLon = point.x; // 중심 경도
                            var _angle = _data.orientation; // 기울기 (도)
                            var {_length, _width, _type} = getHeightWidth(_data);

                            var x = Math.sin(_object_id) * 10000;
                            var r = Math.floor((x - Math.floor(x)) * 128) + 64; // 채도를 낮춘 값
                            x = Math.sin(_object_id + 1) * 10000;
                            var g = Math.floor((x - Math.floor(x)) * 128) + 64; // 채도를 낮춘 값
                            x = Math.sin(_object_id + 2) * 10000;
                            var b = Math.floor((x - Math.floor(x)) * 128) + 64; // 채도를 낮춘 값

                            if (layer.keyAtObject("POLYGON_" + _object_id) != null) {
                                var altitude = Module.getMap().getTerrHeightFast(_centerLon, _centerLat);

                                layer.keyAtObject("POLYGON_" + _object_id).position = new Module.JSVector3D(_centerLon, _centerLat, altitude + 1);
                                layer.removeAtKey("test1_POI_" + _object_id);

                                createPOI(_object_id, new Module.JSVector3D(_centerLon, _centerLat, altitude), "rgba("+r+","+g+","+b+",0.7)", _type + "\n" + _check_ts, true);
                            }
                            else {
                                var corners = getRectangleCoordinates(_centerLat, _centerLon, _length, _width, _angle);
                                var polygon = createPolygon(_object_id, [corners], (_data.height));
                                var altitude = Module.getMap().getTerrHeightFast(_centerLon, _centerLat);
                                createPOI(_object_id, new Module.JSVector3D(_centerLon, _centerLat, altitude), "rgba("+r+","+g+","+b+",0.7)", _type + "\n" + _check_ts, true);

                                layer.addObject(polygon, 0);
                            }
                        }
                    }
                    await sleep(150); //0.5초
                }
            }
        }
        processData();
    });

    function clickdivcontrol(_element, _imageData) {

        console.log(_element, _imageData);

        if (_element.currentTarget.innerHTML == "CAMERA ON") {
            let ele = document.getElementById(_element.srcElement.id);
            let element = document.createElement("img");
            element.className = "image";
            element.src = "data:image/png;base64,"+_imageData.jpeg_image;
            element.width = 300;
            ele.innerHTML = "";
            ele.appendChild(element);
        } else {
            let str_src = _element.currentTarget.lastChild.src;
            let ele = document.getElementById(_element.currentTarget.id);
            let element;
            _element.currentTarget.removeChild(_element.currentTarget.lastChild);
            ele.innerHTML = "CAMERA ON";
            ele.appendChild(element);
        }
    }

    function createImage(_path) {
        let element;
        element = document.createElement("img");
        element.className = "image";
        element.src = _path;
        return element;
    }

    function createPOI(_object_id, _position, _color, _value, _balloonType) {
        var drawCanvas = document.createElement('canvas');

        var _value_cnt = 0;
        for (let char of _value) {
            _value_cnt++;
        }

        drawCanvas.width = _value_cnt * 4.2;
        drawCanvas.height = 80;

        let imageData = drawIcon(drawCanvas, _color, _value, _balloonType);

        let Symbol = Module.getSymbol();

        let layerList = new Module.JSLayerList(true);
        let layer = layerList.nameAtLayer("test1_LAYER");

        poi = Module.createPoint("test1_POI_" + _object_id);
        poi.setPosition(_position);												// Set position
        poi.setImage(imageData, drawCanvas.width, drawCanvas.height);			// Set icon
        layer.addObject(poi, 0); // Register POI layer
    }

    function drawIcon(_canvas, _color, _value, _balloonType) {
        var ctx = _canvas.getContext('2d'),
            width = _canvas.width,
            height = _canvas.height;
        ctx.clearRect(0, 0, width, height);

        var cnt = 0.15;
        let strlist = _value.split("\n");

        if (_balloonType) {
            drawBalloon(ctx, height * 0.5, width, height, 5, height * 0.15, _color);
            for (let item of strlist) {
                setText(ctx, width * 0.5, height * cnt, item);
                cnt += 0.15;
            }
        } else {
            drawRoundRect(ctx, 0, height * 0.3, width, height * 0.25, 5, _color);
            for (let item of strlist) {
                setText(ctx, width * 0.5, height * 0.2, item);
            }
        }

        return ctx.getImageData(0, 0, _canvas.width, _canvas.height).data;
    }

    function setText(_ctx, _posX, _posY, _value) {
        var strText = "";

        if (typeof _value == 'number') {
            strText = setKilloUnit(_value, 0.001, 0);
        } else {
            strText = _value;
        }

        _ctx.font = "bold 12px sans-serif";
        _ctx.textAlign = "center";
        _ctx.fillStyle = "rgb(0, 0, 0)";

        _ctx.fillText(strText, _posX, _posY);
    }

    function setKilloUnit(_text, _meterToKilloRate, _decimalSize) {
        if (_decimalSize < 0) {
            _decimalSize = 0;
        }
        if (typeof _text == "number") {
            if (_text < 1.0 / (_meterToKilloRate * Math.pow(10, _decimalSize))) {
                _text = _text.toFixed(1).toString() + 'm';
            } else {
                _text = (_text * _meterToKilloRate).toFixed(2).toString() + '㎞';
            }
        }
        return _text;
    }

    function drawRoundRect(ctx, x, y, width, height, radius, color) {
        if (width < 2 * radius) radius = width * 0.5;
        if (height < 2 * radius) radius = height * 0.5;

        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.arcTo(x + width, y, x + width, y + height, radius);
        ctx.arcTo(x + width, y + height, x, y + height, radius);
        ctx.arcTo(x, y + height, x, y, radius);
        ctx.arcTo(x, y, x + width, y, radius);
        ctx.closePath();

        ctx.fillStyle = color;
        ctx.fill();

        return ctx;
    }

    function drawBalloon(ctx, marginBottom, width, height, barWidth, barHeight, color) {
        var wCenter = width * 0.5,
            hCenter = height * 0.5;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, height - barHeight - marginBottom);
        ctx.lineTo(wCenter - barWidth, height - barHeight - marginBottom);
        ctx.lineTo(wCenter, height - marginBottom);
        ctx.lineTo(wCenter + barWidth, height - barHeight - marginBottom);
        ctx.lineTo(width, height - barHeight - marginBottom);
        ctx.lineTo(width, 0);
        ctx.closePath();

        ctx.fillStyle = color;
        ctx.fill();
    }

    function getHeightWidth(_data) {
        if (_data.best_class == 0) return {_length: _data.max_lat_ext - _data.min_lat_ext, _width: _data.max_long_ext - _data.min_long_ext, _type: "unknown"};
        else if (_data.best_class == 1) return {_length: _data.max_lat_ext - _data.min_lat_ext, _width: _data.max_long_ext - _data.min_long_ext, _type: "stationary background"};
        else if (_data.best_class == 2) return {_length: 0.5, _width: 0.5, _type: "pedestrian"};
        else if (_data.best_class == 3) return {_length: 1.8, _width: 0.6, _type: "bicycle"};
        else if (_data.best_class == 4) return {_length: 3.5, _width: 1.6, _type: "narrow vehicle"};
        else if (_data.best_class == 5) return {_length: 4.5, _width: 1.8, _type: "passenger car"};
        else if (_data.best_class == 6) return {_length: 5.5, _width: 2.0, _type: "van"};
        else if (_data.best_class == 7) return {_length: 8.0, _width: 2.5, _type: "truck"};
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function createPolygon(_object_id, _vertex, _height) {
        var polygon = Module.createPolygon("POLYGON_"+_object_id);

        var x = Math.sin(_object_id) * 10000;
        var r = Math.floor((x - Math.floor(x)) * 128) + 64; // 채도를 낮춘 값
        x = Math.sin(_object_id + 1) * 10000;
        var g = Math.floor((x - Math.floor(x)) * 128) + 64; // 채도를 낮춘 값
        x = Math.sin(_object_id + 2) * 10000;
        var b = Math.floor((x - Math.floor(x)) * 128) + 64; // 채도를 낮춘 값

        var vertex = new Module.JSVec3Array();
        var part = new Module.Collection();

        for (var i = 0; i < _vertex.length; i++) {
            for (var j = 0; j < _vertex[i].length; j++) {
                vertex.push(_vertex[i][j]);
            }
            part.add(_vertex[i].length);
        }
        polygon.setPartCoordinates(vertex, part);
        polygon.setHeight(_height);
        var polygonStyle = new Module.JSPolygonStyle();
        polygonStyle.setFill(true);
        polygonStyle.setFillColor(new Module.JSColor(r, g, b));
        polygon.setStyle(polygonStyle);

        return polygon;
    }

    function toRadians(degree) {
        return degree * Math.PI / 180;
    }

    function toDegrees(radian) {
        return radian * 180 / Math.PI;
    }

    function getOffset(lat, lon, distance, bearing) {
        const R = 6378137; // 지구 반지름 (단위: 미터)
        const d = distance / R; // 중심으로부터의 거리 (단위: 라디안)
        const bearingRad = toRadians(bearing); // 기울기 각도 (단위: 라디안)

        const lat1 = toRadians(lat);
        const lon1 = toRadians(lon);

        const lat2 = Math.asin(Math.sin(lat1) * Math.cos(d) + Math.cos(lat1) * Math.sin(d) * Math.cos(bearingRad));
        const lon2 = lon1 + Math.atan2(Math.sin(bearingRad) * Math.sin(d) * Math.cos(lat1), Math.cos(d) - Math.sin(lat1) * Math.sin(lat2));

        return {
            latitude: toDegrees(lat2),
            longitude: toDegrees(lon2)
        };
    }

    function getRectangleCoordinates(centerLat, centerLon, width, height, angle) {
        const halfWidth = width / 2;
        const halfHeight = height / 2;

        const angles = [
            angle - Math.atan2(halfHeight, halfWidth) * 180 / Math.PI, // 왼쪽 위
            angle + Math.atan2(halfHeight, halfWidth) * 180 / Math.PI, // 오른쪽 위
            angle + 180 - Math.atan2(halfHeight, halfWidth) * 180 / Math.PI, // 오른쪽 아래
            angle + 180 + Math.atan2(halfHeight, halfWidth) * 180 / Math.PI // 왼쪽 아래
        ];

        const distances = [
            Math.sqrt(halfWidth * halfWidth + halfHeight * halfHeight), // 왼쪽 위
            Math.sqrt(halfWidth * halfWidth + halfHeight * halfHeight), // 오른쪽 위
            Math.sqrt(halfWidth * halfWidth + halfHeight * halfHeight), // 오른쪽 아래
            Math.sqrt(halfWidth * halfWidth + halfHeight * halfHeight)  // 왼쪽 아래
        ];

        const corners = angles.map((angle, index) => {
            const { latitude, longitude } = getOffset(centerLat, centerLon, distances[index], angle);
            var altitude = Module.getMap().getTerrHeightFast(longitude, latitude);
            return new Module.JSVector3D(longitude, latitude, altitude);
        });

        return corners;
    }
}

function removetest1Layer(){

    var element_test1_on = document.getElementById("test1-on");
    var element_test1_off = document.getElementById("test1-off");

    element_test1_on.style.display = "block";
    element_test1_off.style.display = "none";

    let layerList = new Module.JSLayerList();
    Module.getViewCamera().setTilt(90);
    Module.getViewCamera().setLocation(new Module.JSVector3D(10.694645749943437, 52.26606125550976, 1000));

    wmslayer_crossing = layerList.nameAtLayer("test1_LAYER");
    if (wmslayer_crossing != null) wmslayer_crossing.clearWMSCache();
    layerList.delLayerAtName("test1_LAYER");
}
// TESTFELD layer END --------------------------------------------------------------------------------------------------

// TESTFELD 빌보드 트래킹 START ------------------------------------------------------------------------------------------
function createtest2Layer() {

    var element_test2_on = document.getElementById("test2-on");
    var element_test2_off = document.getElementById("test2-off");

    element_test2_on.style.display = "none";
    element_test2_off.style.display = "block";

    Module.getViewCamera().setTilt(90);
    Module.getViewCamera().setLocation(new Module.JSVector3D(10.694645749943437, 52.26606125550976, 1000));

    $.getJSON("/data/test.json", function (_data) {

        var _pathFeatures = _data.data;
        let layerList = new Module.JSLayerList(true);
        let layer = layerList.createLayer("test2_LAYER", Module.ELT_BILLBOARD);
        let background_color = "";

        console.log(_pathFeatures);

        for (var i = 0; i < _pathFeatures.length; i++) {

            Proj4js.defs["EPSG:32632"] = "+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs"; // UTM Zone 32N 정의
            Proj4js.defs["EPSG:4326"] = "+proj=longlat +datum=WGS84 +no_defs"; // WGS84 정의

            var sourceProj = new Proj4js.Proj('EPSG:32632'); // UTM Zone 32N
            var destProj = new Proj4js.Proj('EPSG:4326');  // WGS84
            var point = { x: _pathFeatures[i].pos_x, y: _pathFeatures[i].pos_y };

            Proj4js.transform(sourceProj, destProj, point);

            var altitude = Module.getMap().getTerrHeightFast(point.x, point.y);
            var billboardPosition = new Module.JSVector3D(point.x, point.y,altitude+2);

            var hash = 0;
            var object_id = _pathFeatures[i].object_id
            var x = Math.sin(object_id) * 10000;
            var r = Math.floor((x - Math.floor(x)) * 128) + 64; // 채도를 낮춘 값
            x = Math.sin(object_id + 1) * 10000;
            var g = Math.floor((x - Math.floor(x)) * 128) + 64; // 채도를 낮춘 값
            x = Math.sin(object_id + 2) * 10000;
            var b = Math.floor((x - Math.floor(x)) * 128) + 64; // 채도를 낮춘 값

            var color = `rgba(${r}, ${g}, ${b}, 0.7)`;

            var billboard = createBillboard(billboardPosition, {
                text : _pathFeatures[i].ts_data + "\n" + object_id,
                font : "Arial",
                fontSize : 8,
                fontColor: "rgba(0, 0, 0, 1.0)",
                backgroundColor: color,
                outlineColor: "rgba(0, 0, 0, 0.1)",
                outlineWidth : 0.1,
            });
            layer.addObject(billboard, 0);

        }
    });

}

function createBillboard(_position, _textOptions) {
    var billboard = Module.createBillboard("TEXT_BILLBOARD");
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    let boardImage = createBoardImage(ctx, _textOptions);

    billboard.setImage(_position, boardImage.data, boardImage.width, boardImage.height);
    billboard.setRotationMode(true);
    billboard.setSizeFix(true);

    return billboard;
}

function createBoardImage(_ctx, _textOptions) {
    let fontname, fontsize, linewidth;
    let strlist = _textOptions.text.split("\n");
    let width = 0;
    let linecount = 0;

    fontname = _textOptions.font;
    fontsize = _textOptions.fontSize;
    linewidth = _textOptions.outlineWidth;

    _ctx.font = fontsize + "px " + fontname;	// Size and font

    for (let item of strlist) {
        let w = _ctx.measureText(item).width
        if (w > width) width = w;
        linecount++;
    }

    _ctx.fillStyle = _textOptions.backgroundColor;		// Background color

    var rectWidth = width + _textOptions.fontSize;
    var rectHeight = _textOptions.fontSize * (linecount + 1);

    _ctx.fillRect(0, 0, width + _textOptions.fontSize, _textOptions.fontSize * (linecount + 1));
    _ctx.strokeRect(0, 0, width + _textOptions.fontSize, _textOptions.fontSize * (linecount + 1));

    _ctx.fillStyle = _textOptions.fontColor;
    _ctx.strokeStyle = _textOptions.outlineColor;
    _ctx.lineWidth = _textOptions.linewidth;
    _ctx.textBaseline = "middle";
    _ctx.textAlign = "center";

    linecount = 1;

    for (let item of strlist) {
        _ctx.strokeText(item, (width + _textOptions.fontSize) * 0.5, _textOptions.fontSize * linecount);
        _ctx.fillText(item, (width + _textOptions.fontSize) * 0.5, _textOptions.fontSize * linecount);
        linecount++;
    }

    return {
        width : rectWidth,
        height : rectHeight,
        data : _ctx.getImageData(0, 0, rectWidth, rectHeight).data,
    };
}

function removetest2Layer(){

    var element_test2_on = document.getElementById("test2-on");
    var element_test2_off = document.getElementById("test2-off");

    element_test2_on.style.display = "block";
    element_test2_off.style.display = "none";

    let layerList = new Module.JSLayerList();
    Module.getViewCamera().setTilt(90);
    Module.getViewCamera().setLocation(new Module.JSVector3D(10.694645749943437, 52.26606125550976, 1000));

    wmslayer_crossing = layerList.nameAtLayer("test2_LAYER");
    if (wmslayer_crossing != null) wmslayer_crossing.clearWMSCache();
    layerList.delLayerAtName("test2_LAYER");
}
// TESTFELD 빌보드 트래킹 END --------------------------------------------------------------------------------------------

// Signal START --------------------------------------------------------------------------------------------------------
function setSignalLocation(){
    Module.getViewCamera().setTilt(90);
    Module.getViewCamera().setLocation(new Module.JSVector3D(9.9842019, 53.5492864, 1000));
}

function createSignalLayer(nextLink = null) {
    var element_signal_on = document.getElementById("signal-on");
    var element_signal_off = document.getElementById("signal-off");

    element_signal_on.style.display = "none";
    element_signal_off.style.display = "block";

    const url = nextLink || 'https://tld.iot.hamburg.de/v1.0/Things?$expand=Locations,Datastreams($expand=Observations($top=3;$orderby=resultTime desc))&$top=500';

    $.ajax({
        url: url,
        method: 'GET',
        success: function(data) {
            if (data && data.value && data.value.length > 0) {
                const geoJson = convertToGeoJson(data.value);
                createSignalPipes(geoJson.features, "test"+cnt);
                // 다음 링크가 있으면 추가 데이터 가져오기
                if (data['@iot.nextLink'] && element_signal_on.style.display == "none") {
                    cnt = cnt + 1;
                    createSignalLayer(data['@iot.nextLink']);
                }
                else {
                    console.log("SignalLayer Done");
                    // subscribeToRealTimeUpdates();
                }
            } else {
                console.log('최신 데이터를 찾을 수 없습니다.');
            }
        },
        error: function(err) {
            console.error('데이터 요청 중 오류가 발생했습니다.', err);
        }
    });
}

function removeSignalLayer() {
    var element_signal_on = document.getElementById("signal-on");
    var element_signal_off = document.getElementById("signal-off");

    element_signal_on.style.display = "block";
    element_signal_off.style.display = "none";

    let layerList = new Module.JSLayerList();
    let layerCount = layerList.count();
    Module.getViewCamera().setTilt(90);
    Module.getViewCamera().setLocation(new Module.JSVector3D(9.9842019, 53.5492864, 1000));

    for (let i = layerCount - 1; i >= 0; i--) {
        let layer = layerList.indexAtLayer(i);
        let layerName = layerList.indexAtLayer(i).getName();

        if (layerName.startsWith("SIGNAL_PATH_PIPE_LAYER_")) {
            layer.clearWMSCache();
            layerList.delLayerAtName(layerName);
        }
    }
}

// 데이터를 GeoJSON 형식으로 변환
function convertToGeoJson(data) {
    const geoJson = {
        type: "FeatureCollection",
        features: data.flatMap(thing => {
            return thing.Locations.map(location => {
                if (!location.location || !location.location.geometry || !location.location.geometry.coordinates) {
                    return null;
                }
                return {
                    type: "Feature",
                    geometry: location.location.geometry,
                    properties: {
                        id: thing["@iot.id"],
                        name: thing.name,
                        description: thing.description,
                        properties: thing.properties,
                        datastreams: thing.Datastreams.map(ds => ({
                            id: ds["@iot.id"],
                            name: ds.name,
                            description: ds.description,
                            observationType: ds.observationType,
                            unitOfMeasurement: ds.unitOfMeasurement,
                            observedArea: ds.observedArea,
                            phenomenonTime: ds.phenomenonTime,
                            resultTime: ds.resultTime,
                            properties: ds.properties,
                            observations: ds.Observations.map(obs => ({
                                id: obs["@iot.id"],
                                phenomenonTime: obs.phenomenonTime,
                                resultTime: obs.resultTime,
                                result: obs.result,
                                validTime: obs.validTime
                            }))
                        }))
                    }
                };
            }).filter(feature => feature !== null);
        })
    };
    return geoJson;
}

// 신호 상태에 따른 색상 결정
function getColor(datastreams) {
    if (datastreams.length > 0 && datastreams[0].observations.length > 0) {
        const signalStatus = datastreams[0].observations[0].result;
        switch (signalStatus) {
            case 0:
                return "black"; // dark
            case 1:
                return "red"; // red
            case 2:
                return "yellow"; // amber
            case 3:
                return "green"; // green
            case 4:
                return "orange"; // red-amber
            case 5:
                return "yellow"; // amber-flashing
            case 6:
                return "green"; // green-flashing
            default:
                return "grey"; // unknown
        }
    }
    return "grey"; // 기본 색상
}

/* Create animation pipes for displaying paths */
function createSignalPipes(_pathFeatures, _type) {
    // Create layer
    var pipeLayer = Module.getObjectLayerList().createObjectLayer({
        name: "SIGNAL_PATH_PIPE_LAYER_" + _type,
        type: Module.ELT_PIPE,
        selectable: true,
    });

    // Display flow animation from path data
    for (var i = 0; i < _pathFeatures.length; i++) {
        var _color = getColor(_pathFeatures[i].properties.datastreams);
        for (var j = 0; j < _pathFeatures[i].geometry.coordinates.length; j++) {
            var positions = _pathFeatures[i].geometry.coordinates[j];
            if (positions.length < 2) {
                continue;
            }

            // Parse coordinate list from path data
            let pipePathInput = new Module.Collection();
            for (var j = 0; j < positions.length; j++) {
                var altitude = Module.getMap().getTerrHeightFast(positions[j][0], positions[j][1]);
                pipePathInput.add(
                    new Module.JSVector3D(positions[j][0], positions[j][1], altitude+1.3)
                );
            }

            // Create path pipe
            var pathPipe = createPipe("path_" + _type + "_" + i, pipePathInput, _color);
            if (pathPipe != null) {
                pipeLayer.addObject(pathPipe, 0);
            }
        }
    }
}

function subscribeToRealTimeUpdates() {
    const client = mqtt.connect('wss://tld.iot.hamburg.de/mqtt', {
        port: 443,
        protocol: 'wss'
    });

    client.on('connect', function () {
        console.log('MQTT에 성공적으로 연결되었습니다.');
        const topic = 'v1.0/Observations';
        client.subscribe(topic, function (err) {
            if (!err) {
                console.log(`주제 ${topic} 구독에 성공했습니다.`);
            } else {
                console.log(`주제 ${topic} 구독에 실패했습니다.`, err);
            }
        });
    });

    client.on('message', function (topic, message) {
        const data = JSON.parse(message.toString());
        console.log("Real-time message data:", data);

        const url = data['@iot.selfLink'];

        fetch(url)
            .then(response => response.json())
            .then(data => {
                return fetch(data["FeatureOfInterest@iot.navigationLink"])
                    .then(response => response.json())
                    .then(featureOfInterestData => {
                        let geoJson = update_convertToGeoJson(data, featureOfInterestData);
                        console.log(geoJson);
                        updateGeoJson(geoJson);
                    });
            })
            .catch(error => {
                console.error('데이터 가져오기에 실패했습니다:', error);
            })
    });
}


function update_convertToGeoJson(observation, featureOfInterest) {
    const geoJson = {
        type: "FeatureCollection",
        features: [
            {
                type: "Feature",
                geometry: featureOfInterest.feature,
                properties: {
                    id: observation["@iot.id"],
                    phenomenonTime: observation.phenomenonTime,
                    resultTime: observation.resultTime,
                    result: observation.result,
                    Datastream: observation["Datastream@iot.navigationLink"].split('/')[1]  // Assuming Datastream info is needed
                }
            }
        ]
    };

    return geoJson;
}


function updateGeoJson(geoJson) {
    geoJson.features.forEach(feature => {
        const existingLayer = new Module.JSLayerList.find(layer => {
            const layerFeature = layer.feature;
            return layerFeature && layerFeature.properties.id === feature.properties.id;
        });

        console.log(existingLayer);

        if (existingLayer) {
            existingLayer.setStyle({ color: getColor(feature.properties.datastreams) });
        } else {
            geoJsonLayer.addData(feature);
        }
    });
}

// Signal END ----------------------------------------------------------------------------------------------------------

function moveToBerlin(){
    Module.getViewCamera().setTilt(90);
    Module.getViewCamera().setLocation(new Module.JSVector3D(13.4055999, 52.5183262, 30000));
}

function moveToOperahouse(){
    Module.getViewCamera().setTilt(90);
    Module.getViewCamera().setLocation(new Module.JSVector3D(9.9878204, 53.5568906, 800));
}