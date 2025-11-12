// src/services/books.api.ts
import axios from 'axios';
import { API_URL, API_TIMEOUT } from './config';

export type Book = {
  id: number;
  title: string;
  author: string;
  year: number;
  cover?: string;
  description?: string;
  content?: string;   // texto que mostramos en el lector
  category?: string;  // nueva: categoría
};

const client = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
});

// --- CRUD básico ---

export async function fetchBooks(): Promise<Book[]> {
  const res = await client.get<Book[]>('/books');
  return res.data;
}

export async function fetchBookById(id: number): Promise<Book> {
  const res = await client.get<Book>(`/books/${id}`);
  return res.data;
}

export async function createBook(payload: Omit<Book, 'id'>): Promise<Book> {
  const res = await client.post<Book>('/books', payload);
  return res.data;
}

export async function updateBook(
  id: number,
  payload: Omit<Book, 'id'>
): Promise<Book> {
  const res = await client.put<Book>(`/books/${id}`, payload);
  return res.data;
}

export async function deleteBookById(id: number): Promise<void> {
  await client.delete(`/books/${id}`);
}

// --- Biblioteca de ejemplo (libros conocidos) ---

const demoBooks: Omit<Book, 'id'>[] = [
  {
    title: 'Cien años de soledad',
    author: 'Gabriel García Márquez',
    year: 1967,
    category: 'Realismo mágico',
    cover:
      'https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg?auto=compress&cs=tinysrgb&w=800',
    description:
      'La historia de la familia Buendía en el mítico pueblo de Macondo.',
    content:
      'Macondo era entonces una aldea de veinte casas de barro y cañabrava... ' +
      'Este libro es un clásico del realismo mágico latinoamericano y explora memoria, soledad y destino.',
  },
  {
    title: 'El principito',
    author: 'Antoine de Saint-Exupéry',
    year: 1943,
    category: 'Infantil / Filosófico',
    cover:
      'https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?auto=compress&cs=tinysrgb&w=800',
    description:
      'Un pequeño príncipe que viaja de planeta en planeta y descubre lo esencial de la vida.',
    content:
      '“Solo se ve bien con el corazón; lo esencial es invisible a los ojos”. ' +
      'El principito es un cuento poético sobre la amistad, la inocencia y el sentido de la vida.',
  },
  {
    title: '1984',
    author: 'George Orwell',
    year: 1949,
    category: 'Distopía',
    cover:
      'https://images.pexels.com/photos/2619490/pexels-photo-2619490.jpeg?auto=compress&cs=tinysrgb&w=800',
    description:
      'Un régimen totalitario que controla el pensamiento y reescribe la historia.',
    content:
      'En el mundo de 1984, el Gran Hermano lo vigila todo. Winston Smith intenta rebelarse ' +
      'contra un sistema que manipula la verdad y suprime la libertad.',
  },
  {
    title: 'Orgullo y prejuicio',
    author: 'Jane Austen',
    year: 1813,
    category: 'Romance clásico',
    cover:
      'https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg?auto=compress&cs=tinysrgb&w=800',
    description:
      'La historia de Elizabeth Bennet y el señor Darcy, entre malentendidos y orgullo.',
    content:
      'Orgullo y prejuicio narra la vida de la familia Bennet y critica las expectativas sociales ' +
      'del matrimonio en la Inglaterra del siglo XIX.',
  },
  {
    title: 'Don Quijote de la Mancha',
    author: 'Miguel de Cervantes',
    year: 1605,
    category: 'Clásico',
    cover:
      'https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg?auto=compress&cs=tinysrgb&w=800',
    description:
      'Un hidalgo que enloquece de tanto leer libros de caballería y sale a “desfacer entuertos”.',
    content:
      'En un lugar de la Mancha, de cuyo nombre no quiero acordarme... ' +
      'Don Quijote y Sancho Panza viven aventuras que mezclan locura, idealismo y crítica social.',
  },
];

// Inserta los libros de ejemplo solo si no existen
export async function seedDemoBooks(): Promise<void> {
  const existing = await fetchBooks();
  const existingTitles = new Set(
    existing.map((b) => b.title.trim().toLowerCase())
  );

  for (const book of demoBooks) {
    if (!existingTitles.has(book.title.trim().toLowerCase())) {
      await createBook(book);
    }
  }
}
