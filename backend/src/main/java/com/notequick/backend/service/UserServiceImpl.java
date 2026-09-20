package com.notequick.backend.service;

import com.notequick.backend.dto.user.CreateUserDTO;
import com.notequick.backend.dto.user.UpdateUserDTO;
import com.notequick.backend.dto.user.UserDetailsDTO;
import com.notequick.backend.entity.OtpTokens;
import com.notequick.backend.entity.User;
import com.notequick.backend.enums.TodoStatus;
import com.notequick.backend.enums.UserStatus;
import com.notequick.backend.exception.InvalidCredentialException;
import com.notequick.backend.repository.OtpTokensRepo;
import com.notequick.backend.repository.TodoJpaRepo;
import com.notequick.backend.repository.UserJpaRepo;
import com.notequick.backend.utils.JwtUtil;
import jakarta.mail.internet.MimeMessage;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class UserServiceImpl implements UserService{

    @Autowired
    private UserJpaRepo userJpaRepo;

    @Autowired
    private TodoJpaRepo todoJpaRepo;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final JavaMailSender mailSender;

    public UserServiceImpl(JavaMailSender mailSender, OtpTokensRepo otpTokensRepository) {
        this.mailSender = mailSender;
        this.otpTokensRepository = otpTokensRepository;
    }

    @Value("${spring.mail.username}")
    private String fromEmail;

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
        if (user.getName() != null && !user.getName().isBlank())     u.setName(user.getName());
        if (user.getDescription() != null && !user.getDescription().isBlank()) u.setDescription(user.getDescription());
        if (user.getGender() != null && !user.getGender().isBlank())   u.setGender(user.getGender());
        if (user.getBirthday() != null && !user.getBirthday().isBlank()) u.setBirthday(user.getBirthday());
        if (user.getCity() != null && !user.getCity().isBlank())     u.setCity(user.getCity());
        if (user.getCountry() != null && !user.getCountry().isBlank())  u.setCountry(user.getCountry());
        if (user.getPhone() != null && !user.getPhone().isBlank())    u.setPhone(user.getPhone());
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
        User user = userJpaRepo.findByUserNameAndStatus(userName, UserStatus.ACTIVE)
                .orElseThrow(() -> new InvalidCredentialException("User not found"));
        String uid = user.getUserId().toString();
        long completed = todoJpaRepo.countByUserIdAndStatus(uid, TodoStatus.COMPLETED);
        long removed = todoJpaRepo.countByUserIdAndStatus(uid, TodoStatus.REMOVED);
        long active = todoJpaRepo.countByUserIdAndStatus(uid, TodoStatus.ACTIVE);
        return new UserDetailsDTO(
                completed,
                removed,
                active,
                user.getUsername(),
                user.getEmail(),
                user.getGender(),
                user.getName(),
                user.getPhone(),
                user.getDescription(),
                user.getBirthday(),
                user.getCity(),
                user.getCountry()
        );
    }

    @Override
    public void sendOtp(String toEmail, String otp, String username) throws Exception {
        ClassPathResource resource = new ClassPathResource("templates/otp-email.html");
        String template = new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
        String html = template
                .replace("{{username}}", username)
                .replace("{{otp}}", otp);
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(toEmail);
        helper.setFrom(fromEmail, "NoteQuick");
        helper.setSubject("Your OTP Code – " + otp);
        helper.setText(html, true);

        mailSender.send(message);
    }

    @Override
    @Transactional
    public void sendOtp(String email) throws Exception {
        String userName = userJpaRepo.findByEmailAndStatus(email, UserStatus.ACTIVE)
                .orElseThrow(() -> new InvalidCredentialException("No active account found with this email")).getUsername();

        otpTokensRepository.deleteByEmail(email);
        SecureRandom secureRandom = new SecureRandom();
        String otp = String.format("%06d", secureRandom.nextInt(1000000));

        OtpTokens token = new OtpTokens();
        token.setEmail(email);
        token.setOtp(otp);
        token.setExpiresAt(LocalDateTime.now().plusMinutes(10));
        token.setAttempts(0);
        otpTokensRepository.save(token);
        sendOtp(email, otp, userName);
    }

    @Override
    @Transactional
    public void verifyOtpAndResetPassword(String email, String otp, String newPassword) {
        OtpTokens token = otpTokensRepository
                .findTopByEmailAndUsedFalseOrderByExpiresAtDesc(email)
                .orElseThrow(() -> new InvalidCredentialException("Invalid or expired OTP"));

        if (token.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new InvalidCredentialException("OTP has expired");
        }

        if (token.getAttempts() >= 5) {
            token.setUsed(true);
            otpTokensRepository.save(token);
            throw new InvalidCredentialException("Too many failed attempts. Please request a new OTP.");
        }

        if (!token.getOtp().equals(otp)) {
            token.setAttempts(token.getAttempts() + 1);
            otpTokensRepository.save(token);
            throw new InvalidCredentialException("Invalid OTP");
        }

        User user = userJpaRepo.findByEmailAndStatus(email, UserStatus.ACTIVE)
                .orElseThrow(() -> new InvalidCredentialException("User not found"));
        user.setPassword(passwordEncoder.encode(newPassword));
        userJpaRepo.save(user);

        token.setUsed(true);
        otpTokensRepository.save(token);
    }

    @Override
    @Transactional
    public void verifyOtp(String email, String otp) {
        OtpTokens token = otpTokensRepository
                .findTopByEmailAndUsedFalseOrderByExpiresAtDesc(email)
                .orElseThrow(() -> new InvalidCredentialException("Invalid or expired OTP"));

        if (token.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new InvalidCredentialException("OTP has expired");
        }

        if (token.getAttempts() >= 5) {
            token.setUsed(true);
            otpTokensRepository.save(token);
            throw new InvalidCredentialException("Too many failed attempts. Please request a new OTP.");
        }

        if (!token.getOtp().equals(otp)) {
            token.setAttempts(token.getAttempts() + 1);
            otpTokensRepository.save(token);
            throw new InvalidCredentialException("Invalid OTP");
        }
    }

}
