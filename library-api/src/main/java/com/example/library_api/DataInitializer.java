package com.example.library_api;


import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.example.library_api.model.Book;
import com.example.library_api.repository.BookRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final BookRepository repo;

    @Override
    public void run(String... args) {
        if (repo.count() == 0) {
            repo.saveAll(java.util.List.of(
                new Book(null, "The Lord of the Rings", "J.R.R. Tolkien", 1954, false),
                new Book(null, "1984", "George Orwell", 1949, false),
                new Book(null, "Harry Potter and the Sorcerer's Stone", "J.K. Rowling", 1997, false),
                new Book(null, "To Kill a Mockingbird", "Harper Lee", 1960, false),
                new Book(null, "The Great Gatsby", "F. Scott Fitzgerald", 1925, false),
                new Book(null, "Pride and Prejudice", "Jane Austen", 1813, false),
                new Book(null, "Dune", "Frank Herbert", 1965, false)
            ));
        }
    }
}
