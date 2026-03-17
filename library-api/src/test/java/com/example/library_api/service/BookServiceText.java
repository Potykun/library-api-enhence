package com.example.library_api.service;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.Optional;
import java.util.NoSuchElementException;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.library_api.dto.BookRequestDto;
import com.example.library_api.dto.BookResponseDto;
import com.example.library_api.model.Book;
import com.example.library_api.repository.BookRepository;

@ExtendWith(MockitoExtension.class) // Подключает Mockito к JUnit 5
class BookServiceTest {

    @Mock
    private BookRepository repo; // Создаем фейковый репозиторий

    @InjectMocks
    private BookService service; // Инжектим фейк в реальный сервис

    @SuppressWarnings("null")
    @Test
    void create_ShouldReturnDto_WhenSuccess() {
        // 1. Arrange (Подготовка данных)
        BookRequestDto request = new BookRequestDto("Clean Code", "Robert Martin", 2008);
        Book savedBook = new Book();
        savedBook.setId(1L);
        savedBook.setTitle("Clean Code");
        
        when(repo.save(any(Book.class))).thenReturn(savedBook);

        // 2. Act (Действие)
        BookResponseDto result = service.create(request);

        // 3. Assert (Проверка результата)
        assertNotNull(result);
        assertEquals("Clean Code", result.getTitle());
        verify(repo, times(1)).save(any(Book.class)); // Проверяем, что метод save вызвался 1 раз
    }

    @Test
    void getOne_ShouldThrowException_WhenBookNotFound() {
        // Arrange
        when(repo.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(NoSuchElementException.class, () -> service.getOne(1L));
    }

    @Test
    void delete_ShouldSetDeletedTrue() {
        // Arrange
        Book book = new Book();
        book.setId(1L);
        book.setDeleted(false);
        
        when(repo.findById(1L)).thenReturn(Optional.of(book));

        // Act
        service.delete(1L);

        // Assert
        assertTrue(book.isDeleted());
        verify(repo).save(book); // Проверяем, что сохранили обновленную сущность
    }
}