// src/screens/Gamification/NonClientGamificationScreen.tsx (VERSÃO FINAL - IGUAL AO CONCEPT)

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Lock, Trophy, Target, Gift, Star, Crown } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const BenefitItem = ({ icon: Icon, text }) => (
  <View style={styles.benefitItem}>
    <Icon size={24} color="#A0AEC0" />
    <Text style={styles.benefitText}>{text}</Text>
  </View>
);

export const NonClientGamificationScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Lock size={64} color="#CBD5E1" />
          <View style={styles.trophyBadge}>
            <Trophy size={16} color="white" />
          </View>
        </View>

        <Text style={styles.title}>Área Exclusiva para Clientes</Text>
        <Text style={styles.subtitle}>
          Você ainda não possui nenhum produto da nossa empresa.
          Adquira um lote em nossos empreendimentos e desbloqueie um mundo de recompensas e benefícios exclusivos!
        </Text>

        <Text style={styles.unlockTitle}>O que você vai desbloquear:</Text>
        
        <View style={styles.benefitsGrid}>
          <BenefitItem icon={Target} text="Missões Exclusivas" />
          <BenefitItem icon={Gift} text="Recompensas" />
          <BenefitItem icon={Star} text="Sistema de Níveis" />
          <BenefitItem icon={Crown} text="Conquistas" />
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <LinearGradient
            colors={['#6D28D9', '#4F46E5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ctaButton}
          >
            <Text style={styles.ctaButtonText}>Ver Nossos Loteamentos</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F1F5F9', // Cor mais clara
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  trophyBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F87171', // Vermelho mais suave
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#F8FAFC',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 24,
    marginBottom: 24,
  },
  unlockTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
    textAlign: 'center',
    marginBottom: 16,
  },
  benefitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  benefitItem: {
    alignItems: 'center',
    backgroundColor: '#F1F5F9', // Fundo cinza claro, sem borda
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 8,
    width: '48%',
    marginBottom: 12,
  },
  benefitText: {
    marginTop: 8,
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  ctaButton: {
    marginTop: 24,
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#4F46E5',
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  ctaButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});