// src/screens/SettingsScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { fetchBooks, seedDemoBooks, type Book } from '../services/books.api';
import { getFavIds } from '../services/favs.store';

// Estadísticas que mostramos
type Stats = {
  total: number;
  favorites: number;
  percentFav: number;
  minYear: number | null;
  maxYear: number | null;
  categories: string[];
};

export default function SettingsScreen() {
  const [stats, setStats] = useState<Stats>({
    total: 0,
    favorites: 0,
    percentFav: 0,
    minYear: null,
    maxYear: null,
    categories: [],
  });
  const [loading, setLoading] = useState(false);

  const loadStats = async () => {
    try {
      setLoading(true);
      const [books, favIds] = await Promise.all([
        fetchBooks(),
        getFavIds(),
      ]);

      if (!books.length) {
        setStats({
          total: 0,
          favorites: 0,
          percentFav: 0,
          minYear: null,
          maxYear: null,
          categories: [],
        });
        return;
      }

      const total = books.length;
      const favorites = books.filter((b) => favIds.includes(b.id)).length;
      const percentFav = Math.round((favorites / total) * 100);

      const years = books
        .map((b) => b.year)
        .filter((y) => typeof y === 'number') as number[];
      const minYear = years.length ? Math.min(...years) : null;
      const maxYear = years.length ? Math.max(...years) : null;

      const categoriesSet = new Set<string>();
      books.forEach((b) => {
        if (b.category) categoriesSet.add(b.category);
      });

      setStats({
        total,
        favorites,
        percentFav,
        minYear,
        maxYear,
        categories: Array.from(categoriesSet),
      });
    } catch (e) {
      console.log('Error cargando estadísticas', e);
      Alert.alert('Error', 'No se pudieron cargar las estadísticas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleSeedDemo = async () => {
    try {
      setLoading(true);
      await seedDemoBooks();
      await loadStats();
      Alert.alert('Listo', 'Se cargó la biblioteca de ejemplo.');
    } catch (e) {
      console.log('Error cargando biblioteca demo', e);
      Alert.alert(
        'Error',
        'No se pudo cargar la biblioteca de ejemplo. Revisa la conexión con la API.'
      );
    } finally {
      setLoading(false);
    }
  };

  const hasBooks = stats.total > 0;

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <Text style={styles.title}>Estadísticas de tu biblioteca</Text>

      {/* Tarjeta principal */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Resumen general</Text>
        <Text style={styles.bigNumber}>{stats.total}</Text>
        <Text style={styles.cardText}>
          Libros registrados
        </Text>
        {!hasBooks && (
          <Text style={styles.cardSub}>
            Aún no hay libros en tu biblioteca.
          </Text>
        )}
      </View>

      {/* Fila de tarjetas pequeñas */}
      <View style={styles.row}>
        <View style={[styles.card, styles.smallCard]}>
          <Text style={styles.cardTitle}>Favoritos</Text>
          <Text style={styles.bigNumber}>{stats.favorites}</Text>
          <Text style={styles.cardText}>
            {hasBooks ? `${stats.percentFav}% de tu biblioteca` : 'Sin datos'}
          </Text>
        </View>

        <View style={[styles.card, styles.smallCard]}>
          <Text style={styles.cardTitle}>Años</Text>
          <Text style={styles.bigNumber}>
            {stats.minYear && stats.maxYear
              ? `${stats.minYear} - ${stats.maxYear}`
              : '—'}
          </Text>
          <Text style={styles.cardText}>
            {hasBooks ? 'Rango de publicación' : 'Sin datos de años'}
          </Text>
        </View>
      </View>

      {/* Categorías */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Categorías</Text>
        {stats.categories.length ? (
          <Text style={styles.cardText}>
            {stats.categories.join(' · ')}
          </Text>
        ) : (
          <Text style={styles.cardSub}>Aún no hay categorías registradas.</Text>
        )}
      </View>

      {/* Botón para cargar biblioteca demo */}
      <TouchableOpacity
        style={styles.primaryBtn}
        onPress={handleSeedDemo}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.primaryBtnTxt}>
            Cargar biblioteca de ejemplo
          </Text>
        )}
      </TouchableOpacity>

      {/* Acerca de la app */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Acerca de la app</Text>
        <Text style={styles.cardText}>
          • Proyecto: BookStore – gestor de libros con lector integrado.
        </Text>
        <Text style={styles.cardText}>
          • Funciones: CRUD, favoritos, búsqueda, lector básico, estadísticas y
          biblioteca demo.
        </Text>
        <Text style={styles.cardText}>
          • Desarrollado como proyecto final modular por Jennifer.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  bigNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: '#6c5ce7',
  },
  cardText: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },
  cardSub: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 4,
  },
  smallCard: {
    flex: 1,
  },
  primaryBtn: {
    marginTop: 8,
    marginBottom: 16,
    backgroundColor: '#6c5ce7',
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryBtnTxt: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});
