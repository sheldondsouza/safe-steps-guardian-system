
# IoT-Based Fall Prevention System

This project is a full-stack application designed to help prevent falls among elderly individuals through IoT sensor monitoring, data analysis, and alert systems.

## Features

- Real-time monitoring of movement patterns and fall risk
- Historical data visualization and trends
- Alert system for potential fall risks
- User profiles with medical information and caregiver contacts
- Responsive design for desktop and mobile devices

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Recharts for data visualization
- Shadcn/UI component library

### Backend
- Node.js
- Express.js
- RESTful API design

## Project Structure

```
├── src/                  # Frontend React code
│   ├── components/       # React components
│   ├── pages/            # Page components
│   ├── lib/              # Utility functions
│   └── ...
├── server/               # Backend Node.js code
│   ├── controllers/      # API controllers
│   ├── routes/           # API routes
│   └── ...
└── ...
```

## Getting Started

### Prerequisites
- Node.js (v14+)
- npm or yarn

### Installation

1. Clone the repository
2. Install frontend dependencies:
   ```
   npm install
   ```
3. Install backend dependencies:
   ```
   cd server
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```
   cd server
   npm run dev
   ```
   The server will run on http://localhost:5000

2. Start the frontend development server:
   ```
   npm run dev
   ```
   The frontend will run on http://localhost:5173

## API Endpoints

### Sensors
- `GET /api/sensors` - Get all sensor data
- `GET /api/sensors/recent-activity` - Get recent activity data
- `POST /api/sensors/update` - Update sensor status (for IoT devices)

### Alerts
- `GET /api/alerts` - Get all alerts with optional filtering
- `POST /api/alerts` - Create a new alert
- `PUT /api/alerts/:id` - Update an alert
- `DELETE /api/alerts/:id` - Delete an alert

### Users
- `GET /api/users/profile/:id` - Get user profile
- `PUT /api/users/profile/:id` - Update user profile

## Next Steps for Production

1. Implement authentication and authorization
2. Connect to a real database (MongoDB, PostgreSQL)
3. Set up proper error handling and logging
4. Add automated testing
5. Configure for production deployment
