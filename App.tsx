// App.tsx (raíz)

import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import AppNavigation from './src/navigation/navigation';

export default function App() {
  const scheme = useColorScheme();

  return (
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AppNavigation />
    </NavigationContainer>
  );
}
