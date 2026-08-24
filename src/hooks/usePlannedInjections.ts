import { useEffect, useState } from 'react';
// Importation directe depuis la racine de src/
import { supabase } from '../supabaseClient';
import { InjectionZone } from '../types/injection';

export interface PlannedInjection {
  id: string;
  planned_date: string; // YYYY-MM-DD
  zone: InjectionZone;
  note?: string;
  created_at?: string;
}

export const usePlannedInjections = () => {
  const [plannedInjections, setPlannedInjections] = useState<PlannedInjection[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPlannedInjections = async () => {
    setLoading(true);
    const todayStr = new Date().toISOString().split('T')[0];

    // Récupération des réservations d'aujourd'hui et à venir
    const { data, error } = await supabase
      .from('planned_injections')
      .select('*')
      .gte('planned_date', todayStr)
      .order('planned_date', { ascending: true });

    if (!error && data) {
      setPlannedInjections(data as PlannedInjection[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPlannedInjections();
  }, []);

  const addPlannedInjection = async (planned_date: string, zone: InjectionZone, note?: string) => {
    const { data, error } = await supabase.from('planned_injections').insert({ planned_date, zone, note }).select();

    if (!error && data) {
      setPlannedInjections(prev => [...prev, data[0] as PlannedInjection]);
    }
  };

  const deletePlannedInjection = async (id: string) => {
    setPlannedInjections(prev => prev.filter(item => item.id !== id));
    await supabase.from('planned_injections').delete().eq('id', id);
  };

  // Liste des zones verrouillées/réservées
  const reservedZoneIds = plannedInjections.map(p => p.zone);

  return {
    plannedInjections,
    reservedZoneIds,
    loading,
    addPlannedInjection,
    deletePlannedInjection,
    refetch: fetchPlannedInjections
  };
};
