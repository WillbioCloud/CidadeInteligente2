// Local: /src/components/HealthIcons.tsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const IconBase = ({ children, size = 36, backgroundColor = '#F0F4F8' }) => (
  <View style={[styles.iconWrapper, { width: size, height: size, borderRadius: size / 2, backgroundColor }]}>
    {children}
  </View>
);

// --- Ícones Personalizados ---

// AQUI ESTÁ A CORREÇÃO: trocamos 'alert-triangle' por 'alert-outline'
export const IconAlerta = () => (
  <IconBase backgroundColor="#FFFBEB">
    <MaterialCommunityIcons name="alert-outline" size={22} color="#F59E0B" />
  </IconBase>
);

export const IconVacina = () => (
  <IconBase backgroundColor="#E0F2FE">
    <MaterialCommunityIcons name="needle" size={20} color="#0EA5E9" />
  </IconBase>
);

export const IconHospital = () => (
  <IconBase backgroundColor="#EFF6FF">
    <MaterialCommunityIcons name="hospital-building" size={20} color="#3B82F6" />
  </IconBase>
);

export const IconAlimentacao = () => (
  <IconBase backgroundColor="#F0FDF4">
    <MaterialCommunityIcons name="leaf" size={20} color="#22C55E" />
  </IconBase>
);

export const IconExercicio = () => (
  <IconBase backgroundColor="#FFF7ED">
    <MaterialCommunityIcons name="dumbbell" size={20} color="#F97316" />
  </IconBase>
);

export const IconSaudeMental = () => (
  <IconBase backgroundColor="#F5F3FF">
    <MaterialCommunityIcons name="brain" size={20} color="#8B5CF6" />
  </IconBase>
);

// Componente "Mestre" que decide qual ícone renderizar
export const HealthIcon = ({ name }: { name: string }) => {
  switch (name) {
    case 'alerta_dengue': return <IconAlerta />;
    case 'vacina': return <IconVacina />;
    case 'hospital': return <IconHospital />;
    case 'alimentacao': return <IconAlimentacao />;
    case 'exercicio': return <IconExercicio />;
    case 'saude_mental': return <IconSaudeMental />;
    default:
      return (
        <IconBase backgroundColor="#F8FAFC">
            <MaterialCommunityIcons name="help-circle" size={20} color="#64748B" />
        </IconBase>
      );
  }
};

const styles = StyleSheet.create({
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});