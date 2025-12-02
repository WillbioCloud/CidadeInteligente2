// src/screens/Profile/SettingsScreen.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Switch } from 'react-native';
// Adicione 'FileText' às suas importações de ícones
import { ArrowLeft, Bell, Palette, Shield, ChevronRight, FileText } from '../../components/Icons';

const SettingItem = ({ icon: Icon, title, description, onPress, children }) => (
  <TouchableOpacity style={styles.itemContainer} onPress={onPress} disabled={!onPress}>
    <Icon size={24} color="#4A90E2" style={styles.icon} />
    <View style={styles.textContainer}>
      <Text style={styles.itemTitle}>{title}</Text>
      {description && <Text style={styles.itemDescription}>{description}</Text>}
    </View>
    <View style={styles.actionContainer}>
      {children ? children : onPress && <ChevronRight size={20} color="#CBD5E1" />}
    </View>
  </TouchableOpacity>
);

export default function SettingsScreen({ navigation }) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configurações</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Seções de Notificações e Aparência (sem alterações) */}
        <Text style={styles.sectionTitle}>Notificações</Text>
        <View style={styles.section}>
          <SettingItem icon={Bell} title="Notificações Push">
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
            />
          </SettingItem>
        </View>

        <Text style={styles.sectionTitle}>Aparência</Text>
        <View style={styles.section}>
          <SettingItem icon={Palette} title="Modo Escuro">
             <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
            />
          </SettingItem>
        </View>

        {/* Seção de Conta Atualizada */}
        <Text style={styles.sectionTitle}>Legal & Segurança</Text>
        <View style={styles.section}>
          {/* NOVO ITEM ADICIONADO */}
          <SettingItem
            icon={FileText}
            title="Política de Privacidade"
            onPress={() => navigation.navigate('PrivacyPolicy')}
          />
          <SettingItem
            icon={Shield}
            title="Segurança da Conta"
            onPress={() => navigation.navigate('Placeholder', { screenName: 'Segurança' })}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Estilos (sem alterações)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  backButton: { padding: 8 },
  scrollContainer: { paddingVertical: 16 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#64748B', paddingHorizontal: 24, marginVertical: 8 },
  section: { backgroundColor: 'white', marginHorizontal: 16, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#F1F5F9' },
  itemContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  icon: { marginRight: 16 },
  textContainer: { flex: 1 },
  itemTitle: { fontSize: 16, color: '#1E293B' },
  itemDescription: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  actionContainer: { marginLeft: 'auto' },
});