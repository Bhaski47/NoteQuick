package com.notequick.backend.dto.user;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginUserDTO {
    @NotBlank
    private String identifier;

    @NotBlank
    private String password;
}
