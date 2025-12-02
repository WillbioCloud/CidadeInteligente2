// src/components/home/LotsAvailableCard.tsx (VERSÃO FINAL COM DADOS DINÂMICOS)

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Home, MapPin } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';
import { LotsAvailableModal } from './LotsAvailableModal';

export const LotsAvailableCard = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // 1. Criamos um estado para guardar os dados vindos do banco
  const [stats, setStats] = useState({
    available: 0,
    total: 0,
    loteamentosCount: 0,
  });

  // 2. Usamos o useEffect para buscar os dados quando o componente carrega
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data, error, count } = await supabase
          .from('loteamentos')
          .select('available_lots, total_lots', { count: 'exact' });

        if (error) throw error;

        if (data) {
          // 3. Calculamos os totais a partir dos dados recebidos
          const totalAvailable = data.reduce((sum, lot) => sum + (lot.available_lots || 0), 0);
          const totalLots = data.reduce((sum, lot) => sum + (lot.total_lots || 0), 0);

          setStats({
            available: totalAvailable,
            total: totalLots,
            loteamentosCount: count || 0,
          });
        }
      } catch (error) {
        console.error("Erro ao buscar estatísticas dos lotes:", error);
        // Em caso de erro, não quebra o app, apenas mostra zeros.
        setStats({ available: 0, total: 0, loteamentosCount: 0 });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const percentage = stats.total > 0 ? (stats.available / stats.total) * 100 : 0;

  // 4. Se estiver carregando, mostramos um spinner dentro do card
  if (isLoading) {
    return (
      <View style={[styles.card, styles.centered]}>
        <ActivityIndicator color="#16A34A" />
      </View>
    );
  }

  return (
    <>
      <TouchableOpacity 
        style={styles.card} 
        onPress={() => setModalVisible(true)} 
        activeOpacity={0.8}
      >
        <View style={styles.header}>
          <Home size={28} color="#16A34A" />
          <View>
            {/* 5. Exibimos os dados do nosso estado, não mais os números fixos */}
            <Text style={styles.availableText}>{stats.available}</Text>
            <Text style={styles.totalText}>de {stats.total}</Text>
          </View>
        </View>
        
        <View>
            <Text style={styles.title}>Lotes Disponíveis</Text>
            <Text style={styles.loteamentosInfo}>
                <MapPin size={12} color="#15803D" /> {stats.loteamentosCount} Empreendimentos
            </Text>
        </View>

        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${percentage}%` }]} />
          <Text style={styles.percentageText}>{percentage.toFixed(0)}%</Text>
        </View>
      </TouchableOpacity>

      <LotsAvailableModal 
        isVisible={isModalVisible} 
        onClose={() => setModalVisible(false)} 
      />
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    height: 140,
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  availableText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#166534',
    textAlign: 'right',
  },
  totalText: {
    fontSize: 12,
    color: '#166534',
    opacity: 0.8,
    textAlign: 'right',
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: '#14532D',
  },
  loteamentosInfo: {
    fontSize: 12,
    color: '#166534',
    opacity: 0.9,
    fontWeight: '500',
  },
  progressContainer: {
    height: 8,
    right: 6,
    backgroundColor: '#DCFCE7',
    borderRadius: 4,
    overflow: 'visible',
    position: 'relative',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#22C55E',
    borderRadius: 4,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  percentageText: {
    position: 'absolute',
    right: -18,
    top: -3,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#16A34A',
  },
});