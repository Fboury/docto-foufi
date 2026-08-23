import React from 'react';
import { useNavigate } from 'react-router';
import {
  Activity,
  ArrowLeft,
  Flame,
  Hash,
  PieChart,
  ShieldAlert,
  ShieldCheck
} from 'lucide-react';
import { useInjections } from '../../hooks/useInjections';
import { ZONES_CONFIG } from '../../types/injection';

export const Stats: React.FC = () => {
  const navigate = useNavigate();
  const { injections, loading } = useInjections();

  if (loading) {
    return (
      <div
        className="mx-auto max-w-xl px-4 py-10 text-center text-xs font-medium text-[#8E8294]">
        Chargement des statistiques...
      </div>
    );
  }

  const totalInjections = injections.length;

  if (totalInjections === 0) {
    return (
      <div className="mx-auto max-w-xl space-y-6 px-4 py-6">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-xs font-bold text-[#8E8294] transition-colors hover:text-[#5E4B8B]">
          <ArrowLeft className="h-4 w-4" />
          <span>Retour au tableau de bord</span>
        </button>
        <div
          className="rounded-3xl border border-[#E8DFD8] bg-white p-8 text-center text-xs font-medium text-[#8E8294]">
          Aucune donnée disponible pour générer des statistiques.
        </div>
      </div>
    );
  }

  // --- 1. CALCUL DES RÉACTIONS ---
  // --- 1. CALCUL DES RÉACTIONS (Gère la sélection multiple reaction_types) ---
  // --- 1. CALCUL DES RÉACTION (Compatible TypeScript & rétrocompatible) ---
  const reactionCounts = {
    aucune: injections.filter(
      (i: any) =>
        (!i.reaction_types || i.reaction_types.length === 0 || i.reaction_types.includes('aucune')) &&
        (!i.reaction_type || i.reaction_type === 'aucune')
    ).length,
    bleu: injections.filter((i: any) => i.reaction_types?.includes('bleu') || i.reaction_type === 'bleu').length,
    douleur: injections.filter((i: any) => i.reaction_types?.includes('douleur') || i.reaction_type === 'douleur')
      .length,
    sang: injections.filter((i: any) => i.reaction_types?.includes('sang') || i.reaction_type === 'sang').length,
    autre: injections.filter((i: any) => i.reaction_types?.includes('autre') || i.reaction_type === 'autre').length
  };

  const toleranceRate = Math.round((reactionCounts.aucune / totalInjections) * 100);

  // Statistiques par zone
  const zoneStatsMap = ZONES_CONFIG.map(zone => {
    const zoneInjections = injections.filter(i => i.zone === zone.id);
    const count = zoneInjections.length;
    const reactionsCount = zoneInjections.filter(i => i.reaction_type && i.reaction_type !== 'aucune').length;
    const reactionRate = count > 0 ? (reactionsCount / count) * 100 : 0;

    return {
      ...zone,
      count,
      reactionsCount,
      reactionRate: Math.round(reactionRate)
    };
  });

  const activeZoneStats = zoneStatsMap.filter(z => z.count > 0);

  // --- TOP 1 SOLLICITATION (GESTION DES ÉGALITÉS) ---
  const maxInjectionsCount = Math.max(...zoneStatsMap.map(z => z.count), 0);
  const top1Zones = zoneStatsMap.filter(z => z.count === maxInjectionsCount && maxInjectionsCount > 0);

  // Zone la plus tolérante
  const mostTolerantZone = [...activeZoneStats].sort((a, b) => a.reactionRate - b.reactionRate || b.count - a.count)[0];

  // Zone la plus sensible
  const mostSensitiveZone = [...activeZoneStats].sort(
    (a, b) => b.reactionRate - a.reactionRate || b.reactionsCount - a.reactionsCount
  )[0];

  const averageInjectionsPerZone = totalInjections / ZONES_CONFIG.length;

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
        <h1
          className="font-serif text-2xl font-bold text-[#5E4B8B]">Statistiques</h1>
      </div>

      {/* SECTION 1 : VUE D'ENSEMBLE */}
      <div className="space-y-3">
        <div
          className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-[#8E8294] uppercase">
          <Hash className="h-3.5 w-3.5" />
          <span>Vue d'ensemble</span>
        </div>

        <div
          className="flex items-center justify-between rounded-3xl border border-[#E8DFD8] bg-white p-5 shadow-xs">
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-[#8E8294]">Total des injections enregistrées</span>
            <p className="text-3xl font-bold text-[#5E4B8B]">
              {totalInjections}{' '}
              <span
                className="text-sm font-normal text-[#8E8294]">piqûre{totalInjections > 1 ? 's' : ''}</span>
            </p>
          </div>
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F5EFE6] text-2xl">
            💉
          </div>
        </div>
      </div>

      {/* SECTION 2 : ZONES LES PLUS SOLLICITÉES */}
      {top1Zones.length > 0 && (
        <div className="space-y-3">
          <div
            className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-[#8E8294] uppercase">
            <Flame className="h-3.5 w-3.5" />
            <span>{top1Zones.length > 1 ? 'Zones les plus sollicitées' : 'Zone la plus sollicitée'}</span>
          </div>

          <div
            className="space-y-3 rounded-3xl border border-[#E8DFD8] bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span
                className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                {maxInjectionsCount} piqûres {top1Zones.length > 1 ? 'chacune' : ''}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {top1Zones.map(z => (
                <div
                  key={z.id}
                  className="flex items-center gap-2 rounded-2xl border border-[#E8DFD8] bg-[#F5EFE6] px-3 py-2">
                  <span className="text-base">{z.emoji}</span>
                  <div className="flex flex-col">
                    <span
                      className="text-xs font-bold text-[#2D283E]">{z.fullLabel}</span>
                    <span className="text-[10px] text-[#8E8294]">
                      {Math.round((maxInjectionsCount / totalInjections) * 100)}% du total
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3 : ANALYSE DES RÉACTIONS */}
      <div className="space-y-3">
        <div
          className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-[#8E8294] uppercase">
          <Activity className="h-3.5 w-3.5" />
          <span>Analyse des réactions</span>
        </div>

        <div
          className="space-y-4 rounded-3xl border border-[#E8DFD8] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-[#8E8294]">Taux d'injections sans réaction</span>
              <p
                className="text-3xl font-bold text-[#5E4B8B]">{toleranceRate}%</p>
            </div>
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F5EFE6] text-2xl">✨
            </div>
          </div>

          {/* Barre de répartition globale */}
          <div className="space-y-1.5">
            <div
              className="flex h-3 w-full overflow-hidden rounded-full bg-gray-100">
              {/* Aucune réaction : Vert émeraude */}
              <div
                style={{ width: `${(reactionCounts.aucune / totalInjections) * 100}%` }}
                className="bg-emerald-400"
                title="Aucune"
              />
              {/* Bleu : Bleu doux */}
              <div
                style={{ width: `${(reactionCounts.bleu / totalInjections) * 100}%` }}
                className="bg-blue-400"
                title="Bleu"
              />
              {/* Douleur : Rose vif */}
              <div
                style={{ width: `${(reactionCounts.douleur / totalInjections) * 100}%` }}
                className="bg-rose-400"
                title="Douleur"
              />
              {/* Sang : Rouge rubis / Sang */}
              <div
                style={{ width: `${(reactionCounts.sang / totalInjections) * 100}%` }}
                className="bg-red-600"
                title="Sang"
              />
              {/* Autre : Violet / Ambre doux */}
              <div
                style={{ width: `${(reactionCounts.autre / totalInjections) * 100}%` }}
                className="bg-amber-400"
                title="Autre"
              />
            </div>

            {/* Légende */}
            <div
              className="flex flex-wrap gap-3 pt-1 text-[11px] text-[#2D283E]">
              <span className="flex items-center gap-1 font-medium">
                <span className="h-2 w-2 rounded-full bg-emerald-400" /> ✨ Aucune ({reactionCounts.aucune})
              </span>
              <span className="flex items-center gap-1 font-medium">
                <span
                  className="h-2 w-2 rounded-full bg-blue-400" /> 🫐 Bleu ({reactionCounts.bleu})
              </span>
              <span className="flex items-center gap-1 font-medium">
                <span className="h-2 w-2 rounded-full bg-rose-400" /> 🩹 Douleur ({reactionCounts.douleur})
              </span>
              {reactionCounts.sang > 0 && (
                <span className="flex items-center gap-1 font-medium">
                  <span
                    className="h-2 w-2 rounded-full bg-red-600" /> 🩸 Sang ({reactionCounts.sang})
                </span>
              )}
              {reactionCounts.autre > 0 && (
                <span className="flex items-center gap-1 font-medium">
                  <span className="h-2 w-2 rounded-full bg-amber-400" /> 💬 Autre ({reactionCounts.autre})
                </span>
              )}
            </div>
          </div>

          {/* Zones : Tolérante vs Sensible */}
          <div
            className="grid grid-cols-2 gap-3 border-t border-[#F5EFE6] pt-4">
            {mostTolerantZone && (
              <div
                className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-3">
                <div
                  className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Zone idéale</span>
                </div>
                <p className="mt-1 text-sm font-bold text-[#2D283E]">
                  {mostTolerantZone.emoji} {mostTolerantZone.fullLabel}
                </p>
                <p className="mt-0.5 text-[10px] text-emerald-700">
                  {100 - mostTolerantZone.reactionRate}% sans réaction
                </p>
              </div>
            )}

            {mostSensitiveZone && (
              <div
                className="rounded-2xl border border-rose-100 bg-rose-50/50 p-3">
                <div
                  className="flex items-center gap-1.5 text-xs font-bold text-rose-800">
                  <ShieldAlert className="h-4 w-4" />
                  <span>Zone sensible</span>
                </div>
                <p className="mt-1 text-sm font-bold text-[#2D283E]">
                  {mostSensitiveZone.emoji} {mostSensitiveZone.fullLabel}
                </p>
                <p className="mt-0.5 text-[10px] text-rose-700">
                  {mostSensitiveZone.reactionRate}% de réactions
                  ({mostSensitiveZone.reactionsCount})
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 4 : REPARTITION ET EQUILIBRE */}
      <div className="space-y-3">
        <div
          className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-[#8E8294] uppercase">
          <PieChart className="h-3.5 w-3.5" />
          <span>Répartition et équilibre des zones</span>
        </div>

        <div
          className="space-y-3 rounded-3xl border border-[#E8DFD8] bg-white p-5 shadow-xs">
          <p className="text-xs text-[#8E8294]">
            Moyenne théorique :{' '}
            <span
              className="font-bold text-[#2D283E]">{Math.round(averageInjectionsPerZone)} injections</span> par
            zone.
          </p>

          <div className="space-y-3 pt-2">
            {zoneStatsMap.map(zone => {
              const usagePercent = Math.round((zone.count / totalInjections) * 100);
              const barWidth = Math.round((zone.count / maxInjectionsCount) * 100);

              const isTop1 = zone.count === maxInjectionsCount && maxInjectionsCount > 0;
              const isOverused = zone.count > averageInjectionsPerZone * 1.35;
              const isUnderused = zone.count < averageInjectionsPerZone * 0.65;

              return (
                <div
                  key={zone.id}
                  className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#2D283E]">
                      {zone.emoji} {zone.fullLabel}
                    </span>
                    <div className="flex items-center gap-2">
                      {isTop1 && (
                        <span
                          className="py-0.2 rounded-md bg-amber-100 px-1.5 text-[10px] font-bold text-amber-800">
                          Top 1
                        </span>
                      )}
                      {!isTop1 && isOverused && (
                        <span
                          className="py-0.2 rounded-md bg-amber-50 px-1.5 text-[10px] font-medium text-amber-700">
                          Sollicitée
                        </span>
                      )}
                      {isUnderused && (
                        <span
                          className="py-0.2 rounded-md bg-blue-50 px-1.5 text-[10px] font-medium text-blue-700">
                          À privilégier
                        </span>
                      )}
                      <span className="font-semibold text-[#5E4B8B]">
                        {zone.count} <span
                        className="text-[10px] text-[#8E8294]">({usagePercent}%)</span>
                      </span>
                    </div>
                  </div>

                  <div
                    className="flex h-2 w-full overflow-hidden rounded-full bg-[#F5EFE6]">
                    <div
                      style={{ width: `${barWidth}%` }}
                      className={`rounded-full transition-all duration-300 ${
                        isTop1 ? 'bg-amber-500' : isOverused ? 'bg-amber-400' : 'bg-[#5E4B8B]'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
;
;
