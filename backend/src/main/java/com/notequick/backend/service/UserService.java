package com.notequick.backend.service;

import com.notequick.backend.dto.user.CreateUserDTO;
import com.notequick.backend.dto.user.UpdateUserDTO;
import com.notequick.backend.dto.user.UserDetailsDTO;
import com.notequick.backend.entity.User;

import java.util.HashMap;

public interface UserService {

    String loginUser(String email, String password);

    String registerUser(CreateUserDTO registerUserDTO);

    boolean isValidEmail(String email);

    User getUserDetails(String token);

    void updateUserDetails(String token, UpdateUserDTO user);

    void deleteUser(String token);

    UserDetailsDTO userProfileById(String userName);

    void sendOtp(String toEmail, String otp);

    void sendOtp(String email);

    void verifyOtpAndResetPassword(String email, String otp, String newPassword);

    void verifyOtp(String email, String otp);
}
