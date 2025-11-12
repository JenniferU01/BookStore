// src/services/favs.store.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'bookstore:favs';

export async function getFavIds(): Promise<number[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    return [];
  }
}

export async function isFav(id: number): Promise<boolean> {
  const ids = await getFavIds();
  return ids.includes(id);
}

export async function toggleFav(id: number): Promise<boolean> {
  const ids = await getFavIds();
  const exists = ids.includes(id);
  let next: number[];

  if (exists) {
    next = ids.filter((x) => x !== id);
  } else {
    next = [...ids, id];
  }

  await AsyncStorage.setItem(KEY, JSON.stringify(next));
  return !exists;
}
