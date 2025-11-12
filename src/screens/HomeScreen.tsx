// src/screens/HomeScreen.tsx
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../navigation/types';
import { fetchBooks, type Book } from '../services/books.api';
import BookItem from '../components/BookItem';

type Nav = NativeStackNavigationProp<RootStackParamList>;

type SortOption = 'title' | 'author' | 'year';

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const [data, setData] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('title');

  async function load() {
    setLoading(true);
    try {
      const books = await fetchBooks();
      setData(books);
    } catch (e) {
      console.log('Error cargando libros', e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filteredAndSorted = useMemo(() => {
    const term = search.toLowerCase().trim();
    let filtered = data;

    if (term) {
      filtered = data.filter((b) => {
        return (
          b.title.toLowerCase().includes(term) ||
          b.author.toLowerCase().includes(term) ||
          String(b.year).includes(term)
        );
      });
    }

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'year') {
        return b.year - a.year;
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'author') {
        return a.author.localeCompare(b.author);
      }
      return 0;
    });

    return sorted;
  }, [data, search, sortBy]);

  if (loading && !data.length) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.searchWrap}>
        <TextInput
          placeholder="Buscar por título, autor o año..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      <View style={styles.sortRow}>
        <SortChip
          label="Título"
          active={sortBy === 'title'}
          onPress={() => setSortBy('title')}
        />
        <SortChip
          label="Autor"
          active={sortBy === 'author'}
          onPress={() => setSortBy('author')}
        />
        <SortChip
          label="Año"
          active={sortBy === 'year'}
          onPress={() => setSortBy('year')}
        />
      </View>

      {filteredAndSorted.length === 0 ? (
        <View style={styles.center}>
          <Text>No hay libros que coincidan con la búsqueda.</Text>
        </View>
      ) : (
        <FlatList<Book>
          data={filteredAndSorted}
          keyExtractor={(b) => String(b.id)}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={load} />
          }
          contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
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
          ListFooterComponent={
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => navigation.navigate('BookForm', {})}
            >
              <Text style={styles.addTxt}>+ Agregar libro</Text>
            </TouchableOpacity>
          }
        />
      )}
    </View>
  );
}

type ChipProps = {
  label: string;
  active: boolean;
  onPress: () => void;
};

function SortChip({ label, active, onPress }: ChipProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.chip, active && styles.chipActive]}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  searchWrap: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  sortRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  chipActive: {
    backgroundColor: '#6c5ce7',
    borderColor: '#6c5ce7',
  },
  chipText: {
    fontSize: 13,
    color: '#555',
  },
  chipTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  addBtn: {
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#6c5ce7',
    alignItems: 'center',
  },
  addTxt: { color: '#fff', fontWeight: '600' },
});
