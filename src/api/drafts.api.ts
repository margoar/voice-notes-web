import type { Draft } from '../types/Draft';

const API_URL = 'http://localhost:3000';

export async function generateDraft(bookId: number): Promise<Draft> {
    const response = await fetch(
        `${API_URL}/drafts/book/${bookId}/generate`,
        {
            method: 'POST',
        },
    );

    if (!response.ok) {
        throw new Error('No se pudo generar el resumen');
    }

    return response.json();
}