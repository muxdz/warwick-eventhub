CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY  primary key,
    user_name VARCHAR(50)NOT null,
    email VARCHAR(255) NOT null,
    created_at TIMESTAMPTZ NOT null default NOW(),
    password_hash TEXT NOT null
);

CREATE TABLE socieites (
    id BIGINT GENERATED ALWAYS AS IDENTITY  primary key,
    society_name VARCHAR(100) NOT null UNIQUE,
    created_at TIMESTAMPTZ NOT null default NOW()
);

CREATE TABLE events (
    id BIGINT GENERATED ALWAYS AS IDENTITY  primary key,
    event_title VARCHAR(200) NOT null,
    event_location VARCHAR(100) NOT null,
    society_id BIGINT NOT null,
    created_at TIMESTAMPTZ NOT null default NOW(),
);

CREATE TABLE memberships (
    PRIMARY KEY (user_id, society_id),
    user_id BIGINT NOT null,
    society_id BIGINT NOT null

    FOREIGN KEY (user_id) 
        REFERENCES users (id),

    FOREIGN KEY (society_id) 
        REFERENCES societies (id)
);

CREATE TABLE bookmarks (
    PRIMARY KEY (user_id, event_id),    
    user_id BIGINT NOT null,
    event_id BIGINT NOT null

    FOREIGN KEY (user_id) 
        REFERENCES users (id),

    FOREIGN KEY (event_id) 
        REFERENCES events (id)
);

