// src/screens/HomeScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
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
        <Text>No hay libros. Agrega el primero.</Text>
        <TouchableOpacity
          style={s.btn}
          onPress={() => navigation.navigate('BookForm', {})}
        >
          <Text style={s.btnTxt}>Nuevo libro</Text>
        </TouchableOpacity>
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
      ListFooterComponent={
        <TouchableOpacity
          style={[s.btn, { marginTop: 16 }]}
          onPress={() => navigation.navigate('BookForm', {})}
        >
          <Text style={s.btnTxt}>Agregar otro libro</Text>
        </TouchableOpacity>
      }
    />
  );
}

const s = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    backgroundColor: '#6c5ce7',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  btnTxt: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
