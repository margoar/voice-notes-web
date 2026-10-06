import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { getBooks } from '../../api/books.api';
import type { Book } from '../../types/Book';

export function BooksPage() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

        loadBooks();
    }, []);

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

                <button type="button" className="btn btn-dark">
                    <i className="bi bi-plus-lg me-2"></i>
                    Nuevo
                </button>
            </div>

            <div className="d-flex flex-column gap-3">
                {books.map((book) => (
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
                                        <h2 className="h6 fw-semibold mb-1">
                                            {book.title}
                                        </h2>

                                        <p className="text-secondary small mb-2">
                                            {book.author}
                                        </p>
                                    </div>
                                </Link>

                                <button
                                    type="button"
                                    className="btn btn-light"
                                    aria-label={`Opciones de ${book.title}`}
                                >
                                    <i className="bi bi-three-dots-vertical"></i>
                                </button>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}