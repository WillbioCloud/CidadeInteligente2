import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CustomHeader from '../components/layout/CustomHeader';
import { Text, View } from 'react-native';

// Crie sua tela de Transporte aqui
function TransporteScreen() {
    return <View><Text>Tela de Transporte</Text></View>
}

const Stack = createStackNavigator();

export default function TransportStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        header: () => <CustomHeader />,
      }}
    >
      <Stack.Screen
        name="TransporteTab"
        component={TransporteScreen}
      />
    </Stack.Navigator>
  );
}