# Prescripto - Medical Appointment System

A full-stack web application for managing medical appointments between doctors and patients. The project includes separate frontends for patients and admins, with a common backend.

## Project Structure

- **backend/** - Node.js/Express backend API
- **frontend/** - React-based patient portal
- **admin/** - React-based admin dashboard

## Features

- **For Patients**: Book appointments, manage prescriptions, view doctor profiles
- **For Doctors**: Manage appointments, create prescriptions, update availability
- **For Admins**: Add doctors, view appointments, manage system

## Technology Stack

- **Frontend**: React, TailwindCSS, Axios
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Image Storage**: Cloudinary
- **Authentication**: JWT

## Installation and Setup

### Prerequisites
- Node.js (v14+)
- MongoDB
- Cloudinary account (for image uploads)

### Backend Setup
```bash
cd backend
npm install
# Create .env file with required variables (see .env.example)
npm start
```

### Admin Panel Setup
```bash
cd admin
npm install
# Create .env file with required variables (see .env.example)
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
# Create .env file with required variables (see .env.example)
npm run dev
```

## Environment Variables

### Backend (.env)
```
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key
CURRENCY=INR
```

### Frontend & Admin (.env)
```
VITE_BACKEND_URL=http://localhost:4000
VITE_CURRENCY=₹
```

## Running the Application

1. Start the backend server: `cd backend && npm start`
2. Start the admin panel: `cd admin && npm run dev`
3. Start the frontend: `cd frontend && npm run dev`

## Admin Login
- Email: admin@example.com
- Password: greatstack123

## License

MIT 