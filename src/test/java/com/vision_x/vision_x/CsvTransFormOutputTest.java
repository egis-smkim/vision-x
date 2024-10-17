package digitaltwincloud;

import java.io.BufferedWriter;
import java.io.File;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;

import org.apache.batik.transcoder.print.PrintTranscoder;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVPrinter;
import org.apache.commons.csv.CSVRecord;
import org.apache.commons.lang3.StringUtils;
import org.geotools.geometry.jts.JTS;
import org.geotools.referencing.CRS;
import org.hsqldb.util.CSVWriter;
import org.locationtech.jts.geom.Coordinate;
import org.opengis.referencing.FactoryException;
import org.opengis.referencing.operation.MathTransform;
import org.opengis.referencing.operation.TransformException;

public class CsvTransFormOutputTest {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		List<CSVRecord> list = new ArrayList<CSVRecord>();
		
		String fileDir = "D:\\오픈랩 csv 데이터 가공\\csv_188.csv";
		String outputPath = "D:\\\\오픈랩 csv 데이터 가공\\\\csv_18.csv";
		String encoding = "euc-kr";
		
		CSVFormat format = CSVFormat.RFC4180.withHeader().withDelimiter(',');
		
		List<String[]> resultRecord = new ArrayList<>();
		BufferedWriter writer;
		
		int xIndx = 8;
		int yIndx = 9;
		try {
			CSVParser parseCsv = CSVParser.parse(new File(fileDir), Charset.forName(encoding), format);
			
			writer = Files.newBufferedWriter(Paths.get(outputPath));
			
			list = parseCsv.getRecords();
			
			List<String> headers = parseCsv.getHeaderNames();
			List<String> headersLonLat = new ArrayList<>();
			for(String header : headers) {
				headersLonLat.add(header);
			}
			int lonindx = headers.size()+1;
			int latIndx = headers.size()+2;
			
			System.out.println(lonindx+","+latIndx);
			
			headersLonLat.add("lon");
			headersLonLat.add("lat");
			
			StringBuilder stringBuilder = new StringBuilder();
			
			int indx=0;
			
			for(String header : headersLonLat) {
				
				if(indx+1 != headers.size()) {
					stringBuilder.append(header).append(",");
				}
				
				indx++;
			}
			
			
			CSVPrinter printer = new CSVPrinter(writer,CSVFormat.DEFAULT);
			
			String epsg5179="PROJCS[\"KGD2002 / Central Belt 2010\",\r\n" + //
								"    GEOGCS[\"KGD2002\",\r\n" + //
								"        DATUM[\"Korean_Geodetic_Datum_2002\",\r\n" + //
								"            SPHEROID[\"GRS 1980\",6378137,298.257222101],\r\n" + //
								"            TOWGS84[0,0,0,0,0,0,0]],\r\n" + //
								"        PRIMEM[\"Greenwich\",0,\r\n" + //
								"            AUTHORITY[\"EPSG\",\"8901\"]],\r\n" + //
								"        UNIT[\"degree\",0.0174532925199433,\r\n" + //
								"            AUTHORITY[\"EPSG\",\"9122\"]],\r\n" + //
								"        AUTHORITY[\"EPSG\",\"4737\"]],\r\n" + //
								"    PROJECTION[\"Transverse_Mercator\"],\r\n" + //
								"    PARAMETER[\"latitude_of_origin\",38],\r\n" + //
								"    PARAMETER[\"central_meridian\",127],\r\n" + //
								"    PARAMETER[\"scale_factor\",1],\r\n" + //
								"    PARAMETER[\"false_easting\",200000],\r\n" + //
								"    PARAMETER[\"false_northing\",600000],\r\n" + //
								"    UNIT[\"metre\",1,\r\n" + //
								"        AUTHORITY[\"EPSG\",\"9001\"]],\r\n" + //
								"    AUTHORITY[\"EPSG\",\"5186\"]]";
			String wgs84 = "GEOGCS[\"WGS 84\",DATUM[\"WGS_1984\",SPHEROID[\"WGS 84\",6378137,298.257223563,AUTHORITY[\"EPSG\",\"7030\"]],AUTHORITY[\"EPSG\",\"6326\"]],PRIMEM[\"Greenwich\",0,AUTHORITY[\"EPSG\",\"8901\"]],UNIT[\"degree\",0.0174532925199433,AUTHORITY[\"EPSG\",\"9122\"]],AUTHORITY[\"EPSG\",\"4326\"]]";
			
			printer.printRecord(headersLonLat.stream().collect(Collectors.toList()));
			for(CSVRecord record : list) {
			
				List<Object> recordArr = new ArrayList<>();
				
				for(int i=0;i<record.size();i++) {
					recordArr.add(record.get(i));
				}
				
				String xStr = record.get(xIndx);
				String yStr = record.get(yIndx);
				
				//System.out.println(xStr+","+yStr);
				double[] wgsxy = new double[2];
						
				if(xStr.matches("[0-9]*\\.?[0-9]*") && yStr.matches("[0-9]*\\.?[0-9]*")) {
					
					double x = Double.parseDouble(record.get(xIndx));
					double y = Double.parseDouble(record.get(yIndx));
					
					double[] transCoord = {x,y};
					wgsxy = transformCoordi(transCoord,epsg5179,wgs84);
					
					//recordArr.set(lonindx, wgsxy[0]);
					//recordArr.set(latIndx, wgsxy[1]);
					recordArr.add(wgsxy[0]);
					recordArr.add(wgsxy[1]);
					
				}else {
					recordArr.add("");
					recordArr.add("");
				}
				
				//printer.printRecord(recordArr.iterator());
				
				printer.printRecord(recordArr.stream().collect(Collectors.toList()));
			}
			
			printer.flush();
			
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		
	}
	
	public static double[] transformCoordi(double[] pos,String source,String dest){
		
		double[] result = new double[2];
		
		Coordinate originPos = new Coordinate(pos[0],pos[1]);
		
		Coordinate destPos = new Coordinate();
		
		MathTransform transform=null;
		
		try {
			transform = CRS.findMathTransform(CRS.parseWKT(source), CRS.parseWKT(dest),false);
			JTS.transform(originPos, destPos, transform);
			
			result[0]=destPos.x;
			result[1]=destPos.y;
			
		}catch (FactoryException e) {
			e.printStackTrace();
		}catch(TransformException e) {
			e.printStackTrace();
		} 
		
		return result;
		
	}

}
