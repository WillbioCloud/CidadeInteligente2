import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  TouchableOpacity, ActivityIndicator, Linking, Platform, ImageBackground, TextInput, FlatList, Alert, ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { MapPin, Search, Phone, Clock, ExternalLink, ArrowLeft, Store, Heart, Star } from '../../components/Icons';
import { fetchPoisForLoteamento, PointOfInterest } from '../../api/poiApi';
import { ALL_LOTEAMENTOS } from '../../data/loteamentos.data';

const categories = [
    { id: 'all', name: 'Todos' },
    { id: 'Alimentação', name: 'Alimentação' },
    { id: 'Saúde', name: 'Saúde' },
    { id: 'Serviços', name: 'Serviços' },
    { id: 'Lazer', name: 'Lazer' },
];

const PoiCard = ({ poi }: { poi: PointOfInterest }) => {
  const openInMaps = () => {
    const scheme = Platform.OS === 'ios' ? 'maps:0,0?q=' : 'geo:0,0?q=';
    const latLng = `${poi.latitude},${poi.longitude}`;
    const label = poi.name;
    const url = Platform.OS === 'ios' ? `${scheme}${label}@${latLng}` : `${scheme}${latLng}(${label})`;
    Linking.openURL(url).catch(() => Alert.alert('Erro', 'Não foi possível abrir o aplicativo de mapas.'));
  };

  return (
    <View style={styles.poiCard}>
        <View style={styles.poiIconContainer}>
            <Store size={24} color="#4A90E2" />
        </View>
        <View style={styles.poiContent}>
            <View style={styles.poiHeader}>
                <Text style={styles.poiName}>{poi.name}</Text>
            </View>
            <View style={styles.poiDetails}>
                <Text style={styles.poiInfo}><Phone size={14} color="#555" /> {poi.phone}</Text>
                <Text style={styles.poiInfo}><Clock size={14} color="#555" /> {poi.operating_hours}</Text>
            </View>
            <TouchableOpacity style={styles.mapButton} onPress={openInMaps}>
                <ExternalLink size={16} color="#4A90E2" />
                <Text style={styles.mapButtonText}>Ver no mapa</Text>
            </TouchableOpacity>
        </View>
    </View>
  );
};

export default function ExploreMapScreen() {
    const navigation = useNavigation();
    const [pois, setPois] = useState<PointOfInterest[]>([]);
    const [filteredPois, setFilteredPois] = useState<PointOfInterest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    
    // Para este exemplo, o mapa sempre será da Cidade Inteligente.
    // No futuro, você pode passar o loteamentoId pela navegação.
    const loteamentoId = 'cidade_inteligente'; 
    const loteamento = ALL_LOTEAMENTOS.find(l => l.id === loteamentoId);
    const mapImageUrl = 'https://i.imgur.com/2nL4a2b.jpeg'; // Usando uma imagem placeholder

    useEffect(() => {
        fetchPoisForLoteamento(loteamentoId).then(data => {
            setPois(data);
            setFilteredPois(data);
            setIsLoading(false);
        });
    }, []);
    
    useEffect(() => {
        let result = pois;
        if (selectedCategory !== 'all') {
            result = result.filter(p => p.category === selectedCategory);
        }
        if (searchTerm) {
            result = result.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        setFilteredPois(result);
    }, [searchTerm, selectedCategory, pois]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.title}>Explorar Região</Text>
                <View style={{ width: 28 }} />
            </View>

            <FlatList
                data={filteredPois}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => <PoiCard poi={item} />}
                contentContainerStyle={styles.listContainer}
                ListHeaderComponent={
                    <>
                        <ImageBackground source={{uri: mapImageUrl}} style={styles.mapImage} imageStyle={{borderRadius: 16}}>
                            <View style={styles.mapOverlay}>
                                <Text style={styles.mapTitle}>{loteamento?.name}</Text>
                                <Text style={styles.mapSubtitle}>{pois.length} estabelecimentos cadastrados</Text>
                            </View>
                        </ImageBackground>

                        <View style={styles.searchContainer}>
                            <Search size={20} color="#A0AEC0" />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Buscar estabelecimentos..."
                                value={searchTerm}
                                onChangeText={setSearchTerm}
                            />
                        </View>

                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
                          {categories.map(cat => (
                            <TouchableOpacity
                              key={cat.id}
                              onPress={() => setSelectedCategory(cat.id)}
                              style={[styles.categoryButton, selectedCategory === cat.id && styles.categoryActive]}
                            >
                              <Text style={[styles.categoryButtonText, selectedCategory === cat.id && styles.categoryTextActive]}>{cat.name}</Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                        <Text style={styles.sectionTitle}>Estabelecimentos ({filteredPois.length})</Text>
                    </>
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        {isLoading ? <ActivityIndicator size="large" /> : <Text style={styles.emptyText}>Nenhum estabelecimento encontrado.</Text>}
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F5F7' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: Platform.OS === 'android' ? 16 : 0, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  backButton: { padding: 4 },
  title: { flex: 1, textAlign: 'center', fontSize: 20, fontWeight: 'bold' },
  listContainer: { paddingBottom: 20 },
  mapImage: { height: 180, marginHorizontal: 16, borderRadius: 16, justifyContent: 'flex-end', marginTop: 16 },
  mapOverlay: { backgroundColor: 'rgba(0,0,0,0.4)', padding: 16, borderBottomLeftRadius: 16, borderBottomRightRadius: 16 },
  mapTitle: { fontSize: 22, fontWeight: 'bold', color: 'white' },
  mapSubtitle: { fontSize: 14, color: 'white', opacity: 0.9 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 12, marginHorizontal: 16, marginTop: 24, paddingHorizontal: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  searchInput: { flex: 1, height: 48, fontSize: 16, marginLeft: 8 },
  categoryScroll: { paddingHorizontal: 16, paddingVertical: 16 },
  categoryButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: 'white', marginRight: 8, borderWidth: 1, borderColor: '#E5E7EB' },
  categoryActive: { backgroundColor: '#4A90E2', borderColor: '#4A90E2' },
  categoryButtonText: { fontWeight: '600', color: '#4B5563' },
  categoryTextActive: { color: 'white' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginHorizontal: 16, marginBottom: 8 },
  poiCard: { backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 12, marginHorizontal: 16, elevation: 2, flexDirection: 'row', alignItems: 'center' },
  poiIconContainer: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#EBF2FC', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  poiContent: { flex: 1 },
  poiHeader: { flexDirection: 'row', alignItems: 'center' },
  poiName: { fontSize: 16, fontWeight: '600' },
  poiDetails: { marginVertical: 8 },
  poiInfo: { fontSize: 14, color: '#555', marginBottom: 4, flexDirection: 'row', alignItems: 'center' },
  mapButton: { backgroundColor: '#EBF2FC', padding: 10, borderRadius: 8, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginTop: 8 },
  mapButtonText: { color: '#4A90E2', fontWeight: 'bold', marginLeft: 8 },
  emptyContainer: { alignItems: 'center', marginTop: 30 },
  emptyText: { fontSize: 16, color: '#6B7280' },
});