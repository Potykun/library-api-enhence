package com.example.library_api.controller;

import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.example.library_api.dto.BookRequestDto;
import com.example.library_api.model.Book;
import com.example.library_api.repository.BookRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootTest // Запускает весь контекст приложения
@AutoConfigureMockMvc // Настраивает инструмент для HTTP-вызовов
class BookControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private BookRepository repository;

    @Autowired
    private ObjectMapper objectMapper; // Для превращения объектов в JSON

    @BeforeEach
    void setup() {
        repository.deleteAll(); // Чистим базу перед каждым тестом
    }

    @SuppressWarnings("null")
    @Test
    void shouldCreateBook() throws Exception {
        BookRequestDto request = new BookRequestDto("Spring in Action", "Craig Walls", 2020);

        mockMvc.perform(post("/api/books")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title", is("Spring in Action")))
                .andExpect(jsonPath("$.author", is("Craig Walls")));
    }

    @SuppressWarnings("null")
    @Test
    void shouldReturnBookById() throws Exception {
        // Сначала сохраняем книгу в реальную базу H2
        Book book = new Book();
        book.setTitle("Test Book");
        book.setAuthor("Test Author");
        book.setPublicationYear(2023);
        book = repository.save(book);

        mockMvc.perform(get("/api/books/" + book.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title", is("Test Book")));
    }

    @Test
    void shouldReturn404_WhenBookNotFound() throws Exception {
        mockMvc.perform(get("/api/books/999"))
                .andExpect(status().isNotFound());
    }
}