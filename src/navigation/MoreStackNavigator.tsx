// Local: src/navigation/MoreStackNavigator.tsx (VERSÃO COM CASING CORRIGIDO)

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Telas da aba Mais
import MoreTabScreen from '../screens/More/MoreTabScreen';
import PlaceholderScreen from '../screens/More/PlaceholderScreen';

// --- AQUI ESTÁ A CORREÇÃO ---
// Garante que a importação usa o nome exato do arquivo: 'CourtSchedulingScreen'
import CourtSchedulingScreen from '../screens/scheduling/CourtSchedulingScreen';

const Stack = createStackNavigator();

export default function MoreStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Tela Principal */}
      <Stack.Screen name="MoreTabHome" component={MoreTabScreen} />

      {/* --- ROTA ATUALIZADA --- */}
      <Stack.Screen name="CourtScheduling" component={CourtSchedulingScreen} />

      {/* As outras rotas continuam usando o Placeholder */}
      <Stack.Screen name="CommunityEvents" component={PlaceholderScreen} initialParams={{ screenName: 'Eventos da Comunidade' }} />
      <Stack.Screen name="MonitoringCameras" component={PlaceholderScreen} initialParams={{ screenName: 'Câmeras de Monitoramento' }} />
      <Stack.Screen name="RegionNews" component={PlaceholderScreen} initialParams={{ screenName: 'Notícias da Região' }} />
      <Stack.Screen name="Courses" component={PlaceholderScreen} initialParams={{ screenName: 'Cursos e Formações' }} />
      <Stack.Screen name="Support" component={PlaceholderScreen} initialParams={{ screenName: 'Contato Pós-venda' }} />
      <Stack.Screen name="SustainableTips" component={PlaceholderScreen} initialParams={{ screenName: 'Dicas Sustentáveis' }} />
      <Stack.Screen name="GarbageSeparation" component={PlaceholderScreen} initialParams={{ screenName: 'Separação de Lixo' }} />
      <Stack.Screen name="WeatherForecast" component={PlaceholderScreen} initialParams={{ screenName: 'Previsão do Tempo' }} />
      <Stack.Screen name="Emergency" component={PlaceholderScreen} initialParams={{ screenName: 'Emergência' }} />
      <Stack.Screen name="FBZSpace" component={PlaceholderScreen} initialParams={{ screenName: 'Espaço FBZ' }} />
      <Stack.Screen name="SpaceCapacity" component={PlaceholderScreen} initialParams={{ screenName: 'Lotação dos Espaços' }} />
      <Stack.Screen name="IPTU" component={PlaceholderScreen} initialParams={{ screenName: 'IPTU' }} />
      <Stack.Screen name="Feedback" component={PlaceholderScreen} initialParams={{ screenName: 'Enviar Feedback' }} />
    </Stack.Navigator>
  );
}