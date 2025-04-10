# React Authentication Application

A secure authentication skeleton application built with React and Express.js featuring user authentication, profile management, and responsive design.

## Features

- User authentication (login/logout)
- Password reset functionality
- Profile management with avatar upload
- Responsive design for all devices
- PostgreSQL database integration
- Security best practices with password hashing

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- PostgreSQL database (the app uses the DATABASE_URL environment variable)

### Installation

1. Clone the repository
2. Run the setup script to install dependencies and set up the database:

```bash
./setup.sh
```

This script will:
- Install all required dependencies
- Set up the database schema
- Verify the database connection and structure

### Running the Application

Start the development server:

```bash
npm run dev
```

The application will be available at http://localhost:5000

### Database Verification

You can verify the database setup at any time with:

```bash
npx tsx scripts/db-verify.ts
```

### Database Manual Setup

If you need to manually set up the database:

```bash
npx tsx scripts/db-setup.ts
```

## Project Structure

- `/client` - React frontend
- `/server` - Express.js backend
- `/shared` - Shared types and schemas
- `/scripts` - Utility scripts for setup and verification

## Authentication Flow

1. User registers or logs in
2. Upon successful authentication, a session is created
3. Protected routes require authentication
4. User can log out to terminate the session

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.