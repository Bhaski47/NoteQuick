package com.notequick.backend.service;

import com.notequick.backend.dto.tag.TagResponseDTO;
import com.notequick.backend.entity.Tag;
import com.notequick.backend.entity.Todo;
import com.notequick.backend.enums.TodoStatus;
import com.notequick.backend.exception.InvalidCredentialException;
import com.notequick.backend.repository.TagJpaRepo;
import com.notequick.backend.repository.TodoJpaRepo;
import com.notequick.backend.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class TagServiceImpl implements TagService {

    @Autowired
    private TagJpaRepo tagJpaRepo;

    @Autowired
    private TodoJpaRepo todoJpaRepo;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public List<TagResponseDTO> getTags(String token) {
        String userId = jwtUtil.extractUserId(token);
        List<Tag> tags = tagJpaRepo.findByUserIdOrderByNameAsc(userId);

        List<Todo> activeTodos = todoJpaRepo.findByUserIdAndStatusIn(
                userId,
                List.of(TodoStatus.ACTIVE, TodoStatus.COMPLETED),
                Sort.unsorted()
        );

        Map<String, Long> tagCounts = activeTodos.stream()
                .filter(t -> t.getTags() != null)
                .flatMap(t -> t.getTags().stream()
                        .filter(Objects::nonNull)
                        .map(String::trim)
                        .filter(s -> !s.isEmpty())
                        .map(String::toLowerCase)
                        .distinct())
                .collect(Collectors.groupingBy(String::toLowerCase, Collectors.counting()));

        return tags.stream()
                .map(tag -> new TagResponseDTO(
                        tag.getTagId(),
                        tag.getName(),
                        tagCounts.getOrDefault(tag.getName().toLowerCase(), 0L),
                        tag.getCreatedAt()
                ))
                .toList();
    }

    @Override
    @Transactional
    public Tag createTag(String token, String rawName) {
        if (rawName == null) {
            throw new IllegalArgumentException("Tag name cannot be null");
        }
        String normalized = rawName.trim().toLowerCase();
        if (normalized.isEmpty() || normalized.length() > 30) {
            throw new IllegalArgumentException("Tag name must be between 1 and 30 characters");
        }

        String userId = jwtUtil.extractUserId(token);
        Optional<Tag> existing = tagJpaRepo.findByUserIdAndName(userId, normalized);
        if (existing.isPresent()) {
            return existing.get();
        }

        try {
            Tag tag = new Tag(UUID.randomUUID(), userId, normalized);
            return tagJpaRepo.save(tag);
        } catch (DataIntegrityViolationException e) {
            return tagJpaRepo.findByUserIdAndName(userId, normalized)
                    .orElseThrow(() -> e);
        }
    }

    @Override
    @Transactional
    public void deleteTag(String token, UUID tagId) throws Exception {
        if (tagId == null) {
            throw new IllegalArgumentException("Tag ID cannot be null");
        }
        String userId = jwtUtil.extractUserId(token);
        Tag tag = tagJpaRepo.findByUserIdAndTagId(userId, tagId)
                .orElseThrow(() -> new InvalidCredentialException("Unauthorized: Tag not found or not owned by user"));

        tagJpaRepo.delete(tag);

        String tagName = tag.getName();
        List<Todo> userTodos = todoJpaRepo.findByUserIdAndStatusIn(
                userId,
                List.of(TodoStatus.ACTIVE, TodoStatus.COMPLETED),
                Sort.unsorted()
        );

        List<Todo> modifiedTodos = new ArrayList<>();
        for (Todo todo : userTodos) {
            if (todo.getTags() != null && !todo.getTags().isEmpty()) {
                boolean changed = todo.getTags().removeIf(t -> t != null && t.trim().equalsIgnoreCase(tagName));
                if (changed) {
                    modifiedTodos.add(todo);
                }
            }
        }

        if (!modifiedTodos.isEmpty()) {
            todoJpaRepo.saveAll(modifiedTodos);
        }
    }
}
