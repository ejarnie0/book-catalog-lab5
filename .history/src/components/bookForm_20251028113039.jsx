import { useEffect, useState } from "react";

export default function BookForm({ initial, onSave, onCancel }) {
    const [form, setForm] = useState({
        id: null, title: "", author: "", publisher: "", language: "", year: ""
    });

    useEffect(() => {
        if (initial) setForm({
        id: initial.id,
        title: initial.title ?? "",
        author: initial.author ?? "",
        publisher: initial.publisher ?? "",
        language: initial.language ?? "",
        year: initial.year ?? ""
        });
    }, [initial]);

    const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const submit = (e) => {
        e.preventDefault();
        if (!form.title.trim() || !form.author.trim()) {
        alert("Title and Author are required.");
        return;
        }
        const payload = {
        ...form,
        year: form.year ? Number(form.year) : ""
        };
        onSave(payload);
        setForm({ id: null, title: "", author: "", publisher: "", language: "", year: "" });
    };

    const isEditing = !!form.id;

    return (
    <section style={{margin: "24px 0", padding: 16, border: "1px solid #ddd", borderRadius: 12}}>
        <h2 style={{marginTop: 0}}>{isEditing ? "Edit Book" : "Add Book"}</h2>
        <form onSubmit={submit} style={{display: "grid", gap: 12, gridTemplateColumns: "repeat(6, 1fr)"}}>
        <input placeholder="Title *" value={form.title} onChange={e=>update("title", e.target.value)} style={{gridColumn: "span 2"}} />
        <input placeholder="Author *" value={form.author} onChange={e=>update("author", e.target.value)} style={{gridColumn: "span 2"}} />
        <input placeholder="Publisher" value={form.publisher} onChange={e=>update("publisher", e.target.value)} />
        <input placeholder="Language" value={form.language} onChange={e=>update("language", e.target.value)} />
        <input type="number" placeholder="Year" value={form.year} onChange={e=>update("year", e.target.value)} />

        <div style={{gridColumn: "span 6", display: "flex", gap: 8}}>
            <button type="submit">{isEditing ? "Update" : "Save"}</button>
            {isEditing && <button type="button" onClick={onCancel}>Cancel</button>}
            </div>
        </form>
        </section>
    );
}
