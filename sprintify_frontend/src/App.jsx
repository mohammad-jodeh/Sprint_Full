import "./App.css";
import { useEffect, lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ToastProvider } from "./components/ui/ToastProvider";
import ThemeProvider from "./components/ThemeProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import useAuthStore from "./store/authstore";
import useNotificationStore from "./store/notificationStore";
import socketService from "./services/socket";

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

// Layouts - loaded immediately (needed for all pages)
import DashboardLayout from "./components/layouts/DashboardLayout";
import ProjectLayout from "./components/layouts/ProjectLayout";

// Public Pages - lazy loaded
const Overview = lazy(() => import("./pages/Overview"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const ConfirmEmail = lazy(() => import("./pages/auth/ConfirmEmail"));
const VerifyEmailPending = lazy(() => import("./pages/auth/VerifyEmailPending"));
const BoardDemo = lazy(() => import("./pages/BoardDemo"));
const StatusFieldDemo = lazy(() => import("./components/demo/StatusFieldDemo"));

// Dashboard Pages - lazy loaded
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Projects = lazy(() => import("./pages/Projects"));
const Notifications = lazy(() => import("./pages/Notifications"));
const TasksPage = lazy(() => import("./pages/TasksPage"));

// Project Pages - lazy loaded
const BoardPage = lazy(() => import("./pages/project/BoardPage"));
const ProjectOverview = lazy(() => import("./pages/project/ProjectOverview"));
const Backlog = lazy(() => import("./pages/project/Backlog"));
const Sprintspage = lazy(() => import("./pages/project/Sprintspage"));
const Team = lazy(() => import("./pages/project/Team"));
const Settings = lazy(() => import("./pages/project/Settings"));
const Profile = lazy(() => import("./pages/Profile"));

function App() {
  const { isAuthenticated, token } = useAuthStore();
  const { initializeSocket, cleanupSocket } = useNotificationStore();
  useEffect(() => {
    if (isAuthenticated && token) {
      socketService.connect();
      initializeSocket();
    } else {
      socketService.disconnect();
      cleanupSocket();
    }

    return () => {
      socketService.disconnect();
      cleanupSocket();
    };
  }, [isAuthenticated, token, initializeSocket, cleanupSocket]);

  return (
    <ThemeProvider>
      <ToastProvider>
        <Toaster 
          position="top-right" 
          toastOptions={{
            style: { zIndex: 9999 },
          }}
          containerStyle={{ zIndex: 9999 }}
        />
        <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Overview />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email-pending" element={<VerifyEmailPending />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/confirm-email" element={<ConfirmEmail />} />
          <Route path="/board-demo" element={<BoardDemo />} />
          <Route path="/status-demo" element={<StatusFieldDemo />} />

          {/* Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="projects" element={<Projects />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>

          {/* Project-Specific Layout */}
          <Route
            path="projects/:projectId"
            element={
              <ProtectedRoute>
                <ProjectLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<ProjectOverview />} />
            <Route path="overview" element={<ProjectOverview />} />
            <Route path="board" element={<BoardPage />} />
            <Route path="backlog" element={<Backlog />} />
            <Route path="sprint" element={<Sprintspage />} />
            <Route path="team" element={<Team />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Standalone Profile Route */}
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Suspense>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
