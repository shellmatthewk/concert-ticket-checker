import { create } from 'zustand';

interface SearchFilters {
  query: string;
  lat?: number;
  lon?: number;
  radius: number;
  dateFrom?: string;
  dateTo?: string;
  genre?: string;
}

interface SearchState {
  filters: SearchFilters;
  isSearching: boolean;
  setQuery: (query: string) => void;
  setLocation: (lat: number, lon: number) => void;
  setRadius: (radius: number) => void;
  setDateRange: (from?: string, to?: string) => void;
  setGenre: (genre?: string) => void;
  setIsSearching: (isSearching: boolean) => void;
  reset: () => void;
}

const defaultFilters: SearchFilters = {
  query: '',
  radius: 50,
};

export const useSearchStore = create<SearchState>((set) => ({
  filters: defaultFilters,
  isSearching: false,

  setQuery: (query) =>
    set((state) => ({ filters: { ...state.filters, query } })),

  setLocation: (lat, lon) =>
    set((state) => ({ filters: { ...state.filters, lat, lon } })),

  setRadius: (radius) =>
    set((state) => ({ filters: { ...state.filters, radius } })),

  setDateRange: (dateFrom, dateTo) =>
    set((state) => ({ filters: { ...state.filters, dateFrom, dateTo } })),

  setGenre: (genre) =>
    set((state) => ({ filters: { ...state.filters, genre } })),

  setIsSearching: (isSearching) => set({ isSearching }),

  reset: () => set({ filters: defaultFilters, isSearching: false }),
}));
