package com.notequick.backend.service;

import com.notequick.backend.dto.user.CreateUserDTO;
import com.notequick.backend.dto.user.UpdateUserDTO;
import com.notequick.backend.dto.user.UserDetailsDTO;
import com.notequick.backend.entity.OtpTokens;
import com.notequick.backend.entity.User;
import com.notequick.backend.enums.UserStatus;
import com.notequick.backend.exception.InvalidCredentialException;
import com.notequick.backend.repository.OtpTokensRepo;
import com.notequick.backend.repository.UserJpaRepo;
import com.notequick.backend.utils.JwtUtil;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class UserServiceImpl implements UserService{

    @Autowired
    private UserJpaRepo userJpaRepo;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final JavaMailSender mailSender;

    public UserServiceImpl(JavaMailSender mailSender, OtpTokensRepo otpTokensRepository) {
        this.mailSender = mailSender;
        this.otpTokensRepository = otpTokensRepository;
    }

    private final OtpTokensRepo otpTokensRepository;

    @Override
    public String loginUser(String email, String password) {
        User user = null;
        if(isValidEmail(email)){
            user = userJpaRepo.findByEmailAndStatus(email,UserStatus.ACTIVE)
                    .orElseThrow(()-> new InvalidCredentialException("User not found"));
        }else{
            user = userJpaRepo.findByUserNameAndStatus(email, UserStatus.ACTIVE)
                    .orElseThrow(()-> new InvalidCredentialException("User not found"));
        }
        if(user == null){
            throw new InvalidCredentialException("User not found");
        }
        if(!passwordEncoder.matches(password, user.getPassword())){
            throw new InvalidCredentialException("Wrong password");
        }
        Map<String,Object> claims = new HashMap<>();
        claims.put("userId",user.getUserId());
        return jwtUtil.generateTokenForUser(claims,user);
    }

    @Transactional
    @Override
    public String registerUser(CreateUserDTO registerUserDTO) {
        if (userJpaRepo.findByEmailAndStatus(registerUserDTO.getEmail(),UserStatus.ACTIVE).isPresent() ||
                userJpaRepo.findByUserNameAndStatus(registerUserDTO.getUsername(),UserStatus.ACTIVE).isPresent()) {
            throw new InvalidCredentialException("User Already Exists");
        }
        Map<String,Object> claims = new HashMap<>();
        User user = new User();
        user.setUserId(UUID.randomUUID());
        claims.put("userId", user.getUserId());
        user.setUserName(registerUserDTO.getUsername());
        user.setPassword(passwordEncoder.encode(registerUserDTO.getPassword()));
        user.setEmail(registerUserDTO.getEmail());
        userJpaRepo.save(user);
        return jwtUtil.generateTokenForUser(claims,user);
    }

    @Override
    public boolean isValidEmail(String email) {
        final String EMAIL_REGEX = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";
        final Pattern EMAIL_PATTERN = Pattern.compile(EMAIL_REGEX);
        if (email == null) {
            return false;
        }
        Matcher matcher = EMAIL_PATTERN.matcher(email);
        return matcher.matches();
    }

    @Override
    public User getUserDetails(String token) {
        UUID userId = UUID.fromString(jwtUtil.extractUserId(token));
        return userJpaRepo.findById(userId).orElse(null);
    }

    @Override
    public void updateUserDetails(String token, UpdateUserDTO user) {
        UUID userId = UUID.fromString(jwtUtil.extractUserId(token));
        User u = userJpaRepo.findById(userId).orElseThrow(()-> new InvalidCredentialException("User not found"));
        if (user.getName() != null)     u.setName(user.getName());
        if (user.getDescription() != null) u.setDescription(user.getDescription());
        if (user.getGender() != null)   u.setGender(user.getGender());
        if (user.getBirthday() != null) u.setBirthday(user.getBirthday());
        if (user.getCity() != null)     u.setCity(user.getCity());
        if (user.getCountry() != null)  u.setCountry(user.getCountry());
        if (user.getPhone() != null)    u.setPhone(user.getPhone());
        userJpaRepo.save(u);
    }

    @Override
    public void deleteUser(String token) {
        UUID userId = UUID.fromString(jwtUtil.extractUserId(token));
        User u = userJpaRepo.findById(userId).orElseThrow(()-> new InvalidCredentialException("User not found"));
        String uid = u.getUserId().toString().substring(0, 8);
        u.setEmail("deleted_" + uid + u.getEmail());
        u.setUserName("deleted_" + uid +u.getUsername());
        u.setPhone(null);
        u.setPassword("");
        u.setStatus(UserStatus.INACTIVE);
        userJpaRepo.save(u);
    }

    @Override
    public UserDetailsDTO userProfileById(String userName) {
        return userJpaRepo.getUserDetails(userName).orElseThrow(()->new InvalidCredentialException("User not found"));
    }

    @Override
    public void sendOtp(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("NoteQuick - Password Reset OTP");
        message.setText(
                "Your OTP for password reset is: " + otp + "\n\n" +
                        "This OTP is valid for 10 minutes.\n" +
                        "If you did not request this, please ignore this email."
        );
        mailSender.send(message);
    }

    @Override
    @Transactional
    public void sendOtp(String email) {
        userJpaRepo.findByEmail(email)
                .orElseThrow(() -> new InvalidCredentialException("No account found with this email"));

        otpTokensRepository.deleteByEmail(email);
        String otp = String.format("%06d", new Random().nextInt(999999));

        OtpTokens token = new OtpTokens();
        token.setEmail(email);
        token.setOtp(otp);
        token.setExpiresAt(LocalDateTime.now().plusMinutes(10));
        otpTokensRepository.save(token);
        sendOtp(email, otp);
    }

    @Override
    public void verifyOtpAndResetPassword(String email, String otp, String newPassword) {
        OtpTokens token = otpTokensRepository
                .findByEmailAndOtpAndUsedFalse(email, otp)
                .orElseThrow(() -> new InvalidCredentialException("Invalid OTP"));

        if (token.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new InvalidCredentialException("OTP has expired");
        }

        User user = userJpaRepo.findByEmail(email)
                .orElseThrow(() -> new InvalidCredentialException("User not found"));
        user.setPassword(passwordEncoder.encode(newPassword));
        userJpaRepo.save(user);

        token.setUsed(true);
        otpTokensRepository.save(token);
    }

    @Override
    public void verifyOtp(String email, String otp) {
        OtpTokens token = otpTokensRepository
                .findByEmailAndOtpAndUsedFalse(email, otp)
                .orElseThrow(() -> new InvalidCredentialException("Invalid OTP"));

        if (token.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new InvalidCredentialException("OTP has expired");
        }
    }

}
