package com.vision_x.vision_x.geocoding.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.Charset;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class GeocodingService {
	protected Logger logger = LoggerFactory.getLogger(this.getClass());
	private static String GEOCODE_URL="http://dapi.kakao.com/v2/local/search/address.json?query=";
	private static String GEOCODE_USER_INFO="KakaoAK b63cbdf08550b551a5d3380605d8e261"; //파일 서버 경로*/
	
	public double[] getGeocodingCoordinates(String address) {

		double[] result=new double[2];
		
		URL obj;
		BufferedReader in = null;
		HttpURLConnection con = null;
		InputStream inputStream = null;
		InputStreamReader inputStreamReader = null;
		try {
			String addressEncode = URLEncoder.encode(address, "UTF-8");
			
			obj = new URL(GEOCODE_URL+addressEncode);
			
			con = (HttpURLConnection)obj.openConnection();
			con.setRequestMethod("GET");
			con.setRequestProperty("Authorization",GEOCODE_USER_INFO);
			con.setRequestProperty("accept", "application/json");
			con.setRequestProperty("content-type", "application/json");
			con.setDoOutput(true);
			con.setUseCaches(false);
			con.setDefaultUseCaches(false);
			
			Charset charset = Charset.forName("UTF-8");
			inputStream = con.getInputStream();
			inputStreamReader = new InputStreamReader(inputStream, charset);
			in = new BufferedReader(inputStreamReader);
			String inputLine;
			StringBuffer response = new StringBuffer();

			while ((inputLine = in.readLine()) != null) {
				response.append(inputLine);
			}
			
			JSONParser jsonParser = new JSONParser();
			JSONObject jsonObject = (JSONObject)jsonParser.parse(response.toString());
			
			JSONArray jsonArr = (JSONArray)jsonObject.get("documents");
			
			
			if(jsonArr.size() != 0) {
				JSONObject jsonObj = (JSONObject)jsonArr.get(0);
				
				double lon = Double.parseDouble((String)jsonObj.get("x"));
				double lat = Double.parseDouble((String)jsonObj.get("y"));
				
				result[0]=lon;
				result[1]=lat;
			}
			
		} catch (UnsupportedEncodingException e) {
			logger.error("Encoding Error-UnsupportedEncodingException");
		} catch (IOException e) {
			logger.error("Data Access Error-IOException");
		} catch (ParseException e) {
			logger.error("Parsing Error-ParseException");
		} finally {
			try {
				if(in != null) in.close();
				if(inputStream != null) inputStream.close();
				if(inputStreamReader != null) inputStreamReader.close();
				if(con != null) con.disconnect();
			} catch (IOException e) {
				logger.error("close Error-IOException");
			}
		}
		
		return result;
	}
}
