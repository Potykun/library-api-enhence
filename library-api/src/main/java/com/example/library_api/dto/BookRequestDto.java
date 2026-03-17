package com.example.library_api.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
 public class BookRequestDto {
    
    @NotBlank private String title;
    @NotBlank private String author;
    @Min(1450) private int publicationYear;
}