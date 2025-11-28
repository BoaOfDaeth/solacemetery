import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CompareState {
  selectedItems: string[];
  addItem: (id: string) => void;
  removeItem: (id: string) => void;
  clearItems: () => void;
  toggleItem: (id: string) => void;
  isSelected: (id: string) => boolean;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      selectedItems: [],
      addItem: id =>
        set(state => ({
          selectedItems: [...new Set([...state.selectedItems, id])],
        })),
      removeItem: id =>
        set(state => ({
          selectedItems: state.selectedItems.filter(item => item !== id),
        })),
      clearItems: () => set({ selectedItems: [] }),
      toggleItem: id => {
        const { selectedItems, addItem, removeItem } = get();
        if (selectedItems.includes(id)) {
          removeItem(id);
        } else {
          addItem(id);
        }
      },
      isSelected: id => get().selectedItems.includes(id),
    }),
    {
      name: 'compare-store', // unique name for localStorage key
    }
  )
);
