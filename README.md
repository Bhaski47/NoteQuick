# NoteQuick

> A full-stack personal productivity and task-scheduling application pairing a responsive task dashboard with an interactive multi-view calendar and public portfolio metrics.

[![Java](https://img.shields.io/badge/Java-21-ED8B00?style=flat&logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.4.3-6DB33F?style=flat&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Next.js](https://img.shields.io/badge/Next.js-16.2.3-black?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.5-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.x-4479A1?style=flat&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-Supported-2496ED?style=flat&logo=docker&logoColor=white)](https://www.docker.com/)

---

## Table of Contents

- [NoteQuick](#notequick)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
    - [What is NoteQuick?](#what-is-notequick)
    - [Why does it exist?](#why-does-it-exist)
    - [Who is it for?](#who-is-it-for)
  - [Key Features](#key-features)
  - [Tech Stack](#tech-stack)
    - [Frontend](#frontend)
    - [Backend](#backend)
  - [Architecture \& Project Structure](#architecture--project-structure)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [1. Clone the Repository](#1-clone-the-repository)
    - [2. Database Setup](#2-database-setup)
    - [3. Backend Setup \& Run](#3-backend-setup--run)
    - [4. Frontend Setup \& Run](#4-frontend-setup--run)
    - [5. Running in Production](#5-running-in-production)
    - [Alternative: Running Backend with Docker](#alternative-running-backend-with-docker)
  - [Environment Variables](#environment-variables)
    - [Backend (`backend/src/main/resources/application.properties`)](#backend-backendsrcmainresourcesapplicationproperties)
    - [Frontend (`frontend/.env.local`)](#frontend-frontendenvlocal)
  - [API Endpoints](#api-endpoints)
    - [Authentication (`/authenticate`)](#authentication-authenticate)
    - [Tasks (`/todos`)](#tasks-todos)
    - [Tags (`/tags`)](#tags-tags)
    - [Calendar (`/calendar`)](#calendar-calendar)
    - [User Profile (`/user`)](#user-profile-user)
  - [Testing](#testing)
    - [Backend Tests](#backend-tests)
    - [Frontend Verification](#frontend-verification)
  - [Deployment](#deployment)
  - [Contributing](#contributing)
  - [Author \& Contact](#author--contact)

---

## Overview

### What is NoteQuick?
NoteQuick is a modern full-stack web application designed for personal productivity, deadline-aware scheduling, and task management. It connects a Next.js 16 frontend with a Spring Boot 3.4 REST API and a MySQL relational database.

### Why does it exist?
Most task managers force a compromise: enterprise project management tools (like Jira or Asana) are overly complex and cumbersome for individual workflows, while basic checklist apps lack temporal context and visual scheduling. NoteQuick bridges this gap by combining an agile task list with a calendar view, normalized tag taxonomy, and public profile metrics.

### Who is it for?
Students, software engineers, freelancers, and professionals looking for a distraction-free, deadline-aware workspace to plan tasks across daily, weekly, and monthly horizons.

---

## Key Features

- **Task Management & Scheduling**: Create, edit, and organize tasks with titles, descriptions, and explicit start/end datetime boundaries (`fromDate` to `toDate`).
- **Interactive Multi-View Calendar**: Reactive calendar powered by `react-big-calendar` offering Month, Week, Day, and Agenda views with overlap queries and an event inspection modal.
- **Tag Organization & Cascading Cleanup**: Dedicated `/tags` manager tracking active tasks per tag. Deleting a tag automatically removes it from all associated tasks' JSON tag lists without deleting the tasks themselves.
- **Filtering, Sorting & Search**: Instant task filtering by status (`ACTIVE`, `COMPLETED`, `ALL`), chronological ordering, and server-side substring search across titles and descriptions.
- **Soft Deletion & IDOR Protection**: Tasks are preserved under `REMOVED` status for historical metrics. Every backend mutation asserts authenticated user ownership against JWT claims.
- **Secure Authentication & Password Recovery**: JWT-based session security (HS256) with Edge route protection via `jose`. Includes a 3-step password reset flow using 6-digit cryptographic OTPs and styled HTML emails via Spring Mail.
- **Public Profile Portfolio**: Shareable read-only profile route at `/user/[username]` showcasing user info and real-time productivity statistics (Active, Completed, Removed).
- **Dark & Light Mode Support**: Theme toggling built with `next-themes`, HeroUI components, and Tailwind CSS design tokens.

---



## Tech Stack

### Frontend
| Component | Technology | Version | Purpose |
|---|---|---|---|
| Framework | Next.js (App Router, Turbopack) | `^16.2.3` | Server Actions, API routes, SSR, and client routing |
| Language | TypeScript | `^5` | Static type safety |
| UI Library | React / React DOM | `^19.2.5` | Core component architecture |
| Component System | HeroUI (`@heroui/react`) | `^2.2.9` | Accessible UI components (modals, inputs, tabs, chips) |
| Styling | Tailwind CSS | `^3.4.1` | Utility styling and dark/light color tokens |
| State Management | Zustand | `^5.0.12` | Client state (`useTodoStore`, `useUserStore`) |
| Calendar Engine | `react-big-calendar` | `^1.19.4` | Month, Week, Day, and Agenda schedule visualization |
| Animations | Framer Motion | `^12.38.0` | Sidebar, modal, and route animations |
| Edge Security | `jose` | `^6.2.2` | Web Crypto JWT verification in Next.js middleware |
| HTTP Client | Axios | `^1.15.0` | REST API communication inside server actions |
| Theme Provider | `next-themes` | `^0.4.6` | System, light, and dark theme persistence |

### Backend
| Component | Technology | Version | Purpose |
|---|---|---|---|
| Runtime | Java (OpenJDK / Temurin) | `21` | Application platform |
| Framework | Spring Boot | `3.4.3` | REST web services, dependency injection, MVC |
| Build Tool | Maven Wrapper (`./mvnw`) | `3.x` | Build management and reproducible packaging |
| Persistence & ORM | Spring Data JPA / Hibernate | `6.x` | Relational mapping, schema management, JSON types |
| Database Connector | MySQL Connector/J | `8.x` | Relational database connectivity |
| Security | Spring Security | `6.x` | Stateless security filter chain, BCrypt hashing |
| JWT Engine | JJWT (`io.jsonwebtoken`) | `0.12.6` | HS256 token generation and claim validation |
| Mail & Templates | Spring Boot Mail / Thymeleaf | `3.4.3` | OTP verification emails and HTML rendering |
| Validation | Jakarta Bean Validation | `3.4.3` | Request body constraint checks (`@Valid`) |
| Utilities | Lombok / Google Gson | `2.10.1` (Gson) | Boilerplate reduction and JSON serialization |
| Container | Docker | Alpine 21 | Multi-stage production container build |

---

## Architecture & Project Structure

```
NoteQuick/
├── backend/                                  # Spring Boot 3.4 REST API
│   ├── Dockerfile                            # Multi-stage production container definition
│   ├── mvnw / mvnw.cmd                       # Maven wrapper executables
│   ├── pom.xml                               # Dependencies and build plugins
│   └── src/
│       ├── main/
│       │   ├── java/com/notequick/backend/
│       │   │   ├── config/                   # SecurityConfig, CorsConfig, JwtAuthFilter
│       │   │   ├── controller/               # REST controllers (Auth, Todo, Tag, Calendar, User)
│       │   │   ├── dto/                      # Data Transfer Objects for API contracts
│       │   │   ├── entity/                   # JPA Entities (User, Todo, Tag, OtpTokens)
│       │   │   ├── enums/                    # TodoStatus, UserStatus
│       │   │   ├── exception/                # GlobalExceptionHandler
│       │   │   ├── repository/               # Spring Data JPA interfaces
│       │   │   ├── service/                  # Business logic interfaces and implementations
│       │   │   └── utils/                    # JwtUtil, HttpResponse envelope
│       │   └── resources/
│       │       ├── application.properties.example # Environment variable template
│       │       └── templates/otp-email.html  # Responsive HTML template for OTP emails
│       └── test/                             # JUnit 5 and Mockito test suites
│
└── frontend/                                 # Next.js 16 Web Application
    ├── middleware.tsx                        # Edge route guard verifying JWT cookies
    ├── next.config.ts                        # Next.js configuration
    ├── package.json                          # Dependencies and scripts
    ├── tailwind.config.ts                    # Design system color tokens
    └── src/
        ├── actions/                          # Server Actions invoking backend endpoints
        ├── app/
        │   ├── (auth)/auth/                  # Login, registration, OTP forgot-password
        │   ├── api/                          # Route handlers (/api/set-token, /api/logout)
        │   ├── calendar/                     # Interactive calendar view
        │   ├── my-task/                      # Task dashboard (list, filter, search, add)
        │   ├── settings/                     # User profile, appearance, account settings
        │   ├── tags/                         # Dedicated tag management page
        │   └── user/[username]/              # Public user portfolio route
        ├── components/                       # Header, SideBar, NavigateButton, ActionButton
        ├── store/                            # Zustand stores (useTodoStore, useUserStore)
        ├── types/                            # TypeScript ambient declarations
        └── utils/                            # Date formatting, cookie helpers, toast system
```

---

## Getting Started

### Prerequisites

Ensure the following tools are installed on your machine:
- **Java**: OpenJDK 21 or Eclipse Temurin 21 (`java -version`)
- **Node.js**: v20+ recommended (v18.18+ minimum) and `npm` (`node -v`, `npm -v`)
- **Database**: MySQL 8.x instance running locally or via Docker

---

### 1. Clone the Repository

```bash
git clone https://github.com/Bhaski47/NoteQuick.git
cd NoteQuick
```

---

### 2. Database Setup

Start your MySQL server and create the database:

```sql
CREATE DATABASE notequick CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

> [!NOTE]
> Database tables and relationships are automatically generated and updated by Hibernate on startup via `spring.jpa.hibernate.ddl-auto=update`.

---

### 3. Backend Setup & Run

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Copy the sample configuration file:
   ```bash
   cp src/main/resources/application.properties.example src/main/resources/application.properties
   ```

3. Update `src/main/resources/application.properties` with your database credentials, SMTP configuration, and a **Base64-encoded** JWT secret (see [Environment Variables](#environment-variables)).

4. Start the Spring Boot backend:
   ```bash
   ./mvnw spring-boot:run
   ```

The backend server starts on `http://localhost:8080`.

---

### 4. Frontend Setup & Run

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Copy the environment variables template:
   ```bash
   cp .env.example .env.local
   ```

3. Ensure `JWT_SECRET` in `.env.local` matches the exact Base64 string configured in the backend.

4. Install dependencies:
   ```bash
   npm install
   ```

5. Start the Next.js development server with Turbopack:
   ```bash
   npm run dev
   ```

Open `http://localhost:3000` in your browser.

---

### 5. Running in Production

**Backend**:
```bash
cd backend
./mvnw clean package -DskipTests
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

**Frontend**:
```bash
cd frontend
npm run build
npm run start
```

---

### Alternative: Running Backend with Docker

The backend includes a multi-stage Dockerfile based on Alpine Linux:

1. Build the Docker image:
   ```bash
   cd backend
   docker build -t notequick-backend .
   ```

2. Run the container:
   ```bash
   docker run -p 8080:8080 \
     -e DB_URL=jdbc:mysql://host.docker.internal:3306/notequick \
     -e DB_USERNAME=root \
     -e DB_PASSWORD=your_mysql_password \
     -e JWT_SECRET=dGhpc2lzYXZlcnlsb25ncmFuZG9tc2VjcmV0a2V5MTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMjM0 \
     -e JWT_EXPIRATION=86400000 \
     notequick-backend
   ```

---

## Environment Variables

### Backend (`backend/src/main/resources/application.properties`)

| Variable | Purpose | Example / Dummy Value | Required |
|---|---|---|:---:|
| `DB_URL` | MySQL JDBC connection URL | `jdbc:mysql://localhost:3306/notequick` | Yes |
| `DB_USERNAME` | MySQL username (or `DB_USER_NAME`) | `root` | Yes |
| `DB_PASSWORD` | MySQL password | `your_db_password` | Yes |
| `JWT_SECRET` | Base64-encoded HMAC-SHA256 secret (minimum 256 bits) | `dGhpc2lzYXZlcnlsb25ncmFuZG9tc2VjcmV0a2V5MTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMjM0` | Yes |
| `JWT_EXPIRATION` | JWT validity in milliseconds (default: 86400000 = 24h) | `86400000` | No |
| `SPRING_MAIL_HOST` | SMTP server host (or `SMTP_MAIL`) | `smtp.gmail.com` | For OTP |
| `SPRING_MAIL_PORT` | SMTP port (or `SMTP_PORT`) | `587` | For OTP |
| `SPRING_MAIL_USERNAME` | SMTP account email (or `SMTP_USER`) | `noreply@example.com` | For OTP |
| `SPRING_MAIL_PASSWORD` | SMTP app password (or `SMTP_PASSWORD`) | `your_smtp_app_password` | For OTP |

> [!IMPORTANT]
> `JWT_SECRET` **must be a valid Base64-encoded string** representing at least 256 bits (32 bytes). Both the Spring Boot backend (`Decoders.BASE64.decode`) and the Next.js edge middleware (`Buffer.from(..., 'base64')`) decode this value before verifying signatures.

### Frontend (`frontend/.env.local`)

| Variable | Purpose | Example / Dummy Value | Required |
|---|---|---|:---:|
| `NEXT_PUBLIC_API_URL` | Spring Boot REST API base endpoint | `http://localhost:8080` | Yes |
| `JWT_SECRET` | Base64-encoded secret matching backend for Edge verification | Same Base64 string as backend | Yes |

---

## API Endpoints

All responses follow the standard `HttpResponse` envelope:
```json
{
  "status_code": 200,
  "message": "Operation successful",
  "data": { ... }
}
```

### Authentication (`/authenticate`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `POST` | `/authenticate/register` | Register a new user account | No |
| `POST` | `/authenticate/login` | Authenticate with username/email and password; returns JWT | No |
| `POST` | `/authenticate/forgot-password` | Generate and email 6-digit OTP to user | No |
| `POST` | `/authenticate/verify-otp` | Validate submitted OTP | No |
| `POST` | `/authenticate/reset-password` | Set new password using verified OTP | No |

### Tasks (`/todos`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `POST` | `/todos/getTodos` | Fetch tasks with optional `status` (`ALL`, `ACTIVE`, `COMPLETED`) and `order` | Yes |
| `POST` | `/todos/addTodo` | Create a new task with dates and tags | Yes |
| `POST` | `/todos/updateTodo` | Update an existing task or toggle completion status | Yes |
| `POST` | `/todos/deleteTodo` | Soft-delete a task (`TodoStatus.REMOVED`) | Yes |
| `POST` | `/todos/searchTodo` | Search tasks by query string across title and description | Yes |

### Tags (`/tags`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `GET` | `/tags` | Retrieve all user tags with associated active task counts | Yes |
| `POST` | `/tags` | Create a normalized, lowercase tag | Yes |
| `DELETE` | `/tags/{tagId}` | Delete tag and cascade removal from all tasks | Yes |

### Calendar (`/calendar`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `POST` | `/calendar/getCalendarDetails` | Query tasks scheduled within a specific date range | Yes |

### User Profile (`/user`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `GET` | `/user/getUserDetails` | Fetch authenticated user's profile details | Yes |
| `PUT` | `/user/updateUserDetails` | Update user profile and personal information | Yes |
| `DELETE` | `/user/deleteUser` | Deactivate account (anonymizes credentials and revokes session) | Yes |
| `GET` | `/user/{username}` | Public read-only portfolio metrics and user info | No |

---

## Testing

### Backend Tests
Execute unit and slice tests with Maven:

```bash
cd backend

# Run test suites (JUnit 5 + Mockito)
./mvnw test

# Verify compilation and types
./mvnw test-compile
```

### Frontend Verification
Verify TypeScript types and build hygiene:

```bash
cd frontend

# Run ESLint
npm run lint

# Verify production build compilation
npm run build
```

---

## Deployment

- **Backend**: Containerize using the included [`backend/Dockerfile`](file:///home/bhaski/Codes/NoteQuick/backend/Dockerfile) and deploy to any container platform (Docker, AWS ECS, Google Cloud Run, Render, or a Kubernetes cluster).
- **Frontend**: Deploy to [Vercel](https://vercel.com/) or any Node.js host by configuring `NEXT_PUBLIC_API_URL` and `JWT_SECRET` in the platform environment dashboard.

---

## Contributing

Contributions to NoteQuick are welcome! Follow these steps:

1. **Fork the repository** on GitHub.
2. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit your changes** following conventional commit standards:
   ```bash
   git commit -m "feat: add recurring task support"
   ```
4. **Verify tests and builds** locally:
   ```bash
   # In backend
   ./mvnw test
   # In frontend
   npm run build
   ```
5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
6. **Open a Pull Request** describing your changes and testing steps.

> [!IMPORTANT]
> Always enforce authenticated user ownership checks (`!userId.equals(existing.getUserId())`) on any new mutation endpoints to maintain IDOR security.

---

## Author & Contact

- **Author**: Bhaski47
- **Repository**: [https://github.com/Bhaski47/NoteQuick](https://github.com/Bhaski47/NoteQuick)
- **Issues & Feedback**: [GitHub Issues](https://github.com/Bhaski47/NoteQuick/issues)
