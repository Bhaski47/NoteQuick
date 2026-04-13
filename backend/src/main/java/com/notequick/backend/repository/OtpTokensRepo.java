package com.notequick.backend.repository;

import com.notequick.backend.entity.OtpTokens;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OtpTokensRepo extends JpaRepository<OtpTokens, Long> {
    Optional<OtpTokens> findByEmailAndOtpAndUsedFalse(String email, String otp);
    void deleteByEmail(String email);
}