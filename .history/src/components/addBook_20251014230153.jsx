import React, { useState } from "react";

const AddBook = ({ onAddBook, onClose }) => {
    const [form, setForm] = useState({
        title: '',
        subtitle: '',
        authors: '',
        publisher: '',
        year: '',
        language: '',
        pages: '',
        price: '',
        image: '',
        url: ''
    })

    const handleChange = (e) => {
        setForm({ ...form, [e.target.placeholder.toLowerCase().replace(/ /g, '')]: e.target.value });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        onAddBook(form);
        onClose();
    }
    
    return (
        <div className="modal-overlay">
            <div className="modal">
                <form className="add-book-form" onSubmit={handleSubmit}>
                    <h2>Add a New Book</h2>
                    <input type="text" placeholder="Title" required onChange={handleChange} />
                    <input type="text" placeholder="Authors" required onChange={handleChange} />
                    <input type="text" placeholder="Publisher" required onChange={handleChange} />
                    <input type="text" placeholder="Publication Year" required onChange={handleChange} />
                    <input type="text" placeholder="Language" required onChange={handleChange} />
                    <input type="number" placeholder="Pages" required onChange={handleChange} />
                    <button type="submit">Add Book</button>
                </form>
            </div>
        </div>
    );
}

export default AddBook;