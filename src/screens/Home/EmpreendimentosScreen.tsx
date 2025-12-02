// src/screens/Home/EmpreendimentosScreen.tsx (VERSÃO FINAL)

import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';

// Importa os componentes corretos que já existem
import { LotsAvailableCard } from '../../components/home/LotsAvailableCard';
import { DevelopmentsSection } from '../../components/sections/DevelopmentsSection'; // <-- Importa o componente correto

export default function EmpreendimentosScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Empreendimentos</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.subtitle}>
          Consulte os lotes disponíveis e conheça em detalhes cada um dos nossos loteamentos.
        </Text>
        
        <View style={styles.cardContainer}>
          <LotsAvailableCard />
        </View>
        
        {/* Renderiza o componente correto */}
        <DevelopmentsSection />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  backButton: { padding: 8 },
  scrollContent: { padding: 16 },
  subtitle: { fontSize: 16, color: '#64748B', textAlign: 'center', marginBottom: 24 },
  cardContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
});