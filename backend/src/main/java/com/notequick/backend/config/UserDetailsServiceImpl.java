package com.notequick.backend.config;

import com.notequick.backend.entity.User;
import com.notequick.backend.enums.UserStatus;
import com.notequick.backend.repository.UserJpaRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.Collections;

@Component
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    UserJpaRepo userJpaRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userJpaRepository.findByUserNameAndStatus(username, UserStatus.ACTIVE)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));
        System.out.println(user.getUsername());
        System.out.println(user.getPassword());
        return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(),
                Collections.emptyList());

    }
}
