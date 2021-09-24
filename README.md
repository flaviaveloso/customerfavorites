# CUSTOMER FAVORITES

## Description

The purpose of this project is to allow customers to set theirs favorites products.

To use this API you need to create a USER using the path: v1/user  
(There are two types of roles: admin and user)

Example:

```base
curl --location --request POST 'localhost:3000/v1/user' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username":"username",
    "password":"password",
    "roles": ["user"]
}'
```

To use the other endpoints you need to recover the jwt token using the path: /auth/login  
The request's body receives an USER created on the previous endpoint

Example:

```bash
curl --location --request POST 'localhost:3000/auth/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "username",
    "password": "password"
}'
```

## Postman Collection

https://www.getpostman.com/collections/47aa24bb78b7154f51ce

## Environment

### To run local (wihout docker)

Please make sure that [Node.js](https://nodejs.org/en/)(>= v14) is installed on your operating system.

[Mysql](https://www.mysql.com/)

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

### To run local (with docker)

[Docker](https://docs.docker.com/get-docker/)

[Docker compose](https://docs.docker.com/engine/reference/commandline/compose/)

```bash
docker compose build
docker compose up
```

## TODO

- Add cache on the application to optimaze the database perfomance using Redis
- Improve e2e test coverage
- Improve unit test coverage
- Improve return on api endpoints
- Add OpenApi/Swagger documentation
- Add sequence and architecture diagrams
- Improve application logs
- Put the return payload in the same pattern as the products api
- Upload the project's image to docker hub
- Add error handling for 5xx or connection error when going to remote API, in this case use what is cached in the local database
- Create User DTO  

## Stay in touch

- Author - [Flávia Veloso](https://www.linkedin.com/in/flaviaveloso/)

## License

This project is [MIT licensed](LICENSE).
