import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { getBooks } from '../../api/books.api';
import { getNotesByBookId } from '../../api/notes.api';
import type { Book } from '../../types/Book';
import type { Note } from '../../types/Note';

export function BookDetailPage() {
    const { bookId } = useParams();

    const [book, setBook] = useState<Book | null>(null);
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadBook() {
            if (!bookId) {
                setError('Libro no encontrado.');
                setLoading(false);
                return;
            }

            try {
                const books = await getBooks();
                const selectedBook = books.find(
                    (item) => item.id === Number(bookId),
                );

                if (!selectedBook) {
                    setError('Libro no encontrado.');
                    return;
                }

                const bookNotes = await getNotesByBookId(Number(bookId));

                setBook(selectedBook);
                setNotes(bookNotes);
            } catch {
                setError('No se pudo cargar el libro.');
            } finally {
                setLoading(false);
            }
        }

        loadBook();
    }, [bookId]);

    if (loading) {
        return (
            <div className="container py-4">
                <p className="text-secondary">Cargando libro...</p>
            </div>
        );
    }

    if (error || !book) {
        return (
            <div className="container py-4">
                <p className="text-danger">
                    {error ?? 'Libro no encontrado.'}
                </p>

                <Link to="/books" className="btn btn-dark">
                    Volver a libros
                </Link>
            </div>
        );
    }

    return (
        <div className="container py-4">
            <Link
                to="/books"
                className="text-decoration-none text-secondary small">
                <i className="bi bi-arrow-left me-2"></i>
                Mis libros
            </Link>

            <div className="mt-4 mb-4">
                <h1 className="h4 fw-semibold mb-1">{book.title}</h1>

                <p className="text-secondary mb-0">
                    {book.author}
                </p>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h2 className="h6 fw-semibold mb-1">Notas</h2>

                    <p className="text-secondary small mb-0">
                        {notes.length}{' '}
                        {notes.length === 1 ? 'nota' : 'notas'}
                    </p>
                </div>

                <Link
                    to={`/books/${book.id}/notes/new`}
                    className="btn btn-dark">
                    <i className="bi bi-mic-fill me-2"></i>
                    Nueva nota
                </Link>
            </div>

            {notes.length === 0 ? (
                <div className="card border-0 shadow-sm">
                    <div className="card-body text-center py-5">
                        <div className="fs-1 mb-3">🎙️</div>

                        <h3 className="h6 fw-semibold">
                            Todavía no tienes notas
                        </h3>

                        <p className="text-secondary small mb-0">
                            Graba tu primera reflexión sobre este libro.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="d-flex flex-column gap-3">
                    {notes.map((note) => (
                        <article
                            key={note.id}
                            className="card border-0 shadow-sm">
                            <div className="card-body">
                                <p className="mb-2">
                                    {note.correctedText}
                                </p>

                                <small className="text-secondary">
                                    {new Date(note.createdAt).toLocaleDateString(
                                        'es-CL',
                                    )}
                                </small>
                            </div>
                        </article>
                    ))}
                </div>
            )}

            <div className="mt-4">
                <button
                    type="button"
                    className="btn btn-outline-dark w-100"
                    disabled={notes.length === 0} >
                    <i className="bi bi-stars me-2"></i>
                    Generar resumen
                </button>
            </div>
        </div>
    );
}