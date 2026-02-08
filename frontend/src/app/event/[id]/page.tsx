'use client';

import { use } from 'react';
import Link from 'next/link';
import { useEventPrices } from '@/lib/hooks/useEvents';
import { PriceChart } from '@/components/features/price/PriceChart';
import { formatDateTime, formatPrice } from '@/lib/utils/format';

interface EventPageProps {
  params: Promise<{ id: string }>;
}

export default function EventPage({ params }: EventPageProps) {
  const { id } = use(params);
  const { eventWithHistory, isLoading, isError } = useEventPrices(id);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8" />
            <div className="h-80 bg-gray-200 rounded" />
          </div>
        </div>
      </main>
    );
  }

  if (isError || !eventWithHistory) {
    return (
      <main className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Event Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The event you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Search
          </Link>
        </div>
      </main>
    );
  }

  const event = eventWithHistory;
  const latestPrice = event.priceHistory?.[event.priceHistory.length - 1];

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            ← Back to Search
          </Link>
        </div>
      </div>

      {/* Event Details */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="flex justify-between items-start gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {event.artistName}
              </h1>
              {event.venue && (
                <p className="text-lg text-gray-600">
                  {event.venue.name}
                  {event.venue.city && (
                    <span>
                      {' • '}{event.venue.city}, {event.venue.state}
                    </span>
                  )}
                </p>
              )}
              <p className="text-gray-500 mt-2">
                {formatDateTime(event.eventDate)}
              </p>
              {event.genre && (
                <span className="inline-block mt-3 px-3 py-1 text-sm font-medium text-blue-700 bg-blue-50 rounded-full">
                  {event.genre}
                </span>
              )}
            </div>

            <div className="text-right">
              {latestPrice && (
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Current Price</p>
                  <p className="text-3xl font-bold text-green-600">
                    {formatPrice(latestPrice.minPrice)}
                  </p>
                  {latestPrice.maxPrice && latestPrice.minPrice !== latestPrice.maxPrice && (
                    <p className="text-sm text-gray-500 mt-1">
                      up to {formatPrice(latestPrice.maxPrice)}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    via {latestPrice.source}
                  </p>
                </div>
              )}
              {event.url && (
                <a
                  href={event.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Buy Tickets →
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Price History Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Price History
          </h2>
          <PriceChart priceHistory={event.priceHistory || []} />

          {event.priceHistory && event.priceHistory.length > 0 && (
            <div className="mt-6 grid grid-cols-3 gap-4 text-center border-t pt-6">
              <div>
                <p className="text-sm text-gray-500">Lowest</p>
                <p className="text-xl font-semibold text-green-600">
                  {formatPrice(
                    Math.min(...event.priceHistory.map((p) => p.minPrice || Infinity))
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Average</p>
                <p className="text-xl font-semibold text-blue-600">
                  {formatPrice(
                    event.priceHistory.reduce((sum, p) => sum + (p.avgPrice || 0), 0) /
                      event.priceHistory.length
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Highest</p>
                <p className="text-xl font-semibold text-red-600">
                  {formatPrice(
                    Math.max(...event.priceHistory.map((p) => p.maxPrice || 0))
                  )}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
