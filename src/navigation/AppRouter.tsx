// src/navigation/AppRouter.tsx

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useUserStore } from '../hooks/useUserStore';
import { supabase } from '../lib/supabase';
import MainNavigator from './MainNavigator';
import AuthNavigator from './AuthNavigator';
import OnboardingScreen from '../screens/Onboarding/OnboardingScreen';
import { View, ActivityIndicator, StatusBar, StyleSheet } from 'react-native';
import { ModalProvider } from '../context/ModalContext';

export default function AppRouter() {
  // --- CORREÇÃO AQUI ---
  // A função `setSession` foi adicionada à desestruturação do hook.
  const { session, setSession, userProfile, _hasHydrated, fetchUserProfile, clearStore } = useUserStore();

  useEffect(() => {
    // Esta parte agora funciona porque `setSession` está definido.
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchUserProfile(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (_event === 'SIGNED_IN') fetchUserProfile(session);
        if (_event === 'SIGNED_OUT') clearStore();
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchUserProfile, setSession, clearStore]); // A dependência `setSession` agora é válida.

  if (!_hasHydrated) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="default" />
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {session && userProfile ? (
        userProfile.has_completed_onboarding ? (
          <ModalProvider>
            <MainNavigator />
          </ModalProvider>
        ) : (
          <OnboardingScreen />
        )
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
