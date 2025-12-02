import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import CustomHeader from '../components/layout/CustomHeader';
import HomeTabScreen from '../screens/Home/HomeTabScreen';
import LoteamentoMediaScreen from '../screens/Home/LoteamentoMediaScreen';

const Stack = createStackNavigator();

/**
 * Gerencia a pilha de telas da aba Home e aplica o cabeçalho padrão.
 */
export default function HomeStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        header: () => <CustomHeader />, // Header padrão para as telas deste stack
      }}
    >
      <Stack.Screen
        name="HomeTab"
        component={HomeTabScreen}
      />
      <Stack.Screen
        name="LoteamentoMedia"
        component={LoteamentoMediaScreen}
        options={{
          headerShown: false, // Oculta o header padrão para usar o da própria tela
        }}
      />
    </Stack.Navigator>
  );
}