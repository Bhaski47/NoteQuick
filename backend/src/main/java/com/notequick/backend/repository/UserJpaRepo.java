package com.notequick.backend.repository;

import com.notequick.backend.dto.user.UserDetailsDTO;
import com.notequick.backend.entity.User;
import com.notequick.backend.enums.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserJpaRepo extends JpaRepository<User, UUID> {
//    Optional<User> findByUserName(String userName);
    Optional<User> findByUserNameAndStatus(String userName, UserStatus userStatus);
    Optional<User> findByEmail(String email);
    Optional<User> findByEmailAndStatus(String email, UserStatus userStatus);
    Optional<User> findByUserNameAndEmail(String userName, String email);
}
