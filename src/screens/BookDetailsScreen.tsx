// src/screens/BookDetailsScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, Share, TouchableOpacity, Image } from 'react-native';
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
    (async () => {
      try {
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
    })();
  }, [id]);

  const onDelete = async () => {
    Alert.alert('Eliminar', '¿Deseas eliminar este libro?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: async () => {
        await deleteBookById(id);
        Alert.alert('Listo', 'El libro se eliminó.');
        navigation.goBack();
      }},
    ]);
  };

  const onShare = async () => {
    if (!book) return;
    try {
      await Share.share({
        title: book.title,
        message: `${book.title} — ${book.author} (${book.year})${book.description ? '\n\n' + book.description : ''}`,
      });
    } catch {
      Alert.alert('Error', 'No se pudo compartir.');
    }
  };

  if (loading || !book) {
    return <View style={styles.center}><ActivityIndicator /></View>;
  }

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      {book.cover ? <Image source={{ uri: book.cover }} style={styles.cover} /> : null}
      <Text style={styles.title}>{book.title}</Text>
      <Text style={styles.meta}>{book.author} • {book.year}</Text>
      {!!book.description && <Text style={styles.desc}>{book.description}</Text>}

      <View style={styles.row}>
        <TouchableOpacity style={[styles.btn, { backgroundColor: fav ? '#ff7675' : '#6c5ce7' }]}
          onPress={async () => setFav(await toggleFav(book.id))}>
          <Text style={styles.btnTxt}>{fav ? '★ Quitar favorito' : '☆ Agregar a favoritos'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <TouchableOpacity style={[styles.btn, styles.btnOutline]} onPress={onShare}>
          <Text style={[styles.btnTxt, { color: '#6c5ce7' }]}>Compartir</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, { backgroundColor: '#d63031' }]} onPress={onDelete}>
          <Text style={styles.btnTxt}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center' },
  wrap: { padding: 16 },
  cover: { width: '100%', height: 260, borderRadius: 16, backgroundColor: '#eee', marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '700' },
  meta: { color: '#666', marginTop: 6, marginBottom: 12 },
  desc: { marginTop: 8, lineHeight: 20 },
  row: { flexDirection: 'row', gap: 12, marginTop: 14 },
  btn: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  btnOutline: { borderWidth: 2, borderColor: '#6c5ce7', backgroundColor: 'transparent' },
  btnTxt: { color: '#fff', fontWeight: '600' },
});
