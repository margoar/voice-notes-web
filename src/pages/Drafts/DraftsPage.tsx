import type { Draft } from '../../types/Draft';

const drafts: Draft[] = [
    {
        id: '1',
        bookId: '1',
        content:
            'En El Principito encontramos una reflexión sobre los vínculos, la amistad y la importancia de aquello que no siempre podemos ver.',
        status: 'draft',
        createdAt: '2026-10-04',
        updatedAt: '2026-10-04',
    },
];

export function DraftsPage() {
    return (
        <div className="container py-4">
            <div className="mb-4">
                <h2 className="h4 fw-semibold mb-1">Borradores</h2>

                <p className="text-secondary mb-0">
                    Resúmenes generados a partir de tus notas.
                </p>
            </div>

            <div className="d-flex flex-column gap-3">
                {drafts.map((draft) => (
                    <article
                        key={draft.id}
                        className="card border-0 shadow-sm">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                                <span className="badge text-bg-light">
                                    Borrador
                                </span>

                                <small className="text-secondary">
                                    {draft.updatedAt}
                                </small>
                            </div>

                            <p className="mb-3">{draft.content}</p>

                            <button type="button" className="btn btn-dark">
                                Editar borrador
                            </button>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}