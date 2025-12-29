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
