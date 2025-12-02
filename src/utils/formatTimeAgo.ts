// src/utils/formatTimeAgo.ts

/**
 * Converte uma string de data (ISO 8601) em uma string de tempo relativo.
 * Ex: "há 5 minutos", "há 2 dias".
 * @param dateString - A data em formato de string.
 */
export const formatTimeAgo = (dateString: string): string => {
  if (!dateString) return '';

  const date = new Date(dateString);
  const now = new Date();
  // Diferença em segundos
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // Anos
  let interval = seconds / 31536000;
  if (interval > 1) {
    return `há ${Math.floor(interval)} anos`;
  }
  // Meses
  interval = seconds / 2592000;
  if (interval > 1) {
    return `há ${Math.floor(interval)} meses`;
  }
  // Dias
  interval = seconds / 86400;
  if (interval > 1) {
    return `há ${Math.floor(interval)} dias`;
  }
  // Horas
  interval = seconds / 3600;
  if (interval > 1) {
    return `há ${Math.floor(interval)} horas`;
  }
  // Minutos
  interval = seconds / 60;
  if (interval > 1) {
    return `há ${Math.floor(interval)} minutos`;
  }

  return 'agora mesmo';
};