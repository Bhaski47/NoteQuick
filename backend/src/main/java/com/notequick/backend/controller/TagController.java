package com.notequick.backend.controller;

import com.notequick.backend.dto.tag.TagDTO;
import com.notequick.backend.dto.tag.TagResponseDTO;
import com.notequick.backend.entity.Tag;
import com.notequick.backend.service.TagService;
import com.notequick.backend.utils.HttpResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/tags")
public class TagController {

    @Autowired
    private TagService tagService;

    @GetMapping
    public ResponseEntity<HttpResponse> getTags(
            @RequestHeader(value = "Authorization", defaultValue = "") String token) {
        List<TagResponseDTO> tags = tagService.getTags(token);
        HttpResponse response = new HttpResponse(HttpStatus.OK.value(), "Tags retrieved successfully", tags);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<HttpResponse> createTag(
            @RequestHeader(value = "Authorization", defaultValue = "") String token,
            @Valid @RequestBody TagDTO tagDTO) {
        Tag tag = tagService.createTag(token, tagDTO.getName());
        HttpResponse response = new HttpResponse(HttpStatus.OK.value(), "Tag created successfully", tag);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/{tagId}")
    public ResponseEntity<HttpResponse> deleteTag(
            @RequestHeader(value = "Authorization", defaultValue = "") String token,
            @PathVariable UUID tagId) throws Exception {
        tagService.deleteTag(token, tagId);
        HttpResponse response = new HttpResponse(HttpStatus.OK.value(), "Tag deleted and removed from todos successfully");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
