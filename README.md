# Serverless Kanban Board Management Application

Serverless Kanban Board Management Application where a user can manage her workload.

## Functionality of the application

- [x] User of Kanban Board Management Application needs to authenticate in order to use an application.
- [x] Kanban Board Management Application allows users to create, update, delete kanban card items.
- [x] Kanban Board Management Application allows users to upload a file.
- [x] Kanban Board Management Application only displays cards for a logged in user.

### Images

![login screen](https://github.com/zmarozas/aws_capstone/blob/main/screens/login.PNG?raw=true)
![created card](https://github.com/zmarozas/aws_capstone/blob/main/screens/created_item.PNG?raw=true)
![created card](https://github.com/zmarozas/aws_capstone/blob/main/screens/item-with-picture.PNG?raw=true)

The application consists of a frontend and backend.

### Frontend

The `client` folder contains a web application that can use the API developed in the project.
This frontend works with the serverless application.

### Backend

The `backend` folder contains a serverless application that uses the [serverless framework](https://github.com/serverless)

- The code is split into multiple layers separating business logic from I/O related code.
- Code is implemented using async/await and Promises without using callbacks.

#### Authentication

Authentication in this application, is done through [Auth0](https://auth0.com/), Which uses asymmetrically encrypted JWT tokens.

## Usage

### The Backend

The Backend is deployed on AWS as serverless application with AP ID: e8vrt7s2vj
However, it could be deployed as follows:

```bash
cd backend
export NODE_OPTIONS=--max_old_space_size=8192
npm install
serverless deploy -v
```

### The Frontend

To run a client application run the following commands:

```bash
cd client
npm install
npm run start
```

## Postman

An alternative way to test API, Postman collection is provided.

### Local enveronment

There is also possibility to run application locally..
