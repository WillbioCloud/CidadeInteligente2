import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Achievement } from '../../data/achievements.data';
import AchievementsBadge from './AchievementsBadge';
import { Ionicons } from '@expo/vector-icons';

interface AchievementsSectionProps {
  achievements: Achievement[];
  onShowCatalog: () => void;
}

export default function AchievementsSection({ achievements, onShowCatalog }: AchievementsSectionProps) {
  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Conquistas</Text>
        <TouchableOpacity style={styles.catalogButton} onPress={onShowCatalog}>
          <Ionicons name="apps-outline" size={16} color="#4F46E5" />
          <Text style={styles.catalogButtonText}>Ver Catálogo</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.achievementsGrid}>
        {/* CORREÇÃO DEFINITIVA: Se 'achievements' for undefined, usa um array vazio no lugar. */}
        {(achievements || []).map((achievement) => (
          <AchievementsBadge key={achievement.id} achievement={achievement} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 32, paddingHorizontal: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#1F2937' },
  catalogButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EEF2FF', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20 },
  catalogButtonText: { fontWeight: '600', color: '#4338CA', fontSize: 13, marginLeft: 6 },
  achievementsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
});