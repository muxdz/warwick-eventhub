# Warwick EventHub

# Questions

- What is Warwick EventHub?

It will be a platform where students are able to look for events to attend to. Students will be able to add their societies here and societies will be able to post their events with all relevant details so that they can be found. [Click here for the product brief](docs/product-brief.md)

- What problem does it solve?

While it's mainly a project for learning, but the motivation behind it is that the societies currently advertise their events through multiple different platforms, Instagram, WhatsApp, emails, etc. This is meant to create a central platfrom for users who don't want to look through several social medias to find a particular event. 

- What technology does it use?

Some technologies that it currently has:
1. Python
2. FastAPI
3. Pydantic validation
3. Pytest
4. PostgreSQL
5. Docker

- What currently works?

Docker + PostgreSQL works together. You are only currently able to GET, POST, DELETE, PATCH events as of right now. But to do this you will need to add users and societies manually.

- How do I run it?

Clone the repo, and create your own .env file from the [.env.example](.env.example) given.

Then you should be able to run 'docker compose up --build' to get a container environment running.

- How do I test it?

You can run 'docker compose exec api python -m pytest -v'. Currently, you need to create a test database called eventhub_test for this to work.

- What am I building next?

The front end + additional backend to stop reliance on terminal commands.

# Status

Currently, I am working on basic frontend so that a user will be able to interact with the backend.

This will include:

1. Creating a home page, which display all events.
2. Somewhere for users to create an account
3. A page to create a society
4. A page to add events

Current API and db image content sizes:
API: 451MB, db: 162MB

Current API and db image disk usage:
API: 1.74GB, db: 650MB

- Events only pytest
Count: 13
Execution Time: 0.8s

# Current Workflow

Clone repository
      ↓
Create .env from .env.example
      ↓
docker compose up --build
      ↓
Docker starts API + PostgreSQL
      ↓
Open http://localhost:8000/docs