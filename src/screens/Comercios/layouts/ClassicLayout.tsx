// src/screens/Comercios/layouts/ClassicLayout.tsx (VERSÃO COM GALERIA EXPANSÍVEL)

import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity, Linking } from 'react-native';
import { ArrowLeft, Phone, Instagram, Star, MapPin, Clock, Info } from 'lucide-react-native';
import ImageView from "react-native-image-viewing"; // 1. Importa a biblioteca

const InfoRow = ({ icon: Icon, text }) => (
  <View style={styles.infoRow}>
    <Icon size={18} color="#4B5563" />
    <Text style={styles.infoText}>{text}</Text>
  </View>
);

export default function ClassicLayout({ commerce, navigation }) {
  // 2. Estados para controlar o modal da galeria
  const [isGalleryVisible, setIsGalleryVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const logoUrl = commerce.logo || 'https://placehold.co/200x200/339949/FFFFFF?text=Logo';
  const galleryImages = commerce.images.map(url => ({ uri: url }));

  const openGallery = (index: number) => {
    setCurrentImageIndex(index);
    setIsGalleryVisible(true);
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <ScrollView>
          <View style={styles.header}>
            <Image source={{ uri: logoUrl }} style={styles.logo} />
            <Text style={styles.name}>{commerce.name}</Text>
            <Text style={styles.category}>{commerce.category}</Text>
          </View>

          <View style={styles.actionsContainer}>
             <TouchableOpacity style={styles.button} onPress={() => Linking.openURL(`tel:${commerce.contact.whatsapp}`)}>
              <Phone size={20} color="#3B82F6" />
              <Text style={styles.buttonText}>Ligar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => Linking.openURL(`https://instagram.com/${commerce.contact.instagram.replace('@', '')}`)}>
              <Instagram size={20} color="#C13584" />
              <Text style={styles.buttonText}>Instagram</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.content}>
              <View style={styles.section}>
                  <InfoRow icon={Info} text={commerce.description} />
                  <InfoRow icon={MapPin} text={`${commerce.loteamento_id.replace('_', ' ')}, ${commerce.city}`} />
                  <InfoRow icon={Clock} text={commerce.openingHours} />
              </View>

              {commerce.services && commerce.services.length > 0 &&
                  <View style={styles.section}>
                      <Text style={styles.sectionTitle}>Principais Serviços</Text>
                      {commerce.services.map((service, index) => (
                          <Text key={index} style={styles.serviceItem}>• {service}</Text>
                      ))}
                  </View>
              }

              {commerce.images && commerce.images.length > 0 &&
                  <View style={styles.section}>
                      <Text style={styles.sectionTitle}>Galeria</Text>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                          {commerce.images.map((img, index) => (
                            // 3. Cada imagem agora é clicável
                            <TouchableOpacity key={index} onPress={() => openGallery(index)}>
                                <Image source={{uri: img}} style={styles.galleryImage} />
                            </TouchableOpacity>
                          ))}
                      </ScrollView>
                  </View>
              }
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
  container: { flex: 1, backgroundColor: '#F8F9FA', paddingBottom: 100, marginBottom: 75 },
  backButton: { position: 'absolute', top: 50, left: 16, zIndex: 10 },
  header: { alignItems: 'center', padding: 24, backgroundColor: 'white' },
  logo: { width: 120, height: 120, borderRadius: 60, marginBottom: 16, borderWidth: 4, borderColor: '#E5E7EB' },
  name: { fontSize: 26, fontWeight: 'bold' },
  category: { fontSize: 16, color: '#6B7280', marginTop: 4 },
  actionsContainer: { flexDirection: 'row', justifyContent: 'space-around', padding: 16, backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  button: { alignItems: 'center' },
  buttonText: { color: '#374151', marginTop: 4 },
  content: { padding: 16 },
  section: { backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  infoText: { marginLeft: 12, fontSize: 16, color: '#374151', flexShrink: 1 },
  serviceItem: { fontSize: 16, color: '#374151', marginBottom: 4 },
  galleryImage: { width: 150, height: 150, borderRadius: 8, marginRight: 8, backgroundColor: '#E5E7EB' },
  footer: { height: 80, width: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)' },
  footerText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});