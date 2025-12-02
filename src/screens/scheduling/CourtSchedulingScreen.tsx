// src/screens/scheduling/CourtSchedulingScreen.tsx (VERSÃO REDESENHADA)

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, ImageBackground, ActivityIndicator } from 'react-native';
import { ArrowLeft, Users, Zap } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';
import { useUserStore } from '../../hooks/useUserStore';

// Componente para o Card de cada quadra
const CourtCard = ({ court, onSelect }) => (
  <View style={styles.card}>
    <ImageBackground source={{ uri: court.image_url }} style={styles.cardImage} imageStyle={{ borderRadius: 16 }}>
      <View style={styles.imageOverlay}>
        <View style={styles.tagRow}>
          <View style={styles.typeTag}><Text style={styles.typeTagText}>{court.type}</Text></View>
          <View style={styles.priceTag}><Text style={styles.priceTagText}>GRATUITO</Text></View>
        </View>
      </View>
    </ImageBackground>
    <View style={styles.cardContent}>
      <Text style={styles.courtName}>{court.name}</Text>
      <View style={styles.infoRow}>
        <Users size={16} color="#64748B" />
        <Text style={styles.infoText}>Até {court.capacity} pessoas</Text>
      </View>
      <View style={styles.featuresRow}>
        {court.features.slice(0, 3).map((feature, index) => (
          <View key={index} style={styles.featureChip}><Text style={styles.featureText}>{feature}</Text></View>
        ))}
        {court.features.length > 3 && (
          <View style={styles.featureChip}><Text style={styles.featureText}>+{court.features.length - 3} mais</Text></View>
        )}
      </View>
      <TouchableOpacity style={styles.selectButton} onPress={() => onSelect(court)}>
        <Text style={styles.selectButtonText}>Selecionar Quadra</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default function CourtSchedulingScreen({ navigation }) {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { selectedLoteamentoId } = useUserStore();

  useEffect(() => {
    const fetchCourts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('courts')
        .select('*')
        .eq('loteamento_id', selectedLoteamentoId);
      
      if (error) {
        console.error("Erro ao buscar quadras:", error);
      } else {
        setCourts(data);
      }
      setLoading(false);
    };

    fetchCourts();
  }, [selectedLoteamentoId]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        {/* BOTÃO PARA VER AGENDAMENTOS */}
        <TouchableOpacity onPress={() => navigation.navigate('MyBookings')} style={styles.myBookingsButton}>
          <Text style={styles.myBookingsText}>Meus Agendamentos</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Reservar Quadras Públicas</Text>
          <Text style={styles.pageSubtitle}>Escolha sua quadra e faça sua reserva gratuita</Text>
        </View>
        
        {loading ? (
          <ActivityIndicator size="large" color="#339949ff" />
        ) : (
          courts.map(court => (
            <CourtCard key={court.id} court={court} onSelect={(c) => navigation.navigate('CourtBookingDetail', { court: c })} />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', marginBottom: 100, paddingBottom: 20 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  backButton: { padding: 8 },
  myBookingsButton: { padding: 8, backgroundColor: '#9ce9af36', borderRadius: 8 },
  myBookingsText: { color: '#339949ff', fontWeight: '600' },
  scrollContent: { padding: 16 },
  pageHeader: { alignItems: 'center', marginBottom: 24 },
  pageTitle: { fontSize: 24, fontWeight: 'bold' },
  pageSubtitle: { color: '#64748B', marginTop: 4 },
  card: { backgroundColor: 'white', borderRadius: 16, marginBottom: 20, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  cardImage: { height: 140, justifyContent: 'space-between' },
  imageOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 16, padding: 12 },
  tagRow: { flexDirection: 'row', justifyContent: 'space-between' },
  typeTag: { backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  typeTagText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  priceTag: { backgroundColor: '#16A34A', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  priceTagText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  cardContent: { padding: 16 },
  courtName: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  infoText: { marginLeft: 8, color: '#475569' },
  featuresRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  featureChip: { backgroundColor: '#F1F5F9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  featureText: { color: '#475569', fontSize: 12 },
  selectButton: { backgroundColor: '#3B82F6', padding: 14, borderRadius: 8, alignItems: 'center' },
  selectButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});