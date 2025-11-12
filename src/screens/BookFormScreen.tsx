// src/screens/BookFormScreen.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../navigation/types';
import { createBook, updateBook, fetchBookById } from '../services/books.api';

type Props = NativeStackScreenProps<RootStackParamList, 'BookForm'>;

type FormValues = {
  title: string;
  author: string;
  year: string;
  cover: string;
  description: string;
};

export default function BookFormScreen({ route, navigation }: Props) {
  const [values, setValues] = useState<FormValues>({
    title: '',
    author: '',
    year: '',
    cover: '',
    description: '',
  });

  const id = route.params?.id;

  useEffect(() => {
    if (id != null) {
      navigation.setOptions({ title: 'Editar libro' });
      fetchBookById(id)
        .then((book) => {
          setValues({
            title: book.title,
            author: book.author,
            year: String(book.year),
            cover: book.cover ?? '',
            description: book.description ?? '',
          });
        })
        .catch(() => {
          // aquí podrías mostrar un Alert si quieres
        });
    } else {
      navigation.setOptions({ title: 'Nuevo libro' });
    }
  }, [id, navigation]);

  const onSave = async () => {
    const payload = {
      title: values.title.trim(),
      author: values.author.trim(),
      year: Number(values.year) || new Date().getFullYear(),
      cover: values.cover.trim() || undefined,
      description: values.description.trim() || undefined,
    };

    try {
      if (id != null) {
        await updateBook(id, payload);
      } else {
        await createBook(payload);
      }
      navigation.goBack();
    } catch (e) {
      // mostrar alerta si quieres
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <Input
        label="Título"
        value={values.title}
        onChangeText={(text) => setValues((prev) => ({ ...prev, title: text }))}
      />
      <Input
        label="Autor"
        value={values.author}
        onChangeText={(text) => setValues((prev) => ({ ...prev, author: text }))}
      />
      <Input
        label="Año"
        keyboardType="numeric"
        value={values.year}
        onChangeText={(text) => setValues((prev) => ({ ...prev, year: text }))}
      />
      <Input
        label="Portada (URL)"
        value={values.cover}
        onChangeText={(text) => setValues((prev) => ({ ...prev, cover: text }))}
      />
      <Input
        label="Descripción"
        value={values.description}
        onChangeText={(text) =>
          setValues((prev) => ({ ...prev, description: text }))
        }
        multiline
      />

      <TouchableOpacity style={styles.btn} onPress={onSave}>
        <Text style={styles.btnTxt}>Guardar</Text>
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

function Input({
  label,
  value,
  onChangeText,
  keyboardType = 'default',
  multiline,
}: InputProps) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.inputMultiline]}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        multiline={multiline}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
