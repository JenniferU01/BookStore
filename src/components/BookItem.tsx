// src/components/BookItem.tsx
import React from 'react';
import { Pressable, StyleSheet, Text, View, Image } from 'react-native';
import type { Book } from '../services/books.api';

type Props = {
  book: Book;
  onPress?: () => void;
};

export default function BookItem({ book, onPress }: Props) {
  const uri = book.cover || 'https://placehold.co/200x300?text=Book';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.row}>
        <Image source={{ uri }} style={styles.cover} />
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={2}>
            {book.title}
          </Text>
          <Text style={styles.meta} numberOfLines={1}>
            {book.author} • {book.year}
          </Text>
          {!!book.description && (
            <Text style={styles.desc} numberOfLines={2}>
              {book.description}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 12,
    padding: 10,
    elevation: 4,
  },
  pressed: {
    opacity: 0.7,
  },
  row: {
    flexDirection: 'row',
  },
  cover: {
    width: 60,
    height: 90,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: '#eee',
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontWeight: '600',
    fontSize: 16,
  },
  meta: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  desc: {
    fontSize: 12,
    color: '#444',
    marginTop: 4,
  },
});
