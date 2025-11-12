// src/components/BookCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import type { Book } from '../navigation/types';

type Props = { item: Book; onPress: () => void; };

export default function BookCard({ item, onPress }: Props) {
  const uri = item.cover || 'https://placehold.co/600x900?text=No+Cover';
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={styles.wrap}>
      <LinearGradient colors={['#101828', '#475467']} style={styles.card} start={{x:0,y:0}} end={{x:1,y:1}}>
        <Image source={{ uri }} style={styles.cover} contentFit="cover" transition={120}/>
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.meta} numberOfLines={1}>{item.author} • {item.year}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrap: { marginHorizontal: 14, marginVertical: 8 },
  card: { borderRadius: 16, overflow: 'hidden', height: 120, flexDirection: 'row', elevation: 3 },
  cover: { width: 90, height: '100%' },
  info: { flex: 1, padding: 12, justifyContent: 'center' },
  title: { color: 'white', fontSize: 18, fontWeight: '700' },
  meta: { color: '#E5E7EB', marginTop: 4 }
});
