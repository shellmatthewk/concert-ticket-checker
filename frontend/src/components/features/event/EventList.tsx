'use client';

import { Event } from '@/lib/api/client';
import { EventCard } from './EventCard';

interface EventListProps {
  events: Event[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export function EventList({ events, isLoading, emptyMessage = 'No events found' }: EventListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-100 rounded-lg h-32 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
