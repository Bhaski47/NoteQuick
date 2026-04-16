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

    @Query("SELECT new com.notequick.backend.dto.user.UserDetailsDTO(count(case when t.status = 'COMPLETED' then 1 end) , " +
            "count(case when t.status = 'REMOVED' then 1 end), " +
            "count(case when t.status = 'ACTIVE' then 1 end), " +
            "u.userName,u.email,u.gender,u.name,u.phone,u.description,u.birthday," +
            "u.city,u.country) FROM User u " +
            "LEFT JOIN Todo t ON t.userId = u.userId " +
            "WHERE u.userName =:userId")
    Optional<UserDetailsDTO> getUserDetails(@Param("userId") String userId);
}
