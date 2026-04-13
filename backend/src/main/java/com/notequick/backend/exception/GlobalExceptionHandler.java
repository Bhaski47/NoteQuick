package com.notequick.backend.exception;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import org.hibernate.query.sqm.ParsingException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<HashMap<String,Object>> handleMethodNotSupported(HttpRequestMethodNotSupportedException ex) {
        HashMap<String,Object> map = new HashMap<>();
        map.put("status", HttpStatus.METHOD_NOT_ALLOWED.value());
        map.put("message", "Request method " + ex.getMethod() + " is not supported");
        return ResponseEntity.status(HttpStatus.OK)
                .body(map);
    }

    @ExceptionHandler({ExpiredJwtException.class,JwtException.class, MalformedJwtException.class, SignatureException.class})
    public ResponseEntity<HashMap<String,Object>> handleJwtException(JwtException ex) {
        HashMap<String,Object> map = new HashMap<>();
        map.put("status", HttpStatus.UNAUTHORIZED.value());
        map.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.OK)
                .body(map);
    }

    @ExceptionHandler(ParsingException.class)
    public ResponseEntity<HashMap<String,Object>> handleParsingException(ParsingException ex) {
        LinkedHashMap<String,Object> map = new LinkedHashMap<>();
        map.put("status", HttpStatus.OK.value());
        map.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(map);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationErrors(MethodArgumentNotValidException ex) {
        LinkedHashMap<String,Object> response = new LinkedHashMap<>();
        response.put("status", HttpStatus.BAD_REQUEST.value());

        List<Map<String, String>> errors = ex.getBindingResult().getFieldErrors()
                .stream()
                .map(error -> {
                    Map<String, String> errorDetail = new HashMap<>();
                    errorDetail.put("other_message", error.getField());
                    errorDetail.put("message", error.getDefaultMessage());
                    return errorDetail;
                })
                .collect(Collectors.toList());

        response.put("message", "Something went wrong");
        response.put("other_message",errors);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @ExceptionHandler(InvalidCredentialException.class)
    public ResponseEntity<HashMap<String,Object>> handleInvalidCredentialException(InvalidCredentialException ex) {
        LinkedHashMap<String,Object> map = new LinkedHashMap<>();
        map.put("status", HttpStatus.UNAUTHORIZED.value());
        map.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.OK).body(map);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<HashMap<String,Object>> handleException(Exception ex) {
        LinkedHashMap<String,Object> map = new LinkedHashMap<>();
        map.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        map.put("message", "Exception error "+ex.getMessage());
        return ResponseEntity.status(HttpStatus.OK).body(map);
    }
}