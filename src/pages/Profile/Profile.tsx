import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  AlertCircle,
  ArrowLeft,
  Award,
  Calendar,
  CheckCircle2,
  Lock,
  RefreshCw,
  ShoppingBag
} from 'lucide-react';
import { useInjections } from '../../hooks/useInjections';
import { ALL_BADGES, BadgeConfig } from '../../constants/badges';
import { useOrders } from '../../hooks/useOrders';
import { BadgeDetailModal } from './components/BadgeDetailModal';

export const Profile: React.FC = () => {
  const [selectedBadge, setSelectedBadge] = useState<{
    badge: BadgeConfig;
    unlockedDates: string[];
  } | null>(null);

  const navigate = useNavigate();
  const { injections } = useInjections();
  const { nhcStats, pharmacyStats, updateOrder } = useOrders();

  const PROFILE_DATA = {
    firstName: 'Bahia',
    lastName: 'Moreau',
    birthDate: '1996-11-21',
    displayBirthDate: '21 novembre 1996'
  };

  const [badgeCounts, setBadgeCounts] = useState<Record<string, number>>({});
  const [badgeAllDates, setBadgeAllDates] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (injections) {
      const { counts, allDates } = calculateBadgeStats(injections);
      setBadgeCounts(counts);
      setBadgeAllDates(allDates);
      setLoading(false);
    }
  }, [injections]);

  const calculateBadgeStats = (items: any[]) => {
    const counts: Record<string, number> = {};
    const allDates: Record<string, string[]> = {};
    const total = items.length;

    // Trier les injections de la plus récente à la plus ancienne pour l'historique
    const sortedInjectionsDesc = [...items].sort(
      (a, b) => new Date(b.injected_at).getTime() - new Date(a.injected_at).getTime()
    );
    const sortedInjectionsAsc = [...items].sort(
      (a, b) => new Date(a.injected_at).getTime() - new Date(b.injected_at).getTime()
    );

    const recordBadge = (key: string, dateIso: string) => {
      counts[key] = (counts[key] || 0) + 1;
      if (!allDates[key]) allDates[key] = [];
      allDates[key].push(dateIso);
    };

    // 1. Jalons globaux
    const GLOBAL_STEPS = [1, 10, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500];
    GLOBAL_STEPS.forEach(step => {
      if (total >= step && sortedInjectionsAsc[step - 1]) {
        counts[`total_injections_${step}`] = 1;
        allDates[`total_injections_${step}`] = [sortedInjectionsAsc[step - 1].injected_at];
      }
    });

    // 2. Jalons par zone
    const zoneCounts: Record<string, number> = {};
    const ZONE_STEPS = [25, 50, 75, 100, 125, 150, 175, 200, 225, 250];

    sortedInjectionsAsc.forEach(i => {
      if (i.zone) {
        zoneCounts[i.zone] = (zoneCounts[i.zone] || 0) + 1;
        const currentZoneCount = zoneCounts[i.zone];

        ZONE_STEPS.forEach(step => {
          if (currentZoneCount === step) {
            recordBadge(`zone_master_${step}`, i.injected_at);
          }
        });
      }
    });

    // 3. Événements répétables (triés du plus récent au plus ancien)
    sortedInjectionsDesc.forEach(i => {
      if (!i.injected_at) return;
      const d = new Date(i.injected_at);
      const month = d.getUTCMonth() + 1;
      const day = d.getUTCDate();

      if (month === 12 && day === 25) recordBadge('christmas_injection', i.injected_at);
      if (month === 1 && day === 1) recordBadge('new_year_injection', i.injected_at);
      if (month === 10 && day === 31) recordBadge('halloween_injection', i.injected_at);
      if (month === 11 && day === 21) recordBadge('bahia_birthday_injection', i.injected_at);
      if (month === 7 && day === 4) recordBadge('partner_birthday_injection', i.injected_at);
      if (month === 12 && day === 1) recordBadge('couple_anniversary_injection', i.injected_at);
      if (month === 4 && day === 1) recordBadge('pacs_anniversary_injection', i.injected_at);
      if (month === 8 && day === 1) recordBadge('engagement_anniversary_injection', i.injected_at);
      if (month === 8 && day === 19) recordBadge('test', i.injected_at);
    });

    return { counts, allDates };
  };

  if (loading) {
    return (
      <div
        className="mx-auto max-w-xl px-4 py-10 text-center text-xs text-[#8E8294]">Chargement
        du profil...</div>
    );
  }

  const unlockedTotal = Object.keys(badgeCounts).length;

  return (
    <div className="mx-auto max-w-xl space-y-6 px-4 py-6">
      {/* En-tête */}
      <div className="space-y-1">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-xs font-bold text-[#8E8294] transition-colors hover:text-[#5E4B8B]">
          <ArrowLeft className="h-4 w-4" />
          <span>Retour au tableau de bord</span>
        </button>
        <h1 className="font-serif text-2xl font-bold text-[#5E4B8B]">Mon
          Profil</h1>
      </div>

      {/* TUILE DONNÉES FIXES */}
      <div
        className="space-y-4 rounded-3xl border border-[#E8DFD8] bg-white p-5 shadow-xs">
        <div className="flex items-center gap-3 border-b border-[#F5EFE6] pb-3">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F5EFE6] text-xl font-bold text-[#5E4B8B]">
            {PROFILE_DATA.firstName.charAt(0)}
            {PROFILE_DATA.lastName.charAt(0)}
          </div>
          <div>
            <h2 className="text-base font-bold text-[#2D283E]">
              {PROFILE_DATA.firstName} {PROFILE_DATA.lastName}
            </h2>
            <p className="text-xs text-[#8E8294]">Utilisatrice DoctoFoufi</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 text-xs text-[#2D283E]">
          <Calendar className="h-4 w-4 text-[#5E4B8B]" />
          <span
            className="font-medium">Née le {PROFILE_DATA.displayBirthDate}</span>
        </div>
      </div>

      {/* SECTION COMMANDES DE MÉDICAMENTS */}
      <div className="space-y-2.5">
        <div
          className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-[#8E8294] uppercase">
          <ShoppingBag className="h-3.5 w-3.5" />
          <span>Commandes mensuelles (tous les 30j)</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* TUILE NHC */}
          <div
            className={`space-y-2.5 rounded-3xl border p-4 transition-all ${
              nhcStats.isWarning ? 'border-amber-300 bg-amber-50/60' : 'border-[#E8DFD8] bg-white'
            }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#2D283E]">NHC</span>
              {nhcStats.isDue ? (
                <span
                  className="flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-[9px] font-extrabold text-rose-700">
                  <AlertCircle className="h-3 w-3" /> À faire !
                </span>
              ) : nhcStats.isWarning ? (
                <span
                  className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-extrabold text-amber-800">
                  J-{nhcStats.daysLeft}
                </span>
              ) : (
                <span
                  className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-extrabold text-emerald-700">
                  OK ({nhcStats.daysLeft}j)
                </span>
              )}
            </div>

            <div className="space-y-0.5">
              <p className="text-[10px] text-[#8E8294]">Prochaine commande :</p>
              <p
                className="text-sm font-bold text-[#5E4B8B]">{nhcStats.nextDateStr}</p>
            </div>

            <button
              type="button"
              onClick={() => {
                if (confirm('Confirmer que la commande NHC a été effectuée aujourd\'hui ?')) {
                  updateOrder('nhc');
                }
              }}
              className="flex w-full items-center justify-center gap-1.5 rounded-2xl bg-[#5E4B8B] py-2 text-[11px] font-bold text-white transition-all hover:bg-[#4A3B70]">
              <RefreshCw className="h-3 w-3" />
              <span>Renouveler</span>
            </button>
          </div>

          {/* TUILE PHARMACIE */}
          <div
            className={`space-y-2.5 rounded-3xl border p-4 transition-all ${
              pharmacyStats.isWarning ? 'border-amber-300 bg-amber-50/60' : 'border-[#E8DFD8] bg-white'
            }`}>
            <div className="flex items-center justify-between">
              <span
                className="text-xs font-extrabold text-[#2D283E]">Pharmacie</span>
              {pharmacyStats.isDue ? (
                <span
                  className="flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-[9px] font-extrabold text-rose-700">
                  <AlertCircle className="h-3 w-3" /> À faire !
                </span>
              ) : pharmacyStats.isWarning ? (
                <span
                  className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-extrabold text-amber-800">
                  J-{pharmacyStats.daysLeft}
                </span>
              ) : (
                <span
                  className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-extrabold text-emerald-700">
                  OK ({pharmacyStats.daysLeft}j)
                </span>
              )}
            </div>

            <div className="space-y-0.5">
              <p className="text-[10px] text-[#8E8294]">Prochaine commande :</p>
              <p
                className="text-sm font-bold text-[#5E4B8B]">{pharmacyStats.nextDateStr}</p>
            </div>

            <button
              type="button"
              onClick={() => {
                if (confirm('Confirmer que la commande Pharmacie a été effectuée aujourd\'hui ?')) {
                  updateOrder('pharmacy');
                }
              }}
              className="flex w-full items-center justify-center gap-1.5 rounded-2xl bg-[#5E4B8B] py-2 text-[11px] font-bold text-white transition-all hover:bg-[#4A3B70]">
              <RefreshCw className="h-3 w-3" />
              <span>Renouveler</span>
            </button>
          </div>
        </div>
      </div>

      {/* TROPHÉES & BADGES */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-2 text-xs font-bold tracking-wider text-[#8E8294] uppercase">
            <Award className="h-4 w-4" />
            <span>Mes Trophées</span>
          </div>
          <span
            className="rounded-full bg-[#F5EFE6] px-2.5 py-0.5 text-xs font-bold text-[#5E4B8B]">
            {unlockedTotal} / {ALL_BADGES.length} débloqués
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[...ALL_BADGES]
            .sort((a, b) => {
              const countA = badgeCounts[a.key] || 0;
              const countB = badgeCounts[b.key] || 0;
              return (countB > 0 ? 1 : 0) - (countA > 0 ? 1 : 0);
            })
            .map(badge => {
              const count = badgeCounts[badge.key] || 0;
              const isUnlocked = count > 0;
              const dates = badgeAllDates[badge.key] || [];

              return (
                <div
                  key={badge.key}
                  onClick={() => {
                    if (isUnlocked) {
                      setSelectedBadge({ badge, unlockedDates: dates });
                    }
                  }}
                  className={`relative flex flex-col justify-between rounded-2xl border p-3.5 transition-all ${
                    isUnlocked
                      ? 'cursor-pointer border-[#E8DFD8] bg-white shadow-xs hover:border-[#5E4B8B] hover:shadow-md active:scale-95'
                      : 'cursor-not-allowed border-dashed border-gray-200 bg-gray-50/60 opacity-50'
                  }`}>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{badge.emoji}</span>
                      {isUnlocked ? (
                        <div className="flex items-center gap-1">
                          {count > 1 && (
                            <span
                              className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-extrabold text-amber-800">
                              x{count}
                            </span>
                          )}
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        </div>
                      ) : (
                        <Lock className="h-3.5 w-3.5 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h3
                        className="text-xs font-bold text-[#2D283E]">{badge.title}</h3>
                      <p
                        className="mt-0.5 text-[10px] leading-tight text-[#8E8294]">{badge.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Modale de Détail du Badge au clic */}
      {selectedBadge && (
        <BadgeDetailModal
          badge={selectedBadge.badge}
          unlockedDates={selectedBadge.unlockedDates}
          onClose={() => setSelectedBadge(null)}
        />
      )}
    </div>
  );
};
