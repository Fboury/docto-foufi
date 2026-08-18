import {useEffect, useState} from 'react';
import {supabase} from '../supabaseClient';
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
            } = await supabase.from('injections').select('*').order('injected_at', {ascending: false});

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

    // Nouvelle méthode d'ajout avec mise à jour de la piqûre précédente
    const addInjectionWithPreviousReaction = async (
        newZone: InjectionZone,
        injectedAt: string,
        previousReactionType: ReactionType,
        previousReactionDetails?: string
    ) => {
        try {
            // 1. Mettre à jour l'injection la plus récente si une réaction est renseignée
            if (injections.length > 0 && previousReactionType) {
                const lastInjection = injections[0]; // La plus récente dans le state
                if (lastInjection.id) {
                    await supabase
                        .from('injections')
                        .update({
                            reaction_type: previousReactionType,
                            reaction_details: previousReactionType !== 'aucune' ? previousReactionDetails : null
                        })
                        .eq('id', lastInjection.id);
                }
            }

            // 2. Insérer la nouvelle injection du jour (sans réaction au départ)
            const {data: newEntry, error: insertError} = await supabase
                .from('injections')
                .insert([
                    {
                        injected_at: injectedAt,
                        zone: newZone,
                        reaction_type: 'aucune' // Sera mise à jour lors de la prochaine saisie
                    }
                ])
                .select()
                .single();

            if (insertError) throw insertError;

            // 3. Recharger la liste pour synchroniser l'historique
            await fetchInjections();
            return newEntry;
        } catch (err) {
            console.error("Erreur lors de l'enregistrement de l'injection :", err);
            throw err;
        }
    };

    const deleteInjection = async (id: string) => {
        try {
            const {error} = await supabase.from('injections').delete().eq('id', id);
            if (error) throw error;
            setInjections(prev => prev.filter(item => item.id !== id));
        } catch (err) {
            console.error('Erreur lors de la suppression :', err);
        }
    };

    const zonesWithStats: ZoneData[] = ZONES_CONFIG.map(zone => {
        const lastInjection = injections.find(item => item.zone === zone.id);

        if (!lastInjection) {
            return {...zone, daysAgo: null, isRecent: false};
        }

        const lastDate = new Date(lastInjection.injected_at).getTime();
        const now = new Date().getTime();
        const diffDays = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));

        return {
            ...zone,
            daysAgo: diffDays,
            isRecent: diffDays <= 3
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
