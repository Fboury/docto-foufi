import React from 'react';
import { useNavigate } from 'react-router';
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  Minus,
  Package,
  Plus,
  RefreshCw,
  ShoppingBag
} from 'lucide-react';
import { useStocks } from '../../hooks/useStocks';
import { useOrders } from '../../hooks/useOrders';

export const Stocks: React.FC = () => {
  const navigate = useNavigate();
  const { stocks, loading, updateQuantity, restock } = useStocks();
  const { nhcStats, pharmacyStats, updateOrder } = useOrders();

  if (loading) {
    return (
      <div
        className="mx-auto max-w-xl px-4 py-10 text-center text-xs text-[#8E8294]">Chargement
        des stocks...</div>
    );
  }

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
        <h1 className="font-serif text-2xl font-bold text-[#5E4B8B]">Stocks &
          Commandes</h1>
      </div>

      {/* SECTION COMMANDES MENSUELLES (Déplacée du Profil) */}
      <div className="space-y-2.5">
        <div
          className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-[#8E8294] uppercase">
          <ShoppingBag className="h-3.5 w-3.5" />
          <span>Renouvellements mensuels (30j)</span>
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
              className="flex w-full items-center justify-center gap-1.5 rounded-2xl bg-[#5E4B8B] py-2 text-[11px] font-bold text-white transition-all hover:bg-[#4A3B70] active:scale-95">
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
              className="flex w-full items-center justify-center gap-1.5 rounded-2xl bg-[#5E4B8B] py-2 text-[11px] font-bold text-white transition-all hover:bg-[#4A3B70] active:scale-95">
              <RefreshCw className="h-3 w-3" />
              <span>Renouveler</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION MATÉRIEL & CONSOMMABLES */}
      <div className="space-y-3">
        <div
          className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-[#8E8294] uppercase">
          <Package className="h-3.5 w-3.5" />
          <span>Matériel & Consommables</span>
        </div>

        {stocks.map(item => {
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
                <div className="space-y-0.5">
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
                    className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#E8DFD8] bg-white text-[#2D283E] transition-all hover:bg-[#F5EFE6] active:scale-95">
                    <Minus className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#E8DFD8] bg-white text-[#2D283E] transition-all hover:bg-[#F5EFE6] active:scale-95">
                    <Plus className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => restock(item.id, 10)}
                    className="flex items-center gap-1 rounded-2xl bg-[#5E4B8B] px-3 py-2 text-xs font-bold text-white transition-all hover:bg-[#4A3B70] active:scale-95">
                    <RefreshCw className="h-3 w-3" />
                    <span>+10</span>
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
