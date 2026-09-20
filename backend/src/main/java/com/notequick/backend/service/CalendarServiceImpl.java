package com.notequick.backend.service;

import com.notequick.backend.dto.calendar.CalendarRequest;
import com.notequick.backend.dto.calendar.CalendarResponse;
import com.notequick.backend.repository.TodoJpaRepo;
import com.notequick.backend.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
public class CalendarServiceImpl implements CalendarService {

    @Autowired
    TodoJpaRepo todoJpaRepo;

    @Autowired
    JwtUtil jwtUtil;

    @Override
    public List<CalendarResponse> getListOfCalendarDetails(CalendarRequest calendarRequest, String token) {
        UUID userId = UUID.fromString(jwtUtil.extractUserId(token));
        DateTimeFormatter fromFormatter = (calendarRequest.getFromDate() != null && calendarRequest.getFromDate().contains("-"))
                ? DateTimeFormatter.ofPattern("yyyy-MM-dd")
                : DateTimeFormatter.ofPattern("dd/MM/yyyy");
        DateTimeFormatter toFormatter = (calendarRequest.getToDate() != null && calendarRequest.getToDate().contains("-"))
                ? DateTimeFormatter.ofPattern("yyyy-MM-dd")
                : DateTimeFormatter.ofPattern("dd/MM/yyyy");

        LocalDate fromDate = LocalDate.parse(calendarRequest.getFromDate(), fromFormatter);
        LocalDate toDate = LocalDate.parse(calendarRequest.getToDate(), toFormatter);
        LocalDateTime from = fromDate.atStartOfDay();
        LocalDateTime to = toDate.atTime(23, 59, 59);

        return todoJpaRepo.getAllCalendarsByDate(from, to, userId.toString())
                .orElse(List.of());
    }
}
