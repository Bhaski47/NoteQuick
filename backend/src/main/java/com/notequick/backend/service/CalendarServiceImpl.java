package com.notequick.backend.service;

import com.notequick.backend.dto.calendar.CalendarRequest;
import com.notequick.backend.dto.calendar.AllCalendarResponseDTO;
import com.notequick.backend.dto.calendar.CalendarResponse;
import com.notequick.backend.repository.TodoJpaRepo;
import com.notequick.backend.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CalendarServiceImpl implements CalendarService {

    @Autowired
    TodoJpaRepo todoJpaRepo;

    @Autowired
    JwtUtil jwtUtil;

    @Override
    public List<CalendarResponse> getListOfCalendarDetails(CalendarRequest calendarRequest, String token) {
        UUID userId = UUID.fromString(jwtUtil.extractUserId(token));
        List<AllCalendarResponseDTO> allCalendarResponsDTOS = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        LocalDate fromDate = LocalDate.parse(calendarRequest.getFromDate(),formatter);
        LocalDate toDate = LocalDate.parse(calendarRequest.getToDate(),formatter);
        LocalDateTime from = fromDate.atStartOfDay();          // 2026-03-01T00:00
        LocalDateTime to = toDate.atTime(23, 59, 59);

        allCalendarResponsDTOS = todoJpaRepo.getAllCalendarsByDate(from,to,userId.toString())
                .orElse(List.of());
        return allCalendarResponsDTOS.stream()
                .map(event -> {
                    CalendarResponse dto = new CalendarResponse();
                    dto.setTitle(event.getTitle());
                    dto.setId(event.getId());
                    LocalDateTime startDateTime = event.getStart();

                    LocalDateTime endDateTime = event.getEnd();

                    dto.setStart(startDateTime);
                    dto.setEnd(endDateTime);

                    return dto;
                })
                .collect(Collectors.toList());
    }

    private Date convertToDate(LocalDateTime localDateTime) {
        return Date.from(localDateTime.atZone(ZoneId.systemDefault()).toInstant());
    }
}
