package com.notequick.backend.service;

import com.notequick.backend.entity.Tag;
import com.notequick.backend.entity.Todo;
import com.notequick.backend.repository.TagJpaRepo;
import com.notequick.backend.repository.TodoJpaRepo;
import com.notequick.backend.utils.JwtUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Sort;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TagServiceImplTest {

    @Mock
    private TagJpaRepo tagJpaRepo;

    @Mock
    private TodoJpaRepo todoJpaRepo;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private TagServiceImpl tagService;

    private final String token = "Bearer test-token";
    private final String userId = "user-123";
    private final UUID tagId = UUID.randomUUID();

    @Test
    void deleteTag_removesTagFromReferencedTodos_andDoesNotTouchUnreferencedTodos() throws Exception {
        when(jwtUtil.extractUserId(token)).thenReturn(userId);

        Tag tag = new Tag(tagId, userId, "work");
        when(tagJpaRepo.findByUserIdAndTagId(userId, tagId)).thenReturn(Optional.of(tag));

        // Todo 1: references "work" and "urgent"
        Todo todo1 = new Todo();
        todo1.setTodoId(UUID.randomUUID());
        todo1.setUserId(userId);
        todo1.setTitle("Task 1");
        todo1.setTags(new ArrayList<>(List.of("work", "urgent")));

        // Todo 2: references "work" only (case-insensitive test: "Work")
        Todo todo2 = new Todo();
        todo2.setTodoId(UUID.randomUUID());
        todo2.setUserId(userId);
        todo2.setTitle("Task 2");
        todo2.setTags(new ArrayList<>(List.of("Work")));

        // Todo 3: does NOT reference "work" (references "personal")
        Todo todo3 = new Todo();
        todo3.setTodoId(UUID.randomUUID());
        todo3.setUserId(userId);
        todo3.setTitle("Task 3");
        todo3.setTags(new ArrayList<>(List.of("personal")));

        // Todo 4: has empty / null tags
        Todo todo4 = new Todo();
        todo4.setTodoId(UUID.randomUUID());
        todo4.setUserId(userId);
        todo4.setTitle("Task 4");
        todo4.setTags(new ArrayList<>());

        when(todoJpaRepo.findByUserIdAndStatusIn(eq(userId), anyList(), any(Sort.class)))
                .thenReturn(List.of(todo1, todo2, todo3, todo4));

        tagService.deleteTag(token, tagId);

        // Verify tag entity was deleted
        verify(tagJpaRepo, times(1)).delete(tag);

        // Capture saved todos: only modified todos (todo1 and todo2) should be saved!
        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<Todo>> captor = ArgumentCaptor.forClass(List.class);
        verify(todoJpaRepo, times(1)).saveAll(captor.capture());

        List<Todo> savedTodos = captor.getValue();
        assertEquals(2, savedTodos.size(), "Only todos that referenced the deleted tag should be saved");

        // Verify Todo 1: "work" removed, "urgent" kept
        assertEquals(List.of("urgent"), todo1.getTags());

        // Verify Todo 2: "work" removed, list now empty
        assertTrue(todo2.getTags().isEmpty());

        // Verify Todo 3: "personal" was untouched and todo3 was NOT included in saveAll
        assertEquals(List.of("personal"), todo3.getTags());
        assertFalse(savedTodos.contains(todo3));

        // Verify Todo 4: untouched and not included in saveAll
        assertFalse(savedTodos.contains(todo4));
    }
}
