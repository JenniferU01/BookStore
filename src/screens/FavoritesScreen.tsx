// src/screens/FavoritesScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { fetchBooks, type Book } from '../services/books.api';
import { getFavIds } from '../services/favs.store';
import BookItem from '../components/BookItem';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function FavoritesScreen() {
  const navigation = useNavigation<Nav>();
  const [data, setData] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const [books, favs] = await Promise.all([fetchBooks(), getFavIds()]);
      setData((books as Book[]).filter((b: Book) => favs.includes(b.id)));
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const unsub = navigation.addListener('focus', load);
    return unsub;
  }, [navigation]);

  if (loading && !data.length) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!data.length) {
    return (
      <View style={s.center}>
        <Text>No tienes libros favoritos aún.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={b => String(b.id)}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={load} />
      }
      contentContainerStyle={{ padding: 12, paddingBottom: 24 }}
      renderItem={({ item }) => (
        <BookItem
          book={item}
          onPress={() =>
            navigation.navigate('BookDetails', {
              id: item.id,
              title: item.title,
            })
          }
        />
      )}
    />
  );
}

const s = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
