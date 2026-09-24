package com.notequick.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@ToString
@EntityListeners(AuditingEntityListener.class)
@Entity
@Table(
    name = "tags",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_user_tag_name", columnNames = {"user_id", "name"})
    },
    indexes = {
        @Index(name = "idx_tag_user_id", columnList = "user_id")
    }
)
public class Tag {

    @Id
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(name = "tag_id", columnDefinition = "VARCHAR(36)")
    private UUID tagId;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Tag(UUID tagId, String userId, String name) {
        this.tagId = tagId;
        this.userId = userId;
        this.name = name;
    }
}
