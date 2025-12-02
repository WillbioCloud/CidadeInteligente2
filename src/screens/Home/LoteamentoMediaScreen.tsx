// screens/Home/LoteamentoMediaScreen.tsx (VERSÃO FINAL COM BOTÃO FLUTUANTE)

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image, ActivityIndicator, Dimensions, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { ArrowLeft, CheckCircle } from 'lucide-react-native';

// --- SEU BANCO DE DADOS MOCKADO (INTACTO) ---
const MOCK_LOTEAMENTO_DATA = {
  cidade_inteligente: {
    main_video_url: 'https://videos.pexels.com/video-files/5903279/5903279-hd_1280_720_24fps.mp4',
    media: [
      { image_url: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg', caption: 'Interiores modernos e conectados.' },
      { image_url: 'https://images.pexels.com/photos/259950/pexels-photo-259950.jpeg', caption: 'Tecnologia de segurança na portaria.' },
      { image_url: 'https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg', caption: 'Arquitetura que integra tecnologia e design.' },
    ],
    features: ['Pronto para Automação', 'Internet Fibra Óptica', 'Monitoramento por Câmeras', 'Coleta Seletiva Inteligente', 'Iluminação LED', 'Pontos de Recarga para Carros Elétricos']
  },
  cidade_universitaria: {
    main_video_url: 'https://videos.pexels.com/video-files/8067980/8067980-hd_1280_720_30fps.mp4',
    media: [
      { image_url: 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg', caption: 'Proximidade com campus universitário.' },
      { image_url: 'https://images.pexels.com/photos/1205651/pexels-photo-1205651.jpeg', caption: 'Espaços de estudo e coworking.' },
      { image_url: 'https://images.pexels.com/photos/267507/pexels-photo-267507.jpeg', caption: 'Áreas de convivência para estudantes.' },
    ],
    features: ['Próximo a Faculdades', 'Linhas de Transporte Público', 'Coworking & Salas de Estudo', 'Ciclovias', 'Comércio Local Forte', 'Segurança Noturna']
  },
  cidade_verde: {
    main_video_url: 'https://youtu.be/J_7xrg7auV8?si=5c2UExV8vA4kEzI8',
    media: [
      { image_url: 'https://images.pexels.com/photos/1578750/pexels-photo-1578750.jpeg', caption: 'Residências em harmonia com a natureza.' },
      { image_url: 'https://images.pexels.com/photos/142497/pexels-photo-142497.jpeg', caption: 'Trilhas ecológicas para caminhadas.' },
      { image_url: 'https://images.pexels.com/photos/450597/pexels-photo-450597.jpeg', caption: 'Uso de energia solar nas áreas comuns.' },
    ],
    features: ['Reserva Florestal', 'Reaproveitamento de Água', 'Horta Comunitária', 'Trilhas para Caminhada', 'Energia Solar', 'Parque Botânico']
  },
  cidade_das_flores: {
    main_video_url: 'https://videos.pexels.com/video-files/4904737/4904737-hd_1280_720_25fps.mp4',
    media: [
      { image_url: 'https://images.pexels.com/photos/103596/pexels-photo-103596.jpeg', caption: 'Jardins e praças temáticas floridas.' },
      { image_url: 'https://images.pexels.com/photos/1546892/pexels-photo-1546892.jpeg', caption: 'Espaços de lazer com pergolados.' },
      { image_url: 'https://images.pexels.com/photos/161853/flowers-flower-meadow-colorful-161853.jpeg', caption: 'Canteiros floridos por todo o loteamento.' },
    ],
    features: ['Paisagismo Exuberante', 'Praças Temáticas', 'Clube com Piscinas', 'Playground Infantil', 'Salão de Festas', 'Bosque das Flores']
  },
  setor_lago_sul: {
    main_video_url: 'https://videos.pexels.com/video-files/854065/854065-hd_1280_720_25fps.mp4',
    media: [
      { image_url: 'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg', caption: 'Vista permanente para o lago.' },
      { image_url: 'https://images.pexels.com/photos/164336/pexels-photo-164336.jpeg', caption: 'Acesso privativo ao clube náutico.' },
      { image_url: 'https://images.pexels.com/photos/247599/pexels-photo-247599.jpeg', caption: 'Píer para embarcações e esportes aquáticos.' },
    ],
    features: ['Acesso ao Lago', 'Clube Náutico', 'Pista de Cooper na Orla', 'Restaurante com Vista', 'Segurança 24h', 'Garagem para Barcos']
  },
  residencial_morada_nobre: {
    main_video_url: 'https://videos.pexels.com/video-files/7578543/7578543-hd_1280_720_25fps.mp4',
    media: [
      { image_url: 'https://images.pexels.com/photos/221024/pexels-photo-221024.jpeg', caption: 'Portaria imponente com segurança 24h.' },
      { image_url: 'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg', caption: 'Salão de festas para eventos exclusivos.' },
      { image_url: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg', caption: 'Casas de alto padrão e design moderno.' },
    ],
    features: ['Lotes a partir de 500m²', 'Portaria Blindada', 'Área Gourmet', 'Controle de Acesso', 'Alto Padrão Construtivo', 'Exclusividade']
  },
  caminho_do_lago: {
    main_video_url: 'https://videos.pexels.com/video-files/4434238/4434238-hd_1280_720_25fps.mp4',
    media: [
      { image_url: 'https://images.pexels.com/photos/235615/pexels-photo-235615.jpeg', caption: 'Caminhos arborizados e tranquilos.' },
      { image_url: 'https://images.pexels.com/photos/931018/pexels-photo-931018.jpeg', caption: 'Espaços para piquenique e lazer ao ar livre.' },
      { image_url: 'https://images.pexels.com/photos/33045/milky-way-small-magellanic-cloud-dwarf-galaxy-galaxy.jpg', caption: 'Céu estrelado longe da poluição luminosa.' },
    ],
    features: ['Preservação Ambiental', 'Praças Esportivas', 'Soluções Ecológicas', 'Acesso Facilitado', 'Terrenos Amplos', 'Baixa Densidade']
  },
  parque_flamboyant: {
    main_video_url: 'https://videos.pexels.com/video-files/5586617/5586617-hd_1280_720_25fps.mp4',
    media: [
      { image_url: 'https://images.pexels.com/photos/158028/bellingrath-gardens-alabama-landscape-scenic-158028.jpeg', caption: 'Parque central com paisagismo premiado.' },
      { image_url: 'https://images.pexels.com/photos/417458/pexels-photo-417458.jpeg', caption: 'Quadras de areia para vôlei e futevôlei.' },
      { image_url: 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg', caption: 'Quiosques com churrasqueira para confraternizações.' },
    ],
    features: ['Parque Central Privativo', 'Ciclovia Integrada', 'Quadras Poliesportivas', 'Espaço Pet', 'Playground Moderno', 'Área de Convivência']
  },
};


interface LoteamentoMediaData {
  main_video_url: string;
  media: { image_url: string; caption: string }[];
  features: string[];
}

export default function LoteamentoMediaScreen({ route, navigation }) {
  const { loteamento } = route.params;
  const [mediaData, setMediaData] = useState<LoteamentoMediaData | null>(null);

  // --- LÓGICA DO BOTÃO ADICIONADA ---
  const hasAvailableLots = loteamento?.available_lots > 0;

  const handleAcquirePress = () => {
    if (!hasAvailableLots) {
      Alert.alert("Lotes Esgotados", "No momento, não há lotes disponíveis para este empreendimento.");
    } else {
      Alert.alert("Adquirir Lote", `Entrando em contato sobre o ${loteamento.name}.`);
    }
  };
  // --- FIM DA LÓGICA ---

  useEffect(() => {
    const data = MOCK_LOTEAMENTO_DATA[loteamento.id];
    setMediaData(data);
  }, [loteamento]);

  if (!mediaData) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator style={{ marginTop: 50 }} size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Container principal que permite o botão flutuar */}
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ArrowLeft size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{loteamento.name}</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
          {/* Vídeo Principal */}
          <View style={styles.videoContainer}>
            <WebView
              style={{ flex: 1, backgroundColor: '#000' }}
              javaScriptEnabled={true}
              source={{ uri: mediaData.main_video_url }}
            />
          </View>

          {/* Galeria de Imagens */}
          <Text style={styles.sectionTitle}>Galeria de Imagens</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carouselContainer}>
            {mediaData.media.map((item, index) => (
              <View key={index} style={styles.imageCard}>
                <Image source={{ uri: item.image_url }} style={styles.galleryImage} />
                <Text style={styles.caption}>{item.caption}</Text>
              </View>
            ))}
          </ScrollView>
          
          {/* Seção de Características */}
          <Text style={styles.sectionTitle}>Características</Text>
          <View style={styles.featuresWrapper}>
              {mediaData.features.map((feature, index) => (
                  <View key={index} style={styles.featureTag}>
                      <CheckCircle size={16} color="#16A34A" />
                      <Text style={styles.featureText}>{feature}</Text>
                  </View>
              ))}
          </View>
        </ScrollView>
        
        {/* --- BOTÃO FLUTUANTE ADICIONADO --- */}
        <View style={styles.floatingButtonContainer}>
            <TouchableOpacity
                style={[styles.acquireButton, !hasAvailableLots && styles.acquireButtonDisabled]}
                onPress={handleAcquirePress}
                disabled={!hasAvailableLots}
            >
                <Text style={styles.acquireButtonText}>
                    {hasAvailableLots ? 'Quero o Meu' : 'Esgotado'}
                </Text>
            </TouchableOpacity>
        </View>
        {/* --- FIM DO BOTÃO --- */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  backButton: { padding: 8 },
  videoContainer: {
    height: Dimensions.get('window').width * (9 / 16),
    backgroundColor: '#000',
    borderRadius: 16,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', padding: 16, paddingTop: 24, color: '#1F2937' },
  carouselContainer: { paddingLeft: 16 },
  imageCard: { width: 280, marginRight: 16, backgroundColor: 'white', borderRadius: 12, overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  galleryImage: { width: '100%', height: 180 },
  caption: { padding: 12, fontSize: 14, color: '#4B5563' },
  featuresWrapper: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 12 },
  featureTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB' },
  featureText: { marginLeft: 8, fontSize: 14, fontWeight: '500', color: '#374151' },
  // --- ESTILOS PARA O BOTÃO FLUTUANTE ---
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 32,
    backgroundColor: 'transparent',
  },
  acquireButton: {
    backgroundColor: '#22C55E',
    paddingVertical: 15,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#16A34A',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    bottom: 38,
    marginHorizontal: 107,
  },
  acquireButtonDisabled: { 
    backgroundColor: '#9CA3AF' 
  },
  acquireButtonText: { 
    color: 'white', 
    fontSize: 16,
    fontWeight: 'bold' 
  },
});