// src/navigation/AuthNavigator.tsx

import React from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';

// Importe os novos ecrãs
import SplashScreen from '../../screens/Auth/SplashScreen';
import WelcomeScreen from '../../screens/Auth/WelcomeScreen';

// Importe os ecrãs existentes
import LoginScreen from '../../screens/Auth/LoginScreen';
import RegisterScreen from '../../screens/Auth/RegisterScreen';
import ForgotPasswordScreen from '../../screens/Auth/ForgotPasswordScreen';

const AuthStack = createStackNavigator();

export default function AuthNavigator() {
  return (
    <AuthStack.Navigator 
        screenOptions={{ 
            headerShown: false,
            // Adiciona uma animação de slide horizontal padrão
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
    >
      {/* O ecrã inicial agora é o SplashScreen */}
      <AuthStack.Screen 
        name="Splash" 
        component={SplashScreen} 
      />
      <AuthStack.Screen 
        name="Welcome" 
        component={WelcomeScreen} 
      />
      <AuthStack.Screen 
        name="Login" 
        component={LoginScreen} 
      />
      <AuthStack.Screen 
        name="Register" 
        component={RegisterScreen} 
      />
      <AuthStack.Screen 
        name="ForgotPassword" 
        component={ForgotPasswordScreen} 
      />
    </AuthStack.Navigator>
  );
}
