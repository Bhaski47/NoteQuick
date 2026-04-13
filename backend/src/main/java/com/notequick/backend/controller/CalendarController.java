package com.notequick.backend.controller;

import com.google.gson.Gson;
import com.notequick.backend.dto.calendar.CalendarRequest;
import com.notequick.backend.dto.calendar.AllCalendarResponseDTO;
import com.notequick.backend.dto.calendar.CalendarResponse;
import com.notequick.backend.service.CalendarService;
import com.notequick.backend.utils.HttpResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/calendar")
public class CalendarController {

    @Autowired
    CalendarService calendarService;

    @PostMapping("/getCalendarDetails")
    public ResponseEntity<HttpResponse> getCalendarDetails(@RequestHeader (value = "Authorization" , defaultValue = "") String token,
                                                           @RequestBody CalendarRequest calendarRequest) {
        Gson gson = new Gson();
        System.out.println(gson.toJson(calendarRequest));
        List<CalendarResponse> allCalendarResponseDTOList = calendarService.getListOfCalendarDetails(calendarRequest,token);
        HttpResponse httpResponse = new HttpResponse(HttpStatus.OK.value(),"Calendar Details Retrieved", allCalendarResponseDTOList);
        return new ResponseEntity<>(httpResponse, HttpStatus.OK);
    }
}
