import React from 'react';
import { useNavigate } from 'react-router';
import { useInjections } from '../../hooks/useInjections';
import { ZONES_CONFIG } from '../../types/injection';
import {
  ChevronRight,
  Clock,
  History,
  Loader2,
  PlusCircle,
  Sparkles,
  Syringe
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    recommendedZone,
    zonesWithStats,
    injections,
    loading
  } = useInjections();

  const recommendedZoneData = zonesWithStats.find(z => z.id === recommendedZone);
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
          onClick={() => navigate('/historique')}
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
              <PlusCircle className="h-6 w-6 text-white/80" />
            </div>

            <div className="flex items-center justify-between pt-1">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl">{recommendedZoneData?.emoji}</span>
                  <h2
                    className="text-2xl font-bold">{recommendedZoneData?.fullLabel}</h2>
                </div>
                <p className="mt-1 text-xs text-white/70">
                  {recommendedZoneData?.daysAgo === null
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
              className="flex items-center justify-between rounded-3xl border border-[#E8DFD8] bg-white p-4 shadow-sm">
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
              <span className="text-xs text-[#8E8294]">
                {new Date(lastInjection.injected_at).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};
