'use client';

import { useState, FormEvent } from 'react';
import { useSearchStore } from '@/lib/stores/searchStore';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const { filters, setQuery, isSearching } = useSearchStore();
  const [inputValue, setInputValue] = useState(filters.query);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setQuery(inputValue);
    onSearch(inputValue);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search artists, venues, or events..."
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            disabled={isSearching}
            data-testid="search-input"
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full" />
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={isSearching}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          data-testid="search-button"
        >
          Search
        </button>
      </div>
    </form>
  );
}
