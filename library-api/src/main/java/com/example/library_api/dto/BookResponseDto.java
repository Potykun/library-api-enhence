package com.example.library_api.dto;

import lombok.Data;

@Data public class BookResponseDto {
    private Long id;
    private String title;
    private String author;
    private int publicationYear;
}