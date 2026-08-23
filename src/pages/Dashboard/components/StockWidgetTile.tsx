import React from 'react';
import { useNavigate } from 'react-router';
import { AlertTriangle, ArrowRight, CheckCircle2, Package } from 'lucide-react';
import { useStocks } from '../../../hooks/useStocks';

export const StockWidgetTile: React.FC = () => {
  const navigate = useNavigate();
  const { stocks, loading, lowStockCount } = useStocks();

  if (loading) return null;

  const hasLowStock = lowStockCount > 0;

  // Tri des stocks du plus bas au plus élevé pour afficher les 3 plus critiques
  const lowestStocks = [...stocks].sort((a, b) => a.quantity - b.quantity).slice(0, 3);

  return (
    <div
      onClick={() => navigate('/stocks')}
      className={`group cursor-pointer space-y-3 rounded-3xl border p-4.5 shadow-sm transition-all hover:border-[#5E4B8B] ${
        hasLowStock ? 'border-amber-200 bg-amber-50/50' : 'border-[#E8DFD8] bg-white'
      }`}>
      {/* En-tête avec titre & bouton Gérer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-xl ${
              hasLowStock ? 'bg-amber-100 text-amber-800' : 'bg-[#F5EFE6] text-[#5E4B8B]'
            }`}>
            <Package className="h-4 w-4" />
          </div>
          <span
            className="text-xs font-bold text-[#2D283E]">Gestion des Stocks</span>
        </div>

        <div
          className="flex items-center gap-1 text-xs font-bold text-[#8E8294] transition-colors group-hover:text-[#5E4B8B]">
          <span>Gérer</span>
          <ArrowRight
            className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>

      {/* Aperçu synthétique des 3 consommables ayant le moins de stock */}
      <div className="space-y-1.5 pt-1">
        {lowestStocks.map(item => {
          const isLow = item.quantity <= item.min_threshold;
          return (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-xl border border-[#F5EFE6] bg-white/80 px-3 py-2 text-xs">
              <span
                className="max-w-[160px] truncate font-semibold text-[#2D283E]">{item.name}</span>
              <div className="flex items-center gap-2">
                <span
                  className={`font-bold ${isLow ? 'text-amber-700' : 'text-[#5E4B8B]'}`}>
                  {item.quantity} {item.unit}
                </span>
                {isLow ? (
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                ) : (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
