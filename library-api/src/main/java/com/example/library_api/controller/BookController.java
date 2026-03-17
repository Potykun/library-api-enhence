package com.example.library_api.controller;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.example.library_api.dto.BookRequestDto;
import com.example.library_api.dto.BookResponseDto;
import com.example.library_api.service.BookService;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
@Tag(name = "Library API", description = "CRUD for books")
public class BookController {
  private final BookService service;

  @GetMapping
  public Page<BookResponseDto> getAll(
      @RequestParam(required = false) String title,
      @RequestParam(required = false) String author,
      @ParameterObject @PageableDefault(size = 10, sort = "id") Pageable pageable) {
    return service.getAll(title, author, pageable);
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public BookResponseDto create(@Valid @RequestBody BookRequestDto dto) {
    return service.create(dto);
  }

  @GetMapping("/{id}")
  public BookResponseDto getOne(@PathVariable Long id) {
    return service.getOne(id);
  }

  @PutMapping("/{id}")
  public BookResponseDto update(@PathVariable Long id,
      @Valid @RequestBody BookRequestDto dto) {
    return service.update(id, dto);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable Long id) {
    service.delete(id);
  }
}
