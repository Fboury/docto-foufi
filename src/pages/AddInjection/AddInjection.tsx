import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Loader2,
  Sparkles
} from 'lucide-react';
import { useInjections } from '../../hooks/useInjections';
import { InjectionZone, ReactionType } from '../../types/injection';
import { ALL_BADGES, BadgeConfig } from '../../constants/badges';
import {
  BadgeUnlockModal
} from '../../components/BadgeUnlockModal/BadgeUnlockModal';

// Helper de détection des clés de badges débloqués
const getUnlockedKeys = (items: any[]) => {
  const keys: string[] = [];
  const total = items.length;

  // 1. Jalons globaux
  const GLOBAL_STEPS = [1, 10, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500];
  GLOBAL_STEPS.forEach(step => {
    if (total >= step) keys.push(`total_injections_${step}`);
  });

  // 2. Jalons par zone
  const zoneCounts: Record<string, number> = {};
  items.forEach(i => {
    if (i.zone) zoneCounts[i.zone] = (zoneCounts[i.zone] || 0) + 1;
  });

  [25, 50, 75, 100, 125, 150, 175, 200, 225, 250].forEach(step => {
    if (Object.values(zoneCounts).some(c => c >= step)) {
      keys.push(`zone_master_${step}`);
    }
  });

  // 3. Événements et dates spéciales
  items.forEach(i => {
    if (!i.injected_at) return;
    const d = new Date(i.injected_at);
    const m = d.getUTCMonth() + 1;
    const day = d.getUTCDate();

    if (m === 12 && day === 25) keys.push('christmas_injection');
    if (m === 1 && day === 1) keys.push('new_year_injection');
    if (m === 10 && day === 31) keys.push('halloween_injection');
    if (m === 11 && day === 21) keys.push('bahia_birthday_injection');
    if (m === 7 && day === 4) keys.push('partner_birthday_injection');
    if (m === 12 && day === 1) keys.push('couple_anniversary_injection');
    if (m === 4 && day === 1) keys.push('pacs_anniversary_injection');
    if (m === 8 && day === 1) keys.push('engagement_anniversary_injection');
    if (m === 8 && day === 19) keys.push('test');
  });

  return keys;
};

export const AddInjection: React.FC = () => {
  const navigate = useNavigate();
  const {
    injections,
    recommendedZone,
    zonesWithStats,
    loading,
    addInjectionWithPreviousReaction
  } = useInjections();

  const [selectedZone, setSelectedZone] = useState<InjectionZone>(recommendedZone);
  const [selectedReactions, setSelectedReactions] = useState<ReactionType[]>([]);
  const [reactionDetails, setReactionDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Nouveaux badges débloqués lors du submit
  const [newlyUnlocked, setNewlyUnlocked] = useState<BadgeConfig[]>([]);

  // Mettre à jour la sélection par défaut une fois les données chargées
  useEffect(() => {
    if (recommendedZone) {
      setSelectedZone(recommendedZone);
    }
  }, [recommendedZone]);

  const [injectionDate, setInjectionDate] = useState(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  });

  // Toggle pour la sélection multiple de réactions
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Reconstitution précise de la date ISO locale en conservant l'heure exacte saisie
      const localDate = new Date(injectionDate);
      const formattedDateTime = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000).toISOString();

      const beforeKeys = getUnlockedKeys(injections);

      await addInjectionWithPreviousReaction(
        selectedZone,
        formattedDateTime,
        selectedReactions.length > 0 ? selectedReactions : ['aucune'],
        reactionDetails
      );

      const newEntry = {
        injected_at: formattedDateTime,
        zone: selectedZone,
        reaction_types: selectedReactions.length > 0 ? selectedReactions : ['aucune']
      };

      const updatedInjections = [newEntry, ...injections];
      const afterKeys = getUnlockedKeys(updatedInjections);
      const newlyUnlockedKeys = afterKeys.filter(k => !beforeKeys.includes(k));

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
  const recommendedZoneData = zonesWithStats.find(z => z.id === recommendedZone);

  if (loading) {
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

        <div>
          <h1 className="font-serif text-2xl font-bold text-[#5E4B8B]">Nouvelle
            Injection</h1>
          <p className="text-xs text-[#8E8294]">Saisie du changement de
            pompe</p>
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
              Plus ancienne
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

            {selectedZone !== recommendedZone && (
              <button
                type="button"
                onClick={() => setSelectedZone(recommendedZone)}
                className="rounded-2xl bg-[#5E4B8B] px-3.5 py-2 text-xs font-bold text-white shadow hover:bg-[#4A3B6E]">
                Sélectionner
              </button>
            )}
          </div>
        </div>

        {/* 3. Grille 3x3 Démockée */}
        <div className="space-y-2.5">
          <label
            className="px-1 text-xs font-bold tracking-wider text-[#8E8294] uppercase">Sélectionner
            la zone</label>

          <div className="grid grid-cols-3 gap-2.5">
            {zonesWithStats.map(zone => {
              const isSelected = selectedZone === zone.id;

              return (
                <button
                  key={zone.id}
                  type="button"
                  onClick={() => setSelectedZone(zone.id)}
                  className={`relative flex h-24 flex-col items-center justify-center rounded-2xl p-2 text-center transition-all ${
                    isSelected
                      ? 'font-bold shadow-md ring-2 ring-[#5E4B8B] ring-offset-2 ring-offset-[#F5EFE6]'
                      : 'hover:opacity-95'
                  } ${
                    !zone.isRecent
                      ? 'border border-[#D3C1E5] bg-[#E5D9F2] text-[#5E4B8B]' // Lilas
                      : 'border border-[#DFC8A6] bg-[#EFE3C8] text-[#8C6D46]' // Sable
                  } `}>
                  <span className="mb-0.5 text-xl">{zone.emoji}</span>
                  <span
                    className="text-xs leading-tight font-semibold">{zone.shortLabel}</span>
                  <span className="mt-0.5 text-[10px] font-medium opacity-75">
                    {zone.daysAgo === null ? 'Jamais' : `il y a ${zone.daysAgo} j`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Réaction (Sélection Multiple) */}
        <div
          className="space-y-3 rounded-3xl border border-[#E8DFD8] bg-white p-4.5 shadow-sm">
          <div>
            <h3 className="text-sm font-bold text-[#2D283E]">Injection
              précédente</h3>
            <p className="text-xs text-[#8E8294]">Avez-vous observé une réaction
              sur le dernier site ?</p>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'aucune', label: 'Aucune', emoji: '✨' },
              { id: 'bleu', label: 'Bleu', emoji: '🫐' },
              { id: 'douleur', label: 'Douleur', emoji: '🩹' },
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
                  } `}>
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
          type="submit"
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
