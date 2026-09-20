package com.notequick.backend.repository;

import com.notequick.backend.dto.calendar.AllCalendarResponseDTO;
import com.notequick.backend.dto.calendar.CalendarResponse;
import com.notequick.backend.entity.Todo;
import com.notequick.backend.enums.TodoStatus;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TodoJpaRepo extends JpaRepository<Todo, UUID> {

    @Query("SELECT t FROM Todo t WHERE t.status <> 'REMOVED' AND t.userId = :userId")
    Optional<List<Todo>> getActiveTodoListForUser(@Param("userId") String userId);

    @Query("SELECT new com.notequick.backend.dto.calendar.CalendarResponse(t.todoId, t.title, t.fromDate, t.toDate) FROM Todo t " +
            "WHERE t.status <> com.notequick.backend.enums.TodoStatus.REMOVED AND t.userId = :userId " +
            "AND ((t.fromDate IS NOT NULL AND t.toDate IS NOT NULL AND t.fromDate <= :toDate AND t.toDate >= :fromDate) " +
            "  OR (t.toDate IS NULL AND t.fromDate >= :fromDate AND t.fromDate <= :toDate) " +
            "  OR (t.fromDate IS NULL AND t.toDate >= :fromDate AND t.toDate <= :toDate))")
    Optional<List<CalendarResponse>> getAllCalendarsByDate(@Param("fromDate") LocalDateTime fromDate,
                                                           @Param("toDate") LocalDateTime toDate,
                                                           @Param("userId") String userId);

    List<Todo> findByUserIdAndStatusIn(String userId, List<TodoStatus> statuses, Sort sort);

    long countByUserIdAndStatus(String userId, TodoStatus status);

    @Query("SELECT t FROM Todo t WHERE t.userId = :userId " +
            "AND t.status IN :statuses " +
            "AND (LOWER(t.title) LIKE LOWER(CONCAT('%', :query, '%')) " +
            "  OR LOWER(t.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Todo> searchTodos(
            @Param("userId") String userId,
            @Param("query") String query,
            @Param("statuses") List<TodoStatus> statuses,
            Sort sort
    );
}
