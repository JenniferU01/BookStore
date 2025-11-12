// src/screens/BookReaderScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../navigation/types';
import { fetchBookById, type Book } from '../services/books.api';

type Props = NativeStackScreenProps<RootStackParamList, 'BookReader'>;

export default function BookReaderScreen({ route, navigation }: Props) {
  const { id, title } = route.params;
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const b = await fetchBookById(id);
        setBook(b);
        navigation.setOptions({ title: b.title || title || 'Lectura' });
      } catch {
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigation, title]);

  if (loading || !book) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const content =
    book.content ||
    book.description ||
    'Este libro aún no tiene contenido detallado.';

  return (
    <View style={[styles.container, dark && styles.containerDark]}>
      <View style={styles.tools}>
        <Text style={[styles.title, dark && styles.textDark]}>
          {book.title}
        </Text>
        <Text style={[styles.author, dark && styles.textDark]}>
          {book.author} • {book.year}
        </Text>

        <TouchableOpacity
          onPress={() => setDark(!dark)}
          style={styles.modeBtn}
        >
          <Text style={styles.modeTxt}>
            {dark ? 'Modo claro' : 'Modo oscuro'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.reader}>
        <Text style={[styles.content, dark && styles.contentDark]}>
          {content}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  containerDark: {
    backgroundColor: '#111827',
  },
  tools: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderColor: '#dcdde1',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2d3436',
  },
  author: {
    fontSize: 13,
    color: '#636e72',
    marginTop: 2,
  },
  textDark: {
    color: '#f5f5f5',
  },
  modeBtn: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#6c5ce7',
  },
  modeTxt: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  reader: {
    padding: 16,
    paddingBottom: 32,
  },
  content: {
    fontSize: 15,
    lineHeight: 24,
    color: '#2f3640',
    textAlign: 'justify',
  },
  contentDark: {
    color: '#f5f5f5',
  },
});
