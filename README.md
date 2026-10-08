# Voice Notes Web

Frontend de **Voice Notes**, una app para registrar notas de voz sobre libros y generar borradores de texto a partir de ellas.

Permite grabar una nota desde el micrófono, transcribirla **directamente en el navegador** con Whisper, corregir el texto y guardarlo asociado a un libro. Luego, desde el detalle del libro, se puede pedir a la API un borrador generado con IA a partir de todas sus notas.

Se comunica con [voice-notes-api](../voice-notes-api).

## Stack

- [React 19](https://react.dev) + TypeScript
- [Vite](https://vite.dev)
- [React Router 7](https://reactrouter.com)
- [Bootstrap 5](https://getbootstrap.com) y Bootstrap Icons
- [Transformers.js](https://huggingface.co/docs/transformers.js) (`@huggingface/transformers`) con el modelo `onnx-community/whisper-base` para speech-to-text

## Estructura

```
src/
├── app/            # App y definición de rutas
├── layouts/        # MainLayout (header + navegación inferior)
├── pages/          # Una carpeta por sección
│   ├── Dashboard/
│   ├── Books/      # Listado y detalle de libro
│   ├── Notes/      # Listado y creación de notas
│   └── Drafts/
├── api/            # Llamadas HTTP a la API (books, notes, drafts)
├── services/       # speechToText.service.ts (transcripción con Whisper)
├── types/          # Tipos Book, Note, Draft
└── styles/
```

## Rutas

| Ruta                       | Página            | Estado                         |
|----------------------------|-------------------|--------------------------------|
| `/`                        | Dashboard         | Datos de ejemplo (estáticos)   |
| `/books`                   | Mis libros        | Conectada a la API             |
| `/books/:bookId`           | Detalle del libro | Conectada a la API             |
| `/books/:bookId/notes/new` | Nueva nota        | Conectada a la API             |
| `/notes`                   | Mis notas         | Datos de ejemplo (estáticos)   |
| `/drafts`                  | Borradores        | Datos de ejemplo (estáticos)   |

## Flujo principal

1. **Elegir un libro** en `/books`. Se muestra su detalle con las notas existentes.
2. **Grabar una nota** con "Nueva nota". El audio se captura con `MediaRecorder` (formato `webm/opus` cuando el navegador lo soporta) y se puede reproducir antes de continuar.
3. **Transcribir**. El audio se procesa localmente con Whisper vía Transformers.js, en español. El audio no se envía a ningún servidor. La primera vez se descarga el modelo, por lo que tarda más; luego queda cargado en memoria mientras la página esté abierta.
4. **Corregir y guardar**. La transcripción aparece en un campo editable. Al guardar se envían a la API tanto el texto original (`transcriptionText`) como el corregido (`correctedText`).
5. **Generar resumen**. En el detalle del libro, el botón "Generar resumen" llama a `POST /drafts/book/:bookId/generate` y muestra el borrador devuelto.

## Requisitos

- Node.js 20 o superior
- La API corriendo en `http://localhost:3000` (ver su README)
- Un navegador con soporte para `MediaRecorder` y permiso de acceso al micrófono

## Puesta en marcha

```bash
npm install
npm run dev
```

La app queda disponible en la URL que indique Vite (por defecto `http://localhost:5173`).

> La URL de la API está fija como `http://localhost:3000` en cada archivo de [src/api/](src/api/). Si la API corre en otra dirección, hay que cambiarla ahí.

## Scripts

| Script            | Descripción                              |
|-------------------|------------------------------------------|
| `npm run dev`     | Servidor de desarrollo                   |
| `npm run build`   | Chequeo de tipos y build de producción   |
| `npm run preview` | Sirve el build localmente                |
| `npm run lint`    | Oxlint                                   |

## Estado actual

El proyecto está en desarrollo:

- Dashboard, Mis notas y Borradores todavía muestran datos de ejemplo, no datos reales.
- Los botones "Nuevo" libro, menú y opciones de libro aún no tienen funcionalidad.
- El borrador generado se muestra en el detalle del libro, pero aún no se puede editar ni consultar después desde la página de Borradores.
- Los tipos `Note` y `Draft` usan `id: string`, mientras que la API devuelve números.
