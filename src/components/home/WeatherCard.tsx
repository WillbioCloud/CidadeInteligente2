// src/components/home/WeatherCard.tsx (VERSÃO DINÂMICA)

import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Sun, Cloud, CloudRain, CloudSnow, Wind, Droplets, CloudLightning, CloudDrizzle } from 'lucide-react-native';

// Função para escolher o ícone certo com base no código da API
const getWeatherIcon = (iconCode: string) => {
    if (!iconCode) return <Sun size={28} color="#F59E0B" />; // Ícone padrão
    const code = iconCode.substring(0, 2); // ex: '01d' -> '01'
    switch (code) {
        case '01': return <Sun size={28} color="#F59E0B" />; // Céu limpo
        case '02': case '03': case '04': return <Cloud size={28} color="#A0AEC0" />; // Nuvens
        case '09': return <CloudDrizzle size={28} color="#4A5568" />; // Garôa
        case '10': return <CloudRain size={28} color="#4A5568" />; // Chuva
        case '11': return <CloudLightning size={28} color="#4A5568" />; // Tempestade
        case '13': return <CloudSnow size={28} color="#A0AEC0" />; // Neve
        default: return <Cloud size={28} color="#A0AEC0" />;
    }
}

export const WeatherCard = ({ weatherData }) => {
  // Se os dados ainda não carregaram, mostra um spinner
  if (!weatherData) {
    return (
      <View style={[styles.card, styles.centered]}>
        <ActivityIndicator color="#4A90E2" />
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        {getWeatherIcon(weatherData.icon)}
        <Text style={styles.tempText}>{weatherData.temp}°C</Text>
      </View>
      <View>
        <Text style={styles.descriptionText}>Sensação {weatherData.feelsLike}°</Text>
        <Text style={styles.cityText}>{weatherData.city}</Text>
      </View>
      <View style={styles.footer}>
        <View style={styles.footerItem}>
          <Droplets size={14} color="#6B7280" />
          <Text style={styles.footerText}>{weatherData.humidity}%</Text>
        </View>
        <View style={styles.footerItem}>
          <Wind size={14} color="#6B7280" />
          <Text style={styles.footerText}>{weatherData.windSpeed} km/h</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { flex: 1, backgroundColor: 'white', borderRadius: 20, padding: 16, height: 140, justifyContent: 'space-between', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  centered: { alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  tempText: { fontSize: 24, fontWeight: 'bold', color: '#1E293B' },
  descriptionText: { fontSize: 14, fontWeight: '500', color: '#475569', textTransform: 'capitalize' },
  cityText: { fontSize: 12, color: '#64748B' },
  footer: { flexDirection: 'row', justifyContent: 'space-between' },
  footerItem: { flexDirection: 'row', alignItems: 'center' },
  footerText: { fontSize: 12, color: '#6B7280', marginLeft: 4, fontWeight: '500' },
});