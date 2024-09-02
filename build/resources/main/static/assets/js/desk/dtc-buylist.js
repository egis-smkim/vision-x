/**
 * 
 */
//엔진 로드 후 실행할 초기화 함수(Module.postRun)
function init() {
	// 엔진 초기화 API 호출(필수)
	var width =$('#sampleMap').width();
	var height =  $('#sampleMap').height();
	Module.Start(width,height);
	Module.getViewCamera().setLocation(new Module.JSVector3D(128.60476053376036 , 35.871494412725845, 15000));
}

var Module = {
		TOTAL_MEMORY: 256*1024*1024,
		postRun: [init],
		canvas: (function() {
			/*var canvas = document.getElementById('dataMapCanvas');
			 // contextmenu disabled
			canvas.addEventListener("contextmenu", function(e){
	          e.preventDefault();
	       });
			return canvas;*/
			// Canvas 엘리먼트 생성
		      var canvas = document.createElement('canvas');
				
		      // Canvas id, Width, height 설정
		      canvas.id = "canvas";
		      canvas.width="calc(100%)";
		      canvas.height="100%";
				
		      // Canvas 스타일 설정
		      canvas.style.position = "absolute";
		      canvas.style.top = "0px";
		      canvas.style.left = "0px";

		      // contextmenu disabled
		      canvas.addEventListener("contextmenu", function(e){
		         e.preventDefault();
		      });
			
		      // 생성한 Canvas 엘리먼트를 body에 추가합니다.
		      document.getElementById('sampleMap').appendChild(canvas);
		     // COMMON.unblockUIdiv('sampleMap');
		      return canvas;
		})()
};

//엔진 파일 로드
;(function(){
	
	//COMMON.blockUIdiv("sampleMap","LOADING");
	// 1. XDWorldEM.asm.js 파일 로드
	var file = "../../assets/js/engine/XDWorldEM.asm.js";

	var xhr = new XMLHttpRequest();
	xhr.open('GET', file, true);
	xhr.onload = function() {

		var script = document.createElement('script');
		script.innerHTML = xhr.responseText;
		//document.body.appendChild(script);
		document.getElementById('sampleMap').appendChild(script);
		// 2. XDWorldEM.html.mem 파일 로드
		setTimeout(function() {
			(function() {
				var memoryInitializer = "../../assets/js/engine/XDWorldEM.html.mem";
				var xhr = Module['memoryInitializerRequest'] = new XMLHttpRequest();
				xhr.open('GET', memoryInitializer, true);
				xhr.responseType = 'arraybuffer';
				xhr.onload =  function(){

					// 3. XDWorldEM.js 파일 로드
					var url = "../../assets/js/engine/XDWorldEM.js";
					var xhr = new XMLHttpRequest();
					xhr.open('GET',url , true);
					xhr.onload = function(){
						var script = document.createElement('script');
						script.innerHTML = xhr.responseText;
						//document.body.appendChild(script);
						document.body.appendChild(script);
					};
					xhr.send(null);
				}
				xhr.send(null);
			})();
		}, 1);
	};
	xhr.send(null);
}
)();

/*var MAPDATA  = {
		init:function(){
			init();
		}
}
*/
var BUYLIST = {
		PAIDAPP:{ // 1.구매한앱

		},
		DATAMAP:{ // 2.주제도
			init:function(){
				
			},
			selectCategory:function(){
				
			}
			
		},
		DATASET:{//3.데이터 셋

		}
}

