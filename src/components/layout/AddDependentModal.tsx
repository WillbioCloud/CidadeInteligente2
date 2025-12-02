import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

// Dados que o formulário precisa coletar
interface NewDependentData {
  fullName: string;
  email: string;
  relationship: string;
  // A senha será gerenciada aqui, mas não passada para outros componentes
}

interface AddDependentModalProps {
  isVisible: boolean;
  onClose: () => void;
  onRegister: (data: NewDependentData) => void;
}

export default function AddDependentModal({ isVisible, onClose, onRegister }: AddDependentModalProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [relationship, setRelationship] = useState('');
  const [password, setPassword] = useState('');

  const handleRegisterPress = () => {
    if (!fullName || !email || !password || !relationship) {
      Toast.show({ type: 'error', text1: 'Campos Incompletos', text2: 'Por favor, preencha todos os campos.' });
      return;
    }
    onRegister({ fullName, email, relationship });
    // Limpa os campos e fecha o modal após o registro
    setFullName('');
    setEmail('');
    setRelationship('');
    setPassword('');
    onClose();
  };

  return (
    <Modal animationType="slide" visible={isVisible} onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <ScrollView>
            <View style={styles.header}>
                <Text style={styles.title}>Criar Conta de Dependente</Text>
                <TouchableOpacity onPress={onClose}>
                    <Ionicons name="close" size={30} color="#333" />
                </TouchableOpacity>
            </View>
            <Text style={styles.subtitle}>
                Crie uma nova conta para um membro da sua casa. Eles poderão completar missões e ganhar pontos para a família.
            </Text>

            <View style={styles.form}>
                <Text style={styles.label}>Nome Completo</Text>
                <TextInput style={styles.input} placeholder="Ex: José Pereira" value={fullName} onChangeText={setFullName} />

                <Text style={styles.label}>Email</Text>
                <TextInput style={styles.input} placeholder="Ex: jose.p@email.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

                <Text style={styles.label}>Senha de Acesso</Text>
                <TextInput style={styles.input} placeholder="Crie uma senha forte" value={password} onChangeText={setPassword} secureTextEntry />

                <Text style={styles.label}>Parentesco</Text>
                <TextInput style={styles.input} placeholder="Ex: Filho(a), Cônjuge, etc." value={relationship} onChangeText={setRelationship} />

                <TouchableOpacity style={styles.registerButton} onPress={handleRegisterPress}>
                    <Text style={styles.registerButtonText}>Criar e Adicionar</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold' },
  subtitle: { fontSize: 15, color: '#6C757D', paddingHorizontal: 16, marginBottom: 24 },
  form: { paddingHorizontal: 16 },
  label: { fontSize: 16, fontWeight: '500', color: '#343A40', marginBottom: 8, marginTop: 16 },
  input: { backgroundColor: 'white', padding: 14, borderRadius: 8, fontSize: 16, borderWidth: 1, borderColor: '#CED4DA' },
  registerButton: { backgroundColor: '#28A745', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 32 },
  registerButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});