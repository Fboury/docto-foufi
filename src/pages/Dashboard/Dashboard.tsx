import React from 'react';
import { useNavigate } from 'react-router';
import { useInjections } from '../../hooks/useInjections';

import { usePlannedInjections } from '../../hooks/usePlannedInjections';
import { ZONES_CONFIG } from '../../types/injection';
import { NextInjectionTile } from './components/NextInjectionTile';
import { OrderAlertTile } from './components/OrderAlertTile';
import { StockWidgetTile } from './components/StockWidgetTile';
import {
  ChevronRight,
  Clock,
  History,
  Loader2,
  Lock,
  PlusCircle,
  Sparkles,
  Syringe
} from 'lucide-react';
import { PlanningWidgetTile } from './components/PlanningWidgetTile';
import { formatTime } from '../../utils/dateUtils';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { zonesWithStats, injections, loading } = useInjections();
  const { reservedZoneIds } = usePlannedInjections();

  // Trouver la zone recommandée non réservée
  const recommendedZoneData =
    [...zonesWithStats]
      .filter(z => !reservedZoneIds.includes(z.id))
      .sort((a, b) => {
        if (a.daysAgo === null) return -1;
        if (b.daysAgo === null) return 1;
        return b.daysAgo - a.daysAgo;
      })[0] || zonesWithStats[0];
  const lastInjection = injections[0];

  return (
    <div className="mx-auto max-w-xl space-y-6 px-4 py-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="font-serif text-2xl font-bold text-[#5E4B8B]">DoctoFoufi</h1>
          <p className="text-xs text-[#8E8294]">Suivi quotidien de pompe à
            magnésium</p>
        </div>

        <button
          onClick={() => navigate('/history')}
          className="rounded-2xl border border-[#E8DFD8] bg-white p-2.5 text-[#5E4B8B] transition-all hover:bg-[#F5EFE6]"
          title="Consulter l'historique">
          <History className="h-5 w-5" />
        </button>
      </div>

      {/* LOADER PENDANT LE CHARGEMENT DES DONNÉES SUPABASE */}
      {loading ? (
        <div
          className="flex animate-pulse flex-col items-center justify-center space-y-3 rounded-3xl border border-[#E8DFD8] bg-white p-8 shadow-sm">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#E5D9F2] text-[#5E4B8B]">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
          <p className="text-xs font-bold text-[#5E4B8B]">Calcul de la meilleure
            zone...</p>
        </div>
      ) : (
        <>
          <NextInjectionTile lastInjection={lastInjection} />

          {/* CARTE D'ACTION PRINCIPALE */}
          <div
            onClick={() => navigate('/ajout-injection')}
            className="cursor-pointer space-y-4 rounded-3xl bg-gradient-to-br from-[#5E4B8B] to-[#4A3B6E] p-5 text-white shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99]">
            <div className="flex items-center justify-between">
              <div
                className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                <span className="text-[11px] font-bold tracking-wide uppercase">Zone recommandée</span>
              </div>

              {/* Indicateur si le planning filtre des zones */}
              {reservedZoneIds.length > 0 ? (
                <div
                  className="flex items-center gap-1.5 rounded-full bg-amber-400/20 px-2.5 py-1 text-[10px] font-bold text-amber-200 backdrop-blur-sm">
                  <Lock className="h-3 w-3" />
                  <span>Planning pris en compte</span>
                </div>
              ) : (
                <PlusCircle className="h-6 w-6 text-white/80" />
              )}
            </div>

            <div className="flex items-center justify-between pt-1">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl">{recommendedZoneData?.emoji}</span>
                  <h2
                    className="text-2xl font-bold">{recommendedZoneData?.fullLabel}</h2>
                </div>
                <p className="mt-1 text-xs text-white/70">
                  {recommendedZoneData?.daysAgo === null || recommendedZoneData?.daysAgo === undefined
                    ? 'Jamais injecté ici'
                    : `Dernière injection : il y a ${recommendedZoneData?.daysAgo} jours`}
                </p>
              </div>
              <ChevronRight className="h-6 w-6 text-white/50" />
            </div>

            <div
              className="flex items-center justify-center gap-2 border-t border-white/10 pt-2 text-xs font-bold text-amber-200">
              <Syringe className="h-4 w-4" />
              <span>Saisir l'injection du jour</span>
            </div>
          </div>

          {/* Aperçu de la dernière injection */}
          {lastInjection && (
            <div
              className="flex items-center justify-between rounded-3xl border border-[#E8DFD8] bg-white p-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F5EFE6] text-[#5E4B8B]">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-[#8E8294]">Dernière
                    saisie</p>
                  <p className="text-xs font-bold text-[#2D283E]">
                    {ZONES_CONFIG.find(z => z.id === lastInjection.zone)?.fullLabel}
                  </p>
                </div>
              </div>
              <span
                className="text-xs font-semibold text-[#8E8294]">{formatTime(lastInjection.injected_at)}</span>
            </div>
          )}

          <OrderAlertTile />
          <StockWidgetTile />
          <PlanningWidgetTile />
        </>
      )}
    </div>
  );
};
;
