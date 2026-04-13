package com.notequick.backend.service;

import com.notequick.backend.entity.Todo;
import com.notequick.backend.exception.InvalidCredentialException;

import java.util.HashMap;
import java.util.List;

public interface TodoService {

    List<Todo> getTodo(String token);

    void addTodo(String token,Todo todo) throws InvalidCredentialException,Exception;

    void deleteTodo(String token,String todoId) throws Exception;

    void updateTodo(String token, Todo todo) throws Exception;

}
