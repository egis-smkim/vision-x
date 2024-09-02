package com.vision_x.vision_x.utils;

import java.awt.Color;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.Rectangle;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;
import java.awt.image.ImageObserver;
import java.awt.image.Raster;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.RandomAccessFile;
import java.io.Reader;
import java.io.StringReader;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.ByteOrder;
import java.nio.MappedByteBuffer;
import java.nio.channels.WritableByteChannel;
import java.nio.channels.FileChannel.MapMode;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.nio.file.attribute.PosixFilePermission;
import java.nio.file.attribute.PosixFilePermissions;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.imageio.ImageIO;
import javax.imageio.stream.ImageOutputStream;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.NullArgumentException;
import org.geotools.coverage.grid.GridCoverage2D;
import org.geotools.coverage.grid.io.AbstractGridFormat;
import org.geotools.coverage.grid.io.GridCoverage2DReader;
import org.geotools.coverage.grid.io.GridFormatFinder;
import org.geotools.coverage.processing.CoverageProcessor;
import org.geotools.coverage.processing.Operations;
import org.geotools.data.DataSourceException;
import org.geotools.data.FeatureSource;
import org.geotools.data.collection.ListFeatureCollection;
import org.geotools.data.shapefile.ShapefileDataStore;
import org.geotools.data.shapefile.dbf.DbaseFileHeader;
import org.geotools.data.shapefile.dbf.DbaseFileReader;
import org.geotools.data.shapefile.dbf.DbaseFileWriter;
import org.geotools.data.shapefile.dbf.DbaseFileReader.Row;
import org.geotools.data.shapefile.files.ShpFiles;
import org.geotools.data.shapefile.shp.ShapefileReader;
import org.geotools.data.shapefile.shp.ShapefileReader.Record;
import org.geotools.data.simple.SimpleFeatureCollection;
import org.geotools.feature.DefaultFeatureCollection;
import org.geotools.feature.FeatureCollection;
import org.geotools.feature.simple.SimpleFeatureBuilder;
import org.geotools.feature.simple.SimpleFeatureTypeBuilder;
import org.geotools.gce.geotiff.GeoTiffFormat;
import org.geotools.gce.geotiff.GeoTiffReader;
import org.geotools.geojson.feature.FeatureJSON;
import org.geotools.geojson.geom.GeometryJSON;
import org.geotools.geometry.Envelope2D;
import org.geotools.geometry.jts.JTS;
import org.geotools.geometry.jts.JTSFactoryFinder;
import org.geotools.geometry.jts.LiteCoordinateSequence;
import org.geotools.geometry.jts.ReferencedEnvelope;
import org.geotools.geometry.jts.WKBReader;
import org.geotools.map.FeatureLayer;
import org.geotools.map.Layer;
import org.geotools.map.MapContent;
import org.geotools.referencing.CRS;
import org.geotools.referencing.crs.DefaultGeographicCRS;
import org.geotools.renderer.GTRenderer;
import org.geotools.renderer.label.LabelCacheImpl;
import org.geotools.renderer.lite.StreamingRenderer;
import org.geotools.styling.Font;
import org.geotools.styling.LabelPlacement;
import org.geotools.styling.LineSymbolizer;
import org.geotools.styling.PolygonSymbolizer;
import org.geotools.styling.Rule;
import org.geotools.styling.SLD;
import org.geotools.styling.Style;
import org.geotools.styling.StyleBuilder;
import org.geotools.styling.TextSymbolizer;
import org.geotools.tile.TileService;
import org.geotools.tile.impl.osm.OSMService;
import org.geotools.tile.util.TileLayer;
import org.geotools.util.factory.Hints;
import org.json.JSONArray;
import org.json.JSONObject;
import org.json.JSONTokener;
import org.json.simple.parser.JSONParser;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.CoordinateXY;
import org.locationtech.jts.geom.Envelope;
import org.locationtech.jts.geom.Geometry;
import org.locationtech.jts.geom.GeometryCollection;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.LineString;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.io.ParseException;
import org.locationtech.jts.io.WKBWriter;
import org.locationtech.jts.io.WKTReader;
import org.locationtech.jts.simplify.TopologyPreservingSimplifier;
import org.mozilla.universalchardet.UniversalDetector;
import org.opengis.feature.simple.SimpleFeature;
import org.opengis.feature.simple.SimpleFeatureType;
import org.opengis.filter.Filter;
import org.opengis.geometry.MismatchedDimensionException;
import org.opengis.parameter.ParameterValueGroup;
import org.opengis.referencing.FactoryException;
import org.opengis.referencing.NoSuchAuthorityCodeException;
import org.opengis.referencing.crs.CoordinateReferenceSystem;
import org.opengis.referencing.operation.MathTransform;
import org.opengis.referencing.operation.TransformException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;


@Service
public class GeoToolsService {
	
	protected Logger logger = LoggerFactory.getLogger(this.getClass());
	
	public String makeThumbnailFiles(String type, List<MultipartFile> fileLists,String dir,String uploadFileName) {
		String result="";
		
		if(type.equals("shp")) {
			
			String shpFileName="";
			
			for (int i = 0; i < fileLists.size(); i++) {

				String[] fileInfo = fileLists.get(i).getOriginalFilename().split("\\.");
				String fileExt = fileInfo[1];
				String fileName = this.replaceSpecialCharacter(fileInfo[0]);
				fileName = uploadFileName+ "." + fileExt;
				
				if(fileExt.toLowerCase().equals("shp")) {
					shpFileName=fileName;
				}
				
			}
			
			result=this.makeShpThumbnailImg(dir,shpFileName);
			
		}else if(type.equals("csv")) {
			
		}
		
		return result;
	}
	
	public int getSRSCode(String dir, String fileName) {
		
		int code=0;
		ShapefileDataStore ds=null;
		URL url;
		
		try {
			if(dir != null) dir = dir.replaceAll("\\\\","").replaceAll ("&","");
			if(fileName != null) fileName = fileName.replaceAll("\\\\","").replaceAll ("&","");
			url = new File(dir+fileName).toURI().toURL();
			
			ds = new ShapefileDataStore(url);
			
			SimpleFeatureCollection fc;
			fc = ds.getFeatureSource(ds.getTypeNames()[0]).getFeatures();
			
			if(CRS.lookupEpsgCode(fc.getSchema().getCoordinateReferenceSystem(), true) != null) {
				code = CRS.lookupEpsgCode(fc.getSchema().getCoordinateReferenceSystem(), true);
			}
			
		} catch (MalformedURLException e) {
			logger.error("[ERROR-GTS-001] - MalformedURLException");
		}catch (IOException e) {
			logger.error("[ERROR-GTS-001] - IOException");
		} catch (FactoryException e) {
			logger.error("[ERROR-GTS-001] - Factory Exception");
		}finally {
			
			if(ds != null) {
				ds.dispose();
			}
		}
		
		return code;
	}
	
	public String getGeometyTypeFromShp(String dir,String fileName) {
		
		String result="";
		ShapefileDataStore ds=null;
		
		try {
			if(dir != null) dir = dir.replaceAll("\\\\","").replaceAll ("&","");
			if(fileName != null) fileName = fileName.replaceAll("\\\\","").replaceAll ("&","");
			URL url = new File(dir+fileName).toURI().toURL();
			ds = new ShapefileDataStore(url);
			SimpleFeatureCollection fc = ds.getFeatureSource(ds.getTypeNames()[0]).getFeatures();
			
			result=fc.getSchema().getGeometryDescriptor().getType().getName().toString();
			
		} catch (MalformedURLException e) {
			logger.error("[ERROR-GTS-002] - MalformedURLException");
		} catch (IOException e) {
			logger.error("[ERROR-GTS-002] - IOException");
		}catch (RuntimeException e) {
			result="";
		}finally {
			
			if(ds != null) {
				ds.dispose();
			}
			
		}
		
		return result;
	}
	
	public String getCharcterSet(String dir,String fileName) {
		String result="";
		
		URL url;
		try {
			if(dir != null) dir = dir.replaceAll("\\\\","").replaceAll ("&","");
			if(fileName != null) fileName = fileName.replaceAll("\\\\","").replaceAll ("&","");
			url = new File(dir+fileName).toURI().toURL();
			ShapefileDataStore ds = new ShapefileDataStore(url);
			
			result=ds.getCharset().toString();
			
			if(result.equals("ISO-8859-1")) {
				result="CP949";
			}
		} catch (MalformedURLException e) {
			logger.error("getCharcterSet error - MalformedURLException");
		} catch (Exception e) {
			logger.error("getCharcterSet error");
		}
		return result;
	}
	
	public String getCharcterSet(MultipartFile mf) {
		
		String result="";
		InputStream is = null;
		ShapefileDataStore ds = null;
		try {
			is = mf.getInputStream();
			
			File tempFile = File.createTempFile(String.valueOf(is.hashCode()), ".shp");
			
			URL url = tempFile.toURI().toURL();
			ds = new ShapefileDataStore(url);
			
			result=ds.getCharset().toString();
			
			is.close();
			tempFile.deleteOnExit();
			
		} catch (MalformedURLException e) {
			logger.error("[ERROR-GTS-003] - MalformedURLException");
		} catch (IOException e) {
			logger.error("[ERROR-GTS-003] - IOException");
		}finally {
			
			if(is!=null) {
				try {
					is.close();
				} catch (IOException e) {
					logger.error("[ERROR-GTS-003-01] - IOException");
				}
			}
			
			if(ds != null) {
				ds.dispose();
			}
		}
		
		return result;
	}
	
	public HashMap<String, Double> shpBoundary(String dir, String fileName){
		
		HashMap<String, Double> resultMap = new HashMap<>();
		
		ShapefileDataStore ds=null;
		URL url=null;
		SimpleFeatureCollection fc=null;
		
		try {
			if(dir != null) dir = dir.replaceAll("\\\\","").replaceAll ("&","");
			if(fileName != null) fileName = fileName.replaceAll("\\\\","").replaceAll ("&","");
			url = new File(dir+fileName).toURI().toURL();
			
			ds = new ShapefileDataStore(url);
			fc = ds.getFeatureSource(ds.getTypeNames()[0]).getFeatures();
			
			double minx = fc.getBounds().getMinX();
			double miny = fc.getBounds().getMinY();
			double maxx = fc.getBounds().getMaxX();
			double maxy = fc.getBounds().getMaxY();
			
			resultMap.put("minx", minx);
			resultMap.put("miny", miny);
			resultMap.put("maxx", maxx);
			resultMap.put("maxy", maxy);
			
		} catch (MalformedURLException e1) {
			logger.error("[ERROR-GTS-004] - MalformedURLException");
		}catch (IOException e1) {
			logger.error("[ERROR-GTS-004] - IOException");
		}finally {
			if(ds != null) {
				ds.dispose();
			}
		}
		
		return resultMap;
	}
	
	public HashMap<String, Double> shpFirstGeometry(String dir, String fileName) {
		
		HashMap<String, Double> resultMap = new HashMap<>();
		
		ShapefileDataStore ds=null;
		URL url=null;
		SimpleFeatureCollection fc=null;
		
		try {
			if(dir != null) dir = dir.replaceAll("\\\\","").replaceAll ("&","");
			if(fileName != null) fileName = fileName.replaceAll("\\\\","").replaceAll ("&","");
			url = new File(dir+fileName).toURI().toURL();
			
			ds = new ShapefileDataStore(url);
			fc = ds.getFeatureSource(ds.getTypeNames()[0]).getFeatures();
			
			double minx = fc.getBounds().getMinX();
			double miny = fc.getBounds().getMinY();
			double maxx = fc.getBounds().getMaxX();
			double maxy = fc.getBounds().getMaxY();
			
			resultMap.put("minx", minx);
			resultMap.put("miny", miny);
			resultMap.put("maxx", maxx);
			resultMap.put("maxy", maxy);
			
		} catch (MalformedURLException e1) {
			logger.error("[ERROR-GTS-004] - MalformedURLException");
		}catch (IOException e1) {
			logger.error("[ERROR-GTS-004] - IOException");
		}finally {
			if(ds != null) {
				ds.dispose();
			}
		}
		
		return resultMap;
	}
	
	public HashMap<String, Object> makeShpThumbnailImgAndCheckBound(String dir, String fileName) {
		HashMap<String, Object> resultMap = new HashMap<>();
		
		TileLayer tile_layer=null;
		ShapefileDataStore ds=null;
		MapContent mapContent =null;
		BufferedImage bimage=null;
		ImageOutputStream outputImageFile =null;
		FileOutputStream fos=null;
		Layer layer = null;
		
		try {
			if(dir != null) dir = dir.replaceAll("\\\\","").replaceAll ("&","");
			if(fileName != null) fileName = fileName.replaceAll("\\\\","").replaceAll ("&","");
			URL url = new File(dir+fileName).toURI().toURL();
			ds = new ShapefileDataStore(url);
			SimpleFeatureCollection fc = ds.getFeatureSource(ds.getTypeNames()[0]).getFeatures();
			mapContent = new MapContent();
			mapContent.setTitle("THUMBNAIL");
			
			String geometryType=fc.getSchema().getGeometryDescriptor().getType().getName().toString();
			
			logger.info("geometry:"+geometryType+"   "+dir+fileName);
			
			Style style = null;
			Color outline = new Color(0, 0, 0);
			Color fillColor = new Color(255,255,255);
			
			if(geometryType.equals("MultiPolygon") || geometryType.equals("Polygon")) {
				
				style = SLD.createPolygonStyle(outline, fillColor, 0.3f);
				
				logger.info("style 1:"+style);
				
			}else if(geometryType.equals("MultiPoint") || geometryType.equals("Point")) {
				
				style = SLD.createPointStyle("Circle", outline, fillColor, 1, 10);
				logger.info("style 2:"+style);
				
			}else if(geometryType.equals("MultiLineString") || geometryType.equals("LineString")) {
				
				style = SLD.createLineStyle(outline, 5);
				logger.info("style 3:"+style);
			}
			
			//String baseURL = "http://xdworld.vworld.kr:8080/2d/Base/201802/";
			//TileService service = new OSMService("vworld", baseURL);
			
			String baseURL = "http://tile.openstreetmap.org/";
			TileService service = new OSMService("OSM", baseURL);
			 
			mapContent.setTitle("THUMBNAIL");
			tile_layer = new TileLayer(service);
			
			//String geometryType=fc.getSchema().getGeometryDescriptor().getType().getName().toString();

			String type = ds.getTypeNames()[0];
			
			FeatureSource<SimpleFeatureType, SimpleFeature> source = ds.getFeatureSource(type);
			
			Geometry geometryDim = (Geometry) ds.getFeatureSource().getFeatures().features().next().getDefaultGeometry();
			
			
			LiteCoordinateSequence liteCoordi = new LiteCoordinateSequence(geometryDim.getCoordinates());
			
			int dimension = liteCoordi.getDimension();
			if(dimension==3) {//geometry 타입이 3d일 경우
				layer = new FeatureLayer(get2DFeatures(source), style);
			}else {
				layer = new FeatureLayer(fc, style);
			}
			
			layer.setVisible(true);
			
			mapContent.addLayer(tile_layer);
			mapContent.addLayer(layer);
			
			String imgName = "";
			if(fileName != null) imgName = fileName.split("\\.")[0];
			if(imgName != null) imgName = imgName.replaceAll("\\\\","").replaceAll ("&","");
			File outputFile = new File(dir+imgName+".png");
			
			logger.info("outfile:"+outputFile.getName());
			
			fos = new FileOutputStream(outputFile);
			outputImageFile = ImageIO.createImageOutputStream(fos);
			
			int width = 600;
			
			double minx = fc.getBounds().getMinX();
			double miny = fc.getBounds().getMinY();
			double maxx = fc.getBounds().getMaxX();
			double maxy = fc.getBounds().getMaxY();
			
			resultMap.put("minx", minx);
			resultMap.put("miny", miny);
			resultMap.put("maxx", maxx);
			resultMap.put("maxy", maxy);
			resultMap.put("geometry", geometryType);
			
			
		    double ratioX = maxx - minx;
			double ratioY = maxy - miny;
			    
		    double ratio=0.0;
		    
		    if(ratioX > ratioY) {
		    	ratio = ratioX / ratioY;
		    	
		    	minx = minx + (ratio)*0.01;
		    	miny = miny + 0.01;
		    	
		    }else {
		    	ratio = ratioY / ratioX;
		    }
			
			ReferencedEnvelope bounds = new ReferencedEnvelope(minx-(ratio*1.5), maxx+(ratio*1.5), miny-(ratio*1.5), maxy+(ratio*1.5), fc.getSchema().getCoordinateReferenceSystem());
			
			int height = (int)(width*(bounds.getHeight() / bounds.getWidth()));
			
			bimage = new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB);
			
			Graphics2D g2d = bimage.createGraphics();
			
			mapContent.getViewport().setMatchingAspectRatio(true);
			mapContent.getViewport().setScreenArea(new Rectangle(Math.round(width), Math.round(height)));
			mapContent.getViewport().setBounds(bounds);
			
			g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
			
			Rectangle outputArea = new Rectangle(width, height);
			
			GTRenderer renderer = new StreamingRenderer();
			LabelCacheImpl labelCache = new LabelCacheImpl();
			
			Map<Object, Object> hints = renderer.getRendererHints();
			
			if(hints == null) {
				hints = new HashMap<>();
			}
			
			hints.put(StreamingRenderer.LABEL_CACHE_KEY, labelCache);
			renderer.setRendererHints(hints);
			renderer.setMapContent(mapContent);
			renderer.paint(g2d, outputArea, bounds);
			ImageIO.write(bimage, "png", outputImageFile);
			
	        resultMap.put("THUMB_FILE_NAME", imgName+".png");	
			
		} catch (IOException e) {
			logger.error("[ERROR-GTS-005] - IOException");
		}finally {
			try {
				if(fos != null) fos.close();
				if(bimage != null) bimage.flush();
				if(layer != null) layer.dispose();
				if(tile_layer != null) tile_layer.dispose();
				if(mapContent != null) mapContent.dispose();
				if(ds != null) ds.dispose();
			} catch (IOException e) {
				logger.error("[ERROR-GTS-005] - IOException");
			}
		}
		
		return resultMap;
	}
	
	public String makeShpThumbnailImg(String dir,String fileName) {
		
		String result="";
		String OS = System.getProperty("os.name").toLowerCase();
		if(OS.indexOf("win") < 0) {
			if(dir != null) dir = dir.replaceAll("\\\\","").replaceAll ("&","");
			if(fileName != null) fileName = fileName.replaceAll("\\\\","").replaceAll ("&","");
		}
		File file = new File(dir+fileName);
		
		URL url;
		ShapefileDataStore ds=null;
		Layer layer = null;
		GTRenderer renderer=null;
		Graphics2D g2d =null;
		FileOutputStream fos=null;
		ImageOutputStream outputImageFile=null;
		MapContent mapContent=null;
		BufferedImage bimage=null;
		
		try {
			url = file.toURI().toURL();
			
			ds = new ShapefileDataStore(url);
			SimpleFeatureCollection fc = ds.getFeatureSource(ds.getTypeNames()[0]).getFeatures();
			
			mapContent = new MapContent();
			mapContent.setTitle("THUMBNAIL");
			
			//mapContent.getViewport().setCoordinateReferenceSystem(fc.getSchema().getCoordinateReferenceSystem());
			
			//String baseURL = "http://xdworld.vworld.kr:8080/2d/Base/201802/";
			//TileService service = new OSMService("vworld", baseURL);
			
			String baseURL = "http://tile.openstreetmap.org/";
			TileService service = new OSMService("OSM", baseURL);
			
			TileLayer tile_layer = new TileLayer(service);
			mapContent.addLayer(tile_layer);
			
			String geometryType=fc.getSchema().getGeometryDescriptor().getType().getName().toString();

			String type = ds.getTypeNames()[0];
			FeatureSource<SimpleFeatureType, SimpleFeature> source = ds.getFeatureSource(type);

			logger.info("geometry:"+geometryType+"   "+dir+fileName);
			
			Style style = null;
			Color outline = new Color(0, 0, 255);
			Color fillColor = new Color(255,255,255);
			
			if(geometryType.equals("MultiPolygon") || geometryType.equals("Polygon")) {
				
				style = SLD.createPolygonStyle(outline, fillColor, 0.3f);
				
			}else if(geometryType.equals("MultiPoint") || geometryType.equals("Point")) {
				
				style = SLD.createPointStyle("Circle", outline, fillColor, 1, 10);
				
			}else if(geometryType.equals("MultiLineString") || geometryType.equals("LineString")) {
				
				style = SLD.createLineStyle(outline, 5);
			}
			
			Geometry geometryDim = (Geometry) ds.getFeatureSource().getFeatures().features().next().getDefaultGeometry();
			
			LiteCoordinateSequence liteCoordi = new LiteCoordinateSequence(geometryDim.getCoordinates());
			int dimension = liteCoordi.getDimension();
			
			if(dimension==3) {//geometry 타입이 3d일 경우
				layer = new FeatureLayer(get2DFeatures(source), style);
			}else {
				layer = new FeatureLayer(fc, style);
			}
			
			layer.setVisible(true);
			mapContent.addLayer(layer);
			String imgName = "";
			if(fileName != null) imgName = fileName.split("\\.")[0];
			if(imgName != null) imgName = imgName.replaceAll("\\\\","").replaceAll ("&","");
			File outputFile = new File(dir+imgName+".png");
			
			fos = new FileOutputStream(outputFile);
			outputImageFile = ImageIO.createImageOutputStream(fos);
			
			int width = 600;
			int height = 600;
			
			double minx = fc.getBounds().getMinX();
			double miny = fc.getBounds().getMinY();
			double maxx = fc.getBounds().getMaxX();
			double maxy = fc.getBounds().getMaxY();
			
			ReferencedEnvelope bounds = new ReferencedEnvelope(minx, maxx, miny, maxy, fc.getSchema().getCoordinateReferenceSystem());
			
			if(bounds.getHeight() < 1.0 && bounds.getWidth() < 1.0) {
				bounds.expandBy(0.05);
			}
			
			//int height = (int)(width*(bounds.getHeight() / bounds.getWidth()));
			
			bimage = new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB);
			
			g2d = bimage.createGraphics();
			
			mapContent.getViewport().setMatchingAspectRatio(true);
			mapContent.getViewport().setScreenArea(new Rectangle(Math.round(width), Math.round(height)));
			mapContent.getViewport().setBounds(bounds);
			
			g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
			
			Rectangle outputArea = new Rectangle(width, height);
			
			renderer = new StreamingRenderer();
			LabelCacheImpl labelCache = new LabelCacheImpl();
			
			Map<Object, Object> hints = renderer.getRendererHints();
			
			if(hints == null) {
				hints = new HashMap<>();
			}
			
			hints.put(StreamingRenderer.LABEL_CACHE_KEY, labelCache);
			renderer.setRendererHints(hints);
			renderer.setMapContent(mapContent);
			renderer.paint(g2d, outputArea, bounds);
			ImageIO.write(bimage, "png", outputImageFile);
			
			result = imgName+".png";
			
			if(OS.indexOf("win") < 0) {
				
				Path path = Paths.get(dir+result);
		        Set<PosixFilePermission> posixPermissions = PosixFilePermissions.fromString("rw-rw-rw-");
		        Files.setPosixFilePermissions(path, posixPermissions);
		        
			}
			
			
		} catch (IOException e) {
			logger.error("[ERROR-GTS-006] - IOException");
		}finally {
			
			if(ds !=null) {
				ds.dispose();
			} 
			
			if(layer !=null) {
				layer.dispose();
			} 
			
			if(mapContent != null) {
				mapContent.dispose();
			}
			
			if(bimage != null) {
				bimage.flush();
			}
			
			if(outputImageFile != null) {
				try {
					outputImageFile.close();
				} catch (IOException e) {
					logger.error("[ERROR-GTS-006-01] - IOException");
				}
			} 
			
			if(renderer !=null) {
				renderer.stopRendering();
			} 
			
			if(g2d != null) {
				g2d.dispose();
			} 
			
			if(fos != null) {
				try {
					fos.close();
				} catch (IOException e) {
					logger.error("[ERROR-GTS-006-02] - IOException");
				}
			}
			
		}
	
		return result;
		
	}
	
	public String make3dsShpThumbnailImg(String dir,String fileName,String prjwkt) {
		
		String result="";

		if(dir != null) dir = dir.replaceAll("\\\\","").replaceAll ("&","");
		if(fileName != null) fileName = fileName.replaceAll("\\\\","").replaceAll ("&","");
		File file = new File(dir+fileName);
		
		URL url;
		ShapefileDataStore ds=null;
		Layer layer = null;
		GTRenderer renderer=null;
		Graphics2D g2d =null;
		FileOutputStream fos=null;
		ImageOutputStream outputImageFile=null;
		MapContent mapContent=null;
		BufferedImage bimage=null;
		
		
		try {
			
			CoordinateReferenceSystem crsys = CRS.parseWKT(prjwkt);
			
			url = file.toURI().toURL();
			
			ds = new ShapefileDataStore(url);
			SimpleFeatureCollection fc = ds.getFeatureSource(ds.getTypeNames()[0]).getFeatures();
			ds.forceSchemaCRS(crsys);
			mapContent = new MapContent();
			mapContent.setTitle("THUMBNAIL");
			mapContent.getViewport().setCoordinateReferenceSystem(crsys);
			
			//String baseURL = "http://xdworld.vworld.kr:8080/2d/Base/201802/";
			//TileService service = new OSMService("vworld", baseURL);
			
			String baseURL = "http://tile.openstreetmap.org/";
			TileService service = new OSMService("OSM", baseURL);
			
			TileLayer tile_layer = new TileLayer(service);
			mapContent.addLayer(tile_layer);
			
			String geometryType=fc.getSchema().getGeometryDescriptor().getType().getName().toString();

			String type = ds.getTypeNames()[0];
			FeatureSource<SimpleFeatureType, SimpleFeature> source = ds.getFeatureSource(type);

			logger.info("geometry:"+geometryType+"   "+dir+fileName);
			
			Style style = null;
			Color outline = new Color(0, 0, 255);
			Color fillColor = new Color(255,255,255);
			
			if(geometryType.equals("MultiPolygon") || geometryType.equals("Polygon")) {
				
				style = SLD.createPolygonStyle(outline, fillColor, 0.3f);
				
			}else if(geometryType.equals("MultiPoint") || geometryType.equals("Point")) {
				
				style = SLD.createPointStyle("Circle", outline, fillColor, 1, 10);
				
			}else if(geometryType.equals("MultiLineString") || geometryType.equals("LineString")) {
				
				style = SLD.createLineStyle(outline, 5);
			}
			
			Geometry geometryDim = (Geometry) ds.getFeatureSource().getFeatures().features().next().getDefaultGeometry();
			
			LiteCoordinateSequence liteCoordi = new LiteCoordinateSequence(geometryDim.getCoordinates());
			int dimension = liteCoordi.getDimension();
			
			if(dimension==3) {//geometry 타입이 3d일 경우
				layer = new FeatureLayer(get2DFeatures(source), style);
			}else {
				layer = new FeatureLayer(fc, style);
			}
			
			layer.setVisible(true);
			mapContent.addLayer(layer);
			String imgName = "";
			if(fileName != null) imgName = fileName.split("\\.")[0];
			if(imgName != null) imgName = imgName.replaceAll("\\\\","").replaceAll ("&","");
			File outputFile = new File(dir+imgName+".png");
			
			fos = new FileOutputStream(outputFile);
			outputImageFile = ImageIO.createImageOutputStream(fos);
			
			int width = 600;
			int height = 600;
			
			ReferencedEnvelope bounds = layer.getBounds();
			bounds.expandBy(100);
			
			//int height = (int)(width*(bounds.getHeight() / bounds.getWidth()));
			
			bimage = new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB);
			
			g2d = bimage.createGraphics();
			
			mapContent.getViewport().setMatchingAspectRatio(true);
			mapContent.getViewport().setScreenArea(new Rectangle(Math.round(width), Math.round(height)));
			mapContent.getViewport().setBounds(bounds);
			
			g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
			
			Rectangle outputArea = new Rectangle(width, height);
			
			renderer = new StreamingRenderer();
			LabelCacheImpl labelCache = new LabelCacheImpl();
			
			Map<Object, Object> hints = renderer.getRendererHints();
			
			if(hints == null) {
				hints = new HashMap<>();
			}
			
			
			hints.put(StreamingRenderer.LABEL_CACHE_KEY, labelCache);
			renderer.setRendererHints(hints);
			renderer.setMapContent(mapContent);
			renderer.paint(g2d, outputArea, bounds);
			ImageIO.write(bimage, "png", outputImageFile);
			
			result = imgName+".png";
			
			String OS = System.getProperty("os.name").toLowerCase();
			
			if(OS.indexOf("win") < 0) {
				
				Path path = Paths.get(dir+result);
		        Set<PosixFilePermission> posixPermissions = PosixFilePermissions.fromString("rw-rw-rw-");
		        Files.setPosixFilePermissions(path, posixPermissions);
		        
			}
			
		} catch (IOException e) {
			logger.error("[ERROR-GTS-007] - IOException");
		}catch(FactoryException e){
			logger.error("[ERROR-GTS-007] - FactoryException");
		}finally {
			if(ds !=null) {
				ds.dispose();
			} 
			
			if(layer !=null) {
				layer.dispose();
			} 
			
			if(mapContent != null) {
				mapContent.dispose();
			}
			
			if(bimage != null) {
				bimage.flush();
			}
			
			if(outputImageFile != null) {
				try {
					outputImageFile.close();
				} catch (IOException e) {
					logger.error("[ERROR-GTS-006-01] - IOException");
				}
			} 
			
			if(renderer !=null) {
				renderer.stopRendering();
			} 
			
			if(g2d != null) {
				g2d.dispose();
			} 
			
			if(fos != null) {
				try {
					fos.close();
				} catch (IOException e) {
					logger.error("[ERROR-GTS-006-02] - IOException");
				}
			}
		}
	
		return result;
		
	}
	
	public HashMap<String, Object> makeCsvPointStylethumbnail(String dir, String fileName,HashMap<String, Object> params) {
		
		HashMap<String, Object> result = new HashMap<>();
		
		String src="";
		
		int columnX = Integer.parseInt((String) params.get("COLUMN_X"));
		int columnY = Integer.parseInt((String) params.get("COLUMN_Y"));
		int labelIndx = Integer.parseInt((String) params.get("LABEL_INDEX"));
		
		String colorHex = (String)params.get("COLOR_HEX");
		String epsgWkt = (String)params.get("EPSG_WKT");
		String epsgCode = (String)params.get("EPSG");
		
		File file = new File(dir+fileName);
		CSVParser parseCsv = null;
		MapContent mapContent = null;
		TileLayer tile_layer = null;
		FileOutputStream fos = null;
		ImageOutputStream outputImageFile =null;
		BufferedImage bimage = null;
		Graphics2D g2d = null;
		
		try {
			
			//String checkEncoding = checkCharset(dir+fileName);
			String checkEncoding = (String) params.get("ENCODING");
			
			logger.info("enc:"+checkEncoding);
			
			CSVFormat format = CSVFormat.RFC4180.withHeader().withDelimiter(',');
			parseCsv = CSVParser.parse(new File(dir+fileName), Charset.forName(checkEncoding), format);
			
			List<CSVRecord> records = parseCsv.getRecords();
			List<SimpleFeature> features = new ArrayList<>();
			
			GeometryFactory geometryFactory = JTSFactoryFinder.getGeometryFactory();
	        SimpleFeatureTypeBuilder pointTb = new SimpleFeatureTypeBuilder();
	        
	        pointTb.setName("csvPoints");
	        pointTb.add("point",Point.class);
	        pointTb.add("LABEL",String.class);
	        
	        Style pointStyle;
	        
			Color fillColor = Color.decode(colorHex);
			
			//String baseURL = "http://xdworld.vworld.kr:8080/2d/Base/201802/";
			//TileService service = new OSMService("vworld", baseURL);
			
			String baseURL = "http://tile.openstreetmap.org/";
			TileService service = new OSMService("OSM", baseURL);
			 
			mapContent = new MapContent();
			mapContent.setTitle("THUMBNAIL");
			
			tile_layer = new TileLayer(service);
			
			mapContent.addLayer(tile_layer);
			
			final DefaultFeatureCollection pointCollection = new DefaultFeatureCollection();
			SimpleFeatureBuilder pointFeatureBuilder = new SimpleFeatureBuilder(pointTb.buildFeatureType());
			
			Layer layerPoints;
			ArrayList<Coordinate> coords= new ArrayList<>();
			
			//숫자 유효성 체크
			String matches="[+-]?\\d*(\\.\\d+)?";
			
			int recordSize = records.size();
			
			if(recordSize > 5000) {
				recordSize=1000;
			}
			
	        for(int i=1;i<recordSize;i++) {
				
	        	String lonStr = records.get(i).get(columnX);
				String latStr = records.get(i).get(columnY);
				String label = records.get(i).get(labelIndx);
				
				if(lonStr.matches(matches) && latStr.matches(matches) && label != null && !lonStr.isEmpty() && !latStr.isEmpty() && lonStr!=null && latStr!=null) {
					
					double lon = Double.parseDouble(lonStr);
					double lat = Double.parseDouble(latStr);
					
					
					Point point = geometryFactory.createPoint(new Coordinate(lon, lat));
				    coords.add(new Coordinate(lon, lat));
				    pointFeatureBuilder.add(point);
				    
				    pointFeatureBuilder.set("LABEL", label);
				    SimpleFeature feature = pointFeatureBuilder.buildFeature(null);
				    features.add(feature);
				    pointCollection.add(feature);
					/*if((lat >= -90.000000  && lat <= 90.000000) && (lon >= -180.000000  && lon <= 180.000000)) {
						
						Point point = geometryFactory.createPoint(new Coordinate(lon, lat));
					    coords.add(new Coordinate(lon, lat));
					    pointFeatureBuilder.add(point);
					    
					    pointFeatureBuilder.set("LABEL", label);
					    SimpleFeature feature = pointFeatureBuilder.buildFeature(null);
					    features.add(feature);
					    pointCollection.add(feature);
					    
					}else {
						
						continue;
						
					}*/
				
				}else {
					continue;
				}
				
			}
	        
	        pointStyle = SLD.createPointStyle("Circle", Color.BLACK, fillColor , (float) 0.9, 8);
		    
		    layerPoints = new FeatureLayer(pointCollection, pointStyle);
		    
		    mapContent.addLayer(layerPoints);
	        
			String imgName = fileName.split("\\.")[0];
			
			File outputFile = new File(dir+imgName+".png");
			
			fos = new FileOutputStream(outputFile);
			outputImageFile = ImageIO.createImageOutputStream(fos);
			
			Coordinate[] coordsLine = coords.toArray(new Coordinate[coords.size()]);
		    LineString line = geometryFactory.createLineString(coordsLine);
		    
		    Envelope env = line.getEnvelopeInternal();
		    
		    int width = 600;
		    int height = 600;
		    
		    //int height = (int)(width*(env.getHeight() / env.getWidth()));
		    
		    double minx = env.getMinX();
		    double miny = env.getMinY();
		    double maxx = env.getMaxX();
		    double maxy = env.getMaxY();
		    
		  
		    
		    double ratioX = maxx - minx;
		    double ratioY = maxy - miny;
		    
		    double ratio=0.0;
		    
		    if(ratioX > ratioY) {
		    	ratio = ratioX / ratioY;
		    	
		    	minx = env.getMinX() + (ratio)*0.01;
		    	miny = env.getMinY() + 0.01;
		    	
		    }else {
		    	ratio = ratioY / ratioX;
		    }
		    
		    //ReferencedEnvelope bounds = new ReferencedEnvelope(env.getMinX()-(ratio*0.02), env.getMaxX()+(ratio*0.02), env.getMinY()-(ratio*0.02), env.getMaxY()+(ratio*0.02), DefaultGeographicCRS.WGS84);
		    ReferencedEnvelope bounds = new ReferencedEnvelope(env.getMinX()-(ratio*0.02), env.getMaxX()+(ratio*0.02), env.getMinY()-(ratio*0.02), env.getMaxY()+(ratio*0.02), CRS.parseWKT(epsgWkt));
			
			bimage = new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB);
			g2d = bimage.createGraphics();
			
			mapContent.getViewport().setMatchingAspectRatio(true);
			mapContent.getViewport().setScreenArea(new Rectangle(Math.round(width), Math.round(height)));
			mapContent.getViewport().setBounds(bounds);
			
			g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
			
			Rectangle outputArea = new Rectangle(width, height);
			
			GTRenderer renderer = new StreamingRenderer();
			LabelCacheImpl labelCache = new LabelCacheImpl();
			
			Map<Object, Object> hints = renderer.getRendererHints();
			
			if(hints == null) {
				hints = new HashMap<>();
			}
			
			hints.put(StreamingRenderer.LABEL_CACHE_KEY, labelCache);
			renderer.setRendererHints(hints);
			renderer.setMapContent(mapContent);
			renderer.paint(g2d, outputArea, bounds);
			
			ImageIO.write(bimage, "png", outputImageFile);
			
			src = imgName+".png";
			
			mapContent.dispose();
			
			String OS = System.getProperty("os.name").toLowerCase();
			
			if(OS.indexOf("win") >= 0) {//윈도우-로컬 개발
				logger.info("ENV : WINDOW");
			}else {
				Path path = Paths.get(dir+src);
		        Set<PosixFilePermission> posixPermissions = PosixFilePermissions.fromString("rw-rw-rw-");
		        Files.setPosixFilePermissions(path, posixPermissions);
			}
			
			String wgs84 = "GEOGCS[\"WGS 84\",DATUM[\"WGS_1984\",SPHEROID[\"WGS 84\",6378137,298.257223563,AUTHORITY[\"EPSG\",\"7030\"]],AUTHORITY[\"EPSG\",\"6326\"]],PRIMEM[\"Greenwich\",0,AUTHORITY[\"EPSG\",\"8901\"]],UNIT[\"degree\",0.0174532925199433,AUTHORITY[\"EPSG\",\"9122\"]],AUTHORITY[\"EPSG\",\"4326\"]]";
			HashMap<String, double[]> minMaxWgs84 = transformMinMaxCoordi(new double[] {minx,miny,maxx,maxy}, epsgWkt, wgs84);
	        
	        result.put("MINX",minMaxWgs84.get("MIN")[0]);
	        result.put("MINY",minMaxWgs84.get("MIN")[1]);
	        result.put("MAXX",minMaxWgs84.get("MAX")[0]);
	        result.put("MAXY",minMaxWgs84.get("MAX")[1]);
	        
			/*result.put("MINX",minx);
			result.put("MINY",miny);
			result.put("MAXX",maxx);
			result.put("MAXY",maxy);
			*/
			result.put("IMG_SRC",src);
	        
		} catch (IOException | MismatchedDimensionException | FactoryException e) {
			logger.error("[ERROR-GTS-007] - IOException");
		}finally {
			
			if(parseCsv != null) {
				try {
					parseCsv.close();
				} catch (IOException e) {
					logger.error("[ERROR-GTS-007-01] - IOException");
				}
			}
			
			if(mapContent != null) {
				mapContent.dispose();
			}
			
			if(tile_layer != null) {
				tile_layer.dispose();
			}
			
			if(fos != null) {
				try {
					fos.close();
				} catch (IOException e) {
					logger.error("[ERROR-GTS-007-02] - IOException");
				}
			}
			
			if(outputImageFile != null) {
				try {
					outputImageFile.close();
				} catch (IOException e) {
					logger.error("[ERROR-GTS-007-03] - IOException");
				}
			}
			
			if(g2d != null) {
				g2d.dispose();
			}
		}
		
		return result;
		
	}
	
	public List<String> getDbfHeaderList(String fileDir, String fileName, String encoding){
		
		List<String> result = new ArrayList<>();
		
		FileInputStream fis=null;
		DbaseFileReader dbfReader=null;
		
		try {
			
			fis = new FileInputStream(new File(fileDir+fileName));
			dbfReader = new DbaseFileReader(fis.getChannel(), true,  Charset.forName(encoding));
			
			int colSize = dbfReader.getHeader().getNumFields();
			
			for(int i=0;i<colSize;i++) {
				String header=dbfReader.getHeader().getFieldName(i);
				result.add(header);
			}
			
		} catch (IOException e) {
			logger.error("[ERROR-GTS-008] - IOException");
			return result;
			
		}finally {
			
			if(fis != null) {
				try {
					fis.close();
					
				} catch (IOException e) {
					logger.error("[ERROR-GTS-008-01] - IOException");
				}
			}
			
			if(dbfReader != null) {
				
				try {
					dbfReader.close();
				} catch (IOException e) {
					logger.error("[ERROR-GTS-008-02] - IOException");
				}
				
			}
		}
	
		return result;
		
	}
	
	public HashMap<String, Object> getShpPropertiesInfo(String fileDir, String fileName,String encoding){
		
		HashMap<String, Object> result=new HashMap<>();
		List<Object> list = new ArrayList<>();
		
		int recordCnt = 0;
		FileInputStream fis=null;
		DbaseFileReader dbfReader=null;
		
		try {
			String OS = System.getProperty("os.name").toLowerCase();
			if(OS.indexOf("win") < 0) {
				if(fileDir != null) fileDir = fileDir.replaceAll("\\\\","").replaceAll ("&","");
				if(fileName != null) fileName = fileName.replaceAll("\\\\","").replaceAll ("&","");
			}
			fis = new FileInputStream(new File(fileDir+fileName));
			dbfReader = new DbaseFileReader(fis.getChannel(), true,  Charset.forName(encoding));
			
			recordCnt = dbfReader.getHeader().getNumRecords();
			
			int colSize = dbfReader.getHeader().getNumFields();
			
			String[] headers = new String[colSize];
			
			for(int i=0;i<colSize;i++) {
				headers[i]=dbfReader.getHeader().getFieldName(i);
			}
			
			list.add(headers);
			int indx=0;
			
			while(dbfReader.hasNext()) {
				
				Object[] records = new Object[colSize];
				dbfReader.readEntry(records);
				list.add(records);
				indx++;
				
				if(indx==5) {
					break;
				}
			}
			
		}catch (IOException e) {
			logger.error("[ERROR-GTS-009] - IOException");
			return result;
			
		}finally {
			
			if(fis != null) {
				try {
					fis.close();
					
				} catch (IOException e) {
					logger.error("[ERROR-GTS-009-01] - IOException");
				}
			}
			
			if(dbfReader != null) {
				
				try {
					dbfReader.close();
				} catch (IOException e) {
					logger.error("[ERROR-GTS-009-02] - IOException");
				}
				
			}
		}
		
		result.put("RECORD_CNT",recordCnt);
		result.put("LIST",list);
		
		return result;
	}
	
	public String checkCharset(String fileDir) {
		
		byte[] buf = new byte[4096];
		
		FileInputStream fis=null;
		String encoding = "";
		try {
			fis = new FileInputStream(fileDir);
			
			UniversalDetector detector = new UniversalDetector(null);
			
			int nread;
			while((nread=fis.read(buf))>0 && !detector.isDone()) {
				detector.handleData(buf, 0, nread);
			}
			detector.dataEnd();
			encoding = detector.getDetectedCharset();
			
		} catch (FileNotFoundException e) {
			logger.error("[ERROR-GTS-028] - FileNotFoundException");
		}catch (IOException e) {
			logger.error("[ERROR-GTS-028] - IOException");
		}finally {
			
			if(fis != null) {
				try {
					fis.close();
				} catch (IOException e) {
					logger.error("[ERROR-GTS-028-01] - IOException");
				}
			}
		}
		
		return (encoding !=null ) ? encoding:"no detected";
	}
	
	public String replaceSpecialCharacter(String str) {
		// TODO Auto-generated method stub
		
		String match = "[^\uAC00-\uD7A3xfe0-9a-zA-Z\\s]";
		
		str = str.replaceAll(match, "").trim();
		
		str = str.replaceAll(" ", "");

		//logger.info("str:"+str);

		return str;
	}
	
	public static SimpleFeatureCollection get2DFeatures(FeatureSource<SimpleFeatureType, SimpleFeature> source) throws IOException  {
		//3D geometry 일 경우 2D로 변환하는 작업
		Filter filter = Filter.INCLUDE;
		
		FeatureCollection<SimpleFeatureType, SimpleFeature> collection = source.getFeatures(filter);
		org.geotools.feature.FeatureIterator<SimpleFeature> features = collection.features();
		
		  GeometryFactory gf = new GeometryFactory();
        List<SimpleFeature> newfeatures = new ArrayList<>();
        SimpleFeatureBuilder featureBuilder = new SimpleFeatureBuilder(source.getSchema());
          while (features.hasNext()) {
          	  SimpleFeature feature = features.next();
              Geometry geom = (Geometry) feature.getDefaultGeometry();
              Geometry geom2D = convert2D(geom);
              
			  featureBuilder.add(gf.createGeometry(geom2D));
			  SimpleFeature multiFeature = featureBuilder.buildFeature(null);
              newfeatures.add(multiFeature);
			  
          }
        
        features.close();
          
		return new ListFeatureCollection(source.getSchema(), newfeatures) ;
	}
	
	public static Geometry convert2D(Geometry geometry3D) {
		//실질적으로 3d에서 2d로 변환
		GeometryFactory gf = new GeometryFactory();
		Logger logger = LoggerFactory.getLogger(GeoToolsService.class);
		 
		WKBWriter writer = new WKBWriter(2);
		 
		byte[] binary = writer.write(geometry3D);
		 
		WKBReader reader = new WKBReader(gf);
		
		Geometry geometry2D= null;
		try {
			 geometry2D= reader.read(binary);
		} catch (RuntimeException e) {
			logger.error("convert2D - RuntimeException");
		}
		catch (Exception e) {
			logger.error("convert2D");
		}
		 
		 
		 return geometry2D;
	}
	
	public int getGeoTiffSrsCode(String dir, String fileName) {
		
		File file = new File(dir+fileName);
	
		int code =0;

		try {
			
			GeoTiffReader reader = new GeoTiffReader(file, new Hints(Hints.FORCE_LONGITUDE_FIRST_AXIS_ORDER, Boolean.TRUE));
			code = CRS.lookupEpsgCode(reader.getCoordinateReferenceSystem(), true);
			
		} catch (DataSourceException e) {
			logger.error("[ERROR-GTS-011] - DataSourceException");
		} catch (FactoryException e) {
			logger.error("[ERROR-GTS-011] - FactoryException");
		}
		
		return code;
	}
	public HashMap<String, Object> getImgInfo(String dir,String imgFile,String type,String tfwFile){
		HashMap<String, Object> param = new HashMap<>();
		
		String[] executeCommand = null;
		
		String path = dir+imgFile;
		
		if((path.indexOf("|") != -1) || (path.indexOf("||") != -1) || (path.indexOf("&&") != -1) || (path.indexOf("rm") != -1)) {
			logger.error("사용할 수 없는 명령어입니다.");
			return null;
		}
		
		executeCommand = new String[] {"gdalinfo", "-json","-wkt_format","wkt1", path};

		if(executeCommand[0].indexOf("gdalinfo") == -1) {
			logger.error("사용할 수 없는 명령어입니다.");
			return null;
		}
		
		JSONObject extent = null;
		
		ProcessBuilder processBuilder = new ProcessBuilder(executeCommand);
		
		processBuilder.redirectErrorStream(true);
		
		Process process=null;
		InputStream stderr=null;
		InputStreamReader isr=null;
		BufferedReader br=null;
		BufferedReader tfwBr = null;
		FileReader tfwFr = null;
		
		try {
			process = processBuilder.start();
			stderr = process.getInputStream();
			isr = new InputStreamReader(stderr);
			br = new BufferedReader(isr);
			
			String outLine;
			
			StringBuilder returnValue = new StringBuilder();
			
			while((outLine = br.readLine()) != null) {
				
				returnValue.append(outLine);
			}
			
			process.waitFor();
			
			extent = new JSONObject(returnValue.toString());
			
			String wktStr="";
			
			int band=0;
			
			double minxLon=0.0;
			double minyLat=0.0;
			double maxxLon=0.0;
			double maxyLat=0.0;
			
			long width=0;
			long height=0;
			String compType="png";
			/*
			 * 1.좌표계 wkt
			 * 2.가로 세로
			 * 3.경위도 min,max
			 * 4.min,max
			 * 
			 * */
			if(type.equals("tif")){
			
				if(!extent.isNull("coordinateSystem")) {
					JSONObject wktObj = extent.getJSONObject("coordinateSystem");
					
					if(wktObj != null) {
						wktStr = wktObj.getString("wkt");
					}
				}
				/*JSONObject coordinates = extent.getJSONObject("cornerCoordinates");
				
				JSONArray upperLeft = coordinates.getJSONArray("upperLeft");
				JSONArray lowerRight = coordinates.getJSONArray("lowerRight");
				
				minx = upperLeft.getDouble(0);
				miny = upperLeft.getDouble(1);
				
				maxx = lowerRight.getDouble(0);
				maxy = lowerRight.getDouble(1);
				*/
				if(!extent.isNull("size")) {
					JSONArray sizeObj = extent.getJSONArray("size");
					width = sizeObj.getLong(0);
					height = sizeObj.getLong(1);
				}else {
					width=0;
					height=0;
				}
				
				if(!extent.isNull("wgs84Extent")) {
					JSONObject coordiLonLat = extent.getJSONObject("wgs84Extent");
					
					if(!coordiLonLat.isNull("coordinates")) {
						JSONArray coordArr = coordiLonLat.getJSONArray("coordinates");
						
						minxLon = coordArr.getJSONArray(0).getJSONArray(0).getDouble(0);
						minyLat = coordArr.getJSONArray(0).getJSONArray(0).getDouble(1);
						
						maxxLon = coordArr.getJSONArray(0).getJSONArray(2).getDouble(0);
						maxyLat = coordArr.getJSONArray(0).getJSONArray(2).getDouble(1);
					}else {
						minxLon = 0.0;
						minyLat = 0.0;
						
						maxxLon = 0.0;
						maxyLat = 0.0;
					}
					
					param.put("TRANSFORM","N");
					
				}else {
					
					logger.info("경위도 좌표 없음");
					//tfw 파일 읽어서 처리
					if(!tfwFile.equals("")) {
						logger.info("tfw 파일 있음");
						String tfwPath = dir+tfwFile;
						File tfw = new File(tfwPath);
						List<String> tfwInfo = new ArrayList<>();
						
						if(tfw.exists()) {
							logger.info("tfw 파일 있음2");
							String line=null;
							tfwFr = new FileReader(tfw);
							tfwBr = new BufferedReader(tfwFr);
							
							double standX=0.0;
							double standY=0.0;
									
							double x=0.0;
							double y=0.0;
							
							double ratioX = 0.0;
							double ratioY = 0.0;
							
							double minx =0.0;
							double miny =0.0;
							double maxx =0.0;
							double maxy=0.0;
							
							while((line = tfwBr.readLine()) != null) {

								String strInfo = line.trim();
								
								if(strInfo.matches("[+-]?\\d*(\\.\\d+)?")) {
									tfwInfo.add(strInfo);
								}else {
									//읽을 수 없는 파일
									minxLon = 0.0;
									minyLat = 0.0;
									
									maxxLon = 0.0;
									maxyLat = 0.0;
									break;
								}
							}
							
							standX = Double.parseDouble(tfwInfo.get(4));
							standY = Double.parseDouble(tfwInfo.get(5));
							
							ratioX =  Double.parseDouble(tfwInfo.get(0));
							ratioY =  Double.parseDouble(tfwInfo.get(3));
							
							x = standX + width*ratioX;
							y = standY + height*ratioY;
							
							if(standX > x) {
								maxx = x;
								minx =standX;
							}else {
								minx = standX;
								maxx =x;
							}
							
							if(standY < y) {
								maxy = y;
								miny = standY;
							}else {
								maxy = standY;
								miny = y;
							}
							
							if(wktStr.equals("") ) {
								minxLon = minx;
								minyLat = miny;
								
								maxxLon = maxx;
								maxyLat = maxy;
								
								param.put("TRANSFORM","Y");
								
							}else {
								
								param.put("TRANSFORM","N");
								
							}
						}
						
					}else {
						//even there is no tfw file
						minxLon = 0.0;
						minyLat = 0.0;
						
						maxxLon = 0.0;
						maxyLat = 0.0;
					}
				}
				
				
				JSONObject metadata = extent.getJSONObject("metadata");
				
				if(!metadata.isNull("IMAGE_STRUCTURE")) {
					
					JSONObject imageStructure = metadata.getJSONObject("IMAGE_STRUCTURE");
					
					if(!imageStructure.isEmpty()) {
						
						if(!imageStructure.isNull("COMPRESSION")) {
							String compressionType = imageStructure.getString("COMPRESSION");
							
							if(!compressionType.isEmpty()) {
								compType=compressionType;
							}
						}
					}
				}
				
				if(!extent.isNull("bands")) {
					JSONArray bandObj = extent.getJSONArray("bands");
					band = bandObj.length();	
				}else {
					band=0;
				}
				
			}else if(type.equals("img")) {
				
				if(!extent.isNull("coordinateSystem")) {
					
					JSONObject wktObj = extent.getJSONObject("coordinateSystem");
					
					if(wktObj != null) {
						wktStr = wktObj.getString("wkt");
					}
				}

				JSONArray sizeArr = extent.getJSONArray("size");

				width = sizeArr.getLong(0);
				height = sizeArr.getLong(1);
				
				JSONObject minmaxArr = extent.getJSONObject("cornerCoordinates");
				JSONArray upperLeft = minmaxArr.getJSONArray("upperLeft");
				JSONArray lowerRight = minmaxArr.getJSONArray("lowerRight");
				
				minxLon = upperLeft.getDouble(0);
				minyLat = upperLeft.getDouble(1);
				
				maxxLon = lowerRight.getDouble(0);
				maxyLat = lowerRight.getDouble(1);
				
				JSONArray bandsArr = extent.getJSONArray("bands");
				band=bandsArr.length();
					
			}
			
			param.put("BAND",band);
			param.put("MINX",minxLon);
			param.put("MINY",minyLat);
			param.put("MAXX",maxxLon);
			param.put("MAXY",maxyLat);
			param.put("WIDTH", width);
			param.put("HEIGHT", height);
			param.put("COMPRESS", compType);
			
		
		} catch (IOException e ) {
			logger.error("[ERROR-GTS-010] - IOException");
			return param;
			
		}catch(InterruptedException e){
			logger.error("[ERROR-GTS-010] - InterruptedException");
		} finally {
			
			if(process != null) {
				process.destroy();
			}
			
			if(isr != null) {
				try {
					isr.close();
				} catch (IOException e) {
					logger.error("[ERROR-GTS-010-01] - IOException");
				}
			}
			
			if(stderr != null) {
				try {
					stderr.close();
				} catch (IOException e) {
					logger.error("[ERROR-GTS-010-02] - IOException");
				}
			}
			
			if(br != null) {
				try {
					br.close();
				} catch (IOException e) {
					logger.error("[ERROR-GTS-010-03] - IOException");
				}
			}
			
			if(tfwBr != null) {
				try {
					tfwBr.close();
				} catch (IOException e) {
					logger.error("[ERROR-GTS-010-04] - IOException");
				}
			}
			
		}
		
		return param;
		
	}
	public HashMap<String, Object> getGeoTiffInfo(String dir,String tiffile,String projFile){
		
		HashMap<String, Object> param = new HashMap<>();
		
		File file = new File(dir+tiffile);
		
		logger.info("PROJECTION FILE : "+projFile);
		
		int code =0;
		int band = 0;
		int width=0;
		int height=0;
		
		double maxx=0.0f;
		double maxy=0.0f;
		double minx=0.0f;
		double miny=0.0f;
		
		double centerX=0.0f;
		double centerY=0.0f;
		
		GeoTiffReader reader = null;
		FileReader fr = null;
		try {
			
			reader = new GeoTiffReader(file, new Hints(Hints.FORCE_LONGITUDE_FIRST_AXIS_ORDER, Boolean.TRUE));
			
			if(CRS.lookupEpsgCode(reader.getCoordinateReferenceSystem(), false) != null) {//tif만 있고 좌표계가 없을 경우
				code = CRS.lookupEpsgCode(reader.getCoordinateReferenceSystem(), false);
			}else {
				code =99;
			}
			
			if(code==99 && projFile != null) {//tif,prj가 있을 경우
				//read projection file
				File fileProj = new File(dir+projFile);
				fr = new FileReader(fileProj);
				
				try (BufferedReader br = new BufferedReader(fr)) {
					
					String wktStr="";
					
					String line;
					
					while((line = br.readLine()) != null) {
						wktStr = line;
					}
					
					
					if(CRS.lookupEpsgCode(CRS.parseWKT(wktStr), false) != null) {
						code=CRS.lookupEpsgCode(CRS.parseWKT(wktStr), false);
					}else {
						code=99;
					}
					
				} catch (IOException ie) {
					logger.error("[ERROR-GTS-011] - IOException");
				}
			}
			
			band = reader.read(null).getNumSampleDimensions();
		
			width =reader.getImageLayout().getWidth(null);
			height=reader.getImageLayout().getHeight(null);
			
			maxx=reader.read(null).getEnvelope2D().getMaxX();
			maxy = reader.read(null).getEnvelope2D().getMaxY();
			
			minx = reader.read(null).getEnvelope2D().getMinX();
			miny = reader.read(null).getEnvelope2D().getMinY();
			
			centerX=reader.read(null).getEnvelope2D().getCenterX();
			centerY=reader.read(null).getEnvelope2D().getCenterY();
			
		}catch (FactoryException e) {
			logger.error("[ERROR-GTS-011] - FactoryException");
		}catch (IOException e) {
			logger.error("[ERROR-GTS-011] - IOException");
		}finally {
			if(fr != null) {
				try {
					fr.close();
				} catch (IOException e) {
					logger.error("ERROR - IOException");
				}
			}
			if(reader != null) {
				reader.dispose();
			}
			
		}
		
		param.put("SRS", code);
		param.put("BAND", band);
		param.put("WIDTH", width);
		param.put("HEIGHT", height);
		param.put("MAX_X", maxx);
		param.put("MAX_Y", maxy);
		param.put("MIN_X", minx);
		param.put("MIN_Y", miny);
		param.put("CETNER_X", centerX);
		param.put("CETNER_Y", centerY);
		
		return param;
		
	}
	
	public HashMap<String, Double> getGeoTiffEpsg4326(String dir,String filename,String proj){
		HashMap<String, Double> result = new HashMap<>();
		
		File file = new File(dir+filename);
		GeoTiffReader reader;
		try {
			reader = new GeoTiffReader(file, new Hints(Hints.FORCE_LONGITUDE_FIRST_AXIS_ORDER, Boolean.TRUE));

			double maxx = reader.read(null).getEnvelope2D().getMaxX();
			double maxy = reader.read(null).getEnvelope2D().getMaxY();
			
			double minx = reader.read(null).getEnvelope2D().getMinX();
			double miny = reader.read(null).getEnvelope2D().getMinY();
			
			GeometryFactory geometryFactory = JTSFactoryFinder.getGeometryFactory();
			Coordinate coord = new Coordinate(minx , miny);
			Coordinate coordmax = new Coordinate(maxx , maxy);
			Geometry sourceGeometry = geometryFactory.createPoint(coord);
			Geometry sourceMaxGeometry = geometryFactory.createPoint(coordmax);
	
			MathTransform transform = CRS.findMathTransform(CRS.decode(proj), CRS.decode("EPSG:4326"),true);
			
			Geometry targetGeomery = JTS.transform(sourceGeometry, transform);
			Geometry targetMaxGeomery = JTS.transform(sourceMaxGeometry, transform);
			
			result.put("minx", targetGeomery.getCoordinate().y);
			result.put("miny", targetGeomery.getCoordinate().x);
			
			result.put("maxx",targetMaxGeomery.getCoordinate().y);
			result.put("maxy",targetMaxGeomery.getCoordinate().x);

		} catch (DataSourceException e) {
			logger.error("getGeoTiffEpsg4326 ERROR - DataSourceException");
		} catch (IOException e) {
			logger.error("getGeoTiffEpsg4326 ERROR - IOException");
		} catch (NoSuchAuthorityCodeException e) {
			logger.error("getGeoTiffEpsg4326 ERROR - NoSuchAuthorityCodeException");
		} catch (FactoryException e) {
			logger.error("getGeoTiffEpsg4326 ERROR - FactoryException");
		} catch (MismatchedDimensionException e) {
			logger.error("getGeoTiffEpsg4326 ERROR - MismatchedDimensionException");
		} catch (TransformException e) {
			logger.error("getGeoTiffEpsg4326 ERROR - TransformException");
		} catch (Exception e) {
			logger.error("getGeoTiffEpsg4326 ERROR");
		}
		
		return result;
	}

	public String cpgFileCharset(String dir, String fileName) {
		
		String result="";

		String OS = System.getProperty("os.name").toLowerCase();
		if(OS.indexOf("win") < 0) {
			if(dir != null) dir = dir.replaceAll("\\\\","").replaceAll ("&","");
			if(fileName != null) fileName = fileName.replaceAll("\\\\","").replaceAll ("&","");
		}
		File file = new File(dir+fileName);
		FileInputStream fis=null;
		
		try{
			
			fis = new FileInputStream(file);

			byte[] buf = new byte[6]; 
			fis.read(buf); 
			result = new String(buf);
			
			if(result.equals("")) {
				result="CP949";
			}
			
			//fis.close();
			
		} catch (IOException ie) {
			logger.error("[ERROR-GTS-012] - IOException");
		}finally {
			if(fis != null) {
				try {
					fis.close();
	
				} catch (IOException e) {
					logger.error("[ERROR-GTS-012-01] - IOException");
				}
			}
		}
		
		return result;
	}
	
	public String makeRasterThumbNail(String dir, String fileName) {
		
		String result= "";
		
		File file = new File(dir+fileName);
		
		AbstractGridFormat format = GridFormatFinder.findFormat(file);
		String outputFile = fileName.split("\\.")[0]+".png";
		
		Hints hints = null;
		if(format instanceof GeoTiffFormat) {
			hints = new Hints(Hints.FORCE_LONGITUDE_FIRST_AXIS_ORDER,Boolean.TRUE);
		}
		
		GridCoverage2DReader gridReader = format.getReader(file, hints);
        GridCoverage2D gridCoverage;
		
        try {
			
			gridCoverage = gridReader.read(null);
			Envelope2D coverageEnvelope = gridCoverage.getEnvelope2D();
		        
	        double coverageMinX = coverageEnvelope.getBounds().getMinX();
	        double coverageMaxX = coverageEnvelope.getBounds().getMaxX();
	        double coverageMinY = coverageEnvelope.getBounds().getMinY();
	        double coverageMaxY = coverageEnvelope.getBounds().getMaxY();
					
	        CoordinateReferenceSystem targetCRS = gridCoverage.getCoordinateReferenceSystem();
	        
	        //타일 가로 길이
	        double geographicTileWidth = (coverageMaxX - coverageMinX);
	        //타일 세로 길이
        	double geographicTileHeight = (coverageMaxY - coverageMinY);
        	//레벨별 경로 생성
            File outputLevelDir = new File(dir+outputFile);
	        
            Envelope envelope =getTileEnvelope(coverageMinX,coverageMinY,geographicTileWidth,geographicTileHeight,targetCRS,0,0);

            GridCoverage2D finalCoverage = cropCoverage(gridCoverage, envelope);

            finalCoverage = scaleCoverage(finalCoverage);

            // use the AbstractGridFormat's writer to write out the tile
            File tileFile = new File(dir+outputFile);
            format.getWriter(tileFile).write(finalCoverage, null);
            
            if(tileFile.exists()) {
            	result=outputFile;
            }else {
            	result="NO FILE";
            }

		} catch (IOException e) {
			logger.error("[ERROR-GTS-013] - IOException");
			result="NO FILE";
		}finally {
			
			if(gridReader != null) {
				try {
					gridReader.dispose();
				} catch (IOException e) {
					logger.error("[ERROR-GTS-013-01] - IOException");
				}
			}
		}
		
		return result;
	}
	
	public Envelope getTileEnvelope(
            double coverageMinX,
            double coverageMinY,
            double geographicTileWidth,
            double geographicTileHeight,
            CoordinateReferenceSystem targetCRS,
            int horizontalIndex,
            int verticalIndex) {

	        double envelopeStartX = (horizontalIndex * geographicTileWidth) + coverageMinX;
	        double envelopeEndX = envelopeStartX + geographicTileWidth;
	        double envelopeStartY = (verticalIndex * geographicTileHeight) + coverageMinY;
	        double envelopeEndY = envelopeStartY + geographicTileHeight;

	        return new ReferencedEnvelope(
	                envelopeStartX, envelopeEndX, envelopeStartY, envelopeEndY, targetCRS);
    }
	
	public GridCoverage2D cropCoverage(GridCoverage2D gridCoverage, Envelope envelope) {
	        CoverageProcessor processor = CoverageProcessor.getInstance();

	        // An example of manually creating the operation and parameters we want
	        final ParameterValueGroup param = processor.getOperation("CoverageCrop").getParameters();
	        param.parameter("Source").setValue(gridCoverage);
	        param.parameter("Envelope").setValue(envelope);

	        return (GridCoverage2D) processor.doOperation(param);
	    }
	 
	public GridCoverage2D scaleCoverage(GridCoverage2D coverage) {
	        Operations ops = new Operations(null);
	        coverage =
	                (GridCoverage2D)
	                        ops.scale(coverage, 0.01, 0.01, 0, 0);
	        return coverage;
	    }
	
	
	public List<String> dbfHeaderLists(String dir, String dbfFile, String cpgFileName ){
		
		List<String> result = new ArrayList<>();
		FileInputStream fiscp = null;
		FileInputStream fis = null;
		DbaseFileReader dbfReader = null;
		try {
			File cpgFile = new File(dir+cpgFileName);
			
			String encoding="CP949";
			
			if(cpgFile.exists()) {
				
				fiscp = new FileInputStream(cpgFile);

				byte[] buf = new byte[6]; 
				fiscp.read(buf); 
				
				encoding = new String(buf);
				
			}
			
			fis = new FileInputStream(new File(dir+dbfFile));
			dbfReader = new DbaseFileReader(fis.getChannel(), true, Charset.forName(encoding));
			
			int colSize = dbfReader.getHeader().getNumFields();
			
			for(int i=0;i<colSize;i++) {
				String header=dbfReader.getHeader().getFieldName(i);
				result.add(header);
			}
			
		} catch (FileNotFoundException e) {
			logger.error("[ERROR-GTS-014] - FileNotFoundException");
		} catch (IOException e) {
			logger.error("[ERROR-GTS-014] - IOException");
		}finally {
			try {
				if(fis!=null) fis.close();
				if(fiscp!=null) fiscp.close();
				if(dbfReader!=null) dbfReader.close();
			} catch (IOException e) {
				logger.error("[ERROR-GTS-014-01] - IOException");
			}
		}
		
		return result;
	}
	
	public String getProjectioName(String wktStr) {
		String result = "";
		
		CoordinateReferenceSystem cds;
		try {
			cds = CRS.parseWKT(wktStr);
			
			result = cds.getName().toString();
			
			
		} catch (FactoryException e) {
			logger.error("[ERROR-GTS-015] - FactoryException");
			result="NO";
		}

		return result;
	}
	
	public boolean dbfDataRegExclude(String fileDir,String fileName,String encoding) {
		
		boolean result=false;
		
		String match = "[^\\p{L}\\p{M}\\p{N}\\p{P}\\p{Z}\\p{Cf}\\p{Cs}\\s]";
		String OS = System.getProperty("os.name").toLowerCase();
		if(OS.indexOf("win") < 0) {
			if(fileDir != null) fileDir = fileDir.replaceAll("\\\\","").replaceAll ("&","");
			if(fileName != null) fileName = fileName.replaceAll("\\\\","").replaceAll ("&","");
		}

		File originFile = new File(fileDir+fileName);
		FileInputStream fis=null;
		DbaseFileReader dbfReader=null;
		
		try {
			fis = new FileInputStream(originFile);
			
			dbfReader = new DbaseFileReader(fis.getChannel(), true, Charset.forName(encoding));
			
			int colSize = dbfReader.getHeader().getNumFields();
			
			String[] headers = new String[colSize];
			
			boolean headerCheck = false;
			
			for(int i=0;i<colSize;i++) {
				
				headers[i]=dbfReader.getHeader().getFieldName(i);
				if(headers[i].matches(".*"+match+".*")) {
					headerCheck=true;
				}
				
			}
			
			boolean recordCheck=false;
			
			while(dbfReader.hasNext()) {

				Object[] newRecord = new Object[colSize];
				dbfReader.readEntry(newRecord);
				
				for(int i=0;i<colSize;i++) {
					
					Object value = newRecord[i];
					
					if(value != null && value.getClass().getName().equals("java.lang.String")) {
						String valueStr =String.valueOf(value);
						
						if(valueStr.matches(".*"+match+".*")) {
							recordCheck=true;
						}
					}
					
				}
				
				if(recordCheck) {
					break;
				}
			}
			
			if(headerCheck || recordCheck) {
				result = true;
			}else {
				result = false;
			}
			
		} catch (RuntimeException e) {
			logger.error("[ERROR-GTS-016] - RuntimeException");
		} catch (Exception e) {
			logger.error("[ERROR-GTS-016]");
		}finally {
			if(fis != null) {
				try {
					fis.close();
				} catch (IOException e) {
					logger.error("[ERROR-GTS-016-01] - IOException");
				}
			}
			
			if(dbfReader != null ) {
				try {
					dbfReader.close();
				} catch (IOException e) {
					logger.error("[ERROR-GTS-016-02] - IOException");
				}
			}
		}
		
		return result;
	}
	
	public boolean createRegExcloudeDbfFile(String fileDir, String fileName, String encoding) {
		
		boolean result=false;
		
		String match = "[^\\p{L}\\p{M}\\p{N}\\p{P}\\p{Z}\\p{Cf}\\p{Cs}\\s]";
		String tmpFilename = fileName.split("\\.")[0]+"_tmp.dbf";

		if(fileDir != null) fileDir = fileDir.replaceAll("\\\\","").replaceAll ("&","");
		if(fileName != null) fileName = fileName.replaceAll("\\\\","").replaceAll ("&","");
		if(tmpFilename != null) tmpFilename = tmpFilename.replaceAll("\\\\","").replaceAll ("&","");
		
		String originPath = fileDir+fileName;
		String tmpPath =fileDir+tmpFilename;
		
		File originFile = new File(originPath);
		FileInputStream fis=null;
		DbaseFileReader dbfReader=null;
		FileInputStream fis2 =null;
		FileOutputStream fos =null;
		WritableByteChannel out = null;
		DbaseFileWriter dbfWriter = null;
		DbaseFileReader dbfReaderData =null;
		RandomAccessFile raf =null;
		FileInputStream tmpFis = null;
		FileOutputStream originFos =null;
		
		try {
			fis = new FileInputStream(originFile);
			
			dbfReader = new DbaseFileReader(fis.getChannel(), true, Charset.forName(encoding));
			
			int colSize = dbfReader.getHeader().getNumFields();
			
			String[] headers = new String[colSize];
			
			DbaseFileHeader newHeader = new DbaseFileHeader(Charset.forName(encoding));
			
			for(int i=0;i<colSize;i++) {
				
				headers[i]=dbfReader.getHeader().getFieldName(i);
				
				String header =headers[i].replaceAll(match, "");
				
				char fieldType = dbfReader.getHeader().getFieldType(i);
				int length = dbfReader.getHeader().getFieldLength(i);
				int decimalCnt = dbfReader.getHeader().getFieldDecimalCount(i);
				
				newHeader.addColumn(header, fieldType, length, decimalCnt);
			}
			
			
			fis2 = new FileInputStream(new File(originPath));
			
			File tmp = new File(tmpPath);
			
			fos = new FileOutputStream(tmp);
			
			out = fos.getChannel();
			
			dbfWriter = new DbaseFileWriter(newHeader, out, Charset.forName(encoding));
			
			dbfReaderData = new DbaseFileReader(fis2.getChannel(), true, Charset.forName(encoding));

			int headerSize = dbfReaderData.getHeader().getNumFields();
			
			
			while (dbfReaderData.hasNext()) {
				Object[] newRecord = new Object[headerSize];
				
				dbfReaderData.readEntry(newRecord);
				
				Object[] writeRecord = new Object[headerSize];
				
				for(int i=0;i<headerSize;i++) {
					Object value = newRecord[i];
					
					if(value != null && value.getClass().getName().equals("java.lang.String")) {
						String valueStr =String.valueOf(value);
						value= valueStr.replaceAll(match, "");;
					}
					
					writeRecord[i] = value;
				}
				
				dbfWriter.write(writeRecord);
	        }
			
			if(out.isOpen()) {
				
				raf = new RandomAccessFile(tmp, "rw");
				MappedByteBuffer buffer = raf.getChannel().map(MapMode.READ_WRITE, 4, 4);
				buffer.order(ByteOrder.BIG_ENDIAN).putInt(headerSize);
				
			}
			
			tmpFis = new FileInputStream(tmp);
			originFos = new FileOutputStream(originFile);
			
			IOUtils.copy(tmpFis, originFos);
	        
	        result = true;
	        
		} catch (IOException e) {
			logger.error("[ERROR-GTS-017] - IOException");
		}finally {
			
			if(fis != null) {
				try {
					fis.close();
				} catch (IOException e) {
					logger.error("[ERROR-GTS-017-01] - IOException");
				}
			}
			
			if(dbfReader != null) {
				try {
					dbfReader.close();
				} catch (IOException e) {
					logger.error("[ERROR-GTS-017-02] - IOException");
				}
			}
			
			if(fis2 != null) {
				try {
					fis2.close();
				} catch (IOException e) {
					logger.error("[ERROR-GTS-017-03] - IOException");
				}
			}
			
			if(out != null) {
				try {
					out.close();
				} catch (IOException e) {
					logger.error("[ERROR-GTS-017-04] - IOException");
				}
			}
			
			if(dbfWriter != null) {
				try {
					dbfWriter.close();
				} catch (IOException e) {
					logger.error("[ERROR-GTS-017-05] - IOException");
				}
			}
			
			if(dbfReaderData != null) {
				try {
					dbfReaderData.close();
				} catch (IOException e) {
					logger.error("[ERROR-GTS-017-06] - IOException");
				}
			}
			
			if(raf != null) {
				try {
					raf.close();
				} catch (IOException e) {
					logger.error("[ERROR-GTS-017-07] - IOException");
				}
			}
			
			if(tmpFis != null) {
				try {
					tmpFis.close();
				} catch (IOException e) {
					logger.error("[ERROR-GTS-017-08] - IOException");
				}
			}
			
			if(originFos != null) {
				try {
					originFos.close();
				} catch (IOException e) {
					logger.error("[ERROR-GTS-017-09] - IOException");
				}
			}
		}
        
		return result;
	}
	
	public HashMap<String, double[]> transformMinMaxCoordi(double[] pos,String source,String dest){
		
		HashMap<String, double[]> result = new HashMap<>();
		
		Coordinate min = new Coordinate(pos[0],pos[1]);
		Coordinate max = new Coordinate(pos[2],pos[3]);
		
		Coordinate destMin = new Coordinate();
		Coordinate destMax = new Coordinate();
		
		MathTransform transform=null;
		
		try {
			transform = CRS.findMathTransform(CRS.parseWKT(source), CRS.parseWKT(dest),true);
			
			JTS.transform(min, destMin, transform);
			JTS.transform(max, destMax, transform);
			
			double[] resultMin = {destMin.x,destMin.y};
			double[] resultMax = {destMax.x,destMax.y};
			
			result.put("MIN",resultMin);
			result.put("MAX",resultMax);
			
		} catch (FactoryException e) {
			logger.error("[ERROR-GTS-018] - FactoryException");
			double[] error = {0.0,0.0};
			
			result.put("MIN",error);
			result.put("MAX",error);
			
		}catch(TransformException e) {
			logger.error("[ERROR-GTS-018] - TransformException");
			double[] error = {0.0,0.0};
			
			result.put("MIN",error);
			result.put("MAX",error);
		}
		
		return result;
		
	}
	
	public HashMap<String, double[]> transformMinMaxEpgsCode(double[] pos,String source,String dest){
		
		HashMap<String, double[]> result = new HashMap<>();
		
		Coordinate min = new Coordinate(pos[0],pos[1]);
		Coordinate max = new Coordinate(pos[2],pos[3]);
		
		Coordinate destMin = new Coordinate();
		Coordinate destMax = new Coordinate();
		
		MathTransform transform=null;
		
		try {
			transform = CRS.findMathTransform(CRS.parseWKT(source), CRS.parseWKT(dest),false);
			
			JTS.transform(min, destMin, transform);
			JTS.transform(max, destMax, transform);
			
			double[] resultMin = {destMin.x,destMin.y};
			double[] resultMax = {destMax.x,destMax.y};
			
			result.put("MIN",resultMin);
			result.put("MAX",resultMax);
			
		} catch (FactoryException e) {
			
			logger.error("[ERROR-GTS-018] - FactoryException");
			double[] error = {0.0,0.0};
			
			result.put("MIN",error);
			result.put("MAX",error);
			
		}catch(TransformException e) {
			
			logger.error("[ERROR-GTS-018] - TransformException");
			double[] error = {0.0,0.0};
			
			result.put("MIN",error);
			result.put("MAX",error);
		}
		
		return result;
		
	}
	
	public HashMap<String, double[]> transformCoordi(double[] pos,String source,String dest){
		
		HashMap<String, double[]> result = new HashMap<>();
		
		Coordinate originPos = new Coordinate(pos[0],pos[1]);
		
		Coordinate destPos = new Coordinate();
		
		MathTransform transform=null;
		
		try {
			transform = CRS.findMathTransform(CRS.parseWKT(source), CRS.parseWKT(dest),false);
			
			JTS.transform(originPos, destPos, transform);
			
			double[] resultMin = {destPos.x,destPos.y};
			
			result.put("POS",resultMin);
			
		}catch (FactoryException e) {
			logger.error("[ERROR-GTS-019] - FactoryException");
			double[] error = {0.0,0.0};
			
			result.put("POS",error);
			
		}catch(TransformException e) {
			logger.error("[ERROR-GTS-019] - TransformException");
			double[] error = {0.0,0.0};
			
			result.put("POS",error);
		} 
		
		return result;
		
	}
	
	public String getWktGeometryMapThumb(String wktGeom,String dir,String fileName, String proj,int epsgCode) {
		
		String thumbSrc="";
		
		Style style = null;
		Color outline = new Color(206, 79, 75);
		Color fillColor = new Color(206, 79, 75);
		
		TileLayer tile_layer=null;
		MapContent mapContent =null;
		BufferedImage bimage=null;
		ImageOutputStream outputImageFile =null;
		FileOutputStream fos=null;
		Layer layer = null;
		
		GeometryFactory geometryFactory = JTSFactoryFinder.getGeometryFactory();
		WKTReader reader = new WKTReader(geometryFactory);
		
		try {
			
			Geometry geom = (Geometry)reader.read(wktGeom);
			String geometryType=geom.getGeometryType();
			String proj3857="PROJCS[\"WGS 84 / Pseudo-Mercator\",\r\n" + 
					"    GEOGCS[\"WGS 84\",\r\n" + 
					"        DATUM[\"WGS_1984\",\r\n" + 
					"            SPHEROID[\"WGS 84\",6378137,298.257223563,\r\n" + 
					"                AUTHORITY[\"EPSG\",\"7030\"]],\r\n" + 
					"            AUTHORITY[\"EPSG\",\"6326\"]],\r\n" + 
					"        PRIMEM[\"Greenwich\",0,\r\n" + 
					"            AUTHORITY[\"EPSG\",\"8901\"]],\r\n" + 
					"        UNIT[\"degree\",0.0174532925199433,\r\n" + 
					"            AUTHORITY[\"EPSG\",\"9122\"]],\r\n" + 
					"        AUTHORITY[\"EPSG\",\"4326\"]],\r\n" + 
					"    PROJECTION[\"Mercator_1SP\"],\r\n" + 
					"    PARAMETER[\"central_meridian\",0],\r\n" + 
					"    PARAMETER[\"scale_factor\",1],\r\n" + 
					"    PARAMETER[\"false_easting\",0],\r\n" + 
					"    PARAMETER[\"false_northing\",0],\r\n" + 
					"    UNIT[\"metre\",1,\r\n" + 
					"        AUTHORITY[\"EPSG\",\"9001\"]],\r\n" + 
					"    AXIS[\"X\",EAST],\r\n" + 
					"    AXIS[\"Y\",NORTH],\r\n" + 
					"    EXTENSION[\"PROJ4\",\"+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs\"],\r\n" + 
					"    AUTHORITY[\"EPSG\",\"3857\"]]";
			
			if(epsgCode==4326) {
				String epsg4326="GEOGCS[\"WGS 84\",\r\n" + 
						"    DATUM[\"WGS_1984\",\r\n" + 
						"        SPHEROID[\"WGS 84\",6378137,298.257223563,\r\n" + 
						"            AUTHORITY[\"EPSG\",\"7030\"]],\r\n" + 
						"        AUTHORITY[\"EPSG\",\"6326\"]],\r\n" + 
						"    PRIMEM[\"Greenwich\",0,\r\n" + 
						"        AUTHORITY[\"EPSG\",\"8901\"]],\r\n" + 
						"    UNIT[\"degree\",0.0174532925199433,\r\n" + 
						"        AUTHORITY[\"EPSG\",\"9122\"]],\r\n" + 
						"    AUTHORITY[\"EPSG\",\"4326\"]]";
				//3857좌표변환
				MathTransform transform = CRS.findMathTransform(CRS.parseWKT(epsg4326), CRS.parseWKT(proj3857), false);
				geom=JTS.transform(geom,  transform);
				logger.info(geom.toText());
				proj=proj3857;
			}
			
			StyleBuilder stylebuilder = new StyleBuilder();
			float[] dasharr = {10,5};
			
			if(geometryType.equals("MultiPolygon") || geometryType.equals("Polygon")) {
				
				style = SLD.createPolygonStyle(fillColor, outline,0.1f);
				PolygonSymbolizer polygSymb = stylebuilder.createPolygonSymbolizer(stylebuilder.createStroke(outline, 2.5,dasharr), stylebuilder.createFill(outline, 0.1f));
				Rule rule = stylebuilder.createRule(polygSymb);
				style.featureTypeStyles().get(0).rules().add(rule);
				
				
			}else if(geometryType.equals("MultiPoint") || geometryType.equals("Point")) {
				style = SLD.createPointStyle("Circle", outline, fillColor, 1, 20);
				
			}else if(geometryType.equals("MultiLineString") || geometryType.equals("LineString")) {
				
				style = SLD.createLineStyle(outline, 5);
			}
			
			
			//String baseURL = "http://xdworld.vworld.kr:8080/2d/Base/201802/";
			//TileService service = new OSMService("vworld", baseURL);
			mapContent = new MapContent();
			mapContent.setTitle("THUMBNAIL");
			
			String baseURL = "http://tile.openstreetmap.org/";
			TileService service = new OSMService("OSM", baseURL);
			
			SimpleFeatureTypeBuilder geobuilder = new SimpleFeatureTypeBuilder();
			geobuilder.setName("PCL_BOUNDARY");
			geobuilder.add("type", geom.getClass());
		
			SimpleFeatureBuilder featureBuilder = new SimpleFeatureBuilder(geobuilder.buildFeatureType());
			
			TopologyPreservingSimplifier simplePolygon = new TopologyPreservingSimplifier(geom);
			
			featureBuilder.add(simplePolygon.getResultGeometry());
			
			final DefaultFeatureCollection featureCollection = new DefaultFeatureCollection();
			
			SimpleFeature feature = featureBuilder.buildFeature(null);
			
			featureCollection.add(feature);
			
			tile_layer = new TileLayer(service);
			
			layer = new FeatureLayer(featureCollection, style);
			layer.setVisible(true);
			
			mapContent.getViewport().setCoordinateReferenceSystem(CRS.parseWKT(proj));
			mapContent.addLayer(tile_layer);
			mapContent.addLayer(layer);
			
			String imgName = fileName.split("\\.")[0];

			if(dir != null) dir = dir.replaceAll("\\\\","").replaceAll ("&","");
			if(imgName != null) imgName = imgName.replaceAll("\\\\","").replaceAll ("&","");
			File outputFile = new File(dir+imgName+".png");
			
			logger.info("outfile:"+outputFile.getName());
			
			fos = new FileOutputStream(outputFile);
			outputImageFile = ImageIO.createImageOutputStream(fos);
			
			int width = 600;
			
			double minx = geom.getEnvelopeInternal().getMinX();
			double miny = geom.getEnvelopeInternal().getMinY();
			double maxx = geom.getEnvelopeInternal().getMaxX();
			double maxy = geom.getEnvelopeInternal().getMaxY();
			
		    double ratioX = maxx - minx;
			double ratioY = maxy - miny;
			    
		    double ratio=0.0;
		    
		    if(ratioX > ratioY) {
		    	ratio = ratioX / ratioY;
		    	
		    	minx = minx + (ratio)*0.01;
		    	miny = miny + 0.01;
		    	
		    }else {
		    	ratio = ratioY / ratioX;
		    }
			
		    ReferencedEnvelope bounds =null;
		    if(geometryType.equals("Point")) {
		    	
		    	Geometry pbuffer = geom.buffer(100);
		    	
		    	double bminx = pbuffer.getEnvelopeInternal().getMinX();
				double bminy = pbuffer.getEnvelopeInternal().getMinY();
				double bmaxx = pbuffer.getEnvelopeInternal().getMaxX();
				double bmaxy = pbuffer.getEnvelopeInternal().getMaxY();
				
				bounds = new ReferencedEnvelope(bminx, bmaxx, bminy, bmaxy, CRS.parseWKT(proj));
		    	bounds.expandBy(500);
		    	
		    }else {
		    	bounds = new ReferencedEnvelope(minx-(ratio*1.5), maxx+(ratio*1.5), miny-(ratio*1.5), maxy+(ratio*1.5), CRS.parseWKT(proj));
		    	bounds.expandBy(500);
		    }
			
		    
			int height = (int)(width*(bounds.getHeight() / bounds.getWidth()));
			
			bimage = new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB);
			
			Graphics2D g2d = bimage.createGraphics();
			
			mapContent.getViewport().setMatchingAspectRatio(false);
			mapContent.getViewport().setBounds(bounds);
			mapContent.getViewport().setScreenArea(new Rectangle(Math.round(width), Math.round(height)));

			g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
			
			Rectangle outputArea = new Rectangle(width, height);
			
			GTRenderer renderer = new StreamingRenderer();
			LabelCacheImpl labelCache = new LabelCacheImpl();
			
			Map<Object, Object> hints = renderer.getRendererHints();
			
			if(hints == null) {
				hints = new HashMap<>();
			}
			
			hints.put(StreamingRenderer.LABEL_CACHE_KEY, labelCache);
			renderer.setRendererHints(hints);
			renderer.setMapContent(mapContent);
			renderer.paint(g2d, outputArea, bounds);
			ImageIO.write(bimage, "png", outputImageFile);
		        
	        thumbSrc=imgName+".png";

		} catch (IOException e) {
			thumbSrc="ERROR";
			logger.error("[ERROR-GTS-020] - IOException");
		} catch(MismatchedDimensionException e) {
			thumbSrc="ERROR";
			logger.error("[ERROR-GTS-020] - MismatchedDimensionException");
		} catch(FactoryException e) {
			thumbSrc="ERROR";
			logger.error("[ERROR-GTS-020] - FactoryException");
		} catch (TransformException e) {
			thumbSrc="ERROR";
			logger.error("[ERROR-GTS-020] - TransformException");
		} catch (ParseException e) {
			thumbSrc="ERROR";
			logger.error("[ERROR-GTS-020] - ParseException");
		} catch(Exception e) {
			logger.error("getWktGeometryMapThumb error");
		} finally {
			try {
				if(fos != null) fos.close();
				if(outputImageFile != null) outputImageFile.close();
				if(mapContent !=null) {
					mapContent.dispose();
				}
			} catch (IOException e) {
				logger.error("[ERROR-GTS-020-01] - IOException");
			}
		}
		return thumbSrc;
	}
	
public HashMap<String, Object> getGeometryMapThumb(DefaultFeatureCollection featureCollection,String type,String dir,String fileName, String proj,String colorHex) {
		
		String thumbSrc="";
		
		HashMap<String, Object> result = new HashMap<>();
		
		Style style = null;
		Color outline = new Color(206, 79, 75);
		
		Color fillColor = Color.decode(colorHex);
		
		TileLayer tile_layer=null;
		MapContent mapContent =null;
		BufferedImage bimage=null;
		ImageOutputStream outputImageFile =null;
		FileOutputStream fos=null;
		Layer layer = null;
		
		try {
			
			String geometryType=type;
			
			StyleBuilder stylebuilder = new StyleBuilder();
			float[] dasharr = {10,5};
			
			if(geometryType.equals("MultiPolygon") || geometryType.equals("Polygon")) {
				
				style = SLD.createPolygonStyle(fillColor, outline,0.1f);
				PolygonSymbolizer polygSymb = stylebuilder.createPolygonSymbolizer(stylebuilder.createStroke(outline, 2.5,dasharr), stylebuilder.createFill(outline, 0.1f));
				Rule rule = stylebuilder.createRule(polygSymb);
				style.featureTypeStyles().get(0).rules().add(rule);
				
				logger.info("style 1:"+style);
				
			}else if(geometryType.equals("MultiPoint") || geometryType.equals("Point")) {
				
				//style = SLD.createPointStyle("Circle", outline, fillColor, 1, 10);
				style = SLD.createPointStyle("Circle", Color.BLACK, fillColor , (float) 0.9, 8);
				logger.info("style 2:"+style);
				
			}else if(geometryType.equals("MultiLineString") || geometryType.equals("LineString")) {
				
				style = SLD.createLineStyle(outline, 5);
				logger.info("style 3:"+style);
			}
			
			mapContent = new MapContent();
			mapContent.setTitle("THUMBNAIL");
			
			String baseURL = "http://tile.openstreetmap.org/";
			TileService service = new OSMService("OSM", baseURL);
			
			SimpleFeatureTypeBuilder geobuilder = new SimpleFeatureTypeBuilder();
			geobuilder.setName("CSV_POINT_LIST");
		
			tile_layer = new TileLayer(service);
			
			layer = new FeatureLayer(featureCollection, style);
			
			layer.setVisible(true);
			
			//mapContent.getViewport().setCoordinateReferenceSystem(CRS.decode(proj));
			mapContent.addLayer(tile_layer);
			mapContent.addLayer(layer);
			
			String imgName = fileName.split("\\.")[0];
			
			File outputFile = new File(dir+imgName+".png");
			
			logger.info("outfile:"+outputFile.getName());
			
			fos = new FileOutputStream(outputFile);
			outputImageFile = ImageIO.createImageOutputStream(fos);
			
			int width = 600;
			
			double minx = layer.getBounds().getMinX();
			double miny = layer.getBounds().getMinY();
			double maxx = layer.getBounds().getMaxX();
			double maxy = layer.getBounds().getMaxY();
			
		    double ratioX = maxx - minx;
			double ratioY = maxy - miny;
			    
		    double ratio=0.0;
		    
		    if(ratioX > ratioY) {
		    	ratio = ratioX / ratioY;
		    	
		    	minx = minx + (ratio)*0.01;
		    	miny = miny + 0.01;
		    	
		    }else {
		    	ratio = ratioY / ratioX;
		    }
			
			ReferencedEnvelope bounds = new ReferencedEnvelope(minx-(ratio*1.5), maxx+(ratio*1.5), miny-(ratio*1.5), maxy+(ratio*1.5), CRS.decode(proj,true));
			
			int height = (int)(width*(bounds.getHeight() / bounds.getWidth()));
			
			bimage = new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB);
			
			Graphics2D g2d = bimage.createGraphics();
			
			mapContent.getViewport().setMatchingAspectRatio(true);
			mapContent.getViewport().setScreenArea(new Rectangle(Math.round(width), Math.round(height)));
			mapContent.getViewport().setBounds(bounds);
			
			g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
			
			Rectangle outputArea = new Rectangle(width, height);
			
			GTRenderer renderer = new StreamingRenderer();
			LabelCacheImpl labelCache = new LabelCacheImpl();
			
			Map<Object, Object> hints = renderer.getRendererHints();
			
			if(hints == null) {
				hints = new HashMap<>();
			}
			
			hints.put(StreamingRenderer.LABEL_CACHE_KEY, labelCache);
			renderer.setRendererHints(hints);
			renderer.setMapContent(mapContent);
			renderer.paint(g2d, outputArea, bounds);
			ImageIO.write(bimage, "png", outputImageFile);
	        
	        thumbSrc=imgName+".png";
	        
	        result.put("MINX",minx);
	        result.put("MINY",miny);
	        result.put("MAXX",maxx);
	        result.put("MAXY",maxy);
	        
	        result.put("IMG_SRC",thumbSrc);

		} catch (IOException e) {
			result.put("IMG_SRC","ERROR");
			logger.error("[ERROR-GTS-021] - IOException");
		}catch(MismatchedDimensionException e) {
			result.put("IMG_SRC","ERROR");
			logger.error("[ERROR-GTS-021] - MismatchedDimensionException");
		}catch(FactoryException e) {
			result.put("IMG_SRC","ERROR");
			logger.error("[ERROR-GTS-021] - FactoryException");
		}finally {
			if(outputImageFile != null) {
				try {
					outputImageFile.close();
				} catch (IOException e) {
					logger.error("[ERROR-GTS-021-01] - IOException");
				}
			}
			
			if(fos != null) {
				try {
					fos.close();
				} catch (IOException e) {
					logger.error("[ERROR-GTS-021-02] - IOException");
				}
			}
		}
		        
		return result;
		
	}
	
	public double getDistance(Coordinate source,Coordinate dest,String prj) {
		
		double dist=0.0;
		
		try {
			
			dist=JTS.orthodromicDistance(source, dest, CRS.parseWKT(prj));
			
		} catch (TransformException e) {
			logger.error("[ERROR-GTS-022] - TransformException");
			dist=0.0; 
		} catch (FactoryException e) {
			logger.error("[ERROR-GTS-022] - FactoryException");
			dist=0.0;
		}
		
		return dist;
	}
	
	public String readPrjFile(String path, String fileName) {
		String result="";
		
		FileInputStream fis=null;
		if(path != null) path = path.replaceAll("\\\\","").replaceAll ("&","");
		if(fileName != null) fileName = fileName.replaceAll("\\\\","").replaceAll ("&","");
		File file = new File(path+fileName);
		try{
			
			fis = new FileInputStream(file);

			byte[] buf = new byte[1024]; 
			fis.read(buf); 
			
			result = new String(buf);
			
		} catch (IOException ie) {
			logger.error("[ERROR-GTS-023] - IOException");
			result = "";
			return result;
		}finally {
			if(fis != null) {
				try {
					fis.close();
	
				} catch (IOException e) {
					logger.error("[ERROR-GTS-023-01] - IOException");
				}
			}
		}
		
		return result;
	}
	
	public String getPointBufferWithThumb(double x, double y,String dir, String fileName, String proj) {
	
		String thumbSrc="";
		
		Style style = null;
		Color outline = new Color(206, 79, 75);
		Color fillColor = new Color(255,255,255,0);
		
		TileLayer tile_layer=null;
		MapContent mapContent =null;
		BufferedImage bimage=null;
		ImageOutputStream outputImageFile =null;
		FileOutputStream fos=null;
		Layer layer = null;
		
		GeometryFactory geometryFactory = JTSFactoryFinder.getGeometryFactory();
		WKTReader reader = new WKTReader(geometryFactory);
		String wktGeom = "POINT ("+x+" "+y+" )";
		
		try {
			
			Geometry geom = (Geometry)reader.read(wktGeom);
			
			geom = geom.buffer(1000);
			
			StyleBuilder stylebuilder = new StyleBuilder();
			float[] dasharr = {10,5};
			
			style = SLD.createPolygonStyle(fillColor, outline,0.1f);
			PolygonSymbolizer polygSymb = stylebuilder.createPolygonSymbolizer(stylebuilder.createStroke(outline, 2.5,dasharr), stylebuilder.createFill(outline, 0.1f));
			Rule rule = stylebuilder.createRule(polygSymb);
			style.featureTypeStyles().get(0).rules().add(rule);
			
			mapContent = new MapContent();
			mapContent.setTitle("THUMBNAIL");
			
			String baseURL = "http://tile.openstreetmap.org/";
			TileService service = new OSMService("OSM", baseURL);
			
			SimpleFeatureTypeBuilder geobuilder = new SimpleFeatureTypeBuilder();
			geobuilder.setName("PCL_BOUNDARY");
			geobuilder.add("type", geom.getClass());
		
			SimpleFeatureBuilder featureBuilder = new SimpleFeatureBuilder(geobuilder.buildFeatureType());
			featureBuilder.add(geom);
			
			final DefaultFeatureCollection featureCollection = new DefaultFeatureCollection();
			
			SimpleFeature feature = featureBuilder.buildFeature(null);
			
			featureCollection.add(feature);
			
			tile_layer = new TileLayer(service);
			
			layer = new FeatureLayer(featureCollection, style);
			layer.setVisible(true);
			
			mapContent.getViewport().setCoordinateReferenceSystem(CRS.parseWKT(proj));
			
			mapContent.addLayer(tile_layer);
			mapContent.addLayer(layer);
			
			String imgName = fileName.split("\\.")[0];

			if(dir != null) dir = dir.replaceAll("\\\\","").replaceAll ("&","");
			if(fileName != null) fileName = fileName.replaceAll("\\\\","").replaceAll ("&","");
			File outputFile = new File(dir+imgName+".png");
			
			logger.info("outfile:"+outputFile.getName());
			
			fos = new FileOutputStream(outputFile);
			outputImageFile = ImageIO.createImageOutputStream(fos);
			
			int width = 600;
			geom=geom.buffer(200);
			
			double minx = geom.getEnvelopeInternal().getMinX();
			double miny = geom.getEnvelopeInternal().getMinY();
			double maxx = geom.getEnvelopeInternal().getMaxX();
			double maxy = geom.getEnvelopeInternal().getMaxY();
			
		    double ratioX = maxx - minx;
			double ratioY = maxy - miny;
			    
		    double ratio=0.0;
		    
		    if(ratioX > ratioY) {
		    	ratio = ratioX / ratioY;
		    	
		    	minx = minx + (ratio)*0.01;
		    	miny = miny + 0.01;
		    	
		    }else {
		    	ratio = ratioY / ratioX;
		    }
			
			ReferencedEnvelope bounds = new ReferencedEnvelope(minx-(ratio*1.5), maxx+(ratio*1.5), miny-(ratio*1.5), maxy+(ratio*1.5), CRS.parseWKT(proj));
			
			int height = (int)(width*(bounds.getHeight() / bounds.getWidth()));
			
			bimage = new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB);
			
			Graphics2D g2d = bimage.createGraphics();
			
			mapContent.getViewport().setMatchingAspectRatio(true);
			mapContent.getViewport().setScreenArea(new Rectangle(Math.round(width), Math.round(height)));
			mapContent.getViewport().setBounds(bounds);
			
			g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
			
			Rectangle outputArea = new Rectangle(width, height);
			
			GTRenderer renderer = new StreamingRenderer();
			LabelCacheImpl labelCache = new LabelCacheImpl();
			
			Map<Object, Object> hints = renderer.getRendererHints();
			
			if(hints == null) {
				hints = new HashMap<>();
			}
			
			hints.put(StreamingRenderer.LABEL_CACHE_KEY, labelCache);
			renderer.setRendererHints(hints);
			renderer.setMapContent(mapContent);
			renderer.paint(g2d, outputArea, bounds);
			ImageIO.write(bimage, "png", outputImageFile);
			
			/*int originWidth = originImg.getWidth(null);
			int originHeight = originImg.getHeight(null);
			
			Image resizeImg = originImg.getScaledInstance(originWidth, originHeight, Image.SCALE_SMOOTH);
			
			if(resizeImg != null) {
				 // 새 이미지  저장하기
		        BufferedImage newImage = new BufferedImage(originWidth, originHeight, BufferedImage.TYPE_INT_RGB);
		        Graphics g = newImage.getGraphics();
		        g.drawImage(resizeImg, 0, 0, null);
		        g.dispose();
		     
		        ImageIO.write(newImage, "png", outputImageFile);
		        
		        thumbSrc=imgName+".png";

			}
			
			BufferedImage newImage = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
	        Graphics g = newImage.getGraphics();
	        g.drawImage(originImg, 0, 0, null);
	        g.dispose();
	        ImageIO.write(newImage, "png", outputImageFile);*/
	        
	        thumbSrc=imgName+".png";
			
	     
	        
		} catch (IOException e) {
			logger.error("[ERROR-GTS-024] - IOException");
			thumbSrc="ERROR";
		}catch(MismatchedDimensionException e) {
			logger.error("[ERROR-GTS-024] - MismatchedDimensionException");
			thumbSrc="ERROR";
		}catch(FactoryException e) {
			logger.error("[ERROR-GTS-024] - FactoryException");
			thumbSrc="ERROR";
		}catch(ParseException e) {
			logger.error("[ERROR-GTS-024] - ParseException");
			thumbSrc="ERROR";
		}finally {
			
			if(fos != null) {
				try {
					fos.close();
				} catch (IOException e) {
					logger.error("[ERROR-GTS-024-02] - IOException");
				}
			}
			
			
			if(outputImageFile != null) {
				try {
					outputImageFile.close();
				} catch (IOException e) {
					logger.error("[ERROR-GTS-024-01] - IOException");
				}
			}
		}
		
		return thumbSrc;
	}
	
	public boolean setObjectEditWgs84Coordinates(String shpPath, String ogcWkt,String encoding) {
		
		boolean result = false;
		
		String match = "[^\\p{L}\\p{M}\\p{N}\\p{P}\\p{Z}\\p{Cf}\\p{Cs}\\s]";
		
		String originPath = shpPath.replace(".shp",".dbf");
		
		String wgs84="GEOGCS[\"WGS 84\",DATUM[\"WGS_1984\",SPHEROID[\"WGS 84\",6378137,298.257223563,AUTHORITY[\"EPSG\",\"7030\"]],AUTHORITY[\"EPSG\",\"6326\"]],PRIMEM[\"Greenwich\",0,AUTHORITY[\"EPSG\",\"8901\"]],UNIT[\"degree\",0.0174532925199433,AUTHORITY[\"EPSG\",\"9122\"]],AUTHORITY[\"EPSG\",\"4326\"]]";
		
		String tmpPath = shpPath.replace(".shp","_tmp.dbf");
		
		File originFile = new File(originPath);

		FileInputStream fis = null;
		DbaseFileReader dbfReader=null;
		FileInputStream fis2=null;
		FileOutputStream fos =null;
		WritableByteChannel out =null;
		ShapefileReader sr =null;
		DbaseFileWriter dbfWriter =null;
		DbaseFileReader dbfReaderData =null;
		try {
			fis = new FileInputStream(originFile);
			dbfReader = new DbaseFileReader(fis.getChannel(), true, Charset.forName(encoding));
			
			int colSize = dbfReader.getHeader().getNumFields();
			
			String[] headers = new String[colSize];
			
			
			DbaseFileHeader newHeader = new DbaseFileHeader(Charset.forName(encoding));
			
			int zColumnIndx = 0;
			for(int i=0;i<colSize;i++) {
				
				headers[i]=dbfReader.getHeader().getFieldName(i);
				
				String header =headers[i].replaceAll(match, "");
				
				/*if(header.toLowerCase().equals("utl3d_z")) {
					zColumnIndx = i;
				}*/
				char fieldType = dbfReader.getHeader().getFieldType(i);
				int length = dbfReader.getHeader().getFieldLength(i);
				int decimalCnt = dbfReader.getHeader().getFieldDecimalCount(i);
				
				newHeader.addColumn(header, fieldType, length, decimalCnt);
			}
			
			newHeader.addColumn("POS_X", 'N', 20, 17);
			newHeader.addColumn("POS_Y", 'N', 20, 17);
			newHeader.addColumn("POS_Z", 'N', 20, 17);
			
			newHeader.addColumn("SCALE_X", 'N', 20, 17);
			newHeader.addColumn("SCALE_Y", 'N', 20, 17);
			newHeader.addColumn("SCALE_Z", 'N', 20, 17);
			
			newHeader.addColumn("DIR_X", 'N', 20, 17);
			newHeader.addColumn("DIR_Y", 'N', 20, 17);
			newHeader.addColumn("DIR_Z", 'N', 20, 17);
			
			fis2 = new FileInputStream(new File(originPath));
			
			File tmp = new File(tmpPath);
			
			fos = new FileOutputStream(tmp);
			
			out = fos.getChannel();
			
			dbfWriter = new DbaseFileWriter(newHeader, out, Charset.forName(encoding));
			
			dbfReaderData = new DbaseFileReader(fis2.getChannel(), true, Charset.forName(encoding));
			
			int headerSize = dbfReaderData.getHeader().getNumFields();
			
			List<Object[]> list= new ArrayList<>();
			
			
			ShpFiles shpFiles = new ShpFiles(shpPath);
			GeometryFactory geometryFactory = new GeometryFactory();
			
			sr = new ShapefileReader(shpFiles, true, false, geometryFactory);
			
			while (dbfReaderData.hasNext()) {
				
				Row row = dbfReaderData.readRow();
				Object[] newRow = new Object[headerSize+9];
				
				for(int i=0;i<headerSize;i++) {
					newRow[i]=row.read(i);
				}
				
				//double z = Double.parseDouble(String.valueOf(row.read(zColumnIndx)));
				
				Record record = sr.nextRecord();
				Geometry geom = (Geometry)record.shape();
				
				Coordinate pos = geom.getCentroid().getCoordinate();
				
				MathTransform transform=CRS.findMathTransform(CRS.parseWKT(ogcWkt), CRS.parseWKT(wgs84),false);
				
				Coordinate wgs84pos = new Coordinate();
				JTS.transform(pos, wgs84pos, transform);
				
				double x = wgs84pos.x;
				double y = wgs84pos.y;
				double z = 0.0;
				
				for(int j=headerSize;j<headerSize+9;j++) {
					
					double value=0.0;
					
					if(j==headerSize) {
						value= x;
					}
					
					if(j==headerSize+1) {
						value= y;
					}
					
					if(j==headerSize+2) {//높이값
						value= z;
					}
					
					newRow[j] = value;
				}
				
				list.add(newRow);
				
	        }
			
			for(int i=0;i<list.size();i++) {
				Object[] row=list.get(i);
				dbfWriter.write(row);
				
			}
			
			if(out.isOpen()) {
				RandomAccessFile raf = null;
				try {
				raf = new RandomAccessFile(tmp, "rw");
				MappedByteBuffer buffer = raf.getChannel().map(MapMode.READ_WRITE, 4, 4);
				buffer.order(ByteOrder.BIG_ENDIAN).putInt(headerSize);
				} catch (IOException e) {
		        	logger.error("IOException");
		        } finally {
		        	if(raf != null) raf.close();
				}
			}
			
		
			Path source = Paths.get(tmpPath);
	        Path target = Paths.get(originPath);

	        Files.copy(source, target, StandardCopyOption.REPLACE_EXISTING);
	        tmp.delete();
	        
	        result=true;
			
		} catch (IOException e) {
			// TODO Auto-generated catch block
			result=false;
			logger.error("[ERROR-GTS-025] - IOException");
		}catch(FactoryException e) {
			logger.error("[ERROR-GTS-025] - FactoryException");
			result=false;
		}catch(TransformException e) {
			result=false;
			logger.error("[ERROR-GTS-025] - TransformException");
		} finally {

			if(fis != null) {
				try {
					fis.close();
				} catch (IOException e) {
					logger.error("[ERROR-GTS-025-01] - IOException");
				}
			}
			
			if(fis2 != null) {
				try {
					fis2.close();
				} catch (IOException e) {
					logger.error("[ERROR-GTS-025-02] - IOException");
				}
			}
			
			if(dbfReader != null) {
				try {
					dbfReader.close();
				} catch (IOException e) {
					logger.error("[ERROR-GTS-025-03] - IOException");
				}
			}
			
			if(fos != null) {
				try {
					fos.close();
				} catch (IOException e) {
					logger.error("[ERROR-GTS-025-04] - IOException");
				}
			}
			
			if(out != null) {
				try {
					out.close();
				} catch (IOException e) {
					logger.error("[ERROR-GTS-025-05] - IOException");
				}
			}
			
			if(sr != null) {
				try {
					sr.close();
				} catch (IOException e) {
					logger.error("[ERROR-GTS-025-06] - IOException");
				}
			}
			
			if(dbfWriter != null) {
				try {
					dbfWriter.close();
				} catch (IOException e) {
					logger.error("[ERROR-GTS-025-07] - IOException");
				}
			}
			
			if(dbfReaderData != null) {
				try {
					dbfReaderData.close();
				} catch (IOException e) {
					logger.error("[ERROR-GTS-025-08] - IOException");
				}
			}
		}
		
		return result;
		
	}
	
	public HashMap<String, Object> getGpxThumbInfo(String path, String fileName,String rteColorHex, String trkColorHex) {
		
		HashMap<String, Object> result=new HashMap<>();
		
		JSONTokener tokener = null;
		InputStream input = null;
		
		GeometryFactory gf=JTSFactoryFinder.getGeometryFactory();
	
		Geometry point = null;
		Geometry trkLine = null;
		Geometry rteLine = null;
		
		SimpleFeatureTypeBuilder pointBuilder = new SimpleFeatureTypeBuilder();
		SimpleFeatureTypeBuilder trkBuilder = new SimpleFeatureTypeBuilder();
		SimpleFeatureTypeBuilder rteBuilder = new SimpleFeatureTypeBuilder();
		
		DefaultFeatureCollection pointCollection = new DefaultFeatureCollection();
		DefaultFeatureCollection trkCollection = new DefaultFeatureCollection();
		DefaultFeatureCollection rteCollection = new DefaultFeatureCollection();
		
		String wkt4326="GEOGCS[\"WGS 84\",\r\n" + 
				"    DATUM[\"WGS_1984\",\r\n" + 
				"        SPHEROID[\"WGS 84\",6378137,298.257223563,\r\n" + 
				"            AUTHORITY[\"EPSG\",\"7030\"]],\r\n" + 
				"        AUTHORITY[\"EPSG\",\"6326\"]],\r\n" + 
				"    PRIMEM[\"Greenwich\",0,\r\n" + 
				"        AUTHORITY[\"EPSG\",\"8901\"]],\r\n" + 
				"    UNIT[\"degree\",0.0174532925199433,\r\n" + 
				"        AUTHORITY[\"EPSG\",\"9122\"]],\r\n" + 
				"    AUTHORITY[\"EPSG\",\"4326\"]]";
		
		String wkt5186="PROJCS[\"Korea 2000 / Central Belt 2010\",\r\n" + 
				"    GEOGCS[\"Korea 2000\",\r\n" + 
				"        DATUM[\"Geocentric_datum_of_Korea\",\r\n" + 
				"            SPHEROID[\"GRS 1980\",6378137,298.257222101,\r\n" + 
				"                AUTHORITY[\"EPSG\",\"7019\"]],\r\n" + 
				"            TOWGS84[0,0,0,0,0,0,0],\r\n" + 
				"            AUTHORITY[\"EPSG\",\"6737\"]],\r\n" + 
				"        PRIMEM[\"Greenwich\",0,\r\n" + 
				"            AUTHORITY[\"EPSG\",\"8901\"]],\r\n" + 
				"        UNIT[\"degree\",0.0174532925199433,\r\n" + 
				"            AUTHORITY[\"EPSG\",\"9122\"]],\r\n" + 
				"        AUTHORITY[\"EPSG\",\"4737\"]],\r\n" + 
				"    PROJECTION[\"Transverse_Mercator\"],\r\n" + 
				"    PARAMETER[\"latitude_of_origin\",38],\r\n" + 
				"    PARAMETER[\"central_meridian\",127],\r\n" + 
				"    PARAMETER[\"scale_factor\",1],\r\n" + 
				"    PARAMETER[\"false_easting\",200000],\r\n" + 
				"    PARAMETER[\"false_northing\",600000],\r\n" + 
				"    UNIT[\"metre\",1,\r\n" + 
				"        AUTHORITY[\"EPSG\",\"9001\"]],\r\n" + 
				"    AUTHORITY[\"EPSG\",\"5186\"]]";
		
		BufferedImage bimage=null;
		MapContent mapContent=null;
		FileOutputStream fos =null;
		ImageOutputStream outputImageFile=null;
		
		double rteLength = 0.0;
		double trkLength = 0.0;
		
		double minx = 0.0;
		double miny = 0.0;
		double minz = 0.0;
		double maxx = 0.0;
		double maxy = 0.0;
		double maxz = 0.0;
		
		try {
			
			mapContent = new MapContent();
			mapContent.getViewport().setCoordinateReferenceSystem(CRS.parseWKT(wkt5186));
			
			String baseURL = "http://tile.openstreetmap.org/";
			TileService service = new OSMService("OSM", baseURL);
			
			TileLayer tile_layer = new TileLayer(service);
			mapContent.addLayer(tile_layer);
			
			Style ptStyle=SLD.createPointStyle("Circle", Color.RED, Color.white, (float) 0.8, (float)10.0);
			Style rteStyle = SLD.createLineStyle(Color.decode(rteColorHex), (float)2.0);
			Style trkStyle = SLD.createLineStyle(Color.decode(trkColorHex), (float)2.0);
			
			StyleBuilder stylebuilder = new StyleBuilder();
			float[] dasharr = {10,5};
			LineSymbolizer lineSymbol = stylebuilder.createLineSymbolizer(stylebuilder.createStroke(Color.decode(trkColorHex), 2.5,dasharr));
			Rule rule = stylebuilder.createRule(lineSymbol);
			trkStyle.featureTypeStyles().get(0).rules().add(rule);
			
			MathTransform transform = CRS.findMathTransform(CRS.parseWKT(wkt4326), CRS.parseWKT(wkt5186),true);

			if(path != null) path = path.replaceAll("\\\\","").replaceAll ("&","");
			if(fileName != null) fileName = fileName.replaceAll("\\\\","").replaceAll ("&","");
			
			input = new FileInputStream(path+fileName);
			tokener = new JSONTokener(input);
			JSONObject jsonObj = new JSONObject(tokener);
			
			JSONObject gpxObj = jsonObj.getJSONObject("gpx");
			
			if(!gpxObj.isNull("wpt")) { //multipoint
				JSONArray wptObj = gpxObj.getJSONArray("wpt");
				
				Coordinate[] wptCoords = new Coordinate[wptObj.length()];
				
				for(int i=0;i<wptObj.length();i++) {
					JSONObject record = wptObj.getJSONObject(i);
					
					HashMap<String, Object> param = new HashMap<>();
					
					String name = "";
					double lon=0.0;
					double lat=0.0;
					double alt=0.0;
					
					if(!record.isNull("name")) {
						name = record.getString("name");
					}
					
					if(!record.isNull("lon")) {
						lon = record.getDouble("lon");
					}
					
					if(!record.isNull("lat")) {
						lat = record.getDouble("lat");
					}
					
					if(!record.isNull("ele")) {
						alt = record.getDouble("ele");
					}
					
					Coordinate coord = new Coordinate(lon, lat);
					Coordinate newCoord = new CoordinateXY(coord);
					
					wptCoords[i]=newCoord;
					
				}
				
				point = gf.createMultiPointFromCoords(wptCoords);
				point=JTS.transform(point,  transform);
				
				pointBuilder.setName("WPT_POINT");
				pointBuilder.add("type", point.getClass());
				pointBuilder.setCRS(CRS.parseWKT(wkt5186));
				
				SimpleFeatureBuilder featureBuilder = new SimpleFeatureBuilder(pointBuilder.buildFeatureType());
				
				featureBuilder.add(point);
				
				SimpleFeature feature = featureBuilder.buildFeature(null);
				
				pointCollection.add(feature);
				
				Layer wptLayer = new FeatureLayer(pointCollection, ptStyle);
				mapContent.addLayer(wptLayer);
				
				
			}
			
			if(!gpxObj.isNull("trk")) {//linestring or multilinestring
			
				JSONObject trkObj = gpxObj.getJSONObject("trk");
				
				if(!trkObj.isNull("trkseg")) {
					
					JSONObject trkseq = trkObj.getJSONObject("trkseg");
					
					if(!trkseq.isNull("trkpt")) {
						JSONArray trkpt = trkseq.getJSONArray("trkpt");
						Coordinate[] coords = new Coordinate[trkpt.length()];
						
						List<Double> alts = new ArrayList<>();
						
						for(int i=0;i<trkpt.length();i++) {
							
							HashMap<String, Object> param = new HashMap<>();
							
							JSONObject lonLatInfo = trkpt.getJSONObject(i);
							
							double lon =0.0;
							double lat =0.0;
							double alt =0.0;
							double height =0.0;
							
							String time = "";
							if(!lonLatInfo.isNull("lon")) {
								lon = lonLatInfo.getDouble("lon");
							}
							
							if(!lonLatInfo.isNull("lat")) {
								lat = lonLatInfo.getDouble("lat");
							}
							
							if(!lonLatInfo.isNull("ele")) {
								alt = lonLatInfo.getDouble("ele");
							}
							
							if(!lonLatInfo.isNull("time")) {
								time=lonLatInfo.getString("time");
							}
							
							if(!lonLatInfo.isNull("geoidheight")) {
								height = lonLatInfo.getDouble("geoidheight");
							}
							
							alts.add(alt);
							
							Coordinate coord = new Coordinate(lon, lat);
							Coordinate newCoord = new CoordinateXY(coord);
							coords[i]=newCoord;
							
						}
						
						trkLine = gf.createLineString(coords);
						trkLine=JTS.transform(trkLine,  transform);
						
						trkLength=trkLine.getLength();
						
						trkLine.getLength();
						trkBuilder.setName("TRK_LINE");
						trkBuilder.add("type", trkLine.getClass());
						trkBuilder.setCRS(CRS.parseWKT(wkt5186));
						
						SimpleFeatureBuilder featureBuilder = new SimpleFeatureBuilder(trkBuilder.buildFeatureType());
						featureBuilder.add(trkLine);
						
						SimpleFeature feature = featureBuilder.buildFeature(null);
						trkCollection.add(feature);
						
						Layer trkLayer = new FeatureLayer(trkCollection, trkStyle);
						
						mapContent.addLayer(trkLayer);
						
						minz = Collections.min(alts);
						maxz = Collections.max(alts);
					}
					
				}
			}
			
			if(!gpxObj.isNull("rte")) {//linestring or multilinestring
				JSONObject rteObj = gpxObj.getJSONObject("rte");
				
				if(!rteObj.isNull("rtept")) {
					
					JSONArray rtept = rteObj.getJSONArray("rtept");
					
					Coordinate[] coords = new Coordinate[rtept.length()];
					List<Double> alts = new ArrayList<>();
					
					for(int i=0;i<rtept.length();i++) {
						
						HashMap<String, Object> param = new HashMap<>();
						
						JSONObject lonLatInfo = rtept.getJSONObject(i);
						
						double lon =0.0;
						double lat =0.0;
						double alt =0.0;
						double height =0.0;
						
						String time = "";
						if(!lonLatInfo.isNull("lon")) {
							lon = lonLatInfo.getDouble("lon");
						}
						
						if(!lonLatInfo.isNull("lat")) {
							lat = lonLatInfo.getDouble("lat");
						}
						
						if(!lonLatInfo.isNull("ele")) {
							alt = lonLatInfo.getDouble("ele");
						}
						
						if(!lonLatInfo.isNull("time")) {
							time=lonLatInfo.getString("time");
						}
						
						if(!lonLatInfo.isNull("geoidheight")) {
							height = lonLatInfo.getDouble("geoidheight");
						}
						
						alts.add(alt);
						
						Coordinate coord = new Coordinate(lon, lat);
						Coordinate newCoord = new CoordinateXY(coord);
						coords[i]=newCoord;
						
					}
				
					rteLine = gf.createLineString(coords);
					rteLine=JTS.transform(rteLine,  transform);
					rteLength=rteLine.getLength();
					
					rteBuilder.setName("RTE_LINE");
					rteBuilder.add("type", rteLine.getClass());
					rteBuilder.setCRS(CRS.parseWKT(wkt5186));
					
					SimpleFeatureBuilder featureBuilder = new SimpleFeatureBuilder(rteBuilder.buildFeatureType());
					featureBuilder.add(rteLine);
					
					SimpleFeature feature = featureBuilder.buildFeature(null);
					rteCollection.add(feature);
					
					Layer rteLayer = new FeatureLayer(rteCollection, rteStyle);
					mapContent.addLayer(rteLayer);
					
					minz = Collections.min(alts);
					maxz = Collections.max(alts);
				}
				
			}
			
			
			
			if(trkLine != null) {
				
				minx = trkLine.getEnvelopeInternal().getMinX();
				miny = trkLine.getEnvelopeInternal().getMinY();
				maxx = trkLine.getEnvelopeInternal().getMaxX();
				maxy = trkLine.getEnvelopeInternal().getMaxY();
				
			}
			
			if(rteLine != null) {
				
				minx = rteLine.getEnvelopeInternal().getMinX();
				miny = rteLine.getEnvelopeInternal().getMinY();
				maxx = rteLine.getEnvelopeInternal().getMaxX();
				maxy = rteLine.getEnvelopeInternal().getMaxY();
				
			}
			
			if(point != null) {
				
				minx = point.getEnvelopeInternal().getMinX();
				miny = point.getEnvelopeInternal().getMinY();
				maxx = point.getEnvelopeInternal().getMaxX();
				maxy = point.getEnvelopeInternal().getMaxY();
				
			}
			
			MathTransform transform4326 = CRS.findMathTransform(CRS.parseWKT(wkt5186),CRS.parseWKT(wkt4326),true);
			
			ReferencedEnvelope bounds = new ReferencedEnvelope(minx, maxx, miny, maxy, CRS.parseWKT(wkt5186));
			bounds.expandBy(500);
			Envelope boundEnv = new Envelope(minx, maxx, miny, maxy);
			Envelope bound4326 = JTS.transform(boundEnv, transform4326);
			
			mapContent.setTitle("THUMBNAIL");
			
			int width = 600;
			int height = (int)(width*(bounds.getHeight() / bounds.getWidth()));
			
			String imgFileName = "";
			if(fileName != null) imgFileName = fileName.split("\\.")[0]+".png";
			if(imgFileName != null) imgFileName = imgFileName.replaceAll("\\\\","").replaceAll ("&","");
			File outputFile = new File(path+imgFileName);
			
			fos = new FileOutputStream(outputFile);
			outputImageFile = ImageIO.createImageOutputStream(fos);
			
			bimage = new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB);
			
			Graphics2D g2d = bimage.createGraphics();
			mapContent.getViewport().setBounds(bounds);
			mapContent.getViewport().setEditable(true);
			mapContent.getViewport().setMatchingAspectRatio(false);
			mapContent.getViewport().setFixedBoundsOnResize(true);
			
			mapContent.getViewport().setScreenArea(new Rectangle(Math.round(width), Math.round(height)));
			
			g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
			
			Rectangle outputArea = new Rectangle(width, height);
			
			GTRenderer renderer = new StreamingRenderer();
			LabelCacheImpl labelCache = new LabelCacheImpl();
			
			Map<Object, Object> hints = renderer.getRendererHints();
			
			if(hints == null) {
				hints = new HashMap<>();
			}
			
			hints.put(StreamingRenderer.LABEL_CACHE_KEY, labelCache);
			renderer.setRendererHints(hints);
			renderer.setMapContent(mapContent);
			renderer.paint(g2d, outputArea, bounds);
			
			ImageIO.write(bimage, "png", outputImageFile);
		
			double roundtrkKm =0.0;
			double roundrteKm=0.0;
			
			if(trkLength != 0.0) {
				double trkKm =trkLength/1000.0;
				roundtrkKm = Math.round(trkKm*100)/100.0;
			}
			
			if(rteLength != 0.0) {
				double rteKm =rteLength/1000.0;
				roundrteKm = Math.round(rteKm*100)/100.0;
			}
			
			result.put("IMG_URL",imgFileName);
			result.put("TRK_LENGTH",String.valueOf(roundtrkKm));
			result.put("RTE_LENGTH",String.valueOf(roundrteKm));
			
			result.put("MINX",bound4326.getMinX());
			result.put("MINY",bound4326.getMinY());
			result.put("MINZ",minz);
			
			result.put("MAXX",bound4326.getMaxX());
			result.put("MAXY",bound4326.getMaxY());
			result.put("MAXZ",maxz);
			
			result.put("STATE","1");
			
		} catch (IOException e) {
			logger.error("[ERROR-GTS-026] - IOException");
			result.put("STATE","0");
		}catch(FactoryException e) {
			logger.error("[ERROR-GTS-026] - FactoryException");
			result.put("STATE","0");
		}catch(MismatchedDimensionException e) {
			logger.error("[ERROR-GTS-026] - MismatchedDimensionException");
			result.put("STATE","0");
		}catch(TransformException e) {
			logger.error("[ERROR-GTS-026] - TransformException");
			result.put("STATE","0");
		}finally{
			
			if(bimage != null) {
				bimage.flush();
			}
			
			if(mapContent != null) {
				mapContent.dispose();
			}
			
			try {
				if(outputImageFile != null) outputImageFile.close();
				if(fos != null) fos.close();
				if(input != null) input.close();
			} catch (IOException e) {
				logger.error("[ERROR-GTS-026-01] - IOException");
			}
			
		}
		
		return result;
	}
	
	public HashMap<String, Double> getCombineBoundary(Geometry p1, Geometry p2) {
		
		HashMap<String, Double> result = new HashMap<>();
		
		double minx = p1.union(p2).getEnvelope().getEnvelopeInternal().getMinX();
		double miny = p1.union(p2).getEnvelope().getEnvelopeInternal().getMinY();
		double maxx = p1.union(p2).getEnvelope().getEnvelopeInternal().getMaxX();
		double maxy = p1.union(p2).getEnvelope().getEnvelopeInternal().getMaxY();
		
		result.put("minx",minx);
		result.put("miny",miny);
		result.put("maxx",maxx);
		result.put("maxy",maxy);
		
		return result;
	}
	
	public String getShpConvexhull(String fileName,String path,String originPrj) {
		
		ShapefileReader r = null;
		String result = "";
		MathTransform transform=null;
		
		try {
			GeometryFactory geometryFactory = new GeometryFactory();

			if(path != null) path = path.replaceAll("\\\\","").replaceAll ("&","");
			if(fileName != null) fileName = fileName.replaceAll("\\\\","").replaceAll ("&","");
			
			ShpFiles shpFile  = new ShpFiles(new File(path+fileName));
			r = new ShapefileReader(shpFile, true, false, geometryFactory);
			
			List<Geometry> geoms = new ArrayList<>();
			
			while(r.hasNext()) {
				Record record = r.nextRecord();
				Geometry shape = (Geometry)record.shape();
				geoms.add(shape);
			}
			Object obj = geometryFactory.buildGeometry(geoms);
			GeometryCollection gc =(GeometryCollection)obj;
			
			Geometry originGeom = gc.convexHull();
			
			
			transform = CRS.findMathTransform(CRS.parseWKT(originPrj), CRS.decode("EPSG:4326",true),true);
			
			Geometry transferGeo = JTS.transform(originGeom, transform);
			
			result =transferGeo.toString();
			
		}catch (IOException e) {
			logger.error("[ERROR-GTS-027] - IOException");
		}catch(FactoryException e){
			logger.error("[ERROR-GTS-027] - FactoryException");
		}catch(MismatchedDimensionException e){
			logger.error("[ERROR-GTS-027] - MismatchedDimensionException");
		}catch(TransformException e){
			logger.error("[ERROR-GTS-027] - TransformException");
		}finally {
			
			if(r != null) {
				try {
					r.close();
				} catch (IOException e) {
					logger.error("[ERROR-GTS-027-02] - IOException");
				}
			}
		}
		
		return result;
	}
	
	public String getGeoJsonThumbnail(String dir, String fileName,int code,String prjwkt,String type) {
		
		
		File geojsonFile = new File(dir+fileName);
		BufferedReader br = null;
		FileReader fr = null;
		Reader reader = null;
		String imgUrl = "";
		String wktGeom = "";
		
		try {
			
			fr = new FileReader(geojsonFile);
			br = new BufferedReader(fr);
			
			StringBuffer response = new StringBuffer();
			String geoJson="";
			
			GeometryJSON gjson = new GeometryJSON();
			FeatureJSON featureJson = new FeatureJSON(gjson);
			
			while((geoJson = br.readLine()) != null) {
				response.append(geoJson);
			}
			
			reader = new StringReader(response.toString());
			
			if(type.toLowerCase().equals("featurecollection")) {
				
				FeatureCollection featureCollection = featureJson.readFeatureCollection(reader);
				
				double minx = featureCollection.getBounds().getMinX();
				double miny = featureCollection.getBounds().getMinY();
				double maxx = featureCollection.getBounds().getMaxX();
				double maxy = featureCollection.getBounds().getMaxY();
				
				wktGeom = "POLYGON(("+minx+" "+miny+", "+maxx+" "+miny+", "+maxx+" "+maxy+", "+minx+" "+maxy+", "+minx+" "+miny+"))";
				
			}else {
				
				Geometry geom = (Geometry)gjson.read(reader);
				wktGeom = geom.toText();
				
			}
			
			imgUrl=this.getWktGeometryMapThumb(wktGeom,dir,fileName,prjwkt,code);
			
		} catch (FileNotFoundException e) {
			imgUrl="";
			logger.error("[ERROR-GJP-001] - FileNotFoundException");
		} catch (IOException e) {
			imgUrl="";
			logger.error("[ERROR-GJP-002] - IOException");
		} finally {
			
			if(fr !=null) {
				try {
					fr.close();
				} catch (IOException e) {
					// TODO Auto-generated catch block
					logger.error("[ERROR-GJP-001-close] - IOException");
				}
			}
			
			if(br != null) {
				try {
					br.close();
				} catch (IOException e) {
					logger.error("[ERROR-GJP-002-close] - IOException");
				}
			}
		}
		
		return imgUrl;
	}
}