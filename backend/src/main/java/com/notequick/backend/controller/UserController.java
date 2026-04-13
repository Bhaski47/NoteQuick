package com.notequick.backend.controller;

import com.notequick.backend.dto.user.UpdateUserDTO;
import com.notequick.backend.entity.User;
import com.notequick.backend.utils.HttpResponse;
import com.notequick.backend.repository.UserJpaRepo;
import com.notequick.backend.service.UserServiceImpl;
import com.notequick.backend.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    UserServiceImpl userService;

    @GetMapping("/getUserDetails")
    public ResponseEntity<HttpResponse> login(
            @RequestHeader(name = "Authorization",defaultValue = "") String token) {
        User userDetails = userService.getUserDetails(token);
        List<User> res = new ArrayList<>();
        if(userDetails != null) {
            res.add(userDetails);
        }
        HttpResponse httpResponse = new HttpResponse(HttpStatus.OK.value(),"User Details Acquired Successfully",res);
        return new ResponseEntity<>(httpResponse, HttpStatus.OK);
    }

    @PutMapping("/updateUserDetails")
    public ResponseEntity<HttpResponse> updateUserDetails(
            @RequestHeader(name = "Authorization",defaultValue = "") String token,
            @RequestBody UpdateUserDTO user) {
        userService.updateUserDetails(token,user);
        HttpResponse httpResponse = new HttpResponse(HttpStatus.OK.value(), "User Updated Successfully");
        return new ResponseEntity<>(httpResponse,HttpStatus.OK);
    }

    @DeleteMapping("/deleteUser")
    public ResponseEntity<HttpResponse> deleteUser(
            @RequestHeader(name = "Authorization",defaultValue = "") String token) {
        userService.deleteUser(token);
        HttpResponse httpResponse = new HttpResponse(HttpStatus.OK.value(), "User Deleted Successfully");
        return new ResponseEntity<>(httpResponse,HttpStatus.OK);
    }

}
