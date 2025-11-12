// src/components/BookCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import type { Book } from '../services/books.api';

type Props = {
  item: Book;
  onPress: () => void;
};

export default function BookCard({ item, onPress }: Props) {
  const cover = item.cover || 'https://placehold.co/300x400?text=Book';
  const summary = item.description || item.content || '';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={styles.card}
    >
      <Image source={{ uri: cover }} style={styles.cover} />

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>

        <Text style={styles.meta} numberOfLines={1}>
          {item.author} • {item.year}
        </Text>

        {!!summary && (
          <Text style={styles.summary} numberOfLines={2}>
            {summary}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  cover: {
    width: 70,
    height: 100,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: '#dfe6e9',
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2d3436',
    marginBottom: 4,
  },
  meta: {
    fontSize: 13,
    color: '#636e72',
    marginBottom: 6,
  },
  summary: {
    fontSize: 13,
    color: '#2f3640',
  },
});
