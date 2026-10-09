
import { useEffect, useState } from 'react';

import { getBooks } from '../../api/books.api';
import {
    getDraftsByBookId,
    updateDraft,
} from '../../api/drafts.api';

import type { Book } from '../../types/Book';
import type { Draft } from '../../types/Draft';

interface DraftWithBook extends Draft {
    bookTitle: string;
}

export function DraftsPage() {
    const [drafts, setDrafts] = useState<DraftWithBook[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [editingDraftId, setEditingDraftId] = useState<string | null>(null);
    const [editedContent, setEditedContent] = useState('');
    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        async function loadDrafts() {
            try {
                setLoading(true);
                setError(null);

                const books: Book[] = await getBooks();

                const draftsByBook = await Promise.all(
                    books.map(async (book) => {
                        const bookDrafts = await getDraftsByBookId(book.id);

                        return bookDrafts.map((draft) => ({
                            ...draft,
                            bookTitle: book.title,
                        }));
                    }),
                );

                setDrafts(draftsByBook.flat());
            } catch {
                setError('No se pudieron cargar los borradores.');
            } finally {
                setLoading(false);
            }
        }

        void loadDrafts();
    }, []);

    function handleEdit(draft: DraftWithBook) {
        setEditingDraftId(String(draft.id));
        setEditedContent(draft.content);
        setError(null);
        setSuccessMessage(null);
    }

    function handleCancelEdit() {
        setEditingDraftId(null);
        setEditedContent('');
        setError(null);
    }

    async function handleSave(draft: DraftWithBook) {
        if (!editedContent.trim()) {
            setError('El contenido del borrador no puede estar vacío.');
            return;
        }

        try {
            setSaving(true);
            setError(null);
            setSuccessMessage(null);

            const updatedDraft = await updateDraft(
                Number(draft.id),
                editedContent.trim(),
            );

            setDrafts((currentDrafts) =>
                currentDrafts.map((item) =>
                    item.id === draft.id
                        ? { ...item, ...updatedDraft, bookTitle: item.bookTitle }
                        : item,
                ),
            );

            setEditingDraftId(null);
            setEditedContent('');
            setSuccessMessage('Borrador guardado correctamente.');
        } catch {
            setError('No se pudieron guardar los cambios. Inténtalo nuevamente.');
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="container py-4">
            <div className="mb-4">
                <h2 className="h4 fw-semibold mb-1">Borradores</h2>
                <p className="text-secondary mb-0">
                    Resúmenes generados a partir de tus notas.
                </p>
            </div>

            {loading && (
                <p className="text-secondary">Cargando borradores...</p>
            )}

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            {successMessage && (
                <div className="alert alert-success" role="status">
                    {successMessage}
                </div>
            )}

            {!loading && !error && drafts.length === 0 && (
                <div className="card border-0 shadow-sm">
                    <div className="card-body py-4 text-center">
                        <i className="bi bi-file-earmark-text fs-2 text-secondary" />
                        <p className="fw-semibold mt-3 mb-1">
                            Todavía no tienes borradores
                        </p>
                        <p className="text-secondary mb-0">
                            Genera un resumen desde las notas de uno de tus libros.
                        </p>
                    </div>
                </div>
            )}

            <div className="d-flex flex-column gap-3">
                {drafts.map((draft) => {
                    const isEditing = editingDraftId === String(draft.id);

                    return (
                        <article
                            key={draft.id}
                            className="card border-0 shadow-sm"
                        >
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div>
                                        <span className="badge text-bg-light">
                                            {draft.status === 'published'
                                                ? 'Publicado'
                                                : draft.status === 'approved'
                                                    ? 'Aprobado'
                                                    : 'Borrador'}
                                        </span>

                                        <h3 className="h6 fw-semibold mt-2 mb-0">
                                            {draft.bookTitle}
                                        </h3>
                                    </div>

                                    <small className="text-secondary">
                                        {new Date(draft.updatedAt).toLocaleDateString('es-CL')}
                                    </small>
                                </div>

                                {isEditing ? (
                                    <>
                                        <label
                                            htmlFor={`draft-${draft.id}`}
                                            className="form-label"
                                        >
                                            Contenido del borrador
                                        </label>

                                        <textarea
                                            id={`draft-${draft.id}`}
                                            className="form-control"
                                            rows={10}
                                            value={editedContent}
                                            onChange={(event) =>
                                                setEditedContent(event.target.value)
                                            }
                                            disabled={saving}
                                        />

                                        <div className="d-flex flex-column flex-sm-row gap-2 mt-3">
                                            <button
                                                type="button"
                                                className="btn btn-dark"
                                                onClick={() => void handleSave(draft)}
                                                disabled={saving || !editedContent.trim()}
                                            >
                                                <i className="bi bi-save me-2" />
                                                {saving ? 'Guardando...' : 'Guardar cambios'}
                                            </button>

                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary"
                                                onClick={handleCancelEdit}
                                                disabled={saving}
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p className="mb-3" style={{ whiteSpace: 'pre-wrap' }}>
                                            {draft.content.length > 220
                                                ? `${draft.content.slice(0, 220)}...`
                                                : draft.content}
                                        </p>

                                        <button
                                            type="button"
                                            className="btn btn-dark"
                                            onClick={() => handleEdit(draft)}
                                        >
                                            <i className="bi bi-pencil me-2" />
                                            Editar borrador
                                        </button>
                                    </>
                                )}
                            </div>
                        </article>
                    );
                })}
            </div>
        </div>
    );
}
