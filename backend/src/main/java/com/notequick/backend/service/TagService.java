package com.notequick.backend.service;

import com.notequick.backend.dto.tag.TagResponseDTO;
import com.notequick.backend.entity.Tag;

import java.util.List;
import java.util.UUID;

public interface TagService {
    List<TagResponseDTO> getTags(String token);
    Tag createTag(String token, String rawName);
    void deleteTag(String token, UUID tagId) throws Exception;
}
