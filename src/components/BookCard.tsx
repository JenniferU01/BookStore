// src/components/BookCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { Book } from '../services/books.api';

type Props = {
  item: Book;
  onPress: () => void;
};

export default function BookCard({ item, onPress }: Props) {
  const uri = item.cover || 'https://placehold.co/600x900?text=No+Cover';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={styles.wrap}
    >
      <LinearGradient
        colors={['#101828', '#475467']}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Image source={{ uri }} style={styles.cover} />
        <View style={styles.texts}>
          <Text numberOfLines={1} style={styles.title}>
            {item.title}
          </Text>
          <Text numberOfLines={1} style={styles.meta}>
            {item.author} • {item.year}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: 170,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  card: {
    flex: 1,
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 4,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  cover: {
    width: 100,
    height: 140,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: '#eee',
  },
  texts: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '700',
    marginBottom: 4,
  },
  meta: {
    fontSize: 13,
    color: '#d0d4ff',
  },
});
