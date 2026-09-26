import React from 'react';
import { CheckCircle2, Circle, Loader2, Luggage, RotateCcw } from 'lucide-react';
import { useChecklist } from '../../hooks/useChecklist';

export const Checklist: React.FC = () => {
  const { items, loading, toggleItem, resetAll } = useChecklist();

  if (loading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-[#5E4B8B]">
        <Loader2 className="mb-2 h-8 w-8 animate-spin" />
        <p className="text-sm font-medium">Chargement du sac...</p>
      </div>
    );
  }

  const completedCount = items.filter(i => i.is_completed).length;
  const progressPercent = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  return (
    <div className="mx-auto max-w-xl space-y-6 px-4 py-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#5E4B8B]">Checklist Weekend</h1>
          <p className="text-xs text-[#8E8294]">Ne rien oublier pour le départ</p>
        </div>
        <button
          type="button"
          onClick={resetAll}
          className="flex items-center gap-1.5 rounded-2xl border border-[#D3C1E5] bg-[#E5D9F2] px-3 py-1.5 text-xs font-bold text-[#5E4B8B] transition-colors hover:bg-[#D3C1E5]/60">
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Décocher tout</span>
        </button>
      </div>

      {/* Carte Progression */}
      <div className="space-y-3 rounded-3xl border border-[#D3C1E5] bg-[#E5D9F2]/50 p-4.5 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#5E4B8B] text-white shadow-sm">
              <Luggage className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold tracking-wider text-[#5E4B8B] uppercase">Mon Sac</p>
              <p className="text-sm font-bold text-[#2D283E]">
                {completedCount} <span className="text-xs font-normal text-[#8E8294]">/ {items.length} préparés</span>
              </p>
            </div>
          </div>
          <span className="font-serif text-lg font-extrabold text-[#5E4B8B]">{progressPercent}%</span>
        </div>

        <div className="h-2.5 w-full overflow-hidden rounded-full border border-[#D3C1E5]/40 bg-white/80 p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#8E72C3] to-[#5E4B8B] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Liste unique des éléments */}
      <div className="space-y-2">
        {items.map(item => (
          <button
            key={item.id}
            type="button"
            onClick={() => toggleItem(item.id, item.is_completed)}
            className={`flex w-full items-center justify-between rounded-2xl border p-3.5 text-left transition-all ${
              item.is_completed
                ? 'border-[#E8DFD8] bg-white/60 text-[#8E8294]'
                : 'border-[#E8DFD8] bg-white font-medium text-[#2D283E] shadow-xs hover:border-[#D3C1E5]'
            }`}>
            <span className={`text-sm ${item.is_completed ? 'line-through opacity-75' : ''}`}>{item.label}</span>
            {item.is_completed ? (
              <CheckCircle2 className="h-5 w-5 shrink-0 text-[#5E4B8B]" />
            ) : (
              <Circle className="h-5 w-5 shrink-0 text-[#8E8294]" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
