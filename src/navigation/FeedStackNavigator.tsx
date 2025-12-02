// src/navigation/FeedStackNavigator.tsx

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import FeedScreen from '../screens/Feed/FeedScreen';

const Stack = createStackNavigator();

export default function FeedStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Feed" component={FeedScreen} />
      {/* Futuramente, você pode adicionar a tela de detalhes de um post aqui */}
      {/* <Stack.Screen name="PostDetails" component={PostDetailsScreen} /> */}
    </Stack.Navigator>
  );
}