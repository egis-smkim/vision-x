package com.vision_x.vision_x.utils;

import java.io.IOException;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.FilterConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class SessionTimeoutCookieFilter implements Filter {
 
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletResponse response = (HttpServletResponse) servletResponse;
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        String path = request.getRequestURI();
        if(!path.equals("/member/sessionCheck.do")) {
            long serverTime = System.currentTimeMillis();
            long sessionExpiryTime = serverTime + request.getSession().getMaxInactiveInterval() * 1000;
            Cookie cookie = new Cookie("latestTouch", "" + serverTime);
            cookie.setSecure(true);
            cookie.setPath("/");
            response.addCookie(cookie);
            cookie = new Cookie("sessionExpiry", "" + sessionExpiryTime);
            cookie.setSecure(true);
            cookie.setPath("/");
            response.addCookie(cookie);
            
    		request.getSession().setAttribute("sessionExpiry", sessionExpiryTime);
    		request.getSession().setAttribute("latestTouch", serverTime);
        }

        filterChain.doFilter(servletRequest, servletResponse);
    }
 
    @Override
    public void destroy() {
    }
 
    @Override
    public void init(FilterConfig arg0) throws ServletException {
    }
     
}
