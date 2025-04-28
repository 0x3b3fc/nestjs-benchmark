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

# To run project:
```bash
npm run start
 ```
- this command will start the express, fastify servers and run the benchmark

### endpoints to test
* ```/ping``` - Basic JSON response
* ```/large``` - Large JSON payload (10,000 items)
* ```/stream``` - Streaming file contents with JSON transformation
* ```/large-stream``` - Memory-efficient streaming of large JSON payload