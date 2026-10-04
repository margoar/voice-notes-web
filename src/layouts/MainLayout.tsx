import { Link, Outlet } from 'react-router-dom';

export function MainLayout() {
    return (
        <div className="min-vh-100 bg-light">
            <header className="bg-white border-bottom">
                <div className="container py-3">
                    <div className="d-flex justify-content-between align-items-center">
                        <Link
                            to="/"
                            className="text-dark text-decoration-none">
                            <h1 className="h5 mb-0 fw-semibold">Voice Notes</h1>
                        </Link>

                        <button
                            type="button"
                            className="btn btn-light"
                            aria-label="Abrir menú">
                            <i className="bi bi-list fs-4"></i>
                        </button>
                    </div>
                </div>
            </header>

            <main className="pb-5">
                <Outlet />
            </main>

            <nav className="fixed-bottom bg-white border-top">
                <div className="container">
                    <div className="d-flex justify-content-around py-2">
                        <Link
                            to="/"
                            className="btn btn-link text-dark text-decoration-none">
                            <i className="bi bi-house-fill d-block text-center"></i>
                            <small>Inicio</small>
                        </Link>

                        <Link
                            to="/books"
                            className="btn btn-link text-secondary text-decoration-none">
                            <i className="bi bi-book d-block text-center"></i>
                            <small>Libros</small>
                        </Link>

                        <Link
                            to="/notes"
                            className="btn btn-link text-secondary text-decoration-none">
                            <i className="bi bi-pencil-square d-block text-center"></i>
                            <small>Notas</small>
                        </Link>

                        <Link
                            to="/drafts"
                            className="btn btn-link text-secondary text-decoration-none">
                            <i className="bi bi-file-text d-block text-center"></i>
                            <small>Borradores</small>
                        </Link>
                    </div>
                </div>
            </nav>
        </div>
    );
}