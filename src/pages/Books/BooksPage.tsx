export function BooksPage() {
    const books = [
        {
            title: 'El Principito',
            author: 'Antoine de Saint-Exupéry',
            notes: 4,
        },
        {
            title: 'Hábitos Atómicos',
            author: 'James Clear',
            notes: 7,
        },
    ];

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="h4 fw-semibold mb-1">Mis libros</h2>
                    <p className="text-secondary mb-0">
                        Tus libros y las notas que has creado.
                    </p>
                </div>

                <button type="button" className="btn btn-dark">
                    <i className="bi bi-plus-lg me-2"></i>
                    <span className="d-none d-sm-inline">Nuevo libro</span>
                </button>
            </div>

            <div className="d-flex flex-column gap-3">
                {books.map((book) => (
                    <article
                        key={book.title}
                        className="card border-0 shadow-sm">
                        <div className="card-body">
                            <div className="d-flex align-items-start gap-3">
                                <div className="fs-2">📖</div>

                                <div className="flex-grow-1">
                                    <h3 className="h6 fw-semibold mb-1">
                                        {book.title}
                                    </h3>

                                    <p className="text-secondary small mb-2">
                                        {book.author}
                                    </p>

                                    <span className="badge text-bg-light">
                                        {book.notes} {book.notes === 1 ? 'nota' : 'notas'}
                                    </span>
                                </div>

                                <button
                                    type="button"
                                    className="btn btn-light"
                                    aria-label={`Opciones de ${book.title}`}>
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