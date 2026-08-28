import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export interface StockItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  min_threshold: number;
  unit: string;
  item_type: 'injection' | 'daily_med' | 'injection_pharmacy';
}

export const useStocks = () => {
  const [stocks, setStocks] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchStocks = async () => {
    setLoading(true);
    const {
      data,
      error
    } = await supabase.from('stocks').select('*').order('name', { ascending: true });

    if (!error && data) {
      setStocks(data);
    }
    console.log(stocks);
    setLoading(false);
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  const updateQuantity = async (id: string, delta: number) => {
    const item = stocks.find(s => s.id === id);
    if (!item) return;

    const newQty = Math.max(0, item.quantity + delta);
    setStocks(prev =>
      prev.map(s =>
        s.id === id
          ? {
            ...s,
            quantity: newQty
          }
          : s
      )
    );

    await supabase.from('stocks').update({ quantity: newQty }).eq('id', id);
  };

  const restock = async (id: string, amount: number) => {
    await updateQuantity(id, amount);
  };

  // Réapprovisionnement automatique sur clic du bouton global "Renouveler" comprimés
  const refillPharmacyMeds = async () => {
    const dailyMeds = stocks.filter(s => s.item_type === 'daily_med');

    for (const item of dailyMeds) {
      const lowerName = item.name.toLowerCase();
      let addedQuantity = 30; // Défaut (+30 pour Kaleorid, Bilaska...)

      if (lowerName.includes('spiro')) {
        addedQuantity = 60; // (+60 pour Spiro)
      }

      await updateQuantity(item.id, addedQuantity);
    }
  };

  // Réapprovisionnement automatique sur clic du bouton global "Renouveler"
  // perfusion
  const refillPharmacyPerf = async () => {
    const injectionPharmacyMeds = stocks.filter(s => s.item_type === 'injection_pharmacy');

    for (const item of injectionPharmacyMeds) {
      await updateQuantity(item.id, 30);
    }
  };

  // Réapprovisionnement automatique sur clic du bouton global "Renouveler"
  // perfusion
  const refillInjectionPerf = async () => {
    const injectionyMeds = stocks.filter(s => s.item_type === 'injection');

    for (const item of injectionyMeds) {
      await updateQuantity(item.id, 30);
    }
  };

  // Décrémentation de -1 sur CHAQUE article lors d'une nouvelle injection
  const decrementStockForInjection = async () => {
    for (const item of stocks) {
      await updateQuantity(item.id, -1);
    }
  };

  const injectionStocks = stocks.filter(s => s.item_type === 'injection' || s.item_type === 'injection_pharmacy');
  const dailyMedStocks = stocks.filter(s => s.item_type === 'daily_med');
  const lowStockCount = stocks.filter(s => s.quantity <= s.min_threshold).length;

  return {
    stocks,
    injectionStocks,
    dailyMedStocks,
    loading,
    updateQuantity,
    restock,
    refillPharmacyMeds,
    refillPharmacyPerf,
    refillInjectionPerf,
    decrementStockForInjection,
    lowStockCount,
    refetch: fetchStocks
  };
};
;
;
