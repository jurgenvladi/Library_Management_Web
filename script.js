// API URL (change this to your backend URL)
const API_URL = 'http://localhost:8080/books';

// DOM Elements
const bookForm = document.getElementById('bookForm');
const titleInput = document.getElementById('title');
const authorInput = document.getElementById('author');
const yearInput = document.getElementById('publicationYear');
const genreInput = document.getElementById('genre');
const formError = document.getElementById('formError');
const searchInput = document.getElementById('searchInput');
const booksTableBody = document.getElementById('booksTableBody');
const noBooksMessage = document.getElementById('noBooks');

// Load books when page loads
document.addEventListener('DOMContentLoaded', loadBooks);

// Event Listeners
bookForm.addEventListener('submit', addBook);
searchInput.addEventListener('input', filterBooks);

// Function to load books from API
async function loadBooks() {
    try {
        const response = await fetch(API_URL);
        const books = await response.json();
        
        displayBooks(books);
    } catch (error) {
        console.error('Error loading books:', error);
    }
}

// Function to display books in table
function displayBooks(books) {
    booksTableBody.innerHTML = '';
    
    if (books.length === 0) {
        noBooksMessage.style.display = 'block';
        return;
    }
    
    noBooksMessage.style.display = 'none';
    
    books.forEach(book => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${escapeHtml(book.title)}</td>
            <td>${escapeHtml(book.author)}</td>
            <td>${book.publicationYear}</td>
            <td>${escapeHtml(book.genre)}</td>
            <td>
                <button class="delete-btn" data-id="${book.id}">Fshij</button>
            </td>
        `;
        
        booksTableBody.appendChild(row);
    });
    
    // Add event listeners to delete buttons
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', deleteBook);
    });
}

// Function to add a new book
async function addBook(e) {
    e.preventDefault();
    
    const title = titleInput.value.trim();
    const author = authorInput.value.trim();
    const year = parseInt(yearInput.value);
    const genre = genreInput.value;
    
    // Validate input
    if (!validateForm(title, author, year, genre)) {
        return;
    }
    
    const book = {
        title,
        author,
        publicationYear: year,
        genre
    };
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(book)
        });
        
        if (!response.ok) {
            throw new Error('Failed to add book');
        }
        
        // Reset form
        bookForm.reset();
        formError.textContent = '';
        
        // Reload books
        loadBooks();
    } catch (error) {
        console.error('Error adding book:', error);
        formError.textContent = 'Gabim: Nuk mundëm të shtojmë librin.';
    }
}

// Function to delete a book
async function deleteBook(e) {
    const bookId = e.target.getAttribute('data-id');
    
    try {
        const response = await fetch(`${API_URL}/${bookId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete book');
        }
        
        // Reload books
        loadBooks();
    } catch (error) {
        console.error('Error deleting book:', error);
    }
}

// Function to filter books
function filterBooks() {
    const searchTerm = searchInput.value.toLowerCase();
    const rows = booksTableBody.querySelectorAll('tr');
    
    let visibleCount = 0;
    
    rows.forEach(row => {
        const title = row.cells[0].textContent.toLowerCase();
        const author = row.cells[1].textContent.toLowerCase();
        
        if (title.includes(searchTerm) || author.includes(searchTerm)) {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });
    
    if (visibleCount === 0) {
        noBooksMessage.style.display = 'block';
        noBooksMessage.textContent = 'Nuk u gjet asnjë libër që përputhet me kërkimin tuaj.';
    } else {
        noBooksMessage.style.display = 'none';
    }
}

// Form validation
function validateForm(title, author, year, genre) {
    // Clear previous error
    formError.textContent = '';
    
    // Check if all fields are filled
    if (!title || !author || !year || !genre) {
        formError.textContent = 'Të gjitha fushat janë të detyrueshme.';
        return false;
    }
    
    // Check if year is a valid number
    if (isNaN(year)) {
        formError.textContent = 'Viti duhet të jetë numër.';
        return false;
    }
    
    // Check if author name doesn't contain symbols
    const authorRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s\-.]+$/;
    if (!authorRegex.test(author)) {
        formError.textContent = 'Emri i autorit nuk mund të përmbajë simbole.';
        return false;
    }
    
    return true;
}

// Helper function to escape HTML to prevent XSS
function escapeHtml(unsafeText) {
    return unsafeText
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}