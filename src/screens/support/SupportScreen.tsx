// src/screens/support/SupportScreen.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { ArrowLeft, MessageSquare, Send } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';
import { useUserStore } from '../../hooks/useUserStore';

export default function SupportScreen({ navigation }) {
  const { userProfile } = useUserStore();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!subject.trim() || !message.trim()) {
      Alert.alert('Campos Vazios', 'Por favor, preencha o assunto e a mensagem.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.from('support_tickets').insert({
      user_id: userProfile?.id,
      user_email: userProfile?.email,
      subject: subject,
      message: message,
    });
    setLoading(false);

    if (error) {
      Alert.alert('Erro', 'Não foi possível enviar sua mensagem. Tente novamente.');
      console.error(error);
    } else {
      Alert.alert(
        'Mensagem Enviada!',
        'Obrigado pelo seu contato. Nossa equipe responderá em breve.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Suporte</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.formContainer}>
        <MessageSquare size={40} color="#339949ff" style={{ alignSelf: 'center', marginBottom: 16 }} />
        <Text style={styles.formTitle}>Fale Conosco</Text>
        <Text style={styles.formSubtitle}>Tem alguma dúvida, sugestão ou problema? Envie uma mensagem para nossa equipe.</Text>

        <TextInput
          style={styles.input}
          placeholder="Assunto"
          value={subject}
          onChangeText={setSubject}
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Digite sua mensagem aqui..."
          value={message}
          onChangeText={setMessage}
          multiline
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Send size={18} color="white" />
              <Text style={styles.submitButtonText}>Enviar Mensagem</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  backButton: { padding: 8 },
  formContainer: { padding: 20 },
  formTitle: { fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
  formSubtitle: { color: '#6B7280', textAlign: 'center', marginTop: 8, marginBottom: 24 },
  input: { backgroundColor: 'white', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 16 },
  textArea: { height: 150, textAlignVertical: 'top' },
  submitButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#339949ff', paddingVertical: 14, borderRadius: 8 },
  submitButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16, marginLeft: 8 },
});
