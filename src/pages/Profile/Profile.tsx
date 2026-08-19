import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Award, Calendar, CheckCircle2, Lock } from 'lucide-react';
import { useInjections } from '../../hooks/useInjections';
import { ALL_BADGES } from '../../constants/badges';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { injections } = useInjections();

  // Données fixes pour Bahia Moreau
  const PROFILE_DATA = {
    firstName: 'Bahia',
    lastName: 'Moreau',
    birthDate: '1996-11-21', // 21/11/1996
    displayBirthDate: '21 novembre 1996'
  };

  const [badgeCounts, setBadgeCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (injections) {
      const counts = calculateBadgeCounts(injections);
      setBadgeCounts(counts);
      setLoading(false);
    }
  }, [injections]);

  // Algorithme de calcul des badges (Global, Zone & Événements)
  // Algorithme de calcul des badges (Global, Zone & Événements)
  const calculateBadgeCounts = (items: any[]) => {
    const counts: Record<string, number> = {};
    const total = items.length;

    // 1. Jalons globaux
    const GLOBAL_STEPS = [1, 10, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500];
    GLOBAL_STEPS.forEach(step => {
      if (total >= step) {
        counts[`total_injections_${step}`] = 1;
      }
    });

    // 2. Jalons par zone (tous les 25 jusqu'à 250)
    const zoneCounts: Record<string, number> = {};
    items.forEach(i => {
      if (i.zone) {
        zoneCounts[i.zone] = (zoneCounts[i.zone] || 0) + 1;
      }
    });

    const ZONE_STEPS = [25, 50, 75, 100, 125, 150, 175, 200, 225, 250];
    ZONE_STEPS.forEach(step => {
      const zonesMatchingStep = Object.values(zoneCounts).filter(count => count >= step).length;
      if (zonesMatchingStep > 0) {
        counts[`zone_master_${step}`] = zonesMatchingStep;
      }
    });

    // 3. Dictionnaires des années pour les événements répétables
    const christmasYears = new Set<number>();
    const newYearYears = new Set<number>();
    const halloweenYears = new Set<number>();
    const bahiaBirthdayYears = new Set<number>();
    const partnerBirthdayYears = new Set<number>();
    const coupleAnniversaryYears = new Set<number>();
    const pacsAnniversaryYears = new Set<number>();
    const engagementAnniversaryYears = new Set<number>();

    items.forEach(i => {
      if (!i.injected_at) return;
      const d = new Date(i.injected_at);
      const year = d.getUTCFullYear();
      const month = d.getUTCMonth() + 1;
      const day = d.getUTCDate();

      if (month === 12 && day === 25) christmasYears.add(year);
      if (month === 1 && day === 1) newYearYears.add(year);
      if (month === 10 && day === 31) halloweenYears.add(year);
      if (month === 11 && day === 21) bahiaBirthdayYears.add(year);
      if (month === 7 && day === 4) partnerBirthdayYears.add(year);
      if (month === 12 && day === 1) coupleAnniversaryYears.add(year);
      if (month === 4 && day === 1) pacsAnniversaryYears.add(year);
      if (month === 8 && day === 1) engagementAnniversaryYears.add(year);
    });

    if (christmasYears.size > 0) counts['christmas_injection'] = christmasYears.size;
    if (newYearYears.size > 0) counts['new_year_injection'] = newYearYears.size;
    if (halloweenYears.size > 0) counts['halloween_injection'] = halloweenYears.size;
    if (bahiaBirthdayYears.size > 0) counts['bahia_birthday_injection'] = bahiaBirthdayYears.size;
    if (partnerBirthdayYears.size > 0) counts['partner_birthday_injection'] = partnerBirthdayYears.size;
    if (coupleAnniversaryYears.size > 0) counts['couple_anniversary_injection'] = coupleAnniversaryYears.size;
    if (pacsAnniversaryYears.size > 0) counts['pacs_anniversary_injection'] = pacsAnniversaryYears.size;
    if (engagementAnniversaryYears.size > 0)
      counts['engagement_anniversary_injection'] = engagementAnniversaryYears.size;

    return counts;
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
      {/* TROPHÉES & BADGES */}
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
              // Met les badges débloqués (> 0) au début
              return (countB > 0 ? 1 : 0) - (countA > 0 ? 1 : 0);
            })
            .map(badge => {
              const count = badgeCounts[badge.key] || 0;
              const isUnlocked = count > 0;

              return (
                <div
                  key={badge.key}
                  className={`relative flex flex-col justify-between rounded-2xl border p-3.5 transition-all ${
                    isUnlocked
                      ? 'border-[#E8DFD8] bg-white shadow-xs'
                      : 'border-dashed border-gray-200 bg-gray-50/60 opacity-50'
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
    </div>
  );
};
;
