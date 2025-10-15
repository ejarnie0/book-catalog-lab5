import { useState } from 'react'
import booksData from './data/books.json'
import './App.css'
import AddBook from './components/addBook'

function Book({ title, price, subtitle, image, url, onRemove, onClick, selected }) {
    return (
        <div 
            className={`book${selected ? ' selected' : ''}`}
            onClick={onClick}
        >
            <button className='close-button' onClick={e => {e.stopPropagation(); onRemove();}}>Close</button>
            {image && <img src={image} alt={title} className="book-image" />}
            <h3>{title}</h3>
            <p className="price">{price}</p>
            <a href={url} target="_blank" rel="noopener noreferrer" className="learn-more">Learn more</a>
        </div>
    )
    }

function App() {
    const [books, setBooks] = useState(booksData);
    const [showAddBook, setShowAddBook] = useState(false);
    
    const [selectedBooks, setSelectedBooks] = useState([]);

    const handleSelectBook = (isbn13) => {
        setSelectedBooks(selected =>
            selected.includes(isbn13)
                ? selected.filter(id => id !== isbn13) // Deselect
                : [...selected, isbn13]                // Select
        );
    };


    // Controls visibility of AddBook modal
    const handleShowAddBook = () => {setShowAddBook(true)}
    
    // Close book button
    const handleAddBook = (newBook) => {
        setBooks([...books, newBook]) 
        setShowAddBook(false)
    }

    // Remove book by isbn13
    const handleRemoveBook = (isbn13) => {
        setBooks(books.filter(book => book.isbn13 !== isbn13))
    }

    return (
        <div className="app">
        <header className="header">
            <h1>Book Catalog :)</h1>
        </header>
        
        <main className="main-content">
            <div className="container">
                <div className="left-panel">
                    <div className="add-book-card" onClick={handleShowAddBook}>
                        <div className="add-book-text">Add Book +</div>
                    </div>
                    <div className="action-buttons">
                        <button className="edit-button">Edit</button>
                        <button className="delete-button">Delete</button>
                    </div>
                </div>
                {showAddBook && (
                    <AddBook 
                        onAddBook={handleAddBook}
                        onClose={() => setShowAddBook(false)}
                    />
                )} {/* CONDITIONAL RENDERING */}
                <div className="books-grid">
                    {books.map((book) => (
                        <Book 
                            key={book.isbn13} 
                            title={book.title} 
                            price={book.price}
                            subtitle={book.subtitle}
                            image={book.image}
                            url={book.url}
                            onRemove={() => handleRemoveBook(book.isbn13)}
                            onClick={() => handleSelectBook(book.isbn13)}
                            selected={selectedBooks.includes(book.isbn13)}
                        />
                    ))} 
                </div>
            </div>
        </main>
        
        <footer className="footer">
            <p>© 2025 Emma's Book Catalog</p>
        </footer>
        </div>
    )
    }

export default App