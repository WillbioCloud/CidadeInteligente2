// src/screens/info/OperatingHoursScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ArrowLeft, Clock, Phone, MapPin, Tent, Zap, Sprout, HandPlatter, School, Shield, Car, Bus, Utensils } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';
import { useUserStore } from '../../hooks/useUserStore';

// --- MOCK DATA PARA SIMULAR A RESPOSTA DA API COM A NOVA ESTRUTURA ---
// No seu backend, você precisará adicionar esses campos à tabela 'points_of_interest'
const MOCK_PLACES = [
    // Áreas Comuns
    { id: 1, name: 'Quadra Poliesportiva', category: 'Esportes', operating_hours: { dias: '7:00 - 21:00', semanal: { Seg: '7-21', Ter: '7-21', Qua: '7-21', Qui: '7-21', Sex: '7-22', Sab: '7-22', Dom: '7-21' } }, description: 'Reserva obrigatória através do app', icon: 'zap' },
    { id: 2, name: 'Quadras de Areia', category: 'Esportes', operating_hours: { dias: '7:00 - 21:00', semanal: { Seg: '7-21', Ter: '7-21', Qua: '7-21', Qui: '7-21', Sex: '7-22', Sab: '7-22', Dom: '7-21' } }, description: 'Vôlei de praia e futevôlei de areia', icon: 'zap' },
    { id: 3, name: 'Quadra de Tênis', category: 'Esportes', operating_hours: { dias: '7:00 - 20:00', semanal: { Seg: '7-20', Ter: '7-20', Qua: '7-20', Qui: '7-20', Sex: '7-21', Sab: '7-21', Dom: '7-20' } }, description: 'Agendamento através do app', icon: 'zap' },
    { id: 4, name: 'Praça de Jogos', category: 'Lazer', operating_hours: { dias: '7:00 - 21:00', semanal: { Seg: '7-21', Ter: '7-21', Qua: '7-21', Qui: '7-21', Sex: '7-21', Sab: '7-21', Dom: '7-21' } }, description: 'Área de lazer e recreação', icon: 'tent' },
    { id: 5, name: 'Auditório', category: 'Serviços', phone: '(62) 99999-1000', operating_hours: { dias: '8:00 - 21:00', semanal: {} }, description: 'Reserva com antecedência mínima de 7 dias', icon: 'zap' },
    { id: 6, name: 'Capela', category: 'Lazer', operating_hours: { dias: '6:00 - 22:00', semanal: {} }, description: 'Missas aos domingos às 8h e 19h', icon: 'zap' },
    { id: 7, name: 'Banco de Mudas (Viveiro)', category: 'Sustentabilidade', operating_hours: { dias: 'Fechado', semanal: {} }, description: 'Distribuição gratuita de mudas para moradores', icon: 'sprout' },
    // Serviços
    { id: 8, name: 'Batalhão da Polícia Militar', category: 'Segurança', operating_hours: { dias: '24 horas' }, phone: 'Emergências: 190', description: '(62) 99999-0190', icon: 'shield' },
    { id: 9, name: 'Secretaria de Educação', category: 'Educação', operating_hours: { dias: 'Fechado' }, phone: '(62) 99999-1002', description: 'Matrículas e informações escolares', icon: 'school' },
    { id: 10, name: 'Secretaria da Saúde', category: 'Saúde', operating_hours: { dias: 'Fechado' }, phone: '(62) 99999-1003', description: 'Atendimento médico básico e vacinação', icon: 'zap' },
    { id: 11, name: 'Poupa Tempo', category: 'Serviços', operating_hours: { dias: 'Fechado' }, phone: '(62) 99999-1004', description: 'Documentação e serviços públicos', icon: 'zap' },
];


const getIcon = (iconName) => {
    const props = { color: '#64748B', size: 24 };
    switch (iconName) {
        case 'zap': return <Zap {...props} />;
        case 'tent': return <Tent {...props} />;
        case 'sprout': return <Sprout {...props} />;
        case 'shield': return <Shield {...props} />;
        case 'school': return <School {...props} />;
        default: return <MapPin {...props} />;
    }
}

const getStatus = (hours) => {
    if (!hours || !hours.dias || hours.dias === 'Fechado') return { text: 'Fechado', isOpen: false };
    if (hours.dias === '24 horas') return { text: 'Aberto', isOpen: true };
    // Lógica mais complexa de horário comercial pode ser adicionada aqui
    return { text: 'Fechado', isOpen: false };
};

// Card para Áreas Comuns (Grid)
const CommonAreaCard = ({ place }) => {
    const { text: statusText, isOpen } = getStatus(place.operating_hours);
    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                {getIcon(place.icon)}
                <View style={[styles.statusBadge, isOpen ? styles.badgeOpen : styles.badgeClosed]}>
                    <Text style={[styles.statusText, isOpen ? styles.textOpen : styles.textClosed]}>{statusText}</Text>
                </View>
            </View>
            <Text style={styles.cardTitle}>{place.name}</Text>
            <View style={styles.infoRow}>
                <Clock size={16} color="#64748B" />
                <Text style={styles.infoText}>Hoje: {place.operating_hours?.dias || 'Não informado'}</Text>
            </View>
            <Text style={styles.cardDescription}>{place.description}</Text>
            {place.phone && (
                <View style={styles.infoRow}>
                    <Phone size={16} color="#64748B" />
                    <Text style={styles.infoText}>{place.phone}</Text>
                </View>
            )}
        </View>
    );
};

// Card para Serviços (Lista)
const ServiceCard = ({ place }) => {
    const { text: statusText, isOpen } = getStatus(place.operating_hours);
    return (
        <View style={styles.serviceCard}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                 {getIcon(place.icon)}
                <View style={{flex: 1, marginLeft: 12}}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <Text style={styles.cardTitle}>{place.name}</Text>
                        <View style={[styles.statusBadge, isOpen ? styles.badgeOpen : styles.badgeClosed]}>
                            <Text style={[styles.statusText, isOpen ? styles.textOpen : styles.textClosed]}>{statusText}</Text>
                        </View>
                    </View>
                    <View style={styles.infoRow}>
                        <Clock size={16} color="#64748B" />
                        <Text style={styles.infoText}>Hoje: {place.operating_hours?.dias || 'Não informado'}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.serviceDescriptionBox}>
                <Text style={styles.cardDescription}>{place.description}</Text>
                {place.phone && (
                    <View style={[styles.infoRow, {marginTop: 4}]}>
                        <Phone size={16} color="#64748B" />
                        <Text style={styles.infoText}>{place.phone}</Text>
                    </View>
                )}
            </View>
        </View>
    );
}

// Tabela de Programação Semanal
const WeeklyScheduleTable = ({ places }) => {
    const days = ['Local', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
    const placesWithSchedule = places.filter(p => p.operating_hours?.semanal && Object.keys(p.operating_hours.semanal).length > 0);
    
    return (
        <View style={styles.table}>
            {/* Cabeçalho */}
            <View style={styles.tableRow}>
                {days.map(day => <Text key={day} style={[styles.tableCell, styles.tableHeader]}>{day}</Text>)}
            </View>
            {/* Linhas */}
            {placesWithSchedule.map(place => (
                <View key={place.id} style={styles.tableRow}>
                    <Text style={[styles.tableCell, {fontWeight: '500'}]}>{place.name}</Text>
                    {days.slice(1).map(day => (
                        <Text key={`${place.id}-${day}`} style={styles.tableCell}>
                            {place.operating_hours.semanal[day] || '-'}
                        </Text>
                    ))}
                </View>
            ))}
        </View>
    );
};


export default function OperatingHoursScreen({ navigation }) {
    const [places, setPlaces] = useState(MOCK_PLACES); // Usando dados mocados
    const [loading, setLoading] = useState(false); // Desativado para usar mock
    const { selectedLoteamentoId } = useUserStore();

    // Comentei a chamada à API para usar os dados mocados que correspondem ao design.
    // Para usar a API, descomente este bloco e ajuste sua tabela no Supabase.
    /*
    useEffect(() => {
        const fetchHours = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('points_of_interest')
                .select('id, name, category, operating_hours, phone, description, icon')
                .eq('loteamento_id', selectedLoteamentoId);
            
            if (error) console.error("Erro ao buscar horários:", error);
            else setPlaces(data || []);
            setLoading(false);
        };
        fetchHours();
    }, [selectedLoteamentoId]);
    */
    
    const commonAreas = places.filter(p => p.category === 'Esportes' || p.category === 'Lazer' || p.category === 'Sustentabilidade');
    const services = places.filter(p => p.category === 'Serviços' || p.category === 'Saúde' || p.category === 'Educação' || p.category === 'Segurança');
    const today = new Date().toLocaleDateString('pt-BR', { weekday: 'long' });

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.mainHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}><ArrowLeft size={24} color="#333" /></TouchableOpacity>
                <Text style={styles.mainHeaderTitle}>Horários</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.pageHeader}>
                    <Text style={styles.pageTitle}>Horários de Funcionamento</Text>
                    <Text style={styles.pageSubtitle}>Confira os horários de todas as áreas e serviços. Hoje é {today}.</Text>
                </View>
                
                {loading ? (
                    <ActivityIndicator size="large" />
                ) : (
                    <>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Áreas Comuns</Text>
                            <View style={styles.grid}>
                                {commonAreas.map(place => <CommonAreaCard key={place.id} place={place} />)}
                            </View>
                        </View>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Serviços</Text>
                            {services.map(place => <ServiceCard key={place.id} place={place} />)}
                        </View>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Programação Semanal</Text>
                            <WeeklyScheduleTable places={commonAreas} />
                        </View>
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

// --- NOVOS ESTILOS BASEADOS NO CONCEPT ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  mainHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  mainHeaderTitle: { fontSize: 20, fontWeight: 'bold' },
  backButton: { padding: 8 },
  scrollContent: { padding: 16, backgroundColor: '#F8FAFC' },
  pageHeader: { alignItems: 'center', marginBottom: 24 },
  pageTitle: { fontSize: 24, fontWeight: 'bold' },
  pageSubtitle: { color: '#64748B', marginTop: 4 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginHorizontal: -6 },
  card: { backgroundColor: 'white', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#F1F5F9', width: '48%', marginBottom: 12, marginHorizontal: 6 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  cardTitle: { fontSize: 16, fontWeight: '600', flex: 1, marginRight: 8, marginTop: 4, color: '#334155' },
  cardDescription: { fontSize: 13, color: '#64748B', marginTop: 8 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeOpen: { backgroundColor: '#DCFCE7' },
  badgeClosed: { backgroundColor: '#F1F5F9' },
  statusText: { fontSize: 12, fontWeight: 'bold' },
  textOpen: { color: '#166534' },
  textClosed: { color: '#64748B' },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  infoText: { marginLeft: 8, color: '#64748B', fontSize: 14 },
  serviceCard: { backgroundColor: 'white', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#F1F5F9', marginBottom: 12 },
  serviceDescriptionBox: { backgroundColor: '#F8FAFC', padding: 12, borderRadius: 8, marginTop: 12, borderWidth: 1, borderColor: '#F1F5F9' },
  table: { backgroundColor: 'white', borderRadius: 12, borderWidth: 1, borderColor: '#F1F5F9' },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  tableCell: { flex: 1, padding: 10, fontSize: 12, textAlign: 'center' },
  tableHeader: { fontWeight: 'bold', color: '#64748B' },
});