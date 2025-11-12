// src/screens/BookDetailsScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Share,
  TouchableOpacity,
  Image,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../navigation/types';
import { fetchBookById, deleteBookById, type Book } from '../services/books.api';
import { isFav, toggleFav } from '../services/favs.store';

type Props = NativeStackScreenProps<RootStackParamList, 'BookDetails'>;

export default function BookDetailsScreen({ route, navigation }: Props) {
  const { id, title } = route.params;
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [fav, setFav] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const b = await fetchBookById(id);
        setBook(b);
        navigation.setOptions({ title: b.title || title || 'Detalle' });
        setFav(await isFav(id));
      } catch {
        Alert.alert('Error', 'No fue posible cargar el detalle.');
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, title, navigation]);

  const onDelete = async () => {
    Alert.alert('Eliminar', '¿Deseas eliminar este libro?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteBookById(id);
            Alert.alert('Listo', 'El libro se eliminó.');
            navigation.goBack();
          } catch {
            Alert.alert('Error', 'No se pudo eliminar.');
          }
        },
      },
    ]);
  };

  const onShare = async () => {
    try {
      if (!book) return;

      const message = `${book.title} – ${book.author} (${book.year})${
        book.description ? '\n\n' + book.description : ''
      }`;

      await Share.share({ message });
    } catch {
      Alert.alert('Error', 'No se pudo compartir.');
    }
  };

  if (loading || !book) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <Image
        source={{ uri: book.cover || 'https://placehold.co/600x900?text=No+Cover' }}
        style={styles.cover}
        resizeMode="cover"
      />

      <Text style={styles.title}>{book.title}</Text>
      <Text style={styles.meta}>
        {book.author} • {book.year}
      </Text>

      {!!book.description && <Text style={styles.desc}>{book.description}</Text>}

      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: fav ? '#fd79a8' : '#6c5ce7' }]}
          onPress={async () => setFav(await toggleFav(book.id))}
        >
          <Text style={styles.btnTxt}>
            {fav ? '★ Quitar favorito' : '☆ Agregar a favoritos'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: '#2ecc71' }]}
          onPress={() => navigation.navigate('BookForm', { id: book.id })}
        >
          <Text style={styles.btnTxt}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, { backgroundColor: '#34495e' }]}
          onPress={onShare}
        >
          <Text style={styles.btnTxt}>Compartir</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
        <Text style={styles.deleteTxt}>Eliminar libro</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 16, paddingBottom: 32 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  cover: { width: '100%', height: 260, borderRadius: 16, marginBottom: 16, backgroundColor: '#eee' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 4 },
  meta: { fontSize: 14, color: '#666', marginBottom: 12 },
  desc: { fontSize: 15, lineHeight: 22, marginBottom: 24 },
  row: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  btn: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  btnTxt: { color: '#fff', fontWeight: '600' },
  deleteBtn: {
    marginTop: 8,
    backgroundColor: '#ffe6e6',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  deleteTxt: { color: '#d63031', fontWeight: '600' },
});
