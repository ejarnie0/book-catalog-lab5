import { useEffect, useMemo, useState } from "react";
import BookForm from "./components/BookForm.jsx";
import FilterBar from "./components/FilterBar.jsx";
import BookList from "./components/BookList.jsx";

const LS_KEY = "books_v1";

const seed = [
    { id: crypto.randomUUID(), title: "Dune", author: "Frank Herbert", publisher: "Ace", language: "English", year: 1965 },
    { id: crypto.randomUUID(), title: "Le Petit Prince", author: "Antoine de Saint-Exupéry", publisher: "Gallimard", language: "French", year: 1943 },
    { id: crypto.randomUUID(), title: "Norwegian Wood", author: "Haruki Murakami", publisher: "Kodansha", language: "Japanese", year: 1987 },
];

export default function App() {
    const [books, setBooks] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [filters, setFilters] = useState({ publisher: "", language: "" });

    // load once
    useEffect(() => {
        const fromLS = localStorage.getItem(LS_KEY);
        if (fromLS) {
        try { setBooks(JSON.parse(fromLS)); }
        catch { setBooks(seed); }
        } else {
        setBooks(seed);
        }
    }, []);

    // persist on change
    useEffect(() => {
        localStorage.setItem(LS_KEY, JSON.stringify(books));
    }, [books]);

    const editingBook = useMemo(
        () => books.find(b => b.id === editingId) || null,
        [books, editingId]
    );

    const unique = (arr) => [...new Set(arr.filter(Boolean))].sort((a,b)=>a.localeCompare(b));
    const publishers = useMemo(() => unique(books.map(b => b.publisher)), [books]);
    const languages  = useMemo(() => unique(books.map(b => b.language)),  [books]);

    const filtered = useMemo(() => {
        return books.filter(b =>
        (!filters.publisher || b.publisher === filters.publisher) &&
        (!filters.language  || b.language  === filters.language)
        );
    }, [books, filters]);

    const upsertBook = (payload) => {
        if (payload.id) {
        setBooks(prev => prev.map(b => b.id === payload.id ? payload : b));
        } else {
        setBooks(prev => [...prev, { ...payload, id: crypto.randomUUID() }]);
        }
        setEditingId(null);
    };

    const removeBook = (id) => setBooks(prev => prev.filter(b => b.id !== id));

    return (
        <main style={{maxWidth: 980, margin: "40px auto", padding: 16, fontFamily: "system-ui, sans-serif"}}>
        <h1>Book Catalog (Lab 5)</h1>

        <FilterBar
            publishers={publishers}
            languages={languages}
            filters={filters}
            onChange={setFilters}
            onClear={() => setFilters({ publisher: "", language: "" })}
        />

        <BookForm
            key={editingBook ? editingBook.id : "new"}
            initial={editingBook}
            onCancel={() => setEditingId(null)}
            onSave={upsertBook}
        />

        <BookList
            books={filtered}
            onEdit={(id) => setEditingId(id)}
            onDelete={removeBook}
        />
        </main>
    );
}
