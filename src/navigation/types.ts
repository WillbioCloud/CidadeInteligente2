// src/navigation/types.ts

import { StackNavigationProp } from '@react-navigation/stack';

// Define todas as telas e os parâmetros que elas podem receber no MoreStackNavigator
export type MoreStackParamList = {
  MoreTabHome: undefined; // A tela principal não recebe parâmetros
  CourtScheduling: undefined;
  // O Placeholder pode receber um screenName como parâmetro
  Placeholder: { screenName: string }; 
  // Adicione outras telas do MoreStack aqui se elas receberem parâmetros
  CommunityEvents: undefined;
  MonitoringCameras: undefined;
  RegionNews: undefined;
  Courses: undefined;
  Support: undefined;
  SustainableTips: undefined;
  GarbageSeparation: undefined;
  WeatherForecast: undefined;
  Emergency: undefined;
  FBZSpace: undefined;
  SpaceCapacity: undefined;
  IPTU: undefined;
  Feedback: undefined;
};

// Define o tipo da prop 'navigation' para as telas dentro do MoreStackNavigator
export type MoreNavigationProp = StackNavigationProp<MoreStackParamList>;