// src/components/BookItem.tsx
import React from 'react';
import { Pressable, StyleSheet, Text, View, Image } from 'react-native';
import type { Book } from '../services/books.api';

type Props = { book: Book; onPress?: () => void; };

export default function BookItem({ book, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.row}>
        {book.cover ? <Image source={{ uri: book.cover }} style={styles.cover} /> : null}
        <View style={styles.info}>
          <Text style={styles.title}>{book.title}</Text>
          <Text style={styles.meta}>{book.author} • {book.year}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 12, marginHorizontal: 12, marginVertical: 8, elevation: 3 },
  pressed: { opacity: 0.8 },
  row: { flexDirection: 'row', alignItems: 'center' },
  cover: { width: 56, height: 80, borderRadius: 8, marginRight: 12, backgroundColor: '#eee' },
  info: { flex: 1 },
  title: { fontSize: 18, fontWeight: '600' },
  meta: { marginTop: 4, color: '#666' },
});
