'use client';

import Link from 'next/link';
import { Event } from '@/lib/api/client';
import { formatDate, formatTime, formatPrice, formatRelativeDate } from '@/lib/utils/format';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Link href={`/event/${event.id}`}>
      <article
        className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer"
        data-testid="event-card"
      >
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-gray-900 truncate">
              {event.artistName}
            </h3>
            {event.venue && (
              <p className="text-gray-600 mt-1">
                {event.venue.name}
                {event.venue.city && (
                  <span className="text-gray-400">
                    {' • '}{event.venue.city}, {event.venue.state}
                  </span>
                )}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm text-gray-500">
                {formatDate(event.eventDate)}
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-sm text-gray-500">
                {formatTime(event.eventDate)}
              </span>
            </div>
            {event.genre && (
              <span className="inline-block mt-2 px-2 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded">
                {event.genre}
              </span>
            )}
          </div>

          <div className="text-right flex-shrink-0">
            <p className="text-sm text-gray-500">
              {formatRelativeDate(event.eventDate)}
            </p>
            {(event.currentMinPrice || event.currentMaxPrice) && (
              <div className="mt-2">
                <p className="text-lg font-bold text-green-600">
                  {formatPrice(event.currentMinPrice)}
                </p>
                {event.currentMaxPrice && event.currentMinPrice !== event.currentMaxPrice && (
                  <p className="text-xs text-gray-400">
                    up to {formatPrice(event.currentMaxPrice)}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
