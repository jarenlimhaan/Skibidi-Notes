import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface RedirectDataState {
  questions: any[];
  answers: (number | null)[];
  setData: (data: { questions: any[]; answers: (number | null)[] }) => void;
}

const useRedirectDataStore = create<RedirectDataState>()(
  persist(
    (set) => ({
      questions: [],
      answers: [],
      setData: ({ questions, answers }) => set({ questions, answers }),
    }),
    {
      name: 'redirect-data-storage', 
    }
  )
);

export default useRedirectDataStore;
