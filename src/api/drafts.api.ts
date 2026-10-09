
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

export async function updateDraft(
    draftId: number,
    content: string,
): Promise<Draft> {
    const response = await fetch(`${API_URL}/drafts/${draftId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
    });

    if (!response.ok) {
        throw new Error('No se pudo guardar el borrador');
    }

    return response.json();
}


export async function getDraftsByBookId(
    bookId: number,
): Promise<Draft[]> {
    const response = await fetch(
        `${API_URL}/drafts/book/${bookId}`,
    );

    if (!response.ok) {
        throw new Error('No se pudieron obtener los borradores');
    }

    return response.json();
}

