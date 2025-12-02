import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Dependent } from '../../data/user.data';

interface DependentPopoverContentProps {
  dependent: Dependent;
  onRemove: (dependentId: string) => void;
}

// A prop 'onClose' foi removida.
export default function DependentPopoverContent({ dependent, onRemove }: DependentPopoverContentProps) {
  return (
    <View style={styles.popoverContainer}>
      <Text style={styles.popoverTitle}>{dependent.fullName}</Text>
      
      <View style={styles.statsRow}>
        <Ionicons name="star" size={16} color="#6C757D" />
        <Text style={styles.popoverText}>{dependent.contributedPoints} pontos</Text>
      </View>
      <View style={styles.statsRow}>
        <Ionicons name="ribbon" size={16} color="#6C757D" />
        <Text style={styles.popoverText}>{dependent.missionsCompleted} missões</Text>
      </View>

      <View style={styles.divider} />

      <TouchableOpacity style={styles.actionButton}>
        <Ionicons name="pencil-outline" size={20} color="#007BFF" />
        <Text style={styles.actionText}>Editar Permissões</Text>
      </TouchableOpacity>
      {/* O botão de remover agora chama a função onRemove diretamente */}
      <TouchableOpacity style={styles.actionButton} onPress={() => onRemove(dependent.id)}>
        <Ionicons name="trash-outline" size={20} color="#DC3545" />
        <Text style={[styles.actionText, { color: '#DC3545' }]}>Remover</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  popoverContainer: { padding: 12, width: 240 },
  popoverTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  statsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  popoverText: { marginLeft: 8, fontSize: 14, color: '#333' },
  divider: { height: 1, backgroundColor: '#E9ECEF', marginVertical: 10 },
  actionButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  actionText: { marginLeft: 10, fontSize: 15 },
});