// Local: src/screens/Health/NutritionCalculatorScreen.tsx (NOVO ARQUIVO)

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TextInput,
  TouchableOpacity, FlatList, ActivityIndicator, Keyboard,
} from 'react-native';
import { Search, Info } from 'lucide-react-native';
import { fetchNutritionInfo, NutritionInfo } from '../../api/healthApi';

// Componente para renderizar cada item da lista de resultados
const NutritionCard = ({ item }: { item: NutritionInfo }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{item.name.toUpperCase()}</Text>
    <Text style={styles.cardServing}>Porção de {item.serving_size_g}g</Text>
    
    <View style={styles.grid}>
      <View style={styles.gridItem}><Text style={styles.gridValue}>{item.calories}</Text><Text style={styles.gridLabel}>Calorias</Text></View>
      <View style={styles.gridItem}><Text style={styles.gridValue}>{item.protein_g}g</Text><Text style={styles.gridLabel}>Proteínas</Text></View>
      <View style={styles.gridItem}><Text style={styles.gridValue}>{item.carbohydrates_total_g}g</Text><Text style={styles.gridLabel}>Carbos</Text></View>
      <View style={styles.gridItem}><Text style={styles.gridValue}>{item.fat_total_g}g</Text><Text style={styles.gridLabel}>Gorduras</Text></View>
    </View>
  </View>
);

export default function NutritionCalculatorScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<NutritionInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    Keyboard.dismiss();
    setIsLoading(true);
    setResults([]);
    setSearched(true);
    const apiResults = await fetchNutritionInfo(query.toLowerCase().trim());
    setResults(apiResults);
    setIsLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Calculadora Nutricional</Text>
        <Text style={styles.subtitle}>Consulte a informação de qualquer alimento</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Ex: 1kg de frango, 2 bananas"
          placeholderTextColor="#999"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Search size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {isLoading && <ActivityIndicator size="large" color="#28a745" style={{ marginTop: 30 }} />}

      {!isLoading && (
        <FlatList
          data={results}
          keyExtractor={(item, index) => `${item.name}-${index}`}
          renderItem={({ item }) => <NutritionCard item={item} />}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            searched ? (
              <View style={styles.emptyContainer}><Text style={styles.emptyText}>Alimento não encontrado.</Text></View>
            ) : (
              <View style={styles.emptyContainer}><Info size={40} color="#6c757d" /><Text style={styles.emptySubtext}>Use a busca acima para consultar os dados nutricionais de um alimento.</Text></View>
            )
          }
        />
      )}
    </SafeAreaView>
  );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#212529' },
  subtitle: { fontSize: 16, color: '#6C757D', marginTop: 4 },
  searchContainer: { flexDirection: 'row', marginHorizontal: 20, marginTop: 20, marginBottom: 10 },
  searchInput: { flex: 1, height: 50, backgroundColor: '#FFF', borderRadius: 10, paddingHorizontal: 15, fontSize: 16, borderWidth: 1, borderColor: '#DEE2E6' },
  searchButton: { width: 50, height: 50, backgroundColor: '#28a745', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginLeft: 10 },
  listContainer: { paddingHorizontal: 20, paddingBottom: 20 },
  card: { backgroundColor: '#FFF', borderRadius: 10, padding: 20, marginBottom: 15, borderWidth: 1, borderColor: '#E0E0E0' },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#212529' },
  cardServing: { fontSize: 14, color: '#6C757D', marginBottom: 15 },
  grid: { flexDirection: 'row', justifyContent: 'space-between' },
  gridItem: { alignItems: 'center', flex: 1 },
  gridValue: { fontSize: 20, fontWeight: 'bold', color: '#28a745' },
  gridLabel: { fontSize: 12, color: '#6C757D', marginTop: 2 },
  emptyContainer: { alignItems: 'center', marginTop: 50, paddingHorizontal: 30 },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#495057' },
  emptySubtext: { fontSize: 15, color: '#6C757D', marginTop: 16, textAlign: 'center' },
});