import { useEffect, useMemo, useState } from "react";
import BookForm from "./components/BookForm.jsx";
import FilterBar from "./components/FilterBar.jsx";
import BookGrid from "./components/BookGrid.jsx";
import Modal from "./components/Modal.jsx";

const LS_KEY = "books_v1";

const seed = [
    { id: crypto.randomUUID(), title: "Dune", author: "Frank Herbert", publisher: "Ace", language: "English", year: 1965, image: "" },
    { id: crypto.randomUUID(), title: "Le Petit Prince", author: "Antoine de Saint-Exupéry", publisher: "Gallimard", language: "French", year: 1943, image: "" },
    { id: crypto.randomUUID(), title: "Norwegian Wood", author: "Haruki Murakami", publisher: "Kodansha", language: "Japanese", year: 1987, image: "" },
];

export default function App() {
  const [books, setBooks] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [filters, setFilters] = useState({ publisher: "", language: "" });
  const [modalOpen, setModalOpen] = useState(false);

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

  // persist
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(books));
  }, [books]);

  const unique = (arr) => [...new Set(arr.filter(Boolean))].sort((a,b)=>a.localeCompare(b));
  const publishers = useMemo(() => unique(books.map(b => b.publisher)), [books]);
  const languages  = useMemo(() => unique(books.map(b => b.language)),  [books]);

  const editingBook = useMemo(
    () => books.find(b => b.id === editingId) || null,
    [books, editingId]
  );

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
    setModalOpen(false);
  };

  const removeBook = (id) => setBooks(prev => prev.filter(b => b.id !== id));

  const openAdd = () => { setEditingId(null); setModalOpen(true); };
  const openEdit = (id) => { setEditingId(id); setModalOpen(true); };

  return (
    <div className="app">
      <header className="header">
        <h1>Book Catalog</h1>
      </header>

      <main className="main-content">
        <div className="container">
          {/* LEFT PANEL: Filters */}
          <aside className="left-panel">
            <FilterBar
              publishers={publishers}
              languages={languages}
              filters={filters}
              onChange={setFilters}
              onClear={() => setFilters({ publisher: "", language: "" })}
            />
          </aside>

          {/* GRID: Cards + Add card */}
          <section style={{ gridColumn: 2 }}>
            <BookGrid
              books={filtered}
              onAdd={openAdd}
              onEdit={openEdit}
              onDelete={removeBook}
            />
          </section>
        </div>
      </main>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Book Catalog</p>
      </footer>

      {/* Popup for Add/Edit */}
      <Modal
        open={modalOpen}
        title={editingBook ? "Edit Book" : "Add Book"}
        onClose={() => { setModalOpen(false); setEditingId(null); }}
      >
        <BookForm
          initial={editingBook}
          onSave={upsertBook}
          onCancel={() => { setModalOpen(false); setEditingId(null); }}
        />
      </Modal>
    </div>
  );
}
