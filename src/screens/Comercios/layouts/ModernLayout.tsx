// src/screens/Comercios/layouts/ModernLayout.tsx (VERSÃO COM GALERIA EXPANSÍVEL)

import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity, Linking } from 'react-native';
import { ArrowLeft, Phone, Instagram, Star, MapPin, Clock, Heart, Share2 } from 'lucide-react-native';
import ImageView from "react-native-image-viewing"; // 1. Importa a biblioteca

const InfoRow = ({ icon: Icon, text }) => (
  <View style={styles.infoRow}>
    <Icon size={20} color="#339949ff" />
    <Text style={styles.infoText}>{text}</Text>
  </View>
);

export default function ModernLayout({ commerce, navigation }) {
  // 2. Estados para controlar o modal da galeria
  const [isGalleryVisible, setIsGalleryVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Formata as imagens para o formato que a biblioteca espera
  const galleryImages = commerce.images.map(url => ({ uri: url }));

  const openGallery = (index: number) => {
    setCurrentImageIndex(index);
    setIsGalleryVisible(true);
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.headerImageContainer}>
            <Image source={{ uri: commerce.coverImage }} style={styles.headerImage} />
            <View style={styles.headerOverlay}>
              <View style={styles.headerControls}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                  <ArrowLeft size={24} color="#fff" />
                </TouchableOpacity>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity style={styles.iconButton}><Heart size={24} color="#fff" /></TouchableOpacity>
                  <TouchableOpacity style={styles.iconButton}><Share2 size={24} color="#fff" /></TouchableOpacity>
                </View>
              </View>
              <View style={styles.titleBox}>
                <Text style={styles.name}>{commerce.name}</Text>
                <View style={styles.titleInfoRow}>
                  <Star size={16} color="#F59E0B" />
                  <Text style={styles.rating}>{commerce.rating}</Text>
                  <View style={styles.categoryBadge}><Text style={styles.categoryBadgeText}>{commerce.category}</Text></View>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.buttonPrimary}
              onPress={() => Linking.openURL(`tel:${commerce.contact.whatsapp}`)}
            >
              <Phone size={16} color="white" />
              <Text style={styles.buttonPrimaryText}>Ligar Agora</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonSecondary}
              onPress={() => Linking.openURL(`https://instagram.com/${commerce.contact.instagram.replace('@', '')}`)}
            >
              <Instagram size={16} color="#374151" />
              <Text style={styles.buttonSecondaryText}>Instagram</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            {commerce.images && commerce.images.length > 0 &&
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Galeria</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {commerce.images.map((imgUrl, index) => (
                    // 3. Cada imagem agora é clicável
                    <TouchableOpacity key={index} onPress={() => openGallery(index)}>
                      <Image source={{ uri: imgUrl }} style={styles.galleryImage} />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            }

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Informações</Text>
              <InfoRow icon={MapPin} text={`${commerce.loteamento_id.replace('_', ' ')}, ${commerce.city}`} />
              <InfoRow icon={Clock} text={commerce.openingHours} />
              <InfoRow icon={Phone} text={commerce.contact.whatsapp} />
            </View>

            {commerce.services && commerce.services.length > 0 &&
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Serviços</Text>
                <View style={styles.servicesContainer}>
                  {commerce.services.map((service, index) => (
                    <View key={index} style={styles.serviceTag}><Text style={styles.serviceTagText}>{service}</Text></View>
                  ))}
                </View>
              </View>
            }
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sobre</Text>
              <Text style={styles.description}>{commerce.description}</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* 4. O componente do visualizador de imagens */}
      <ImageView
        images={galleryImages}
        imageIndex={currentImageIndex}
        visible={isGalleryVisible}
        onRequestClose={() => setIsGalleryVisible(false)}
        FooterComponent={({ imageIndex }) => (
            <View style={styles.footer}>
                <Text style={styles.footerText}>{`${imageIndex + 1} / ${galleryImages.length}`}</Text>
            </View>
        )}
      />
    </>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', paddingBottom: 60, marginBottom: 75 },
  headerImageContainer: { height: 250, backgroundColor: '#E5E7EB' },
  headerImage: { width: '100%', height: '100%' },
  headerOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'space-between' },
  headerControls: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 50 },
  iconButton: { padding: 10, bottom: 30, paddingBottom: 20 },
  titleBox: { backgroundColor: 'rgba(0,0,0,0.5)', padding: 16, margin: 16, borderRadius: 12 },
  name: { fontSize: 28, fontWeight: 'bold', color: 'white' },
  titleInfoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  rating: { color: 'white', fontWeight: 'bold', marginLeft: 4 },
  categoryBadge: { backgroundColor: 'hsla(0, 0%, 100%, 0.20)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginLeft: 8 },
  categoryBadgeText: { color: 'white', fontSize: 12 },
  actionsContainer: { flexDirection: 'row', padding: 16, gap: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  buttonPrimary: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#3B82F6', padding: 12, borderRadius: 8 },
  buttonPrimaryText: { color: 'white', fontWeight: 'bold', marginLeft: 8 },
  buttonSecondary: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F3F4F6', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB' },
  buttonSecondaryText: { color: '#374151', fontWeight: 'bold', marginLeft: 8 },
  content: { paddingVertical: 16, paddingBottom: 100 },
  section: { marginBottom: 16, padding: 18, backgroundColor: '#F9FAFB', borderRadius: 10, borderWidth: 1, borderColor: '#F3F4F6', marginHorizontal: 16, paddingBottom: 30 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#1F2937', marginBottom: 12 },
  description: { fontSize: 16, lineHeight: 24, color: '#374151' },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 4 },
  infoText: { marginLeft: 12, fontSize: 16, color: '#4B5563' },
  servicesContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'flex-start' },
  serviceTag: { backgroundColor: '#E0F2FE', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  serviceTagText: { color: '#0284C7', fontWeight: '500' },
  galleryImage: { width: 120, height: 120, borderRadius: 12, backgroundColor: '#E5E7EB', marginRight: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  footer: { height: 80, width: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)' },
  footerText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});