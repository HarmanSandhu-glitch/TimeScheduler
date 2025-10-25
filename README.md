# TimeScheduler

A modern, modular task scheduling application built with the MERN stack.

## Features

- 📅 **Daily Session Management**: Automatically generate and manage 15-minute time slots
- ✅ **Task Management**: Create, update, and delete tasks with priorities
- 📊 **Visual Analytics**: Dashboard with charts showing task status and completion rates
- 🌓 **Dark Mode**: Material You-inspired design with dark mode support
- 📱 **Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- 🔐 **Secure Authentication**: Email verification with OTP

## Tech Stack

### Frontend
- **React 19** with Vite
- **Redux Toolkit** for state management
- **Tailwind CSS** for styling (Material You design)
- **Recharts** for data visualization
- **Axios** for API calls
- **date-fns** for date manipulation

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Nodemailer** for email services

## Project Structure

See [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for detailed documentation on the modular architecture.

```
TimeScheduler/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── config/         # Configuration files
│   │   ├── constants/      # App constants
│   │   ├── features/       # Redux slices
│   │   ├── hooks/          # Custom hooks
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   └── utils/          # Utility functions
│   └── ...
│
└── server/                 # Express backend
    ├── config/             # Server configuration
    ├── constants/          # App constants
    ├── controllers/        # Business logic
    ├── middlewares/        # Express middlewares
    ├── models/             # Database models
    ├── routes/             # API routes
    ├── utils/              # Utility functions
    └── server.js           # Entry point
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- SMTP credentials (for email verification)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/TimeScheduler.git
   cd TimeScheduler
   ```

2. **Install client dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Install server dependencies**
   ```bash
   cd ../server
   npm install
   ```

### Configuration

#### Client Setup

1. Create `.env` file in `client/` directory:
   ```bash
   cd client
   cp .env.example .env
   ```

2. Update the `.env` file:
   ```env
   VITE_API_BASE_URL=http://localhost:3333
   ```

#### Server Setup

1. Create `.env` file in `server/` directory:
   ```env
   # Server
   PORT=3333
   NODE_ENV=development

   # Database
   MONGODB_URI=mongodb://localhost:27017/timescheduler

   # JWT
   JWT_SECRET=your-super-secret-jwt-key-change-this
   JWT_EXPIRE=30d

   # SMTP (Email Service)
   SMTP_HOST=smtp-relay.sendinblue.com
   SMTP_PORT=587
   SMTP_USER=your-smtp-username
   SMTP_PASS=your-smtp-password
   SMTP_FROM=noreply@timescheduler.com

   # CORS
   CORS_ORIGIN=http://localhost:5173

   # Session Configuration
   SESSION_START_TIME=00:00
   SESSION_END_TIME=23:45
   SESSION_INTERVAL=15
   ```

### Running the Application

1. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

2. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```
   Server will run on `http://localhost:3333`

3. **Start the frontend development server**
   ```bash
   cd client
   npm run dev
   ```
   Client will run on `http://localhost:5173`

4. **Open your browser** and navigate to `http://localhost:5173`

## Usage

### Authentication

1. **Sign Up**
   - Navigate to the sign-up page
   - Enter your name, email, and password
   - Verify your email with the OTP sent to your inbox

2. **Sign In**
   - Enter your email and password
   - You'll be redirected to the dashboard

### Dashboard

The dashboard provides an overview of your tasks and sessions:
- **Task Status Chart**: Visualize tasks by their status (pending, in-progress, completed)
- **Task Priority Chart**: See the distribution of tasks by priority
- **Weekly/Monthly Completion**: Track your productivity over time

### Task Management

1. **Create a Task**
   - Click "Create New Task" button
   - Enter task name and select priority
   - Click "Create Task"

2. **Edit a Task**
   - Click the edit icon next to any task
   - Modify the details and click "Save Changes"

3. **Delete a Task**
   - Click the delete icon next to any task
   - Confirm the deletion

### Session Management

Sessions are automatically generated for each day with 15-minute intervals.

1. **View Today's Sessions**
   - Sessions are displayed in a table format
   - Each row represents an hour, columns represent 15-minute intervals

2. **Assign a Task to a Session**
   - Click the edit icon on any session
   - Select a task from the dropdown
   - Add an optional note
   - Click "Save Changes"

3. **Mark Session as Complete**
   - Check the checkbox next to any session
   - The session will be marked as completed

## API Endpoints

### Authentication
- `POST /api/users/signup` - Register a new user
- `POST /api/users/verify-otp` - Verify email with OTP
- `POST /api/users/signin` - Sign in user
- `POST /api/users/logout` - Logout user
- `POST /api/users/update-profile` - Update user profile

### Tasks
- `GET /api/tasks/:userId` - Get all tasks for a user
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:taskId` - Update a task
- `DELETE /api/tasks/:taskId` - Delete a task

### Sessions
- `POST /api/sessions/create-daily` - Create daily sessions
- `GET /api/sessions/date/:date` - Get sessions by date
- `POST /api/sessions/range` - Get sessions by date range
- `PUT /api/sessions/:sessionId/status` - Update session status
- `PUT /api/sessions/:sessionId/task` - Assign task to session
- `PUT /api/sessions/:sessionId/note` - Update session note

## Development

### Code Organization

- **Client-side**:
  - All API calls go through the `services/` layer
  - State management uses Redux Toolkit slices in `features/`
  - Reusable logic in `utils/`
  - Constants in `constants/`

- **Server-side**:
  - Routes define endpoints in `routes/`
  - Controllers handle business logic in `controllers/`
  - Database models in `models/`
  - Utilities and helpers in `utils/`
  - Configuration in `config/`

### Adding New Features

See [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for detailed guidelines on adding new features.

## Build for Production

### Client
```bash
cd client
npm run build
```

### Server
```bash
cd server
# Set NODE_ENV=production in .env
npm start
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Material You design system by Google
- Recharts for beautiful charts
- The MERN stack community
