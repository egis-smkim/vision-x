package com.vision_x.vision_x.utils;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.xml.transform.TransformerException;

import org.apache.commons.lang.StringUtils;
import org.geotools.factory.CommonFactoryFinder;
import org.geotools.filter.text.cql2.CQL;
import org.geotools.filter.text.cql2.CQLException;
import org.geotools.measure.Units;
import org.geotools.styling.AnchorPoint;
import org.geotools.styling.Displacement;
import org.geotools.styling.ExternalGraphic;
import org.geotools.styling.FeatureTypeStyle;
import org.geotools.styling.Fill;
import org.geotools.styling.Graphic;
import org.geotools.styling.Halo;
import org.geotools.styling.LabelPlacement;
import org.geotools.styling.LineSymbolizer;
import org.geotools.styling.Mark;
import org.geotools.styling.NamedLayer;
import org.geotools.styling.StyledLayer;
import org.geotools.styling.NamedLayer;
import org.geotools.styling.PointSymbolizer;
import org.geotools.styling.PolygonSymbolizer;
import org.geotools.styling.Rule;
import org.geotools.styling.Stroke;
import org.geotools.styling.Style;
import org.geotools.styling.StyleBuilder;
import org.geotools.styling.StyleFactory;
import org.geotools.styling.StyledLayerDescriptor;
import org.geotools.styling.TextSymbolizer;
import org.geotools.xml.styling.SLDTransformer;
import org.geotools.xml.xLink.XLinkSchema.Label;
import org.hsqldb.types.Charset;
import org.json.JSONArray;
import org.opengis.filter.FilterFactory2;
import org.opengis.filter.expression.Function;
import org.opengis.style.GraphicStroke;
import org.opengis.style.GraphicalSymbol;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SLDService {
	protected Logger logger = LoggerFactory.getLogger(this.getClass());
	public String createStyle(JSONArray jsonArr, String shpType)
			throws CQLException, TransformerException, UnsupportedEncodingException {
		String sldXml = "";

		String featureType = shpType;
		boolean simpleSymbolFlag = false;
		boolean simpleLabelFlag = false;

		int symbolCnt = 0;
		int labelCnt = 0;

		for (int i = 0; i < jsonArr.length(); i++) {
			String marker = jsonArr.getJSONObject(i).get("marker").toString().trim();
			if (marker.equals("0") || marker.equals("1") || marker.equals("2") || marker.equals("3")
					|| marker.equals("5") || marker.equals("6")) {// 심플 심볼,이미지 심볼

				symbolCnt++;
			}
			if (marker.equals("4")) {// 라벨
				labelCnt++;
			}
		}

		if (symbolCnt > 1) {// 단일
			simpleSymbolFlag = false;// 심볼이 복수
		} else {// 규칙 (복수)
			simpleSymbolFlag = true;// 심볼이 하나
		}

		if (labelCnt > 1) {
			simpleLabelFlag = false;// 라벨이 복수 개인 경우
		} else {
			simpleLabelFlag = true;// 라벨이 단일인 경우
		}

		// 심볼 플래그
		boolean symbolFlag = false;

		// 포인트 관련 플래그
		boolean pointImgFlag = false;

		// 라인 관련 플래그
		boolean lineMakerFlag = false;

		// 폴리곤 관련 플래그
		boolean PolygonImgFlag = false;
		boolean hatchingFlag = false;// 폴리곤 해치 fill

		// 라벨 관련 플래그
		boolean labelFlag = false;

		// boolean labelDefaultFlag= false;

		FilterFactory2 ff = CommonFactoryFinder.getFilterFactory2();
		StyleFactory sf = CommonFactoryFinder.getStyleFactory();

		PointSymbolizer psym = null;
		LineSymbolizer lsym = null;
		PolygonSymbolizer polysym = null;
		TextSymbolizer tsym = null;

		// lsym.setUnitOfMeasure(Units.PIXEL);
		// polysym.setUnitOfMeasure(Units.PIXEL);
		// tsym.setUnitOfMeasure(Units.PIXEL);

		// FeatureTypeStyle fts = sf.createFeatureTypeStyle();

		List<Rule> ruleList = new ArrayList<Rule>();

		for (int i = 0; i < jsonArr.length(); i++) {
			// 공통 마커 0심플 포인트,1이미지 포인트,2심플라인,3마커라인,4라벨,5심플 폴리곤,6이미지 폴리곤
			String marker = jsonArr.getJSONObject(i).get("marker").toString().trim();

			// 포인트
			String labelName = "";
			String fill = "";
			String wellKnownName = "";
			String rule = "";
			float size = 0;
			String stroke = "";
			float stroke_width = 0;
			float opacity = 1;
			float rotation = 0;

			String imageFileFormat = "";
			String imageFileName = "";
			float imageWidth = 0;
			float imageHeight = 0;

			String imagePath = "";

			boolean pointElseFlag = false;
			boolean point_uncheckedFlag = false;

			// 라인
			String line_labelName = "";
			String line_filter = "";
			String line_simpleMarker = "";
			float line_StrokeWidth = 0;
			float line_Offset = 0;
			String line_Type = "";
			String line_Color = "";
			float line_markerSize = 0;
			float line_markerOffset = 0;
			float line_markerOutlineWidth = 0;
			String line_markerOutlineColor = "";
			float line_opacity = 0;

			boolean lineElseFlag = false;
			boolean line_uncheckedFlag = false;
			// 폴리곤

			String polygon_labelName = "";
			String polygon_filter = "";
			String polygon_simpleMarker = "";
			String polygon_lineType = "";// 획 스타일
			String polygon_lineColor = "";// 획 색상
			float polygon_lineWidth = 0;
			String polygon_fillColor = "";
			float polygon_imageWidth = 0;
			float polygon_imageHeight = 0;
			float polygon_imageOffsetX = 0;
			float polygon_imageOffsetY = 0;
			float polygon_opacity = 0;
			String polygon_imagePath = "";
			String polygon_imageFileFormat = "";

			boolean polygonElseFlag = false;
			boolean polygon_uncheckedFlag = false;

			// 라벨
			String label_color = "";
			String label_labelName = "";
			String label_rule = "";
			float label_Xoffset = 0;
			float label_Yoffset = 0;
			String label_font_family = "";
			String label_buffer_color = "";
			String label_attribute = "";
			String label_fontSize = "";
			float label_opacity = 1;
			float label_rotation = 0;
			float label_buffer_radius = 0;

			boolean labelElseFlag = false;
			boolean label_uncheckedFlag = false;

			if (marker.equals("0") || marker.equals("1")) { // 심볼인 경우
				labelName = jsonArr.getJSONObject(i).get("labelName").toString().trim();
				fill = jsonArr.getJSONObject(i).get("color").toString().trim();// outlineColor
				wellKnownName = jsonArr.getJSONObject(i).get("simpleMarker").toString().trim();
				rule = jsonArr.getJSONObject(i).get("filter").toString().trim();

				if (StringUtils.isNotEmpty(jsonArr.getJSONObject(i).get("size").toString().trim())) {
					size = Float.parseFloat(jsonArr.getJSONObject(i).get("size").toString().trim());
				}

				stroke = jsonArr.getJSONObject(i).get("outlineColor").toString().trim();

				if (StringUtils.isNotEmpty(jsonArr.getJSONObject(i).get("outlineWidth").toString().trim())) {
					stroke_width = Float.parseFloat(jsonArr.getJSONObject(i).get("outlineWidth").toString().trim());
				}
				opacity = (float) (Float.parseFloat(jsonArr.getJSONObject(i).get("opacity").toString().trim()) / 100.0);
				rotation = Float.parseFloat(jsonArr.getJSONObject(i).get("rotation").toString().trim());
				imageFileFormat = jsonArr.getJSONObject(i).get("imageFileFormat").toString().trim();
				imageFileName = jsonArr.getJSONObject(i).get("imageFileName").toString().trim();
				if (StringUtils.isNotEmpty(jsonArr.getJSONObject(i).get("imageWidth").toString().trim())) {
					imageWidth = Float.parseFloat(jsonArr.getJSONObject(i).get("imageWidth").toString().trim());
				}
				if (StringUtils.isNotEmpty(jsonArr.getJSONObject(i).get("imageHeight").toString().trim())) {
					imageHeight = Float.parseFloat(jsonArr.getJSONObject(i).get("imageHeight").toString().trim());
				}

				imagePath = jsonArr.getJSONObject(i).get("imageFilePath").toString().trim();
				if (jsonArr.getJSONObject(i).get("elseFlag").toString().trim().equals("true")) {
					pointElseFlag = true;
				} else {
					pointElseFlag = false;
				}
				if (jsonArr.getJSONObject(i).has("uncheckedFlg")) {
					point_uncheckedFlag = true;
				} else {
					point_uncheckedFlag = false;
				}
			} else if (marker.equals("2") || marker.equals("3")) { // 단순 라인 ,마커 라인
				if (StringUtils.isNotEmpty(jsonArr.getJSONObject(i).get("lineStrokeWidth").toString().trim())) {
					line_StrokeWidth = Float
							.parseFloat(jsonArr.getJSONObject(i).get("lineStrokeWidth").toString().trim());
				}
				line_Type = jsonArr.getJSONObject(i).get("lineType").toString().trim();// 단순라인, 마커라인
				line_Color = jsonArr.getJSONObject(i).get("lineColor").toString().trim();
				if (StringUtils.isNotEmpty(jsonArr.getJSONObject(i).get("lineOffset").toString().trim())) {
					line_Offset = Float.parseFloat(jsonArr.getJSONObject(i).get("lineOffset").toString().trim());
				}
				line_labelName = jsonArr.getJSONObject(i).get("labelName").toString().trim();
				line_opacity = Float.parseFloat(jsonArr.getJSONObject(i).get("opacity").toString().trim()) / 100;// outlineColor
				line_filter = jsonArr.getJSONObject(i).get("filter").toString().trim();
				line_simpleMarker = jsonArr.getJSONObject(i).get("simpleMarker").toString().trim();
				if (StringUtils.isNotEmpty(jsonArr.getJSONObject(i).get("markerSize").toString().trim())) {
					line_markerSize = Float.parseFloat(jsonArr.getJSONObject(i).get("markerSize").toString().trim());
				}
				if (StringUtils.isNotEmpty(jsonArr.getJSONObject(i).get("lineMarkerOffSet").toString().trim())) {
					line_markerOffset = Float
							.parseFloat(jsonArr.getJSONObject(i).get("lineMarkerOffSet").toString().trim());
				}

				if (StringUtils.isNotEmpty(jsonArr.getJSONObject(i).get("outlineWidth").toString().trim())) {
					line_markerOutlineWidth = Float
							.parseFloat(jsonArr.getJSONObject(i).get("outlineWidth").toString().trim());
				}
				line_markerOutlineColor = jsonArr.getJSONObject(i).get("outlineColor").toString().trim();
				line_opacity = Float.parseFloat(jsonArr.getJSONObject(i).get("opacity").toString().trim()) / 100;

				if (jsonArr.getJSONObject(i).get("elseFlag").toString().trim().equals("true")) {
					lineElseFlag = true;
				} else {
					lineElseFlag = false;
				}

				if (jsonArr.getJSONObject(i).has("uncheckedFlg")) {
					line_uncheckedFlag = true;
				} else {
					line_uncheckedFlag = false;
				}
			} else if (marker.equals("5") || marker.equals("6")) { // 단순 폴리곤,이미지 폴리곤

				polygon_labelName = jsonArr.getJSONObject(i).get("labelName").toString().trim();
				polygon_filter = jsonArr.getJSONObject(i).get("filter").toString().trim();
				polygon_simpleMarker = jsonArr.getJSONObject(i).get("simpleMarker").toString().trim();
				polygon_lineType = jsonArr.getJSONObject(i).get("lineType").toString().trim();
				polygon_lineColor = jsonArr.getJSONObject(i).get("lineColor").toString().trim();
				polygon_imagePath = jsonArr.getJSONObject(i).get("imageFilePath").toString().trim();
				polygon_imageFileFormat = jsonArr.getJSONObject(i).get("imageFileFormat").toString().trim();

				if (StringUtils.isNotEmpty(jsonArr.getJSONObject(i).get("lineWidth").toString().trim())) {
					polygon_lineWidth = Float.parseFloat(jsonArr.getJSONObject(i).get("lineWidth").toString().trim());
				}
				polygon_fillColor = jsonArr.getJSONObject(i).get("fillColor").toString().trim();

				if (StringUtils.isNotEmpty(jsonArr.getJSONObject(i).get("imageHeight").toString().trim())) {
					polygon_imageHeight = Float
							.parseFloat(jsonArr.getJSONObject(i).get("imageHeight").toString().trim());
				}

				if (StringUtils.isNotEmpty(jsonArr.getJSONObject(i).get("imageWidth").toString().trim())) {
					polygon_imageWidth = Float.parseFloat(jsonArr.getJSONObject(i).get("imageWidth").toString().trim());
				}

				if (StringUtils.isNotEmpty(jsonArr.getJSONObject(i).get("imageOffsetX").toString().trim())) {
					polygon_imageOffsetX = Float
							.parseFloat(jsonArr.getJSONObject(i).get("imageOffsetX").toString().trim());
				}

				if (StringUtils.isNotEmpty(jsonArr.getJSONObject(i).get("imageOffsetY").toString().trim())) {
					polygon_imageOffsetY = Float
							.parseFloat(jsonArr.getJSONObject(i).get("imageOffsetY").toString().trim());
				}

				if (StringUtils.isNotEmpty(jsonArr.getJSONObject(i).get("opacity").toString().trim())) {
					polygon_opacity = Float.parseFloat(jsonArr.getJSONObject(i).get("opacity").toString().trim()) / 100;
				}

				if (jsonArr.getJSONObject(i).get("elseFlag").toString().trim().equals("true")) {
					polygonElseFlag = true;

				} else {
					polygonElseFlag = false;

				}

				if (jsonArr.getJSONObject(i).has("uncheckedFlg")) {
					polygon_uncheckedFlag = true;
				} else {
					polygon_uncheckedFlag = false;
				}

			} else if (marker.equals("4")) {// 라벨인 경우

				label_color = jsonArr.getJSONObject(i).get("color").toString().trim();
				label_labelName = jsonArr.getJSONObject(i).get("labelName").toString().trim();
				label_rule = jsonArr.getJSONObject(i).get("filter").toString().trim();
				label_Xoffset = StringUtils.isNotEmpty(jsonArr.getJSONObject(i).get("Xoffset").toString().trim())
						? Float.parseFloat(jsonArr.getJSONObject(i).get("Xoffset").toString().trim())
						: 0;
				label_Yoffset = StringUtils.isNotEmpty(jsonArr.getJSONObject(i).get("Yoffset").toString().trim())
						? Float.parseFloat(jsonArr.getJSONObject(i).get("Yoffset").toString().trim())
						: 0;
				label_font_family = jsonArr.getJSONObject(i).get("fontFamily").toString().trim();
				label_buffer_radius = StringUtils.isNotEmpty(jsonArr.getJSONObject(i).get("buffer").toString().trim())
						? Float.parseFloat(jsonArr.getJSONObject(i).get("buffer").toString().trim())
						: 0;
				label_buffer_color = jsonArr.getJSONObject(i).get("bufferColor").toString().trim();
				label_attribute = jsonArr.getJSONObject(i).get("attribute").toString().trim();
				label_fontSize = jsonArr.getJSONObject(i).get("fontSize").toString().trim();
				label_opacity = Float.parseFloat(jsonArr.getJSONObject(i).get("opacity").toString().trim()) / 100;
				label_rotation = Float.parseFloat(jsonArr.getJSONObject(i).get("rotation").toString().trim());

				if (jsonArr.getJSONObject(i).get("elseFlag").toString().trim().equals("true")) {
					labelElseFlag = true;
				} else {
					labelElseFlag = false;
				}

				if (jsonArr.getJSONObject(i).has("uncheckedFlg")) {
					label_uncheckedFlag = true;
				} else {
					label_uncheckedFlag = false;
				}
			}

//				Stroke strokeObj = null;
//				Fill fillObj = null;

			Rule ruleObj = sf.createRule();

			switch (featureType) {

			case "point":
			case "multipoint":
				psym = sf.createPointSymbolizer();
				psym.setUnitOfMeasure(Units.PIXEL); // 단위를 px로 지정

				Graphic graphic = null;

				if (marker.equals("1")) {// 이미지 심볼일 경우
					pointImgFlag = true;
				} else {
					pointImgFlag = false;
				}

				if (marker.equals("4")) {// 라벨이 추가된 경우
					labelFlag = true;
				} else {
					labelFlag = false;
				}

				if (marker.equals("0") || marker.equals("1")) {
					symbolFlag = true;
				} else {
					symbolFlag = false;
				}
				// 심볼인지 확인
				if (symbolFlag) {
					if (point_uncheckedFlag)
						continue;
					if (simpleSymbolFlag && StringUtils.isEmpty(labelName)) { // 단일 심볼

						if (pointImgFlag) { // 포인트 이미지 마커인 경우
							String iconUrl = imagePath;
							ExternalGraphic icon = sf.createExternalGraphic(iconUrl, "image/" + imageFileFormat);
							icon.setURI(iconUrl);

							graphic = sf.createGraphic(new ExternalGraphic[] { icon }, null, null, ff.literal(opacity),
									ff.literal(imageWidth), ff.literal(rotation));

							psym.setGraphic(graphic);
							ruleObj.setName(labelName);
							ruleObj.symbolizers().add(psym);

						} else {// 포인트 심플 마커인 경우

							graphic = sf.createDefaultGraphic();

							Stroke strokeObj = sf.createStroke(ff.literal(Color.decode(stroke)),
									ff.literal(stroke_width), ff.literal(opacity));// 색상,굵기,투명도
							Fill fillObj = sf.createFill(ff.literal(Color.decode(fill)), ff.literal(opacity));

							String wellKnownNameStr = wellKnownName;// 리퀘스트에서 받은 걸로 <<

							Mark markerObj = sf.createMark();
							markerObj.setWellKnownName(ff.literal(wellKnownNameStr));
							markerObj.setFill(fillObj);
							markerObj.setStroke(strokeObj);

							psym.getGraphic().graphicalSymbols().add(markerObj);
							psym.getGraphic().setSize(ff.literal(size));
							psym.getGraphic().setOpacity(ff.literal(opacity));
							psym.getGraphic().setRotation(ff.literal(rotation));

							ruleObj.setName(labelName);
							ruleObj.symbolizers().add(psym);
						}

						ruleList.add(ruleObj);

					} else {
						if (pointElseFlag) {
							ruleObj.setElseFilter(true);
						}
						// 규칙 기반
						if (pointImgFlag) { // 포인트 이미지 마커인 경우
							String iconUrl = imagePath;
							ExternalGraphic icon = sf.createExternalGraphic(iconUrl, "image/" + imageFileFormat);
							icon.setURI(iconUrl);

							graphic = sf.createGraphic(new ExternalGraphic[] { icon }, null, null, ff.literal(opacity),
									ff.literal(imageWidth), ff.literal(rotation));

							psym.setGraphic(graphic);
						} else {// 포인트 심플 마커인 경우

							graphic = sf.createDefaultGraphic();

							Stroke strokeObj = sf.createStroke(ff.literal(Color.decode(stroke)),
									ff.literal(stroke_width), ff.literal(opacity));// 색상,굵기,투명도
							Fill fillObj = sf.createFill(ff.literal(Color.decode(fill)), ff.literal(opacity));

							String wellKnownNameStr = wellKnownName;// 리퀘스트에서 받은 걸로 <<

							Mark markerObj = sf.createMark();
							markerObj.setWellKnownName(ff.literal(wellKnownNameStr));
							markerObj.setFill(fillObj);
							markerObj.setStroke(strokeObj);

							psym.getGraphic().graphicalSymbols().add(markerObj);
							psym.getGraphic().setSize(ff.literal(size));
							psym.getGraphic().setOpacity(ff.literal(opacity));
							psym.getGraphic().setRotation(ff.literal(rotation));
						}

						ruleObj.setName(labelName);
						ruleObj.symbolizers().add(psym);

						// ruleObj.setElseFilter(true);//디폴트

						if(rule.equals("")) {//디폴트
							ruleList.add(0, ruleObj);
						}else {//필터
							ruleObj.setFilter(CQL.toFilter(rule));
							ruleList.add(ruleObj);
						}

					}
				}

				// 라벨 관련
				if (labelFlag) {
					if (label_uncheckedFlag)
						continue;
					if (simpleLabelFlag && StringUtils.isEmpty(label_rule)) {// 단일 라벨

						tsym = sf.createTextSymbolizer();
						tsym.setUnitOfMeasure(Units.PIXEL);// 픽셀 단위
						// tsym.getOptions().put(TextSymbolizer.GROUP_KEY, "true");

						tsym.setLabel(ff.property(label_attribute));

						// getLabel().accept(null, label_attribute);

						Fill fillObj = sf.createFill(ff.literal(Color.decode(label_color)), ff.literal(label_opacity));
						Fill fillhaloObj = sf.createFill(ff.literal(Color.decode(label_buffer_color)),
								ff.literal(label_opacity));
						Halo halo = sf.halo(fillhaloObj, ff.literal(label_buffer_radius));// 색상,반경
						AnchorPoint ancPoint = sf.createAnchorPoint(ff.literal(0.5), ff.literal(0));

						Displacement displacement = sf.createDisplacement(ff.literal(label_Xoffset),
								ff.literal(label_Yoffset));
						// LabelPlacement lbplacement = sf.createPointPlacement(ancPoint, displacement,
						// ff.literal(50));
						LabelPlacement lbplacement = sf.createPointPlacement(ancPoint, displacement,
								ff.literal(label_rotation));

						tsym.setFill(fillObj);
						tsym.setHalo(halo);

						tsym.setLabelPlacement(lbplacement);

						ruleObj.symbolizers().add(tsym);
					} else {// 규칙기반 라벨
						/*
						 * if(labelElseFlag) { ruleObj.setElseFilter(true); }
						 */
						tsym = sf.createTextSymbolizer();
						tsym.setUnitOfMeasure(Units.PIXEL);// 픽셀 단위
						// tsym.getOptions().put(TextSymbolizer.GROUP_KEY, "true");
						Function geomFunc = ff.function("centroid", ff.property("geom"));
						tsym.setGeometry(geomFunc);

						tsym.setLabel(ff.property(label_attribute));

						Fill fillObj = sf.createFill(ff.literal(Color.decode(label_color)), ff.literal(label_opacity));
						Fill fillhaloObj = sf.createFill(ff.literal(Color.decode(label_buffer_color)),
								ff.literal(label_opacity));
						Halo halo = sf.halo(fillhaloObj, ff.literal(label_buffer_radius));// 색상,반경
						AnchorPoint ancPoint = sf.createAnchorPoint(ff.literal(0), ff.literal(0));

						Displacement displacement = sf.createDisplacement(ff.literal(0), ff.literal(0));
						// LabelPlacement lbplacement = sf.createPointPlacement(ancPoint, displacement,
						// ff.literal(50));
						LabelPlacement lbplacement = sf.createPointPlacement(ancPoint, null,
								ff.literal(label_rotation));

						tsym.setFill(fillObj);
						tsym.setHalo(halo);

						tsym.setLabelPlacement(lbplacement);

						if (!label_rule.equals("")) {
							ruleObj.setFilter(CQL.toFilter(label_rule));
						}
						ruleObj.symbolizers().add(tsym);
					}

					if (!label_rule.equals("")) {//일반 필터인 경우
						ruleList.add(ruleObj);
					}else{
						//ruleObj.setElseFilter(true);
						ruleList.add(1,ruleObj);//디폴트 라벨은 최상단 바로 아래
					}
				}

				break;

			case "line":
			case "linestring":
			case "multilinestring":
				lsym = sf.createLineSymbolizer();
				lsym.setUnitOfMeasure(Units.PIXEL);

				if (marker.equals("2")) {// 일반 라인
					lineMakerFlag = false;
				} else if (marker.equals("3")) {// 마커 라인
					lineMakerFlag = true;
				}

				if (marker.equals("4")) {// 라벨이 추가된 경우
					labelFlag = true;
				} else {
					labelFlag = false;
				}
				if (marker.equals("2") || marker.equals("3")) {
					symbolFlag = true;
				} else {
					symbolFlag = false;
				}

				if (symbolFlag) { // 심볼인지 라벨인지 체크
					if (line_uncheckedFlag)
						continue;
					if (simpleSymbolFlag && StringUtils.isEmpty(line_labelName)) {// 단일 라인
						if (lineMakerFlag) {// 마커 라인인 경우

							Fill fillObj = sf.createFill(ff.literal(Color.decode(line_Color)));

							Stroke strokeObj = sf.createStroke(ff.literal(Color.decode(line_markerOutlineColor)),
									ff.literal(line_markerOutlineWidth));// 색상,굵기,투명도

							String wellKnownNameLine = line_simpleMarker;// 리퀘스트에서 받은 걸로 <<

							Mark lineMarker = sf.createMark();
							lineMarker.setWellKnownName(ff.literal(wellKnownNameLine));
							lineMarker.setFill(fillObj);
							lineMarker.setStroke(strokeObj);

							List<GraphicalSymbol> symbols = new ArrayList<>();
							symbols.add(lineMarker);

							// graphicStroke.setSize(ff.literal(line_markerSize));

							// Stroke stroke2 = sf.createStroke(null, null, null, null,null, null,
							// ff.literal(line_markerOffset), null, graphicStroke);
//								Graphic gr2 = sf.createDefaultGraphic();
//								gr2.graphicalSymbols().set(0, lineMarker);
//								gr2.setSize(ff.literal(line_markerSize));

							Graphic graphicStroke = sf.graphicStroke(symbols, null, ff.literal(line_markerSize), null,
									null, null, null, null);

							Stroke dashOffsetStroke = sf.createStroke(null, null, null, null, null,
									new float[] { line_markerSize, line_markerOffset }, null, null, graphicStroke);
							dashOffsetStroke.setColor(null);
							dashOffsetStroke.setWidth(null);

							lsym.setStroke(dashOffsetStroke);

						} else { // 심플라인인 경우
							Fill fillObj = sf.createFill(ff.literal(Color.decode(line_Color)),
									ff.literal(line_opacity));
							float[] lineStyle = null;
							if (line_Type.equals("0")) {// 실선
								lineStyle = new float[] { line_StrokeWidth, 0 };
							} else if (line_Type.equals("1")) {// 쇄선
								lineStyle = new float[] { line_StrokeWidth, line_StrokeWidth * 0.5f };
							} else if (line_Type.equals("2")) {// 점선
								lineStyle = new float[] { line_StrokeWidth, line_StrokeWidth * 1.5f };
							} else if (line_Type.equals("3")) {// 팬 없음
								lineStyle = null;
							}
							Stroke strokeObj = null;

							if (line_Type.equals("2")) { // 점선일 경우 라인캡 round로
								strokeObj = sf.createStroke(ff.literal(line_Color), ff.literal(line_StrokeWidth),
										ff.literal(line_opacity), null, ff.literal("round"), lineStyle, null, null,
										null);
							} else {
								strokeObj = sf.createStroke(ff.literal(line_Color), ff.literal(line_StrokeWidth),
										ff.literal(line_opacity), null, null, lineStyle, null, null, null);
							}

							lsym.setStroke(strokeObj);
							lsym.setPerpendicularOffset(ff.literal(line_Offset));

						}
						ruleObj.setName(line_labelName);
						ruleObj.symbolizers().add(lsym);
						ruleList.add(ruleObj);

					} else {// 규칙기반 라인
						/*
						 * if(lineElseFlag) { ruleObj.setElseFilter(true); }
						 */
						if (lineMakerFlag) {// 마커 라인인 경우

							Fill fillObj = sf.createFill(ff.literal(Color.decode(line_Color)));

							Stroke strokeObj = sf.createStroke(ff.literal(Color.decode(line_markerOutlineColor)),
									ff.literal(line_markerOutlineWidth));// 색상,굵기,투명도

							String wellKnownNameLine = line_simpleMarker;// 리퀘스트에서 받은 걸로 <<

							Mark lineMarker = sf.createMark();
							lineMarker.setWellKnownName(ff.literal(wellKnownNameLine));
							lineMarker.setFill(fillObj);
							lineMarker.setStroke(strokeObj);

							List<GraphicalSymbol> symbols = new ArrayList<>();
							symbols.add(lineMarker);

							// graphicStroke.setSize(ff.literal(line_markerSize));

							// Stroke stroke2 = sf.createStroke(null, null, null, null,null, null,
							// ff.literal(line_markerOffset), null, graphicStroke);
//								Graphic gr2 = sf.createDefaultGraphic();
//								gr2.graphicalSymbols().set(0, lineMarker);
//								gr2.setSize(ff.literal(line_markerSize));

							Graphic graphicStroke = sf.graphicStroke(symbols, null, ff.literal(line_markerSize), null,
									null, null, null, null);

							Stroke dashOffsetStroke = sf.createStroke(null, null, null, null, null,
									new float[] { line_markerSize, line_markerOffset }, null, null, graphicStroke);
							dashOffsetStroke.setColor(null);
							dashOffsetStroke.setWidth(null);

							lsym.setStroke(dashOffsetStroke);

						} else { // 심플라인인 경우
							Fill fillObj = sf.createFill(ff.literal(Color.decode(line_Color)),
									ff.literal(line_opacity));
							float[] lineStyle = null;
							if (line_Type.equals("0")) {// 실선
								lineStyle = new float[] { line_StrokeWidth, 0 };
							} else if (line_Type.equals("1")) {// 쇄선
								lineStyle = new float[] { line_StrokeWidth, line_StrokeWidth * 0.5f };
							} else if (line_Type.equals("2")) {// 점선
								lineStyle = new float[] { line_StrokeWidth, line_StrokeWidth * 1.5f };
							} else if (line_Type.equals("3")) {// 팬 없음
								lineStyle = null;
							}
							Stroke strokeObj = null;

							if (line_Type.equals("2")) { // 점선일 경우 라인캡 round로
								strokeObj = sf.createStroke(ff.literal(line_Color), ff.literal(line_StrokeWidth),
										ff.literal(line_opacity), null, ff.literal("round"), lineStyle, null, null,
										null);
							} else {
								strokeObj = sf.createStroke(ff.literal(line_Color), ff.literal(line_StrokeWidth),
										ff.literal(line_opacity), null, null, lineStyle, null, null, null);
							}

							lsym.setStroke(strokeObj);
							lsym.setPerpendicularOffset(ff.literal(line_Offset));

						}

						ruleObj.setName(line_labelName);
						ruleObj.symbolizers().add(lsym);
						
						if(line_filter.equals("")) {//디폴트
							ruleList.add(0, ruleObj);
						}else {//필터
							ruleObj.setFilter(CQL.toFilter(line_filter));
							ruleList.add(ruleObj);
						}
					}
				}

				// 라벨 관련
				if (labelFlag) {
					if (label_uncheckedFlag)
						continue;
					if (simpleLabelFlag && StringUtils.isEmpty(label_rule)) {// 단일 라벨
						tsym = sf.createTextSymbolizer();
						tsym.setUnitOfMeasure(Units.PIXEL);// 픽셀 단위
						// tsym.getOptions().put(TextSymbolizer.GROUP_KEY, "true");

						tsym.setLabel(ff.property(label_attribute));

						// getLabel().accept(null, label_attribute);

						Fill fillObj = sf.createFill(ff.literal(Color.decode(label_color)), ff.literal(label_opacity));
						Fill fillhaloObj = sf.createFill(ff.literal(Color.decode(label_buffer_color)),
								ff.literal(label_opacity));
						Halo halo = sf.halo(fillhaloObj, ff.literal(label_buffer_radius));// 색상,반경
						AnchorPoint ancPoint = sf.createAnchorPoint(ff.literal(0.5), ff.literal(0));

						Displacement displacement = sf.createDisplacement(ff.literal(label_Xoffset),
								ff.literal(label_Yoffset));
						// LabelPlacement lbplacement = sf.createPointPlacement(ancPoint, displacement,
						// ff.literal(50));
						LabelPlacement lbplacement = sf.createPointPlacement(ancPoint, displacement,
								ff.literal(label_rotation));

						tsym.setFill(fillObj);
						tsym.setHalo(halo);

						tsym.setLabelPlacement(lbplacement);

						ruleObj.symbolizers().add(tsym);
					} else {// 규칙기반 라벨
						/*
						 * if(labelElseFlag) { ruleObj.setElseFilter(true); }
						 */
						tsym = sf.createTextSymbolizer();
						tsym.setUnitOfMeasure(Units.PIXEL);// 픽셀 단위
						// tsym.getOptions().put(TextSymbolizer.GROUP_KEY, "true");
						Function geomFunc = ff.function("centroid", ff.property("geom"));
						tsym.setGeometry(geomFunc);
						tsym.setLabel(ff.property(label_attribute));

						Fill fillObj = sf.createFill(ff.literal(Color.decode(label_color)), ff.literal(label_opacity));
						Fill fillhaloObj = sf.createFill(ff.literal(Color.decode(label_buffer_color)),
								ff.literal(label_opacity));
						Halo halo = sf.halo(fillhaloObj, ff.literal(label_buffer_radius));// 색상,반경
						AnchorPoint ancPoint = sf.createAnchorPoint(ff.literal(0), ff.literal(0));

						Displacement displacement = sf.createDisplacement(ff.literal(0), ff.literal(0));
						// LabelPlacement lbplacement = sf.createPointPlacement(ancPoint, displacement,
						// ff.literal(50));
						LabelPlacement lbplacement = sf.createPointPlacement(ancPoint, null,
								ff.literal(label_rotation));

						tsym.setFill(fillObj);
						tsym.setHalo(halo);

						tsym.setLabelPlacement(lbplacement);

						if (!label_rule.equals("")) {
							ruleObj.setFilter(CQL.toFilter(label_rule));
						}
						ruleObj.symbolizers().add(tsym);
					}
					
					if (!label_rule.equals("")) {
						ruleList.add(ruleObj);
					}else{
						//ruleObj.setElseFilter(true);
						ruleList.add(1,ruleObj);//디폴트 라벨은 최상단 바로 아래
					}
				}

				break;

			case "polygon":
			case "multipolygon":

				if (marker.equals("5")) {// 심플 폴리곤
					PolygonImgFlag = false;
				} else if (marker.equals("6")) {// 이미지 폴리곤
					PolygonImgFlag = true;
				}

				if (marker.equals("4")) {// 라벨이 추가된 경우
					labelFlag = true;
				} else {
					labelFlag = false;
				}

				if (marker.equals("5") || marker.equals("6")) {
					symbolFlag = true;
				} else {
					symbolFlag = false;
				}

				// 폴리곤
				if (symbolFlag) {
					if (polygon_uncheckedFlag)
						continue;
					if (simpleSymbolFlag && StringUtils.isEmpty(polygon_labelName)) { // 단일 심볼
						if (PolygonImgFlag) { // 이미지 폴리곤
							polysym = sf.createPolygonSymbolizer();

							// flag visble all, legend
							// true
							// defalut style

							polysym.setUnitOfMeasure(Units.PIXEL);
							String iconUrl = polygon_imagePath;
							ExternalGraphic icon = sf.createExternalGraphic(iconUrl,
									"image/" + polygon_imageFileFormat);
							icon.setURI(iconUrl);
							Graphic polygonGraphic = null;

							polygonGraphic = sf.createGraphic(new ExternalGraphic[] { icon }, null, null,
									ff.literal(polygon_opacity), ff.literal(polygon_imageWidth), null);
							Fill polyFill = sf.createFill(null);
							polyFill.setGraphicFill(polygonGraphic);
							polysym.setFill(polyFill);
						} else { // 심플 폴리곤
							polysym = sf.createPolygonSymbolizer();
							polysym.setUnitOfMeasure(Units.PIXEL);

							Fill simple_poly_fill = sf.createFill(ff.literal(polygon_fillColor),
									ff.literal(polygon_opacity));
							Stroke simple_poly_stroke = null;

							float[] polyLineStyle = null;

							if (polygon_lineType.equals("3")) {// 팬 없음
								polyLineStyle = null;
							} else if (polygon_lineType.equals("0")) { // 외곽선 실선
								polyLineStyle = new float[] { polygon_lineWidth, 0 };
							} else if (polygon_lineType.equals("1")) { // 외곽선 쇄선
								polyLineStyle = new float[] { polygon_lineWidth, polygon_lineWidth * 0.5f };
							} else if (polygon_lineType.equals("2")) { // 외곽선 점선
								polyLineStyle = new float[] { polygon_lineWidth, polygon_lineWidth * 1.5f };
							}

							if (polygon_lineType.equals("2")) { // 점선일 경우 라인캡 round로,linejoin은 bevel로
								simple_poly_stroke = sf.createStroke(ff.literal(polygon_lineColor),
										ff.literal(polygon_lineWidth), null, ff.literal("bevel"), ff.literal("round"),
										polyLineStyle, null, null, null);
							} else if (polygon_lineType.equals("3")) {
								simple_poly_stroke = null;
							} else {
								simple_poly_stroke = sf.createStroke(ff.literal(polygon_lineColor),
										ff.literal(polygon_lineWidth), null, null, null, polyLineStyle, null, null,
										null);
							}

							polysym.setFill(simple_poly_fill);
							polysym.setStroke(simple_poly_stroke);
						}
						ruleObj.setName(polygon_labelName);
						ruleObj.symbolizers().add(polysym);
						ruleList.add(ruleObj);

					} else {// 규칙기반 심볼
						/*
						 * if(polygonElseFlag) { ruleObj.setElseFilter(true); }
						 */
						if (PolygonImgFlag) { // 이미지 폴리곤
							polysym = sf.createPolygonSymbolizer();
							polysym.setUnitOfMeasure(Units.PIXEL);
							String iconUrl = polygon_imagePath;
							ExternalGraphic icon = sf.createExternalGraphic(iconUrl,
									"image/" + polygon_imageFileFormat);
							icon.setURI(iconUrl);
							Graphic polygonGraphic = null;

							polygonGraphic = sf.createGraphic(new ExternalGraphic[] { icon }, null, null,
									ff.literal(polygon_opacity), ff.literal(polygon_imageWidth), null);
							Fill polyFill = sf.createFill(null);
							polyFill.setGraphicFill(polygonGraphic);
							polysym.setFill(polyFill);
						} else { // 심플 폴리곤
							polysym = sf.createPolygonSymbolizer();
							polysym.setUnitOfMeasure(Units.PIXEL);

							Fill simple_poly_fill = sf.createFill(ff.literal(polygon_fillColor),
									ff.literal(polygon_opacity));
							Stroke simple_poly_stroke = null;

							float[] polyLineStyle = null;

							if (polygon_lineType.equals("3")) {// 팬 없음
								polyLineStyle = null;
							} else if (polygon_lineType.equals("0")) { // 외곽선 실선
								polyLineStyle = new float[] { polygon_lineWidth, 0 };
							} else if (polygon_lineType.equals("1")) { // 외곽선 쇄선
								polyLineStyle = new float[] { polygon_lineWidth, polygon_lineWidth * 0.5f };
							} else if (polygon_lineType.equals("2")) { // 외곽선 점선
								polyLineStyle = new float[] { polygon_lineWidth, polygon_lineWidth * 1.5f };
							}

							if (polygon_lineType.equals("2")) { // 점선일 경우 라인캡 round로,linejoin은 bevel로
								simple_poly_stroke = sf.createStroke(ff.literal(polygon_lineColor),
										ff.literal(polygon_lineWidth), null, ff.literal("bevel"), ff.literal("round"),
										polyLineStyle, null, null, null);
							} else if (polygon_lineType.equals("3")) {
								simple_poly_stroke = null;
							} else {
								simple_poly_stroke = sf.createStroke(ff.literal(polygon_lineColor),
										ff.literal(polygon_lineWidth), null, null, null, polyLineStyle, null, null,
										null);
							}

							polysym.setFill(simple_poly_fill);
							polysym.setStroke(simple_poly_stroke);
						}
						ruleObj.setName(polygon_labelName);
						ruleObj.symbolizers().add(polysym);
						
						if(polygon_filter.equals("")) {//디폴트							
							ruleList.add(0, ruleObj);
						}else {//필터
							ruleObj.setFilter(CQL.toFilter(polygon_filter));
							ruleList.add(ruleObj);
						}
					}

				}

				// 라벨 관련
				if (labelFlag) {
					if (label_uncheckedFlag)
						continue;
					if (simpleLabelFlag && StringUtils.isEmpty(label_rule)) {// 단일 라벨
						tsym = sf.createTextSymbolizer();
						tsym.setUnitOfMeasure(Units.PIXEL);// 픽셀 단위
						// tsym.getOptions().put(TextSymbolizer.GROUP_KEY, "true");
						tsym.setLabel(ff.property(label_attribute));

						// getLabel().accept(null, label_attribute);

						Fill fillObj = sf.createFill(ff.literal(Color.decode(label_color)), ff.literal(label_opacity));
						Fill fillhaloObj = sf.createFill(ff.literal(Color.decode(label_buffer_color)),
								ff.literal(label_opacity));
						Halo halo = sf.halo(fillhaloObj, ff.literal(label_buffer_radius));// 색상,반경
						AnchorPoint ancPoint = sf.createAnchorPoint(ff.literal(0.5), ff.literal(0));

						Displacement displacement = sf.createDisplacement(ff.literal(label_Xoffset),
								ff.literal(label_Yoffset));
						// LabelPlacement lbplacement = sf.createPointPlacement(ancPoint, displacement,
						// ff.literal(50));
						LabelPlacement lbplacement = sf.createPointPlacement(ancPoint, displacement,
								ff.literal(label_rotation));

						tsym.setFill(fillObj);
						tsym.setHalo(halo);

						tsym.setLabelPlacement(lbplacement);

						ruleObj.symbolizers().add(tsym);
					} else {// 규칙기반 라벨
						/*
						 * if(labelElseFlag) { ruleObj.setElseFilter(true); }
						 */
						tsym = sf.createTextSymbolizer();
						tsym.setUnitOfMeasure(Units.PIXEL);// 픽셀 단위
						// tsym.getOptions().put(TextSymbolizer.GROUP_KEY, "true");
						Function geomFunc = ff.function("centroid", ff.property("geom"));
						tsym.setGeometry(geomFunc);
						tsym.setLabel(ff.property(label_attribute));

						Fill fillObj = sf.createFill(ff.literal(Color.decode(label_color)), ff.literal(label_opacity));
						Fill fillhaloObj = sf.createFill(ff.literal(Color.decode(label_buffer_color)),
								ff.literal(label_opacity));
						Halo halo = sf.halo(fillhaloObj, ff.literal(label_buffer_radius));// 색상,반경
						AnchorPoint ancPoint = sf.createAnchorPoint(ff.literal(0), ff.literal(0));

						Displacement displacement = sf.createDisplacement(ff.literal(0), ff.literal(0));
						// LabelPlacement lbplacement = sf.createPointPlacement(ancPoint, displacement,
						// ff.literal(50));
						LabelPlacement lbplacement = sf.createPointPlacement(ancPoint, null,
								ff.literal(label_rotation));

						tsym.setFill(fillObj);
						tsym.setHalo(halo);

						tsym.setLabelPlacement(lbplacement);
						
						
						if (!label_rule.equals("")) {
							ruleObj.setFilter(CQL.toFilter(label_rule));
						}
						ruleObj.symbolizers().add(tsym);
					}
					if (!label_rule.equals("")) {
						ruleList.add(ruleObj);
					}else{
						//ruleObj.setElseFilter(true);
						ruleList.add(1,ruleObj);
					}
					
				}

				break;
			}
			// end of switch

			// 라벨 관련

			/*
			 * if (labelFlag) { // 라벨이 체크되어있으면 체크 tsym = sf.createTextSymbolizer();
			 * 
			 * Halo halo = sf.halo(fillObj, ff.literal(0.5));// 색상,반경 AnchorPoint ancPoint =
			 * sf.createAnchorPoint(ff.literal(0), ff.literal(30));
			 * 
			 * Displacement displacement = sf.createDisplacement(ff.literal(0),
			 * ff.literal(30)); LabelPlacement lbplacement =
			 * sf.createPointPlacement(ancPoint, displacement, ff.literal(50));
			 * 
			 * tsym.setFill(fillObj); tsym.setHalo(halo);
			 * tsym.setLabelPlacement(lbplacement); ruleObj.symbolizers().add(tsym); }
			 */

		} // for문 마지막

		FeatureTypeStyle fts = sf.createFeatureTypeStyle();
		// 디폴트 스타일 플래그

		/*
		 * //디폴트 라벨을 넣기위해서는 속성을 정해줘야하는데 알 수 없음. if(labelDefaultFlag) { TextSymbolizer
		 * tsym2 = sf.createTextSymbolizer(); tsym2.setUnitOfMeasure(Units.PIXEL);// 픽셀
		 * 단위 // tsym.getOptions().put(TextSymbolizer.GROUP_KEY, "true");
		 * tsym2.setLabel(ff.property(label_attribute));
		 * 
		 * // getLabel().accept(null, label_attribute);
		 * 
		 * Fill fillObj = sf.createFill(ff.literal(Color.decode(label_color)),
		 * ff.literal(label_opacity)); Fill fillhaloObj =
		 * sf.createFill(ff.literal(Color.decode(label_buffer_color)),
		 * ff.literal(label_opacity)); Halo halo = sf.halo(fillhaloObj,
		 * ff.literal(label_buffer_radius));// 색상,반경 AnchorPoint ancPoint =
		 * sf.createAnchorPoint(ff.literal(0.5), ff.literal(0));
		 * 
		 * Displacement displacement = sf.createDisplacement(ff.literal(label_Xoffset),
		 * ff.literal(label_Yoffset)); // LabelPlacement lbplacement =
		 * sf.createPointPlacement(ancPoint, displacement, // ff.literal(50));
		 * LabelPlacement lbplacement = sf.createPointPlacement(ancPoint, displacement,
		 * ff.literal(label_rotation));
		 * 
		 * tsym.setFill(fillObj); tsym.setHalo(halo);
		 * 
		 * tsym.setLabelPlacement(lbplacement);
		 * 
		 * ruleObj.symbolizers().add(tsym); }
		 */

		// 기본 디폴트 스타일 추가 끝

		if (ruleList.size() > 0) {
			for (Rule rule : ruleList) {
				fts.rules().add(rule);
			}
		}

		Style style = sf.createStyle();

		StyledLayerDescriptor sld = sf.createStyledLayerDescriptor();

		NamedLayer nl = sf.createNamedLayer();
		// nl.setName("test");

		// style.setName("피처타입네임 이름");
		style.featureTypeStyles().add(fts);

		nl.addStyle(style);// namedlayer

		sld.setName("SLD 레이어 이름");
		sld.setStyledLayers(new StyledLayer[] { nl });

		sldXml = printSLD(sld);
		return sldXml;

	}

	@SuppressWarnings("unused")
	public void printStyle(Style style) throws TransformerException { // style - > style 객체를 xml로 바꿔서 콘솔에 출력

		// ByteArrayOutputStream bos = new ByteArrayOutputStream();
		SLDTransformer transformer = new SLDTransformer();
		transformer.setIndentation(2);
		transformer.transform(style, System.out);
		// String styleStr = bos.toString();
		// System.out.println(styleStr);
	}

	@SuppressWarnings("unused")
	public String printSLD(StyledLayerDescriptor sld) { // sld - >sld 객체를 xml로 바꿔서 콘솔에 출력
		ByteArrayOutputStream bos = null;
		try {
			bos = new ByteArrayOutputStream();
			SLDTransformer transformer = new SLDTransformer();
			transformer.setIndentation(2);
			transformer.transform(sld, bos);
			
		}  catch (TransformerException e1) {
			logger.error("printSLD Error-TransformerException");
		} finally {
			try{
				if(bos != null) bos.close();
			} catch (IOException e) {
				logger.error("printSLD Error-IOException");
			}
		}

		return bos.toString();
	}

	/*
	 * public StyledLayerDescriptor convertSLDIntoStyledLayerDescriptor(String
	 * sld_xml) {
	 * 
	 * StyledLayerDescriptor return null; }
	 */

}