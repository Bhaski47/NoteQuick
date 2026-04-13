package com.notequick.backend.dto.calendar;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CalendarRequest {

    private String fromDate;

    private String toDate;
}
