#!/bin/bash

# Start Docker services
echo "Starting database and redis..."
docker-compose up -d

# Wait for database to be ready
echo "Waiting for database to be ready..."
until docker exec power-management-db pg_isready -U postgres; do
  sleep 2
done

# Start backend in a new terminal tab (macOS specific) or in background
echo "Starting backend..."
cd backend && npm install && npm run dev &

# Start frontend
echo "Starting frontend..."
cd ../frontend && npm install && npm run dev
