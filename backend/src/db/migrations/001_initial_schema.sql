-- ConcertDaddy Initial Schema
-- Run this in your Supabase SQL Editor

-- Enable PostGIS for geographic queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- Venues Table with Geo-spatial support
CREATE TABLE IF NOT EXISTS venues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    city VARCHAR(100),
    state VARCHAR(50),
    location GEOGRAPHY(POINT, 4326), -- For ST_DWithin queries
    timezone VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events Table
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    external_id VARCHAR(255) UNIQUE, -- Ticketmaster/SeatGeek ID
    artist_name VARCHAR(255) NOT NULL,
    genre VARCHAR(100),
    venue_id UUID REFERENCES venues(id),
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    url TEXT,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Price History Table (The Core Value)
CREATE TABLE IF NOT EXISTS price_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    min_price DECIMAL(10, 2),
    max_price DECIMAL(10, 2),
    avg_price DECIMAL(10, 2),
    source VARCHAR(50) NOT NULL, -- e.g., 'Ticketmaster', 'SeatGeek'
    listing_type VARCHAR(50), -- 'primary' or 'resale'
    section_details JSONB, -- Flexible metadata for row/section info
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_events_artist ON events(artist_name);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_venue ON events(venue_id);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_price_event_date ON price_history(event_id, recorded_at);
CREATE INDEX IF NOT EXISTS idx_price_source ON price_history(source);
CREATE INDEX IF NOT EXISTS idx_venues_location ON venues USING GIST(location);

-- Function for nearby venue search
CREATE OR REPLACE FUNCTION get_venues_nearby(
    user_lon FLOAT,
    user_lat FLOAT,
    dist_meters INT
)
RETURNS SETOF venues AS $$
    SELECT *
    FROM venues
    WHERE ST_DWithin(
        location,
        ST_SetSRID(ST_MakePoint(user_lon, user_lat), 4326)::geography,
        dist_meters
    )
    ORDER BY location <-> ST_SetSRID(ST_MakePoint(user_lon, user_lat), 4326)::geography;
$$ LANGUAGE SQL;

-- Trigger to update updated_at on events
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
