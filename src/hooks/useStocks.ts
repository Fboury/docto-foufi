import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export interface StockItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  min_threshold: number;
  unit: string;
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
    setLoading(false);
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  // Ajuster la quantité (+1 / -1 ou valeur directe)
  const updateQuantity = async (id: string, delta: number) => {
    const item = stocks.find(s => s.id === id);
    if (!item) return;

    const newQty = Math.max(0, item.quantity + delta);
    setStocks(prev => prev.map(s => (s.id === id ? {
      ...s,
      quantity: newQty
    } : s)));

    await supabase.from('stocks').update({ quantity: newQty }).eq('id', id);
  };

  // Réapprovisionner / Faire le plein (ex: +10 ou +30)
  const restock = async (id: string, amount: number) => {
    updateQuantity(id, amount);
  };

  // Décrémentation automatique lors d'une injection (-1 sur tous les consommables)
  const decrementStockForInjection = async () => {
    for (const item of stocks) {
      // Décrémente chaque consommable utilisé lors du soin
      await updateQuantity(item.id, -1);
    }
  };

  const lowStockCount = stocks.filter(s => s.quantity <= s.min_threshold).length;

  return {
    stocks,
    loading,
    updateQuantity,
    restock,
    decrementStockForInjection,
    lowStockCount,
    refetch: fetchStocks
  };
};
;
