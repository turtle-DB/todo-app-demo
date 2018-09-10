# Turtle DB Todo App Demo

### Setup

- navigate to `/client` directory, use `npm start -- --port xxxx` to run instance
- navigate to `REST_server` directory, make sure mongodb is running locally, use `npm start` to start up server on port 3000

### TurtleDB vs RESTful

Within the `/client/src/index.js`, comment out the turtleDB code and uncomment the `axios`
calls to switch between an offline-first or RESTful approach.
