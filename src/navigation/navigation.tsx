import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import HomeScreen from '../screens/HomeScreen';
import BookDetailsScreen from '../screens/BookDetailsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const theme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: '#ffffff' }, // evita parpadeos
};

export default function AppNavigation() {
  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'BookStore' }}
        />
        <Stack.Screen
          name="BookDetails"
          component={BookDetailsScreen}
          options={{ title: 'Detalles' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
