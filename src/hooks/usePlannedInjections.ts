import { useCallback, useEffect, useState } from 'react';
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

  // Date du jour au format YYYY-MM-DD en heure locale
  const getTodayLocalString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const fetchPlannedInjections = useCallback(async () => {
    setLoading(true);
    const todayStr = getTodayLocalString();

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
  }, []);

  useEffect(() => {
    fetchPlannedInjections();
  }, [fetchPlannedInjections]);

  const addPlannedInjection = async (planned_date: string, zone: InjectionZone, note?: string) => {
    const { error } = await supabase.from('planned_injections').insert({
      planned_date,
      zone,
      note
    });

    if (!error) {
      // Le refetch seul suffit pour tout remettre à jour proprement
      await fetchPlannedInjections();
    }
  };

  const deletePlannedInjection = async (id: string) => {
    // Mise à jour optimiste immédiate de l'UI
    setPlannedInjections(prev => prev.filter(item => item.id !== id));

    const { error } = await supabase.from('planned_injections').delete().eq('id', id);

    if (error) {
      // En cas d'erreur Supabase, on resynchronise
      await fetchPlannedInjections();
    }
  };

  // Liste des identifiants de zones verrouillées
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
