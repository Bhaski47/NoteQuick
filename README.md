# NoteQuick
A Full-Stack Productivity App for Tasks, Notes, Calendar, and User Management Using Next.js and Spring Boot

## Table of Contents
- [Installation](#installation)
- [Workflow](#workflow)
- [Usage](#usage)
- [Features](#features)

# Installation

1. Clone the repository:
    ```
    git clone https://github.com/Bhaski47/NoteQuick
    ```

2. Navigate to the project folder:
    ```
    cd NoteQuick
    ```

3. Navigate to the frontend folder:
    ```
    cd frontend
    ```

4. Navigate to the backend folder:
    ```
    cd backend
    ```

5. Install frontend dependencies:
    ```
    npm install
    ```

6. Set up the backend configuration:
    - Copy the example properties file:
        ```
        cp application.properties.example src/main/resources/application.properties
        ```
    - Open `application.properties` and fill in the following values:

    | Variable | Description | Example |
    |----------|-------------|---------|
    | `DB_URL` | MySQL JDBC connection URL | `jdbc:mysql://localhost:3306/notequick` |
    | `DB_USER_NAME` | MySQL username | `root` |
    | `DB_PASSWORD` | MySQL password | `yourpassword` |
    | `JWT_SECRET` | Secret key for signing tokens | Any long random string |
    | `JWT_EXPIRATION` | Token expiry in milliseconds | `86400000` |
    | `SMTP_MAIL` | SMTP host for email | `smtp.gmail.com` |
    | `SMTP_PORT` | SMTP port | `587` |
    | `SMTP_USER` | Sender email address | `you@gmail.com` |
    | `SMTP_PASSWORD` | Email app password | Your SMTP password |

7. Set up the frontend environment:
    - Create a `.env.local` file inside the `frontend/` folder:
        ```
        cp .env.local.example .env.local
        ```
    - Update the following values:

    | Variable | Description | Example |
    |----------|-------------|---------|
    | `NEXT_PUBLIC_API_URL` | Backend base URL | `http://localhost:8080` |
    | `JWT_SECRET` | Must match the backend JWT secret | Same value as backend |

8. Create the MySQL database:
    ```sql
    CREATE DATABASE notequick;
    ```

9. Start the application:
    - You need to start both the frontend and backend simultaneously.
    - Start the backend from the `backend/` folder:
        ```
        ./mvnw spring-boot:run
        ```
    - Start the frontend from the `frontend/` folder:
        ```
        npm run dev
        ```

# Workflow

### 1. User Registration and Authentication
- A new user registers with their username, email, and password.
- On successful registration, the user receives a JWT token for authenticated access.
- Returning users log in using their credentials to resume their session.

### 2. Task Management
- The user creates tasks with a title, description, and a date range (from date and to date).
- Tasks are listed in the dashboard and can be updated or marked as complete.
- The system validates that the end date is always after the start date.

### 3. Calendar View
- The user navigates to the calendar to see all scheduled tasks and events laid out by date.
- Clicking on an event opens a detail view with full information.

### 4. Profile and Settings
- The user can update their personal information and preferences from the settings page.
- Changes are only saved when the user explicitly confirms, preventing accidental updates.
- The user can disable their account, which anonymizes their data securely.

# Usage

### 1. Register or Login:
- Open the app at `http://localhost:3000`.
- Register a new account or log in with existing credentials.
- On login, you will be redirected to the main dashboard.

### 2. Create a Task:
- Navigate to the Tasks section from the sidebar.
- Click **New Task** and fill in the title, description, and date range.
- Save the task — it will appear in both the task list and the calendar.

### 3. View the Calendar:
- Navigate to the Calendar section.
- Browse tasks and events by month, week, or day view.

### 4. Manage Your Profile:
- Navigate to the Profile page to view your stats and activity summary.
- Go to Settings to update your name, email, phone, or other personal details.

### 5. Account Settings:
- From the Settings page, manage your account preferences.
- To disable your account, use the account disable option — your unique details will be anonymized and your session will be terminated.

# Features

1. **Task Management**
   - Create, update, and delete tasks with title, description, and date ranges.
   - Validates that the end date is always set after the start date.

2. **Calendar Integration**
   - View all tasks and events on an interactive calendar.
   - Supports month, week, and day views for flexible scheduling.

3. **User Authentication**
   - Secure registration and login using JWT-based authentication.
   - Tokens are managed server-side with configurable expiration.

4. **Multi-Page Dashboard**
   - Dedicated pages for tasks, calendar, profile, and settings.
   - Smooth navigation with animated transitions.
