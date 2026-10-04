export function NotesPage() {
    const notes = [
        {
            id: 1,
            book: 'El Principito',
            preview:
                'Una reflexión sobre la amistad, los vínculos y aquello que realmente importa.',
            date: 'Hoy',
        },
        {
            id: 2,
            book: 'El Principito',
            preview:
                'Me llamó especialmente la atención la forma en que habla sobre hacerse responsable de los vínculos.',
            date: 'Ayer',
        },
        {
            id: 3,
            book: 'Hábitos Atómicos',
            preview:
                'Los pequeños cambios repetidos constantemente pueden terminar produciendo grandes resultados.',
            date: '28 sept.',
        },
    ];

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="h4 fw-semibold mb-1">Mis notas</h2>
                    <p className="text-secondary mb-0">
                        Tus ideas capturadas desde tu voz.
                    </p>
                </div>

                <button
                    type="button"
                    className="btn btn-dark"
                    aria-label="Crear nueva nota"  >
                    <i className="bi bi-mic-fill"></i>
                    <span className="d-none d-sm-inline ms-2">
                        Nueva nota
                    </span>
                </button>
            </div>

            <div className="d-flex flex-column gap-3">
                {notes.map((note) => (
                    <article
                        key={note.id}
                        className="card border-0 shadow-sm">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                                <span className="badge text-bg-light">
                                    {note.book}
                                </span>

                                <small className="text-secondary">
                                    {note.date}
                                </small>
                            </div>

                            <p className="mb-0">
                                {note.preview}
                            </p>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}