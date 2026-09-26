import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export interface ChecklistItem {
  id: string;
  list_id: string;
  label: string;
  is_completed: boolean;
  created_at: string;
}

export const useChecklist = () => {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('checklist_items')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setItems(data || []);
    } catch (err) {
      console.error('Erreur chargement checklist :', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const toggleItem = async (id: string, currentStatus: boolean) => {
    setItems(prev => prev.map(item => (item.id === id ? { ...item, is_completed: !currentStatus } : item)));

    const { error } = await supabase.from('checklist_items').update({ is_completed: !currentStatus }).eq('id', id);

    if (error) {
      console.error('Erreur mise à jour :', error);
      fetchItems();
    }
  };

  const resetAll = async () => {
    setItems(prev => prev.map(item => ({ ...item, is_completed: false })));

    const { error } = await supabase
      .from('checklist_items')
      .update({ is_completed: false })
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (error) fetchItems();
  };

  return { items, loading, toggleItem, resetAll };
};
