# DPCADME

**Digital Platform for Centralized Alumni Data Management and Engagement**

DPCADME is a web application designed to centralize alumni information and facilitate engagement between alumni and students. It aims to simplify alumni discovery, profile management, and professional networking.

## Features

- User registration and login interfaces
- Separate dashboards for students, alumni, and administrators
- Alumni directory and profile discovery
- Profile management
- Alumni–student connection and request workflows

## Tech Stack

- **Frontend:** React, Vite, JavaScript, HTML, CSS
- **Backend:** Java, Spring Boot, Spring Data JPA, Spring Security
- **Database:** MySQL
- **Build Tool:** Maven

## Project Structure

```text
dpcadme/
├── src/                 # Backend source code and tests
├── frontend/            # React frontend
├── .mvn/                # Maven Wrapper configuration
├── mvnw
├── mvnw.cmd
├── pom.xml
├── .gitignore
└── README.md
```

## Prerequisites

- Java 25
- MySQL Server
- Node.js and npm

## Setup and Installation

### 1. Database Configuration

Create the required MySQL database and configure the database URL and username in `src/main/resources/application.properties`.

Set the `DB_PASSWORD` environment variable to your MySQL password before starting the backend.

### 2. Run the Backend

From the project root, run:

```powershell
.\mvnw.cmd spring-boot:run
```

### 3. Run the Frontend

Open a separate terminal and run:

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL provided by Vite, usually `http://localhost:5173`.

## Running Tests

Run the backend tests from the project root:

```powershell
.\mvnw.cmd test
```

## Development Status

DPCADME is an ongoing project. Features and functionality are being refined as development progresses.

## Security

Database credentials and other sensitive information should be stored in environment variables and never committed to the repository.
