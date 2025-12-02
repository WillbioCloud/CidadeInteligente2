import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// Importando o tipo Achievement do nosso novo arquivo de dados
import { Achievement } from '../../data/achievements.data';

interface AchievementBadgeProps {
  achievement: Achievement;
}

export default function AchievementBadge({ achievement }: AchievementBadgeProps) {
  // Se a conquista for secreta e não tiver sido ganha, não mostramos nada
  if (achievement.secret && !achievement.earned) {
    return (
      <View style={[styles.badge, styles.secretBadge]}>
        <Ionicons name="help-circle-outline" size={30} color="#A0A0A0" />
        <Text style={styles.secretName}>???</Text>
      </View>
    );
  }

  return (
    <View style={[styles.badge, achievement.earned ? styles.earnedBadge : styles.lockedBadge]}>
      <View style={styles.iconContainer}>
        <Ionicons 
            name={achievement.icon as any} 
            size={30} 
            color={achievement.earned ? '#007BFF' : '#A0A0A0'} 
        />
      </View>
      <Text style={[styles.name, !achievement.earned && styles.lockedName]}>
        {achievement.title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    width: '48%', // Para caber 2 por linha com um espaço
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
  },
  earnedBadge: {
    backgroundColor: '#F8F9FA',
    borderColor: '#E9ECEF',
  },
  lockedBadge: {
    backgroundColor: '#F8F9FA',
    borderColor: '#E9ECEF',
    opacity: 0.6,
  },
  secretBadge: {
    backgroundColor: '#E9ECEF',
    borderColor: '#CED4DA',
  },
  iconContainer: {
    marginBottom: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#343A40',
    textAlign: 'center',
  },
  lockedName: {
    color: '#6C757D',
  },
  secretName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6C757D',
  },
});