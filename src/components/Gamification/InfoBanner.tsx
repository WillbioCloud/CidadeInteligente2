import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function InfoBanner() {
  return (
    <View style={styles.bannerContainer}>
      <Ionicons name="information-circle-outline" size={24} color="#0284C7" />
      <Text style={styles.bannerText}>
        Complete 3 missões diárias para manter sua sequência e ganhar pontos extras!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bannerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE', // Azul claro
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 16,
    marginTop: 16,
    maxWidth: '100%',
  },
  bannerText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#0369A1', // Azul escuro
    lineHeight: 20,
    fontWeight: '500',
    textAlign: 'left',
  },
});