// src/hooks/useFictionalMap.ts (VERSÃO COM DETECÇÃO DE PROXIMIDADE)

import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';
import { useUserStore } from './useUserStore';
// --- MUDANÇA: Agora importamos a lista completa de loteamentos ---
import { Loteamento, ALL_LOTEAMENTOS, LOTEAMENTOS_CONFIG } from '../data/loteamentos.data';

const MAP_IMAGE_WIDTH = 3600;
const MAP_IMAGE_HEIGHT = 1688;

// Função que calcula a distância entre dois pontos de GPS (Fórmula de Haversine)
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Raio da Terra em metros
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distância em metros
}

export const useFictionalMap = () => {
    // ... (outros estados continuam os mesmos)
    const [isLoading, setIsLoading] = useState(true);
    const [permissionGranted, setPermissionGranted] = useState(false);
    const [isInsideArea, setIsInsideArea] = useState(false);
    const [mapPosition, setMapPosition] = useState<{ x: number, y: number } | null>(null);
    const [isTrackingEnabled, setIsTrackingEnabled] = useState(false);
    
    // --- NOVO ESTADO PARA GUARDAR O LOTEAMENTO MAIS PRÓXIMO ---
    const [closestLoteamento, setClosestLoteamento] = useState<Loteamento | null>(null);

    const toggleTracking = useCallback(() => {
        setIsTrackingEnabled(prevState => !prevState);
    }, []);

    useEffect(() => {
        let subscription: Location.LocationSubscription | null = null;

        const startWatching = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setPermissionGranted(false);
                setIsLoading(false);
                return;
            }
            setPermissionGranted(true);

            if (isTrackingEnabled) {
                subscription = await Location.watchPositionAsync(
                    { accuracy: Location.Accuracy.BestForNavigation, timeInterval: 3000, distanceInterval: 10 },
                    (location) => {
                        const userLat = location.coords.latitude;
                        const userLon = location.coords.longitude;
                        
                        // --- LÓGICA DE PROXIMIDADE ---
                        let closest = null;
                        let minDistance = Infinity;

                        // 1. Itera sobre TODOS os loteamentos para encontrar o mais próximo
                        for (const lote of ALL_LOTEAMENTOS) {
                            if (lote.center) {
                                const distance = getDistance(lote.center.lat, lote.center.lon, userLat, userLon);
                                if (distance < minDistance) {
                                    minDistance = distance;
                                    closest = lote;
                                }
                            }
                        }
                        setClosestLoteamento(closest);
                        // --- FIM DA LÓGICA DE PROXIMIDADE ---

                        // A lógica de "dentro da área" agora usa o loteamento mais próximo que encontramos
                        if (closest && closest.bounds) {
                            const { north, south, west, east } = closest.bounds;
                            const userIsInside = (userLat <= north && userLat >= south && userLon <= east && userLon >= west);
                            setIsInsideArea(userIsInside);

                            if (userIsInside) {
                                const lonPercent = (userLon - west) / (east - west);
                                const latPercent = (userLat - south) / (north - south);
                                setMapPosition({ x: lonPercent * MAP_IMAGE_WIDTH, y: (1 - latPercent) * MAP_IMAGE_HEIGHT });
                            } else {
                                setMapPosition(null);
                            }
                        }
                    }
                );
            } else {
                subscription?.remove();
                setMapPosition(null);
            }
            setIsLoading(false);
        };

        startWatching();
        return () => { subscription?.remove(); };
    }, [isTrackingEnabled]);

    return { isLoading, permissionGranted, isInsideArea, mapPosition, isTrackingEnabled, toggleTracking, closestLoteamento };
};