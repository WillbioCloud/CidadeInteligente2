import { Mission } from './types'; // Usaremos um tipo compartilhado

export const missoesCidadeInteligente: Mission[] = [
  // Missões Diárias
  {
    id: 101,
    type: 'daily',
    title: 'Check-up Tecnológico',
    description: 'Verifique a conexão do seu hub de automação residencial.',
    points: 20,
    icon: '📡',
    tasks: ['Confirmar status online do hub', 'Verificar se as luzes inteligentes estão respondendo'],
  },
  {
    id: 102,
    type: 'daily',
    title: 'Patrulha Anti-Dengue',
    description: 'Use a tecnologia a seu favor e verifique possíveis focos de dengue.',
    points: 30,
    icon: '🦟',
    tasks: ['Verificar vasos de plantas e áreas com água parada', 'Reportar no app da prefeitura (simulação)'],
  },
  // Missões de Evolução (Exemplo)
  {
    id: 501,
    type: 'evolution',
    title: 'Guardião da Energia',
    description: 'Otimize o consumo de energia da sua casa por uma semana.',
    points: 250,
    icon: '💡',
    tasks: ['Ativar modo "economia" no ar-condicionado', 'Programar luzes para desligar automaticamente', 'Atingir meta de consumo semanal'],
  },
];
