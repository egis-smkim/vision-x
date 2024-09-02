;(function() {
	if (typeof Module == 'undefined') {
		return;
	}
})();

var toolbar_marker = {
	
	pointCount : 0,
	areaPoint : null,
	
	API : {
		Symbol : null
	},
	
	Layer : {
		distance : null,
		area : null,
		altitude : null
	},
	
	init : function(_canvas) {
		
		var layerList = new Module.JSLayerList(true);
		
		this.Layer.distance = layerList.createLayer("MEASURE_DISTANCE", Module.ELT_3DPOINT);
		this.Layer.distance.setMaxDistance(10000000.0);
		
		this.Layer.area = layerList.createLayer("MEASURE_AREA", Module.ELT_3DPOINT);
		this.Layer.area.setMaxDistance(10000000.0);
		
		this.Layer.altitude = layerList.createLayer("MEASURE_ALTITUDE", Module.ELT_3DPOINT);
		this.Layer.altitude.setMaxDistance(6000000.0);
		
		_canvas.addEventListener("Fire_EventAddDistancePoint", function(e){
			toolbar_marker.Data.insertDistanceValue(e);
		});
		
		_canvas.addEventListener("Fire_EventAddAreaPoint", function(e){
			toolbar_marker.Data.insertAreaValue(e);
		});
		
		_canvas.addEventListener("Fire_EventAddAltitudePoint", function(e){
			toolbar_marker.Data.insertAltitudeValue(e);
		});
	},
	
	clear : function() {
		
		this.Layer.distance.removeAll();
		this.Layer.area.removeAll();
		this.Layer.altitude.removeAll();
		
		var analysis = Module.getAnalysis();
		analysis.clearDist();
		analysis.clearArea();
	},
	
	
	Data : {
		
		insertDistanceValue : function(e) {
			
			var partDistance = e.dDistance,
				totalDistance = e.dTotalDistance
				;

			// 최초 시작점 위치 표시
			if (partDistance == 0 && totalDistance == 0) {
				toolbar_marker.createPoint(
					"distance",
					new Module.JSVector3D(e.dLon, e.dLat, e.dAlt),
					"rgba(255, 204, 198, 0.8)",
					"Start",
					true
				);
			} else {

				// 이전 입력지점 ~ 최종 지점 간 거리
				if (e.dDistance > 0.01){

					toolbar_marker.createPoint(
						"distance",
						new Module.JSVector3D(e.dMidLon, e.dMidLat, e.dMidAlt),
						"rgba(255, 255, 0, 0.8)",
						toolbar_marker.setKilloUnit(e.dDistance, 'm', '㎞', 0.001, 0),
						false
					);
				}

				// 첫 입력 지점 ~ 최종 지점 간 거리
				toolbar_marker.createPoint(
					"distance",
					new Module.JSVector3D(e.dLon, e.dLat, e.dAlt),
					"rgba(255, 204, 198, 0.8)",
					toolbar_marker.setKilloUnit(e.dTotalDistance, 'm', '㎞', 0.001, 0),
					true
				);
			}
		},
		
		insertAreaValue : function(e) {
			
			if (toolbar_marker.areaPoint == null) {

				// 첫 이벤트 호출 시 POI 오브젝트 생성
				toolbar_marker.areaPoint = Module.createPoint("Area"+toolbar_marker.pointCount++);
				toolbar_marker.Layer.area.addObject(toolbar_marker.areaPoint, 0);
			}
			e.dArea = Math.round(e.dArea*1000)/1000;
			toolbar_marker.setPoiIcon(new Module.JSVector3D(e.dLon, e.dLat, e.dAlt + 2.0), e.dArea);
			//toolbar_marker.areaPoint.setPosition(new Module.JSVector3D(e.dLon, e.dLat, e.dAlt + 2.0));  // 약간 띄워서 표현
		},
		
		insertAltitudeValue : function(e) {
			
			toolbar_marker.createDotPoint(
				new Module.JSVector3D(e.dLon, e.dLat, e.dAlt),
				e.dGroundAltitude,
				e.dObjectAltitude
			);
		}
	},
	
	createDotPoint : function(_position, groudAltitude, objectAltitude) {
		
		var width = 100;
		var height = 30;
		if (objectAltitude > -1) {
			height += 15;
		}
		
		var drawCanvas = document.createElement('canvas');
		drawCanvas.width = width;
		drawCanvas.height = height;
		
		var ctx = drawCanvas.getContext('2d');
		
		var dotSize = 10;
		this.drawDot(ctx, drawCanvas.width, drawCanvas.height, dotSize*0.5, "rgba(0, 255, 0, 0.6)", 3, 'rgba(35, 129, 245, 0.8)'); 
		if (objectAltitude > -1){
			this.drawRoundRect(ctx, 0, 0, width, height-dotSize, 5);		// 도형 그리기						
		} else {
			this.drawRoundRect(ctx, 0, 0, width, height-dotSize, 5);		// 도형 그리기		
		}
		
		ctx.fillStyle = "rgba(100, 100, 100, 0.5)";
		ctx.fill();
		
		if (objectAltitude > -1){
			this.setText(ctx, width/2, 30, $.i18n.t('Index.tool.elevation')+this.setKilloUnit(groudAltitude + objectAltitude, 'm', '㎞', 0.001, 0), "rgb(255, 255, 255)", 12);
		}
		this.setText(ctx, width/2, 15, $.i18n.t('Index.tool.altitude')+this.setKilloUnit(groudAltitude, 'm', '㎞', 0.001, 0), "rgb(255, 255, 255)", 12);
		
		var imageData = ctx.getImageData(0, 0, width, height).data;
		
		var poi = Module.createPoint("POI" + this.pointCount);
		poi.setPosition(_position);
		poi.setImage(imageData, width, height);
		poi.addScreenPosition(0, -height*0.5+dotSize*0.5);
		
		this.Layer.altitude.addObject(poi, 0);
		
		this.pointCount++;
	},
	
	setPoiIcon : function(_position, _value) {

		// POI 아이콘 이미지를 그릴 Canvas 생성
		var drawCanvas = document.createElement('canvas');
		drawCanvas.width = 300;
		drawCanvas.height = 50;

		// 아이콘 이미지 데이터 반환
		var imageData = toolbar_marker.drawIcon(drawCanvas, _value+'㎡', "rgb(255, 255, 255)");

		this.Layer.area.removeAll();
		
		var poi = Module.createPoint("POI");
		poi.setPosition(_position);
		poi.setImage(imageData, drawCanvas.width, drawCanvas.height);
		
		// 레이어에 오브젝트 추가
		this.Layer.area.addObject(poi, 0);
		
		/*// 아이콘 해제
		var oldIcon = toolbar_marker.API.Symbol.getIcon("Icon");
		if (oldIcon != null) {
			toolbar_marker.areaPoint.releaseIcon();
			toolbar_marker.API.Symbol.deleteIcon(oldIcon.getId());
		}*/

		/*// 심볼에 아이콘 이미지 등록
		if (toolbar_marker.API.Symbol.insertIcon("Icon", imageData, drawCanvas.width, drawCanvas.height)) {

			// 기존 등록한 POI의 아이콘 이미지 반환
			var newIcon = toolbar_marker.API.Symbol.getIcon("Icon");

			// 새로 생성한 POI 아이콘 이미지 설정
			toolbar_marker.areaPoint.setIcon(newIcon);
		}*/
	},
	
	createPoint : function(_type, _position, _color, _value, _balloonType) {

		// POI 아이콘 이미지를 그릴 Canvas 생성
		var drawCanvas = document.createElement('canvas');
		drawCanvas.width = 100;
		drawCanvas.height = 30;

		// 아이콘 이미지 데이터 반환
		var imageData = this.drawIcon(drawCanvas, _value, _color),
			nIndex = this.pointCount
			;
		
		// Point 저장 레이어 지정
		var layer = null;
		if (_type == 'distance') {
			layer = this.Layer.distance;
		} else if (_type == 'area') {
			layer = this.Layer.area;
		} else {
			return;
		}
		
		var poi = Module.createPoint("POI"+nIndex);
		poi.setPosition(_position);
		poi.setImage(imageData, drawCanvas.width, drawCanvas.height);
		
		// 레이어에 오브젝트 추가
		layer.addObject(poi, 0);
		
		this.pointCount++;
	},
	
	drawIcon : function(_canvas, _value, _color) {

		// 컨텍스트 반환 및 배경 초기화
		var ctx = _canvas.getContext('2d'),
			width = _canvas.width,
			height = _canvas.height
			;
		ctx.clearRect(0, 0, width, height);

		// 배경 Draw Path 설정 후 텍스트 그리기
		this.drawBalloon(ctx, 0, width, height, 5, height*0.25, _color);
		this.setText(ctx, width*0.5, height*0.5, _value, "rgb(0, 0, 0)", 16);

		return ctx.getImageData(0, 0, _canvas.width, _canvas.height).data;
	},
	
	/* 말풍선 배경 그리기 */
	drawBalloon : function(ctx, marginBottom, width, height, barWidth, barHeight, _color) {

		var wCenter = width * 0.5,
			hCenter = height * 0.5;

		// 말풍선 형태의 Draw Path 설정
		ctx.beginPath();
		ctx.moveTo(0, 				 0);
		ctx.lineTo(0, 				 height-barHeight-marginBottom);
		ctx.lineTo(wCenter-barWidth, height-barHeight-marginBottom);
		ctx.lineTo(wCenter, 		 height-marginBottom);
		ctx.lineTo(wCenter+barWidth, height-barHeight-marginBottom);
		ctx.lineTo(width,			 height-barHeight-marginBottom);
		ctx.lineTo(width,			 0);
		ctx.closePath();

		// 말풍선 그리기
		ctx.fillStyle = _color;
		ctx.fill();
	},
	
	drawDot : function (ctx, width, height, radius, lineColor, lineWidth, fillColor) {
		
		ctx.beginPath();			
        ctx.lineWidth = 2;
        ctx.arc(width*0.5, height-radius, radius, 0, 2 * Math.PI, false);    
		ctx.closePath();
		
		ctx.fillStyle = fillColor;
		ctx.fill();
		
		ctx.lineWidth = lineWidth;
		ctx.strokeStyle = lineColor;
		ctx.stroke();
	},
	
	drawRoundRect : function (ctx, x, y, w, h, r) {
		
		if (w < 2 * r) r = w / 2;
		if (h < 2 * r) r = h / 2;
		
		ctx.beginPath();
		ctx.moveTo(x+r, y);
		ctx.arcTo(x+w, y,   x+w, y+h, r);
		ctx.arcTo(x+w, y+h, x,   y+h, r);
		ctx.arcTo(x,   y+h, x,   y,   r);
		ctx.arcTo(x,   y,   x+w, y,   r);
		ctx.closePath();
		
		return ctx;
	},

	/* 텍스트 그리기 */
	setText : function(_ctx, _posX, _posY, _value, _color, _size) {

		// 텍스트 문자열 설정
		var strText = (isNaN(_value)) ? _value : this.setTextComma(_value.toFixed(2));

		// 텍스트 스타일 설정
		_ctx.font = "bold "+_size+"px sans-serif";
		_ctx.textAlign = "center";
		_ctx.fillStyle = _color;

		// 텍스트 그리기
		_ctx.fillText(strText, _posX, _posY);
	},
	
	setKilloUnit : function (_text, _meterUnit, _killoUnit, _meterToKilloRate, _decimalSize){
		
		if (_decimalSize < 0){
			_decimalSize = 0;
		}
		if (typeof _text == "number") {
			if (_text < 1.0/(_meterToKilloRate*Math.pow(10,_decimalSize))) {
				_text = _text.toFixed(1).toString()+_meterUnit;
			} else {			
				_text = (_text*_meterToKilloRate).toFixed(2).toString()+_killoUnit;
			}
		}
		return _text;
	},

	setTextComma : function(str) {
		str = String(str);
		return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
	}
}

toolbar_marker.init(Module.canvas);

console.log("toolbar_marker");