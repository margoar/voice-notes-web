export function DashboardPage() {
  return (
    <div className="min-vh-100 bg-light">
      {/* Header */}
      <header className="bg-white border-bottom">
        <div className="container py-3">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="h5 mb-0 fw-semibold">Voice Notes</h1>

            <button
              type="button"
              className="btn btn-light"
              aria-label="Abrir menú"
            >
              <i className="bi bi-list fs-4"></i>
            </button>
          </div>
        </div>
      </header>

      {/* Contenido */}
      <main className="container py-4 pb-5">
        <section className="mb-4">
          <h2 className="h4 fw-semibold mb-1">Hola, Marcee 👋</h2>
          <p className="text-secondary mb-0">
            Continúa con tus notas y libros.
          </p>
        </section>

        {/* Libros */}
        <section>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="h5 fw-semibold mb-0">Mis libros</h2>

            <button type="button" className="btn btn-link text-decoration-none">
              Ver todos
            </button>
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

        {/* Acción principal */}
        <section className="mt-4">
          <button
            type="button"
            className="btn btn-dark w-100 py-3"
          >
            <i className="bi bi-mic-fill me-2"></i>
            Nueva nota
          </button>
        </section>
      </main>

      {/* Navegación móvil */}
      <nav className="fixed-bottom bg-white border-top">
        <div className="container">
          <div className="d-flex justify-content-around py-2">
            <button type="button" className="btn btn-link text-dark text-decoration-none">
              <i className="bi bi-house-fill d-block text-center"></i>
              <small>Inicio</small>
            </button>

            <button type="button" className="btn btn-link text-secondary text-decoration-none">
              <i className="bi bi-book d-block text-center"></i>
              <small>Libros</small>
            </button>

            <button type="button" className="btn btn-link text-secondary text-decoration-none">
              <i className="bi bi-pencil-square d-block text-center"></i>
              <small>Notas</small>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}