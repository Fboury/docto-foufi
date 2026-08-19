import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { InjectionEntry } from '../../../types/injection';

interface NextInjectionTileProps {
  lastInjection: InjectionEntry | null;
}

export const NextInjectionTile: React.FC<NextInjectionTileProps> = ({ lastInjection }) => {
  const [now, setNow] = useState(new Date());

  // Mise à jour du temps chaque minute pour garder le décompte précis
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  if (!lastInjection) {
    return null;
  }

  // Parse de la date Supabase en UTC pur
  const lastTime = new Date(lastInjection.injected_at).getTime();

  // Temps actuel ajusté en UTC pour éviter tout décalage avec la date Supabase
  const currentTime = now.getTime() - now.getTimezoneOffset() * 60000;

  // Calcul des fenêtres de 23h et 24h en ms
  const targetMinTime = lastTime + 23 * 60 * 60 * 1000; // 23h
  const targetMaxTime = lastTime + 24 * 60 * 60 * 1000; // 24h

  // Formatage des heures recommandées en UTC strict (ex: "19h30 - 20h30")
  const formatTime = (timestamp: number) => {
    return new Date(timestamp)
      .toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC'
      })
      .replace(':', 'h');
  };

  const minTimeString = formatTime(targetMinTime);
  const maxTimeString = formatTime(targetMaxTime);

  // Temps écoulé depuis la dernière injection
  const elapsedMs = currentTime - lastTime;
  const elapsedHours = Math.floor(elapsedMs / (1000 * 60 * 60));
  const elapsedMinutes = Math.floor((elapsedMs % (1000 * 60 * 60)) / (1000 * 60));

  // Détermination de l'état
  let status: 'ok' | 'due' | 'overdue' = 'ok';
  let statusText = '';
  let badgeBg = '';
  let badgeText = '';

  if (elapsedMs < 21 * 60 * 60 * 1000) {
    // Plus de 2h avant la fenêtre
    status = 'ok';
    const remainingMs = targetMinTime - currentTime;
    const remHours = Math.floor(remainingMs / (1000 * 60 * 60));
    const remMins = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
    statusText = `Dans environ ${remHours > 0 ? `${remHours}h ` : ''}${remMins} min`;
    badgeBg = 'bg-[#F5EFE6]';
    badgeText = 'text-[#5E4B8B]';
  } else if (elapsedMs <= 24 * 60 * 60 * 1000) {
    // Dans la fenêtre de 23h-24h
    status = 'due';
    statusText = 'C\'est l\'heure recommandée !';
    badgeBg = 'bg-amber-100';
    badgeText = 'text-amber-800';
  } else {
    // Plus de 24h
    status = 'overdue';
    const overMs = currentTime - targetMaxTime;
    const overHours = Math.floor(overMs / (1000 * 60 * 60));
    const overMins = Math.floor((overMs % (1000 * 60 * 60)) / (1000 * 60));
    statusText = `Dépassé de ${overHours > 0 ? `${overHours}h ` : ''}${overMins} min`;
    badgeBg = 'bg-rose-100';
    badgeText = 'text-rose-800';
  }

  return (
    <div
      className="space-y-3 rounded-3xl border border-[#E8DFD8] bg-white p-4.5 shadow-sm">
      {/* En-tête de la tuile */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-[#5E4B8B]" />
          <span
            className="text-xs font-bold text-[#2D283E]">Prochaine injection</span>
        </div>
        <span
          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase ${badgeBg} ${badgeText}`}>
          {statusText}
        </span>
      </div>

      {/* Heure cible estimée */}
      <div className="flex items-baseline justify-between pt-1">
        <div>
          <p className="text-2xl font-bold text-[#5E4B8B]">
            {minTimeString} <span
            className="text-sm font-normal text-[#8E8294]">à</span> {maxTimeString}
          </p>
          <p className="mt-0.5 text-[11px] font-medium text-[#8E8294]">
            Fenêtre idéale (23h - 24h après la précédente)
          </p>
        </div>

        {/* Indicateur visuel d'état */}
        <div className="shrink-0">
          {status === 'ok' &&
            <CheckCircle2 className="h-6 w-6 text-emerald-500 opacity-80" />}
          {status === 'due' && (
            <span className="relative flex h-4 w-4">
              <span
                className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
              <span
                className="relative inline-flex h-4 w-4 rounded-full bg-amber-500"></span>
            </span>
          )}
          {status === 'overdue' &&
            <AlertCircle className="h-6 w-6 text-rose-500" />}
        </div>
      </div>

      {/* Rappel de la dernière injection */}
      <div
        className="flex items-center justify-between border-t border-[#F5EFE6] pt-2 text-[11px] text-[#8E8294]">
        <span>Dernière piqûre :</span>
        <span className="font-semibold text-[#2D283E]">
          Il y a {elapsedHours}h{elapsedMinutes > 0 ? `${elapsedMinutes}m` : ''}
        </span>
      </div>
    </div>
  );
};
