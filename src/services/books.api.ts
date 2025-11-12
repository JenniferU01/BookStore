// src/services/books.api.ts
import { API_URL, API_TIMEOUT } from './config';

export type Book = {
  id: number;
  title: string;
  author: string;
  year: number;
  cover?: string;
  description?: string;
  content?: string;
};

async function http<T>(url: string, init?: RequestInit): Promise<T> {
  const ctl = new AbortController();
  const id = setTimeout(() => ctl.abort(), API_TIMEOUT);

  try {
    const res = await fetch(url, { signal: ctl.signal, ...init });

    if (!res.ok) {
      const txt = await res.text().catch(() => '');
      throw new Error(`HTTP ${res.status} ${res.statusText} - ${txt}`);
    }

    return (await res.json()) as T;
  } finally {
    clearTimeout(id);
  }
}

// LISTAR TODOS
export const fetchBooks = (): Promise<Book[]> =>
  http<Book[]>(`${API_URL}/api/books`);

// DETALLE POR ID
export const fetchBookById = (id: number): Promise<Book> =>
  http<Book>(`${API_URL}/api/books/${id}`);

// ELIMINAR
export const deleteBookById = (id: number): Promise<{ ok: true }> =>
  http<{ ok: true }>(`${API_URL}/api/books/${id}`, { method: 'DELETE' });

// CREAR
export type BookPayload = Omit<Book, 'id'>;

export const createBook = (data: BookPayload): Promise<Book> =>
  http<Book>(`${API_URL}/api/books`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

// ACTUALIZAR
export const updateBook = (id: number, data: BookPayload): Promise<Book> =>
  http<Book>(`${API_URL}/api/books/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
