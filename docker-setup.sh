#!/bin/bash

# Docker Setup Script for Linux/Mac

echo "=================================="
echo "  Course Registration - Docker Setup"
echo "=================================="
echo ""

# Check if Docker is installed
echo "Checking Docker installation..."
if ! command -v docker &> /dev/null; then
    echo "✗ Docker is not installed!"
    echo "Please install Docker from https://www.docker.com/get-started"
    exit 1
fi

DOCKER_VERSION=$(docker --version)
echo "✓ Docker is installed: $DOCKER_VERSION"
echo ""

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "✗ Docker Compose is not installed!"
    echo "Please install Docker Compose from https://docs.docker.com/compose/install/"
    exit 1
fi

COMPOSE_VERSION=$(docker-compose --version)
echo "✓ Docker Compose is installed: $COMPOSE_VERSION"
echo ""

# Start Docker containers
echo "Starting Docker containers..."
docker-compose up -d

if [ $? -eq 0 ]; then
    echo "✓ Docker containers started successfully!"
else
    echo "✗ Failed to start Docker containers"
    exit 1
fi

echo ""

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
sleep 5

RETRIES=0
MAX_RETRIES=30
while [ $RETRIES -lt $MAX_RETRIES ]; do
    if docker exec course-registration-db pg_isready -U postgres > /dev/null 2>&1; then
        echo "✓ PostgreSQL is ready!"
        break
    fi
    RETRIES=$((RETRIES+1))
    echo "Waiting... ($RETRIES/$MAX_RETRIES)"
    sleep 1
done

if [ $RETRIES -eq $MAX_RETRIES ]; then
    echo "✗ PostgreSQL failed to start"
    exit 1
fi

echo ""

# Copy environment file
echo "Setting up environment variables..."
if [ -f .env ]; then
    echo "⚠ .env file already exists, skipping..."
else
    cp .env.docker .env
    echo "✓ Environment file created!"
fi

echo ""

# Install dependencies
echo "Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✓ Dependencies installed!"
else
    echo "✗ Failed to install dependencies"
    exit 1
fi

echo ""

# Generate Prisma Client
echo "Generating Prisma Client..."
npx prisma generate

if [ $? -eq 0 ]; then
    echo "✓ Prisma Client generated!"
else
    echo "✗ Failed to generate Prisma Client"
    exit 1
fi

echo ""

# Run migrations
echo "Running database migrations..."
npx prisma migrate dev --name init

if [ $? -eq 0 ]; then
    echo "✓ Migrations completed!"
else
    echo "⚠ Migrations may have already been applied"
fi

echo ""

# Seed database
echo "Seeding database with admin user..."
npx tsx prisma/seed.ts

if [ $? -eq 0 ]; then
    echo "✓ Database seeded successfully!"
else
    echo "⚠ Seeding may have already been done"
fi

echo ""
echo "=================================="
echo "  Setup Complete!"
echo "=================================="
echo ""
echo "Services running:"
echo "  • PostgreSQL: localhost:5432"
echo "  • pgAdmin: http://localhost:5050"
echo ""
echo "Admin credentials:"
echo "  • Username: admin"
echo "  • Password: admin123"
echo ""
echo "To start the development server:"
echo "  npm run dev"
echo ""
echo "To stop Docker services:"
echo "  docker-compose down"
echo ""
