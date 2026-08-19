import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export interface OrderRecord {
  id?: string;
  provider: 'nhc' | 'pharmacy';
  ordered_at: string;
}

export const useOrders = () => {
  const [nhcDate, setNhcDate] = useState<string | null>(null);
  const [pharmacyDate, setPharmacyDate] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Charger les commandes depuis Supabase
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('orders').select('*');

      if (error) throw error;

      if (data) {
        const nhcRecord = data.find((o: OrderRecord) => o.provider === 'nhc');
        const pharmacyRecord = data.find((o: OrderRecord) => o.provider === 'pharmacy');

        setNhcDate(nhcRecord ? nhcRecord.ordered_at : null);
        setPharmacyDate(pharmacyRecord ? pharmacyRecord.ordered_at : null);
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des commandes :', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Enregistrer ou mettre à jour une commande (upsert)
  const updateOrder = async (provider: 'nhc' | 'pharmacy', dateString?: string) => {
    try {
      // Date brute ISO en UTC
      const targetDate = dateString ? `${dateString}:00.000Z` : new Date().toISOString();

      const { error } = await supabase.from('orders').upsert(
        {
          provider,
          ordered_at: targetDate
        },
        { onConflict: 'provider' }
      );

      if (error) throw error;

      // Recharger pour synchroniser l'UI
      await fetchOrders();
    } catch (err) {
      console.error(`Erreur lors de la mise à jour de la commande ${provider} :`, err);
      alert('Impossible de mettre à jour la commande.');
    }
  };

  // Calcul des statistiques d'échéance (fenêtre de 30 jours)
  const getOrderStats = (lastDateStr: string | null) => {
    if (!lastDateStr) {
      return {
        daysLeft: 0,
        isDue: true,
        isWarning: true,
        nextDateStr: 'À commander'
      };
    }

    const last = new Date(lastDateStr);
    const next = new Date(last.getTime() + 30 * 24 * 60 * 60 * 1000);
    const now = new Date();

    const diffMs = next.getTime() - now.getTime();
    const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    return {
      daysLeft,
      isDue: daysLeft <= 0,
      isWarning: daysLeft <= 5, // Déclenche l'alerte à J-5
      nextDateStr: next.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        timeZone: 'UTC'
      })
    };
  };

  return {
    nhcDate,
    pharmacyDate,
    loading,
    updateOrder,
    nhcStats: getOrderStats(nhcDate),
    pharmacyStats: getOrderStats(pharmacyDate),
    refreshOrders: fetchOrders
  };
};
