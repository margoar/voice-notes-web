
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { deleteBook, getBooks } from '../../api/books.api';
import type { Book } from '../../types/Book';

export function BooksPage() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);
    const [deletingBookId, setDeletingBookId] = useState<number | null>(null);

    useEffect(() => {
        async function loadBooks() {
            try {
                const data = await getBooks();
                setBooks(data);
            } catch {
                setError('No se pudieron cargar los libros.');
            } finally {
                setLoading(false);
            }
        }

        void loadBooks();
    }, []);

    async function handleDelete(book: Book) {
        const confirmed = window.confirm(
            `¿Eliminar "${book.title}"? También se eliminarán todas sus notas y borradores. Esta acción no se puede deshacer.`,
        );

        if (!confirmed) return;

        try {
            setDeletingBookId(book.id);
            setActionError(null);

            await deleteBook(book.id);

            setBooks((current) =>
                current.filter((item) => item.id !== book.id),
            );
        } catch {
            setActionError(`No se pudo eliminar "${book.title}".`);
        } finally {
            setDeletingBookId(null);
        }
    }

    if (loading) {
        return (
            <div className="container py-4">
                <p className="text-secondary">Cargando libros...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-4">
                <p className="text-danger">{error}</p>
            </div>
        );
    }

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="h4 fw-semibold mb-1">Mis libros</h1>
                    <p className="text-secondary small mb-0">
                        Tus libros y las notas que has creado.
                    </p>
                </div>

                <Link to="/" className="btn btn-dark">
                    <i className="bi bi-plus-lg me-2" />
                    Nuevo
                </Link>
            </div>

            {actionError && (
                <div className="alert alert-danger" role="alert">
                    {actionError}
                </div>
            )}

            {books.length === 0 ? (
                <div className="text-center py-5">
                    <div className="fs-1 mb-3">📚</div>
                    <h2 className="h5">Todavía no tienes libros</h2>
                    <p className="text-secondary">
                        Crea tu primer libro para comenzar a guardar notas.
                    </p>
                    <Link to="/" className="btn btn-dark">
                        Crear libro
                    </Link>
                </div>
            ) : (
                <div className="d-flex flex-column gap-3">
                    {books.map((book) => (
                        <article
                            key={book.id}
                            className="card border-0 shadow-sm"
                        >
                            <div className="card-body">
                                <div className="d-flex align-items-start gap-3">
                                    <Link
                                        to={`/books/${book.id}`}
                                        className="d-flex align-items-start gap-3 flex-grow-1 text-decoration-none text-dark"
                                    >
                                        <div className="fs-2">📖</div>
                                        <div>
                                            <h2 className="h6 fw-semibold mb-1">
                                                {book.title}
                                            </h2>
                                            <p className="text-secondary small mb-0">
                                                {book.author}
                                            </p>
                                        </div>
                                    </Link>

                                    <div className="dropdown">
                                        <button
                                            type="button"
                                            className="btn btn-light"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                            aria-label={`Opciones de ${book.title}`}
                                            disabled={deletingBookId !== null}
                                        >
                                            <i className="bi bi-three-dots-vertical" />
                                        </button>

                                        <ul className="dropdown-menu dropdown-menu-end">
                                            <li>
                                                <button
                                                    type="button"
                                                    className="dropdown-item"
                                                    onClick={() =>
                                                        window.alert(
                                                            'La edición de libros la implementaremos a continuación.',
                                                        )
                                                    }
                                                >
                                                    <i className="bi bi-pencil me-2" />
                                                    Editar
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    type="button"
                                                    className="dropdown-item text-danger"
                                                    disabled={deletingBookId !== null}
                                                    onClick={() => void handleDelete(book)}
                                                >
                                                    <i className="bi bi-trash me-2" />
                                                    {deletingBookId === book.id
                                                        ? 'Eliminando...'
                                                        : 'Eliminar'}
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}
