
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { getBooks, createBook } from '../../api/books.api';
import { getNotesByBookId } from '../../api/notes.api';
import type { FormEvent } from 'react';
import type { Book } from '../../types/Book';

interface BookWithNoteCount extends Book {
    noteCount: number;
}

export function DashboardPage() {
    const [books, setBooks] = useState<BookWithNoteCount[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [saving, setSaving] = useState(false);

    async function loadBooks() {
        try {
            setLoading(true);
            setError(null);

            const allBooks = await getBooks();

            const booksWithCounts = await Promise.all(
                allBooks.map(async (book) => {
                    const notes = await getNotesByBookId(book.id);

                    return {
                        ...book,
                        noteCount: notes.length,
                    };
                }),
            );

            setBooks(booksWithCounts);
        } catch {
            setError('No se pudieron cargar los libros.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        void loadBooks();
    }, []);

    async function handleCreateBook(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!title.trim() || !author.trim()) {
            setError('Completa el título y el autor.');
            return;
        }

        try {
            setSaving(true);
            setError(null);

            await createBook({
                title: title.trim(),
                author: author.trim(),
            });

            setTitle('');
            setAuthor('');
            setShowForm(false);

            await loadBooks();
        } catch {
            setError('No se pudo crear el libro.');
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="container py-4">
            <section className="mb-4">
                <h2 className="h4 fw-semibold mb-1">Hola, Marcee 👋</h2>
                <p className="text-secondary mb-0">
                    Continúa con tus notas y libros.
                </p>
            </section>

            <section>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h2 className="h5 fw-semibold mb-0">Mis libros</h2>

                    <Link
                        to="/books"
                        className="btn btn-link text-decoration-none"
                    >
                        Ver todos
                    </Link>
                </div>

                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}

                {loading ? (
                    <p className="text-secondary">Cargando libros...</p>
                ) : books.length === 0 ? (
                    <div className="card border-0 shadow-sm">
                        <div className="card-body text-center py-4">
                            <i className="bi bi-book fs-2 text-secondary" />
                            <p className="fw-semibold mt-3 mb-1">
                                Todavía no tienes libros
                            </p>
                            <p className="text-secondary mb-0">
                                Agrega uno para comenzar a guardar tus ideas.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="d-flex flex-column gap-3">
                        {books.slice(0, 3).map((book) => (
                            <Link
                                key={book.id}
                                to={`/books/${book.id}`}
                                className="card border-0 shadow-sm text-decoration-none text-body"
                            >
                                <div className="card-body">
                                    <div className="d-flex align-items-start gap-3">
                                        <div className="fs-3">📖</div>

                                        <div>
                                            <h3 className="h6 fw-semibold mb-1">
                                                {book.title}
                                            </h3>

                                            <p className="text-secondary small mb-0">
                                                {book.noteCount}{' '}
                                                {book.noteCount === 1 ? 'nota' : 'notas'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>

            <section className="mt-4">
                <button
                    type="button"
                    className="btn btn-dark w-100 py-3"
                    onClick={() => {
                        setShowForm((current) => !current);
                        setError(null);
                    }}
                >
                    <i className="bi bi-bookmark-plus me-2" />
                    {showForm ? 'Cancelar' : 'Nuevo libro'}
                </button>

                {showForm && (
                    <form
                        className="card border-0 shadow-sm mt-3"
                        onSubmit={handleCreateBook}
                    >
                        <div className="card-body">
                            <h3 className="h6 fw-semibold mb-3">
                                Agregar libro
                            </h3>

                            <div className="mb-3">
                                <label htmlFor="book-title" className="form-label">
                                    Título
                                </label>
                                <input
                                    id="book-title"
                                    className="form-control"
                                    value={title}
                                    onChange={(event) => setTitle(event.target.value)}
                                    required
                                    maxLength={200}
                                    disabled={saving}
                                    placeholder="Ej. El Principito"
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="book-author" className="form-label">
                                    Autor
                                </label>
                                <input
                                    id="book-author"
                                    className="form-control"
                                    value={author}
                                    onChange={(event) => setAuthor(event.target.value)}
                                    required
                                    maxLength={150}
                                    disabled={saving}
                                    placeholder="Ej. Antoine de Saint-Exupéry"
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-dark w-100"
                                disabled={saving || !title.trim() || !author.trim()}
                            >
                                {saving ? 'Guardando...' : 'Guardar libro'}
                            </button>
                        </div>
                    </form>
                )}
            </section>

            <section className="mt-3">
                <Link
                    to="/books"
                    className="btn btn-outline-dark w-100 py-3"
                >
                    <i className="bi bi-collection me-2" />
                    Explorar mis libros
                </Link>
            </section>
        </div>
    );
}
