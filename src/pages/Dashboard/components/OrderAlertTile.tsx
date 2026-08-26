import React from 'react';
import { useNavigate } from 'react-router';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ShoppingBag
} from 'lucide-react';
import { useOrders } from '../../../hooks/useOrders';

export const OrderAlertTile: React.FC = () => {
  const navigate = useNavigate();
  const { nhcStats, pharmacyStats, dailyMedsStats, loading } = useOrders();

  if (loading) return null;

  // Prise en compte de dailyMedsStats dans les alertes globales (avec fallback de sécurité)
  const isPillsWarning = dailyMedsStats?.isWarning ?? false;
  const isPillsDue = dailyMedsStats?.isDue ?? false;
  const isGlobalWarning = nhcStats.isWarning || pharmacyStats.isWarning || isPillsWarning;
  const isGlobalDue = nhcStats.isDue || pharmacyStats.isDue || isPillsDue;

  return (
    <div
      onClick={() => navigate('/stocks')}
      className={`group cursor-pointer space-y-3 rounded-3xl border p-4.5 shadow-sm transition-all hover:border-[#5E4B8B] ${
        isGlobalDue
          ? 'border-rose-200 bg-rose-50/50'
          : isGlobalWarning
            ? 'border-amber-200 bg-amber-50/50'
            : 'border-[#E8DFD8] bg-white'
      }`}>
      {/* En-tête avec titre & badge global */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-xl ${
              isGlobalDue
                ? 'bg-rose-100 text-rose-700'
                : isGlobalWarning
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-[#F5EFE6] text-[#5E4B8B]'
            }`}>
            <ShoppingBag className="h-4 w-4" />
          </div>
          <span className="text-xs font-bold text-[#2D283E]">Commandes Médicaments</span>
        </div>

        <div
          className="flex items-center gap-1 text-xs font-bold text-[#8E8294] transition-colors group-hover:text-[#5E4B8B]">
          <span>Gérer</span>
          <ArrowRight
            className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>

      {/* Résumé synthétique sur 3 colonnes */}
      <div className="grid grid-cols-3 gap-2 pt-1">
        {/* 1. NHC */}
        <div
          className="flex items-center justify-between rounded-2xl border border-[#F5EFE6] bg-white/80 p-2.5">
          <div className="space-y-0.5">
            <p
              className="text-[10px] font-bold tracking-wider text-[#8E8294] uppercase">NHC</p>
            <p
              className="text-xs font-bold text-[#2D283E]">{nhcStats.nextDateStr}</p>
          </div>
          {nhcStats.isDue ? (
            <span
              className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-100 text-rose-600">
              <AlertCircle className="h-3.5 w-3.5" />
            </span>
          ) : nhcStats.isWarning ? (
            <span
              className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-extrabold text-amber-800">
              J-{nhcStats.daysLeft}
            </span>
          ) : (
            <span
              className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </span>
          )}
        </div>

        {/* 2. PHARMACIE (Injections) */}
        <div
          className="flex items-center justify-between rounded-2xl border border-[#F5EFE6] bg-white/80 p-2.5">
          <div className="space-y-0.5">
            <p
              className="text-[10px] font-bold tracking-wider text-[#8E8294] uppercase">Pharma</p>
            <p
              className="text-xs font-bold text-[#2D283E]">{pharmacyStats.nextDateStr}</p>
          </div>
          {pharmacyStats.isDue ? (
            <span
              className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-100 text-rose-600">
              <AlertCircle className="h-3.5 w-3.5" />
            </span>
          ) : pharmacyStats.isWarning ? (
            <span
              className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-extrabold text-amber-800">
              J-{pharmacyStats.daysLeft}
            </span>
          ) : (
            <span
              className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </span>
          )}
        </div>

        {/* 3. COMPRIMÉS */}
        <div
          className="flex items-center justify-between rounded-2xl border border-[#F5EFE6] bg-white/80 p-2.5">
          <div className="space-y-0.5">
            <p
              className="text-[10px] font-bold tracking-wider text-[#8E8294] uppercase">Comprimés</p>
            <p
              className="text-xs font-bold text-[#2D283E]">{dailyMedsStats?.nextDateStr ?? '—'}</p>
          </div>
          {dailyMedsStats?.isDue ? (
            <span
              className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-100 text-rose-600">
              <AlertCircle className="h-3.5 w-3.5" />
            </span>
          ) : dailyMedsStats?.isWarning ? (
            <span
              className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-extrabold text-amber-800">
              J-{dailyMedsStats.daysLeft}
            </span>
          ) : (
            <span
              className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
