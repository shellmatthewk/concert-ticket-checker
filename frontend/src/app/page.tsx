'use client';

import { useState } from 'react';
import { SearchBar } from '@/components/features/search/SearchBar';
import { EventList } from '@/components/features/event/EventList';
import { useEvents } from '@/lib/hooks/useEvents';
import { useSearchStore } from '@/lib/stores/searchStore';

export default function HomePage() {
  const { setIsSearching } = useSearchStore();
  const [searchQuery, setSearchQuery] = useState('');

  const { events, isLoading, isError } = useEvents(
    searchQuery ? { query: searchQuery } : {}
  );

  const handleSearch = (query: string) => {
    setIsSearching(true);
    setSearchQuery(query);
    setTimeout(() => setIsSearching(false), 100);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-600 to-blue-800 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            ConcertDaddy
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            Find the best concert ticket prices across multiple sources
          </p>
          <SearchBar onSearch={handleSearch} />
        </div>
      </section>

      {/* Results Section */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        {searchQuery ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                {isLoading
                  ? 'Searching...'
                  : `Results for "${searchQuery}"`}
              </h2>
              {events && events.length > 0 && (
                <span className="text-gray-500">
                  {events.length} event{events.length !== 1 ? 's' : ''} found
                </span>
              )}
            </div>

            {isError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                Failed to load events. Please try again.
              </div>
            )}

            <EventList
              events={events || []}
              isLoading={isLoading}
              emptyMessage="No events found. Try a different search."
            />
          </>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Find Your Next Concert
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Search for your favorite artists to compare ticket prices
              across venues and track price history.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
