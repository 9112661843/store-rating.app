# Store Ratings Application

A full-stack web application that allows users to submit ratings for stores registered on the platform. Built with React.js frontend and Express.js backend with PostgreSQL database.

## Features

### System Administrator
- Dashboard with statistics (total users, stores, ratings)
- Add new stores, normal users, and admin users
- View and filter lists of users and stores
- Manage user roles and permissions

### Normal User
- Register and login to the platform
- View all registered stores with search functionality
- Submit and modify ratings (1-5 stars) for stores
- Update password after login

### Store Owner
- Dashboard showing store information and average rating
- View list of users who rated their store
- See individual ratings and user details

## Tech Stack

- **Frontend**: React.js with React Router
- **Backend**: Express.js with Node.js
- **Database**: PostgreSQL
- **Authentication**: JWT tokens
- **Styling**: Custom CSS with modern design

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

### 1. Database Setup
1. Install PostgreSQL and create a database:
```sql
CREATE DATABASE store_ratings;
```

2. Update database connection in `backend/server.js`:
```javascript
const pool = new Pool({
  user: 'your_username',
  host: 'localhost',
  database: 'store_ratings',
  password: 'your_password',
  port: 5432,
});
```

### 2. Backend Setup
```bash
cd backend
npm install
npm start
```

The backend will run on `http://localhost:5000` and automatically create the required database tables.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

The frontend will run on `http://localhost:3000`.

## Default Admin Account

The system automatically creates a default admin account:
- **Email**: admin@example.com
- **Password**: Admin@123

## Quick Start

1. Start the backend server
2. Start the frontend development server
3. Access the application at `http://localhost:3000`
4. Login with admin credentials or register a new user
5. Explore different user roles and functionalities

## Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- CORS configuration 