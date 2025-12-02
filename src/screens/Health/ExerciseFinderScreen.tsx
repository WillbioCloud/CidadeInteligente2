// Local: src/screens/Health/ExerciseFinderScreen.tsx (NOVO ARQUIVO)

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TextInput,
  TouchableOpacity, FlatList, ActivityIndicator, Keyboard,
} from 'react-native';
import { Search } from 'lucide-react-native';
import { fetchExercisesByMuscle, Exercise } from '../../api/healthApi';

// Componente para renderizar cada item da lista de exercícios
const ExerciseCard = ({ item }: { item: Exercise }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{item.name}</Text>
    <Text style={styles.cardMuscle}>{item.muscle.toUpperCase()}</Text>
    <Text style={styles.cardInstructions}>{item.instructions}</Text>
  </View>
);

export default function ExerciseFinderScreen() {
  const [muscle, setMuscle] = useState(''); // State para o texto de busca
  const [exercises, setExercises] = useState<Exercise[]>([]); // State para guardar os resultados
  const [isLoading, setIsLoading] = useState(false); // State para mostrar o loading
  const [searched, setSearched] = useState(false); // State para saber se uma busca já foi feita

  // Função chamada quando o botão de busca é pressionado
  const handleSearch = async () => {
    if (!muscle.trim()) return; // Não faz nada se a busca for vazia

    Keyboard.dismiss(); // Esconde o teclado
    setIsLoading(true);
    setExercises([]);
    setSearched(true);

    const results = await fetchExercisesByMuscle(muscle.toLowerCase().trim());
    setExercises(results);
    setIsLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Buscar Exercícios</Text>
        <Text style={styles.subtitle}>Encontre exercícios por grupo muscular</Text>
      </View>

      {/* Container da Busca */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Digite um grupo muscular (ex: biceps, chest)"
          placeholderTextColor="#999"
          value={muscle}
          onChangeText={setMuscle}
          onSubmitEditing={handleSearch} // Permite buscar com o "Enter" do teclado
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Search size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Indicador de Loading */}
      {isLoading && <ActivityIndicator size="large" color="#007BFF" style={{ marginTop: 30 }} />}

      {/* Lista de Resultados */}
      {!isLoading && (
        <FlatList
          data={exercises}
          keyExtractor={(item, index) => `${item.name}-${index}`}
          renderItem={({ item }) => <ExerciseCard item={item} />}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            // Mostra uma mensagem se não houver resultados
            searched ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Nenhum exercício encontrado.</Text>
                <Text style={styles.emptySubtext}>Tente outro grupo muscular ou verifique a ortografia.</Text>
              </View>
            ) : null
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
  searchContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#DEE2E6',
  },
  searchButton: {
    width: 50,
    height: 50,
    backgroundColor: '#007BFF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  listContainer: { paddingHorizontal: 20, paddingBottom: 20 },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#212529' },
  cardMuscle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007BFF',
    marginTop: 4,
    marginBottom: 10,
  },
  cardInstructions: { fontSize: 14, color: '#495057', lineHeight: 20 },
  emptyContainer: { alignItems: 'center', marginTop: 50, padding: 20 },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#495057' },
  emptySubtext: { fontSize: 14, color: '#6C757D', marginTop: 8, textAlign: 'center' },
});