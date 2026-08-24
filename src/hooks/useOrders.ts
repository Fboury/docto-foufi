import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export interface OrderState {
  id?: string;
  provider: string;
  ordered_at: string;
}

export const useOrders = () => {
  const [orders, setOrders] = useState<Record<string, OrderState>>({});
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('orders').select('*');

    if (!error && data) {
      const map: Record<string, OrderState> = {};
      data.forEach((o) => {
        map[o.provider] = o;
      });
      setOrders(map);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Met à jour la date de commande pour un fournisseur (nhc, pharmacy, daily_meds)
  const updateOrder = async (provider: string) => {
    const nowIso = new Date().toISOString();

    // Mise à jour locale optimiste
    setOrders((prev) => ({
      ...prev,
      [provider]: {
        ...prev[provider],
        provider,
        ordered_at: nowIso
      }
    }));

    const existingOrder = orders[provider];

    if (existingOrder?.id) {
      await supabase
        .from('orders')
        .update({ ordered_at: nowIso })
        .eq('id', existingOrder.id);
    } else {
      await supabase
        .from('orders')
        .insert({ provider, ordered_at: nowIso });
      fetchOrders();
    }
  };

  const getOrderStats = (provider: string, intervalDays = 30) => {
    const order = orders[provider];
    if (!order || !order.ordered_at) {
      return { daysLeft: 0, isWarning: true, isDue: true, nextDateStr: '--' };
    }

    const lastDate = new Date(order.ordered_at);
    const nextDate = new Date(lastDate);
    nextDate.setDate(nextDate.getDate() + intervalDays);

    const now = new Date();
    const diffTime = nextDate.getTime() - now.getTime();
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const nextDateStr = nextDate.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short'
    });

    return {
      daysLeft,
      isWarning: daysLeft <= 5 && daysLeft > 0,
      isDue: daysLeft <= 0,
      nextDateStr
    };
  };

  return {
    orders,
    loading,
    updateOrder,
    nhcStats: getOrderStats('nhc'),
    pharmacyStats: getOrderStats('pharmacy'),
    dailyMedsStats: getOrderStats('daily_meds'),
    refetch: fetchOrders
  };
};