#!/bin/bash

# Store Ratings App Deployment Script
# This script helps prepare your app for deployment

echo "🚀 Store Ratings App Deployment Helper"
echo "======================================"

# Check if we're in the right directory
if [ ! -f "backend/server.js" ] || [ ! -f "frontend/package.json" ]; then
    echo "❌ Error: Please run this script from the root directory of your project"
    exit 1
fi

echo "✅ Project structure verified"

# Create .env files for local development
echo "📝 Creating environment files..."

# Backend .env
cat > backend/.env << EOF
# Database Configuration
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=AS9112661843
DB_NAME=store_ratings
DB_PORT=5432

# JWT Configuration
JWT_SECRET=your-development-secret-key-change-in-production

# Server Configuration
NODE_ENV=development
PORT=5000
EOF

# Frontend .env
cat > frontend/.env << EOF
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api
EOF

echo "✅ Environment files created"

# Install dependencies
echo "📦 Installing dependencies..."

echo "Installing backend dependencies..."
cd backend
npm install
cd ..

echo "Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo "✅ Dependencies installed"

# Create deployment checklist
cat > DEPLOYMENT_CHECKLIST.md << EOF
# Deployment Checklist

## Pre-Deployment
- [ ] Database created (Supabase/Neon)
- [ ] Backend environment variables ready
- [ ] Frontend environment variables ready

## Backend Deployment
- [ ] Deploy to Render/Railway/Heroku
- [ ] Set environment variables:
  - NODE_ENV=production
  - DB_HOST=your-database-host
  - DB_USER=postgres
  - DB_PASSWORD=your-database-password
  - DB_NAME=postgres
  - DB_PORT=5432
  - JWT_SECRET=your-secure-jwt-secret
  - PORT=10000

## Frontend Deployment
- [ ] Deploy to Netlify
- [ ] Set environment variable:
  - REACT_APP_API_URL=https://your-backend-url.com/api

## Post-Deployment
- [ ] Update CORS in backend/server.js
- [ ] Test registration
- [ ] Test login (admin: adi@gmail.com / Adi@123)
- [ ] Test user functionality

## URLs to Note
- Backend URL: _________________
- Frontend URL: _________________
- Database URL: _________________
EOF

echo "✅ Deployment checklist created"

echo ""
echo "🎉 Setup complete! Next steps:"
echo "1. Create a PostgreSQL database (Supabase/Neon)"
echo "2. Deploy backend to Render/Railway/Heroku"
echo "3. Deploy frontend to Netlify"
echo "4. Follow the checklist in DEPLOYMENT_CHECKLIST.md"
echo ""
echo "📚 See COMPLETE_DEPLOYMENT_GUIDE.md for detailed instructions" 