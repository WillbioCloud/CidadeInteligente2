// src/components/home/LotsAvailableModal.tsx (VERSÃO FINAL COM CARD EXPANSÍVEL)

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, FlatList, ActivityIndicator, LayoutAnimation, Platform, UIManager } from 'react-native';
import { X, Building, University, Leaf, Flower, Sunset, Home, Mountain, Tree, ChevronDown } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface LoteStage {
  name: string;
  available_lots: number;
  total_lots: number;
  status: string;
}

interface LoteData {
  id: string;
  name: string;
  available_lots: number;
  total_lots: number;
  city: string;
  stages?: LoteStage[];
}

// ... (LOTE_ICONS, LOTE_COLORS, getIcon, getIconBgColor continuam os mesmos)
const LOTE_ICONS = {
  'Cidade Inteligente': Building, 'Cidade Universitária': University, 'Cidade Verde': Leaf, 'Cidade das Flores': Flower, 'Setor Lago Sul': Sunset, 'Residencial Morada Nobre': Home, 'Caminho do Lago': Mountain, 'Parque Flamboyant': Tree,
};
const LOTE_COLORS = {
    'Cidade Inteligente': '#60A5FA', 'Cidade Universitária': '#C084FC', 'Cidade Verde': '#4ADE80', 'Cidade das Flores': '#F472B6', 'Setor Lago Sul': '#FBBF24', 'Residencial Morada Nobre': '#FB923C', 'Caminho do Lago': '#38BDF8', 'Parque Flamboyant': '#8B5CF6', default: '#A1A1AA'
};
const getIcon = (name) => { const Icon = LOTE_ICONS[name] || Building; return <Icon color="white" size={24} />; }
const getIconBgColor = (name) => LOTE_COLORS[name] || LOTE_COLORS.default;


// --- NOVO Componente para o item da lista, agora com lógica de expansão ---
const LoteamentoItem = ({ item, expandedId, setExpandedId }) => {
  const isMultiStage = item.stages && item.stages.length > 0;
  const isExpanded = expandedId === item.id;

  const handlePress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(isExpanded ? null : item.id);
  };

  return (
    <View style={styles.itemWrapper}>
      <TouchableOpacity onPress={handlePress} activeOpacity={isMultiStage ? 0.7 : 1}>
        <View style={styles.itemContainer}>
          <View style={[styles.iconContainer, {backgroundColor: getIconBgColor(item.name)}]}>
            {getIcon(item.name)}
          </View>
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemCity}>{item.city}</Text>
          </View>
          <View style={[styles.badge, item.available_lots > 0 ? styles.badgeAvailable : styles.badgeSoldOut]}>
            <Text style={[styles.badgeText, item.available_lots > 0 ? {} : {color: '#B91C1C'} ]}>
                {item.available_lots > 0 ? `${item.available_lots}/${item.total_lots}` : 'Esgotado'}
            </Text>
          </View>
          {isMultiStage && (
            <ChevronDown size={20} color="#6B7280" style={{ transform: [{ rotate: isExpanded ? '180deg' : '0deg' }], marginLeft: 8 }} />
          )}
        </View>
      </TouchableOpacity>

      {isExpanded && isMultiStage && (
        <View style={styles.stagesContainer}>
          {item.stages.map((stage, index) => (
            <View key={index} style={styles.stageRow}>
              <View>
                <Text style={styles.stageName}>{stage.name}</Text>
                <Text style={styles.stageStatus}>{stage.status}</Text>
              </View>
              <View style={[styles.badge, styles.badgeStage]}>
                <Text style={styles.badgeText}>{`${stage.available_lots}/${stage.total_lots}`}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};


export const LotsAvailableModal = ({ isVisible, onClose }) => {
  const [loteamentos, setLoteamentos] = useState<LoteData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (isVisible) {
      const fetchLotsData = async () => {
        setIsLoading(true);
        try {
          // A query agora busca a nova coluna 'stages'
          const { data, error } = await supabase.from('loteamentos').select('id, name, available_lots, total_lots, city, stages').order('name', { ascending: true });
          if (error) throw error;
          if (data) setLoteamentos(data);
        } catch (error) {
          console.error("Erro ao buscar dados para o modal:", error);
          alert('Não foi possível carregar os dados dos lotes.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchLotsData();
    } else {
      setExpandedId(null); // Reseta o card expandido ao fechar o modal
    }
  }, [isVisible]);
  
  const totalAvailable = loteamentos.reduce((sum, lot) => sum + (lot.available_lots || 0), 0);
  const totalLots = loteamentos.reduce((sum, lot) => sum + (lot.total_lots || 0), 0);
  const totalPercentage = totalLots > 0 ? (totalAvailable / totalLots) * 100 : 0;

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Lotes Disponíveis por Loteamento</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={15} color="#6B7280" />
            </TouchableOpacity>
          </View>
          {isLoading ? (
            <ActivityIndicator size="large" color="#16A34A" style={{flex: 1}}/>
          ) : (
            <>
              <FlatList
                data={loteamentos}
                renderItem={({ item }) => <LoteamentoItem item={item} expandedId={expandedId} setExpandedId={setExpandedId} />}
                keyExtractor={item => item.id}
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
                extraData={expandedId} // Garante que a lista renderize novamente quando um item expande
              />
              <View style={styles.footer}>
                <Text style={styles.footerTitle}>Total Geral:</Text>
                <Text style={styles.footerTotal}>{totalAvailable}/{totalLots} lotes</Text>
                <View style={styles.progressContainer}>
                    <View style={[styles.progressBar, {width: `${totalPercentage}%`}]} />
                </View>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContainer: { height: '85%', backgroundColor: '#F8FAFC', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingVertical: 8 },
  header: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 16, marginBottom: 8 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#16A34A', flex: 1, textAlign: 'center', marginRight: 40 },
  closeButton: { position: 'absolute', right: 16, top: 16, backgroundColor: '#F1F5F9', borderRadius: 16, padding: 8 },
  itemWrapper: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    overflow: 'hidden',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  iconContainer: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: '600', color: '#1E293B' },
  itemCity: { fontSize: 14, color: '#64748B' },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  badgeAvailable: { backgroundColor: '#DCFCE7' },
  badgeSoldOut: { backgroundColor: '#FEE2E2' },
  badgeText: { fontWeight: 'bold', fontSize: 12, color: '#16A34A' },
  stagesContainer: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  stageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  stageName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155'
  },
  stageStatus: {
    fontSize: 12,
    color: '#64748B'
  },
  badgeStage: {
    backgroundColor: '#E0E7FF'
  },
  footer: { padding: 24, borderTopWidth: 1, borderTopColor: '#E2E8F0', backgroundColor: 'white' },
  footerTitle: { fontSize: 16, fontWeight: 'bold', color: '#334155' },
  footerTotal: { fontSize: 16, fontWeight: 'bold', color: '#16A34A', position: 'absolute', right: 24, top: 24 },
  progressContainer: { height: 8, backgroundColor: '#E2E8F0', borderRadius: 4, overflow: 'hidden', marginTop: 8 },
  progressBar: { height: '100%', backgroundColor: '#22C55E', borderRadius: 4 },
});