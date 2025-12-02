// src/components/LoteamentoSelector.tsx (VERSÃO FINAL COM TELA DE "NENHUM EMPREENDIMENTO")

import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, FlatList, Image, SafeAreaView } from 'react-native';
import { useUserStore } from '../hooks/useUserStore';
import { LOTEAMENTOS_CONFIG } from '../data/loteamentos.data';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AlertCircle } from './Icons'; // Importando o ícone de alerta

// --- NOVO: Componente para o estado vazio ---
const EmptyState = ({ onClose }) => {
  const navigation = useNavigation();

  const handleExplore = () => {
    onClose(); // Fecha o modal
    // Atraso para a animação do modal não atrapalhar a navegação
    setTimeout(() => {
      navigation.navigate('Home'); // Leva o usuário para a Home
    }, 300);
  };

  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconWrapper}>
        <AlertCircle size={32} color="#F97316" />
      </View>
      <Text style={styles.emptyTitle}>Nenhum Empreendimento</Text>
      <Text style={styles.emptySubtitle}>Você ainda não possui nenhum produto da FBZ.</Text>
      <TouchableOpacity style={styles.exploreButton} onPress={handleExplore}>
        <Text style={styles.exploreButtonText}>Explorar Empreendimentos</Text>
      </TouchableOpacity>
    </View>
  );
};


interface LoteamentoSelectorProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function LoteamentoSelector({ isVisible, onClose }: LoteamentoSelectorProps) {
  const { userProfile, selectedLoteamentoId, setSelectedLoteamentoId } = useUserStore();

  const handleSelect = (loteamentoId: string) => {
    setSelectedLoteamentoId(loteamentoId);
    onClose();
  };

  const userProperties = userProfile?.properties || [];

  return (
    <Modal animationType="slide" visible={isVisible} onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.modalContainer}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Meus Empreendimentos</Text>
              <TouchableOpacity onPress={onClose}><Ionicons name="close" size={28} color="#6B7280" /></TouchableOpacity>
            </View>
            <FlatList
              data={userProperties}
              renderItem={({ item }) => {
                const loteamentoInfo = LOTEAMENTOS_CONFIG[item.loteamento_id];
                if (!loteamentoInfo) return null;

                return (
                    <TouchableOpacity 
                        style={[styles.itemContainer, selectedLoteamentoId === item.loteamento_id && styles.itemContainerSelected]} 
                        onPress={() => handleSelect(item.loteamento_id)}
                    >
                        <Image source={loteamentoInfo.logo} style={styles.itemImage} />
                        <View style={styles.itemTextContainer}>
                            <Text style={styles.itemName}>{loteamentoInfo.name}</Text>
                            <Text style={styles.itemLocation}>Quadra {item.quadra} • Lote {item.lote}</Text>
                        </View>
                        {selectedLoteamentoId === item.loteamento_id && <Ionicons name="checkmark-circle" size={28} color="#22C55E" />}
                    </TouchableOpacity>
                );
              }}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.list}
              // AQUI ESTÁ A MUDANÇA: Usamos nosso novo componente para a lista vazia
              ListEmptyComponent={<EmptyState onClose={onClose} />}
            />
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F8F9FA' },
    modalContainer: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
    headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#1F2937' },
    list: { paddingTop: 8, paddingHorizontal: 16 },
    itemContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, marginBottom: 12, borderWidth: 2, borderColor: '#FFF' },
    itemContainerSelected: { borderColor: '#22C55E' },
    itemImage: { width: 48, height: 48, resizeMode: 'contain', marginRight: 12 },
    itemTextContainer: { flex: 1 },
    itemName: { fontSize: 16, fontWeight: '600', color: '#111827' },
    itemLocation: { fontSize: 14, color: '#6B7280', marginTop: 2 },
    // --- NOVOS ESTILOS PARA O ESTADO VAZIO ---
    emptyContainer: { 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center',
      padding: 20,
      marginTop: '30%',
    },
    emptyIconWrapper: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#FFF7ED',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1F2937',
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 32,
    },
    exploreButton: {
        backgroundColor: '#3B82F6', // Cor azul do conceito
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#3B82F6',
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    exploreButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});