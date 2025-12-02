import { supabase } from '../lib/supabase';
import { Alert } from 'react-native';

// Dados para um usuário que já é cliente
interface ExistingClientData {
  loteamentoId: string;
  quadra: string;
  lote: string;
}

// Dados para o cadastro
interface SignUpData {
  fullName: string;
  clientData?: ExistingClientData;
}

export const signUpUser = async (email: string, password: string, data: SignUpData) => {
  // 1. Cadastra o usuário no Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Passamos os dados básicos para o trigger que criará o perfil
      data: {
        full_name: data.fullName,
        user_status: data.clientData ? 'client' : 'non_client',
      },
    },
  });

  if (authError) {
    Alert.alert('Erro no Cadastro', authError.message);
    return { user: null, error: authError };
  }

  // Se o usuário se identificou como cliente, inserimos os dados da propriedade
  if (authData.user && data.clientData) {
    const { error: propertyError } = await supabase
      .from('user_properties')
      .insert({
        user_id: authData.user.id,
        loteamento_id: data.clientData.loteamentoId,
        quadra: data.clientData.quadra,
        lote: data.clientData.lote,
      });

    if (propertyError) {
      // Em um app de produção, aqui seria importante ter uma lógica para lidar com esse erro
      // (ex: deletar o usuário recém-criado ou marcar para revisão)
      Alert.alert('Erro ao Registrar Propriedade', propertyError.message);
      return { user: null, error: propertyError };
    }
  }

  return { user: authData.user, error: null };
};
// Função para buscar o perfil do usuário logado