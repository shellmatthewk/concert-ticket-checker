import useSWR from 'swr';
import { api } from '../api/client';
import type { Event, EventWithHistory } from '../api/client';

const eventsFetcher = async (params: Record<string, string | number | undefined>) => {
  const response = await api.searchEvents(params);
  return response.data;
};

const eventFetcher = async (id: string) => {
  const response = await api.getEvent(id);
  return response.data;
};

const eventPricesFetcher = async (id: string) => {
  const response = await api.getEventPrices(id);
  return response.data;
};

const artistEventsFetcher = async (name: string) => {
  const response = await api.getArtistEvents(name);
  return response.data;
};

export function useEvents(params: Record<string, string | number | undefined>) {
  const key = Object.keys(params).length > 0 ? ['events', params] : null;

  const { data, error, isLoading, mutate } = useSWR(
    key,
    () => eventsFetcher(params),
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
    }
  );

  return {
    events: data,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}

export function useEvent(id: string | null) {
  const { data, error, isLoading } = useSWR(
    id ? ['event', id] : null,
    () => eventFetcher(id!),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    event: data,
    isLoading,
    isError: !!error,
    error,
  };
}

export function useEventPrices(id: string | null) {
  const { data, error, isLoading } = useSWR(
    id ? ['eventPrices', id] : null,
    () => eventPricesFetcher(id!),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    eventWithHistory: data,
    isLoading,
    isError: !!error,
    error,
  };
}

export function useArtistEvents(artistName: string | null) {
  const { data, error, isLoading } = useSWR(
    artistName ? ['artistEvents', artistName] : null,
    () => artistEventsFetcher(artistName!),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    events: data,
    isLoading,
    isError: !!error,
    error,
  };
}
