import { Link } from 'react-router-dom';

export function DashboardPage() {
    return (
        <div className="container py-4">
            <section className="mb-4">
                <h2 className="h4 fw-semibold mb-1">
                    Hola, Marcee 👋
                </h2>

                <p className="text-secondary mb-0">
                    Continúa con tus notas y libros.
                </p>
            </section>

            <section>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h2 className="h5 fw-semibold mb-0">
                        Mis libros
                    </h2>

                    <Link
                        to="/books"
                        className="btn btn-link text-decoration-none"  >
                        Ver todos
                    </Link>
                </div>

                <div className="d-flex flex-column gap-3">
                    <article className="card border-0 shadow-sm">
                        <div className="card-body">
                            <div className="d-flex align-items-start gap-3">
                                <div className="fs-3">📖</div>

                                <div>
                                    <h3 className="h6 fw-semibold mb-1">
                                        El Principito
                                    </h3>

                                    <p className="text-secondary small mb-0">
                                        4 notas
                                    </p>
                                </div>
                            </div>
                        </div>
                    </article>

                    <article className="card border-0 shadow-sm">
                        <div className="card-body">
                            <div className="d-flex align-items-start gap-3">
                                <div className="fs-3">📖</div>

                                <div>
                                    <h3 className="h6 fw-semibold mb-1">
                                        Hábitos Atómicos
                                    </h3>

                                    <p className="text-secondary small mb-0">
                                        7 notas
                                    </p>
                                </div>
                            </div>
                        </div>
                    </article>
                </div>
            </section>

            <section className="mt-4">
                <button
                    type="button"
                    className="btn btn-dark w-100 py-3">
                    <i className="bi bi-mic-fill me-2"></i>
                    Nueva nota
                </button>
            </section>
        </div>
    );
}