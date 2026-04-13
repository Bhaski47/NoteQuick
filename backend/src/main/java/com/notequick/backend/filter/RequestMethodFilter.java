package com.notequick.backend.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;


public class RequestMethodFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String expectedMethod = "GET";
        String actualMethod = request.getMethod();

        if (!expectedMethod.equalsIgnoreCase(actualMethod)) {
            // Throw an exception or send an error response
            response.sendError(HttpServletResponse.SC_METHOD_NOT_ALLOWED, "Request method " + actualMethod + " is not supported");
            return; // Stop further processing
        }

        // Proceed to the next filter or controller
        filterChain.doFilter(request, response);
    }
}