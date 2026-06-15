# TaskMatrix - Task Management System

A full-stack task management system with real-time updates, Kanban board, analytics, and team collaboration.

## Tech Stack

**Frontend:** React, Vite, Tailwind CSS, Redux Toolkit, Socket.IO  
**Backend:** Node.js, Express, MongoDB, Socket.IO, JWT  
**Storage:** Cloudinary (file uploads), MongoDB Atlas (database)

## Quick Start

### Prerequisites
- Node.js 16+
- MongoDB Atlas account
- Cloudinary account

### Installation

1. **Clone and install dependencies**
```bash
git clone <repo-url>
cd taskmatrix

# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

2. **Configure environment variables**

Create `server/.env`:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_min_32_chars
JWT_REFRESH_SECRET=your_refresh_secret_min_32_chars
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
CLIENT_URL=http://localhost:5173
```

Create `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

3. **Run the application**
```bash
# Backend (from server directory)
npm run dev

# Frontend (from client directory)  
npm run dev
```

Access at `http://localhost:5173`

## Features

- User authentication with JWT
- Kanban board with drag-and-drop
- Real-time updates via WebSocket
- Task management (CRUD, priorities, due dates, tags)
- Team collaboration
- Comments and notifications
- Analytics dashboard
- Dark mode
- File attachments

## API Endpoints

**Auth:** `/api/auth/register`, `/api/auth/login`, `/api/auth/refresh`  
**Tasks:** `/api/tasks` (GET, POST, PUT, DELETE)  
**Teams:** `/api/teams` (GET, POST, PUT, DELETE)  
**Users:** `/api/users/profile`, `/api/users/search`  
**Comments:** `/api/comments/task/:taskId`  
**Notifications:** `/api/notifications`

## Deployment

**Frontend:** Deploy to Vercel with environment variables  
**Backend:** Deploy to Render/Railway with environment variables  
**Database:** Use MongoDB Atlas cluster

## License

MIT
