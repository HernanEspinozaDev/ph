CREATE TABLE IF NOT EXISTS google_reviews_settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    account_name TEXT NOT NULL,
    location_name TEXT NOT NULL,
    location_title TEXT NOT NULL,
    location_address TEXT,
    place_id TEXT,
    order_by TEXT NOT NULL DEFAULT 'updateTime desc'
        CHECK (order_by IN ('updateTime desc', 'rating desc', 'rating')),
    enabled INTEGER NOT NULL DEFAULT 1 CHECK (enabled IN (0, 1)),
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
