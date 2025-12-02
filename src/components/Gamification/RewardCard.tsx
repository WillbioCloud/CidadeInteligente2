// src/components/gamificacao/RewardCard.tsx

import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

interface RewardCardProps {
  title: string;
  description: string;
  image: string;
  points: number;
}

export const RewardCard = ({ title, description, image, points }: RewardCardProps) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Resgatar ({points} pts)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { width: 220, backgroundColor: 'white', borderRadius: 12, marginRight: 16, elevation: 2, overflow: 'hidden' },
  image: { width: '100%', height: 100 },
  content: { padding: 12 },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  description: { color: 'gray', marginBottom: 12, fontSize: 12 },
  button: { backgroundColor: '#339949ff', paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold' },
});