package com.notequick.backend.dto.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserDetailsDTO {
    private String defaultIfEmpty(String value) {
        return (value == null || value.isBlank()) ? "-" : value;
    }
    public UserDetailsDTO(
            Long completedTodoCount,
            Long removedTodoCount,
            Long activeTodoCount,
            String userName,
            String email,
            String gender,
            String name,
            String phNo,
            String description,
            String birthDay,
            String city,
            String country
    ) {
        this.completedTodoCount = completedTodoCount;
        this.removedTodoCount = removedTodoCount;
        this.activeTodoCount = activeTodoCount;

        this.userName = defaultIfEmpty(userName);
        this.email = defaultIfEmpty(email);
        this.gender = defaultIfEmpty(gender);
        this.name = defaultIfEmpty(name);
        this.phNo = defaultIfEmpty(phNo);
        this.description = defaultIfEmpty(description);
        this.birthDay = defaultIfEmpty(birthDay);
        this.city = defaultIfEmpty(city);
        this.country = defaultIfEmpty(country);
    }
    private Long completedTodoCount;
    private Long removedTodoCount;
    private Long activeTodoCount;
    private String userName;
    private String email;
    private String gender;
    private String name;
    private String phNo;
    private String description;
    private String birthDay;
    private String city;
    private String country;
}
