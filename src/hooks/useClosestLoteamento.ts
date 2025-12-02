// src/hooks/useClosestLoteamento.ts

import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Loteamento, ALL_LOTEAMENTOS } from '../data/loteamentos.data';

// Função que calcula a distância em metros entre duas coordenadas GPS
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371e3; // Raio da Terra em metros
    const p1 = lat1 * Math.PI/180;
    const p2 = lat2 * Math.PI/180;
    const deltaP = (lat2-lat1) * Math.PI/180;
    const deltaL = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(deltaP/2) * Math.sin(deltaP/2) +
              Math.cos(p1) * Math.cos(p2) *
              Math.sin(deltaL/2) * Math.sin(deltaL/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
}

export const useClosestLoteamento = () => {
    const [closest, setClosest] = useState<Loteamento | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const findClosest = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.warn('Permissão de localização negada');
                setLoading(false);
                return;
            }

            try {
                const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
                const userLat = location.coords.latitude;
                const userLon = location.coords.longitude;
                
                let closestLoteamento: Loteamento | null = null;
                let minDistance = Infinity;

                // Itera sobre TODOS os loteamentos para encontrar o mais próximo
                for (const loteamento of ALL_LOTEAMENTOS) {
                    if (loteamento.center) {
                        const distance = getDistance(loteamento.center.lat, loteamento.center.lon, userLat, userLon);
                        if (distance < minDistance) {
                            minDistance = distance;
                            closestLoteamento = loteamento;
                        }
                    }
                }
                setClosest(closestLoteamento);
            } catch (e) {
                console.error("Erro ao obter localização para o pop-up:", e);
            } finally {
                setLoading(false);
            }
        };

        findClosest();
    }, []);

    return { closestLoteamento: closest, loading };
};