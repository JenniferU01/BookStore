// src/navigation/navigation.tsx

import React from 'react';
import { useColorScheme } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import type { RootStackParamList, RootTabParamList } from './types';

import HomeScreen from '../screens/HomeScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import SettingsScreen from '../screens/SettingsScreen';
import BookDetailsScreen from '../screens/BookDetailsScreen';
import BookFormScreen from '../screens/BookFormScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

function Tabs() {
  const scheme = useColorScheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#6c5ce7',
        tabBarInactiveTintColor: '#95a5a6',
        tabBarStyle: { height: 60, paddingBottom: 8, paddingTop: 6 },
        tabBarIcon: ({ color, size }) => {
          let name: keyof typeof Ionicons.glyphMap = 'book-outline';
          if (route.name === 'Home') name = 'book-outline';
          if (route.name === 'Favorites') name = 'heart-outline';
          if (route.name === 'Settings') name = 'settings-outline';
          return <Ionicons name={name} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen as any}
        options={{ title: 'Libros' }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen as any}
        options={{ title: 'Favoritos' }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen as any}
        options={{ title: 'Ajustes' }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigation() {
  return (
    <Stack.Navigator initialRouteName="Tabs">
      <Stack.Screen
        name="Tabs"
        component={Tabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BookDetails"
        component={BookDetailsScreen}
        options={{ title: 'Detalle' }}
      />
      <Stack.Screen
        name="BookForm"
        component={BookFormScreen}
        options={{ title: 'Libro' }}
      />
    </Stack.Navigator>
  );
}
