import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ComerciosTabScreen from '../screens/Comercios/ComerciosTabScreen';
import CommerceDetailScreen from '../screens/Comercios/CommerceDetailScreen';

const Stack = createStackNavigator();

/**
 * Este componente agrupa as telas relacionadas à aba "Comércios".
 * - ComerciosList: A tela principal que mostra a lista de todos os comércios.
 * - CommerceDetails: A tela que mostra os detalhes de um comércio específico.
 * * Isso permite a navegação do card na lista para a tela de detalhes.
 */
const ComerciosStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // Oculta o cabeçalho padrão do stack, pois as telas já têm o seu.
      }}
    >
      <Stack.Screen
        name="ComerciosList" // Damos um nome para a tela da lista
        component={ComerciosTabScreen}
      />
      <Stack.Screen
        name="CommerceDetails" // Registramos a tela de detalhes que estava faltando
        component={CommerceDetailScreen}
      />
    </Stack.Navigator>
  );
};

export default ComerciosStackNavigator;