
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { getBooks } from '../../api/books.api';
import { getNotesByBookId } from '../../api/notes.api';

import type { Book } from '../../types/Book';
import type { Note } from '../../types/Note';

interface NoteWithBook extends Note {
    bookTitle: string;
}

export function NotesPage() {
    const [notes, setNotes] = useState<NoteWithBook[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadNotes() {
            try {
                setLoading(true);
                setError(null);

                const books: Book[] = await getBooks();

                const notesByBook = await Promise.all(
                    books.map(async (book) => {
                        const bookNotes = await getNotesByBookId(book.id);

                        return bookNotes.map((note) => ({
                            ...note,
                            bookTitle: book.title,
                        }));
                    }),
                );

                const allNotes = notesByBook.flat();

                allNotes.sort(
                    (a, b) =>
                        new Date(b.updatedAt).getTime() -
                        new Date(a.updatedAt).getTime(),
                );

                setNotes(allNotes);
            } catch {
                setError('No se pudieron cargar las notas.');
            } finally {
                setLoading(false);
            }
        }

        void loadNotes();
    }, []);

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="h4 fw-semibold mb-1">Mis notas</h2>
                    <p className="text-secondary mb-0">
                        Tus ideas capturadas desde tu voz.
                    </p>
                </div>
            </div>

            {loading && (
                <p className="text-secondary">Cargando notas...</p>
            )}

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            {!loading && !error && notes.length === 0 && (
                <div className="card border-0 shadow-sm">
                    <div className="card-body text-center py-4">
                        <i className="bi bi-journal-text fs-2 text-secondary" />
                        <p className="fw-semibold mt-3 mb-1">
                            Todavía no tienes notas
                        </p>
                        <p className="text-secondary mb-0">
                            Crea una nota desde uno de tus libros.
                        </p>
                    </div>
                </div>
            )}

            <div className="d-flex flex-column gap-3">
                {notes.map((note) => (
                    <article
                        key={note.id}
                        className="card border-0 shadow-sm"
                    >
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                                <span className="badge text-bg-light">
                                    {note.bookTitle}
                                </span>

                                <small className="text-secondary">
                                    {new Date(note.updatedAt).toLocaleDateString('es-CL')}
                                </small>
                            </div>

                            <p className="mb-3" style={{ whiteSpace: 'pre-wrap' }}>
                                {note.correctedText}
                            </p>

                            <Link
                                to={`/books/${note.bookId}`}
                                className="btn btn-outline-dark btn-sm"
                            >
                                Ver libro
                            </Link>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}
