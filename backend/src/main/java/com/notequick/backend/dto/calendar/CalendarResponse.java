package com.notequick.backend.dto.calendar;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CalendarResponse {
    private UUID id;
    private String title;
    private LocalDateTime start;
    private LocalDateTime end;
}
