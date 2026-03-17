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
      
        Book book1 = new Book();
        book1.setTitle("Harry Potter");
        book1.setAuthor("Author1");
        book1.setPublicationYear(1997);
        book1.setDeleted(false);
        repo.save(book1);

    
        Book book2 = new Book();
        book2.setTitle("Lord of the Rings");
        book2.setAuthor("Author2");
        book2.setPublicationYear(1954);
        book2.setDeleted(false);
        repo.save(book2);

    }
}
