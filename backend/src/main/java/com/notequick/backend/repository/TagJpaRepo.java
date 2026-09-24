package com.notequick.backend.repository;

import com.notequick.backend.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TagJpaRepo extends JpaRepository<Tag, UUID> {

    List<Tag> findByUserIdOrderByNameAsc(String userId);

    Optional<Tag> findByUserIdAndName(String userId, String name);

    Optional<Tag> findByUserIdAndTagId(String userId, UUID tagId);

    void deleteByUserIdAndTagId(String userId, UUID tagId);
}
