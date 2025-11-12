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
  type BookPayload,
} from '../services/books.api';

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
      }
    })();
  }, [id]);

  const onChange = (field: keyof FormValues, value: string) => {
    setValues(v => ({ ...v, [field]: value }));
  };

  const onSave = async () => {
    const payload: BookPayload = {
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
      Alert.alert('Error', e?.message ?? 'No se pudo guardar');
    }
  };

  return (
    <ScrollView contentContainerStyle={s.wrap}>
      <Input
        label="Título"
        value={values.title}
        onChangeText={t => onChange('title', t)}
      />
      <Input
        label="Autor"
        value={values.author}
        onChangeText={t => onChange('author', t)}
      />
      <Input
        label="Año"
        keyboardType="numeric"
        value={values.year}
        onChangeText={t => onChange('year', t)}
      />
      <Input
        label="Portada (URL)"
        value={values.cover}
        onChangeText={t => onChange('cover', t)}
      />
      <Input
        label="Descripción"
        multiline
        value={values.description}
        onChangeText={t => onChange('description', t)}
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
  onChangeText: (text: string) => void;
  keyboardType?: 'default' | 'numeric';
  multiline?: boolean;
};

function Input({ label, ...rest }: InputProps) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={s.label}>{label}</Text>
      <TextInput style={s.input} {...rest} />
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    padding: 16,
  },
  label: {
    marginBottom: 6,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  btn: {
    marginTop: 16,
    backgroundColor: '#6c5ce7',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnTxt: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
