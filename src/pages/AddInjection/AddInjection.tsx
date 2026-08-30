import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Loader2,
  Lock,
  Sparkles,
  Zap
} from 'lucide-react';
import { useInjections } from '../../hooks/useInjections';
import { usePlannedInjections } from '../../hooks/usePlannedInjections';
import { calculateLevel } from '../../utils/levelingUtils';
import { InjectionZone, ReactionType } from '../../types/injection';
import { ALL_BADGES, BadgeConfig } from '../../constants/badges';
import {
  BadgeUnlockModal
} from '../../components/BadgeUnlockModal/BadgeUnlockModal';

// Extraction automatique des clés de badges répétables depuis ALL_BADGES
const REPEATABLE_BADGE_KEYS = ALL_BADGES.map(b => b.key).filter(
  key => !key.startsWith('total_injections_') && !key.startsWith('zone_master_')
);

// Helper de détection des clés de badges débloqués sur UNE injection donnée
export const getSingleInjectionKeys = (entry: any): string[] => {
  if (!entry || !entry.injected_at) return [];
  const keys: string[] = [];
  const d = new Date(entry.injected_at);

  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hour = d.getHours();
  const dayOfWeek = d.getDay();

  if (hour >= 6 && hour < 9) keys.push('early_bird');
  if (hour >= 22 || hour < 2) keys.push('night_owl');
  if (dayOfWeek === 0 || dayOfWeek === 6) keys.push('weekend_warrior');

  if (month === 2 && day === 14) keys.push('valentines_day');
  if (month === 3 && day === 21) keys.push('spring_injection');
  if (month === 6 && day === 21) keys.push('summer_vibes');
  if (month === 9 && day === 21) keys.push('autumn_injection');
  if (month === 12 && day === 25) keys.push('christmas_injection');
  if (month === 1 && day === 1) keys.push('new_year_injection');
  if (month === 10 && day === 31) keys.push('halloween_injection');

  if (month === 11 && day === 21) keys.push('bahia_birthday_injection');
  if (month === 7 && day === 4) keys.push('partner_birthday_injection');
  if (month === 12 && day === 1) keys.push('couple_anniversary_injection');
  if (month === 4 && day === 1) keys.push('pacs_anniversary_injection');
  if (month === 8 && day === 1) keys.push('engagement_anniversary_injection');
  if (month === 8 && day === 19) keys.push('test');

  return keys;
};

// Helper global pour l'historique complet
export const getUnlockedKeys = (items: any[]): string[] => {
  const keys: string[] = [];
  const total = items?.length || 0;

  if (total === 0) return keys;

  const GLOBAL_STEPS = [1, 10, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500];
  GLOBAL_STEPS.forEach(step => {
    if (total >= step) keys.push(`total_injections_${step}`);
  });

  const zoneCounts: Record<string, number> = {};
  items.forEach(i => {
    if (i.zone) zoneCounts[i.zone] = (zoneCounts[i.zone] || 0) + 1;
  });

  const ZONE_STEPS = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200];
  ZONE_STEPS.forEach(step => {
    if (Object.values(zoneCounts).some(count => count >= step)) {
      keys.push(`zone_master_${step}`);
    }
  });

  items.forEach(i => {
    const singleKeys = getSingleInjectionKeys(i);
    keys.push(...singleKeys);
  });

  return Array.from(new Set(keys));
};

export const AddInjection: React.FC = () => {
  const navigate = useNavigate();
  const {
    injections = [],
    recommendedZone,
    zonesWithStats,
    loading: loadingInjections,
    addInjectionWithPreviousReaction
  } = useInjections();

  const { plannedInjections, loading: loadingPlanned } = usePlannedInjections();

  const todayAtMidnight = new Date();
  todayAtMidnight.setHours(0, 0, 0, 0);

  const parsePlannedDate = (dateStr?: string) => {
    if (!dateStr) return null;
    const cleanStr = dateStr.trim();
    const d = cleanStr.includes('T') ? new Date(cleanStr) : new Date(`${cleanStr.slice(0, 10)}T00:00:00`);
    d.setHours(0, 0, 0, 0);
    return isNaN(d.getTime()) ? null : d;
  };

  const strictlyFutureReservedZoneIds = plannedInjections
    .filter(p => {
      const pDate = parsePlannedDate(p.planned_date || (p as any).date);
      return pDate && pDate.getTime() > todayAtMidnight.getTime();
    })
    .map(p => p.zone);

  const todayPlannedZonesMap = plannedInjections.reduce<Record<string, string>>((acc, p) => {
    const pDate = parsePlannedDate(p.planned_date || (p as any).date);
    if (pDate && pDate.getTime() === todayAtMidnight.getTime()) {
      acc[p.zone] = p.note || 'Prévue aujourd\'hui';
    }
    return acc;
  }, {});

  const effectiveRecommendedZone = strictlyFutureReservedZoneIds.includes(recommendedZone)
    ? zonesWithStats.find(z => !strictlyFutureReservedZoneIds.includes(z.id))?.id || recommendedZone
    : recommendedZone;

  const [selectedZone, setSelectedZone] = useState<InjectionZone>(effectiveRecommendedZone);
  const [selectedReactions, setSelectedReactions] = useState<ReactionType[]>([]);
  const [reactionDetails, setReactionDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newlyUnlocked, setNewlyUnlocked] = useState<BadgeConfig[]>([]);

  // Calcul sécurisé du niveau
  const currentLevelInfo = calculateLevel(injections);

  useEffect(() => {
    if (effectiveRecommendedZone) {
      setSelectedZone(effectiveRecommendedZone);
    }
  }, [effectiveRecommendedZone]);

  const [injectionDate, setInjectionDate] = useState(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  });

  const toggleReaction = (type: ReactionType) => {
    if (type === 'aucune') {
      setSelectedReactions([]);
      return;
    }

    setSelectedReactions(prev => {
      if (prev.includes(type)) {
        return prev.filter(r => r !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const exactIsoString = new Date(injectionDate).toISOString();

      // 1. Détection Level UP
      const levelBefore = calculateLevel(injections).level;

      // 2. Clés débloquées AVANT la nouvelle injection
      const beforeKeys = getUnlockedKeys(injections);

      // 3. Sauvegarde Supabase
      const createdInjection = await addInjectionWithPreviousReaction(
        selectedZone,
        exactIsoString,
        selectedReactions.length > 0 ? selectedReactions : ['aucune'],
        reactionDetails
      );

      const newEntry = createdInjection || {
        id: `temp-${Date.now()}`,
        zone: selectedZone,
        injected_at: exactIsoString,
        reaction_types: selectedReactions
      };

      const hasNewEntry = injections.some(i => i.id === newEntry.id);
      const updatedInjections = hasNewEntry ? injections : [newEntry, ...injections];

      // 4. Détection du Level UP
      const levelAfter = calculateLevel(updatedInjections).level;
      if (levelAfter > levelBefore) {
        console.log(`🎉 LEVEL UP ! Passage au Niveau ${levelAfter}`);
      }

      const afterKeys = getUnlockedKeys(updatedInjections);
      const currentSingleKeys = getSingleInjectionKeys(newEntry);

      const zoneInjectionsCount = updatedInjections.filter(i => i.zone === selectedZone).length;
      const ZONE_STEPS = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200];
      const justHitZoneStep = ZONE_STEPS.includes(zoneInjectionsCount);

      const newlyUnlockedKeys = Array.from(
        new Set([
          ...afterKeys.filter(k => !beforeKeys.includes(k)),
          ...currentSingleKeys.filter(k => REPEATABLE_BADGE_KEYS.includes(k)),
          ...(justHitZoneStep ? [`zone_master_${zoneInjectionsCount}`] : [])
        ])
      );

      if (newlyUnlockedKeys.length > 0) {
        const badgesToReward = ALL_BADGES.filter(b => newlyUnlockedKeys.includes(b.key));
        setNewlyUnlocked(badgesToReward);
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement :', err);
      alert('Erreur lors de l\'enregistrement dans la base de données.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedZoneData = zonesWithStats.find(z => z.id === selectedZone);
  const recommendedZoneData = zonesWithStats.find(z => z.id === effectiveRecommendedZone);

  if (loadingInjections || loadingPlanned) {
    return (
      <div
        className="flex min-h-[50vh] flex-col items-center justify-center text-[#5E4B8B]">
        <Loader2 className="mb-2 h-8 w-8 animate-spin" />
        <p className="text-sm font-medium">Chargement des zones...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-6 px-4 py-6">
      {/* En-tête */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-xs font-bold text-[#8E8294] hover:text-[#5E4B8B]">
          <ArrowLeft className="h-4 w-4" />
          <span>Retour</span>
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1
              className="font-serif text-2xl font-bold text-[#5E4B8B]">Nouvelle
              Injection</h1>
            <p className="text-xs text-[#8E8294]">Saisie du changement de
              pompe</p>
          </div>

          {/* Badge Niveau de l'utilisateur */}
          <div
            className="flex items-center gap-1.5 rounded-2xl border border-[#D3C1E5] bg-[#E5D9F2] px-3 py-1.5 text-[#5E4B8B]">
            <Zap className="h-4 w-4 fill-amber-400 text-amber-500" />
            <span
              className="text-xs font-bold">Niv. {currentLevelInfo.level}</span>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 pb-10">
        {/* 1. Date & Heure */}
        <div
          className="flex items-center justify-between rounded-3xl border border-[#E8DFD8] bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F5EFE6] text-[#5E4B8B]">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-[#8E8294]">Date & Heure</p>
              <input
                type="datetime-local"
                value={injectionDate}
                onChange={e => setInjectionDate(e.target.value)}
                className="cursor-pointer bg-transparent text-sm font-bold text-[#2D283E] focus:outline-none"
              />
            </div>
          </div>
          <Clock className="h-4 w-4 text-[#8E8294]" />
        </div>

        {/* 2. Banner de recommandation */}
        <div
          className="space-y-3 rounded-3xl border border-[#D3C1E5] bg-[#E5D9F2] p-4.5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#5E4B8B]" />
              <span
                className="text-xs font-bold tracking-wider text-[#5E4B8B] uppercase">Zone recommandée</span>
            </div>
            <span
              className="rounded-full bg-white/60 px-2 py-0.5 text-[10px] font-bold text-[#5E4B8B]">
              Plus ancienne dispo
            </span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div>
              <p className="text-xl font-bold text-[#2D283E]">
                {recommendedZoneData?.emoji} {recommendedZoneData?.fullLabel}
              </p>
              <p className="mt-0.5 text-xs font-medium text-[#5E4B8B]/80">
                {recommendedZoneData?.daysAgo === null
                  ? 'Jamais injecté ici'
                  : `Dernière piqûre : il y a ${recommendedZoneData?.daysAgo} j`}
              </p>
            </div>

            {selectedZone !== effectiveRecommendedZone && (
              <button
                type="button"
                onClick={() => setSelectedZone(effectiveRecommendedZone)}
                className="rounded-2xl bg-[#5E4B8B] px-3.5 py-2 text-xs font-bold text-white shadow hover:bg-[#4A3B6E]">
                Sélectionner
              </button>
            )}
          </div>
        </div>

        {/* 3. Grille des zones */}
        <div className="space-y-2.5">
          <label
            className="px-1 text-xs font-bold tracking-wider text-[#8E8294] uppercase">Sélectionner
            la zone</label>

          <div className="grid grid-cols-3 gap-2.5">
            {zonesWithStats.map(zone => {
              const isSelected = selectedZone === zone.id;
              const isFutureReserved = strictlyFutureReservedZoneIds.includes(zone.id);
              const isTodayPlanned = Boolean(todayPlannedZonesMap[zone.id]);
              const reservation = plannedInjections.find(p => p.zone === zone.id);

              let cardStyles = '';
              if (isFutureReserved) {
                cardStyles =
                  'cursor-not-allowed border border-dashed border-amber-300 bg-amber-50/70 text-amber-800 opacity-75';
              } else if (isSelected) {
                cardStyles =
                  'font-bold shadow-md ring-2 ring-[#5E4B8B] ring-offset-2 ring-offset-[#F5EFE6] bg-[#5E4B8B] text-white';
              } else if (isTodayPlanned) {
                cardStyles = 'border-2 border-amber-400 bg-amber-50 text-amber-950 font-bold shadow-sm animate-pulse';
              } else if (!zone.isRecent) {
                cardStyles = 'border border-[#D3C1E5] bg-[#E5D9F2] text-[#5E4B8B] hover:opacity-95';
              } else {
                cardStyles = 'border border-[#DFC8A6] bg-[#EFE3C8] text-[#8C6D46] hover:opacity-95';
              }

              return (
                <button
                  key={zone.id}
                  type="button"
                  disabled={isFutureReserved}
                  onClick={() => !isFutureReserved && setSelectedZone(zone.id)}
                  className={`relative flex h-24 flex-col items-center justify-center rounded-2xl p-2 text-center transition-all ${cardStyles}`}>
                  {isFutureReserved && (
                    <span
                      className="absolute top-1.5 right-1.5 flex items-center gap-0.5 rounded-full bg-amber-200/90 px-1.5 py-0.5 text-[9px] font-extrabold text-amber-900">
                      <Lock className="h-2.5 w-2.5" /> Bloquée
                    </span>
                  )}

                  {isTodayPlanned && !isSelected && (
                    <span
                      className="absolute top-1.5 right-1.5 flex items-center gap-0.5 rounded-full bg-amber-400 px-1.5 py-0.5 text-[9px] font-extrabold text-amber-950 uppercase shadow-xs">
                      <Sparkles className="h-2.5 w-2.5" /> Jour J
                    </span>
                  )}

                  <span className="mb-0.5 text-xl">{zone.emoji}</span>
                  <span
                    className="text-xs leading-tight font-semibold">{zone.shortLabel}</span>

                  <span className="mt-0.5 text-[10px] font-medium opacity-85">
                    {isFutureReserved
                      ? reservation?.note || 'Réservée'
                      : isTodayPlanned
                        ? 'Prévue aujourd\'hui'
                        : zone.daysAgo === null
                          ? 'Jamais'
                          : `il y a ${zone.daysAgo} j`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Réactions */}
        <div
          className="space-y-3 rounded-3xl border border-[#E8DFD8] bg-white p-4.5 shadow-sm">
          <div>
            <h3 className="text-sm font-bold text-[#2D283E]">Injection
              précédente</h3>
            <p className="text-xs text-[#8E8294]">Avez-vous observé une réaction
              sur le dernier site ?</p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'aucune', label: 'Aucune', emoji: '✨' },
              { id: 'bleu', label: 'Bleu', emoji: '🫐' },
              { id: 'douleur', label: 'Douleur', emoji: '🩹' },
              { id: 'sang', label: 'Sang', emoji: '🩸' },
              { id: 'autre', label: 'Autre', emoji: '💬' }
            ].map(item => {
              const isAucune = item.id === 'aucune';
              const isActive = isAucune
                ? selectedReactions.length === 0
                : selectedReactions.includes(item.id as ReactionType);

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleReaction(item.id as ReactionType)}
                  className={`flex flex-col items-center gap-1 rounded-2xl border px-2 py-2.5 text-xs font-bold transition-all ${
                    isActive
                      ? 'border-[#5E4B8B] bg-[#5E4B8B] text-white shadow-sm'
                      : 'border-[#E8DFD8] bg-[#F5EFE6] text-[#2D283E] hover:bg-[#E8DFD8]'
                  }`}>
                  <span className="text-base">{item.emoji}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {selectedReactions.length > 0 && (
            <div className="pt-2">
              <textarea
                rows={2}
                value={reactionDetails}
                onChange={e => setReactionDetails(e.target.value)}
                placeholder="Précisez la réaction (ex: rougeur, léger gonflement...)"
                className="w-full rounded-2xl border border-[#E8DFD8] bg-[#F5EFE6] p-3 text-xs text-[#2D283E] focus:ring-2 focus:ring-[#5E4B8B] focus:outline-none"
              />
            </div>
          )}
        </div>

        {/* 5. Validation */}
        <button
          type="button"
          onClick={() => handleSubmit()}
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#5E4B8B] py-4 text-base font-bold text-white shadow-lg shadow-[#5E4B8B]/20 transition-all hover:bg-[#4A3B6E] active:scale-[0.99] disabled:opacity-50">
          {isSubmitting ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <CheckCircle2 className="h-5 w-5" />
              <span>Valider l'injection ({selectedZoneData?.shortLabel})</span>
            </>
          )}
        </button>
      </form>

      {/* Modal de déblocage des badges avec confettis */}
      <BadgeUnlockModal
        unlockedBadges={newlyUnlocked}
        onClose={() => {
          setNewlyUnlocked([]);
          navigate('/');
        }}
      />
    </div>
  );
};
