import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ExploreMapScreen from '../screens/Map/ExploreMapScreen';

const Stack = createStackNavigator();

export default function MapStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ExploreMap" component={ExploreMapScreen} />
    </Stack.Navigator>
  );
}
