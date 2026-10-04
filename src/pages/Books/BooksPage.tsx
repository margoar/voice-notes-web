import { Link } from 'react-router-dom';

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

export function BooksPage() {
    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="h4 fw-semibold mb-1">
                        Mis libros
                    </h2>

                    <p className="text-secondary mb-0">
                        Tus libros y las notas que has creado.
                    </p>
                </div>

                <button type="button" className="btn btn-dark">
                    <i className="bi bi-plus-lg me-2"></i>

                    <span className="d-none d-sm-inline">
                        Nuevo libro
                    </span>
                </button>
            </div>

            <div className="d-flex flex-column gap-3">
                {books.map((book) => {
                    const bookNotesCount = notes.filter(
                        (note) => note.bookId === book.id,
                    ).length;

                    return (
                        <article
                            key={book.id}
                            className="card border-0 shadow-sm">
                            <div className="card-body">
                                <div className="d-flex align-items-start gap-3">
                                    <Link
                                        to={`/books/${book.id}`}
                                        className="d-flex align-items-start gap-3 flex-grow-1 text-decoration-none text-dark"
                                    >
                                        <div className="fs-2">📖</div>

                                        <div>
                                            <h3 className="h6 fw-semibold mb-1">
                                                {book.title}
                                            </h3>

                                            <p className="text-secondary small mb-2">
                                                {book.author}
                                            </p>

                                            <span className="badge text-bg-light">
                                                {bookNotesCount}{' '}
                                                {bookNotesCount === 1 ? 'nota' : 'notas'}
                                            </span>
                                        </div>
                                    </Link>

                                    <button
                                        type="button"
                                        className="btn btn-light"
                                        aria-label={`Opciones de ${book.title}`}>
                                        <i className="bi bi-three-dots-vertical"></i>
                                    </button>
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>
        </div>
    );
}