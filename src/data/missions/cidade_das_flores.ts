import { Mission } from './types';

export const missoesCidadeDasFlores: Mission[] = [
  // Missões Diárias
  {
    id: 201,
    type: 'daily',
    title: 'Cuidado com o Jardim',
    description: 'Dedique um tempo para cuidar das flores do seu jardim.',
    points: 25,
    icon: '🌸',
    tasks: ['Regar as plantas', 'Remover folhas secas'],
  },
  {
    id: 202,
    type: 'daily',
    title: 'Passeio no Calçadão',
    description: 'Faça uma caminhada revigorante pelo calçadão florido.',
    points: 20,
    icon: '👟',
    tasks: ['Completar 15 minutos de caminhada', 'Tirar uma foto de uma flor diferente'],
  },
  // Missões de Evolução (Exemplo)
  {
    id: 601,
    type: 'evolution',
    title: 'Embaixador das Flores',
    description: 'Contribua ativamente para a beleza do loteamento.',
    points: 300,
    icon: '🌹',
    tasks: ['Plantar uma nova muda em seu jardim', 'Participar de um workshop de jardinagem', 'Organizar um dia de plantio com vizinhos'],
  },
];
