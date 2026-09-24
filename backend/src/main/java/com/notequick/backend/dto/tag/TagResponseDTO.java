package com.notequick.backend.dto.tag;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TagResponseDTO {
    private UUID tagId;
    private String name;
    private long todoCount;
    private LocalDateTime createdAt;
}
