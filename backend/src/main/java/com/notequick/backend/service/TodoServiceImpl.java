package com.notequick.backend.service;

import com.notequick.backend.entity.Todo;
import com.notequick.backend.enums.TodoStatus;
import com.notequick.backend.exception.InvalidCredentialException;
import com.notequick.backend.repository.TodoJpaRepo;
import com.notequick.backend.repository.UserJpaRepo;
import com.notequick.backend.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
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
    public List<Todo> getTodo(String token, String status, String order) {
        String userId = jwtUtil.extractUserId(token);
        List<TodoStatus> statuses = resolveStatuses(status);
        Sort sort = resolveSort(order);
        return todoJpaRepo.findByUserIdAndStatusIn(userId, statuses, sort);
    }

    @Override
    public void updateTodo(String token, Todo todo) throws Exception {
        todoJpaRepo.save(todo);
    }

    private List<TodoStatus> resolveStatuses(String status) {
        return switch (status != null ? status.toUpperCase() : "ALL") {
            case "PENDING", "ACTIVE" -> List.of(TodoStatus.ACTIVE);
            case "DONE", "COMPLETED" -> List.of(TodoStatus.COMPLETED);
            default -> List.of(TodoStatus.ACTIVE, TodoStatus.COMPLETED);
        };
    }

    private Sort resolveSort(String order) {
        // Defaults to DESC (newest first)
        if ("ASC".equalsIgnoreCase(order)) {
            return Sort.by(Sort.Direction.ASC, "fromDate");
        }
        return Sort.by(Sort.Direction.DESC, "fromDate");
    }

    @Override
    public List<Todo> searchTodo(String token, String todo, String status, String order) throws Exception {
        if (todo == null || todo.trim().isEmpty()) {
            return Collections.emptyList();
        }
        String userId = jwtUtil.extractUserId(token);
        List<TodoStatus> statuses = resolveStatuses(status);
        Sort sort = resolveSort(order);
        return todoJpaRepo.searchTodos(userId, todo.trim(), statuses, sort);
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
