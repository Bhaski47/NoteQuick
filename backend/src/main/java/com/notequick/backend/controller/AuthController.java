package com.notequick.backend.controller;

import com.notequick.backend.dto.user.CreateUserDTO;
import com.notequick.backend.dto.user.LoginUserDTO;
import com.notequick.backend.utils.HttpResponse;
import com.notequick.backend.repository.UserJpaRepo;
import com.notequick.backend.service.UserServiceImpl;
import com.notequick.backend.utils.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/authenticate")
public class AuthController {

    @Autowired
    UserServiceImpl userService;

    @PostMapping("/login")
    public ResponseEntity<HttpResponse> login(@Valid @RequestBody LoginUserDTO loginUserDTO) {
        String token = userService.loginUser(loginUserDTO.getIdentifier(), loginUserDTO.getPassword());
        HttpResponse httpResponse = new HttpResponse(HttpStatus.OK.value(),"User Authenticated Successfully",token);
        return new ResponseEntity<>(httpResponse, HttpStatus.OK);
    }

    @PostMapping("/register")
    public ResponseEntity<HttpResponse> register(@Valid @RequestBody CreateUserDTO registerUserDTO) {
        String token = userService.registerUser(registerUserDTO);
        HttpResponse http = new HttpResponse(HttpStatus.CREATED.value(),"User Created",token);
        return new ResponseEntity<>(http,HttpStatus.OK);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> body) {
        userService.sendOtp(body.get("email"));
        return ResponseEntity.ok(new HttpResponse(HttpStatus.OK.value(),"OTP sent to your email"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
        userService.verifyOtpAndResetPassword(
                body.get("email"),
                body.get("otp"),
                body.get("newPassword")
        );
        return ResponseEntity.ok(new HttpResponse(HttpStatus.OK.value(),"Password reset successfully"));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> body) {
        userService.verifyOtp(body.get("email"), body.get("otp"));
        return ResponseEntity.ok(new HttpResponse(HttpStatus.OK.value(),"OTP verified"));
    }

}
