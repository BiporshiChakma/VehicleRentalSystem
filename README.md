***********Vehicle Rental System***********
=> => Project Overview
A backend API for a vehicle rental management system that handles:

Vehicles - Manage vehicle inventory with availability tracking
Customers - Manage customer accounts and profiles
Bookings - Handle vehicle rentals, returns and cost calculation
Authentication - Secure role-based access control (Admin and Customer roles)

live: https://vehiclerentalsystem-three.vercel.app/


Technology Stack
Node.js + TypeScript
Express.js (web framework)
PostgreSQL (database)
bcrypt (password hashing)
jsonwebtoken (JWT authentication)


Authentication & Authorization
User Roles
Admin - Full system access to manage vehicles, users and all bookings
Customer - Can register, view vehicles, create/manage own bookings
Authentication Flow
Passwords are hashed using bcrypt before storage into the database
User login via /api/v1/auth/signin and receives a JWT (JSON Web Token)
Protected endpoints require token in header: Authorization: Bearer <token>
Validates the token and checks user permissions
Access granted if authorized, otherwise returns 401 (Unauthorized) or 403 (Forbidden)

signup : https://vehiclerentalsystem-three.vercel.app/api/v1/auth/signup
json: {
    "name" : "user4",
    "role": "user",
    "email": "userl@mail.com",
    "password": "12345",
    "phone": "015578646"
} 
result : 
{
    "success": true,
    "user": {
        "id": 17,
        "name": "user4",
        "role": "user",
        "email": "userl@mail.com",
        "password": "$2b$10$X93Ay7/M9yXI02.tpUjllO66xvF3gP6gJL0bp6vnBfIZM01kaovFm",
        "phone": "015578646",
        "created_at": "2025-12-31T04:19:39.117Z",
        "updated_at": "2025-12-31T04:19:39.117Z"
    }
}


login: https://vehiclerentalsystem-three.vercel.app/api/v1/auth/login
json: 
{
     "email": "userl@mail.com",
    "password": "12345"
}
result: 
{
    "success": true,
    "message": "login successful",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsIm5hbWUiOiJ1c2VyNCIsImVtYWlsIjoidXNlcmxAbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc2NzE1NDc5OSwiZXhwIjoxNzY3NzU5NTk5fQ.bhQGCeGlSV0C9SdY9flOq_JxY7qXdOwB1D064FDJbTo",
        "user": {
            "id": 17,
            "name": "user4",
            "role": "user",
            "email": "userl@mail.com",
            "password": "$2b$10$X93Ay7/M9yXI02.tpUjllO66xvF3gP6gJL0bp6vnBfIZM01kaovFm",
            "phone": "015578646",
            "created_at": "2025-12-31T04:19:39.117Z",
            "updated_at": "2025-12-31T04:19:39.117Z"
        }
    }
}
