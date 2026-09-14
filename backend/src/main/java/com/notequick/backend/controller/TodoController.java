package com.notequick.backend.controller;

import com.notequick.backend.entity.Todo;
import com.notequick.backend.exception.InvalidCredentialException;
import com.notequick.backend.service.TodoService;
import com.notequick.backend.utils.HttpResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/todos")
public class TodoController {

    @Autowired
    private TodoService todoService;

    @PostMapping("/getTodos")
    public ResponseEntity<HashMap<String,Object>> getTodos(@RequestHeader(value = "Authorization",defaultValue = "") String token,
                                                           @RequestBody(required = false) Map<String, String> requestBody) {
        String status = (requestBody != null) ? requestBody.getOrDefault("status", "ALL") : "ALL";
        String order = (requestBody != null) ? requestBody.getOrDefault("order", "DESC") : "DESC";
        List<Todo> response = todoService.getTodo(token, status, order);
        LinkedHashMap<String,Object> res = new LinkedHashMap<>();
        res.put("status", HttpStatus.OK.value());
        res.put("message", "Todo Acquired Successfully");
        res.put("data", response);
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @PostMapping("/addTodo")
    public ResponseEntity<HttpResponse> addTodo(@RequestHeader(value = "Authorization",defaultValue = "") String token,
            @RequestBody Todo todo) throws InvalidCredentialException,Exception {
        todoService.addTodo(token,todo);
        HttpResponse http = new HttpResponse(HttpStatus.OK.value(), "Todo Added");
        return new ResponseEntity<>(http, HttpStatus.OK);
    }

    @PostMapping("/deleteTodo")
    public ResponseEntity<HttpResponse> deleteTodo(@RequestHeader(value = "Authorization",defaultValue = "") String token,
                                                @RequestBody HashMap<String,Object> map) throws Exception {
        todoService.deleteTodo(token,map.get("todoId").toString());
        HttpResponse http = new HttpResponse(HttpStatus.OK.value(), "Deleted Todo Task");
        return new ResponseEntity<>(http, HttpStatus.OK);
    }

    @PostMapping("/updateTodo")
    public ResponseEntity<HttpResponse> updateTodo(@RequestHeader(value = "Authorization",defaultValue = "") String token,
                                                   @RequestBody Todo todo) throws Exception {
        todoService.updateTodo(token,todo);
        HttpResponse http = new HttpResponse(HttpStatus.OK.value(), "Updated Todo Task");
        return new ResponseEntity<>(http, HttpStatus.OK);
    }

    @PostMapping("/searchTodo")
    public ResponseEntity<HashMap<String,Object>> searchTodo(@RequestHeader(value = "Authorization",defaultValue = "") String token,
                                                             @RequestBody Map<String, String> requestBody) throws Exception {
        String query = requestBody.getOrDefault("query", "");
        String status = requestBody.getOrDefault("status", "ALL");
        String order = requestBody.getOrDefault("order", "DESC");
        List<Todo> response = todoService.searchTodo(token, query, status, order);
        LinkedHashMap<String,Object> res = new LinkedHashMap<>();
        res.put("status", HttpStatus.OK.value());
        res.put("message", "Search results acquired successfully");
        res.put("data", response);
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

}
