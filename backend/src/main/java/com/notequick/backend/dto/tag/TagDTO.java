package com.notequick.backend.dto.tag;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TagDTO {

    @NotBlank(message = "Tag name is required")
    @Size(min = 1, max = 30, message = "Tag name must be between 1 and 30 characters")
    @Pattern(regexp = "^[a-zA-Z0-9_\\-\\s]+$", message = "Tag name may only contain alphanumeric characters, hyphens, underscores, and spaces")
    private String name;
}
