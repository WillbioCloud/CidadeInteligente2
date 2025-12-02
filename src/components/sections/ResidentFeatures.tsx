// src/components/sections/ResidentFeatures.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Bus, Calendar, Heart, MapPin, Clock, ChevronRight, Building } from '../Icons';

const features = [
  { id: 'Transporte', icon: Bus, title: 'Horários de Ônibus', screen: 'Transport' },
  { id: 'ReservarQuadras', icon: Calendar, title: 'Reservar Quadras', screen: 'CourtScheduling' },
  { id: 'Saude', icon: Heart, title: 'Saúde e Bem-estar', screen: 'Health' },
  // AQUI ESTÁ A MUDANÇA: Navega para a rota "Mapa" que adicionamos no HomeStack
  { id: 'MapaLocal', icon: MapPin, title: 'Mapa Local', screen: 'Mapa' }, 
  { id: 'Empreendimentos', icon: Building, title: 'Empreendimentos da FBZ', screen: 'Empreendimentos' },
  { id: 'Funcionamento', icon: Clock, title: 'Horário de Funcionamento', screen: 'OperatingHours' },
];

export const ResidentFeatures = () => {
  const navigation = useNavigation();

  const handlePress = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Funcionalidades</Text>
          <Text style={styles.subtitle}>Tudo que você precisa no seu dia a dia</Text>
        </View>
        <TouchableOpacity style={styles.seeAllButton} onPress={() => navigation.navigate('More')}>
          <Text style={styles.seeAllText}>Ver todos</Text>
          <ChevronRight size={16} color="#339949ff" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.grid}>
        {features.map(feature => {
          const Icon = feature.icon;
          return (
            <TouchableOpacity key={feature.id} style={styles.card} onPress={() => handlePress(feature.screen)}>
              <Icon size={28} color="#339949ff" />
              <Text style={styles.cardText}>{feature.title}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: { 
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    color: '#339949ff',
    fontWeight: '600',
    marginRight: 4,
  },
  title: { fontSize: 20, fontWeight: 'bold' },
  subtitle: { color: 'gray' },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  cardText: {
    marginTop: 8,
    fontWeight: '600',
    textAlign: 'center',
  },
});