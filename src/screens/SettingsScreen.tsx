// src/screens/SettingsScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SettingsScreen() {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>BookStore</Text>
      <Text style={styles.subtitle}>Proyecto de Desarrollo de Aplicaciones Web</Text>
      <Text style={styles.label}>Alumna:</Text>
      <Text style={styles.text}>Jennifer Uribe</Text>

      <Text style={styles.label}>Descripción:</Text>
      <Text style={styles.text}>
        Aplicación móvil conectada a una API REST para gestionar una biblioteca de libros:
        permite crear, editar, eliminar, marcar favoritos y leer el contenido.
      </Text>

      <Text style={styles.label}>Versión:</Text>
      <Text style={styles.text}>1.0.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f6fa',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#636e72',
    marginBottom: 16,
  },
  label: {
    marginTop: 10,
    fontWeight: '600',
  },
  text: {
    fontSize: 14,
    marginTop: 4,
  },
});
