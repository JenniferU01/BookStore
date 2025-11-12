// src/screens/SettingsScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SettingsScreen() {
  return (
    <View style={s.wrap}>
      <Text style={s.title}>Ajustes</Text>
      <Text style={s.text}>
        Aquí podrías agregar información de la app, versión, tema, datos del alumno, etc.
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, padding: 16, gap: 8 },
  title: { fontSize: 22, fontWeight: '700' },
  text: { fontSize: 15, color: '#555' },
});
s