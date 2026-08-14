# User

Table name: Users
Purpose: Stores all relevant user data

Columns:
- id
- name
- email
- created_at
- password_hash

Primary key: id

Foreign keys: none

Unique constraints: email

Relationships: many to many with societies and many to many with events

# Society

Table name: Societies
Purpose: Stores all relevant society data

Columns:
- id
- society_name
- created_at

Primary key: id

Foreign keys: none

Unique constraints: society_name

Relationships: many to many with users and one to many with events

# Event

Table name: Events
Purpose: Stores all relevant events data

Columns:
- id
- event_title
- event_location
- society_id
- created_at

Primary key: id

Foreign keys: society_id -> Societies.id

Unique constraints: none

Relationships: many to many with users and many to one with societies

# Society Memberships

Table name: Memberships
Purpose: Stores all the connections between users and societies

Columns:
- user_id
- society_id

Primary key: user_id and society_id

Foreign keys: user_id -> Users.id and event_id -> Events.id

Unique constraints: none

Relationships: many to many with societies and users

# Event Bookmarks

Table name: Event Bookmarks
Purpose: Stores all relations between users and societies

Columns:
- user_id
- event_id

Primary key: user_id and event_id

Foreign keys: user_id -> Users.id and event_id -> Events.id

Unique constraints: none

Relationships: many to many with events and users