# Why am I using docker?

Docker allows me to create isolated runtime environment. It lets me see whether my project actually works or whether it only works on my computer.

I can test my site as if I was visiting it myself instead of trying to put it on the web first and then realising something is wrong.

# Docker Services

Currently I have 2 main services:

- api
This essentially builds a version of my site by creating an image of all my backend application and dependcies. Docker will then run this image as a separate container. Currently it is only set to copying the backend as that's all I have.

- db
This connects the API container to the Postgres container. This is so that any changes a user makes will actually change in the postgres container database. 

# Networking

In the .env.example file, you will see that the API connects to db instead of previously, localhost. This is because we are no longer running locally, but instead want it to connect to our service named 'db'.

# Persistence

The PostgresSQL volume will allow all database changes to stay even when we run 'docker compose down'. So instead of losing the changes, we keep them. This is unless we remove the volumes.

# Startup

Running 'docker compose up --build' will build a working EventHub API by running the compose.yaml file. 

It will:
1. read the compose.yaml file 
2. build the image using information in Dockerfile 3. start the services we have created
4. creates a network
5. connections to the volume/create a new one
6. get the api to connect to db

This uses the included .env file, the directory and the Dockerfile, which stores additional commands for the API.

# Common commands

'docker compose up' - starts up the containers
'docker compose down' - shuts down the containers
'docker images' - shows all images that are stored
'docker ps' - shows all running containers
'docker compose logs' - shows all the events that have happened