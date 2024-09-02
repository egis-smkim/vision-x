package com.vision_x.vision_x.utils;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Arrays;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class BimPorcessService {

	protected Logger logger = LoggerFactory.getLogger(this.getClass());
	
	public boolean processBim(String paramJson) {
		boolean result = false;
		
		ProcessBuilder processBuilder = null;
		
		InputStream stderr= null;
		InputStreamReader isr = null;
		BufferedReader br = null;
		
		String convertCommand[]=new String[] {"/hadoop/bin/hadoop", "jar" ,"/hadoop/lib/XDBuilderMR_dt.jar", "com.egiskorea.XDBuilder", "createbim", paramJson};
		
		logger.info(Arrays.toString(convertCommand));
		
		Process process = null;
		
		try {
			processBuilder = new ProcessBuilder(convertCommand);
			processBuilder.redirectErrorStream(true);
			process = processBuilder.start();
			
			stderr = process.getInputStream();
			isr = new InputStreamReader(stderr);
			br = new BufferedReader(isr);
			
			String outLine = null;
			
			while((outLine = br.readLine()) != null) {
				logger.info("CONVERT COMMAND LINE::::"+outLine);
			}
			
			long pid = process.pid();
			
			process.waitFor();
			
			if(process.exitValue() == 0) {
				logger.info("processing convert is done");
				result=true;
			}
			
		} catch (InterruptedException e) {
			logger.error("Thread Error-InterruptedException");
		} catch (IOException e) {
			logger.error("Data Access Error-IOException");
		}finally {
			
			try {
				if(stderr != null ) {
					stderr.close();
				}
				
				if(isr != null ) {
					isr.close();
				}
				
				if(br != null ) {
					br.close();
				}
				
				if(process != null) {
					process.destroy();
				}
				
			} catch (IOException e) {
				logger.error("Data Access Error-IOException");
			}
			
		}
		
		return result;
	}
}
