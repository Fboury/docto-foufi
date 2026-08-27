import React, { useRef } from 'react';
import { useNavigate } from 'react-router';
import {
  AlertCircle,
  AlertTriangle,
  ArrowDown,
  ArrowLeft,
  Minus,
  Package,
  Pill,
  Plus,
  RefreshCw,
  ShoppingBag
} from 'lucide-react';
import { useStocks } from '../../hooks/useStocks';
import { useOrders } from '../../hooks/useOrders';

export const Stocks: React.FC = () => {
  const navigate = useNavigate();

  // Références vers les deux sections de matériel
  const injectionSectionRef = useRef<HTMLDivElement>(null);
  const dailyMedsSectionRef = useRef<HTMLDivElement>(null);

  const {
    injectionStocks,
    dailyMedStocks,
    lowStockCount,
    loading,
    updateQuantity,
    restock,
    refillPharmacyMeds,
    refillInjectionPerf,
    refillPharmacyPerf
  } = useStocks();

  const { nhcStats, pharmacyStats, updateOrder, dailyMedsStats } = useOrders();

  // Détection d'où se situe le premier stock bas pour scroller au bon endroit
  const scrollToLowStock = () => {
    const hasLowInjection = injectionStocks.some(item => item.quantity <= item.min_threshold);
    const hasLowDailyMed = dailyMedStocks.some(item => item.quantity <= item.min_threshold);

    if (hasLowInjection && injectionSectionRef.current) {
      injectionSectionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    } else if (hasLowDailyMed && dailyMedsSectionRef.current) {
      dailyMedsSectionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  if (loading) {
    return (
      <div
        className="mx-auto max-w-xl px-4 py-10 text-center text-xs text-[#8E8294]">Chargement
        des stocks...</div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-6 px-4 py-6 pb-24">
      {/* En-tête */}
      <div className="space-y-1">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-xs font-bold text-[#8E8294] transition-colors hover:text-[#5E4B8B]">
          <ArrowLeft className="h-4 w-4" />
          <span>Retour au tableau de bord</span>
        </button>
        <h1 className="font-serif text-2xl font-bold text-[#5E4B8B]">Stocks &
          Commandes</h1>
      </div>

      {/* ⚠️ TUILE WARNING ALERTE STOCK BAS */}
      {lowStockCount > 0 && (
        <div
          className="flex items-center justify-between rounded-3xl border border-amber-300 bg-amber-50 p-4 shadow-xs transition-all">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-extrabold text-amber-900">
                {lowStockCount} {lowStockCount > 1 ? 'éléments' : 'élément'} en
                stock bas !
              </p>
              <p className="text-[11px] font-medium text-amber-700">Seuil
                d'alerte atteint.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={scrollToLowStock}
            className="flex shrink-0 items-center gap-1 rounded-2xl bg-amber-200/80 px-3 py-2 text-xs font-bold text-amber-900 transition-all hover:bg-amber-300 active:scale-95">
            <span>Voir</span>
            <ArrowDown className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* SECTION COMMANDES MENSUELLES */}
      <div className="space-y-2.5">
        <div
          className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-[#8E8294] uppercase">
          <ShoppingBag className="h-3.5 w-3.5" />
          <span>Renouvellements mensuels</span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {/* 1. TUILE NHC */}
          <div
            className={`space-y-2.5 rounded-3xl border p-4 transition-all ${
              nhcStats.isWarning ? 'border-amber-300 bg-amber-50/60' : 'border-[#E8DFD8] bg-white'
            }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#2D283E]">NHC (Pompe)</span>
              {nhcStats.isDue ? (
                <span
                  className="flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-[9px] font-extrabold text-rose-700">
                  <AlertCircle className="h-3 w-3" /> À faire !
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
              onClick={async () => {
                if (confirm('Confirmer la commande NHC aujourd\'hui ?')) {
                  await updateOrder('nhc');
                  await refillInjectionPerf();
                }
                ;
              }}
              className="flex w-full items-center justify-center gap-1.5 rounded-2xl bg-[#5E4B8B] py-2 text-[11px] font-bold text-white transition-all hover:bg-[#4A3B70] active:scale-95">
              <RefreshCw className="h-3 w-3" /> <span>Renouveler</span>
            </button>
          </div>

          {/* 2. TUILE PHARMACIE PERFUSION */}
          <div
            className={`space-y-2.5 rounded-3xl border p-4 transition-all ${
              pharmacyStats.isWarning ? 'border-amber-300 bg-amber-50/60' : 'border-[#E8DFD8] bg-white'
            }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#2D283E]">Pharmacie (Perfusion)</span>
              {pharmacyStats.isDue ? (
                <span
                  className="flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-[9px] font-extrabold text-rose-700">
                  <AlertCircle className="h-3 w-3" /> À faire !
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
              onClick={async () => {
                if (confirm('Confirmer la commande Pharmacie Perfusion aujourd\'hui ?')) {
                  await updateOrder('pharmacy');
                  await refillPharmacyPerf();
                }
              }}
              className="flex w-full items-center justify-center gap-1.5 rounded-2xl bg-[#5E4B8B] py-2 text-[11px] font-bold text-white transition-all hover:bg-[#4A3B70] active:scale-95">
              <RefreshCw className="h-3 w-3" /> <span>Renouveler</span>
            </button>
          </div>

          {/* 3. TUILE PHARMACIE COMPRIMÉS */}
          <div
            className={`space-y-2.5 rounded-3xl border p-4 transition-all ${
              dailyMedsStats.isWarning ? 'border-amber-300 bg-amber-50/60' : 'border-[#E8DFD8] bg-white'
            }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#2D283E]">Pharmacie (Comprimés)</span>
              {dailyMedsStats.isDue ? (
                <span
                  className="flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-[9px] font-extrabold text-rose-700">
                  <AlertCircle className="h-3 w-3" /> À faire !
                </span>
              ) : (
                <span
                  className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-extrabold text-emerald-700">
                  OK ({dailyMedsStats.daysLeft}j)
                </span>
              )}
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] text-[#8E8294]">Prochaine commande :</p>
              <p
                className="text-sm font-bold text-[#5E4B8B]">{dailyMedsStats.nextDateStr}</p>
            </div>
            <button
              type="button"
              onClick={async () => {
                if (confirm('Confirmer la réception de la pharmacie comprimés ? (+30 Kaleorid/Bilaska, +60 Spiro)')) {
                  await updateOrder('daily_meds');
                  await refillPharmacyMeds();
                }
              }}
              className="flex w-full items-center justify-center gap-1.5 rounded-2xl bg-[#5E4B8B] py-2 text-[11px] font-bold text-white transition-all hover:bg-[#4A3B70] active:scale-95">
              <RefreshCw className="h-3 w-3" /> <span>Renouveler</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1 : MATÉRIEL & INJECTIONS */}
      <div
        ref={injectionSectionRef}
        className="space-y-3 pt-2">
        <div
          className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-[#8E8294] uppercase">
          <Package className="h-3.5 w-3.5" />
          <span>Matériel de pompe & Injections</span>
        </div>

        {injectionStocks.map(item => {
          const isLow = item.quantity <= item.min_threshold;
          return (
            <div
              key={item.id}
              className={`space-y-3 rounded-3xl border bg-white p-4.5 shadow-xs transition-all ${
                isLow ? 'border-amber-300 bg-amber-50/40' : 'border-[#E8DFD8]'
              }`}>
              <div className="flex items-start justify-between">
                <div className="space-y-0.5">
                  <span
                    className="text-[10px] font-extrabold tracking-wider text-[#8E8294] uppercase">
                    {item.category}
                  </span>
                  <h3
                    className="text-base font-bold text-[#2D283E]">{item.name}</h3>
                </div>
                {isLow && (
                  <span
                    className="flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-extrabold text-amber-800">
                    <AlertTriangle className="h-3 w-3" /> Stock bas !
                  </span>
                )}
              </div>

              <div
                className="flex items-center justify-between border-t border-[#F5EFE6] pt-3">
                <div>
                  <p className="text-[10px] text-[#8E8294]">Disponible :</p>
                  <p className="text-xl font-bold text-[#5E4B8B]">
                    {item.quantity} <span
                    className="text-xs font-normal text-[#8E8294]">{item.unit}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, -1)}
                    className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#E8DFD8] bg-white text-[#2D283E] hover:bg-[#F5EFE6]">
                    <Minus className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#E8DFD8] bg-white text-[#2D283E] hover:bg-[#F5EFE6]">
                    <Plus className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => restock(item.id, 30)}
                    className="flex items-center gap-1 rounded-2xl bg-[#5E4B8B] px-3 py-2 text-xs font-bold text-white hover:bg-[#4A3B70]">
                    <RefreshCw className="h-3 w-3" /> <span>+30</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* SECTION 2 : MÉDICAMENTS QUOTIDIENS */}
      <div
        ref={dailyMedsSectionRef}
        className="space-y-3 pt-4">
        <div
          className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-[#8E8294] uppercase">
          <Pill className="h-3.5 w-3.5" />
          <span>Comprimés & Traitements quotidiens</span>
        </div>

        {dailyMedStocks.map(item => {
          const isLow = item.quantity <= item.min_threshold;
          const isSpiro = item.name.toLowerCase().includes('spiro');
          const defaultAmount = isSpiro ? 60 : 30;

          return (
            <div
              key={item.id}
              className={`space-y-3 rounded-3xl border bg-white p-4.5 shadow-xs transition-all ${
                isLow ? 'border-amber-300 bg-amber-50/40' : 'border-[#E8DFD8]'
              }`}>
              <div className="flex items-start justify-between">
                <div className="space-y-0.5">
                  <span
                    className="text-[10px] font-extrabold tracking-wider text-[#8E8294] uppercase">
                    {item.category}
                  </span>
                  <h3
                    className="text-base font-bold text-[#2D283E]">{item.name}</h3>
                </div>
                {isLow && (
                  <span
                    className="flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-extrabold text-amber-800">
                    <AlertTriangle className="h-3 w-3" /> Stock bas !
                  </span>
                )}
              </div>

              <div
                className="flex items-center justify-between border-t border-[#F5EFE6] pt-3">
                <div>
                  <p className="text-[10px] text-[#8E8294]">Disponible :</p>
                  <p className="text-xl font-bold text-[#5E4B8B]">
                    {item.quantity} <span
                    className="text-xs font-normal text-[#8E8294]">{item.unit}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, -1)}
                    className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#E8DFD8] bg-white text-[#2D283E] hover:bg-[#F5EFE6]">
                    <Minus className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#E8DFD8] bg-white text-[#2D283E] hover:bg-[#F5EFE6]">
                    <Plus className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => restock(item.id, defaultAmount)}
                    className="flex items-center gap-1 rounded-2xl bg-[#5E4B8B] px-3 py-2 text-xs font-bold text-white hover:bg-[#4A3B70]">
                    <RefreshCw className="h-3 w-3" />
                    <span>+{defaultAmount}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
