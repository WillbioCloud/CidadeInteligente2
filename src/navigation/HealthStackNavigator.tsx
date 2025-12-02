// Local: src/navigation/HealthStackNavigator.tsx (VERSÃO CORRIGIDA)

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Apenas a tela principal da Saúde é necessária aqui agora
import HealthTabScreen from '../screens/Health/HealthTabScreen';

const Stack = createStackNavigator();

export default function HealthStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="HealthTabHome" 
        component={HealthTabScreen} 
      />
      {/* A linha da NutritionCalculatorScreen foi removida */}
    </Stack.Navigator>
  );
}