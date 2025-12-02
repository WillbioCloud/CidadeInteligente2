// src/components/InstagramFeed.tsx

import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Linking } from 'react-native';
import { designSystem } from '../styles/designSystem';
import { ArrowRight } from 'lucide-react-native';

// Dados mockados para simular os posts do Instagram
const MOCK_POSTS = [
  { id: '1', imageUrl: 'https://via.placeholder.com/300x300.png/1F2937/FFFFFF?text=Lançamento', caption: 'Conheça o novo loteamento Paraíso das Águas! Condições imperdíveis de lançamento.' },
  { id: '2', imageUrl: 'https://via.placeholder.com/300x300.png/3B82F6/FFFFFF?text=Evento', caption: 'Neste sábado teremos um café especial para os nossos clientes e amigos. Venha nos visitar!' },
  { id: '3', imageUrl: 'https://via.placeholder.com/300x300.png/10B981/FFFFFF?text=Dica', caption: 'Dica da semana: 3 plantas que vão valorizar a fachada do seu novo lote.' },
];

const InstagramPostCard = ({ item }) => {
  const openInstagram = () => {
    Linking.openURL('https://www.instagram.com/fbzempreendimentos/');
  };

  return (
    <TouchableOpacity style={styles.postCard} onPress={openInstagram} activeOpacity={0.8}>
      <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
      <Text style={styles.postCaption} numberOfLines={3}>{item.caption}</Text>
    </TouchableOpacity>
  );
};

export default function InstagramFeed() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={designSystem.STYLES.text_h2}>Últimas do Instagram</Text>
        <TouchableOpacity style={styles.viewMoreButton} onPress={() => Linking.openURL('https://www.instagram.com/fbzempreendimentos/')}>
          <Text style={styles.viewMoreText}>Ver todos</Text>
          <ArrowRight size={16} color={designSystem.COLORS.blue} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={MOCK_POSTS}
        renderItem={({ item }) => <InstagramPostCard item={item} />}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: designSystem.SPACING.m }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: designSystem.SPACING.l,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: designSystem.SPACING.m,
    marginBottom: designSystem.SPACING.m,
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewMoreText: {
    fontFamily: designSystem.FONT_FAMILY.semiBold,
    color: designSystem.COLORS.blue,
    marginRight: designSystem.SPACING.xs,
  },
  postCard: {
    ...designSystem.STYLES.card,
    width: 220,
    marginRight: designSystem.SPACING.m,
    padding: 0, // Removido o padding para a imagem preencher
    overflow: 'hidden', // Garante que a imagem não vaze das bordas arredondadas
  },
  postImage: {
    width: '100%',
    height: 180,
    backgroundColor: designSystem.COLORS.gray_extralight,
  },
  postCaption: {
    fontFamily: designSystem.FONT_FAMILY.regular,
    fontSize: 14,
    padding: designSystem.SPACING.m,
    color: designSystem.COLORS.gray_dark,
  },
});