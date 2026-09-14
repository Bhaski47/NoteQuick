package com.notequick.backend.service;

import com.notequick.backend.entity.Todo;
import com.notequick.backend.exception.InvalidCredentialException;

import java.util.HashMap;
import java.util.List;

public interface TodoService {

    List<Todo> getTodo(String token, String status, String order);

    void addTodo(String token,Todo todo) throws InvalidCredentialException,Exception;

    void deleteTodo(String token,String todoId) throws Exception;

    void updateTodo(String token, Todo todo) throws Exception;

    List<Todo> searchTodo(String token, String query, String status, String order) throws Exception;

}
