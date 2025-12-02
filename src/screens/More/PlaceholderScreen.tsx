import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PlaceholderScreen({ route, navigation }) {
  // Pega o nome da tela dos parâmetros ou usa um nome padrão
  const { screenName } = route.params || { screenName: 'Tela' };
  
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
         <Ionicons name="arrow-back" size={24} color="#3B82F6" />
         <Text style={styles.backButtonText}>Voltar</Text>
      </TouchableOpacity>
      <View style={styles.content}>
        <Text style={styles.text}>{screenName}</Text>
        <Text style={styles.subtext}>Em Construção</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8F9FA',
  },
  content: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  text: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#343a40',
  },
  subtext: { 
    fontSize: 16, 
    color: '#6B7280', 
    marginTop: 8,
  },
  backButton: { 
    position: 'absolute', 
    top: 55, // Ajustado para SafeAreaView
    left: 20, 
    flexDirection: 'row', 
    alignItems: 'center',
    zIndex: 10,
  },
  backButtonText: { 
    color: '#3B82F6', 
    fontSize: 16, 
    marginLeft: 5,
    fontWeight: '600',
  },
});