import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import {
  View, Text, StyleSheet, Modal, TouchableOpacity,
  FlatList, Dimensions, ImageBackground, TextInput, SafeAreaView
} from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';
import { Ionicons } from '@expo/vector-icons';
import { fetchMapLocations, MapLocation, MAP_IMAGE_WIDTH, MAP_IMAGE_HEIGHT } from '../api/mapApi';

// Componente do Card de Localização (igual ao seu MapTabScreen)
const LocationCard = memo(({ item, isFocused, onSelect }) => (
    <TouchableOpacity onPress={() => onSelect(item)} style={[styles.cardWrapper, isFocused && styles.selectedCard]}>
        <View style={{padding: 15}}><Text>{item.name}</Text></View>
    </TouchableOpacity>
));

interface MapModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function MapModal({ isVisible, onClose }: MapModalProps) {
  // Toda a lógica do seu MapTabScreen.tsx original vem para cá
  const [locations, setLocations] = useState<MapLocation[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<MapLocation[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [focusedLocation, setFocusedLocation] = useState<MapLocation | null>(null);

  const flatListRef = useRef<FlatList>(null);
  const zoomRef = useRef<ImageZoom>(null);

  useEffect(() => {
    fetchMapLocations().then(data => {
      setLocations(data);
      setFilteredLocations(data);
    });
  }, []);

  useEffect(() => {
    let results = locations;
    if (selectedCategory !== 'all') {
      results = results.filter(loc => loc.category === selectedCategory);
    }
    if (searchTerm) {
      results = results.filter(loc => loc.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    setFilteredLocations(results);
  }, [selectedCategory, searchTerm, locations]);
  
  const handleSelectLocation = useCallback((location: MapLocation | null) => {
    if (location && location.id === focusedLocation?.id) {
        zoomRef.current?.reset();
        setFocusedLocation(null);
        return;
    }
    setFocusedLocation(location);
    if(location) {
        zoomRef.current?.centerOn({ x: location.x, y: location.y, scale: 1.5, duration: 500 });
        const index = filteredLocations.findIndex(l => l.id === location.id);
        if(index > -1) flatListRef.current?.scrollToIndex({ index, viewPosition: 0.5 });
    }
  }, [filteredLocations, focusedLocation]);

  return (
    <Modal animationType="slide" visible={isVisible} onRequestClose={onClose}>
        <SafeAreaView style={styles.modalContainer}>
            <View style={styles.header}>
                <Text style={styles.title}>Mapa & Comércios</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}><Ionicons name="close" size={28} color="#333" /></TouchableOpacity>
            </View>
            
            <View style={styles.mapView}>
                <ImageZoom
                    ref={zoomRef}
                    cropWidth={Dimensions.get('window').width}
                    cropHeight={Dimensions.get('window').height * 0.4}
                    imageWidth={MAP_IMAGE_WIDTH}
                    imageHeight={MAP_IMAGE_HEIGHT}
                    onMove={() => setFocusedLocation(null)}
                >
                    {/* ===== A CORREÇÃO ESTÁ AQUI ===== */}
                    <ImageBackground source={require('../assets/compressed_mapa_ficticio.webp')} style={{ width: MAP_IMAGE_WIDTH, height: MAP_IMAGE_HEIGHT }}>
                        {(filteredLocations || []).map(location => (
                            <TouchableOpacity key={location.id} style={[styles.markerContainer, { left: location.x, top: location.y }]} onPress={() => handleSelectLocation(location)}>
                                <Ionicons name="location" size={40} color={focusedLocation?.id === location.id ? '#FF5722' : '#3B82F6'} />
                            </TouchableOpacity>
                        ))}
                    </ImageBackground>
                </ImageZoom>
            </View>

            <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={20} color="#9E9E9E" />
                <TextInput style={styles.searchInput} placeholder="Buscar estabelecimentos..." value={searchTerm} onChangeText={setSearchTerm}/>
            </View>

            <FlatList
                ref={flatListRef}
                data={filteredLocations}
                keyExtractor={item => item.id}
                renderItem={({item}) => <LocationCard item={item} isFocused={focusedLocation?.id === item.id} onSelect={handleSelectLocation} />}
                contentContainerStyle={{ paddingHorizontal: 16 }}
                ListHeaderComponent={<Text style={styles.listTitle}>Estabelecimentos ({filteredLocations.length})</Text>}
            />
        </SafeAreaView>
    </Modal>
  );
}

// Estilos
const styles = StyleSheet.create({
    modalContainer: { flex: 1, backgroundColor: '#F9F9FB' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#EEE' },
    title: { fontSize: 22, fontWeight: 'bold' },
    closeButton: { padding: 4 },
    mapView: { height: Dimensions.get('window').height * 0.4, backgroundColor: '#E0E0E0' },
    markerContainer: { position: 'absolute', transform: [{translateX: -20}, {translateY: -40}] },
    searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', margin: 16, paddingHorizontal: 15, borderRadius: 12, borderWidth: 1, borderColor: '#EEEEEE', height: 50 },
    searchInput: { flex: 1, fontSize: 16, marginLeft: 10 },
    listTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    cardWrapper: { borderWidth: 2, borderColor: 'transparent', borderRadius: 18, marginBottom: 12, backgroundColor: '#FFF' },
    selectedCard: { borderColor: '#3B82F6' },
});