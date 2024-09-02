package com.vision_x.vision_x.geoserver.service;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URL;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.fluent.Request;
import org.apache.http.entity.ContentType;
import org.apache.http.util.EntityUtils;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class GeoServerService {
	
	
	protected Logger logger = LoggerFactory.getLogger(this.getClass());
	
	@Value("#{globalInfo['Globals.geoserver.url']}")
	private String GEO_URL;
	
	@Value("#{globalInfo['Globals.geoserver.userInfo']}")
	private String GEO_USER_INFO;
	
	@Value("#{globalInfo['Globals.geoserver.db.host']}")
	private String GEO_DB_HOST;
	
	@Value("#{globalInfo['Globals.geoserver.db.user']}")
	private String GEO_DB_USER;
	
	@Value("#{globalInfo['Globals.geoserver.db.name']}")
	private String GEO_DB_NAME;
	
	/*@Value("#{globalInfo['Globals.geoserver.db.pass']}")
	private String GEO_DB_PASSWORD;*/
	
	private String GEO_DB_PASSWORD = System.getProperty("postgis.db.password");
	
	@Value("#{globalInfo['Globals.geoserver.db.port']}")
	private String GEO_DB_PORT;
	
	//MalformedURLException,IOException
	@SuppressWarnings("unchecked")
	public String checkWorkspace(String workspace) {
		
		logger.info("geoserverUrl :"+GEO_URL);
		logger.info("geodb_port:"+GEO_DB_PORT);
			
		String AUTH_USER=Base64.getEncoder().encodeToString(GEO_USER_INFO.getBytes(StandardCharsets.UTF_8));
		
		String result="EXIST";
		String url = GEO_URL+"/rest/workspaces";
		
		logger.info("check workspace url :"+url);
		BufferedReader in = null;
		InputStream inSt = null;
		InputStreamReader inStr = null;
		HttpURLConnection con = null;
		URL obj;
		try {
			obj = new URL(url);
			con = (HttpURLConnection)obj.openConnection();
			con.setRequestMethod("GET");
			con.setRequestProperty("Authorization","Basic "+AUTH_USER);
			con.setRequestProperty("accept", "application/json");
			con.setRequestProperty("content-type", "application/json");
			con.setDoOutput(true);
			con.setUseCaches(false);
			con.setDefaultUseCaches(false);

	        Charset charset = Charset.forName("UTF-8");
	        inSt = con.getInputStream();
	        inStr = new InputStreamReader(inSt,charset);
	        in = new BufferedReader(inStr);
	        String inputLine;
	        StringBuffer response = new StringBuffer();
	        
	        while((inputLine = in.readLine()) !=null) {
	        	response.append(inputLine);
	        }
			
	        ObjectMapper mapper = new ObjectMapper();
	        
	    	Map<String, Object> map =mapper.readValue(response.toString(),Map.class);
	    	LinkedHashMap<String, Object> workspacemap = (LinkedHashMap<String, Object>) map.get("workspaces");
	    	List<HashMap<String, String>> work_name = (List<HashMap<String, String>>) workspacemap.get("workspace");
	    	   
	    	List<String> nameLists = new ArrayList<String>();
	    	   
	    	for(int i=0;i<work_name.size();i++) {
	    		nameLists.add(String.valueOf(work_name.get(i).get("name")));
	    	}
			
	    	if(nameLists.contains(workspace)) {
	    		//workspace exist
	    		result="EXIST";
	    	}else {
	    		//no workspace
	    		result="NONE";
	    	}

		} catch (MalformedURLException e) {
			logger.error("checkWorkspace Error-MalformedURLException");
			result="NONE";
		} catch (IOException e) {
			logger.error("checkWorkspace Error-IOException");
			result="NONE";
		} catch (Exception e) {
			logger.error("checkWorkspace Error");
			result="NONE";
		}  finally {
			try {
		    	if(in != null) in.close();
		    	if(inSt != null) inSt.close();
		    	if(inStr != null) inStr.close();
		    	if(con != null) con.disconnect();
			} catch (IOException e) {
				logger.error("close Error-IOException");
			}
		}
		return result;
	}
	
	public String createWorkspace(String workspace){
		
		String AUTH_USER=Base64.getEncoder().encodeToString(GEO_USER_INFO.getBytes(StandardCharsets.UTF_8));
		
		String result="";
		
		String wrkspXml ="<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
		   wrkspXml +="<workspace>\n";
		   wrkspXml +="	<name>w_"+workspace+"</name>\n";
		   wrkspXml +="</workspace>";
		   
		String url = GEO_URL+"/rest/workspaces";
		
		URL obj;
		BufferedReader inWn = null;
		OutputStream os = null;
		HttpURLConnection con = null;
		InputStream inputStream = null;
		InputStreamReader inputStreamReader = null;
		try {
			obj = new URL(url);
			con = (HttpURLConnection)obj.openConnection();
			
			con.setRequestMethod("POST");
			con.setRequestProperty("Authorization","Basic "+AUTH_USER);
			con.setRequestProperty("accept", "application/json");
			con.setRequestProperty("content-type", "application/xml");
			con.setDoOutput(true);
			con.setUseCaches(false);
			con.setDefaultUseCaches(false);
			   
			os = con.getOutputStream();
			DataOutputStream wr = new DataOutputStream(os);
			wr.writeBytes(wrkspXml);
			wr.flush();
			wr.close();
			
			Charset charset = Charset.forName("UTF-8");
			inputStream = con.getInputStream();
			inputStreamReader = new InputStreamReader(inputStream, charset);
			inWn =new BufferedReader(inputStreamReader);
			String rsLine;
			StringBuffer rs = new StringBuffer();
			        
			while((rsLine = inWn.readLine()) !=null) {
			    rs.append(rsLine);
			}
			
			result="DONE";
			
		} catch (IOException e) {
			result="FAIL";
			logger.error("Data Access Error-IOException");
		} finally {
			try {
				if(inputStream != null) inputStream.close();
				if(inputStreamReader != null) inputStreamReader.close();
				if(os != null) os.close();
				if(inWn != null) inWn.close();
				if(con != null) con.disconnect();
			} catch (IOException e) {
				logger.error("close Error-IOException");
			}
		}
		
		return result;
	}
	
	@SuppressWarnings("unchecked")
	public String createDatasource(String workspace, String dataSource){
		String result="";
		
		String AUTH_USER=Base64.getEncoder().encodeToString(GEO_USER_INFO.getBytes(StandardCharsets.UTF_8));
		
		String url =GEO_URL+"/rest/workspaces/w_"+workspace+"/datastores";
		
		URL obj;
		BufferedReader inWn = null;
		BufferedReader inDataStore = null;
		HttpURLConnection con = null;
		HttpURLConnection con2 = null;
		InputStream inputStream = null;
		InputStreamReader inputStreamReader = null;
		OutputStream os = null;
		DataOutputStream wr = null;
		try {
			obj = new URL(url);
			con = (HttpURLConnection)obj.openConnection();
			
			con.setRequestMethod("GET");
			con.setRequestProperty("Authorization","Basic "+AUTH_USER);
			con.setRequestProperty("accept", "application/json");
			con.setRequestProperty("content-type", "application/json");
			con.setDoOutput(true);
			con.setUseCaches(false);
			con.setDefaultUseCaches(false);
			
			ObjectMapper mapper = new ObjectMapper();
			Charset charset = Charset.forName("UTF-8");
			
			inputStream = con.getInputStream();
			inputStreamReader = new InputStreamReader(inputStream, charset);
			inDataStore =new BufferedReader(inputStreamReader);
			String inputLineData;
			StringBuffer responseStore = new StringBuffer();
			    
			while((inputLineData = inDataStore.readLine()) !=null) {
			   responseStore.append(inputLineData);
			}
			
			Map<String, Object> rsHashMap=(HashMap<String, Object>) mapper.readValue(responseStore.toString(),Map.class);
			
			if (rsHashMap.get("dataStores") == null || rsHashMap.get("dataStores").equals("")) {
	
				// create dataStore
				String dataXml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
				dataXml += "<dataStore>\n";
				dataXml += "	<name>" + dataSource + "</name>";
				dataXml += "	<connectionParameters>\n";
				dataXml += "		<host>"+GEO_DB_HOST+"</host>\n";
				dataXml += "		<port>"+GEO_DB_PORT+"</port>\n";
				dataXml += "		<database>"+GEO_DB_NAME+"</database>\n";
				dataXml += "		<user>"+GEO_DB_USER+"</user>\n";
				dataXml += "		<passwd>"+GEO_DB_PASSWORD+"</passwd>\n";
				dataXml += "		<schema>"+dataSource+"</schema>\n";
				dataXml += "		<dbtype>postgis</dbtype>\n";
				dataXml += "	</connectionParameters>\n";
				dataXml += "</dataStore>\n";
				
				logger.info("dataSourceXML:"+dataXml);
	
				obj = new URL(url);
				con2 = (HttpURLConnection) obj.openConnection();
	
				con2.setRequestMethod("POST");
				con2.setRequestProperty("Authorization", "Basic " + AUTH_USER);
				con2.setRequestProperty("accept", "application/xml");
				con2.setRequestProperty("content-type", "application/xml");
				con2.setDoOutput(true);
				con2.setUseCaches(false);
				con2.setDefaultUseCaches(false);
				
				os = con2.getOutputStream();
				wr = new DataOutputStream(os);
				wr.writeBytes(dataXml);
				wr.flush();
				
				inputStream = con2.getInputStream();
				inputStreamReader = new InputStreamReader(inputStream, charset);
				inWn = new BufferedReader(inputStreamReader);
				String rsLine;
				StringBuffer rsData = new StringBuffer();
	
				while ((rsLine = inWn.readLine()) != null) {
					rsData.append(rsLine);
				}
				
				result="DONE";
				
			}else {
				
	
				LinkedHashMap<String, Object> dataStore=(LinkedHashMap<String, Object>)rsHashMap.get("dataStores");
				ArrayList<LinkedHashMap<String, Object>> dataList = (ArrayList<LinkedHashMap<String, Object>>) dataStore.get("dataStore");
				
				List<String> storeNm = new ArrayList<>();
				
				for(int i=0;i<dataList.size();i++) {
					storeNm.add((String) dataList.get(i).get("name"));
				}
				
				if(storeNm.size() != 0 && !storeNm.contains(dataSource)) {
					
					// create dataStore
					String dataXml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
					dataXml += "<dataStore>\n";
					dataXml += "	<name>" + dataSource + "</name>";
					dataXml += "	<connectionParameters>\n";
					dataXml += "		<host>"+GEO_DB_HOST+"</host>\n";
					dataXml += "		<port>"+GEO_DB_PORT+"</port>\n";
					//dataXml += "		<database>"+workspace+"</database>\n";
					dataXml += "		<database>"+GEO_DB_NAME+"</database>\n";
					dataXml += "		<user>"+GEO_DB_USER+"</user>\n";
					dataXml += "		<passwd>"+GEO_DB_PASSWORD+"</passwd>\n";
					//dataXml += "		<passwd></passwd>\n";
					dataXml += "		<schema>"+dataSource+"</schema>\n";
					dataXml += "		<dbtype>postgis</dbtype>\n";
					dataXml += "	</connectionParameters>\n";
					dataXml += "</dataStore>\n";
					
					obj = new URL(url);
					con = (HttpURLConnection) obj.openConnection();
	
					con.setRequestMethod("POST");
					con.setRequestProperty("Authorization", "Basic " + AUTH_USER);
					con.setRequestProperty("accept", "application/xml");
					con.setRequestProperty("content-type", "application/xml");
					con.setDoOutput(true);
					con.setUseCaches(false);
					con.setDefaultUseCaches(false);
					
					os = con.getOutputStream();
					wr = new DataOutputStream(os);
					wr.writeBytes(dataXml);
					wr.flush();
					
					inputStream = con.getInputStream();
					inputStreamReader = new InputStreamReader(inputStream, charset);
					inWn = new BufferedReader(inputStreamReader);
					String rsLine;
					StringBuffer rsData = new StringBuffer();
	
					while ((rsLine = inWn.readLine()) != null) {
						rsData.append(rsLine);
					}
				}
				
				result="DONE";
			}

		} catch (MalformedURLException e) {
			logger.error("createDatasource Error - MalformedURLException");
		} catch (IOException e) {
			logger.error("createDatasource Error - IOException");
		}  catch (Exception e) {
			logger.error("createDatasource Error");
		} finally {
			try {
				if(os != null) os.close();
				if(inputStream != null) inputStream.close();
				if(inputStreamReader != null) inputStreamReader.close();
				if(wr != null) wr.close();
				if(inWn != null) inWn.close();
				if(inDataStore != null) inDataStore.close();
				if(con != null) con.disconnect();
				if(con2 != null) con2.disconnect();
			} catch (IOException e) {
				logger.error("close Error - IOException");
			}
		}
		return result;
	}

	public String deleteDatasource(String workspace, String dataSource) {
		String result="";
		String AUTH_USER=Base64.getEncoder().encodeToString(GEO_USER_INFO.getBytes(StandardCharsets.UTF_8));
		
		String url =GEO_URL+"/rest/workspaces/w_"+workspace+"/datastores/"+dataSource;
		HttpURLConnection con = null;
		try {
			URL obj = new URL(url);
			con = (HttpURLConnection)obj.openConnection();

			con.setRequestMethod("DELETE");
			con.setRequestProperty("Authorization","Basic "+AUTH_USER);
			con.setRequestProperty("accept", "application/json");
			con.setRequestProperty("content-type", "application/json");
			con.setDoOutput(true);
			con.setUseCaches(false);
			con.setDefaultUseCaches(false);
		} catch (IOException e) {
			logger.error("deleteDatasource Error-IOException");
		} catch (Exception e) {
			logger.error("deleteDatasource Error");
		} finally {
			if(con != null) con.disconnect();
		}
		return result;
		
	}
	
	public String addShpLayer(String workspace, String dataStore, String layerName) {
	
		String result="";
		
		String AUTH_USER=Base64.getEncoder().encodeToString(GEO_USER_INFO.getBytes(StandardCharsets.UTF_8));
		
		String url = GEO_URL+"/rest/workspaces/w_"+workspace+"/datastores/"+dataStore+"/featuretypes/";
		BufferedReader inWn = null;
		InputStream inSt = null;
		InputStreamReader inStr = null;
		HttpURLConnection con = null;
		DataOutputStream wr = null;
		try {
			URL obj = new URL(url);
			con = (HttpURLConnection)obj.openConnection();
			
			con.setRequestMethod("POST");
			con.setRequestProperty("Authorization","Basic "+AUTH_USER);
			con.setRequestProperty("accept", "application/json");
			con.setRequestProperty("content-type", "application/xml");
			con.setDoOutput(true);
			con.setUseCaches(false);
			con.setDefaultUseCaches(false);
			
			String featrStr = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
			featrStr += "	<featureType>\n";
			featrStr += "		<name>"+layerName.toLowerCase().trim()+"</name>\n";
			featrStr += "	</featureType>\n";
			
			
			logger.info("add layer xml:"+featrStr);

			wr = new DataOutputStream(con.getOutputStream());
			wr.writeBytes(featrStr);
			wr.flush();
			wr.close();
			
			Charset charset = Charset.forName("UTF-8");
			inSt = con.getInputStream();
			inStr = new InputStreamReader(inSt, charset);
			inWn = new BufferedReader(inStr);
			String rsLine;
			StringBuffer rs = new StringBuffer();

			while ((rsLine = inWn.readLine()) != null) {
				rs.append(rsLine);
			}
			result="OK";
			
		} catch (IOException e) {
			result="FAIL";
			logger.error("Data Access Error-IOException");
		} finally {
			try {
				if(inWn != null) inWn.close();
				if(inSt != null) inSt.close();
				if(inStr != null) inStr.close();
				if(wr != null) wr.close();
				if(con != null) con.disconnect();
			} catch (IOException e) {
				logger.error("close Error-IOException");
			}
		}
				
		return result;
	}
	
	public HashMap<String, String> deleteLayer(String workspace, String layerName) {
		HashMap<String, String> result = new HashMap<String, String>();
		
		String AUTH_USER = Base64.getEncoder().encodeToString(GEO_USER_INFO.getBytes(StandardCharsets.UTF_8));
		String url = GEO_URL + "/rest/workspaces/w_"+workspace+"/layers/"+layerName;
		
		URL obj;
		BufferedReader inDataStore = null;
		HttpURLConnection con = null;
		InputStream inputStream = null;
		InputStreamReader inputStreamReader = null;
		try {
			
			obj = new URL(url);
			
			con = (HttpURLConnection)obj.openConnection();
			con.setRequestMethod("DELETE");
			con.setRequestProperty("Authorization","Basic "+AUTH_USER);
			con.setRequestProperty("accept", "text/html");
			con.setRequestProperty("content-type", "application/json");
			con.setDoOutput(true);
			con.setUseCaches(false);
			con.setDefaultUseCaches(false);
			
			Charset charset = Charset.forName("UTF-8");
			
			inputStream = con.getInputStream();
			inputStreamReader = new InputStreamReader(inputStream, charset);
			inDataStore =new BufferedReader(inputStreamReader);
			String inputLine;
			StringBuffer response = new StringBuffer();
				
			while((inputLine = inDataStore.readLine()) !=null) {
				response.append(inputLine);
			}
			
			result.put("STATUS", "OK");
			result.put("INFO", response.toString());
			
			
		} catch (IOException e) {
			result.put("STATUS", "FAIL");
			result.put("INFO", "none");
			
			logger.error("Data Access Error-IOException");
		} finally {
			try {
				if(inputStream != null) inputStream.close();
				if(inputStreamReader != null) inputStreamReader.close();
				if(inDataStore != null) inDataStore.close();
				if(con != null) con.disconnect();
			} catch (IOException e) {
				logger.error("close Error-IOException");
			}
		}
		
		return result;
	}
	
	public HashMap<String, String> layerJsonInfo(String workspace,String dataSource,String layerName) {
		
		HashMap<String, String> result= new HashMap<String, String>();
		
		String AUTH_USER=Base64.getEncoder().encodeToString(GEO_USER_INFO.getBytes(StandardCharsets.UTF_8));
		
		String url =GEO_URL+"/rest/workspaces/w_"+workspace+"/datastores/"+dataSource+"/featuretypes/"+layerName+".json";
		
		URL obj;
		BufferedReader inDataStore = null;
		InputStream inputStream = null;
		InputStreamReader inputStreamReader = null;
		HttpURLConnection con = null;
		try {
			obj = new URL(url);
			con = (HttpURLConnection)obj.openConnection();
			con.setRequestMethod("GET");
			con.setRequestProperty("Authorization","Basic "+AUTH_USER);
			con.setRequestProperty("accept", "text/html");
			con.setRequestProperty("content-type", "application/json");
			con.setDoOutput(true);
			con.setUseCaches(false);
			con.setDefaultUseCaches(false);
			
			Charset charset = Charset.forName("UTF-8");
			
			inputStream = con.getInputStream();
			inputStreamReader = new InputStreamReader(inputStream, charset);
			inDataStore =new BufferedReader(inputStreamReader);
			String inputLine;
			StringBuffer response = new StringBuffer();
			    
			while((inputLine = inDataStore.readLine()) !=null) {
			   response.append(inputLine);
			}
			
			result.put("STATUS", "OK");
			result.put("INFO", response.toString());
			
		} catch (IOException e) {

			result.put("STATUS", "FAIL");
			result.put("INFO", "none");
			
			logger.error("Data Access Error-IOException");
		}
		finally {
			try {
				if(inDataStore != null) inDataStore.close();
				if(inputStream != null) inputStream.close();
				if(inputStreamReader != null) inputStreamReader.close();
				if(con != null) con.disconnect();
			} catch (IOException e) {
				logger.error("close Error-IOException");
			}
		}
		return result;
	}
	
	public HashMap<String, String> setProjectionLayer(String workspace, String datastore,String layerName, String srs){
		
		HashMap<String, String> result = new HashMap<>();
		
		String AUTH_USER=Base64.getEncoder().encodeToString(GEO_USER_INFO.getBytes(StandardCharsets.UTF_8));
		
		String url=GEO_URL+"/rest/workspaces/w_"+workspace+"/datastores/"+datastore+"/featuretypes/"+layerName;
		
		URL obj;
		BufferedReader inWn = null;
		HttpURLConnection con = null;
		OutputStream os = null;
		InputStream inputStream = null;
		InputStreamReader inputStreamReader = null;
		DataOutputStream wr = null;
		try {
			obj = new URL(url);
			
			con = (HttpURLConnection)obj.openConnection();
			con.setRequestMethod("PUT");
			con.setRequestProperty("Authorization","Basic "+AUTH_USER);
			con.setRequestProperty("accept", "application/json");
			con.setRequestProperty("content-type", "application/xml");
			con.setDoOutput(true);
			con.setUseCaches(false);
			con.setDefaultUseCaches(false);
			
			String crsXml="<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
				   crsXml+="<featureType><srs>"+srs+"</srs></featureType>";
			
		    os = con.getOutputStream();
			wr = new DataOutputStream(os);
			
			wr.writeBytes(crsXml);
			wr.flush();

			Charset charset = Charset.forName("UTF-8");
			inputStream = con.getInputStream();
			inputStreamReader = new InputStreamReader(inputStream, charset);
			inWn = new BufferedReader(inputStreamReader);
			String rsLine;
			StringBuffer rs = new StringBuffer();

			while ((rsLine = inWn.readLine()) != null) {
				rs.append(rsLine);
			}
			
			result.put("STATUS", "OK");
			result.put("Projection", srs);
			result.put("INFO", rs.toString());
			
		} catch (IOException e) {
			
			result.put("STATUS", "FAIL");
			result.put("INFO", "none");
			result.put("Projection", "");
			
			logger.error("Data Access Error-IOException");
		} finally {
			try {
				if(inWn != null) inWn.close();
				if(os != null) os.close();
				if(wr != null) wr.close();
				if(inputStream != null) inputStream.close();
				if(inputStreamReader != null) inputStreamReader.close();
				if(con != null) con.disconnect();
			} catch (IOException e) {
				logger.error("close Error-IOException");
			}
		}
		
		return result;
	}
	
	@SuppressWarnings("unchecked")
	public String checkLayerExist(String workspace,String layerName) {
		
		String result="";
		
		String AUTH_USER=Base64.getEncoder().encodeToString(GEO_USER_INFO.getBytes(StandardCharsets.UTF_8));
		
		String url = GEO_URL+"/rest/workspaces/w_"+workspace+"/layers";
		
		URL obj;
		BufferedReader inDataStore = null;
		HttpURLConnection con = null;
		InputStream inSt = null;
		InputStreamReader inStr = null;
		try {
			obj = new URL(url);
			con = (HttpURLConnection)obj.openConnection();
			con.setRequestMethod("GET");
			con.setRequestProperty("Authorization","Basic "+AUTH_USER);
			con.setRequestProperty("accept", "application/json");
			con.setRequestProperty("content-type", "application/json");
			con.setDoOutput(true);
			con.setUseCaches(false);
			con.setDefaultUseCaches(false);
			
			ObjectMapper mapper = new ObjectMapper();
			Charset charset = Charset.forName("UTF-8");
			
			inSt = con.getInputStream();
			inStr = new InputStreamReader(inSt,charset);
			inDataStore = new BufferedReader(inStr);
			String inputLine;
			StringBuffer response = new StringBuffer();
			    
			while((inputLine = inDataStore.readLine()) !=null) {
			   response.append(inputLine);
			}
			
			Map<String, Object> rsHashMap=(HashMap<String, Object>) mapper.readValue(response.toString(),Map.class);
			
			if(rsHashMap.get("layers") != null && !rsHashMap.get("layers").equals("")) {
				
				LinkedHashMap<String, Object> dataStore=(LinkedHashMap<String, Object>)rsHashMap.get("layers");
				ArrayList<LinkedHashMap<String, Object>> dataList = (ArrayList<LinkedHashMap<String, Object>>) dataStore.get("layer");  
				
				List<String> layerLists = new ArrayList<>();
				
				for(int i=0;i<dataList.size();i++) {
					layerLists.add((String)dataList.get(i).get("name"));
				}
				
				if(layerLists.contains(layerName.toLowerCase())) {
					result="EXIST";
				}else {
					result="NO";
				}
	
			}else {
				result="NO";
			}

		} catch (MalformedURLException e) {
			logger.error("checkLayerExist Error-IOException");
		} catch (IOException e) {
			logger.error("checkLayerExist Error-IOException");
		} catch (Exception e) {
			logger.error("checkLayerExist Error");
		} finally {
			try {
				if(inDataStore != null) inDataStore.close();
				if(con != null) con.disconnect();
				if(inSt != null) inSt.close();
				if(inStr != null) inStr.close();
			} catch (IOException e) {
				logger.error("close Error-IOException");
			}
		}
		return result;
	}
	
	public HashMap<String, String> geoServerInfo(){
		
		HashMap<String, String> result = new HashMap<>();
		
		result.put("url",GEO_URL);
		result.put("user_info", GEO_USER_INFO);
		
		return result;
	}

	@SuppressWarnings("unchecked")
	public String checkStyle(String workspace, String stylesName) {

		String result="";
		
		String AUTH_USER=Base64.getEncoder().encodeToString(GEO_USER_INFO.getBytes(StandardCharsets.UTF_8));
		
		String url =GEO_URL+"/rest/workspaces/w_"+workspace+"/styles";
		
		URL obj;
		BufferedReader inDataStore = null;
		HttpURLConnection con = null;
		InputStream inSt = null;
		InputStreamReader inStr = null;
		try {
			obj = new URL(url);
			con = (HttpURLConnection)obj.openConnection();
			con.setRequestMethod("GET");
			con.setRequestProperty("Authorization","Basic "+AUTH_USER);
			con.setRequestProperty("accept", "application/json");
			con.setRequestProperty("content-type", "application/json");
			con.setDoOutput(true);
			con.setUseCaches(false);
			con.setDefaultUseCaches(false);
		
			ObjectMapper mapper = new ObjectMapper();
			Charset charset = Charset.forName("UTF-8");
			
			inSt = con.getInputStream();
			inStr = new InputStreamReader(inSt,charset);
			inDataStore = new BufferedReader(inStr);
			String inputLine;
			StringBuffer response = new StringBuffer();
			    
			while((inputLine = inDataStore.readLine()) !=null) {
			   response.append(inputLine);
			}
	
			((HttpURLConnection) con).disconnect();
			Map<String, Object> rsHashMap=(HashMap<String, Object>) mapper.readValue(response.toString(),Map.class);
			if(rsHashMap.get("styles") != null && !rsHashMap.get("styles").equals("")) {
				
				LinkedHashMap<String, Object> dataStore=(LinkedHashMap<String, Object>)rsHashMap.get("styles");
				ArrayList<LinkedHashMap<String, Object>> dataList = (ArrayList<LinkedHashMap<String, Object>>) dataStore.get("style");  
	
				List<String> layerLists = new ArrayList<>();
				
				for(int i=0;i<dataList.size();i++) {
					layerLists.add((String)dataList.get(i).get("name"));
				}
				if(layerLists.contains(stylesName.toLowerCase())) {
					result="EXIST";
				}else {
					result="NO";
				}
	
			}else {
				result="NO";
			}
		} catch (ProtocolException e) {
			logger.error("checkStyle Error-ProtocolException");
		} catch (MalformedURLException e) {
			logger.error("checkStyle Error-MalformedURLException");
		} catch (IOException e) {
			logger.error("checkStyle Error-IOException");
		} catch (Exception e) {
			logger.error("checkStyle Error");
		} finally {
			try {
				if(inDataStore != null) inDataStore.close();
				if(inSt != null) inSt.close();
				if(inStr != null) inStr.close();
				if(con != null) con.disconnect();
			} catch (IOException e) {
				logger.error("close Error-IOException");
			}
		}

		return result;
	}

	public String createStyle(String workspace,String styleName, String sldXML)  {
		
		String AUTH_USER=Base64.getEncoder().encodeToString(GEO_USER_INFO.getBytes(StandardCharsets.UTF_8));
		
		String result="";

		String wrkspXml ="<style>\n";
		wrkspXml +="	<name>"+styleName+"</name>\n";
		wrkspXml +="	<filename>"+styleName+".sld</filename>\n";
		wrkspXml +="</style>";
		
		String temp_url = GEO_URL;
		
		String port_arr[] = {"8083","8082","8081"};
		URL obj;
		BufferedReader inWn = null;
		OutputStream os = null;
		HttpURLConnection con = null;
		DataOutputStream wr = null;
		InputStream inputStream = null;
		InputStreamReader inputStreamReader = null;
		
		try {
			for(int i = 0; i< port_arr.length; i++) {
				String url = temp_url.replace("8081", port_arr[i])+"/rest/workspaces/w_"+workspace+"/styles";
				obj = new URL(url);
				con = (HttpURLConnection)obj.openConnection();
			
				con.setRequestMethod("POST");
				con.setRequestProperty("Authorization","Basic "+AUTH_USER);
				con.setRequestProperty("Content-type", "text/xml");
				con.setDoOutput(true);
				con.setUseCaches(false);
				con.setDefaultUseCaches(false);
			
				os = con.getOutputStream();
				wr = new DataOutputStream(os);
				wr.writeBytes(wrkspXml);
				wr.flush();

				Charset charset = Charset.forName("UTF-8");
				inputStream = con.getInputStream();
				inputStreamReader = new InputStreamReader(inputStream, charset);
				inWn = new BufferedReader(inputStreamReader);
				String rsLine;
				StringBuffer rs = new StringBuffer();
				while((rsLine = inWn.readLine()) !=null) {
					rs.append(rsLine);
				}

				((HttpURLConnection) con).disconnect();
			}
			result="DONE";
			
		} catch (IOException e) {
		
			result="FAIL";
			logger.error("Data Access Error-IOException");
		} finally {
			try {
				if(inputStream != null) inputStream.close();
				if(inputStreamReader != null) inputStreamReader.close();
				if(os != null) os.close();
				if(inWn != null) inWn.close();
				if(con != null) con.disconnect();
			} catch (IOException e) {
				logger.error("close Error-IOException");
			}
		}
		return result;
	}
	
	public String editStyleXML(String workspace, String stylesName, HashMap<String, String> data) {
		String result="";
	
		String dataXml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
		dataXml += "<StyledLayerDescriptor version=\"1.0.0\"\n";
		dataXml += "  xsi:schemaLocation=\"http://www.opengis.net/sld http://schemas.opengis.net/sld/1.0.0/StyledLayerDescriptor.xsd\"\n";
		dataXml += "  xmlns=\"http://www.opengis.net/sld\" xmlns:ogc=\"http://www.opengis.net/ogc\"\n";
		dataXml += "  xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">\n";
		dataXml += "<NamedLayer>\n";
		dataXml += "	<Name>" + stylesName + "</Name>\n";
		dataXml += "	<UserStyle>\n";
		dataXml += "		<Title>"+stylesName+"</Title>\n";
		dataXml += "		<FeatureTypeStyle>\n";
		dataXml += "			<Rule>\n";
		dataXml += "				<Title>"+stylesName+"</Title>\n";
		if(data.get("shpDataType").equals("linestring") || data.get("shpDataType").equals("multilinestring")) {
			//stroke
			dataXml += "				<LineSymbolizer>\n";
			dataXml += "					<Stroke>\n";
			dataXml += "						<CssParameter name=\"stroke\">"+data.get("strokeColor")+"</CssParameter>\n";
			dataXml += "						<CssParameter name=\"stroke-width\">"+data.get("strokeWidthSlider")+"</CssParameter>\n";
			dataXml += "						<CssParameter name=\"stroke-opacity\">"+data.get("strokeOpacitySlider")+"</CssParameter>\n";
			dataXml += "						<CssParameter name=\"stroke-dasharray\">"+data.get("strokeDasharray")+"</CssParameter>\n";
			dataXml += "					</Stroke>\n";
			dataXml += "				</LineSymbolizer>\n";
			if(data.get("strokeLabelCheck").equals("Y")) {
				dataXml += "			<TextSymbolizer>\n";
				dataXml += "				<Label>\n";
				dataXml += "					<ogc:Function name=\"centroid\">\n";
				dataXml += "					<ogc:PropertyName>"+data.get("strokeLabel")+"</ogc:PropertyName>\n";
				dataXml += "					</ogc:Function>\n";
				dataXml += "				</Label>\n";
				dataXml += "				<Font>\n";
				dataXml += "					<CssParameter name=\"font-family\">NanumGothicBold</CssParameter>\n";
				dataXml += "					<CssParameter name=\"font-size\">"+data.get("strokeFontSize")+"</CssParameter>\n";
				dataXml += "				</Font>\n";
				dataXml += "				<Fill>\n";
				dataXml += "					<CssParameter name=\"fill\">"+data.get("strokeLabelColor")+"</CssParameter>\n";
				dataXml += "				</Fill>\n";
				dataXml += "				<Halo>\n";
				dataXml += "					<Fill>\n";
				dataXml += "						<CssParameter name=\"fill\">"+data.get("strokeLabelLineColor")+"</CssParameter>\n";
				dataXml += "					</Fill>\n";
				dataXml += "				</Halo>\n";
				dataXml += "			</TextSymbolizer>\n";
			}
		}if(data.get("shpDataType").equals("polygon") || data.get("shpDataType").equals("multipolygon")) {
			//polygon
			dataXml += "				<PolygonSymbolizer>\n";
			dataXml += "					<Fill>\n";
			dataXml += "						<CssParameter name=\"fill\">"+data.get("polygonColor")+"</CssParameter>\n";
			dataXml += "						<CssParameter name=\"fill-opacity\">"+data.get("polygonOpacitySlider")+"</CssParameter>\n";
			dataXml += "					</Fill>\n";
			dataXml += "					<Stroke>\n";
			dataXml += "						<CssParameter name=\"stroke\">"+data.get("polygonStrokeColor")+"</CssParameter>\n";
			dataXml += "						<CssParameter name=\"stroke-width\">"+data.get("polygonStrokeWidthSlider")+"</CssParameter>\n";
			dataXml += "						<CssParameter name=\"stroke-opacity\">"+data.get("polygonStrokeOpacitySlider")+"</CssParameter>\n";
			dataXml += "						<CssParameter name=\"stroke-dasharray\">"+data.get("polygonStrokeDasharray")+"</CssParameter>\n";
			dataXml += "					</Stroke>\n";
			dataXml += "				</PolygonSymbolizer>\n";
			if(data.get("polygonLabelCheck").equals("Y")) {
				dataXml += "			<TextSymbolizer>\n";
				dataXml += "				<Label>\n";
				dataXml += "					<ogc:Function name=\"centroid\">\n";
				dataXml += "					<ogc:PropertyName>"+data.get("polygonLabel")+"</ogc:PropertyName>\n";
				dataXml += "					</ogc:Function>\n";
				dataXml += "				</Label>\n";
				dataXml += "				<Font>\n";
				dataXml += "					<CssParameter name=\"font-family\">NanumGothicBold</CssParameter>\n";
				dataXml += "					<CssParameter name=\"font-size\">"+data.get("polygonFontSize")+"</CssParameter>\n";
				dataXml += "				</Font>\n";
				dataXml += "				<Fill>\n";
				dataXml += "					<CssParameter name=\"fill\">"+data.get("polygonLabelColor")+"</CssParameter>\n";
				dataXml += "				</Fill>\n";
				dataXml += "				<Halo>\n";
				dataXml += "					<Fill>\n";
				dataXml += "						<CssParameter name=\"fill\">"+data.get("polygonLabelLineColor")+"</CssParameter>\n";
				dataXml += "					</Fill>\n";
				dataXml += "				</Halo>\n";
				dataXml += "			</TextSymbolizer>\n";
			}
		}if(data.get("shpDataType").equals("point") || data.get("shpDataType").equals("multipoint")) {
			//point
			dataXml += "				<PointSymbolizer>\n";
			dataXml += "					<Graphic>\n";
			dataXml += "						<Mark>\n";
			dataXml += "							<WellKnownName>"+data.get("wellKnownName")+"</WellKnownName>\n";
			dataXml += "							<Fill>\n";
			dataXml += "								<CssParameter name=\"fill\">"+data.get("pointColor")+"</CssParameter>\n";
			dataXml += "								<CssParameter name=\"fill-opacity\">"+data.get("pointOpacitySlider")+"</CssParameter>\n";
			dataXml += "							</Fill>\n";
			dataXml += "						</Mark>\n";
			dataXml += "						<Size>"+data.get("pointSizeSlider")+"</Size>\n";
			dataXml += "					</Graphic>\n";
			dataXml += "				</PointSymbolizer>\n";
			if(data.get("pointLabelCheck").equals("Y")) {
				dataXml += "			<TextSymbolizer>\n";
				dataXml += "				<Label>\n";
				dataXml += "					<ogc:Function name=\"centroid\">\n";
				dataXml += "					<ogc:PropertyName>"+data.get("pointLabel")+"</ogc:PropertyName>\n";
				dataXml += "					</ogc:Function>\n";
				dataXml += "				</Label>\n";
				dataXml += "				<Font>\n";
				dataXml += "					<CssParameter name=\"font-family\">NanumGothicBold</CssParameter>\n";
				dataXml += "					<CssParameter name=\"font-size\">"+data.get("pointFontSize")+"</CssParameter>\n";
				dataXml += "				</Font>\n";
				dataXml += "				<Fill>\n";
				dataXml += "					<CssParameter name=\"fill\">"+data.get("pointLabelColor")+"</CssParameter>\n";
				dataXml += "				</Fill>\n";
				dataXml += "				<Halo>\n";
				dataXml += "					<Fill>\n";
				dataXml += "						<CssParameter name=\"fill\">"+data.get("pointLabelLineColor")+"</CssParameter>\n";
				dataXml += "					</Fill>\n";
				dataXml += "				</Halo>\n";
				dataXml += "			</TextSymbolizer>\n";
			}
		}
		dataXml += "			</Rule>\n";
		dataXml += "		</FeatureTypeStyle>\n";
		dataXml += "	</UserStyle>\n";
		dataXml += "</NamedLayer>\n";
		dataXml += "</StyledLayerDescriptor>\n";
		result = dataXml;
		
		return result;
	}
	
	public String defaultStyle(String workspace, String stylesName){
		String result="";
		
		String AUTH_USER=Base64.getEncoder().encodeToString(GEO_USER_INFO.getBytes(StandardCharsets.UTF_8));
		
		String port_arr[] = {"8083","8082","8081"};
		
		String  temp_url= GEO_URL;
		String dataXml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
							+"<layer>\t"
								+"<defaultStyle>\t\t"
									+"<name>"+stylesName+"</name>\t"
								+"</defaultStyle>"
							+"</layer>";
		BufferedReader inWn = null;
		HttpURLConnection con = null;
		OutputStream os = null;
		DataOutputStream wr = null;
		InputStream inputStream = null;
		InputStreamReader inputStreamReader = null;
		try {
			for(int i=0;i<port_arr.length;i++) {
				
				String url = temp_url.replace("8081", port_arr[i])+"/rest/workspaces/w_"+workspace+"/layers/"+stylesName;
				URL obj = new URL(url);
				con = (HttpURLConnection)obj.openConnection();
			
				con.setRequestMethod("PUT");
				con.setRequestProperty("Authorization","Basic "+AUTH_USER);
				con.setRequestProperty("accept", "application/json");
				con.setRequestProperty("content-type", "application/xml");
				con.setDoOutput(true);
				con.setUseCaches(false);
				con.setDefaultUseCaches(false);
			
				os = con.getOutputStream();
				wr = new DataOutputStream(os);
				wr.writeBytes(dataXml);
				wr.flush();
				wr.close();
			
				Charset charset = Charset.forName("UTF-8");
				inputStream = con.getInputStream();
				inputStreamReader = new InputStreamReader(inputStream, charset);
				inWn = new BufferedReader(inputStreamReader);
				String rsLine;
				StringBuffer rs = new StringBuffer();
				while((rsLine = inWn.readLine()) !=null) {
					rs.append(rsLine);
				}

				((HttpURLConnection) con).disconnect();
			}
			
			result="DONE";
			
		} catch (IOException e) {
		
			result="FAIL";
			logger.error("Data Access Error-IOException");
		} finally {
			try {
				if(os != null) os.close();
				if(inputStream != null) inputStream.close();
				if(inputStreamReader != null) inputStreamReader.close();
				if(wr != null) wr.close();
				if(inWn != null) inWn.close();
				if(con != null) con.disconnect();
			} catch (IOException e) {
				logger.error("close Error-IOException");
			}
		}
		return result;
	}
	public String deleteStyle(String workspace, String stylesName) {
		String result="";
		
		String AUTH_USER=Base64.getEncoder().encodeToString(GEO_USER_INFO.getBytes(StandardCharsets.UTF_8));
		
		
			String temp_url = GEO_URL;
			Request request = null;
			try {
				String port_arr[] = {"8083","8082","8081"};
				for(int i=0;i<port_arr.length;i++) {
					String url = temp_url.replace("8081", port_arr[i])+"/rest/workspaces/w_"+workspace+"/styles/"+ stylesName;
					request = Request.Delete(url);
					request.setHeader("Authorization", "Basic "+AUTH_USER);
					request.setHeader("Content-Type", "application/vnd.ogc.sld+xml");
					request.execute();
				} 
			}catch (ClientProtocolException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				result="FAIL";
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				result="FAIL";
			}
			result="DONE";
			
		
		
		return result;
	}
	
	public String editStyle(String workspace, String stylesName, String sldPath){
		String result="";
		
		String AUTH_USER=Base64.getEncoder().encodeToString(GEO_USER_INFO.getBytes(StandardCharsets.UTF_8));

		FileReader filereader = null;
		BufferedReader br = null;
		Request request = null;
		try {

			File file = new File(sldPath);
			filereader = new FileReader(file);
			br = new BufferedReader(filereader);
			String body = "";
			String line = "";
			while ((line = br.readLine()) != null){
				body += line;
			}

			String temp_url = GEO_URL;
			
			String port_arr[] = {"8083","8082","8081"};
			for(int i=0;i<port_arr.length;i++) {
				String url = temp_url.replace("8081", port_arr[i])+"/rest/workspaces/w_"+workspace+"/styles";
				request = Request.Post(url);
				request.bodyString(body,ContentType.APPLICATION_FORM_URLENCODED);
				request.setHeader("Authorization", "Basic "+AUTH_USER);
				request.setHeader("Content-Type", "application/vnd.ogc.sld+xml");
				request.execute();
			}

			result="DONE";
		} catch (IOException e) {
			result="FAIL";
			logger.error("Data Access Error-IOException");
		} finally {
			try {
				if(filereader != null) filereader.close();
				if(br != null) br.close();
			} catch (IOException e) {
				logger.error("close Error-IOException");
			}
		}
		return result;
	}
	
	public String addExceptionShpLayer(String workspace,String datastore,String shpZipFile) {
		String result="";
		
		String url = GEO_URL+"/rest/workspaces/w_"+workspace+"/datastores/"+datastore+"/file.shp";
		
		String AUTH_USER=Base64.getEncoder().encodeToString(GEO_USER_INFO.getBytes(StandardCharsets.UTF_8));
		
		PrintWriter writer = null;
		OutputStream outputStream = null;
		OutputStreamWriter outputSW = null;
		BufferedOutputStream bos = null;
		BufferedInputStream bis = null;
		FileInputStream fis = null;
		InputStream inputStream = null;
		HttpURLConnection con = null;
		try {
			
			URL obj = new URL(url);
			con = (HttpURLConnection)obj.openConnection();
			
			con.setRequestMethod("PUT");
			con.setRequestProperty("Authorization","Basic "+AUTH_USER);
			con.setRequestProperty("Content-type", "application/zip");
			con.setDoOutput(true);
			con.setUseCaches(false);
			
			outputStream = con.getOutputStream();
			outputSW = new OutputStreamWriter(outputStream);
			writer = new PrintWriter(outputSW,true);
			writer.append("Content-type:application/zip");
			
			bos = new BufferedOutputStream(outputStream);
			fis = new FileInputStream(shpZipFile);
			bis = new BufferedInputStream(fis);
			
			int i;
			
			// read byte by byte until end of stream
			while ((i = bis.read()) > -1) {
				bos.write(i);
			}
			
			int responseCode = ((HttpURLConnection) con).getResponseCode();
			
			if ((responseCode >= 200) && (responseCode <= 202)) {
				inputStream = ((HttpURLConnection) con).getInputStream();
				int j;
				while ((j = inputStream.read()) > 0) {
					logger.info(Integer.toString(j));
				}

			} else {
				inputStream = ((HttpURLConnection) con).getErrorStream();
			}
			
			((HttpURLConnection) con).disconnect();
			
			result="DONE";
			
		} catch (IOException e) {
			logger.error("Data Access Error-IOException");
		} finally {
			try {
				if(inputStream != null) inputStream.close();
				if(con != null) con.disconnect();
				if(bis != null) bis.close();
				if(fis != null) fis.close();
				if(bos != null) bos.close();
				if(writer != null) writer.close();
				if(outputStream != null)outputStream.close();
				if(outputSW != null)outputSW.close();
			} catch (IOException e) {
				logger.error("close Error-IOException");
			}
		}
		
		return result;
	}
	
	public void reloadConfig() {
		
		String url = GEO_URL+"/rest/reset";
		String AUTH_USER=Base64.getEncoder().encodeToString(GEO_USER_INFO.getBytes(StandardCharsets.UTF_8));
		
		URL obj;
		HttpURLConnection con = null;
		try {
			
			obj = new URL(url);
			con = (HttpURLConnection)obj.openConnection();
			
			con.setRequestMethod("PUT");
			con.setRequestProperty("Authorization","Basic "+AUTH_USER);
			con.setRequestProperty("Content-type", "application/zip");
			con.setDoOutput(true);
			con.setUseCaches(false);
			
		} catch (MalformedURLException e) {
			logger.error("reloadConfig Error-MalformedURLException");
		} catch (IOException e) {
			logger.error("reloadConfig Error-IOException");
		} catch (Exception e) {
			logger.error("reloadConfig Error");
		} finally {
			if(con != null) con.disconnect();
		}
		
	}
	
	public boolean searchLayerGroup(HashMap<String, Object> param) {

		boolean check = false;
		String groupName = String.valueOf(param.get("groupName"));
		
		String AUTH_USER=Base64.getEncoder().encodeToString(GEO_USER_INFO.getBytes(StandardCharsets.UTF_8));
		String url = GEO_URL+"/rest/layergroups/"+groupName;
		
		BufferedReader in = null;
		URL obj;
		HttpURLConnection con = null;
		InputStream inputStream = null;
		InputStreamReader inputStreamReader = null;
		try {
			obj = new URL(url);
			con = (HttpURLConnection)obj.openConnection();
			con.setRequestMethod("GET");
			con.setRequestProperty("Authorization","Basic "+AUTH_USER);
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
	        
	        while((inputLine = in.readLine()) !=null) {
	        	response.append(inputLine);
	        }
			
	        String returnValue= response.toString();
	        JSONObject extent = new JSONObject(returnValue);
	       
	        if(extent.isNull("layerGroup")) {
	        	check=false;
	        }else {
	        	check=true;
	        }
	        
		} catch (MalformedURLException e) {
			
			logger.error("checkWorkspace Error-MalformedURLException");
			check = false;
			
		} catch (IOException e) {
			
			logger.error("checkWorkspace Error-IOException");
			check = false;
			
		} catch (Exception e) {
			
			logger.error("checkWorkspace Error");
			check = false;
			
		}  finally {
			try {
		    	if(in != null) in.close();
		    	if(inputStream != null) inputStream.close();
		    	if(inputStreamReader != null) inputStreamReader.close();
		    	if(con != null) con.disconnect();
			} catch (IOException e) {
				logger.error("close Error-IOException");
			}
		}
		
		return check;
		
	}
	
	public boolean createLayerGroup(HashMap<String, Object> param,String[] layers) {

		boolean check = false;
		String workspace = String.valueOf(param.get("workspace"));
		String groupName = String.valueOf(param.get("groupName"));
		
		String minx = String.valueOf(param.get("minx"));
		String miny = String.valueOf(param.get("miny"));
		String maxx = String.valueOf(param.get("maxx"));
		String maxy = String.valueOf(param.get("maxy"));
		
		String epsgCode = String.valueOf(param.get("epsg"));
		
		String AUTH_USER=Base64.getEncoder().encodeToString(GEO_USER_INFO.getBytes(StandardCharsets.UTF_8));
		
		String wrkspXml ="<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
		   wrkspXml +="<layerGroup>\n";
		   wrkspXml +="	<name>"+groupName+"</name>\n";
		   wrkspXml +="	<mode>SINGLE</mode>\n";
		   wrkspXml +="	<title>"+groupName+"</title>\n";
		   wrkspXml +="	<workspace>\n";
		   wrkspXml +="		<name>"+workspace+"</name>\n";
		   wrkspXml +="	</workspace>\n";
		   wrkspXml +="	<layers>\n";
		   for(int i=0;i<layers.length;i++) {
			   wrkspXml +="	<layer>\n";
			   wrkspXml +="		<name>"+layers[i]+"</name>\n";
			   wrkspXml +="	</layer>\n";
		   }
		   wrkspXml +="	</layers>\n";
		   wrkspXml +="	<bounds>\n";
		   wrkspXml +="		<minx>"+minx+"</minx>\n";
		   wrkspXml +="		<miny>"+miny+"</miny>\n";
		   wrkspXml +="		<maxx>"+maxx+"</maxx>\n";
		   wrkspXml +="		<maxy>"+maxy+"</maxy>\n";
		   wrkspXml +="		<crs>"+epsgCode+"</crs>\n";
		   wrkspXml +="	</bounds>\n";
		   wrkspXml +="</layerGroup>";
		   
		String url = GEO_URL+"/rest/workspaces/w_"+workspace+"/"+groupName;
		
		URL obj;
		BufferedReader inWn = null;
		DataOutputStream wr = null;
		OutputStream os = null;
		HttpURLConnection con = null;
		try {
			obj = new URL(url);
			con = (HttpURLConnection)obj.openConnection();
			
			con.setRequestMethod("POST");
			con.setRequestProperty("Authorization","Basic "+AUTH_USER);
			con.setRequestProperty("accept", "application/json");
			con.setRequestProperty("content-type", "application/xml");
			con.setDoOutput(true);
			con.setUseCaches(false);
			con.setDefaultUseCaches(false);
			   	
			os = con.getOutputStream();
			wr = new DataOutputStream(os);
			wr.write(wrkspXml.getBytes("UTF-8"));
			
			int status = con.getResponseCode();
			
			if(status==200 || status == 201) {
				check=true;
			}else {
				check=false;
			}
			
		} catch (IOException e) {
			logger.error("Data Access Error-IOException");
		} finally {
			try {
				if(os != null) os.close();
				if(inWn != null) inWn.close();
				if(wr != null) wr.close();
				if(con != null) con.disconnect();
			} catch (IOException e) {
				logger.error("close Error-IOException");
			}
		}
		
		return check;
		
	}
public HashMap<String, Object> getLayerLists(String workspace, String type) {
		
		String result = "";
		HashMap<String, Object> jsonMap = new HashMap<>();
		
		String AUTH_USER=Base64.getEncoder().encodeToString(GEO_USER_INFO.getBytes(StandardCharsets.UTF_8));
		String resultType="";
		
		if(type.equals("json")) {
			resultType="json";
		}else if(type.equals("xml")) {
			resultType="xml";
		}
		
		String url = GEO_URL+"/rest/workspaces/w_"+workspace+"/layers."+resultType;
		BufferedReader in = null;
		InputStream inputStream = null;
		InputStreamReader inputStreamReader = null;
		HttpURLConnection con = null;
		URL obj;
		
		try {
			obj = new URL(url);
			con = (HttpURLConnection)obj.openConnection();
			con.setRequestMethod("GET");
			con.setRequestProperty("Authorization","Basic "+AUTH_USER);
			con.setRequestProperty("accept", "text/html");
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
	        
	        while((inputLine = in.readLine()) !=null) {
	        	response.append(inputLine);
	        }
			
	        result = response.toString();
	        
	        jsonMap = new ObjectMapper().readValue(result, HashMap.class);
	        
		}catch (JsonParseException e) {
			logger.error("get qgis plugin error-MalformedURLException");
	    } catch (JsonMappingException e) {
	    	logger.error("get qgis plugin error-MalformedURLException");
	    } catch (MalformedURLException e) {
			logger.error("get qgis plugin error-MalformedURLException");
		} catch (IOException e) {
			logger.error("get qgis plugin error-IOException");
		} catch (Exception e) {
			logger.error("get qgis plugin error");
		}  finally {
			try {
		    	if(in != null) in.close();
		    	if(inputStream != null) inputStream.close();
		    	if(inputStreamReader != null) inputStreamReader.close();
		    	if(con != null) con.disconnect();
			} catch (IOException e) {
				logger.error("close Error-IOException");
			}
		}
		
		return jsonMap;
	}
}