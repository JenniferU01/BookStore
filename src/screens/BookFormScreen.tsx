// src/screens/BookFormScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../navigation/types';
import {
  createBook,
  fetchBookById,
  updateBook,
  type Book,
} from '../services/books.api';

type Props = NativeStackScreenProps<RootStackParamList, 'BookForm'>;

type FormValues = {
  title: string;
  author: string;
  year: string;
  cover?: string;
  description?: string;
};

export default function BookFormScreen({ route, navigation }: Props) {
  const id = route.params?.id;
  const [values, setValues] = useState<FormValues>({
    title: '',
    author: '',
    year: new Date().getFullYear().toString(),
    cover: '',
    description: '',
  });

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const b = await fetchBookById(id);
        setValues({
          title: b.title,
          author: b.author,
          year: String(b.year),
          cover: b.cover ?? '',
          description: b.description ?? '',
        });
      } catch (e: any) {
        Alert.alert('Error', e?.message ?? 'No se pudo cargar el libro.');
        navigation.goBack();
      }
    })();
  }, [id, navigation]);

  const onChange =
    (key: keyof FormValues) =>
    (text: string) =>
      setValues((v) => ({ ...v, [key]: text }));

  const onSave = async () => {
    const payload: Omit<Book, 'id'> = {
      title: values.title.trim(),
      author: values.author.trim(),
      year: Number(values.year) || new Date().getFullYear(),
      cover: values.cover?.trim() || undefined,
      description: values.description?.trim() || undefined,
      content: undefined,
    };

    if (!payload.title || !payload.author) {
      Alert.alert('Faltan datos', 'Título y autor son obligatorios.');
      return;
    }

    try {
      if (id) await updateBook(id, payload);
      else await createBook(payload);

      Alert.alert('Listo', 'Libro guardado correctamente.');
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'No se pudo guardar.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <Input
        label="Título"
        value={values.title}
        onChangeText={onChange('title')}
      />
      <Input
        label="Autor"
        value={values.author}
        onChangeText={onChange('author')}
      />
      <Input
        label="Año"
        keyboardType="numeric"
        value={values.year}
        onChangeText={onChange('year')}
      />
      <Input
        label="Portada (URL)"
        value={values.cover}
        onChangeText={onChange('cover')}
      />
      <Input
        label="Descripción"
        value={values.description}
        onChangeText={onChange('description')}
        multiline
      />

      <TouchableOpacity style={styles.btn} onPress={onSave}>
        <Text style={styles.btnTxt}>Guardar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

type InputProps = React.ComponentProps<typeof TextInput> & {
  label: string;
};

function Input({ label, ...rest }: InputProps) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} {...rest} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    padding: 16,
    paddingBottom: 32,
  },
  label: {
    marginBottom: 6,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  btn: {
    marginTop: 16,
    backgroundColor: '#6c5ce7',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  btnTxt: {
    color: '#fff',
    fontWeight: '600',
  },
});
