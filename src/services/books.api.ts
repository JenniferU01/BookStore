// src/services/books.api.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './config';

export type Book = {
  id: number;
  title: string;
  author: string;
  year: number;
  description?: string;
  content?: string;
  cover?: string;
};

async function retryFetch(url: string, options?: any) {
  for (let i = 0; i < 2; i++) {
    try {
      const res = await fetch(url, options);
      if (!res.ok) throw new Error('Error en la API');
      return await res.json();
    } catch (e) {
      if (i === 1) throw e;
    }
  }
}

export async function fetchBooks(): Promise<Book[]> {
  try {
    const data = await retryFetch(`${API_URL}/api/books`);
    await AsyncStorage.setItem('books_cache', JSON.stringify(data));
    return data;
  } catch {
    const cache = await AsyncStorage.getItem('books_cache');
    return cache ? JSON.parse(cache) : [];
  }
}

export async function fetchBookById(id: number): Promise<Book> {
  return retryFetch(`${API_URL}/api/books/${id}`);
}

export async function createBook(book: Partial<Book>) {
  return retryFetch(`${API_URL}/api/books`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(book),
  });
}

export async function updateBook(id: number, book: Partial<Book>) {
  return retryFetch(`${API_URL}/api/books/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(book),
  });
}

export async function deleteBookById(id: number) {
  return retryFetch(`${API_URL}/api/books/${id}`, {
    method: 'DELETE',
  });
}
