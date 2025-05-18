
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/books")
@CrossOrigin(origins = "*")  // Allow requests from any origin for development
public class BookController {

    private List<Book> books = new ArrayList<>();

    // Get all books
    @GetMapping
    public List<Book> getAllBooks() {
        return books;
    }

    // Add a new book
    @PostMapping
    public Book addBook(@RequestBody Book book) {
        books.add(book);
        return book;
    }

    // Delete a book by ID
    @DeleteMapping("/{id}")
    public void deleteBook(@PathVariable String id) {
        books.removeIf(book -> book.getId().equals(id));
    }

    // Search books by author or title
    @GetMapping("/search")
    public List<Book> searchBooks(@RequestParam(required = false) String author, 
                                  @RequestParam(required = false) String title) {
        List<Book> filteredBooks = new ArrayList<>(books);
        
        if (author != null && !author.isEmpty()) {
            filteredBooks = filteredBooks.stream()
                .filter(book -> book.getAuthor().toLowerCase().contains(author.toLowerCase()))
                .collect(Collectors.toList());
        }
        
        if (title != null && !title.isEmpty()) {
            filteredBooks = filteredBooks.stream()
                .filter(book -> book.getTitle().toLowerCase().contains(title.toLowerCase()))
                .collect(Collectors.toList());
        }
        
        return filteredBooks;
    }
}