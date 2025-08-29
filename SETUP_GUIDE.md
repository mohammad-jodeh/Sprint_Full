# Frontend-Backend Connection Setup Guide

## Prerequisites

### Database Setup
The backend requires PostgreSQL to be running. Set up a PostgreSQL database:

1. Install PostgreSQL on your system
2. Create a database named `sprintify`
3. Create a user `postgres` with appropriate permissions
4. Update the `.env` file in the backend with your database password

### Backend Setup (.env configuration)
Create `sprintify_backend/finalAPI/.env` with:
```
DB_PASSWORD=your_postgres_password
PORT=4000
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

### Installation & Build
```bash
# Backend
cd sprintify_backend/finalAPI
npm install
npm run build

# Frontend  
cd sprintify_frontend
npm install --legacy-peer-deps
```

## Running the Application

### Start Backend (Port 4000)
```bash
cd sprintify_backend/finalAPI
npm run dev
```

### Start Frontend (Port 5173)
```bash
cd sprintify_frontend
npm run dev
```

## API Endpoints Verified

### Authentication (`/user`)
- ✅ POST `/user/login`
- ✅ POST `/user/register`
- ✅ POST `/user/verify-email`
- ✅ POST `/user/forget-password`
- ✅ POST `/user/password-reset`
- ✅ GET `/user/search`

### Projects (`/project`)
- ✅ GET `/project` (list all projects)
- ✅ GET `/project/:id` (get project by ID) - **FIXED**
- ✅ POST `/project` (create project)
- ✅ PATCH `/project` (update project)
- ✅ DELETE `/project/:id` (delete project)

### Issues (`/:projectId/issues`)
- ✅ GET `/:projectId/issues` (list issues)
- ✅ GET `/:projectId/issues/:id` (get issue by ID)
- ✅ POST `/:projectId/issues` (create issue)
- ✅ PATCH `/:projectId/issues/:id` (update issue)
- ✅ DELETE `/:projectId/issues/:id` (delete issue)
- ✅ GET `/issues/:userId` (global issues by user)

### Sprints (`/:projectId/sprints`)
- ✅ GET `/:projectId/sprints` (list sprints)
- ✅ GET `/:projectId/sprints/:id` (get sprint by ID)
- ✅ POST `/:projectId/sprints` (create sprint)
- ✅ PATCH `/:projectId/sprints/:id` (update sprint)
- ✅ DELETE `/:projectId/sprints/:id` (delete sprint)
- ✅ GET `/:projectId/sprints/:sprintId/issues` (sprint issues)

### Board Columns (`/:projectId/board-columns`)
- ✅ GET `/:projectId/board-columns` (list columns)
- ✅ POST `/:projectId/board-columns` (create column)
- ✅ PATCH `/:projectId/board-columns` (update column)
- ✅ DELETE `/:projectId/board-columns/:id` (delete column)

### Epics (`/:projectId/epic`)
- ✅ GET `/:projectId/epic` (list epics)
- ✅ GET `/:projectId/epic/:id` (get epic by ID)
- ✅ GET `/:projectId/epic/key/:key` (get epic by key)
- ✅ POST `/:projectId/epic` (create epic)
- ✅ PATCH `/:projectId/epic/:id` (update epic)
- ✅ DELETE `/:projectId/epic/:id` (delete epic)

### Statuses (`/:projectId/status`)
- ✅ GET `/:projectId/status` (list statuses)
- ✅ POST `/:projectId/status` (create status)
- ✅ PATCH `/:projectId/status` (update status)
- ✅ DELETE `/:projectId/status/:id` (delete status)

### Notifications (`/notifications`)
- ✅ GET `/notifications` (list notifications)
- ✅ GET `/notifications/unread-count` (get unread count)
- ✅ GET `/notifications/:id` (get notification by ID) - **FIXED**
- ✅ PATCH `/notifications/:id/read` (mark as read)
- ✅ PATCH `/notifications/mark-all-read` (mark all as read)
- ✅ DELETE `/notifications/:id` (delete notification)

### Project Members (`/:projectId/members`)
- ✅ GET `/:projectId/members` (list members)
- ✅ POST `/:projectId/members` (add member)
- ✅ PATCH `/:projectId/members` (update member)
- ✅ DELETE `/:projectId/members/:membershipId` (remove member)

## Fixed Issues

1. **StatusRoutes Class Name**: Fixed incorrect class name `BoardColumnRoutes` to `StatusRoutes`
2. **Missing Project By ID**: Added `GET /project/:id` route and `ProjectController.findById` method
3. **Missing Notification By ID**: Added `GET /notifications/:id` route
4. **Build Errors**: Fixed notification utils build errors
5. **Route Configuration**: Verified all routes are properly configured with authentication and permissions

## Socket.IO Configuration

The backend includes Socket.IO support configured for real-time communication:
- WebSocket endpoint: `ws://localhost:4000`
- Supports authentication via JWT tokens
- CORS configured for frontend origins

## Testing

Once the database is set up, the application should work end-to-end with:
- User authentication and registration
- Project management
- Issue tracking
- Sprint planning
- Real-time notifications
- Board management

All frontend API calls now have corresponding backend routes implemented.