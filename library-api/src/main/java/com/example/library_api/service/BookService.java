package com.example.library_api.service;

import java.util.NoSuchElementException;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.library_api.dto.BookRequestDto;
import com.example.library_api.dto.BookResponseDto;
import com.example.library_api.model.Book;
import com.example.library_api.repository.BookRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BookService {
    private final BookRepository repo;

    public Page<BookResponseDto> getAll(String title, String author, Pageable pageable) {
    Page<Book> books;
    
    if (hasText(title) && hasText(author)) {
        books = repo.findByTitleContainingIgnoreCaseAndAuthorContainingIgnoreCaseAndDeletedFalse(title, author, pageable);
    } else if (hasText(author)) {
        books = repo.findByAuthorContainingIgnoreCaseAndDeletedFalse(author, pageable);
    } else if (hasText(title)) {
        books = repo.findByTitleContainingIgnoreCaseAndDeletedFalse(title, pageable);
    } else {
        books = repo.findByDeletedFalse(pageable);
    }
    
    return books.map(this::toDto);
}


private boolean hasText(String str) {
    return str != null && !str.isBlank();
}

    public BookResponseDto create(BookRequestDto dto) {
        Book book = new Book();
        book.setTitle(dto.getTitle());
        book.setAuthor(dto.getAuthor());
        book.setPublicationYear(dto.getPublicationYear());
        return toDto(repo.save(book));
    }

    public BookResponseDto getOne(Long id) {
        return toDto(findActive(id));
    }

    public BookResponseDto update(Long id, BookRequestDto dto) {
        Book book = findActive(id);
        book.setTitle(dto.getTitle());
        book.setAuthor(dto.getAuthor());
        book.setPublicationYear(dto.getPublicationYear());
        return toDto(repo.save(book));
    }

    public void delete(Long id) {  // Soft Delete
        Book book = findActive(id);
        book.setDeleted(true);
        repo.save(book);
    }

    @SuppressWarnings("null")
    private Book findActive(Long id) {
        return repo.findById(id)
            .filter(b -> !b.isDeleted())
            .orElseThrow(() -> new NoSuchElementException("Book not found"));
    }

    private BookResponseDto toDto(Book b) {
        BookResponseDto dto = new BookResponseDto();
        dto.setId(b.getId()); dto.setTitle(b.getTitle());
        dto.setAuthor(b.getAuthor()); dto.setPublicationYear(b.getPublicationYear());
        return dto;
    }
}