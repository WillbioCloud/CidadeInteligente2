import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import InteractiveMissionCard from './InteractiveMissionCard';
import { Mission } from '../../data/missions.data';
import { ThemeColors } from '../../hooks/useUserStore';

interface DailyMissionsProps {
  missions: Mission[];
  theme: ThemeColors;
  missionsProgress: any;
  onToggleTask: (missionId: number, taskIndex: number) => void;
  onClaimReward: (mission: Mission) => void;
}

export default function DailyMissions({
  missions,
  theme,
  missionsProgress,
  onToggleTask,
  onClaimReward,
}: DailyMissionsProps) {
  // CORREÇÃO: Verificação para quando não há missões
  if (!missions || missions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Nenhuma missão diária para hoje. Volte amanhã!</Text>
      </View>
    );
  }

  return (
    <View>
      {/* CORREÇÃO DEFINITIVA: Mapeamento seguro da lista de missões. */}
      {(missions || []).map(mission => (
        <InteractiveMissionCard
          key={mission.id}
          mission={mission}
          theme={theme}
          progressInfo={missionsProgress[mission.id] || { tasks: [], completedBy: null }}
          onToggleTask={onToggleTask}
          onClaimReward={onClaimReward}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
    emptyContainer: { paddingVertical: 40, alignItems: 'center' },
    emptyText: { fontSize: 14, color: '#6B7280' },
});