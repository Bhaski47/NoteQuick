package com.notequick.backend.dto.user;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserDTO {

    private String name;

    private String gender;

    private String birthday;

    private String city;

    private String country;

    private String phone;

    private String description;

}
