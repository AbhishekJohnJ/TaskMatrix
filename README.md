# TaskMatrix - Professional Task Management System

![TaskMatrix](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

A complete production-ready Task Management System similar to Trello, Asana, and Jira with modern UI, real-time updates, analytics dashboard, and role-based access control.

## 🚀 Features

### Core Features
- ✅ **User Authentication & Authorization** - JWT-based secure authentication with refresh tokens
- ✅ **Role-Based Access Control** - Admin and User roles with different permissions
- ✅ **Task Management** - Create, update, delete, duplicate, archive tasks
- ✅ **Kanban Board** - Drag-and-drop interface for task management
- ✅ **Real-Time Updates** - Socket.IO powered live updates
- ✅ **Notifications System** - Real-time notifications with notification center
- ✅ **Comments System** - Task comments with real-time updates
- ✅ **File Uploads** - Image and document attachments with Cloudinary
- ✅ **Search & Filter** - Advanced search and filtering capabilities
- ✅ **Calendar View** - View and manage tasks in calendar format
- ✅ **Analytics Dashboard** - Comprehensive charts and statistics
- ✅ **Activity Log** - Track all user actions
- ✅ **Team Collaboration** - Create teams and assign tasks
- ✅ **Dark Mode** - Light and dark theme support
- ✅ **Responsive Design** - Mobile-first design approach

### Security Features
- 🔒 Password hashing with bcrypt
- 🔒 JWT access and refresh tokens
- 🔒 Rate limiting
- 🔒 XSS protection
- 🔒 MongoDB injection protection
- 🔒 CORS configuration
- 🔒 Input validation
- 🔒 Helmet security headers

## 📁 Project Structure

```
taskmatrix/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── assets/        # Images, fonts, static files
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context providers
│   │   ├── features/      # Feature-based modules
│   │   ├── hooks/         # Custom React hooks
│   │   ├── layouts/       # Layout components
│   │   ├── pages/         # Page components
│   │   ├── redux/         # Redux store and slices
│   │   ├── routes/        # Route configuration
│   │   ├── services/      # API services
│   │   ├── utils/         # Utility functions
│   │   └── App.jsx        # Main app component
│   ├── public/            # Public assets
│   ├── package.json
│   └── vite.config.js
│
├── server/                # Backend Node.js application
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── sockets/          # Socket.IO handlers
│   ├── utils/            # Utility functions
│   ├── validators/       # Input validators
│   ├── logs/             # Log files
│   ├── uploads/          # Uploaded files
│   ├── app.js            # Express app
│   └── package.json
│
├── docker-compose.yml     # Docker compose configuration
└── README.md             # Project documentation
```

## 🛠️ Technology Stack

### Frontend
- **React.js** - UI library with Vite
- **Tailwind CSS** - Utility-first CSS framework
- **Redux Toolkit** - State management
- **React Query** - Server state management
- **React Router DOM** - Routing
- **Socket.IO Client** - Real-time communication
- **Recharts** - Data visualization
- **Framer Motion** - Animations
- **React Hook Form** - Form handling
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB Atlas** - Database
- **Mongoose** - ODM
- **Socket.IO** - Real-time communication
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Cloudinary** - File storage

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- Cloudinary account
- npm or yarn

### 1. Clone the repository
```bash
git clone <repository-url>
cd taskflow
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create `.env` file in server directory:
```env
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmatrix?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_jwt_secret_key_here_min_32_characters
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here_min_32_characters
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (for password reset)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Frontend URL
CLIENT_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd client
npm install
```

Create `.env` file in client directory:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

Start the frontend development server:
```bash
npm run dev
```

## 🐳 Docker Setup

Build and run with Docker:
```bash
docker-compose up --build
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## 🚀 Deployment

### Frontend (Vercel)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
cd client
vercel
```

3. Set environment variables in Vercel dashboard

### Backend (Render)

1. Create new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `cd server && npm install`
4. Set start command: `node server/app.js`
5. Add environment variables from `.env`

### Database (MongoDB Atlas)

1. Create cluster on MongoDB Atlas
2. Add IP whitelist (0.0.0.0/0 for production)
3. Copy connection string to environment variables

## 📚 API Documentation

### Authentication Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

#### Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "your_refresh_token"
}
```

### Task Endpoints

#### Create Task
```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete project documentation",
  "description": "Write comprehensive docs",
  "status": "todo",
  "priority": "high",
  "dueDate": "2024-12-31",
  "tags": ["documentation", "urgent"],
  "assignedTo": "user_id"
}
```

#### Get All Tasks
```http
GET /api/tasks?status=todo&priority=high&page=1&limit=10
Authorization: Bearer <token>
```

#### Update Task
```http
PUT /api/tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "in-progress"
}
```

#### Delete Task
```http
DELETE /api/tasks/:id
Authorization: Bearer <token>
```

### User Endpoints

#### Get Profile
```http
GET /api/users/profile
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "fullName": "John Updated",
  "username": "johnupdated"
}
```

### Team Endpoints

#### Create Team
```http
POST /api/teams
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Development Team",
  "description": "Frontend and Backend developers"
}
```

## 🧪 Testing

### Backend Tests
```bash
cd server
npm test
```

### Frontend Tests
```bash
cd client
npm test
```

## 👥 User Roles

### Admin
- View all users
- View all tasks
- Delete any task
- Manage users
- Manage system settings

### User
- Create tasks
- Update own tasks
- Delete own tasks
- Manage profile
- View team tasks

## 🎨 UI Features

- **Glassmorphism** design
- **Smooth animations** with Framer Motion
- **Responsive layout** - Mobile, tablet, desktop
- **Modern dashboard** with cards and charts
- **Professional color palette**
- **Dark mode** support

## 📊 Analytics

The analytics dashboard includes:
- Total tasks statistics
- Tasks by status chart
- Tasks by priority chart
- Monthly progress chart
- Weekly activity chart
- Productivity score
- Completion rate

## 🔔 Notifications

Real-time notifications for:
- Task assignments
- Task updates
- Due date reminders
- Comments on tasks
- System announcements

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For support or queries, contact: support@taskmatrix.com

---

Built with ❤️ by TaskMatrix Team
