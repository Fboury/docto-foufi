import React from 'react';
import { useNavigate } from 'react-router';
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  PieChart,
  TrendingUp
} from 'lucide-react';
import { useInjections } from '../../hooks/useInjections';
import { ReactionType, ZONES_CONFIG } from '../../types/injection';

export const Stats: React.FC = () => {
  const navigate = useNavigate();
  const { injections, loading } = useInjections();

  // 1. Calculs globaux
  const totalInjections = injections.length;
  const injectionsWithReaction = injections.filter(i => i.reaction_type && i.reaction_type !== 'aucune');
  const reactionRate = totalInjections > 0 ? Math.round((injectionsWithReaction.length / totalInjections) * 100) : 0;

  // 2. Décomptes par type de réaction
  const reactionCounts: Record<ReactionType, number> = {
    aucune: 0,
    bleu: 0,
    douleur: 0,
    autre: 0
  };

  injections.forEach(item => {
    if (item.reaction_type && reactionCounts[item.reaction_type] !== undefined) {
      reactionCounts[item.reaction_type]++;
    }
  });

  // 3. Décomptes et sensibilité par zone
  const zoneStatsMap = ZONES_CONFIG.map(zone => {
    const zoneInjections = injections.filter(i => i.zone === zone.id);
    const count = zoneInjections.length;
    const reactionsCount = zoneInjections.filter(i => i.reaction_type && i.reaction_type !== 'aucune').length;

    const reactionPercentage = count > 0 ? Math.round((reactionsCount / count) * 100) : 0;

    return {
      ...zone,
      count,
      reactionsCount,
      reactionPercentage
    };
  });

  // Trier les zones les plus sollicitées
  const sortedByCount = [...zoneStatsMap].sort((a, b) => b.count - a.count);
  const mostUsedZone = sortedByCount[0]?.count > 0 ? sortedByCount[0] : null;

  return (
    <div className="mx-auto max-w-xl space-y-6 px-4 py-6 pb-12">
      {/* En-tête & Navigation */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-xs font-bold text-[#8E8294] transition-colors hover:text-[#5E4B8B]">
          <ArrowLeft className="h-4 w-4" />
          <span>Retour au tableau de bord</span>
        </button>

        <div>
          <h1
            className="font-serif text-2xl font-bold text-[#5E4B8B]">Statistiques</h1>
          <p className="text-xs text-[#8E8294]">Analyse de la rotation et de la
            tolérance des zones</p>
        </div>
      </div>

      {loading ? (
        <div
          className="py-12 text-center text-xs font-medium text-[#8E8294]">Analyse
          des données en cours...</div>
      ) : totalInjections === 0 ? (
        <div
          className="space-y-2 rounded-3xl border border-[#E8DFD8] bg-white p-8 text-center">
          <PieChart className="mx-auto h-8 w-8 text-[#8E8294] opacity-50" />
          <p className="text-sm font-bold text-[#2D283E]">Aucune donnée à
            analyser</p>
          <p className="text-xs text-[#8E8294]">
            Enregistrez vos premières injections pour visualiser les
            statistiques de rotation.
          </p>
        </div>
      ) : (
        <>
          {/* Cartes KPI synthétiques */}
          <div className="grid grid-cols-2 gap-3">
            <div
              className="space-y-1 rounded-3xl border border-[#E8DFD8] bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between text-[#5E4B8B]">
                <Activity className="h-5 w-5" />
                <span
                  className="rounded-full bg-[#F5EFE6] px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase">
                  Total
                </span>
              </div>
              <p
                className="text-2xl font-bold text-[#2D283E]">{totalInjections}</p>
              <p className="text-[11px] font-medium text-[#8E8294]">Injections
                enregistrées</p>
            </div>

            <div
              className="space-y-1 rounded-3xl border border-[#E8DFD8] bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between text-[#5E4B8B]">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <span
                  className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold tracking-wider text-amber-700 uppercase">
                  Sensibilité
                </span>
              </div>
              <p
                className="text-2xl font-bold text-[#2D283E]">{reactionRate}%</p>
              <p className="text-[11px] font-medium text-[#8E8294]">Taux de
                réactions observées</p>
            </div>
          </div>

          {/* Focus : Zone la plus utilisée */}
          {mostUsedZone && (
            <div
              className="flex items-center justify-between rounded-3xl border border-[#D3C1E5] bg-[#E5D9F2] p-4.5 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{mostUsedZone.emoji}</span>
                <div>
                  <p
                    className="text-[10px] font-bold tracking-wider text-[#5E4B8B] uppercase">
                    Zone la plus sollicitée
                  </p>
                  <p
                    className="text-sm font-bold text-[#2D283E]">{mostUsedZone.fullLabel}</p>
                  <p className="mt-0.5 text-xs font-medium text-[#5E4B8B]">
                    Utilisée {mostUsedZone.count} fois
                    ({Math.round((mostUsedZone.count / totalInjections) * 100)}%
                    des
                    piqûres)
                  </p>
                </div>
              </div>
              <TrendingUp className="h-5 w-5 text-[#5E4B8B] opacity-60" />
            </div>
          )}

          {/* Répartition des types de réaction */}
          <div
            className="space-y-4 rounded-3xl border border-[#E8DFD8] bg-white p-5 shadow-sm">
            <h3 className="text-sm font-bold text-[#2D283E]">Bilan des
              réactions</h3>

            {/* Barre de répartition empilée */}
            <div
              className="flex h-4 w-full overflow-hidden rounded-full bg-[#F5EFE6]">
              <div
                style={{ width: `${(reactionCounts.aucune / totalInjections) * 100}%` }}
                className="h-full bg-emerald-400 transition-all"
                title="Aucune"
              />
              <div
                style={{ width: `${(reactionCounts.bleu / totalInjections) * 100}%` }}
                className="h-full bg-blue-400 transition-all"
                title="Bleu"
              />
              <div
                style={{ width: `${(reactionCounts.douleur / totalInjections) * 100}%` }}
                className="h-full bg-rose-400 transition-all"
                title="Douleur"
              />
              <div
                style={{ width: `${(reactionCounts.autre / totalInjections) * 100}%` }}
                className="h-full bg-amber-400 transition-all"
                title="Autre"
              />
            </div>

            {/* Légende */}
            <div
              className="grid grid-cols-2 gap-2 pt-1 text-xs font-semibold text-[#2D283E]">
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 shrink-0 rounded-full bg-emerald-400" />
                <span>Aucune ({reactionCounts.aucune})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 shrink-0 rounded-full bg-blue-400" />
                <span>Bleu ({reactionCounts.bleu})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 shrink-0 rounded-full bg-rose-400" />
                <span>Douleur ({reactionCounts.douleur})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 shrink-0 rounded-full bg-amber-400" />
                <span>Autre ({reactionCounts.autre})</span>
              </div>
            </div>
          </div>

          {/* Sensibilité détaillée par zone */}
          <div
            className="space-y-3 rounded-3xl border border-[#E8DFD8] bg-white p-5 shadow-sm">
            <h3 className="text-sm font-bold text-[#2D283E]">Détail par
              zone</h3>

            <div className="space-y-2.5">
              {zoneStatsMap.map(zone => (
                <div
                  key={zone.id}
                  className="flex items-center justify-between rounded-2xl border border-[#E8DFD8]/60 bg-[#F5EFE6] p-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{zone.emoji}</span>
                    <div>
                      <p
                        className="font-bold text-[#2D283E]">{zone.shortLabel}</p>
                      <p className="text-[11px] text-[#8E8294]">
                        {zone.count === 0 ? 'Jamais utilisée' : `${zone.count} piqûre${zone.count > 1 ? 's' : ''}`}
                      </p>
                    </div>
                  </div>

                  {zone.count > 0 ? (
                    <div className="text-right">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          zone.reactionsCount === 0
                            ? 'bg-emerald-100 text-emerald-800'
                            : zone.reactionPercentage > 30
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                        }`}>
                        {zone.reactionsCount === 0 ? '100% Ok' : `${zone.reactionPercentage}% réac.`}
                      </span>
                    </div>
                  ) : (
                    <span
                      className="text-[10px] font-medium text-[#8E8294] italic">Inutilisée</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
