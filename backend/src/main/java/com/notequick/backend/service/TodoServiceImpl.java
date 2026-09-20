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
        if (todo == null || todo.getTodoId() == null) {
            throw new InvalidCredentialException("Todo ID is required");
        }
        String userId = jwtUtil.extractUserId(token);
        Todo existingTodo = todoJpaRepo.findById(todo.getTodoId())
                .orElseThrow(() -> new Exception("Todo Not Found"));
        if (!userId.equals(existingTodo.getUserId())) {
            throw new InvalidCredentialException("Unauthorized: You do not own this todo");
        }
        if (todo.getTitle() != null) {
            existingTodo.setTitle(todo.getTitle());
        }
        if (todo.getDescription() != null) {
            existingTodo.setDescription(todo.getDescription());
        }
        if (todo.getFromDate() != null) {
            existingTodo.setFromDate(todo.getFromDate());
        }
        if (todo.getToDate() != null) {
            existingTodo.setToDate(todo.getToDate());
        }
        if (todo.getStatus() != null) {
            existingTodo.setStatus(todo.getStatus());
        }
        todoJpaRepo.save(existingTodo);
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
        String userId = jwtUtil.extractUserId(token);
        Todo todo = todoJpaRepo.findById(UUID.fromString(todoId))
                .orElseThrow(() -> new Exception("Todo Not Found"));
        if (!userId.equals(todo.getUserId())) {
            throw new InvalidCredentialException("Unauthorized: You do not own this todo");
        }
        try {
            todo.setStatus(TodoStatus.REMOVED);
            todoJpaRepo.save(todo);
        } catch (Exception e) {
            throw new Exception("Error while deleting todo");
        }
    }

}
