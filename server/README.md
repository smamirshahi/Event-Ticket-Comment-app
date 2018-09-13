# Event-Ticket-Comment Server

This is a server for using the event-ticket-comment app. 

It has these endpoints:

* `POST /users`: sign up as new user
* `POST /logins`: log in and receive a JWT
* `POST /events`: create a new event
* `POST /events/:id/tickets`: create a new ticket for event(id)
* `POST /events/:id1/tickets/:id2`: create a new comment for event(id1) and ticket(id2)
* `GET /events`: list all events
* `GET /events/:id`: get an event
* `GET /events/:id/tickets`: list all tickets for event(id)
* `GET /events/:id1([0-9]+)/tickets/:id2([0-9]+)`: list all comments for event(id1) and ticket(id2)
* `GET /users`: list all users
* `GET /users/:id`: get a user

## Running

* You need a working Postgres database that is preferrably empty (drop all the tables) and running 
* Install the dependencies using `yarn install`
* Compile the app (Typescript > Javascript) using `yarn compile` (during development you can use `yarn watch`)
* `yarn start`
