// src/screens/BookReaderScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  useColorScheme,
  TouchableOpacity,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../navigation/types';
import { fetchBookById, type Book } from '../services/books.api';

type Props = NativeStackScreenProps<RootStackParamList, 'BookReader'>;

export default function BookReaderScreen({ route, navigation }: Props) {
  const { id, title } = route.params;
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [fontSize, setFontSize] = useState(16);
  const [dark, setDark] = useState(false);
  const scheme = useColorScheme();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const b = await fetchBookById(id);
        setBook(b);
        navigation.setOptions({ title: b.title || title });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, title, navigation]);

  if (loading || !book) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const isDark = dark || scheme === 'dark';

  const bg = isDark ? '#121212' : '#f5f6fa';
  const textColor = isDark ? '#ecf0f1' : '#2d3436';
  const metaColor = isDark ? '#b2bec3' : '#636e72';

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <View style={styles.toolbar}>
        <TouchableOpacity
          style={styles.toolbarBtn}
          onPress={() => setFontSize((f) => Math.max(12, f - 2))}
        >
          <Text style={styles.toolbarTxt}>A-</Text>
        </TouchableOpacity>
        <Text style={styles.toolbarLabel}>Tamaño: {fontSize}</Text>
        <TouchableOpacity
          style={styles.toolbarBtn}
          onPress={() => setFontSize((f) => Math.min(26, f + 2))}
        >
          <Text style={styles.toolbarTxt}>A+</Text>
        </TouchableOpacity>

        <View style={{ width: 16 }} />

        <TouchableOpacity
          style={[styles.toolbarBtn, isDark && styles.toolbarBtnActive]}
          onPress={() => setDark((d) => !d)}
        >
          <Text style={styles.toolbarTxt}>{isDark ? '☾' : '☀'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.contentWrap}>
        <Text style={[styles.title, { color: textColor }]}>{book.title}</Text>
        <Text style={[styles.meta, { color: metaColor }]}>
          {book.author} • {book.year}
        </Text>

        <Text
          style={[
            styles.text,
            { fontSize, color: textColor },
          ]}
        >
          {book.content || 'Este libro todavía no tiene contenido de lectura.'}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#dfe6e9',
  },
  toolbarBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#b2bec3',
  },
  toolbarBtnActive: {
    backgroundColor: '#6c5ce7',
    borderColor: '#6c5ce7',
  },
  toolbarTxt: { fontSize: 14, fontWeight: '600', color: '#2d3436' },
  toolbarLabel: { marginHorizontal: 8, fontSize: 13, color: '#636e72' },
  contentWrap: { padding: 16, paddingBottom: 32 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 4 },
  meta: { fontSize: 14, marginBottom: 16 },
  text: { lineHeight: 24, textAlign: 'justify' },
});
