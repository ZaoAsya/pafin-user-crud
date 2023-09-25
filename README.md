## Pafin User CRUD

RESTful API that allows users to create, retrieve, update, and delete data on a PostgreSQL database.
User routes are secured using JWT authentication.

### Codebase

#### Technologies used
- NestJs
- PostgreSQL database

#### DB table schema
```
CREATE TABLE "public"."user" (
    "name" varchar NOT NULL,
    "email" varchar NOT NULL,
    "password" varchar NOT NULL,
    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    PRIMARY KEY ("id")
);
```

### Installation

```bash
$ npm install
```

### Running the app

Add .env file with values
```
PG_HOST=
PG_PORT=
PG_USERNAME=
PG_PASSWORD=
PG_DB=
JWT_TOKEN_SECRET=
```
что-то про запуск докера и бд
```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

The app is available on port 3000.

### Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
Swagger is available on http://localhost:3000/api.

Firstly, you need to [get access token](http://localhost:3000/api#/auth/AuthController_getToken). Then copy the result 
and authorize with it on top of the page (green button).
Then user routes will respond you with not only 401 status code.