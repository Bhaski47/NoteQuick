package com.notequick.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.notequick.backend.enums.UserStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.Type;
import org.hibernate.type.SqlTypes;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Entity
@Table(name = "users")
public class User implements UserDetails {

    @Id
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(name = "user_id",columnDefinition = "VARCHAR(36)")
    private UUID userId;

    @Column(name = "username", unique = true, nullable = false)
    private String userName;

    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @Column(name = "name")
    private String name;

    @JsonIgnore
    @Column(name = "password")
    private String password;

    @Column(name = "gender")
    private String gender;

    @Column(name = "birthday")
    private String birthday;

    @Column(name = "city")
    private String city;

    @Column(name = "country")
    private String country;

    @Column(name = "phone", unique = true)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private UserStatus status = UserStatus.ACTIVE;

    @Column(name = "description")
    private String description;

    @Override
    @JsonIgnore
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String getUsername() {
        return this.userName;
    }

    @Override
    @JsonIgnore
    public boolean isEnabled() {
        return UserDetails.super.isEnabled();
    }

    @Override
    @JsonIgnore
    public boolean isCredentialsNonExpired() {
        return UserDetails.super.isCredentialsNonExpired();
    }

    @Override
    @JsonIgnore
    public boolean isAccountNonLocked() {
        return UserDetails.super.isAccountNonLocked();
    }

    @Override
    @JsonIgnore
    public boolean isAccountNonExpired() {
        return UserDetails.super.isAccountNonExpired();
    }
}