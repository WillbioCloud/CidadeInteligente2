// src/components/home/WelcomeCard.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useUserStore } from '../../hooks/useUserStore';
import { LinearGradient } from 'expo-linear-gradient';

export const WelcomeCard = () => {
  const { userProfile } = useUserStore();
  const userName = userProfile?.full_name?.split(' ')[0] || 'Usuário';
  
  // Mensagem de boas-vindas conforme o conceito
  const welcomeMessage = `Bem-vindo ao Loteamento ${userProfile?.properties?.[0]?.loteamento_id || 'das Flores'}`;

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={['#4338CA', '#6366F1']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarLetter}>{userName.charAt(0).toUpperCase()}</Text>
        </View>
        <View>
            <Text style={styles.greetingText}>Olá, {userName}!</Text>
            <Text style={styles.welcomeMessage}>{welcomeMessage}</Text>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  container: {
    padding: 20,
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#4F46E5',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarLetter: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  greetingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  welcomeMessage: {
    fontSize: 16,
    color: 'white',
    opacity: 0.8,
    marginTop: 2,
  },
});