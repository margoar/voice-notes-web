import type { Note } from '../types/Note';

const API_URL = 'http://localhost:3000';

export async function getNotesByBookId(bookId: number): Promise<Note[]> {
    const response = await fetch(`${API_URL}/notes/book/${bookId}`);

    if (!response.ok) {
        throw new Error('No se pudieron obtener las notas');
    }

    return response.json();
}

interface CreateNoteData {
    bookId: number;
    transcriptionText: string;
    correctedText: string;
}

export async function createNote(
    data: CreateNoteData,
): Promise<Note> {
    const response = await fetch(`${API_URL}/notes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('No se pudo crear la nota');
    }

    return response.json();
}