-- SubSaver database schema (SQLite / PostgreSQL compatible).
-- The live prototype stores data in the browser (localStorage), so this file
-- shows how the same data would be stored once a real backend is added.

CREATE TABLE users (
  id            INTEGER PRIMARY KEY,
  name          VARCHAR(80) NOT NULL,
  email         VARCHAR(120) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE subscriptions (
  id          INTEGER PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id),
  name        VARCHAR(80) NOT NULL,
  category    VARCHAR(30) NOT NULL,       -- Streaming, Music, Fitness, Software, Other
  cost        DECIMAL(10,2) NOT NULL,
  cycle       VARCHAR(10) NOT NULL,       -- monthly | yearly
  renewal     DATE NOT NULL,
  last_used   DATE NOT NULL,
  status      VARCHAR(10) DEFAULT 'active', -- active | cancelled
  cancelled_at DATE
);

CREATE TABLE reviews (                    -- every swipe
  id          INTEGER PRIMARY KEY,
  sub_id      INTEGER NOT NULL REFERENCES subscriptions(id),
  decision    VARCHAR(10) NOT NULL,       -- keep | cancel
  reviewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE rewards (
  user_id     INTEGER PRIMARY KEY REFERENCES users(id),
  points      INTEGER DEFAULT 0,
  saved_amount DECIMAL(12,2) DEFAULT 0
);

-- Example queries
-- Unused (30+ days):  SELECT * FROM subscriptions WHERE status='active' AND last_used < DATE('now','-30 day');
-- Renewing in 7 days: SELECT * FROM subscriptions WHERE status='active' AND renewal BETWEEN DATE('now') AND DATE('now','+7 day');
