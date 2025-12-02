import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Dependent } from '../../data/user.data';

interface DependentProfileModalProps {
  dependent: Dependent | null; // Pode ser nulo quando não há ninguém selecionado
  isVisible: boolean;
  onClose: () => void;
  onRemove: (dependentId: string) => void;
}

export default function DependentProfileModal({ dependent, isVisible, onClose, onRemove }: DependentProfileModalProps) {
  if (!dependent) return null; // Não renderiza nada se não houver dependente selecionado

  // Estado para o switch de permissão
  const [canInvite, setCanInvite] = useState(dependent.permissions.canInvite);

  const handleRemove = () => {
    onClose(); // Fecha este modal primeiro
    // Atraso para a animação de fechar terminar antes de mostrar o alerta
    setTimeout(() => {
        onRemove(dependent.id);
    }, 500);
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.modalView}>
          <Ionicons name="person-circle-outline" size={60} color="#007BFF" style={{ alignSelf: 'center' }} />
          <Text style={styles.dependentName}>{dependent.fullName}</Text>
          <Text style={styles.dependentRelation}>{dependent.relationship}</Text>

          {/* Seção de Estatísticas */}
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Ionicons name="star" size={24} color="#FFC107" />
              <Text style={styles.statValue}>{dependent.contributedPoints}</Text>
              <Text style={styles.statLabel}>Pontos Contribuídos</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons name="ribbon" size={24} color="#4CAF50" />
              <Text style={styles.statValue}>{dependent.missionsCompleted}</Text>
              <Text style={styles.statLabel}>Missões Concluídas</Text>
            </View>
          </View>

          {/* Seção de Permissões */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Permissões</Text>
            <View style={styles.permissionItem}>
              <Text style={styles.permissionText}>Pode convidar novos membros?</Text>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={canInvite ? "#007BFF" : "#f4f3f4"}
                onValueChange={() => setCanInvite(prev => !prev)}
                value={canInvite}
              />
            </View>
          </View>

          {/* Seção de Ações */}
          <View style={styles.section}>
             <Text style={styles.sectionTitle}>Ações</Text>
             <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="pencil-outline" size={20} color="#007BFF" />
                <Text style={styles.actionButtonText}>Editar Perfil</Text>
             </TouchableOpacity>
             <TouchableOpacity style={[styles.actionButton, {marginTop: 10}]} onPress={handleRemove}>
                <Ionicons name="trash-outline" size={20} color="#DC3545" />
                <Text style={[styles.actionButtonText, {color: '#DC3545'}]}>Remover Dependente</Text>
             </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)' },
    modalView: { width: '90%', backgroundColor: 'white', borderRadius: 20, padding: 24, paddingTop: 32 },
    dependentName: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginTop: 12 },
    dependentRelation: { fontSize: 16, color: '#6C757D', textAlign: 'center', marginBottom: 24 },
    statsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 24 },
    statBox: { alignItems: 'center', flex: 1 },
    statValue: { fontSize: 20, fontWeight: 'bold', marginTop: 4 },
    statLabel: { fontSize: 12, color: '#6C757D', marginTop: 2 },
    section: { marginBottom: 16 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
    permissionItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8F9FA', padding: 12, borderRadius: 8 },
    permissionText: { fontSize: 15 },
    actionButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F9FA', padding: 14, borderRadius: 8 },
    actionButtonText: { fontSize: 15, marginLeft: 12, fontWeight: '500', color: '#007BFF' }
});