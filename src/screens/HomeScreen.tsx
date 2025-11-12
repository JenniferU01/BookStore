// src/screens/HomeScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../navigation/types';
import { fetchBooks, type Book } from '../services/books.api';
import BookItem from '../components/BookItem';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const [data, setData] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const books = await fetchBooks();
      setData(books);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(b) => String(b.id)}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
      contentContainerStyle={{ padding: 12, paddingBottom: 24 }}
      renderItem={({ item }) => (
        <BookItem
          book={item}
          onPress={() => navigation.navigate('BookDetails', { id: item.id, title: item.title })}
        />
      )}
      ListFooterComponent={
        <TouchableOpacity
          style={{
            marginTop: 8,
            backgroundColor: '#6c5ce7',
            paddingVertical: 12,
            borderRadius: 12,
            alignItems: 'center',
          }}
          onPress={() => navigation.navigate('BookForm', {})}
        >
          <Text style={{ color: '#fff', fontWeight: '600' }}>+ Agregar libro</Text>
        </TouchableOpacity>
      }
    />
  );
}
