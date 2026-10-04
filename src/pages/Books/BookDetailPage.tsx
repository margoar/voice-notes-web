import { Link, useParams } from 'react-router-dom';

import type { Book } from '../../types/Book';
import type { Note } from '../../types/Note';

const books: Book[] = [
    {
        id: '1',
        title: 'El Principito',
        author: 'Antoine de Saint-Exupéry',
        createdAt: '2026-10-04',
    },
    {
        id: '2',
        title: 'Hábitos Atómicos',
        author: 'James Clear',
        createdAt: '2026-10-04',
    },
];

const notes: Note[] = [
    {
        id: '1',
        bookId: '1',
        transcriptionText:
            'Una reflexión sobre la amistad, los vínculos y aquello que realmente importa.',
        correctedText:
            'Una reflexión sobre la amistad, los vínculos y aquello que realmente importa.',
        createdAt: '2026-10-04',
    },
    {
        id: '2',
        bookId: '1',
        transcriptionText:
            'Me llamó especialmente la atención la forma en que habla sobre hacerse responsable de los vínculos.',
        correctedText:
            'Me llamó especialmente la atención la forma en que habla sobre hacerse responsable de los vínculos.',
        createdAt: '2026-10-03',
    },
];

export function BookDetailPage() {
    const { bookId } = useParams();

    const book = books.find((item) => item.id === bookId);

    const bookNotes = notes.filter(
        (note) => note.bookId === bookId,
    );

    if (!book) {
        return (
            <div className="container py-4">
                <h2 className="h4">Libro no encontrado</h2>

                <Link
                    to="/books"
                    className="btn btn-link px-0 text-decoration-none"
                >
                    Volver a mis libros
                </Link>
            </div>
        );
    }

    return (
        <div className="container py-4">
            <div className="mb-4">
                <Link
                    to="/books"
                    className="btn btn-link px-0 text-decoration-none"
                >
                    <i className="bi bi-arrow-left me-2"></i>
                    Mis libros
                </Link>
            </div>

            <section className="mb-4">
                <div className="d-flex align-items-start gap-3">
                    <div className="fs-1">📖</div>

                    <div>
                        <h2 className="h4 fw-semibold mb-1">
                            {book.title}
                        </h2>

                        <p className="text-secondary mb-0">
                            {book.author}
                        </p>
                    </div>
                </div>
            </section>

            <section className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <h3 className="h5 fw-semibold mb-1">
                            Mis notas
                        </h3>

                        <p className="text-secondary small mb-0">
                            {bookNotes.length}{' '}
                            {bookNotes.length === 1 ? 'nota' : 'notas'}
                        </p>
                    </div>

                    <Link
                        to={`/books/${book.id}/notes/new`}
                        className="btn btn-dark" >
                        <i className="bi bi-mic-fill me-2"></i>
                        Nueva nota
                    </Link>
                </div>

                <div className="d-flex flex-column gap-3">
                    {bookNotes.map((note) => (
                        <article
                            key={note.id}
                            className="card border-0 shadow-sm" >
                            <div className="card-body">
                                <p className="mb-0">
                                    {note.correctedText}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section className="border-top pt-4">
                <button
                    type="button"
                    className="btn btn-dark w-100 py-3">
                    <i className="bi bi-stars me-2"></i>
                    Generar resumen
                </button>
            </section>
        </div>
    );
}