import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from '../config/index.js';

let supabase: SupabaseClient | null = null;

if (config.supabase.url && config.supabase.serviceKey) {
  supabase = createClient(
    config.supabase.url,
    config.supabase.serviceKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
} else {
  console.warn('Supabase credentials not configured. Database operations will fail.');
}

export { supabase };

// Helper to ensure supabase is configured
export function getSupabase(): SupabaseClient {
  if (!supabase) {
    throw new Error('Supabase client not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_KEY.');
  }
  return supabase;
}

// Type definitions for database tables
export interface Database {
  public: {
    Tables: {
      venues: {
        Row: {
          id: string;
          name: string;
          city: string | null;
          state: string | null;
          location: unknown; // PostGIS geography type
          timezone: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['venues']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['venues']['Insert']>;
      };
      events: {
        Row: {
          id: string;
          external_id: string | null;
          artist_name: string;
          genre: string | null;
          venue_id: string | null;
          event_date: string;
          url: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['events']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['events']['Insert']>;
      };
      price_history: {
        Row: {
          id: string;
          event_id: string;
          min_price: number | null;
          max_price: number | null;
          avg_price: number | null;
          source: string;
          listing_type: string | null;
          section_details: Record<string, unknown> | null;
          recorded_at: string;
        };
        Insert: Omit<Database['public']['Tables']['price_history']['Row'], 'id' | 'recorded_at'>;
        Update: Partial<Database['public']['Tables']['price_history']['Insert']>;
      };
    };
  };
}
