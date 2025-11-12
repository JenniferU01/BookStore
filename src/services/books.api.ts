// src/services/books.api.ts
import { API_URL, API_TIMEOUT } from './config';

export type Book = {
  id: number;
  title: string;
  author: string;
  year: number;
  description?: string;
  content?: string;
  cover?: string;
};

async function http<T>(url: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      ...(init || {}),
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => '');
      throw new Error(`HTTP ${res.status} ${res.statusText} - ${txt}`);
    }

    return (await res.json()) as T;
  } finally {
    clearTimeout(id);
  }
}

export const fetchBooks = () =>
  http<Book[]>(`${API_URL}/api/books`);

export const fetchBookById = (id: number) =>
  http<Book>(`${API_URL}/api/books/${id}`);

export const deleteBookById = (id: number) =>
  http<{ ok?: true }>(`${API_URL}/api/books/${id}`, { method: 'DELETE' });

export const createBook = (data: Omit<Book, 'id'>) =>
  http<Book>(`${API_URL}/api/books`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

export const updateBook = (id: number, data: Partial<Omit<Book, 'id'>>) =>
  http<Book>(`${API_URL}/api/books/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
