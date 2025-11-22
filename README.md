# HealthSync - MERN Health Management System

HealthSync is a comprehensive health management application built with the MERN stack (MongoDB, Express.js, React, Node.js). It helps users track their health metrics, manage medications, monitor symptoms, and receive AI-powered health insights.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)

## ✨ Features

- **User Authentication**: Secure JWT-based authentication system
- **Health Dashboard**: Comprehensive dashboard with health metrics and insights
- **Medication Management**: Track medications with automated reminders
- **Symptom Tracking**: Log and analyze symptoms over time
- **AI-Powered Insights**: Get health recommendations using BioMistral AI
- **Daily Monitoring**: Log daily health metrics (sleep, water intake, meals, mood, vitals)
- **Diet Recommendations**: Personalized diet plans based on health data
- **Alert System**: Email and SMS notifications for important health reminders
- **Health Reports**: Generate and export PDF health reports
- **AI Chat Assistant**: Interactive health chatbot for queries

## 🛠️ Tech Stack

### Frontend
- **React** (v19.2.0) - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Zustand** - State management
- **TailwindCSS** - Utility-first CSS framework
- **Chart.js & Recharts** - Data visualization
- **Lucide React** - Icon library
- **React Hot Toast** - Toast notifications

### Backend
- **Node.js** with **Express** (v5.1.0) - Server framework
- **MongoDB** with **Mongoose** - Database
- **JWT** - Authentication
- **Bcrypt.js** - Password hashing
- **BioMistral-7B** - AI-powered features
- **Twilio** - SMS notifications
- **Nodemailer** - Email notifications
- **Node-Cron** - Job scheduling
- **Multer** - File uploads
- **PDFKit** - PDF generation
- **Firebase Admin** - Additional services

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **MongoDB** - Either:
  - Local MongoDB installation ([Download](https://www.mongodb.com/try/download/community))
  - MongoDB Atlas account (cloud) - [Sign up](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download here](https://git-scm.com/)

### Optional (for full functionality):
- **Twilio Account** - For SMS notifications ([Sign up](https://www.twilio.com/))
-**BIOMISTRAL_7B** - For AI features
- **Email Account** - For SMTP email notifications (Gmail recommended)

## 📥 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/krish070904/HEALTHSYNC_MERN.git
cd HEALTHSYNC_MERN
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

## ⚙️ Environment Setup

### Backend Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/healthsync
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/healthsync

# JWT Secret (generate a random string)
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production

# BIOMISTRAL API Key
BIOMISTRAL_API_KEY=your_biomistral_api_key_here

# Hugging Face API (for ML models)
HF_API_KEY=your_huggingface_api_key_here

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_specific_password

# Twilio Configuration (for SMS)
TWILIO_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE=+1234567890

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:5173

# Optional: ResNet Configuration
RESNET_TIMEOUT=30000
RESNET_MAX_RETRIES=3
LOG_LEVEL=info
```

### Frontend Environment Variables (Optional)

Create a `.env` file in the `frontend` directory if needed:

```env
VITE_API_URL=http://localhost:5000
```

### 🔑 Getting Your API Keys

#### MongoDB URI:
1. **Local MongoDB**: Use `mongodb://localhost:27017/healthsync`
2. **MongoDB Atlas**:
   - Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a cluster
   - Click "Connect" → "Connect your application"
   - Copy the connection string and replace `<password>` with your database password

#### JWT Secret:
- Generate a random secure string (at least 32 characters)
- You can use: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`


#### Hugging Face API:
1. Sign up at [Hugging Face](https://huggingface.co/)
2. Go to Settings → Access Tokens
3. Create a new token
4. Copy the token

#### Email (Gmail):
1. Use your Gmail address for `SMTP_USER`
2. For `SMTP_PASS`, you need an "App Password":
   - Go to Google Account settings
   - Security → 2-Step Verification (enable if not enabled)
   - App passwords → Generate new app password
   - Use the generated 16-character password

#### Twilio (SMS):
1. Sign up at [Twilio](https://www.twilio.com/)
2. Get your Account SID and Auth Token from the dashboard
3. Get a Twilio phone number
4. Add these to your `.env` file

## 🚀 Running the Application

### Development Mode

#### Option 1: Run Backend and Frontend Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
The backend server will start on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
The frontend will start on `http://localhost:5173`

#### Option 2: Run Both Concurrently (if you set up a script)

You can create a `scripts` directory with a script to run both:

**Windows (PowerShell):**
```powershell
# In the root directory
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"
```

**Linux/Mac:**
```bash
# Install concurrently globally (once)
npm install -g concurrently

# In the root package.json, add this script:
# "dev": "concurrently \"cd backend && npm run dev\" \"cd frontend && npm run dev\""

# Then run:
npm run dev
```

### Production Mode

#### Build Frontend:
```bash
cd frontend
npm run build
```

#### Run Backend in Production:
```bash
cd backend
NODE_ENV=production node server.js
```

## 📁 Project Structure

```
HEALTHSYNC_MERN/
├── backend/
│   ├── src/
│   │   ├── config/          # Database and app configuration
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Auth and validation middleware
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API routes
│   │   ├── scheduler/       # Cron jobs for reminders
│   │   ├── schedulers/      # Daily monitoring schedulers
│   │   ├── utils/           # Utility functions (email, SMS, AI)
│   │   └── ml/              # Machine learning models
│   ├── uploads/             # File uploads directory
│   ├── .env                 # Environment variables
│   ├── server.js            # Entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── store/           # Zustand state management
│   │   ├── utils/           # Utility functions
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   ├── public/              # Static assets
│   ├── index.html
│   └── package.json
│
└── README.md
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Main Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | Register new user |
| `/api/auth/login` | POST | User login |
| `/api/dashboard` | GET | Get dashboard data |
| `/api/symptoms` | GET, POST | Symptom tracking |
| `/api/medications` | GET, POST, PUT, DELETE | Medication management |
| `/api/daily-monitoring` | GET, POST | Daily health logs |
| `/api/diet` | GET, POST | Diet recommendations |
| `/api/alerts` | GET, PUT | Notification alerts |
| `/api/chat` | POST | AI chat assistant |
| `/api/report/pdf` | GET, POST | Generate health reports |

## 🐛 Troubleshooting

### Common Issues

#### 1. **MongoDB Connection Error**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:**
- Ensure MongoDB is running locally: `mongod`
- Or use MongoDB Atlas cloud URL in `.env`

#### 2. **Port Already in Use**
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:**
- Change the PORT in backend `.env` file
- Or kill the process using the port:
  ```bash
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  
  # Linux/Mac
  lsof -ti:5000 | xargs kill -9
  ```

#### 3. **Module Not Found Errors**
```
Error: Cannot find module 'express'
```
**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 4. **CORS Errors**
**Solution:**
- Ensure backend CORS is configured for `http://localhost:5173`
- Check that frontend is making requests to `http://localhost:5000`

#### 5. **AI Features Not Working**
**Solution:**
- Verify your `BIOMISTRAL_API_KEY` is valid You can also use any other api key if wanted
- Check API key quotas and limits
- Ensure you have internet connection

#### 6. **Email/SMS Not Sending**
**Solution:**
- Verify SMTP credentials for email
- Check Twilio credentials for SMS
- Ensure proper phone number format for Twilio
- Check for API quota limits

### Need Help?

If you encounter issues:
1. Check the console logs in both terminals
2. Verify all environment variables are set correctly
3. Ensure all dependencies are installed
4. Check MongoDB connection
5. Review the API service credentials (BioMistral, Twilio, SMTP)

## 📝 License

This project is part of a Final Year Project.

## 👥 Contributors

- [Krish](https://github.com/krish070904)

## 🙏 Acknowledgments

- BIOMISTRAL for health insights
- MongoDB for database services
- Twilio for SMS capabilities
- All open-source contributors

---

**Happy Coding! 🚀 Stay Healthy! 💚**