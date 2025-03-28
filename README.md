# User Management System

A robust user management system built with Node.js, Express, and MongoDB, featuring role-based access control (RBAC) and JWT authentication.

## Features

- Role-based access control (RBAC) with four roles:
  - Farm Admin
  - Farm Manager
  - Farm Technician
  - End User
- JWT-based authentication
- Secure password hashing with bcrypt
- MongoDB database with Mongoose ORM
- RESTful API endpoints
- Input validation and sanitization
- Error handling middleware
- Security features (helmet, cors)
- API request logging

## Prerequisites

- Node.js >= 19
- MongoDB
- npm 

## Installation

1. Clone the repository:
```bash
git clone git@github.com:Amaan061/User-Management-System.git
cd user-management-system
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file in the root directory and add your configuration:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/farm_management
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h
SERVER_URL=http://localhost:3000
```

## Running the Application

Development mode:
```bash
npm run dev
```


## API Endpoints

### Authentication Routes
- POST /api/auth/signup - Register a new user
- POST /api/auth/login - Authenticate user and get token

### Admin Routes (Protected)
- GET /api/admin/users - Get all users
- PUT /api/admin/users/:id - Update user role

### Manager Routes (Protected)
- POST /api/manager/tasks - Create a new task
- GET /api/manager/tasks - Get all tasks assigned by manager
- GET /api/manager/technicians - Get all active technicians

### Technician Routes (Protected)
- GET /api/technician/tasks - Get tasks assigned to technician
- PUT /api/technician/tasks/:id - Update task status

### User Routes (Protected)
- GET /api/user/profile - Get user profile
- PUT /api/user/profile - Update user profile


## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Request rate limiting
- Security headers with helmet
- CORS configuration
- Input validation

## Error Handling

The application includes a centralized error handling middleware that catches and processes all errors, providing consistent error responses across the API.
