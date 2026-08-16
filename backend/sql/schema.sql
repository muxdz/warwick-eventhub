CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY primary key,
    user_name VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL default NOW(),
    password_hash TEXT NOT NULL
);

CREATE TABLE societies (
    id BIGINT GENERATED ALWAYS AS IDENTITY primary key,
    society_name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL default NOW()
);

CREATE TABLE events (
    id BIGINT GENERATED ALWAYS AS IDENTITY primary key,
    event_title VARCHAR(200) NOT NULL,
    event_location VARCHAR(200) NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    CONSTRAINT valid_end_time CHECK (end_time > start_time OR end_time IS NULL),
    description VARCHAR(500), 
    society_id BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL default NOW(),
    created_by_user_id BIGINT NOT NULL,
    image_key VARCHAR(200),


    FOREIGN KEY (society_id)
        REFERENCES societies (id) ON DELETE CASCADE,

    FOREIGN KEY (created_by_user_id)
        REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE memberships (
    PRIMARY KEY (user_id, society_id),
    user_id BIGINT NOT NULL,
    society_id BIGINT NOT NULL,
    role VARCHAR(100) NOT NULL,

    CONSTRAINT valid_role
        CHECK (role IN ('organiser','memeber')),

    FOREIGN KEY (user_id) 
        REFERENCES users (id) ON DELETE CASCADE,

    FOREIGN KEY (society_id) 
        REFERENCES societies (id) ON DELETE CASCADE
);

CREATE TABLE bookmarks (
    PRIMARY KEY (user_id, event_id),    
    user_id BIGINT NOT NULL,
    event_id BIGINT NOT NULL,

    FOREIGN KEY (user_id) 
        REFERENCES users (id) ON DELETE CASCADE,

    FOREIGN KEY (event_id) 
        REFERENCES events (id) ON DELETE CASCADE
);

-- =========================
-- Indexes
-- =========================

CREATE INDEX idx_events_society_id
ON events (society_id);

CREATE INDEX idx_events_start_time
ON events (start_time);

CREATE INDEX idx_events_created_by_user_id
ON events (created_by_user_id);

CREATE INDEX idx_bookmarks_event_id
ON bookmarks (event_id);

CREATE INDEX idx_memberships_society_id
ON memberships (society_id);