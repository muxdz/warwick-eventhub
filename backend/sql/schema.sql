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
    event_time TIMESTAMPTZ NOT NULL,
    description VARCHAR(500), 
    society_id BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL default NOW(),


    FOREIGN KEY (society_id)
        REFERENCES societies (id) ON DELETE CASCADE
);

CREATE TABLE memberships (
    PRIMARY KEY (user_id, society_id),
    user_id BIGINT NOT NULL,
    society_id BIGINT NOT NULL,

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

