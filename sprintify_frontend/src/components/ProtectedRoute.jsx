import React from "react";
import { Navigate } from "react-router-dom";
import useAuthStore from "../store/authstore";

const ProtectedRoute = ({ children }) => {
  const { checkAuth } = useAuthStore((state) => state);

  const isAuthenticated = checkAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
