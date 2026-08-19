import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import {
  InjectionEntry,
  InjectionZone,
  ReactionType,
  ZoneData,
  ZONES_CONFIG
} from '../types/injection';

export const useInjections = () => {
  const [injections, setInjections] = useState<InjectionEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInjections = async () => {
    try {
      setLoading(true);
      const {
        data,
        error
      } = await supabase.from('injections').select('*').order('injected_at', { ascending: false });

      if (error) throw error;
      setInjections(data || []);
    } catch (err) {
      console.error('Erreur lors du chargement des injections :', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInjections();
  }, []);

  const addInjectionWithPreviousReaction = async (
    zone: InjectionZone,
    injectedAt: string,
    previousReactionTypes: ReactionType[],
    previousReactionDetails?: string
  ) => {
    try {
      // 1. Trouver l'injection immédiatement précédente (la plus récente enregistrée)
      const lastInjection =
        injections && injections.length > 0
          ? [...injections].sort((a, b) => new Date(b.injected_at).getTime() - new Date(a.injected_at).getTime())[0]
          : null;

      // 2. Si une injection précédente existe et que des réactions ont été saisies, la mettre à jour
      if (lastInjection && lastInjection.id && previousReactionTypes.length > 0) {
        const { error: updateError } = await supabase
          .from('injections')
          .update({
            reaction_types: previousReactionTypes,
            reaction_details: previousReactionDetails || null
          })
          .eq('id', lastInjection.id);

        if (updateError) {
          console.error('Erreur lors de la mise à jour de la réaction précédente :', updateError);
        }
      }

      // 3. Insérer la NOUVELLE injection
      const { error } = await supabase
        .from('injections')
        .insert([
          {
            zone,
            injected_at: injectedAt,
            reaction_types: ['aucune'], // La nouvelle injection n'a pas encore de réaction
            reaction_details: null
          }
        ])
        .select();

      if (error) throw error;

      // Recharger la liste pour synchroniser l'UI avec Supabase
      await fetchInjections();
    } catch (err) {
      console.error('Erreur lors de la sauvegarde :', err);
      throw err;
    }
  };

  const deleteInjection = async (id: string) => {
    try {
      const { error } = await supabase.from('injections').delete().eq('id', id);
      if (error) throw error;
      setInjections(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Erreur lors de la suppression :', err);
    }
  };

  const zonesWithStats: ZoneData[] = ZONES_CONFIG.map(zone => {
    const lastInjection = injections.find(item => item.zone === zone.id);

    if (!lastInjection) {
      return { ...zone, daysAgo: null, isRecent: false };
    }

    const lastDate = new Date(lastInjection.injected_at).getTime();
    const now = new Date().getTime();
    const diffDays = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));

    return {
      ...zone,
      daysAgo: diffDays,
      isRecent: diffDays <= 6
    };
  });

  const getRecommendedZone = (): InjectionZone => {
    if (injections.length === 0) return 'flanc_gauche';
    const neverUsed = zonesWithStats.find(z => z.daysAgo === null);
    if (neverUsed) return neverUsed.id;
    const sorted = [...zonesWithStats].sort((a, b) => (b.daysAgo ?? 0) - (a.daysAgo ?? 0));
    return sorted[0].id;
  };

  return {
    injections,
    loading,
    addInjectionWithPreviousReaction,
    deleteInjection,
    zonesWithStats,
    recommendedZone: getRecommendedZone(),
    refetch: fetchInjections
  };
};
;
