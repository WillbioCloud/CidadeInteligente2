import { Mission } from './types';
import { missoesCidadeInteligente } from './cidade_inteligente';
import { missoesCidadeDasFlores } from './cidade_das_flores';
// Importe aqui os outros arquivos de missões quando forem criados

// Mapeia o ID do loteamento para seu respectivo array de missões
const missionData = {
  cidade_inteligente: missoesCidadeInteligente,
  cidade_das_flores: missoesCidadeDasFlores,
  // Adicione os outros loteamentos aqui
  // cidade_verde: missoesCidadeVerde,
};

// Função que o app usará para buscar as missões dinamicamente
export const getMissionsForLoteamento = (loteamentoId: string): Mission[] => {
  return missionData[loteamentoId] || []; // Retorna as missões ou um array vazio
};

export const getAllMissions = (): Mission[] => {
  return Object.values(missionData).flat(); // Retorna todas as missões de todos os loteamentos
};