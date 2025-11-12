// src/screens/FavoritesScreen.tsx
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, View } from 'react-native';
import { fetchBooks, type Book } from '../services/books.api';
import { getFavIds } from '../services/favs.store';
import BookItem from '../components/BookItem';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Tabs'>;

export default function FavoritesScreen({ navigation }: Props) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Book[]>([]);

  useEffect(() => {
    const load = navigation.addListener('focus', async () => {
      setLoading(true);
      const [all, favs] = await Promise.all([fetchBooks(), getFavIds()]);
      setData(all.filter(b => favs.includes(b.id)));
      setLoading(false);
    });
    return load;
  }, [navigation]);

  if (loading) return <View style={{ flex: 1, justifyContent: 'center' }}><ActivityIndicator /></View>;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={data}
        keyExtractor={(b) => String(b.id)}
        renderItem={({ item }) => (
          <BookItem
            book={item}
            onPress={() => navigation.navigate('BookDetails', { id: item.id, title: item.title })}
          />
        )}
        contentContainerStyle={{ paddingVertical: 8 }}
      />
    </SafeAreaView>
  );
}
