package com.notequick.backend.utils;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class HttpResponse {


    private int status_code ;
    private String message ;
    private String other_message ;
    private List<?> data ;


    public HttpResponse(int code, String msg , String other_msg){
        this.status_code = code ;
        this.message = msg ;
        this.other_message = other_msg ;
    }

    public HttpResponse(int code,String msg ,List<?> ls){
        this.status_code = code ;
        this.message = msg ;
        this.data = ls ;
    }

    public HttpResponse(int code,String msg){
        this.status_code = code ;
        this.message = msg ;
    }

}