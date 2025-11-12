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
import { createBook, fetchBookById, updateBook, type Book } from '../services/books.api';

type Props = NativeStackScreenProps<RootStackParamList, 'BookForm'>;

type FormValues = {
  title: string;
  author: string;
  year: string;
  cover: string;
  description: string;
};

export default function BookFormScreen({ route, navigation }: Props) {
  const id = route.params?.id;
  const [values, setValues] = useState<FormValues>({
    title: '',
    author: '',
    year: '',
    cover: '',
    description: '',
  });

  useEffect(() => {
    if (!id) {
      navigation.setOptions({ title: 'Nuevo libro' });
      return;
    }

    navigation.setOptions({ title: 'Editar libro' });
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
      } catch {
        Alert.alert('Error', 'No se pudo cargar el libro.');
      }
    })();
  }, [id, navigation]);

  const onSave = async () => {
    const payload: Omit<Book, 'id'> = {
      title: values.title.trim(),
      author: values.author.trim(),
      year: Number(values.year) || new Date().getFullYear(),
      cover: values.cover.trim() || undefined,
      description: values.description.trim() || undefined,
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
    <ScrollView contentContainerStyle={s.wrap}>
      <Input
        label="Título"
        value={values.title}
        onChangeText={(text) => setValues((v) => ({ ...v, title: text }))}
      />
      <Input
        label="Autor"
        value={values.author}
        onChangeText={(text) => setValues((v) => ({ ...v, author: text }))}
      />
      <Input
        label="Año"
        keyboardType="numeric"
        value={values.year}
        onChangeText={(text) => setValues((v) => ({ ...v, year: text }))}
      />
      <Input
        label="Portada (URL)"
        value={values.cover}
        onChangeText={(text) => setValues((v) => ({ ...v, cover: text }))}
      />
      <Input
        label="Descripción"
        value={values.description}
        onChangeText={(text) => setValues((v) => ({ ...v, description: text }))}
        multiline
      />

      <TouchableOpacity style={s.btn} onPress={onSave}>
        <Text style={s.btnTxt}>Guardar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

type InputProps = {
  label: string;
  value: string;
  onChangeText: (txt: string) => void;
  keyboardType?: 'default' | 'numeric';
  multiline?: boolean;
};

function Input({ label, ...rest }: InputProps) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={s.label}>{label}</Text>
      <TextInput {...rest} style={[s.input, rest.multiline && s.inputMultiline]} />
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { padding: 16 },
  label: { marginBottom: 6, color: '#555' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  btn: {
    marginTop: 16,
    backgroundColor: '#6c5ce7',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnTxt: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
