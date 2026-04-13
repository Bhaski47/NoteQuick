package com.notequick.backend.service;


import com.notequick.backend.dto.calendar.CalendarRequest;
import com.notequick.backend.dto.calendar.AllCalendarResponseDTO;
import com.notequick.backend.dto.calendar.CalendarResponse;

import java.util.List;

public interface CalendarService {
    List<CalendarResponse> getListOfCalendarDetails(CalendarRequest calendarRequest, String token);
}
