// src/navigation/navigation.tsx
import React from 'react';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useColorScheme } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import HomeScreen from '../screens/HomeScreen';
import BookDetailsScreen from '../screens/BookDetailsScreen';
import BookFormScreen from '../screens/BookFormScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import SettingsScreen from '../screens/SettingsScreen';
import BookReaderScreen from '../screens/BookReaderScreen';
import type { RootStackParamList, RootTabParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

function Tabs() {
  const scheme = useColorScheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: { height: 60, paddingBottom: 8, paddingTop: 6 },
        headerShown: false,
        tabBarActiveTintColor: '#6c5ce7',
        tabBarInactiveTintColor: '#95a5a6',
        tabBarIcon: ({ color, size }) => {
          let name: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'Home') name = 'book-outline';
          if (route.name === 'Favorites') name = 'heart-outline';
          if (route.name === 'Settings') name = 'settings-outline';

          return <Ionicons name={name} size={size} color={color} />;
        },
        tabBarActiveBackgroundColor:
          scheme === 'dark' ? DarkTheme.colors.card : DefaultTheme.colors.card,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Libros' }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{ title: 'Favoritos' }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Ajustes' }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigation() {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <NavigationContainer theme={theme}>
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
        <Stack.Screen
          name="BookReader"
          component={BookReaderScreen}
          options={{ title: 'Leer libro' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
