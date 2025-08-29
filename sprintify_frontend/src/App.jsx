import "./App.css";
import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ThemeProvider from "./components/ThemeProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import useAuthStore from "./store/authstore";
import useNotificationStore from "./store/notificationStore";
import socketService from "./services/socket";

// Public Pages
import Overview from "./pages/Overview";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import ConfirmEmail from "./pages/auth/ConfirmEmail";
import BoardDemo from "./pages/BoardDemo";

// Dashboard Layout + Pages
import DashboardLayout from "./components/layouts/DashboardLayout";
import ProjectLayout from "./components/layouts/ProjectLayout";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Notifications from "./pages/Notifications";
import TasksPage from "./pages/TasksPage";
import BoardPage from "./pages/project/BoardPage";
import ProjectOverview from "./pages/project/ProjectOverview";
import Backlog from "./pages/project/Backlog";
import Sprintspage from "./pages/project/Sprintspage";
import Team from "./pages/project/Team";
import Settings from "./pages/project/Settings";
import Profile from "./pages/Profile"; // standalone

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

    // Cleanup on unmount
    return () => {
      socketService.disconnect();
      cleanupSocket();
    };
  }, [isAuthenticated, token, initializeSocket, cleanupSocket]);
  return (
    <ThemeProvider>
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            zIndex: 9999,
          },
        }}
        containerStyle={{
          zIndex: 9999,
        }}
      />
      <Routes>
        {" "}
        {/*  Public Routes */}
        <Route path="/" element={<Overview />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/confirm-email" element={<ConfirmEmail />} />
        <Route path="/board-demo" element={<BoardDemo />} />
        {/*  Dashboard Routes */}
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
        {/*  Project-Specific Layout */}
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
        </Route>{" "}
        {/*  Standalone Profile Route */}
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
