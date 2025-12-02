import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LevelMission } from '../../data/missions.data';
import InteractiveMissionCard from './InteractiveMissionCard';

interface LevelMissionsProps {
  missions: LevelMission[];
  missionsProgress: { [key: number]: { tasks: boolean[], completedBy: string | null } };
  onToggleTask: (missionId: number, taskIndex: number) => void;
  onClaimReward: (mission: LevelMission) => void;
}

export default function LevelMissions({ missions, missionsProgress, onToggleTask, onClaimReward }: LevelMissionsProps) {
  return (
    <View style={styles.container}>
       <View style={styles.header}>
        <Text style={styles.title}>Missões de Evolução</Text>
      </View>

      {/* --- CORREÇÃO APLICADA AQUI --- */}
      {/* Agora usamos a mesma verificação segura do DailyMissions */}
      {Array.isArray(missions) && missions.length > 0 ? (
        missions.map((mission) => {
          const progressState = missionsProgress[mission.id];
          const completedTasks = progressState?.tasks || [];
          const progressValue = mission.tasks.length > 0 ? Math.round((completedTasks.filter(Boolean).length / mission.tasks.length) * 100) : 0;
          
          return (
            <InteractiveMissionCard 
              key={`level-${mission.id}`}
              mission={mission}
              progressValue={progressValue}
              completedTasks={completedTasks}
              completedBy={progressState?.completedBy}
              onToggleTask={onToggleTask}
              onClaimReward={onClaimReward}
            />
          );
        })
      ) : (
        <Text style={styles.emptyText}>Novas missões de evolução aparecerão aqui conforme você sobe de nível!</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 24, paddingBottom: 24, },
  header: { paddingHorizontal: 16, marginBottom: 12, },
  title: { fontSize: 22, fontWeight: 'bold', },
  emptyText: { textAlign: 'center', padding: 32, color: '#6C757D', fontStyle: 'italic' }
});