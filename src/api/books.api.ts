import type { Book } from '../types/Book';

const API_URL = 'http://localhost:3000';

export async function getBooks(): Promise<Book[]> {
  const response = await fetch(`${API_URL}/books`);

  if (!response.ok) {
    throw new Error('No se pudieron obtener los libros');
  }

  return response.json();
}
export interface CreateBookData {
  title: string;
  author: string;
}

export async function createBook(data: CreateBookData): Promise<Book> {
  const response = await fetch(`${API_URL}/books`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('No se pudo crear el libro');
  }

  return response.json();
}
