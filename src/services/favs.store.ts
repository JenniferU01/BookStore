// src/services/favs.store.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@bookstore_favs';

export async function getFavIds(): Promise<number[]> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function toggleFav(id: number): Promise<boolean> {
  const set = new Set(await getFavIds());
  let fav = false;

  if (set.has(id)) {
    set.delete(id);
    fav = false;
  } else {
    set.add(id);
    fav = true;
  }

  await AsyncStorage.setItem(KEY, JSON.stringify([...set]));
  return fav;
}

export async function isFav(id: number) {
  const set = new Set(await getFavIds());
  return set.has(id);
}
