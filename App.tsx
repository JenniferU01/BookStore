// App.tsx
import React from 'react';
import { StatusBar } from 'react-native';
import AppNavigation from './src/navigation/navigation';

export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" />
      <AppNavigation />
    </>
  );
}
