var toolbar_drawing = {

	canvas : null,
	context : null,
	tool : null,
	isOpen : false,
	drawable : false,
	penStyle : -1,
	parentDiv : null,
	drawPosX : 0,
	drawPosY : 0,
	
	setDrawCanvasBorder : function(){

		var ctx = this.context,
			drawCanvas = this.canvas
			;
		
		if (drawCanvas == null || ctx == null) {
			return;
		}
		var drawLineWidth = ctx.lineWidth,
			drawLineColor = ctx.strokeStyle;
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.rect(0, 0, drawCanvas.width, drawCanvas.height);
		ctx.stroke();
		ctx.lineWidth = drawLineWidth;
		ctx.strokeStyle = drawLineColor;
	},

	removeDrawCanvasBorder : function() {

		var ctx = this.context,
			drawCanvas = this.canvas
			;
		if (drawCanvas == null || ctx == null) {
			return;
		}
		ctx.clearRect(0, 0, drawCanvas.width, 2);						// 윗 가로줄 삭제
		ctx.clearRect(0, 0, 2, drawCanvas.height);						// 왼쪽 줄 삭제
		ctx.clearRect(0, drawCanvas.height-2, drawCanvas.width, 2);		// 아래 가로줄 삭제
		ctx.clearRect(drawCanvas.width-2, 0, drawCanvas.width, drawCanvas.height);		// 윗 가로줄 삭제
	},

	open : function(_mapCanvas){

		if (_mapCanvas == null) {
			return;
		}

		if (this.canvas == null) {
			
			// 그리기용 캔버스 생성
			var drawCanvas = document.createElement("canvas");
			
			// 지도 캔버스 위에 그릴 수 있도록 위치와 크기 맞춤
			var mapCanvasRect = _mapCanvas.getBoundingClientRect();
			this.drawPosX = mapCanvasRect.left;
			this.drawPosY = mapCanvasRect.top;
			
			drawCanvas.width = _mapCanvas.width;
			drawCanvas.height = _mapCanvas.height;
			drawCanvas.style = "display:block;position:absolute;left:0px;top:0px;zIndex:90;z-Index:1;";
			drawCanvas.id = "UserDrawCanvas";
			_mapCanvas.parentElement.appendChild(drawCanvas);

			// 그리기용 캔버스 이벤트 설정
			if (document.addEventListener) { 	// IE 9이상 & 그 외 브라우저
				drawCanvas.addEventListener('contextmenu', function(e) {
					e.preventDefault();
				}, false);
			} else { // IE 9 이하
				drawCanvas.attachEvent('oncontextmenu', function() {
					window.event.returnValue = false;
				});
			}
			
			drawCanvas.addEventListener('mousedown', this.ev_canvas, false);
			drawCanvas.addEventListener('mousemove', this.ev_canvas, false);
			drawCanvas.addEventListener('mouseup',   this.ev_canvas, false);
			drawCanvas.addEventListener('touchstart', this.ev_canvas, false);
			drawCanvas.addEventListener('touchmove', this.ev_canvas, false);
			drawCanvas.addEventListener('toucnend',   this.ev_canvas, false);
			
			this.canvas = drawCanvas;
		}
		
		if (this.tool == null) {
			this.tool = new this.createPencil();
		}
		
		if (this.context == null){
			this.context = this.canvas.getContext('2d');
			this.context.lineCap = 'round';
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.context.strokeStyle = "#FF0000";
		}

		Module.XDIsMouseOverDiv(true);
		Module.XDSetMouseState(0);
		
		toolbar_drawing.drawable = true;
		toolbar_drawing.setDrawCanvasBorder();
		toolbar_drawing.isOpen = true;
	},

	createPalette : function(_parentDiv) {

		if (typeof _parentDiv == "undefined") {
			return;
		}

		_parentDiv.innerHTML = "";

		if(document.getElementById("XDUserDrawPaletteCanvas")){
			return;
		}
		var canvas = document.createElement("canvas");
		canvas.id = "XDUserDrawPaletteCanvas";
		canvas.width = 200;
		canvas.height = 120;
		canvas.style.margin = "5px";
		canvas.style.position = "fixed";
		canvas.style.display = "none";
		canvas.style.top = "50px";
		canvas.style.right = "290px";
		canvas.style.border = "1px solid white";
		_parentDiv.appendChild(canvas);
		this.parentDiv = _parentDiv;

		var ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		var hGrad = ctx.createLinearGradient(0, 0, canvas.width, 0);
		hGrad.addColorStop(0 / 6, '#F00');
		hGrad.addColorStop(1 / 6, '#FF0');
		hGrad.addColorStop(2 / 6, '#0F0');
		hGrad.addColorStop(3 / 6, '#0FF');
		hGrad.addColorStop(4 / 6, '#00F');
		hGrad.addColorStop(5 / 6, '#F0F');
		hGrad.addColorStop(6 / 6, '#F00');

		ctx.fillStyle = hGrad;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		var vwGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
		vwGrad.addColorStop(0.3, 'rgba(255,255,255,0)');
		vwGrad.addColorStop(0.7, 'rgba(255,255,255,0)');
		vwGrad.addColorStop(1, 'rgba(255,255,255,1)');
		ctx.fillStyle = vwGrad;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		var vbGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
		vbGrad.addColorStop(0, 'rgba(0,0,0,1)');
		vbGrad.addColorStop(0.3, 'rgba(0,0,0,0)');
		vbGrad.addColorStop(1, 'rgba(0,0,0,0)');
		ctx.fillStyle = vbGrad;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		canvas.addEventListener("click", function(e){
			var ctx = this.getContext('2d');
			var p = ctx.getImageData(e.offsetX, e.offsetY, 1, 1).data;
			var hex = "#" + ("000000" + ((p[0] << 16) | (p[1] << 8) | p[2]).toString(16)).slice(-6);
			toolbar_drawing.setPenColor(hex);
			document.getElementById("previewBrushSize").style.backgroundColor = hex;
			toolbar_drawing.parentDiv.style.backgroundColor = hex;
		}, true);
	},

	createPencil : function(){

		var tool = this;
		this.started = false;

		// 마우스를 누르는 순간 그리기 작업을 시작 한다.
		this.mousedown = this.touchstart = function (ev) {
			if(toolbar_drawing.drawable){
				Module.XDIsMouseOverDiv(true);
				toolbar_drawing.context.beginPath();
				//toolbar_drawing.context.moveTo(ev._x+this.drawPosX, ev._y+this.drawPosY);
				toolbar_drawing.context.moveTo(ev._x, ev._y);
				tool.started = true;
			}
		};

	   // 마우스가 이동하는 동안 계속 호출하여 Canvas에 Line을 그려 나간다
		this.mousemove = this.touchmove = function (ev) {
			Module.XDIsMouseOverDiv(true);
			/*console.log("마우스 이동:",ev._x);
			console.log("drawPosX 이동:",this.drawPosX);
			console.log("마우스 이동 + drawPosX",ev._x+this.drawPosX);*/
			if (tool.started) {
				//toolbar_drawing.context.lineTo(ev._x+this.drawPosX, ev._y+this.drawPosY);
				toolbar_drawing.context.lineTo(ev._x, ev._y);
				toolbar_drawing.context.stroke();
			}
		};

	   // 마우스 떼면 그리기 작업을 중단한다
		this.mouseup = this.touchend = function (ev) {
			if (tool.started){
				tool.mousemove(ev);
				tool.started = false;
			}
		};
	},

	ev_canvas : function(ev) {

		if (ev.touches) {
			if (ev.touches.length != 1){
				return;
			}
			ev._x = parseInt(ev.touches[0].clientX+this.drawPosX);
			ev._y = parseInt(ev.touches[0].clientY+this.drawPosY);

		} else {
			if (ev.layerX || ev.layerX == 0) { // Firefox 브라우저
			  ev._x = ev.layerX;
			  ev._y = ev.layerY;
			}
			else if (ev.offsetX || ev.offsetX == 0) { // Opera 브라우저
			  ev._x = ev.offsetX;
			  ev._y = ev.offsetY;
			}
		}

		// tool의 이벤트 핸들러를 호출한다.
		var func = toolbar_drawing.tool[ev.type];
		if (func) {
			func(ev);
		}
	},

	setPenColor : function(_color){
		this.context.strokeStyle = _color;
		this.setDrawCanvasBorder();
	},

	saveUserDraw : function(){

		var drawCanvas = this.canvas;
		if(!drawCanvas)
			return;

		this.removeDrawCanvasBorder();

		// 스크린샷 만들 canvas
		var canvas = document.createElement('canvas'),
			ctx = canvas.getContext('2d');
		canvas.width = drawCanvas.width;
		canvas.height = drawCanvas.height;

		var img = new Image();
		img.onload = function() {

			// 지도 캔버스 화면을 복사
            ctx.drawImage(this, 0, 0, drawCanvas.width, drawCanvas.height);
			var wmImg = new Image();
			wmImg.onload = function() {

				// 워터마크 붙이기
				// sumin add_161102_1559 IE, firefox 지원 화면캡쳐 저장기능 추가
				ctx.drawImage(this, canvas.width-this.width, canvas.height-this.height);
				toolbar_drawing.setDrawCanvasBorder();

				if (canvas.msToBlob) { 							// sumin 161011 (수정) for IE
					var blob = canvas.msToBlob();
					return window.navigator.msSaveBlob(blob, 'XDMapScreenShot.png');
				} else {
					if (typeof canvas.toBlob == 'undefined'){
						var canvasData = canvas.toDataURL("image/png");
						window.open(canvasData, '_blank');
					} else {
						var canvasBlob = canvas.toBlob(function(blob){
							var url = URL.createObjectURL(blob);
							var dl = document.createElement('a');
							dl.setAttribute('href', url);
							dl.setAttribute("download", 'XDMapScreenShot.png');
							document.body.appendChild(dl);
							dl.click();
							document.body.removeChild(dl);
							return true;
						}, "image/jpeg", 1.0);
					}
				}
			};
			wmImg.src = "./images/mashup/logo_watermark.png";
        };
		img.src = drawCanvas.toDataURL("image/jpeg");

	},

	close : function(){
		
		this.isOpen = false;
		this.drawable = false;
		
		this.canvas.parentElement.removeChild(this.canvas);
		this.canvas = null;
		this.context = null;
		
		Module.XDSetMouseState(1);
		Module.XDIsMouseOverDiv(false);
	}
};