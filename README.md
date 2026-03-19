# LCU Power Management System

Official electricity monitoring and prediction platform for Lead City University.

## Project Structure

- `frontend/`: Next.js 14 App Router, TailwindCSS, Lucide icons, Recharts.
- `backend/`: Node.js Express API, TypeScript, PostgreSQL (with TimescaleDB extension), Redis, Socket.io.

## Getting Started

### Prerequisites

- Node.js 18+
- Docker & Docker Compose (for database and redis)

### Step 1: Start Required Services

Run the following command in the project root to start PostgreSQL (with TimescaleDB) and Redis using Docker:

```bash
docker-compose up -d
```

### Step 2: Configure Environment Variables

#### Backend
A `.env` file has been created in the `backend/` directory with the default values for the Docker services. You can adjust it if you want to use a different database or redis setup.

#### Frontend
A `.env.local` file has been created in the `frontend/` directory pointing to `http://localhost:3001/api`.

### Step 3: Start the Backend Server

Navigate to the `backend/` directory, install dependencies, and start the development server:

```bash
cd backend
npm install
npm run dev
```

The backend will be running on [http://localhost:3001](http://localhost:3001).

### Step 4: Start the Frontend Application

Navigate to the `frontend/` directory, install dependencies, and start the development server:

```bash
cd frontend
npm install
npm run dev
```

The frontend will be running on [http://localhost:3000](http://localhost:3000).

## Features

- **Live Grid Sync**: Real-time power status updates from campus zones.
- **Smart Predictions**: 24-hour power source forecasts powered by history data.
- **Crowdsourced Reports**: Students can report power outages to verify grid status.
- **Interactive Dashboard**: Visual representation of current status and predictions.
- **Authentication**: Secure login and signup with matric number validation for students.

## Troubleshooting

### "No response from server"
If you see this error on the signup or login page, it means the frontend cannot communicate with the backend. 
- Ensure the **backend server** is running (`npm run dev` in the `backend` folder).
- Ensure the backend server is listening on port **3001**.
- Check the backend console for any database connection errors.

### Database Connection Error
If the backend fails to start because it cannot connect to the database:
- Ensure **Docker Desktop** is running.
- Run `docker-compose ps` to verify that `power-management-db` is up.
