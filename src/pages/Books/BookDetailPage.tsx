
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { getBooks } from '../../api/books.api';
import {
    getNotesByBookId,
    updateNote,
    deleteNote,
} from '../../api/notes.api';
import { generateDraft, updateDraft } from '../../api/drafts.api';

import type { Book } from '../../types/Book';
import type { Note } from '../../types/Note';

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

    const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
    const [editedTranscription, setEditedTranscription] = useState('');
    const [editedCorrectedText, setEditedCorrectedText] = useState('');
    const [savingNote, setSavingNote] = useState(false);
    const [deletingNoteId, setDeletingNoteId] = useState<number | null>(null);
    const [noteActionError, setNoteActionError] = useState<string | null>(null);

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

        void loadBook();
    }, [bookId]);

    async function handleGenerateSummary() {
        if (!bookId || notes.length === 0) {
            return;
        }

        setGeneratingSummary(true);
        setSummaryError(null);
        setSummarySaved(false);

        try {
            const draft = await generateDraft(Number(bookId));

            setDraftId(Number(draft.id));
            setSummary(draft.content);
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

    function handleEditNote(note: Note) {
        setEditingNoteId(note.id);
        setEditedTranscription(note.transcriptionText);
        setEditedCorrectedText(note.correctedText);
        setNoteActionError(null);
    }

    function handleCancelEdit() {
        setEditingNoteId(null);
        setEditedTranscription('');
        setEditedCorrectedText('');
        setNoteActionError(null);
    }

    async function handleSaveNote(noteId: number) {
        if (!editedCorrectedText.trim()) {
            setNoteActionError(
                'El texto corregido no puede estar vacío.',
            );
            return;
        }

        try {
            setSavingNote(true);
            setNoteActionError(null);

            const updatedNote = await updateNote(noteId, {
                transcriptionText: editedTranscription,
                correctedText: editedCorrectedText.trim(),
            });

            setNotes((current) =>
                current.map((note) =>
                    note.id === noteId ? updatedNote : note,
                ),
            );

            handleCancelEdit();
        } catch {
            setNoteActionError('No se pudo guardar la nota.');
        } finally {
            setSavingNote(false);
        }
    }

    async function handleDeleteNote(noteId: number) {
        const confirmed = window.confirm(
            '¿Seguro que quieres eliminar esta nota? Esta acción no se puede deshacer.',
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingNoteId(noteId);
            setNoteActionError(null);

            await deleteNote(noteId);

            setNotes((current) =>
                current.filter((note) => note.id !== noteId),
            );

            if (editingNoteId === noteId) {
                handleCancelEdit();
            }
        } catch {
            setNoteActionError('No se pudo eliminar la nota.');
        } finally {
            setDeletingNoteId(null);
        }
    }

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
                className="text-decoration-none text-secondary small"
            >
                <i className="bi bi-arrow-left me-2" />
                Mis libros
            </Link>

            <div className="mt-4 mb-4">
                <h1 className="h4 fw-semibold mb-1">{book.title}</h1>

                <p className="text-secondary mb-0">{book.author}</p>
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
                    className="btn btn-dark"
                >
                    <i className="bi bi-mic-fill me-2" />
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
                    {notes.map((note) => {
                        const isEditing = editingNoteId === note.id;

                        return (
                            <article
                                key={note.id}
                                className="card border-0 shadow-sm"
                            >
                                <div className="card-body">
                                    {isEditing ? (
                                        <>
                                            <label
                                                htmlFor={`transcription-${note.id}`}
                                                className="form-label"
                                            >
                                                Transcripción original
                                            </label>

                                            <textarea
                                                id={`transcription-${note.id}`}
                                                className="form-control mb-3"
                                                rows={3}
                                                value={editedTranscription}
                                                onChange={(event) =>
                                                    setEditedTranscription(
                                                        event.target.value,
                                                    )
                                                }
                                                disabled={savingNote}
                                            />

                                            <label
                                                htmlFor={`corrected-${note.id}`}
                                                className="form-label"
                                            >
                                                Texto corregido
                                            </label>

                                            <textarea
                                                id={`corrected-${note.id}`}
                                                className="form-control"
                                                rows={5}
                                                value={editedCorrectedText}
                                                onChange={(event) =>
                                                    setEditedCorrectedText(
                                                        event.target.value,
                                                    )
                                                }
                                                disabled={savingNote}
                                            />

                                            <div className="d-flex flex-wrap gap-2 mt-3">
                                                <button
                                                    type="button"
                                                    className="btn btn-dark"
                                                    onClick={() =>
                                                        void handleSaveNote(note.id)
                                                    }
                                                    disabled={
                                                        savingNote ||
                                                        !editedCorrectedText.trim()
                                                    }
                                                >
                                                    <i className="bi bi-save me-2" />
                                                    {savingNote
                                                        ? 'Guardando...'
                                                        : 'Guardar cambios'}
                                                </button>

                                                <button
                                                    type="button"
                                                    className="btn btn-outline-secondary"
                                                    onClick={handleCancelEdit}
                                                    disabled={savingNote}
                                                >
                                                    Cancelar
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <p
                                                className="mb-2"
                                                style={{ whiteSpace: 'pre-wrap' }}
                                            >
                                                {note.correctedText}
                                            </p>

                                            <small className="text-secondary d-block mb-3">
                                                {new Date(
                                                    note.createdAt,
                                                ).toLocaleDateString('es-CL')}
                                            </small>

                                            <div className="d-flex flex-wrap gap-2">
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-dark btn-sm"
                                                    onClick={() =>
                                                        handleEditNote(note)
                                                    }
                                                    disabled={
                                                        deletingNoteId !== null
                                                    }
                                                >
                                                    <i className="bi bi-pencil me-1" />
                                                    Editar
                                                </button>

                                                <button
                                                    type="button"
                                                    className="btn btn-outline-danger btn-sm"
                                                    onClick={() =>
                                                        void handleDeleteNote(note.id)
                                                    }
                                                    disabled={
                                                        deletingNoteId !== null
                                                    }
                                                >
                                                    <i className="bi bi-trash me-1" />
                                                    {deletingNoteId === note.id
                                                        ? 'Eliminando...'
                                                        : 'Eliminar'}
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}

            {noteActionError && (
                <div className="alert alert-danger mt-3" role="alert">
                    {noteActionError}
                </div>
            )}

            <div className="mt-4">
                <button
                    type="button"
                    className="btn btn-outline-dark w-100"
                    disabled={notes.length === 0 || generatingSummary}
                    onClick={() => void handleGenerateSummary()}
                >
                    <i className="bi bi-stars me-2" />

                    {generatingSummary
                        ? 'Generando resumen...'
                        : 'Generar resumen'}
                </button>

                {summaryError && (
                    <div className="alert alert-danger mt-3" role="alert">
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

                                <i className="bi bi-stars" />
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
                                onClick={() => void handleSaveSummary()}
                                disabled={
                                    savingSummary || draftId === null
                                }
                            >
                                <i className="bi bi-save me-2" />

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
