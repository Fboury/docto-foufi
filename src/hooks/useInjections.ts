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
      // 1. Trouver l'injection immédiatement précédente
      const lastInjection =
        injections && injections.length > 0
          ? [...injections].sort((a, b) => new Date(b.injected_at).getTime() - new Date(a.injected_at).getTime())[0]
          : null;

      // 2. Mettre à jour les réactions de l'injection précédente le cas échéant
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
            reaction_types: ['aucune'],
            reaction_details: null
          }
        ])
        .select();

      if (error) throw error;

      // 4. DÉCRÉMENTATION GLOBALE DU STOCK (-1 pour TOUS les éléments)
      const { data: currentStocks } = await supabase.from('stocks').select('id, quantity');

      if (currentStocks && currentStocks.length > 0) {
        for (const item of currentStocks) {
          if (item.quantity > 0) {
            await supabase
              .from('stocks')
              .update({ quantity: item.quantity - 1 })
              .eq('id', item.id);
          }
        }
      }

      await fetchInjections();
    } catch (err) {
      console.error('Erreur lors de la sauvegarde :', err);
      throw err;
    }
  };

  const deleteInjection = async (id: string) => {
    try {
      // 1. Réincrémentation automatique du stock (+1 pour TOUS les éléments)
      const { data: currentStocks } = await supabase.from('stocks').select('id, quantity');

      if (currentStocks && currentStocks.length > 0) {
        for (const item of currentStocks) {
          await supabase
            .from('stocks')
            .update({ quantity: item.quantity + 1 })
            .eq('id', item.id);
        }
      }

      // 2. Suppression de l'injection dans Supabase
      const { error } = await supabase.from('injections').delete().eq('id', id);
      if (error) throw error;

      // 3. Mise à jour de l'état local
      setInjections(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Erreur lors de la suppression :', err);
    }
  };

  // Grille conservant l'ordre exact défini dans ZONES_CONFIG
  const zonesWithStats: ZoneData[] = ZONES_CONFIG.map(zone => {
    const lastInjection = injections.find(item => item.zone === zone.id);

    if (!lastInjection) {
      return { ...zone, daysAgo: null, isRecent: false };
    }

    const injDate = new Date(lastInjection.injected_at);
    const now = new Date();

    const utcInj = Date.UTC(injDate.getUTCFullYear(), injDate.getUTCMonth(), injDate.getUTCDate());
    const utcNow = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());

    const diffDays = Math.max(0, Math.floor((utcNow - utcInj) / (1000 * 60 * 60 * 24)));

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

  const updateInjection = async (
    id: string,
    updatedData: {
      zone: InjectionZone;
      injected_at: string;
      notes?: string;
      reaction_types?: ReactionType[];
      reaction_details?: string;
    }
  ) => {
    const payload: Record<string, any> = {
      zone: updatedData.zone,
      injected_at: updatedData.injected_at,
      reaction_types: updatedData.reaction_types,
      reaction_details: updatedData.reaction_details || updatedData.notes || null
    };

    const { error } = await supabase.from('injections').update(payload).eq('id', id);

    if (!error) {
      await fetchInjections();
    }

    return { error };
  };

  return {
    injections,
    loading,
    addInjectionWithPreviousReaction,
    deleteInjection,
    zonesWithStats,
    updateInjection,
    recommendedZone: getRecommendedZone(),
    refetch: fetchInjections
  };
};
