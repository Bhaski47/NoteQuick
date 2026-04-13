package com.notequick.backend.controller;

import com.notequick.backend.dto.user.UserDetailsDTO;
import com.notequick.backend.service.UserService;
import com.notequick.backend.utils.HttpResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.LinkedHashMap;

@RestController
@RequestMapping("/")
public class PortfolioController {

    @Autowired
    UserService userService;

    @GetMapping("/{username}")
    public ResponseEntity<HashMap<String,Object>> getUserDetails(@PathVariable String username) {
        UserDetailsDTO response = userService.userProfileById(username);
        LinkedHashMap<String,Object> res = new LinkedHashMap<>();
        res.put("status",HttpStatus.OK.value());
        res.put("message","Data Acquired Successfully");
        res.put("data",response);
        return new ResponseEntity<>(res, HttpStatus.OK);
    }
}
