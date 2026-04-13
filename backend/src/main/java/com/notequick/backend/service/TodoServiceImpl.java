package com.notequick.backend.service;

import com.notequick.backend.entity.Todo;
import com.notequick.backend.enums.TodoStatus;
import com.notequick.backend.exception.InvalidCredentialException;
import com.notequick.backend.repository.TodoJpaRepo;
import com.notequick.backend.repository.UserJpaRepo;
import com.notequick.backend.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class TodoServiceImpl implements TodoService {

    @Autowired
    private UserJpaRepo userJpaRepo;

    @Autowired
    private TodoJpaRepo todoJpaRepo;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public void addTodo(String token,Todo todo) throws InvalidCredentialException,Exception {
        String userId = jwtUtil.extractUserId(token);
        userJpaRepo.findById(UUID.fromString(userId))
                .orElseThrow(()->new InvalidCredentialException("User Not Found"));
        try{
            todo.setUserId(userId);
            todo.setTodoId(UUID.randomUUID());
            todoJpaRepo.save(todo);
        }
        catch(Exception e){
            throw new Exception("Error while adding todo");
        }
    }

    @Override
    public List<Todo> getTodo(String token) {
        UUID userId = UUID.fromString(jwtUtil.extractUserId(token));
        return todoJpaRepo.findByUserIdAndStatusNot(userId.toString(),TodoStatus.REMOVED);
    }

    @Override
    public void updateTodo(String token, Todo todo) throws Exception {
        todoJpaRepo.save(todo);
    }

    @Override
    public void deleteTodo(String token, String todoId) throws Exception {
        try{
            Todo todo = todoJpaRepo.findById(UUID.fromString(todoId))
                    .orElseThrow(()->new Exception("Todo Not Found"));
            todo.setStatus(TodoStatus.REMOVED);
            todoJpaRepo.save(todo);
        }
        catch(Exception e){
            throw new Exception("Error while adding todo");
        }
    }

}
