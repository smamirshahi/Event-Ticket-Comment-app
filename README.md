# Event-Ticket-Comment-app
## Overview
This project contains a frontend and backend for an event handler app. It uses Typescript, Koa, routing-controllers and TypeORM in the backend and React/Redux in the frontend. The backend exposes a REST API but also sends messages over websockets using SOCKETIO.

## Introduction
Users can login and create an event. Afterward, they can offer tickets for the event. Each user can see the ticket and add a comment about it. Later, the user can buy the ticket. The ticket is added to his shopping cart.

## Using the app
1. download the repo
2. create a docker
3. In the terminal, got to the client folder and run the React app `yarn start`
4. In another terminal, go to the server folder and run `yarn watch`
5. In the third terminal, go to the server folder and run `nodemon .`
6. You can sign up as new user and then login.

## To do:
1. improve the styling
   - maximum 4 events in each page
   - tickets are sorted based upon risk

2. User can delete his/her own event/ticket/comment
3. User can modify his/her own event/ticket/comment
4. An admin user needs to be created
   - Admin can delete all the events/tickets/comments
   - Admin can modify all the events/tickets/comments
5. Add a buy button for a ticket so that a user can buy the ticket.
6. Add a shopping cart for each user.