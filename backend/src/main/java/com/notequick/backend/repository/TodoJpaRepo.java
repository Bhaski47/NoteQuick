package com.notequick.backend.repository;

import com.notequick.backend.dto.calendar.AllCalendarResponseDTO;
import com.notequick.backend.entity.Todo;
import com.notequick.backend.enums.TodoStatus;
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

    @Query("SELECT new com.notequick.backend.dto.calendar.AllCalendarResponseDTO( t.todoId,t.title,t.fromDate,t.toDate) FROM Todo t" +
            " WHERE (t.fromDate >= :fromDate AND t.toDate <= :toDate) AND t.userId = :userId")
    Optional<List<AllCalendarResponseDTO>> getAllCalendarsByDate(@Param("fromDate") LocalDateTime fromDate,
                                                                 @Param("toDate") LocalDateTime toDate,
                                                                 @Param("userId") String userId);

    List<Todo> findByUserIdAndStatusNot(String userId, TodoStatus status);
}
