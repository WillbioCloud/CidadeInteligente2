// App.tsx
import React from 'react';
import AppRouter from './src/navigation/AppRouter';
import { ModalProvider } from './src/context/ModalContext'; // Adicione a importação do ModalProvider
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // Importante para gestos

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
        <ModalProvider>
            <AppRouter />
        </ModalProvider>
    </GestureHandlerRootView>
  );
}
