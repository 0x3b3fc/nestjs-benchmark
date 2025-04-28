# NestJS Application

A modern NestJS application with a modular architecture, validation, error handling, and Swagger documentation.

## Features

- RESTful API endpoints with proper request validation
- Modular architecture using NestJS decorators and dependency injection
- Authentication and authorization system (setup ready)
- Request logging and error handling middleware
- Environment-based configuration
- Swagger API documentation

## Installation

```bash
npm install
```

## Running the app

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## Test

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## API Documentation

API documentation is available at `/api/docs` when the application is running.

## Project Structure

```
src/
├── common/               # Shared resources
│   ├── dtos/            # Data Transfer Objects
│   ├── filters/         # Exception filters
│   └── interceptors/    # Interceptors
├── users/                # Users module
│   ├── dto/             # User-specific DTOs
│   ├── entities/        # User entity definitions
│   ├── users.controller.ts
│   ├── users.module.ts
│   └── users.service.ts
├── app.module.ts         # Main application module
└── main.ts               # Application entry point
```

## Adding Database Support

This project is configured for TypeORM. To use it with a database:

1. Install the appropriate database driver (e.g., `npm install pg` for PostgreSQL)
2. Update the .env file with your database credentials
3. Uncomment and configure the TypeORM module in app.module.ts