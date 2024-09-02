var GLOBAL = {
    Camera : null
};

var Module = {

    locateFile : function(s) {
        return "./engine/"+ s;
    },
    postRun: function() {

        // 엔진 초기화 API 호출(필수)
        Module.initialize({
            container: document.getElementById("map"),
            terrain : {
                dem : {
                    url : "https://3dmap.egiscloud.com",
                    name : "dem_nasa",
                    encoding : false,
                    servername : "XDServer"
                },
                image : {
                    url : "https://3dmap.egiscloud.com",
                    name : "img_nasa",
                    servername : "XDServer"
                },
            },
            worker : {
                path : "/worker/XDWorldWorker.js",
                count : 5,
                use : false,
            },
            defaultKey : "ezbBD(h2eFCmDQFQd9QpdzDS#zJRdJDm4!Epe(a2EzcbEzb2"
        });

        Module.GoogleMap().layername = "satellite";

        GLOBAL.Camera = Module.getViewCamera();
        GLOBAL.Camera.setLocation(new Module.JSVector3D(9.9842019, 53.5492864, 58137));

        // var layer = Module.getTileLayerList().createXDServerLayer({
        //     url : "https://xdworld.vworld.kr",
        //     servername : "XDServer3d",
        //     name : "facility_build",
        //     type : 9,
        //     minLevel : 0,
        //     maxLevel : 15
        // });

        var layer = Module.getTileLayerList().createXDServerLayer({
            url : "https://basemap.egiscloud.com",
            servername : "XDServer",
            name : "Facility_Hamburg_xdo",
            type : Module.TILE_LAYER_TYPE_REAL3D,
            selectable : true,
            visible : true,
            textureExt : "dds",
            minLevel : 0,
            maxLevel : 15
        });
//
        layer.setTileLoadCallback(loadCallback);
        GLOBAL.layer = layer;

        // Module.XDEMapCreateLayer("hamburg_demo", "https://3dmap.egiscloud.com", 0, true, true, false, 9, 0, 6);
    }
};


function mouseOverInterface(_isOver) {
    if (typeof Module == "object") {
        Module.XDIsMouseOverDiv(_isOver);
    }
}
window.onresize = function(e) {
    if (typeof Module == 'object') {
        if (typeof Module.Resize == 'function') {
            Module.Resize(window.innerWidth, window.innerHeight);
            Module.XDRenderData();
        }
    }
};

// 마우스 벗어나면 움직임 block
document.addEventListener('mouseout', function(event) {
    if (event.clientY <= 0 || event.clientX <= 0 || event.clientX >= window.innerWidth || event.clientY >= window.innerHeight) {
        var control = Module.getControl();
        control.setMousePanMode(false);
        control.setMouseRotMode(false);
    }
});

document.addEventListener('mouseover', function(event) {
    var map = document.querySelector('#map');
    map.addEventListener('mousedown', (e) => {
        var control = Module.getControl();
        control.setMousePanMode(true);
        control.setMouseRotMode(true);
    });
});
