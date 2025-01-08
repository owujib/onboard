# Node.js Project with Express, Prisma, and TypeScript

This project provides an Express application with user authentication, Prisma ORM, and TypeScript for building a RESTful API. The application includes user registration, login, password recovery, and a user profile route.

## Table of Contents
- [Requirements](#requirements)
- [Installation](#installation)
- [Docker Setup](#docker-setup)
- [Run the Application Locally](#run-the-application-locally)
- [API Documentation](#api-documentation)

## Requirements
- Node.js (>= 22.x)
- npm (>= 7.x)
- Docker (optional but recommended)

## Installation

1. Clone the repository:
   ```bash
   git clone git@github.com:owujib/onboard.git
   cd project-name
2. Install the dependencies:
    ```bash
    npm install
3. Set up the Prisma database:
    Update the .env file with your database connection string.<br/>
    Run prisma migration:
    ```bash
    npx prisma migrate dev
    ```
    Build the project:
    ```bash
    npm run build
    ```

## Docker Setup

1. Build the Docker image:
    ```bash
    docker build -t onboarding .
2. Build the Docker image:
    ```bash
    docker run -p 3000:3000 onboarding
    ```
    The application will now be running on http://localhost:3000.
#### OR 
If you want to run the application using Docker Compose:

## Run the Application Locally
Build the Docker images using Docker Compose:
```bash
docker-compose build
```
Start the services (app, db and mailhog):
```bash
docker-compose up
```

1. After installing dependencies and setting up the database, start the server:
    ```bash
    npm start
2. The application will be running at http://localhost:3000:

## API Documentation
The **API Documentation** section explains how to use the various routes provided in the application, including:

- **User Registration** (`/register`): Endpoint to create a new user.
- **User Login** (`/login`): Endpoint to authenticate the user and return a JWT token.
- **Forgot Password** (`/forgot-password`): Endpoint to initiate the password reset process.
- **Recover Password** (`/recover-password`): Endpoint to update the password using the reset code.
- **Resend Auth Code** (`/resend-auth-code`): Endpoint to resend auth code.
- **Get Current User** (`/me`): Endpoint to retrieve the authenticated user's profile.
you can find the postman json documentation in the folder structure

> please note: to view mails go to the mailhog server running on http://localhost:8025/



