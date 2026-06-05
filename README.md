# NoteQuick

A full-stack productivity application for managing tasks, notes, and calendar events — built with Next.js and Spring Boot.

## Table of Contents

- [Installation](#installation)
- [Workflow](#workflow)
- [Usage](#usage)
- [Features](#features)

---

## Installation

**1. Clone the repository**
```bash
git clone https://github.com/Bhaski47/NoteQuick
cd NoteQuick
```

**2. Install frontend dependencies**
```bash
cd frontend
npm install
```

**3. Configure the backend**
```bash
cd backend
cp application.properties.example src/main/resources/application.properties
```

Edit `application.properties` with your values:

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_URL` | MySQL JDBC URL | `jdbc:mysql://localhost:3306/notequick` |
| `DB_USER_NAME` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | `yourpassword` |
| `JWT_SECRET` | Token signing secret | Any long random string |
| `JWT_EXPIRATION` | Token TTL (ms) | `86400000` |
| `SMTP_MAIL` | SMTP host | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP port | `587` |
| `SMTP_USER` | Sender email | `you@gmail.com` |
| `SMTP_PASSWORD` | Email app password | Your SMTP password |

**4. Configure the frontend**
```bash
touch .env.local
```

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend base URL | `http://localhost:8080` |
| `JWT_SECRET` | Must match backend secret | Same value as backend |

**5. Create the database**
```sql
CREATE DATABASE notequick;
```

**6. Run the application**

In separate terminals:
```bash
# Backend
cd backend && ./mvnw spring-boot:run

# Frontend
cd frontend && npm run dev
```

App runs at `http://localhost:3000`.

---

## Workflow

**1. Authentication** — Register with a username, email, and password to receive a JWT token. Existing users log in to resume their session.

**2. Task Management** — Create tasks with a title, description, and start/end date range. Tasks appear in both the dashboard list and the calendar. The system enforces that end dates must follow start dates.

**3. Calendar View** — Browse all scheduled tasks by date. Clicking any event opens a detailed view.

**4. Profile & Settings** — Update personal information from the settings page. Changes only persist on explicit confirmation. Users can also disable their account, which anonymizes their data and terminates the active session.

---

## Usage

1. **Register or Login** — Visit `http://localhost:3000`, create an account or sign in. You'll land on the main dashboard.
2. **Create a Task** — Go to the Tasks section, click **New Task**, fill in the title, description, and date range, then save.
3. **Calendar** — Navigate to the Calendar section to view tasks across month, week, or day layouts.
4. **Profile** — Check your activity stats and summary from the Profile page.
5. **Settings** — Update personal details or deactivate your account from the Settings page.

---

## Features

- **Task Management** — Full CRUD for tasks with title, description, and date ranges. Enforces valid date ordering.
- **Calendar Integration** — Interactive calendar with month, week, and day views showing all scheduled tasks.
- **JWT Authentication** — Secure registration and login with server-side token management and configurable expiration.
- **Multi-Page Dashboard** — Dedicated pages for tasks, calendar, profile, and settings with animated transitions.
