import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { getBooks } from '../../api/books.api';
import { getNotesByBookId } from '../../api/notes.api';
import type { Book } from '../../types/Book';
import type { Note } from '../../types/Note';
import { generateDraft, updateDraft } from '../../api/drafts.api';

export function BookDetailPage() {
    const { bookId } = useParams();

    const [book, setBook] = useState<Book | null>(null);
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [summary, setSummary] = useState<string | null>(null);
    const [generatingSummary, setGeneratingSummary] = useState(false);
    const [summaryError, setSummaryError] = useState<string | null>(null);
    const [draftId, setDraftId] = useState<number | null>(null);
    const [savingSummary, setSavingSummary] = useState(false);
    const [summarySaved, setSummarySaved] = useState(false);

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

    async function handleGenerateSummary() {
        if (!bookId || notes.length === 0) {
            return;
        }

        setGeneratingSummary(true);
        setSummaryError(null);

        try {
            const draft = await generateDraft(Number(bookId));
            setDraftId(Number(draft.id));
            setSummary(draft.content);
            setSummarySaved(false);
        } catch {
            setSummaryError('No se pudo generar el resumen.');
        } finally {
            setGeneratingSummary(false);
        }
    }
    async function handleSaveSummary() {
        if (draftId === null || summary === null) {
            return;
        }

        setSavingSummary(true);
        setSummaryError(null);
        setSummarySaved(false);

        try {
            const updatedDraft = await updateDraft(draftId, summary);

            setSummary(updatedDraft.content);
            setSummarySaved(true);
        } catch {
            setSummaryError('No se pudieron guardar los cambios.');
        } finally {
            setSavingSummary(false);
        }
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
                    disabled={notes.length === 0 || generatingSummary}
                    onClick={handleGenerateSummary}
                >
                    <i className="bi bi-stars me-2"></i>

                    {generatingSummary
                        ? 'Generando resumen...'
                        : 'Generar resumen'}
                </button>

                {summaryError && (
                    <div className="alert alert-danger mt-3">
                        {summaryError}
                    </div>
                )}


                {summary !== null && (
                    <div className="card border-0 shadow-sm mt-4">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h2 className="h6 fw-semibold mb-0">
                                    Editar borrador
                                </h2>

                                <i className="bi bi-stars"></i>
                            </div>

                            <textarea
                                className="form-control"
                                rows={12}
                                value={summary}
                                onChange={(event) => {
                                    setSummary(event.target.value);
                                    setSummarySaved(false);
                                }}
                                disabled={savingSummary}
                            />

                            <button
                                type="button"
                                className="btn btn-dark w-100 mt-3"
                                onClick={handleSaveSummary}
                                disabled={savingSummary || draftId === null}
                            >
                                <i className="bi bi-save me-2"></i>
                                {savingSummary
                                    ? 'Guardando cambios...'
                                    : 'Guardar cambios'}
                            </button>

                            {summarySaved && (
                                <div className="alert alert-success mt-3 mb-0">
                                    Borrador guardado correctamente.
                                </div>
                            )}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}