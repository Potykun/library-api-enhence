package com.example.library_api.repository;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.library_api.model.Book;

public interface BookRepository extends JpaRepository<Book, Long> {
    Page<Book> findByDeletedFalse(Pageable pageable);
    Page<Book> findByAuthorContainingIgnoreCaseAndDeletedFalse(
            String author, Pageable pageable);
    Page<Book> findByTitleContainingIgnoreCaseAndDeletedFalse(
            String title, Pageable pageable);
        Page<Book> findByTitleContainingIgnoreCaseAndAuthorContainingIgnoreCaseAndDeletedFalse(
    String title, String author, Pageable pageable);
}