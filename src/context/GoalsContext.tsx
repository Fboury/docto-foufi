// src/context/GoalsContext.tsx
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from './AuthContext';

interface GoalsContextType {
  goals: any[];
  loading: boolean;
  refreshGoals: () => Promise<void>;
  toggleGoalCompletion: (id: string, currentStatus: boolean) => Promise<void>;
}

const GoalsContext = createContext<GoalsContextType | undefined>(undefined);

export function GoalsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGoals = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase.from('goals').select('*').eq('user_id', user.id).order('date', { ascending: true });

    setGoals(data || []);
    setLoading(false);
  };

  const toggleGoalCompletion = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase.from('goals').update({ is_completed: !currentStatus }).eq('id', id);

    if (!error) {
      // On met à jour l'état local immédiatement pour le dashboard et les détails
      setGoals(prev =>
        prev.map(w =>
          w.id === id
            ? {
                ...w,
                is_completed: !currentStatus
              }
            : w
        )
      );
    } else {
      console.error('Erreur lors de la mise à jour :', error);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [user]);

  return (
    <GoalsContext.Provider
      value={{
        goals,
        loading,
        refreshGoals: fetchGoals,
        toggleGoalCompletion
      }}>
      {children}
    </GoalsContext.Provider>
  );
}

export const useGoals = () => {
  const context = useContext(GoalsContext);
  if (!context) throw new Error('useGoals must be used within a GoalsProvider');
  return context;
};
